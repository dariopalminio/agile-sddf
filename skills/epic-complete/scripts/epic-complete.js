#!/usr/bin/env node
'use strict';

/**
 * Motor de epic-complete (STORY-171, STORY-172): completa y archiva una épica liberada o cancelada.
 *
 *   - `SHIP/DONE`      → escribe `status: COMPLETED`, `updated:` y `completed:` de hoy y `version:` de la
 *                        versión liberada, y archiva con la fecha de hoy (action `complete`)
 *   - `COMPLETED/DONE` → archiva sin escribir nada en `epic.md` (action `archive-only`)
 *   - `CANCELED/DONE`  → archiva sin escribir nada en `epic.md`: conserva su status (action `archive-canceled`)
 *   - `CANCELED/<otro>` se rechaza con `CANCELED_NOT_DONE`; cualquier otro estado, con `NOT_SHIPPED`
 *
 * Destino (ADR-0019): `specs/flow/archive/<YYYY-MM-DD>-EPIC-NN-<slug>/`. En `archive-only` y
 * `archive-canceled` la fecha sale de `updated:` → `created:` → `date:` (este solo si faltan las dos
 * claves anteriores), como en `story-complete.js`. `--version` solo participa en `complete`.
 *
 * Versión liberada (D-4): `--version` → encabezado `## [x.y.z]` de `CHANGELOG.md` que contiene el bloque
 * `<!-- epic-ship:EPIC-NN:start -->` → `NO_VERSION`.
 *
 * `plan` es de solo lectura; `apply` re-planifica, escribe, mueve con `git mv` (o `rename` si el
 * directorio no tiene historial) y restaura `epic.md` si el movimiento falla. La confirmación humana la
 * pide el SKILL.md entre ambos subcomandos: el motor nunca lee stdin.
 *
 * Uso: node epic-complete.js <plan|apply> --repo-root <dir> (--id EPIC-NN | --path <ruta>) [--version <x.y.z>]
 *
 * Salida: un único objeto JSON en stdout. Exit code: 0 si `ok: true`; 1 si `ok: false`;
 * 2 ante argumentos inválidos (error en stderr).
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const FLOW = 'specs/flow';
const ARCHIVE = `${FLOW}/archive`;

const ID_RE = /^EPIC-\d{2,}$/;
const ACTIVE_EPIC_RE = /^EPIC-\d{2,}-/;
const ARCHIVED_EPIC_RE = /^\d{4}-\d{2}-\d{2}-EPIC-\d{2,}-/;
const EPIC_PATH_RE = /^specs\/flow\/EPIC-\d{2,}-[^/]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const VERSION_RE = /^v?\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;

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

/** Épicas activas + archivadas (invariante de conteo). */
function countEpics(repoRoot) {
  return countDirs(repoRoot, FLOW, ACTIVE_EPIC_RE) + countDirs(repoRoot, ARCHIVE, ARCHIVED_EPIC_RE);
}

const BOM_RE = /^﻿/;
const FIELD_RE = /^([A-Za-z0-9_-]+):\s*(.*)$/;

