'use strict';

/**
 * Migrador determinista del layout histórico specs/{01-projects,02-epics,03-stories}.
 * El módulo conserva el conocimiento de la estructura retirada fuera del motor genérico.
 */

const fs = require('node:fs');
const path = require('node:path');

function engine() { return require('./memory-system.js'); }

const LEGACY_LEVELS = Object.freeze({ projects: '01-projects', epics: '02-epics', stories: '03-stories' });

/**
 * Detecta niveles retirados directamente bajo `specs/`, sin inspeccionar su contenido.
 * La ausencia o inaccesibilidad de la ruta es una condición normal del scaffold.
 */
function detectLegacyLevels(specsBase) {
  const specs = path.join(specsBase, 'specs');
  try {
    if (!fs.statSync(specs).isDirectory()) return [];
  } catch {
    return [];
  }
  return Object.values(LEGACY_LEVELS).filter((level) => {
    try { return fs.statSync(path.join(specs, level)).isDirectory(); } catch { return false; }
  });
}
const FENCE = /^\s*(?:```|~~~)/;
const ACTIONS = {
  create: ['CREADO', 'CREARÍA'], overwritten: ['SOBRESCRITO', 'SOBRESCRIBIRÍA'],
  preserved: ['PRESERVADO', 'PRESERVARÍA'], moved: ['MOVIDO', 'MOVERÍA'],
  updated: ['ACTUALIZADO', 'ACTUALIZARÍA'], deleted: ['ELIMINADO', 'ELIMINARÍA'],
  omitted: ['OMITIDO', 'OMITIRÍA'],
};

const VISION_HEADINGS = new Map([
  ['definicion del problema', 'Problema que resolvemos'],
  ['vision (elevator pitch)', 'Propuesta de valor'],
  ['beneficios clave', 'Propuesta de valor'],
  ['criterios de exito', 'Criterios de éxito'],
  ['restricciones', 'Alcance y límites'],
  ['fuera de alcance (non-goals)', 'Alcance y límites'],
]);
const PROJECT_VISION = new Set(['nombre de proyecto', ...VISION_HEADINGS.keys()]);
const PROJECT_CONTAINERS = new Set(['definicion del proyecto', 'requisitos', 'requisitos funcionales', 'requisitos no funcionales']);
const PROJECT_UNMIGRATED = new Set([
  'experiencia de usuario (ux) y diseno de interfaz (ui)', 'diseno de interfaz grafica (ui) y experiencia de usuario (ux)',
  'design vibe', 'visual inspiration', 'mapas de navegacion', 'wireframe ascii (box drawing)', 'arquitectura tecnica',
  'stack tecnologico', 'referencias', 'definiciones y acronimos',
]);
const PRODUCT_LAYOUTS = {
  'vision.md': ['Problema que resolvemos', 'Propuesta de valor', 'VisiÃ³n (elevator pitch)', 'Beneficios clave', 'Criterios de Ã©xito', 'Alcance y lÃ­mites', 'Restricciones', 'Fuera de alcance (Non-Goals)'],
  'stakeholders.md': ['Usuarios y roles'],
  'objectives.md': ['Objetivos de negocio'],
  'roadmap.md': ['Ã‰picas'],
};

function normalize(text) { return String(text || '').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n'); }
function clean(text) { return normalize(text).replace(/<!--[\s\S]*?-->/g, ''); }
function normalizeHeading(value) {
  return clean(value).replace(/^\s*\d+(?:\.\d+)*\.?\s+/, '').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
}
function trim(lines) { const out = [...lines]; while (out.length && !out[out.length - 1].trim()) out.pop(); while (out.length && !out[0].trim()) out.shift(); return out; }
function contentLines(lines) { return clean(lines.join('\n')).split('\n').map((line) => line.trim()).filter(Boolean); }
function isPlaceholder(line) {
  let value = line.trim().replace(/^-\s+(?:\[[ xX]\]\s+)?/, '').replace(/^\*\*[^*]+\*\*:\s*/, '');
  return /^\[[^\]]+\](?!\()$/.test(value);
}
function isEmptyBody(lines) { return contentLines(lines).every(isPlaceholder); }
function splitDocument(text) {
  const raw = normalize(text); const parsed = engine().parseFrontmatter(raw);
  const lines = parsed.body.split('\n'); const sections = []; let fence = false;
  let start = -1; let heading = null; let level = 0; const headings = [];
  lines.forEach((line, index) => {
    if (FENCE.test(line)) fence = !fence;
    const match = !fence && line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (!match) return;
    if (start >= 0) sections.push({ heading, key: normalizeHeading(heading), level, body: lines.slice(start + 1, index), index: start });
    start = index; heading = match[2]; level = match[1].length; headings.push(index);
  });
  if (start >= 0) sections.push({ heading, key: normalizeHeading(heading), level, body: lines.slice(start + 1), index: start });
  // El cuerpo propio termina en cualquier encabezado, no incluye sus subsecciones.
  for (let i = 0; i < sections.length; i += 1) {
    const next = sections[i + 1];
    sections[i].body = lines.slice(sections[i].index + 1, next ? next.index : lines.length);
    let parent = null;
    for (let j = i - 1; j >= 0; j -= 1) if (sections[j].level < sections[i].level) { parent = sections[j]; break; }
    sections[i].parent = parent;
  }
  return { parsed, lines, sections };
}

function preambleFindings(document, source, { project = false } = {}) {
  const first = document.sections[0] ? document.sections[0].index : document.lines.length;
  const meaningful = clean(document.lines.slice(0, first).join('\n')).split('\n').map((line) => line.trim())
    .filter((line) => line && !/^#\s+/.test(line) && !/^(?:!?)?\[\[[^\]]+\]\]$/.test(line));
  // Un tÃ­tulo de proyecto es encabezado, no preÃ¡mbulo, incluso si es # sin numeraciÃ³n.
  if (project && document.sections[0] && document.sections[0].level === 1) return [];
  return meaningful.length ? [{ kind: 'unmigrated', detail: 'preÃ¡mbulo â€” contenido antes de la primera secciÃ³n' }] : [];
}

function sectionContent(section) { return trim(clean((section.body || []).join('\n')).split('\n')); }
function visionFills(sections) {
  const fills = {};
  for (const section of sections) {
    if (!VISION_HEADINGS.has(section.key) || isEmptyBody(section.body)) continue;
    const value = sectionContent(section);
    if (section.key === 'vision (elevator pitch)' || section.key === 'beneficios clave') {
      const old = fills['Propuesta de valor'] || [];
      fills['Propuesta de valor'] = [...old, ...(old.length ? ['', ''] : []), `### ${section.key === 'vision (elevator pitch)' ? 'Visión (elevator pitch)' : 'Beneficios clave'}`, '', ...value];
    } else if (section.key === 'restricciones' || section.key === 'fuera de alcance (non-goals)') {
      const old = fills['Alcance y límites'] || [];
      fills['Alcance y límites'] = [...old, ...(old.length ? ['', ''] : []), `### ${section.key === 'restricciones' ? 'Restricciones' : 'Fuera de alcance (Non-Goals)'}`, '', ...value];
    } else fills[VISION_HEADINGS.get(section.key)] = value;
  }
  return fills;
}
function classifyProjectSections(document) {
  const findings = []; const categories = []; const vision = []; let users = null;
  for (const section of document.sections) {
    if (section.level === 1) continue;
    const empty = isEmptyBody(section.body);
    const inRequirements = section.parent && (section.parent.key === 'requisitos' || section.parent.parent && section.parent.parent.key === 'requisitos');
    if (PROJECT_VISION.has(section.key)) { if (section.key !== 'nombre de proyecto') vision.push(section); if (empty) findings.push({ kind: 'omitted', detail: `${section.heading} â€” secciÃ³n vacÃ­a` }); continue; }
    if (section.key === 'caracteristicas de los usuarios') { users = section; if (empty) findings.push({ kind: 'omitted', detail: `${section.heading} â€” secciÃ³n vacÃ­a` }); continue; }
    if (PROJECT_CONTAINERS.has(section.key)) {
      if (!empty) findings.push({ kind: 'unmigrated', detail: `${section.heading} â€” contenido fuera de un requisito` });
      continue;
    }
    if (inRequirements) { if (empty) findings.push({ kind: 'omitted', detail: `${section.heading} â€” secciÃ³n vacÃ­a` }); else categories.push(section); continue; }
    if (empty) { findings.push({ kind: 'omitted', detail: `${section.heading} â€” secciÃ³n vacÃ­a` }); continue; }
    findings.push({ kind: 'unmigrated', detail: PROJECT_UNMIGRATED.has(section.key)
      ? `${section.heading} â€” secciÃ³n del template sin destino asignado por ADR-0013; muÃ©vela a mano y re-ejecuta`
      : `${section.heading} â€” secciÃ³n no reconocida por el template de SDDF` });
  }
  return { findings, categories, vision, users };
}

