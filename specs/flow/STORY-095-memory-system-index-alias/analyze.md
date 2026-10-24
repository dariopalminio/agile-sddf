---
type: analyze
id: STORY-095
slug: STORY-095-analyze-report
title: "Analyze: Crear el skill memory-system con el modo index y deprecar docs-wiki-builder"
story: STORY-095
design: STORY-095
testcases: STORY-095
tasks: STORY-095
created: 2026-09-20
updated: 2026-09-20
related:
  - STORY-095-memory-system-index-alias
---

<!-- Referencias -->
[[STORY-095-memory-system-index-alias]]

# Reporte de Coherencia: Crear el skill memory-system con el modo index y deprecar docs-wiki-builder

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 7/7 criterios cubiertos |
| Cobertura de ACs en testcases.md | ✓ | 7/7 ACs con caso de prueba |
| Alineación tareas → diseño | ✓ | 26/26 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 12/12 componentes y 6/6 interfaces con tarea |
| Alineación con la épica EPIC-19-framework-consistency | ⚠️ | Listada y alineada en objetivo; la entrada de la épica conserva el título pre-split y no lista las hermanas 096–099 |
| Cumplimiento DoD — Fase PLAN | ✓ | 5/5 criterios ✓ |

**Estado general:** ⚠️ Advertencias (sin inconsistencias bloqueantes)

