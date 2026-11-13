'use strict';

/**
 * Tests de STORY-185: motor `skills/story-code-review/scripts/low-ledger.js`, que guarda las huellas
 * de los LOW de cada ronda en `code-review-lows.json` y las compara con el working tree en la ronda
 * siguiente (design.md, D-1 a D-3, I-2 a I-7), y contrato del control de ruido de LOW en `SKILL.md`,
 * la plantilla del informe y los cuatro agentes (D-4 a D-6, CNF-1). Cubre las aserciones 1 a 9 de
 * D-8. Cada caso opera sobre un directorio temporal, sin git y sin tocar el repositorio real.
 */

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const SKILL_DIR = path.join(__dirname, '..', 'skills', 'story-code-review');
const SCRIPT = path.join(SKILL_DIR, 'scripts', 'low-ledger.js');

function engine() {
  return require(SCRIPT);
}

const ORDER_RULE = 'Ordena las filas de cada tabla de hallazgos por severidad (`HIGH`, `MEDIUM`, `LOW`) y, dentro de una misma severidad, de más a menos relevante: el árbitro conserva los primeros `LOW` hasta el tope.';
const AGENTS = ['tech-lead', 'product-owner', 'integration', 'security'];

function tempDir(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sddf-low-ledger-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true, maxRetries: 3 }));
  return dir;
}

function write(root, rel, content) {
  const file = path.join(root, ...rel.split('/'));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Array.isArray(content) ? `${content.join('\n')}\n` : content);
  return file;
}

const numbered = (n) => Array.from({ length: n }, (_, i) => `const v${i + 1} = ${i + 1};`);

/** Registra `lows` sobre `root`, guarda el registro y devuelve su ruta. */
function recordTo(root, lows) {
  const { recordLedger } = engine();
  const { ledger } = recordLedger({ repoRoot: root, lows, date: '2026-11-11' });
  return write(root, 'specs/flow/STORY-900-x/code-review-lows.json', JSON.stringify(ledger));
}

function compare(root, ledgerPath, locations = []) {
  return engine().compareLedger({ repoRoot: root, ledger: ledgerPath, locations });
}

const low = (location, description = 'nombre poco descriptivo') => ({ reviewer: 'tech-lead-reviewer', location, description });

test('1 — record y compare sin cambios: unchanged con la misma ubicación (AC-2)', (t) => {
  const root = tempDir(t);
  write(root, 'src/calc.js', numbered(20));
  const ledger = recordTo(root, [low('src/calc.js:10'), low('src/calc.js:12-14', 'bloque repetido')]);
  const result = compare(root, ledger);
  assert.equal(result.ok, true);
  assert.equal(result.applied, true);
  assert.equal(result.reason, null);
  assert.equal(result.message, null);
  assert.deepEqual(result.entries.map((e) => [e.id, e.status, e.current]), [
    ['L1', 'unchanged', 'src/calc.js:10-10'],
    ['L2', 'unchanged', 'src/calc.js:12-14'],
  ]);
  assert.equal(result.entries[0].reviewer, 'tech-lead-reviewer');
  assert.equal(result.entries[1].description, 'bloque repetido');
});

test('2 — dos líneas insertadas encima: moved con current desplazado dos líneas (D-3)', (t) => {
  const root = tempDir(t);
  write(root, 'src/calc.js', numbered(20));
  const ledger = recordTo(root, [low('src/calc.js:10-11')]);
  write(root, 'src/calc.js', ['// nueva 1', '// nueva 2', ...numbered(20)]);
  const [entry] = compare(root, ledger).entries;
  assert.equal(entry.status, 'moved');
  assert.equal(entry.current, 'src/calc.js:12-13');
});

