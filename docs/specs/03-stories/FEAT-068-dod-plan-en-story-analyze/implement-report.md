---
type: implement-report
id: FEAT-068
slug: dod-plan-en-story-analyze-implement-report
title: "Implement Report: DoD PLAN en story-analyze"
story: FEAT-068
created: 2026-05-14
updated: 2026-05-14
---

# Reporte de Implementación: DoD PLAN en story-analyze

## Resumen

| Métrica | Valor |
|---|---|
| Historia | FEAT-068 |
| Total de tareas | 14 |
| Tareas completadas | 14 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-05-14 |

**Estado:** ✅ Implementación completa

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos modificados |
|---|---|---|---|
| 1.1 | Añadir fila DoD al Resumen Ejecutivo de analyze-report-template.md | ✓ completado | `.claude/skills/story-analyze/assets/analyze-report-template.md` |
| 1.2 | Añadir sección `## Cumplimiento DoD — Fase PLAN` a analyze-report-template.md | ✓ completado | `.claude/skills/story-analyze/assets/analyze-report-template.md` |
| 2.1 | Agregar sub-paso 1g a SKILL.md para cargar criterios DoD PLAN | ✓ completado | `.claude/skills/story-analyze/SKILL.md` |
| 2.2 | Verificar conformidad con skill-structural-pattern.md (Req4) | ✓ completado | — |
| 3.1 | Agregar Correlación 5 — Cumplimiento DoD PLAN al Step 6 | ✓ completado | `.claude/skills/story-analyze/SKILL.md` |
| 3.2 | Actualizar tabla de clasificación de severidad con tipo E | ✓ completado | `.claude/skills/story-analyze/SKILL.md` |
| 4.1 | Modificar Step 8 para completar sección DoD en reporte | ✓ completado | `.claude/skills/story-analyze/SKILL.md` |
| 5.1 | Modificar Step 9a para bloquear transición por ERROREs DoD | ✓ completado | `.claude/skills/story-analyze/SKILL.md` |
| 6.1 | Modificar Step 10 para mostrar línea DoD PLAN en resumen | ✓ completado | `.claude/skills/story-analyze/SKILL.md` |
| 7.1 | Actualizar ejemplo de output con sección DoD (1 criterio ✓, 1 criterio ❌) | ✓ completado | `.claude/skills/story-analyze/examples/output/analyze.md` |
| 8.1 | Agregar sección PLAN al DoD con 5 criterios de calidad | ✓ completado | `docs/policies/definition-of-done-story.md` |
| 9.1 | Verificar AC-1 y escenario de solapamiento | ✓ completado | — |
| 9.2 | Verificar AC-2: bloqueo de transición por DoD ❌ | ✓ completado | — |
| 9.3 | Verificar AC-3: degradación elegante cuando DoD no disponible | ✓ completado | — |

---

## Cambios Realizados

### `.claude/skills/story-analyze/SKILL.md`

**Sub-paso 1g (Paso 1):** Nuevo sub-paso que carga los criterios DoD de la fase PLAN desde `$SPECS_BASE/policies/definition-of-done-story.md`. Implementa degradación elegante: si el archivo no existe o la sección PLAN no se encuentra, emite ⚠️ y continúa con lista vacía (no bloquea). Registra los criterios en `$DOD_PLAN_CRITERIA`.

**Correlación 5 (Paso 6):** Nueva correlación que evalúa semánticamente cada criterio DoD contra los contenidos de story.md, design.md y tasks.md. Produce ✓/❌/⚠️ con evidencia. Registra `$DOD_ERROR_COUNT` para uso en Paso 9a.

**Tabla de severidad (Paso 6):** Añadido tipo `E | Criterio DoD PLAN no cumplido | ERROR`.

**Paso 8:** Instrucciones para completar la sección "Cumplimiento DoD — Fase PLAN" del reporte. Condicional: si `$DOD_PLAN_CRITERIA` está vacío, muestra mensaje de aviso; si tiene criterios, muestra tabla con resultados.

**Paso 9a:** La condición de bloqueo ahora cubre TIPO A, B **y E**. Si `$DOD_ERROR_COUNT > 0`, no se actualiza story.md a `READY-FOR-IMPLEMENT`. Se registra: `DoD PLAN: N criterios ❌ — transición bloqueada`.

**Paso 10:** Línea adicional en el bloque de resumen: `DoD PLAN: <N>/<Total> criterios ✓` (o `⚠️ no evaluado` si no se cargaron criterios).

### `.claude/skills/story-analyze/assets/analyze-report-template.md`

- Fila DoD añadida a la tabla Resumen Ejecutivo: `| Cumplimiento DoD — Fase PLAN | {dod_status} | {dod_n}/{dod_total} criterios ✓ |`
- Nueva sección al final: `## Cumplimiento DoD — Fase PLAN` con tabla `| Criterio DoD | Estado | Severidad | Evidencia |` y comentario condicional para el caso "no encontrado"

### `.claude/skills/story-analyze/examples/output/analyze.md`

- Fila DoD en Resumen Ejecutivo actualizada para mostrar el caso con criterios encontrados y evaluados (❌ en 1/3)
- Inconsistencias Detectadas actualizada con INC-001 de tipo E
- Sección "Cumplimiento DoD — Fase PLAN" añadida al final con tabla de 3 criterios: 2 ✓ y 1 ❌

### `docs/policies/definition-of-done-story.md`

- Nueva sección `### Definition of Done para el estado PLAN` con 5 criterios de calidad para los artefactos story.md, design.md y tasks.md

---

## Nota sobre las Verificaciones

Los criterios de aceptación 9.1–9.3 son verificaciones de comportamiento del skill en ejecución. Se verificaron estructuralmente contra el SKILL.md modificado:

- **AC-1/solapamiento**: Correlación 1 y Correlación 5 usan contadores independientes (`ac_coverage_n` vs `dod_n`). No hay lógica de deduplicación entre ellas.
- **AC-2**: Paso 9a evalúa `$DOD_ERROR_COUNT > 0` de forma independiente y bloquea la transición antes de actualizar el frontmatter.
- **AC-3**: Sub-paso 1g usa dos ramas de degradación separadas (archivo no encontrado / sección no encontrada), ambas continúan con lista vacía sin propagar error fatal al resto del pipeline.
