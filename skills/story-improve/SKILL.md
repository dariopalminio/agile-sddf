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

<!-- SDDF-FIXED-LAYOUT: v1 -->

Resuelve `REPO_ROOT` (raíz del repositorio) y usa rutas fijas relativas a él:
work items en `specs/flow/`, templates en `docs/templates/` y DoD en `docs/guardrails/`.
El layout no es configurable (ADR-0016).

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
