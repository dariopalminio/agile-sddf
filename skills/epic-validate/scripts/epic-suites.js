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
 * `{{smoke_id}}` la hace el SKILL.md. Se lanza con shell porque es una cadena de shell que declara
 * el proyecto (`npm run <s>`) y `npm.cmd` no se lanza sin shell en Windows; solo recibe comandos de
 * archivos versionados del proyecto (excepción a `sec-no-shell-injection`, STORY-125 D-12).
 *
 * El subcomando `run` (STORY-169) lee de `sddf.config.yaml › verify` las suites de nivel épica
 * (`EPIC_SUITE_KEYS`, en ese orden fijo) y las ejecuta secuencialmente con la misma clasificación;
 * una clave ausente de `verify` es `absent` con una advertencia y una clave sin `command`,
 * `not-executable`.
 *
 * Uso: node epic-suites.js run --repo-root <dir> [--full-output]
 *      node epic-suites.js check-command --repo-root <dir> --command "<cmd>" [--full-output]
 *
 * Salida: un único objeto JSON en stdout: `CommandResult`
 * (`{ ok, command, outcome, exitCode, durationSeconds, reason, outputTail }`) con `check-command`, y
 * `SuitesResult` (`{ ok, configPath, suites, warnings }`, cada suite con `key`, `declared`, `required`
 * y los campos de `CommandResult` salvo `ok`) con `run`. Con `--full-output` (STORY-137, `--verbose`
 * del skill) cada resultado agrega `output`: stdout completo seguido de stderr completo, sin truncar y
 * para cualquier `outcome`, o `null` si el comando no se lanzó; el resto no cambia. Exit code: 0 si
 * pudo evaluar (aunque el comando falle); 1 ante un error interno (p. ej. `sddf.config.yaml`
 * ilegible); 2 ante argumentos inválidos (error en stderr). Nunca lee stdin ni escribe archivos.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const CONFIG_FILE = 'sddf.config.yaml';
/** Suites de nivel épica de `verify` (CS-11), en el orden fijo de ejecución (STORY-169 D-8). */
const EPIC_SUITE_KEYS = ['integration', 'e2e', 'e2e-regression'];
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

/**
 * Ejecuta `command` en `repoRoot` y devuelve su `CommandResult`. Con `fullOutput`, agrega `output`
 * (salida completa, `null` si no se lanzó) sin cambiar ningún otro campo (STORY-137 D-4, D-5).
 */
