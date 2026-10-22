---
alwaysApply: false
type: tasks
id: STORY-150
slug: STORY-150-migrar-skills-especificacion-specs-flow-tasks
title: "Tasks: Migrar los skills de especificación a specs/flow"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-26-layout-y-flow-forward-mejorado
story: STORY-150
design: STORY-150
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-150-migrar-skills-especificacion-specs-flow
---

<!-- Referencias -->
[[STORY-150-migrar-skills-especificacion-specs-flow]] · [[STORY-150-migrar-skills-especificacion-specs-flow-design]]

## 1. Preparación

- [ ] T001 Verificar las precondiciones (CR-003): existe `docs/adr/ADR-0016-*.md` con `status: ACCEPTED`; existe `scripts/verify-fixed-layout.js` (STORY-148) con la constante `PENDING_MIGRATION` y contiene las seis entradas `story-creation`, `story-evaluation`, `story-improve`, `story-refine`, `story-specify` y `story-split`; STORY-147 y STORY-148 en `DONE`. Si falta alguna, detener la implementación — design Risks, CR-003
- [ ] T002 [P] Ejecutar `npm test` y `npm run verify:repository` y guardar las salidas en `.tmp/story-implement/STORY-150/baseline.txt` (línea base en verde); guardar también la salida de `grep -rnE "SPECS_BASE|SDDF_ROOT|SDDF-ROOT-RESOLUTION|docs/specs|specs/stories" skills/story-creation skills/story-evaluation skills/story-refine skills/story-improve skills/story-split skills/story-specify` como inventario de líneas a migrar — design Context, D-2

## 2. Gate y prueba de DoD (RED)

- [ ] T003 Retirar de `PENDING_MIGRATION` en `scripts/verify-fixed-layout.js` las seis entradas de los skills de especificación, conservando el orden alfabético del resto; ejecutar `npm run verify:layout` y confirmar que falla con errores R1 y R3 de los seis skills (skill y línea); guardar la salida en `.tmp/story-implement/STORY-150/red.txt` — D-6, AC-3, CNF-2
- [ ] T004 [P] En `test/dod-story.test.js` (E2E-002) cambiar `expectedPath` a `` `docs/guardrails/${slug}.md` `` y el patrón de `referencedSlugs` a `/guardrails\/(dod-story-[a-z-]+)\.md/g`, con el mensaje `debe referenciar docs/guardrails/<slug>.md`; ejecutar `node --test test/dod-story.test.js` y confirmar que sigue en verde con los nueve skills sin migrar — D-7, CR-002, AC-3

## 3. Migración de los SKILL.md (GREEN)

