---
type: analyze
id: STORY-166
slug: STORY-166-analyze-report
title: "Analyze: Veredicto de epic-format-validation"
story: STORY-166
design: STORY-166
tasks: STORY-166
verdict: APPROVED
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-166-veredicto-de-epic-format-validation
---

<!-- Referencias -->
[[STORY-166-veredicto-de-epic-format-validation]]

# Reporte de Coherencia: Veredicto de epic-format-validation

## Veredicto
<!-- Línea según la regla de Veredicto del Paso 6. -->

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo D

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 4/4 criterios cubiertos (y CNF-1…CNF-4) |
| Alineación tareas → diseño | ✓ | 29/29 tareas con diseño o con regla de proceso del repositorio (T028) |
| Cobertura diseño → tareas | ✓ | 11/11 componentes y 5/5 interfaces con tarea |
| Alineación con la épica EPIC-23-completar-flujo-de-epic | ⚠️ | Listada y alineada; tensión con «se reutilizan sin cambios» (INC-001) |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

⚠️ testcases.md no presente — cobertura de pruebas no evaluada (modo `--only-tasks`). Los casos de verificación viven en las evals TC-001…TC-016 planificadas en T017–T018 y en las pruebas de T001–T003.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Épica conforme → `APPROVED`, sin `APROBADO`/`REFINAR`/`RECHAZADO` | ✓ | D-1 (reporte), D-2 (regla), D-5 (template), D-9 (evals con `not_contains`), «Esquema del reporte», F-1 |
| AC-2 | Épica con defectos → `NEEDS-REFINEMENT` con ubicación y corrección; suficiente para `/epic-improve` | ✓ | D-1, D-2, D-4 (tabla `## Defectos`), interfaz «Reporte → epic-improve», F-2, F-4, CR-002 |
| AC-3 | Épica inexistente → ruta buscada y error, sin veredicto | ✓ | D-3 (errores sin veredicto, `Ruta buscada:`), F-3, D-9 (TC-002) |
| AC-4 | Policy §4 con fila, fuera de §1, enlace al flowchart con rama `NEEDS-REFINEMENT` | ✓ | D-6 (policy v1.3.0), D-7 (`REPORT_TEMPLATES` + prueba sobre policy y flowchart reales) |

