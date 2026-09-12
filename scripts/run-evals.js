#!/usr/bin/env node
'use strict';

/**
 * run-evals.js — runner headless de los casos TC-NNN de `skills/<name>/evals/evals.json`.
 *
 * Reproduce el modo `evals` del skill `skill-test-evals` (Pasos E1–E6) sin sesión interactiva:
 * por cada caso construye el prompt de escenario, ejecuta `claude -p` en modo solo lectura,
 * captura la salida y la califica con `expected.contains` / `not_contains` / `output_contains`
 * y `threshold`. Exit code 0 si todo pasa, 1 si algún caso falla — es lo que `story-implement`
 * (Pasos 5, 9b y 10) interpreta como rojo/verde a través de `verify.eval.command` en
 * `sddf.config.yaml`.
 *
 * Uso:
 *   node scripts/run-evals.js                    # skills con cambios vs HEAD (git) en skills/<x>/
 *   node scripts/run-evals.js story-implement    # uno o varios nombres de skill
 *   node scripts/run-evals.js --all              # todos los skills con evals/evals.json
 *
 * Flags:
 *   --only TC-023,TC-029   solo esos casos
 *   --model <m>            modelo para `claude -p` (default: sonnet; env SDDF_EVAL_MODEL)
 *   --concurrency N        casos en paralelo (default: 4)
 *   --timeout <s>          segundos por caso (default: 900)
 *   --report               guarda el informe en .tmp/skill-test-evals/<skill>/report-YYYYMMDD.md
 *   --skills-dir <dir>     directorio de skills fuente (default: skills/)
 *   --dry-run              imprime el prompt de cada caso sin ejecutar `claude`
 */

const path = require('path');
const fs = require('fs');
const { spawn, execSync } = require('child_process');

const REPO_ROOT = path.join(__dirname, '..');
const TMP_ROOT = path.join(REPO_ROOT, '.tmp', 'skill-test-evals');
const END_MARKER = '=== END ===';

const USAGE = `
Usage: node scripts/run-evals.js [skill ...] [options]

Sin argumentos ejecuta los evals de los skills con cambios respecto a HEAD (git).

Options:
  --all                 Ejecuta todos los skills que tienen evals/evals.json
  --only TC-001,TC-002  Ejecuta solo esos casos
  --model <model>       Modelo para claude -p (default: sonnet; env SDDF_EVAL_MODEL)
  --concurrency <n>     Casos en paralelo (default: 4)
  --timeout <seconds>   Timeout por caso (default: 900)
  --report              Guarda el informe en .tmp/skill-test-evals/<skill>/report-YYYYMMDD.md
  --skills-dir <dir>    Directorio de skills fuente (default: skills)
  --dry-run             Muestra el prompt de cada caso sin invocar claude
  -h, --help            Muestra esta ayuda

Examples:
  npm run test:eval
  npm run test:eval -- story-implement
  npm run test:eval -- story-implement --only TC-023,TC-029 --report
  npm run test:eval -- --all --concurrency 2
`;

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const opts = {
    skills: [],
    all: false,
    only: null,
    model: process.env.SDDF_EVAL_MODEL || 'sonnet',
    concurrency: 4,
    timeout: 900,
    report: false,
    skillsDir: 'skills',
    dryRun: false,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => {
      const v = argv[++i];
      if (v === undefined) throw new Error(`Falta valor para ${a}`);
      return v;
    };
    if (a === '-h' || a === '--help') opts.help = true;
    else if (a === '--all') opts.all = true;
    else if (a === '--only') opts.only = next().split(',').map((s) => s.trim()).filter(Boolean);
    else if (a === '--model') opts.model = next();
    else if (a === '--concurrency') opts.concurrency = Math.max(1, parseInt(next(), 10) || 1);
    else if (a === '--timeout') opts.timeout = Math.max(1, parseInt(next(), 10) || 900);
    else if (a === '--report') opts.report = true;
    else if (a === '--skills-dir') opts.skillsDir = next();
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a.startsWith('-')) throw new Error(`Opción desconocida: ${a}`);
    else opts.skills.push(a);
  }
  return opts;
}

