#!/usr/bin/env node
'use strict';

/**
 * Runs Skill Shielder at the trust boundary it understands: one installable
 * skill directory at a time.  The upstream scanner correlates findings within
 * its target, so passing the whole skills/ tree would incorrectly correlate
 * unrelated skills.
 */

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const REPO_ROOT = path.resolve(__dirname, '..');
const EXIT_CODES = Object.freeze({
  clean: 0,
  warning: 1,
  critical: 2,
  operationalError: 3,
});

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function isInside(parent, candidate) {
  const relative = path.relative(parent, candidate);
  return relative === '' || (!relative.startsWith('..' + path.sep) && relative !== '..' && !path.isAbsolute(relative));
}

function resolveInside(repoRoot, value, label) {
  const resolved = path.resolve(repoRoot, value);
  if (!isInside(repoRoot, resolved)) {
    throw new Error(`${label} must stay inside the repository: ${value}`);
  }
  return resolved;
}

const FILE_PROFILES = Object.freeze([
  {
    name: 'agents',
    directory: 'agents',
    includes: (fileName) => fileName.endsWith('.agent.md'),
  },
  {
    name: 'scripts',
    directory: 'scripts',
    includes: (fileName) => /\.(?:cjs|js|mjs|py|ts)$/i.test(fileName),
  },
  {
    name: 'workflows',
    directory: '.github/workflows',
    includes: (fileName) => /\.ya?ml$/i.test(fileName),
  },
]);

function listRegularFiles(directory, includes, errors, repoRoot) {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const candidate = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) {
      errors.push(`Refusing symbolic link in an isolated scan target: ${toPosix(path.relative(repoRoot, candidate))}`);
      continue;
    }
    if (entry.isDirectory()) {
      files.push(...listRegularFiles(candidate, includes, errors, repoRoot));
      continue;
    }
    if (entry.isFile() && includes(entry.name)) files.push(candidate);
  }
  return files;
}

function findSymbolicLink(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const candidate = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) return candidate;
    if (entry.isDirectory()) {
      const nested = findSymbolicLink(candidate);
      if (nested) return nested;
    }
  }
  return null;
}

function buildAuditPlan({ repoRoot = REPO_ROOT, skillsDir = 'skills' } = {}) {
  const root = path.resolve(repoRoot);
  const directory = resolveInside(root, skillsDir, 'skills directory');
  const errors = [];

  if (!fs.existsSync(directory) || !fs.lstatSync(directory).isDirectory() || fs.lstatSync(directory).isSymbolicLink()) {
    return { targets: [], errors: [`Missing skill directory: ${toPosix(path.relative(root, directory)) || skillsDir}`] };
  }

  const targets = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) {
      errors.push(`Refusing symbolic link in skills directory: ${entry.name}`);
      continue;
    }
    if (!entry.isDirectory()) continue;
    const sourcePath = path.join(directory, entry.name);
    const skillFile = path.join(sourcePath, 'SKILL.md');
    if (!fs.existsSync(skillFile) || !fs.lstatSync(skillFile).isFile() || fs.lstatSync(skillFile).isSymbolicLink()) {
      errors.push(`Skill directory lacks its required SKILL.md: ${toPosix(path.relative(root, sourcePath))}`);
      continue;
    }
    const symbolicLink = findSymbolicLink(sourcePath);
    if (symbolicLink) {
      errors.push(`Refusing symbolic link inside skill directory: ${toPosix(path.relative(root, symbolicLink))}`);
      continue;
    }
    targets.push({
      label: toPosix(path.relative(root, sourcePath)),
      sourcePath,
      kind: 'directory',
      skillFile,
    });
  }

  if (targets.length === 0) {
    errors.push(`No installable skill directories with SKILL.md found under ${toPosix(path.relative(root, directory)) || 'skills'}.`);
  }

  for (const profile of FILE_PROFILES) {
    const profileDirectory = path.join(root, profile.directory);
    for (const sourcePath of listRegularFiles(profileDirectory, profile.includes, errors, root)) {
      targets.push({
        label: toPosix(path.relative(root, sourcePath)),
        sourcePath,
        kind: 'file',
        profile: profile.name,
      });
    }
  }

  targets.sort((left, right) => left.label.localeCompare(right.label));
  return { targets, errors };
}