- [ ] T005 [P] Migrar `skills/story-creation/SKILL.md`: sustituir el bloque v1 del `### Paso 0 — Resolver contexto local` por el bloque canónico de D-1 (conservar la línea de `/skill-preflight`); reescribir con el mapa de D-2 el template (`docs/templates/story-template.md` y aviso «centralizarlo en `docs/templates/`»), la búsqueda Tipo C en `specs/flow/STORY-*/` con el mensaje `❌ No se encontró la historia <término> en specs/flow/` (D-3), la nota de Glob y el cálculo del NNN como `max + 1` sobre `specs/flow/STORY-*/story.md` ∪ `specs/flow/archive/*-STORY-*/story.md` con fallback Bash/PowerShell sobre ambos directorios y `STORY-001` sin coincidencias (D-4), el ejemplo de ruta, la ruta final, el archivo generado y la sección `## Salida` a `specs/flow/STORY-{NNN}-{slug}/story.md`, y la creación de `specs/flow/` si falta (D-5) — D-1, D-2, D-3, D-4, D-5, AC-1, AC-3
- [ ] T006 [P] Migrar `skills/story-evaluation/SKILL.md`: bloque canónico en el Paso 0 (D-1); `$SPECS_BASE/specs/` y `$SPECS_BASE/specs/stories/` → `specs/flow/` en Qué NO hace, Entrada y Paso 6; `$SPECS_BASE/templates/story-template.md` → `docs/templates/story-template.md` en Precondiciones, Dependencias, carga del template, aviso y error; añadir al Paso 1 la resolución por ID con Glob `specs/flow/STORY-NNN-*/story.md` que detiene con `❌ No se encontró la historia STORY-NNN en specs/flow/` sin generar reporte, hacer que el Paso 6 reutilice el directorio resuelto y añadir la fila `Historia no encontrada` a `### Manejo de errores` — D-1, D-2, D-3, AC-2, AC-3
- [ ] T007 [P] Migrar `skills/story-refine/SKILL.md`: bloque canónico en el Paso 0 (D-1); tabla de Entrada, precondición, Glob de resolución y tabla de salida (`story.md`, `story.md.bak`, `story-refinement-log.md`) a `specs/flow/<STORY-NNN>-*/…`; mensaje `❌ No se encontró la historia <STORY-NNN> en specs/flow/`; búsqueda de hermanas por `parent:`/`related:` limitada a `specs/flow/STORY-*/story.md` — D-1, D-2, D-3, AC-3
- [ ] T008 [P] Migrar `skills/story-improve/SKILL.md`: sustituir el párrafo «Antes de delegar, resuelve … `SPECS_BASE`» y los pasos 1–4 del `## Paso 0 — Resolver contexto local` por el bloque canónico de D-1, conservando la línea de `/skill-preflight` y el resto del alias sin cambios — D-1, AC-3, CNF-2
- [ ] T009 [P] Migrar `skills/story-split/SKILL.md`: bloque canónico en el Paso 0 (D-1); todas las referencias a `$SPECS_BASE/templates/story-template.md` → `docs/templates/story-template.md` (objetivo, entrada, precondiciones, dependencias, carga, aviso, error, template canónico); búsqueda Tipo C, precondición, nota de Glob, rutas de historias adicionales, listado de archivos y `## Salida` → `specs/flow/STORY-…`; mensaje `❌ No se encontró la historia {story_id} en specs/flow/` (D-3); numeración con la unión de `specs/flow/STORY-*/` y `specs/flow/archive/*-STORY-*/` (D-4), incluido el fallback Bash — D-1, D-2, D-3, D-4, AC-3
- [ ] T010 [P] Migrar `skills/story-specify/SKILL.md`: en el Paso 0 sustituir el bloque v1 por el bloque canónico de D-1 y eliminar el mensaje «✗ Entorno inválido: raíz explícita …»; cambiar «Con `SPECS_BASE` resuelto» por «Con `REPO_ROOT` resuelto» conservando la verificación del rol local y su mensaje; en `## DoD aplicable` poner `Archivo` = `docs/guardrails/dod-story-specify.md` (sin el paréntesis «en este repositorio») y la resolución `sddf.config.yaml › guardrails.dod.story.specify` → `docs/guardrails/<slug>.md` y convención `docs/guardrails/dod-story-specify.md`; Entrada, precondiciones, restricciones, backlog del Paso 1, Caso A ítem 3, resumen, fila de errores (`specs/flow/ no existe | — | Crear el directorio y continuar`) y `## Salida` → `specs/flow/…` — D-1, D-2, D-3, D-5, AC-1, AC-3

## 4. Soporte: README, rol local, ejemplos y evals

