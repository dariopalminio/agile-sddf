#!/usr/bin/env node
'use strict';

/**
 * memory-system.js — motor determinista del skill `memory-system` (STORY-095, STORY-096, STORY-097).
 *
 * Subcomandos:
 *   detect   --root <SPECS_BASE> [--harness h]
 *   index    --root <SPECS_BASE> [--harness h] [--dry-run] [--template <ruta>] [--date YYYY-MM-DD]
 *   scaffold --root <SPECS_BASE> [--cli-root <CLI_ROOT>] [--harness h] [--dry-run] [--force] [--date YYYY-MM-DD]
 *   check    --root <SPECS_BASE> [--harness h] [--json]
 *
 * Solo usa módulos nativos (`node:fs`, `node:path`, `node:process`) para funcionar en
 * proyectos consumidores sin `package.json` (NFR-2). Node >= 18. Las rutas se normalizan
 * con `/` y se ordenan con comparación ordinal, de modo que la salida es idéntica en
 * Windows, macOS y Linux.
 *
 * Exit codes: 0 éxito · 2 error de uso, raíz inexistente, harness no admitido o template
 * desalineado (nunca escribe en esos casos) · 1 error inesperado. En `check` el 1 significa
 * exclusivamente "memoria con problemas" (gate de CI) y **todo** error, incluido el inesperado,
 * sale con 2 (D-4, CR-008).
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

// Línea de comandos: subcomandos, flags con valor y flags booleanos. `--template` y `--date`
// son flags de prueba (reproducibilidad); no se exponen en SKILL.md.
const COMMANDS = ['detect', 'index', 'scaffold', 'check'];
const VALUE_FLAGS = { '--root': 'root', '--cli-root': 'cliRoot', '--harness': 'harness', '--template': 'template', '--date': 'date' };
const BOOL_FLAGS = { '--dry-run': 'dryRun', '--force': 'force', '--json': 'json' };
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const USAGE = 'uso: memory-system.js <detect|index|scaffold|check> --root <SPECS_BASE> [--cli-root <CLI_ROOT>] [--harness h] [--dry-run] [--force] [--json]';

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

function profileOf(harness) {
  return HARNESS_PROFILES[harness] || HARNESS_PROFILES.generic;
}

// ---------------------------------------------------------------------------
// Argumentos
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { command: null, root: null, cliRoot: null, harness: null, dryRun: false, force: false, json: false, template: null, date: null };
  const rest = [...argv];
  while (rest.length) {
    const token = rest.shift();
    if (Object.hasOwn(VALUE_FLAGS, token)) {
      if (!rest.length || rest[0].startsWith('--')) throw new UsageError(`falta el valor de ${token}`);
      args[VALUE_FLAGS[token]] = rest.shift();
    } else if (Object.hasOwn(BOOL_FLAGS, token)) args[BOOL_FLAGS[token]] = true;
    else if (token.startsWith('--')) throw new UsageError(`flag desconocido: ${token}`);
    else if (!args.command) args.command = token;
    else throw new UsageError(`argumento inesperado: ${token}`);
  }
  if (!args.command) throw new UsageError(USAGE);
  if (!COMMANDS.includes(args.command)) {
    throw new UsageError(`subcomando no admitido: ${args.command} (admitidos: ${COMMANDS.join(', ')})`);
  }
  if (!args.root) throw new UsageError(`falta --root <SPECS_BASE>\n${USAGE}`);
  if (args.date !== null && !ISO_DATE.test(args.date)) throw new UsageError(`valor no admitido para --date: ${args.date} (formato YYYY-MM-DD)`);
  return args;
}

function resolveRoot(root) {
  const specsBase = path.resolve(process.cwd(), root);
  if (!isDirectory(specsBase)) throw new UsageError(`raíz inexistente: ${root} (no existe o no es un directorio)`);
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

// Wikilinks del cuerpo ignorando fences, código inline, `|alias`, `#anchor` y los
// placeholders de plantilla `[[<slug>]]` (STORY-097 D-2, punto 3).
function extractWikilinks(body) {
  const visible = body
    .replace(/^```[^\n]*\n[\s\S]*?^```[ \t]*$/gm, '')
    .replace(/^~~~[^\n]*\n[\s\S]*?^~~~[ \t]*$/gm, '')
    .replace(/`[^`\n]*`/g, '');
  const links = [];
  for (const match of visible.matchAll(/(?<!!)\[\[([^\]\n]+)\]\]/g)) {
    const target = match[1].split('|', 1)[0].split('#', 1)[0].trim();
    if (target && !/[<>]/.test(target)) links.push(target);
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
 * Deriva un nodo indexable: { path, relPath, layer, slug, title, hasFrontmatter, slugPlaceholder,
 * wikilinks, declared }.
 * `relPath` siempre es relativa a SPECS_BASE con `/` (los nodos externos empiezan por `../`).
 * `declared` es el frontmatter crudo (`{}` sin bloque): `slug`/`title` ya vienen derivados en el
 * nodo, y `check` necesita saber qué campos declara el archivo (STORY-097 D-3).
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
    declared: data,
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
  const profile = profileOf(harness);
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

// Slugs resolubles: los de los nodos escaneados (sin placeholders) más el del propio índice.
// Es el conjunto contra el que resuelven los wikilinks, tanto en `index` como en `check`.
function slugSetOf(nodes) {
  return new Set(['index', ...nodes.filter((n) => !n.slugPlaceholder).map((n) => n.slug)]);
}

// Slugs referenciados por wikilink que no resuelven a ningún nodo (ni al propio índice).
function collectPending(nodes) {
  const known = slugSetOf(nodes);
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
// STORY-097 D-1/D-3/D-4 — check: evaluadores de consistencia (solo lectura)
// ---------------------------------------------------------------------------

// Campos obligatorios del frontmatter (D-3): subconjunto del esquema canónico de
// `header-aggregation`. `specs` se exige solo a los tipos de spec; `date`, `created`,
// `updated`, `substatus` y `parent` no se exigen.
const REQUIRED_FIELDS = { all: ['type', 'slug', 'title'], specs: ['id', 'status'] };
const SPEC_TYPES = new Set(['project', 'epic', 'story']);

// Entrada de la raíz que `check` exige además de las once capas de `LAYERS`.
const ROOT_FILE = 'constitution.md';

// Familias de problemas, en el orden de presentación del informe textual (D-4).
const CHECK_KINDS = ['missing-layer', 'orphan', 'invalid-frontmatter', 'broken-wikilink'];
// Ancho de la columna `[kind]` del informe textual: la familia más larga, más los corchetes y
// dos espacios de separación. Derivado para que añadir una familia no descuadre el informe.
const KIND_WIDTH = Math.max(...CHECK_KINDS.map((kind) => kind.length)) + 4;
const CHECK_RULE = '─'.repeat(48);
const MIN_NODE_MAJOR = 18;

function problem(kind, relPath, detail) {
  return { kind, path: relPath, detail };
}

// Orden canónico de los problemas (NFR-1): (kind, path, detail) con comparación ordinal.
function sortProblems(problems) {
  return problems.sort((a, b) => ordinalCompare(a.kind, b.kind) || ordinalCompare(a.path, b.path) || ordinalCompare(a.detail, b.detail));
}

// Problemas agrupados por familia, en el orden de `CHECK_KINDS` y con todas las familias
// presentes aunque estén vacías: el mismo recorrido sirve al resumen y al informe textual.
function groupByKind(problems) {
  const byKind = new Map(CHECK_KINDS.map((kind) => [kind, []]));
  for (const entry of problems) byKind.get(entry.kind)?.push(entry);
  return byKind;
}

// Un campo declarado cuenta como presente si no está vacío (cadena en blanco = ausente).
function hasDeclaredField(declared, field) {
  const value = declared[field];
  if (typeof value === 'string') return value.trim() !== '';
  return value !== undefined && value !== null;
}

/**
 * Evaluador: capas de `LAYERS` (más `constitution.md`) ausentes de la raíz y no omitidas por
 * el perfil del harness. Es el único evaluador que mira el disco, por eso el contexto lleva
 * `root` además de `{ nodes, layers, profile, slugSet }`.
 */
