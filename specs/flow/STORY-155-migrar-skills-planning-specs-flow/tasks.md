---
alwaysApply: false
type: tasks
id: STORY-155
slug: STORY-155-migrar-skills-planning-specs-flow-tasks
title: "Tasks: Migrar los skills de planning a specs/flow"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-26-layout-y-flow-forward-mejorado
story: STORY-155
design: STORY-155
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-155-migrar-skills-planning-specs-flow
---

<!-- Referencias -->
[[STORY-155-migrar-skills-planning-specs-flow]] · [[STORY-155-migrar-skills-planning-specs-flow-design]]

## 1. Preparación

- [x] T001 Verificar las precondiciones (CR-002): existe `docs/adr/ADR-0016-*.md` con `status: ACCEPTED`; existe `scripts/verify-fixed-layout.js` (STORY-148) con la constante `PENDING_MIGRATION` y contiene las seis entradas `story-analyze`, `story-design`, `story-fix-plan`, `story-plan`, `story-tasking` y `story-testcases`; STORY-147 y STORY-148 entregadas. Si falta alguna, detener la implementación — design Risks, CR-002
- [x] T002 [P] Ejecutar `npm test` y `npm run verify:repository` y guardar las salidas en `.tmp/story-implement/STORY-155/baseline.txt` (línea base en verde); guardar también la salida de `grep -rnE "SPECS_BASE|SDDF_ROOT|SDDF-ROOT-RESOLUTION|CLI_ROOT|docs/specs|specs/stories|specs/epics|Entorno inválido" skills/story-design skills/story-tasking skills/story-testcases skills/story-analyze skills/story-fix-plan skills/story-plan` como inventario de líneas a migrar, y confirmar con `find skills/story-{design,tasking,testcases,analyze,fix-plan,plan} -path "*assets/agents*"` que no hay roles locales — design Context, D-2, contrato #10

## 2. Gate y prueba de DoD (RED)

- [x] T003 Retirar de `PENDING_MIGRATION` en `scripts/verify-fixed-layout.js` las seis entradas de los skills de planning, conservando el orden alfabético del resto; ejecutar `npm run verify:layout` y confirmar que falla con errores R1 y R3 de los seis skills (skill y línea); guardar la salida en `.tmp/story-implement/STORY-155/red.txt` — D-6, AC-3, CNF-2
- [x] T004 [P] Revisar `test/dod-story.test.js` (E2E-002): si `expectedPath` ya es `` `docs/guardrails/${slug}.md` `` (STORY-150 D-7 aplicado), no tocar el archivo y registrarlo; si conserva `$SPECS_BASE`, cambiar `expectedPath` a `` `docs/guardrails/${slug}.md` ``, el patrón de `referencedSlugs` a `/guardrails\/(dod-story-[a-z-]+)\.md/g` y el mensaje a `debe referenciar docs/guardrails/<slug>.md`. En ambos casos ejecutar `node --test test/dod-story.test.js` y confirmar verde con los skills aún sin migrar — D-7, CR-001, AC-3

## 3. Migración de los SKILL.md (GREEN)

