'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs');
const fse = require('fs-extra');

const SOURCE_DIR = path.join(__dirname, '..', '.claude');
const DEST_DIR = path.join(os.homedir(), '.claude');

async function copyDir(srcDir, destDir, label) {
  if (!fs.existsSync(srcDir)) return { installed: 0, skipped: 0 };

  await fse.ensureDir(destDir);

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  let installed = 0;
  let skipped = 0;

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

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

async function main() {
  console.log('\nSDDF postinstall: copying skills and agents to ~/.claude/\n');

  const skillsSrc = path.join(SOURCE_DIR, 'skills');
  const skillsDest = path.join(DEST_DIR, 'skills');
  const { installed: si, skipped: ss } = await copyDir(skillsSrc, skillsDest, 'skills');

  const agentsSrc = path.join(SOURCE_DIR, 'agents');
  const agentsDest = path.join(DEST_DIR, 'agents');
  const { installed: ai, skipped: as_ } = await copyDir(agentsSrc, agentsDest, 'agents');

  console.log(`\nSDDF installed: ${si} skills, ${ai} agents (${ss + as_} skipped)\n`);
}

main().catch((err) => {
  console.error('SDDF postinstall failed:', err.message);
  process.exit(1);
});
