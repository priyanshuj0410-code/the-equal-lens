# The Equal Lens

Playful, interactive fairness education for kids - helping them **unlearn bias and relearn empathy** through play.

This repository holds the redesigned website and the open knowledge base that powers it.

## Structure

- **Next.js (App Router) + TypeScript + Tailwind** app at the repo root (`src/`, `public/`), deployed on Vercel.
- **`knowledge/`** - [Open-Knowledge-Format](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing/)-aligned content (myths, team, jobs, blog). The single source of truth, read at build time. See [`knowledge/README.md`](knowledge/README.md).
- **`brand/`** - brand guidelines (PDF + HTML source) and logo assets.

## Develop

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # production build
```

## The core interaction

The site is a canvas seeded with myth "easter eggs". Switch your cursor to **Unlearn** to erase a myth, then **Relearn** to scribble in its truth. Each myth → truth pair lives in `knowledge/myths/`, so the content drives the interaction.

## Roadmap

- **Phase 0 (done):** scaffold, brand tokens, knowledge base, deploy pipeline.
- **Phase 1:** pages wired to the KB - About (vision/mission/values/team), Blog, Join (volunteer + jobs).
- **Phase 2:** the canvas / Unlearn-Relearn cursor / easter-egg engine, with mobile + accessibility fallbacks.
- **Phase 3:** games reskin and polish.

Unlearn. Relearn. Grow.
