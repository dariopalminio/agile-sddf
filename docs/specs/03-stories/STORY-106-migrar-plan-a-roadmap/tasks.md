---
type: tasks
id: STORY-106
slug: STORY-106-migrar-plan-a-roadmap-tasks
title: "Tasks: Migrar project-plan.md a product/roadmap.md"
status: PLAN
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
story: STORY-106
design: STORY-106
created: 2026-10-07
updated: 2026-10-07
related:
  - STORY-106-migrar-plan-a-roadmap
  - STORY-106-migrar-plan-a-roadmap-design
---

<!-- Referencias -->
[[STORY-106-migrar-plan-a-roadmap]] · [[STORY-106-migrar-plan-a-roadmap-design]]

> Orden obligatorio (D-8 de `design.md`): crear `roadmap.md` → completar `objectives.md` → redirigir referencias → borrar el
> original → verificar. T011 no empieza antes de cerrar los grupos 2, 3 y 4.

## 1. Preparación — línea base

- [ ] T001 Ejecutar `node skills/memory-system/scripts/memory-system.js check --root docs` y guardar la salida en `.tmp/story-implement/STORY-106/check-before.txt`; confirmar que coincide con la línea base de `design.md` (`problemas: 55 (orphan 6 · broken-wikilink 49)`) o anotar los valores nuevos en ese archivo como referencia del contrato #11 — D-8, AC-3

## 2. Crear `docs/product/roadmap.md`

- [ ] T002 Crear `docs/product/roadmap.md` (UTF-8 sin BOM) con el frontmatter de D-4 (`type: product`, `slug: roadmap`, `title: "Roadmap del producto"`, `status: IN-PROGRESS`, `substatus: TODO`, `parent: null`, `created`/`updated` = fecha de implementación), el título `# Roadmap del producto`, la nota de cita de dos líneas de D-4 (origen con `project-plan.md`, `[[eliminar-specs-01-projects]]` y `[[objectives]]`; vigencia de foto) y el pie `Volver al mapa: [[index]].` — D-1, D-4, AC-1, CNF-2
- [ ] T003 Escribir la sección `## Épicas`: línea `Foto del <fecha>: 22 épicas. Valores copiados del frontmatter de cada epic.md.` y tabla `ID | Épica | Título | Status | Substatus` con una fila por `docs/specs/02-epics/EPIC-*/epic.md` en orden `EPIC-00`…`EPIC-21`, tomando `id`, `[[<slug declarado>]]`, `title` (sin comillas), `status` y `substatus` del frontmatter vigente; detenerse y registrarlo si algún `epic.md` carece de alguno de esos campos — D-2, F-3, AC-1, CR-001
- [ ] T004 Escribir la sección `## Plan original (2026-04-20)` después de `## Épicas`: primera línea `> Histórico. Plan de épicas aprobado el 2026-04-20; no refleja el estado actual. Las épicas vigentes están en [Épicas](#épicas).` y, debajo, `### Backlog de historias` con los 56 ítems literales de `## Backlog de Historias` de `project-plan.md`, en el mismo orden y sin corregir formato — D-1, D-3, AC-2, CNF-1, CR-003
- [ ] T005 Añadir `### Propuesta de épicas` con los 9 bloques `#### Épica 00 …` a `#### Épica 08 …` (encabezado original con un `#` más) y su cuerpo literal (`**Estado:**`, `**Objetivo:**`, historias, `**Ítems de soporte…**`, `**Mejoras sobre features existentes:**`, `**Criterios de éxito:**` e ítems), omitiendo solo los separadores `---` — D-3, AC-2, CNF-1
- [ ] T006 Añadir `### Resumen` con la tabla literal de `## Resumen` (encabezado + 11 filas, incluida `Total Features | 29`) antes del pie `Volver al mapa: [[index]].` — D-3, AC-2, CNF-1

## 3. Reubicar el objetivo en `docs/product/objectives.md`

- [ ] T007 En `## Objetivos de negocio` reemplazar `[Por completar: resultados medibles que el producto debe conseguir]` por el párrafo literal de `## Objetivo` de `project-plan.md` seguido de la línea `Origen: \`project-plan.md\` (eliminado); su plan de épicas está en [[roadmap]].`; dejar intactos `## Métricas de éxito`, `## Prioridades` y el pie; cambiar solo `updated` en el frontmatter; guardar en UTF-8 sin BOM — D-5, AC-3, CNF-1, CNF-3

