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
      normal: ({ children }) => <p>{children}</p>,
      h2: ({ children }) => <h2>{children}</h2>,
      h3: ({ children }) => <h3>{children}</h3>,
      blockquote: ({ children }) => <blockquote>{children}</blockquote>,
    },
    list: {
      bullet: ({ children }) => <ul>{children}</ul>,
      number: ({ children }) => <ol>{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => <li>{children}</li>,
      number: ({ children }) => <li>{children}</li>,
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
      code: ({ children }) => <code>{children}</code>,
      strong: ({ children }) => <strong>{children}</strong>,
      em: ({ children }) => <em>{children}</em>,
      link: ({ value, children }) => (
        <a
          href={value?.href}
          target={value?.blank ? "_blank" : undefined}
          rel={value?.blank ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
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

  return <PortableText value={body as unknown as never} components={components} />;
}
