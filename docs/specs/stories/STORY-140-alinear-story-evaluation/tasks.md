---
type: tasks
id: STORY-140
slug: STORY-140-alinear-story-evaluation-tasks
title: "Tasks: Alinear story-evaluation"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-25-unificar-contrato-de-validaciones-en-skills
story: STORY-140
design: STORY-140
created: 2026-10-17
updated: 2026-10-17
related:
  - STORY-140-alinear-story-evaluation
  - STORY-140-alinear-story-evaluation-design
---

<!-- Referencias -->
[[STORY-140-alinear-story-evaluation]] · [[STORY-140-alinear-story-evaluation-design]]

> Orden: línea base (policy publicada) → template del reporte → `SKILL.md` de story-evaluation → soporte de story-evaluation → consumidores (`story-specify`, `story-improve`, `story-split`) → documentación vigente → evals → verificación.
> Las tareas sin `[P]` de un mismo grupo editan el mismo archivo y van en orden. Las tareas `[P]` editan archivos distintos. Las de verificación son de solo lectura y pueden ir en paralelo, salvo la conformidad final y el gate.
> Los números de línea vienen del «Estado medido» del diseño (2026-10-17). Si se han movido, se localiza el texto por contenido.
> No se modifican la policy, `scripts/migrate-finvest-field.js` (CR-001), `docs/product/` (CR-002), los reportes de `docs/specs/`, `CHANGELOG.md`, `package.json` ni las copias de `.claude/`. Ningún archivo editado debe contener el literal `APROBADA` (CS-10, SMOKE-3). Todo archivo modificado se guarda en UTF-8 sin BOM.

## 1. Línea base

- [x] T001 Comprobar que `docs/policies/validation-contract-policy.md` existe (D-12). Si no existe, detener la historia sin editar nada: STORY-138 no está implementada. Si existe, leer G-01…G-06, la fila `story-evaluation` de §4, sus cuatro filas de §5, la regla de reportes heredados, §6 y el ejemplo §7.2. Anotar cualquier diferencia con los puntos C-1…C-6 de D-11 y aplicar la versión publicada — D-11, D-12, AC-1
- [x] T002 [P] Confirmar el «Estado medido» del diseño: `grep -n -E 'APROBADA|REFINAR|RECHAZAR|DIVIDIR|decision' skills/story-evaluation/SKILL.md` (l.3, 17, 23, 25, 65, 73, 123, 139-140, 146-153, 184, 196-210, 336, 344, 350-354); `grep -n -E '^#|gateway_decision|FINVEST Decisi' skills/story-evaluation/assets/evaluation-output-template.md` (l.1, 3, 19, 40, 51); y el mismo `grep` de valores sobre `skills/story-specify`, `skills/story-improve`, `skills/story-split`, `skills/story-creation/assets/story-template.md`, `docs/templates/story-template.md`, `docs/guides/sddf-commands-pipeline.md` y FR-031. Si alguna pieza falta o no coincide con el inventario de D-9, detener e informar cuál — Context, D-9
- [x] T003 [P] Registrar la línea base del gate: resultado de `npm run verify:repository` y de `npm test` en la rama actual, para distinguir después fallos nuevos de previos — V-10

## 2. Template del reporte FINVEST

- [x] T004 Añadir al inicio de `skills/story-evaluation/assets/evaluation-output-template.md` el frontmatter de D-2, en este orden: `type: finvest-evaluation`, `story-id: {story_id}`, `finvest-score: {FINVEST_score}`, `verdict: {APPROVED | NEEDS-REFINEMENT | SPLIT}`, `evaluated: {YYYY-MM-DD}`. Sin campo `decision` — D-2, AC-1
- [x] T005 Insertar entre `# Evaluación FINVEST` y `## Historia evaluada` la sección `## Veredicto`. Lleva un comentario guía de una línea («línea según la fila del Paso 4 que dio el valor») y la línea `` **Veredicto:** `{verdict}` — {motivo} ``, según el «Esquema de datos» del diseño — D-3, AC-1
- [x] T006 En Fase 1, sustituir `{gateway_decision}` (l.19) por `{gateway_resultado}`. En `## Resultado Final`, eliminar la línea `**FINVEST Decisión:** {decision}` (l.51) y conservar F, I, N, V, E, S, T y `**FINVEST Score:**`. No renombrar ninguna sección — D-4, AC-1

