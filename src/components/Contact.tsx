"use client";

import { useEffect, useRef, useState } from "react";
import { useHunt } from "@/context/HuntContext";

type FormStatus = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const [focused, setFocused] = useState<string | null>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { isClueFound, canAttemptClue, unlockClue } = useHunt();
  const clue10Found = isClueFound(10);

  // Track mouse for interactive glow
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const handler = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    section.addEventListener("mousemove", handler);
    return () => section.removeEventListener("mousemove", handler);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;

    const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID;
    const form = formRef.current;
    if (!form) return;

    setStatus("sending");

    try {
      if (formspreeId) {
        const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("Formspree error");
      }
      // If no Formspree ID configured, just show success (dev mode)
      setStatus("sent");
      form.reset();
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-28 md:py-40 relative z-[1] overflow-hidden"
    >
      {/* Interactive mouse-following glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute transition-opacity duration-300"
        style={{
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(196,247,81,0.06) 0%, transparent 70%)",
          left: mousePos.x - 250,
          top: mousePos.y - 250,
          opacity: mousePos.x ? 1 : 0,
        }}
      />

      {/* Animated grid background */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 100%)",
        }}
      />

      <div className="max-w-[1300px] mx-auto px-6 md:px-12 relative">
        {/* Header */}
        <div className="fade-up-element mb-16">
          <span className="font-code text-[0.55rem] tracking-[6px] uppercase text-text-muted block mb-4">
            05 / Contact
          </span>
          <h2 className="font-display text-[clamp(2rem,5vw,4rem)] font-extrabold tracking-[-2px] leading-[1.05]">
            Let&rsquo;s build something
            <br />
            <span className="serif-italic font-normal">together</span>
            <span className="text-accent">.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left — form */}
          <div className="fade-up-element">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" noValidate>
              <InputField
                id="name"
                label="Name"
                type="text"
                placeholder="What should I call you?"
                focused={focused}
                setFocused={setFocused}
              />
              <InputField
                id="email"
                label="Email"
                type="email"
                placeholder="Where can I reach you?"
                focused={focused}
                setFocused={setFocused}
              />
              <div>
                <label
                  htmlFor="contact-message"
                  className="block font-code text-[0.55rem] tracking-[4px] uppercase text-text-muted mb-2.5"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  placeholder="Tell me about your project or idea..."
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused(null)}
                  className="contact-input"
                  style={{
                    borderColor: focused === "message" ? "var(--color-accent)" : undefined,
                    boxShadow: focused === "message" ? "0 0 0 3px rgba(196,247,81,0.06), 0 0 20px rgba(196,247,81,0.04)" : undefined,
                    resize: "vertical",
                    minHeight: 130,
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending" || status === "sent"}
                className="group relative font-display font-bold text-[0.85rem] px-8 py-4 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] w-full md:w-auto disabled:cursor-not-allowed disabled:opacity-80"
                style={{
                  background: status === "sent" ? "rgba(196,247,81,0.1)" : status === "error" ? "rgba(255,80,80,0.1)" : "var(--color-accent)",
                  color: status === "sent" ? "var(--color-accent)" : status === "error" ? "#ff6060" : "var(--color-bg)",
                }}
              >
                <span className="relative z-[1] flex items-center justify-center gap-2">
                  {status === "sending" && (
                    <>
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                      Sending…
                    </>
                  )}
                  {status === "sent" && (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                      Sent!
                    </>
                  )}
                  {status === "error" && "Failed — try again"}
                  {status === "idle" && (
                    <>
                      Send Message
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform duration-300 group-hover:translate-x-1">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>

          {/* Right — info cards + map */}
          <div className="fade-up-element space-y-5">
            {/* Map card */}
            <div className="relative rounded-2xl overflow-hidden border border-border-light h-[220px]">
              <iframe
                title="Hyderabad"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243647.3170735!2d78.2674!3d17.3850!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana%2C%20India!5e0!3m2!1sen!2sin!4v1700000000000"
                className="w-full h-full border-0"
                loading="lazy"
                style={{ filter: "invert(0.9) hue-rotate(180deg) saturate(0.3) brightness(0.5)", opacity: 0.7 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="font-code text-[0.6rem] tracking-[2px] uppercase text-text-dim">
                  Hyderabad, India
                </span>
              </div>
              {/* Hidden Easter egg dot — only interactive after clue 10 */}
              {clue10Found && (
                <div
                  onClick={() => {
                    // Debug: confirm click registration for clue 11
                    console.log("[clue11] map dot clicked");
                    if (canAttemptClue(11)) unlockClue(11);
                  }}
                  style={{
                    position: "absolute",
                    top: "6px",
                    right: "8px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "transparent",
                    cursor: "pointer",
                    zIndex: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      background: "rgba(196,247,81,0.18)",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Info cards grid */}
            <div className="grid grid-cols-2 gap-3">
              <InfoCard
                label="Email"
                value="g.akashvarma"
                href="mailto:g.akashvarma@gmail.com"
                icon={<MailIcon />}
              />
              <InfoCard
                label="LinkedIn"
                value="akash-varma"
                href="https://linkedin.com/in/akash-varma-gadiraju"
                icon={<LinkedInIcon />}
              />
              <InfoCard
                label="GitHub"
                value="AkashVarma"
                href="https://github.com/AkashVarmaGadiraju"
                icon={<GitHubIcon />}
              />
              <InfoCard
                label="Phone"
                value="+91 850-044"
                href="tel:+918500449747"
                icon={<PhoneIcon />}
              />
            </div>

            {/* Availability status */}
            <div className="rounded-xl border border-border-light bg-bg-card p-5 flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-accent animate-ping opacity-40" />
              </div>
              <div>
                <div className="text-[0.8rem] font-medium text-text">
                  Open to opportunities
                </div>
                <div className="text-[0.7rem] text-text-muted mt-0.5">
                  Available for full-time roles & interesting projects
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .contact-input {
          width: 100%;
          background: var(--color-bg-elevated);
          border: 1px solid var(--color-border-light);
          border-radius: 10px;
          padding: 14px 18px;
          color: var(--color-text);
          font-family: var(--font-body);
          font-size: 0.88rem;
          outline: none;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .contact-input::placeholder {
          color: var(--color-text-muted);
        }
        .contact-input:hover {
          border-color: rgba(255,255,255,0.12);
        }
      `}</style>
    </section>
  );
}

function InputField({
  id,
  label,
  type,
  placeholder,
  focused,
  setFocused,
}: {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  focused: string | null;
  setFocused: (v: string | null) => void;
}) {
  const isFocused = focused === id;
  return (
    <div>
      <label
        htmlFor={`contact-${id}`}
        className="block font-code text-[0.55rem] tracking-[4px] uppercase text-text-muted mb-2.5"
      >
        {label}
      </label>
      <input
        id={`contact-${id}`}
        name={id}
        type={type}
        required
        placeholder={placeholder}
        onFocus={() => setFocused(id)}
        onBlur={() => setFocused(null)}
        className="contact-input"
        style={{
          borderColor: isFocused ? "var(--color-accent)" : undefined,
          boxShadow: isFocused ? "0 0 0 3px rgba(196,247,81,0.06), 0 0 20px rgba(196,247,81,0.04)" : undefined,
        }}
      />
    </div>
  );
}

function InfoCard({ label, value, href, icon }: { label: string; value: string; href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener" : undefined}
      className="group rounded-xl border border-border bg-bg-card p-4 flex items-start gap-3 transition-all duration-300 hover:border-accent/20 hover:bg-bg-elevated"
    >
      <div className="text-text-muted group-hover:text-accent transition-colors duration-300 mt-0.5">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="font-code text-[0.5rem] tracking-[3px] uppercase text-text-muted mb-1">
          {label}
        </div>
        <div className="text-[0.8rem] text-text-dim group-hover:text-text transition-colors duration-300 truncate">
          {value}
        </div>
      </div>
    </a>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}
