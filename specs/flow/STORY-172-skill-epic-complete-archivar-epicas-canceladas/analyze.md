---
type: analyze
id: STORY-172
slug: STORY-172-analyze-report
title: "Analyze: Skill epic-complete — archivar épicas canceladas"
story: STORY-172
design: STORY-172
tasks: STORY-172
verdict: APPROVED
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-172-skill-epic-complete-archivar-epicas-canceladas
---

<!-- Referencias -->
[[STORY-172-skill-epic-complete-archivar-epicas-canceladas]]

# Reporte de Coherencia: Skill epic-complete — archivar épicas canceladas

## Veredicto

**Veredicto:** `APPROVED` — sin inconsistencias

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (y CNF-1 a CNF-4) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada — testcases.md no presente (modo `--only-tasks`) |
| Alineación tareas → diseño | ✓ | 18/18 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 8/8 componentes y 6/6 interfaces con tarea |
| Alineación con la épica EPIC-23-completar-flujo-de-epic | ✓ | Listada en `## Historias` (línea 66); dueña de CS-19 para `CANCELED/DONE` (línea 199) |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Archivar una épica `CANCELED/DONE` en `specs/flow/archive/<YYYY-MM-DD>-EPIC-NN-<slug>/` conservando status e historial | ✓ | Tabla de admisión (`archive-canceled`), D-2 (sin escritura), D-3 (fecha `archiveDateOf`), F1, Interfaces `applyCompletion` y pregunta/línea de éxito; contratos 1–3, 7 |
| AC-2 | `CANCELED/IN-PROGRESS` → informa y no cambia nada | ✓ | Tabla de admisión (`CANCELED_NOT_DONE`), mensaje literal, D-4, F2, catálogo de errores; contratos 4, 8 |
| AC-3 | Destino existente → informa la ruta y no mueve | ✓ | Esquema › Conflicto de destino, D-6 (`ARCHIVE_CONFLICT` heredado), F3; contratos 5, 9 |
| CNF-1 | No escribe `status`/`substatus` | ✓ | D-2, Interfaces `applyCompletion`; contrato 2 |
| CNF-2 | Confirmación humana explícita | ✓ | D-7, F1, F4 |
| CNF-3 / CNF-4 | Progressive disclosure y tamaño de `SKILL.md` | ✓ | Goals, catálogo de errores bajo demanda; contrato 10 (< 200 líneas) |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Verificar que STORY-171 está entregada y confirmar nombres reales | CR-001, Risks (primer riesgo) | ✓ |
| T002 | Corregir slug obsoleto en `related:` de `story.md` | CR-002 | ✓ |
| T003 | Ampliar tabla de admisión de `planCompletion` | Componente «Motor», Esquema › Tabla de admisión, D-1, D-4 | ✓ |
| T004 | Fecha, destino y versión nula para `archive-canceled` | Interfaces `planCompletion`/Salida, D-3, D-5, D-6 | ✓ |
| T005 | `applyCompletion` sin escritura y mensaje de éxito | Interfaces `applyCompletion`, D-2, Degradación (`MOVE_FAILED`) | ✓ |
| T006 | Actualizar `SKILL.md` | Componente «Skill epic-complete», Interfaces pregunta/línea de éxito, D-7 | ✓ |
| T007 | Actualizar `references/error-codes.md` | Componente «Catálogo de errores», D-4 | ✓ |
| T008 | Actualizar `README.md` | Componente «Ficha del skill» | ✓ |
| T009 | Pruebas: retirar caso obsoleto y contrato 1 | Componente «Pruebas del motor», contrato 1, Risks (segundo riesgo) | ✓ |
| T010 | Pruebas: contratos 2–3 | Contratos 2, 3 | ✓ |
| T011 | Pruebas: contratos 4–6 | Contratos 4, 5, 6 | ✓ |
| T012 | Evals de AC-1, AC-2, AC-3 | Componente «Evals», contratos 7–9 | ✓ |
| T013 | Fila de `domain-skills-map.md` | Componente «Mapa de skills» | ✓ |
| T014 | Entrada de `CHANGELOG.md` | Componente «CHANGELOG.md» | ✓ |
| T015 | `npm test` | Contratos 1–6 | ✓ |
| T016 | `npm run verify:repository` | Contrato 10 | ✓ |
| T017 | `graphify update .` | Regla de AGENTS.md (mantener el grafo tras modificar código) | ✓ |
| T018 | Registrar evals como ejecución manual | Contratos 7–9 y regla de AGENTS.md | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Motor `scripts/epic-complete.js` | Componentes | T003, T004, T005 | ✓ |
| Skill `SKILL.md` | Componentes | T006 | ✓ |
| Catálogo `references/error-codes.md` | Componentes | T007 | ✓ |
| Ficha `README.md` | Componentes | T008 | ✓ |
| Evals `evals/evals.json` | Componentes | T012 | ✓ |
| Pruebas `test/epic-complete.test.js` | Componentes | T009, T010, T011 | ✓ |
| Mapa `docs/domains/domain-skills-map.md` | Componentes | T013 | ✓ |
| `CHANGELOG.md` | Componentes | T014 | ✓ |
| CLI del motor (`--version` ignorado) | Interfaces | T004, T011 | ✓ |
| Salida del motor (`archive-canceled`, `CANCELED_NOT_DONE`, `version: null`) | Interfaces | T003, T004 | ✓ |
| `planCompletion` | Interfaces | T003, T004 | ✓ |
| `applyCompletion` | Interfaces | T005 | ✓ |
| Pregunta de confirmación | Interfaces | T006 | ✓ |
| Línea de éxito | Interfaces | T006 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-23-completar-flujo-de-epic

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` línea 66 (`## Historias`) |
| Objetivo alineado | ✓ | `## Alcance` (línea 31): `epic-complete` «también archiva, sin cambiar su status, las épicas `CANCELED/DONE`»; CS-19 (línea 91) |
| Restricciones respetadas | ✓ | Reparto de criterios (línea 199): STORY-172 es dueña de CS-19 para `CANCELED/DONE`; no toca ADR ni documentos de dominio (STORY-175); CS-21 cubierto por T015–T016 |

