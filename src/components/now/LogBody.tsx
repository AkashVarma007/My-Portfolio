// src/components/now/LogBody.tsx
"use client";

import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { LogBodyBlock } from "@/lib/sanity/types";

import { RedactedSpan } from "./blocks/RedactedSpan";
import { GlitchSpan } from "./blocks/GlitchSpan";
import { TerminalBlock } from "./blocks/TerminalBlock";
import { AsciiBlock } from "./blocks/AsciiBlock";
import { TransmissionBlock } from "./blocks/TransmissionBlock";
import { SignalChip } from "./blocks/SignalChip";
import { CodeBlock } from "./blocks/CodeBlock";
import { ImageBlock } from "./blocks/ImageBlock";

type Props = { body: LogBodyBlock[]; clueId?: number };

export function LogBody({ body, clueId }: Props) {
  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => (
        <p className="my-4 text-base md:text-lg text-[color:var(--now-fg)]/90 leading-relaxed">
          {children}
        </p>
      ),
    },
    marks: {
      redacted: ({ value, children }) => (
        <RedactedSpan
          isClue={value?.isClue}
          payload={value?.payload}
          clueId={clueId}
        >
          {children}
        </RedactedSpan>
      ),
      glitch: ({ children }) => <GlitchSpan>{children}</GlitchSpan>,
      signalChip: ({ value, children }) => (
        <SignalChip label={value?.label}>{children}</SignalChip>
      ),
      code: ({ children }) => (
        <code className="font-[var(--font-mono)] text-[color:var(--now-accent)] px-1">
          {children}
        </code>
      ),
    },
    types: {
      terminalBlock: ({ value }) => <TerminalBlock lines={value.lines ?? ""} />,
      asciiBlock: ({ value }) => <AsciiBlock art={value.art ?? ""} />,
      transmissionBlock: ({ value }) => (
        <TransmissionBlock body={value.body ?? ""} />
      ),
      codeBlock: ({ value }) => (
        <CodeBlock code={value.code ?? ""} language={value.language} />
      ),
      imageBlock: ({ value }) => (
        <ImageBlock asset={value.asset} alt={value.alt} caption={value.caption} />
      ),
    },
  };

  return (
    <div className="max-w-[720px] mx-auto">
      <PortableText value={body as unknown as never} components={components} />
    </div>
  );
}
