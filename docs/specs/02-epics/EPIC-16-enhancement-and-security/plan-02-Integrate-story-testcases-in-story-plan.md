---
alwaysApply: false
type: release
id: plan-02-integrate-story-testcases-in-story-plan
slug: plan-02-integrate-story-testcases-in-story-plan
title: "Plan 02: Integrate story-testcases in story-plan"
status: COMPLETED
substatus: DONE
parent: EPIC-16-enhancement-and-security
created: 2026-06-05
updated: 2026-06-05
related: [
  - EPIC-16-enhancement-and-security
]
---
[[EPIC-16-enhancement-and-security]]

## Plan (ya ejecutado): Integrar story-testcases en story-plan

### Context

El skill story-plan actualmente orquesta story-design → story-tasking → story-analyze. El usuario quiere que story-testcases se ejecute por defecto al planificar, generando testcases.md junto con tasks.md. Sin embargo, deben preservarse los flujos existentes que usan story-plan sin testcases.

La solución es agregar dos flags mutuamente excluyentes para controlar el scope de generación, y actualizar el flujo para que por defecto ejecute los cuatro pasos.

### Approach
Nuevos parámetros
Parámetro	Comportamiento
(ninguno)	Modo default: design → tasking → testcases → analyze
--only-tasks	Solo tareas: design → tasking → analyze (comportamiento actual)
--only-testcases	Solo casos de prueba: design → testcases → analyze
--skip-analyze	Omite story-analyze en cualquier modo (ya existe, se mantiene)
Combinación --only-tasks + --only-testcases → error inmediato (mutuamente excluyentes).

Orden del pipeline por modo
Default:           design → tasking → testcases → analyze  [1/4, 2/4, 3/4, 4/4]
--only-tasks:      design → tasking → analyze              [1/3, 2/3, 3/3]
--only-testcases:  design → testcases → analyze            [1/3, 2/3, 3/3]
Comportamiento fail-fast
story-design (siempre): BLOQUEANTE — fallo detiene todo
story-tasking (default y --only-tasks): BLOQUEANTE — fallo detiene testcases y analyze
story-testcases (default y --only-testcases): BLOQUEANTE — fallo detiene analyze
story-analyze (siempre que no se omita): NO BLOQUEANTE (ya establecido)
Nota: en modo default, si story-tasking falla, story-testcases se salta aunque tasks.md sea input opcional para él. Se sigue el principio fail-fast del pipeline.

### Cambios en la tabla de resumen final (Paso 5)
Modo default (4 pasos):

 Paso              │ Estado │ Artefacto
─────────────────────────────────────────
 story-design      │   ✓    │ design.md
 story-tasking     │   ✓    │ tasks.md
 story-testcases   │   ✓    │ testcases.md
 story-analyze     │   ✓    │ analyze.md
Modo --only-tasks (3 pasos, igual al actual):

 story-design    │ ✓ │ design.md
 story-tasking   │ ✓ │ tasks.md
 story-analyze   │ ✓ │ analyze.md
Modo --only-testcases (3 pasos):

 story-design      │ ✓ │ design.md
 story-testcases   │ ✓ │ testcases.md
 story-analyze     │ ✓ │ analyze.md
### Archivo a modificar
Un solo archivo: .claude/skills/story-plan/SKILL.md

### Secciones que cambian
Frontmatter — actualizar description para mencionar story-testcases y el comportamiento default
## Objetivo — agregar mención de testcases.md en el flujo; actualizar el diagrama de posicionamiento
## Parámetros — agregar --only-tasks y --only-testcases; aclarar que --skip-analyze sigue funcionando en todos los modos
## Dependencias — agregar story-testcases a la lista de skills
## Flujo de ejecución:
Paso 1c — mostrar en el mensaje de inicio los pasos según el modo detectado; detectar y reportar error si se pasan --only-tasks y --only-testcases juntos
Paso 3 (story-tasking) — agregar condición: skip si --only-testcases
Nuevo Paso 4 (story-testcases) — invocar en modo Agent; skip si --only-tasks; el indicador usa [3/4] en modo default o [2/3] en modo --only-testcases
Paso 4 → Paso 5 (story-analyze) — renumerar; el indicador varía según modo y combinación con --skip-analyze
Paso 5 → Paso 6 (Resumen final) — tabla dinámica según modo activo; estados posibles de ⚠️ y ✗ actualizados para incluir testcases
## Manejo de errores — agregar fila: fallo en story-testcases → [X/N] ✗ story-testcases — FALLO → registrar story-analyze → —, ir a resumen
## Salida — agregar testcases.md como artefacto opcional (presente salvo --only-tasks)

### Verificación
Tras la implementación, verificar manualmente:

/story-plan FEAT-XYZ (sin flags) → debe ejecutar los 4 pasos y generar design.md, tasks.md, testcases.md, analyze.md
/story-plan FEAT-XYZ --only-tasks → debe ejecutar solo los 3 pasos originales (sin testcases.md)
/story-plan FEAT-XYZ --only-testcases → debe ejecutar design → testcases → analyze (sin tasks.md)
/story-plan FEAT-XYZ --only-tasks --only-testcases → debe reportar error de flags mutuamente excluyentes y detenerse
/story-plan FEAT-XYZ --skip-analyze → default sin analyze (design → tasking → testcases)
/story-plan FEAT-XYZ --only-tasks --skip-analyze → solo design → tasking (sin testcases ni analyze)

