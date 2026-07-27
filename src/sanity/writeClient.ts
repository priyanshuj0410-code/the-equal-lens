import "server-only";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

// Server-only client for writing visitor-submitted content (Lensy responses).
// Uses a token with create permission - must never reach the browser, hence
// the `server-only` import guard. Writes stay disabled until SANITY_WRITE_TOKEN
// is set, so the feature no-ops safely before it is configured.
const token = process.env.SANITY_WRITE_TOKEN || "";

export const sanityWriteEnabled = Boolean(projectId && token);

export const writeClient = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  useCdn: false,
  token,
});
