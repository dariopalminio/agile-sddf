'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const REPO_ROOT = path.resolve(__dirname, '..');
const POSTINSTALL_PATH = path.join(REPO_ROOT, 'scripts', 'postinstall.js');
const CLI_PATH = path.join(REPO_ROOT, 'scripts', 'cli.js');
const { loadRuntimeContract } = require('../scripts/runtime-contract.js');
const {
  installSDDF,
  resolveDestDir,
  VALID_TARGETS,
  assertDestinationContained,
} = require('../scripts/install.js');

const RUNTIME_CONTRACT = loadRuntimeContract();
const RUNTIMES = RUNTIME_CONTRACT.runtimes.filter((runtime) => runtime.support === 'supported');

function createFixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agile-sddf-install-'));
  const projectDir = path.join(root, 'project');
  const homeDir = path.join(root, 'home');
  fs.mkdirSync(projectDir);
  fs.mkdirSync(homeDir);

  t.after(() => {
    fs.rmSync(root, { recursive: true, force: true, maxRetries: 3 });
  });

  return { root, projectDir, homeDir };
}

async function withInitCwd(initCwd, operation) {
  const previous = process.env.INIT_CWD;
  process.env.INIT_CWD = initCwd;

  try {
    return await operation();
  } finally {
    if (previous === undefined) delete process.env.INIT_CWD;
    else process.env.INIT_CWD = previous;
  }
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

function childEnv({ initCwd, global = false, homeDir, sddfTarget } = {}) {
  const env = { ...process.env, INIT_CWD: initCwd };
  if (sddfTarget === undefined) delete env.SDDF_TARGET;
  else env.SDDF_TARGET = sddfTarget;

  if (global) {
    env.npm_config_global = 'true';
    env.HOME = homeDir;
    env.USERPROFILE = homeDir;
  } else {
    delete env.npm_config_global;
  }
  return env;
}

function runNode(scriptPath, args, env) {
  return spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    env,
  });
}

function assertSucceeded(result) {
  assert.equal(result.error, undefined, result.error && result.error.message);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
}

function destination(base, runtime, mode) {
  return path.join(base, ...runtime.destinations[mode].rootSegments);
}

function assertNoRuntimeOutput(base, mode = 'local') {
  for (const runtime of RUNTIMES) {
    assert.equal(fs.existsSync(destination(base, runtime, mode)), false, `${runtime.id} wrote during a no-op`);
  }
}

function topLevelEntries(directory) {
  return fs.readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() || entry.isFile())
    .map((entry) => entry.name)
    .sort();
}

test('el mapa de runtimes es la única fuente de targets instalables', () => {
  assert.deepEqual(VALID_TARGETS, RUNTIMES.map((runtime) => runtime.id));
  for (const runtime of RUNTIMES) {
    assert.equal(Array.isArray(runtime.destinations.local.rootSegments), true);
    assert.equal(Array.isArray(runtime.destinations.global.rootSegments), true);
    assert.equal(runtime.layout.skillsDirectory, 'skills');
    assert.equal(runtime.layout.agentsDirectory, 'agents');
  }
  assert.equal(VALID_TARGETS.includes('.agents'), false);
});

test('installSDDF copia el inventario fuente al destino canónico de cada runtime', { concurrency: false }, async (t) => {
  const { projectDir } = createFixture(t);
  const sourceSkills = topLevelEntries(path.join(REPO_ROOT, 'skills'));
  const sourceAgents = topLevelEntries(path.join(REPO_ROOT, 'agents'));

  await withInitCwd(projectDir, () => withoutInstallLogs(async () => {
    for (const runtime of RUNTIMES) {
      const result = await installSDDF({ target: runtime.id });
      const runtimeRoot = destination(projectDir, runtime, 'local');
      assert.equal(result.runtime, runtime.id);
      assert.equal(result.destination, runtimeRoot);
      assert.deepEqual(topLevelEntries(path.join(runtimeRoot, runtime.layout.skillsDirectory)), sourceSkills);
      assert.deepEqual(topLevelEntries(path.join(runtimeRoot, runtime.layout.agentsDirectory)), sourceAgents);
    }
  }));
});

test('installSDDF resuelve destinos globales desde el mapa y no desde un alias de carpeta', { concurrency: false }, async (t) => {
  const { homeDir } = createFixture(t);
  await withoutInstallLogs(async () => {
    for (const runtime of RUNTIMES) {
      const result = await installSDDF({ target: runtime.id, global: true, homeDir });
      assert.equal(result.destination, destination(homeDir, runtime, 'global'));
      assert.equal(fs.existsSync(path.join(result.destination, runtime.layout.skillsDirectory)), true);
      assert.equal(fs.existsSync(path.join(result.destination, runtime.layout.agentsDirectory)), true);
    }
  });
});

