#!/usr/bin/env node
'use strict';

const { installSDDF } = require('./install.js');

const args = process.argv.slice(2);
const command = args[0];
const isGlobal = args.includes('--global');

const USAGE = `
Usage: agile-sddf <command> [options]

Commands:
  install    Copy skills and agents to .claude/ in the current project

Options:
  --global   Install to ~/.claude instead of the current project

Examples:
  agile-sddf install
  agile-sddf install --global
  npx agile-sddf install
`;

if (!command || command === 'help' || command === '--help' || command === '-h') {
  console.log(USAGE);
  process.exit(0);
}

if (command === 'install') {
  installSDDF({ global: isGlobal }).catch((err) => {
    console.error('SDDF install failed:', err.message);
    process.exit(1);
  });
} else {
  console.error(`Unknown command: ${command}`);
  console.log(USAGE);
  process.exit(1);
}
