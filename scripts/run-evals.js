#!/usr/bin/env node
'use strict';

/**
 * run-evals.js — runner headless de los casos TC-NNN de `skills/<name>/evals/evals.json`.
 *
 * Reproduce el modo `evals` del skill `skill-test-evals` (Pasos E1–E6) sin sesión interactiva:
 * por cada caso construye el prompt de escenario y lo ejecuta mediante un runner de eval
 * (`claude`, `codex` u `opencode`) en modo solo lectura,
 * captura la salida y la califica con `expected.contains` / `not_contains` / `output_contains`
 * y `threshold`. Un caso con `sandbox` (opt-in) se ejecuta de verdad sobre una copia desechable
 * del fixture en `.tmp/skill-test-evals/<skill>/sandbox/<TC>/`, con escritura confinada a ese
 * directorio, y además se califica el árbol antes/después con `expected.files`. El sandbox es su
 * propia raíz Git y el prompt declara su ruta absoluta: así los runners que anclan la working
 * directory a la raíz Git (OpenCode) trabajan dentro del sandbox, no del repositorio anfitrión.
 * Exit code 0 si todo pasa, 1 si algún caso falla — es lo que `story-implement`
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
 *   --eval-runner <name>   runner: claude, codex u opencode (default: claude; env SDDF_EVAL_RUNNER)
 *   --model <m>            modelo del runner elegido
 *   --concurrency N        casos en paralelo (default: 4)
 *   --timeout <s>          segundos por caso (default: 900; 1800 para opencode)
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
const EVAL_RUNNERS = new Set(['claude', 'codex', 'opencode']);

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
    throw new Error(`❌ ${source} requiere uno de estos valores: ${[...EVAL_RUNNERS].join(', ')}.`);
  }
  const runner = value.trim();
  if (!EVAL_RUNNERS.has(runner)) {
    throw new Error(`❌ Runner de eval no admitido en ${source}: ${JSON.stringify(value)}. Valores válidos: ${[...EVAL_RUNNERS].join(', ')}.`);
  }
  return runner;
}

function defaultModelForRunner(evalRunner, env = process.env) {
  if (evalRunner === 'claude') return env.SDDF_EVAL_MODEL || 'sonnet';
  if (evalRunner === 'opencode') return env.SDDF_EVAL_OPENCODE_MODEL || null;
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
  --eval-runner <name>  Runner de eval: claude, codex u opencode (default: claude; env SDDF_EVAL_RUNNER)
  --model <model>       Modelo del runner elegido (--model prevalece sobre variables de entorno)
  --concurrency <n>     Casos en paralelo (default: 4)
  --timeout <seconds>   Timeout por caso (default: 900; 1800 para opencode)
  --report              Guarda el informe en .tmp/skill-test-evals/<skill>/report-YYYYMMDD.md
  --skills-dir <dir>    Directorio de skills fuente (default: skills)
  --dry-run             Muestra el prompt de cada caso sin invocar un runner
  -h, --help            Muestra esta ayuda

Claude usa sonnet por defecto (o SDDF_EVAL_MODEL). Codex usa su configuración local por defecto
(o SDDF_EVAL_CODEX_MODEL). OpenCode usa su configuración local por defecto
(o SDDF_EVAL_OPENCODE_MODEL, formato proveedor/modelo). --model prevalece sobre el entorno.
El timeout por defecto es de 900 s por caso; con opencode sube a 1800 s (arranque más lento y
modelos locales): --timeout explícito prevalece en todos los runners.

Un caso con "sandbox": { "fixture", "target" (default specs/flow), "copy" } se ejecuta de verdad
sobre una copia desechable en .tmp/skill-test-evals/<skill>/sandbox/<TC>/, con escritura confinada
a ese directorio, y se califica además el árbol en disco con expected.files: written (lista exacta
de rutas creadas/modificadas/eliminadas), contains, not_contains y backups ({ ".bak": "original" }).
target: "." copia un fixture de repositorio completo (por ejemplo docs/ y specs/) en esa raíz temporal.

Examples:
  npm run test:eval
  npm run test:eval -- story-implement
  npm run test:eval -- story-implement --eval-runner codex
  npm run test:eval -- sddf-init --eval-runner opencode
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
    timeoutExplicit: false,
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
    else if (a === '--timeout') {
      opts.timeout = Math.max(1, parseInt(next(), 10) || 900);
      opts.timeoutExplicit = true;
    }
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
  // OpenCode arranca más lento (~45 s medidos) y suele usar modelos locales: sin --timeout
  // explícito recibe 1800 s por caso; claude y codex conservan los 900 s.
  if (!opts.timeoutExplicit) opts.timeout = opts.evalRunner === 'opencode' ? 1800 : 900;
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
  const contexts = new Map();
  for (const testCase of json.cases) {
    if (!testCase || typeof testCase !== 'object') {
      throw new Error(`❌ ${path.relative(repoRoot, evalsPath)} contiene un caso inválido.`);
    }
    const id = validateCaseId(testCase.id, path.relative(repoRoot, evalsPath));
    if (seenIds.has(id)) {
      throw new Error(`❌ ${path.relative(repoRoot, evalsPath)} contiene el ID duplicado ${id}.`);
    }
    seenIds.add(id);
    const spec = parseSandboxSpec(testCase, `${path.relative(repoRoot, evalsPath)} › ${id}`);
    if (spec) assertSandboxSources(spec, repoRoot, `${path.relative(repoRoot, evalsPath)} › ${id}`);
    if (spec && testCase.context_files !== undefined) {
      throw new Error(`❌ ${id}: context_files solo se admite en simulación; usa sandbox.copy para ejecución real.`);
    }
    contexts.set(id, readContextFiles(testCase, skillsDir, skillName));
  }
  return { evalsPath, cases: json.cases, contexts };
}

// Recursos fuente opt-in: el prompt recibe el template vigente, nunca outputs de ejemplo.
function readContextFiles(testCase, skillsDir, skillName) {
  if (testCase.context_files === undefined) return [];
  const label = `${skillName} › ${testCase.id} › context_files`;
  const skillDir = skillFilePath(skillsDir, skillName);
  return stringList(testCase.context_files, label).map((entry) => {
    const relative = normalizeRelativePath(entry, label);
    if (!/^(assets|references)\//.test(relative)) {
      throw new Error(`❌ ${label}: solo se admiten recursos de assets/ o references/: ${relative}.`);
    }
    const file = resolveContainedPath(skillDir, relative);
    try {
      const realRelative = path.relative(fs.realpathSync(skillDir), fs.realpathSync(file)).split(path.sep).join('/');
      if (!/^(assets|references)\//.test(realRelative) || realRelative.split('/').includes('..')) {
        throw new Error('el recurso resuelto sale de assets/ o references/ del skill');
      }
      return { path: relative, content: fs.readFileSync(file, 'utf8') };
    } catch (err) {
      throw new Error(`❌ ${label}: no se pudo leer ${relative}: ${err.message}`);
    }
  });
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

function buildPrompt(skillName, skillMdRel, testCase, contextFiles = []) {
  const input = testCase.input === undefined ? {} : testCase.input;
  return [
    `Eres un ejecutor de evals (protocolo E3 de \`skill-test-evals\`). Debes SIMULAR en seco la ejecución del skill \`${skillName}\` sobre un escenario de prueba y reportar EXACTAMENTE qué emitiría.`,
    ``,
    `Reglas estrictas:`,
    `- Lee íntegro \`${skillMdRel}\` (si es largo, léelo en tramos con offset/limit hasta el final). Es el único contrato: sigue sus pasos en orden literal y copia sus mensajes tal cual, sustituyendo las plantillas \`{...}\` con los valores del escenario. Si el skill invoca \`skill-preflight\` u otros skills, asume que responden con éxito salvo que el escenario diga lo contrario.`,
    `- La descripción del escenario y el bloque "Condiciones de entrada" definen el mundo simulado: estado de los artefactos, configuración, resultados que devuelve cada subagente o comando, respuestas del usuario a cada pausa (si no se especifica una respuesta, asume la opción por defecto/afirmativa). No inventes condiciones que el escenario no describa; si falta un dato, aplica el comportamiento por defecto documentado en el SKILL.md.`,
    `- Las rutas de los artefactos del escenario son simuladas: NO las busques ni compruebes su existencia en el filesystem real. Un archivo que la descripción declara presente, o cuyo contenido se proporciona en el JSON (por ejemplo, epic_content para input_path y template_content para template_path), existe en la simulación con ese contenido. Si el escenario declara un archivo ausente, permanece ausente aunque exista en el repositorio real.`,
    `- Lee del repositorio real solo el SKILL.md y las referencias necesarias para interpretar su contrato (por ejemplo, assets del skill o un template cuyo contenido no esté simulado). El contenido proporcionado por el escenario tiene prioridad sobre cualquier archivo real de la misma ruta.`,
    `- NO modifiques ningún archivo del repositorio, NO ejecutes comandos de escritura y NO lances subagentes. Solo lee y razona.`,
    `- No mires la sección "expected" de ningún caso: emite lo que dicta el SKILL.md dado el escenario.`,
    `- Responde únicamente con el bloque de formato: tu primera línea debe ser \`=== CONSOLE ===\`. No escribas antes planes, objetivos, resúmenes ni explicaciones; esas notas van solo después de \`${END_MARKER}\`. Si tu primera línea no es exactamente \`=== CONSOLE ===\`, la respuesta se califica como error de formato y el caso falla.`,
    ``,
    ...contextFiles.flatMap((resource) => [
      `Recurso fuente del skill: ${resource.path} (contenido íntegro leído del disco por el runner):`,
      `Este recurso forma parte del contrato del skill. Si es un template de salida, conserva su frontmatter y su estructura al completar el bloque FILE. Sus comentarios HTML son instrucciones editoriales: aplícalas y elimínalos del archivo generado, también los inline de los encabezados; sustituye los placeholders por los valores de esta ejecución.`,
      '```markdown',
      resource.content,
      '```',
      ``,
    ]),
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
// Modo sandbox — ejecución real con escritura confinada (opt-in por caso)
// ---------------------------------------------------------------------------

// El skill bajo prueba se copia sin sus casos esperados ni sus fixtures.
const SANDBOX_SKILL_EXCLUDES = new Set(['evals', 'examples']);

function normalizeRelativePath(value, label) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`❌ ${label} debe ser una ruta relativa no vacía.`);
  }
  if (isAbsoluteOnAnySupportedPlatform(value)) {
    throw new Error(`❌ ${label} no admite rutas absolutas: ${JSON.stringify(value)}.`);
  }
  const segments = value.split(/[\\/]+/).filter((segment) => segment && segment !== '.');
  if (segments.includes('..')) {
    throw new Error(`❌ ${label} no puede escapar de su raíz: ${JSON.stringify(value)}.`);
  }
  if (segments.length === 0) {
    throw new Error(`❌ ${label} debe ser una ruta relativa no vacía.`);
  }
  return segments.join('/');
}

function normalizePathMap(value, label, mapValue) {
  if (value === undefined) return {};
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`❌ ${label} debe ser un objeto { ruta: valor }.`);
  }
  const out = {};
  for (const [key, entry] of Object.entries(value)) {
    out[normalizeRelativePath(key, `${label} (clave)`)] = mapValue(entry, `${label} › ${key}`);
  }
  return out;
}

function stringList(value, label) {
  if (!Array.isArray(value) || value.some((s) => typeof s !== 'string')) {
    throw new Error(`❌ ${label} debe ser una lista de textos.`);
  }
  return value;
}

/**
 * Normaliza `testCase.sandbox` y `testCase.expected.files`. Devuelve null si el caso no es sandbox.
 * Las rutas de `expected.files` son relativas a la raíz del sandbox.
 */
