'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const REPO_ROOT = path.resolve(__dirname, '..');
const SKILL = 'skills/story-code-review';
const SKILL_MD = `${SKILL}/SKILL.md`;
const AGENTS = {
  'tech-lead': `${SKILL}/agents/tech-lead-reviewer.agent.md`,
  'product-owner': `${SKILL}/agents/product-owner-reviewer.agent.md`,
  integration: `${SKILL}/agents/integration-reviewer.agent.md`,
  security: `${SKILL}/agents/security-reviewer.agent.md`,
};
const FILES = [SKILL_MD, ...Object.values(AGENTS)];

function read(relativePath) {
  return fs.readFileSync(path.join(REPO_ROOT, relativePath), 'utf8');
}

function frontmatterOutput(content, file) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert.ok(match, `${file}: falta el frontmatter YAML`);
  const line = match[1].split(/\r?\n/).find((l) => l.startsWith('output:'));
  assert.ok(line, `${file}: falta el campo output:`);
  return line.replace(/^output:\s*/, '').trim();
}

test('CNF-1: el output: de cada agente declara .tmp/story-code-review/{story_id}/<rol>-report.md', () => {
  for (const [role, file] of Object.entries(AGENTS)) {
    assert.equal(
      frontmatterOutput(read(file), file),
      `.tmp/story-code-review/{story_id}/${role}-report.md`,
      `${file}: ruta de output incorrecta`,
    );
  }
});

test('CNF-1: ningun archivo del skill declara un informe parcial directamente bajo .tmp/story-code-review/', () => {
  const pattern = /\.tmp\/story-code-review\/[A-Za-z0-9_-]+-report\.md/g;
  for (const file of FILES) {
    const hits = read(file).match(pattern) ?? [];
    assert.deepEqual(hits, [], `${file}: rutas de informe sin {story_id}/: ${hits.join(', ')}`);
  }
});

test('CNF-1: ni SKILL.md ni los agentes mencionan docs/policies/*security-checklist', () => {
  for (const file of FILES) {
    assert.ok(
      !read(file).includes('docs/policies/*security-checklist'),
      `${file}: referencia legada a docs/policies/*security-checklist`,
    );
  }
});

test('AC-2: SKILL.md y security-reviewer nombran docs/guardrails/gr-*security*.md', () => {
  for (const file of [SKILL_MD, AGENTS.security]) {
    assert.ok(
      read(file).includes('docs/guardrails/gr-*security*.md'),
      `${file}: falta el glob docs/guardrails/gr-*security*.md`,
    );
  }
});
