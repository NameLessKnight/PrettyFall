import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const isDebug = process.env.DEBUG === '1';

const configs = [
  // ESM build
  {
    input: 'src/PrettyFall.js',
    output: {
      file: 'dist/prettyfall.esm.js',
      format: 'es'
    },
    plugins: [resolve(), commonjs()]
  },
  // UMD build (minified for production)
  {
    input: 'src/PrettyFall.js',
    output: {
      file: 'dist/prettyfall.umd.js',
      format: 'umd',
      name: 'PrettyFall'
    },
    plugins: [
      resolve(),
      commonjs(),
      terser({
        keep_classnames: true,
        keep_fnames: true,
        mangle: {
          keep_classnames: true,
          keep_fnames: true
        }
      })
    ]
  }
];

// Add debug build if DEBUG flag is set
if (isDebug) {
  configs.unshift({
    input: 'src/PrettyFall.js',
    output: {
      file: 'dist/prettyfall.umd.debug.js',
      format: 'umd',
      name: 'PrettyFall'
    },
    plugins: [resolve(), commonjs()]
  });
}

export default configs;
