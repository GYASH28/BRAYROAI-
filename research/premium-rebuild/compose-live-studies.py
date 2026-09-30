"""Make temporary desktop/scroll/mobile contact sheets from the direct live audit."""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path('/tmp/brayroai-awards-research')
LIVE = ROOT / 'live'
records = json.loads(Path(__file__).with_name('award-records.json').read_text())
audits = json.loads((LIVE / 'site-audit.json').read_text())
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 17)
small = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 12)

for start in range(0, 50, 5):
    sheet = Image.new('RGB', (1240, 1540), '#e9e5dc')
    draw = ImageDraw.Draw(sheet)
    for index in range(start, start + 5):
        source = records[index]
        row = audits[index]
        top = 15 + (index - start) * 305
        draw.text((18, top), f"{index + 1:02d}. {source['name']}  /  {source['galleryCollection'].upper()}", fill='#15171b', font=font)
        cells = [
            ('LIVE / OPEN', LIVE / row.get('files', {}).get('desktopOpen', 'missing'), (18, top + 30, 464, 270)),
            ('LIVE / SCROLL', LIVE / row.get('files', {}).get('desktopAfterOne', 'missing'), (494, top + 30, 464, 270)),
            ('PHONE / OPEN', LIVE / row.get('files', {}).get('mobileOpen', 'missing'), (972, top + 30, 244, 270)),
        ]
        for label, path, box in cells:
            x, y, width, height = box
            draw.rectangle((x, y, x + width, y + height), fill='#d1cdc4')
            if not path.is_file() and label == 'LIVE / OPEN':
                path = ROOT / f"{source['slug']}.png"
                label = 'AWARD POSTER'
            if path.is_file():
                image = Image.open(path).convert('RGB')
                image = ImageOps.contain(image, (width, height), Image.Resampling.LANCZOS)
                sheet.paste(image, (x + (width - image.width) // 2, y + (height - image.height) // 2))
            else:
                draw.text((x + 15, y + 90), 'CAPTURE LIMITED', fill='#3d3d3d', font=small)
            draw.rectangle((x, y, x + width, y + 23), fill='#15171b')
            draw.text((x + 8, y + 4), label, fill='#f4eee7', font=small)
    path = LIVE / f"deep-study-{start // 5 + 1:02d}.jpg"
    sheet.save(path, quality=88, optimize=True)
    print(path)
