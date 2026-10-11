---
type: tasks
id: STORY-105
slug: STORY-105-migrar-stakeholders-y-requisitos-tasks
title: "Tasks: Migrar project.md a product/stakeholders.md y requirements/"
status: PLAN
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
story: STORY-105
design: STORY-105
created: 2026-10-07
updated: 2026-10-07
related:
  - STORY-105-migrar-stakeholders-y-requisitos
  - STORY-105-migrar-stakeholders-y-requisitos-design
---

<!-- Referencias -->
[[STORY-105-migrar-stakeholders-y-requisitos]] · [[STORY-105-migrar-stakeholders-y-requisitos-design]]

> Orden obligatorio (D-9 de `design.md`): `project.md` (T008) se edita solo después de verificar el contenido en su nuevo hogar
> (T004). Los scripts de `.tmp/story-implement/STORY-105/` son desechables y no se versionan.

## 1. Preparación — línea base

- [x] T001 Ejecutar `node skills/memory-system/scripts/memory-system.js check --root docs` y guardar la salida en `.tmp/story-implement/STORY-105/check-before.txt`; confirmar que no hay ninguna línea con path `product/` ni `requirements/` — D-9, AC-3

## 2. Migración de requisitos (FR/NFR)

- [x] T002 Crear `.tmp/story-implement/STORY-105/migrate-requirements.js`: parsea `## 2.1`/`## 2.2` de `project.md` (ítems `- **ID**: título`, campos `    - **Campo**:`, continuaciones de 6 espacios, categoría = `###` contenedor), aplica la regla de slug de D-3 y escribe cada archivo con el frontmatter y los bloques de cuerpo de D-2 (FR: `Descripción` + `Atributos` con Prioridad/Usuario/Fuente/Categoría de origen; NFR: `Descripción` + `Criterios de verificación` + `Atributos` con Prioridad/Categoría de origen) en UTF-8 sin BOM; aborta sin escribir ante un conjunto de campos inesperado, una línea fuera de patrón, un ID duplicado o un destino ya existente — D-2, D-3, D-4, AC-2, CNF-1, CNF-3
- [x] T003 Ejecutar el migrador y comprobar que crea `docs/requirements/functional/` con 53 archivos `FR-NNN-<slug>.md` y `docs/requirements/non-functional/` con 24 archivos `NFR-NNN-<slug>.md`, sin `FR-049-*` — D-1, D-4, AC-2
- [x] T004 Crear `.tmp/story-implement/STORY-105/verify-requirements.js` (independiente del migrador, sin reutilizar su parser) y ejecutarlo: para cada ID de origen verifica prefijo de archivo = `id` = ID del `#` (contrato #4), título y campos literales tras quitar prefijo y sangría (contrato #5) y `Categoría de origen` = `###` contenedor (contrato #6); exit 0 solo si los 77 pasan — D-4, AC-2, CNF-1

## 3. Perfiles de usuario en `docs/product/stakeholders.md`

- [x] T005 [P] Sustituir el marcador de `## Usuarios y roles` por el bloque literal de las líneas 127–159 de `project.md` (US-001…US-006 con su `**Descripción**`), dejar intactos los marcadores de `## Patrocinadores y decisores` e `## Intereses y conflictos` y el pie `Volver al mapa: [[index]].`; cambiar solo `updated` en el frontmatter — D-5, AC-1, CNF-1

## 4. Índice de requisitos en `docs/requirements/README.md`

- [x] T006 [P] Añadir al final del README la sección `## Índice de requisitos` con la línea de procedencia (`… por [[eliminar-specs-01-projects]]; el hueco FR-049 se conserva.`), la nota "Convención de fuente" de §2.1 literal, y `### Requisitos funcionales` / `### Requisitos no funcionales` con una `####` por cada una de las 19 categorías de origen y una línea `- [[<slug>]] — <título>` por requisito en orden de ID (puede generarse desde el inventario de T002); no tocar el resto del README salvo `updated` — D-6, CNF-2

## 5. Sustitución en `project.md`

- [x] T007 Comprobar que T004 terminó con exit 0 y que T005 y T006 están hechas antes de editar `project.md` — D-9, AC-3
- [x] T008 En `docs/specs/01-projects/PROJ-01-agile-sddf/project.md`, localizando por encabezado (no por número de línea), reemplazar el contenido de `## 1.8. Características de los Usuarios`, `## 2.1 Requisitos Funcionales` (incluida la nota "Convención de fuente" y las 9 subsecciones) y `## 2.2. Requisitos No Funcionales` (10 subsecciones) por la línea correspondiente de la tabla de D-7, conservando esos encabezados, `# 2. Requisitos`, `## 2.3.` en adelante y cambiando solo `updated` en el frontmatter — D-7, AC-3

## 6. Índice global

- [x] T009 En `docs/specs/03-stories/STORY-103-replace-the-epic-template/epic-template.md` eliminar solo los comentarios `# escritor: …` en línea del bloque de frontmatter (valores y cuerpo idénticos a HEAD) — D-8, CR-003
- [x] T010 Regenerar `docs/index.md` con `node skills/memory-system/scripts/memory-system.js index --root docs` y revisar el diff: altas de los 77 requisitos y del estado real de specs, sin entradas `[[<…>` ni con `#` en el slug — D-8, CNF-2

## 7. Verificación de criterios de aceptación

- [x] T011 [P] Verificar AC-1 (contratos #1–#2): `Usuarios y roles` coincide con las líneas 127–159 de `git show HEAD:docs/specs/01-projects/PROJ-01-agile-sddf/project.md` y contiene 6 líneas `- **US-00[1-6]**`; `grep -c "\[Por completar" docs/product/stakeholders.md` → `2` — AC-1
- [x] T012 [P] Verificar AC-2 (contratos #3–#6): recuentos 53/24, ausencia de `FR-049-*` y re-ejecución de `verify-requirements.js` contra `git show HEAD:` con exit 0 — AC-2, CNF-1
- [x] T013 [P] Verificar AC-3 (contratos #7–#9): `grep -cE "^- \*\*(N?FR|US)-[0-9]{3}\*\*" project.md` → `0`; `project.md` contiene `[[stakeholders]]` (1) y `[[requirements-index]]` (2); `memory-system check --root docs` sin líneas con path `product/` o `requirements/` y total ≤ `check-before.txt` — AC-3
- [x] T014 [P] Verificar CNF-2 (contratos #10–#11 y #13): el README tiene 77 wikilinks de requisito bajo 19 subsecciones de categoría, todos resolubles; `docs/index.md` lista los 77 requisitos y `[[stakeholders]]`; `node scripts/check-doc-links.js` → `[OK]`; el frontmatter del borrador de STORY-103 no contiene `#` y sus valores coinciden con HEAD — CNF-2, D-8
- [x] T015 [P] Verificar CNF-3 (contrato #12): ninguno de los 77 archivos nuevos ni de los 5 modificados (`stakeholders.md`, `README.md`, `project.md`, `index.md`, `epic-template.md` de STORY-103) empieza por `EF BB BF`, y `grep -lE "Ã|ðŸ"` sobre ellos devuelve vacío — CNF-3
