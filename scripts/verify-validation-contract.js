#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.resolve(__dirname, '..');
const POLICY_PATH = 'docs/policies/validation-contract-policy.md';
const REPORT_TEMPLATES = {
  'epic-format-validation': 'skills/epic-format-validation/assets/epic-format-validation-report-template.md',
  'epic-analyze': 'skills/epic-analyze/assets/epic-analyze-report-template.md',
  'story-evaluation': 'skills/story-evaluation/assets/evaluation-output-template.md',
  'story-analyze': 'skills/story-analyze/assets/analyze-report-template.md',
  'story-code-review': 'skills/story-code-review/assets/code-review-report-template.md',
  'story-verify': 'skills/story-verify/assets/verify-report-template.md',
  'story-acceptance': 'skills/story-acceptance/assets/acceptance-report-template.md',
};
const SCAN_ROOTS = ['skills', 'docs'];
const SCAN_EXTENSIONS = new Set(['.md', '.json', '.yaml', '.yml', '.js', '.mermaid', '.puml', '.txt']);
const EXCLUSIONS = [
  /^docs\/specs\//,
  /^docs\/adr\//,
  /^docs\/product\/(?:roadmap|story-map)\.md$/,
];
const LEGACY_EXCEPTIONS = [
  {
    skill: 'story-code-review',
    pattern: /^skills\/story-code-review\/(?:agents\/[^/]+\.agent\.md|examples\/[^/]+\/(?:tech-lead|product-owner|integration|security)-report\.md)$/,
    rules: ['L-4'],
    story: 'STORY-141',
  },
  {
    skill: 'memory-system',
    pattern: /^skills\/memory-system\/examples\/dod-(?:custom|legacy|monolithic|template)\//,
    rules: ['L-4'],
    story: 'STORY-143',
  },
];

function violation(rule, file, line, detail) {
  return { rule, file, line, detail };
}

function display(item) {
  return `${item.file}:${item.line || 1}: ${item.rule} ${item.detail}`;
}

function readFailure(error) {
  return error.code || 'UTF-8 inválido o contenido binario';
}

function sectionLines(text, number) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => new RegExp(`^## ${number}\\.`).test(line));
  if (start < 0) return null;
  let end = lines.findIndex((line, index) => index > start && /^## /.test(line));
  if (end < 0) end = lines.length;
  return { lines, start, end };
}

function cells(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
}

