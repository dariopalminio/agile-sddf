---
alwaysApply: false
type: tasks
id: STORY-158
slug: STORY-158-migrar-skills-verificacion-specs-flow-tasks
title: "Tasks: Migrar los skills de revisión, verificación y aceptación a specs/flow"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-26-layout-y-flow-forward-mejorado
story: STORY-158
design: STORY-158
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-158-migrar-skills-verificacion-specs-flow
---

<!-- Referencias -->
[[STORY-158-migrar-skills-verificacion-specs-flow]] · [[STORY-158-migrar-skills-verificacion-specs-flow-design]]

## 1. Preparación

- [ ] T001 Verificar las precondiciones: existe `docs/adr/ADR-0016-*.md` con `status: ACCEPTED`; existe `scripts/verify-fixed-layout.js` (STORY-148) con la constante `PENDING_MIGRATION` y contiene `story-acceptance`, `story-code-review` y `story-verify`; STORY-147 y STORY-148 en `DONE`. Si falta alguna, detener la implementación — design Risks, dependencia dura de la historia
- [ ] T002 [P] Ejecutar `npm test` y `npm run verify:repository` y guardar las salidas en `.tmp/story-implement/STORY-158/baseline.txt` (línea base en verde); guardar también la salida de `grep -rnE "SPECS_BASE|SDDF_ROOT|SDDF-ROOT-RESOLUTION|docs/specs|specs/stories|specs/epics|CLI_ROOT" skills/story-code-review skills/story-verify skills/story-acceptance` como inventario de líneas a migrar y contrastarla con la tabla de Context del diseño (los números de línea pueden haberse desplazado) — design Context, D-2, CR-003
- [ ] T003 [P] Comprobar E2E-002 en `test/dod-story.test.js` (CR-001): si `expectedPath` ya es `` `docs/guardrails/${slug}.md` `` (aplicado por STORY-150, STORY-155 o STORY-156), no tocar la prueba; si sigue en `` `$SPECS_BASE/guardrails/${slug}.md` ``, aplicar el cambio de STORY-150 D-7 tal cual (`expectedPath` → `` `docs/guardrails/${slug}.md` ``, patrón de `referencedSlugs` → `/guardrails\/(dod-story-[a-z-]+)\.md/g`, mensaje `debe referenciar docs/guardrails/<slug>.md`) y confirmar con `node --test test/dod-story.test.js` que sigue en verde con los nueve skills — D-7, CR-001, AC-2

## 2. Gate (RED)

- [ ] T004 Retirar `story-acceptance`, `story-code-review` y `story-verify` de `PENDING_MIGRATION` en `scripts/verify-fixed-layout.js`, conservando el orden alfabético del resto; ejecutar `npm run verify:layout` y confirmar que falla con errores R1 y R3 que nombran cada uno de los tres skills y su línea; guardar la salida en `.tmp/story-implement/STORY-158/red.txt` — D-6, AC-2, CNF-2

## 3. Migración de los SKILL.md (GREEN)

