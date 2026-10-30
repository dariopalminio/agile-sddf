#!/usr/bin/env node
'use strict';

/**
 * Motor de epic-validate (STORY-125, contrato I1 de STORY-169): ejecuta un comando de verificación
 * y lo clasifica con una regla única, para que el SKILL.md distinga «evidencia fallida»
 * (`NEEDS-CHANGES`) de «evidencia que no se puede obtener» (`BLOCKED`).
 *
 *   - `npm run <s>`, `npm run-script <s>` o `npm test` sin el script en `package.json`
 *     → `not-executable` sin lanzar el proceso (STORY-169 D-2: `npm run` sin script sale con 1)
 *   - ejecutable ausente del PATH, `ENOENT`, código 127 (sh) o 9009 (cmd.exe) → `not-executable`
 *     (STORY-169 D-3; `cmd.exe /d /s /c` devuelve 1 ante un comando desconocido, por eso se
 *     comprueba el PATH antes de lanzar: STORY-125 D-11)
 *   - código 0 → `pass`; cualquier otro → `fail`, con las últimas 20 líneas de stdout+stderr
 *
 * El comando se ejecuta tal cual con `cwd = REPO_ROOT` y sin timeout: la sustitución de
 * `{{smoke_id}}` la hace el SKILL.md. El subcomando `run` (suites de `verify`) es de STORY-169.
 * Se lanza con shell porque es una cadena de shell que declara el proyecto (`npm run <s>`) y
 * `npm.cmd` no se lanza sin shell en Windows; solo recibe comandos de archivos versionados del
 * proyecto (excepción a `sec-no-shell-injection`, STORY-125 D-12).
 *
 * Uso: node epic-suites.js check-command --repo-root <dir> --command "<cmd>"
 *
 * Salida: un único objeto JSON `CommandResult` en stdout
 * (`{ ok, command, outcome, exitCode, durationSeconds, reason, outputTail }`). Exit code: 0 si
 * pudo evaluar (aunque el comando falle); 1 ante un error interno; 2 ante argumentos inválidos
 * (error en stderr). Nunca lee stdin ni escribe archivos.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const TAIL_LINES = 20;
const NOT_FOUND_CODES = new Set([127, 9009]);
const NPM_SCRIPT_RE = /^npm\s+(?:run|run-script)\s+(\S+)/;
const NPM_TEST_RE = /^npm\s+test(?:\s|$)/;

/** Builtins de sh y cmd.exe: no viven en el PATH, así que no se comprueban antes de lanzar. */
const SHELL_BUILTINS = new Set([
  '.', ':', '[', 'alias', 'cd', 'command', 'echo', 'eval', 'exec', 'exit', 'export', 'false', 'printf', 'pwd',
  'read', 'return', 'set', 'shift', 'test', 'true', 'type', 'unset', 'call', 'chdir', 'cls', 'copy', 'del', 'dir',
  'erase', 'if', 'md', 'mkdir', 'move', 'rd', 'rem', 'ren', 'rmdir', 'setlocal', 'start', 'ver',
]);

/** Script npm que invoca `command` (`test` para `npm test`); null si no es un comando npm de script. */
function npmScriptOf(command) {
  const trimmed = command.trim();
  const match = NPM_SCRIPT_RE.exec(trimmed);
  if (match) return match[1];
  return NPM_TEST_RE.test(trimmed) ? 'test' : null;
}

/** Primer token del comando, sin comillas; null si empieza por una asignación `VAR=valor`. */
function executableOf(command) {
  const trimmed = command.trim();
  const token = trimmed.startsWith('"') ? trimmed.slice(1, trimmed.indexOf('"', 1)) : trimmed.split(/\s+/)[0];
  return !token || token.includes('=') ? null : token;
}

