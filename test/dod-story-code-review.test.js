'use strict';

// STORY-183 — Contrato del DoD CODE-REVIEW (design.md D-7):
// guardrail y plantilla alineados, sin criterios circulares, y la tabla
// «Criterios conocidos» del Paso 4c.1 de story-code-review sincronizada con ellos.

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const REPO_ROOT = path.resolve(__dirname, '..');
const GUARDRAIL = 'docs/guardrails/dod-story-code-review.md';
const TEMPLATE = 'skills/sddf-constitution/assets/dod-story/dod-story-code-review.md';
const ARBITER = 'skills/story-code-review/SKILL.md';

const CIRCULAR_MARKERS = [
  'code-review-report.md',
  'verdict',
  'APPROVED',
  'HIGH o MEDIUM',
  '[[dod-story-implement]]',
  'status y substatus actualizados',
];

function read(relativePath) {
  return fs.readFileSync(path.join(REPO_ROOT, relativePath), 'utf8');
}

// I-2: texto tras `- [ ] ` o `- [x] `, recortado y con los espacios internos
// colapsados a uno. Las comillas invertidas se conservan.
function normalizeCriterion(text) {
  return text.trim().replace(/\s+/g, ' ');
}

function dodCriteria(relativePath) {
  return read(relativePath)
    .split(/\r?\n/)
    .map((line) => line.match(/^- \[[ x]\] (.*)$/))
    .filter(Boolean)
    .map((match) => normalizeCriterion(match[1]));
}

function splitRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

// Primera tabla Markdown tras el rótulo «Criterios conocidos» dentro del Paso 4c.1.
function knownCriteriaTable() {
  const lines = read(ARBITER).split(/\r?\n/);
  const stepStart = lines.findIndex((line) => line.startsWith('#### 4c.1.'));
  assert.notEqual(stepStart, -1, `${ARBITER} debe tener el Paso 4c.1`);
  const stepEnd = lines.findIndex((line, index) => index > stepStart && /^#{1,4} /.test(line));
  const step = lines.slice(stepStart, stepEnd === -1 ? lines.length : stepEnd);

  const labelIndex = step.findIndex((line) => /Criterios conocidos/.test(line));
  assert.notEqual(labelIndex, -1, 'el Paso 4c.1 debe tener la subsección «Criterios conocidos»');
  const headerIndex = step.findIndex((line, index) => index > labelIndex && line.trim().startsWith('|'));
  assert.notEqual(headerIndex, -1, 'la subsección «Criterios conocidos» debe tener una tabla');

  const rows = [];
  for (let index = headerIndex + 2; index < step.length && step[index].trim().startsWith('|'); index += 1) {
    const [criterion, coverage, source] = splitRow(step[index]);
    rows.push({ criterion: normalizeCriterion(criterion), coverage, source });
  }
  return rows;
}

test('UT-005 — la normalización colapsa espacios y conserva las comillas invertidas', () => {
  assert.equal(normalizeCriterion('  Sin  tareas   pendientes en `tasks.md`  '), 'Sin tareas pendientes en `tasks.md`');
  assert.notEqual(normalizeCriterion('Sin tareas pendientes en `tasks.md`'), normalizeCriterion('Sin tareas pendientes en tasks.md'));
});

test('UT-001 — guardrail y plantilla tienen los mismos criterios, en el mismo orden (CNF-1)', () => {
  const guardrail = dodCriteria(GUARDRAIL);
  assert.ok(guardrail.length > 0, `${GUARDRAIL} debe tener criterios`);
  assert.deepEqual(dodCriteria(TEMPLATE), guardrail);
});

test('UT-002 — ningún criterio depende del informe, del veredicto ni de los bloqueantes (AC-1)', () => {
  for (const relativePath of [GUARDRAIL, TEMPLATE]) {
    for (const criterion of dodCriteria(relativePath)) {
      for (const marker of CIRCULAR_MARKERS) {
        assert.ok(!criterion.includes(marker), `${relativePath}: «${criterion}» contiene «${marker}»`);
      }
    }
  }
});

test('UT-003 — la tabla «Criterios conocidos» y el DoD tienen los mismos criterios (AC-2, AC-3)', () => {
  const table = knownCriteriaTable().map((row) => row.criterion).sort();
  assert.deepEqual(table, [...dodCriteria(GUARDRAIL)].sort());
  assert.deepEqual(table, [...dodCriteria(TEMPLATE)].sort());
});

test('UT-004 — la tabla asigna los criterios cubiertos a su revisor y los demás a evaluación propia (AC-2)', () => {
  const rows = knownCriteriaTable();
  const byMarker = (marker) => {
    const row = rows.find((candidate) => candidate.criterion.includes(marker));
    assert.ok(row, `la tabla debe tener el criterio de ${marker}`);
    return row;
  };

  for (const [marker, reviewer] of [
    ['`constitution.md`', 'Tech-Lead-Reviewer'],
    ['Gherkin', 'Product-Owner-Reviewer'],
    ['`design.md`', 'Integration-Reviewer'],
  ]) {
    const row = byMarker(marker);
    assert.equal(row.coverage, 'revisor', `${marker} debe tener cobertura revisor`);
    assert.equal(row.source, reviewer, `${marker} debe estar cubierto por ${reviewer}`);
  }
  for (const marker of ['`tasks.md`', '`story.md`']) {
    assert.equal(byMarker(marker).coverage, 'propia', `${marker} debe tener cobertura propia`);
  }
});
