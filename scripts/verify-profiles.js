#!/usr/bin/env node
'use strict';

/**
 * Verificador determinista del contrato de perfiles y stacks.
 *
 * Uso:
 *   node scripts/verify-profiles.js
 *   node scripts/verify-profiles.js --profile core
 *   node scripts/verify-profiles.js --profile dogfood --extensions-dir <dir>
 *
 * No descarga extensiones: dogfood exige que el operador provea una instalación
 * y un lock local que coincida exactamente con el manifiesto versionado.
 */

const fs = require('fs');
const path = require('path');
const {
  RUNTIME_ID_PATTERN,
  loadRuntimeContract,
} = require('./runtime-contract.js');

const REPO_ROOT = path.resolve(__dirname, '..');
const PROFILES_PATH = path.join(REPO_ROOT, 'config', 'profiles.json');
const PROFILE_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SHA_PATTERN = /^[a-f0-9]{40}$/;

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function hasSafeRelativePath(relativePath) {
  if (typeof relativePath !== 'string' || relativePath.trim() === '' || path.isAbsolute(relativePath)) {
    return false;
  }
  const normalized = path.normalize(relativePath);
  return normalized !== '..' && !normalized.startsWith(`..${path.sep}`) && !path.isAbsolute(normalized);
}

function resolveContainedPath(root, relativePath, label, errors) {
  if (!hasSafeRelativePath(relativePath)) {
    errors.push(`${label}: debe ser una ruta relativa contenida`);
    return null;
  }
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative === '' || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    errors.push(`${label}: sale de su raíz declarada`);
    return null;
  }
  return resolved;
}

function readJson(file, errors, label = file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    errors.push(`${label}: no se pudo leer JSON (${error.message})`);
    return null;
  }
}

function loadProfilesManifest(profilesPath = PROFILES_PATH) {
  const errors = [];
  const manifest = readJson(profilesPath, errors, 'config/profiles.json');
  return { manifest, errors };
}

