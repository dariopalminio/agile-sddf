---
type: analyze
id: STORY-106
slug: STORY-106-analyze-report
title: "Analyze: Migrar project-plan.md a product/roadmap.md"
story: STORY-106
design: STORY-106
tasks: STORY-106
created: 2026-10-07
updated: 2026-10-07
related:
  - STORY-106-migrar-plan-a-roadmap
---

<!-- Referencias -->
[[STORY-106-migrar-plan-a-roadmap]]

# Reporte de Coherencia: Migrar `project-plan.md` a `product/roadmap.md`

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (y 3/3 CNF) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada — `testcases.md` no presente (modo `--only-tasks`) |
| Alineación tareas → diseño | ✓ | 16/16 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 11/11 elementos con tarea (5 componentes + 6 interfaces) |
| Alineación con la épica EPIC-21-colapsar-specs-dos-niveles | ✓ | Historia listada (línea 29), objetivo y restricciones alineados |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

**Estado general:** ⚠️ Advertencias (2 WARNING, 0 ERROR)

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | El roadmap lista las 22 épicas reales por ID con wikilink, título y `status`/`substatus`; frontmatter `type: product`, `slug: roadmap` | ✓ | D-1 (sección `## Épicas`), D-2 (tabla y origen de cada columna), D-4 (frontmatter), interfaces `## Épicas` y "Wikilink de épica", contratos #1–#4 |
| AC-2 | Sección "Plan original (2026-04-20)" con backlog, 9 épicas propuestas y resumen, identificada como histórica y separada | ✓ | D-1 (secciones disjuntas y aviso `> Histórico.`), D-3 (traslado literal con mapeo de encabezados), interfaz `## Plan original (2026-04-20)`, contratos #5–#6 |
| AC-3 | Objetivo en `objectives.md › Objetivos de negocio`; original eliminado; sin `[[project-plan]]` fuera de `03-stories/`; referencias a `[[roadmap]]`; `check` sin wikilinks rotos | ✓ | D-5 (objectives), D-6 (index), D-7 (project.md), D-8 (orden y criterio por delta), contratos #7–#11 |
| CNF-1 | Sin pérdida semántica | ✓ | D-3 (regla de copia literal, 56 ítems), D-5, contrato #5 |
| CNF-2 | Trazabilidad a `project-plan.md`, ADR-0013 y `[[objectives]]` | ✓ | D-4 (nota de origen), contrato #12 |
| CNF-3 | UTF-8 sin BOM, sin mojibake | ✓ | Contrato #13 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Línea base de `memory-system check` | D-8, contrato #11 | ✓ |
| T002 | Crear `roadmap.md`: frontmatter, título, nota de origen, pie | D-1, D-4 · componente "Roadmap del producto" | ✓ |
| T003 | Sección `## Épicas` con 22 filas desde frontmatter | D-2, F-3 · interfaz `## Épicas` | ✓ |
| T004 | `## Plan original (2026-04-20)`: aviso histórico y backlog literal | D-1, D-3 · interfaz `## Plan original` | ✓ |
| T005 | `### Propuesta de épicas`: 9 bloques literales | D-3 | ✓ |
| T006 | `### Resumen`: tabla literal | D-3 | ✓ |
| T007 | Objetivo literal en `objectives.md` + `[[roadmap]]` | D-5 · componente "Objetivos del producto" | ✓ |
| T008 | `index.md`: baja de `[[project-plan]]`, alta de `[[roadmap]]` en `Producto` | D-6 · componente "Índice de documentación" | ✓ |
| T009 | `project.md`: tres sustituciones de subcadena | D-7 · componente "Especificación de requisitos PROJ-01" | ✓ |
| T010 | `git rm project-plan.md` | D-8 · componente "Plan del proyecto PROJ-01" | ✓ |
| T011 | Comparadores desechables en `.tmp/` | Contratos #3 y #5, "Decisiones de complejidad justificada" | ✓ |
| T012 | Verificar AC-1 | Contratos #1–#4 | ✓ |
| T013 | Verificar AC-2 / CNF-1 | Contratos #5–#6 | ✓ |
| T014 | Verificar AC-3 | Contratos #7–#10 | ✓ |
| T015 | Verificar "sin wikilinks rotos" | D-8, contrato #11 | ✓ |
| T016 | Verificar CNF-2 / CNF-3 | Contratos #12–#13 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Roadmap del producto (`docs/product/roadmap.md`, crear) | Componentes afectados | T002–T006 | ✓ |
| Objetivos del producto (`docs/product/objectives.md`, modificar) | Componentes afectados | T007 | ✓ |
| Índice de documentación (`docs/index.md`, modificar) | Componentes afectados | T008 | ✓ |
| Especificación PROJ-01 (`project.md`, modificar) | Componentes afectados | T009 | ✓ |
| Plan del proyecto PROJ-01 (`project-plan.md`, eliminar) | Componentes afectados | T010 | ✓ |
| Slug `roadmap` | Interfaces | T002, T008, T009 | ✓ |
| Sección `## Épicas` | Interfaces | T003 | ✓ |
| Sección `## Plan original (2026-04-20)` | Interfaces | T004–T006 | ✓ |
| Wikilink de épica `[[<slug declarado>]]` | Interfaces | T003, T012 | ✓ |
| Wikilinks de trazabilidad | Interfaces | T002, T007, T016 | ✓ |
| `memory-system check --root docs` | Interfaces | T001, T015 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-21-colapsar-specs-dos-niveles

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` § Historias, línea 29: "STORY-106 — Migrar `project-plan.md` a `product/roadmap.md` … sin pérdida semántica" |
| Objetivo de la historia alineado con la épica | ✓ | La épica busca "una única fuente de verdad para la visión y el plan del producto"; el diseño elimina `project-plan.md` y deja el roadmap en `product/`. Contribuye al criterio de salida "`docs/product/` contiene … `roadmap.md`". |
| Restricciones de la épica respetadas | ✓ | Sin dependencias previas (tabla de dependencias, fila 3: "—"). No toca skills (historias 109–113) ni `specs/02-epics/` → compatible con STORY-108 porque los wikilinks son por slug, no por ruta ("Todas las épicas e historias existentes siguen siendo navegables por wikilinks"). Las secciones `## Épicas` y `## Plan original` son el contrato que STORY-111 debe respetar. |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D (desalineación de redacción entre story.md y design.md)
- **Descripción:** AC-1 de `story.md` pide el wikilink "`[[EPIC-NN-<slug>]]`" para cada épica, pero EPIC-13, 14, 15, 17 y 18 declaran un `slug` sin prefijo `EPIC-NN-`. `design.md` (D-2, CR-001) usa `[[<slug declarado>]]` para que los 22 resuelvan y no se violen los wikilinks rotos de AC-3. La implementación es correcta, pero la letra de AC-1 y el diseño divergen en 5 de 22 filas.
- **Archivo afectado:** `story.md` — sección "AC-1 — Escenario principal", línea `Y cada épica aparece con su wikilink "[[EPIC-NN-<slug>]]"`
- **Acción requerida:** opcional — precisar AC-1 como "su wikilink `[[<slug>]]` según su frontmatter" antes de la aceptación, para que el validador no marque esas 5 filas como fallo.

