#!/usr/bin/env node
'use strict';

/**
 * Motor de epic-improve (STORY-167, CR-004): corrige un `epic.md` que `/epic-format-validation`
 * dejó en `NEEDS-REFINEMENT`, aplicando el catálogo de `references/correction-rules.md`.
 *
 *   - Gate por el `verdict` del reporte: solo `NEEDS-REFINEMENT` se corrige; `APPROVED` termina
 *     sin más; un `verdict` ausente/otro valor termina con el comando que regenera el reporte.
 *   - Revalida cada defecto contra el `epic.md` actual (D-3): lo ya resuelto no se corrige.
 *   - Corrige los 4 tipos: `campo-faltante` (§2), `seccion-faltante` (§3, con `M-objetivo`/
 *     `M-criterios` §6), `formato-historias` (§4, F1/F2/F3) y `formato-smoke-tests` (§5, SMOKE-N).
 *   - Contenido nuevo solo con fuente citada (§7); sin fuente queda como **decisión del PO** y
 *     no se escribe (tampoco el placeholder del template).
 *   - `plan` es de solo lectura; `apply` re-planifica, escribe `epic.md.bak`, escribe `epic.md`
 *     una sola vez y lo relee comprobando que cada corrección quedó aplicada y que
 *     `status`/`substatus` son idénticos a los del `.bak`; si falla, restaura desde el `.bak`.
 *
 * Invariantes: solo escribe `epic.md` y `epic.md.bak`; `status`/`substatus` intactos; UTF-8 sin
 * BOM; conserva los finales de línea del original; sin placeholders; IDs `CS-N`/`SMOKE-N` estables.
 *
 * Uso: node epic-improve.js <plan|apply> --repo-root <dir> (--id EPIC-NN | --path <ruta> | --dir <dir-de-la-epica>) [--today YYYY-MM-DD]
 *
 * Salida: un único objeto JSON en stdout. Exit code: 0 si `ok: true`; 1 si `ok: false`;
 * 2 ante argumentos inválidos (error en stderr).
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const FLOW = 'specs/flow';
const ID_RE = /^EPIC-\d{2,}$/;
const EPIC_PATH_RE = /^specs\/flow\/EPIC-\d{2,}-[^/]+\/?(?:epic\.md)?$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const BOM_RE = /^\uFEFF/;
const FIELD_RE = /^([A-Za-z0-9_-]+):\s*(.*)$/;
const FENCE = /^\s*(?:```|~~~)/;
const INLINE_CODE = /`[^`]+`/;
const STORY_ID = /\bSTORY-\d{3,}\b/;

// Seed del dueño del template (`epic-creation`), hermano de este skill (framework o instalación).
const SEED = path.resolve(__dirname, '..', '..', 'epic-creation', 'assets', 'epic-template.md');

const abs = (repoRoot, rel) => path.join(repoRoot, ...rel.split('/'));
const fail = (code, message, extra = {}) => ({ ok: false, code, message, ...extra });

function git(repoRoot, args) {
  return spawnSync('git', args, { cwd: repoRoot, encoding: 'utf8' });
}

function localToday() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

// ── Textual ────────────────────────────────────────────────────────────────────────

/** `{ lines, eol, hadTrailingNewline }`; BOM quitado, EOL dominante detectado. */
function toLines(text) {
  const normalized = String(text).replace(BOM_RE, '');
  const eol = normalized.includes('\r\n') ? '\r\n' : '\n';
  const hadTrailingNewline = normalized.endsWith(eol) || normalized.endsWith('\n') || normalized.endsWith('\r');
  let lines = normalized.split(eol);
  if (hadTrailingNewline && lines.length && lines[lines.length - 1] === '') lines = lines.slice(0, -1);
  return { lines, eol, hadTrailingNewline };
}

function fromLines(lines, eol, hadTrailingNewline) {
  return `${lines.join(eol)}${hadTrailingNewline ? eol : ''}`;
}

