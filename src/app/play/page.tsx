import type { Metadata } from "next";
import { getMyths } from "@/lib/knowledge";
import PlayClient from "./PlayClient";

export const metadata: Metadata = {
  title: "Myth Buster - Surface Quest",
  description:
    "Pull a face. Bust a myth. Keep the clip. The Equal Lens face game, right in your browser.",
};

export default function PlayPage() {
  // Kid myths only, same content the Android app draws from.
  const myths = getMyths().filter((m) => (m.audience ?? "kid") === "kid" && m.id.startsWith("m-"));
  return <PlayClient myths={myths} />;
}
