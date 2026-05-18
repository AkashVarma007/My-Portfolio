// src/lib/sanity/types.ts
export type LogTag =
  | "BUILD"
  | "LEARN"
  | "READ"
  | "LIFE"
  | "SHIP"
  | "DRIFT"
  | "SIGNAL";

export type LogPriority = "NORMAL" | "HIGH" | "CLASSIFIED";

export type PortableTextSpan = {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
};

export type RedactedAnnotation = {
  _type: "redacted";
  _key: string;
  isClue?: boolean;
  payload?: string;
};

export type GlitchAnnotation = {
  _type: "glitch";
  _key: string;
  label?: string;
};

export type SignalChipAnnotation = {
  _type: "signalChip";
  _key: string;
  label?: string;
};

export type LogBodyBlock =
  | {
      _type: "block";
      _key: string;
      style?: string;
      children: PortableTextSpan[];
      markDefs: (RedactedAnnotation | GlitchAnnotation | SignalChipAnnotation)[];
    }
  | { _type: "terminalBlock"; _key: string; lines: string }
  | { _type: "asciiBlock"; _key: string; art: string }
  | { _type: "transmissionBlock"; _key: string; body: string }
  | { _type: "codeBlock"; _key: string; language?: string; code: string }
  | {
      _type: "imageBlock";
      _key: string;
      asset: { _ref: string };
      alt?: string;
      caption?: string;
    };

export type LogSummary = {
  _id: string;
  id: number;
  publishedAt: string;
  title: string;
  slug: string;
  tags: LogTag[];
  priority: LogPriority;
  location?: string;
  excerpt: string;
  pinned: boolean;
};

export type LogDetail = LogSummary & {
  body: LogBodyBlock[];
  clueId?: number;
};

export type LogNeighbor = { id: number; title: string; slug: string } | null;
