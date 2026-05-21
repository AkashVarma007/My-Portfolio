import { describe, it, expect, vi } from "vitest";
import { createChatClient } from "@/lib/lobby/realtime/chat";
import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";

function mockChannel() {
  const channel = {
    on: vi.fn(() => channel),
    subscribe: vi.fn((cb: (status: string) => void) => {
      cb("SUBSCRIBED");
      return channel;
    }),
    unsubscribe: vi.fn(async () => ({ status: "ok" })),
  };
  return channel;
}

function mockSupabase() {
  return {
    from: vi.fn(() => ({
      insert: vi.fn(async () => ({ error: null })),
    })),
  };
}

describe("createChatClient", () => {
  it("rejects empty messages", async () => {
    const channel = mockChannel();
    const supabase = mockSupabase();
    const client = createChatClient(
      supabase as unknown as SupabaseClient,
      channel as unknown as RealtimeChannel,
      { username: "Akash", isGuest: false }
    );
    await client.start();
    await expect(client.send("   ")).rejects.toThrow();
  });

  it("rejects messages over 120 chars", async () => {
    const channel = mockChannel();
    const supabase = mockSupabase();
    const client = createChatClient(
      supabase as unknown as SupabaseClient,
      channel as unknown as RealtimeChannel,
      { username: "Akash", isGuest: false }
    );
    await client.start();
    await expect(client.send("x".repeat(121))).rejects.toThrow();
  });

  it("enforces 2 messages per 5 seconds throttle", async () => {
    const channel = mockChannel();
    const supabase = mockSupabase();
    const client = createChatClient(
      supabase as unknown as SupabaseClient,
      channel as unknown as RealtimeChannel,
      { username: "Akash", isGuest: false }
    );
    await client.start();
    await client.send("hi");
    await client.send("there");
    await expect(client.send("again")).rejects.toThrow(/slow down/i);
  });
});
