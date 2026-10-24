'use strict';

/**
 * Tests de STORY-153: migración única `scripts/migrate-specs-to-flow.js` de `docs/specs/` al
 * layout fijo `specs/flow/` (ADR-0016). Cubre los contratos de verificación 1–8 de `design.md`:
 * destinos por tipo y archivado de `COMPLETED` (AC-1), fallback de fecha, renombres en el índice
 * (CNF-3), dry-run sin escrituras y segunda pasada sin cambios (AC-2), bloqueos sin movimientos
 * parciales, aviso de archivos sin versionar y ausencia de artefactos extra (CNF-1).
 * Cada caso opera sobre un repositorio git temporal; nunca sobre el repo real.
 */

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const { runMigration, archiveDate } = require('../scripts/migrate-specs-to-flow');

const EPICS = ['EPIC-01-alfa', 'EPIC-02-beta'];
const STORIES = [
  { name: 'STORY-001-archivada', fm: { status: 'COMPLETED', created: '2026-05-01', updated: '2026-05-10' } },
  { name: 'STORY-002-cancelada', fm: { status: 'CANCELED', created: '2026-05-02', updated: '2026-05-03' } },
  { name: 'STORY-003-en-curso', fm: { status: 'IMPLEMENT', created: '2026-05-04', updated: '2026-05-05' } },
  { name: 'STORY-004-solo-created', fm: { status: '"COMPLETED"', created: '2026-04-01' } },
];

function runGit(root, args) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `git ${args.join(' ')}\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function frontmatter(fields) {
  return ['---', ...Object.entries(fields).map(([k, v]) => `${k}: ${v}`), '---', ''].join('\n');
}

/** Repo git temporal con docs/specs/ commiteado; `extra(root)` añade contenido antes del commit. */
function makeFixture(t, { epics = EPICS, stories = STORIES, readme = true, extra } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sddf-migrate-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true, maxRetries: 3 }));
  const specs = path.join(root, 'docs', 'specs');
  if (readme) write(path.join(specs, 'README.md'), '# Specs\n');
  for (const name of epics) write(path.join(specs, 'epics', name, 'epic.md'), `${frontmatter({ id: name })}\n# ${name}\n`);
  for (const { name, fm } of stories) {
    write(path.join(specs, 'stories', name, 'story.md'), `${frontmatter({ id: name, ...fm })}\n# ${name}\n`);
    write(path.join(specs, 'stories', name, 'tasks.md'), `# Tasks ${name}\n`);
  }
  write(path.join(root, 'docs', 'requirements', 'req.md'), '# Requisitos\n');
  if (extra) extra(root);
  runGit(root, ['init', '-q']);
  runGit(root, ['config', 'core.autocrlf', 'false']);
  runGit(root, ['config', 'user.email', 'migrate@example.test']);
  runGit(root, ['config', 'user.name', 'Migrate Tests']);
  runGit(root, ['add', '-A']);
  runGit(root, ['commit', '-q', '-m', 'fixture']);
  return root;
}

/** Archivos (no directorios) bajo root, relativos con '/', sin `.git/`. */
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
  return { files: listFiles(root), status: runGit(root, ['status', '--porcelain', '--untracked-files=all']) };
}

const exists = (root, rel) => fs.existsSync(path.join(root, rel));
const linesWith = (result, prefix) => result.lines.filter((line) => line.startsWith(prefix));

// --- AC-1 — migrar y archivar ------------------------------------------------------------------

