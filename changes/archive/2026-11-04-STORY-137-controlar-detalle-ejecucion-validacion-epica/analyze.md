---
type: analyze
id: STORY-137
slug: STORY-137-analyze-report
title: "Analyze: Controlar el detalle y los límites de la ejecución de la validación de épicas"
story: STORY-137
design: STORY-137
tasks: STORY-137
verdict: APPROVED
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-137-controlar-detalle-ejecucion-validacion-epica
---

<!-- Referencias -->
[[STORY-137-controlar-detalle-ejecucion-validacion-epica]]

# Reporte de Coherencia: Controlar el detalle y los límites de la ejecución de la validación de épicas

## Veredicto

**Veredicto:** `APPROVED` — sin inconsistencias

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (y CNF-1, CNF-2) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada: `testcases.md` no presente (modo `--only-tasks`) |
| Alineación tareas → diseño | ✓ | 24/24 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 9/9 componentes y 10/10 interfaces con tarea |
| Alineación con la épica EPIC-23-completar-flujo-de-epic | ✓ | Listada en la fase VALIDATE; cubre CS-10 junto con STORY-126 |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Detalle de salida según `--verbose` (salida completa frente a resumen); mismo veredicto y reporte | ✓ | C1, C4, C5; interfaces «Línea de resumen de comando», «Salida completa», «Motor, opción `--full-output`»; F1, F2; D-4…D-7 |
| AC-2 | `--mode auto` sin pruebas configuradas → fallo sin crear ni modificar archivos | ✓ | C2 (predicado «pruebas configuradas»), C3 (guardia), C7; «Orden de evaluación de la invocación»; F3; D-1…D-3 |
| AC-3 | `--dry-run --verbose` → indica que no se ejecutó ningún comando, sin escrituras | ✓ | C4 («Aviso sin comandos»), C7; F4; D-8 |
| CNF-1 | `--verbose` no altera veredicto, hallazgos ni reporte | ✓ | D-7 (`output` frente a `outputTail`), C5, nota de C7 |
| CNF-2 | Flags combinables, el orden no cambia el resultado | ✓ | C1, D-3, V-8 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Verificar precondiciones (skill, STORY-126, motor) | CR-002, CR-003 | ✓ |
| T002 | Crear `check-command` si el motor no existe | C5, CR-003 | ✓ |
| T003 | Prueba V-1 (`output` con y sin opción) | C6, V-1 | ✓ |
| T004 | Prueba V-2 (30 líneas, `outputTail` igual, `output: null`) | C6, V-2 | ✓ |
| T005 | Implementar `--full-output` en `check-command` | C5, D-4, D-5 | ✓ |
| T006 | `run --full-output` o registro para STORY-169 | C5, C6, V-3, CR-003 | ✓ |
| T007 | Ejecutar pruebas del motor | C6, V-1…V-3 | ✓ |
| T008 | Reconocer `--verbose` en el Paso 1 | C1, interfaz «Reconocimiento de `--verbose`» | ✓ |
| T009 | Predicado «pruebas configuradas» y regla por defecto | C2, D-1 | ✓ |
| T010 | Guardia C3 con mensaje y bloque de resultado | C3, interfaces «Guardia C3» y «Bloque de resultado ante C3», D-2, D-3 | ✓ |
| T011 | Orden de evaluación de la invocación | «Orden de evaluación de la invocación» | ✓ |
| T012 | Regla «Presentación de comandos» | C4, D-6…D-8, D-10 | ✓ |
| T013 | `--full-output` en cada invocación del motor | interfaz «Invocación del motor desde el skill» | ✓ |
| T014 | Política de efectos: fila del rechazo y nota de `--verbose` | C7 | ✓ |
| T015 | Parámetros, modos y salida del `SKILL.md` | C8 | ✓ |
| T016 | Evals V-4 y V-5 | C9, V-4, V-5 | ✓ |
| T017 | Eval V-6 | C9, V-6 | ✓ |
| T018 | Evals V-7 y V-8 | C9, V-7, V-8 | ✓ |
| T019 | Verificación posterior de dependencias | CR-002, CR-003 | ✓ |
| T020 | Mensajes literales y codificación | Interfaces (mensajes literales) | ✓ |
| T021 | `verify:layout`, `verify:validation-contract`, `verify:eval-inventory` | V-9, CS-21 | ✓ |
| T022 | `npm test` y `verify:repository` | V-9, CS-21 | ✓ |
| T023 | `graphify update .` | Regla del proyecto (`AGENTS.md › graphify`) | ✓ |
| T024 | Evals y recorrido manual pendientes de criterio humano | V-6, V-7; regla de evals de `AGENTS.md` | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| C1 Paso 1 «Argumentos» | Componentes | T008 | ✓ |
| C2 Predicado «pruebas configuradas» | Componentes | T009 | ✓ |
| C3 Guardia `--mode auto` sin pruebas | Componentes | T010, T011 | ✓ |
| C4 Regla «Presentación de comandos» | Componentes | T012, T013 | ✓ |
| C5 Opción `--full-output` del motor | Componentes | T002, T005, T006 | ✓ |
| C6 Pruebas del motor | Componentes | T003, T004, T006, T007 | ✓ |
| C7 Política de efectos | Componentes | T014 | ✓ |
| C8 Documentación del skill | Componentes | T015 | ✓ |
| C9 Casos de eval | Componentes | T016, T017, T018 | ✓ |
| Invocación | Interfaces | T008, T015 | ✓ |
| Reconocimiento de `--verbose` | Interfaces | T008 | ✓ |
| Predicado «pruebas configuradas» | Interfaces | T009 | ✓ |
| Regla del modo por defecto | Interfaces | T009 | ✓ |
| Guardia C3 | Interfaces | T010 | ✓ |
| Bloque de resultado ante C3 | Interfaces | T010 | ✓ |
| Línea de resumen de comando | Interfaces | T012 | ✓ |
| Salida completa | Interfaces | T012 | ✓ |
| Aviso sin comandos | Interfaces | T012 | ✓ |
| Motor, opción `--full-output` | Interfaces | T005, T006 | ✓ |
| Invocación del motor desde el skill | Interfaces | T013 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-23-completar-flujo-de-epic

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` § Historias, «Fase VALIDATE»: **STORY-137** — `--verbose` y rechazo de `--mode auto` sin pruebas configuradas |
| Objetivo de la historia alineado con la épica | ✓ | Cubre CS-10 junto con STORY-126 (`epic.md` § Notas, reparto de criterios). La tabla de flags de las Notas define `--mode auto` («falla si no hay tests configurados») y `--verbose` («salida completa de los comandos de prueba») tal como los diseña D-1 y C4 |
| Restricciones de la épica respetadas | ✓ | CS-7 («solo escribe `epic-validate-report.md`»): D-4 rechaza escribir la salida en `.tmp/` o en un log, y C7 declara que el rechazo de C3 y `--verbose` no escriben. CS-21 cubierto por T021 y T022 |

---

## Inconsistencias Detectadas

Sin inconsistencias detectadas.

---

## Recomendaciones

Sin acciones bloqueantes. Observaciones para el implementador y para el refinamiento de la épica:

1. `design.md` › «Flujos clave» F2 dice que el reporte con y sin `--verbose` es idéntico «salvo los campos volátiles de STORY-126 (fecha y duraciones)», mientras AC-1 dice «el contenido de epic-validate-report.md son los mismos». Es la misma precisión que STORY-126 registró en su CR-001 sobre las duraciones. Al aplicar ese CR en la épica, conviene extender la redacción a AC-1 de esta historia, y los evals V-4/V-5 (T016) deben comparar solo `verdict` y la ausencia de la marca, no el reporte byte a byte.
2. Aplicar los CR-001…CR-003 de `design.md` al refinar EPIC-23 (`/epic-refine`): la fila `auto`/1 y el V-6 de STORY-125, el error 1 y la T012 de STORY-126, y el contrato I1 del motor en STORY-169/125 con `--full-output`.
3. `testcases.md` no se generó (modo `--only-tasks`). Si se quiere habilitar `/story-implement`, ejecutar `/story-testcases STORY-137`.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-137` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-137` |

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 (Esquema del escenario con Ejemplos), AC-2 y AC-3 en bloques `gherkin` |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | Tabla «Cobertura de Criterios de Aceptación»: 3/3 |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | Columna «AC que satisface» en Componentes e Interfaces; `// satisface:` en Goals, Esquema de datos y Flujos; columna AC en Decisiones |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | La decisión abierta de la historia se resuelve en D-1; «Open Questions: Ninguna»; dependencias en CR-001…CR-003 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` presente |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | 24 tareas `T001…T024` con un único entregable cada una; AC-1 (T003–T008, T012, T013, T016), AC-2 (T009–T011, T017), AC-3 (T012, T018) |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: `testcases.md` no existe (modo `--only-tasks`) |
