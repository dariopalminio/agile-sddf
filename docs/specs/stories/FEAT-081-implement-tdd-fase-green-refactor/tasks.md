---
alwaysApply: false
type: tasks
id: FEAT-081
slug: FEAT-081-implement-tdd-fase-green-refactor-tasks
title: "Tasks: story-implement — Fases GREEN y REFACTOR: implementar código y refactorizar"
date: 2026-05-30
status: SPECIFYING
substatus: IN-PROGRESS
parent: EPIC-14-fabrica-de-skills
story: FEAT-081
design: FEAT-081
related:
  - FEAT-081-implement-tdd-fase-green-refactor
  - FEAT-078-implement-tdd-fase-red
  - FEAT-082-implement-tdd-modos-ejecucion
---

<!-- Referencias -->
[[FEAT-081-implement-tdd-fase-green-refactor]]

## 1. Setup — Evals antes de implementar (TDD)

- [x] 1.1 Extender `.claude/skills/story-implement/evals/evals.json` con tres casos nuevos: TC-004 (happy path: GREEN exitoso + REFACTOR exitoso → story.md actualizada a CODE-REVIEW/IN-PROGRESS + cycle-status.json escrito), TC-005 (Fase GREEN falla → ❌ con nombre del skill, REFACTOR no ejecutado, story.md sin cambio), TC-006 (REFACTOR introduce regresiones → ⚠️ con lista de tests, story.md sin cambio) — D-9, AC-1, AC-2, AC-3

## 2. Implementación — Extender SKILL.md con Fases GREEN y REFACTOR

- [x] 2.1 Agregar Paso 7 al SKILL.md: verificar precondición leyendo `.tmp/story-implement/red-phase-status.json`; si no existe o `red_confirmed:false` emitir ❌ y detener; extraer `story_id`, `files_generated`, `generators_invoked` para el bundle de contexto — D-1, AC-1
- [x] 2.2 Agregar Paso 8 al SKILL.md: leer `implementing.code_generator` de `sddf-config.yaml`; validar existencia de `.claude/skills/{skill}/SKILL.md` con Glob; si `required:true` y no existe emitir ❌ y detener; si `required:false` y no existe emitir `[WARN]` y omitir GREEN y REFACTOR — D-2, D-3, AC-1
- [x] 2.3 Agregar Paso 9 al SKILL.md — Fase GREEN: invocar `code_generator` con bundle `{story_id, phase:"GREEN", test_files, story_path, design_path}`; el subagente escribe resultados en `.tmp/story-implement/green/results.json`; si retorna `status:error` emitir ❌ con nombre del skill y detener sin ejecutar REFACTOR ni modificar story.md — D-4, AC-1, AC-2
- [x] 2.4 Agregar Paso 9b al SKILL.md: confirmación estado GREEN; para cada tipo en `generators_invoked` ejecutar `defaults.{type}.command` de sddf-config.yaml; exit 0 → `✅ Fase GREEN exitosa — tipo: {tipo}`; exit ≠ 0 → `❌ Fase GREEN fallida: el skill '{nombre}' retornó error` + sugerencia de acción + detener sin REFACTOR ni modificar story.md; sin comando → `[INFO] confirmación GREEN omitida para tipo '{tipo}'` — D-5, AC-1, AC-2
- [x] 2.5 Agregar Paso 10 al SKILL.md — Fase REFACTOR: invocar `code_generator` con `phase:"REFACTOR"` y mismo bundle; subagente escribe en `.tmp/story-implement/refactor/results.json`; si retorna `status:error` emitir ❌ de REFACTOR (no-fatal, tests en verde) sin modificar story.md; si retorna `status:ok` ejecutar comandos de test; si algún test falla emitir `⚠️ Fase REFACTOR introdujo regresiones: <N> tests que pasaban ahora fallan` con lista de tests regresados y no modificar story.md — D-6, AC-1, AC-3
- [x] 2.6 Agregar Paso 11 al SKILL.md: si GREEN y REFACTOR completaron sin errores ni regresiones, actualizar frontmatter de story.md a `status: CODE-REVIEW / substatus: IN-PROGRESS` (y `updated: YYYY-MM-DD`); escribir `.tmp/story-implement/cycle-status.json` con `{story_id, red_confirmed, green_confirmed, refactor_confirmed, files_generated, files_modified, final_status, timestamp}` — D-7, D-8, AC-1
- [x] 2.7 Actualizar la sección "Qué hace este skill" del SKILL.md para reemplazar el alcance solo-RED por el ciclo completo (RED + GREEN + REFACTOR), actualizando la descripción, los bullets "Qué hace" y "Qué NO hace" — D-9
- [x] 2.8 Extender la tabla "Manejo de errores" del SKILL.md con los nuevos casos: precondición RED no cumplida, `code_generator` no encontrado, Fase GREEN fallida (subagente error), Fase GREEN fallida (tests no pasan), REFACTOR fallido (subagente error), REFACTOR con regresiones — D-1, D-3, D-5, D-6

## 3. Verificación — Validar escenarios de los ACs

- [x] 3.1 [P] Verificar eval TC-004 (happy path GREEN + REFACTOR): code_generator válido retorna `status:ok` en ambas fases, tests pasan tras GREEN y siguen pasando tras REFACTOR → confirmar que story.md cambia a CODE-REVIEW/IN-PROGRESS y cycle-status.json contiene `red_confirmed:true`, `green_confirmed:true`, `refactor_confirmed:true` — AC-1
- [x] 3.2 [P] Verificar eval TC-005 (Fase GREEN falla): code_generator retorna `status:error` en Fase GREEN → confirmar ❌ con nombre del skill, Paso 10 no ejecutado, story.md sin cambio de estado — AC-2
- [x] 3.3 [P] Verificar eval TC-006 (REFACTOR introduce regresiones): GREEN exitoso pero tests fallan tras REFACTOR → confirmar ⚠️ con cantidad y nombres de tests regresados, story.md sin cambio de estado — AC-3
