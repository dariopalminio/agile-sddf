---
type: implement-report
id: STORY-167
slug: STORY-167-implement-report
title: "Implement Report: Skill epic-improve"
story: STORY-167
created: 2026-10-29
updated: 2026-10-29
---

# Reporte de Implementación: Skill epic-improve

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-167 |
| Total de tareas | 30 |
| Tareas completadas | 30 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-10-29 |

**Estado:** ✅ Implementación completa

Orden de ejecución: siguiendo la fase RED de `skill-master` y `gr-skill-creation-checklist` («los evals se escriben antes que `SKILL.md`»), las fixtures y los evals (T017–T021) se escribieron antes del `SKILL.md` (T003–T013) y del catálogo (T014–T015).

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Verificar que STORY-166 está implementada (CR-001) | ✓ completado | — (existe `skills/epic-format-validation/assets/epic-format-validation-report-template.md` con `## Defectos`) |
| T002 | Crear el skill con `skill-master` | ✓ completado | `skills/epic-improve/` |
| T003 | Frontmatter y Objetivo / Qué hace / Qué NO hace | ✓ completado | `skills/epic-improve/SKILL.md` |
| T004 | Restricciones / Reglas | ✓ completado | `skills/epic-improve/SKILL.md` |
| T005 | Paso 0 (layout fijo) y Paso 1 (resolución de la épica) | ✓ completado | `skills/epic-improve/SKILL.md` |
| T006 | Paso 2 (gate por `verdict`) | ✓ completado | `skills/epic-improve/SKILL.md` |
| T007 | Paso 3 (template y revalidación de defectos) | ✓ completado | `skills/epic-improve/SKILL.md` |
| T008 | Paso 4 (catálogo, mejoras, fuente citada) | ✓ completado | `skills/epic-improve/SKILL.md` |
| T009 | Paso 5 (plan y confirmación) | ✓ completado | `skills/epic-improve/SKILL.md` |
| T010 | Paso 6 (backup y escritura única) | ✓ completado | `skills/epic-improve/SKILL.md` |
| T011 | Paso 7 (relectura y restauración) | ✓ completado | `skills/epic-improve/SKILL.md` |
| T012 | Paso 8 (resumen y siguiente paso) | ✓ completado | `skills/epic-improve/SKILL.md` |
| T013 | Salida y tabla de errores | ✓ completado | `skills/epic-improve/SKILL.md` |
| T014 | Catálogo por tipo de defecto | ✓ completado | `skills/epic-improve/references/correction-rules.md` |
| T015 | Mejoras `M-objetivo` / `M-criterios`, fuente citada, épicas v1 | ✓ completado | `skills/epic-improve/references/correction-rules.md` |
| T016 | README del skill | ✓ completado | `skills/epic-improve/README.md` |
| T017 | Fixture `sin-criterios-de-salida/` | ✓ completado | `skills/epic-improve/examples/sin-criterios-de-salida/epic.md`, `…/epic-format-validation-report.md` |
| T018 | Fixture `requiere-decision-po/` | ✓ completado | `skills/epic-improve/examples/requiere-decision-po/epic.md`, `…/epic-format-validation-report.md` |
| T019 | Fixture `aprobada/` | ✓ completado | `skills/epic-improve/examples/aprobada/epic.md`, `…/epic-format-validation-report.md` |
| T020 | Fixture `instruccion-incrustada/` | ✓ completado | `skills/epic-improve/examples/instruccion-incrustada/epic.md`, `…/epic-format-validation-report.md` |
| T021 | `evals/evals.json` TC-001…TC-007 | ✓ completado | `skills/epic-improve/evals/evals.json`, `skills/epic-improve/examples/sin-reporte/epic.md` (CR-003) |
| T022 | `epic-improve` en `escritor:` del template central y del seed | ✓ completado | `docs/templates/epic-template.md`, `skills/epic-creation/assets/epic-template.md` (idénticos byte a byte) |
| T023 | Fila «Gate de formato» de `domain-epic-lifecycle` §8 | ✓ completado | `docs/domains/domain-epic-lifecycle.md` |
| T024 | Bucle y fila en `sddf-commands-pipeline` §2 | ✓ completado | `docs/guides/sddf-commands-pipeline.md` |
| T025 | Presupuesto de tamaño | ✓ completado | `SKILL.md` 181 líneas (≤ 220); `description` 368 caracteres (≤ 500); solo el Paso 4 enlaza el catálogo |
| T026 | UTF-8 sin BOM | ✓ completado | ningún archivo de `skills/epic-improve/` empieza por `EF BB BF` |
| T027 | `verify-fixed-layout` y `verify:eval-inventory` | ✓ completado | `[OK] … 38 skill(s)` en ambos |
| T028 | `npm test` y `npm run verify:repository` | ✓ completado | 353/353 tests; `[OK] Verificación determinista del repositorio aprobada.` |
| T029 | `graphify update .` | ✓ completado | `graphify-out/` (14068 nodos) |
| T030 | Registrar verificación manual pendiente | ✓ completado | ver «Verificación manual pendiente» |

