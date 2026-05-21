# /lobby

A pixel-art shared hangout embedded in the portfolio. Pokémon Fire Red aesthetic, Sunnyside assets, Supabase Realtime for multiplayer, snowball + punch + emote + interact gameplay verbs, mobile touch controls.

## Setup (one-time)

1. **Supabase project**: create one at https://supabase.com (free tier).
2. **Env**: copy `.env.local.example` → `.env.local`. Fill `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` from project API settings.
3. **Migrations**: run both files in the Supabase SQL Editor in order:
   - `supabase/migrations/20260519000001_lobby_profiles.sql`
   - `supabase/migrations/20260519000100_chat_events.sql`
4. **Realtime**: in Supabase dashboard → Database → Replication, enable Realtime for the `chat_events` table.
5. **Assets** — drop under `public/lobby/`:
   - `sunnyside/characters.png` + `tileset.png` — Sunnyside pack by Daniel Diggle (https://danieldiggle.itch.io/sunnyside, PWYW $0).
   - `snowy/snowball.png` — ScratchBattles Snowy (https://squaremeapixel.itch.io/snowy).
   - `maps/lobby.json` — paint in Tiled, 30×20 tiles @ 16×16. Layers: `ground`, `decor`, `collision`. Add an object layer `triggers` with object `type` = `bench` | `sign` | `arcade` and properties as needed (e.g. sign `title` + `body`).
   - `audio/*.wav|ogg` — see `src/lib/lobby/phaser/audio.ts` for the keys. Use CC0 sources (Kenney `snowball-throw`/`-hit`, `punch-hit`, `chat-ping`, OpenGameArt `bgm-loop`, etc).

## Plans

- `docs/superpowers/specs/2026-05-19-lobby-v0-design.md` — design spec.
- `docs/superpowers/plans/2026-05-19-lobby-v0-plan-a-foundation.md` — solo foundation (✅ done).
- `docs/superpowers/plans/2026-05-19-lobby-v0-plan-b-multiplayer.md` — presence + chat (✅ done).
- `docs/superpowers/plans/2026-05-19-lobby-v0-plan-c-gameplay.md` — verbs + mobile + polish (✅ done).

## v0 — Delivered

**Plan A — Foundation**
- ✅ `/lobby` route loads Phaser solo scene
- ✅ Account + guest auth (no email — synthetic `<username>@lobby.akash.local`)
- ✅ Username sanitizer + profanity filter
- ✅ Fire Red dialogue panels (`DialogueFrame`)
- ✅ Supabase auth + `lobby_profiles` schema
- ✅ Asset manifest + `/lobby/credits` page

**Plan B — Multiplayer**
- ✅ Presence tracker on `lobby:presence` (200ms throttle)
- ✅ `RemotePlayer` with lerp interpolation + name labels
- ✅ Postgres-backed chat via `chat_events` + Realtime INSERT subscription
- ✅ Chat: 120-char cap, 2-msg/5s throttle, profanity clean, DB-trigger banned wordlist
- ✅ `ChatPanel` (Enter to open) + `PlayerList` (top-right) + `ChatBubble`

**Plan C — Gameplay verbs**
- ✅ Snowball throw (Space): cooldown 1s, 96px travel, hit tint + SFX
- ✅ Punch (F): 1-tile facing range, cooldown 1s, target tint + SFX
- ✅ Emote wheel (E): wave/sit/dance/point/laugh/heart with glyphs + chime
- ✅ Interact (Z): bench → sit emote, sign → modal dialog, arcade → route to `/arcade`
- ✅ Touch controls (D-pad + 4 action buttons) auto-mount on touch devices
- ✅ Audio: BGM loop with autoplay-blocked fallback, SFX bus, BGM/SFX toggles persisted in localStorage
- ✅ Scanline CRT overlay
- ✅ Settings panel (variant + name color) — `SettingsPanel.tsx`

## Verification

- `npx vitest run` — 30/30 tests passing (7 files)
- `npx tsc --noEmit` — clean
- `npm run build` — clean, `/lobby` prerenders static
- `npm run lint` — lobby code clean (9 pre-existing portfolio errors untouched)

## Manual blockers before first multiplayer run

1. Asset files dropped under `public/lobby/` (see above).
2. Tiled `lobby.json` painted with required layers + object triggers.
3. Supabase project created, migrations run, Realtime enabled on `chat_events`.
4. Audio files downloaded.
