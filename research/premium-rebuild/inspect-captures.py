"""Create temporary contact sheets of the public award captures for visual study.

The images are references only. They are never copied into the website or Git.
"""
import concurrent.futures
import io
import json
from pathlib import Path
import urllib.request
from bs4 import BeautifulSoup
from PIL import Image, ImageDraw, ImageFont

ROOT = Path('/tmp/brayroai-awards-research')
ROWS = json.loads(Path(__file__).with_name('award-records.json').read_text())

def capture(row):
    try:
        soup = BeautifulSoup((ROOT / (row['slug'] + '.html')).read_text(), 'html.parser')
        image = soup.select_one('img.gallery-site__img')
        url = image.get('data-src') or image.get('src')
        path = ROOT / (row['slug'] + '.png')
        if not path.exists():
            request = urllib.request.Request(url, headers={'User-Agent':'Mozilla/5.0'})
            path.write_bytes(urllib.request.urlopen(request, timeout=30).read())
        row['captureSource'] = url
        return row
    except Exception as error:
        row['captureError'] = str(error)
        return row

with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    rows = list(pool.map(capture, ROWS))
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 22)
for start in range(0,50,5):
    sheet = Image.new('RGB', (1440,1560), '#ece9df')
    draw = ImageDraw.Draw(sheet)
    for k,row in enumerate(rows[start:start+5]):
        x, y = (k%2)*720, (k//2)*520
        draw.text((x+16,y+12), str(row['index']+1)+'. '+row['name'],fill='#161616',font=font)
        path = ROOT / (row['slug']+'.png')
        if path.exists():
            image = Image.open(path).convert('RGB')
            image.thumbnail((688,462))
            sheet.paste(image,(x+16,y+48))
        else:
            draw.text((x+16,y+60),'Capture unavailable',font=font,fill='#161616')
    path = ROOT / ('study-%02d.jpg' % (start//5+1))
    sheet.save(path, quality=92)
    print(path)
Path(__file__).with_name('award-records.json').write_text(json.dumps(rows,indent=2)+'\n')
