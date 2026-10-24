---
type: analyze
id: STORY-096
slug: STORY-096-analyze-report
title: "Analyze: Crear y regenerar las capas de memoria con los modos scaffold, ensure y rebuild"
story: STORY-096
design: STORY-096
testcases: STORY-096
tasks: STORY-096
created: 2026-09-20
updated: 2026-09-20
related:
  - STORY-096-memory-system-scaffold-ensure-rebuild
---

<!-- Referencias -->
[[STORY-096-memory-system-scaffold-ensure-rebuild]]

# Reporte de Coherencia: Crear y regenerar las capas de memoria con los modos scaffold, ensure y rebuild

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 8/8 criterios cubiertos |
| Cobertura de ACs en testcases.md | ✓ | 8/8 ACs con caso de prueba |
| Alineación tareas → diseño | ✓ | 20/20 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 10/10 componentes y 6/6 interfaces con tarea |
| Alineación con la épica EPIC-19-framework-consistency | ⚠️ | No listada en la épica (creada por `/story-split`); el árbol de capas recomendado por la épica difiere de las once capas |
| Cumplimiento DoD — Fase PLAN | ✓ | 5/5 criterios ✓ |

**Estado general:** ⚠️ Advertencias (sin inconsistencias bloqueantes)

> DoD cargado desde `docs/guardrails/dod-story-checklist.md` (sección "Definition of Done para el estado PLAN"); `docs/policies/definition-of-done-story.md` no existe — la constitución referencia el guardrail.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | `ensure` crea solo lo faltante, regenera índice, no sobrescribe, reporta | ✓ | D-3; F-1; Interfaz `/memory-system [ensure]`; Esquema "Informe" |
| AC-2 | `scaffold` crea constitución, product, README por capa, 6 plantillas; no indexa | ✓ | D-1, D-2, D-5; F-2; Interfaz `/memory-system scaffold` |
| AC-3 | `rebuild` sin `--force` se detiene sin modificar | ✓ | D-4; F-3; Interfaz `/memory-system rebuild` |
| AC-4 | `rebuild --force` regenera semillas e índice, advierte, conserva autor | ✓ | D-4; F-3; Interfaz `node … scaffold --force` |
| AC-5 | Once capas + `constitution.md` | ✓ | D-1 (árbol semilla, catálogo `LAYERS`), D-5 |
| AC-6 | Seis plantillas (5 del dueño + ADR) | ✓ | D-2; Componente "Plantilla ADR semilla" |
| AC-7 | Idempotencia y preservación; solo `--force` sobrescribe semillas | ✓ | D-1, D-4; Esquema "Resultado por archivo" |
| AC-8 | `ensure --fix-frontmatter` → `header-aggregation` batch; sin flag no; sin cambios en el skill | ✓ | D-3, D-6; F-4 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Casos de evals | Componente "Evals del skill"; D-3, D-4; V-1, V-4, V-7 | ✓ |
| T002 | Fixtures sddf-partial / empty | Componente "Fixtures"; D-1 | ✓ |
| T003 | Tests del motor | Componente "Tests del motor"; V-2, V-3, V-5, V-6, V-8 | ✓ |
| T004 | Árbol semilla | Componente "Árbol semilla"; D-1, D-5 | ✓ |
| T005 | adr-template.md semilla | Componente "Plantilla ADR semilla"; D-2 | ✓ |
| T006 | Subcomando scaffold | Componente "Subcomando scaffold"; D-1; Interfaz `node … scaffold` | ✓ |
| T007 | Copia de plantillas compartidas | D-2; Esquema "Entrada del scaffold" | ✓ |
| T008 | Informe del subcomando | D-1; Esquema "Informe" | ✓ |
| T009 | GREEN del motor | D-1 | ✓ |
| T010 | Modo ensure en SKILL.md | Componente "Modos en el skill"; D-3; F-1, F-4 | ✓ |
| T011 | Modos scaffold y rebuild en SKILL.md | D-4; F-2, F-3 | ✓ |
| T012 | references/memory-rules.md | Componente "Reglas de memoria"; D-1, D-4; CR-002 | ✓ |
| T013 | Evals en verde | V-1, V-4, V-7, V-10 | ✓ |
| T014 | Nota en header-aggregation | Componente `header-aggregation`; D-6 | ✓ |
| T015 | memory-system.md | Componente "Documentación"; D-7; CR-002, CR-003 | ✓ |
| T016 | Guía, README, CHANGELOG | Componente "Documentación"; D-7 | ✓ |
| T017 | story.md con CR-001 + ensure en este repo | CR-001; F-1 | ✓ |
| T018 | Guardrail de skills | V-10 | ✓ |
| T019 | Verificación sugerida de story.md | V-1…V-8 | ✓ |
| T020 | verify:* y npm test | V-9 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Subcomando `scaffold` del motor | Componentes; D-1, D-2, D-4 | T006–T009 | ✓ |
| Árbol semilla `assets/scaffold/**` | Componentes; D-1, D-5 | T004 | ✓ |
| Plantilla ADR semilla | Componentes; D-2 | T005 | ✓ |
| Modos en `SKILL.md` | Componentes; D-3, D-4 | T010, T011, T013 | ✓ |
| Reglas de memoria | Componentes; D-1, D-4 | T012 | ✓ |
| Evals del skill | Componentes | T001, T013 | ✓ |
| Fixtures | Componentes | T002 | ✓ |
| Tests del motor | Componentes | T003, T009 | ✓ |
| `header-aggregation` (nota) | Componentes; D-6 | T014 | ✓ |
| Documentación | Componentes; D-7 | T015, T016 | ✓ |
| Interfaz `/memory-system [ensure] [--fix-frontmatter]` | Interfaces | T010 | ✓ |
| Interfaz `/memory-system scaffold [--dry-run]` | Interfaces | T011 | ✓ |
| Interfaz `/memory-system rebuild [--force]` | Interfaces | T011 | ✓ |
| Interfaz `node … scaffold --root --cli-root --dry-run --force` | Interfaces | T006, T007, T008 | ✓ |
| Interfaz `assets/scaffold/**` | Interfaces | T004, T005 | ✓ |
| Interfaz `/header-aggregation <SPECS_BASE>` batch | Interfaces | T010, T014 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-19-framework-consistency

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ❌ | `epic.md` sección "Historias" (líneas 24–33) no contiene STORY-096; solo la STORY-095 pre-split. La historia nació de `/story-split` y la épica no se actualizó |
| Objetivo de la historia alineado con la épica | ✓ | El "Para" (estructura de memoria completa sin crearla a mano ni perder archivos) materializa directamente el "Requerimiento: capas de documentación" de la épica (líneas 68–90) |
| Restricciones de la épica respetadas | ⚠️ | El árbol recomendado por la épica (líneas 71–90) incluye `rfcs/`, `how-to/`, `knowledge/` y omite `product/`, `architecture/`; el scaffold sigue las once capas de `docs/architecture/memory-system.md` (fuente de verdad declarada). La divergencia está en la épica |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D: desalineación con la épica
- **Descripción:** STORY-096 no aparece en la sección "Historias" de `epic.md`; la trazabilidad épica → historia es unidireccional (la historia declara `parent`, la épica no la lista). Mismo hallazgo que INC-001 del análisis de STORY-095.
- **Archivo afectado:** `docs/specs/02-epics/EPIC-19-framework-consistency/epic.md` — sección "Historias"
- **Acción requerida:** añadir la entrada `- [ ] **STORY-096 — Crear y regenerar las capas de memoria con los modos scaffold, ensure y rebuild:** … — [[STORY-096-memory-system-scaffold-ensure-rebuild]]` junto con las de 097–099. No bloquea.

