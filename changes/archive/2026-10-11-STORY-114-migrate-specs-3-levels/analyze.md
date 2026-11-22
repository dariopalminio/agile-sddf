---
type: analyze
id: STORY-114
slug: STORY-114-analyze-report
title: "Analyze: Implementar memory-system migrate --from=specs-3-levels"
story: STORY-114
design: STORY-114
tasks: STORY-114
created: 2026-10-08
updated: 2026-10-08
related:
  - STORY-114-migrate-specs-3-levels
---

<!-- Referencias -->
[[STORY-114-migrate-specs-3-levels]]

# Reporte de Coherencia: Implementar memory-system migrate --from=specs-3-levels

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (y los 4 CNF también) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada: testcases.md no existe |
| Alineación tareas → diseño | ✓ | 35/35 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 19/19 elementos con tarea (8 componentes + 11 interfaces) |
| Alineación con la épica EPIC-21-colapsar-specs-dos-niveles | ⚠️ | Historia listada y objetivo alineado; quedan 2 restricciones de la épica por precisar (INC-001, INC-002) |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 6/7 criterios ✓ (1 ⚠️, ninguno ❌) |

**Estado general:** ⚠️ Advertencias (0 ERROR · 3 WARNING). No hay nada que bloquee el paso a `READY-FOR-IMPLEMENT`.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Colapso completo: `01-projects/` → `product/`, `requirements/` (un archivo por FR/NFR) y `architecture/c4/`; `02-epics`/`03-stories` → `epics`/`stories` sin perder archivos; `01-projects/` eliminado; `check` en exit 0 (story.md L35-44) | ✓ | D-2 (orden de aplicación), D-3, D-4 (mapa de destino), D-6 (visión), D-7 (stakeholders y requisitos), D-8 (roadmap y objetivos), D-9 (story map y diagramas), D-10 (`fillDocument`), D-11 (niveles), D-12 (wikilinks), F-1, contratos #1-#4 |
| AC-2 | `--dry-run` no escribe y el informe termina en `cambios pendientes: N`; una segunda ejecución sobre un repo ya migrado informa 0 cambios (story.md L46-58) | ✓ | D-13 (etiquetas en condicional, `cambios pendientes:`), D-3 fila "Ningún nivel viejo existe" (plan vacío), interfaz `planSpecsMigration`, F-2, contratos #5-#6 |
| AC-3 | `[NO MIGRADO]` con exit 1 para multi-proyecto, `vision.md` con contenido propio y secciones fuera del template; `01-projects/` se conserva (story.md L60-73) | ✓ | D-2 (unidad atómica, `01-projects/` solo se elimina sin `[NO MIGRADO]`), D-3 (bloqueo global), D-5 (clasificación de secciones), D-10 paso 4 (conflicto sin `--force`), F-3, contratos #7-#9 |
| CNF-1 | El informe sigue el formato de `dod-monolithic` y no cambia los orígenes que ya existen | ✓ | D-1 (tabla `MIGRATORS`), D-13, contrato #10 |
| CNF-2 | Sin pérdida | ✓ | D-2, D-4, D-11, D-12 (+ CR-004), contrato #2 |
| CNF-3 | Los movimientos se ven como renombrados en git | ✓ | D-9, D-11 (`fs.renameSync` sin invocar git), contrato #11 |
| CNF-4 | Cobertura en `test/memory-system.test.js`; `npm test` en exit 0 | ✓ | D-15, contratos #12-#13 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Línea base (tests, verificadores, `SPECS_LAYERS`, semilla de roadmap, grep CR-005) | Context (dependencia de STORY-108), contratos #10/#13, CR-005 | ✓ |
| T002 | Base de la fixture copiada de `examples/sane` | D-15, componente Fixture | ✓ |
| T003 | `PROJ-01-demo` con intención, proyecto, plan, story map y `.puml` | D-15, D-4 | ✓ |
| T004 | Épica e historia de la fixture con wikilinks a slugs viejos | D-15, D-12 | ✓ |
| T005 | Esqueleto de `specs-3-levels.js`, `LEGACY_LEVELS` | D-1, Interfaces | ✓ |
| T006 | `normalizeHeading`, secciones, `isEmptyBody`, preámbulo | D-5, interfaz `isEmptyBody` | ✓ |
| T007 | Clasificación de secciones de `project.md` | D-5 (tabla de clases), D-2 | ✓ |
| T008 | `requirementSlug`, `parseRequirements`, `renderRequirement` | D-7, interfaces homónimas | ✓ |
| T009 | `fillDocument` y layouts | D-10, Esquema de datos (Layouts) | ✓ |
| T010 | `rewriteWikilinks` | D-12 | ✓ |
| T011 | Descubrimiento y precondiciones en `planSpecsMigration` | D-3, D-4 | ✓ |
| T012 | Unidad de visión | D-6, D-10 | ✓ |
| T013 | Unidad de `project.md` (stakeholders, requisitos, colisiones, SRS) | D-7, D-2 | ✓ |
| T014 | Unidad de `project-plan.md` (objetivos, roadmap, foto de épicas) | D-8 | ✓ |
| T015 | Movimiento de story map y diagramas | D-9 | ✓ |
| T016 | Movimiento de niveles entrada por entrada | D-11 | ✓ |
| T017 | Mapa de slugs, `rewrites[]`, `removals[]`, reanudación | D-2, D-12, Esquema `Plan` | ✓ |
| T018 | `migrateSpecs`: aplicación, informe, totales, exit codes | D-2, D-13, interfaz `migrateSpecs` | ✓ |
| T019 | Registro en el motor (`MIGRATE_SOURCES`, `MIGRATORS`, `USAGE`) | D-1, componente Motor de memoria | ✓ |
| T020 | Pruebas unitarias `S114-UT-*` | contratos #4/#12, componente Pruebas | ✓ |
| T021 | `S114-IT-001..003` | contratos #1-#4 | ✓ |
| T022 | `S114-IT-004..005` | contratos #5-#6 | ✓ |
| T023 | `S114-IT-006..008` | contratos #7-#9 | ✓ |
| T024 | `S114-IT-009` (git) | contrato #11 | ✓ |
| T025 | Formato del informe y regresión de los otros orígenes | contrato #10 | ✓ |
| T026 | `TC-023`, `TC-024` en `evals.json` | D-14, componente Evals, contrato #14 | ✓ |
| T027 | `references/specs-3-levels-rules.md` | D-14, componente Reglas del mapa | ✓ |
| T028 | `SKILL.md`: modo, Pasos 1/2/4, secuencia 3.9, regla de borrado | D-14, componente Contrato del skill | ✓ |
| T029 | `README.md` y `memory-rules.md` del skill | D-14, componente Documentación del skill | ✓ |
| T030 | Entrada en `CHANGELOG.md` | Tarea transversal de release; no figura en "Componentes afectados" pero cubre el resultado de D-1…D-14 (convención del repo) | ✓ |
| T031 | `npm test` y comparación con la línea base | contratos #10/#13 | ✓ |
| T032 | Validar `evals.json`, `verify:eval-inventory`, `test:eval` | contrato #14 | ✓ |
| T033 | Verificar CR-005 con `git grep` | D-1 (`LEGACY_LEVELS` único), CR-005 | ✓ |
| T034 | `audit-root-resolution`, `verify:links`, `verify:syntax`, encoding | contrato #13, regla de encoding | ✓ |
| T035 | Validación manual de AC-1/AC-2 | F-1, F-2, D-14 (secuencia 3.9) | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Migrador de tres niveles `specs-3-levels.js` | Componentes afectados | T005-T018 | ✓ |
| Motor de memoria `memory-system.js` | Componentes afectados | T019 | ✓ |
| Contrato del skill `SKILL.md` | Componentes afectados | T028 | ✓ |
| Documentación del skill (`README.md`, `memory-rules.md`) | Componentes afectados | T029 | ✓ |
| Reglas del mapa `specs-3-levels-rules.md` | Componentes afectados | T027 | ✓ |
| Evals (`TC-023`, `TC-024`) | Componentes afectados | T026, T032 | ✓ |
| Fixture `examples/specs-3-levels/` | Componentes afectados | T002-T004 | ✓ |
| Pruebas `test/memory-system.test.js` | Componentes afectados | T020-T025, T031 | ✓ |
| `migrateSpecs` | Interfaces | T018 | ✓ |
| `planSpecsMigration` | Interfaces | T011, T017 | ✓ |
| `fillDocument` | Interfaces | T009 | ✓ |
| `parseRequirements` | Interfaces | T008 | ✓ |
| `renderRequirement` | Interfaces | T008 | ✓ |
| `requirementSlug` | Interfaces | T008 | ✓ |
| `isEmptyBody` | Interfaces | T006 | ✓ |
| `rewriteWikilinks` | Interfaces | T010 | ✓ |
| `LEGACY_LEVELS` | Interfaces | T005, T033 | ✓ |
| CLI `memory-system.js migrate … --from specs-3-levels` | Interfaces | T019 | ✓ |
| Skill `/memory-system migrate --from=specs-3-levels` | Interfaces | T028 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-21-colapsar-specs-dos-niveles

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | epic.md › "Historias", línea de STORY-114 (L37), y fila 7 de la tabla de dependencias |
| Objetivo de la historia alineado con la épica | ✓ | El "Para" (adoptar la estructura de dos niveles sin repetir a mano las STORY-104…108) corresponde al alcance "ofrecer migración automática para repos existentes" y a SMOKE-2. El criterio de salida "`migrate --from=specs-3-levels --dry-run` reporta 0 cambios pendientes" queda cubierto por AC-2 y D-13 |
| Restricciones de la épica respetadas | ⚠️ | Se respetan un solo proyecto por raíz (Notas → D-3), `architecture/c4/` y "functional/non-functional o SRS" (D-7 escribe fragmentado y avisa si hay SRS). Quedan dos puntos por precisar: el criterio de salida L49 no admite la excepción de `LEGACY_LEVELS` (INC-001), y SMOKE-3 L80 choca con el Non-Goal de no reescribir `parent`/`related` (INC-002) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D. Desalineación con la épica
- **Descripción:** el criterio de salida de EPIC-21 "Ningún skill ni agente referencia `specs/01-projects/`, `specs/02-epics/` ni `specs/03-stories/`" no tiene excepción para la lógica de migración. El diseño necesita esos nombres en `LEGACY_LEVELS`, en la fixture, en `references/specs-3-levels-rules.md` y en el modo de `SKILL.md` (D-1, CR-005). La entrada de STORY-113 (L36) ya dice que "01-projects" solo queda en la lógica de migración de memory-system, pero el criterio L49 no lo recoge. El CR-005 está registrado y sin aplicar.
- **Archivo afectado:** `docs/specs/02-epics/EPIC-21-colapsar-specs-dos-niveles/epic.md`, sección "Criterios de salida" (L49). En design.md, la sección "Registro de Cambios (CR)" › CR-005.
- **Acción requerida:** aplicar CR-005 en epic.md y añadir la excepción "salvo la lógica de migración de `memory-system`". Si no se aplica, STORY-117 o la verificación de cierre fallarán el grep por diseño.

