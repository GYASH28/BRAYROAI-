"""Make temporary contact sheets for the delayed-entry part of the live audit."""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

live = Path('/tmp/brayroai-awards-research/live')
rows = json.loads((live / 'site-audit.json').read_text())
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 17)
small = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 12)
delayed = [row for row in rows if row.get('settled')]

for start in range(0, len(delayed), 5):
    sheet = Image.new('RGB', (1280, 1540), '#e9e5dc')
    draw = ImageDraw.Draw(sheet)
    for offset, row in enumerate(delayed[start:start + 5]):
        top = 15 + offset * 305
        draw.text((18, top), f"{row['index']:02d}. {row['name']}", fill='#15171b', font=font)
        for label, name, x, width in [
            ('OPEN', row['files'].get('desktopOpen'), 18, 390),
            ('SETTLED', row['files'].get('settled'), 425, 390),
            ('SCROLL AFTER SETTLE', row['files'].get('settledScroll'), 832, 390),
        ]:
            y = top + 30
            draw.rectangle((x, y, x + width, y + 270), fill='#d1cdc4')
            path = live / name if name else None
            if path and path.is_file():
                img = Image.open(path).convert('RGB')
                img = ImageOps.contain(img, (width, 270), Image.Resampling.LANCZOS)
                sheet.paste(img, (x + (width - img.width) // 2, y + (270 - img.height) // 2))
            else:
                draw.text((x + 15, y + 90), 'NO CAPTURE', fill='#3d3d3d', font=small)
            draw.rectangle((x, y, x + width, y + 23), fill='#15171b')
            draw.text((x + 8, y + 4), label, fill='#f4eee7', font=small)
    path = live / f'settled-study-{start // 5 + 1:02d}.jpg'
    sheet.save(path, quality=88, optimize=True)
    print(path)
