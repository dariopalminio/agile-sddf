# Runbook: Graphify

> Instalación, arranque y uso diario de Graphify CLI, skill y MCP server.
> Troubleshooting: `graphify-troubleshooting.md`.
> Arquitectura CLI/skill/MCP: `docs/architecture/agentes-y-herramientas.md`.

## 1. Instalación

```bash
# Canónica (entorno aislado con SDK OpenAI)
uv tool install "graphifyy[openai]" --force

# Alternativas
pip install graphifyy openai
pipx install graphifyy && pipx inject graphifyy openai
```

Verificar:

```bash
graphify --version
uv tool run --from graphifyy python -c "import openai; print(openai.__version__)"
```

Instalar la dependencia gemini/openai para Graphify:
```bash
uv tool install "graphifyy[gemini]" --force
```
Si prefieres cubrir todos los backends de una vez (solo si se usan o usas alguno):
```bash
uv tool install "graphifyy[gemini,openai,anthropic,ollama]" --force
```

Verificar que funcionó:
```bash
uv tool run --from graphifyy python -c "import openai; print(openai.__version__)"
```

## 2. Configuración de backend

Crear `~/.graphify/config.json` (`%USERPROFILE%\.graphify\config.json` en Windows):

```json
{
  "backend": "gemini",
  "providers": {
    "gemini": {
      "api_key": ["CLAVE_1", "CLAVE_2"],
      "model": "gemini-3.1-flash-lite"
    }
  }
}
```

**Usar `config.json`, no variables de entorno.** Es la única vía fiable cuando Graphify se lanza desde un agente (subproceso aislado). El array de claves permite rotación automática al detectar 429.

Modelos recomendados:

| Caso | Modelo |
|---|---|
| Corpus grande, cuota gratuita | `gemini-3.1-flash-lite` |
| Procesamiento local | `gemma3:4b` (Ollama) |
| Solo código | `--code-only` |

## 3. Primera ejecución

```bash
graphify . --backend gemini --model gemini-3.1-flash-lite
```

Si no hay clave configurada, Graphify cae **silenciosamente** a `--code-only` y omite la extracción semántica. Verificar la salida para confirmarlo.

## 4. Integración con el agente

**Skill** (instrucciones en `AGENTS.md` / `CLAUDE.md`):

```bash
graphify install --platform codex    # Codex, OpenCode
graphify claude install              # Claude Code
```

**MCP server** (herramientas estructuradas):

```bash
# Codex
codex mcp add graphify -- graphify serve "$(pwd)/graphify-out/graph.json"

# Claude Code
claude mcp add graphify -- graphify serve "$(pwd)/graphify-out/graph.json"
```

No hace falta lanzar graphify serve manualmente. El agente lo arranca
como subproceso cuando inicia la sesión, y lo termina al cerrarla. Solo lo
lanzas tú si quieres el servidor disponible fuera del agente (scripts,
varios clientes, debugging).

- Skill = cuándo usar Graphify (probabilístico).
- MCP = herramientas reales (determinista).
- Combinados: skill da contexto, MCP da capacidad.

Trigger en prompt: `$graphify` (Codex) · `/graphify` (Claude Code).

## 5. Uso diario

```bash
graphify . --update                              # incremental
graphify . --force                               # re-extracción completa
graphify query "¿cómo se conecta auth con la BD?" # consulta ad-hoc
graphify serve ./graphify-out/graph.json         # arrancar MCP server
graphify hook install                            # hooks git automáticos
```

Añadir `graphify-out/` a `.gitignore`.

Para uso standalone del MCP server (fuera del agente):

```bash
graphify serve ./graphify-out/graph.json
```
Proceso de larga duración. No termina hasta que lo mates (Ctrl+C).

## 6. Reindexación incremental

Ejecutar siempre con `--concurrency 1` para respetar la cuota de Gemini y
evitar errores 429:

```powershell
graphify . --backend gemini --model gemini-3.1-flash-lite --concurrency 1
```

Graphify reutiliza la caché de archivos sin cambios. Solo re-extrae los que
cambiaron. Si la salida muestra `N cached/unchanged` alto, la operación es
barata.