### INC-002 [WARNING]

- **Tipo:** D. Desalineación con la épica
- **Descripción:** SMOKE-3 exige que "los frontmatters mantienen sus referencias `parent`/`related`". El diseño excluye reescribir esas claves (Non-Goals; Risks: "Claves de frontmatter (`parent: PROJ-01-…`, `related:`) siguen nombrando slugs viejos"). Las conserva tal cual, pero después de la migración algunas apuntan a slugs que ya no existen, como el del proyecto o el de `project-intent.md`. Si "mantienen" significa "siguen resolviendo", hay desalineación. `check` no evalúa el frontmatter, así que ninguna prueba de la historia lo detecta.
- **Archivo afectado:** `epic.md`, sección "Smoke tests" › SMOKE-3 (L80). `design.md`, secciones "Non-Goals" y "Risks / Trade-offs".
- **Acción requerida:** precisar en SMOKE-3 que basta con que `parent`/`related` se conserven sin cambios, o bien que deben resolver. Si es lo segundo, ampliar D-12 al frontmatter, con una tarea nueva en el grupo 3 y una prueba en T021.

### INC-003 [WARNING]

- **Tipo:** E. Criterio DoD PLAN con evidencia insuficiente (⚠️, no ❌)
- **Descripción:** el criterio "tasks.md DEBE contener únicamente tareas atómicas" se cumple casi siempre, pero algunas tareas agrupan varias piezas. T008 tiene tres interfaces (`requirementSlug`, `parseRequirements`, `renderRequirement`). T018 junta la aplicación del plan, el informe, los totales y los exit codes. T028 incluye seis cambios en `SKILL.md`. Cada una tiene un único entregable verificable, así que no se marca ❌ (regla de duda).
- **Archivo afectado:** `tasks.md`, grupo "3. Módulo" (T008, T018) y grupo "6. Evals, skill y documentación" (T028).
- **Acción requerida:** opcional. Dividir T008 en slug, parseo y render, y T018 en aplicación e informe, si se quiere seguir el avance tarea por tarea con `/story-implement-tasks`.

