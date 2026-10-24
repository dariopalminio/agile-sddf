---
type: analyze
id: STORY-141
slug: STORY-141-analyze-report
title: "Analyze: Alinear story-code-review"
story: STORY-141
design: STORY-141
tasks: STORY-141
created: 2026-10-17
updated: 2026-10-17
related:
  - STORY-141-alinear-story-code-review
---

<!-- Referencias -->
[[STORY-141-alinear-story-code-review]] · [[STORY-141-alinear-story-code-review-design]] · [[STORY-141-alinear-story-code-review-tasks]] · [[EPIC-25-unificar-contrato-de-validaciones-en-skills]]

# Reporte de Coherencia: Alinear story-code-review

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 2/2 criterios cubiertos (más CNF-1) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada: testcases.md no está presente |
| Alineación tareas → diseño | ✓ | 34/34 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 17/17 elementos con tarea (11 componentes + 6 interfaces) |
| Alineación con la épica EPIC-25-unificar-contrato-de-validaciones-en-skills | ⚠️ | Listada en la épica y cubre CS-7. El inventario de D-8 no recoge tres líneas con `approved` en la documentación vigente (CS-10) |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

**Estado general:** ⚠️ Advertencias (0 ERROR, 3 WARNING)

> Medición en el filesystem (2026-10-17): el «Estado medido» del diseño coincide con los archivos. Se comprobaron `code-review-report-template.md` (l.5, l.22, l.68, l.70), `fix-directives-template.md` (l.5, l.17), `story-code-review/SKILL.md` (670 líneas; regla en l.384-392), `story-implement-tasks/SKILL.md` l.69, `story-implement/evals/evals.json` l.1143, la l.25 de las dos copias del DoD CODE-REVIEW, las versiones de los tres `evals.json` (1.0.0, 1.0.0, 1.3.0) y los 16 casos de `story-code-review`. `docs/policies/validation-contract-policy.md` todavía no existe; T001 detiene la historia hasta que STORY-138 lo publique.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | `code-review-report.md` tiene `## Veredicto` como primera sección tras el título y `verdict` en el frontmatter, con `APPROVED` (sin hallazgos bloqueantes) o `NEEDS-CHANGES` (al menos uno bloqueante) | ✓ | D-1 (tabla de veredicto y definición de «bloqueante»), D-2 (`verdict` en el frontmatter), D-3 (`## Veredicto` al inicio y motivo determinista), D-6 (consola), D-9 (TC-001/TC-002 por fila de los Ejemplos), D-11; «Esquema de datos»; interfaces «`verdict` en `code-review-report.md`», «Línea de veredicto» y «Confirmación de consola»; flujos F-1 y F-2; V-2…V-4, V-6 |
| AC-2 | Con `NEEDS-CHANGES`, `fix-directives.md` se aplica igual que antes, y ni el reporte ni `fix-directives.md` contienen `review-status` ni `approved` | ✓ | D-2, D-4 (inserción solo de `## Hallazgos`), D-5 (`fix-directives.md` sin campo de veredicto), D-7 (consumidores sin cambio de lógica), D-9 (evals de los consumidores), D-10 (excepción de subagentes); interfaces «Presencia de `fix-directives.md`» y «Contenido leído de `fix-directives.md`»; flujos F-2 y F-3; V-1, V-5, V-7, V-8 |
| CNF-1 | La regla de severidad y la de hallazgo bloqueante no cambian | ✓ | D-1 («Sin cambios»: 4a, 4b y la severidad DoD de 4c.1); F-3; V-6 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Comprobar que existe la policy y leer las secciones aplicables | D-11 | ✓ |
| T002 | Confirmar el «Estado medido» con `grep` | Context, D-7, D-8 | ✓ |
| T003 | Línea base de `verify:repository` y `npm test` | V-11 | ✓ |
| T004 | Template del reporte: `review-status` → `verdict` | D-2 | ✓ |
| T005 | Template del reporte: `## Veredicto` al inicio; sin fila `Review status` ni `## Decisión final` | D-3 | ✓ |
| T006 | `fix-directives-template.md` sin `review-status`; líneas 17 y 41 | D-5 | ✓ |
| T007 | `SKILL.md` 4c: «Derivar el veredicto» con la tabla de D-1 | D-1 | ✓ |
| T008 | `SKILL.md` 4c.1 y 4c.2: `$VERDICT` | D-1 | ✓ |
| T009 | `SKILL.md` 4d-4h: condiciones, etiquetas de rama y mensaje de 4g | D-1, D-5, D-6 | ✓ |
| T010 | `SKILL.md` 5b: frontmatter, `## Veredicto`, inserción de `## Hallazgos` y confirmación | D-3, D-4, D-6 | ✓ |
| T011 | `SKILL.md` Pasos 6 y 7: condiciones y líneas `Veredicto:` | D-6 | ✓ |
| T012 | `SKILL.md` Objetivo, Posicionamiento y Salida | D-8 | ✓ |
| T013 | `README.md` de story-code-review l.11 y l.16 | D-8 | ✓ |
| T014 | `example-approved/code-review-report.md` con la forma nueva | D-2, D-3, D-8 | ✓ |
| T015 | `example-needs-changes/fix-directives.md` | D-5, D-8 | ✓ |
| T016 | `example-needs-changes-medium/fix-directives.md` | D-5, D-8 | ✓ |
| T017 | `story-implement-tasks/SKILL.md` l.69 | D-7, D-8 | ✓ |
| T018 | `story-implement/README.md` l.21 | D-7, D-8 | ✓ |
| T019 | l.25 de las dos copias del DoD CODE-REVIEW | D-8 | ✓ |
| T020 | `sddf-commands-pipeline.md` l.225, l.231, l.232, l.234 | D-8 | ✓ (ver INC-001: falta l.224) |
| T021 | `state-machine.md` l.49, l.102 y `domain-story-lifecycle.md` l.98, l.116 | D-8 | ✓ (ver INC-001: faltan l.48 y l.97) |
| T022 | Fila de excepción en §6 de la policy, versión menor e historial | D-10, D-11 | ✓ |
| T023 | `story-code-review/evals/evals.json` según la tabla de D-9 | D-9 | ✓ |
| T024 | `story-implement-tasks/evals/evals.json` TC-004 | D-9 | ✓ |
| T025 | `story-implement/evals/evals.json` TC-016 | D-9 | ✓ |
| T026 | V-1: `grep` de valores heredados | V-1 | ✓ (ver INC-001 e INC-002) |
| T027 | V-2, V-3, V-4 sobre el template | V-2, V-3, V-4 | ✓ |
| T028 | V-5 sobre `fix-directives-template.md` | V-5 | ✓ |
| T029 | V-6, V-7: `git diff` de `SKILL.md` y recorrido de los Ejemplos de AC-1 | V-6, V-7 | ✓ |
| T030 | V-8: consumidores sin cambio de lógica; recorrido de F-2 | V-8 | ✓ |
| T031 | V-9: excepción y versión de la policy | V-9 | ✓ |
| T032 | V-10: conformidad C-1…C-7 | V-10, D-11 | ✓ |
| T033 | V-11: gate determinista y `git status` | V-11 | ✓ |
| T034 | V-12: evals manuales a criterio humano | V-12 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Template del reporte de revisión | Componentes afectados; D-2, D-3 | T004, T005, T027 | ✓ |
| Template de directivas de corrección | Componentes afectados; D-5 | T006, T028 | ✓ |
| Árbitro y salida del skill (`SKILL.md`) | Componentes afectados; D-1, D-4, D-6, D-8 | T007…T012, T029 | ✓ |
| README del skill | Componentes afectados; D-8 | T013 | ✓ |
| Ejemplos del skill | Componentes afectados; D-8 | T014, T015, T016 | ✓ |
| Evals del skill | Componentes afectados; D-9 | T023 | ✓ |
| Consumidor `story-implement-tasks` | Componentes afectados; D-7, D-9 | T017, T024, T030 | ✓ |
| Consumidor `story-implement` | Componentes afectados; D-7, D-9 | T018, T025, T030 | ✓ |
| DoD CODE-REVIEW y su semilla | Componentes afectados; D-8 | T019 | ✓ |
| Documentación del ciclo | Componentes afectados; D-8 | T020, T021 | ✓ (inventario incompleto, INC-001) |
| Excepciones de la policy | Componentes afectados; D-10 | T022, T031 | ✓ |
| Interfaz `verdict` en `code-review-report.md` | Interfaces | T004, T010, T027 | ✓ |
| Interfaz «Línea de veredicto» | Interfaces | T005, T010, T029 | ✓ |
| Interfaz «Presencia de `fix-directives.md`» | Interfaces | T006, T009, T030 | ✓ |
| Interfaz «Contenido leído de `fix-directives.md`» | Interfaces | T006, T028, T030 | ✓ |
| Interfaz «Informe parcial de subagente» (sin cambios) | Interfaces; D-4 | T010, T029, T033 | ✓ |
| Interfaz «Confirmación de consola» | Interfaces; D-6 | T010, T023 | ✓ |

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada.

