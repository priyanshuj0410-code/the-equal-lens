import { defineField, defineType } from "sanity";

export const gamesPage = defineType({
  name: "gamesPage",
  title: "Games page",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "eyebrow",
          title: "Eyebrow",
          type: "string",
          description: "Small label above the headline. Shared across audiences.",
        }),
        defineField({
          name: "headline",
          title: "Headline",
          type: "object",
          description: "Main hero heading. Varies by audience.",
          fields: [
            defineField({ name: "kid", title: "Kids", type: "string", validation: (r) => r.required() }),
            defineField({ name: "adult", title: "Adults", type: "string", validation: (r) => r.required() }),
          ],
        }),
        defineField({
          name: "body",
          title: "Body",
          type: "object",
          description: "Intro paragraph under the headline. Varies by audience.",
          fields: [
            defineField({ name: "kid", title: "Kids", type: "text", rows: 3, validation: (r) => r.required() }),
            defineField({ name: "adult", title: "Adults", type: "text", rows: 3, validation: (r) => r.required() }),
          ],
        }),
      ],
    }),
    defineField({
      name: "items",
      title: "Game cards",
      type: "object",
      description: "The game preview cards. Varies by audience.",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "kid",
          title: "Kids",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "name", title: "Name", type: "string" }),
                defineField({ name: "blurb", title: "Blurb", type: "text", rows: 3 }),
              ],
              preview: { select: { title: "name", subtitle: "blurb" } },
            },
          ],
        }),
        defineField({
          name: "adult",
          title: "Adults",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "name", title: "Name", type: "string" }),
                defineField({ name: "blurb", title: "Blurb", type: "text", rows: 3 }),
              ],
              preview: { select: { title: "name", subtitle: "blurb" } },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "badge",
      title: "Card badge",
      type: "string",
      description: 'The small badge on each card (e.g. "coming soon"). Shared across audiences.',
    }),
  ],
  preview: { prepare: () => ({ title: "Games page" }) },
});
