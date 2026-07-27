import { defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string", description: "Small label above the headline (shared)." }),
        defineField({
          name: "headline",
          title: "Headline",
          type: "object",
          description: "Main hero headline. Varies by audience.",
          validation: (r) => r.required(),
          fields: [
            defineField({ name: "kid", title: "Kids", type: "string" }),
            defineField({ name: "adult", title: "Adults", type: "string" }),
          ],
        }),
        defineField({
          name: "body",
          title: "Body",
          type: "object",
          description: "Hero supporting paragraph. Varies by audience.",
          validation: (r) => r.required(),
          fields: [
            defineField({ name: "kid", title: "Kids", type: "text", rows: 3 }),
            defineField({ name: "adult", title: "Adults", type: "text", rows: 3 }),
          ],
        }),
      ],
    }),
    defineField({
      name: "narrative",
      title: "Narrative",
      type: "object",
      description: "Paragraph below the hero. Varies by audience.",
      fields: [
        defineField({ name: "kid", title: "Kids", type: "text", rows: 4 }),
        defineField({ name: "adult", title: "Adults", type: "text", rows: 4 }),
      ],
    }),
    defineField({
      name: "vision",
      title: "Vision",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string", description: "Section label (shared)." }),
        defineField({
          name: "body",
          title: "Body",
          type: "object",
          description: "Vision statement. Varies by audience.",
          fields: [
            defineField({ name: "kid", title: "Kids", type: "text", rows: 3 }),
            defineField({ name: "adult", title: "Adults", type: "text", rows: 3 }),
          ],
        }),
      ],
    }),
    defineField({
      name: "mission",
      title: "Mission",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string", description: "Section label (shared)." }),
        defineField({
          name: "body",
          title: "Body",
          type: "object",
          description: "Mission statement. Varies by audience.",
          fields: [
            defineField({ name: "kid", title: "Kids", type: "text", rows: 3 }),
            defineField({ name: "adult", title: "Adults", type: "text", rows: 3 }),
          ],
        }),
      ],
    }),
    defineField({
      name: "coreValues",
      title: "Core values",
      type: "object",
      fields: [
        defineField({ name: "sectionEyebrow", title: "Section eyebrow", type: "string", description: "Section label (shared)." }),
        defineField({ name: "sectionHeading", title: "Section heading", type: "string", description: "Section heading (shared)." }),
        defineField({
          name: "items",
          title: "Value cards",
          type: "array",
          description: "The Unlearn / Relearn cards. Card colour is derived in the layout.",
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "tag", title: "Tag", type: "string", description: "Short badge, e.g. UN / RE." }),
                defineField({ name: "name", title: "Name", type: "string" }),
                defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "team",
      title: "Team section",
      type: "object",
      description: "Section copy only - team cards come from Team member documents.",
      fields: [
        defineField({ name: "sectionEyebrow", title: "Section eyebrow", type: "string", description: "Section label (shared)." }),
        defineField({ name: "sectionHeading", title: "Section heading", type: "string", description: "Section heading (shared)." }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "About page" }) },
});
