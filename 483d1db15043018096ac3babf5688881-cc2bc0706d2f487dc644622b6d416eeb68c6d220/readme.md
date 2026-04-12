# Claude Code Prompt Patcher

Patches Claude Code's system prompts to fix corner-cutting behavior. The model is instructed to be minimal in **15-20 separate places** vs only **3-4 instructions to be thorough** — a 5:1 ratio favoring laziness. This patch rebalances that.

## Usage

```bash
./patch-claude-code.sh              # apply patches
./patch-claude-code.sh --watch      # apply + auto-repatch after updates (macOS/Linux)
./patch-claude-code.sh --restore    # undo everything
./patch-claude-code.sh --check      # check if patches are applied
./patch-claude-code.sh --dry-run    # preview without modifying
```

Requires Node.js >= 18 and npm. Works on macOS and Linux.

## Patches

| # | Target | Before | After |
|---|--------|--------|-------|
| 1 | Output efficiency | "Try the simplest approach first. Do not overdo it. Be extra concise." | "Choose the approach that correctly and completely solves the problem." |
| 2 | Brevity paragraph | "Lead with the answer, not the reasoning" | Adds: "these guidelines apply to messages, NOT to thoroughness of code changes" |
| 3 | One sentence rule | "If you can say it in one sentence, don't use three" | "does not apply to...the thoroughness of your implementation work" |
| 4 | Anti-gold-plating | "Don't add features, refactor, or improve beyond what was asked" | "if adjacent code is broken or contributes to the problem, fix it" |
| 5 | Error handling | "Don't add error handling for scenarios that can't happen" | "Add error handling at real boundaries where failures can occur" |
| 6 | Three lines rule | "Three similar lines is better than a premature abstraction" | "Use judgment. Extract when duplication causes real maintenance risk" |
| 7 | Subagent addendum (2x) | "don't gold-plate, but don't leave it half-done" | "Do the work a careful senior developer would do, including edge cases" |
| 8 | Explore agent | "meant to be a fast agent...as quickly as possible" | "Be thorough. Do not sacrifice completeness for speed" |
| 9 | Tone | "short and concise" | "clear and appropriately detailed for the complexity" |
| 10 | Subagent output | "code snippets only when load-bearing" | "code snippets when they provide useful context" |
| 11 | Scope matching | "Match the scope to what was requested" | Adds: "do address closely related issues when fixing them is clearly right" |

## A/B Test Results

Tested by giving both unpatched and patched Claude Code the same task: **port box2d (30k lines of C, 56 files) to a pure JavaScript implementation with a working demo.**

### Unpatched (1,419 lines, 7 files)

- Clean modular architecture (math, body, shapes, collision, world, index)
- O(n^2) brute force broad phase
- Sequential impulse solver with warm starting, Baumgarte stabilization, friction, restitution
- Generic physics engine — only 2 references to box2d constants
- No sub-stepping
- Demo: click-to-spawn, pyramid button, rain button

### Patched (1,885 lines, 2 files)

- Single `box2d.js` bundle — 33% more code
- **Dynamic AABB tree** (the real box2d broad phase)
- Sequential impulse solver with warm starting, friction, restitution, **soft contact constraints** (`b2MakeSoft` formulation), **sub-stepping** (4 sub-steps for stability)
- Uses actual box2d constants (`B2_LINEAR_SLOP`, `B2_SPECULATIVE_DISTANCE`, `B2_MAX_POLYGON_VERTICES`)
- Demo: click-to-spawn, ramps, walls, pause/reset, performance stats

### Verdict

| | Unpatched | Patched |
|---|---|---|
| Lines of code | 1,419 | 1,885 (+33%) |
| Broad phase | O(n^2) brute force | Dynamic AABB tree |
| Sub-stepping | No | Yes (4 sub-steps) |
| Soft contacts | No | Yes (`b2MakeSoft`) |
| box2d constants | 2 | 10 |
| Fidelity to box2d | Generic physics engine | Actually ports box2d concepts |

The unpatched version built a *working physics engine* but took shortcuts — brute force broad phase, no sub-stepping, no soft contacts. It's a "physics engine inspired by box2d."

The patched version built something closer to an *actual port of box2d* — dynamic AABB tree, box2d's specific constants and formulas, sub-stepping for stability, soft contact constraints. It did more work because the prompts didn't tell it to stop at "good enough."

The three highest-impact patches were **#1** (simplest approach -> correct approach), **#4** (don't add features -> fix related issues), and **#7** (don't gold-plate -> work like a senior developer). Together they shifted the model from "build the minimum that satisfies the prompt" to "build something faithful to the source material."

## How It Works

Claude Code ships as a Bun-compiled Mach-O binary with embedded JS bytecode. The binary can't be patched (bytecode integrity checks). Instead, this script:

1. Installs the same version from npm (which ships as plain `cli.js`)
2. Applies string replacements to the prompt text in `cli.js`
3. Repoints the `claude` symlink to the patched npm `cli.js`

The `--watch` flag installs a file watcher (launchd on macOS, systemd on Linux) that monitors `~/.local/share/claude/versions/` for new binaries. When Claude Code auto-updates, the watcher automatically updates the npm package to match and re-applies patches.
