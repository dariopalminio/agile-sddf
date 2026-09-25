'use strict';

/**
 * DoD de historia dividido en un guardrail por etapa (STORY-101).
 *
 * Conocimiento propio del DoD, separado del motor genérico de memoria (D-2): la tabla de etapas
 * `DOD_STAGES`, la división del DoD monolítico (`migrate --from dod-monolithic`), la lectura del
 * mapeo `guardrails.dod.story` de `sddf.config.yaml` y el evaluador `dod-guardrail` de `check`.
 * Solo módulos nativos. Las reglas completas están en `references/dod-rules.md`.
 */

const fs = require('node:fs');
const path = require('node:path');

// `memory-system.js` requiere este módulo al cargarse; sus utilidades se piden en tiempo de
// llamada para no depender del orden de carga del require circular.
function engine() {
  return require('./memory-system.js');
}

/**
 * Tabla de etapas (D-1, I-11), en el orden canónico SPECIFY → PLAN → IMPLEMENT → CODE-REVIEW → VERIFY →
 * ACCEPTANCE. Un DoD es la condición para cerrar su etapa: protege la transición
 * `<ETAPA>/IN-PROGRESS` → `<ETAPA>/DONE` (`from`/`to`). `status` es la etapa sin substatus: con él se
 * reconocen las secciones del monolítico y se titula cada archivo. `deliver` no es una transición de
 * historia: es el checklist de publicación (en npm, en este framework), sin skill por ahora.
 */
const transition = (stage, status, enforcement, skills) => ({
  stage, status, from: `${status}/IN-PROGRESS`, to: `${status}/DONE`, enforcement, kind: 'transition', appliesTo: 'story', skills,
});
const DOD_STAGES = Object.freeze([
  transition('specify', 'SPECIFY', 'warn', ['story-specify']),
  transition('plan', 'PLAN', 'error', ['story-plan', 'story-design', 'story-analyze']),
  transition('implement', 'IMPLEMENT', 'error', ['story-implement', 'story-implement-tasks']),
  transition('code-review', 'CODE-REVIEW', 'error', ['story-code-review']),
  transition('verify', 'VERIFY', 'error', ['story-verify']),
  transition('acceptance', 'ACCEPTANCE', 'error', ['story-acceptance']),
  { stage: 'deliver', status: null, from: null, to: null, enforcement: 'error', kind: 'content', appliesTo: 'deliver', skills: [], optional: true },
].map((entry) => Object.freeze({ ...entry, skills: Object.freeze([...entry.skills]) })));

const DOD_KIND = 'dod-guardrail';
const MONOLITH = 'guardrails/dod-story-checklist.md';
const LEGACY = 'policies/dod-story.md';
const INDEX_SLUG = 'dod-story-checklist';
const REMOVAL_VERSION = '4.0.0';
const ENFORCEMENTS = new Set(['error', 'warn']);
// Skills que pueden nombrar el DoD monolítico: el que lo migra (R7).
const DOD_MIGRATOR_SKILLS = new Set(['memory-system']);

const slugOf = (stage) => `dod-story-${stage}`;
const stageByStatus = new Map(DOD_STAGES.filter((s) => s.status).map((s) => [s.status, s]));
const DELIVER_HEADING = /Criterios de Despliegue en Producci[oó]n/i;
// Dos formatos de origen: el de este repositorio (`### Definition of Done para el estado VERIFY`) y el de
// la plantilla de `project-policies-generation` (`## ✅ VERIFY (Definición de Hecho …)`). En ambos la
// etapa es el primer token en mayúsculas del encabezado.
const STAGE_TOKEN = new RegExp(`(?:^|[^A-Za-z-])(${[...stageByStatus.keys()].join('|')})(?![A-Za-z-])`);
const DATE_PLACEHOLDER = /^<.*>$/;

// Etiquetas del informe de `migrate`: [ejecución real, --dry-run].
const MIGRATE_LABELS = {
  create: ['CREADO', 'CREARÍA'],
  overwrite: ['SOBRESCRITO', 'SOBRESCRIBIRÍA'],
  preserve: ['PRESERVADO', 'PRESERVARÍA'],
  'replace-index': ['REEMPLAZADO', 'REEMPLAZARÍA'],
  'no-source': ['SIN ORIGEN', 'SIN ORIGEN'],
  skip: ['OMITIDO', 'OMITIRÍA'],
  // Diagnóstico bloqueante: una etapa repetida no tiene un destino seguro.
  duplicate: ['DUPLICADO', 'DUPLICADO'],
};

// ---------------------------------------------------------------------------
// División del monolítico (D-4, D-5)
// ---------------------------------------------------------------------------

