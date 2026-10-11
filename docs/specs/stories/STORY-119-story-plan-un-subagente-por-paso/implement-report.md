---
type: implement-report
id: STORY-119
slug: STORY-119-story-plan-un-subagente-por-paso-implement-report
title: "Implement Report: Ejecutar cada paso de /story-plan en un subagente aislado para consumir menos tokens"
story: STORY-119
created: 2026-10-07
updated: 2026-10-07
related:
  - STORY-119-story-plan-un-subagente-por-paso
  - STORY-119-story-plan-un-subagente-por-paso-design
  - STORY-119-story-plan-un-subagente-por-paso-tasks
---

[[STORY-119-story-plan-un-subagente-por-paso]] · [[STORY-119-story-plan-un-subagente-por-paso-design]] · [[STORY-119-story-plan-un-subagente-por-paso-tasks]]

# Reporte de Implementación: Un subagente aislado por paso en `/story-plan`

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-119 |
| Total de tareas | 34 |
| Tareas completadas | 29 |
| Tareas bloqueadas | 5 (T030-T034, medición CNF-1/CNF-2) |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-10-07 |

**Estado:** ⚠️ Implementación completada con tareas pendientes de aclaración

La parte verificable por evals está completa: `story-plan` 11/11 y los tres casos nuevos de los workers en verde. Falta la medición de tokens (CNF-1) y de calidad comparada (CNF-2), que requiere sesiones nuevas de Claude Code con `/cost` y `/context`.

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Línea base: `npm test`, inventario, dry-run | ✓ completado | `.tmp/story-119/baseline.txt` (no versionado) |
| T002 | Último `TC-NNN` de cada `evals.json` | ✓ completado | `.tmp/story-119/baseline.txt` |
| T003 | TC-006 pipeline con subagentes | ✓ completado | `skills/story-plan/evals/evals.json` |
| T004 | TC-007 "solo los que faltan" (+ TC-011 "regenerar todos", ver decisiones) | ✓ completado | `skills/story-plan/evals/evals.json` |
| T005 | TC-008 cancelar | ✓ completado | `skills/story-plan/evals/evals.json` |
| T006 | TC-009 FAIL en design | ✓ completado | `skills/story-plan/evals/evals.json` |
| T007 | TC-010 runtime sin subagentes | ✓ completado | `skills/story-plan/evals/evals.json` |
| T008 | Compatibilidad de TC-001…TC-005 | ✓ completado | sin cambios en los casos; restricciones anotadas en `baseline.txt` |
| T009 | Eval `story-design --force` | ✓ completado | `skills/story-design/evals/evals.json` (TC-006) |
| T010 | Eval `story-tasking --skip-existing` | ✓ completado | `skills/story-tasking/evals/evals.json` (TC-006) |
| T011 | Eval `story-analyze --force` | ✓ completado | `skills/story-analyze/evals/evals.json` (TC-006) |
| T012 | Inventario + dry-run con casos nuevos | ✓ completado | — (29 casos planificados en 4 skills) |
| T013 | Flags en `story-design` | ✓ completado | `skills/story-design/SKILL.md` |
| T014 | Flags en `story-tasking` | ✓ completado | `skills/story-tasking/SKILL.md` |
| T015 | Flags en `story-analyze` | ✓ completado | `skills/story-analyze/SKILL.md` |
| T016 | `--skip-existing` en `story-testcases` | ✓ completado | `skills/story-testcases/SKILL.md` |
| T017 | `--inline`, objetivo y reglas de `story-plan` | ✓ completado | `skills/story-plan/SKILL.md` |
| T018 | Paso 1e: workers presentes + pregunta única | ✓ completado | `skills/story-plan/SKILL.md` |
| T019 | Paso 1f: modo de ejecución | ✓ completado | `skills/story-plan/SKILL.md` |
| T020 | Paso 1g: estado, limpieza de `.tmp`, banners | ✓ completado | `skills/story-plan/SKILL.md` |
| T021 | Sección "Contrato de delegación por paso" | ✓ completado | `skills/story-plan/SKILL.md` |
| T022 | Pasos 2-5 leyendo `<paso>.result.md` | ✓ completado | `skills/story-plan/SKILL.md` |
| T023 | Paso 6 desde archivos de resultado | ✓ completado | `skills/story-plan/SKILL.md` |
| T024 | Manejo de errores y Salida | ✓ completado | `skills/story-plan/SKILL.md` |
| T025 | README de `story-plan` | ✓ completado | `skills/story-plan/README.md` |
| T026 | `npm run test:eval -- story-plan` | ✓ completado | — (11/11 PASS) |
| T027 | Evals de los workers | ✓ completado | — (casos nuevos 3/3 PASS; sin regresiones, ver abajo) |
| T028 | Revisión CNF-3 / CNF-5 | ✓ completado | — |
| T029 | Suite determinista | ✓ completado | — |
| T030 | Reinstalar skills y copiar STORY-107 al banco | ⚠️ requiere aclaración | — |
| T031 | Corrida `--inline` con `/cost` y `/context` | ⚠️ requiere aclaración | — |
| T032 | Corrida con subagentes | ⚠️ requiere aclaración | — |
| T033 | Comparación CNF-1 / CNF-2 | ⚠️ requiere aclaración | — |
| T034 | Registrar cifras en este reporte | ⚠️ requiere aclaración | — |

