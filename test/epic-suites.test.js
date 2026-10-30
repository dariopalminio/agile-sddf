'use strict';

/**
 * Tests de STORY-125: motor `skills/epic-validate/scripts/epic-suites.js`, subcomando
 * `check-command` (contrato I1 de STORY-169, reutilizado por D-8 de STORY-125). Cubre V-7 de
 * `design.md`: detección previa de script npm no declarado (STORY-169 D-2), ejecutable no
 * encontrado (ENOENT, 127, 9009 o ausente del PATH; D-3 y D-11), clasificación `pass`/`fail`
 * con duración y `outputTail` (D-9), parseo de argumentos con salida 2, no escritura (CS-7) y el
 * comando de smoke tests con el ID ya sustituido (D-2). Cada caso opera sobre un directorio
 * temporal; nunca sobre el repo real.
 */

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const SCRIPT = path.join(__dirname, '..', 'skills', 'epic-validate', 'scripts', 'epic-suites.js');
const { npmScriptOf, precheckCommand, classifyCommand } = require(SCRIPT);

const NODE = `"${process.execPath}"`;

/** `REPO_ROOT` temporal; `scripts` = objeto de `package.json › scripts`, o `null` para no crear `package.json`. */
function makeRepo(t, { scripts = {} } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sddf-suites-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true, maxRetries: 3 }));
  if (scripts !== null) fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ name: 'fixture', scripts }, null, 2));
  return root;
}

function runCli(args) {
  const result = spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8', input: '' });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr, json: result.status === 0 ? JSON.parse(result.stdout) : null };
}

/** Archivos del árbol con su `mtime`, para comprobar que el motor no escribe. */
function snapshot(root) {
  const out = {};
  for (const name of fs.readdirSync(root, { recursive: true })) out[name] = fs.statSync(path.join(root, name)).mtimeMs;
  return out;
}

test('npmScriptOf reconoce npm run, npm run-script y npm test', () => {
  assert.equal(npmScriptOf('npm run verify:release'), 'verify:release');
  assert.equal(npmScriptOf('npm run-script test:e2e:smoke -- --grep x'), 'test:e2e:smoke');
  assert.equal(npmScriptOf('npm test'), 'test');
  assert.equal(npmScriptOf('node -e "1"'), null);
  assert.equal(npmScriptOf('npm install'), null);
});

test('script npm declarado: la comprobación previa no lo bloquea', (t) => {
  const root = makeRepo(t, { scripts: { 'verify:release': 'node -e "process.exit(0)"' } });
  assert.equal(precheckCommand(root, 'npm run verify:release'), null);
});

test('script npm no declarado → not-executable sin lanzar el proceso', (t) => {
  const root = makeRepo(t, { scripts: {} });
  for (const script of ['verify:release', 'test:e2e:smoke']) {
    const result = classifyCommand(root, `npm run ${script}`);
    assert.equal(result.outcome, 'not-executable');
    assert.equal(result.reason, `script npm ${script} no declarado en package.json`);
    assert.equal(result.exitCode, null);
    assert.equal(result.durationSeconds, null);
  }
});

test('sin package.json, un comando npm → not-executable con el motivo', (t) => {
  const root = makeRepo(t, { scripts: null });
  const result = classifyCommand(root, 'npm run verify:release');
  assert.equal(result.outcome, 'not-executable');
  assert.equal(result.reason, 'package.json no existe');
});

test('package.json ilegible, un comando npm → not-executable con el motivo', (t) => {
  const root = makeRepo(t, { scripts: null });
  fs.writeFileSync(path.join(root, 'package.json'), '{ no es json');
  const result = classifyCommand(root, 'npm run verify:release');
  assert.equal(result.outcome, 'not-executable');
  assert.equal(result.reason, 'package.json ilegible');
});

test('un comando que no es de npm no consulta package.json', (t) => {
  const root = makeRepo(t, { scripts: null });
  assert.equal(precheckCommand(root, `${NODE} -e "process.exit(0)"`), null);
});

