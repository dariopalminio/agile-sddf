'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const {
  parsePolicyContract,
  checkReport,
  findLegacyVariants,
  verifyValidationContract,
  verifyReports,
} = require('../scripts/verify-validation-contract.js');

const REPORTS = {
  'epic-format-validation': ['epic-format-validation-report.md', 'epic-format-validation-report-template.md'],
  'epic-analyze': ['epic-analyze-report.md', 'epic-analyze-report-template.md'],
  'epic-validate': ['epic-validate-report.md', 'epic-validate-report-template.md'],
  'story-evaluation': ['finvest-evaluation-report.md', 'evaluation-output-template.md'],
  'story-analyze': ['analyze.md', 'analyze-report-template.md'],
  'story-code-review': ['code-review-report.md', 'code-review-report-template.md'],
  'story-verify': ['verify-report.md', 'verify-report-template.md'],
  'story-acceptance': ['acceptance-report.md', 'acceptance-report-template.md'],
};

function write(root, relative, value) {
  const target = path.join(root, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, value, 'utf8');
}

function policy(rows = Object.entries(REPORTS).map(([skill, [report]]) =>
  `| \`${skill}\` | \`${report}\` | \`APPROVED\`, \`NEEDS-CHANGES\` |`).join('\n'), exceptions = '') {
  return `# Política
## 2. Vocabulario
Formato: ^[A-Z]+(-[A-Z]+)*$
## 3. Reglas
Acción ante violación.
## 4. Valores permitidos por skill
| Skill | Reporte | Valores permitidos |
|---|---|---|
${rows}
## 5. Equivalencias
Valor heredado APROBADA.
## 6. Excepciones
| Skill | Motivo |
|---|---|
${exceptions}
## 7. Ejemplos
Conformes.
`;
}

function report(value = 'APPROVED') {
  return `---
type: report
verdict: ${value}
---
# Reporte

## Veredicto
**Veredicto:** \`${value}\` — conforme.

## Detalle
Contenido.
`;
}

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sddf-validation-contract-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true, maxRetries: 3 }));
  write(root, 'docs/policies/validation-contract-policy.md', policy());
  write(root, 'README.md', '[Contrato](docs/policies/validation-contract-policy.md)\n');
  for (const [skill, [, template]] of Object.entries(REPORTS)) {
    write(root, `skills/${skill}/SKILL.md`, '# Skill\nAPPROVED\n');
    write(root, `skills/${skill}/assets/${template}`, report('{verdict}'));
  }
  return root;
}

function rules(violations) {
  return violations.map((violation) => violation.rule);
}

test('V-1 lee el vocabulario de la policy por columnas, sin filtrar skills no instalados', () => {
  const rows = '| `APPROVED`, `NEEDS-REFINEMENT` | `epic-analyze` | `epic-analyze-report.md` |\n'
    + '| `APPROVED` | `epic-validate` | `epic-validate-report.md` |';
  const text = policy(rows, '| `story-code-review` | informes parciales |')
    .replace('| Skill | Reporte | Valores permitidos |', '| Valores permitidos | Skill | Reporte |');
  const parsed = parsePolicyContract(text);
  assert.deepEqual(parsed.errors, []);
  assert.deepEqual([...parsed.skills.get('epic-analyze').values], ['APPROVED', 'NEEDS-REFINEMENT']);
  assert.equal(parsed.skills.get('epic-validate').report, 'epic-validate-report.md');
  assert.equal(parsed.exceptionSkills.has('story-code-review'), true);
  assert.ok(parsePolicyContract('# Política\n').errors.length);
  assert.ok(parsePolicyContract(text.replace('Skill |', 'Otro |')).errors.length);
  assert.ok(parsePolicyContract(text.replace('NEEDS-REFINEMENT', 'needs-refinement')).errors.length);
  assert.ok(parsePolicyContract(text.replace('epic-analyze`', '../fuera`')).errors.length);
});

