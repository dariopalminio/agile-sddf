---
type: analyze
id: STORY-098
slug: STORY-098-analyze-report
title: "Analyze: Adoptar la memoria SDDF en proyectos OpenSpec o Speckit con el modo migrate"
story: STORY-098
design: STORY-098
testcases: STORY-098
tasks: STORY-098
created: 2026-09-21
updated: 2026-09-21
related:
  - STORY-098-memory-system-migrate-harness
---

<!-- Referencias -->
[[STORY-098-memory-system-migrate-harness]]

# Reporte de Coherencia: Adoptar la memoria SDDF en proyectos OpenSpec o Speckit con el modo migrate

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 4/4 criterios cubiertos |
| Cobertura de ACs en testcases.md | ✓ | 4/4 ACs con caso de prueba |
| Alineación tareas → diseño | ✓ | 18/18 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 10/10 componentes y 5/5 interfaces con tarea |
| Alineación con la épica EPIC-20-memory-system | ✓ | Listada, objetivo alineado, restricciones respetadas |
| Cumplimiento DoD — Fase PLAN | ✓ | 5/5 criterios ✓ |

**Estado general:** ⚠️ Advertencias (sin inconsistencias bloqueantes)

> DoD cargado desde `docs/guardrails/dod-story-checklist.md` (sección "Definition of Done para el estado PLAN"); `docs/policies/definition-of-done-story.md` no existe — la constitución referencia el guardrail.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | `migrate` detecta Speckit, propone sin escribir, confirma, scaffold adaptado | ✓ | D-2 (plan = `scaffold --dry-run`), D-3 (secuencia); F-1; Interfaz `/memory-system migrate` |
| AC-2 | `ensure --harness openspec`: capas bajo `docs/` sin `specs/`, `openspec/` intacto, índice con artefactos externos | ✓ | D-1 (perfil openspec), D-2, D-4 (nodos externos), D-5 (guardia); F-2 |
| AC-3 | Perfiles por harness; directorios del harness solo lectura | ✓ | D-1 (tabla), D-2, D-5; Interfaz `HARNESS_PROFILES[h]` |
| AC-4 | `migrate` solo scaffolding tras confirmación; `--yes` | ✓ | D-3; F-3; Interfaz `/memory-system migrate [--yes]` |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Casos de evals | Componente "Evals del skill"; D-2, D-3; V-1, V-2, V-9 | ✓ |
| T002 | Fixtures speckit / speckit-sin-constitution / openspec | Componente "Fixtures"; D-1, D-4 | ✓ |
| T003 | Tests del motor | Componente "Tests del motor"; V-2…V-8 | ✓ |
| T004 | Rellenar HARNESS_PROFILES | Componente `HARNESS_PROFILES`; D-1 | ✓ |
| T005 | scaffold aplica el perfil | Componente "Subcomando scaffold"; D-2 | ✓ |
| T006 | Guardia de escritura | Componente "Guardia de escritura"; D-5; F-4 | ✓ |
| T007 | index: externalGroup, mapeados, colisión | Componente "Subcomando index"; D-4; CR-002 | ✓ |
| T008 | index-template.md: subtítulos externos | Componente "Subcomando index" (template); D-1, D-4 | ✓ |
| T009 | GREEN del motor | D-1, D-2 | ✓ |
| T010 | Modo migrate en SKILL.md | Componente "Modo migrate del skill"; D-3; F-1, F-3; CR-001 | ✓ |
| T011 | references/memory-rules.md sección Harness | Componente "Reglas de memoria"; D-1, D-4, D-5 | ✓ |
| T012 | Evals en verde | V-1, V-2, V-9 | ✓ |
| T013 | memory-system.md §10 | Componente "Documentación"; D-6; CR-002 | ✓ |
| T014 | README, guía, CHANGELOG | Componente "Documentación"; D-6 | ✓ |
| T015 | story.md con CR-001 y CR-003 | CR-001, CR-003 | ✓ |
| T016 | Guardrail de skills | V-10 | ✓ |
| T017 | Verificación sugerida de story.md | V-1, V-2, V-4 | ✓ |
| T018 | verify:* y npm test | V-10 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| `HARNESS_PROFILES` (skipLayers, mappings) | Componentes; D-1 | T004 | ✓ |
| Subcomando `scaffold` (filtro, mapped/skipped, informe) | Componentes; D-2 | T005, T009 | ✓ |
| Guardia de escritura fuera de `SPECS_BASE` | Componentes; D-5 | T006 | ✓ |
| Subcomando `index` (externalGroup, mapeados) + template | Componentes; D-4 | T007, T008 | ✓ |
| Modo `migrate` del skill | Componentes; D-3 | T010, T012 | ✓ |
| Reglas de memoria (sección Harness) | Componentes | T011 | ✓ |
| Evals del skill | Componentes | T001, T012 | ✓ |
| Fixtures | Componentes | T002 | ✓ |
| Tests del motor | Componentes | T003, T009 | ✓ |
| Documentación | Componentes; D-6 | T013, T014 | ✓ |
| Interfaz `/memory-system migrate [--harness] [--yes]` | Interfaces | T010 | ✓ |
| Interfaz `node … scaffold --harness …` | Interfaces | T005, T006 | ✓ |
| Interfaz `HARNESS_PROFILES[h]` | Interfaces | T004, T011 | ✓ |
| Interfaz `{layer:external}` del template | Interfaces | T007, T008 | ✓ |
| Interfaz "Plan de migración (texto)" | Interfaces | T005, T010 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-20-memory-system

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` línea 34: `STORY-098 — Adoptar la memoria SDDF en proyectos OpenSpec o Speckit con el modo migrate` con wikilink `[[STORY-098-memory-system-migrate-harness]]` |
| Objetivo de la historia alineado con la épica | ✓ | El "Para" (adoptar la memoria en un proyecto existente sin tocar el harness) materializa el Escenario 4 de los smoke tests de la épica y el requerimiento "Agnóstico al harness" |
| Restricciones de la épica respetadas | ✓ | "Sin escribir fuera de `docs/`" → D-5 (guardia); "no duplicar conceptos que el harness ya modela" → D-1 (`skipLayers`); "`migrate` solo hace scaffolding" → D-3; once capas según `memory-system.md` → D-1 |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** C: elemento de diseño sin tarea (parcial)
- **Descripción:** `design.md` D-1 y Risks declaran que `check` (STORY-097) no debe reportar como `missing-layer` una capa incluida en `skipLayers`. `tasks.md` lo verifica en T003 (caso `check --harness openspec`) pero ninguna tarea modifica `check`: el diseño asume que STORY-097 ya lee `profile.skipLayers` (así está diseñado en STORY-097 D-1). Si STORY-097 se implementa antes que esta con `skipLayers` vacío, el comportamiento es correcto sin cambios; la dependencia es implícita.
- **Archivo afectado:** `tasks.md` — grupo "2. Motor" / `design.md` — D-1
- **Acción requerida:** ninguna obligatoria. Opcional: anotar en T004 que rellenar `skipLayers` activa automáticamente la regla de `check` de STORY-097 D-1, para que el implementador no busque una tarea inexistente.

---

## Recomendaciones

1. **T004 — nota de trazabilidad cruzada (INC-001):** añadir "rellenar `skipLayers` es suficiente para que `check` (STORY-097) deje de reportar la capa; no hay cambio en `check`".
2. **Orden de implementación:** esta historia no define degradación (CR-003): implementar estrictamente después de STORY-095 y STORY-096. IT-003 y V-7 requieren además STORY-097.
3. **`story.md` (planificado en T015):** incorporar CR-001 (`migrate` en proyecto `sddf` informa y remite a `ensure`).
4. **Fixture `openspec/` con colisión de slug (T002):** el caso `auth` sirve para UT-009 y para E2E-002; asegurarse de que E2E-002 espera `[[auth-external]]` (no `[[auth]]`) cuando la guía con `slug: auth` está presente, o usar un fixture sin colisión para E2E-002. La tabla de testcases usa `[[auth…]]` para admitir ambos; conviene fijarlo al escribir el test.

---

## Cobertura de ACs en Testcases

| AC | Descripción | Cubierto en testcases.md | Escenario |
|---|---|---|---|
| AC-1 | `migrate` propone y confirma | ✓ | E2E-001, UT-003, UT-005, IT-001, IT-002, EV-001, EV-002 |
| AC-2 | `ensure --harness openspec` | ✓ | E2E-002, UT-002, UT-008, EV-004 |
| AC-3 | Perfiles de harness y solo lectura | ✓ | UT-001…UT-004, UT-007, IT-003 |
| AC-4 | `migrate` solo scaffolding; `--yes`; proyecto SDDF | ✓ | E2E-001, IT-001, IT-002, EV-003 |

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ✓ | `/story-implement STORY-098` |
| tasks.md | ✓ | `/story-implement-tasks STORY-098` |

Ambas vías disponibles. `tasks.md` (18 tareas) ordena RED → GREEN; `/story-implement-tasks`
es la vía con menor fricción.

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin que cubren los escenarios principales | ✓ | — | 2 bloques `gherkin` (Dado/Cuando/Entonces): migrate en Speckit y ensure en OpenSpec |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño por criterio | ✓ | — | Tabla "Cobertura de Criterios de Aceptación": 4/4 |
| tasks.md existe con tareas atómicas ordenadas por dependencia (setup → componentes → soporte → verificación) | ✓ | — | 5 grupos: evals/fixtures → motor → SKILL.md/referencias → documentación → verificación; 18 tareas con referencias AC/D/V |
| Todos los elementos de diseño tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | D-1…D-6 abren con `// satisface:`; tablas de Componentes e Interfaces llevan columna "AC que satisface" |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad está resuelta o registrada como CR | ✓ | — | "Open Questions: sin preguntas abiertas"; CR-001…CR-003 con acción requerida |
