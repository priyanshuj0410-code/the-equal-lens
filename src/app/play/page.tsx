import type { Metadata } from "next";
import { getMyths } from "@/lib/knowledge";
import PlayClient from "./PlayClient";

export const metadata: Metadata = {
  title: "Surface Quest",
  description:
    "Pull a face. Bust a myth. Keep the clip. The Equal Lens face games, right in your browser.",
};

export default function PlayPage() {
  // Kid myths only, same content the Android app draws from. The id prefix is the
  // discriminator: the audience field says "kids" here and "kid" elsewhere in the codebase,
  // and a filter on it silently emptied the whole deck.
  const myths = getMyths().filter((m) => m.id.startsWith("m-"));
  return <PlayClient myths={myths} />;
}
