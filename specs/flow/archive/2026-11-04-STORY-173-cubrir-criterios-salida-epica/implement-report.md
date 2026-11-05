---
type: implement-report
id: STORY-173
slug: STORY-173-implement-report
title: "Implement Report: Skill epic-refine: asignar la cobertura de criterios de salida"
story: STORY-173
created: 2026-10-29
updated: 2026-10-30
---

# Reporte de Implementación: Skill epic-refine: asignar la cobertura de criterios de salida

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-173 |
| Total de tareas | 23 |
| Tareas completadas | 0 (rework: solo correcciones de `fix-directives.md`) |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 23 |
| Fecha de implementación | 2026-10-30 (rework ronda 1; implementación inicial 2026-10-29) |

**Estado:** ✅ Implementación completa

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Verificar que STORY-165 está implementada | ✓ completado (ejecución anterior) | — |
| T002 | Catálogo SAL: extracción y revalidación (D-2) | ✓ completado (ejecución anterior) | `skills/epic-refine/references/sal-corrections.md` §1 |
| T003 | Catálogo SAL: regla de la historia de cierre (D-3) | ✓ completado (ejecución anterior) | `skills/epic-refine/references/sal-corrections.md` §2 |
| T004 | Catálogo SAL: casos fuera de alcance y estados admitidos (D-4) | ✓ completado (ejecución anterior) | `skills/epic-refine/references/sal-corrections.md` §3 |
| T005 | Catálogo SAL: AC de cierre y cita E1 (D-5) | ✓ completado (ejecución anterior) | `skills/epic-refine/references/sal-corrections.md` §4 |
| T006 | Catálogo SAL: plan, reporte y relectura (D-5, D-6) | ✓ completado (ejecución anterior) | `skills/epic-refine/references/sal-corrections.md` §5 |
| T007 | `SKILL.md`: fila de enrutamiento, «Qué hace/NO hace», error de catálogo ausente | ✓ completado (ejecución anterior) | `skills/epic-refine/SKILL.md` |
| T008 | `SKILL.md`: regla CNF-2, `Replanifica:` en el resumen, `description` | ✓ completado (ejecución anterior) | `skills/epic-refine/SKILL.md` |
| T009 | Template del reporte: forma de **Elemento** SAL y **Después** | ✓ completado (ejecución anterior) | `skills/epic-refine/assets/epic-refine-report-template.md` |
| T010 | README: capacidades SAL-01/SAL-02 y límites | ✓ completado (ejecución anterior) | `skills/epic-refine/README.md` |
| T011 | Fixture `cobertura-cierre/` | ✓ completado (ejecución anterior) | `skills/epic-refine/examples/cobertura-cierre/` |
| T012 | Fixture `cobertura-sin-parcial/` | ✓ completado (ejecución anterior) | `skills/epic-refine/examples/cobertura-sin-parcial/` |
| T013 | Fixture `cobertura-empate/` | ✓ completado (ejecución anterior) | `skills/epic-refine/examples/cobertura-empate/` |
| T014 | Fixture `cobertura-reejecucion/` (con `story.md.bak`) | ✓ completado (ejecución anterior) | `skills/epic-refine/examples/cobertura-reejecucion/` |
| T015 | Fixture `cobertura-smoke-implementada/` | ✓ completado (ejecución anterior) | `skills/epic-refine/examples/cobertura-smoke-implementada/` |
| T016 | Evals TC-009…TC-013 | ✓ completado (ejecución anterior) | `skills/epic-refine/evals/evals.json` |
| T017 | Escritores `epic-refine` en el template de historia (central = seed) | ✓ completado (ejecución anterior) | `docs/templates/story-template.md`, `skills/story-creation/assets/story-template.md` |
| T018 | Guía del pipeline §2 | ✓ completado (ejecución anterior) | `docs/guides/sddf-commands-pipeline.md` |
| T019 | `SKILL.md` < 500 líneas, `description` ≤ 500 caracteres | ✓ completado (ejecución anterior) | — |
| T020 | UTF-8 sin BOM y `cmp` de templates | ✓ completado (ejecución anterior) | — |
| T021 | `npm test` y `npm run verify:repository` | ✓ completado (ejecución anterior) | — |
| T022 | `graphify update .` | ✓ completado (ejecución anterior) | `graphify-out/` |
| T023 | Registrar la ejecución manual de evals | ✓ completado (ejecución anterior) | — |

Fuera de `tasks.md`, por veracidad (CR-006 en `design.md`): en la ejecución anterior se actualizaron `CHANGELOG.md` y `docs/domains/domain-epic-lifecycle.md`, que dejaban SAL-01/SAL-02 fuera del alcance de `epic-refine`.

---

## Correcciones de fix-directives.md (ronda 1)

