'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const requirements = require('../skills/memory-system/scripts/requirements.js');

function root() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 's118-'));
  fs.mkdirSync(path.join(dir, 'requirements'), { recursive: true });
  return dir;
}
function srs(dir) {
  fs.writeFileSync(path.join(dir, 'requirements', 'srs-demo.md'), `---\ntype: srs\nslug: srs-demo\ntitle: Demo\nstatus: IN-PROGRESS\nsubstatus: DONE\ncreated: 2026-10-12\nupdated: 2026-10-12\n---\n\n# Demo\n\n## Requisitos funcionales\n\n### FR-001 — Crear cuenta\n\nEl sistema debe crear cuentas.\n\n#### Criterios\n\n- [ ] válido\n\n## Requisitos no funcionales\n\n### NFR-001 — Latencia\n\nDebe responder rápido.\n`);
}
function fixture(name) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 's118-fixture-'));
  fs.cpSync(path.join(__dirname, '..', 'skills', 'memory-system', 'examples', name, 'docs'), dir, { recursive: true });
  return dir;
}
function treeHash(dir) {
  const rows = [];
  function visit(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name); if (entry.isDirectory()) visit(full);
      else rows.push(`${path.relative(dir, full)}:${fs.readFileSync(full, 'utf8')}`);
    }
  }
  visit(dir); return rows.sort().join('\n');
}
function runCli(root, args) {
  return spawnSync(process.execPath, [path.join(__dirname, '..', 'skills', 'memory-system', 'scripts', 'memory-system.js'), ...args, '--root', root, '--cli-root', path.join(__dirname, '..')], { encoding: 'utf8' });
}

test('S118-UT-001 inventario y resolver prefieren el fragmento sobre la sección', () => {
  const dir = root(); srs(dir);
  const first = requirements.inventoryRequirements(dir);
  assert.equal(first.layout, 'srs');
  assert.deepEqual(requirements.requirementAliases(first), ['FR-001', 'NFR-001']);
  assert.equal(requirements.resolveRequirement(first, 'FR-001').target, 'srs-demo.md#FR-001');
  fs.mkdirSync(path.join(dir, 'requirements', 'functional'));
  fs.writeFileSync(path.join(dir, 'requirements', 'functional', 'FR-001-crear-cuenta.md'), '---\ntype: requirement\nkind: functional\nid: FR-001\nslug: FR-001-crear-cuenta\ntitle: Crear cuenta\nstatus: active\ncreated: 2026-10-12\nupdated: 2026-10-12\nrelated: []\n---\n\n# FR-001 — Crear cuenta\n');
  const second = requirements.inventoryRequirements(dir);
  assert.equal(second.layout, 'mixed');
  assert.equal(requirements.resolveRequirement(second, 'FR-001').kind, 'file');
});

test('S118-IT-001 migra SRS a fragmentos y la segunda ejecución es idempotente', () => {
  const dir = root(); srs(dir);
  const result = requirements.migrateSrsSingle(dir, { date: '2026-10-12', displayRoot: 'docs' });
  assert.equal(result.exitCode, 0);
  assert.ok(fs.existsSync(path.join(dir, 'requirements', 'functional', 'FR-001-crear-cuenta.md')));
  assert.ok(fs.existsSync(path.join(dir, 'requirements', 'non-functional', 'NFR-001-latencia.md')));
  assert.ok(fs.existsSync(path.join(dir, 'requirements', 'index.md')));
  assert.ok(!fs.existsSync(path.join(dir, 'requirements', 'srs-demo.md')));
  const repeat = requirements.migrateSrsSingle(dir, { date: '2026-10-12', displayRoot: 'docs' });
  assert.equal(repeat.exitCode, 0);
  assert.match(repeat.lines.join('\n'), /\[SIN CAMBIOS\]/);
});

