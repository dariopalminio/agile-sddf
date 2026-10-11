---
alwaysApply: false
type: tasks
id: STORY-101
slug: STORY-101-dod-story-por-etapa-tasks
title: "Tasks: Dividir el DoD de Story en un guardrail por etapa, referenciado explícitamente por cada skill"
date: 2026-09-24
status: PLAN
substatus: DONE
parent: EPIC-20-memory-system
story: STORY-101
design: STORY-101
related:
  - STORY-101-dod-story-por-etapa
  - STORY-101-dod-story-por-etapa-design
---

<!-- Referencias -->
[[STORY-101-dod-story-por-etapa]] · [[STORY-101-dod-story-por-etapa-design]]

Orden: setup → módulo DoD (TDD) → motor → migración real → config → skills → consumidores → documentación → verificación.
Las referencias `D-n`, `R-n`, `F-n` y `CR-n` remiten a `design.md`.

## 1. Setup y línea base

- [x] T001 Registrar la línea base: ejecutar `node skills/memory-system/scripts/memory-system.js check --root docs --json` y guardar el `summary` y la lista de `problems` en `.tmp/story-implement/STORY-101/check-baseline.json` (referencia para CR-004: "ninguno nuevo respecto a la línea base")
- [x] T002 [P] Registrar `grep -rn "dod-story-checklist\|policies/dod-story" skills/` en `.tmp/story-implement/STORY-101/refs-baseline.txt` como inventario de referencias a eliminar (CR-007)
- [x] T003 [P] Crear el fixture `test/fixtures/dod-story/monolith.md` como copia literal de `docs/guardrails/dod-story-checklist.md` en el commit actual, más `monolith-custom.md` (sin sección SPECIFY y con un bloque `## Criterios de rendimiento`) para F-5

## 2. Módulo `dod-story.js` — tabla de etapas y planificador (TDD)

- [x] T004 Crear `test/dod-story.test.js` con los tests en rojo de `DOD_STAGES`: siete entradas en el orden de D-1, `from` de cada etapa = `to` de la anterior, `specify.from = none`, `release` con `kind: content`, `applies-to: release` y sin `from`/`to`, `enforcement` `warn` solo en `specify` (AC-1, AC-4, AC-5)
- [x] T005 Crear `skills/memory-system/scripts/dod-story.js` (CommonJS, solo módulos nativos) con `DOD_STAGES` como arreglo literal inmutable `{ stage, heading, from, to, enforcement, kind, appliesTo, skills[] }` según D-1; T004 en verde
- [x] T006 Añadir a `test/dod-story.test.js` los tests en rojo de `planDodMigration` sobre `monolith.md`: siete destinos `create` + `replace-index`; frontmatter por destino según el esquema de datos; cada línea `- [ ]` del origen aparece en exactamente un destino; los criterios de release no aparecen en ningún otro destino; sin comentarios HTML en los cuerpos (AC-1, AC-5, AC-8)
- [x] T007 Añadir tests en rojo de las transformaciones de D-4: `Se cumple el [Checklist de Seguridad de IA](../guardrails/gr-ai-security-checklist.md)` → `Se cumple [[gr-ai-security-checklist]]` (y los otros dos `gr-*`); `Definition of Done para el estado IMPLEMENT es satisfactorio` → criterio con `[[dod-story-implement]]` (AC-6)
- [x] T008 Añadir tests en rojo de bloques no migrables: introducción, H1, comentarios y `## 📎 Notas adicionales` con solo `[Por completar]` se descartan sin error; con `monolith-custom.md` → `no-source` para `specify`, `unmigrated: ['Criterios de rendimiento']` y sin `replace-index` (F-5)
- [x] T009 Añadir tests en rojo de idempotencia del planificador: destino existente sin `force` → `preserve`; con `force` → `overwrite`; origen con `status: deprecated` → `alreadyIndex: true`, destinos presentes `preserve`, ausentes `no-source` (AC-8, D-5)
- [x] T010 Implementar `planDodMigration(sourceText, existing, options)` en `dod-story.js` (extracción por encabezado, D-4 pasos 1–5, reglas de descarte, D-5) hasta dejar T006–T009 en verde
- [x] T011 Implementar en `dod-story.js` el renderizado del índice deprecado (esquema de D-5: `kind: index`, `status: deprecated`, `slug: dod-story-checklist`, `superseded-by`, `removal: 4.0.0`, wikilinks a los siete slugs y mención a `/memory-system migrate --from=dod-monolithic`), con test que verifica esos campos (AC-7)
- [x] T012 Añadir test de CNF-01: el cuerpo (líneas tras el frontmatter) de cada destino de `monolith.md` tiene ≤ 40 líneas (CR-006)

