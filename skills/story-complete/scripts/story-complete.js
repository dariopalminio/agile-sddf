#!/usr/bin/env node
'use strict';

/**
 * Motor de story-complete (STORY-160): completa y archiva una historia entregada.
 *
 *   - `DELIVER/DONE`   → escribe `status: COMPLETED` y `updated: <hoy>` y archiva (action `complete`)
 *   - `COMPLETED/DONE` → archiva sin escribir nada en `story.md` (action `archive-only`)
 *   - cualquier otro estado, incluido `CANCELED`, se rechaza sin tocar nada
 *
 * Destino (ADR-0016): `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/`, con la fecha de
 * `updated:` (o `created:` si falta). La regla de fecha y las regex de conteo replican las de
 * `scripts/migrate-specs-to-flow.js` (CR-004), sin el respaldo `date:` (alcance de STORY-164).
 *
 * `plan` es de solo lectura; `apply` re-planifica, escribe, mueve con `git mv` (o `rename` si el
 * directorio no tiene historial) y restaura `story.md` si el movimiento falla. La confirmación
 * humana la pide el SKILL.md entre ambos subcomandos: el motor nunca lee stdin.
 *
 * Uso: node story-complete.js <plan|apply> --repo-root <dir> (--id STORY-NNN | --path <ruta>)
 *
 * Salida: un único objeto JSON en stdout. Exit code: 0 si `ok: true`; 1 si `ok: false`;
 * 2 ante argumentos inválidos (error en stderr).
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const FLOW = 'specs/flow';
const ARCHIVE = `${FLOW}/archive`;

const ID_RE = /^STORY-\d{3}$/;
const ACTIVE_STORY_RE = /^STORY-\d{3}-/;
const ARCHIVED_STORY_RE = /^\d{4}-\d{2}-\d{2}-STORY-\d{3}-/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const STORY_PATH_RE = /^specs\/flow\/STORY-\d{3}-[^/]+$/;

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

/** Historias activas + archivadas (invariante de conteo de CNF-4). */
function countStories(repoRoot) {
  return countDirs(repoRoot, FLOW, ACTIVE_STORY_RE) + countDirs(repoRoot, ARCHIVE, ARCHIVED_STORY_RE);
}

