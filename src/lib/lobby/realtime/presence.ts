import type { RealtimeChannel } from "@supabase/supabase-js";
import type { PresencePayload } from "./types";

type Update = Pick<PresencePayload, "x" | "y" | "facing">;

export type PresenceTracker = {
  start: () => Promise<void>;
  publish: (update: Update) => void;
  stop: () => Promise<void>;
  onJoin: (cb: (peer: PresencePayload) => void) => void;
  onLeave: (cb: (peerId: string) => void) => void;
  onUpdate: (cb: (peer: PresencePayload) => void) => void;
  peers: () => PresencePayload[];
};

export function createPresenceTracker(
  channel: RealtimeChannel,
  initial: PresencePayload
): PresenceTracker {
  let current = initial;
  const onJoinCbs: Array<(p: PresencePayload) => void> = [];
  const onLeaveCbs: Array<(id: string) => void> = [];
  const onUpdateCbs: Array<(p: PresencePayload) => void> = [];

  channel.on("presence" as never, { event: "sync" } as never, (() => {
    const state = channel.presenceState();
    for (const key of Object.keys(state)) {
      const entries = state[key] as unknown as PresencePayload[];
      for (const entry of entries) onUpdateCbs.forEach((cb) => cb(entry));
    }
  }) as never);

  channel.on("presence" as never, { event: "join" } as never, (({
    newPresences,
  }: {
    newPresences: PresencePayload[];
  }) => {
    for (const p of newPresences) onJoinCbs.forEach((cb) => cb(p));
  }) as never);

  channel.on("presence" as never, { event: "leave" } as never, (({
    leftPresences,
  }: {
    leftPresences: PresencePayload[];
  }) => {
    for (const p of leftPresences) onLeaveCbs.forEach((cb) => cb(p.id));
  }) as never);

  return {
    start: () =>
      new Promise<void>((resolve) => {
        channel.subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            await channel.track(current);
            resolve();
          }
        });
      }),
    publish(update) {
      current = { ...current, ...update };
      void channel.track(current);
    },
    async stop() {
      await channel.untrack();
      await channel.unsubscribe();
    },
    onJoin(cb) {
      onJoinCbs.push(cb);
    },
    onLeave(cb) {
      onLeaveCbs.push(cb);
    },
    onUpdate(cb) {
      onUpdateCbs.push(cb);
    },
    peers() {
      const state = channel.presenceState();
      const out: PresencePayload[] = [];
      for (const key of Object.keys(state)) {
        const entries = state[key] as unknown as PresencePayload[];
        for (const e of entries) out.push(e);
      }
      return out;
    },
  };
}