## 3. Módulo `dod-story.js` — mapeo de config y evaluador de `check` (TDD)

- [x] T013 Añadir tests en rojo de `readDodMapping(configText)`: sección completa → `Map` de siete entradas; config sin `guardrails` → mapeo vacío; claves desconocidas se conservan; comentarios y comillas se ignoran como en `verify-config-contract.js` (AC-3, D-7)
- [x] T014 Implementar `readDodMapping` por indentación sobre la ruta `guardrails → dod → story` hasta dejar T013 en verde
- [x] T015 Añadir tests en rojo de `dodGuardrails(ctx)`, uno por regla de D-6: R1 (falta `from`; `enforcement` fuera de `{error, warn}`; nombre ≠ slug), R2 (fixture con `from: ACCEPTANCE` en verify → `from: ACCEPTANCE — se esperaba CODE-REVIEW`), R3, R4 (slug inexistente y etapa desconocida, `path` = `../sddf.config.yaml`), R5 (monolítico sin `status: deprecated`), R6 (skill consumidor sin `## DoD aplicable`), R7 (`SKILL.md` que cita `dod-story-checklist`) (AC-2, AC-3, AC-4)
- [x] T016 Añadir tests en rojo de aplicabilidad: raíz sin ningún DoD ni mapeo → 0 problemas; `skillsDir` nulo → R6/R7 no se evalúan; override de consumidor (`implement: dod-story-implement-acme`) → R1/R2 se aplican al archivo del override y R4 lo acepta (F-4)
- [x] T017 Implementar `dodGuardrails(ctx)` y exportar `DOD_STAGES`, `planDodMigration`, `readDodMapping`, `dodGuardrails` hasta dejar T015–T016 en verde

## 4. Motor `memory-system.js`

- [x] T018 Actualizar `test/memory-system.test.js`: `CHECK_KINDS` local con `dod-guardrail` al final y las aserciones de `summary` (líneas ~717, 719, 834, 847) con la nueva clave en 0 (CR-010); añadir tests en rojo de `parseArgs`: `migrate` sin `--from` → `UsageError`; `--from otro` → `UsageError`; `--from dod-monolithic` y `--skills-dir` aceptados
- [x] T019 En `memory-system.js`: añadir `migrate` a `COMMANDS`, `--from` y `--skills-dir` a `VALUE_FLAGS`, validación de `--from` en `parseArgs`, `USAGE` y cabecera de uso del archivo (D-3)
- [x] T020 Añadir tests en rojo de extremo a extremo de `migrate` sobre un directorio temporal: primera ejecución → etiquetas `[CREADO]` ×7 + `[REEMPLAZADO]` y `creados: 7 · sobrescritos: 0 · preservados: 0 · reemplazados: 1`, exit 0; segunda → `[PRESERVADO]` ×7 y `creados: 0 · sobrescritos: 0 · preservados: 7 · reemplazados: 0`, destinos byte a byte iguales; `--dry-run` tras migrar → `cambios pendientes: 0` sin escribir; destino editado a mano + re-ejecución sin `--force` → intacto; origen heredado en `policies/dod-story.md` → índice escrito en `guardrails/` y heredado eliminado; `monolith-custom.md` → exit 1 con `[SIN ORIGEN]` y `[NO MIGRADO]` y monolítico intacto (AC-7, AC-8, F-2, F-5)
- [x] T021 Implementar `runMigrate` en `memory-system.js` que delega en `migrateDod(specsBase, { dryRun, force, date })` del módulo (resolución del origen de D-3, `assertInsideRoot` por destino, escritura UTF-8 sin BOM, informe y exit codes de D-3) y registrarlo en `runners` de `main`; T020 en verde
- [x] T022 Integrar `dodGuardrails` en `checkMemory`: `CHECK_KINDS` con `dod-guardrail` al final, `EVALUATORS` ampliado, contexto con `repoRoot`, `skillsDir` (precedencia `--skills-dir` → `<REPO_ROOT>/skills` → `<REPO_ROOT>/<--cli-root>/skills` → nulo) y `dodMapping` leído de `<REPO_ROOT>/sddf.config.yaml`; cabecera del informe con `skills: <ruta|—>`; exportar lo nuevo en `module.exports`
- [x] T023 Ejecutar `npm test` y dejar en verde las suites `dod-story` y `memory-system`

