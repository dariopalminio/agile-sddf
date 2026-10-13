'use strict';

// Conocimiento de la capa requirements/. Se carga desde memory-system.js de forma
// diferida para no crear un ciclo de inicialización con el motor.
const fs = require('node:fs');
const path = require('node:path');

const REQUIREMENT_ID = /^(FR|NFR)-\d{3,}$/;
const FRAGMENT = /^(FR|NFR)-\d{3,}(?:-.+)?\.md$/i;

function engine() { return require('./memory-system.js'); }
function posix(value) { return engine().toPosix(value); }
function compare(a, b) { return a < b ? -1 : a > b ? 1 : 0; }
function read(file) { return engine().readText(file); }
function exists(file) { return fs.existsSync(file); }
function files(dir) {
  if (!exists(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).filter((entry) => entry.isFile())
    .map((entry) => path.join(dir, entry.name)).sort((a, b) => compare(path.basename(a), path.basename(b)));
}
function allMarkdown(dir, out = []) {
  if (!exists(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) allMarkdown(full, out);
    else if (entry.isFile() && /\.md$/i.test(entry.name)) out.push(full);
  }
  return out.sort((a, b) => compare(posix(a), posix(b)));
}
function slugify(text, max = 50) {
  let slug = String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (slug.length > max) {
    const cut = slug.slice(0, max);
    slug = cut.includes('-') ? cut.slice(0, cut.lastIndexOf('-')) : cut;
  }
  return slug.replace(/^-+|-+$/g, '');
}
function projectSlug(repoRoot) { return slugify(path.basename(path.resolve(repoRoot))) || 'proyecto'; }
function parseIdList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value !== 'string') return [];
  const trimmed = value.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) return trimmed.slice(1, -1).split(',').map((item) => item.trim()).filter(Boolean);
  return [trimmed];
}

