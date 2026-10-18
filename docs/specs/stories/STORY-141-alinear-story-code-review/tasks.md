---
type: tasks
id: STORY-141
slug: STORY-141-alinear-story-code-review-tasks
title: "Tasks: Alinear story-code-review"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-25-unificar-contrato-de-validaciones-en-skills
story: STORY-141
design: STORY-141
created: 2026-10-17
updated: 2026-10-17
related:
  - STORY-141-alinear-story-code-review
  - STORY-141-alinear-story-code-review-design
---

<!-- Referencias -->
[[STORY-141-alinear-story-code-review]] · [[STORY-141-alinear-story-code-review-design]]

> Orden: línea base (policy publicada) → templates del reporte y de `fix-directives.md` → `SKILL.md` de story-code-review → soporte de story-code-review → consumidores (`story-implement-tasks`, `story-implement`) → DoD y documentación vigente → excepción de la policy → evals → verificación.
> Las tareas sin `[P]` de un mismo grupo editan el mismo archivo y van en orden. Las tareas `[P]` editan archivos distintos. Las de verificación son de solo lectura y pueden ir en paralelo, salvo la conformidad final y el gate.
> Los números de línea vienen del «Estado medido» del diseño (2026-10-17). Si se han movido, se localiza el texto por contenido.
> No se modifican `skills/story-code-review/agents/*.agent.md`, los `*-report.md` de `examples/` (D-4, D-10), la lógica de rework de `story-implement` y `story-implement-tasks` (D-7), los flowcharts, `docs/specs/**`, `skills/memory-system/examples/**` (CR-002), `CHANGELOG.md`, `package.json` ni las copias de `.claude/`. Ninguna aserción `not_contains` usa `approved` ni `review-status` (D-9). Todo archivo modificado se guarda en UTF-8 sin BOM.

## 1. Línea base

- [ ] T001 Comprobar que `docs/policies/validation-contract-policy.md` existe (D-11). Si no existe, detener la historia sin editar nada: STORY-138 no está implementada. Si existe, leer G-01…G-06, la fila `story-code-review` de §4, sus filas de §5 (`approved` → `APPROVED`, `needs-changes` → `NEEDS-CHANGES`), la regla de reportes heredados, §6 «Excepciones», «Historial de cambios» y el ejemplo §7.4. Anotar cualquier diferencia con los puntos C-1…C-7 de D-11 y aplicar la versión publicada — D-11, AC-1
- [ ] T002 [P] Confirmar el «Estado medido» del diseño con `grep -n -E 'review-status|REVIEW_STATUS|Review status|approved|needs-changes|Decisión final'` sobre `skills/story-code-review/SKILL.md` (l.22, 29-30, 46-47, 57-58, 384-392, 400, 431-442, 455-459, 470, 478, 500, 510, 518, 538, 547, 563, 574, 594, 622, 661), los dos templates de `assets/`, `README.md`, `examples/example-approved/code-review-report.md`, los dos `examples/example-needs-changes*/fix-directives.md`, `skills/story-implement-tasks/SKILL.md` l.69, `skills/story-implement/README.md` l.21, las dos copias del DoD CODE-REVIEW (l.25), `docs/guides/sddf-commands-pipeline.md`, `docs/architecture/state-machine.md` y `docs/domains/domain-story-lifecycle.md`. Confirmar también que `story-implement` y `story-implement-tasks` no leen `review-status` (CR-001). Si alguna pieza falta o no coincide con el inventario de D-8, detener e informar cuál — Context, D-7, D-8
- [ ] T003 [P] Registrar la línea base del gate: resultado de `npm run verify:repository` y de `npm test` en la rama actual, para distinguir después fallos nuevos de previos — V-11

## 2. Templates de story-code-review

- [ ] T004 [P] `skills/story-code-review/assets/code-review-report-template.md`, frontmatter: la l.5 `review-status: {{REVIEW_STATUS}}` pasa a `verdict: {{VERDICT}}` en la misma posición. `type`, `story`, `title`, `date`, `max-severity` y `reviewers` no cambian — D-2, AC-1, AC-2
- [ ] T005 Mismo template, cuerpo: insertar entre `# Code Review Report: {{STORY_ID}}` y `## Resumen` la sección `## Veredicto` con `` **Veredicto:** `{{VERDICT}}` — {{VERDICT_REASON}} ``, una línea en blanco y `{{DECISION_RATIONALE}}`. Eliminar la fila `Review status` de la tabla de `## Resumen` (l.22) y conservar `Severidad máxima detectada`. Eliminar `## Decisión final` (l.68-74) con su separador `---`. `## Hallazgos por dimensión`, `## Siguiente acción` y `## Cumplimiento DoD — Fase CODE-REVIEW` conservan nombre y orden. `{{VERDICT}}` queda exactamente dos veces en el archivo — D-3, AC-1
- [ ] T006 [P] `skills/story-code-review/assets/fix-directives-template.md`: eliminar `review-status: needs-changes` del frontmatter (l.5), que queda con `type`, `story`, `title`, `date`, `max-severity`, `round` y `based-on`. l.17 → `` - **Veredicto de origen:** `NEEDS-CHANGES` (`code-review-report.md`) ``. l.41 → `` 4. Si el veredicto es `APPROVED`, este archivo se elimina y la historia queda en `CODE-REVIEW/DONE`. ``. La tabla «Instrucciones de corrección» (6 columnas) y la «Lista blanca de archivos permitidos para modificar» no cambian — D-5, AC-2

