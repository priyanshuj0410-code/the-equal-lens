import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Build artifacts: the Sanity Studio bundle + the brand package's dist.
    "dist/**",
    "**/dist/**",
    // The brand package is a separate workspace with its own toolchain.
    "brand/design-system/**",
    // Static assets are never app code; public/play/wasm/** in particular is MediaPipe
    // glue auto-copied from node_modules by scripts/copy-mediapipe.mjs on predev/prebuild.
    "public/**",
  ]),
]);

export default eslintConfig;
