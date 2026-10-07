'use strict';

/**
 * Tests de STORY-103: template de épica v2 (minimalista, output-oriented) y migración
 * `memory-system migrate --from epic-template-v1`.
 * Cubre UT-001…UT-022 e IT-001 de `testcases.md`: contrato del template (central == seed, ≤ 40
 * líneas, 5 secciones con `clave:`), `readTemplateContract`, reglas R1–R11 de `planEpicMigration`
 * sobre las fixtures de `skills/memory-system/examples/epic-template-v1/` (cada `epic.md` junto a
 * su oráculo `expected.md`), idempotencia, `migrateEpics` (dry-run, exit codes, descubrimiento,
 * template central sin claves) y el despacho del motor. Los casos que escriben usan una copia temporal.
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
const FIXTURES = path.join(SKILL_DIR, 'examples', 'epic-template-v1');
const EPICS = path.join(FIXTURES, 'docs', 'specs', '02-epics');
const CENTRAL = path.join(REPO_ROOT, 'docs', 'templates', 'epic-template.md');
const SEED = path.join(REPO_ROOT, 'skills', 'epic-creation', 'assets', 'epic-template.md');
const CUSTOM_TEMPLATE = path.join(FIXTURES, 'templates', 'epic-template-custom.md');
const KEYLESS_TEMPLATE = path.join(FIXTURES, 'templates', 'epic-template-sin-claves.md');

const engine = require(ENGINE);
const epicTemplate = require(path.join(SKILL_DIR, 'scripts', 'epic-template.js'));

const V2_HEADINGS = ['Alcance', 'Historias', 'Criterios de salida', 'Smoke tests', 'Notas'];
const V2_CLAVES = ['alcance', 'historias', 'criterios-salida', 'smoke-tests', 'notas'];
const REMOVED_SECTIONS = [
  'Descripción', 'Requerimiento', 'Impacto en Procesos Claves', 'Dependencias Críticas',
  'Riesgos', 'Criterios de éxito', 'Notas adicionales', 'Flujos Críticos',
];
const FIXTURE_NAMES = ['EPIC-01-v1-completa', 'EPIC-02-v1-minima', 'EPIC-03-sin-secciones', 'EPIC-04-situacionales', 'EPIC-05-revisar'];

const read = (file) => fs.readFileSync(file, 'utf8').replace(/\r\n?/g, '\n');
const fixture = (name, file = 'epic.md') => read(path.join(EPICS, name, file));
const v2Contract = () => epicTemplate.readTemplateContract(read(CENTRAL));
const customContract = () => epicTemplate.readTemplateContract(read(CUSTOM_TEMPLATE));

function run(args) {
  return spawnSync(process.execPath, [ENGINE, ...args], { cwd: REPO_ROOT, encoding: 'utf8' });
}

function tempDir(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'epic-template-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true, maxRetries: 3 }));
  return dir;
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

// Raíz temporal `<tmp>/docs` con las fixtures indicadas (solo su `epic.md`) bajo `specs/<level>/`.
function docsWith(t, names, level = '02-epics') {
  const docs = path.join(tempDir(t), 'docs');
  for (const name of names) write(path.join(docs, 'specs', level, name, 'epic.md'), fixture(name));
  return docs;
}

const epicOf = (docs, name, level = '02-epics') => read(path.join(docs, 'specs', level, name, 'epic.md'));
const lineOf = (text, needle) => text.split('\n').findIndex((line) => line.includes(needle)) + 1;
const frontmatter = (text) => text.match(/^---\n[\s\S]*?\n---\n/)[0];
const h2Titles = (text) => text.split('\n').filter((line) => line.startsWith('## ')).map((line) => line.slice(3));

// ---------------------------------------------------------------------------
// Template v2 (UT-001…UT-004, T028)
// ---------------------------------------------------------------------------

test('UT-001: el template de épica tiene como máximo 40 líneas', () => {
  const lines = read(CENTRAL).replace(/\n$/, '').split('\n');
  assert.ok(lines.length <= 40, `el template tiene ${lines.length} líneas`);
});

test('UT-002: el template central y el seed de epic-creation son idénticos byte a byte', () => {
  assert.ok(fs.readFileSync(CENTRAL).equals(fs.readFileSync(SEED)), 'docs/templates/epic-template.md difiere del seed');
});

test('UT-003: exactamente 5 secciones obligatorias en orden, con claves únicas y sin opcionales', () => {
  const text = read(CENTRAL);
  const headings = text.split('\n').filter((line) => line.startsWith('## '));
  assert.equal(headings.length, 5, headings.join('\n'));
  for (const heading of headings) assert.ok(heading.includes('<!-- sección obligatoria'), heading);
  assert.ok(!text.includes('<!-- sección opcional'));
  const contract = v2Contract();
  assert.deepEqual(contract.map((entry) => entry.heading), V2_HEADINGS);
  assert.deepEqual(contract.map((entry) => entry.clave), V2_CLAVES);
  assert.ok(contract.every((entry) => entry.obligatoria));
  for (const removed of REMOVED_SECTIONS) {
    assert.ok(!headings.some((heading) => heading.slice(3).startsWith(removed)), `sección eliminada presente: ${removed}`);
    assert.ok(!text.includes(`**${removed}`), `párrafo eliminado presente: ${removed}`);
  }
});

test('UT-003b: guías de AC-2…AC-6 presentes y ejemplo de Historias en F1', () => {
  const text = read(CENTRAL);
  const block = (heading) => {
    const start = text.indexOf(`## ${heading}`);
    const rest = text.slice(start + 3);
    const next = rest.search(/^## /m);
    return next < 0 ? rest : rest.slice(0, next);
  };
  assert.ok(text.indexOf('## Alcance') < text.indexOf('## Historias'), 'Alcance debe ser la primera sección');
  assert.match(block('Alcance'), /Output-oriented/);
  assert.match(block('Alcance'), /product\/vision\.md/);
  assert.match(block('Alcance'), /requirements\//);
  const historias = block('Historias');
  assert.ok(historias.includes('- [Nombre]: [desc]'), 'falta el formato planificada (F1)');
  assert.ok(historias.includes('- [ ] **STORY-NNN** — [Nombre]: [desc]'), 'falta el formato creada (F2)');
  assert.ok(historias.includes('- [x] **STORY-NNN** — [Nombre]: [desc]'), 'falta el formato completada (F3)');
  const examples = historias.split('\n').filter((line) => line.startsWith('- '));
  assert.ok(examples.length >= 1);
  for (const line of examples) assert.match(line, /^- (?!\[[ x]\] )(?!\*\*STORY-)[^\n]+: /, `el ejemplo no es F1: ${line}`);
  assert.match(block('Criterios de salida'), /técnicos verificables/);
  assert.match(block('Criterios de salida'), /No son criterios de éxito de negocio/);
  const smoke = block('Smoke tests');
  assert.match(smoke, /^### SMOKE-1 — /m);
  assert.match(smoke, /```gherkin\nEscenario: .+\n {2}Dado .+\n {2}Cuando .+\n {2}Entonces .+\n```/);
  assert.match(smoke, /no renumerar/);
  assert.match(smoke, /numeración es opcional/);
  const headings = text.split('\n').filter((line) => line.startsWith('## '));
  assert.ok(headings[headings.length - 1].startsWith('## Notas'), 'Notas debe ser la última sección');
  assert.match(block('Notas'), /Opcional/);
});

test('UT-003c: frontmatter mínimo con status DEFINE y sin campos retirados', () => {
  const fm = frontmatter(read(CENTRAL));
  for (const key of ['type', 'id', 'slug', 'title', 'status', 'substatus', 'parent', 'created', 'updated']) {
    assert.match(fm, new RegExp(`^${key}:`, 'm'), `falta ${key}`);
  }
  assert.match(fm, /^status: DEFINE\b/m);
  assert.match(fm, /^substatus: IN-PROGRESS\b/m);
  assert.match(fm, /^parent: null\b/m);
  for (const key of ['implements', 'deliveryModel', 'children', 'alwaysApply']) assert.doesNotMatch(fm, new RegExp(`^${key}:`, 'm'), `campo retirado: ${key}`);
  assert.ok(!fm.includes('<ESTADO_INICIAL>'));
});

test('UT-004: IDs y slugs con guion ASCII; el raya U+2014 solo separa **STORY-NNN** del nombre', () => {
  const sources = [read(CENTRAL), ...FIXTURE_NAMES.map((name) => fixture(name, 'expected.md'))];
  for (const text of sources) {
    assert.doesNotMatch(text, /(?:EPIC|STORY|SMOKE)[‐-―−]/, 'ID con guion no ASCII');
    for (const match of text.matchAll(/\*\*STORY-[^*]*\*\*(.?.?.?)/g)) {
      assert.match(match[0], /^\*\*STORY-(?:\d{3,}|NNN)\*\* — $/, `separador inválido: ${match[0]}`);
    }
  }
});

// ---------------------------------------------------------------------------
// readTemplateContract (UT-020, UT-021)
// ---------------------------------------------------------------------------

test('UT-020: readTemplateContract devuelve las 5 entradas en el orden del template', () => {
  assert.deepEqual(v2Contract(), V2_HEADINGS.map((heading, i) => ({ heading, clave: V2_CLAVES[i], obligatoria: true })));
  const custom = customContract();
  assert.deepEqual(custom.map((entry) => entry.heading), ['Objetivo técnico', 'Features', 'Bitácora', 'Pruebas de humo', 'Definición de terminado']);
  assert.deepEqual(custom.map((entry) => entry.clave), ['alcance', 'historias', 'notas', 'smoke-tests', 'criterios-salida']);
});

test('UT-021: clave duplicada lanza UsageError que la nombra; template sin claves devuelve clave null', () => {
  const duplicated = `${read(CENTRAL)}\n## Features <!-- sección obligatoria · clave: historias -->\n`;
  assert.throws(() => epicTemplate.readTemplateContract(duplicated), (error) => error instanceof engine.UsageError && /clave historias duplicada/.test(error.message));
  const keyless = epicTemplate.readTemplateContract(read(KEYLESS_TEMPLATE));
  assert.ok(keyless.length > 0);
  assert.ok(keyless.every((entry) => entry.clave === null));
  assert.deepEqual(keyless.filter((entry) => entry.obligatoria).map((entry) => entry.heading), ['Descripción', 'Historias', 'Flujos Críticos / Smoke Tests']);
});

// ---------------------------------------------------------------------------
// planEpicMigration (UT-005…UT-014, UT-022)
// ---------------------------------------------------------------------------

for (const name of FIXTURE_NAMES) {
  test(`UT-005…UT-012: ${name} migra a su expected.md contra el template v2`, () => {
    const plan = epicTemplate.planEpicMigration(fixture(name), v2Contract());
    assert.equal(plan.content, fixture(name, 'expected.md'));
    assert.equal(plan.changed, true);
  });
}

test('UT-005: R1/R3/R5 llevan Descripción, Criterios de éxito y Notas adicionales a sus claves', () => {
  const { content } = epicTemplate.planEpicMigration(fixture('EPIC-01-v1-completa'), v2Contract());
  assert.ok(!/^## (Descripción|Notas adicionales|Flujos Críticos)/m.test(content));
  assert.ok(!content.includes('**Criterios de éxito:**'));
  assert.match(content, /## Alcance\nPermitir a los clientes/);
  assert.match(content, /## Criterios de salida\n- \[ \] El 99 %/);
  assert.match(content, /## Notas\nLa pasarela se elige/);
  assert.ok(!content.includes('<!-- sección'), 'R11: los marcadores del template no se copian');
});

test('UT-006: R7 convierte las líneas de Historias a F1/F2/F3 conservando el checkbox', () => {
  const epic = [
    '---', 'type: epic', '---', '', '# Épica: X', '', '## Historias',
    '- [ ] STORY-101 - **Uno:** primera',
    '- [x] **STORY-102 — Dos:** segunda',
    '- [x] **STORY-103 - Tres:** tercera',
    '- [ ] STORY-104 — Cuatro: cuarta',
    '- [x] **STORY-105 — Cinco**: quinta',
    '- [ ] STORY-106 - **Seis**: sexta',
    '- [ ] **Siete:** séptima',
    '- [ ] **Ocho**: octava',
    '- [x] **STORY-109** — Nueve: ya en F3',
    '- Diez: ya en F1',
    '  - [x] sub-ítem indentado',
    '',
  ].join('\n');
  const { content, findings } = epicTemplate.planEpicMigration(epic, v2Contract());
  assert.deepEqual(findings, []);
  const historias = content.slice(content.indexOf('## Historias'), content.indexOf('## Criterios de salida'));
  assert.deepEqual(historias.trim().split('\n').slice(1), [
    '- [ ] **STORY-101** — Uno: primera',
    '- [x] **STORY-102** — Dos: segunda',
    '- [x] **STORY-103** — Tres: tercera',
    '- [ ] **STORY-104** — Cuatro: cuarta',
    '- [x] **STORY-105** — Cinco: quinta',
    '- [ ] **STORY-106** — Seis: sexta',
    '- Siete: séptima',
    '- Ocho: octava',
    '- [x] **STORY-109** — Nueve: ya en F3',
    '- Diez: ya en F1',
    '  - [x] sub-ítem indentado',
  ]);
});

test('UT-007: R7 conserva verbatim una historia completada sin ID y emite completada-sin-id', () => {
  const input = fixture('EPIC-05-revisar');
  const { content, findings } = epicTemplate.planEpicMigration(input, v2Contract());
  assert.ok(content.includes('- [x] **Integrar escáner**: auditoría de seguridad en CI\n'));
  assert.ok(findings.some((f) => f.reason === 'completada-sin-id' && f.line === lineOf(input, '**Integrar escáner**')), JSON.stringify(findings));
  assert.ok(findings.some((f) => f.reason === 'historia-irreconocible' && f.line === lineOf(input, 'STORY-081 es')), JSON.stringify(findings));
});

test('UT-008: R2/R4 convierten Escenario N + DADO/CUANDO/ENTONCES/Y en SMOKE-N gherkin conservando el párrafo', () => {
  const { content, findings } = epicTemplate.planEpicMigration(fixture('EPIC-01-v1-completa'), v2Contract());
  assert.deepEqual(findings, []);
  assert.match(content, /## Smoke tests\n\*Si alguno de estos falla/);
  assert.ok(content.includes('### SMOKE-2 — Pago rechazado\n```gherkin\nEscenario: Pago rechazado\n  Dado un pedido pendiente de pago\n  Cuando el cliente paga con una tarjeta rechazada\n  Entonces el pedido sigue pendiente\n  Y se muestra el motivo del rechazo\n```\n'));
  assert.ok(!content.includes('**DADO**'));
});

test('UT-009: R4 conserva verbatim un smoke test no gherkin bajo SMOKE-N y emite smoke-sin-gherkin', () => {
  const input = fixture('EPIC-05-revisar');
  const { content, findings } = epicTemplate.planEpicMigration(input, v2Contract());
  assert.ok(content.includes('### SMOKE-1 — Instalación limpia\n- DADO un proyecto vacío\n  - CUANDO se instala el framework\n'));
  assert.ok(findings.some((f) => f.reason === 'smoke-sin-gherkin' && f.line === lineOf(input, '### Escenario 1')), JSON.stringify(findings));
});

test('UT-010: R6 mueve las secciones situacionales a Notas como ### y elimina las vacías', () => {
  const { content } = epicTemplate.planEpicMigration(fixture('EPIC-04-situacionales'), v2Contract());
  const notas = content.slice(content.indexOf('## Notas'));
  assert.match(notas, /^### Objetivo$/m);
  assert.match(notas, /^### Requerimiento: exportación$/m);
  assert.match(notas, /^#### Formato$/m);
  assert.ok(!content.includes('Riesgos'), 'la sección Riesgos vacía debe eliminarse');
  assert.ok(!/^## (Objetivo|Requerimiento)/m.test(content));
});

test('UT-011: R8/R9 insertan las obligatorias ausentes con su placeholder en el orden del template', () => {
  const { content } = epicTemplate.planEpicMigration(fixture('EPIC-02-v1-minima'), v2Contract());
  assert.deepEqual(h2Titles(content), V2_HEADINGS);
  assert.match(content, /## Criterios de salida\n- \[ \] \[Por completar\]/);
  assert.match(content, /### SMOKE-1 — \[Por completar\]\n```gherkin\n/);
  assert.match(content, /## Notas\n$/);
});

test('UT-012: R10 conserva el preámbulo de una épica sin ## y añade las 5 secciones', () => {
  const input = fixture('EPIC-03-sin-secciones');
  const { content } = epicTemplate.planEpicMigration(input, v2Contract());
  assert.ok(content.startsWith(input.trimEnd()), 'el preámbulo debe conservarse');
  assert.deepEqual(h2Titles(content), V2_HEADINGS);
});

test('UT-013: la migración no modifica el frontmatter (ni deliveryModel ni updated)', () => {
  for (const name of FIXTURE_NAMES) {
    const input = fixture(name);
    assert.equal(frontmatter(epicTemplate.planEpicMigration(input, v2Contract()).content), frontmatter(input), name);
  }
});

test('UT-014: la migración es un punto fijo y una épica que ya cumple no cambia', () => {
  const contract = v2Contract();
  for (const name of FIXTURE_NAMES) {
    const once = epicTemplate.planEpicMigration(fixture(name), contract);
    const twice = epicTemplate.planEpicMigration(once.content, contract);
    assert.equal(twice.content, once.content, name);
    assert.equal(twice.changed, false, name);
    const compliant = epicTemplate.planEpicMigration(fixture(name, 'expected.md'), contract);
    assert.equal(compliant.changed, false, name);
    assert.equal(compliant.content, fixture(name, 'expected.md'), name);
  }
  const custom = customContract();
  const once = epicTemplate.planEpicMigration(fixture('EPIC-01-v1-completa'), custom);
  assert.equal(epicTemplate.planEpicMigration(once.content, custom).changed, false);
});

test('UT-022: la migración hacia un template personalizado usa sus títulos y su orden', () => {
  const plan = epicTemplate.planEpicMigration(fixture('EPIC-01-v1-completa'), customContract());
  assert.equal(plan.content, fixture('EPIC-01-v1-completa', 'expected-custom.md'));
});

// ---------------------------------------------------------------------------
// migrateEpics (UT-015, UT-016, UT-018, UT-019)
// ---------------------------------------------------------------------------

test('UT-015: migrateEpics en --dry-run no escribe y reporta [MIGRARÍA] y cambios pendientes', (t) => {
  const docs = docsWith(t, FIXTURE_NAMES);
  const before = FIXTURE_NAMES.map((name) => epicOf(docs, name));
  const result = epicTemplate.migrateEpics(docs, { dryRun: true, displayRoot: 'docs' });
  assert.deepEqual(FIXTURE_NAMES.map((name) => epicOf(docs, name)), before);
  assert.equal(result.lines[0], '── memory-system migrate ── from: epic-template-v1 · root: docs');
  assert.ok(result.lines.includes('[MIGRARÍA] specs/02-epics/EPIC-01-v1-completa/epic.md'), result.lines.join('\n'));
  assert.ok(result.lines.includes('cambios pendientes: 5'), result.lines.join('\n'));
  assert.ok(!result.lines.some((line) => line.startsWith('[MIGRADO]')));
});

test('UT-016: exit 1 con [REVISAR] <ruta>:<línea> — <motivo>; exit 0 sin hallazgos', (t) => {
  const withReview = docsWith(t, ['EPIC-05-revisar']);
  const review = epicTemplate.migrateEpics(withReview, {});
  assert.equal(review.exitCode, 1);
  const line = lineOf(fixture('EPIC-05-revisar'), '**Integrar escáner**');
  assert.ok(review.lines.some((l) => l.startsWith(`[REVISAR] specs/02-epics/EPIC-05-revisar/epic.md:${line} — completada-sin-id`)), review.lines.join('\n'));
  assert.ok(review.lines.some((l) => /^\[REVISAR\] .*:\d+ — smoke-sin-gherkin/.test(l)));
  assert.equal(epicOf(withReview, 'EPIC-05-revisar'), fixture('EPIC-05-revisar', 'expected.md'), 'los hallazgos no bloquean la escritura');
  assert.equal(review.summary.review, 3);

  const clean = docsWith(t, ['EPIC-01-v1-completa']);
  const first = epicTemplate.migrateEpics(clean, {});
  assert.equal(first.exitCode, 0, first.lines.join('\n'));
  assert.ok(first.lines.some((l) => l.startsWith('[MIGRADO] specs/02-epics/EPIC-01-v1-completa/epic.md')));
  assert.ok(first.lines.includes('migrados: 1 · sin cambios: 0 · a revisar: 0'), first.lines.join('\n'));
  assert.equal(epicOf(clean, 'EPIC-01-v1-completa'), fixture('EPIC-01-v1-completa', 'expected.md'));
  const second = epicTemplate.migrateEpics(clean, {});
  assert.ok(second.lines.includes('[SIN CAMBIOS] specs/02-epics/EPIC-01-v1-completa/epic.md'), second.lines.join('\n'));
  assert.ok(second.lines.includes('migrados: 0 · sin cambios: 1 · a revisar: 0'));
  assert.equal(second.exitCode, 0);
});

test('UT-018: migrateEpics descubre solo specs/*/EPIC-*/epic.md (02-epics y epics)', (t) => {
  const docs = docsWith(t, ['EPIC-02-v1-minima'], 'epics');
  write(path.join(docs, 'specs', '02-epics', 'EPIC-09-otra', 'epic.md'), fixture('EPIC-04-situacionales'));
  write(path.join(docs, 'specs', '03-stories', 'STORY-001-x', 'epic.md'), fixture('EPIC-01-v1-completa'));
  write(path.join(docs, 'specs', 'epics', 'NOTAS', 'epic.md'), fixture('EPIC-01-v1-completa'));
  write(path.join(docs, 'templates', 'EPIC-01', 'epic.md'), fixture('EPIC-01-v1-completa'));
  const result = epicTemplate.migrateEpics(docs, { dryRun: true });
  const files = result.lines.filter((line) => line.startsWith('[MIGRARÍA]')).map((line) => line.split(' ')[1]);
  assert.deepEqual(files, ['specs/02-epics/EPIC-09-otra/epic.md', 'specs/epics/EPIC-02-v1-minima/epic.md']);
});

