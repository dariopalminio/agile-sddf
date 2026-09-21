'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { checkDocumentation } = require('../scripts/check-doc-links.js');

function fixture(t, readme) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agile-sddf-links-'));
  const dirs = [
    'docs/policies',
    'docs/guardrails',
    'docs/guides',
    'docs/runbooks',
    'docs/adr',
    'docs/specs',
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