function classifyCommand(repoRoot, command, { fullOutput = false } = {}) {
  const base = { ok: true, command, outcome: 'not-executable', exitCode: null, durationSeconds: null, reason: null, outputTail: null };
  const withOutput = (res, output = null) => (fullOutput ? { ...res, output } : res);
  const reason = precheckCommand(repoRoot, command);
  if (reason) return withOutput({ ...base, reason });

  const start = process.hrtime.bigint();
  const result = spawnSync(command, { cwd: repoRoot, shell: true, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  const durationSeconds = Math.round(Number(process.hrtime.bigint() - start) / 1e8) / 10;

  if (result.error && result.error.code === 'ENOENT') return withOutput({ ...base, reason: 'ejecutable no encontrado (código ENOENT)' });
  if (result.error) throw result.error;
  if (NOT_FOUND_CODES.has(result.status)) return withOutput({ ...base, exitCode: result.status, durationSeconds, reason: `ejecutable no encontrado (código ${result.status})` });
  const output = `${result.stdout || ''}${result.stderr || ''}`;
  if (result.status === 0) return withOutput({ ...base, outcome: 'pass', exitCode: 0, durationSeconds }, output);
  return withOutput({ ...base, outcome: 'fail', exitCode: result.status, durationSeconds, outputTail: tail(output) }, output);
}

const ESCAPES = { n: '\n', t: '\t', r: '\r', 0: '\0' };

/**
 * Valor de un escalar YAML de una línea: quita las comillas (con los escapes de `"…"` y el `''` de
 * `'…'`) y el comentario `#` fuera de comillas. null si está vacío, es de flujo (`{…}`, `[…]`) o la
 * comilla no se cierra: un dato que no se entiende nunca se convierte en un comando.
 */
function scalarOf(raw) {
  const text = raw.trim();
  const quote = text[0];
  if (quote === '"' || quote === "'") {
    let value = '';
    for (let i = 1; i < text.length; i += 1) {
      const ch = text[i];
      if (quote === '"' && ch === '\\' && i + 1 < text.length) {
        i += 1;
        value += ESCAPES[text[i]] ?? text[i];
      } else if (ch === quote && quote === "'" && text[i + 1] === "'") {
        value += "'";
        i += 1;
      } else if (ch === quote) {
        const rest = text.slice(i + 1).trim();
        return rest === '' || rest.startsWith('#') ? value : null;
      } else {
        value += ch;
      }
    }
    return null;
  }
  const hash = text.search(/(^|\s)#/);
  const value = (hash === -1 ? text : text.slice(0, hash)).trim();
  return value === '' || value.startsWith('{') || value.startsWith('[') ? null : value;
}

/**
 * Suites de nivel épica del bloque `verify:` de `sddf.config.yaml`, sin librería YAML (STORY-169 D-4):
 * para cada clave de `EPIC_SUITE_KEYS` y en ese orden, `{ key, declared, command, required }`. Solo
 * lee `command` y `required` (`false` si falta); las demás claves de `verify` se ignoran.
 */
function readEpicSuites(configText) {
  const found = new Map();
  let inVerify = false;
  let keyIndent = null;
  let current = null;
  for (const line of configText.replace(/^﻿/, '').split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const indent = line.length - line.trimStart().length;
    const match = /^\s*([\w-]+)\s*:(.*)$/.exec(line);
    if (indent === 0) {
      inVerify = match !== null && match[1] === 'verify' && /^\s*(#.*)?$/.test(match[2]);
      keyIndent = null;
      current = null;
      continue;
    }
    if (!inVerify || !match) continue;
    if (keyIndent === null || indent <= keyIndent) {
      keyIndent = indent;
      current = EPIC_SUITE_KEYS.includes(match[1]) && !found.has(match[1]) ? match[1] : null;
      if (current) found.set(current, { command: null, required: false });
      continue;
    }
    if (current === null) continue;
    if (match[1] === 'command') found.get(current).command = scalarOf(match[2]);
    if (match[1] === 'required') found.get(current).required = scalarOf(match[2]) === 'true';
  }
  return EPIC_SUITE_KEYS.map((key) => (found.has(key) ? { key, declared: true, ...found.get(key) } : { key, declared: false, command: null, required: false }));
}

/**
 * `SuitesResult` de las suites de nivel épica de `repoRoot`, ejecutadas en orden con `classifyCommand`.
 * Lanza si `sddf.config.yaml` existe pero no se puede leer (exit 1 en el CLI).
 */
function runSuites(repoRoot, { fullOutput = false } = {}) {
  const configPath = path.join(repoRoot, CONFIG_FILE);
  const configExists = fs.existsSync(configPath);
  const warnings = configExists ? [] : [`${CONFIG_FILE} no existe`];
  const declared = readEpicSuites(configExists ? fs.readFileSync(configPath, 'utf8') : '');
  const notLaunched = { exitCode: null, durationSeconds: null, outputTail: null, ...(fullOutput ? { output: null } : {}) };
  const suites = declared.map(({ key, declared: isDeclared, command, required }) => {
    const base = { key, declared: isDeclared, command, required };
    if (!isDeclared) {
      const reason = configExists ? `clave ${key} no declarada en verify` : `${CONFIG_FILE} no existe`;
      if (configExists) warnings.push(reason);
      return { ...base, outcome: 'absent', reason, ...notLaunched };
    }
    if (command === null) return { ...base, outcome: 'not-executable', reason: `${key} no declara command`, ...notLaunched };
    const result = classifyCommand(repoRoot, command, { fullOutput });
    delete result.ok;
    return { ...result, ...base };
  });
  return { ok: true, configPath: CONFIG_FILE, suites, warnings };
}

/** Opciones con valor que acepta cada subcomando; `--full-output` vale para ambos. */
const SUBCOMMAND_FLAGS = { run: ['--repo-root'], 'check-command': ['--repo-root', '--command'] };
const USAGE = 'Uso: node epic-suites.js run --repo-root <dir> [--full-output]\n     node epic-suites.js check-command --repo-root <dir> --command "<cmd>" [--full-output]';

/** `{ subcommand, repoRoot, command, fullOutput }` o `{ error }`. */
function parseArgs(argv) {
  const [subcommand, ...rest] = argv;
  if (!Object.prototype.hasOwnProperty.call(SUBCOMMAND_FLAGS, subcommand || '')) return { error: subcommand ? `subcomando desconocido: ${subcommand}` : 'falta el subcomando (run o check-command)' };
  const opts = {};
  let fullOutput = false;
  for (let i = 0; i < rest.length; i += 1) {
    const flag = rest[i];
    if (flag === '--full-output') {
      fullOutput = true;
      continue;
    }
    if (!SUBCOMMAND_FLAGS[subcommand].includes(flag)) return { error: `argumento no reconocido: ${flag}` };
    if (rest[i + 1] === undefined) return { error: `${flag} requiere un valor` };
    opts[flag] = rest[i + 1];
    i += 1;
  }
  if (!opts['--repo-root']) return { error: 'falta --repo-root <dir>' };
  if (subcommand === 'check-command' && (!opts['--command'] || !opts['--command'].trim())) return { error: 'falta --command "<cmd>"' };
  const repoRoot = path.resolve(opts['--repo-root']);
  if (!fs.existsSync(repoRoot) || !fs.statSync(repoRoot).isDirectory()) return { error: `--repo-root no es un directorio: ${repoRoot}` };
  return { subcommand, repoRoot, command: opts['--command'] ?? null, fullOutput };
}

function main(argv) {
  const args = parseArgs(argv);
  if (args.error) {
    process.stderr.write(`epic-suites: ${args.error}\n${USAGE}\n`);
    return 2;
  }
  const isRun = args.subcommand === 'run';
  try {
    const result = isRun ? runSuites(args.repoRoot, { fullOutput: args.fullOutput }) : classifyCommand(args.repoRoot, args.command, { fullOutput: args.fullOutput });
    process.stdout.write(`${JSON.stringify(result)}\n`);
    return 0;
  } catch (err) {
    process.stdout.write(`${JSON.stringify(isRun ? { ok: false, configPath: CONFIG_FILE, error: err.message } : { ok: false, command: args.command, error: err.message })}\n`);
    return 1;
  }
}

if (require.main === module) process.exitCode = main(process.argv.slice(2));

module.exports = { EPIC_SUITE_KEYS, npmScriptOf, precheckCommand, classifyCommand, readEpicSuites, runSuites, parseArgs };
