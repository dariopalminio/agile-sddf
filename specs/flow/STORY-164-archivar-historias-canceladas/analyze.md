---
type: analyze
id: STORY-164
slug: STORY-164-analyze-report
title: "Analyze: Skill story-complete: archivar historias canceladas"
story: STORY-164
design: STORY-164
tasks: STORY-164
verdict: APPROVED
created: 2026-10-25
updated: 2026-10-25
related:
  - STORY-164-archivar-historias-canceladas
---

<!-- Referencias -->
[[STORY-164-archivar-historias-canceladas]]

# Reporte de Coherencia: Skill story-complete: archivar historias canceladas

## Veredicto

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo D

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (y 4/4 CNF) |
| Alineación tareas → diseño | ✓ | 28/28 tareas con diseño (T028 trazada a la regla de `AGENTS.md › graphify`) |
| Cobertura diseño → tareas | ✓ | 16/16 componentes y 7/7 interfaces con tarea |
| Alineación con la épica EPIC-27-completar-flujo-de-story | ⚠️ | listada y alineada; la nota «Regla de archivo» de la épica atribuye el ADR a STORY-160 (INC-001) |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ (uno no aplica: testcases.md ausente) |

> ⚠️ testcases.md no encontrado: la cobertura de ACs en casos de prueba (Correlación 6) se omitió. Los casos de prueba se especifican como evals en design.md › «Esquema de datos» (líneas 211-231), en tasks.md T002-T004 y en las pruebas manuales T025-T026.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Archivado de una `CANCELED/DONE` con frontmatter sin cambios y fecha `updated:` → `created:` → `date:` | ✓ | D-1 (fila `CANCELED/DONE`, l. 85), D-3 (cadena de fecha y sus tres filas, l. 123), D-4 (movimiento sin escritura, confirmación y mensaje final, l. 144), D-5 (distinción por status, l. 157), C-1, C-2, F-1 |
| AC-2 | Rechazo sin efectos de `CANCELED/IN-PROGRESS` y de `CANCELED/DONE` sin fecha válida | ✓ | D-1 (fila `CANCELED/<substatus ≠ DONE>` con mensaje que nombra el estado), D-3 (fila «ninguna válida» con mensaje que nombra los tres campos), F-2, C-2 |
| AC-3 | ADR nuevo reemplaza a ADR-0016 y la regla se describe en `AGENTS.md`, `docs/constitution.md` y `docs/domains/` | ✓ | D-2 (ADR-0017 y campos permitidos de ADR-0016, l. 105), D-6 (frase canónica y cambios por documento, l. 167), C-4…C-13, C-16 |

