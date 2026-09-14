#!/usr/bin/env node
'use strict';

const {
  installSDDF,
  promptFolderSelection,
  resolveInstallTarget,
  VALID_TARGETS,
} = require('./install.js');
const { loadRuntimeContract, listInstallableRuntimes, installsAgents } = require('./runtime-contract.js');

const args = process.argv.slice(2);
const command = args[0];
const isGlobal = args.includes('--global');
const isForce = args.includes('--force');

const targetIdx = args.indexOf('--target');
const targetValue = targetIdx !== -1 ? args[targetIdx + 1] : undefined;

function targetHelpRows() {
  const contract = loadRuntimeContract();
  return listInstallableRuntimes(contract)
    .map((runtime) => {
      const local = runtime.destinations.local.rootSegments.join('/');
      const global = runtime.destinations.global.rootSegments.join('/');
      const scope = installsAgents(runtime) ? 'skills and agents' : 'skills only';
      return `  ${runtime.id.padEnd(16)} ${runtime.name}; ${scope}; local ${local}/, global ~/${global}/`;
    })
    .join('\n');
}

const USAGE = `
Usage: agile-sddf <command> [options]

Commands:
  install    Copy skills and compatible agents to a declared runtime destination

Options:
  --global             Install to the runtime's global destination instead of the current project
  --target <runtime>   Runtime ID (default: claude-code)
  --force              Overwrite existing files (use for upgrades)

Supported runtimes:
${targetHelpRows()}

Examples:
  agile-sddf install
  agile-sddf install --target opencode
  agile-sddf install --target codex
  agile-sddf install --target github-copilot --force
  agile-sddf install --global --target claude-code
  npx agile-sddf install

.agents is a destination path, not a runtime ID. Use --target codex for Codex
(skills only); use the canonical OpenCode or GitHub Copilot runtime IDs otherwise.
`;

function exitInvalidTarget(providedTarget) {
  const printable = providedTarget === undefined ? '' : providedTarget;
  console.error(`Invalid --target "${printable}". Valid runtime IDs: ${VALID_TARGETS.join(', ')}`);
  console.error('Use --help to see canonical local and global destinations.');
  process.exit(1);
}

if (!command || command === 'help' || command === '--help' || command === '-h') {
  console.log(USAGE);
  process.exit(0);
}

if (command === 'install') {
  if (targetIdx !== -1) {
    if (targetValue === undefined || targetValue.startsWith('--')) exitInvalidTarget(targetValue);
    try {
      resolveInstallTarget(targetValue);
    } catch (_) {
      exitInvalidTarget(targetValue);
    }
  }

  (async () => {
    let target = targetValue;
    if (!target && process.stdin.isTTY) {
      target = await promptFolderSelection();
    }
    installSDDF({ global: isGlobal, target, force: isForce }).catch((err) => {
      console.error('SDDF install failed:', err.message);
      process.exit(1);
    });
  })();
} else {
  console.error(`Unknown command: ${command}`);
  console.log(USAGE);
  process.exit(1);
}
