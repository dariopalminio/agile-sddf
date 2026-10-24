'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const {
  ACTIVE_DOCS,
  LAYOUT_MARKER,
  checkSkillLayout,
  verifyFixedLayout,
} = require('../scripts/verify-fixed-layout.js');

const CANONICAL_BLOCK = [
  '### Paso 0 — Resolver contexto local',
  '',
  '<!-- SDDF-FIXED-LAYOUT: v1 -->',
  '',
  'Resuelve `REPO_ROOT` (raíz del repositorio) y usa rutas fijas relativas a él:',
  'work items en `specs/flow/`, templates en `docs/templates/` y DoD en `docs/guardrails/`.',
  'El layout no es configurable (ADR-0016).',
].join('\n');

const REGION_START = '<!-- SDDF-LEGACY-DIAGNOSTIC:start -->';
const REGION_END = '<!-- SDDF-LEGACY-DIAGNOSTIC:end -->';

function conforming(...extra) {
  return ['# demo', '', CANONICAL_BLOCK, '', '## Flujo', '', ...extra, ''].join('\n');
}

function legacy() {
  return ['# legacy', '', '<!-- SDDF-ROOT-RESOLUTION: v1 -->', '', 'Lee `SPECS_BASE/specs/stories/`.', ''].join('\n');
}

function preflight(...extra) {
  return conforming(
    'Es un diagnóstico explícito del entorno.',
    REGION_START,
    'Informa `SDDF_ROOT` y `SPECS_BASE` del layout legado.',
    REGION_END,
    ...extra,
  );
}

function lineOf(content, text) {
  return content.split('\n').findIndex((line) => line.includes(text)) + 1;
}

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agile-sddf-layout-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true, maxRetries: 3 }));
  return root;
}

function write(root, relative, content) {
  const target = path.join(root, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function tree(t, skills) {
  const root = fixture(t);
  write(root, '.env.template', '# SDDF_ROOT ya no se usa\n');
  for (const doc of ACTIVE_DOCS) write(root, doc, '# doc\n');
  write(root, 'skills/skill-preflight/SKILL.md', preflight());
  for (const [name, content] of Object.entries(skills)) write(root, `skills/${name}/SKILL.md`, content);
  return root;
}

test('Conforme: el bloque canónico del contrato de layout fijo no produce errores', () => {
  assert.equal(conforming().includes(LAYOUT_MARKER), true);
  assert.deepEqual(checkSkillLayout('demo', conforming()), []);
});

test('Bloque legado: cada referencia legada nombra el skill, la línea y el token', () => {
  const content = legacy();
  const errors = checkSkillLayout('legacy', content);
  const markerLine = lineOf(content, 'SDDF-ROOT-RESOLUTION');
  const specsLine = lineOf(content, 'SPECS_BASE');
  assert.ok(errors.includes(`skills/legacy/SKILL.md:${markerLine}: referencia legada \`SDDF-ROOT-RESOLUTION: v1\``), errors.join('\n'));
  assert.ok(errors.includes(`skills/legacy/SKILL.md:${specsLine}: referencia legada \`SPECS_BASE\``), errors.join('\n'));
});

test('Sin marcador: R1 exige el contrato de layout fijo', () => {
  const errors = checkSkillLayout('demo', '# demo\n\nUsa `REPO_ROOT`.\n');
  assert.deepEqual(errors, [`skills/demo/SKILL.md: falta el contrato de layout fijo (${LAYOUT_MARKER})`]);
});

test('Bloque incompleto: R2 nombra el token que falta con la línea del marcador', () => {
  const content = conforming().replace(' y DoD en `docs/guardrails/`', '');
  const errors = checkSkillLayout('demo', content);
  assert.deepEqual(errors, [
    `skills/demo/SKILL.md:${lineOf(content, LAYOUT_MARKER)}: el bloque del contrato no declara \`docs/guardrails/\``,
  ]);
});

test('Bloque incompleto: un token fuera del bloque no cuenta para R2', () => {
  const content = conforming('Las guías DoD viven en `docs/guardrails/`.').replace(' y DoD en `docs/guardrails/`', '');
  const errors = checkSkillLayout('demo', content);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /no declara `docs\/guardrails\/`/);
});

test('Lectura de root: R4 reporta la línea que lee la clave legada de sddf.config.yaml', () => {
  const content = conforming('Lee `root` de `sddf.config.yaml`.');
  const errors = checkSkillLayout('demo', content);
  assert.deepEqual(errors, [
    `skills/demo/SKILL.md:${lineOf(content, 'Lee `root`')}: lee la clave legada \`root\` de sddf.config.yaml`,
  ]);
});

test('Excepción de skill-preflight: la región de diagnóstico no se reporta', () => {
  assert.deepEqual(checkSkillLayout('skill-preflight', preflight()), []);
});

test('Fuera de la región: skill-preflight reporta R3 con línea', () => {
  const content = preflight('Usa `SDDF_ROOT` para resolver la raíz.');
  const errors = checkSkillLayout('skill-preflight', content);
  assert.deepEqual(errors, [
    `skills/skill-preflight/SKILL.md:${lineOf(content, 'para resolver la raíz')}: referencia legada \`SDDF_ROOT\``,
  ]);
});

test('Región en otro skill: se rechaza y sus líneas se evalúan', () => {
  const content = preflight();
  const errors = checkSkillLayout('demo', content);
  assert.ok(errors.includes(
    `skills/demo/SKILL.md:${lineOf(content, REGION_START)}: la región SDDF-LEGACY-DIAGNOSTIC solo se admite en skill-preflight`,
  ), errors.join('\n'));
  const inner = lineOf(content, 'del layout legado');
  assert.ok(errors.includes(`skills/demo/SKILL.md:${inner}: referencia legada \`SDDF_ROOT\``), errors.join('\n'));
  assert.ok(errors.includes(`skills/demo/SKILL.md:${inner}: referencia legada \`SPECS_BASE\``), errors.join('\n'));
});

test('Región sin cerrar: se reporta y no exime ninguna línea', () => {
  const content = conforming(REGION_START, 'Informa `SDDF_ROOT`.');
  const errors = checkSkillLayout('skill-preflight', content);
  assert.deepEqual(errors, [
    `skills/skill-preflight/SKILL.md:${lineOf(content, REGION_START)}: región SDDF-LEGACY-DIAGNOSTIC sin cerrar`,
    `skills/skill-preflight/SKILL.md:${lineOf(content, 'Informa')}: referencia legada \`SDDF_ROOT\``,
  ]);
});

test('Región sin abrir: se reporta el cierre huérfano', () => {
  const content = conforming(REGION_END);
  const errors = checkSkillLayout('skill-preflight', content);
  assert.deepEqual(errors, [
    `skills/skill-preflight/SKILL.md:${lineOf(content, REGION_END)}: región SDDF-LEGACY-DIAGNOSTIC sin abrir`,
  ]);
});

test('verifyFixedLayout: un árbol conforme sin pendientes pasa sin errores', (t) => {
  const root = tree(t, { demo: conforming() });
  const result = verifyFixedLayout({ repoRoot: root, pending: [] });
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.skills, ['demo', 'skill-preflight']);
  assert.deepEqual(result.pending, []);
  assert.deepEqual(result.warnings, []);
});

