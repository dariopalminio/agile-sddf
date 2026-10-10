import json
import re
from pathlib import Path

GRAPH = Path('graphify-out/graph.json')
DOCS = Path('docs')

def normalize(p: Path) -> str:
    s = p.as_posix()
    if s.endswith('.md'):
        s = s[:-3]
    return re.sub(r'[/\-.]', '_', s)

# Índice: id_normalizado -> ruta real
index = {}
for p in DOCS.rglob('*.md'):
    index[normalize(p)] = p

def extract_label(path: Path) -> str | None:
    text = path.read_text(encoding='utf-8', errors='ignore')
    m = re.match(r'^---\n(.*?)\n---', text, re.DOTALL)
    if m:
        t = re.search(r'^title:\s*["\']?(.+?)["\']?\s*$', m.group(1), re.MULTILINE)
        if t:
            return t.group(1).strip().strip('"\'')
    h1 = re.search(r'^#\s+(.+)$', text, re.MULTILINE)
    if h1:
        return h1.group(1).strip()
    return None

with GRAPH.open(encoding='utf-8') as f:
    g = json.load(f)

fixed = 0
for n in g['nodes']:
    if n.get('label'):
        continue
    p = index.get(n['id'])
    if not p:
        continue
    label = extract_label(p)
    if label:
        n['label'] = label
        # Rellenar también path/type si Graphify los dejó vacíos
        n.setdefault('path', p.as_posix())
        n.setdefault('type', 'doc')
        fixed += 1
        print(f'  {n["id"]} -> {label!r}')

print(f'\n{fixed} labels inyectados')

with GRAPH.open('w', encoding='utf-8') as f:
    json.dump(g, f, ensure_ascii=False, indent=2)