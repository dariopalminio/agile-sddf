---
type: implement-report
id: STORY-170
slug: STORY-170-implement-report
title: "Implement Report: Skill epic-ship"
story: STORY-170
created: 2026-10-30
updated: 2026-10-31
---

# Reporte de Implementación: Skill epic-ship

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-170 |
| Total de tareas | 32 |
| Tareas completadas en esta ejecución | 0 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 32 |
| Fecha de rework | 2026-10-31 |

**Estado:** ✅ Implementación completa

---

## Tabla de Estado por Tarea

Las 32 tareas se completaron en la implementación inicial del 2026-10-30; esta ejecución solo aplica `fix-directives.md`.

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Scaffolding de `skills/epic-ship/` con `skill-master` (sin `scripts/` ni `README.md`) | ✓ completado (ejecución anterior) | `skills/epic-ship/{references,assets,evals}/` |
| T002 | Frontmatter de `SKILL.md` (`name`, `description: >-` de 336 caracteres) | ✓ completado (ejecución anterior) | `skills/epic-ship/SKILL.md` |
| T003 | Objetivo, «Qué hace / Qué NO hace», regla de repositorio | ✓ completado (ejecución anterior) | `skills/epic-ship/SKILL.md` |
| T004 | Regla de contenido untrusted y escape de `<!--` | ✓ completado (ejecución anterior) | `skills/epic-ship/SKILL.md` |
| T005 | Paso 0 con `<!-- SDDF-FIXED-LAYOUT: v1 -->` y solo `REPO_ROOT` | ✓ completado (ejecución anterior) | `skills/epic-ship/SKILL.md` |
| T006 | Paso 1: resolver la épica | ✓ completado (ejecución anterior) | `skills/epic-ship/SKILL.md` |
| T007 | Paso 2: gates de validación y de status antes de escribir | ✓ completado (ejecución anterior) | `skills/epic-ship/SKILL.md` |
| T008 | Paso 3: inventario vía la referencia | ✓ completado (ejecución anterior) | `skills/epic-ship/SKILL.md` |
| T009 | Paso 4: bloque de `CHANGELOG.md` y error de delimitador incompleto | ✓ completado (ejecución anterior) | `skills/epic-ship/SKILL.md` |
| T010 | Paso 5: `release-notes.md` desde el template, conservando `created` | ✓ completado (ejecución anterior) | `skills/epic-ship/SKILL.md` |
| T011 | Paso 6: resumen y pasos de liberación con versión sugerida | ✓ completado (ejecución anterior) | `skills/epic-ship/SKILL.md` |
| T012 | Paso 7: confirmación `s`/`si`/`sí` y escritura de `SHIP/DONE` | ✓ completado (ejecución anterior) | `skills/epic-ship/SKILL.md` |
| T013 | Modos de ejecución (orquestador sin cambio de status) | ✓ completado (ejecución anterior) | `skills/epic-ship/SKILL.md` |
| T014 | Salida y regla de encoding | ✓ completado (ejecución anterior) | `skills/epic-ship/SKILL.md` |
| T015 | Referencia de contenido (inventario, categorías, bloque, idempotencia, versión) | ✓ completado (ejecución anterior) | `skills/epic-ship/references/release-content.md` |
| T016 | Template de notas de versión | ✓ completado (ejecución anterior) | `skills/epic-ship/assets/release-notes-template.md` |
| T017 | Evals TC-001…TC-005 con `not_contains` de comandos de git y publicación | ✓ completado (ejecución anterior) | `skills/epic-ship/evals/evals.json` |
| T018 | TC-001 con `EPIC-300-otra` y una historia `CANCELED/DONE` | ✓ completado (ejecución anterior) | `skills/epic-ship/evals/evals.json` |
| T019 | Invariante 6: cláusula de `SHIP` de épica | ✓ completado (ejecución anterior) | `docs/domains/domain-state-management.md` |
| T020 | `domain-epic-lifecycle` §5, §7, §8 y §9 (`epic-validate-report.md`) | ✓ completado (ejecución anterior) | `docs/domains/domain-epic-lifecycle.md` |
| T021 | Nota de transiciones manuales y actor de `SHIP` | ✓ completado (ejecución anterior) | `docs/architecture/state-machine.md` |
| T022 | Fila de `epic-ship` en `## Épica (L2)` | ✓ completado (ejecución anterior) | `docs/domains/domain-skills-map.md` |
| T023 | Fila de `epic-ship` y nota del gateway en la guía del pipeline | ✓ completado (ejecución anterior) | `docs/guides/sddf-commands-pipeline.md` |
| T024 | CR-001 y CR-002 en las Notas de la historia | ✓ completado (ejecución anterior) | `specs/flow/STORY-170-skill-epic-ship/story.md` |
| T025 | `SKILL.md` 164 líneas (≤ 200), `description` 336 caracteres (≤ 350), detalle solo en la referencia | ✓ completado (ejecución anterior) | — |
| T026 | `SKILL.md` sin instrucciones de ejecutar comandos de git, publicación ni despliegue (`npm publish` solo aparece en la prohibición) | ✓ completado (ejecución anterior) | — |
| T027 | El gate del Paso 2 precede a toda escritura (Pasos 4, 5 y 7); `epic.md` solo tras `s`/`si`/`sí` | ✓ completado (ejecución anterior) | — |
| T028 | Los cuatro archivos de `skills/epic-ship/` sin BOM | ✓ completado (ejecución anterior) | — |
| T029 | `verify-fixed-layout` (42 skills), `verify:eval-inventory` (42 skills) y `verify:links` (50 archivos): OK | ✓ completado (ejecución anterior) | — |
| T030 | `npm test` (394/394) y `npm run verify:repository` OK | ✓ completado (ejecución anterior) | — |
| T031 | `graphify update .` | ✓ completado (ejecución anterior) | `graphify-out/` |
| T032 | Ejecución manual pendiente registrada (abajo) | ✓ completado (ejecución anterior) | — |