/** true si `token` resuelve a un archivo: ruta (relativa a `repoRoot`) o nombre en el PATH, con PATHEXT en Windows. */
function isOnPath(repoRoot, token) {
  const exts = process.platform === 'win32' ? ['', ...(process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM').split(';')] : [''];
  const exists = (base) => exts.some((ext) => fs.existsSync(base + ext) && fs.statSync(base + ext).isFile());
  if (/[\\/]/.test(token)) return exists(path.resolve(repoRoot, token));
  return (process.env.PATH || '').split(path.delimiter).filter(Boolean).some((dir) => exists(path.join(dir, token)));
}

/** Motivo de `not-executable` detectable sin lanzar el proceso; null si el comando puede lanzarse. */
function precheckCommand(repoRoot, command) {
  const script = npmScriptOf(command);
  if (script !== null) {
    const pkgPath = path.join(repoRoot, 'package.json');
    if (!fs.existsSync(pkgPath)) return 'package.json no existe';
    let scripts;
    try {
      scripts = JSON.parse(fs.readFileSync(pkgPath, 'utf8').replace(/^﻿/, '')).scripts || {};
    } catch {
      return 'package.json ilegible';
    }
    if (!Object.prototype.hasOwnProperty.call(scripts, script)) return `script npm ${script} no declarado en package.json`;
  }
  const exe = executableOf(command);
  if (exe && !SHELL_BUILTINS.has(exe.toLowerCase()) && !isOnPath(repoRoot, exe)) return 'ejecutable no encontrado (no está en el PATH)';
  return null;
}

function tail(text) {
  return text.replace(/\r\n/g, '\n').replace(/\n+$/, '').split('\n').slice(-TAIL_LINES).join('\n');
}

/** Ejecuta `command` en `repoRoot` y devuelve su `CommandResult`. */
function classifyCommand(repoRoot, command) {
  const base = { ok: true, command, outcome: 'not-executable', exitCode: null, durationSeconds: null, reason: null, outputTail: null };
  const reason = precheckCommand(repoRoot, command);
  if (reason) return { ...base, reason };

  const start = process.hrtime.bigint();
  const result = spawnSync(command, { cwd: repoRoot, shell: true, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  const durationSeconds = Math.round(Number(process.hrtime.bigint() - start) / 1e8) / 10;

  if (result.error && result.error.code === 'ENOENT') return { ...base, reason: 'ejecutable no encontrado (código ENOENT)' };
  if (result.error) throw result.error;
  if (NOT_FOUND_CODES.has(result.status)) return { ...base, exitCode: result.status, durationSeconds, reason: `ejecutable no encontrado (código ${result.status})` };
  if (result.status === 0) return { ...base, outcome: 'pass', exitCode: 0, durationSeconds };
  return { ...base, outcome: 'fail', exitCode: result.status, durationSeconds, outputTail: tail(`${result.stdout || ''}${result.stderr || ''}`) };
}

/** `{ subcommand, repoRoot, command }` o `{ error }`. */
function parseArgs(argv) {
  const [subcommand, ...rest] = argv;
  if (subcommand !== 'check-command') return { error: subcommand ? `subcomando desconocido: ${subcommand}` : 'falta el subcomando (check-command)' };
  const opts = {};
  for (let i = 0; i < rest.length; i += 2) {
    const flag = rest[i];
    if (flag !== '--repo-root' && flag !== '--command') return { error: `argumento no reconocido: ${flag}` };
    if (rest[i + 1] === undefined) return { error: `${flag} requiere un valor` };
    opts[flag] = rest[i + 1];
  }
  if (!opts['--repo-root']) return { error: 'falta --repo-root <dir>' };
  if (!opts['--command'] || !opts['--command'].trim()) return { error: 'falta --command "<cmd>"' };
  const repoRoot = path.resolve(opts['--repo-root']);
  if (!fs.existsSync(repoRoot) || !fs.statSync(repoRoot).isDirectory()) return { error: `--repo-root no es un directorio: ${repoRoot}` };
  return { subcommand, repoRoot, command: opts['--command'] };
}

function main(argv) {
  const args = parseArgs(argv);
  if (args.error) {
    process.stderr.write(`epic-suites: ${args.error}\nUso: node epic-suites.js check-command --repo-root <dir> --command "<cmd>"\n`);
    return 2;
  }
  try {
    process.stdout.write(`${JSON.stringify(classifyCommand(args.repoRoot, args.command))}\n`);
    return 0;
  } catch (err) {
    process.stdout.write(`${JSON.stringify({ ok: false, command: args.command, error: err.message })}\n`);
    return 1;
  }
}

if (require.main === module) process.exitCode = main(process.argv.slice(2));

module.exports = { npmScriptOf, precheckCommand, classifyCommand, parseArgs };
