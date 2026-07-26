import { defineField, defineType } from "sanity";

// Workshop-facilitator registrations, created by the /api/facilitator route
// (never edited by hand), so the type is read-only in Studio. Capacity per
// weekend-day slot is enforced server-side in that route.
export const facilitatorApplication = defineType({
  name: "facilitatorApplication",
  title: "Facilitator application",
  type: "document",
  readOnly: true,
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "age", title: "Age", type: "number" }),
    defineField({ name: "sexAssignedAtBirth", title: "Sex assigned at birth", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
    defineField({ name: "why", title: "Why they want to volunteer", type: "text", rows: 4 }),
    defineField({ name: "slotId", title: "Preferred day (id)", type: "string" }),
    defineField({ name: "slotLabel", title: "Preferred day", type: "string" }),
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
    select: { name: "name", slot: "slotLabel", email: "email" },
    prepare: ({ name, slot, email }) => ({
      title: name || "(no name)",
      subtitle: [slot, email].filter(Boolean).join(" · "),
    }),
  },
});
