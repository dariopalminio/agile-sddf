'use strict';

/**
 * Tests del motor `skills/memory-system/scripts/memory-system.js` (STORY-095, STORY-096, STORY-097).
 * Cubre UT-001…UT-010 e IT-002 de STORY-095; con prefijo `S096-`, UT-001…UT-008 de STORY-096
 * (subcomando `scaffold`); y con prefijo `S097-`, UT-001…UT-011 y E2E-001/E2E-002 de STORY-097
 * (subcomando `check`), todos sobre los fixtures de `skills/memory-system/examples/`.
 * Los casos que escriben copian el fixture a un directorio temporal para no ensuciar los
 * ejemplos.
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

// Ejecuta el motor desde REPO_ROOT y devuelve { status, stdout, stderr }.
function run(args) {
  return spawnSync(process.execPath, [ENGINE, ...args], { cwd: REPO_ROOT, encoding: 'utf8' });
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
      else hashes[path.relative(dir, full).split(path.sep).join('/')] = crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex');
    }
  };
  visit(dir);
  return hashes;
}

const countFiles = (dir) => Object.keys(hashTree(dir)).length;
const lastLine = (stdout) => stdout.trim().split('\n').pop();
const readUtf8 = (...segments) => fs.readFileSync(path.join(...segments), 'utf8');

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
  const one = readUtf8(docs, 'index.md');
  const second = run(['index', '--root', docs, '--date', '2026-01-02']);
  assert.equal(second.status, 0, second.stderr);
  const two = readUtf8(docs, 'index.md');
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
  const templatePath = templateVariant(repo, 'template-sin-adr.md', (tpl) => tpl.replace('{layer:adr}', ''));
  const result = run(['index', '--root', docs, '--template', templatePath]);
  assert.equal(result.status, 2);
  assert.match(result.stderr, /"adr"/);
  assert.match(result.stderr, /\{layer:adr\}/);
  assert.equal(readUtf8(docs, 'index.md'), previous);
});

test('UT-010b index: placeholder de capa desconocida termina con exit 2', (t) => {
  const repo = copyFixture(t, 'sddf');
  const docs = path.join(repo, 'docs');
  const templatePath = templateVariant(repo, 'template-desconocida.md', (tpl) => `${tpl}\n{layer:inventada}\n`);
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
  const index = readUtf8(docs, 'index.md');
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

// ---------------------------------------------------------------------------
// STORY-096 — scaffold (UT-001…UT-008 de testcases.md, prefijo S096-)
// ---------------------------------------------------------------------------

const SCAFFOLD_SUMMARY = /^creados: (\d+) · sobrescritos: (\d+) · preservados: (\d+) · omitidos por harness: (\d+)$/;

// Las once capas y las seis plantillas que scaffold garantiza (AC-5, AC-6).
const LAYER_DIRS = ['product', 'requirements', 'specs', 'domains', 'architecture', 'adr', 'policies', 'guardrails', 'guides', 'runbooks', 'templates'];
const SIX_TEMPLATES = ['story-template.md', 'epic-template.md', 'project-template.md', 'project-intent-template.md', 'project-plan-template.md', 'adr-template.md'];

const summaryOf = (stdout) => {
  const match = lastLine(stdout).match(SCAFFOLD_SUMMARY);
  assert.ok(match, `resumen inesperado: ${lastLine(stdout)}`);
  return { created: +match[1], overwritten: +match[2], preserved: +match[3], skipped: +match[4] };
};

// `--cli-root` real del repo: los cinco skills dueños están instalados en `skills/`.
const CLI_ROOT = REPO_ROOT;

test('S096-UT-001 scaffold: copia-si-falta crea el árbol semilla con {date} sustituido', (t) => {
  const repo = copyFixture(t, 'empty');
  const docs = path.join(repo, 'docs');
  const result = run(['scaffold', '--root', docs, '--cli-root', CLI_ROOT, '--date', '2026-03-04']);
  assert.equal(result.status, 0, result.stderr);

  assert.ok(fs.existsSync(path.join(docs, 'constitution.md')));
  for (const name of ['vision', 'stakeholders', 'objectives']) {
    assert.ok(fs.existsSync(path.join(docs, 'product', `${name}.md`)), name);
  }
  for (const layer of LAYER_DIRS) {
    assert.ok(fs.existsSync(path.join(docs, layer, 'README.md')), `README de ${layer}`);
  }
  for (const name of SIX_TEMPLATES) {
    assert.ok(fs.existsSync(path.join(docs, 'templates', name)), name);
  }
  for (const sub of ['01-projects', '02-epics', '03-stories']) {
    assert.ok(fs.existsSync(path.join(docs, 'specs', sub, '.gitkeep')), sub);
  }
  assert.ok(!fs.existsSync(path.join(docs, 'index.md')), 'scaffold no crea index.md');

  const vision = readUtf8(docs, 'product', 'vision.md');
  assert.match(vision, /^created: 2026-03-04$/m);
  assert.match(vision, /^updated: 2026-03-04$/m);
  assert.ok(!vision.includes('{date}'));
  assert.match(vision, /^type: product$/m);
  assert.match(readUtf8(docs, 'requirements', 'README.md'), /^slug: requirements-index$/m);

  const created = result.stdout.split('\n').filter((line) => line.startsWith('[CREADO] '));
  assert.ok(created.includes('[CREADO] constitution.md'));
  assert.ok(created.includes('[CREADO] product/vision.md'));
  assert.ok(created.includes('[CREADO] templates/adr-template.md'));
  assert.ok(!result.stdout.includes('[PRESERVADO]'));
  assert.ok(!result.stdout.includes('[WARNING]'));
  const summary = summaryOf(result.stdout);
  assert.equal(summary.created, created.length);
  assert.deepEqual([summary.overwritten, summary.preserved, summary.skipped], [0, 0, 0]);
  assert.equal(countFiles(docs), created.length + 1); // + docs/.gitkeep del fixture
});

test('S096-UT-002 scaffold: idempotente, la segunda corrida preserva todo con creados: 0', (t) => {
  const repo = copyFixture(t, 'sddf-partial');
  const docs = path.join(repo, 'docs');
  const first = run(['scaffold', '--root', docs, '--cli-root', CLI_ROOT]);
  assert.equal(first.status, 0, first.stderr);
  assert.ok(first.stdout.includes('[CREADO] product/vision.md'));
  assert.ok(first.stdout.includes('[CREADO] requirements/README.md'));
  assert.ok(first.stdout.includes('[PRESERVADO] constitution.md'));
  assert.ok(!first.stdout.includes('specs/03-stories/.gitkeep'), 'un directorio con contenido no recibe .gitkeep');
  assert.match(readUtf8(docs, 'constitution.md'), /Regla local:/);
  const after = hashTree(docs);

  const second = run(['scaffold', '--root', docs, '--cli-root', CLI_ROOT]);
  assert.equal(second.status, 0, second.stderr);
  assert.ok(!second.stdout.includes('[CREADO]'));
  assert.ok(!second.stdout.includes('[SOBRESCRITO]'));
  const summary = summaryOf(second.stdout);
  assert.deepEqual([summary.created, summary.overwritten, summary.skipped], [0, 0, 0]);
  // Los `.gitkeep` creados en la primera corrida no se vuelven a listar: su directorio ya existe.
  const firstListed = first.stdout.split('\n').filter((line) => /^\[(CREADO|PRESERVADO)\] /.test(line) && !line.endsWith('.gitkeep'));
  assert.equal(summary.preserved, firstListed.length);
  assert.deepEqual(hashTree(docs), after);
});

test('S096-UT-003 scaffold --dry-run: lista [CREARÍA] y no escribe', (t) => {
  const repo = copyFixture(t, 'empty');
  const docs = path.join(repo, 'docs');
  const before = hashTree(repo);
  const result = run(['scaffold', '--root', docs, '--cli-root', CLI_ROOT, '--dry-run']);
  assert.equal(result.status, 0, result.stderr);
  assert.ok(result.stdout.includes('[CREARÍA] constitution.md'));
  assert.ok(result.stdout.includes('[CREARÍA] templates/story-template.md'));
  assert.ok(!result.stdout.includes('[CREADO]'));
  assert.ok(summaryOf(result.stdout).created > 0);
  assert.deepEqual(hashTree(repo), before);

  // Bootstrap simulado: la raíz ausente (con padre existente) tampoco se crea con --dry-run.
  const fresh = path.join(repo, 'docs-nueva');
  const boot = run(['scaffold', '--root', fresh, '--dry-run']);
  assert.equal(boot.status, 0, boot.stderr);
  assert.ok(!fs.existsSync(fresh));
});

test('S096-UT-004 scaffold: plantillas compartidas copiadas byte a byte desde el skill dueño', (t) => {
  const repo = copyFixture(t, 'empty');
  const docs = path.join(repo, 'docs');
  const result = run(['scaffold', '--root', docs, '--cli-root', CLI_ROOT]);
  assert.equal(result.status, 0, result.stderr);
  for (const { name, owner } of engine.SHARED_TEMPLATES) {
    const source = fs.readFileSync(path.join(REPO_ROOT, 'skills', owner, 'assets', name));
    assert.ok(source.equals(fs.readFileSync(path.join(docs, 'templates', name))), `${name} byte a byte`);
  }
  const seed = fs.readFileSync(path.join(engine.SCAFFOLD_DIR, 'templates', 'adr-template.md'), 'utf8').replace(/\r\n?/g, '\n');
  assert.equal(readUtf8(docs, 'templates', 'adr-template.md'), seed);
  assert.ok(!result.stdout.includes('[WARNING]'));
});

test('S096-UT-005 scaffold: dueño de plantilla ausente emite [WARNING] y termina con exit 0', (t) => {
  const repo = copyFixture(t, 'empty');
  const docs = path.join(repo, 'docs');
  const emptyCli = tempDir(t, 'cli-root-');
  const result = run(['scaffold', '--root', docs, '--cli-root', emptyCli]);
  assert.equal(result.status, 0, result.stderr);
  for (const { name, owner } of engine.SHARED_TEMPLATES) {
    assert.ok(result.stdout.includes(`[WARNING] template no copiado: ${name} (skill ${owner} no instalado)`), name);
    assert.ok(!fs.existsSync(path.join(docs, 'templates', name)));
  }
  assert.ok(fs.existsSync(path.join(docs, 'templates', 'adr-template.md')));
  assert.ok(fs.existsSync(path.join(docs, 'templates', 'README.md')));

  // Sin --cli-root: mismos avisos, mismo exit 0.
  const noCli = run(['scaffold', '--root', path.join(copyFixture(t, 'empty'), 'docs')]);
  assert.equal(noCli.status, 0, noCli.stderr);
  assert.equal((noCli.stdout.match(/\[WARNING\] template no copiado/g) || []).length, engine.SHARED_TEMPLATES.length);
});

test('S096-UT-006 scaffold --force: restaura solo semillas y plantillas, conserva ADR-0001-x.md', (t) => {
  const repo = copyFixture(t, 'sddf-partial');
  const docs = path.join(repo, 'docs');
  assert.equal(run(['scaffold', '--root', docs, '--cli-root', CLI_ROOT]).status, 0);
  const pristine = hashTree(docs);

  // Ediciones manuales sobre archivos gestionados y un artefacto de autor.
  fs.appendFileSync(path.join(docs, 'constitution.md'), '\nRegla local añadida.\n');
  fs.writeFileSync(path.join(docs, 'adr', 'README.md'), '# README editado\n');
  fs.writeFileSync(path.join(docs, 'templates', 'story-template.md'), '# plantilla editada\n');
  const filesBefore = countFiles(docs);

  const result = run(['scaffold', '--root', docs, '--cli-root', CLI_ROOT, '--force', '--date', '2026-03-04']);
  assert.equal(result.status, 0, result.stderr);
  for (const rel of ['constitution.md', 'adr/README.md', 'templates/story-template.md']) {
    assert.ok(result.stdout.includes(`[SOBRESCRITO] ${rel}`), rel);
  }
  assert.ok(!result.stdout.includes('ADR-0001-x.md'));
  assert.ok(!result.stdout.includes('guides/sdd.md'));
  assert.ok(!result.stdout.includes('[CREADO]'));
  assert.ok(!result.stdout.includes('[PRESERVADO]'));

  const restored = hashTree(docs);
  for (const author of ['adr/ADR-0001-x.md', 'guides/sdd.md', 'specs/03-stories/STORY-001-a/story.md']) {
    assert.equal(restored[author], pristine[author], `${author} intacto`);
  }
  assert.ok(!readUtf8(docs, 'constitution.md').includes('Regla local'));
  assert.match(readUtf8(docs, 'adr', 'README.md'), /^slug: adr-index$/m);
  // La plantilla compartida vuelve a ser la del skill dueño (el fixture traía una versión propia).
  const owner = fs.readFileSync(path.join(REPO_ROOT, 'skills', 'story-creation', 'assets', 'story-template.md'));
  assert.ok(owner.equals(fs.readFileSync(path.join(docs, 'templates', 'story-template.md'))));
  assert.equal(countFiles(docs), filesBefore);

  const summary = summaryOf(result.stdout);
  const managed = (result.stdout.match(/^\[SOBRESCRITO\] /gm) || []).length;
  assert.equal(summary.overwritten, managed);
  assert.ok(managed >= 3);
  assert.deepEqual([summary.created, summary.preserved, summary.skipped], [0, 0, 0]);
});

test('S096-UT-007 scaffold: ningún modo elimina archivos', (t) => {
  const repo = copyFixture(t, 'sddf-partial');
  const docs = path.join(repo, 'docs');
  // Archivos extra en cada capa (incluidas las que scaffold va a crear).
  for (const layer of LAYER_DIRS) {
    fs.mkdirSync(path.join(docs, layer), { recursive: true });
    fs.writeFileSync(path.join(docs, layer, 'extra-de-autor.md'), `# extra ${layer}\n`);
  }
  fs.writeFileSync(path.join(docs, 'index.md'), '# índice previo\n');
  let count = countFiles(docs);
  for (const flags of [[], ['--force'], ['--dry-run'], ['--dry-run', '--force'], []]) {
    const result = run(['scaffold', '--root', docs, '--cli-root', CLI_ROOT, ...flags]);
    assert.equal(result.status, 0, result.stderr);
    const now = countFiles(docs);
    assert.ok(now >= count, `flags ${flags.join(' ')}: ${now} < ${count}`);
    count = now;
    for (const layer of LAYER_DIRS) assert.ok(fs.existsSync(path.join(docs, layer, 'extra-de-autor.md')), layer);
    assert.equal(readUtf8(docs, 'index.md'), '# índice previo\n');
  }
});

test('S096-UT-008 scaffold: raíz sin padre y árbol semilla ausente terminan con exit 2 sin escribir', (t) => {
  const repo = tempDir(t);
  const missing = path.join(repo, 'no-existe', 'docs');
  const result = run(['scaffold', '--root', missing]);
  assert.equal(result.status, 2);
  assert.match(result.stderr, /no-existe/);
  assert.ok(!fs.existsSync(path.dirname(missing)));

  const docs = path.join(copyFixture(t, 'empty'), 'docs');
  const before = hashTree(docs);
  const badSeeds = path.join(repo, 'sin-semillas');
  assert.throws(() => engine.scaffold({ root: docs, scaffoldDir: badSeeds }), (error) => error.message.includes('sin-semillas'));
  assert.deepEqual(hashTree(docs), before);

  // Bootstrap: raíz ausente con padre existente se crea (caso `docs/` inexistente).
  const boot = run(['scaffold', '--root', path.join(repo, 'docs')]);
  assert.equal(boot.status, 0, boot.stderr);
  assert.ok(fs.existsSync(path.join(repo, 'docs', 'constitution.md')));
});

test('S096-IT-001 scaffold + index: las semillas se indexan sin nodos pendientes', (t) => {
  const repo = copyFixture(t, 'sddf-partial');
  const docs = path.join(repo, 'docs');
  assert.equal(run(['scaffold', '--root', docs, '--cli-root', CLI_ROOT]).status, 0);
  const result = run(['index', '--root', docs]);
  assert.equal(result.status, 0, result.stderr);
  const index = readUtf8(docs, 'index.md');
  for (const slug of ['vision', 'stakeholders', 'objectives', 'requirements-index', 'specs-index', 'adr-index', 'constitution']) {
    assert.ok(index.includes(`- [[${slug}]]`), slug);
  }
  assert.ok(!index.includes('templates-index'), 'templates/ no se indexa');
  assert.ok(!index.includes('⚠️ sin frontmatter'));
  assert.match(lastLine(result.stdout), /nodos pendientes: 0$/);
});

test('S096-UT-001b LAYERS: catálogo único del scaffold y del índice', () => {
  assert.deepEqual(engine.LAYERS, LAYER_DIRS);
  for (const layer of engine.LAYERS) {
    if (layer === 'specs') continue;
    if (layer === 'templates') assert.ok(!engine.KNOWN_LAYERS.includes(layer));
    else assert.ok(engine.KNOWN_LAYERS.includes(layer), layer);
  }
  assert.deepEqual(engine.SHARED_TEMPLATES.map((template) => template.name).concat('adr-template.md'), SIX_TEMPLATES);
});

// ---------------------------------------------------------------------------
// STORY-097 — check (UT-001…UT-011 y E2E-001/E2E-002 de testcases.md, prefijo S097-)
// Contratos de verificación V-1…V-10 de design.md.
// ---------------------------------------------------------------------------

const CHECK_KINDS = ['missing-layer', 'orphan', 'invalid-frontmatter', 'broken-wikilink'];

// Contexto de evaluación mínimo: `root` lo usa solo `missingLayers`.
function checkCtx({ root = os.tmpdir(), nodes = [], profile = { skipLayers: [] }, slugSet = new Set() } = {}) {
  return { root, nodes, layers: engine.LAYERS, profile, slugSet };
}

// Nodo sintético con los campos que consumen los evaluadores.
function fakeNode(relPath, { declared = null, wikilinks = [] } = {}) {
  return { relPath, hasFrontmatter: declared !== null, declared: declared || {}, wikilinks, slugPlaceholder: false, slug: relPath };
}

// Raíz con las once capas menos las de `omit`; `constitution` crea también constitution.md.
function layerTree(t, { omit = [], constitution = true } = {}) {
  const root = tempDir(t, 'memory-check-');
  for (const layer of engine.LAYERS) {
    if (!omit.includes(layer)) fs.mkdirSync(path.join(root, layer), { recursive: true });
  }
  if (constitution) fs.writeFileSync(path.join(root, 'constitution.md'), '---\ntype: constitution\nslug: constitution\ntitle: "C"\n---\n# C\n');
  return root;
}

const kindLines = (stdout) => stdout.split('\n').filter((line) => line.startsWith('['));

test('S097-UT-001 missingLayers: capa ausente y constitution.md ausente (V-1)', (t) => {
  const root = layerTree(t, { omit: ['product'], constitution: false });
  assert.deepEqual(engine.missingLayers(checkCtx({ root })), [
    { kind: 'missing-layer', path: 'constitution.md', detail: 'capa ausente' },
    { kind: 'missing-layer', path: 'product/', detail: 'capa ausente' },
  ]);
  // Con el árbol completo no hay ningún problema.
  assert.deepEqual(engine.missingLayers(checkCtx({ root: layerTree(t) })), []);
});

test('S097-UT-002 missingLayers: skipLayers del harness no genera missing-layer (V-7)', (t) => {
  const root = layerTree(t, { omit: ['specs'] });
  assert.deepEqual(engine.missingLayers(checkCtx({ root, profile: { skipLayers: ['specs'] } })), []);
  assert.deepEqual(engine.missingLayers(checkCtx({ root })), [
    { kind: 'missing-layer', path: 'specs/', detail: 'capa ausente' },
  ]);
});

test('S097-UT-003 orphans: un problema por nodo sin frontmatter', () => {
  const nodes = [
    fakeNode('guides/notas.md'),
    fakeNode('guides/sdd.md', { declared: { type: 'guide', slug: 'sdd', title: 'Guía' } }),
    fakeNode('adr/otra.md'),
  ];
  assert.deepEqual(engine.orphans(checkCtx({ nodes })), [
    { kind: 'orphan', path: 'adr/otra.md', detail: 'sin frontmatter' },
    { kind: 'orphan', path: 'guides/notas.md', detail: 'sin frontmatter' },
  ]);
});

test('S097-UT-004 invalidFrontmatter: campos obligatorios por tipo (V-6)', () => {
  assert.deepEqual(engine.REQUIRED_FIELDS, { all: ['type', 'slug', 'title'], specs: ['id', 'status'] });
  const nodes = [
    fakeNode('guides/sdd.md', { declared: { type: 'guide', slug: 'sdd', title: 'Guía sin id' } }),
    fakeNode('specs/03-stories/STORY-001-a/story.md', { declared: { type: 'story', id: 'STORY-001', slug: 'STORY-001-a', title: 'H' } }),
    fakeNode('adr/ADR-0003-x.md', { declared: { type: 'adr', slug: 'ADR-0003-x' } }),
    fakeNode('specs/02-epics/EPIC-01-x/epic.md', { declared: { type: 'epic', slug: 'EPIC-01-x', title: '  ' } }),
    fakeNode('guides/huerfana.md'),
  ];
  assert.deepEqual(engine.invalidFrontmatter(checkCtx({ nodes })), [
    { kind: 'invalid-frontmatter', path: 'adr/ADR-0003-x.md', detail: 'falta title' },
    { kind: 'invalid-frontmatter', path: 'specs/02-epics/EPIC-01-x/epic.md', detail: 'falta id' },
    { kind: 'invalid-frontmatter', path: 'specs/02-epics/EPIC-01-x/epic.md', detail: 'falta status' },
    { kind: 'invalid-frontmatter', path: 'specs/02-epics/EPIC-01-x/epic.md', detail: 'falta title' },
    { kind: 'invalid-frontmatter', path: 'specs/03-stories/STORY-001-a/story.md', detail: 'falta status' },
  ]);
});

test('S097-UT-005 brokenWikilinks: resuelve contra el slugSet con raíces externas', () => {
  const docs = path.join(EXAMPLES, 'openspec', 'docs');
  const scanned = engine.scanNodes(docs, 'openspec');
  const slugs = engine.slugSetOf(scanned);
  for (const slug of ['intro', 'auth', 'add-login', 'index']) assert.ok(slugs.has(slug), slug);

  const nodes = [...scanned, fakeNode('guides/enlaces.md', {
    declared: { type: 'guide', slug: 'enlaces', title: 'Enlaces' },
    wikilinks: ['intro', 'no-existe', 'auth'],
  })];
  assert.deepEqual(engine.brokenWikilinks(checkCtx({ nodes, slugSet: engine.slugSetOf(nodes) })), [
    { kind: 'broken-wikilink', path: 'guides/enlaces.md', detail: '[[no-existe]] no resuelve' },
  ]);
});

test('S097-UT-006 extractWikilinks: código, fence, alias, ancla y placeholder (V-5)', () => {
  const body = [
    'Inline: `[[en-codigo]]`.',
    '',
    '```markdown',
    '[[en-fence]]',
    '```',
    '',
    'Alias [[sdd|Alias]] y ancla [[sdd#seccion]] y placeholder [[<slug>]] y vacío [[ ]].',
  ].join('\n');
  assert.deepEqual(engine.extractWikilinks(body), ['sdd', 'sdd']);
});

test('S097-UT-007 check: templates/ y derivados de historia no se evalúan (V-5)', (t) => {
  const docs = path.join(copyFixture(t, 'broken'), 'docs');
  const rels = engine.scanNodes(docs, 'sddf').map((node) => node.relPath);
  assert.ok(!rels.some((rel) => rel.startsWith('templates/')), 'templates/ excluido');
  assert.ok(!rels.includes('specs/03-stories/STORY-001-a/design.md'), 'derivado excluido');

  const result = engine.checkMemory(docs, 'sddf');
  assert.equal(result.summary['broken-wikilink'], 1);
  for (const entry of result.problems) {
    assert.ok(!entry.path.startsWith('templates/'), entry.path);
    assert.ok(!entry.path.endsWith('design.md'), entry.path);
    assert.ok(!/en-codigo|en-fence|<slug>|\[\[x\]\]|\[\[real\]\]/.test(entry.detail), entry.detail);
  }
});

test('S097-UT-008 check --json: objeto único, claves ordenadas y byte a byte reproducible (V-3, V-8)', () => {
  const root = 'skills/memory-system/examples/broken/docs';
  const first = run(['check', '--root', root, '--json']);
  const second = run(['check', '--root', root, '--json']);
  assert.equal(first.status, 1);
  assert.equal(first.stdout, second.stdout, 'dos ejecuciones idénticas');
  assert.equal(first.stderr, '');

  const parsed = JSON.parse(first.stdout);
  assert.deepEqual(Object.keys(parsed), ['harness', 'root', 'ok', 'summary', 'problems']);
  assert.deepEqual(Object.keys(parsed.summary), CHECK_KINDS);
  assert.deepEqual([parsed.harness, parsed.root, parsed.ok], ['sddf', root, false]);
  assert.deepEqual(parsed.summary, { 'missing-layer': 1, orphan: 1, 'invalid-frontmatter': 1, 'broken-wikilink': 1 });

  // Orden canónico (kind, path, detail) y `path` siempre con `/` (NFR-4).
  const keys = parsed.problems.map((entry) => `${entry.kind}\u0000${entry.path}\u0000${entry.detail}`);
  assert.deepEqual(keys, [...keys].sort());
  for (const entry of parsed.problems) {
    assert.ok(CHECK_KINDS.includes(entry.kind), entry.kind);
    assert.ok(!entry.path.includes('\\'), entry.path);
  }
});

test('S097-UT-009 check: solo lectura, ningún hash cambia ni aparecen archivos nuevos (V-1)', (t) => {
  const repo = copyFixture(t, 'broken');
  const before = hashTree(repo);
  for (const flags of [[], ['--json']]) {
    const result = run(['check', '--root', path.join(repo, 'docs'), ...flags]);
    assert.equal(result.status, 1, result.stderr);
  }
  const after = hashTree(repo);
  assert.deepEqual(after, before);
  assert.equal(Object.keys(after).length, Object.keys(before).length);
});

test('S097-UT-010 check: errores técnicos terminan con exit 2 (V-9)', (t) => {
  const missing = run(['check', '--root', path.join(tempDir(t), 'no-existe')]);
  assert.equal(missing.status, 2);
  assert.match(missing.stderr, /raíz inexistente/);
  assert.equal(missing.stdout, '');

  const missingJson = run(['check', '--root', 'no-existe', '--json']);
  assert.equal(missingJson.status, 2);
  assert.match(missingJson.stderr, /raíz inexistente/);
  assert.deepEqual(JSON.parse(missingJson.stdout), { ok: false, error: 'raíz inexistente: no-existe (no existe o no es un directorio)' });
  assert.equal(missingJson.stdout.trim().split('\n').length, 1, 'un único objeto en stdout');

  const root = 'skills/memory-system/examples/sane/docs';
  const badHarness = run(['check', '--root', root, '--harness', 'foo']);
  assert.equal(badHarness.status, 2);
  assert.match(badHarness.stderr, /valor no admitido para --harness: foo/);
  assert.equal(badHarness.stdout, '');

  const badHarnessJson = run(['check', '--root', root, '--harness', 'foo', '--json']);
  assert.equal(badHarnessJson.status, 2);
  const parsed = JSON.parse(badHarnessJson.stdout);
  assert.equal(parsed.ok, false);
  assert.match(parsed.error, /--harness: foo/);
});

test('S097-UT-011 check: docs/ de este repositorio en menos de 5 s (V-10)', () => {
  const started = Date.now();
  const result = run(['check', '--root', 'docs', '--json']);
  const elapsed = Date.now() - started;
  assert.ok([0, 1].includes(result.status), `exit inesperado: ${result.status} ${result.stderr}`);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.harness, 'sddf');
  assert.deepEqual(Object.keys(parsed), ['harness', 'root', 'ok', 'summary', 'problems']);
  assert.ok(elapsed < 5000, `check tardó ${elapsed} ms`);
});

test('S097-E2E-001 check: informe con las cuatro familias sin escribir; fixture sano sin problemas (V-1, V-2)', (t) => {
  const repo = copyFixture(t, 'broken');
  const before = hashTree(repo);
  const broken = run(['check', '--root', path.join(repo, 'docs')]);
  assert.equal(broken.status, 1, broken.stderr);
  assert.match(broken.stdout.split('\n')[0], /^── memory-system check ── harness: sddf · root: .+$/);
  assert.deepEqual(kindLines(broken.stdout), [
    '[missing-layer]        product/ — capa ausente',
    '[orphan]               guides/notas.md — sin frontmatter',
    '[invalid-frontmatter]  adr/ADR-0003-x.md — falta title',
    '[broken-wikilink]      guides/sdd.md — [[no-existe]] no resuelve',
  ]);
  assert.equal(lastLine(broken.stdout), 'problemas: 4 (missing-layer 1 · orphan 1 · invalid-frontmatter 1 · broken-wikilink 1)');
  assert.deepEqual(hashTree(repo), before);

  const sane = run(['check', '--root', 'skills/memory-system/examples/sane/docs']);
  assert.equal(sane.status, 0, sane.stderr);
  assert.deepEqual(kindLines(sane.stdout), []);
  assert.equal(lastLine(sane.stdout), 'problemas: 0');
});

test('S097-E2E-002 check --json: gate de CI y re-chequeo tras corregir el wikilink (V-3, V-4)', (t) => {
  const docs = path.join(copyFixture(t, 'broken'), 'docs');
  // Se dejan corregidas las otras tres familias: solo queda el wikilink roto.
  fs.mkdirSync(path.join(docs, 'product'));
  fs.writeFileSync(path.join(docs, 'guides', 'notas.md'), '---\ntype: guide\nslug: notas\ntitle: "Notas"\n---\n# Notas\n');
  fs.writeFileSync(path.join(docs, 'adr', 'ADR-0003-x.md'), '---\ntype: adr\nslug: ADR-0003-x\ntitle: "ADR-0003"\n---\n# ADR-0003\n');

  const first = run(['check', '--root', docs, '--json']);
  assert.equal(first.status, 1, first.stderr);
  const before = JSON.parse(first.stdout);
  assert.equal(before.ok, false);
  assert.deepEqual(before.summary, { 'missing-layer': 0, orphan: 0, 'invalid-frontmatter': 0, 'broken-wikilink': 1 });
  assert.deepEqual(before.problems, [
    { kind: 'broken-wikilink', path: 'guides/sdd.md', detail: '[[no-existe]] no resuelve' },
  ]);

  const sdd = path.join(docs, 'guides', 'sdd.md');
  fs.writeFileSync(sdd, fs.readFileSync(sdd, 'utf8').replace('[[no-existe]]', '[[real]]'));

  const second = run(['check', '--root', docs, '--json']);
  assert.equal(second.status, 0, second.stderr);
  const after = JSON.parse(second.stdout);
  assert.equal(after.ok, true);
  assert.deepEqual(after.problems, []);
  assert.deepEqual(after.summary, { 'missing-layer': 0, orphan: 0, 'invalid-frontmatter': 0, 'broken-wikilink': 0 });
});
