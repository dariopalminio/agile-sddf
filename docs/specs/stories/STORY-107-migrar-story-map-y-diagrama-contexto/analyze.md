---
type: analyze
id: STORY-107
slug: STORY-107-analyze-report
title: "Analyze: Migrar story-map.md y context-diagram.puml"
story: STORY-107
design: STORY-107
tasks: STORY-107
created: 2026-10-07
updated: 2026-10-07
related:
  - STORY-107-migrar-story-map-y-diagrama-contexto
---

<!-- Referencias -->
[[STORY-107-migrar-story-map-y-diagrama-contexto]]

# Reporte de Coherencia: Migrar `story-map.md` y `context-diagram.puml`

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (y 2/2 CNF) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada: `testcases.md` no presente (modo `--only-tasks`) |
| Alineación tareas → diseño | ✓ | 16/16 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 11/11 elementos con tarea (5 componentes + 6 interfaces) |
| Alineación con la épica EPIC-21-colapsar-specs-dos-niveles | ⚠️ | Historia listada (línea 30) y objetivo alineado; el destino del diagrama en la épica difiere del de la historia (INC-001) |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

**Estado general:** ⚠️ Advertencias (2 WARNING, 0 ERROR)

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | `docs/product/story-map.md` existe con el mismo cuerpo, frontmatter `type: product` y `slug: story-map`; el original ya no existe | ✓ | D-1 (`git mv` + cambio de `type`), esquema de datos (frontmatter antes/después), interfaces "Slug `story-map`" y "Ruta canónica del story map", contratos #1–#3 |
| AC-2 | La copia de `PROJ-01` se elimina; `c4/context-diagram.puml` y `.png` sin cambios; no se crea `docs/architecture/context-diagram.puml` | ✓ | D-2 (precondición `diff` + `git rm`), D-4 (alineación de EPIC-21), interfaz "Ruta canónica del diagrama de contexto", contratos #4–#6 y #10 |
| AC-3 | `[[story-map]]` resuelve a `product/story-map.md`, la entrada de `index.md` apunta a `product/story-map.md` y `check` sin wikilinks rotos | ✓ | D-3 (reubicación de la entrada del índice), D-5 (orden y criterio por delta), interfaces "Entrada del índice", `memory-system check` y `check-doc-links.js`, contratos #7–#9 |
| CNF-1 | Cuerpo trasladado literalmente | ✓ | D-1 (solo cambia la línea `type:`), contrato #2 (`diff` contra `git show HEAD:`) |
| CNF-2 | UTF-8 sin BOM, sin mojibake | ✓ | D-1 (codificación y fin de línea), contrato #11 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Guardar la línea base de `memory-system check` en `.tmp/story-implement/STORY-107/check-before.txt` | D-5, interfaz `memory-system check` | ✓ |
| T002 | Comprobar las precondiciones de AC-1 (origen con `slug: story-map`, destino inexistente) | D-1, F-3 | ✓ |
| T003 | Comprobar que los dos `.puml` son idénticos; detenerse si difieren | D-2, F-3 | ✓ |
| T004 | `git mv` del story map a `docs/product/` | D-1, componente "Story map del producto" | ✓ |
| T005 | Cambiar `type: wiki` → `type: product` sin tocar otra línea | D-1, esquema de datos | ✓ |
| T006 | Eliminar la entrada antigua `[[story-map]]` bajo `L3 — Proyecto` | D-3, componente "Índice de documentación" | ✓ |
| T007 | Insertar la entrada nueva en `### Producto (product/)` entre `[[stakeholders]]` y `[[vision]]` | D-3, interfaz "Entrada del índice" | ✓ |
| T008 | `git rm` de la copia del diagrama en `PROJ-01` | D-2, componente "Copia del diagrama de contexto en PROJ-01" | ✓ |
| T009 | Alinear la línea de STORY-107 en `epic.md` con `c4/` | D-4, componente "Épica EPIC-21", CR-001 | ✓ |
| T010 | Alinear el criterio de salida de `epic.md` con `c4/` | D-4, componente "Épica EPIC-21", CR-001 | ✓ |
| T011 | Verificar AC-1 (contratos #1–#3) | Contratos de verificación #1–#3 | ✓ |
| T012 | Verificar AC-2 (contratos #4–#6 y #10) | Contratos #4–#6, #10; componente "Diagrama de contexto C4 L1" | ✓ |
| T013 | Verificar AC-3: slug único y entrada del índice (contratos #7–#8) | Contratos #7–#8 | ✓ |
| T014 | Verificar AC-3: `check` por delta y `check-doc-links.js` (contrato #9) | D-5, contrato #9 | ✓ |
| T015 | Verificar CNF-2 (contrato #11) | Contrato #11 | ✓ |
| T016 | Revisar `git status` y registrar resultados y CR en `implement-report.md` | F-1, Registro de Cambios | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Story map del producto (mover + modificar) | Componentes afectados, D-1 | T002, T004, T005, T011 | ✓ |
| Copia del diagrama de contexto en PROJ-01 (eliminar) | Componentes afectados, D-2 | T003, T008, T012 | ✓ |
| Diagrama de contexto C4 L1 (sin cambios) | Componentes afectados, D-2 | T008 (restricción), T012 (verificación) | ✓ |
| Índice de documentación | Componentes afectados, D-3 | T006, T007, T013 | ✓ |
| Épica EPIC-21 | Componentes afectados, D-4 | T009, T010, T012 | ✓ |
| Slug `story-map` | Interfaces | T005, T013 | ✓ |
| Ruta canónica del diagrama de contexto | Interfaces | T008, T012 | ✓ |
| Ruta canónica del story map | Interfaces | T004, T011 | ✓ |
| Entrada del índice | Interfaces | T007, T013 | ✓ |
| `memory-system check --root docs` | Interfaces, D-5 | T001, T014 | ✓ |
| `scripts/check-doc-links.js` | Interfaces | T014 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-21-colapsar-specs-dos-niveles

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` § Historias, línea 30: "STORY-107 — Migrar `story-map.md` y `context-diagram.puml` … actualizando referencias" |
| Objetivo de la historia alineado con la épica | ✓ | Deja `specs/01-projects/` sin `story-map.md` ni `context-diagram.puml` y contribuye al criterio de salida "`docs/product/` contiene … `story-map.md`". |
| Restricciones de la épica respetadas | ⚠️ | Sin dependencias previas (tabla de dependencias, fila 4: "—"); no toca skills (STORY-112). El destino `docs/architecture/context-diagram.puml` de la línea 30 y el criterio de salida de la línea 47 contradicen AC-2; `design.md` lo resuelve con D-4 (T009, T010). Ver INC-001. |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D (desalineación con la épica)
- **Descripción:** EPIC-21 fija el destino `docs/architecture/context-diagram.puml` (línea 30) y el criterio de salida "`docs/architecture/` contiene `context-diagram.puml`." (línea 47). AC-2 prohíbe crear el diagrama fuera de `c4/`. La historia anticipa la corrección en sus notas y `design.md` la convierte en D-4 (CR-001), con las tareas T009 y T010; ningún AC de `story.md` la exige de forma explícita.
- **Archivo afectado:** `docs/specs/02-epics/EPIC-21-colapsar-specs-dos-niveles/epic.md` — secciones "Historias" y "Criterios de salida"; `story.md` — sección "AC-2"
- **Acción requerida:** aplicar T009–T010 en la implementación. Opcional: añadir a AC-2 de `story.md` un `Y` que exija que EPIC-21 nombre `docs/architecture/c4/context-diagram.puml`, para que la verificación lo cubra.

### INC-002 [WARNING]

- **Tipo:** D (criterio no alcanzable al pie de la letra)
- **Descripción:** AC-3 exige que "`memory-system check` no reporta wikilinks rotos", pero la línea base ya tiene 49 `broken-wikilink` ajenos a esta historia, dos de ellos en la propia `story.md` (`[[ADR-0013-eliminar-specs-01-projects]]`, cuyo slug real es `eliminar-specs-01-projects`). `design.md` lo resuelve verificando por delta (D-5, CR-002; tarea T014).
- **Archivo afectado:** `story.md` — sección "AC-3", línea `Y "memory-system check" no reporta wikilinks rotos`; `design.md` — "D-5"
- **Acción requerida:** evaluar AC-3 por delta en la verificación; registrar como deuda la corrección del wikilink al ADR en las historias de EPIC-21.

---

## Recomendaciones

1. **INC-001:** implementar T009–T010 y, si se quiere que la verificación lo cubra, añadir a AC-2 de `story.md` la línea `Y "epic.md" de EPIC-21 nombra "docs/architecture/c4/context-diagram.puml" como destino` (o aceptar explícitamente CR-001 en `/story-acceptance`).
2. **INC-002:** en `/story-verify` y `/story-acceptance`, evaluar AC-3 con el criterio por delta de D-5 frente a `.tmp/story-implement/STORY-107/check-before.txt`; corregir `[[ADR-0013-eliminar-specs-01-projects]]` → `[[eliminar-specs-01-projects]]` en las historias de EPIC-21 en una historia aparte.
3. **Coordinación con STORY-104/105/106:** quien implemente en segundo lugar reaplica la edición de `docs/index.md` por contenido (D-3, F-3), no por número de línea, y no duplica la entrada `[[story-map]]` si el índice ya fue regenerado.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente: cobertura de pruebas no evaluada (pipeline ejecutado con `--only-tasks`). Los contratos de verificación #1–#11 de `design.md` y las tareas T011–T015 cubren los tres ACs y los dos CNF.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-107`: no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-107`: disponible |

---

## Cumplimiento DoD — Fase PLAN

Fuente: `docs/guardrails/dod-story-plan.md` (`enforcement: error`), 7 criterios.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 (principal), AC-2 (alternativo), AC-3 (cierre) en bloques `gherkin` |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | Tabla "Cobertura de Criterios de Aceptación": 3/3 ACs y 2/2 CNF |
| Todos los elementos de diseño tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | D-1…D-5 y los Goals llevan `// satisface:`; las tablas de componentes, interfaces y contratos tienen columna de AC |
| No hay decisiones de arquitectura aplazadas: toda ambigüedad resuelta o registrada como CR | ✓ | — | `## Open Questions`: "Ninguna"; CR-001 y CR-002 registrados |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` presente (16 tareas) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales | ✓ | — | Cada tarea toca un archivo o una sección; T011–T014 verifican AC-1, AC-2 y AC-3 |
| Si testcases.md existe DEBE contener pruebas para todos los escenarios principales | ✓ | — | No aplica: `testcases.md` ausente por `--only-tasks` |
