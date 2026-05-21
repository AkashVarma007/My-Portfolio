#!/usr/bin/env python3
"""Generate a polished lobby map JSON with a hand-composed layout.

Layout summary:
  - Central octagonal sand plaza w/ 2x2 water fountain centerpiece
  - Cross-shaped main paths (N, S, E, W spurs) feeding into plaza
  - Stone arcade building SE w/ sand approach off main artery
  - Framed pond NE w/ foam top edge and tree shoreline
  - Flower garden NW
  - Mushroom + tree grove SW
  - Tree-bush border perimeter w/ pond/arcade exclusions
  - Welcome sign south of plaza, lore sign north of plaza, bench east of plaza
"""
import json
import random
from pathlib import Path

W, H = 32, 22
TILE = 16
COLS = 64  # tileset columns

# --- Tile GIDs (verified visually) ---
GRASS = 130
GRASS_VARIANTS = [130] * 8 + [131, 132, 133, 134, 135]
GRASS_TUFT = [220, 221, 222, 223]
FLOWERS = [224, 225, 226, 227, 228]
MUSHROOMS = [314, 316, 372]
BUSH_SMALL = [285, 286, 287, 288]
BUSH_DARK = 250
BUSH_LIGHT = 252
TREE_VARIANTS = [305, 307, 308]
TREE_BIG = 308

# Sand path (verified: 491 = solid sand tile)
SAND = 491

# Water (full water variants, verified)
WATER_VARIANTS = [479, 480, 481, 482]
# Foam top edge (verified)
WATER_FOAM = [415, 416, 417, 418]

# Stone arcade walls (3x3 block)
STONE_TL, STONE_TM, STONE_TR = 109, 110, 111
STONE_ML, STONE_MM, STONE_MR = 173, 174, 175
STONE_BL, STONE_BM, STONE_BR = 237, 238, 239
ARCADE_DOOR = 614  # wooden door tile placed inside arcade

# Plaza decor
BLUE_GEM = 499  # small blue crystal accent

# Furniture
BENCH = 369
SIGN_POST = 425
SIGN_POST_ALT = 230

random.seed(13)


def empty_layer():
    return [0] * (W * H)


def in_bounds(x, y):
    return 0 <= x < W and 0 <= y < H


def at(layer, x, y, gid):
    if in_bounds(x, y):
        layer[y * W + x] = gid


def get(layer, x, y):
    if not in_bounds(x, y):
        return 0
    return layer[y * W + x]


# --- Map regions ---
PLAZA_X, PLAZA_Y, PLAZA_R = 15, 11, 4
ARCADE_X, ARCADE_Y = 24, 14  # building 3-wide x 3-tall (collides)
POND_X0, POND_Y0, POND_X1, POND_Y1 = 25, 2, 29, 6


def lay_horizontal_path(layer, y, x0, x1, thickness=3):
    half = thickness // 2
    for x in range(x0, x1 + 1):
        for dy in range(-half, half + 1):
            at(layer, x, y + dy, SAND)


def lay_vertical_path(layer, x, y0, y1, thickness=3):
    half = thickness // 2
    for y in range(y0, y1 + 1):
        for dx in range(-half, half + 1):
            at(layer, x + dx, y, SAND)


def lay_plaza(layer, cx, cy, radius):
    """Octagonal sand plaza for cleaner edges than circle."""
    for y in range(cy - radius, cy + radius + 1):
        for x in range(cx - radius, cx + radius + 1):
            dx, dy = x - cx, y - cy
            if abs(dx) + abs(dy) <= radius + 1 or (abs(dx) <= radius - 1 and abs(dy) <= radius - 1):
                at(layer, x, y, SAND)


def lay_fountain(layer, cx, cy):
    """3x3 water pool centered on plaza w/ foam top edge."""
    # Top row: foam edge
    at(layer, cx - 1, cy - 1, WATER_FOAM[0])
    at(layer, cx, cy - 1, WATER_FOAM[1])
    at(layer, cx + 1, cy - 1, WATER_FOAM[2])
    # Middle and bottom rows: full water
    for row_y in (cy, cy + 1):
        for col_x in (cx - 1, cx, cx + 1):
            at(layer, col_x, row_y, random.choice(WATER_VARIANTS))


