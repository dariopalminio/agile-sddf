---
type: tasks
id: STORY-123
slug: STORY-123-reubicar-las-secciones-restantes-de-project-md-y-eliminarlo-tasks
title: "Tasks: Reubicar las secciones restantes de project.md y eliminarlo"
status: PLAN
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
story: STORY-123
design: STORY-123
created: 2026-10-09
updated: 2026-10-09
related:
  - STORY-123-reubicar-las-secciones-restantes-de-project-md-y-eliminarlo
  - STORY-123-reubicar-las-secciones-restantes-de-project-md-y-eliminarlo-design
---

<!-- Referencias -->
[[STORY-123-reubicar-las-secciones-restantes-de-project-md-y-eliminarlo]] · [[STORY-123-reubicar-las-secciones-restantes-de-project-md-y-eliminarlo-design]]

> Orden obligatorio (D-8 de `design.md`): precondición → línea base → inventario → traslados → gate AC-3 → cierre → índice →
> verificación. Si T001 falla, la historia se detiene sin escribir nada. Los grupos 7 y 8 solo se ejecutan si el gate de T014
> no encuentra ninguna sección `SIN HOGAR`, y van en el mismo cambio que los traslados (la redirección nunca convive con `project.md`).
> Todo archivo creado o modificado se guarda en UTF-8 sin BOM. El cuerpo trasladado se copia literal: solo cambian el
> encabezado (sin prefijo numérico o con el título de destino) y su nivel (D-1).

## 1. Precondición y línea base

- [ ] T001 Verificar la precondición de AC-1: `ls docs/specs/01-projects/PROJ-01-agile-sddf/` devuelve solo `project.md`, y `grep -nE "\*\*(FR-|NFR-|US-0)" docs/specs/01-projects/PROJ-01-agile-sddf/project.md` no devuelve texto propio de §1.8, §2.1 ni §2.2 (solo los enlaces a `[[stakeholders]]` y `[[requirements-index]]` de STORY-105 AC-3); si falla, detener la historia sin escribir ningún archivo e informar qué historia de STORY-104…107 falta según el archivo que sobra o el texto que persiste — D-8 paso 1, AC-1
- [ ] T002 Ejecutar `node skills/memory-system/scripts/memory-system.js check --root docs` y guardar la salida completa en `.tmp/story-implement/STORY-123/check-before.txt`; anotar el total, el desglose `orphan`/`broken-wikilink` y el recuento de `broken-wikilink` por slug de destino, y compararlo con la línea base de `design.md` (`problemas: 56 (orphan 7 · broken-wikilink 49)`), registrando los valores nuevos si difieren — D-8 paso 2, AC-2, CR-002

## 2. Informe de reubicación e inventario

- [ ] T003 Crear `docs/specs/03-stories/STORY-123-reubicar-las-secciones-restantes-de-project-md-y-eliminarlo/reubicacion-report.md` con el frontmatter del Esquema de datos (`type: report`, `id: STORY-123`, `slug: STORY-123-reubicacion-report`, `title: "Informe de reubicación de project.md"`, `created`/`updated` = fecha de implementación), el título `# Informe de reubicación de project.md` y la sección `## Línea base` con los datos de T002 — Esquema de datos, D-8 paso 2, CNF-1
- [ ] T004 Añadir `## Secciones` al informe con la tabla de columnas `Sección de origen | Líneas | Ítems origen | Decisión | Destino (ruta › sección) | Ítems destino | Motivo` y una fila por cada sección de la tabla del Context de `design.md`, recalculando `Líneas` e `Ítems origen` sobre el `project.md` vigente: Nota de vigencia (`absorbida`), encabezados agrupadores `# 1.`…`# 4.` (`sin-contenido-propio`), §1.1 y §11 (`descartada-duplicado`, con `Motivo` que cite `domains/domain.md › Project Overview › **Nombre:**` y `docs/index.md` respectivamente), §1.8/§2.1/§2.2 (`trasladada-STORY-105`), §1.2–1.7, §2.3 y §3.1–3.4 (`reubicada-vigente`), §4.1, §12 y apéndices A y B (`reubicada-histórica`); dejar `Ítems destino` vacío hasta T013 — D-1, D-8 paso 3, AC-1, CNF-1
- [ ] T005 Comparar los encabezados `#`/`##` del `project.md` vigente con las filas de T004; para cada sección que no figure en la tabla del Context, buscarle destino con las reglas D-2…D-5 y añadir su fila, o marcarla `SIN HOGAR` con `Motivo` obligatorio si ninguna capa (`product/`, `requirements/`, `architecture/`, `domains/`) la admite ni tiene un equivalente — D-8 paso 3, AC-3