La cobertura de los ACs en pruebas está en las evals (D-9, T023-T025) y en los contratos V-1…V-12 (T026-T034). Para habilitar `/story-implement`, ejecuta `/story-testcases STORY-141`.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-141` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-141` |

---

## Alineación con la Épica

**Épica padre:** EPIC-25-unificar-contrato-de-validaciones-en-skills

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` § Historias: «STORY-141 — Alinear story-code-review: Reemplazar `review-status` por `verdict` y normalizar los valores a `APPROVED` / `NEEDS-CHANGES`» |
| Objetivo de la historia alineado con la épica | ✓ | El «Para» (que `story-implement-tasks` y CI decidan sin depender de `review-status`) coincide con el Alcance («gate homogéneo que agentes, orquestadores y pipelines CI leen de la misma forma»). Cubre CS-7 y contribuye a CS-2 y CS-3 (`## Veredicto` primero y `verdict` en el template) |
| Restricciones de la épica respetadas | ⚠️ | Se respetan el vocabulario de ejecución (`APPROVED` / `NEEDS-CHANGES`, sin `BLOCKED`, D-1), la habilitación secuencial tras STORY-138 (T001; STORY-138 está en `READY-FOR-IMPLEMENT/DONE` y la policy aún no existe) y la exclusión de `docs/specs/` (Non-Goals). Para CS-10 quedan dos desviaciones: líneas de documentación vigente fuera del inventario (INC-001) y la excepción de subagentes, registrada en D-10 y CR-002 para que STORY-143 la resuelva |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D (desalineación con la épica; CS-10 y SMOKE-3)
- **Descripción:** el inventario de D-8 no recoge tres líneas de la documentación vigente que contienen el valor `approved`:
  - `docs/architecture/state-machine.md` l.48: `CR --> VERIFY : approved`
  - `docs/domains/domain-story-lifecycle.md` l.97: `CR --> VERIFY : approved`
  - `docs/guides/sddf-commands-pipeline.md` l.224: `story-implement | story-implement-tasks → story-code-review → approved`

  D-8 lista solo l.49 y l.102 de `state-machine.md`, l.98 y l.116 de `domain-story-lifecycle.md` y l.225, l.231, l.232 y l.234 de la guía, y T020/T021 copian esas líneas. Si la implementación sigue los números de línea al pie de la letra, V-1 (T026) devolverá estas tres líneas y fallará. Además, la documentación seguiría mostrando `approved` en los diagramas de estados y en el pipeline, en contra de CS-10.