test('código 0 → pass con duración de un decimal', (t) => {
  const root = makeRepo(t);
  const result = classifyCommand(root, `${NODE} -e "process.exit(0)"`);
  assert.equal(result.outcome, 'pass');
  assert.equal(result.exitCode, 0);
  assert.equal(result.reason, null);
  assert.equal(result.outputTail, null);
  assert.equal(typeof result.durationSeconds, 'number');
  assert.equal(Math.round(result.durationSeconds * 10) / 10, result.durationSeconds);
});

test('código distinto de 0 → fail con las últimas 20 líneas de la salida', (t) => {
  const root = makeRepo(t);
  const script = 'for(let i=1;i<=25;i++)console.log(\'linea \'+i);console.error(\'fallo final\');process.exit(1)';
  const result = classifyCommand(root, `${NODE} -e "${script}"`);
  assert.equal(result.outcome, 'fail');
  assert.equal(result.exitCode, 1);
  const lines = result.outputTail.split('\n');
  assert.equal(lines.length, 20);
  assert.ok(!result.outputTail.includes('linea 5\n'));
  assert.ok(result.outputTail.includes('linea 25'));
  assert.ok(result.outputTail.includes('fallo final'));
});

test('ejecutable inexistente → not-executable (Windows y POSIX)', (t) => {
  const root = makeRepo(t);
  const result = classifyCommand(root, 'sddf-no-existe-xyz --version');
  assert.equal(result.outcome, 'not-executable');
  assert.match(result.reason, /^ejecutable no encontrado/);
});

test('check-command imprime un único CommandResult y sale con 0', (t) => {
  const root = makeRepo(t);
  const { status, json } = runCli(['check-command', '--repo-root', root, '--command', `${NODE} -e "process.exit(1)"`]);
  assert.equal(status, 0);
  assert.deepEqual(Object.keys(json).sort(), ['command', 'durationSeconds', 'exitCode', 'ok', 'outcome', 'outputTail', 'reason']);
  assert.equal(json.ok, true);
  assert.equal(json.outcome, 'fail');
});

test('argumentos inválidos → stderr y salida 2', (t) => {
  const root = makeRepo(t);
  const cases = [
    [],
    ['desconocido', '--repo-root', root, '--command', 'x'],
    ['check-command', '--command', 'x'],
    ['check-command', '--repo-root', root],
    ['check-command', '--repo-root', root, '--command'],
    ['check-command', '--repo-root', path.join(root, 'no-existe'), '--command', 'x'],
  ];
  for (const args of cases) {
    const { status, stdout, stderr } = runCli(args);
    assert.equal(status, 2, `args: ${args.join(' ')}`);
    assert.equal(stdout, '');
    assert.ok(stderr.length > 0);
  }
});

test('check-command no escribe en REPO_ROOT', (t) => {
  const root = makeRepo(t, { scripts: { 'verify:release': 'node -e "process.exit(0)"' } });
  fs.mkdirSync(path.join(root, 'specs', 'flow', 'EPIC-01-alfa'), { recursive: true });
  fs.writeFileSync(path.join(root, 'specs', 'flow', 'EPIC-01-alfa', 'epic.md'), '# Épica\n');
  const before = snapshot(root);
  runCli(['check-command', '--repo-root', root, '--command', `${NODE} -e "process.exit(0)"`]);
  runCli(['check-command', '--repo-root', root, '--command', 'npm run no-declarado']);
  assert.deepEqual(snapshot(root), before);
});

// STORY-137 V-1/V-2: `--full-output` agrega `output` (presentación) sin cambiar los campos de evidencia.
const sinVolatiles = ({ durationSeconds, output, ...rest }) => rest;

test('check-command --full-output agrega output con stdout y stderr; sin la opción no hay clave output', (t) => {
  const root = makeRepo(t);
  const command = `${NODE} -e "console.log('SDDF-MARCA-1'); console.error('SDDF-MARCA-2')"`;
  const full = runCli(['check-command', '--repo-root', root, '--command', command, '--full-output']);
  const plain = runCli(['check-command', '--repo-root', root, '--command', command]);
  assert.equal(full.status, 0);
  assert.equal(full.json.outcome, 'pass');
  assert.ok(full.json.output.indexOf('SDDF-MARCA-1') < full.json.output.indexOf('SDDF-MARCA-2'));
  assert.ok(full.json.output.includes('SDDF-MARCA-2'));
  assert.equal(plain.status, 0);
  assert.ok(!Object.prototype.hasOwnProperty.call(plain.json, 'output'));
  assert.deepEqual(sinVolatiles(full.json), sinVolatiles(plain.json));
});

