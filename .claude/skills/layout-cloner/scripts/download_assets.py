#!/usr/bin/env python3
"""
Asset-Akquise für den Layout-Cloner-Skill.

Lädt eine Ziel-Webseite, extrahiert daraus referenzierte visuelle Assets
(Bilder, SVGs, Hintergrundbilder, <link rel=icon>) und sichert sie lokal.
Reine Standardbibliothek – keine externen Abhängigkeiten (pip nicht nötig).

Beispiel:
    python3 download_assets.py --url "https://example.ch" --output ./public
"""

from __future__ import annotations

import argparse
import os
import re
import sys
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen

USER_AGENT = "Mozilla/5.0 (compatible; layout-cloner/1.0; +https://claude.com/claude-code)"
ASSET_ATTRS = {"src", "href", "data-src", "poster"}
ASSET_EXT = (".svg", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".ico", ".avif")


class AssetParser(HTMLParser):
    """Sammelt Asset-URLs aus Tag-Attributen und inline-styles."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.urls: set[str] = set()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        for name, value in attrs:
            if not value:
                continue
            if name in ASSET_ATTRS and value.lower().endswith(ASSET_EXT):
                self.urls.add(value)
            if name == "srcset":
                for part in value.split(","):
                    candidate = part.strip().split(" ")[0]
                    if candidate.lower().endswith(ASSET_EXT):
                        self.urls.add(candidate)
            if name == "style":
                self.urls.update(_urls_from_css(value))


def _urls_from_css(text: str) -> set[str]:
    """Extrahiert url(...)-Referenzen aus CSS-Text."""
    found: set[str] = set()
    for match in re.findall(r"url\(([^)]+)\)", text):
        cleaned = match.strip().strip("'\"")
        if cleaned.lower().endswith(ASSET_EXT):
            found.add(cleaned)
    return found


def _fetch(url: str) -> bytes:
    req = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(req, timeout=30) as resp:  # noqa: S310 (trusted target URL)
        return resp.read()


def _safe_filename(asset_url: str, index: int) -> str:
    path = urlparse(asset_url).path
    base = os.path.basename(path) or f"asset_{index}"
    base = re.sub(r"[^A-Za-z0-9._-]", "_", base)
    if not base.lower().endswith(ASSET_EXT):
        base += ".bin"
    return base


def download_assets(url: str, output: str) -> int:
    os.makedirs(output, exist_ok=True)

    print(f"[layout-cloner] Lade Seite: {url}")
    html = _fetch(url).decode("utf-8", errors="replace")

    parser = AssetParser()
    parser.feed(html)
    # Zusätzlich CSS-url() aus dem gesamten Dokument (inline <style>-Blöcke).
    parser.urls.update(_urls_from_css(html))

    absolute = {urljoin(url, u) for u in parser.urls}
    print(f"[layout-cloner] {len(absolute)} Asset-Kandidaten gefunden.")

    saved = 0
    for i, asset_url in enumerate(sorted(absolute)):
        try:
            data = _fetch(asset_url)
        except Exception as exc:  # pragma: no cover - Netzwerkfehler tolerieren
            print(f"  [skip] {asset_url} ({exc})", file=sys.stderr)
            continue
        filename = _safe_filename(asset_url, i)
        dest = os.path.join(output, filename)
        with open(dest, "wb") as fh:
            fh.write(data)
        saved += 1
        print(f"  [ok]   {filename}  ({len(data)} bytes)")

    print(f"[layout-cloner] {saved} Assets gesichert in: {output}")
    return saved


def main() -> int:
    ap = argparse.ArgumentParser(description="Asset-Downloader für layout-cloner")
    ap.add_argument("--url", required=True, help="Quell-URL der Ziel-Webseite")
    ap.add_argument("--output", required=True, help="Zielordner für Assets")
    args = ap.parse_args()
    try:
        download_assets(args.url, args.output)
    except Exception as exc:
        print(f"[layout-cloner] Fehler: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
