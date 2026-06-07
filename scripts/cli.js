#!/usr/bin/env node
'use strict';

const { installSDDF, VALID_FOLDERS } = require('./install.js');

const args = process.argv.slice(2);
const command = args[0];
const isGlobal = args.includes('--global');

const targetIdx = args.indexOf('--target');
const targetFolder = targetIdx !== -1 ? args[targetIdx + 1] : undefined;

const USAGE = `
Usage: agile-sddf <command> [options]

Commands:
  install    Copy skills and agents to a target folder in the current project

Options:
  --global            Install to ~/<folder> instead of the current project
  --target <folder>   Target folder: .claude (default), .agents, .github

Examples:
  agile-sddf install
  agile-sddf install --global
  agile-sddf install --target .agents
  agile-sddf install --global --target .github
  npx agile-sddf install
`;

if (!command || command === 'help' || command === '--help' || command === '-h') {
  console.log(USAGE);
  process.exit(0);
}

if (command === 'install') {
  if (targetFolder !== undefined && !VALID_FOLDERS.includes(targetFolder)) {
    console.error(`Invalid --target "${targetFolder}". Valid values: ${VALID_FOLDERS.join(', ')}`);
    process.exit(1);
  }
  installSDDF({ global: isGlobal, folder: targetFolder }).catch((err) => {
    console.error('SDDF install failed:', err.message);
    process.exit(1);
  });
} else {
  console.error(`Unknown command: ${command}`);
  console.log(USAGE);
  process.exit(1);
}
