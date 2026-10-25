---
type: analyze
id: STORY-153
slug: STORY-153-analyze-report
title: "Analyze: Migrar y archivar los work items a specs/flow"
story: STORY-153
design: STORY-153
tasks: STORY-153
verdict: APPROVED
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-153-migrar-work-items-specs-flow
---

<!-- Referencias -->
[[STORY-153-migrar-work-items-specs-flow]]

# Reporte de Coherencia: Migrar y archivar los work items a specs/flow

## Veredicto

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo D

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 2/2 criterios cubiertos (y 4/4 CNF) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada — testcases.md no presente (modo `--only-tasks`) |
| Alineación tareas → diseño | ✓ | 21/21 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 9/9 elementos con tarea (4 componentes, 5 interfaces) |
| Alineación con la épica EPIC-26-layout-y-flow-forward-mejorado | ⚠️ | Listada y alineada; la regla de fecha se amplía con `date:` (INC-001) |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Migrar y archivar: épicas → `specs/flow/EPIC-NN-<slug>/`, `COMPLETED` → `archive/<fecha>-STORY-…/`, resto → `specs/flow/STORY-…/`, `docs/specs/` deja de existir, total conservado | ✓ | D-1, D-2 (inventario, l. 87), D-3 (destinos, l. 104), D-4 (fecha, l. 119), D-5 (guardias, l. 130), D-6 (ejecución y `rmdir`, l. 147), D-8 (totales, l. 177), D-11 (corte, l. 210); contratos 1–3, 6–8, 10 |
| AC-2 | Dry-run lista origen → destino sin modificar nada; segunda ejecución sin cambios | ✓ | D-7 (idempotencia y `--dry-run`, l. 163), D-9 (`[MOVERÍA]`, `[SIN CAMBIOS]`, l. 186), Flujos clave (l. 267); contratos 4, 5 y 10 |
| CNF-1 | Un solo uso, sin eventos ni log | ✓ | D-1 (sin skill ni subcomando; salida solo por consola), contrato 8 |
| CNF-2 | Node.js sin dependencias nuevas; `CANCELED` no se archiva | ✓ | D-1 (solo `fs`, `path`, `child_process`), D-3 (regla binaria `COMPLETED`), contrato 9 |
| CNF-3 | Conserva historial git | ✓ | D-5 y D-6 (`git mv` sin shell, renombres en el índice), contrato 3; `git log --follow` delegado a STORY-157 |
| CNF-4 | `docs/requirements/` intacto | ✓ | Non-Goals, D-11, contrato 11 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Verificar precondiciones (skills migrados, ADR-0016) | D-11, story Notas (Precondiciones) | ✓ |
| T002 | Línea base (`npm test`, recuentos, `git status`) | Context, D-8, contrato 11 | ✓ |
| T003 | Aplicar CR-001 en `story.md` AC-1 y nota de la épica | D-4, CR-001 | ✓ |
| T004 | Helper de fixture git temporal en el test | D-10 | ✓ |
| T005 | Casos AC-1: destinos, renombres `R`, sin artefactos extra | D-3, D-6, D-8, contratos 1, 3, 8 | ✓ |
| T006 | Casos de fecha y bloqueo sin fecha | D-4, contrato 2 | ✓ |
| T007 | Casos AC-2: dry-run y segunda pasada | D-7, contratos 4, 5 | ✓ |
| T008 | Casos de guardias y aviso por archivo sin versionar | D-2, D-5, contratos 6, 7 | ✓ |
| T009 | RED: el test falla sin script | D-10 | ✓ |
| T010 | Esqueleto del script, `git()` sin shell, exportaciones, `main()` | D-1, Interfaces | ✓ |
| T011 | Lectura de frontmatter y `archiveDate` | D-3, D-4 | ✓ |
| T012 | `planMigration` (inventario, destinos, bloqueos, avisos, totales) | D-2, D-3, D-5, D-8, Esquema de datos | ✓ |
| T013 | `runMigration` (sin cambios, dry-run, ejecución, post-condición, resumen) | D-6, D-7, D-8, D-9, Flujos clave | ✓ |
| T014 | GREEN: test en verde | contratos 1–8 | ✓ |
| T015 | REFACTOR y revisión de restricciones | D-1, D-6, contratos 8, 9 | ✓ |
| T016 | `npm test` y `verify:syntax` en verde | contrato 12 | ✓ |
| T017 | Dry-run sobre el repo | D-11 paso 1, contrato 10 | ✓ |
| T018 | Ejecución real y verificación de totales | D-6, D-8, D-11 paso 2, contratos 10, 11 | ✓ |
| T019 | Segunda ejecución sin cambios | D-7, D-11 paso 3 | ✓ |
| T020 | Reinstalar copias de runtime | D-11 paso 4, Risks | ✓ |
| T021 | Artefactos en la ruta nueva y traspaso de CR-002/CR-003 | D-11 paso 5, CR-002, CR-003 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Migración única `scripts/migrate-specs-to-flow.js` | Componentes afectados (l. 226), D-1 | T010–T013, T015 | ✓ |
| Prueba `test/migrate-specs-to-flow.test.js` | Componentes afectados, D-10 | T004–T009, T014 | ✓ |
| Work items del repo (movimiento) | Componentes afectados, D-11 | T017–T019 | ✓ |
| Copias de runtime (reinstalación) | Componentes afectados, D-11 paso 4 | T020 | ✓ |
| CLI `node scripts/migrate-specs-to-flow.js [--dry-run]` | Interfaces (l. 237) | T010, T017–T019 | ✓ |
| `planMigration({ repoRoot })` | Interfaces | T012 | ✓ |
| `runMigration({ repoRoot, dryRun })` | Interfaces | T013 | ✓ |
| `archiveDate(frontmatter)` | Interfaces | T011, T006 | ✓ |
| Invocación de git sin shell | Interfaces | T010 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-26-layout-y-flow-forward-mejorado

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` l. 28: STORY-153 — script de un solo uso con `--dry-run`, idempotente, `git mv` y eliminación de `docs/specs/`, sin eventos ni log. |
| Objetivo de la historia alineado con la épica | ✓ | Cubre CS-4, CS-5, CS-7, CS-10, CS-11 y SMOKE-4; CS-6 se garantiza con `git mv` y su verificación queda en STORY-157, como declara la historia. |
| Restricciones de la épica respetadas | ⚠️ | La nota «Fecha del prefijo de archivo» (`epic.md` l. 115) fija `updated:` → `created:`; el diseño añade `date:` como tercer nivel para 37 stories `COMPLETED` que solo tienen ese campo (D-4, CR-001). Épicas no archivadas y `CANCELED` en `specs/flow/` respetados (D-3). |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D: desalineación con la épica
- **Descripción:** La regla de fecha del prefijo de archivo de la épica (`epic.md` l. 115) y de AC-1 (`story.md` l. 27–36) solo contempla `updated:` y `created:`. El diseño (D-4, l. 119; CR-001, l. 320) añade `date:` como tercer nivel porque 37 stories `COMPLETED` (STORY-001 a STORY-049 y STORY-087) no tienen ninguno de los dos. La decisión es correcta y está registrada, pero la especificación aún no la refleja.
- **Archivo afectado:** `story.md` — sección "AC-1"; `epic.md` de EPIC-26 — sección "Notas" (Fecha del prefijo de archivo); ADR-0016 (STORY-147, aún no creado)
- **Acción requerida:** Ejecutar T003 al iniciar la implementación (actualiza AC-1 y la nota de la épica) e incluir el nivel `date:` en ADR-0016 al implementar STORY-147.

---

## Recomendaciones

1. **INC-001:** aplicar T003 antes de T004, de modo que `story.md` AC-1 diga «con la fecha de su "updated:" (o "created:" si falta, o "date:" si faltan ambos)» y la nota de EPIC-26 l. 115 coincida; si STORY-147 se implementa antes, añadir `date:` a la convención de archivo de ADR-0016 (D-3 de su design).
2. **Traspasos (no son inconsistencias de esta historia):** CR-002 (reescribir `specs/README.md` al layout fijo) debe añadirse al alcance de STORY-154, y CR-003 (retirar `root: docs` de `sddf.config.yaml`) al de STORY-157, antes de planificarlas.
3. **Gate rojo esperado:** tras T018, `verify:links`/`verify:repository` fallan por los 162 enlaces de `docs/index.md` hasta STORY-157 (design Risks); conviene planificar e implementar STORY-157 inmediatamente después para no dejar la rama con el gate en rojo.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada. Los escenarios de AC-1 y AC-2 están definidos como pruebas automatizadas en design.md (`## Contratos de verificación`, contratos 1–8) y en tasks.md (T005–T008).

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-153` no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-153` |

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin que cubren los escenarios principales | ✓ | — | AC-1 (Dado/Cuando/Entonces/Y) y AC-2 (Dado/Cuando/Entonces/Pero/Y), `story.md` l. 27–45 |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño por criterio | ✓ | — | AC-1: D-2–D-6, D-8, D-11; AC-2: D-7, D-9 |
| Todos los elementos de diseño tienen trazabilidad explícita (`// satisface: AC-N`) | ✓ | — | D-1 a D-11 y Esquema de datos con `// satisface:`; tablas de Componentes, Interfaces y Contratos con columna AC |
| No hay decisiones de arquitectura aplazadas | ✓ | — | Open Questions: ninguna bloqueante; ambigüedades resueltas en D-3/D-4 y registradas como CR-001 a CR-003 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` presente (21 tareas) |
| Si tasks.md existe contiene únicamente tareas atómicas para todos los escenarios principales | ✓ | — | AC-1: T005, T006, T008, T012, T013, T018; AC-2: T007, T013, T017, T019; cada tarea nombra archivo, comando o verificación concreta |
| Si testcases.md existe contiene pruebas para todos los escenarios principales | ✓ | — | No aplica: testcases.md no existe (modo `--only-tasks`) |
