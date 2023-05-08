import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["index.ts"],
  bundle: false,
  external: ["@remix-run/router"],
  format: ["cjs", "esm"],
  dts: true,
  minify: false,
});