test('3 — línea editada, duplicados y reemplazo por un bloque idéntico: nunca unchanged ni moved sin una única coincidencia (D-3, invariante)', async (t) => {
  await t.test('línea registrada editada → changed', (t) => {
    const root = tempDir(t);
    write(root, 'src/calc.js', numbered(20));
    const ledger = recordTo(root, [low('src/calc.js:10')]);
    const lines = numbered(20);
    lines[9] = 'const v10 = 100;';
    write(root, 'src/calc.js', lines);
    const [entry] = compare(root, ledger).entries;
    assert.deepEqual([entry.status, entry.current], ['changed', null]);
  });

  await t.test('una línea `}` repetida en el archivo, tras insertar otra encima → changed', (t) => {
    const root = tempDir(t);
    const code = ['function a() {', '  return 1;', '}', 'function b() {', '  return 2;', '}'];
    write(root, 'src/braces.js', code);
    const ledger = recordTo(root, [low('src/braces.js:3')]);
    write(root, 'src/braces.js', ['// cabecera', ...code]);
    const [entry] = compare(root, ledger).entries;
    assert.deepEqual([entry.status, entry.current], ['changed', null]);
  });

  await t.test('bloque en la posición original y otro idéntico en otra posición → changed', (t) => {
    const root = tempDir(t);
    write(root, 'src/dup.js', numbered(10));
    const ledger = recordTo(root, [low('src/dup.js:4')]);
    write(root, 'src/dup.js', [...numbered(10), 'const v4 = 4;']);
    const [entry] = compare(root, ledger).entries;
    assert.deepEqual([entry.status, entry.current], ['changed', null]);
  });

  await t.test('bloque original reemplazado y varias copias idénticas en otras posiciones → changed', (t) => {
    const root = tempDir(t);
    write(root, 'src/dup.js', numbered(10));
    const ledger = recordTo(root, [low('src/dup.js:4')]);
    const lines = numbered(10);
    lines[3] = 'const otro = 0;';
    write(root, 'src/dup.js', [...lines, 'const v4 = 4;', 'const v4 = 4;']);
    const [entry] = compare(root, ledger).entries;
    assert.deepEqual([entry.status, entry.current], ['changed', null]);
  });

  await t.test('una única coincidencia en la posición original → unchanged; una única desplazada → moved', (t) => {
    const root = tempDir(t);
    write(root, 'src/one.js', numbered(10));
    const ledger = recordTo(root, [low('src/one.js:4')]);
    assert.equal(compare(root, ledger).entries[0].status, 'unchanged');
    write(root, 'src/one.js', numbered(10).filter((_, i) => i !== 0));
    const [entry] = compare(root, ledger).entries;
    assert.deepEqual([entry.status, entry.current], ['moved', 'src/one.js:3-3']);
  });
});

test('4 — la huella ignora CRLF y el espacio final, y respeta la sangría (D-1)', (t) => {
  const { fingerprint } = engine();
  const base = fingerprint(['  return a + b;', '}']);
  assert.match(base, /^[0-9a-f]{16}$/);
  assert.equal(fingerprint(['  return a + b;\r', '}\r']), base);
  assert.equal(fingerprint(['  return a + b;   ', '}\t']), base);
  assert.notEqual(fingerprint(['    return a + b;', '}']), base);

  const root = tempDir(t);
  write(root, 'src/ws.js', numbered(5));
  const ledger = recordTo(root, [low('src/ws.js:2-3')]);
  write(root, 'src/ws.js', `${numbered(5).map((l) => `${l}  `).join('\r\n')}\r\n`);
  assert.equal(compare(root, ledger).entries[0].status, 'unchanged');
  write(root, 'src/ws.js', numbered(5).map((l) => `  ${l}`));
  assert.equal(compare(root, ledger).entries[0].status, 'changed');
});

test('5 — archivo borrado, ruta con .. o absoluta y archivo sin línea: unknown en compare y skipped en record (D-3)', (t) => {
  const { parseLocation, recordLedger } = engine();
  assert.deepEqual(parseLocation('src/a.js:3-5'), { file: 'src/a.js', start: 3, end: 5 });
  for (const bad of ['src/a.js', '../x.js:1', '/etc/x.js:1', 'C:/x.js:1', 'src/a.js:5-3', 'src/a.js:0']) {
    assert.equal(parseLocation(bad), null, bad);
  }

  const root = tempDir(t);
  write(root, 'src/gone.js', numbered(5));
  const ledger = recordTo(root, [low('src/gone.js:2')]);
  fs.rmSync(path.join(root, 'src', 'gone.js'));
  const raw = JSON.parse(fs.readFileSync(ledger, 'utf8'));
  const hash = raw.entries[0].hash;
  raw.entries.push(
    { id: 'L2', reviewer: 'tech-lead-reviewer', location: '../fuera.js:1-1', description: 'x', hash },
    { id: 'L3', reviewer: 'tech-lead-reviewer', location: '/etc/passwd:1-1', description: 'x', hash },
    { id: 'L4', reviewer: 'tech-lead-reviewer', location: 'src/gone.js', description: 'x', hash },
  );
  fs.writeFileSync(ledger, JSON.stringify(raw));
  const result = compare(root, ledger);
  assert.deepEqual(result.entries.map((e) => [e.status, e.current]), Array(4).fill(['unknown', null]));

  write(root, 'src/ok.js', numbered(3));
  const recorded = recordLedger({
    repoRoot: root,
    lows: [low('src/ok.js:1'), low('src/gone.js:2'), low('../fuera.js:1'), low('/etc/passwd:1'), low('src/ok.js'), low('src/ok.js:9')],
    date: '2026-11-11',
  });
  assert.deepEqual(recorded.ledger.entries.map((e) => [e.id, e.location]), [['L1', 'src/ok.js:1-1']]);
  assert.deepEqual(recorded.skipped.map((s) => s.location), ['src/gone.js:2', '../fuera.js:1', '/etc/passwd:1', 'src/ok.js', 'src/ok.js:9']);
  assert.ok(recorded.skipped.every((s) => typeof s.why === 'string' && s.why.length > 0));
  assert.equal(recorded.ledger.version, 1);
  assert.equal(recorded.ledger.generated, '2026-11-11');
});

