#!/usr/bin/env node
'use strict';

/**
 * memory-system.js — motor determinista del skill `memory-system` (STORY-095, STORY-096).
 *
 * Subcomandos:
 *   detect   --root <SPECS_BASE> [--harness h]
 *   index    --root <SPECS_BASE> [--harness h] [--dry-run] [--template <ruta>] [--date YYYY-MM-DD]
 *   scaffold --root <SPECS_BASE> [--cli-root <CLI_ROOT>] [--harness h] [--dry-run] [--force] [--date YYYY-MM-DD]
 *
 * Solo usa módulos nativos (`node:fs`, `node:path`, `node:process`) para funcionar en
 * proyectos consumidores sin `package.json` (NFR-2). Node >= 18. Las rutas se normalizan
 * con `/` y se ordenan con comparación ordinal, de modo que la salida es idéntica en
 * Windows, macOS y Linux.
 *
 * Exit codes: 0 éxito · 2 error de uso, raíz inexistente, harness no admitido o template
 * desalineado (nunca escribe en esos casos) · 1 error inesperado.
 */

const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');

// ---------------------------------------------------------------------------
// Constantes (D-2, D-3, D-4)
// ---------------------------------------------------------------------------

// Perfiles de harness. `skipLayers` y `mappings` quedan vacíos: los rellena STORY-098.
const HARNESS_PROFILES = {
  sddf: { marker: 'sddf.config.yaml', externalRoots: [], skipLayers: [], mappings: {} },
  speckit: { marker: '.specify/', externalRoots: ['specs/*/spec.md', 'specs/*/plan.md'], skipLayers: [], mappings: {} },
  openspec: {
    marker: 'openspec/',
    externalRoots: ['openspec/specs/**/spec.md', 'openspec/changes/*/proposal.md'],
    skipLayers: [],
    mappings: {},
  },
  generic: { marker: null, externalRoots: [], skipLayers: [], mappings: {} },
};

// Orden de precedencia de los marcadores (después de `--harness` explícito).
const HARNESS_ORDER = ['sddf', 'speckit', 'openspec', 'generic'];

// Las once capas de memoria (ARCH-MEMORY §2-3), en orden de directorio. Es el único catálogo:
// `scaffold` lo usa para saber qué capa falta y el índice deriva de él `KNOWN_LAYERS`.
const LAYERS = [
  'product', 'requirements', 'specs', 'domains', 'architecture', 'adr',
  'policies', 'guardrails', 'guides', 'runbooks', 'templates',
];

// Subdirectorios de `specs/` con nombre de capa propio.
const SPECS_LAYERS = { '01-projects': 'specs-projects', '02-epics': 'specs-epics', '03-stories': 'specs-stories' };

// Directorios excluidos del índice (D-3): caché, templates (wikilinks placeholder) y pre-split.
const EXCLUDED_DIRS = new Set(['.cache', 'templates', 'pre-split']);

// Capas que el template del índice puede declarar aunque no tengan nodos: la raíz, las capas de
// memoria indexables (`specs` más su desglose por nivel, `templates` excluida) y las externas.
const KNOWN_LAYERS = [
  'root',
  ...LAYERS.flatMap((layer) => (layer === 'specs' ? [layer, ...Object.values(SPECS_LAYERS)] : EXCLUDED_DIRS.has(layer) ? [] : [layer])),
  'external',
];

// Archivos cuyo slug derivado es el nombre del directorio contenedor.
const CANONICAL_FILES = new Set(['story.md', 'epic.md', 'project.md', 'spec.md', 'proposal.md', 'plan.md']);

// Exclusiones (D-3): derivados de historia, directorios de templates/caché y pre-split.
const EXCLUDED_FILES = new Set([
  'design.md', 'tasks.md', 'testcases.md', 'analyze.md', 'fix-directives.md',
  'finvest-evaluation-report.md', 'story-improvement-log.md',
]);

// Un slug declarado como `<placeholder>` pertenece a un template suelto (p. ej. adr-template.md):
// el nodo se enlaza solo por ruta y sus wikilinks no cuentan como pendientes.
const PLACEHOLDER_SLUG = /^<.*>$/;

