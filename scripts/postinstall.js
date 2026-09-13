'use strict';

/*
 * `npm install` must not write into a consumer's project or home directory.
 * Runtime files are copied only by the explicit `agile-sddf install` command.
 * In particular, this lifecycle hook deliberately ignores SDDF_TARGET and all
 * other environment variables that used to select an installation folder.
 */

function postinstall() {
  return { installed: false, reason: 'explicit-install-required' };
}

if (require.main === module) {
  postinstall();
}

module.exports = { postinstall };
