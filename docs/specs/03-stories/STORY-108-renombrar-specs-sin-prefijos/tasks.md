---
type: tasks
id: STORY-108
slug: STORY-108-renombrar-specs-sin-prefijos-tasks
title: "Tasks: Renombrar specs/02-epics/ → specs/epics/ y specs/03-stories/ → specs/stories/"
status: PLAN
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
story: STORY-108
design: STORY-108
created: 2026-10-07
updated: 2026-10-07
related:
  - STORY-108-renombrar-specs-sin-prefijos
  - STORY-108-renombrar-specs-sin-prefijos-design
---

<!-- Referencias -->
[[STORY-108-renombrar-specs-sin-prefijos]] · [[STORY-108-renombrar-specs-sin-prefijos-design]]

> Orden obligatorio (D-9 de `design.md`): línea base → `git mv` → código → sustitución textual → índice/preflight/épica →
> verificación → `01-projects/` → commit único → reinstalar runtimes. Nada se commitea antes de T030 (CNF-1). Los artefactos
> auxiliares viven en `.tmp/story-108/` (no versionado).
>
> Tras T005 la historia vive en `docs/specs/stories/STORY-108-renombrar-specs-sin-prefijos/`: todo artefacto de la historia
> (incluido `implement-report.md`) se escribe en esa ruta (CR-004).

## 1. Preparación — precondiciones y línea base

- [ ] T001 Comprobar las precondiciones de D-1: `git status --porcelain` no lista nada fuera de `docs/specs/03-stories/STORY-108-renombrar-specs-sin-prefijos/` (si hay planning de otras historias sin commitear, detenerse y pedir al mantenedor que lo commitee); `docs/specs/epics` y `docs/specs/stories` no existen. Si algo falla, no ejecutar ningún `git mv` (F-3) — D-1, AC-1
- [ ] T002 [P] Guardar en `.tmp/story-108/baseline.txt`: número de directorios `EPIC-*` en `docs/specs/02-epics/` y `STORY-*` en `docs/specs/03-stories/`, `find <dir> -type f | wc -l` y `git ls-files <dir> | wc -l` de ambos niveles, y `find docs/specs/01-projects -type f` — D-1, AC-1, AC-3
- [ ] T003 [P] Ejecutar `npm test` y anotar en `baseline.txt` el número de pruebas y su resultado (esperado: 219 pass, exit 0); si no está en verde, detenerse — AC-2
- [ ] T004 [P] Ejecutar `node skills/memory-system/scripts/memory-system.js check --root docs` y guardar la salida en `.tmp/story-108/check-before.txt` (referencia: `problemas: 55 (orphan 6 · broken-wikilink 49)`) — D-9, CNF-2

## 2. Renombrado de directorios (`git mv`)

- [ ] T005 Ejecutar `git mv docs/specs/02-epics docs/specs/epics` y `git mv docs/specs/03-stories docs/specs/stories`. Si Windows devuelve `Permission denied`, cerrar editores sobre `docs/specs/` y reintentar; como último recurso, `git mv` por subdirectorio `EPIC-*`/`STORY-*` (F-3) — D-1, AC-1
- [ ] T006 [P] Renombrar la semilla: `git mv skills/memory-system/assets/scaffold/specs/02-epics …/specs/epics` y `…/03-stories …/specs/stories`; `…/specs/01-projects/` no se toca — D-2, AC-2
- [ ] T007 [P] Renombrar los fixtures de `memory-system`: `skills/memory-system/examples/{broken,sane,sddf,sddf-partial}/docs/specs/03-stories` → `…/stories` y `skills/memory-system/examples/epic-template-v1/docs/specs/02-epics` → `…/epics` — D-2, AC-2
- [ ] T008 [P] Renombrar los ejemplos de `header-aggregation`: `skills/header-aggregation/examples/batch/docs/specs/02-epics` → `…/epics`, `…/con-frontmatter/docs/specs/03-stories` y `…/sin-frontmatter/docs/specs/03-stories` → `…/stories` — D-2, AC-2
- [ ] T009 Verificar que no queda ningún directorio con nombre viejo fuera de `docs/specs/01-projects` y `scaffold/specs/01-projects`: `find . -path ./.git -prune -o -path ./.claude -prune -o -path ./node_modules -prune -o -type d \( -name 02-epics -o -name 03-stories \) -print` → vacío — D-1, D-2, AC-1

## 3. Código y pruebas

