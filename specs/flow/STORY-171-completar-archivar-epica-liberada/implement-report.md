---
type: implement-report
id: STORY-171
slug: STORY-171-implement-report
title: "Implement Report: Skill epic-complete (Core) — completar y archivar una épica liberada"
story: STORY-171
created: 2026-10-30
updated: 2026-10-30
---

# Reporte de Implementación: Skill epic-complete (Core) — completar y archivar una épica liberada

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-171 |
| Total de tareas | 29 |
| Tareas completadas | 29 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-10-30 |

**Estado:** ✅ Implementación completa

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Scaffolding del skill con `skill-master` | ✓ completado | `skills/epic-complete/` (`SKILL.md`, `README.md`, `scripts/`, `references/`, `evals/`) |
| T002 | Cabecera, constantes, regex y utilidades portadas de `story-complete.js` | ✓ completado | `skills/epic-complete/scripts/epic-complete.js` |
| T003 | `countEpics` y `locateEpic` | ✓ completado | `skills/epic-complete/scripts/epic-complete.js` |
| T004 | `releasedVersionOf` | ✓ completado | `skills/epic-complete/scripts/epic-complete.js` |
| T005 | `planCompletion`: tabla de admisión y `NOT_SHIPPED` | ✓ completado | `skills/epic-complete/scripts/epic-complete.js` |
| T006 | `planCompletion`: versión, fecha y destino | ✓ completado | `skills/epic-complete/scripts/epic-complete.js` |
| T007 | `completeEpicFrontmatter` | ✓ completado | `skills/epic-complete/scripts/epic-complete.js` |
| T008 | `moveEpic` y `applyCompletion` (orden D-8) | ✓ completado | `skills/epic-complete/scripts/epic-complete.js` |
| T009 | `parseArgs`, `main` y `module.exports` | ✓ completado | `skills/epic-complete/scripts/epic-complete.js` |
| T010 | Frontmatter de `SKILL.md` (description de 342 caracteres) | ✓ completado | `skills/epic-complete/SKILL.md` |
| T011 | Objetivo, Posicionamiento, Entrada, Parámetros, Precondiciones, Restricciones | ✓ completado | `skills/epic-complete/SKILL.md` |
| T012 | Paso 0 con `<!-- SDDF-FIXED-LAYOUT: v1 -->` | ✓ completado | `skills/epic-complete/SKILL.md` |
| T013 | Pasos 1–3 (argumento, motor, `plan` sin preguntar ante `ok: false`) | ✓ completado | `skills/epic-complete/SKILL.md` |
| T014 | Paso 4 (confirmación `s`/`si`/`sí`) | ✓ completado | `skills/epic-complete/SKILL.md` |
| T015 | Pasos 5–6 y Salida; `SKILL.md` de 185 líneas | ✓ completado | `skills/epic-complete/SKILL.md` |
| T016 | Catálogo de errores | ✓ completado | `skills/epic-complete/references/error-codes.md` |
| T017 | Ficha del skill | ✓ completado | `skills/epic-complete/README.md` |
| T018 | Pruebas de los contratos 1–2 | ✓ completado | `test/epic-complete.test.js` |
| T019 | Pruebas del contrato 3 (versión) | ✓ completado | `test/epic-complete.test.js` |
| T020 | Pruebas de los contratos 4–5 | ✓ completado | `test/epic-complete.test.js` |
| T021 | Pruebas de los contratos 6–8 | ✓ completado | `test/epic-complete.test.js` |
| T022 | Evals TC-001 (= SMOKE-8) a TC-004 | ✓ completado | `skills/epic-complete/evals/evals.json` |
| T023 | Fila en el mapa de skills | ✓ completado | `docs/domains/domain-skills-map.md` |
| T024 | Fila en la guía del pipeline y en `README.md` | ✓ completado | `docs/guides/sddf-commands-pipeline.md`, `README.md` |
| T025 | Entrada en `CHANGELOG.md › [Unreleased] › Added` | ✓ completado | `CHANGELOG.md` |
| T026 | `npm test` | ✓ completado | — (425/425 pasan, incluidos los 31 de `test/epic-complete.test.js` y los de `test/story-complete.test.js`) |
| T027 | `npm run verify:repository` | ✓ completado | — (aprobado; `verify-fixed-layout`: 43 skills, `verify-eval-inventory`: 43 skills) |
| T028 | `graphify update .` | ✓ completado | `graphify-out/` |
| T029 | Registrar que `npm run test:eval -- epic-complete` se ejecuta a mano | ✓ completado | — (ver «Nota sobre los Tests Generados») |

---

## Desviaciones respecto del diseño

Registradas en `design.md` como CR-004:

- El JSON de `NO_VERSION` incluye además el campo `reason` (`unreleased`, `no-block`, `no-changelog`).
- STORY-175 ya estaba en `IMPLEMENT/DONE` y ADR-0019 existe, así que el skill cita ADR-0019 en lugar de ADR-0017.

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | AC-1 y AC-2 los cubren las pruebas del motor (contratos 1, 2 y 4, en verde). AC-3 (respuesta `n`) es comportamiento del skill: lo cubre TC-003, que requiere `npm run test:eval -- epic-complete` (manual) |
| 2 | Los criterios no funcionales están verificados | ✓ | CNF-1: rename `R` sin commit nuevo (test). CNF-2: fecha de `updated:`/`created:`/`date:` (test). CNF-3: sin `--yes` (exit 2 en test) y Paso 4. CNF-4: `verify-fixed-layout` OK. CNF-5: `references/error-codes.md` se carga solo ante `ok: false`. CNF-6: `SKILL.md` de 185 líneas |
| 3 | El comportamiento coincide con `design.md` | ✓ | Tabla de admisión, resolución de la versión, escritura de 4 claves y orden D-8 implementados tal cual; desviaciones menores registradas en CR-004 |
| 4 | No hay regresiones | ✓ | `npm test`: 425/425 pasan, `test/story-complete.test.js` incluido |
| 5 | El código sigue las convenciones de `constitution.md` | ✓ | CommonJS, `'use strict'`, sin dependencias, mismo estilo que `story-complete.js` |
| 6 | Sin código comentado ni `TODO` | ✓ | Ningún `TODO` ni código comentado en los archivos nuevos |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | Todas las funciones y constantes del motor y de la prueba se usan |
| 8 | El código pasa el linter y el formateador | ⚠️ | `package.json` no declara script de lint ni de formato; no evaluable |
| 9 | Sin dependencias nuevas | ✓ | Solo `fs`, `path` y `child_process` |
| 10 | Se usó `skill-master` para crear el skill | ✓ | Invocado en T001 (modo build, sin ejecutar evals por AGENTS.md) |
| 11 | La ruta del skill está en `files` de `package.json` | ✓ | `files` incluye `skills/`; `npm pack --dry-run` lista los cinco archivos de `skills/epic-complete/` |
| 12 | Se cumple `gr-ai-security-checklist` | ✓ | El skill no ejecuta contenido de los artefactos; el motor no usa shell (`spawnSync` con arreglo de argumentos) y valida `--id`, `--path` y `--version` antes de usarlos |
| 13 | Se cumple `gr-code-security-checklist` | ✓ | Sin credenciales, sin interpolación en shell, rutas restringidas a `specs/flow/EPIC-NN-<slug>/` |
| 14 | Se cumple `gr-skill-creation-checklist` | ✓ | `name` = directorio, `description: >-` de 342 caracteres, solo claves `name`/`description`, < 500 líneas, `references/` enlazado, `evals/evals.json` con `TC-NNN`, sin rutas absolutas ni URLs |
| 15 | Los skills críticos tienen `evals/evals.json` | ✓ | `skills/epic-complete/evals/evals.json` con TC-001 a TC-004 |
| 16 | Se ejecutaron y evaluaron los casos de prueba de `skill-master` | ⚠️ | Por AGENTS.md, `npm run test:eval -- epic-complete` se ejecuta a mano a criterio humano; no se ejecutó |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 29/29 |
| 18 | README o docs actualizados si cambian contratos públicos | ✓ | `README.md`, `docs/domains/domain-skills-map.md`, `docs/guides/sddf-commands-pipeline.md` |
| 19 | Decisiones no previstas documentadas en `design.md` | ✓ | CR-004 |
| 20 | CHANGELOG actualizado | ✓ | Entrada en `## [Unreleased] › ### Added` |
| 21 | El build de CI pasa | ⚠️ | Requiere ejecución de CI; localmente `npm run verify:repository` (el mismo gate de `quality.yml`) aprobó |
| 22 | Sin secrets ni credenciales | ✓ | Ninguno en los archivos nuevos |
| 23 | Variables de entorno documentadas | ✓ | El skill no usa variables de entorno |
| 24 | El despliegue puede revertirse sin pérdida de datos | ✓ | Skill y prueba nuevos; revertir es quitar `skills/epic-complete/` y `test/epic-complete.test.js` |

**Resumen:** 20/24 criterios ✓ · 4 ⚠️ · 0 ❌

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.

- `node --test test/epic-complete.test.js` cubre los contratos de verificación 1–8 sobre repos temporales; ya se ejecutó en esta implementación (31/31).
- Los contratos 10–12 (TC-001 = SMOKE-8, TC-002, TC-003) y TC-004 son evals del skill: **quedan pendientes de revisión humana** con `npm run test:eval -- epic-complete`, que según AGENTS.md se ejecuta a mano para economizar cuota.
- Ninguna épica real del repositorio se movió: todas las pruebas usan fixtures temporales.
