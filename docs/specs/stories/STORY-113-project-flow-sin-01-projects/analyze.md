---
type: analyze
id: STORY-113
slug: STORY-113-analyze-report
title: "Analyze: project-flow, sddf-init y header-aggregation sin specs/01-projects/"
story: STORY-113
design: STORY-113
tasks: STORY-113
created: 2026-10-08
updated: 2026-10-08
related:
  - STORY-113-project-flow-sin-01-projects
---

<!-- Referencias -->
[[STORY-113-project-flow-sin-01-projects]] · [[STORY-113-project-flow-sin-01-projects-design]] · [[STORY-113-project-flow-sin-01-projects-tasks]]

# Reporte de Coherencia: project-flow, sddf-init y header-aggregation sin specs/01-projects/

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (+ CNF-1 y CNF-2) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada — testcases.md no presente |
| Alineación tareas → diseño | ✓ | 27/27 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 18/18 elementos con tarea (11 componentes + 7 interfaces) |
| Alineación con la épica EPIC-21-colapsar-specs-dos-niveles | ✓ | Listada en `## Historias` (lín. 36); objetivo y restricciones coherentes |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 6/7 criterios ✓ (1 ⚠️, 0 ❌) |

**Estado general:** ⚠️ Advertencias (0 ERROR, 5 WARNING)

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Pipeline completo sobre la estructura nueva: `/sddf-init` + `/project-flow` dejan `vision.md`, `stakeholders.md`, `requirements/` y `roadmap.md` sin crear `specs/01-projects/` | ✓ | D-1 (composición de `/project-begin`, `/project-discovery`, `/project-planning`), D-3 (bucle y re-detección), D-4 (cierre), D-5 (`sddf-init` Paso 2), Interfaz "project-flow → skill de etapa", F-1, contrato #4 |
| AC-2 | Retoma por etapa según el estado (Begin / Discovery / Planning) | ✓ | D-2 (tabla de detección, `$FR_COUNT`, `$ROADMAP_PLANNED`), D-3, D-4, Interfaz "Detección de etapa", F-2, contrato #3 — ver INC-002 (precisión de la fila 3) |
| AC-3 | Ningún skill depende de `01-projects/`; `/sddf-init` no lo crea; `/header-aggregation` asigna `type` por capa | ✓ | D-5, D-6 (tabla de derivación y campos por `type`), Interfaces `sddf-init` Paso 2 y `header-aggregation` Paso 2, F-3, contratos #1, #2, #8, #9 — ver INC-001 (condición del "Dado") |
| CNF-1 | Gates humanos intactos | ✓ | D-3 (gate `Continuar con`/`Detener aquí`, `Reintentar`/`Detener`), D-4 (`Replanificar`/`Cancelar`), contrato #5 |
| CNF-2 | Evals de `project-flow`, `sddf-init`, `header-aggregation` pasan | ✓ | D-7, componentes "Evals …" y "Exenciones de evals", contratos #6, #7 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Línea base (tests, inventario, links, grep de residuos, estado de STORY-109…111) | Contratos #1, #2, #7, #11; riesgo "Orden de integración" | ✓ |
| T002 | Cabecera de `project-flow/SKILL.md` (description, Entrada, Precondiciones, Dependencias, Reglas, `CLI_ROOT`) | D-1; componente "Skill project-flow" | ✓ |
| T003 | Paso 1 de detección por capas | D-2; Interfaz "Detección de etapa"; contrato #3 | ✓ |
| T004 | Composición inline de las tres etapas; error de skill no instalado | D-1; Interfaz "project-flow → skill de etapa"; contrato #4 | ✓ |
| T005 | Bucle de re-detección y gates entre etapas | D-3; Interfaces "Gate entre etapas" y "Gate de etapa no cerrada"; contrato #5 | ✓ |
| T006 | Pipeline ya completo y mensaje de cierre | D-4; Interfaz "Gate de pipeline completo" | ✓ |
| T007 | Degradación F-4 y barrido de menciones retiradas | F-4; D-1…D-4; contratos #1, #4 | ✓ |
| T008 | README de `project-flow` | Componente "README project-flow" | ✓ |
| T009 | `sddf-init/SKILL.md` Paso 2 y Paso 6 | D-5; Interfaz "sddf-init Paso 2"; contrato #8 | ✓ |
| T010 | `sddf-init/README.md` `Output` | D-5; componente "README sddf-init" | ✓ |
| T011 | Esquema canónico y campos obligatorios por `type` | D-6 (campos por `type`, esquema) | ✓ |
| T012 | Derivación de `type` del Paso 2 | D-6 (tabla de derivación); Interfaz "header-aggregation Paso 2"; Esquema de datos | ✓ |
| T013 | Pasos 1, 3.3 y 4.1 de `header-aggregation` | D-6 ("Esquema y búsquedas", merge) | ✓ |
| T014 | Fixture `examples/capas/` | D-7; componente "Fixture de capas" | ✓ |
| T015 | `project-flow/evals/evals.json` TC-001…TC-008 | D-7; componente "Evals project-flow" | ✓ |
| T016 | `sddf-init/evals/evals.json` TC-001, TC-006, versión 2.2.0 | D-7; componente "Evals sddf-init" | ✓ |
| T017 | `header-aggregation/evals/evals.json` TC-004, TC-005, versión 1.2.0 | D-7 (TC-00x/TC-00y); componente "Evals header-aggregation" | ✓ |
| T018 | Retirar `project-flow` de `config/eval-exemptions.json` | D-7; componente "Exenciones de evals"; contrato #7 | ✓ |
| T019 | Entrada BREAKING en `CHANGELOG.md` | Componente "CHANGELOG" | ✓ |
| T020 | Contratos #1 y #2 (grep) | Contratos #1, #2; CR-001 — ver INC-003 e INC-004 | ✓ |
| T021 | Contratos #3–#5 | Contratos #3, #4, #5 | ✓ |
| T022 | Contratos #8 y #9 | Contratos #8, #9 | ✓ |
| T023 | Contrato #7 (JSON válido, inventario) | Contrato #7 | ✓ |
| T024 | Contrato #6 (`npm run test:eval`) | Contrato #6 | ✓ |
| T025 | Contrato #11 y no regresión vs. línea base | Contrato #11 | ✓ |
| T026 | Contrato #10 (encoding) | Contrato #10 | ✓ |
| T027 | Validación manual de AC-1 | F-1; AC-1; CNF-1 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Skill `project-flow` | Componentes afectados, fila 1 | T002–T007 | ✓ |
| README `project-flow` | Componentes afectados, fila 2 | T008 | ✓ |
| Evals `project-flow` | Componentes afectados, fila 3 | T015 | ✓ |
| Exenciones de evals | Componentes afectados, fila 4 | T018 | ✓ |
| Skill `sddf-init` | Componentes afectados, fila 5 | T009 | ✓ |
| README `sddf-init` | Componentes afectados, fila 6 | T010 | ✓ |
| Evals `sddf-init` | Componentes afectados, fila 7 | T016 | ✓ |
| Skill `header-aggregation` | Componentes afectados, fila 8 | T011–T013 | ✓ |
| Fixture de capas | Componentes afectados, fila 9 | T014 | ✓ |
| Evals `header-aggregation` | Componentes afectados, fila 10 | T017 | ✓ |
| CHANGELOG | Componentes afectados, fila 11 | T019 | ✓ |
| Detección de etapa | Interfaces, fila 1 | T003 | ✓ |
| `project-flow` → skill de etapa | Interfaces, fila 2 | T004 | ✓ |
| Gate entre etapas | Interfaces, fila 3 | T005 | ✓ |
| Gate de etapa no cerrada | Interfaces, fila 4 | T005 | ✓ |
| Gate de pipeline completo | Interfaces, fila 5 | T006 | ✓ |
| `sddf-init` Paso 2 | Interfaces, fila 6 | T009 | ✓ |
| `header-aggregation` Paso 2 | Interfaces, fila 7 | T012 | ✓ |

