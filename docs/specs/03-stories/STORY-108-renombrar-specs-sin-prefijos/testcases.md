---
type: testcases
id: STORY-108
slug: STORY-108-renombrar-specs-sin-prefijos-testcases
title: "Test Cases: Renombrar specs/02-epics/ → specs/epics/ y specs/03-stories/ → specs/stories/"
story: STORY-108
created: 2026-10-07
updated: 2026-10-07
related:
  - STORY-108-renombrar-specs-sin-prefijos
---

<!-- Referencias -->
[[STORY-108-renombrar-specs-sin-prefijos]]

# Casos de Prueba: Renombrar `specs/02-epics/` → `specs/epics/` y `specs/03-stories/` → `specs/stories/`

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | 9 |
| CT   | 0 |
| IT   | 9 |
| API  | 0 |
| E2E  | 4 |
| EV   | 3 |

## Tabla de casos

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| E2E-001 | End-to-End | Carpetas renombradas sin pérdida | `baseline.txt` registra 22 directorios `EPIC-*`, 110 `STORY-*` y los conteos de archivos (`find -type f`, `git ls-files`) de `02-epics/` y `03-stories/` | Se aplica el renombrado (T005) y se prepara el commit (`git add -A`) | `docs/specs/epics/` y `docs/specs/stories/` tienen los mismos conteos que `baseline.txt`; `docs/specs/02-epics/` y `docs/specs/03-stories/` no existen; `git diff --cached -M --name-status -- docs/specs` lista los movidos como `R…` sin pares `D`+`A`; `git log --follow` de `docs/specs/stories/STORY-108-…/story.md` muestra commits previos | AC-1, D-1, T027 |
| E2E-002 | End-to-End | Ninguna referencia viva en la ruta vieja | Renombrado de AC-1 aplicado y sustitución textual hecha | Se ejecuta el `git grep` de D-6, `npm test` y el protocolo de `skill-preflight` | `git grep` sin coincidencias (exit 1); `npm test` exit 0 con el mismo número de pruebas que la línea base (219); `skill-preflight` informa `[OK]` para `specs/epics/` y `specs/stories/` y sin `[ERROR]` | AC-2, D-6, T028 |
| E2E-003 | End-to-End | `01-projects/` vacía se elimina | `find docs/specs/01-projects -type f` no devuelve nada (STORY-104…107 ya migraron su contenido) | Se completa el renombrado (T029) | `docs/specs/01-projects/` ya no existe; el informe de `skill-preflight` no menciona `specs/01-projects/`; `AGENTS.md` muestra `specs/{epics,stories}/` | AC-3 (ejemplo 1), D-8, T023, T029 |
| E2E-004 | End-to-End | `01-projects/` con archivos se conserva intacta | `docs/specs/01-projects/PROJ-01-agile-sddf/` contiene `project.md` y otros archivos | Se completa el renombrado (T029) | `git diff --cached --quiet -- docs/specs/01-projects` (exit 0); `implement-report.md` lista cada archivo restante; `skill-preflight` devuelve OK sin exigir `specs/01-projects/`; `AGENTS.md` muestra `specs/{01-projects,epics,stories}/` | AC-3 (ejemplo 2), D-8, T023, T029 |
| UT-001 | Unit | Capa de un archivo bajo `specs/epics/` | `SPECS_LAYERS` con claves `01-projects`, `epics`, `stories` | Se clasifica `specs/epics/EPIC-01-x/epic.md` | La capa es `specs-epics` | D-3, T010 |
| UT-002 | Unit | Capa de un archivo bajo `specs/stories/` | Mismo mapa | Se clasifica `specs/stories/STORY-001-a/story.md` | La capa es `specs-stories` | D-3, T010, T015 |
| UT-003 | Unit | Segmento de nivel desconocido (layout viejo) | Mismo mapa, sin clave `02-epics` | Se clasifica `specs/<nivel-viejo>/EPIC-01-x/epic.md` (nombre construido en la prueba sin literal prohibido, o vía fixture con otro nombre) | Cae al fallback `specs-<segmento>` sin lanzar error | D-3, F-3 |
| UT-004 | Unit | Semilla de `scaffold` con niveles sin prefijo | Árbol semilla renombrado (T006) | Se ejecuta `scaffold` sobre un directorio vacío | Se crean `specs/01-projects/.gitkeep`, `specs/epics/.gitkeep` y `specs/stories/.gitkeep`; no se crea ningún directorio con prefijo `02`/`03` | D-2, T006, T015 |
| UT-005 | Unit | `migrateEpics` descubre épicas con cualquier nombre de nivel | `docs/specs/epics/EPIC-02-v1-minima/epic.md` y `docs/specs/otro-nivel/EPIC-09-otra/epic.md` | Se ejecuta el descubrimiento de UT-018 | Devuelve ambas rutas, ordenadas | D-3, T014 |
| UT-006 | Unit | `migrateEpics` ignora `epic.md` fuera de un directorio `EPIC-*` | `docs/specs/stories/STORY-001-x/epic.md` | Se ejecuta el descubrimiento de UT-018 | La ruta bajo `stories/` no aparece en el resultado | D-3, T014 |
| UT-007 | Unit | Fixture de épicas v1 bajo `specs/epics/` | Fixture `skills/memory-system/examples/epic-template-v1/docs/specs/epics/` (T007) | Se ejecuta `migrate --from=epic-template-v1` en seco y real sobre la copia | Las líneas `[MIGRARÍA]`, `[REVISAR]`, `[MIGRADO]`, `[SIN CAMBIOS]` citan `specs/epics/EPIC-…/epic.md` | D-2, D-3, T007, T014 |
| UT-008 | Unit | Defecto de `--stories-dir` en `migrate-finvest-field.js` | Sin argumento `--stories-dir` | Se resuelve el directorio de historias | Resuelve `docs/specs/stories` relativo al cwd, y la ayuda dice `defecto: docs/specs/stories` | D-3, T013 |
| UT-009 | Unit | `--stories-dir` explícito y sin valor | Argumento `--stories-dir <ruta>` / `--stories-dir` sin ruta | Se resuelve el directorio de historias | Con ruta, usa la ruta dada; sin ruta, emite `[ERROR] --stories-dir requiere una ruta` (comportamiento sin cambios) | D-3, T013 |
| IT-001 | Integration | El índice muestra las rutas nuevas sin regenerarse | Sustitución R1/R2 aplicada a `docs/index.md` y plantilla `index-template.md` actualizada | Se ejecuta `grep -cE "02-epics\|03-stories" docs/index.md` y `memory-system index --root docs --dry-run` | 0 coincidencias en ambos; encabezados `### L2 — Épicas (specs/epics/)` y `### L1 — Historias de usuario (specs/stories/)`; `git diff docs/index.md` sin cambios en `updated` ni entradas nuevas | CNF-2, D-7, T011, T025 |
| IT-002 | Integration | Sin wikilinks rotos nuevos | `check-before.txt` con `problemas: 55 (orphan 6 · broken-wikilink 49)` (o el valor medido en T004) | Se ejecuta `memory-system check --root docs` tras el renombrado | `problemas` y `broken-wikilink` no superan la línea base; ningún problema nuevo atribuible al cambio de ruta | CNF-2, D-9, T028 |
| IT-003 | Integration | Enlaces de documentación activa | Referencias vivas actualizadas | Se ejecuta `node scripts/check-doc-links.js` | `[OK] Checked … active Markdown files; local links and anchors resolve.` | CNF-2, D-7, T028 |
| IT-004 | Integration | Verificadores deterministas del repo | Cambios de código y evals aplicados | Se ejecutan `node scripts/audit-root-resolution.js` y `npm run verify:eval-inventory` | Ambos terminan con exit 0 | AC-2, D-9, T028 |
| IT-005 | Integration | Ejemplos de `header-aggregation` coherentes | Directorios de ejemplo renombrados (T008) y `SKILL.md` sustituido | Se comparan las rutas `examples/…/docs/specs/{epics,stories}` citadas en el skill con el filesystem | Toda ruta de ejemplo citada existe; `SKILL.md:165-166` dice "Para `stories/`: busca `story.md`" y "Para `epics/`: busca `epic.md`" | D-2, D-5, T008, T022 |
| IT-006 | Integration | Commit único (atomicidad) | Implementación completa | Se inspeccionan `git show --stat HEAD` y `git log` de la rama | El mismo commit contiene los renombrados y las ediciones de referencias; ningún commit anterior de la rama mueve `docs/specs/0N-…` | CNF-1, D-9, T030 |
| IT-007 | Integration | Encoding de archivos modificados | Commit preparado | Se revisan los bytes iniciales de los archivos modificados y `git diff --cached` | Ningún archivo empieza con `EF BB BF`; no aparecen `Ã` ni `ðŸ` nuevos; los fines de línea de cada archivo no cambian | CNF-3, D-4, T028 |
| IT-008 | Integration | Registros históricos sin reescribir | Commit preparado | `git diff --cached -M --diff-filter=M --name-only` sobre `docs/specs/epics/*/`, `docs/specs/stories/*/`, `docs/adr/ADR-*`, `CHANGELOG.md` | Solo aparecen `EPIC-21-…/epic.md` (D-8) y artefactos de `STORY-108`; ningún ADR ni `CHANGELOG.md` | Non-Goals, D-6, D-8, T026 |
| IT-009 | Integration | Frases con prefijo semántico corregidas | Sustitución R4/R5 aplicada | Se revisan `bare-lines.txt` y los archivos de D-5 | No quedan frases falsas ("prefijo numérico que preserva el orden", listas duplicadas como `epics y epics`); `README.md` muestra la columna `Ruta actual` | D-4, D-5, T019-T022 |
| EV-001 | Eval | `skill-preflight` OK con dos niveles | Repo con `docs/specs/epics/` y `docs/specs/stories/`, sin `SDDF_ROOT` | Se sigue el protocolo de `skill-preflight` | Verificación 2 emite `[OK]` para `specs/epics/` y `specs/stories/`, no evalúa `specs/01-projects/` y el informe termina en `✓ Entorno OK` | AC-2, AC-3, D-8, T024 |
| EV-002 | Eval | `skill-preflight` con un nivel faltante | `docs` existe pero falta `specs/epics/` (caso del `evals.json` actualizado) | Se sigue el protocolo | Emite `[WARNING]` que nombra `specs/epics`, sin bloquear; ningún mensaje cita `02-epics` | D-8, T024 |
| EV-003 | Eval | Casos de eval actualizados planificables | `evals.json` de los skills tocados con rutas nuevas | Se ejecuta `npm run test:eval -- skill-preflight --dry-run` | El plan es no vacío y termina con exit 0; ningún caso referencia `02-epics`/`03-stories` | AC-2, D-4, T024 |

