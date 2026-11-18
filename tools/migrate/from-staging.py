#!/usr/bin/env python3
"""One-off port of the published Webflow staging page into the Astro project.

Reads the saved staging Home (index.html) and its stylesheet (site.css), downloads every asset
that lives on the Webflow CDN into public/, rewrites the URLs and splits the body into one
.astro component per section, markup kept as published.

Usage: python3 tools/migrate/from-staging.py <dir with index.html + site.css> <project root> [--no-download]
"""
import re
import sys
import subprocess
import urllib.parse
from pathlib import Path

src_dir, root = Path(sys.argv[1]), Path(sys.argv[2])
download = '--no-download' not in sys.argv
html = (src_dir / 'index.html').read_text()
css = (src_dir / 'site.css').read_text()

# File names may hold parentheses ("…00000 (1).png"); in the stylesheet a URL ends at the bracket of url(…).
CDN = re.compile(r'https://cdn\.prod\.website-files\.com/[0-9a-f]{24}/[^\s"\'<>]+')
CDN_CSS = re.compile(r'https://cdn\.prod\.website-files\.com/[0-9a-f]{24}/[^\s"\'()]+')
SKIP = re.compile(r'/(css|js)/[^/]+$')
FONT = re.compile(r'\.(woff2?|ttf|otf)$', re.I)

# ---------- assets ----------

urls = sorted({u for u in CDN.findall(html) + CDN_CSS.findall(css) if not SKIP.search(u)})
names, taken = {}, {}
for u in urls:
    base = urllib.parse.unquote(u.rsplit('/', 1)[1])
    m = re.match(r'([0-9a-f]{24})_(.+)$', base)
    file_id, name = (m.group(1), m.group(2)) if m else ('', base)
    name = re.sub(r'[^A-Za-z0-9._-]+', '-', name).strip('-')
    if name.lower() in taken and taken[name.lower()] != u:
        stem, dot, ext = name.rpartition('.')
        name = f'{stem}-{file_id[-4:]}{dot}{ext}'
    taken[name.lower()] = u
    names[u] = ('/fonts/' if FONT.search(name) else '/assets/') + name

for u, local in names.items():
    dest = root / 'public' / local.lstrip('/')
    dest.parent.mkdir(parents=True, exist_ok=True)
    if download and not dest.exists():
        # Into a temporary name first: a transfer cut half-way must not pass for a finished file on the next run.
        part = dest.with_name(dest.name + '.part')
        subprocess.run(['curl', '-sf', '--retry', '5', '--retry-all-errors', '-o', str(part), u], check=True)
        part.rename(dest)

def localize(text):
    # Longest first: "x.png" is a prefix of "x.png 500w" neighbours only by coincidence, but be safe.
    for u in sorted(names, key=len, reverse=True):
        text = text.replace(u, names[u])
    return text

html, css = localize(html), localize(css)
left = sorted(set(CDN.findall(html) + CDN_CSS.findall(css)))
print(f'assets: {len(names)} localized; still on the Webflow CDN: {[u for u in left if not SKIP.search(u)]}')

# ---------- stylesheet ----------

(root / 'src/styles').mkdir(parents=True, exist_ok=True)
(root / 'src/styles/site.css').write_text(
    '/* Published stylesheet of the Webflow build (2026-11-18), asset URLs made local. */\n' + css + '\n'
)

# ---------- body split ----------

VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}
TAG = re.compile(r'<!--.*?-->|<(/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|\'[^\']*\'|[^>"\'])*?)(/?)>', re.S)

def children(outer):
    """Top-level child elements of an element given as its outer HTML: [(tag, attrs, outer html)]."""
    out, depth, start, pos = [], 0, None, 0
    first = TAG.match(outer)
    pos = first.end()
    while True:
        m = TAG.search(outer, pos)
        if not m:
            break
        pos = m.end()
        if m.group(0).startswith('<!--'):
            continue
        close, tag, attrs, selfclose = m.groups()
        tag_l = tag.lower()
        if close:
            depth -= 1
            if depth == 0:
                out[-1] = (*out[-1], outer[start:m.end()])
            if depth < 0:
                break
            continue
        is_void = bool(selfclose) or tag_l in VOID
        if depth == 0:
            start = m.start()
            out.append((tag_l, attrs))
            if is_void:
                out[-1] = (*out[-1], outer[start:m.end()])
        if tag_l in ('script', 'style') and not is_void:
            end = outer.index(f'</{tag}>', pos)
            pos = end + len(tag) + 3
            if depth == 0:
                out[-1] = (*out[-1], outer[start:pos])
            continue
        if not is_void:
            depth += 1
    return out

def cls(attrs):
    m = re.search(r'class="([^"]*)"', attrs)
    return m.group(1).split() if m else []

def ident(attrs):
    m = re.search(r'\bid="([^"]*)"', attrs)
    return m.group(1) if m else ''

body = html[html.index('<body'):html.index('</body>') + 7]
parts = {}
order = []

def take(name, outer):
    parts[name] = outer
    order.append(name)

for tag, attrs, outer in children(body):
    c = cls(attrs)
    if tag == 'script' or 'code-embed' in c:
        continue  # webflow.js / jQuery; the rem embed lives in src/styles-rem.html
    if 'site-nav' in c: take('SiteNav', outer)
    elif 'site-sound' in c: take('SiteSound', outer)
    elif 'section-preloader' in c: take('Preloader', outer)
    elif 'cta-modal' in c: take('CtaModal', outer)
    elif 'main' in c:
        for t2, a2, o2 in children(outer):
            c2 = cls(a2)
            if 'section-lessons' in c2:
                for t3, a3, o3 in children(o2):
                    take('lessons/Lesson' + ident(a3).capitalize(), o3)
            elif 'site-footer' in c2: take('SiteFooter', o2)
            else:
                sec = next(x for x in c2 if x.startswith('section-'))
                take(sec.replace('section-', '').capitalize(), o2)
    else:
        raise SystemExit(f'unexpected body child: {tag} {attrs[:80]}')

tmp = root / 'tools/migrate/.tmp'
tmp.mkdir(parents=True, exist_ok=True)
for name, outer in parts.items():
    if '{' in re.sub(r'="[^"]*"', '', outer):
        raise SystemExit(f'{name}: a curly brace in text would be read as an Astro expression')
    (tmp / (name.replace('/', '__') + '.html')).write_text(outer)
print('components:', ', '.join(order))
