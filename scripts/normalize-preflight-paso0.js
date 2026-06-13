#!/usr/bin/env node
/**
 * Normaliza el bloque "Paso 0 — Verificar entorno (skill-preflight)" en todos los SKILL.md.
 * Reemplaza cualquier variante verbosa por el texto canónico mínimo de 3 líneas.
 *
 * Uso: node scripts/normalize-preflight-paso0.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');

const CANONICAL = `### Paso 0 — Verificar entorno (\`skill-preflight\`)

Invocar \`skill-preflight\`. Si retorna \`✗ Entorno inválido\`, detener la ejecución. Usar \`$SPECS_BASE\` en todas las rutas siguientes.
`;

const SKILLS_DIR = path.join(__dirname, '..', '.claude', 'skills');
const EXCLUDE_SKILL = 'skill-preflight';

function findSkillMdFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const skillFile = path.join(dir, entry.name, 'SKILL.md');
    if (fs.existsSync(skillFile)) {
      results.push({ name: entry.name, file: skillFile });
    }
  }
  return results;
}

function extractPaso0Block(content) {
  const HEADER = '### Paso 0 — Verificar entorno';
  const start = content.indexOf(HEADER);
  if (start === -1) return null;

  // Find end: next line that starts with ## or ### (after the header line itself)
  const afterHeader = start + HEADER.length;
  const nextSection = content.search(new RegExp(/\n(?:##|###) /, 'g').source.replace('g', ''), afterHeader);
  const searchFrom = afterHeader;

  // We need to search for the next heading after the start of our block
  let end = content.length;
  const lines = content.split('\n');
  let inBlock = false;
  let blockStartLine = -1;
  let blockEndLine = lines.length;

  for (let i = 0; i < lines.length; i++) {
    if (!inBlock && lines[i].startsWith(HEADER.split('\n')[0])) {
      blockStartLine = i;
      inBlock = true;
      continue;
    }
    if (inBlock && i > blockStartLine) {
      if ((lines[i].startsWith('## ') || lines[i].startsWith('### ')) && !lines[i].startsWith(HEADER.split('\n')[0])) {
        blockEndLine = i;
        break;
      }
    }
  }

  if (blockStartLine === -1) return null;

  const blockLines = lines.slice(blockStartLine, blockEndLine);
  // Trim trailing empty lines from block, keep one trailing newline
  while (blockLines.length > 0 && blockLines[blockLines.length - 1].trim() === '') {
    blockLines.pop();
  }

  return {
    blockText: blockLines.join('\n') + '\n',
    blockStartLine,
    blockEndLine,
  };
}

function normalizeFile(skillName, filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const result = extractPaso0Block(content);

  if (!result) return { status: 'skip', reason: 'no Paso 0 found' };

  const { blockText, blockStartLine, blockEndLine } = result;

  // Compare ignoring trailing whitespace variations
  const normalizeWS = s => s.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  if (normalizeWS(blockText) === normalizeWS(CANONICAL)) {
    return { status: 'ok', reason: 'already canonical' };
  }

  if (DRY_RUN) {
    return { status: 'would-update', reason: 'content differs' };
  }

  // Replace block in content
  const lines = content.split('\n');
  const before = lines.slice(0, blockStartLine).join('\n');
  const after = lines.slice(blockEndLine).join('\n');

  // Ensure single blank line before the next section
  const newContent = (before ? before + '\n' : '') + CANONICAL + (after ? '\n' + after : '');

  fs.writeFileSync(filePath, newContent, 'utf8');
  return { status: 'updated', reason: 'replaced with canonical text' };
}

function main() {
  if (!fs.existsSync(SKILLS_DIR)) {
    console.error(`[ERROR] Skills directory not found: ${SKILLS_DIR}`);
    process.exit(1);
  }

  const skills = findSkillMdFiles(SKILLS_DIR).filter(s => s.name !== EXCLUDE_SKILL);

  let updated = 0, alreadyOk = 0, skipped = 0, errors = 0;

  for (const { name, file } of skills) {
    try {
      const result = normalizeFile(name, file);
      const rel = path.relative(process.cwd(), file).replace(/\\/g, '/');
      if (result.status === 'updated' || result.status === 'would-update') {
        console.log(`[${DRY_RUN ? 'WOULD-UPDATE' : 'UPDATED'}] ${rel}`);
        updated++;
      } else if (result.status === 'ok') {
        alreadyOk++;
      } else {
        skipped++;
      }
    } catch (err) {
      console.error(`[ERROR] ${name}: ${err.message}`);
      errors++;
    }
  }

  console.log('');
  console.log(`── Resumen ${DRY_RUN ? '(dry-run) ' : ''}──────────────────────────`);
  console.log(`  ${DRY_RUN ? 'Actualizarían' : 'Actualizados'}: ${updated}`);
  console.log(`  Ya canónicos:  ${alreadyOk}`);
  console.log(`  Sin Paso 0:    ${skipped}`);
  if (errors) console.log(`  Errores:       ${errors}`);
  console.log(`──────────────────────────────────────────`);

  if (errors) process.exit(1);
}

main();
