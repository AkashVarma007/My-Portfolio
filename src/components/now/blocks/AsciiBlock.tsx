export function AsciiBlock({ art }: { art: string }) {
  return (
    <pre aria-hidden="true" className="now-block-ascii">
      {art}
    </pre>
  );
}
