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
  main,
  parseArgs,
  resolveContainedPath,
  runCodex,
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

async function runRunner(fixture, args, { runClaude, runCodex: runCodexStub, tmpRoot } = {}) {
  const messages = [];
  const claudeCalls = [];
  const codexCalls = [];
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
  });
  return { code, output: messages.join('\n'), claudeCalls, codexCalls };
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
