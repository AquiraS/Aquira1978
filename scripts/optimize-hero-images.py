#!/usr/bin/env python3
"""Create a responsive desktop hero derivative without altering source originals."""

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "media" / "aquira-archive-interior.webp"
OUTPUT = ROOT / "media" / "aquira-archive-interior-1440.webp"
TARGET_WIDTH = 1440
QUALITY = 84


def main() -> None:
    with Image.open(SOURCE) as source:
        width, height = source.size
        if width <= TARGET_WIDTH:
            raise ValueError(f"Source width must exceed {TARGET_WIDTH}px; received {width}px.")
        target_height = round(height * TARGET_WIDTH / width)
        resized = source.resize((TARGET_WIDTH, target_height), Image.Resampling.LANCZOS)
        resized.save(OUTPUT, "WEBP", quality=QUALITY, method=6)
    print(f"Created {OUTPUT.relative_to(ROOT)} ({TARGET_WIDTH}×{target_height}, quality={QUALITY}).")


if __name__ == "__main__":
    main()
