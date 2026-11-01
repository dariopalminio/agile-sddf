'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { EventEmitter } = require('node:events');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const {
  buildClaudeArgs,
  buildCodexArgs,
  buildOpenCodeArgs,
  buildPrompt,
  main,
  parseArgs,
  resolveContainedPath,
  runCodex,
  runOpenCode,
  openCodeInvocation,
} = require('../scripts/run-evals.js');

function createFixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agile-sddf-run-evals-'));
  t.after(() => {
    fs.rmSync(root, { recursive: true, force: true, maxRetries: 3 });
  });
  return { root };
}

function makeCase(id, name = id) {
  return {
    id,
    name,
    type: 'UT',
    description: `Fixture determinista para ${id}.`,
    input: {},
    expected: { contains: [] },
  };
}

function writeSkill(fixture, name, cases = [makeCase('TC-001')]) {
  const skillDir = path.join(fixture.root, 'skills', name);
  fs.mkdirSync(path.join(skillDir, 'evals'), { recursive: true });
  fs.writeFileSync(path.join(skillDir, 'SKILL.md'), `# ${name}\n`);
  fs.writeFileSync(
    path.join(skillDir, 'evals', 'evals.json'),
    `${JSON.stringify({ cases }, null, 2)}\n`,
  );
  return skillDir;
}

function writeEvals(fixture, name, contents) {
  const evalsPath = path.join(fixture.root, 'skills', name, 'evals', 'evals.json');
  fs.mkdirSync(path.dirname(evalsPath), { recursive: true });
  fs.writeFileSync(evalsPath, contents);
}

function runGit(fixture, args) {
  const result = spawnSync('git', args, { cwd: fixture.root, encoding: 'utf8' });
  assert.equal(result.error, undefined, result.error && result.error.message);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  return (result.stdout || '').trim();
}

function commitAll(fixture, message) {
  runGit(fixture, ['add', '--all']);
  runGit(fixture, [
    '-c',
    'user.email=evals@example.test',
    '-c',
    'user.name=Eval Runner Tests',
    'commit',
    '-m',
    message,
  ]);
  return runGit(fixture, ['rev-parse', 'HEAD']);
}

function initializeGit(fixture) {
  runGit(fixture, ['init']);
  return commitAll(fixture, 'fixture inicial');
}

async function runRunner(fixture, args, { runClaude, runCodex: runCodexStub, runOpenCode: runOpenCodeStub, tmpRoot } = {}) {
  const messages = [];
  const claudeCalls = [];
  const codexCalls = [];
  const openCodeCalls = [];
  const capture = (...values) => {
    messages.push(values.map((value) => String(value)).join(' '));
  };
  const fakeClaude = async () => ({
    ok: true,
    code: 0,
    stdout: '=== END ===',
    stderr: '',
    durationMs: 0,
    timedOut: false,
  });
  const selectedRunClaude = runClaude || fakeClaude;
  const selectedRunCodex = runCodexStub || fakeClaude;
  const selectedTmpRoot = tmpRoot === undefined
    ? path.join(fixture.root, '.tmp', 'skill-test-evals')
    : tmpRoot;
  const code = await main(args, {
    repoRoot: fixture.root,
    tmpRoot: selectedTmpRoot,
    log: capture,
    error: capture,
    write: capture,
    runClaude: async (...values) => {
      claudeCalls.push(values);
      return selectedRunClaude(...values);
    },
    runCodex: async (...values) => {
      codexCalls.push(values);
      return selectedRunCodex(...values);
    },
    runOpenCode: async (...values) => {
      openCodeCalls.push(values);
      return (runOpenCodeStub || fakeClaude)(...values);
    },
  });
  return { code, output: messages.join('\n'), claudeCalls, codexCalls, openCodeCalls };
}

function assertExit(result, expectedStatus) {
  assert.equal(result.code, expectedStatus, result.output);
}

function assertPreflightFailure(result) {
  assertExit(result, 1);
  assert.doesNotMatch(result.output, /----- TC-\d+/, result.output);
}

function assertNoRunArtifacts(fixture, tmpRoot = path.join(fixture.root, '.tmp', 'skill-test-evals')) {
  assert.equal(fs.existsSync(tmpRoot), false, `No deben crearse artefactos temporales en ${tmpRoot}`);
}

test('parsea el selector de runner y aplica modelos predeterminados por ejecutor', () => {
  const claude = parseArgs([], {});
  assert.equal(claude.evalRunner, 'claude');
  assert.equal(claude.model, 'sonnet');

  const codex = parseArgs(['--eval-runner', 'codex'], {});
  assert.equal(codex.evalRunner, 'codex');
  assert.equal(codex.model, null, 'Codex no debe recibir el modelo por defecto de Claude');

  assert.equal(parseArgs(['--eval-runner', 'opencode'], {}).model, null);
  const openCode = parseArgs([], {
    SDDF_EVAL_RUNNER: 'opencode',
    SDDF_EVAL_OPENCODE_MODEL: 'proveedor/modelo',
    SDDF_EVAL_MODEL: 'modelo-claude',
    SDDF_EVAL_CODEX_MODEL: 'modelo-codex',
  });
  assert.equal(openCode.evalRunner, 'opencode');
  assert.equal(openCode.model, 'proveedor/modelo');
  assert.equal(parseArgs(['--eval-runner', 'opencode', '--model', 'otro/modelo'], {
    SDDF_EVAL_OPENCODE_MODEL: 'proveedor/modelo',
  }).model, 'otro/modelo');

  const codexFromEnv = parseArgs([], {
    SDDF_EVAL_RUNNER: 'codex',
    SDDF_EVAL_CODEX_MODEL: 'modelo-codex-prueba',
  });
  assert.equal(codexFromEnv.evalRunner, 'codex');
  assert.equal(codexFromEnv.model, 'modelo-codex-prueba');

  const cliWinsOverEnvironment = parseArgs(['--eval-runner', 'claude'], {
    SDDF_EVAL_RUNNER: 'codex',
    SDDF_EVAL_MODEL: 'modelo-claude-prueba',
  });
  assert.equal(cliWinsOverEnvironment.evalRunner, 'claude');
  assert.equal(cliWinsOverEnvironment.model, 'modelo-claude-prueba');

  const explicitModel = parseArgs(['--eval-runner', 'codex', '--model', 'modelo-explicito'], {});
  assert.equal(explicitModel.model, 'modelo-explicito');

  assert.throws(() => parseArgs(['--eval-runner'], {}), /falta valor/i);
  assert.throws(() => parseArgs(['--eval-runner', 'otro'], {}), /runner.*admitido|válidos/i);
  assert.throws(() => parseArgs(['--eval-runner', 'claude', '--eval-runner', 'codex'], {}), /solo puede/i);
  assert.throws(() => parseArgs([], { SDDF_EVAL_RUNNER: 'otro' }), /runner.*admitido|válidos/i);
  assert.equal(parseArgs(['--help'], { SDDF_EVAL_RUNNER: 'otro' }).help, true);
});

