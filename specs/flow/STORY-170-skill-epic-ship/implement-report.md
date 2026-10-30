---
type: implement-report
id: STORY-170
slug: STORY-170-implement-report
title: "Implement Report: Skill epic-ship"
story: STORY-170
created: 2026-10-30
updated: 2026-10-30
---

# Reporte de Implementación: Skill epic-ship

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-170 |
| Total de tareas | 32 |
| Tareas completadas | 32 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-10-30 |

**Estado:** ✅ Implementación completa

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Scaffolding de `skills/epic-ship/` con `skill-master` (sin `scripts/` ni `README.md`) | ✓ completado | `skills/epic-ship/{references,assets,evals}/` |
| T002 | Frontmatter de `SKILL.md` (`name`, `description: >-` de 336 caracteres) | ✓ completado | `skills/epic-ship/SKILL.md` |
| T003 | Objetivo, «Qué hace / Qué NO hace», regla de repositorio | ✓ completado | `skills/epic-ship/SKILL.md` |
| T004 | Regla de contenido untrusted y escape de `<!--` | ✓ completado | `skills/epic-ship/SKILL.md` |
| T005 | Paso 0 con `<!-- SDDF-FIXED-LAYOUT: v1 -->` y solo `REPO_ROOT` | ✓ completado | `skills/epic-ship/SKILL.md` |
| T006 | Paso 1: resolver la épica | ✓ completado | `skills/epic-ship/SKILL.md` |
| T007 | Paso 2: gates de validación y de status antes de escribir | ✓ completado | `skills/epic-ship/SKILL.md` |
| T008 | Paso 3: inventario vía la referencia | ✓ completado | `skills/epic-ship/SKILL.md` |
| T009 | Paso 4: bloque de `CHANGELOG.md` y error de delimitador incompleto | ✓ completado | `skills/epic-ship/SKILL.md` |
| T010 | Paso 5: `release-notes.md` desde el template, conservando `created` | ✓ completado | `skills/epic-ship/SKILL.md` |
| T011 | Paso 6: resumen y pasos de liberación con versión sugerida | ✓ completado | `skills/epic-ship/SKILL.md` |
| T012 | Paso 7: confirmación `s`/`si`/`sí` y escritura de `SHIP/DONE` | ✓ completado | `skills/epic-ship/SKILL.md` |
| T013 | Modos de ejecución (orquestador sin cambio de status) | ✓ completado | `skills/epic-ship/SKILL.md` |
| T014 | Salida y regla de encoding | ✓ completado | `skills/epic-ship/SKILL.md` |
| T015 | Referencia de contenido (inventario, categorías, bloque, idempotencia, versión) | ✓ completado | `skills/epic-ship/references/release-content.md` |
| T016 | Template de notas de versión | ✓ completado | `skills/epic-ship/assets/release-notes-template.md` |
| T017 | Evals TC-001…TC-005 con `not_contains` de comandos de git y publicación | ✓ completado | `skills/epic-ship/evals/evals.json` |
| T018 | TC-001 con `EPIC-300-otra` y una historia `CANCELED/DONE` | ✓ completado | `skills/epic-ship/evals/evals.json` |
| T019 | Invariante 6: cláusula de `SHIP` de épica | ✓ completado | `docs/domains/domain-state-management.md` |
| T020 | `domain-epic-lifecycle` §5, §7, §8 y §9 (`epic-validate-report.md`) | ✓ completado | `docs/domains/domain-epic-lifecycle.md` |
| T021 | Nota de transiciones manuales y actor de `SHIP` | ✓ completado | `docs/architecture/state-machine.md` |
| T022 | Fila de `epic-ship` en `## Épica (L2)` | ✓ completado | `docs/domains/domain-skills-map.md` |
| T023 | Fila de `epic-ship` y nota del gateway en la guía del pipeline | ✓ completado | `docs/guides/sddf-commands-pipeline.md` |
| T024 | CR-001 y CR-002 en las Notas de la historia | ✓ completado | `specs/flow/STORY-170-skill-epic-ship/story.md` |
| T025 | `SKILL.md` 164 líneas (≤ 200), `description` 336 caracteres (≤ 350), detalle solo en la referencia | ✓ completado | — |
| T026 | `SKILL.md` sin instrucciones de ejecutar comandos de git, publicación ni despliegue (`npm publish` solo aparece en la prohibición) | ✓ completado | — |
| T027 | El gate del Paso 2 precede a toda escritura (Pasos 4, 5 y 7); `epic.md` solo tras `s`/`si`/`sí` | ✓ completado | — |
| T028 | Los cuatro archivos de `skills/epic-ship/` sin BOM | ✓ completado | — |
| T029 | `verify-fixed-layout` (42 skills), `verify:eval-inventory` (42 skills) y `verify:links` (50 archivos): OK | ✓ completado | — |
| T030 | `npm test` (394/394) y `npm run verify:repository` OK | ✓ completado | — |
| T031 | `graphify update .` | ✓ completado | `graphify-out/` |
| T032 | Ejecución manual pendiente registrada (abajo) | ✓ completado | — |