## Notas de cobertura

- `tasks.md` se usó para enriquecer la referencia de cada caso (columna Ref `T-NNN`).
- AC-3 es un *Scenario Outline* con dos ejemplos: genera dos E2E (E2E-003 y E2E-004). En una misma implementación solo uno de los dos es
  aplicable, según el estado de `docs/specs/01-projects/` al cerrar (CR-003 de `design.md`); el otro se marca como no aplicable en el
  informe, no como fallido.
- Los UT-001…009 se materializan como pruebas existentes de `node --test` ajustadas en T014/T015 (o pruebas nuevas en el mismo archivo si
  la existente no cubre el caso); UT-003 no puede usar el literal `02-epics` en `test/` (AC-2): se construye con otro nombre de nivel.
- No hay componentes UI, endpoints, stores ni contratos entre sistemas: CT, API, ST y CON no aplican.
- Los casos de repo (IT-006…IT-008) verifican los criterios no funcionales y los Non-Goals; no son automatizables en `node --test`
  porque dependen del commit concreto.
- Fuera de cobertura: la reinstalación de runtimes (T031) es un paso operativo con confirmación del mantenedor.

## Test Cases Progress for STORY-108

<!-- Generado automáticamente por story-testcases. Actualizado por story-implement en fase GREEN.
     [x] = test pasó | [ ] = pendiente | [!] = test falló -->