test('--full-output con fail conserva la salida completa y el mismo outputTail', (t) => {
  const root = makeRepo(t);
  const command = `${NODE} -e "for(let i=1;i<=30;i++)console.log('linea '+i);process.exit(1)"`;
  const full = classifyCommand(root, command, { fullOutput: true });
  const plain = classifyCommand(root, command);
  assert.equal(full.outcome, 'fail');
  assert.equal(full.output.replace(/\r\n/g, '\n').trimEnd().split('\n').length, 30);
  assert.ok(full.output.includes('linea 1\n') || full.output.includes('linea 1\r\n'));
  assert.equal(full.outputTail, plain.outputTail);
  assert.deepEqual(sinVolatiles(full), sinVolatiles(plain));
});

test('--full-output con un comando no lanzado → output: null', (t) => {
  const root = makeRepo(t, { scripts: {} });
  const result = classifyCommand(root, 'npm run sddf-no-declarado', { fullOutput: true });
  assert.equal(result.outcome, 'not-executable');
  assert.equal(result.output, null);
  const { status, json } = runCli(['check-command', '--repo-root', root, '--command', 'sddf-no-existe-xyz', '--full-output']);
  assert.equal(status, 0);
  assert.equal(json.outcome, 'not-executable');
  assert.equal(json.output, null);
});

test('--full-output acepta cualquier posición y una opción desconocida sigue saliendo con 2', (t) => {
  const root = makeRepo(t);
  const first = runCli(['check-command', '--full-output', '--repo-root', root, '--command', `${NODE} -e "process.exit(0)"`]);
  assert.equal(first.status, 0);
  assert.equal(first.json.output, '');
  const unknown = runCli(['check-command', '--repo-root', root, '--command', 'x', '--verbose']);
  assert.equal(unknown.status, 2);
  assert.equal(unknown.stdout, '');
});

test('comando de smoke tests con el ID ya sustituido se clasifica como cualquier otro', (t) => {
  const root = makeRepo(t);
  const smoke = (id) => `${NODE} -e "process.exit(process.argv[1]==='SMOKE-2'?1:0)" ${id}`;
  assert.equal(runCli(['check-command', '--repo-root', root, '--command', smoke('SMOKE-2')]).json.outcome, 'fail');
  assert.equal(runCli(['check-command', '--repo-root', root, '--command', smoke('SMOKE-1')]).json.outcome, 'pass');
  assert.equal(runCli(['check-command', '--repo-root', root, '--command', 'echo {{smoke_id}}']).json.outcome, 'pass');
});

// STORY-169: suites de nivel épica (`readEpicSuites` + subcomando `run`, contrato I1 y `SuitesResult`).
const { readEpicSuites, EPIC_SUITE_KEYS } = require(SCRIPT);

/** `sddf.config.yaml` con un bloque `verify:`; `suites` = `{ key: { command, required } }` en ese orden. */
function verifyYaml(suites) {
  const lines = ['profile: fixture', '', 'verify:'];
  for (const [key, { command, required }] of Object.entries(suites)) {
    lines.push(`  ${key}:`);
    if (command !== undefined) lines.push(`    command: ${JSON.stringify(command)}`);
    if (required !== undefined) lines.push(`    required: ${required}`);
  }
  return `${lines.join('\n')}\n\nimplement:\n  test_generators: []\n`;
}

function writeConfig(root, text) {
  fs.writeFileSync(path.join(root, 'sddf.config.yaml'), text);
}

const ok = `${NODE} -e "process.exit(0)"`;
const ko = `${NODE} -e "console.log('suite rota');process.exit(1)"`;

test('EPIC_SUITE_KEYS es la lista fija integration → e2e → e2e-regression', () => {
  assert.deepEqual(EPIC_SUITE_KEYS, ['integration', 'e2e', 'e2e-regression']);
});

