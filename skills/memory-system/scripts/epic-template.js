'use strict';

/**
 * Template de épica v2 (STORY-103): lectura del contrato por claves y migración de épicas v1.
 *
 * Conocimiento propio de la estructura de `epic.md`, separado del motor genérico de memoria
 * (mismo patrón que `dod-story.js`):
 * - `readTemplateContract` lee del template (central → seed) la lista ordenada de secciones `##`
 *   con su obligatoriedad y su `clave:` estable (D-2b). Los títulos son libres; la clave no.
 * - `planEpicMigration` es la transformación pura v1 → contrato (reglas R1–R11 de D-7). El origen
 *   v1 es conocimiento fijo (versión cerrada) y se expresa como *título v1 → clave*; el destino
 *   (títulos, orden y secciones a insertar) sale del contrato, así que también migra hacia un
 *   template personalizado.
 * - `migrateEpics` aplica la transformación a `<SPECS_BASE>/specs/*\/EPIC-*\/epic.md`.
 *
 * Formatos de línea (contrato de dominio, `domain-epic-lifecycle` §9): F1 `- Nombre: desc`,
 * F2 `- [ ] **STORY-NNN** — Nombre: desc`, F3 `- [x] **STORY-NNN** — Nombre: desc`; smoke tests
 * `### SMOKE-N — nombre` + bloque `gherkin`. Solo módulos nativos.
 */

const fs = require('node:fs');
const path = require('node:path');

// `memory-system.js` requiere este módulo al cargarse; sus utilidades se piden en tiempo de llamada.
function engine() {
  return require('./memory-system.js');
}

const TEMPLATE_REL = 'templates/epic-template.md';
// Seed del dueño del template (`epic-creation`), hermano de este skill tanto en el framework como
// en una instalación (`<CLI_ROOT>/skills/`).
const SEED = path.resolve(__dirname, '..', '..', 'epic-creation', 'assets', 'epic-template.md');

// R1, R2, R3, R5: título de una sección v1 → clave de destino.
const V1_TITLES = [
  [/^descripci[oó]n$/i, 'alcance'],
  [/^historias$/i, 'historias'],
  [/^flujos cr[ií]ticos\b/i, 'smoke-tests'],
  [/^criterios de [eé]xito$/i, 'criterios-salida'],
  [/^notas(?: adicionales)?$/i, 'notas'],
];
// R3: `**Criterios de éxito:**` como párrafo en negrita abre una sección (después del primer `##`).
const CRITERIA_PARAGRAPH = /^\*\*Criterios de [eé]xito:?\*\*:?\s*(?:<!--[\s\S]*?-->\s*)?$/i;
const FENCE = /^\s*(?:```|~~~)/;
const STORY_LINE = /^- \[[ xX]\] \*\*STORY-\d{3,}\*\* — \S/;
// F1: `- Nombre: desc` sin checkbox ni `STORY-NNN`; el placeholder `- [Por completar]` también es F1.
const PLANNED_LINE = /^- (?!\[[ xX]\])(?!.*\bSTORY-\d)\S.*?: \S|^- \[Por completar\]\s*$/;
const STEP = /^\*\*(DADO|CUANDO|ENTONCES|Y)\*\*:?\s+(.*?)\s*$/i;
const STEP_WORDS = { dado: 'Dado', cuando: 'Cuando', entonces: 'Entonces', y: 'Y' };

const PLACEHOLDER = '[Por completar]';
const SMOKE_PLACEHOLDER = [
  `### SMOKE-1 — ${PLACEHOLDER}`,
  '```gherkin',
  `Escenario: ${PLACEHOLDER}`,
  `  Dado ${PLACEHOLDER}`,
  `  Cuando ${PLACEHOLDER}`,
  `  Entonces ${PLACEHOLDER}`,
  '```',
];

// Motivo de cada hallazgo `[REVISAR]` (no bloquea la escritura del resto; sí el exit code).
const REASONS = {
  'completada-sin-id': 'historia completada sin ID STORY-NNN: asígnale su ID (F3) o muévela fuera de la sección de historias; se conservó sin cambios',
  'historia-irreconocible': 'línea de historia con formato no reconocido: reescríbela como F1, F2 o F3; se conservó sin cambios',
  'smoke-sin-gherkin': 'smoke test sin bloque gherkin (Escenario/Dado/Cuando/Entonces): reescríbelo; se conservó sin cambios',
  'seccion-sin-destino': 'el template no declara la clave notas: la sección se conservó al final sin migrar',
};

