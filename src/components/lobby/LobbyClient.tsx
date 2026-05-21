"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type Phaser from "phaser";
import { LoginGate, type LobbySession } from "./LoginGate";
import { logout } from "@/lib/lobby/auth";
import { getSupabaseBrowser } from "@/lib/lobby/supabase-browser";
import { createPresenceTracker } from "@/lib/lobby/realtime/presence";
import { createChatClient } from "@/lib/lobby/realtime/chat";
import { createEventsClient } from "@/lib/lobby/realtime/events";
import type {
  ChatPayload,
  EmoteId,
  PresencePayload,
} from "@/lib/lobby/realtime/types";
import type { LobbyScene, SignDialogPayload } from "@/lib/lobby/phaser/scene";
import type { Trigger } from "@/lib/lobby/phaser/interactables";
import { ChatPanel } from "./ChatPanel";
import { PlayerList } from "./PlayerList";
import { EmoteWheel } from "./EmoteWheel";
import { MobileControls } from "./MobileControls";
import { InteractPrompt } from "./InteractPrompt";
import { SignDialog } from "./SignDialog";
import { ScanlineOverlay } from "./ScanlineOverlay";
import { AudioToggle } from "./AudioToggle";

const SPAWN = { x: 248, y: 248 };
const CHAT_HISTORY_CAP = 50;

function generateSessionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const b = new Uint8Array(16);
    crypto.getRandomValues(b);
    b[6] = (b[6] & 0x0f) | 0x40;
    b[8] = (b[8] & 0x3f) | 0x80;
    const h = Array.from(b, (x) => x.toString(16).padStart(2, "0"));
    return `${h.slice(0, 4).join("")}-${h.slice(4, 6).join("")}-${h.slice(6, 8).join("")}-${h.slice(8, 10).join("")}-${h.slice(10, 16).join("")}`;
  }
  return `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function LobbyClient() {
  const [session, setSession] = useState<LobbySession | null>(null);
  const [mobile, setMobile] = useState(false);
  const [peers, setPeers] = useState<PresencePayload[]>([]);
  const [messages, setMessages] = useState<ChatPayload[]>([]);
  const [emoteOpen, setEmoteOpen] = useState(false);
  const [sign, setSign] = useState<SignDialogPayload | null>(null);
  const [interactTrigger, setInteractTrigger] = useState<Trigger | null>(null);
  const [bootError, setBootError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<LobbyScene | null>(null);
  const sessionIdRef = useRef<string>("");
  const cleanupRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setMobile(window.matchMedia("(hover: none)").matches);
  }, []);

  const sendChat = useCallback(async (text: string) => {
    const fn = chatSendRef.current;
    if (!fn) throw new Error("Chat not ready");
    await fn(text);
  }, []);

  const chatSendRef = useRef<((text: string) => Promise<void>) | null>(null);

  useEffect(() => {
    if (!session || !containerRef.current) return;
    let cancelled = false;
    const supabase = getSupabaseBrowser();
    const sessionId = generateSessionId();
    sessionIdRef.current = sessionId;
    const username =
      session.kind === "account" ? session.profile.username : session.username;
    const variant =
      session.kind === "account" ? session.profile.variant : session.variant;
    const isGuest = session.kind === "guest";

    const initialPresence: PresencePayload = {
      id: sessionId,
      name: username,
      variant,
      isGuest,
      x: SPAWN.x,
      y: SPAWN.y,
      facing: "down",
      joinedAt: Date.now(),
    };

    const presenceChannel = supabase.channel("lobby:presence", {
      config: { presence: { key: sessionId } },
    });

    const presence = createPresenceTracker(presenceChannel, initialPresence);
    const chatChannel = supabase.channel(`lobby:chat:${sessionId}`);
    const eventsChannel = supabase.channel("lobby:events");
    const chat = createChatClient(supabase, chatChannel, {
      username,
      isGuest,
    });
    chat.onMessage((msg) =>
      setMessages((prev) => {
        const next = [...prev, msg];
        if (next.length > CHAT_HISTORY_CAP) next.shift();
        return next;
      })
    );
    const events = createEventsClient(eventsChannel);

    chatSendRef.current = (text) => chat.send(text);

    void (async () => {
      try {
        const [Phaser, sceneModule, configModule] = await Promise.all([
          import("phaser"),
          import("@/lib/lobby/phaser/scene"),
          import("@/lib/lobby/phaser/config"),
        ]);
        if (cancelled || !containerRef.current) return;

        await presence.start();
        if (cancelled) return;
        await Promise.all([chat.start(), events.start()]);
        if (cancelled) return;

        const config = configModule.buildGameConfig(
          containerRef.current,
          sceneModule.LobbyScene
        );
        const PhaserGame =
          (Phaser as unknown as { default?: typeof Phaser }).default ?? Phaser;
        const game = new PhaserGame.Game(config);
        gameRef.current = game;

        game.scene.start("LobbyScene", {
          username,
          variant,
          isGuest,
          sessionId,
          presence,
          events,
          onPeersChanged: (p: PresencePayload[]) => setPeers(p),
          onLocalEmoteRequest: () => setEmoteOpen(true),
          onInteractSign: (payload: SignDialogPayload) => setSign(payload),
          onInteractArcade: () => {
            window.location.href = "/arcade";
          },
          onInteractPromptChange: (t: Trigger | null) => setInteractTrigger(t),
        });
        sceneRef.current = game.scene.getScene("LobbyScene") as LobbyScene;
      } catch (err) {
        if (cancelled) return;
        setBootError(err instanceof Error ? err.message : "Failed to start lobby");
      }
    })();

    cleanupRef.current = async () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
      sceneRef.current = null;
      chatSendRef.current = null;
      await Promise.allSettled([presence.stop(), chat.stop(), events.stop()]);
    };

    return () => {
      cancelled = true;
      void cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [session]);

  const triggerEmote = useCallback((id: EmoteId) => {
    sceneRef.current?.playLocalEmote(id);
  }, []);

  async function handleLogout() {
    if (session?.kind === "account") await logout();
    setSession(null);
    setPeers([]);
    setMessages([]);
  }

  const interactLabel = useMemo(() => {
    if (!interactTrigger) return "";
    switch (interactTrigger.kind) {
      case "bench":
        return "Sit";
      case "sign":
        return "Read";
      case "arcade":
        return "Enter Arcade";
      default:
        return "Interact";
    }
  }, [interactTrigger]);

  if (!session) {
    return (
      <div className="relative w-screen h-screen overflow-hidden bg-[#0E1A3A]">
        <LoginGate onAuthenticated={setSession} />
      </div>
    );
  }

  const username =
    session.kind === "account" ? session.profile.username : session.username;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0E1A3A]">
      <div ref={containerRef} className="absolute inset-0" />
      <ScanlineOverlay />
      <button
        onClick={handleLogout}
        className="absolute top-4 left-4 z-30"
        style={{
          background: "#0E1A3A",
          color: "#FFE9A8",
          border: "2px solid #FFE9A8",
          fontFamily: "var(--font-press-start)",
          fontSize: 9,
          padding: "6px 10px",
          cursor: "pointer",
        }}
      >
        ← Leave
      </button>
      <AudioToggle />
      <PlayerList peers={peers} selfId={sessionIdRef.current} />
      <ChatPanel
        messages={messages}
        onSend={sendChat}
        selfUsername={username}
      />
      <InteractPrompt visible={!!interactTrigger} label={interactLabel} />
      <EmoteWheel
        open={emoteOpen}
        onClose={() => setEmoteOpen(false)}
        onSelect={triggerEmote}
      />
      <SignDialog
        open={!!sign}
        title={sign?.title ?? ""}
        body={sign?.body ?? ""}
        onClose={() => setSign(null)}
      />
      {mobile && <MobileControls />}
      {bootError && (
        <div
          style={{
            position: "absolute",
            top: 60,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#0E1A3A",
            border: "2px solid #FF6B6B",
            color: "#FF6B6B",
            padding: "8px 12px",
            fontFamily: "var(--font-vt323)",
            fontSize: 14,
            zIndex: 60,
          }}
        >
          {bootError}
        </div>
      )}
    </div>
  );
}
