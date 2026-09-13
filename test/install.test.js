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
const {
  installSDDF,
  VALID_FOLDERS,
  assertDestinationContained,
} = require('../scripts/install.js');

function createFixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agile-sddf-install-'));
  const projectDir = path.join(root, 'project');
  fs.mkdirSync(projectDir);

  t.after(() => {
    fs.rmSync(root, { recursive: true, force: true, maxRetries: 3 });
  });

  return { root, projectDir };
}

async function withInitCwd(initCwd, operation) {
  const previous = process.env.INIT_CWD;
  process.env.INIT_CWD = initCwd;

  try {
    return await operation();
  } finally {
    if (previous === undefined) {
      delete process.env.INIT_CWD;
    } else {
      process.env.INIT_CWD = previous;
    }
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

function childEnv({ initCwd, folder, global = false, homeDir } = {}) {
  const env = { ...process.env, INIT_CWD: initCwd };

  if (folder === undefined) {
    delete env.SDDF_TARGET;
  } else {
    env.SDDF_TARGET = folder;
  }

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

function assertNoInstallOutput(root, name) {
  assert.equal(fs.existsSync(path.join(root, name, 'skills')), false);
  assert.equal(fs.existsSync(path.join(root, name, 'agents')), false);
}

test('installSDDF preserves the default and the documented targets', { concurrency: false }, async (t) => {
  const { projectDir } = createFixture(t);

  await withInitCwd(projectDir, () => withoutInstallLogs(async () => {
    await installSDDF();
    assert.equal(fs.existsSync(path.join(projectDir, '.claude', 'skills')), true);
    assert.equal(fs.existsSync(path.join(projectDir, '.claude', 'agents')), true);

    for (const folder of VALID_FOLDERS.filter((value) => value !== '.claude')) {
      await installSDDF({ folder });
      assert.equal(fs.existsSync(path.join(projectDir, folder, 'skills')), true);
      assert.equal(fs.existsSync(path.join(projectDir, folder, 'agents')), true);
    }
  }));
});

test('installSDDF rejects invalid targets before it copies files', { concurrency: false }, async (t) => {
  const { root, projectDir } = createFixture(t);
  const invalidTargets = [
    '../escape',
    '..\\escape',
    '.claude/../../escape',
    path.resolve(root, 'absolute-escape'),
    '\\\\server\\share\\escape',
    './.agents',
    '.claude/',
    '',
    null,
    42,
  ];

  await withInitCwd(projectDir, () => withoutInstallLogs(async () => {
    for (const folder of invalidTargets) {
      await assert.rejects(
        installSDDF({ folder, force: true }),
        /Invalid installation target\. Valid values: \.claude, \.agents, \.github/,
      );
    }
  }));

  assertNoInstallOutput(root, 'escape');
  assertNoInstallOutput(root, 'absolute-escape');
});

test('postinstall uses the same target contract', (t) => {
  const { root, projectDir } = createFixture(t);
  const emptyTargetProject = path.join(root, 'empty-target-project');
  fs.mkdirSync(emptyTargetProject);

  const defaultResult = runNode(POSTINSTALL_PATH, [], childEnv({ initCwd: projectDir }));
  assertSucceeded(defaultResult);
  assert.equal(fs.existsSync(path.join(projectDir, '.claude', 'skills')), true);

  const validResult = runNode(
    POSTINSTALL_PATH,
    [],
    childEnv({ initCwd: projectDir, folder: '.agents' }),
  );
  assertSucceeded(validResult);
  assert.equal(fs.existsSync(path.join(projectDir, '.agents', 'agents')), true);

  const maliciousResult = runNode(
    POSTINSTALL_PATH,
    [],
    childEnv({ initCwd: projectDir, folder: '../escape' }),
  );
  assert.notEqual(maliciousResult.status, 0);
  assert.match(maliciousResult.stderr, /SDDF postinstall failed:/);
  assertNoInstallOutput(root, 'escape');

  const emptyTargetResult = runNode(
    POSTINSTALL_PATH,
    [],
    childEnv({ initCwd: emptyTargetProject, folder: '' }),
  );
  assert.notEqual(emptyTargetResult.status, 0);
  assert.match(emptyTargetResult.stderr, /SDDF postinstall failed:/);
  assert.equal(fs.existsSync(path.join(emptyTargetProject, '.claude', 'skills')), false);
});

test('global postinstall stays inside the configured home directory', (t) => {
  const { root, projectDir } = createFixture(t);
  const homeDir = path.join(root, 'home');
  fs.mkdirSync(homeDir);

  const validResult = runNode(
    POSTINSTALL_PATH,
    [],
    childEnv({ initCwd: projectDir, folder: '.github', global: true, homeDir }),
  );
  assertSucceeded(validResult);
  assert.equal(fs.existsSync(path.join(homeDir, '.github', 'skills')), true);

  const maliciousResult = runNode(
    POSTINSTALL_PATH,
    [],
    childEnv({ initCwd: projectDir, folder: '../escape', global: true, homeDir }),
  );
  assert.notEqual(maliciousResult.status, 0);
  assert.match(maliciousResult.stderr, /SDDF postinstall failed:/);
  assertNoInstallOutput(root, 'escape');
});

test('CLI keeps its early validation and rejects a missing target value', (t) => {
  const { root, projectDir } = createFixture(t);

  const traversalResult = runNode(
    CLI_PATH,
    ['install', '--target', '../escape'],
    childEnv({ initCwd: projectDir }),
  );
  assert.notEqual(traversalResult.status, 0);
  assert.match(traversalResult.stderr, /Invalid --target/);

  const missingValueResult = runNode(
    CLI_PATH,
    ['install', '--target'],
    childEnv({ initCwd: projectDir }),
  );
  assert.notEqual(missingValueResult.status, 0);
  assert.match(missingValueResult.stderr, /Invalid --target/);
  assertNoInstallOutput(root, 'escape');
});

test('containment helper only accepts a strict child path', () => {
  const baseDir = path.resolve(os.tmpdir(), 'agile-sddf-base');

  assert.doesNotThrow(() => {
    assertDestinationContained(baseDir, path.join(baseDir, '.agents'));
  });
  assert.throws(() => {
    assertDestinationContained(baseDir, baseDir);
  }, /installation base/);
  assert.throws(() => {
    assertDestinationContained(baseDir, path.resolve(baseDir, '..', 'escape'));
  }, /installation base/);
});
