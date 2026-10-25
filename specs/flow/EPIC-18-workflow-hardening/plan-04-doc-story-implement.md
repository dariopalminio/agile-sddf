---
type: plan
id: plan-04
slug: plan-04-doc-story-implement
title: "Mejorar documentación de story-implement"
status: COMPLETED
substatus: DONE
parent: EPIC-18
created: 2026-06-13
updated: 2026-06-13
related:
  - EPIC-18-workflow-hardening
---

# Plan: Mejorar documentación de story-implement

- Documentar explícitamente que `skill-preflight` también expone `$CLI_ROOT` en el Paso 0 de `story-implement/SKILL.md`
- Documentar configuración de `code_generators` por capas en README de `story-implement`

## Contexto

Al revisar `story-implement/SKILL.md`, se detectó una laguna documental: el **Paso 0 — Verificar entorno (`skill-preflight`)** ([SKILL.md:108-110](.claude/skills/story-implement/SKILL.md#L108-L110)) solo dice:

> "Invocar `skill-preflight`. Si retorna `✗ Entorno inválido`, detener la ejecución. Usar `$SPECS_BASE` en todas las rutas siguientes."

Pero `$CLI_ROOT` se usa de forma pervasiva en el resto del documento (≈13 referencias: Pasos 2, 8, 9, 10, manejo de errores, arquitectura de delegación — líneas 159, 163, 214, 256, 329, 416, 420, 465, 583, 780, 791, 825) sin que el Paso 0 indique de dónde proviene esa variable ni que también la expone `skill-preflight`.

**Origen real de `$CLI_ROOT`:** `skill-preflight/SKILL.md` resuelve la variable en su "Verificación 5 — Resolución de `CLI_ROOT`" ([skill-preflight/SKILL.md:80-92](.claude/skills/skill-preflight/SKILL.md#L80-L92)):
1. `SDDF_CLI_ROOT` (env var) si está definida.
2. Si no, autodetección por filesystem: `.claude/` → `.opencode/` → `.github/copilot/`.
3. Fallback: `.claude`.
4. Emite `[OK] CLI_ROOT = <ruta>` y **expone `CLI_ROOT` al skill invocador** (línea 92, contrato explícito).

El valor funcionalmente ya está disponible (no es un bug de ejecución), pero el Paso 0 de `story-implement` no lo documenta — quien lee el SKILL.md de arriba a abajo se encuentra `$CLI_ROOT` usado sin introducción 49 líneas después. El objetivo de este cambio es **solo documental**: alinear el Paso 0 con el contrato real de `skill-preflight` y con el uso real que hace el resto del documento, sin tocar lógica ni comportamiento.

## Cambio a realizar

### 1. Documentar explícitamente que `skill-preflight` también expone `$CLI_ROOT` en el Paso 0 de `story-implement/SKILL.md`

Editar `d:\code\agile-sddf\.claude\skills\story-implement\SKILL.md`, Paso 0 (línea 110), para mencionar explícitamente que `skill-preflight` también resuelve y expone `$CLI_ROOT`, y que se usa en las rutas a skills (`$CLI_ROOT/skills/{skill}/SKILL.md`) en los pasos siguientes.

Redacción propuesta (sustituye la línea 110 actual):

```markdown
Invocar `skill-preflight`. Si retorna `✗ Entorno inválido`, detener la ejecución. `skill-preflight` resuelve y expone `$SPECS_BASE` y `$CLI_ROOT` — usar `$SPECS_BASE` en todas las rutas a artefactos de specs y `$CLI_ROOT` en todas las rutas a skills (`$CLI_ROOT/skills/{skill}/SKILL.md`) en los pasos siguientes.
```

No se modifica `skill-preflight/SKILL.md` (su contrato ya es correcto y completo), ni ninguna otra sección de `story-implement/SKILL.md` — es un cambio de una sola línea, puramente aclaratorio.

### 2. Documentar configuración de `code_generators` por capas en README de `story-implement`

Insertar una nueva sección `## Configurar code_generators por capas (frontend / backend)` en `d:\code\agile-sddf\.claude\skills\story-implement\README.md`, **entre** la sección actual `## Arquitectura de delegación` (termina en la línea 86) y `## Uso` (línea 88).


## Archivo a modificar

- `d:\code\agile-sddf\.claude\skills\story-implement\SKILL.md` — única edición, vía `Edit`, en el Paso 0 (línea 110).
- `d:\code\agile-sddf\.claude\skills\story-implement\README.md` — única edición, vía `Edit` (inserción de sección, sin tocar el resto del contenido).

## Verificación

- Confirmar que la nueva redacción no contradice el uso real de `$CLI_ROOT` en el resto del documento (líneas 159, 163, 214, 256, 329, 416, 420, 465, 583, 780, 791, 825).
- Confirmar que `skill-preflight/SKILL.md:92` efectivamente respalda la afirmación ("Exponer `CLI_ROOT` al skill invocador").
- Revisión visual de que el Markdown no rompe la lista de pasos ni el formato existente.
- Revisión visual de que el Markdown renderiza correctamente (tablas y bloques de código bien cerrados).
- Confirmar que el YAML de ejemplo es válido y coherente con `.claude/skills/sddf-init/assets/sddf.config.yaml.template`.
- Confirmar que no se duplica contenido ya presente en "Arquitectura de delegación" ni se contradice con `SKILL.md` (Paso 8/9).

