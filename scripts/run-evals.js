#!/usr/bin/env node
'use strict';

/**
 * run-evals.js — runner headless de los casos TC-NNN de `skills/<name>/evals/evals.json`.
 *
 * Reproduce el modo `evals` del skill `skill-test-evals` (Pasos E1–E6) sin sesión interactiva:
 * por cada caso construye el prompt de escenario y lo ejecuta mediante un runner de eval
 * (`claude` o `codex`) en modo solo lectura,
 * captura la salida y la califica con `expected.contains` / `not_contains` / `output_contains`
 * y `threshold`. Exit code 0 si todo pasa, 1 si algún caso falla — es lo que `story-implement`
 * (Pasos 5, 9b y 10) interpreta como rojo/verde a través de `verify.eval.command` en
 * `sddf.config.yaml`.
 *
 * Uso:
 *   node scripts/run-evals.js                    # skills con cambios locales vs HEAD en skills/<x>/
 *   node scripts/run-evals.js story-implement    # uno o varios nombres de skill
 *   node scripts/run-evals.js --all              # todos los skills con evals/evals.json
 *   node scripts/run-evals.js --changed-from <r> # skills modificados entre <r> y HEAD
 *
 * Flags:
 *   --only TC-023,TC-029   solo esos casos
 *   --eval-runner <name>   runner: claude o codex (default: claude; env SDDF_EVAL_RUNNER)
 *   --model <m>            modelo del runner elegido
 *   --concurrency N        casos en paralelo (default: 4)
 *   --timeout <s>          segundos por caso (default: 900)
 *   --report               guarda el informe en .tmp/skill-test-evals/<skill>/report-YYYYMMDD.md
 *   --skills-dir <dir>     directorio de skills fuente (default: skills/)
 *   --dry-run              imprime el prompt de cada caso sin ejecutar un runner
 */

const path = require('path');
const fs = require('fs');
const { spawn, execFileSync } = require('child_process');

const REPO_ROOT = path.join(__dirname, '..');
const END_MARKER = '=== END ===';
const SKILL_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CASE_ID_PATTERN = /^TC-\d{3,}$/;
const EVAL_RUNNERS = new Set(['claude', 'codex']);

// ---------------------------------------------------------------------------
// Rutas e identificadores no confiables
// ---------------------------------------------------------------------------

function resolveRoot(root, label = 'raíz') {
  if (typeof root !== 'string' || !root.trim()) {
    throw new Error(`❌ La ${label} debe ser una ruta no vacía.`);
  }
  return path.resolve(root);
}

function isAbsoluteOnAnySupportedPlatform(value) {
  return path.isAbsolute(value) || path.posix.isAbsolute(value) || path.win32.isAbsolute(value) || /^[a-zA-Z]:/.test(value);
}

/**
 * Resuelve una ruta hija sin permitir que sus segmentos abandonen `root`.
 * La comprobación es léxica deliberadamente: no resuelve symlinks/junctions.
 */
function resolveContainedPath(root, ...segments) {
  const resolvedRoot = resolveRoot(root);
  if (segments.length === 0) {
    throw new Error('❌ Una ruta contenida requiere al menos un segmento.');
  }

  const safeSegments = segments.map((segment) => {
    if (typeof segment !== 'string' || !segment.trim()) {
      throw new Error('❌ Un segmento de ruta debe ser no vacío.');
    }
    if (isAbsoluteOnAnySupportedPlatform(segment)) {
      throw new Error(`❌ No se permiten rutas absolutas: ${JSON.stringify(segment)}.`);
    }
    if (segment.split(/[\\/]+/).includes('..')) {
      throw new Error(`❌ La ruta no puede escapar de su raíz: ${JSON.stringify(segment)}.`);
    }
    return segment;
  });

  const resolvedPath = path.resolve(resolvedRoot, ...safeSegments);
  const relative = path.relative(resolvedRoot, resolvedPath);
  if (!relative || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`❌ La ruta resuelta debe permanecer dentro de su raíz: ${resolvedPath}.`);
  }
  return resolvedPath;
}