function classify(heading, level) {
  const token = heading.match(STAGE_TOKEN);
  if (token) return stageByStatus.get(token[1]);
  if (level === 2 && DELIVER_HEADING.test(heading)) return DOD_STAGES.find((s) => s.stage === 'deliver');
  return null;
}

/**
 * Bloques del cuerpo (sin comentarios HTML) abiertos por encabezados de nivel 2 o 3. Un bloque de
 * etapa conserva los subencabezados más profundos que el suyo (subgrupos de criterios), promovidos
 * a nivel 2, hasta el siguiente encabezado de su nivel o superior.
 */
function splitBlocks(body) {
  const blocks = [];
  let current = { heading: null, level: 0, stage: null, lines: [] };
  for (const line of body.replace(/<!--[\s\S]*?-->/g, '').split('\n')) {
    const heading = line.match(/^(#{2,6})\s+(.+?)\s*#*\s*$/);
    const level = heading ? heading[1].length : 0;
    if (heading && current.stage && level > current.level) current.lines.push(`## ${heading[2]}`);
    else if (heading && level <= 3) {
      blocks.push(current);
      current = { heading: heading[2], level, stage: classify(heading[2], level), lines: [] };
    } else current.lines.push(line);
  }
  blocks.push(current);
  return blocks;
}

// Un bloque sin criterios ni texto propio (solo `---`, blancos o el placeholder) no se migra.
function isEmptyBlock(lines) {
  return lines.every((line) => !line.trim() || line.trim() === '---' || line.trim() === '[Por completar]');
}

// `Definition of Done para el estado X [es satisfactorio]` → `[Se cumple ][[dod-story-x]]` (D-4 paso 5).
function stageReference(match, status, satisfied) {
  const stage = stageByStatus.get(status);
  if (!stage) return match;
  return `${satisfied ? 'Se cumple ' : ''}[[${slugOf(stage.stage)}]]`;
}

// D-4 pasos 3–5: sin separadores ni blancos repetidos; enlaces a `gr-*` y a otras etapas como wikilinks.
function transformLines(lines) {
  const out = [];
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.trim() === '---') continue;
    if (!line.trim() && (!out.length || !out[out.length - 1].trim())) continue;
    out.push(line
      .replace(/(?:\b(?:el|la)\s+)?\[[^\]]*\]\((?:[^)\s]*\/)?(gr-[a-z0-9-]+)\.md\)/g, '[[$1]]')
      .replace(/Definition of Done para el estado ([A-Z][A-Z-]*)( es satisfactorio)?/g, stageReference));
  }
  while (out.length && !out[out.length - 1].trim()) out.pop();
  return out;
}

function titleOf(stage) {
  return stage.kind === 'transition'
    ? { title: `DoD ${stage.status} — Story (transition guardrail)`, heading: `DoD ${stage.status} — Story` }
    : { title: 'Criterios de despliegue en producción (content guardrail)', heading: 'Criterios de despliegue en producción' };
}

function renderStage(stage, lines, dates) {
  const { title, heading } = titleOf(stage);
  const fields = [
    'alwaysApply: false',
    'type: guardrail',
    `kind: ${stage.kind}`,
    `enforcement: ${stage.enforcement}`,
    ...(stage.kind === 'transition' ? [`from: ${stage.from}`, `to: ${stage.to}`] : []),
    `applies-to: ${stage.appliesTo}`,
    `slug: ${slugOf(stage.stage)}`,
    `title: "${title}"`,
    `created: ${dates.created}`,
    `updated: ${dates.updated}`,
  ];
  return `---\n${fields.join('\n')}\n---\n\n# ${heading}\n\n${transformLines(lines).join('\n')}\n`;
}

/** Índice deprecado que sustituye al monolítico durante una minor (D-5, AC-7). */
function renderDodIndex({ date, created = date } = {}) {
  const slugs = DOD_STAGES.map((s) => slugOf(s.stage));
  const fields = [
    'alwaysApply: false',
    'type: guardrail',
    'kind: index',
    'status: deprecated',
    `slug: ${INDEX_SLUG}`,
    'title: "DoD Story (deprecado)"',
    'superseded-by:',
    ...slugs.map((slug) => `  - ${slug}`),
    `removal: ${REMOVAL_VERSION}`,
    `created: ${created}`,
    `updated: ${date}`,
  ];
  return [
    `---\n${fields.join('\n')}\n---`,
    '',
    `# DoD Story (deprecado) — ver ${slugs.map((slug) => `[[${slug}]]`).join(', ')}`,
    '',
    'El Definition of Done de historia se dividió en un guardrail por etapa: cada skill del pipeline',
    'carga solo el de su etapa (sección `## DoD aplicable` de su `SKILL.md`). Este índice se conserva',
    `durante la minor 3.3.x y se elimina en ${REMOVAL_VERSION}.`,
    '',
    'Para dividir un DoD monolítico propio: `/memory-system migrate --from=dod-monolithic`.',
    '',
  ].join('\n');
}

