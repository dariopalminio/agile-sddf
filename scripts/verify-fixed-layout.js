#!/usr/bin/env node
'use strict';

/**
 * Validador no mutante del contrato de layout fijo (ADR-0016, STORY-148).
 *
 * Uso:
 *   node scripts/verify-fixed-layout.js [--quiet] [--json]
 *
 * Comprueba únicamente archivos de la fuente del repositorio. No lee variables de
 * entorno ni sddf.config.yaml: con el mismo árbol produce el mismo resultado.
 */

const fs = require('node:fs');
const path = require('node:path');

const LAYOUT_MARKER = '<!-- SDDF-FIXED-LAYOUT: v1 -->';
const REQUIRED_BLOCK_TOKENS = ['REPO_ROOT', 'specs/flow/', 'docs/templates/', 'docs/guardrails/'];
const LEGACY_TOKENS = ['SDDF-ROOT-RESOLUTION: v1', 'SPECS_BASE', 'SDDF_ROOT'];
const DIAGNOSTIC_SKILL = 'skill-preflight';
const REGION_START = '<!-- SDDF-LEGACY-DIAGNOSTIC:start -->';
const REGION_END = '<!-- SDDF-LEGACY-DIAGNOSTIC:end -->';

// Lista transitoria de EPIC-26: cada historia de migración retira los skills que
// migra; STORY-157 verifica que quede vacía al cerrar la épica.
const PENDING_MIGRATION = [];

const ACTIVE_DOCS = [
  'AGENTS.md',
  'README.md',
  'docs/constitution.md',
  'docs/domains/domain.md',
  'docs/guides/root-folder-practices.md',
  'docs/guides/sddf-commands-pipeline.md',
  'docs/guides/skill-structural-pattern.md',
  'docs/guides/harness-eng-agents-orchestration.md',
  'docs/guides/best-practices-for-skills.md',
  'docs/guides/artifact-directory-migration.md',
];

function rel(repoRoot, file) {
  return path.relative(repoRoot, file).split(path.sep).join('/');
}

function read(file, errors, label) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch (error) {
    errors.push(`${label}: no se pudo leer (${error.message})`);
    return null;
  }
}

function listSourceSkills(skillsDir, errors) {
  if (!fs.existsSync(skillsDir)) {
    errors.push('skills/: directorio fuente no encontrado');
    return [];
  }
  return fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      name: entry.name,
      file: path.join(skillsDir, entry.name, 'SKILL.md'),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
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

// Devuelve los índices de línea exentos de R3/R4 por la región de diagnóstico.
// Una región mal formada se reporta y no exime nada.
function diagnosticRegion(name, file, lines, errors) {
  const exempt = new Set();
  if (name !== DIAGNOSTIC_SKILL) {
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed === REGION_START || trimmed === REGION_END) {
        errors.push(`${file}:${index + 1}: la región SDDF-LEGACY-DIAGNOSTIC solo se admite en skill-preflight`);
      }
    });
    return exempt;
  }
  const regionErrors = [];
  let open = -1;
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed === REGION_START) {
      if (open !== -1) regionErrors.push(`${file}:${open + 1}: región SDDF-LEGACY-DIAGNOSTIC sin cerrar`);
      open = index;
    } else if (trimmed === REGION_END) {
      if (open === -1) {
        regionErrors.push(`${file}:${index + 1}: región SDDF-LEGACY-DIAGNOSTIC sin abrir`);
      } else {
        for (let inner = open + 1; inner < index; inner += 1) exempt.add(inner);
        open = -1;
      }
    }
  });
  if (open !== -1) regionErrors.push(`${file}:${open + 1}: región SDDF-LEGACY-DIAGNOSTIC sin cerrar`);
  if (regionErrors.length) {
    errors.push(...regionErrors);
    exempt.clear();
  }
  return exempt;
}

