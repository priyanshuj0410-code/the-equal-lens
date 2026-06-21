import type { PortableTextHtmlComponents } from "@portabletext/to-html";
import { urlFor } from "./image";

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
  },
};
