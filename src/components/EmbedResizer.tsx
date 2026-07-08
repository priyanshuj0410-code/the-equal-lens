"use client";

import { useEffect } from "react";

// Listens for height reports from sandboxed blog embeds (see portableText.ts)
// and sizes each iframe to fit its content. Renders nothing.
export default function EmbedResizer() {
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      const data = e.data as { type?: string; height?: number } | null;
      if (!data || data.type !== "tel-embed-height" || typeof data.height !== "number") return;
      const frames = document.querySelectorAll<HTMLIFrameElement>("iframe.tel-embed-frame");
      frames.forEach((frame) => {
        if (frame.contentWindow === e.source) {
          frame.style.height = `${Math.max(120, Math.ceil(data.height!) + 4)}px`;
        }
      });
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return null;
}