---

## Tareas Bloqueadas

| Tarea | Razón del bloqueo | Acción recomendada |
|---|---|---|
| T030 | Prepara un banco que solo sirve a T031-T032 | Ejecutarla junto con T031 |
| T031 | Necesita una sesión nueva de Claude Code y los comandos `/cost` y `/context`, que no se pueden ejecutar desde la sesión de implementación (acordado con el usuario) | En una sesión nueva: `node scripts/cli.js install --target claude-code --force`, copiar `story.md` de STORY-107 a `.tmp/story-119/bench/…/` y correr `/story-plan STORY-107 <ruta> --inline` |
| T032 | Igual que T031 | Repetir sin `--inline` en otra sesión nueva |
| T033 | Depende de T031-T032 | Comparar entrada acumulada, contexto final (≤ ~15k) y ERRORs de `analyze.md` |
| T034 | Depende de T033 | Agregar las cifras en una sección "Medición CNF-1 / CNF-2" de este reporte y borrar `.tmp/story-119/bench/` |

---

## Verificación ejecutada

| Comando | Resultado |
|---|---|
| `npm test` | 219/219 PASS (igual que la línea base) |
| `node scripts/verify-eval-inventory.js` | OK — 33 skills, 8 excepciones |
| `npm run test:eval -- story-plan --dry-run` | 11 casos planificados |
| `node scripts/check-doc-links.js` | OK |
| `node scripts/verify-syntax.js` | OK — 37 archivos |
| `npm run test:eval -- story-plan` | **11/11 PASS** (TC-001…TC-011) |
| `npm run test:eval -- story-design story-tasking story-analyze` | Casos nuevos TC-006: **3/3 PASS** |

**Casos previos de los workers que fallan.** Fallan igual con la versión de HEAD (corrida con `--skills-dir` sobre una copia de `git archive HEAD`), así que no son regresiones de esta historia:

| Skill | Caso | Motivo (también en HEAD) |
|---|---|---|
| story-design | TC-001 | `contains` sin tildes (`Decisiones de Dise…`, `Contratos de Verificacion`) que no coinciden con el template |
| story-tasking | TC-003 | espera `No se encontro` sin tilde |
| story-analyze | TC-001, TC-003, TC-004, TC-005 | `contains` sin tildes (`Aceptacion`, `Analisis rechazado`, `Via de Implementacion`) |

`story-design` TC-004 y `story-tasking` TC-001 fallaron una vez en la corrida completa y pasaron al repetirlos sin cambios (variabilidad del simulador).

**CNF-3 / CNF-5 (T028).** El bloque de prompt del "Contrato de delegación por paso" contiene solo la ruta del worker, el contexto resuelto y las reglas. En los cuatro workers, `grep -nE "Agent|subagente"` solo devuelve menciones al "modo Agent" (modo de ejecución), ningún lanzamiento de subagentes.

---

## Decisiones tomadas durante la implementación

- **TC-011 "regenerar todos" (INC-002 de `analyze.md`).** Se agregó el caso que faltaba para la opción `(t)` de AC-2.
- **Qué se imprime de los archivos de resultado (INC-003 de `analyze.md`).** Las líneas de progreso usan la línea 2 de `<paso>.result.md` (`[1/4] ✓ story-design — design.md generado` se mantiene literal en el caso normal, y muestra `design.md sin cambios (--skip-existing)` cuando se conserva). El resumen agrega `Resultados leídos: .tmp/story-plan/<ID>/…` con los archivos de los pasos lanzados.
- **Línea `Flags por paso:`.** TC-011 falló en la primera corrida porque nada mostraba el flag asignado. Ahora, si hubo pregunta inicial, el Paso 1e muestra `Flags por paso: design --force · tasking --force · …`. Sin pregunta no se muestra.
- **Mensaje final con `--skip-analyze`.** Usa `PLAN/IN-PROGRESS (sin auditoría de coherencia)` en lugar de mencionar `story-analyze`, para no romper el `not_contains` de TC-005.

---

