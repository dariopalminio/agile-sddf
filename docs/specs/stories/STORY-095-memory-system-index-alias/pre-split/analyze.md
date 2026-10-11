---
type: analyze
id: STORY-095
slug: STORY-095-analyze-report
title: "Analyze: Unificar la gestión de memoria en un skill memory-system con modos"
story: STORY-095
design: STORY-095
testcases: STORY-095
tasks: STORY-095
created: 2026-09-20
updated: 2026-09-20
related:
  - STORY-095-memory-system-unificado
---

<!-- Referencias -->
[[STORY-095-memory-system-unificado]]

# Reporte de Coherencia: Unificar la gestión de memoria en un skill memory-system con modos

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 18/18 criterios cubiertos |
| Cobertura de ACs en testcases.md | ✓ | 18/18 ACs con caso de prueba |
| Alineación tareas → diseño | ✓ | 33/33 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 14/14 elementos con tarea |
| Alineación con la épica EPIC-19-framework-consistency | ⚠️ | Listada y alineada en objetivo; la estructura de capas del epic.md difiere de las once capas de la historia |
| Cumplimiento DoD — Fase PLAN | ✓ | 5/5 criterios ✓ |

**Estado general:** ⚠️ Advertencias (sin inconsistencias bloqueantes)

> DoD cargado desde `docs/guardrails/dod-story-checklist.md` (sección "Definition of Done para el estado PLAN"); `docs/policies/definition-of-done-story.md` no existe en este repositorio — la constitución referencia el guardrail.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | `/docs-wiki-builder` avisa, delega en `memory-system index` y produce el mismo `index.md` | ✓ | D-1, D-4, D-7; F-4; Interfaz `/docs-wiki-builder` |
| AC-2 | `ensure` detecta capas faltantes, crea solo lo faltante, regenera índice, reporta | ✓ | D-2, D-3, D-6; F-1; Interfaz "Informe de scaffold" |
| AC-3 | `scaffold` crea `constitution.md`, `product/*`, README por capa, 6 plantillas; no indexa | ✓ | D-3; Componente "Árbol semilla" |
| AC-4 | `check` reporta sin escribir; exit 1/0 | ✓ | D-5; F-2; Componente "Motor determinista" |
| AC-5 | `migrate` detecta harness, propone sin escribir, confirma, scaffold adaptado | ✓ | D-2, D-6; F-3 |
| AC-6 | `rebuild` sin `--force` se detiene sin modificar | ✓ | D-6; F-5 |
| AC-7 | `rebuild --force` regenera y advierte | ✓ | D-6; F-5 |
| AC-8 | `sddf-init --level full` invoca scaffold; resultado idéntico | ✓ | D-8; Interfaz `/sddf-init --level` |
| AC-9 | `ensure --harness openspec` respeta `openspec/`, indexa sus artefactos | ✓ | D-2, D-4; Esquema "Perfil de harness" |
| AC-10 | `header-aggregation` sigue independiente | ✓ | D-9 |
| AC-11 | Alias sobrevive ≥ 1 minor, retirada en major | ✓ | D-7, D-10 |
| AC-12 | Seis modos idempotentes | ✓ | D-1 (motor determinista), D-3 (copia-si-falta), D-4 (regeneración completa) |
| AC-13 | Detección de harness con `--harness` | ✓ | D-2 (precedencia de `detect`) |
| AC-14 | Once capas + `constitution.md` | ✓ | D-2 (catálogo `LAYERS`), D-3 |
| AC-15 | `index` con wikilinks patrón LLM Wiki | ✓ | D-4; Interfaz `assets/index-template.md` |
| AC-16 | `--level` en `sddf-init`; solo `full` invoca | ✓ | D-8 |
| AC-17 | `ensure` puede invocar `header-aggregation` | ✓ | D-6 (`--fix-frontmatter`), D-9 |
| AC-18 | `check --json` y exit code | ✓ | D-5 (esquema JSON) |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | evals.json de memory-system | D-6 (mensajes literales), Componente "Evals del skill" | ✓ |
| T002 | Fixtures por harness | D-2, D-5; Componente "Fixtures de evals" | ✓ |
| T003 | Eval del alias docs-wiki-builder | D-7; CR-008 | ✓ |
| T004 | Evals de sddf-init --level | D-8 | ✓ |
| T005 | test/memory-system.test.js | Contratos de verificación V-4, V-6, V-7, V-9 | ✓ |
| T006 | Esqueleto CLI del motor, LAYERS, HARNESS_PROFILES | D-1, D-2; Componente "Motor determinista" | ✓ |
| T007 | Subcomando detect | D-2 (precedencia) | ✓ |
| T008 | Escáner + parser de frontmatter + slug | D-4; Esquema "Nodo indexable" | ✓ |
| T009 | Subcomando scaffold | D-3, D-6; Interfaz "Informe de scaffold" | ✓ |
| T010 | Subcomando index | D-4; Interfaz `assets/index-template.md` | ✓ |
| T011 | Subcomando check | D-5; Esquema "Problema de check" | ✓ |
| T012 | GREEN del motor | D-1 | ✓ |
| T013 | Árbol semilla assets/scaffold | D-3; Componente "Árbol semilla" | ✓ |
| T014 | adr-template.md como sexta plantilla | D-3; CR-003 | ✓ |
| T015 | index-template.md | D-4; Componente "Template del índice" | ✓ |
| T016 | references/memory-rules.md | Risks (SKILL.md < 500 líneas); D-4, D-5 | ✓ |
| T017 | SKILL.md de memory-system (estructura, params, degradación) | D-1, D-6; Interfaz `/memory-system` | ✓ |
| T018 | Secuencias de los seis modos en SKILL.md | D-6; F-1, F-3, F-5 | ✓ |
| T019 | Evals de memory-system en verde | D-6 | ✓ |
| T020 | Alias docs-wiki-builder | D-7; F-4; Componente "Alias deprecado" | ✓ |
| T021 | Eliminar template viejo y exención de evals | D-7; Componente "Exención de evals" | ✓ |
| T022 | sddf-init --level | D-8; Componente `sddf-init` | ✓ |
| T023 | Nota en header-aggregation | D-9; Componente `header-aggregation` | ✓ |
| T024 | Evals de alias y sddf-init en verde | D-7, D-8 | ✓ |
| T025 | memory-system.md | D-10; Componente "Arquitectura de memoria"; CR-003/004/006 | ✓ |
| T026 | sddf-commands-pipeline.md | D-10; Componente "Guía de pipeline" | ✓ |
| T027 | README y CHANGELOG | D-10; Componente "README / CHANGELOG" | ✓ |
| T028 | AGENTS/CLAUDE/domain-skills-map | D-10 | ✓ |
| T029 | Retroalimentar story.md con CRs | Registro de Cambios CR-001/002/003/005/007 | ✓ |
| T030 | Regenerar docs/index.md | D-4; Componente "Índice de la wiki" | ✓ |
| T031 | Guardrail de skills | V-11 | ✓ |
| T032 | Verificación sugerida de story.md | V-1…V-10 | ✓ |
| T033 | verify:* y npm test | V-12 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Skill `memory-system` (SKILL.md) | Componentes afectados; D-1, D-6 | T017, T018, T019 | ✓ |
| Motor determinista `scripts/memory-system.js` | D-1…D-5 | T006–T012 | ✓ |
| Árbol semilla `assets/scaffold/**` | D-3 | T013, T014 | ✓ |
| Template del índice `assets/index-template.md` | D-4 | T015 | ✓ |
| Evals del skill | Componentes afectados | T001, T019 | ✓ |
| Fixtures de evals `examples/*` | Componentes afectados | T002 | ✓ |
| Alias deprecado `docs-wiki-builder` | D-7 | T003, T020, T021 | ✓ |
| Exención de evals `config/eval-exemptions.json` | D-7, CR-008 | T021 | ✓ |
| `sddf-init --level` | D-8 | T004, T022, T024 | ✓ |
| `header-aggregation` (nota) | D-9 | T023 | ✓ |
| Arquitectura de memoria `memory-system.md` | D-10 | T025 | ✓ |
| Guía de pipeline | D-10 | T026 | ✓ |
| README / CHANGELOG | D-10 | T027 | ✓ |
| Índice de la wiki `docs/index.md` | D-4, D-10 | T030 | ✓ |
| Interfaz `/memory-system [modo] [flags]` | Interfaces | T017, T018 | ✓ |
| Interfaz `node scripts/memory-system.js <sub>` | Interfaces | T006–T011 | ✓ |
| Interfaz "Informe de scaffold" | Interfaces | T009, T018, T022 | ✓ |
| `references/memory-rules.md` | Risks / Trade-offs | T016 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-19-framework-consistency

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` línea 33: `- [ ] **STORY-095 Unificar la gestión de memoria en un skill memory-system con modos**` (sin descripción ni wikilink, a diferencia de STORY-086…094) |
| Objetivo de la historia alineado con la épica | ✓ | El "Para" de la historia (un solo punto de entrada de memoria, agnóstico al harness) materializa el "Requerimiento: capas de documentación" de la épica (líneas 68–90) y el principio "el framework sea coherente consigo mismo" |
| Restricciones de la épica respetadas | ⚠️ | La estructura recomendada en `epic.md` líneas 71–90 incluye `rfcs/`, `how-to/`, `knowledge/` y omite `product/` y `architecture/`; la historia fija once capas según `docs/architecture/memory-system.md` (fuente de verdad declarada). La divergencia está en la épica, no en la historia (ver INC-001) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D: desalineación con la épica
- **Descripción:** `epic.md` (sección "Requerimiento: capas de documentación", líneas 68–90) recomienda una estructura con `rfcs/`, `how-to/`, `knowledge/` y sin `product/` ni `architecture/`. `story.md` (sección "Requerimiento: Once capas de memoria", línea 152) y `design.md` (D-2, catálogo `LAYERS`) siguen las once capas de `docs/architecture/memory-system.md`. Tres capas del epic no serán creadas por el scaffold y dos capas del scaffold no figuran en el epic.
- **Archivo afectado:** `docs/specs/02-epics/EPIC-19-framework-consistency/epic.md` — sección "Requerimiento: capas de documentación"
- **Acción requerida:** actualizar el árbol recomendado de la épica para que coincida con `memory-system.md` (o anotar que `rfcs/`, `how-to/` y `knowledge/` son opcionales y no gestionadas por el scaffold). No bloquea: la historia y el diseño son coherentes entre sí y con la arquitectura declarada como fuente de verdad. Relacionado con CR-006 de `design.md`.

### INC-002 [WARNING]

- **Tipo:** D: desalineación con la épica
- **Descripción:** la entrada de STORY-095 en `epic.md` (línea 33) carece de la descripción y del wikilink `[[STORY-095-memory-system-unificado]]` que sí tienen las demás historias de la épica; el invariante de bidireccionalidad de `memory-system.md` §5 no se cumple para esta historia.
- **Archivo afectado:** `docs/specs/02-epics/EPIC-19-framework-consistency/epic.md` — sección "Historias"
- **Acción requerida:** completar la entrada con un resumen de una línea y el wikilink a la historia (puede hacerse junto con T029).

---

## Recomendaciones

1. **`epic.md` → "Requerimiento: capas de documentación":** alinear el árbol con las once capas de `memory-system.md` o marcar `rfcs/`, `how-to/` y `knowledge/` como opcionales; hacerlo antes de T025 para que la documentación de arquitectura, la épica y el scaffold digan lo mismo (INC-001).
2. **`epic.md` → "Historias":** añadir descripción y wikilink a la entrada de STORY-095 (INC-002); conviene ejecutarlo dentro de T029, que ya retroalimenta artefactos ascendentes.
3. **`story.md` (no bloqueante, ya planificado en T029):** incorporar los CR-001, CR-002, CR-003, CR-005 y CR-007 de `design.md` (dependencia de Node ≥ 18, `--fix-frontmatter` como flag de `memory-system`, enumeración de las seis plantillas, Non-Goal de reorganización de archivos, semántica de `--level minimal|standard`) para que la historia no contradiga el diseño al llegar a code review.
4. **Tamaño de la historia:** `story.md` (línea 212) ya la señala como candidata a `/story-split`. `tasks.md` tiene 33 tareas en 7 grupos; si el equipo prefiere entregas más cortas, los grupos 1–4 (motor + skill) y 5–6 (integraciones + documentación) son un corte natural. No es una inconsistencia; se deja a criterio del mantenedor.

---

## Cobertura de ACs en Testcases

| AC | Descripción | Cubierto en testcases.md | Escenario |
|---|---|---|---|
| AC-1 | Alias deprecado delega y produce el mismo índice | ✓ | E2E-001, IT-004, EV-006, UT-010 |
| AC-2 | `ensure` consistente en un paso | ✓ | E2E-002, IT-001, EV-001 |
| AC-3 | `scaffold` crea lo faltante y no indexa | ✓ | E2E-003, UT-007 |
| AC-4 | `check` determinista | ✓ | E2E-004, UT-012, UT-013, UT-014, EV-003 |
| AC-5 | `migrate` propone antes de escribir | ✓ | E2E-005, UT-008, EV-004 |
| AC-6 | `rebuild` sin `--force` se detiene | ✓ | E2E-006, EV-002 |
| AC-7 | `rebuild --force` regenera y advierte | ✓ | E2E-007 |
| AC-8 | `sddf-init --level full` invoca scaffold | ✓ | E2E-008, IT-003, EV-009 |
| AC-9 | Compatibilidad OpenSpec/Speckit | ✓ | E2E-009, EV-005 |
| AC-10 | `header-aggregation` independiente | ✓ | E2E-010 |
| AC-11 | Alias con retirada gradual | ✓ | EV-006, IT-004 |
| AC-12 | Seis modos idempotentes | ✓ | UT-007, UT-010 |
| AC-13 | Detección de harness | ✓ | UT-001, UT-002, E2E-009, EV-005 |
| AC-14 | Once capas | ✓ | E2E-003, UT-007 |
| AC-15 | Índice con wikilinks | ✓ | UT-010, UT-011, E2E-009 |
| AC-16 | `--level` en `sddf-init` | ✓ | EV-007, EV-008, EV-009, E2E-008 |
| AC-17 | Integración con `header-aggregation` | ✓ | IT-002 |
| AC-18 | Salida parseable de `check` | ✓ | UT-012, UT-013, EV-003 |

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ✓ | `/story-implement STORY-095` |
| tasks.md | ✓ | `/story-implement-tasks STORY-095` |

Ambas vías están disponibles. Dado que la historia exige evals antes del SKILL.md (constitución, principio 11) y `tasks.md` ya ordena el trabajo en fase RED → GREEN, `/story-implement-tasks` es la vía que respeta ese orden con menor fricción.

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin que cubren los escenarios principales | ✓ | — | 10 bloques `gherkin` (Dado/Cuando/Entonces) en `story.md` líneas 40–136 |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño por criterio | ✓ | — | Tabla "Cobertura de Criterios de Aceptación": 18/18 |
| tasks.md existe con tareas atómicas ordenadas por dependencia (setup → componentes → soporte → verificación) | ✓ | — | 7 grupos: evals/fixtures → motor → assets → SKILL.md → integraciones → documentación → verificación E2E; 33 tareas con referencias AC/D/V |
| Todos los elementos de diseño tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | D-1…D-10 abren con `// satisface:`; tablas de Componentes e Interfaces llevan columna "AC que satisface" |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad está resuelta o registrada como CR | ✓ | — | "Open Questions: sin preguntas abiertas"; 8 CRs registrados (CR-001…CR-008) con acción requerida |