function classifyScanResult(result, { warnBlocks = false } = {}) {
  const exitCode = Number.isInteger(result && result.exitCode) ? result.exitCode : null;
  if (!result || result.error || result.signal || exitCode === null) {
    return {
      status: 'operational-error',
      blocking: true,
      exitCode: EXIT_CODES.operationalError,
      scannerExitCode: exitCode,
      reason: result && result.error ? result.error.message : 'scanner did not return a usable exit code',
    };
  }

  if (exitCode === EXIT_CODES.clean) {
    return { status: 'clean', blocking: false, exitCode: EXIT_CODES.clean, scannerExitCode: exitCode };
  }
  if (exitCode === EXIT_CODES.warning) {
    return {
      status: 'warning',
      blocking: warnBlocks,
      exitCode: warnBlocks ? EXIT_CODES.warning : EXIT_CODES.clean,
      scannerExitCode: exitCode,
    };
  }
  if (exitCode === EXIT_CODES.critical) {
    return { status: 'critical', blocking: true, exitCode: EXIT_CODES.critical, scannerExitCode: exitCode };
  }

  return {
    status: 'operational-error',
    blocking: true,
    exitCode: EXIT_CODES.operationalError,
    scannerExitCode: exitCode,
    reason: `unexpected scanner exit code ${exitCode}`,
  };
}

function invokeScanner({ scannerPath, targetPath, repoRoot }) {
  const result = spawnSync(scannerPath, [targetPath], {
    cwd: repoRoot,
    encoding: 'utf8',
    shell: false,
    maxBuffer: 16 * 1024 * 1024,
  });
  return {
    exitCode: result.status,
    signal: result.signal,
    error: result.error,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
}

function appendReport(reportPath, text) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.appendFileSync(reportPath, text, 'utf8');
}

function appendScannerOutput(reportPath, output) {
  if (output && output.stdout) appendReport(reportPath, output.stdout.endsWith('\n') ? output.stdout : `${output.stdout}\n`);
  if (output && output.stderr) appendReport(reportPath, output.stderr.endsWith('\n') ? output.stderr : `${output.stderr}\n`);
}

function normalizeOutput(output) {
  if (!output || typeof output !== 'object') {
    return { error: new Error('scanner command returned no result'), stdout: '', stderr: '' };
  }
  return {
    exitCode: output.exitCode,
    signal: output.signal,
    error: output.error,
    stdout: output.stdout || '',
    stderr: output.stderr || '',
  };
}

function stageFileTarget(repoRoot, target) {
  if (!target || target.kind !== 'file' || !target.sourcePath) {
    throw new Error('Invalid file target in audit plan.');
  }
  const sourcePath = path.resolve(target.sourcePath);
  if (!isInside(repoRoot, sourcePath)) {
    throw new Error(`File target escapes the repository: ${target.sourcePath}`);
  }
  const metadata = fs.lstatSync(sourcePath);
  if (!metadata.isFile() || metadata.isSymbolicLink()) {
    throw new Error(`File target must be a regular file: ${target.label}`);
  }

  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'agile-sddf-shielder-'));
  fs.copyFileSync(sourcePath, path.join(directory, path.basename(sourcePath)));
  return {
    scannerTarget: directory,
    cleanup() {
      fs.rmSync(directory, { recursive: true, force: true, maxRetries: 3 });
    },
  };
}

function scannerTargetFor(repoRoot, target) {
  if (!target || !target.sourcePath) throw new Error('Invalid target in audit plan.');
  const sourcePath = path.resolve(target.sourcePath);
  if (!isInside(repoRoot, sourcePath)) {
    throw new Error(`Audit target escapes the repository: ${target.sourcePath}`);
  }
  if (target.kind === 'file') return stageFileTarget(repoRoot, target);
  if (target.kind !== 'directory') throw new Error(`Unknown audit target kind: ${target.kind}`);

  const metadata = fs.lstatSync(sourcePath);
  if (!metadata.isDirectory() || metadata.isSymbolicLink()) {
    throw new Error(`Directory target must be a real directory: ${target.label}`);
  }
  return { scannerTarget: sourcePath, cleanup() {} };
}

function strongerExit(current, candidate) {
  // Operational errors mean that coverage is incomplete, so they take
  // precedence over a critical finding. Warnings do not alter a nonblocking
  // audit by default.
  return Math.max(current, candidate);
}

