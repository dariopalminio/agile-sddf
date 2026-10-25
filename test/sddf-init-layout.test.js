'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const { checkSkillLayout, PENDING_MIGRATION } = require('../scripts/verify-fixed-layout.js');

const REPO_ROOT = path.resolve(__dirname, '..');
const SKILL_DIR = 'skills/sddf-init';

function read(relativePath) {
  return fs.readFileSync(path.join(REPO_ROOT, relativePath), 'utf8');
}

function listFiles(relativeDir) {
  const files = [];
  const visit = (dir) => {
    for (const entry of fs.readdirSync(path.join(REPO_ROOT, dir), { withFileTypes: true })) {
      const child = `${dir}/${entry.name}`;
      if (entry.isDirectory()) visit(child);
      else files.push(child);
    }
  };
  visit(relativeDir);
  return files;
}

function step4Block(skill) {
  const start = skill.indexOf('### Paso 4');
  const end = skill.indexOf('### Paso 5 ', start);
  if (start === -1 || end === -1) return '';
  const section = skill.slice(start, end);
  const fence = section.match(/```\n([\s\S]*?)```/);
  return fence ? fence[1] : '';
}

test('AC-4: sin resolución legada en skills/sddf-init/', () => {
  const hits = [];
  for (const file of listFiles(SKILL_DIR)) {
    read(file).split(/\r?\n/).forEach((line, index) => {
      if (/SPECS_BASE|SDDF_ROOT/.test(line)) hits.push(`${file}:${index + 1}`);
    });
  }
  assert.deepEqual(hits, [], `coincidencias de SPECS_BASE|SDDF_ROOT: ${hits.join(', ')}`);
});

test('AC-4: los assets de configuración no declaran la clave root', () => {
  for (const asset of ['sddf.config.yaml.template', 'sddf.config.yaml.example']) {
    const lines = read(`${SKILL_DIR}/assets/${asset}`).split(/\r?\n/);
    const index = lines.findIndex((line) => /^root\s*:/.test(line));
    assert.equal(index, -1, `${asset}:${index + 1} declara la clave root`);
  }
});

test('AC-4: el .env.template del Paso 4 es neutral', () => {
  const block = step4Block(read(`${SKILL_DIR}/SKILL.md`));
  assert.ok(block, 'falta el bloque de contenido del Paso 4');
  assert.match(block, /ADR-0016/);
  assert.doesNotMatch(block, /SDDF_/);
});

test('CNF-3: SKILL.md cumple el contrato de layout fijo y salió de PENDING_MIGRATION', () => {
  assert.deepEqual(checkSkillLayout('sddf-init', read(`${SKILL_DIR}/SKILL.md`)), []);
  assert.ok(!PENDING_MIGRATION.includes('sddf-init'));
});

test('AC-1/AC-2: SKILL.md declara el layout fijo y el aviso legado', () => {
  const skill = read(`${SKILL_DIR}/SKILL.md`);
  for (const token of [
    'specs/flow/archive/',
    'specs/living/',
    'workflow/',
    '.gitkeep',
    'Layout legado detectado',
    'docs/guides/artifact-directory-migration.md',
  ]) {
    assert.ok(skill.includes(token), `SKILL.md no nombra ${token}`);
  }
});

test('CNF-2: los evals cubren AC-1 y AC-2', () => {
  const evals = JSON.parse(read(`${SKILL_DIR}/evals/evals.json`));
  assert.equal(evals.version, '3.0.0');
  const contains = evals.cases.map((testCase) => testCase.expected.contains);
  assert.ok(contains.some((list) => list.includes('specs/flow/archive/')), 'ningún caso cubre AC-1');
  assert.ok(
    contains.some((list) => list.includes('docs/guides/artifact-directory-migration.md')),
    'ningún caso cubre AC-2',
  );
});
