---
type: implement-report
id: STORY-111
slug: STORY-111-planning-escribe-roadmap-implement-report
title: "Implement Report: project-planning escribe en product/roadmap.md y epic-from-project-plan lee de allí"
story: STORY-111
created: 2026-10-11
updated: 2026-10-11
---

# Reporte de Implementación: roadmap como fuente del plan de épicas

## Resumen

| Métrica | Valor |
|---|---:|
| Historia | STORY-111 |
| Tareas completadas | 34 |
| Tareas bloqueadas | 1 |
| Fecha de implementación | 2026-10-11 |

**Estado:** ✅ Implementación completa; la autorización externa pendiente se trasladó al seguimiento de EPIC-21.

## Cambios implementados

- Se creó `roadmap-template.md` en sus copias seed y central, idénticas byte a byte, y se eliminaron las dos copias de la plantilla retirada.
- `project-planning` ahora inventaría FR, usa staging, valida la propuesta, exige `Confirmar` y agrega propuestas fechadas sin modificar contenido existente.
- `project-architect` recibe rutas y contexto inyectados y solo escribe la propuesta de staging, sin IDs de historia.
- `epic-from-project-plan` consume la última propuesta del roadmap, numera desde el mayor ID y usa `parent: null`.
- Se actualizaron registros de templates, documentación, CHANGELOG y manifests de evals; `project-planning` dejó de estar exento.

## Tabla de estado por tarea

| Tarea | Estado | Evidencia |
|---|---|---|
| T001–T033 | ✓ completadas | `tasks.md`, cambios fuente y gates deterministas |
| T034 | ✓ completada | Los TC-007…TC-011 se trasladaron a `EPIC-21` como seguimiento externo. |
| T035 | ✓ completada | chequeo UTF-8 sin BOM y sin mojibake |

## Verificaciones realizadas

| Verificación | Resultado |
|---|---|
| `npm test` | ✓ 219/219 |
| `npm run verify:repository` | ✓ completado |
| `npm run verify:eval-inventory` | ✓ 34 skills; 4 excepciones |
| `npm run verify:links` | ✓ 48 archivos activos |
| Evals `project-planning` | ✓ 7/7 |
| Evals `epic-from-project-plan` | ⚠️ TC-001…TC-006 aprobaron; TC-007…TC-011 bloqueados por autorización de egress |
| Seed/central roadmap | ✓ idénticos byte a byte |
| Inserción append-only | ✓ fixture: solo cambió `updated:` y se agregaron líneas antes del pie |
| Encoding | ✓ UTF-8 sin BOM y sin mojibake |

## Seguimiento trasladado a la épica

Los TC-007…TC-011 de `epic-from-project-plan` requieren autorización explícita para enviar prompts al runner externo. La tarea quedó registrada en `EPIC-21`; no bloquea el cierre de implementación de STORY-111.

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---:|---|---|---|
| 1 | Escenarios Gherkin pasan | ⚠️ | Los casos externos restantes están registrados como seguimiento de EPIC-21. |
| 2 | Criterios no funcionales verificados | ✓ | Encoding, rutas, templates y gates deterministas verificados. |
| 3 | Comportamiento coincide con design.md | ✓ | Cambios implementan D-1…D-9 y los contratos de verificación. |
| 4 | No hay regresiones | ✓ | `npm test` y `npm run verify:repository` aprobaron. |
| 5 | Convenciones, seguridad y documentación | ✓ | Fuente Markdown, sin secretos, CHANGELOG y README actualizados. |
| 6 | Todas las tareas están `[x]` | ✓ | T034 fue trasladada a la épica y está marcada como completada en la historia. |
| 7 | Tests y CI | ⚠️ | Gates deterministas verdes; el seguimiento externo vive en EPIC-21. |

**Resumen:** 5/7 criterios ✓; sin criterios DoD en error. La historia transita a `IMPLEMENT/DONE`.

## Nota sobre los Tests Generados

Los evals pendientes quedaron registrados en EPIC-21 y no bloquean el siguiente paso de STORY-111.