const normalize = (text) => String(text).replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
const isBlank = (line) => !line.trim();
const stripComments = (text) => text.replace(/<!--[\s\S]*?-->/g, '');
const cleanHeading = (raw) => stripComments(raw).trim();
// Líneas de un bloque sin sus comentarios HTML (que pueden abarcar varias líneas).
const uncommentedLines = (lines) => stripComments(lines.join('\n')).split('\n');
const headingKey = (heading) => cleanHeading(heading).replace(/:\s*$/, '').toLowerCase();

function trimTrailing(lines) {
  const out = [...lines];
  while (out.length && isBlank(out[out.length - 1])) out.pop();
  return out;
}

// ---------------------------------------------------------------------------
// Contrato del template (D-2b)
// ---------------------------------------------------------------------------

/**
 * Lista ordenada `{ heading, clave, obligatoria }` de las secciones `##` del template.
 * `clave` es `null` si el marcador no la declara. Lanza `UsageError` ante una clave duplicada.
 */
function readTemplateContract(text) {
  const entries = [];
  const seen = new Set();
  let fence = false;
  for (const line of normalize(text).split('\n')) {
    if (FENCE.test(line)) {
      fence = !fence;
      continue;
    }
    const match = !fence && line.match(/^##\s+(.*)$/);
    if (!match) continue;
    const comment = (match[1].match(/<!--([\s\S]*?)-->/) || [null, ''])[1];
    const key = comment.match(/clave:\s*([A-Za-z0-9-]+)/i);
    const clave = key ? key[1].toLowerCase() : null;
    if (clave && seen.has(clave)) throw new (engine().UsageError)(`Template inválido: clave ${clave} duplicada`);
    if (clave) seen.add(clave);
    entries.push({ heading: cleanHeading(match[1]), clave, obligatoria: /secci[oó]n obligatoria/i.test(comment) });
  }
  return entries;
}

// ---------------------------------------------------------------------------
// R7 — líneas de la sección `historias`
// ---------------------------------------------------------------------------

// `**Nombre:** desc` / `**Nombre**: desc` / `**Nombre** — desc` → { name, desc } (head = texto en negrita).
function splitHead(head, tail) {
  const name = head.trim();
  if (name.endsWith(':')) return { name: name.slice(0, -1), desc: tail };
  const rest = tail.match(/^\s*(?::|—|–|-)\s*(.*)$/);
  return rest && !/^\s*-\S/.test(tail) ? { name, desc: rest[1] } : null;
}

// Línea heredada con `STORY-NNN` al inicio → { id, name, desc } o `null` si no se reconoce.
function parseWithId(rest) {
  const bold = rest.startsWith('**');
  const match = (bold ? rest.slice(2) : rest).match(/^(STORY-\d{3,})(?![\w-])\s*(?:—|–|-|:)\s*(.*)$/);
  if (!match) return null;
  const after = match[2];
  let parts = null;
  if (bold || after.startsWith('**')) {
    const from = bold ? 0 : 2;
    const close = after.indexOf('**', from);
    if (close < 0) return null;
    parts = splitHead(after.slice(from, close), after.slice(close + 2));
  } else {
    const colon = after.indexOf(': ');
    if (colon > 0) parts = { name: after.slice(0, colon), desc: after.slice(colon + 2) };
  }
  if (!parts) return null;
  const name = parts.name.trim();
  const desc = parts.desc.trim();
  return name && desc && !name.includes('**') ? { id: match[1], name, desc } : null;
}

// Línea planificada sin ID (checkbox vacío) → texto F1 (`Nombre: desc`); si no hay negrita, el texto tal cual.
function plannedText(rest) {
  const match = rest.match(/^\*\*(.+?)\*\*\s*(.*)$/);
  if (!match) return rest;
  const parts = splitHead(match[1], match[2]);
  if (!parts) return rest;
  const name = parts.name.trim();
  const desc = parts.desc.trim();
  return desc ? `${name}: ${desc}` : name;
}

/** R7 sobre una línea de nivel superior: `{ line, reason? }`; con `reason` la línea se conserva verbatim. */
function migrateStoryLine(line) {
  if (STORY_LINE.test(line) || PLANNED_LINE.test(line)) return { line };
  const unrecognized = { line, reason: 'historia-irreconocible' };
  const box = line.match(/^- \[([ xX])\]\s+(.*?)\s*$/);
  if (!box || !box[2]) return unrecognized;
  const checked = box[1] !== ' ';
  const rest = box[2];
  const parsed = parseWithId(rest);
  if (parsed) return { line: `- [${checked ? 'x' : ' '}] **${parsed.id}** — ${parsed.name}: ${parsed.desc}` };
  if (/^\*{0,2}\s*STORY-\d/i.test(rest)) return unrecognized;
  if (checked) return { line, reason: 'completada-sin-id' };
  // D-7: una línea que no queda en F1 (p. ej. sin `: desc`) no se entrega fuera de contrato.
  const planned = `- ${plannedText(rest)}`;
  return PLANNED_LINE.test(planned) ? { line: planned } : unrecognized;
}

function migrateStories(part, findings) {
  return part.body.map((line, i) => {
    if (!line.startsWith('- ')) return line;
    const result = migrateStoryLine(line);
    if (result.reason) findings.push({ line: part.firstLine + i, reason: result.reason });
    return result.line;
  });
}

// ---------------------------------------------------------------------------
// R2/R4 — sección `smoke-tests`
// ---------------------------------------------------------------------------

// Pasos `**DADO**/**CUANDO**/**ENTONCES**/**Y**` → líneas gherkin; `null` si el cuerpo no es reconocible.
function gherkinSteps(lines) {
  const steps = [];
  for (const line of lines) {
    if (isBlank(line)) continue;
    const step = line.trim().match(STEP);
    if (!step || !step[2]) return null;
    steps.push({ word: STEP_WORDS[step[1].toLowerCase()], text: step[2] });
  }
  const words = new Set(steps.map((s) => s.word));
  return ['Dado', 'Cuando', 'Entonces'].every((w) => words.has(w)) ? steps : null;
}

function hasGherkin(lines) {
  return lines.some((line) => /^\s*```gherkin\s*$/i.test(line));
}

// El párrafo introductorio en cursiva y los comentarios no cuentan como contenido de smoke test.
function isIntroOnly(lines) {
  return uncommentedLines(lines).every((line) => isBlank(line) || /^\s*(\*[^*].*\*|_[^_].*_)\s*$/.test(line));
}

function migrateSmoke(part, findings) {
  const intro = [];
  const blocks = [];
  let fence = false;
  part.body.forEach((line, i) => {
    if (!fence && /^###\s+/.test(line)) blocks.push({ heading: line, line: part.firstLine + i, lines: [] });
    else (blocks.length ? blocks[blocks.length - 1].lines : intro).push(line);
    if (FENCE.test(line)) fence = !fence;
  });
  const used = new Set(blocks.map((b) => (b.heading.match(/^###\s+Escenario\s*(\d+)/i) || [])[1]).filter(Boolean).map(Number));
  let next = 1;
  const free = () => {
    while (used.has(next)) next += 1;
    used.add(next);
    return next;
  };
  const out = [...intro];
  for (const block of blocks) {
    const scenario = block.heading.match(/^###\s+Escenario\b\s*(\d+)?\s*[:.—–-]?\s*(.*?)\s*$/i);
    if (!scenario) {
      out.push(block.heading, ...block.lines);
      if (!hasGherkin(block.lines)) findings.push({ line: block.line, reason: 'smoke-sin-gherkin' });
      continue;
    }
    const number = scenario[1] ? Number(scenario[1]) : free();
    const title = scenario[2] || `Escenario ${number}`;
    const steps = gherkinSteps(block.lines);
    out.push(`### SMOKE-${number} — ${title}`);
    if (!steps) {
      out.push(...block.lines);
      findings.push({ line: block.line, reason: 'smoke-sin-gherkin' });
      continue;
    }
    const trailing = block.lines.length - trimTrailing(block.lines).length;
    out.push('```gherkin', `Escenario: ${title}`, ...steps.map((s) => `  ${s.word} ${s.text}`), '```', ...Array(trailing).fill(''));
  }
  if (!blocks.length) {
    if (!isIntroOnly(intro)) findings.push({ line: part.firstLine - 1, reason: 'smoke-sin-gherkin' });
    else {
      const kept = trimTrailing(out);
      return [...kept, ...(kept.length ? [''] : []), ...SMOKE_PLACEHOLDER];
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Planificador puro (D-7)
// ---------------------------------------------------------------------------

// Claves con regla de máquina (R7, R2/R4): transforman el cuerpo de cada parte; el resto se copia tal cual.
const SECTION_MIGRATIONS = new Map([['historias', migrateStories], ['smoke-tests', migrateSmoke]]);

// R6: una sección sin contenido propio (blancos, comentarios, placeholders `[…]`) se elimina.
function isEmptySection(lines) {
  return uncommentedLines(lines).every((line) => {
    const text = line.trim();
    if (!text || text === '---') return true;
    return text.includes('[') && !text.replace(/\[[^\]]*\]/g, '').replace(/[\s*_:.,;|–—-]/g, '');
  });
}

// R6: los `###` (y más profundos) de una sección movida a `notas` bajan un nivel.
function demote(lines) {
  let fence = false;
  return lines.map((line) => {
    const out = !fence && /^#{3,5}\s/.test(line) ? `#${line}` : line;
    if (FENCE.test(line)) fence = !fence;
    return out;
  });
}

function placeholderFor(clave) {
  if (clave === 'criterios-salida') return [`- [ ] ${PLACEHOLDER}`];
  if (clave === 'smoke-tests') return [...SMOKE_PLACEHOLDER];
  if (clave === 'notas') return [];
  return [PLACEHOLDER];
}

function v1Clave(title) {
  const key = headingKey(title);
  const hit = V1_TITLES.find(([pattern]) => pattern.test(key));
  return hit ? hit[1] : null;
}

// Preámbulo (R10) y secciones abiertas por `##` o por el párrafo `**Criterios de éxito:**`.
function splitEpic(lines) {
  let start = 0;
  if (lines[0] === '---') {
    const end = lines.indexOf('---', 1);
    if (end > 0) start = end + 1;
  }
  const openers = [];
  let fence = false;
  for (let i = start; i < lines.length; i += 1) {
    const line = lines[i];
    if (FENCE.test(line)) {
      fence = !fence;
      continue;
    }
    if (fence) continue;
    const heading = line.match(/^##\s+(.*?)\s*$/);
    if (heading) openers.push({ index: i, title: cleanHeading(heading[1]), criteria: false });
    else if (openers.length && CRITERIA_PARAGRAPH.test(line)) openers.push({ index: i, title: 'Criterios de éxito', criteria: true });
  }
  const preamble = lines.slice(0, openers.length ? openers[0].index : lines.length);
  const sections = openers.map((opener, k) => ({
    title: opener.title,
    criteria: opener.criteria,
    firstLine: opener.index + 2,
    body: lines.slice(opener.index + 1, k + 1 < openers.length ? openers[k + 1].index : lines.length),
  }));
  return { preamble, sections };
}

function joinParts(parts, transform) {
  const out = [];
  for (const part of parts) {
    const body = transform ? transform(part) : part.body;
    if (out.length) {
      out.splice(0, out.length, ...trimTrailing(out));
      out.push('');
    }
    out.push(...body);
  }
  return out;
}

/**
 * Migra el texto de un `epic.md` al contrato dado. Pura, sin E/S.
 * Devuelve `{ content, changed, findings }`; `findings`: `[{ line, reason }]`.
 */
function planEpicMigration(text, contract) {
  const source = normalize(text);
  const lines = (source.endsWith('\n') ? source.slice(0, -1) : source).split('\n');
  const { preamble, sections } = splitEpic(lines);
  const findings = [];

  const slots = contract.map((entry) => ({ ...entry, parts: [] }));
  const byHeading = new Map(slots.map((slot) => [headingKey(slot.heading), slot]));
  const byClave = new Map(slots.filter((slot) => slot.clave).map((slot) => [slot.clave, slot]));
  const extras = [];
  for (const section of sections) {
    const direct = section.criteria ? null : byHeading.get(headingKey(section.title));
    const clave = section.criteria ? 'criterios-salida' : direct ? direct.clave : v1Clave(section.title);
    const slot = direct || (clave && byClave.get(clave)) || null;
    if (slot) slot.parts.push(section);
    else if (clave || !isEmptySection(section.body)) extras.push(section);
  }

  const notas = byClave.get('notas');
  const out = sections.length ? [...preamble] : trimTrailing(preamble);
  const pushSection = (heading, body) => {
    if (out.length && !isBlank(out[out.length - 1])) out.push('');
    out.push(`## ${heading}`, ...body);
  };
  for (const slot of slots) {
    const migrate = SECTION_MIGRATIONS.get(slot.clave);
    let body = joinParts(slot.parts, migrate && ((part) => migrate(part, findings)));
    if (slot === notas && extras.length) {
      body = trimTrailing(body);
      for (const extra of extras) {
        if (body.length) body.push('');
        body.push(`### ${extra.title}`, ...demote(trimTrailing(extra.body)));
      }
    }
    if (!slot.parts.length && !(slot === notas && extras.length)) {
      if (!slot.obligatoria) continue;
      body = placeholderFor(slot.clave);
    }
    pushSection(slot.heading, body);
  }
  if (!notas) {
    for (const extra of extras) {
      findings.push({ line: extra.firstLine - 1, reason: 'seccion-sin-destino' });
      pushSection(extra.title, extra.body);
    }
  }

  const content = `${trimTrailing(out).join('\n')}\n`;
  findings.sort((a, b) => a.line - b.line);
  return { content, changed: content !== source, findings };
}

// ---------------------------------------------------------------------------
// Ejecución sobre SPECS_BASE (D-7)
// ---------------------------------------------------------------------------

// `specs/*/EPIC-*/epic.md`, sin hardcodear el nombre del nivel (sobrevive al renombrado de `02-epics`).
function discoverEpics(root) {
  const specs = path.join(root, 'specs');
  if (!fs.existsSync(specs) || !fs.statSync(specs).isDirectory()) return [];
  const found = [];
  for (const level of fs.readdirSync(specs, { withFileTypes: true })) {
    if (!level.isDirectory()) continue;
    for (const entry of fs.readdirSync(path.join(specs, level.name), { withFileTypes: true })) {
      const file = path.join(specs, level.name, entry.name, 'epic.md');
      if (entry.isDirectory() && /^EPIC-/.test(entry.name) && fs.existsSync(file)) found.push({ rel: `specs/${level.name}/${entry.name}/epic.md`, file });
    }
  }
  return found.sort((a, b) => (a.rel < b.rel ? -1 : a.rel > b.rel ? 1 : 0));
}

// Contrato de destino: template central si declara claves; si no, el seed (con aviso, sin sobrescribir).
function resolveContract(root, seedPath, lines) {
  const { under, readText, UsageError, toPosix } = engine();
  const central = under(root, TEMPLATE_REL);
  if (fs.existsSync(central)) {
    const contract = readTemplateContract(readText(central));
    if (contract.some((entry) => entry.clave)) return { contract, review: 0 };
    lines.push(`[REVISAR] ${TEMPLATE_REL} — template sin claves de sección: reemplázalo por el seed v2 o añade "clave:" a sus marcadores (/sddf-init --force o /memory-system rebuild --force); se usa el seed como contrato`);
  }
  if (!fs.existsSync(seedPath)) throw new UsageError(`no se encuentra el template de épica: ${toPosix(seedPath)}`);
  const contract = readTemplateContract(readText(seedPath));
  if (!contract.some((entry) => entry.clave)) throw new UsageError(`el template de épica no declara claves de sección: ${toPosix(seedPath)}`);
  return { contract, review: fs.existsSync(central) ? 1 : 0 };
}

/**
 * Migra las épicas de `specsBase`. Escribe solo si `!dryRun` y el contenido cambia.
 * Devuelve `{ lines, summary: { migrated, unchanged, review, pending }, exitCode }`.
 */
function migrateEpics(specsBase, { dryRun = false, displayRoot = null, seedPath = SEED } = {}) {
  const { assertInsideRoot, readText, toPosix } = engine();
  const root = path.resolve(specsBase);
  const lines = [`── memory-system migrate ── from: epic-template-v1 · root: ${displayRoot || toPosix(specsBase)}`];
  const { contract, review: templateReview } = resolveContract(root, seedPath, lines);
  const summary = { migrated: 0, unchanged: 0, review: templateReview, pending: 0 };
  for (const { rel, file } of discoverEpics(root)) {
    assertInsideRoot(root, file);
    const plan = planEpicMigration(readText(file), contract);
    if (plan.changed) {
      summary.pending += 1;
      if (!dryRun) {
        fs.writeFileSync(file, plan.content, 'utf8');
        summary.migrated += 1;
      }
      lines.push(`[${dryRun ? 'MIGRARÍA' : 'MIGRADO'}] ${rel}`);
    } else {
      summary.unchanged += 1;
      lines.push(`[SIN CAMBIOS] ${rel}`);
    }
    for (const finding of plan.findings) {
      summary.review += 1;
      lines.push(`[REVISAR] ${rel}:${finding.line} — ${finding.reason}: ${REASONS[finding.reason]}`);
    }
  }
  lines.push('─'.repeat(48), `migrados: ${summary.migrated} · sin cambios: ${summary.unchanged} · a revisar: ${summary.review}`);
  if (dryRun) lines.push(`cambios pendientes: ${summary.pending}`);
  return { lines, summary, exitCode: summary.review ? 1 : 0 };
}

module.exports = {
  TEMPLATE_REL,
  readTemplateContract,
  planEpicMigration,
  migrateEpics,
};
