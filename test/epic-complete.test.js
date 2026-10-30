'use strict';

/**
 * Tests de STORY-171: motor `skills/epic-complete/scripts/epic-complete.js`, que completa
 * (`SHIP/DONE` → `COMPLETED/DONE`) y archiva una épica en
 * `specs/flow/archive/<YYYY-MM-DD>-EPIC-NN-<slug>/` (ADR-0019). Cubre los contratos de verificación
 * 1–8 de `design.md`: cierre con escritura mínima del frontmatter (D-5), `git mv` sin commit (D-7,
 * CNF-1), resolución de la versión liberada (D-4), admisión por estado (AC-2, D-9), fecha de archivo
 * (D-6, CNF-2), búsqueda determinista, restauración ante fallo (D-8) y la CLI `plan|apply`. Cada caso
 * opera sobre un directorio temporal; nunca sobre el repo real.
 */

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const SCRIPT = path.join(__dirname, '..', 'skills', 'epic-complete', 'scripts', 'epic-complete.js');
const { locateEpic, archiveDateOf, releasedVersionOf, planCompletion, applyCompletion } = require(SCRIPT);

const TODAY = '2026-10-30';
const NAME = 'EPIC-31-exportaciones';
const BODY = Array.from({ length: 10 }, (_, i) => `Línea ${i + 1} del cuerpo de la épica.`);

const changelogWith = (heading, epicId = 'EPIC-31') => [
  '# Changelog', '', '## [Unreleased]', '', ...(heading === 'Unreleased' ? [] : [`## [${heading}] — 2026-10-28`, '']),
  `<!-- epic-ship:${epicId}:start -->`, '### Added', '', '- Exportar CSV (STORY-201)', `<!-- epic-ship:${epicId}:end -->`, '',
  '## [1.0.0] — 2026-01-01', '', '- Inicial', '',
].join('\n');

function runGit(root, args) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `git ${args.join(' ')}\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function epicContent(fields, eol = '\n') {
  return ['---', ...Object.entries(fields).map(([k, v]) => `${k}: ${v}`), '---', '', '# Épica', '', ...BODY, ''].join(eol);
}

function epicFile(root, rel) {
  return path.join(root, ...rel.split('/'), 'epic.md');
}

function fm(status, substatus, dates = { created: '2026-09-01', updated: '2026-10-28' }) {
  return { type: 'epic', id: 'EPIC-31', status, substatus, ...dates };
}

/**
 * Directorio temporal con `specs/flow/`, `CHANGELOG.md` y, salvo `git: false`, un repo git con todo
 * commiteado. `epics` mapea nombre de directorio (relativo a `specs/flow/`) → frontmatter o contenido literal.
 */
function makeFixture(t, { epics = { [NAME]: fm('SHIP', 'DONE') }, changelog = changelogWith('2.1.0'), git = true, extra } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sddf-epic-complete-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true, maxRetries: 3 }));
  for (const [name, fields] of Object.entries(epics)) {
    write(epicFile(root, `specs/flow/${name}`), typeof fields === 'string' ? fields : epicContent(fields));
    write(path.join(root, 'specs', 'flow', name, 'release-notes.md'), `# Release notes ${name}\n`);
  }
  write(path.join(root, 'specs', 'flow', 'STORY-201-exportar-csv', 'story.md'), '# Historia\n');
  if (changelog !== null) write(path.join(root, 'CHANGELOG.md'), changelog);
  if (git) {
    runGit(root, ['init', '-q']);
    runGit(root, ['config', 'core.autocrlf', 'false']);
    runGit(root, ['config', 'user.email', 'epic-complete@example.test']);
    runGit(root, ['config', 'user.name', 'Epic Complete Tests']);
    runGit(root, ['add', '-A']);
    runGit(root, ['commit', '-q', '-m', 'fixture']);
  }
  if (extra) extra(root);
  return root;
}

