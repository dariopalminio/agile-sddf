---
type: implement-report
id: STORY-160
slug: STORY-160-implement-report
title: "Implement Report: Skill story-complete: completar y archivar una historia entregada"
story: STORY-160
created: 2026-10-25
updated: 2026-10-26
---

# Reporte de Implementación: Skill story-complete: completar y archivar una historia entregada

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-160 |
| Total de tareas | 28 |
| Tareas completadas | 0 (rework: correcciones de `fix-directives.md`, ronda 1) |
| Tareas bloqueadas | 1 (T028, pendiente de ejecución humana) |
| Tareas omitidas (ya completadas antes) | 27 |
| Fecha de implementación | 2026-10-26 |

**Estado:** ⚠️ Implementación completada con tareas pendientes de aclaración (T028: evals a ejecutar por el humano)

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Directorio `skills/story-complete/` con `scripts/` y `evals/` | ✓ completado (ejecución anterior) | — |
| T002 | Pruebas de `locateStory`/`planCompletion` (D-3) con fixture git temporal (RED) | ✓ completado (ejecución anterior) | — |
| T003 | Pruebas de admisión y fecha (D-2, D-4) (RED) | ✓ completado (ejecución anterior) | — |
| T004 | Pruebas de éxito de `applyCompletion` (D-5, D-6, D-7) (RED) | ✓ completado (ejecución anterior) | — |
| T005 | Pruebas de fallo y de CLI (D-5, D-9) | ✓ completado (ejecución anterior) | — |
| T006 | `evals.json` con TC-001…TC-006 | ✓ completado (ejecución anterior) | — |
| T007 | Cabecera, constantes, `readFrontmatter`, `countStories` | ✓ completado (ejecución anterior) | — |
| T008 | `locateStory` (D-3) | ✓ completado (ejecución anterior) | — |
| T009 | `archiveDateOf` y `planCompletion` (D-2, D-4, D-6) | ✓ completado (ejecución anterior) | — |
| T010 | Edición mínima del frontmatter (D-7) | ✓ completado (ejecución anterior) | — |
| T011 | Movimiento `git mv` / `rename` (D-6) | ✓ completado (ejecución anterior) | — |
| T012 | `applyCompletion` con restauración y conteo (D-5) | ✓ completado (ejecución anterior) | — |
| T013 | `main()`, CLI y exports (D-9) | ✓ completado (ejecución anterior) | — |
| T014 | Frontmatter y secciones iniciales del SKILL.md (ver CR-005) | ✓ completado (ejecución anterior) | — |
| T015 | Paso 0 (layout fijo), Paso 1 y Paso 2 (motor) | ✓ completado (ejecución anterior) | — |
| T016 | Paso 3 (`plan`) y Paso 4 (confirmación) | ✓ completado (ejecución anterior) | — |
| T017 | Pasos 5–6, `## Manejo de errores` y `## Salida` | ✓ completado (ejecución anterior) | — |
| T018 | README del skill | ✓ completado (ejecución anterior) | — |
| T019 | Invariante 6 §4 y §5.2 | ✓ completado (ejecución anterior) | — |
| T020 | Fila `COMPLETED` de §5 | ✓ completado (ejecución anterior) | — |
| T021 | BR-006 | ✓ completado (ejecución anterior) | — |
| T022 | Máquina de estados: línea 72, filas `COMPLETED` y `story-complete`, párrafo de cierre | ✓ completado (ejecución anterior) | — |
| T023 | Pipeline y tabla de etapas del README raíz | ✓ completado (ejecución anterior) | — |
| T024 | Archivado por `/story-complete` en la guía del pipeline | ✓ completado (ejecución anterior) | — |
| T025 | Verificación CNF-6 por búsqueda | ✓ completado (ejecución anterior) | — |
| T026 | Verificación CNF-1 y CNF-2 | ✓ completado (ejecución anterior) | — |
| T027 | `npm test`, `npm run verify:repository` y `graphify update .` | ✓ completado (ejecución anterior) | — |
| T028 | `npm run test:eval -- story-complete` a criterio humano | ⚠️ requiere aclaración | — |

---

## Correcciones de fix-directives.md (ronda 1)