function parseSandboxSpec(testCase, source) {
  if (testCase.sandbox === undefined) return null;
  const raw = testCase.sandbox;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error(`❌ ${source}: sandbox debe ser un objeto con fixture.`);
  }
  const files = testCase.expected && testCase.expected.files;
  if (!files || typeof files !== 'object' || !Array.isArray(files.written)) {
    throw new Error(`❌ ${source}: un caso sandbox requiere expected.files.written (lista de rutas escritas; [] si no escribe nada).`);
  }
  return {
    fixture: normalizeRelativePath(raw.fixture, `${source}: sandbox.fixture`),
    target: raw.target === '.' ? '.' : normalizeRelativePath(raw.target === undefined ? 'specs/flow' : raw.target, `${source}: sandbox.target`),
    copy: (raw.copy === undefined ? [] : stringList(raw.copy, `${source}: sandbox.copy`))
      .map((entry) => normalizeRelativePath(entry, `${source}: sandbox.copy`)),
    files: {
      written: [...new Set(stringList(files.written, `${source}: expected.files.written`)
        .map((entry) => normalizeRelativePath(entry, `${source}: expected.files.written`)))].sort(),
      contains: normalizePathMap(files.contains, `${source}: expected.files.contains`, stringList),
      notContains: normalizePathMap(files.not_contains, `${source}: expected.files.not_contains`, stringList),
      backups: normalizePathMap(files.backups, `${source}: expected.files.backups`,
        (entry, label) => normalizeRelativePath(entry, label)),
    },
  };
}