/** Archivos y directorios bajo root, relativos con '/', sin `.git/`. */
function listFiles(root, dir = '') {
  const out = [];
  for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const rel = dir ? `${dir}/${entry.name}` : entry.name;
    if (rel === '.git') continue;
    if (entry.isDirectory()) out.push(`${rel}/`, ...listFiles(root, rel));
    else out.push(rel);
  }
  return out.sort();
}

function snapshot(root) {
  const files = listFiles(root);
  const contents = files.filter((f) => !f.endsWith('/')).map((f) => fs.readFileSync(path.join(root, f), 'utf8'));
  const status = fs.existsSync(path.join(root, '.git')) ? runGit(root, ['status', '--porcelain', '--untracked-files=all']) : null;
  return { files, contents, status };
}

// ── Contratos 1–2 — cierre confirmado (AC-1, CNF-1) ─────────────────────────────────

test('SHIP/DONE → plan complete con versión de CHANGELOG.md, fecha de hoy y git-mv, sin escribir (AC-1)', (t) => {
  const root = makeFixture(t);
  const before = snapshot(root);
  const result = planCompletion({ repoRoot: root, id: 'EPIC-31', today: TODAY });
  assert.equal(result.ok, true, result.message);
  assert.equal(result.code, 'OK');
  assert.equal(result.action, 'complete');
  assert.equal(result.version, '2.1.0');
  assert.equal(result.versionSource, 'changelog');
  assert.equal(result.archiveDate, TODAY);
  assert.equal(result.from, `specs/flow/${NAME}`);
  assert.equal(result.to, `specs/flow/archive/${TODAY}-${NAME}`);
  assert.equal(result.moveMethod, 'git-mv');
  assert.deepEqual(result.epic, { id: 'EPIC-31', dir: `specs/flow/${NAME}`, status: 'SHIP', substatus: 'DONE' });
  assert.deepEqual(result.warnings, []);
  assert.deepEqual(snapshot(root), before, 'plan no escribe');
});

test('SHIP/DONE + apply → COMPLETED/DONE con updated/completed de hoy y version, archivada y ausente de specs/flow/ (contrato 1)', (t) => {
  const root = makeFixture(t);
  const original = fs.readFileSync(epicFile(root, `specs/flow/${NAME}`), 'utf8');
  const result = applyCompletion({ repoRoot: root, id: 'EPIC-31', today: TODAY });
  assert.equal(result.ok, true, result.message);
  assert.equal(result.message, `EPIC-31 archivada en specs/flow/archive/${TODAY}-${NAME}/`);
  assert.equal(fs.existsSync(path.join(root, 'specs', 'flow', NAME)), false);
  const archived = fs.readFileSync(epicFile(root, result.to), 'utf8');
  const expected = original
    .replace('status: SHIP', 'status: COMPLETED')
    .replace('updated: 2026-10-28', `updated: ${TODAY}\ncompleted: ${TODAY}\nversion: 2.1.0`);
  assert.equal(archived, expected);
  assert.match(archived, /^substatus: DONE$/m);
  assert.ok(fs.existsSync(path.join(root, ...result.to.split('/'), 'release-notes.md')), 'el resto del directorio viaja');
  assert.deepEqual(result.counts, { before: 1, after: 1 });
});

test('con historial: git status muestra el rename R, no hay commit nuevo y git log --follow conserva la historia (contrato 2, CNF-1)', (t) => {
  const root = makeFixture(t);
  const head = runGit(root, ['rev-parse', 'HEAD']).trim();
  const result = applyCompletion({ repoRoot: root, id: 'EPIC-31', today: TODAY });
  assert.equal(result.moveMethod, 'git-mv');
  assert.equal(runGit(root, ['rev-parse', 'HEAD']).trim(), head, 'sin commit nuevo');
  const porcelain = runGit(root, ['status', '--porcelain']);
  assert.match(porcelain, new RegExp(`^R. specs/flow/${NAME}/release-notes\\.md -> specs/flow/archive/${TODAY}-${NAME}/release-notes\\.md$`, 'm'));
  runGit(root, ['add', '-A']);
  runGit(root, ['commit', '-q', '-m', 'archivar']);
  const log = runGit(root, ['log', '--follow', '--format=%s', '--', `${result.to}/epic.md`]);
  assert.deepEqual(log.trim().split('\n'), ['archivar', 'fixture']);
});