function missingLayers(ctx) {
  const skip = new Set(ctx.profile.skipLayers);
  const problems = ctx.layers
    .filter((layer) => !skip.has(layer) && !isDirectory(path.join(ctx.root, layer)))
    .map((layer) => problem('missing-layer', `${layer}/`, 'capa ausente'));
  if (!skip.has(ROOT_FILE) && !fs.existsSync(path.join(ctx.root, ROOT_FILE))) {
    problems.push(problem('missing-layer', ROOT_FILE, 'capa ausente'));
  }
  return sortProblems(problems);
}

/** Evaluador: nodos sin bloque de frontmatter. */
function orphans(ctx) {
  return sortProblems(ctx.nodes.filter((node) => !node.hasFrontmatter).map((node) => problem('orphan', node.relPath, 'sin frontmatter')));
}

/** Evaluador: campos de `REQUIRED_FIELDS` ausentes del frontmatter declarado (uno por campo). */
function invalidFrontmatter(ctx) {
  const problems = [];
  for (const node of ctx.nodes) {
    if (!node.hasFrontmatter) continue; // ya reportado como huérfano
    const declared = node.declared || {};
    const isSpec = typeof declared.type === 'string' && SPEC_TYPES.has(declared.type.trim());
    for (const field of [...REQUIRED_FIELDS.all, ...(isSpec ? REQUIRED_FIELDS.specs : [])]) {
      if (!hasDeclaredField(declared, field)) problems.push(problem('invalid-frontmatter', node.relPath, `falta ${field}`));
    }
  }
  return sortProblems(problems);
}