function checkSkillLayout(name, content) {
  const file = `skills/${name}/SKILL.md`;
  const errors = [];
  const lines = content.split(/\r?\n/);

  const marker = lines.findIndex((line) => line.trim() === LAYOUT_MARKER);
  if (marker === -1) {
    errors.push(`${file}: falta el contrato de layout fijo (${LAYOUT_MARKER})`);
  } else {
    let end = lines.findIndex((line, index) => index > marker && /^#{1,6}\s/.test(line));
    if (end === -1) end = lines.length;
    const block = lines.slice(marker + 1, end).join('\n');
    for (const token of REQUIRED_BLOCK_TOKENS) {
      if (!block.includes(token)) errors.push(`${file}:${marker + 1}: el bloque del contrato no declara \`${token}\``);
    }
  }

  const exempt = diagnosticRegion(name, file, lines, errors);
  lines.forEach((line, index) => {
    if (exempt.has(index)) return;
    for (const token of LEGACY_TOKENS) {
      if (line.includes(token)) errors.push(`${file}:${index + 1}: referencia legada \`${token}\``);
    }
    if (/\broot\b/.test(line) && line.includes('sddf.config.yaml')) {
      errors.push(`${file}:${index + 1}: lee la clave legada \`root\` de sddf.config.yaml`);
    }
  });

  return errors;
}

function verifyFixedLayout({ repoRoot, pending = PENDING_MIGRATION }) {
  const errors = [];
  const warnings = [];
  const skillsDir = path.join(repoRoot, 'skills');
  const skills = listSourceSkills(skillsDir, errors);
  const names = skills.map((skill) => skill.name);

  for (const entry of pending) {
    if (!names.includes(entry)) errors.push(`PENDING_MIGRATION: ${entry} no existe en skills/ — retíralo de la lista`);
  }

  const pendingPresent = [];
  for (const skill of skills) {
    const content = read(skill.file, errors, rel(repoRoot, skill.file));
    if (content === null) continue;
    const layoutErrors = checkSkillLayout(skill.name, content);
    if (pending.includes(skill.name)) {
      pendingPresent.push(skill.name);
      if (!layoutErrors.length) errors.push(`PENDING_MIGRATION: ${skill.name} ya cumple el contrato — retíralo de la lista`);
    } else {
      errors.push(...layoutErrors);
    }
    if (skill.name !== DIAGNOSTIC_SKILL) {
      const stale = findStalePreflightClaim(content);
      if (stale) {
        errors.push(`${rel(repoRoot, skill.file)}: conserva una dependencia automática de skill-preflight (${stale})`);
      }
    }
  }

  for (const skill of skills.filter((item) => item.name !== DIAGNOSTIC_SKILL)) {
    for (const file of collectSupportFiles(path.dirname(skill.file))) {
      const content = read(file, errors, rel(repoRoot, file));
      if (content === null) continue;
      if (findStalePreflightClaim(content)) {
        errors.push(`${rel(repoRoot, file)}: evidencia o ejemplo conserva el preflight automático`);
      }
    }
  }

  const envTemplate = read(path.join(repoRoot, '.env.template'), errors, '.env.template');
  if (envTemplate !== null && /^\s*SDDF_ROOT\s*=/m.test(envTemplate)) {
    errors.push('.env.template: SDDF_ROOT no debe quedar asignada (layout fijo, ADR-0016)');
  }

  for (const docPath of ACTIVE_DOCS) {
    const content = read(path.join(repoRoot, docPath), errors, docPath);
    if (content !== null && findStalePreflightClaim(content)) {
      errors.push(`${docPath}: declara preflight automático en documentación vigente`);
    }
  }

  const preflight = read(path.join(skillsDir, DIAGNOSTIC_SKILL, 'SKILL.md'), errors, `skills/${DIAGNOSTIC_SKILL}/SKILL.md`);
  if (preflight !== null) {
    if (!/diagn[oó]stico expl[ií]cito/i.test(preflight)) {
      errors.push('skills/skill-preflight/SKILL.md: debe declararse como diagnóstico explícito');
    }
    if (/openspec\/config\.yaml/i.test(preflight)) {
      errors.push('skills/skill-preflight/SKILL.md: conserva una verificación OpenSpec retirada');
    }
  }

  if (pendingPresent.length) {
    warnings.push(`${pendingPresent.length} skill(s) pendientes de migración al layout fijo (EPIC-26): ${pendingPresent.join(', ')}`);
  }

  return { errors, warnings, skills: names, pending: pendingPresent };
}

module.exports = {
  ACTIVE_DOCS,
  DIAGNOSTIC_SKILL,
  LAYOUT_MARKER,
  LEGACY_TOKENS,
  PENDING_MIGRATION,
  REQUIRED_BLOCK_TOKENS,
  checkSkillLayout,
  verifyFixedLayout,
};

if (require.main === module) {
  const result = verifyFixedLayout({ repoRoot: path.resolve(__dirname, '..') });
  if (process.argv.includes('--json')) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } else if (!process.argv.includes('--quiet')) {
    console.log('── Contrato de layout fijo ──');
    for (const warning of result.warnings) console.log(`[WARN] ${warning}`);
    for (const error of result.errors) console.error(`[ERROR] ${error}`);
    if (!result.errors.length) {
      console.log(`[OK] Contrato de layout fijo verificado en ${result.skills.length} skill(s); ${result.pending.length} pendiente(s) de migración.`);
    }
  }
  process.exitCode = result.errors.length ? 1 : 0;
}