function validateSkillName(name) {
  if (typeof name !== 'string' || !SKILL_NAME_PATTERN.test(name)) {
    throw new Error(`❌ Nombre de skill inválido: ${JSON.stringify(name)}. Usa minúsculas, números y guiones simples.`);
  }
  return name;
}

function validateCaseId(id, source = 'manifest') {
  if (typeof id !== 'string' || !CASE_ID_PATTERN.test(id)) {
    throw new Error(`❌ ID de caso inválido en ${source}: ${JSON.stringify(id)}. Usa el formato TC-NNN (N ≥ 3 dígitos).`);
  }
  return id;
}

function validateEvalRunner(value, source = '--eval-runner') {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`❌ ${source} requiere uno de estos valores: claude, codex.`);
  }
  const runner = value.trim();
  if (!EVAL_RUNNERS.has(runner)) {
    throw new Error(`❌ Runner de eval no admitido en ${source}: ${JSON.stringify(value)}. Valores válidos: claude, codex.`);
  }
  return runner;
}

function defaultModelForRunner(evalRunner, env = process.env) {
  if (evalRunner === 'claude') return env.SDDF_EVAL_MODEL || 'sonnet';
  return env.SDDF_EVAL_CODEX_MODEL || null;
}

function resolveSkillsDir(repoRoot, skillsDir) {
  if (typeof skillsDir !== 'string' || !skillsDir.trim()) {
    throw new Error('❌ La opción --skills-dir requiere una ruta relativa no vacía contenida bajo repoRoot.');
  }
  return resolveContainedPath(repoRoot, skillsDir);
}

function resolveInjectedTmpRoot(repoRoot, runtime = {}) {
  if (Object.prototype.hasOwnProperty.call(runtime, 'tmpRoot')) {
    return resolveRoot(runtime.tmpRoot, 'tmpRoot inyectado');
  }
  return resolveContainedPath(repoRoot, '.tmp', 'skill-test-evals');
}

function skillFilePath(skillsDir, skillName, ...segments) {
  return resolveContainedPath(skillsDir, validateSkillName(skillName), ...segments);
}

