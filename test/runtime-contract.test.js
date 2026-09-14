'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const {
  loadRuntimeContract,
  installsAgents,
  resolveRuntimeTarget,
} = require('../scripts/runtime-contract.js');
const { verifyRuntimeDocumentation } = require('../scripts/verify-runtime-documentation.js');

const REPO_ROOT = path.resolve(__dirname, '..');

function fixture(t, mutate) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agile-sddf-runtime-'));
  const target = path.join(root, 'runtimes.json');
  const source = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'config', 'runtimes.json'), 'utf8'));
  mutate(source);
  fs.writeFileSync(target, `${JSON.stringify(source, null, 2)}\n`);
  t.after(() => fs.rmSync(root, { recursive: true, force: true, maxRetries: 3 }));
  return target;
}

test('el contrato fuente declara destinos canónicos, incluido Codex de solo skills', () => {
  const contract = loadRuntimeContract();
  assert.equal(contract.defaultRuntime, 'claude-code');
  assert.equal(resolveRuntimeTarget('opencode', contract).id, 'opencode');
  assert.equal(resolveRuntimeTarget('.github', contract).id, 'github-copilot');
  const codex = resolveRuntimeTarget('codex', contract);
  assert.deepEqual(codex.destinations.local.rootSegments, ['.agents']);
  assert.deepEqual(codex.destinations.global.rootSegments, ['.agents']);
  assert.equal(codex.layout.skillsDirectory, 'skills');
  assert.equal(codex.layout.agentsDirectory, null);
  assert.deepEqual(codex.layout.agentFileExtensions, []);
  assert.equal(installsAgents(codex), false);
  assert.throws(() => resolveRuntimeTarget('.agents', contract), /not an installable runtime/);
});

test('el contrato distingue runtimes con agentes de los runtimes solo-skills', (t) => {
  const unexpectedExtensions = fixture(t, (contract) => {
    const codex = contract.runtimes.find((runtime) => runtime.id === 'codex');
    codex.layout.agentFileExtensions = ['.md'];
  });
  assert.throws(() => loadRuntimeContract(unexpectedExtensions), /agentFileExtensions as an empty array/);

  const missingExtensions = fixture(t, (contract) => {
    const claude = contract.runtimes.find((runtime) => runtime.id === 'claude-code');
    claude.layout.agentFileExtensions = [];
  });
  assert.throws(() => loadRuntimeContract(missingExtensions), /must declare agent file extensions/);
});

test('un path de compatibilidad no puede introducir traversal ni hacerse instalable', (t) => {
  const traversal = fixture(t, (contract) => {
    contract.runtimes[1].compatibilityPaths[0].rootSegments = ['..'];
  });
  assert.throws(() => loadRuntimeContract(traversal), /unsafe path segment/);

  const installable = fixture(t, (contract) => {
    contract.runtimes[1].compatibilityPaths[0].installable = true;
  });
  assert.throws(() => loadRuntimeContract(installable), /installable must explicitly be false/);
});

test('README deriva todos los runtimes instalables desde el contrato versionado', () => {
  const result = verifyRuntimeDocumentation(REPO_ROOT);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.runtimes, ['claude-code', 'opencode', 'github-copilot', 'codex']);
});