function datesOf(data, options) {
  const date = options.date;
  const placeholder = options.keepDatePlaceholders && typeof data.created === 'string' && DATE_PLACEHOLDER.test(data.created.trim());
  if (placeholder) return { created: data.created.trim(), updated: typeof data.updated === 'string' ? data.updated.trim() : data.created.trim() };
  return { created: date, updated: date };
}

/**
 * Planificador puro (D-4, D-5). `existing` son los slugs de destino que ya existen como archivo.
 * Devuelve `{ entries, unmigrated, alreadyIndex }`; cada entrada es
 * `{ slug, target, action, content?, reason? }` con `action ∈ create | overwrite | preserve |
 * replace-index | no-source | skip | duplicate` (`skip`: etapa opcional ausente del origen, hoy solo
 * `deliver`; `duplicate`: etapa ambigua que no puede escribirse).
 */
function planDodMigration(sourceText, existing = new Set(), options = {}) {
  const { force = false } = options;
  const parsed = engine().parseFrontmatter(sourceText);
  const alreadyIndex = parsed.data.status === 'deprecated';
  const dates = datesOf(parsed.data, options);
  const sections = new Map();
  const duplicates = new Map();
  const unmigrated = [];
  if (!alreadyIndex) {
    let seenStage = false;
    for (const block of splitBlocks(parsed.body)) {
      if (block.stage) {
        seenStage = true;
        const stage = block.stage.stage;
        if (duplicates.has(stage)) {
          duplicates.set(stage, duplicates.get(stage) + 1);
        } else if (sections.has(stage)) {
          // No se escoge uno de los bloques: ambos deben seguir en el origen hasta resolverlos.
          sections.delete(stage);
          duplicates.set(stage, 2);
        } else {
          sections.set(stage, block.lines);
        }
      } else if (seenStage && !isEmptyBlock(block.lines)) unmigrated.push(block.heading);
    }
  }

  const entries = DOD_STAGES.map((stage) => {
    const slug = slugOf(stage.stage);
    const target = `guardrails/${slug}.md`;
    const lines = sections.get(stage.stage);
    const duplicateCount = duplicates.get(stage.stage);
    if (duplicateCount) {
      const name = stage.status || 'Criterios de Despliegue en Producción';
      return {
        slug,
        target,
        action: 'duplicate',
        reason: `sección ${name} duplicada en el origen (${duplicateCount} bloques); el destino no se modifica`,
      };
    }
    if (existing.has(slug)) {
      return lines && force ? { slug, target, action: 'overwrite', content: renderStage(stage, lines, dates) } : { slug, target, action: 'preserve' };
    }
    if (lines) return { slug, target, action: 'create', content: renderStage(stage, lines, dates) };
    // El checklist de despliegue (deliver) es propio de quien publica (npm en este framework): su ausencia no es un error.
    if (stage.optional && !alreadyIndex) return { slug, target, action: 'skip', reason: 'sin criterios de despliegue en el origen' };
    const reason = alreadyIndex ? 'el origen ya es el índice deprecado; restaúralo desde git' : `sección ${stage.status || 'Criterios de Despliegue en Producción'} no encontrada`;
    return { slug, target, action: 'no-source', reason };
  });
  if (!alreadyIndex && !unmigrated.length && !duplicates.size) {
    const created = typeof parsed.data.created === 'string' && !DATE_PLACEHOLDER.test(parsed.data.created.trim()) ? parsed.data.created.trim() : dates.created;
    entries.push({ slug: INDEX_SLUG, target: MONOLITH, action: 'replace-index', content: renderDodIndex({ date: dates.updated, created }) });
  }
  return { entries, unmigrated, alreadyIndex };
}

/**
 * Ejecuta la migración sobre `specsBase` (D-3). Origen: `guardrails/dod-story-checklist.md` y,
 * si no existe, `policies/dod-story.md`. El origen heredado nunca se elimina (la épica prohíbe
 * que un modo borre archivos): se conserva y se avisa. Devuelve `{ lines, summary, exitCode }`.
 */
