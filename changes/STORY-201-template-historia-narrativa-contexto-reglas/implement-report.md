---
type: implement-report
id: STORY-201
slug: STORY-201-implement-report
title: "Implement Report: Template de historia con narrativa, contexto y reglas de negocio"
story: STORY-201
created: 2026-11-27
updated: 2026-11-27
---

# Reporte de Implementación: Template de historia con narrativa, contexto y reglas de negocio

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-201 |
| Total de tareas | 16 |
| Tareas completadas | 0 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 16 |
| Fecha de implementación | 2026-11-27 |

**Estado:** ✅ Implementación completa

Esta ejecución es el rework de la ronda 1. `fix-directives.md` vino de `/story-code-review` (`based-on: code-review-report.md`). Las 16 tareas ya estaban `[x]`, así que el trabajo de esta ejecución son las correcciones de la sección siguiente.

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Reescribir el seed desde `story-new-template.md` con los comentarios `escritor:` de las secciones nuevas | ✓ completado (ejecución anterior) | — |
| T002 | Copiar por bytes el seed a `docs/templates/` y verificar con `cmp` | ✓ completado (ejecución anterior) | — |
| T003 | Verificar BOM, orden de títulos, guion en AC y líneas de Reglas | ✓ completado (ejecución anterior) | — |
| T004 | Regla de omisión de secciones `*(si aplica)*` en `story-creation` | ✓ completado (ejecución anterior) | — |
| T005 | Ejemplo de output de `story-creation` con la estructura nueva | ✓ completado (ejecución anterior) | — |
| T006 | Comienzo común de la sección de AC en `story-acceptance` | ✓ completado (ejecución anterior) | — |
| T007 | Comienzo común de la sección de AC en `story-verify` | ✓ completado (ejecución anterior) | — |
| T008 | Componentes 1 y 2 de la rúbrica F en `story-evaluation` | ✓ completado (ejecución anterior) | — |
| T009 | Sección de notas en sus dos formas en `story-refine` | ✓ completado (ejecución anterior) | — |
| T010 | Títulos, prefijos y AC de cierre con guion en `sal-corrections.md` | ✓ completado (ejecución anterior) | — |
| T011 | Ejemplos inline de `epic-generate-stories` y `epic-generate-all-stories` | ✓ completado (ejecución anterior) | — |
| T012 | Entrada `### Changed` en `## [Unreleased]` | ✓ completado (ejecución anterior) | — |
| T013 | `npm test` y `npm run verify:repository` | ✓ completado (ejecución anterior) | — |
| T014 | `grep` de los cinco consumidores y del AC de cierre | ✓ completado (ejecución anterior) | — |
| T015 | Encoding de los archivos modificados | ✓ completado (ejecución anterior) | — |
| T016 | Validación manual de `/story-creation` sin contexto ni reglas | ✓ completado (ejecución anterior) | — |

---

## Correcciones de fix-directives.md (ronda 1)

Origen: `/story-code-review` (`code-review-report.md`).

| # | Archivo:Línea | Severidad | Resultado |
|---|---|---|---|
| 1 | skills/story-creation/SKILL.md:76 | MEDIUM | 💻 corregido: casos `TC-NNN` nuevos en `skills/story-creation/evals/evals.json` (TC-004, TC-005), `skills/story-evaluation/evals/evals.json` (TC-010, TC-011, con el fixture `skills/story-evaluation/examples/example-template-actual.md`) y `skills/epic-refine/evals/evals.json` (TC-029, con el fixture `skills/epic-refine/examples/cobertura-cierre-template-actual/`). `skills/story-creation/SKILL.md` no cambia: la regla de `:76` ya es correcta; faltaba su eval |
| 2 | docs/templates/story-template.md:74 | MEDIUM | 💻 corregido: las cuatro reglas reconocen `## 🚫 Fuera de alcance` y `## Fuera de alcance`: `skills/epic-analyze/SKILL.md:198` (E1), `skills/epic-refine/references/sal-corrections.md:32` (regla E1) y `:37` (`depends-on:`) y `skills/epic-validate/references/story-sources.md:72` (historias dueñas). También cambian el ejemplo `skills/epic-analyze/SKILL.md:214`, los casos nuevos `skills/epic-analyze/evals/evals.json` TC-038 y `skills/epic-validate/evals/evals.json` TC-044, AC-3 y la nota de riesgo de `story.md`, y `design.md` (CR-005 y «Componentes afectados»). El template no cambia: AC-1 exige el emoji |
| 3 | changes/STORY-201-template-historia-narrativa-contexto-reglas/story.md:40-48 | MEDIUM | 💻 corregido: es la misma corrección que la #1 para `story-creation`. TC-004 comprueba AC-2 (`## Narrativa`, `## ✅ Criterios de aceptación (escenarios Gherkin)`, `### AC-1 - `/`### AC-2 - ` y sin `## Contexto y valor` ni `## Reglas`). `story.md` no se modificó por esta fila |