## 3. `SKILL.md` de story-evaluation

- [x] T007 Paso 4 (l.144-153): sustituir la tabla por la de primera coincidencia de D-1, con seis filas en este orden: F_score < 2.5 → `NEEDS-REFINEMENT`; otra dimensión INVEST distinta de S = 1 → `NEEDS-REFINEMENT`; S = 1 → `SPLIT`; FINVEST ≥ 4.0 → `APPROVED`; 3.0 ≤ FINVEST < 4.0 → `NEEDS-REFINEMENT`; FINVEST < 3.0 → `NEEDS-REFINEMENT`. Indicar «se evalúa en orden; gana la primera». Añadir una línea que remite al contrato de validación (`docs/policies/validation-contract-policy.md` de Agile-SDDF), en código en línea, sin enlace y sin repetir la tabla de vocabulario. Los umbrales no cambian — D-1, D-9, AC-1, CNF-1
- [x] T008 Paso 3 (l.138-140): reescribir las dos «Reglas críticas» como remisión a las filas 2 y 3 del Paso 4. Debe quedar explícito que, con S = 1 y otra dimensión = 1, gana la fila 2 y que la fila 3 gana a las filas de score. Paso 2 (l.123) y Restricciones (l.73): «emitir `NEEDS-REFINEMENT` (fila 1 del Paso 4) sin evaluar INVEST» — D-1, AC-1, CNF-1
- [x] T009 Paso 5: añadir un punto que exige escribir `## Veredicto` con la línea de D-3 según la fila del Paso 4 que dio el valor, con sus seis formas literales. `<dims>` lista todas las dimensiones con score 1 en el orden I, N, V, E, S, T; con una sola dimensión, «dimensión crítica: X = 1». `<f>` y `<x>` llevan dos decimales. El punto incluye `{gateway_resultado}` con los dos textos fijos de D-4 — D-3, D-4, AC-1
- [x] T010 Paso 6 (l.176-192): el punto 3 remite al frontmatter del template en lugar de transcribirlo (sin `decision`). Se aclara que la conversación muestra el cuerpo desde `# Evaluación FINVEST` y el archivo lleva frontmatter + cuerpo. La confirmación del punto 5 pasa a `✓ Reporte guardado: <ruta>/finvest-evaluation-report.md (verdict: <VALOR>)` — D-2, D-5, AC-1, AC-2
- [x] T011 Paso 7 (l.196-210), Manejo de errores (l.336) y Salida (l.344): condición `verdict = APPROVED` en lugar de `APROBADA`; «decisión» → «veredicto». En l.210: «el score y el veredicto viven en `finvest-score` y `verdict` de `finvest-evaluation-report.md`» — D-9, AC-1
- [x] T012 Frontmatter `description` (l.3), Objetivo (l.17, l.23, l.25) y Modo Agent (l.65): describir el veredicto `APPROVED` / `NEEDS-REFINEMENT` / `SPLIT`, declarado en `## Veredicto` y en `verdict`. El modo Agent «retorna el veredicto» — D-9, AC-1
- [x] T013 Ejemplos de referencia (l.350-354): ready → `APPROVED`; refinar → `NEEDS-REFINEMENT` (fila 5); rechazar caso A → `NEEDS-REFINEMENT` (fila 1); rechazar caso B → `NEEDS-REFINEMENT` (fila 2, I, E, S = 1). Se conservan los nombres de archivo — D-1, D-9, AC-1

## 4. Soporte de story-evaluation

