import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals.js";
import nextTs from "eslint-config-next/typescript.js";

const vitalsConfig = Array.isArray(nextVitals) ? nextVitals : [nextVitals];
const tsConfig = Array.isArray(nextTs) ? nextTs : [nextTs];

const eslintConfig = defineConfig([
  ...vitalsConfig,
  ...tsConfig,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