function assertSandboxSources(spec, repoRoot, source) {
  const fixture = resolveContainedPath(repoRoot, spec.fixture);
  if (!fs.existsSync(fixture) || !fs.statSync(fixture).isDirectory()) {
    throw new Error(`❌ ${source}: sandbox.fixture no es un directorio del repositorio: ${spec.fixture}.`);
  }
  for (const entry of spec.copy) {
    if (!fs.existsSync(resolveContainedPath(repoRoot, entry))) {
      throw new Error(`❌ ${source}: sandbox.copy no existe en el repositorio: ${entry}.`);
    }
  }
}

function prepareSandbox(spec, { repoRoot, skillsDir, skillName, sandboxDir, runtime = {} }) {
  fs.rmSync(sandboxDir, { recursive: true, force: true });
  fs.mkdirSync(sandboxDir, { recursive: true });
  for (const entry of spec.copy) {
    fs.cpSync(resolveContainedPath(repoRoot, entry), resolveContainedPath(sandboxDir, entry), { recursive: true });
  }
  // Un fixture completo usa la raíz temporal ya validada, nunca la raíz del proyecto fuente.
  const fixtureTarget = spec.target === '.' ? sandboxDir : resolveContainedPath(sandboxDir, spec.target);
  fs.cpSync(resolveContainedPath(repoRoot, spec.fixture), fixtureTarget, { recursive: true });
  const skillDir = path.dirname(skillFilePath(skillsDir, skillName, 'SKILL.md'));
  const skillRel = path.relative(repoRoot, skillDir);
  // Copia por entradas de primer nivel: el `filter` de cpSync recibe rutas `\\?\` en Windows.
  for (const entry of fs.readdirSync(skillDir)) {
    if (SANDBOX_SKILL_EXCLUDES.has(entry)) continue;
    fs.cpSync(path.join(skillDir, entry), resolveContainedPath(sandboxDir, skillRel, entry), { recursive: true });
  }
  initSandboxGitRoot(sandboxDir, runtime.execFileSync);
}

