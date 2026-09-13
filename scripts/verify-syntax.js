#!/usr/bin/env node
'use strict';

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');

function listJavaScriptFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listJavaScriptFiles(file));
    else if (entry.isFile() && entry.name.endsWith('.js')) files.push(file);
  }
  return files;
}

function verifySyntax(repoRoot = REPO_ROOT) {
  const errors = [];
  const files = ['scripts', 'test'].flatMap((dir) => listJavaScriptFiles(path.join(repoRoot, dir)));
  for (const file of files) {
    const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    if (result.status !== 0 || result.error) {
      const label = path.relative(repoRoot, file).split(path.sep).join('/');
      errors.push(`${label}: ${result.error ? result.error.message : (result.stderr || 'falló node --check').trim()}`);
    }
  }
  return { errors, files };
}

function main() {
  const result = verifySyntax();
  if (result.errors.length) {
    console.error('[ERROR] Errores de sintaxis:');
    for (const error of result.errors) console.error(`- ${error}`);
  } else {
    console.log(`[OK] Sintaxis válida en ${result.files.length} archivos JavaScript.`);
  }
  process.exitCode = result.errors.length ? 1 : 0;
}

if (require.main === module) main();

module.exports = { verifySyntax };
