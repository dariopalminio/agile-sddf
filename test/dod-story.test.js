'use strict';

/**
 * Tests de STORY-101: DoD de historia dividido en un guardrail por etapa.
 * Cubre los casos UT, IT y E2E trazables de `testcases.md` sobre el módulo
 * `skills/memory-system/scripts/dod-story.js` y su integración en el motor `memory-system.js`
 * (subcomando `migrate --from dod-monolithic` y familia `dod-guardrail` de `check`).
 * Los fixtures viven en `skills/memory-system/examples/dod-*`; los casos que escriben trabajan
 * sobre una copia temporal.
 */

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const REPO_ROOT = path.resolve(__dirname, '..');
const SKILL_DIR = path.join(REPO_ROOT, 'skills', 'memory-system');
const ENGINE = path.join(SKILL_DIR, 'scripts', 'memory-system.js');
const EXAMPLES = path.join(SKILL_DIR, 'examples');
const MONOLITH = path.join(EXAMPLES, 'dod-monolithic', 'docs', 'guardrails', 'dod-story-checklist.md');
const CUSTOM = path.join(EXAMPLES, 'dod-custom', 'docs', 'guardrails', 'dod-story-checklist.md');

const dod = require(path.join(SKILL_DIR, 'scripts', 'dod-story.js'));
const engine = require(ENGINE);

const STAGE_SLUGS = ['specify', 'plan', 'implement', 'code-review', 'verify', 'acceptance', 'deliver'].map((s) => `dod-story-${s}`);
const DATE = '2026-09-24';

function run(args) {
  return spawnSync(process.execPath, [ENGINE, ...args], { cwd: REPO_ROOT, encoding: 'utf8' });
}

function tempDir(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dod-story-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true, maxRetries: 3 }));
  return dir;
}

