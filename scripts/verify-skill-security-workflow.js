#!/usr/bin/env node
'use strict';

/**
 * Validates the non-negotiable security contract of the Skill Shielder workflow
 * without requiring GitHub Actions or the external scanner.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
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

function verifyWorkflowContents(contents) {
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
    'node scripts/verify-security-documents.js',
    'deterministic security-document verification',
    errors,
  );
  assertContains(
    contents,
    'node scripts/run-skill-shielder-audit.js',
    'isolated Skill Shielder runner',
    errors,
  );
  assertContains(contents, '--shielder /tmp/shielder/shield.sh', 'pinned scanner path passed to runner', errors);
  assertContains(contents, '--skills-dir skills', 'skills source passed to runner', errors);
  assertContains(contents, '--report audit-report.txt', 'shared audit report passed to runner', errors);
  assertContains(contents, 'set -o pipefail', 'pipe-safe document-verifier output', errors);
  assertContains(contents, 'documents_exit=${PIPESTATUS[0]}', 'captured document-verifier exit code', errors);
  assertContains(contents, 'scanner_exit=$?', 'captured isolated-scanner exit code', errors);
  assertContains(contents, 'audit_exit=0', 'explicit aggregate audit exit code', errors);
  assertContains(
    contents,
    'if [ "$documents_exit" -ne 0 ] || [ "$scanner_exit" -eq 3 ]; then',
    'blocking operational-error policy',
    errors,
  );
  assertContains(contents, 'elif [ "$scanner_exit" -eq 2 ]; then', 'blocking critical policy', errors);
  assertContains(
    contents,
    'elif [ "$scanner_exit" -ne 0 ] && [ "$scanner_exit" -ne 1 ]; then',
    'nonblocking warning policy',
    errors,
  );
  assertContains(contents, 'if: always()', 'failure-safe artifact upload', errors);
  assertContains(
    contents,
    'echo "exit_code=$audit_exit" >> "$GITHUB_OUTPUT"',
    'recorded aggregate audit exit code',
    errors,
  );
  assertContains(
    contents,
    'exit "$audit_exit"',
    'propagated aggregate audit failure',
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
  assertContains(
    contents,
    'actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4.4.0',
    'pinned Node runtime setup',
    errors,
  );

  for (const forbidden of [
    '.claude/skills',
    'continue-on-error',
    'pull_request_target',
    'for target in skills agents scripts docs/constitution.md docs/policies docs/guardrails .github/workflows; do',
    '/tmp/shielder/shield.sh "$target"',
  ]) {
    if (contents.includes(forbidden)) {
      errors.push('Forbidden workflow configuration found: ' + forbidden);
    }
  }

  if (/\/tmp\/shielder\/shield\.sh\s+(?:["'])?docs\/constitution\.md(?:["']|\s|$)/.test(contents)) {
    errors.push('The file docs/constitution.md must not be passed directly to Skill Shielder.');
  }
  if (/^\s*\/tmp\/shielder\/shield\.sh(?:\s|$)/m.test(contents)) {
    errors.push('Skill Shielder must be invoked only through the isolated runner.');
  }

  return errors;
}

function verifyWorkflow(repoRoot = REPO_ROOT) {
  const workflowPath = path.join(repoRoot, '.github', 'workflows', 'skill-security-audit.yml');
  const errors = [];
  if (!fs.existsSync(workflowPath)) {
    return ['Missing Skill Shielder workflow.'];
  }
  errors.push(...verifyWorkflowContents(fs.readFileSync(workflowPath, 'utf8')));
  if (!fs.existsSync(path.join(repoRoot, 'scripts', 'run-skill-shielder-audit.js'))) {
    errors.push('Missing isolated Skill Shielder runner.');
  }
  if (!fs.existsSync(path.join(repoRoot, 'scripts', 'verify-security-documents.js'))) {
    errors.push('Missing deterministic security-document verifier.');
  }
  return errors;
}

function main() {
  const errors = verifyWorkflow();

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

if (require.main === module) main();

module.exports = {
  REQUIRED_PATHS,
  verifyWorkflow,
  verifyWorkflowContents,
};
