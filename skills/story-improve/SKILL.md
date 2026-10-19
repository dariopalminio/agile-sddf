---
name: story-improve
description: >-
  Deprecado desde 4.2.0, se elimina en 5.0.0: alias de story-refine.
  Aplica recomendaciones FINVEST a una historia delegando en /story-refine.
  Invocar solo por compatibilidad cuando se use "story-improve"; para trabajo nuevo, usar story-refine.
---

# Skill: `/story-improve` (alias deprecado)

Este skill conserva las invocaciones anteriores a 4.2.0 y se elimina en 5.0.0.
No tiene lógica de refinamiento propia.

## Paso 0 — Resolver contexto local

<!-- SDDF-ROOT-RESOLUTION: v1 -->

Antes de delegar, resuelve una sola vez `REPO_ROOT` y `SPECS_BASE`:

1. Si `SDDF_ROOT` está definida, exige un valor no vacío que apunte a un directorio accesible; úsalo como `SPECS_BASE`.
2. Solo si `SDDF_ROOT` no está definida, usa la clave `root` válida de `<REPO_ROOT>/sddf.config.yaml` (rutas relativas ancladas en `REPO_ROOT`).
3. Si no hay fuente explícita, usa `docs` relativo a `REPO_ROOT`.
4. Una fuente explícita inválida detiene el flujo sin fallback ni escrituras. Resuelve `CLI_ROOT` independientemente solo al necesitar el skill del runtime.

El diagnóstico de entorno se solicita explícitamente con `/skill-preflight`; este alias no lo invoca.

## Flujo de ejecución

### Paso 1 — Emitir el aviso

Muestra siempre como primera línea de salida, literalmente:

```
⚠️ story-improve está deprecado. Usa /story-refine.
```

### Paso 2 — Anunciar la delegación

Conserva los argumentos recibidos y muestra inmediatamente después del aviso:

```
→ delegando en /story-refine <args>
```

Sustituye `<args>` por los argumentos reales, en su orden original. Si no hay argumentos,
omite el espacio final y muestra `→ delegando en /story-refine`.

### Paso 3 — Delegar

Invoca `/story-refine` con los mismos argumentos, incluido `--story-id` cuando se haya
proporcionado. Muestra su salida tal cual. No crees backups, logs ni cambios propios;
la validación y la escritura pertenecen exclusivamente a `/story-refine`.

## Salida

La salida de `/story-refine`, precedida por el aviso y la línea de delegación.
