---
type: analyze
id: STORY-171
slug: STORY-171-analyze-report
title: "Analyze: Skill epic-complete (Core) — completar y archivar una épica liberada"
story: STORY-171
design: STORY-171
tasks: STORY-171
verdict: APPROVED
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-171-completar-archivar-epica-liberada
---

<!-- Referencias -->
[[STORY-171-completar-archivar-epica-liberada]]

# Reporte de Coherencia: Skill epic-complete (Core) — completar y archivar una épica liberada

## Veredicto

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo D

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (y CNF-1 a CNF-6) |
| Alineación tareas → diseño | ✓ | 29/29 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 18/18 elementos con tarea (10 componentes + 8 interfaces) |
| Alineación con la épica EPIC-23-completar-flujo-de-epic | ⚠️ | Alineada; la línea F2 de STORY-171 en `epic.md` describe un alcance anterior al split (INC-001) |
| Cumplimiento DoD — Fase PLAN | ✓ | 6/7 criterios ✓ (1 no aplica: testcases.md ausente por `--only-tasks`) |

> ⚠️ `testcases.md` no presente (pipeline `--only-tasks`): la cobertura de ACs en casos de prueba no se evaluó. Las pruebas están especificadas como contratos de verificación 1–13 en `design.md` y como tareas T018–T022.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | `SHIP/DONE` + confirmación → `COMPLETED/DONE`, archivada en `specs/flow/archive/<YYYY-MM-DD>-EPIC-NN-<slug>/` con historial de git, fechas de cierre y versión legibles | ✓ | Motor (Componentes), «Frontmatter de `epic.md` tras `complete`», «Resolución de la versión liberada», F1, F5, D-4, D-5, D-7, D-8; contratos 1–3, 7, 10 |
| AC-2 | `VALIDATE/DONE` → informa los estados admitidos; nada cambia ni se mueve | ✓ | «Tabla de admisión por estado» con el mensaje literal de `NOT_SHIPPED`, F2, D-3, D-9, `references/error-codes.md`; contratos 4, 6, 11 |
| AC-3 | Sin confirmación → la épica conserva `SHIP/DONE` en `specs/flow/` | ✓ | F3, D-2 (solo `s`/`si`/`sí`, sin `--yes` ni modo automático); contrato 12 |

