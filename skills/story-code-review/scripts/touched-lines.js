#!/usr/bin/env node
'use strict';

/**
 * Motor de líneas tocadas de story-code-review (STORY-181, ADR-0021 D-6).
 *
 * Clasifica cada `Archivo:Línea` de un hallazgo respecto de la base de la rama
 * (`git merge-base HEAD <rama principal>`) y el working tree, que incluye los commits de la rama y
 * los cambios sin commit:
 *
 *   - `untouched` — el archivo existía en la base y ninguna línea del rango cambió
 *   - `touched`   — alguna línea del rango cambió, o el archivo no existe en la base
 *   - `unknown`   — la ubicación no se puede leer, el archivo no existe o git falló
 *
 * Invariante: nunca devuelve `untouched` sin evidencia de git; ante cualquier duda, `touched` o
 * `unknown`. El árbitro (Paso 4a.2 de SKILL.md) solo puede marcar PREEXISTENTE una ubicación
 * `untouched`.
 *
 * Uso: node touched-lines.js classify --repo-root <dir> --locations <archivo.json>
 *      <archivo.json>: arreglo JSON de cadenas `Archivo:Línea` (o `Archivo:N-M`).
 *
 * Salida: un único objeto JSON en stdout
 *   { ok: true, applied, reason, message, baseRef, base, locations: [ { location, file, start, end, status, why } ] }
 * Con `applied: false`, `reason` dice por qué no hay base y `locations` es `[]`.
 *
 * Exit code: 0 siempre que se emita el JSON (también con `applied: false`); 2 ante argumentos
 * inválidos o JSON ilegible (error en stderr). No escribe archivos ni lee stdin.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const MESSAGES = {
  'git-unavailable': 'git no está disponible',
  'not-a-repo': 'el directorio no es un repositorio git',
  'detached-head': 'HEAD separado: no hay rama que comparar con la rama principal',
  'no-main-branch': 'no se encontró la rama principal (origin/HEAD, main o master)',
  'on-main-branch': 'la revisión corre en la rama principal: no hay base que separe los cambios de la historia',
  'no-merge-base': 'no hay ancestro común con la rama principal',
};

const LOCATION_RE = /^(.+):(\d+)(?:-(\d+))?$/;
const HUNK_RE = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/gm;

function git(repoRoot, args) {
  const result = spawnSync('git', args, { cwd: repoRoot, encoding: 'utf8', windowsHide: true });
  return { ok: !result.error && result.status === 0, stdout: result.stdout || '' };
}

/** `<ruta>:<N>` o `<ruta>:<N>-<M>` → `{ file, start, end }` con ruta relativa normalizada, o `null`. */
function parseLocation(text) {
  if (typeof text !== 'string') return null;
  const match = LOCATION_RE.exec(text.trim().replace(/^`+|`+$/g, '').trim());
  if (!match) return null;
  const file = match[1].replace(/\\/g, '/').replace(/^(\.\/)+/, '');
  const start = Number(match[2]);
  const end = match[3] === undefined ? start : Number(match[3]);
  if (start < 1 || end < start) return null;
  if (file === '' || file.startsWith('/') || /^[A-Za-z]:/.test(file)) return null;
  if (file.split('/').includes('..')) return null;
  return { file, start, end };
}

/**
 * Líneas del lado nuevo que tocan los hunks de un diff `-U0`: `c` a `c+d-1` si `d > 0`; si `d = 0`
 * (solo borrado), las vecinas `c` y `c+1`. `d` ausente equivale a 1.
 */
function touchedLines(diffText) {
  const touched = new Set();
  for (const match of String(diffText).matchAll(HUNK_RE)) {
    const start = Number(match[1]);
    const count = match[2] === undefined ? 1 : Number(match[2]);
    if (count === 0) {
      touched.add(start);
      touched.add(start + 1);
    } else {
      for (let line = start; line < start + count; line++) touched.add(line);
    }
  }
  return touched;
}

function notApplied(reason) {
  return { applied: false, reason, message: MESSAGES[reason], baseRef: null, base: null };
}

/** Rama principal en el orden de D-2: destino de `origin/HEAD`, `main` o `master` locales. */
function findMainBranch(repoRoot) {
  const remote = git(repoRoot, ['symbolic-ref', '-q', '--short', 'refs/remotes/origin/HEAD']);
  const candidates = [
    remote.ok && remote.stdout.trim() ? { ref: remote.stdout.trim(), verify: remote.stdout.trim() } : null,
    { ref: 'main', verify: 'refs/heads/main' },
    { ref: 'master', verify: 'refs/heads/master' },
  ].filter(Boolean);
  for (const candidate of candidates) {
    if (git(repoRoot, ['rev-parse', '--verify', '-q', `${candidate.verify}^{commit}`]).ok) return candidate.ref;
  }
  return null;
}

