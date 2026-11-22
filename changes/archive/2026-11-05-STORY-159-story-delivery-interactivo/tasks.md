---
alwaysApply: false
type: tasks
id: STORY-159
slug: STORY-159-story-delivery-interactivo-tasks
title: "Tasks: story-delivery interactivo en modelo batch"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-27-completar-flujo-de-story
story: STORY-159
design: STORY-159
created: 2026-10-25
updated: 2026-10-25
related:
  - STORY-159-story-delivery-interactivo
  - STORY-159-story-delivery-interactivo-design
---

<!-- Referencias -->
[[STORY-159-story-delivery-interactivo]] · [[STORY-159-story-delivery-interactivo-design]]

## 1. Setup y pruebas primero (RED)

- [x] T001 Crear el directorio `skills/story-delivery/` con `evals/` (C-1, C-3). Hecho: `ls skills/story-delivery/evals` no falla.
- [x] T002 [P] Crear `skills/story-delivery/evals/evals.json` con el formato de `skills/story-acceptance/evals/evals.json` (`skill`, `version: 1.0.0`, `description`, `cases[]`) y los casos TC-001 happy path batch (AC-1: tabla de 7 criterios, instalación «no aplica en batch», `DELIVER/DONE` y `updated` de hoy), TC-002 estado `VERIFY/DONE` (AC-2 fila 1), TC-003 DoD incumplido sin pregunta final (AC-2 fila 2), TC-004 usuario rechaza (AC-2 fila 3), TC-005 `delivery-model: continuous` falla cerrado (D-2) y TC-006 DoD ausente falla cerrado (D-8); en TC-002…TC-006 `expected.not_contains` incluye `DELIVER/DONE` escrito (C-3, AC-1, AC-2, CNF-3). Hecho: `node scripts/verify-eval-inventory.js` deja de reportar `story-delivery` como skill sin evals una vez exista el SKILL.md.
- [x] T003 [P] Actualizar UT-003 de `test/dod-story.test.js` para esperar `deliver.skills` = `['story-delivery']`, manteniendo `kind: content`, `appliesTo: deliver`, `from/to: null` (C-5, D-7). Hecho: `node --test test/dod-story.test.js` falla en UT-003 (RED).

## 2. Skill story-delivery (componente central)

- [x] T004 Redactar en `skills/story-delivery/SKILL.md` el frontmatter (`name: story-delivery`, `description` con disparadores «story-delivery», «entregar historia», «DELIVER»; `triggers`; `outputs: [story.md (frontmatter actualizado)]`) y las secciones `## Objetivo`, `## Posicionamiento` (`ACCEPTANCE/DONE` → `DELIVER/DONE`, siguiente `/story-complete`), `## Entrada`, `## Parámetros` (solo `{story_id}`/`{story_path}`, sin flags), `## Dependencias`, `## Modos de ejecución` (solo manual) y `## Restricciones / Reglas` (no escribe nada al bloquear, solo edita `status`/`substatus`/`updated`, UTF-8 sin BOM, no despliega ni publica) siguiendo la estructura de `story-acceptance` (C-1, D-10). Hecho: las secciones existen en ese orden.
- [x] T005 Redactar `## DoD aplicable` con etapa `deliver`, archivo `docs/guardrails/dod-story-deliver.md`, override `sddf.config.yaml › guardrails.dod.story.deliver`, enforcement por frontmatter y la resolución fail-closed de D-8 (sin DoD o sin líneas `- [ ]` → `❌ DoD de entrega no encontrado (probado: <rutas>)…`, sin cambios) (C-1, D-8). Hecho: la sección cita `dod-story-deliver`.
- [x] T006 Redactar en `## Flujo de ejecución` el Paso 0 con el bloque `<!-- SDDF-FIXED-LAYOUT: v1 -->` idéntico al de los demás skills y el Paso 1 (resolución por ID o ruta replicada de `story-acceptance` 1a–1c, rechazo de `specs/flow/archive/`, precondición única `ACCEPTANCE/DONE` con mensaje `❌ La historia STORY-NNN no está en ACCEPTANCE/DONE. Estado actual: <status>/<substatus>`) (C-1, D-1, CNF-1, AC-2 fila 1). Hecho: `node scripts/verify-fixed-layout.js` pasa.
- [x] T007 Redactar el Paso 2: leer `defaults.delivery-model`; `batch` continúa; otro valor, ausente o `sddf.config.yaml` ausente → `❌ story-delivery solo soporta delivery-model: batch (valor leído: <valor | ausente>)` sin cambios; documentar que es la única rama por modelo (punto de extensión de STORY-162) (C-1, D-2, F-4). Hecho: el paso contiene las tres ramas.
- [x] T008 Redactar el Paso 3 (resolver DoD y leer `enforcement` y criterios `- [ ]`) y el Paso 4 con la tabla de clasificación de evidencia de D-3 en su orden (`no-aplica-batch` → `comando` → `artefacto` → `confirmación`), las reglas de ❌ (comando que falla o no ejecuta, artefacto ausente, respuesta `n`), la pregunta por criterio `¿Se cumple «<criterio>»? (s/n)` y la tabla de salida `| # | Criterio | Estado | Evidencia |` con el esquema de datos de design.md (C-1, D-3, AC-1). Hecho: aplicada mentalmente al DoD actual, la tabla da CI y secrets → `confirmación`, SemVer, CHANGELOG y `files` → `artefacto`, `npm pack --dry-run` → `comando`, instalación → «no aplica en batch».
- [x] T009 Redactar el Paso 5 de decisión según D-4: con ❌ y `enforcement: error` → `❌ Entrega bloqueada: criterios incumplidos del DoD` + lista, sin pregunta final; con `warn` → advertencia y continuar; sin bloqueo → `¿Confirmas la entrega de STORY-NNN a DELIVER/DONE? (s/n)`, solo `s`/`si`/`sí` confirma; otra respuesta → `Entrega cancelada por el usuario. story.md no cambió.` (C-1, D-4, AC-2 filas 2 y 3). Hecho: la pregunta final no aparece en el camino de bloqueo.
- [x] T010 Redactar el Paso 6 de escritura según D-5: sustituir solo `status: DELIVER`, `substatus: DONE` y `updated: <hoy>` (añadir `updated:` tras `created:` si falta), preservar el resto byte a byte; error de E/S → `❌ No se pudo escribir story.md` sin reintento; mensaje final `✅ STORY-NNN entregada: DELIVER/DONE` con sugerencia `/story-complete STORY-NNN`; y la sección `## Salida` (único archivo escrito: `story.md`, solo en éxito; ningún archivo creado) (C-1, D-5, D-6, F-3, AC-1, CNF-3). Hecho: ningún paso anterior al 6 escribe archivos.
- [x] T011 [P] Crear `skills/story-delivery/README.md` con el formato de `skills/story-acceptance/README.md`: propósito, uso `/story-delivery STORY-NNN`, precondición, alcance batch y extensiones previstas (STORY-162, STORY-163) (C-2). Hecho: el README existe y no describe flags no implementados como disponibles.

