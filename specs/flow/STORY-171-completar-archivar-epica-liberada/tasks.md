---
alwaysApply: false
type: tasks
id: STORY-171
slug: STORY-171-completar-archivar-epica-liberada-tasks
title: "Tasks: Skill epic-complete (Core) — completar y archivar una épica liberada"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-23-completar-flujo-de-epic
story: STORY-171
design: STORY-171
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-171-completar-archivar-epica-liberada
---

<!-- Referencias -->
[[STORY-171-completar-archivar-epica-liberada]]

> **Orden de entrega:** STORY-175 (ADR que admite épicas archivadas) se entrega antes. Estas tareas se desarrollan y prueban sobre fixtures en repos temporales; ninguna mueve una épica real del repositorio.

## 1. Scaffolding

- [ ] T001 Invocar `skill-master` para crear el skill `epic-complete` en `skills/epic-complete/` con `SKILL.md`, `README.md`, `scripts/`, `references/` y `evals/` (nunca en los destinos de runtime `.claude/`, `.codex/`, `.agents/`); `package.json` no se edita porque `files` ya publica `skills/` (D-1, Componentes) // CS-12, CNF-6

## 2. Motor `scripts/epic-complete.js` (componente central)

- [ ] T002 Crear `skills/epic-complete/scripts/epic-complete.js` (CommonJS, `'use strict'`, sin dependencias npm) con la cabecera de uso, las constantes `FLOW = 'specs/flow'` y `ARCHIVE = 'specs/flow/archive'` y las regex `ID_RE` (`^EPIC-\d{2,}$`), `ACTIVE_EPIC_RE` (`^EPIC-\d{2,}-`), `ARCHIVED_EPIC_RE` (`^\d{4}-\d{2}-\d{2}-EPIC-\d{2,}-`), `EPIC_PATH_RE` (`^specs/flow/EPIC-\d{2,}-[^/]+$`), `DATE_RE` y `VERSION_RE` (`^v?\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$`); portar de `skills/story-complete/scripts/story-complete.js` las utilidades `git`, `abs`, `entries`, `countDirs`, `parseField`, `frontmatterClose`, `readFrontmatter`, `archiveDateOf`, `isRepoRoot`, `fail`, `moveMethodOf`, `localToday` sin cambiar su comportamiento (D-1, D-6, D-7, Destino) // CNF-1, CNF-2
- [ ] T003 Implementar `countEpics(repoRoot)` (activas `ACTIVE_EPIC_RE` en `specs/flow/` + archivadas `ARCHIVED_EPIC_RE` en `specs/flow/archive/`) y `locateEpic({ repoRoot, id, epicPath })`: `--path` fuera de `EPIC_PATH_RE` → `INVALID_PATH`; ningún `specs/flow/<id>-*/` → `NOT_FOUND` con pista `ya archivada en specs/flow/archive/<dir>/` si existe `<fecha>-<id>-*`; más de uno → `AMBIGUOUS` con las rutas; sin `epic.md` → `NO_EPIC_FILE`; nunca busca dentro de `specs/flow/archive/` para resolver (Interfaces, F2) // AC-2
- [ ] T004 Implementar `releasedVersionOf(changelogText, epicId)` → `{ version, reason }`: localizar `<!-- epic-ship:<epicId>:start -->`; sin él → `no-block`; el encabezado `## [` más cercano por encima: `## [x.y.z]…` → `{ version: 'x.y.z', reason: 'found' }`, `## [Unreleased]` o ninguno → `unreleased`; el llamador usa `no-changelog` si `<REPO_ROOT>/CHANGELOG.md` no existe (D-4, Resolución de la versión) // AC-1
- [ ] T005 Implementar `planCompletion({ repoRoot, id, epicPath, version, today })` de solo lectura: `locateEpic`; frontmatter sin `status`/`substatus` → `NO_STATUS`; tabla de admisión `SHIP/DONE` → `complete`, `COMPLETED/DONE` → `archive-only`, cualquier otro par (incluido `CANCELED/*`) → `NOT_SHIPPED` con el mensaje literal `La épica EPIC-NN está en <status>/<substatus>: solo se completan épicas en SHIP/DONE, COMPLETED/DONE o CANCELED/DONE.` más `Ejecuta antes /epic-ship EPIC-NN` si el estado es `VALIDATE/DONE` (Tabla de admisión, D-3, D-9) // AC-2
- [ ] T006 Completar `planCompletion` con versión, fecha y destino: para `complete`, `--version` válido (sin `v` inicial) → `versionSource: argument`, con aviso `⚠️ CHANGELOG.md ubica EPIC-NN en <x>; se usará --version <y>` si difieren; si no, `releasedVersionOf` → `versionSource: changelog`; sin versión → `NO_VERSION` con el motivo (`unreleased` / `no-block` / `no-changelog`) y la instrucción `--version x.y.z`; `archiveDate` = hoy (`complete`) o `archiveDateOf` (`archive-only`), sin fecha → `NO_ARCHIVE_DATE` nombrando `updated:`, `created:`, `date:`; `to` existente → `ARCHIVE_CONFLICT`; devolver `{ ok, code: 'OK', message, epic, action, archiveDate, version, versionSource, from, to, moveMethod, warnings }` con el aviso de movimiento sin `git mv` si `moveMethod: rename` (D-4, D-6, Interfaces) // AC-1, CNF-2
- [ ] T007 Implementar `completeEpicFrontmatter(text, today, version)`: quitar BOM, conservar el final de línea de cada línea; reemplazar la última `status:` de nivel superior (debe valer `SHIP`, si no lanzar) por `status: COMPLETED`; `updated:` reemplazar o insertar tras `created:` (o antes del cierre); `completed: <today>` reemplazar o insertar tras `updated:`; `version: <version>` reemplazar o insertar tras `completed:`; `substatus` y cuerpo intactos; lanzar si no hay `---` de cierre (Frontmatter tras `complete`, D-5) // AC-1
- [ ] T008 Implementar `moveEpic` (`git mv` o `fs.renameSync`, nunca lanza) y `applyCompletion` en el orden de D-8: re-planificar; contar; leer los bytes originales de `epic.md`; si `complete`, escribir el frontmatter (fallo → `WRITE_FAILED`, nada movido); crear `specs/flow/archive/` si falta; mover; si falla, restaurar los bytes originales → `MOVE_FAILED`, o `ROLLBACK_FAILED` con `git checkout -- <from>/epic.md`; conteo distinto → `COUNT_MISMATCH`; éxito → `message` `EPIC-NN archivada en <to>/` y `counts { before, after }`; nunca hace commit (F1, F5, D-7, D-8) // AC-1, CNF-1
- [ ] T009 Implementar `parseArgs` y `main`: subcomando `plan|apply`; `--repo-root` obligatorio; exactamente uno de `--id` (validado con `ID_RE`) o `--path`; `--version` opcional validado con `VERSION_RE`; flags desconocidos o sin valor → stderr `[ERROR]` + uso y exit `2`; un único JSON en stdout y exit `0`/`1`; `module.exports = { locateEpic, archiveDateOf, releasedVersionOf, planCompletion, applyCompletion }` (Interfaces) // AC-1, AC-2

