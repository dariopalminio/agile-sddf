#!/usr/bin/env node
'use strict';

/**
 * Valida de forma deliberadamente pequeña el contrato que SDDF usa de sus
 * configuraciones YAML: required es booleano y un comando npm/pnpm requerido
 * existe en el package.json del proyecto que declara la configuración.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');

function indentation(line) {
  return (line.match(/^\s*/) || [''])[0].length;
}

function unquote(value) {
  const trimmed = value.trim().replace(/\s+#.*$/, '').trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function commandForRequiredLine(lines, index, indent) {
  for (let cursor = index - 1; cursor >= 0; cursor--) {
    const line = lines[cursor];
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const lineIndent = indentation(line);
    if (lineIndent < indent) break;
    if (lineIndent !== indent) continue;
    const match = line.match(/^\s*(?:command|command_template):\s*(.+?)\s*$/);
    if (match) return unquote(match[1]);
  }
  return null;
}

function declaredScript(command) {
  const match = command.match(/^(?:npm|pnpm)\s+run\s+([^\s]+)/);
  return match ? match[1] : null;
}

function loadScripts(repoRoot, errors) {
  const file = path.join(repoRoot, 'package.json');
  try {
    const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
    return manifest.scripts && typeof manifest.scripts === 'object' ? manifest.scripts : {};
  } catch (error) {
    errors.push(`package.json: no se pudo leer (${error.message})`);
    return {};
  }
}

function verifyConfigFile(file, scripts, errors, repoRoot) {
  const label = path.relative(repoRoot, file).split(path.sep).join('/');
  if (!fs.existsSync(file)) {
    errors.push(`${label}: archivo requerido no encontrado`);
    return;
  }
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  for (let index = 0; index < lines.length; index++) {
    const match = lines[index].match(/^(\s*)required:\s*(.*?)\s*(?:#.*)?$/);
    if (!match) continue;
    const value = match[2];
    if (value !== 'true' && value !== 'false') {
      errors.push(`${label}:${index + 1}: required debe ser booleano true/false, no ${value || '(vacío)'}`);
      continue;
    }
    if (value !== 'true') continue;
    const command = commandForRequiredLine(lines, index, match[1].length);
    if (!command) continue; // Un worker requerido se valida por verify-profiles.
    const script = declaredScript(command);
    if (script && !Object.prototype.hasOwnProperty.call(scripts, script)) {
      errors.push(`${label}:${index + 1}: comando requerido ${command} referencia el script inexistente ${script}`);
    }
  }
}

function verifyConfigContract({ repoRoot = REPO_ROOT, configPaths } = {}) {
  const errors = [];
  const scripts = loadScripts(repoRoot, errors);
  const files = configPaths || [
    'sddf.config.yaml',
    'skills/sddf-init/assets/sddf.config.yaml.template',
  ];
  for (const relativePath of files) {
    verifyConfigFile(path.resolve(repoRoot, relativePath), scripts, errors, repoRoot);
  }
  return { errors };
}

function main() {
  const result = verifyConfigContract();
  if (result.errors.length) {
    console.error('[ERROR] Contrato de configuración inválido:');
    for (const error of result.errors) console.error(`- ${error}`);
  } else {
    console.log('[OK] Contrato de configuración válido.');
  }
  process.exitCode = result.errors.length ? 1 : 0;
}

if (require.main === module) main();

module.exports = { verifyConfigContract };
