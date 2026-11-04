---
type: implement-report
id: STORY-172
slug: STORY-172-implement-report
title: "Implement Report: Skill epic-complete — archivar épicas canceladas"
story: STORY-172
created: 2026-10-30
updated: 2026-10-30
---

# Reporte de Implementación: Skill epic-complete — archivar épicas canceladas

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-172 |
| Total de tareas | 18 |
| Tareas completadas | 18 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-10-30 |

**Estado:** ✅ Implementación completa

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Verificar artefactos de STORY-171 y nombres reales del motor | ✓ completado | — (`planCompletion`, `applyCompletion`, `archiveDateOf` y `ARCHIVE_CONFLICT` tras `archiveDate` confirmados; `test/epic-complete.test.js` 31/31 antes de empezar) |
| T002 | Corregir el slug obsoleto en `related:` de `story.md` (CR-002) | ✓ completado | — (ya corregido: `related:` usa `STORY-171-completar-archivar-epica-liberada`) |
| T003 | Tabla de admisión con `archive-canceled` y `CANCELED_NOT_DONE` | ✓ completado | `skills/epic-complete/scripts/epic-complete.js` |
| T004 | Fecha y destino de `archive-canceled` como `archive-only`; `--version` ignorado | ✓ completado | `skills/epic-complete/scripts/epic-complete.js` (sin código nuevo: la rama hereda `archiveDateOf`, `ARCHIVE_CONFLICT` y `version: null`) |
| T005 | `applyCompletion` sin escritura, mensaje de éxito y cabecera de uso | ✓ completado | `skills/epic-complete/scripts/epic-complete.js`, `test/epic-complete.test.js` |
| T006 | `SKILL.md`: precondiciones, resumen, pregunta, línea `✅` y `description` | ✓ completado | `skills/epic-complete/SKILL.md` (191 líneas; `description` 343 caracteres) |
| T007 | `error-codes.md`: `CANCELED_NOT_DONE`, `NOT_SHIPPED` y `NO_ARCHIVE_DATE` | ✓ completado | `skills/epic-complete/references/error-codes.md` |
| T008 | `README.md`: estados admitidos sin la exclusión de STORY-172 | ✓ completado | `skills/epic-complete/README.md` |
| T009 | Retirar `CANCELED/DONE` del caso `NOT_SHIPPED`; contrato 1 | ✓ completado | `test/epic-complete.test.js` |
| T010 | Contratos 2–3: archivado byte a byte y rename `R` sin commit | ✓ completado | `test/epic-complete.test.js` |
| T011 | Contratos 4–6: `CANCELED_NOT_DONE`, `ARCHIVE_CONFLICT`, `NO_ARCHIVE_DATE`, `--version` ignorado | ✓ completado | `test/epic-complete.test.js` |
| T012 | Evals TC-005 a TC-007 (contratos 7–9) | ✓ completado | `skills/epic-complete/evals/evals.json` |
| T013 | Fila de `epic-complete` en el mapa de skills | ✓ completado | `docs/domains/domain-skills-map.md` |
| T014 | Entrada en `CHANGELOG.md › [Unreleased] › Added` | ✓ completado | `CHANGELOG.md` |
| T015 | `npm test` | ✓ completado | — (432/432) |
| T016 | `npm run verify:repository` | ✓ completado | — (aprobado, incluye `verify-fixed-layout` y `verify-eval-inventory`) |
| T017 | `graphify update .` | ✓ completado | `graphify-out/` (no versionado) |
| T018 | Registrar `npm run test:eval -- epic-complete` para revisión humana | ✓ completado | — (ver «Nota sobre los Tests Generados») |

### Notas de implementación

- **Motor:** `planCompletion` evalúa `CANCELED/DONE` → `archive-canceled` y `CANCELED/<otro>` → `CANCELED_NOT_DONE` antes del caso general, así una cancelada nunca recibe `NOT_SHIPPED` ni la sugerencia `/epic-ship`. `applyCompletion` ya escribía `epic.md` solo con `complete` y ya decía «epic.md no se modificó» en `MOVE_FAILED` fuera de `complete`; solo cambia el mensaje de éxito de `archive-canceled`.
- **Pruebas:** la sección `STORY-172 — archivado de épicas CANCELED` añade 8 casos (contratos 1–6, más `CANCELED/TODO` y `MOVE_FAILED` con `archive-canceled`). `test/epic-complete.test.js` pasa de 31 a 38 casos.
- **`description` de `SKILL.md`:** se reformuló para incorporar «archivar épica cancelada» sin superar 350 caracteres.
- **TC-006:** el `contains` usa «Solo se archivan…» con mayúscula, como lo emite el motor.