---

## Inconsistencias Detectadas

Sin inconsistencias detectadas.

Avisos de cobertura (no son hallazgos): `testcases.md` no presente por el modo `--only-tasks`; los CR-001 (dependencia de STORY-171) y CR-002 (slug obsoleto en `related:`) del diseño quedan atendidos por T001 y T002.

---

## Recomendaciones

1. Respetar el orden de entrega STORY-175 → STORY-171 → STORY-172 (T001 lo verifica antes de editar el motor).
2. Opcional: ejecutar `/story-testcases STORY-172` si se quiere habilitar también `/story-implement`.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-172` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-172` |

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene ACs en Gherkin que cubren los escenarios principales | ✓ | — | AC-1 a AC-3 en bloques `gherkin` (Dado/Cuando/Entonces) |
| design.md existe y cubre todos los ACs | ✓ | — | Tabla de cobertura: 3/3 |
| Trazabilidad explícita `// satisface: AC-N` | ✓ | — | Goals, Esquema y Flujos anotados; columnas «AC que satisface» en Componentes, Interfaces y Decisiones |
| Sin decisiones de arquitectura aplazadas | ✓ | — | D-1 a D-7; «Open Questions: Ninguna»; CR-001 y CR-002 registrados |
| Existe tasks.md o testcases.md | ✓ | — | tasks.md presente |
| tasks.md contiene solo tareas atómicas para los escenarios principales | ✓ | — | 18 tareas acotadas a un archivo o comando; AC-1 (T003–T006, T009–T010, T012), AC-2 (T003, T007, T011, T012), AC-3 (T004, T011, T012) |
| testcases.md (si existe) cubre los escenarios principales | ✓ | — | No aplica: testcases.md no existe |
