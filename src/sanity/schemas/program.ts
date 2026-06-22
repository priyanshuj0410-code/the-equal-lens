import { defineField, defineType } from "sanity";

export const program = defineType({
  name: "program",
  title: "Program",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "audience",
      title: "Audience",
      type: "string",
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
    defineField({ name: "summary", title: "Summary", type: "text", rows: 3 }),
    defineField({
      name: "items",
      title: "What's included",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "icon",
      title: "Icon key",
      type: "string",
      description: "Icon name used by the page (e.g. school, users, globe, briefcase).",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Stable id. Generate from the title.",
      options: { source: "title", maxLength: 96 },
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Lower numbers appear first.",
    }),
  ],
  orderings: [
    { name: "order", title: "Display order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "title", subtitle: "audience" } },
});
