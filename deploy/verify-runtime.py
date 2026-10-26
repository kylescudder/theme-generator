#!/usr/bin/env python3
"""Verify a running release's identity, assets, caching and missing routes."""
from html.parser import HTMLParser
import json
import re
import sys
import time
from urllib.error import HTTPError, URLError
from urllib.request import urlopen


class Assets(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = set()

    def handle_starttag(self, tag, attributes):
        for key, value in attributes:
            if key in ('src', 'href') and value and value.startswith('/_astro/'):
                self.urls.add(value)


def verify(base, revision):
    if not re.fullmatch(r'[0-9a-f]{40}', revision):
        raise ValueError('Expected a complete Git commit SHA')
    # Allow the newly started container to begin listening, bounded to 20 seconds.
    for attempt in range(40):
        try:
            with urlopen(base + '/healthz', timeout=2) as response:
                assert response.headers['X-Theme-Generator-Revision'] == revision
                assert response.headers['Cache-Control'] == 'no-store'
                assert json.load(response) == {'ok': True, 'revision': revision}
            break
        except (URLError, ConnectionError):
            if attempt == 39:
                raise
            time.sleep(0.5)
    with urlopen(base + '/', timeout=10) as response:
        assert response.headers['X-Theme-Generator-Revision'] == revision
        assert response.headers['X-Content-Type-Options'] == 'nosniff'
        html = response.read().decode()
        assert 'mpro5 Theme Generator' in html
    assets = Assets()
    assets.feed(html)
    assert assets.urls, 'No production assets found'
    for path in sorted(assets.urls):
        with urlopen(base + path, timeout=10) as response:
            assert response.status == 200 and response.read(), path
            assert 'immutable' in response.headers.get('Cache-Control', ''), path
    for path in ('/missing-theme-route', '/_astro/missing.js'):
        try:
            urlopen(base + path, timeout=10)
            raise AssertionError('Expected 404 for ' + path)
        except HTTPError as error:
            assert error.code == 404, path
    print(f'PASS: release {revision}, health, home, {len(assets.urls)} assets, caching and two 404s')


if __name__ == '__main__':
    if len(sys.argv) != 3:
        raise SystemExit('Usage: verify-runtime.py https://hostname <commit-sha>')
    verify(sys.argv[1].rstrip('/'), sys.argv[2])
