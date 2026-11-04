---
type: release-notes
id: EPIC-23
epic: EPIC-23-completar-flujo-de-epic
slug: EPIC-23-completar-flujo-de-epic-release-notes
title: "Notas de versión: Completar flujo de epic"
created: 2026-11-04
updated: 2026-11-04
related:
  - EPIC-23-completar-flujo-de-epic
---

# Notas de versión: Completar flujo de epic

## Resumen

Las épicas ahora tienen un recorrido completo, desde su definición hasta su cierre y archivo, con un paso guiado para cada etapa. En cada punto de control, un veredicto claro indica si la épica puede avanzar o qué hay que corregir antes de continuar. Quien la gestiona puede preparar la versión y cerrar la épica sin redactar las notas ni rastrear el estado a mano.

## Novedades

- **Validar la preparación estructural de una épica** — identificar de forma objetiva los impedimentos antes de que la épica avance en su ciclo de vida.
- **Validar la evidencia operativa de una épica** — evitar liberar una épica cuyo comportamiento operativo o controles de calidad fallan.
- **Operar la validación de épicas de manera segura** — revisar una épica sin riesgo de escrituras y usar el mismo veredicto como gate automatizado y reproducible.
- **Integrar y documentar el gateway de validación de épicas** — que ninguna épica quede lista para `SHIP` sin un veredicto APPROVED vigente y que todo runtime instalado aplique la misma regla de liberación.
- **Evaluar la validación de épicas de forma repetible** — detectar regresiones antes de distribuir cambios del gateway.
- **Controlar el detalle y los límites de la ejecución de la validación de épicas** — diagnosticar por qué una épica queda BLOCKED sin repetir los comandos a mano.
- **Skill epic-refine (Core): corregir índice y enlaces de una épica** — no corregir a mano el índice ni los enlaces rotos de una épica cada vez que `epic-analyze` los detecta, y poder volver a analizarla sin esos hallazgos.
- **Veredicto de epic-format-validation** — que el bucle de `DEFINE` decida si avanza a `PLAN` o pasa por `/epic-improve` sin interpretar texto libre.
- **Skill epic-improve** — cerrar el bucle de `DEFINE` y volver a validar la épica sin corregirla a mano.
- **Skill epic-track-progress** — pasar a `/epic-validate` solo cuando no queda ninguna historia pendiente, sin que se modifique ningún archivo.
- **Suites de integración y regresión de la épica** — certificar que el conjunto de historias funciona como un release unificado.
- **Skill epic-ship** — preparar una versión documentada sin redactarla yo y dejar la épica en `SHIP/DONE` cuando confirmo que la liberé.
- **Skill epic-complete (Core) — completar y archivar una épica liberada** — que quede en `COMPLETED/DONE` dentro de `specs/flow/archive/<YYYY-MM-DD>-EPIC-NN-<slug>/`, `specs/flow/` conserve solo el trabajo activo y la épica quede como registro histórico con su historial de git intacto.
- **Skill epic-complete — archivar épicas canceladas** — sacar de `specs/flow/` el trabajo que ya no se hará sin que una épica cancelada se confunda con una liberada en el registro histórico.
- **Skill epic-refine: asignar la cobertura de criterios de salida** — que la épica supere el análisis de criterios de salida sin elegir ni editar a mano la historia dueña, y sin repartir citas que falseen la cobertura.
- **Skill epic-refine: corregir referencias obsoletas tras un split** — que el índice de la épica y los `related` de sus historias apunten a historias reales sin rastrearlas a mano después de cada split.
- **Admitir épicas archivadas en el layout fijo con un ADR nuevo** — que `/epic-complete` pueda archivar una épica sin contradecir una regla aceptada, y que los skills de épica sigan numerando y resolviendo épicas sin reutilizar números de épicas archivadas.

## Historias incluidas

| ID | Título | Categoría | Estado |
|---|---|---|---|
| STORY-124 | Validar la preparación estructural de una épica | Added | DELIVER/DONE |
| STORY-125 | Validar la evidencia operativa de una épica | Added | DELIVER/DONE |
| STORY-126 | Operar la validación de épicas de manera segura | Added | DELIVER/DONE |
| STORY-127 | Integrar y documentar el gateway de validación de épicas | Added | DELIVER/DONE |
| STORY-128 | Evaluar la validación de épicas de forma repetible | Added | DELIVER/DONE |
| STORY-137 | Controlar el detalle y los límites de la ejecución de la validación de épicas | Added | DELIVER/DONE |
| STORY-165 | Skill epic-refine (Core): corregir índice y enlaces de una épica | Added | DELIVER/DONE |
| STORY-166 | Veredicto de epic-format-validation | Added | DELIVER/DONE |
| STORY-167 | Skill epic-improve | Added | DELIVER/DONE |
| STORY-168 | Skill epic-track-progress | Added | DELIVER/DONE |
| STORY-169 | Suites de integración y regresión de la épica | Added | DELIVER/DONE |
| STORY-170 | Skill epic-ship | Added | DELIVER/DONE |
| STORY-171 | Skill epic-complete (Core) — completar y archivar una épica liberada | Added | DELIVER/DONE |
| STORY-172 | Skill epic-complete — archivar épicas canceladas | Added | DELIVER/DONE |
| STORY-173 | Skill epic-refine: asignar la cobertura de criterios de salida | Added | DELIVER/DONE |
| STORY-174 | Skill epic-refine: corregir referencias obsoletas tras un split | Added | DELIVER/DONE |
| STORY-175 | Admitir épicas archivadas en el layout fijo con un ADR nuevo | Added | DELIVER/DONE |

## No incluidas

Ninguna.
