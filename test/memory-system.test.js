'use strict';

/**
 * Tests del motor `skills/memory-system/scripts/memory-system.js` (STORY-095).
 * Cubre UT-001…UT-010 e IT-002 de testcases.md sobre los fixtures de
 * `skills/memory-system/examples/`. Los casos que escriben copian el fixture a un
 * directorio temporal para no ensuciar los ejemplos.
 */

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const REPO_ROOT = path.resolve(__dirname, '..');
const SKILL_DIR = path.join(REPO_ROOT, 'skills', 'memory-system');
const ENGINE = path.join(SKILL_DIR, 'scripts', 'memory-system.js');
const EXAMPLES = path.join(SKILL_DIR, 'examples');

const engine = require(ENGINE);

function run(args, cwd = REPO_ROOT) {
  return spawnSync(process.execPath, [ENGINE, ...args], { cwd, encoding: 'utf8' });
}

function tempDir(t, prefix = 'memory-system-') {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true, maxRetries: 3 }));
  return dir;
}

function copyFixture(t, name) {
  const dir = tempDir(t);
  fs.cpSync(path.join(EXAMPLES, name), dir, { recursive: true });
  return dir;
}

function hashTree(dir) {
  const hashes = {};
  const visit = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) visit(full);
      else hashes[path.relative(dir, full)] = crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex');
    }
  };
  visit(dir);
  return hashes;
}

const withoutUpdated = (content) => content.split('\n').filter((line) => !line.startsWith('updated:')).join('\n');

// Escribe en `dir` una variante del template oficial transformada por `mutate` y devuelve su ruta.
function templateVariant(dir, name, mutate) {
  const official = fs.readFileSync(path.join(SKILL_DIR, 'assets', 'index-template.md'), 'utf8');
  const file = path.join(dir, name);
  fs.writeFileSync(file, mutate(official));
  return file;
}

// ---------------------------------------------------------------------------
// detect (UT-001…UT-003)
// ---------------------------------------------------------------------------

test('UT-001 detect: sddf.config.yaml gana sobre .specify/ y openspec/', (t) => {
  const repo = tempDir(t);
  fs.mkdirSync(path.join(repo, 'docs'));
  fs.mkdirSync(path.join(repo, '.specify'));
  fs.mkdirSync(path.join(repo, 'openspec'));
  fs.writeFileSync(path.join(repo, 'sddf.config.yaml'), 'root: docs\n');
  const result = run(['detect', '--root', path.join(repo, 'docs')]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), 'sddf');
});

test('UT-002 detect: marcadores de directorio y generic', (t) => {
  assert.equal(run(['detect', '--root', path.join(EXAMPLES, 'speckit', 'docs')]).stdout.trim(), 'speckit');
  assert.equal(run(['detect', '--root', path.join(EXAMPLES, 'openspec', 'docs')]).stdout.trim(), 'openspec');
  const repo = tempDir(t);
  fs.mkdirSync(path.join(repo, 'docs'));
  assert.equal(run(['detect', '--root', path.join(repo, 'docs')]).stdout.trim(), 'generic');
});

test('UT-003 detect: --harness fuerza el valor y rechaza uno no admitido con exit 2', () => {
  const root = path.join(EXAMPLES, 'sddf', 'docs');
  assert.equal(run(['detect', '--root', root, '--harness', 'openspec']).stdout.trim(), 'openspec');
  const bad = run(['detect', '--root', root, '--harness', 'foo']);
  assert.equal(bad.status, 2);
  assert.match(bad.stderr, /valor no admitido para --harness: foo/);
  assert.match(bad.stderr, /sddf, speckit, openspec, generic/);
});

test('UT-003b detect: raíz inexistente termina con exit 2', () => {
  const result = run(['detect', '--root', path.join(EXAMPLES, 'no-existe')]);
  assert.equal(result.status, 2);
  assert.match(result.stderr, /no existe/);
});

// ---------------------------------------------------------------------------
// Frontmatter (UT-004, UT-005)
// ---------------------------------------------------------------------------

