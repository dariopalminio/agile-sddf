'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const {
  EXIT_CODES,
  buildAuditPlan,
  runSkillShielderAudit,
} = require('../scripts/run-skill-shielder-audit.js');

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agile-sddf-shielder-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true, maxRetries: 3 }));
  return root;
}

function write(root, relativePath, contents = '') {
  const file = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents, 'utf8');
  return file;
}

function skill(root, name) {
  return write(root, path.join('skills', name, 'SKILL.md'), `# ${name}\n`);
}

function audit(root, options = {}) {
  return runSkillShielderAudit({
    repoRoot: root,
    scannerPath: '/fixture/shield.sh',
    reportPath: 'audit-report.txt',
    ...options,
  });
}

test('el plan expande skills y aisla archivos ejecutables por perfil', (t) => {
  const root = fixture(t);
  skill(root, 'beta');
  skill(root, 'alpha');
  write(root, 'agents/reviewer.agent.md', '# reviewer\n');
  write(root, 'scripts/check.js', "'use strict';\n");
  write(root, '.github/workflows/quality.yml', 'name: Quality\n');

  const plan = buildAuditPlan({ repoRoot: root });

  assert.deepEqual(plan.errors, []);
  assert.deepEqual(plan.targets.map((target) => [target.label, target.kind]), [
    ['.github/workflows/quality.yml', 'file'],
    ['agents/reviewer.agent.md', 'file'],
    ['scripts/check.js', 'file'],
    ['skills/alpha', 'directory'],
    ['skills/beta', 'directory'],
  ]);
});

test('un warning se conserva pero no bloquea y nunca escanea skills agregado', (t) => {
  const root = fixture(t);
  skill(root, 'alpha');
  skill(root, 'beta');
  const calls = [];

  const result = audit(root, {
    runCommand: ({ targetPath }) => {
      calls.push(targetPath);
      return { exitCode: path.basename(targetPath) === 'beta' ? 1 : 0, stdout: 'scanner output\n' };
    },
  });

  assert.equal(result.exitCode, EXIT_CODES.clean);
  assert.deepEqual(result.results.map((entry) => entry.status), ['clean', 'warning']);
  assert.deepEqual(calls.map((target) => path.relative(root, target).split(path.sep).join('/')), [
    'skills/alpha',
    'skills/beta',
  ]);
  assert.match(fs.readFileSync(path.join(root, 'audit-report.txt'), 'utf8'), /skills\/beta: warning/);
});

test('continua tras un critico y da prioridad a un error operativo posterior', (t) => {
  const root = fixture(t);
  skill(root, 'alpha');
  skill(root, 'beta');
  const calls = [];

  const result = audit(root, {
    runCommand: ({ targetPath }) => {
      calls.push(path.basename(targetPath));
      return { exitCode: path.basename(targetPath) === 'alpha' ? 2 : 127 };
    },
  });

  assert.deepEqual(calls, ['alpha', 'beta']);
  assert.equal(result.exitCode, EXIT_CODES.operationalError);
  assert.deepEqual(result.results.map((entry) => entry.status), ['critical', 'operational-error']);
});

test('un archivo se copia a un directorio temporal con un solo archivo antes del escaneo', (t) => {
  const root = fixture(t);
  skill(root, 'alpha');
  write(root, 'scripts/check.js', "console.log('safe');\n");
  let stagedPath;

  const result = audit(root, {
    runCommand: ({ targetPath }) => {
      if (path.basename(targetPath) === 'alpha') return { exitCode: 0 };
      stagedPath = targetPath;
      assert.notEqual(path.resolve(targetPath), path.join(root, 'scripts', 'check.js'));
      assert.deepEqual(fs.readdirSync(targetPath), ['check.js']);
      return { exitCode: 0 };
    },
  });

  assert.equal(result.exitCode, EXIT_CODES.clean);
  assert.ok(stagedPath);
  assert.equal(fs.existsSync(stagedPath), false);
});

test('un directorio de skill sin SKILL.md falla cerrado', (t) => {
  const root = fixture(t);
  write(root, 'skills/incomplete/reference.md', '# incomplete\n');

  const result = audit(root, { runCommand: () => ({ exitCode: 0 }) });

  assert.equal(result.exitCode, EXIT_CODES.operationalError);
  assert.equal(result.results.length, 0);
  assert.match(fs.readFileSync(path.join(root, 'audit-report.txt'), 'utf8'), /lacks its required SKILL\.md/);
});

test('un warning puede hacerse bloqueante de forma explicita', (t) => {
  const root = fixture(t);
  skill(root, 'alpha');

  const result = audit(root, {
    warnBlocks: true,
    runCommand: () => ({ exitCode: 1 }),
  });

  assert.equal(result.exitCode, EXIT_CODES.warning);
  assert.equal(result.results[0].blocking, true);
});

test('un plan que intenta escapar del repositorio no invoca el escaner', (t) => {
  const root = fixture(t);
  let calls = 0;
  const result = audit(root, {
    plan: {
      errors: [],
      targets: [{ label: 'escape', kind: 'directory', sourcePath: path.resolve(root, '..') }],
    },
    runCommand: () => {
      calls += 1;
      return { exitCode: 0 };
    },
  });

  assert.equal(calls, 0);
  assert.equal(result.exitCode, EXIT_CODES.operationalError);
  assert.equal(result.results[0].status, 'operational-error');
});