const LAYER_PLACEHOLDER = /\{layer:([A-Za-z0-9-]+)\}/g;
const DEFAULT_TEMPLATE = path.join(__dirname, '..', 'assets', 'index-template.md');
const INDEX_FILE = 'index.md';

// Árbol semilla del scaffold (STORY-096, D-1): espejo del destino, `{date}` como único placeholder.
const SCAFFOLD_DIR = path.join(__dirname, '..', 'assets', 'scaffold');
const TEMPLATES_LAYER = 'templates';

// Templates compartidos (D-2): misma tabla que el Paso 2b de `sddf-init` (ADR-0001, un dueño por
// template). Se copian byte a byte desde `<CLI_ROOT>/skills/<owner>/assets/<name>`.
const SHARED_TEMPLATES = [
  { name: 'story-template.md', owner: 'story-creation' },
  { name: 'epic-template.md', owner: 'epic-creation' },
  { name: 'project-template.md', owner: 'project-discovery' },
  { name: 'project-intent-template.md', owner: 'project-begin' },
  { name: 'project-plan-template.md', owner: 'project-planning' },
];

// Etiqueta de cada acción del scaffold: [ejecución real, --dry-run].
const SCAFFOLD_LABELS = {
  created: ['CREADO', 'CREARÍA'],
  overwritten: ['SOBRESCRITO', 'SOBRESCRIBIRÍA'],
  preserved: ['PRESERVADO', 'PRESERVARÍA'],
  skipped: ['OMITIDO', 'OMITIRÍA'],
};

// Error de uso o de datos: se informa por stderr y termina con exit 2 sin escribir.
class UsageError extends Error {}

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

function toPosix(value) {
  return value.split(path.sep).join('/');
}

// Ruta corta para mensajes: relativa al cwd, con `/`.
function displayPath(file) {
  return toPosix(path.relative(process.cwd(), file)) || path.basename(file);
}

function stripMd(name) {
  return name.replace(/\.md$/i, '');
}

// Sin BOM y con saltos `\n`, venga de donde venga el archivo.
function normalizeText(content) {
  return String(content).replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
}

function readText(file) {
  return normalizeText(fs.readFileSync(file, 'utf8'));
}

function todayIso() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

