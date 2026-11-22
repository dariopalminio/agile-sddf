---
type: implement-report
id: STORY-155
slug: STORY-155-implement-report
title: "Implement Report: Migrar los skills de planning a specs/flow"
story: STORY-155
created: 2026-10-23
updated: 2026-10-23
---

# Reporte de Implementación: Migrar los skills de planning a specs/flow

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-155 |
| Total de tareas | 26 |
| Tareas completadas | 26 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-10-23 |

**Estado:** ✅ Implementación completa

La historia es una sustitución textual guiada por el contrato de STORY-148: la fase RED es el gate `verify:layout` fallando tras retirar los seis skills de `PENDING_MIGRATION` (T003, 96 errores R1/R3) y la fase GREEN es el mismo gate en `[OK]` tras migrar los `SKILL.md` (T021).

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Precondiciones CR-002 | ✓ completado | — (ADR-0016 `ACCEPTED`; `scripts/verify-fixed-layout.js` con las seis entradas; STORY-147/148 en `CODE-REVIEW/DONE`) |
| T002 | Línea base e inventario | ✓ completado | `.tmp/story-implement/STORY-155/baseline.txt`, `inventory.txt` (121 líneas a migrar; sin `assets/agents/`) |
| T003 | Retirar los seis skills de `PENDING_MIGRATION` (RED) | ✓ completado | `scripts/verify-fixed-layout.js`; `red.txt` (exit 1, errores en los seis skills) |
| T004 | E2E-002 de `test/dod-story.test.js` | ✓ completado | — (STORY-150 D-7 ya aplicado: `expectedPath = docs/guardrails/${slug}.md`; archivo **no modificado**; 38/38 verde) |
| T005 | Migrar `story-design/SKILL.md` | ✓ completado | `skills/story-design/SKILL.md` |
| T006 | Migrar `story-tasking/SKILL.md` | ✓ completado | `skills/story-tasking/SKILL.md` |
| T007 | Migrar `story-testcases/SKILL.md` | ✓ completado | `skills/story-testcases/SKILL.md` |
| T008 | Migrar `story-analyze/SKILL.md` (incl. D-4) | ✓ completado | `skills/story-analyze/SKILL.md` |
| T009 | Migrar `story-fix-plan/SKILL.md` (incl. D-5) | ✓ completado | `skills/story-fix-plan/SKILL.md` |
| T010 | Migrar `story-plan/SKILL.md` | ✓ completado | `skills/story-plan/SKILL.md` |
| T011 | `assets/README.md` | ✓ completado | `skills/story-{design,tasking,analyze,plan}/assets/README.md` |
| T012 | Comentario del template de analyze | ✓ completado | `skills/story-analyze/assets/analyze-report-template.md` |
| T013 | `story-plan/README.md` | ✓ completado | `skills/story-plan/README.md` |
| T014 | `plan-summary.md` | ✓ completado | `skills/story-plan/examples/output/plan-summary.md` |
| T015 | Ejemplos de `story-design` | ✓ completado | `skills/story-design/examples/input/story.md`, `examples/output/design.md` |
| T016 | Ejemplos de analyze y fix-plan | ✓ completado | `skills/story-analyze/examples/output/analyze.md`, `skills/story-fix-plan/examples/example-con-hallazgos/analyze.md` |
| T017 | Evals de `story-plan` TC-002 | ✓ completado | `skills/story-plan/evals/evals.json` |
| T018 | Evals de design y tasking | ✓ completado | `skills/story-design/evals/evals.json`, `skills/story-tasking/evals/evals.json` |
| T019 | Evals de `story-fix-plan` | ✓ completado | `skills/story-fix-plan/evals/evals.json` |
| T020 | Evals de `story-analyze` TC-007 | ✓ completado | `skills/story-analyze/evals/evals.json` |
| T021 | `verify:layout` (GREEN) | ✓ completado | `.tmp/story-implement/STORY-155/green.txt` (exit 0; 35 skills validados, 5 pendientes) |
| T022 | Greps de contratos #1–#5, #8, #10 | ✓ completado | — (ver Verificación) |
| T023 | Validación de evals | ✓ completado | `.tmp/story-implement/STORY-155/dryrun-*.txt` |
| T024 | `npm test` y `verify:repository` | ✓ completado | `.tmp/story-implement/STORY-155/final.txt` |
| T025 | Revisión de alcance | ✓ completado | — (25 archivos, todos en «Componentes afectados» o artefactos de la historia) |
| T026 | `graphify update .` y reporte | ✓ completado | `implement-report.md` |

