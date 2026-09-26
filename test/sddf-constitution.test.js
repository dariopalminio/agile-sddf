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

test('EV-003: el inventario declara la exención temporal bajo sddf-constitution', () => {
  const inventory = verifyEvalInventory(REPO_ROOT);

  assert.deepEqual(inventory.errors, []);
  assert.ok(inventory.skills.includes(RENAMED_SKILL));
  assert.equal(inventory.skills.includes(RETIRED_SKILL), false);
  assert.ok(inventory.missing.includes(RENAMED_SKILL));
  assert.ok(inventory.exemptions.includes(RENAMED_SKILL));
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
        fs.existsSync(path.join(skillsDirectory, RETIRED_SKILL)),
        false,
        `${runtime.id} no debe recibir ${RETIRED_SKILL} en un destino limpio`,
      );
    }
  });
});
