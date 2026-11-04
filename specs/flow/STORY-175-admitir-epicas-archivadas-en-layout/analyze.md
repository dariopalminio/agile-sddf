---
type: analyze
id: STORY-175
slug: STORY-175-analyze-report
title: "Analyze: Admitir épicas archivadas en el layout fijo con un ADR nuevo"
story: STORY-175
design: STORY-175
tasks: STORY-175
verdict: APPROVED
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-175-admitir-epicas-archivadas-en-layout
---

<!-- Referencias -->
[[STORY-175-admitir-epicas-archivadas-en-layout]]

# Reporte de Coherencia: Admitir épicas archivadas en el layout fijo con un ADR nuevo

## Veredicto

**Veredicto:** `APPROVED` — sin inconsistencias

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (más CNF-1, CNF-2, CNF-3) |
| Alineación tareas → diseño | ✓ | 25/25 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 15/15 componentes, 7/7 interfaces y 8/8 contratos con tarea |
| Alineación con la épica EPIC-23-completar-flujo-de-epic | ✓ | Historia listada en el índice (línea 65) y dueña del ADR nuevo y de la parte de CS-20 sobre `COMPLETED` (líneas 186, 187 y 200) |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

Cambios verificados desde el reporte anterior (`fix-plan-report.md`, 2026-10-29):

- **INC-001 (ERROR B) resuelto:** T025 (`graphify update .`) retirada de `tasks.md` § 8 (C-01). El ID T025 no se reutiliza; T026 conserva el suyo.
- **INC-002 (WARNING D) resuelto:** `specs/flow/EPIC-23-completar-flujo-de-epic/epic.md` ya lista STORY-175 (línea 65), declara la dependencia de STORY-171 (línea 66) y le asigna el ADR nuevo y la parte de CS-20 sobre `COMPLETED` (líneas 186, 187 y 200).
- **Recomendación 3 aplicada:** C8 nombra ahora la fila `COMPLETED` de la tabla de Epic de `state-machine.md` y el actor `Humano (vía epic-complete)` (C-02), alineado con T009.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Un ADR nuevo reemplaza a ADR-0017: admite épicas `COMPLETED/DONE` y `CANCELED/DONE` en el archivo; ADR-0017 `SUPERSEDED` con nota; fila del índice | ✓ | C1, C2, C3; Interfaces «Ruta de épica archivada», «Admisión al archivo», «Nota de reemplazo de ADR-0017»; D-1, D-2, D-3; contratos 1–3 |
| AC-2 | `AGENTS.md`, constitución y dominios documentan a `epic-complete` como escritor de `COMPLETED` de épica con confirmación humana; ningún documento activo afirma que las épicas no se archivan | ✓ | C4–C12; Interfaces «Escritor del archivo de épicas» y «Resolución de épica en `epic-analyze`»; D-5–D-9; contratos 4, 5 y 7 |
| AC-3 | `/epic-creation` y `/epic-from-project-plan` asignan `EPIC-31`, no `EPIC-30`, con `EPIC-30` archivada | ✓ | C13, C14; Interfaz «Universo de numeración de épicas»; F3; D-4; contrato 6 |
| CNF-1 | ADR-0017 solo recibe los tres cambios permitidos | ✓ | C2; Esquema «Cambio en ADR-0017»; contrato 2 |
| CNF-2 | Cadena de fecha `updated:` → `created:` → `date:` para épicas | ✓ | Interfaz «Fecha del prefijo»; D-3; contrato 1 |
| CNF-3 | `verify:repository` y `npm test` en verde | ✓ | C15; D-7 (sin enlaces rotos); contrato 8 |