---

## Decisiones no previstas (CR-003 en design.md)

1. Fixture adicional `examples/sin-reporte/` para que el input de TC-005 exista en disco.
2. TC-006 usa `not_contains: "status: COMPLETED"` (no `COMPLETED`): el plan puede citar la nota incrustada sin obedecerla.
3. Frontmatter de `SKILL.md` solo con `name` y `description` (claves permitidas por `gr-skill-creation-checklist`).
4. `sddf-commands-pipeline` §2 incluye también la fila de `epic-format-validation`.
5. `CHANGELOG.md › [Unreleased] › Added`: entrada de `/epic-improve`.

El README del skill nombra `epic-refine` (STORY-165) sin wikilink porque ese skill todavía no existe.

---

## Verificación manual pendiente

A criterio humano (AGENTS.md: los evals no se ejecutan automáticamente para economizar cuota):

- `npm run test:eval -- epic-improve` (TC-001…TC-007).
- SMOKE-4 sobre una copia de `skills/epic-improve/examples/sin-criterios-de-salida/`: `/epic-format-validation` → `/epic-improve` con `s` → `/epic-format-validation` = `APPROVED`.

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement (AC-1…AC-4 cubiertos por TC-001…TC-004, pendientes de `npm run test:eval`) |
| 2 | Criterios no funcionales verificados | ⚠️ | CNF-3 (sin BOM), CNF-4 (`verify-fixed-layout`) y CNF-6 (181 líneas) verificados; CNF-1/CNF-2 dependen de TC-006; CNF-5 por revisión (catálogo solo en el Paso 4) |
| 3 | El comportamiento coincide con `design.md` | ✓ | Pasos 0–8 siguen D-2…D-9; desvíos menores registrados en CR-003 |
| 4 | Sin regresiones | ✓ | `npm test` 353/353; `verify:repository` aprobado; template central = seed |
| 5 | Convenciones de `constitution.md` | ✓ | Skill en español, en `skills/<name>/`, Markdown sin scripts nuevos |
| 6 | Sin código comentado ni `TODO` sin issue | ✓ | Ningún `TODO` añadido (los de `sddf-commands-pipeline.md` §2 son previos) |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | No se añadió código JavaScript |
| 8 | Linter y formateador sin errores | ✓ | `verify:repository` (sintaxis, enlaces, contratos) en verde |
| 9 | Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| 10 | Se usó `skill-master` para el skill nuevo | ✓ | Invocado en T002; plantillas `skill-template-sddf.md` y `readme-template.md`; evals antes de `SKILL.md` |
| 11 | Ruta del skill en `files` de `package.json` | ✓ | `files` publica `skills/` completo (incluye `skills/epic-improve/`) |
| 12 | Se cumple gr-ai-security-checklist | ✓ | CNF-2: contenido de la épica y del reporte como dato; escritura acotada a dos archivos; caso TC-006 de instrucción incrustada |
| 13 | Se cumple gr-code-security-checklist | ✓ | Sin código ejecutable, sin credenciales, sin URLs externas |
| 14 | Se cumple gr-skill-creation-checklist | ⚠️ | Nombre = directorio, `description` `>-` de 368 caracteres sin `<`/`>`, solo claves permitidas, inputs de evals existentes, catálogo enlazado en su punto de uso; «evals antes de `SKILL.md` en el historial de git» no es verificable hasta el commit |
| 15 | Skills críticos con `evals/evals.json` | ✓ | 7 casos TC-NNN (happy-path, fail-fast, error-handling, edge-case) |
| 16 | Casos de prueba ejecutados automáticamente | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement (ejecución manual por AGENTS.md) |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 30/30 |
| 18 | README o docs actualizados | ✓ | README del skill, template, `domain-epic-lifecycle` §8, `sddf-commands-pipeline` §2 |
| 19 | Decisiones no previstas documentadas en `design.md` | ✓ | CR-003 |
| 20 | CHANGELOG actualizado | ✓ | `[Unreleased] › Added` |
| 21 | Build de CI sin errores | ⚠️ | Requiere ejecución de CI — `verify:repository` (el gate de `quality.yml`) pasa en local |
| 22 | Sin secrets ni credenciales | ✓ | Revisión de los archivos creados |
| 23 | Variables de entorno documentadas | ✓ | No se introducen variables de entorno |
| 24 | Despliegue reversible sin pérdida de datos | ✓ | Skill nuevo aditivo; el propio skill crea `epic.md.bak` antes de escribir |

**Resumen:** 19/24 criterios ✓ (5 ⚠️, 0 ❌)

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.
Este skill genera el código pero no ejecuta ni verifica que los tests pasen.

Pasos recomendados:
1. Ejecutar `npm run test:eval -- epic-improve`
2. Si algún caso falla, revisar `skills/epic-improve/SKILL.md` o `references/correction-rules.md` y ajustar
3. Consultar `design.md` para verificar que la implementación respeta las interfaces definidas