function tokens(cell) {
  return [...cell.matchAll(/`([^`]+)`/g)].map((match) => match[1]);
}

function parsePolicyContract(policyText) {
  const skills = new Map();
  const exceptionSkills = new Set();
  const errors = [];
  const table = sectionLines(policyText, 4);
  if (!table) return { skills, exceptionSkills, errors: ['falta la sección ## 4. de la policy'] };
  const rows = table.lines.slice(table.start + 1, table.end).filter((line) => /^\s*\|/.test(line));
  if (!rows.length) return { skills, exceptionSkills, errors: ['falta la tabla de §4'] };
  const header = cells(rows[0]);
  const columns = ['Skill', 'Reporte', 'Valores permitidos'].map((label) => header.indexOf(label));
  if (columns.includes(-1)) {
    errors.push('faltan columnas Skill, Reporte o Valores permitidos en §4');
    return { skills, exceptionSkills, errors };
  }
  for (const line of rows.slice(1)) {
    if (/^\s*\|?\s*:?-{3}/.test(line)) continue;
    const row = cells(line);
    const skill = tokens(row[columns[0]] || '')[0];
    const report = tokens(row[columns[1]] || '')[0];
    const values = tokens(row[columns[2]] || '');
    if (!skill || !report || !values.length) {
      errors.push(`fila incompleta en §4: ${line.trim()}`);
      continue;
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(skill) || !/^[a-z0-9][a-z0-9._-]*\.md$/.test(report)) {
      errors.push(`skill o reporte inválido en §4: ${line.trim()}`);
      continue;
    }
    if (skills.has(skill)) errors.push(`skill duplicado en §4: ${skill}`);
    for (const value of values) {
      if (!/^[A-Z]+(?:-[A-Z]+)*$/.test(value)) errors.push(`valor no permitido en §4: ${value}`);
    }
    skills.set(skill, { report, values: new Set(values) });
  }
  if (!skills.size) errors.push('§4 no contiene skills');
  const exceptions = sectionLines(policyText, 6);
  if (exceptions) {
    for (const line of exceptions.lines.slice(exceptions.start + 1, exceptions.end)) {
      if (!/^\s*\|/.test(line)) continue;
      const first = cells(line)[0];
      const skill = tokens(first || '')[0];
      if (skill) exceptionSkills.add(skill);
    }
  }
  return { skills, exceptionSkills, errors };
}

function frontmatter(text) {
  const lines = text.split(/\r?\n/);
  if (lines[0] !== '---') return { lines, fields: [], end: -1 };
  const end = lines.indexOf('---', 1);
  if (end < 0) return { lines, fields: [], end: -1 };
  const fields = [];
  for (let index = 1; index < end; index += 1) {
    const match = lines[index].match(/^([\w-]+):\s*(.*)$/);
    if (match) fields.push({ key: match[1], value: match[2].trim(), line: index + 1 });
  }
  return { lines, fields, end };
}

function templateValueValid(value, allowedValues) {
  if (allowedValues.has(value)) return true;
  // Templates de distintos skills usan {verdict}, {veredicto} y {{VERDICT}}.
  if (/^\{\{?[A-Za-z_]+\}\}?$/.test(value)) return true;
  const enumeration = value.match(/^(?:\{([^{}]+)\}|<([^<>]+)>)$/);
  if (!enumeration) return false;
  const parts = (enumeration[1] || enumeration[2]).split('|').map((part) => part.trim());
  return parts.length > 1 && parts.every((part) => allowedValues.has(part));
}

function checkReport(text, allowedValues, mode) {
  const errors = [];
  const { lines, fields, end } = frontmatter(text);
  const verdicts = fields.filter((field) => field.key === 'verdict');
  if (end < 0 || verdicts.length !== 1) {
    errors.push(violation('G-01', '', verdicts[0]?.line || 1, 'se requiere exactamente un campo verdict en el frontmatter'));
  }
  if (verdicts.length === 1) {
    const value = verdicts[0].value;
    const valid = mode === 'report' ? allowedValues.has(value) : templateValueValid(value, allowedValues);
    if (!valid) errors.push(violation('G-03', '', verdicts[0].line, `verdict no permitido: ${value}`));
  }
  for (const field of fields) {
    if (['decision', 'review-status', 'final-status'].includes(field.key)) {
      errors.push(violation('G-04', '', field.line, `campo heredado ${field.key}`));
    }
  }

  let fenced = false;
  let title = -1;
  let firstSection = -1;
  for (let index = Math.max(end + 1, 0); index < lines.length; index += 1) {
    if (/^\s*(?:```|~~~)/.test(lines[index])) { fenced = !fenced; continue; }
    if (fenced) continue;
    if (title < 0 && /^#\s+/.test(lines[index])) { title = index; continue; }
    if (title >= 0 && /^##\s+/.test(lines[index])) { firstSection = index; break; }
  }
  if (title < 0 || firstSection < 0 || !/^## Veredicto(?:\s*<!--.*-->)?\s*$/.test(lines[firstSection])) {
    errors.push(violation('G-02', '', Math.max(firstSection, title, 0) + 1, 'la primera sección tras el título debe ser ## Veredicto'));
    return errors;
  }
  for (let index = title + 1; index < firstSection; index += 1) {
    const line = lines[index].trim();
    if (line && !/^<!--.*-->$/.test(line)) {
      errors.push(violation('G-02', '', index + 1, 'hay contenido entre el título y ## Veredicto'));
      break;
    }
  }
  let firstContent = firstSection + 1;
  while (firstContent < lines.length && (!lines[firstContent].trim() || /^<!--.*-->$/.test(lines[firstContent].trim()))) firstContent += 1;
  if (!/^\*\*Veredicto:\*\*/.test(lines[firstContent] || '')) {
    errors.push(violation('G-02', '', firstContent + 1, 'la sección debe comenzar con **Veredicto:**'));
  } else if (mode === 'report' && verdicts.length === 1) {
    const shown = tokens(lines[firstContent])[0];
    if (shown !== verdicts[0].value) errors.push(violation('G-02', '', firstContent + 1, 'el valor visible difiere del frontmatter'));
  }
  return errors;
}