test('los adaptadores construyen invocaciones restringidas para Claude y Codex', () => {
  assert.deepEqual(buildClaudeArgs('prompt de prueba', { model: 'modelo-claude' }), [
    '-p',
    'prompt de prueba',
    '--model',
    'modelo-claude',
    '--output-format',
    'text',
    '--permission-mode',
    'plan',
    '--allowedTools',
    'Read,Glob,Grep',
  ]);
  assert.deepEqual(buildCodexArgs({ model: null }, 'salida.txt'), [
    'exec',
    '--sandbox',
    'read-only',
    '--ephemeral',
    '--color',
    'never',
    '--output-last-message',
    'salida.txt',
    '-',
  ]);
  assert.deepEqual(buildCodexArgs({ model: 'modelo-codex' }, 'salida.txt'), [
    'exec',
    '--sandbox',
    'read-only',
    '--ephemeral',
    '--color',
    'never',
    '--output-last-message',
    'salida.txt',
    '--model',
    'modelo-codex',
    '-',
  ]);
});

test('el adaptador Codex envía el prompt por stdin y usa la última respuesta como salida', async (t) => {
  const fixture = createFixture(t);
  const tmpRoot = path.join(fixture.root, '.tmp', 'skill-test-evals');
  const outputFile = path.join(tmpRoot, 'alpha', 'runs', 'TC-001.txt');
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  const invocation = {};
  let stdin = '';

  const result = await runCodex('prompt de prueba', { model: null, timeout: 1 }, {
    repoRoot: fixture.root,
    tmpRoot,
    codexOutputFile: outputFile,
    spawn(command, args, options) {
      invocation.command = command;
      invocation.args = args;
      invocation.options = options;
      const child = new EventEmitter();
      child.stdout = new EventEmitter();
      child.stderr = new EventEmitter();
      child.stdin = new EventEmitter();
      child.stdin.end = (value) => {
        stdin = value;
        process.nextTick(() => {
          fs.writeFileSync(outputFile, '=== CONSOLE ===\nrespuesta de Codex\n=== END ===');
          child.emit('close', 0);
        });
      };
      child.kill = () => true;
      return child;
    },
  });

  assert.equal(result.ok, true, result.stderr);
  assert.equal(result.stdout, '=== CONSOLE ===\nrespuesta de Codex\n=== END ===');
  assert.equal(stdin, 'prompt de prueba');
  assert.equal(invocation.command, 'codex');
  assert.equal(invocation.options.cwd, fixture.root);
  assert.deepEqual(invocation.options.stdio, ['pipe', 'pipe', 'pipe']);
  assert.deepEqual(invocation.args, buildCodexArgs({ model: null }, outputFile));
});

test('el adaptador Codex rechaza un archivo temporal fuera de su raíz', (t) => {
  const fixture = createFixture(t);
  const tmpRoot = path.join(fixture.root, '.tmp', 'skill-test-evals');
  const outsideFile = path.join(fixture.root, 'no-tocar.txt');
  fs.writeFileSync(outsideFile, 'conservar');

  assert.throws(
    () => runCodex('prompt de prueba', { model: null, timeout: 1 }, {
      repoRoot: fixture.root,
      tmpRoot,
      codexOutputFile: outsideFile,
    }),
    /contenido bajo/i,
  );
  assert.equal(fs.readFileSync(outsideFile, 'utf8'), 'conservar');
});

test('el adaptador Codex falla cerrado si no puede enviar el prompt por stdin', async (t) => {
  const fixture = createFixture(t);
  const tmpRoot = path.join(fixture.root, '.tmp', 'skill-test-evals');
  const outputFile = path.join(tmpRoot, 'alpha', 'runs', 'TC-001.txt');
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });

  const result = await runCodex('prompt de prueba', { model: null, timeout: 1 }, {
    repoRoot: fixture.root,
    tmpRoot,
    codexOutputFile: outputFile,
    spawn() {
      const child = new EventEmitter();
      child.stdout = new EventEmitter();
      child.stderr = new EventEmitter();
      child.stdin = new EventEmitter();
      child.stdin.end = () => {
        process.nextTick(() => {
          child.stdin.emit('error', new Error('stdin no disponible'));
          child.emit('close', 0);
        });
      };
      child.kill = () => true;
      return child;
    },
  });

  assert.equal(result.ok, false);
  assert.equal(result.code, 0);
  assert.match(result.stderr, /stdin no disponible/);
});

test('Codex se selecciona sin invocar Claude y queda registrado en el informe', async (t) => {
  const fixture = createFixture(t);
  writeSkill(fixture, 'alpha');

  const result = await runRunner(fixture, ['alpha', '--eval-runner', 'codex']);

  assertExit(result, 0);
  assert.equal(result.claudeCalls.length, 0);
  assert.equal(result.codexCalls.length, 1);
  assert.equal(result.codexCalls[0][1].evalRunner, 'codex');
  assert.match(result.output, /Ejecutor de eval: codex/);
  assert.match(result.output, /\*\*Ejecutor:\*\* codex/);
});

test('Claude sigue siendo el runner predeterminado', async (t) => {
  const fixture = createFixture(t);
  writeSkill(fixture, 'alpha');

  const result = await runRunner(fixture, ['alpha']);

  assertExit(result, 0);
  assert.equal(result.claudeCalls.length, 1);
  assert.equal(result.codexCalls.length, 0);
  assert.equal(result.claudeCalls[0][1].evalRunner, 'claude');
});

