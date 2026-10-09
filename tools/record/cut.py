# Cuts full.webm into per-section mp4 clips + contact sheets using timeline.json.
import json, subprocess, sys, os
mode = sys.argv[1]; src = f'out/{mode}'
dst = f'/Users/mac/Claude/Projects/Motion/reference/recordings/{mode}'; os.makedirs(dst, exist_ok=True)
tl = json.load(open(f'{src}/timeline.json'))
t = {}
for e in tl: t.setdefault(e['id'], e['t'])  # first occurrence: mobile scroll jumps back
order = ['introduction','interactive','techniques','easing','delay','fade','morph','masking','dimension','parallax','zoom','resources','footer']
# Preloader ends ~2.5 s after load on desktop; on mobile load fires early and the counter runs ~9 s.
pre_end = t['load'] + 2.5 if mode == 'desktop' else t['hero-idle-end']
segs = [('01-preloader', 0, pre_end), ('02-hero', pre_end - 1.5, t['introduction'])]
for i, s in enumerate(order):
    end = t[order[i+1]] if i + 1 < len(order) else t['end'] + 1.5
    name = s if s in ('introduction','interactive','techniques','resources','footer') else 'lesson-' + s
    segs.append((f'{i+3:02d}-{name}', t[s], end))
for name, a, b in segs:
    a = max(0, a - 0.5); b = b + 0.5
    subprocess.run(['ffmpeg','-v','error','-y','-ss',f'{a:.2f}','-to',f'{b:.2f}','-i',f'{src}/full.webm',
        '-c:v','libx264','-crf','26','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart','-an', f'{dst}/{name}.mp4'], check=True)
    n = max(1, int(b - a)); cols = 6; rows = max(1, -(-min(n, 30) // cols)); fps = min(n, 30) / (b - a)
    subprocess.run(['ffmpeg','-v','error','-y','-ss',f'{a:.2f}','-to',f'{b:.2f}','-i',f'{src}/full.webm',
        '-vf', f'fps={fps:.4f},scale=360:-1,tile={cols}x{rows}', '-frames:v','1', f'{dst}/{name}.sheet.png'], check=True)
    print(name, f'{a:.1f}-{b:.1f}s')
json.dump({'mode': mode, 'segments': [{'name': n, 'from': round(max(0,a-0.5),2), 'to': round(b+0.5,2)} for n,a,b in segs], 'timeline': tl},
          open(f'{dst}/timeline.json','w'), indent=1)
