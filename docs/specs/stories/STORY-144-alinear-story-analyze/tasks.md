---
type: tasks
id: STORY-144
slug: STORY-144-alinear-story-analyze-tasks
title: "Tasks: Alinear story-analyze"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-25-unificar-contrato-de-validaciones-en-skills
story: STORY-144
design: STORY-144
created: 2026-10-17
updated: 2026-10-18
related:
  - STORY-144-alinear-story-analyze
  - STORY-144-alinear-story-analyze-design
---

<!-- Referencias -->
[[STORY-144-alinear-story-analyze]] · [[STORY-144-alinear-story-analyze-design]]

> Orden: línea base (policy publicada) → template del reporte → `SKILL.md` de story-analyze → soporte de story-analyze → `story-plan` → `story-fix-plan` → documentación vigente → evals → verificación.
> Las tareas sin `[P]` de un mismo grupo editan el mismo archivo y van en orden. Las tareas `[P]` editan archivos distintos. Las de verificación son de solo lectura y pueden ir en paralelo, salvo la conformidad final y el gate.
> Los números de línea vienen del «Estado medido» del diseño (2026-10-17). Si se han movido, se localiza el texto por contenido.
> No se modifican la policy, `docs/architecture/diagrams/flowchart-story-plan.mermaid`, los `analyze.md` de `docs/specs/**`, el gate de `story-fix-plan` ni su alias `veredict` (D-7), la tabla «Clasificación de severidad» ni las Correlaciones 1-6 (CNF-1), `CHANGELOG.md`, `package.json` ni las copias de `.claude/`. Todo archivo modificado se guarda en UTF-8 sin BOM.

## 1. Línea base

- [x] T001 Comprobar que `docs/policies/validation-contract-policy.md` existe (D-11). Si no existe, detener la historia sin editar nada: STORY-138 no está implementada. Si existe, leer G-01…G-06, la fila `story-analyze` de §4 (`APPROVED`, `NEEDS-CHANGES`), sus filas de §5 (`✓ Coherente` y `⚠️ Advertencias` → `APPROVED`; `❌ Inconsistencias bloqueantes` → `NEEDS-CHANGES`), la regla D-7 de reportes heredados, §6 «Excepciones» y el ejemplo §7.3. Anotar cualquier diferencia con los puntos C-1…C-6 de D-10 y aplicar la versión publicada — D-10, D-11, AC-1
- [x] T002 [P] Confirmar el «Estado medido» del diseño con `grep -n -E 'Estado general|overall_status|Coherente|Inconsistencias bloqueantes|ERROR|sin ERROREs|verdict'` sobre `skills/story-analyze/SKILL.md` (l.35-36, 52-62, 138, 411-420, 441-459, 478-539, 563-565, 571-597), `skills/story-analyze/assets/analyze-report-template.md` (l.1-29, l.81), `skills/story-analyze/README.md` (l.15-16), `skills/story-analyze/examples/output/analyze.md` (l.29), `skills/story-plan/SKILL.md` (l.47, 63, 313-325, 373-393, 419, 429-431), `skills/story-plan/README.md` (l.17, 66), `skills/story-plan/assets/README.md` (l.38), `skills/story-plan/examples/output/plan-summary.md` (l.23, 39-64), `skills/story-fix-plan/SKILL.md` (l.136-148, 253), `skills/story-fix-plan/assets/fix-plan-report-template.md` (l.29), los tres `skills/story-fix-plan/examples/*/analyze.md` (l.14-26), `docs/architecture/state-machine.md` (l.100) y `docs/requirements/functional/FR-038-analisis-transversal-de-coherencia-gate-del-dod.md` (l.17-20). Si alguna pieza falta o no coincide con el inventario de D-8, detener e informar cuál — Context, D-8
- [x] T003 [P] Registrar la línea base del gate: resultado de `npm run verify:repository` y de `npm test` en la rama actual, para distinguir después fallos nuevos de previos — V-10

## 2. Template del reporte de coherencia