Archivos adicionales: `CHANGELOG.md` (entrada de `/epic-ship` en `[Unreleased] › Added`) y `design.md` (sección `## Notas de implementación`).

---

## Correcciones de fix-directives.md (ronda 1)

| # | Archivo:Línea de origen | Severidad | Resultado |
|---|---|---|---|
| 1 | `skills/epic-ship/references/release-content.md:73` | MEDIUM | Corregido: un bloque existente solo se reemplaza dentro de `[Unreleased]`; TC-006 cubre el rechazo del bloque publicado. |
| 2 | `skills/epic-ship/evals/evals.json:71` | MEDIUM | Se añadieron comprobaciones observables a SMOKE-7 (referencias git, árbol de trabajo y actividad de publicación/despliegue). Su ejecución humana sigue pendiente; `not_contains` no se considera prueba de ausencia de efectos. |
| 3 | `specs/flow/STORY-170-skill-epic-ship/implement-report.md:74` | MEDIUM | Pendiente: no hay recorrido SMOKE-7 ejecutado por un humano; no se inventa evidencia. |
| 4 | `skills/epic-ship/SKILL.md:99` | MEDIUM | Corregido: `VALIDATE/DONE` y `APPROVED` son obligatorios; TC-008 cubre el reporte aprobado con estado `DEVELOP`. |
| 5 | `specs/flow/STORY-170-skill-epic-ship/design.md:249` | MEDIUM | Corregido: D-7 y la nota de implementación reflejan el gateway canónico. |
| 6 | `skills/epic-ship/assets/release-notes-template.md:6` | MEDIUM | Corregido: `{yaml_title}` se serializa como cadena YAML segura; TC-007 usa un título adversarial. |
| 7 | `docs/guardrails/dod-story-code-review.md:21` | MEDIUM | Pendiente de repetir `/story-code-review STORY-170` tras las correcciones; el guardrail no se modifica. |
| 8 | `docs/guardrails/dod-story-code-review.md:25` | MEDIUM | Pendiente de un nuevo veredicto `APPROVED` en code review; este skill no lo emite. |

**Archivos corregidos:** `skills/epic-ship/references/release-content.md`, `skills/epic-ship/evals/evals.json`, `skills/epic-ship/SKILL.md`, `specs/flow/STORY-170-skill-epic-ship/design.md`, `skills/epic-ship/assets/release-notes-template.md`, `specs/flow/STORY-170-skill-epic-ship/implement-report.md`.

**Hallazgos omitidos por archivo inexistente:** ninguno.

---

## Pendiente de ejecución manual (T032)

A criterio humano (AGENTS.md), sin ejecutar en esta sesión:

1. `npm run test:eval -- epic-ship` (TC-001…TC-008). La decisión de ejecutarlo corresponde a un humano por AGENTS.md.
2. Recorrido SMOKE-7 sobre una épica fixture en `VALIDATE/DONE` con `epic-validate-report.md` en `APPROVED`: aplicar las cuatro comprobaciones `manual_checks` de TC-001 y registrar fecha, fixture, observaciones y resultado aquí. A 2026-10-31 no se ejecutó el recorrido ni se comprobó el encoding de los archivos generados por el skill.

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | Requiere ejecución humana de `npm run test:eval -- epic-ship`: AC-1…AC-4 se cubren con TC-001…TC-008, pero no hay resultado de evals ni de SMOKE-7 |
| 2 | Criterios no funcionales verificados | ⚠️ | CNF-4 (`verify-fixed-layout`), CNF-5 y CNF-6 (skill compacto y referencia bajo demanda) verificados; CNF-1, CNF-2 y el encoding de los documentos generados requieren el recorrido manual |
| 3 | El comportamiento coincide con `design.md` | ✓ | D-4 y D-7 alineados con `[Unreleased]` y `VALIDATE/DONE`; el escape YAML está especificado en D-10 y en el template |
| 4 | Sin regresiones | ✓ | `npm test`: 438/438; `npm run verify:repository`: OK el 2026-10-31 |
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
| 15 | Skills críticos con `evals/evals.json` | ✓ | 8 casos `TC-NNN`; `verify:eval-inventory` OK |
| 16 | Casos ejecutados automáticamente según `skill-master` | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement; la ejecución es manual por AGENTS.md |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 32/32 |
| 18 | Docs actualizados si cambian contratos | ✓ | Invariante 6, `domain-epic-lifecycle`, `state-machine.md`, mapa de skills y guía del pipeline |
| 19 | Decisiones no previstas documentadas en `design.md` | ✓ | `## Notas de implementación` |
| 20 | CHANGELOG actualizado | ✓ | Entrada de `/epic-ship` en `[Unreleased] › Added` |
| 21 | El build de CI pasa | ⚠️ | El gate local `verify:repository` (el mismo de `quality.yml`) pasa el 2026-10-31; CI no se ejecutó |
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