- [ ] T005 [P] Migrar `skills/story-code-review/SKILL.md`: (a) `## DoD aplicable`: `Archivo` = `docs/guardrails/dod-story-code-review.md` (sin el paréntesis «en este repositorio»), resolución 1 → `docs/guardrails/<slug>.md`, resolución 2 → `docs/guardrails/dod-story-code-review.md`, `Override` sin cambio; (b) en `### Paso 0 — Resolver contexto local` sustituir el bloque v1 (pasos 1–4, incluida la línea `CLI_ROOT`) por el bloque canónico de D-1 y conservar la línea de `/skill-preflight`; (c) 1b: ruta explícita aceptada solo si, normalizada y relativa a `REPO_ROOT`, tiene la forma `specs/flow/STORY-NNN-<slug>/` (no `specs/flow/archive/…`) y contiene `story.md`, si no `❌ La ruta {story_path} no es una historia de specs/flow/ (se esperaba specs/flow/STORY-NNN-<slug>/)` y detener sin escribir; Glob `specs/flow/{story_id}-*/story.md` y mensaje `❌ No se encontró la historia {story_id} en specs/flow/` conservando la sugerencia de `/epic-generate-stories`; (d) tabla de errores: fila `Historia no encontrada` con el mensaje nuevo y fila nueva `Ruta explícita fuera de specs/flow/` con el mensaje de (c); (e) tabla de salida: `code-review-report.md` y `fix-directives.md` → `specs/flow/<STORY-NNN>-<slug>/…`. No tocar los Pasos 2–6, los agentes ni `.tmp/` — D-1, D-2, D-3, AC-1, AC-2, CNF-2
- [ ] T006 [P] Migrar `skills/story-verify/SKILL.md`: (a) `## Entrada`: `story.md` → `specs/flow/<STORY-NNN>-<slug>/story.md` y DoD → `docs/guardrails/dod-story-verify.md`; (b) `## DoD aplicable` como en T005 (a) con `dod-story-verify`; (c) Paso 0 con el bloque canónico de D-1, línea de `/skill-preflight` y línea `CLI_ROOT` reescrita como «Resuelve `CLI_ROOT` (directorio de skills del runtime) solo para buscar el skill de pruebas del modo delegado.»; (d) 1b como T005 (c); (e) errores como T005 (d) (añadir las filas si la tabla de errores no las tiene); (f) `## Salida`: `verify-report.md` → `specs/flow/<STORY-NNN>-<slug>/verify-report.md`. No cambiar la lectura de `sddf.config.yaml` › `verify` (Paso 4, CR-002) ni `$CLI_ROOT/skills/` del modo delegado — D-1, D-2, D-3, AC-1, AC-2, CNF-2
- [ ] T007 [P] Migrar `skills/story-acceptance/SKILL.md`: (a) `## Entrada`: `story.md` y `acceptance-report.md` → `specs/flow/<STORY-NNN>-<slug>/…`, DoD → `docs/guardrails/dod-story-acceptance.md`; (b) `## DoD aplicable` como en T005 (a) con `dod-story-acceptance`; (c) Paso 0 como T005 (b) (sin línea `CLI_ROOT`); (d) 1b como T005 (c); (e) errores como T006 (e); (f) `## Salida`: `acceptance-report.md` → `specs/flow/<STORY-NNN>-<slug>/acceptance-report.md` — D-1, D-2, D-3, AC-1, AC-2, CNF-2

## 4. Soporte: agentes, ejemplos, README y evals

- [ ] T008 [P] Actualizar `skills/story-code-review/agents/tech-lead-reviewer.agent.md` l. 20: ejemplo de `$STORY_DIR` → `specs/flow/STORY-064-revision-codigo-multi-agente/` — D-2, AC-1
- [ ] T009 [P] Actualizar los ejemplos de `story-code-review`: `examples/example-all-artifacts-present/README.md` l. 15 y 25 → `specs/flow/STORY-000-test/`; `examples/example-missing-artifacts/expected-output.md` l. 13 → `❌ Artefactos requeridos no encontrados en: specs/flow/STORY-000-missing-artifacts/` — D-2, AC-1
- [ ] T010 [P] Actualizar `skills/story-verify/README.md`: l. 56 → `specs/flow/<STORY-NNN>-<slug>/verify-report.md`; sección «Template del reporte» con única ubicación `assets/verify-report-template.md` y, si falta, la estructura mínima integrada (se elimina la línea `$SPECS_BASE/templates/…`); l. 79 DoD → `docs/guardrails/dod-story-verify.md` conservando el override de `sddf.config.yaml › guardrails.dod.story.verify` — D-2, D-4, AC-1, AC-2
- [ ] T011 [P] Actualizar `skills/story-acceptance/evals/evals.json`: TC-004 descripción `$SPECS_BASE/guardrails/dod-story-acceptance.md` → `docs/guardrails/dod-story-acceptance.md`; reemplazar TC-010 por `historia-no-encontrada-en-specs-flow` (`fail-fast`, `input: { story_id: "STORY-999", context }` donde `context` indica que no existe `specs/flow/STORY-999-*/` aunque exista `docs/specs/stories/STORY-999-x/story.md`; `contains: ["No se encontró la historia STORY-999", "specs/flow/"]`; `not_contains: ["Iniciando acceptance", "acceptance-report.md", "docs/specs"]`; `threshold: 1.0`); añadir TC-015 `informe-en-carpeta-specs-flow` copiando el `input` y el `threshold` de TC-001 más `input.context` «la historia está en `specs/flow/STORY-055-aceptacion/`», `contains: ["specs/flow/STORY-055-aceptacion/acceptance-report.md", "(verdict: APPROVED)"]`, `not_contains: ["docs/specs"]` — D-5, CNF-1, AC-1
- [ ] T012 [P] Añadir a `skills/story-code-review/evals/evals.json` el caso TC-023 `informe-en-carpeta-specs-flow` copiando `input` (incluido `agent_results`) y `threshold` de TC-001 más `input.context` «la historia está en `specs/flow/STORY-010-revision/`», `contains: ["specs/flow/STORY-010-revision/code-review-report.md", "(verdict: APPROVED)"]`, `not_contains: ["docs/specs"]` — D-5, CNF-1, AC-1
- [ ] T013 [P] Añadir a `skills/story-verify/evals/evals.json` el caso TC-007 `informe-en-carpeta-specs-flow` copiando `input` (`examples/jest-project`, `STORY-050`) y `threshold` de TC-001 más `input.context` «la historia está en `specs/flow/STORY-050-verificacion/`», `contains: ["specs/flow/STORY-050-verificacion/verify-report.md", "(verdict: APPROVED)"]`, `not_contains: ["docs/specs"]` — D-5, CNF-1, AC-1

