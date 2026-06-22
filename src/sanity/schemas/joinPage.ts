import { defineField, defineType } from "sanity";

export const joinPage = defineType({
  name: "joinPage",
  title: "Join page",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Eyebrow",
          type: "string",
          description: "Small label above the headline (shared across audiences).",
        }),
        defineField({
          name: "headline",
          title: "Headline",
          type: "object",
          description: "Main hero headline, varies by audience.",
          fields: [
            defineField({ name: "kid", title: "Kid", type: "string", validation: (r) => r.required() }),
            defineField({ name: "adult", title: "Adult", type: "string", validation: (r) => r.required() }),
          ],
        }),
        defineField({
          name: "body",
          title: "Body",
          type: "object",
          description: "Hero supporting paragraph, varies by audience.",
          fields: [
            defineField({ name: "kid", title: "Kid", type: "text", validation: (r) => r.required() }),
            defineField({ name: "adult", title: "Adult", type: "text", validation: (r) => r.required() }),
          ],
        }),
      ],
    }),
    defineField({
      name: "openRolesHeading",
      title: "Open roles heading",
      type: "string",
      description: "Heading for the open roles section (shared).",
    }),
    defineField({
      name: "noOpenRolesFallback",
      title: "No open roles fallback",
      type: "text",
      description: "Message shown when there are no open jobs (shared).",
    }),
    defineField({
      name: "jobCardLabels",
      title: "Job card labels",
      type: "object",
      description: "Labels and CTA used on each job card (shared).",
      fields: [
        defineField({ name: "responsibilitiesLabel", title: "Responsibilities label", type: "string" }),
        defineField({ name: "requirementsLabel", title: "Requirements label", type: "string" }),
        defineField({ name: "applyCta", title: "Apply CTA", type: "string" }),
      ],
    }),
    defineField({
      name: "volunteerHeading",
      title: "Volunteer heading",
      type: "string",
      description: "Heading for the volunteer form section (shared).",
    }),
    defineField({
      name: "volunteerIntro",
      title: "Volunteer intro",
      type: "text",
      description: "Intro paragraph above the volunteer form (shared).",
    }),
  ],
  preview: { prepare: () => ({ title: "Join page" }) },
});