test('sin updated:, completed: ni version: → se insertan en orden tras created: (D-5)', (t) => {
  const root = makeFixture(t, { epics: { [NAME]: fm('SHIP', 'DONE', { created: '2026-09-01' }) } });
  const result = applyCompletion({ repoRoot: root, id: 'EPIC-31', today: TODAY });
  assert.equal(result.ok, true, result.message);
  assert.match(fs.readFileSync(epicFile(root, result.to), 'utf8'), /^created: 2026-09-01\nupdated: 2026-10-30\ncompleted: 2026-10-30\nversion: 2\.1\.0\n---/m);
});

test('completed: y version: existentes se reemplazan sin duplicarse (D-5)', (t) => {
  const root = makeFixture(t, { epics: { [NAME]: { ...fm('SHIP', 'DONE'), completed: '2026-01-01', version: '0.0.1' } } });
  const result = applyCompletion({ repoRoot: root, id: 'EPIC-31', today: TODAY });
  assert.equal(result.ok, true, result.message);
  const archived = fs.readFileSync(epicFile(root, result.to), 'utf8');
  assert.equal(archived.match(/^completed:/gm).length, 1);
  assert.equal(archived.match(/^version:/gm).length, 1);
  assert.match(archived, /^completed: 2026-10-30$/m);
  assert.match(archived, /^version: 2\.1\.0$/m);
});

// ── Contrato 3 — versión liberada (D-4) ─────────────────────────────────────────────

test('releasedVersionOf: encabezado de versión, [Unreleased], sin bloque y sin encabezado', () => {
  assert.deepEqual(releasedVersionOf(changelogWith('2.1.0'), 'EPIC-31'), { version: '2.1.0', reason: 'found' });
  assert.deepEqual(releasedVersionOf(changelogWith('v3.0.0-rc.1'), 'EPIC-31'), { version: '3.0.0-rc.1', reason: 'found' });
  assert.deepEqual(releasedVersionOf(changelogWith('Unreleased'), 'EPIC-31'), { version: null, reason: 'unreleased' });
  assert.deepEqual(releasedVersionOf(changelogWith('2.1.0', 'EPIC-3'), 'EPIC-31'), { version: null, reason: 'no-block' });
  assert.deepEqual(releasedVersionOf('<!-- epic-ship:EPIC-31:start -->\n<!-- epic-ship:EPIC-31:end -->\n', 'EPIC-31'), { version: null, reason: 'unreleased' });
  assert.deepEqual(releasedVersionOf(changelogWith('2.1.0').replace(/\n/g, '\r\n'), 'EPIC-31'), { version: '2.1.0', reason: 'found' });
});

test('--version v1.4.0 → 1.4.0 con versionSource argument y aviso si CHANGELOG.md ubica otra versión', (t) => {
  const root = makeFixture(t);
  const result = planCompletion({ repoRoot: root, id: 'EPIC-31', version: 'v1.4.0', today: TODAY });
  assert.equal(result.ok, true, result.message);
  assert.equal(result.version, '1.4.0');
  assert.equal(result.versionSource, 'argument');
  assert.deepEqual(result.warnings, ['⚠️ CHANGELOG.md ubica EPIC-31 en 2.1.0; se usará --version 1.4.0']);
  const same = planCompletion({ repoRoot: root, id: 'EPIC-31', version: '2.1.0', today: TODAY });
  assert.deepEqual(same.warnings, []);
});

test('--version gana sobre un CHANGELOG.md sin bloque o ausente', (t) => {
  for (const changelog of [null, '# Changelog\n']) {
    const root = makeFixture(t, { changelog });
    const result = planCompletion({ repoRoot: root, id: 'EPIC-31', version: '1.4.0', today: TODAY });
    assert.equal(result.ok, true, result.message);
    assert.equal(result.version, '1.4.0');
    assert.deepEqual(result.warnings, []);
  }
});