- **Archivo afectado:** design.md — sección «D-8 — Inventario de cambios en textos» y la fila «Documentación vigente» del «Estado medido»; tasks.md — T020 y T021
- **Acción requerida:** añadir las tres líneas a D-8 (`approved` → `APPROVED`) y a T020/T021.

### INC-002 [WARNING]

- **Tipo:** C (contrato de verificación incompleto frente al alcance de la búsqueda)
- **Descripción:** el `grep` de V-1 (`\bapproved\b|needs-changes`) también encuentra el `slug` de los `story.md` de ejemplo: `skills/story-code-review/examples/example-approved/story.md` l.4 (`STORY-000-example-approved`) y `skills/story-code-review/examples/example-needs-changes/story.md` l.4 (`STORY-000-example-needs-changes`). El resultado esperado de V-1 solo admite `agents/*.agent.md`, `examples/*/*-report.md` y los `name` de evals con `needs-changes`. Ninguna tarea modifica esos `story.md` y ninguna decisión los clasifica como excepción. T026 fallará con un resultado que el diseño no prevé.
- **Archivo afectado:** design.md — sección «Contratos de verificación», fila V-1; «D-10»; tasks.md — T026
- **Acción requerida:** decidir si los identificadores de los ejemplos (`slug` y nombres de directorio `example-approved` / `example-needs-changes*`) son identificadores kebab-case, como los `name` de evals, o valores de veredicto. Después, ampliar el resultado esperado de V-1 y T026 o añadir una tarea que los renombre.

