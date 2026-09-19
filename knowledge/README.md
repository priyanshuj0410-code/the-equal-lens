# The Equal Lens - Knowledge Base

This folder is the **single source of truth** for the content that powers the website: the myths and stereotypes behind the canvas easter eggs, plus blog posts, team members, and job listings.

It is designed in the spirit of the **Open Knowledge Format (OKF)** - content lives as plain, structured, version-controlled files (JSON + Markdown) rather than locked inside a database or page. That makes it:

- **Portable** - any tool can read it; nothing is tied to our website.
- **Shareable** - educators and partners can reuse the myth/truth pairs.
- **Reviewable** - every change is a Git diff with a clear history and sources.

The Next.js app in `../web` reads these files at **build time** and renders them.

## Structure

```
knowledge/
  schema/        JSON Schemas describing each content type
  myths/         one JSON file per myth → truth pair (powers the easter eggs)
  stereotypes/   (reserved) broader stereotype entries
  team/          one JSON file per team member  → About page
  jobs/          one JSON file per job listing   → Join page
  blog/          one Markdown file per article    → Blog
  fundraising/   case for support, funder map, readiness, budget, pipeline (not read by the site)
```

## Fundraising

The [fundraising kit](fundraising/README.md) is the source for every proposal, pitch and appeal. Start with its README.

## How a myth becomes an easter egg

Each entry in `myths/` carries both the **myth** and its **truth**:

1. The myth is drawn on the canvas as a doodle/sticker (`doodle` field).
2. The visitor switches their cursor to **Unlearn** and erases the myth.
3. They switch to **Relearn** and scribble - which reveals the entry's `truth` and `explanation`.

So the brand values (Unlearn → Relearn) become something the visitor *does*, and the content drives the interaction.

## Content principles

- **Age-appropriate for kids.** Gender equality, emotions, leadership, and body-autonomy/consent framed for pre-teens. No explicit content.
- **Kind, not preachy.** Challenge the idea, never the child (see the brand voice in `../brand`).
- **Sourced.** Add a credible `sources` entry. Seed items below are marked `"placeholder": true` and their sources should be verified before publishing.

## Editing

- Add a myth: copy an existing file in `myths/`, give it a new `id` (`m-...`), validate against `schema/myth.schema.json`.
- Team, jobs, and the sample blog post are **placeholders** - replace with real content.
