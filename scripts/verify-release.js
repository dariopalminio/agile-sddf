#!/usr/bin/env node
'use strict';

/** Verificación offline previa a publicar: versión, lockfile y changelog. */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');

function readJson(file, errors, label) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    errors.push(`${label}: no se pudo leer (${error.message})`);
    return null;
  }
}

function verifyNoSelfDependency(packageJson, lockfile, errors) {
  const packageName = packageJson.name;
  if (typeof packageName !== 'string' || packageName.length === 0) return;

  const manifests = [
    ['package.json', packageJson],
    ['package-lock.json (paquete raíz)', lockfile.packages && lockfile.packages['']],
  ];
  const dependencyFields = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];

  for (const [label, manifest] of manifests) {
    if (!manifest || typeof manifest !== 'object') continue;
    for (const field of dependencyFields) {
      const dependencies = manifest[field];
      if (dependencies && typeof dependencies === 'object'
        && Object.prototype.hasOwnProperty.call(dependencies, packageName)) {
        errors.push(`${label}: ${packageName} no puede depender de sí mismo (${field}).`);
      }
    }
  }

  if (lockfile.packages && lockfile.packages[`node_modules/${packageName}`]) {
    errors.push(`package-lock.json: contiene una instalación autocontenida en node_modules/${packageName}.`);
  }
}

function verifyRelease(repoRoot = REPO_ROOT) {
  const errors = [];
  const packageJson = readJson(path.join(repoRoot, 'package.json'), errors, 'package.json');
  const lockfile = readJson(path.join(repoRoot, 'package-lock.json'), errors, 'package-lock.json');
  if (!packageJson || !lockfile) return { errors };

  const version = packageJson.version;
  if (typeof version !== 'string' || !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
    errors.push(`package.json: version SemVer inválida (${String(version)})`);
    return { errors };
  }
  const lockVersion = lockfile.packages && lockfile.packages[''] && lockfile.packages[''].version;
  if (lockVersion !== version) {
    errors.push(`package-lock.json: versión raíz ${String(lockVersion)} no coincide con package.json ${version}`);
  }
  if (lockfile.version !== version) {
    errors.push(`package-lock.json: versión superior ${String(lockfile.version)} no coincide con package.json ${version}`);
  }
  if (lockfile.name !== packageJson.name) {
    errors.push(`package-lock.json: nombre ${String(lockfile.name)} no coincide con package.json ${String(packageJson.name)}`);
  }
  verifyNoSelfDependency(packageJson, lockfile, errors);

  const changelogPath = path.join(repoRoot, 'CHANGELOG.md');
  let changelog = '';
  try {
    changelog = fs.readFileSync(changelogPath, 'utf8');
  } catch (error) {
    errors.push(`CHANGELOG.md: no se pudo leer (${error.message})`);
    return { errors };
  }
  const headings = [...changelog.matchAll(/^## \[([^\]]+)\](?:\s+[—-]\s+(\d{4}-\d{2}-\d{2})(?:\s+.*)?)?\s*$/gm)]
    .map((match) => ({ version: match[1], date: match[2] || null, heading: match[0] }));
  const releases = headings.filter((heading) => heading.version !== 'Unreleased');
  const matching = releases.filter((heading) => heading.version === version);
  const occurrences = matching.length;
  if (occurrences !== 1) {
    errors.push(`CHANGELOG.md: se requiere exactamente una sección [${version}] (encontradas ${occurrences})`);
  } else if (!matching[0].date) {
    errors.push(`CHANGELOG.md: la sección [${version}] debe usar el formato \`## [${version}] — YYYY-MM-DD\``);
  }
  const versions = headings.map((heading) => heading.version);
  const duplicates = [...new Set(versions.filter((heading, index) => versions.indexOf(heading) !== index))];
  if (duplicates.length) errors.push(`CHANGELOG.md: secciones de versión duplicadas: ${duplicates.join(', ')}`);

  return { errors, version };
}

function main() {
  const result = verifyRelease();
  if (result.errors.length) {
    console.error('[ERROR] Release gate inválido:');
    for (const error of result.errors) console.error(`- ${error}`);
  } else {
    console.log(`[OK] Release gate válido para ${result.version}.`);
  }
  process.exitCode = result.errors.length ? 1 : 0;
}

if (require.main === module) main();

module.exports = { verifyRelease };
