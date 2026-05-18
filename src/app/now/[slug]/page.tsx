// src/app/now/[slug]/page.tsx
import { notFound } from "next/navigation";

import {
  fetchAllSlugs,
  fetchLogBySlug,
  fetchPrevNext,
} from "@/lib/sanity/queries";
import { LogHeader } from "@/components/now/LogHeader";
import { LogTitle } from "@/components/now/LogTitle";
import { LogBody } from "@/components/now/LogBody";
import { FooterNav } from "@/components/now/FooterNav";
import { DecryptShell } from "@/components/now/DecryptShell";

// Runtime note: ISR / on-demand revalidate is nodejs-only. Default runtime
// (nodejs) + generateStaticParams pre-renders every slug at build time;
// webhook (/api/revalidate) busts cache on publish. No timed ISR.
export const dynamic = "force-static";

export async function generateStaticParams() {
  const slugs = await fetchAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function NowDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const log = await fetchLogBySlug(slug);
  if (!log) notFound();

  const { prev, next } = await fetchPrevNext(log.publishedAt);

  const content = (
    <article className="px-6 md:px-12 max-w-5xl mx-auto pt-24 md:pt-32 pb-24">
      <LogHeader log={log} />
      <div className="mt-12">
        <LogTitle title={log.title} />
        <div className="mt-8">
          <LogBody body={log.body ?? []} clueId={log.clueId} />
        </div>
      </div>
      <FooterNav prev={prev} next={next} />
    </article>
  );

  if (log.priority === "CLASSIFIED") {
    return <DecryptShell logId={log.id}>{content}</DecryptShell>;
  }
  return content;
}
