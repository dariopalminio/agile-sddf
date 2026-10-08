---
alwaysApply: false
type: tasks
id: STORY-117
slug: STORY-117-verificar-cierre-epic-21-tasks
title: "Tasks: Verificar sddf.config.yaml y los modos SDD sobre la estructura de dos niveles"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-21-colapsar-specs-dos-niveles
story: STORY-117
design: STORY-117
created: 2026-10-08
updated: 2026-10-08
related:
  - STORY-117-verificar-cierre-epic-21
  - STORY-117-verificar-cierre-epic-21-design
---

<!-- Referencias -->
[[STORY-117-verificar-cierre-epic-21]] · [[STORY-117-verificar-cierre-epic-21-design]]

> Orden: historia `chore` sin código de producto (D-1). La compuerta P-0 (grupo 1) precede a todo: si falla no se ejecuta ninguna
> verificación (D-4, F-4). IMPLEMENT solo prepara y comprueba la precondición y deja la historia en `IMPLEMENT/DONE` (T006, D-2); no
> hay CODE-REVIEW. El resto se ejecuta en VERIFY con `/story-verify STORY-117 --mode manual`: primero los criterios de salida en
> `REPO_ROOT` (grupo 2, solo lectura y paralelizables), después `npm pack` (T016), que es input de todos los temporales; los smoke
> tests deterministas (grupo 4) usan un temporal cada uno; V-17 parte del temporal que deja V-16 y V-11 se compone de ambos (grupo 5).
> El registro en `verify-report.md` (grupo 6) consolida la matriz y aplica AC-3; la verificación de contratos (grupo 7) cierra.
> Todos los comandos se ejecutan en Git Bash (F-4) y cada uno deja su log completo en `.tmp/story-verify/STORY-117/evidence/V-NN.log`
> con la cabecera de "Esquema de datos". La carpeta de historias es la vigente tras STORY-108 (`docs/specs/stories/`). No se modifica
> ningún skill, agente, script, documento ni `sddf.config.yaml`; los CR-001…CR-005 del diseño no son tareas de implementación: se
> registran como estado en T005 y en `Recommendations`. Todo `.md` escrito se guarda en UTF-8 sin BOM.

## 1. Preparación — compuerta P-0 y estado verificado (IMPLEMENT)

- [ ] T001 Comprobar en Git Bash que existe el entorno del procedimiento (`bash`, `git`, `node` ≥ 18, `npm`, `npx`, `mktemp`, `find`, `grep`, `xargs`) y crear `.tmp/story-verify/STORY-117/evidence/`; si falta Git Bash en Windows, detener y registrarlo (el procedimiento no se adapta a PowerShell) — F-4, D-1, D-3
- [ ] T002 P-0.1: verificar que la rama es `epic/EPIC-21-colapsar-specs-dos-niveles` y que `git status --porcelain` no lista líneas fuera de `.tmp/`; registrar `SHA = git rev-parse HEAD` en `.tmp/story-verify/STORY-117/evidence/P-0.log`. Si el árbol no está limpio, P-0 `FAIL` y detener — D-4, CNF-1
- [ ] T003 P-0.2: leer `status`/`substatus` de STORY-104…STORY-116 con `grep -m2 -E '^(status|substatus):' docs/specs/stories/STORY-1{04..16}-*/story.md` y registrar el resultado en `P-0.log`; cada historia debe estar en `ACCEPTANCE` con `substatus: DONE`, `DELIVER`, `COMPLETED` o `CANCELED` (este último como "no aplica" con su motivo); STORY-118 no es precondición (CR-003) — D-4, AC-1
- [ ] T004 Si T002 o T003 fallan, registrar P-0 `FAIL` con la lista de historias pendientes como responsables (D-12, fila P-0), no ejecutar ninguna verificación de los grupos 2–5 y continuar directamente en T024 para dejar el reporte con P-0 como único resultado — D-4, F-4, AC-3
- [ ] T005 [P] Registrar en `.tmp/story-verify/STORY-117/cr-status.md` el estado (abierto/resuelto) de CR-001…CR-005 sin editar ningún documento: excepción de `memory-system` en el criterio de salida de `epic.md` (CR-001), redacción "tres modos SDD"/"Intent-First" de `epic.md` (CR-002), "Dado" de AC-1 en `story.md` (CR-003), nota `test:e2e:smoke` de `story.md` y scripts inexistentes en `sddf.config.yaml` (CR-004), wikilink `[[ADR-0013-eliminar-specs-01-projects]]` de `story.md` y existencia de la historia de saneamiento de memoria en EPIC-21 (CR-005) — CR-001…CR-005, D-11
- [ ] T006 Con P-0 `PASS`, cerrar IMPLEMENT sin cambios versionados (sin diff de código, CODE-REVIEW no aplica) dejando `story.md` en `IMPLEMENT/DONE`, el estado mínimo que admite `story-verify` — D-2