## 4. Redirigir referencias y retirar el original

- [ ] T008 [P] En `docs/index.md`, localizando por contenido: eliminar la línea `- [[project-plan]] — [project-plan.md](specs/01-projects/PROJ-01-agile-sddf/project-plan.md) — Project Plan` e insertar `- [[roadmap]] — [roadmap.md](product/roadmap.md) — Roadmap del producto` entre las entradas `[[objectives]]` y `[[stakeholders]]` de `### Producto (product/)`, sin duplicarla si ya existe y sin tocar otras líneas — D-6, AC-3, CR-004
- [ ] T009 [P] En `docs/specs/01-projects/PROJ-01-agile-sddf/project.md`, por sustitución de subcadena: `  - project-plan` → `  - roadmap` en `related:`; `[[project-plan]]` → `[[roadmap]]` en la línea `<!-- Referencias -->`; `[[project-plan]] — plan de épicas y backlog` → `[[roadmap]] — roadmap de épicas y plan original (antes project-plan.md)` en `## 11. Referencias`; ninguna otra línea cambia — D-7, AC-3
- [ ] T010 Ejecutar `git rm docs/specs/01-projects/PROJ-01-agile-sddf/project-plan.md` (requiere T002–T009 completas) — D-8, AC-3

## 5. Verificación de criterios de aceptación

- [ ] T011 Crear en `.tmp/story-implement/STORY-106/` los comparadores desechables `compare-epics.js` (fila de `## Épicas` vs. frontmatter de cada `epic.md`: `id`, `[[slug]]`, `title`, `status`, `substatus`) y `compare-plan.js` (cada línea no vacía de `git show HEAD:docs/specs/01-projects/PROJ-01-agile-sddf/project-plan.md` desde `## Backlog de Historias` al final, salvo `---`, presente en `roadmap.md`, con un `#` extra en encabezados; informa conteos); no se versionan — D-2, D-3, contratos #3 y #5
- [ ] T012 [P] Verificar AC-1 (contratos #1–#4): `type: product` y `slug: roadmap` presentes; 22 filas `EPIC-00`…`EPIC-21` en orden; `compare-epics.js` → 22/22 y exit 0; `check` sin `[broken-wikilink]` en `product/roadmap.md` — AC-1
- [ ] T013 [P] Verificar AC-2 y CNF-1 (contratos #5–#6): `compare-plan.js` sin líneas faltantes, con 56 ítems de backlog, 9 `#### Épica` y 11 filas de resumen; `## Plan original (2026-04-20)` empieza con `> Histórico.` y no contiene `[[`; `## Épicas` no contiene `Épica 0` — AC-2, CNF-1
- [ ] T014 [P] Verificar AC-3 (contratos #7–#10): `## Objetivos de negocio` contiene el párrafo literal del objetivo y ningún `[Por completar`, y `grep -c "\[Por completar" docs/product/objectives.md` → `2`; `project-plan.md` no existe; `grep -rn "\[\[project-plan\]\]" docs | grep -v "docs/specs/03-stories/"` → vacío; `index.md` tiene `[[roadmap]]` una vez bajo `### Producto (product/)`; `project.md` tiene dos `[[roadmap]]` y `  - roadmap` en `related:` — AC-3
- [ ] T015 [P] Verificar "sin wikilinks rotos" (contrato #11): `memory-system check --root docs` comparado con `check-before.txt` no tiene líneas `[broken-wikilink]` ni `[orphan]` que mencionen `project-plan`, `roadmap`, `product/objectives.md`, `index.md` ni `01-projects/PROJ-01-agile-sddf/project.md`, y `problemas`/`broken-wikilink` no superan la línea base; `node scripts/check-doc-links.js` → `[OK]` — D-8, AC-3, CR-002
- [ ] T016 [P] Verificar CNF-2 y CNF-3 (contratos #12–#13): la nota de origen de `roadmap.md` contiene `project-plan.md`, `[[eliminar-specs-01-projects]]` y `[[objectives]]`; los tres primeros bytes de `roadmap.md`, `objectives.md`, `index.md` y `project.md` no son `EF BB BF`; `grep -lE "Ã|ðŸ"` sobre esos cuatro archivos → vacío — CNF-2, CNF-3
