import { defineField, defineType } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact page",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({
          name: "headline",
          title: "Headline",
          type: "string",
          validation: (r) => r.required(),
        }),
        defineField({
          name: "body",
          title: "Body",
          description: "Intro paragraph. Varies by audience.",
          type: "object",
          validation: (r) => r.required(),
          fields: [
            defineField({ name: "kid", title: "Kid", type: "text", rows: 3 }),
            defineField({ name: "adult", title: "Adult", type: "text", rows: 3 }),
          ],
        }),
      ],
    }),
    defineField({
      name: "sayHelloHeading",
      title: "“Say hello” heading",
      type: "string",
    }),
    defineField({ name: "emailLabel", title: "Email label", type: "string" }),
    defineField({
      name: "emailAddress",
      title: "Email address",
      description: "Used as both the visible text and the mailto: link.",
      type: "string",
    }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({
      name: "sendMessageHeading",
      title: "“Send a message” heading",
      type: "string",
    }),
  ],
  preview: { prepare: () => ({ title: "Contact page" }) },
});
