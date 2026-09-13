#!/usr/bin/env node
'use strict';

/**
 * Auditor no mutante del contrato de resolución de raíces SDDF.
 *
 * Uso:
 *   node scripts/audit-root-resolution.js [--quiet] [--json]
 *
 * Comprueba únicamente archivos de la fuente del repositorio. No crea, modifica
 * ni elimina artefactos: su salida es evidencia repetible para STORY-093.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(REPO_ROOT, 'skills');
const CONTRACT_MARKER = '<!-- SDDF-ROOT-RESOLUTION: v1 -->';
const QUIET = process.argv.includes('--quiet');
const JSON_OUTPUT = process.argv.includes('--json');

const ACTIVE_DOCS = [
  'AGENTS.md',
  'README.md',
  'docs/policies/constitution.md',
  'docs/domains/domain.md',
  'docs/guides/root-folder-practices.md',
  'docs/guides/sddf-commands-pipeline.md',
  'docs/guides/skill-structural-pattern.md',
  'docs/guides/harness-eng-agents-orchestration.md',
  'docs/guides/best-practices-for-skills.md',
  'docs/guides/artifact-directory-migration.md',
];

function rel(file) {
  return path.relative(REPO_ROOT, file).split(path.sep).join('/');
}

function read(file, errors, label = rel(file)) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch (error) {
    errors.push(`${label}: no se pudo leer (${error.message})`);
    return null;
  }
}

function listSourceSkills(errors) {
  if (!fs.existsSync(SKILLS_DIR)) {
    errors.push('skills/: directorio fuente no encontrado');
    return [];
  }
  return fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      name: entry.name,
      file: path.join(SKILLS_DIR, entry.name, 'SKILL.md'),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function hasTopLevelRoot(content) {
  const match = content.match(/^root:\s*(.*?)\s*(?:#.*)?$/m);
  return Boolean(match && match[1] && !/^['"]?\s*['"]?$/.test(match[1]));
}

function findStalePreflightClaim(content) {
  const patterns = [
    /###\s+Paso 0\s*[—-]\s*Verificar entorno\s*\(`skill-preflight`\)/i,
    /(?:invocar|invoca|ejecutar|ejecuta)\s+`?\/?skill-preflight`?/i,
    /todos?\s+los\s+skills[^.\n]{0,100}(?:invocan|ejecutan)[^.\n]{0,60}skill-preflight/i,
    /(?:preflight|skill-preflight)[^.\n]{0,80}\bse\s+ejecuta\s+autom[aá]tic(?:amente)?/i,
    /entorno\s+debe\s+superar\s+el\s+preflight/i,
  ];
  return patterns.find((pattern) => pattern.test(content));
}

function collectSupportFiles(dir) {
  const files = [];
  const visit = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) visit(full);
      else if (entry.isFile() && /\.(?:md|json)$/i.test(entry.name)) files.push(full);
    }
  };
  visit(dir);
  return files;
}

function audit() {
  const errors = [];
  const warnings = [];
  const skills = listSourceSkills(errors);

  const config = read(path.join(REPO_ROOT, 'sddf.config.yaml'), errors);
  if (config !== null && !hasTopLevelRoot(config)) {
    errors.push('sddf.config.yaml: falta una clave raíz no vacía `root:`');
  }

  const initConfigAssets = [
    'sddf.config.yaml.template',
    'sddf.config.yaml.example',
  ];
  for (const name of initConfigAssets) {
    const file = path.join(SKILLS_DIR, 'sddf-init', 'assets', name);
    const content = read(file, errors);
    if (content !== null && !hasTopLevelRoot(content)) {
      errors.push(`${rel(file)}: falta una clave raíz no vacía \`root:\``);
    }
  }

  const envTemplate = read(path.join(REPO_ROOT, '.env.template'), errors);
  if (envTemplate !== null && /^\s*SDDF_ROOT\s*=/m.test(envTemplate)) {
    errors.push('.env.template: SDDF_ROOT debe documentarse como override opcional, no quedar asignada por defecto');
  }

  for (const skill of skills) {
    const content = read(skill.file, errors);
    if (content === null) continue;
    if (!content.includes(CONTRACT_MARKER)) {
      errors.push(`${rel(skill.file)}: falta el contrato local de resolución (${CONTRACT_MARKER})`);
    }
    if(/(?:\$SDDF_ROOT|\$SPECS_BASE)[/\\]sddf\.config\.yaml/i.test(content)) {
      errors.push(`${rel(skill.file)}: busca sddf.config.yaml fuera de REPO_ROOT`);
    }
    if(/\$REPO_PATH[^\r\n]{0,120}\$SDDF_ROOT/i.test(content)) {
      errors.push(`${rel(skill.file)}: deriva la ruta de código desde SDDF_ROOT en vez de REPO_ROOT`);
    }
    if (skill.name !== 'skill-preflight') {
      const stale = findStalePreflightClaim(content);
      if (stale) {
        errors.push(`${rel(skill.file)}: conserva una dependencia automática de skill-preflight (${stale})`);
      }
    }
  }

  for (const skill of skills.filter((item) => item.name !== 'skill-preflight')) {
    for (const file of collectSupportFiles(path.dirname(skill.file))) {
      const content = read(file, errors);
      if (content === null) continue;
      if (findStalePreflightClaim(content)) {
        errors.push(`${rel(file)}: evidencia o ejemplo conserva el preflight automático`);
      }
    }
  }

  for (const docPath of ACTIVE_DOCS) {
    const file = path.join(REPO_ROOT, docPath);
    const content = read(file, errors, docPath);
    if (content === null) continue;
    if (findStalePreflightClaim(content)) {
      errors.push(`${docPath}: declara preflight automático en documentación vigente`);
    }
    if (!/SDDF_ROOT/.test(content) && !/root.*sddf\.config\.yaml|sddf\.config\.yaml.*root/i.test(content)) {
      warnings.push(`${docPath}: no menciona explícitamente el contrato de raíz (revisión manual recomendada)`);
    }
  }

  const preflight = read(path.join(SKILLS_DIR, 'skill-preflight', 'SKILL.md'), errors);
  if (preflight !== null) {
    if (!/diagn[oó]stico expl[ií]cito/i.test(preflight)) {
      errors.push('skills/skill-preflight/SKILL.md: debe declararse como diagnóstico explícito');
    }
    if (/openspec\/config\.yaml/i.test(preflight)) {
      errors.push('skills/skill-preflight/SKILL.md: conserva una verificación OpenSpec retirada');
    }
  }

  return { errors, warnings, skills: skills.map((item) => item.name) };
}

const result = audit();
if (JSON_OUTPUT) {
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
} else if (!QUIET) {
  console.log('── Auditoría de resolución de raíces SDDF ──');
  for (const warning of result.warnings) console.log(`[WARN] ${warning}`);
  for (const error of result.errors) console.error(`[ERROR] ${error}`);
  if (!result.errors.length) {
    console.log(`[OK] Contrato verificado en ${result.skills.length} skill(s) fuente.`);
  }
}

process.exitCode = result.errors.length ? 1 : 0;