## 5. Migración real del repositorio

- [x] T024 Ejecutar `node skills/memory-system/scripts/memory-system.js migrate --root docs --from dod-monolithic --dry-run` y revisar el plan: siete `[CREARÍA]` y un `[REEMPLAZARÍA]`, sin `[NO MIGRADO]`
- [x] T025 Ejecutar la migración real (F-1) y revisar con `git diff` que `docs/guardrails/dod-story-{specify,plan,implement,code-review,verify,acceptance,release}.md` contienen exactamente los criterios de su sección y que `dod-story-checklist.md` es el índice deprecado (AC-1, AC-5, AC-6, AC-7)
- [x] T026 Re-ejecutar la migración y su `--dry-run` y confirmar `creados: 0` y `cambios pendientes: 0` (AC-8)

## 6. Mapeo en configuración

- [x] T027 [P] Añadir a `sddf.config.yaml` el bloque `guardrails.dod.story` con las siete entradas por defecto de D-1 y un comentario que indique que es opcional y sobrescribible (AC-3)
- [x] T028 [P] Añadir el mismo bloque a `skills/sddf-init/assets/sddf.config.yaml.template` y `skills/sddf-init/assets/sddf.config.yaml.example`; comprobar `npm run verify:config` (AC-3)

## 7. Skills consumidores — sección `## DoD aplicable` (Opción A)

