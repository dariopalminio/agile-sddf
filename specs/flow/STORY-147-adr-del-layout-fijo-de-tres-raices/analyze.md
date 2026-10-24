---
type: analyze
id: STORY-147
slug: STORY-147-analyze-report
title: "Analyze: ADR del layout fijo de tres raíces"
story: STORY-147
design: STORY-147
testcases: STORY-147
tasks: STORY-147
verdict: APPROVED
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-147-adr-del-layout-fijo-de-tres-raices
---

<!-- Referencias -->
[[STORY-147-adr-del-layout-fijo-de-tres-raices]]

# Reporte de Coherencia: ADR del layout fijo de tres raíces

## Veredicto

**Veredicto:** `APPROVED` — sin inconsistencias

Hay dos CR de `design.md` (CR-001, CR-002) que piden corregir la premisa y la redacción de AC-1/AC-2 en `story.md`. No bloquean: el diseño resuelve ambas ambigüedades (D-5, D-6) y el DoD PLAN admite ambigüedades registradas como CR. Ver «Observaciones».

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (más CNF-1 y CNF-2) |
| Cobertura de ACs en testcases.md | ✓ | 3/3 ACs con caso de prueba (más CNF-1 y CNF-2) |
| Alineación tareas → diseño | ✓ | 16/16 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 8/8 elementos con tarea (4 componentes, 4 interfaces) |
| Alineación con la épica EPIC-26-layout-y-flow-forward-mejorado | ✓ | Listada como STORY-147; cubre CS-1; resuelve la nota «Nombre de directorio» de la épica |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | ADR nuevo ACCEPTED con las raíces hermanas, el retiro de `SDDF_ROOT`/`root`/`SPECS_BASE`, la convención de archive, ADR-0010 `superseded-by` y listado en el README | ✓ | D-1 (archivo y frontmatter), D-2 (raíces y retiro), D-3 (archive), D-5/D-6 (ADR-0010), D-7 (README e índice); «Componentes afectados» filas 1–3; contratos 1–6 |
| AC-2 | ADR-0010 solo cambia sus metadatos de reemplazo; contexto, decisión y consecuencias intactos | ✓ | D-5 (tabla de cambios permitidos y campos byte a byte iguales), D-6; contrato 7 |
| AC-3 | El ADR declara si `specs/flow/` conserva el slug, consistente con SMOKE-1/SMOKE-2 | ✓ | D-4; contrato 8 |
| CNF-1 | Inmutabilidad de ADRs | ✓ | D-1, D-5, D-8 (no se editan ADR-0002/0007/0012/0013) |
| CNF-2 | `verify:repository` verde | ✓ | D-7 (wikilink por slug en `docs/index.md`), F-3; contrato 9 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Confirmar número libre ADR-0016 | D-1, F-3 | ✓ |
| T002 | Confirmar slug único | D-1, Interfaz «Wikilink en `docs/index.md`» | ✓ |
| T003 | Crear ADR-0016 con frontmatter | D-1, «Esquema de datos», Componente «ADR del layout fijo» | ✓ |
| T004 | Contexto y problema | D-6 | ✓ |
| T005 | Decisión: raíces y retiro | D-2 | ✓ |
| T006 | Decisión: archive y slug | D-3, D-4 | ✓ |
| T007 | Rationale, Alternativas, Consecuencias, Referencias | D-8, D-9 | ✓ |
| T008 | Marcar ADR-0010 | D-5, D-6, Componente «ADR-0010» | ✓ |
| T009 | Índice `docs/adr/README.md` | D-7, Componente «Índice de ADRs», Interfaz «Fila de índice» | ✓ |
| T010 | Línea en `docs/index.md` | D-7, Componente «Índice wiki» | ✓ |
| T011 | Verificar AC-1 | Contratos 1–6 | ✓ |
| T012 | Verificar AC-2/CNF-1 | Contrato 7, F-2 | ✓ |
| T013 | Verificar AC-3 | Contrato 8 | ✓ |
| T014 | Enlaces fuera del gate | Risks «`check-doc-links.js` excluye `docs/adr`» | ✓ |
| T015 | `npm run verify:repository` | Contrato 9 | ✓ |
| T016 | Alcance con `git diff --stat` | Contrato 10, Non-Goals | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| ADR del layout fijo (`ADR-0016-layout-fijo-de-tres-raices.md`) | Componentes afectados | T003–T007 | ✓ |
| ADR-0010 | Componentes afectados | T008 | ✓ |
| Índice de ADRs (`docs/adr/README.md`) | Componentes afectados | T009 | ✓ |
| Índice wiki (`docs/index.md`) | Componentes afectados | T010 | ✓ |
| Frontmatter de ADR | Interfaces | T003, T008 | ✓ |
| Reemplazo entre ADRs | Interfaces | T003, T008, T011 | ✓ |
| Fila de índice | Interfaces | T009 | ✓ |
| Wikilink en `docs/index.md` | Interfaces | T002, T010, T015 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-26-layout-y-flow-forward-mejorado

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md › ## Historias`: STORY-147 «ADR del layout fijo de tres raíces» |
| Objetivo de la historia alineado con la épica | ✓ | La historia fija la decisión que aplican STORY-148 a STORY-158; cubre CS-1 (ADR nuevo `ACCEPTED`, ADR-0010 reemplazado sin editar contenido) |
| Restricciones de la épica respetadas | ✓ | Rutas y retiro de `SDDF_ROOT`/`root`/`SPECS_BASE` coinciden con `## Alcance`; fecha de archive (`updated:`/`created:`), solo `COMPLETED` y épicas no archivadas coinciden con `## Notas`; el slug se decide en el ADR como pide la nota «Nombre de directorio»; Non-Goals (Workflow, Living Spec) fuera del ADR |

