import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";
import dts from "vite-plugin-dts";
import css from 'vite-plugin-css-injected-by-js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(), 
    dts({tsconfigPath: resolve(__dirname, "tsconfig.app.json")}),
    css()
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "MySimpleForm",
      fileName: "my-simple-form",
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});