test('UT-004 parseFrontmatter: escalares, cadenas con ":" y listas', () => {
  const parsed = engine.parseFrontmatter([
    '---',
    'type: story',
    'slug: STORY-001-a',
    'title: "Historia: ejemplo con dos puntos"',
    'related:',
    '  - EPIC-01-x',
    '  - STORY-002-b',
    '---',
    '',
    '# Cuerpo',
    '',
    'Texto.',
  ].join('\n'));
  assert.equal(parsed.hasFrontmatter, true);
  assert.equal(parsed.data.slug, 'STORY-001-a');
  assert.equal(parsed.data.title, 'Historia: ejemplo con dos puntos');
  assert.deepEqual(parsed.data.related, ['EPIC-01-x', 'STORY-002-b']);
  assert.equal(parsed.body, '\n# Cuerpo\n\nTexto.');
});

test('UT-005 parseFrontmatter: ausente o sin cierre devuelve hasFrontmatter=false', () => {
  const none = engine.parseFrontmatter('# Sin frontmatter\n\nTexto.\n');
  assert.equal(none.hasFrontmatter, false);
  assert.deepEqual(none.data, {});
  const unclosed = engine.parseFrontmatter('---\nslug: x\ntitle: y\n\n# Nunca cierra\n');
  assert.equal(unclosed.hasFrontmatter, false);
  assert.match(unclosed.body, /Nunca cierra/);
});

// ---------------------------------------------------------------------------
// Derivación de nodos y exclusiones (UT-006, UT-007)
// ---------------------------------------------------------------------------

test('UT-006 deriveNode: slug, capa y título según D-3', () => {
  const base = path.join(EXAMPLES, 'sddf', 'docs');
  const node = (rel) => engine.deriveNode(path.join(base, ...rel.split('/')), base);
  const adr = node('adr/ADR-0001-x.md');
  assert.deepEqual([adr.slug, adr.layer, adr.title], ['ADR-0001-x', 'adr', 'ADR-0001: Decisión de ejemplo X']);
  const guide = node('guides/sdd.md');
  assert.deepEqual([guide.slug, guide.layer, guide.title], ['sdd', 'guides', 'Guía SDD de ejemplo']);
  const story = node('specs/03-stories/STORY-001-a/story.md');
  assert.deepEqual([story.slug, story.layer], ['STORY-001-a', 'specs-stories']);
  const policies = node('policies/README.md');
  assert.deepEqual([policies.slug, policies.layer], ['policies-index', 'policies']);
  const constitution = node('constitution.md');
  assert.deepEqual([constitution.slug, constitution.layer], ['constitution', 'root']);
  assert.deepEqual(guide.wikilinks, ['STORY-001-a']);
});

test('UT-006b deriveNode: título del primer "#" cuando el frontmatter no lo declara', (t) => {
  const dir = tempDir(t);
  const file = path.join(dir, 'guia.md');
  fs.writeFileSync(file, '---\ntype: guide\n---\n\n# Título desde encabezado\n');
  const node = engine.deriveNode(file, dir);
  assert.equal(node.title, 'Título desde encabezado');
  assert.equal(node.slug, 'guia');
});

test('UT-007 scanNodes: excluye index.md, .cache, templates, derivados y pre-split', (t) => {
  const repo = copyFixture(t, 'sddf');
  const docs = path.join(repo, 'docs');
  fs.writeFileSync(path.join(docs, 'index.md'), '---\nslug: index\n---\n# Índice\n');
  fs.mkdirSync(path.join(docs, 'specs', '.cache'), { recursive: true });
  fs.writeFileSync(path.join(docs, 'specs', '.cache', 'index.json'), '{}');
  fs.writeFileSync(path.join(docs, 'specs', '.cache', 'index.md'), '# cache\n');
  const story = path.join(docs, 'specs', '03-stories', 'STORY-001-a');
  fs.mkdirSync(path.join(story, 'pre-split'));
  fs.writeFileSync(path.join(story, 'pre-split', 'story.md'), '---\nslug: STORY-001-a-old\n---\n# vieja\n');
  fs.writeFileSync(path.join(story, 'implement-report.md'), '# reporte\n');
  const rels = engine.scanNodes(docs, 'sddf').map((n) => n.relPath);
  assert.deepEqual(rels, [
    'adr/ADR-0001-x.md',
    'constitution.md',
    'guides/sdd.md',
    'policies/README.md',
    'specs/03-stories/STORY-001-a/story.md',
  ]);
});

