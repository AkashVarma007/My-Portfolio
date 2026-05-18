export function CodeBlock({
  code,
  language,
}: {
  code: string;
  language?: string;
}) {
  return (
    <pre className="now-block-code" data-lang={language ?? undefined}>
      {language ? (
        <span className="now-block-code__lang" aria-hidden="true">
          {language}
        </span>
      ) : null}
      <code>{code}</code>
    </pre>
  );
}
