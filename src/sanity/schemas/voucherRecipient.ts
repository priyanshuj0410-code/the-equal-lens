import { defineField, defineType } from "sanity";

// Participants eligible to view the event thank-you voucher. The /voucher page
// gates on a case-insensitive match of the registered email against these.
// Recipients must be PUBLISHED to be recognised.
export const voucherRecipient = defineType({
  name: "voucherRecipient",
  title: "Voucher recipient",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Registered email",
      type: "string",
      description: "The email the participant registered with (matched case-insensitively).",
      validation: (r) => r.required().email(),
    }),
    defineField({ name: "name", title: "Name", type: "string", description: "Optional - shown as a greeting on the voucher." }),
    defineField({ name: "event", title: "Event", type: "string", description: "Optional label for which event this voucher is for." }),
  ],
  orderings: [{ name: "email", title: "Email", by: [{ field: "email", direction: "asc" }] }],
  preview: { select: { title: "email", subtitle: "name" } },
});