// ---------------------------------------------------------------------------
// index (UT-008…UT-010)
// ---------------------------------------------------------------------------

test('UT-008 index: reproducible salvo updated, formato de entrada y orden ordinal', (t) => {
  const repo = copyFixture(t, 'sddf');
  const docs = path.join(repo, 'docs');
  for (const name of ['Zeta.md', 'alpha.md', 'Beta.md']) {
    fs.writeFileSync(path.join(docs, 'guides', name), `---\ntitle: "${name}"\n---\n# ${name}\n`);
  }
  const first = run(['index', '--root', docs, '--date', '2026-01-01']);
  assert.equal(first.status, 0, first.stderr);
  const one = fs.readFileSync(path.join(docs, 'index.md'), 'utf8');
  const second = run(['index', '--root', docs, '--date', '2026-01-02']);
  assert.equal(second.status, 0, second.stderr);
  const two = fs.readFileSync(path.join(docs, 'index.md'), 'utf8');
  assert.notEqual(one, two);
  assert.equal(withoutUpdated(one), withoutUpdated(two));
  assert.match(two, /^updated: 2026-01-02$/m);

  const entries = two.split('\n').filter((line) => line.startsWith('- [['));
  assert.ok(entries.length >= 5);
  for (const entry of entries) {
    assert.match(entry, /^- \[\[[^\]]+\]\] — \[[^\]]+\]\([^)]+\) — .+$/, entry);
  }
  const guides = entries.filter((line) => line.includes('](guides/')).map((line) => line.match(/\]\((guides\/[^)]+)\)/)[1]);
  assert.deepEqual(guides, ['guides/Beta.md', 'guides/Zeta.md', 'guides/alpha.md', 'guides/sdd.md']);
  assert.match(second.stdout.trim().split('\n').pop(), /^nodos indexados: \d+ · sin frontmatter: \d+ · nodos pendientes: \d+$/);
});

test('UT-009 index --dry-run: nodos pendientes, sin frontmatter y sin escritura', (t) => {
  const repo = copyFixture(t, 'sddf');
  const docs = path.join(repo, 'docs');
  fs.writeFileSync(path.join(docs, 'guides', 'enlaces.md'), [
    '---',
    'title: "Guía con enlaces"',
    '---',
    '# Enlaces',
    'Ver [[no-existe]] y `[[en-codigo]]` y [[sdd|Alias]] y [[STORY-001-a#seccion]].',
    '```',
    '[[en-fence]]',
    '```',
  ].join('\n'));
  fs.writeFileSync(path.join(docs, 'guides', 'huerfana.md'), '# Guía sin frontmatter\n');
  const result = run(['index', '--root', docs, '--dry-run']);
  assert.equal(result.status, 0, result.stderr);
  assert.ok(result.stdout.includes('- [[no-existe]] ⚠️ nodo pendiente'));
  assert.ok(!result.stdout.includes('en-codigo'));
  assert.ok(!result.stdout.includes('en-fence'));
  assert.ok(!result.stdout.includes('[[sdd]] ⚠️ nodo pendiente'));
  assert.ok(result.stdout.includes('- [huerfana.md](guides/huerfana.md) — Guía sin frontmatter ⚠️ sin frontmatter'));
  assert.ok(!fs.existsSync(path.join(docs, 'index.md')));
  assert.match(result.stdout.trim().split('\n').pop(), /^nodos indexados: 7 · sin frontmatter: 1 · nodos pendientes: 1$/);
});

