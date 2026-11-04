'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const REPO_ROOT = path.resolve(__dirname, '..');

// Línea canónica del gateway (STORY-127, CNF-1): mismo punto de entrada y mismas transiciones en los tres documentos.
const PREFIX = '**Gateway de validación de épicas:**';
const ENTRY = '/epic-validate <EPIC-ID>';
const APPROVE = 'VALIDATE/IN-PROGRESS → VALIDATE/DONE';
const REWORK = 'VALIDATE → DEVELOP/IN-PROGRESS';

const DOCUMENTS = [
  'skills/epic-validate/SKILL.md',
  'docs/guides/sddf-commands-pipeline.md',
  'docs/architecture/state-machine.md',
];

test('SKILL.md, la guía del pipeline y state-machine.md nombran el mismo gateway de epic-validate (STORY-127 CNF-1)', () => {
  for (const document of DOCUMENTS) {
    const file = path.join(REPO_ROOT, document);
    assert.equal(fs.existsSync(file), true, `${document} no existe`);

    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/).filter((line) => line.startsWith(PREFIX));
    assert.equal(lines.length, 1, `${document}: se esperaba 1 línea canónica del gateway y hay ${lines.length}`);

    const [line] = lines;
    const positions = [ENTRY, APPROVE, REWORK].map((token) => line.indexOf(`\`${token}\``));
    assert.equal(positions.every((position) => position >= 0), true, `${document}: falta un token canónico en «${line}»`);
    assert.deepEqual([...positions].sort((a, b) => a - b), positions, `${document}: los tokens no siguen el orden canónico en «${line}»`);
  }
});
