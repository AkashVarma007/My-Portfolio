import { describe, it, expect, vi } from "vitest";
import { createPresenceTracker } from "@/lib/lobby/realtime/presence";
import type { RealtimeChannel } from "@supabase/supabase-js";

type Handler = (args: unknown) => void;

function mockChannel() {
  const handlers: Record<string, Handler> = {};
  const channel = {
    on: vi.fn((event: string, _filter: unknown, cb: Handler) => {
      handlers[`${event}:${(_filter as { event?: string })?.event ?? "_"}`] = cb;
      return channel;
    }),
    track: vi.fn(async () => ({ status: "ok" })),
    untrack: vi.fn(async () => ({ status: "ok" })),
    subscribe: vi.fn((cb: (status: string) => void) => {
      cb("SUBSCRIBED");
      return channel;
    }),
    unsubscribe: vi.fn(async () => ({ status: "ok" })),
    presenceState: vi.fn(() => ({})),
  };
  return channel;
}

const basePayload = {
  id: "sess1",
  name: "Akash",
  variant: "default",
  isGuest: false,
  x: 0,
  y: 0,
  facing: "down" as const,
  joinedAt: 0,
};

describe("createPresenceTracker", () => {
  it("subscribes and tracks initial payload on start", async () => {
    const channel = mockChannel();
    const tracker = createPresenceTracker(channel as unknown as RealtimeChannel, basePayload);
    await tracker.start();
    expect(channel.subscribe).toHaveBeenCalled();
    expect(channel.track).toHaveBeenCalled();
  });

  it("publishes position updates by re-tracking", async () => {
    const channel = mockChannel();
    const tracker = createPresenceTracker(channel as unknown as RealtimeChannel, basePayload);
    await tracker.start();
    const before = channel.track.mock.calls.length;
    tracker.publish({ x: 10, y: 20, facing: "right" });
    tracker.publish({ x: 11, y: 20, facing: "right" });
    expect(channel.track.mock.calls.length).toBeGreaterThan(before);
  });
});
