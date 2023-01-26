import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  dts: true,
  minify: true,
  format: ['cjs', 'esm'],
  tsconfig: 'tsconfig.json',
});