function migrateDod(specsBase, { dryRun = false, force = false, date, displayRoot = null } = {}) {
  const { assertInsideRoot, under, UsageError, readText, todayIso, toPosix } = engine();
  const root = path.resolve(specsBase);
  const sourceRel = [MONOLITH, LEGACY].find((rel) => fs.existsSync(under(root, rel)));
  if (!sourceRel) throw new UsageError(`nada que migrar: no existe ${MONOLITH} ni ${LEGACY}`);
  const existing = new Set(DOD_STAGES.map((s) => slugOf(s.stage)).filter((slug) => fs.existsSync(under(root, `guardrails/${slug}.md`))));
  const plan = planDodMigration(readText(under(root, sourceRel)), existing, { force, date: date || todayIso() });

  for (const entry of plan.entries) assertInsideRoot(root, under(root, entry.target));
  const summary = { created: 0, overwritten: 0, preserved: 0, replaced: 0 };
  const counter = { create: 'created', overwrite: 'overwritten', preserve: 'preserved', 'replace-index': 'replaced' };
  const lines = [`── memory-system migrate ── from: dod-monolithic · root: ${displayRoot || toPosix(specsBase)}`];
  for (const entry of plan.entries) {
    if (counter[entry.action]) summary[counter[entry.action]] += 1;
    const note = entry.action === 'replace-index' ? ` — índice deprecado${sourceRel === LEGACY ? ` (origen: ${LEGACY})` : ''}` : entry.reason ? ` — ${entry.reason}` : '';
    lines.push(`[${MIGRATE_LABELS[entry.action][dryRun ? 1 : 0]}] ${entry.target}${note}`);
    if (dryRun || !entry.content) continue;
    const file = under(root, entry.target);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, entry.content, 'utf8');
  }
  for (const heading of plan.unmigrated) lines.push(`[NO MIGRADO] ${heading} — bloque no reconocido; muévelo a su etapa y re-ejecuta (el origen no se reemplaza)`);
  if (sourceRel === LEGACY && plan.entries.some((e) => e.action === 'replace-index')) {
    lines.push(`[PRESERVADO] ${LEGACY} — origen heredado conservado; elimínalo tras revisar la migración`);
  }
  lines.push('─'.repeat(48), `creados: ${summary.created} · sobrescritos: ${summary.overwritten} · preservados: ${summary.preserved} · reemplazados: ${summary.replaced}`);
  if (dryRun) lines.push(`cambios pendientes: ${summary.created + summary.overwritten + summary.replaced}`);
  const incomplete = plan.unmigrated.length > 0 || plan.entries.some((e) => e.action === 'no-source' || e.action === 'duplicate');
  return { lines, summary, exitCode: incomplete ? 1 : 0 };
}

// ---------------------------------------------------------------------------
// Mapeo de `sddf.config.yaml` (D-7)
// ---------------------------------------------------------------------------

function unquoteValue(raw) {
  const value = raw.replace(/\s+#.*$/, '').trim();
  const quoted = value.length >= 2 && ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")));
  return quoted ? value.slice(1, -1) : value;
}

/** Lee solo `guardrails → dod → story → <etapa>: <slug>` por indentación. Claves desconocidas se conservan. */
function readDodMapping(configText) {
  const mapping = new Map();
  const stack = [];
  for (const raw of String(configText).replace(/\r\n?/g, '\n').split('\n')) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    const match = raw.match(/^(\s*)([A-Za-z0-9_-]+):(?:\s+(.*))?$/);
    if (!match) continue;
    const indent = match[1].length;
    while (stack.length && stack[stack.length - 1].indent >= indent) stack.pop();
    const value = match[3] ? unquoteValue(match[3]) : '';
    const keys = stack.map((entry) => entry.key).join('.');
    if (keys === 'guardrails.dod.story' && value) mapping.set(match[2], value);
    stack.push({ indent, key: match[2] });
  }
  return mapping;
}

// ---------------------------------------------------------------------------
// Evaluador `dod-guardrail` de `check` (D-6, R1–R7)
// ---------------------------------------------------------------------------

function problem(relPath, detail) {
  return { kind: DOD_KIND, path: relPath, detail };
}

