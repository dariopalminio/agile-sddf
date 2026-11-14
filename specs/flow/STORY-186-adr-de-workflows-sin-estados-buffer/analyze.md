---
type: analyze
id: STORY-186
slug: STORY-186-analyze-report
title: "Analyze: ADR de workflows sin estados buffer"
story: STORY-186
design: STORY-186
testcases: STORY-186
tasks: STORY-186
verdict: APPROVED
created: 2026-11-13
updated: 2026-11-13
related:
  - STORY-186-adr-de-workflows-sin-estados-buffer
---

<!-- Referencias -->
[[STORY-186-adr-de-workflows-sin-estados-buffer]] · [[STORY-186-adr-de-workflows-sin-estados-buffer-design]] · [[STORY-186-adr-de-workflows-sin-estados-buffer-tasks]] · [[STORY-186-adr-de-workflows-sin-estados-buffer-testcases]]

# Reporte de Coherencia: ADR de workflows sin estados buffer

## Veredicto

**Veredicto:** `APPROVED`. Sin inconsistencias.

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (y 4/4 CNF) |
| Cobertura de ACs en testcases.md | ✓ | 3/3 ACs con caso de prueba (y 4/4 CNF) |
| Alineación tareas → diseño | ✓ | 20/20 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 5/5 componentes y 6/6 interfaces con tarea |
| Alineación con la épica EPIC-029-eliminar-estados-buffer | ✓ | listada, objetivo alineado, restricciones respetadas |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | El ADR fija los workflows y reemplaza a ADR-0006 y ADR-0008 | ✓ | C-1 a C-5; D-01 (número y `supersedes`); D-02 (workflows y `PLAN/DONE` del PO); D-07 (solo `status` y `superseded-by`); «Interfaces» (fila del README igual al frontmatter); V-1 a V-6 |
| AC-2 | Contrato de `fix-directives.md` por gate (3 ejemplos) | ✓ | D-03 (`IMPLEMENT/TODO`); D-04 (tabla por gate: `based-on`, dimensión la del revisor o `DoD-CODE-REVIEW`, `verify-defect` y `requirements-coverage`); D-05 (`round` continuo); V-7 |
| AC-3 | Valor legado durante la ventana de transición | ✓ | D-06 (`implement-report.md` → `IMPLEMENT/TODO`, si no → `PLAN/DONE`; ventana hasta 7.0.0; sin estado ni substatus de rework); V-8 |
| CNF-1 | Decisiones abiertas cerradas | ✓ | D-04 (dimensión de verify, lista blanca de aceptación), D-05 (ronda anterior sin `.tmp/`), D-06 (ventana) |
| CNF-2 | Alternativas descartadas | ✓ | D-08 (las 4 obligatorias y las adicionales) |
| CNF-3 | Registros históricos intactos | ✓ | D-07, CR-001, V-4, V-5 |
| CNF-4 | Gate verde | ✓ | V-10, V-11 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Estado de partida (ADR-0021 último, ADR-0006/0008 `ACCEPTED`, encabezados de ronda, línea base del gate) | Context; D-05 (patrones de encabezado); V-10 | ✓ |
| T002 | Crear ADR-0022 con frontmatter y 7 encabezados | C-1; Interfaces (frontmatter); D-01 | ✓ |
| T003 | `## Contexto y problema` | Esquema de datos (fila Contexto); CNF-1 | ✓ |
| T004 | Workflows en `## Decisión` | D-02 | ✓ |
| T005 | Rework y contrato de `fix-directives.md` | D-03, D-04, D-05 | ✓ |
| T006 | Valor legado y ventana | D-06 | ✓ |
| T007 | `## Rationale` | Esquema de datos (fila Rationale) | ✓ |
| T008 | `## Alternativas consideradas` | D-08 | ✓ |
| T009 | `## Consecuencias` | Esquema de datos (fila Consecuencias); Risks / Trade-offs | ✓ |
| T010 | `## Referencias` | Esquema de datos (fila Referencias) | ✓ |
| T011 | ADR-0006: 2 campos | C-2; D-07 | ✓ |
| T012 | ADR-0008: 2 campos | C-3; D-07 | ✓ |
| T013 | Fila y celdas en `docs/adr/README.md` | C-4; Interfaces | ✓ |
| T014 | Línea en `docs/index.md` | C-5; Interfaces | ✓ |
| T015 | Verificar AC-1 y CNF-3 | V-1 a V-6 | ✓ |
| T016 | Verificar AC-2 y AC-3 | V-7, V-8 | ✓ |
| T017 | Verificar CNF-1 y CNF-2 | V-9; D-04 a D-06 | ✓ |
| T018 | Encoding | V-11 | ✓ |
| T019 | Gate | V-10 | ✓ |
| T020 | `graphify update .` y alcance con `git status` | Non-Goals (alcance de 5 archivos); AGENTS.md | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| C-1 ADR de workflows sin buffers | Componentes afectados | T002–T010 | ✓ |
| C-2 Frontmatter de ADR-0006 | Componentes afectados | T011 | ✓ |
| C-3 Frontmatter de ADR-0008 | Componentes afectados | T012 | ✓ |
| C-4 Índice de ADRs | Componentes afectados | T013 | ✓ |
| C-5 Índice wiki | Componentes afectados | T014 | ✓ |
| Frontmatter de ADR-0022 | Interfaces | T002 | ✓ |
| Frontmatter de ADR-0006/0008 tras el cambio | Interfaces | T011, T012 | ✓ |
| Fila nueva en `docs/adr/README.md` | Interfaces | T013 | ✓ |
| Celdas `Estado` de ADR-0006/0008 | Interfaces | T013 | ✓ |
| Línea en `docs/index.md` | Interfaces | T014 | ✓ |
| Contrato de `fix-directives.md` | Interfaces; Esquema de datos | T005 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-029-eliminar-estados-buffer

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md › ## Historias`, primera entrada (STORY-186), y cubre CS-1 |
| Objetivo de la historia alineado con la épica | ✓ | El «Para» (una sola decisión para las demás historias) coincide con «Orden y coordinación»: STORY-186 va primero. El diseño cubre todo CS-1: workflows, rework en `IMPLEMENT/TODO`, contrato con tres escritores, `PLAN/DONE` de épica, regla de `implement-report.md` y duración de la ventana |
| Restricciones de la épica respetadas | ✓ | «Registros históricos que no se editan»: ADR-0003 intacto y ADR-0006/0008 solo con `status` y `superseded-by` (D-07, V-4, V-5). La épica pide recoger los cambios de EPIC-28 en el contrato, y D-04 incluye las reglas de ADR-0021. CS-3 pide que `round` continúe tras un `APPROVED` de code-review (D-05) y que la aceptación use `requirements-coverage` (D-04). Migración manual, sin `memory-system migrate` (D-06). Sin bump ni CHANGELOG (Non-Goals) |

