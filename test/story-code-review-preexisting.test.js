'use strict';

/**
 * Tests de STORY-181: motor `skills/story-code-review/scripts/touched-lines.js`, que clasifica cada
 * `Archivo:Línea` de un hallazgo como `untouched`, `touched` o `unknown` respecto de la base de la
 * rama (design.md, D-1 a D-3), y contrato de la categoría PREEXISTENTE en `SKILL.md` y en la
 * plantilla del informe (D-6, CNF-2). Cubre las aserciones 1 a 7 de D-8. Cada caso de git opera
 * sobre un repositorio temporal; nunca sobre el repo real.
 */

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const SKILL_DIR = path.join(__dirname, '..', 'skills', 'story-code-review');
const SCRIPT = path.join(SKILL_DIR, 'scripts', 'touched-lines.js');
const { parseLocation, touchedLines, resolveBase, classifyLocations } = require(SCRIPT);

const lines = (prefix, n) => Array.from({ length: n }, (_, i) => `${prefix} ${i + 1}`);

function runGit(root, args) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `git ${args.join(' ')}\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}

function write(root, rel, content) {
  const file = path.join(root, ...rel.split('/'));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Array.isArray(content) ? `${content.join('\n')}\n` : content);
}

function tempDir(t, prefix = 'sddf-touched-') {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true, maxRetries: 3 }));
  return dir;
}

/** Repo temporal con la rama `branch` (por defecto `main`) y un commit inicial con `files`. */
function initRepo(t, { branch = 'main', files = {} } = {}) {
  const root = tempDir(t);
  runGit(root, ['init', '-q']);
  runGit(root, ['symbolic-ref', 'HEAD', `refs/heads/${branch}`]);
  runGit(root, ['config', 'core.autocrlf', 'false']);
  runGit(root, ['config', 'commit.gpgsign', 'false']);
  runGit(root, ['config', 'user.email', 'touched@example.test']);
  runGit(root, ['config', 'user.name', 'Touched Lines Tests']);
  for (const [rel, content] of Object.entries(files)) write(root, rel, content);
  commitAll(root, 'base');
  return root;
}

function commitAll(root, message) {
  runGit(root, ['add', '-A']);
  runGit(root, ['commit', '-q', '--allow-empty', '-m', message]);
}

/**
 * Rama `epic/x` desde `main` con:
 *   - `src/mod.js`: línea 5 cambiada en un commit de la rama; línea 15 cambiada sin commit.
 *   - `src/add.js`: línea nueva insertada tras la 3 (queda como línea 4).
 *   - `src/del.js`: línea 5 borrada (vecinas en el lado nuevo: 4 y 5).
 *   - `src/new.js`: archivo nuevo commiteado en la rama; `src/untracked.js`: sin seguimiento.
 */
function epicRepo(t) {
  const root = initRepo(t, {
    files: { 'src/mod.js': lines('mod', 20), 'src/add.js': lines('add', 10), 'src/del.js': lines('del', 10) },
  });
  runGit(root, ['checkout', '-q', '-b', 'epic/x']);
  const mod = lines('mod', 20);
  mod[4] = 'mod 5 cambiada en la rama';
  write(root, 'src/mod.js', mod);
  const add = lines('add', 10);
  add.splice(3, 0, 'add nueva');
  write(root, 'src/add.js', add);
  const del = lines('del', 10);
  del.splice(4, 1);
  write(root, 'src/del.js', del);
  write(root, 'src/new.js', lines('new', 5));
  commitAll(root, 'historia');
  mod[14] = 'mod 15 cambiada sin commit';
  write(root, 'src/mod.js', mod);
  write(root, 'src/untracked.js', lines('untracked', 5));
  return root;
}

function statusOf(result, location) {
  const entry = result.locations.find((l) => l.location === location);
  assert.ok(entry, `sin resultado para ${location}`);
  return entry.status;
}

function runCli(args, env) {
  return spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8', env: env || process.env });
}

// ── Aserción 1: líneas sin tocar, modificadas, añadidas y vecinas de un borrado (AC-1, AC-2) ──

test('rama epic/x: una línea sin tocar es untouched; modificada, añadida y vecina de un borrado son touched', (t) => {
  const root = epicRepo(t);
  const result = classifyLocations({
    repoRoot: root,
    locations: ['src/mod.js:2', 'src/mod.js:5', 'src/add.js:4', 'src/add.js:8', 'src/del.js:4', 'src/del.js:5', 'src/del.js:8'],
  });
  assert.equal(result.ok, true);
  assert.equal(result.applied, true);
  assert.equal(result.baseRef, 'main');
  assert.match(result.base, /^[0-9a-f]{40}$/);
  assert.equal(statusOf(result, 'src/mod.js:2'), 'untouched');
  assert.equal(statusOf(result, 'src/mod.js:5'), 'touched');
  assert.equal(statusOf(result, 'src/add.js:4'), 'touched');
  assert.equal(statusOf(result, 'src/add.js:8'), 'untouched');
  assert.equal(statusOf(result, 'src/del.js:4'), 'touched');
  assert.equal(statusOf(result, 'src/del.js:5'), 'touched');
  assert.equal(statusOf(result, 'src/del.js:8'), 'untouched');
  for (const entry of result.locations) assert.equal(typeof entry.why, 'string');
});

// ── Aserción 2: cambio commiteado en la rama más cambio sin commit (D-1) ──

test('una línea cambiada en un commit de la rama y otra sin commit son ambas touched', (t) => {
  const root = epicRepo(t);
  const result = classifyLocations({ repoRoot: root, locations: ['src/mod.js:5', 'src/mod.js:15', 'src/mod.js:10'] });
  assert.equal(statusOf(result, 'src/mod.js:5'), 'touched');
  assert.equal(statusOf(result, 'src/mod.js:15'), 'touched');
  assert.equal(statusOf(result, 'src/mod.js:10'), 'untouched');
});

// ── Aserción 3: archivo nuevo y rango parcialmente tocado (D-3) ──

test('archivo nuevo con y sin seguimiento y rango parcialmente tocado son touched', (t) => {
  const root = epicRepo(t);
  const result = classifyLocations({
    repoRoot: root,
    locations: ['src/new.js:2', 'src/untracked.js:1', 'src/mod.js:3-6', 'src/mod.js:1-3'],
  });
  assert.equal(statusOf(result, 'src/new.js:2'), 'touched');
  assert.equal(statusOf(result, 'src/untracked.js:1'), 'touched');
  assert.equal(statusOf(result, 'src/mod.js:3-6'), 'touched');
  assert.equal(statusOf(result, 'src/mod.js:1-3'), 'untouched');
});

// ── Aserción 4: ubicaciones sin evidencia → unknown; normalización de rutas (D-3) ──

test('sin línea, con .., absoluta o de archivo inexistente es unknown', (t) => {
  const root = epicRepo(t);
  const result = classifyLocations({
    repoRoot: root,
    locations: ['src/mod.js', '../fuera.js:1', '/abs/mod.js:1', 'src/missing.js:1', 'src/mod.js:6-4', 'varios archivos'],
  });
  for (const entry of result.locations) assert.equal(entry.status, 'unknown', entry.location);
});

test('parseLocation normaliza \\, ./ y comillas invertidas, y rechaza lo que no es <ruta>:<N>[-<M>]', () => {
  assert.deepEqual(parseLocation('src\\mod.js:2'), { file: 'src/mod.js', start: 2, end: 2 });
  assert.deepEqual(parseLocation('`./src/mod.js:3-6`'), { file: 'src/mod.js', start: 3, end: 6 });
  assert.equal(parseLocation('src/mod.js'), null);
  assert.equal(parseLocation('src/mod.js:6-4'), null);
  assert.equal(parseLocation('src/mod.js:0'), null);
  assert.equal(parseLocation('../fuera.js:1'), null);
  assert.equal(parseLocation('src/../fuera.js:1'), null);
  assert.equal(parseLocation('/abs/mod.js:1'), null);
  assert.equal(parseLocation('C:\\abs\\mod.js:1'), null);
});

test('una ruta con \\ se clasifica como la misma ruta con /', (t) => {
  const root = epicRepo(t);
  const result = classifyLocations({ repoRoot: root, locations: ['src\\mod.js:2', 'src\\mod.js:5'] });
  assert.equal(statusOf(result, 'src\\mod.js:2'), 'untouched');
  assert.equal(statusOf(result, 'src\\mod.js:5'), 'touched');
  assert.equal(result.locations[0].file, 'src/mod.js');
});

test('touchedLines lee los hunks -U0 del lado nuevo', () => {
  const diff = [
    'diff --git a/x b/x',
    '@@ -5 +5 @@',
    '-a',
    '+b',
    '@@ -9,0 +10,2 @@',
    '+c',
    '+d',
    '@@ -20,2 +20,0 @@',
    '-e',
    '-f',
  ].join('\n');
  assert.deepEqual([...touchedLines(diff)].sort((a, b) => a - b), [5, 10, 11, 20, 21]);
  assert.equal(touchedLines('').size, 0);
});

// ── Aserción 5: sin base determinable → applied: false (AC-3) ──

test('en la rama principal la clasificación no se aplica (on-main-branch)', (t) => {
  const root = initRepo(t, { files: { 'src/mod.js': lines('mod', 5) } });
  const result = classifyLocations({ repoRoot: root, locations: ['src/mod.js:2'] });
  assert.equal(result.ok, true);
  assert.equal(result.applied, false);
  assert.equal(result.reason, 'on-main-branch');
  assert.match(result.message, /rama principal/);
  assert.deepEqual(result.locations, []);
});

test('fuera de un repositorio git → not-a-repo', (t) => {
  const root = tempDir(t);
  const base = resolveBase(root);
  assert.equal(base.applied, false);
  assert.equal(base.reason, 'not-a-repo');
  assert.equal(base.message, 'el directorio no es un repositorio git');
});

test('HEAD separado → detached-head', (t) => {
  const root = initRepo(t, { files: { 'a.txt': 'a\n' } });
  runGit(root, ['checkout', '-q', '--detach']);
  assert.equal(resolveBase(root).reason, 'detached-head');
});

test('sin main, master ni origin/HEAD → no-main-branch', (t) => {
  const root = initRepo(t, { branch: 'trunk', files: { 'a.txt': 'a\n' } });
  runGit(root, ['checkout', '-q', '-b', 'feature']);
  assert.equal(resolveBase(root).reason, 'no-main-branch');
});

test('master sirve de rama principal si no hay main', (t) => {
  const root = initRepo(t, { branch: 'master', files: { 'a.txt': 'a\n' } });
  runGit(root, ['checkout', '-q', '-b', 'feature']);
  const base = resolveBase(root);
  assert.equal(base.applied, true);
  assert.equal(base.baseRef, 'master');
});

test('origin/HEAD tiene prioridad sobre las ramas locales y en su rama local da on-main-branch', (t) => {
  const root = initRepo(t, { branch: 'trunk', files: { 'a.txt': 'a\n' } });
  runGit(root, ['update-ref', 'refs/remotes/origin/main', 'HEAD']);
  runGit(root, ['symbolic-ref', 'refs/remotes/origin/HEAD', 'refs/remotes/origin/main']);
  runGit(root, ['checkout', '-q', '-b', 'feature']);
  const base = resolveBase(root);
  assert.equal(base.applied, true);
  assert.equal(base.baseRef, 'origin/main');
  runGit(root, ['checkout', '-q', '-b', 'main']);
  assert.equal(resolveBase(root).reason, 'on-main-branch');
});

test('sin ancestro común con la rama principal → no-merge-base', (t) => {
  const root = initRepo(t, { files: { 'a.txt': 'a\n' } });
  runGit(root, ['checkout', '-q', '--orphan', 'huerfana']);
  commitAll(root, 'huérfana');
  assert.equal(resolveBase(root).reason, 'no-merge-base');
});

// ── Aserción 6: CLI (I-1) ──

test('CLI classify: exit 0 con un único objeto JSON de I-2', (t) => {
  const root = epicRepo(t);
  const dir = tempDir(t, 'sddf-touched-loc-');
  const file = path.join(dir, 'locations.json');
  fs.writeFileSync(file, JSON.stringify(['src/mod.js:2', 'src/mod.js:5']));
  const result = runCli(['classify', '--repo-root', root, '--locations', file]);
  assert.equal(result.status, 0, result.stderr);
  const out = JSON.parse(result.stdout);
  assert.deepEqual(Object.keys(out).sort(), ['applied', 'base', 'baseRef', 'locations', 'message', 'ok', 'reason']);
  assert.deepEqual(Object.keys(out.locations[0]).sort(), ['end', 'file', 'location', 'start', 'status', 'why']);
  assert.deepEqual(out.locations.map((l) => l.status), ['untouched', 'touched']);
});

test('CLI classify: exit 0 también si la clasificación no se aplica', (t) => {
  const root = initRepo(t, { files: { 'a.txt': 'a\n' } });
  const dir = tempDir(t, 'sddf-touched-loc-');
  const file = path.join(dir, 'locations.json');
  fs.writeFileSync(file, '["a.txt:1"]');
  const result = runCli(['classify', '--repo-root', root, '--locations', file]);
  assert.equal(result.status, 0, result.stderr);
  const out = JSON.parse(result.stdout);
  assert.equal(out.applied, false);
  assert.equal(out.reason, 'on-main-branch');
});

test('CLI classify: sin git en el PATH → git-unavailable', (t) => {
  const root = tempDir(t);
  const dir = tempDir(t, 'sddf-touched-loc-');
  const file = path.join(dir, 'locations.json');
  fs.writeFileSync(file, '[]');
  const env = { ...process.env, PATH: dir, Path: dir };
  const result = runCli(['classify', '--repo-root', root, '--locations', file], env);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).reason, 'git-unavailable');
});

// ── Aserción 7: contrato de la categoría en SKILL.md y en la plantilla (D-6, CNF-1, CNF-2) ──

test('SKILL.md declara PREEXISTENTE, el motor y {{PREEXISTING_STATUS}} sin git show ni git diff --name-only', () => {
  const skill = fs.readFileSync(path.join(SKILL_DIR, 'SKILL.md'), 'utf8');
  for (const needle of ['PREEXISTENTE', '🟣 PREEXISTENTE (', 'touched-lines.js', '{{PREEXISTING_STATUS}}', '#### 4a.2.']) {
    assert.ok(skill.includes(needle), `SKILL.md no contiene ${needle}`);
  }
  assert.ok(!skill.includes('git show'), 'SKILL.md no debe contener git show');
  assert.ok(!skill.includes('git diff --name-only'), 'SKILL.md no debe contener git diff --name-only');
});

test('la plantilla tiene la fila de hallazgos preexistentes y su frontmatter no menciona PREEXISTENTE', () => {
  const template = fs.readFileSync(path.join(SKILL_DIR, 'assets', 'code-review-report-template.md'), 'utf8');
  assert.ok(template.includes('| Hallazgos preexistentes | {{PREEXISTING_STATUS}} |'));
  const frontmatter = template.split(/^---$/m)[1];
  assert.ok(frontmatter.includes('max-severity: {{MAX_SEVERITY}}'));
  assert.ok(frontmatter.includes('verdict: {{VERDICT}}'));
  assert.ok(!frontmatter.includes('PREEXISTENTE'));
  assert.ok(!frontmatter.includes('PREEXISTING'));
});

test('CLI: exit 2 sin --locations, con JSON ilegible o con subcomando desconocido', (t) => {
  const root = tempDir(t);
  const dir = tempDir(t, 'sddf-touched-loc-');
  const bad = path.join(dir, 'bad.json');
  fs.writeFileSync(bad, '{no es json');
  const notArray = path.join(dir, 'obj.json');
  fs.writeFileSync(notArray, '{"a":1}');
  const mixed = path.join(dir, 'mixed.json');
  fs.writeFileSync(mixed, '["a.txt:1", 3]');
  for (const args of [
    ['classify', '--repo-root', root],
    ['classify', '--locations', bad],
    ['classify', '--repo-root', root, '--locations', bad],
    ['classify', '--repo-root', root, '--locations', notArray],
    ['classify', '--repo-root', root, '--locations', mixed],
    ['classify', '--repo-root', root, '--locations', path.join(dir, 'missing.json')],
    ['otro', '--repo-root', root, '--locations', bad],
    [],
  ]) {
    const result = runCli(args);
    assert.equal(result.status, 2, `args: ${args.join(' ')}\n${result.stdout}`);
    assert.equal(result.stdout, '');
    assert.notEqual(result.stderr.trim(), '');
  }
});