def lay_pond(layer):
    """Pond with foam top edge."""
    for y in range(POND_Y0, POND_Y1 + 1):
        for x in range(POND_X0, POND_X1 + 1):
            if y == POND_Y0:
                # top row: foam variants
                at(layer, x, y, random.choice(WATER_FOAM))
            else:
                at(layer, x, y, random.choice(WATER_VARIANTS))


def lay_arcade(decor):
    """3x3 stone building w/ door in middle."""
    x0, y0 = ARCADE_X, ARCADE_Y
    # Top row (stone caps)
    at(decor, x0, y0, STONE_TL)
    at(decor, x0 + 1, y0, STONE_TM)
    at(decor, x0 + 2, y0, STONE_TR)
    # Middle row (walls + door window)
    at(decor, x0, y0 + 1, STONE_ML)
    at(decor, x0 + 1, y0 + 1, STONE_MM)
    at(decor, x0 + 2, y0 + 1, STONE_MR)
    # Bottom row (walls + door at center)
    at(decor, x0, y0 + 2, STONE_BL)
    at(decor, x0 + 1, y0 + 2, ARCADE_DOOR)
    at(decor, x0 + 2, y0 + 2, STONE_BR)


def in_pond_zone(x, y):
    return POND_X0 - 1 <= x <= POND_X1 + 1 and POND_Y0 - 1 <= y <= POND_Y1 + 1


def in_arcade_zone(x, y):
    # Building footprint + 1-tile front buffer for door approach
    return ARCADE_X <= x <= ARCADE_X + 2 and ARCADE_Y <= y <= ARCADE_Y + 3


def in_plaza_zone(x, y):
    return (x - PLAZA_X) ** 2 + (y - PLAZA_Y) ** 2 <= PLAZA_R * PLAZA_R + 1


def is_path(layer, x, y):
    return get(layer, x, y) == SAND


# --- Build layers ---
ground = empty_layer()
decor = empty_layer()
collision = empty_layer()

# 1. Base grass with subtle texture
for y in range(H):
    for x in range(W):
        at(ground, x, y, random.choice(GRASS_VARIANTS))

# 2. Central plaza
lay_plaza(ground, PLAZA_X, PLAZA_Y, PLAZA_R)

# 3. Main horizontal artery (W-E across plaza)
lay_horizontal_path(ground, PLAZA_Y, 2, W - 4)

# 4. North spur (lore sign access)
lay_vertical_path(ground, PLAZA_X, 3, PLAZA_Y - PLAZA_R)

# 5. South spur (toward border)
lay_vertical_path(ground, PLAZA_X, PLAZA_Y + PLAZA_R, H - 4)

# 6. Arcade approach: short branch off main path to building front
APPROACH_X = ARCADE_X + 1
for y in range(PLAZA_Y, ARCADE_Y + 3):
    at(ground, APPROACH_X, y, SAND)
    at(ground, APPROACH_X - 1, y, SAND) if y >= ARCADE_Y + 2 else None
    at(ground, APPROACH_X + 1, y, SAND) if y >= ARCADE_Y + 2 else None

# 7. Fountain in plaza center (overwrites sand)
lay_fountain(ground, PLAZA_X, PLAZA_Y)

# 8. Pond NE
lay_pond(ground)

# 9. Arcade building (decor layer)
lay_arcade(decor)

# 10. Tree-bush border perimeter
def border_safe(x, y):
    if in_pond_zone(x, y):
        return False
    if in_arcade_zone(x, y):
        return False
    if is_path(ground, x, y):
        return False
    return True

# Top + bottom edges
for x in range(W):
    for y in (0, H - 1):
        if border_safe(x, y):
            tile = random.choice(TREE_VARIANTS) if x % 2 == 0 else random.choice([BUSH_DARK, BUSH_LIGHT])
            at(decor, x, y, tile)
            at(collision, x, y, 1)

# Left + right edges
for y in range(1, H - 1):
    for x in (0, W - 1):
        if border_safe(x, y):
            tile = random.choice(TREE_VARIANTS) if y % 2 == 1 else random.choice([BUSH_DARK, BUSH_LIGHT])
            at(decor, x, y, tile)
            at(collision, x, y, 1)

# 11. Pond perimeter framing — trees & bushes hugging the shore
pond_frame_positions = []
# Left side of pond (x=POND_X0-1)
for y in range(POND_Y0, POND_Y1 + 1):
    pond_frame_positions.append((POND_X0 - 1, y))
# Bottom of pond
for x in range(POND_X0 - 1, POND_X1 + 1):
    pond_frame_positions.append((x, POND_Y1 + 1))

