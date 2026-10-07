---
alwaysApply: false
type: tasks
id: STORY-119
slug: STORY-119-story-plan-un-subagente-por-paso-tasks
title: "Tasks: Ejecutar cada paso de /story-plan en un subagente aislado para consumir menos tokens"
status: PLAN
substatus: DONE
parent: EPIC-17-remediating-and-improvement
story: STORY-119
design: STORY-119
created: 2026-10-07
updated: 2026-10-07
related:
  - STORY-119-story-plan-un-subagente-por-paso
  - STORY-119-story-plan-un-subagente-por-paso-design
---

<!-- Referencias -->
[[STORY-119-story-plan-un-subagente-por-paso]] · [[STORY-119-story-plan-un-subagente-por-paso-design]]

> Orden obligatorio (D-8 de `design.md` y principio 11 de la constitución): línea base → **evals primero** → flags de
> los workers → orquestador → documentación → verificación → medición CNF-1/CNF-2. Los auxiliares viven en
> `.tmp/story-119/` (no versionado). Solo se editan archivos de `skills/`; `.claude/skills/` es copia instalada.

## 1. Preparación — línea base

- [x] T001 [P] Ejecutar `npm test`, `node scripts/verify-eval-inventory.js` y `npm run test:eval -- story-plan --dry-run`; guardar resultado y conteos en `.tmp/story-119/baseline.txt`. Si algo no está en verde, detenerse — CNF-6
- [x] T002 [P] Anotar en `baseline.txt` el último `TC-NNN` de `skills/story-plan/evals/evals.json` (esperado TC-005) y de `skills/story-{design,tasking,analyze}/evals/evals.json`, para numerar los casos nuevos con el siguiente libre — D-8

## 2. Evals primero — `story-plan`

Cada caso usa el formato de TC-004 (`input` con `input_path: "examples/input"`, `story_id: "STORY-099"`, `flags`) y describe en `input` el mundo simulado: `runtime_subagents`, `existing_artifacts`, `user_answer`, `subagent_results` (por paso, la línea `STATUS:` que escribe cada subagente).

- [x] T003 Agregar TC-006 `pipeline-subagentes-happy-path` (modo default, `runtime_subagents: true`, sin artefactos, los 4 resultados `STATUS: OK`). `contains`: `Ejecución: subagentes (un contexto aislado por paso)`, `[1/4] → story-design`, `[4/4] ✓ story-analyze`, `.tmp/story-plan/STORY-099/design.result.md`, `.tmp/story-plan/STORY-099/analyze.result.md`, `Planning completo`. `not_contains`: `¿Qué deseas hacer?`, `Pipeline interrumpido` — D-1, D-4, D-5, AC-1
- [x] T004 Agregar TC-007 `artefactos-existentes-solo-faltantes` (`existing_artifacts: ["design.md","tasks.md"]`, `user_answer: "f"`). `contains`: `Artefactos de planning existentes`, `(f) Solo los que faltan`, `--skip-existing`, `sin cambios (--skip-existing)`, `testcases.md generado`. `not_contains`: `(r) Regenerar` (la pregunta de los workers) — D-2, D-3, AC-2
- [x] T005 Agregar TC-008 `artefactos-existentes-cancelar` (`existing_artifacts: ["design.md"]`, `user_answer: "c"`). `contains`: `Pipeline cancelado — ningún archivo modificado`. `not_contains`: `Iniciando pipeline de planning`, `PLAN/IN-PROGRESS`, `[1/4] → story-design`, `.result.md` — D-2, AC-2
- [x] T006 Agregar TC-009 `fail-en-design-corta-cadena` (`subagent_results.design: "STATUS: FAIL"`). `contains`: `[1/4] ✗ story-design`, `Pipeline interrumpido en: story-design`, tabla con `—` para tasking/testcases/analyze. `not_contains`: `[2/4] → story-tasking`, `[3/4] → story-testcases`, `[4/4] → story-analyze` — D-4, AC-3
- [x] T007 Agregar TC-010 `runtime-sin-subagentes-inline` (`runtime_subagents: false`, sin artefactos). `contains`: `Ejecución: inline (el runtime no admite subagentes)`, `[1/4] ✓ story-design — design.md generado`, `[4/4] ✓ story-analyze`, `design.md`, `tasks.md`, `testcases.md`, `analyze.md`. `not_contains`: `Ejecución: subagentes` — D-1, D-6, AC-4
- [x] T008 Revisar que TC-001…TC-005 no necesitan cambios: ninguno debe tener en `not_contains` la línea `Ejecución:` ni la ruta `.tmp/story-plan/`; si alguno choca, ajustar solo la expectativa afectada y anotarlo en `baseline.txt` — D-6, CNF-4

