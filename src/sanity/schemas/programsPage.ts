import { defineField, defineType } from "sanity";

const audienceObject = (
  name: string,
  title: string,
  kind: "string" | "text",
  description?: string,
  required?: boolean,
) => {
  // Branch on kind so defineField gets a concrete literal type (its overloads
  // can't resolve a "string" | "text" union).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const req = required ? { validation: (r: any) => r.required() } : {};
  const sub = (subName: "kid" | "adult", subTitle: string) =>
    kind === "text"
      ? defineField({ name: subName, title: subTitle, type: "text", ...req })
      : defineField({ name: subName, title: subTitle, type: "string", ...req });
  return defineField({
    name,
    title,
    type: "object",
    description,
    fields: [sub("kid", "Kid"), sub("adult", "Adult")],
  });
};

export const programsPage = defineType({
  name: "programsPage",
  title: "Programs page",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string", description: "Shared small label above the headline." }),
        audienceObject("headline", "Headline", "string", "Big hero headline.", true),
        audienceObject("body", "Body", "text", "Hero supporting paragraph.", true),
      ],
    }),
    defineField({
      name: "why",
      title: "Why choose us",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string", description: "Shared small label." }),
        audienceObject("title", "Title", "text", "Section heading."),
        audienceObject("sub", "Subtitle", "text", "Section sub-paragraph."),
      ],
    }),
    defineField({
      name: "oldWay",
      title: "Old way (the usual way)",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Label", type: "string", description: "Shared label, e.g. 'the usual way'." }),
        audienceObject("text", "Text", "text", "The crossed-out approach."),
        audienceObject("outcome", "Outcome", "text", "The disappointing result."),
      ],
    }),
    defineField({
      name: "newWay",
      title: "New way (the equal lens way)",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Label", type: "string", description: "Shared label, e.g. 'the equal lens way'." }),
        audienceObject("text", "Text", "text", "The Equal Lens approach."),
        audienceObject("outcome", "Outcome", "text", "The lasting result."),
      ],
    }),
    defineField({
      name: "features",
      title: "Feature cards",
      type: "array",
      description: "Four feature cards. Icon, color and tint are derived in code by index.",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", description: "Shared card title." }),
            audienceObject("body", "Body", "text", "Card body copy."),
          ],
          preview: { select: { title: "title" } },
        },
      ],
    }),
    defineField({
      name: "proof",
      title: "Proof chips",
      type: "object",
      description: "Short proof-point chips.",
      fields: [
        defineField({ name: "kid", title: "Kid", type: "array", of: [{ type: "string" }] }),
        defineField({ name: "adult", title: "Adult", type: "array", of: [{ type: "string" }] }),
      ],
    }),
    defineField({
      name: "cta",
      title: "Call to action",
      type: "object",
      fields: [
        audienceObject("title", "Title", "string", "CTA heading."),
        audienceObject("sub", "Subtitle", "text", "CTA supporting copy."),
        defineField({ name: "button", title: "Button label", type: "string", description: "Shared button text." }),
      ],
    }),
    defineField({
      name: "testimonials",
      title: "Testimonials section",
      type: "object",
      description: "Heading for the testimonials section. The quotes themselves are Testimonial documents.",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow (shared)", type: "string" }),
        defineField({ name: "heading", title: "Heading (shared)", type: "string" }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Programs page" }) },
});
