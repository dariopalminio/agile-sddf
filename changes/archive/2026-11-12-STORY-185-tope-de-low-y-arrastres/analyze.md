---
type: analyze
id: STORY-185
slug: STORY-185-analyze-report
title: "Analyze: Tope de LOW por revisor y sin arrastres entre rondas"
story: STORY-185
design: STORY-185
tasks: STORY-185
verdict: APPROVED
created: 2026-11-08
updated: 2026-11-08
related:
  - STORY-185-tope-de-low-y-arrastres
---

<!-- Referencias -->
[[STORY-185-tope-de-low-y-arrastres]]

# Reporte de Coherencia: Tope de LOW por revisor y sin arrastres entre rondas

## Veredicto

**Veredicto:** `APPROVED` — sin inconsistencias de planificación tras acotar AC-2 a revisiones con registro previo.

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 2/2 criterios cubiertos |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada: el archivo no existe |
| Alineación tareas → diseño | ✓ | 29/29 tareas trazables |
| Cobertura diseño → tareas | ✓ | 16/16 componentes e interfaces con tarea |
| Alineación con EPIC-28 | ✓ | Historia listada; objetivo y restricciones respetados |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios satisfechos; `enforcement: error` |

**Fuentes:** [story.md](story.md), [design.md](design.md), [tasks.md](tasks.md), [epic.md](../EPIC-28-calibrar-story-code-review-con-review-md/epic.md), [DoD PLAN](../../../docs/guardrails/dod-story-plan.md) y [política de validación](../../../docs/policies/validation-contract-policy.md).

**Template usado:** [analyze-report-template.md](../../../.codex/skills/story-analyze/assets/analyze-report-template.md), con las secciones de cobertura de testcases y vía de implementación requeridas por el skill.

**DoD resuelto:** `sddf.config.yaml › guardrails.dod.story.plan: dod-story-plan`; siete criterios de [dod-story-plan.md](../../../docs/guardrails/dod-story-plan.md), `enforcement: error`.

Este análisis revisa contratos de planificación. Los evals y pruebas descritos aún son tareas pendientes; no se ejecutaron ni se atribuye a un informe legado una comparación histórica. El análisis anterior se preservó en `analyze.md.bak` antes de regenerar este reporte.

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Tope de 3 LOW por revisor desde `REVIEW.md`, o 5 por defecto, con recuento de omitidos | ✓ | C-2 a C-5, I-1/I-8/I-9, D-4 a D-7 y F-1 ([design.md](design.md), líneas 66-69, 79, 137-185 y 274-282) |
| AC-2 | Con `code-review-lows.json` previo, omitir LOW de líneas sin cambios, reevaluar líneas modificadas y conservar HIGH/MEDIUM; sin registro previo, tope, aviso y registro actual | ✓ | C-1/C-2/C-5/C-6, I-2 a I-9, D-1 a D-4, D-7/D-8, F-2 a F-4 y F-6 ([design.md](design.md), líneas 65-70, 80-87, 91-148, 177-204 y 284-319) |