function copyFixture(t, name) {
  const dir = tempDir(t);
  fs.cpSync(path.join(EXAMPLES, name), dir, { recursive: true });
  return dir;
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function frontmatterOf(content) {
  return engine.parseFrontmatter(content).data;
}

function bodyLines(content) {
  return engine.parseFrontmatter(content).body.replace(/^\n+|\n+$/g, '').split('\n');
}

const criteria = (text) => text.split(/\r?\n/).filter((line) => /^\s*- \[[ x]\]/.test(line)).map((line) => line.trim());

function planOf(source = fs.readFileSync(MONOLITH, 'utf8'), existing = new Set(), options = {}) {
  return dod.planDodMigration(source, existing, { date: DATE, ...options });
}

const entryOf = (plan, slug) => plan.entries.find((entry) => entry.slug === slug);

function guardrail(fields, body = '# DoD\n\n- [ ] criterio\n') {
  const lines = Object.entries(fields).map(([key, value]) => `${key}: ${value}`);
  return `---\n${lines.join('\n')}\n---\n\n${body}`;
}

// Árbol mínimo con los siete DoD migrados, válidos, bajo `<repo>/docs/guardrails/`.
function saneDodRepo(t) {
  const repo = tempDir(t);
  const docs = path.join(repo, 'docs');
  write(path.join(docs, 'guardrails', 'dod-story-checklist.md'), fs.readFileSync(MONOLITH, 'utf8'));
  const result = dod.migrateDod(docs, { date: DATE });
  assert.equal(result.exitCode, 0, result.lines.join('\n'));
  return { repo, docs };
}

function evaluate(docs, extra = {}) {
  const repoRoot = path.dirname(docs);
  const nodes = engine.scanNodes(docs, 'sddf');
  const configFile = path.join(repoRoot, 'sddf.config.yaml');
  const dodMapping = fs.existsSync(configFile) ? dod.readDodMapping(fs.readFileSync(configFile, 'utf8')) : new Map();
  return dod.dodGuardrails({ root: docs, repoRoot, nodes, skillsDir: null, dodMapping, ...extra });
}

const details = (problems) => problems.map((p) => `${p.path} — ${p.detail}`);

// ---------------------------------------------------------------------------
// UT-001…UT-004 — DOD_STAGES
// ---------------------------------------------------------------------------

test('UT-001 DOD_STAGES contiene las siete etapas en orden canónico', () => {
  assert.deepEqual(dod.DOD_STAGES.map((s) => s.stage), ['specify', 'plan', 'implement', 'code-review', 'verify', 'acceptance', 'deliver']);
  assert.ok(Object.isFrozen(dod.DOD_STAGES));
});

test('UT-002 cada DoD protege <ETAPA>/IN-PROGRESS → <ETAPA>/DONE y CODE-REVIEW precede a VERIFY', () => {
  const chain = dod.DOD_STAGES.filter((s) => s.kind === 'transition');
  assert.deepEqual(chain.map((s) => s.status), ['SPECIFY', 'PLAN', 'IMPLEMENT', 'CODE-REVIEW', 'VERIFY', 'ACCEPTANCE']);
  for (const stage of chain) {
    assert.equal(stage.from, `${stage.status}/IN-PROGRESS`, stage.stage);
    assert.equal(stage.to, `${stage.status}/DONE`, stage.stage);
  }
  const byStage = Object.fromEntries(chain.map((s) => [s.stage, s]));
  assert.equal(byStage['code-review'].to, 'CODE-REVIEW/DONE');
  assert.equal(byStage.verify.from, 'VERIFY/IN-PROGRESS');
});

test('UT-003 la entrada deliver es un guardrail de contenido sin from/to ni skills', () => {
  const deliver = dod.DOD_STAGES.find((s) => s.stage === 'deliver');
  assert.equal(deliver.kind, 'content');
  assert.equal(deliver.appliesTo, 'deliver');
  assert.equal(deliver.from, null);
  assert.equal(deliver.to, null);
  assert.deepEqual(deliver.skills, []);
});

test('UT-004 enforcement warn solo en specify', () => {
  for (const stage of dod.DOD_STAGES) assert.equal(stage.enforcement, stage.stage === 'specify' ? 'warn' : 'error', stage.stage);
});

// ---------------------------------------------------------------------------
// UT-005…UT-018 — planDodMigration
// ---------------------------------------------------------------------------

test('UT-005 el planificador produce siete destinos create y el reemplazo del índice', () => {
  const plan = planOf();
  assert.deepEqual(plan.entries.filter((e) => e.action === 'create').map((e) => e.slug), STAGE_SLUGS);
  assert.deepEqual(plan.entries.filter((e) => e.action === 'replace-index').map((e) => e.target), ['guardrails/dod-story-checklist.md']);
  assert.deepEqual(plan.unmigrated, []);
  assert.equal(plan.alreadyIndex, false);
});

test('UT-006 frontmatter de un destino de transición (verify)', () => {
  const data = frontmatterOf(entryOf(planOf(), 'dod-story-verify').content);
  assert.equal(data.type, 'guardrail');
  assert.equal(data.kind, 'transition');
  assert.equal(data.enforcement, 'error');
  assert.equal(data.from, 'VERIFY/IN-PROGRESS');
  assert.equal(data.to, 'VERIFY/DONE');
  assert.equal(data['applies-to'], 'story');
  assert.equal(data.slug, 'dod-story-verify');
  assert.equal(data.created, DATE);
  assert.ok(data.title.includes('VERIFY'));
});

test('UT-007 frontmatter del destino de deliver', () => {
  const data = frontmatterOf(entryOf(planOf(), 'dod-story-deliver').content);
  assert.equal(data.kind, 'content');
  assert.equal(data['applies-to'], 'deliver');
  assert.equal(data.from, undefined);
  assert.equal(data.to, undefined);
});

test('UT-008 cada criterio del origen aparece en exactamente un destino', () => {
  const source = fs.readFileSync(MONOLITH, 'utf8');
  const plan = planOf(source);
  const migrated = STAGE_SLUGS.flatMap((slug) => criteria(entryOf(plan, slug).content));
  const normalize = (line) => line.replace(/\[\[[^\]]+\]\]/g, '§').replace(/(?:el |la )?\[[^\]]*\]\([^)]*\)/g, '§').replace(/Definition of Done para el estado \S+ es satisfactorio/, 'Se cumple §');
  // Comparación como multiconjunto: el origen repite a propósito "El build de CI pasa…" en
  // IMPLEMENT y en deliver, así que la unicidad global no aplica; sí que no se gane ni pierda nada.
  assert.equal(migrated.length, criteria(source).length);
  assert.deepEqual(migrated.map(normalize).sort(), criteria(source).map(normalize).sort());
});

