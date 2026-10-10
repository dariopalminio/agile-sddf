---
alwaysApply: false
type: runbook
kind: operation
enforcement: info
applies-to: graph
slug: runbook-usar-graphify-en-codex
title: "Runbook: Usar Graphify desde Codex (integración MCP)"
created: 2026-10-10
updated: 2026-10-10
---

# Runbook: Usar Graphify desde Codex (integración MCP)

Procedimiento para exponer el grafo de Graphify a Codex a través del protocolo
MCP, de modo que el asistente pueda consultar el grafo directamente en lugar
de leer archivos a ciegas.

## Cuándo ejecutarlo

- Primera vez que se integra Graphify con Codex en una máquina nueva.
- Cuando Codex deja de ver las herramientas `mcp__graphify__*`.
- Tras actualizar Graphify o Codex y detectar que el servidor MCP ya no
  arranca.
- Al mover el proyecto a otra ruta (afecta a la ruta absoluta del
  `graph.json`).

## Prerrequisitos

- Graphify instalado y con `mcp` disponible (ver sección Arquitectura).
- Codex CLI instalado y en el PATH (`where codex` debe devolver una ruta).
- Grafo generado en `graphify-out/graph.json` (ver runbook de regeneración).
- Estar en `cmd` o PowerShell con permisos de usuario.

## Arquitectura

Graphify puede estar instalado de varias formas simultáneamente. Esta es la
fuente principal de errores. Comprobarlo siempre antes de registrar el MCP.

