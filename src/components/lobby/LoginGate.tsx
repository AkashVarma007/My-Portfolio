"use client";

import { useState } from "react";
import { DialogueFrame } from "./DialogueFrame";
import {
  registerAccount,
  loginAccount,
  type LobbyProfile,
} from "@/lib/lobby/auth";
import { isValidUsername, sanitizeUsername } from "@/lib/lobby/sanitizer";
import { containsProfanity } from "@/lib/lobby/filter";

type Mode = "menu" | "login" | "register" | "guest";

export type LobbySession =
  | { kind: "account"; profile: LobbyProfile }
  | { kind: "guest"; username: string; variant: string };

type Props = {
  onAuthenticated: (session: LobbySession) => void;
};

const VARIANTS = ["default", "scholar", "tinkerer", "nomad"];

export function LoginGate({ onAuthenticated }: Props) {
  const [mode, setMode] = useState<Mode>("menu");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [variant, setVariant] = useState(VARIANTS[0]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const result = await loginAccount(username, password);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onAuthenticated({ kind: "account", profile: result.profile });
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const result = await registerAccount(username, password, variant);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onAuthenticated({ kind: "account", profile: result.profile });
  }

  function handleGuest(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const cleaned = sanitizeUsername(username);
    if (!isValidUsername(cleaned)) {
      setError("Username must be 3-16 chars, letters/numbers/underscore only.");
      return;
    }
    if (containsProfanity(cleaned)) {
      setError("Please pick a different name.");
      return;
    }
    onAuthenticated({ kind: "guest", username: cleaned, variant });
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/80 p-4">
      <DialogueFrame style={{ width: "min(440px, 92vw)" }}>
        <h1
          style={{
            fontFamily: "var(--font-press-start)",
            fontSize: 14,
            color: "#FFE9A8",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          The Lobby
        </h1>
        <p
          style={{
            fontFamily: "VT323, monospace",
            fontSize: 18,
            color: "#FFFFFF",
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          Drop in, chill, throw snow.
        </p>

        {mode === "menu" && (
          <div className="flex flex-col gap-3">
            <PixelButton onClick={() => setMode("login")}>Login</PixelButton>
            <PixelButton onClick={() => setMode("register")}>Register</PixelButton>
            <PixelButton onClick={() => setMode("guest")} variant="secondary">
              Continue as guest
            </PixelButton>
          </div>
        )}

        {mode === "login" && (
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <PixelInput
              label="Username"
              value={username}
              onChange={setUsername}
              placeholder="rowan_oak"
            />
            <PixelInput
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
            />
            <PixelButton type="submit" disabled={busy}>
              {busy ? "..." : "Enter"}
            </PixelButton>
            <PixelButton type="button" variant="secondary" onClick={() => setMode("menu")}>
              Back
            </PixelButton>
          </form>
        )}

        {mode === "register" && (
          <form onSubmit={handleRegister} className="flex flex-col gap-3">
            <PixelInput
              label="Username"
              value={username}
              onChange={setUsername}
              placeholder="rowan_oak"
            />
            <PixelInput
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="8+ characters"
            />
            <VariantPicker value={variant} onChange={setVariant} />
            <PixelButton type="submit" disabled={busy}>
              {busy ? "..." : "Create + enter"}
            </PixelButton>
            <PixelButton type="button" variant="secondary" onClick={() => setMode("menu")}>
              Back
            </PixelButton>
          </form>
        )}

        {mode === "guest" && (
          <form onSubmit={handleGuest} className="flex flex-col gap-3">
            <PixelInput
              label="Your name"
              value={username}
              onChange={setUsername}
              placeholder="anon123"
            />
            <VariantPicker value={variant} onChange={setVariant} />
            <PixelButton type="submit">Enter</PixelButton>
            <PixelButton type="button" variant="secondary" onClick={() => setMode("menu")}>
              Back
            </PixelButton>
          </form>
        )}

        {error && (
          <p
            style={{
              color: "#FF6B6B",
              fontFamily: "VT323, monospace",
              fontSize: 16,
              marginTop: 12,
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}
      </DialogueFrame>
      <p
        style={{
          color: "#FFE9A8",
          fontFamily: "VT323, monospace",
          fontSize: 14,
          opacity: 0.7,
        }}
      >
        No email. No verification. Pick a name and go.
      </p>
    </div>
  );
}

function PixelButton({
  children,
  onClick,
  type = "button",
  disabled,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: "primary" | "secondary";
}) {
  const isPrimary = variant === "primary";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full py-2 disabled:opacity-50"
      style={{
        background: isPrimary ? "#FFE9A8" : "#0E1A3A",
        color: isPrimary ? "#0E1A3A" : "#FFE9A8",
        border: `2px solid ${isPrimary ? "#FF6B6B" : "#FFE9A8"}`,
        fontFamily: "var(--font-press-start)",
        fontSize: 10,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}

function PixelInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span
        style={{
          fontFamily: "var(--font-press-start)",
          fontSize: 9,
          color: "#FFE9A8",
        }}
      >
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-2 py-1"
        style={{
          background: "#1A2550",
          border: "2px solid #FFE9A8",
          color: "#FFFFFF",
          fontFamily: "VT323, monospace",
          fontSize: 16,
          outline: "none",
        }}
      />
    </label>
  );
}

function VariantPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p
        style={{
          fontFamily: "var(--font-press-start)",
          fontSize: 9,
          color: "#FFE9A8",
          marginBottom: 4,
        }}
      >
        Character
      </p>
      <div className="flex gap-2">
        {VARIANTS.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className="flex-1 py-1 capitalize"
            style={{
              background: value === v ? "#FFE9A8" : "#1A2550",
              color: value === v ? "#0E1A3A" : "#FFFFFF",
              border: "2px solid #FFE9A8",
              fontFamily: "VT323, monospace",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