test('readEpicSuites lee el verify real del repo: solo las tres claves de épica, en orden', () => {
  const text = fs.readFileSync(path.join(__dirname, '..', 'sddf.config.yaml'), 'utf8');
  const suites = readEpicSuites(text);
  assert.deepEqual(suites.map((s) => s.key), EPIC_SUITE_KEYS);
  for (const suite of suites) {
    assert.equal(suite.declared, true);
    assert.equal(typeof suite.command, 'string');
    assert.equal(typeof suite.required, 'boolean');
  }
  assert.equal(suites[0].command, 'node scripts/verify-fixed-layout.js');
  assert.equal(suites[0].required, true);
});

test('readEpicSuites quita comillas, ignora comentarios fuera de comillas y usa required: false si falta', () => {
  const text = [
    'verify:',
    '  unit:',
    '    command: "npm run test:installer"',
    '    required: true',
    '  integration:',
    '    command: "npm run test:eval" # nota con # y "comillas"',
    '  e2e:',
    '    command: \'node -e "1 # no es comentario"\'',
    '    required: true # obligatorio',
    'otra:',
    '  e2e-regression:',
    '    command: "fuera de verify"',
  ].join('\n');
  const [integration, e2e, regression] = readEpicSuites(text);
  assert.deepEqual(integration, { key: 'integration', declared: true, command: 'npm run test:eval', required: false });
  assert.deepEqual(e2e, { key: 'e2e', declared: true, command: 'node -e "1 # no es comentario"', required: true });
  assert.deepEqual(regression, { key: 'e2e-regression', declared: false, command: null, required: false });
});

test('readEpicSuites: clave sin command escalar o verify en sintaxis de flujo → command null', () => {
  const sinCommand = readEpicSuites('verify:\n  integration:\n    required: true\n  e2e:\n    command:\n');
  assert.deepEqual(sinCommand[0], { key: 'integration', declared: true, command: null, required: true });
  assert.equal(sinCommand[1].declared, true);
  assert.equal(sinCommand[1].command, null);
  const flujo = readEpicSuites('verify: { integration: { command: "x" } }\n');
  assert.ok(flujo.every((s) => s.command === null));
});

test('run: tres suites con código 0 → 3 pass con duración de un decimal y sin advertencias (AC-1)', (t) => {
  const root = makeRepo(t);
  writeConfig(root, verifyYaml({ integration: { command: ok, required: true }, e2e: { command: ok, required: false }, 'e2e-regression': { command: ok, required: false } }));
  const { status, json } = runCli(['run', '--repo-root', root]);
  assert.equal(status, 0);
  assert.equal(json.ok, true);
  assert.equal(json.configPath, 'sddf.config.yaml');
  assert.deepEqual(json.warnings, []);
  assert.deepEqual(json.suites.map((s) => s.key), EPIC_SUITE_KEYS);
  for (const suite of json.suites) {
    assert.equal(suite.outcome, 'pass');
    assert.equal(suite.command, ok);
    assert.equal(suite.exitCode, 0);
    assert.equal(typeof suite.durationSeconds, 'number');
    assert.equal(Math.round(suite.durationSeconds * 10) / 10, suite.durationSeconds);
    assert.equal(suite.outputTail, null);
  }
  assert.deepEqual(Object.keys(json.suites[0]).sort(), ['command', 'declared', 'durationSeconds', 'exitCode', 'key', 'outcome', 'outputTail', 'reason', 'required']);
});

test('run: fallo, script npm no declarado y clave sin command en el mismo SuitesResult (AC-2, AC-3)', (t) => {
  const root = makeRepo(t, { scripts: {} });
  writeConfig(root, verifyYaml({ integration: { command: ko, required: true }, e2e: { command: 'npm run falta', required: true }, 'e2e-regression': { required: false } }));
  const { status, json } = runCli(['run', '--repo-root', root]);
  assert.equal(status, 0);
  const [integration, e2e, regression] = json.suites;
  assert.equal(integration.outcome, 'fail');
  assert.equal(integration.exitCode, 1);
  assert.ok(integration.outputTail.includes('suite rota'));
  assert.equal(e2e.outcome, 'not-executable');
  assert.equal(e2e.required, true);
  assert.equal(e2e.reason, 'script npm falta no declarado en package.json');
  assert.equal(e2e.durationSeconds, null);
  assert.equal(regression.outcome, 'not-executable');
  assert.equal(regression.reason, 'e2e-regression no declara command');
});