test('6 — overlaps: una ubicación dentro del rango current de una entrada la lista; una fuera, no (I-5)', (t) => {
  const root = tempDir(t);
  write(root, 'src/calc.js', numbered(20));
  write(root, 'src/other.js', numbered(20));
  const ledger = recordTo(root, [low('src/calc.js:10-11'), low('src/calc.js:15')]);
  const lines = numbered(20);
  lines[14] = 'const v15 = 0;';
  write(root, 'src/calc.js', ['// a', '// b', ...lines]);
  const result = compare(root, ledger, ['src/calc.js:13', 'src/calc.js:10', 'src/calc.js:17', 'src/other.js:12', 'sin ubicación']);
  assert.deepEqual(result.entries.map((e) => e.status), ['moved', 'changed']);
  assert.deepEqual(result.locations, [
    { location: 'src/calc.js:13', overlaps: ['L1'] },
    { location: 'src/calc.js:10', overlaps: [] },
    { location: 'src/calc.js:17', overlaps: [] },
    { location: 'src/other.js:12', overlaps: [] },
    { location: 'sin ubicación', overlaps: [] },
  ]);
});

test('7 — sin registro → no-ledger; JSON ilegible o version 2 → invalid-ledger (I-6)', (t) => {
  const root = tempDir(t);
  const missing = compare(root, path.join(root, 'code-review-lows.json'), ['src/a.js:1']);
  assert.deepEqual(missing, {
    ok: true,
    applied: false,
    reason: 'no-ledger',
    message: 'no existe code-review-lows.json de la revisión anterior',
    entries: [],
    locations: [],
  });
  for (const content of ['{ no es json', JSON.stringify({ version: 2, entries: [] }), JSON.stringify({ version: 1, entries: [{ id: 'L1' }] })]) {
    const file = write(root, 'code-review-lows.json', content);
    const result = compare(root, file, ['src/a.js:1']);
    assert.equal(result.applied, false);
    assert.equal(result.reason, 'invalid-ledger');
    assert.equal(result.message, 'code-review-lows.json ilegible o de una versión desconocida');
    assert.deepEqual([result.entries, result.locations], [[], []]);
  }
});

