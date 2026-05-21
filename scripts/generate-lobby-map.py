#!/usr/bin/env python3
"""Generate a Tiled JSON map for /lobby — grassy field with sand path, pond, trees, flowers."""
import json
import random
from pathlib import Path

W, H, T = 32, 22, 16

# Sunnyside tileset GIDs (verified via scripts/preview-tiles.py)
GRASS = 66
GRASS_VARS = [66, 130, 131, 132, 133, 134, 135, 194, 195, 196, 197, 198, 199]
SAND = 72
SAND_VARS = [72, 73, 74]
# Sand-on-grass edges (for natural path borders)
SAND_EDGE_TOP = 488     # sand bottom edge, grass above
SAND_EDGE_BOT = 555     # sand top edge, grass below
WATER = 478
WATER_VARS = [478, 479, 480, 481]
# Decor (object layer or non-blocking ground decor)
TREE_TOP_GIDS = [250, 252]       # tree canopy (top half)
TREE_BOT_GIDS = [314, 316]       # tree trunk (bottom half)
SMALL_TREES = [437, 500]          # single-tile trees
BUSHES = [307, 308, 372]
FLOWERS = [224, 225, 226, 227, 228, 305, 369]
GRASS_TUFTS = [220, 221, 222, 223]

random.seed(7)


def at(layer, x, y, v):
    layer[y * W + x] = v


def safe(x, y):
    return 1 <= x < W - 1 and 1 <= y < H - 1


# === GROUND LAYER ===
ground = [0] * (W * H)
for y in range(H):
    for x in range(W):
        at(ground, x, y, random.choice(GRASS_VARS) if random.random() < 0.18 else GRASS)

# Diagonal sand path: starts top-left side, curves to arcade door area on right
path_cells = set()
path_y = H // 2  # 11
# Main horizontal path from x=3 to x=W-3 along middle
for x in range(3, W - 3):
    path_cells.add((x, path_y))
    path_cells.add((x, path_y + 1))
# A short branch going up to the lore sign at (20, path_y - 4)
for y in range(path_y - 4, path_y):
    path_cells.add((20, y))
    path_cells.add((21, y))
# Branch down to welcome sign at (14, path_y + 3)
for y in range(path_y + 2, path_y + 5):
    path_cells.add((14, y))
    path_cells.add((15, y))

for (x, y) in path_cells:
    at(ground, x, y, random.choice(SAND_VARS))

# === POND (top-right) ===
pond_cells = set()
pcx, pcy, pr = W - 6, 4, 2  # center & radius
for y in range(pcy - pr, pcy + pr + 1):
    for x in range(pcx - pr, pcx + pr + 1):
        if (x - pcx) ** 2 + (y - pcy) ** 2 <= pr * pr and safe(x, y):
            pond_cells.add((x, y))
            at(ground, x, y, random.choice(WATER_VARS))

# === DECOR LAYER (non-blocking sprites + blocking trees in collision layer) ===
decor = [0] * (W * H)


def empty(x, y):
    return (x, y) not in path_cells and (x, y) not in pond_cells and safe(x, y)


# Scattered single-tile trees (block movement — added to collision)
big_trees = []  # list of (x, y) — top tile coord; bottom is (x, y+1)
for _ in range(28):
    x = random.randint(2, W - 3)
    y = random.randint(2, H - 3)
    if empty(x, y) and empty(x, y + 1):
        # avoid clustering on path borders
        ok = True
        for (px, py) in path_cells:
            if abs(px - x) <= 1 and abs(py - y) <= 1:
                ok = False
                break
        if ok and (x, y) not in big_trees:
            big_trees.append((x, y))
            at(decor, x, y, random.choice(TREE_TOP_GIDS))
            at(decor, x, y + 1, random.choice(TREE_BOT_GIDS))

# Small trees (block movement too)
small_trees = []
for _ in range(14):
    x = random.randint(2, W - 3)
    y = random.randint(2, H - 3)
    if empty(x, y) and (x, y) not in big_trees and all((x, y) != (bx, by + 1) for (bx, by) in big_trees):
        small_trees.append((x, y))
        at(decor, x, y, random.choice(SMALL_TREES))

# Bushes (decor, non-blocking)
bushes = []
for _ in range(20):
    x = random.randint(2, W - 3)
    y = random.randint(2, H - 3)
    if empty(x, y) and (x, y) not in big_trees and (x, y) not in small_trees:
        at(decor, x, y, random.choice(BUSHES))
        bushes.append((x, y))

# Flowers (non-blocking pop of color)
for _ in range(45):
    x = random.randint(2, W - 3)
    y = random.randint(2, H - 3)
    if empty(x, y) and decor[y * W + x] == 0:
        at(decor, x, y, random.choice(FLOWERS))

# Grass tufts (extra detail)
for _ in range(35):
    x = random.randint(2, W - 3)
    y = random.randint(2, H - 3)
    if empty(x, y) and decor[y * W + x] == 0:
        at(decor, x, y, random.choice(GRASS_TUFTS))