Referencias de design.md comprobadas en el repositorio (2026-10-29): `docs/adr/` no contiene `ADR-0019-*`; la regla obsoleta está en `skills/epic-analyze/SKILL.md:103`, `skills/epic-creation/SKILL.md:136`, `docs/guides/organization-of-artifacts.md:53`, `docs/guides/root-folder-practices.md:34` y `docs/guides/artifact-directory-migration.md:45`; la nota «ningún skill los escribe» está en `docs/architecture/state-machine.md:178`; `$MAX_EPIC` en `skills/epic-from-project-plan/SKILL.md:55`; los últimos casos de eval son `TC-007`, `TC-011` y `TC-029`, de modo que `TC-008`, `TC-012` y `TC-030` son los siguientes libres.

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Número libre ADR-0019 y estado de ADR-0017 | Context (número del ADR), C1, C2 | ✓ |
| T002 | Estado de la invariante 6 y de `state-machine.md` frente a STORY-170 | D-6; Degradación gradual (STORY-170 antes) | ✓ |
| T003 | Crear ADR-0019 | C1; Esquema «Frontmatter/Secciones de ADR-0019»; D-1–D-4, D-7, D-8 | ✓ |
| T004 | Tres cambios en ADR-0017 | C2; Interfaz «Nota de reemplazo de ADR-0017» | ✓ |
| T005 | Índice de ADRs | C3 | ✓ |
| T006 | `AGENTS.md` | C4; D-9 | ✓ |
| T007 | `docs/constitution.md` | C5 | ✓ |
| T008 | Invariante 6 de `domain-state-management` | C7; D-6, D-8 | ✓ |
| T009 | Nota y fila `COMPLETED` de `state-machine.md` | C8 (nota y fila `COMPLETED`); CR-001 | ✓ |
| T010 | `domain-epic-lifecycle` §5 y §9 | C6; CR-002 | ✓ |
| T011 | `organization-of-artifacts.md` | C9 | ✓ |
| T012 | `root-folder-practices.md` | C10 | ✓ |
| T013 | `artifact-directory-migration.md:45` | C11; D-7; CR-001 | ✓ |
| T014 | `epic-analyze` Paso 1 | C12; D-5; F4 | ✓ |
| T015 | `epic-creation` numeración | C13; D-4; F3 | ✓ |
| T016 | `epic-from-project-plan` Fase 2 y README | C14; D-4; F3 | ✓ |
| T017 | Eval `TC-008` de `epic-creation` | Esquema «Eval por skill»; contrato 6 | ✓ |
| T018 | Eval `TC-012` de `epic-from-project-plan` | Esquema «Eval por skill»; contrato 6 | ✓ |
| T019 | Eval `TC-030` de `epic-analyze` | Esquema «Eval por skill»; contrato 7 | ✓ |
| T020 | Regenerar `docs/index.md` | C15 | ✓ |
| T021 | Tabla «Alcance cerrado» de `story.md` | CR-001, CR-002 | ✓ |
| T022 | Contratos 1–3 | Contratos de verificación 1–3 | ✓ |
| T023 | Contratos 4–5 | Contratos de verificación 4–5 | ✓ |
| T024 | Gate determinista | Contrato 8 | ✓ |
| T026 | Registrar evals pendientes a criterio humano | Contratos 6–7; Risks «Evals no ejecutados por el gate» | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| C1 ADR-0019 | Componentes | T003 | ✓ |
| C2 ADR-0017 | Componentes | T004 | ✓ |
| C3 Índice de ADRs | Componentes | T005 | ✓ |
| C4 `AGENTS.md` | Componentes | T006 | ✓ |
| C5 Constitución | Componentes | T007 | ✓ |
| C6 `domain-epic-lifecycle` | Componentes | T010 | ✓ |
| C7 `domain-state-management` | Componentes | T008 | ✓ |
| C8 `state-machine.md` | Componentes | T009 | ✓ |
| C9 `organization-of-artifacts.md` | Componentes | T011 | ✓ |
| C10 `root-folder-practices.md` | Componentes | T012 | ✓ |
| C11 `artifact-directory-migration.md` | Componentes | T013 | ✓ |
| C12 `epic-analyze` | Componentes | T014, T019 | ✓ |
| C13 `epic-creation` | Componentes | T015, T017 | ✓ |
| C14 `epic-from-project-plan` | Componentes | T016, T018 | ✓ |
| C15 `docs/index.md` | Componentes | T020 | ✓ |
| Ruta de épica archivada | Interfaces | T003, T007, T010–T012 | ✓ |
| Admisión al archivo | Interfaces | T003, T008, T010 | ✓ |
| Fecha del prefijo | Interfaces | T003, T010, T012 | ✓ |
| Escritor del archivo de épicas | Interfaces | T003, T006–T010, T013 | ✓ |
| Universo de numeración de épicas | Interfaces | T015, T016 | ✓ |
| Resolución de épica en `epic-analyze` | Interfaces | T014 | ✓ |
| Nota de reemplazo de ADR-0017 | Interfaces | T004 | ✓ |
| Contratos de verificación 1–8 | Contratos de verificación | T022, T023, T024, T026 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-23-completar-flujo-de-epic

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` línea 65 (Fase COMPLETED, orden STORY-175 → STORY-171 → STORY-172); línea 176 registra su origen en el split de STORY-171 |
| Objetivo de la historia alineado con la épica | ✓ | Habilita `/epic-complete` (CS-19, SMOKE-8) y es dueña del ADR nuevo y de la parte de CS-20 sobre `COMPLETED` de épica (líneas 186, 187 y 200) |
| Restricciones de la épica respetadas | ✓ | CS-21 (gate) cubierto por T024; inmutabilidad de ADR (CNF-1, T004); coordinación con STORY-170 en la invariante 6 y en `state-machine.md` (D-6, T002), como pide la línea 186 |

---

## Inconsistencias Detectadas

Sin inconsistencias detectadas.

---

## Recomendaciones

1. Implementar con `/story-implement-tasks STORY-175`, respetando el orden de entrega STORY-175 → STORY-171 → STORY-172.
2. Al implementar T002, comprobar el estado de STORY-170: si ya editó la invariante 6 o la nota de `state-machine.md`, partir de su texto y conservar la cláusula de `SHIP` (D-6).
3. Los casos `TC-008`, `TC-012` y `TC-030` quedan para `npm run test:eval -- <skill>` a criterio humano (T026; AGENTS.md).

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-175` no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-175` |

⚠️ testcases.md no presente — cobertura de pruebas no evaluada.

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin que cubren los escenarios principales | ✓ | — | AC-1 a AC-3 en bloques `gherkin`; AC-3 como Escenario con Ejemplos para ambos skills |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño por criterio | ✓ | — | Tabla «Cobertura de Criterios de Aceptación» de este reporte |
| Todos los elementos de diseño tienen trazabilidad explícita al AC que satisfacen | ✓ | — | Columna «AC» en Componentes, Interfaces, Decisiones y Contratos; `// satisface: AC-N` en Goals y Esquema de datos |
| No hay decisiones de arquitectura aplazadas | ✓ | — | «Open Questions: Ninguna»; número del ADR (Context), estado inicial (D-2) y comportamiento de `epic-analyze` (D-5) resueltos; CR-001 y CR-002 registrados |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` presente (25 tareas) |
| Si tasks.md existe, DEBE contener únicamente tareas atómicas para todos los escenarios principales | ✓ | — | AC-1: T003–T005, T022; AC-2: T006–T014, T019, T023; AC-3: T015–T018; cada tarea toca un archivo o un contrato; ninguna tarea sin diseño |
| Si testcases.md existe, DEBE contener pruebas para todos los escenarios principales | ✓ | — | No aplica: `testcases.md` no existe |