test('run: clave ausente de verify → absent con advertencia; el orden de suites es fijo (V-5)', (t) => {
  const root = makeRepo(t);
  writeConfig(root, verifyYaml({ 'e2e-regression': { command: ok, required: false }, integration: { command: ok, required: true } }));
  const { json } = runCli(['run', '--repo-root', root]);
  assert.deepEqual(json.suites.map((s) => s.key), EPIC_SUITE_KEYS);
  assert.equal(json.suites[1].outcome, 'absent');
  assert.equal(json.suites[1].declared, false);
  assert.equal(json.suites[1].command, null);
  assert.equal(json.suites[1].reason, 'clave e2e no declarada en verify');
  assert.deepEqual(json.warnings, ['clave e2e no declarada en verify']);
  assert.equal(json.suites[0].outcome, 'pass');
  assert.equal(json.suites[2].outcome, 'pass');
});

test('run: sin sddf.config.yaml → tres absent con la advertencia y salida 0', (t) => {
  const root = makeRepo(t);
  const { status, json } = runCli(['run', '--repo-root', root]);
  assert.equal(status, 0);
  assert.ok(json.suites.every((s) => s.outcome === 'absent'));
  assert.deepEqual(json.warnings, ['sddf.config.yaml no existe']);
});

test('run: sddf.config.yaml ilegible → ok: false y salida 1', (t) => {
  const root = makeRepo(t);
  fs.mkdirSync(path.join(root, 'sddf.config.yaml'));
  const { status, stdout } = runCli(['run', '--repo-root', root]);
  assert.equal(status, 1);
  assert.equal(JSON.parse(stdout).ok, false);
});

test('run --full-output agrega output por suite lanzada y null por suite no lanzada', (t) => {
  const root = makeRepo(t, { scripts: {} });
  const marca = `${NODE} -e "console.log('SDDF-SUITE-1')"`;
  writeConfig(root, verifyYaml({ integration: { command: marca, required: true }, e2e: { command: 'npm run falta', required: false } }));
  const full = runCli(['run', '--full-output', '--repo-root', root]).json;
  const plain = runCli(['run', '--repo-root', root]).json;
  assert.ok(full.suites[0].output.includes('SDDF-SUITE-1'));
  assert.equal(full.suites[1].output, null);
  assert.equal(full.suites[2].output, null);
  assert.ok(plain.suites.every((s) => !Object.prototype.hasOwnProperty.call(s, 'output')));
  assert.deepEqual(full.suites.map(sinVolatiles), plain.suites.map(sinVolatiles));
});

test('check-command clasifica igual que run el mismo comando (V-6)', (t) => {
  const root = makeRepo(t, { scripts: {} });
  const commands = [ok, ko, 'npm run falta'];
  writeConfig(root, verifyYaml({ integration: { command: commands[0] }, e2e: { command: commands[1] }, 'e2e-regression': { command: commands[2] } }));
  const { json } = runCli(['run', '--repo-root', root]);
  for (const [i, suite] of json.suites.entries()) {
    const single = runCli(['check-command', '--repo-root', root, '--command', commands[i]]).json;
    assert.equal(single.outcome, suite.outcome, commands[i]);
    assert.equal(single.reason, suite.reason, commands[i]);
  }
});

test('run: argumentos inválidos → stderr y salida 2', (t) => {
  const root = makeRepo(t);
  for (const args of [['run'], ['run', '--repo-root'], ['run', '--repo-root', root, '--command', 'x'], ['run', '--repo-root', path.join(root, 'no-existe')]]) {
    const { status, stdout, stderr } = runCli(args);
    assert.equal(status, 2, `args: ${args.join(' ')}`);
    assert.equal(stdout, '');
    assert.ok(stderr.length > 0);
  }
});

test('run no escribe en REPO_ROOT (V-9)', (t) => {
  const root = makeRepo(t, { scripts: {} });
  writeConfig(root, verifyYaml({ integration: { command: ok, required: true }, e2e: { command: ko }, 'e2e-regression': { command: 'npm run falta' } }));
  const before = snapshot(root);
  runCli(['run', '--repo-root', root]);
  runCli(['run', '--full-output', '--repo-root', root]);
  assert.deepEqual(snapshot(root), before);
});
