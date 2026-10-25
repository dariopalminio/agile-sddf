---
type: analyze
id: STORY-099
slug: STORY-099-analyze-report
title: "Analyze: Inicializar la memoria completa desde sddf-init con el parámetro --level"
story: STORY-099
design: STORY-099
testcases: STORY-099
tasks: STORY-099
created: 2026-09-21
updated: 2026-09-21
related:
  - STORY-099-sddf-init-level-full
---

<!-- Referencias -->
[[STORY-099-sddf-init-level-full]]

# Reporte de Coherencia: Inicializar la memoria completa desde sddf-init con el parámetro --level

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 4/4 criterios cubiertos |
| Cobertura de ACs en testcases.md | ✓ | 4/4 ACs con caso de prueba (AC-4 por revisión de diff) |
| Alineación tareas → diseño | ✓ | 13/13 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 3/3 componentes y 3/3 interfaces con tarea |
| Alineación con la épica EPIC-20-memory-system | ✓ | Listada, objetivo alineado, restricciones respetadas |
| Cumplimiento DoD — Fase PLAN | ✓ | 5/5 criterios ✓ |

**Estado general:** ✓ Coherente

> DoD cargado desde `docs/guardrails/dod-story-checklist.md` (sección "Definition of Done para el estado PLAN"); `docs/policies/definition-of-done-story.md` no existe — la constitución referencia el guardrail.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | `--level full` invoca `memory-system scaffold`, concatena informe, resultado idéntico | ✓ | D-2 (Paso 5b), D-3 (composición inline); F-1; Interfaz "Paso 5b" |
| AC-2 | Sin `--level`/`standard` sin cambios y sin `memory-system`; `minimal` mínimo | ✓ | D-1 (tabla de niveles), D-4 (Paso 5 en minimal); F-2, F-3 |
| AC-3 | Tres niveles, default `standard`, valor no admitido detiene sin escrituras | ✓ | D-1; F-4; Interfaz `/sddf-init [--level …]` |
| AC-4 | Cambio mínimo en `sddf-init` | ✓ | D-1 (la tabla solo decide qué pasos se ejecutan), D-3; V-8 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Casos de evals por nivel | Componente "Evals de sddf-init"; D-5; V-2, V-4…V-7 | ✓ |
| T002 | Parámetro `--level`, tabla y validación | Componente "Skill sddf-init"; D-1; F-4 | ✓ |
| T003 | Paso 5 omitido en minimal | D-4; F-3 | ✓ |
| T004 | Paso 5b con degradación | D-2, D-3; F-1, F-4; CR-003 | ✓ |
| T005 | Informe compuesto | D-2; Interfaz "Informe final"; CR-001 | ✓ |
| T006 | Revisión del diff (cambio mínimo) | D-1, D-3; V-8 | ✓ |
| T007 | Evals en verde | D-5; V-2…V-7 | ✓ |
| T008 | Guía de pipeline | Componente "Documentación"; D-4, D-6 | ✓ |
| T009 | README y CHANGELOG | Componente "Documentación"; D-6 | ✓ |
| T010 | story.md con CR-002 | CR-002 | ✓ |
| T011 | Guardrail de skills | V-10 | ✓ |
| T012 | Verificación sugerida de story.md | V-1, V-3, V-4 | ✓ |
| T013 | verify:* y npm test | V-9 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Skill `sddf-init` (parámetro, tabla, Paso 5b, informe) | Componentes; D-1…D-4 | T002, T003, T004, T005, T006 | ✓ |
| Evals de `sddf-init` | Componentes; D-5 | T001, T007 | ✓ |
| Documentación | Componentes; D-6 | T008, T009 | ✓ |
| Interfaz `/sddf-init [--level minimal\|standard\|full]` | Interfaces | T002 | ✓ |
| Interfaz "Paso 5b → `/memory-system scaffold --yes`" | Interfaces | T004 | ✓ |
| Interfaz "Informe final de sddf-init" | Interfaces | T005 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-20-memory-system

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` línea 35: `STORY-099 — Inicializar la memoria completa desde sddf-init con el parámetro --level` con wikilink `[[STORY-099-sddf-init-level-full]]` |
| Objetivo de la historia alineado con la épica | ✓ | El "Para" (un proyecto listo en un comando sin cambiar el comportamiento conocido) materializa el impacto "Onboarding de proyectos" y el requerimiento "Integraciones acotadas: `sddf-init` solo añade `--level` y la invocación final en `full`" |
| Restricciones de la épica respetadas | ✓ | "`sddf-init` solo añade `--level` y la invocación final" → D-1/D-3 y V-8; "idempotencia" → NFR-2 y V-6; dependencia declarada en la épica (096 antes de 099) → D-2 degradación |

---

## Inconsistencias Detectadas

Sin inconsistencias detectadas.

---

## Recomendaciones

1. **`story.md` (planificado en T010):** incorporar CR-002 (en `full` el scaffold se ejecuta después de la pregunta de políticas, para que una constitución generada por `project-policies-generation` no sea bloqueada por la semilla).
2. **Orden de implementación:** puede implementarse antes que STORY-096 gracias a la degradación de D-2, pero EV-003, IT-001 e IT-003 quedarán pendientes hasta que `scaffold --yes` exista; T012 (equivalencia de listados) requiere STORY-096.
3. **Eval TC existentes:** T001 exige no modificar los casos previos de `sddf-init`; al ejecutar T007, si alguno falla por el nuevo texto del informe (`(nivel standard)` en la línea de cierre), ajustar el diseño del informe y no el caso, para preservar NFR-1. Conviene decidir en T005 si la línea de cierre lleva `(nivel standard)` o solo lo añade en `minimal`/`full`; el diseño D-2 lo muestra en `full` y deja `standard` sin sufijo para no romper `contains: ["Entorno SDDF inicializado correctamente"]` — TC-001 sigue pasando en cualquier caso.

---

## Cobertura de ACs en Testcases

| AC | Descripción | Cubierto en testcases.md | Escenario |
|---|---|---|---|
| AC-1 | `--level full` invoca scaffold y es equivalente | ✓ | E2E-001, IT-001, IT-002, IT-003, EV-003, EV-004 |
| AC-2 | `standard`/sin flag sin cambios; `minimal` mínimo | ✓ | E2E-002, EV-001, EV-002 |
| AC-3 | Tres niveles y valor no admitido | ✓ | E2E-002, EV-002, EV-005 |
| AC-4 | Cambio mínimo | ⚠️ | Sin caso de prueba automatizable; verificado por revisión del diff (V-8, T006). No es un gap: el criterio es estructural, no de comportamiento |

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ✓ | `/story-implement STORY-099` |
| tasks.md | ✓ | `/story-implement-tasks STORY-099` |

Ambas vías disponibles. `tasks.md` (13 tareas) ordena RED → GREEN; `/story-implement-tasks`
es la vía con menor fricción.

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin que cubren los escenarios principales | ✓ | — | 2 bloques `gherkin` (Dado/Cuando/Entonces): `full` invoca scaffold; `minimal`/`standard` no |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño por criterio | ✓ | — | Tabla "Cobertura de Criterios de Aceptación": 4/4 |
| tasks.md existe con tareas atómicas ordenadas por dependencia (setup → componentes → soporte → verificación) | ✓ | — | 4 grupos: evals → SKILL.md → documentación → verificación; 13 tareas con referencias AC/D/V |
| Todos los elementos de diseño tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | D-1…D-6 abren con `// satisface:`; tablas de Componentes e Interfaces llevan columna "AC que satisface" |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad está resuelta o registrada como CR | ✓ | — | "Open Questions: sin preguntas abiertas"; CR-001…CR-003 con acción requerida |
