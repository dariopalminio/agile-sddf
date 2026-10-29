---
alwaysApply: false
type: tasks
id: STORY-174
slug: STORY-174-corregir-referencias-obsoletas-tras-split-tasks
title: "Tasks: Skill epic-refine: corregir referencias obsoletas tras un split"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-23-completar-flujo-de-epic
story: STORY-174
design: STORY-174
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-174-corregir-referencias-obsoletas-tras-split
---

<!-- Referencias -->
[[STORY-174-corregir-referencias-obsoletas-tras-split]]

## 1. Precondición

- [ ] T001 Verificar que STORY-165 está implementada: existen `skills/epic-refine/SKILL.md` con el Paso 3 de extracción de `H-NNN`, la tabla de enrutamiento código → tratamiento y el plan `C-NN │ Origen │ …`, `references/mad-corrections.md`, `assets/epic-refine-report-template.md` y `evals/evals.json`; si falta alguno, detener y reportar la dependencia (CR-004). Anotar la versión actual de `evals.json` y el último `TC-NNN` (STORY-173 puede haber añadido TC-009…TC-013) // CS-12

## 2. SKILL.md (componente central, vía `skill-master`)

- [ ] T002 Invocar `skill-master` para modificar `skills/epic-refine/` (nunca los destinos de runtime); las tareas T003–T005 son las ediciones que se le piden (D-1, nota de la historia) // CS-12
- [ ] T003 En el Paso 3 de `skills/epic-refine/SKILL.md`, añadir tras la extracción de los `H-NNN` la sub-sección «Detección COH» (≤ 10 líneas): solo con `verdict: NEEDS-REFINEMENT`, leer `references/coh-corrections.md` (ausente → `❌ Catálogo references/coh-corrections.md no encontrado` antes de escribir), aplicar la detección y añadir los `COH-<n>` como origen propio que los Pasos 4–9 tratan igual que los `H-NNN` (D-1, F-5) // AC-1, AC-2, CNF-3
- [ ] T004 En la tabla de enrutamiento del `SKILL.md`, añadir la fila `COH · Reemplazo del slug por el del único directorio con el mismo ID · PO en los casos de D-5 · coh-corrections.md`; en «Qué NO hace», añadir que `epic-refine` no ejecuta `/story-split` ni detecta historias a dividir (los hallazgos que lo requieran quedan «fuera de alcance · PO» con su Acción sugerida) (D-1, D-7, CR-002) // AC-1, AC-2
- [ ] T005 Actualizar la `description` del `SKILL.md` añadiendo «y corrige referencias a slugs obsoletos tras un /story-split» (y el disparador «referencias obsoletas tras split»), comprobando que sigue ≤ 500 caracteres (D-1) // CNF-3

## 3. Catálogo COH, template del reporte y ficha

- [ ] T006 [P] Crear `skills/epic-refine/references/coh-corrections.md` con la detección: ámbito (líneas F2/F3 de nivel superior de la sección de clave `historias` de `epic.md`, texto completo; entradas de `related` de los `story.md` **activos** del universo de la épica, normalizadas como en `epic-analyze` Paso 5c.2; las archivadas no se leen); forma del slug `STORY-<≥3 dígitos>-<segmentos [a-z0-9]+>` con límite de token (no son candidatos `STORY-NNN` sin slug, `EPIC-NN-<slug>` ni el token `**STORY-NNN**`); existencia por nombre exacto `specs/flow/<slug>/` o `specs/flow/archive/<YYYY-MM-DD>-<slug>/` (D-2) // AC-1, AC-2, CNF-3
- [ ] T007 En `coh-corrections.md`, añadir la exclusión y numeración: no es COH el valor que el reporte lista como MAD-02 para la misma historia; COH sobre una línea que elimina un `C-NN` de INT-03 → «ya resuelto» con nota `línea eliminada por C-NN`; un COH por `(línea, slug)` en el índice y por `(historia, valor)` en `related`; orden `epic.md` por línea, después `story.md` por `STORY-NNN` y línea, y numeración `COH-1…` tras ordenar, independiente de `H-NNN` (requiere T006) (D-3) // AC-1, AC-2
- [ ] T008 En `coh-corrections.md`, añadir la regla de reemplazo y la forma del cambio: contar en conjunto `specs/flow/<STORY-NNN>-*/` y `specs/flow/archive/*-<STORY-NNN>-*/` con `story.md`; 1 → reemplazo = nombre del directorio (sin prefijo de fecha si está archivado); 0 → «fuera de alcance · PO» con nota `sin directorio STORY-NNN-* en specs/flow/ ni en specs/flow/archive/: reemplazo no determinable`; ≥ 2 → «fuera de alcance · PO» con nota `varios directorios con el ID STORY-NNN: <lista>`; `related` no reconocido → `PO`; cambio `modificar` con Ubicación `historias › epic.md:<línea>` o `related › <ruta>:<línea(s)>`, sustitución con límite de token conservando envoltorio y forma; relectura: el slug obsoleto ya no aparece en la ubicación; el reemplazo sale solo del nombre del directorio, nunca del texto de la fuente (requiere T007) (D-4, D-5) // AC-1, AC-2, CNF-1
- [ ] T009 [P] Actualizar el comentario guía de la sección `hallazgos` de `skills/epic-refine/assets/epic-refine-report-template.md` con la forma de las filas COH: Origen `COH-<n>`, Código `COH`, Severidad `—`, Elemento `` `<obsoleto>` → `<reemplazo>` `` en `<ubicación>` (aplicado) o `` `<obsoleto>` `` en `<ubicación>`, Responsable `PO` si fuera de alcance; sin columnas ni secciones nuevas; los conteos `findings-*` incluyen los COH (D-6) // AC-1, AC-2
- [ ] T010 [P] Actualizar `skills/epic-refine/README.md`: añadir a las capacidades la corrección de referencias a slugs obsoletos tras un `/story-split` (COH) y su límite (índice y `related`, nunca el cuerpo ni `docs/`) (D-1) // CS-12