test('OpenCode se selecciona y se registra en el informe sin invocar otros runners', async (t) => {
  const fixture = createFixture(t);
  writeSkill(fixture, 'alpha');
  const result = await runRunner(fixture, ['alpha', '--eval-runner', 'opencode', '--report']);
  assertExit(result, 0);
  assert.equal(result.claudeCalls.length, 0);
  assert.equal(result.codexCalls.length, 0);
  assert.equal(result.openCodeCalls.length, 1);
  assert.match(result.output, /Ejecutor de eval: opencode/);
  const report = fs.readdirSync(path.join(fixture.root, '.tmp', 'skill-test-evals', 'alpha'))
    .find((name) => name.startsWith('report-'));
  assert.match(fs.readFileSync(path.join(fixture.root, '.tmp', 'skill-test-evals', 'alpha', report), 'utf8'), /\*\*Ejecutor:\*\* opencode/);
});

test('dry-run con OpenCode no invoca runners ni crea artefactos', async (t) => {
  const fixture = createFixture(t);
  writeSkill(fixture, 'alpha');
  const result = await runRunner(fixture, ['alpha', '--eval-runner', 'opencode', '--dry-run']);
  assertExit(result, 0);
  assert.equal(result.claudeCalls.length + result.codexCalls.length + result.openCodeCalls.length, 0);
  assertNoRunArtifacts(fixture);
});

test('el prompt de simulación separa los artefactos declarados del filesystem real', () => {
  const testCase = {
    ...makeCase('TC-001'),
    description: 'El archivo existe en specs/flow/EPIC-01-mvp/epic.md.',
    input: {
      input_path: 'specs/flow/EPIC-01-mvp/epic.md',
      epic_content: '# Épica simulada',
      template_path: 'docs/templates/epic-template.md',
      template_content: '## Sección simulada',
    },
    expected: { contains: ['EXPECTATIVA_PRIVADA'] },
  };
  const prompt = buildPrompt('epic-format-validation', 'skills/epic-format-validation/SKILL.md', testCase);
  assert.ok(prompt.includes(testCase.description));
  assert.ok(prompt.includes(JSON.stringify(testCase.input, null, 2)));
  assert.match(prompt, /NO las busques ni compruebes su existencia en el filesystem real/);
  assert.match(prompt, /El contenido proporcionado por el escenario tiene prioridad/);
  assert.match(prompt, /Si el escenario declara un archivo ausente, permanece ausente/);
  assert.match(prompt, /NO modifiques ningún archivo/);
  assert.ok(!prompt.includes('EXPECTATIVA_PRIVADA'));
});

test('los escenarios iniciales de epic-format-validation incluyen épica y template independientes del repo', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'skills', 'epic-format-validation', 'evals', 'evals.json'), 'utf8'));
  for (const id of ['TC-001', 'TC-003', 'TC-004', 'TC-005']) {
    const { input } = manifest.cases.find((entry) => entry.id === id);
    assert.equal(input.template_path, 'docs/templates/epic-template.md', id);
    assert.ok(input.template_content.includes('clave: historias'), id);
    assert.ok(input.epic_content.includes('## Historias') || id === 'TC-003', id);
  }
  const missing = manifest.cases.find((entry) => entry.id === 'TC-002');
  assert.equal(missing.input.epic_content, undefined);
});

// Simula el protocolo del CLI, sin ejecutar modelos ni consumir cuota.
function openCodeProcess(events, { code = 0, error, stdinError, timeout = false } = {}) {
  return (command, args, options) => {
    const child = new EventEmitter();
    child.stdout = new EventEmitter();
    child.stderr = new EventEmitter();
    child.stdin = new EventEmitter();
    child.stdin.end = (input) => {
      child.input = input;
      process.nextTick(() => {
        if (error) return child.emit('error', new Error(error));
        if (stdinError) child.stdin.emit('error', new Error(stdinError));
        child.stdout.emit('data', events);
        if (!timeout) child.emit('close', code);
      });
    };
    child.kill = () => { child.emit('close', null); return true; };
    child.invocation = { command, args, options };
    return child;
  };
}

test('OpenCode envía stdin, extrae solo texto JSON y aplica permisos sin mutar el entorno', async (t) => {
  const fixture = createFixture(t);
  const events = [
    { type: 'step_start', part: {} },
    { type: 'tool_use', part: { state: { output: 'no calificar este texto' } } },
    { type: 'text', part: { text: '=== CONSOLE ===\n' } },
    { type: 'text', part: { text: 'respuesta\n=== END ===' } },
    { type: 'step_finish', part: {} },
  ].map((event) => JSON.stringify(event)).join('\n');
  const env = {
    PATH: '', OPENCODE_PERMISSION: '{"*":"allow"}',
    OPENCODE_CONFIG_CONTENT: JSON.stringify({ model: 'p/configurado', provider: { p: {} } }),
  };
  let child;
  const result = await runOpenCode('prompt con "comillas"\ny líneas', { model: 'p/m', timeout: 1 }, {
    repoRoot: fixture.root,
    env,
    spawn(...args) { child = openCodeProcess(events)(...args); return child; },
  });
  assert.equal(result.ok, true, result.stderr);
  assert.equal(result.stdout, '=== CONSOLE ===\nrespuesta\n=== END ===');
  assert.equal(child.input, 'prompt con "comillas"\ny líneas');
  assert.deepEqual(child.invocation.args, buildOpenCodeArgs({ model: 'p/m' }));
  assert.equal(child.invocation.options.cwd, fixture.root);
  assert.deepEqual(child.invocation.options.stdio, ['pipe', 'pipe', 'pipe']);
  const config = JSON.parse(child.invocation.options.env.OPENCODE_CONFIG_CONTENT);
  assert.equal(config.agent['sddf-eval'].permission['*'], 'deny');
  assert.equal(config.agent['sddf-eval'].permission.read, 'allow');
  assert.equal(config.agent['sddf-eval'].permission.edit, 'deny');
  assert.equal(config.share, 'disabled');
  assert.equal(config.model, 'p/configurado');
  assert.deepEqual(config.provider, { p: {} });
  assert.equal(env.OPENCODE_PERMISSION, '{"*":"allow"}');
});