function unquoteYamlScalar(value) {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"'))
    || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function yamlTopLevelScalar(content, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = content.match(new RegExp(`^${escaped}:\\s*([^#\\r\\n]+?)(?:\\s+#.*)?$`, 'm'));
  return match ? unquoteYamlScalar(match[1]) : null;
}

function extractNpmScript(command) {
  const match = command.match(/^\s*npm\s+run\s+([A-Za-z0-9:_-]+)(?:\s|$)/);
  return match ? match[1] : null;
}

function extractNodeScript(command) {
  const match = command.match(/^\s*node\s+((?:scripts[/\\])[^\s]+)(?:\s|$)/);
  return match ? match[1].replace(/\\/g, '/') : null;
}

function validateDeclaredCommand(command, packageScripts, repoRoot, label, errors) {
  if (typeof command !== 'string' || command.trim() === '') {
    errors.push(`${label}: el comando obligatorio debe ser un string no vacío`);
    return;
  }
  const npmScript = extractNpmScript(command);
  if (npmScript) {
    if (!Object.prototype.hasOwnProperty.call(packageScripts, npmScript)) {
      errors.push(`${label}: npm script inexistente \`${npmScript}\``);
    }
    return;
  }
  const nodeScript = extractNodeScript(command);
  if (nodeScript) {
    const target = resolveContainedPath(repoRoot, nodeScript, label, errors);
    if (target && !fs.existsSync(target)) errors.push(`${label}: script Node inexistente \`${nodeScript}\``);
    return;
  }
  errors.push(`${label}: comando obligatorio no verificable; use \`npm run <script>\` o \`node scripts/<archivo>\``);
}

function validateYamlRequirements(file, packageScripts, repoRoot, label, errors) {
  let content;
  try {
    content = fs.readFileSync(file, 'utf8');
  } catch (error) {
    errors.push(`${label}: no se pudo leer (${error.message})`);
    return;
  }

  const commandsAtIndent = new Map();
  const lines = content.split(/\r?\n/);
  for (let index = 0; index < lines.length; index++) {
    const rawLine = lines[index];
    const withoutComment = rawLine.replace(/\s+#.*$/, '');
    const required = withoutComment.match(/^(\s*)required:\s*(.*?)\s*$/);
    if (required) {
      const indent = required[1].length;
      const value = required[2];
      if (value !== 'true' && value !== 'false') {
        errors.push(`${label}:${index + 1}: required debe ser booleano true o false, no \`${value || '(vacío)'}\``);
      } else if (value === 'true' && commandsAtIndent.has(indent)) {
        validateDeclaredCommand(
          commandsAtIndent.get(indent),
          packageScripts,
          repoRoot,
          `${label}:${index + 1}`,
          errors,
        );
      }
      continue;
    }

    const command = withoutComment.match(/^(\s*)(?:-\s+)?(command(?:_template)?):\s*(.*?)\s*$/);
    if (command) {
      commandsAtIndent.set(command[1].length, unquoteYamlScalar(command[3]));
      continue;
    }

    const mapping = withoutComment.match(/^(\s*)(?:-\s+)?[A-Za-z][A-Za-z0-9_-]*:\s*(?:.*)?$/);
    if (mapping) {
      const indent = mapping[1].length;
      for (const previousIndent of [...commandsAtIndent.keys()]) {
        if (previousIndent >= indent) commandsAtIndent.delete(previousIndent);
      }
    }
  }
}

function validateRequiredWorkerReferences(content, profile, label, errors) {
  const declaredWorkers = new Map((profile.workers || []).map((worker) => [worker.id, worker]));
  const lines = content.split(/\r?\n/);
  let collection = null;
  let entry = null;

  function validateEntry() {
    if (!entry || entry.required !== true) return;
    if (!entry.skill) {
      errors.push(`${label}:${entry.requiredLine}: una entrada de worker obligatoria debe declarar skill`);
      return;
    }
    if (entry.skill === 'none') {
      errors.push(`${label}:${entry.requiredLine}: skill: none no puede ser obligatorio`);
      return;
    }
    if (!PROFILE_ID_PATTERN.test(entry.skill)) {
      errors.push(`${label}:${entry.requiredLine}: skill obligatorio inválido \`${entry.skill}\``);
      return;
    }
    const worker = declaredWorkers.get(entry.skill);
    if (!worker) {
      errors.push(`${label}:${entry.requiredLine}: skill obligatorio \`${entry.skill}\` no está declarado por el perfil ${profile.id}`);
      return;
    }
    if (worker.required !== true || worker.provider === 'none') {
      errors.push(`${label}:${entry.requiredLine}: skill obligatorio \`${entry.skill}\` no está provisionado obligatoriamente por el perfil ${profile.id}`);
    }
  }

  for (let index = 0; index < lines.length; index++) {
    const rawLine = lines[index].replace(/\s+#.*$/, '');
    if (!rawLine.trim()) continue;
    const indentation = (rawLine.match(/^\s*/) || [''])[0].length;
    const collectionMatch = rawLine.match(/^(\s*)(test_generators|code_generators):\s*$/);
    if (collectionMatch) {
      validateEntry();
      entry = null;
      collection = { indent: collectionMatch[1].length };
      continue;
    }
    if (!collection) continue;
    if (indentation <= collection.indent) {
      validateEntry();
      entry = null;
      collection = null;
      continue;
    }

    const entryMatch = rawLine.match(/^(\s*)-\s+([A-Za-z][A-Za-z0-9_-]*):\s*(.*?)\s*$/);
    if (entryMatch && entryMatch[1].length > collection.indent) {
      validateEntry();
      entry = { indent: entryMatch[1].length, skill: null, required: false, requiredLine: null };
      if (entryMatch[2] === 'skill') entry.skill = unquoteYamlScalar(entryMatch[3]);
      if (entryMatch[2] === 'required') {
        entry.required = entryMatch[3] === 'true';
        entry.requiredLine = index + 1;
      }
      continue;
    }
    if (!entry || indentation <= entry.indent) continue;

    const field = rawLine.match(/^\s*(skill|required):\s*(.*?)\s*$/);
    if (!field) continue;
    if (field[1] === 'skill') entry.skill = unquoteYamlScalar(field[2]);
    if (field[1] === 'required') {
      entry.required = field[2] === 'true';
      entry.requiredLine = index + 1;
    }
  }
  validateEntry();
}

function validateConfiguration(profileId, profile, packageScripts, repoRoot, errors) {
  const configuration = profile.configuration;
  if (!isObject(configuration)) {
    errors.push(`profile ${profileId}: falta configuration`);
    return;
  }
  const base = resolveContainedPath(repoRoot, configuration.base, `profile ${profileId}.configuration.base`, errors);
  if (!Array.isArray(configuration.overlays)) {
    errors.push(`profile ${profileId}.configuration.overlays debe ser un array`);
  } else {
    for (const overlay of configuration.overlays) {
      const overlayPath = resolveContainedPath(repoRoot, overlay, `profile ${profileId}.configuration.overlays`, errors);
      if (overlayPath && !fs.existsSync(overlayPath)) {
        errors.push(`profile ${profileId}: overlay inexistente \`${overlay}\``);
      }
    }
  }
  if (!base || !fs.existsSync(base)) {
    if (base) errors.push(`profile ${profileId}: configuración base inexistente \`${configuration.base}\``);
    return;
  }

  let content;
  try {
    content = fs.readFileSync(base, 'utf8');
  } catch (error) {
    errors.push(`profile ${profileId}: no se pudo leer configuración base (${error.message})`);
    return;
  }
  const declaredProfile = yamlTopLevelScalar(content, 'profile');
  const declaredStack = yamlTopLevelScalar(content, 'stack');
  if (declaredProfile !== profileId) {
    errors.push(`profile ${profileId}: ${configuration.base} debe declarar \`profile: ${profileId}\``);
  }
  if (declaredStack !== profile.stack) {
    errors.push(`profile ${profileId}: ${configuration.base} debe declarar \`stack: ${profile.stack}\``);
  }
  validateYamlRequirements(base, packageScripts, repoRoot, configuration.base, errors);
  validateRequiredWorkerReferences(content, { ...profile, id: profileId }, configuration.base, errors);
}

function validateExtension(extension, errors) {
  if (!isObject(extension) || !PROFILE_ID_PATTERN.test(extension.id || '')) {
    errors.push('extension: id inválido');
    return;
  }
  if (!isObject(extension.source)
    || extension.source.type !== 'git'
    || typeof extension.source.url !== 'string'
    || !/^https:\/\//.test(extension.source.url)
    || !SHA_PATTERN.test(extension.source.revision || '')) {
    errors.push(`extension ${extension.id}: source debe contener type git, URL HTTPS y revisión SHA de 40 caracteres`);
  }
  if (!Array.isArray(extension.workers) || extension.workers.length === 0) {
    errors.push(`extension ${extension.id}: debe declarar workers`);
    return;
  }
  const workerIds = new Set();
  for (const worker of extension.workers) {
    if (!isObject(worker) || !PROFILE_ID_PATTERN.test(worker.id || '') || !hasSafeRelativePath(worker.path)) {
      errors.push(`extension ${extension.id}: worker inválido`);
      continue;
    }
    if (workerIds.has(worker.id)) errors.push(`extension ${extension.id}: worker duplicado ${worker.id}`);
    workerIds.add(worker.id);
  }
}

function resolveStackVerification(stackId, stacks, errors, trail = []) {
  const stack = stacks[stackId];
  if (!isObject(stack)) return [];
  if (trail.includes(stackId)) {
    errors.push(`stack ${stackId}: herencia circular (${[...trail, stackId].join(' -> ')})`);
    return [];
  }
  const inherited = stack.extends === undefined
    ? []
    : resolveStackVerification(stack.extends, stacks, errors, [...trail, stackId]);
  return [...inherited, ...(Array.isArray(stack.verification) ? stack.verification : [])];
}

function validateProfileWorkers(profileId, profile, extensions, errors) {
  if (!Array.isArray(profile.workers)) {
    errors.push(`profile ${profileId}.workers debe ser un array`);
    return;
  }
  const workerIds = new Set();
  for (const worker of profile.workers) {
    if (!isObject(worker) || !PROFILE_ID_PATTERN.test(worker.id || '')) {
      errors.push(`profile ${profileId}: worker inválido`);
      continue;
    }
    if (workerIds.has(worker.id)) errors.push(`profile ${profileId}: worker duplicado ${worker.id}`);
    workerIds.add(worker.id);
    if (typeof worker.required !== 'boolean') {
      errors.push(`profile ${profileId}.${worker.id}: required debe ser booleano`);
    }
    if (worker.provider === 'none') {
      if (worker.required !== false) errors.push(`profile ${profileId}.${worker.id}: provider none no puede ser obligatorio`);
      continue;
    }
    const extension = extensions.get(worker.provider);
    if (!extension) {
      errors.push(`profile ${profileId}.${worker.id}: extensión proveedora inexistente \`${worker.provider}\``);
      continue;
    }
    if (!extension.workers.some((candidate) => candidate.id === worker.id)) {
      errors.push(`profile ${profileId}.${worker.id}: la extensión ${worker.provider} no declara ese worker`);
    }
  }
}

function validateManifest(manifest, runtimeContract, packageScripts, repoRoot, errors) {
  if (!isObject(manifest) || manifest.schemaVersion !== 1) {
    errors.push('config/profiles.json: schemaVersion debe ser 1');
    return { extensions: new Map(), profiles: {}, stacks: {} };
  }
  if (typeof manifest.extensionLockFile !== 'string' || !/^[A-Za-z0-9._-]+\.json$/.test(manifest.extensionLockFile)) {
    errors.push('config/profiles.json: extensionLockFile inválido');
  }
  if (!Array.isArray(manifest.extensions)) {
    errors.push('config/profiles.json: extensions debe ser un array');
  }
  const extensions = new Map();
  for (const extension of manifest.extensions || []) {
    validateExtension(extension, errors);
    if (extension && typeof extension.id === 'string') {
      if (extensions.has(extension.id)) errors.push(`extension duplicada: ${extension.id}`);
      extensions.set(extension.id, extension);
    }
  }

  const stacks = isObject(manifest.stacks) ? manifest.stacks : {};
  if (!isObject(manifest.stacks)) errors.push('config/profiles.json: stacks debe ser un objeto');
  for (const [stackId, stack] of Object.entries(stacks)) {
    if (!PROFILE_ID_PATTERN.test(stackId) || !isObject(stack)) {
      errors.push(`stack inválido: ${stackId}`);
      continue;
    }
    if (stack.extends !== undefined && (!PROFILE_ID_PATTERN.test(stack.extends) || !stacks[stack.extends])) {
      errors.push(`stack ${stackId}: extends debe nombrar un stack existente`);
    }
    if (!Array.isArray(stack.verification)) errors.push(`stack ${stackId}: verification debe ser un array`);
    for (const [index, verification] of (stack.verification || []).entries()) {
      if (!isObject(verification) || typeof verification.required !== 'boolean') {
        errors.push(`stack ${stackId}.verification[${index}]: required debe ser booleano`);
      } else if (verification.required) {
        validateDeclaredCommand(verification.command, packageScripts, repoRoot, `stack ${stackId}.verification[${index}]`, errors);
      }
    }
    if (!Array.isArray(stack.workerCapabilities)
      || stack.workerCapabilities.some((workerId) => !PROFILE_ID_PATTERN.test(workerId))) {
      errors.push(`stack ${stackId}: workerCapabilities debe contener IDs válidos`);
    }
  }

  const profiles = isObject(manifest.profiles) ? manifest.profiles : {};
  if (!isObject(manifest.profiles)) errors.push('config/profiles.json: profiles debe ser un objeto');
  if (!profiles[manifest.defaultProfile]) errors.push('config/profiles.json: defaultProfile debe nombrar un perfil existente');
  const runtimeIds = new Set(runtimeContract.runtimes.map((runtime) => runtime.id));
  for (const [profileId, profile] of Object.entries(profiles)) {
    if (!PROFILE_ID_PATTERN.test(profileId) || !isObject(profile)) {
      errors.push(`profile inválido: ${profileId}`);
      continue;
    }
    if (!stacks[profile.stack]) errors.push(`profile ${profileId}: stack inexistente \`${profile.stack}\``);
    if (!Array.isArray(profile.runtimes) || profile.runtimes.length === 0) {
      errors.push(`profile ${profileId}: runtimes debe ser un array no vacío`);
    } else {
      for (const runtimeId of profile.runtimes) {
        if (!runtimeIds.has(runtimeId)) errors.push(`profile ${profileId}: runtime desconocido \`${runtimeId}\``);
      }
    }
    validateProfileWorkers(profileId, profile, extensions, errors);
    validateConfiguration(profileId, profile, packageScripts, repoRoot, errors);
    if (stacks[profile.stack]) resolveStackVerification(profile.stack, stacks, errors);
  }

  return { extensions, profiles, stacks };
}

function sourceMatches(actual, expected) {
  return isObject(actual)
    && actual.type === expected.type
    && actual.url === expected.url
    && actual.revision === expected.revision;
}

function validateDogfoodExtensions(manifest, profile, extensions, extensionsDir, errors) {
  const requiredWorkers = profile.workers.filter((worker) => worker.required && worker.provider !== 'none');
  if (requiredWorkers.length === 0) return;
  if (!extensionsDir) {
    for (const worker of requiredWorkers) {
      const extension = extensions.get(worker.provider);
      errors.push(
        `profile dogfood: falta worker obligatorio ${worker.id}; provee --extensions-dir con ${manifest.extensionLockFile} para ${extension.source.url}@${extension.source.revision}`,
      );
    }
    return;
  }

  const lockPath = path.resolve(extensionsDir, manifest.extensionLockFile);
  const lockRelative = path.relative(extensionsDir, lockPath);
  if (lockRelative === '' || lockRelative === '..' || lockRelative.startsWith(`..${path.sep}`) || path.isAbsolute(lockRelative)) {
    errors.push('profile dogfood: extensionLockFile sale de --extensions-dir');
    return;
  }
  const lockErrors = [];
  const lock = readJson(lockPath, lockErrors, path.join(extensionsDir, manifest.extensionLockFile));
  if (lockErrors.length) {
    for (const worker of requiredWorkers) {
      const extension = extensions.get(worker.provider);
      errors.push(
        `profile dogfood: falta lock verificable para ${worker.id}; se espera ${lockPath} con ${extension.source.url}@${extension.source.revision}`,
      );
    }
    return;
  }
  if (!isObject(lock) || lock.schemaVersion !== 1 || !isObject(lock.extensions)) {
    errors.push(`profile dogfood: ${lockPath} debe contener schemaVersion: 1 y extensions`);
    return;
  }

  for (const worker of requiredWorkers) {
    const extension = extensions.get(worker.provider);
    const lockedExtension = lock.extensions[extension.id];
    if (!isObject(lockedExtension) || !sourceMatches(lockedExtension.source, extension.source)) {
      errors.push(
        `profile dogfood: extensión ${extension.id} no está fijada a ${extension.source.url}@${extension.source.revision} para worker ${worker.id}`,
      );
      continue;
    }
    if (!Array.isArray(lockedExtension.workers) || !lockedExtension.workers.includes(worker.id)) {
      errors.push(`profile dogfood: lock de ${extension.id} no declara worker ${worker.id}`);
      continue;
    }
    const declaredWorker = extension.workers.find((candidate) => candidate.id === worker.id);
    if (!declaredWorker) {
      errors.push(`profile dogfood: la extensión ${extension.id} no declara ruta para ${worker.id}`);
      continue;
    }
    const workerDir = resolveContainedPath(
      extensionsDir,
      declaredWorker.path,
      `profile dogfood: ruta de worker ${worker.id}`,
      errors,
    );
    if (!workerDir) continue;
    const skillFile = path.resolve(workerDir, 'SKILL.md');
    const relative = path.relative(workerDir, skillFile);
    if (relative === '' || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
      errors.push(`profile dogfood: ruta de SKILL.md inválida para ${worker.id}`);
      continue;
    }
    if (!fs.existsSync(skillFile)) {
      errors.push(`profile dogfood: falta ${skillFile} para worker ${worker.id}`);
      continue;
    }
    const skillContent = fs.readFileSync(skillFile, 'utf8');
    const name = yamlTopLevelScalar(skillContent, 'name');
    if (name !== worker.id) {
      errors.push(`profile dogfood: ${skillFile} debe declarar \`name: ${worker.id}\``);
    }
  }
}

function verifyProfiles(options = {}) {
  const errors = [];
  const repoRoot = path.resolve(options.repoRoot || REPO_ROOT);
  const profilesPath = options.profilesPath || path.join(repoRoot, 'config', 'profiles.json');
  const packagePath = path.join(repoRoot, 'package.json');
  const { manifest, errors: manifestReadErrors } = loadProfilesManifest(profilesPath);
  errors.push(...manifestReadErrors);

  const packageJson = readJson(packagePath, errors, 'package.json');
  let runtimeContract;
  try {
    runtimeContract = loadRuntimeContract(options.runtimeContractPath || path.join(repoRoot, 'config', 'runtimes.json'));
  } catch (error) {
    errors.push(error.message);
  }
  if (!manifest || !packageJson || !runtimeContract) {
    return { ok: false, errors, checkedProfiles: [] };
  }
  const packageScripts = isObject(packageJson.scripts) ? packageJson.scripts : {};
  const { extensions, profiles } = validateManifest(manifest, runtimeContract, packageScripts, repoRoot, errors);

  const requestedProfile = options.profile || 'all';
  if (requestedProfile !== 'all' && !profiles[requestedProfile]) {
    errors.push(`perfil desconocido: ${requestedProfile}`);
    return { ok: false, errors, checkedProfiles: [] };
  }
  const checkedProfiles = requestedProfile === 'all' ? Object.keys(profiles) : [requestedProfile];
  const extensionsDir = options.extensionsDir
    ? path.resolve(repoRoot, options.extensionsDir)
    : null;
  if ((requestedProfile === 'dogfood' || (requestedProfile === 'all' && extensionsDir)) && profiles.dogfood) {
    validateDogfoodExtensions(manifest, profiles.dogfood, extensions, extensionsDir, errors);
  }

  return { ok: errors.length === 0, errors, checkedProfiles };
}

function parseArgs(argv) {
  const options = { profile: 'all', json: false, quiet: false };
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index];
    if (argument === '--profile') {
      options.profile = argv[++index];
    } else if (argument === '--extensions-dir') {
      options.extensionsDir = argv[++index];
    } else if (argument === '--repo-root') {
      options.repoRoot = argv[++index];
    } else if (argument === '--json') {
      options.json = true;
    } else if (argument === '--quiet') {
      options.quiet = true;
    } else if (argument === '--help' || argument === '-h') {
      options.help = true;
    } else {
      throw new Error(`argumento desconocido: ${argument}`);
    }
    if ((argument === '--profile' || argument === '--extensions-dir' || argument === '--repo-root')
      && (argv[index] === undefined || argv[index].startsWith('--'))) {
      throw new Error(`falta valor para ${argument}`);
    }
  }
  return options;
}

function usage() {
  return [
    'Uso: node scripts/verify-profiles.js [opciones]',
    '',
    '  --profile <core|dogfood|all>  Perfil a verificar (all valida el contrato estático)',
    '  --extensions-dir <dir>        Instalación explícita y lock para validar dogfood',
    '  --repo-root <dir>             Raíz del proyecto a verificar',
    '  --json                        Emitir resultado JSON',
    '  --quiet                       Suprimir salida de éxito',
  ].join('\n');
}

function main(argv = process.argv.slice(2)) {
  let options;
  try {
    options = parseArgs(argv);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.error(usage());
    return 1;
  }
  if (options.help) {
    console.log(usage());
    return 0;
  }
  const result = verifyProfiles(options);
  if (options.json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } else if (!result.ok) {
    for (const error of result.errors) console.error(`[ERROR] ${error}`);
  } else if (!options.quiet) {
    console.log(`[OK] Perfiles verificados: ${result.checkedProfiles.join(', ')}`);
  }
  return result.ok ? 0 : 1;
}

if (require.main === module) {
  process.exitCode = main();
}

module.exports = {
  PROFILES_PATH,
  loadProfilesManifest,
  parseArgs,
  verifyProfiles,
  validateYamlRequirements,
  main,
};
