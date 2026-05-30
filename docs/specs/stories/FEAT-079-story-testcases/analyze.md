---
alwaysApply: false
type: analyze
id: FEAT-079
slug: FEAT-079-story-testcases-analyze-report
title: "Analyze: story-testcases — generación de testcases.md desde story.md y design.md"
story: FEAT-079
design: FEAT-079
tasks: FEAT-079
created: 2026-05-30
updated: 2026-05-30
related:
  - FEAT-079-story-testcases
---

<!-- Referencias -->
[[FEAT-079-story-testcases]]

# Reporte de Coherencia: story-testcases — generación de testcases.md desde story.md y design.md

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 12/12 criterios cubiertos |
| Alineación tareas → diseño | ✓ | 30/30 tareas con diseño (INC-002 resuelto) |
| Cobertura diseño → tareas | ✓ | 11/11 elementos de diseño con tarea |
| Alineación con release EPIC-14 | ✓ | Historia listada; objetivo y posición en pipeline alineados (INC-001 resuelto) |
| Cumplimiento DoD — Fase PLAN | ✓ | 5/5 criterios ✓ |

**Estado general:** ✓ Coherente (sin inconsistencias abiertas)

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Generación exitosa: story.md + design.md → testcases.md con tabla correcta | ✓ | D-1 (estructura), D-3 (template), D-9 (flujo) |
| AC-2 | tasks.md ausente no bloquea ni emite advertencia | ✓ | D-7 (enriquecimiento opcional) |
| AC-3 | tasks.md presente: enriquece cobertura con T-NNN en Ref | ✓ | D-7 (enriquecimiento opcional) |
| AC-4 | story.md sin ACs suficientes: ⚠️ warning, no genera testcases.md parcial | ✓ | D-8 (precondiciones y fail-fast) |
| AC-5 | Prefijos UT/CT/IT/API/E2E/EV asignados correctamente por tipo de criterio | ✓ | D-4 (algoritmo de clasificación) |
| AC-6 | skill-preflight como Paso 0 antes de cualquier operación | ✓ | D-8, D-9 (flujo de ejecución — Paso 0) |
| AC-7 | Skill creado con skill-master siguiendo ciclo TDD (evals primero) | ✓ | D-1 (estructura), D-2 (frontmatter), D-11 (TDD) |
| AC-8 | Skill adhiere a constitution.md y DoD | ✓ | D-1 (estructura canónica), D-11 (TDD) |
| AC-9 | Formato testcases.md: tabla con ID, Tipo, Escenario, Dado, Cuando, Entonces, Ref | ✓ | D-3 (template testcases-template.md) |
| AC-10 | Leer referencias de sddf-config.yaml `plan.skills` para enriquecer generación | ✓ | D-5 (integración sddf-config.yaml) |
| AC-11 | Flag --force: sobreescribir sin confirmación | ✓ | D-6 (idempotencia y --force) |
| AC-12 | Derivación estructural: elementos de design.md → prefijo correcto | ✓ | D-4 (algoritmo de clasificación) |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Crear estructura de directorios del skill | D-1 (estructura canónica) | ✓ |
| T002 | evals.json — TC-001 happy-path | D-11 (TDD/RED), D-4 | ✓ |
| T003 | evals.json — TC-002 fail-fast (sin ACs) | D-11, D-8 | ✓ |
| T004 | evals.json — TC-003 error-handling (story.md ausente) | D-11, D-8 | ✓ |
| T005 | evals.json — TC-004 edge-case (--force) | D-11, D-6 | ✓ |
| T006 | evals.json — TC-005 edge-case (tasks.md enriquece) | D-11, D-7 | ✓ |
| T007 | examples/input/story.md canónica | D-11 (ejemplos para TDD) | ✓ |
| T008 | examples/input/design.md canónico | D-11 | ✓ |
| T009 | examples/input/tasks.md canónico | D-11, D-7 | ✓ |
| T010 | Crear assets/testcases-template.md | D-3 (template fuente de verdad) | ✓ |
| T011 | SKILL.md — frontmatter YAML | D-2 (frontmatter) | ✓ |
| T012 | SKILL.md — Objetivo y Posicionamiento | D-9 (flujo) | ✓ |
| T013 | SKILL.md — Paso 0 (preflight + sddf-config) | D-5, D-8, D-9 | ✓ |
| T014 | SKILL.md — Pasos 1-1f (parámetros, idempotencia) | D-6, D-8, D-9 | ✓ |
| T015 | SKILL.md — Pasos 2-3b (leer story, design, tasks) | D-7, D-9 | ✓ |
| T016 | SKILL.md — Paso 4 (leer template en runtime) | D-3, D-9 | ✓ |
| T017 | SKILL.md — Paso 5 (derivar casos + clasificación) | D-4, D-9 | ✓ |
| T018 | SKILL.md — Pasos 6-8 (completar, guardar, confirmar) | D-9, D-10 | ✓ |
| T019 | SKILL.md — Manejo de errores | D-8 | ✓ |
| T020 | examples/output/testcases.md de referencia | D-3, D-11 | ✓ |
| T021 | Verificar package.json incluye ruta del skill en `files` | DoD IMPLEMENTING / constitution.md | ⚠️ |
| T022 | Ejecutar /skill-master para validar estructura | D-11 (TDD/REFACTOR) | ✓ |
| T023 | Revisar CR-002: story-analyze y testcases.md | D-10 (CR-002 registrado) | ✓ |
| T024 | Verificar TC-001 (happy-path) | D-11, AC-1 | ✓ |
| T025 | Verificar TC-002 (fail-fast) | D-8, AC-4 | ✓ |
| T026 | Verificar TC-003 (error-handling) | D-8 | ✓ |
| T027 | Verificar TC-004 (--force) | D-6, AC-11 | ✓ |
| T028 | Verificar TC-005 (tasks enriquece) | D-7, AC-3 | ✓ |
| T029 | Verificar AC-5 (prefijos correctos) | D-4, AC-5 | ✓ |
| T030 | Verificar NFR rendimiento (< 15 segundos) | NFR de story.md | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Estructura de directorios del skill | D-1 | T001 | ✓ |
| Frontmatter YAML de SKILL.md | D-2 | T011 | ✓ |
| Template testcases-template.md | D-3 | T010, T016, T020 | ✓ |
| Algoritmo de clasificación de tipos | D-4 | T002, T017, T029 | ✓ |
| Integración sddf-config.yaml (referencias) | D-5 | T013 | ✓ |
| Idempotencia y flag --force | D-6 | T005, T014, T027 | ✓ |
| Enriquecimiento opcional con tasks.md | D-7 | T006, T009, T015, T028 | ✓ |
| Precondiciones y fail-fast | D-8 | T003, T004, T014, T019, T025, T026 | ✓ |
| Flujo de ejecución del SKILL.md (Pasos 0-8) | D-9 | T012, T013, T014, T015, T016, T017, T018 | ✓ |
| Estado de story.md (no actualiza) + CR-001, CR-002 | D-10 | T018, T023 | ✓ |
| Ciclo TDD con skill-master (evals primero) | D-11 | T002–T009, T020, T022, T024 | ✓ |

