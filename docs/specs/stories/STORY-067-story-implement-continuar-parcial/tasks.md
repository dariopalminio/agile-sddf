---
alwaysApply: false
type: tasks
id: STORY-067
slug: STORY-067-story-implement-continuar-parcial-tasks
title: "Tasks: skill story-implement — continuar implementación parcial con tareas pendientes y fix-directives"
story: STORY-067
design: STORY-067
created: 2026-05-09
updated: 2026-05-09
related:
  - STORY-067-story-implement-continuar-parcial
---

<!-- Referencias -->
[[STORY-067-story-implement-continuar-parcial]]

## 1. Precondición — Paso 1d de SKILL.md (D-1)

- [x] 1.1 Modificar Paso 1d de `.claude/skills/story-implement/SKILL.md` para aceptar `status: IMPLEMENT / substatus: IN-PROGRESS` como precondición válida adicional a `READY-FOR-IMPLEMENT/DONE`; actualizar el mensaje de error para mostrar ambas opciones válidas

## 2. Detección de modo reanudación — Paso 2c/2d de SKILL.md (D-2)

- [x] 2.1 Extender Paso 2c de SKILL.md para calcular `N_completadas` (tareas `[x]`) y `N_pendientes` (tareas `[ ]`) y detectar si existe `fix-directives.md` en `$STORY_DIR`; registrar internamente el modo: `inicial` si `N_completadas = 0`, `reanudación` si `N_completadas > 0`
- [x] 2.2 Añadir gate de salida anticipada tras Paso 2c: si `N_pendientes = 0` y `N_completadas > 0`, mostrar el mensaje de AC-3 (`ℹ️ No hay tareas pendientes...` + sugerencia `/story-code-review`) y terminar sin modificar ningún archivo
- [x] 2.3 Añadir display del resumen de modo reanudación (mostrar solo cuando `modo = reanudación`) antes de la primera tarea: número de tareas omitidas, pendientes y si `fix-directives.md` fue detectado

## 3. Actualización de status en modo reanudación — Paso 2e de SKILL.md (D-1)

- [x] 3.1 Modificar Paso 2e de SKILL.md para que solo actualice `story.md` a `IMPLEMENT/IN-PROGRESS` si el estado actual no es ya `IMPLEMENT/IN-PROGRESS`; omitir la escritura si el estado ya es correcto

## 4. Sub-flujo para tarea "Implementar fix-directives.md" — Paso 3c de SKILL.md (D-3)

- [x] 4.1 Añadir detección de tarea especial al inicio del ciclo de Paso 3c: si `descripción_tarea.trim().toLowerCase() == "implementar fix-directives.md"`, derivar al sub-flujo en lugar del ciclo TDD estándar
- [x] 4.2 Implementar sub-flujo paso 1: verificar que `$STORY_DIR/fix-directives.md` existe; si no → marcar tarea como `[~]` con mensaje `fix-directives.md no encontrado en <ruta>` y continuar con la siguiente tarea
- [x] 4.3 Implementar sub-flujo paso 2: leer la tabla "Instrucciones de corrección" de `fix-directives.md` y aplicar cada corrección en el `Archivo:Línea` especificado; si un archivo referenciado no existe, registrar el hallazgo sin abortar las correcciones restantes
- [x] 4.4 Implementar sub-flujo paso 3: al completar todas las correcciones, marcar la tarea como `[x]` en `tasks.md` y mostrar los archivos modificados en el formato `[T] 💻 corregido: <ruta>`

## 5. implement-report en modo reanudación — Paso 4a de SKILL.md (D-4)

- [x] 5.1 Actualizar Paso 4a de SKILL.md para incluir las tareas `[x]` previas en la Tabla de Estado con estado `✓ completado (ejecución anterior)` cuando `N_completadas > 0`
- [x] 5.2 Actualizar el campo `Tareas omitidas (ya completadas antes)` del resumen del implement-report para reflejar `N_completadas` calculado en el Paso 2c

## 6. Verificación de escenarios

- [x] 6.1 [P] Verificar AC-1: ejecutar `/story-implement` sobre historia con `[x]`+`[ ]` tasks y `fix-directives.md` presente → confirmar que las `[ ]` se ejecutan, fix-directives.md se procesa, `story.md` pasa a `READY-FOR-CODE-REVIEW/DONE` e `implement-report.md` refleja todas las tareas
- [x] 6.2 [P] Verificar AC-2: ejecutar `/story-implement` sobre historia con `[x]`+`[ ]` tasks sin `fix-directives.md` → confirmar que solo se ejecutan las `[ ]`, no se intenta procesar `fix-directives.md`, y `story.md` → `READY-FOR-CODE-REVIEW/DONE`
- [x] 6.3 [P] Verificar AC-3: ejecutar `/story-implement` sobre historia con todas las tasks `[x]` → confirmar mensaje informativo, sugerencia de `/story-code-review` y que ningún archivo fue modificado
- [x] 6.4 [P] Verificar NF-1 (idempotencia): ejecutar el skill dos veces sobre el mismo estado de reanudación → el resultado es idéntico en ambas ejecuciones
- [x] 6.5 [P] Verificar NF-2 (trazabilidad): `implement-report.md` generado muestra el valor correcto en `Tareas omitidas (ya completadas antes)` y lista las tareas previas como `✓ completado (ejecución anterior)`
- [x] Implementar fix-directives.md
