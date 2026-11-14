---
alwaysApply: false
type: tasks
id: STORY-192
slug: STORY-192-epica-sin-ready-for-dev-tasks
title: "Tasks: Épica sin READY-FOR-DEV"
story: STORY-192
design: STORY-192
created: 2026-11-13
updated: 2026-11-13
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-029-eliminar-estados-buffer
related:
  - STORY-192-epica-sin-ready-for-dev
---

<!-- Referencias -->
[[STORY-192-epica-sin-ready-for-dev]]

> Orden obligatorio (CNF-3): los grupos 1 y 2 (evals y fixtures) se terminan antes de tocar cualquier `SKILL.md` o referencia de los grupos 3 a 5. Las decisiones D-1…D-7 están en `design.md`.

## 1. Evals de `epic-analyze` (primero, CNF-3)

- [ ] T001 Añadir a `skills/epic-analyze/evals/evals.json` el caso **TC-035** `epica-sin-buffers-madurez-y-aprobacion-manual` (AC-1, D-5). Usar el formato inline de TC-022/TC-024, con `mode: manual`. `EPIC-30-ejemplo` lista STORY-201 `SPECIFY/DONE` (cita el criterio de salida y SMOKE-1), STORY-202 `PLAN/DONE` y STORY-203 `IMPLEMENT/TODO`. `expected.contains` = `verdict: APPROVED`, `Madurez de historias hijas: 3/3`, `PLAN/DONE`, `Siguiente paso`. `not_contains` = `MAD-0`, `READY-FOR-DEV`, `epic.md ===`. Hecho: el JSON es válido y el caso sigue a TC-034.
- [ ] T002 Añadir **TC-036** `historia-legada-ready-for-implement-nota-sin-mad-03` (AC-2, fila 1; D-1, D-5). Historias: STORY-201 `SPECIFY/DONE`, con cobertura del criterio y de SMOKE-1, y STORY-202 `READY-FOR-IMPLEMENT/DONE`. `contains` = `verdict: APPROVED`, `warnings: 0`, `Madurez de historias hijas: 2/2`, `valor legado`, `STORY-202`. `not_contains` = `MAD-03`. Depende de T001.
- [ ] T003 Añadir **TC-037** `status-ready-for-verify-no-clasificable-mad-03` (AC-2, fila 2; D-5). Historias: STORY-201 `SPECIFY/DONE`, con cobertura, y STORY-202 `status: READY-FOR-VERIFY`. `contains` = `MAD-03`, `READY-FOR-VERIFY`, `Madurez de historias hijas: 1/2`. `not_contains` = `valor legado`. Subir `version` de 1.5.0 a 1.6.0. Depende de T002. Hecho: `node -e "require('./skills/epic-analyze/evals/evals.json')"` no falla y hay 37 casos.

## 2. Evals y fixtures de `epic-refine` (primero, CNF-3)

- [ ] T004 [P] Crear el fixture `skills/epic-refine/examples/cobertura-cierre-planificada/` como copia de `examples/cobertura-cierre/` (EPIC-30-ejemplo con `epic.md` y `epic-analyze-report.md`, STORY-301 y STORY-302). El único cambio es el frontmatter de `STORY-302-enviar-csv-por-correo/story.md`: `status: PLAN` y `substatus: DONE` (D-5). Hecho: `diff -r` contra `cobertura-cierre/` solo muestra esas dos líneas.
- [ ] T005 [P] Crear el fixture `skills/epic-refine/examples/cobertura-cierre-status-desconocido/` como copia de `cobertura-cierre/` con STORY-302 en `status: BACKLOG`, conservando su `substatus` (D-4, D-5). Hecho: `diff -r` solo muestra la línea `status`.
- [ ] T006 Añadir a `skills/epic-refine/evals/evals.json` el caso **TC-027** `historia-de-cierre-planificada-replanifica` (AC-3, fila `PLAN`). `input_path` = el `epic.md` del fixture de T004. Modo manual, con la respuesta `s` al plan en `input.context`, como TC-001. `contains` = `SAL-01 · CS-1 → STORY-302`, `Replanifica: /story-plan STORY-302`, `Siguiente paso: /epic-analyze EPIC-30`. `not_contains` = `READY-FOR-`. Depende de T004.
- [ ] T007 Añadir **TC-028** `historia-de-cierre-con-status-desconocido-al-po` (D-4). Usa el fixture de T005, en modo `--auto`. `contains` = `fuera del workflow de historia`, `BACKLOG`, `FUERA-DE-ALCANCE: 1`. `not_contains` = `STORY-302-enviar-csv-por-correo/story.md.bak`, `Replanifica`. Depende de T005 y T006.
- [ ] T008 Añadir `Replanifica:` a `expected.not_contains` de **TC-009** (AC-3, fila `SPECIFY`) y subir `version` de 1.5.0 a 1.6.0. Depende de T007. Hecho: el JSON es válido y hay 28 casos.

## 3. Skill `epic-analyze` (tras los grupos 1 y 2)