test('installSDDF ignora npm_config_global hasta que el operador pasa --global explícitamente', { concurrency: false }, async (t) => {
  const { projectDir, homeDir } = createFixture(t);
  const previousGlobal = process.env.npm_config_global;
  process.env.npm_config_global = 'true';

  try {
    await withInitCwd(projectDir, () => withoutInstallLogs(async () => {
      const result = await installSDDF({ target: 'claude-code', homeDir });
      assert.equal(result.mode, 'local');
      assert.equal(result.destination, path.join(projectDir, '.claude'));
    }));
  } finally {
    if (previousGlobal === undefined) delete process.env.npm_config_global;
    else process.env.npm_config_global = previousGlobal;
  }

  assertNoRuntimeOutput(homeDir, 'global');
});

test('installSDDF rechaza traversal, rutas y compatibilidades no instalables antes de copiar', { concurrency: false }, async (t) => {
  const { root, projectDir } = createFixture(t);
  const invalidTargets = [
    '../escape',
    '..\\escape',
    '.claude/../../escape',
    path.resolve(root, 'absolute-escape'),
    '\\\\server\\share\\escape',
    './opencode',
    '.agents',
    '',
    null,
    42,
  ];

  await withInitCwd(projectDir, () => withoutInstallLogs(async () => {
    for (const target of invalidTargets) {
      await assert.rejects(
        installSDDF({ target, force: true }),
        /Invalid installation target/,
      );
    }
  }));

  assertNoRuntimeOutput(projectDir);
  assert.equal(fs.existsSync(path.join(root, 'escape')), false);
  assert.equal(fs.existsSync(path.join(root, 'absolute-escape')), false);
});

test('los aliases declarados siguen resolviendo al runtime canónico sin aceptar .agents', () => {
  const aliases = [
    ['.claude', 'claude-code'],
    ['.opencode', 'opencode'],
    ['.github', 'github-copilot'],
  ];
  for (const [target, runtimeId] of aliases) {
    assert.equal(resolveDestDir({ target, baseDir: REPO_ROOT }).runtime.id, runtimeId);
  }
  assert.throws(() => resolveDestDir({ target: '.agents', baseDir: REPO_ROOT }), /not an installable runtime/);
});

test('postinstall es un no-op incluso con SDDF_TARGET malicioso o modo global', (t) => {
  const { projectDir, homeDir } = createFixture(t);
  const cases = [
    childEnv({ initCwd: projectDir }),
    childEnv({ initCwd: projectDir, sddfTarget: 'claude-code' }),
    childEnv({ initCwd: projectDir, sddfTarget: '../escape' }),
    childEnv({ initCwd: projectDir, sddfTarget: '.agents', global: true, homeDir }),
  ];

  for (const env of cases) {
    const result = runNode(POSTINSTALL_PATH, [], env);
    assertSucceeded(result);
  }

  assertNoRuntimeOutput(projectDir);
  assertNoRuntimeOutput(homeDir, 'global');
});

test('el CLI valida IDs de runtime temprano y conserva la copia explícita', (t) => {
  const { projectDir } = createFixture(t);

  const validResult = runNode(
    CLI_PATH,
    ['install', '--target', 'opencode'],
    childEnv({ initCwd: projectDir }),
  );
  assertSucceeded(validResult);
  assert.equal(fs.existsSync(path.join(projectDir, '.opencode', 'skills')), true);

  const legacyResult = runNode(
    CLI_PATH,
    ['install', '--target', '.agents'],
    childEnv({ initCwd: projectDir }),
  );
  assert.notEqual(legacyResult.status, 0);
  assert.match(legacyResult.stderr, /Invalid --target/);
  assert.equal(fs.existsSync(path.join(projectDir, '.agents')), false);

  const missingValueResult = runNode(
    CLI_PATH,
    ['install', '--target'],
    childEnv({ initCwd: projectDir }),
  );
  assert.notEqual(missingValueResult.status, 0);
  assert.match(missingValueResult.stderr, /Invalid --target/);
});

test('la ayuda del CLI se deriva del contrato y muestra los destinos canónicos', () => {
  const result = runNode(CLI_PATH, ['--help'], childEnv({ initCwd: REPO_ROOT }));
  assertSucceeded(result);
  for (const runtime of RUNTIMES) {
    assert.match(result.stdout, new RegExp(runtime.id));
    assert.match(result.stdout, new RegExp(runtime.destinations.local.rootSegments.join('[/\\\\]')));
  }
});

test('el helper de contención solo acepta un hijo estricto', () => {
  const baseDir = path.resolve(os.tmpdir(), 'agile-sddf-base');

  assert.doesNotThrow(() => {
    assertDestinationContained(baseDir, path.join(baseDir, '.opencode'));
  });
  assert.throws(() => {
    assertDestinationContained(baseDir, baseDir);
  }, /installation base/);
  assert.throws(() => {
    assertDestinationContained(baseDir, path.resolve(baseDir, '..', 'escape'));
  }, /installation base/);
});