- [x] T004 `skills/story-analyze/assets/analyze-report-template.md`, frontmatter: añadir `verdict: {APPROVED | NEEDS-CHANGES}` después de `tasks` y antes de `created`. El resto de campos no cambia y no se añaden `errors` ni `warnings` — D-2, AC-1
- [x] T005 Mismo template, cuerpo: insertar entre `# Reporte de Coherencia: {story_title}` y `## Resumen Ejecutivo` la sección `## Veredicto` con un comentario guía de una línea («línea según la regla de Veredicto del Paso 6») y `` **Veredicto:** `{verdict}` — {motivo} ``, como en el «Esquema de datos» del diseño. Eliminar `**Estado general:** {overall_status}` y su comentario (l.28-29). La tabla de métricas del Resumen Ejecutivo se conserva entera. El comentario de tipos de INC (l.81) lista A-F, como la tabla del Paso 6 — D-3, D-4, AC-1

## 3. `SKILL.md` de story-analyze

- [x] T006 Paso 6, tras la tabla «Clasificación de severidad» (l.411-420, que no cambia): añadir la subsección `#### Veredicto` con la tabla de dos filas de D-1, evaluada en orden (1: al menos un hallazgo ERROR, tipo A, B o E con `enforcement: error` → `NEEDS-CHANGES`; 2: en otro caso → `APPROVED`). Indicar que el resultado se registra una sola vez como `$VERDICT` y que los Pasos 8-10 lo leen sin recalcularlo. Añadir la aclaración «Qué no es un hallazgo» (correlación omitida por falta de `tasks.md` o `testcases.md`, épica no encontrada, DoD no disponible). Añadir la regla del motivo de D-3: las tres formas fijas y `<tipos>` como conjunto de tipos de esa severidad, en orden A-F y separados por `, `, donde un criterio DoD `❌` o `⚠️` aporta el tipo E — D-1, D-3, AC-1, CNF-1
- [x] T007 l.138: «Un hallazgo ERROR (tipo A, B o E) determina el veredicto `NEEDS-CHANGES` (Paso 6), que bloquea la transición a `READY-FOR-IMPLEMENT`», más una línea que remite a `docs/policies/validation-contract-policy.md` de Agile-SDDF, en código en línea y sin enlace — D-8, AC-1, AC-2
- [x] T008 Paso 8 (l.441-459): añadir `verdict: <$VERDICT>` con el comentario `# APPROVED | NEEDS-CHANGES (Paso 6, Veredicto)` después de `tasks` y antes de `created` en el frontmatter transcrito; añadir el punto «Veredicto: sección `## Veredicto` con la línea de la regla de Veredicto del Paso 6, primer `##` tras el título»; el punto «Resumen ejecutivo» deja de pedir el estado general. Las reglas condicionales de `testcases` y `tasks` no cambian — D-2, D-3, D-4, AC-1
- [x] T009 Paso 9a (l.478-489): la transición decide por `$VERDICT`: `APPROVED` → `status: READY-FOR-IMPLEMENT` / `substatus: DONE`; `NEEDS-CHANGES` → sin cambio en `story.md`. Añadir el Paso 9b, válido en ambos modos: tras guardar, emitir `✓ Análisis guardado: <ruta>/analyze.md (verdict: <VALOR>)` — D-5, AC-1, AC-2
- [x] T010 Paso 10 (l.493-539, solo modo manual): sustituir la primera línea `✅ Análisis guardado: …` por una referencia a la línea de 9b, que ya se mostró. En `📊 Resumen de coherencia`, añadir `Veredicto: <VALOR> — <motivo>` antes de `Estado story.md`. El cierre `⛔` añade `Veredicto NEEDS-CHANGES — corrige el plan con /story-fix-plan <STORY-NNN> y vuelve a ejecutar /story-analyze <STORY-NNN>`. El cierre `✅ Sin inconsistencias bloqueantes…` se conserva para `APPROVED` — D-5, AC-1, AC-2
- [x] T011 Objetivo, Posicionamiento, ciclo de vida y Salida: l.35-36 «Genera `analyze.md` con un veredicto `APPROVED` o `NEEDS-CHANGES` en `## Veredicto` y en `verdict`» · «Actualiza `story.md` a `READY-FOR-IMPLEMENT/DONE` con veredicto `APPROVED`»; l.52-54 y l.59-62 con la condición `verdict: APPROVED` / `verdict: NEEDS-CHANGES`; l.563-565 «`READY-FOR-IMPLEMENT / DONE` con `verdict: APPROVED`; sin cambio con `NEEDS-CHANGES`» — D-8, AC-1, AC-2
- [x] T012 Template de fallback de `## Salida` (l.571-597): añadir `verdict: {verdict}` en el frontmatter (después de `tasks`, antes de `created`), insertar `## Veredicto` con la línea `` **Veredicto:** `{verdict}` — {motivo} `` entre el `#` y `## Resumen Ejecutivo`, y eliminar `**Estado general:**` (l.597) — D-2, D-3, D-4, AC-1

