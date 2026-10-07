---
type: analyze
id: STORY-108
slug: STORY-108-analyze-report
title: "Analyze: Renombrar specs/02-epics/ → specs/epics/ y specs/03-stories/ → specs/stories/"
story: STORY-108
design: STORY-108
testcases: STORY-108
tasks: STORY-108
created: 2026-10-07
updated: 2026-10-07
related:
  - STORY-108-renombrar-specs-sin-prefijos
---

<!-- Referencias -->
[[STORY-108-renombrar-specs-sin-prefijos]]

# Reporte de Coherencia: Renombrar `specs/02-epics/` → `specs/epics/` y `specs/03-stories/` → `specs/stories/`

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (y 3/3 CNF) |
| Cobertura de ACs en testcases.md | ✓ | 3/3 ACs con caso de prueba (y 3/3 CNF) |
| Alineación tareas → diseño | ✓ | 31/31 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 20/20 elementos con tarea (13 componentes + 7 interfaces) |
| Alineación con la épica EPIC-21-colapsar-specs-dos-niveles | ⚠️ | Historia listada (línea 31) y objetivo alineado; la épica declara dependencia de STORY-104…107 y la eliminación incondicional de `01-projects/` (INC-002, INC-003) |
| Cumplimiento DoD — Fase PLAN | ❌ | 6/7 criterios ✓ — una ambigüedad técnica sin resolver ni registrar como CR (INC-001) |

