---
type: analyze
id: STORY-158
slug: STORY-158-analyze-report
title: "Analyze: Migrar los skills de revisión, verificación y aceptación a specs/flow"
story: STORY-158
design: STORY-158
tasks: STORY-158
verdict: APPROVED
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-158-migrar-skills-verificacion-specs-flow
---

<!-- Referencias -->
[[STORY-158-migrar-skills-verificacion-specs-flow]]

# Reporte de Coherencia: Migrar los skills de revisión, verificación y aceptación a specs/flow

## Veredicto

**Veredicto:** `APPROVED` — sin inconsistencias

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 2/2 criterios cubiertos (más CNF-1 y CNF-2) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada — testcases.md no presente (modo `--only-tasks`) |
| Alineación tareas → diseño | ✓ | 19/19 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 19/19 elementos con tarea (11 componentes + 8 interfaces) |
| Alineación con la épica EPIC-26-layout-y-flow-forward-mejorado | ✓ | Historia listada en el índice; contribuye a CS-2 y CS-12 |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ (el criterio condicional de testcases.md no se activa) |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | `/story-code-review`, `/story-verify` y `/story-acceptance` escriben su informe en `specs/flow/STORY-NNN-<slug>/` y nada en `docs/specs/` | ✓ | D-2 (mapa de rutas), D-3 (resolución por ID y ruta explícita restringida), D-5 (un eval de ruta por skill); interfaces «Directorio de la historia», «Informes»; F-1; contratos #2, #7, #9, #13 |
| AC-2 | El gate de STORY-148 no reporta resolución legada en los tres skills y ningún artefacto queda fuera de `specs/flow/STORY-NNN-<slug>/` | ✓ | D-1 (bloque canónico), D-3 (rechazo de ruta fuera de `specs/flow/`), D-6 (retiro de `PENDING_MIGRATION`), D-7 (E2E-002); F-2, F-3; contratos #1, #4, #5, #6, #8 |
| CNF-1 | Evals con rutas `specs/flow/`; ejecución a criterio humano | ✓ | D-2 (TC-004 de acceptance), D-5 (TC-010 reemplazado, TC-023/TC-007/TC-015 nuevos); contratos #11, #13 |
| CNF-2 | Los tres skills declaran el contrato de layout fijo | ✓ | D-1, D-6; contratos #3, #10 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Verificar ADR-0016, `verify-fixed-layout.js` y `PENDING_MIGRATION` | Risks (precondición STORY-147/148) | ✓ |
| T002 | Línea base `npm test`/`verify:repository` e inventario por grep | Context, D-2, CR-003 | ✓ |
| T003 | Comprobar/aplicar el cambio de E2E-002 | D-7, CR-001 | ✓ |
| T004 | Retirar tres entradas de `PENDING_MIGRATION` (RED) | D-6 | ✓ |
| T005 | Migrar `story-code-review/SKILL.md` | D-1, D-2, D-3; componente «Revisión multi-agente» | ✓ |
| T006 | Migrar `story-verify/SKILL.md` (conserva `CLI_ROOT`) | D-1, D-2, D-3; componente «Verificación» | ✓ |
| T007 | Migrar `story-acceptance/SKILL.md` | D-1, D-2, D-3; componente «Aceptación» | ✓ |
| T008 | Ejemplo de `$STORY_DIR` en `tech-lead-reviewer.agent.md` | D-2; componente «Revisor Tech Lead» | ✓ |
| T009 | Rutas de los ejemplos de code-review | D-2; componente «Ejemplos de revisión» | ✓ |
| T010 | README de verify (salida, template, DoD) | D-2, D-4; componente «README de verificación» | ✓ |
| T011 | Evals de acceptance (TC-004, TC-010, TC-015) | D-2, D-5 | ✓ |
| T012 | Eval TC-023 de code-review | D-5 | ✓ |
| T013 | Eval TC-007 de verify | D-5 | ✓ |
| T014 | `verify:layout` en verde (GREEN) | D-6; contrato #5 | ✓ |
| T015 | Greps de contratos #1–#4, #7–#10 | Contratos de verificación | ✓ |
| T016 | Validar JSON y `--dry-run` de evals | Contrato #11 | ✓ |
| T017 | `npm test` + `verify:repository` | Contratos #5, #6 | ✓ |
| T018 | Revisión de `git diff --stat` | Contrato #12, Non-Goals | ✓ |
| T019 | `graphify update` + `implement-report.md` (CR-003, dogfooding, evals) | Risks, CR-003, contrato #13 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| `skills/story-code-review/SKILL.md` | Componentes afectados | T005 | ✓ |
| `skills/story-code-review/agents/tech-lead-reviewer.agent.md` | Componentes afectados | T008 | ✓ |
| Ejemplos de code-review | Componentes afectados | T009 | ✓ |
| `skills/story-code-review/evals/evals.json` | Componentes afectados | T012 | ✓ |
| `skills/story-verify/SKILL.md` | Componentes afectados | T006 | ✓ |
| `skills/story-verify/README.md` | Componentes afectados | T010 | ✓ |
| `skills/story-verify/evals/evals.json` | Componentes afectados | T013 | ✓ |
| `skills/story-acceptance/SKILL.md` | Componentes afectados | T007 | ✓ |
| `skills/story-acceptance/evals/evals.json` | Componentes afectados | T011 | ✓ |
| `scripts/verify-fixed-layout.js` (`PENDING_MIGRATION`) | Componentes afectados | T004, T014 | ✓ |
| `test/dod-story.test.js` (condicional) | Componentes afectados | T003 | ✓ |
| Paso 0 de los tres skills | Interfaces | T005 (b), T006 (c), T007 (c) | ✓ |
| Directorio de la historia / resolución por ID | Interfaces | T005 (c), T006 (d), T007 (d) | ✓ |
| Ruta explícita restringida | Interfaces | T005 (c)/(d), T006 (d)/(e), T007 (d)/(e) | ✓ |
| Informes en `$STORY_DIR` | Interfaces | T005 (e), T006 (f), T007 (f), T010 | ✓ |
| DoD en `docs/guardrails/` | Interfaces | T005 (a), T006 (b), T007 (b), T010 | ✓ |
| Contexto de subagentes (`$STORY_DIR` resuelto) | Interfaces | T008 (sin cambio de contrato; solo ejemplo) | ✓ |
| Gate R1–R4 | Interfaces | T004, T014, T017 | ✓ |
| Verificación de alcance | Contratos #12 | T018 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-26-layout-y-flow-forward-mejorado

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` l. 33: «**STORY-158** — … `story-code-review`, `story-verify` y `story-acceptance` (con sus agentes locales) dejan de usar `SPECS_BASE` y escriben sus informes en `specs/flow/STORY-NNN-<slug>/`; se actualizan sus evals» |
| Objetivo de la historia alineado con la épica | ✓ | El «Para» (cerrar una historia sin raíz configurable) contribuye a CS-2 (`grep -rnE "SPECS_BASE\|SDDF_ROOT" skills/` vacío; contrato #1 de diseño) y a CS-12 (gate y `npm test` verdes; T017) |
| Restricciones de la épica respetadas | ✓ | Convención `STORY-NNN-<slug>/` conservada (ADR-0004); sin búsqueda en `specs/flow/archive/`; agentes locales incluidos en el alcance (D-2, T008), como pide la línea de la épica |

---

## Inconsistencias Detectadas

Sin inconsistencias detectadas.

**Observaciones (no son hallazgos; no alteran el veredicto):**

- design.md registra tres CR de retroalimentación hacia story.md, ya resueltos en el diseño: CR-001 (E2E-002 acopla la entrega con STORY-150/155/156; T003 lo resuelve de forma condicional), CR-002 (el «Para» dice «sin `sddf.config.yaml`», pero `story-verify` lo lee para su configuración de pruebas) y CR-003 (el inventario de story.md omite `docs/specs/…` en el agente Tech Lead y en dos ejemplos, `$SPECS_BASE/templates/…` en el README de verify y el TC-010 obsoleto de acceptance).
- La precondición dura (STORY-147 y STORY-148 en `DONE`; `scripts/verify-fixed-layout.js` aún no existe) se comprueba en T001.

---

## Recomendaciones

1. Opcional: precisar en `story.md` › «Para» que se refiere a «sin declarar una raíz en `sddf.config.yaml` ni `SDDF_ROOT`» (CR-002) y ampliar la tabla «Inventario inicial» con las rutas `docs/specs/` de agentes/ejemplos (CR-003).
2. Implementar solo después de STORY-148 (T001); si se implementa antes que STORY-150/155/156, aplicar T003 y comunicarlo a esas historias.
3. Generar `testcases.md` con `/story-testcases STORY-158` si se quiere habilitar también la vía `/story-implement`.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada (pipeline ejecutado con `--only-tasks`).

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-158` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-158` |

---

## Cumplimiento DoD — Fase PLAN

`docs/guardrails/dod-story-plan.md` — `enforcement: error`, 7 criterios.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin que cubren los escenarios principales | ✓ | — | AC-1 (Esquema del escenario con tres ejemplos) y AC-2 en bloques `gherkin` |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño por criterio | ✓ | — | Sección «Cobertura de Criterios de Aceptación» de este reporte |
| Todos los elementos de diseño tienen trazabilidad explícita (`// satisface: AC-N`) | ✓ | — | D-1…D-7 con `// satisface:`; columna «AC que satisface» en Componentes e Interfaces; flujos F-1…F-4 anotados |
| No hay decisiones de arquitectura aplazadas | ✓ | — | «Open Questions: Ninguna»; ambigüedades registradas en CR-001…CR-003 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente |
| Si tasks.md existe, contiene únicamente tareas atómicas para todos los escenarios principales | ✓ | — | 19 tareas acotadas por archivo; AC-1 (T005–T013, T015), AC-2 (T004, T014, T015, T017) |
| Si testcases.md existe, contiene pruebas para todos los escenarios principales | ✓ | — | Condición no activada: testcases.md no existe (modo `--only-tasks`), el criterio se cumple de forma vacía |
