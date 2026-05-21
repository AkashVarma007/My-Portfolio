import type { RealtimeChannel } from "@supabase/supabase-js";
import type { Direction, EmoteId, EventPayload } from "./types";

export type EventsClient = {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  publish: (payload: EventPayload) => Promise<void>;
  onEvent: (cb: (e: EventPayload) => void) => void;
};

export function createEventsClient(channel: RealtimeChannel): EventsClient {
  const handlers: Array<(e: EventPayload) => void> = [];
  channel.on(
    "broadcast" as never,
    { event: "lobby-event" } as never,
    (({ payload }: { payload: EventPayload }) => {
      handlers.forEach((cb) => cb(payload));
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
    async publish(payload) {
      await channel.send({ type: "broadcast", event: "lobby-event", payload });
    },
    onEvent(cb) {
      handlers.push(cb);
    },
  };
}

export function publishSnowball(
  client: EventsClient,
  args: { sessionId: string; fromName: string; x: number; y: number; direction: Direction }
) {
  return client.publish({
    type: "snowball",
    from: args.sessionId,
    fromName: args.fromName,
    x: args.x,
    y: args.y,
    direction: args.direction,
    thrownAt: Date.now(),
  });
}

export function publishSnowballHit(
  client: EventsClient,
  args: { sessionId: string; targetSessionId: string }
) {
  return client.publish({
    type: "snowball-hit",
    from: args.sessionId,
    targetSessionId: args.targetSessionId,
  });
}

export function publishPunch(
  client: EventsClient,
  args: { sessionId: string; targetSessionId: string | null }
) {
  return client.publish({
    type: "punch",
    from: args.sessionId,
    targetSessionId: args.targetSessionId,
  });
}

export function publishEmote(
  client: EventsClient,
  args: { sessionId: string; emote: EmoteId }
) {
  return client.publish({ type: "emote", from: args.sessionId, emote: args.emote });
}
