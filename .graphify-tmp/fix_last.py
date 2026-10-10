import json
from pathlib import Path

GRAPH = Path('graphify-out/graph.json')

with GRAPH.open(encoding='utf-8') as f:
    g = json.load(f)

target = 'docs_specs_01_projects_proj_01_agile_sddf_project_intent'
patched = 0
for n in g['nodes']:
    if n['id'] == target and not n.get('label'):
        n['label'] = 'Project Intent (Agile SDDF)'
        n['type'] = 'doc'
        patched += 1
        print(f"  {n['id']} -> {n['label']!r}")

print(f'{patched} nodo parcheado')

with GRAPH.open('w', encoding='utf-8') as f:
    json.dump(g, f, ensure_ascii=False, indent=2)