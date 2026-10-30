---
type: implement-report
id: STORY-126
slug: STORY-126-implement-report
title: "Implement Report: Operar la validación de épicas de manera segura"
story: STORY-126
created: 2026-10-30
updated: 2026-10-30
---

# Reporte de Implementación: Operar la validación de épicas de manera segura

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-126 |
| Total de tareas | 24 |
| Tareas completadas | 24 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-10-30 |

**Estado:** ✅ Implementación completa

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Precondición CR-002: STORY-124 y STORY-125 presentes; STORY-169 (suites) ausente | ✓ completado | — |
| T002 | CR-001 en `story.md` (AC-4 y «Contenido equivalente»), con confirmación del PO | ✓ completado | `story.md` |
| T003 | Paso 1: contrato de invocación `{ epica, modoFlag, dryRun }` sin leer archivos | ✓ completado | `skills/epic-validate/SKILL.md` |
| T004 | Paso 1: cinco errores de invocación en orden, con `RESULTADO: FALLO` | ✓ completado | `skills/epic-validate/SKILL.md` |
| T005 | Paso 1.2: resolución de `MODO` y `MODO_ORIGEN` | ✓ completado | `skills/epic-validate/SKILL.md` |
| T006 | Interacción por modo y `<epica>` ausente en `auto` | ✓ completado | `skills/epic-validate/SKILL.md` |
| T007 | Sección «Política de efectos» | ✓ completado | `skills/epic-validate/SKILL.md` |
| T008 | Guardia de previsualización (C4) en `OPE-01`…`OPE-03` | ✓ completado | `skills/epic-validate/SKILL.md` |
| T009 | Veredicto: `no ejecutada` sin efecto y nota de no ejecutadas | ✓ completado | `skills/epic-validate/SKILL.md` |
| T010 | Paso 5: previsualización, campos volátiles y reglas de orden y forma | ✓ completado | `skills/epic-validate/SKILL.md` |
| T011 | Paso 6: bloque de resultado y tabla de correspondencia | ✓ completado | `skills/epic-validate/SKILL.md` |
| T012 | Parámetros, Modos de ejecución, Salida y `description` (455 caracteres) | ✓ completado | `skills/epic-validate/SKILL.md` |
| T013 | Eval V-1 → TC-014 | ✓ completado | `skills/epic-validate/evals/evals.json` |
| T014 | Eval V-2 → TC-015 | ✓ completado | `skills/epic-validate/evals/evals.json` |
| T015 | Eval V-3 → TC-016 | ✓ completado | `skills/epic-validate/evals/evals.json` |
| T016 | Eval V-4 → TC-017 | ✓ completado | `skills/epic-validate/evals/evals.json` |
| T017 | Eval V-5 → TC-018 | ✓ completado | `skills/epic-validate/evals/evals.json` |
| T018 | Evals V-6 → TC-019/TC-020 y V-7 → TC-021/TC-022 | ✓ completado | `skills/epic-validate/evals/evals.json` |
| T019 | `SKILL.md` 391 líneas; UTF-8 sin BOM con LF; mensajes literales iguales a design.md | ✓ completado | — |
| T020 | Verificación pendiente de STORY-169 registrada (ver abajo) | ✓ completado | `implement-report.md` |
| T021 | `verify:layout`, `verify:validation-contract`, `verify:eval-inventory` en OK | ✓ completado | — |
| T022 | `npm test` (366/366) y `npm run verify:repository` en OK | ✓ completado | — |
| T023 | `graphify update .` | ✓ completado | `graphify-out/` |
| T024 | Evals y recorrido manual registrados como pendientes (ver abajo) | ✓ completado | `implement-report.md` |

Otros archivos tocados: `CHANGELOG.md` (entrada en `[Unreleased]`), `design.md` (sección «Notas de implementación») y `specs/flow/EPIC-23-completar-flujo-de-epic/epic.md` (checklist).

---

## Verificaciones pendientes

