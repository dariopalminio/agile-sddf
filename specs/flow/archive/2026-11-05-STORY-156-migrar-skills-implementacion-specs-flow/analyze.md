---
type: analyze
id: STORY-156
slug: STORY-156-analyze-report
title: "Analyze: Migrar los skills de implementación a specs/flow"
story: STORY-156
design: STORY-156
tasks: STORY-156
verdict: APPROVED
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-156-migrar-skills-implementacion-specs-flow
---

<!-- Referencias -->
[[STORY-156-migrar-skills-implementacion-specs-flow]]

# Reporte de Coherencia: Migrar los skills de implementación a specs/flow

## Veredicto

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo E

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 2/2 criterios cubiertos (más CNF-1 y CNF-2) |
| Alineación tareas → diseño | ✓ | 15/15 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 7/7 componentes con tarea |
| Alineación con la épica EPIC-26-layout-y-flow-forward-mejorado | ✓ | Listada en `## Historias`; aporta a CS-2 y CS-3 |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 5/7 criterios ✓ (1 ⚠️, 1 N/A) |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | `/story-implement` y `/story-implement-tasks` escriben `implement-report.md` en `specs/flow/STORY-NNN-<slug>/` y nada en `docs/specs/` | ✓ | D-2 (mapa de rutas), D-3 (resolución con guion, sin fallback), F-1, F-2; contratos #2, #7, #10 |
| AC-2 | El gate de STORY-148 no reporta resolución legada en los dos skills y ningún artefacto de historia queda fuera de `specs/flow/STORY-NNN-<slug>/` | ✓ | D-1 (bloque canónico), D-3 (ruta explícita restringida), D-4 (épica), D-5 (`PENDING_MIGRATION`), D-6 (E2E-002), F-3, F-4; contratos #1, #4, #5, #6, #8, #9 |
| CNF-1 | Evals con rutas `specs/flow/`; ejecución a criterio humano | ✓ | D-2 (12 rutas de `story-implement/evals/evals.json`); contratos #2, #11, #13 |
| CNF-2 | Ambos skills declaran el contrato de STORY-148 | ✓ | D-1, D-5; contrato #3 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Verificar precondiciones (ADR-0016, `verify-fixed-layout.js`, STORY-147/148 `DONE`) | Risks (precondición), dependencia dura de story.md | ✓ |
| T002 | Línea base `npm test` / `verify:repository` e inventario por grep | Context, D-2 | ✓ |
| T003 | Comprobar y, si falta, aplicar el cambio de E2E-002 | D-6, CR-001 | ✓ |
| T004 | Retirar los dos skills de `PENDING_MIGRATION` y confirmar RED | D-5 | ✓ |
| T005 | Migrar `story-implement/SKILL.md` (Paso 0, l. 32, DoD, 0c.1, 11d, errores, salida) | D-1, D-2, D-3, D-4 | ✓ |
| T006 | Migrar `story-implement-tasks/SKILL.md` (entrada, dependencias, DoD, Paso 0, 1b, 4c, errores, salida) | D-1, D-2, D-3, D-4 | ✓ |
| T007 | `story-implement/README.md` (2 rutas) | D-2, componente «README del orquestador» | ✓ |
| T008 | `story-implement-tasks/README.md` (ejemplo `--path`) | D-2, D-3, componente «README del implementador» | ✓ |
| T009 | `story-implement/evals/evals.json` (12 rutas) | D-2, componente «Evals del orquestador» | ✓ |
| T010 | `verify:layout` verde | D-5, contrato #5 | ✓ |
| T011 | Greps de contratos #1–#4, #7–#10 | Contratos de verificación | ✓ |
| T012 | Validación estructural de evals y `--dry-run` | Contrato #11 | ✓ |
| T013 | `npm test` y `verify:repository` | Contratos #5, #6 | ✓ |
| T014 | Revisión de alcance con `git diff --stat` | Contrato #12, Non-Goals | ✓ |
| T015 | `graphify update .` y registro en `implement-report.md` | Risks (dogfooding), contrato #13 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Orquestador TDD (`skills/story-implement/SKILL.md`) | Componentes afectados, D-1–D-4 | T005 | ✓ |
| README del orquestador | Componentes afectados, D-2 | T007 | ✓ |
| Evals del orquestador | Componentes afectados, D-2 | T009, T012 | ✓ |
| Implementador por tareas (`skills/story-implement-tasks/SKILL.md`) | Componentes afectados, D-1–D-4 | T006 | ✓ |
| README del implementador | Componentes afectados, D-2 | T008 | ✓ |
| Lista transitoria del gate (`PENDING_MIGRATION`) | Componentes afectados, D-5 | T004, T010 | ✓ |
| Prueba E2E-002 (condicional) | Componentes afectados, D-6 | T003, T013 | ✓ |
| Interfaz «Paso 0» | Interfaces | T005 (a), T006 (d) | ✓ |
| Interfaz «Resolución por ID» / «Ruta explícita» | Interfaces, D-3 | T005 (d), T006 (e), T011 | ✓ |
| Interfaz «Épica padre» | Interfaces, D-4 | T005 (e), T006 (f), T011 | ✓ |
| Interfaz «DoD» | Interfaces, D-2 | T005 (c), T006 (c) | ✓ |
| Interfaz «Gate» | Interfaces, D-5 | T004, T010, T013 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-26-layout-y-flow-forward-mejorado

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` `## Historias`, línea `- [ ] **STORY-156** — Migrar los skills de implementación a specs/flow` |
| Objetivo de la historia alineado con la épica | ✓ | El alcance de la épica pide que todos los skills lean y escriban en rutas fijas sin `SDDF_ROOT`/`root`/`SPECS_BASE`; la historia lo aplica a `story-implement` y `story-implement-tasks` y contribuye a CS-2 y CS-3 |
| Restricciones de la épica respetadas | ✓ | Rutas `specs/flow/STORY-NNN-<slug>/` y `specs/flow/EPIC-NN-<slug>/` (convención ADR-0004); sin búsqueda en `archive/`; sin nuevos scripts (CS-11); retiro de la lista transitoria para STORY-157 |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** E: criterio DoD PLAN no cumplido
- **Descripción:** el criterio «tasks.md DEBE contener únicamente tareas atómicas» queda en duda para T005 y T006: cada una agrupa 7–8 ediciones (subpuntos a–h) en un `SKILL.md` de 1260 y 828 líneas. Son ediciones textuales sobre un único archivo y probablemente caben en una sesión, pero no hay evidencia clara de que lo hagan (regla de duda → `⚠️`).
- **Archivo afectado:** tasks.md — sección "## 3. Migración de los SKILL.md (GREEN)" (T005, T006)
- **Acción requerida:** opcional: dividir T005 y T006 en dos tareas cada una (Paso 0 + DoD + resumen / resolución de historia + épica + errores + salida), o aceptarlas tal cual.