**Estado general:** ❌ Inconsistencias — 1 ERROR, 4 WARNINGs. `story.md` permanece en `PLAN/IN-PROGRESS`.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | `epics/` y `stories/` con los mismos directorios y archivos; carpetas viejas inexistentes; git registra renombrados | ✓ | D-1 (`git mv` de directorio, precondiciones, línea base), componentes "Nivel de épicas/historias", interfaces "Ruta de épicas/historias", contratos #1–#3 |
| AC-2 | Sin `02-epics`/`03-stories` en el alcance vivo; `npm test` exit 0; `skill-preflight` OK | ✓ (ver INC-001) | D-2 (semilla y fixtures), D-3 (código y pruebas), D-4 (sustitución R1…R5), D-5 (frases con prefijo), D-6 (alcance y comando), D-8 (`skill-preflight`), contratos #4–#6, #12 |
| AC-3 | `01-projects/` se elimina si está vacía o se conserva intacta y se informa; preflight no la exige | ✓ | D-8 (tratamiento de `01-projects/` y de `skill-preflight`), D-5 (`AGENTS.md` según el resultado), contratos #6–#7 |
| CNF-1 | Renombrado y referencias en un único cambio | ✓ | D-9 (orden y commit único), contrato #8 |
| CNF-2 | `check` sin wikilinks rotos nuevos; `docs/index.md` con rutas nuevas | ✓ (ver INC-001) | D-7 (sustitución en el lugar + `index --dry-run`), D-9 (delta de `check`), contratos #9–#10 |
| CNF-3 | UTF-8 sin BOM, sin mojibake | ✓ | D-4 (`sed` por bytes), contrato #11 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Precondiciones: árbol limpio, destinos inexistentes | D-1, F-3 | ✓ |
| T002 | Línea base de conteos y de `01-projects/` | D-1, D-8 | ✓ |
| T003 | Línea base de `npm test` | D-9 paso 1 | ✓ |
| T004 | Línea base de `memory-system check` | D-9 | ✓ |
| T005 | `git mv` de los dos niveles | D-1, componentes "Nivel de épicas/historias" | ✓ |
| T006 | Renombrar semilla de `scaffold` | D-2, componente "Semilla y fixtures" | ✓ |
| T007 | Renombrar fixtures de `memory-system` | D-2 | ✓ |
| T008 | Renombrar ejemplos de `header-aggregation` | D-2 | ✓ |
| T009 | Verificar que no quedan directorios con nombre viejo | D-1, D-2 | ✓ |
| T010 | `SPECS_LAYERS` | D-3, componente "Mapa de capas", interfaz "Capa de `memory-system`" | ✓ |
| T011 | `index-template.md` | D-3, componente "Plantilla del índice" | ✓ |
| T012 | Comentario de `epic-template.js` | D-3 | ✓ |
| T013 | Defecto de `--stories-dir` | D-3, componente "Migrador FINVEST", interfaz `--stories-dir` | ✓ |
| T014 | `test/epic-template.test.js` (incl. UT-018) | D-3, componente "Pruebas" | ✓ |
| T015 | `test/memory-system.test.js` (rutas y semilla) | D-2, D-3, interfaz "Semilla de `scaffold`" | ✓ |
| T016 | `npm test` intermedio | D-9 paso 6 | ✓ |
| T017 | Conjunto objetivo y `bare-lines.txt` | D-4.1, D-6 | ✓ |
| T018 | `sed` R1…R5 | D-4.2–D-4.3, D-7 | ✓ |
| T019 | Revisión manual de líneas "desnudas" | D-4.4 | ✓ |
| T020 | `domain-work-item-hierarchy.md` | D-5 | ✓ |
| T021 | Tabla de migración 1.x del `README.md` | D-5 | ✓ |
| T022 | Guías y `header-aggregation/SKILL.md` | D-5 | ✓ |
| T023 | `AGENTS.md:30` según `01-projects/` | D-5, D-8 | ✓ |
| T024 | `skill-preflight` (`SKILL.md` + `evals.json`) | D-8, interfaz "Informe de `skill-preflight`" | ✓ |
| T025 | Comprobar `docs/index.md` e `index --dry-run` | D-7, contrato #10 | ✓ (contrato inalcanzable — INC-001) |
| T026 | Dos subcadenas de EPIC-21 | D-8, componente "Épica EPIC-21" | ✓ |
| T027 | Verificar AC-1 | Contratos #1–#3 | ✓ |
| T028 | Verificar AC-2 y CNF | Contratos #4–#6, #9–#12 | ✓ |
| T029 | Tratar `01-projects/` | D-8, contrato #7 | ✓ |
| T030 | Commit único | D-9 paso 8, contrato #8 | ✓ |
| T031 | Reinstalar runtimes | D-9 paso 9, CR-004 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Ubicación en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Nivel de épicas | Componentes afectados | T005 | ✓ |
| Nivel de historias | Componentes afectados | T005 | ✓ |
| Semilla y fixtures | Componentes afectados, D-2 | T006, T007, T008 | ✓ |
| Mapa de capas de specs | Componentes afectados, D-3 | T010 | ✓ |
| Plantilla del índice | Componentes afectados, D-3 | T011 | ✓ |
| Migrador FINVEST | Componentes afectados, D-3 | T013 | ✓ |
| Pruebas | Componentes afectados, D-3 | T014, T015 | ✓ |
| Verificación de entorno | Componentes afectados, D-8 | T024 | ✓ |
| Skills, agentes y evals restantes | Componentes afectados, D-4 | T017, T018, T019 | ✓ |
| Documentación viva | Componentes afectados, D-4, D-5 | T017–T023 | ✓ |
| Índice de documentación | Componentes afectados, D-7 | T018, T025 | ✓ |
| Épica EPIC-21 | Componentes afectados, D-8 | T026 | ✓ |
| Directorio de proyecto | Componentes afectados, D-8 | T029 | ✓ |
| Ruta de épicas | Interfaces | T005, T018 | ✓ |
| Ruta de historias | Interfaces | T005, T018 | ✓ |
| Capa de `memory-system` | Interfaces | T010, T015 | ✓ |
| Semilla de `scaffold` | Interfaces | T006, T015 | ✓ |
| `migrate-finvest-field.js --stories-dir` | Interfaces | T013 | ✓ |
| Informe de `skill-preflight` | Interfaces | T024, T028 | ✓ |
| Wikilinks `[[slug]]` | Interfaces | T004, T028 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-21-colapsar-specs-dos-niveles (`docs/specs/02-epics/EPIC-21-colapsar-specs-dos-niveles/epic.md`)

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | Línea 31: "**STORY-108** — Renombrar `specs/02-epics/` → `specs/epics/` y `specs/03-stories/` → `specs/stories/` …" |
| Objetivo alineado | ✓ | La descripción de la épica (línea 23) pide "quitar los prefijos numéricos de `specs/`, dejando solo `specs/epics/` y `specs/stories/`" |
| Restricciones respetadas | ⚠️ | La línea 31 dice "dejando `01-projects/` eliminado" y la tabla de dependencias (fila 5) hace depender el renombrado de las historias 1–4; la historia permite ejecutarse antes y conservar `01-projects/` (INC-002). D-2 adelanta parte de STORY-115 (INC-003) |

---

## Inconsistencias Detectadas

### INC-001 [ERROR]

