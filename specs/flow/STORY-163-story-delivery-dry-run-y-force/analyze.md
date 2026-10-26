---
type: analyze
id: STORY-163
slug: STORY-163-analyze-report
title: "Analyze: story-delivery: --dry-run y --force"
story: STORY-163
design: STORY-163
tasks: STORY-163
verdict: APPROVED
created: 2026-10-25
updated: 2026-10-25
related:
  - STORY-163-story-delivery-dry-run-y-force
---

<!-- Referencias -->
[[STORY-163-story-delivery-dry-run-y-force]]

# Reporte de Coherencia: story-delivery: --dry-run y --force

## Veredicto

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo D

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (y 3/3 CNF) |
| Alineación tareas → diseño | ✓ | 21/21 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 6/6 componentes y 8/8 interfaces con tarea |
| Alineación con la épica EPIC-27-completar-flujo-de-story | ⚠️ | listada y alineada; el alcance de `--force` es más estrecho que la redacción de la épica (INC-001) |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ (uno no aplica: testcases.md ausente) |

> ⚠️ testcases.md no encontrado: la cobertura de ACs en casos de prueba (Correlación 6) se omitió. Los casos de prueba se especifican como evals en design.md › «Esquema de datos» (líneas 244–274) y en tasks.md T002–T003.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | `--dry-run` muestra la evaluación del DoD y la acción (escribiría `DELIVER/DONE` o el bloqueo y que `--force` permitiría seguir), sin cambiar archivos | ✓ | D-1 (l. 75), D-2 (l. 93), D-4 (l. 136), F-1 (l. 278), interfaz «Salida de previsualización», contratos 1–3 |
| AC-2 | `--force` desde `VERIFY/DONE` con DoD incumplido y confirmación → `DELIVER/DONE` + `updated` + `delivery-report.md` con estado previo, criterios incumplidos y fecha | ✓ | D-3 (l. 115), D-5 (l. 148), D-6 (l. 174), D-8 (l. 200), F-2 (l. 287), C-2, contrato 4 |
| AC-3 | Bloqueo sin `--force` sugiere `--force`, salvo rechazo de la confirmación | ✓ | D-7 (l. 182), F-3 (l. 295), contratos 5–6 |
| CNF-1 | `--dry-run` sin efectos, tampoco en `.tmp/` | ✓ | D-1, D-2, D-4, contratos 1 y 3 |
| CNF-2 | `--force` mantiene la confirmación humana | ✓ | D-3 (tabla, fila «Confirmación final»), D-8 |
| CNF-3 | Gate en verde | ✓ | Contrato 9 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Comprobar precondición CR-003 y anclar cambios a gates | CR-003, Risks | ✓ |
| T002 | Siete evals nuevos con IDs consecutivos | C-3, «Esquema de datos» | ✓ |
| T003 | TC-004 añade `--force` a `not_contains` | C-3, D-7 | ✓ |
| T004 | Frontmatter, `## Parámetros`, `## Modos de ejecución` | C-1, D-1, D-9 | ✓ |
| T005 | `## Restricciones / Reglas` (CNF-1, CNF-2, línea de sugerencia) | C-1, D-3, D-7 | ✓ |
| T006 | Paso 0b — Resolver modo, flag desconocido | C-1, D-1 | ✓ |
| T007 | Gate de estado por modo | C-1, D-2, D-3 | ✓ |
| T008 | `delivery-model` y DoD ausente fallan cerrado en todos los modos | C-1, D-3, F-5, CR-001 | ✓ |
| T009 | Comandos en dry-run solo con `--dry-run`, estado `⏸` | C-1, D-4 | ✓ |
| T010 | Decisión por modo, pregunta forzada, rechazo sin sugerencia | C-1, D-2, D-3, D-6, D-7 | ✓ |
| T011 | Template `delivery-report-template.md` | C-2, D-5 | ✓ |
| T012 | Escritura forzada: reporte → story.md con compensación | C-1, D-5, D-8, F-4 | ✓ |
| T013 | Paso 7 — Mostrar la previsualización | C-1, D-2 | ✓ |
| T014 | `## Salida` | C-1, D-9 | ✓ |
| T015 | README del skill | C-4 | ✓ |
| T016 | `domain-story-lifecycle.md` §4.3 «Entrega forzada» | C-5, CR-002 | ✓ |
| T017 | `sddf-commands-pipeline.md` fila `deliver` | C-6 | ✓ |
| T018 | Verificación manual de CNF-1 con `git status --porcelain` | Contratos 1 y 3 | ✓ |
| T019 | `npm test` y `npm run verify:repository` | Contratos 7 y 9 | ✓ |
| T020 | `npm run test:eval -- story-delivery` (manual) | Contratos 1–6 | ✓ |
| T021 | `graphify update .` | Regla de `AGENTS.md` (mantener grafo) | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| C-1 Skill `story-delivery` | Componentes afectados (l. 60) | T004–T010, T012–T014 | ✓ |
| C-2 Template del reporte | Componentes afectados | T011 | ✓ |
| C-3 Evals del skill | Componentes afectados | T002, T003 | ✓ |
| C-4 README del skill | Componentes afectados | T015 | ✓ |
| C-5 Ciclo de vida de story | Componentes afectados, CR-002 | T016 | ✓ |
| C-6 Guía del pipeline | Componentes afectados | T017 | ✓ |
| Invocación / flag desconocido | Interfaces (l. 231) | T004, T006 | ✓ |
| Modo resuelto | Interfaces | T006 | ✓ |
| Lista de bloqueos | Interfaces, Esquema de datos | T007, T010 | ✓ |
| Confirmación final forzada | Interfaces | T010 | ✓ |
| Salida de previsualización | Interfaces | T013 | ✓ |
| Sugerencia de override | Interfaces | T005, T007, T010 | ✓ |
| Escritura forzada | Interfaces | T012 | ✓ |
| Template | Interfaces | T011, T012 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-27-completar-flujo-de-story

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` línea 33 (`STORY-163`) |
| Objetivo de la historia alineado con la épica | ✓ | Cubre la parte «`--force` y `--dry-run`» del alcance (`epic.md` línea 22), CS-2 (línea 45) y SMOKE-2 (línea 61) |
| Restricciones de la épica respetadas | ⚠️ | La transición terminal sigue con confirmación humana (línea 26, CNF-2 ✓). La épica (línea 31) dice que `--force` escribe `DELIVER/DONE` «sin importar el estado previo ni el DoD»; design.md D-3 (l. 115) no omite el DoD **ausente** ni `delivery-model` inválido (INC-001) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D: desalineación con la épica
- **Descripción:** `epic.md` línea 31 describe `--force` como «sin importar el estado previo ni el DoD». design.md D-3 (líneas 115–134) y CR-001 (línea 358) limitan `--force` al gate de estado y al de DoD **incumplido**: un DoD ausente o sin criterios y un `delivery-model` inválido siguen fallando cerrado. La decisión es coherente con story.md («cuando el estado previo o el DoD la bloquean») y está justificada (sin DoD el reporte no tendría criterios que listar), pero la redacción de la épica es más amplia.
- **Archivo afectado:** `specs/flow/EPIC-27-completar-flujo-de-story/epic.md` — sección «Historias», línea 31; `design.md` — D-3
- **Acción requerida:** confirmar el alcance de D-3 con el responsable de la épica. Si se mantiene, precisar la frase de la épica en el próximo refinamiento («sin importar el estado previo ni el DoD incumplido»). No bloquea la implementación.

---

## Recomendaciones

1. INC-001: mantener D-3 y, en el siguiente refinamiento de EPIC-27, ajustar la línea 31 de `epic.md` para que diga «DoD incumplido». Si el responsable quiere que `--force` cubra también el DoD ausente, actualizar D-3, D-7 y T008 antes de implementar.
2. (Mejora, sin hallazgo) tasks.md T012 pide «mover al Paso 5» la comprobación del template, pero T010 (Paso 5) no la menciona. Al implementar, hacer la comprobación del template en T010, antes de la pregunta final forzada, como pide design.md F-4 (línea 299).
3. (Mejora, sin hallazgo) si se quiere habilitar `/story-implement` además de `/story-implement-tasks`, ejecutar `/story-testcases STORY-163`: los siete casos del esquema de datos de design.md ya sirven de base.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-163` no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-163` |

Precondición de orden (design.md CR-003): implementar después de STORY-159.

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin que cubren los escenarios principales | ✓ | — | AC-1 (Escenario + Ejemplos), AC-2 y AC-3 en bloques `gherkin` con Dado/Cuando/Entonces |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño por criterio | ✓ | — | Tabla «Cobertura de Criterios de Aceptación» de este reporte |
| Todos los elementos de diseño tienen trazabilidad explícita (`// satisface: AC-N`) | ✓ | — | Encabezados D-1…D-9 y «Esquema de datos» con `// satisface:`; columna «AC / CNF» en Componentes e Interfaces; flujos F-1…F-3 anotados |
| No hay decisiones de arquitectura aplazadas | ✓ | — | «Open Questions» (l. 344): ninguna bloqueante; ambigüedades resueltas en D-2…D-6 y CR-001…CR-004; IDs de evals con regla fija |
| Existe tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente |
| Si tasks.md existe, contiene únicamente tareas atómicas para todos los escenarios principales | ✓ | — | 21 tareas con criterio «Hecho:»; AC-1 → T002, T007, T009, T013; AC-2 → T002, T010–T012; AC-3 → T003, T005, T007, T010 |
| Si testcases.md existe, contiene pruebas para todos los escenarios principales | ✓ | — | No aplica: testcases.md ausente (modo `--only-tasks`) |
