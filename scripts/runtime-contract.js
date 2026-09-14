'use strict';

/**
 * Carga el contrato versionado de runtimes. Ningún consumidor debe mantener
 * por separado la lista de directorios de instalación.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const RUNTIME_CONTRACT_PATH = path.join(REPO_ROOT, 'config', 'runtimes.json');
const RUNTIME_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isSafePathSegment(value) {
  return typeof value === 'string'
    && value.length > 0
    && value !== '.'
    && value !== '..'
    && !value.includes('/')
    && !value.includes('\\')
    && !path.isAbsolute(value);
}

function failContract(message) {
  throw new Error(`Invalid runtime contract: ${message}`);
}

function assertSafeSegments(segments, label) {
  if (!Array.isArray(segments) || segments.length === 0) {
    failContract(`${label} must contain at least one path segment`);
  }

  for (const segment of segments) {
    if (!isSafePathSegment(segment)) {
      failContract(`${label} contains an unsafe path segment`);
    }
  }
}

function validateCompatibilityPath(compatibilityPath, runtimeId, index) {
  const label = `runtime ${runtimeId} compatibilityPaths[${index}]`;
  if (!compatibilityPath || typeof compatibilityPath !== 'object') {
    failContract(`${label} must be an object`);
  }
  if (!['local', 'global'].includes(compatibilityPath.scope)) {
    failContract(`${label}.scope must be local or global`);
  }
  assertSafeSegments(compatibilityPath.rootSegments, `${label}.rootSegments`);
  if (!isSafePathSegment(compatibilityPath.skillsDirectory)) {
    failContract(`${label}.skillsDirectory is unsafe`);
  }
  if (compatibilityPath.installable !== false) {
    failContract(`${label}.installable must explicitly be false`);
  }
  if (typeof compatibilityPath.reason !== 'string' || compatibilityPath.reason.trim() === '') {
    failContract(`${label}.reason must explain the compatibility boundary`);
  }
}

function validateRuntime(runtime, ids) {
  if (!runtime || typeof runtime !== 'object') failContract('runtime must be an object');
  if (!RUNTIME_ID_PATTERN.test(runtime.id || '')) failContract('runtime id must be kebab-case');
  if (ids.has(runtime.id)) failContract(`runtime id is duplicated: ${runtime.id}`);
  ids.add(runtime.id);

  if (typeof runtime.name !== 'string' || runtime.name.trim() === '') {
    failContract(`runtime ${runtime.id} must have a name`);
  }
  if (runtime.support !== 'supported') {
    failContract(`runtime ${runtime.id} must explicitly declare support: supported`);
  }
  if (!runtime.destinations || typeof runtime.destinations !== 'object') {
    failContract(`runtime ${runtime.id} is missing destinations`);
  }
  for (const scope of ['local', 'global']) {
    const destination = runtime.destinations[scope];
    if (!destination || typeof destination !== 'object') {
      failContract(`runtime ${runtime.id} is missing ${scope} destination`);
    }
    assertSafeSegments(destination.rootSegments, `runtime ${runtime.id} ${scope} rootSegments`);
  }
  if (!runtime.layout || typeof runtime.layout !== 'object') {
    failContract(`runtime ${runtime.id} is missing layout`);
  }
  for (const key of ['skillsDirectory', 'skillFileName']) {
    if (!isSafePathSegment(runtime.layout[key])) {
      failContract(`runtime ${runtime.id} has unsafe layout.${key}`);
    }
  }
  if (runtime.layout.agentsDirectory === null) {
    if (!Array.isArray(runtime.layout.agentFileExtensions)
      || runtime.layout.agentFileExtensions.length !== 0) {
      failContract(`runtime ${runtime.id} is skills-only and must declare agentFileExtensions as an empty array`);
    }
  } else {
    if (!isSafePathSegment(runtime.layout.agentsDirectory)) {
      failContract(`runtime ${runtime.id} has unsafe layout.agentsDirectory`);
    }
    if (!Array.isArray(runtime.layout.agentFileExtensions)
      || runtime.layout.agentFileExtensions.length === 0
      || runtime.layout.agentFileExtensions.some((extension) => typeof extension !== 'string'
        || !/^\.[A-Za-z0-9][A-Za-z0-9.-]*$/.test(extension))) {
      failContract(`runtime ${runtime.id} must declare agent file extensions`);
    }
  }
  if (runtime.aliases !== undefined && (!Array.isArray(runtime.aliases)
    || runtime.aliases.some((alias) => typeof alias !== 'string' || alias.trim() === ''))) {
    failContract(`runtime ${runtime.id} has invalid aliases`);
  }
  if (runtime.compatibilityPaths !== undefined) {
    if (!Array.isArray(runtime.compatibilityPaths)) {
      failContract(`runtime ${runtime.id}.compatibilityPaths must be an array`);
    }
    runtime.compatibilityPaths.forEach((compatibilityPath, index) => {
      validateCompatibilityPath(compatibilityPath, runtime.id, index);
    });
  }
}

function loadRuntimeContract(contractPath = RUNTIME_CONTRACT_PATH) {
  let contract;
  try {
    contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
  } catch (error) {
    throw new Error(`Unable to read runtime contract at ${contractPath}: ${error.message}`);
  }

  if (!contract || typeof contract !== 'object' || contract.schemaVersion !== 1) {
    failContract('schemaVersion must be 1');
  }
  if (!Array.isArray(contract.runtimes) || contract.runtimes.length === 0) {
    failContract('runtimes must be a non-empty array');
  }

  const ids = new Set();
  for (const runtime of contract.runtimes) validateRuntime(runtime, ids);
  if (!ids.has(contract.defaultRuntime)) {
    failContract('defaultRuntime must name a declared runtime');
  }

  const aliases = new Set();
  for (const runtime of contract.runtimes) {
    for (const alias of runtime.aliases || []) {
      if (ids.has(alias) || aliases.has(alias)) failContract(`runtime alias is ambiguous: ${alias}`);
      aliases.add(alias);
    }
  }

  return contract;
}

function getRuntime(runtimeId, contract = loadRuntimeContract()) {
  return contract.runtimes.find((runtime) => runtime.id === runtimeId);
}

function listInstallableRuntimes(contract = loadRuntimeContract()) {
  return contract.runtimes.filter((runtime) => runtime.support === 'supported');
}

function formatRuntimeChoices(contract = loadRuntimeContract()) {
  return listInstallableRuntimes(contract).map((runtime) => runtime.id).join(', ');
}

function installsAgents(runtime) {
  return runtime.layout.agentsDirectory !== null;
}

function resolveRuntimeTarget(target, contract = loadRuntimeContract()) {
  const selected = target === undefined ? contract.defaultRuntime : target;
  if (typeof selected !== 'string' || selected.trim() === '') {
    throw new Error(`Invalid installation target. Valid runtime IDs: ${formatRuntimeChoices(contract)}`);
  }

  const runtime = contract.runtimes.find((candidate) => candidate.id === selected)
    || contract.runtimes.find((candidate) => (candidate.aliases || []).includes(selected));
  if (!runtime || runtime.support !== 'supported') {
    const legacyHint = selected === '.agents'
      ? ' .agents is a destination path, not an installable runtime ID; use codex for Codex skills.'
      : '';
    throw new Error(`Invalid installation target "${selected}". Valid runtime IDs: ${formatRuntimeChoices(contract)}.${legacyHint}`);
  }
  return runtime;
}

module.exports = {
  REPO_ROOT,
  RUNTIME_CONTRACT_PATH,
  RUNTIME_ID_PATTERN,
  isSafePathSegment,
  loadRuntimeContract,
  getRuntime,
  listInstallableRuntimes,
  formatRuntimeChoices,
  installsAgents,
  resolveRuntimeTarget,
};
