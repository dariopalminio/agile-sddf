#!/usr/bin/env node
'use strict';

/**
 * Checks deterministic, unambiguous security signals in governance documents.
 * Skill Shielder is intentionally not used here: those documents quote risky
 * terms to prohibit them, which is not evidence that an agent will perform
 * the action. Semantic review remains governed by gr-ai-security-checklist.
 */

const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.resolve(__dirname, '..');
const REQUIRED_DOCUMENTS = Object.freeze([
  'AGENTS.md',
  'SECURITY.md',
  'docs/constitution.md',
]);
const DOCUMENT_DIRECTORIES = Object.freeze([
  'docs/policies',
  'docs/guardrails',
]);

const RULES = Object.freeze([
  {
    id: 'sec-no-private-key',
    message: 'contains a PEM private-key block',
    expression: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g,
  },
  {
    id: 'sec-no-provider-token',
    message: 'contains a provider token-shaped literal',
    expression: /\b(?:AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{20,}|xox[baprs]-[A-Za-z0-9-]{10,})\b/g,
  },
  {
    id: 'sec-no-credential-literal',
    message: 'assigns a long credential-shaped literal',
    expression: /\b(?:api[_-]?key|secret|token|password|passwd)\b\s*[:=]\s*["'][^"'\r\n]{20,}["']/gi,
  },
  {
    id: 'ai-no-remote-pipe',
    message: 'pipes remotely fetched content to a shell',
    expression: /\b(?:curl|wget)\s+[^\r\n|]+\|\s*(?:ba|z)?sh\b/gi,
  },
]);

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function lineAt(contents, offset) {
  return contents.slice(0, offset).split(/\r?\n/).length;
}

function listMarkdownFiles(directory, files, errors, repoRoot) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const candidate = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) {
      errors.push(`${toPosix(path.relative(repoRoot, candidate))}: symbolic links are not accepted in a security-document scan.`);
      continue;
    }
    if (entry.isDirectory()) {
      listMarkdownFiles(candidate, files, errors, repoRoot);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.md')) files.push(candidate);
  }
}

function securityDocumentFiles(repoRoot = REPO_ROOT) {
  const root = path.resolve(repoRoot);
  const files = [];
  const errors = [];

  for (const relativePath of REQUIRED_DOCUMENTS) {
    const candidate = path.join(root, relativePath);
    if (!fs.existsSync(candidate) || !fs.lstatSync(candidate).isFile() || fs.lstatSync(candidate).isSymbolicLink()) {
      errors.push(`${relativePath}: required security document is missing or is not a regular file.`);
      continue;
    }
    files.push(candidate);
  }
  for (const relativePath of DOCUMENT_DIRECTORIES) {
    const directory = path.join(root, relativePath);
    if (!fs.existsSync(directory) || !fs.lstatSync(directory).isDirectory() || fs.lstatSync(directory).isSymbolicLink()) {
      errors.push(`${relativePath}: required security-document directory is missing or is not a real directory.`);
      continue;
    }
    listMarkdownFiles(directory, files, errors, root);
  }

  return { files: [...new Set(files)].sort(), errors };
}

function findViolations(contents, { skippedRules = new Set() } = {}) {
  const findings = [];
  for (const rule of RULES) {
    if (skippedRules.has(rule.id)) continue;
    rule.expression.lastIndex = 0;
    let match;
    while ((match = rule.expression.exec(contents)) !== null) {
      findings.push({ rule: rule.id, message: rule.message, line: lineAt(contents, match.index) });
      if (match[0].length === 0) rule.expression.lastIndex += 1;
    }
  }
  return findings;
}

function verifySecurityDocuments(repoRoot = REPO_ROOT) {
  const root = path.resolve(repoRoot);
  const inventory = securityDocumentFiles(root);
  const errors = [...inventory.errors];

  for (const file of inventory.files) {
    const relativePath = toPosix(path.relative(root, file));
    const contents = fs.readFileSync(file, 'utf8');
    // Guardrails deliberately quote prohibited command shapes as examples of
    // what reviewers must reject. Those examples are covered by semantic
    // review; treating them as executable instructions would recreate the
    // false-positive class this verifier is meant to avoid.
    const skippedRules = relativePath.startsWith('docs/guardrails/')
      ? new Set(['ai-no-remote-pipe'])
      : new Set();
    for (const finding of findViolations(contents, { skippedRules })) {
      errors.push(`${relativePath}:${finding.line}: ${finding.rule} ${finding.message}.`);
    }
  }
  return { files: inventory.files, errors };
}

function main() {
  const result = verifySecurityDocuments();
  if (result.errors.length > 0) {
    console.error('[ERROR] Security-document verification failed:');
    for (const error of result.errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(`[OK] ${result.files.length} security documents passed deterministic checks.`);
}

if (require.main === module) main();

module.exports = {
  DOCUMENT_DIRECTORIES,
  REQUIRED_DOCUMENTS,
  RULES,
  findViolations,
  securityDocumentFiles,
  verifySecurityDocuments,
};