test('S118-IT-002 conserva dry-run, reescribe enlaces y revierte fragmentos a SRS', () => {
  const srsRoot = fixture('srs-single'); const before = treeHash(srsRoot);
  const preview = requirements.migrateSrsSingle(srsRoot, { dryRun: true, date: '2026-10-12', displayRoot: 'docs' });
  assert.equal(preview.exitCode, 0); assert.match(preview.lines.join('\n'), /cambios pendientes: [1-9]/); assert.equal(treeHash(srsRoot), before);
  const forward = requirements.migrateSrsSingle(srsRoot, { date: '2026-10-12', displayRoot: 'docs' });
  assert.equal(forward.exitCode, 0);
  assert.match(fs.readFileSync(path.join(srsRoot, 'guides', 'enlaces.md'), 'utf8'), /\[\[FR-002\]\]/);
  assert.equal(requirements.inventoryRequirements(srsRoot).layout, 'fragmented');
  const reverse = requirements.migrateFragmented(srsRoot, { date: '2026-10-12', displayRoot: 'docs' });
  assert.equal(reverse.exitCode, 0); assert.equal(requirements.inventoryRequirements(srsRoot).layout, 'srs');
  const document = fs.readFileSync(requirements.inventoryRequirements(srsRoot).srsFiles[0], 'utf8');
  assert.match(document, /### FR-001 — Crear cuenta/); assert.match(document, /#### Criterios/);
  assert.ok(!fs.existsSync(path.join(srsRoot, 'requirements', 'index.md')));
});

test('S118-IT-003 bloquea una migración insegura sin escribir', () => {
  const dir = fixture('srs-single'); const source = path.join(dir, 'requirements', 'srs-srs-single.md');
  const text = fs.readFileSync(source, 'utf8').replace('## Requisitos funcionales', 'Texto suelto que no pertenece a un requisito.\n\n## Requisitos funcionales');
  fs.writeFileSync(source, text, 'utf8'); const before = treeHash(dir);
  const result = requirements.migrateSrsSingle(dir, { date: '2026-10-12', displayRoot: 'docs' });
  assert.equal(result.exitCode, 1); assert.match(result.lines.join('\n'), /\[NO MIGRADO\].*contenido fuera de un requisito/); assert.equal(treeHash(dir), before);
});

test('S118-UT-002 utilidades, layouts y el template conservan los contratos SRS', () => {
  assert.equal(requirements.slugify('Árbol: un título útil'), 'arbol-un-titulo-util');
  assert.equal(requirements.slugify('palabra-muy-larga-para-recortar', 18), 'palabra-muy-larga');
  assert.equal(requirements.projectSlug(path.parse(path.resolve(path.sep)).root), 'proyecto');
  assert.deepEqual(requirements.parseIdList('[FR-001, NFR-002]'), ['FR-001', 'NFR-002']);
  assert.deepEqual(requirements.parseIdList(['FR-001', ' NFR-002 ']), ['FR-001', 'NFR-002']);
  assert.deepEqual(requirements.parseIdList(''), []);

  for (const [name, layout] of [['srs-single', 'srs'], ['requirements-fragmented', 'fragmented'], ['requirements-legacy', 'fragmented'], ['requirements-mixed', 'mixed']]) {
    assert.equal(requirements.inventoryRequirements(fixture(name)).layout, layout, name);
  }
  const template = fs.readFileSync(path.join(__dirname, '..', 'skills', 'memory-system', 'assets', 'scaffold', 'templates', 'srs-template.md'), 'utf8');
  const rendered = requirements.renderSrs(template, { slug: 'demo', name: 'Demo', date: '2026-10-13' });
  assert.ok(!rendered.includes('escritor:'));
  assert.match(rendered, /srs-demo/);
  assert.match(rendered, /<nombre>/);
  assert.match(rendered, /no se renumeran ni se reutilizan/);

  const inventory = requirements.inventoryRequirements(fixture('srs-single'));
  assert.equal(inventory.sections.find((item) => item.id === 'FR-003').bodyLines.some((line) => /^## Requisitos no funcionales/.test(line)), false);
  assert.equal(requirements.resolveRequirement(inventory, 'FR-999'), null);
});

test('S118-IT-004 scaffold crea solo el SRS y el legacy se repara con index', () => {
  const empty = fs.mkdtempSync(path.join(os.tmpdir(), 's118-scaffold-'));
  const scaffold = runCli(empty, ['scaffold']);
  assert.equal(scaffold.status, 0, scaffold.stderr);
  assert.match(scaffold.stdout, /\[CREADO\] requirements\/srs-/);
  assert.ok(fs.readdirSync(path.join(empty, 'requirements')).some((name) => /^srs-.*\.md$/.test(name)));
  assert.ok(!fs.existsSync(path.join(empty, 'requirements', 'functional')));
  assert.ok(!fs.existsSync(path.join(empty, 'requirements', 'non-functional')));
  assert.equal(runCli(empty, ['check']).status, 0);

  const legacy = fixture('requirements-legacy');
  const before = runCli(legacy, ['check', '--json']);
  assert.equal(before.status, 1);
  assert.match(before.stdout, /falta el catálogo/);
  const indexed = runCli(legacy, ['index', '--date', '2026-10-13']);
  assert.equal(indexed.status, 0, indexed.stderr);
  assert.match(indexed.stdout, /catálogo de requisitos: requirements\/index\.md \(5 requisitos\)/);
  assert.equal(runCli(legacy, ['check']).status, 0);
});

test('S118-IT-005 la migración inversa bloquea fragmentos inválidos y los archivos generados son UTF-8 limpio', () => {
  const invalid = fixture('requirements-fragmented');
  const target = path.join(invalid, 'requirements', 'functional', 'FR-001-crear-cuenta.md');
  fs.writeFileSync(target, fs.readFileSync(target, 'utf8').replace('related: []', 'related: [FR-002]'), 'utf8');
  const before = treeHash(invalid);
  const blocked = requirements.migrateFragmented(invalid, { date: '2026-10-13' });
  assert.equal(blocked.exitCode, 1);
  assert.match(blocked.lines.join('\n'), /related debe estar vacío/);
  assert.equal(treeHash(invalid), before);

  const migrated = fixture('srs-single');
  assert.equal(requirements.migrateSrsSingle(migrated, { date: '2026-10-13' }).exitCode, 0);
  for (const file of Object.keys(walk(migrated))) {
    const content = fs.readFileSync(file);
    assert.notDeepEqual([...content.subarray(0, 3)], [0xef, 0xbb, 0xbf]);
    assert.equal(fs.readFileSync(file, 'utf8').includes('\r\n'), false);
  }
});

function walk(dir, found = {}) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, found);
    else found[full] = true;
  }
  return found;
}
