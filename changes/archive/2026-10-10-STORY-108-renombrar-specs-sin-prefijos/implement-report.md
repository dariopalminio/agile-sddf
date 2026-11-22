---
type: implement-report
id: STORY-108
slug: STORY-108-renombrar-specs-sin-prefijos-implement-report
title: "Implement Report: Renombrar specs/02-epics/ → specs/epics/ y specs/03-stories/ → specs/stories/"
story: STORY-108
created: 2026-10-10
updated: 2026-10-10
---

# Reporte de Implementación: Renombrar `specs/02-epics/` → `specs/epics/` y `specs/03-stories/` → `specs/stories/`

## Resumen

| Métrica | Valor |
|---|---:|
| Historia | STORY-108 |
| Total de tareas | 31 |
| Tareas completadas | 31 |
| Tareas bloqueadas | 0 |
| Tareas pendientes de autorización | 0 |
| Fecha de implementación | 2026-10-10 |

**Estado:** ✅ Implementación completa.

## Tabla de estado por tarea

| ID | Estado | Evidencia |
|---|---|---|
| T001–T004 | ✓ completadas | Línea base limpia; 23 épicas, 115 historias, 58/401 archivos y 219 pruebas correctas. |
| T005–T009 | ✓ completadas | `git mv` movió los niveles y sus fixtures; las rutas viejas no existen en el árbol fuente. |
| T010–T016 | ✓ completadas | Motor, plantillas, migrador y pruebas actualizados; `npm test` pasa 219/219. |
| T017–T024 | ✓ completadas | 91 archivos vivos actualizados; revisión manual de 47 tokens desnudos; preflight fuente y evals ajustados. |
| T025 | ✓ excepción aceptada | El índice versionado no conserva rutas viejas. `index --dry-run` muestra las rutas antiguas únicamente en títulos de registros históricos excluidos por el alcance; se preservan para no reescribir esos registros. |
| T026–T029 | ✓ completadas | EPIC-21 actualizado, verificaciones correctas y `01-projects/` preservado al contener `project.md`. |
| T030 | ✓ completada | Commit atómico único creado con renombrados y ediciones de la historia; verificado con `git show --stat HEAD`. |
| T031 | ✓ completada | Con confirmación explícita, `node scripts/cli.js install --force` instaló Claude Code local: 34 skills, 10 agentes, 0 omitidos. |

## Verificaciones

- `npm test`: 219 pruebas aprobadas.
- `npm run verify:eval-inventory`: inventario válido (34 skills, 8 excepciones explícitas).
- `node scripts/check-doc-links.js`: 48 Markdown activos correctos.
- `node scripts/audit-root-resolution.js`: contrato verificado en 34 skills fuente.
- `memory-system check --root docs`: 59 problemas, igual que la línea base (10 huérfanos, 49 wikilinks rotos).
- El grep de AC-2 no devuelve rutas antiguas en el conjunto vivo delimitado.
- Los conteos posteriores coinciden con la línea base: 23 épicas, 115 historias, 58 y 401 archivos respectivamente.

## `01-projects/` preservado

`docs/specs/01-projects/` contiene el siguiente archivo y se conservó sin modificaciones:

- `docs/specs/01-projects/PROJ-01-agile-sddf/project.md`

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / justificación |
|---:|---|---|---|
| 1 | Escenarios Gherkin pasan | ✓ | Las comprobaciones de AC-1 y AC-2 se ejecutaron y `npm test` pasa 219/219. |
| 2 | Criterios no funcionales verificados | ✓ | El índice versionado y el conjunto vivo no contienen rutas antiguas. Se aceptó la excepción para títulos de registros históricos mostrados por `index --dry-run`. |
| 3 | Comportamiento coincide con `design.md` | ✓ | Renombrados, sustitución delimitada, fixtures y validaciones siguen D-1 a D-9. |
| 4 | Sin regresiones | ✓ | Suite completa pasa y enlaces activos resuelven. |
| 5 | Convenciones de `constitution.md` | ✓ | Cambios limitados a Markdown y Node.js, con nombres y rutas establecidos. |
| 6 | Sin código comentado o TODO sin issue | ✓ | No se introdujeron TODOs en los cambios de implementación. |
| 7 | Sin símbolos sin uso | ⚠️ | Requiere análisis estático; no hay linter configurado para esta comprobación. |
| 8 | Linter y formateador sin errores | ⚠️ | El repositorio no expone un comando de linter/formateador en el flujo de la historia. |
| 9 | Sin dependencias nuevas | ✓ | No se modificaron dependencias. |
| 10 | `skill-master` para skills nuevos | ✓ | No se creó ningún skill nuevo. |
| 11 | Skills nuevos incluidos en `package.json` | ✓ | No aplica: no hay skills nuevos. |
| 12 | Checklist de seguridad IA | ⚠️ | No evaluable por este workflow de implementación. |
| 13 | Checklist de seguridad de código | ⚠️ | No evaluable por este workflow de implementación. |
| 14 | Checklist de creación de skills | ✓ | No aplica: no hay skills nuevos. |
| 15 | Skills críticos con evals | ✓ | Las fuentes modificadas conservan sus manifests de evals; inventario válido. |
| 16 | Evals ejecutados automáticamente | ⚠️ | El inventario fue validado; la ejecución LLM de evals queda fuera de este workflow. |
| 17 | Todas las tareas están `[x]` | ✓ | T001–T031 están completadas; T025 registra la excepción aceptada. |
| 18 | Docs o README actualizados si aplica | ✓ | README, índice, arquitectura, guías y documentos vivos actualizados. |
| 19 | Decisiones de diseño nuevas documentadas | ✓ | No se tomaron decisiones fuera de `design.md`; el bloqueo se registra aquí. |
| 20 | Changelog actualizado si aplica | ✓ | El Non-Goal de la historia excluye versión y CHANGELOG. |
| 21 | Build de CI pasa | ⚠️ | `npm test` pasa; el gate completo de CI no se ejecutó en este workflow. |
| 22 | Sin secretos o credenciales | ✓ | No se añadieron secretos ni configuraciones sensibles. |
| 23 | Variables de entorno documentadas | ✓ | No se añadieron variables de entorno. |
| 24 | Despliegue reversible | ✓ | El cambio está en Git y no modifica datos de despliegue. |

**Resumen:** 18/24 criterios ✓ · 0 criterios ❌ · 6 criterios ⚠️.

La historia transiciona a `IMPLEMENT/DONE`. La excepción de T025 queda documentada y aceptada: no se reescriben títulos de registros históricos para alterar la salida de `index --dry-run`.

## Siguiente paso

Ejecutar `/story-code-review STORY-108` como quality gate posterior a la implementación.