- [ ] T011 [P] Actualizar `skills/story-creation/README.md` (ruta de salida → `specs/flow/STORY-NNN-slug/story.md`) y `skills/story-specify/README.md` (fila de `skill-preflight` sin `SDDF_ROOT`, p. ej. «Layout fijo: `specs/flow/` accesible»; fila `$SPECS_BASE/specs/stories/` → `specs/flow/`) — D-2, AC-3
- [ ] T012 [P] Actualizar `skills/story-specify/assets/agents/product-owner.md:36`: «El archivo de historia actual en `specs/flow/`» — D-2, AC-3
- [ ] T013 [P] Actualizar `skills/story-split/examples/output/split-result.md`: las seis rutas `docs/specs/stories/STORY-…` → `specs/flow/STORY-…`, sin cambiar el resto del ejemplo — D-2, AC-3
- [ ] T014 [P] Actualizar `skills/story-specify/evals/evals.json`: TC-001 `expected.contains` `specs/stories/` → `specs/flow/` y añadir `"docs/specs"` a `not_contains`; TC-002 descripción sin `$SPECS_BASE` y contexto `specs/flow/STORY-010-login-usuario/story.md`; TC-008 contexto `specs/flow/STORY-040-exportar-clientes/story.md`; reemplazar TC-003 por `layout-fijo-repo-limpio-escribe-en-specs-flow` (repo limpio inicializado con `/sddf-init`, historia nueva; `contains` `["specs/flow/STORY-001-", "story.md"]`, `not_contains` `["docs/specs"]`, mismo `type`/`threshold` que el resto) — D-8, AC-1, CNF-1
- [ ] T015 [P] Actualizar `skills/story-evaluation/evals/evals.json`: TC-001 contexto `specs/flow/STORY-075-integrar-historia-modo-manual-dryrun/story.md`; TC-002 descripción con `docs/templates/` en lugar de `$SPECS_BASE/templates/`; añadir TC-009 `historia-inexistente-en-specs-flow` (input `STORY-999`, sin `specs/flow/STORY-999-*/`; `contains` `["No se encontró la historia STORY-999", "specs/flow/"]`, `not_contains` `["docs/specs", "finvest-evaluation-report.md guardado"]`) — D-8, AC-2, CNF-1
- [ ] T016 [P] Actualizar `skills/story-refine/evals/evals.json`: contexto de TC-003 `specs/flow/STORY-099-test/` — D-8, CNF-1

## 5. Verificación

- [ ] T017 Ejecutar `npm run verify:layout` y confirmar `[OK]` sin errores para los seis skills (fuera de `PENDING_MIGRATION`); guardar la salida en `.tmp/story-implement/STORY-150/green.txt` — D-6, contrato #4, AC-3
- [ ] T018 [P] Ejecutar los greps de los contratos #1, #2, #3, #7, #8 y #9 sobre los seis directorios de skill: sin `SPECS_BASE|SDDF_ROOT`; sin `docs/specs|specs/stories`; un marcador `<!-- SDDF-FIXED-LAYOUT: v1 -->` por `SKILL.md`; sin líneas que combinen `root` y `sddf.config.yaml`; mensaje `No se encontró la historia … en specs/flow/` en evaluation, refine y split; `specs/flow/archive/` en creation y split — contratos #1–#3, #7–#9, AC-1, AC-2, AC-3
- [ ] T019 [P] Validar los evals: parsear los seis `evals/evals.json` con `node -e "JSON.parse(require('fs').readFileSync(...))"` y ejecutar `npm run test:eval -- story-specify --dry-run`, `-- story-evaluation --dry-run` y `-- story-refine --dry-run`; confirmar TC-003 de specify y TC-009 de evaluation en los prompts. No ejecutar los evals reales (a criterio humano) — contrato #6, CNF-1
- [ ] T020 Ejecutar `npm test` y `npm run verify:repository` y confirmar exit 0 (E2E-002 incluido) — contratos #4, #5, AC-3
- [ ] T021 Revisar `git diff --stat`: solo los 15 archivos de «Componentes afectados» del diseño (más artefactos de la historia); ningún `SKILL.md` fuera de los seis, ni ADR, CHANGELOG, guías o `docs/specs/` de otras historias — contrato #10, Non-Goals
- [ ] T022 Ejecutar `graphify update .` y registrar en `implement-report.md`: resultados de T017–T020, que los evals reales (contrato #11) quedan a criterio humano y la advertencia de dogfooding (no reinstalar las copias de runtime con `agile-sddf install` hasta STORY-153, porque los work items de este repo siguen en `docs/specs/`) — design Risks, contrato #11