test('UT-019: un template central sin claves se reporta, no se modifica y se usa el seed como contrato', (t) => {
  const docs = docsWith(t, ['EPIC-02-v1-minima']);
  const central = path.join(docs, 'templates', 'epic-template.md');
  write(central, read(KEYLESS_TEMPLATE));
  const result = epicTemplate.migrateEpics(docs, {});
  assert.ok(result.lines.some((line) => line.startsWith('[REVISAR] templates/epic-template.md — template sin claves de sección')), result.lines.join('\n'));
  assert.equal(result.exitCode, 1);
  assert.equal(read(central), read(KEYLESS_TEMPLATE));
  assert.equal(epicOf(docs, 'EPIC-02-v1-minima'), fixture('EPIC-02-v1-minima', 'expected.md'));
});

test('UT-022b: migrateEpics usa el template central personalizado como contrato de destino', (t) => {
  const docs = docsWith(t, ['EPIC-01-v1-completa']);
  write(path.join(docs, 'templates', 'epic-template.md'), read(CUSTOM_TEMPLATE));
  const result = epicTemplate.migrateEpics(docs, {});
  assert.equal(result.exitCode, 0, result.lines.join('\n'));
  assert.equal(epicOf(docs, 'EPIC-01-v1-completa'), fixture('EPIC-01-v1-completa', 'expected-custom.md'));
});