test('V-2 valida el frontmatter y el primer encabezado de templates', () => {
  const allowed = new Set(['APPROVED', 'NEEDS-CHANGES']);
  assert.deepEqual(checkReport(report('{verdict}'), allowed, 'template'), []);
  assert.deepEqual(checkReport(report('{APPROVED | NEEDS-CHANGES}'), allowed, 'template'), []);
  assert.deepEqual(checkReport(report('<APPROVED | NEEDS-CHANGES>'), allowed, 'template'), []);
  assert.deepEqual(checkReport(report('{verdict}').replace('# Reporte', '# Reporte\n<!-- nota -->')
    .replace('## Veredicto', '## Veredicto <!-- sección -->'), allowed, 'template'), []);
  assert.ok(rules(checkReport(report('{verdict}').replace('verdict: {verdict}\n', ''), allowed, 'template')).includes('G-01'));
  assert.ok(rules(checkReport(report('{verdict}').replace('verdict: {verdict}', 'verdict: {verdict}\nverdict: APPROVED'), allowed, 'template')).includes('G-01'));
  assert.ok(rules(checkReport(report('{verdict}').replace('# Reporte', '# Reporte\n> texto'), allowed, 'template')).includes('G-02'));
  assert.ok(rules(checkReport(report('{verdict}').replace('## Veredicto', '## Resumen\n## Veredicto'), allowed, 'template')).includes('G-02'));
  assert.ok(rules(checkReport(report('{verdict}').replace('**Veredicto:**', 'Resultado:'), allowed, 'template')).includes('G-02'));
  assert.ok(rules(checkReport(report('{APPROVED | SPLIT}'), allowed, 'template')).includes('G-03'));
  for (const key of ['decision', 'review-status', 'final-status']) {
    assert.ok(rules(checkReport(report('{verdict}').replace('type: report', `type: report\n${key}: APPROVED`), allowed, 'template')).includes('G-04'));
  }
  assert.deepEqual(checkReport(report('{verdict}').replace('# Reporte', '```md\n## Código\n```\n# Reporte'), allowed, 'template'), []);
});

test('V-3 compara un reporte concreto con el vocabulario y su línea de veredicto', () => {
  const allowed = new Set(['APPROVED']);
  assert.deepEqual(checkReport(report(), allowed, 'report'), []);
  assert.ok(rules(checkReport(report('{verdict}'), allowed, 'report')).includes('G-03'));
  assert.ok(rules(checkReport(report('BLOCKED'), allowed, 'report')).includes('G-03'));
  assert.ok(rules(checkReport(report().replace('`APPROVED` —', '`BLOCKED` —'), allowed, 'report')).includes('G-02'));
});

test('V-4 reconoce variantes heredadas solo en posición de valor cuando corresponde', () => {
  for (const [sample, rule] of [
    ['APROBADA', 'L-1'], ['APROBADAS', 'L-1'], ['decision: APROBADA', 'L-1'],
    ['Aprobada', 'L-2'], ['review-status', 'L-3'],
    ['status: approved | needs-changes', 'L-4'], ['review-status = approved', 'L-4'],
    ['`approved`', 'L-4'], ['[approved]', 'L-4'], ['{approved | …}', 'L-4'],
    ['"approved",', 'L-4'], ['CR --> VERIFY : approved', 'L-4'],
    ['→ approved', 'L-4'], ['**Review status** approved', 'L-4'],
    ['Review status approved', 'L-4'],
  ]) {
    assert.ok(rules(findLegacyVariants(`primera\n${sample}\n`)).includes(rule), sample);
    assert.ok(findLegacyVariants(`primera\n${sample}\n`).every((match) => match.line === 2));
  }
  for (const sample of ['Revisión de código aprobada', 'an approved English rendering',
    'explicitly approved.', 'happy-path-todos-approved',
    'indice-consistente-veredicto-approved', 'APPROVED', 'approved_by', 'approved-x']) {
    assert.deepEqual(findLegacyVariants(sample), [], sample);
  }
});