## 3. SKILL.md (orquestación)

- [ ] T010 Escribir el frontmatter de `skills/epic-complete/SKILL.md`: `name: epic-complete`, `description: >-` en español ≤ 350 caracteres con disparadores «epic-complete», «completar épica», «archivar épica», «cerrar épica», «COMPLETED»; sin claves fuera de las admitidas por `docs/guardrails/gr-skill-creation-checklist.md` (Interfaces) // CS-12, CNF-6
- [ ] T011 Escribir Objetivo, Posicionamiento (`epic-ship → epic-complete`, nodo `epic-complete` del flowchart), Entrada, Parámetros (`EPIC-NN` o ruta, `--version` opcional; sin modo automático ni `--yes`), Precondiciones (tabla de admisión de dos filas más el rechazo, declarando que la aplica el motor) y Restricciones: nunca escribe ni mueve sin `s`; no hace commit, push ni PR; no archiva historias hijas; no edita a mano, toda escritura la hace el motor; UTF-8 sin BOM (Goals/Non-Goals, D-2, D-3) // AC-2, CNF-1, CNF-3
- [ ] T012 Escribir el Paso 0 con `<!-- SDDF-FIXED-LAYOUT: v1 -->`, resolución de solo `REPO_ROOT` y, por separado, `CLI_ROOT` solo para localizar el motor (mismo bloque que `skills/story-complete/SKILL.md`) // CNF-4
- [ ] T013 Escribir los Pasos 1–3: resolver el argumento (`EPIC-NN` → `--id`, ruta → `--path`, sin argumento → preguntar el ID); localizar `<CLI_ROOT>/skills/epic-complete/scripts/epic-complete.js` y `node --version` (ausentes → `❌ No se encontró el motor de epic-complete (<ruta probada>) o node no está en PATH` y fin); invocar `plan`; con `ok: false` cargar `references/error-codes.md`, mostrar `❌ <message>` y terminar **sin preguntar** (F2, D-3, D-10) // AC-2, CNF-5
- [ ] T014 Escribir el Paso 4 (confirmación): resumen desde el JSON (estado, acción, versión y `versionSource`, origen, destino, método, avisos) y la pregunta `¿Confirmas que la versión <version> de <EPIC_ID> opera correctamente tras el despliegue y quieres completarla y archivarla en <to>/? (s/n)` (con `archive-only`: `¿Confirmas archivar <EPIC_ID> (ya COMPLETED/DONE, el status no cambia) en <to>/? (s/n)`); solo `s`/`si`/`sí` sin distinguir mayúsculas confirman; cualquier otra respuesta o ninguna → `Operación cancelada por el usuario: no hubo cambios.` sin invocar `apply` (F1, F3, F4, D-2) // AC-1, AC-3, CNF-3
- [ ] T015 Escribir los Pasos 5–6: `apply` con los mismos argumentos; `ok: true` → `✅ <EPIC_ID> archivada en <to>/ · COMPLETED/DONE · versión <version> · completed: <hoy>` (o sin cambio de status en `archive-only`), avisos y recordatorio de que el commit queda a cargo del usuario; `ok: false` → cargar `references/error-codes.md` y mostrar `❌ <message>` sin reintentar ni reparar a mano; sección «Salida» con `epic.md` actualizado y el directorio archivado. Verificar que `SKILL.md` queda < 200 líneas (F1, F5) // AC-1, CNF-6

