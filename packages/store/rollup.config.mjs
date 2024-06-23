import generateConfig from '../../config/rollup.config.mjs';
import pkg from './package.json' assert { type: 'json' };

export default generateConfig(pkg);
