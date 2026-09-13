#!/usr/bin/env node
'use strict';

/*
 * Prueba de distribución, no de desarrollo: empaqueta el árbol actual, instala
 * el tarball en un consumidor temporal con lifecycle desactivado y comprueba que
 * cada runtime declarado solo recibe archivos tras `agile-sddf install`.
 *
 * No intenta arrancar software propietario de los runtimes. La evidencia que
 * puede ser idéntica en Windows, macOS y Linux es la disposición canónica que
 * esos runtimes descubren: raíz, skills, agentes y sus inventarios.
 */

const assert = require('node:assert/strict');
const childProcess = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { npmInvocation } = require('./npm-invocation.js');

const REPO_ROOT = path.resolve(__dirname, '..');
const FORBIDDEN_LIFECYCLE_SCRIPTS = [
  'preinstall',
  'install',
  'postinstall',
  'prepublish',
  'preprepare',
  'prepare',
  'postprepare',
  'prepack',
  'postpack',
  'prepublishOnly',
];

function run(command, args, { cwd, env } = {}) {
  const result = childProcess.spawnSync(command, args, {
    cwd,
    env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (result.error) {
    throw new Error(`${command} no pudo iniciarse: ${result.error.message}`);
  }
  if (result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join('\n').trim();
    throw new Error(`${command} ${args.join(' ')} terminó con ${result.status}${output ? `:\n${output}` : ''}`);
  }
  return result.stdout;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function assertNoLifecycleInstall(manifest, label) {
  const scripts = manifest.scripts || {};
  const found = FORBIDDEN_LIFECYCLE_SCRIPTS.filter((name) => Object.prototype.hasOwnProperty.call(scripts, name));
  assert.deepEqual(
    found,
    [],
    `${label} no debe declarar lifecycle scripts (${found.join(', ')}); use \`agile-sddf install\` explícitamente.`,
  );
}

function listFiles(root, relative = '') {
  const directory = path.join(root, relative);
  const entries = fs.readdirSync(directory, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name));
  const files = [];
  for (const entry of entries) {
    const child = path.join(relative, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(root, child));
    } else if (entry.isFile()) {
      files.push(child.split(path.sep).join('/'));
    } else {
      throw new Error(`El inventario no admite entradas no regulares: ${path.join(root, child)}`);
    }
  }
  return files;
}

function assertSameTree(expectedRoot, actualRoot, label) {
  assert.equal(fs.existsSync(expectedRoot), true, `${label}: fuente ausente (${expectedRoot})`);
  assert.equal(fs.existsSync(actualRoot), true, `${label}: destino ausente (${actualRoot})`);
  const expectedFiles = listFiles(expectedRoot);
  const actualFiles = listFiles(actualRoot);
  assert.deepEqual(actualFiles, expectedFiles, `${label}: inventario diferente`);
  for (const relativeFile of expectedFiles) {
    const expected = fs.readFileSync(path.join(expectedRoot, relativeFile));
    const actual = fs.readFileSync(path.join(actualRoot, relativeFile));
    assert.equal(Buffer.compare(actual, expected), 0, `${label}: contenido diferente en ${relativeFile}`);
  }
}

function destination(base, runtime, mode) {
  return path.join(base, ...runtime.destinations[mode].rootSegments);
}

function assertNoRuntimeDirectories(base, runtimes, mode) {
  const checked = new Set();
  for (const runtime of runtimes) {
    const roots = [runtime.destinations[mode].rootSegments];
    for (const compatibilityPath of runtime.compatibilityPaths || []) {
      if (compatibilityPath.scope === mode) roots.push(compatibilityPath.rootSegments);
    }
    for (const rootSegments of roots) {
      const dir = path.join(base, ...rootSegments);
      if (checked.has(dir)) continue;
      checked.add(dir);
      assert.equal(fs.existsSync(dir), false, `La instalación implícita creó ${dir}`);
    }
  }
}

function packageTarball(repoRoot, packDir) {
  const invocation = npmInvocation(['pack', '--json', '--ignore-scripts', '--pack-destination', packDir]);
  const output = run(invocation.command, invocation.args, { cwd: repoRoot });
  let result;
  try {
    result = JSON.parse(output);
  } catch (error) {
    throw new Error(`npm pack no devolvió JSON válido: ${error.message}`);
  }
  if (!Array.isArray(result) || result.length !== 1 || typeof result[0].filename !== 'string') {
    throw new Error('npm pack no devolvió exactamente un tarball con filename.');
  }
  const tarball = path.resolve(packDir, result[0].filename);
  if (!fs.existsSync(tarball)) throw new Error(`npm pack no creó ${tarball}`);
  return tarball;
}

function installTarball(consumerDir, tarball, homeDir) {
  fs.writeFileSync(
    path.join(consumerDir, 'package.json'),
    `${JSON.stringify({ name: 'agile-sddf-smoke-consumer', private: true, version: '0.0.0' }, null, 2)}\n`,
  );
  // La ausencia de hooks se verifica antes de empaquetar y de instalar. Aun
  // así, el smoke no ejecuta lifecycle scripts de una PR no confiable.
  const invocation = npmInvocation(['install', '--ignore-scripts', '--no-audit', '--no-fund', tarball]);
  run(invocation.command, invocation.args, {
    cwd: consumerDir,
    env: runtimeEnv(consumerDir, homeDir),
  });
}

function installedPackageDir(consumerDir, packageName) {
  return path.join(consumerDir, 'node_modules', ...packageName.split('/'));
}

function runtimeEnv(consumerDir, homeDir) {
  return {
    ...process.env,
    INIT_CWD: consumerDir,
    HOME: homeDir,
    USERPROFILE: homeDir,
    HOMEDRIVE: path.parse(homeDir).root,
    HOMEPATH: path.relative(path.parse(homeDir).root, homeDir),
  };
}

function runExplicitInstall(cliPath, consumerDir, homeDir, runtimeId, global = false) {
  const args = [cliPath, 'install', '--target', runtimeId, '--force'];
  if (global) args.push('--global');
  return childProcess.spawnSync(process.execPath, args, {
    cwd: consumerDir,
    env: runtimeEnv(consumerDir, homeDir),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function assertInstallSucceeded(result, runtime, mode) {
  assert.equal(result.error, undefined, result.error && result.error.message);
  assert.equal(
    result.status,
    0,
    `${runtime.id} (${mode}) falló:\n${[result.stdout, result.stderr].filter(Boolean).join('\n')}`,
  );
}

function verifyPackagedCoreProfile(packageDir, consumerDir, homeDir) {
  const verifier = path.join(packageDir, 'scripts', 'verify-profiles.js');
  const result = childProcess.spawnSync(process.execPath, [
    verifier,
    '--profile',
    'core',
    '--repo-root',
    packageDir,
    '--quiet',
  ], {
    cwd: consumerDir,
    env: runtimeEnv(consumerDir, homeDir),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  assert.equal(result.error, undefined, result.error && result.error.message);
  assert.equal(
    result.status,
    0,
    `El preflight core del paquete falló:\n${[result.stdout, result.stderr].filter(Boolean).join('\n')}`,
  );
}

function verifyExplicitRuntimeInstalls({ consumerDir, homeDir, packageDir, runtimes }) {
  const cliPath = path.join(packageDir, 'scripts', 'cli.js');
  assert.equal(fs.existsSync(cliPath), true, 'El tarball no contiene scripts/cli.js');

  for (const runtime of runtimes) {
    const local = runExplicitInstall(cliPath, consumerDir, homeDir, runtime.id);
    assertInstallSucceeded(local, runtime, 'local');
    const localRoot = destination(consumerDir, runtime, 'local');
    assertSameTree(path.join(packageDir, 'skills'), path.join(localRoot, runtime.layout.skillsDirectory), `${runtime.id} local skills`);
    assertSameTree(path.join(packageDir, 'agents'), path.join(localRoot, runtime.layout.agentsDirectory), `${runtime.id} local agents`);

    const global = runExplicitInstall(cliPath, consumerDir, homeDir, runtime.id, true);
    assertInstallSucceeded(global, runtime, 'global');
    const globalRoot = destination(homeDir, runtime, 'global');
    assertSameTree(path.join(packageDir, 'skills'), path.join(globalRoot, runtime.layout.skillsDirectory), `${runtime.id} global skills`);
    assertSameTree(path.join(packageDir, 'agents'), path.join(globalRoot, runtime.layout.agentsDirectory), `${runtime.id} global agents`);
  }

  const legacy = childProcess.spawnSync(process.execPath, [cliPath, 'install', '--target', '.agents'], {
    cwd: consumerDir,
    env: runtimeEnv(consumerDir, homeDir),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  assert.notEqual(legacy.status, 0, 'La ruta de compatibilidad .agents no debe ser instalable.');
  assert.equal(fs.existsSync(path.join(consumerDir, '.agents')), false, 'El rechazo de .agents no debe escribir nada.');
}

function smokePackageInstall({ repoRoot = REPO_ROOT, keep = process.env.SDDF_SMOKE_KEEP === '1' } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agile-sddf-package-smoke-'));
  try {
    const sourceManifest = readJson(path.join(repoRoot, 'package.json'));
    assertNoLifecycleInstall(sourceManifest, 'package.json fuente');

    const packDir = path.join(root, 'pack');
    const consumerDir = path.join(root, 'consumer');
    const homeDir = path.join(root, 'home');
    fs.mkdirSync(packDir);
    fs.mkdirSync(consumerDir);
    fs.mkdirSync(homeDir);

    const tarball = packageTarball(repoRoot, packDir);
    const sourceRuntimes = readJson(path.join(repoRoot, 'config', 'runtimes.json')).runtimes;
    assertNoRuntimeDirectories(consumerDir, sourceRuntimes, 'local');
    assertNoRuntimeDirectories(homeDir, sourceRuntimes, 'global');
    installTarball(consumerDir, tarball, homeDir);
    assertNoRuntimeDirectories(consumerDir, sourceRuntimes, 'local');
    assertNoRuntimeDirectories(homeDir, sourceRuntimes, 'global');

    const packageDir = installedPackageDir(consumerDir, sourceManifest.name);
    const installedManifest = readJson(path.join(packageDir, 'package.json'));
    assertNoLifecycleInstall(installedManifest, 'package.json del tarball');
    const installedContract = readJson(path.join(packageDir, 'config', 'runtimes.json'));
    assert.deepEqual(installedContract.runtimes, sourceRuntimes, 'El tarball alteró el contrato de runtimes.');
    assert.equal(fs.existsSync(path.join(packageDir, 'config', 'profiles.json')), true, 'El tarball no contiene config/profiles.json');
    verifyPackagedCoreProfile(packageDir, consumerDir, homeDir);

    verifyExplicitRuntimeInstalls({
      consumerDir,
      homeDir,
      packageDir,
      runtimes: installedContract.runtimes.filter((runtime) => runtime.support === 'supported'),
    });

    return { root: keep ? root : null, runtimes: installedContract.runtimes.length };
  } finally {
    if (!keep) fs.rmSync(root, { recursive: true, force: true, maxRetries: 3 });
  }
}

function main() {
  const result = smokePackageInstall();
  console.log(`[OK] Smoke del tarball aprobó ${result.runtimes} runtime(s) declarados.${result.root ? ` Fixture retenido: ${result.root}` : ''}`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`[ERROR] Smoke del paquete falló: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = {
  listFiles,
  assertSameTree,
  assertNoLifecycleInstall,
  assertNoRuntimeDirectories,
  smokePackageInstall,
};
