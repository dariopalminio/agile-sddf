---
type: analyze
id: STORY-174
slug: STORY-174-analyze-report
title: "Analyze: Skill epic-refine: corregir referencias obsoletas tras un split"
story: STORY-174
design: STORY-174
tasks: STORY-174
verdict: APPROVED
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-174-corregir-referencias-obsoletas-tras-split
---

<!-- Referencias -->
[[STORY-174-corregir-referencias-obsoletas-tras-split]]

# Reporte de Coherencia: Skill epic-refine: corregir referencias obsoletas tras un split

## Veredicto

**Veredicto:** `APPROVED` — sin inconsistencias

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 2/2 criterios cubiertos (y 3/3 CNF) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada: testcases.md no presente (modo `--only-tasks`) |
| Alineación tareas → diseño | ✓ | 24/24 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 15/15 elementos con tarea (9 componentes + 6 interfaces) |
| Alineación con la épica EPIC-23-completar-flujo-de-epic | ✓ | Listada en el índice (`epic.md:47`); amplía la parte de CS-15 de STORY-165 (`epic.md:199`) |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Corregir referencias al slug de una historia dividida (índice y `related`, plan, `.bak`, reporte con COH-1 y COH-2 aplicados) | ✓ | D-2 (ámbito, forma, existencia), D-3 (exclusión MAD-02, numeración COH-1 índice / COH-2 `related`), D-4 (reemplazo único `STORY-301-exportar-informe-csv`), D-5 (cambio `modificar`, `.bak`, relectura), D-6 (filas `aplicado`), F-1, V-1, TC-014 |
| AC-2 | Reemplazo no determinable en `--auto` → COH-1 fuera de alcance · PO, `story.md` intacto | ✓ | D-4 (0 directorios → PO con nota), D-5 (tabla «fuera de alcance»), D-6 (fila con Responsable `PO`), F-2, V-2, TC-015/TC-016; CR-001 documenta la precondición implícita del reporte |
| CNF-1 | Backup obligatorio | ✓ | D-5 (reglas comunes de STORY-165 D-7), V-1 |
| CNF-2 | UTF-8 sin BOM | ✓ | Interfaces («`epic-refine` → disco»), V-5 |
| CNF-3 | Detalle COH en `references/`, `SKILL.md` < 500 líneas | ✓ | D-1 (`coh-corrections.md`, sub-sección ≤ 10 líneas), V-6 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Verificar que STORY-165 está implementada | CR-004, Risks | ✓ |
| T002 | Invocar `skill-master` sobre `skills/epic-refine/` | D-1 (nota de la historia: skill-master) | ✓ |
| T003 | Sub-sección «Detección COH» en el Paso 3 | D-1, F-5, Interfaz `SKILL.md → coh-corrections.md` | ✓ |
| T004 | Fila COH en la tabla de enrutamiento; «Qué NO hace» sobre `/story-split` | D-1, D-7, CR-002 | ✓ |
| T005 | Actualizar `description` (≤ 500 caracteres) | D-1 | ✓ |
| T006 | `coh-corrections.md`: ámbito, forma del slug, existencia | D-2 | ✓ |
| T007 | `coh-corrections.md`: exclusión y numeración | D-3 | ✓ |
| T008 | `coh-corrections.md`: reemplazo, forma del cambio, fuera de alcance, relectura | D-4, D-5 | ✓ |
| T009 | Comentario de `hallazgos` en el template del reporte | D-6 | ✓ |
| T010 | README: capacidad COH | D-1 | ✓ |
| T011 | Fixture `split-slug-obsoleto/` | D-8 | ✓ |
| T012 | Fixture `split-sin-reemplazo/` | D-8, CR-001 | ✓ |
| T013 | Fixture `split-ambiguo/` | D-4, D-8 | ✓ |
| T014 | Fixture `split-reportado/` | D-3, D-8 | ✓ |
| T015 | Fixture `split-aprobada/` | D-8 | ✓ |
| T016 | Evals TC-014…TC-018 | D-8 | ✓ |
| T017 | Escritor COH en template de épica + seed | D-8, CR-003 | ✓ |
| T018 | Escritor COH en template de historia + seed | D-8, CR-003 | ✓ |
| T019 | Fila de `epic-refine` en `sddf-commands-pipeline.md` §2 | D-8 | ✓ |
| T020 | Verificar tamaño del `SKILL.md` y `description` | V-6 | ✓ |
| T021 | Verificar UTF-8 sin BOM y central = seed | V-5, V-7 | ✓ |
| T022 | `npm test` y `npm run verify:repository` | V-7, V-8 | ✓ |
| T023 | `graphify update .` | Regla del repositorio (AGENTS.md) | ✓ |
| T024 | Registrar evals manuales TC-014…TC-018 | V-1…V-4 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Skill corrector de épica (`SKILL.md`) | Componentes afectados, D-1 | T002–T005 | ✓ |
| Catálogo COH (`references/coh-corrections.md`) | Componentes afectados, D-2–D-5 | T006–T008 | ✓ |
| Template del reporte de refinamiento | Componentes afectados, D-6 | T009 | ✓ |
| Ficha del skill (`README.md`) | Componentes afectados, D-1 | T010 | ✓ |
| Evals y fixtures COH | Componentes afectados, D-8 | T011–T016 | ✓ |
| Template de épica (central + seed) | Componentes afectados, D-8 | T017 | ✓ |
| Template de historia (central + seed) | Componentes afectados, D-8 | T018 | ✓ |
| Guía de pipeline | Componentes afectados, D-8 | T019 | ✓ |
| Gate de integridad (`skills/epic-analyze/`, sin cambios) | Componentes afectados | — (sin cambios por diseño; T001 verifica la dependencia) | ✓ |
| Filesystem → detección COH | Interfaces y contratos | T006, T008 | ✓ |
| `epic.md` / `story.md` → detección | Interfaces y contratos | T006 | ✓ |
| Reporte de análisis → exclusión | Interfaces y contratos | T007, T014 | ✓ |
| `SKILL.md` → `coh-corrections.md` | Interfaces y contratos | T003 | ✓ |
| `epic-refine` → plan / reporte | Interfaces y contratos | T008, T009 | ✓ |
| `epic-refine` → disco | Interfaces y contratos | T008, T021 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-23-completar-flujo-de-epic

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md:47`: `- [ ] **STORY-174** — Skill epic-refine: corregir referencias obsoletas tras un split…` |
| Objetivo de la historia alineado con la épica | ✓ | La nota de dueños (`epic.md:199`) asigna CS-15 a STORY-165 y declara que STORY-173 y STORY-174 «amplían su parte de CS-15 … con las referencias obsoletas tras un split» |
| Restricciones de la épica respetadas | ✓ | Sin cambios de `status`/`substatus` (CS-15, Non-Goals y D-5); skill vía `skill-master` (T002); CS-21 en T022 |

---

## Inconsistencias Detectadas

Sin inconsistencias detectadas.

---

## Recomendaciones

1. Observación no bloqueante (CR-001 de design.md): AC-2 de `story.md` solo es coherente si `epic-analyze-report.md` no lista `STORY-310-importar-datos` (un análisis actualizado lo reportaría como MAD-02 y STORY-165 lo retiraría). El diseño lo resuelve con la exclusión de D-3 y los fixtures `split-sin-reemplazo/` / `split-reportado/`; opcionalmente, añadir a AC-2 de `story.md` el paso `Y "epic-analyze-report.md" no reporta esa referencia`.
2. Observación no bloqueante (CR-002 de design.md): la derivación a `/story-split` de los Non-Goals no tiene criterio de detección; el diseño no añade detector (D-7). Si el PO lo quiere, especificarlo en una historia nueva.
3. Implementar después de STORY-165 (T001, CR-004) y renumerar los casos de `evals.json` según lo que haya añadido STORY-173 (T016).

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada (pipeline `--only-tasks`).

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-174` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-174` |

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin que cubren los escenarios principales | ✓ | — | AC-1 y AC-2 en bloques `gherkin` con Dado/Cuando/Entonces |
| design.md existe y cubre todos los ACs con al menos un elemento por criterio | ✓ | — | Tabla «Cobertura de Criterios de Aceptación» (2/2) |
| Todos los elementos de diseño tienen trazabilidad explícita (`// satisface: AC-N`) | ✓ | — | Goals y D-1…D-8 anotados `// satisface:`; tablas de componentes e interfaces con columna AC |
| No hay decisiones de arquitectura aplazadas | ✓ | — | «Open Questions: Ninguna»; ambigüedades registradas como CR-001…CR-004 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente |
| Si tasks.md existe, contiene únicamente tareas atómicas para todos los escenarios principales | ✓ | — | 24 tareas de un solo archivo o comprobación; AC-1 (T011, T016/TC-014) y AC-2 (T012, T016/TC-015) |
| Si testcases.md existe, contiene pruebas para todos los escenarios principales | ✓ | — | No aplica: testcases.md no existe |