function runSkillShielderAudit({
  repoRoot = REPO_ROOT,
  scannerPath,
  reportPath = 'audit-report.txt',
  skillsDir = 'skills',
  warnBlocks = false,
  plan,
  runCommand = invokeScanner,
} = {}) {
  const root = path.resolve(repoRoot);
  const resolvedReportPath = resolveInside(root, reportPath, 'report path');
  let auditPlan = plan;
  if (!auditPlan) {
    try {
      auditPlan = buildAuditPlan({ repoRoot: root, skillsDir });
    } catch (error) {
      auditPlan = { targets: [], errors: [error.message] };
    }
  }
  const results = [];
  let exitCode = EXIT_CODES.clean;

  if (!scannerPath) {
    auditPlan.errors = [...(auditPlan.errors || []), 'Missing --shielder path.'];
  }

  for (const error of auditPlan.errors || []) {
    appendReport(resolvedReportPath, `\n[ERROR] ${error}\n`);
    exitCode = EXIT_CODES.operationalError;
  }

  for (const target of auditPlan.targets || []) {
    appendReport(resolvedReportPath, `\n===== Auditing ${target.label} =====\n`);
    let output;
    let stagedTarget;
    let scannerTarget = null;
    let cleanupError;
    try {
      stagedTarget = scannerTargetFor(root, target);
      scannerTarget = stagedTarget.scannerTarget;
      output = normalizeOutput(runCommand({ scannerPath, targetPath: scannerTarget, repoRoot: root }));
    } catch (error) {
      output = { error, stdout: '', stderr: '' };
    } finally {
      if (stagedTarget) {
        try {
          stagedTarget.cleanup();
        } catch (error) {
          cleanupError = error;
        }
      }
    }
    if (cleanupError) output = { ...normalizeOutput(output), error: cleanupError };
    appendScannerOutput(resolvedReportPath, output);

    const classification = classifyScanResult(output, { warnBlocks });
    const result = {
      label: target.label,
      sourcePath: target.sourcePath,
      scannerTarget,
      stdout: output.stdout || '',
      stderr: output.stderr || '',
      ...classification,
    };
    results.push(result);
    const detail = classification.reason ? `: ${classification.reason}` : '';
    appendReport(
      resolvedReportPath,
      `[RESULT] ${target.label}: ${classification.status} (scanner exit ${classification.scannerExitCode ?? 'none'})${detail}\n`,
    );
    exitCode = strongerExit(exitCode, classification.exitCode);
  }

  const counts = results.reduce((summary, result) => {
    summary[result.status] = (summary[result.status] || 0) + 1;
    return summary;
  }, { clean: 0, warning: 0, critical: 0, 'operational-error': 0 });
  const summary = `Skill Shielder summary: ${results.length} isolated targets; ${counts.clean} clean, ${counts.warning} warnings, ${counts.critical} critical, ${counts['operational-error']} operational errors. Exit code: ${exitCode}.`;
  appendReport(resolvedReportPath, `\n${summary}\n`);

  return { exitCode, results, reportPath: resolvedReportPath, summary, plan: auditPlan };
}

function parseArgs(argv) {
  const options = { skillsDir: 'skills', reportPath: 'audit-report.txt', warnBlocks: false };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--warn-blocks') {
      options.warnBlocks = true;
      continue;
    }
    if (!['--shielder', '--skills-dir', '--report', '--repo-root'].includes(argument)) {
      throw new Error(`Unknown argument: ${argument}`);
    }
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`Missing value for ${argument}`);
    index += 1;
    if (argument === '--shielder') options.scannerPath = value;
    if (argument === '--skills-dir') options.skillsDir = value;
    if (argument === '--report') options.reportPath = value;
    if (argument === '--repo-root') options.repoRoot = value;
  }
  if (!options.scannerPath) throw new Error('Missing required --shielder path.');
  return options;
}

function main(argv = process.argv.slice(2)) {
  try {
    const result = runSkillShielderAudit(parseArgs(argv));
    console.log(result.summary);
    return result.exitCode;
  } catch (error) {
    console.error(`[ERROR] ${error.message}`);
    return EXIT_CODES.operationalError;
  }
}

if (require.main === module) process.exitCode = main();

module.exports = {
  EXIT_CODES,
  buildAuditPlan,
  classifyScanResult,
  main,
  runSkillShielderAudit,
  stageFileTarget,
};
