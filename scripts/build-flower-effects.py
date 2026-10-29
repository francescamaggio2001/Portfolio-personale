"""Rigenera gli SVG inline animabili dai sei originali, senza modificarli."""
from pathlib import Path
import xml.etree.ElementTree as ET
import re
import random

page = Path('projects.html')
html = page.read_text()
html = re.sub(r'\s*<svg class="pixel-flower".*?</svg>', '', html, flags=re.S)
classes = ['graphic-design', 'copywriting', 'discovery', 'accessibility', 'wireframing', 'user-interface']
for number, name in enumerate(classes, 1):
    root = ET.parse(f'assets/Progects/{number}.svg').getroot()
    styles = ''.join(e.text or '' for e in root.iter() if e.tag.endswith('style'))
    colors = dict(re.findall(r'\.(st\d+)\s*\{\s*fill:\s*([^;]+);', styles))
    rects = [e for e in root.iter() if e.tag.endswith('rect')]
    centers = [(float(r.get('x', 0))+float(r.get('width'))/2,
                float(r.get('y', 0))+float(r.get('height'))/2) for r in rects]
    cx = sum(x for x,y in centers)/len(centers)
    cy = sum(y for x,y in centers)/len(centers)
    rng = random.Random(number)
    parts = ['<svg class="pixel-flower" viewBox="0 0 720 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">']
    for r,(x,y) in zip(rects,centers):
        dx = (x-cx)*.25 + rng.uniform(-16,16)
        dy = (y-cy)*.25 + rng.uniform(-16,16)
        attrs = ' '.join(f'{k}="{v}"' for k,v in r.attrib.items() if k != 'class')
        parts.append(f'<rect {attrs} fill="{colors.get(r.get("class"), r.get("fill", "#000000"))}" style="--pixel-x:{dx:.1f}px;--pixel-y:{dy:.1f}px"/>')
    parts.append('</svg>')
    html, count = re.subn(r'(<a\b[^>]*class="[^"]*work-card '+name+r'"[^>]*>)', lambda m:m[1]+'\n'+''.join(parts), html, count=1)
    assert count == 1, name
page.write_text(html)