test('AC-1: épicas, stories activas y COMPLETED archivadas con fecha; docs/specs/ deja de existir', (t) => {
  const root = makeFixture(t);
  const result = runMigration({ repoRoot: root, dryRun: false });

  assert.equal(result.exitCode, 0, result.lines.join('\n'));
  for (const epic of EPICS) assert.ok(exists(root, `specs/flow/${epic}/epic.md`), epic);
  assert.ok(exists(root, 'specs/flow/archive/2026-05-10-STORY-001-archivada/story.md'));
  assert.ok(exists(root, 'specs/flow/archive/2026-04-01-STORY-004-solo-created/story.md'));
  assert.ok(exists(root, 'specs/flow/STORY-002-cancelada/story.md'));
  assert.ok(exists(root, 'specs/flow/STORY-003-en-curso/tasks.md'));
  assert.ok(exists(root, 'specs/README.md'));
  assert.equal(exists(root, 'docs/specs'), false);
  assert.ok(exists(root, 'docs/requirements/req.md'));

  const summary = result.lines.join('\n');
  assert.match(summary, /Stories activas:\s+2/);
  assert.match(summary, /Stories archivadas:\s+2/);
  assert.match(summary, /Total previo:\s+4/);
  assert.equal(linesWith(result, '[MOVIDO]').length, 7);
});

test('CNF-3: los movimientos quedan en el índice como renombres', (t) => {
  const root = makeFixture(t);
  assert.equal(runMigration({ repoRoot: root, dryRun: false }).exitCode, 0);

  const entries = runGit(root, ['status', '--porcelain']).split('\n').filter(Boolean);
  assert.ok(entries.length > 0);
  for (const entry of entries) assert.match(entry, /^R /, entry);
});

test('CNF-1: tras migrar solo existen los destinos del plan (sin logs ni eventos)', (t) => {
  const root = makeFixture(t);
  const before = listFiles(root).filter((rel) => !rel.endsWith('/'));
  const result = runMigration({ repoRoot: root, dryRun: false });
  assert.equal(result.exitCode, 0);

  const expected = before.map((rel) => {
    for (const move of result.plan.moves) {
      if (rel === move.from) return move.to;
      if (rel.startsWith(`${move.from}/`)) return move.to + rel.slice(move.from.length);
    }
    return rel;
  }).sort();
  assert.deepEqual(listFiles(root).filter((rel) => !rel.endsWith('/')), expected);
});

// --- AC-1 — fecha del prefijo de archivo -------------------------------------------------------

test('archiveDate: updated → created → date, y null sin fecha válida', () => {
  assert.equal(archiveDate({ updated: '2026-05-10', created: '2026-05-01', date: '2026-01-01' }), '2026-05-10');
  assert.equal(archiveDate({ created: '2026-05-01', date: '2026-01-01' }), '2026-05-01');
  assert.equal(archiveDate({ date: '2026-01-01' }), '2026-01-01');
  assert.equal(archiveDate({}), null);
  assert.equal(archiveDate({ updated: '10/05/2026' }), null);
  assert.equal(archiveDate({ date: '2026-1-1' }), null);
});

test('AC-1: story COMPLETED solo con date: se archiva con esa fecha', (t) => {
  const root = makeFixture(t, { stories: [{ name: 'STORY-010-antigua', fm: { status: 'COMPLETED', date: '2025-12-31' } }] });
  const result = runMigration({ repoRoot: root, dryRun: false });
  assert.equal(result.exitCode, 0, result.lines.join('\n'));
  assert.ok(exists(root, 'specs/flow/archive/2025-12-31-STORY-010-antigua/story.md'));
});

test('AC-1: story COMPLETED sin fecha válida bloquea sin mover nada', (t) => {
  const root = makeFixture(t, { stories: [...STORIES, { name: 'STORY-011-sin-fecha', fm: { status: 'COMPLETED' } }] });
  const before = snapshot(root);
  const result = runMigration({ repoRoot: root, dryRun: false });

  assert.equal(result.exitCode, 1);
  assert.ok(result.lines.some((line) => /^\[BLOQUEO\] .*STORY-011-sin-fecha.*COMPLETED sin fecha válida \(updated\/created\/date\)/.test(line)), result.lines.join('\n'));
  assert.deepEqual(snapshot(root), before);
});

// --- AC-2 — dry-run e idempotencia -------------------------------------------------------------

