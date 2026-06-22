import { defineField, defineType } from "sanity";

export const blogPage = defineType({
  name: "blogPage",
  title: "Blog page",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Eyebrow",
          type: "string",
          description: "Small label above the headline (shared across audiences).",
        }),
        defineField({
          name: "headline",
          title: "Headline",
          type: "object",
          description: "Main hero headline (varies by audience).",
          fields: [
            defineField({
              name: "kid",
              title: "Kid",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "adult",
              title: "Adult",
              type: "string",
              validation: (r) => r.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "emptyState",
      title: "Empty state",
      type: "string",
      description: "Message shown when there are no blog posts (shared across audiences).",
    }),
  ],
  preview: { prepare: () => ({ title: "Blog page" }) },
});
