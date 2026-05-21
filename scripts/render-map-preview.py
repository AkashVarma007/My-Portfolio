#!/usr/bin/env python3
"""Composite the lobby Tiled JSON map into a single PNG so we can visually inspect."""
import json
from pathlib import Path
from PIL import Image

TILE = 16
COLS = 64

tileset = Image.open("public/lobby/sunnyside/tileset.png").convert("RGBA")
doc = json.loads(Path("public/lobby/maps/lobby.json").read_text())
W, H = doc["width"], doc["height"]
out = Image.new("RGBA", (W * TILE, H * TILE), (0, 0, 0, 0))

def crop_gid(gid):
    idx = gid - 1
    cx = (idx % COLS) * TILE
    cy = (idx // COLS) * TILE
    return tileset.crop((cx, cy, cx + TILE, cy + TILE))

for layer in doc["layers"]:
    if layer.get("type") != "tilelayer":
        continue
    if not layer.get("visible", True):
        continue
    data = layer["data"]
    for i, gid in enumerate(data):
        if gid <= 0:
            continue
        x = (i % W) * TILE
        y = (i // W) * TILE
        out.alpha_composite(crop_gid(gid), (x, y))

scale = 3
preview = out.resize((W * TILE * scale, H * TILE * scale), Image.NEAREST)
preview.save("scripts/map-preview.png")
print("wrote scripts/map-preview.png", preview.size)
