---
alwaysApply: false
type: tasks
id: STORY-172
slug: STORY-172-skill-epic-complete-archivar-epicas-canceladas-tasks
title: "Tasks: Skill epic-complete — archivar épicas canceladas"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-23-completar-flujo-de-epic
story: STORY-172
design: STORY-172
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-172-skill-epic-complete-archivar-epicas-canceladas
---

<!-- Referencias -->
[[STORY-172-skill-epic-complete-archivar-epicas-canceladas]]

> **Orden de entrega:** STORY-175 → STORY-171 → STORY-172 (CR-001 del diseño). Todas las tareas modifican artefactos que crea STORY-171; las pruebas usan fixtures en repos temporales y ninguna mueve una épica real del repositorio.

## 1. Precondiciones

- [x] T001 Verificar que existen `skills/epic-complete/scripts/epic-complete.js`, `skills/epic-complete/SKILL.md`, `skills/epic-complete/references/error-codes.md`, `skills/epic-complete/README.md`, `skills/epic-complete/evals/evals.json` y `test/epic-complete.test.js`, y que `npm test` pasa; si falta alguno, detener (STORY-171 no entregada). Confirmar en el código real los nombres `planCompletion`, `applyCompletion`, `archiveDateOf` y la posición del chequeo `ARCHIVE_CONFLICT` tras resolver `archiveDate` (CR-001, Risks) // AC-1, AC-3
- [x] T002 [P] Corregir en `related:` de `story.md` el slug obsoleto `STORY-171-skill-epic-complete-core-completar-y-archivar-una-epica-liberada` por `STORY-171-completar-archivar-epica-liberada` (CR-002) — ya corregido: `related:` usa el slug vigente

## 2. Motor `scripts/epic-complete.js`

- [x] T003 Ampliar la tabla de admisión de `planCompletion` en el orden del diseño: `SHIP/DONE` → `complete`; `COMPLETED/DONE` → `archive-only`; `CANCELED/DONE` → `archive-canceled`; `CANCELED/<otro>` → `fail('CANCELED_NOT_DONE', 'La épica EPIC-NN no puede archivarse: estado actual CANCELED/<substatus>. Solo se archivan las épicas canceladas con substatus DONE.')` sin sugerir comando; cualquier otro par → `NOT_SHIPPED` sin cambios (Esquema › Tabla de admisión, D-1, D-4) // AC-1, AC-2
- [x] T004 En `planCompletion`, tratar `archive-canceled` como `archive-only` para fecha y destino: `archiveDate = archiveDateOf(frontmatter)` (sin fecha → `NO_ARCHIVE_DATE` con `updated:`, `created:`, `date:`), `ARCHIVE_CONFLICT` heredado; no resolver versión ni leer `CHANGELOG.md`, ignorar `--version` y devolver `version: null`, `versionSource: null` (D-3, D-5, D-6) // AC-1, AC-3
- [x] T005 En `applyCompletion`, no escribir `epic.md` con `archive-canceled` (solo `complete` escribe); `MOVE_FAILED` con `archive-canceled` dice «`epic.md` no se modificó»; éxito → `message: "EPIC-NN archivada como CANCELED (status sin cambios): <to>/"`. Actualizar la cabecera de uso del motor con la fila `CANCELED/DONE → archive-canceled` (Interfaces, D-2) // AC-1, CNF-1

## 3. SKILL.md y soporte

- [x] T006 Actualizar `skills/epic-complete/SKILL.md`: fila `CANCELED/DONE` (`archive-canceled`, `epic.md` no cambia, fecha de `updated:`/`created:`/`date:`) y fila de rechazo `CANCELED/otro substatus` en Precondiciones; resumen `Acción: sin cambio de status (CANCELED/DONE)`; pregunta `¿Confirmas archivar <EPIC_ID> (CANCELED/DONE, el status no cambia) en <to>/? (s/n)`; línea `✅ <EPIC_ID> archivada como CANCELED (status sin cambios): <to>/`; añadir «archivar épica cancelada» a los disparadores de `description` sin superar 350 caracteres. Verificar que sigue < 200 líneas y conserva `<!-- SDDF-FIXED-LAYOUT: v1 -->` (Interfaces, F1, D-7) // AC-1, AC-2, CNF-2, CNF-3, CNF-4
- [x] T007 [P] Actualizar `skills/epic-complete/references/error-codes.md`: fila `CANCELED_NOT_DONE` (cuándo: `status: CANCELED` con substatus ≠ `DONE`; mensaje: estado actual y «solo se archivan las épicas canceladas con substatus DONE»; sin cambios); `NOT_SHIPPED` pasa a «estado distinto de `SHIP/DONE`, `COMPLETED/DONE` y `CANCELED/*`»; `NO_ARCHIVE_DATE` cubre `COMPLETED/DONE` o `CANCELED/DONE` (Componentes, D-4) // AC-2
- [x] T008 [P] Actualizar `skills/epic-complete/README.md`: añadir `CANCELED/DONE` (archivo sin cambio de status) a los estados admitidos y retirar la exclusión «`CANCELED/DONE` hasta STORY-172» // CNF-4

