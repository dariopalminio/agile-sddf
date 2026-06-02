'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs');
const fse = require('fs-extra');

const SOURCE_DIR = path.join(__dirname, '..', '.claude');

function resolveDestDir(options = {}) {
  if (options.global || process.env.npm_config_global === 'true') {
    return { destDir: path.join(os.homedir(), '.claude'), mode: 'global' };
  }
  const projectDir = process.env.INIT_CWD || process.cwd();
  return { destDir: path.join(projectDir, '.claude'), mode: 'local' };
}

function validateDestBase(destDir) {
  if (fs.existsSync(destDir) && !fs.statSync(destDir).isDirectory()) {
    throw new Error('.claude exists but is not a directory');
  }
}

async function copyDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return { installed: 0, skipped: 0 };

  await fse.ensureDir(destDir);

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  let installed = 0;
  let skipped = 0;

  for (const entry of entries) {
    const srcEntry = path.join(srcDir, entry.name);
    const destEntry = path.join(destDir, entry.name);

    if (fs.existsSync(destEntry)) {
      console.log(`  Skipped (already exists): ${destEntry}`);
      skipped++;
    } else {
      await fse.copy(srcEntry, destEntry);
      console.log(`  Installed: ${destEntry}`);
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
  const { installed: si, skipped: ss } = await copyDir(skillsSrc, skillsDest);

  const agentsSrc = path.join(SOURCE_DIR, 'agents');
  const agentsDest = path.join(destDir, 'agents');
  const { installed: ai, skipped: as_ } = await copyDir(agentsSrc, agentsDest);

  console.log(`\nSDDF installed (${mode}): ${si} skills, ${ai} agents (${ss + as_} skipped)\n`);
}

module.exports = { installSDDF };