---

## Alineación con Release

**Release padre:** EPIC-14-fabrica-de-skills

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en release | ✓ | FEAT-079 aparece en `release.md` bajo `## Features` |
| Objetivo de la historia alineado con release | ✓ | Ambos definen la generación de testcases.md como skill complementario de la Fábrica de Skills |
| Restricciones del release respetadas | ✓ | El skill es agnóstico al stack y declarable en sddf-config.yaml, cumpliendo el patrón de orquestación de la fábrica |
| Punto de integración | ⚠️ | El release describe FEAT-079 como "invocado por story-implement"; la historia y el diseño lo posicionan como skill de la fase PLAN (después de story-tasking). Ver INC-001 |

---

## Inconsistencias Detectadas

### INC-001 [RESUELTO]

- **Tipo:** D — Desalineación parcial con release
- **Descripción:** La descripción de FEAT-079 en `release.md` afirmaba que el skill "es usado por story-implement", implicando invocación durante la fase IMPLEMENTING. Sin embargo, la historia y el diseño (D-10, D-9) lo posicionan en la fase PLAN: `story-design → story-tasking → story-testcases → story-analyze`.
- **Archivo afectado:** `docs/specs/releases/EPIC-14-fabrica-de-skills/release.md` — sección "Features > FEAT-079"
- **Resolución:** Descripción de FEAT-079 en release.md actualizada para reflejar la posición PLAN del skill y el pipeline correcto.

### INC-002 [RESUELTO]

- **Tipo:** B — Tarea sin decisión de diseño explícita
- **Descripción:** T021 ("Verificar que el campo `files` en package.json incluye la ruta del skill") no tenía trazabilidad a ninguna decisión explícita en `design.md`.
- **Archivo afectado:** `docs/specs/stories/FEAT-079-story-testcases/design.md` — sección "D-1: Estructura de directorios"
- **Resolución:** Nota de registro npm añadida al final de D-1 en design.md: la ruta `.claude/skills/story-testcases/**` debe incluirse en el campo `files` de `package.json`.

---

## Recomendaciones

1. **INC-001 — Alinear release.md con la posición PLAN del skill:** editar `docs/specs/releases/EPIC-14-fabrica-de-skills/release.md`, sección "Features > FEAT-079", y reemplazar la frase "Es usado por el skill story-implement" por una descripción que refleje la posición del skill en la fase PLAN del pipeline. Si se contempla su invocación futura desde story-implement, documentarlo como extensión planificada (CR adicional).

2. **INC-002 — Agregar requisito de package.json a design.md:** editar `docs/specs/stories/FEAT-079-story-testcases/design.md`, sección "D-1", añadir al final: `**Registro npm:** La ruta .claude/skills/story-testcases/** debe incluirse en el campo files de package.json para distribución vía npm.`

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | story.md contiene 6 bloques Gherkin con Dado/Cuando/Entonces cubriendo happy-path, escenarios alternativos y escenarios con datos |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | 12/12 ACs cubiertos con anotaciones `// satisface: AC-N` en las decisiones D-1 a D-11 |
| tasks.md existe con tareas atómicas ordenadas por dependencia (setup → componentes → soporte → verificación) | ✓ | — | tasks.md contiene 30 tareas en 7 grupos ordenados: Setup → RED/evals → Template → SKILL.md → Examples → Integración → Verificación |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | Cada decisión D-1 a D-11 incluye `// satisface: AC-N` en el encabezado de la sección |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | design.md registra CR-001 (story-plan extension) y CR-002 (story-analyze extension) para las dos dependencias abiertas; todas las demás decisiones están resueltas |
