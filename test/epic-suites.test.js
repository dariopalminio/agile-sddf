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

test('comando de smoke tests con el ID ya sustituido se clasifica como cualquier otro', (t) => {
  const root = makeRepo(t);
  const smoke = (id) => `${NODE} -e "process.exit(process.argv[1]==='SMOKE-2'?1:0)" ${id}`;
  assert.equal(runCli(['check-command', '--repo-root', root, '--command', smoke('SMOKE-2')]).json.outcome, 'fail');
  assert.equal(runCli(['check-command', '--repo-root', root, '--command', smoke('SMOKE-1')]).json.outcome, 'pass');
  assert.equal(runCli(['check-command', '--repo-root', root, '--command', 'echo {{smoke_id}}']).json.outcome, 'pass');
});
