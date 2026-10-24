#!/usr/bin/env node
'use strict';

/**
 * Migra los work items de `docs/specs/` al layout fijo de ADR-0016 (STORY-153).
 * Un solo uso — STORY-153: no es un comando reutilizable ni archiva work items futuros (CS-11).
 *
 * Reglas de destino (design.md › D-3):
 *   - docs/specs/epics/EPIC-NN-<slug>/                       → specs/flow/EPIC-NN-<slug>/
 *   - docs/specs/stories/STORY-NNN-<slug>/ con COMPLETED      → specs/flow/archive/<fecha>-STORY-NNN-<slug>/
 *   - docs/specs/stories/STORY-NNN-<slug>/ con otro status    → specs/flow/STORY-NNN-<slug>/ (incluye CANCELED)
 *   - docs/specs/README.md                                    → specs/README.md
 *
 * Fecha del archivo (design.md › D-4): `updated:` → `created:` → `date:` (este último solo si faltan
 * los dos primeros), con formato YYYY-MM-DD.
 *
 * El plan se valida completo antes de mover (D-5): cualquier entrada no reconocida, story sin
 * status o sin fecha, origen sin archivos versionados o destino existente bloquea la ejecución sin
 * mover nada. Los movimientos usan `git mv` (conservan el historial) y quedan en el índice; el
 * commit lo hace el mantenedor. Es idempotente: sin `docs/specs/` no hay nada que migrar. No
 * escribe logs, reportes ni eventos.
 *
 * Uso: node scripts/migrate-specs-to-flow.js [--dry-run]
 *   --dry-run  lista los movimientos planificados sin escribir nada
 *
 * Exit code: 0 sin bloqueos ni errores; 1 en cualquier otro caso.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..');

const SOURCE = 'docs/specs';
const EPICS_DIR = `${SOURCE}/epics`;
const STORIES_DIR = `${SOURCE}/stories`;
const FLOW = 'specs/flow';
const ARCHIVE = `${FLOW}/archive`;

const EPIC_RE = /^EPIC-\d{2}-.+$/;
const STORY_RE = /^STORY-\d{3}-.+$/;
const ACTIVE_STORY_RE = /^STORY-\d{3}-/;
const ARCHIVED_STORY_RE = /^\d{4}-\d{2}-\d{2}-STORY-\d{3}-/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function git(repoRoot, args) {
  return spawnSync('git', args, { cwd: repoRoot, encoding: 'utf8' });
}

const abs = (repoRoot, rel) => path.join(repoRoot, ...rel.split('/'));

function entries(repoRoot, rel) {
  const dir = abs(repoRoot, rel);
  return fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)) : [];
}

function countDirs(repoRoot, rel, re) {
  return entries(repoRoot, rel).filter((e) => e.isDirectory() && re.test(e.name)).length;
}

/** Pares `clave: valor` de nivel superior del frontmatter; null si no hay frontmatter. */
function readFrontmatter(file) {
  const lines = fs.readFileSync(file, 'utf8').replace(/^﻿/, '').split(/\r?\n/);
  if (lines[0].trim() !== '---') return null;
  const fields = {};
  for (const line of lines.slice(1)) {
    if (line.trim() === '---') return fields;
    const match = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (match) fields[match[1]] = match[2].trim().replace(/^(["'])(.*)\1$/, '$2').trim();
  }
  return null;
}

/** Fecha del prefijo de archivo (D-4): `updated:` → `created:` → `date:` si faltan ambos. */
function archiveDate(frontmatter) {
  const keys = 'updated' in frontmatter || 'created' in frontmatter ? ['updated', 'created'] : ['date'];
  const found = keys.map((key) => frontmatter[key]).find((value) => value !== undefined && DATE_RE.test(value));
  return found || null;
}

function isRepoRoot(repoRoot) {
  const result = git(repoRoot, ['rev-parse', '--show-toplevel']);
  if (result.status !== 0) return false;
  const normalize = (p) => {
    const real = path.resolve(fs.realpathSync.native(p));
    return process.platform === 'win32' ? real.toLowerCase() : real;
  };
  return normalize(result.stdout.trim()) === normalize(repoRoot);
}

/** Directorio de primer nivel bajo epics/ o stories/ (o README.md) al que pertenece una ruta. */
function ownerOf(rel) {
  const parts = rel.split('/');
  return parts.length > 3 ? parts.slice(0, 4).join('/') : rel;
}

/** Plan de movimientos de solo lectura (D-2, D-3, D-4, D-5, D-8). */
function planMigration({ repoRoot }) {
  const plan = {
    docsSpecsExists: fs.existsSync(abs(repoRoot, SOURCE)),
    moves: [],
    blockers: [],
    warnings: [],
    totals: { epics: 0, active: 0, archived: 0, previous: 0, preexisting: 0 },
  };
  if (!plan.docsSpecsExists) return plan;

  const gitOk = isRepoRoot(repoRoot);
  if (!gitOk) plan.blockers.push(`${repoRoot} no es la raíz de un repositorio git`);

  for (const entry of entries(repoRoot, SOURCE)) {
    const rel = `${SOURCE}/${entry.name}`;
    if (entry.isFile() && entry.name === 'README.md') plan.moves.push({ kind: 'index', from: rel, to: 'specs/README.md', date: null });
    else if (!(entry.isDirectory() && (rel === EPICS_DIR || rel === STORIES_DIR))) plan.blockers.push(`${rel}: entrada no reconocida`);
  }

  for (const entry of entries(repoRoot, EPICS_DIR)) {
    const rel = `${EPICS_DIR}/${entry.name}`;
    if (!entry.isDirectory() || !EPIC_RE.test(entry.name) || !fs.existsSync(abs(repoRoot, `${rel}/epic.md`))) {
      plan.blockers.push(`${rel}: entrada no reconocida`);
      continue;
    }
    plan.moves.push({ kind: 'epic', from: rel, to: `${FLOW}/${entry.name}`, date: null });
    plan.totals.epics++;
  }

  for (const entry of entries(repoRoot, STORIES_DIR)) {
    const rel = `${STORIES_DIR}/${entry.name}`;
    if (entry.isDirectory() && entry.name.startsWith('STORY-')) plan.totals.previous++;
    if (!entry.isDirectory() || !STORY_RE.test(entry.name) || !fs.existsSync(abs(repoRoot, `${rel}/story.md`))) {
      plan.blockers.push(`${rel}: entrada no reconocida`);
      continue;
    }
    const frontmatter = readFrontmatter(abs(repoRoot, `${rel}/story.md`));
    if (!frontmatter || !frontmatter.status) {
      plan.blockers.push(`${rel}: sin status en el frontmatter`);
      continue;
    }
    if (frontmatter.status === 'COMPLETED') {
      const date = archiveDate(frontmatter);
      if (!date) {
        plan.blockers.push(`${rel}: COMPLETED sin fecha válida (updated/created/date)`);
        continue;
      }
      plan.moves.push({ kind: 'story-archived', from: rel, to: `${ARCHIVE}/${date}-${entry.name}`, date });
      plan.totals.archived++;
    } else {
      plan.moves.push({ kind: 'story-active', from: rel, to: `${FLOW}/${entry.name}`, date: null });
      plan.totals.active++;
    }
  }

  plan.moves.sort((a, b) => a.from.localeCompare(b.from));
  plan.totals.preexisting = countDirs(repoRoot, FLOW, ACTIVE_STORY_RE) + countDirs(repoRoot, ARCHIVE, ARCHIVED_STORY_RE);

  const seen = new Set();
  for (const move of plan.moves) {
    if (fs.existsSync(abs(repoRoot, move.to))) plan.blockers.push(`${move.to} ya existe (git mv anidaría el origen)`);
    if (seen.has(move.to)) plan.blockers.push(`destino duplicado: ${move.to}`);
    seen.add(move.to);
  }

  if (gitOk) {
    const tracked = new Set(git(repoRoot, ['ls-files', '-z', '--', SOURCE]).stdout.split('\0').filter(Boolean).map(ownerOf));
    for (const move of plan.moves) {
      if (!tracked.has(move.from)) plan.blockers.push(`${move.from}: sin archivos versionados (git mv fallaría)`);
    }

    const changed = new Map();
    const status = git(repoRoot, ['status', '--porcelain', '-z', '--untracked-files=all', '--', SOURCE]).stdout.split('\0');
    for (let i = 0; i < status.length; i++) {
      if (!status[i]) continue;
      if (/^[RC]/.test(status[i])) i++; // el origen de un renombre ocupa el campo siguiente
      const owner = ownerOf(status[i].slice(3));
      changed.set(owner, (changed.get(owner) || 0) + 1);
    }
    for (const move of plan.moves) {
      if (changed.has(move.from)) {
        plan.warnings.push(`${move.from}: ${changed.get(move.from)} archivo(s) con cambios locales o sin versionar se mueven sin versionar/sin commitear`);
      }
    }
  }

  plan.blockers.sort();
  return plan;
}

function summary({ dryRun, epics, active, archived, previous, preexisting, blockers }) {
  const lines = [
    `── Resumen${dryRun ? ' (dry-run)' : ''} ─────────────`,
    `  Épicas:             ${epics}`,
    `  Stories activas:    ${active}`,
    `  Stories archivadas: ${archived}`,
    `  Total previo:       ${previous}`,
  ];
  if (preexisting > 0) lines.push(`  Preexistentes:      ${preexisting}`);
  lines.push(`  Bloqueos:           ${blockers}`, '────────────────────────────────────');
  return lines;
}

/** Calcula el plan y, sin dry-run ni bloqueos, lo aplica (D-6, D-7, D-9). */
function runMigration({ repoRoot, dryRun }) {
  const plan = planMigration({ repoRoot });
  if (!plan.docsSpecsExists) return { lines: ['[SIN CAMBIOS] docs/specs/ no existe: nada que migrar'], exitCode: 0, plan };

  const lines = [];
  const { totals } = plan;
  const warnings = plan.warnings.map((w) => `[AVISO] ${w}`);
  const blockers = plan.blockers.map((b) => `[BLOQUEO] ${b}`);

  if (dryRun || plan.blockers.length > 0) {
    lines.push(...plan.moves.map((m) => `[MOVERÍA] ${m.from} → ${m.to}`), ...blockers, ...warnings);
    lines.push(...summary({ dryRun, ...totals, blockers: plan.blockers.length }));
    return { lines, exitCode: plan.blockers.length > 0 ? 1 : 0, plan };
  }

  lines.push(...warnings);
  fs.mkdirSync(abs(repoRoot, ARCHIVE), { recursive: true });

  let moved = 0;
  for (const move of plan.moves) {
    const result = git(repoRoot, ['mv', move.from, move.to]);
    if (result.status !== 0) {
      lines.push(`[ERROR] git mv ${move.from} → ${move.to}: ${(result.stderr || '').trim()}`);
      lines.push(`[ERROR] migración detenida: ${moved} de ${plan.moves.length} movimiento(s) aplicados; vuelve a ejecutar para reanudar`);
      return { lines, exitCode: 1, plan };
    }
    lines.push(`[MOVIDO] ${move.from} → ${move.to}`);
    moved++;
  }

  let exitCode = 0;
  for (const dir of [EPICS_DIR, STORIES_DIR, SOURCE]) {
    try {
      if (fs.existsSync(abs(repoRoot, dir))) fs.rmdirSync(abs(repoRoot, dir));
    } catch {
      lines.push(`[ERROR] ${dir} no quedó vacío`);
      exitCode = 1;
    }
  }

  const active = countDirs(repoRoot, FLOW, ACTIVE_STORY_RE);
  const archived = countDirs(repoRoot, ARCHIVE, ARCHIVED_STORY_RE);
  if (active + archived !== totals.previous + totals.preexisting) {
    lines.push(`[ERROR] activas (${active}) + archivadas (${archived}) ≠ total previo (${totals.previous}) + preexistentes (${totals.preexisting})`);
    exitCode = 1;
  }

  lines.push(...summary({ dryRun, ...totals, active, archived, blockers: 0 }));
  return { lines, exitCode, plan };
}

function main() {
  const args = process.argv.slice(2);
  const unknown = args.find((arg) => arg !== '--dry-run');
  if (unknown !== undefined) {
    console.error(`[ERROR] argumento no reconocido: ${unknown}`);
    process.exit(1);
  }
  const { lines, exitCode } = runMigration({ repoRoot: REPO_ROOT, dryRun: args.includes('--dry-run') });
  for (const line of lines) console.log(line);
  process.exit(exitCode);
}

if (require.main === module) main();

module.exports = { planMigration, runMigration, archiveDate };