- [x] T029 Redactar el bloque estándar `## DoD aplicable` de D-8 (etapa, archivo, override, resolución en tres pasos, enforcement `error`/`warn`, aviso de ausencia accionable) y aplicarlo a `skills/story-verify/SKILL.md` tras `## Dependencias`; sustituir la carga de "sección VERIFY de `dod-story-checklist.md`", eliminar el fallback a `policies/dod-story.md` y actualizar mensajes y tabla de errores (AC-2)
- [x] T030 [P] Aplicar el bloque (etapa `acceptance`) a `skills/story-acceptance/SKILL.md` y actualizar su paso de carga, mensajes y ejemplo del caso "sin sección ACCEPTANCE" → "DoD de la etapa ausente" (AC-2)
- [x] T031 [P] Aplicar el bloque (etapa `code-review`) a `skills/story-code-review/SKILL.md`: carga, `$DOD_PATH`, hallazgos DoD con `dod-story-code-review.md:<línea>`, mensajes y tabla de errores (AC-2)
- [x] T032 [P] Actualizar la descripción de `$DOD_PATH` en los cuatro `skills/story-code-review/agents/*.agent.md` y la ruta de `examples/example-needs-changes-medium/fix-directives.md` (AC-2)
- [x] T033 [P] Aplicar el bloque (etapa `implement`) a `skills/story-implement/SKILL.md`: paso de carga del DoD IMPLEMENT y los ejemplos de lista blanca "solo lectura" (líneas ~124 y ~184) con `docs/guardrails/dod-story-implement.md` (AC-2)
- [x] T034 [P] Aplicar el bloque (etapa `implement`) a `skills/story-implement-tasks/SKILL.md`: tabla de entradas, paso de carga, mensajes y tabla de errores (AC-2)
- [x] T035 [P] Aplicar el bloque (etapa `plan`) a `skills/story-analyze/SKILL.md` y al comentario de `skills/story-analyze/assets/analyze-report-template.md` (AC-2)
- [x] T036 [P] Aplicar el bloque (etapa `plan`, como contexto de calidad) a `skills/story-design/SKILL.md`: entradas, Paso 3 y tabla de errores (AC-2)
- [x] T037 [P] Aplicar el bloque (etapa `plan`) a `skills/story-plan/SKILL.md` indicando que lo evalúa `story-analyze` en el Paso 5 y que `story-plan` no lo carga (AC-2, D-8)
- [x] T038 [P] Aplicar el bloque (etapa `specify`, `enforcement: warn`) a `skills/story-specify/SKILL.md` y añadir el paso de verificación del DoD SPECIFY antes de escribir `SPECIFY/DONE`, que registra criterios incumplidos sin bloquear (AC-2, D-1)
- [x] T039 [P] Actualizar `skills/story-verify/README.md` y `skills/docs-wiki-builder/assets/wiki-index-template.md` para que no nombren el monolítico (AC-2)
- [x] T040 [P] Actualizar fixtures de evals: en `skills/story-implement/evals/evals.json` sustituir la ruta de ejemplo `docs/guardrails/dod-story-checklist.md` por `docs/guardrails/dod-story-implement.md`; en `skills/story-acceptance/evals/evals.json` reescribir el caso "sin sección ACCEPTANCE" como "`dod-story-acceptance.md` ausente" con el aviso de D-8 (AC-2)

## 8. Consumidores: `project-policies-generation` y `sddf-init`

- [x] T041 Generar las siete plantillas `skills/project-policies-generation/assets/dod-story/dod-story-<stage>.md` ejecutando `migrate` sobre una raíz temporal que contenga `assets/dod-story-checklist-template.md` como monolítico, y copiar el resultado sin editarlo a mano (D-9)
- [x] T042 Eliminar `skills/project-policies-generation/assets/dod-story-checklist-template.md` y reescribir su `SKILL.md`: Salida, Dependencias y Precondiciones con las siete plantillas; Paso 3 crea cada archivo faltante (copia-si-falta); Paso 3d auto-completa por archivo; detección de monolítico o `policies/dod-story.md` → sugerir `/memory-system migrate --from=dod-monolithic`; el registro en `CLAUDE.md` deja de importar el DoD (D-9, AC-7)
- [x] T043 [P] Actualizar `skills/sddf-init/SKILL.md`: pregunta del Paso 5 e informe de ejemplo con `guardrails/dod-story-*.md` (D-9)

## 9. Skill `memory-system` y sus referencias

- [x] T044 Actualizar `skills/memory-system/SKILL.md`: tabla de Parámetros (`migrate --from=dod-monolithic [--dry-run] [--force]`, `check --skills-dir`), Dependencias (`scripts/dod-story.js`), §3.5 con la familia `dod-guardrail` y su sugerencia de corrección, y §3.6 con la rama `--from` (normalización de `--from=valor`, invocación del motor, informe y exit codes) (D-3, D-6)
- [x] T045 [P] Actualizar `skills/memory-system/references/memory-rules.md`: fila `dod-guardrail` en §7 y línea de resumen; nueva sección con `DOD_STAGES`, semántica de `from`/`to`, reglas R1–R7, aplicabilidad y precedencia de `skillsDir` (D-6)
- [x] T046 Añadir a `skills/memory-system/evals/evals.json` casos para `migrate --from=dod-monolithic` (primera ejecución, re-ejecución idempotente, `--from` inválido) y `check` con problemas `dod-guardrail`; comprobar `npm run verify:eval-inventory`

## 10. Documentación y registro

