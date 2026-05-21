export type TouchAxis = -1 | 0 | 1;

type TouchAction = "throw" | "punch" | "emote" | "interact" | "chat";

type TouchState = {
  dx: TouchAxis;
  dy: TouchAxis;
  throwQueued: boolean;
  punchQueued: boolean;
  emoteQueued: boolean;
  interactQueued: boolean;
  chatQueued: boolean;
};

const state: TouchState = {
  dx: 0,
  dy: 0,
  throwQueued: false,
  punchQueued: false,
  emoteQueued: false,
  interactQueued: false,
  chatQueued: false,
};

export const TouchInput = {
  setAxis(dx: TouchAxis, dy: TouchAxis): void {
    state.dx = dx;
    state.dy = dy;
  },
  press(action: TouchAction): void {
    if (action === "throw") state.throwQueued = true;
    else if (action === "punch") state.punchQueued = true;
    else if (action === "emote") state.emoteQueued = true;
    else if (action === "interact") state.interactQueued = true;
    else if (action === "chat") state.chatQueued = true;
  },
  read(): Readonly<TouchState> {
    return state;
  },
  consumeActions(): void {
    state.throwQueued = false;
    state.punchQueued = false;
    state.emoteQueued = false;
    state.interactQueued = false;
    state.chatQueued = false;
  },
};
