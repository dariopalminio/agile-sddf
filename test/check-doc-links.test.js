'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { HISTORICAL_EXCLUSIONS, checkDocumentation, slugIndex } = require('../scripts/check-doc-links.js');

function fixture(t, readme) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agile-sddf-links-'));
  const dirs = [
    'docs/policies',
    'docs/guardrails',
    'docs/guides',
    'docs/runbooks',
    'docs/adr',
    'specs/flow',
  ];
  for (const directory of dirs) fs.mkdirSync(path.join(root, directory), { recursive: true });
  fs.writeFileSync(path.join(root, 'README.md'), readme, 'utf8');
  fs.writeFileSync(path.join(root, 'SECURITY.md'), '# Security\n', 'utf8');
  fs.writeFileSync(path.join(root, 'docs/index.md'), '# Index\n', 'utf8');
  fs.writeFileSync(path.join(root, 'docs/constitution.md'), '# Constitution\n', 'utf8');
  fs.writeFileSync(path.join(root, 'docs/guides/guide.md'), [
    '---',
    'slug: guide',
    '---',
    '',
    '# Hello World',
  ].join('\n'), 'utf8');
  t.after(() => fs.rmSync(root, { recursive: true, force: true, maxRetries: 3 }));
  return root;
}

test('accepts a local link, GitHub-style anchor, and wikilink', (t) => {
  const root = fixture(t, '# Readme\n[Guide](docs/guides/guide.md#hello-world) [[guide]]\n');
  const result = checkDocumentation({ root, repoRoot: root, files: [path.join(root, 'README.md')] });
  assert.deepEqual(result.errors, []);
});

test('reports missing local targets and anchors', (t) => {
  const root = fixture(t, '# Readme\n[Missing](docs/guides/nope.md)\n[Bad anchor](docs/guides/guide.md#nope)\n');
  const result = checkDocumentation({ repoRoot: root, files: [path.join(root, 'README.md')] });
  assert.equal(result.errors.length, 2);
  assert.match(result.errors[0], /Missing local target/);
  assert.match(result.errors[1], /Missing anchor/);
});

test('reports a guide linking to a removed docs/specs path, naming the guide', (t) => {
  const root = fixture(t, '# Readme\n');
  const guide = path.join(root, 'docs/guides/legacy.md');
  fs.writeFileSync(guide, '# Legacy\n[story](../specs/stories/STORY-001-x/story.md)\n', 'utf8');
  const result = checkDocumentation({ repoRoot: root, files: [guide] });
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /^docs\/guides\/legacy\.md:\d+: Missing local target: docs\/specs\/stories\/STORY-001-x\/story\.md$/);
});

test('resolves wikilinks to work items under specs/flow/', (t) => {
  const root = fixture(t, '# Readme\n');
  const story = path.join(root, 'specs/flow/STORY-001-x/story.md');
  fs.mkdirSync(path.dirname(story), { recursive: true });
  fs.writeFileSync(story, '---\nslug: STORY-001-x\n---\n', 'utf8');
  const index = path.join(root, 'docs/index.md');
  fs.writeFileSync(index, '# Index\n- [[STORY-001-x]]\n', 'utf8');
  const result = checkDocumentation({ repoRoot: root, files: [index] });
  assert.deepEqual(result.errors, []);
});

test('wikilinks a work items en specs/flow y archive resuelven desde docs/index.md', (t) => {
  const root = fixture(t, '# Readme\n');
  const write = (relativePath, slug) => {
    const target = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, `---\nslug: ${slug}\n---\n`, 'utf8');
  };
  write('specs/flow/STORY-001-a/story.md', 'STORY-001-a');
  write('specs/flow/archive/2026-01-01-STORY-000-z/story.md', 'STORY-000-z');
  const index = path.join(root, 'docs/index.md');
  fs.writeFileSync(index, [
    '# Index',
    '- [[STORY-001-a]] — [story.md](../specs/flow/STORY-001-a/story.md)',
    '- [[STORY-000-z]] — [story.md](../specs/flow/archive/2026-01-01-STORY-000-z/story.md)',
    '',
  ].join('\n'), 'utf8');
  const result = checkDocumentation({ repoRoot: root, files: [index] });
  assert.deepEqual(result.errors, []);
});

test('reports a wikilink to a work item that does not exist under specs/', (t) => {
  const root = fixture(t, '# Readme\n');
  const index = path.join(root, 'docs/index.md');
  fs.writeFileSync(index, '# Index\n- [[STORY-999-inexistente]]\n', 'utf8');
  const result = checkDocumentation({ repoRoot: root, files: [index] });
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /Missing wikilink target: \[\[STORY-999-inexistente\]\]/);
});

test('HISTORICAL_EXCLUSIONS informa specs/ como raíz histórica de work items', () => {
  assert.deepEqual(HISTORICAL_EXCLUSIONS, ['CHANGELOG.md', 'docs/adr', 'specs']);
});

test('reports unresolved wikilinks but ignores inline-code examples', (t) => {
  const root = fixture(t, '# Readme\n[[missing-page]]\n`[[placeholder]]`\n');
  const result = checkDocumentation({ repoRoot: root, files: [path.join(root, 'README.md')] });
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /Missing wikilink target: \[\[missing-page\]\]/);
});

test('ignores wikilinks flagged as pending nodes by memory-system index', (t) => {
  const root = fixture(t, '# Readme\n- [[missing-page]] ⚠️ nodo pendiente\n[[other-missing]]\n');
  const result = checkDocumentation({ repoRoot: root, files: [path.join(root, 'README.md')] });
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /Missing wikilink target: \[\[other-missing\]\]/);
});

test('slugIndex prefiere epic.md/story.md ante slugs duplicados y no trata project.md como canónico', (t) => {
  const root = fixture(t, '# Readme\n');
  const write = (relativePath, slug) => {
    const target = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, `---\nslug: ${slug}\n---\n`, 'utf8');
    return target;
  };
  const epic = write('specs/flow/EPIC-01-a/epic.md', 'duplicado-epic');
  const epicNotes = write('specs/flow/EPIC-01-a/notes.md', 'duplicado-epic');
  const project = write('docs/legacy/project.md', 'duplicado-project');
  const notes = write('docs/legacy/notes.md', 'duplicado-project');

  const index = slugIndex([epic, epicNotes, project, notes]);
  assert.deepEqual(index.get('duplicado-epic'), [epic]);
  assert.deepEqual(index.get('duplicado-project'), [project, notes]);
});
