---
type: analyze
id: STORY-192
slug: STORY-192-analyze-report
title: "Analyze: Épica sin READY-FOR-DEV"
story: STORY-192
design: STORY-192
tasks: STORY-192
verdict: APPROVED
created: 2026-11-13
updated: 2026-11-13
related:
  - STORY-192-epica-sin-ready-for-dev
---

<!-- Referencias -->
[[STORY-192]]

# Reporte de Coherencia: Épica sin READY-FOR-DEV

## Veredicto

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo C

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos |
| Alineación tareas → diseño | ✓ | 24/24 tareas con diseño |
| Cobertura diseño → tareas | ⚠️ | 7/7 componentes con tarea; 2 omisiones de alcance en tareas (INC-001, INC-002) |
| Alineación con la épica EPIC-029-eliminar-estados-buffer | ✓ | Listada en `epic.md:35`; cubre CS-4 (parte `epic-analyze`) y CS-6 (skills de épica) |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

> ⚠️ testcases.md no presente: la cobertura de pruebas no se evaluó (modo `--only-tasks`). Los casos de prueba de la historia son los evals de D-5 (TC-035…TC-037 de `epic-analyze`, TC-027/TC-028 y TC-009 de `epic-refine`).

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | `/epic-analyze` sobre historias en `SPECIFY/DONE`, `PLAN/DONE` e `IMPLEMENT/TODO`: 3/3 listas, siguiente paso de aprobación manual a `PLAN/DONE`, sin escribir el estado de la épica | ✓ | C-3, C-4; D-2 (orden sin buffers), D-3 (línea `Siguiente paso:`); flujo 1; V-6; TC-035 (D-5) |
| AC-2 | `READY-FOR-IMPLEMENT` → `lista` + nota de valor legado sin MAD-03 y fuera del veredicto; `READY-FOR-VERIFY` → MAD-03 | ✓ | C-3; D-1 (fila del valor legado); flujos 2 y 3; TC-036 y TC-037 (D-5) |
| AC-3 | `/epic-refine`: historia de cierre SAL en `SPECIFY` sin `Replanifica:`; en `PLAN` con `Replanifica: /story-plan STORY-NNN` | ✓ | C-2, C-5, C-6; D-4; flujo 4; TC-009 (`not_contains`) y TC-027 (D-5) |