test('8 — CLI: exit 0 con un único objeto JSON; exit 2 ante argumentos o JSON inválidos y --out fuera de --repo-root (I-3, I-4)', (t) => {
  const root = tempDir(t);
  write(root, 'src/calc.js', numbered(12));
  const run = (args) => spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8' });
  const lowsFile = write(root, '.tmp/lows.json', JSON.stringify([low('src/calc.js:3'), low('src/nada.js:1')]));
  const out = path.join(root, 'specs', 'flow', 'STORY-900-x', 'code-review-lows.json');
  fs.mkdirSync(path.dirname(out), { recursive: true });

  const recorded = run(['record', '--repo-root', root, '--lows', lowsFile, '--out', out]);
  assert.equal(recorded.status, 0, recorded.stderr);
  const recordResult = JSON.parse(recorded.stdout);
  assert.equal(recordResult.ok, true);
  assert.equal(recordResult.written, 1);
  assert.deepEqual(recordResult.skipped.map((s) => s.location), ['src/nada.js:1']);
  assert.equal(JSON.parse(fs.readFileSync(out, 'utf8')).entries.length, 1);

  const locationsFile = write(root, '.tmp/locations.json', JSON.stringify(['src/calc.js:3']));
  const before = fs.readFileSync(out, 'utf8');
  const compared = run(['compare', '--repo-root', root, '--ledger', out, '--locations', locationsFile]);
  assert.equal(compared.status, 0, compared.stderr);
  const compareResult = JSON.parse(compared.stdout);
  assert.deepEqual(Object.keys(compareResult).sort(), ['applied', 'entries', 'locations', 'message', 'ok', 'reason']);
  assert.deepEqual(compareResult.locations, [{ location: 'src/calc.js:3', overlaps: ['L1'] }]);
  assert.equal(fs.readFileSync(out, 'utf8'), before, 'compare no escribe archivos');

  const noLedger = run(['compare', '--repo-root', root, '--ledger', path.join(root, 'nada.json'), '--locations', locationsFile]);
  assert.equal(noLedger.status, 0);
  assert.equal(JSON.parse(noLedger.stdout).reason, 'no-ledger');

  const badJson = write(root, '.tmp/bad.json', '{ roto');
  const failures = [
    ['compare', '--repo-root', root, '--ledger', out],
    ['compare', '--repo-root', root, '--ledger', out, '--locations', badJson],
    ['record', '--repo-root', root, '--lows', badJson, '--out', out],
    ['record', '--repo-root', root, '--lows', lowsFile],
    ['record', '--repo-root', root, '--lows', lowsFile, '--out', path.join(os.tmpdir(), 'fuera-de-repo.json')],
    ['record', '--repo-root', root, '--lows', lowsFile, '--out', path.join(root, '..', 'escapa.json')],
    ['desconocido', '--repo-root', root],
  ];
  for (const args of failures) {
    const result = run(args);
    assert.equal(result.status, 2, `${args.join(' ')} → ${result.status}\n${result.stdout}`);
    assert.equal(result.stdout, '');
    assert.match(result.stderr, /low-ledger:/);
  }
});

test('9 — contrato estático: SKILL.md, plantilla y agentes (D-4 a D-6, CNF-1)', () => {
  const skill = fs.readFileSync(path.join(SKILL_DIR, 'SKILL.md'), 'utf8');
  for (const needle of ['low-ledger.js', 'code-review-lows.json', '{{LOW_NOISE_STATUS}}', 'Tope de Minor', 'arrastre no comprobado', 'Control de ruido de LOW']) {
    assert.ok(skill.includes(needle), `SKILL.md debe contener «${needle}»`);
  }
  assert.match(skill, /low-ledger\.js record --repo-root <REPO_ROOT> --lows [^\n]* --out <\$STORY_DIR>\/code-review-lows\.json/);
  assert.match(skill, /#### 5c\. Registrar los LOW de esta ronda/);
  assert.match(skill, /informe anterior[^\n]*sin[^\n]*code-review-lows\.json|code-review-report\.md[^\n]*anterior[^\n]*no existe[^\n]*code-review-lows\.json/i);
  assert.ok(!skill.includes('git show'), 'SKILL.md no usa git show');
  assert.ok(!skill.includes('git diff --name-only'), 'SKILL.md no usa git diff --name-only');

  const template = fs.readFileSync(path.join(SKILL_DIR, 'assets', 'code-review-report-template.md'), 'utf8');
  const [, frontmatter, body] = template.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  assert.deepEqual(frontmatter.split('\n').filter((l) => /^[a-z-]+:/.test(l)).map((l) => l.split(':')[0]),
    ['type', 'story', 'title', 'verdict', 'date', 'max-severity', 'reviewers']);
  assert.ok(!frontmatter.includes('LOW_NOISE_STATUS'));
  assert.ok(body.includes('| Control de LOW | {{LOW_NOISE_STATUS}} |'));
  assert.ok(body.indexOf('| Control de LOW |') < body.indexOf('| Fecha |'), 'la fila va antes de Fecha');

  for (const agent of AGENTS) {
    const text = fs.readFileSync(path.join(SKILL_DIR, 'agents', `${agent}-reviewer.agent.md`), 'utf8');
    assert.equal(text.split(ORDER_RULE).length - 1, 1, `${agent}-reviewer debe contener la regla de orden una vez`);
  }
});
