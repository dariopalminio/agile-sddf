---
alwaysApply: false
type: tasks
id: STORY-156
slug: STORY-156-migrar-skills-implementacion-specs-flow-tasks
title: "Tasks: Migrar los skills de implementación a specs/flow"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-26-layout-y-flow-forward-mejorado
story: STORY-156
design: STORY-156
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-156-migrar-skills-implementacion-specs-flow
---

<!-- Referencias -->
[[STORY-156-migrar-skills-implementacion-specs-flow]] · [[STORY-156-migrar-skills-implementacion-specs-flow-design]]

## 1. Preparación

- [ ] T001 Verificar las precondiciones: existe `docs/adr/ADR-0016-*.md` con `status: ACCEPTED`; existe `scripts/verify-fixed-layout.js` (STORY-148) con la constante `PENDING_MIGRATION` y contiene `story-implement` y `story-implement-tasks`; STORY-147 y STORY-148 en `DONE`. Si falta alguna, detener la implementación — design Risks, dependencia dura de la historia
- [ ] T002 [P] Ejecutar `npm test` y `npm run verify:repository` y guardar las salidas en `.tmp/story-implement/STORY-156/baseline.txt` (línea base en verde); guardar también la salida de `grep -rnE "SPECS_BASE|SDDF_ROOT|SDDF-ROOT-RESOLUTION|docs/specs|specs/stories|specs/epics" skills/story-implement skills/story-implement-tasks` como inventario de líneas a migrar — design Context, D-2
- [ ] T003 [P] Comprobar E2E-002 en `test/dod-story.test.js` (CR-001): si `expectedPath` ya es `` `docs/guardrails/${slug}.md` `` (STORY-150 D-7 aplicado), no tocar la prueba; si sigue en `` `$SPECS_BASE/guardrails/${slug}.md` ``, aplicar el cambio de STORY-150 D-7 tal cual (`expectedPath` → `` `docs/guardrails/${slug}.md` ``, patrón de `referencedSlugs` → `/guardrails\/(dod-story-[a-z-]+)\.md/g`, mensaje `debe referenciar docs/guardrails/<slug>.md`) y confirmar con `node --test test/dod-story.test.js` que sigue en verde con los nueve skills — D-6, CR-001, AC-2

## 2. Gate (RED)

- [ ] T004 Retirar `story-implement` y `story-implement-tasks` de `PENDING_MIGRATION` en `scripts/verify-fixed-layout.js`, conservando el orden alfabético del resto; ejecutar `npm run verify:layout` y confirmar que falla con errores R1 y R3 (y R4 en la fila de dependencias de `story-implement-tasks`) que nombran skill y línea; guardar la salida en `.tmp/story-implement/STORY-156/red.txt` — D-5, AC-2, CNF-2

## 3. Migración de los SKILL.md (GREEN)

- [ ] T005 [P] Migrar `skills/story-implement/SKILL.md`: (a) en `### Paso 0 — Resolver contexto local` sustituir el bloque v1 por el bloque canónico de D-1, conservar la línea de `/skill-preflight` y reescribir la línea `CLI_ROOT` como «Resuelve `CLI_ROOT` (directorio de skills del runtime) solo para localizar los generadores declarados y el seed del template de épica.»; (b) l. 32 → «Resuelve `REPO_ROOT` y `CLI_ROOT` localmente como Paso 0 (layout fijo, ADR-0016)»; (c) `## DoD aplicable`: `Archivo` = `docs/guardrails/dod-story-implement.md` (sin el paréntesis «en este repositorio»), resolución 1 → `docs/guardrails/<slug>.md`, resolución 2 → `docs/guardrails/dod-story-implement.md`, `Override` sin cambio; (d) 0c.1: Glob `specs/flow/{story_id}-*/story.md` (con guion) y mensaje `❌ No se encontró la historia {story_id} en specs/flow/` conservando la sugerencia de `/epic-generate-stories`; (e) 11d: épica según D-4 (`specs/flow/<parent>/epic.md`, luego Glob `specs/flow/<parent>-*/epic.md`) y template `docs/templates/epic-template.md` con el seed `$CLI_ROOT/skills/epic-creation/assets/epic-template.md`; (f) fila `Historia no encontrada (0c.1)` de la tabla de errores con el mensaje nuevo; (g) fila `epic.md` de `## Salida` → `specs/flow/<parent>/epic.md`. No tocar los Pasos 1–10 ni los bundles — D-1, D-2, D-3, D-4, AC-1, AC-2, CNF-2
- [ ] T006 [P] Migrar `skills/story-implement-tasks/SKILL.md`: (a) tabla `## Entrada`: `story.md`, `design.md`, `tasks.md`, `fix-directives.md` → `specs/flow/<STORY-NNN>-<slug>/…` y DoD → `docs/guardrails/dod-story-implement.md`; (b) fila de `## Dependencias` → «Contrato de layout fijo | Resuelve `REPO_ROOT` y usa `specs/flow/`, `docs/templates/` y `docs/guardrails/` (ADR-0016) antes de cualquier operación.»; (c) `## DoD aplicable` como en T005 (c); (d) Paso 0 con el bloque canónico de D-1, línea de `/skill-preflight` y línea `CLI_ROOT` limitada al seed del template de épica; (e) 1b: ruta explícita aceptada solo si, normalizada y relativa a `REPO_ROOT`, tiene la forma `specs/flow/STORY-NNN-<slug>/` (no `specs/flow/archive/…`) y contiene `story.md`, si no `❌ La ruta {story_path} no es una historia de specs/flow/ (se esperaba specs/flow/STORY-NNN-<slug>/)` y detener sin escribir; Glob `specs/flow/{story_id}-*/` y mensaje `❌ No se encontró la historia {story_id} en specs/flow/`; (f) 4c: épica según D-4 y template `docs/templates/epic-template.md` con el seed de `$CLI_ROOT`; (g) fila `Historia no encontrada` de errores con el mensaje nuevo y fila nueva `Ruta explícita fuera de specs/flow/` con el mensaje de (e); (h) `## Salida`: `implement-report.md` → `specs/flow/<STORY-NNN>-<slug>/implement-report.md`, `epic.md` → `specs/flow/<parent>/epic.md` — D-1, D-2, D-3, D-4, AC-1, AC-2, CNF-2

