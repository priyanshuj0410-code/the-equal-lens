import { defineField, defineType } from "sanity";

export const teamMember = defineType({
  name: "teamMember",
  title: "Team member",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", title: "Role", type: "string", validation: (r) => r.required() }),
    defineField({ name: "pronouns", title: "Pronouns", type: "string" }),
    defineField({ name: "bio", title: "Bio", type: "text", rows: 4 }),
    defineField({
      name: "photo",
      title: "Photo (now)",
      description: "Current photo - the default in Adult mode, shown on hover in Kids mode.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "babyPhoto",
      title: "Baby photo",
      description: "Childhood photo - the default in Kids mode, shown on hover in Adult mode.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Used as the stable id. Generate from the name.",
      options: { source: "name", maxLength: 96 },
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
        defineField({ name: "twitter", title: "Twitter / X", type: "url" }),
        defineField({ name: "website", title: "Website", type: "url" }),
      ],
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