CNF: CNF-1 → D-2, D-5, contrato 5; CNF-2 → D-8, contrato 6; CNF-3/CNF-4 → D-5, contrato 7.

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Fixture `REPORTS` con `epic-format-validation` | D-7 · Pruebas del verificador | ✓ |
| T002 | Prueba sobre la policy real (§4, §1, enlace) | D-7 · AC-4 | ✓ |
| T003 | Prueba sobre el flowchart real (ramas) | D-7 · Flowchart de épica | ✓ |
| T004 | Ejecutar pruebas en RED | D-7 · Contrato de verificación 4 | ✓ |
| T005 | Crear template del reporte | D-5 · «Esquema del reporte» · Template del reporte | ✓ |
| T006 | `REPORT_TEMPLATES` en el verificador | D-7 · Verificador del contrato | ✓ |
| T007 | §1 sin `epic-format-validation` | D-6.1 | ✓ |
| T008 | Fila §4 + flowchart de `epic-analyze` | D-6.2, D-6.3 | ✓ |
| T009 | §7.7, versión 1.3.0, historial | D-6.4–D-6.6 | ✓ |
| T010 | Ejecutar pruebas y verificador en GREEN | D-7 · Contratos 4 y 5 | ✓ |
| T011 | Metadatos y reglas del `SKILL.md` | D-1 · Gate de formato de épica | ✓ |
| T012 | Paso 1: error con `Ruta buscada:` | D-3 | ✓ |
| T013 | Paso 5: veredicto, defectos, reporte, consola | D-2, D-4, D-5 | ✓ |
| T014 | Fallo de escritura del reporte | F-5 (P7) | ✓ |
| T015 | Tamaño ≤ 290 líneas y marcador de layout | D-5 · Contrato 7 | ✓ |
| T016 | Ejemplo `needs-refinement` | D-9 · Ejemplo de reporte | ✓ |
| T017 | Evals: sustitución de vocabulario | D-9 · Evals del gate | ✓ |
| T018 | Evals: TC-002 (AC-3) y TC-016 (AC-2) | D-9 | ✓ |
| T019 | README del skill | D-8 · README del gate | ✓ |
| T020 | `epic-creation/SKILL.md` | D-8 · Consumidores | ✓ |
| T021 | Ejemplos y evals de `epic-creation` | D-8 | ✓ |
| T022 | `epic-from-project-plan` y TC-008 | D-8 | ✓ |
| T023 | Evals de `epic-generate-stories` | D-8 | ✓ |
| T024 | FR-027 | D-8 · Requisito FR-027 | ✓ |
| T025 | `grep` de vocabulario heredado | Contrato de verificación 6 | ✓ |
| T026 | Template y ejemplo contra G-01…G-04 | Contrato de verificación 5 | ✓ |
| T027 | `npm test` y `verify:repository` | Contrato de verificación 8 (CS-21) | ✓ |
| T028 | `graphify update .` | Sin elemento de diseño: procedimiento obligatorio del repositorio (AGENTS.md › graphify) | ✓ |
| T029 | Evals manuales pendientes | Contratos de verificación 1–3 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Gate de formato de épica (`SKILL.md`) | Componentes afectados | T011–T015 | ✓ |
| Template del reporte de formato | Componentes afectados · D-5 | T005 | ✓ |
| Ejemplo de reporte | Componentes afectados · D-9 | T016 | ✓ |
| Evals del gate | Componentes afectados · D-9 | T017, T018 | ✓ |
| README del gate | Componentes afectados · D-8 | T019 | ✓ |
| Política de contrato de validación | Componentes afectados · D-6 | T007–T009 | ✓ |
| Verificador del contrato | Componentes afectados · D-7 | T006 | ✓ |
| Pruebas del verificador | Componentes afectados · D-7 | T001–T004, T010 | ✓ |
| Consumidores | Componentes afectados · D-8 | T020–T023 | ✓ |
| Requisito FR-027 | Componentes afectados · D-8 | T024 | ✓ |
| Flowchart de épica (sin cambios) | Componentes afectados | T003 (solo lectura) | ✓ |
| Invocación | Interfaces y contratos | T012 | ✓ |
| Reporte → consumidores (`verdict`, G-06) | Interfaces y contratos | T013, T020, T022 | ✓ |
| Reporte → `epic-improve` (`## Defectos`) | Interfaces y contratos | T005, T013, T016 | ✓ |
| Error → invocador | Interfaces y contratos | T012 | ✓ |
| Policy → verificador | Interfaces y contratos | T006, T008 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-23-completar-flujo-de-epic

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` línea 39: `- [ ] **STORY-166** — Veredicto de epic-format-validation` (Fase DEFINE) |
| Objetivo de la historia alineado con la épica | ✓ | Objetivo de EPIC-23: «gates con veredicto que deciden cada avance o bucle de corrección»; la historia cierra el gate de `DEFINE` (CS-13) y la parte de CS-20 sobre la policy |
| Restricciones de la épica respetadas | ⚠️ | `epic.md` § Alcance: «`epic-creation`, `epic-generate-stories` y `epic-analyze` ya existen y se reutilizan sin cambios», pero D-8/D-6.3 tocan `epic-creation/SKILL.md`, sus ejemplos y evals, las evals de `epic-generate-stories` y la fila de `epic-analyze` en la policy (INC-001) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D: desalineación con la épica
- **Descripción:** La épica declara que `epic-creation`, `epic-generate-stories` y `epic-analyze` «se reutilizan sin cambios». El diseño cambia el vocabulario de veredicto en `skills/epic-creation/SKILL.md` (Paso 7), sus `examples/` y `evals/`, en `skills/epic-generate-stories/evals/evals.json` (línea 51) y la celda Flowchart de `epic-analyze` en la policy §4. Los cambios son de vocabulario y no de comportamiento, y los exige el CNF-2 de la historia («los skills y orquestadores que hoy leen `APROBADO` / `REFINAR` … se actualizan en la misma historia») y la parte de CS-20 asignada a STORY-166.
- **Archivo afectado:** `design.md` — secciones «D-8 — Consumidores del repositorio» y «D-6 — Policy v1.3.0» (punto 3); `specs/flow/EPIC-23-completar-flujo-de-epic/epic.md` — sección «Alcance»
- **Acción requerida:** Aceptar la desviación de forma explícita: añadir una línea en «Risks / Trade-offs» de `design.md` que la justifique por CNF-2/CS-20, o matizar la frase de la épica («sin cambios de comportamiento»).

---

## Recomendaciones

1. INC-001: en `design.md` → «Risks / Trade-offs», añadir «[La épica dice que `epic-creation`, `epic-generate-stories` y `epic-analyze` se reutilizan sin cambios] → los cambios son solo de vocabulario del veredicto (CNF-2) y de la celda Flowchart de la policy (CS-20); su comportamiento no cambia». Como alternativa, ajustar la frase en `epic.md` › «Alcance».
2. T028 (`graphify update .`) no tiene elemento de diseño: viene del procedimiento obligatorio del repositorio. Si se quiere trazabilidad completa, añadirlo como contrato de verificación 9 en `design.md`.
3. CR-002 de `design.md` pide que STORY-167 lea `<EPIC_DIR>/epic-format-validation-report.md`. Anotarlo en `STORY-167/story.md` o en su `design.md` al planificarla. No hay tarea en STORY-166 porque queda fuera de su alcance.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-166`: no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-166` |

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin que cubren los escenarios principales | ✓ | — | AC-1…AC-4 en bloques `gherkin` (principal, alternativo, error y coherencia) |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño por criterio | ✓ | — | Tabla «Cobertura de Criterios de Aceptación»: 4/4 |
| Todos los elementos de diseño tienen trazabilidad explícita (`// satisface: AC-N`) | ✓ | — | Encabezados D-1…D-9 con `// satisface:`; columna «AC» en «Componentes afectados» e «Interfaces y contratos» |
| No hay decisiones de arquitectura aplazadas | ✓ | — | «Open Questions: Ninguna»; `BLOCKED` resuelto en D-3; lo que excede el alcance está en CR-001 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` presente (29 tareas) |
| Si tasks.md existe, solo tareas atómicas para todos los escenarios principales | ✓ | — | Una tarea por archivo o sección; AC-1 (T017), AC-2 (T013, T016, T018), AC-3 (T012, T018), AC-4 (T001–T010) |
| Si testcases.md existe, pruebas para todos los escenarios principales | ✓ | — | No aplica: `testcases.md` no existe (modo `--only-tasks`) |