## 4. Soporte: README y evals

- [ ] T007 [P] Actualizar `skills/story-implement/README.md`: l. 81 `implement-report.md` → `specs/flow/<STORY-NNN>-<slug>/implement-report.md`; l. 83 `epic.md` → `specs/flow/<parent>/epic.md`. No cambiar las menciones de `sddf.config.yaml` para generadores (CR-002) — D-2, AC-1
- [ ] T008 [P] Actualizar `skills/story-implement-tasks/README.md` l. 57: `--path specs/flow/STORY-059-mi-historia/` — D-2, D-3, AC-1
- [ ] T009 [P] Actualizar `skills/story-implement/evals/evals.json`: las 8 rutas `docs/specs/stories/STORY-TEST/…` (l. 1166, 1367, 1401, 2937, 3086, 3243, 3507, 3638) → `specs/flow/STORY-TEST/…` y las 4 `$SPECS_BASE/specs/epics/EPIC-21-colapsar-specs/epic.md` (l. 3661, 3678, 3703, 3720) → `specs/flow/EPIC-21-colapsar-specs/epic.md`; sin cambiar `docs/guardrails/…`, `contains`, `archivo_linea` ni `threshold` — D-2, CNF-1

## 5. Verificación

- [ ] T010 Ejecutar `npm run verify:layout` y confirmar `[OK]` sin errores para ambos skills (fuera de `PENDING_MIGRATION`); guardar la salida en `.tmp/story-implement/STORY-156/green.txt` — D-5, contrato #5, AC-2
- [ ] T011 [P] Ejecutar los greps de los contratos #1, #2, #3, #4, #7, #8, #9 y #10 sobre `skills/story-implement` y `skills/story-implement-tasks`: sin `SPECS_BASE|SDDF_ROOT|SDDF-ROOT-RESOLUTION`; sin `docs/specs|specs/stories|specs/epics`; un marcador `<!-- SDDF-FIXED-LAYOUT: v1 -->` por `SKILL.md`; sin líneas que combinen `root` y `sddf.config.yaml`; Glob `specs/flow/{story_id}-*/` y mensaje `No se encontró la historia {story_id} en specs/flow/` en ambos; `no es una historia de specs/flow/` en implement-tasks; `specs/flow/<parent>/epic.md` en ambos; `implement-report.md` en las tablas de salida bajo la carpeta de la historia — contratos #1–#4, #7–#10, AC-1, AC-2, CNF-2
- [ ] T012 [P] Validar los evals: parsear `skills/story-implement/evals/evals.json` y `skills/story-implement-tasks/evals/evals.json` con `node -e "JSON.parse(require('fs').readFileSync(...))"` y ejecutar `npm run test:eval -- story-implement --dry-run` y `-- story-implement-tasks --dry-run` sin error. No ejecutar los evals reales (a criterio humano) — contrato #11, CNF-1
- [ ] T013 Ejecutar `npm test` y `npm run verify:repository` y confirmar exit 0 (E2E-002 incluido) — contratos #5, #6, AC-2
- [ ] T014 Revisar `git diff --stat`: solo los archivos de «Componentes afectados» del diseño (`test/dod-story.test.js` solo si T003 lo cambió) más artefactos de la historia; ningún `SKILL.md` fuera de los dos skills, ni ADR, CHANGELOG, guías o `docs/specs/` de otras historias — contrato #12, Non-Goals
- [ ] T015 Ejecutar `graphify update .` y registrar en `implement-report.md`: resultados de T010–T013, si T003 cambió o no E2E-002, que los evals reales (contrato #13) quedan a criterio humano y la advertencia de dogfooding (no reinstalar las copias de runtime con `agile-sddf install` hasta STORY-153, porque los work items de este repo siguen en `docs/specs/`) — design Risks, contrato #13
