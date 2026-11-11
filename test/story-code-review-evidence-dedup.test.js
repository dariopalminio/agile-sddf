'use strict';

// STORY-182 — Contrato de verificación y deduplicación de hallazgos del árbitro (design.md, D-9).

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const SKILL_DIR = path.join(__dirname, '..', 'skills', 'story-code-review');
const AGENTS_DIR = path.join(SKILL_DIR, 'agents');
const EXAMPLES_DIR = path.join(SKILL_DIR, 'examples');
const AGENT_FILES = [
  'tech-lead-reviewer.agent.md',
  'product-owner-reviewer.agent.md',
  'integration-reviewer.agent.md',
  'security-reviewer.agent.md',
];
const REPORT_FILES = [
  'tech-lead-report.md',
  'product-owner-report.md',
  'integration-report.md',
  'security-report.md',
];
const EVIDENCE_HEADING = '## Evidencia de hallazgos bloqueantes';
const BLOCKING_ROW = /^\|\s*(HIGH|MEDIUM)\s*\|/;

function read(file) {
  return fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
}

function sectionBody(text, heading) {
  const start = text.indexOf(`\n${heading}\n`);
  if (start < 0) return null;
  const from = start + heading.length + 2;
  const next = text.indexOf('\n## ', from);
  // Un separador `---` antes del siguiente `## ` es maquetación, no cuerpo.
  return text
    .slice(from, next < 0 ? text.length : next)
    .trim()
    .replace(/\n+-{3,}$/, '')
    .trim();
}

function blockingRows(text) {
  return text.split('\n').filter((line) => BLOCKING_ROW.test(line));
}

// I-2: ruta sin espacios seguida de :<n> o :<n>-<m>, con n ≥ 1 y m ≥ n.
function isValidFileLine(value) {
  if (typeof value !== 'string') return false;
  const match = value.match(/^[^\s:]+:(\d+)(?:-(\d+))?$/);
  if (!match) return false;
  const n = Number(match[1]);
  const m = match[2] === undefined ? n : Number(match[2]);
  return n >= 1 && m >= n;
}

function caseFindings(evalCase) {
  const input = evalCase.input || {};
  const groups = [input, input.agent_results || {}];
  const findings = [];
  for (const group of groups) {
    for (const [key, value] of Object.entries(group)) {
      if (key.endsWith('_findings') && Array.isArray(value)) findings.push(...value);
    }
  }
  return findings;
}

test('los cuatro agentes declaran la sección de evidencia con el mismo cuerpo (CNF-3, D-7)', () => {
  const bodies = AGENT_FILES.map((name) => {
    const body = sectionBody(read(path.join(AGENTS_DIR, name)), EVIDENCE_HEADING);
    assert.ok(body, `${name} no tiene la sección "${EVIDENCE_HEADING}"`);
    assert.match(body, /Fallo:/, `${name}: la sección no nombra el marcador Fallo:`);
    assert.match(body, /no verificado/, `${name}: la sección no explica el estado no verificado`);
    return body;
  });
  for (let i = 1; i < bodies.length; i += 1) {
    assert.equal(bodies[i], bodies[0], `${AGENT_FILES[i]} difiere de ${AGENT_FILES[0]}`);
  }
});