// Comparación ordinal (por unidades de código): mismo orden en todos los SO y locales.
function ordinalCompare(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

function isDirectory(target) {
  return fs.existsSync(target) && fs.statSync(target).isDirectory();
}

// ---------------------------------------------------------------------------
// Argumentos
// ---------------------------------------------------------------------------

const COMMANDS = ['detect', 'index', 'scaffold'];
const USAGE = 'uso: memory-system.js <detect|index|scaffold> --root <SPECS_BASE> [--cli-root <CLI_ROOT>] [--harness h] [--dry-run] [--force]';

function parseArgs(argv) {
  const args = { command: null, root: null, cliRoot: null, harness: null, dryRun: false, force: false, template: null, date: null };
  const valueFlags = { '--root': 'root', '--cli-root': 'cliRoot', '--harness': 'harness', '--template': 'template', '--date': 'date' };
  const boolFlags = { '--dry-run': 'dryRun', '--force': 'force' };
  const rest = [...argv];
  while (rest.length) {
    const token = rest.shift();
    if (valueFlags[token]) args[valueFlags[token]] = rest.shift();
    else if (boolFlags[token]) args[boolFlags[token]] = true;
    else if (token.startsWith('--')) throw new UsageError(`flag desconocido: ${token}`);
    else if (!args.command) args.command = token;
    else throw new UsageError(`argumento inesperado: ${token}`);
  }
  if (!args.command) throw new UsageError(USAGE);
  if (!COMMANDS.includes(args.command)) {
    throw new UsageError(`subcomando no admitido: ${args.command} (admitidos: ${COMMANDS.join(', ')})`);
  }
  if (!args.root) throw new UsageError(`falta --root <SPECS_BASE>\n${USAGE}`);
  return args;
}

function resolveRoot(root) {
  const specsBase = path.resolve(process.cwd(), root);
  if (!isDirectory(specsBase)) throw new UsageError(`la raíz no existe o no es un directorio: ${root}`);
  return specsBase;
}

// ---------------------------------------------------------------------------
// D-2 — Detección de harness
// ---------------------------------------------------------------------------

/** Devuelve el harness forzado (validado) o el primero cuyo marcador exista en REPO_ROOT. */
function detectHarness(repoRoot, forced) {
  if (forced !== null && forced !== undefined) {
    if (!Object.prototype.hasOwnProperty.call(HARNESS_PROFILES, forced)) {
      throw new UsageError(`valor no admitido para --harness: ${forced} (admitidos: ${Object.keys(HARNESS_PROFILES).join(', ')})`);
    }
    return forced;
  }
  for (const name of HARNESS_ORDER) {
    const marker = HARNESS_PROFILES[name].marker;
    if (marker === null) return name;
    const wantsDir = marker.endsWith('/');
    const target = path.join(repoRoot, wantsDir ? marker.slice(0, -1) : marker);
    if (fs.existsSync(target) && fs.statSync(target).isDirectory() === wantsDir) return name;
  }
  return 'generic';
}

// ---------------------------------------------------------------------------
// D-3 — Frontmatter y derivación de nodos
// ---------------------------------------------------------------------------

function unquote(value) {
  const v = value.trim();
  const quoted = v.length >= 2 && ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")));
  return quoted ? v.slice(1, -1) : v;
}

function parseScalar(raw) {
  if (raw === '') return '';
  if (raw === '[]') return [];
  if (raw === 'null' || raw === '~') return null;
  return unquote(raw);
}

/**
 * Parser del subconjunto YAML del esquema canónico: escalares, cadenas entrecomilladas
 * (pueden contener `:`) y listas `- item`. Nunca lanza: sin bloque `---` inicial o sin
 * cierre devuelve `hasFrontmatter: false` y el contenido íntegro como cuerpo.
 */
function parseFrontmatter(content) {
  const text = normalizeText(content);
  const lines = text.split('\n');
  const end = lines[0] === '---' ? lines.findIndex((line, i) => i > 0 && (line === '---' || line === '...')) : -1;
  if (end === -1) return { hasFrontmatter: false, data: {}, body: text };

  const data = {};
  let currentKey = null;
  for (const raw of lines.slice(1, end)) {
    const line = raw.trimEnd();
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const item = line.match(/^\s+-\s*(.*)$/);
    if (item && currentKey !== null) {
      if (!Array.isArray(data[currentKey])) data[currentKey] = [];
      data[currentKey].push(unquote(item[1]));
      continue;
    }
    if (/^\s/.test(line)) continue; // claves anidadas: fuera del subconjunto, se ignoran
    const kv = line.match(/^([A-Za-z0-9_-]+):(?:\s+(.*))?$/);
    if (!kv) continue;
    currentKey = kv[1];
    data[currentKey] = parseScalar((kv[2] || '').trim());
  }
  return { hasFrontmatter: true, data, body: lines.slice(end + 1).join('\n') };
}

function firstHeading(body) {
  const match = body.match(/^#\s+(.+?)\s*#*\s*$/m);
  return match ? match[1].trim() : null;
}

// Wikilinks del cuerpo ignorando fences, código inline, `|alias` y `#anchor`.
function extractWikilinks(body) {
  const visible = body
    .replace(/^```[^\n]*\n[\s\S]*?^```[ \t]*$/gm, '')
    .replace(/^~~~[^\n]*\n[\s\S]*?^~~~[ \t]*$/gm, '')
    .replace(/`[^`\n]*`/g, '');
  const links = [];
  for (const match of visible.matchAll(/(?<!!)\[\[([^\]\n]+)\]\]/g)) {
    const target = match[1].split('|', 1)[0].split('#', 1)[0].trim();
    if (target) links.push(target);
  }
  return links;
}

function deriveLayer(relPath) {
  const segments = relPath.split('/');
  if (segments.length === 1) return 'root';
  if (segments[0] !== 'specs') return segments[0];
  if (segments.length === 2) return 'specs'; // archivo suelto en specs/ (p. ej. su README.md)
  return SPECS_LAYERS[segments[1]] || `specs-${segments[1]}`;
}

function deriveSlug(relPath, data) {
  if (typeof data.slug === 'string' && data.slug.trim()) return data.slug.trim();
  const segments = relPath.split('/');
  const file = segments[segments.length - 1];
  const dir = segments.length >= 2 ? segments[segments.length - 2] : null;
  if (CANONICAL_FILES.has(file) && dir) return dir;
  if (file === 'README.md') return `${dir || 'root'}-index`;
  return stripMd(file);
}

/**
 * Deriva un nodo indexable: { path, relPath, layer, slug, title, hasFrontmatter, slugPlaceholder, wikilinks }.
 * `relPath` siempre es relativa a SPECS_BASE con `/` (los nodos externos empiezan por `../`).
 */
function deriveNode(filePath, specsBase, options = {}) {
  const parsed = parseFrontmatter(readText(filePath));
  const relPath = toPosix(path.relative(specsBase, filePath));
  const data = parsed.hasFrontmatter ? parsed.data : {};
  const declaredTitle = typeof data.title === 'string' ? data.title.trim() : '';
  const slugPlaceholder = typeof data.slug === 'string' && PLACEHOLDER_SLUG.test(data.slug.trim());
  return {
    path: filePath,
    relPath,
    layer: options.external ? 'external' : deriveLayer(relPath),
    slug: deriveSlug(relPath, data),
    title: declaredTitle || firstHeading(parsed.body) || stripMd(path.basename(filePath)),
    hasFrontmatter: parsed.hasFrontmatter,
    slugPlaceholder,
    wikilinks: slugPlaceholder ? [] : extractWikilinks(parsed.body),
  };
}

function isExcludedFile(name, relPath) {
  return !/\.md$/i.test(name)
    || relPath === INDEX_FILE
    || EXCLUDED_FILES.has(name)
    || /-report\.md$/i.test(name);
}

// Archivos `.md` indexables bajo `dir` (recursivo), como rutas absolutas.
function walk(dir, specsBase, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name)) walk(full, specsBase, out);
    } else if (entry.isFile() && !isExcludedFile(entry.name, toPosix(path.relative(specsBase, full)))) {
      out.push(full);
    }
  }
  return out;
}

// Mini-glob para las raíces externas: `*` = un segmento, `**` = cero o más segmentos.
function globToRegExp(pattern) {
  const source = pattern
    .split('/')
    .map((seg) => (seg === '**' ? '(?:[^/]+/)*' : `${seg.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*')}/`))
    .join('')
    .replace(/\/$/, '');
  return new RegExp(`^${source}$`);
}

// Archivos de REPO_ROOT que casan con el patrón; se recorre solo el prefijo sin comodines.
function expandGlob(repoRoot, pattern) {
  const segments = pattern.split('/');
  const firstStar = segments.findIndex((seg) => seg.includes('*'));
  const base = path.join(repoRoot, ...segments.slice(0, firstStar === -1 ? -1 : firstStar));
  if (!isDirectory(base)) return [];
  const regex = globToRegExp(pattern);
  const found = [];
  const visit = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(full);
      else if (entry.isFile() && regex.test(toPosix(path.relative(repoRoot, full)))) found.push(full);
    }
  };
  visit(base);
  return found;
}

/** Escanea SPECS_BASE y las raíces externas del perfil; devuelve los nodos ordenados por ruta. */
function scanNodes(specsBase, harness = 'generic') {
  const repoRoot = path.dirname(specsBase);
  const profile = HARNESS_PROFILES[harness] || HARNESS_PROFILES.generic;
  const nodes = walk(specsBase, specsBase).map((file) => deriveNode(file, specsBase));
  const external = new Set(profile.externalRoots.flatMap((pattern) => expandGlob(repoRoot, pattern)));
  for (const file of external) nodes.push(deriveNode(file, specsBase, { external: true }));
  return nodes.sort((a, b) => ordinalCompare(a.relPath, b.relPath));
}

// ---------------------------------------------------------------------------
// D-4 — Render del índice desde el template
// ---------------------------------------------------------------------------

function renderEntry(node) {
  const file = path.basename(node.relPath);
  if (!node.hasFrontmatter) return `- [${file}](${node.relPath}) — ${node.title} ⚠️ sin frontmatter`;
  if (node.slugPlaceholder) return `- [${file}](${node.relPath}) — ${node.title} ⚠️ slug placeholder`;
  return `- [[${node.slug}]] — [${file}](${node.relPath}) — ${node.title}`;
}

function groupByLayer(nodes) {
  const byLayer = new Map();
  for (const node of nodes) {
    if (!byLayer.has(node.layer)) byLayer.set(node.layer, []);
    byLayer.get(node.layer).push(node);
  }
  return byLayer;
}

// Protege el template: cada placeholder debe ser una capa conocida o con nodos, y cada capa
// con nodos debe tener placeholder. Lanza UsageError (exit 2) antes de escribir nada.
function validateLayers(template, byLayer) {
  const placeholders = new Set([...template.matchAll(LAYER_PLACEHOLDER)].map((m) => m[1]));
  const known = new Set(KNOWN_LAYERS);
  for (const layer of placeholders) {
    if (!known.has(layer) && !byLayer.has(layer)) {
      throw new UsageError(`el template declara la capa desconocida {layer:${layer}} (capas conocidas: ${KNOWN_LAYERS.join(', ')})`);
    }
  }
  for (const [layer, entries] of byLayer) {
    if (!placeholders.has(layer)) {
      throw new UsageError(`la capa "${layer}" tiene ${entries.length} nodo(s) pero el template no declara {layer:${layer}}`);
    }
  }
}

// Slugs referenciados por wikilink que no resuelven a ningún nodo (ni al propio índice).
function collectPending(nodes) {
  const known = new Set(['index', ...nodes.filter((n) => !n.slugPlaceholder).map((n) => n.slug)]);
  const pending = new Set(nodes.flatMap((n) => n.wikilinks).filter((slug) => !known.has(slug)));
  return [...pending].sort(ordinalCompare);
}

function renderStats(summary) {
  return [
    `| Nodos indexados | ${summary.indexed} |`,
    `| Nodos con frontmatter | ${summary.indexed - summary.withoutFrontmatter} |`,
    `| Nodos sin frontmatter | ${summary.withoutFrontmatter} |`,
    `| Wikilinks pendientes | ${summary.pending} |`,
  ].join('\n');
}

function renderPendingSection(pending) {
  if (!pending.length) return '';
  const lines = pending.map((slug) => `- [[${slug}]] ⚠️ nodo pendiente`).join('\n');
  return `\n\n---\n\n## ⚠️ Nodos pendientes\n\nWikilinks presentes en los nodos indexados cuyo slug no resuelve a ningún artefacto:\n\n${lines}\n`;
}

/**
 * Sustituye `{layer:<capa>}`, `{stats}` y `{date}` en el template y añade la sección de
 * nodos pendientes si los hay. Devuelve `{ content, summary }`.
 */
function renderIndex(template, nodes, options = {}) {
  const byLayer = groupByLayer(nodes);
  validateLayers(template, byLayer);
  const pending = collectPending(nodes);
  const summary = {
    indexed: nodes.length,
    withoutFrontmatter: nodes.filter((n) => !n.hasFrontmatter).length,
    pending: pending.length,
  };

  const filled = template
    .replace(LAYER_PLACEHOLDER, (_, layer) => {
      const entries = (byLayer.get(layer) || []).sort((a, b) => ordinalCompare(a.relPath, b.relPath));
      return entries.length ? entries.map(renderEntry).join('\n') : '_(sin artefactos)_';
    })
    .replace(/\{stats\}/g, renderStats(summary))
    .replace(/\{date\}/g, options.date || todayIso());

  const content = pending.length ? filled.trimEnd() + renderPendingSection(pending) : filled;
  return { content: content.endsWith('\n') ? content : `${content}\n`, summary };
}

function summaryLine(summary) {
  return `nodos indexados: ${summary.indexed} · sin frontmatter: ${summary.withoutFrontmatter} · nodos pendientes: ${summary.pending}`;
}

// ---------------------------------------------------------------------------
// STORY-096 D-1/D-2/D-4 — Scaffold: árbol semilla y plantillas compartidas
// ---------------------------------------------------------------------------

// Raíz del scaffold: existe, o se crea (bootstrap) si al menos existe su directorio padre.
function resolveScaffoldRoot(root, dryRun) {
  const specsBase = path.resolve(process.cwd(), root);
  if (isDirectory(specsBase)) return specsBase;
  if (fs.existsSync(specsBase) || !isDirectory(path.dirname(specsBase))) {
    throw new UsageError(`la raíz no existe y su directorio padre tampoco: ${root}`);
  }
  if (!dryRun) fs.mkdirSync(specsBase);
  return specsBase;
}

// Archivos del árbol semilla (incluidos los `.gitkeep`), como rutas relativas con `/` ordenadas.
function listSeeds(dir, base = dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listSeeds(full, base, out);
    else if (entry.isFile()) out.push(toPosix(path.relative(base, full)));
  }
  return out.sort(ordinalCompare);
}