// ---------------------------------------------------------------------------
// Paso E1 — Resolver skills
// ---------------------------------------------------------------------------

function listSkillsWithEvals(skillsDir) {
  if (!fs.existsSync(skillsDir)) return [];
  return fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(skillsDir, d.name, 'evals', 'evals.json')))
    .map((d) => d.name)
    .sort();
}

function changedSkills(skillsDir) {
  const rel = path.relative(REPO_ROOT, skillsDir).split(path.sep).join('/');
  const lines = [];
  const run = (cmd) => {
    try {
      lines.push(...execSync(cmd, { cwd: REPO_ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).split(/\r?\n/));
    } catch (_) {
      /* sin git o sin repositorio: se ignora */
    }
  };
  run(`git status --porcelain -- "${rel}"`);
  run(`git diff --name-only HEAD -- "${rel}"`);
  const names = new Set();
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    // `git status --porcelain` antepone "XY " a la ruta; `git diff --name-only` no.
    const file = line.replace(/^[ MADRCU?!]{1,2}\s+/, '').replace(/^"|"$/g, '');
    const m = file.match(new RegExp(`^${rel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/([^/]+)/`));
    if (m) names.add(m[1]);
  }
  return [...names].filter((n) => fs.existsSync(path.join(skillsDir, n, 'evals', 'evals.json'))).sort();
}

function resolveSkills(opts) {
  const skillsDir = path.resolve(REPO_ROOT, opts.skillsDir);
  if (opts.all) return { skillsDir, names: listSkillsWithEvals(skillsDir) };
  if (opts.skills.length > 0) {
    for (const name of opts.skills) {
      const evalsPath = path.join(skillsDir, name, 'evals', 'evals.json');
      if (!fs.existsSync(path.join(skillsDir, name, 'SKILL.md'))) {
        throw new Error(`❌ No se encontró el skill '${name}' en ${path.relative(REPO_ROOT, skillsDir) || '.'}/\n   Verifica el nombre del skill y que existe en el directorio de skills.`);
      }
      if (!fs.existsSync(evalsPath)) {
        throw new Error(`❌ No se encontró evals/evals.json en ${path.relative(REPO_ROOT, path.join(skillsDir, name))}.\n   Ejecuta /skill-test-evals ${name} primero para generar los casos de prueba.`);
      }
    }
    return { skillsDir, names: opts.skills };
  }
  return { skillsDir, names: changedSkills(skillsDir) };
}

// ---------------------------------------------------------------------------
// Paso E2 — Leer y validar evals.json
// ---------------------------------------------------------------------------

function loadCases(skillsDir, name, only) {
  const evalsPath = path.join(skillsDir, name, 'evals', 'evals.json');
  const json = JSON.parse(fs.readFileSync(evalsPath, 'utf8'));
  if (Array.isArray(json) && json.length && json[0] && 'query' in json[0]) {
    throw new Error(
      `❌ Este evals.json usa formato trigger (array con query/should_trigger).\n` +
        `   skill-test-evals evals requiere el formato SDDF con cases[].\n` +
        `   Ejecuta /skill-test-evals ${name} para generar los evals correctos.`
    );
  }
  if (!Array.isArray(json.cases)) {
    throw new Error(`❌ ${path.relative(REPO_ROOT, evalsPath)} no tiene la clave cases[] (formato SDDF).`);
  }
  if (json.cases.length === 0) {
    throw new Error(`⚠️ evals.json no contiene casos en cases[].\n   Añade al menos TC-001 antes de verificar.`);
  }
  let cases = json.cases;
  if (only) {
    cases = cases.filter((c) => only.includes(c.id));
    const missing = only.filter((id) => !json.cases.some((c) => c.id === id));
    if (missing.length) console.warn(`[WARN] Casos no encontrados en ${name}: ${missing.join(', ')}`);
  }
  return { evalsPath, cases };
}