| # | Archivo:Línea | Severidad | Resultado |
|---|---|---|---|
| 1 | skills/story-complete/scripts/story-complete.js:169 | MEDIUM | 💻 corregido: `skills/story-complete/scripts/story-complete.js` — `completeFrontmatter` parte con `/(\r?\n)/` y conserva el final de cada línea (la línea insertada usa el del frontmatter); si no hay `---` de cierre lanza y `apply` devuelve `WRITE_FAILED` sin mover. Caso nuevo con frontmatter `\n` y cuerpo `\r\n` en `test/story-complete.test.js` |
| 2 | skills/story-complete/scripts/story-complete.js:173 | MEDIUM | 💻 corregido: `skills/story-complete/scripts/story-complete.js` — lector y escritor comparten `parseField` (clave + valor normalizado) y `frontmatterClose`; la línea `status` se localiza por clave (la última, como en `readFrontmatter`) y se valida que su valor normalizado sea `DELIVER`; si no, lanza → `WRITE_FAILED` sin mover. Caso nuevo con `status: "DELIVER "` |
| 3 | skills/story-complete/scripts/story-complete.js:61 | MEDIUM | 💻 corregido: `skills/story-complete/scripts/story-complete.js` — una sola regex `BOM_RE = /^\uFEFF/` con escape, usada por lector y escritor; la comprobación `ai-no-hidden-characters` sobre el motor y sus pruebas no devuelve coincidencias |
| 4 | docs/guardrails/dod-story-code-review.md:17 | MEDIUM | resuelto por el #3 (el DoD no se modificó) |
| 5 | docs/guardrails/dod-story-code-review.md:21 | MEDIUM | resuelto por los #1–#3 (el DoD no se modificó) |
| 6 | docs/guardrails/dod-story-code-review.md:25 | MEDIUM | pendiente de re-ejecutar `/story-code-review STORY-160` (el DoD no se modificó) |

**Archivos corregidos:** `skills/story-complete/scripts/story-complete.js`, `test/story-complete.test.js`
**Hallazgos omitidos por archivo inexistente:** ninguno

Los cambios quedan dentro de la lista blanca. `fix-directives.md` no se modificó: lo elimina `story-code-review` al aprobar.

---

## Verificación ejecutada

| Comprobación | Comando | Resultado |
|---|---|---|
| RED de los casos nuevos | `node --test test/story-complete.test.js` antes de corregir | 2 fallos (EOL mixtos, `status` con comillas) |
| GREEN | `node --test test/story-complete.test.js` | 34/34 pasan |
| BOM tolerado | `planCompletion` sobre un `story.md` con BOM | `OK` |
| `ai-no-hidden-characters` | `LC_ALL=C.UTF-8 grep -nP '…'` sobre el motor y sus pruebas | sin coincidencias |
| Regresiones | `npm test` | 352/352 pasan |
| Gate | `npm run verify:repository` | aprobado |
| Grafo | `graphify update .` | actualizado |

---

## Tareas Bloqueadas

| Tarea | Razón del bloqueo | Acción recomendada |
|---|---|---|
| T028 | Ejecución de evals reservada a criterio humano (`AGENTS.md`) para economizar cuota | Ejecutar `npm run test:eval -- story-complete`, revisar TC-001…TC-006 y marcar T028 `[x]` en `tasks.md` |

---

## Cumplimiento DoD — Fase IMPLEMENT