### INC-002 [WARNING]

- **Tipo:** D: desalineación con la épica
- **Descripción:** el árbol recomendado en `epic.md` ("Requerimiento: capas de documentación") lista `rfcs/`, `how-to/` y `knowledge/` y no lista `product/` ni `architecture/`; el scaffold de esta historia (D-1, catálogo `LAYERS`) crea once capas según `memory-system.md`. Tres capas del epic no se crearán y dos capas creadas no figuran en el epic.
- **Archivo afectado:** `docs/specs/02-epics/EPIC-19-framework-consistency/epic.md` — sección "Requerimiento: capas de documentación"
- **Acción requerida:** alinear el árbol de la épica con `memory-system.md` o anotar `rfcs/`, `how-to/` y `knowledge/` como opcionales no gestionadas por el scaffold. Conviene hacerlo antes de T015 para que épica, arquitectura y scaffold coincidan.

---

## Recomendaciones

1. **`epic.md` → "Historias" y "Requerimiento: capas de documentación":** resolver INC-001 e INC-002 en una sola edición; puede ejecutarse dentro de T017 (que ya retroalimenta artefactos ascendentes) o antes de iniciar la implementación.
2. **`story.md` (planificado en T017):** incorporar CR-001 (las cinco plantillas compartidas requieren los skills dueños instalados en `CLI_ROOT`; en su ausencia `[WARNING]` y se continúa).
3. **Orden de implementación:** implementar STORY-095 antes que esta para que `ensure` y `rebuild` regeneren el índice; si se invierte el orden, IT-002 cubre la degradación y T006 crea el esqueleto del motor.
4. **T017 en este repositorio:** ejecutar `/memory-system` creará `docs/product/` y `docs/requirements/README.md`; revisar que las semillas no introduzcan nodos pendientes en `docs/index.md` (regla de D-5).