- [x] T047 [P] `docs/guardrails/README.md`: sustituir la fila del monolítico por siete filas (archivo, etapa, `enforcement`, skill que lo evalúa) y una nota sobre el índice deprecado (D-10)
- [x] T048 [P] `docs/constitution.md` y `docs/domains/domain.md`: enlaces y fila de artefactos hacia `guardrails/README.md` y `dod-story-<etapa>.md` (D-10)
- [x] T049 [P] `AGENTS.md`: comentario del árbol de `guardrails/` y retirada del import `@docs/guardrails/dod-story-checklist.md` (D-10, CNF-01)
- [x] T050 [P] `README.md`: árbol, tabla de artefactos versionados, mención del DoD por etapa y enlace de contribución a `docs/guardrails/` (CNF-05)
- [x] T051 [P] `docs/architecture/memory-system.md`: árbol de `guardrails/`, antipatrón, subcomando `migrate --from` y familia `dod-guardrail` (CNF-05)
- [x] T052 [P] `docs/guides/sddf-commands-pipeline.md`: DoD por etapa, bloque `DoD aplicable`, mapeo `guardrails.dod.story` con ejemplo de override y `migrate --from=dod-monolithic` (CNF-05)
- [x] T053 [P] `CHANGELOG.md` `3.3.0 [Unreleased]`: `Changed` (división en siete archivos, bloque `DoD aplicable`, mapeo en config, familia `dod-guardrail` y clave nueva en el JSON de `check`) y `Deprecated` (`dod-story-checklist.md` como índice, eliminación en `4.0.0`; fallback `policies/dod-story.md` retirado y absorbido por la migración) (AC-7, CNF-03)
- [x] T054 Regenerar `docs/index.md` con `/memory-system index` (no editarlo a mano) y comprobar que no hay slugs duplicados nuevos

## 11. Verificación

- [x] T055 `grep -rn "dod-story-checklist\|policies/dod-story" skills/` sin resultados; `grep -rln "## DoD aplicable" skills/*/SKILL.md` devuelve los nueve skills de D-1, cada uno con su `dod-story-<stage>` (AC-2, CR-001, CR-003)
- [x] T056 `node skills/memory-system/scripts/memory-system.js check --root docs --skills-dir skills --json`: `summary["dod-guardrail"] = 0` y ninguna familia supera la línea base de T001 (CF-08, CR-004)
- [x] T057 Verificación negativa del gate: en una copia temporal, invertir `from` de `dod-story-verify.md` a `ACCEPTANCE` y quitar la sección de un `SKILL.md` → `check` exit 1 con los problemas R2 y R6 (AC-4)
- [x] T058 `npm test`, `npm run verify:links`, `npm run verify:syntax`, `npm run verify:config`, `npm run verify:eval-inventory` y `npm run verify:repository` en exit 0 (CNF-07)
- [x] T059 `npm run test:eval -- memory-system story-acceptance story-implement` para los skills con evals modificados; registrar en `implement-report.md` cualquier fallo flaky reejecutado — ejecutados los 6 casos nuevos o modificados (memory-system TC-019…TC-022, story-acceptance TC-004, story-specify TC-006): 6/6 PASS; TC-004 necesitó precisar dos aserciones heredadas
- [x] T060 Verificación manual de F-3: ejecutar `/story-verify` (o `/story-implement`) sobre una historia de prueba y confirmar que solo se carga `dod-story-<etapa>.md`; con un override temporal en `sddf.config.yaml` confirmar que se carga el archivo del override (AC-3, Verificaciones 7–8 de la historia) — cubierto por EV-005 (story-acceptance resuelve y nombra solo `dod-story-acceptance.md`), EV-007 (story-specify carga `dod-story-specify.md`) e IT-009 (override en `check`); la carga de un override por un agente en ejecución real queda para ACCEPTANCE
- [x] Implementar fix-directives.md — convención I-11 (`from: <ETAPA>/IN-PROGRESS`, `to: <ETAPA>/DONE`, `release` → `deliver`) propagada a código, tests, plantillas, config, reglas, docs y artefactos de la historia