CNF: CNF-1 (D-7, F1, contrato 2), CNF-2 (D-6, «Destino», contrato 5), CNF-3 (D-2, F3), CNF-4 (Componentes · Paso 0, contrato 9), CNF-5 (D-10), CNF-6 (D-1, D-10, contrato 9).

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Crear `skills/epic-complete/` con `skill-master` | Componentes (todos los de `skills/epic-complete/`), D-1 | ✓ |
| T002 | Constantes, regex y utilidades portadas de `story-complete.js` | Motor; «Destino»; D-1, D-6, D-7 | ✓ |
| T003 | `countEpics` y `locateEpic` | API del módulo; F2; contrato 6 | ✓ |
| T004 | `releasedVersionOf` | Interfaz `releasedVersionOf`; D-4 | ✓ |
| T005 | `planCompletion`: admisión por estado y `NOT_SHIPPED` | «Tabla de admisión por estado»; D-3, D-9 | ✓ |
| T006 | `planCompletion`: versión, fecha, destino y salida | «Resolución de la versión liberada»; Salida del motor; D-4, D-6 | ✓ |
| T007 | `completeEpicFrontmatter` | Interfaz «Escritura de `epic.md`»; «Frontmatter tras `complete`»; D-5 | ✓ |
| T008 | `moveEpic` y `applyCompletion` | F1, F5; D-7, D-8; Degradación gradual | ✓ |
| T009 | `parseArgs`, `main` y `module.exports` | CLI del motor; Salida del motor; API del módulo | ✓ |
| T010 | Frontmatter de `SKILL.md` | Interfaz «Frontmatter de `SKILL.md`» | ✓ |
| T011 | Objetivo, Parámetros, Precondiciones y Restricciones | Skill `epic-complete`; Goals/Non-Goals; D-2, D-3 | ✓ |
| T012 | Paso 0 con marcador de layout fijo | Skill `epic-complete`; CNF-4 | ✓ |
| T013 | Pasos 1–3 (argumento, motor, `plan`) | F2; D-3, D-10; Degradación gradual (motor ausente) | ✓ |
| T014 | Paso 4 (confirmación) | F1, F3, F4; D-2 | ✓ |
| T015 | Pasos 5–6 y Salida | F1, F5; contrato 9 | ✓ |
| T016 | `references/error-codes.md` | Catálogo de errores; D-10 | ✓ |
| T017 | `README.md` | Ficha del skill | ✓ |
| T018 | Pruebas: contratos 1 y 2 | Pruebas del motor; contratos 1–2 | ✓ |
| T019 | Pruebas: contrato 3 (versión) | Pruebas del motor; contrato 3 | ✓ |
| T020 | Pruebas: contratos 4 y 5 | Pruebas del motor; contratos 4–5 | ✓ |
| T021 | Pruebas: contratos 6–8 | Pruebas del motor; contratos 6–8 | ✓ |
| T022 | `evals/evals.json` TC-001 a TC-004 | Evals; contratos 10–12 | ✓ |
| T023 | Fila en `domain-skills-map.md` | Mapa de skills | ✓ |
| T024 | Filas en `sddf-commands-pipeline.md` y `README.md` | Guía de comandos; README del repo | ✓ |
| T025 | Entrada en `CHANGELOG.md` | `CHANGELOG.md` (Componentes) | ✓ |
| T026 | `npm test` | Contratos 1–8 | ✓ |
| T027 | `npm run verify:repository` | Contratos 9 y 13 | ✓ |
| T028 | `graphify update .` | Regla del proyecto (`CLAUDE.md` › graphify: actualizar el grafo tras modificar código); no es un elemento de `design.md`, sino un paso de cierre obligatorio del repositorio | ✓ |
| T029 | Dejar `npm run test:eval -- epic-complete` a criterio humano | Contratos 10–12; regla de `AGENTS.md` sobre evals manuales | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Skill `epic-complete` (`SKILL.md`) | Componentes | T001, T010–T015 | ✓ |
| Motor de cierre de épica (`scripts/epic-complete.js`) | Componentes | T002–T009 | ✓ |
| Catálogo de errores (`references/error-codes.md`) | Componentes | T016 | ✓ |
| Ficha del skill (`README.md`) | Componentes | T017 | ✓ |
| Evals (`evals/evals.json`) | Componentes | T022 | ✓ |
| Pruebas del motor (`test/epic-complete.test.js`) | Componentes | T018–T021 | ✓ |
| Mapa de skills (`docs/domains/domain-skills-map.md`) | Componentes | T023 | ✓ |
| Guía de comandos (`docs/guides/sddf-commands-pipeline.md`) | Componentes | T024 | ✓ |
| README del repo | Componentes | T024 | ✓ |
| `CHANGELOG.md` | Componentes | T025 | ✓ |
| Frontmatter de `SKILL.md` | Interfaces | T010 | ✓ |
| Invocación del skill | Interfaces | T011, T013 | ✓ |
| CLI del motor | Interfaces | T009, T013 | ✓ |
| Salida del motor | Interfaces | T006, T008, T009 | ✓ |
| API del módulo | Interfaces | T003–T009 | ✓ |
| `releasedVersionOf` | Interfaces | T004, T019 | ✓ |
| Escritura de `epic.md` | Interfaces | T007, T018 | ✓ |
| Lectura de `CHANGELOG.md` | Interfaces | T004, T006 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-23-completar-flujo-de-epic

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` › `## Historias`, fase COMPLETED: línea F2 de **STORY-171** |
| Objetivo de la historia alineado con la épica | ✓ | El objetivo de EPIC-23 es cerrar el ciclo de vida hasta `COMPLETED`; la historia implementa el nodo `epic-complete` del flowchart, CS-19 (`SHIP/DONE` y `COMPLETED/DONE`), su parte de CS-12 y SMOKE-8 |
| Restricciones de la épica respetadas | ⚠️ | Respeta las restricciones (no hace commit ni push; confirmación humana; layout fijo; nota «Métricas»: deja legibles fechas y versión). La línea F2 y la nota «Archivo de épicas» de `epic.md` aún atribuyen a STORY-171 el ADR nuevo y el ajuste de documentos de dominio, que el split del 2026-10-29 movió a STORY-175; STORY-175 no figura en el índice de historias (INC-001) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D: desalineación con la épica
- **Descripción:** En `epic.md`, la línea F2 de STORY-171 dice «Incluye el ADR nuevo que reemplaza a ADR-0017 y el ajuste de los documentos de dominio para que este skill escriba `COMPLETED` de épica con confirmación humana», y la nota «Archivo de épicas» dice que «STORY-171 (Core) incluye un ADR nuevo». `story.md` (Non-Goals y nota «Split (2026-10-29)») declara ese alcance fuera de la historia y lo asigna a STORY-175, que no aparece en `## Historias` ni en el reparto de dueños de criterios de salida de `## Notas`. El diseño lo registra como CR-003. No afecta al plan de implementación de esta historia.
- **Archivo afectado:** `specs/flow/EPIC-23-completar-flujo-de-epic/epic.md` — secciones «Historias» (fase COMPLETED) y «Notas» (viñetas «Archivo de épicas» y reparto de dueños de CS-20)
- **Acción requerida:** Quitar de la línea F2 de STORY-171 la frase del ADR y los documentos de dominio, añadir la línea F2 de STORY-175 y reasignarle la parte de CS-20 sobre `COMPLETED` y el ADR nuevo.