## 3. `SKILL.md` de story-code-review

- [ ] T007 Paso 4c (l.384-392): titularlo «4c. Derivar el veredicto». Sustituir la regla por la tabla de D-1 (`LOW` o `ninguna` → `APPROVED`; `HIGH` o `MEDIUM` → `NEEDS-CHANGES`) y añadir una línea que define «hallazgo bloqueante = severidad `HIGH` o `MEDIUM`», la misma definición de 4e y `{{TOTAL_BLOCKING}}`. La variable pasa a `$VERDICT` con valores `APPROVED` o `NEEDS-CHANGES`. Añadir una línea que remite al contrato de validación (`docs/policies/validation-contract-policy.md`) en código en línea, sin repetir la tabla de vocabulario. No tocar 4a (fail-safe `HIGH`) ni 4b (orden de severidad) — D-1, AC-1, CNF-1
- [ ] T008 Paso 4c.1 (l.400, l.431-438) y 4c.2 (l.442): `$REVIEW_STATUS` → `$VERDICT`; el recálculo usa la misma tabla de D-1 que 4c. La severidad de los criterios DoD no cambia — D-1, AC-1, CNF-1
- [ ] T009 Pasos 4d-4h: en 4d (l.455-457) las condiciones pasan a `$VERDICT = NEEDS-CHANGES` y `$VERDICT = APPROVED`. Las etiquetas de rama de 4e, 4f, 4g y 4h (l.459, l.470, l.500, l.518) pasan a `[NEEDS-CHANGES]` y `[APPROVED]`. l.478: «cerradas en `NEEDS-CHANGES`». 4f.2 deja de mencionar `review-status` y remite al template de T006. 4g (l.510): `⚠️  Veredicto: NEEDS-CHANGES — story.md → READY-FOR-IMPLEMENT/DONE` — D-1, D-5, D-6, AC-1, AC-2
- [ ] T010 Paso 5b (l.535-547): el frontmatter se completa con `story_id`, `$VERDICT`, la fecha y `$MAX_SEVERITY`. La sección «Decisión final» se sustituye por «Sección `## Veredicto`: línea de D-3 con `$VERDICT` y `{{VERDICT_REASON}}`, seguida de `{{DECISION_RATIONALE}}`», con los dos motivos literales de D-3 (`Sin hallazgos bloqueantes (severidad máxima: <LOW | ninguna>).` y `<N> hallazgo(s) bloqueante(s) (severidad máxima: <HIGH | MEDIUM>).`, donde `<N>` es el total `HIGH`/`MEDIUM` de agentes + DoD). l.542: cada `{{TECH_LEAD_FINDINGS}}`, `{{PRODUCT_OWNER_FINDINGS}}`, `{{INTEGRATION_FINDINGS}}` y `{{SECURITY_FINDINGS}}` recibe solo la tabla de `## Hallazgos` de su informe, nunca su frontmatter ni su `## Veredicto`. `{{TESTCASES_COVERAGE_SECTION}}` no cambia. La confirmación pasa a `📄 Reporte generado: <ruta>/code-review-report.md (verdict: <VERDICT>)` — D-3, D-4, D-6, AC-1, AC-2
- [ ] T011 Paso 6 (l.563, l.574) y Paso 7 (l.594, l.622): condiciones con `$VERDICT = APPROVED` / `$VERDICT = NEEDS-CHANGES`. Las líneas ` Review status: …` pasan a ` Veredicto:        APPROVED` y ` Veredicto:        NEEDS-CHANGES`. `✅ Revisión aprobada — historia lista para verificación final` y `⚠️  Revisión completada con hallazgos críticos` se mantienen — D-6, AC-1
- [ ] T012 Objetivo, Posicionamiento y Salida: l.22 «con la decisión final» → «con el veredicto»; l.29-30, l.46-47, l.58 y l.661 con `APPROVED` / `NEEDS-CHANGES`; l.57 «veredicto y hallazgos por dimensión». Revisar la tabla de Manejo de errores por si nombra valores heredados — D-8, AC-1, AC-2

## 4. Soporte de story-code-review