## 3. `docs/product/vision.md`: §1.2–1.7 vigente e intención de abril histórica

- [ ] T006 En `docs/product/vision.md`, antes del pie `Volver al mapa: [[index]].`, crear `## Intención original (2026-04-20)` y mover allí, íntegro y en ese orden, el texto que STORY-104 trasladó de `project-intent.md` bajo `### Definición del Problema`, `### Visión (elevator pitch)`, `### Beneficios Clave`, `### Criterios de Éxito`, `### Restricciones` y `### Fuera de alcance (Non-Goals)`, con la línea `Registro histórico: no describe el estado actual.`; si algún encabezado de STORY-104 D-1 no existe, crearlo con el título de su diseño y anotarlo en el informe — D-2, D-3, AC-1, CNF-1
- [ ] T007 Insertar la nota de D-2 (`> Trasladado desde project.md §1.2–1.7 (revisión 2026-08-30, PROJ-01, eliminado) por STORY-123 — [[eliminar-specs-01-projects]].`) a continuación de la nota de STORY-104, que se conserva, y rellenar las secciones vigentes con el cuerpo literal de `project.md`: `## Problema que resolvemos` ← §1.2 (2 párrafos), `### Visión (elevator pitch)` ← §1.3 (7 ítems), `### Beneficios clave` ← §1.4 (6 ítems), `## Criterios de éxito` ← §1.5 (10 ítems, casillas `[x]`/`[ ]` y evidencias tal cual), `### Restricciones` ← §1.6 (3 ítems), `### Fuera de alcance (Non-Goals)` ← §1.7 (7 ítems); cambiar solo `updated` en el frontmatter (`type: product` y `slug: vision` intactos) — D-2, D-3, AC-1, CNF-1, CR-001

## 4. `docs/architecture/ux-ui.md` (nuevo) e índice de arquitectura