- [ ] T009 Comprobar si existe `docs/adr/ADR-0022-*.md` con `status: ACCEPTED` (D-6). Si existe, las tareas T011 y T012 citan `ADR-0022`. Si no, no citan ningún ADR y la cita pendiente se anota para `implement-report.md`. Hecho: decisión registrada en las notas de implementación.
- [ ] T010 En `skills/epic-analyze/SKILL.md`, reescribir la línea 5 (`description`), la 12 («Cuándo usar») y la 343 («Momento de uso») (D-3). Cambiar «aprobar … para `READY-FOR-DEV`» por «antes de que el PO apruebe la épica (`PLAN/DONE`, edición manual)». Mantener la `description` en una sola oración de uso y conservar los disparadores de la línea 6. Depende de T003 y T008.
- [ ] T011 Reescribir la línea 77 (D-3): «**Sin cambio de estado:** nunca se escriben `status` ni `substatus`: la aprobación de la épica (`PLAN/DONE`) es una edición manual del PO, y un análisis no debe tomar esa decisión por él», con la cita a ADR-0022 según T009. Depende de T009 y T010.
- [ ] T012 En el Paso 5c.1 (líneas 236–245), dejar el orden de estados con el literal `SPECIFY → PLAN → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE → DELIVER → COMPLETED`, más el terminal `CANCELED` (D-2). Insertar antes de la fila `no-clasificable` la fila del valor legado: `` `READY-FOR-IMPLEMENT` (valor legado, anterior a 6.0.0) | no se evalúa | `lista` + nota de valor legado `` (D-1). Debajo de la tabla, añadir el texto literal de la nota y la frase «la nota no es hallazgo MAD, no cuenta en el Paso 6 y la historia cuenta como `lista` en `Madurez de historias hijas`», con la cita según T009. La fila `no-clasificable` (línea 243) se conserva con `BACKLOG` y `READY-FOR-VERIFY` (CR-002). Depende de T011.
- [ ] T013 En el Paso 9, modo manual, añadir al final del bloque la línea `Siguiente paso:` según el veredicto (D-3). Con `APPROVED`: «el PO aprueba la épica editando a mano su estado a `PLAN/DONE` (este análisis no lo escribe)». Con `NEEDS-REFINEMENT`: «`/epic-refine <EPIC_ID>` y volver a ejecutar `/epic-analyze <EPIC_ID>`». Dejar sin cambios el bloque Agent de cuatro líneas. Depende de T012.
- [ ] T014 [P] En `skills/epic-analyze/README.md`, reescribir la línea 20 («la transición `PLAN → READY-FOR-DEV` la decide el PO» → «la aprobación de la épica (`PLAN/DONE`) la escribe a mano el PO») y la línea 30 («aprobarse hacia `READY-FOR-DEV`» → «que el PO la apruebe (`PLAN/DONE`)»). Depende de T003 y T008.

## 4. Skill `epic-refine` y catálogo SAL (tras los grupos 1 y 2)

- [ ] T015 En `skills/epic-refine/references/sal-corrections.md` §«Estados admitidos» (líneas 61–65), dejar `PLAN` solo en la segunda fila. Añadir la fila «Cualquier otro valor (fuera del workflow de historia)» → «Fuera de alcance (tabla anterior)» (D-4). Depende de T008.
- [ ] T016 En §3 de `sal-corrections.md`, añadir a la tabla de casos fuera de alcance la fila «La historia de cierre tiene un `status` fuera del workflow de historia», con la nota `` <STORY-NNN> con status `<valor>` fuera del workflow de historia: normaliza su status antes de asignarle cobertura `` (D-4). Depende de T015.
- [ ] T017 En §6 de `sal-corrections.md` (línea 127) y en `skills/epic-refine/SKILL.md:227`, cambiar «en `PLAN` o `READY-FOR-IMPLEMENT`» por «en `PLAN`» (AC-3). Depende de T016.

## 5. Skill `epic-generate-all-stories` (tras los grupos 1 y 2)

- [ ] T018 [P] En `skills/epic-generate-all-stories/SKILL.md:227`, cambiar «No usar `READY-FOR-IMPLEMENT`: saltaría…» por «No usar un estado posterior (`PLAN` o siguientes): saltaría los gates SPECIFY y PLAN que la máquina de estados declara secuenciales» (D-7). Depende de T008.

## 6. Verificación

- [ ] T019 V-3/V-4 (CNF-1): `grep -nE "READY-FOR-(IMPLEMENT|DEV)" skills/epic-analyze/SKILL.md skills/epic-analyze/README.md` solo devuelve la fila y la nota del valor legado. `grep -rnE "READY-FOR-(IMPLEMENT|DEV)" skills/epic-refine skills/epic-generate-all-stories` no devuelve nada. Depende de T012–T018.
- [ ] T020 V-5 (CNF-2): `grep -rn "PLAN/DONE" skills/epic-analyze skills/epic-refine skills/epic-generate-all-stories`. Hay que leer cada aparición y confirmar que ninguna indica a un skill que escriba el estado de `epic.md`. Depende de T019.
- [ ] T021 V-6 (AC-1, riesgo de STORY-187): si `docs/domains/domain-story-lifecycle.md` §4.1 ya no tiene `READY-FOR-IMPLEMENT`, confirmar que su literal coincide con el orden de la línea 236 de `epic-analyze`. Si STORY-187 no se ha entregado, anotarlo en `implement-report.md`. Depende de T012.
- [ ] T022 Verificar por bytes que los archivos editados no tienen BOM ni U+FEFF literal: los tres `SKILL.md`, el `README.md`, `sal-corrections.md` y los dos `evals.json`. Depende de T019.
- [ ] T023 V-7 (CNF-4): ejecutar `npm run verify:repository` y `npm test`. Los dos deben pasar. Depende de T022.
- [ ] T024 V-8: dejar anotado para el humano `npm run test:eval -- epic-analyze` y `npm run test:eval -- epic-refine`, que cubren TC-035…TC-037, TC-009, TC-027 y TC-028. No se ejecutan automáticamente (AGENTS.md). Depende de T023.