## 2. Criterios de salida en `REPO_ROOT` (V-01…V-10, V-12) (VERIFY)

> Todos se ejecutan en `REPO_ROOT@<SHA>` con `ENGINE = node skills/memory-system/scripts/memory-system.js`; cada fila registra
> comando, exit, extracto decisivo y resultado (D-3); todo `FAIL` se atribuye con la tabla de D-12.

- [ ] T007 [P] V-01 y V-02: ejecutar `test ! -e docs/specs/01-projects; echo $?` (`PASS` con `0`) y `ls -A docs/specs` (`PASS` si la salida es exactamente `README.md`, `epics`, `stories`); responsables STORY-108/STORY-114 — D-6, D-12, AC-1
- [ ] T008 [P] V-03 y V-04: ejecutar `ls docs/product/{vision,stakeholders,roadmap,story-map}.md` y `test -f docs/architecture/c4/context-diagram.puml` (`PASS` con exit 0 en ambos); atribuir cada archivo ausente a STORY-104/105/106/107 según D-12 — D-6, D-12, AC-1
- [ ] T009 [P] V-05: ejecutar `find docs/requirements/functional docs/requirements/non-functional -name '*.md' ! -name README.md` y `ls docs/requirements/srs-*.md`; `PASS` si hay ≥ 1 requisito en cada carpeta o existe un `srs-*.md`; responsable STORY-105 (o STORY-118 si falta el SRS esperado) — D-6, D-12, AC-1
- [ ] T010 [P] V-06: ejecutar `git grep -nE '(^|[^-[:alnum:]])(01-projects|02-epics|03-stories)' -- skills agents`; clasificar cada coincidencia contra la lista de excepciones de D-5 (archivo y contexto admitido), registrar en la matriz las coincidencias admitidas con archivo:línea, y marcar `FAIL` toda coincidencia fuera de la lista atribuyéndola por las filas V-06 de D-12; si CR-001 sigue abierto, anotar que V-06 se evaluó con la lista de D-5 — D-5, D-6, D-12, CR-001, AC-1
- [ ] T011 [P] V-07: ejecutar `$ENGINE migrate --root docs --from specs-3-levels --dry-run`; `PASS` con exit 0 y última línea `cambios pendientes: 0`; con exit 2 por modo no admitido, `FAIL` con el mensaje de uso y responsable STORY-114 (F-4) — D-6, D-12, F-4, AC-1
- [ ] T012 [P] V-08: ejecutar `$ENGINE check --root docs; echo $?`; `PASS` solo con exit 0 sobre todo `docs/` (política absoluta, sin exclusiones); si falla, registrar el resumen por tipo y atribuir cada problema por D-12 (slug retirado por EPIC-21 → historia que retiró el nodo; preexistente → historia nueva de saneamiento) con la vía de corrección "corregir el registro" de D-11 — D-6, D-11, D-12, CR-005, AC-1, AC-3
- [ ] T013 [P] V-09: ejecutar `$ENGINE check --root docs --json` y filtrar `problems[]` con `kind: broken-wikilink` cuyo `detail` empiece por `[[EPIC-` o `[[STORY-`; `PASS` si no hay ninguno; atribuir cada uno por D-12 — D-6, D-12, AC-1
- [ ] T014 [P] V-10: extraer de `CHANGELOG.md` la sección `## [Unreleased]` hasta el siguiente `## [` y buscar `BREAKING`, `4.0.0` y `artifact-directory-migration.md`; `PASS` si están las tres; responsable STORY-116 — D-6, D-12, AC-1
- [ ] T015 [P] V-12: ejecutar `git ls-files -z -- 'sddf.config.yaml' '*/sddf.config.yaml' | xargs -0 grep -nE '01-projects|02-epics|03-stories'`; `PASS` con exit 1 (sin coincidencias, sin excepciones); registrar también la lista de archivos revisados (`git ls-files`) para el contrato 2; atribuir coincidencias por la fila V-12 de D-12 — D-6, D-12, AC-1

## 3. Paquete y repositorios temporales (D-7)

