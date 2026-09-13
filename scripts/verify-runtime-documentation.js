#!/usr/bin/env node
'use strict';

/*
 * Evita que la tabla visible de runtimes se convierta en otra fuente de
 * verdad. README conserva una presentación humana, delimitada por marcadores,
 * pero cada fila debe derivarse exactamente de config/runtimes.json.
 */

const fs = require('fs');
const path = require('path');
const { loadRuntimeContract } = require('./runtime-contract.js');

const REPO_ROOT = path.resolve(__dirname, '..');
const START = '<!-- runtime-contract:start -->';
const END = '<!-- runtime-contract:end -->';
const RUNTIME_GUIDANCE_ROOTS = [
  'README.md',
  'SECURITY.md',
  'AGENTS.md',
  'docs/index.md',
  'docs/policies',
  'docs/guardrails',
  'docs/guides',
  'docs/runbooks',
];
const RUNTIME_LAYOUT_PATH = /(?:(?:~[\\/])?\.(?:claude|opencode|agents|github|copilot)[\\/](?:skills|agents)|~[\\/]\.config[\\/]opencode[\\/](?:skills|agents))/i;

function destinationPath(segments, global = false) {
  const rendered = `${global ? '~/' : ''}${segments.join('/')}/`;
  return `\`${rendered}\``;
}

function expectedRow(runtime) {
  return `| ${runtime.name} | \`${runtime.id}\` | ${destinationPath(runtime.destinations.local.rootSegments)} | ${destinationPath(runtime.destinations.global.rootSegments, true)} |`;
}

function extractTable(contents, errors) {
  const start = contents.indexOf(START);
  const end = contents.indexOf(END);
  if (start === -1 || end === -1 || end <= start) {
    errors.push(`README.md debe delimitar la tabla derivada con ${START} y ${END}`);
    return '';
  }
  return contents.slice(start + START.length, end);
}

function documentedTargets(table) {
  return [...table.matchAll(/^\|[^\n]*?\|\s*`([^`]+)`\s*\|/gm)]
    .map((match) => match[1])
    .filter((target) => target !== '--target');
}

function walkMarkdown(target, files) {
  const stat = fs.statSync(target);
  if (stat.isFile()) {
    if (path.extname(target).toLowerCase() === '.md') files.push(target);
    return;
  }
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    const candidate = path.join(target, entry.name);
    if (entry.isDirectory()) walkMarkdown(candidate, files);
    else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.md') files.push(candidate);
  }
}

function verifyRuntimeGuidanceReferences(repoRoot, errors) {
  const files = [];
  for (const relativePath of RUNTIME_GUIDANCE_ROOTS) {
    const candidate = path.join(repoRoot, relativePath);
    if (!fs.existsSync(candidate)) {
      errors.push(`Documentación activa requerida ausente: ${relativePath}`);
      continue;
    }
    walkMarkdown(candidate, files);
  }
  const runtimeFiles = [];
  for (const filePath of files) {
    const contents = fs.readFileSync(filePath, 'utf8');
    if (!RUNTIME_LAYOUT_PATH.test(contents)) continue;
    runtimeFiles.push(path.relative(repoRoot, filePath).split(path.sep).join('/'));
    if (!contents.includes('config/runtimes.json')) {
      errors.push(`${runtimeFiles.at(-1)}: documenta layout de runtime sin derivarlo de config/runtimes.json`);
    }
  }
  return runtimeFiles.sort();
}

function verifyRuntimeDocumentation(repoRoot = REPO_ROOT) {
  const errors = [];
  const readmePath = path.join(repoRoot, 'README.md');
  let readme;
  try {
    readme = fs.readFileSync(readmePath, 'utf8');
  } catch (error) {
    return { errors: [`README.md: no se pudo leer (${error.message})`] };
  }

  let contract;
  try {
    contract = loadRuntimeContract(path.join(repoRoot, 'config', 'runtimes.json'));
  } catch (error) {
    return { errors: [error.message] };
  }
  const runtimes = contract.runtimes.filter((runtime) => runtime.support === 'supported');
  const table = extractTable(readme, errors);
  if (!table) return { errors };

  const targets = documentedTargets(table);
  const expectedTargets = new Set(runtimes.map((runtime) => runtime.id));
  for (const runtime of runtimes) {
    const row = expectedRow(runtime);
    if (!table.includes(row)) {
      errors.push(`README.md: falta o difiere la fila canónica para ${runtime.id}`);
    }
  }
  for (const target of targets) {
    if (!expectedTargets.has(target)) {
      errors.push(`README.md: runtime documentado que no existe en config/runtimes.json: ${target}`);
    }
  }

  const aliases = runtimes.flatMap((runtime) => runtime.aliases || []);
  for (const alias of aliases) {
    if (!readme.includes(`\`${alias}\``)) {
      errors.push(`README.md: falta documentar el alias de migración ${alias}`);
    }
  }
  if (!readme.includes('`.agents/skills`') || !readme.includes('no es un target válido')) {
    errors.push('README.md: debe explicar que .agents/skills es compatibilidad y no un target instalable');
  }

  const runtimeFiles = verifyRuntimeGuidanceReferences(repoRoot, errors);

  return { errors, runtimes: runtimes.map((runtime) => runtime.id), runtimeFiles };
}

function main() {
  const result = verifyRuntimeDocumentation();
  if (result.errors.length) {
    console.error('[ERROR] Contrato de documentación de runtimes inválido:');
    for (const error of result.errors) console.error(`- ${error}`);
  } else {
    console.log(`[OK] README documenta ${result.runtimes.length} runtime(s) y ${result.runtimeFiles.length} documento(s) activo(s) derivan sus layouts de config/runtimes.json.`);
  }
  process.exitCode = result.errors.length ? 1 : 0;
}

if (require.main === module) main();

module.exports = {
  START,
  END,
  RUNTIME_GUIDANCE_ROOTS,
  destinationPath,
  expectedRow,
  verifyRuntimeDocumentation,
  verifyRuntimeGuidanceReferences,
};