for x, y in pond_frame_positions:
    if not in_bounds(x, y) or get(decor, x, y) != 0:
        continue
    if is_path(ground, x, y):
        continue
    roll = random.random()
    if roll < 0.6:
        at(decor, x, y, random.choice(TREE_VARIANTS))
        at(collision, x, y, 1)
    elif roll < 0.9:
        at(decor, x, y, random.choice([BUSH_DARK, BUSH_LIGHT]))
        at(collision, x, y, 1)

# 12. Flower garden NW
def scatter(area, gids, density, layer=decor, mark_collision=False):
    for x, y in area:
        if not in_bounds(x, y):
            continue
        if get(decor, x, y) != 0:
            continue
        if is_path(ground, x, y):
            continue
        if random.random() < density:
            at(layer, x, y, random.choice(gids))
            if mark_collision:
                at(collision, x, y, 1)

garden_area = [(x, y) for x in range(2, 9) for y in range(2, 7)]
scatter(garden_area, FLOWERS, 0.30)
scatter(garden_area, GRASS_TUFT, 0.20)
scatter(garden_area, BUSH_SMALL, 0.05)

# 13. Mushroom grove SW
grove_area = [(x, y) for x in range(2, 9) for y in range(14, H - 2)]
scatter(grove_area, MUSHROOMS, 0.20)
scatter(grove_area, TREE_VARIANTS, 0.10, mark_collision=True)
scatter(grove_area, GRASS_TUFT, 0.20)

# 14. Scattered grass tufts + flowers across meadow
for y in range(1, H - 1):
    for x in range(1, W - 1):
        if get(decor, x, y) != 0:
            continue
        if is_path(ground, x, y):
            continue
        if in_plaza_zone(x, y):
            continue
        if in_pond_zone(x, y):
            continue
        if in_arcade_zone(x, y):
            continue
        r = random.random()
        if r < 0.04:
            at(decor, x, y, random.choice(GRASS_TUFT))
        elif r < 0.06:
            at(decor, x, y, random.choice(FLOWERS))
        elif r < 0.065:
            at(decor, x, y, random.choice(BUSH_SMALL))

# 15. Flower wreath framing the fountain (4 corners of fountain perimeter)
FOUNTAIN_FRAME = [
    (PLAZA_X - 2, PLAZA_Y - 2),
    (PLAZA_X + 2, PLAZA_Y - 2),
    (PLAZA_X - 2, PLAZA_Y + 2),
    (PLAZA_X + 2, PLAZA_Y + 2),
]
for x, y in FOUNTAIN_FRAME:
    if get(decor, x, y) == 0:
        at(decor, x, y, random.choice(FLOWERS))

# 15b. Small grass/flower tufts on plaza ring (between fountain and plaza edge)
PLAZA_RING = []
for dy in range(-PLAZA_R, PLAZA_R + 1):
    for dx in range(-PLAZA_R, PLAZA_R + 1):
        if abs(dx) + abs(dy) == PLAZA_R - 1:
            PLAZA_RING.append((PLAZA_X + dx, PLAZA_Y + dy))
random.shuffle(PLAZA_RING)
for x, y in PLAZA_RING[:4]:
    if get(decor, x, y) == 0 and is_path(ground, x, y):
        at(decor, x, y, random.choice(GRASS_TUFT))

# 16. Blue crystals near pond shore + by arcade as glimmer accents
GEM_SPOTS = [
    (POND_X0 - 1, POND_Y1 + 1),
    (POND_X1 + 1, POND_Y1 + 1),
    (ARCADE_X + 4, ARCADE_Y + 1),
]
for x, y in GEM_SPOTS:
    if in_bounds(x, y) and get(decor, x, y) == 0 and not is_path(ground, x, y):
        at(decor, x, y, BLUE_GEM)

# 17. Bench east of plaza (on plaza edge)
BENCH_X, BENCH_Y = PLAZA_X + 3, PLAZA_Y + 1
at(decor, BENCH_X, BENCH_Y, BENCH)

# 17b. Decorative bushes flanking arcade façade
for dx in (-1, 3):
    fx, fy = ARCADE_X + dx, ARCADE_Y + 2
    if in_bounds(fx, fy) and get(decor, fx, fy) == 0 and not is_path(ground, fx, fy):
        at(decor, fx, fy, random.choice([BUSH_DARK, BUSH_LIGHT]))
        at(collision, fx, fy, 1)

