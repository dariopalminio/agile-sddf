---
type: analyze
id: STORY-144
slug: STORY-144-analyze-report
title: "Analyze: Alinear story-analyze"
story: STORY-144
design: STORY-144
tasks: STORY-144
created: 2026-10-17
updated: 2026-10-17
related:
  - STORY-144-alinear-story-analyze
---

<!-- Referencias -->
[[STORY-144-alinear-story-analyze]] · [[STORY-144-alinear-story-analyze-design]] · [[STORY-144-alinear-story-analyze-tasks]] · [[EPIC-25-unificar-contrato-de-validaciones-en-skills]]

# Reporte de Coherencia: Alinear story-analyze

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 2/2 criterios cubiertos (y CNF-1) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada: testcases.md no presente |
| Alineación tareas → diseño | ✓ | 38/38 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 13/13 elementos con tarea (7 componentes, 6 interfaces) |
| Alineación con la épica EPIC-25-unificar-contrato-de-validaciones-en-skills | ✓ | Listada en la épica; cubre CS-6 |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

**Estado general:** ✓ Coherente
<!-- overall_status: ✓ Coherente | ⚠️ Advertencias | ❌ Inconsistencias bloqueantes -->

No hay inconsistencias de tipo A–F. Hay tres observaciones de coherencia interna que no bloquean (ver «Recomendaciones»).
Dependencia abierta: `docs/policies/validation-contract-policy.md` todavía no existe (STORY-138 no está implementada).
La tarea T001 detiene la implementación hasta que exista (D-11).

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Veredicto explícito según las inconsistencias: `## Veredicto` es la primera sección tras el título y el frontmatter declara `verdict`. Ejemplos: ninguna → `APPROVED`, solo WARNING → `APPROVED`, al menos un ERROR → `NEEDS-CHANGES` | ✓ | D-1 (regla de dos filas sobre la severidad; mapea las tres filas de Ejemplos), D-2 (`verdict` en template, Paso 8 y fallback), D-3 (`## Veredicto` con motivo determinista), D-4 (elimina `**Estado general:**`), D-8, D-9 (TC-001, TC-004 y TC-006 nuevo cubren las tres filas), D-10, «Esquema de datos», F-1, V-1, V-2, V-6 |
| AC-2 | `story-plan` respeta el veredicto: con `NEEDS-CHANGES` no pasa a `READY-FOR-IMPLEMENT` y el resumen lo informa; con `APPROVED` pasa a `READY-FOR-IMPLEMENT/DONE` | ✓ | D-5 (Paso 9a decide por `$VERDICT`; Paso 9b emite `(verdict: <VALOR>)` en ambos modos), D-6 (Paso 5 lee `verdict` del frontmatter, guardia de cierre y rama del resumen por veredicto), interfaces «Transición de `story.md`», «Resumen de `story-plan`» y «Guardia de `story-plan`», F-2, F-3, V-5, V-7 |
| CNF-1 | Sin cambio de criterio: las correlaciones, los tipos y la severidad no cambian | ✓ | D-1 (misma condición de bloqueo que SKILL.md l.138 y l.480-489; la tabla de severidad no cambia), V-4 (`git diff` sin líneas modificadas en la tabla ni en las Correlaciones 1-6), TC-006 de story-analyze («solo WARNING») |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Comprobar que la policy existe y leer G-01…G-06, §4, §5, §6 y §7.3 | D-10, D-11 | ✓ |
| T002 | Confirmar el «Estado medido» con `grep` sobre el inventario | Context, D-8 | ✓ |
| T003 | Línea base de `verify:repository` y `npm test` | V-10 | ✓ |
| T004 | Template: `verdict` en el frontmatter | D-2 | ✓ |
| T005 | Template: `## Veredicto`, se elimina «Estado general», el comentario de INC pasa a A-F | D-3, D-4, D-8 | ✓ |
| T006 | Paso 6: subsección `#### Veredicto`, `$VERDICT`, qué no es un hallazgo y regla del motivo | D-1, D-3 | ✓ |
| T007 | l.138: regla de bloqueo ligada a `NEEDS-CHANGES` y referencia a la policy | D-8 | ✓ |
| T008 | Paso 8: `verdict` en el frontmatter, punto «Veredicto», el resumen deja de pedir el estado general | D-2, D-3, D-4 | ✓ |
| T009 | Paso 9a por `$VERDICT` y Paso 9b nuevo | D-5 | ✓ |
| T010 | Paso 10: línea de veredicto y cierres | D-5 | ✓ |
| T011 | Objetivo, Posicionamiento, ciclo de vida y Salida | D-8 | ✓ |
| T012 | Template de fallback | D-2, D-3, D-4 | ✓ |
| T013 | README de story-analyze | D-8 | ✓ |
| T014 | Ejemplo `examples/output/analyze.md` | D-2, D-3, D-4, D-8 | ✓ |
| T015 | story-plan SKILL.md l.47 y l.63 | D-8 | ✓ |
| T016 | story-plan Paso 5: lectura de `verdict`, tabla de cuatro filas y guardia | D-6 | ✓ |
| T017 | story-plan Paso 6: resumen por veredicto, rama `--skip-analyze` y leyenda | D-6 | ✓ |
| T018 | story-plan: Manejo de errores y Salida | D-6, F-3 | ✓ |
| T019 | READMEs de story-plan | D-8 | ✓ |
| T020 | `plan-summary.md` de ejemplo | D-6, D-8 | ✓ |
| T021 | story-fix-plan SKILL.md l.138, l.148 y l.253 | D-7 | ✓ |
| T022 | `fix-plan-report-template.md` l.29 | D-7 | ✓ |
| T023 | Fixture `example-coherente` | D-3, D-8 | ✓ |
| T024 | Fixture `example-con-hallazgos` | D-3, D-8 | ✓ |
| T025 | Fixture `example-solo-testcases` | D-3, D-8 | ✓ |
| T026 | `state-machine.md` l.100 | D-8 | ✓ |
| T027 | FR-038 l.17-20 y `updated` | D-8 | ✓ |
| T028 | Evals de story-analyze (`version` 1.1.0, TC-006 nuevo) | D-9 | ✓ |
| T029 | Evals de story-plan (`version` 1.1.0, TC-006 y TC-007 nuevos) | D-9 | ✓ |
| T030 | Evals de story-fix-plan (`version` 1.0.1) | D-9 | ✓ |
| T031 | V-1 y V-2 | Contratos de verificación | ✓ |
| T032 | V-3 y V-8 | Contratos de verificación | ✓ |
| T033 | V-4 y V-5 | Contratos de verificación | ✓ |
| T034 | V-6 | Contratos de verificación | ✓ |
| T035 | V-7 | Contratos de verificación | ✓ |
| T036 | V-9 (conformidad C-1…C-6) | D-10, Contratos de verificación | ✓ |
| T037 | V-10 (gate determinista frente a la línea base) | Contratos de verificación | ✓ |
| T038 | V-11 (evals manuales, a criterio humano) | Contratos de verificación | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Regla de veredicto, escritura del reporte y transición (`skills/story-analyze/SKILL.md`) | Componentes afectados | T006–T012 | ✓ |
| Template del reporte de coherencia | Componentes afectados | T004, T005 | ✓ |
| Ficha y ejemplo de story-analyze | Componentes afectados | T013, T014 | ✓ |
| Evals de story-analyze | Componentes afectados | T028 | ✓ |
| Lectura del veredicto en el pipeline de planning (story-plan) | Componentes afectados | T015–T020, T029 | ✓ |
| Resumen y fixtures de story-fix-plan | Componentes afectados | T021–T025, T030 | ✓ |
| Documentación vigente (`state-machine.md`, FR-038) | Componentes afectados | T026, T027 | ✓ |
| Frontmatter de `analyze.md` (`verdict`) | Interfaces | T004, T008, T012 | ✓ |
| Sección `## Veredicto` | Interfaces | T005, T006, T008, T012 | ✓ |
| Confirmación de guardado `(verdict: <VALOR>)` | Interfaces | T009 | ✓ |
| Transición de `story.md` | Interfaces | T009, T011 | ✓ |
| Resumen de story-plan | Interfaces | T017, T020 | ✓ |
| Guardia de story-plan | Interfaces | T016, T018 | ✓ |

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente: cobertura de pruebas no evaluada.