---

## Cumplimiento DoD — Fase IMPLEMENT

Fuente: `docs/guardrails/dod-story-implement.md` (`enforcement: error`).

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | AC-1, AC-2 y AC-3 pasan a nivel motor (contratos 1–6 en `test/epic-complete.test.js`); la conducta del skill (pregunta y confirmación, TC-005 a TC-007) requiere `npm run test:eval -- epic-complete`, que se ejecuta a criterio humano |
| 2 | Criterios no funcionales verificados | ✓ | CNF-1: `epic.md` byte a byte igual tras archivar (contrato 2); CNF-2: pregunta obligatoria sin `--yes` en `SKILL.md`; CNF-3/CNF-4: detalle en `references/error-codes.md`, `SKILL.md` 191 líneas |
| 3 | Comportamiento coincide con `design.md` | ✓ | Tabla de admisión, mensajes, `version: null` y `ARCHIVE_CONFLICT` heredado según Esquema e Interfaces |
| 4 | Sin regresiones | ✓ | `npm test` 432/432 |
| 5 | Convenciones de `constitution.md` | ✓ | CommonJS sin dependencias, idioma español, mismo estilo que el motor de STORY-171 |
| 6 | Sin código comentado ni `TODO` | ✓ | Revisión del diff |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | Revisión del diff; no se añaden funciones |
| 8 | Linter y formateador sin errores | ✓ | `npm run verify:repository` aprobado |
| 9 | Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| 10 | `skill-master` para skills nuevos | ✓ | N/A: no se crea skill nuevo |
| 11 | Ruta de skill nuevo en `files` de `package.json` | ✓ | N/A: `skills/` ya se publica |
| 12 | Se cumple `gr-ai-security-checklist` | ✓ | Sin nuevas entradas al modelo ni ejecución de contenido; el motor no interpreta texto de `epic.md` más allá de `status`/`substatus`/fechas |
| 13 | Se cumple `gr-code-security-checklist` | ✓ | Sin secretos, sin shell (`spawnSync` con argumentos en arreglo, heredado), rutas validadas por `locateEpic` |
| 14 | Se cumple `gr-skill-creation-checklist` | ✓ | `SKILL.md` < 200 líneas, `description` 343 ≤ 350, `<!-- SDDF-FIXED-LAYOUT: v1 -->` presente, detalle en `references/` |
| 15 | Skills críticos con `evals/evals.json` | ✓ | `skills/epic-complete/evals/evals.json` con TC-001 a TC-007 |
| 16 | Casos de prueba ejecutados y evaluados automáticamente | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement; AGENTS.md reserva `npm run test:eval` a criterio humano |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 18/18 `[x]` |
| 18 | README o docs actualizados si cambian contratos | ✓ | `README.md`, `SKILL.md`, `error-codes.md`, `domain-skills-map.md` |
| 19 | Decisiones de diseño no previstas documentadas | ✓ | Ninguna decisión nueva; las notas de implementación registran los ajustes menores |
| 20 | CHANGELOG actualizado | ✓ | Entrada STORY-172 en `## [Unreleased] › ### Added` |
| 21 | Build de CI pasa | ✓ | `npm run verify:repository` (el gate de `quality.yml`) y `npm test` aprobados en local |
| 22 | Sin secretos expuestos | ✓ | Revisión del diff |
| 23 | Variables de entorno documentadas | ✓ | N/A: no se añaden |
| 24 | Despliegue reversible sin pérdida de datos | ✓ | Cambios sin commit; el motor no hace commit y conserva el historial con `git mv` |

**Resumen:** 22/24 criterios ✓ · 2 ⚠️ · 0 ❌

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.
Este skill genera el código pero no ejecuta ni verifica que los tests pasen. En esta ejecución se corrieron `npm test` (432/432) y `npm run verify:repository` (aprobado).

Pendiente para revisión humana (T018, contratos 7–9): `npm run test:eval -- epic-complete`.

Pasos recomendados:
1. Ejecutar el suite de tests del proyecto
2. Si algún test falla, revisar el código generado y ajustar manualmente
3. Consultar `design.md` para verificar que la implementación respeta las interfaces definidas