test('Lista transitoria: un skill legado pendiente no falla y se avisa', (t) => {
  const root = tree(t, { legacy: legacy() });
  const result = verifyFixedLayout({ repoRoot: root, pending: ['legacy'] });
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.pending, ['legacy']);
  assert.deepEqual(result.warnings, ['1 skill(s) pendientes de migración al layout fijo (EPIC-26): legacy']);
});

test('Entrada obsoleta: un skill conforme en la lista hace fallar el gate', (t) => {
  const root = tree(t, { demo: conforming() });
  const result = verifyFixedLayout({ repoRoot: root, pending: ['demo'] });
  assert.deepEqual(result.errors, ['PENDING_MIGRATION: demo ya cumple el contrato — retíralo de la lista']);
});

test('Entrada inexistente: un nombre ausente de skills/ hace fallar el gate', (t) => {
  const root = tree(t, {});
  const result = verifyFixedLayout({ repoRoot: root, pending: ['fantasma'] });
  assert.deepEqual(result.errors, ['PENDING_MIGRATION: fantasma no existe en skills/ — retíralo de la lista']);
});

test('Skill legado fuera de la lista: el gate falla con skill y línea', (t) => {
  const root = tree(t, { legacy: legacy() });
  const result = verifyFixedLayout({ repoRoot: root, pending: [] });
  assert.ok(result.errors.length > 0);
  assert.ok(result.errors.some((error) => error.startsWith('skills/legacy/SKILL.md:5: referencia legada `SPECS_BASE`')), result.errors.join('\n'));
});

test('Chequeos heredados: preflight automático y SDDF_ROOT asignado siguen fallando', (t) => {
  const root = tree(t, { demo: conforming('Ejecuta `/skill-preflight` antes de empezar.') });
  write(root, '.env.template', 'SDDF_ROOT=docs\n');
  const result = verifyFixedLayout({ repoRoot: root, pending: [] });
  assert.ok(result.errors.some((error) => error.startsWith('skills/demo/SKILL.md: conserva una dependencia automática de skill-preflight')), result.errors.join('\n'));
  assert.ok(result.errors.some((error) => error.startsWith('.env.template:')), result.errors.join('\n'));
});

test('Determinismo: el entorno no altera el resultado', (t) => {
  const root = tree(t, { demo: conforming(), legacy: legacy() });
  const previous = process.env.SDDF_ROOT;
  t.after(() => {
    if (previous === undefined) delete process.env.SDDF_ROOT;
    else process.env.SDDF_ROOT = previous;
  });
  process.env.SDDF_ROOT = 'docs';
  const first = verifyFixedLayout({ repoRoot: root, pending: ['legacy'] });
  process.env.SDDF_ROOT = path.join(root, 'otra-raiz');
  const second = verifyFixedLayout({ repoRoot: root, pending: ['legacy'] });
  assert.deepEqual(first, second);
});
