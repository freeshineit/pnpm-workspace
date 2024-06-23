import generateConfig from '../../config/rollup.config.mjs';
import pkg from './package.json' with { type: 'json' };

export default generateConfig(pkg);
