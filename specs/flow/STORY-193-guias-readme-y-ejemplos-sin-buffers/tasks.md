---
alwaysApply: false
type: tasks
id: STORY-193
slug: STORY-193-guias-readme-y-ejemplos-sin-buffers-tasks
title: "Tasks: Guías, README y ejemplos sin buffers"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-029-eliminar-estados-buffer
story: STORY-193
design: STORY-193
created: 2026-11-14
updated: 2026-11-14
related:
  - STORY-193-guias-readme-y-ejemplos-sin-buffers
  - STORY-193-guias-readme-y-ejemplos-sin-buffers-design
---

<!-- Referencias -->
[[STORY-193-guias-readme-y-ejemplos-sin-buffers]] · [[STORY-193-guias-readme-y-ejemplos-sin-buffers-design]]

> **Alcance:** solo se editan los 25 archivos de C-1 a C-12 de design.md, más las menciones residuales que D-11 asigna a esta historia.
>
> **No se tocan:**
> - `CHANGELOG.md`, ADR-0003, ADR-0006, ADR-0008, `docs/product/roadmap.md` y `specs/flow/archive/` (CNF-1).
> - Los documentos de dominio, `state-machine.md` y los requisitos (STORY-187).
> - Los artefactos de los skills que cambian de comportamiento (STORY-188 a STORY-192).
> - Los destinos de runtime.
>
> La historia es documental (`kind: chore`) y no lleva pruebas automáticas nuevas. Se verifica con los contratos V-1 a V-14 de design.md y el gate.
>
> **Citas al ADR:**
> - En `docs/`: `[[workflows-sin-estados-buffer]]` con «ADR-0022» en el texto.
> - En `README.md`: enlace Markdown relativo (D-01).

## 1. Precondición

- [ ] T001 Comprobar el estado de partida (CR-001, Riesgo 1):
  - `docs/adr/ADR-0022-workflows-sin-estados-buffer.md` existe con `status: ACCEPTED`. Si no existe, **detener**: los wikilinks romperían `check-doc-links`.
  - STORY-186 a STORY-192 están en `COMPLETED` (o en `specs/flow/archive/`).
  - El `grep -nE "READY-FOR-(IMPLEMENT|DEV)"` de los 25 archivos coincide con el inventario de Context de design.md.
  - `npm run verify:repository` y `npm test` pasan antes del cambio (línea base).

  Hecho: precondiciones confirmadas y diferencias anotadas para `implement-report.md`.

## 2. Guías de `docs/guides/` (C-1 a C-4)

- [ ] T002 [P] Editar `docs/guides/process-for-story-implement.md` (C-1, D-02):
  - **L22:** workflow sin buffer.
  - **Paso 2, «Estado al terminar»:** `PLAN/DONE` con `APPROVED`.
  - **Paso 3, «Acción»:** añadir la entrada desde `PLAN/DONE` o `IMPLEMENT/TODO` con `fix-directives.md`, y la cola de listos como consulta (primero `IMPLEMENT/TODO`, después `PLAN/DONE`) con la cita a ADR-0022.
  - **Pasos 4, 5 y 6, `NEEDS-CHANGES`:** `IMPLEMENT/TODO` + `fix-directives.md` con `based-on: code-review-report.md`, `verify-report.md` o `acceptance-report.md`, según el gate.

  Depende de T001. Hecho: V-3 (`grep -c "IMPLEMENT/TODO"` ≥ 3) y 0 líneas con `READY-FOR`.
- [ ] T003 [P] Editar `docs/guides/sddf-commands-pipeline.md` (C-2, D-03):
  - **L196:** la aprobación de la épica es `PLAN/DONE`, escrita a mano por el PO.
  - **Título de §4:** «Pipeline de implementación y ciclo de corrección».
  - **Diagrama de §4:** primera línea `story-analyze → APPROVED → PLAN/DONE → story-implement | story-implement-tasks`, y ramas `NEEDS-CHANGES → IMPLEMENT/TODO` de verify y de acceptance.
  - **Tabla:**
    - Precondición del ejecutor: `PLAN/DONE` o `IMPLEMENT/TODO`.
    - Resultado de `story-code-review → NEEDS-CHANGES`: `IMPLEMENT/TODO`.
    - Dos filas nuevas: `story-verify → NEEDS-CHANGES` y `story-acceptance → NEEDS-CHANGES`, cada una con `based-on` igual a su reporte y `round: N`.
  - **Nota L263:** tres escritores, `round` continuo, solo `story-code-review` borra el archivo, y ADR-0022 reemplaza a ADR-0008.

  Depende de T001. Hecho: V-4 y 0 líneas con `READY-FOR`.