---

## Cobertura de ACs en Testcases

| AC | Descripción | Cubierto en testcases.md | Escenario |
|---|---|---|---|
| AC-1 | `ensure` consistente en un paso | ✓ | E2E-001, IT-001, IT-002, EV-001 |
| AC-2 | `scaffold` crea lo faltante y no indexa | ✓ | E2E-002, UT-001, UT-003, EV-003 |
| AC-3 | `rebuild` sin `--force` se detiene | ✓ | E2E-003, EV-004 |
| AC-4 | `rebuild --force` regenera y conserva autor | ✓ | E2E-004, UT-006, IT-004, EV-005 |
| AC-5 | Once capas + constitución | ✓ | E2E-002, UT-001 |
| AC-6 | Seis plantillas | ✓ | E2E-002, UT-004, UT-005, EV-003 |
| AC-7 | Idempotencia y preservación | ✓ | E2E-001, UT-002, UT-006, UT-007, EV-002 |
| AC-8 | `--fix-frontmatter` → `header-aggregation` | ✓ | IT-003, EV-006 |

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ✓ | `/story-implement STORY-096` |
| tasks.md | ✓ | `/story-implement-tasks STORY-096` |

Ambas vías disponibles. `tasks.md` (20 tareas, bajo el umbral de confirmación) ordena RED →
GREEN y respeta el principio 11 de la constitución; `/story-implement-tasks` es la vía con
menor fricción.

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin que cubren los escenarios principales | ✓ | — | 4 bloques `gherkin` (Dado/Cuando/Entonces) en `story.md`: ensure, scaffold, rebuild ×2 |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño por criterio | ✓ | — | Tabla "Cobertura de Criterios de Aceptación": 8/8 |
| tasks.md existe con tareas atómicas ordenadas por dependencia (setup → componentes → soporte → verificación) | ✓ | — | 7 grupos: evals/fixtures → árbol semilla → motor → SKILL.md → header-aggregation → documentación → verificación; 20 tareas con referencias AC/D/V |
| Todos los elementos de diseño tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | D-1…D-7 abren con `// satisface:`; tablas de Componentes e Interfaces llevan columna "AC que satisface" |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad está resuelta o registrada como CR | ✓ | — | "Open Questions: sin preguntas abiertas"; CR-001…CR-003 con acción requerida |
