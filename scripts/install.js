'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs');
const readline = require('readline');
const fse = require('fs-extra');
const {
  loadRuntimeContract,
  listInstallableRuntimes,
  formatRuntimeChoices,
  resolveRuntimeTarget,
} = require('./runtime-contract.js');

const SOURCE_DIR = path.join(__dirname, '..');

function runtimeContract() {
  return loadRuntimeContract();
}

function validTargets() {
  return listInstallableRuntimes(runtimeContract()).map((runtime) => runtime.id);
}

// Conservado como alias de API para consumidores programáticos anteriores. Los
// valores ya no son carpetas; son IDs de runtime definidos por el contrato.
const VALID_FOLDERS = validTargets();
const VALID_TARGETS = VALID_FOLDERS;

function resolveInstallTarget(target) {
  return resolveRuntimeTarget(target, runtimeContract());
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

function resolveDestDir(options = {}) {
  // `folder` remains an internal compatibility alias only. CLI consumers use
  // `target`, whose accepted values are resolved solely from runtimes.json.
  const selectedTarget = options.target === undefined ? options.folder : options.target;
  const runtime = resolveInstallTarget(selectedTarget);
  // La instalación solo puede cambiar de alcance mediante la opción explícita
  // del comando. `npm_config_global` describe cómo npm instaló este paquete,
  // no la intención del operador de copiar archivos a HOME.
  const isGlobal = options.global === true;
  const baseDir = path.resolve(options.baseDir || (isGlobal
    ? (options.homeDir || os.homedir())
    : (process.env.INIT_CWD || process.cwd())));
  const destination = runtime.destinations[isGlobal ? 'global' : 'local'];
  const destDir = path.resolve(baseDir, ...destination.rootSegments);

  assertDestinationContained(baseDir, destDir);

  return {
    destDir,
    mode: isGlobal ? 'global' : 'local',
    runtime,
  };
}

function validateDestBase(destDir) {
  if (fs.existsSync(destDir) && !fs.statSync(destDir).isDirectory()) {
    throw new Error(`${destDir} exists but is not a directory`);
  }
}

function formatDestination(runtime, mode) {
  const destination = runtime.destinations[mode];
  return destination.rootSegments.join('/');
}

async function promptFolderSelection() {
  const contract = runtimeContract();
  const runtimes = listInstallableRuntimes(contract);
  const defaultRuntime = resolveRuntimeTarget(undefined, contract);
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const menu = runtimes
    .map((runtime, index) => `  ${index + 1}) ${runtime.id}  (${runtime.name}; ${formatDestination(runtime, 'local')}/)`)
    .join('\n');

  return new Promise((resolve) => {
    console.log('\nWhere would you like to install SDDF skills and agents?');
    console.log(menu);
    rl.question(`Enter choice [${runtimes.indexOf(defaultRuntime) + 1}]: `, (answer) => {
      rl.close();
      const choice = answer.trim();
      const index = choice === '' ? runtimes.indexOf(defaultRuntime) : Number.parseInt(choice, 10) - 1;
      resolve(runtimes[index] ? runtimes[index].id : defaultRuntime.id);
    });
  });
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
  const { destDir, mode, runtime } = resolveDestDir(options);

  console.log(`\nSDDF install: copying skills and agents for ${runtime.name} to ${destDir}\n`);

  validateDestBase(destDir);

  const skillsSrc = path.join(SOURCE_DIR, 'skills');
  const skillsDest = path.resolve(destDir, runtime.layout.skillsDirectory);
  assertDestinationContained(destDir, skillsDest);
  const { installed: si, skipped: ss } = await copyDir(skillsSrc, skillsDest, { force: options.force });

  const agentsSrc = path.join(SOURCE_DIR, 'agents');
  const agentsDest = path.resolve(destDir, runtime.layout.agentsDirectory);
  assertDestinationContained(destDir, agentsDest);
  const { installed: ai, skipped: as_ } = await copyDir(agentsSrc, agentsDest, { force: options.force });

  const result = {
    runtime: runtime.id,
    destination: destDir,
    mode,
    skills: { installed: si, skipped: ss },
    agents: { installed: ai, skipped: as_ },
  };

  console.log(`\nSDDF installed (${mode}, ${runtime.id}): ${si} skills, ${ai} agents (${ss + as_} skipped)\n`);
  return result;
}

module.exports = {
  installSDDF,
  promptFolderSelection,
  resolveInstallTarget,
  resolveDestDir,
  formatRuntimeChoices,
  VALID_FOLDERS,
  VALID_TARGETS,
  assertDestinationContained,
};