- [x] T014 [P] `skills/story-evaluation/README.md`: l.11 y l.17 con el veredicto `APPROVED`, `NEEDS-REFINEMENT` o `SPLIT`; l.30: «aprobarse, refinarse o dividirse» — D-9, AC-1
- [x] T015 [P] `skills/story-evaluation/examples/example-ready.md`: título `# Ejemplo: veredicto APPROVED`. `### Veredicto` va como primera subsección de `## Evaluación FINVEST`, con la línea de D-3 fila 4 y los valores del propio ejemplo. Eliminar `**FINVEST Decisión:** ✅ **Ready**` (l.88) — D-3, D-4, D-9, AC-1
- [x] T016 [P] `skills/story-evaluation/examples/example-refinar.md`: título `# Ejemplo: veredicto NEEDS-REFINEMENT (score entre 3.0 y 4.0)`. `### Veredicto` lleva la línea de D-3 fila 5 y los valores del ejemplo. Eliminar `**FINVEST Decisión:** 🟡 **Refinar**` (l.68) — D-3, D-4, D-9, AC-1
- [x] T017 [P] `skills/story-evaluation/examples/example-rechazar.md`: título `# Ejemplo: veredicto NEEDS-REFINEMENT (formato insuficiente y dimensiones críticas)`. Los subtítulos de los casos A y B quedan sin «Rechazar». Cada bloque de evaluación lleva `#### Veredicto` primero, con D-3 fila 1 en el caso A y fila 2 en el B (`I, E, S = 1`). El gateway de l.35 pasa al texto fijo de D-4. Eliminar `**FINVEST Decisión:** …` (l.48 y l.170) — D-1, D-3, D-4, D-9, AC-1, CNF-1

## 5. Consumidor `story-specify`

- [x] T018 `skills/story-specify/SKILL.md` Paso 3 (l.189-197): extraer `verdict` del frontmatter del reporte recién generado (no `Decision`). La rama `APROBADA` pasa a `APPROVED`, con el DoD SPECIFY y `SPECIFY/DONE` sin cambios. La columna del backlog `Decision FINVEST` pasa a `Veredicto FINVEST` en l.155, l.236 y l.314 (valores del §4 o `Pendiente`) — D-6, AC-2
- [x] T019 Paso 4 (l.212): invocar `story-split` si el veredicto es `SPLIT`, o `NEEDS-REFINEMENT` con `**S – Small:** 1 / 5` en `## Resultado Final` del reporte. Se elimina «`RECHAZAR` con recomendación de división». Si el split no aplica, sigue al Paso 5A como hoy — D-6, AC-2
- [x] T020 Pasos 5A, 5B, 6 y reglas (l.43, l.105-106, l.228, l.234-235, l.252, l.269-275): `APROBADA` → `APPROVED`; `REFINAR` o `RECHAZAR` → `NEEDS-REFINEMENT`. El mensaje de l.235 queda `ℹ️ <STORY-NNN> ya tiene veredicto APPROVED — avanzando al gate`. El gate anti-bucle, sus tres opciones y sus reglas no cambian — D-6, AC-2
- [x] T021 [P] `skills/story-specify/README.md`: l.12 (`→ APPROVED/NEEDS-REFINEMENT/SPLIT`). El diagrama de l.45-50 queda con `APPROVED` → `SPECIFY/DONE`, `SPLIT` (o `NEEDS-REFINEMENT` con S = 1) → `story-split` y `NEEDS-REFINEMENT` → 5A, con «APPROVED detectada → gate». En l.69-70 y l.77, `APPROVED` — D-6, D-9, AC-2
- [x] T022 [P] `skills/story-specify/assets/agents/product-owner.md` (l.28): «después de un veredicto FINVEST `SPLIT` o `NEEDS-REFINEMENT`» — D-9, AC-2

## 6. Consumidor `story-improve`