## 4. Soporte de story-analyze

- [x] T013 [P] `skills/story-analyze/README.md` l.15-16: «`analyze.md` con veredicto `APPROVED` o `NEEDS-CHANGES`, cobertura, inconsistencias y recomendaciones» · «solo con veredicto `APPROVED`» — D-8, AC-1
- [x] T014 [P] `skills/story-analyze/examples/output/analyze.md`: añadir `verdict: NEEDS-CHANGES` en el frontmatter (después de `tasks`), insertar `## Veredicto` con `` **Veredicto:** `NEEDS-CHANGES` — ERROR de tipo E `` como primer `##` tras el título y eliminar la línea `**Estado general:**` (l.29). INC-001 y el resto del cuerpo no cambian — D-2, D-3, D-4, D-8, AC-1

## 5. `story-plan`

- [x] T015 `skills/story-plan/SKILL.md` l.47 y l.63: «→ READY-FOR-IMPLEMENT/DONE con verdict APPROVED» en lugar de la condición «sin ERROREs» — D-8, AC-2
- [x] T016 Paso 5 (l.313-325): tras invocar `story-analyze`, leer `verdict` del frontmatter de `<directorio>/analyze.md` (G-06) y la línea `**Veredicto:**` solo para el motivo. Sustituir la decisión por «inconsistencias (ERRORs o WARNINGs)» por la tabla de cuatro filas de D-6 (`APPROVED` → `✓ … (verdict: APPROVED)`; `NEEDS-CHANGES` → `⚠️ … (verdict: NEEDS-CHANGES)`; ausente o fuera de los valores permitidos → `✗ story-analyze — analyze.md sin verdict válido`; sin `analyze.md` → `✗ story-analyze — error técnico`, sin cambio). Añadir la guardia de cierre ante fallo: si el veredicto no es `APPROVED` y `story.md` quedó en `READY-FOR-IMPLEMENT`, restaurar `PLAN/IN-PROGRESS` y emitir `⚠️ story.md estaba en READY-FOR-IMPLEMENT sin verdict APPROVED — restaurado a PLAN/IN-PROGRESS`. `story-plan` nunca escribe `READY-FOR-IMPLEMENT` — D-6, AC-2
- [x] T017 Paso 6, resumen final (l.373-393): elegir la rama por el veredicto con la tabla de D-6. `APPROVED`: añadir `Veredicto de story-analyze: APPROVED — <motivo>`. `NEEDS-CHANGES`: `Veredicto de story-analyze: NEEDS-CHANGES — <motivo>`, `→ <ruta>/analyze.md`, `Estado de story.md: PLAN/IN-PROGRESS (veredicto NEEDS-CHANGES)` y `Corrige el plan con /story-fix-plan <story_id> y vuelve a ejecutar /story-analyze <story_id>.`, sin «hay ERROREs pendientes». Rama nueva `--skip-analyze` sin fallos: `✅ Planning completo (sin gate de coherencia)`, `ℹ️ Sin veredicto: se omitió el gate con --skip-analyze` y `Estado de story.md: PLAN/IN-PROGRESS`, sin nombrar `story-analyze` ni `analyze.md`. `Estado de story.md` muestra el `status`/`substatus` leído de `story.md` tras el Paso 5. Leyenda: `✓ completado (APPROVED) · ⚠️ veredicto NEEDS-CHANGES · ✗ fallido · — no ejecutado` — D-6, AC-2
- [x] T018 Manejo de errores (l.419) y Salida (l.429-431): fila nueva para `verdict` ausente o no permitido (`✗`, guardia y rama «Pipeline interrumpido», F-3); la Salida describe el estado final de `story.md` según el veredicto — D-6, AC-2
- [x] T019 [P] `skills/story-plan/README.md` l.17 y l.66, y `skills/story-plan/assets/README.md` l.38: «si verdict APPROVED» en lugar de «si sin ERROREs» — D-8, AC-2
- [x] T020 [P] `skills/story-plan/examples/output/plan-summary.md` l.23 y l.39-64: líneas de progreso con `(verdict: <VALOR>)` y resúmenes de las ramas `APPROVED` y `NEEDS-CHANGES` de D-6, con la línea `Veredicto de story-analyze:` en ambos casos — D-6, D-8, AC-2

