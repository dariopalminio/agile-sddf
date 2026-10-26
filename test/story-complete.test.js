'use strict';

/**
 * Tests de STORY-160: motor `skills/story-complete/scripts/story-complete.js`, que completa
 * (`DELIVER/DONE` → `COMPLETED/DONE`) y archiva una historia en
 * `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/` (ADR-0016). Cubre los contratos de
 * verificación 1–7 de `design.md`: búsqueda determinista (D-3, CNF-5), admisión por estado y fecha
 * (D-2, D-4, AC-2, AC-3), escritura mínima del frontmatter (D-7), `git mv` con historial y
 * movimiento simple sin historial (D-6, CNF-3), restauración ante fallo y conteo (D-5, CNF-4) y la
 * CLI `plan|apply` (D-9). Cada caso opera sobre un directorio temporal; nunca sobre el repo real.
 */

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const SCRIPT = path.join(__dirname, '..', 'skills', 'story-complete', 'scripts', 'story-complete.js');
const { locateStory, archiveDateOf, planCompletion, applyCompletion } = require(SCRIPT);

const TODAY = '2026-10-25';
const NAME = 'STORY-001-entregada';
const BODY = Array.from({ length: 20 }, (_, i) => `Línea ${i + 1} del cuerpo de la historia.`);