function findLegacyVariants(text) {
  const matches = [];
  const patterns = [
    ['L-1', /APROBADA/g],
    ['L-2', /Aprobada/g],
    ['L-3', /review-status/g],
  ];
  text.split(/\r?\n/).forEach((line, index) => {
    for (const [rule, pattern] of patterns) {
      for (const match of line.matchAll(pattern)) matches.push({ rule, line: index + 1, excerpt: match[0] });
    }
    for (const match of line.matchAll(/approved(?![A-Za-z0-9_-])/g)) {
      const prefix = line.slice(0, match.index).replace(/[\s*]+$/, '');
      if (/[\`:=|\[{("'→]$/.test(prefix) || /\b[Ss]tatus$/.test(prefix)) {
        matches.push({ rule: 'L-4', line: index + 1, excerpt: match[0] });
      }
    }
  });
  return matches;
}

function listFiles(root, relative) {
  const absolute = path.join(root, relative);
  if (!fs.existsSync(absolute)) return [];
  const result = [];
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const next = `${relative}/${entry.name}`;
    if (entry.isDirectory()) result.push(...listFiles(root, next));
    else if (entry.isFile()) result.push(next);
  }
  return result;
}

function readText(file) {
  const bytes = fs.readFileSync(file);
  const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  if (text.includes('\0')) throw new Error('contiene bytes NUL');
  return text;
}

function isExcludedLine(file, text, line) {
  if (file === POLICY_PATH) {
    const five = sectionLines(text, 5);
    const six = sectionLines(text, 6);
    if ([five, six].some((part) => part && line > part.start + 1 && line <= part.end)) return true;
  }
  if (file === 'CHANGELOG.md') {
    const lines = text.split(/\r?\n/);
    let published = false;
    for (let index = 0; index < line; index += 1) {
      if (/^## \[Unreleased\]/.test(lines[index])) published = false;
      else if (/^## \[[^\]]+\]/.test(lines[index])) published = true;
    }
    return published;
  }
  return false;
}

function verifyValidationContract(repoRoot = REPO_ROOT, options = {}) {
  const errors = [];
  const counts = { templates: 0, examples: 0, files: 0 };
  const policyFile = path.join(repoRoot, POLICY_PATH);
  let policyText;
  try { policyText = readText(policyFile); }
  catch (error) { return { errors: [display(violation('P-1', POLICY_PATH, 1, `policy ilegible: ${readFailure(error)}`))], counts }; }
  const contract = parsePolicyContract(policyText);
  if (contract.errors.length) {
    return { errors: contract.errors.map((detail) => display(violation('P-1', POLICY_PATH, 1, detail))), counts };
  }
  const installed = new Map([...contract.skills].filter(([skill]) =>
    fs.existsSync(path.join(repoRoot, 'skills', skill, 'SKILL.md'))));
  for (const skill of Object.keys(REPORT_TEMPLATES)) {
    if (!installed.has(skill)) errors.push(display(violation('P-1', POLICY_PATH, 1, `falta ${skill} en §4 o su SKILL.md`)));
  }
  for (const skill of installed.keys()) {
    if (!REPORT_TEMPLATES[skill]) errors.push(display(violation('P-1', POLICY_PATH, 1, `skill ${skill} sin entrada en REPORT_TEMPLATES`)));
  }
  for (const [skill, config] of installed) {
    const template = REPORT_TEMPLATES[skill];
    if (!template) continue;
    try {
      const text = readText(path.join(repoRoot, template));
      counts.templates += 1;
      errors.push(...checkReport(text, config.values, 'template').map((item) => display({ ...item, file: template })));
    } catch {
      errors.push(display(violation('G-01', template, 1, 'template no encontrado o ilegible')));
    }
    const skillFile = `skills/${skill}/SKILL.md`;
    try {
      if (!readText(path.join(repoRoot, skillFile)).includes('APPROVED')) {
        errors.push(display(violation('S-3', skillFile, 1, 'falta APPROVED en el skill')));
      }
    } catch { errors.push(display(violation('S-3', skillFile, 1, 'skill ilegible'))); }
    for (const file of listFiles(repoRoot, `skills/${skill}/examples`)) {
      if (path.posix.basename(file) !== config.report) continue;
      try {
        errors.push(...checkReport(readText(path.join(repoRoot, file)), config.values, 'report')
          .map((item) => display({ ...item, file })));
        counts.examples += 1;
      } catch (error) { errors.push(display(violation('P-1', file, 1, `ejemplo ilegible: ${readFailure(error)}`))); }
    }
  }

  const legacyExceptions = options.legacyExceptions ?? LEGACY_EXCEPTIONS;
  const exceptionHits = new Map(legacyExceptions.map((entry) => [entry, 0]));
  for (const entry of legacyExceptions) {
    if (!contract.exceptionSkills.has(entry.skill)) {
      errors.push(display(violation('E-1', POLICY_PATH, 1, `excepción no registrada en §6: ${entry.skill}`)));
    }
  }
  const rootMarkdown = fs.readdirSync(repoRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name);
  const scanned = [...SCAN_ROOTS.flatMap((root) => listFiles(repoRoot, root)), ...rootMarkdown].sort();
  for (const file of scanned) {
    if (!SCAN_EXTENSIONS.has(path.posix.extname(file)) || EXCLUSIONS.some((pattern) => pattern.test(file))) continue;
    try {
      const text = readText(path.join(repoRoot, file));
      counts.files += 1;
      for (const match of findLegacyVariants(text)) {
        if (isExcludedLine(file, text, match.line)) continue;
        const exception = legacyExceptions.find((entry) => entry.pattern.test(file) && entry.rules.includes(match.rule));
        if (exception) { exceptionHits.set(exception, exceptionHits.get(exception) + 1); continue; }
        errors.push(display(violation(match.rule, file, match.line, `variante heredada «${match.excerpt}»`)));
      }
    } catch (error) { errors.push(display(violation('P-1', file, 1, `archivo ilegible: ${readFailure(error)}`))); }
  }
  for (const entry of legacyExceptions) {
    if (!exceptionHits.get(entry)) errors.push(display(violation('E-2', POLICY_PATH, 1, `excepción obsoleta: retírala del verificador y de §6 (${entry.skill})`)));
  }
  try {
    const readme = readText(path.join(repoRoot, 'README.md'));
    if (!/\[[^\]]+\]\(docs\/policies\/validation-contract-policy\.md\)/.test(readme)) {
      errors.push(display(violation('R-1', 'README.md', 1, 'falta enlace Markdown a la policy')));
    }
  } catch { errors.push(display(violation('R-1', 'README.md', 1, 'README ilegible'))); }
  return { errors, counts };
}

function verifyReports(paths, repoRoot = REPO_ROOT) {
  const errors = [];
  if (!paths.length) return { errors: [display(violation('G-01', '--report', 1, 'falta al menos un reporte'))] };
  const policyFile = path.join(repoRoot, POLICY_PATH);
  let contract;
  try { contract = parsePolicyContract(readText(policyFile)); }
  catch (error) { return { errors: [display(violation('P-1', POLICY_PATH, 1, `policy ilegible: ${readFailure(error)}`))] }; }
  if (contract.errors.length) return { errors: contract.errors.map((detail) => display(violation('P-1', POLICY_PATH, 1, detail))) };
  for (const input of paths) {
    if (typeof input !== 'string' || !input.trim()) {
      errors.push(display(violation('G-01', '--report', 1, 'ruta de reporte inválida')));
      continue;
    }
    const absolute = path.resolve(repoRoot, input);
    const file = path.relative(repoRoot, absolute).replace(/\\/g, '/');
    if (file === '..' || file.startsWith('../') || path.isAbsolute(file)) {
      errors.push(display(violation('G-01', '--report', 1, 'ruta fuera de la raíz')));
      continue;
    }
    const config = [...contract.skills.values()].find((item) => item.report === path.posix.basename(file));
    if (!config) { errors.push(display(violation('G-01', file, 1, 'reporte no reconocido'))); continue; }
    try {
      let current = repoRoot;
      const hasSymlink = file.split('/').some((part) => {
        current = path.join(current, part);
        return fs.lstatSync(current).isSymbolicLink();
      });
      if (hasSymlink) {
        errors.push(display(violation('G-01', '--report', 1, 'ruta fuera de la raíz')));
        continue;
      }
      errors.push(...checkReport(readText(absolute), config.values, 'report')
        .map((item) => display({ ...item, file })));
    } catch (error) { errors.push(display(violation('P-1', file, 1, `reporte ilegible: ${readFailure(error)}`))); }
  }
  return { errors };
}

function main(argv = process.argv.slice(2)) {
  const result = argv[0] === '--report'
    ? verifyReports(argv.slice(1))
    : verifyValidationContract();
  if (result.errors.length) {
    console.error('[ERROR] Contrato de validación incumplido:');
    for (const error of result.errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  const { templates = 0, examples = 0, files = 0 } = result.counts || {};
  console.log(`[OK] Contrato de validación verificado: ${templates} templates, ${examples} ejemplos, ${files} archivos revisados.`);
}

if (require.main === module) main();

module.exports = {
  POLICY_PATH, REPORT_TEMPLATES, SCAN_ROOTS, SCAN_EXTENSIONS, EXCLUSIONS, LEGACY_EXCEPTIONS,
  parsePolicyContract, checkReport, findLegacyVariants, verifyValidationContract, verifyReports, main,
};