function declaredString(declared, field) {
  const value = declared[field];
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

// R1–R3 sobre el archivo de una etapa.
function stageProblems(stage, slug, node) {
  const declared = node.declared || {};
  const problems = [];
  const expect = (field, expected) => {
    const value = declaredString(declared, field);
    if (value === null) problems.push(problem(node.relPath, `falta ${field}`));
    else if (value !== expected) problems.push(problem(node.relPath, `${field}: ${value} — se esperaba ${expected}`));
  };
  const declaredSlug = declaredString(declared, 'slug');
  if (declaredSlug !== null && declaredSlug !== slug) problems.push(problem(node.relPath, `slug: ${declaredSlug} — debe coincidir con el nombre del archivo`));
  expect('kind', stage.kind);
  if (stage.kind === 'transition') {
    expect('from', stage.from);
    expect('to', stage.to);
  }
  expect('applies-to', stage.appliesTo);
  const enforcement = declaredString(declared, 'enforcement');
  if (enforcement === null) problems.push(problem(node.relPath, 'falta enforcement'));
  else if (!ENFORCEMENTS.has(enforcement)) problems.push(problem(node.relPath, `enforcement: ${enforcement} — se esperaba error o warn`));
  return problems;
}

function skillProblems(ctx, toRel) {
  const problems = [];
  for (const stage of DOD_STAGES) {
    for (const skill of stage.skills) {
      const file = path.join(ctx.skillsDir, skill, 'SKILL.md');
      if (!fs.existsSync(file)) continue;
      const text = fs.readFileSync(file, 'utf8');
      if (!text.includes('## DoD aplicable')) problems.push(problem(toRel(file), `falta la sección DoD aplicable (${slugOf(stage.stage)})`));
      else if (!text.includes(slugOf(stage.stage))) problems.push(problem(toRel(file), `la sección DoD aplicable no cita ${slugOf(stage.stage)}`));
    }
  }
  for (const entry of fs.readdirSync(ctx.skillsDir, { withFileTypes: true })) {
    const file = path.join(ctx.skillsDir, entry.name, 'SKILL.md');
    if (!entry.isDirectory() || DOD_MIGRATOR_SKILLS.has(entry.name) || !fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, 'utf8');
    if (text.includes('dod-story-checklist')) problems.push(problem(toRel(file), 'referencia al DoD monolítico'));
    if (text.includes(LEGACY)) problems.push(problem(toRel(file), `referencia al DoD heredado ${LEGACY}`));
  }
  return problems;
}

/**
 * Evaluador puro de la familia `dod-guardrail`. `ctx`: `{ root, repoRoot, nodes, skillsDir,
 * dodMapping }`. Solo actúa si el proyecto tiene DoD (algún `guardrails/dod-story-*.md`, el
 * heredado o el mapeo): el DoD sigue siendo opcional.
 */
function dodGuardrails(ctx) {
  const toRel = (file) => engine().toPosix(path.relative(ctx.root, file));
  const mapping = ctx.dodMapping || new Map();
  const guardrails = new Map(ctx.nodes
    .filter((node) => node.layer !== 'external' && node.relPath.startsWith('guardrails/') && !node.relPath.slice('guardrails/'.length).includes('/'))
    .map((node) => [path.basename(node.relPath, '.md'), node]));
  const legacyExists = fs.existsSync(path.join(ctx.root, ...LEGACY.split('/')));
  const active = [...guardrails.keys()].some((name) => name.startsWith('dod-story')) || legacyExists || mapping.size > 0;
  if (!active) return [];

  const problems = [];
  for (const stage of DOD_STAGES) {
    const slug = mapping.get(stage.stage) || slugOf(stage.stage);
    const node = guardrails.get(slug);
    if (node && node.hasFrontmatter) problems.push(...stageProblems(stage, slug, node));
  }
  const configRel = toRel(path.join(ctx.repoRoot, 'sddf.config.yaml'));
  const known = new Set(DOD_STAGES.map((s) => s.stage));
  for (const [stage, slug] of mapping) {
    if (!known.has(stage)) problems.push(problem(configRel, `${stage}: etapa desconocida`));
    else if (!fs.existsSync(path.join(ctx.root, 'guardrails', `${slug}.md`))) problems.push(problem(configRel, `${stage}: ${slug} — archivo inexistente`));
  }
  const monolith = guardrails.get(INDEX_SLUG);
  const migrated = Boolean(monolith) && (monolith.declared || {}).status === 'deprecated';
  if (monolith && !migrated) problems.push(problem(MONOLITH, 'DoD monolítico sin migrar → /memory-system migrate --from=dod-monolithic'));
  if (legacyExists) problems.push(problem(LEGACY, migrated ? 'DoD heredado ya migrado: elimínalo' : 'DoD heredado sin migrar → /memory-system migrate --from=dod-monolithic'));
  if (ctx.skillsDir) problems.push(...skillProblems(ctx, toRel));
  return problems;
}

module.exports = {
  DOD_STAGES,
  DOD_KIND,
  DOD_MIGRATOR_SKILLS,
  planDodMigration,
  renderDodIndex,
  migrateDod,
  readDodMapping,
  dodGuardrails,
};
