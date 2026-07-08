import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Blog post",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "audience",
      title: "Audience",
      type: "string",
      description: "Which version of the site this post shows on.",
      options: {
        list: [
          { title: "Kids", value: "kid" },
          { title: "Adult", value: "adult" },
        ],
        layout: "radio",
      },
      initialValue: "kid",
      validation: (r) => r.required(),
    }),
    defineField({ name: "date", title: "Date", type: "date", validation: (r) => r.required() }),
    defineField({ name: "author", title: "Author", type: "string", initialValue: "The Equal Lens" }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 2 }),
    defineField({
      name: "cover",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "carousel",
      title: "Carousel",
      description: "Optional image carousel shown at the top of the post, right after the heading and before the body.",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string", description: "Describes the image for screen readers." }),
            defineField({ name: "caption", title: "Caption", type: "string", description: "Optional caption shown under the image." }),
          ],
        },
      ],
      options: { layout: "grid" },
    }),
    defineField({ name: "tags", title: "Tags", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true } },
        {
          type: "object",
          name: "htmlEmbed",
          title: "Interactive embed",
          fields: [
            defineField({
              name: "code",
              title: "HTML / code",
              type: "text",
              rows: 14,
              description:
                "Self-contained interactive HTML (may include <style> and <script>). It runs sandboxed in an isolated frame, so keep everything inline and self-contained.",
              validation: (r) => r.required(),
            }),
            defineField({ name: "caption", title: "Caption", type: "string", description: "Optional caption shown under the embed." }),
            defineField({
              name: "height",
              title: "Initial height (px)",
              type: "number",
              description: "Fallback height until the embed reports its own size. Defaults to 480.",
            }),
          ],
          preview: {
            select: { caption: "caption" },
            prepare: ({ caption }: { caption?: string }) => ({
              title: caption || "Interactive embed",
              subtitle: "Interactive HTML embed",
            }),
          },
        },
      ],
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Published", value: "published" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
      validation: (r) => r.required(),
    }),
  ],
  orderings: [{ name: "date", title: "Newest", by: [{ field: "date", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "audience", media: "cover" } },
});