## 3. Registro de etapa deliver (GREEN)

- [x] T012 En `skills/memory-system/scripts/dod-story.js` cambiar la entrada `deliver` de `DOD_STAGES` a `skills: ['story-delivery']`, conservando `kind`, `from`, `to`, `appliesTo` y `optional`, y actualizar el comentario de cabecera que dice «sin skill por ahora» (C-4, D-7). Hecho: `node --test test/dod-story.test.js` pasa (UT-003 en GREEN) y `skillProblems` no reporta `skills/story-delivery/SKILL.md`.

## 4. Documentos de dominio (AC-3)

- [x] T013 [P] `docs/domains/domain-state-management.md`: reescribir el invariante 6 de §4 según D-9 (`SHIP` y `COMPLETED` manuales o CI/CD; `DELIVER` de story la escribe `story-delivery` con confirmación humana) y añadir a §5.2 que una transición terminal escrita por un skill solo ocurre tras confirmación humana (C-6, AC-3). Hecho: el invariante ya no prohíbe `DELIVER` y sigue prohibiendo `SHIP`/`COMPLETED`.
- [x] T014 [P] `docs/domains/domain-story-lifecycle.md`: en la fila `DELIVER` de §5 cambiar la descripción («La escribe `story-delivery` tras verificar el DoD de entrega y con confirmación humana.»), el actor («Humano (vía `story-delivery`) / CI-CD») y el substatus inicial a `DONE` (C-7, D-5, D-9, AC-3). Hecho: la fila no contiene «no escribe ningún skill».
- [x] T015 [P] `docs/domains/domain.md`: reescribir BR-006 según D-9 y ajustar el resumen de substatus de `## State Models` (C-8, AC-3). Hecho: BR-006 nombra `story-delivery` y mantiene `SHIP` y `COMPLETED` sin escritor.

## 5. Documentación derivada (coherencia, CR-003)

- [x] T016 [P] `docs/architecture/state-machine.md`: ajustar la línea 72 (`CANCELED` «como `COMPLETED`»), la fila `DELIVER` de la tabla de estados, añadir la fila `story-delivery` a la tabla de transiciones por skill (`ACCEPTANCE/DONE` → — → `DELIVER/DONE`, sin retroceso) y reescribir el párrafo «DELIVER y COMPLETED son transiciones manuales» para dejar solo `COMPLETED` como manual (C-9). Hecho: ninguna frase del archivo afirma que ningún skill escribe `DELIVER`.
- [x] T017 [P] `docs/guides/sddf-commands-pipeline.md`: en la fila `deliver` sustituir «revisión humana antes de publicar (sin skill por ahora)» por `story-delivery` con confirmación humana (C-10). Hecho: la fila nombra el skill.
- [x] T018 [P] `README.md` línea 205: reemplazar «`DELIVER` es una transición de entrega humana o de CI; no corresponde a un skill independiente» por que `DELIVER` lo escribe `/story-delivery` con confirmación humana tras verificar el DoD de entrega (C-11). Hecho: `README.md` no contradice la existencia del skill.

## 6. Verificación

- [x] T019 Verificar AC-3 por búsqueda: `grep -n "story-delivery"` en los tres documentos de dominio devuelve la regla nueva en cada uno, y `grep -rn "ningún skill" docs/domains docs/architecture/state-machine.md` no deja ninguna frase que prohíba `DELIVER` (Contrato 5).
- [x] T020 Verificar CNF-1 y CNF-2: `node scripts/verify-fixed-layout.js` pasa y `npm pack --dry-run` lista `skills/story-delivery/SKILL.md`; confirmar que `package.json` no se modificó (Contratos 6 y 7, CR-001).
- [x] T021 Ejecutar `npm test` y `npm run verify:repository` y corregir hasta verlos en verde (incluye `verify-eval-inventory`, `memory-system check` y `check-doc-links`) (Contratos 8 y 9, CNF-4).
- [~] T022 Ejecutar a criterio humano `npm run test:eval -- story-delivery` y revisar TC-001…TC-006 (AC-1, AC-2, CNF-3; ejecución manual por cuota, regla de `AGENTS.md`) (Contratos 1–4). — pendiente de ejecución humana: el usuario decidió ejecutar los evals por su cuenta (regla de AGENTS.md)
- [x] T023 Ejecutar `graphify update .` para refrescar el grafo tras los cambios.
