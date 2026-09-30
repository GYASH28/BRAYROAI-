"""Save provenance without copying third-party screenshots or page text into Git."""
import json
from pathlib import Path

here = Path(__file__).parent
audits = json.loads(Path('/tmp/brayroai-awards-research/live/site-audit.json').read_text())
records = json.loads((here / 'award-records.json').read_text())
summary = []
for record, row in zip(records, audits):
    assert record['name'] == row['name']
    files = row.get('files', {})
    settled = row.get('settled') or {}
    summary.append({
        'index': record['index'] + 1,
        'name': row['name'],
        'galleryCollection': record['galleryCollection'],
        'awardUrl': record['awardUrl'],
        'liveUrl': row['liveUrl'],
        'desktopHttp': row.get('http'),
        'mobileHttp': row.get('mobileHttp'),
        'settledHttp': settled.get('http'),
        'desktopOpenCaptured': 'desktopOpen' in files,
        'desktopScrollCaptured': 'desktopAfterOne' in files,
        'mobileOpenCaptured': 'mobileOpen' in files,
        'mobileScrollCaptured': 'mobileAfterOne' in files,
        'delayedOpenCaptured': 'settled' in files,
        'delayedScrollCaptured': 'settledScroll' in files,
        'entryActionObserved': settled.get('action'),
        'desktopDocumentScrollable': (row.get('desktopOpen') or {}).get('pageHeight', 0) > 900,
        'mobileDocumentScrollable': (row.get('mobileOpen') or {}).get('pageHeight', 0) > 900,
        'delayedDocumentScrollable': (settled.get('beforeAction') or {}).get('height', 0) > 900,
        'limits': ['Cloudflare challenge'] if row.get('http') == 403 else ['TLS / origin error'] if row.get('http') == 525 else [],
    })
(here / 'live-audit-summary.json').write_text(json.dumps(summary, indent=2) + '\n')
print('official records', len(records), 'unique award URLs', len({x['awardUrl'] for x in records}))
for label, key in [('desktop open', 'desktopOpenCaptured'), ('desktop scroll', 'desktopScrollCaptured'), ('mobile open', 'mobileOpenCaptured'), ('mobile scroll', 'mobileScrollCaptured'), ('delayed open', 'delayedOpenCaptured'), ('delayed scroll', 'delayedScrollCaptured')]:
    print(label, sum(x[key] for x in summary))
