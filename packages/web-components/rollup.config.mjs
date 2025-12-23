import generateConfig from '@config/rollup';
import pkg from './package.json' with { type: 'json' };

export default generateConfig({
  ...pkg,
  compiler: 'tsc',
  port: 3003,
});