const USAGE = `
Usage: node scripts/run-evals.js [skill ...] [options]

Sin selector ejecuta los evals de los skills con cambios locales respecto a HEAD.

Options:
  --all                 Ejecuta todos los skills que tienen evals/evals.json
  --changed-from <ref>  Ejecuta skills modificados entre <ref> y HEAD
  --only TC-001,TC-002  Ejecuta solo esos casos
  --eval-runner <name>  Runner de eval: claude o codex (default: claude; env SDDF_EVAL_RUNNER)
  --model <model>       Modelo del runner elegido (--model prevalece sobre variables de entorno)
  --concurrency <n>     Casos en paralelo (default: 4)
  --timeout <seconds>   Timeout por caso (default: 900)
  --report              Guarda el informe en .tmp/skill-test-evals/<skill>/report-YYYYMMDD.md
  --skills-dir <dir>    Directorio de skills fuente (default: skills)
  --dry-run             Muestra el prompt de cada caso sin invocar un runner
  -h, --help            Muestra esta ayuda

Claude usa sonnet por defecto (o SDDF_EVAL_MODEL). Codex usa su configuración local por defecto
(o SDDF_EVAL_CODEX_MODEL). --model prevalece sobre ambos valores.

Examples:
  npm run test:eval
  npm run test:eval -- story-implement
  npm run test:eval -- story-implement --eval-runner codex
  npm run test:eval -- --all --eval-runner claude
  npm run test:eval -- story-implement --only TC-023,TC-029 --report
  npm run test:eval -- --all --concurrency 2
  npm run test:eval -- --changed-from origin/main --dry-run
`;

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv, env = process.env) {
  const requestedHelp = argv.includes('-h') || argv.includes('--help');
  const opts = {
    skills: [],
    all: false,
    changedFrom: null,
    only: null,
    evalRunner: requestedHelp ? 'claude' : validateEvalRunner(env.SDDF_EVAL_RUNNER || 'claude', 'SDDF_EVAL_RUNNER'),
    evalRunnerExplicit: false,
    model: null,
    modelExplicit: false,
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
    else if (a === '--changed-from') {
      if (opts.changedFrom !== null) throw new Error('La opción --changed-from solo puede indicarse una vez.');
      opts.changedFrom = next().trim();
      if (!opts.changedFrom) throw new Error('La opción --changed-from requiere una referencia Git no vacía.');
    } else if (a === '--only') {
      if (opts.only !== null) throw new Error('La opción --only solo puede indicarse una vez.');
      const only = next().split(',').map((s) => s.trim()).filter(Boolean);
      if (only.length === 0) throw new Error('La opción --only requiere al menos un ID de caso.');
      opts.only = [...new Set(only.map((id) => validateCaseId(id, '--only')))];
    }
    else if (a === '--eval-runner') {
      if (opts.evalRunnerExplicit) throw new Error('La opción --eval-runner solo puede indicarse una vez.');
      opts.evalRunner = validateEvalRunner(next());
      opts.evalRunnerExplicit = true;
    } else if (a === '--model') {
      const model = next().trim();
      if (!model) throw new Error('La opción --model requiere un nombre de modelo no vacío.');
      opts.model = model;
      opts.modelExplicit = true;
    }
    else if (a === '--concurrency') opts.concurrency = Math.max(1, parseInt(next(), 10) || 1);
    else if (a === '--timeout') opts.timeout = Math.max(1, parseInt(next(), 10) || 900);
    else if (a === '--report') opts.report = true;
    else if (a === '--skills-dir') opts.skillsDir = next();
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a.startsWith('-')) throw new Error(`Opción desconocida: ${a}`);
    else opts.skills.push(a);
  }
  const selectors = [opts.skills.length > 0, opts.all, opts.changedFrom !== null].filter(Boolean).length;
  if (selectors > 1) {
    throw new Error('Los selectores de skills posicionales, --all y --changed-from son mutuamente excluyentes.');
  }
  if (!opts.modelExplicit) opts.model = defaultModelForRunner(opts.evalRunner, env);
  return opts;
}

// ---------------------------------------------------------------------------
// Paso E1 — Resolver skills
// ---------------------------------------------------------------------------

function listSkillsWithEvals(skillsDir) {
  if (!fs.existsSync(skillsDir)) return [];
  return fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter((d) => {
      if (!d.isDirectory()) return false;
      const name = validateSkillName(d.name);
      return fs.existsSync(skillFilePath(skillsDir, name, 'evals', 'evals.json'));
    })
    .map((d) => validateSkillName(d.name))
    .sort();
}

