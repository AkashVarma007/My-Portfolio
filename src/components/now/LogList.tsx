import type { LogSummary } from "@/lib/sanity/types";

import { LogRow } from "./LogRow";
import { Reveal } from "./Reveal";

type Props = {
  logs: LogSummary[];
};

type Group = { label: string; items: LogSummary[] };

function groupLogs(logs: LogSummary[]): Group[] {
  const pinned = logs.filter((l) => l.pinned);
  const rest = logs.filter((l) => !l.pinned);

  const byYear = new Map<string, LogSummary[]>();
  for (const log of rest) {
    const year = new Date(log.publishedAt).getUTCFullYear().toString();
    const bucket = byYear.get(year);
    if (bucket) bucket.push(log);
    else byYear.set(year, [log]);
  }

  const groups: Group[] = [];
  if (pinned.length > 0) groups.push({ label: "pinned", items: pinned });

  const years = Array.from(byYear.keys()).sort((a, b) => Number(b) - Number(a));
  for (const year of years) {
    groups.push({ label: year, items: byYear.get(year) ?? [] });
  }
  return groups;
}

export function LogList({ logs }: Props) {
  if (logs.length === 0) {
    return (
      <div className="now-empty">
        <div className="now-empty__mark" aria-hidden="true">
          ◌
        </div>
        <p className="now-empty__msg">no signals yet — check back soon.</p>
      </div>
    );
  }

  const groups = groupLogs(logs);
  let delayCursor = 0;

  return (
    <div>
      {groups.map((group) => (
        <section key={group.label} aria-labelledby={`now-year-${group.label}`}>
          <h2
            id={`now-year-${group.label}`}
            className="now-year"
          >
            {group.label}
          </h2>
          {group.items.map((log) => {
            const delay = Math.min(delayCursor++ * 40, 320);
            return (
              <Reveal key={log._id} delay={delay}>
                <LogRow log={log} />
              </Reveal>
            );
          })}
        </section>
      ))}
    </div>
  );
}
