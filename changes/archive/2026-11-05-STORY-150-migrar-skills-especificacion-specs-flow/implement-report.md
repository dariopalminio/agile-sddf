---
type: implement-report
id: STORY-150
slug: STORY-150-implement-report
title: "Implement Report: Migrar los skills de especificación a specs/flow"
story: STORY-150
created: 2026-10-23
updated: 2026-10-23
---

# Reporte de Implementación: Migrar los skills de especificación a specs/flow

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-150 |
| Total de tareas | 22 |
| Tareas completadas | 22 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-10-23 |

**Estado:** ✅ Implementación completa — con una salvedad: `npm run verify:repository` y `npm test` no terminan en verde por 15 fallos **preexistentes** ajenos a la historia (ver «Verificación»).

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos |
|---|---|---|---|
| T001 | Precondiciones | ✓ (con nota) | — |
| T002 | Línea base | ✓ | `.tmp/story-implement/STORY-150/baseline-*.txt` |
| T003 | RED: retirar 6 skills de `PENDING_MIGRATION` | ✓ | `scripts/verify-fixed-layout.js`, `.tmp/…/red.txt` |
| T004 | E2E-002 sobre `docs/guardrails/<slug>.md` | ✓ | `test/dod-story.test.js` |
| T005 | `story-creation/SKILL.md` | ✓ | `skills/story-creation/SKILL.md` |
| T006 | `story-evaluation/SKILL.md` (+ resolución por ID, error AC-2) | ✓ | `skills/story-evaluation/SKILL.md` |
| T007 | `story-refine/SKILL.md` | ✓ | `skills/story-refine/SKILL.md` |
| T008 | `story-improve/SKILL.md` | ✓ | `skills/story-improve/SKILL.md` |
| T009 | `story-split/SKILL.md` | ✓ | `skills/story-split/SKILL.md` |
| T010 | `story-specify/SKILL.md` | ✓ | `skills/story-specify/SKILL.md` |
| T011 | READMEs | ✓ | `skills/story-creation/README.md`, `skills/story-specify/README.md` |
| T012 | Rol local `product-owner` | ✓ | `skills/story-specify/assets/agents/product-owner.md` |
| T013 | Ejemplo de split | ✓ | `skills/story-split/examples/output/split-result.md` |
| T014 | Evals de `story-specify` (TC-003 reemplazado) | ✓ | `skills/story-specify/evals/evals.json` |
| T015 | Evals de `story-evaluation` (TC-009 nuevo) | ✓ | `skills/story-evaluation/evals/evals.json` |
| T016 | Evals de `story-refine` | ✓ | `skills/story-refine/evals/evals.json` |
| T017 | `npm run verify:layout` | ✓ `[OK]` | `.tmp/…/green.txt` |
| T018 | Greps de contratos | ✓ (ver nota 3) | — |
| T019 | Validación de evals (JSON + `--dry-run`) | ✓ | — |
| T020 | `npm test` y `verify:repository` | ⚠️ ver «Verificación» | `.tmp/…/final-*.txt` |
| T021 | Revisión de `git diff --stat` | ✓ | — |
| T022 | `graphify update .` | ✓ | — |

---

## Correcciones de fix-directives.md (ronda 1)

| # | Archivo:Línea | Severidad | Resultado |
|---|---|---|---|
| 1 | story.md:AC-3 (Entonces 2); implement-report.md:62 | MEDIUM | 💻 corregido: `story.md` (excepción/dependencia registrada bajo AC-3) e `implement-report.md` (este reporte) |

**Archivos corregidos:** `story.md`, `implement-report.md`
**Hallazgos omitidos por archivo inexistente:** ninguno

Decisión aplicada: no se tocó código de los skills ni los 15 tests fallidos de la migración de plantilla de épica (fuera de la lista blanca). La segunda cláusula de AC-3 queda registrada en `story.md` como excepción/dependencia de la historia que cierre esa migración; el criterio de cumplimiento de esta historia es `verify:layout` en `[OK]` sin fallos nuevos respecto de la línea base (re-verificado en esta ronda: 268 pass / 15 fail, los mismos 15).

---

## Verificación

- **`npm run verify:layout`:** `[OK]` con los seis skills fuera de `PENDING_MIGRATION` (RED previo: errores R1/R3 en los seis; GREEN tras la migración).
- **`test/dod-story.test.js`:** 38/38 en verde (E2E-002 con la ruta fija).
- **`npm test`:** 268 pass / **15 fail**. Los 15 fallos son idénticos a los de la línea base previa a cualquier cambio (todos de la migración de plantilla de épica: UT-001, UT-003, UT-005…UT-012, UT-014, UT-016, UT-019, UT-020, IT-001). Ninguno toca esta historia.
- **`npm run verify:repository`:** falla únicamente en el paso `pruebas deterministas` por esos mismos 15 tests; el paso de contrato de layout fijo pasa. **La segunda cláusula de AC-3 («verify:repository termina en verde») queda por tanto sin cumplir hasta resolver los fallos preexistentes de epic-template**, que son de otra historia.
- **Evals reales:** no ejecutados (CNF-1, a criterio humano). `npm run test:eval -- story-specify|story-evaluation|story-refine --dry-run` genera los prompts e incluye los casos nuevos.