function runGit(root, args) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `git ${args.join(' ')}\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function storyContent(fields, eol = '\n') {
  return ['---', ...Object.entries(fields).map(([k, v]) => `${k}: ${v}`), '---', '', '# Historia', '', ...BODY, ''].join(eol);
}

function storyFile(root, rel) {
  return path.join(root, ...rel.split('/'), 'story.md');
}

/**
 * Directorio temporal con `specs/flow/` y, salvo `git: false`, un repo git con todo commiteado.
 * `stories` mapea nombre de directorio (relativo a `specs/flow/`) → frontmatter o contenido literal.
 */
function makeFixture(t, { stories = { [NAME]: { id: 'STORY-001', status: 'DELIVER', substatus: 'DONE', created: '2026-10-01', updated: '2026-10-20' } }, git = true, extra } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sddf-complete-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true, maxRetries: 3 }));
  for (const [name, fm] of Object.entries(stories)) {
    write(storyFile(root, `specs/flow/${name}`), typeof fm === 'string' ? fm : storyContent(fm));
    write(path.join(root, 'specs', 'flow', name, 'tasks.md'), `# Tasks ${name}\n`);
  }
  write(path.join(root, 'specs', 'flow', 'EPIC-01-alfa', 'epic.md'), '# Épica\n');
  if (git) {
    runGit(root, ['init', '-q']);
    runGit(root, ['config', 'core.autocrlf', 'false']);
    runGit(root, ['config', 'user.email', 'complete@example.test']);
    runGit(root, ['config', 'user.name', 'Complete Tests']);
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

function fm(status, substatus, dates = { created: '2026-10-01', updated: '2026-10-20' }) {
  return { id: 'STORY-001', status, substatus, ...dates };
}

// ── D-3 — búsqueda determinista (T002) ──────────────────────────────────────────────

test('ID sin coincidencia → NOT_FOUND nombrando la ruta buscada (AC-2 fila 1)', (t) => {
  const root = makeFixture(t);
  const before = snapshot(root);
  const result = planCompletion({ repoRoot: root, id: 'STORY-999', today: TODAY });
  assert.equal(result.ok, false);
  assert.equal(result.code, 'NOT_FOUND');
  assert.match(result.message, /specs\/flow\/STORY-999-\*\//);
  assert.deepEqual(snapshot(root), before);
});

test('dos directorios STORY-NNN-* → AMBIGUOUS con ambas rutas (CNF-5)', (t) => {
  const root = makeFixture(t, { stories: { 'STORY-001-a': fm('DELIVER', 'DONE'), 'STORY-001-b': fm('DELIVER', 'DONE') } });
  const result = locateStory({ repoRoot: root, id: 'STORY-001' });
  assert.equal(result.ok, false);
  assert.equal(result.code, 'AMBIGUOUS');
  assert.deepEqual(result.matches, ['specs/flow/STORY-001-a', 'specs/flow/STORY-001-b']);
  const plan = planCompletion({ repoRoot: root, id: 'STORY-001', today: TODAY });
  assert.equal(plan.code, 'AMBIGUOUS');
  assert.match(plan.message, /specs\/flow\/STORY-001-a/);
  assert.match(plan.message, /specs\/flow\/STORY-001-b/);
});

test('historia solo en specs/flow/archive/ → NOT_FOUND con la pista «ya archivada en» (CNF-5)', (t) => {
  const root = makeFixture(t, { stories: { 'archive/2026-10-01-STORY-001-vieja': fm('COMPLETED', 'DONE') } });
  const result = planCompletion({ repoRoot: root, id: 'STORY-001', today: TODAY });
  assert.equal(result.code, 'NOT_FOUND');
  assert.match(result.message, /ya archivada en specs\/flow\/archive\/2026-10-01-STORY-001-vieja/);
});

test('--path bajo specs/flow/archive/ o con dos segmentos → INVALID_PATH; ruta válida se acepta', (t) => {
  const root = makeFixture(t, { stories: { [NAME]: fm('DELIVER', 'DONE'), 'archive/2026-10-01-STORY-002-vieja': fm('COMPLETED', 'DONE') } });
  for (const storyPath of ['specs/flow/archive/2026-10-01-STORY-002-vieja', `specs/flow/${NAME}/sub`, 'docs/STORY-001-x']) {
    const result = locateStory({ repoRoot: root, storyPath });
    assert.equal(result.code, 'INVALID_PATH', storyPath);
    assert.match(result.message, /specs\/flow\/STORY-NNN-<slug>/);
  }
  assert.deepEqual(locateStory({ repoRoot: root, storyPath: `specs/flow/${NAME}/` }), { ok: true, dir: `specs/flow/${NAME}` });
  assert.equal(locateStory({ repoRoot: root, storyPath: path.join(root, 'specs', 'flow', NAME) }).dir, `specs/flow/${NAME}`);
});

test('directorio sin story.md → NO_STORY_FILE con la ruta', (t) => {
  const root = makeFixture(t, { extra: (r) => write(path.join(r, 'specs', 'flow', 'STORY-002-vacia', 'tasks.md'), '# T\n') });
  const result = planCompletion({ repoRoot: root, id: 'STORY-002', today: TODAY });
  assert.equal(result.code, 'NO_STORY_FILE');
  assert.match(result.message, /specs\/flow\/STORY-002-vacia/);
});

// ── D-2 / D-4 — admisión y fecha (T003) ─────────────────────────────────────────────

for (const [status, substatus] of [['ACCEPTANCE', 'DONE'], ['DELIVER', 'IN-PROGRESS'], ['COMPLETED', 'IN-PROGRESS']]) {
  test(`${status}/${substatus} → NOT_DELIVERED con el estado y /story-delivery, sin cambios (AC-2)`, (t) => {
    const root = makeFixture(t, { stories: { [NAME]: fm(status, substatus) } });
    const before = snapshot(root);
    const result = planCompletion({ repoRoot: root, id: 'STORY-001', today: TODAY });
    assert.equal(result.ok, false);
    assert.equal(result.code, 'NOT_DELIVERED');
    assert.ok(result.message.includes(`${status}/${substatus}`), result.message);
    assert.match(result.message, /\/story-delivery STORY-001/);
    assert.deepEqual(snapshot(root), before);
  });
}

// ── STORY-164 — archivado de historias CANCELED (D-1, D-3, D-4) ────────────────────

test('CANCELED/DONE → action archive-canceled con la fecha de updated:, created: o date: (STORY-164 AC-1)', (t) => {
  const cases = [
    [{ updated: '2026-09-10', created: '2026-08-01' }, '2026-09-10'],
    [{ created: '2026-08-01' }, '2026-08-01'],
    [{ date: '2026-07-15' }, '2026-07-15'],
  ];
  for (const [dates, expected] of cases) {
    const root = makeFixture(t, { stories: { [NAME]: fm('CANCELED', 'DONE', dates) } });
    const before = snapshot(root);
    const result = planCompletion({ repoRoot: root, id: 'STORY-001', today: TODAY });
    assert.equal(result.ok, true, result.message);
    assert.equal(result.action, 'archive-canceled');
    assert.equal(result.archiveDate, expected, JSON.stringify(dates));
    assert.equal(result.to, `specs/flow/archive/${expected}-${NAME}`);
    assert.deepEqual(snapshot(root), before, 'plan no escribe');
  }
});

test('CANCELED/DONE → story.md byte a byte igual y status CANCELED tras archivar (STORY-164 AC-1, CNF-4)', (t) => {
  const root = makeFixture(t, { stories: { [NAME]: fm('CANCELED', 'DONE', { date: '2026-07-15' }) } });
  const original = fs.readFileSync(storyFile(root, `specs/flow/${NAME}`));
  const result = applyCompletion({ repoRoot: root, id: 'STORY-001', today: TODAY });
  assert.equal(result.ok, true, result.message);
  assert.equal(result.to, `specs/flow/archive/2026-07-15-${NAME}`);
  assert.equal(fs.existsSync(path.join(root, 'specs', 'flow', NAME)), false);
  const archived = fs.readFileSync(storyFile(root, result.to));
  assert.ok(archived.equals(original));
  assert.match(archived.toString('utf8'), /^status: CANCELED$/m);
  assert.match(result.message, /archivada como CANCELED \(status sin cambios\)/);
  assert.deepEqual(result.counts, { before: 1, after: 1 });
});

test('CANCELED con substatus distinto de DONE → CANCELED_NOT_DONE con el estado, sin /story-delivery ni cambios (STORY-164 AC-2 fila 1)', (t) => {
  const root = makeFixture(t, { stories: { [NAME]: fm('CANCELED', 'IN-PROGRESS') } });
  const before = snapshot(root);
  const result = applyCompletion({ repoRoot: root, id: 'STORY-001', today: TODAY });
  assert.equal(result.ok, false);
  assert.equal(result.code, 'CANCELED_NOT_DONE');
  assert.ok(result.message.includes('CANCELED/IN-PROGRESS'), result.message);
  assert.match(result.message, /substatus DONE/);
  assert.doesNotMatch(result.message, /story-delivery|ADR-0016/);
  assert.deepEqual(snapshot(root), before);
});

test('CANCELED/DONE sin updated:, created: ni date: válidos → NO_ARCHIVE_DATE con los tres campos, sin cambios (STORY-164 AC-2 fila 2)', (t) => {
  const root = makeFixture(t, { stories: { [NAME]: fm('CANCELED', 'DONE', { date: 'ayer' }) } });
  const before = snapshot(root);
  const result = applyCompletion({ repoRoot: root, id: 'STORY-001', today: TODAY });
  assert.equal(result.code, 'NO_ARCHIVE_DATE');
  for (const field of ['updated:', 'created:', 'date:']) assert.ok(result.message.includes(field), result.message);
  assert.deepEqual(snapshot(root), before);
});

test('sin status en el frontmatter → NO_STATUS nombrando los campos', (t) => {
  const root = makeFixture(t, { stories: { [NAME]: { id: 'STORY-001', created: '2026-10-01' } } });
  const result = planCompletion({ repoRoot: root, id: 'STORY-001', today: TODAY });
  assert.equal(result.code, 'NO_STATUS');
  assert.match(result.message, /status/);
  assert.match(result.message, /substatus/);
});

test('DELIVER/DONE → action complete con archiveDate = today y destino fechado (AC-1 fila 1)', (t) => {
  const root = makeFixture(t);
  const before = snapshot(root);
  const result = planCompletion({ repoRoot: root, id: 'STORY-001', today: TODAY });
  assert.equal(result.ok, true, result.message);
  assert.equal(result.code, 'OK');
  assert.equal(result.action, 'complete');
  assert.equal(result.archiveDate, TODAY);
  assert.equal(result.from, `specs/flow/${NAME}`);
  assert.equal(result.to, `specs/flow/archive/${TODAY}-${NAME}`);
  assert.equal(result.moveMethod, 'git-mv');
  assert.deepEqual(result.story, { id: 'STORY-001', dir: `specs/flow/${NAME}`, status: 'DELIVER', substatus: 'DONE' });
  assert.deepEqual(snapshot(root), before, 'plan no escribe');
});

test('COMPLETED/DONE → archive-only con la fecha de updated:, o de created: si falta o es inválido (AC-1 fila 2)', (t) => {
  const cases = [
    [{ created: '2026-09-01', updated: '2026-09-15' }, '2026-09-15'],
    [{ created: '2026-09-01' }, '2026-09-01'],
    [{ created: '2026-09-01', updated: 'pronto' }, '2026-09-01'],
    [{ created: '"2026-09-02"' }, '2026-09-02'],
  ];
  for (const [dates, expected] of cases) {
    const root = makeFixture(t, { stories: { [NAME]: fm('COMPLETED', 'DONE', dates) } });
    const result = planCompletion({ repoRoot: root, id: 'STORY-001', today: TODAY });
    assert.equal(result.action, 'archive-only');
    assert.equal(result.archiveDate, expected, JSON.stringify(dates));
    assert.equal(result.to, `specs/flow/archive/${expected}-${NAME}`);
  }
});

test('COMPLETED/DONE con updated: inválido y date: → NO_ARCHIVE_DATE: date: solo cuenta sin updated: ni created: (AC-3 fila 3, STORY-164 D-3)', (t) => {
  const root = makeFixture(t, { stories: { [NAME]: fm('COMPLETED', 'DONE', { date: '2026-09-01', updated: 'x' }) } });
  const before = snapshot(root);
  const result = applyCompletion({ repoRoot: root, id: 'STORY-001', today: TODAY });
  assert.equal(result.code, 'NO_ARCHIVE_DATE');
  for (const field of ['updated:', 'created:', 'date:']) assert.ok(result.message.includes(field), result.message);
  assert.deepEqual(snapshot(root), before);
});

test('COMPLETED/DONE solo con date: → archive-only con esa fecha (STORY-164 D-3)', (t) => {
  const root = makeFixture(t, { stories: { [NAME]: fm('COMPLETED', 'DONE', { date: '2026-07-15' }) } });
  const result = planCompletion({ repoRoot: root, id: 'STORY-001', today: TODAY });
  assert.equal(result.action, 'archive-only');
  assert.equal(result.archiveDate, '2026-07-15');
});

test('archiveDateOf: cadena updated: → created: → date: (solo si faltan ambas claves)', () => {
  assert.equal(archiveDateOf({ updated: '2026-01-02', created: '2026-01-01' }), '2026-01-02');
  assert.equal(archiveDateOf({ created: '2026-01-01' }), '2026-01-01');
  assert.equal(archiveDateOf({ updated: 'x', created: '2026-01-01' }), '2026-01-01');
  assert.equal(archiveDateOf({ date: '2026-01-01' }), '2026-01-01');
  assert.equal(archiveDateOf({ updated: 'x', date: '2026-01-01' }), null);
  assert.equal(archiveDateOf({ date: 'x' }), null);
  assert.equal(archiveDateOf({}), null);
});

test('destino existente → ARCHIVE_CONFLICT con la ruta, sin cambios (AC-3 fila 2)', (t) => {
  const root = makeFixture(t, { extra: (r) => fs.mkdirSync(path.join(r, 'specs', 'flow', 'archive', `${TODAY}-${NAME}`), { recursive: true }) });
  const before = snapshot(root);
  const result = applyCompletion({ repoRoot: root, id: 'STORY-001', today: TODAY });
  assert.equal(result.code, 'ARCHIVE_CONFLICT');
  assert.ok(result.message.includes(`specs/flow/archive/${TODAY}-${NAME}`), result.message);
  assert.deepEqual(snapshot(root), before);
});

// ── D-5 / D-6 / D-7 — apply con éxito (T004) ────────────────────────────────────────

test('DELIVER/DONE → story.md archivado en COMPLETED/DONE con updated: de hoy y resto igual (AC-1 fila 1)', (t) => {
  const root = makeFixture(t);
  const original = fs.readFileSync(storyFile(root, `specs/flow/${NAME}`), 'utf8');
  const result = applyCompletion({ repoRoot: root, id: 'STORY-001', today: TODAY });
  assert.equal(result.ok, true, result.message);
  assert.equal(result.code, 'OK');
  assert.equal(result.to, `specs/flow/archive/${TODAY}-${NAME}`);
  assert.equal(fs.existsSync(path.join(root, 'specs', 'flow', NAME)), false);
  const archived = fs.readFileSync(storyFile(root, result.to), 'utf8');
  const expected = original.replace('status: DELIVER', 'status: COMPLETED').replace('updated: 2026-10-20', `updated: ${TODAY}`);
  assert.equal(archived, expected);
  assert.match(archived, /^substatus: DONE$/m);
  assert.deepEqual(result.counts, { before: 1, after: 1 });
});

test('COMPLETED/DONE → story.md byte a byte igual tras archivar (AC-1 fila 2)', (t) => {
  const root = makeFixture(t, { stories: { [NAME]: fm('COMPLETED', 'DONE') } });
  const original = fs.readFileSync(storyFile(root, `specs/flow/${NAME}`));
  const result = applyCompletion({ repoRoot: root, id: 'STORY-001', today: TODAY });
  assert.equal(result.ok, true, result.message);
  assert.equal(result.to, `specs/flow/archive/2026-10-20-${NAME}`);
  assert.ok(fs.readFileSync(storyFile(root, result.to)).equals(original));
});

test('git log --follow del story.md archivado muestra el commit previo (CNF-3)', (t) => {
  for (const status of ['DELIVER', 'COMPLETED']) {
    const root = makeFixture(t, { stories: { [NAME]: fm(status, 'DONE') } });
    const result = applyCompletion({ repoRoot: root, id: 'STORY-001', today: TODAY });
    assert.equal(result.moveMethod, 'git-mv');
    runGit(root, ['add', '-A']);
    runGit(root, ['commit', '-q', '-m', 'archivar']);
    const log = runGit(root, ['log', '--follow', '--format=%s', '--', `${result.to}/story.md`]);
    assert.deepEqual(log.trim().split('\n'), ['archivar', 'fixture'], status);
  }
});

test('un archivo sin versionar dentro del directorio viaja con él (D-6)', (t) => {
  const root = makeFixture(t, { extra: (r) => write(path.join(r, 'specs', 'flow', NAME, 'delivery-report.md'), '# Reporte\n') });
  const result = applyCompletion({ repoRoot: root, id: 'STORY-001', today: TODAY });
  assert.equal(result.ok, true, result.message);
  assert.equal(fs.readFileSync(path.join(root, ...result.to.split('/'), 'delivery-report.md'), 'utf8'), '# Reporte\n');
});

test('directorio sin archivos versionados → moveMethod rename con aviso (D-6)', (t) => {
  const root = makeFixture(t, { extra: (r) => write(storyFile(r, 'specs/flow/STORY-002-nueva'), storyContent({ ...fm('DELIVER', 'DONE'), id: 'STORY-002' })) });
  const plan = planCompletion({ repoRoot: root, id: 'STORY-002', today: TODAY });
  assert.equal(plan.moveMethod, 'rename');
  const result = applyCompletion({ repoRoot: root, id: 'STORY-002', today: TODAY });
  assert.equal(result.ok, true, result.message);
  assert.equal(result.moveMethod, 'rename');
  assert.ok(result.warnings.some((w) => w.includes('specs/flow/STORY-002-nueva no tiene historial de git')), result.warnings.join('\n'));
  assert.ok(fs.existsSync(storyFile(root, result.to)));
  assert.deepEqual(result.counts, { before: 2, after: 2 });
});

test('directorio fuera de un repo git → moveMethod rename (D-6)', (t) => {
  const root = makeFixture(t, { git: false });
  const result = applyCompletion({ repoRoot: root, id: 'STORY-001', today: TODAY });
  assert.equal(result.ok, true, result.message);
  assert.equal(result.moveMethod, 'rename');
  assert.ok(fs.existsSync(storyFile(root, result.to)));
  assert.equal(fs.existsSync(path.join(root, 'specs', 'flow', NAME)), false);
});

test('story.md con \\r\\n conserva \\r\\n tras completar (D-7)', (t) => {
  const root = makeFixture(t, { stories: { [NAME]: storyContent(fm('DELIVER', 'DONE'), '\r\n') } });
  const result = applyCompletion({ repoRoot: root, id: 'STORY-001', today: TODAY });
  assert.equal(result.ok, true, result.message);
  const archived = fs.readFileSync(storyFile(root, result.to), 'utf8');
  assert.ok(archived.includes(`status: COMPLETED\r\n`));
  assert.ok(archived.includes(`updated: ${TODAY}\r\n`));
  assert.equal(archived.replace(/\r\n/g, '').includes('\n'), false, 'sin \\n sueltos');
});

test('frontmatter con \\n y cuerpo con \\r\\n → status COMPLETED y cada línea conserva su final (D-7)', (t) => {
  const content = `${['---', 'id: STORY-001', 'status: DELIVER', 'substatus: DONE', 'created: 2026-10-01', 'updated: 2026-10-20', '---', ''].join('\n')}${['# Historia', '', ...BODY, ''].join('\r\n')}`;
  const root = makeFixture(t, { stories: { [NAME]: content } });
  const result = applyCompletion({ repoRoot: root, id: 'STORY-001', today: TODAY });
  assert.equal(result.ok, true, result.message);
  const archived = fs.readFileSync(storyFile(root, result.to), 'utf8');
  assert.equal(archived, content.replace('status: DELIVER', 'status: COMPLETED').replace('updated: 2026-10-20', `updated: ${TODAY}`));
});

test('status con comillas y espacios → se reescribe con el mismo criterio que la lectura (D-7)', (t) => {
  const root = makeFixture(t, { stories: { [NAME]: storyContent({ ...fm('DELIVER', 'DONE'), status: '"DELIVER "' }) } });
  const result = applyCompletion({ repoRoot: root, id: 'STORY-001', today: TODAY });
  assert.equal(result.ok, true, result.message);
  const archived = fs.readFileSync(storyFile(root, result.to), 'utf8');
  assert.match(archived, /^status: COMPLETED$/m);
  assert.doesNotMatch(archived, /DELIVER/);
});

test('sin updated: se inserta tras created: al completar (D-7)', (t) => {
  const root = makeFixture(t, { stories: { [NAME]: fm('DELIVER', 'DONE', { created: '2026-10-01' }) } });
  const result = applyCompletion({ repoRoot: root, id: 'STORY-001', today: TODAY });
  assert.equal(result.ok, true, result.message);
  assert.match(fs.readFileSync(storyFile(root, result.to), 'utf8'), /^created: 2026-10-01\nupdated: 2026-10-25\n---/m);
});

// ── D-5 — fallos de apply (T005) ────────────────────────────────────────────────────

test('git mv forzado a fallar → MOVE_FAILED, story.md restaurado byte a byte y conteo igual (CNF-4)', (t) => {
  const root = makeFixture(t);
  const file = storyFile(root, `specs/flow/${NAME}`);
  const original = fs.readFileSync(file);
  fs.writeFileSync(path.join(root, '.git', 'index.lock'), '');
  const result = applyCompletion({ repoRoot: root, id: 'STORY-001', today: TODAY });
  assert.equal(result.ok, false);
  assert.equal(result.code, 'MOVE_FAILED');
  assert.ok(fs.readFileSync(file).equals(original), 'story.md restaurado');
  assert.equal(fs.existsSync(path.join(root, 'specs', 'flow', 'archive', `${TODAY}-${NAME}`)), false);
  assert.deepEqual(result.counts, { before: 1, after: 1 });
});

test('destino creado entre plan y apply → apply aborta con ARCHIVE_CONFLICT sin escribir (D-5 paso 1)', (t) => {
  const root = makeFixture(t);
  assert.equal(planCompletion({ repoRoot: root, id: 'STORY-001', today: TODAY }).ok, true);
  fs.mkdirSync(path.join(root, 'specs', 'flow', 'archive', `${TODAY}-${NAME}`), { recursive: true });
  const before = snapshot(root);
  const result = applyCompletion({ repoRoot: root, id: 'STORY-001', today: TODAY });
  assert.equal(result.code, 'ARCHIVE_CONFLICT');
  assert.deepEqual(snapshot(root), before);
});

// ── D-9 — CLI ───────────────────────────────────────────────────────────────────────

function cli(args) {
  return spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8' });
}

test('CLI: plan admitido → exit 0 y JSON ok: true; rechazo → exit 1 y ok: false (D-9)', (t) => {
  const root = makeFixture(t, { stories: { [NAME]: fm('DELIVER', 'DONE'), 'STORY-002-aceptada': { ...fm('ACCEPTANCE', 'DONE'), id: 'STORY-002' } } });
  const ok = cli(['plan', '--repo-root', root, '--id', 'STORY-001']);
  assert.equal(ok.status, 0, ok.stderr);
  const okJson = JSON.parse(ok.stdout);
  assert.equal(okJson.ok, true);
  assert.equal(okJson.action, 'complete');
  assert.match(okJson.archiveDate, /^\d{4}-\d{2}-\d{2}$/);
  const rejected = cli(['plan', '--repo-root', root, '--path', 'specs/flow/STORY-002-aceptada']);
  assert.equal(rejected.status, 1);
  assert.equal(JSON.parse(rejected.stdout).code, 'NOT_DELIVERED');
});

test('CLI: apply completa y archiva (D-9)', (t) => {
  const root = makeFixture(t, { stories: { [NAME]: fm('COMPLETED', 'DONE') } });
  const result = cli(['apply', '--repo-root', root, '--id', 'STORY-001']);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).to, `specs/flow/archive/2026-10-20-${NAME}`);
});

test('CLI: argumentos inválidos → exit 2 con error en stderr (D-9)', (t) => {
  const root = makeFixture(t);
  for (const args of [
    ['borrar', '--repo-root', root, '--id', 'STORY-001'],
    ['plan', '--repo-root', root, '--id', 'STORY-1'],
    ['plan', '--repo-root', root, '--id', 'STORY-001', '--path', `specs/flow/${NAME}`],
    ['plan', '--repo-root', root],
    ['plan', '--id', 'STORY-001'],
    ['plan', '--repo-root', root, '--id', 'STORY-001', '--yes'],
  ]) {
    const result = cli(args);
    assert.equal(result.status, 2, args.join(' '));
    assert.equal(result.stdout, '');
    assert.notEqual(result.stderr.trim(), '');
  }
});