function requirementSlug(title) {
  const compact = String(title).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (compact.length <= 50) return compact || 'requisito';
  const cut = compact.slice(0, 50); return (cut.lastIndexOf('-') > 0 ? cut.slice(0, cut.lastIndexOf('-')) : cut).replace(/-+$/, '');
}

function parseRequirements(sections) {
  const requirements = []; const findings = []; const seen = new Set();
  for (const section of sections) {
    const category = section.heading || 'Requisitos'; let current = null;
    for (const raw of section.body || []) {
      const item = raw.match(/^\s*-\s+\*\*(FR|NFR)-(\d{3,})(?:\*\*:|:\*\*)\s*(.+?)\s*$/i);
      if (item) {
        const id = `${item[1].toUpperCase()}-${item[2]}`;
        if (seen.has(id)) { findings.push({ kind: 'unmigrated', detail: `${id} — ID duplicado` }); current = null; continue; }
        seen.add(id);
        if (isPlaceholder(item[3])) { findings.push({ kind: 'omitted', detail: `${id} — requisito de ejemplo del template` }); current = null; continue; }
        current = { id, kind: item[1].toUpperCase() === 'FR' ? 'functional' : 'non-functional', title: item[3], fields: [], category };
        requirements.push(current); continue;
      }
      const field = raw.match(/^\s+(?:-\s+)?\*\*([^*]+?)(?::\*\*|\*\*:)\s*(.*?)\s*$/);
      if (field && current) { current.fields.push([field[1].trim().replace(/:$/, ''), field[2]]); continue; }
      if (/^\s+\S/.test(raw) && current && current.fields.length) { current.fields[current.fields.length - 1][1] += `\n${raw.trim()}`; continue; }
      if (raw.trim() && !isPlaceholder(raw)) findings.push({ kind: 'unmigrated', detail: `${category} — contenido fuera del patrón de requisito ("${raw.trim().slice(0, 60)}")` });
    }
  }
  return { requirements, findings };
}