test('UT-009 los criterios de despliegue solo aparecen en dod-story-deliver', () => {
  const plan = planOf();
  assert.ok(entryOf(plan, 'dod-story-deliver').content.includes('npm pack --dry-run'));
  for (const slug of STAGE_SLUGS.filter((s) => s !== 'dod-story-deliver')) {
    const content = entryOf(plan, slug).content;
    assert.ok(!content.includes('npm pack --dry-run'), slug);
    assert.ok(!content.includes('SemVer'), slug);
  }
});

test('UT-010 enlaces a guardrails gr-*.md se convierten en wikilinks', () => {
  const content = entryOf(planOf(), 'dod-story-implement').content;
  assert.ok(content.includes('- [ ] Se cumple [[gr-ai-security-checklist]]'));
  assert.ok(content.includes('- [ ] Se cumple [[gr-code-security-checklist]]'));
  assert.ok(content.includes('- [ ] Se cumple [[gr-skill-creation-checklist]]'));
  assert.ok(!/\]\([^)]*gr-[a-z-]+\.md\)/.test(content));
});

test('UT-011 la referencia a otra etapa se convierte en wikilink', () => {
  const content = entryOf(planOf(), 'dod-story-code-review').content;
  assert.ok(content.includes('- [ ] Se cumple [[dod-story-implement]]'));
  assert.ok(!content.includes('Definition of Done para el estado'));
});

test('UT-012 introducción, comentarios y notas placeholder se descartan sin error', () => {
  const plan = planOf();
  for (const slug of STAGE_SLUGS) {
    const content = entryOf(plan, slug).content;
    assert.ok(!content.includes('<!--'), slug);
    assert.ok(!content.includes('[Por completar]'), slug);
    assert.ok(!content.includes('Story Definition of Done'), slug);
  }
  assert.deepEqual(plan.unmigrated, []);
});

test('UT-013 monolítico personalizado: sección ausente y bloque desconocido', () => {
  const plan = planOf(fs.readFileSync(CUSTOM, 'utf8'));
  assert.equal(entryOf(plan, 'dod-story-specify').action, 'no-source');
  assert.deepEqual(plan.unmigrated, ['Criterios de rendimiento']);
  assert.ok(!plan.entries.some((e) => e.action === 'replace-index'));
});

test('UT-014 destino existente sin force se preserva', () => {
  assert.equal(entryOf(planOf(undefined, new Set(['dod-story-plan'])), 'dod-story-plan').action, 'preserve');
});

test('UT-015 destino existente con force se sobrescribe', () => {
  assert.equal(entryOf(planOf(undefined, new Set(['dod-story-plan']), { force: true }), 'dod-story-plan').action, 'overwrite');
});

test('UT-016 origen que ya es índice deprecado', () => {
  const index = dod.renderDodIndex({ date: DATE });
  const existing = new Set(STAGE_SLUGS.filter((s) => s !== 'dod-story-verify'));
  const plan = planOf(index, existing);
  assert.equal(plan.alreadyIndex, true);
  assert.equal(entryOf(plan, 'dod-story-verify').action, 'no-source');
  assert.equal(plan.entries.filter((e) => e.action === 'preserve').length, 6);
  assert.ok(!plan.entries.some((e) => e.action === 'create' || e.action === 'replace-index'));
});

test('UT-017 contenido del índice deprecado', () => {
  const index = dod.renderDodIndex({ date: DATE });
  const data = frontmatterOf(index);
  assert.equal(data.type, 'guardrail');
  assert.equal(data.kind, 'index');
  assert.equal(data.status, 'deprecated');
  assert.equal(data.slug, 'dod-story-checklist');
  assert.deepEqual(data['superseded-by'], STAGE_SLUGS);
  assert.equal(data.removal, '4.0.0');
  for (const slug of STAGE_SLUGS) assert.ok(index.includes(`[[${slug}]]`), slug);
  assert.ok(index.includes('/memory-system migrate --from=dod-monolithic'));
});

test('UT-018 CNF-01: el cuerpo de cada destino tiene ≤ 40 líneas', () => {
  const plan = planOf();
  for (const slug of STAGE_SLUGS) {
    const lines = bodyLines(entryOf(plan, slug).content);
    assert.ok(lines.length <= 40, `${slug}: ${lines.length} líneas`);
  }
});

test('UT-018b los placeholders de fecha del origen se conservan (plantillas)', () => {
  const source = fs.readFileSync(MONOLITH, 'utf8');
  assert.ok(source.includes('created: <YYYY-MM-DD>'), 'el fixture usa placeholders');
  const plan = dod.planDodMigration(source, new Set(), { date: DATE, keepDatePlaceholders: true });
  assert.equal(frontmatterOf(entryOf(plan, 'dod-story-plan').content).created, '<YYYY-MM-DD>');
});

