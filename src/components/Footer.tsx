export function Footer() {
  return (
    <footer className="border-t border-border px-6 md:px-12 relative z-[1]">
      <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 py-8">
        <span className="font-code text-[0.55rem] text-text-muted tracking-[3px]">
          AKASH VARMA &copy; {new Date().getFullYear()}
        </span>

        <span className="text-[0.7rem] text-text-muted">
          Systems that scale. Code that lasts.
        </span>
      </div>

      {/* Cryptic hint — rewards curiosity */}
      <div className="flex justify-center pb-6">
        <span
          className="font-serif text-[0.6rem] italic tracking-[2px]"
          style={{
            color: "rgba(255,255,255,0.08)",
            transition: "color 0.6s ease",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLSpanElement).style.color = "rgba(255,255,255,0.25)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLSpanElement).style.color = "rgba(255,255,255,0.08)"; }}
        >
          every end is a beginning
        </span>
      </div>
    </footer>
  );
}
