'use strict';

const { installSDDF } = require('./install.js');

installSDDF({ folder: process.env.SDDF_TARGET || '.claude' }).catch((err) => {
  console.error('SDDF postinstall failed:', err.message);
  process.exit(1);
});