- [x] T005 [P] Migrar `skills/story-design/SKILL.md`: en `### Paso 0 — Resolver contexto local` sustituir el bloque v1 (pasos 1–4, incluida `CLI_ROOT`) por el bloque canónico de D-1, conservando la línea de `/skill-preflight`; con el mapa de D-2 reescribir Entrada (`docs/constitution.md`, DoD `docs/guardrails/dod-story-plan.md`), precondición (`specs/flow/`), `## DoD aplicable` (`Archivo` = `docs/guardrails/dod-story-plan.md` sin el paréntesis; regla 1 → `docs/guardrails/<slug>.md`; regla 2 → `docs/guardrails/dod-story-plan.md`), Glob del Paso 1b (`specs/flow/{story_id}-*/`), Paso 3 (`docs/constitution.md`, heredada `docs/policies/constitution.md`, aviso `⚠️ No se encontró docs/constitution.md`) y fila de errores `❌ No se encontró la historia {story_id} en specs/flow/` (D-3); eliminar la fila `Entorno inválido (preflight)`; conservar el Paso 3b sobre `sddf.config.yaml › skills.plan` y la mención de `/sddf-constitution` — D-1, D-2, D-3, AC-1, AC-2, AC-3
- [x] T006 [P] Migrar `skills/story-tasking/SKILL.md`: bloque canónico en el Paso 0 (D-1, sin `CLI_ROOT`); Glob del Paso 1b → `specs/flow/{story_id}-*/` y bloque de mensaje → `❌ No se encontró la historia {story_id} en specs/flow/` (D-3); el template propio `assets/tasks-template.md` no cambia — D-1, D-2, D-3, AC-1, AC-2, AC-3
- [x] T007 [P] Migrar `skills/story-testcases/SKILL.md`: bloque canónico en el Paso 0 (D-1, sin `CLI_ROOT`); Glob → `specs/flow/{story_id}-*/` y mensaje `❌ No se encontró la historia {story_id} en specs/flow/` (D-3); eliminar la fila `Entorno inválido (preflight)` de `### Manejo de errores`; conservar las referencias de la fase `plan` en `sddf.config.yaml` — D-1, D-2, D-3, AC-1, AC-2, AC-3
- [x] T008 [P] Migrar `skills/story-analyze/SKILL.md`: bloque canónico en el Paso 0 (D-1, sin `CLI_ROOT`); Entrada (DoD `docs/guardrails/dod-story-plan.md`; épica padre según D-4), precondición (`specs/flow/`), `## DoD aplicable` como en T005, Glob (`specs/flow/{story_id}-*/`); reescribir el Paso 5a con las tres reglas de D-4 (`specs/flow/{parent}/epic.md` → `specs/flow/{parent}-*/epic.md` → aviso `⚠️ No se encontró epic.md para: <parent>` no bloqueante, sin buscar en `archive/` ni en `docs/specs/`); fila de errores `❌ No se encontró la historia {story_id} en specs/flow/`; eliminar la fila `Entorno inválido (preflight)`; comentario de DoD ausente del template embebido (l. ~704) → `docs/guardrails/dod-story-plan.md o su override en sddf.config.yaml` — D-1, D-2, D-3, D-4, AC-1, AC-2, AC-3
- [x] T009 [P] Migrar `skills/story-fix-plan/SKILL.md`: bloque canónico en el Paso 0 (D-1, sin `CLI_ROOT`); tabla de entradas (`analyze.md`, `design.md`, `tasks.md`, `testcases.md`, `story.md`) → `specs/flow/<STORY-NNN>-*/…`; fila del template → `assets/fix-plan-report-template.md` relativo al directorio del skill (D-5); precondición (`specs/flow/`); Glob y bloque de mensaje → `❌ No se encontró la historia <STORY-NNN> en specs/flow/`; tabla de salida (archivos del plan, `.bak`, `fix-plan-report.md`) → `specs/flow/<STORY-NNN>-*/` — D-1, D-2, D-3, D-5, AC-1, AC-2, AC-3
- [x] T010 [P] Migrar `skills/story-plan/SKILL.md`: bloque canónico en el Paso 0 (D-1, sin `CLI_ROOT`); precondición (`specs/flow/`), `## DoD aplicable` como en T005, Glob del Paso 1d (`specs/flow/{story_id}-*/`, resuelto antes del Paso 1e) y fila de errores `❌ No se encontró la historia {story_id} en specs/flow/` (D-3); eliminar la fila `Entorno inválido (preflight)` — D-1, D-2, D-3, AC-1, AC-2, AC-3

## 4. Soporte: README, assets, ejemplos y evals

