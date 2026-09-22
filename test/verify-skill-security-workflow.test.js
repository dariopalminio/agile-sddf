'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const { verifyWorkflowContents } = require('../scripts/verify-skill-security-workflow.js');

const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'skill-security-audit.yml');

function currentWorkflow() {
  return fs.readFileSync(workflowPath, 'utf8');
}

test('el contrato acepta el workflow de auditoria aislada', () => {
  assert.deepEqual(verifyWorkflowContents(currentWorkflow()), []);
});

test('el contrato rechaza volver al bucle agregado de fuentes heterogeneas', () => {
  const contents = `${currentWorkflow()}\nfor target in skills agents scripts docs/constitution.md docs/policies docs/guardrails .github/workflows; do\n`;
  const errors = verifyWorkflowContents(contents).join('\n');

  assert.match(errors, /Forbidden workflow configuration found: for target in skills agents scripts/);
});

test('el contrato rechaza pasar la constitucion como archivo al escaner', () => {
  const contents = `${currentWorkflow()}\n/tmp/shielder/shield.sh "docs/constitution.md"\n`;
  const errors = verifyWorkflowContents(contents).join('\n');

  assert.match(errors, /docs\/constitution\.md must not be passed directly/);
});

test('el contrato rechaza una invocacion directa que vuelva a agregar skills', () => {
  const contents = `${currentWorkflow()}\n/tmp/shielder/shield.sh skills\n`;
  const errors = verifyWorkflowContents(contents).join('\n');

  assert.match(errors, /Skill Shielder must be invoked only through the isolated runner/);
});

test('el contrato exige la politica de warnings no bloqueantes', () => {
  const contents = currentWorkflow().replace(
    'elif [ "$scanner_exit" -ne 0 ] && [ "$scanner_exit" -ne 1 ]; then',
    'elif [ "$scanner_exit" -ne 0 ]; then',
  );
  const errors = verifyWorkflowContents(contents).join('\n');

  assert.match(errors, /Missing nonblocking warning policy/);
});