/** Clave y valor normalizado (comillas y espacios quitados) de una línea de nivel superior; null si no lo es. */
function parseField(line) {
  const match = FIELD_RE.exec(line);
  return match ? { key: match[1], value: match[2].trim().replace(/^(["'])(.*)\1$/, '$2').trim() } : null;
}

/** Índice de la línea `---` de cierre del frontmatter; -1 si no hay frontmatter o no cierra. */
function frontmatterClose(lines) {
  if (lines[0].trim() !== '---') return -1;
  return lines.findIndex((line, i) => i > 0 && line.trim() === '---');
}

/** Pares `clave: valor` de nivel superior del frontmatter; null si no hay frontmatter. */
function readFrontmatter(text) {
  const lines = text.replace(BOM_RE, '').split(/\r?\n/);
  const close = frontmatterClose(lines);
  if (close === -1) return null;
  const fields = {};
  for (const line of lines.slice(1, close)) {
    const field = parseField(line);
    if (field) fields[field.key] = field.value;
  }
  return fields;
}

/** Fecha de archivo (D-6): `updated:` → `created:`; `date:` solo si faltan ambas claves; null si ninguno. */
function archiveDateOf(frontmatter) {
  const keys = 'updated' in frontmatter || 'created' in frontmatter ? ['updated', 'created'] : ['date'];
  const found = keys.map((key) => frontmatter[key]).find((value) => value !== undefined && DATE_RE.test(value));
  return found || null;
}

/**
 * Versión liberada de la épica en `CHANGELOG.md` (D-4): el encabezado `## [...]` más cercano por encima
 * de `<!-- epic-ship:<epicId>:start -->`. `reason`: `found`, `unreleased` (bajo `[Unreleased]`, otro
 * encabezado que no es versión o ninguno) o `no-block`. El llamador usa `no-changelog` sin el archivo.
 */
function releasedVersionOf(changelogText, epicId) {
  const lines = changelogText.replace(BOM_RE, '').split(/\r?\n/);
  const marker = new RegExp(`^\\s*<!--\\s*epic-ship:${epicId}:start\\s*-->\\s*$`);
  const blockAt = lines.findIndex((line) => marker.test(line));
  if (blockAt === -1) return { version: null, reason: 'no-block' };
  for (let i = blockAt - 1; i >= 0; i -= 1) {
    const heading = /^## \[([^\]]+)\]/.exec(lines[i]);
    if (!heading) continue;
    const label = heading[1].trim();
    return VERSION_RE.test(label) ? { version: label.replace(/^v/, ''), reason: 'found' } : { version: null, reason: 'unreleased' };
  }
  return { version: null, reason: 'unreleased' };
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

function fail(code, message, extra = {}) {
  return { ok: false, code, message, ...extra };
}

/** Localiza la épica solo en el primer nivel de `specs/flow/`; nunca resuelve dentro de `specs/flow/archive/`. */
function locateEpic({ repoRoot, id, epicPath }) {
  let dir;
  if (epicPath !== undefined) {
    const rel = path.relative(repoRoot, path.resolve(repoRoot, epicPath)).split(path.sep).join('/');
    if (!EPIC_PATH_RE.test(rel)) {
      return fail('INVALID_PATH', `La ruta ${epicPath} no es una épica de specs/flow/ (se esperaba specs/flow/EPIC-NN-<slug>/)`);
    }
    if (!fs.existsSync(abs(repoRoot, rel)) || !fs.statSync(abs(repoRoot, rel)).isDirectory()) {
      return fail('NOT_FOUND', `No se encontró el directorio ${rel}/`);
    }
    dir = rel;
  } else {
    const matches = entries(repoRoot, FLOW).filter((e) => e.isDirectory() && e.name.startsWith(`${id}-`)).map((e) => `${FLOW}/${e.name}`);
    if (matches.length === 0) {
      const archived = entries(repoRoot, ARCHIVE).find((e) => e.isDirectory() && new RegExp(`^\\d{4}-\\d{2}-\\d{2}-${id}-`).test(e.name));
      const hint = archived ? `; ya archivada en ${ARCHIVE}/${archived.name}/` : '';
      return fail('NOT_FOUND', `No se encontró la épica ${id} en ${FLOW}/${id}-*/${hint}`);
    }
    if (matches.length > 1) {
      return fail('AMBIGUOUS', `Hay ${matches.length} directorios para ${id} en ${FLOW}/: ${matches.join(', ')}. Deja uno solo o indica la ruta explícita.`, { matches });
    }
    dir = matches[0];
  }
  if (!fs.existsSync(abs(repoRoot, `${dir}/epic.md`))) return fail('NO_EPIC_FILE', `No se encontró epic.md en ${dir}/`);
  return { ok: true, dir };
}

/** git-mv si REPO_ROOT es raíz de un work tree y el directorio tiene archivos versionados (D-7). */
function moveMethodOf(repoRoot, dir) {
  if (!isRepoRoot(repoRoot)) return 'rename';
  const tracked = git(repoRoot, ['ls-files', '--', dir]);
  return tracked.status === 0 && tracked.stdout.trim() !== '' ? 'git-mv' : 'rename';
}

const NO_VERSION_REASONS = {
  unreleased: (epicId) => `la entrada de ${epicId} sigue en [Unreleased]: promuévela a ## [x.y.z] al liberar`,
  'no-block': (epicId) => `no se encontró la entrada de ${epicId} en CHANGELOG.md`,
  'no-changelog': (epicId) => `no se encontró la entrada de ${epicId} en CHANGELOG.md`,
};

/** Versión liberada de la action `complete` (D-4); `{ ok: false, … }` si no se resuelve. */
function resolveVersion(repoRoot, epicId, version) {
  const changelog = abs(repoRoot, 'CHANGELOG.md');
  const fromChangelog = fs.existsSync(changelog) ? releasedVersionOf(fs.readFileSync(changelog, 'utf8'), epicId) : { version: null, reason: 'no-changelog' };
  if (version !== undefined) {
    const normalized = version.replace(/^v/, '');
    const warnings = fromChangelog.version && fromChangelog.version !== normalized
      ? [`⚠️ CHANGELOG.md ubica ${epicId} en ${fromChangelog.version}; se usará --version ${normalized}`]
      : [];
    return { ok: true, version: normalized, versionSource: 'argument', warnings };
  }
  if (fromChangelog.version) return { ok: true, version: fromChangelog.version, versionSource: 'changelog', warnings: [] };
  return {
    ok: false,
    reason: fromChangelog.reason,
    message: `No se pudo determinar la versión liberada de ${epicId}: ${NO_VERSION_REASONS[fromChangelog.reason](epicId)}. Reejecuta con --version x.y.z`,
  };
}

/** Plan de solo lectura (tabla de admisión, D-3, D-4, D-6, D-9; STORY-172 D-1, D-4, D-5). */
function planCompletion({ repoRoot, id, epicPath, version, today }) {
  const located = locateEpic({ repoRoot, id, epicPath });
  if (!located.ok) return located;
  const { dir } = located;
  const epicId = /^EPIC-\d{2,}/.exec(path.posix.basename(dir))[0];

  const frontmatter = readFrontmatter(fs.readFileSync(abs(repoRoot, `${dir}/epic.md`), 'utf8'));
  if (!frontmatter || !frontmatter.status || !frontmatter.substatus) {
    return fail('NO_STATUS', `${dir}/epic.md no declara el estado en el frontmatter (campos buscados: status, substatus)`);
  }
  const { status, substatus } = frontmatter;
  const epic = { id: epicId, dir, status, substatus };
  const state = `${status}/${substatus}`;

  let action;
  if (status === 'SHIP' && substatus === 'DONE') action = 'complete';
  else if (status === 'COMPLETED' && substatus === 'DONE') action = 'archive-only';
  else if (status === 'CANCELED' && substatus === 'DONE') action = 'archive-canceled';
  else if (status === 'CANCELED') {
    return fail('CANCELED_NOT_DONE', `La épica ${epicId} no puede archivarse: estado actual ${state}. Solo se archivan las épicas canceladas con substatus DONE.`, { epic });
  } else {
    const hint = state === 'VALIDATE/DONE' ? ` Ejecuta antes /epic-ship ${epicId}` : '';
    return fail('NOT_SHIPPED', `La épica ${epicId} está en ${state}: solo se completan épicas en SHIP/DONE, COMPLETED/DONE o CANCELED/DONE.${hint}`, { epic });
  }

  let resolved = { version: null, versionSource: null, warnings: [] };
  if (action === 'complete') {
    resolved = resolveVersion(repoRoot, epicId, version);
    if (!resolved.ok) return fail('NO_VERSION', resolved.message, { epic, action, reason: resolved.reason });
  }

  const archiveDate = action === 'complete' ? today : archiveDateOf(frontmatter);
  if (!archiveDate) {
    return fail('NO_ARCHIVE_DATE', `La épica ${epicId} no tiene fecha de archivo válida (YYYY-MM-DD): se buscó updated:, created: y date:.`, { epic, action });
  }
  const to = `${ARCHIVE}/${archiveDate}-${path.posix.basename(dir)}`;
  if (fs.existsSync(abs(repoRoot, to))) {
    return fail('ARCHIVE_CONFLICT', `El destino ${to}/ ya existe: no se archiva para no anidar la épica dentro de él`, { epic, action, archiveDate, from: dir, to });
  }

  const moveMethod = moveMethodOf(repoRoot, dir);
  const warnings = [...resolved.warnings, ...(moveMethod === 'rename' ? [`⚠️ ${dir} no tiene historial de git: se moverá sin git mv`] : [])];
  return {
    ok: true, code: 'OK', message: `${epicId} lista para completar y archivar en ${to}/`,
    epic, action, archiveDate, version: resolved.version, versionSource: resolved.versionSource, from: dir, to, moveMethod, warnings,
  };
}

/**
 * Edición mínima del frontmatter (D-5): `status: COMPLETED`, `updated:` y `completed:` de hoy y
 * `version:`. Cada línea conserva su propio final; las insertadas usan el del frontmatter. Lanza si no
 * localiza el cierre o la línea `status: SHIP` (→ `WRITE_FAILED`).
 */
function completeEpicFrontmatter(text, today, version) {
  const parts = text.replace(BOM_RE, '').split(/(\r?\n)/);
  const lines = parts.filter((_, i) => i % 2 === 0);
  const eols = parts.filter((_, i) => i % 2 === 1);
  let close = frontmatterClose(lines);
  if (close === -1) throw new Error('el frontmatter no tiene la línea --- de cierre');
  const lastKeyAt = (key) => {
    for (let i = close - 1; i > 0; i -= 1) if (parseField(lines[i])?.key === key) return i;
    return -1;
  };
  /** Reemplaza la última línea `key:` o la inserta tras `afterKey:` (o antes del cierre). */
  const upsert = (key, value, afterKey) => {
    const at = lastKeyAt(key);
    if (at !== -1) {
      lines[at] = `${key}: ${value}`;
      return;
    }
    const after = lastKeyAt(afterKey);
    const insertAt = after === -1 ? close : after + 1;
    lines.splice(insertAt, 0, `${key}: ${value}`);
    eols.splice(insertAt, 0, eols[0]);
    close += 1;
  };
  const statusAt = lastKeyAt('status');
  if (statusAt === -1 || parseField(lines[statusAt]).value !== 'SHIP') throw new Error('no se localizó la línea status: SHIP en el frontmatter');
  lines[statusAt] = 'status: COMPLETED';
  upsert('updated', today, 'created');
  upsert('completed', today, 'updated');
  upsert('version', version, 'completed');
  return lines.map((line, i) => line + (eols[i] ?? '')).join('');
}

/** Mueve el directorio (D-7); nunca lanza. */
function moveEpic(repoRoot, from, to, moveMethod) {
  if (moveMethod === 'git-mv') {
    const result = git(repoRoot, ['mv', from, to]);
    return result.status === 0 ? { ok: true } : { ok: false, error: (result.stderr || result.error?.message || '').trim() };
  }
  try {
    fs.renameSync(abs(repoRoot, from), abs(repoRoot, to));
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

/** Re-planifica, escribe, mueve y verifica el conteo, en el orden de D-8. Nunca hace commit. */
function applyCompletion({ repoRoot, id, epicPath, version, today }) {
  const plan = planCompletion({ repoRoot, id, epicPath, version, today });
  if (!plan.ok) return plan;
  const { epic, action, from, to, moveMethod } = plan;
  const result = { ...plan, warnings: plan.warnings.map((w) => w.replace('se moverá sin git mv', 'se movió sin git mv')) };

  const before = countEpics(repoRoot);
  const file = abs(repoRoot, `${from}/epic.md`);
  const original = fs.readFileSync(file);

  if (action === 'complete') {
    try {
      fs.writeFileSync(file, Buffer.from(completeEpicFrontmatter(original.toString('utf8'), today, plan.version), 'utf8'));
    } catch (error) {
      return { ...result, ok: false, code: 'WRITE_FAILED', message: `No se pudo escribir ${from}/epic.md (${error.message}); no se movió nada` };
    }
  }

  fs.mkdirSync(abs(repoRoot, ARCHIVE), { recursive: true });
  const moved = moveEpic(repoRoot, from, to, moveMethod);
  if (!moved.ok) {
    if (action === 'complete') {
      try {
        fs.writeFileSync(file, original);
      } catch (error) {
        return {
          ...result, ok: false, code: 'ROLLBACK_FAILED', counts: { before, after: countEpics(repoRoot) },
          message: `El movimiento de ${from}/ falló (${moved.error}) y no se pudo restaurar ${from}/epic.md (${error.message}). Recupéralo con: git checkout -- ${from}/epic.md`,
        };
      }
    }
    return {
      ...result, ok: false, code: 'MOVE_FAILED', counts: { before, after: countEpics(repoRoot) },
      message: `No se pudo mover ${from}/ a ${to}/ (${moved.error}). ${action === 'complete' ? 'epic.md se restauró a su contenido previo' : 'epic.md no se modificó'}`,
    };
  }

  const after = countEpics(repoRoot);
  if (after !== before) {
    return { ...result, ok: false, code: 'COUNT_MISMATCH', counts: { before, after }, message: `activas + archivadas = ${after} tras mover ${from}/ a ${to}/, pero antes eran ${before}` };
  }
  const message = action === 'archive-canceled' ? `${epic.id} archivada como CANCELED (status sin cambios): ${to}/` : `${epic.id} archivada en ${to}/`;
  return { ...result, code: 'OK', message, counts: { before, after } };
}

function localToday() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  if (command !== 'plan' && command !== 'apply') throw new Error(`subcomando no reconocido: ${command ?? '(ninguno)'} (usa plan o apply)`);
  const opts = {};
  for (let i = 0; i < rest.length; i += 2) {
    const flag = rest[i];
    const value = rest[i + 1];
    const key = { '--repo-root': 'repoRoot', '--id': 'id', '--path': 'epicPath', '--version': 'version' }[flag];
    if (!key) throw new Error(`argumento no reconocido: ${flag}`);
    if (value === undefined || value.startsWith('--')) throw new Error(`${flag} requiere un valor`);
    opts[key] = value;
  }
  if (!opts.repoRoot) throw new Error('falta --repo-root <dir>');
  if ((opts.id === undefined) === (opts.epicPath === undefined)) throw new Error('indica exactamente uno de --id EPIC-NN o --path <ruta>');
  if (opts.id !== undefined && !ID_RE.test(opts.id)) throw new Error(`--id mal formado: ${opts.id} (se esperaba EPIC-NN)`);
  if (opts.version !== undefined && !VERSION_RE.test(opts.version)) throw new Error(`--version mal formado: ${opts.version} (se esperaba x.y.z)`);
  return { command, opts: { ...opts, repoRoot: path.resolve(opts.repoRoot) } };
}

function main() {
  let parsed;
  try {
    parsed = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(`[ERROR] ${error.message}`);
    console.error('Uso: node epic-complete.js <plan|apply> --repo-root <dir> (--id EPIC-NN | --path <ruta>) [--version <x.y.z>]');
    process.exit(2);
  }
  const run = parsed.command === 'plan' ? planCompletion : applyCompletion;
  const result = run({ ...parsed.opts, today: localToday() });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  process.exit(result.ok ? 0 : 1);
}

if (require.main === module) main();

module.exports = { locateEpic, archiveDateOf, releasedVersionOf, planCompletion, applyCompletion };