- [ ] E2E-001: Carpetas renombradas sin pérdida
- [ ] E2E-002: Ninguna referencia viva en la ruta vieja
- [ ] E2E-003: `01-projects/` vacía se elimina
- [ ] E2E-004: `01-projects/` con archivos se conserva intacta
- [ ] UT-001: Capa de un archivo bajo `specs/epics/`
- [ ] UT-002: Capa de un archivo bajo `specs/stories/`
- [ ] UT-003: Segmento de nivel desconocido (layout viejo)
- [ ] UT-004: Semilla de `scaffold` con niveles sin prefijo
- [ ] UT-005: `migrateEpics` descubre épicas con cualquier nombre de nivel
- [ ] UT-006: `migrateEpics` ignora `epic.md` fuera de un directorio `EPIC-*`
- [ ] UT-007: Fixture de épicas v1 bajo `specs/epics/`
- [ ] UT-008: Defecto de `--stories-dir` en `migrate-finvest-field.js`
- [ ] UT-009: `--stories-dir` explícito y sin valor
- [ ] IT-001: El índice muestra las rutas nuevas sin regenerarse
- [ ] IT-002: Sin wikilinks rotos nuevos
- [ ] IT-003: Enlaces de documentación activa
- [ ] IT-004: Verificadores deterministas del repo
- [ ] IT-005: Ejemplos de `header-aggregation` coherentes
- [ ] IT-006: Commit único (atomicidad)
- [ ] IT-007: Encoding de archivos modificados
- [ ] IT-008: Registros históricos sin reescribir
- [ ] IT-009: Frases con prefijo semántico corregidas
- [ ] EV-001: `skill-preflight` OK con dos niveles
- [ ] EV-002: `skill-preflight` con un nivel faltante
- [ ] EV-003: Casos de eval actualizados planificables
