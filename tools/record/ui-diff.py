# Compares the new and live rows printed by ui-run.mjs (one file per band) and prints the rows that differ.
# Tolerances: panel/heading positions ±0.03 vw (the live site sways its idle panels by ±1.5 %),
# pixel values ±3 px. Ignored: the Hero ball (hidden on both after the hand-over), the dot position while
# it is hidden, video paused/playing of closed panels (the live site autoplays all videos), heading clip
# "none" vs the full polygon (the same picture).
# Usage: python3 ui-diff.py run-1440.txt [run-768.txt ...]
import re
import sys

NUM = re.compile(r'-?\d+(?:\.\d+)?')


def norm(row):
    s = row.split(' | ', 1)[1]
    s = re.sub(r'hero [^|]*$', '', s)
    s = re.sub(r'dot \S+ op 0', 'dot - op 0', s)
    s = re.sub(r'(\.)v0\.0[p>]', r'\1v0', s)
    s = s.replace('clip none', 'clip (00,1000,100100,0100)')
    return s


def same(a, b):
    if NUM.sub('#', a) != NUM.sub('#', b):
        return False
    for x, y in zip(NUM.findall(a), NUM.findall(b)):
        x, y = float(x), float(y)
        tol = 0.031 if max(abs(x), abs(y)) < 5 else 3
        if abs(x - y) > tol:
            return False
    return True


for path in sys.argv[1:]:
    lines = open(path).read().split('\n')
    cut = next(i for i, l in enumerate(lines) if l.startswith('== ') and ' live:' in l)
    new = {l.split(' | ')[0]: l for l in lines[:cut] if re.match(r'^(b\d|ho)', l)}
    live = {l.split(' | ')[0]: l for l in lines[cut:] if re.match(r'^(b\d|ho)', l)}
    print(f'##### {path}: {len(new)} points')
    print('\n'.join(l[:200] for l in lines if l.startswith(('==', 'coarse', 'back', 'idle', 'pageerror', 'console'))))
    bad = 0
    for k, row in new.items():
        if not same(norm(row), norm(live.get(k, 'x | missing'))):
            bad += 1
            print('NEW ', k, norm(row)[:330])
            print('LIVE', k, norm(live.get(k, 'x | missing'))[:330])
    print(f'differing points: {bad}\n')