- [x] T011 [P] Actualizar los `assets/README.md`: `story-design` → `docs/templates/design-template.md`; `story-tasking` → `docs/templates/tasks-template.md`; `story-analyze` → `docs/templates/analyze-report-template.md`; `story-plan/assets/README.md:29` → «bajo `specs/flow/`» — D-2, AC-3
- [x] T012 [P] Actualizar `skills/story-analyze/assets/analyze-report-template.md:102`: comentario de DoD ausente con `docs/guardrails/dod-story-plan.md` — D-2, AC-3
- [x] T013 [P] Actualizar `skills/story-plan/README.md`: filas l. 27–28 → «Directorio bajo `specs/flow/` | Resuelto por glob del ID» y eliminar la fila de `skill-preflight`/`SDDF_ROOT`; ejemplo l. 88 → `specs/flow/STORY-057-mi-historia/` — D-2, AC-3
- [x] T014 [P] Actualizar `skills/story-plan/examples/output/plan-summary.md`: rutas de l. 11, 66, 90 y 104 → `specs/flow/STORY-099-exportar-reporte-pdf/…`; l. 14 → `[Paso 0] ✓ REPO_ROOT resuelto — layout fijo` — D-2, AC-3
- [x] T015 [P] Actualizar los ejemplos de `story-design`: `examples/input/story.md` (l. 25–46: `docs/templates/story-design-template.md`, `docs/policies/`, `docs/constitution.md`) y `examples/output/design.md` (l. 117–198: Paso 0 «resolver `REPO_ROOT`», glob `specs/flow/STORY-057-*/`, template `docs/templates/story-design-template.md`, salida de `skill-preflight` sin `SPECS_BASE`, ruta `specs/flow/STORY-057-skill-para-diseno/`, P5 «convenciones kebab-case y rutas fijas respetadas»), sin cambiar la estructura de los ejemplos — D-2, AC-3, CNF-3
- [x] T016 [P] Actualizar `skills/story-analyze/examples/output/analyze.md:91` (`specs/flow/EPIC-10-data-management*/`) y `skills/story-fix-plan/examples/example-con-hallazgos/analyze.md:59` (`specs/flow/EPIC-30-reportes/epic.md`) — D-2, AC-3
- [x] T017 [P] Actualizar `skills/story-plan/evals/evals.json` TC-002: `story_id` → `STORY-999`; descripción «no existe en `specs/flow/`»; `contains` → `["No se encontró la historia STORY-999", "specs/flow/"]`; añadir `"docs/specs"` a `not_contains` — D-8, AC-2, CNF-1
- [x] T018 [P] Actualizar `skills/story-design/evals/evals.json` (TC-002 descripción → `specs/flow/`; TC-003 `input_path` → `specs/flow/STORY-001-historia-sin-story/`) y `skills/story-tasking/evals/evals.json` (TC-003 descripción sin `$SPECS_BASE`; `contains` `"No se encontro"` → `"No se encontr"`) — D-8, CNF-1
- [x] T019 [P] Actualizar `skills/story-fix-plan/evals/evals.json`: en los 12 `context` eliminar el prefijo `SPECS_BASE=docs. ` y cambiar `docs/specs/stories/` → `specs/flow/`, sin tocar `expected` — D-8, CNF-1
- [x] T020 [P] Añadir a `skills/story-analyze/evals/evals.json` el caso TC-007 `epica-padre-en-specs-flow` (`input_path: examples/input`; `context`: historia en `specs/flow/STORY-099-…/` con `parent: EPIC-10-data-management` y épica fixture `specs/flow/EPIC-10-data-management/epic.md` con objetivos y la feature de la historia; `contains` `["type: analyze", "Alineación con la épica EPIC-10-data-management"]`; `not_contains` `["No se encontró epic.md", "docs/specs"]`; mismo `type`/`threshold` que el resto) — D-8, D-4, AC-1, CNF-1

## 5. Verificación

- [x] T021 Ejecutar `npm run verify:layout` y confirmar `[OK]` sin errores para los seis skills (fuera de `PENDING_MIGRATION`); guardar la salida en `.tmp/story-implement/STORY-155/green.txt` — D-6, contrato #6, AC-3
- [x] T022 [P] Ejecutar los greps de los contratos #1, #2, #3, #4, #5, #8 y #10 sobre los seis directorios de skill: sin `SPECS_BASE|SDDF_ROOT`; sin `docs/specs|specs/stories|specs/epics|CLI_ROOT`; un marcador `<!-- SDDF-FIXED-LAYOUT: v1 -->` por `SKILL.md`; mensaje `No se encontró la historia … en specs/flow/` en los seis `SKILL.md`; reglas `specs/flow/{parent}` en `story-analyze`; sin líneas que combinen `root` y `sddf.config.yaml`; sin `assets/agents/` — contratos #1–#5, #8, #10, AC-1, AC-2, AC-3, CNF-3
- [x] T023 [P] Validar los evals: parsear los seis `evals/evals.json` con `node -e "JSON.parse(require('fs').readFileSync(...))"` y ejecutar `npm run test:eval -- <skill> --dry-run` para `story-plan`, `story-design`, `story-tasking`, `story-analyze` y `story-fix-plan`; confirmar TC-002 de plan con `STORY-999` y TC-007 de analyze en los prompts. No ejecutar los evals reales (a criterio humano) — contrato #9, CNF-1
- [x] T024 Ejecutar `npm test` y `npm run verify:repository` y confirmar exit 0 (E2E-002 y `sddf-constitution.test.js` incluidos) — contratos #6, #7, AC-3
- [x] T025 Revisar `git diff --stat`: solo los archivos de «Componentes afectados» del diseño (más artefactos de la historia); ningún `SKILL.md` fuera de los seis, ni templates propios de `assets/`, ADR, CHANGELOG, guías o `docs/specs/` de otras historias — contrato #11, Non-Goals
- [x] T026 Ejecutar `graphify update .` y registrar en `implement-report.md`: resultados de T021–T024, si T004 modificó o no `test/dod-story.test.js`, que los evals reales (contrato #12) quedan a criterio humano y la advertencia de dogfooding (no reinstalar las copias de runtime con `agile-sddf install` hasta STORY-153: tras la migración `/story-plan` dejaría de encontrar las historias de este repo en `docs/specs/`) — design Risks, contrato #12