| # | Archivo:Línea | Severidad | Resultado |
|---|---|---|---|
| 1 | skills/epic-refine/evals/evals.json:209 | MEDIUM | 💻 corregido: skills/epic-refine/evals/evals.json. En TC-013 se quitó `"status: IMPLEMENT"` de `contains`. Se añadió a `not_contains` `"STORY-303-totalizar-comisiones/story.md ==="`, el patrón de TC-001, para comprobar que STORY-303 no se escribe. Se agregó al `context` la convención de rutas de los bloques FILE para que ese patrón sea comparable. La `description` ya no afirma «conserva status: IMPLEMENT»: ahora dice que su `story.md` no se escribe. |
| 2 | docs/guardrails/dod-story-code-review.md:21 | MEDIUM | Se resuelve con el #1; el DoD no se modifica (fuera de la lista blanca) |
| 3 | docs/guardrails/dod-story-code-review.md:25 | MEDIUM | Se resuelve al re-ejecutar `/story-code-review STORY-173`; el DoD no se modifica |

**Archivos corregidos:** `skills/epic-refine/evals/evals.json`
**Hallazgos omitidos por archivo inexistente:** ninguno

Los hallazgos LOW de `code-review-report.md` no están en `fix-directives.md` y no se aplicaron en esta ronda. La lista blanca solo admite `evals.json`.

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | AC-1 y AC-2 se verifican con TC-009 y TC-010. Requiere ejecutar los evals, así que story-implement no puede evaluarlo |
| 2 | Criterios no funcionales verificados | ⚠️ | CNF-3 (sin BOM; `evals.json` empieza por `7b`) y CNF-4 están verificados. CNF-1 y CNF-2 dependen de TC-009…TC-013 |
| 3 | El comportamiento coincide con `design.md` | ✓ | D-1…D-8 aplicados; la corrección solo ajusta una aserción de eval |
| 4 | Sin regresiones | ✓ | `npm test` 438/438 y `npm run verify:repository` en verde (2026-10-30); TC-001…TC-012 sin cambios |
| 5 | Convenciones de `constitution.md` | ✓ | Fuente única en `skills/epic-refine/`, español, layout fijo |
| 6 | Sin código comentado ni `TODO` | ✓ | Ninguno introducido |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | No aplica: solo JSON |
| 8 | Linter y formateador sin errores | ✓ | `JSON.parse` correcto; `verify:repository` aprobado |
| 9 | Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| 10 | Se usó `skill-master` | ✓ | En la ejecución anterior; esta ronda no crea ni reescribe skills |
| 11 | Skill nuevo incluido en `package.json › files` | ✓ | No hay skill nuevo |
| 12 | [[gr-ai-security-checklist]] | ⚠️ | Sin cambios de comportamiento del skill; el checklist no se re-evaluó ítem por ítem |
| 13 | [[gr-code-security-checklist]] | ⚠️ | Sin código ejecutable nuevo; el checklist no se re-evaluó ítem por ítem |
| 14 | [[gr-skill-creation-checklist]] | ⚠️ | Estructura del skill intacta; el checklist no se re-evaluó ítem por ítem |
| 15 | Skills críticos con `evals/evals.json` | ✓ | `skills/epic-refine/evals/evals.json` (25 casos, versión 1.4.0) |
| 16 | Casos de prueba ejecutados y evaluados | ⚠️ | Ejecución manual a criterio humano (AGENTS.md); story-implement no puede evaluarlo |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 23/23 |
| 18 | README o docs actualizados si cambia un contrato | ✓ | Sin cambio de contrato en esta ronda |
| 19 | Decisiones no previstas documentadas en `design.md` | ✓ | Ninguna nueva |
| 20 | CHANGELOG actualizado | ✓ | No aplica: corrección interna de un eval |
| 21 | Build de CI sin errores | ✓ | `verify:repository` (mismo gate que `quality.yml`) aprobado en local |
| 22 | Sin secretos ni credenciales | ✓ | Ninguno |
| 23 | Variables de entorno documentadas | ✓ | No aplica |
| 24 | Despliegue reversible | ✓ | Cambio solo en JSON versionado |

**Resumen:** 18/24 criterios ✓ (6 ⚠️, 0 ❌)

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.
Este skill genera el código pero no ejecuta ni verifica que los tests pasen.

Pendiente de ejecución manual (criterio humano, AGENTS.md):

1. `npm run test:eval -- epic-refine`: TC-013 corregido, TC-009…TC-012 nuevos y el resto sin regresión.
2. Recorrido sobre `skills/epic-refine/examples/cobertura-cierre/`: `/epic-refine EPIC-30 --auto` → `/epic-analyze EPIC-30` debe cubrir `CS-1` por E1 en STORY-302 (V-1…V-4).
3. Consultar `design.md` para verificar que la implementación respeta las interfaces definidas.
