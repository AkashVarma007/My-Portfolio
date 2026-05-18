// src/lib/sanity/queries.ts
import { groq } from "next-sanity";

import { sanityClient } from "./client";
import type { LogDetail, LogNeighbor, LogSummary } from "./types";

const SUMMARY_FIELDS = groq`
  _id,
  id,
  publishedAt,
  title,
  "slug": slug.current,
  tags,
  priority,
  location,
  excerpt,
  pinned
`;

const allLogsQuery = groq`
  *[_type == "log"] | order(pinned desc, publishedAt desc) {
    ${SUMMARY_FIELDS}
  }
`;

const logBySlugQuery = groq`
  *[_type == "log" && slug.current == $slug][0] {
    ${SUMMARY_FIELDS},
    body,
    clueId
  }
`;

const prevLogQuery = groq`
  *[_type == "log" && publishedAt < $publishedAt] | order(publishedAt desc)[0] {
    id, title, "slug": slug.current
  }
`;

const nextLogQuery = groq`
  *[_type == "log" && publishedAt > $publishedAt] | order(publishedAt asc)[0] {
    id, title, "slug": slug.current
  }
`;

const slugsQuery = groq`
  *[_type == "log" && defined(slug.current)][].slug.current
`;

export async function fetchAllLogs(): Promise<LogSummary[]> {
  return sanityClient.fetch(allLogsQuery, {}, { next: { tags: ["logs"] } });
}

export async function fetchLogBySlug(slug: string): Promise<LogDetail | null> {
  return sanityClient.fetch(
    logBySlugQuery,
    { slug },
    { next: { tags: ["logs", `log:${slug}`] } }
  );
}

export async function fetchPrevNext(publishedAt: string): Promise<{
  prev: LogNeighbor;
  next: LogNeighbor;
}> {
  const [prev, next] = await Promise.all([
    sanityClient.fetch<LogNeighbor>(prevLogQuery, { publishedAt }),
    sanityClient.fetch<LogNeighbor>(nextLogQuery, { publishedAt }),
  ]);
  return { prev, next };
}

export async function fetchAllSlugs(): Promise<string[]> {
  return sanityClient.fetch(slugsQuery);
}
