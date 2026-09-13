#!/usr/bin/env node
'use strict';

/* Gate determinista para PRs. No usa shell, credenciales LLM ni lifecycle scripts. */

const { spawnSync } = require('node:child_process');
const path = require('node:path');
const { npmInvocation } = require('./npm-invocation.js');

const REPO_ROOT = path.resolve(__dirname, '..');

function steps() {
  const pack = npmInvocation(['pack', '--dry-run', '--ignore-scripts']);
  return [
    // Limitar el descubrimiento al directorio fuente de pruebas evita ejecutar
    // fixtures de Jest incluidos dentro de skills, instalaciones o .tmp/.
    { label: 'pruebas deterministas', command: process.execPath, args: ['--test', 'test'] },
    { label: 'sintaxis Node', command: process.execPath, args: ['scripts/verify-syntax.js'] },
    { label: 'resolución de raíces', command: process.execPath, args: ['scripts/audit-root-resolution.js'] },
    { label: 'perfiles y stacks', command: process.execPath, args: ['scripts/verify-profiles.js'] },
    { label: 'runtimes documentados', command: process.execPath, args: ['scripts/verify-runtime-documentation.js'] },
    { label: 'configuración YAML', command: process.execPath, args: ['scripts/verify-config-contract.js'] },
    { label: 'inventario de evals', command: process.execPath, args: ['scripts/verify-eval-inventory.js'] },
    { label: 'enlaces activos', command: process.execPath, args: ['scripts/check-doc-links.js'] },
    { label: 'cadena de suministro', command: process.execPath, args: ['scripts/verify-supply-chain.js'] },
    { label: 'workflow de seguridad de skills', command: process.execPath, args: ['scripts/verify-skill-security-workflow.js'] },
    { label: 'release', command: process.execPath, args: ['scripts/verify-release.js'] },
    { label: 'contenido publicable', command: pack.command, args: pack.args },
    { label: 'smoke del tarball', command: process.execPath, args: ['scripts/smoke-package-install.js'] },
  ];
}

function runStep(step, repoRoot = REPO_ROOT) {
  const result = spawnSync(step.command, step.args, {
    cwd: repoRoot,
    env: { ...process.env, npm_config_ignore_scripts: 'true' },
    encoding: 'utf8',
    stdio: 'inherit',
  });
  if (result.error) {
    throw new Error(`${step.label}: no se pudo iniciar ${step.command} (${result.error.message})`);
  }
  if (result.status !== 0) {
    throw new Error(`${step.label}: falló con exit ${result.status}`);
  }
}

function verifyRepository(repoRoot = REPO_ROOT) {
  for (const step of steps()) {
    console.log(`\n[VERIFY] ${step.label}`);
    runStep(step, repoRoot);
  }
}

if (require.main === module) {
  try {
    verifyRepository();
    console.log('\n[OK] Verificación determinista del repositorio aprobada.');
  } catch (error) {
    console.error(`\n[ERROR] ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { steps, runStep, verifyRepository };
