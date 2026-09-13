'use strict';

/*
 * En Windows un archivo npm.cmd no es ejecutable directamente por spawnSync.
 * En vez de habilitar un shell (que convertiría rutas en texto de comando),
 * invocamos el npm-cli.js distribuido con Node usando el binario Node actual.
 */

const fs = require('node:fs');
const path = require('node:path');

function npmExecutable(platform = process.platform) {
  return platform === 'win32' ? 'npm.cmd' : 'npm';
}

function npmCliCandidates({ platform = process.platform, nodeExecutable = process.execPath, env = process.env } = {}) {
  const pathApi = platform === 'win32' ? path.win32 : path;
  const candidates = [];
  if (env.npm_execpath) candidates.push(env.npm_execpath);
  candidates.push(pathApi.join(pathApi.dirname(nodeExecutable), 'node_modules', 'npm', 'bin', 'npm-cli.js'));
  return [...new Set(candidates.map((candidate) => pathApi.resolve(candidate)))];
}

function npmInvocation(args, {
  platform = process.platform,
  nodeExecutable = process.execPath,
  env = process.env,
  exists = fs.existsSync,
} = {}) {
  if (!Array.isArray(args)) throw new Error('Los argumentos de npm deben ser un array.');
  if (platform !== 'win32') return { command: 'npm', args: [...args] };

  const cli = npmCliCandidates({ platform, nodeExecutable, env }).find((candidate) => exists(candidate));
  if (!cli) {
    throw new Error(
      'No se encontró npm-cli.js junto a Node. Instala una distribución de Node que incluya npm o ejecuta mediante npm para definir npm_execpath.',
    );
  }
  return { command: nodeExecutable, args: [cli, ...args] };
}

module.exports = { npmExecutable, npmCliCandidates, npmInvocation };