// Copia de la antigua plantilla monolítica de project-policies-generation: el formato que tienen hoy
// los DoD de los proyectos consumidores que deben poder migrar.
const TEMPLATE = path.join(EXAMPLES, 'dod-template', 'docs', 'guardrails', 'dod-story-checklist.md');

test('UT-018c formato de plantilla de consumidor: etapas H2 con subgrupos H3', () => {
  const source = fs.readFileSync(TEMPLATE, 'utf8');
  const plan = planOf(source);
  const created = plan.entries.filter((e) => e.action === 'create').map((e) => e.slug);
  assert.deepEqual(created, STAGE_SLUGS.filter((s) => s !== 'dod-story-deliver'));
  assert.deepEqual(plan.unmigrated, [], 'DELIVER, COMPLETED y notas vacíos no bloquean');
  const implement = entryOf(plan, 'dod-story-implement').content;
  assert.match(implement, /^## 💻 Criterios de Código$/m, 'los subgrupos H3 se conservan como H2');
  assert.equal(criteria(implement).length, criteria(source.slice(source.indexOf('## 🛠️ IMPLEMENT'), source.indexOf('## 🔍 CODE-REVIEW'))).length);
});

test('UT-018d deliver es opcional: su ausencia se omite sin error', () => {
  const source = fs.readFileSync(MONOLITH, 'utf8');
  const withoutDeliver = source.slice(0, source.indexOf('## 🚀 Criterios de Despliegue')) + source.slice(source.indexOf('## 📎 Notas adicionales'));
  const plan = planOf(withoutDeliver);
  assert.equal(entryOf(plan, 'dod-story-deliver').action, 'skip');
  assert.ok(plan.entries.some((e) => e.action === 'replace-index'));
});

test('UT-018e etapas duplicadas bloquean la migración y preservan todos los criterios', (t) => {
  const docs = path.join(tempDir(t), 'docs');
  const source = [
    '---',
    'created: 2026-01-01',
    'updated: 2026-01-01',
    '---',
    '',
    '# DoD',
    '',
    '### SPECIFY',
    '- [ ] Criterio de especificación',
    '',
    '### PLAN',
    '- [ ] Criterio de planificación',
    '',
    '### IMPLEMENT',
    '- [ ] Primer criterio de implementación',
    '',
    '### IMPLEMENT',
    '- [ ] Segundo criterio de implementación',
    '',
    '### CODE-REVIEW',
    '- [ ] Criterio de revisión',
    '',
    '### VERIFY',
    '- [ ] Criterio de verificación',
    '',
    '### ACCEPTANCE',
    '- [ ] Criterio de acceptance',
    '',
  ].join('\n');
  const monolith = path.join(docs, 'guardrails', 'dod-story-checklist.md');
  write(monolith, source);

  const plan = planOf(source);
  assert.ok(!plan.entries.some((entry) => entry.action === 'replace-index'), 'una etapa duplicada no puede reemplazar el monolítico');
  assert.equal(entryOf(plan, 'dod-story-implement').action, 'duplicate', 'la etapa ambigua no recibe un destino parcial');
  assert.equal(entryOf(planOf(source, new Set(['dod-story-implement']), { force: true }), 'dod-story-implement').action, 'duplicate', '--force no puede ocultar la ambigüedad');

  const result = dod.migrateDod(docs, { date: DATE });
  assert.equal(result.exitCode, 1, result.lines.join('\n'));
  assert.match(result.lines.join('\n'), /\[DUPLICADO\] guardrails\/dod-story-implement\.md/);
  assert.ok(!fs.existsSync(path.join(docs, 'guardrails', 'dod-story-implement.md')), 'la migración incompleta no escribe el destino ambiguo');
  assert.equal(fs.readFileSync(monolith, 'utf8'), source, 'el origen conserva ambos conjuntos de criterios mientras la migración está incompleta');
});

// ---------------------------------------------------------------------------
// UT-019…UT-020 — readDodMapping
// ---------------------------------------------------------------------------

const CONFIG = [
  '# comentario',
  'root: docs',
  'guardrails:',
  '  dod:',
  '    story:',
  '      specify: dod-story-specify     # comentario final',
  '      plan: "dod-story-plan"',
  "      implement: 'dod-story-implement'",
  '      code-review: dod-story-code-review',
  '      verify: dod-story-verify',
  '      acceptance: dod-story-acceptance',
  '      deliver: dod-story-deliver',
  'verify:',
  '  unit:',
  '    command: "npm test"',
  '',
].join('\n');

test('UT-019 readDodMapping: sección completa y ausente', () => {
  const mapping = dod.readDodMapping(CONFIG);
  assert.equal(mapping.size, 7);
  assert.equal(mapping.get('specify'), 'dod-story-specify');
  assert.equal(mapping.get('plan'), 'dod-story-plan');
  assert.equal(mapping.get('implement'), 'dod-story-implement');
  assert.equal(dod.readDodMapping('root: docs\nverify:\n  unit:\n    command: x\n').size, 0);
  assert.equal(dod.readDodMapping(CONFIG.replace(/\n/g, '\r\n')).size, 7);
});

test('UT-020 readDodMapping conserva claves desconocidas', () => {
  const mapping = dod.readDodMapping('guardrails:\n  dod:\n    story:\n      deploy: x\n');
  assert.equal(mapping.get('deploy'), 'x');
});

// ---------------------------------------------------------------------------
// UT-021…UT-024 — dodGuardrails (R1–R7)
// ---------------------------------------------------------------------------

test('UT-021 R1–R3: frontmatter de los DoD', (t) => {
  const { docs } = saneDodRepo(t);
  const g = (slug) => path.join(docs, 'guardrails', `${slug}.md`);
  write(g('dod-story-plan'), fs.readFileSync(g('dod-story-plan'), 'utf8').replace(/^from: .*\n/m, ''));
  write(g('dod-story-implement'), fs.readFileSync(g('dod-story-implement'), 'utf8').replace('enforcement: error', 'enforcement: strict'));
  write(g('dod-story-verify'), fs.readFileSync(g('dod-story-verify'), 'utf8').replace('slug: dod-story-verify', 'slug: dod-story-verificar'));
  write(g('dod-story-deliver'), fs.readFileSync(g('dod-story-deliver'), 'utf8').replace('applies-to: deliver', 'applies-to: story'));
  const found = details(evaluate(docs));
  assert.ok(found.includes('guardrails/dod-story-plan.md — falta from'), found.join('\n'));
  assert.ok(found.includes('guardrails/dod-story-implement.md — enforcement: strict — se esperaba error o warn'), found.join('\n'));
  assert.ok(found.includes('guardrails/dod-story-verify.md — slug: dod-story-verificar — debe coincidir con el nombre del archivo'), found.join('\n'));
  assert.ok(found.includes('guardrails/dod-story-deliver.md — applies-to: story — se esperaba deliver'), found.join('\n'));
  assert.ok(evaluate(docs).every((p) => p.kind === 'dod-guardrail'));
});

test('UT-022 R2: el DoD declara una transición distinta de la de su etapa', (t) => {
  const { docs } = saneDodRepo(t);
  const file = path.join(docs, 'guardrails', 'dod-story-verify.md');
  write(file, fs.readFileSync(file, 'utf8').replace('from: VERIFY/IN-PROGRESS', 'from: CODE-REVIEW/IN-PROGRESS'));
  assert.deepEqual(details(evaluate(docs)), ['guardrails/dod-story-verify.md — from: CODE-REVIEW/IN-PROGRESS — se esperaba VERIFY/IN-PROGRESS']);
});

test('UT-023 R4–R7: mapeo, monolítico y skills', (t) => {
  const { repo, docs } = saneDodRepo(t);
  write(path.join(repo, 'sddf.config.yaml'), 'guardrails:\n  dod:\n    story:\n      implement: dod-story-impl\n      deploy: dod-story-deploy\n');
  write(path.join(docs, 'guardrails', 'dod-story-checklist.md'), fs.readFileSync(MONOLITH, 'utf8'));
  const skills = path.join(repo, 'skills');
  write(path.join(skills, 'story-verify', 'SKILL.md'), '# story-verify\n\nSin sección.\n');
  write(path.join(skills, 'story-plan', 'SKILL.md'), '# story-plan\n\n## DoD aplicable\n\n- Etapa: `plan` — `dod-story-plan`\n');
  write(path.join(skills, 'otro', 'SKILL.md'), '# otro\n\nLee docs/guardrails/dod-story-checklist.md\n');
  write(path.join(skills, 'memory-system', 'SKILL.md'), '# memory-system\n\nMigra dod-story-checklist.md\n');
  const found = details(evaluate(docs, { skillsDir: skills }));
  assert.ok(found.includes('../sddf.config.yaml — implement: dod-story-impl — archivo inexistente'), found.join('\n'));
  assert.ok(found.includes('../sddf.config.yaml — deploy: etapa desconocida'), found.join('\n'));
  assert.ok(found.includes('guardrails/dod-story-checklist.md — DoD monolítico sin migrar → /memory-system migrate --from=dod-monolithic'), found.join('\n'));
  assert.ok(found.includes('../skills/story-verify/SKILL.md — falta la sección DoD aplicable (dod-story-verify)'), found.join('\n'));
  assert.ok(found.includes('../skills/otro/SKILL.md — referencia al DoD monolítico'), found.join('\n'));
  assert.ok(!found.some((line) => line.startsWith('../skills/story-plan/')), 'story-plan cumple');
  assert.ok(!found.some((line) => line.startsWith('../skills/memory-system/')), 'memory-system es el migrador');
});

test('UT-024 aplicabilidad: raíz sin DoD y skillsDir nulo', (t) => {
  const repo = tempDir(t);
  const docs = path.join(repo, 'docs');
  write(path.join(docs, 'guides', 'intro.md'), '---\ntype: guide\nslug: intro\ntitle: "Intro"\n---\n# Intro\n');
  const skills = path.join(repo, 'skills');
  write(path.join(skills, 'story-verify', 'SKILL.md'), '# story-verify\n');
  assert.deepEqual(evaluate(docs, { skillsDir: skills }), []);

  const { docs: sane, repo: saneRepo } = saneDodRepo(t);
  write(path.join(saneRepo, 'skills', 'story-verify', 'SKILL.md'), '# story-verify\n');
  assert.deepEqual(evaluate(sane), [], 'sin skillsDir no se evalúan R6/R7');
});

// ---------------------------------------------------------------------------
// IT-001…IT-009 — integración con el motor
// ---------------------------------------------------------------------------

test('IT-001 parseArgs del motor admite y valida migrate', () => {
  assert.throws(() => engine.parseArgs(['migrate', '--root', 'docs']), /--from/);
  assert.throws(() => engine.parseArgs(['migrate', '--root', 'docs', '--from', 'otro']), /no admitido/);
  const args = engine.parseArgs(['migrate', '--root', 'docs', '--from', 'dod-monolithic', '--dry-run', '--force']);
  assert.equal(args.from, 'dod-monolithic');
  assert.equal(engine.parseArgs(['check', '--root', 'docs', '--skills-dir', 'skills']).skillsDir, 'skills');
  const result = run(['migrate', '--root', 'docs', '--from', 'otro']);
  assert.equal(result.status, 2);
});

test('IT-002 primera migración de extremo a extremo', (t) => {
  const docs = path.join(copyFixture(t, 'dod-monolithic'), 'docs');
  const result = run(['migrate', '--root', docs, '--from', 'dod-monolithic', '--date', DATE]);
  assert.equal(result.status, 0, result.stderr);
  for (const slug of STAGE_SLUGS) assert.match(result.stdout, new RegExp(`\\[CREADO\\]\\s+guardrails/${slug}\\.md`));
  assert.match(result.stdout, /\[REEMPLAZADO\]\s+guardrails\/dod-story-checklist\.md — índice deprecado/);
  assert.match(result.stdout, /creados: 7 · sobrescritos: 0 · preservados: 0 · reemplazados: 1/);
  for (const slug of STAGE_SLUGS) {
    const bytes = fs.readFileSync(path.join(docs, 'guardrails', `${slug}.md`));
    assert.notDeepEqual([...bytes.subarray(0, 3)], [0xef, 0xbb, 0xbf], `${slug} sin BOM`);
  }
  assert.equal(frontmatterOf(fs.readFileSync(path.join(docs, 'guardrails', 'dod-story-checklist.md'), 'utf8')).status, 'deprecated');
});

test('IT-003 re-ejecución idempotente y --dry-run', (t) => {
  const docs = path.join(copyFixture(t, 'dod-monolithic'), 'docs');
  run(['migrate', '--root', docs, '--from', 'dod-monolithic', '--date', DATE]);
  const snapshot = Object.fromEntries(fs.readdirSync(path.join(docs, 'guardrails')).map((f) => [f, fs.readFileSync(path.join(docs, 'guardrails', f), 'utf8')]));
  const second = run(['migrate', '--root', docs, '--from', 'dod-monolithic', '--date', '2030-01-01']);
  assert.equal(second.status, 0, second.stderr);
  assert.equal((second.stdout.match(/\[PRESERVADO\]/g) || []).length, 7);
  assert.match(second.stdout, /creados: 0 · sobrescritos: 0 · preservados: 7 · reemplazados: 0/);
  const dry = run(['migrate', '--root', docs, '--from', 'dod-monolithic', '--dry-run']);
  assert.equal(dry.status, 0, dry.stderr);
  assert.match(dry.stdout, /cambios pendientes: 0/);
  for (const [file, content] of Object.entries(snapshot)) assert.equal(fs.readFileSync(path.join(docs, 'guardrails', file), 'utf8'), content, file);
});

test('IT-004 sin --force no se pisa un destino editado', (t) => {
  const docs = path.join(copyFixture(t, 'dod-monolithic'), 'docs');
  const plan = path.join(docs, 'guardrails', 'dod-story-plan.md');
  write(plan, '---\ntype: guardrail\nslug: dod-story-plan\ntitle: "editado"\n---\n# editado\n');
  const result = run(['migrate', '--root', docs, '--from', 'dod-monolithic']);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /\[PRESERVADO\]\s+guardrails\/dod-story-plan\.md/);
  assert.ok(fs.readFileSync(plan, 'utf8').includes('# editado'));
  const forced = run(['migrate', '--root', docs, '--from', 'dod-monolithic', '--force']);
  assert.equal(forced.status, 0, forced.stderr);
  assert.match(forced.stdout, /\[PRESERVADO\]\s+guardrails\/dod-story-plan\.md/, 'el origen ya es índice: no hay contenido con que sobrescribir');
});