# 18. Welcome sign south of plaza
SIGN_WELCOME_X, SIGN_WELCOME_Y = PLAZA_X - 1, PLAZA_Y + PLAZA_R + 1
at(decor, SIGN_WELCOME_X, SIGN_WELCOME_Y, SIGN_POST)

# 19. Lore sign on north spur
SIGN_LORE_X, SIGN_LORE_Y = PLAZA_X + 1, 5
at(decor, SIGN_LORE_X, SIGN_LORE_Y, SIGN_POST_ALT)

# 20. Mark collision for arcade building footprint + pond + fountain
for dy in range(3):
    for dx in range(3):
        at(collision, ARCADE_X + dx, ARCADE_Y + dy, 1)
for y in range(POND_Y0, POND_Y1 + 1):
    for x in range(POND_X0, POND_X1 + 1):
        at(collision, x, y, 1)
# Fountain 3x3
for dy in (-1, 0, 1):
    for dx in (-1, 0, 1):
        at(collision, PLAZA_X + dx, PLAZA_Y + dy, 1)

# --- Build JSON ---
layers = [
    {
        "data": ground,
        "height": H, "id": 1, "name": "ground",
        "opacity": 1, "type": "tilelayer", "visible": True,
        "width": W, "x": 0, "y": 0,
    },
    {
        "data": decor,
        "height": H, "id": 2, "name": "decor",
        "opacity": 1, "type": "tilelayer", "visible": True,
        "width": W, "x": 0, "y": 0,
    },
    {
        "data": collision,
        "height": H, "id": 3, "name": "collision",
        "opacity": 1, "type": "tilelayer", "visible": False,
        "width": W, "x": 0, "y": 0,
    },
    {
        "draworder": "topdown",
        "id": 4,
        "name": "triggers",
        "objects": [
            {
                "height": 16, "id": 1, "name": "Bench",
                "type": "bench", "visible": True, "width": 16,
                "x": BENCH_X * TILE, "y": BENCH_Y * TILE,
                "rotation": 0, "properties": [],
            },
            {
                "height": 16, "id": 2, "name": "Welcome Sign",
                "type": "sign", "visible": True, "width": 16,
                "x": SIGN_WELCOME_X * TILE, "y": SIGN_WELCOME_Y * TILE,
                "rotation": 0,
                "properties": [
                    {"name": "title", "type": "string", "value": "WELCOME, traveler"},
                    {
                        "name": "body",
                        "type": "string",
                        "value": "WASD or arrows to move.\nSpace = throw snowball.\nF = punch.  E = emote wheel.\nZ = interact (read signs, sit, enter arcade).\nEnter = chat.",
                    },
                ],
            },
            {
                "height": 16, "id": 3, "name": "Lore Sign",
                "type": "sign", "visible": True, "width": 16,
                "x": SIGN_LORE_X * TILE, "y": SIGN_LORE_Y * TILE,
                "rotation": 0,
                "properties": [
                    {"name": "title", "type": "string", "value": "ABOUT THIS PLACE"},
                    {
                        "name": "body",
                        "type": "string",
                        "value": "A field built for hangouts.\nAkash's portfolio side-project.\nStay as long as you like.",
                    },
                ],
            },
            {
                "height": 16, "id": 4, "name": "Arcade Door",
                "type": "arcade", "visible": True, "width": 16,
                "x": (ARCADE_X + 1) * TILE, "y": (ARCADE_Y + 3) * TILE,
                "rotation": 0, "properties": [],
            },
        ],
        "opacity": 1, "type": "objectgroup", "visible": True,
        "x": 0, "y": 0,
    },
]

# Preserve tileset reference from existing JSON
existing = json.loads(Path("public/lobby/maps/lobby.json").read_text())

new_map = {
    "compressionlevel": -1,
    "height": H,
    "infinite": False,
    "layers": layers,
    "nextlayerid": 5,
    "nextobjectid": 5,
    "orientation": "orthogonal",
    "renderorder": "right-down",
    "tiledversion": "1.10.0",
    "tileheight": TILE,
    "tilesets": existing["tilesets"],
    "tilewidth": TILE,
    "type": "map",
    "version": "1.10",
    "width": W,
}

Path("public/lobby/maps/lobby.json").write_text(json.dumps(new_map, indent=2))
print(f"wrote public/lobby/maps/lobby.json — {W}x{H}")
