import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const KB = path.join(process.cwd(), "knowledge");

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

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  pronouns?: string;
  bio: string;
  photo?: string;
  links?: Record<string, string>;
  order?: number;
  placeholder?: boolean;
};

export type Job = {
  id: string;
  title: string;
  type: string;
  location?: string;
  remote?: boolean;
  summary: string;
  responsibilities?: string[];
  requirements?: string[];
  compensation?: string;
  applyEmail?: string;
  postedDate?: string;
  status: "open" | "closed";
  placeholder?: boolean;
};

export type Program = {
  id: string;
  title: string;
  summary: string;
  items: string[];
  icon?: string;
  order?: number;
  audience?: string;
};

export type PostMeta = {
  title: string;
  slug: string;
  date: string;
  author?: string;
  excerpt?: string;
  tags?: string[];
  cover?: string;
  status?: string;
  audience?: string;
  placeholder?: boolean;
};

export type Post = PostMeta & { html: string };

function readJsonDir<T>(dir: string): T[] {
  const full = path.join(KB, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(full, f), "utf8")) as T);
}

const byOrder = (a: { order?: number }, b: { order?: number }) =>
  (a.order ?? 99) - (b.order ?? 99);

export function getMyths(): Myth[] {
  return readJsonDir<Myth>("myths");
}

export function getTeam(): TeamMember[] {
  return readJsonDir<TeamMember>("team").sort(byOrder);
}

export function getPrograms(audience: "kid" | "adult" = "kid"): Program[] {
  return readJsonDir<Program>("programs")
    .filter((p) => (p.audience ?? "kid") === audience)
    .sort(byOrder);
}

export function getJobs(): Job[] {
  return readJsonDir<Job>("jobs").filter((j) => j.status === "open");
}

export function getPostsMeta(audience: "kid" | "adult" = "kid"): PostMeta[] {
  const dir = path.join(KB, "blog");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map(
      (f) => matter(fs.readFileSync(path.join(dir, f), "utf8")).data as PostMeta,
    )
    .filter((p) => p.status !== "draft" && (p.audience ?? "kid") === audience)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | null {
  const dir = path.join(KB, "blog");
  if (!fs.existsSync(dir)) return null;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".md"))) {
    const { data, content } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
    const meta = data as PostMeta;
    if (meta.slug === slug) {
      return { ...meta, html: marked.parse(content) as string };
    }
  }
  return null;
}