## 4. Componentes de soporte

- [ ] T016 [P] Crear `skills/epic-complete/references/error-codes.md` con la tabla código → cuándo → mensaje → estado resultante para `NOT_FOUND`, `AMBIGUOUS`, `INVALID_PATH`, `NO_EPIC_FILE`, `NO_STATUS`, `NOT_SHIPPED`, `NO_VERSION`, `NO_ARCHIVE_DATE`, `ARCHIVE_CONFLICT`, `WRITE_FAILED`, `MOVE_FAILED`, `ROLLBACK_FAILED`, `COUNT_MISMATCH`, exit `2` y motor ausente (Degradación gradual, D-10) // AC-2, CNF-5
- [ ] T017 [P] Crear `skills/epic-complete/README.md` con el formato de `skills/story-complete/README.md`: qué hace, estados admitidos, qué produce (`epic.md` con `status`, `updated`, `completed`, `version`; directorio archivado), qué no hace (commit, historias hijas, `CANCELED/DONE` hasta STORY-172) (Componentes, CR-001) // CNF-6

## 5. Pruebas del motor

- [ ] T018 Crear `test/epic-complete.test.js` (`node:test`, `node:assert/strict`, repos temporales con `git init`; nunca el repo real) con los helpers de fixture de `test/story-complete.test.js` adaptados a `epic.md` y `CHANGELOG.md`, y los casos del contrato 1 (`SHIP/DONE` + `apply`: `status: COMPLETED`, `substatus: DONE`, `updated`/`completed` de hoy, `version`, ruta `specs/flow/archive/<hoy>-EPIC-NN-<slug>/`, ausente de `specs/flow/`) y del contrato 2 (`git status --porcelain` con rename `R`, sin commit nuevo) // AC-1, CNF-1
- [ ] T019 Añadir los casos del contrato 3 (versión): `--version v1.4.0` → `1.4.0` con `versionSource: argument`; bloque bajo `## [1.3.0] — fecha` → `1.3.0` con `changelog`; bloque bajo `## [Unreleased]`, sin bloque y sin `CHANGELOG.md` → `NO_VERSION` con su motivo y árbol intacto; `--version` distinta de `CHANGELOG.md` → aviso en `warnings` // AC-1
- [ ] T020 Añadir los casos de los contratos 4 y 5: `VALIDATE/DONE`, `DEVELOP/IN-PROGRESS` y `CANCELED/DONE` → `NOT_SHIPPED` con el mensaje de AC-2 y snapshot de archivos idéntico antes y después; `COMPLETED/DONE` → `archive-only` con fecha de `updated:`, de `created:` y de `date:` (solo sin las otras dos claves), `epic.md` byte a byte igual; sin fecha válida → `NO_ARCHIVE_DATE` // AC-2, CNF-2
- [ ] T021 Añadir los casos de los contratos 6–8: `NOT_FOUND` (con y sin pista de archivada), `AMBIGUOUS`, `INVALID_PATH`, `NO_EPIC_FILE`, `NO_STATUS`, `ARCHIVE_CONFLICT` sin cambios; movimiento forzado a fallar → `MOVE_FAILED` con `epic.md` restaurado; `epic.md` con CRLF conserva sus finales al escribir; CLI por `spawnSync`: exit `0`/`1`/`2` y un único JSON en stdout // AC-1, AC-2

