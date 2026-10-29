---
alwaysApply: false
type: tasks
id: STORY-173
slug: STORY-173-cubrir-criterios-salida-epica-tasks
title: "Tasks: Skill epic-refine: asignar la cobertura de criterios de salida"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-23-completar-flujo-de-epic
story: STORY-173
design: STORY-173
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-173-cubrir-criterios-salida-epica
---

<!-- Referencias -->
[[STORY-173-cubrir-criterios-salida-epica]]

## 1. Precondición

- [ ] T001 Verificar que STORY-165 está implementada: existen `skills/epic-refine/SKILL.md` (con la tabla de enrutamiento y la fila `SAL-01, SAL-02` → `PO` «lo asigna STORY-173»), `skills/epic-refine/assets/epic-refine-report-template.md`, `skills/epic-refine/evals/evals.json` y `skills/epic-refine/README.md`, y que el Paso 4 carga `references/<familia>-corrections.md` por familia; si falta algo o cambió su contrato (plan `C-NN`, D-7, secciones del reporte), detener y revisar D-1 y D-6 del diseño antes de continuar (CR-005, Risks) // AC-1, AC-2

## 2. Catálogo de la familia SAL

- [ ] T002 Invocar `skill-master` para crear `skills/epic-refine/references/sal-corrections.md` (nota de la historia) con la sección de extracción y revalidación de D-2: etiqueta `CS-<n>` desde la fila de `cobertura-salida` cuya línea coincide con la **Evidencia** (fallback posicional en `criterios-salida`) o `SMOKE-<N>` desde **Elemento**; elemento ya no presente en `epic.md` → ya resuelto con nota `el elemento ya no figura en epic.md`; algún `story.md` activo de la épica con mención E1 del elemento (regla E1 de `epic-analyze` Paso 5b.2, fuera del frontmatter y de `## Fuera de alcance…`) → ya resuelto; candidatas = `STORY-NNN` de las evidencias `parcial:` resueltas por glob, descartando con nota archivadas, `CANCELED` y `parent` ajeno (D-2) // AC-1, AC-2, CNF-2
- [ ] T003 Añadir a `references/sal-corrections.md` la regla de la historia de cierre de D-3: índice = líneas F2/F3 `**STORY-NNN**` de la sección `historias` localizada por clave; dependiente de X = historia del índice distinta de X cuyo `story.md` activo tiene en el cuerpo (fuera del frontmatter y de `## Fuera de alcance…`) una línea `depends-on:` cuya lista incluye `X` con límite de palabra (admite comillas invertidas, comas y `(dura)`); historia de cierre = la **única** candidata sin dependientes; sin desempate por `STORY-NNN` (D-3, CR-001, CR-002) // AC-1, AC-2
- [ ] T004 Añadir a `references/sal-corrections.md` la tabla de casos «fuera de alcance · PO» de D-4 con sus notas literales (sin evidencia parcial; ninguna candidata sin dependientes; varias candidatas sin dependientes; historia de cierre en `IMPLEMENT` o posterior; sin sección `## ✅ Criterios de aceptación` o sin `### AC-<n>`; smoke sin bloque `gherkin` con `Entonces`), la **Acción sugerida** copiada literal, y la regla de estados admitidos: `SPECIFY` aplica; `PLAN` y `READY-FOR-IMPLEMENT` aplican con `Replanifica: /story-plan STORY-NNN`; `status`/`substatus` nunca se escriben (D-4, CR-003) // AC-2, CNF-2, CS-15
- [ ] T005 Añadir a `references/sal-corrections.md` la forma de escritura de D-5: AC de cierre `### AC-<k+1> — Cierre del contrato de salida – <etiqueta> de <EPIC_ID>` tras el último `### AC-<k>` de `## ✅ Criterios de aceptación` (criterio: Dado/Cuando/Entonces fijos con `Entonces se cumple: <texto literal sin la casilla>`; smoke: copia literal de los pasos del bloque `gherkin` del smoke); cita E1 al final de `## 📎 Notas…` (`- Cubre el criterio de salida CS-<n> de <EPIC_ID>: <texto literal>` / `- Cubre SMOKE-<N> de <EPIC_ID>: <nombre>`), creando la sección con el título de `docs/templates/story-template.md` (seed `skills/story-creation/assets/story-template.md`) si no existe; varios elementos por historia → un AC y una línea por elemento en el orden del reporte, AC consecutivos (D-5) // AC-1, CNF-2
- [ ] T006 Añadir a `references/sal-corrections.md` las filas de plan y reporte de D-6: `C-NN` con **Origen** `H-NNN · SAL-0n`, **Ubicación** `Criterios de aceptación › tras AC-<k>` o `Notas`, **Antes** `—`; **Elemento** en `hallazgos` = `<código> · <etiqueta>[ → STORY-NNN]` (aplicado `SAL-01 · CS-1 → STORY-302`; fuera de alcance `SAL-01 · CS-2`, responsable `PO`, cambios `—`; ya resuelto `SAL-01 · CS-1`); la comprobación adicional de relectura (cada línea E1 escrita cumple E1 para su elemento; si no, restauración global) (D-5, D-6) // AC-1, AC-2

