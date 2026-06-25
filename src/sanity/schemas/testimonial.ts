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
      description: "Optional. Max 160 characters — longer quotes are truncated. Leave empty for a photo-only gallery item.",
      validation: (r) => r.max(160),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Optional. Full name of the person. Leave empty for a photo-only gallery item.",
    }),
    defineField({
      name: "role",
      title: "Role / organisation",
      type: "string",
      description: "e.g. Year 5 Teacher, Oakwood Primary or Head of People, Acme.",
    }),
    defineField({
      name: "audience",
      title: "Audience",
      type: "string",
      description: "Which toggle mode shows this testimonial.",
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
      title: "Workshop photo",
      type: "image",
      description: "Photo from the workshop session — shown as the polaroid image.",
      options: { hotspot: true },
    }),
    defineField({
      name: "tag",
      title: "Polaroid caption",
      type: "string",
      description: "Handwritten label on the polaroid strip, e.g. Workshop Day, 2024 or School Visit, Feb 25.",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Stable ID — generate from the name.",
      options: { source: "name", maxLength: 96 },
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first in the carousel. Up to 10 shown per audience.",
    }),
  ],
  orderings: [
    { name: "order", title: "Display order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { name: "name", role: "role", tag: "tag", media: "photo" },
    prepare: ({ name, role, tag, media }) => ({
      title: name || tag || "Photo-only item",
      subtitle: role,
      media,
    }),
  },
});