Archivos adicionales: `CHANGELOG.md` (entrada de `/epic-ship` en `[Unreleased] › Added`) y `design.md` (sección `## Notas de implementación`).

---

## Pendiente de ejecución manual (T032)

A criterio humano (AGENTS.md), sin ejecutar en esta sesión:

1. `npm run test:eval -- epic-ship` (TC-001…TC-005).
2. Recorrido SMOKE-7 sobre una épica fixture con `epic-validate-report.md` en `APPROVED`: comprobar con `git log` y `git tag` que no se creó ningún commit ni tag, y con `head -c3` que `CHANGELOG.md`, `<EPIC_DIR>/release-notes.md` y `epic.md` no empiezan por `EF BB BF` (Contrato 6, CNF-3).

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | Requiere ejecución de tests: AC-1…AC-4 se cubren con TC-001…TC-005, pendientes de `npm run test:eval -- epic-ship` |
| 2 | Criterios no funcionales verificados | ⚠️ | CNF-3 (sin BOM en el skill), CNF-4 (`verify-fixed-layout`), CNF-5 y CNF-6 (164 líneas, detalle en `references/`) verificados; CNF-1 y CNF-2 dependen de las evals |
| 3 | El comportamiento coincide con `design.md` | ✓ | Componentes, interfaces, flujos F1–F4 y P7 implementados; desvíos menores en `design.md › Notas de implementación` |
| 4 | Sin regresiones | ✓ | `npm test`: 394/394; `verify:repository` OK |
| 5 | Convenciones de `constitution.md` | ✓ | Skill en español, fuente única en `skills/`, layout fijo |
| 6 | Sin código comentado ni `TODO` | ✓ | Los únicos comentarios son las guías del template, que el Paso 5 elimina al instanciar |
| 7 | Sin variables, imports o funciones sin usar | ✓ | No hay código ejecutable; la referencia y el template se citan desde `SKILL.md` |
| 8 | Linter y formateador sin errores | ✓ | `npm run verify:repository` aprobado |
| 9 | Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| 10 | Se usó `skill-master` | ✓ | Invocado en T001; modo build: evals antes de `SKILL.md` |
| 11 | Ruta del skill en `package.json › files` | ✓ | `skills/` ya está publicado completo |
| 12 | `gr-ai-security-checklist` | ✓ | Cláusula de contenido untrusted, extracción solo de escalares y escape de `<!--` |
| 13 | `gr-code-security-checklist` | ✓ | Sin credenciales, sin ejecución de comandos ni pipes remotos |
| 14 | `gr-skill-creation-checklist` | ✓ | Frontmatter `name`/`description` (`>-`, 336 caracteres, sin `<>`), `SKILL.md` < 500 líneas, referencia enlazada, sin URLs fuera de la allow-list, sin `README.md` |
| 15 | Skills críticos con `evals/evals.json` | ✓ | 5 casos `TC-NNN`; `verify:eval-inventory` OK |
| 16 | Casos ejecutados automáticamente según `skill-master` | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement; la ejecución es manual por AGENTS.md |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 32/32 |
| 18 | Docs actualizados si cambian contratos | ✓ | Invariante 6, `domain-epic-lifecycle`, `state-machine.md`, mapa de skills y guía del pipeline |
| 19 | Decisiones no previstas documentadas en `design.md` | ✓ | `## Notas de implementación` |
| 20 | CHANGELOG actualizado | ✓ | Entrada de `/epic-ship` en `[Unreleased] › Added` |
| 21 | El build de CI pasa | ⚠️ | El gate local `verify:repository` (el mismo de `quality.yml`) pasa; CI no se ejecutó |
| 22 | Sin secrets ni credenciales | ✓ | Ningún literal sensible en los archivos nuevos |
| 23 | Variables de entorno documentadas | ✓ | No se agregan variables de entorno |
| 24 | El despliegue puede revertirse | ✓ | Solo Markdown y JSON; revertible con git |

**Resumen:** 20/24 criterios ✓ · 4 ⚠️ · 0 ❌

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.
Este skill genera el código pero no ejecuta ni verifica que los tests pasen.

Pasos recomendados:
1. Ejecutar `npm run test:eval -- epic-ship`
2. Si algún test falla, revisar el código generado y ajustar manualmente
3. Consultar `design.md` para verificar que la implementación respeta las interfaces definidas