Criterios no funcionales: CNF-1 → D-1, D-4, D-7, V-3, V-4 · CNF-2 → D-3, V-5 · CNF-3 → D-5, V-1, V-2 (los grupos 1–2 de tasks.md van antes que los grupos 3–5) · CNF-4 → V-7.

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | TC-035 en evals de `epic-analyze` | C-1, D-5 (AC-1) | ✓ |
| T002 | TC-036 (valor legado) | C-1, D-1, D-5 (AC-2) | ✓ |
| T003 | TC-037 (`READY-FOR-VERIFY`) y versión 1.6.0 | C-1, D-5 (AC-2) | ✓ |
| T004 | Fixture `cobertura-cierre-planificada/` | C-2, D-5 | ✓ |
| T005 | Fixture `cobertura-cierre-status-desconocido/` | C-2, D-4, D-5 | ✓ |
| T006 | TC-027 (`Replanifica:` con `PLAN`) | C-2, D-5 (AC-3) | ✓ |
| T007 | TC-028 (`status` desconocido al PO) | C-2, D-4, D-5 | ✓ |
| T008 | `Replanifica:` en `not_contains` de TC-009 y versión 1.6.0 | C-2, D-5 (AC-3) | ✓ |
| T009 | Existencia de ADR-0022 | D-6 | ✓ |
| T010 | Líneas 5, 12 y 343 de `epic-analyze/SKILL.md` | C-3, D-3 | ✓ |
| T011 | Línea 77 (sin cambio de estado) | C-3, D-3, D-6 | ✓ |
| T012 | Orden de madurez y fila del valor legado | C-3, D-1, D-2, CR-002 | ✓ |
| T013 | Línea `Siguiente paso:` del Paso 9 manual | C-3, D-3, interfaz «Resumen manual (`epic-analyze`)» | ✓ |
| T014 | `epic-analyze/README.md` líneas 20 y 30 | C-4 | ✓ |
| T015 | §«Estados admitidos» de `sal-corrections.md` | C-6, D-4 | ✓ |
| T016 | Nota de §3 para `status` fuera del workflow | C-6, D-4 | ✓ |
| T017 | `sal-corrections.md:127` y `epic-refine/SKILL.md:227` | C-5, C-6 | ✓ |
| T018 | `epic-generate-all-stories/SKILL.md:227` | C-7, D-7 | ✓ |
| T019 | Greps de CNF-1 | V-3, V-4 | ✓ |
| T020 | Grep de `PLAN/DONE` (CNF-2) | V-5 | ✓ |
| T021 | Comparación con `domain-story-lifecycle` §4.1 | V-6, riesgo de STORY-187 | ✓ |
| T022 | Comprobación de BOM por bytes | Restricción de codificación (memoria del proyecto) | ✓ |
| T023 | `verify:repository` y `npm test` | V-7 (CNF-4) | ✓ |
| T024 | `test:eval` anotado para el humano | V-8 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| C-1 Evals de `epic-analyze` | Componentes afectados | T001–T003 | ✓ |
| C-2 Evals y fixtures de `epic-refine` | Componentes afectados | T004–T008 | ⚠️ ver INC-002 |
| C-3 `epic-analyze/SKILL.md` | Componentes afectados | T009–T013 | ⚠️ ver INC-001 |
| C-4 `epic-analyze/README.md` | Componentes afectados | T014 | ✓ |
| C-5 `epic-refine/SKILL.md` | Componentes afectados | T017 | ✓ |
| C-6 `sal-corrections.md` | Componentes afectados | T015–T017 | ✓ |
| C-7 `epic-generate-all-stories/SKILL.md` | Componentes afectados | T018 | ✓ |
| Interfaz: clasificación de madurez | Interfaces y contratos | T012 | ✓ |
| Interfaz: resumen manual de `epic-analyze` | Interfaces y contratos | T013 | ✓ |
| Interfaz: retorno Agent de `epic-analyze` (sin cambio) | Interfaces y contratos | T013 (no se toca) | ✓ |
| Interfaz: estados admitidos SAL | Interfaces y contratos | T015, T016 | ✓ |
| Interfaz: resumen manual de `epic-refine` | Interfaces y contratos | T017 | ✓ |
| V-1…V-8 | Contratos de verificación | T001–T008, T019–T024 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-029-eliminar-estados-buffer

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md:35`: `- [ ] **STORY-192** — Épica sin READY-FOR-DEV: …` |
| Objetivo de la historia alineado con la épica | ✓ | El objetivo de la épica (`epic.md:18`) es retirar los buffers para que `status` exprese solo la etapa. La historia retira `READY-FOR-DEV` y `READY-FOR-IMPLEMENT` de los skills de épica y fija la aprobación del PO en `PLAN/DONE` |
| Restricciones de la épica respetadas | ✓ | CS-4 (`epic.md:43`): `epic-analyze` no emite MAD-03 por el valor legado (D-1). CS-6 (`epic.md:45`): el buffer solo se nombra en la regla del valor legado de `epic-analyze` y sus evals (D-1, D-4, D-7, V-3, V-4). Registros históricos sin tocar. El ADR queda fuera (STORY-186), con cita condicionada (D-6) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** C: diseño sin tarea
- **Descripción:** con `NEEDS-REFINEMENT`, D-3 hace que `epic-analyze` recomiende `/epic-refine <EPIC_ID>` en la línea `Siguiente paso:`. Pero la sección «Dependencias» de `skills/epic-analyze/SKILL.md:62` enumera las recomendaciones del skill (`/epic-format-validation`, `/epic-generate-stories`, `/story-specify`) y ni design.md ni tasks.md la actualizan. El `SKILL.md` quedaría con una recomendación que «Dependencias» no declara.
- **Archivo afectado:** `design.md` — sección «Decisions › D-3» y tabla «Componentes afectados» (C-3); `tasks.md` — grupo «3. Skill `epic-analyze`» (T013)
- **Acción requerida:** añadir a C-3 la línea 62 y a T013 (o a una tarea nueva tras T013) la actualización de «Dependencias»: «recomienda `/epic-refine <EPIC_ID>` en el siguiente paso con `NEEDS-REFINEMENT`».

### INC-002 [WARNING]

- **Tipo:** C: diseño sin tarea
- **Descripción:** T005 copia `examples/cobertura-cierre/` cambiando solo `status: BACKLOG` en STORY-302, y conserva sin cambios `EPIC-30-ejemplo/epic-analyze-report.md` (`warnings: 0`, solo H-001 SAL-01). Pero con STORY-302 en `BACKLOG`, `/epic-analyze` emitiría un MAD-03 para STORY-302 (Paso 5c.1). El fixture describe así un reporte que el analizador nunca produciría. Si se regenera el reporte de forma realista, el MAD-03 es «siempre fuera de alcance» en `epic-refine` (`skills/epic-refine/SKILL.md:145`), y la aserción `FUERA-DE-ALCANCE: 1` de T007 pasaría a `2`.
- **Archivo afectado:** `tasks.md` — T005 y T007; `design.md` — D-5 (TC-028)
- **Acción requerida:** en T005, añadir al `epic-analyze-report.md` del fixture el hallazgo `H-002 [WARNING] — MAD-03` de STORY-302 con `status` `BACKLOG` (`warnings: 1`, `## Veredicto` sin cambio porque hay 1 ERROR). En T007 y en D-5, cambiar `FUERA-DE-ALCANCE: 1` por `FUERA-DE-ALCANCE: 2`.

---

## Recomendaciones

1. **INC-001:** en `design.md` › «Componentes afectados», fila C-3, añadir «línea 62 (Dependencias)». En `tasks.md` › T013, añadir: «actualizar `SKILL.md:62` (Dependencias) para declarar la recomendación de `/epic-refine <EPIC_ID>` con `NEEDS-REFINEMENT`».
2. **INC-002:** en `tasks.md` › T005, incluir el MAD-03 de STORY-302 en el `epic-analyze-report.md` del fixture (`warnings: 1`). En T007 y en `design.md` › D-5 (TC-028), esperar `FUERA-DE-ALCANCE: 2`.
3. Ninguna de las dos bloquea, y ambas se pueden corregir con `/story-fix-plan STORY-192` o durante la implementación de T005/T013.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-192` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-192` |

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1…AC-3 en bloques `gherkin` con Dado/Cuando/Entonces; AC-2 y AC-3 con tablas `Ejemplos` |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | Tabla «Cobertura de Criterios de Aceptación»: 3/3 |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | D-1…D-7 y Goals con `// satisface:`; columna «Satisface» en Componentes e Interfaces; columna «Origen» en Contratos de verificación |
| No hay decisiones de arquitectura aplazadas: toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | El tratamiento del valor legado en `epic-refine` está decidido en D-4 y la cita al ADR en D-6. CR-001 y CR-002 registrados. «Open Questions: Ninguna» |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` presente (T001–T024) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | AC-1: T001, T010–T013. AC-2: T002, T003, T012. AC-3: T004, T006, T008, T015–T017. Cada tarea tiene un archivo y un criterio «Hecho» o una dependencia explícita |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: `testcases.md` no existe (modo `--only-tasks`) |
