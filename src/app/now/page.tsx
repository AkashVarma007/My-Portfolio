import { fetchAllLogs } from "@/lib/sanity/queries";
import { NowHero } from "@/components/now/NowHero";
import { LogList } from "@/components/now/LogList";

export const dynamic = "force-static";

export default async function NowIndexPage() {
  const logs = await fetchAllLogs();
  const latestPublishedAt = logs[0]?.publishedAt ?? null;

  return (
    <>
      <NowHero logCount={logs.length} latestPublishedAt={latestPublishedAt} />
      <section className="now-feed">
        <LogList logs={logs} />
      </section>
    </>
  );
}
