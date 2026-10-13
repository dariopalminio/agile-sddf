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

test('S118-IT-006 check resuelve implements en SRS único y fragmentado', () => {
  for (const name of ['srs-single', 'requirements-fragmented']) {
    const dir = fixture(name);
    const result = runCli(dir, ['check', '--json']);
    assert.equal(result.status, 0, `${name}: ${result.stdout}`);
    const report = JSON.parse(result.stdout);
    assert.equal(report.summary.requirement, 0, name);
    assert.equal(report.summary['broken-wikilink'], 0, name);
    assert.deepEqual(report.problems, [], name);
  }
});

test('S118-IT-007 la migración fragmentado → SRS es idempotente y los IDs siguen resolviendo', () => {
  const dir = fixture('requirements-fragmented');
  const first = requirements.migrateFragmented(dir, { date: '2026-10-13', displayRoot: 'docs' });
  assert.equal(first.exitCode, 0);
  const srsFile = requirements.inventoryRequirements(dir).srsFiles[0];
  const document = fs.readFileSync(srsFile, 'utf8');
  const repeat = requirements.migrateFragmented(dir, { date: '2026-10-13', displayRoot: 'docs' });
  assert.equal(repeat.exitCode, 0);
  assert.match(repeat.lines.join('\n'), /\[SIN CAMBIOS\]/);
  assert.equal(fs.readFileSync(srsFile, 'utf8'), document);
  const inventory = requirements.inventoryRequirements(dir);
  assert.equal(inventory.layout, 'srs');
  assert.deepEqual(requirements.requirementAliases(inventory), ['FR-001', 'FR-002', 'FR-003', 'NFR-001', 'NFR-002']);
  const check = JSON.parse(runCli(dir, ['check', '--json']).stdout);
  assert.equal(check.ok, true);
  assert.equal(check.summary.requirement, 0);
});

test('S118-IT-008 check informa cada regla de requisitos en ambas disposiciones', () => {
  const details = (dir) => JSON.parse(runCli(dir, ['check', '--json']).stdout).problems.filter((item) => item.kind === 'requirement').map((item) => item.detail);

  // implements que no resuelve o mal formado (SRS único y fragmentado)
  for (const name of ['srs-single', 'requirements-fragmented']) {
    const dir = fixture(name);
    const story = path.join(dir, 'specs', 'stories', 'STORY-001-prueba', 'story.md');
    fs.writeFileSync(story, fs.readFileSync(story, 'utf8').replace('implements: [FR-001, NFR-002]', 'implements: [FR-099, mal]'), 'utf8');
    const found = details(dir);
    assert.ok(found.some((detail) => /implements: FR-099 no resuelve/.test(detail)), `${name}: ${found}`);
    assert.ok(found.some((detail) => /implements: mal no es un ID FR-NNN\/NFR-NNN/.test(detail)), `${name}: ${found}`);
  }

  // ID duplicado en un SRS
  const duplicated = fixture('srs-single');
  const srsFile = requirements.inventoryRequirements(duplicated).srsFiles[0];
  fs.appendFileSync(srsFile, '\n### FR-001 — Repetido\n\nOtra vez.\n', 'utf8');
  assert.ok(details(duplicated).some((detail) => /ID duplicado FR-001/.test(detail)));

  // frontmatter de fragmento inválido y kind incompatible con la carpeta
  const fragmented = fixture('requirements-fragmented');
  const fragment = path.join(fragmented, 'requirements', 'functional', 'FR-001-crear-cuenta.md');
  fs.writeFileSync(fragment, fs.readFileSync(fragment, 'utf8').replace('type: requirement', 'type: wiki').replace('kind: functional', 'kind: non-functional').replace('title: "Crear cuenta"', 'title: ""'), 'utf8');
  const invalid = details(fragmented);
  assert.ok(invalid.some((detail) => /frontmatter de requisito: type debe ser requirement/.test(detail)), invalid.join('\n'));
  assert.ok(invalid.some((detail) => /frontmatter de requisito: kind debe ser functional y coincidir con la carpeta functional\//.test(detail)), invalid.join('\n'));
  assert.ok(invalid.some((detail) => /frontmatter de requisito: title vacío/.test(detail)), invalid.join('\n'));

  // catálogo que no lista un ID o lista uno inexistente
  const stale = fixture('requirements-fragmented');
  const catalog = path.join(stale, 'requirements', 'index.md');
  fs.writeFileSync(catalog, fs.readFileSync(catalog, 'utf8').replace('- [[FR-003-eliminar-cuenta]] — FR-003 — Eliminar cuenta', '- [[FR-009-fantasma]] — FR-009 — Fantasma'), 'utf8');
  const drift = details(stale);
  assert.ok(drift.some((detail) => /no lista FR-003/.test(detail)), drift.join('\n'));
  assert.ok(drift.some((detail) => /lista FR-009, que no existe/.test(detail)), drift.join('\n'));

  // disposición mixta
  assert.ok(details(fixture('requirements-mixed')).some((detail) => /dos disposiciones/.test(detail)));
});

test('S118-IT-009 la migración a fragmentos conserva el catálogo aunque un index.md previo enlace al SRS', () => {
  const dir = fixture('srs-single');
  const slug = path.basename(requirements.inventoryRequirements(dir).srsFiles[0], '.md');
  fs.writeFileSync(path.join(dir, 'requirements', 'index.md'), `---\ntype: wiki\nslug: indice-previo\ntitle: Índice previo\nstatus: IN-PROGRESS\nsubstatus: DONE\nparent: null\ncreated: 2026-10-01\nupdated: 2026-10-01\n---\n\n# Índice previo\n\n- [[${slug}#FR-001]]\n- [[${slug}]]\n`, 'utf8');
  const result = requirements.migrateSrsSingle(dir, { date: '2026-10-13', displayRoot: 'docs' });
  assert.equal(result.exitCode, 0, result.lines.join('\n'));
  const catalog = fs.readFileSync(path.join(dir, 'requirements', 'index.md'), 'utf8');
  assert.match(catalog, /slug: requirements-catalog/);
  for (const id of ['FR-001', 'FR-002', 'FR-003', 'NFR-001', 'NFR-002']) assert.match(catalog, new RegExp(id));
  assert.equal(catalog.includes(`[[${slug}`), false);
  assert.equal(JSON.parse(runCli(dir, ['check', '--json']).stdout).summary.requirement, 0);
});

test('S118-IT-010 index reconoce los IDs de requisitos como wikilinks resolubles', () => {
  for (const name of ['srs-single', 'requirements-fragmented']) {
    const dir = fixture(name);
    const guide = path.join(dir, 'guides', 'enlaces.md');
    assert.ok(fs.existsSync(guide), name);
    const indexed = runCli(dir, ['index', '--date', '2026-10-13']);
    assert.equal(indexed.status, 0, indexed.stderr);
    const index = fs.readFileSync(path.join(dir, 'index.md'), 'utf8');
    assert.equal(/nodo pendiente/.test(index), false, `${name}: ${index}`);
    assert.match(indexed.stdout, /Wikilinks pendientes: 0|pendientes: 0/);
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
