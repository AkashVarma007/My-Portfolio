export function Footer() {
  return (
    <footer
      className="relative z-[1] overflow-hidden"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "clamp(48px, 6vw, 80px) 0 clamp(32px, 4vw, 48px)",
      }}
    >
      {/* Giant faint wordmark */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontSize: "clamp(6rem, 20vw, 18rem)",
          lineHeight: 0.85,
          letterSpacing: "-8px",
          color: "transparent",
          WebkitTextStroke: "1px rgba(255,255,255,0.03)",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}
      >
        AKASH VARMA
      </div>

      <div
        className="max-w-[1300px] mx-auto relative"
        style={{ padding: "0 clamp(24px, 5vw, 64px)", zIndex: 1 }}
      >
        {/* Top row — tagline + nav links */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-12">
          {/* Left — big tagline */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "clamp(1.8rem, 4vw, 3.2rem)",
                color: "var(--color-text)",
                lineHeight: 0.95,
                letterSpacing: "-2px",
              }}
            >
              Systems that{" "}
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontWeight: 300,
                  letterSpacing: "-1px",
                }}
              >
                scale.
              </span>
              <br />
              Code that{" "}
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontWeight: 300,
                  letterSpacing: "-1px",
                }}
              >
                lasts.
              </span>
            </p>
          </div>

          {/* Right — nav links */}
          <nav className="flex flex-wrap gap-6">
            {["about", "work", "journey", "skills", "contact"].map((id) => (
              <button
                key={id}
                onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
                style={{
                  fontFamily: "var(--font-code)",
                  fontSize: "0.55rem",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: "var(--color-text-muted)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
              >
                {id}
              </button>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.08) 70%, transparent)",
            marginBottom: "28px",
          }}
        />

        {/* Bottom row — copyright + socials */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <span
            style={{
              fontFamily: "var(--font-code)",
              fontSize: "0.55rem",
              color: "var(--color-text-muted)",
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            © {new Date().getFullYear()} Akash Varma. All rights reserved.
          </span>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/AkashVarmaGadiraju"
              target="_blank"
              rel="noopener"
              style={{
                fontFamily: "var(--font-code)",
                fontSize: "0.55rem",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/akash-varma-gadiraju"
              target="_blank"
              rel="noopener"
              style={{
                fontFamily: "var(--font-code)",
                fontSize: "0.55rem",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
            >
              LinkedIn
            </a>
            <a
              href="mailto:g.akashvarma@gmail.com"
              style={{
                fontFamily: "var(--font-code)",
                fontSize: "0.55rem",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
