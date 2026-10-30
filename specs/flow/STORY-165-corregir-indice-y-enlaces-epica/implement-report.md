---
type: implement-report
id: STORY-165
slug: STORY-165-implement-report
title: "Implement Report: Skill epic-refine (Core): corregir índice y enlaces de una épica"
story: STORY-165
created: 2026-10-29
updated: 2026-10-29
---

# Reporte de Implementación: Skill epic-refine (Core): corregir índice y enlaces de una épica

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-165 |
| Total de tareas | 35 |
| Tareas completadas | 35 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-10-29 |

**Estado:** ✅ Implementación completa

El usuario confirmó continuar pese a superar el umbral de 20 tareas pendientes (Paso 2d).

---

## Tabla de Estado por Tarea

Skill de instrucciones (solo Markdown + JSON): la verificación de comportamiento son los evals de `skills/epic-refine/evals/evals.json` (D-11), no tests unitarios; la verificación estructural la hacen `npm test` y `npm run verify:repository`.

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Crear el skill con `skill-master` | ✓ completado | `skills/epic-refine/` |
| T002 | Frontmatter, Objetivo, Qué hace / Qué NO hace | ✓ completado | `skills/epic-refine/SKILL.md` |
| T003 | Entrada, Parámetros, Modos, Restricciones | ✓ completado | `skills/epic-refine/SKILL.md` |
| T004 | Cláusula de contenido no confiable | ✓ completado | `skills/epic-refine/SKILL.md` |
| T005 | Paso 0 (layout fijo) y Paso 1 (épica + template del reporte) | ✓ completado | `skills/epic-refine/SKILL.md` |
| T006 | Paso 2 (gate por `verdict`) | ✓ completado | `skills/epic-refine/SKILL.md` |
| T007 | Paso 3 (extracción, identidad por glob) | ✓ completado | `skills/epic-refine/SKILL.md` |
| T008 | Tabla de enrutamiento D-4 | ✓ completado | `skills/epic-refine/SKILL.md` |
| T009 | Paso 4 (revalidación, carga condicional de catálogos) | ✓ completado | `skills/epic-refine/SKILL.md` |
| T010 | Paso 5 (plan consolidado y confirmación) | ✓ completado | `skills/epic-refine/SKILL.md` |
| T011 | Paso 6 (backup y escritura) | ✓ completado | `skills/epic-refine/SKILL.md` |
| T012 | Paso 7 (relectura y restauración global) | ✓ completado | `skills/epic-refine/SKILL.md` |
| T013 | Paso 8 (reporte por clave, sin `verdict`) | ✓ completado | `skills/epic-refine/SKILL.md` |
| T014 | Paso 9 (salida por modo), errores y Salida | ✓ completado | `skills/epic-refine/SKILL.md` |
| T015 | Catálogo INT-02 / INT-03 | ✓ completado | `skills/epic-refine/references/int-corrections.md` |
| T016 | Catálogo MAD-02 | ✓ completado | `skills/epic-refine/references/mad-corrections.md` |
| T017 | Template del reporte | ✓ completado | `skills/epic-refine/assets/epic-refine-report-template.md` |
| T018 | Ficha del skill | ✓ completado | `skills/epic-refine/README.md` |
| T019 | Fixture `huerfana-y-related-roto/` | ✓ completado | `skills/epic-refine/examples/huerfana-y-related-roto/` |
| T020 | Fixture `aprobada/` | ✓ completado | `skills/epic-refine/examples/aprobada/` |
| T021 | Fixture `solo-decisiones-po/` | ✓ completado | `skills/epic-refine/examples/solo-decisiones-po/` |
| T022 | Fixture `duplicada/` | ✓ completado | `skills/epic-refine/examples/duplicada/` |
| T023 | Fixture `instruccion-incrustada/` | ✓ completado | `skills/epic-refine/examples/instruccion-incrustada/` |
| T035 | Fixture `reejecucion-parcial/` | ✓ completado | `skills/epic-refine/examples/reejecucion-parcial/` |
| T024 | Evals TC-001…TC-008 | ✓ completado | `skills/epic-refine/evals/evals.json` |
| T025 | `epic-refine` en `escritor:` de `historias` (central + seed) | ✓ completado | `docs/templates/epic-template.md`, `skills/epic-creation/assets/epic-template.md` |
| T026 | `epic-refine` en `escritor:` de `related:` (central + seed) | ✓ completado | `docs/templates/story-template.md`, `skills/story-creation/assets/story-template.md` |
| T027 | Ciclo de vida de épica §8 y §9 | ✓ completado | `docs/domains/domain-epic-lifecycle.md` |
| T028 | Guía de pipeline §2 (TODO descomentados) | ✓ completado | `docs/guides/sddf-commands-pipeline.md` |
| T029 | Presupuesto: 248 líneas (≤ 300), `description` 407 caracteres (≤ 500), catálogos solo en el Paso 4 | ✓ completado | — |
| T030 | UTF-8 sin BOM en todos los archivos; `cmp` template de historia central = seed | ✓ completado | — |
| T031 | `verify-fixed-layout` (39 skills, 0 pendientes) e inventario de evals (39 skills) | ✓ completado | — |
| T032 | `npm test` (353/353) y `npm run verify:repository` aprobados | ✓ completado | — |
| T033 | `graphify update .` | ✓ completado | `graphify-out/` |
| T034 | Registrar evals y SMOKE-5 como pendientes de ejecución manual | ✓ completado | este reporte (ver «Pendiente de ejecución manual») |