test('las filas de ejemplo HIGH/MEDIUM de los agentes llevan Fallo: y ubicación válida (CNF-3, D-2)', () => {
  for (const name of AGENT_FILES) {
    const rows = blockingRows(read(path.join(AGENTS_DIR, name)));
    assert.ok(rows.length > 0, `${name} no tiene filas de ejemplo HIGH/MEDIUM`);
    for (const row of rows) {
      assert.match(row, /Fallo:/, `${name}: fila sin Fallo: → ${row}`);
      assert.doesNotMatch(row, /:0(?![0-9])/, `${name}: fila con línea 0 → ${row}`);
      assert.match(row, /[^\s:(|]+:[1-9][0-9]*(?:-[0-9]+)?/, `${name}: fila sin Archivo:Línea válido → ${row}`);
    }
  }
});

test('SKILL.md define la verificación (4a.3) y la fusión (4a.4) de hallazgos (AC-1, AC-2)', () => {
  const skill = read(path.join(SKILL_DIR, 'SKILL.md'));
  assert.match(skill, /^#### 4a\.3\. Verificar la evidencia de los hallazgos bloqueantes$/m);
  assert.match(skill, /^#### 4a\.4\. Fusionar hallazgos repetidos entre revisores$/m);
  assert.ok(skill.indexOf('#### 4a.3.') < skill.indexOf('#### 4a.4.'), '4a.3 debe preceder a 4a.4');
  assert.ok(skill.indexOf('#### 4a.4.') < skill.indexOf('#### 4b.'), '4a.4 debe preceder a 4b');
  for (const text of ['no verificado', 'Reportado por:', '$FINDINGS', 'Fallo:', EVIDENCE_HEADING]) {
    assert.ok(skill.includes(text), `SKILL.md no contiene "${text}"`);
  }
});

test('el Paso 5b llena {{SECURITY_FINDINGS}} con las filas consolidadas, no con la tabla cruda (I-9)', () => {
  const skill = read(path.join(SKILL_DIR, 'SKILL.md'));
  const line = skill.split('\n').find((l) => l.startsWith('- Sección `### Seguridad (Security-Reviewer)`'));
  assert.ok(line, 'SKILL.md no tiene la instrucción de la sección de Seguridad del Paso 5b');
  assert.ok(line.includes('$FINDINGS'), 'la sección de Seguridad debe tomar las filas consolidadas de $FINDINGS');
  assert.doesNotMatch(line, /contenido de la sección "Hallazgos" de `security-report\.md`/);
  assert.ok(line.includes('**Fuentes de checklist:**'), 'la sección de Seguridad conserva la línea de fuentes de checklist');
});

test('todo eval que espera NEEDS-CHANGES trae un bloqueante con Archivo:Línea y escenario de fallo (CNF-2, D-8)', () => {
  const evals = JSON.parse(read(path.join(SKILL_DIR, 'evals', 'evals.json')));
  const expectsChanges = evals.cases.filter((c) => (c.expected?.contains || []).includes('(verdict: NEEDS-CHANGES)'));
  assert.ok(expectsChanges.length > 0);
  for (const evalCase of expectsChanges) {
    const verified = caseFindings(evalCase).filter(
      (f) =>
        ['HIGH', 'MEDIUM'].includes(f.severity) &&
        isValidFileLine(f.file_line ?? f.file) &&
        typeof f.failure_scenario === 'string' &&
        f.failure_scenario.trim() !== '',
    );
    assert.ok(verified.length > 0, `${evalCase.id} espera NEEDS-CHANGES sin un hallazgo bloqueante verificable`);
  }
});

test('los evals de STORY-182 cubren AC-1, AC-2 y AC-3', () => {
  const evals = JSON.parse(read(path.join(SKILL_DIR, 'evals', 'evals.json')));
  const names = new Set(evals.cases.map((c) => c.name));
  for (const name of [
    'bloqueantes-sin-evidencia-no-cuentan',
    'bloqueante-verificado-junto-a-no-verificado',
    'hallazgo-duplicado-entre-revisores-se-fusiona',
    'hallazgos-distintos-no-se-fusionan',
  ]) {
    assert.ok(names.has(name), `falta el eval ${name}`);
  }
  const ids = evals.cases.map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length, 'IDs de eval duplicados');
});

test('las filas HIGH/MEDIUM de los informes de ejemplo llevan Fallo: (CNF-3, C-7)', () => {
  const dirs = fs
    .readdirSync(EXAMPLES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  let checked = 0;
  for (const dir of dirs) {
    for (const report of REPORT_FILES) {
      const file = path.join(EXAMPLES_DIR, dir, report);
      if (!fs.existsSync(file)) continue;
      for (const row of blockingRows(read(file))) {
        checked += 1;
        assert.match(row, /Fallo:/, `${dir}/${report}: fila sin Fallo: → ${row}`);
      }
    }
  }
  assert.ok(checked > 0, 'no se encontró ninguna fila HIGH/MEDIUM en los ejemplos');
});

test('isValidFileLine aplica I-2', () => {
  assert.ok(isValidFileLine('src/auth.js:42'));
  assert.ok(isValidFileLine('src/auth.js:40-45'));
  assert.ok(!isValidFileLine('src/auth.js'));
  assert.ok(!isValidFileLine('src/auth.js:0'));
  assert.ok(!isValidFileLine('src/auth.js:45-40'));
  assert.ok(!isValidFileLine('varios archivos'));
  assert.ok(!isValidFileLine(undefined));
});