Como referencia, los casos de eval que el diseño planifica (D-9, T028-T030) cubren las tres filas de AC-1 (TC-001, TC-006
y TC-004 de story-analyze) y las dos ramas de AC-2 (TC-006 y TC-007 de story-plan).

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-144` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-144` |

---

## Alineación con la Épica

**Épica padre:** EPIC-25-unificar-contrato-de-validaciones-en-skills

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` § Historias: «STORY-144 — Alinear story-analyze: Añadir veredicto y `verdict` (`APPROVED` / `NEEDS-CHANGES`) al reporte de coherencia» |
| Objetivo de la historia alineado con la épica | ✓ | El «Para…» (que story-plan y CI decidan sin interpretar el «Estado general») coincide con el Alcance («gate homogéneo que agentes, orquestadores y pipelines CI leen de la misma forma») y con la nota de Origen («`story-analyze` no declara veredicto, solo un «Estado general»»). Cubre CS-6 y contribuye a CS-2 y CS-3 |
| Restricciones de la épica respetadas | ✓ | Vocabulario `APPROVED` / `NEEDS-CHANGES` de los gates de planificación (Alcance, Notas); dependencia de STORY-138 (Habilitación secuencial), aplicada con T001 y D-11; no construye el bucle `NEEDS-CHANGES` (Notas, «Fuera de alcance»): `story-plan` solo sugiere `/story-fix-plan` (D-6); no reescribe artefactos históricos de `docs/specs/` (CS-10) |

---

## Inconsistencias Detectadas

Sin inconsistencias detectadas (ningún hallazgo de tipo A, B, C, D, E ni F).

Omisiones informativas, que no son hallazgos: la Correlación 6 no se evaluó porque `testcases.md` no existe.

---

## Recomendaciones

Observaciones de coherencia interna sin tipo A–F. No bloquean y no cuentan para el estado general:

1. **story.md, § Notas (l.62): el nombre `story-fix-changes` sigue en el texto.** CR-001 del diseño se aplicó solo al
   Non-Goal (l.56, cambio sin commitear). Además, el Non-Goal dice ahora «Crear `story-fix-plan`», pero ese skill ya
   existe (STORY-146, marcada `[x]` en la épica). Lo que queda fuera de alcance es **automatizar** el bucle. Acción:
   cambiar l.56 a «Automatizar el bucle `NEEDS-CHANGES` del flowchart de planificación (invocar `story-fix-plan` desde
   `story-plan`)» y l.62 a «`NEEDS-CHANGES` (pasa a `story-fix-plan` y vuelve a `story-analyze`)». Después, actualizar
   la descripción de CR-001 en `design.md` § Registro de Cambios, que todavía dice que el Non-Goal nombra
   `story-fix-changes`.
2. **story.md, CNF-1 (l.52): dice «los tipos de inconsistencia (A–D)».** `skills/story-analyze/SKILL.md` define los
   tipos A–F (tabla «Clasificación de severidad»), y el diseño congela A-F (§ Goals, l.63; D-1).
   Acción: cambiar «(A–D)» por «(A–F)» en CNF-1. No afecta al diseño.
3. **design.md, Context (fila `scripts/run-evals.js`) y D-9 (fila de alternativa «Afirmar el frontmatter del archivo
   generado»): la premisa es inexacta.** `buildPrompt` pide bloques `=== FILE: <ruta> ===` con el contenido simulado de
   los archivos (`scripts/run-evals.js` l.475), y `gradeOutput` califica toda la salida, bloques incluidos (l.648-664,
   llamada en l.719). Consecuencias: (a) TC-001 `"## Veredicto"` y TC-004 `` "**Veredicto:** `NEEDS-CHANGES`" `` solo
   pasan gracias a esos bloques, lo que contradice la justificación de D-9; (b) los `not_contains` también se aplican a
   los archivos simulados. Por ejemplo, el TC-006 de story-plan (`not_contains "READY-FOR-IMPLEMENT"`) fallaría si
   aparece cualquier `design.md` o `story.md` simulado que mencione ese estado. Acción: corregir la fila del Context y
   el motivo de rechazo de D-9 («el runner califica consola y bloques FILE»). Opcionalmente, valorar si conviene afirmar
   `verdict: APPROVED` del frontmatter directamente, y revisar los `not_contains` de TC-006 (story-plan) para que no
   choquen con el contenido de los archivos simulados. No afecta a AC-1, AC-2 ni CNF-1.

Antes de `/story-implement-tasks STORY-144`, verifica que STORY-138 ya publicó `docs/policies/validation-contract-policy.md`
(T001 detiene la historia si no existe).

---

## Cumplimiento DoD — Fase PLAN

DoD resuelto desde `sddf.config.yaml › guardrails.dod.story.plan` → `docs/guardrails/dod-story-plan.md` (`enforcement: error`).

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 es un «Esquema del escenario» con tres Ejemplos (ninguna / solo WARNING / al menos un ERROR); AC-2 usa Dado/Cuando/Entonces/Y/Pero |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | AC-1: D-1…D-4, D-7…D-11; AC-2: D-5, D-6; CNF-1: D-1, D-9 (ver «Cobertura de Criterios de Aceptación») |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | Goals, D-1…D-11 y «Esquema de datos» llevan `// satisface:`; las tablas de Componentes, Interfaces y Complejidad tienen columna «Satisface»; F-1…F-4 llevan `// AC-N`; V-1…V-11 tienen columna «Origen» |
| No hay decisiones de arquitectura aplazadas: toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | «Open Questions: Ninguna»; el destino del «Estado general» (Nota de la historia) se resuelve en D-4; la ambigüedad `story-fix-changes`/`story-fix-plan` queda en CR-001; la dependencia de la policy se trata en D-11 y en la cláusula «se aplica la versión publicada» de D-10 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md existe (38 tareas); testcases.md ausente |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | Cada tarea toca un archivo o una sección, o es una verificación de solo lectura. Las tres filas de AC-1 se recorren en T033 y las ramas de AC-2 en T035; las evals de cada fila están en T028 y T029 |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: testcases.md no existe |
