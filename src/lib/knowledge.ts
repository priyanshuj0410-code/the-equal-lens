import fs from "node:fs";
import path from "node:path";
import { toHTML } from "@portabletext/to-html";
import matter from "gray-matter";
import { marked } from "marked";
import { client } from "@/sanity/client";
import { sanityEnabled } from "@/sanity/env";
import { urlFor } from "@/sanity/image";
import { ptComponents } from "@/sanity/portableText";
import {
  jobsQuery,
  pageQuery,
  postQuery,
  postsMetaQuery,
  programsQuery,
  teamQuery,
  testimonialsQuery,
} from "@/sanity/queries";

const KB = path.join(process.cwd(), "knowledge");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageRef = any;
const fetchOpts = (tag: string) => ({ next: { tags: [tag], revalidate: 60 } });

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

// Deep-merge a Sanity doc over the local JSON default so partially-filled
// Sanity content still falls back field-by-field to the shipped copy.
// Objects recurse; arrays + primitives from the override win when defined.
function deepMerge<T>(base: T, override: unknown): T {
  if (!isObj(base) || !isObj(override)) {
    return override === undefined ? base : (override as T);
  }
  const out: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(override)) {
    if (v === undefined) continue;
    const bv = (base as Record<string, unknown>)[k];
    out[k] = isObj(bv) && isObj(v) ? deepMerge(bv, v) : v;
  }
  return out as T;
}

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
  babyPhoto?: string;
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

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role?: string;
  tag?: string;
  audience?: string;
  photo?: string;
  order?: number;
  placeholder?: boolean;
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

export async function getTeam(): Promise<TeamMember[]> {
  if (sanityEnabled) {
    type Row = Omit<TeamMember, "photo" | "babyPhoto"> & {
      photo?: SanityImageRef;
      babyPhoto?: SanityImageRef;
    };
    const rows = await client.fetch<Row[]>(teamQuery, {}, fetchOpts("team"));
    const img = (ref?: SanityImageRef) =>
      ref ? urlFor(ref).width(640).height(640).fit("crop").auto("format").url() : undefined;
    return rows.map((m): TeamMember => ({
      ...m,
      photo: img(m.photo),
      babyPhoto: img(m.babyPhoto),
    }));
  }
  return readJsonDir<TeamMember>("team").sort(byOrder);
}

export async function getPrograms(
  audience: "kid" | "adult" = "kid",
): Promise<Program[]> {
  if (sanityEnabled) {
    return client.fetch<Program[]>(programsQuery, { audience }, fetchOpts("programs"));
  }
  return readJsonDir<Program>("programs")
    .filter((p) => (p.audience ?? "kid") === audience)
    .sort(byOrder);
}

export async function getTestimonials(
  audience: "kid" | "adult" = "kid",
): Promise<Testimonial[]> {
  if (sanityEnabled) {
    type Row = Omit<Testimonial, "photo"> & { photo?: SanityImageRef };
    const rows = await client.fetch<Row[]>(
      testimonialsQuery,
      { audience },
      fetchOpts("testimonials"),
    );
    return rows.map((t): Testimonial => ({
      ...t,
      photo: t.photo
        ? urlFor(t.photo).width(600).height(450).fit("crop").auto("format").url()
        : undefined,
    }));
  }
  return readJsonDir<Testimonial>("testimonials")
    .filter((t) => (t.audience ?? "kid") === audience)
    .sort(byOrder);
}

// Per-page editable copy. Returns the local knowledge/pages/<key>.json default
// with the Sanity singleton (_type "<key>Page") deep-merged over it, so the page
// renders identically when Sanity is empty/disabled and is overridable when set.
export async function getPageContent(
  key: string,
): Promise<Record<string, unknown>> {
  const file = path.join(KB, "pages", `${key}.json`);
  const fallback: Record<string, unknown> = fs.existsSync(file)
    ? JSON.parse(fs.readFileSync(file, "utf8"))
    : {};
  if (!sanityEnabled) return fallback;
  const doc = await client.fetch<Record<string, unknown> | null>(
    pageQuery,
    { type: `${key}Page` },
    fetchOpts("page"),
  );
  return doc ? deepMerge(fallback, doc) : fallback;
}

export async function getJobs(): Promise<Job[]> {
  if (sanityEnabled) {
    return client.fetch<Job[]>(jobsQuery, {}, fetchOpts("jobs"));
  }
  return readJsonDir<Job>("jobs").filter((j) => j.status === "open");
}

export async function getPostsMeta(
  audience: "kid" | "adult" = "kid",
): Promise<PostMeta[]> {
  if (sanityEnabled) {
    type Row = Omit<PostMeta, "cover"> & { cover?: SanityImageRef };
    const rows = await client.fetch<Row[]>(postsMetaQuery, { audience }, fetchOpts("posts"));
    return rows.map((p): PostMeta => ({
      ...p,
      cover: p.cover ? urlFor(p.cover).width(800).auto("format").url() : undefined,
    }));
  }
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

export async function getPost(slug: string): Promise<Post | null> {
  if (sanityEnabled) {
    type Row = Omit<PostMeta, "cover"> & { cover?: SanityImageRef; body?: unknown[] };
    const p = await client.fetch<Row | null>(postQuery, { slug }, fetchOpts("posts"));
    if (!p) return null;
    const { body, cover, ...meta } = p;
    return {
      ...meta,
      cover: cover ? urlFor(cover).width(1000).auto("format").url() : undefined,
      html: Array.isArray(body)
        ? toHTML(body as Parameters<typeof toHTML>[0], { components: ptComponents })
        : "",
    };
  }
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
