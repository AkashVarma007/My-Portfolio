import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import { cleanText, containsProfanity } from "@/lib/lobby/filter";
import type { ChatPayload } from "./types";

const MAX_LENGTH = 120;
const WINDOW_MS = 5_000;
const MAX_PER_WINDOW = 2;

export type ChatIdentity = { username: string; isGuest: boolean };

export type ChatClient = {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  send: (text: string) => Promise<void>;
  onMessage: (cb: (msg: ChatPayload) => void) => void;
};

export function createChatClient(
  supabase: SupabaseClient,
  channel: RealtimeChannel,
  identity: ChatIdentity
): ChatClient {
  const recent: number[] = [];
  const handlers: Array<(msg: ChatPayload) => void> = [];

  channel.on(
    "postgres_changes" as never,
    { event: "INSERT", schema: "public", table: "chat_events" } as never,
    ((payload: {
      new: {
        from_username: string;
        text: string;
        is_guest: boolean;
        created_at: string;
      };
    }) => {
      handlers.forEach((cb) =>
        cb({
          from: payload.new.from_username,
          text: payload.new.text,
          isGuest: payload.new.is_guest,
          timestamp: new Date(payload.new.created_at).getTime(),
        })
      );
    }) as never
  );

  return {
    start: () =>
      new Promise<void>((resolve) => {
        channel.subscribe((status) => {
          if (status === "SUBSCRIBED") resolve();
        });
      }),
    async stop() {
      await channel.unsubscribe();
    },
    async send(rawText) {
      const text = rawText.trim();
      if (text.length === 0) throw new Error("Message can't be empty");
      if (text.length > MAX_LENGTH)
        throw new Error(`Message too long — max ${MAX_LENGTH} chars`);

      const now = Date.now();
      while (recent.length > 0 && now - recent[0] > WINDOW_MS) recent.shift();
      if (recent.length >= MAX_PER_WINDOW)
        throw new Error("Slow down — too many messages");
      recent.push(now);

      const cleaned = containsProfanity(text) ? cleanText(text) : text;
      const { error } = await supabase.from("chat_events").insert({
        from_username: identity.username,
        text: cleaned,
        is_guest: identity.isGuest,
      });
      if (error) throw new Error(error.message);
    },
    onMessage(cb) {
      handlers.push(cb);
    },
  };
}