// ---------------------------------------------------------------------------
// Motor (UT-017, IT-001)
// ---------------------------------------------------------------------------

test('UT-017: parseArgs acepta --from epic-template-v1 y rechaza otro origen listando ambos', () => {
  const args = engine.parseArgs(['migrate', '--root', 'x', '--from', 'epic-template-v1']);
  assert.equal(args.from, 'epic-template-v1');
  assert.throws(() => engine.parseArgs(['migrate', '--root', 'x', '--from', 'otro']), (error) => error instanceof engine.UsageError
    && error.message.includes('dod-monolithic') && error.message.includes('epic-template-v1'));
});

test('IT-001: el motor despacha migrate --from epic-template-v1 a migrateEpics', (t) => {
  const docs = docsWith(t, ['EPIC-01-v1-completa', 'EPIC-02-v1-minima']);
  const dry = run(['migrate', '--root', docs, '--from', 'epic-template-v1', '--dry-run']);
  assert.equal(dry.status, 0, dry.stderr);
  assert.match(dry.stdout, /── memory-system migrate ── from: epic-template-v1 · root: /);
  assert.match(dry.stdout, /migrados: 0 · sin cambios: 0 · a revisar: 0\ncambios pendientes: 2/);
  const real = run(['migrate', '--root', docs, '--from', 'epic-template-v1', '--force']);
  assert.equal(real.status, 0, real.stderr);
  assert.match(real.stdout, /migrados: 2 · sin cambios: 0 · a revisar: 0/);
  assert.equal(epicOf(docs, 'EPIC-02-v1-minima'), fixture('EPIC-02-v1-minima', 'expected.md'));
  const again = run(['migrate', '--root', docs, '--from', 'epic-template-v1', '--dry-run']);
  assert.match(again.stdout, /cambios pendientes: 0/);

  const dod = run(['migrate', '--root', docs, '--from', 'dod-monolithic']);
  assert.equal(dod.status, 2);
  assert.match(dod.stderr, /nada que migrar/);
});