- [ ] T004 [P] Editar `docs/guides/process-for-epic-development.md` (C-3, D-04):
  - **L23:** `DEFINE → PLAN → DEVELOP → VALIDATE → SHIP → COMPLETED`.
  - **L38:** «Con `APPROVED`, el PO aprueba la épica escribiendo `PLAN/DONE` a mano».

  Depende de T001. Hecho: V-5 y 0 líneas con `READY-FOR`.
- [ ] T005 [P] Editar `docs/guides/specs-and-workflows.md` (C-4, D-04):
  - **Historia:**
    - Happy path (L50) sin buffer.
    - Rejected path (L55) desde `PLAN`, con la flecha de retorno rotulada `NEEDS-CHANGES → IMPLEMENT/TODO`.
    - Eliminar la viñeta `READY-FOR-IMPLEMENT` (L63).
    - La viñeta `PLAN` con `PLAN/DONE` = lista para implementar y la cola de listos como consulta, más la cita a ADR-0022.
  - **Épica:**
    - L78 sin `READY-FOR-DEV`.
    - Eliminar la viñeta de L83.
    - La viñeta `PLAN` con «La aprobación del PO se escribe a mano como `PLAN/DONE`».

  Depende de T001. Hecho: 0 líneas con `READY-FOR` y los bloques de texto siguen alineados.

## 3. Arquitectura y README (C-5 a C-9)

- [ ] T006 [P] Editar `docs/architecture/sdcl-sddf.md` L25 (C-5, D-05) con el texto de D-05: sin estado de cola entre diseño y codificación, `PLAN/DONE` = lista para implementar, cola de listos como consulta y cita a ADR-0022. Se conserva la frase sobre `CANCELED`. Depende de T001. Hecho: 0 líneas con `READY-FOR`.
- [ ] T007 [P] Editar `docs/architecture/diagrams/flowchart-skill-story-flow-relationships.mermaid` (C-6, D-05):
  - Comentario L22: `%% FASE: PLAN (termina en PLAN/DONE)`.
  - `dec_plan -->|"APPROVED → PLAN/DONE"| story-implement`.
  - `dec_plan -->|NEEDS-CHANGES| story-fix-plan`.
  - Las aristas de `dec_impl`, `dec_verify` y `dec_acceptance` hacia `story-implement` con la etiqueta `"NEEDS-CHANGES → IMPLEMENT/TODO"`, entre comillas dobles.
  - No mover nodos ni subgrafos.

  Depende de T001. Hecho: V-6 (`IMPLEMENT/TODO` = 3; `NEEDS-REFINEMENT` solo en la arista `dec_specify` de `story-evaluation`) y V-7 (vista previa Mermaid sin error).
- [ ] T008 [P] Editar `README.md` L212 (C-7, D-06):
  - Workflow `SPECIFY → PLAN → IMPLEMENT → … → COMPLETED` con enlace `[ADR-0022](docs/adr/ADR-0022-workflows-sin-estados-buffer.md)`.
  - Frase sobre `PLAN/DONE` y el rework a `IMPLEMENT/TODO` con `fix-directives.md` desde los tres gates.
  - El resto del párrafo no cambia.

  Depende de T001. Hecho: V-8.
- [ ] T009 [P] Editar `docs/product/objectives.md`, OBJ-10 (C-8, D-07):
  - **Descripción (L108):** «colas como consulta y WIP limitado sobre `IN-PROGRESS`».
  - **Indicador (L112):** la redacción propuesta de D-07.
  - Anotar en `implement-report.md` el texto aplicado y que **necesita confirmación del PO en `/story-acceptance` (AC-4)**.

  Depende de T001. Hecho: L108 y L112 sin «buffer» ni `READY-FOR`, y la nota de confirmación pendiente registrada.
- [ ] T010 [P] Editar `skills/story-specify/README.md` L17 (C-9, D-10): `/story-plan [story.md: PLAN/IN-PROGRESS → PLAN/DONE]`. Depende de T001. Hecho: 0 líneas con `READY-FOR` ni `PLANNING/`.

## 4. Fixtures, ejemplos y eval (C-10 a C-12)