function parseField(line) {
  const match = FIELD_RE.exec(line);
  return match ? { key: match[1], value: match[2].trim().replace(/^(["'])(.*)\1$/, '$2').trim() } : null;
}

/** Cierre del frontmatter (índice de la línea `---` de cierre); -1 si no lo hay. */
function frontmatterClose(lines) {
  if (lines[0].trim() !== '---') return -1;
  return lines.findIndex((line, i) => i > 0 && line.trim() === '---');
}

/** `{ close, fields }`; `close` = índice de la línea de cierre, `fields` = mapa clave→valor. */
function parseFrontmatter(lines) {
  const close = frontmatterClose(lines);
  if (close === -1) return { close: -1, fields: {} };
  const fields = {};
  for (const line of lines.slice(1, close)) {
    const field = parseField(line);
    if (field) fields[field.key] = field.value;
  }
  return { close, fields };
}

/** Inserta/reemplaza `key: value` en el frontmatter; si la clave existe, la reemplaza en su sitio. */
function upsertField(lines, close, key, value) {
  for (let i = close - 1; i > 0; i -= 1) {
    if (parseField(lines[i])?.key === key) {
      lines[i] = `${key}: ${value}`;
      return;
    }
  }
  lines.splice(close, 0, `${key}: ${value}`);
  close += 1;
  return close;
}

// ── Template ───────────────────────────────────────────────────────────────────────

/**
 * Lista ordenada `{ heading, clave, obligatoria }` de las secciones `##` del template, leída por
 * `clave:` (D-2b). Lanza si no hay ningún template legible.
 */
function readTemplateContract(text) {
  const entries = [];
  const seen = new Set();
  let fence = false;
  for (const line of String(text).replace(BOM_RE, '').split(/\r?\n/)) {
    if (FENCE.test(line)) {
      fence = !fence;
      continue;
    }
    const match = !fence && line.match(/^##\s+(.*)$/);
    if (!match) continue;
    const comment = (match[1].match(/<!--([\s\S]*?)-->/) || [null, ''])[1];
    const key = comment.match(/clave:\s*([A-Za-z0-9-]+)/i);
    const clave = key ? key[1].toLowerCase() : null;
    if (clave) seen.add(clave);
    entries.push({
      heading: comment ? match[1].replace(/<!--[\s\S]*?-->/, '').trim() : match[1].trim(),
      clave,
      obligatoria: /secci[oó]n obligatoria/i.test(comment),
    });
  }
  return entries;
}

/** Contrato de destino: template central si declara claves; si no, el seed de `epic-creation`. */
function resolveContract(repoRoot) {
  const central = abs(repoRoot, 'docs/templates/epic-template.md');
  if (fs.existsSync(central)) {
    const contract = readTemplateContract(fs.readFileSync(central, 'utf8'));
    if (contract.some((entry) => entry.clave)) return contract;
  }
  if (!fs.existsSync(SEED)) return null;
  const contract = readTemplateContract(fs.readFileSync(SEED, 'utf8'));
  return contract.some((entry) => entry.clave) ? contract : null;
}

// ── Reporte ────────────────────────────────────────────────────────────────────────

/**
 * Gate por `verdict` (D-2). `{ status: 'APPROVED' | 'needs-refinement' | 'invalid', verdict }`.
 * `verdict` es el valor literal del frontmatter (o null si falta).
 */
function gateVerdict(reportText) {
  const { fields } = parseFrontmatter(toLines(reportText).lines);
  const verdict = fields.verdict ? String(fields.verdict).trim().toUpperCase() : null;
  if (verdict === 'APPROVED') return { status: 'APPROVED', verdict };
  if (verdict === 'NEEDS-REFINEMENT') return { status: 'needs-refinement', verdict };
  return { status: 'invalid', verdict };
}

/**
 * Filas de la tabla `## Defectos` → `[{ id, tipo, ubicacion, encontrado, correccion }]`.
 * Vacía si no hay tabla o está «Sin defectos».
 */
function parseDefects(reportText) {
  const { lines } = toLines(reportText);
  const start = lines.findIndex((line) => /^##\s+Defectos\b/i.test(line.trim()));
  if (start === -1) return [];
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i += 1) {
    if (/^##\s+/i.test(lines[i].trim())) {
      end = i;
      break;
    }
  }
  const defects = [];
  for (const raw of lines.slice(start + 1, end)) {
    const line = raw.trim();
    if (!line.startsWith('|')) continue;
    if (/^\|[\s:|-]+\|$/.test(line)) continue; // separador
    if (/^\|\s*ID\s*\|/i.test(line)) continue; // cabecera
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
    if (cells.length < 3) continue;
    defects.push({
      id: cells[0],
      tipo: cells[1],
      ubicacion: cells[2] || '',
      encontrado: cells[3] || '',
      correccion: cells[4] || cells[3] || '',
    });
  }
  return defects;
}

/** ¿El reporte incluye la sección `## Migración`? (D-6, §8) */
function hasMigration(reportText) {
  return toLines(reportText).lines.some((line) => /^##\s+Migraci[oó]n\b/i.test(line.trim()));
}

// ── Modelo de épica ────────────────────────────────────────────────────────────────

/** Secciones `##` del cuerpo (fuera de fences): `{ title, clave, start, end }` (índices en `lines`). */
function mapSections(lines, contract) {
  const byClave = new Map((contract || []).filter((e) => e.clave).map((e) => [e.clave, e]));
  const sections = [];
  let fence = false;
  for (let i = 0; i < lines.length; i += 1) {
    if (FENCE.test(lines[i])) {
      fence = !fence;
      continue;
    }
    if (fence) continue;
    const match = lines[i].match(/^##\s+(.*)$/);
    if (!match) continue;
    const title = match[1].replace(/<!--[\s\S]*?-->/g, '').trim();
    const clave = byClave.size ? [...byClave.values()].find((e) => e.heading.toLowerCase() === title.toLowerCase())?.clave || null : null;
    sections.push({ title, clave, start: i, end: null });
  }
  for (let s = 0; s < sections.length; s += 1) {
    sections[s].end = s + 1 < sections.length ? sections[s + 1].start : lines.length;
  }
  return sections;
}

/** Cuerpo de una sección (líneas entre su `##` y la siguiente), sin comentarios HTML. */
function sectionBody(lines, section) {
  return lines.slice(section.start + 1, section.end)
    .join('\n')
    .replace(/<!--[\s\S]*?-->/g, '')
    .split('\n')
    .filter((line) => line.trim() !== '');
}

// ── Fuentes y mejoras (§6, §7) ─────────────────────────────────────────────────────

/**
 * Resultados verificables citables en `Alcance`/`Historias` (§7, §6): líneas que nombran un
 * artefacto o comando concreto (un span `inline code`). Determinista y sin reescritura: cada
 * resultado se cita textual a su línea de origen. Sin ninguno → `null` (decisión del PO).
 */
function verifiableResults(lines, contract) {
  const sections = mapSections(lines, contract);
  const pick = (clave) => sections.filter((s) => s.clave === clave);
  const candidates = [...pick('historias'), ...pick('alcance')].flatMap((section) => ({
    source: section.title,
    lines: sectionBody(lines, section),
  }));
  const results = [];
  const seen = new Set();
  for (const candidate of candidates) {
    for (const line of candidate.lines) {
      let text = line.replace(/^-\s*(?:\[[ xX]\]\s*)?/, '').trim();
      // Quita un prefijo de ID de historia (`**STORY-901** — ` / `STORY-901: `).
      text = text.replace(/^\*{0,2}\bSTORY-\d{3,}\b\*{0,2}\s*[:—–-]\s*/, '').trim();
      if (!text || !INLINE_CODE.test(text)) continue;
      const key = text.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      results.push({ source: candidate.source, text });
    }
  }
  return results.length ? results : null;
}

// ── Conversiones de línea (§4, §5) ────────────────────────────────────────────────

/**
 * F1/F2/F3 (§4) sobre una línea de historias: `{ line }` o `{ line, reason }` (se conserva).
 * Mismo criterio que R7 de `memory-system`: conserva ID, nombre, descripción y checkbox.
 */
function migrateStoryLine(line) {
  const box = line.match(/^- \[([ xX])\]\s+(.*?)\s*$/);
  if (!box) {
    const planned = line.replace(/^-\s+/, '').trim();
    const parts = planned.match(/^(.*?)\s*(?:—|–|:)\s*(.*)$/);
    if (parts && parts[1].trim() && parts[2].trim()) return { line: `- ${parts[1].trim()}: ${parts[2].trim()}` };
    return { line, reason: 'historia-irreconocible' };
  }
  const checked = box[1] !== ' ';
  const rest = box[2];
  const id = (rest.match(STORY_ID) || [null])[0];
  const body = rest.replace(STORY_ID, '').replace(/^\*\*/, '').replace(/\*\*$/, '').trim();
  const parts = body.match(/^(.*?)\s*(?:—|–|:)\s*(.*)$/);
  if (!parts || !parts[1].trim() || !parts[2].trim()) {
    if (checked) return { line, reason: 'completada-sin-id' };
    return { line, reason: 'historia-irreconocible' };
  }
  const name = parts[1].trim();
  const desc = parts[2].trim();
  if (id) return { line: `- [${checked ? 'x' : ' '}] **${id}** — ${name}: ${desc}` };
  return { line: `- ${name}: ${desc}` };
}

/** Renombra `### <nombre>` / `### Escenario N` a `### SMOKE-N — <nombre>` (§5), siguiente N libre. */
function renameSmokeHeadings(lines, contract) {
  const sections = mapSections(lines, contract);
  const smoke = sections.find((s) => s.clave === 'smoke-tests');
  if (!smoke) return { lines, changed: false };
  const used = new Set();
  lines.forEach((line) => {
    const match = line.match(/^###\s+SMOKE-(\d+)/i);
    if (match) used.add(Number(match[1]));
  });
  let next = 1;
  const free = () => {
    while (used.has(next)) next += 1;
    used.add(next);
    return next;
  };
  let changed = false;
  for (let i = smoke.start + 1; i < smoke.end; i += 1) {
    const scenario = lines[i].match(/^###\s+Escenario\b\s*(\d+)?\s*[:.—–-]?\s*(.*?)\s*$/i);
    const plain = scenario ? null : lines[i].match(/^###\s+(?!SMOKE-)(.+)$/i);
    if (scenario) {
      const number = scenario[1] ? Number(scenario[1]) : free();
      const title = scenario[2] || `Escenario ${number}`;
      lines[i] = `### SMOKE-${number} — ${title}`;
      changed = true;
    } else if (plain) {
      lines[i] = `### SMOKE-${free()} — ${plain[1].trim()}`;
      changed = true;
    }
  }
  return { lines, changed };
}

// ── Plan de correcciones (núcleo puro) ────────────────────────────────────────────

/**
 * Núcleo puro: aplica el catálogo a `epicText` con los `defects` del reporte. Sin E/S.
 * Devuelve `{ content, changed, corrections, poDecisions, resolved, outOfScope }`.
 */
function planCorrections({ epicText, contract, defects = [], hasMigration = false, epicDir = '', today = localToday() }) {
  const { lines, eol, hadTrailingNewline } = toLines(epicText);
  const epicId = (epicDir.match(/^EPIC-\d{2,}/) || [null])[0] || 'EPIC-NN';
  const corrections = [];
  const poDecisions = [];
  const resolved = [];
  const outOfScope = [];

  const byClave = new Map((contract || []).filter((e) => e.clave).map((e) => [e.clave, e]));
  const titleOf = (clave) => byClave.get(clave)?.heading || clave;

  const recordCorrection = (defect, origen, ubicacion, operacion, contenido, fuente) =>
    corrections.push({ id: `C-${String(corrections.length + 1).padStart(2, '0')}`, origen, defect: defect.id, ubicacion, operacion, contenido, fuente });

  // §8 — épicas v1: los `seccion-faltante` son fuera de alcance si el reporte declara migración.
  const v1 = hasMigration && mapSections(lines, contract).some((s) => s.clave === null);

  for (const defect of defects) {
    const sections = () => mapSections(lines, contract);

    if (defect.tipo === 'campo-faltante') {
      const key = (defect.correccion.match(/^a[nñ]adir\s+([A-Za-z0-9_-]+)\s*:/i) || defect.encontrado.match(/^([A-Za-z0-9_-]+)\s*:?$/) || [null, null])[1];
      if (!key) {
        poDecisions.push({ origen: defect.id, pregunta: `¿Qué valor tiene el campo «${defect.encontrado || defect.correccion}» del frontmatter?` });
        continue;
      }
      const { close, fields } = parseFrontmatter(lines);
      if (close !== -1 && fields[key] !== undefined) {
        resolved.push({ id: defect.id, motivo: `el campo ${key} ya está presente` });
        continue;
      }
      let value = null;
      if (key === 'type') value = 'epic';
      else if (key === 'id') value = epicId;
      else if (key === 'slug') value = epicDir;
      else if (key === 'title') {
        const heading = lines.find((line) => /^#\s+/.test(line));
        value = heading ? heading.replace(/^#\s+/, '').replace(/^[\w]+:\s*/i, '') : null;
      } else if (key === 'updated') value = today;
      if (value === null) {
        poDecisions.push({ origen: defect.id, pregunta: `¿Qué valor tiene el campo «${key}» del frontmatter?` });
        continue;
      }
      const newClose = upsertField(lines, close === -1 ? insertFrontmatter(lines) : close, key, value);
      void newClose;
      recordCorrection(defect, defect.id, 'frontmatter', 'añadir', `${key}: ${value}`, `fuente: ${key === 'title' ? 'encabezado # ' : `directorio ${epicDir}`}`);
    } else if (defect.tipo === 'seccion-faltante') {
      const heading = (defect.correccion.match(/^a[nñ]adir\s+##\s+(.+)/i) || [null, null])[1];
      const title = heading ? heading.replace(/\s+seg[u\u00fa]n[\s\S]*$/i, '').trim() : null;
      const entry = title ? [...byClave.values()].find((e) => e.heading.toLowerCase() === title.toLowerCase()) : null;
      const clave = entry ? entry.clave : null;
      if (!clave) {
        poDecisions.push({ origen: defect.id, pregunta: `¿Qué sección falta exactamente («${title || defect.correccion}»)?` });
        continue;
      }
      if (sections().some((s) => s.clave === clave)) {
        resolved.push({ id: defect.id, motivo: `la sección «${title}» ya está presente` });
        continue;
      }
      if (v1) {
        outOfScope.push({ id: defect.id, skill: '/memory-system migrate --from=epic-template-v1' });
        continue;
      }
      // Cuerpo según §3/§6: `notas` va sin cuerpo; el resto exige fuente citada.
      let body = [];
      let fuente = null;
      if (clave === 'notas') {
        body = [];
      } else if (clave === 'criterios-salida') {
        const results = verifiableResults(lines, contract);
        if (results) {
          body = results.slice(0, 4).map((result, i) => `- [ ] **CS-${i + 1}** — ${result.text}`);
          fuente = `fuente: ${results[0].source} — "${results[0].text}"`;
        }
      } else if (clave === 'objetivo') {
        const results = verifiableResults(lines, contract);
        if (results) {
          body = [results[0].text];
          fuente = `fuente: ${results[0].source} — "${results[0].text}"`;
        }
      } else {
        const results = verifiableResults(lines, contract);
        if (results) {
          body = results.slice(0, 4).map((result) => `- ${result.text}`);
          fuente = `fuente: ${results[0].source} — "${results[0].text}"`;
        }
      }
      if (!body.length && clave !== 'notas') {
        const pregunta = clave === 'criterios-salida'
          ? '¿Qué resultados verificables cierran la épica?'
          : clave === 'objetivo'
            ? '¿Cuál es el objetivo de la épica?'
            : `¿Qué contenido va en la sección «${title}»?`;
        poDecisions.push({ origen: `${defect.id} · M-${clave === 'criterios-salida' ? 'criterios' : 'objetivo'}`, pregunta });
        continue;
      }
      const anchor = insertionAnchor(contract, clave, sections());
      insertSection(lines, title, body, anchor);
      recordCorrection(defect, `${defect.id} · M-${clave === 'criterios-salida' ? 'criterios' : 'objetivo'}`, `tras ## ${anchor.title}`, 'añadir', `## ${title}${body.length ? ` (${body.length} ítems)` : ''}`, fuente || 'fuente: template');
    } else if (defect.tipo === 'formato-historias') {
      const sections = mapSections(lines, contract);
      const historias = sections.find((s) => s.clave === 'historias');
      const literal = (defect.encontrado || '').trim();
      let idx = -1;
      if (historias) {
        for (let i = historias.start + 1; i < historias.end; i += 1) {
          if (lines[i].trim() === literal || lines[i].trim() === literal.replace(/^`|`$/g, '')) idx = i;
        }
      }
      if (idx === -1) {
        resolved.push({ id: defect.id, motivo: 'la línea ya no figura (o ya tiene forma válida)' });
        continue;
      }
      const result = migrateStoryLine(lines[idx]);
      if (result.reason) {
        poDecisions.push({ origen: defect.id, pregunta: `¿Cómo se debe formalizar la línea «${literal}»? (${result.reason})` });
        continue;
      }
      if (result.line === lines[idx]) {
        resolved.push({ id: defect.id, motivo: 'la línea ya cumple F1/F2/F3' });
        continue;
      }
      lines[idx] = result.line;
      recordCorrection(defect, defect.id, `## ${historias.title}`, 'modificar', `${literal} → ${result.line}`, null);
    } else if (defect.tipo === 'formato-smoke-tests') {
      const sections = mapSections(lines, contract);
      const smoke = sections.find((s) => s.clave === 'smoke-tests');
      if (!smoke) {
        poDecisions.push({ origen: defect.id, pregunta: '¿Qué smoke tests cierran la épica?' });
        continue;
      }
      const before = lines.slice();
      const { changed } = renameSmokeHeadings(lines, contract);
      if (!changed) {
        resolved.push({ id: defect.id, motivo: 'los smoke tests ya están en SMOKE-N + gherkin' });
        lines.length = 0;
        lines.push(...before);
        continue;
      }
      recordCorrection(defect, defect.id, `## ${smoke.title}`, 'modificar', 'SMOKE-N + gherkin', null);
    } else {
      poDecisions.push({ origen: defect.id, pregunta: `¿Cómo se corrige el defecto «${defect.tipo}»?` });
    }
  }

  // `updated:` siempre avanza al aplicar (D-4, §1); en `plan` se refleja en el contenido.
  const { close } = parseFrontmatter(lines);
  if (close !== -1) upsertField(lines, close, 'updated', today);

  const content = fromLines(lines, eol, hadTrailingNewline);
  return {
    content,
    changed: content !== epicText,
    corrections,
    poDecisions,
    resolved,
    outOfScope,
  };
}

function insertFrontmatter(lines) {
  lines.unshift('', '---');
  return 1;
}

/** §3.3 — ancla: la sección previa en el orden del template que exista (o `null` → inicio). */
function insertionAnchor(contract, clave, sections) {
  const idx = (contract || []).findIndex((e) => e.clave === clave);
  for (let i = idx - 1; i >= 0; i -= 1) {
    const prev = contract[i];
    if (prev.clave && sections.some((s) => s.clave === prev.clave)) {
      const found = sections.find((s) => s.clave === prev.clave);
      return { title: found.title, clave: prev.clave, start: found.start, end: found.end };
    }
  }
  return null;
}

/**
 * Inserta `## <title>` + `body` tras la ancla (o antes de la primera sección `##` si no la hay),
 * separando con una línea en blanco tras el bloque.
 */
function insertSection(lines, title, body, anchor) {
  const block = [`## ${title}`, ...body];
  if (anchor) {
    let at = anchor.end;
    while (at < lines.length && lines[at].trim() === '') at += 1; // salta el blanco ya existente
    lines.splice(at, 0, ...block, '');
    return;
  }
  let first = -1;
  for (let i = 0; i < lines.length; i += 1) {
    if (/^##\s+/.test(lines[i])) {
      first = i;
      break;
    }
  }
  if (first === -1) {
    lines.push('', ...block, '');
    return;
  }
  lines.splice(first, 0, ...block, '');
}

// ── Localización y aplicación ─────────────────────────────────────────────────────

/**
 * Localiza la épica. `dir` es la ruta lógica (`specs/flow/EPIC-NNN-<slug>/`), `physDir` el
 * directorio físico que contiene `epic.md` (puede ser una copia aislada, p. ej. un fixture).
 * Con `--id`/`--path` solo busca en el primer nivel de `specs/flow/` (nunca `archive/` ni `STORY-*`).
 */
function locateEpic({ repoRoot, id, epicPath, epicDir }) {
  if (epicDir !== undefined) {
    const physDir = path.resolve(repoRoot, epicDir);
    if (!fs.existsSync(physDir) || !fs.statSync(physDir).isDirectory()) {
      return fail('NOT_FOUND', `No se encontró el directorio ${epicDir}/ (ruta buscada: ${epicDir}/)`);
    }
    if (!fs.existsSync(path.join(physDir, 'epic.md'))) return fail('NO_EPIC_FILE', `No se encontró epic.md en ${epicDir}/`);
    const { fields } = parseFrontmatter(toLines(fs.readFileSync(path.join(physDir, 'epic.md'), 'utf8')).lines);
    const slug = fields.slug || `${id || 'EPIC-NN'}-epica`;
    return { ok: true, dir: `${FLOW}/${slug}`, physDir };
  }
  let dir;
  if (epicPath !== undefined) {
    const rel = path.relative(repoRoot, path.resolve(repoRoot, epicPath)).split(path.sep).join('/');
    if (!EPIC_PATH_RE.test(rel)) {
      return fail('INVALID_PATH', `La ruta ${epicPath} no es una épica de specs/flow/ (se esperaba specs/flow/EPIC-NNN-<slug>/)`);
    }
    dir = rel.replace(/\/epic\.md$/, '');
    if (!fs.existsSync(abs(repoRoot, dir)) || !fs.statSync(abs(repoRoot, dir)).isDirectory()) {
      return fail('NOT_FOUND', `No se encontró el directorio ${dir}/ (ruta buscada: specs/flow/${path.basename(dir)}/)`);
    }
  } else {
    const base = abs(repoRoot, FLOW);
    const matches = fs.existsSync(base)
      ? fs.readdirSync(base, { withFileTypes: true })
        .filter((e) => e.isDirectory() && e.name.startsWith(`${id}-`))
        .map((e) => `${FLOW}/${e.name}`)
      : [];
    if (matches.length === 0) return fail('NOT_FOUND', `No se encontró la épica ${id} (ruta buscada: ${FLOW}/${id}-*/)`);
    if (matches.length > 1) return fail('AMBIGUOUS', `Hay ${matches.length} directorios para ${id} en ${FLOW}/: ${matches.join(', ')}. Deja uno solo o indica la ruta explícita.`, { matches });
    dir = matches[0];
  }
  const physDir = abs(repoRoot, dir);
  if (!fs.existsSync(path.join(physDir, 'epic.md'))) return fail('NO_EPIC_FILE', `No se encontró epic.md en ${dir}/`);
  return { ok: true, dir, physDir };
}

/** Plan de solo lectura: localiza, gate por `verdict`, revalida y planifica las correcciones (D-3). */
function planImprove({ repoRoot, id, epicPath, epicDir, today = localToday() }) {
  const located = locateEpic({ repoRoot, id, epicPath, epicDir });
  if (!located.ok) return located;
  const { dir, physDir } = located;
  const epicId = (dir.match(/EPIC-\d{2,}/) || ['EPIC-NN'])[0];

  const epicFile = path.join(physDir, 'epic.md');
  const reportFile = path.join(physDir, 'epic-format-validation-report.md');
  const epicText = fs.readFileSync(epicFile, 'utf8');

  if (!fs.existsSync(reportFile)) {
    return fail('NO_REPORT', `No se encontró epic-format-validation-report.md en ${dir}/. Ejecuta /epic-format-validation ${epicId} primero.`, { epic: { id: epicId, dir } });
  }
  const reportText = fs.readFileSync(reportFile, 'utf8');
  const gate = gateVerdict(reportText);
  if (gate.status === 'APPROVED') {
    return fail('ALREADY_APPROVED', `${epicId}: /epic-format-validation declara APPROVED — la épica no necesita correcciones.`, { epic: { id: epicId, dir }, verdict: gate.verdict });
  }
  if (gate.status === 'invalid') {
    return fail('INVALID_VERDICT', `${epicId}: el reporte no declara NEEDS-REFINEMENT (verdict: ${gate.verdict ?? 'ausente'}) — vuelve a ejecutar /epic-format-validation ${epicId}.`, { epic: { id: epicId, dir }, verdict: gate.verdict });
  }

  const contract = resolveContract(repoRoot);
  if (!contract) return fail('NO_TEMPLATE', 'Template epic-template.md no encontrado (docs/templates/ y seed de epic-creation).', { epic: { id: epicId, dir } });

  const defects = parseDefects(reportText);
  const migration = hasMigration(reportText);
  const plan = planCorrections({
    epicText,
    contract,
    defects,
    hasMigration: migration,
    epicDir: path.basename(dir),
    today,
  });
  const frontmatter = parseFrontmatter(toLines(epicText).lines).fields;
  return {
    ok: true,
    code: 'OK',
    epic: { id: epicId, dir, status: frontmatter.status || null, substatus: frontmatter.substatus || null },
    verdict: gate.verdict,
    corrections: plan.corrections,
    poDecisions: plan.poDecisions,
    resolved: plan.resolved,
    outOfScope: plan.outOfScope,
    epicBefore: epicText,
    epicAfter: plan.content,
    changed: plan.changed,
    epicPath: `${dir}/epic.md`,
    bakPath: `${dir}/epic.md.bak`,
    physDir,
  };
}

/**
 * `apply`: re-planifica, escribe `epic.md.bak` (sobrescribiendo), escribe `epic.md` una sola vez
 * y lo relee comprobando cada corrección y que `status`/`substatus` son idénticos al `.bak`;
 * ante cualquier fallo, restaura `epic.md` desde el `.bak` (D-7.5).
 */
function applyImprove({ repoRoot, id, epicPath, epicDir, today = localToday() }) {
  const plan = planImprove({ repoRoot, id, epicPath, epicDir, today });
  if (!plan.ok) return plan;
  const { epic, epicPath: epicRel, bakPath, physDir } = plan;
  const epicFile = path.join(physDir, 'epic.md');
  const bakFile = path.join(physDir, 'epic.md.bak');
  const before = plan.epicBefore;
  const after = plan.epicAfter;

  if (!plan.corrections.length && plan.changed === false) {
    return { ...plan, code: 'NO_OP', message: `${epic.id}: no hay correcciones aplicables — no se modifica ningún archivo.`, wrote: [] };
  }

  try {
    fs.writeFileSync(bakFile, before, 'utf8');
  } catch (error) {
    return { ...plan, ok: false, code: 'BACKUP_FAILED', message: `No se pudo escribir ${bakPath} (${error.message}); no se modificó epic.md`, wrote: [] };
  }

  try {
    fs.writeFileSync(epicFile, after, 'utf8');
  } catch (error) {
    restore(bakFile, epicFile);
    return { ...plan, ok: false, code: 'WRITE_FAILED', message: `No se pudo escribir ${epicRel} (${error.message}); se restauró desde ${bakPath}`, wrote: [bakPath] };
  }

  const verification = verifyEpic(epicFile, bakFile, plan);
  if (!verification.ok) {
    restore(bakFile, epicFile);
    return { ...plan, ok: false, code: 'VERIFY_FAILED', message: `Corrección revertida: ${verification.reason}`, wrote: [bakPath] };
  }
  return {
    ...plan,
    code: 'OK',
    message: `${epic.id}: ${plan.corrections.length} correcciones aplicadas en ${epicRel}`,
    wrote: [bakPath, epicRel],
  };
}

function restore(bakFile, epicFile) {
  try {
    fs.copyFileSync(bakFile, epicFile);
  } catch {
    /* la restauración fallida se refleja en el código de error */
  }
}

/** Relectura (D-7.5): cada corrección presente y `status`/`substatus` idénticos al `.bak`. */
function verifyEpic(epicFile, bakFile, plan) {
  const after = fs.readFileSync(epicFile, 'utf8');
  const before = fs.readFileSync(bakFile, 'utf8');
  const afterFm = parseFrontmatter(toLines(after).lines).fields;
  const beforeFm = parseFrontmatter(toLines(before).lines).fields;
  if ((afterFm.status || null) !== (beforeFm.status || null)) return { ok: false, reason: 'status cambió' };
  if ((afterFm.substatus || null) === undefined && beforeFm.substatus !== undefined) return { ok: false, reason: 'substatus cambió' };
  for (const correction of plan.corrections) {
    if (correction.operacion === 'añadir' && correction.contenido.startsWith('## ')) {
      const title = correction.contenido.slice(3).split(' (')[0];
      if (!after.includes(`## ${title}`)) return { ok: false, reason: `falta la sección «${title}»` };
    }
  }
  return { ok: true };
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  if (command !== 'plan' && command !== 'apply') throw new Error(`subcomando no reconocido: ${command ?? '(ninguno)'} (usa plan o apply)`);
  const opts = {};
  for (let i = 0; i < rest.length; i += 2) {
    const flag = rest[i];
    const value = rest[i + 1];
    const key = { '--repo-root': 'repoRoot', '--id': 'id', '--path': 'epicPath', '--dir': 'epicDir', '--today': 'today' }[flag];
    if (!key) throw new Error(`argumento no reconocido: ${flag}`);
    if (value === undefined || value.startsWith('--')) throw new Error(`${flag} requiere un valor`);
    opts[key] = value;
  }
  if (!opts.repoRoot) throw new Error('falta --repo-root <dir>');
  const selectors = ['id', 'epicPath', 'epicDir'].filter((k) => opts[k] !== undefined);
  if (selectors.length !== 1) throw new Error('indica exactamente uno de --id EPIC-NN, --path <ruta> o --dir <dir>');
  if (opts.id !== undefined && !ID_RE.test(opts.id)) throw new Error(`--id mal formado: ${opts.id} (se esperaba EPIC-NN)`);
  if (opts.today !== undefined && !DATE_RE.test(opts.today)) throw new Error(`--today mal formado: ${opts.today} (se esperaba YYYY-MM-DD)`);
  return { command, opts: { ...opts, repoRoot: path.resolve(opts.repoRoot) } };
}

function main() {
  let parsed;
  try {
    parsed = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(`[ERROR] ${error.message}`);
    console.error('Uso: node epic-improve.js <plan|apply> --repo-root <dir> (--id EPIC-NN | --path <ruta> | --dir <dir-de-la-epica>)');
    process.exit(2);
  }
  const run = parsed.command === 'plan' ? planImprove : applyImprove;
  const result = run({ ...parsed.opts, today: parsed.opts.today || localToday() });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  process.exit(result.ok ? 0 : 1);
}

if (require.main === module) main();

module.exports = {
  gateVerdict,
  parseDefects,
  readTemplateContract,
  migrateStoryLine,
  planCorrections,
  locateEpic,
  planImprove,
  applyImprove,
};
