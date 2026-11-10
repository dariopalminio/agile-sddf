'use strict';

// STORY-180 — Contrato de la guía de revisión (REVIEW.md) en story-code-review (design.md, D-8).

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const SKILL_DIR = path.join(__dirname, '..', 'skills', 'story-code-review');
const AGENTS_DIR = path.join(SKILL_DIR, 'agents');
const AGENT_FILES = [
  'tech-lead-reviewer.agent.md',
  'product-owner-reviewer.agent.md',
  'integration-reviewer.agent.md',
  'security-reviewer.agent.md',
];
const GUIDE_HEADING = '## Guía de revisión (REVIEW.md)';

// Encabezados de la plantilla antes de STORY-180: REVIEW.md no cambia las secciones del informe (CNF-1).
const TEMPLATE_HEADINGS = [
  '## Veredicto',
  '## Resumen',
  '## Hallazgos por dimensión',
  '### Calidad de Código (Tech-Lead-Reviewer)',
  '### Cobertura de Requisitos (Product-Owner-Reviewer)',
  '### Integración y Arquitectura (Integration-Reviewer)',
  '### Seguridad (Security-Reviewer)',
  '### Nota de Tamaño de Cambio',
  '### Cobertura de Casos de Prueba (testcases.md)',
  '## Siguiente acción',
  '## Cumplimiento DoD — Fase CODE-REVIEW',
];

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function readAgent(name) {
  return read(path.join(AGENTS_DIR, name));
}

function sectionBody(content, heading) {
  const lines = content.split(/\r?\n/);
  const start = lines.indexOf(heading);
  if (start === -1) return null;
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => line.startsWith('## '));
  return (end === -1 ? rest : rest.slice(0, end)).join('\n').trim();
}

test('ningún agente contiene reglas propias de agile-sddf (AC-5)', () => {
  const pattern = /Principio 6|teléfono descompuesto|un solo nivel de delegación/;
  for (const name of fs.readdirSync(AGENTS_DIR)) {
    assert.doesNotMatch(readAgent(name), pattern, `${name} contiene una regla propia de agile-sddf`);
  }
});

test('SKILL.md y los cuatro agentes nombran $REVIEW_PATH (AC-1)', () => {
  assert.ok(read(path.join(SKILL_DIR, 'SKILL.md')).includes('$REVIEW_PATH'), 'SKILL.md sin $REVIEW_PATH');
  for (const name of AGENT_FILES) {
    assert.ok(readAgent(name).includes('$REVIEW_PATH'), `${name} sin $REVIEW_PATH`);
  }
});

test('los cuatro agentes tienen la sección de la guía con cuerpo idéntico (D-3)', () => {
  const bodies = AGENT_FILES.map((name) => {
    const body = sectionBody(readAgent(name), GUIDE_HEADING);
    assert.ok(body, `${name} sin la sección "${GUIDE_HEADING}"`);
    return body;
  });
  for (let i = 1; i < bodies.length; i += 1) {
    assert.equal(bodies[i], bodies[0], `${AGENT_FILES[i]} difiere de ${AGENT_FILES[0]}`);
  }
});

test('la plantilla añade {{REVIEW_STATUS}} sin cambiar sus encabezados (CNF-1)', () => {
  const template = read(path.join(SKILL_DIR, 'assets', 'code-review-report-template.md'));
  assert.ok(template.includes('{{REVIEW_STATUS}}'), 'plantilla sin {{REVIEW_STATUS}}');
  const headings = template.split(/\r?\n/).filter((line) => /^#{2,3} /.test(line));
  assert.deepEqual(headings, TEMPLATE_HEADINGS);
});

test('SKILL.md lee y detecta la guía sin git (ADR-0021)', () => {
  const skill = read(path.join(SKILL_DIR, 'SKILL.md'));
  assert.ok(!skill.includes('git show'), 'SKILL.md contiene git show');
  assert.ok(!skill.includes('git diff --name-only'), 'SKILL.md contiene git diff --name-only');
});