---

## Verificación (T021–T024)

| # | Contrato | Resultado |
|---|---|---|
| 1 | `grep -rnE "SPECS_BASE\|SDDF_ROOT"` en los seis skills | ✓ sin salida (exit 1) |
| 2 | `grep -rnE "docs/specs\|specs/stories\|specs/epics\|CLI_ROOT"` | ✓ solo las aserciones negativas `not_contains: "docs/specs"` que exige D-8 (`story-plan` TC-002, `story-analyze` TC-007) |
| 3 | Marcador `<!-- SDDF-FIXED-LAYOUT: v1 -->` | ✓ 1 por `SKILL.md` en los seis |
| 4 | `No se encontró la historia … en specs/flow/` | ✓ presente en los seis `SKILL.md` |
| 5 | Épica padre en `specs/flow/{parent}` (`story-analyze`) | ✓ reglas 1 y 2 de D-4 (l. 311–312) y entrada (l. 76) |
| 6 | `npm run verify:layout` | ✓ `[OK] Contrato de layout fijo verificado en 35 skill(s); 5 pendiente(s) de migración.` |
| 7 | `npm test` | ✓ 290/290 (E2E-002 y `sddf-constitution.test.js` incluidos) |
| 8 | Líneas con `root` y `sddf.config.yaml` | ✓ sin salida |
| 9 | Evals | ✓ los seis `evals.json` parsean; `npm run test:eval -- <skill> --dry-run` exit 0 para plan, design, tasking, analyze y fix-plan; TC-002 de plan con `STORY-999` y TC-007 de analyze presentes en los prompts |
| 10 | `assets/agents/` | ✓ inexistentes en los seis skills (CNF-3 se cumple de forma vacía) |
| — | `npm run verify:repository` | ✓ `[OK] Verificación determinista del repositorio aprobada.` |

`test/dod-story.test.js` **no se modificó** (T004): STORY-150 ya había aplicado D-7.

## Desviaciones menores respecto de design.md

Aplicaciones del mapa de D-2 a líneas que el inventario de `design.md` no listaba (sin decisiones nuevas):