- [ ] T013 [P] `skills/story-code-review/README.md`: l.11 «deja un veredicto consolidado (`APPROVED` \| `NEEDS-CHANGES`)»; l.16 «solo cuando el veredicto es `NEEDS-CHANGES`» — D-8, AC-1
- [ ] T014 [P] `skills/story-code-review/examples/example-approved/code-review-report.md`: aplicar la forma del template de T004-T005. `verdict: APPROVED` en l.5, `## Veredicto` como primer `##` tras el título con `` **Veredicto:** `APPROVED` — Sin hallazgos bloqueantes (severidad máxima: ninguna). `` y su justificación, sin la fila `Review status` (l.21) y sin `## Decisión final` (l.54-61) — D-2, D-3, D-8, AC-1
- [ ] T015 [P] `skills/story-code-review/examples/example-needs-changes/fix-directives.md`: aplicar D-5 en l.5, l.17 y l.40 (sin `review-status`, línea «Veredicto de origen», paso 4 con `APPROVED`) — D-5, D-8, AC-2
- [ ] T016 [P] `skills/story-code-review/examples/example-needs-changes-medium/fix-directives.md`: aplicar D-5 en l.5, l.17 y l.40-42; en l.45, «→ needs-changes» → «→ `NEEDS-CHANGES`» — D-5, D-8, AC-2

## 5. Consumidores

- [ ] T017 [P] `skills/story-implement-tasks/SKILL.md` l.69: «(`needs-changes`)» → «(veredicto `NEEDS-CHANGES`)». No cambiar la detección por presencia de `fix-directives.md` (l.150, pre-paso 2f) ni la lectura de `round`, la tabla y la lista blanca — D-7, D-8, AC-2
- [ ] T018 [P] `skills/story-implement/README.md` l.21: `[approved: → CODE-REVIEW/DONE | rechazo: …]` → `[APPROVED: → CODE-REVIEW/DONE | NEEDS-CHANGES: …]`. `skills/story-implement/SKILL.md` no cambia — D-7, D-8, AC-2

## 6. DoD y documentación vigente

- [ ] T019 [P] l.25 de `docs/guardrails/dod-story-code-review.md` y de `skills/sddf-constitution/assets/dod-story/dod-story-code-review.md`: «(Review status approved en `code-review-report.md`)» → «(`verdict: APPROVED` en `code-review-report.md`)», con el mismo texto en ambos — D-8, AC-1
- [ ] T020 [P] `docs/guides/sddf-commands-pipeline.md` l.225, l.231, l.232 y l.234: valores canónicos `APPROVED` / `NEEDS-CHANGES` y, si nombra el campo, `verdict` en lugar de `review-status` — D-8, AC-1, AC-2
- [ ] T021 [P] `docs/architecture/state-machine.md` l.49 y l.102, y `docs/domains/domain-story-lifecycle.md` l.98 y l.116: `needs-changes` → `NEEDS-CHANGES` — D-8, AC-1, AC-2

## 7. Excepción de la policy

- [ ] T022 `docs/policies/validation-contract-policy.md` §6 «Excepciones»: añadir la fila de D-10 (`story-code-review` · `status: approved | needs-changes` y `## Veredicto` en los informes parciales de los subagentes, `agents/*.agent.md` y `examples/*/*-report.md` · intermedios de `.tmp/`; el árbitro solo lee `max-severity` y no los copia al reporte (D-4); alinear los subagentes queda fuera del alcance · STORY-141). Si `Sin excepciones vigentes.` es la única entrada, la fila la reemplaza; si ya hay filas de otras historias, se añade a continuación. Subir la versión menor de la policy y añadir la fila correspondiente en «Historial de cambios» — D-10, D-11, AC-2

## 8. Evals

- [ ] T023 [P] `skills/story-code-review/evals/evals.json`: aplicar la tabla de D-9. TC-001, TC-006, TC-008 y TC-011 afirman `"(verdict: APPROVED)"` y `"Veredicto:"`, con `not_contains` `"(verdict: NEEDS-CHANGES)"`. TC-002, TC-005, TC-007, TC-009, TC-010 y TC-012…TC-015 afirman `"(verdict: NEEDS-CHANGES)"` y `"Veredicto:"`, con `not_contains` `"(verdict: APPROVED)"`. TC-003, TC-004 y TC-016 llevan `not_contains` `"(verdict: "`. Retirar los literales `approved` y `needs-changes` de las aserciones y conservar `Revision aprobada`. TC-001 añade `"Sin hallazgos bloqueantes"` y TC-002 `"hallazgo(s) bloqueante(s)"`. Renombrar TC-006 (`advertencia-tamano-cambio-no-afecta-veredicto`) y TC-011 (`aprobacion-elimina-fix-directives-previo`). Actualizar las `description` de TC-001, TC-006, TC-007, TC-011, TC-014 y TC-015 y la del skill («veredicto APPROVED, veredicto NEEDS-CHANGES»). `version` → `1.1.0`. Validar con `node -e "JSON.parse(require('fs').readFileSync('skills/story-code-review/evals/evals.json','utf8'))"` que queda JSON válido con 16 casos — D-9, AC-1, AC-2, CNF-1
- [ ] T024 [P] `skills/story-implement-tasks/evals/evals.json`: la `description` de TC-004 pasa de «eliminado por un approved posterior» a «eliminado tras un veredicto APPROVED posterior». TC-001 no cambia. `version` → `1.0.1` y JSON válido — D-9, AC-2
- [ ] T025 [P] `skills/story-implement/evals/evals.json`: en TC-016 (≈l.1143), eliminar la clave `"review-status"` del fixture `fix_directives.frontmatter` sin tocar el resto del caso. `version` → `1.3.1` y JSON válido — D-9, AC-2