/** Pares `clave: valor` de nivel superior del frontmatter; null si no hay frontmatter. */
function readFrontmatter(text) {
  const lines = text.replace(/^﻿/, '').split(/\r?\n/);
  if (lines[0].trim() !== '---') return null;
  const fields = {};
  for (const line of lines.slice(1)) {
    if (line.trim() === '---') return fields;
    const match = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (match) fields[match[1]] = match[2].trim().replace(/^(["'])(.*)\1$/, '$2').trim();
  }
  return null;
}

/** Fecha de archivo (D-4): primer valor válido de `updated:` → `created:`; null si ninguno. */
function archiveDateOf(frontmatter) {
  const found = ['updated', 'created'].map((key) => frontmatter[key]).find((value) => value !== undefined && DATE_RE.test(value));
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

function fail(code, message, extra = {}) {
  return { ok: false, code, message, ...extra };
}

/** Localiza la historia solo en el primer nivel de `specs/flow/` (D-3). */
function locateStory({ repoRoot, id, storyPath }) {
  let dir;
  if (storyPath !== undefined) {
    const rel = path.relative(repoRoot, path.resolve(repoRoot, storyPath)).split(path.sep).join('/');
    if (!STORY_PATH_RE.test(rel)) {
      return fail('INVALID_PATH', `La ruta ${storyPath} no es una historia de specs/flow/ (se esperaba specs/flow/STORY-NNN-<slug>/)`);
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
      return fail('NOT_FOUND', `No se encontró la historia ${id} en ${FLOW}/${id}-*/${hint}`);
    }
    if (matches.length > 1) {
      return fail('AMBIGUOUS', `Hay ${matches.length} directorios para ${id} en ${FLOW}/: ${matches.join(', ')}. Deja uno solo o indica la ruta explícita.`, { matches });
    }
    dir = matches[0];
  }
  if (!fs.existsSync(abs(repoRoot, `${dir}/story.md`))) return fail('NO_STORY_FILE', `No se encontró story.md en ${dir}/`);
  return { ok: true, dir };
}

/** git-mv si REPO_ROOT es raíz de un work tree y el directorio tiene archivos versionados (D-6). */
function moveMethodOf(repoRoot, dir) {
  if (!isRepoRoot(repoRoot)) return 'rename';
  const tracked = git(repoRoot, ['ls-files', '--', dir]);
  return tracked.status === 0 && tracked.stdout.trim() !== '' ? 'git-mv' : 'rename';
}

/** Plan de solo lectura (D-2, D-3, D-4, D-6). */
function planCompletion({ repoRoot, id, storyPath, today }) {
  const located = locateStory({ repoRoot, id, storyPath });
  if (!located.ok) return located;
  const { dir } = located;
  const storyId = dir.slice(FLOW.length + 1, FLOW.length + 10);

  const frontmatter = readFrontmatter(fs.readFileSync(abs(repoRoot, `${dir}/story.md`), 'utf8'));
  if (!frontmatter || !frontmatter.status || !frontmatter.substatus) {
    return fail('NO_STATUS', `${dir}/story.md no declara el estado en el frontmatter (campos buscados: status, substatus)`);
  }
  const { status, substatus } = frontmatter;
  const story = { id: storyId, dir, status, substatus };
  const state = `${status}/${substatus}`;

  let action;
  if (status === 'DELIVER' && substatus === 'DONE') action = 'complete';
  else if (status === 'COMPLETED' && substatus === 'DONE') action = 'archive-only';
  else if (status === 'CANCELED') {
    return fail('CANCELED_NOT_ADMITTED', `La historia ${storyId} está en ${state}: ADR-0016 solo admite historias COMPLETED en ${ARCHIVE}/, así que su archivado no está disponible`, { story });
  } else {
    return fail('NOT_DELIVERED', `La historia ${storyId} está en ${state}: story-complete requiere DELIVER/DONE o COMPLETED/DONE. Ejecuta antes /story-delivery ${storyId}`, { story });
  }

  const archiveDate = action === 'complete' ? today : archiveDateOf(frontmatter);
  if (!archiveDate) {
    return fail('NO_ARCHIVE_DATE', `La historia ${storyId} no tiene fecha de archivo válida: se buscaron updated: y created: con formato YYYY-MM-DD`, { story, action });
  }
  const to = `${ARCHIVE}/${archiveDate}-${path.posix.basename(dir)}`;
  if (fs.existsSync(abs(repoRoot, to))) {
    return fail('ARCHIVE_CONFLICT', `El destino ${to}/ ya existe: no se archiva para no anidar la historia dentro de él`, { story, action, archiveDate, from: dir, to });
  }

  const moveMethod = moveMethodOf(repoRoot, dir);
  const warnings = moveMethod === 'rename' ? [`⚠️ ${dir} no tiene historial de git: se moverá sin git mv`] : [];
  return { ok: true, code: 'OK', message: `${storyId} lista para archivar en ${to}/`, story, action, archiveDate, from: dir, to, moveMethod, warnings };
}

/** Edición mínima del frontmatter (D-7): `status: COMPLETED` y `updated: <today>`, mismos finales de línea. */
function completeFrontmatter(text, today) {
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const lines = text.replace(/^﻿/, '').split(eol);
  const close = lines.findIndex((line, i) => i > 0 && line.trim() === '---');
  const block = lines.slice(1, close);
  const statusAt = block.findIndex((line) => /^status:\s*["']?DELIVER["']?\s*$/.test(line));
  block[statusAt] = 'status: COMPLETED';
  const updatedAt = block.findIndex((line) => /^updated:/.test(line));
  if (updatedAt !== -1) block[updatedAt] = `updated: ${today}`;
  else {
    const createdAt = block.findIndex((line) => /^created:/.test(line));
    block.splice(createdAt === -1 ? block.length : createdAt + 1, 0, `updated: ${today}`);
  }
  return [lines[0], ...block, ...lines.slice(close)].join(eol);
}

/** Mueve el directorio (D-6); nunca lanza. */
function moveStory(repoRoot, from, to, moveMethod) {
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

/** Re-planifica, escribe, mueve y verifica el conteo, en el orden de D-5. */
function applyCompletion({ repoRoot, id, storyPath, today }) {
  const plan = planCompletion({ repoRoot, id, storyPath, today });
  if (!plan.ok) return plan;
  const { story, action, from, to, moveMethod } = plan;
  const result = { ...plan, warnings: moveMethod === 'rename' ? [`⚠️ ${from} no tiene historial de git: se movió sin git mv`] : [] };

  const before = countStories(repoRoot);
  const file = abs(repoRoot, `${from}/story.md`);
  const original = fs.readFileSync(file);

  if (action === 'complete') {
    try {
      fs.writeFileSync(file, Buffer.from(completeFrontmatter(original.toString('utf8'), today), 'utf8'));
    } catch (error) {
      return { ...result, ok: false, code: 'WRITE_FAILED', message: `No se pudo escribir ${from}/story.md (${error.message}); no se movió nada` };
    }
  }

  fs.mkdirSync(abs(repoRoot, ARCHIVE), { recursive: true });
  const moved = moveStory(repoRoot, from, to, moveMethod);
  if (!moved.ok) {
    if (action === 'complete') {
      try {
        fs.writeFileSync(file, original);
      } catch (error) {
        return {
          ...result, ok: false, code: 'ROLLBACK_FAILED', counts: { before, after: countStories(repoRoot) },
          message: `El movimiento de ${from}/ falló (${moved.error}) y no se pudo restaurar ${from}/story.md (${error.message}). Recupéralo con: git checkout -- ${from}/story.md`,
        };
      }
    }
    return {
      ...result, ok: false, code: 'MOVE_FAILED', counts: { before, after: countStories(repoRoot) },
      message: `No se pudo mover ${from}/ a ${to}/ (${moved.error}). ${action === 'complete' ? 'story.md se restauró a su contenido previo' : 'story.md no se modificó'}`,
    };
  }

  const after = countStories(repoRoot);
  if (after !== before) {
    return { ...result, ok: false, code: 'COUNT_MISMATCH', counts: { before, after }, message: `activas + archivadas = ${after} tras mover ${from}/ a ${to}/, pero antes eran ${before}` };
  }
  return { ...result, code: 'OK', message: `${story.id} archivada en ${to}/`, counts: { before, after } };
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
    const key = { '--repo-root': 'repoRoot', '--id': 'id', '--path': 'storyPath' }[flag];
    if (!key) throw new Error(`argumento no reconocido: ${flag}`);
    if (value === undefined || value.startsWith('--')) throw new Error(`${flag} requiere un valor`);
    opts[key] = value;
  }
  if (!opts.repoRoot) throw new Error('falta --repo-root <dir>');
  if ((opts.id === undefined) === (opts.storyPath === undefined)) throw new Error('indica exactamente uno de --id STORY-NNN o --path <ruta>');
  if (opts.id !== undefined && !ID_RE.test(opts.id)) throw new Error(`--id mal formado: ${opts.id} (se esperaba STORY-NNN)`);
  return { command, opts: { ...opts, repoRoot: path.resolve(opts.repoRoot) } };
}

function main() {
  let parsed;
  try {
    parsed = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(`[ERROR] ${error.message}`);
    console.error('Uso: node story-complete.js <plan|apply> --repo-root <dir> (--id STORY-NNN | --path <ruta>)');
    process.exit(2);
  }
  const run = parsed.command === 'plan' ? planCompletion : applyCompletion;
  const result = run({ ...parsed.opts, today: localToday() });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  process.exit(result.ok ? 0 : 1);
}

if (require.main === module) main();

module.exports = { locateStory, archiveDateOf, planCompletion, applyCompletion };