| CNF | Cubierto | Elemento de diseño |
|---|---|---|
| CNF-1 — ADR inmutable | ✓ | D-2 (solo `status`, `superseded-by` y nota), contrato de verificación 4 |
| CNF-2 — Dominio | ✓ | D-6 (invariante 6 de `domain-state-management.md`; §5 y §9 de `domain-story-lifecycle.md`), C-9, C-10 |
| CNF-3 — Gate determinista | ✓ | D-7 (prueba de regresión en `test/memory-system.test.js`), C-15, contratos 7 y 8 |
| CNF-4 — Conteo invariante | ✓ | D-4 (sin escritura previa: si el movimiento falla, nada cambió), contrato 3 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Comprobar precondición STORY-160 y anclas de los gates | CR-001, Risks, C-3, C-14 | ✓ |
| T002 | Cinco evals nuevos de canceladas | C-2, Esquema de datos | ✓ |
| T003 | Ajustar evals de STORY-160 (`CANCELED/DONE`, `COMPLETED` sin fecha) | C-2, D-1, D-3, CR-001 | ✓ |
| T004 | Caso de `CANCELED` archivada en `test/memory-system.test.js` | C-15, D-7 | ✓ |
| T005 | Crear ADR-0017 | C-4, D-2 | ✓ |
| T006 | ADR-0016: solo campos permitidos | C-5, D-2, CNF-1 | ✓ |
| T007 | Índice de ADRs | C-6 | ✓ |
| T008 | SKILL.md: frontmatter, precondiciones, reglas | C-1, D-1, D-2 | ✓ |
| T009 | Tabla de admisión por estado | C-1, D-1 | ✓ |
| T010 | Cadena de fecha | C-1, D-3 | ✓ |
| T011 | Confirmación, movimiento sin escritura, mensajes, salida | C-1, D-4, F-1 | ✓ |
| T012 | README del skill | C-3 | ✓ |
| T013 | `AGENTS.md` | C-7, D-6 | ✓ |
| T014 | `docs/constitution.md` | C-8, D-6 | ✓ |
| T015 | `domain-state-management.md` invariante 6 | C-9, D-6 | ✓ |
| T016 | `domain-story-lifecycle.md` §5 y §9 | C-10, D-6 | ✓ |
| T017 | `domain-work-item-hierarchy.md` y `domain-knowledge-artifacts.md` | C-11, D-6 | ✓ |
| T018 | `root-folder-practices.md` | C-12, CR-002 | ✓ |
| T019 | `sddf-architecture.md` | C-13, CR-002 | ✓ |
| T020 | `sddf-commands-pipeline.md` | C-14, CR-002 | ✓ |
| T021 | Regenerar `docs/index.md` | C-16 | ✓ |
| T022 | `npm test` | Contrato 7, CNF-3 | ✓ |
| T023 | `npm run verify:repository` | Contrato 8, CNF-3 | ✓ |
| T024 | Verificación de ADR y documentos por `git diff`/`grep` | Contratos 4, 5 y 6 | ✓ |
| T025 | Prueba manual de AC-1 en repo temporal | Contratos 1 y 3, F-1 | ✓ |
| T026 | Prueba manual de AC-2 en repo temporal | Contratos 2 y 3, F-2 | ✓ |
| T027 | Evals a criterio humano | Contratos 1 y 2 | ✓ |
| T028 | `graphify update .` | Regla de `AGENTS.md › graphify` (mantener el grafo), no un componente de design.md | ✓ (trazado a regla de proyecto) |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| C-1 Skill `story-complete` | Componentes afectados (l. 60) | T008, T009, T010, T011 | ✓ |
| C-2 Evals | Componentes afectados | T002, T003 | ✓ |
| C-3 README del skill | Componentes afectados | T012 | ✓ |
| C-4 ADR-0017 | Componentes afectados | T005 | ✓ |
| C-5 ADR-0016 | Componentes afectados | T006 | ✓ |
| C-6 Índice de ADRs | Componentes afectados | T007 | ✓ |
| C-7 `AGENTS.md` | Componentes afectados | T013 | ✓ |
| C-8 Constitución | Componentes afectados | T014 | ✓ |
| C-9 `domain-state-management.md` | Componentes afectados | T015 | ✓ |
| C-10 `domain-story-lifecycle.md` | Componentes afectados | T016 | ✓ |
| C-11 Dominios con la regla de archivo | Componentes afectados | T017 | ✓ |
| C-12 `root-folder-practices.md` | Componentes afectados | T018 | ✓ |
| C-13 `sddf-architecture.md` | Componentes afectados | T019 | ✓ |
| C-14 `sddf-commands-pipeline.md` | Componentes afectados | T020 | ✓ |
| C-15 Prueba del gate | Componentes afectados | T004, T022 | ✓ |
| C-16 `docs/index.md` | Componentes afectados | T021 | ✓ |
| Interfaz: Invocación | Interfaces (l. 199) | T011 (sin cambios respecto de STORY-160) | ✓ |
| Interfaz: Admisión | Interfaces | T009 | ✓ |
| Interfaz: Fecha de archivo | Interfaces | T010 | ✓ |
| Interfaz: Confirmación `CANCELED` | Interfaces | T011 | ✓ |
| Interfaz: Movimiento | Interfaces | T011 | ✓ |
| Interfaz: Mensajes nuevos | Interfaces | T009, T010, T011 | ✓ |
| Interfaz: ADR vigente | Interfaces | T005, T006 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-27-completar-flujo-de-story

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` l. 37: «**STORY-164** — Skill story-complete — archivar historias canceladas» |
| Objetivo de la historia alineado con la épica | ✓ | Coincide con el alcance de l. 23 («también archiva, sin cambiar su status, las historias … `CANCELED/DONE`») y l. 24 (ADR nuevo que reemplaza a ADR-0016) |
| Restricciones de la épica respetadas | ⚠️ | CS-3 y CS-5 (l. 46, l. 48) se cumplen con D-1, D-2 y D-6. La nota «Regla de archivo» (l. 82) dice que «STORY-160 incluye un ADR nuevo»; tras el split, el ADR es de STORY-164 (design.md CR-003) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D: desalineación con la épica
- **Descripción:** la nota «Regla de archivo» de la épica atribuye el ADR que reemplaza a ADR-0016 y la actualización de `AGENTS.md`, `docs/constitution.md` y `docs/domains/` a STORY-160. Tras el split del 2026-10-25, ese alcance es de STORY-164 (AC-3) y STORY-160 lo excluye en sus Non-Goals. No hay conflicto de comportamiento, solo un texto desactualizado en la épica; design.md lo registra como CR-003.
- **Archivo afectado:** `specs/flow/EPIC-27-completar-flujo-de-story/epic.md` — sección «Notas», l. 82
- **Acción requerida:** cambiar «STORY-160 incluye un ADR nuevo» por «STORY-164 incluye un ADR nuevo» en la nota de la épica.

---

## Recomendaciones

1. (INC-001) Corregir la l. 82 de `specs/flow/EPIC-27-completar-flujo-de-story/epic.md` para atribuir el ADR nuevo a STORY-164. Es una edición de una palabra en la épica; no requiere tocar story.md, design.md ni tasks.md.
2. (Sin hallazgo, dependencia) Implementar STORY-164 después de STORY-160 (design.md CR-001, tasks.md T001). Al planificar STORY-160 conviene dejar la tabla de admisión por estado y la cadena de fecha en un solo paso cada una, para que T009 y T010 las amplíen sin duplicarlas.
3. (Sin hallazgo, cobertura) Si se quiere habilitar `/story-implement`, generar `testcases.md` con `/story-testcases STORY-164`; los evals de T002-T003 y las pruebas manuales T025-T026 ya cubren los tres ACs.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-164` no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-164` |

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1, AC-2 y AC-3 en bloques `gherkin` con Escenario/Dado/Cuando/Entonces y Ejemplos |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | Tabla de cobertura: 3/3 ACs y 4/4 CNF |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | D-1…D-7 con `// satisface:` en el título; columnas `AC / CNF` en Componentes e Interfaces; `// AC-N` en F-1 y F-2 |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | Open Questions: ninguna; el mecanismo de movimiento se hereda de STORY-160 y la dependencia está registrada como CR-001; los componentes condicionados a STORY-160 (C-3, C-14) se resuelven en T001 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente (28 tareas) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | Cada tarea tiene un criterio «Hecho» verificable; AC-1 → T002, T009-T011, T025; AC-2 → T002, T009, T010, T026; AC-3 → T005-T007, T013-T021, T024 |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: testcases.md ausente |