// Capa de un archivo del scaffold: primer segmento de la ruta, o `root` para la raíz.
function scaffoldLayer(relPath) {
  return relPath.includes('/') ? relPath.split('/')[0] : 'root';
}

/**
 * Copia-si-falta del árbol semilla y de las plantillas compartidas sobre `options.root`.
 * Por archivo: ausente → `created`; presente → `preserved` (o `overwritten` con `force`);
 * capa en `skipLayers` del harness → `skipped`. Nunca elimina nada; con `dryRun` no escribe.
 * Devuelve { root, harness, missingLayers, entries[], warnings[], summary }.
 */
function scaffold(options) {
  const dryRun = Boolean(options.dryRun);
  const force = Boolean(options.force);
  const scaffoldDir = options.scaffoldDir || SCAFFOLD_DIR;
  if (!isDirectory(scaffoldDir)) throw new UsageError(`no se encuentra el árbol semilla del scaffold: ${displayPath(scaffoldDir)}`);

  const specsBase = resolveScaffoldRoot(options.root, dryRun);
  const harness = detectHarness(path.dirname(specsBase), options.harness);
  const skipLayers = new Set((HARNESS_PROFILES[harness] || HARNESS_PROFILES.generic).skipLayers);
  const date = options.date || todayIso();
  const seeds = listSeeds(scaffoldDir);

  for (const layer of LAYERS) {
    if (!seeds.some((rel) => scaffoldLayer(rel) === layer)) {
      throw new UsageError(`el árbol semilla no cubre la capa "${layer}": ${displayPath(scaffoldDir)}`);
    }
  }
  const missingLayers = LAYERS.filter((layer) => !isDirectory(path.join(specsBase, layer)));

  const entries = [];
  const warnings = [];
  const summary = { created: 0, overwritten: 0, preserved: 0, skippedByHarness: 0 };

  // Decide la acción de un destino y, si procede, escribe `content` (Buffer o string).
  const apply = (relPath, kind, produce) => {
    const target = path.join(specsBase, ...relPath.split('/'));
    const exists = fs.existsSync(target);
    let action = 'preserved';
    if (skipLayers.has(scaffoldLayer(relPath))) action = 'skipped';
    else if (!exists) action = 'created';
    else if (force) action = 'overwritten';
    if (!dryRun && (action === 'created' || action === 'overwritten')) {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, produce());
    }
    entries.push({ relPath, kind, action });
    summary[action === 'skipped' ? 'skippedByHarness' : action] += 1;
  };

  for (const rel of seeds) {
    const source = path.join(scaffoldDir, ...rel.split('/'));
    // Un `.gitkeep` solo materializa un directorio ausente: si ya existe no se lista ni se cuenta.
    if (path.basename(rel) === '.gitkeep' && isDirectory(path.join(specsBase, path.dirname(rel)))) continue;
    apply(rel, 'seed', () => (/\.md$/i.test(rel) ? readText(source).replace(/\{date\}/g, date) : fs.readFileSync(source)));
  }

  // Directorios de capa aunque una semilla no los cree (mismo catálogo que el índice).
  if (!dryRun) {
    for (const layer of LAYERS) {
      if (!skipLayers.has(layer)) fs.mkdirSync(path.join(specsBase, layer), { recursive: true });
    }
  }

  const cliRoot = options.cliRoot ? path.resolve(process.cwd(), options.cliRoot) : null;
  for (const { name, owner } of SHARED_TEMPLATES) {
    const source = cliRoot ? path.join(cliRoot, 'skills', owner, 'assets', name) : null;
    if (!source || !fs.existsSync(source)) {
      warnings.push(`template no copiado: ${name} (skill ${owner} no instalado)`);
      continue;
    }
    apply(`${TEMPLATES_LAYER}/${name}`, 'shared-template', () => fs.readFileSync(source));
  }

  return { root: specsBase, harness, missingLayers, entries, warnings, summary };
}

