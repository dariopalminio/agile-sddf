'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { installSDDF } = require('../scripts/install.js');
const { loadRuntimeContract } = require('../scripts/runtime-contract.js');
const { verifyEvalInventory } = require('../scripts/verify-eval-inventory.js');

const REPO_ROOT = path.resolve(__dirname, '..');
const RETIRED_SKILL = 'project-policies-generation';
const RENAMED_SKILL = 'sddf-constitution';

// STORY-184: semilla de REVIEW.md. La plantilla del skill es la que se publica;
// la de docs/templates/ es la copia central y ambas deben ser idénticas (D-1).
const SKILL_REVIEW_TEMPLATE = `skills/${RENAMED_SKILL}/assets/REVIEW-template.md`;
const CENTRAL_REVIEW_TEMPLATE = 'docs/templates/REVIEW-template.md';
const SKILL_EVALS = `skills/${RENAMED_SKILL}/evals/evals.json`;
const REVIEW_SECTION_PREFIXES = ['Qué es «Importante» aquí', 'Tope de Minor', 'No reportar', 'Verificar siempre'];
const REVIEW_CREATED = '✅ Creado: REVIEW.md';
const REVIEW_KEPT = 'ℹ️ Conservado: REVIEW.md (ya existe)';
const REVIEW_TEMPLATE_MISSING = '⚠️ Plantilla no encontrada: assets/REVIEW-template.md';
const UTF8_BOM = Buffer.from([0xef, 0xbb, 0xbf]);
// Code points de ai-no-hidden-characters (gr-ai-security-checklist), escritos como escapes.
const HIDDEN_CHARACTERS = /[\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u2069\uFEFF\u{E0000}-\u{E007F}]|\u001B\[/u;

// Estos alcances son registro histórico, no superficies operativas. EV-004 no
// los recorre: su allowlist evita interpretar sus menciones como aliases.
const HISTORICAL_REFERENCE_ALLOWLIST = [
  'CHANGELOG.md',
  'docs/specs/',
  'docs/architecture/memory-system.md',
  'skills/memory-system/scripts/dod-story.js',
  'test/dod-story.test.js',
];

const OPERATIONAL_REFERENCE_SURFACES = [
  'README.md',
  'config/eval-exemptions.json',
  'docs/guides/sddf-commands-pipeline.md',
  'docs/guardrails/README.md',
  'skills/sddf-constitution/',
  'skills/sddf-init/SKILL.md',
  'skills/sddf-init/README.md',
  'skills/sddf-init/evals/evals.json',
  'skills/story-design/SKILL.md',
];

const IGNORED_DIRECTORIES = new Set(['.agents', '.claude', '.git', '.tmp', 'node_modules']);
const TEXT_EXTENSIONS = new Set(['.json', '.js', '.md', '.txt', '.yaml', '.yml']);

function read(relativePath) {
  return fs.readFileSync(path.join(REPO_ROOT, relativePath), 'utf8');
}

function frontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert.ok(match, 'SKILL.md debe conservar frontmatter YAML');
  return match[1];
}

function listTextFiles(directory, relativeDirectory = '') {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const relativePath = path.posix.join(relativeDirectory, entry.name);
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (!IGNORED_DIRECTORIES.has(entry.name)) {
        files.push(...listTextFiles(fullPath, relativePath));
      }
      continue;
    }

    if (entry.isFile() && TEXT_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(relativePath);
    }
  }
  return files;
}

function listOperationalTextFiles() {
  return OPERATIONAL_REFERENCE_SURFACES.flatMap((relativePath) => {
    const fullPath = path.join(REPO_ROOT, relativePath);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      return listTextFiles(fullPath, relativePath.replace(/\/$/, ''));
    }

    return TEXT_EXTENSIONS.has(path.extname(relativePath).toLowerCase()) ? [relativePath] : [];
  });
}

function temporaryProject(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agile-sddf-sddf-constitution-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true, maxRetries: 3 }));
  return root;
}

async function withoutInstallLogs(operation) {
  const originalLog = console.log;
  console.log = () => {};

  try {
    return await operation();
  } finally {
    console.log = originalLog;
  }
}

