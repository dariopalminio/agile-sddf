#!/usr/bin/env node
'use strict';

/**
 * Verifica que cada skill fuente tenga evals ejecutables o una excepción
 * versionada, con dueño y fecha de revisión. No invoca ningún LLM.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const CASE_ID = /^TC-\d{3,}$/;
const SKILL_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function readJson(file, errors, label = file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    errors.push(`${label}: JSON inválido o ilegible (${error.message})`);
    return null;
  }
}

function listSkills(skillsDir, errors) {
  if (!fs.existsSync(skillsDir)) {
    errors.push('skills/: directorio fuente no encontrado');
    return [];
  }
  return fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function readExemptions(repoRoot, errors) {
  const file = path.join(repoRoot, 'config', 'eval-exemptions.json');
  if (!fs.existsSync(file)) {
    errors.push('config/eval-exemptions.json: falta el inventario de excepciones de evals');
    return new Map();
  }
  const manifest = readJson(file, errors, 'config/eval-exemptions.json');
  if (!manifest || manifest.version !== 1 || !Array.isArray(manifest.exemptions)) {
    if (manifest) errors.push('config/eval-exemptions.json: se espera version: 1 y exemptions: []');
    return new Map();
  }

  const exemptions = new Map();
  for (const item of manifest.exemptions) {
    if (!item || typeof item !== 'object') {
      errors.push('config/eval-exemptions.json: contiene una excepción no válida');
      continue;
    }
    const { skill, owner, reason, review_by: reviewBy } = item;
    if (typeof skill !== 'string' || !SKILL_NAME.test(skill)) {
      errors.push(`config/eval-exemptions.json: skill inválido (${String(skill)})`);
      continue;
    }
    if (exemptions.has(skill)) {
      errors.push(`config/eval-exemptions.json: excepción duplicada para ${skill}`);
      continue;
    }
    if (typeof owner !== 'string' || !owner.trim() || typeof reason !== 'string' || !reason.trim()) {
      errors.push(`config/eval-exemptions.json: ${skill} debe declarar owner y reason no vacíos`);
    }
    if (typeof reviewBy !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(reviewBy)) {
      errors.push(`config/eval-exemptions.json: ${skill} debe declarar review_by en formato YYYY-MM-DD`);
    }
    exemptions.set(skill, item);
  }
  return exemptions;
}

function verifyManifest(skill, manifestPath, errors) {
  const manifest = readJson(manifestPath, errors, `skills/${skill}/evals/evals.json`);
  if (!manifest) return;
  if (!Array.isArray(manifest.cases) || manifest.cases.length === 0) {
    errors.push(`skills/${skill}/evals/evals.json: cases[] debe contener al menos un caso`);
    return;
  }

  const seen = new Set();
  for (const testCase of manifest.cases) {
    const id = testCase && testCase.id;
    if (typeof id !== 'string' || !CASE_ID.test(id)) {
      errors.push(`skills/${skill}/evals/evals.json: ID de caso inválido (${String(id)})`);
      continue;
    }
    if (seen.has(id)) errors.push(`skills/${skill}/evals/evals.json: ID de caso duplicado (${id})`);
    seen.add(id);
  }
}

function verifyEvalInventory(repoRoot = REPO_ROOT) {
  const errors = [];
  const skillsDir = path.join(repoRoot, 'skills');
  const skills = listSkills(skillsDir, errors);
  const exemptions = readExemptions(repoRoot, errors);
  const missing = new Set();

  for (const skill of skills) {
    const skillDir = path.join(skillsDir, skill);
    const skillMd = path.join(skillDir, 'SKILL.md');
    const manifestPath = path.join(skillDir, 'evals', 'evals.json');
    if (!fs.existsSync(skillMd)) errors.push(`skills/${skill}/SKILL.md: falta el contrato del skill`);
    if (!fs.existsSync(manifestPath)) {
      missing.add(skill);
      if (!exemptions.has(skill)) {
        errors.push(`skills/${skill}: no tiene evals/evals.json ni una excepción versionada`);
      }
      continue;
    }
    if (exemptions.has(skill)) {
      errors.push(`config/eval-exemptions.json: ${skill} ya tiene evals y no debe seguir exento`);
    }
    verifyManifest(skill, manifestPath, errors);
  }

  for (const skill of exemptions.keys()) {
    if (!skills.includes(skill)) {
      errors.push(`config/eval-exemptions.json: ${skill} no existe en skills/`);
    } else if (!missing.has(skill)) {
      // El error más preciso se agrega arriba; esta rama deja explícita la
      // intención al leer el resultado estructurado.
    }
  }

  return { errors, skills, missing: [...missing].sort(), exemptions: [...exemptions.keys()].sort() };
}

function main() {
  const result = verifyEvalInventory();
  if (process.argv.includes('--json')) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } else if (result.errors.length) {
    console.error('[ERROR] Inventario de evals inválido:');
    for (const error of result.errors) console.error(`- ${error}`);
  } else {
    console.log(`[OK] Inventario de evals válido: ${result.skills.length} skills; ${result.exemptions.length} excepción(es) explícita(s).`);
  }
  process.exitCode = result.errors.length ? 1 : 0;
}

if (require.main === module) main();

module.exports = { verifyEvalInventory };