---

## Inconsistencias Detectadas

Sin inconsistencias detectadas.

---

## Recomendaciones

Ninguna corrección es obligatoria. Tres observaciones para la implementación:

1. **CR-001 (design.md › Registro de Cambios):** la historia («sin ningún otro cambio», CNF-3) prevalece sobre la convención de `docs/adr/README.md` («se añade una nota visible de reemplazo bajo su título»). Ya está decidido en D-07. Si el PO prefiere la nota, hay que editar AC-1 y CNF-3 antes de implementar, no durante.
2. **tasks.md › T020 frente a testcases.md › IT-003:** T020 dice que `git status` muestra «solo los 5 archivos del alcance (más `graphify-out/`)» e IT-003 dice «los 5 archivos más los artefactos de la historia». La lectura correcta es la de IT-003: `story.md`, `implement-report.md` y los demás artefactos de `specs/flow/STORY-186-*/` también cambian, y `graphify-out/` está en `.gitignore`. Hay que interpretar T020 así al ejecutarla.
3. **D-05 depende de dos encabezados de los ejecutores:** T001 y CON-005 confirman que siguen existiendo antes de escribir el ADR. STORY-190, al implementar la regla, debe mantener ambos patrones o unificarlos de forma explícita.

---

## Cobertura de ACs en Testcases

| AC | Descripción | Cubierto en testcases.md | Escenario |
|---|---|---|---|
| AC-1 | El ADR fija los workflows y reemplaza a ADR-0006 y ADR-0008 | ✓ | E2E-001; IT-001 |
| AC-2 | Contrato de `fix-directives.md` por gate | ✓ | E2E-002, E2E-003, E2E-004 (uno por fila de `Ejemplos`); CON-004; CON-005 |
| AC-3 | Valor legado durante la ventana de transición | ✓ | E2E-005 |
| CNF-1 | Decisiones abiertas cerradas | ✓ | CON-001 |
| CNF-2 | Alternativas descartadas | ✓ | CON-002 |
| CNF-3 | Registros históricos intactos | ✓ | CON-003 |
| CNF-4 | Gate verde | ✓ | IT-002, IT-003, CON-006 |

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ✓ | `/story-implement STORY-186` |
| tasks.md | ✓ | `/story-implement-tasks STORY-186` |

---

## Cumplimiento DoD — Fase PLAN

`docs/guardrails/dod-story-plan.md` (`enforcement: error`), 7 criterios.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 (principal), AC-2 (con datos, 3 ejemplos) y AC-3 (alternativo) en bloques `gherkin` |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | 3/3 ACs y 4/4 CNF (ver «Cobertura de Criterios de Aceptación») |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | D-01 a D-08 y los Goals llevan `// satisface:`; los componentes e interfaces, la columna `Satisface`; «Esquema de datos» y los contratos V-n, su columna `Satisface`/`Origen` |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | «Open Questions: Ninguna»; la ambigüedad sobre la nota de reemplazo está en CR-001 y la decide D-07 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | Existen ambos |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | 20 tareas con su criterio «Hecho». AC-1 → T002–T004, T011–T015; AC-2 → T005, T016; AC-3 → T006, T016 |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | E2E-001 a E2E-005 cubren los 3 escenarios (AC-2 con un caso por ejemplo) |
