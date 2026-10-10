import json

with open('graphify-out/graph.json', encoding='utf-8') as f:
    g = json.load(f)

bad = [n for n in g['nodes'] if not n.get('label')]
print(f'{len(bad)} nodos sin label:')
for n in bad:
    print(f"  - id={n.get('id')}  path={n.get('path') or n.get('file')}  type={n.get('type')}")