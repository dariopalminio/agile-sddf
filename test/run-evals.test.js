'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { main, resolveContainedPath } = require('../scripts/run-evals.js');

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

async function runRunner(fixture, args, { runClaude, tmpRoot } = {}) {
  const messages = [];
  const claudeCalls = [];
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
  });
  return { code, output: messages.join('\n'), claudeCalls };
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
