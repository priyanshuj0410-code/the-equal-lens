import { defineField, defineType } from "sanity";

export const job = defineType({
  name: "job",
  title: "Job",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Full-time", value: "full-time" },
          { title: "Part-time", value: "part-time" },
          { title: "Internship", value: "internship" },
          { title: "Contract", value: "contract" },
          { title: "Volunteer", value: "volunteer" },
        ],
        layout: "radio",
      },
      initialValue: "part-time",
    }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "remote", title: "Remote", type: "boolean", initialValue: true }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 3 }),
    defineField({
      name: "responsibilities",
      title: "What you'll do",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "requirements",
      title: "What we look for",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "compensation", title: "Compensation", type: "string" }),
    defineField({ name: "applyEmail", title: "Apply email", type: "string" }),
    defineField({ name: "postedDate", title: "Posted date", type: "date" }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Open", value: "open" },
          { title: "Closed", value: "closed" },
        ],
        layout: "radio",
      },
      initialValue: "open",
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: "title", subtitle: "type" } },
});