## 3. SKILL.md y artefactos del skill

- [ ] T007 En `skills/epic-refine/SKILL.md`, mediante `skill-master`: reemplazar la fila de enrutamiento `SAL-01, SAL-02 · Fuera de alcance en esta versión · PO (nota: «lo asigna STORY-173»)` por `SAL-01, SAL-02 · Asignación de cobertura a la historia de cierre · PO en los casos de sal-corrections.md · sal-corrections.md`; quitar SAL-01/SAL-02 de «Qué NO hace»; añadir el error `❌ Catálogo references/sal-corrections.md no encontrado` (antes de escribir) a la tabla de errores (D-1, F-5) // AC-1, AC-2, CNF-4
- [ ] T008 En `skills/epic-refine/SKILL.md`, añadir a «Restricciones / Reglas» la regla CNF-2 (cita E1 y AC de cierre solo en una historia por elemento, la historia de cierre, siempre juntos; nunca citar en las demás candidatas) y `story.md.bak` previo a cada `story.md` modificado (ya cubierto por D-7 de STORY-165); añadir al resumen final las líneas `Replanifica: /story-plan STORY-NNN` antes de `Siguiente paso: /epic-analyze <EPIC_ID>`; ampliar `description` con «asigna la cobertura de criterios de salida y smoke tests» y el disparador «criterio de salida sin cobertura», sin superar 500 caracteres (D-1, D-4, D-5) // AC-1, CNF-1, CNF-2
- [ ] T009 [P] En `skills/epic-refine/assets/epic-refine-report-template.md`, ampliar el comentario guía de la sección `hallazgos` con la forma de **Elemento** para SAL (`<código> · <etiqueta>[ → STORY-NNN]`) y el de `cambios-aplicados` con el AC de cierre o la línea E1 en **Después**; sin columnas ni secciones nuevas (D-6) // AC-1, AC-2
- [ ] T010 [P] En `skills/epic-refine/README.md`, añadir a las capacidades la asignación de cobertura de SAL-01/SAL-02 a la historia de cierre y a «Qué no hace»: no modifica criterios de salida ni smoke tests, no crea historias (D-1) // CS-12

## 4. Fixtures y evals