test('OpenCode usa JSON y un agente propio sin forzar modelo ni reutilizar sesiones', () => {
  assert.deepEqual(buildOpenCodeArgs({ model: null }), ['run', '--format', 'json', '--agent', 'sddf-eval']);
  assert.deepEqual(buildOpenCodeArgs({ model: 'p/m' }), ['run', '--format', 'json', '--agent', 'sddf-eval', '--model', 'p/m']);
});

test('OpenCode falla cerrado con errores JSON, respuesta vacía, JSON inválido o fallos del proceso', async (t) => {
  const fixture = createFixture(t);
  const text = JSON.stringify({ type: 'text', part: { text: 'respuesta que parecería aprobar' } });
  for (const [events, options, reason] of [
    [text + '\n' + JSON.stringify({ type: 'error', error: { data: { message: 'proveedor sin autenticar' } } }), {}, /proveedor sin autenticar/],
    [JSON.stringify({ type: 'step_finish', part: {} }), {}, /sin.*respuesta/i],
    [text + '\n{incompleto', {}, /JSON/i],
    [text, { code: 1 }, null],
    ['', { error: 'spawn opencode ENOENT' }, /ENOENT/],
    [text, { stdinError: 'EPIPE' }, /EPIPE/],
    [text, { timeout: true }, null],
  ]) {
    const result = await runOpenCode('p', { timeout: 0.01 }, {
      repoRoot: fixture.root, env: { PATH: '' }, spawn: openCodeProcess(events, options),
    });
    assert.equal(result.ok, false);
    if (reason) assert.match(result.stderr, reason);
    if (options.timeout) assert.equal(result.timedOut, true);
  }
});

test('un fallo de OpenCode con stdout se reporta como ERROR, sin falso PASS', async (t) => {
  const fixture = createFixture(t);
  writeSkill(fixture, 'alpha');
  const result = await runRunner(fixture, ['alpha', '--eval-runner', 'opencode'], {
    runOpenCode: async () => ({ ok: false, code: 0, stdout: '=== END ===', stderr: 'error del proveedor', durationMs: 0, timedOut: false }),
  });
  assertExit(result, 1);
  assert.match(result.output, /ERROR.*opencode exit 0.*error del proveedor/);
});

test('OpenCode en Windows resuelve el binario nativo o el launcher npm sin shell', () => {
  const args = ['run', '--format', 'json'];
  const runtime = { platform: 'win32', nodeExecutable: 'C:\\node\\node.exe', env: { Path: 'C:\\Open Code;C:\\npm' } };
  assert.deepEqual(openCodeInvocation(args, { ...runtime, exists: (p) => p === 'C:\\Open Code\\opencode.exe' }), {
    command: 'C:\\Open Code\\opencode.exe', args,
  });
  const launcher = 'C:\\npm\\node_modules\\opencode-ai\\bin\\opencode';
  assert.deepEqual(openCodeInvocation(args, { ...runtime, exists: (p) => p === launcher }), {
    command: 'C:\\node\\node.exe', args: [launcher, ...args],
  });
  assert.deepEqual(openCodeInvocation(args, { platform: 'linux' }), { command: 'opencode', args });
  const localLauncher = 'C:\\repo\\node_modules\\opencode-ai\\bin\\opencode';
  assert.deepEqual(openCodeInvocation(args, {
    ...runtime, env: { PATH: 'C:\\repo\\node_modules\\.bin' }, exists: (p) => p === localLauncher,
  }), { command: 'C:\\node\\node.exe', args: [localLauncher, ...args] });
});

test('OpenCode en sandbox aplica cwd y permisos edit relativos a la raíz Git', async (t) => {
  const fixture = createFixture(t);
  fs.mkdirSync(path.join(fixture.root, '.git'));
  const sandboxDir = path.join(fixture.root, '.tmp', 'skill-test-evals', 'alpha', 'sandbox', 'TC-001');
  fs.mkdirSync(sandboxDir, { recursive: true });
  let child;
  await runOpenCode('p', { timeout: 1 }, {
    repoRoot: fixture.root, sandboxDir, env: { PATH: '' },
    spawn(...args) {
      child = openCodeProcess(JSON.stringify({ type: 'text', part: { text: 'listo' } }))(...args);
      return child;
    },
  });
  assert.equal(child.invocation.options.cwd, sandboxDir);
  const config = JSON.parse(child.invocation.options.env.OPENCODE_CONFIG_CONTENT);
  const permission = config.agent['sddf-eval'].permission;
  assert.equal(permission['*'], 'deny', 'Shell, MCP y task siguen denegados');
  assert.equal(permission.edit['*'], 'deny');
  assert.equal(permission.edit['.tmp/skill-test-evals/alpha/sandbox/TC-001/*'], 'allow');
  assert.equal(permission.external_directory, 'deny');
});

test('un runner inválido falla antes de ejecutar o crear artefactos', async (t) => {
  const fixture = createFixture(t);
  writeSkill(fixture, 'alpha');

  const result = await runRunner(fixture, ['alpha', '--eval-runner', 'otro']);

  assertPreflightFailure(result);
  assert.match(result.output, /runner.*admitido|válidos/i);
  assert.equal(result.claudeCalls.length, 0);
  assert.equal(result.codexCalls.length, 0);
  assertNoRunArtifacts(fixture);
});

test('dry-run con Codex no invoca ningún runner ni crea artefactos', async (t) => {
  const fixture = createFixture(t);
  writeSkill(fixture, 'alpha');

  const result = await runRunner(fixture, ['--all', '--eval-runner', 'codex', '--dry-run']);

  assertExit(result, 0);
  assert.equal(result.claudeCalls.length, 0);
  assert.equal(result.codexCalls.length, 0);
  assert.match(result.output, /Ejecutor de eval: codex/);
  assertNoRunArtifacts(fixture);
});

test('el helper de contencion rechaza raices vacias, rutas absolutas y escapes lexicos', () => {
  assert.throws(() => resolveContainedPath('', 'alpha'), /ra[ií]z|root/i);
  assert.throws(() => resolveContainedPath('  ', 'alpha'), /ra[ií]z|root/i);
  assert.throws(() => resolveContainedPath('C:\\repo', 'C:\\outside'), /absoluta|contenida|ruta/i);
  assert.throws(() => resolveContainedPath('C:\\repo', '\\\\server\\share\\outside'), /absoluta|contenida|ruta/i);
  assert.throws(() => resolveContainedPath('C:\\repo', '..\\outside'), /escape|contenida|ruta/i);
  assert.throws(() => resolveContainedPath('C:\\repo', '../outside'), /escape|contenida|ruta/i);
  assert.throws(() => resolveContainedPath('C:\\repo', '.'), /ra[ií]z|contenida|ruta/i);
});

