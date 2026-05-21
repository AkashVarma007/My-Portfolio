import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";

type Credit = {
  name: string;
  author: string;
  url: string;
  license: string;
  use: string;
};

export const metadata = {
  title: "Lobby credits — Akash Varma",
  description: "Asset credits for The Lobby v0.",
  robots: { index: false, follow: false },
};

async function loadCredits(): Promise<Credit[]> {
  const file = path.join(process.cwd(), "public", "lobby", "credits.json");
  try {
    const raw = await fs.readFile(file, "utf8");
    const parsed = JSON.parse(raw) as { assets?: Credit[] };
    return parsed.assets ?? [];
  } catch {
    return [];
  }
}

export default async function LobbyCreditsPage() {
  const credits = await loadCredits();
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0E1A3A",
        color: "#FFFFFF",
        fontFamily: "VT323, monospace",
        padding: "32px 16px",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h1
          style={{
            fontFamily: "var(--font-press-start)",
            fontSize: 18,
            color: "#FFE9A8",
            marginBottom: 16,
          }}
        >
          The Lobby — Asset credits
        </h1>
        <p style={{ fontSize: 18, marginBottom: 24, opacity: 0.85 }}>
          All third-party assets used in The Lobby. Free + commercial-OK where
          required, attributed here even when not.
        </p>
        <ul style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {credits.map((c) => (
            <li
              key={c.name}
              style={{
                border: "2px solid #FFE9A8",
                padding: 12,
                background: "#1A2550",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-press-start)",
                  fontSize: 11,
                  color: "#FFE9A8",
                  marginBottom: 6,
                }}
              >
                {c.name}
              </h2>
              <p style={{ fontSize: 18 }}>
                <strong>Author:</strong> {c.author}
              </p>
              <p style={{ fontSize: 18 }}>
                <strong>Use:</strong> {c.use}
              </p>
              <p style={{ fontSize: 16, opacity: 0.85 }}>{c.license}</p>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#FF6B6B", fontSize: 16 }}
              >
                {c.url}
              </a>
            </li>
          ))}
        </ul>
        <Link
          href="/lobby"
          style={{
            display: "inline-block",
            marginTop: 24,
            color: "#FFE9A8",
            fontFamily: "var(--font-press-start)",
            fontSize: 10,
          }}
        >
          ← Back to the lobby
        </Link>
      </div>
    </main>
  );
}
