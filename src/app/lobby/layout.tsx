import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Lobby — Akash Varma",
  description:
    "A pixel-art hangout. Drop in, walk around, chat, throw snow. No score, no winning — just a room with other people.",
  robots: { index: false, follow: false },
};

export default function LobbyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
