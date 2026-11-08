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

const KNOWN_SECTIONS = new Set(['defaults', 'verify', 'implement', 'guardrails']);

function buildKeyPaths(lines) {
  const paths = new Set();
  const stack = [];
  for (const rawLine of lines) {
    const line = rawLine.replace(/\r$/, '');
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    let content = line.replace(/^\s+/, '');
    if (content.startsWith('- ')) content = content.slice(2).trim();
    const keyMatch = content.match(/^([A-Za-z0-9_-]+)\s*:/);
    if (!keyMatch) continue;
    const indent = line.length - line.replace(/^\s+/, '').length;
    while (stack.length && stack[stack.length - 1].indent >= indent) stack.pop();
    const parts = stack.map((entry) => entry.key).concat(keyMatch[1]);
    for (let i = 1; i <= parts.length; i++) paths.add(parts.slice(0, i).join('.'));
    stack.push({ indent, key: keyMatch[1] });
  }
  return paths;
}

function shouldFlagRoute(reference, pathSet) {
  if (/\s/.test(reference)) return false;
  const segments = reference.split('.');
  if (segments.length < 2) return false;
  if (!KNOWN_SECTIONS.has(segments[0])) return false;
  const isLiteral = (seg) => /^[A-Za-z0-9_-]+$/.test(seg);
  const isWildcard = (seg) => /^\{[A-Za-z0-9_-]+\}$/.test(seg);
  if (!segments.every((seg) => isLiteral(seg) || isWildcard(seg))) return false;
  const n = segments.length;
  for (const route of pathSet) {
    const parts = route.split('.');
    if (parts.length !== n) continue;
    if (segments.every((seg, i) => isWildcard(seg) || seg === parts[i])) return false;
  }
  return true;
}

function findSkillFiles(dir) {
  const results = [];
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name === 'SKILL.md') results.push(full);
    }
  };
  walk(dir);
  return results;
}

function verifySkillConfigReferences({
  repoRoot = REPO_ROOT,
  skillsDir = 'skills',
  templatePath = 'skills/sddf-init/assets/sddf.config.yaml.template',
  configPath = 'sddf.config.yaml',
} = {}) {
  const errors = [];
  const pathSet = new Set();
  for (const relative of [templatePath, configPath]) {
    const file = path.resolve(repoRoot, relative);
    if (fs.existsSync(file)) {
      for (const p of buildKeyPaths(fs.readFileSync(file, 'utf8').split(/\r?\n/))) pathSet.add(p);
    }
  }
  if (pathSet.size === 0) return { errors };
  const skillsRoot = path.resolve(repoRoot, skillsDir);
  if (!fs.existsSync(skillsRoot)) return { errors };
  for (const file of findSkillFiles(skillsRoot)) {
    const label = path.relative(repoRoot, file).split(path.sep).join('/');
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    const seen = new Set();
    for (let index = 0; index < lines.length; index++) {
      for (const match of lines[index].matchAll(/`([^`\n]+)`/g)) {
        const reference = match[1].trim();
        if (!shouldFlagRoute(reference, pathSet)) continue;
        const key = `${label}::${reference}`;
        if (seen.has(key)) continue;
        seen.add(key);
        errors.push(`${label}:${index + 1}: la referencia \`${reference}\` no existe en la plantilla de configuración`);
      }
    }
  }
  return { errors };
}

function verifyConfigContract({ repoRoot = REPO_ROOT, configPaths, skillsDir, templatePath } = {}) {
  const errors = [];
  const scripts = loadScripts(repoRoot, errors);
  const files = configPaths || [
    'sddf.config.yaml',
    'skills/sddf-init/assets/sddf.config.yaml.template',
  ];
  for (const relativePath of files) {
    verifyConfigFile(path.resolve(repoRoot, relativePath), scripts, errors, repoRoot);
  }
  errors.push(...verifySkillConfigReferences({ repoRoot, skillsDir, templatePath }).errors);
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

module.exports = { verifyConfigContract, verifySkillConfigReferences };
