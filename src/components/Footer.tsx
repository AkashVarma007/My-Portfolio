export function Footer() {
  return (
    <footer className="border-t border-border px-6 md:px-12 py-8 relative z-[1]">
      <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="font-code text-[0.55rem] text-text-muted tracking-[3px]">
          AKASH VARMA &copy; {new Date().getFullYear()}
        </span>

        <span className="text-[0.7rem] text-text-muted">
          Systems that scale. Code that lasts.
        </span>
      </div>
    </footer>
  );
}