---

## Recomendaciones

1. (INC-001, opcional) En tasks.md, sección «## 3», dividir T005 y T006 por bloques del `SKILL.md` si en la implementación superan una sesión; los subpuntos (a)–(h) ya marcan los cortes naturales.
2. (CR-001 de design.md, no bloqueante) Implementar STORY-150 antes que STORY-156, o dejar que T003 aplique el cambio de E2E-002; opcionalmente, añadir `test/dod-story.test.js` al alcance de story.md como cambio condicional.
3. (CR-002 de design.md, no bloqueante) Precisar el «Para» de story.md: «sin declarar una raíz en `sddf.config.yaml` ni `SDDF_ROOT`». `story-implement` sigue necesitando `sddf.config.yaml` para sus generadores, y `/sddf-init` lo crea.
4. (CR-003 de design.md) Los dos defectos que se corrigen de paso (Glob sin guion en `story-implement` 0c.1 y patrón `<parent>-*` en `story-implement-tasks` 4c) ya entran en el alcance por D-3 y D-4: no requieren acción en story.md.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ (omitido por decisión del plan: `--only-tasks`) | `/story-implement STORY-156` no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-156` |

⚠️ testcases.md no presente — cobertura de pruebas no evaluada (Correlación 6 omitida). Las verificaciones de la historia están en los contratos de verificación de design.md y en las tareas T010–T013.

---

## Cumplimiento DoD — Fase PLAN

DoD: `docs/guardrails/dod-story-plan.md` (`enforcement: error`), resuelto por `sddf.config.yaml › guardrails.dod.story.plan` = `dod-story-plan`.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en Gherkin que cubren los escenarios principales | ✓ | — | AC-1 (`Esquema del escenario` con ejemplos para los dos skills) y AC-2 (`Dado/Cuando/Entonces`) |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño | ✓ | — | Tabla «Cobertura de Criterios de Aceptación» de este reporte; autoevaluación de design.md |
| Todos los elementos de diseño tienen trazabilidad explícita (`// satisface: AC-N`) | ✓ | — | D-1…D-6 con `// satisface:`; columnas «AC que satisface» en Componentes afectados e Interfaces; contratos con «AC origen» |
| No hay decisiones de arquitectura aplazadas | ✓ | — | `## Open Questions`: «Ninguna»; ambigüedades registradas como CR-001…CR-003 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente |
| Si tasks.md existe, contiene únicamente tareas atómicas para todos los escenarios principales | ⚠️ | WARNING | Cubre AC-1 (T005–T008, T011), AC-2 (T004–T006, T010, T013); atomicidad dudosa en T005/T006 (INC-001) |
| Si testcases.md existe, contiene pruebas para todos los escenarios principales | N/A | — | testcases.md no existe (plan `--only-tasks`) |