test('AC-2: --dry-run lista cada movimiento y no modifica el árbol', (t) => {
  const root = makeFixture(t);
  const before = snapshot(root);
  const result = runMigration({ repoRoot: root, dryRun: true });

  assert.equal(result.exitCode, 0, result.lines.join('\n'));
  const planned = linesWith(result, '[MOVERÍA]');
  assert.equal(planned.length, result.plan.moves.length);
  assert.equal(planned.length, 7);
  for (const move of result.plan.moves) assert.ok(planned.includes(`[MOVERÍA] ${move.from} → ${move.to}`), move.from);
  assert.ok(result.lines.some((line) => line.includes('Resumen (dry-run)')));
  assert.deepEqual(snapshot(root), before);
  assert.equal(exists(root, 'specs'), false);
});

test('AC-2: una segunda ejecución sobre el repo migrado no produce cambios', (t) => {
  const root = makeFixture(t);
  assert.equal(runMigration({ repoRoot: root, dryRun: false }).exitCode, 0);
  const before = snapshot(root);
  const result = runMigration({ repoRoot: root, dryRun: false });

  assert.equal(result.exitCode, 0);
  assert.deepEqual(result.lines, ['[SIN CAMBIOS] docs/specs/ no existe: nada que migrar']);
  assert.deepEqual(snapshot(root), before);
});

test('AC-2: sin docs/specs/ no se crea specs/flow/archive/', (t) => {
  const root = makeFixture(t, { epics: [], stories: [], readme: false });
  const result = runMigration({ repoRoot: root, dryRun: false });
  assert.equal(result.exitCode, 0);
  assert.equal(exists(root, 'specs'), false);
});

// --- Guardias (D-5) ----------------------------------------------------------------------------

function assertBlocked(t, options, pattern) {
  const root = makeFixture(t, options);
  if (options.after) options.after(root);
  const before = snapshot(root);
  const result = runMigration({ repoRoot: root, dryRun: false });

  assert.equal(result.exitCode, 1, result.lines.join('\n'));
  assert.ok(result.lines.some((line) => line.startsWith('[BLOQUEO]') && pattern.test(line)), result.lines.join('\n'));
  assert.equal(linesWith(result, '[MOVIDO]').length, 0);
  assert.deepEqual(snapshot(root), before);
}

test('bloqueo: destino preexistente (git mv anidaría el origen)', (t) => {
  assertBlocked(t, { extra: (root) => write(path.join(root, 'specs', 'flow', 'STORY-003-en-curso', 'story.md'), 'x\n') },
    /specs\/flow\/STORY-003-en-curso ya existe/);
});

test('bloqueo: entrada no reconocida en docs/specs/stories/', (t) => {
  assertBlocked(t, { extra: (root) => write(path.join(root, 'docs', 'specs', 'stories', 'notas.txt'), 'x\n') },
    /docs\/specs\/stories\/notas\.txt: entrada no reconocida/);
});

test('bloqueo: directorio de story sin archivos versionados', (t) => {
  assertBlocked(t, { after: (root) => write(path.join(root, 'docs', 'specs', 'stories', 'STORY-020-nueva', 'story.md'), frontmatter({ status: 'BACKLOG' })) },
    /docs\/specs\/stories\/STORY-020-nueva: sin archivos versionados/);
});

test('bloqueo: story sin status en el frontmatter', (t) => {
  assertBlocked(t, { stories: [...STORIES, { name: 'STORY-021-sin-status', fm: { created: '2026-05-01' } }] },
    /docs\/specs\/stories\/STORY-021-sin-status: sin status en el frontmatter/);
});

test('aviso: un archivo sin versionar se mueve con su story', (t) => {
  const root = makeFixture(t);
  write(path.join(root, 'docs', 'specs', 'stories', 'STORY-003-en-curso', 'notas.bak'), 'local\n');
  const result = runMigration({ repoRoot: root, dryRun: false });

  assert.equal(result.exitCode, 0, result.lines.join('\n'));
  assert.ok(linesWith(result, '[AVISO]').some((line) => line.includes('docs/specs/stories/STORY-003-en-curso')));
  assert.ok(exists(root, 'specs/flow/STORY-003-en-curso/notas.bak'));
});
