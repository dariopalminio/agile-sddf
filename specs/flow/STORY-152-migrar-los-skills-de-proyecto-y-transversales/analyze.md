---
type: analyze
id: STORY-152
slug: STORY-152-analyze-report
title: "Analyze: Migrar los skills de proyecto y transversales"
story: STORY-152
design: STORY-152
tasks: STORY-152
verdict: APPROVED
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-152-migrar-los-skills-de-proyecto-y-transversales
---

<!-- Referencias -->
[[STORY-152-migrar-los-skills-de-proyecto-y-transversales]]

# Reporte de Coherencia: Migrar los skills de proyecto y transversales

## Veredicto

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo D, E

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 4/4 criterios cubiertos (más CNF-1, CNF-2 y CNF-3) |
| Cobertura de ACs en testcases.md | ⚠️ | no evaluada — testcases.md no presente |
| Alineación tareas → diseño | ✓ | 40/40 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 16/16 componentes y 8/8 interfaces con tarea |
| Alineación con la épica EPIC-26-layout-y-flow-forward-mejorado | ⚠️ | alineada; la Verificación 2 de `skill-preflight` recomienda `/sddf-init` también en un repo legado, donde CS-13 impide que cree el layout (INC-001) |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 6/7 criterios ✓; atomicidad de T016 y T026 (INC-002) |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Skills transversales retirados de la lista transitoria; el gate no reporta referencias legadas; `/memory-system index` lista `specs/flow/` | ✓ | D-1 (bloque canónico), D-2 (mapa de rutas), D-3 (`--root docs`), D-4 (origen flow), D-5 (diez capas), D-7, D-8, D-11 (retiro de `PENDING_MIGRATION`), D-13; F-1, F-4; contratos 1, 3–7 |
| AC-2 | Preflight con layout legado: nombra cada señal presente, omite las ausentes, remite a la guía y no modifica archivos | ✓ | D-9 (señales L1–L3 en la región `SDDF-LEGACY-DIAGNOSTIC`, cierre con la guía, sin escrituras), D-12 (TC-006, TC-007); F-2; contratos 2, 10, 11 |
| AC-3 | Preflight con layout fijo: confirma las cinco rutas y no emite avisos legados | ✓ | D-9 (Verificación 2 y Verificación 3 vacía), D-12 (TC-005); F-3; contrato 10 |
| AC-4 | `docs-wiki-builder` eliminado, sin menciones vigentes y con CHANGELOG `BREAKING` | ✓ | D-10 (tabla de archivos y CHANGELOG), D-11 (retiro de la lista), D-14; contratos 8, 9 |
| CNF-1 | `SPECS_BASE`/`SDDF_ROOT` solo como texto de diagnóstico en `skill-preflight` | ✓ | D-1, D-9 (uso acotado de tokens: región, README y evals); contratos 2, 5 |
| CNF-2 | Evals con rutas fijas; ejecución a criterio humano | ✓ | D-7, D-12; contratos 12, 15 |
| CNF-3 | 0 coincidencias en los skills de AC-1 | ✓ | D-1, D-2, D-3 (incluye scripts del motor); contrato 1 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Verificar precondiciones (ADR-0016, validador, lista con doce entradas) | Risks, CR-001 | ✓ |
| T002 | Línea base e inventario grep | Context, D-2 | ✓ |
| T003 | `git rm -r skills/docs-wiki-builder/` | D-10 | ✓ |
| T004 | Quitar el alias de `memory-system/SKILL.md` y de su eval | D-10 | ✓ |
| T005 | Menciones del alias en la arquitectura, la guía, el runbook y el README | D-10 | ✓ |
| T006 | CHANGELOG `### Removed` | D-10 | ✓ |
| T007 | Retirar doce entradas de `PENDING_MIGRATION` y confirmar RED | D-11 | ✓ |
| T008 | Migrar `project-begin` | D-1, D-2 | ✓ |
| T009 | Migrar `project-discovery` | D-1, D-2 | ✓ |
| T010 | Migrar `project-planning` y su rol | D-1, D-2, D-8 | ✓ |
| T011 | Migrar `project-story-mapping` | D-1, D-2 | ✓ |
| T012 | Migrar `project-context-diagram` y sus ejemplos | D-1, D-2 | ✓ |
| T013 | Migrar `project-flow` (con `CLI_ROOT`) | D-1, D-2 | ✓ |
| T014 | Migrar `header-aggregation/SKILL.md` | D-1, D-7 | ✓ |
| T015 | Migrar `reverse-engineering` (con `CLI_ROOT`) | D-1, D-2 | ✓ |
| T016 | Migrar `sddf-constitution` (38 rutas e imports) | D-1, D-2 | ✓ (ver INC-002) |
| T017 | Mover los fixtures de `header-aggregation` y limpiar `sddf.config.yaml` | D-7 | ✓ |
| T018 | Evals de `header-aggregation` | D-7, D-12 | ✓ |
| T019 | Pruebas nuevas del motor (RED) | D-13, D-4, D-5 | ✓ |
| T020 | Origen flow en `memory-system.js` | D-4 | ✓ |
| T021 | `LAYERS` con diez capas, `KNOWN_LAYERS` explícito, semillas `specs/` eliminadas | D-5 | ✓ |
| T022 | `SPECS_BASE` → `DOCS_DIR` en los scripts | D-3, D-6 | ✓ |
| T023 | Sección «Work items (specs/flow/)» del template del índice | D-4 | ✓ |
| T024 | Mover los fixtures de proyecto actual y limpiar `sddf.config.yaml` | D-12, D-6 | ✓ |
| T025 | Adaptar las pruebas existentes (GREEN) | D-13 | ✓ |
| T026 | Migrar `memory-system/SKILL.md` | D-1, D-3, D-4, D-5, D-6 | ✓ (ver INC-002) |
| T027 | README y `references/` de `memory-system` | D-3, D-4, D-5 | ✓ |
| T028 | Evals de `memory-system` | D-12 | ✓ |
| T029 | Reescribir `skill-preflight/SKILL.md` (contrato, verificaciones 1, 2, 4 y 5, informe) | D-9 | ✓ (ver INC-001) |
| T030 | Verificación 3 en la región de diagnóstico | D-9 | ✓ |
| T031 | `skill-preflight/README.md` | D-9 | ✓ |
| T032 | Evals de `skill-preflight` (retirar TC-001–TC-003; TC-005–TC-007) | D-12 | ✓ |
| T033 | Documentación del motor (diez capas, origen flow) | D-14 | ✓ |
| T034 | `npm run verify:layout` en verde | D-11, contrato 4 | ✓ |
| T035 | Greps de los contratos 1, 2, 3, 5 y 8 | Contratos de verificación | ✓ |
| T036 | Revisión de los contratos 9, 10 y 11 | Contratos de verificación | ✓ |
| T037 | Validación de evals (`--dry-run`) | D-12, contrato 12 | ✓ |
| T038 | `npm test` y `verify:repository` | Contratos 4, 6, 7, 13 | ✓ |
| T039 | Alcance del diff | Contrato 14, Non-Goals | ✓ |
| T040 | `graphify update` e `implement-report.md` | Risks, CR-001–CR-003 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Ubicación en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Skills de proyecto | Componentes afectados | T008–T013 | ✓ |
| Rol de planning | Componentes afectados | T010 | ✓ |
| Ejemplos de diagrama C4 | Componentes afectados | T012 | ✓ |
| Normalización de frontmatter | Componentes afectados, D-7 | T014 | ✓ |
| Fixtures y evals de frontmatter | Componentes afectados, D-7 | T017, T018 | ✓ |
| Ingeniería inversa | Componentes afectados | T015 | ✓ |
| Constitución y DoD | Componentes afectados | T016 | ✓ |
| Skill de memoria | Componentes afectados | T004, T026, T027 | ✓ |
| Motor de memoria | Componentes afectados, D-3–D-5 | T020, T021, T022 | ✓ |
| Semillas e índice | Componentes afectados, D-4, D-5 | T021, T023 | ✓ |
| Fixtures y evals de memoria | Componentes afectados, D-12 | T024, T028 | ✓ |
| Diagnóstico de entorno | Componentes afectados, D-9 | T029–T032 | ✓ |
| Alias del índice | Componentes afectados, D-10 | T003 | ✓ |
| Lista transitoria del gate | Componentes afectados, D-11 | T007, T034 | ✓ |
| Pruebas del motor | Componentes afectados, D-13 | T019, T025 | ✓ |
| Documentación | Componentes afectados, D-10, D-14 | T005, T006, T033 | ✓ |
| Interfaz: Paso 0 de cada skill | Interfaces | T008–T016, T026, T029 | ✓ |
| Interfaz: rutas de conocimiento | Interfaces | T008–T016, T026–T027 | ✓ |
| Interfaz: rutas de work items | Interfaces | T010, T014, T020 | ✓ |
| Interfaz: invocación del motor `--root docs` | Interfaces | T026 | ✓ |
| Interfaz: origen flow del índice | Interfaces | T019, T020, T023 | ✓ |
| Interfaz: catálogo `LAYERS` | Interfaces | T021, T025 | ✓ |
| Interfaz: diagnóstico (Verificaciones 2 y 3) | Interfaces | T029, T030 | ✓ |
| Interfaz: gate | Interfaces | T007, T034, T038 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-26-layout-y-flow-forward-mejorado

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` › Historias: STORY-152 «Migrar los skills de proyecto y transversales», con el mismo alcance (incluidos el diagnóstico de `skill-preflight` y la eliminación de `docs-wiki-builder`) |
| Objetivo alineado | ✓ | Contribuye a CS-2 (grep vacío salvo el diagnóstico de `skill-preflight`), CS-3 (ningún skill lee `root`) y CS-8 (D-5: `memory-system scaffold` deja de crear `docs/specs/`, CR-002 de STORY-149) |
| Restricciones respetadas | ⚠️ | Respeta los Non-Goals (Living Spec, Enforcement, guía de STORY-154). Sin embargo, D-9 › Verificación 2 recomienda `ejecuta /sddf-init` para cada ruta fija ausente también en un repo con señales legadas, donde CS-13 y SMOKE-6 hacen que `/sddf-init` solo emita un aviso y no cree `specs/flow/` (INC-001) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D
- **Descripción:** en un repo con layout legado (fixture de AC-2 / eval TC-007 de D-12), la Verificación 2 emite `[WARNING] <ruta> no encontrado — ejecuta /sddf-init` para las cinco rutas fijas ausentes. Por CS-13 y SMOKE-6 de la épica (STORY-149 D-5), `/sddf-init` sobre `docs/specs/` no crea `specs/flow/` y remite a la guía de migración. El diagnóstico daría dos remisiones distintas para el mismo estado, y una de ellas no tiene efecto.
- **Archivo afectado:** design.md — sección "D-9 — `skill-preflight`…", fila «Verificación 2 — Layout fijo (AC-3)»; tasks.md — T029.
- **Acción requerida:** en D-9, condicionar la sugerencia: sin señales legadas, `— ejecuta /sddf-init`; con alguna señal L1–L3, `— ver la guía de migración` (o sin sufijo, ya que la línea `ℹ️ Guía de migración` cierra la Verificación 3). Reflejarlo en T029 y añadir al eval TC-007 de D-12 que no aparece `ejecuta /sddf-init` cuando L1 está presente.

### INC-002 [WARNING]

- **Tipo:** E
- **Descripción:** el criterio DoD «tasks.md DEBE contener únicamente tareas atómicas» queda en duda para dos tareas. T026 migra `memory-system/SKILL.md` completo (47 coincidencias en más de diez secciones: Paso 0, invocaciones, catálogo, origen flow, migradores, R4 de la l. 327, degradación inline y Salida). T016 migra 38 rutas e imports de `sddf-constitution`. Ambas son mecánicas, pero T026 combina reescritura de rutas con cambios de comportamiento documentado (catálogo de diez capas, origen flow), y supera con facilidad una sesión de ≤ 2 horas.
- **Archivo afectado:** tasks.md — grupo «5. `memory-system`», T026; grupo «4.», T016.
- **Acción requerida:** dividir T026 en (a) Paso 0, invocaciones `--root docs` y sustitución de `$SPECS_BASE` y (b) catálogo de diez capas, origen flow, migradores legados y l. 327 (R4). T016 puede quedarse como está o dividirse por secciones (constitución / guardrails).

---

## Recomendaciones

1. **INC-001:** en design.md › D-9, hacer condicional el sufijo de la Verificación 2 (`ejecuta /sddf-init` solo sin señales legadas); actualizar T029 y añadir al eval TC-007 de D-12 la ausencia de `ejecuta /sddf-init` con L1 presente. Es una opción preferida y de cambio mínimo.
2. **INC-002:** dividir T026 en dos tareas atómicas (rutas/Paso 0 y comportamiento documentado del motor), con IDs nuevos y las referencias de tasks.md actualizadas.
3. Antes de implementar, confirmar las precondiciones de CR-001 (STORY-147 y STORY-148 en `DONE`); T001 ya lo comprueba.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada. Las pruebas de la historia están definidas en design.md (D-12 evals, D-13 pruebas unitarias, contratos de verificación) y se ejecutan desde tasks.md (T019, T025, T032, T034–T038).

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-152` no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-152` |

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1–AC-4 en bloques `gherkin` con Dado/Cuando/Entonces (y `Pero` en AC-2 y AC-4) |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | Tabla «Cobertura de Criterios de Aceptación»: 4/4 más los CNF |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | D-1–D-14 con `// satisface:`; la tabla de componentes y la de interfaces tienen columna AC. D-15 es un orden de ejecución, no un elemento de diseño |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | «Open Questions: Ninguna»; dependencias en CR-001–CR-003 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | Existe tasks.md |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ⚠️ | WARNING | Todos los escenarios tienen tareas; T026 y T016 son voluminosas (INC-002) |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: testcases.md no existe (vía `/story-implement-tasks`) |