| Origen de instalación | Ejecutable típico | Tiene `mcp` por defecto |
|---|---|---|
| `pip install --user` (Python global) | `%APPDATA%\Python\PythonXXX\Scripts\graphify-mcp.exe` | Solo si se instaló `graphifyy[mcp]` |
| `uv tool install` | `%USERPROFILE%\.local\bin\graphify-mcp.exe` | Solo si se instaló `graphifyy[mcp]` |
| `pipx` | `%USERPROFILE%\.local\pipx\venvs\graphifyy\Scripts\` | Solo si se instaló con la extra |

Los comandos `where graphify-mcp` y `where codex` permiten saber qué
ejecutable está resolviendo el PATH. Regla: **siempre usar rutas absolutas al
registrar el MCP**, nunca el nombre pelado.

## Procedimiento

### 1. Comprobar las instalaciones existentes

```cmd
where graphify
where graphify-mcp
where codex
```

Anotar las rutas devueltas. Si aparecen varias, hay instalaciones duplicadas.

### 2. Verificar que el `graphify-mcp` resuelto arranca

Ejecutar el servidor manualmente. Debe quedarse esperando en stdin, sin
errores:

```cmd
graphify-mcp D:\code\agile-sddf\graphify-out\graph.json
```

Salida esperada: silencio tras cargar el módulo. Es un servidor stdio que
espera mensajes MCP. Pulsar `Ctrl+C` para salir.

Al pulsar `Ctrl+C` aparecerá un traceback largo con `CancelledError` y
`KeyboardInterrupt`. **Es normal.** No es un fallo del servidor, es la
cancelación del event loop asíncrono de Python.

Si en su lugar se ve:

```
ImportError: mcp not installed. Run: pip install "graphifyy[mcp]"
```

entonces el ejecutable que resuelve el PATH no tiene las dependencias MCP.
Reparar según el origen:

- **uv tool**:
  ```cmd
  uv tool install "graphifyy[mcp]" --force
  ```
- **pip --user**:
  ```cmd
  C:\Python314\python.exe -m pip install "graphifyy[mcp]" --user
  ```

### 3. Registrar el servidor MCP en Codex

Eliminar cualquier registro previo y crear uno nuevo apuntando a la ruta
absoluta del ejecutable verificado:

```cmd
codex mcp remove graphify
codex mcp add graphify -- "C:\Users\Daro\.local\bin\graphify-mcp.exe" D:\code\agile-sddf\graphify-out\graph.json
codex mcp list
```

La salida de `codex mcp list` debe mostrar `graphify` como `enabled` y con la
ruta correcta. Si muestra `Unsupported`, la ruta apunta a un ejecutable que no
arranca.

### 4. Recargar Codex

Los servidores MCP se cargan al iniciar la sesión, no en caliente. En VSCode:

- `Ctrl+Shift+P` -> **Developer: Reload Window**.
- O cerrar y reabrir la extensión Codex.

Si Codex corre en terminal, cerrar y abrir de nuevo.

### 5. Verificar dentro de Codex

En el chat:

```
Lista las herramientas MCP disponibles que empiecen por mcp__graphify__
```

La respuesta debe incluir herramientas como:

- `mcp__graphify__query_graph`
- `mcp__graphify__get_neighbors`
- `mcp__graphify__shortest_path`
- `mcp__graphify__search_nodes`

Si en su lugar solo aparecen herramientas con prefijo `mcp__codex_apps__`, el
servidor Graphify no se cargó. Revisar los pasos 2 y 3.

### 6. Primera consulta al grafo

```
Usa mcp__graphify__query_graph para encontrar qué nodos están conectados a "dod-story.js".
```

Si Codex invoca la herramienta y devuelve los vecinos del grafo, la
integración está completa.

## Comandos frecuentes

| Objetivo | Comando |
|---|---|
| Ver instalaciones de Graphify | `where graphify` |
| Ver ejecutables MCP | `where graphify-mcp` |
| Ver Codex | `where codex` |
| Probar el servidor manualmente | `graphify-mcp <ruta_absoluta_al_graph.json>` |
| Registrar en Codex | `codex mcp add graphify -- "<ruta>" <graph.json>` |
| Eliminar registro | `codex mcp remove graphify` |
| Listar servidores MCP | `codex mcp list` |
| Ver configuración resuelta | `codex mcp get graphify` |
| Recargar VSCode | `Ctrl+Shift+P` -> Developer: Reload Window |

## Solución de problemas

### Codex muestra solo `mcp__codex_apps__*`

No está cargando el MCP local. Causas:

- El ejecutable registrado no arranca (`Unsupported` en `codex mcp list`).
- Codex no se recargó tras modificar el registro.
- La ruta del `graph.json` es incorrecta o el archivo no existe.

Comprobar con `codex mcp list --verbose` (si la versión lo soporta) y
re-registrar con la ruta absoluta correcta.

### `ModuleNotFoundError: No module named 'graphify'`

El `python.exe` del PATH no es el que tiene Graphify instalado. Solución:
usar la ruta absoluta del intérprete correcto, o el `graphify-mcp.exe`
específico.

### `ModuleNotFoundError: No module named 'mcp'`

El ejecutable es correcto pero su entorno no tiene las dependencias MCP. Ver
paso 2 de reparación.

### El servidor arranca pero Codex no lo usa

Añadir un timeout más generoso en `~/.codex/config.toml` bajo la entrada del
servidor:

```toml
[mcp_servers.graphify]
type = "stdio"
command = "C:\\Users\\Daro\\.local\\bin\\graphify-mcp.exe"
args = ["D:\\code\\agile-sddf\\graphify-out\\graph.json"]
startup_timeout_ms = 20_000
```

### `'codex' is not recognized` o `'Get-Command' is not recognized`

- `codex` no está instalado, o el PATH no está refrescado. Abrir una terminal
  nueva y comprobar con `where codex`.
- `Get-Command` es de PowerShell. En `cmd` usar `where`.

## Consultas útiles al grafo

Una vez integrado, estos prompts funcionan bien desde Codex:

- `¿Qué módulos dependen de <archivo>? Usa el grafo.`
- `Camino más corto entre <nodo_A> y <nodo_B> según el grafo.`
- `Lista los nodos de la comunidad <nombre>.`
- `¿Qué nodos cambiaron si modifico <archivo>? Consulta el grafo antes de responder.`
- `Dado el grafo, ¿qué módulos son hubs de acoplamiento?`

## Mantenimiento

- Tras cada regeneración del grafo (`graphify .`), **no** hace falta
  re-registrar el MCP: la ruta al `graph.json` no cambia, y el servidor lo
  lee en cada arranque.
- Si se mueve el proyecto, actualizar la ruta absoluta:
  ```cmd
  codex mcp remove graphify
  codex mcp add graphify -- "C:\Users\Daro\.local\bin\graphify-mcp.exe" <nueva_ruta>\graphify-out\graph.json
  ```
- Si `graphifyy` se actualiza a una versión con cambios en el protocolo MCP,
  recargar Codex y verificar de nuevo con `mcp__graphify__*`.

## Referencias

- `docs/runbooks/runbook-regenerar-grafo.md` para reindexar el grafo.
- Esquema del `graph.json`: NetworkX node-link data (`nodes`, `links`,
  `hyperedges`).
- Prefijo de herramientas MCP local: `mcp__graphify__`.
- Prefijo de apps de cuenta: `mcp__codex_apps__` (no confundir).