El escenario legado de [story.md](story.md), líneas 58-63, coincide con D-2/D-4 y F-4/F-6: no hay omisión por arrastre sin registro anterior, y el registro que se escribe al cerrar sirve en la siguiente ronda. D-8.7/D-8.9 y T008/T019/T028 cubren el contrato y el recorrido, sin conservar TC-047 ni un extractor de código histórico. CNF-1 se traza a I-8/I-9, D-6, T017/T018/T021 y D-8.9; CNF-2 a D-7, T004-T008 y el contrato de verificación 7.

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Comprobar integración con STORY-180 | Context, I-1 y D-4 | ✓ |
| T002 | Resolver integración con hermanas y numeración | Context, D-4/D-6/D-9 y CR-001 | ✓ |
| T003 | Reservar cinco IDs de eval | C-5 y D-7 | ✓ |
| T004 | Eval de tope declarado | C-5, D-7 y F-1 | ✓ |
| T005 | Evals de ambos topes por defecto | C-5, D-7 y F-1 | ✓ |
| T006 | Evals de arrastre con registro y línea cambiada | C-5, D-7, F-2/F-3 | ✓ |
| T007 | Pruebas del motor en RED | C-6, D-8.1 a D-8.8 | ✓ |
| T008 | Prueba del contrato y aviso legado en RED | C-6, D-8.9 y F-6 | ✓ |
| T009 | Parser de ubicación | C-1, I-7 y D-9 | ✓ |
| T010 | Huella normalizada | C-1, I-7 y D-1 | ✓ |
| T011 | Ubicación y clasificación de entradas | C-1, I-5/I-7 y D-3 | ✓ |
| T012 | Crear el registro de huellas | C-1, I-2/I-4/I-7 y esquema de datos | ✓ |
| T013 | Comparar registro y solapamientos | C-1, I-3/I-5/I-6/I-7 | ✓ |
| T014 | CLI `compare`/`record` | C-1, I-3/I-4/I-7 y D-8.8 | ✓ |
| T015 | Declarar entradas y motor en el skill | C-2, I-2 y D-2 | ✓ |
| T016 | Aplicar arrastre comprobado, caso legado y tope | C-2, I-1/I-5/I-6/I-8 y D-4 | ✓ |
| T017 | Mantener severidad y DoD | C-2, I-8 y D-4 | ✓ |
| T018 | Rellenar tablas y estado de LOW | C-2/C-3, I-9 y D-6 | ✓ |
| T019 | Registrar LOW al cerrar toda ronda | C-1/C-2, I-2/I-4 y D-2/F-6 | ✓ |
| T020 | Comunicar resultado y errores | C-2, I-6/I-9 y F-4 | ✓ |
| T021 | Añadir fila de control de LOW a la plantilla | C-3, I-9 y D-6 | ✓ |
| T022 | Ordenar LOW en los cuatro revisores | C-4 y D-5 | ✓ |
| T023 | Actualizar README | C-7 | ✓ |
| T024 | Verificar pruebas del motor y compatibilidad | C-6, D-8 y contratos 3 a 6 | ✓ |
| T025 | Comprobar UTF-8 sin BOM | C-1 a C-7 y restricción de encoding | ✓ |
| T026 | Ejecutar gates de repositorio | Context, contrato de verificación 8 | ✓ |
| T027 | Recorrer AC-1 | F-1 y contratos 1-2 | ✓ |
| T028 | Recorrer AC-2 con registro y caso legado | F-2/F-3/F-4/F-6 y contratos 3-4 | ✓ |
| T029 | Actualizar grafo tras cambios de código | Context y regla de `AGENTS.md` | ✓ |

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| C-1 Motor de huellas | Componentes afectados | T009-T014 | ✓ |
| C-2 Orquestador | Componentes afectados | T015-T020 | ✓ |
| C-3 Plantilla del informe | Componentes afectados | T018/T021 | ✓ |
| C-4 Agentes revisores | Componentes afectados | T022 | ✓ |
| C-5 Evals del skill | Componentes afectados | T003-T006 | ✓ |
| C-6 Prueba del motor y contrato | Componentes afectados | T007/T008/T024 | ✓ |
| C-7 README del skill | Componentes afectados | T023 | ✓ |
| I-1 Tope y procedencia | Interfaces | T001/T016 | ✓ |
| I-2 Registro de LOW | Interfaces | T012/T019/T020 | ✓ |
| I-3 CLI `compare` | Interfaces | T013/T014/T016 | ✓ |
| I-4 CLI `record` | Interfaces | T012/T014/T019 | ✓ |
| I-5 Salida de `compare` | Interfaces | T006/T013/T016 | ✓ |
| I-6 Códigos de motivo | Interfaces | T013/T016/T020 | ✓ |
| I-7 Funciones exportadas | Interfaces | T009-T014 | ✓ |
| I-8 Marcas internas | Interfaces | T016/T017 | ✓ |
| I-9 Estado y nota por revisor | Interfaces | T018/T020/T021 | ✓ |