/** Evaluador: cada ocurrencia de `[[slug]]` cuyo slug no está en `ctx.slugSet`. */
function brokenWikilinks(ctx) {
  const problems = [];
  for (const node of ctx.nodes) {
    for (const slug of node.wikilinks) {
      if (!ctx.slugSet.has(slug)) problems.push(problem('broken-wikilink', node.relPath, `[[${slug}]] no resuelve`));
    }
  }
  return sortProblems(problems);
}

const EVALUATORS = [missingLayers, orphans, invalidFrontmatter, brokenWikilinks];

function assertRuntime() {
  const major = Number.parseInt(process.versions.node.split('.')[0], 10);
  if (Number.isFinite(major) && major < MIN_NODE_MAJOR) {
    throw new UsageError(`runtime incompatible: se requiere Node >= ${MIN_NODE_MAJOR} (actual: ${process.versions.node})`);
  }
}

/**
 * Escanea la raíz una sola vez y ejecuta los cuatro evaluadores (D-1). No escribe nada.
 * Devuelve `{ ok, summary, problems }` con `problems` en orden canónico.
 */
function checkMemory(specsBase, harness) {
  const nodes = scanNodes(specsBase, harness);
  const ctx = { root: specsBase, nodes, layers: LAYERS, profile: profileOf(harness), slugSet: slugSetOf(nodes) };
  const problems = sortProblems(EVALUATORS.flatMap((evaluate) => evaluate(ctx)));
  const summary = {};
  for (const [kind, entries] of groupByKind(problems)) summary[kind] = entries.length;
  return { ok: problems.length === 0, summary, problems };
}

// Informe textual agrupado por familia (D-4); el orden dentro de cada familia es (path, detail).
function renderCheckText(result) {
  const lines = [`── memory-system check ── harness: ${result.harness} · root: ${result.root}`];
  for (const [kind, entries] of groupByKind(result.problems)) {
    for (const entry of entries) lines.push(`${`[${kind}]`.padEnd(KIND_WIDTH)}${entry.path} — ${entry.detail}`);
  }
  const detail = CHECK_KINDS.filter((kind) => result.summary[kind] > 0).map((kind) => `${kind} ${result.summary[kind]}`).join(' · ');
  lines.push(CHECK_RULE, `problemas: ${result.problems.length}${detail ? ` (${detail})` : ''}`);
  return `${lines.join('\n')}\n`;
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

// El árbol semilla debe aportar al menos un archivo por capa del catálogo.
function assertSeedsCoverLayers(seeds, scaffoldDir) {
  const uncovered = LAYERS.find((layer) => !seeds.some((rel) => scaffoldLayer(rel) === layer));
  if (uncovered) throw new UsageError(`el árbol semilla no cubre la capa "${uncovered}": ${displayPath(scaffoldDir)}`);
}

/**
 * Coloca `source` en `target` con la política copia-si-falta y devuelve la acción:
 * destino ausente → `created`; presente → `preserved`, o `overwritten` con `force`.
 * `render` transforma el texto al copiar (semillas); sin él la copia es byte a byte.
 * Con `dryRun` solo decide, no escribe.
 */
function placeFile(source, target, { force = false, dryRun = false, render = null } = {}) {
  const action = !fs.existsSync(target) ? 'created' : force ? 'overwritten' : 'preserved';
  if (!dryRun && action !== 'preserved') {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, render ? render(readText(source)) : fs.readFileSync(source));
  }
  return action;
}

/**
 * Copia el árbol semilla y las plantillas compartidas sobre `options.root` (D-1, D-2, D-4).
 * Una capa en `skipLayers` del harness se marca `skipped`. Nunca elimina nada.
 * Devuelve { root, harness, missingLayers, entries[], warnings[], summary }.
 */
