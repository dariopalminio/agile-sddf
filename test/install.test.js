'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { PassThrough } = require('node:stream');
const test = require('node:test');

const REPO_ROOT = path.resolve(__dirname, '..');
const POSTINSTALL_PATH = path.join(REPO_ROOT, 'scripts', 'postinstall.js');
const CLI_PATH = path.join(REPO_ROOT, 'scripts', 'cli.js');
const { loadRuntimeContract, installsAgents } = require('../scripts/runtime-contract.js');
const {
  installSDDF,
  resolveDestDir,
  resolveInstallStrategy,
  promptStrategySelection,
  VALID_TARGETS,
  VALID_STRATEGIES,
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

function epicSkillNames() {
  return topLevelEntries(path.join(REPO_ROOT, 'skills')).filter((name) => name.startsWith('epic-'));
}

test('el mapa de runtimes es la única fuente de targets instalables', () => {
  assert.deepEqual(VALID_TARGETS, RUNTIMES.map((runtime) => runtime.id));
  for (const runtime of RUNTIMES) {
    assert.equal(Array.isArray(runtime.destinations.local.rootSegments), true);
    assert.equal(Array.isArray(runtime.destinations.global.rootSegments), true);
    assert.equal(runtime.layout.skillsDirectory, 'skills');
    if (installsAgents(runtime)) {
      assert.equal(runtime.layout.agentsDirectory, 'agents');
      assert.equal(runtime.layout.agentFileExtensions.length > 0, true);
    } else {
      assert.equal(runtime.layout.agentsDirectory, null);
      assert.deepEqual(runtime.layout.agentFileExtensions, []);
    }
  }
  assert.equal(VALID_TARGETS.includes('.agents'), false);
});

test('installSDDF copia el inventario fuente al destino canónico de cada runtime', { concurrency: false }, async (t) => {
  const { projectDir } = createFixture(t);
  const sourceSkills = topLevelEntries(path.join(REPO_ROOT, 'skills'));
  const sourceAgentsDir = path.join(REPO_ROOT, 'agents');
  const hasSourceAgents = fs.existsSync(sourceAgentsDir);
  const sourceAgents = hasSourceAgents ? topLevelEntries(sourceAgentsDir) : [];

  await withInitCwd(projectDir, () => withoutInstallLogs(async () => {
    for (const runtime of RUNTIMES) {
      const result = await installSDDF({ target: runtime.id });
      const runtimeRoot = destination(projectDir, runtime, 'local');
      assert.equal(result.runtime, runtime.id);
      assert.equal(result.destination, runtimeRoot);
      assert.deepEqual(topLevelEntries(path.join(runtimeRoot, runtime.layout.skillsDirectory)), sourceSkills);
      if (installsAgents(runtime) && !hasSourceAgents) {
        assert.deepEqual(result.agents, { installed: 0, skipped: 0 });
        assert.equal(fs.existsSync(path.join(runtimeRoot, runtime.layout.agentsDirectory)), false);
      } else if (installsAgents(runtime)) {
        assert.deepEqual(topLevelEntries(path.join(runtimeRoot, runtime.layout.agentsDirectory)), sourceAgents);
      } else {
        assert.deepEqual(result.agents, { installed: 0, skipped: 0 });
        assert.equal(fs.existsSync(path.join(runtimeRoot, 'agents')), false);
      }
    }
  }));
});

test('epic-validate se empaqueta y se instala con su SKILL.md en cada runtime soportado (STORY-127 AC-3, CS-8)', { concurrency: false }, async (t) => {
  const { projectDir } = createFixture(t);
  const sourceSkill = path.join(REPO_ROOT, 'skills', 'epic-validate', 'SKILL.md');
  assert.equal(fs.existsSync(sourceSkill), true, 'skills/epic-validate/SKILL.md no existe en la fuente');

  const { files } = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8'));
  const covered = files.some((entry) => ['skills', 'skills/epic-validate'].includes(entry.replace(/\/+$/, '')));
  assert.equal(covered, true, `ninguna entrada de package.json › files cubre skills/epic-validate/: ${files.join(', ')}`);

  const expected = fs.readFileSync(sourceSkill);
  await withInitCwd(projectDir, () => withoutInstallLogs(async () => {
    for (const runtime of RUNTIMES) {
      await installSDDF({ target: runtime.id });
      const installed = path.join(
        destination(projectDir, runtime, 'local'), runtime.layout.skillsDirectory, 'epic-validate', 'SKILL.md',
      );
      assert.equal(fs.existsSync(installed), true, `${runtime.id} no recibió epic-validate/SKILL.md`);
      assert.deepEqual(fs.readFileSync(installed), expected, `${runtime.id} instaló un epic-validate/SKILL.md distinto de la fuente`);
    }
  }));
});

test('installSDDF resuelve destinos globales desde el mapa y no desde un alias de carpeta', { concurrency: false }, async (t) => {
  const { homeDir } = createFixture(t);
  const hasSourceAgents = fs.existsSync(path.join(REPO_ROOT, 'agents'));
  await withoutInstallLogs(async () => {
    for (const runtime of RUNTIMES) {
      const result = await installSDDF({ target: runtime.id, global: true, homeDir });
      assert.equal(result.destination, destination(homeDir, runtime, 'global'));
      assert.equal(fs.existsSync(path.join(result.destination, runtime.layout.skillsDirectory)), true);
      if (installsAgents(runtime) && !hasSourceAgents) {
        assert.deepEqual(result.agents, { installed: 0, skipped: 0 });
        assert.equal(fs.existsSync(path.join(result.destination, runtime.layout.agentsDirectory)), false);
      } else if (installsAgents(runtime)) {
        assert.equal(fs.existsSync(path.join(result.destination, runtime.layout.agentsDirectory)), true);
      } else {
        assert.deepEqual(result.agents, { installed: 0, skipped: 0 });
        assert.equal(fs.existsSync(path.join(result.destination, 'agents')), false);
      }
    }
  });
});

test('installSDDF instala Codex solo en .agents/skills', { concurrency: false }, async (t) => {
  const { projectDir, homeDir } = createFixture(t);
  const codex = RUNTIMES.find((runtime) => runtime.id === 'codex');
  assert.ok(codex);

  await withInitCwd(projectDir, () => withoutInstallLogs(async () => {
    const local = await installSDDF({ target: 'codex' });
    assert.equal(local.destination, path.join(projectDir, '.agents'));
    assert.equal(fs.existsSync(path.join(local.destination, 'skills')), true);
    assert.equal(fs.existsSync(path.join(local.destination, 'agents')), false);
    assert.equal(fs.existsSync(path.join(projectDir, '.codex', 'agents')), false);
    assert.deepEqual(local.agents, { installed: 0, skipped: 0 });

    const global = await installSDDF({ target: 'codex', global: true, homeDir });
    assert.equal(global.destination, path.join(homeDir, '.agents'));
    assert.equal(fs.existsSync(path.join(global.destination, 'skills')), true);
    assert.equal(fs.existsSync(path.join(global.destination, 'agents')), false);
    assert.equal(fs.existsSync(path.join(homeDir, '.codex', 'agents')), false);
    assert.deepEqual(global.agents, { installed: 0, skipped: 0 });
  }));
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

  const codexResult = runNode(
    CLI_PATH,
    ['install', '--target', 'codex'],
    childEnv({ initCwd: projectDir }),
  );
  assertSucceeded(codexResult);
  assert.equal(fs.existsSync(path.join(projectDir, '.agents', 'skills')), true);
  assert.equal(fs.existsSync(path.join(projectDir, '.agents', 'agents')), false);

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
  assert.match(result.stdout, /--strategy/);
  assert.match(result.stdout, /full/);
  assert.match(result.stdout, /story/);
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

test('resolveInstallStrategy usa full por defecto y rechaza valores fuera del catálogo', () => {
  assert.deepEqual(VALID_STRATEGIES, ['full', 'story']);
  assert.equal(resolveInstallStrategy(undefined), 'full');
  assert.equal(resolveInstallStrategy('full'), 'full');
  assert.equal(resolveInstallStrategy('story'), 'story');
  assert.throws(() => resolveInstallStrategy('epic'), /Invalid strategy "epic"\. Valid strategies: full, story/);
  assert.throws(() => resolveInstallStrategy(''), /Invalid strategy ""\. Valid strategies: full, story/);
});

test('installSDDF con estrategia story omite los skills epic-* y copia el resto', { concurrency: false }, async (t) => {
  const { projectDir } = createFixture(t);
  const epicSkills = epicSkillNames();
  const expected = topLevelEntries(path.join(REPO_ROOT, 'skills')).filter((name) => !name.startsWith('epic-'));
  assert.ok(epicSkills.length > 0, 'la fuente debe tener skills epic-* para que la prueba sea significativa');

  await withInitCwd(projectDir, () => withoutInstallLogs(async () => {
    const result = await installSDDF({ strategy: 'story', target: 'claude-code' });
    const installed = topLevelEntries(path.join(projectDir, '.claude', 'skills'));
    assert.deepEqual(installed, expected);
    assert.equal(installed.some((name) => name.startsWith('epic-')), false);
    assert.equal(result.strategy, 'story');
    assert.equal(result.skills.excluded, epicSkills.length);
  }));
});

test('installSDDF con estrategia full o sin estrategia instala el catálogo completo', { concurrency: false }, async (t) => {
  const sourceSkills = topLevelEntries(path.join(REPO_ROOT, 'skills'));

  for (const options of [{ strategy: 'full' }, {}]) {
    const { projectDir } = createFixture(t);
    await withInitCwd(projectDir, () => withoutInstallLogs(async () => {
      const result = await installSDDF({ ...options, target: 'claude-code' });
      assert.deepEqual(topLevelEntries(path.join(projectDir, '.claude', 'skills')), sourceSkills);
      assert.equal(result.strategy, 'full');
      assert.equal(result.skills.excluded, 0);
    }));
  }
});

test('installSDDF con story y --force deja intactos los epic-* previos, local y global', { concurrency: false }, async (t) => {
  const { projectDir, homeDir } = createFixture(t);
  const claude = RUNTIMES.find((runtime) => runtime.id === 'claude-code');
  const sentinel = 'contenido previo del usuario\n';
  const cases = [
    { base: projectDir, mode: 'local', options: {} },
    { base: homeDir, mode: 'global', options: { global: true, homeDir } },
  ];

  await withInitCwd(projectDir, () => withoutInstallLogs(async () => {
    for (const { base, mode, options } of cases) {
      const epicFile = path.join(destination(base, claude, mode), 'skills', 'epic-analyze', 'SKILL.md');
      fs.mkdirSync(path.dirname(epicFile), { recursive: true });
      fs.writeFileSync(epicFile, sentinel);

      const result = await installSDDF({ ...options, target: 'claude-code', strategy: 'story', force: true });
      assert.equal(result.mode, mode);
      assert.equal(result.destination, destination(base, claude, mode));
      assert.equal(fs.readFileSync(epicFile, 'utf8'), sentinel);
      assert.equal(fs.existsSync(path.join(result.destination, 'skills', 'story-plan')), true);
    }
  }));
});

test('promptStrategySelection elige por número y cae a full ante vacío o inválido', async () => {
  const cases = [['2\n', 'story'], ['\n', 'full'], ['9\n', 'full']];

  for (const [answer, expected] of cases) {
    const input = new PassThrough();
    const output = new PassThrough();
    let written = '';
    output.on('data', (chunk) => { written += chunk; });

    const selection = promptStrategySelection({ input, output });
    input.end(answer);
    assert.equal(await selection, expected);
    assert.match(written, /full/);
    assert.match(written, /story/);
  }
});

test('el CLI instala con --strategy story sin skills epic-* y lo indica en el resumen', (t) => {
  const { projectDir } = createFixture(t);
  const result = runNode(
    CLI_PATH,
    ['install', '--strategy', 'story', '--target', 'claude-code'],
    childEnv({ initCwd: projectDir }),
  );
  assertSucceeded(result);
  const installed = topLevelEntries(path.join(projectDir, '.claude', 'skills'));
  assert.equal(installed.some((name) => name.startsWith('epic-')), false);
  assert.match(result.stdout, /strategy story/);
});

test('el CLI sin --strategy y sin TTY usa full e instala el catálogo completo', (t) => {
  const { projectDir } = createFixture(t);
  const result = runNode(CLI_PATH, ['install', '--target', 'claude-code'], childEnv({ initCwd: projectDir }));
  assertSucceeded(result);
  assert.deepEqual(
    topLevelEntries(path.join(projectDir, '.claude', 'skills')),
    topLevelEntries(path.join(REPO_ROOT, 'skills')),
  );
  assert.match(result.stdout, /strategy full/);
});

test('el CLI rechaza --strategy inválido o sin valor antes de escribir', (t) => {
  const { projectDir } = createFixture(t);
  const cases = [
    ['install', '--strategy', 'epic'],
    ['install', '--strategy'],
    ['install', '--strategy', '--force'],
  ];

  for (const args of cases) {
    const result = runNode(CLI_PATH, args, childEnv({ initCwd: projectDir }));
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Invalid --strategy/);
    assert.match(result.stderr, /full, story/);
    if (args[2] === 'epic') assert.match(result.stderr, /"epic"/);
  }

  assertNoRuntimeOutput(projectDir);
});
