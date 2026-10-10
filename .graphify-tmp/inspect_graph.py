import json

with open('graphify-out/graph.json', encoding='utf-8') as f:
    g = json.load(f)

# Top-level
print("tipo raíz:", type(g).__name__)
if isinstance(g, dict):
    print("claves raíz:", list(g.keys()))
    # si hay un sub-dict tipo 'graph' con la estructura real
    for k, v in g.items():
        if isinstance(v, dict) and 'nodes' in v:
            print(f"  -> sub-clave '{k}' contiene 'nodes'")
            g = v
            break

nodes = g['nodes']
# Detectar la clave de aristas
edge_key = None
for cand in ('edges', 'links', 'relationships', 'relations', 'connections', 'arcs'):
    if cand in g and isinstance(g[cand], list):
        edge_key = cand
        break

print(f"clave de aristas detectada: {edge_key}")
edges = g[edge_key] if edge_key else []
print(f"nodos: {len(nodes)}  aristas: {len(edges)}")

# Ahora sí: quién apunta a los dod_story
ids = {n['id'] for n in nodes if 'dod_story' in str(n.get('id', ''))}
print(f"\nnodos dod_story: {len(ids)}")
for n in nodes:
    if n.get('id') in ids:
        print(f"  - {n['id']}  label={n.get('label')!r}  path={n.get('path')!r}")

print("\naristas entrantes a dod_story:")
for e in edges:
    src = e.get('source') or e.get('from') or e.get('src')
    tgt = e.get('target') or e.get('to') or e.get('dst')
    if tgt in ids:
        print(f"  {src} -> {tgt}")