## 6. Evals

- [ ] T022 Crear `skills/epic-complete/evals/evals.json` (versión `1.0.0`, formato de `skills/story-complete/evals/evals.json`, épica y `CHANGELOG.md` descritos inline en `input`, `SHIP/DONE` fijado a mano sin depender de `epic-ship`) con:
  - TC-001 (= SMOKE-8): `EPIC-31` en `SHIP/DONE`, bloque bajo `## [2.1.0]`, versionada en git, respuesta `s` → `contains` `¿Confirmas que la versión 2.1.0`, `specs/flow/archive/<hoy>-EPIC-31-`, `✅ EPIC-31 archivada en`, `COMPLETED/DONE`, `git-mv`, `commit`; `not_contains` `❌`, `Operación cancelada` // AC-1
  - TC-002: `VALIDATE/DONE` → `contains` `solo se completan épicas en SHIP/DONE, COMPLETED/DONE o CANCELED/DONE`; `not_contains` `¿Confirmas`, `archivada en` // AC-2
  - TC-003: `SHIP/DONE`, respuesta `n` → `contains` `Operación cancelada por el usuario: no hubo cambios.`; `not_contains` `archivada en`, `COMPLETED/DONE` // AC-3, CNF-3
  - TC-004: `SHIP/DONE` con el bloque en `## [Unreleased]` y sin `--version` → `contains` `[Unreleased]`, `--version`; `not_contains` `¿Confirmas` // AC-1

## 7. Integración y documentación

- [ ] T023 [P] Añadir la fila de `epic-complete` en `docs/domains/domain-skills-map.md › ## Épica (L2)`: momento `SHIP/DONE → COMPLETED`; lee `epic.md` y `CHANGELOG.md`; escribe `epic.md` (`status`, `updated`, `completed`, `version`) y mueve `<EPIC_DIR>/` a `specs/flow/archive/`; cambia estado `COMPLETED/DONE` con confirmación humana // CS-12, CS-19
- [ ] T024 [P] Añadir la fila de `epic-complete` (entrada `epic.md` en `SHIP/DONE`; salida `specs/flow/archive/<YYYY-MM-DD>-EPIC-NN-<slug>/epic.md` en `COMPLETED/DONE`) en la tabla de épica de `docs/guides/sddf-commands-pipeline.md` y una fila «Completar y archivar épica» en `README.md` junto a la de `/story-complete` // CS-12
- [ ] T025 [P] Añadir en `CHANGELOG.md › ## [Unreleased] › ### Added` la entrada del skill `epic-complete` (STORY-171) // CS-12

## 8. Verificación

- [ ] T026 Ejecutar `npm test` y confirmar que `test/epic-complete.test.js` y `test/story-complete.test.js` pasan (contratos 1–8) // AC-1, AC-2, CNF-1, CNF-2
- [ ] T027 Ejecutar `npm run verify:repository` y confirmar que `verify-fixed-layout.js` reconoce el marcador de `SKILL.md` y `verify-eval-inventory.js` acepta `evals/evals.json` (contrato 9) // CNF-4, CS-12, CS-21
- [ ] T028 Ejecutar `graphify update .` para mantener el grafo al día tras los archivos nuevos
- [ ] T029 Dejar registrado para revisión humana que `npm run test:eval -- epic-complete` (contratos 10–12) se ejecuta manualmente a criterio humano, según AGENTS.md; no ejecutarlo de forma automática // AC-1, AC-2, AC-3
