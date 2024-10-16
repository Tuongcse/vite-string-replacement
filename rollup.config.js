import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',        // Entry point for your Vite plugin
  output: [
    {
      file: 'dist/index.cjs.js', // Output file for CJS
      format: 'cjs',             // CommonJS format
      exports: 'auto'            // Automatically determine what to export
    },
    {
      file: 'dist/index.esm.js', // Output file for ESM
      format: 'es',              // ES module format
    }
  ],
  plugins: [
    nodeResolve(),               // Helps resolve Node.js-style module imports
    commonjs(),                  // Converts CommonJS modules to ES6
    typescript({                 // Compiles TypeScript
      tsconfig: './tsconfig.json',
    })
  ]
};