## 9. Verificación

- [ ] T026 [P] V-1: ejecutar el `grep -rn -E "review-status|Review status|REVIEW_STATUS|\bapproved\b|needs-changes|Decisión final"` del diseño sobre `skills/story-code-review`, `skills/story-implement`, `skills/story-implement-tasks`, `skills/sddf-constitution/assets/dod-story`, `docs/guardrails/dod-story-code-review.md`, `docs/guides/sddf-commands-pipeline.md`, `docs/architecture/state-machine.md` y `docs/domains/domain-story-lifecycle.md`. Solo devuelve líneas de `agents/*.agent.md`, `examples/*/*-report.md` y los `name` de evals con `needs-changes` — AC-1, AC-2
- [ ] T027 [P] V-2, V-3 y V-4 sobre `code-review-report-template.md`: `grep -n -E '^(verdict|review-status):'` devuelve solo `verdict`; `grep -n '^#'` muestra `# Code Review Report: {{STORY_ID}}`, `## Veredicto` y `## Resumen` en ese orden, sin `## Decisión final`; `grep -c '{{VERDICT}}'` = 2 — AC-1
- [ ] T028 [P] V-5: `grep -n -E 'review-status|approved' skills/story-code-review/assets/fix-directives-template.md` no devuelve nada, y una lectura confirma que `round`, la tabla «Instrucciones de corrección» (6 columnas) y la «Lista blanca» siguen intactas — AC-2
- [ ] T029 [P] V-6 y V-7: con `git diff skills/story-code-review/SKILL.md`, confirmar que en 4a, 4b, 4c y 4c.1 solo cambian nombres y valores: misma tabla de umbrales (`{LOW, ninguna}` → `APPROVED`, `{HIGH, MEDIUM}` → `NEEDS-CHANGES`), mismo fail-safe y misma severidad DoD. Recorrer las dos filas de los Ejemplos de AC-1 sobre 4c-5b y comprobar el `verdict`, la línea `**Veredicto:**` y el motivo de D-3. Leer el Paso 5b y confirmar que solo inserta la tabla `## Hallazgos` de cada informe — AC-1, AC-2, CNF-1
- [ ] T030 [P] V-8: `git diff --stat skills/story-implement/SKILL.md skills/story-implement-tasks/SKILL.md` muestra solo el cambio de l.69 de `story-implement-tasks`. Recorrer el flujo F-2 (2c y 2f de `story-implement-tasks`, Paso 0c de `story-implement`) sobre `examples/example-needs-changes/fix-directives.md` y confirmar que encuentra `round`, la tabla y la lista blanca como antes — AC-2
- [ ] T031 [P] V-9: leer `docs/policies/validation-contract-policy.md` y confirmar la fila de D-10 en §6, la nueva versión menor y su fila en «Historial de cambios» — AC-2
- [ ] T032 V-10: comparar el template, 4c y 5b con la policy publicada, punto por punto C-1…C-7 de D-11 (más las diferencias anotadas en T001). Anotar el resultado en `implement-report.md` — AC-1
- [ ] T033 V-11: ejecutar `npm run verify:repository` y `npm test` y compararlos con la línea base de T003 (ningún fallo nuevo). Con `git status`, comprobar que solo cambian los archivos de «Componentes afectados» del diseño y los artefactos de la historia, y que `agents/*.agent.md`, los `*-report.md` de `examples/`, `docs/specs/**` y `skills/memory-system/examples/**` no cambian — AC-1, AC-2
- [ ] T034 V-12 (manual, a criterio humano según AGENTS.md): proponer al mantenedor `npm run test:eval -- story-code-review`, `npm run test:eval -- story-implement-tasks` y `npm run test:eval -- story-implement`. Registrar en `implement-report.md` si se ejecutaron y su resultado. No lanzarlos de forma automática — AC-1, AC-2, CNF-1
