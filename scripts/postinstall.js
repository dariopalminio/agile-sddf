'use strict';

const { installSDDF } = require('./install.js');

installSDDF().catch((err) => {
  console.error('SDDF postinstall failed:', err.message);
  process.exit(1);
});