/**
 * El sandbox debe ser su propia raíz Git: runners como OpenCode anclan el worktree —y con él la
 * working directory y los patrones de permiso edit— al `.git` más cercano. Sin esta marca
 * arrancarían anclados a la raíz del repositorio anfitrión y el contrato del prompt sandbox
 * ("el directorio de trabajo es una copia desechable") dejaría de ser cierto.
 */
function initSandboxGitRoot(sandboxDir, execFile) {
  const runGit = execFile || execFileSync;
  try {
    runGit('git', ['init', '--quiet', sandboxDir], { stdio: 'pipe' });
  } catch (err) {
    // Sin git disponible deja la marca mínima para que el anclaje por `.git` siga funcionando.
    fs.mkdirSync(path.join(sandboxDir, '.git'), { recursive: true });
  }
}

function snapshotTree(root) {
  const files = new Map();
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        // El `.git` del sandbox es maquinaria del runner, no salida del agente.
        if (entry.name === '.git') continue;
        walk(full);
      } else {
        files.set(path.relative(root, full).split(path.sep).join('/'), fs.readFileSync(full));
      }
    }
  };
  if (fs.existsSync(root)) walk(root);
  return files;
}

function diffSnapshots(before, after) {
  const created = [...after.keys()].filter((p) => !before.has(p)).sort();
  const deleted = [...before.keys()].filter((p) => !after.has(p)).sort();
  const modified = [...after.keys()].filter((p) => before.has(p) && !before.get(p).equals(after.get(p))).sort();
  return { created, modified, deleted, written: [...new Set([...created, ...modified, ...deleted])].sort() };
}