## 6. `story-fix-plan`

- [x] T021 `skills/story-fix-plan/SKILL.md` l.138: registrar el motivo de la línea `**Veredicto:**` (el texto tras `— `) en lugar de la línea `**Estado general:**`; si la línea no existe (reporte heredado), registrar `—`. l.148: «El veredicto se lee solo del frontmatter: no se infiere del cuerpo del reporte.» l.253: `<estado general>` → `<motivo del veredicto>`. El gate (l.140-146) y el alias `veredict` no cambian — D-7, AC-1
- [x] T022 [P] `skills/story-fix-plan/assets/fix-plan-report-template.md` l.29: `<estado general>` → `<motivo del veredicto>` — D-7, AC-1
- [x] T023 [P] `skills/story-fix-plan/examples/example-coherente/analyze.md` l.14-26: insertar `## Veredicto` tras el título con `` **Veredicto:** `APPROVED` — sin inconsistencias `` y eliminar `**Estado general:**` (l.26). `verdict` y el resto del cuerpo no cambian — D-3, D-8, AC-1
- [x] T024 [P] `skills/story-fix-plan/examples/example-con-hallazgos/analyze.md` l.14-26: `## Veredicto` con `` **Veredicto:** `NEEDS-CHANGES` — ERROR de tipo A, B; WARNING de tipo D, E `` y eliminar l.26. Las INC, su numeración y `verdict` no cambian — D-3, D-8, AC-1
- [x] T025 [P] `skills/story-fix-plan/examples/example-solo-testcases/analyze.md` l.14-26: `## Veredicto` con `` **Veredicto:** `NEEDS-CHANGES` — ERROR de tipo E; WARNING de tipo F `` y eliminar l.26. Las INC y `verdict` no cambian — D-3, D-8, AC-1

## 7. Documentación vigente

- [x] T026 [P] `docs/architecture/state-machine.md` l.100: «(sin ERRORs)» → `READY-FOR-IMPLEMENT/DONE` (`verdict: APPROVED`) — D-8, AC-2
- [x] T027 [P] `docs/requirements/functional/FR-038-analisis-transversal-de-coherencia-gate-del-dod.md` l.17-20: «Declara el veredicto `APPROVED` o `NEEDS-CHANGES` en `verdict` y en `## Veredicto`. Con `APPROVED` (sin hallazgos `ERROR`) SHALL promover…»; actualizar `updated` — D-8, AC-1, AC-2

## 8. Evals

- [x] T028 [P] `skills/story-analyze/evals/evals.json`: aplicar la tabla de D-9. TC-001 `contains` `"## Veredicto"` y `"(verdict: APPROVED)"`, `not_contains` `"Estado general"` y `"NEEDS-CHANGES"`. TC-002 y TC-003 añaden `"## Veredicto"` a `not_contains`. TC-004 `contains` `"(verdict: NEEDS-CHANGES)"`, `` "**Veredicto:** `NEEDS-CHANGES`" `` y `"ERROR de tipo A"`, `not_contains` `"(verdict: APPROVED)"` y `"Estado general"`. TC-005 `contains` `"(verdict: APPROVED)"`. Añadir TC-006 «solo WARNING» (artefactos completos, un componente de `design.md` sin tarea, tipo C, ningún ERROR): `contains` `"(verdict: APPROVED)"`, `"WARNING de tipo C"` y `"READY-FOR-IMPLEMENT"`; `not_contains` `"NEEDS-CHANGES"` y `"Estado general"`. `version` → `1.1.0`. Cadenas nuevas en ASCII o literales del template. Validar con `node -e "JSON.parse(require('fs').readFileSync('skills/story-analyze/evals/evals.json','utf8'))"` que queda JSON válido con 6 casos — D-9, AC-1, CNF-1
- [x] T029 [P] `skills/story-plan/evals/evals.json`: TC-001 `contains` `"(verdict: APPROVED)"` y `"Veredicto de story-analyze: APPROVED"`. TC-005 `contains` `"Sin veredicto"` y conserva sus `not_contains`. Añadir TC-006 (`story-analyze` deja `verdict: NEEDS-CHANGES` con INC-001 tipo A): `contains` `"(verdict: NEEDS-CHANGES)"`, `"Veredicto de story-analyze: NEEDS-CHANGES"`, `"PLAN/IN-PROGRESS"` y `"/story-fix-plan"`; `not_contains` `"READY-FOR-IMPLEMENT"` y `"Planning completo"`. Añadir TC-007 (`verdict: APPROVED` con un WARNING tipo C): `contains` `"(verdict: APPROVED)"` y `"READY-FOR-IMPLEMENT/DONE"`; `not_contains` `"requiere revisión"` y `"hay ERROREs pendientes"`. `version` → `1.1.0` y JSON válido con 7 casos — D-9, AC-2
- [x] T030 [P] `skills/story-fix-plan/evals/evals.json`: en `description` y `context` de TC-002, TC-004 y TC-012, sustituir «'✓ Coherente'», «Estado general ❌» y «Estado general ⚠️ Advertencias» por la línea `**Veredicto:**` de cada caso (T023-T025). Las aserciones no cambian. TC-011 conserva «Estado general» porque describe un reporte heredado. `version` → `1.0.1` y JSON válido — D-9, AC-1

