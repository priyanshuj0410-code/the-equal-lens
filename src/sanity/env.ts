// Sanity connection config, read from env. Until a project id is set,
// `sanityEnabled` is false and the site falls back to the in-repo file-based
// content (knowledge/), so nothing breaks before Sanity is wired up.
// NEXT_PUBLIC_* powers the Next.js app; SANITY_STUDIO_* is the fallback the
// standalone Sanity Studio CLI understands.
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || "";
export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || "production";
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  process.env.SANITY_STUDIO_API_VERSION ||
  "2024-10-01";

export const sanityEnabled = projectId.length > 0;