function gradeSandboxFiles(spec, before, after) {
  const missing = [];
  const violated = [];
  const diff = diffSnapshots(before, after);
  const text = (buffer) => buffer.toString('utf8').replace(/\r\n/g, '\n');
  for (const p of spec.files.written) {
    if (!diff.written.includes(p)) missing.push(`[files] escrito: ${p}`);
  }
  for (const p of diff.written) {
    if (!spec.files.written.includes(p)) violated.push(`[files] escrito: ${p}`);
  }
  for (const [p, needles] of Object.entries(spec.files.contains)) {
    if (!after.has(p)) {
      missing.push(`[files] existe: ${p}`);
      continue;
    }
    for (const s of needles) if (!text(after.get(p)).includes(s)) missing.push(`[files] ${p} contiene: ${s}`);
  }
  for (const [p, needles] of Object.entries(spec.files.notContains)) {
    if (!after.has(p)) continue;
    for (const s of needles) if (text(after.get(p)).includes(s)) violated.push(`[files] ${p} contiene: ${s}`);
  }
  for (const [bak, original] of Object.entries(spec.files.backups)) {
    if (!after.has(bak)) missing.push(`[files] backup: ${bak}`);
    else if (!before.has(original)) missing.push(`[files] original previo: ${original}`);
    else if (!after.get(bak).equals(before.get(original))) violated.push(`[files] ${bak} difiere del ${original} previo`);
  }
  return { missing, violated, diff };
}