## 3. Evals primero — workers (AC-5)

- [x] T009 [P] `skills/story-design/evals/evals.json`: caso `force-sobrescribe-sin-preguntar` (`existing_artifacts: ["design.md"]`, `flags: ["--force"]`). `contains`: `design.md sobreescrito con --force`. `not_contains`: `(r) Regenerar`, `(n) No modificar` — D-3, AC-5
- [x] T010 [P] `skills/story-tasking/evals/evals.json`: caso `skip-existing-conserva-tasks` (`existing_artifacts: ["design.md","tasks.md"]`, `flags: ["--skip-existing"]`). `contains`: `tasks.md existente conservado (--skip-existing)`. `not_contains`: `(r) Regenerar`, `=== FILE:` de `tasks.md` — D-3, AC-5
- [x] T011 [P] `skills/story-analyze/evals/evals.json`: caso `force-regenera-analyze` (`existing_artifacts: ["design.md","tasks.md","analyze.md"]`, `flags: ["--force"]`). `contains`: `analyze.md sobreescrito con --force`. `not_contains`: `(r) Regenerar`, `(n) No modificar` — D-3, AC-5
- [x] T012 Ejecutar `node scripts/verify-eval-inventory.js` y `npm run test:eval -- story-plan story-design story-tasking story-analyze --dry-run`: JSON válido y plan no vacío con los casos nuevos — CNF-6

## 4. Workers — flags `--force` / `--skip-existing`

- [x] T013 [P] `skills/story-design/SKILL.md`: agregar `--force` y `--skip-existing` a `## Parámetros` (misma redacción que `--force` en `story-testcases`, más "mutuamente excluyentes"); reemplazar la pregunta del Paso 1d por la tabla de D-3 (sin flags = pregunta actual); agregar la fila "flags `--force` y `--skip-existing` simultáneos" a `### Manejo de errores` — D-3, AC-5
- [x] T014 [P] `skills/story-tasking/SKILL.md`: mismos cambios en `## Parámetros`, Paso 1f y manejo de errores (si no hay tabla de errores, agregar el mensaje junto al Paso 1f) — D-3, AC-5
- [x] T015 [P] `skills/story-analyze/SKILL.md`: mismos cambios en `## Parámetros` y Paso 1c; dejar explícito que con `--skip-existing` termina sin escribir `analyze.md` **ni** actualizar `story.md` (Paso 9a no se ejecuta) — D-3, D-4, AC-5
- [x] T016 [P] `skills/story-testcases/SKILL.md`: agregar `--skip-existing` a `## Parámetros` y a la viñeta de "Qué hace"; ampliar el Paso 1d con las filas de D-3 que faltan (`--skip-existing` y flags simultáneos); conservar el mensaje `[INFO] testcases.md sobreescrito con --force` — D-3, CR-001, AC-2

## 5. Orquestador — `skills/story-plan/SKILL.md`

- [x] T017 `## Parámetros` y tabla de `## Modos de ejecución`: agregar `--inline` (fuerza composición inline; combinable con los demás flags). `### Objetivo` y `## Restricciones / Reglas`: sustituir "delega la idempotencia" por "una única decisión inicial, ejecutada por los workers con `--force`/`--skip-existing`"; agregar la regla de un solo salto (ningún subagente lanza otro ni invoca skills orquestadores) — D-1, D-2, D-7, CNF-5
- [x] T018 Nuevo Paso 1e "Workers y artefactos existentes": comprobar los `SKILL.md` de los workers del modo en `<directorio de story-plan>/../<worker>/SKILL.md` (error `❌ No se encontró el skill worker <worker> en: <ruta>`); calcular `artefactos_del_modo` y `existentes`; pregunta única `(t)/(f)/(c)` con el texto literal de D-2; cancelación con `⏹ Pipeline cancelado — ningún archivo modificado`; tabla `$OVERWRITE` → flag por paso con la regla de instantánea — D-2, D-5, AC-2
- [x] T019 Nuevo Paso 1f "Modo de ejecución": regla de D-1 (`--inline` → herramienta de subagentes ausente → subagentes) con las tres líneas `Ejecución: …` literales — D-1, AC-1, AC-4
- [x] T020 Renumerar el actual 1e como 1g: `PLAN/IN-PROGRESS` incondicional **después** de la decisión; borrar y recrear `.tmp/story-plan/<STORY-ID>/`; añadir la línea `Ejecución:` a los tres banners (default, `--only-tasks`, `--only-testcases`) sin tocar las demás líneas — D-2, D-4, D-7, CNF-4
- [x] T021 Nueva sección `### Contrato de delegación por paso` (antes del Paso 2): prompt literal de D-5 (en Claude Code `Agent` con `subagent_type: general-purpose`; en otros runtimes, su mecanismo equivalente), formato y semántica del archivo de resultado de D-4 (tabla por paso, regla "ausente/ilegible ⇒ FAIL"), y regla inline de D-6 (el orquestador escribe el resultado) — D-4, D-5, D-6, AC-1, CNF-3
- [x] T022 Reescribir los Pasos 2-5: cada uno muestra `[n/total] → <worker>...`, ejecuta según el contrato con el flag de 1e, lee la línea 1 de `<paso>.result.md` y aplica OK→✓ / WARN→⚠️ / FAIL→✗; fail-fast en design/tasking/testcases, analyze no bloqueante; conservar literalmente los mensajes `[n/total] ✓ <worker> — <artefacto> generado` — D-4, D-6, AC-1, AC-3, CNF-4
- [x] T023 Paso 6: construir la tabla solo desde los archivos de resultado; estado de `story.md` tomado de la línea 3 de `analyze.result.md` (o `PLAN/IN-PROGRESS` si analyze no corrió); mensaje final ✗ → interrumpido / ⚠️ → requiere revisión / resto → completo; si el fallo fue del lanzamiento de un subagente, sugerir re-ejecutar con `--inline` — D-4, D-7, AC-1, AC-3
- [x] T024 `### Manejo de errores` y `## Salida`: filas de worker ausente, cancelación, resultado ausente/ilegible y fallo al lanzar subagente; agregar `.tmp/story-plan/<STORY-ID>/<paso>.result.md` como salida temporal — D-4, D-5, F-5

