#!/usr/bin/env python3
"""Crop tileset by GID and render a labeled preview grid for visual selection."""
from PIL import Image, ImageDraw, ImageFont

TILE = 16
COLS = 64
SRC = Image.open("public/lobby/sunnyside/tileset.png").convert("RGBA")

def get(gid):
    idx = gid - 1
    cx = (idx % COLS) * TILE
    cy = (idx // COLS) * TILE
    return SRC.crop((cx, cy, cx + TILE, cy + TILE))

# Render a band: for each candidate group, show GIDs from g_start..g_start+span across the strip.
groups = [
    ("sand-band", 68, 8),
    ("sand-row2", 132, 8),
    ("sand-edges", 484, 12),
    ("sand-edges2", 548, 12),
    ("dark-row1", 12, 16),
    ("dark-row2", 76, 16),
    ("dark-row3", 140, 16),
    ("rocks", 433, 16),
    ("rocks2", 497, 16),
    ("ground-extra-a", 820, 16),
    ("ground-extra-b", 884, 16),
    ("ground-extra-c", 948, 16),
    ("misc-1000s", 1012, 16),
    ("misc-1500s", 1500, 16),
    ("misc-2000s", 2000, 16),
    ("misc-2500s", 2500, 16),
    ("misc-3000s", 3000, 16),
]

scale = 4
pad = 2
label_h = 14
band_h = TILE * scale + label_h + pad * 2
band_w = max(g[2] for g in groups) * (TILE * scale + 2) + 80

out = Image.new("RGBA", (band_w + 20, band_h * len(groups) + 10), (20, 24, 40, 255))
draw = ImageDraw.Draw(out)

for row, (name, start, count) in enumerate(groups):
    y = row * band_h + pad
    draw.text((4, y + 4), name, fill=(220, 220, 220, 255))
    for i in range(count):
        gid = start + i
        tile = get(gid).resize((TILE * scale, TILE * scale), Image.NEAREST)
        x = 80 + i * (TILE * scale + 2)
        out.paste(tile, (x, y))
        draw.text((x, y + TILE * scale + 1), str(gid), fill=(180, 180, 180, 255))

out.save("scripts/tile-preview.png")
print("wrote scripts/tile-preview.png", out.size)