# === VISIBLE TRIGGER SPRITES (drawn on decor layer for visibility) ===
# Welcome sign visual at (14, path_y+3)
SIGN_GID = 230  # wooden post (placeholder sign)
BENCH_GID = 425  # wooden plank surface
ARCADE_GIDS = [
    # 2x2 wooden door — top row: roof, bottom row: door
    [613, 614],
    [617, 618],
]
at(decor, 14, path_y + 3, SIGN_GID)
at(decor, 20, path_y - 4, SIGN_GID)
# Bench (2-wide horizontal plank)
at(decor, 8, path_y - 2, BENCH_GID)
at(decor, 9, path_y - 2, BENCH_GID)
# Arcade door: 2x2 building entrance at (W-5, path_y)
ax, ay = W - 5, path_y
for row_idx, row in enumerate(ARCADE_GIDS):
    for col_idx, gid in enumerate(row):
        if safe(ax + col_idx, ay + row_idx):
            at(decor, ax + col_idx, ay + row_idx, gid)

# === COLLISION LAYER ===
collision = [0] * (W * H)
WALL_GID = 137  # marker — invisible (collision layer hidden)
# Border wall (full perimeter)
for x in range(W):
    at(collision, x, 0, WALL_GID)
    at(collision, x, H - 1, WALL_GID)
for y in range(H):
    at(collision, 0, y, WALL_GID)
    at(collision, W - 1, y, WALL_GID)
# Pond is impassable
for (x, y) in pond_cells:
    at(collision, x, y, WALL_GID)
# Trees block
for (x, y) in big_trees:
    at(collision, x, y, WALL_GID)
    at(collision, x, y + 1, WALL_GID)
for (x, y) in small_trees:
    at(collision, x, y, WALL_GID)

# === TRIGGER OBJECTS ===
triggers_objects = [
    {
        "id": 1, "name": "Bench", "type": "bench",
        "x": 8 * T, "y": (path_y - 2) * T,
        "width": 2 * T, "height": T,
        "visible": True, "rotation": 0, "properties": [],
    },
    {
        "id": 2, "name": "Welcome Sign", "type": "sign",
        "x": 14 * T, "y": (path_y + 3) * T,
        "width": T, "height": T,
        "visible": True, "rotation": 0,
        "properties": [
            {"name": "title", "type": "string", "value": "WELCOME, traveler"},
            {
                "name": "body", "type": "string",
                "value": (
                    "WASD or arrows to move.\n"
                    "Space = throw snowball.\n"
                    "F = punch.  E = emote wheel.\n"
                    "Z = interact (read signs, sit, enter arcade).\n"
                    "Enter = chat."
                ),
            },
        ],
    },
    {
        "id": 3, "name": "Lore Sign", "type": "sign",
        "x": 20 * T, "y": (path_y - 4) * T,
        "width": T, "height": T,
        "visible": True, "rotation": 0,
        "properties": [
            {"name": "title", "type": "string", "value": "ABOUT THIS PLACE"},
            {
                "name": "body", "type": "string",
                "value": (
                    "A field built for hangouts.\n"
                    "Akash's portfolio side-project.\n"
                    "Stay as long as you like."
                ),
            },
        ],
    },
    {
        "id": 4, "name": "Arcade Door", "type": "arcade",
        "x": (W - 5) * T, "y": path_y * T,
        "width": 2 * T, "height": 2 * T,
        "visible": True, "rotation": 0, "properties": [],
    },
]

doc = {
    "compressionlevel": -1, "height": H, "infinite": False,
    "layers": [
        {"data": ground, "height": H, "id": 1, "name": "ground", "opacity": 1, "type": "tilelayer", "visible": True, "width": W, "x": 0, "y": 0},
        {"data": decor, "height": H, "id": 2, "name": "decor", "opacity": 1, "type": "tilelayer", "visible": True, "width": W, "x": 0, "y": 0},
        {"data": collision, "height": H, "id": 3, "name": "collision", "opacity": 1, "type": "tilelayer", "visible": False, "width": W, "x": 0, "y": 0},
        {"draworder": "topdown", "id": 4, "name": "triggers", "objects": triggers_objects, "opacity": 1, "type": "objectgroup", "visible": True, "x": 0, "y": 0},
    ],
    "nextlayerid": 5, "nextobjectid": 5,
    "orientation": "orthogonal", "renderorder": "right-down",
    "tiledversion": "1.10.2",
    "tileheight": T,
    "tilesets": [
        {
            "columns": 64, "firstgid": 1,
            "image": "../sunnyside/tileset.png",
            "imageheight": 1024, "imagewidth": 1024,
            "margin": 0, "name": "lobby",
            "spacing": 0, "tilecount": 4096,
            "tileheight": T, "tilewidth": T,
        }
    ],
    "tilewidth": T, "type": "map", "version": "1.10", "width": W,
}

out = Path("public/lobby/maps/lobby.json")
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps(doc, indent=2))
print(
    f"wrote {out} — {W}x{H}={W*H} tiles, "
    f"big_trees={len(big_trees)}, small_trees={len(small_trees)}, "
    f"bushes={len(bushes)}, pond={len(pond_cells)}, path={len(path_cells)}, "
    f"triggers={len(triggers_objects)}"
)