## 6. Documentación

- [x] T025 `skills/story-plan/README.md`: sección "Modo de ejecución" (subagentes por defecto, fallback inline, `--inline`), pregunta única sobre artefactos existentes, archivos `.tmp/story-plan/<STORY-ID>/`; agregar `--inline` a la tabla de Parámetros y un ejemplo en `## Uso` — D-1, D-2, D-4, AC-1, AC-4

## 7. Verificación

- [x] T026 Ejecutar `npm run test:eval -- story-plan` (TC-001…TC-010); todos deben pasar. Si falla uno de TC-001…TC-005, corregir el `SKILL.md`, no la expectativa — AC-1, AC-2, AC-3, AC-4, CNF-4
- [x] T027 Ejecutar `npm run test:eval -- story-design story-tasking story-analyze --only <IDs nuevos de T009-T011>` y después la suite completa de los tres workers (sin flags se conserva la pregunta) — AC-5
- [x] T028 [P] CNF-3/CNF-5: revisar que el bloque de prompt en `story-plan/SKILL.md` contiene solo ruta del worker + contexto + reglas; `grep -nE "Agent|subagente" skills/story-{design,tasking,testcases,analyze}/SKILL.md` no muestra lanzamientos de subagentes — CNF-3, CNF-5
- [x] T029 [P] Ejecutar `npm run test:eval -- story-plan --dry-run`, `node scripts/verify-eval-inventory.js` y `npm test`; comparar con `baseline.txt` — CNF-6

## 8. Medición CNF-1 / CNF-2

- [x] T030 Reinstalar los skills en el runtime local (`node scripts/cli.js install --target claude-code --force`, y además con `--global` si la sesión carga los skills desde `~/.claude/skills/`) para que `/story-plan` y sus workers usen la versión nueva; copiar solo `story.md` de STORY-107 a `.tmp/story-119/bench/STORY-107-migrar-story-map-y-diagrama-contexto/` — D-8, CNF-1
- [x] T031 En una sesión nueva de Claude Code: `/story-plan STORY-107 .tmp/story-119/bench/STORY-107-migrar-story-map-y-diagrama-contexto/ --inline`; anotar en `.tmp/story-119/bench-inline.txt` la entrada acumulada (`/cost`), el contexto del hilo principal al terminar (`/context`) y los ERRORs/WARNINGs de `analyze.md`; guardar los 4 artefactos en `.tmp/story-119/bench-inline/` — CNF-1, CNF-2
- [x] T032 Restaurar la copia a solo `story.md` y repetir T031 sin `--inline` en otra sesión nueva; anotar lo mismo en `bench-subagentes.txt`, más el uso que informa cada subagente — CNF-1, CNF-2
- [x] T033 Comparar: entrada acumulada (subagentes) < (inline); contexto final del hilo principal ≤ ~15k; ambas corridas cumplen `docs/guardrails/dod-story-plan.md`; ERRORs de `analyze.md` (subagentes) ≤ (inline). Si alguna condición falla, registrar el hallazgo y no cerrar la historia — CNF-1, CNF-2
- [x] T034 Registrar las cifras de T031-T033 en `implement-report.md` de la historia y borrar `.tmp/story-119/bench/` — CNF-1
