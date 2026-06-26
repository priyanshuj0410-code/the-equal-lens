import { defineField, defineType } from "sanity";

// Visitor answers collected from the Lensy popover. Created by the /api/lensy
// route (never edited by hand), so the type is read-only in Studio. Kept
// data-minimised: no name, email, IP, or any identifier — only which audience
// and question were shown plus the answer text.
export const lensyResponse = defineType({
  name: "lensyResponse",
  title: "Lensy response",
  type: "document",
  readOnly: true,
  fields: [
    defineField({ name: "audience", title: "Audience", type: "string" }),
    defineField({ name: "question", title: "Question shown", type: "string" }),
    defineField({ name: "questionBody", title: "Question detail", type: "text", rows: 2 }),
    defineField({ name: "answer", title: "Answer", type: "text", rows: 4 }),
    defineField({ name: "createdAt", title: "Submitted at", type: "datetime" }),
  ],
  orderings: [
    {
      name: "createdAtDesc",
      title: "Newest first",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { answer: "answer", audience: "audience", question: "question" },
    prepare: ({ answer, audience, question }) => ({
      title: answer || "(empty)",
      subtitle: [audience, question].filter(Boolean).join(" · "),
    }),
  },
});