test('un arbol limpio sin selector falla cerrado, tambien en dry-run', async (t) => {
  const fixture = createFixture(t);
  writeSkill(fixture, 'alpha');
  initializeGit(fixture);

  for (const args of [[], ['--dry-run']]) {
    const result = await runRunner(fixture, args);
    assertExit(result, 1);
    assert.match(result.output, /seleccion|caso|skill/i);
  }
});

test('--all con un manifest valido planifica al menos un caso en dry-run', async (t) => {
  const fixture = createFixture(t);
  writeSkill(fixture, 'alpha');

  const result = await runRunner(fixture, ['--all', '--dry-run']);

  assertExit(result, 0);
  assert.match(result.output, /Skills a evaluar: alpha/);
  assert.match(result.output, /----- TC-001/);
  assert.equal(result.claudeCalls.length, 0);
});

test('--all sin manifests evaluables falla cerrado', async (t) => {
  const fixture = createFixture(t);

  const result = await runRunner(fixture, ['--all', '--dry-run']);

  assertPreflightFailure(result);
  assert.match(result.output, /seleccion|caso|skill/i);
});

test('los nombres de skill con traversal, rutas absolutas o UNC se rechazan antes de ejecutar', async (t) => {
  const fixture = createFixture(t);
  writeSkill(fixture, 'alpha');

  for (const skill of [
    '../outside',
    '..\\outside',
    path.join(fixture.root, 'outside'),
    '\\\\server\\share\\outside',
  ]) {
    const result = await runRunner(fixture, [skill], {
      runClaude: async () => {
        throw new Error('Claude no debe invocarse con un nombre de skill invalido');
      },
    });

    assertPreflightFailure(result);
    assert.match(result.output, /skill|nombre|invalido/i);
    assert.equal(result.claudeCalls.length, 0);
    assertNoRunArtifacts(fixture);
  }
});

test('--skills-dir solo acepta una ruta relativa contenida bajo repoRoot', async (t) => {
  const fixture = createFixture(t);
  writeSkill(fixture, 'alpha');

  for (const skillsDir of [
    '',
    '../outside',
    '..\\outside',
    path.join(fixture.root, 'outside'),
    '\\\\server\\share\\skills',
  ]) {
    const result = await runRunner(fixture, ['--all', '--skills-dir', skillsDir], {
      runClaude: async () => {
        throw new Error('Claude no debe invocarse con --skills-dir invalido');
      },
    });

    assertPreflightFailure(result);
    assert.match(result.output, /skills-dir|ruta|contenida/i);
    assert.equal(result.claudeCalls.length, 0);
    assertNoRunArtifacts(fixture);
  }
});

test('--only con un ID inexistente falla antes de planificar casos', async (t) => {
  const fixture = createFixture(t);
  writeSkill(fixture, 'alpha');

  const result = await runRunner(fixture, ['alpha', '--only', 'TC-404'], {
    runClaude: async () => {
      throw new Error('Claude no debe invocarse cuando la seleccion es invalida');
    },
  });

  assertPreflightFailure(result);
  assert.match(result.output, /TC-404/);
  assert.equal(result.claudeCalls.length, 0);
});

test('--only parcialmente inexistente aborta antes de ejecutar el ID valido', async (t) => {
  const fixture = createFixture(t);
  writeSkill(fixture, 'alpha', [makeCase('TC-001'), makeCase('TC-002')]);

  const result = await runRunner(fixture, ['alpha', '--only', 'TC-001,TC-404'], {
    runClaude: async () => {
      throw new Error('Claude no debe invocarse cuando la seleccion es invalida');
    },
  });

  assertPreflightFailure(result);
  assert.match(result.output, /TC-404/);
  assert.equal(result.claudeCalls.length, 0);
});

test('--only vacio o solo separadores es un error de argumentos', async (t) => {
  const fixture = createFixture(t);
  writeSkill(fixture, 'alpha');

  for (const only of ['', ',,,']) {
    const result = await runRunner(fixture, ['alpha', '--only', only, '--dry-run']);
    assertPreflightFailure(result);
    assert.match(result.output, /only/i);
  }
});

test('--only rechaza IDs con traversal, separadores o formato distinto de TC-NNN', async (t) => {
  const fixture = createFixture(t);
  writeSkill(fixture, 'alpha');

  for (const only of ['../outside', '..\\outside', 'TC-001/extra', 'TC-12', 'case-001']) {
    const result = await runRunner(fixture, ['alpha', '--only', only], {
      runClaude: async () => {
        throw new Error('Claude no debe invocarse con un ID de --only invalido');
      },
    });

    assertPreflightFailure(result);
    assert.match(result.output, /ID|caso|only|formato/i);
    assert.equal(result.claudeCalls.length, 0);
    assertNoRunArtifacts(fixture);
  }
});

test('--only repetido se rechaza para no ocultar IDs solicitados', async (t) => {
  const fixture = createFixture(t);
  writeSkill(fixture, 'alpha');

  const result = await runRunner(fixture, ['alpha', '--only', 'TC-404', '--only', 'TC-001']);

  assertPreflightFailure(result);
  assert.match(result.output, /only/i);
  assert.equal(result.claudeCalls.length, 0);
});

test('--only se valida sobre la union y no ejecuta skills sin coincidencias', async (t) => {
  const fixture = createFixture(t);
  writeSkill(fixture, 'alpha', [makeCase('TC-001')]);
  writeSkill(fixture, 'beta', [makeCase('TC-002')]);

  const result = await runRunner(fixture, ['--all', '--only', 'TC-001']);

  assertExit(result, 0);
  assert.equal(result.claudeCalls.length, 1);
  assert.match(result.output, /TC-001/);
  assert.doesNotMatch(result.output, /TC-002/);
});