## Alineación con la Épica

**Épica padre:** [EPIC-28](../EPIC-28-calibrar-story-code-review-con-review-md/epic.md).

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | [epic.md](../EPIC-28-calibrar-story-code-review-con-review-md/epic.md), línea 37, incluye STORY-185 |
| Objetivo de la historia alineado | ✓ | Reducir ruido sin perder señal coincide con el Objetivo de la épica, líneas 14-17, y con el control de LOW de CS-4 |
| Restricciones respetadas | ✓ | La historia preserva el contrato del informe (CNF-1/CS-2), limita LOW (AC-1/CS-4) y escribe evals antes del skill (CNF-2/CS-8) |

La frase de la épica que resume STORY-185 es más amplia que la precondición nueva de AC-2; el criterio de salida CS-4 exige el tope de LOW y no exige verificar arrastres legados. La precisión añadida en [story.md](story.md), líneas 45-63 y 82-84, mantiene el objetivo de control de ruido y deja explícito el límite de evidencia.

## Inconsistencias Detectadas

Sin inconsistencias detectadas. **INC-001 del análisis anterior queda resuelta en planificación:** [story.md](story.md), líneas 45-63 y 82-84, exige comparar solo con registro previo y define el caso legado; [design.md](design.md), líneas 104-109, 137-148 y 296-319, aplica exactamente esa distinción; [tasks.md](tasks.md), T016/T019/T020/T028, líneas 52, 55-56 y 70, la materializa. El registro anterior no se reconstruye ni se afirma que un informe legado pruebe código pasado.

## Recomendaciones

Ninguna corrección de planificación pendiente. Implementar las tareas con TDD; las pruebas y evals descritos siguen sin ejecutar.

## Cobertura de ACs en Testcases

⚠️ `testcases.md` no existe — la correlación de cobertura de testcases se omite. [tasks.md](tasks.md), T004-T008 y T024/T027/T028, define las pruebas y recorridos futuros; su existencia en el plan no cuenta como ejecución.

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado por artefactos |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-185` no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-185` disponible |

## Cumplimiento DoD — Fase PLAN

Fuente: [dod-story-plan.md](../../../docs/guardrails/dod-story-plan.md), líneas 20-26; `enforcement: error`.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios Gherkin para los escenarios principales | ✓ | — | [story.md](story.md), líneas 30-64: tope con tres ejemplos y AC-2 con registro previo y caso legado |
| design.md existe y cubre todos los ACs | ✓ | — | AC-1: D-4/D-6/D-7/F-1; AC-2: D-1 a D-4, F-2 a F-4 y F-6 ([design.md](design.md), líneas 91-148 y 274-319) |
| Todos los elementos de diseño tienen trazabilidad explícita al AC | ✓ | — | Componentes C-1 a C-7 e interfaces I-1 a I-9 citan ACs; D-1 a D-9 llevan `// satisface: AC-N` ([design.md](design.md), líneas 65-87 y 91-211) |
| No hay decisiones de arquitectura aplazadas | ✓ | — | D-2/D-4 fijan el caso sin registro y CR-002 registra el cambio de alcance ([design.md](design.md), líneas 104-109, 137-148 y 370-374) |
| Existe tasks.md o testcases.md o ambos | ✓ | — | [tasks.md](tasks.md) existe con T001-T029 |
| Si tasks.md existe, contiene tareas atómicas para escenarios principales | ✓ | — | T004-T008 cubren pruebas; T009-T023 implementan contratos; T027/T028 recorren ambos AC ([tasks.md](tasks.md), líneas 34-70) |
| Si testcases.md existe, contiene pruebas para escenarios principales | ✓ | — | Condición no activada: testcases.md no existe y tasks.md sí; no se atribuye cobertura de testcases |

No se ejecutaron `npm test`, `npm run verify:repository` ni evals en este análisis: son verificaciones previstas para la implementación. Con `APPROVED`, [story.md](story.md) pasa a `READY-FOR-IMPLEMENT/DONE` conforme al flujo de `/story-analyze`.