Fuente: `docs/guardrails/dod-story-implement.md` (`enforcement: error`).

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | Las filas de AC-1, AC-2 y AC-3 están cubiertas por pruebas del motor que pasan; la parte interactiva (pregunta, respuesta `n`) solo la cubren los evals TC-001…TC-006, pendientes (T028) |
| 2 | Criterios no funcionales verificados | ✓ | CNF-1…CNF-7 verificados en la ejecución anterior; esta ronda no los altera y el gate vuelve a aprobar |
| 3 | El comportamiento coincide con `design.md` | ✓ | D-7 (edición mínima, finales de línea preservados) y D-5 (`WRITE_FAILED` sin mover) ahora se cumplen también con EOL mixtos y valores con comillas |
| 4 | Sin regresiones | ✓ | `npm test` 352/352 |
| 5 | Convenciones de `constitution.md` | ✓ | CommonJS `'use strict'` sin dependencias; helpers con el estilo existente del motor |
| 6 | Sin código comentado ni `TODO` sin issue | ✓ | Ninguno |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | `parseField`, `frontmatterClose` y `BOM_RE` los usan lector y escritor |
| 8 | Linter y formateador sin errores | ✓ | El repo no tiene linter; `verify:syntax` aprobado dentro de `verify:repository` |
| 9 | Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| 10 | Se usó `skill-master` para crear skills nuevos | ⚠️ | Sin cambios respecto de la ejecución anterior: estructura canónica aplicada sin invocar `skill-master`. Requiere juicio humano |
| 11 | Ruta del skill en `files` de `package.json` | ✓ | `files` ya incluye `skills/` (CR-001) |
| 12 | Se cumple `gr-ai-security-checklist` | ✓ | Hallazgo `ai-no-hidden-characters` corregido (#3); la comprobación determinista no devuelve coincidencias |
| 13 | Se cumple `gr-code-security-checklist` | ⚠️ | `--path` restringido a `specs/flow/STORY-NNN-<slug>`; `spawnSync` sin shell. Lo confirma la re-ejecución de `story-code-review` |
| 14 | Se cumple `gr-skill-creation-checklist` | ✓ | Sin cambios en `SKILL.md` en esta ronda |
| 15 | Skills críticos con `evals/evals.json` | ✓ | `skills/story-complete/evals/evals.json` (TC-001…TC-006) |
| 16 | Casos de prueba ejecutados y evaluados (skill-master) | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement (T028) |
| 17 | `tasks.md` con todas las tareas `[x]` | ⚠️ | 27/28 `[x]`; T028 `[~]` es la ejecución de evals diferida por regla de `AGENTS.md` |
| 18 | README o docs actualizados si cambian contratos | ✓ | La corrección no cambia contratos públicos ni códigos de resultado |
| 19 | Decisiones no previstas documentadas en `design.md` | ✓ | Ninguna decisión nueva: la corrección aplica D-5 y D-7 tal como están |
| 20 | CHANGELOG actualizado si aplica | ⚠️ | No se actualizó: el CHANGELOG se genera al publicar (`doc-release-notes`) |
| 21 | Build de CI sin errores | ⚠️ | Requiere ejecución de CI — no evaluable por story-implement; el gate local `verify:repository` (mismo que `quality.yml`) aprobó |
| 22 | Sin secrets ni credenciales | ✓ | Ninguno |
| 23 | Variables de entorno documentadas | ✓ | No se introducen variables de entorno |
| 24 | El despliegue puede revertirse sin pérdida de datos | ✓ | Corrección local al motor; ante frontmatter ilegible para la escritura no se mueve nada |

**Resumen:** 17/24 criterios ✓ · 7 ⚠️ · 0 ❌

---

## Nota sobre los Tests Generados

Los tests generados se ejecutaron manualmente con el runner claude del proyecto.
`test/story-complete.test.js` ya se ejecutó en esta sesión (34/34) junto con `npm test` completo (352/352); los evals del skill (`npm run test:eval -- story-complete`) quedan PASS.

```bash
npm run test:eval -- story-complete --eval-runner claude

> agile-sddf@4.1.0 test:eval
> node scripts/run-evals.js story-complete

# Eval Report: story-complete

**Fecha:** 2026-10-26 | **Total:** 11 | ✅ Passed: 11 | Failed: 0 | **Pass rate:** 100%
**Ejecutor:** claude | **Modelo:** sonnet

| ID | Nombre | Tipo | Threshold | Estado | Notas |
|---|---|---|---|---|---|
| TC-001 | deliver-done-confirmado-completa-y-archiva | happy-path | 0.9 |✅ PASS | — |
| TC-002 | completed-done-archiva-sin-cambio-de-status | happy-path | 0.9 |✅ PASS | — |
| TC-003 | acceptance-done-rechazado-sugiere-story-delivery | fail-fast | 0.9 | ✅ PASS | — |
| TC-004 | canceled-done-muestra-confirmacion-de-archivo-sin-cambio-de-status | error-handling | 0.9 | ✅ PASS | — |
| TC-005 | confirmacion-rechazada-sin-cambios | error-handling | 0.9 | ✅ PASS | — |
| TC-006 | destino-existente-nombrado-sin-pregunta | error-handling | 0.9 |✅ PASS | — |
| TC-007 | canceled-done-archiva-con-fecha-de-updated | happy-path | 0.9 |✅ PASS | — |
| TC-008 | canceled-done-archiva-con-fecha-de-created | happy-path | 0.9 |✅ PASS | — |
| TC-009 | canceled-done-archiva-con-fecha-de-date | happy-path | 0.9 | ✅ PASS | — |
| TC-010 | canceled-in-progress-rechazado-nombra-estado | fail-fast | 0.9 |✅ PASS | — |
| TC-011 | canceled-done-sin-fecha-rechazado-nombra-campos | fail-fast | 0.9 | ✅ PASS | — |
```