- [ ] T016 Ejecutar `npm pack` una sola vez en `REPO_ROOT` con el `SHA` de P-0 y mover el tarball a `.tmp/story-verify/STORY-117/` (`$TGZ`); registrar nombre y SHA en el log. Si falla, marcar V-13…V-17 `FAIL` atribuidas a STORY-108 (instalación) con el log y saltar a T024; V-01…V-12 siguen siendo válidas — D-7, F-4, CNF-1
- [ ] T017 Fijar el procedimiento común de temporal que usan T018…T021: `mktemp -d` fuera del repo, `git init`, `npm install --ignore-scripts --no-save "$TGZ"`, `npx agile-sddf install --target claude-code`, y comprobación de que existe `.claude/skills/memory-system/scripts/memory-system.js` (`ENGINE_T`); motor y fixtures se toman siempre del temporal (`.claude/…`, `node_modules/agile-sddf/skills/memory-system/examples/…`), nunca de `REPO_ROOT/docs`; cada log registra la ruta del temporal, `$TGZ` y `SHA`; un fallo de instalación es `FAIL` de la verificación atribuido a STORY-108 — D-7, CNF-1

## 4. Smoke tests deterministas (V-13…V-15)

- [ ] T018 [P] V-13 (SMOKE-1): en un temporal nuevo sin `docs/`, ejecutar `$ENGINE_T scaffold --root docs --date 2026-01-01`; `PASS` si exit 0, `find docs/specs -mindepth 1 -maxdepth 1 -type d` devuelve solo `epics` y `stories`, `find docs -type d -name '0[123]-*'` está vacío y existen `docs/product/{vision,stakeholders,roadmap}.md` y `docs/requirements/{functional,non-functional}/`; responsable STORY-115 — D-8, D-12, AC-2, CNF-1
- [ ] T019 [P] V-14 (SMOKE-2): en un temporal nuevo, copiar `node_modules/agile-sddf/skills/memory-system/examples/specs-3-levels/` como estado inicial; guardar `find docs -type f | sort` en `before.txt`; ejecutar `$ENGINE_T migrate --root docs --from specs-3-levels --date 2026-01-01`, después la repetición con `--dry-run` y `$ENGINE_T check --root docs --json`; `PASS` si la migración termina con exit 0 sin `[NO MIGRADO]`, no existen `docs/specs/{01-projects,02-epics,03-stories}`, el conteo de archivos bajo `specs/epics` + `specs/stories` iguala al de `02-epics` + `03-stories` de `before.txt` conservando cada ruta relativa, cada archivo de `01-projects/` de `before.txt` aparece en el informe (`[MOVIDO]` o como origen de `[CREADO]`/`[SOBRESCRITO]`/`[PRESERVADO]` seguido de `[ELIMINADO]`), `summary.broken-wikilink` = 0 y el seco termina en `cambios pendientes: 0`; responsable STORY-114 — D-8, D-12, AC-2, CNF-1
- [ ] T020 [P] V-15 (SMOKE-3): en otro temporal nuevo con una copia nueva de la misma fixture, guardar `parent`/`related` de cada `epic.md` y `story.md` en `fm-before.txt`; ejecutar `migrate`, `$ENGINE_T index --root docs` y `check --json`; `PASS` si `index` sale con exit 0, `docs/index.md` contiene cada `[[EPIC-*]]` y `[[STORY-*]]` de la fixture, no hay `broken-wikilink` hacia `[[EPIC-`/`[[STORY-` y `parent`/`related` coinciden con `fm-before.txt` salvo los slugs del mapa de reescritura de STORY-114 D-12, reescritos de forma consistente; responsable STORY-114 — D-8, D-12, AC-2, CNF-1

## 5. Flujos de modo SDD (V-16, V-17, V-11)

- [ ] T021 V-16 (Spec-First): en un temporal nuevo, abrir una sesión interactiva de Claude Code y ejecutar `/sddf-init --level full` → `/project-flow` (Begin, Discovery, Planning) → `/epic-from-project-plan` → `/story-specify <EPIC-ID>` respondiendo con el guion fijo "todo-cli" de D-9 transcrito en `testcases.md` (o la opción por defecto); guardar la transcripción en `.tmp/story-verify/STORY-117/evidence/V-16.log` y ejecutar las comprobaciones deterministas de D-9: `find . -path ./node_modules -prune -o -name '*0[123]-*' -print` vacío, existencia de `docs/product/{vision,stakeholders,roadmap}.md`, ≥ 1 `docs/requirements/functional/*.md` (o `srs-*.md`), ≥ 1 `docs/specs/epics/EPIC-*/epic.md` y ≥ 1 `docs/specs/stories/STORY-*/story.md`, y `git status --porcelain --untracked-files=all` sin artefactos fuera de las rutas admitidas; atribuir un `FAIL` al skill donde se rompe el flujo por las filas V-06 de D-12 (instalación: STORY-108); si la sesión se interrumpe, `NO EJECUTADA` — D-9, D-12, F-4, AC-2, CNF-1
- [ ] T022 V-17 (Spec-Anchored): solo si V-16 es `PASS`, en el mismo temporal ejecutar `/story-plan <STORY-ID>` → `/story-implement <STORY-ID> --auto` → `$ENGINE_T index --root docs` → `$ENGINE_T check --root docs`; `PASS` si `docs/specs/stories/<STORY-ID>-*/story.md` existe con `status` posterior a `READY-FOR-IMPLEMENT`, `docs/index.md` contiene `[[<STORY-ID>-…]]` y `check` sale con exit 0; atribuir por la fila V-17 de D-12. Si V-16 no es `PASS`, registrar `NO EJECUTADA (depende de V-16)`, que no cuenta como `PASS` — D-9, D-12, AC-2
- [ ] T023 V-11 y V-11c: componer V-11 = `PASS` solo si V-16 y V-17 son `PASS`; añadir la subfila V-11c Spec-as-Source `N/A` con la justificación de la historia (sin flujo que edite solo la especificación y regenere el código, `docs/guides/sdd.md`) y la evidencia estructural de V-06; usar el término Spec-First indicando que equivale al "Intent-First" de la épica (CR-002) — D-10, CR-002, AC-1, AC-2

