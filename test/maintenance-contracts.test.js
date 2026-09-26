'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { verifyEvalInventory } = require('../scripts/verify-eval-inventory.js');
const { verifyConfigContract } = require('../scripts/verify-config-contract.js');
const { verifyRelease } = require('../scripts/verify-release.js');

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agile-sddf-maintenance-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true, maxRetries: 3 }));
  return root;
}

function write(root, relativePath, contents) {
  const file = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
}

function writeEval(root, skill, cases = [{ id: 'TC-001' }]) {
  write(root, path.join('skills', skill, 'SKILL.md'), `# ${skill}\n`);
  write(root, path.join('skills', skill, 'evals', 'evals.json'), `${JSON.stringify({ cases })}\n`);
}

function writeExemptions(root, exemptions = []) {
  write(root, 'config/eval-exemptions.json', `${JSON.stringify({ version: 1, exemptions }, null, 2)}\n`);
}

test('el inventario de evals exige manifest o una excepción explícita y vigente', (t) => {
  const root = fixture(t);
  writeEval(root, 'alpha');
  write(root, 'skills/beta/SKILL.md', '# beta\n');
  writeExemptions(root, [
    {
      skill: 'beta',
      owner: 'maintainers',
      reason: 'Pendiente de escenarios deterministas.',
      review_by: '2026-12-31',
    },
  ]);

  assert.deepEqual(verifyEvalInventory(root).errors, []);

  writeExemptions(root);
  assert.match(verifyEvalInventory(root).errors.join('\n'), /beta/);
});

test('el inventario de evals rechaza IDs inseguros y duplicados por manifest', (t) => {
  const root = fixture(t);
  writeEval(root, 'alpha', [{ id: 'TC-001' }, { id: '../escape' }, { id: 'TC-001' }]);
  writeExemptions(root);

  const errors = verifyEvalInventory(root).errors.join('\n');
  assert.match(errors, /ID de caso inválido/);
  assert.match(errors, /duplicado/);
});

test('el contrato de configuración exige booleanos y scripts existentes solo cuando son requeridos', (t) => {
  const root = fixture(t);
  write(root, 'package.json', JSON.stringify({ scripts: { 'test:unit': 'node --test' } }));
  write(root, 'sddf.config.yaml', [
    'verify:',
    '  unit:',
    '    command: "npm run test:unit"',
    '    required: true',
    '  component:',
    '    command: "npm run test:missing"',
    '    required: false',
    '',
  ].join('\n'));

  assert.deepEqual(verifyConfigContract({ repoRoot: root, configPaths: ['sddf.config.yaml'] }).errors, []);

  write(root, 'sddf.config.yaml', [
    'verify:',
    '  unit:',
    '    command: "npm run test:missing"',
    '    required: true',
    '  component:',
    '    required: tfalserue',
    '',
  ].join('\n'));
  const errors = verifyConfigContract({ repoRoot: root, configPaths: ['sddf.config.yaml'] }).errors.join('\n');
  assert.match(errors, /booleano/);
  assert.match(errors, /test:missing/);
});

test('el gate de release alinea package, lockfile y changelog', (t) => {
  const root = fixture(t);
  write(root, 'package.json', JSON.stringify({ name: 'fixture', version: '3.0.0' }));
  write(root, 'package-lock.json', JSON.stringify({
    name: 'fixture',
    version: '3.0.0',
    packages: { '': { version: '3.0.0' } },
  }));
  write(root, 'CHANGELOG.md', '# Changelog\n\n## [3.0.0] — 2026-09-13\n\n- Cambio.\n');

  assert.deepEqual(verifyRelease(root).errors, []);

  write(root, 'CHANGELOG.md', '# Changelog\n\n## [2.0.0]\n');
  assert.match(verifyRelease(root).errors.join('\n'), /3\.0\.0/);

  write(root, 'CHANGELOG.md', '# Changelog\n\n## [3.0.0]\n');
  assert.match(verifyRelease(root).errors.join('\n'), /YYYY-MM-DD/);

  const selfTarball = 'file:.tmp/test-consumer/fixture-3.0.0.tgz';
  write(root, 'package.json', JSON.stringify({
    name: 'fixture',
    version: '3.0.0',
    dependencies: { fixture: selfTarball },
  }));
  write(root, 'package-lock.json', JSON.stringify({
    name: 'fixture',
    version: '3.0.0',
    packages: {
      '': { version: '3.0.0', dependencies: { fixture: selfTarball } },
      'node_modules/fixture': { version: '3.0.0', resolved: selfTarball },
    },
  }));
  write(root, 'CHANGELOG.md', '# Changelog\n\n## [3.0.0] — 2026-09-13\n');
  const selfDependencyErrors = verifyRelease(root).errors.join('\n');
  assert.match(selfDependencyErrors, /package\.json: fixture no puede depender de sí mismo/);
  assert.match(selfDependencyErrors, /package-lock\.json \(paquete raíz\): fixture no puede depender de sí mismo/);
  assert.match(selfDependencyErrors, /node_modules\/fixture/);
});