test('V-5 excluye históricos y revisa solo las raíces y secciones vigentes', (t) => {
  const root = fixture(t);
  for (const file of ['docs/specs/old.md', 'docs/adr/old.md', 'docs/product/roadmap.md',
    'docs/product/story-map.md', 'scripts/other.js', 'test/other.js',
    'node_modules/other.md', '.claude/other.md']) write(root, file, 'APROBADA\n');
  write(root, 'CHANGELOG.md', '## [Unreleased]\nlimpio\n## [1.0.0]\nAPROBADA\n');
  assert.deepEqual(verifyValidationContract(root, { legacyExceptions: [] }).errors, []);
  const active = ['docs/product/vision.md', 'docs/guides/guide.md',
    'skills/story-analyze/README.md', 'AGENTS.md'];
  for (const file of active) write(root, file, 'inicio\nAPROBADA\n');
  write(root, 'CHANGELOG.md', '## [Unreleased]\nAPROBADA\n## [1.0.0]\nAPROBADA\n');
  write(root, 'docs/policies/validation-contract-policy.md', policy().replace('Acción ante violación.', 'APROBADA'));
  write(root, 'docs/guides/image.png', 'APROBADA\n');
  const errors = verifyValidationContract(root, { legacyExceptions: [] }).errors;
  for (const file of [...active, 'CHANGELOG.md', 'docs/policies/validation-contract-policy.md']) {
    assert.ok(errors.some((error) => new RegExp(`${file.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\d+: L-1`).test(error)), file);
  }
  assert.equal(errors.some((error) => error.includes('image.png')), false);
});

test('V-6 cruza excepciones con §6, detecta obsoletas y conserva las demás reglas', (t) => {
  const root = fixture(t);
  const file = 'skills/story-code-review/agents/reviewer.agent.md';
  write(root, file, 'status: approved\nAPROBADA\n');
  const exception = { skill: 'story-code-review', pattern: /^skills\/story-code-review\/agents\/[^/]+\.agent\.md$/, rules: ['L-4'], story: 'STORY-141' };
  let errors = verifyValidationContract(root, { legacyExceptions: [exception] }).errors;
  assert.ok(errors.some((error) => error.includes('E-1')));
  write(root, 'docs/policies/validation-contract-policy.md', policy(undefined, '| `story-code-review` | informes |'));
  errors = verifyValidationContract(root, { legacyExceptions: [exception] }).errors;
  assert.equal(errors.some((error) => error.includes('E-1')), false);
  assert.ok(errors.some((error) => error.includes(`${file}:2: L-1`)));
  write(root, file, 'limpio\n');
  errors = verifyValidationContract(root, { legacyExceptions: [exception] }).errors;
  assert.ok(errors.some((error) => error.includes('E-2') && error.includes('excepción obsoleta')));
});

test('V-7 y V-8 fallan cerrado y aceptan reportes concretos reconocidos', (t) => {
  const root = fixture(t);
  assert.deepEqual(verifyValidationContract(root, { legacyExceptions: [] }).errors, []);
  write(root, 'README.md', '# Sin enlace\n');
  assert.ok(verifyValidationContract(root, { legacyExceptions: [] }).errors.some((error) => error.includes('R-1')));
  write(root, 'README.md', '[Contrato](docs/policies/validation-contract-policy.md)\n');
  write(root, 'epic-analyze-report.md', report());
  write(root, 'otro-report.md', report());
  assert.deepEqual(verifyReports(['epic-analyze-report.md'], root).errors, []);
  assert.ok(verifyReports([], root).errors.some((error) => error.includes('falta al menos un reporte')));
  assert.ok(verifyReports(['../epic-analyze-report.md'], root).errors.some((error) => error.includes('ruta fuera de la raíz')));
  assert.ok(verifyReports(['otro-report.md'], root).errors.some((error) => error.includes('reporte no reconocido')));
  fs.rmSync(path.join(root, 'skills/story-verify/assets/verify-report-template.md'));
  assert.ok(verifyValidationContract(root, { legacyExceptions: [] }).errors.some((error) => error.includes('G-01') && error.includes('template no encontrado')));
  fs.rmSync(path.join(root, 'docs/policies/validation-contract-policy.md'));
  const absent = verifyValidationContract(root, { legacyExceptions: [] });
  assert.ok(absent.errors.some((error) => error.includes('P-1')));
  assert.equal(absent.errors.some((error) => error.includes('G-03')), false);
});