function quote(value) { return String(value).replace(/"/g, '\\"'); }
function renderRequirement(req, { date }) {
  const slug = requirementSlug(req.title); const kind = req.kind;
  const relPath = `requirements/${kind}/${req.id}-${slug}.md`;
  const fields = new Map(req.fields);
  const body = [
    '---', 'type: requirement', `kind: ${kind}`, `id: ${req.id}`, `slug: ${req.id}-${slug}`,
    `title: "${quote(req.title)}"`, 'status: active', `created: ${date}`, `updated: ${date}`, 'related: []', '---', '',
    `# ${req.id} — ${req.title}`, '', '## Descripción', '', fields.get('Descripción') || '[Por completar]',
  ];
  if (fields.has('Criterio de aceptación')) body.push('', '## Criterios de verificación', '', fields.get('Criterio de aceptación'));
  const ordered = ['Prioridad', 'Usuario', 'Fuente']; const attrs = [];
  for (const key of ordered) if (fields.has(key)) attrs.push([key, fields.get(key)]);
  attrs.push(['Categoría', req.category]);
  for (const entry of req.fields) if (!['Descripción', 'Criterio de aceptación', ...ordered].includes(entry[0])) attrs.push(entry);
  body.push('', '## Atributos', '', ...attrs.map(([key, value]) => `- **${key}**: ${value}`), '');
  return { relPath, content: body.join('\n') };
}

function replaceUpdated(text, date) {
  if (/^updated:/m.test(text)) return text.replace(/^updated:.*$/m, `updated: ${date}`);
  return text;
}
function visionStatus(content, source) {
  const current = source || {}; let next = null;
  if (['DONE', 'READY'].includes(current.substatus) || current.status === 'COMPLETED') next = 'DONE';
  if (current.substatus === 'IN-PROGRESS') next = 'IN-PROGRESS';
  return next && /^substatus:/m.test(content) ? content.replace(/^substatus:.*$/m, `substatus: ${next}`) : content;
}
function seedFor(name, date) {
  const file = path.join(engine().SCAFFOLD_DIR, 'product', name);
  if (fs.existsSync(file)) return engine().readText(file).replaceAll('{date}', date);
  const slug = path.basename(name, '.md'); const title = slug === 'roadmap' ? 'Roadmap' : slug;
  return `---\ntype: product\nslug: ${slug}\ntitle: "${title}"\nstatus: IN-PROGRESS\nsubstatus: TODO\nparent: null\ncreated: ${date}\nupdated: ${date}\n---\n\n# ${title}\n\nVolver al mapa: [[index]].\n`;
}
function bodyForHeading(text, heading) {
  const doc = splitDocument(text); const hit = doc.sections.find((section) => normalizeHeading(section.heading) === normalizeHeading(heading));
  if (!hit) return [];
  const footer = hit.body.findIndex((line) => /^Volver al mapa:/.test(line));
  return trim(footer < 0 ? hit.body : hit.body.slice(0, footer));
}
function setHeading(text, heading, value) {
  const lines = normalize(text).split('\n'); const target = normalizeHeading(heading); let start = -1; let level = 2;
  for (let i = 0; i < lines.length; i += 1) { const match = lines[i].match(/^(#{1,6})\s+(.+)$/); if (match && normalizeHeading(match[2]) === target) { start = i; level = match[1].length; break; } }
  if (start < 0) {
    const at = lines.findIndex((line) => /^Volver al mapa:/.test(line)); const insertion = [`## ${heading}`, '', ...trim(value), ''];
    lines.splice(at < 0 ? lines.length : at, 0, ...(at < 0 && lines.length && lines[lines.length - 1] ? [''] : []), ...insertion);
    return lines.join('\n');
  }
  let end = start + 1;
  while (end < lines.length) { const match = lines[end].match(/^(#{1,6})\s+/); if (match && match[1].length <= level) break; end += 1; }
  lines.splice(start + 1, end - start - 1, '', ...trim(value), ''); return lines.join('\n');
}
function fillDocument(text, layout, fills, { force = false, date, seed }) {
  let content = text === null ? (seed || '') : normalize(text); let changed = text === null;
  const conflicts = [];
  for (const [heading, value] of Object.entries(fills || {})) {
    const existing = bodyForHeading(content, heading); const desired = trim(Array.isArray(value) ? value : String(value).split('\n'));
    if (existing.length && existing.join('\n').trim() !== desired.join('\n').trim() && !isEmptyBody(existing)) { if (!force) { conflicts.push(heading); continue; } }
    const next = setHeading(content, heading, desired); if (next !== content) { content = next; changed = true; }
  }
  if (conflicts.length) return { action: 'conflict', content: text, conflicts };
  content = replaceUpdated(content, date); return { action: text === null ? 'create' : changed ? 'fill' : 'unchanged', content: `${content.replace(/\n*$/, '')}\n`, conflicts: [] };
}

function rewriteWikilinks(text, map) {
  const parsed = engine().parseFrontmatter(text); const lines = parsed.body.split('\n'); let fence = false; const counts = {};
  const body = lines.map((line) => {
    if (FENCE.test(line)) { fence = !fence; return line; }
    if (fence) return line;
    const replacePart = (part) => part.replace(/(?<!!)\[\[([^\]\n]+)\]\]/g, (whole, raw) => {
      const target = raw.split(/[|#]/, 1)[0].trim(); if (!Object.hasOwn(map, target)) return whole;
      const suffix = raw.slice(target.length); counts[target] = (counts[target] || 0) + 1; return `[[${map[target]}${suffix}]]`;
    });
    return line.split(/(`[^`]*`)/).map((part) => part.startsWith('`') ? part : replacePart(part)).join('');
  }).join('\n');
  if (!parsed.hasFrontmatter) return { text: body, counts };
  const prefix = normalize(text).slice(0, normalize(text).length - parsed.body.length); return { text: `${prefix}${body}`, counts };
}

function files(root) {
  if (!fs.existsSync(root)) return []; const out = [];
  const visit = (dir) => fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).forEach((entry) => {
    const full = path.join(dir, entry.name); if (entry.isDirectory()) visit(full); else if (entry.isFile()) out.push(full);
  }); visit(root); return out;
}
function epicSnapshot(specsBase, date) {
  const candidates = ['epics', LEGACY_LEVELS.epics].flatMap((level) => files(path.join(specsBase, 'specs', level)).filter((file) => path.basename(file) === 'epic.md'));
  const epics = candidates.map((file) => ({ file, data: engine().parseFrontmatter(engine().readText(file)).data })).sort((a, b) => String(a.data.id || '').localeCompare(String(b.data.id || ''), undefined, { numeric: true }));
  if (!epics.length) return [`Sin épicas creadas al ${date}.`];
  const safe = (value) => String(value || '—').replace(/\|/g, '\\|');
  return [`Foto del ${date}: ${epics.length} épicas. Valores copiados del frontmatter de cada epic.md.`, '', '| ID | Épica | Título | Status | Substatus |', '| --- | --- | --- | --- | --- |', ...epics.map(({ file, data }) => `| ${safe(data.id)} | [[${data.slug || path.basename(path.dirname(file))}]] | ${safe(data.title)} | ${safe(data.status)} | ${safe(data.substatus)} |`)];
}
function add(plan, action, rel, note = '', data = {}) { plan.entries.push({ action, rel, note, ...data }); if (action === 'unmigrated') plan.unmigrated += 1; }
function rel(root, file) { return engine().toPosix(path.relative(root, file)); }

function planSpecsMigration(specsBase, { force = false, date = engine().todayIso() } = {}) {
  const plan = { entries: [], writes: [], moves: [], deletes: [], rewrites: [], linkMap: {}, linkSources: {}, unmigrated: 0, blockedSources: new Set() };
  const specs = path.join(specsBase, 'specs'); const projects = path.join(specs, LEGACY_LEVELS.projects);
  if (!fs.existsSync(specs)) return plan;
  const dirs = fs.existsSync(projects) ? fs.readdirSync(projects, { withFileTypes: true }).filter((entry) => entry.isDirectory()).sort((a, b) => a.name.localeCompare(b.name)) : [];
  if (dirs.length > 1) { add(plan, 'unmigrated', `specs/${LEGACY_LEVELS.projects}/`, `${dirs.length} proyectos (${dirs.map((d) => d.name).join(', ')}): ADR-0013 admite un solo proyecto por raíz; migra o separa cada proyecto a mano y re-ejecuta`); return plan; }
  const projectDir = dirs.length === 1 ? path.join(projects, dirs[0].name) : null; let projectOk = true;
  const block = (source, detail) => { add(plan, 'unmigrated', rel(specsBase, source), detail, { source }); plan.blockedSources.add(source); projectOk = false; };
  const mapLink = (oldSlug, nextSlug, source) => { plan.linkMap[oldSlug] = nextSlug; plan.linkSources[oldSlug] = source; };
  const scheduleWrite = (target, content, source) => {
    const old = fs.existsSync(target) ? engine().readText(target) : null;
    if (old !== null && old === content) { add(plan, 'preserved', rel(specsBase, target), '', { source }); return; }
    if (old !== null && !force) { block(source, `${rel(specsBase, target)} tiene contenido propio; usa --force para sobrescribir`); return; }
    plan.writes.push({ target, content, source }); add(plan, old === null ? 'create' : 'overwritten', rel(specsBase, target), '', { source });
  };
  const scheduleMove = (source, target, content = null) => {
    if (fs.existsSync(target)) {
      const sourceBytes = fs.readFileSync(source); const targetBytes = fs.readFileSync(target);
      if (sourceBytes.equals(targetBytes) && content === null) { add(plan, 'preserved', rel(specsBase, target), '', { source }); plan.deletes.push({ target: source, source }); add(plan, 'deleted', rel(specsBase, source), '', { source }); return; }
      if (!force) { block(source, `ya existe ${rel(specsBase, target)}; usa --force para sobrescribir`); return; }
      add(plan, 'overwritten', rel(specsBase, target), '', { source });
    }
    plan.moves.push({ source, target, content }); add(plan, 'moved', `${rel(specsBase, source)} → ${rel(specsBase, target)}`, '', { source });
  };
  if (projectDir) {
    mapLink(dirs[0].name, 'vision', path.join(projectDir, 'project.md'));
    const known = new Set(['project-intent.md', 'project.md', 'project-plan.md', 'story-map.md']);
    for (const entry of fs.readdirSync(projectDir, { withFileTypes: true })) {
      const source = path.join(projectDir, entry.name);
      if (entry.isDirectory()) { block(source, 'subdirectorio sin destino'); continue; }
      if (entry.isFile() && !known.has(entry.name) && !/\.puml$/i.test(entry.name) && !/\.(png|svg)$/i.test(entry.name)) block(source, 'archivo sin destino en ADR-0013');
    }
    const intent = path.join(projectDir, 'project-intent.md');
    if (fs.existsSync(intent)) {
      const intentMeta = engine().parseFrontmatter(engine().readText(intent)).data;
      mapLink(intentMeta.slug || 'project-intent', 'vision', intent);
      const document = splitDocument(engine().readText(intent)); const fills = {};
      for (const finding of preambleFindings(document, intent)) block(intent, finding.detail);
      for (const section of document.sections.filter((section) => section.level === 2)) {
        const target = VISION_HEADINGS.get(section.key);
        if (!target) { if (!isEmptyBody(section.body)) block(intent, `seccion no reconocida por el template: ${section.heading}`); else add(plan, 'omitted', rel(specsBase, intent), `${section.heading} - seccion vacia`, { source: intent }); continue; }
        if (isEmptyBody(section.body)) { add(plan, 'omitted', rel(specsBase, intent), `${section.heading} - seccion vacia`, { source: intent }); continue; }
        const value = sectionContent(section);
        if (section.key === 'vision (elevator pitch)' || section.key === 'beneficios clave') {
          const current = fills['Propuesta de valor'] || [];
          fills['Propuesta de valor'] = [...current, ...(current.length ? ['', ''] : []), `### ${section.key === 'vision (elevator pitch)' ? 'Visión (elevator pitch)' : 'Beneficios clave'}`, '', ...value];
        } else if (section.key === 'restricciones' || section.key === 'fuera de alcance (non-goals)') {
          const current = fills['Alcance y límites'] || [];
          fills['Alcance y límites'] = [...current, ...(current.length ? ['', ''] : []), `### ${section.key === 'restricciones' ? 'Restricciones' : 'Fuera de alcance (Non-Goals)'}`, '', ...value];
        } else fills[target] = value;
      }
      const target = path.join(specsBase, 'product', 'vision.md'); const result = fillDocument(fs.existsSync(target) ? engine().readText(target) : null, [], fills, { force, date, seed: seedFor('vision.md', date) });
      if (result.action === 'conflict') block(intent, `product/vision.md tiene contenido propio en: ${result.conflicts.join(', ')}; usa --force para sobrescribir`);
      else scheduleWrite(target, visionStatus(result.content, intentMeta), intent);
    }
    const project = path.join(projectDir, 'project.md');
    if (fs.existsSync(project)) {
      const projectMeta = engine().parseFrontmatter(engine().readText(project)).data;
      mapLink(projectMeta.slug || dirs[0].name, 'vision', project);
      const doc = splitDocument(engine().readText(project));
      for (const finding of preambleFindings(doc, project, { project: true })) block(project, finding.detail);
      const classified = classifyProjectSections(doc);
      for (const finding of classified.findings) {
        if (finding.kind === 'unmigrated') block(project, finding.detail);
        else add(plan, 'omitted', rel(specsBase, project), finding.detail, { source: project });
      }
      if (fs.existsSync(intent)) {
        const intentText = clean(engine().readText(intent)).replace(/\s+/g, ' ').toLowerCase();
        for (const section of classified.vision) for (const line of sectionContent(section)) {
          if (intentText.includes(line.replace(/\s+/g, ' ').toLowerCase())) add(plan, 'omitted', rel(specsBase, project), `${section.heading} - cubierta por project-intent.md`, { source: project });
          else block(project, `${section.heading} - difiere de project-intent.md ("${line.slice(0, 60)}"); unifica el texto y re-ejecuta`);
        }
      } else if (classified.vision.length) {
        const fills = visionFills(classified.vision); const target = path.join(specsBase, 'product', 'vision.md');
        const result = fillDocument(fs.existsSync(target) ? engine().readText(target) : null, PRODUCT_LAYOUTS['vision.md'], fills, { force, date, seed: seedFor('vision.md', date) });
        if (result.action === 'conflict') block(project, `product/vision.md tiene contenido propio en: ${result.conflicts.join(', ')}; usa --force para sobrescribir`);
        else scheduleWrite(target, visionStatus(result.content, projectMeta), project);
      }
      const parsed = parseRequirements(classified.categories);
      for (const finding of parsed.findings) {
        if (finding.kind === 'unmigrated') block(project, finding.detail);
        else add(plan, 'omitted', rel(specsBase, project), finding.detail, { source: project });
      }
      for (const req of parsed.requirements) {
        const output = renderRequirement(req, { date }); const target = path.join(specsBase, ...output.relPath.split('/'));
        const collisions = files(path.join(specsBase, 'requirements')).filter((file) => {
          const name = path.basename(file); return new RegExp(`^${req.id.replace('-', '\\-')}-`, 'i').test(name) || (path.basename(file).startsWith('srs-') && new RegExp(`^###\\s+${req.id}\\b`, 'm').test(engine().readText(file)));
        });
        const same = collisions.find((file) => engine().readText(file) === output.content);
        if (same) { add(plan, 'preserved', rel(specsBase, same), '', { source: project }); continue; }
        if (collisions.length) { block(project, `${req.id} - ya existe ${rel(specsBase, collisions[0])}`); continue; }
        scheduleWrite(target, output.content, project);
      }
      for (const srs of files(path.join(specsBase, 'requirements')).filter((file) => /^srs-.*\.md$/i.test(path.basename(file)))) add(plan, 'warning', rel(specsBase, srs), 'existe un SRS único; los requisitos migrados se escriben fragmentados');
      const users = classified.users;
      if (users && !isEmptyBody(users.body)) { const target = path.join(specsBase, 'product', 'stakeholders.md'); const result = fillDocument(fs.existsSync(target) ? engine().readText(target) : null, PRODUCT_LAYOUTS['stakeholders.md'], { 'Usuarios y roles': sectionContent(users) }, { force, date, seed: seedFor('stakeholders.md', date) }); if (result.action === 'conflict') block(project, 'product/stakeholders.md tiene contenido propio; usa --force para sobrescribir'); else scheduleWrite(target, result.content, project); }
    }
    const projectPlan = path.join(projectDir, 'project-plan.md');
    if (fs.existsSync(projectPlan)) {
      const planMeta = engine().parseFrontmatter(engine().readText(projectPlan)).data;
      mapLink(planMeta.slug || 'project-plan', 'roadmap', projectPlan);
      const doc = splitDocument(engine().readText(projectPlan));
      for (const finding of preambleFindings(doc, projectPlan)) block(projectPlan, finding.detail);
      const objective = doc.sections.find((section) => section.key === 'objetivo');
      if (objective && !isEmptyBody(objective.body)) { const target = path.join(specsBase, 'product', 'objectives.md'); const result = fillDocument(fs.existsSync(target) ? engine().readText(target) : null, PRODUCT_LAYOUTS['objectives.md'], { 'Objetivos de negocio': sectionContent(objective) }, { force, date, seed: seedFor('objectives.md', date) }); if (result.action === 'conflict') block(projectPlan, 'product/objectives.md tiene contenido propio; usa --force para sobrescribir'); else scheduleWrite(target, result.content, projectPlan); }
      const rest = doc.sections.filter((section) => section !== objective && section.level >= 2).flatMap((section) => [`### ${section.heading}`, ...sectionContent(section), '']).filter((line) => line !== '---');
      const planDate = /^\d{4}-\d{2}-\d{2}$/.test(planMeta.created || '') ? planMeta.created : date;
      const target = path.join(specsBase, 'product', 'roadmap.md'); const heading = `Plan original (${planDate})`;
      const fills = { 'Épicas': epicSnapshot(specsBase, planDate) };
      if (rest.some((line) => line.trim())) fills[heading] = ['> Histórico: plan de épicas de `project-plan.md` migrado sin cambios; no refleja el estado actual de las épicas.', '', ...trim(rest)];
      if (!fills[heading]) add(plan, 'omitted', rel(specsBase, projectPlan), 'sin plan de épicas', { source: projectPlan });
      const result = fillDocument(fs.existsSync(target) ? engine().readText(target) : null, PRODUCT_LAYOUTS['roadmap.md'], fills, { force, date, seed: seedFor('roadmap.md', date) });
      if (result.action === 'conflict') block(projectPlan, 'product/roadmap.md tiene contenido propio; usa --force para sobrescribir'); else scheduleWrite(target, result.content, projectPlan);
    }
    const storyMap = path.join(projectDir, 'story-map.md'); if (fs.existsSync(storyMap)) { const text = engine().readText(storyMap).replace(/^type:.*$/m, 'type: product'); scheduleMove(storyMap, path.join(specsBase, 'product', 'story-map.md'), text); }
    for (const file of fs.readdirSync(projectDir).filter((name) => /\.puml$/i.test(name))) {
      const source = path.join(projectDir, file); scheduleMove(source, path.join(specsBase, 'architecture', 'c4', file));
      for (const ext of ['.png', '.svg']) { const rendered = path.join(projectDir, `${path.basename(file, '.puml')}${ext}`); if (fs.existsSync(rendered)) scheduleMove(rendered, path.join(specsBase, 'architecture', 'c4', path.basename(rendered))); }
    }
    // Cada archivo listo se elimina aunque otra unidad del proyecto quede bloqueada.
    if (!projectOk) for (const name of ['project-intent.md', 'project.md', 'project-plan.md']) {
      const source = path.join(projectDir, name);
      if (fs.existsSync(source) && !plan.blockedSources.has(source)) { plan.deletes.push({ target: source, source }); add(plan, 'deleted', rel(specsBase, source), '', { source }); }
    }
    if (projectOk) {
      for (const file of files(projectDir)) if (!/\.(png|svg)$/i.test(file) || !fs.existsSync(file.replace(/\.(png|svg)$/i, '.puml'))) { plan.deletes.push(file); add(plan, 'deleted', rel(specsBase, file)); }
      plan.deletes.push(projectDir, projects); add(plan, 'deleted', rel(specsBase, projectDir)); add(plan, 'deleted', rel(specsBase, projects));
    }
  } else if (fs.existsSync(projects)) { plan.deletes.push(projects); add(plan, 'deleted', rel(specsBase, projects)); }
  for (const [oldLevel, nextLevel] of [[LEGACY_LEVELS.epics, 'epics'], [LEGACY_LEVELS.stories, 'stories']]) {
    const sourceLevel = path.join(specs, oldLevel); if (!fs.existsSync(sourceLevel)) continue;
    for (const entry of fs.readdirSync(sourceLevel, { withFileTypes: true })) {
      if (entry.name === '.gitkeep') { plan.deletes.push(path.join(sourceLevel, entry.name)); continue; }
      const source = path.join(sourceLevel, entry.name); const target = path.join(specs, nextLevel, entry.name);
      scheduleMove(source, target);
    }
    plan.deletes.push(sourceLevel); add(plan, 'deleted', rel(specsBase, sourceLevel));
  }
  // Una unidad bloqueada no deja destinos parciales ni reescribe enlaces con su slug.
  plan.writes = plan.writes.filter((entry) => !plan.blockedSources.has(entry.source));
  plan.moves = plan.moves.filter((entry) => !plan.blockedSources.has(entry.source));
  plan.deletes = plan.deletes.filter((entry) => !entry.source || !plan.blockedSources.has(entry.source));
  plan.entries = plan.entries.filter((entry) => entry.action === 'unmigrated' || entry.action === 'warning' || !entry.source || !plan.blockedSources.has(entry.source));
  for (const [slug, source] of Object.entries(plan.linkSources)) if (plan.blockedSources.has(source)) delete plan.linkMap[slug];
  return plan;
}

function migrateSpecs(specsBase, options = {}) {
  const { dryRun = false, force = false, date = engine().todayIso(), displayRoot = null } = options; const plan = planSpecsMigration(specsBase, { force, date });
  const lines = [`── memory-system migrate ── from: specs-3-levels · root: ${displayRoot || engine().toPosix(specsBase)}`]; const summary = { created: 0, overwritten: 0, preserved: 0, moved: 0, updated: 0, deleted: 0, unmigrated: plan.unmigrated };
  const counters = { create: 'created', overwritten: 'overwritten', preserved: 'preserved', moved: 'moved', updated: 'updated', deleted: 'deleted' };
  for (const entry of plan.entries) {
    if (entry.action === 'unmigrated') { lines.push(`[NO MIGRADO] ${entry.rel} — ${entry.note}`); continue; }
    if (entry.action === 'warning') { lines.push(`[WARNING] ${entry.rel} — ${entry.note}`); continue; }
    const label = ACTIONS[entry.action][dryRun ? 1 : 0]; lines.push(`[${label}] ${entry.rel}${entry.note ? ` — ${entry.note}` : ''}`); if (counters[entry.action]) summary[counters[entry.action]] += 1;
  }
  let runtimeUnmigrated = 0;
  if (!dryRun) {
    for (const write of plan.writes) { engine().assertInsideRoot(specsBase, write.target); fs.mkdirSync(path.dirname(write.target), { recursive: true }); fs.writeFileSync(write.target, write.content, 'utf8'); }
    for (const move of plan.moves) {
      if (!fs.existsSync(move.source)) continue;
      try {
        engine().assertInsideRoot(specsBase, move.target); fs.mkdirSync(path.dirname(move.target), { recursive: true });
        if (fs.existsSync(move.target)) { if (!force) continue; fs.rmSync(move.target, { recursive: true, force: true }); }
        if (move.content) fs.writeFileSync(move.target, move.content, 'utf8'); else fs.renameSync(move.source, move.target);
        if (move.content && fs.existsSync(move.source)) fs.rmSync(move.source, { force: true });
      } catch (error) { runtimeUnmigrated += 1; lines.push(`[NO MIGRADO] ${rel(specsBase, move.source)} — no se pudo mover: ${error.code || error.name}`); }
    }
    for (const file of files(specsBase).filter((file) => file.endsWith('.md'))) { const original = engine().readText(file); const replaced = rewriteWikilinks(original, plan.linkMap); if (Object.keys(replaced.counts).length) { fs.writeFileSync(file, replaced.text, 'utf8'); summary.updated += 1; lines.push(`[ACTUALIZADO] ${rel(specsBase, file)} — wikilinks migrados`); } }
    for (const item of [...plan.deletes].sort((a, b) => (b.target || b).length - (a.target || a).length)) {
      const target = item.target || item;
      if (!fs.existsSync(target)) continue;
      try { if (fs.statSync(target).isDirectory()) { if (!fs.readdirSync(target).length) fs.rmdirSync(target); } else fs.rmSync(target); } catch { /* el origen queda para reanudar */ }
    }
  }
  lines.push('─'.repeat(48), `creados: ${summary.created} · sobrescritos: ${summary.overwritten} · preservados: ${summary.preserved} · movidos: ${summary.moved} · actualizados: ${summary.updated} · eliminados: ${summary.deleted}`);
  if (dryRun) lines.push(`cambios pendientes: ${summary.created + summary.overwritten + summary.moved + summary.updated + summary.deleted}`);
  summary.unmigrated += runtimeUnmigrated;
  return { lines, summary, exitCode: summary.unmigrated ? 1 : 0 };
}

module.exports = { LEGACY_LEVELS, detectLegacyLevels, normalizeHeading, isEmptyBody, requirementSlug, parseRequirements, renderRequirement, fillDocument, rewriteWikilinks, splitDocument, classifyProjectSections, planSpecsMigration, migrateSpecs };