> DoD cargado desde `docs/guardrails/dod-story-checklist.md` (sección "Definition of Done para el estado PLAN"); `docs/policies/definition-of-done-story.md` no existe — la constitución referencia el guardrail.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | `index` regenera `docs/index.md` completo, slug derivado, exclusiones, idempotente | ✓ | D-1, D-3, D-4; F-1; Interfaz `node … index`; Componentes "Motor determinista", "Template del índice" |
| AC-2 | Alias con aviso literal, delegación y mismo índice | ✓ | D-1, D-4, D-5; F-2; Interfaz `/docs-wiki-builder` |
| AC-3 | `header-aggregation` independiente | ✓ | D-6; Componente `header-aggregation` (nota) |
| AC-4 | Detección de harness con precedencia y `--harness`; solo decide raíces indexadas | ✓ | D-2; F-4; Interfaz `node … detect`; Esquema "Perfil de harness" |
| AC-5 | Índice LLM Wiki con formato vigente; nodos pendientes no bloquean | ✓ | D-3, D-4; Interfaz `assets/index-template.md`; `references/memory-rules.md` |
| AC-6 | Alias con retirada gradual, eval mínimo, sin exención | ✓ | D-5, D-7; Componentes "Alias deprecado", "Exención de evals" |
| AC-7 | Sin modo: informa modos disponibles sin fallar | ✓ | D-1; F-3; Interfaz `/memory-system [index]` |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | evals.json de memory-system | Componente "Evals del skill"; D-1, D-2; V-10 | ✓ |
| T002 | Fixtures sddf/openspec/speckit | Componente "Fixtures"; D-2, D-3 | ✓ |
| T003 | Evals del alias | D-5; V-4 | ✓ |
| T004 | test/memory-system.test.js | Componente "Tests del motor"; V-1, V-2, V-3, V-6, V-7, V-8 | ✓ |
| T005 | Esqueleto CLI + HARNESS_PROFILES | D-1, D-2; Componente "Motor determinista" | ✓ |
| T006 | Subcomando detect | D-2; F-4; Interfaz `detect` | ✓ |
| T007 | Parser de frontmatter + escáner | D-3; Esquema "Nodo indexable" | ✓ |
| T008 | Subcomando index | D-4; Interfaz `index`; Interfaz `assets/index-template.md` | ✓ |
| T009 | GREEN del motor | D-1 | ✓ |
| T010 | index-template.md | Componente "Template del índice"; D-4 | ✓ |
| T011 | references/memory-rules.md | Componente "Reglas de memoria"; D-3; Interfaz `references/memory-rules.md` | ✓ |
| T012 | SKILL.md de memory-system | Componente "Skill memory-system"; D-1; F-1, F-3 | ✓ |
| T013 | Evals de memory-system en verde | V-10 | ✓ |
| T014 | Alias docs-wiki-builder | Componente "Alias deprecado"; D-5; F-2 | ✓ |
| T015 | Eliminar template viejo y exención | Componentes "Alias deprecado", "Exención de evals"; V-9 | ✓ |
| T016 | Nota en header-aggregation | Componente `header-aggregation`; D-6 | ✓ |
| T017 | Evals de alias y header-aggregation | V-4, V-5 | ✓ |
| T018 | memory-system.md | Componente "Documentación"; D-7 | ✓ |
| T019 | sddf-commands-pipeline.md | Componente "Documentación"; D-7 | ✓ |
| T020 | README y CHANGELOG | Componente "Documentación"; D-7 | ✓ |
| T021 | AGENTS/CLAUDE/domain-skills-map | D-7 | ✓ |
| T022 | Retroalimentar story.md con CRs | CR-001, CR-003 | ✓ |
| T023 | Regenerar docs/index.md | Componente "Índice de la wiki"; D-7; CR-003 | ✓ |
| T024 | Guardrail de skills | V-11 | ✓ |
| T025 | Verificación sugerida de story.md | V-4, V-5 | ✓ |
| T026 | verify:* y npm test | V-9, V-12 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Skill `memory-system` (SKILL.md) | Componentes; D-1 | T012, T013 | ✓ |
| Motor determinista (`detect`, `index`) | Componentes; D-1…D-4 | T005–T009 | ✓ |
| Template del índice | Componentes; D-4 | T010 | ✓ |
| Reglas de memoria (`references/`) | Componentes; D-3 | T011 | ✓ |
| Evals del skill | Componentes | T001, T013 | ✓ |
| Fixtures | Componentes | T002 | ✓ |
| Tests del motor | Componentes | T004, T009 | ✓ |
| Alias deprecado | Componentes; D-5 | T003, T014, T015, T017 | ✓ |
| Exención de evals | Componentes; D-5 | T015 | ✓ |
| `header-aggregation` (nota) | Componentes; D-6 | T016, T017 | ✓ |
| Documentación (4 archivos) | Componentes; D-7 | T018–T021 | ✓ |
| Índice de la wiki | Componentes; D-7 | T023 | ✓ |
| Interfaz `/memory-system [index] [--harness] [--dry-run]` | Interfaces | T012 | ✓ |
| Interfaz `node … detect` | Interfaces | T006 | ✓ |
| Interfaz `node … index` | Interfaces | T008 | ✓ |
| Interfaz `assets/index-template.md` | Interfaces | T010 | ✓ |
| Interfaz `/docs-wiki-builder [--update\|--dry-run]` | Interfaces | T014 | ✓ |
| Interfaz `references/memory-rules.md` | Interfaces | T011 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-19-framework-consistency

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` línea 33 lista `STORY-095`, pero con el título de la historia sin dividir ("Unificar la gestión de memoria en un skill memory-system con modos") y sin wikilink; STORY-096…099 no aparecen |
| Objetivo de la historia alineado con la épica | ✓ | El "Para" (un punto de entrada para la memoria, base de los demás modos) materializa el "Requerimiento: capas de documentación" y el objetivo de coherencia del framework |
| Restricciones de la épica respetadas | ✓ | Esta historia no crea capas; la divergencia entre el árbol recomendado por la épica (`rfcs/`, `how-to/`, `knowledge/`) y las once capas afecta a STORY-096, no a esta |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D: desalineación con la épica
- **Descripción:** `epic.md` (sección "Historias", línea 33) conserva el título pre-split de STORY-095 y no lista las historias hermanas STORY-096, STORY-097, STORY-098 y STORY-099 creadas por `/story-split`. La trazabilidad épica → historias queda incompleta y el título no coincide con el `title` del frontmatter de `story.md`.
- **Archivo afectado:** `docs/specs/02-epics/EPIC-19-framework-consistency/epic.md` — sección "Historias"
- **Acción requerida:** actualizar la entrada de STORY-095 con el título nuevo y su wikilink `[[STORY-095-memory-system-index-alias]]`, y añadir una entrada por cada hermana (096–099) con resumen de una línea y wikilink. No bloquea la implementación.

---

## Recomendaciones

1. **`epic.md` → "Historias":** actualizar la entrada de STORY-095 y añadir STORY-096…099 (INC-001); conviene hacerlo en la tarea T022, que ya retroalimenta artefactos ascendentes.
2. **`story.md` (planificado en T022):** incorporar CR-001 (Node ≥ 18 con degradación inline) y CR-003 (la comparación con el índice manual es por entradas, no por descripciones) para que la historia no contradiga el diseño en code review.
3. **Primera regeneración de `docs/index.md` (T023):** revisar el diff con atención a las descripciones manuales que se pierden y a las entradas anidadas de `plan-NN.md` dentro de épicas, que el nuevo índice listará como nodos de la capa `specs-epics` sin la jerarquía visual actual.

---

## Cobertura de ACs en Testcases

| AC | Descripción | Cubierto en testcases.md | Escenario |
|---|---|---|---|
| AC-1 | `index` regenera el índice | ✓ | E2E-001, UT-006, UT-007, UT-008, IT-001, EV-001, EV-002 |
| AC-2 | Alias deprecado | ✓ | E2E-002, EV-005, EV-006 |
| AC-3 | `header-aggregation` independiente | ✓ | E2E-003 |
| AC-4 | Detección de harness | ✓ | UT-001, UT-002, UT-003, IT-002, EV-004 |
| AC-5 | Wikilinks y nodos pendientes | ✓ | E2E-001, UT-009, IT-002 |
| AC-6 | Alias con eval y sin exención | ✓ | E2E-002, EV-005, EV-006 (+ contrato V-9 por comando) |
| AC-7 | Sin modo informa y no falla | ✓ | EV-003 |

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ✓ | `/story-implement STORY-095` |
| tasks.md | ✓ | `/story-implement-tasks STORY-095` |

Ambas vías están disponibles. `tasks.md` ordena el trabajo en RED → GREEN (evals y tests
antes del motor y del SKILL.md), por lo que `/story-implement-tasks` respeta el principio 11
de la constitución con menor fricción. Con 26 tareas pendientes, el skill pedirá confirmación
al superar el umbral de 20.

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin que cubren los escenarios principales | ✓ | — | 3 bloques `gherkin` (Dado/Cuando/Entonces) en `story.md`, uno por escenario |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño por criterio | ✓ | — | Tabla "Cobertura de Criterios de Aceptación": 7/7 |
| tasks.md existe con tareas atómicas ordenadas por dependencia (setup → componentes → soporte → verificación) | ✓ | — | 7 grupos: evals/fixtures → motor → assets → SKILL.md → alias → documentación → verificación; 26 tareas con referencias AC/D/V |
| Todos los elementos de diseño tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | D-1…D-7 abren con `// satisface:`; tablas de Componentes e Interfaces llevan columna "AC que satisface" |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad está resuelta o registrada como CR | ✓ | — | "Open Questions: sin preguntas abiertas"; CR-001…CR-003 con acción requerida |