test('--only reutilizado entre manifests ejecuta cada coincidencia', async (t) => {
  const fixture = createFixture(t);
  writeSkill(fixture, 'alpha', [makeCase('TC-001')]);
  writeSkill(fixture, 'beta', [makeCase('TC-001')]);

  const result = await runRunner(fixture, ['--all', '--only', 'TC-001']);

  assertExit(result, 0);
  assert.equal(result.claudeCalls.length, 2);
});

test('un manifest invalido aborta el preflight antes de llamar a Claude', async (t) => {
  const fixture = createFixture(t);
  writeSkill(fixture, 'alpha', [makeCase('TC-001')]);
  writeSkill(fixture, 'beta', [makeCase('TC-002')]);
  writeEvals(fixture, 'beta', '{ no es JSON valido');

  const result = await runRunner(fixture, ['--all'], {
    runClaude: async () => {
      throw new Error('Claude no debe invocarse durante el preflight');
    },
  });

  assertPreflightFailure(result);
  assert.match(result.output, /JSON|evals/i);
  assert.equal(result.claudeCalls.length, 0);
});

test('un manifest con cases[] vacio falla cerrado', async (t) => {
  const fixture = createFixture(t);
  writeSkill(fixture, 'alpha', []);

  const result = await runRunner(fixture, ['--all', '--dry-run']);

  assertPreflightFailure(result);
  assert.match(result.output, /casos|cases/i);
});

test('un manifest con entradas de caso malformadas falla cerrado', async (t) => {
  const fixture = createFixture(t);
  writeSkill(fixture, 'alpha', [false]);

  const result = await runRunner(fixture, ['--all', '--dry-run']);

  assertPreflightFailure(result);
  assert.match(result.output, /caso|evals|manifest/i);
});

test('un manifest rechaza IDs con traversal, separadores o formato no TC-NNN antes de crear artefactos', async (t) => {
  const fixture = createFixture(t);
  const tmpRoot = path.join(fixture.root, '.tmp', 'skill-test-evals');
  const escapedArtifact = path.join(fixture.root, 'outside-artifact.txt');

  for (const id of ['../outside', '..\\outside', 'TC-001/extra', 'TC-12', 'case-001', '../../../../outside-artifact']) {
    writeSkill(fixture, 'alpha', [makeCase(id)]);
    const result = await runRunner(fixture, ['alpha'], {
      runClaude: async () => {
        throw new Error('Claude no debe invocarse cuando el manifest tiene un ID invalido');
      },
    });

    assertPreflightFailure(result);
    assert.match(result.output, /ID|caso|formato|evals/i);
    assert.equal(result.claudeCalls.length, 0);
    assertNoRunArtifacts(fixture, tmpRoot);
    assert.equal(fs.existsSync(escapedArtifact), false, 'Un ID invalido no puede escribir fuera de tmpRoot');
  }
});

test('un manifest rechaza IDs duplicados dentro del mismo skill antes de ejecutar', async (t) => {
  const fixture = createFixture(t);
  writeSkill(fixture, 'alpha', [makeCase('TC-001'), makeCase('TC-001', 'duplicado')]);

  const result = await runRunner(fixture, ['alpha'], {
    runClaude: async () => {
      throw new Error('Claude no debe invocarse cuando hay IDs duplicados');
    },
  });

  assertPreflightFailure(result);
  assert.match(result.output, /duplicad|TC-001/i);
  assert.equal(result.claudeCalls.length, 0);
  assertNoRunArtifacts(fixture);
});

test('los artefactos validos quedan contenidos bajo el tmpRoot inyectado', async (t) => {
  const fixture = createFixture(t);
  writeSkill(fixture, 'alpha');
  const tmpRoot = path.join(fixture.root, 'tmp-inyectado');

  const result = await runRunner(fixture, ['alpha', '--report'], {
    tmpRoot,
    runClaude: async () => ({
      ok: true,
      code: 0,
      stdout: '=== END ===',
      stderr: 'advertencia de fixture',
      durationMs: 0,
      timedOut: false,
    }),
  });

  assertExit(result, 0);
  assert.equal(fs.existsSync(path.join(tmpRoot, 'alpha', 'runs', 'TC-001.txt')), true);
  assert.equal(fs.existsSync(path.join(tmpRoot, 'alpha', 'runs', 'TC-001.stderr.txt')), true);
  assert.equal(fs.existsSync(path.join(tmpRoot, 'alpha', 'report-19700101.md')), false);
  assert.equal(fs.existsSync(path.join(fixture.root, 'TC-001.txt')), false);
  assert.equal(fs.existsSync(path.join(fixture.root, 'alpha', 'runs', 'TC-001.txt')), false);
  assert.equal(
    fs.readdirSync(path.join(tmpRoot, 'alpha')).some((name) => /^report-\d{8}\.md$/.test(name)),
    true,
  );
});

test('un error de Claude con stdout no puede convertirse en PASS', async (t) => {
  const fixture = createFixture(t);
  writeSkill(fixture, 'alpha');

  const result = await runRunner(fixture, ['alpha'], {
    runClaude: async () => ({
      ok: false,
      code: 1,
      stdout: '=== CONSOLE ===\nrespuesta que pareceria aprobar\n=== END ===',
      stderr: 'fallo del proceso',
      durationMs: 0,
      timedOut: false,
    }),
  });

  assertExit(result, 1);
  assert.equal(result.claudeCalls.length, 1);
});

test('un error de Codex con stdout no puede convertirse en PASS', async (t) => {
  const fixture = createFixture(t);
  writeSkill(fixture, 'alpha');

  const result = await runRunner(fixture, ['alpha', '--eval-runner', 'codex'], {
    runCodex: async () => ({
      ok: false,
      code: 1,
      stdout: '=== CONSOLE ===\nrespuesta que pareceria aprobar\n=== END ===',
      stderr: 'fallo del proceso',
      durationMs: 0,
      timedOut: false,
    }),
  });

  assertExit(result, 1);
  assert.equal(result.claudeCalls.length, 0);
  assert.equal(result.codexCalls.length, 1);
  assert.match(result.output, /codex exit 1/i);
});

test('los selectores explicitos son mutuamente excluyentes', async (t) => {
  const fixture = createFixture(t);
  writeSkill(fixture, 'alpha');
  const base = initializeGit(fixture);

  for (const args of [
    ['--all', 'alpha', '--dry-run'],
    ['--all', '--changed-from', base, '--dry-run'],
    ['alpha', '--changed-from', base, '--dry-run'],
  ]) {
    assertExit(await runRunner(fixture, args), 1);
  }
});