## 4. Pruebas del motor

- [x] T009 En `test/epic-complete.test.js`, retirar `CANCELED/DONE` del caso que espera `NOT_SHIPPED` (contrato 4 de STORY-171) y añadir la sección `// ── STORY-172 — archivado de épicas CANCELED ──` con: `CANCELED/DONE` → `plan` con `action: archive-canceled` y `archiveDate` de `updated:`, de `created:` y de `date:` (solo sin las otras dos) (contrato 1) // AC-1
- [x] T010 Añadir casos del contrato 2–3: `CANCELED/DONE` + `apply` → directorio en `specs/flow/archive/<archiveDate>-EPIC-NN-<slug>/`, ausente de `specs/flow/`, `epic.md` byte a byte igual con `^status: CANCELED$` y `^substatus: DONE$`, `message` con `archivada como CANCELED (status sin cambios)`; con historial, `git status --porcelain` con rename `R` y sin commit nuevo // AC-1, CNF-1
- [x] T011 Añadir casos de los contratos 4–6: `CANCELED/IN-PROGRESS` → `CANCELED_NOT_DONE` con `CANCELED/IN-PROGRESS` y «solo se archivan las épicas canceladas con substatus DONE», sin `/epic-ship`, snapshot idéntico; `CANCELED/DONE` con destino existente → `ARCHIVE_CONFLICT` con la ruta, snapshot idéntico; `CANCELED/DONE` sin fecha válida → `NO_ARCHIVE_DATE`; `CANCELED/DONE` con `--version 9.9.9` → `version: null` // AC-2, AC-3

## 5. Evals

- [x] T012 Añadir a `skills/epic-complete/evals/evals.json` (sin renumerar los TC de STORY-171, ampliando `description`): TC `CANCELED/DONE` + `s` → `contains` `el status no cambia`, `archivada como CANCELED (status sin cambios)`, `specs/flow/archive/`; `not_contains` `❌`, `COMPLETED`. TC `CANCELED/IN-PROGRESS` → `contains` `solo se archivan las épicas canceladas con substatus DONE`; `not_contains` `¿Confirmas`, `/epic-ship`. TC `CANCELED/DONE` con destino existente → `contains` la ruta en conflicto; `not_contains` `¿Confirmas`, `archivada` (contratos 7–9) // AC-1, AC-2, AC-3, CNF-2

## 6. Integración y documentación

- [x] T013 [P] Ampliar la fila de `epic-complete` en `docs/domains/domain-skills-map.md › ## Épica (L2)` con «o archiva una `CANCELED/DONE` sin cambiar su status» // CS-19
- [x] T014 [P] Añadir en `CHANGELOG.md › ## [Unreleased]` (`### Added`, o `### Changed` si la entrada de STORY-171 ya fue liberada) la entrada «`epic-complete` archiva épicas `CANCELED/DONE` conservando su status (STORY-172)» // CS-19

## 7. Verificación

- [x] T015 Ejecutar `npm test` y confirmar que `test/epic-complete.test.js` (contratos 1–6 de esta historia y los de STORY-171) y `test/story-complete.test.js` pasan // AC-1, AC-2, AC-3, CNF-1
- [x] T016 Ejecutar `npm run verify:repository` y confirmar que `verify-fixed-layout.js` y `verify-eval-inventory.js` aceptan `SKILL.md` y `evals/evals.json` (contrato 10) // CNF-3, CNF-4, CS-21
- [x] T017 Ejecutar `graphify update .` para mantener el grafo al día
- [x] T018 Dejar registrado para revisión humana que `npm run test:eval -- epic-complete` (contratos 7–9) se ejecuta manualmente a criterio humano, según AGENTS.md; no ejecutarlo de forma automática // AC-1, AC-2, AC-3 — registrado en implement-report.md (pendiente de ejecución humana)
