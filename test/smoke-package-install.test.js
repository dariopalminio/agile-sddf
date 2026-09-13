'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const {
  listFiles,
  assertSameTree,
  assertNoLifecycleInstall,
} = require('../scripts/smoke-package-install.js');
const { npmExecutable, npmInvocation } = require('../scripts/npm-invocation.js');

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agile-sddf-smoke-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true, maxRetries: 3 }));
  return root;
}

function write(root, relative, contents) {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
}

test('elige el ejecutable npm correcto para cada plataforma', () => {
  assert.equal(npmExecutable('win32'), 'npm.cmd');
  assert.equal(npmExecutable('linux'), 'npm');
  assert.equal(npmExecutable('darwin'), 'npm');
});

test('en Windows invoca npm-cli.js con Node sin activar un shell', () => {
  const invocation = npmInvocation(['pack', '--dry-run'], {
    platform: 'win32',
    nodeExecutable: 'C:\\node\\node.exe',
    env: {},
    exists: (candidate) => candidate === 'C:\\node\\node_modules\\npm\\bin\\npm-cli.js',
  });
  assert.equal(invocation.command, 'C:\\node\\node.exe');
  assert.deepEqual(invocation.args, [
    'C:\\node\\node_modules\\npm\\bin\\npm-cli.js',
    'pack',
    '--dry-run',
  ]);
});

test('el smoke bloquea todos los hooks de lifecycle relevantes antes de instalar', () => {
  assert.doesNotThrow(() => assertNoLifecycleInstall({ scripts: {} }, 'fixture'));
  assert.throws(
    () => assertNoLifecycleInstall({ scripts: { preinstall: 'node evil.js', prepack: 'node evil.js' } }, 'fixture'),
    /preinstall, prepack/,
  );
});

test('compara el inventario y el contenido completo de skills/agentes empaquetados', (t) => {
  const root = fixture(t);
  const source = path.join(root, 'source');
  const copied = path.join(root, 'copied');
  write(source, 'alpha/SKILL.md', '# alpha\n');
  write(source, 'alpha/assets/example.txt', 'contenido\n');
  write(copied, 'alpha/SKILL.md', '# alpha\n');
  write(copied, 'alpha/assets/example.txt', 'contenido\n');

  assert.deepEqual(listFiles(source), ['alpha/assets/example.txt', 'alpha/SKILL.md']);
  assert.doesNotThrow(() => assertSameTree(source, copied, 'fixture'));

  write(copied, 'alpha/assets/example.txt', 'distinto\n');
  assert.throws(() => assertSameTree(source, copied, 'fixture'), /contenido diferente/);
});
