// src/components/now/blocks/CodeBlock.tsx
export function CodeBlock({
  code,
  language,
}: {
  code: string;
  language?: string;
}) {
  return (
    <div className="now-scan-card my-6">
      {language ? (
        <div className="px-4 pt-3 font-[var(--font-mono)] text-[10px] text-[color:var(--now-dim)] uppercase tracking-wider">
          {language}
        </div>
      ) : null}
      <pre className="font-[var(--font-mono)] text-[12px] md:text-sm p-4 md:p-5 whitespace-pre-wrap text-[color:var(--now-fg)]">
        {code}
      </pre>
    </div>
  );
}