---

## Inconsistencias Detectadas

Sin inconsistencias detectadas.

---

## Observaciones (no tipificadas, no bloquean)

1. **CR-001 — premisa de AC-1/AC-2:** `story.md › AC-1` y `AC-2` dicen «ADR-0010 está ACCEPTED»; `docs/adr/ADR-0010-specs-dentro-de-docs.md` (frontmatter `status: PROPOSED`) y la fila ADR-0010 de `docs/adr/README.md` dicen `PROPOSED`. `design.md › D-6` lo resuelve marcándolo `SUPERSEDED` con la disciplina de un ADR aceptado; `testcases.md › E2E-001/E2E-002` usan el estado real.
2. **CR-002 — redacción de AC-2:** `story.md › AC-2` («solo cambian `status` y `superseded-by`») no menciona la nota visible que exige `docs/adr/README.md › Convención › Inmutabilidad`. `design.md › D-5` aplica el README y protege lo que AC-2 enumera (contexto, decisión, consecuencias).

---

## Recomendaciones

1. Antes de `/story-implement-tasks`, o en la aceptación, alinear `story.md › AC-1/AC-2` con CR-001 («ADR-0010 está PROPOSED y vigente de hecho») y CR-002 («solo cambian `status`, `superseded-by` y la nota visible de reemplazo bajo el título»). No hace falta replanificar: design, tasks y testcases ya aplican esa lectura.
2. En `story-verify`/`story-acceptance`, comprobar el contrato 7 con `git diff` (T012): es la única evidencia de AC-2.

---

## Cobertura de ACs en Testcases

| AC | Descripción | Cubierto en testcases.md | Escenario |
|---|---|---|---|
| AC-1 | ADR nuevo que reemplaza a ADR-0010 | ✓ | E2E-001, IT-001, IT-002 |
| AC-2 | ADR-0010 no se edita in place | ✓ | E2E-002 |
| AC-3 | Decisión sobre el slug | ✓ | E2E-003 |
| CNF-1 | Inmutabilidad | ✓ | E2E-002 |
| CNF-2 | Gate verde | ✓ | E2E-004, IT-003, IT-004 |

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ✓ | `/story-implement STORY-147` |
| tasks.md | ✓ | `/story-implement-tasks STORY-147` |

---

## Cumplimiento DoD — Fase PLAN

`docs/guardrails/dod-story-plan.md` (`enforcement: error`), 7 criterios.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin que cubren los escenarios principales | ✓ | — | AC-1, AC-2, AC-3 en bloques `gherkin` Dado/Cuando/Entonces |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño por criterio | ✓ | — | AC-1: D-1/D-2/D-3/D-5/D-7; AC-2: D-5/D-6; AC-3: D-4 |
| Todos los elementos de diseño tienen trazabilidad explícita (`// satisface: AC-N`) | ✓ | — | D-1 a D-9 y «Esquema de datos» con `// satisface:`; tablas de componentes e interfaces con columna AC |
| No hay decisiones de arquitectura aplazadas | ✓ | — | `## Open Questions`: ninguna; ambigüedades registradas como CR-001 y CR-002 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | Ambos presentes |
| tasks.md contiene únicamente tareas atómicas para todos los escenarios principales | ✓ | — | 16 tareas de un archivo o una verificación cada una; T011–T013 verifican AC-1, AC-2 y AC-3 |
| testcases.md contiene pruebas para todos los escenarios principales | ✓ | — | E2E-001/002/003 trazables 1-a-1 a AC-1/2/3 |
