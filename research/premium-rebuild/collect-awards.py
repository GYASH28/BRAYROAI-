"""Collect a correctly balanced, link-verifiable 50-project Awwwards sample.

Selections are taken from the official Sites of the Day, Month, and Year
galleries, then checked against each project's public detail page. Captures
remain temporary research material; they are never used as website assets.
"""
import concurrent.futures
import json
from pathlib import Path
import re
import urllib.request
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent
CACHE = Path('/tmp/brayroai-awards-research')
CACHE.mkdir(exist_ok=True)
HEADERS = {'User-Agent': 'Mozilla/5.0 (compatible; BRAYROAI-research/1.0)'}

def fetch(url):
    request = urllib.request.Request(url, headers=HEADERS)
    return urllib.request.urlopen(request, timeout=35).read().decode('utf-8')

def gallery(path):
    url = 'https://www.awwwards.com/websites/' + path + '/'
    html = fetch(url)
    (CACHE / (path + '.html')).write_text(html)
    soup = BeautifulSoup(html, 'html.parser')
    slugs = []
    for a in soup.select('a[href^="/sites/"]'):
        match = re.fullmatch(r'/sites/([a-z0-9-]+)', a.get('href', ''))
        if match and match.group(1) not in slugs:
            slugs.append(match.group(1))
    return {'title': soup.title.get_text(' ', strip=True), 'url': url,
            'slugs': slugs}

def project(slug, collection, ordinal, source):
    url = 'https://www.awwwards.com/sites/' + slug
    try:
        cached = CACHE / (slug + '.html')
        html = cached.read_text() if cached.exists() else fetch(url)
        (CACHE / (slug + '.html')).write_text(html)
        soup = BeautifulSoup(html, 'html.parser')
        h1 = soup.find('h1')
        name = h1.get_text(' ', strip=True) if h1 else slug
        live = h1.find('a').get('href') if h1 and h1.find('a') else None
        sections = {}
        for heading in soup.find_all('h2'):
            key = heading.get_text(' ', strip=True)
            if key in ['Description', 'Color Palette', 'Technologies & Tools', 'Elements']:
                parent = heading.find_parent(class_='block')
                sections[key] = parent.get_text(' ', strip=True) if parent else key
        highlights = list(dict.fromkeys(
            a.get('href') for a in soup.select('a[href^="/inspiration/"]')))
        awards = [h.get_text(' ', strip=True) for h in soup.find_all('h2')
                  if re.search(r'Site of the|SOTD / SCORE|DEV AWARD', h.get_text())]
        capture = soup.select_one('img.gallery-site__img')
        capture_url = ((capture.get('data-src') or capture.get('src')) if capture else None)
        return {
            'index': ordinal, 'slug': slug, 'name': name,
            'awardUrl': url, 'liveUrl': live,
            'galleryCollection': collection,
            'collectionGalleryUrl': source['url'],
            'collectionGalleryTitle': source['title'],
            'detailPageAwardLabels': awards,
            'sections': sections, 'highlights': highlights,
            'sourceAccess': 'read-public-record', 'captureSource': capture_url,
            'liveStudy': 'not-yet-observed',
        }
    except Exception as error:
        return {'index': ordinal, 'slug': slug, 'awardUrl': url,
                'galleryCollection': collection,
                'collectionGalleryUrl': source['url'],
                'sourceAccess': 'failed', 'error': str(error)}

def main():
    galleries = {
        'day': gallery('sites_of_the_day'),
        'month': gallery('sites_of_the_month'),
        'year': gallery('sites_of_the_year'),
    }
    # The result is 20 recent daily awards, 20 actual monthly-gallery entries,
    # and 10 distinct annual-gallery entries. Every selected page points to its
    # source gallery; duplicates are avoided rather than relabelled.
    selected = []
    selected += [('day', slug, galleries['day'])
                 for slug in galleries['day']['slugs'][:20]]
    selected += [('month', slug, galleries['month'])
                 for slug in galleries['month']['slugs'][:20]]
    used = {slug for _, slug, _ in selected}
    for slug in galleries['year']['slugs']:
        if slug not in used:
            selected.append(('year', slug, galleries['year']))
            used.add(slug)
            if sum(1 for collection, _, _ in selected if collection == 'year') == 10:
                break
    jobs = [(index, row) for index, row in enumerate(selected)]
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
        records = list(pool.map(lambda job: project(job[1][1], job[1][0],
                                                     job[0], job[1][2]), jobs))
    (ROOT / 'award-records.json').write_text(json.dumps(records, indent=2) + '\n')
    print('gallery totals:', {key: len(value['slugs']) for key, value in galleries.items()})
    print('selected totals:', {key: sum(r.get('galleryCollection') == key for r in records)
                               for key in galleries})
    print('successful detail pages:', sum(r['sourceAccess'] == 'read-public-record'
                                           for r in records), '/', len(records))
    for record in records:
        print(record['index'], record.get('galleryCollection'),
              record.get('name', record['slug']), record['sourceAccess'])

if __name__ == '__main__':
    main()
