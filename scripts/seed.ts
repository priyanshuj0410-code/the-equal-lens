/**
 * One-shot migration: copies the existing knowledge/ seeds (team, jobs, blog)
 * into Sanity so the live pages aren't blank. Idempotent (createOrReplace with
 * stable ids), so it's safe to re-run.
 *
 * Run after `npx sanity login`:
 *   npx sanity exec scripts/seed.ts --with-user-token
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getCliClient } from "sanity/cli";

const client = getCliClient();
const KB = path.join(process.cwd(), "knowledge");

const key = () => Math.random().toString(36).slice(2, 12);

function readJson(dir: string): Record<string, unknown>[] {
  const full = path.join(KB, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(full, f), "utf8")));
}

// minimal Markdown -> Portable Text (paragraphs, blockquotes, **bold**, *italic*)
function inlineSpans(text: string) {
  const spans: Record<string, unknown>[] = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  const push = (t: string, marks: string[] = []) => {
    if (t) spans.push({ _type: "span", _key: key(), text: t, marks });
  };
  while ((m = re.exec(text)) !== null) {
    push(text.slice(last, m.index));
    if (m[1] !== undefined) push(m[1], ["strong"]);
    else push(m[2], ["em"]);
    last = re.lastIndex;
  }
  push(text.slice(last));
  return spans.length ? spans : [{ _type: "span", _key: key(), text, marks: [] }];
}

function mdToPortableText(md: string) {
  return md
    .trim()
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const isQuote = chunk.startsWith(">");
      const text = isQuote ? chunk.replace(/^>\s?/gm, "").trim() : chunk;
      return {
        _type: "block",
        _key: key(),
        style: isQuote ? "blockquote" : "normal",
        markDefs: [],
        children: inlineSpans(text),
      };
    });
}

function cleanLinks(links: unknown) {
  const l = (links ?? {}) as Record<string, string>;
  const out: Record<string, string> = {};
  for (const k of ["linkedin", "twitter", "website"]) if (l[k]) out[k] = l[k];
  return Object.keys(out).length ? out : undefined;
}

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

// Sanity requires a _key on every array-of-objects item; add them recursively.
function withKeys(v: unknown): unknown {
  if (Array.isArray(v)) {
    return v.map((item) => {
      const mapped = withKeys(item);
      return isPlainObject(mapped) ? { _key: key(), ...mapped } : mapped;
    });
  }
  if (isPlainObject(v)) {
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v)) out[k] = withKeys(val);
    return out;
  }
  return v;
}

async function run() {
  const docs: Record<string, unknown>[] = [];

  for (const m of readJson("team")) {
    const id = String(m.id);
    docs.push({
      _id: `team-${id}`,
      _type: "teamMember",
      name: m.name,
      role: m.role,
      pronouns: m.pronouns,
      bio: m.bio,
      slug: { _type: "slug", current: id },
      order: m.order,
      links: cleanLinks(m.links),
    });
  }

  for (const j of readJson("jobs")) {
    const id = String(j.id);
    docs.push({
      _id: `job-${id}`,
      _type: "job",
      title: j.title,
      slug: { _type: "slug", current: id },
      type: j.type,
      location: j.location,
      remote: j.remote,
      summary: j.summary,
      responsibilities: j.responsibilities,
      requirements: j.requirements,
      compensation: j.compensation,
      applyEmail: j.applyEmail,
      postedDate: j.postedDate,
      status: j.status ?? "open",
    });
  }

  const blogDir = path.join(KB, "blog");
  if (fs.existsSync(blogDir)) {
    for (const f of fs.readdirSync(blogDir).filter((x) => x.endsWith(".md"))) {
      const { data, content } = matter(fs.readFileSync(path.join(blogDir, f), "utf8"));
      const slug = String(data.slug);
      docs.push({
        _id: `post-${slug}`,
        _type: "post",
        title: data.title,
        slug: { _type: "slug", current: slug },
        audience: data.audience ?? "kid",
        date: data.date,
        author: data.author,
        excerpt: data.excerpt,
        tags: data.tags,
        status: data.status ?? "published",
        body: mdToPortableText(content),
      });
    }
  }

  // per-page editable copy: one singleton doc per knowledge/pages/<key>.json
  const pagesDir = path.join(KB, "pages");
  if (fs.existsSync(pagesDir)) {
    for (const f of fs.readdirSync(pagesDir).filter((x) => x.endsWith(".json"))) {
      const pageKey = f.replace(/\.json$/, "");
      const data = JSON.parse(fs.readFileSync(path.join(pagesDir, f), "utf8"));
      docs.push({
        _id: `${pageKey}Page`,
        _type: `${pageKey}Page`,
        ...(withKeys(data) as Record<string, unknown>),
      });
    }
  }

  for (const p of readJson("programs")) {
    const id = String(p.id);
    docs.push({
      _id: `program-${id}`,
      _type: "program",
      title: p.title,
      audience: p.audience ?? "kid",
      summary: p.summary,
      items: p.items,
      icon: p.icon,
      slug: { _type: "slug", current: id },
      order: p.order,
    });
  }

  const tx = docs.reduce((t, d) => t.createOrReplace(d as never), client.transaction());
  await tx.commit();
  console.log(`Seeded ${docs.length} documents into Sanity.`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