Los 11 contratos de verificación de design.md quedan cubiertos por T001 y T020–T027.

---

## Alineación con la Épica

**Épica padre:** EPIC-21-colapsar-specs-dos-niveles

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` § Historias (lín. 36): "STORY-113 — project-flow, sddf-init, header-aggregation: retoma por etapa según el estado de las capas. Cierre: "01-projects" solo queda en la lógica de migración de memory-system." |
| Objetivo de la historia alineado con la épica | ✓ | El "Para" (pipeline de proyecto sobre la estructura de dos niveles) materializa el Alcance de la épica y la nota "simplificando el mecanismo de proyecto activo WIP por el uso del substatus del documento destino" (§ Notas, lín. 88), que D-2 implementa. |
| Restricciones de la épica respetadas | ✓ | Criterio de salida "Ningún skill ni agente referencia `specs/01-projects/`…": la excepción de AC-3 (migración de `memory-system`) es coherente con STORY-114; los renombrados `02-epics`/`03-stories` quedan en STORY-108 (Non-Goals de story.md y design.md). Breaking change registrado en CHANGELOG (T019). |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** — (CR abierto sobre story.md; no bloqueante)
- **Descripción:** el "Dado" de AC-3 condiciona el cierre solo a "STORY-109 a STORY-112 y este cambio", pero `git grep "01-projects" -- skills agents` seguirá mostrando `skills/skill-preflight/**` (STORY-108) y partes de `skills/memory-system/**` ajenas a la detección (STORY-115); además `/sddf-init --level full` crea `specs/01-projects/` vía `memory-system scaffold` hasta STORY-115. design.md lo registra en CR-001 y el contrato #2 / T020 lo verifican con excepciones, pero el texto de AC-3 no se ha ajustado.
- **Archivo afectado:** story.md — sección "AC-3 — Escenario de cierre" (lín. 53-60); design.md — "CR-001" (lín. 423-432)
- **Acción requerida:** aplicar CR-001 en story.md (ampliar el "Dado" a STORY-108, 109–112, 114 y 115, o acotar la búsqueda de AC-3 a los tres skills de la historia y delegar la global a STORY-117).

### INC-002 [WARNING]

- **Tipo:** — (precisión de AC vs. regla de diseño; no bloqueante)
- **Descripción:** la tabla de AC-2 usa literalmente "sin `roadmap.md`" (fila 3) y "`requirements/functional/` vacío" (fila 2); D-2 decide con `$ROADMAP_PLANNED` (roadmap con `## Propuesta (` o `EPIC-NN` en `## Épicas`) y con `$FR_COUNT`, que también cuenta `### FR-NNN` en `requirements/srs-*.md`. Ambas reglas son superconjuntos compatibles con los ejemplos de AC-2, pero un repo con `functional/` vacío y FR en un SRS iría a Planning, no a Discovery, sin que la historia lo diga.
- **Archivo afectado:** story.md — "AC-2" (lín. 46-50); design.md — "D-2" (lín. 112-131) y "CR-002" (lín. 434-440)
- **Acción requerida:** aplicar CR-002 en story.md (fila 3 → "sin `roadmap.md` planificado") y precisar la fila 2 como "sin requisitos FR (archivos `FR-*` o SRS)".

### INC-003 [WARNING]

- **Tipo:** — (coherencia interna design.md ↔ tasks.md; no bloqueante)
- **Descripción:** el regex del contrato #1 (`01-projects|PROJ-|project-intent|project-plan|project\.md|type: project`) coincide con `/epic-from-project-plan`, que D-4 y T006 exigen escribir en el mensaje de cierre de `skills/project-flow/SKILL.md` (`Siguiente comando: /epic-from-project-plan`). El contrato #1 / T020 nunca daría "vacío" y su excepción solo contempla los `not_contains` de los `evals.json`.
- **Archivo afectado:** design.md — "Contratos de verificación", fila 1 (lín. 388) y "D-4" (lín. 181); tasks.md — T020 (lín. 66) y T006 (lín. 37)
- **Acción requerida:** cambiar el patrón a `project-plan(\.md|-template)` o añadir a T020 la excepción explícita de `epic-from-project-plan`.

### INC-004 [WARNING]

- **Tipo:** — (dependencia entre historias; no bloqueante)
- **Descripción:** el contrato #1 también exige que `skills/sddf-init/SKILL.md` quede sin `project-intent`/`project-plan`, pero las líneas 110-112, 199-201 y 257-259 (`project-intent-template.md`, `project-plan-template.md`) las retiran STORY-109 (T017), STORY-110 y STORY-111 (T024), no esta historia (Non-Goal de design.md, lín. 77). La nota de orden de tasks.md (lín. 21-25) declara la dependencia solo para el grupo 2 (`project-flow`) y dice que `sddf-init` es independiente; T020 fallaría si se ejecuta antes de integrar esas historias.
- **Archivo afectado:** tasks.md — nota de orden (lín. 21-25) y T020 (lín. 66)
- **Acción requerida:** indicar en la nota de orden (o en T020) que el contrato #1 sobre `skills/sddf-init` requiere STORY-109…111 integradas, igual que el grupo 2.

### INC-005 [WARNING]

- **Tipo:** E (criterio DoD PLAN con evidencia insuficiente → WARNING)
- **Descripción:** criterio "Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen": todos los Goals, Decisions, componentes, interfaces y flujos están trazados, salvo el componente "CHANGELOG" (`— (trazabilidad de release)`, lín. 303) y los contratos #10 y #11 (`—`).
- **Archivo afectado:** design.md — "Componentes afectados" (lín. 303) y "Contratos de verificación" (lín. 397-398)
- **Acción requerida:** opcional — trazar el CHANGELOG a AC-3/CNF-2 (cierre del breaking change) o documentar que los elementos transversales quedan fuera de la regla.

---

## Recomendaciones

1. **INC-001:** en story.md, AC-3, ampliar el "Dado" según CR-001 o acotar la búsqueda a `skills/project-flow`, `skills/sddf-init` y `skills/header-aggregation`, dejando la verificación global a STORY-117.
2. **INC-002:** en story.md, AC-2, reescribir la fila 3 como "sin `roadmap.md` planificado" y la fila 2 como "sin requisitos FR" (CR-002), para que testcases futuros y el contrato #3 partan de la misma regla.
3. **INC-003:** en design.md, contrato #1, y en tasks.md, T020, usar `project-plan(\.md|-template)` en lugar de `project-plan` o excluir `epic-from-project-plan` explícitamente.
4. **INC-004:** en tasks.md, nota de orden, añadir que el contrato #1 sobre `sddf-init` depende de STORY-109…111 (fila del Paso 2b y ejemplos de salida).
5. **INC-005:** en design.md, "Componentes afectados", sustituir `—` del CHANGELOG por la referencia al AC/CNF que cierra.
6. Generar `testcases.md` con `/story-testcases STORY-113` si se quiere habilitar `/story-implement`; las 8 + 2 + 2 aserciones de D-7 ya ofrecen la base.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-113` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-113` (disponible) |

---

## Cumplimiento DoD — Fase PLAN

Fuente: `docs/guardrails/dod-story-plan.md` (override `sddf.config.yaml › guardrails.dod.story.plan: dod-story-plan`), `enforcement: error`.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 (principal), AC-2 (Escenario + Ejemplos), AC-3 (cierre) en bloques `gherkin` |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | AC-1: D-1/D-3/D-5; AC-2: D-2/D-3/D-4; AC-3: D-5/D-6 |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ⚠️ | WARNING | Goals y D-1…D-7 con `// satisface:`; columnas "AC que satisface"; CHANGELOG y contratos #10/#11 sin AC (INC-005) |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | "Open Questions: Ninguna"; dependencias y ambigüedades en CR-001…CR-004 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente (T001–T027) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | AC-1: T002–T009, T027; AC-2: T003, T005, T006, T015; AC-3: T009–T014, T020, T022; cada tarea acotada a un archivo/sección o a una verificación |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: testcases.md ausente |