test('F-4 informa skills sin entrada, falta de APPROVED y lectura UTF-8 inválida', (t) => {
  const root = fixture(t);
  write(root, 'skills/story-analyze/SKILL.md', '# Skill\n');
  write(root, 'skills/new-validator/SKILL.md', '# Skill\nAPPROVED\n');
  const extraRows = '| `new-validator` | `new-report.md` | `APPROVED` |\n'
    + '| `future-validator` | `future-report.md` | `APPROVED` |\n';
  write(root, 'docs/policies/validation-contract-policy.md', policy().replace('## 5.', extraRows + '## 5.'));
  fs.mkdirSync(path.join(root, 'docs/guides'), { recursive: true });
  fs.writeFileSync(path.join(root, 'docs/guides/invalid.md'), Buffer.from([0xff]));
  const errors = verifyValidationContract(root, { legacyExceptions: [] }).errors;
  assert.ok(errors.some((error) => error.includes('S-3') && error.includes('story-analyze')));
  assert.ok(errors.some((error) => error.includes('new-validator sin entrada en REPORT_TEMPLATES')));
  assert.equal(errors.some((error) => error.includes('future-validator')), false);
  assert.ok(errors.some((error) => error.includes('docs/guides/invalid.md:1: P-1')));
});

test('AC-4 registra epic-format-validation en la policy real con su flowchart de épica', () => {
  const repoRoot = path.resolve(__dirname, '..');
  const policyText = fs.readFileSync(path.join(repoRoot, 'docs/policies/validation-contract-policy.md'), 'utf8');
  const policyLines = policyText.split(/\r?\n/);
  const contract = parsePolicyContract(policyText);
  assert.deepEqual(contract.errors, []);
  const entry = contract.skills.get('epic-format-validation');
  assert.ok(entry, 'falta la fila de epic-format-validation en §4');
  assert.equal(entry.report, 'epic-format-validation-report.md');
  assert.deepEqual([...entry.values].sort(), ['APPROVED', 'NEEDS-REFINEMENT']);
  const exclusions = policyLines.find((line) => line.startsWith('**Exclusiones:**'));
  assert.ok(exclusions, 'falta la línea **Exclusiones:** en §1');
  assert.equal(exclusions.includes('epic-format-validation'), false);
  const row = policyLines.find((line) => line.startsWith('| `epic-format-validation` |'));
  const flowchart = 'flowchart-skill-epic-flow-relationship.mermaid';
  assert.ok(row.includes(`(../architecture/diagrams/${flowchart})`));

  const diagram = fs.readFileSync(path.join(repoRoot, 'docs/architecture/diagrams', flowchart), 'utf8');
  const decision = diagram.match(/^\s*epic-format-validation\s*-->\s*([\w-]+)\s*$/m);
  assert.ok(decision, 'epic-format-validation no apunta a un nodo de decisión');
  const branches = new Map([...diagram.matchAll(new RegExp(`^\\s*${decision[1]}\\s*-->\\|([^|]+)\\|\\s*([\\w-]+)`, 'gm'))]
    .map((match) => [match[1].trim(), match[2]]));
  assert.deepEqual([...branches.keys()].sort(), ['APPROVED', 'NEEDS-REFINEMENT']);
  assert.equal(branches.get('NEEDS-REFINEMENT'), 'epic-improve');
});