function scaffold(options) {
  const { dryRun = false, force = false } = options;
  const scaffoldDir = options.scaffoldDir || SCAFFOLD_DIR;
  if (!isDirectory(scaffoldDir)) throw new UsageError(`no se encuentra el árbol semilla del scaffold: ${displayPath(scaffoldDir)}`);

  const specsBase = resolveScaffoldRoot(options.root, dryRun);
  const harness = detectHarness(path.dirname(specsBase), options.harness);
  const skipLayers = new Set(profileOf(harness).skipLayers);
  const seeds = listSeeds(scaffoldDir);
  assertSeedsCoverLayers(seeds, scaffoldDir);

  const result = {
    root: specsBase,
    harness,
    missingLayers: LAYERS.filter((layer) => !isDirectory(path.join(specsBase, layer))),
    entries: [],
    warnings: [],
    summary: { created: 0, overwritten: 0, preserved: 0, skippedByHarness: 0 },
  };
  const place = (relPath, kind, source, render) => {
    const target = path.join(specsBase, ...relPath.split('/'));
    const action = skipLayers.has(scaffoldLayer(relPath)) ? 'skipped' : placeFile(source, target, { force, dryRun, render });
    result.entries.push({ relPath, kind, action });
    result.summary[action === 'skipped' ? 'skippedByHarness' : action] += 1;
  };

  // Semillas: `{date}` es el único placeholder. Un `.gitkeep` solo materializa un directorio
  // ausente: si el directorio ya existe no se lista ni se cuenta.
  const date = options.date || todayIso();
  const renderSeed = (text) => text.replace(/\{date\}/g, date);
  for (const rel of seeds) {
    if (path.basename(rel) === '.gitkeep' && isDirectory(path.join(specsBase, path.dirname(rel)))) continue;
    place(rel, 'seed', path.join(scaffoldDir, ...rel.split('/')), /\.md$/i.test(rel) ? renderSeed : null);
  }

  // Directorios de capa aunque una semilla no los cree (mismo catálogo que el índice).
  if (!dryRun) {
    for (const layer of LAYERS) {
      if (!skipLayers.has(layer)) fs.mkdirSync(path.join(specsBase, layer), { recursive: true });
    }
  }

  // Plantillas compartidas: byte a byte desde el skill dueño; dueño ausente → aviso, no error.
  const cliRoot = options.cliRoot ? path.resolve(process.cwd(), options.cliRoot) : null;
  for (const { name, owner } of SHARED_TEMPLATES) {
    const source = cliRoot && path.join(cliRoot, 'skills', owner, 'assets', name);
    if (source && fs.existsSync(source)) place(`${TEMPLATES_LAYER}/${name}`, 'shared-template', source, null);
    else result.warnings.push(`template no copiado: ${name} (skill ${owner} no instalado)`);
  }

  return result;
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

/**
 * `check`: gate de CI en solo lectura. Exit 0 sin problemas, 1 con al menos uno (sin mensaje de
 * error) y 2 ante cualquier error, que se propaga a `main` para que lo informe por stderr y deje
 * el sobre JSON en stdout (D-4, CR-008).
 */
function runCheck(args) {
  assertRuntime();
  const specsBase = resolveRoot(args.root);
  const harness = detectHarness(path.dirname(specsBase), args.harness);
  const evaluated = checkMemory(specsBase, harness);
  const result = {
    harness,
    root: toPosix(args.root),
    ok: evaluated.ok,
    summary: evaluated.summary,
    problems: evaluated.problems,
  };
  process.stdout.write(args.json ? `${JSON.stringify(result, null, 2)}\n` : renderCheckText(result));
  return result.ok ? 0 : 1;
}

function main(argv = process.argv.slice(2)) {
  let command = null;
  try {
    const args = parseArgs(argv);
    command = args.command;
    const runners = { detect: runDetect, index: runIndex, scaffold: runScaffold, check: runCheck };
    return runners[args.command](args);
  } catch (error) {
    // El sobre JSON se emite aquí y no en `runCheck` para cubrir también los errores de
    // `parseArgs` (p. ej. `check --json` sin `--root`): el contrato con `jq` del gate de CI exige
    // que todo exit 2 con `--json` deje un objeto en stdout. Solo `check` lee `--json` (CR-008).
    if (argv.includes('--json')) process.stdout.write(`{ "ok": false, "error": ${JSON.stringify(error.message)} }\n`);
    const usage = error instanceof UsageError;
    process.stderr.write(`❌ ${usage ? '' : 'error inesperado: '}${error.message}\n`);
    // En `check` todo error es técnico → 2: reservar el 1 para "memoria con problemas" es lo que
    // hace el gate legible en CI (D-4, CR-008). Los demás modos conservan el 1.
    return usage || command === 'check' ? 2 : 1;
  }
}

if (require.main === module) process.exitCode = main();

module.exports = {
  HARNESS_PROFILES,
  LAYERS,
  KNOWN_LAYERS,
  REQUIRED_FIELDS,
  CHECK_KINDS,
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
  slugSetOf,
  missingLayers,
  orphans,
  invalidFrontmatter,
  brokenWikilinks,
  checkMemory,
  renderCheckText,
  scaffold,
  scaffoldSummaryLine,
  main,
};