test('--changed-from selecciona solo skills modificados entre la base y HEAD', async (t) => {
  const fixture = createFixture(t);
  const alphaDir = writeSkill(fixture, 'alpha', [makeCase('TC-001')]);
  writeSkill(fixture, 'beta', [makeCase('TC-002')]);
  const base = initializeGit(fixture);

  fs.appendFileSync(path.join(alphaDir, 'SKILL.md'), 'Cambio en alpha.\n');
  commitAll(fixture, 'modifica alpha');

  const result = await runRunner(fixture, ['--changed-from', base, '--dry-run']);

  assertExit(result, 0);
  assert.match(result.output, /Skills a evaluar: alpha/);
  assert.match(result.output, /----- TC-001/);
  assert.doesNotMatch(result.output, /----- TC-002/);
});

test('sin selector conserva la seleccion de cambios locales respecto de HEAD', async (t) => {
  const fixture = createFixture(t);
  const alphaDir = writeSkill(fixture, 'alpha', [makeCase('TC-001')]);
  initializeGit(fixture);
  fs.appendFileSync(path.join(alphaDir, 'SKILL.md'), 'Cambio local.\n');

  const result = await runRunner(fixture, ['--dry-run']);

  assertExit(result, 0);
  assert.match(result.output, /Skills a evaluar: alpha/);
  assert.match(result.output, /----- TC-001/);
});

test('--changed-from rechaza una referencia inexistente antes de planificar casos', async (t) => {
  const fixture = createFixture(t);
  writeSkill(fixture, 'alpha');
  initializeGit(fixture);

  const result = await runRunner(fixture, ['--changed-from', 'referencia-inexistente'], {
    runClaude: async () => {
      throw new Error('Claude no debe invocarse cuando la referencia es invalida');
    },
  });

  assertPreflightFailure(result);
  assert.match(result.output, /referencia|ref|changed-from/i);
  assert.equal(result.claudeCalls.length, 0);
});

test('--changed-from con rango valido sin skills evaluables falla cerrado', async (t) => {
  const fixture = createFixture(t);
  writeSkill(fixture, 'alpha');
  const base = initializeGit(fixture);

  fs.writeFileSync(path.join(fixture.root, 'README.md'), '# cambio sin evals\n');
  commitAll(fixture, 'cambia readme');

  const result = await runRunner(fixture, ['--changed-from', base, '--dry-run']);

  assertPreflightFailure(result);
  assert.match(result.output, /seleccion|caso|skill/i);
});

// ---------------------------------------------------------------------------
// Modo sandbox
// ---------------------------------------------------------------------------

const EPIC = 'specs/flow/EPIC-01-a/epic.md';

function makeSandboxCase(id, files, sandbox = { fixture: 'skills/alpha/examples/base', copy: ['docs/templates'] }) {
  return { ...makeCase(id), sandbox, expected: { contains: ['=== CONSOLE ==='], files } };
}

function writeSandboxSkill(fixture, cases) {
  const skillDir = writeSkill(fixture, 'alpha', cases);
  fs.mkdirSync(path.join(skillDir, 'examples', 'base', 'EPIC-01-a'), { recursive: true });
  fs.writeFileSync(path.join(skillDir, 'examples', 'base', 'EPIC-01-a', 'epic.md'), 'status: PLAN\nindice: viejo\n');
  fs.mkdirSync(path.join(skillDir, 'assets'), { recursive: true });
  fs.writeFileSync(path.join(skillDir, 'assets', 'template.md'), '# seed\n');
  fs.mkdirSync(path.join(fixture.root, 'docs', 'templates'), { recursive: true });
  fs.writeFileSync(path.join(fixture.root, 'docs', 'templates', 'epic-template.md'), '# epic\n');
  return skillDir;
}

function writingRunner(writes) {
  return async (prompt, opts, runtime) => {
    for (const [rel, content] of Object.entries(writes(runtime.sandboxDir))) {
      fs.mkdirSync(path.dirname(path.join(runtime.sandboxDir, rel)), { recursive: true });
      fs.writeFileSync(path.join(runtime.sandboxDir, rel), content);
    }
    return { ok: true, code: 0, stdout: '=== CONSOLE ===\nlisto\n=== END ===', stderr: '', durationMs: 0, timedOut: false };
  };
}

test('OpenCode en sandbox conserva la calificación de archivos y los fixtures originales', async (t) => {
  const fixture = createFixture(t);
  const skillDir = writeSandboxSkill(fixture, [makeSandboxCase('TC-001', {
    written: [EPIC], contains: { [EPIC]: ['indice: nuevo'] },
  })]);
  const result = await runRunner(fixture, ['alpha', '--eval-runner', 'opencode'], {
    runOpenCode: writingRunner(() => ({ [EPIC]: 'status: PLAN\nindice: nuevo\n' })),
  });
  assertExit(result, 0);
  assert.equal(result.openCodeCalls.length, 1);
  assert.equal(result.claudeCalls.length + result.codexCalls.length, 0);
  assert.match(result.openCodeCalls[0][0], /EJECUTAR DE VERDAD/);
  assert.equal(fs.readFileSync(path.join(skillDir, 'examples', 'base', 'EPIC-01-a', 'epic.md'), 'utf8'), 'status: PLAN\nindice: viejo\n');
});

test('los adaptadores en sandbox permiten escribir solo en el directorio de trabajo', () => {
  const claudeArgs = buildClaudeArgs('p', { model: 'm' }, { sandbox: true });
  assert.deepEqual(claudeArgs.slice(-7), [
    '--permission-mode',
    'acceptEdits',
    '--allowedTools',
    'Read,Glob,Grep',
    '--disallowedTools',
    'Bash,PowerShell,WebFetch,WebSearch',
    '--strict-mcp-config',
  ]);
  // Una regla Write/Edit sin ruta aprobaría escrituras fuera del sandbox: solo acceptEdits las aprueba, y únicamente en el cwd.
  const allowed = claudeArgs[claudeArgs.indexOf('--allowedTools') + 1].split(',');
  assert.ok(!allowed.some((tool) => /^(Write|Edit)\b/.test(tool)), `allowedTools no debe conceder Write/Edit: ${allowed}`);
  assert.deepEqual(buildCodexArgs({ model: null }, 'salida.txt', 'caja').slice(0, 6), [
    'exec',
    '--sandbox',
    'workspace-write',
    '--skip-git-repo-check',
    '--cd',
    'caja',
  ]);
});

