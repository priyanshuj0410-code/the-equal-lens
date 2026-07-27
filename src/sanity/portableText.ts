import type { PortableTextHtmlComponents } from "@portabletext/to-html";
import { urlFor } from "./image";

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeAttr(s: string) {
  return escapeHtml(s).replace(/"/g, "&quot;");
}

// Injected into every embed so the frame reports its rendered height back to
// the page (EmbedResizer listens and sizes the iframe to fit).
const HEIGHT_REPORTER =
  "<script>(function(){function p(){try{parent.postMessage({type:'tel-embed-height',height:Math.ceil(document.documentElement.scrollHeight)},'*')}catch(e){}}window.addEventListener('load',p);window.addEventListener('resize',p);if(window.ResizeObserver){try{new ResizeObserver(p).observe(document.body)}catch(e){}}setTimeout(p,250);setTimeout(p,1200)})();</script>";

// serializers for converting a post's Portable Text body to an HTML string
// (keeps the existing blog page, which renders post.html, unchanged)
export const ptComponents: Partial<PortableTextHtmlComponents> = {
  types: {
    image: ({ value }) => {
      const v = value as { asset?: { _ref?: string }; alt?: string };
      if (!v.asset?._ref) return "";
      const url = urlFor(value as Parameters<typeof urlFor>[0])
        .width(1000)
        .fit("max")
        .auto("format")
        .url();
      return `<img src="${url}" alt="${v.alt ?? ""}" loading="lazy" />`;
    },
    // Author-provided interactive HTML, rendered in a sandboxed iframe. The
    // sandbox has allow-scripts only (no allow-same-origin), so the embed's JS
    // runs but is fully isolated from the page - safe for arbitrary HTML.
    htmlEmbed: ({ value }) => {
      const v = value as { code?: string; caption?: string; height?: number };
      if (!v.code) return "";
      const height = v.height && v.height > 0 ? v.height : 480;
      const srcdoc = (v.code + HEIGHT_REPORTER)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;");
      const caption = v.caption
        ? `<figcaption class="tel-embed-cap">${escapeHtml(v.caption)}</figcaption>`
        : "";
      return `<figure class="tel-embed" style="margin:1.75rem 0"><iframe class="tel-embed-frame" sandbox="allow-scripts allow-popups" loading="lazy" title="${escapeAttr(
        v.caption || "Interactive visualisation",
      )}" style="width:100%;height:${height}px;border:2px solid var(--color-ink);border-radius:1rem;background:#fff;display:block" srcdoc="${srcdoc}"></iframe>${caption}</figure>`;
    },
  },
};
