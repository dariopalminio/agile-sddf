---
type: analyze
id: STORY-155
slug: STORY-155-analyze-report
title: "Analyze: Migrar los skills de planning a specs/flow"
story: STORY-155
design: STORY-155
tasks: STORY-155
verdict: APPROVED
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-155-migrar-skills-planning-specs-flow
---

<!-- Referencias -->
[[STORY-155-migrar-skills-planning-specs-flow]]

# Reporte de Coherencia: Migrar los skills de planning a specs/flow

## Veredicto

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo E

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (más CNF-1, CNF-2, CNF-3) |
| Alineación tareas → diseño | ✓ | 26/26 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 24/24 elementos con tarea (17 componentes, 7 interfaces) |
| Alineación con la épica EPIC-26-layout-y-flow-forward-mejorado | ✓ | listada en `epic.md` l. 30; contribuye a CS-2 y CS-3 |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 6/7 criterios ✓ (1 ⚠️) |

Avisos de cobertura (no son hallazgos): `testcases.md` no presente → cobertura de pruebas no evaluada (planificación en modo `--only-tasks`; las verificaciones viven en los contratos del diseño y en el grupo 5 de `tasks.md`).

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Cada skill de planning lee y escribe su artefacto en `specs/flow/STORY-NNN-<slug>/` y lee la épica padre desde `specs/flow/EPIC-NN-<slug>/epic.md` | ✓ | D-1 (bloque canónico), D-2 (mapa de rutas), D-4 (épica padre), D-5 (template de fix-plan), D-8 (TC-007); interfaces «Directorio de una historia», «Épica padre»; F-1; contratos #2, #5 |
| AC-2 | `/story-plan STORY-999` informa que no existe en `specs/flow/` y no busca ni crea nada en `docs/specs/` | ✓ | D-3 (resolución y mensaje común), D-8 (TC-002 de plan con `STORY-999`); interfaz «Resolución por ID»; F-2; contrato #4 |
| AC-3 | grep `SPECS_BASE\|SDDF_ROOT` vacío sobre los skills y sus `assets/agents/`; `verify:repository` en verde | ✓ | D-1, D-2, D-6 (`PENDING_MIGRATION`), D-7 (E2E-002); interfaz «Gate»; F-3; contratos #1, #3, #6, #7, #8, #10 |
| CNF-1 | Evals con rutas `specs/flow/` | ✓ | D-2, D-8; contrato #9 |
| CNF-2 | Contrato de layout fijo declarado | ✓ | D-1, D-6; contrato #3 |
| CNF-3 | 0 coincidencias en los 6 skills y sus `assets/agents/` | ✓ | D-2; Context (sin `assets/agents/`); contratos #1, #10 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Verificar precondiciones (ADR-0016, `verify-fixed-layout.js`, `PENDING_MIGRATION`) | Risks, CR-002 | ✓ |
| T002 | Línea base e inventario de líneas a migrar; confirmar ausencia de `assets/agents/` | Context, D-2, contrato #10 | ✓ |
| T003 | Retirar seis entradas de `PENDING_MIGRATION` (RED) | D-6 | ✓ |
| T004 | E2E-002 condicional | D-7, CR-001 | ✓ |
| T005 | Migrar `story-design/SKILL.md` | D-1, D-2, D-3 | ✓ |
| T006 | Migrar `story-tasking/SKILL.md` | D-1, D-2, D-3 | ✓ |
| T007 | Migrar `story-testcases/SKILL.md` | D-1, D-2, D-3 | ✓ |
| T008 | Migrar `story-analyze/SKILL.md` (incluida épica padre) | D-1, D-2, D-3, D-4 | ✓ |
| T009 | Migrar `story-fix-plan/SKILL.md` (template relativo) | D-1, D-2, D-3, D-5 | ✓ |
| T010 | Migrar `story-plan/SKILL.md` | D-1, D-2, D-3 | ✓ |
| T011 | `assets/README.md` de design, tasking, analyze y plan | D-2 | ✓ |
| T012 | Comentario de `analyze-report-template.md:102` | D-2 | ✓ |
| T013 | `story-plan/README.md` | D-2 (ajustes de redacción) | ✓ |
| T014 | `plan-summary.md` | D-2 (ajustes de redacción) | ✓ |
| T015 | Ejemplos de `story-design` | D-2 (ajustes de redacción) | ✓ |
| T016 | Ejemplos de analyze y fix-plan con `docs/specs/epics/` | D-2 | ✓ |
| T017 | Eval TC-002 de `story-plan` | D-8 | ✓ |
| T018 | Evals de design (TC-002, TC-003) y tasking (TC-003) | D-8 | ✓ |
| T019 | 12 contextos de evals de `story-fix-plan` | D-8 | ✓ |
| T020 | Eval TC-007 de `story-analyze` | D-8, D-4 | ✓ |
| T021 | `verify:layout` en verde (GREEN) | D-6, contrato #6 | ✓ |
| T022 | Greps de contratos #1–#5, #8, #10 | Contratos de verificación | ✓ |
| T023 | Validación estructural y `--dry-run` de evals | Contrato #9 | ✓ |
| T024 | `npm test` y `verify:repository` | Contratos #6, #7 | ✓ |
| T025 | Revisión de `git diff --stat` | Contrato #11, Non-Goals | ✓ |
| T026 | `graphify update .` e `implement-report.md` | Risks (dogfooding), contrato #12 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Skill de diseño (`SKILL.md`, `assets/README.md`) | Componentes afectados | T005, T011 | ✓ |
| Ejemplos de diseño | Componentes afectados | T015 | ✓ |
| Evals de diseño | Componentes afectados | T018 | ✓ |
| Skill de tasking (`SKILL.md`, `assets/README.md`) | Componentes afectados | T006, T011 | ✓ |
| Evals de tasking | Componentes afectados | T018 | ✓ |
| Skill de testcases | Componentes afectados | T007 | ✓ |
| Skill de análisis (`SKILL.md`, `assets/README.md`, template) | Componentes afectados | T008, T011, T012 | ✓ |
| Ejemplo de análisis | Componentes afectados | T016 | ✓ |
| Evals de análisis (TC-007) | Componentes afectados | T020 | ✓ |
| Skill de corrección del plan | Componentes afectados | T009 | ✓ |
| Ejemplo de corrección | Componentes afectados | T016 | ✓ |
| Evals de corrección | Componentes afectados | T019 | ✓ |
| Orquestador de planning (`SKILL.md`, `README.md`, `assets/README.md`) | Componentes afectados | T010, T011, T013 | ✓ |
| Ejemplo de planning | Componentes afectados | T014 | ✓ |
| Evals de planning | Componentes afectados | T017 | ✓ |
| Lista transitoria del gate | Componentes afectados | T003, T021 | ✓ |
| Prueba E2E-002 del DoD | Componentes afectados | T004 | ✓ |
| Paso 0 de cada skill | Interfaces | T005–T010 | ✓ |
| Directorio de una historia | Interfaces | T005–T010, T022 | ✓ |
| Resolución por ID | Interfaces | T005–T010, T017, T022 | ✓ |
| Épica padre | Interfaces | T008, T020, T022 | ✓ |
| DoD de planning | Interfaces | T005, T008, T010, T012 | ✓ |
| Constitución | Interfaces | T005 | ✓ |
| Gate | Interfaces | T003, T021, T024 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-26-layout-y-flow-forward-mejorado (`docs/specs/epics/EPIC-26-layout-y-flow-forward-mejorado/epic.md`)

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` l. 30: «STORY-155 — Migrar los skills de planning a specs/flow» con los seis skills |
| Objetivo de la historia alineado con la épica | ✓ | Contribuye a CS-2 (l. 38, grep `SPECS_BASE\|SDDF_ROOT` vacío) y CS-3 (l. 39, ningún skill lee `root`); conserva `STORY-NNN-<slug>/` y `EPIC-NN-<slug>/` (l. 114, ADR-0004) |
| Restricciones de la épica respetadas | ✓ | Sin búsqueda en `archive/`; sin mover work items (STORY-153); la épica menciona «con sus subagentes», pero ninguno de los seis skills tiene `assets/agents/` (design Context, CR-003): restricción satisfecha de forma vacía |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** E: criterio DoD PLAN «Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md» evaluado ⚠️ (evidencia insuficiente)
- **Descripción:** la lectura de la épica padre de AC-1 solo se verifica con el eval TC-007 de `story-analyze` (design D-8, `tasks.md` T020). Su aserción `contains: "Alineación con la épica EPIC-10-data-management"` también aparece cuando la épica **no** se encuentra: el reporte de ejemplo `skills/story-analyze/examples/output/analyze.md:31` contiene esa fila con `⚠️ epic.md no encontrado — verificación omitida`. El `not_contains: "No se encontró epic.md"` no cubre esa redacción de la tabla, por lo que TC-007 podría pasar sin que el skill lea la épica fixture. El contrato #5 (grep de las reglas de D-4) verifica la prosa, no el comportamiento.
- **Archivo afectado:** design.md — sección "D-8 — Evals" (fila TC-007); tasks.md — tarea T020
- **Acción requerida:** endurecer TC-007 para que distinga «épica encontrada»: añadir a `contains` una evidencia que solo aparece al leer la épica (p. ej. `"Historia listada en la épica | ✓"` con la feature de la fixture) y a `not_contains` `"epic.md no encontrado"`.

---

## Recomendaciones

1. **INC-001:** en design.md D-8 (fila TC-007) y tasks.md T020, añadir `"epic.md no encontrado"` a `not_contains` y una aserción positiva ligada al contenido de la épica fixture (fila «Historia listada en la épica» con `✓`). Puede aplicarse con `/story-fix-plan STORY-155` en modo advertencias o durante la implementación de T020; no bloquea.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-155` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-155` |

---

## Cumplimiento DoD — Fase PLAN

Fuente: `docs/guardrails/dod-story-plan.md` (override `sddf.config.yaml › guardrails.dod.story.plan` = `dod-story-plan`), `enforcement: error`.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 (Escenario con Ejemplos), AC-2 y AC-3 en bloques `gherkin` |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | Ver «Cobertura de Criterios de Aceptación»: 3/3 y los tres CNF |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | D-1…D-8 con `// satisface:`; tablas de componentes e interfaces con columna «AC que satisface»; flujos F-1–F-3 con `// AC-N` |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | «Open Questions: Ninguna»; CR-001 (E2E-002), CR-002 (precondiciones), CR-003 (épica padre y `assets/agents/`) |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` presente (26 tareas) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ⚠️ | WARNING | Tareas atómicas (un archivo o un comando cada una) y escenarios AC-1/AC-2/AC-3 con tareas; la verificación conductual de la lectura de la épica (T020) es débil — INC-001 |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: `testcases.md` no existe (condición no activada) |