test('UT-010 index: template sin {layer:adr} termina con exit 2 sin escribir', (t) => {
  const repo = copyFixture(t, 'sddf');
  const docs = path.join(repo, 'docs');
  const previous = '# índice previo\n';
  fs.writeFileSync(path.join(docs, 'index.md'), previous);
  const templatePath = templateVariant(repo, 'template-sin-adr.md', (t) => t.replace('{layer:adr}', ''));
  const result = run(['index', '--root', docs, '--template', templatePath]);
  assert.equal(result.status, 2);
  assert.match(result.stderr, /"adr"/);
  assert.match(result.stderr, /\{layer:adr\}/);
  assert.equal(fs.readFileSync(path.join(docs, 'index.md'), 'utf8'), previous);
});

test('UT-010b index: placeholder de capa desconocida termina con exit 2', (t) => {
  const repo = copyFixture(t, 'sddf');
  const docs = path.join(repo, 'docs');
  const templatePath = templateVariant(repo, 'template-desconocida.md', (t) => `${t}\n{layer:inventada}\n`);
  const result = run(['index', '--root', docs, '--template', templatePath, '--dry-run']);
  assert.equal(result.status, 2);
  assert.match(result.stderr, /inventada/);
});

test('UT-008b renderIndex: capa vacía se sustituye por _(sin artefactos)_', () => {
  const { content, summary } = engine.renderIndex('a\n{layer:adr}\nb\n{stats}\n{date}\n', [], { date: '2026-01-01' });
  assert.match(content, /_\(sin artefactos\)_/);
  assert.match(content, /2026-01-01/);
  assert.deepEqual(summary, { indexed: 0, withoutFrontmatter: 0, pending: 0 });
});

// ---------------------------------------------------------------------------
// IT-002 — proyecto OpenSpec con raíces externas
// ---------------------------------------------------------------------------

test('IT-002 index openspec: nodos externos indexados y openspec/ intacto', (t) => {
  const repo = copyFixture(t, 'openspec');
  const docs = path.join(repo, 'docs');
  const before = hashTree(path.join(repo, 'openspec'));
  assert.equal(run(['detect', '--root', docs]).stdout.trim(), 'openspec');
  const result = run(['index', '--root', docs]);
  assert.equal(result.status, 0, result.stderr);
  const index = fs.readFileSync(path.join(docs, 'index.md'), 'utf8');
  const external = index.slice(index.indexOf('## 🔗 Artefactos externos'), index.indexOf('## 📊 Estado del grafo'));
  assert.match(external, /- \[\[auth\]\] — \[spec\.md\]\(\.\.\/openspec\/specs\/auth\/spec\.md\) — Auth capability/);
  assert.match(external, /- \[\[add-login\]\] — \[proposal\.md\]\(\.\.\/openspec\/changes\/add-login\/proposal\.md\) — Add login/);
  assert.match(index, /- \[\[intro\]\] — \[intro\.md\]\(guides\/intro\.md\)/);
  assert.deepEqual(hashTree(path.join(repo, 'openspec')), before);
});

test('IT-002b index speckit: specs/*/spec.md y plan.md como nodos externos', (t) => {
  const repo = copyFixture(t, 'speckit');
  const docs = path.join(repo, 'docs');
  const result = run(['index', '--root', docs, '--dry-run']);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /\[\[001-feature\]\] — \[spec\.md\]\(\.\.\/specs\/001-feature\/spec\.md\)/);
  assert.match(result.stdout, /\[\[001-feature\]\] — \[plan\.md\]\(\.\.\/specs\/001-feature\/plan\.md\)/);
});

test('UT-002b HARNESS_PROFILES: claves reservadas para STORY-098 (D-2)', () => {
  for (const name of ['sddf', 'speckit', 'openspec', 'generic']) {
    const profile = engine.HARNESS_PROFILES[name];
    assert.ok('marker' in profile);
    assert.deepEqual(profile.skipLayers, []);
    assert.deepEqual(profile.mappings, {});
    assert.ok(Array.isArray(profile.externalRoots));
  }
});