## 4. Fixtures y evals

- [ ] T011 [P] Crear `skills/epic-refine/examples/split-slug-obsoleto/` con `EPIC-30-ejemplo/epic.md` (índice F2 con STORY-301, STORY-302, STORY-305, STORY-306; la línea de STORY-301 termina en `— [[STORY-301-exportar-informe]]`; una línea F1), los directorios `STORY-301-exportar-informe-csv/`, `STORY-302-*/`, `STORY-305-*/`, `STORY-306-*/` con `story.md` en `SPECIFY/DONE` y `parent: EPIC-30-ejemplo` (el `related` de STORY-302 contiene `STORY-301-exportar-informe`) y `epic-analyze-report.md` `NEEDS-REFINEMENT` con un único INT-05 y sin mención del slug (D-8) // AC-1
- [ ] T012 [P] Crear `skills/epic-refine/examples/split-sin-reemplazo/`: como `split-slug-obsoleto/` pero sin slugs obsoletos de STORY-301 y con `STORY-310-importar-datos` en el `related` de STORY-302; sin ningún `STORY-310-*`; reporte `NEEDS-REFINEMENT` con INT-05 y **sin** MAD-02 para ese valor (D-8, CR-001) // AC-2
- [ ] T013 [P] Crear `skills/epic-refine/examples/split-ambiguo/`: como `split-slug-obsoleto/` más `archive/2026-10-01-STORY-301-exportar-informe-pdf/story.md` (D-4, D-8) // AC-2
- [ ] T014 [P] Crear `skills/epic-refine/examples/split-reportado/`: como `split-sin-reemplazo/` con el reporte que lista H-002 MAD-02 `STORY-310-importar-datos` en STORY-302 (D-3, D-8) // AC-1
- [ ] T015 [P] Crear `skills/epic-refine/examples/split-aprobada/`: como `split-slug-obsoleto/` con reporte `APPROVED` y `Sin hallazgos.` (D-8) // AC-1 (disparo)
- [ ] T016 Añadir a `skills/epic-refine/evals/evals.json` los casos TC-014…TC-018 de la tabla de D-8 (renumerar a partir del último `TC-NNN` anotado en T001 si difiere) y subir la versión (`1.2.0` o la siguiente a la existente): TC-014 manual `s` sobre `split-slug-obsoleto/`; TC-015 `--auto` sobre `split-sin-reemplazo/`; TC-016 `--auto` sobre `split-ambiguo/`; TC-017 `--auto` sobre `split-reportado/`; TC-018 manual sobre `split-aprobada/`, con sus `contains` / `not_contains` (requiere T011–T015) (D-8) // AC-1, AC-2, CNF-1

## 5. Integración en el framework

- [ ] T017 Añadir `epic-refine (COH: reemplaza slugs obsoletos)` al `escritor:` de la sección `historias` en `docs/templates/epic-template.md` y el mismo cambio en `skills/epic-creation/assets/epic-template.md`, dejando ambos idénticos byte a byte (D-8, CR-003) // AC-1
- [ ] T018 Añadir `epic-refine (COH: reemplaza slugs obsoletos)` al `escritor:` de `related:` en `docs/templates/story-template.md` y el mismo cambio en `skills/story-creation/assets/story-template.md`, dejando ambos idénticos byte a byte (D-8, CR-003) // AC-1
- [ ] T019 [P] En `docs/guides/sddf-commands-pipeline.md` §2, ampliar la fila de `epic-refine` con la corrección de referencias obsoletas tras un `/story-split` (D-8) // AC-1

## 6. Verificación

- [ ] T020 Verificar `wc -l skills/epic-refine/SKILL.md` < 500, `description` ≤ 500 caracteres y que el detalle COH vive solo en `references/coh-corrections.md` (la sub-sección del Paso 3 solo remite) (V-6) // CNF-3
- [ ] T021 Verificar que los archivos creados y modificados son UTF-8 sin BOM (primeros bytes ≠ `EF BB BF`) y que `cmp docs/templates/story-template.md skills/story-creation/assets/story-template.md` no reporta diferencias (V-5, V-7) // CNF-2, AC-1
- [ ] T022 Ejecutar `npm test` (incluye `test/epic-template.test.js`) y `npm run verify:repository`; deben pasar sin errores (V-7, V-8) // CS-21
- [ ] T023 Ejecutar `graphify update .` para actualizar el grafo tras los cambios
- [ ] T024 Registrar como pendiente de ejecución manual (criterio humano, AGENTS.md) `npm run test:eval -- epic-refine` para TC-014…TC-018 (V-1…V-4) // AC-1, AC-2