for (const [label, changelog, reason, pattern] of [
  ['bloque bajo [Unreleased]', changelogWith('Unreleased'), 'unreleased', /sigue en \[Unreleased\]: promuévela a ## \[x\.y\.z\]/],
  ['CHANGELOG.md sin bloque', '# Changelog\n\n## [Unreleased]\n', 'no-block', /no se encontró la entrada de EPIC-31 en CHANGELOG\.md/],
  ['sin CHANGELOG.md', null, 'no-changelog', /no se encontró la entrada de EPIC-31 en CHANGELOG\.md/],
]) {
  test(`${label} y sin --version → NO_VERSION (${reason}) pidiendo --version, árbol intacto`, (t) => {
    const root = makeFixture(t, { changelog });
    const before = snapshot(root);
    const result = applyCompletion({ repoRoot: root, id: 'EPIC-31', today: TODAY });
    assert.equal(result.ok, false);
    assert.equal(result.code, 'NO_VERSION');
    assert.equal(result.reason, reason);
    assert.match(result.message, pattern);
    assert.match(result.message, /--version x\.y\.z/);
    assert.deepEqual(snapshot(root), before);
  });
}

// ── Contrato 4 — épica no liberada (AC-2) ───────────────────────────────────────────

for (const [status, substatus] of [['VALIDATE', 'DONE'], ['DEVELOP', 'IN-PROGRESS'], ['CANCELED', 'DONE'], ['SHIP', 'IN-PROGRESS']]) {
  test(`${status}/${substatus} → NOT_SHIPPED con el mensaje de AC-2, sin cambios`, (t) => {
    const root = makeFixture(t, { epics: { [NAME]: fm(status, substatus) } });
    const before = snapshot(root);
    const result = applyCompletion({ repoRoot: root, id: 'EPIC-31', today: TODAY });
    assert.equal(result.ok, false);
    assert.equal(result.code, 'NOT_SHIPPED');
    assert.ok(result.message.startsWith(`La épica EPIC-31 está en ${status}/${substatus}: solo se completan épicas en SHIP/DONE, COMPLETED/DONE o CANCELED/DONE.`), result.message);
    if (`${status}/${substatus}` === 'VALIDATE/DONE') assert.match(result.message, /Ejecuta antes \/epic-ship EPIC-31$/);
    else assert.doesNotMatch(result.message, /epic-ship/);
    assert.deepEqual(snapshot(root), before);
  });
}

// ── Contrato 5 — épica ya completada (CNF-2) ────────────────────────────────────────

test('COMPLETED/DONE → archive-only con la fecha de updated:, created: o date: (solo sin las otras dos)', (t) => {
  const cases = [
    [{ created: '2026-09-01', updated: '2026-09-15' }, '2026-09-15'],
    [{ created: '2026-09-01' }, '2026-09-01'],
    [{ created: '2026-09-01', updated: 'pronto' }, '2026-09-01'],
    [{ date: '2026-07-15' }, '2026-07-15'],
  ];
  for (const [dates, expected] of cases) {
    const root = makeFixture(t, { epics: { [NAME]: fm('COMPLETED', 'DONE', dates) }, changelog: null });
    const result = planCompletion({ repoRoot: root, id: 'EPIC-31', today: TODAY });
    assert.equal(result.ok, true, result.message);
    assert.equal(result.action, 'archive-only');
    assert.equal(result.version, null);
    assert.equal(result.archiveDate, expected, JSON.stringify(dates));
    assert.equal(result.to, `specs/flow/archive/${expected}-${NAME}`);
  }
});

test('COMPLETED/DONE + apply → epic.md byte a byte igual tras archivar', (t) => {
  const root = makeFixture(t, { epics: { [NAME]: fm('COMPLETED', 'DONE') } });
  const original = fs.readFileSync(epicFile(root, `specs/flow/${NAME}`));
  const result = applyCompletion({ repoRoot: root, id: 'EPIC-31', today: TODAY });
  assert.equal(result.ok, true, result.message);
  assert.equal(result.to, `specs/flow/archive/2026-10-28-${NAME}`);
  assert.ok(fs.readFileSync(epicFile(root, result.to)).equals(original));
});

test('COMPLETED/DONE sin fecha válida → NO_ARCHIVE_DATE nombrando los tres campos, sin cambios', (t) => {
  for (const dates of [{ date: 'ayer' }, { updated: 'x', date: '2026-07-15' }]) {
    const root = makeFixture(t, { epics: { [NAME]: fm('COMPLETED', 'DONE', dates) } });
    const before = snapshot(root);
    const result = applyCompletion({ repoRoot: root, id: 'EPIC-31', today: TODAY });
    assert.equal(result.code, 'NO_ARCHIVE_DATE', JSON.stringify(dates));
    for (const field of ['updated:', 'created:', 'date:']) assert.ok(result.message.includes(field), result.message);
    assert.deepEqual(snapshot(root), before);
  }
});

test('archiveDateOf: cadena updated: → created: → date: (solo si faltan ambas claves)', () => {
  assert.equal(archiveDateOf({ updated: '2026-01-02', created: '2026-01-01' }), '2026-01-02');
  assert.equal(archiveDateOf({ updated: 'x', created: '2026-01-01' }), '2026-01-01');
  assert.equal(archiveDateOf({ date: '2026-01-01' }), '2026-01-01');
  assert.equal(archiveDateOf({ updated: 'x', date: '2026-01-01' }), null);
  assert.equal(archiveDateOf({}), null);
});

// ── Contrato 6 — localización y conflictos ──────────────────────────────────────────

test('ID sin coincidencia → NOT_FOUND con la ruta buscada; con pista si ya está archivada', (t) => {
  const root = makeFixture(t, { epics: { [NAME]: fm('SHIP', 'DONE'), 'archive/2026-05-01-EPIC-07-vieja': fm('COMPLETED', 'DONE') } });
  const before = snapshot(root);
  const missing = planCompletion({ repoRoot: root, id: 'EPIC-99', today: TODAY });
  assert.equal(missing.code, 'NOT_FOUND');
  assert.match(missing.message, /specs\/flow\/EPIC-99-\*\//);
  assert.doesNotMatch(missing.message, /ya archivada/);
  const archived = planCompletion({ repoRoot: root, id: 'EPIC-07', today: TODAY });
  assert.equal(archived.code, 'NOT_FOUND');
  assert.match(archived.message, /ya archivada en specs\/flow\/archive\/2026-05-01-EPIC-07-vieja\//);
  assert.deepEqual(snapshot(root), before);
});

test('dos directorios EPIC-NN-* → AMBIGUOUS con ambas rutas; EPIC-3 no casa EPIC-31', (t) => {
  const root = makeFixture(t, { epics: { 'EPIC-31-a': fm('SHIP', 'DONE'), 'EPIC-31-b': fm('SHIP', 'DONE'), 'EPIC-310-c': fm('SHIP', 'DONE') } });
  const result = locateEpic({ repoRoot: root, id: 'EPIC-31' });
  assert.equal(result.code, 'AMBIGUOUS');
  assert.deepEqual(result.matches, ['specs/flow/EPIC-31-a', 'specs/flow/EPIC-31-b']);
});

test('--path bajo archive/, anidado o fuera de specs/flow/ → INVALID_PATH; ruta válida se acepta', (t) => {
  const root = makeFixture(t, { epics: { [NAME]: fm('SHIP', 'DONE'), 'archive/2026-05-01-EPIC-07-vieja': fm('COMPLETED', 'DONE') } });
  for (const epicPath of ['specs/flow/archive/2026-05-01-EPIC-07-vieja', `specs/flow/${NAME}/sub`, 'docs/EPIC-31-x', 'specs/flow/STORY-201-exportar-csv']) {
    const result = locateEpic({ repoRoot: root, epicPath });
    assert.equal(result.code, 'INVALID_PATH', epicPath);
    assert.match(result.message, /specs\/flow\/EPIC-NN-<slug>/);
  }
  assert.deepEqual(locateEpic({ repoRoot: root, epicPath: `specs/flow/${NAME}/` }), { ok: true, dir: `specs/flow/${NAME}` });
  assert.equal(locateEpic({ repoRoot: root, epicPath: path.join(root, 'specs', 'flow', NAME) }).dir, `specs/flow/${NAME}`);
});

test('directorio sin epic.md → NO_EPIC_FILE; frontmatter sin status → NO_STATUS', (t) => {
  const root = makeFixture(t, {
    epics: { [NAME]: { type: 'epic', id: 'EPIC-31', created: '2026-09-01' } },
    extra: (r) => write(path.join(r, 'specs', 'flow', 'EPIC-32-vacia', 'notes.md'), '# N\n'),
  });
  const noFile = planCompletion({ repoRoot: root, id: 'EPIC-32', today: TODAY });
  assert.equal(noFile.code, 'NO_EPIC_FILE');
  assert.match(noFile.message, /specs\/flow\/EPIC-32-vacia/);
  const noStatus = planCompletion({ repoRoot: root, id: 'EPIC-31', today: TODAY });
  assert.equal(noStatus.code, 'NO_STATUS');
  assert.match(noStatus.message, /status, substatus/);
});

test('destino existente → ARCHIVE_CONFLICT con la ruta, sin cambios; también si aparece entre plan y apply', (t) => {
  const root = makeFixture(t);
  assert.equal(planCompletion({ repoRoot: root, id: 'EPIC-31', today: TODAY }).ok, true);
  fs.mkdirSync(path.join(root, 'specs', 'flow', 'archive', `${TODAY}-${NAME}`), { recursive: true });
  const before = snapshot(root);
  const result = applyCompletion({ repoRoot: root, id: 'EPIC-31', today: TODAY });
  assert.equal(result.code, 'ARCHIVE_CONFLICT');
  assert.ok(result.message.includes(`specs/flow/archive/${TODAY}-${NAME}/`), result.message);
  assert.deepEqual(snapshot(root), before);
});

// ── Contrato 7 — fallos de apply y finales de línea ────────────────────────────────

test('git mv forzado a fallar → MOVE_FAILED, epic.md restaurado byte a byte y conteo igual', (t) => {
  const root = makeFixture(t);
  const file = epicFile(root, `specs/flow/${NAME}`);
  const original = fs.readFileSync(file);
  fs.writeFileSync(path.join(root, '.git', 'index.lock'), '');
  const result = applyCompletion({ repoRoot: root, id: 'EPIC-31', today: TODAY });
  assert.equal(result.ok, false);
  assert.equal(result.code, 'MOVE_FAILED');
  assert.match(result.message, /epic\.md se restauró/);
  assert.ok(fs.readFileSync(file).equals(original), 'epic.md restaurado');
  assert.equal(fs.existsSync(path.join(root, 'specs', 'flow', 'archive', `${TODAY}-${NAME}`)), false);
  assert.deepEqual(result.counts, { before: 1, after: 1 });
});

test('epic.md con \\r\\n conserva \\r\\n en las líneas reemplazadas e insertadas', (t) => {
  const root = makeFixture(t, { epics: { [NAME]: epicContent(fm('SHIP', 'DONE'), '\r\n') } });
  const result = applyCompletion({ repoRoot: root, id: 'EPIC-31', today: TODAY });
  assert.equal(result.ok, true, result.message);
  const archived = fs.readFileSync(epicFile(root, result.to), 'utf8');
  for (const line of ['status: COMPLETED', `updated: ${TODAY}`, `completed: ${TODAY}`, 'version: 2.1.0']) assert.ok(archived.includes(`${line}\r\n`), line);
  assert.equal(archived.replace(/\r\n/g, '').includes('\n'), false, 'sin \\n sueltos');
});

test('epic.md con BOM → se escribe sin BOM', (t) => {
  const root = makeFixture(t, { epics: { [NAME]: `﻿${epicContent(fm('SHIP', 'DONE'))}` } });
  const result = applyCompletion({ repoRoot: root, id: 'EPIC-31', today: TODAY });
  assert.equal(result.ok, true, result.message);
  assert.notEqual(fs.readFileSync(epicFile(root, result.to))[0], 0xef);
});

test('directorio sin historial de git → moveMethod rename con aviso', (t) => {
  const root = makeFixture(t, { git: false });
  const plan = planCompletion({ repoRoot: root, id: 'EPIC-31', today: TODAY });
  assert.equal(plan.moveMethod, 'rename');
  assert.ok(plan.warnings.includes(`⚠️ specs/flow/${NAME} no tiene historial de git: se moverá sin git mv`), plan.warnings.join('\n'));
  const result = applyCompletion({ repoRoot: root, id: 'EPIC-31', today: TODAY });
  assert.equal(result.ok, true, result.message);
  assert.ok(result.warnings.includes(`⚠️ specs/flow/${NAME} no tiene historial de git: se movió sin git mv`), result.warnings.join('\n'));
  assert.ok(fs.existsSync(epicFile(root, result.to)));
  assert.equal(fs.existsSync(path.join(root, 'specs', 'flow', NAME)), false);
});

// ── Contrato 8 — CLI ────────────────────────────────────────────────────────────────

function cli(args) {
  return spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8' });
}

test('CLI: plan admitido → exit 0 y JSON ok: true; rechazo → exit 1 y ok: false', (t) => {
  const root = makeFixture(t, { epics: { [NAME]: fm('SHIP', 'DONE'), 'EPIC-32-validada': { ...fm('VALIDATE', 'DONE'), id: 'EPIC-32' } } });
  const ok = cli(['plan', '--repo-root', root, '--id', 'EPIC-31']);
  assert.equal(ok.status, 0, ok.stderr);
  const okJson = JSON.parse(ok.stdout);
  assert.equal(okJson.ok, true);
  assert.equal(okJson.version, '2.1.0');
  assert.match(okJson.archiveDate, /^\d{4}-\d{2}-\d{2}$/);
  const rejected = cli(['plan', '--repo-root', root, '--path', 'specs/flow/EPIC-32-validada']);
  assert.equal(rejected.status, 1);
  assert.equal(JSON.parse(rejected.stdout).code, 'NOT_SHIPPED');
});

test('CLI: apply con --version completa y archiva', (t) => {
  const root = makeFixture(t, { changelog: null });
  const result = cli(['apply', '--repo-root', root, '--id', 'EPIC-31', '--version', '3.0.0']);
  assert.equal(result.status, 0, result.stderr);
  const json = JSON.parse(result.stdout);
  assert.equal(json.ok, true);
  assert.match(fs.readFileSync(epicFile(root, json.to), 'utf8'), /^version: 3\.0\.0$/m);
});

test('CLI: argumentos inválidos → exit 2 con error en stderr y stdout vacío', (t) => {
  const root = makeFixture(t);
  for (const args of [
    ['borrar', '--repo-root', root, '--id', 'EPIC-31'],
    ['plan', '--repo-root', root, '--id', 'EPIC-1'],
    ['plan', '--repo-root', root, '--id', 'EPIC-31', '--path', `specs/flow/${NAME}`],
    ['plan', '--repo-root', root],
    ['plan', '--id', 'EPIC-31'],
    ['plan', '--repo-root', root, '--id', 'EPIC-31', '--yes'],
    ['plan', '--repo-root', root, '--id', 'EPIC-31', '--version', 'dos'],
    ['plan', '--repo-root', root, '--id', 'EPIC-31', '--version'],
  ]) {
    const result = cli(args);
    assert.equal(result.status, 2, args.join(' '));
    assert.equal(result.stdout, '');
    assert.notEqual(result.stderr.trim(), '');
  }
});