test('IT-005 origen heredado policies/dod-story.md', (t) => {
  const docs = path.join(copyFixture(t, 'dod-legacy'), 'docs');
  const legacy = path.join(docs, 'policies', 'dod-story.md');
  const before = fs.readFileSync(legacy, 'utf8');
  const result = run(['migrate', '--root', docs, '--from', 'dod-monolithic', '--date', DATE]);
  assert.equal(result.status, 0, result.stderr);
  for (const slug of STAGE_SLUGS) assert.ok(fs.existsSync(path.join(docs, 'guardrails', `${slug}.md`)), slug);
  assert.equal(frontmatterOf(fs.readFileSync(path.join(docs, 'guardrails', 'dod-story-checklist.md'), 'utf8')).status, 'deprecated');
  // La épica prohíbe que un modo elimine archivos: el heredado se conserva y se avisa (analyze INC-001).
  assert.equal(fs.readFileSync(legacy, 'utf8'), before);
  assert.match(result.stdout, /policies\/dod-story\.md/);
});

test('IT-006 monolítico personalizado bloquea el reemplazo', (t) => {
  const docs = path.join(copyFixture(t, 'dod-custom'), 'docs');
  const monolith = path.join(docs, 'guardrails', 'dod-story-checklist.md');
  const before = fs.readFileSync(monolith, 'utf8');
  const result = run(['migrate', '--root', docs, '--from', 'dod-monolithic']);
  assert.equal(result.status, 1, result.stderr);
  assert.match(result.stdout, /\[SIN ORIGEN\]\s+guardrails\/dod-story-specify\.md — sección SPECIFY no encontrada/);
  assert.match(result.stdout, /\[NO MIGRADO\]\s+Criterios de rendimiento/);
  assert.equal(fs.readFileSync(monolith, 'utf8'), before);
});

