// sanity/schemas/log.ts
import { defineType, defineField, defineArrayMember } from "sanity";

export const log = defineType({
  name: "log",
  title: "Log",
  type: "document",
  fields: [
    defineField({
      name: "id",
      title: "Log ID (number)",
      type: "number",
      validation: (r) => r.required().integer().positive(),
      description: "Auto-incremented integer. Rendered as LOG-NNN, padded.",
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "BUILD", value: "BUILD" },
          { title: "LEARN", value: "LEARN" },
          { title: "READ", value: "READ" },
          { title: "LIFE", value: "LIFE" },
          { title: "SHIP", value: "SHIP" },
          { title: "DRIFT", value: "DRIFT" },
          { title: "SIGNAL", value: "SIGNAL" },
        ],
        layout: "tags",
      },
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "priority",
      title: "Priority",
      type: "string",
      options: {
        list: [
          { title: "NORMAL", value: "NORMAL" },
          { title: "HIGH", value: "HIGH" },
          { title: "CLASSIFIED", value: "CLASSIFIED" },
        ],
        layout: "radio",
      },
      initialValue: "NORMAL",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "location",
      title: "Origin (geo stamp)",
      type: "string",
      description: 'Optional. e.g. "GRID 47.3N".',
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt (index preview)",
      type: "text",
      rows: 3,
      validation: (r) => r.required().max(240),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Code", value: "code" },
            ],
            annotations: [
              {
                name: "redacted",
                type: "object",
                title: "Redacted",
                fields: [
                  { name: "isClue", type: "boolean", title: "Hunt clue trigger" },
                  { name: "payload", type: "string", title: "Hidden payload text" },
                ],
              },
              {
                name: "glitch",
                type: "object",
                title: "Glitch",
                fields: [{ name: "label", type: "string" }],
              },
              {
                name: "signalChip",
                type: "object",
                title: "Signal chip",
                fields: [{ name: "label", type: "string" }],
              },
            ],
          },
        }),
        defineArrayMember({
          type: "object",
          name: "terminalBlock",
          title: "Terminal block",
          fields: [{ name: "lines", type: "text", rows: 6, title: "Lines" }],
        }),
        defineArrayMember({
          type: "object",
          name: "asciiBlock",
          title: "ASCII art",
          fields: [{ name: "art", type: "text", rows: 8 }],
        }),
        defineArrayMember({
          type: "object",
          name: "transmissionBlock",
          title: "Transmission quote",
          fields: [{ name: "body", type: "text", rows: 4 }],
        }),
        defineArrayMember({
          type: "object",
          name: "codeBlock",
          title: "Code",
          fields: [
            { name: "language", type: "string" },
            { name: "code", type: "text", rows: 8 },
          ],
        }),
        defineArrayMember({
          type: "image",
          name: "imageBlock",
          title: "Image",
          options: { hotspot: true },
          fields: [
            { name: "alt", type: "string", title: "Alt text" },
            { name: "caption", type: "string", title: "Caption" },
          ],
        }),
      ],
    }),
    defineField({
      name: "pinned",
      title: "Pinned",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "clueId",
      title: "Hunt clue ID",
      type: "number",
      description: "Optional. If set, the log hosts a hunt clue.",
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      id: "id",
      title: "title",
      priority: "priority",
      publishedAt: "publishedAt",
    },
    prepare({ id, title, priority, publishedAt }) {
      const idPart = id ? `LOG-${String(id).padStart(3, "0")}` : "LOG-???";
      const date = publishedAt
        ? new Date(publishedAt).toISOString().slice(0, 10)
        : "—";
      const prio = priority ? ` [${priority}]` : "";
      return { title: `${idPart} · ${title || "untitled"}`, subtitle: `${date}${prio}` };
    },
  },
});
