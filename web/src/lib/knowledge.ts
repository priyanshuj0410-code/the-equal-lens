import fs from "node:fs";
import path from "node:path";

const KB = path.join(process.cwd(), "..", "knowledge");

export type Myth = {
  id: string;
  category: string;
  audience: string;
  myth: string;
  truth: string;
  explanation: string;
  sources?: { label: string; url?: string }[];
  tags?: string[];
  doodle?: string;
  difficulty?: number;
  placeholder?: boolean;
};

function readJsonDir<T>(dir: string): T[] {
  const full = path.join(KB, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(full, f), "utf8")) as T);
}

export function getMyths(): Myth[] {
  return readJsonDir<Myth>("myths");
}
