---
type: analyze
id: STORY-187
slug: STORY-187-analyze-report
title: "Analyze: Dominio, requisitos y máquina de estados sin buffers"
story: STORY-187
design: STORY-187
tasks: STORY-187
verdict: APPROVED
created: 2026-11-13
updated: 2026-11-13
related:
  - STORY-187-dominio-y-requisitos-sin-buffers
---

<!-- Referencias -->
[[STORY-187-dominio-y-requisitos-sin-buffers]] · [[STORY-187-dominio-y-requisitos-sin-buffers-design]] · [[STORY-187-dominio-y-requisitos-sin-buffers-tasks]]

# Reporte de Coherencia: Dominio, requisitos y máquina de estados sin buffers

## Veredicto

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo E

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (y 4/4 CNF) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada: testcases.md no presente (`/story-plan --only-tasks`) |
| Alineación tareas → diseño | ✓ | 25/25 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 10/10 componentes y 7/7 interfaces con tarea |
| Alineación con la épica EPIC-029-eliminar-estados-buffer | ✓ | listada, objetivo alineado (CS-5 y parte de CS-6), restricciones respetadas |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 6/7 criterios ✓, 1 ⚠️ |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Los documentos declaran los workflows del ADR y lo citan | ✓ | C-1, C-2, C-4, C-5; interfaces «Cita del ADR», «Workflow de historia», «Workflow de épica»; D-01, D-02, D-03, D-04, D-10, D-11; V-1, V-3, V-4, V-12 |
| AC-2 | Rework y transiciones alineados con el ADR (5 filas) | ✓ | Fila 1 (C-1 y C-3) → D-09, V-5. Fila 2 (`state-machine.md`) → D-03, D-04, V-6. Fila 3 (FR-043/044/045) → D-08, V-7. Fila 4 (NFR-006) → D-08, V-8. Fila 5 (`domain-skills-map.md`) → D-07, V-9 |
| AC-3 | La cola de listos es una consulta, no un estado | ✓ | D-05, D-06 (§5.5 nueva de C-3), interfaces «Consulta de la cola», «Significado de `TODO`», «WIP»; V-10, V-11 |
| CNF-1 | Coherencia con el ADR | ✓ | D-02, D-05 (no repite el número de WIP), D-09 (no cambia el rework de épica); T023 |
| CNF-2 | Sin valor legado en la autoridad | ✓ | Non-Goals (sin ventana de transición), D-08; V-2 |
| CNF-3 | Verificación por búsqueda | ✓ | V-2; T022 |
| CNF-4 | Gate verde | ✓ | V-14, V-15; T024, T025 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Precondición: ADR-0022 `ACCEPTED`, conteos de partida, constitución, línea base del gate | F-1, V-1, V-13, CR-002 | ✓ |
| T002 | Glosario de C-3 | C-3, D-05, D-09 | ✓ |
| T003 | Modelo táctico de C-3 | C-3, D-05 | ✓ |
| T004 | Invariantes 2 y 5 de C-3 | C-3, D-05, D-06 | ✓ |
| T005 | Fila `BUFFER` de «Fases compartidas» | C-3, D-06 | ✓ |
| T006 | §5.3 de C-3 | C-3, D-08 (incidental), D-09 | ✓ |
| T007 | §5.5 nueva de C-3 | C-3, D-06, V-10 | ✓ |
| T008 | Gate de capacidad, §8 y §9 de C-3 | C-3, D-02, D-05 | ✓ |
| T009 | C-1 §2 y §3 | C-1, D-05, D-09 | ✓ |
| T010 | C-1 §4 | C-1, D-03, D-09 | ✓ |
| T011 | C-1 §5 a §8, §10, §11 | C-1, D-02, D-04, D-05, D-06, D-09 | ✓ |
| T012 | C-2 §2 a §4 | C-2, D-03, D-05 | ✓ |
| T013 | C-2 §5 a §8, §10, §11 | C-2, D-02, D-04, D-05, D-10 | ✓ |
| T014 | C-4 nivel STORY | C-4, D-03, D-04 | ✓ |
| T015 | C-4 nivel ÉPICA y «Fuentes de verdad» | C-4, D-02, D-03, D-04, D-10 | ✓ |
| T016 | `domain.md` | C-5, D-05, D-09, D-11 | ✓ |
| T017 | `domain-skills-map.md` | C-6, D-07 | ✓ |
| T018 | NFR-006 | C-7, D-08 | ✓ |
| T019 | FR-043 | C-8, D-08 | ✓ |
| T020 | FR-044 | C-9, D-08 | ✓ |
| T021 | FR-045 | C-10, D-08 | ✓ |
| T022 | Contratos de búsqueda | V-2, V-3, V-4, V-11, V-12 | ✓ |
| T023 | Lectura de AC-1 a AC-3 y CNF-1 | V-5 a V-10 | ✓ |
| T024 | Bytes y alcance | V-14 | ✓ |
| T025 | Gate | V-15 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| C-1 `domain-story-lifecycle.md` | Componentes afectados | T009, T010, T011 | ✓ |
| C-2 `domain-epic-lifecycle.md` | Componentes afectados | T012, T013 | ✓ |
| C-3 `domain-state-management.md` | Componentes afectados | T002 a T008 | ✓ |
| C-4 `state-machine.md` | Componentes afectados | T014, T015 | ✓ |
| C-5 `domain.md` | Componentes afectados | T016 | ✓ |
| C-6 `domain-skills-map.md` | Componentes afectados | T017 | ✓ |
| C-7 NFR-006 | Componentes afectados | T018 | ✓ |
| C-8 FR-043 | Componentes afectados | T019 | ✓ |
| C-9 FR-044 | Componentes afectados | T020 | ✓ |
| C-10 FR-045 | Componentes afectados | T021 | ✓ |
| Cita del ADR | Interfaces | T006, T008, T010, T011, T013, T014, T015, T016, T017, T018 a T021; verificación T022 (V-4) | ✓ |
| Workflow de historia (literal) | Interfaces | T009, T010, T014, T016, T018; T022 (V-3) | ✓ |
| Workflow de épica (literal) | Interfaces | T012, T015, T016, T018; T022 (V-3) | ✓ |
| Rework de historia | Interfaces | T006, T009, T010, T011, T014, T016, T019 a T021 | ✓ |
| Consulta de la cola | Interfaces | T007, T011 | ✓ |
| Significado de `TODO` | Interfaces | T004, T007, T011, T013 | ✓ |
| WIP solo `IN-PROGRESS` | Interfaces | T002, T003, T004, T008, T009, T012, T016 | ✓ |
| `updated:` | Interfaces | T015 a T021 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-029-eliminar-estados-buffer

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` § Historias, entrada **STORY-187**, con el mismo título y el mismo «Como/Quiero/Para» |
| Objetivo de la historia alineado con la épica | ✓ | Cubre CS-5 (domain-state-management, story/epic lifecycle sin buffers, sin WIP de cola, `TODO` en cualquier estado activo) y la parte de CS-6 de `docs/domains/`, `state-machine.md` y `docs/requirements/` |
| Restricciones de la épica respetadas | ✓ | No edita registros históricos (ADR-0003/0006/0008, `CHANGELOG.md`, roadmap, archivo); describe el rework en `IMPLEMENT/TODO` y la aprobación de épica en `PLAN/DONE` escrita a mano; deja guías, README y `objectives.md` a STORY-193; coordinación con STORY-192 registrada en CR-001; dependencia de STORY-186 registrada en CR-002 y T001 |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** E (criterio DoD PLAN «No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta» evaluado `⚠️`)
- **Descripción:** el contrato V-11 de design.md exige `grep -in "buffer"` = 0 en C-1, C-2 y C-3, y en C-5 solo la pregunta cerrada y la fila del changelog. Pero V-4 y la interfaz «Cita del ADR» exigen que esos mismos documentos contengan el wikilink `[[workflows-sin-estados-buffer]]`, que contiene la cadena `buffer`. Los dos contratos no pueden cumplirse a la vez, y los criterios «Hecho» de T008, T011, T013 y T016 heredan la contradicción: el implementador no podrá marcarlas como hechas tal como están escritas.
- **Archivo afectado:** design.md — sección «Contratos de verificación», fila V-11; tasks.md — criterios «Hecho» de T008, T011, T013, T016 y la referencia a V-11 en T022.
- **Acción requerida:** restringir la búsqueda a las palabras que definen el buffer sin el slug del ADR, por ejemplo `grep -inE "buffer" <doc> | grep -v "workflows-sin-estados-buffer"` (= 0 en C-1, C-2 y C-3; en C-5 solo la pregunta cerrada y la fila del changelog), o buscar los términos concretos retirados (`Buffer (`, `estado buffer`, `en un buffer`, `WIP limitado`).

---

## Recomendaciones

1. **INC-001:** en design.md, fila V-11, y en tasks.md, criterios «Hecho» de T008, T011, T013 y T016, excluir el slug del ADR de la búsqueda de `buffer` (filtrar `workflows-sin-estados-buffer` o buscar los términos retirados). Se puede aplicar con `/story-fix-plan STORY-187`, o corregirlo al implementar anotándolo en `implement-report.md`. No bloquea: el objetivo de V-11 (ningún glosario, VO, invariante ni gate define un WIP de cola) sigue siendo verificable por lectura.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada (planificación con `--only-tasks`; la historia es documental y su verificación son los contratos V-1 a V-15 de design.md y las tareas T022 a T025).

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-187` no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-187` |

**Precondición de implementación:** ADR-0022 debe existir con `status: ACCEPTED` (STORY-186 implementada). Sin él, los wikilinks `[[workflows-sin-estados-buffer]]` fallan en `scripts/check-doc-links.js` (T001, CR-002).

---

## Cumplimiento DoD — Fase PLAN

Fuente: `docs/guardrails/dod-story-plan.md` (`enforcement: error`).

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 (principal), AC-2 (con datos, 5 filas), AC-3 (alternativo), los tres en bloques `gherkin` |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | Tabla «Cobertura de Criterios de Aceptación»: 3/3 |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | Columna «Satisface» en componentes e interfaces; `// satisface:` en cada D-01 a D-11, en Goals y en «Esquema de datos» |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ⚠️ | WARNING | Sin Open Questions y dos CR registrados; pero el contrato V-11 contradice V-4 (INC-001) |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | 25 tareas, una sección o documento por tarea, con dependencias y criterio «Hecho»; AC-1 a AC-3 verificados en T022 y T023 |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: testcases.md no existe (criterio condicional) |