- [ ] T010 [P] `skills/memory-system/scripts/memory-system.js:86`: cambiar las claves de `SPECS_LAYERS` `'02-epics'`/`'03-stories'` por `epics`/`stories`; conservar `'01-projects': 'specs-projects'` y los valores `specs-epics`/`specs-stories` — D-3, AC-2, CNF-2
- [ ] T011 [P] `skills/memory-system/assets/index-template.md:62,66`: encabezados `### L2 — Épicas (specs/epics/)` y `### L1 — Historias de usuario (specs/stories/)` — D-3, CNF-2
- [ ] T012 [P] `skills/memory-system/scripts/epic-template.js:398`: reescribir el comentario como "sin hardcodear el nombre del nivel (sobrevive a renombrados del directorio de épicas)" — D-3, AC-2
- [ ] T013 [P] `scripts/migrate-finvest-field.js`: ayuda (línea 29) y defecto de `--stories-dir` (línea 69) → `docs/specs/stories` — D-3, AC-2
- [ ] T014 [P] `test/epic-template.test.js`: `EPICS` y los defaults de `docsWith`/`epicOf` → `'epics'`; aserciones `specs/02-epics/…` → `specs/epics/…`; en UT-018 sustituir `'02-epics'` por `'otro-nivel'` (título, `write` y lista esperada, reordenada alfabéticamente si cambia el orden) y `'03-stories'` por `'stories'`, manteniendo la intención de descubrir `specs/*/EPIC-*/epic.md` con cualquier nombre de nivel — D-3, AC-2
- [ ] T015 [P] `test/memory-system.test.js`: rutas `specs/03-stories/…`/`specs/02-epics/…` → `specs/stories/…`/`specs/epics/…` (líneas 157, 182, 192, 378, 469, 650-660, 696); lista de la semilla (líneas 346 y 564-566) → `['01-projects', 'epics', 'stories']` y `specs/epics/.gitkeep`, `specs/stories/.gitkeep` — D-2, D-3, AC-2
- [ ] T016 Ejecutar `npm test`; debe terminar con exit 0 y el mismo número de pruebas que la línea base antes de seguir — AC-2

## 4. Sustitución textual de referencias vivas

- [ ] T017 Construir el conjunto objetivo con el alcance de D-6 (`git grep -lE "02-epics|03-stories" -- skills agents test scripts README.md AGENTS.md docs` excluyendo `docs/specs/epics/*/**`, `docs/specs/stories/*/**`, `docs/adr/ADR-*` y `docs/specs/01-projects/**`) y guardarlo en `.tmp/story-108/targets.txt`; guardar en `.tmp/story-108/bare-lines.txt` las líneas con token no precedido por `specs/` ni `specs\` (`git grep -nE` sobre los mismos archivos). Confirmar que la lista incluye `docs/index.md`, `docs/specs/README.md`, `docs/adr/README.md` y excluye `CHANGELOG.md` — D-4, D-6, AC-2
- [ ] T018 Aplicar con `sed -i -E` sobre los archivos de `targets.txt`, en orden, R1 `specs/02-epics`→`specs/epics`, R2 `specs/03-stories`→`specs/stories`, R3 `specs\02-epics`/`specs\03-stories`→`specs\epics`/`specs\stories`, R4 `02-epics`→`epics`, R5 `03-stories`→`stories` — D-4, D-7, AC-2, CNF-3
- [ ] T019 Revisar a mano cada línea de `bare-lines.txt` tras la sustitución y corregir las que queden correctas como ruta pero incorrectas como frase (listas duplicadas, "prefijo numérico", etc.) — D-4, AC-2
- [ ] T020 [P] `docs/domains/domain-work-item-hierarchy.md`: ajustar la frase "carpetas ordenadas por nivel, con un prefijo numérico que preserva el orden lógico" (el orden lo da el nivel, no el nombre); la tabla `Segmento de carpeta | Orden` conserva `Orden` como orden lógico; `FolderSegment` lista `01-projects`, `epics`, `stories`. Sin reescribir el modelo (STORY-116) — D-5, AC-2
- [ ] T021 [P] `README.md`, tabla "Migración histórica desde 1.x": encabezado `Después (2.x+)` → `Ruta actual`; filas `docs/specs/releases/` → `docs/specs/epics/` y `docs/specs/stories/` → `docs/specs/stories/` (directorio por historia `STORY-NNN-<slug>/`); la fila de `projects` no cambia. Revisar el árbol de las líneas 232-235 — D-5, AC-2
- [ ] T022 [P] Revisar `docs/guides/flight-leves-model.md`, `docs/guides/organization-of-artifacts.md`, `docs/guides/artifact-directory-migration.md` y `skills/header-aggregation/SKILL.md:165-166` contra la tabla de D-5 (árboles, rutas Windows, búsqueda por ID, columna destino, "Para `stories/`: busca `story.md`") — D-5, AC-2
- [ ] T023 `AGENTS.md:30`: `specs/{01-projects,epics,stories}/` si `docs/specs/01-projects/` conserva archivos (según `baseline.txt` y el estado actual); `specs/{epics,stories}/` si quedará eliminada en T029 — D-5, AC-2, AC-3

## 5. `skill-preflight`, índice y EPIC-21

- [ ] T024 [P] `skills/skill-preflight/SKILL.md`, Verificación 2: la lista queda en `specs/epics/` y `specs/stories/`; quitar `specs/01-projects/` de la lista y del ejemplo del informe. `skills/skill-preflight/evals/evals.json`: contextos y `contains` con `specs/epics`/`specs/stories`; el contexto del caso de raíz personalizada deja de mencionar `specs/01-projects` — D-8, AC-2, AC-3
- [ ] T025 [P] Comprobar `docs/index.md` tras T018: `grep -cE "02-epics|03-stories" docs/index.md` = 0 y `git diff --stat docs/index.md` solo con líneas cuyas rutas cambiaron (sin cambios en `updated` ni entradas nuevas); `node skills/memory-system/scripts/memory-system.js index --root docs --dry-run` no contiene `02-epics` ni `03-stories`. No ejecutar `index` sin `--dry-run` — D-7, CNF-2
- [ ] T026 [P] En `docs/specs/epics/EPIC-21-colapsar-specs-dos-niveles/epic.md`, sustituir las dos subcadenas de la tabla de D-8 (línea de STORY-108 en `## Historias` y nota "Actualizar skills que referencian rutas de `specs/`"); no tocar frontmatter ni otras líneas — D-8, AC-3