test('un caso sandbox sin expected.files.written o con fixture inválido falla cerrado', async (t) => {
  const sinWritten = createFixture(t);
  writeSandboxSkill(sinWritten, [makeSandboxCase('TC-001', {})]);
  const r1 = await runRunner(sinWritten, ['alpha']);
  assertPreflightFailure(r1);
  assert.match(r1.output, /expected\.files\.written/);
  assert.equal(r1.claudeCalls.length, 0);

  const escape = createFixture(t);
  writeSandboxSkill(escape, [makeSandboxCase('TC-001', { written: [] }, { fixture: '../fuera' })]);
  const r2 = await runRunner(escape, ['alpha']);
  assertPreflightFailure(r2);
  assert.match(r2.output, /no puede escapar/);

  const ausente = createFixture(t);
  writeSandboxSkill(ausente, [makeSandboxCase('TC-001', { written: [] }, { fixture: 'skills/alpha/examples/nada' })]);
  const r3 = await runRunner(ausente, ['alpha']);
  assertPreflightFailure(r3);
  assert.match(r3.output, /sandbox\.fixture no es un directorio/);
  assertNoRunArtifacts(ausente);
});

test('sandbox: copia fixture, skill sin evals ni examples y rutas extra; califica el árbol en disco', async (t) => {
  const fixture = createFixture(t);
  const skillDir = writeSandboxSkill(fixture, [makeSandboxCase('TC-001', {
    written: [EPIC, `${EPIC}.bak`],
    contains: { [EPIC]: ['indice: nuevo'] },
    not_contains: { [EPIC]: ['indice: viejo'] },
    backups: { [`${EPIC}.bak`]: EPIC },
  })]);
  let seen;
  const result = await runRunner(fixture, ['alpha'], {
    runClaude: writingRunner((dir) => {
      seen = {
        fixture: fs.readFileSync(path.join(dir, EPIC), 'utf8'),
        skill: fs.existsSync(path.join(dir, 'skills', 'alpha', 'SKILL.md')),
        assets: fs.existsSync(path.join(dir, 'skills', 'alpha', 'assets', 'template.md')),
        evals: fs.existsSync(path.join(dir, 'skills', 'alpha', 'evals')),
        examples: fs.existsSync(path.join(dir, 'skills', 'alpha', 'examples')),
        templates: fs.existsSync(path.join(dir, 'docs', 'templates', 'epic-template.md')),
      };
      return { [`${EPIC}.bak`]: seen.fixture, [EPIC]: 'status: PLAN\nindice: nuevo\n' };
    }),
  });

  assertExit(result, 0);
  assert.deepEqual(seen, {
    fixture: 'status: PLAN\nindice: viejo\n',
    skill: true,
    assets: true,
    evals: false,
    examples: false,
    templates: true,
  });
  assert.match(result.claudeCalls[0][0], /EJECUTAR DE VERDAD/);
  assert.equal(
    fs.readFileSync(path.join(skillDir, 'examples', 'base', 'EPIC-01-a', 'epic.md'), 'utf8'),
    'status: PLAN\nindice: viejo\n',
  );
  const filesLog = fs.readFileSync(
    path.join(fixture.root, '.tmp', 'skill-test-evals', 'alpha', 'runs', 'TC-001.files.txt'),
    'utf8',
  );
  assert.match(filesLog, /created:\n {2}specs\/flow\/EPIC-01-a\/epic\.md\.bak\nmodified:\n {2}specs\/flow\/EPIC-01-a\/epic\.md\n/);
});

test('sandbox: una escritura no esperada o un backup distinto del original es FAIL', async (t) => {
  const fixture = createFixture(t);
  writeSandboxSkill(fixture, [makeSandboxCase('TC-001', {
    written: [EPIC, `${EPIC}.bak`],
    backups: { [`${EPIC}.bak`]: EPIC },
  })]);
  const result = await runRunner(fixture, ['alpha'], {
    runClaude: writingRunner(() => ({
      [`${EPIC}.bak`]: 'otro contenido\n',
      [EPIC]: 'status: COMPLETED\n',
      'specs/flow/EPIC-01-a/epic-analyze-report.md': 'manipulado\n',
    })),
  });

  assertExit(result, 1);
  assert.match(result.output, /\[files\] escrito: specs\/flow\/EPIC-01-a\/epic-analyze-report\.md/);
  assert.match(result.output, /\[files\] specs\/flow\/EPIC-01-a\/epic\.md\.bak difiere del specs\/flow\/EPIC-01-a\/epic\.md previo/);
});

test('sandbox con written vacío: cero escrituras es PASS y cualquier escritura es FAIL', async (t) => {
  const quieto = createFixture(t);
  writeSandboxSkill(quieto, [makeSandboxCase('TC-001', { written: [] })]);
  assertExit(await runRunner(quieto, ['alpha'], { runClaude: writingRunner(() => ({})) }), 0);

  const escribe = createFixture(t);
  writeSandboxSkill(escribe, [makeSandboxCase('TC-001', { written: [] })]);
  const result = await runRunner(escribe, ['alpha'], {
    runClaude: writingRunner(() => ({ 'specs/flow/EPIC-01-a/epic-refine-report.md': 'reporte\n' })),
  });
  assertExit(result, 1);
  assert.match(result.output, /\[files\] escrito: specs\/flow\/EPIC-01-a\/epic-refine-report\.md/);
});

test('sandbox en dry-run muestra el plan sin copiar ni invocar runners', async (t) => {
  const fixture = createFixture(t);
  writeSandboxSkill(fixture, [makeSandboxCase('TC-001', { written: [] })]);
  const result = await runRunner(fixture, ['alpha', '--dry-run']);
  assertExit(result, 0);
  assert.match(result.output, /\[sandbox\] skills\/alpha\/examples\/base → specs\/flow\/ · escritos esperados: 0/);
  assert.equal(result.claudeCalls.length, 0);
  assertNoRunArtifacts(fixture);
});