## 9. Verificación

- [x] T031 [P] V-1 y V-2: `grep -n "verdict" skills/story-analyze/assets/analyze-report-template.md skills/story-analyze/SKILL.md` muestra las tres apariciones de D-2 (template, Paso 8, fallback). `grep -n '^#' skills/story-analyze/assets/analyze-report-template.md` muestra `# Reporte de Coherencia: {story_title}`, `## Veredicto` y `## Resumen Ejecutivo` en ese orden; lo mismo en el bloque de fallback de `SKILL.md` — AC-1
- [x] T032 [P] V-3 y V-8: `grep -rn -E "Estado general|overall_status|estado general" skills/story-analyze skills/story-plan skills/story-fix-plan` solo devuelve el `context` de TC-011 de `story-fix-plan` y los `not_contains` de `skills/story-analyze/evals/evals.json`. `grep -rn -E "Coherente|Inconsistencias bloqueantes|sin ERROREs" skills/story-analyze skills/story-plan skills/story-fix-plan docs/architecture/state-machine.md docs/requirements/functional/FR-038-*.md` solo devuelve el `context` de TC-011 — AC-1, AC-2
- [x] T033 [P] V-4 y V-5: con `git diff skills/story-analyze/SKILL.md`, confirmar que la tabla «Clasificación de severidad» y las Correlaciones 1-6 no tienen líneas modificadas y que la regla de Veredicto cita «A, B o E» como l.138. Recorrer las tres filas de los Ejemplos de AC-1 (ninguna, solo WARNING, al menos un ERROR) sobre los Pasos 6, 8 y 9 y comprobar `verdict`, la línea `**Veredicto:**` con su motivo de D-3 y la transición de `story.md` del Paso 9a — AC-1, AC-2, CNF-1
- [x] T034 [P] V-6: en `skills/story-analyze/examples/output/analyze.md` y en los tres `skills/story-fix-plan/examples/*/analyze.md`, `verdict` coincide con el valor de `**Veredicto:**`, `## Veredicto` es el primer `##` tras el `#` y no queda `**Estado general:**`. Usar `npm run verify:validation-contract -- --report <ruta>` si STORY-143 ya está implementada; si no, lectura — AC-1
- [x] T035 [P] V-7: leer los Pasos 5 y 6 de `skills/story-plan/SKILL.md` y recorrer el escenario de AC-2 con `NEEDS-CHANGES` (story.md no pasa a `READY-FOR-IMPLEMENT`, el resumen informa el veredicto), con `APPROVED` (pasa a `READY-FOR-IMPLEMENT/DONE`), con `verdict` ausente (F-3: `✗` y guardia) y con `--skip-analyze` (rama sin veredicto, sin `story-analyze` ni `analyze.md` en el texto) — AC-2
- [x] T036 V-9: comparar C-1…C-6 de D-10 con la policy publicada y anotar el resultado y cualquier diferencia en `implement-report.md`. §6 sigue con `Sin excepciones vigentes.` para `story-analyze` — D-10, AC-1
- [x] T037 V-10: ejecutar `npm run verify:repository` y `npm test` y compararlos con la línea base de T003; no debe aparecer ningún fallo nuevo — AC-1, AC-2
- [x] T038 V-11 (manual, a criterio humano según AGENTS.md): proponer al mantenedor `npm run test:eval -- story-analyze`, `npm run test:eval -- story-plan` y `npm run test:eval -- story-fix-plan`, y registrar en `implement-report.md` si se ejecutaron y su resultado — AC-1, AC-2, CNF-1