test('IT-007 check integra la familia dod-guardrail', (t) => {
  const { docs } = saneDodRepo(t);
  const clean = run(['check', '--root', docs, '--json']);
  const parsed = JSON.parse(clean.stdout);
  assert.deepEqual(Object.keys(parsed.summary), ['missing-layer', 'orphan', 'invalid-frontmatter', 'broken-wikilink', 'dod-guardrail']);
  assert.equal(parsed.summary['dod-guardrail'], 0);
  const file = path.join(docs, 'guardrails', 'dod-story-verify.md');
  write(file, fs.readFileSync(file, 'utf8').replace('to: VERIFY/DONE', 'to: VERIFY'));
  const broken = run(['check', '--root', docs, '--json']);
  assert.equal(broken.status, 1);
  assert.equal(JSON.parse(broken.stdout).summary['dod-guardrail'], 1);
  assert.ok(engine.CHECK_KINDS.includes('dod-guardrail'));
});

test('IT-008 resolución de skillsDir en check', (t) => {
  const { repo, docs } = saneDodRepo(t);
  const text = (args) => run(['check', '--root', docs, ...args]).stdout;
  assert.match(text([]), /skills: —/);
  write(path.join(repo, '.claude', 'skills', 'story-verify', 'SKILL.md'), '# sin sección\n');
  assert.match(text(['--cli-root', path.join(repo, '.claude')]), /falta la sección DoD aplicable \(dod-story-verify\)/);
  write(path.join(repo, 'skills', 'story-acceptance', 'SKILL.md'), '# sin sección\n');
  const auto = text([]);
  assert.match(auto, /\.\.\/skills\/story-acceptance\/SKILL\.md/);
  assert.doesNotMatch(auto, /story-verify/, '<REPO_ROOT>/skills tiene precedencia sobre --cli-root');
  const explicit = path.join(repo, 'otros');
  write(path.join(explicit, 'story-code-review', 'SKILL.md'), '# sin sección\n');
  assert.match(text(['--skills-dir', explicit]), /story-code-review/);
});

