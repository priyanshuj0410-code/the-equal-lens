import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

// `projectId` falls back to a placeholder so imports never throw before Sanity
// is configured. We only ever call `client.fetch` when `sanityEnabled` is true.
export const client = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});