- [ ] T008 Crear `docs/architecture/ux-ui.md` con el frontmatter de D-4 (`type: architecture`, `id: ARCH-UX-UI`, `slug: ux-ui`, `title: "Experiencia de usuario e interfaz del framework SDDF"`, `status: active`, `created`/`updated`), el título `# Experiencia de usuario e interfaz del framework SDDF`, la nota de D-2 para §2.3 y §3.1–3.4 y, literales, `## Experiencia de usuario (UX) y Diseño de Interfaz (UI)` ← §2.3 (párrafo + 9 ítems), `## Design Vibe` ← §3.1, `## Visual Inspiration` ← §3.2, `## Mapas de Navegación` ← §3.3 (párrafo + árbol en bloque ``` literal) y `## Wireframe ASCII (Box Drawing)` ← §3.4, cerrando con `## Referencias` y `[[sddf-architecture]] · [[state-machine]] · [[tech-stack]]` — D-1, D-2, D-4, AC-1, CNF-1
- [ ] T009 En `docs/architecture/README.md`, añadir a la tabla "Índice de documentos" la fila `[[ux-ui]] — [ux-ui.md](ux-ui.md)` | `ARCH-UX-UI` | "Interacción conversacional, patrones de UX y mapa de invocación de skills", y la línea `├── ux-ui.md ← cómo se usa` en el árbol "Cómo se relacionan"; ninguna otra línea cambia — D-4, AC-1

## 5. Anexos históricos en `tech-stack.md`, `domain.md` y `roadmap.md`

- [ ] T010 [P] En `docs/architecture/tech-stack.md`, añadir después de `## 8. Referencias` la sección `## Anexo — Stack según project.md (2026-08-30)` con la nota de D-2 más `Registro histórico: no describe el estado actual.` y, literales, la tabla de 15 filas de §4.1 y los bloques `**Patrón arquitectónico.**`, `**Modelo de delegación.**` (con su árbol), `**Agentes.**` y `**Frontera core / extensión.**`; actualizar solo `updated` — D-2, D-5, AC-1, CNF-1
- [ ] T011 [P] En `docs/domains/domain.md`, añadir al final de `## Terminology Glossary` el subapartado `### Glosario detallado (project.md, 2026-08-30)` con la nota de D-2 histórica y la tabla literal de los 39 términos de §12; sustituir en la línea "Fuentes de inicio" (hoy `domain.md:34`) solo `` `docs/specs/01-projects/PROJ-01-agile-sddf/project.md` `` por `` `docs/product/`, `docs/requirements/` ``; actualizar solo `updated` — D-2, D-5, AC-1, CNF-1
- [ ] T012 [P] En `docs/product/roadmap.md`, añadir después de `## Plan original (2026-04-20)` la sección `## Estado de implementación (2026-08-30)` (nota de D-2 histórica + cita de origen del Apéndice A, con `### Épicas (19)`, `### Historias (77 con story.md, en 79 directorios)` y `### Superficie del framework`, tablas y 3 párrafos literales) y, a continuación, `## Brechas y deuda conocida (2026-08-30)` (nota de D-2 histórica + cita del Apéndice B y los 9 ítems numerados literales), ambas antes del pie `Volver al mapa: [[index]].`; si `## Plan original (2026-04-20)` no existe, crear las secciones al final y anotarlo en el informe; actualizar solo `updated` — D-2, D-5, AC-1, CNF-1
- [ ] T013 Recontar los ítems de cada sección reubicada en el origen (`git show HEAD:docs/specs/01-projects/PROJ-01-agile-sddf/project.md`) y en su destino (ítems `- `, filas `| ` y párrafos, con `grep -c` sobre el rango de la sección) y completar la columna `Ítems destino` del informe; cualquier diferencia se corrige en el destino antes de continuar (requiere T006–T012) — D-8 paso 4, V-3, CNF-1

## 6. Gate de sección sin hogar

- [ ] T014 Revisar la columna `Decisión` del informe: si alguna fila es `SIN HOGAR`, reemplazar en `project.md` el texto de cada sección ya trasladada por una línea de enlace a su destino (patrón de STORY-105 AC-3), dejar intactas las secciones `SIN HOGAR`, añadir al informe `## Pendiente de decisión del PO` con la lista de esas secciones, y omitir los grupos 7 y 8 (no se borra nada, no se crea la redirección ni se regenera el índice); si no hay ninguna, continuar con el grupo 7 — D-8 paso 5, F-2, AC-3

## 7. Cierre: redirección, borrados y punteros

- [ ] T015 Crear `docs/product/proj-01-agile-sddf.md` con frontmatter `type: product`, `slug: PROJ-01-agile-sddf`, `title: "Redirección: especificación de proyecto PROJ-01 (project.md, retirado)"`, `created`/`updated`, y un cuerpo que sea **solo** la tabla `Sección antigua | Hogar actual` (sin `#`, párrafos ni pie) con 20 filas en orden §1.1, §1.2…§1.7, §1.8, §2.1, §2.2, §2.3, §3.1…§3.4, §4.1, §11, §12, Apéndice A, Apéndice B; cada celda "Hogar actual" lleva exactamente un wikilink sin ancla seguido de `›` y el título de destino (p. ej. `[[vision]] › Criterios de éxito`, `[[ux-ui]] › Mapas de Navegación`, `[[tech-stack]] › Anexo — Stack según project.md (2026-08-30)`, `[[domain]] › Glosario detallado (project.md, 2026-08-30)`, `[[roadmap]] › Brechas y deuda conocida (2026-08-30)`, `[[stakeholders]] › Usuarios y roles`, `[[requirements-index]]`, §1.1 → `[[domain]] › Project Overview`, §11 → `[[index]]`) — D-6, AC-2
- [ ] T016 Ejecutar `git rm docs/specs/01-projects/PROJ-01-agile-sddf/project.md` y eliminar las carpetas vacías `PROJ-01-agile-sddf/` y `docs/specs/01-projects/` (requiere T015 en el mismo cambio) — D-8 paso 6a, AC-1
- [ ] T017 [P] Ejecutar `git rm docs/runbooks/actualizar-spec-de-proyecto.md`; no tocar `runbooks/README.md` (no lo lista) ni `CHANGELOG.md:230` (historial) — D-7, AC-2
- [ ] T018 [P] En `AGENTS.md` (línea 13), sustituir solo el paréntesis `` (ver `docs/specs/01-projects/PROJ-01-agile-sddf/`) `` por `` (ver `docs/specs/02-epics/` y `docs/specs/03-stories/`) ``, sin cambiar el resto de la frase — D-7, AC-1

## 8. Regeneración del índice

- [ ] T019 Ejecutar `node skills/memory-system/scripts/memory-system.js index --root docs` y revisar el diff de `docs/index.md`: deben desaparecer las entradas de `project.md` y de `[[runbook-actualizar-spec-de-proyecto]]` y aparecer `[[PROJ-01-agile-sddf]]` bajo `product/` y `[[ux-ui]]` bajo `architecture/`; registrar en el informe el diff ajeno que arrastre la regeneración (incluida la entrada inválida de `STORY-103-…/epic-template.md`) y la sección vacía `### L3 — Proyecto (specs/01-projects/)` como defecto del template para STORY-115, sin corregirlos — D-7, D-8 paso 7, AC-2

## 9. Verificación de criterios de aceptación

- [ ] T020 [P] Verificar AC-1 (V-1) y AC-2 (V-6): `test ! -e docs/specs/01-projects` y `test ! -e docs/runbooks/actualizar-spec-de-proyecto.md` terminan con éxito — AC-1, AC-2
- [ ] T021 [P] Verificar AC-1 y CNF-1 (V-2, V-3): cada sección de origen de la tabla del Context tiene fila en `## Secciones` con decisión y destino o motivo, ninguna fila es `SIN HOGAR`, los descartes citan dónde vive el contenido y `Ítems origen` = `Ítems destino` en cada sección reubicada — AC-1, CNF-1
- [ ] T022 [P] Verificar AC-2 (V-4, V-5): `grep -rl "^slug: PROJ-01-agile-sddf$" docs` devuelve solo `docs/product/proj-01-agile-sddf.md`; fuera del frontmatter toda línea no vacía de ese archivo empieza por `|`, y cada fila de datos tiene `grep -o "\[\[" | wc -l` = 1 — AC-2
- [ ] T023 [P] Verificar AC-2 (V-7): ejecutar `memory-system check --root docs`, guardar la salida en `.tmp/story-implement/STORY-123/check-after.txt` y confirmar 0 líneas `broken-wikilink` con destino `[[PROJ-01-agile-sddf]]` o `[[runbook-actualizar-spec-de-proyecto]]` o con ruta `product/vision.md`, `product/roadmap.md`, `product/proj-01-agile-sddf.md`, `architecture/ux-ui.md`, `architecture/tech-stack.md` o `domains/domain.md`, y que el total de `broken-wikilink` no supera la línea base de T002 (≤ 49) — AC-2, CR-002
- [ ] T024 [P] Verificar AC-3 (V-8): revisar que el procedimiento de T014 (D-8 paso 5) conserva `project.md`, reemplaza las secciones trasladadas por enlaces y lista las `SIN HOGAR` en `## Pendiente de decisión del PO`, sin forzar el escenario en el repositorio real — AC-3
- [ ] T025 [P] Verificar codificación (V-9): los tres primeros bytes de `vision.md`, `roadmap.md`, `proj-01-agile-sddf.md`, `ux-ui.md`, `architecture/README.md`, `tech-stack.md`, `domain.md`, `index.md`, `AGENTS.md` y `reubicacion-report.md` no son `EF BB BF`, y `grep -lE "Ã|ðŸ"` sobre esos archivos devuelve vacío — CNF-1
- [ ] T026 Añadir al informe `## Verificación final` con el resultado de V-1…V-9 (T020–T025) y la comparación de `check-after.txt` frente a `check-before.txt` (total y `broken-wikilink` por destino), más el diff ajeno de `index.md` registrado en T019 (requiere T020–T025) — D-8 paso 8, AC-1, AC-2, CNF-1
