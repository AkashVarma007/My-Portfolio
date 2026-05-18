export function TerminalBlock({ lines }: { lines: string }) {
  return <pre className="now-block-terminal">{lines}</pre>;
}
