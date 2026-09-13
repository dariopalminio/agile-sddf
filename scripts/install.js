'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs');
const readline = require('readline');
const fse = require('fs-extra');

const SOURCE_DIR = path.join(__dirname, '..');

const VALID_FOLDERS = ['.claude', '.agents', '.github'];

function resolveInstallFolder(folder) {
  if (folder === undefined) return '.claude';

  if (typeof folder !== 'string' || !VALID_FOLDERS.includes(folder)) {
    throw new Error(`Invalid installation target. Valid values: ${VALID_FOLDERS.join(', ')}`);
  }

  return folder;
}

function assertDestinationContained(baseDir, destDir) {
  const relative = path.relative(baseDir, destDir);
  const isOutsideBase = relative === ''
    || relative === '..'
    || relative.startsWith(`..${path.sep}`)
    || path.isAbsolute(relative);

  if (isOutsideBase) {
    throw new Error('Installation destination must stay inside its installation base');
  }
}

async function promptFolderSelection() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const menu = [
    '  1) .claude   (Claude Code)',
    '  2) .agents   (Codex, OpenCode)',
    '  3) .github   (GitHub Copilot)',
  ].join('\n');

  return new Promise((resolve) => {
    console.log('\nWhere would you like to install SDDF skills and agents?');
    console.log(menu);
    rl.question('Enter choice [1]: ', (answer) => {
      rl.close();
      const choice = answer.trim() || '1';
      const map = { '1': '.claude', '2': '.agents', '3': '.github' };
      resolve(map[choice] || '.claude');
    });
  });
}

function resolveDestDir(options = {}) {
  const folder = resolveInstallFolder(options.folder);
  const isGlobal = options.global || process.env.npm_config_global === 'true';
  const baseDir = path.resolve(isGlobal
    ? os.homedir()
    : (process.env.INIT_CWD || process.cwd()));
  const destDir = path.resolve(baseDir, folder);

  assertDestinationContained(baseDir, destDir);

  return { destDir, mode: isGlobal ? 'global' : 'local' };
}

function validateDestBase(destDir) {
  if (fs.existsSync(destDir) && !fs.statSync(destDir).isDirectory()) {
    throw new Error(`${destDir} exists but is not a directory`);
  }
}

async function copyDir(srcDir, destDir, { force = false } = {}) {
  if (!fs.existsSync(srcDir)) return { installed: 0, skipped: 0 };

  await fse.ensureDir(destDir);

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  let installed = 0;
  let skipped = 0;

  for (const entry of entries) {
    const srcEntry = path.join(srcDir, entry.name);
    const destEntry = path.join(destDir, entry.name);

    if (!force && fs.existsSync(destEntry)) {
      console.log(`  Skipped (already exists): ${destEntry}`);
      skipped++;
    } else {
      const isUpdate = fs.existsSync(destEntry);
      await fse.copy(srcEntry, destEntry, { overwrite: true });
      console.log(`  ${isUpdate ? 'Updated' : 'Installed'}: ${destEntry}`);
      installed++;
    }
  }

  return { installed, skipped };
}

async function installSDDF(options = {}) {
  const folder = resolveInstallFolder(options.folder);
  const { destDir, mode } = resolveDestDir({ ...options, folder });

  console.log(`\nSDDF install: copying skills and agents to ${destDir}\n`);

  validateDestBase(destDir);

  const skillsSrc = path.join(SOURCE_DIR, 'skills');
  const skillsDest = path.join(destDir, 'skills');
  const { installed: si, skipped: ss } = await copyDir(skillsSrc, skillsDest, { force: options.force });

  const agentsSrc = path.join(SOURCE_DIR, 'agents');
  const agentsDest = path.join(destDir, 'agents');
  const { installed: ai, skipped: as_ } = await copyDir(agentsSrc, agentsDest, { force: options.force });

  console.log(`\nSDDF installed (${mode}): ${si} skills, ${ai} agents (${ss + as_} skipped)\n`);
}

module.exports = {
  installSDDF,
  promptFolderSelection,
  VALID_FOLDERS,
  assertDestinationContained,
};