## Cumplimiento DoD — Fase IMPLEMENT

Fuente: `docs/guardrails/dod-story-implement.md` (`enforcement: error`).

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | AC-1…AC-5 pasan en evals simuladas (TC-006…TC-011, TC-006 de los workers). Falta una corrida real de `/story-plan` con subagentes |
| 2 | Criterios no funcionales verificados | ❌ | CNF-3…CNF-6 verificados; **CNF-1 y CNF-2 sin medir** (T030-T034 bloqueadas) |
| 3 | El comportamiento coincide con `design.md` | ✓ | D-1…D-7 implementados en los `SKILL.md`; D-8 implementado salvo la medición |
| 4 | Sin regresiones | ✓ | `npm test` 219/219; TC-001…TC-005 de `story-plan` pasan; los fallos previos de los workers también fallan en HEAD |
| 5 | Convenciones de `constitution.md` | ✓ | Evals antes que el skill (principio 11); español; CRLF conservado |
| 6 | Sin código comentado ni `TODO` sin issue | ✓ | Solo Markdown y JSON; sin `TODO` |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | No aplica: no hay código ejecutable nuevo |
| 8 | Linter y formateador sin errores | ⚠️ | No hay linter genérico; `verify-syntax` y `check-doc-links` en OK |
| 9 | Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| 10 | `skill-master` para skills nuevos | ✓ | No aplica: no se crearon skills |
| 11 | Skill nuevo incluido en `files` de `package.json` | ✓ | No aplica: no se crearon skills |
| 12 | Cumple `gr-ai-security-checklist` | ⚠️ | El prompt del subagente no incluye contexto conversacional y prohíbe la delegación anidada; no se ejecutó la checklist completa |
| 13 | Cumple `gr-code-security-checklist` | ⚠️ | Sin código ejecutable nuevo; checklist no ejecutada |
| 14 | Cumple `gr-skill-creation-checklist` | ⚠️ | Skills modificados, no creados; checklist no ejecutada |
| 15 | Skills críticos con `evals/evals.json` | ✓ | `story-plan` +6 casos; `story-design`, `story-tasking`, `story-analyze` +1 caso cada uno |
| 16 | Casos ejecutados y evaluados automáticamente | ✓ | `npm run test:eval` real: story-plan 11/11; casos nuevos de workers 3/3 |
| 17 | `tasks.md` con todas las tareas `[x]` | ❌ | T030-T034 en `[~]` |
| 18 | README/docs actualizados si cambian contratos | ✓ | `skills/story-plan/README.md` documenta el modo de ejecución, `--inline`, la pregunta única y los archivos `.tmp` |
| 19 | Decisiones no previstas documentadas en `design.md` | ⚠️ | Registradas en este reporte (sección "Decisiones tomadas"); no se editó `design.md` |
| 20 | CHANGELOG actualizado si aplica | ⚠️ | Cambia el contrato público de cinco skills; falta la entrada en `CHANGELOG.md` `[Unreleased]` |
| 21 | CI pasa (build + tests + lint) | ⚠️ | Requiere ejecución de CI — no evaluable por story-implement. Localmente, la suite determinista está en verde |
| 22 | Sin secrets ni credenciales | ✓ | Solo Markdown y JSON de skills |
| 23 | Variables de entorno documentadas | ✓ | No se agregan variables de entorno |
| 24 | Despliegue reversible | ✓ | Cambios de Markdown/JSON; `--inline` reproduce el flujo inline |

**Resumen:** 14/24 criterios ✓ · 8 ⚠️ · 2 ❌

**Override del usuario (2026-10-07):** los criterios 2 y 17 bloqueaban la transición. El usuario decidió marcar la implementación como `IMPLEMENT/DONE` y pasar la medición CNF-1/CNF-2 (T030-T034) a la fase VERIFY (`/story-verify STORY-119`). `story.md` queda en `IMPLEMENT/DONE`; T030-T034 siguen en `[~]` hasta esa verificación.

⚠️ Checklist de épica no actualizado: STORY-119 no figura en el checklist de `docs/specs/02-epics/EPIC-21-colapsar-specs-dos-niveles/epic.md`.

---

## Nota sobre los Tests Generados

Los evals agregados se ejecutaron con el runner del proyecto (`npm run test:eval`), que simula el skill a partir de su `SKILL.md`. No reemplazan una corrida real de `/story-plan` con subagentes, que es parte de T031-T032.

Pasos recomendados:
1. En VERIFY: completar T030-T034 en sesiones nuevas y registrar las cifras de CNF-1/CNF-2.
2. Agregar la entrada de `CHANGELOG.md` (`--force` / `--skip-existing` en los workers; `--inline` y modo subagentes en `story-plan`).