- [x] T023 `skills/story-improve/SKILL.md` Paso 2 (l.163-186): leer `verdict:` (valores `APPROVED | NEEDS-REFINEMENT | SPLIT`). Con `APPROVED`, gate con `ℹ️ <STORY-NNN> ya tiene veredicto APPROVED — no se realizan cambios` y fin sin escribir. Con `NEEDS-REFINEMENT` o `SPLIT`, continuar al Paso 3. Sin `verdict` o con un valor fuera de esos tres, emitir el `⚠️` de D-7 («sin campo verdict» o «valor no permitido», `formato anterior al contrato de validación`, `ejecuta /story-evaluation <STORY-NNN> para regenerarlo`) y terminar sin escribir. No nombrar valores heredados — D-7, AC-2
- [x] T024 Resto de `skills/story-improve/SKILL.md`: l.5 y l.26 («veredicto `NEEDS-REFINEMENT`» en lugar de la decisión), l.35-36 (extrae `verdict:`), l.88 («Gate APPROVED es definitivo»), l.302 (`Veredicto previo: NEEDS-REFINEMENT (FINVEST <score>)`), l.311 («supera el umbral de `APPROVED`») y l.330-334 (`verdict ≠ APPROVED` / `verdict: APPROVED`). Añadir a Manejo de errores la fila del `⚠️` de D-7 — D-7, D-9, AC-2
- [x] T025 [P] `skills/story-improve/README.md` (l.16: `APPROVED`; l.28: «veredicto `NEEDS-REFINEMENT` o `SPLIT`») y `skills/story-improve/assets/improvement-log-template.md` (l.16: `- **Veredicto previo:** <NEEDS-REFINEMENT | SPLIT>`) — D-9, AC-2
- [x] T026 [P] `skills/story-improve/examples/example-aprobada-input/` y `example-refinar-input/`. En cada `finvest-evaluation-report.md`, `decision:` pasa a `verdict: APPROVED` / `verdict: NEEDS-REFINEMENT` y se elimina la fila «Decisión» del recuadro. `## Decisión` pasa a `## Veredicto`, como primer `##` tras el título, con la línea de D-3 (fila 4 con FINVEST 4.19; fila 5 con 3.94). «umbral APROBADA» pasa a «umbral de `APPROVED` (4.0)». En cada `story.md` (l.16-18), eliminar el bloque `**FINVEST Score:**` / `**FINVEST Decisión:**` / `---` retirado por STORY-090 — D-7, D-9, AC-2

## 7. `story-split` y documentación vigente

- [x] T027 [P] `skills/story-split/SKILL.md` Paso 3b (l.172, l.178): usar el plan FINVEST solo con `verdict: SPLIT`. Sin `verdict`, o con otro valor, `plan_finvest` queda vacío y el Paso 4 sigue con la detección de patrones — D-8, AC-2
- [x] T028 [P] `skills/story-split/examples/input/epic-story.md`: eliminar el bloque FINVEST retirado (l.12-13 y su separador, si lo hay). `examples/output/split-result.md` l.5: `` — Veredicto FINVEST: `SPLIT` (S=1, 6 escenarios, 18+ pasos totales) `` — D-9, AC-2
- [x] T029 [P] l.8 de `skills/story-creation/assets/story-template.md` y de `docs/templates/story-template.md`: «solo con decisión APROBADA» → «solo con veredicto APPROVED», con el mismo texto en ambos para que sigan idénticos — D-9, AC-1
- [x] T030 [P] `docs/guides/sddf-commands-pipeline.md` l.214: `` → `APPROVED / NEEDS-REFINEMENT / SPLIT` `` — D-9, AC-1
- [x] T031 [P] `docs/requirements/functional/FR-031-evaluacion-de-calidad-con-rubrica-finvest.md` (l.18-21): el veredicto se declara en `verdict` y en `## Veredicto` con `APPROVED` / `NEEDS-REFINEMENT` / `SPLIT`, según las condiciones y el orden de D-1 y con los mismos umbrales. Actualizar `updated:` a la fecha de implementación — D-1, D-9, AC-1, CNF-1

## 8. Evals

- [x] T032 [P] `skills/story-evaluation/evals/evals.json`: aplicar la tabla de D-10 a TC-001…TC-005 y añadir TC-006 (texto libre de `example-ready.md` → `APPROVED`), TC-007 (texto libre de `example-refinar.md` → `NEEDS-REFINEMENT`, `"entre 3.0 y 4.0"`) y TC-008 (texto libre del caso B de `example-rechazar.md` → `NEEDS-REFINEMENT`, `"dimensión crítica"`, sin `` "`SPLIT`" ``). Ningún `not_contains` usa `"APROBADA"`. `version` → `1.1.0`. Validar con `node -e "JSON.parse(require('fs').readFileSync('skills/story-evaluation/evals/evals.json','utf8'))"` que queda JSON válido con 8 casos — D-10, AC-1, CNF-1
- [x] T033 [P] `skills/story-specify/evals/evals.json`: `APROBADA` → `APPROVED` (TC-001, TC-006, TC-007), `DIVIDIR` → `SPLIT` (TC-004) y `REFINAR` → `NEEDS-REFINEMENT` (TC-005) en `description`, `context` y aserciones. `"Decision FINVEST = APROBADA"` → `"Veredicto FINVEST = APPROVED"` y `"ya tiene decisión APROBADA"` → `"ya tiene veredicto APPROVED"`. Los `not_contains` de TC-001 pasan a `"NEEDS-REFINEMENT"` y `"SPLIT"`. Renombrar TC-004 y TC-005 (`split-automatico-tras-verdict-split`, `gate-antibucle-verdict-needs-refinement`). Añadir TC-009: `NEEDS-REFINEMENT` con I = 1 y S = 1 → se invoca `story-split`. `version` → `1.1.0` y JSON válido — D-6, D-10, AC-2
- [x] T034 [P] `skills/story-improve/evals/evals.json`: TC-001 y TC-005 pasan a `verdict: NEEDS-REFINEMENT` (`happy-path-needs-refinement-applies-improvements`, `edge-case-needs-refinement-multiple-low-dimensions`). TC-002 pasa a `verdict: APPROVED` (`gate-approved-no-files-written`) y afirma `"ya tiene veredicto APPROVED"`. Añadir TC-006: reporte sin `verdict` → `contains` `"sin campo verdict"` y `"/story-evaluation"`, `not_contains` `"story.md.bak"`. `version` → `1.1.0` y JSON válido — D-7, D-10, AC-2