test('E2E-001: la fuente canónica adopta sddf-constitution y conserva sus artefactos', () => {
  const skillDirectory = path.join(REPO_ROOT, 'skills', RENAMED_SKILL);
  assert.equal(fs.existsSync(skillDirectory), true, `debe existir skills/${RENAMED_SKILL}/`);
  assert.equal(
    fs.existsSync(path.join(REPO_ROOT, 'skills', RETIRED_SKILL)),
    false,
    `no debe permanecer skills/${RETIRED_SKILL}/`,
  );

  const requiredArtifacts = [
    'README.md',
    'assets/project-constitution-template.md',
    'assets/dod-story/dod-story-specify.md',
    'assets/dod-story/dod-story-plan.md',
    'assets/dod-story/dod-story-implement.md',
    'assets/dod-story/dod-story-code-review.md',
    'assets/dod-story/dod-story-verify.md',
    'assets/dod-story/dod-story-acceptance.md',
    'assets/REVIEW-template.md',
    'evals/evals.json',
    'examples/example-output-constitution.md',
    'examples/example-output-dod.md',
  ];
  for (const relativePath of requiredArtifacts) {
    assert.equal(
      fs.existsSync(path.join(skillDirectory, relativePath)),
      true,
      `debe conservar ${relativePath}`,
    );
  }

  const skill = read(`skills/${RENAMED_SKILL}/SKILL.md`);
  const readme = read(`skills/${RENAMED_SKILL}/README.md`);
  assert.match(frontmatter(skill), /^name:\s*sddf-constitution\s*$/m);
  assert.match(skill, /# Skill:\s*`\/sddf-constitution`/);
  assert.match(skill, /Templates de solo lectura/);
  assert.match(skill, /Sin sobreescritura silenciosa/);
  assert.match(skill, /Inserci.n conservadora/);
  assert.match(readme, /^# sddf-constitution\s*$/m);
  assert.doesNotMatch(readme, /project-policies-generation/);
});

test('E2E-002: las integraciones activas recomiendan solo sddf-constitution', () => {
  const integrationSurfaces = [
    'skills/sddf-init/SKILL.md',
    'skills/sddf-init/README.md',
    'skills/sddf-init/evals/evals.json',
    'skills/story-design/SKILL.md',
  ];

  for (const relativePath of integrationSurfaces) {
    const source = read(relativePath);
    assert.equal(
      source.includes(RETIRED_SKILL),
      false,
      `${relativePath} no debe ofrecer el nombre retirado`,
    );
    assert.equal(
      source.includes(RENAMED_SKILL),
      true,
      `${relativePath} debe recomendar ${RENAMED_SKILL}`,
    );
  }
});

test('EV-001: el contrato declarativo no conserva aliases públicos retirados', () => {
  const skill = read(`skills/${RENAMED_SKILL}/SKILL.md`);
  const yaml = frontmatter(skill);

  assert.match(yaml, /^name:\s*sddf-constitution\s*$/m);
  assert.doesNotMatch(yaml, /^triggers:/m);
  assert.equal(yaml.includes(RETIRED_SKILL), false);
  assert.equal(skill.includes(`/${RETIRED_SKILL}`), false);
  assert.match(skill, /constitution\.md/);
  assert.match(skill, /policies/);
  assert.match(skill, /dod-story-/);
  assert.match(skill, /Manual[^\n]*`\/sddf-constitution`/);
});

test('EV-002: TC-006 de sddf-init declara la omisión mínima con el nombre nuevo', () => {
  const manifest = JSON.parse(read('skills/sddf-init/evals/evals.json'));
  const testCase = manifest.cases.find((candidate) => candidate.id === 'TC-006');

  assert.ok(testCase, 'debe existir TC-006 en los evals de sddf-init');
  assert.ok(Array.isArray(testCase.expected?.contains));
  assert.ok(
    testCase.expected.contains.includes('[OMITIDO] sddf-constitution (nivel minimal)'),
    'TC-006 debe exigir el literal de omisión renombrado',
  );
  assert.equal(
    JSON.stringify(testCase).includes(RETIRED_SKILL),
    false,
    'TC-006 no debe ofrecer el nombre retirado',
  );
});

test('EV-003: el inventario reconoce los evals de sddf-constitution sin exención (STORY-184)', () => {
  const inventory = verifyEvalInventory(REPO_ROOT);

  assert.deepEqual(inventory.errors, []);
  assert.ok(inventory.skills.includes(RENAMED_SKILL));
  assert.equal(inventory.skills.includes(RETIRED_SKILL), false);
  assert.equal(inventory.missing.includes(RENAMED_SKILL), false, `${RENAMED_SKILL} debe tener evals/evals.json`);
  assert.equal(inventory.exemptions.includes(RENAMED_SKILL), false, `${RENAMED_SKILL} no debe seguir exento`);
  assert.equal(inventory.exemptions.includes(RETIRED_SKILL), false);
});

test('EV-004: las superficies operativas no ofrecen el nombre retirado y preservan solo la historia permitida', () => {
  const unexpectedReferences = listOperationalTextFiles()
    .filter((relativePath) => read(relativePath).includes(RETIRED_SKILL));

  assert.deepEqual(
    unexpectedReferences,
    [],
    `referencias operativas no permitidas: ${unexpectedReferences.join(', ')}`,
  );

  const historicalFiles = HISTORICAL_REFERENCE_ALLOWLIST
    .filter((relativePath) => !relativePath.endsWith('/'));
  const preservedHistoricalReferences = historicalFiles
    .filter((relativePath) => read(relativePath).includes(RETIRED_SKILL));

  assert.deepEqual(preservedHistoricalReferences, historicalFiles);
});

test('IT-001: una instalación limpia distribuye sddf-constitution y no el directorio retirado', { concurrency: false }, async (t) => {
  const projectDirectory = temporaryProject(t);
  const runtimes = loadRuntimeContract().runtimes.filter((runtime) => runtime.support === 'supported');

  await withoutInstallLogs(async () => {
    for (const runtime of runtimes) {
      const result = await installSDDF({ target: runtime.id, baseDir: projectDirectory });
      const skillsDirectory = path.join(result.destination, runtime.layout.skillsDirectory);
      assert.equal(
        fs.existsSync(path.join(skillsDirectory, RENAMED_SKILL)),
        true,
        `${runtime.id} debe instalar ${RENAMED_SKILL}`,
      );
      assert.equal(
        fs.existsSync(path.join(skillsDirectory, RENAMED_SKILL, 'assets', 'REVIEW-template.md')),
        true,
        `${runtime.id} debe recibir la plantilla semilla assets/REVIEW-template.md`,
      );
      assert.equal(
        fs.existsSync(path.join(skillsDirectory, RETIRED_SKILL)),
        false,
        `${runtime.id} no debe recibir ${RETIRED_SKILL} en un destino limpio`,
      );
    }
  });
});

test('UT-001: la plantilla semilla del skill es idéntica byte a byte a la central (CNF-1)', () => {
  const skillPath = path.join(REPO_ROOT, SKILL_REVIEW_TEMPLATE);
  const centralPath = path.join(REPO_ROOT, CENTRAL_REVIEW_TEMPLATE);
  assert.equal(fs.existsSync(skillPath), true, `debe existir ${SKILL_REVIEW_TEMPLATE}`);

  assert.ok(
    fs.readFileSync(skillPath).equals(fs.readFileSync(centralPath)),
    `${SKILL_REVIEW_TEMPLATE} y ${CENTRAL_REVIEW_TEMPLATE} deben ser idénticos byte a byte`,
  );
});

test('UT-002: la plantilla semilla tiene las cuatro secciones en orden, sin BOM ni caracteres invisibles (AC-1, CNF-4)', () => {
  const skillPath = path.join(REPO_ROOT, SKILL_REVIEW_TEMPLATE);
  assert.equal(fs.existsSync(skillPath), true, `debe existir ${SKILL_REVIEW_TEMPLATE}`);
  const bytes = fs.readFileSync(skillPath);
  const text = bytes.toString('utf8');

  assert.equal(bytes.subarray(0, 3).equals(UTF8_BOM), false, `${SKILL_REVIEW_TEMPLATE}: sin BOM`);
  assert.equal(HIDDEN_CHARACTERS.test(text), false, `${SKILL_REVIEW_TEMPLATE}: sin code points de ai-no-hidden-characters`);

  const headings = text.split(/\r?\n/).filter((line) => line.startsWith('## ')).map((line) => line.slice(3));
  assert.equal(headings.length, REVIEW_SECTION_PREFIXES.length, `cuatro secciones ##, encontradas: ${headings.join(' | ')}`);
  REVIEW_SECTION_PREFIXES.forEach((prefix, index) => {
    assert.ok(headings[index].startsWith(prefix), `la sección ${index + 1} debe empezar por «${prefix}»`);
  });
});

test('EV-005: SKILL.md declara el Paso 4 de la semilla y los evals usan sus literales (AC-1, AC-2, CNF-3)', () => {
  const skill = read(`skills/${RENAMED_SKILL}/SKILL.md`);
  for (const literal of ['### Paso 4 — Sembrar REVIEW.md', 'assets/REVIEW-template.md', REVIEW_CREATED, REVIEW_KEPT]) {
    assert.ok(skill.includes(literal), `SKILL.md debe contener «${literal}»`);
  }

  const bytes = fs.readFileSync(path.join(REPO_ROOT, SKILL_EVALS));
  assert.equal(bytes.subarray(0, 3).equals(UTF8_BOM), false, `${SKILL_EVALS}: sin BOM`);
  const manifest = JSON.parse(bytes.toString('utf8'));
  const byId = (id) => {
    const testCase = manifest.cases.find((candidate) => candidate.id === id);
    assert.ok(testCase, `${SKILL_EVALS} debe tener ${id}`);
    return testCase.expected;
  };

  assert.ok(byId('TC-001').contains.includes(REVIEW_CREATED), 'TC-001 exige la creación');
  for (const id of ['TC-002', 'TC-003']) {
    assert.ok(byId(id).contains.includes(REVIEW_KEPT), `${id} exige la conservación`);
    assert.ok(byId(id).not_contains.includes(REVIEW_CREATED), `${id} excluye la creación`);
  }
  assert.ok(byId('TC-004').contains.includes(REVIEW_TEMPLATE_MISSING), 'TC-004 exige la advertencia de plantilla ausente');
});