### INC-003 [WARNING]

- **Tipo:** C (ambigüedad en el alcance de la excepción)
- **Descripción:** el patrón de la excepción de D-10, `examples/*/*-report.md`, también coincide con `examples/example-approved/code-review-report.md`. Ese archivo es el reporte del árbitro, y T014 lo modifica para que no contenga `review-status` ni `approved`. V-1 (T026) y la fila de §6 que escribe T022 lo excluirían de la búsqueda con ese patrón. Un `approved` que quede en el ejemplo pasaría V-1 sin detectarse, y STORY-143 heredaría una excepción más amplia que la intención de D-10, que son los informes de subagentes.
- **Archivo afectado:** design.md — «D-10» (columna «Elemento conservado») y fila V-1 de «Contratos de verificación»; tasks.md — T022 y T026
- **Acción requerida:** restringir el patrón a los informes de subagentes (`examples/*/{tech-lead,product-owner,integration,security}-report.md`) o excluir `code-review-report.md` de forma explícita, tanto en D-10/T022 como en V-1/T026.

---

## Recomendaciones

1. **INC-001:** en `design.md`, sección D-8, añade `docs/architecture/state-machine.md` l.48, `docs/domains/domain-story-lifecycle.md` l.97 y `docs/guides/sddf-commands-pipeline.md` l.224 con el cambio `approved` → `APPROVED`. Actualiza también la fila «Documentación vigente» del «Estado medido» y las tareas T020 (l.224) y T021 (l.48 y l.97).
2. **INC-002:** en `design.md`, fila V-1, añade al resultado esperado «los `slug` de `examples/*/story.md` y los nombres de directorio de los ejemplos», con la misma justificación que los `name` de evals (identificadores kebab-case). Replica el cambio en T026 y deja constancia en CR-002 para que STORY-143 aplique el mismo criterio en SMOKE-3.
3. **INC-003:** en `design.md`, D-10 y V-1, sustituye `examples/*/*-report.md` por la lista explícita de informes de subagentes (o añade «salvo `code-review-report.md`»). Replica el cambio en T022 (texto de la fila de §6) y en T026.
4. **Opcional:** ejecuta `/story-testcases STORY-141` para habilitar `/story-implement`, o `/story-fix-plan STORY-141` para aplicar las recomendaciones 1-3 sobre `design.md` y `tasks.md`.

---

## Cumplimiento DoD — Fase PLAN

DoD: `docs/guardrails/dod-story-plan.md` (resuelto por `sddf.config.yaml › guardrails.dod.story.plan`), `enforcement: error`.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 (Esquema del escenario con dos Ejemplos) y AC-2 (escenario alternativo), ambos en bloques `gherkin` |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | AC-1: D-1, D-2, D-3, D-6; AC-2: D-4, D-5, D-7, D-10; CNF-1: D-1 |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | D-1…D-11, Goals y «Esquema de datos» llevan `// satisface: AC-N`. Las tablas «Componentes afectados», «Interfaces» y «Decisiones de complejidad justificada» tienen columna «Satisface». F-1 y F-2 citan su fila de AC; F-3 y F-4 son flujos de degradación y de cambio, no componentes |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | «Open Questions: Ninguna». La dependencia de la policy publicada se resuelve con D-11 (gana el texto publicado y la diferencia se anota). Las dudas de alcance de CS-10 están registradas en CR-001 y CR-002 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` presente (34 tareas) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | Cada tarea edita un archivo o una sección y cita su decisión y su AC. Las dos filas de AC-1 se recorren en T029 y AC-2 en T028 y T030. T023 es la más extensa, pero edita un solo archivo y se valida con una única comprobación de JSON |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: testcases.md no existe |
