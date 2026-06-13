'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs');
const readline = require('readline');
const fse = require('fs-extra');

const SOURCE_DIR = path.join(__dirname, '..', '.claude');

const VALID_FOLDERS = ['.claude', '.agents', '.github'];

async function promptFolderSelection() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const menu = [
    '  1) .claude   (Claude Code — recommended)',
    '  2) .agents   (OpenCode)',
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
  const folder = options.folder || '.claude';
  if (options.global || process.env.npm_config_global === 'true') {
    return { destDir: path.join(os.homedir(), folder), mode: 'global' };
  }
  const projectDir = process.env.INIT_CWD || process.cwd();
  return { destDir: path.join(projectDir, folder), mode: 'local' };
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
  const { destDir, mode } = resolveDestDir(options);

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

module.exports = { installSDDF, promptFolderSelection, VALID_FOLDERS };