- **Tipo:** E (DoD PLAN: "No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR")
- **Descripción:** `docs/index.md` y el índice regenerado contienen **títulos** de documentos que citan las rutas viejas como texto, no
  como ruta: `docs/index.md:226` (entrada `[[plan-02-refactor-dev-levels]]`, título de `STORY-086-…/plan-02-refactor-dev-levels.md`:
  "Reestructurar `docs/specs/` a niveles numerados (`01-projects/`, `02-epics/`, `03-stories/`") y, en
  `memory-system index --root docs --dry-run`, además la entrada de STORY-108 (título "Renombrar specs/02-epics/ → specs/epics/ …").
  Consecuencias que el diseño no resuelve:
  1. El contrato #10 de `design.md` ("`index --root docs --dry-run` sin coincidencias"), IT-001 de `testcases.md` y T025 de `tasks.md`
     son inalcanzables: el índice regenerado toma esos títulos del `title:` de registros históricos, que D-6 y los Non-Goals prohíben
     editar.
  2. D-4/D-7 aplican R1…R5 a todo `docs/index.md`, por lo que reescribirían el título de la entrada de STORY-086 a
     "(`01-projects/`, `epics/`, `stories/`" — un título que ya no coincide con su documento y que la próxima regeneración revierte.
  3. Si no se reescribe, el `git grep` de D-6 (contrato #4, AC-2) encuentra `docs/index.md:226` y AC-2 falla.
- **Archivo afectado:** `design.md` — secciones "D-4", "D-6", "D-7" y "Contratos de verificación" (#4, #10); `testcases.md` — IT-001;
  `tasks.md` — T018, T025
- **Acción requerida:** decidir en `design.md` cómo se tratan los títulos derivados de registros históricos dentro del índice y alinear
  el criterio de AC-2/CNF-2, registrando un CR contra `story.md` si cambia el alcance de AC-2.

### INC-002 [WARNING]

- **Tipo:** D
- **Descripción:** EPIC-21 hace depender el renombrado de las historias de migración (tabla "Dependencias entre historias", fila 5:
  "Renombrar `02-epics/` y `03-stories/` | 1, 2, 3, 4") y su línea 31 da por hecho "dejando `01-projects/` eliminado". La historia
  (Notas, "Dependencias") dice que no las requiere y AC-3 admite conservar `01-projects/`. El diseño lo reconoce (CR-003) y D-8 corrige
  solo la línea 31, no la tabla de dependencias.
- **Archivo afectado:** `docs/specs/02-epics/EPIC-21-colapsar-specs-dos-niveles/epic.md` — línea 31 y tabla de dependencias (fila 5)
- **Acción requerida:** decidir el orden (implementar STORY-104…107 antes, como recomienda CR-003, o ajustar la fila 5 de la épica).

### INC-003 [WARNING]

- **Tipo:** D
- **Descripción:** D-2 renombra la semilla de `memory-system scaffold` (`02-epics/` → `epics/`, `03-stories/` → `stories/`), parte del
  alcance de STORY-115 ("crear `specs/epics/` y `specs/stories/` en lugar de los tres niveles numerados", línea 38 de la épica) y un
  Non-Goal de la historia ("Scaffolding y migración para otros repos"). Está justificado por AC-2 (CR-001), pero la épica y la historia
  siguen describiendo el corte anterior.
- **Archivo afectado:** `story.md` — "Fuera de alcance", viñeta "Scaffolding y migración para otros repos"; `epic.md` — línea 38
- **Acción requerida:** aplicar CR-001: ajustar el Non-Goal de la historia y la descripción de STORY-115 (queda solo quitar
  `01-projects/` de la semilla).

### INC-004 [WARNING]

- **Tipo:** F (caso de prueba sin tarea que lo materialice)
- **Descripción:** UT-003 (fallback de capa para un segmento desconocido), UT-008 y UT-009 (`migrate-finvest-field.js --stories-dir`)
  no tienen prueba existente en `test/` ni tarea que la cree: T014/T015 solo ajustan literales y no existe `test/migrate-finvest-field*`.
  Sin esa tarea, esos casos solo se podrán verificar a mano.
- **Archivo afectado:** `tasks.md` — grupo "3. Código y pruebas"; `testcases.md` — UT-003, UT-008, UT-009
- **Acción requerida:** añadir una tarea que cree las pruebas (o declarar en `testcases.md` que se verifican manualmente).

### INC-005 [WARNING]

- **Tipo:** D (alcance de la historia)
- **Descripción:** `design.md` registra CR-002 porque el Non-Goal "Reescribir registros históricos" lista solo ADR-0004/0005/0010/0011,
  mientras ADR-0007 (`ACCEPTED`) y ADR-0013 (`PROPOSED`) también mencionan las rutas y `docs/specs/01-projects/**` contradice la fila 2
  de AC-3. D-6 los excluye; `story.md` todavía no.
- **Archivo afectado:** `story.md` — "Fuera de alcance", viñeta "Reescribir registros históricos"; nota "Documentos vivos de `docs/`"
- **Acción requerida:** aplicar CR-002 en `story.md`.

---

## Recomendaciones

1. **(INC-001, bloqueante)** En `design.md`, D-7: aplicar R1/R2 en `docs/index.md` solo a destinos de enlace `](specs/0N-…/…)` y a los
   encabezados de sección, nunca al texto del título de una entrada; en D-6, excluir del criterio de AC-2 las coincidencias dentro de
   títulos de entradas que copian el `title:` de registros históricos (hoy `docs/index.md:226`; la entrada de STORY-108 si el índice se
   regenera); reformular el contrato #10 como "ningún enlace ni encabezado de `index --dry-run` usa `specs/02-epics/` ni
   `specs/03-stories/`". Registrar el ajuste de AC-2 como CR-005 contra `story.md`, y actualizar T018, T025 e IT-001 en consecuencia.
   Luego re-ejecutar `/story-analyze STORY-108`.
2. **(INC-002)** Implementar STORY-104…107 antes que STORY-108 (deja `01-projects/` vacía y los planes hermanos con rutas válidas), o
   cambiar la fila 5 de la tabla de dependencias de EPIC-21 por "— (recomendado tras 1–4)".
3. **(INC-003)** En `story.md`, Non-Goal "Scaffolding…": precisar que esta historia renombra los dos niveles de la semilla y que
   STORY-115 solo quita `01-projects/`; ajustar la línea 38 de `epic.md`.
4. **(INC-004)** Añadir a `tasks.md`, grupo 3, una tarea `[P]` que agregue pruebas para el fallback de `layerOf` (sin literal
   `02-epics`) y para `resolveStoriesDir` de `migrate-finvest-field.js` (defecto, ruta explícita y `--stories-dir` sin valor).
5. **(INC-005)** En `story.md`, Non-Goal "Reescribir registros históricos": "todos los ADR (`docs/adr/ADR-*.md`) y
   `docs/specs/01-projects/**`".

---

## Cobertura de ACs en Testcases

| AC | Descripción | Cubierto en testcases.md | Escenario |
|---|---|---|---|
| AC-1 | Carpetas renombradas sin pérdida | ✓ | E2E-001 |
| AC-2 | Ninguna referencia viva en la ruta vieja | ✓ | E2E-002, EV-001, EV-003, IT-004 (y UT-001…UT-009 como soporte) |
| AC-3 | `01-projects/` se elimina solo si está vacía | ✓ | E2E-003 (ejemplo 1), E2E-004 (ejemplo 2), EV-001 |
| CNF-1 | Atomicidad | ✓ | IT-006 |
| CNF-2 | Wikilinks intactos e índice con rutas nuevas | ✓ (IT-001 afectado por INC-001) | IT-001, IT-002, IT-003 |
| CNF-3 | Encoding | ✓ | IT-007 |

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ✓ | `/story-implement STORY-108` |
| tasks.md | ✓ | `/story-implement-tasks STORY-108` |

Ambas vías quedan bloqueadas hasta resolver INC-001 (`story.md` en `PLAN/IN-PROGRESS`).

---

## Cumplimiento DoD — Fase PLAN

Fuente: `docs/guardrails/dod-story-plan.md` (`docs/policies/definition-of-done-story.md` no existe en este repo; el DoD está dividido
por etapa).

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin que cubren los escenarios principales | ✓ | — | AC-1, AC-2 y AC-3 en bloques `gherkin` con Dado/Cuando/Entonces; AC-3 con tabla de ejemplos |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño por criterio | ✓ | — | Ver "Cobertura de Criterios de Aceptación" |
| Todos los elementos de diseño tienen trazabilidad explícita al AC (`// satisface: AC-N`) | ✓ | — | D-1…D-9 con `// satisface:`; tablas de componentes e interfaces con columna "AC que satisface" |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad resuelta o registrada como CR | ❌ | ERROR | Tratamiento de títulos con rutas viejas dentro de `docs/index.md` sin resolver ni registrar (INC-001) |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | Existen ambos |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales | ✓ | — | 31 tareas con una acción verificable cada una; AC-1 (T005, T027), AC-2 (T010–T025, T028), AC-3 (T023, T024, T029) |
| Si testcases.md existe DEBE contener pruebas para todos los escenarios principales | ✓ | — | E2E-001…E2E-004 trazables 1-a-1 a AC-1, AC-2 y los dos ejemplos de AC-3 |