---

## Recomendaciones

1. **INC-001:** editar `epic.md` › "Criterios de salida" L49 y añadir la excepción de CR-005 antes de implementar, para que T033 tenga un criterio contra el que verificar.
2. **INC-002:** decidir el alcance de SMOKE-3 sobre `parent`/`related` y dejarlo explícito en `epic.md`. Si deben resolver, abrir un CR en design.md (D-12) y añadir una tarea.
3. **INC-003:** opcional. Dividir T008 y T018 en tasks.md.
4. **CR del diseño pendientes en story.md** (no bloquean: el DoD acepta ambigüedades registradas como CR). Conviene aplicarlos para que la verificación no lea los criterios al pie de la letra contra el diseño:
   - CR-001: precisar el "Dado" de AC-1 (L35-44), con secciones sin destino vacías y §1.1–1.7 que repiten la intención.
   - CR-004: precisar CNF-2 (L78): "después solo cambian los wikilinks cuyo slug cambia".
   - CR-006: AC-2 (L46-58) dice que la última línea "dice" `creados: 0 · sobrescritos: 0`, pero D-13 añade más contadores. Conviene "empieza con …".
   - CR-002 y CR-003: actualizar la nota "Dependencia de decisión" (L95) para citar STORY-110 D-2 y la disposición fragmentada.