**Archivos corregidos:** `skills/story-creation/evals/evals.json`, `skills/story-evaluation/evals/evals.json`, `skills/story-evaluation/examples/example-template-actual.md` (nuevo), `skills/story-evaluation/SKILL.md` (lista de ejemplos), `skills/epic-refine/evals/evals.json`, `skills/epic-refine/examples/cobertura-cierre-template-actual/` (4 archivos nuevos), `skills/epic-refine/references/sal-corrections.md`, `skills/epic-analyze/SKILL.md`, `skills/epic-analyze/evals/evals.json`, `skills/epic-validate/references/story-sources.md`, `skills/epic-validate/evals/evals.json`, `changes/STORY-201-template-historia-narrativa-contexto-reglas/story.md`, `changes/STORY-201-template-historia-narrativa-contexto-reglas/design.md`, `CHANGELOG.md`
**Hallazgos omitidos por archivo inexistente:** ninguno

**Fuera de la lista blanca, con aprobación del Solo Builder (2026-11-27):** los tres `evals.json` de los hallazgos #1 y #3 con sus fixtures, y en el #2 los cuatro consumidores con sus evals y `design.md`. Para que la documentación siguiera siendo veraz se tocaron además `CHANGELOG.md` (la entrada de compatibilidad nombra los nuevos consumidores) y la lista de ejemplos de `skills/story-evaluation/SKILL.md`. Los dos archivos de la lista blanca que no son `story.md` (`skills/story-creation/SKILL.md` y `docs/templates/story-template.md`) no cambiaron.

### Casos de eval añadidos

| Caso | EV de `testcases.md` | Qué detecta |
|---|---|---|
| `story-creation` TC-004 | E2E-002 (AC-2) | Una necesidad sin contexto ni reglas genera `## Narrativa` y `## ✅ Criterios de aceptación (escenarios Gherkin)` con AC con guion, sin `## Contexto y valor`, `## Reglas` ni sus placeholders |
| `story-creation` TC-005 | EV-001 | Con contexto y dos reglas: `## Contexto y valor`, `## Reglas (reglas de negocio)`, `- **Regla-1:**`/`- **Regla-2:**` y `→ cubierta por [AC-`, sin el placeholder `AC-n]` |
| `story-evaluation` TC-010 | EV-003 | `# 📖 Historia:` + `## Narrativa` y la sección de criterios con sufijo puntúan 5 en los componentes 1 y 2 (`F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3)`, sin `(4 × 0.4)`) → `APPROVED` |
| `story-evaluation` TC-011 | EV-004 | Los títulos anteriores (`example-ready.md`) mantienen el mismo F_score y el `APPROVED` |
| `epic-refine` TC-029 | EV-005, EV-006 | AC de cierre `### AC-3 - …` con guion; la línea E1 se añade justo tras `- depends-on: STORY-301`, dentro de `## 🔗 Notas adicionales…` y sin duplicar la sección; una cita del criterio y un `depends-on:` dentro de `## 🚫 Fuera de alcance…` no cuentan |
| `epic-analyze` TC-038 | — (CR-005) | Variante de TC-016 con los títulos del template actual: una mención de SMOKE-2 en `## 🚫 Fuera de alcance (Non-Goals) *(si aplica)*` no es cobertura E1 |
| `epic-validate` TC-044 | — (CR-005) | Variante de TC-023: SMOKE-1 citado solo en `## 🚫 Fuera de alcance…` queda `sin dueña`; el veredicto sigue `APPROVED` |

La versión de cada `evals.json` sube de minor: `story-creation` 1.1.0, `story-evaluation` 1.2.0, `epic-refine`, `epic-analyze` y `epic-validate` 1.7.0. El caso de `testcases.md` EV-002 (fail-fast sin template) no se añadió: `fix-directives.md` no lo pide y su comportamiento no cambió en esta historia.

---

## Pruebas ejecutadas

| Comando | Resultado |
|---|---|
| `npm test` | 580 pass, 0 fail |
| `npm run verify:repository` | «Verificación determinista del repositorio aprobada», código 0 (incluye el inventario de evals, enlaces, layout fijo y el smoke del tarball) |
| `npm run test:eval -- <skill> --only <casos nuevos> --dry-run` (los 5 skills) | Código 0: los 7 casos nuevos se cargan y generan su prompt. No se invocó ningún runner |
| Bytes de los 17 archivos tocados en esta ronda | Sin BOM, 0 U+FEFF, 0 CR |