### INC-002 [WARNING]

- **Tipo:** D (criterio no alcanzable en absoluto)
- **Descripción:** AC-3 exige que "`memory-system check` no reporta wikilinks rotos", pero la línea base ya tiene 49 `broken-wikilink` ajenos, tres de ellos en la propia `story.md` (`[[ADR-0013-eliminar-specs-01-projects]]`, cuyo slug real es `eliminar-specs-01-projects`). `design.md` lo resuelve verificando por delta (D-8, CR-002; tarea T015).
- **Archivo afectado:** `story.md` — sección "AC-3", línea `Y "memory-system check" no reporta wikilinks rotos`; `design.md` — "D-8"
- **Acción requerida:** aceptar el criterio por delta en la fase de verificación; abrir una historia aparte para corregir el wikilink al ADR en las historias de EPIC-21.

> Hallazgos menores sin severidad: CR-003 (la "29 features" de CNF-1 es la cifra del `## Resumen`; el backlog tiene 56 ítems, todos migrados) y CR-004 (la entrada de `index.md` se reubica en `### Producto`) ya están resueltos en el diseño y no requieren acción.

---

## Recomendaciones

1. **INC-001:** en `story.md` › AC-1, cambiar `"[[EPIC-NN-<slug>]]"` por `"[[<slug>]]" declarado en su frontmatter` (o aceptar explícitamente CR-001 de `design.md` en `/story-acceptance`).
2. **INC-002:** en `/story-verify` y `/story-acceptance`, evaluar AC-3 con el criterio por delta de D-8 frente a `.tmp/story-implement/STORY-106/check-before.txt`; registrar como deuda la corrección de `[[ADR-0013-eliminar-specs-01-projects]]` en las historias de EPIC-21.
3. **Coordinación con STORY-104/105:** quien implemente en segundo lugar debe reaplicar las ediciones de `index.md` y `project.md:18` por contenido (D-6, D-7, F-3), no por número de línea.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada (pipeline ejecutado con `--only-tasks`). Los contratos de verificación #1–#13 de `design.md` y las tareas T012–T016 cubren los tres ACs y los tres CNF.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-106` — no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-106` — disponible |

---

## Cumplimiento DoD — Fase PLAN

Fuente: `docs/guardrails/dod-story-plan.md` (`enforcement: error`) — 7 criterios.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 (principal), AC-2 (alternativo), AC-3 (cierre) en bloques `gherkin` |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | Tabla "Cobertura de Criterios de Aceptación": 3/3 ACs y 3/3 CNF |
| Todos los elementos de diseño tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | D-1…D-8 llevan `// satisface:`; tablas de componentes, interfaces y contratos tienen columna de AC |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad resuelta o registrada como CR | ✓ | — | `## Open Questions`: "Ninguna"; CR-001…CR-004 registrados |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` presente (16 tareas) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales | ✓ | — | Cada tarea toca un archivo o una sección; T012–T014 verifican AC-1, AC-2 y AC-3 |
| Si testcases.md existe DEBE contener pruebas para todos los escenarios principales | ✓ | — | No aplica: `testcases.md` ausente por `--only-tasks` |