test('IT-009 override de consumidor por config', (t) => {
  const { repo, docs } = saneDodRepo(t);
  const g = (slug) => path.join(docs, 'guardrails', `${slug}.md`);
  write(g('dod-story-implement-acme'), fs.readFileSync(g('dod-story-implement'), 'utf8').replace('slug: dod-story-implement', 'slug: dod-story-implement-acme'));
  fs.rmSync(g('dod-story-implement'));
  write(path.join(repo, 'sddf.config.yaml'), 'guardrails:\n  dod:\n    story:\n      implement: dod-story-implement-acme\n');
  assert.deepEqual(evaluate(docs), []);
  write(g('dod-story-implement-acme'), fs.readFileSync(g('dod-story-implement-acme'), 'utf8').replace('to: IMPLEMENT/DONE', 'to: PLAN/DONE'));
  assert.deepEqual(details(evaluate(docs)), ['guardrails/dod-story-implement-acme.md — to: PLAN/DONE — se esperaba IMPLEMENT/DONE']);
});

test('E2E-002 los nueve skills del pipeline declaran solo el DoD de su etapa', () => {
  const expected = new Map([
    ['story-specify', 'dod-story-specify'],
    ['story-plan', 'dod-story-plan'],
    ['story-design', 'dod-story-plan'],
    ['story-analyze', 'dod-story-plan'],
    ['story-implement', 'dod-story-implement'],
    ['story-implement-tasks', 'dod-story-implement'],
    ['story-code-review', 'dod-story-code-review'],
    ['story-verify', 'dod-story-verify'],
    ['story-acceptance', 'dod-story-acceptance'],
  ]);

  for (const [skill, slug] of expected) {
    const file = path.join(REPO_ROOT, 'skills', skill, 'SKILL.md');
    const text = fs.readFileSync(file, 'utf8');
    assert.match(text, /^## DoD aplicable$/m, `${skill}: falta la sección DoD aplicable`);

    const dodHeading = /^## DoD aplicable\r?$/m.exec(text);
    assert.ok(dodHeading, `${skill}: falta el encabezado DoD aplicable`);
    const sectionStart = dodHeading.index;
    const nextSection = text.indexOf('\n## ', sectionStart + dodHeading[0].length);
    const dodSection = text.slice(sectionStart, nextSection === -1 ? text.length : nextSection);
    const expectedPath = `$SPECS_BASE/guardrails/${slug}.md`;
    const referencedSlugs = [...dodSection.matchAll(/\$SPECS_BASE\/guardrails\/(dod-story-[a-z-]+)\.md/g)].map((match) => match[1]);

    assert.ok(dodSection.includes(expectedPath), `${skill}: debe referenciar ${expectedPath}`);
    assert.ok(referencedSlugs.length > 0 && referencedSlugs.every((referenced) => referenced === slug), `${skill}: debe cargar solo ${slug}`);
    assert.doesNotMatch(text, /dod-story-checklist\b/, `${skill}: no debe referenciar el DoD monolítico`);
  }
});