**No ejecutado:** `npm run test:eval` real de los casos nuevos. Queda a criterio humano (`AGENTS.md`). Comando sugerido: `npm run test:eval -- story-creation --only TC-004,TC-005`; lo mismo para `story-evaluation` (TC-010, TC-011), `epic-refine` (TC-029), `epic-analyze` (TC-038) y `epic-validate` (TC-044).

---

## Evidencia de verificación (ejecución anterior)

Los contratos 1 a 9 de `design.md` se verificaron en la ejecución anterior, y esta ronda no modificó ninguno de los archivos que cubren: el template, su seed y los cinco consumidores de AC-3. La validación manual T016 tiene una limitación: la sesión cargó la versión anterior de `story-creation/SKILL.md`, y la ejecutó el mismo agente que redactó la regla. TC-004 cubre ahora AC-2 sin depender solo de T016. Repetir T016 en una sesión nueva sigue siendo opcional.

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | AC-1 y AC-3 verificados por contratos y el gate. AC-2 tiene T016 y el eval TC-004, que no se ejecutó (a criterio humano) |
| 2 | Criterios no funcionales verificados | ✓ | CNF-1: sin BOM y 0 U+FEFF en las dos copias del template y en los 17 archivos de esta ronda |
| 3 | El comportamiento coincide con `design.md` | ✓ | D-1 a D-8, más CR-005 (tercer título) y CR-006 (evals) |
| 4 | Sin regresiones | ✓ | `npm test` 580/580 y `verify:repository` con código 0 |
| 5 | Convenciones de `constitution.md` | ✓ | Markdown y JSON en español, sin scripts nuevos |
| 6 | Sin código comentado ni `TODO` sin issue | ✓ | No se agregó código |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | No aplica: no hay código |
| 8 | Linter y formateador sin errores | ✓ | `verify:repository` aprobado |
| 9 | Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| 10 | `skill-master` para skills nuevos | ✓ | No aplica: no se crearon skills |
| 11 | Ruta de skill nuevo en `files` de `package.json` | ✓ | No aplica: no se crearon skills; los fixtures nuevos están dentro de directorios de skill ya publicados |
| 12 | Se cumple [[gr-ai-security-checklist]] | ⚠️ | No se revisó punto por punto. Los fixtures nuevos no contienen texto con forma de instrucción; las reglas cambiadas solo amplían el título que se excluye |
| 13 | Se cumple [[gr-code-security-checklist]] | ✓ | No aplica: no hay código |
| 14 | Se cumple [[gr-skill-creation-checklist]] | ⚠️ | No se revisó punto por punto; los skills modificados conservan su estructura y el gate los valida |
| 15 | Skills críticos con `evals/evals.json` | ✓ | Los cinco skills con comportamiento cambiado tienen casos nuevos (CR-006) |
| 16 | Casos de prueba evaluados automáticamente (`skill-master`) | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement; `npm run test:eval` queda a criterio humano (`AGENTS.md`); el `--dry-run` valida que los casos cargan |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 16/16 `[x]` |
| 18 | README o docs actualizados si cambian contratos | ✓ | `CHANGELOG.md` y la lista de ejemplos de `story-evaluation/SKILL.md` |
| 19 | Decisiones no previstas documentadas en `design.md` | ✓ | CR-003 a CR-006 |
| 20 | CHANGELOG actualizado | ✓ | La entrada de compatibilidad de `## [Unreleased]` nombra `epic-analyze`, `epic-refine` y `epic-validate` |
| 21 | Build de CI pasa | ⚠️ | Requiere ejecución de CI — no evaluable por story-implement; el mismo gate (`verify:repository`) pasó localmente |
| 22 | Sin secretos ni credenciales | ✓ | Solo Markdown y JSON de evals; los emails de los fixtures usan `example.com` |
| 23 | Variables de entorno documentadas | ✓ | No aplica: ninguna nueva |
| 24 | Despliegue reversible sin pérdida de datos | ✓ | Cambios de texto reversibles con `git revert` |

**Resumen:** 19/24 criterios ✓ (5 ⚠️, 0 ❌)

---

⚠️ Checklist de épica no actualizado: `story.md` no declara `parent`.

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.
Esta ronda no genera tests de código: los casos nuevos son evals de skills (`evals.json`), que se ejecutan con `npm run test:eval -- <skill>` a criterio humano.