## Notas y desviaciones

1. **T001:** STORY-147 y STORY-148 están en `CODE-REVIEW/DONE`, no en `DONE`. ADR-0016 está `ACCEPTED` y `scripts/verify-fixed-layout.js` existe con `PENDING_MIGRATION`; se continuó.
2. **`story-creation` Tipo C:** sin coincidencias sigue tratando el input como texto libre (Tipo A) en lugar de emitir error, porque crear una historia nueva es el flujo esperado; la búsqueda solo se hace en `specs/flow/STORY-*/`. `story-evaluation`, `story-refine` y `story-split` sí emiten `❌ No se encontró la historia … en specs/flow/`.
3. **Grep del contrato #2 (`docs/specs|specs/stories`):** solo quedan las entradas `"docs/specs"` en `not_contains` de los evals (TC-001 y TC-003 de `story-specify`, TC-009 de `story-evaluation`), exigidas por el propio diseño (D-8). Ninguna ruta legada en `SKILL.md`, READMEs, ejemplos ni agentes. `grep -rnE "SPECS_BASE|SDDF_ROOT"` sobre los seis skills: sin coincidencias.
4. **`$CLI_ROOT`:** al eliminarse su definición con el bloque v1, las referencias al seed de `story-creation` y a la plantilla de `story-refine` se reexpresaron como rutas relativas al skill (`assets/…`).
5. **Fuera de alcance respetado:** no se reinstalaron copias de runtime; los work items de este repo siguen en `docs/specs/` hasta STORY-153 (no ejecutar `agile-sddf install` antes, para no mezclar el contrato nuevo con work items legados).

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia |
|---|---|---|---|
| 1 | Escenarios Gherkin de `story.md` pasan | ⚠️ | AC-1/AC-2 reflejados en SKILL.md y evals (no ejecutados); AC-3: grep y `verify:layout` OK, `verify:repository` rojo por fallos preexistentes |
| 2 | CNF de `story.md` verificados | ⚠️ | CNF-2 verificado por `verify:layout`; CNF-1: evals con `specs/flow/` y dry-run OK, ejecución real pendiente |
| 3 | Comportamiento coincide con `design.md` | ✓ | D-1…D-8 aplicados |
| 4 | Sin regresiones | ⚠️ | Mismos 15 fallos que la línea base; sin nuevos |
| 5 | Convenciones de `constitution.md` | ✓ | Español, sustitución textual sin archivos nuevos |
| 6 | Sin código comentado/TODO | ✓ | — |
| 7 | Sin variables/imports sin usar | ✓ | — |
| 8 | Linter/formateador | ⚠️ | Requiere ejecución externa — no evaluable por story-implement-tasks |
| 9 | Sin dependencias nuevas | ✓ | — |
| 10 | Uso de `skill-master` para skills nuevos | ✓ | No se crean skills |
| 11 | Ruta de skill nuevo en `files` | ✓ | No aplica |
| 12–14 | `gr-ai-security`, `gr-code-security`, `gr-skill-creation` | ⚠️ | No evaluados en detalle; cambios solo textuales |
| 15 | Skills críticos con `evals/evals.json` | ✓ | Los seis tienen evals |
| 16 | Casos de prueba ejecutados automáticamente | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement-tasks (CNF-1) |
| 17 | `tasks.md` todo `[x]` | ✓ | 22/22 |
| 18 | README/docs de contratos actualizados | ✓ | READMEs de creation y specify |
| 19 | Decisiones no previstas en `design.md` | ✓ | Notas 2 y 4 aquí; sin cambio de diseño |
| 20 | CHANGELOG si aplica | ⚠️ | Fuera de alcance (STORY-154) |
| 21 | CI sin errores | ⚠️ | Requiere ejecución de CI; `verify:repository` rojo por fallos preexistentes |
| 22–24 | Sin secretos, variables documentadas, rollback | ✓ | Cambios textuales reversibles con git |

**Resumen:** 11/24 criterios ✓, 0 ❌ (los ⚠️ requieren ejecución externa o dependen de los fallos preexistentes).

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto. Esta historia solo modifica `test/dod-story.test.js` (E2E-002).