function visibleLines(text) {
  const parsed = engine().parseFrontmatter(text);
  const lines = parsed.body.split('\n'); let fenced = false; let comment = false;
  return lines.map((line, index) => {
    if (/^\s*(```|~~~)/.test(line)) { fenced = !fenced; return { line: '', index }; }
    if (fenced) return { line: '', index };
    let current = line;
    if (comment) {
      const end = current.indexOf('-->');
      if (end < 0) return { line: '', index };
      comment = false; current = current.slice(end + 3);
    }
    const start = current.indexOf('<!--');
    if (start >= 0) {
      const end = current.indexOf('-->', start + 4);
      if (end < 0) { comment = true; current = current.slice(0, start); }
      else current = current.slice(0, start) + current.slice(end + 3);
    }
    return { line: current, index };
  });
}
function heading(line) {
  const match = line.match(/^###\s+((?:FR|NFR)-\d{3,})\b\s*(?:[—–:-]\s*)?(.*)$/i);
  return match ? { id: match[1].toUpperCase(), title: match[2].trim() } : null;
}
function idNumber(value) {
  const match = String(value).match(/^(?:N?FR)-(\d+)$/i);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}
function orderById(a, b) { return idNumber(a.id) - idNumber(b.id) || compare(a.id, b.id); }

function inventoryRequirements(specsBase) {
  const requirements = path.join(specsBase, 'requirements');
  const srsFiles = files(requirements).filter((file) => /^srs-.*\.md$/i.test(path.basename(file)));
  const sections = [];
  for (const file of srsFiles) {
    const text = read(file); const body = engine().parseFrontmatter(text).body; const bodyLines = body.split('\n'); const visible = visibleLines(text); const heads = [];
    for (const row of visible) { const found = heading(row.line); if (found) heads.push({ ...found, index: row.index }); }
    const bodyPrefix = text.slice(0, text.length - body.length);
    const bodyStartLine = bodyPrefix.split('\n').length - 1;
    for (let i = 0; i < heads.length; i += 1) {
      const current = heads[i];
      const boundary = visible.find((row) => row.index > current.index && (/^##\s/.test(row.line) || heading(row.line)));
      const bodyEnd = boundary ? boundary.index : bodyLines.length;
      const contentLines = bodyLines.slice(current.index + 1, bodyEnd);
      sections.push({ ...current, relPath: posix(path.relative(specsBase, file)), line: bodyStartLine + current.index + 1, bodyLines: contentLines, file });
    }
  }
  const fragments = [];
  for (const [directory, kind] of [['functional', 'functional'], ['non-functional', 'non-functional']]) {
    for (const file of files(path.join(requirements, directory)).filter((item) => FRAGMENT.test(path.basename(item)))) {
      const parsed = engine().parseFrontmatter(read(file)); const name = path.basename(file, '.md');
      const match = name.match(/^((?:FR|NFR)-\d{3,})/i);
      fragments.push({ id: (match ? match[1] : '').toUpperCase(), kind, slug: name, relPath: posix(path.relative(specsBase, file)), file, data: parsed.data, body: parsed.body });
    }
  }
  fragments.sort((a, b) => compare(a.relPath, b.relPath)); sections.sort((a, b) => compare(a.relPath, b.relPath) || a.line - b.line);
  const catalogFile = path.join(requirements, 'index.md');
  const visibleSections = sections.length > 0;
  const layout = fragments.length && visibleSections ? 'mixed' : fragments.length ? 'fragmented' : visibleSections ? 'srs' : 'empty';
  return { layout, srsFiles, sections, fragments, catalog: exists(catalogFile) ? { file: catalogFile, relPath: 'requirements/index.md' } : null };
}
function resolveRequirement(inventory, id) {
  const wanted = String(id || '').toUpperCase();
  const fragment = inventory.fragments.find((item) => item.id === wanted);
  if (fragment) return { kind: 'file', relPath: fragment.relPath, slug: fragment.slug, target: fragment.slug };
  const section = inventory.sections.find((item) => item.id === wanted);
  if (section) return { kind: 'section', relPath: section.relPath, anchor: wanted, target: `${section.relPath.replace(/^requirements\//, '')}#${wanted}` };
  return null;
}
function requirementAliases(inventory) { return [...new Set([...inventory.fragments, ...inventory.sections].map((item) => item.id).filter((id) => REQUIREMENT_ID.test(id)))].sort(compare); }

function renderSrs(templateText, { slug, name, date }) {
  return String(templateText).replace(/^\s*# escritor:.*\n/gmi, '').replace(/<!--\s*escritor:[\s\S]*?-->/gi, '')
    .replace(/<project-slug>/g, slug).replace(/<Nombre del proyecto>/g, name).replace(/<YYYY-MM-DD>/g, date);
}
function srsTemplate(specsBase, seedTemplate) {
  const local = path.join(specsBase, 'templates', 'srs-template.md');
  return exists(local) ? read(local) : read(seedTemplate);
}
function scaffoldSrs({ specsBase, repoRoot, seedTemplate, dryRun = false, date = engine().todayIso(), skipLayers = [] }) {
  if (new Set(skipLayers).has('requirements')) return null;
  const inventory = inventoryRequirements(specsBase);
  if (inventory.srsFiles.length) return { relPath: posix(path.relative(specsBase, inventory.srsFiles[0])), action: 'preserved', note: '' };
  if (inventory.layout !== 'empty') return { relPath: inventory.layout === 'srs' ? inventory.sections[0]?.relPath || 'requirements/' : 'requirements/', action: 'preserved', note: inventory.layout === 'fragmented' ? ' — disposición fragmentada' : '' };
  const slug = projectSlug(repoRoot); const target = path.join(specsBase, 'requirements', `srs-${slug}.md`);
  engine().assertInsideRoot(specsBase, target);
  if (!dryRun) { fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, renderSrs(srsTemplate(specsBase, seedTemplate), { slug, name: slug, date }), 'utf8'); }
  return { relPath: posix(path.relative(specsBase, target)), action: 'created', note: '' };
}
function renderCatalog(inventory, { date, created = date }) {
  const entries = [...inventory.fragments].sort(orderById);
  const render = (prefix) => {
    const subset = entries.filter((entry) => entry.id.startsWith(prefix));
    return subset.length ? subset.map((entry) => `- [[${entry.slug}]] — ${entry.id} — ${entry.data.title || entry.id}`) : ['_(sin requisitos)_'];
  };
  return `---\ntype: wiki\nslug: requirements-catalog\ntitle: "Catálogo de requisitos"\nstatus: IN-PROGRESS\nsubstatus: DONE\nparent: null\ncreated: ${created}\nupdated: ${date}\n---\n\n# Catálogo de requisitos\n\n<!-- Generado por memory-system; no editar. -->\n\n## Requisitos funcionales\n\n${render('FR-').join('\n')}\n\n## Requisitos no funcionales\n\n${render('NFR-').join('\n')}\n\nVolver al mapa: [[index]].\n`;
}
function writeCatalog(specsBase, { dryRun = false, date = engine().todayIso() } = {}) {
  const inventory = inventoryRequirements(specsBase); if (inventory.layout !== 'fragmented') return null;
  const target = path.join(specsBase, 'requirements', 'index.md'); const created = exists(target) ? (engine().parseFrontmatter(read(target)).data.created || date) : date;
  const content = renderCatalog(inventory, { date, created });
  if (!dryRun) { engine().assertInsideRoot(specsBase, target); fs.writeFileSync(target, content, 'utf8'); }
  return { written: true, count: inventory.fragments.length };
}

function requirementProblems(ctx) {
  const inventory = ctx.requirements || inventoryRequirements(ctx.root); const problems = []; const seen = new Map();
  for (const item of [...inventory.sections, ...inventory.fragments]) {
    if (seen.has(item.id)) problems.push({ kind: 'requirement', path: item.relPath, detail: `ID duplicado ${item.id} (ya en ${seen.get(item.id)})` }); else seen.set(item.id, item.relPath);
  }
  for (const node of ctx.nodes || []) {
    if (!Object.hasOwn(node.declared || {}, 'implements')) continue;
    for (const id of parseIdList(node.declared.implements)) {
      if (!REQUIREMENT_ID.test(id)) problems.push({ kind: 'requirement', path: node.relPath, detail: `implements: ${id} no es un ID FR-NNN/NFR-NNN` });
      else if (!resolveRequirement(inventory, id)) problems.push({ kind: 'requirement', path: node.relPath, detail: `implements: ${id} no resuelve — no existe functional/${id}-*.md, non-functional/${id}-*.md ni "### ${id}" en requirements/srs-*.md` });
    }
  }
  if (inventory.layout === 'mixed') problems.push({ kind: 'requirement', path: 'requirements/', detail: 'requisitos en dos disposiciones — migra con /memory-system migrate --from=srs-single o --from=requirements-fragmented' });
  if (inventory.layout === 'fragmented') {
    if (!inventory.catalog) problems.push({ kind: 'requirement', path: 'requirements/index.md', detail: 'falta el catálogo — ejecuta /memory-system index' });
    for (const fragment of inventory.fragments) {
      const prefixKind = fragment.id.startsWith('FR-') ? 'functional' : 'non-functional'; const data = fragment.data;
      for (const [field, valid, note] of [['type', data.type === 'requirement', 'debe ser requirement'], ['id', data.id === fragment.id, 'no coincide con el prefijo'], ['kind', data.kind === fragment.kind && fragment.kind === prefixKind, `debe ser ${prefixKind} y coincidir con la carpeta ${fragment.kind}/`], ['slug', data.slug === fragment.slug, 'no coincide con el nombre'], ['title', typeof data.title === 'string' && data.title.trim(), 'vacío']]) if (!valid) problems.push({ kind: 'requirement', path: fragment.relPath, detail: `frontmatter de requisito: ${field} ${note}` });
    }
    if (inventory.catalog) {
      const catalog = read(inventory.catalog.file); const listed = new Set([...catalog.matchAll(/\b((?:FR|NFR)-\d{3,})\b/g)].map((match) => match[1])); const ids = new Set(inventory.fragments.map((item) => item.id));
      for (const id of ids) if (!listed.has(id)) problems.push({ kind: 'requirement', path: inventory.catalog.relPath, detail: `no lista ${id}` });
      for (const id of listed) if (!ids.has(id)) problems.push({ kind: 'requirement', path: inventory.catalog.relPath, detail: `lista ${id}, que no existe` });
    }
  }
  return problems.sort((a, b) => compare(a.path, b.path) || compare(a.detail, b.detail));
}

function rewriteRequirementLinks(text, map) {
  const parsed = engine().parseFrontmatter(text); let count = 0; let fenced = false; let comment = false;
  const rewriteVisible = (value) => value.replace(/\[\[([^\]\n]+)\]\]/g, (whole, inner) => {
    const [target, alias] = inner.split('|', 2); const next = map[target.trim()];
    if (!next) return whole; count += 1; return `[[${next}${alias === undefined ? '' : `|${alias}`}]]`;
  });
  const rewritten = parsed.body.split('\n').map((line) => {
    if (/^\s*(```|~~~)/.test(line)) { fenced = !fenced; return line; }
    if (fenced) return line;
    let output = ''; let cursor = 0;
    while (cursor < line.length) {
      if (comment) { const end = line.indexOf('-->', cursor); if (end < 0) return output + line.slice(cursor); comment = false; output += line.slice(cursor, end + 3); cursor = end + 3; continue; }
      const nextComment = line.indexOf('<!--', cursor); const visible = line.slice(cursor, nextComment < 0 ? line.length : nextComment);
      // Conserva literalmente los tramos de código inline; los enlaces de Markdown visibles sí se actualizan.
      output += visible.split(/(`[^`]*`)/g).map((part) => part.startsWith('`') ? part : rewriteVisible(part)).join('');
      if (nextComment < 0) break;
      const end = line.indexOf('-->', nextComment + 4);
      if (end < 0) { output += line.slice(nextComment); comment = true; break; }
      output += line.slice(nextComment, end + 3); cursor = end + 3;
    }
    return output;
  }).join('\n');
  if (!parsed.hasFrontmatter) return { text: rewritten, count };
  return { text: text.slice(0, text.length - parsed.body.length) + rewritten, count };
}
function fragmentContent(section, date) {
  const kind = section.id.startsWith('FR-') ? 'functional' : 'non-functional'; const slug = `${section.id}-${slugify(section.title)}`;
  const body = section.bodyLines.map((line) => line.replace(/^(#{4,})/g, (hashes) => hashes.slice(0, -2))).join('\n').replace(/^\n+|\n+$/g, '');
  return { kind, slug, content: `---\ntype: requirement\nkind: ${kind}\nid: ${section.id}\nslug: ${slug}\ntitle: "${section.title.replace(/"/g, '\\"')}"\nstatus: active\ncreated: ${date}\nupdated: ${date}\nrelated: []\n---\n\n# ${section.id} — ${section.title}\n${body ? `\n${body}` : ''}\n` };
}
function equivalentFragment(actual, expected) {
  const normalise = (value) => String(value).replace(/^created: .*$/m, 'created: <date>').replace(/^updated: .*$/m, 'updated: <date>');
  return normalise(actual) === normalise(expected);
}
function visibleOutsideRequirements(file) {
  const text = read(file); const parsed = engine().parseFrontmatter(text); const rows = visibleLines(text); let inside = false;
  const allowed = /^\s*(#\s|##\s+(Requisitos funcionales|Requisitos no funcionales)\s*$|$)/i;
  for (const row of rows) {
    const value = row.line.trim();
    if (heading(row.line)) { inside = true; continue; }
    if (/^##\s/.test(value)) inside = false;
    if (!inside && value && !allowed.test(row.line)) return { line: row.index + 1, text: value };
  }
  return null;
}
function fragmentIssues(fragment) {
  const data = fragment.data; const expectedKind = fragment.id.startsWith('FR-') ? 'functional' : 'non-functional'; const issues = [];
  if (data.id !== fragment.id) issues.push('id no coincide con el prefijo');
  if (data.status !== 'active') issues.push('status debe ser active');
  if (parseIdList(data.related).length) issues.push('related debe estar vacío');
  const allowed = new Set(['type', 'kind', 'id', 'slug', 'title', 'status', 'created', 'updated', 'related']);
  for (const key of Object.keys(data)) if (!allowed.has(key)) issues.push(`clave no admitida: ${key}`);
  if (data.type !== 'requirement') issues.push('type debe ser requirement');
  if (data.kind !== expectedKind || fragment.kind !== expectedKind) issues.push(`kind debe ser ${expectedKind}`);
  if (data.slug !== fragment.slug) issues.push('slug no coincide con el nombre');
  if (typeof data.title !== 'string' || !data.title.trim()) issues.push('title vacío');
  const headings = fragment.body.match(/^# (?!#)/gm) || [];
  if (headings.length !== 1) issues.push('el cuerpo debe tener un único encabezado #');
  return issues;
}
function linkEntries(specsBase, map, excluded = []) {
  const excludedSet = new Set(excluded.map((file) => path.resolve(file))); const entries = [];
  for (const file of allMarkdown(specsBase)) {
    const rel = posix(path.relative(specsBase, file));
    if (rel.startsWith('templates/') || excludedSet.has(path.resolve(file))) continue;
    const rewritten = rewriteRequirementLinks(read(file), map);
    if (rewritten.count) entries.push({ file, rel, ...rewritten });
  }
  return entries;
}
function migrationResult(from, specsBase, dryRun, entries, apply) {
  const labels = { create: ['CREADO', 'CREARÍA'], preserved: ['PRESERVADO', 'PRESERVARÍA'], rewrite: ['REESCRITO', 'REESCRIBIRÍA'], deleted: ['ELIMINADO', 'ELIMINARÍA'], blocked: ['NO MIGRADO', 'NO MIGRADO'], warning: ['WARNING', 'WARNING'], unchanged: ['SIN CAMBIOS', 'SIN CAMBIOS'] };
  const lines = [`── memory-system migrate ── from: ${from} · root: ${posix(specsBase)}`]; const summary = { created: 0, preserved: 0, rewritten: 0, deleted: 0 };
  for (const entry of entries) { lines.push(`[${labels[entry.action][dryRun ? 1 : 0]}] ${entry.rel}${entry.note ? ` — ${entry.note}` : ''}`); const key = { create: 'created', preserved: 'preserved', rewrite: 'rewritten', deleted: 'deleted' }[entry.action]; if (key) summary[key] += 1; }
  const blocked = entries.some((entry) => entry.action === 'blocked'); if (!blocked && !dryRun) apply();
  lines.push('─'.repeat(48), `creados: ${summary.created} · preservados: ${summary.preserved} · reescritos: ${summary.rewritten} · eliminados: ${summary.deleted}`);
  if (dryRun) lines.push(`cambios pendientes: ${summary.created + summary.rewritten + summary.deleted}`);
  return { lines, summary, exitCode: blocked ? 1 : 0 };
}
function migrateSrsSingle(specsBase, { dryRun = false, date = engine().todayIso(), displayRoot } = {}) {
  const inventory = inventoryRequirements(specsBase); const source = inventory.sections;
  if (!source.length) return { lines: [`── memory-system migrate ── from: srs-single · root: ${displayRoot || posix(specsBase)}`, '[SIN CAMBIOS] requirements/ — no hay SRS con requisitos'], summary: { created: 0, preserved: 0, rewritten: 0, deleted: 0 }, exitCode: 0 };
  const entries = []; if (inventory.layout === 'mixed') entries.push({ action: 'blocked', rel: 'requirements/', note: 'requisitos en dos disposiciones' });
  const seen = new Set(); for (const section of source) { if (seen.has(section.id)) entries.push({ action: 'blocked', rel: `${section.relPath}:${section.line}`, note: `ID duplicado ${section.id}` }); seen.add(section.id); }
  for (const file of inventory.srsFiles) { const outside = visibleOutsideRequirements(file); if (outside) entries.push({ action: 'blocked', rel: `${posix(path.relative(specsBase, file))}:${outside.line}`, note: 'contenido fuera de un requisito; muévelo (p. ej. a product/vision.md) y repite' }); }
  const lineCount = inventory.srsFiles.reduce((total, file) => total + read(file).split('\n').length, 0);
  if (source.length <= 15 && lineCount <= 500) entries.push({ action: 'warning', rel: source[0].relPath, note: `por debajo del umbral (${source.length} requisitos, ${lineCount} líneas); se migra igualmente` });
  const writes = source.map((section) => { const fragment = fragmentContent(section, date); return { section, fragment, file: path.join(specsBase, 'requirements', fragment.kind === 'functional' ? 'functional' : 'non-functional', `${fragment.slug}.md`) }; });
  for (const item of writes) entries.push({ action: exists(item.file) ? (equivalentFragment(read(item.file), item.fragment.content) ? 'preserved' : 'blocked') : 'create', rel: posix(path.relative(specsBase, item.file)), note: exists(item.file) && !equivalentFragment(read(item.file), item.fragment.content) ? 'ya existe con otro contenido' : '' });
  const catalog = path.join(specsBase, 'requirements', 'index.md'); entries.push({ action: exists(catalog) ? 'create' : 'create', rel: 'requirements/index.md' });
  const links = linkEntries(specsBase, Object.fromEntries(source.flatMap((section) => [[`${path.basename(section.file, '.md')}#${section.id}`, section.id], [path.basename(section.file, '.md'), 'requirements-catalog']])), writes.map((item) => item.file).concat([catalog]));
  for (const link of links) entries.push({ action: 'rewrite', rel: link.rel, note: `${link.count} wikilinks` });
  for (const file of inventory.srsFiles) entries.push({ action: 'deleted', rel: posix(path.relative(specsBase, file)) });
  return migrationResult('srs-single', specsBase, dryRun, entries, () => { for (const item of writes) { engine().assertInsideRoot(specsBase, item.file); fs.mkdirSync(path.dirname(item.file), { recursive: true }); if (!exists(item.file)) fs.writeFileSync(item.file, item.fragment.content, 'utf8'); } const next = inventoryRequirements(specsBase); engine().assertInsideRoot(specsBase, catalog); fs.writeFileSync(catalog, renderCatalog(next, { date, created: exists(catalog) ? engine().parseFrontmatter(read(catalog)).data.created || date : date }), 'utf8'); for (const link of links) { engine().assertInsideRoot(specsBase, link.file); fs.writeFileSync(link.file, link.text, 'utf8'); } for (const file of inventory.srsFiles) { engine().assertInsideRoot(specsBase, file); fs.rmSync(file); } });
}
function migrateFragmented(specsBase, { dryRun = false, date = engine().todayIso(), displayRoot } = {}) {
  const inventory = inventoryRequirements(specsBase); const fragments = inventory.fragments;
  if (!fragments.length) return { lines: [`── memory-system migrate ── from: requirements-fragmented · root: ${displayRoot || posix(specsBase)}`, '[SIN CAMBIOS] requirements/ — no hay requisitos fragmentados'], summary: { created: 0, preserved: 0, rewritten: 0, deleted: 0 }, exitCode: 0 };
  const entries = []; if (inventory.layout === 'mixed') entries.push({ action: 'blocked', rel: 'requirements/', note: 'requisitos en dos disposiciones' });
  const seen = new Set();
  for (const item of fragments) {
    if (seen.has(item.id)) entries.push({ action: 'blocked', rel: item.relPath, note: `ID duplicado ${item.id}` });
    seen.add(item.id);
    for (const issue of fragmentIssues(item)) entries.push({ action: 'blocked', rel: item.relPath, note: issue });
  }
  const target = inventory.srsFiles[0] || path.join(specsBase, 'requirements', `srs-${projectSlug(path.dirname(specsBase))}.md`);
  if (inventory.srsFiles.length > 1) entries.push({ action: 'blocked', rel: 'requirements/', note: 'hay más de un SRS destino' });
  if (inventory.srsFiles.length && inventory.sections.length) entries.push({ action: 'blocked', rel: posix(path.relative(specsBase, target)), note: 'el SRS destino ya tiene requisitos' });
  entries.push({ action: exists(target) ? 'preserved' : 'create', rel: posix(path.relative(specsBase, target)) });
  const slug = path.basename(target, '.md'); const linkMap = Object.fromEntries(fragments.flatMap((item) => [[item.slug, item.id], [item.relPath.replace(/^requirements\/(?:functional|non-functional)\//, '').replace(/\.md$/, ''), item.id]]).concat([['requirements-catalog', slug]]));
  const links = linkEntries(specsBase, linkMap, fragments.map((item) => item.file).concat(inventory.catalog ? [inventory.catalog.file] : []));
  for (const link of links) entries.push({ action: 'rewrite', rel: link.rel, note: `${link.count} wikilinks` });
  for (const item of fragments) entries.push({ action: 'deleted', rel: item.relPath }); if (inventory.catalog) entries.push({ action: 'deleted', rel: inventory.catalog.relPath });
  return migrationResult('requirements-fragmented', specsBase, dryRun, entries, () => {
    const template = exists(target) ? read(target) : renderSrs(read(path.join(__dirname, '..', 'assets', 'scaffold', 'templates', 'srs-template.md')), { slug: projectSlug(path.dirname(specsBase)), name: projectSlug(path.dirname(specsBase)), date });
    const chunks = fragments.sort(orderById).map((item) => { const title = item.data.title || item.id; const body = item.body.replace(/^#\s+[^\n]*\n?/, '').split('\n').map((line) => line.replace(/^(#{2,})/g, (hashes) => `${hashes}##`)).join('\n').replace(/^\n+|\n+$/g, ''); return { id: item.id, text: `### ${item.id} — ${title}\n${body ? `\n${body}` : ''}` }; });
    const functional = chunks.filter((item) => item.id.startsWith('FR-')).map((item) => item.text).join('\n\n'); const nonFunctional = chunks.filter((item) => item.id.startsWith('NFR-')).map((item) => item.text).join('\n\n');
    let rendered = template.replace(/(## Requisitos funcionales\n)/, `$1${functional ? `\n${functional}\n` : ''}`).replace(/(## Requisitos no funcionales\n)/, `$1${nonFunctional ? `\n${nonFunctional}\n` : ''}`);
    engine().assertInsideRoot(specsBase, target); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, rendered, 'utf8');
    for (const link of links) { engine().assertInsideRoot(specsBase, link.file); fs.writeFileSync(link.file, link.text, 'utf8'); }
    for (const item of fragments) { engine().assertInsideRoot(specsBase, item.file); fs.rmSync(item.file); }
    if (inventory.catalog) { engine().assertInsideRoot(specsBase, inventory.catalog.file); fs.rmSync(inventory.catalog.file); }
    for (const directory of ['functional', 'non-functional']) { const full = path.join(specsBase, 'requirements', directory); if (exists(full) && !fs.readdirSync(full).length) fs.rmdirSync(full); }
  });
}

module.exports = { REQUIREMENT_ID, slugify, projectSlug, parseIdList, inventoryRequirements, resolveRequirement, requirementAliases, renderSrs, scaffoldSrs, renderCatalog, writeCatalog, requirementProblems, rewriteRequirementLinks, migrateSrsSingle, migrateFragmented };