## 5. Verificación

- [ ] T014 Ejecutar `npm run verify:layout` y confirmar `[OK]` sin errores para los tres skills (fuera de `PENDING_MIGRATION`); guardar la salida en `.tmp/story-implement/STORY-158/green.txt` — D-6, contrato #5, AC-2
- [ ] T015 [P] Ejecutar los greps de los contratos #1, #2, #3, #4, #7, #8, #9 y #10 sobre `skills/story-code-review`, `skills/story-verify` y `skills/story-acceptance`: sin `SPECS_BASE|SDDF_ROOT|SDDF-ROOT-RESOLUTION`; `docs/specs|specs/stories|specs/epics` solo en las líneas de evals que la nombran como ruta prohibida (`not_contains`/`input.context`); un marcador `<!-- SDDF-FIXED-LAYOUT: v1 -->` por `SKILL.md`; sin líneas que combinen `root` y `sddf.config.yaml`; Glob `specs/flow/{story_id}-*/`, mensaje `No se encontró la historia {story_id} en specs/flow/` y `no es una historia de specs/flow/` en los tres; informes bajo la carpeta de la historia en las tablas de salida; `CLI_ROOT` ausente en code-review y acceptance y presente en verify — contratos #1–#4, #7–#10, AC-1, AC-2, CNF-2
- [ ] T016 [P] Validar los evals: parsear los tres `evals.json` con `node -e "JSON.parse(require('fs').readFileSync(...))"`, comprobar que TC-023, TC-007 y TC-015 existen y que TC-010 de acceptance no contiene `SDDF_ROOT`, y ejecutar `npm run test:eval -- story-code-review --dry-run`, `-- story-verify --dry-run` y `-- story-acceptance --dry-run` sin error. No ejecutar los evals reales (a criterio humano) — contrato #11, CNF-1
- [ ] T017 Ejecutar `npm test` y `npm run verify:repository` y confirmar exit 0 (E2E-002 y `verify-validation-contract` incluidos) — contratos #5, #6, AC-2
- [ ] T018 Revisar `git diff --stat`: solo los archivos de «Componentes afectados» del diseño (`test/dod-story.test.js` solo si T003 lo cambió) más artefactos de la historia; ningún `SKILL.md` fuera de los tres skills, ni ADR, CHANGELOG, guías o `docs/specs/` de otras historias — contrato #12, Non-Goals
- [ ] T019 Ejecutar `graphify update .` y registrar en `implement-report.md`: resultados de T014–T017, si T003 cambió o no E2E-002, el tratamiento de CR-003 (rutas fuera del inventario de la historia), que los evals reales (contrato #13) quedan a criterio humano y la advertencia de dogfooding (no reinstalar las copias de runtime con `agile-sddf install` hasta STORY-153, porque los work items de este repo siguen en `docs/specs/`) — design Risks, CR-003, contrato #13
