'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { main } = require('../scripts/run-evals.js');

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

async function runRunner(fixture, args, { runClaude } = {}) {
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
  const code = await main(args, {
    repoRoot: fixture.root,
    tmpRoot: path.join(fixture.root, '.tmp', 'skill-test-evals'),
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
