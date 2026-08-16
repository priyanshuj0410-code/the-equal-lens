// Self-hosts MediaPipe's wasm bundle under /public so the kids' game never loads code from a
// third-party CDN. Runs before dev and build.
import { cpSync, mkdirSync, existsSync } from "node:fs";

const src = "node_modules/@mediapipe/tasks-vision/wasm";
const dst = "public/play/wasm";

if (!existsSync(src)) {
  console.error("copy-mediapipe: @mediapipe/tasks-vision not installed");
  process.exit(1);
}
mkdirSync(dst, { recursive: true });
cpSync(src, dst, { recursive: true });
console.log("copy-mediapipe: wasm -> public/play/wasm");