5. **Precondición de ejecución:** STORY-108 todavía no está integrada; `memory-system.js` L86 sigue con `SPECS_LAYERS` sobre `01-projects`/`02-epics`/`03-stories`. El diseño asume las claves `epics`/`stories` y la épica ordena esta historia después del renombrado. T001 lo detecta; no empezar el grupo 3 sin resolverlo. ADR-0013 sigue en `status: PROPOSED`.
6. **testcases.md ausente:** la vía `/story-implement` no está disponible. Los contratos de verificación de design.md y las tareas T020-T025 describen las pruebas. Ejecutar `/story-testcases STORY-114` si se quiere esa vía.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-114` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-114` (disponible) |

---

## Cumplimiento DoD — Fase PLAN

Fuente: `docs/guardrails/dod-story-plan.md` (`enforcement: error`), resuelto desde `sddf.config.yaml › guardrails.dod.story.plan`.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene ACs en Gherkin que cubren los escenarios principales | ✓ | — | AC-1 (principal), AC-2 (alternativo, Escenario + Ejemplos), AC-3 (error, Escenario + Ejemplos), todos con Dado/Cuando/Entonces |
| design.md existe y cubre todos los ACs con al menos un elemento por criterio | ✓ | — | 3/3 ACs; ver la tabla de cobertura |
| Todos los elementos de diseño tienen trazabilidad explícita (`// satisface: AC-N`) | ✓ | — | D-1…D-15 y los Goals llevan `// satisface:`. Las tablas "Componentes afectados" e "Interfaces" tienen la columna "AC que satisface" |
| No hay decisiones de arquitectura aplazadas | ✓ | — | "Open Questions: Ninguna". Las ambigüedades están registradas como CR-001…CR-006 |
| Existe tasks.md o testcases.md | ✓ | — | tasks.md presente (35 tareas) |
| Si tasks.md existe, contiene solo tareas atómicas para todos los escenarios principales | ⚠️ | WARNING | Los escenarios principales están cubiertos (AC-1: T021; AC-2: T022; AC-3: T023). T008, T018 y T028 agrupan varias piezas (INC-003) |
| Si testcases.md existe, contiene pruebas para todos los escenarios principales | ✓ | — | No aplica: testcases.md no existe |
