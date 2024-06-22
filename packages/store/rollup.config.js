/* eslint-disable @typescript-eslint/no-var-requires */
const generateConfig = require('../../config/rollup.config');
const pkg = require('./package.json');

module.exports = generateConfig(pkg);