## 6. Registro en `verify-report.md` y transición (VERIFY)

- [ ] T024 Ejecutar `/story-verify STORY-117 --mode manual` y escribir `verify-report.md` con el template sin secciones nuevas: `Summary` (Total, Passed/Failed, Skipped = `NO EJECUTADA` + `PASS` arrastradas, Coverage `N/A — verificación de cierre`), `Coverage Analysis` con la matriz de cierre (una fila por P-0, V-01…V-17 y V-11c con `ID`, `Criterio`, `Estado inicial`, `Comando`, `Exit`, `Extracto`, `Resultado`, `Responsable`, `Área`, `SHA`), `Findings` (un hallazgo `CRITICAL` por `FAIL` con evidencia, responsable y área), `Recommendations` (correcciones agrupadas por historia responsable, CR abiertos de T005, scripts npm inexistentes de `sddf.config.yaml` de CR-004, historia de saneamiento si V-08/V-09 fallan) e `Historial de Ejecuciones Anteriores`; solo extractos decisivos, el log completo queda en `.tmp/` — D-2, D-3, Esquema de datos, AC-1, AC-2, AC-3, CNF-2
- [ ] T025 Aplicar la transición de AC-3: con algún `FAIL` o `NO EJECUTADA` en una verificación exigida, la historia queda en VERIFY (rechazo de `story-verify`) y no pasa a ACCEPTANCE; con todo `PASS` (V-11c `N/A`), `VERIFY/DONE`. Borrar los temporales de las verificaciones `PASS` y conservar los de `FAIL` con su ruta en el log — D-2, D-7, F-1, F-2, AC-3
- [ ] T026 Reverificación (solo si existe una ejecución anterior en `Historial de Ejecuciones Anteriores`): con el nuevo `SHA`, repetir P-0, calcular `git diff --name-only <SHA anterior>..HEAD` y repetir toda verificación `FAIL` o `NO EJECUTADA` y toda `PASS` cuya área de D-12 interseque el diff (si el diff solo toca `docs/specs/**` por corregir un registro, solo V-01, V-02 y V-07…V-09); arrastrar el resto como `PASS` con su SHA, recalcular V-11 y pasar la ejecución anterior al historial — D-12, F-3, AC-3

## 7. Verificación de contratos

- [ ] T027 [P] Revisar `verify-report.md` contra los contratos 1–5 del diseño: la matriz tiene V-01…V-11 (los 11 criterios de salida de `epic.md`) más V-12, cada una con comando, exit, extracto y resultado (1); V-12 con exit 1 y la lista de archivos revisados (2); V-13…V-17 con estado inicial, comando o secuencia y comprobaciones, V-16/V-17 con el guion (3); cada V-13…V-17 indica temporal, `$TGZ` y SHA y ningún comando lee `REPO_ROOT/docs` (4); todo `FAIL` tiene hallazgo `CRITICAL` y `Responsable` de D-12 y con algún `FAIL` la historia no está en `VERIFY/DONE` (5) — Contratos de verificación #1–#5, AC-1, AC-2, AC-3, CNF-1
- [ ] T028 [P] Contrato 7: tras VERIFY, `git status --porcelain` solo muestra `verify-report.md` y `story.md` de STORY-117 (nada de `.tmp/`, ningún skill, agente, script, documento ni `sddf.config.yaml` modificado) y `verify-report.md` está en UTF-8 sin BOM; contrato 6 (no repetición): en una segunda ejecución (T026), comprobar que cada `PASS` arrastrada conserva su SHA y que su área no interseca el diff — Contratos de verificación #6, #7, CNF-2, AC-3