## 6. Verificación

- [ ] T027 Verificar AC-1: conteos de directorios y archivos de `docs/specs/epics/` y `docs/specs/stories/` iguales a `baseline.txt`; `test ! -e docs/specs/02-epics && test ! -e docs/specs/03-stories`; tras `git add -A`, `git diff --cached -M --name-status -- docs/specs` muestra los movidos como `R…` sin pares `D`+`A` — Contratos 1-3, AC-1
- [ ] T028 Verificar AC-2 y CNF: comando de D-6 sin coincidencias (exit 1); `npm test` exit 0 con el mismo número de pruebas; protocolo de `skill-preflight` sobre el repo con `[OK]` para `specs/epics/` y `specs/stories/` y sin mención de `specs/01-projects/`; `memory-system check` sin aumento de `problemas` ni `broken-wikilink` respecto de `check-before.txt`; `node scripts/check-doc-links.js` → `[OK]`; `node scripts/audit-root-resolution.js` y `npm run verify:eval-inventory` → exit 0; ningún archivo modificado con BOM (`EF BB BF`) ni mojibake (`Ã`, `ðŸ`) nuevo en `git diff --cached` — Contratos 4-6, 9-12, AC-2, CNF-2, CNF-3

## 7. Cierre — `01-projects/`, commit y runtimes

- [ ] T029 Tratar `docs/specs/01-projects/`: si `find docs/specs/01-projects -type f` está vacío, eliminar el directorio residual; si no, no tocarlo (`git diff --cached --quiet -- docs/specs/01-projects`) y listar cada archivo restante en `docs/specs/stories/STORY-108-renombrar-specs-sin-prefijos/implement-report.md`. Confirmar que T023 quedó coherente con el resultado — D-8, Contrato 7, AC-3
- [ ] T030 Crear un único commit en `epic/EPIC-21-colapsar-specs-dos-niveles` con renombrados, código, pruebas, referencias, índice, preflight, EPIC-21 y artefactos de la historia; comprobar con `git show --stat HEAD` que contiene los renombrados y las ediciones, y que ningún commit anterior de la rama mueve `docs/specs/0N-…` — D-9, Contrato 8, CNF-1
- [ ] T031 Pedir confirmación al mantenedor y reinstalar los runtimes desde el repo (`node scripts/cli.js install --force` y, si usa la instalación global, `--global`) para que `story-code-review`, `story-verify` y `story-acceptance` encuentren `docs/specs/stories/STORY-108-…`; si no se reinstala, registrar en `implement-report.md` que las fases siguientes deben recibir `{story_path}` explícito — D-9, CR-004