/** Resuelve la base de la rama; `applied: false` con el primer `reason` de D-2 que aplique. */
function resolveBase(repoRoot) {
  if (!git(undefined, ['--version']).ok) return notApplied('git-unavailable');
  if (!fs.existsSync(repoRoot) || !git(repoRoot, ['rev-parse', '--show-toplevel']).ok) return notApplied('not-a-repo');
  const current = git(repoRoot, ['symbolic-ref', '--short', '-q', 'HEAD']).stdout.trim();
  if (!current) return notApplied('detached-head');
  const baseRef = findMainBranch(repoRoot);
  if (!baseRef) return notApplied('no-main-branch');
  if (current === baseRef.replace(/^origin\//, '')) return notApplied('on-main-branch');
  const mergeBase = git(repoRoot, ['merge-base', 'HEAD', baseRef]);
  if (!mergeBase.ok || !mergeBase.stdout.trim()) return notApplied('no-merge-base');
  return { applied: true, reason: null, message: null, baseRef, base: mergeBase.stdout.trim() };
}

/**
 * Evidencia de un archivo frente a la base, calculada una vez por archivo:
 * `{ status: 'unknown' | 'new' | 'diff', why?, lines?, whole? }`.
 */
function fileEvidence(repoRoot, base, file) {
  const absolute = path.join(repoRoot, ...file.split('/'));
  if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
    return { status: 'unknown', why: 'el archivo no existe en el working tree' };
  }
  if (!git(repoRoot, ['cat-file', '-e', `${base}:./${file}`]).ok) {
    return { status: 'new', why: 'el archivo no existe en la base (nuevo, renombrado o sin seguimiento)' };
  }
  const diff = git(repoRoot, ['diff', '-U0', '--no-color', '--no-ext-diff', '--no-textconv', base, '--', file]);
  if (!diff.ok) return { status: 'unknown', why: 'git diff falló para el archivo' };
  const lines = touchedLines(diff.stdout);
  // Un diff sin hunks (binario, cambio de modo) no prueba qué líneas siguen intactas.
  return { status: 'diff', lines, whole: diff.stdout.trim() !== '' && lines.size === 0 };
}

function classifyOne(location, parsed, evidence) {
  const entry = { location, file: parsed.file, start: parsed.start, end: parsed.end };
  if (evidence.status === 'unknown') return { ...entry, status: 'unknown', why: evidence.why };
  if (evidence.status === 'new') return { ...entry, status: 'touched', why: evidence.why };
  if (evidence.whole) return { ...entry, status: 'touched', why: 'el archivo cambió sin hunks de línea legibles' };
  for (let line = parsed.start; line <= parsed.end; line++) {
    if (evidence.lines.has(line)) return { ...entry, status: 'touched', why: `la línea ${line} cambió respecto de la base` };
  }
  return { ...entry, status: 'untouched', why: 'el archivo existe en la base y el rango no cambió' };
}

/** Clasifica `locations` (cadenas `Archivo:Línea`) contra la base de la rama de `repoRoot` (I-2). */
function classifyLocations({ repoRoot, locations }) {
  const base = resolveBase(repoRoot);
  if (!base.applied) return { ok: true, ...base, locations: [] };
  const evidenceByFile = new Map();
  const classified = locations.map((location) => {
    const parsed = parseLocation(location);
    if (!parsed) {
      return { location, file: null, start: null, end: null, status: 'unknown', why: 'la ubicación no tiene la forma <ruta>:<N> o <ruta>:<N>-<M> relativa al repositorio' };
    }
    if (!evidenceByFile.has(parsed.file)) evidenceByFile.set(parsed.file, fileEvidence(repoRoot, base.base, parsed.file));
    return classifyOne(location, parsed, evidenceByFile.get(parsed.file));
  });
  return { ok: true, ...base, locations: classified };
}

function fail(message) {
  process.stderr.write(`touched-lines: ${message}\n`);
  process.exit(2);
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = {};
  for (let i = 0; i < rest.length; i += 2) {
    if (!['--repo-root', '--locations'].includes(rest[i]) || rest[i + 1] === undefined) fail(`argumento inválido: ${rest[i]}`);
    options[rest[i].slice(2)] = rest[i + 1];
  }
  return { command, options };
}

function readLocations(file) {
  // Los mensajes nombran solo el archivo, nunca la ruta absoluta del host.
  const name = path.basename(file);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`no se pudo leer ${name} como JSON (${error.code || error.name})`);
  }
  if (!Array.isArray(data) || data.some((item) => typeof item !== 'string')) fail(`${name} no es un arreglo JSON de cadenas`);
  return data;
}

function main(argv) {
  const { command, options } = parseArgs(argv);
  if (command !== 'classify') fail(`subcomando desconocido: ${command || '(ninguno)'}; uso: classify --repo-root <dir> --locations <archivo.json>`);
  if (!options['repo-root']) fail('falta --repo-root');
  if (!options.locations) fail('falta --locations');
  const locations = readLocations(options.locations);
  const result = classifyLocations({ repoRoot: path.resolve(options['repo-root']), locations });
  process.stdout.write(`${JSON.stringify(result)}\n`);
}

if (require.main === module) main(process.argv.slice(2));

module.exports = { parseLocation, touchedLines, resolveBase, classifyLocations };