function scaffoldSummaryLine(summary) {
  return `creados: ${summary.created} · sobrescritos: ${summary.overwritten} · preservados: ${summary.preserved} · omitidos por harness: ${summary.skippedByHarness}`;
}

// ---------------------------------------------------------------------------
// Subcomandos
// ---------------------------------------------------------------------------

function runScaffold(args) {
  const result = scaffold(args);
  const label = (action) => SCAFFOLD_LABELS[action][args.dryRun ? 1 : 0];
  const lines = [
    `harness: ${result.harness}`,
    `capas faltantes: ${result.missingLayers.length ? result.missingLayers.join(', ') : 'ninguna'}`,
    ...result.entries.map((entry) => `[${label(entry.action)}] ${entry.relPath}`),
    ...result.warnings.map((warning) => `[WARNING] ${warning}`),
    scaffoldSummaryLine(result.summary),
  ];
  process.stdout.write(`${lines.join('\n')}\n`);
  return 0;
}

function runDetect(args) {
  const specsBase = resolveRoot(args.root);
  process.stdout.write(`${detectHarness(path.dirname(specsBase), args.harness)}\n`);
  return 0;
}

function runIndex(args) {
  const specsBase = resolveRoot(args.root);
  const harness = detectHarness(path.dirname(specsBase), args.harness);
  const templatePath = args.template ? path.resolve(process.cwd(), args.template) : DEFAULT_TEMPLATE;
  if (!fs.existsSync(templatePath)) throw new UsageError(`no se encuentra el template del índice: ${displayPath(templatePath)}`);

  const { content, summary } = renderIndex(readText(templatePath), scanNodes(specsBase, harness), { date: args.date });
  const target = path.join(specsBase, INDEX_FILE);

  process.stdout.write(`harness: ${harness}\n`);
  if (args.dryRun) {
    process.stdout.write(`--- ${displayPath(target)} (dry-run, no se escribe) ---\n${content}--- fin del índice ---\n`);
  } else {
    fs.writeFileSync(target, content, 'utf8');
    process.stdout.write(`índice escrito: ${displayPath(target)}\n`);
  }
  process.stdout.write(`${summaryLine(summary)}\n`);
  return 0;
}

function main(argv = process.argv.slice(2)) {
  try {
    const args = parseArgs(argv);
    const runners = { detect: runDetect, index: runIndex, scaffold: runScaffold };
    return runners[args.command](args);
  } catch (error) {
    const usage = error instanceof UsageError;
    process.stderr.write(`❌ ${usage ? '' : 'error inesperado: '}${error.message}\n`);
    return usage ? 2 : 1;
  }
}

if (require.main === module) process.exitCode = main();

module.exports = {
  HARNESS_PROFILES,
  LAYERS,
  KNOWN_LAYERS,
  SCAFFOLD_DIR,
  SHARED_TEMPLATES,
  parseArgs,
  parseFrontmatter,
  extractWikilinks,
  deriveNode,
  scanNodes,
  detectHarness,
  renderIndex,
  summaryLine,
  scaffold,
  scaffoldSummaryLine,
  main,
};
