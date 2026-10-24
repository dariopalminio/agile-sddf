---
type: analyze
id: STORY-154
slug: STORY-154-analyze-report
title: "Analyze: Documentar el nuevo layout"
story: STORY-154
design: STORY-154
tasks: STORY-154
verdict: APPROVED
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-154-documentar-el-nuevo-layout
---

# Reporte de Coherencia: Documentar el nuevo layout

## Veredicto

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo D

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (más CNF-1 y CNF-2) |
| Alineación tareas → diseño | ✓ | 32/32 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 18/18 elementos con tarea (12 componentes, 6 interfaces) |
| Alineación con la épica EPIC-26 | ⚠️ | Listada y alineada; 2 avisos de coordinación (INC-001, INC-002) |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

⚠️ testcases.md no encontrado: la cobertura de ACs en casos de prueba se omite. Es intencional en EPIC-26: las pruebas están en los «Contratos de verificación» de design.md y en el grupo 7 de tasks.md.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | `AGENTS.md` documenta `docs/`, `specs/`, `workflow/`, la convención de `archive/` y el destino de `docs/requirements/`; la arquitectura y `docs/index.md` reflejan el layout y no presentan `SDDF_ROOT`/`root`/`SPECS_BASE` como vigentes | ✓ | D-2 (l. 83), D-3 (l. 99), D-4 (l. 117), D-5 (l. 136), D-6 (l. 152), D-9 (l. 226); contratos 1–4 (l. 327) |
| AC-2 | La guía de migración tiene una sección de `docs/specs/` a `specs/flow/` y del retiro de `root`; el CHANGELOG registra el cambio incompatible (versión mayor) y enlaza la sección | ✓ | D-8 (l. 183), D-10 (l. 247); interfaz «Ancla de la sección de migración» (l. 280); contratos 5–7 |
| AC-3 | El chequeo de enlaces termina sin errores; una guía con una ruta inexistente de `docs/specs/` hace fallar el gate nombrando el archivo | ✓ | D-1 (l. 68, secuencia que mantiene el gate en verde), D-2 (convención enlace / code span), D-7 (l. 165, prueba de regresión); F-2 (l. 305); contratos 7–9 |
| CNF-1 | Veracidad: cada ruta y capacidad se verifica antes de escribirla | ✓ | D-1, D-2, D-4 (corrige la ruta inexistente `docs/specs/01-projects/…`), D-8 (comprueba cada comando contra el skill entregado); F-3; contratos 2–3 |
| CNF-2 | Documentación en español | ✓ | D-4, D-8, D-9; contrato 11 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Precondiciones de STORY-147/148/152 y `docs/specs/` presente | D-1, F-3 | ✓ |
| T002 | Gate en verde antes de empezar | D-1, F-2 | ✓ |
| T003 | Inventario clasificado con `git grep` | D-2, D-3, F-1 paso 2 | ✓ |
| T004 | Confirmar el ancla con `githubAnchor` | D-8, interfaz «Ancla» | ✓ |
| T005 | Verificar hechos contra los skills entregados | D-8, D-10, F-3 | ✓ |
| T006 | Encabezado y «A quién aplica» de la sección 5.0.0 | D-8 | ✓ |
| T007 | Tabla origen → destino | D-8, D-2 | ✓ |
| T008 | Once pasos y notas | D-8 | ✓ |
| T009 | Notas de las secciones 1.x→2.x y 4.0.0 | D-8, D-2 | ✓ |
| T010 | Viñeta «Layout fijo» y ruta de la línea 3 de `AGENTS.md` | D-4 | ✓ |
| T011 | Viñeta «Transición EPIC-26» y entrada «Layout» | D-4, interfaz «Fuente de skills pendientes» | ✓ |
| T012 | `sddf-architecture.md` §5–§8 | D-5 | ✓ |
| T013 | `memory-system.md` y `architecture/README.md` | D-5 | ✓ |
| T014 | Reescritura de `root-folder-practices.md` | D-9 | ✓ |
| T015 | `sddf-commands-pipeline.md` | D-9 | ✓ |
| T016 | `skill-structural-pattern.md` y `organization-of-artifacts.md` | D-9 | ✓ |
| T017 | `harness-eng-agents-orchestration.md` y `best-practices-for-skills.md` | D-9 | ✓ |
| T018 | Árbol de `flight-leves-model.md` | D-9, D-2 | ✓ |
| T019 | Filas de `docs/guides/README.md` con el ancla | D-9, interfaz «Ancla» | ✓ |
| T020 | `docs/constitution.md` | D-3, D-9 | ✓ |
| T021 | `README.md` raíz | D-3, D-9 | ✓ |
| T022 | `### BREAKING` en `[Unreleased]` | D-10 | ✓ |
| T023 | Regenerar `docs/index.md` | D-6, interfaz «Generación del índice» | ✓ |
| T024 | Caso de regresión en `test/check-doc-links.test.js` | D-7, interfaz «Error del gate» | ✓ |
| T025 | Contratos 1 y 2 | Contratos de verificación | ✓ |
| T026 | Contrato 3 | Contratos de verificación, D-2 | ✓ |
| T027 | Contrato 4 | Contratos de verificación | ✓ |
| T028 | Contratos 5 y 6 | Contratos de verificación | ✓ |
| T029 | Contratos 7 y 8 | Contratos de verificación | ✓ |
| T030 | Contrato 9 | Contratos de verificación, F-2 | ✓ |
| T031 | Contratos 10 y 11 | Contratos de verificación, Non-Goals | ✓ |
| T032 | `implement-report.md` con contratos y CRs; `graphify update .` | Registro de Cambios (CR); la parte de `graphify update` sale de la regla de `AGENTS.md` y no de un elemento del diseño | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Entrada IA (`AGENTS.md`) | Componentes afectados (l. 261), D-4 | T010, T011, T025 | ✓ |
| Arquitectura del framework | D-5 | T012, T027 | ✓ |
| Arquitectura de memoria | D-5 | T013 | ✓ |
| Índice de arquitectura | D-5 | T013 | ✓ |
| Índice wiki (`docs/index.md`) | D-6 | T023, T027 | ✓ |
| Guía de migración | D-8 | T006–T009, T028 | ✓ |
| Guía de raíces | D-9 | T014 | ✓ |
| Guías afectadas | D-9 | T015–T019 | ✓ |
| Constitución | D-3, D-9 | T020 | ✓ |
| Portada del paquete | D-3, D-9 | T021 | ✓ |
| Registro de cambios | D-10 | T022, T028 | ✓ |
| Prueba del checker | D-7 | T024, T029 | ✓ |
| Interfaz: ancla de la sección de migración | Interfaces (l. 280) | T004, T014, T019, T022, T029 | ✓ |
| Interfaz: destino de los avisos | Interfaces | T005, T009 (la ruta del archivo no cambia) | ✓ |
| Interfaz: error del gate | Interfaces, D-7 | T024, T029 | ✓ |
| Interfaz: generación del índice | Interfaces, D-6 | T023 | ✓ |
| Interfaz: fuente de skills pendientes | Interfaces, D-4 | T001, T011 | ✓ |
| Interfaz: convención de citas | Interfaces, D-2 | T003, T007, T026 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-26-layout-y-flow-forward-mejorado

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` § Historias: `- [ ] **STORY-154** — Documentar el nuevo layout`, con el mismo alcance (`AGENTS.md`, arquitectura, índice, guías, CHANGELOG, sección de migración) |
| Objetivo de la historia alineado con la épica | ✓ | Cubre CS-9 (`AGENTS.md`), CS-14 (guía y CHANGELOG) y parte de CS-12 (gate); remite a la guía de CS-13 (`/sddf-init`) y al diagnóstico de `skill-preflight` (STORY-152) |
| Restricciones de la épica respetadas | ⚠️ | Respeta CS-10 (`docs/requirements/` intacto, contrato 10), CS-11 (sin script de migración para practitioners, D-8) y la inmutabilidad de ADRs. Avisos de coordinación: secuencia de ejecución no fijada en la épica (INC-001) y alcance ampliado a `docs/constitution.md` y `README.md` (INC-002) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D
- **Descripción:** design.md D-1 exige implementar STORY-154 después de las migraciones de skills y **antes** de STORY-153, porque entre STORY-153 y STORY-157 el gate queda en rojo por diseño de esas historias. Ni EPIC-26 ni `story.md` de STORY-153 lo declaran: la épica solo enumera las historias, y STORY-153 no tiene la precondición «STORY-154 entregada». Tampoco consta en ninguna historia que STORY-157 deba retirar la viñeta «Transición EPIC-26» de `AGENTS.md`.
- **Archivo afectado:** `docs/specs/epics/EPIC-26-layout-y-flow-forward-mejorado/epic.md` — sección «Notas»; `docs/specs/stories/STORY-153-migrar-work-items-specs-flow/story.md` — «Notas / contexto adicional»; `docs/specs/stories/STORY-157-reparar-enlaces-tras-migracion/story.md` — AC-3 (design.md CR-002, l. 371)
- **Acción requerida:** registrar el orden 147 → 148 → {149–152, 155, 156, 158} → 154 → 153 → 157 en las Notas de EPIC-26 y la precondición en STORY-153, y añadir a STORY-157 la retirada de la viñeta de transición.

### INC-002 [WARNING]

- **Tipo:** D
- **Descripción:** D-3 (l. 99) amplía el alcance a `docs/constitution.md` y `README.md`, que ni la épica ni AC-1 nombran. La justificación es sólida (la constitución prevalece sobre `AGENTS.md` y `README.md` es la portada del practitioner), pero el alcance escrito de la historia queda por detrás del diseño. Quedan además sin dueño las menciones legadas de `docs/runbooks/actualizar-spec-de-proyecto.md`, `docs/product/` y `docs/domains/`.
- **Archivo afectado:** `docs/specs/stories/STORY-154-documentar-el-nuevo-layout/story.md` — AC-1 y Notas (design.md CR-001, l. 365)
- **Acción requerida:** añadir a AC-1 o a las Notas de la historia «incluye `docs/constitution.md` y `README.md`» y asignar el runbook y las capas `product/`/`domains/` a STORY-157 o a una historia de deuda.

---

## Recomendaciones

1. **INC-001:** editar las Notas de `EPIC-26/epic.md` con la secuencia de ejecución de D-1. Añadir a «Notas / contexto adicional» de `STORY-153/story.md` la precondición «STORY-154 entregada (el gate debe estar en verde antes de mover work items)». Añadir a AC-3 de `STORY-157/story.md` un `Y` que retire la viñeta «Transición EPIC-26» de `AGENTS.md`.
2. **INC-002:** en `STORY-154/story.md`, extender el `Entonces` de AC-1 o las Notas con `docs/constitution.md` y `README.md`. Abrir una nota de deuda, o ampliar STORY-157, para `docs/runbooks/actualizar-spec-de-proyecto.md`, `docs/product/roadmap.md`, `docs/product/stakeholders.md`, `docs/domains/domain.md` y `docs/domains/domain-epic-lifecycle.md`.
3. **Fuera de los hallazgos (CR-003 de design.md):** antes de publicar, decidir con el CHANGELOG si se publica 4.2.0 antes de 5.0.0, porque `[Unreleased] › Deprecated` promete eliminar `story-improve` en 5.0.0 «desde 4.2.0».

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-154` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-154` |

---

## Cumplimiento DoD — Fase PLAN

DoD: `docs/guardrails/dod-story-plan.md` (`enforcement: error`), 7 criterios.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 a AC-3 en bloques `gherkin` con `Dado`/`Cuando`/`Entonces`; AC-3 cubre el escenario de error |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | Tabla «Cobertura de Criterios de Aceptación»: 3/3 |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | D-1 a D-10 llevan `// satisface:`; «Componentes afectados» e «Interfaces» tienen columna AC; F-1/F-2 anotan su AC |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | «Open Questions: Ninguna» (l. 352); ambigüedades en CR-001 a CR-003 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` presente (32 tareas) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | Cada tarea toca un archivo o un contrato; AC-1 (T010–T021, T023, T025–T027), AC-2 (T006–T009, T019, T022, T028), AC-3 (T001–T002, T024, T029–T030) |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: `testcases.md` no existe por decisión para EPIC-26 |
