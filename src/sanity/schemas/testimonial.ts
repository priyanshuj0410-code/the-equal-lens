import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "role",
      title: "Role / organisation",
      type: "string",
      description: "e.g. “Year 5 Teacher, Oakwood Primary” or “Head of People, Acme”.",
    }),
    defineField({
      name: "audience",
      title: "Audience",
      type: "string",
      description: "Which mode shows this testimonial.",
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
    defineField({
      name: "photo",
      title: "Photo (optional)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Stable id. Generate from the name.",
      options: { source: "name", maxLength: 96 },
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
  preview: { select: { title: "name", subtitle: "role", media: "photo" } },
});
