'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { verifyProfiles } = require('../scripts/verify-profiles.js');

const REPO_ROOT = path.resolve(__dirname, '..');

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agile-sddf-profile-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true, maxRetries: 3 }));
  return root;
}

function copy(root, relative) {
  const source = path.join(REPO_ROOT, relative);
  const target = path.join(root, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function write(root, relative, content) {
  const target = path.join(root, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function profileFixture(t) {
  const root = fixture(t);
  for (const relative of [
    'package.json',
    'sddf.config.yaml',
    'config/profiles.json',
    'config/runtimes.json',
    'scripts/audit-root-resolution.js',
    'skills/sddf-init/assets/sddf.config.yaml.template',
  ]) copy(root, relative);
  return root;
}

test('core es validable sin extensión externa y no declara workers obligatorios', () => {
  const result = verifyProfiles({ repoRoot: REPO_ROOT, profile: 'core' });
  assert.equal(result.ok, true, result.errors.join('\n'));
  const manifest = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'config', 'profiles.json'), 'utf8'));
  const coreStack = manifest.stacks[manifest.profiles.core.stack];
  assert.equal(coreStack.verification.some((verification) => verification.required), false);
});

test('dogfood sin extensión falla temprano e identifica la fuente y SHA fijadas', () => {
  const result = verifyProfiles({ repoRoot: REPO_ROOT, profile: 'dogfood' });
  assert.equal(result.ok, false);
  const diagnostics = result.errors.join('\n');
  assert.match(diagnostics, /skill-master/);
  assert.match(diagnostics, /skill-test-evals/);
  assert.match(diagnostics, /agile-sddf-extension\.git/);
  assert.match(diagnostics, /302d66c93a3905e70dc0a0e267f43a553c873f49/);
});

test('dogfood acepta únicamente un fixture con lock, workers y rutas fijadas', (t) => {
  const root = profileFixture(t);
  const profiles = JSON.parse(fs.readFileSync(path.join(root, 'config', 'profiles.json'), 'utf8'));
  const extension = profiles.extensions[0];
  const extensionRoot = path.join(root, 'extensions');
  write(root, path.join('extensions', profiles.extensionLockFile), `${JSON.stringify({
    schemaVersion: 1,
    extensions: {
      [extension.id]: {
        source: extension.source,
        workers: extension.workers.map((worker) => worker.id),
      },
    },
  }, null, 2)}\n`);
  for (const worker of extension.workers) {
    write(root, path.join('extensions', worker.path, 'SKILL.md'), `---\nname: ${worker.id}\n---\n# ${worker.id}\n`);
  }

  const valid = verifyProfiles({ repoRoot: root, profile: 'dogfood', extensionsDir: 'extensions' });
  assert.equal(valid.ok, true, valid.errors.join('\n'));

  fs.rmSync(path.join(extensionRoot, extension.workers[0].path, 'SKILL.md'));
  const missingWorker = verifyProfiles({ repoRoot: root, profile: 'dogfood', extensionsDir: 'extensions' });
  assert.equal(missingWorker.ok, false);
  assert.match(missingWorker.errors.join('\n'), /falta .*skill-master/i);
});

test('la configuración no puede exigir un worker ausente del perfil declarado', (t) => {
  const root = profileFixture(t);
  const configPath = path.join(root, 'sddf.config.yaml');
  const content = fs.readFileSync(configPath, 'utf8').replace('skill: skill-master', 'skill: worker-no-declarado');
  fs.writeFileSync(configPath, content, 'utf8');

  const result = verifyProfiles({ repoRoot: root, profile: 'dogfood' });
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /worker-no-declarado.*no está declarado por el perfil dogfood/);
});