- **STORY-169 (CR-002, T020):** los pasos de suites de épica aún no existen en `SKILL.md`. Al integrarlos, comprobar que la guardia de previsualización los cubre (pasan por `check-command`, así que la regla genérica aplica), sumar sus filas a la Política de efectos (`MODO = auto`) y a las reglas de orden, y volver a ejecutar TC-015, TC-016, TC-019 y TC-020.
- **Evals (T024, criterio humano según AGENTS.md):** `npm run test:eval -- epic-validate`, con foco en los casos nuevos TC-014…TC-022.
- **Recorrido manual (T024):** `/epic-validate EPIC-23 --dry-run` y `/epic-validate EPIC-23 --mode rapido` dejan `git status` sin cambios.

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | Requiere ejecución de tests: AC-1…AC-4 cubiertos por TC-014…TC-022, pendientes de `npm run test:eval` |
| 2 | Criterios no funcionales verificados | ⚠️ | CNF-1 (reglas de orden y campos volátiles, TC-018) y CNF-2 (Política de efectos, TC-016/TC-019/TC-020) especificados; requieren ejecución de evals |
| 3 | El comportamiento coincide con `design.md` | ✓ | C1…C9 implementados; mensajes literales verificados (T019); desvíos menores documentados en design.md «Notas de implementación» |
| 4 | Sin regresiones | ✓ | `npm test` 366/366 y `npm run verify:repository` aprobado; los casos TC-001…TC-013 no cambiaron |
| 5 | Convenciones de `constitution.md` | ✓ | Contenido en español, Markdown + JSON, sin código nuevo |
| 6 | Sin código comentado ni `TODO` | ✓ | No se agregó código |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | No se agregó código |
| 8 | Linter y formateador sin errores | ✓ | `verify:repository` (incluye `verify:syntax`) aprobado |
| 9 | Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| 10 | `skill-master` para skills nuevos | ✓ | No aplica: se modificó un skill existente |
| 11 | Ruta de skill nuevo en `files` de `package.json` | ✓ | No aplica; `skills/` ya está en `files` |
| 12 | Se cumple gr-ai-security-checklist | ✓ | Sin nuevas fuentes leídas; la cláusula de contenido untrusted no cambia; `--dry-run` reduce la superficie (no ejecuta comandos) |
| 13 | Se cumple gr-code-security-checklist | ✓ | Sin código nuevo ni secretos; los argumentos se validan antes de leer archivos |
| 14 | Se cumple gr-skill-creation-checklist | ⚠️ | Los criterios automatizables se cumplen (frontmatter, `description` de 455 caracteres sin `<`/`>`, < 500 líneas, evals). El criterio «evals escritos antes que `SKILL.md` (RED)» no se cumple en el orden de tasks.md (SKILL.md en T003–T012, evals en T013–T018) |
| 15 | Los skills críticos tienen `evals/evals.json` | ✓ | `skills/epic-validate/evals/evals.json` con 22 casos (versión 1.2.0) |
| 16 | Casos de prueba ejecutados automáticamente | ⚠️ | Requiere ejecución de tests: `npm run test:eval -- epic-validate` es manual (AGENTS.md) |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 24/24 |
| 18 | Docs actualizadas si cambian contratos | ✓ | `SKILL.md` (Parámetros, Modos, Salida) y `CHANGELOG.md`; `domain-skills-map.md` sigue siendo veraz (design.md) |
| 19 | Decisiones no previstas documentadas en `design.md` | ✓ | Sección «Notas de implementación (2026-10-30)» |
| 20 | CHANGELOG actualizado | ✓ | Entrada STORY-126 en `[Unreleased] › Added` |
| 21 | Build de CI pasa | ⚠️ | Requiere ejecución de CI; el gate local equivalente (`verify:repository`) pasa |
| 22 | Sin secretos ni credenciales | ✓ | Fixtures sin credenciales |
| 23 | Variables de entorno documentadas | ✓ | No se agregan variables |
| 24 | Despliegue reversible | ✓ | Solo Markdown y JSON |

**Resumen:** 19/24 criterios ✓ · 5 ⚠️ · 0 ❌

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.
Este skill genera el código pero no ejecuta ni verifica que los tests pasen.

Pasos recomendados:
1. Ejecutar `npm run test:eval -- epic-validate`
2. Si algún caso falla, revisar `SKILL.md` o el `expected` del caso y ajustar manualmente
3. Consultar `design.md` para verificar que la implementación respeta las interfaces definidas
