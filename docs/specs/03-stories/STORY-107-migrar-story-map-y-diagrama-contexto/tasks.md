---
type: tasks
id: STORY-107
slug: STORY-107-migrar-story-map-y-diagrama-contexto-tasks
title: "Tasks: Migrar story-map.md y context-diagram.puml"
status: PLAN
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
story: STORY-107
design: STORY-107
created: 2026-10-07
updated: 2026-10-07
related:
  - STORY-107-migrar-story-map-y-diagrama-contexto
  - STORY-107-migrar-story-map-y-diagrama-contexto-design
---

<!-- Referencias -->
[[STORY-107-migrar-story-map-y-diagrama-contexto]] · [[STORY-107-migrar-story-map-y-diagrama-contexto-design]]

> Orden obligatorio (D-5 de `design.md`): línea base → comprobar diagramas → mover el story map → reubicar la entrada del índice →
> borrar la copia del diagrama → alinear EPIC-21 → verificar. El grupo 5 no empieza antes de cerrar los grupos 2, 3 y 4.

## 1. Preparación — línea base y precondiciones

- [ ] T001 Ejecutar `node skills/memory-system/scripts/memory-system.js check --root docs` y guardar la salida en `.tmp/story-implement/STORY-107/check-before.txt`; confirmar que coincide con la línea base de `design.md` (`problemas: 55 (orphan 6 · broken-wikilink 49)`) o anotar los valores nuevos como referencia del contrato #9 — D-5, AC-3
- [ ] T002 [P] Comprobar las precondiciones de AC-1: `docs/specs/01-projects/PROJ-01-agile-sddf/story-map.md` existe y declara `slug: story-map`, y `docs/product/story-map.md` no existe. Si el destino ya existe, detenerse sin sobrescribir y registrarlo en `implement-report.md` (F-3) — D-1, AC-1
- [ ] T003 [P] Comprobar la precondición de AC-2: `git diff --no-index --quiet docs/specs/01-projects/PROJ-01-agile-sddf/context-diagram.puml docs/architecture/c4/context-diagram.puml` → exit 0. Si difieren, detenerse sin borrar nada, registrar la diferencia en `implement-report.md` y pedir decisión al mantenedor (F-3) — D-2, AC-2

## 2. Mover el story map a `docs/product/`

- [ ] T004 Ejecutar `git mv docs/specs/01-projects/PROJ-01-agile-sddf/story-map.md docs/product/story-map.md` — D-1, AC-1
- [ ] T005 En `docs/product/story-map.md`, reemplazar la línea de frontmatter `type: wiki` por `type: product` sin tocar ninguna otra línea (`slug`, `title`, `date`, `status`, `substatus`, `parent`, `related` y todo el cuerpo, incluido `[[PROJ-01-agile-sddf]]`), conservando UTF-8 sin BOM y el fin de línea del archivo — D-1, AC-1, CNF-1, CNF-2

## 3. Reubicar la entrada `[[story-map]]` en `docs/index.md`

- [ ] T006 En `docs/index.md`, localizar por contenido y eliminar la línea `- [[story-map]] — [story-map.md](specs/01-projects/PROJ-01-agile-sddf/story-map.md) — Story Map — Agile SDDF (Spec-Driven Development Framework)` (bajo `### L3 — Proyecto`) — D-3, AC-3
- [ ] T007 En `### Producto (product/)` de `docs/index.md`, insertar `- [[story-map]] — [story-map.md](product/story-map.md) — Story Map — Agile SDDF (Spec-Driven Development Framework)` inmediatamente después de la entrada `[[stakeholders]]` y antes de `[[vision]]`; si la entrada con ruta `product/story-map.md` ya existe (índice regenerado por otra historia), no duplicarla. No tocar ninguna otra línea del índice — D-3, AC-3, CNF-2

## 4. Diagrama de contexto y alineación de EPIC-21

- [ ] T008 Ejecutar `git rm docs/specs/01-projects/PROJ-01-agile-sddf/context-diagram.puml` (solo si T003 pasó); no tocar `docs/architecture/c4/` ni `docs/architecture/README.md` — D-2, AC-2
- [ ] T009 [P] En `docs/specs/02-epics/EPIC-21-colapsar-specs-dos-niveles/epic.md`, línea de STORY-107 en `## Historias`: sustituir la subcadena `` `context-diagram.puml` a `docs/architecture/context-diagram.puml` `` por `` `context-diagram.puml` a `docs/architecture/c4/context-diagram.puml` `` — D-4, AC-2, CR-001
- [ ] T010 [P] En el mismo `epic.md`, `## Criterios de salida`: sustituir la subcadena `` `docs/architecture/` contiene `context-diagram.puml`. `` por `` `docs/architecture/c4/` contiene `context-diagram.puml` y su render `context-diagram.png`. ``, sin marcar la casilla ni cambiar el frontmatter (`status`, `updated`) — D-4, AC-2, CR-001

## 5. Verificación de los criterios de aceptación

- [ ] T011 [P] Verificar AC-1 (contratos #1–#3): `docs/product/story-map.md` existe; `grep -E "^(type: product|slug: story-map)$"` sobre su contenido sin `\r` → 2 líneas; `diff` entre `git show HEAD:docs/specs/01-projects/PROJ-01-agile-sddf/story-map.md` y el archivo nuevo, ambos normalizados a LF, muestra un único cambio (`type: wiki` → `type: product`); el original no existe y `git status` lo muestra como renombrado — AC-1, CNF-1
- [ ] T012 [P] Verificar AC-2 (contratos #4–#6 y #10): `test ! -e docs/specs/01-projects/PROJ-01-agile-sddf/context-diagram.puml`; `git diff --quiet HEAD -- docs/architecture/c4/` y `git status --porcelain docs/architecture/c4/` vacío; `test ! -e docs/architecture/context-diagram.puml`; en `epic.md`, `grep -c "docs/architecture/context-diagram.puml"` → `0` y `grep -c "docs/architecture/c4/"` → `2` — AC-2
- [ ] T013 [P] Verificar AC-3 (contratos #7–#8): `grep -rln "^slug: story-map" docs`, excluido `docs/specs/03-stories/`, → solo `docs/product/story-map.md`; `docs/index.md` contiene una sola línea con `[[story-map]]`, con enlace `(product/story-map.md)` y dentro de `### Producto (product/)`; `grep -c "specs/01-projects/PROJ-01-agile-sddf/story-map.md" docs/index.md` → `0` — AC-3
- [ ] T014 Verificar AC-3 (contrato #9): ejecutar `memory-system check --root docs` y comparar con `check-before.txt` según D-5 (ninguna línea `[broken-wikilink]`, `[orphan]` ni `[invalid-frontmatter]` menciona `story-map`, `product/story-map.md`, `index.md` ni `01-projects/PROJ-01-agile-sddf/project.md`; `problemas` y `broken-wikilink` no superan la línea base); ejecutar `node scripts/check-doc-links.js` → `[OK]` — AC-3
- [ ] T015 [P] Verificar CNF-2 (contrato #11): los primeros 3 bytes de `docs/product/story-map.md`, `docs/index.md` y `epic.md` de EPIC-21 ≠ `EF BB BF`; `grep -lE "Ã|ðŸ"` sobre los tres → vacío — CNF-2
- [ ] T016 Revisar `git status`: los únicos cambios son el renombrado del story map, el borrado de `PROJ-01-agile-sddf/context-diagram.puml`, `docs/index.md` y `epic.md` de EPIC-21 (más los artefactos de STORY-107); registrar resultados y CR pendientes (CR-001, CR-002) en `implement-report.md` — AC-1, AC-2, AC-3