// ---------------------------------------------------------------------------
// Paso E3a — Prompt de escenario
// ---------------------------------------------------------------------------

function buildPrompt(skillName, skillMdRel, testCase) {
  const input = testCase.input === undefined ? {} : testCase.input;
  return [
    `Eres un ejecutor de evals (protocolo E3 de \`skill-test-evals\`). Debes SIMULAR en seco la ejecución del skill \`${skillName}\` sobre un escenario de prueba y reportar EXACTAMENTE qué emitiría.`,
    ``,
    `Reglas estrictas:`,
    `- Lee íntegro \`${skillMdRel}\` (si es largo, léelo en tramos con offset/limit hasta el final). Es el único contrato: sigue sus pasos en orden literal y copia sus mensajes tal cual, sustituyendo las plantillas \`{...}\` con los valores del escenario. Si el skill invoca \`skill-preflight\` u otros skills, asume que responden con éxito salvo que el escenario diga lo contrario.`,
    `- El bloque "Condiciones de entrada" define el mundo simulado: estado de los artefactos, configuración, resultados que devuelve cada subagente o comando, respuestas del usuario a cada pausa (si no se especifica una respuesta, asume la opción por defecto/afirmativa). No inventes condiciones que el escenario no describa; si falta un dato, aplica el comportamiento por defecto documentado en el SKILL.md.`,
    `- NO modifiques ningún archivo del repositorio, NO ejecutes comandos de escritura y NO lances subagentes. Solo lee y razona.`,
    `- No mires la sección "expected" de ningún caso: emite lo que dicta el SKILL.md dado el escenario.`,
    ``,
    `Escenario de prueba (${testCase.id} — ${testCase.name || ''}):`,
    testCase.description || '(sin descripción)',
    ``,
    `Condiciones de entrada (JSON):`,
    '```json',
    JSON.stringify(input, null, 2),
    '```',
    ``,
    `Formato de respuesta (obligatorio, sin texto adicional antes ni después):`,
    `=== CONSOLE ===`,
    `<todas las líneas que el skill mostraría al usuario, en orden y tal cual, incluidas las preguntas de pausa y las respuestas simuladas del usuario en una línea "> s" / "> n">`,
    `=== FILE: <ruta relativa> ===`,
    `<contenido exacto de cada archivo que el skill escribiría o modificaría (un bloque FILE por archivo; omite los que no llega a escribir)>`,
    `${END_MARKER}`,
    ``,
    `Sé literal y completo con los mensajes; no resumas ni parafrasees. Cualquier nota o explicación va DESPUÉS de "${END_MARKER}".`,
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Paso E3b — Invocar claude -p
// ---------------------------------------------------------------------------

function runClaude(prompt, opts) {
  return new Promise((resolve) => {
    const args = [
      '-p',
      prompt,
      '--model',
      opts.model,
      '--output-format',
      'text',
      '--permission-mode',
      'plan',
      '--allowedTools',
      'Read,Glob,Grep',
    ];
    // Quitar CLAUDECODE permite anidar `claude -p` dentro de una sesión de Claude Code
    // (mismo patrón que skill-master/scripts/run_eval.py).
    const env = { ...process.env };
    delete env.CLAUDECODE;

    const started = Date.now();
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    const child = spawn('claude', args, { cwd: REPO_ROOT, env, stdio: ['ignore', 'pipe', 'pipe'] });
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill();
    }, opts.timeout * 1000);

    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => (stderr += d));
    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({ ok: false, stdout, stderr: `${stderr}\n${err.message}`, durationMs: Date.now() - started, timedOut });
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ ok: !timedOut && code === 0, code, stdout, stderr, durationMs: Date.now() - started, timedOut });
    });
  });
}

// ---------------------------------------------------------------------------
// Paso E3c/E3d — Calificar
// ---------------------------------------------------------------------------