## 9. Verificación

- [x] T035 [P] V-1: `grep -rn -E "APROBADA|Aprobada|REFINAR|RECHAZAR|DIVIDIR"` sobre `skills/story-evaluation`, `skills/story-specify`, `skills/story-improve`, `skills/story-split`, `skills/story-creation`, `docs/templates/story-template.md`, `docs/guides/sddf-commands-pipeline.md` y FR-031. Solo devuelve líneas `not_contains` de `skills/story-evaluation/evals/evals.json`, y ninguna con `APROBADA` — AC-1, AC-2
- [x] T036 [P] V-2, V-3 y V-4 sobre el template. `grep -n -E '^(type|verdict|decision):'` muestra solo `type` y `verdict`. `grep -n '^#'` muestra `# Evaluación FINVEST`, `## Veredicto` y `## Historia evaluada` en ese orden, sin otro `##` entre ellos. `grep -n -E 'FINVEST Decisi|gateway_decision|\{decision\}'` no devuelve nada — AC-1
- [x] T037 [P] V-5: leer los Pasos 3-5 de `skills/story-evaluation/SKILL.md`. Para cada fila de los Ejemplos de AC-1, más el caso S = 1 con otra dimensión = 1, comprobar que el veredicto y la línea `**Veredicto:**` coinciden con D-1 y D-3. Comprobar con `git diff` que los umbrales 2.5, 3.0 y 4.0, los pesos de F y las rúbricas no cambian — AC-1, CNF-1
- [x] T038 [P] V-6 y V-7: `grep -rn "decision:" skills/story-specify skills/story-improve skills/story-split` no devuelve nada. Leer los Pasos 3-6 de `story-specify` y confirmar la tabla de D-6 (incluida la fila S = 1) y el gate anti-bucle sin cambios. Leer el Paso 2 de `story-improve` y confirmar el gate `APPROVED` y el `⚠️` sin escritura de D-7 — AC-2
- [x] T039 [P] V-8: `diff -q docs/templates/story-template.md skills/story-creation/assets/story-template.md` no informa diferencias — AC-1
- [x] T040 V-9: comparar el template y el Paso 4 con la policy publicada, punto por punto C-1…C-6 de D-11 (más las diferencias anotadas en T001). Confirmar que §6 sigue con `Sin excepciones vigentes.` y que `git diff --stat docs/policies/` está vacío. Anotar el resultado en `implement-report.md` — AC-1
- [x] T041 V-10: ejecutar `npm run verify:repository` y `npm test` y compararlos con la línea base de T003 (ningún fallo nuevo). Con `git status`, comprobar que solo cambian los archivos de «Componentes afectados» del diseño y los artefactos de la historia, y que `scripts/migrate-finvest-field.js` y `docs/product/` no cambian — AC-1, AC-2
- [x] T042 V-11 (manual, a criterio humano según AGENTS.md): proponer al mantenedor `npm run test:eval -- story-evaluation`, `npm run test:eval -- story-specify` y `npm run test:eval -- story-improve`. Registrar en `implement-report.md` si se ejecutaron y su resultado. No lanzarlos de forma automática — AC-1, AC-2, CNF-1
