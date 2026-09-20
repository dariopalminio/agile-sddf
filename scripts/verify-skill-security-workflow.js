#!/usr/bin/env node
'use strict';

/**
 * Validates the non-negotiable security contract of the Skill Shielder workflow
 * without requiring GitHub Actions or the external scanner.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const WORKFLOW_PATH = path.join(
  REPO_ROOT,
  '.github',
  'workflows',
  'skill-security-audit.yml',
);

const REQUIRED_PATHS = [
  'skills/**',
  'agents/**',
  'scripts/**',
  'docs/constitution.md',
  'docs/policies/**',
  'docs/guardrails/**',
  '.github/workflows/**',
  'SECURITY.md',
  'AGENTS.md',
];

function assertContains(contents, fragment, description, errors) {
  if (!contents.includes(fragment)) {
    errors.push('Missing ' + description + ': ' + fragment);
  }
}

function main() {
  const contents = fs.readFileSync(WORKFLOW_PATH, 'utf8');
  const errors = [];

  for (const sourcePath of REQUIRED_PATHS) {
    assertContains(contents, "'" + sourcePath + "'", 'protected path', errors);
  }

  assertContains(contents, 'pull_request:', 'pull request trigger', errors);
  assertContains(contents, 'push:', 'push trigger', errors);
  assertContains(contents, '      - main', 'main branch restriction', errors);
  assertContains(contents, 'workflow_dispatch:', 'manual trigger', errors);
  assertContains(contents, 'contents: read', 'minimum permissions', errors);
  assertContains(
    contents,
    'node scripts/verify-skill-security-workflow.js',
    'in-workflow contract verification',
    errors,
  );
  assertContains(
    contents,
    '/tmp/shielder/shield.sh "$target"',
    'per-surface source scan',
    errors,
  );
  assertContains(
    contents,
    'for target in skills agents scripts docs/constitution.md docs/policies docs/guardrails .github/workflows; do',
    'complete protected-source scan loop',
    errors,
  );
  assertContains(contents, 'target_exit=$?', 'captured target exit code', errors);
  assertContains(contents, 'scan_exit=0', 'aggregate scanner exit code', errors);
  assertContains(contents, 'if: always()', 'failure-safe artifact upload', errors);
  assertContains(
    contents,
    'echo "exit_code=$scan_exit" >> "$GITHUB_OUTPUT"',
    'recorded scanner exit code',
    errors,
  );
  assertContains(
    contents,
    'exit "$scan_exit"',
    'propagated scanner failure',
    errors,
  );
  assertContains(
    contents,
    'SKILL_SHIELDER_REVISION: b204cecb2d26fccaca0e4121eae94e352e210126',
    'immutable Skill Shielder revision',
    errors,
  );
  assertContains(
    contents,
    'git clone --no-checkout https://github.com/p3nchan/skill-shielder.git /tmp/shielder',
    'non-executing Skill Shielder clone',
    errors,
  );
  assertContains(
    contents,
    'git -C /tmp/shielder checkout --detach "$SKILL_SHIELDER_REVISION"',
    'detached Skill Shielder checkout',
    errors,
  );
  assertContains(
    contents,
    'test "$(git -C /tmp/shielder rev-parse HEAD)" = "$SKILL_SHIELDER_REVISION"',
    'verified Skill Shielder checkout',
    errors,
  );

  for (const forbidden of [
    '.claude/skills',
    'continue-on-error',
    'pull_request_target',
  ]) {
    if (contents.includes(forbidden)) {
      errors.push('Forbidden workflow configuration found: ' + forbidden);
    }
  }

  if (errors.length > 0) {
    console.error('[ERROR] Invalid Skill Shielder workflow contract:');
    for (const error of errors) {
      console.error('- ' + error);
    }
    process.exitCode = 1;
    return;
  }

  console.log('[OK] Skill Shielder workflow contract verified.');
}

main();
