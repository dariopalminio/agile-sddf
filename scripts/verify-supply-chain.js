#!/usr/bin/env node
'use strict';

/**
 * Reject mutable GitHub Action and remote-clone references before CI executes
 * them. This is intentionally a syntax/contract check: it never downloads
 * third-party code while validating a pull request.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const SHA_PATTERN = /^[a-f0-9]{40}$/i;
const SKILL_SHIELDER_URL = 'https://github.com/p3nchan/skill-shielder.git';
const SKILL_SHIELDER_REVISION = 'b204cecb2d26fccaca0e4121eae94e352e210126';

function walk(directory, files) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const candidate = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(candidate, files);
    else if (entry.isFile() && /\.ya?ml$/i.test(entry.name)) files.push(candidate);
  }
}

function workflowFiles(repoRoot) {
  const directory = path.join(repoRoot, '.github', 'workflows');
  if (!fs.existsSync(directory)) throw new Error('Missing .github/workflows directory.');
  const files = [];
  walk(directory, files);
  return files.sort();
}

function relative(repoRoot, filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join('/');
}

function verifyActionPins(repoRoot, filePath, contents, errors) {
  const lines = contents.split(/\r?\n/);
  lines.forEach((line, index) => {
    const match = line.match(/^\s*(?:-\s*)?uses:\s*([^\s#]+)(?:\s+(#.*))?\s*$/);
    if (!match) return;
    const reference = match[1];
    if (reference.startsWith('./')) return;
    const action = reference.match(/^([^@]+)@(.+)$/);
    if (!action) {
      errors.push(`${relative(repoRoot, filePath)}:${index + 1}: malformed uses reference '${reference}'.`);
      return;
    }
    if (!SHA_PATTERN.test(action[2])) {
      errors.push(`${relative(repoRoot, filePath)}:${index + 1}: action '${action[1]}' must use a full 40-character commit SHA, not '${action[2]}'.`);
    }
    if (!match[2] || !/#\s*(?:v?\d|release|sha)/i.test(match[2])) {
      errors.push(`${relative(repoRoot, filePath)}:${index + 1}: pinned action '${action[1]}' needs a human release comment.`);
    }
  });
}

function cloneCommands(contents) {
  // La URL no siempre sigue inmediatamente a `clone`: flags sin argumento,
  // como --no-checkout, no pueden consumirla durante el parseo. Se corta en
  // el siguiente operador de shell o salto de línea y se exige una URL remota
  // literal; si no se puede probar, el validador falla cerrado.
  return [...contents.matchAll(/\bgit\s+clone\b([\s\S]*?)(?=(?:&&|;|\r?\n|$))/g)]
    .map((match) => match[1]);
}

function remoteFromCloneCommand(argumentsText) {
  const match = argumentsText.match(/(?:^|\s)(?:["'])?((?:(?:https?|ssh|git):\/\/|git@)[^\s'"\\]+)(?:["'])?(?=\s|$)/i);
  return match ? match[1] : null;
}

function verifyRemoteClone(repoRoot, filePath, contents, errors) {
  for (const argumentsText of cloneCommands(contents)) {
    const remote = remoteFromCloneCommand(argumentsText);
    if (!remote) {
      errors.push(`${relative(repoRoot, filePath)}: git clone no declara una URL remota literal verificable.`);
      continue;
    }
    if (remote !== SKILL_SHIELDER_URL) {
      errors.push(`${relative(repoRoot, filePath)}: remote clone '${remote}' has no versioned allowlist entry.`);
      continue;
    }
    if (!contents.includes(SKILL_SHIELDER_REVISION)) {
      errors.push(`${relative(repoRoot, filePath)}: Skill Shielder revision must be ${SKILL_SHIELDER_REVISION}.`);
    }
    if (!/git(?:\s+-C\s+\S+)?\s+checkout\s+--detach\s+["']?\$\{?SKILL_SHIELDER_REVISION\}?/.test(contents)) {
      errors.push(`${relative(repoRoot, filePath)}: Skill Shielder clone must check out the declared immutable revision with --detach.`);
    }
    if (!/rev-parse\s+HEAD/.test(contents) || !/SKILL_SHIELDER_REVISION/.test(contents)) {
      errors.push(`${relative(repoRoot, filePath)}: Skill Shielder clone must verify HEAD equals the declared revision.`);
    }
  }
}

function verifyNpmLifecycleSafety(repoRoot, filePath, contents, errors) {
  const commands = [...contents.matchAll(/\bnpm\s+(ci|install|pack)\b([^\r\n]*)/g)];
  for (const command of commands) {
    if (!/(?:^|\s)--ignore-scripts(?:\s|$)/.test(command[2])) {
      errors.push(`${relative(repoRoot, filePath)}: npm ${command[1]} debe usar --ignore-scripts en CI.`);
    }
  }
}

function verifyDockerBase(repoRoot, errors) {
  const dockerfile = path.join(repoRoot, 'Dockerfile.dev');
  if (!fs.existsSync(dockerfile)) {
    errors.push('Dockerfile.dev is missing.');
    return;
  }
  const contents = fs.readFileSync(dockerfile, 'utf8');
  if (!/^FROM\s+[^\s@]+@sha256:[a-f0-9]{64}\s*$/im.test(contents)) {
    errors.push('Dockerfile.dev: base image must be pinned by a sha256 digest.');
  }
  verifyRemoteClone(repoRoot, dockerfile, contents, errors);
}

function verifySupplyChain({ repoRoot = REPO_ROOT } = {}) {
  const errors = [];
  const workflows = workflowFiles(repoRoot);
  for (const filePath of workflows) {
    const contents = fs.readFileSync(filePath, 'utf8');
    verifyActionPins(repoRoot, filePath, contents, errors);
    verifyRemoteClone(repoRoot, filePath, contents, errors);
    verifyNpmLifecycleSafety(repoRoot, filePath, contents, errors);
  }
  verifyDockerBase(repoRoot, errors);
  return { workflows, errors };
}

function main() {
  const result = verifySupplyChain();
  if (result.errors.length > 0) {
    console.error('[ERROR] Supply-chain verification failed:');
    for (const error of result.errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(`[OK] ${result.workflows.length} workflow(s), Action SHAs, Docker digest and Skill Shielder pin verified.`);
}

if (require.main === module) main();

module.exports = {
  SKILL_SHIELDER_REVISION,
  SKILL_SHIELDER_URL,
  cloneCommands,
  remoteFromCloneCommand,
  verifyNpmLifecycleSafety,
  verifySupplyChain,
};
