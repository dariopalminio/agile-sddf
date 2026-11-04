'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const REPO_ROOT = path.resolve(__dirname, '..');
const EVALS_PATH = 'skills/epic-validate/evals/evals.json';
const VERDICTS = ['APPROVED', 'NEEDS-CHANGES', 'BLOCKED'];
const OUTCOMES = ['pass', 'fail', 'not-executable'];
const ANSWER_KEYS = ['user_answers', 'maintainer_answers'];
const REGRESSION_SET = [
  ['regresion-veredicto-approved', 'APPROVED'],
  ['regresion-veredicto-historia-no-terminal', 'NEEDS-CHANGES'],
  ['regresion-veredicto-smoke-no-ejecutable', 'BLOCKED'],
  ['regresion-veredicto-precedencia', 'NEEDS-CHANGES'],
];

function loadManifest() {
  const file = path.join(REPO_ROOT, EVALS_PATH);
  if (!fs.existsSync(file)) throw new Error(`${EVALS_PATH} no existe (STORY-124 sin implementar)`);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

const verdictLine = (value) => `verdict: ${value}\ncreated:`;
const verdictHeading = (value) => `**Veredicto:** \`${value}\``;

// Interfaz «Veredicto esperado de un caso» (design.md): única forma reconocida.
function declaredVerdict(testCase) {
  for (const entry of testCase.expected?.contains || []) {
    const match = /^verdict: ([^\n]+)\ncreated:$/.exec(entry);
    if (match) return match[1];
  }
  return null;
}

// Valores que un caso afirma con `verdict: ` o `**Veredicto:** \`` en contains.
function assertedVerdicts(testCase) {
  const values = new Set();
  for (const entry of testCase.expected?.contains || []) {
    const field = /^verdict: ([^\n]*)/.exec(entry);
    const heading = /^\*\*Veredicto:\*\* `([^`]*)`/.exec(entry);
    if (field) values.add(field[1]);
    if (heading) values.add(heading[1]);
  }
  return [...values];
}

function collectStrings(value, out = []) {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => collectStrings(item, out));
  return out;
}

// G-A y G-B
function checkCoverage(manifest) {
  if (!Array.isArray(manifest?.cases) || manifest.cases.length === 0) return ['evals.json no tiene casos en cases[] (CS-9)'];
  const declared = new Set(manifest.cases.map(declaredVerdict));
  return VERDICTS.filter((value) => !declared.has(value)).map((value) => `evals.json no conserva ningún caso ${value} (CS-9)`);
}

// G-C
function checkClosedForm(manifest) {
  const errors = [];
  for (const testCase of manifest.cases) {
    const values = assertedVerdicts(testCase);
    if (values.length === 0) continue;
    if (values.length > 1 || !VERDICTS.includes(values[0])) {
      errors.push(`${testCase.id}: veredicto no permitido ${values.join(' / ')} (CNF-3)`);
      continue;
    }
    const [value] = values;
    const contains = testCase.expected.contains;
    const notContains = testCase.expected.not_contains || [];
    for (const entry of [verdictLine(value), verdictHeading(value)]) {
      if (!contains.includes(entry)) errors.push(`${testCase.id}: falta contains ${JSON.stringify(entry)} (CNF-3)`);
    }
    for (const other of VERDICTS.filter((item) => item !== value)) {
      if (!notContains.includes(verdictHeading(other))) {
        errors.push(`${testCase.id}: falta not_contains ${JSON.stringify(verdictHeading(other))} (CNF-3)`);
      }
    }
    for (const threshold of [testCase.threshold, testCase.expected.threshold]) {
      if (threshold !== undefined && threshold !== 1) errors.push(`${testCase.id}: falta threshold ausente o 1 (CNF-3)`);
    }
  }
  return errors;
}

// G-D, G-E y G-F
function checkRegressionSet(manifest) {
  const errors = [];
  for (const [name, expected] of REGRESSION_SET) {
    const testCase = manifest.cases.find((item) => item.name === name);
    if (!testCase) {
      errors.push(`falta el caso de regresión ${name} (AC-3)`);
      continue;
    }
    const { id } = testCase;
    const input = testCase.input || {};
    if (declaredVerdict(testCase) !== expected) errors.push(`${id}: el caso de regresión ${name} no declara ${expected} (AC-3)`);

    if (!String(input.invocation || '').includes('--mode auto')) errors.push(`${id}: requiere intervención manual (sin --mode auto)`);
    for (const key of ANSWER_KEYS) {
      if (key in input) errors.push(`${id}: requiere intervención manual (${key})`);
    }
    const strings = collectStrings(input);
    for (const text of strings) {
      if (text.startsWith('> ')) errors.push(`${id}: requiere intervención manual (respuesta simulada ${JSON.stringify(text)})`);
      if (/https?:\/\//.test(text)) errors.push(`${id}: depende de un servicio externo: ${text} (CNF-2)`);
    }

    const commands = [input.sddf_config?.verify?.['e2e-smoke']?.command, input.package_json?.scripts?.['verify:release']];
    for (const command of commands.filter((item) => typeof item === 'string')) {
      if (!OUTCOMES.includes(input.command_results?.[command]?.outcome)) {
        errors.push(`${id}: comando sin resultado simulado: ${command} (CNF-2)`);
      }
    }
  }
  return errors;
}

function caseByName(manifest, name) {
  return manifest.cases.find((item) => item.name === name);
}

test('G-A/G-B: evals.json conserva al menos un caso APPROVED, NEEDS-CHANGES y BLOCKED (AC-3, CNF-1)', () => {
  assert.deepEqual(checkCoverage(loadManifest()), []);
});

test('G-C: todo caso que afirma un veredicto usa la forma cerrada (CNF-3)', () => {
  assert.deepEqual(checkClosedForm(loadManifest()), []);
});

test('G-D/G-E/G-F: el conjunto de regresión existe, no requiere intervención manual y fija sus comandos (AC-3, CNF-2)', () => {
  assert.deepEqual(checkRegressionSet(loadManifest()), []);
});

test('V-7: sin ningún caso BLOCKED la guardia falla con el mensaje de G-B', () => {
  const manifest = structuredClone(loadManifest());
  manifest.cases = manifest.cases.filter((item) => declaredVerdict(item) !== 'BLOCKED');
  assert.deepEqual(checkCoverage(manifest), ['evals.json no conserva ningún caso BLOCKED (CS-9)']);
});

test('V-7: un caso que conserva solo `verdict: <V>` falla G-C', () => {
  const manifest = structuredClone(loadManifest());
  const testCase = caseByName(manifest, 'regresion-veredicto-approved');
  testCase.expected.contains = testCase.expected.contains
    .filter((entry) => entry !== verdictHeading('APPROVED'))
    .map((entry) => (entry === verdictLine('APPROVED') ? 'verdict: APPROVED' : entry));
  assert.deepEqual(checkClosedForm(manifest), [
    `${testCase.id}: falta contains ${JSON.stringify(verdictLine('APPROVED'))} (CNF-3)`,
    `${testCase.id}: falta contains ${JSON.stringify(verdictHeading('APPROVED'))} (CNF-3)`,
  ]);
});

test('V-7: un veredicto fuera de la política falla G-C', () => {
  const manifest = structuredClone(loadManifest());
  const testCase = caseByName(manifest, 'regresion-veredicto-approved');
  testCase.expected.contains = testCase.expected.contains.map((entry) =>
    entry === verdictLine('APPROVED') ? verdictLine('PASSED') : entry === verdictHeading('APPROVED') ? verdictHeading('PASSED') : entry);
  assert.deepEqual(checkClosedForm(manifest), [`${testCase.id}: veredicto no permitido PASSED (CNF-3)`]);
});

test('V-7: un caso de regresión con user_answers falla G-E', () => {
  const manifest = structuredClone(loadManifest());
  const testCase = caseByName(manifest, 'regresion-veredicto-precedencia');
  testCase.input.user_answers = ['s'];
  assert.deepEqual(checkRegressionSet(manifest), [`${testCase.id}: requiere intervención manual (user_answers)`]);
});

test('V-7: un caso de regresión sin resultado simulado para su comando falla G-F', () => {
  const manifest = structuredClone(loadManifest());
  const testCase = caseByName(manifest, 'regresion-veredicto-smoke-no-ejecutable');
  delete testCase.input.command_results['sddf-eval-smoke-inexistente'];
  assert.deepEqual(checkRegressionSet(manifest), [
    `${testCase.id}: comando sin resultado simulado: sddf-eval-smoke-inexistente (CNF-2)`,
  ]);
});

test('V-7: sin evals.json la guardia señala la dependencia de STORY-124', () => {
  const original = fs.existsSync;
  fs.existsSync = () => false;
  try {
    assert.throws(loadManifest, { message: `${EVALS_PATH} no existe (STORY-124 sin implementar)` });
  } finally {
    fs.existsSync = original;
  }
});
