import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

function getDsnParts(dsn: string): { host: string; projectId: string; pathname: string } | null {
  try {
    const u = new URL(dsn);
    const projectId = u.pathname.replace(/^\//, "");
    if (!projectId) return null;
    return { host: u.host, projectId, pathname: u.pathname };
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return new Response("no dsn", { status: 503 });

  const parts = getDsnParts(dsn);
  if (!parts) return new Response("bad dsn", { status: 500 });

  const envelope = await req.text();
  const firstLineEnd = envelope.indexOf("\n");
  if (firstLineEnd === -1) return new Response("bad envelope", { status: 400 });

  let header: { dsn?: string };
  try {
    header = JSON.parse(envelope.slice(0, firstLineEnd));
  } catch {
    return new Response("bad envelope header", { status: 400 });
  }

  const envelopeDsn = header.dsn;
  if (envelopeDsn && envelopeDsn !== dsn) {
    return new Response("dsn mismatch", { status: 400 });
  }

  const upstream = `https://${parts.host}/api/${parts.projectId}/envelope/`;
  const res = await fetch(upstream, {
    method: "POST",
    body: envelope,
    headers: { "Content-Type": "application/x-sentry-envelope" },
  });
  return new Response(null, { status: res.status });
}
