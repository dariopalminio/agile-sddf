# Graphify — Troubleshooting

> Catálogo de fallos con síntoma, causa y fix. Instalación y uso: `graphify.md`.

## Extracción

### Fallback silencioso a `--code-only`
**Síntoma:** Termina sin error pero el grafo no tiene nodos semánticos.
**Causa:** Sin clave LLM disponible.
**Fix:** Configurar `~/.graphify/config.json`, re-ejecutar con `--backend gemini`.

### `ModuleNotFoundError: openai`
**Síntoma:** La extracción semántica falla al iniciar.
**Causa:** Instalación con `uv tool` sin el extra `[openai]`.
**Fix:** `uv tool install "graphifyy[openai]" --force`.

### Cuota agotada (429)
**Síntoma:** Errores 429 repetidos.
**Causa:** Límite diario alcanzado.
**Fix:** Rotación de claves en `config.json` (`"api_key": ["k1","k2"]`). `gemini-3.1-flash-lite` da 500 RPD frente a 20 RPD de `gemini-3-flash`.

### Archivos omitidos permanentemente
**Síntoma:** Tras 429/timeout, esos archivos no se reprocesan nunca.
**Causa:** Manifest sellado (bug pre-0.8.13).
**Fix:** `graphify . --force`.

### Extracción muy lenta
**Causa:** Chunk pequeño + concurrencia 1 + modelo grande.
**Fix:** Subir `max_concurrency` a 3-5 en `config.json`.

## Clave y entorno

### "No hay clave Gemini disponible para el proceso"
**Síntoma:** Error aunque la variable esté definida en tu shell.
**Causa:** El subproceso (agente, Codex) no hereda variables de entorno.
**Fix:** Usar `~/.graphify/config.json`, no variables de entorno.

### `setx` no surte efecto
**Causa:** `setx` no actualiza sesiones abiertas.
**Fix:** Cerrar y abrir terminal nueva. Si el lanzador es un agente, usar `config.json`.

### `Test-Path` no reconocido
**Causa:** Estás en `cmd.exe`, no PowerShell.
**Fix:** Escribir `powershell`. Equivalente cmd: `if exist`.

### `config.json` no se encuentra en Windows
**Causa:** `~` no se expande como esperas.
**Fix:** Verificar con `echo %USERPROFILE%`. Ruta correcta: `C:\Users\TuNombre\.graphify\config.json`.

### Backend incorrecto
**Causa:** Prioridad de autodetección: Gemini → Kimi → Claude → OpenAI → DeepSeek → Azure → Bedrock → Ollama.
**Fix:** Forzar con `--backend <nombre>` o `"backend": "<nombre>"` en `config.json`.

## Manifest y git

### `graphify-out/` versionado por error
**Fix:** Añadir `graphify-out/` a `.gitignore`.

### Grafo no se actualiza tras cambios
**Fix:** `graphify . --update` o `graphify hook install`.

## Integración con agentes

### Agente ignora el skill
**Causa:** Adherencia probabilística + posible aislamiento del subproceso.
**Fix:** Registrar MCP server con `codex mcp add` / `claude mcp add`.

### MCP server no aparece en el agente
**Causa:** Ruta incorrecta o proceso no arranca.
**Fix:** Verificar ruta absoluta. Probar `graphify serve /ruta/al/graph.json` manualmente. Confirmar con `codex mcp list`.

### Trigger incorrecto
**Causa:** Codex usa `$graphify`; Claude Code usa `/graphify`.
**Fix:** Usar el trigger específico de la plataforma.
