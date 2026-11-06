'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const {
  listFiles,
  assertSameTree,
  assertNoLifecycleInstall,
  verifyPackageBin,
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

// Consumidor con un paquete local mínimo; sin dependencias, no necesita red.
function consumerWithBin(t, version) {
  const root = fixture(t);
  write(root, 'pkg/package.json', JSON.stringify({ name: 'agile-sddf', version, bin: { 'agile-sddf': 'cli.js' } }));
  write(root, 'pkg/cli.js', `#!/usr/bin/env node\nconsole.log(${JSON.stringify(version)});\n`);
  write(root, 'consumer/package.json', JSON.stringify({ name: 'consumer', private: true, version: '0.0.0' }));
  const consumer = path.join(root, 'consumer');
  const invocation = npmInvocation(['install', '--offline', '--ignore-scripts', '--no-audit', '--no-fund', '../pkg']);
  const result = spawnSync(invocation.command, invocation.args, { cwd: consumer, encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  return { consumer, home: root };
}

test('el smoke acepta el bin instalado que informa la versión del paquete', (t) => {
  const { consumer, home } = consumerWithBin(t, '9.9.9');
  assert.doesNotThrow(() => verifyPackageBin(consumer, home, '9.9.9'));
});

test('el smoke rechaza el bin que informa otra versión', (t) => {
  const { consumer, home } = consumerWithBin(t, '9.9.9');
  assert.throws(() => verifyPackageBin(consumer, home, '1.0.0'), /no informó la versión/);
});

test('el smoke falla si el bin local no existe, aunque haya uno global', (t) => {
  const root = fixture(t);
  write(root, 'package.json', JSON.stringify({ name: 'consumer', private: true, version: '0.0.0' }));
  assert.throws(() => verifyPackageBin(root, root, '9.9.9'), /no creó el bin local/);
});

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
