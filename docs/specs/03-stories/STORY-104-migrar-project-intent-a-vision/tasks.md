---
type: tasks
id: STORY-104
slug: STORY-104-migrar-project-intent-a-vision-tasks
title: "Tasks: Migrar project-intent.md a product/vision.md"
status: PLAN
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
story: STORY-104
design: STORY-104
created: 2026-10-07
updated: 2026-10-07
related:
  - STORY-104-migrar-project-intent-a-vision
  - STORY-104-migrar-project-intent-a-vision-design
---

<!-- Referencias -->
[[STORY-104-migrar-project-intent-a-vision]] · [[STORY-104-migrar-project-intent-a-vision-design]]

> Orden obligatorio (D-6 de `design.md`): consolidar `vision.md` → redirigir referencias → borrar el original → verificar.
> Ninguna tarea del grupo 4 empieza antes de cerrar los grupos 2 y 3.

## 1. Preparación — línea base

- [ ] T001 Ejecutar `node skills/memory-system/scripts/memory-system.js check --root docs` y guardar la salida en `.tmp/story-implement/STORY-104/check-before.txt`; confirmar que coincide con la línea base de `design.md` (`problemas: 55 (orphan 6 · broken-wikilink 49)`) o, si difiere, anotar los nuevos valores en ese archivo como referencia del contrato #9 — D-6, AC-3

## 2. Consolidar la visión en `docs/product/vision.md`

- [ ] T002 Editar el frontmatter de `docs/product/vision.md`: cambiar solo `updated` a la fecha de implementación, sin tocar `type: product`, `slug: vision`, `title`, `status`, `substatus`, `parent` ni `created`; insertar bajo `# Visión del producto` la nota `> Consolidada desde \`project-intent.md\` (PROJ-01, eliminado) por [[eliminar-specs-01-projects]].` (slug real del ADR, no `ADR-0013-…`) — D-2, AC-1, CNF-1
- [ ] T003 Reemplazar el marcador de `## Problema que resolvemos` por los dos párrafos literales de `Definición del Problema` de `project-intent.md` — D-1, AC-1
- [ ] T004 Reemplazar el marcador de `## Propuesta de valor` por las subsecciones `### Visión (elevator pitch)` (siete ítems literales, incluidos los dos `**Nuestro producto:**`) y `### Beneficios clave` (cuatro ítems literales) — D-1, AC-1
- [ ] T005 Insertar la sección nueva `## Criterios de éxito` entre `Propuesta de valor` y `Alcance y límites`, con los tres ítems literales de `Criterios de Éxito` conservando la casilla `- [ ]` — D-1, AC-2
- [ ] T006 Reemplazar el marcador de `## Alcance y límites` por `### Restricciones` (ítems `Technical`, `Time`, `Resources`, literales) y `### Fuera de alcance (Non-Goals)` (seis ítems literales con su marca `[inferido]`); conservar el pie `Volver al mapa: [[index]].` y guardar el archivo en UTF-8 sin BOM — D-1, D-2, AC-1, AC-2, CNF-2

## 3. Redirigir las referencias al nodo que se elimina

- [ ] T007 [P] En `docs/index.md` eliminar solo la línea 75 (`- [[PROJ-01-agile-sddf-project-intent]] — [project-intent.md](…) — Project Intent: …`), sin regenerar el índice ni tocar `updated`, la tabla `Estado del grafo` ni otras entradas; comprobar que la entrada `- [[vision]] — [vision.md](product/vision.md) — Visión del producto` sigue presente en `### Producto (product/)` — D-3, AC-3
- [ ] T008 [P] En `docs/specs/01-projects/PROJ-01-agile-sddf/project.md` cambiar `- PROJ-01-agile-sddf-project-intent` por `- vision` en `related:` (línea 12), `[[PROJ-01-agile-sddf-project-intent]]` por `[[vision]]` en la línea `<!-- Referencias -->` (línea 18) y la entrada de `## 11. Referencias` (línea 1105) por `- [[vision]] — visión del producto (antes project-intent.md)`; no modificar ninguna otra línea — D-4, AC-3
- [ ] T009 [P] En `AGENTS.md:13` reemplazar solo el fragmento `` `docs/specs/01-projects/PROJ-01-agile-sddf/project-intent.md` `` por `` `docs/product/vision.md` `` dentro de "La visión de producto completa vive en …", sin alterar el resto del párrafo — D-5, CR-003

## 4. Retirar el original

- [ ] T010 Ejecutar `git rm docs/specs/01-projects/PROJ-01-agile-sddf/project-intent.md` (requiere T002–T009 completas) — D-6, AC-3

## 5. Verificación de criterios de aceptación

- [ ] T011 [P] Verificar AC-1 (contratos #1–#3 de `design.md`): `grep -c "\[Por completar" docs/product/vision.md` devuelve `0`; `type: product` y `slug: vision` presentes; existen los encabezados `## Problema que resolvemos`, `### Visión (elevator pitch)`, `### Beneficios clave`, `## Criterios de éxito`, `### Restricciones` y `### Fuera de alcance (Non-Goals)` — AC-1
- [ ] T012 [P] Verificar AC-2 (contratos #4–#5): comparar cada párrafo e ítem de las seis secciones de `git show HEAD:docs/specs/01-projects/PROJ-01-agile-sddf/project-intent.md` contra `vision.md` y confirmar que aparecen literales (2 párrafos + 7 + 4 + 3 + 3 + 6 ítems) y que `## Criterios de éxito` contiene exactamente los tres criterios — AC-2
- [ ] T013 [P] Verificar AC-3 (contratos #6–#8): `project-intent.md` no existe; `grep -rn "\[\[PROJ-01-agile-sddf-project-intent\]\]" docs | grep -v "docs/specs/03-stories/"` devuelve vacío; `project.md` contiene dos `[[vision]]` y `- vision` en `related:`; `index.md` conserva `[[vision]]` — AC-3
- [ ] T014 [P] Verificar "sin wikilinks rotos" (contratos #9–#10): ejecutar `memory-system check --root docs`, compararlo con `.tmp/story-implement/STORY-104/check-before.txt` y confirmar que ninguna línea `[broken-wikilink]` menciona `PROJ-01-agile-sddf-project-intent`, `product/vision.md`, `index.md` ni `01-projects/PROJ-01-agile-sddf/project.md`, y que `problemas` y `broken-wikilink` no superan la línea base; `node scripts/check-doc-links.js` termina en `[OK]` — D-6, AC-3
- [ ] T015 [P] Verificar CNF-1, CNF-2 y el puntero raíz (contratos #11–#13): `vision.md` contiene la nota con `project-intent.md` y `[[eliminar-specs-01-projects]]`; sus tres primeros bytes no son `EF BB BF`; `grep -cE "Ã|ðŸ" docs/product/vision.md` devuelve `0`; `grep -n "project-intent.md" AGENTS.md` devuelve vacío y `AGENTS.md` menciona `docs/product/vision.md` — CNF-1, CNF-2, D-5