Además: entrada `/epic-refine` en `CHANGELOG.md › [Unreleased] › Added` y CR-004 / CR-005 en `design.md`.

---

## Pendiente de ejecución manual (T034)

Por AGENTS.md los evals se ejecutan a criterio humano para economizar cuota; no se ejecutaron en esta sesión.

1. `npm run test:eval -- epic-refine` — TC-001…TC-008 (V-1…V-6).
2. SMOKE-5 de EPIC-23 sobre `skills/epic-refine/examples/huerfana-y-related-roto/`: `/epic-refine EPIC-30` respondiendo `s` → `/epic-analyze EPIC-30` debe declarar `APPROVED`.

---

## Cumplimiento DoD — Fase IMPLEMENT

DoD: `docs/guardrails/dod-story-implement.md` (`enforcement: error`).

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement (TC-001…TC-003 cubren AC-1…AC-3) |
| 2 | Criterios no funcionales verificados | ⚠️ | CNF-1 (Paso 6), CNF-3 (sin BOM, verificado), CNF-4 (catálogos en `references/` cargados solo en el Paso 4) y CNF-5 (248 líneas) verificados; CNF-2 requiere ejecutar TC-007 |
| 3 | El comportamiento coincide con `design.md` | ✓ | D-1…D-11 implementados; desviaciones documentadas en CR-004 y CR-005 |
| 4 | Sin regresiones | ✓ | `npm test` 353/353 y `npm run verify:repository` aprobados |
| 5 | Convenciones de `constitution.md` | ✓ | Documentos en español; skill fuente en `skills/epic-refine/`; marcador `SDDF-FIXED-LAYOUT: v1` validado |
| 6 | Sin código comentado ni `TODO` sin issue | ✓ | Se retiraron los `TODO` comentados de `sddf-commands-pipeline.md` §2; el skill no contiene marcadores pendientes |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | No se añadió código ejecutable al repositorio (skill de instrucciones) |
| 8 | Linter y formateador sin errores | ✓ | `verify:syntax`, enlaces y contrato de validación aprobados en `verify:repository` |
| 9 | Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| 10 | Se usó `skill-master` para el skill nuevo | ✓ | T001: skill creado con `skill-master` (plantilla de README y formato TC-NNN) |
| 11 | Ruta del skill en `files` de `package.json` | ✓ | `files` ya publica `skills/` (incluye `skills/epic-refine/`); el smoke del tarball pasa |
| 12 | Se cumple `gr-ai-security-checklist` | ✓ | Cláusula `ai-untrusted-content-clause`; las rutas de Evidencia nunca deciden la escritura (identidad por glob); escritura acotada |
| 13 | Se cumple `gr-code-security-checklist` | ✓ | Sin código ejecutable, credenciales ni URLs externas en el skill |
| 14 | Se cumple `gr-skill-creation-checklist` | ✓ | Frontmatter solo `name`/`description` con `>-`, sin `<`/`>`; enlaces de `references/` y `assets/` resuelven; entradas de evals existen; `references/` < 300 líneas |
| 15 | Skills críticos con `evals/evals.json` | ✓ | 8 casos TC-NNN; inventario de evals aprobado |
| 16 | Casos de prueba ejecutados y evaluados automáticamente | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement; pendiente a criterio humano (AGENTS.md) |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 35/35 |
| 18 | README o docs actualizados si cambian contratos | ✓ | `README.md` del skill, `domain-epic-lifecycle` §8/§9, guía de pipeline §2, templates de épica e historia |
| 19 | Decisiones de diseño no previstas documentadas en `design.md` | ✓ | CR-004 (fixtures) y CR-005 (veracidad de la guía) |
| 20 | CHANGELOG actualizado si aplica | ✓ | `CHANGELOG.md › [Unreleased] › Added › /epic-refine` |
| 21 | Build de CI pasa | ⚠️ | Requiere ejecución de CI; el mismo gate (`verify:repository`) y `npm test` pasan en local |
| 22 | Sin secrets ni credenciales | ✓ | Ningún archivo nuevo contiene credenciales |
| 23 | Variables de entorno documentadas | ⚠️ | No aplica: el skill no usa variables de entorno |
| 24 | Despliegue reversible sin pérdida de datos | ⚠️ | El skill crea `<archivo>.bak` antes de escribir y restaura ante fallo; la reversión del paquete depende del release |

**Resumen:** 18/24 criterios ✓ · 6 ⚠️ · 0 ❌

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.
Este skill genera el código pero no ejecuta ni verifica que los tests pasen.

Pasos recomendados:
1. Ejecutar `npm run test:eval -- epic-refine`
2. Si algún caso falla, revisar `skills/epic-refine/SKILL.md` o el fixture correspondiente y ajustar
3. Consultar `design.md` para verificar que la implementación respeta las interfaces definidas