function gitOutput(args, runtime = {}) {
  const repoRoot = resolveRoot(runtime.repoRoot || REPO_ROOT, 'repoRoot');
  const execFile = runtime.execFileSync || execFileSync;
  return execFile('git', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function gitErrorDetail(err) {
  const detail = err && (err.stderr || err.message);
  return String(detail || 'sin detalle de Git').trim().split(/\r?\n/).pop();
}

function gitPathLines(output) {
  return String(output).split('\0').filter(Boolean);
}

function changedSkills(skillsDir, base = null, runtime = {}) {
  const repoRoot = resolveRoot(runtime.repoRoot || REPO_ROOT, 'repoRoot');
  const suppliedSkillsDir = resolveRoot(skillsDir, 'directorio de skills');
  const skillsDirRelative = path.relative(repoRoot, suppliedSkillsDir);
  const containedSkillsDir = resolveContainedPath(repoRoot, skillsDirRelative);
  const rel = path.relative(repoRoot, containedSkillsDir).split(path.sep).join('/');
  let lines;
  if (base !== null && base !== undefined) {
    const ref = String(base).trim();
    if (!ref) throw new Error('La opción --changed-from requiere una referencia Git no vacía.');

    let commit;
    try {
      // Primero se resuelve a SHA: el diff nunca recibe la entrada no confiable como opción.
      commit = gitOutput(['rev-parse', '--verify', '--end-of-options', `${ref}^{commit}`], runtime).trim();
    } catch (err) {
      throw new Error(
        `❌ La referencia Git '${ref}' no está disponible como commit.\n` +
        '   Proporciona una SHA o referencia presente localmente (en CI usa fetch-depth: 0), o ejecuta --all.\n' +
        `   Detalle: ${gitErrorDetail(err)}`,
      );
    }

    try {
      lines = gitPathLines(gitOutput(['diff', '--name-only', '-z', `${commit}...HEAD`, '--', rel], runtime));
    } catch (err) {
      throw new Error(
        `❌ No se pudieron comparar los cambios entre '${ref}' y HEAD.\n` +
        '   Verifica que ambas historias Git estén disponibles o ejecuta --all.\n' +
        `   Detalle: ${gitErrorDetail(err)}`,
      );
    }
  } else {
    try {
      const tracked = gitPathLines(gitOutput(['diff', '--name-only', '-z', 'HEAD', '--', rel], runtime));
      const untracked = gitPathLines(gitOutput(['ls-files', '--others', '--exclude-standard', '-z', '--', rel], runtime));
      lines = [...tracked, ...untracked];
    } catch (err) {
      throw new Error(
        '❌ No se pudieron resolver los cambios locales respecto a HEAD.\n' +
        '   Verifica que estás en un repositorio Git con HEAD disponible, o ejecuta --all.\n' +
        `   Detalle: ${gitErrorDetail(err)}`,
      );
    }
  }

  const names = new Set();
  const escapedRel = rel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  for (const raw of lines) {
    const line = raw.trim().replace(/\\/g, '/');
    if (!line) continue;
    const match = line.match(new RegExp(`^${escapedRel}/([^/]+)/`));
    if (match) names.add(validateSkillName(match[1]));
  }
  return [...names]
    .filter((name) => fs.existsSync(skillFilePath(containedSkillsDir, name, 'evals', 'evals.json')))
    .sort();
}

function resolveSkills(opts, runtime = {}) {
  const repoRoot = resolveRoot(runtime.repoRoot || REPO_ROOT, 'repoRoot');
  const skillsDir = resolveSkillsDir(repoRoot, opts.skillsDir);
  if (opts.all) return { skillsDir, names: listSkillsWithEvals(skillsDir), mode: 'all' };
  if (opts.skills.length > 0) {
    const names = opts.skills.map(validateSkillName);
    for (const name of names) {
      const evalsPath = skillFilePath(skillsDir, name, 'evals', 'evals.json');
      if (!fs.existsSync(skillFilePath(skillsDir, name, 'SKILL.md'))) {
        throw new Error(`❌ No se encontró el skill '${name}' en ${path.relative(repoRoot, skillsDir) || '.'}/\n   Verifica el nombre del skill y que existe en el directorio de skills.`);
      }
      if (!fs.existsSync(evalsPath)) {
        throw new Error(`❌ No se encontró evals/evals.json en ${path.relative(repoRoot, path.join(skillsDir, name))}.\n   Ejecuta /skill-test-evals ${name} primero para generar los casos de prueba.`);
      }
    }
    return { skillsDir, names: [...new Set(names)], mode: 'explicit' };
  }
  if (opts.changedFrom !== null) {
    return { skillsDir, names: changedSkills(skillsDir, opts.changedFrom, runtime), mode: 'changed-from' };
  }
  return { skillsDir, names: changedSkills(skillsDir, null, runtime), mode: 'local' };
}

// ---------------------------------------------------------------------------
// Paso E2 — Leer y validar evals.json
// ---------------------------------------------------------------------------

function loadCases(skillsDir, name, runtime = {}) {
  const repoRoot = resolveRoot(runtime.repoRoot || REPO_ROOT, 'repoRoot');
  const skillName = validateSkillName(name);
  const evalsPath = skillFilePath(skillsDir, skillName, 'evals', 'evals.json');
  let json;
  try {
    json = JSON.parse(fs.readFileSync(evalsPath, 'utf8'));
  } catch (err) {
    throw new Error(`❌ No se pudo leer ${path.relative(repoRoot, evalsPath)} como JSON válido.\n   Detalle: ${err.message}`);
  }
  if (Array.isArray(json) && json.length && json[0] && 'query' in json[0]) {
    throw new Error(
      `❌ Este evals.json usa formato trigger (array con query/should_trigger).\n` +
        `   skill-test-evals evals requiere el formato SDDF con cases[].\n` +
      `   Ejecuta /skill-test-evals ${skillName} para generar los evals correctos.`
    );
  }
  if (!json || !Array.isArray(json.cases)) {
    throw new Error(`❌ El manifest ${path.relative(repoRoot, evalsPath)} no tiene la clave cases[] (formato SDDF).`);
  }
  if (json.cases.length === 0) {
    throw new Error(`⚠️ evals.json no contiene casos en cases[].\n   Añade al menos TC-001 antes de verificar.`);
  }
  const seenIds = new Set();
  for (const testCase of json.cases) {
    if (!testCase || typeof testCase !== 'object') {
      throw new Error(`❌ ${path.relative(repoRoot, evalsPath)} contiene un caso inválido.`);
    }
    const id = validateCaseId(testCase.id, path.relative(repoRoot, evalsPath));
    if (seenIds.has(id)) {
      throw new Error(`❌ ${path.relative(repoRoot, evalsPath)} contiene el ID duplicado ${id}.`);
    }
    seenIds.add(id);
  }
  return { evalsPath, cases: json.cases };
}

// ---------------------------------------------------------------------------
// Paso E2b — Construir el plan de ejecución
// ---------------------------------------------------------------------------

function buildExecutionPlan(opts, runtime = {}) {
  const { skillsDir, names, mode } = resolveSkills(opts, runtime);
  if (names.length === 0) {
    const scope = mode === 'changed-from'
      ? `entre '${opts.changedFrom}' y HEAD`
      : mode === 'all'
        ? `en ${opts.skillsDir}/`
        : 'en los cambios locales respecto a HEAD';
    throw new Error(
      `❌ No se seleccionó ningún skill evaluable ${scope}.\n` +
      'Selecciona un skill, usa --all o revisa la referencia/rango de Git.',
    );
  }

  // Cargar todo antes de ejecutar el primer caso evita resultados parciales de una selección inválida.
  const manifests = names.map((name) => {
    const skillMd = skillFilePath(skillsDir, name, 'SKILL.md');
    if (!fs.existsSync(skillMd)) {
      throw new Error(`❌ No se encontró el contrato SKILL.md para '${name}' en ${path.relative(path.resolve(runtime.repoRoot || REPO_ROOT), skillsDir)}.`);
    }
    return { name, ...loadCases(skillsDir, name, runtime) };
  });
  if (opts.only) {
    const onlyIds = opts.only.map((id) => validateCaseId(id, '--only'));
    const availableIds = new Set(manifests.flatMap((manifest) => manifest.cases.map((testCase) => testCase.id)));
    const missing = onlyIds.filter((id) => !availableIds.has(id));
    if (missing.length > 0) {
      throw new Error(
        `❌ Los casos solicitados no existen en los skills seleccionados: ${missing.join(', ')}.\n` +
        'Revisa --only o elimina los IDs que no correspondan al alcance seleccionado.',
      );
    }
  }

  const skills = manifests
    .map((manifest) => ({
      ...manifest,
      skillsDir,
      cases: opts.only ? manifest.cases.filter((testCase) => opts.only.includes(testCase.id)) : manifest.cases,
    }))
    .filter((manifest) => manifest.cases.length > 0);
  const totalCases = skills.reduce((total, skill) => total + skill.cases.length, 0);
  if (totalCases === 0) {
    throw new Error(
      '❌ La selección final no contiene casos de evaluación.\n' +
      'Revisa los IDs de --only, los manifests seleccionados o usa --all.',
    );
  }

  return { skillsDir, mode, skills, totalCases };
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
// Paso E3b — Invocar el runner de eval en modo de solo lectura
// ---------------------------------------------------------------------------

function buildClaudeArgs(prompt, opts) {
  return [
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
}

function buildCodexArgs(opts, outputFile) {
  const args = [
    'exec',
    '--sandbox',
    'read-only',
    '--ephemeral',
    '--color',
    'never',
    '--output-last-message',
    outputFile,
  ];
  if (opts.model) args.push('--model', opts.model);
  args.push('-');
  return args;
}

function resolveCodexOutputFile(repoRoot, runtime = {}) {
  if (!Object.prototype.hasOwnProperty.call(runtime, 'codexOutputFile')) {
    throw new Error('❌ Falta el archivo temporal para capturar la respuesta final de Codex.');
  }
  const tmpRoot = resolveInjectedTmpRoot(repoRoot, runtime);
  const outputFile = resolveRoot(runtime.codexOutputFile, 'archivo temporal de Codex');
  const relative = path.relative(tmpRoot, outputFile);
  if (!relative || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error('❌ El archivo temporal de Codex debe quedar contenido bajo .tmp/skill-test-evals.');
  }
  return outputFile;
}

function runProcess(command, args, opts, runtime = {}, input) {
  const repoRoot = resolveRoot(runtime.repoRoot || REPO_ROOT, 'repoRoot');
  const spawnFn = runtime.spawn || spawn;
  const env = runtime.env || process.env;
  return new Promise((resolve) => {
    const started = Date.now();
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    let inputFailed = false;
    let timer = null;
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      resolve(result);
    };

    let child;
    try {
      child = spawnFn(command, args, {
        cwd: repoRoot,
        env,
        stdio: input === undefined ? ['ignore', 'pipe', 'pipe'] : ['pipe', 'pipe', 'pipe'],
      });
    } catch (err) {
      finish({ ok: false, code: null, stdout, stderr: err.message, durationMs: Date.now() - started, timedOut });
      return;
    }

    timer = setTimeout(() => {
      timedOut = true;
      try {
        child.kill();
      } catch (err) {
        stderr += `\n${err.message}`;
      }
    }, opts.timeout * 1000);

    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => (stderr += d));
    child.on('error', (err) => {
      finish({ ok: false, code: null, stdout, stderr: `${stderr}\n${err.message}`, durationMs: Date.now() - started, timedOut });
    });
    child.on('close', (code) => {
      finish({ ok: !timedOut && !inputFailed && code === 0, code, stdout, stderr, durationMs: Date.now() - started, timedOut });
    });

    if (input !== undefined) {
      if (!child.stdin || typeof child.stdin.end !== 'function') {
        finish({ ok: false, code: null, stdout, stderr: `${stderr}\nNo se pudo abrir stdin para ${command}.`, durationMs: Date.now() - started, timedOut });
        return;
      }
      if (typeof child.stdin.on === 'function') {
        child.stdin.on('error', (err) => {
          inputFailed = true;
          stderr += `\n${err.message}`;
        });
      }
      child.stdin.end(input);
    }
  });
}

function runClaude(prompt, opts, runtime = {}) {
  // Quitar CLAUDECODE permite anidar `claude -p` dentro de una sesión de Claude Code
  // (mismo patrón que skill-master/scripts/run_eval.py).
  const env = { ...(runtime.env || process.env) };
  delete env.CLAUDECODE;
  return runProcess('claude', buildClaudeArgs(prompt, opts), opts, { ...runtime, env });
}

function runCodex(prompt, opts, runtime = {}) {
  const repoRoot = resolveRoot(runtime.repoRoot || REPO_ROOT, 'repoRoot');
  const outputFile = resolveCodexOutputFile(repoRoot, runtime);
  try {
    fs.rmSync(outputFile, { force: true });
  } catch (err) {
    return Promise.resolve({
      ok: false,
      code: null,
      stdout: '',
      stderr: `No se pudo preparar el archivo temporal de Codex: ${err.message}`,
      durationMs: 0,
      timedOut: false,
    });
  }

  return runProcess('codex', buildCodexArgs(opts, outputFile), opts, runtime, prompt).then((run) => {
    if (!run.ok) return run;
    try {
      const stdout = fs.readFileSync(outputFile, 'utf8');
      if (!stdout.trim()) {
        return { ...run, ok: false, stderr: `${run.stderr}\nCodex terminó sin una respuesta final.`.trim() };
      }
      return { ...run, stdout };
    } catch (err) {
      return {
        ...run,
        ok: false,
        stderr: `${run.stderr}\nNo se pudo leer la respuesta final de Codex: ${err.message}`.trim(),
      };
    }
  });
}

function runEvalRunner(prompt, opts, runtime = {}) {
  const evalRunner = validateEvalRunner(opts.evalRunner);
  if (evalRunner === 'claude') return (runtime.runClaude || runClaude)(prompt, opts, runtime);
  return (runtime.runCodex || runCodex)(prompt, opts, runtime);
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

async function runSkill(planSkill, opts, runtime = {}) {
  const { cases, skillsDir } = planSkill;
  const skillName = validateSkillName(planSkill.name);
  const repoRoot = resolveRoot(runtime.repoRoot || REPO_ROOT, 'repoRoot');
  const tmpRoot = resolveInjectedTmpRoot(repoRoot, runtime);
  const log = runtime.log || console.log;
  const write = runtime.write || process.stdout.write.bind(process.stdout);
  const skillMdRel = path.relative(repoRoot, skillFilePath(skillsDir, skillName, 'SKILL.md')).split(path.sep).join('/');
  const runsDir = resolveContainedPath(tmpRoot, skillName, 'runs');
  if (!opts.dryRun) fs.mkdirSync(runsDir, { recursive: true });

  log(`\n[INFO] ${cases.length} caso(s) encontrados en ${skillName}/evals/evals.json`);

  const results = await runPool(cases, opts.concurrency, async (tc) => {
    const testCaseId = validateCaseId(tc.id, `skill ${skillName}`);
    const prompt = buildPrompt(skillName, skillMdRel, tc);
    if (opts.dryRun) {
      log(`\n----- ${tc.id} (${tc.name}) — prompt -----\n${prompt}\n`);
      return { tc, status: 'DRY', grade: null, durationMs: 0 };
    }
    write(`[${tc.id}] ejecutando…\n`);
    const outputFile = resolveContainedPath(runsDir, `${testCaseId}.txt`);
    const run = await runEvalRunner(prompt, opts, { ...runtime, codexOutputFile: outputFile });
    fs.writeFileSync(outputFile, run.stdout);
    if (run.stderr && run.stderr.trim()) {
      fs.writeFileSync(resolveContainedPath(runsDir, `${testCaseId}.stderr.txt`), run.stderr);
    }

    if (!run.ok) {
      const exit = typeof run.code === 'number' ? `exit ${run.code}` : 'no pudo iniciarse';
      const reason = run.timedOut
        ? `${opts.evalRunner} timeout tras ${opts.timeout}s`
        : `${opts.evalRunner} ${exit}: ${run.stderr.trim().split('\n').pop() || 'sin salida'}`;
      log(`[${tc.id}] ❌ ERROR — ${reason}`);
      return { tc, status: 'ERROR', grade: null, reason, durationMs: run.durationMs };
    }
    const grade = gradeOutput(tc, run.stdout);
    log(`[${tc.id}] ${grade.pass ? '✅ PASS' : '❌ FAIL'} (${(run.durationMs / 1000).toFixed(0)}s)`);
    return { tc, status: grade.pass ? 'PASS' : 'FAIL', grade, durationMs: run.durationMs };
  });

  return { skillName, results };
}

// ---------------------------------------------------------------------------
// Paso E5/E6 — Informe
// ---------------------------------------------------------------------------

function renderReport(skillName, results, opts = {}) {
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
      `**Ejecutor:** ${opts.evalRunner || 'claude'}${opts.model ? ` | **Modelo:** ${opts.model}` : ''}`,
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

async function main(argv = process.argv.slice(2), runtime = {}) {
  let repoRoot;
  let tmpRoot;
  const log = runtime.log || console.log;
  const error = runtime.error || console.error;
  let opts;
  try {
    repoRoot = resolveRoot(runtime.repoRoot || REPO_ROOT, 'repoRoot');
    tmpRoot = resolveInjectedTmpRoot(repoRoot, runtime);
    opts = parseArgs(argv);
  } catch (err) {
    error(err.message);
    log(USAGE);
    return 1;
  }
  if (opts.help) {
    log(USAGE);
    return 0;
  }

  let executionPlan;
  try {
    executionPlan = buildExecutionPlan(opts, { ...runtime, repoRoot });
  } catch (err) {
    error(err.message);
    return 1;
  }

  log(`[INFO] Skills a evaluar: ${executionPlan.skills.map((skill) => skill.name).join(', ')}`);
  log(`[INFO] Plan de selección: ${executionPlan.totalCases} caso(s) en ${executionPlan.skills.length} skill(s)`);
  for (const skill of executionPlan.skills) {
    log(`[INFO]   ${skill.name}: ${skill.cases.length} caso(s)`);
  }
  log(`[INFO] Ejecutor de eval: ${opts.evalRunner} · modelo: ${opts.model || 'predeterminado del runner'} · concurrencia: ${opts.concurrency} · timeout: ${opts.timeout}s${opts.dryRun ? ' · dry-run' : ''}`);

  let anyFailure = false;
  for (const skill of executionPlan.skills) {
    let outcome;
    try {
      outcome = await runSkill(skill, opts, { ...runtime, repoRoot, tmpRoot });
    } catch (err) {
      error(err.message);
      anyFailure = true;
      continue;
    }
    if (opts.dryRun) continue;

    const report = renderReport(skill.name, outcome.results, opts);
    log(`\n${report.markdown}`);
    if (opts.report) {
      const dir = resolveContainedPath(tmpRoot, validateSkillName(skill.name));
      fs.mkdirSync(dir, { recursive: true });
      const file = resolveContainedPath(dir, `report-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.md`);
      fs.writeFileSync(file, report.markdown);
      log(`📄 Informe guardado en: ${path.relative(repoRoot, file).split(path.sep).join('/')}`);
    }
    if (report.failed > 0) anyFailure = true;
  }

  return anyFailure ? 1 : 0;
}

if (require.main === module) {
  main().then((code) => {
    process.exitCode = code;
  }).catch((err) => {
    console.error('run-evals failed:', err.message);
    process.exitCode = 1;
  });
}

module.exports = {
  resolveContainedPath,
  parseArgs,
  buildClaudeArgs,
  buildCodexArgs,
  runCodex,
  changedSkills,
  resolveSkills,
  loadCases,
  buildExecutionPlan,
  buildPrompt,
  gradeOutput,
  renderReport,
  main,
};