function gradeOutput(testCase, rawOutput) {
  let out = rawOutput;
  const end = out.indexOf(END_MARKER);
  if (end >= 0) out = out.slice(0, end);

  const expected = testCase.expected || {};
  const contains = [...(expected.contains || []), ...(expected.output_contains || [])];
  const notContains = expected.not_contains || [];
  const missing = contains.filter((s) => !out.includes(s));
  const violated = notContains.filter((s) => out.includes(s));
  const total = contains.length;
  const found = total - missing.length;
  const ratio = total === 0 ? 1 : found / total;
  const threshold = typeof testCase.threshold === 'number' ? testCase.threshold : 1.0;
  const pass = (threshold >= 1 ? missing.length === 0 : ratio >= threshold) && violated.length === 0;
  return { pass, missing, violated, found, total, ratio, threshold, evidence: out.slice(0, 300) };
}

// ---------------------------------------------------------------------------
// Ejecución con pool de concurrencia
// ---------------------------------------------------------------------------

async function runPool(items, concurrency, worker) {
  const results = new Array(items.length);
  let next = 0;
  async function lane() {
    while (next < items.length) {
      const idx = next++;
      results[idx] = await worker(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, lane));
  return results;
}

async function runSkill(skillName, skillsDir, opts) {
  const { cases } = loadCases(skillsDir, skillName, opts.only);
  const skillMdRel = path.relative(REPO_ROOT, path.join(skillsDir, skillName, 'SKILL.md')).split(path.sep).join('/');
  const runsDir = path.join(TMP_ROOT, skillName, 'runs');
  if (!opts.dryRun) fs.mkdirSync(runsDir, { recursive: true });

  console.log(`\n[INFO] ${cases.length} caso(s) encontrados en ${skillName}/evals/evals.json`);

  const results = await runPool(cases, opts.concurrency, async (tc) => {
    const prompt = buildPrompt(skillName, skillMdRel, tc);
    if (opts.dryRun) {
      console.log(`\n----- ${tc.id} (${tc.name}) — prompt -----\n${prompt}\n`);
      return { tc, status: 'DRY', grade: null, durationMs: 0 };
    }
    process.stdout.write(`[${tc.id}] ejecutando…\n`);
    const run = await runClaude(prompt, opts);
    fs.writeFileSync(path.join(runsDir, `${tc.id}.txt`), run.stdout);
    if (run.stderr && run.stderr.trim()) fs.writeFileSync(path.join(runsDir, `${tc.id}.stderr.txt`), run.stderr);

    if (!run.ok && !run.stdout.trim()) {
      const reason = run.timedOut ? `timeout tras ${opts.timeout}s` : `claude exit ${run.code}: ${run.stderr.trim().split('\n').pop() || 'sin salida'}`;
      console.log(`[${tc.id}] ❌ ERROR — ${reason}`);
      return { tc, status: 'ERROR', grade: null, reason, durationMs: run.durationMs };
    }
    const grade = gradeOutput(tc, run.stdout);
    console.log(`[${tc.id}] ${grade.pass ? '✅ PASS' : '❌ FAIL'} (${(run.durationMs / 1000).toFixed(0)}s)`);
    return { tc, status: grade.pass ? 'PASS' : 'FAIL', grade, durationMs: run.durationMs };
  });

  return { skillName, results };
}

// ---------------------------------------------------------------------------
// Paso E5/E6 — Informe
// ---------------------------------------------------------------------------

function renderReport(skillName, results) {
  const total = results.length;
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = total - passed;
  const passRate = total === 0 ? 0 : Math.round((passed / total) * 1000) / 10;

  const rows = results
    .map((r) => {
      const { tc, grade } = r;
      const thr = typeof tc.threshold === 'number' ? tc.threshold : 1.0;
      let notes = '—';
      if (r.status === 'ERROR') notes = r.reason;
      else if (grade && !grade.pass) {
        notes = [
          grade.missing.length ? `missing: ${grade.missing.map((s) => JSON.stringify(s)).join(', ')}` : '',
          grade.violated.length ? `violated: ${grade.violated.map((s) => JSON.stringify(s)).join(', ')}` : '',
        ]
          .filter(Boolean)
          .join(' · ');
      }
      const state = r.status === 'PASS' ? '✅ PASS' : r.status === 'ERROR' ? '❌ ERROR' : '❌ FAIL';
      return `| ${tc.id} | ${tc.name || ''} | ${tc.type || ''} | ${thr} | ${state} | ${notes.replace(/\|/g, '\\|')} |`;
    })
    .join('\n');

  const failureDetails = results
    .filter((r) => r.status !== 'PASS')
    .map((r) => {
      const g = r.grade;
      const lines = [`### ❌ ${r.tc.id} — ${r.tc.name || ''}`, ''];
      if (r.status === 'ERROR') lines.push(`**Error:** ${r.reason}`);
      else {
        lines.push(`**Missing contains:** ${g.missing.length ? g.missing.map((s) => JSON.stringify(s)).join(', ') : '—'}`);
        lines.push(`**Violated not_contains:** ${g.violated.length ? g.violated.map((s) => JSON.stringify(s)).join(', ') : '—'}`);
        lines.push(`**Evidencia (primeros 300 chars):**`);
        lines.push(`> ${g.evidence.replace(/\r?\n/g, '\n> ')}`);
      }
      return lines.join('\n');
    })
    .join('\n\n');

  const summary =
    failed === 0
      ? `✅ Todos los ${total} casos pasaron. El skill está listo.`
      : `⚠️ Pass rate: ${passRate}%. Considera ejecutar /skill-master build para mejorar el skill.`;

  const date = new Date().toISOString().slice(0, 10);
  return {
    passed,
    failed,
    total,
    passRate,
    markdown: [
      `# Eval Report: ${skillName}`,
      ``,
      `**Fecha:** ${date} | **Total:** ${total} | ✅ Passed: ${passed} | ❌ Failed: ${failed} | **Pass rate:** ${passRate}%`,
      ``,
      `| ID | Nombre | Tipo | Threshold | Estado | Notas |`,
      `|---|---|---|---|---|---|`,
      rows,
      ``,
      failureDetails,
      ``,
      `---`,
      summary,
      ``,
    ].join('\n'),
  };
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

async function main() {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(err.message);
    console.log(USAGE);
    process.exit(1);
  }
  if (opts.help) {
    console.log(USAGE);
    process.exit(0);
  }

  let resolved;
  try {
    resolved = resolveSkills(opts);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
  const { skillsDir, names } = resolved;

  if (names.length === 0) {
    if (opts.all) console.log(`[INFO] No hay skills con evals/evals.json en ${opts.skillsDir}/`);
    else console.log('[INFO] Sin skills cambiados respecto a HEAD — nada que ejecutar. Usa `-- <skill>` o `-- --all`.');
    process.exit(0);
  }

  console.log(`[INFO] Skills a evaluar: ${names.join(', ')}`);
  console.log(`[INFO] Modelo: ${opts.model} · concurrencia: ${opts.concurrency} · timeout: ${opts.timeout}s${opts.dryRun ? ' · dry-run' : ''}`);

  let anyFailure = false;
  for (const name of names) {
    let outcome;
    try {
      outcome = await runSkill(name, skillsDir, opts);
    } catch (err) {
      console.error(err.message);
      anyFailure = true;
      continue;
    }
    if (opts.dryRun) continue;

    const report = renderReport(name, outcome.results);
    console.log(`\n${report.markdown}`);
    if (opts.report) {
      const dir = path.join(TMP_ROOT, name);
      fs.mkdirSync(dir, { recursive: true });
      const file = path.join(dir, `report-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.md`);
      fs.writeFileSync(file, report.markdown);
      console.log(`📄 Informe guardado en: ${path.relative(REPO_ROOT, file).split(path.sep).join('/')}`);
    }
    if (report.failed > 0) anyFailure = true;
  }

  process.exit(anyFailure ? 1 : 0);
}

if (require.main === module) {
  main().catch((err) => {
    console.error('run-evals failed:', err.message);
    process.exit(1);
  });
}

module.exports = { parseArgs, changedSkills, buildPrompt, gradeOutput, renderReport };