---

## Recomendaciones

1. **INC-001:** ejecutar `/epic-refine EPIC-23` (o corregir a mano `epic.md` › «Historias» y «Notas») para reflejar el split STORY-171 → STORY-175, y regenerar `docs/index.md` con `/memory-system index` para corregir el slug anterior de STORY-171 (CR-003 de `design.md`).
2. **CR-001 de `design.md`:** planificar STORY-172 para la misma versión que STORY-171; mientras tanto, el mensaje de `NOT_SHIPPED` nombra `CANCELED/DONE` aunque esa rama aún la rechaza. T020 fija ese comportamiento transitorio en una prueba que STORY-172 deberá actualizar.
3. **CR-002 de `design.md`:** al planificar STORY-175, incluir en `domain-epic-lifecycle` las claves opcionales `completed:` y `version:` de `epic.md` y su escritor (`epic-complete`).
4. **Orden de entrega:** no ejecutar `/story-implement-tasks STORY-171` hasta que STORY-175 esté entregada, o limitar la implementación a fixtures de repos temporales, como indica la nota de `tasks.md`.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-171` no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-171` |

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1, AC-2 y AC-3 en bloques `gherkin` con Dado/Cuando/Entonces |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | 3/3 ACs cubiertos (tabla «Cobertura de Criterios de Aceptación») |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | Columna «AC que satisface» en Componentes, Interfaces y Decisiones; `// satisface:` en Goals, Esquema de datos y Flujos F1–F5 |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | D-1 a D-10; «Open Questions: Ninguna»; CR-001 a CR-003 registrados |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` con 29 tareas |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | AC-1 (T005–T008, T014–T015, T018–T019, T022 TC-001/TC-004), AC-2 (T005, T013, T016, T020–T021, T022 TC-002), AC-3 (T014, T022 TC-003); cada tarea toca un archivo o una función |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | — | — | No aplica: `testcases.md` no existe (pipeline `--only-tasks`) |
