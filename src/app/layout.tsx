import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Self-hosted via @fontsource — zero Google network requests in dev
const outfit = localFont({
  src: "../../node_modules/@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2",
  variable: "--font-outfit",
  display: "swap",
});

const bricolage = localFont({
  src: "../../node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2",
  variable: "--font-bricolage",
  display: "swap",
});

const instrumentSerif = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-serif",
  display: "swap",
  preload: false,
});

const jetbrainsMono = localFont({
  src: "../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

const orbitron = localFont({
  src: "../../node_modules/@fontsource-variable/orbitron/files/orbitron-latin-wght-normal.woff2",
  variable: "--font-orbitron",
  display: "swap",
  preload: false,
});

const rajdhani = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource/rajdhani/files/rajdhani-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/rajdhani/files/rajdhani-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/rajdhani/files/rajdhani-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-rajdhani",
  display: "swap",
  preload: false,
});

const META_DESCRIPTION =
  "Full-stack developer building platform-level IoT systems — device-agnostic telemetry (HTTP + MQTT + WebSocket), custom DSL engines with runtime parsers, and Redis-routed distributed messaging. 4+ yrs shipping end-to-end at a 5-person startup. Hyderabad, India — open to remote.";

export const metadata: Metadata = {
  title: "Akash Varma — Full-Stack → Platform Engineer",
  description: META_DESCRIPTION,
  keywords: [
    "Akash Varma",
    "Full-stack developer",
    "Platform Engineer",
    "TypeScript",
    "Node.js",
    "React",
    "React Native",
    "MQTT",
    "WebSockets",
    "IoT",
    "OCPP 1.6J",
    "DSL",
    "Redis",
    "Next.js",
    "remote",
    "Hyderabad",
    "India",
  ],
  authors: [{ name: "Akash Varma" }],
  openGraph: {
    type: "website",
    title: "Akash Varma — Full-Stack → Platform Engineer",
    description: META_DESCRIPTION,
    siteName: "Akash Varma",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akash Varma — Full-Stack → Platform Engineer",
    description: META_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${bricolage.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${orbitron.variable} ${rajdhani.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