function buildSandboxPrompt(skillName, skillMdRel, testCase, spec, sandboxDir = null) {
  const input = testCase.input === undefined ? {} : testCase.input;
  const rootLine = sandboxDir
    ? `El directorio de trabajo es el sandbox \`${sandboxDir}\`: una copia desechable del repositorio que hace a la vez de REPO_ROOT y de CLI_ROOT del skill. Contiene \`${spec.target}/\` con el fixture del escenario, \`${skillMdRel}\` y las rutas copiadas para el escenario${spec.copy.length ? ` (${spec.copy.map((entry) => `\`${entry}\``).join(', ')})` : ''}. Resuelve TODAS las rutas de lectura y escritura del skill desde esa raíz absoluta (p. ej. \`${path.join(sandboxDir, spec.target).split(path.sep).join('/')}\`), sin buscar el fixture ni el skill en el repositorio anfitrión.`
    : `El directorio de trabajo actual es una copia desechable del repositorio y hace a la vez de REPO_ROOT y de CLI_ROOT del skill. Contiene \`${spec.target}/\` con el fixture del escenario, \`${skillMdRel}\` y las rutas copiadas para el escenario${spec.copy.length ? ` (${spec.copy.map((entry) => `\`${entry}\``).join(', ')})` : ''}.`;
  return [
    `Eres un ejecutor de evals (protocolo E3 de \`skill-test-evals\`, modo sandbox). Debes EJECUTAR DE VERDAD el skill \`${skillName}\` sobre un escenario de prueba, escribiendo en disco lo que el skill escriba.`,
    ``,
    `Reglas estrictas:`,
    `- ${rootLine}`,
    `- Lee íntegro \`${skillMdRel}\` (si es largo, léelo en tramos con offset/limit hasta el final). Es el único contrato: sigue sus pasos en orden literal, copia sus mensajes tal cual y crea, modifica o deja intactos los archivos exactamente como dicta.`,
    `- Lee íntegros los archivos de entrada y los templates que el skill resuelva dentro del directorio de trabajo; si una lectura se trunca, continúa con offset/limit hasta EOF antes de derivar el diagnóstico. No reconstruyas su contenido desde la descripción ni consultes archivos equivalentes del repositorio anfitrión. Conserva las líneas originales, incluido el frontmatter y las líneas vacías, para citar ubicaciones.`,
    `- Escribe solo dentro del directorio de trabajo (rutas relativas o absolutas bajo él); nunca fuera de él. No ejecutes comandos de shell ni lances subagentes. El runner compara el árbol del directorio antes y después de tu ejecución.`,
    `- El bloque "Condiciones de entrada" define la invocación y las respuestas del usuario a cada pausa (si no se especifica una respuesta, asume la opción por defecto/afirmativa). No inventes condiciones que el escenario no describa.`,
    `- Responde únicamente con el bloque de formato: tu primera línea debe ser \`=== CONSOLE ===\`. No escribas antes planes, objetivos, resúmenes ni explicaciones; esas notas van solo después de \`${END_MARKER}\`. Si tu primera línea no es exactamente \`=== CONSOLE ===\`, la respuesta se califica como error de formato y el caso falla.`,
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
    `<todas las líneas que el skill mostró al usuario, en orden y tal cual, incluidas las preguntas de pausa y las respuestas del usuario en una línea "> s" / "> n">`,
    `${END_MARKER}`,
    ``,
    `Los archivos no se transcriben: se verifican en disco. Cualquier nota o explicación va DESPUÉS de "${END_MARKER}".`,
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Paso E3b — Invocar el runner de eval (solo lectura, o escritura confinada en sandbox)
// ---------------------------------------------------------------------------

function buildClaudeArgs(prompt, opts, { sandbox = false } = {}) {
  const args = [
    '-p',
    prompt,
    '--model',
    opts.model,
    '--output-format',
    'text',
    '--permission-mode',
    sandbox ? 'acceptEdits' : 'plan',
    '--allowedTools',
    'Read,Glob,Grep',
  ];
  if (sandbox) {
    // Write/Edit no van en --allowedTools: una regla sin ruta aprobaría escrituras fuera del sandbox.
    // acceptEdits solo aprueba ediciones dentro del cwd (el sandbox); en -p el resto se deniega.
    // Se deniegan shell, web y MCP para que reglas heredadas de la configuración no abran otra vía.
    args.push('--disallowedTools', 'Bash,PowerShell,WebFetch,WebSearch', '--strict-mcp-config');
  }
  return args;
}

function buildCodexArgs(opts, outputFile, sandboxDir = null) {
  const args = [
    'exec',
    '--sandbox',
    sandboxDir ? 'workspace-write' : 'read-only',
    ...(sandboxDir ? ['--skip-git-repo-check', '--cd', sandboxDir] : []),
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
        cwd: runtime.sandboxDir ? resolveRoot(runtime.sandboxDir, 'sandbox') : repoRoot,
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
  return runProcess('claude', buildClaudeArgs(prompt, opts, { sandbox: Boolean(runtime.sandboxDir) }), opts, { ...runtime, env });
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

  return runProcess('codex', buildCodexArgs(opts, outputFile, runtime.sandboxDir || null), opts, runtime, prompt).then((run) => {
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
  if (evalRunner === 'opencode') return (runtime.runOpenCode || runOpenCode)(prompt, opts, runtime);
  return (runtime.runCodex || runCodex)(prompt, opts, runtime);
}

function buildOpenCodeArgs(opts) {
  const args = ['run', '--format', 'json', '--agent', 'sddf-eval'];
  if (opts.model) args.push('--model', opts.model);
  return args;
}

function openCodeInvocation(args, runtime = {}) {
  if ((runtime.platform || process.platform) === 'win32') {
    const env = runtime.env || process.env;
    const exists = runtime.exists || fs.existsSync;
    const pathKey = Object.keys(env).find((key) => key.toLowerCase() === 'path');
    for (const directory of (env[pathKey] || '').split(';').filter(Boolean)) {
      const dir = directory.replace(/^"|"$/g, '');
      const binary = path.win32.join(dir, 'opencode.exe');
      if (exists(binary)) return { command: binary, args };
      // Los shims npm .cmd no se pueden ejecutar con spawn sin shell en Windows.
      const launchers = [
        path.win32.join(dir, 'node_modules', 'opencode-ai', 'bin', 'opencode'),
        ...(path.win32.basename(dir).toLowerCase() === '.bin'
          ? [path.win32.join(dir, '..', 'opencode-ai', 'bin', 'opencode')]
          : []),
      ];
      const launcher = launchers.find((candidate) => exists(candidate));
      if (launcher) return { command: runtime.nodeExecutable || process.execPath, args: [launcher, ...args] };
    }
  }
  return { command: 'opencode', args };
}

async function runOpenCode(prompt, opts, runtime = {}) {
  // El agente propio evita heredar los permisos del agente predeterminado del usuario.
  // OpenCode agrupa write/edit/patch bajo el permiso edit. Shell, MCP, red y task
  // permanecen denegados por la regla * en ambos modos.
  const permission = { '*': 'deny', read: 'allow', glob: 'allow', grep: 'allow', edit: 'deny', external_directory: 'deny' };
  if (runtime.sandboxDir) {
    const dir = resolveRoot(runtime.sandboxDir, 'sandbox');
    // Los permisos edit usan rutas relativas a Instance.worktree (raíz Git;
    // "/" si no hay Git), incluso al arrancar OpenCode desde un subdirectorio.
    let worktree = dir;
    while (!fs.existsSync(path.join(worktree, '.git'))) {
      const parent = path.dirname(worktree);
      if (parent === worktree) { worktree = path.resolve('/'); break; }
      worktree = parent;
    }
    const relative = path.relative(worktree, dir);
    const pattern = relative ? `${relative}${path.sep}*` : '*';
    permission.edit = { '*': 'deny', [pattern]: 'allow', [pattern.split(path.sep).join('/')]: 'allow' };
  }
  const inheritedEnv = runtime.env || process.env;
  const config = JSON.parse(inheritedEnv.OPENCODE_CONFIG_CONTENT || '{}');
  const env = {
    ...inheritedEnv,
    OPENCODE_CONFIG_CONTENT: JSON.stringify({
      ...config,
      share: 'disabled',
      agent: { ...config.agent, 'sddf-eval': { mode: 'primary', permission } },
    }),
    OPENCODE_PERMISSION: JSON.stringify(permission),
    OPENCODE_DISABLE_AUTOUPDATE: 'true',
  };
  const invocation = openCodeInvocation(buildOpenCodeArgs(opts), { ...runtime, env });
  // stdin evita límites y quoting de prompts extensos en la línea de comandos.
  const run = await runProcess(invocation.command, invocation.args, opts, { ...runtime, env }, prompt);
  if (!run.ok) return { ...run, events: run.stdout };

  const text = [];
  const errors = [];
  for (const line of run.stdout.split(/\r?\n/).filter((line) => line.trim())) {
    let event;
    try {
      event = JSON.parse(line);
      if (!event || typeof event !== 'object' || typeof event.type !== 'string') throw new Error('evento sin tipo');
    } catch {
      errors.push('OpenCode emitió una línea JSON inválida.');
      continue;
    }
    if (event.type === 'text' && !event.part?.synthetic && typeof event.part?.text === 'string') text.push(event.part.text);
    if (event.type === 'error') {
      errors.push(`OpenCode: ${event.error?.data?.message || event.error?.message || event.error?.name || 'error sin detalle'}`);
    }
  }
  const stdout = text.reduce((acc, part) => acc + (acc && !acc.endsWith('\n') && !part.startsWith('\n') ? '\n' : '') + part, '');
  if (!stdout.trim()) errors.push('OpenCode terminó sin una respuesta de texto.');
  return { ...run, events: run.stdout, ok: errors.length === 0, stdout, stderr: [run.stderr, ...errors].filter(Boolean).join('\n') };
}

// ---------------------------------------------------------------------------
// Paso E3c/E3d — Calificar
// ---------------------------------------------------------------------------

function findConsoleBlocks(rawOutput) {
  const blocks = [];
  const consoleRe = /(^|\n)=== CONSOLE ===[ \t]*\r?\n/g;
  for (const match of rawOutput.matchAll(consoleRe)) {
    const start = match.index + match[1].length;
    const endRe = /(^|\n)=== END ===[ \t]*(?:\r?\n|$)/g;
    endRe.lastIndex = start;
    for (const end of rawOutput.matchAll(endRe)) {
      blocks.push(rawOutput.slice(start, end.index + end[1].length));
    }
  }
  return blocks;
}

function gradeOutput(testCase, rawOutput) {
  const expected = testCase.expected || {};
  const contains = [...(expected.contains || []), ...(expected.output_contains || [])];
  const notContains = expected.not_contains || [];
  const threshold = typeof testCase.threshold === 'number' ? testCase.threshold : 1.0;
  const blocks = findConsoleBlocks(rawOutput);
  if (blocks.length === 0) {
    return {
      pass: false,
      formatError: true,
      missing: ['formato: la respuesta no incluye el bloque === CONSOLE === (el modelo no siguió el protocolo E3)'],
      violated: [],
      found: 0,
      total: contains.length,
      ratio: 0,
      threshold,
      evidence: rawOutput.slice(0, 300),
    };
  }
  let last = null;
  for (const block of blocks) {
    const missing = contains.filter((s) => !block.includes(s));
    const violated = notContains.filter((s) => block.includes(s));
    const total = contains.length;
    const found = total - missing.length;
    const ratio = total === 0 ? 1 : found / total;
    const pass = (threshold >= 1 ? missing.length === 0 : ratio >= threshold) && violated.length === 0;
    last = { pass, missing, violated, found, total, ratio, threshold, evidence: block.slice(0, 300) };
    if (pass) return last;
  }
  return last;
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
    const spec = parseSandboxSpec(tc, `${skillName} › ${testCaseId}`);
    const sandboxDir = spec ? resolveContainedPath(tmpRoot, skillName, 'sandbox', testCaseId) : null;
    const prompt = spec
      ? buildSandboxPrompt(skillName, skillMdRel, tc, spec, sandboxDir)
      : buildPrompt(skillName, skillMdRel, tc, planSkill.contexts.get(tc.id));
    if (opts.dryRun) {
      const plan = spec ? `[sandbox] ${spec.fixture} → ${spec.target}/ · escritos esperados: ${spec.files.written.length}\n` : '';
      log(`\n----- ${tc.id} (${tc.name}) — prompt -----\n${plan}${prompt}\n`);
      return { tc, status: 'DRY', grade: null, durationMs: 0 };
    }
    write(`[${tc.id}] ejecutando…\n`);
    const outputFile = resolveContainedPath(runsDir, `${testCaseId}.txt`);
    let before = null;
    if (spec) {
      prepareSandbox(spec, { repoRoot, skillsDir, skillName, sandboxDir });
      before = snapshotTree(sandboxDir);
    }
    const run = await runEvalRunner(prompt, opts, { ...runtime, codexOutputFile: outputFile, sandboxDir });
    fs.writeFileSync(outputFile, run.stdout);
    if (opts.evalRunner === 'opencode' && typeof run.events === 'string') {
      fs.writeFileSync(resolveContainedPath(runsDir, `${testCaseId}.events.jsonl`), run.events);
    }
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
    if (spec) {
      const files = gradeSandboxFiles(spec, before, snapshotTree(sandboxDir));
      fs.writeFileSync(
        resolveContainedPath(runsDir, `${testCaseId}.files.txt`),
        ['created', 'modified', 'deleted'].map((kind) => `${kind}:\n${files.diff[kind].map((p) => `  ${p}`).join('\n')}`).join('\n') + '\n',
      );
      grade.missing.push(...files.missing);
      grade.violated.push(...files.violated);
      grade.pass = grade.pass && files.missing.length === 0 && files.violated.length === 0;
    }
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
  buildOpenCodeArgs,
  runCodex,
  runOpenCode,
  openCodeInvocation,
  changedSkills,
  resolveSkills,
  loadCases,
  buildExecutionPlan,
  buildPrompt,
  buildSandboxPrompt,
  parseSandboxSpec,
  prepareSandbox,
  snapshotTree,
  diffSnapshots,
  gradeSandboxFiles,
  gradeOutput,
  renderReport,
  main,
};
