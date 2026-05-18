// src/app/now/page.tsx
import { fetchAllLogs } from "@/lib/sanity/queries";
import { HeroBanner } from "@/components/now/HeroBanner";
import { EmptyState } from "@/components/now/EmptyState";
import { LogCard } from "@/components/now/LogCard";

// Runtime note: ISR / on-demand revalidate is nodejs-only. Default runtime
// (nodejs) + tag-based fetch caching + webhook (/api/revalidate) keep the
// page fully static between publishes. No timed ISR.
export const dynamic = "force-static";

export default async function NowIndexPage() {
  const logs = await fetchAllLogs();
  const last = logs[0]?.publishedAt ?? null;

  return (
    <>
      <HeroBanner logCount={logs.length} lastPublishedAt={last} />

      {logs.length === 0 ? (
        <EmptyState />
      ) : (
        <section className="px-6 md:px-12 max-w-5xl mx-auto mt-16 mb-32 space-y-8">
          {logs.map((log) => (
            <LogCard key={log._id} log={log} />
          ))}
        </section>
      )}
    </>
  );
}