- [ ] T011 [P] Crear `skills/epic-refine/examples/cobertura-cierre/` con `EPIC-30-ejemplo/epic.md` (índice F2 con STORY-301 y STORY-302; criterio de salida `CS-1` compuesto), `story.md` de STORY-301 y STORY-302 en `SPECIFY/DONE` con `parent: EPIC-30-ejemplo`, cada una con un AC que afirma solo una parte de `CS-1`, STORY-302 con `depends-on: STORY-301` en Notas, y `epic-analyze-report.md` conforme al template de `epic-analyze` (`NEEDS-REFINEMENT`, H-001 SAL-01 con **Evidencia** `epic.md:<línea>` · `parcial: STORY-301 › AC-1 · story.md:<línea>` y `parcial: STORY-302 › AC-1 · story.md:<línea>`, fila `CS-1` en `cobertura-salida`) (D-8) // AC-1
- [ ] T012 [P] Crear `skills/epic-refine/examples/cobertura-sin-parcial/` (índice con STORY-301 y STORY-302, ninguna menciona `CS-2`; reporte `NEEDS-REFINEMENT` con H-001 SAL-01 `CS-2` cuya **Evidencia** es solo `epic.md:<línea>`) (D-8) // AC-2
- [ ] T013 [P] Crear `skills/epic-refine/examples/cobertura-empate/` como copia de `cobertura-cierre/` sin la línea `depends-on:` en STORY-302 (D-8) // CNF-2
- [ ] T014 [P] Crear `skills/epic-refine/examples/cobertura-reejecucion/` como copia de `cobertura-cierre/` con STORY-302 ya conteniendo el AC de cierre de `CS-1` y la línea E1 `- Cubre el criterio de salida CS-1 de EPIC-30: …`, y su `story.md.bak`; el `epic-analyze-report.md` es el mismo (D-8, F-4) // AC-1
- [ ] T015 [P] Crear `skills/epic-refine/examples/cobertura-smoke-implementada/` (smoke `SMOKE-2` con bloque `gherkin`; única evidencia parcial en STORY-303 con `status: IMPLEMENT`, `substatus: DONE`; reporte con H-001 SAL-02 `SMOKE-2`) (D-8) // CNF-2, CS-15
- [ ] T016 Añadir a `skills/epic-refine/evals/evals.json` los casos TC-009…TC-013 de la tabla de D-8 y subir la versión a `1.1.0`: `input_path` a cada fixture, modo `--auto` en `context`, `contains` / `not_contains` indicados (TC-009: `SAL-01 · CS-1 → STORY-302`, `story.md.bak` solo de STORY-302, sin cita de `CS-1` en STORY-301 ni `epic.md.bak`; TC-010: `SAL-01 · CS-2`, `fuera de alcance`, `PO`, sin `story.md.bak`) (requiere T011–T015) (D-8) // AC-1, AC-2, CNF-1, CNF-2

## 5. Integración en el framework

- [ ] T017 Añadir `epic-refine (AC de cierre del contrato de salida, SAL-01/SAL-02)` al `escritor:` de `## ✅ Criterios de aceptación` y `epic-refine (cita E1 del contrato de salida)` al de `## 📎 Notas / contexto adicional` en `docs/templates/story-template.md`, y el mismo cambio en `skills/story-creation/assets/story-template.md`, dejando ambos idénticos byte a byte (D-7, CR-004) // AC-1
- [ ] T018 [P] En `docs/guides/sddf-commands-pipeline.md` §2, ampliar la fila y la nota de `epic-refine` (descomentadas por STORY-165) para incluir la asignación de cobertura de criterios de salida y smoke tests a la historia de cierre, retirando la mención «la cobertura llega con STORY-173» (D-7) // AC-1

## 6. Verificación

- [ ] T019 Verificar `wc -l skills/epic-refine/SKILL.md` < 500, `description` ≤ 500 caracteres y que el detalle SAL vive solo en `references/sal-corrections.md`, cargado únicamente en el Paso 4 cuando el reporte contiene SAL-01/SAL-02 (V-6) // CNF-4
- [ ] T020 Verificar que los archivos creados y modificados son UTF-8 sin BOM (primeros bytes ≠ `EF BB BF`) y que `cmp docs/templates/story-template.md skills/story-creation/assets/story-template.md` no reporta diferencias (V-5, V-7) // CNF-3, AC-1
- [ ] T021 Ejecutar `npm test` y `npm run verify:repository` (incluye layout fijo e inventario de evals); deben pasar sin errores (V-8) // CS-21
- [ ] T022 Ejecutar `graphify update .` para actualizar el grafo tras los cambios
- [ ] T023 Registrar como pendiente de ejecución manual (criterio humano, AGENTS.md) `npm run test:eval -- epic-refine` (TC-009…TC-013, sin regresión en TC-001…TC-008) y el recorrido sobre `cobertura-cierre/`: `/epic-refine EPIC-30 --auto` → `/epic-analyze EPIC-30` cubre `CS-1` por E1 en STORY-302 (V-1…V-4) // AC-1, AC-2, CNF-1, CNF-2
