import { defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        defineField({
          name: "tag",
          title: "Tag (shared)",
          type: "string",
          description: "Small eyebrow above the headline. Shown to all audiences.",
        }),
        defineField({
          name: "headline",
          title: "Headline",
          type: "object",
          description:
            "Headline split into three parts. The highlight word is rendered with a hand-drawn underline.",
          fields: [
            defineField({
              name: "kid",
              title: "Kid",
              type: "object",
              fields: [
                defineField({ name: "title", title: "Title (before highlight)", type: "string", validation: (r) => r.required() }),
                defineField({ name: "highlight", title: "Highlight word", type: "string", validation: (r) => r.required() }),
                defineField({ name: "titleEnd", title: "Title end (after highlight)", type: "string", validation: (r) => r.required() }),
              ],
            }),
            defineField({
              name: "adult",
              title: "Adult",
              type: "object",
              fields: [
                defineField({ name: "title", title: "Title (before highlight)", type: "string", validation: (r) => r.required() }),
                defineField({ name: "highlight", title: "Highlight word", type: "string", validation: (r) => r.required() }),
                defineField({ name: "titleEnd", title: "Title end (after highlight)", type: "string", validation: (r) => r.required() }),
              ],
            }),
          ],
        }),
        defineField({
          name: "body",
          title: "Body",
          type: "object",
          description: "Hero paragraph under the headline.",
          fields: [
            defineField({ name: "kid", title: "Kid", type: "text", validation: (r) => r.required() }),
            defineField({ name: "adult", title: "Adult", type: "text", validation: (r) => r.required() }),
          ],
        }),
        defineField({
          name: "psstDo",
          title: "Psst verb",
          type: "object",
          description:
            "The verb in the playful line: “grab UN or RE from the toolbar below and {verb} right on this page.”",
          fields: [
            defineField({ name: "kid", title: "Kid", type: "string" }),
            defineField({ name: "adult", title: "Adult", type: "string" }),
          ],
        }),
        defineField({
          name: "ctaButtons",
          title: "CTA buttons (shared)",
          type: "array",
          description: "Hero call-to-action buttons.",
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "label", title: "Label", type: "string" }),
                defineField({ name: "href", title: "Href (app route)", type: "string" }),
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "stats",
      title: "Stats section",
      type: "object",
      fields: [
        defineField({ name: "heading", title: "Heading (shared)", type: "string" }),
        defineField({
          name: "sub",
          title: "Sub",
          type: "object",
          fields: [
            defineField({ name: "kid", title: "Kid", type: "text" }),
            defineField({ name: "adult", title: "Adult", type: "text" }),
          ],
        }),
        defineField({
          name: "items",
          title: "Items",
          type: "object",
          description: "Stat cards per audience.",
          fields: [
            defineField({
              name: "kid",
              title: "Kid",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({ name: "n", title: "Number / phrase", type: "string" }),
                    defineField({ name: "cap", title: "Caption", type: "string" }),
                  ],
                },
              ],
            }),
            defineField({
              name: "adult",
              title: "Adult",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({ name: "n", title: "Number / phrase", type: "string" }),
                    defineField({ name: "cap", title: "Caption", type: "string" }),
                  ],
                },
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "bias",
      title: "Bias section",
      type: "object",
      description: "Section heading + sub only. Channel copy lives in the BiasChannels component.",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "object",
          fields: [
            defineField({ name: "kid", title: "Kid", type: "string" }),
            defineField({ name: "adult", title: "Adult", type: "string" }),
          ],
        }),
        defineField({
          name: "sub",
          title: "Sub",
          type: "object",
          fields: [
            defineField({ name: "kid", title: "Kid", type: "text" }),
            defineField({ name: "adult", title: "Adult", type: "text" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "loop",
      title: "Loop section",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow (shared)", type: "string" }),
        defineField({ name: "heading", title: "Heading (shared)", type: "string" }),
        defineField({
          name: "items",
          title: "Items",
          type: "object",
          description: "The four loop steps per audience. Step number derives from order.",
          fields: [
            defineField({
              name: "kid",
              title: "Kid",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({ name: "step", title: "Step", type: "string" }),
                    defineField({ name: "body", title: "Body", type: "text" }),
                  ],
                },
              ],
            }),
            defineField({
              name: "adult",
              title: "Adult",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({ name: "step", title: "Step", type: "string" }),
                    defineField({ name: "body", title: "Body", type: "text" }),
                  ],
                },
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "cta",
      title: "CTA section",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "object",
          fields: [
            defineField({ name: "kid", title: "Kid", type: "string" }),
            defineField({ name: "adult", title: "Adult", type: "string" }),
          ],
        }),
        defineField({
          name: "sub",
          title: "Sub",
          type: "object",
          fields: [
            defineField({ name: "kid", title: "Kid", type: "text" }),
            defineField({ name: "adult", title: "Adult", type: "text" }),
          ],
        }),
        defineField({
          name: "buttons",
          title: "Buttons (shared)",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "label", title: "Label", type: "string" }),
                defineField({ name: "href", title: "Href (app route)", type: "string" }),
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "testimonials",
      title: "Testimonials section",
      type: "object",
      description: "Heading for the testimonials strip. The quotes themselves are Testimonial documents.",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow (shared)", type: "string" }),
        defineField({ name: "heading", title: "Heading (shared)", type: "string" }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Home page" }) },
});