- `skills/story-analyze/examples/output/analyze.md:110` — segunda ruta `docs/specs/epics/EPIC-10-data-management-*/` → `specs/flow/EPIC-10-data-management/` (necesaria para el contrato #2).
- `skills/story-fix-plan/evals/evals.json` — además de los 12 `context`, la `description` de TC-001 (`docs/specs/stories/…`) y la ruta de épica del `context` de TC-005 (`docs/specs/epics/EPIC-31-perfil/epic.md` → `specs/flow/EPIC-31-perfil/epic.md`); `expected` sin cambios.
- `skills/story-testcases/SKILL.md` — la fila «Historia no encontrada» de `### Manejo de errores` pasa del mensaje truncado `❌ No se encontró la historia {story_id}` al mensaje común de D-3.
- `skills/story-design/examples/output/design.md` — las menciones de `skill-preflight` sin tokens legados (l. 162, 196, 204) se conservan para no cambiar la estructura del ejemplo.

## Advertencia de dogfooding

**No reinstalar las copias de runtime (`npx agile-sddf install`) hasta STORY-153.** Los skills fuente ya apuntan a `specs/flow/`, pero los work items de este repo siguen en `docs/specs/`: con las copias reinstaladas, `/story-plan` (y design, tasking, testcases, analyze, fix-plan) dejaría de encontrar las historias del propio repo. Las copias actuales en `.claude/` (ignoradas por git) no se tocaron.

## Evals reales (contrato #12)

`npm run test:eval -- story-plan` y `npm run test:eval -- story-analyze` (y el resto de los skills migrados) quedan **a criterio humano** (CNF-1, AGENTS.md). Solo se validó su estructura con `--dry-run`.

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | AC-3 verificado (greps + `verify:repository` verde); AC-1 y AC-2 requieren ejecución de evals — no evaluable por story-implement |
| 2 | Criterios no funcionales verificados | ✓ | CNF-1 (evals con `specs/flow/`, dry-run OK), CNF-2 (marcador en los seis + gate), CNF-3 (0 coincidencias) |
| 3 | Comportamiento coincide con `design.md` | ✓ | D-1…D-8 aplicados; contratos #1–#11 verificados |
| 4 | Sin regresiones | ✓ | `npm test` 290/290 y `verify:repository` verde, igual que la línea base |
| 5 | Convenciones de `constitution.md` | ✓ | Markdown en español; bloque canónico idéntico al de STORY-150/151 |
| 6 | Sin código comentado ni `TODO` | ✓ | Ningún `TODO` añadido |
| 7 | Sin variables/imports/funciones sin usar | ✓ | Solo se retiraron entradas de un arreglo en `verify-fixed-layout.js` |
| 8 | Linter/formateador sin errores | ✓ | `verify:syntax` OK en 42 archivos JS; JSON válidos |
| 9 | Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| 10 | `skill-master` para skills nuevos | ✓ | No aplica: no se crean skills |
| 11 | Ruta de skill nuevo en `files` de `package.json` | ✓ | No aplica: no se crean skills |
| 12 | Se cumple gr-ai-security-checklist | ✓ | Sin secretos, prompts ni permisos nuevos; solo rutas |
| 13 | Se cumple gr-code-security-checklist | ✓ | Sin código ejecutable nuevo |
| 14 | Se cumple gr-skill-creation-checklist | ✓ | Estructura de los skills intacta; gate de layout y de inventario de evals OK |
| 15 | Skills críticos con `evals/evals.json` | ✓ | Los seis conservan sus evals; analyze suma TC-007 |
| 16 | Casos de prueba ejecutados automáticamente | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement (evals reales a criterio humano) |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 26/26 |
| 18 | README/docs actualizados si cambian contratos | ✓ | READMEs de los skills actualizados; guías globales fuera de alcance (STORY-154) |
| 19 | Decisiones no previstas documentadas | ⚠️ | Sin decisiones nuevas; las desviaciones menores se documentan en este reporte, no en `design.md` |
| 20 | CHANGELOG actualizado si aplica | ✓ | No aplica: CHANGELOG fuera de alcance (STORY-154) |
| 21 | Build de CI pasa | ✓ | `npm run verify:repository` (mismo gate que `quality.yml`) verde localmente |
| 22 | Sin secrets expuestos | ✓ | Sin credenciales en el diff |
| 23 | Variables de entorno documentadas | ✓ | Se retira `SDDF_ROOT` de los seis skills; no hay variables nuevas |
| 24 | Despliegue reversible | ✓ | Cambios solo textuales, revertibles con git |

**Resumen:** 21/24 criterios ✓ (3 ⚠️, 0 ❌)

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.
Esta historia no generó tests nuevos de código: la prueba roja/verde es el gate `npm run verify:layout`, y la cobertura de comportamiento son los evals (TC-002 de `story-plan`, TC-007 de `story-analyze`), cuya ejecución real queda a criterio humano.

Pasos recomendados:
1. Ejecutar `npm run test:eval -- story-plan` y `npm run test:eval -- story-analyze`
2. Si algún eval falla, revisar el `SKILL.md` correspondiente
3. Consultar `design.md` para verificar que la implementación respeta las interfaces definidas