- [ ] T011 [P] Cambiar `status: READY-FOR-IMPLEMENT` → `status: PLAN` en los 11 `story.md` de `skills/memory-system/examples/` (C-10, D-08):
  - `broken`, `sane` y `sddf` (`STORY-001-a`).
  - `requirements-fragmented`, `requirements-mixed` y `srs-single` (`STORY-001-prueba` y `STORY-002-prueba`).
  - `requirements-legacy` (`STORY-001-prueba`).
  - `specs-3-levels/docs/specs/03-stories/STORY-001-a`.

  No añadir ni quitar `substatus` (`sddf` conserva `DONE`). No mover el fixture `specs-3-levels`.

  Depende de T001. Hecho: V-9 y 0 líneas con `READY-FOR` bajo `skills/memory-system/examples/`.
- [ ] T012 [P] Cambiar `status: READY-FOR-IMPLEMENT` / `substatus: TODO` → `status: PLAN` / `substatus: IN-PROGRESS` en `skills/story-design/examples/input/story.md` y `skills/story-tasking/examples/input/story.md` (C-11, D-09). Depende de T001. Hecho: V-9.
- [ ] T013 [P] Cambiar `status: READY-FOR-IMPLEMENT` → `status: PLAN` en `skills/story-fix-plan/examples/example-coherente/design.md` y `tasks.md`, conservando `substatus: DONE` (C-12, D-09). Depende de T001. Hecho: V-9.
- [ ] T014 [P] En `skills/story-fix-plan/evals/evals.json`, TC-007, reemplazar `"READY-FOR-IMPLEMENT"` por `"substatus: DONE"` en `expected.not_contains` (C-12, D-09). No tocar `contains` ni el resto del caso, y mantener JSON válido y el formato del archivo. Depende de T001. Hecho: V-10 y `node -e "JSON.parse(require('fs').readFileSync('skills/story-fix-plan/evals/evals.json','utf8'))"` sin error.

## 5. Verificación

- [ ] T015 Ejecutar el `grep` de AC-1, `grep -rnE "READY-FOR-(IMPLEMENT|DEV)" skills docs README.md`, y clasificar cada línea según el Flujo 2 y D-11 (V-1, V-2):
  - Las permitidas se aceptan: ADR-0003/0006/0008, ADR-0022, `roadmap.md`, el valor legado en los gates de entrada de los ejecutores, `epic-analyze`, `skill-preflight` y sus evals.
  - Una residual sin historia propietaria se corrige aquí, con el criterio de D-02 a D-10, y se registra en `implement-report.md`.
  - Una residual de otra historia no se edita y se informa como hallazgo bloqueante de AC-1.

  Depende de T002 a T014. Hecho: el `grep` solo devuelve menciones permitidas, o los hallazgos quedan registrados con su historia propietaria.
- [ ] T016 Verificar los registros históricos y la codificación (V-13, V-14):
  - `git diff --stat` no incluye `CHANGELOG.md`, `docs/adr/ADR-000{3,6,8}*`, `docs/product/roadmap.md` ni `specs/flow/archive/`.
  - Ningún archivo editado empieza por los bytes `EF BB BF` ni contiene U+FEFF literal (verificar por bytes, no con el gate).

  Depende de T015. Hecho: ambas comprobaciones limpias.
- [ ] T017 Ejecutar el gate (V-11, AC-3, CNF-3): `npm test` y `npm run verify:repository`, con exit 0 y sin errores nuevos respecto de la línea base de T001. La regresión `npm run test:eval -- story-fix-plan` (TC-007) queda a criterio humano (AGENTS.md) y se anota en `implement-report.md` como «no ejecutada» si no se corre. Depende de T016. Hecho: los dos comandos en verde y el resultado registrado en `implement-report.md`.
- [ ] T018 Recorrer AC-2 fila por fila sobre los cinco artefactos (V-3 a V-8) y confirmar que cada uno muestra el flujo de la tabla:
  - `PLAN/DONE` como entrada y `IMPLEMENT/TODO` como destino del rework.
  - `story-analyze → PLAN/DONE → story-implement` sin estado intermedio.
  - La aprobación del PO como `PLAN/DONE`.
  - Los tres gates hacia `IMPLEMENT/TODO`.
  - El workflow del ADR en `README.md`.

  Depende de T017. Hecho: las cinco filas confirmadas en `implement-report.md`, más la nota de confirmación del PO pendiente para AC-4 (T009).
