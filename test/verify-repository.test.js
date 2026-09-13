'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const { npmExecutable } = require('../scripts/npm-invocation.js');
const { steps } = require('../scripts/verify-repository.js');

test('el gate enumera las verificaciones deterministas requeridas y no invoca evals LLM', () => {
  const labels = steps().map((step) => step.label);
  assert.deepEqual(labels, [
    'pruebas deterministas',
    'sintaxis Node',
    'resolución de raíces',
    'perfiles y stacks',
    'runtimes documentados',
    'configuración YAML',
    'inventario de evals',
    'enlaces activos',
    'cadena de suministro',
    'workflow de seguridad de skills',
    'release',
    'contenido publicable',
    'smoke del tarball',
  ]);
  assert.equal(steps().some((step) => step.args.includes('scripts/run-evals.js')), false);
  assert.deepEqual(steps()[0].args, ['--test', 'test']);
  const pack = steps().find((step) => step.label === 'contenido publicable');
  assert.equal(pack.args.at(-3), 'pack');
  assert.deepEqual(pack.args.slice(-2), ['--dry-run', '--ignore-scripts']);
});

test('conserva el nombre del ejecutable npm por plataforma para diagnósticos portables', () => {
  assert.equal(npmExecutable('win32'), 'npm.cmd');
  assert.equal(npmExecutable('linux'), 'npm');
});
