---
alwaysApply: false
type: runbook
kind: operation
enforcement: info
applies-to: graph
slug: runbook-regenerar-grafo
title: "Runbook: Regenerar el grafo de conocimiento tras cambios"
created: 2026-10-10
updated: 2026-10-10
---

# Runbook: Regenerar el grafo de conocimiento tras cambios

Procedimiento operativo para reindexar el grafo semántico del proyecto con
Graphify tras modificar código, documentación o guardrails.

## Cuándo ejecutarlo

- Después de un merge a `main` que toque código, docs o guardrails.
- Antes de un release, para dejar `GRAPH_REPORT.md` actualizado.
- Cuando el informe `GRAPH_REPORT.md` muestre comunidades o rutas que ya no
  existen.
- Tras añadir o renombrar archivos en `docs/` o `skills/`.

No es necesario ejecutarlo en cada commit. El grafo es un artefacto, no una
fuente de verdad.

## Prerrequisitos

- Clave de API de Gemini configurada en el entorno (`GEMINI_API_KEY` o
  equivalente).
- Dependencias instaladas: `pip install graphifyy[gemini]`.
- Estar en la raíz del proyecto (`D:\code\agile-sddf`).
- Presupuesto de tokens disponible: una pasada completa consume del orden de
  800K-900K tokens de entrada (~0.5 USD con Gemini).

## Procedimiento

### 1. Reindexación incremental

Ejecutar siempre con `--concurrency 1` para respetar la cuota de Gemini y
evitar errores 429:

```powershell
graphify . --backend gemini --model gemini-3.1-flash-lite --concurrency 1
```

Graphify reutiliza la caché de archivos sin cambios. Solo re-extrae los que
cambiaron. Si la salida muestra `N cached/unchanged` alto, la operación es
barata.

### 2. Verificar que no queden lotes pendientes

Buscar en la salida líneas como `failed batches` o `pending`. Si aparecen,
reintentar el paso 1. La caché hará que solo se re-procesen los pendientes.

### 3. Regenerar informe y nombres de comunidades

```powershell
graphify cluster-only D:\code\agile-sddf
```

Esto produce:

- `graphify-out/GRAPH_REPORT.md`
- `graphify-out/graph.json` actualizado
- `graphify-out/graph.html` (visualización)

### 4. Parchear labels huérfanos (si aparecen)

Graphify puede emitir una advertencia del tipo:

```
Extraction warning (N issues): Nx missing required field 'label'
```

Es un bug conocido con documentos que tienen frontmatter `type: guardrail` o
`kind: transition`. Aplicar el parche:

```powershell
python fix_labels.py
```

El script vive en la raíz del repo y rellena los labels faltantes leyendo el
`title:` del frontmatter o el primer H1 del archivo.

Si el script reporta un nodo que no encuentra en disco, revisar si la
referencia en el grafo apunta a un archivo inexistente y corregir la
referencia en el doc que lo menciona.

### 5. Re-clusterizar tras el parche

```powershell
graphify cluster-only D:\code\agile-sddf
```

`cluster-only` respeta los labels ya presentes en `graph.json`, por lo que el
parche no se pierde en este paso.

### 6. Validación

```powershell
python -c "import json; g=json.load(open('graphify-out/graph.json',encoding='utf-8')); print(f'nodes={len(g[\"nodes\"])} links={len(g[\"links\"])} communities={len(g.get(\"communities\",[]))}')"
```

Comprobar que:

- El número de nodos y links es mayor o igual al de la pasada anterior.
- No hay nodos sin label:
  ```powershell
  python -c "import json; g=json.load(open('graphify-out/graph.json',encoding='utf-8')); bad=[n['id'] for n in g['nodes'] if not n.get('label')]; print(len(bad), bad)"
  ```

### 7. Confirmar commit del grafo

```powershell
python -c "import json; g=json.load(open('graphify-out/graph.json',encoding='utf-8')); print(g.get('built_at_commit'))"
```

Si el hash no coincide con `HEAD`, el grafo está desactualizado. Volver al
paso 1.

## Solución de problemas

### Error 429 (Too Many Requests)

Graphify estaba ejecutando peticiones en paralelo. Repetir con
`--concurrency 1` y, si persiste, esperar el `Retry-After` que indique la API.

### Dependencia `graphifyy[gemini]` ausente

```powershell
pip install "graphifyy[gemini]" --no-warn-script-location
```

El flag `--no-warn-script-location` silencia la advertencia del PATH cuando
pip instala scripts en `%APPDATA%\Python\...\Scripts`.

### Nodos sin label que no se resuelven con `fix_labels.py`

Revisar si el archivo huérfano:

- Existe con otro nombre en disco.
- Está excluido por `.graphifyignore`.
- Es una referencia rota desde otro doc.

Buscar la referencia:

```powershell
Get-ChildItem -Recurse -Include *.md,*.yaml,*.yml -File |
  Select-String -Pattern "project[-_]intent" |
  Select-Object Path, LineNumber, Line
```

### El grafo no se actualiza

Borrar la caché solo como último recurso:

```powershell
Remove-Item -Recurse -Force graphify-out
graphify . --backend gemini --model gemini-3.1-flash-lite --concurrency 1
```

Una reindexación completa puede costar ~0.5 USD y tardar más de una hora en
repos medianos. Evitarla si es posible.

## Artefactos generados

| Archivo | Versionado | Descripción |
|---|---|---|
| `graphify-out/graph.json` | No | Grafo completo en formato NetworkX node-link |
| `graphify-out/GRAPH_REPORT.md` | No | Informe legible del grafo |
| `graphify-out/graph.html` | No | Visualización interactiva |
| `graphify-out/.graphify_analysis.json` | No | Metadatos internos |
| `2026-10-10/` y similares | No | Backups automáticos con fecha |

## Referencias

- Ver `docs/runbooks/runbook-deployment-to-npm.md` para despliegue.
- Esquema del grafo: NetworkX node-link data (`nodes`, `links`, `hyperedges`).
- Modelo Gemini recomendado: `gemini-3.1-flash-lite` por su relación
  costo/velocidad.
