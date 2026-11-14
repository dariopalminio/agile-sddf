---
alwaysApply: false
type: tasks
id: STORY-187
slug: STORY-187-dominio-y-requisitos-sin-buffers-tasks
title: "Tasks: Dominio, requisitos y máquina de estados sin buffers"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-029-eliminar-estados-buffer
story: STORY-187
design: STORY-187
created: 2026-11-13
updated: 2026-11-13
related:
  - STORY-187-dominio-y-requisitos-sin-buffers
  - STORY-187-dominio-y-requisitos-sin-buffers-design
---

<!-- Referencias -->
[[STORY-187-dominio-y-requisitos-sin-buffers]] · [[STORY-187-dominio-y-requisitos-sin-buffers-design]]

> Alcance: se editan solo los 10 documentos C-1 a C-10 de design.md (`docs/domains/domain-state-management.md`, `domain-story-lifecycle.md`, `domain-epic-lifecycle.md`, `domain.md`, `domain-skills-map.md`, `docs/architecture/state-machine.md`, NFR-006 y FR-043/044/045). No se tocan skills, evals, plantillas, scripts, tests, guías, `README.md`, ADRs, `CHANGELOG.md`, `docs/product/` ni `docs/requirements/index.md` (design.md, Non-Goals). La historia es documental (`kind: chore`): no hay prueba automática nueva. La verificación son los contratos V-1 a V-15 de design.md más el gate. En toda cita al ADR se usa `[[workflows-sin-estados-buffer]]` con «ADR-0022» en el texto (D-01).

## 1. Precondición

- [ ] T001 Comprobar el estado de partida (F-1, V-1): `docs/adr/ADR-0022-workflows-sin-estados-buffer.md` existe con `status: ACCEPTED` (si no existe, **detener**: STORY-186 no está implementada y los wikilinks romperían `check-doc-links`, CR-002); el `grep -c "READY-FOR-IMPLEMENT\|READY-FOR-DEV"` de los 10 documentos coincide con la tabla de Context de design.md; `grep -n "WIP\|READY-FOR" docs/constitution.md` solo devuelve §9 (V-13); y `npm run verify:repository` y `npm test` pasan antes del cambio (línea base). Hecho: ADR-0022 existe y las diferencias, si las hay, están anotadas para `implement-report.md`.

## 2. Modelo transversal (`domain-state-management.md`, C-3)

- [ ] T002 Reescribir el glosario de §2 (D-05, D-09): `WIP Limit` → límite de work items con `substatus: IN-PROGRESS` por nivel (constitución §9), sin colas; eliminar el término `Buffer`; `Rework` → retorno a la etapa de ejecución tras un rechazo, en Story `IMPLEMENT/TODO`. Depende de T001. Hecho: `grep -in "buffer"` no devuelve líneas del glosario.
- [ ] T003 Reescribir el modelo táctico de §3 (D-05): VO `WipLimit` → «Se define por nivel de work item y aplica solo a `IN-PROGRESS`»; en el agregado, `WipLimit (VO) — aplicable solo a substatus: IN-PROGRESS`. Depende de T002. Hecho: ninguna fila ni viñeta de §3 nombra un estado buffer.
- [ ] T004 Reescribir las invariantes de §4 (D-05, D-06): la invariante 2 añade que `TODO` significa «pendiente de iniciar» en cualquier estado activo; la invariante 5 → el WIP limit de cada nivel limita solo `IN-PROGRESS` (constitución §9) y ninguna cola tiene WIP. Depende de T003. Hecho: las invariantes 2 y 5 tienen el texto de D-05/D-06.
- [ ] T005 Eliminar la fila `BUFFER` de «Fases compartidas entre niveles» y añadir al párrafo siguiente «No hay fase de cola: la cola de listos es una consulta (§5.5)» (D-06). Depende de T004. Hecho: la tabla tiene 6 filas.
- [ ] T006 Reescribir §5.3 (D-08, D-09): la historia vuelve a `IMPLEMENT/TODO` desde los tres gates; la épica, a `DEVELOP` con un veredicto distinto de `APPROVED` de `epic-validate`; «No existe estado ni substatus de rework»; el gate escribe `fix-directives.md` con `based-on` igual a su reporte; los reportes se nombran `code-review-report.md`, `verify-report.md` y `acceptance-report.md`; la cita a ADR-0008 se sustituye por `[[workflows-sin-estados-buffer]]`. Depende de T005. Hecho: V-5 se cumple en C-3.
- [ ] T007 Crear `### 5.5 Flujo de la cola de listos (consulta, no estado)` al final de §5 (D-06): la consulta «primero `IMPLEMENT/TODO`, después `PLAN/DONE`», la frase «es una consulta, no un estado, un gate ni un límite WIP», `TODO` como «pendiente de iniciar» en cualquier estado activo y la cita al ADR. Depende de T006. Hecho: V-10 se cumple.
- [ ] T008 Reescribir el gate de capacidad de §6 (D-05): «Control del número máximo de work items en `IN-PROGRESS` por nivel» con ejemplo «constitución §9»; actualizar en §8 la línea «Decisión de arquitectura» a ADR-0022 como fuente de los workflows y las transiciones, conservando ADR-0003 solo para los nombres en infinitivo (D-02), y añadir `[[workflows-sin-estados-buffer]]` a §9 «Referencias Cruzadas». Depende de T007. Hecho: `grep -c "READY-FOR-IMPLEMENT\|READY-FOR-DEV"` = 0 y `grep -in "buffer"` = 0 en C-3 (V-2, V-11).

## 3. Ciclos de vida de nivel (C-1 y C-2)

- [ ] T009 [P] Reescribir `domain-story-lifecycle.md` §2 y §3 (D-05, D-09): «Pipeline Story» con el literal del ADR; eliminar «Buffer (READY-FOR-IMPLEMENT)»; «Rework» → retorno a `IMPLEMENT/TODO` desde los tres gates, señal `fix-directives.md`, sin estado ni substatus de rework, citando el ADR en lugar de ADR-0008; VO `WipLimit` → aplicable solo a `substatus: IN-PROGRESS` (constitución §9). Depende de T008. Hecho: §2 y §3 sin buffers.
- [ ] T010 Reescribir `domain-story-lifecycle.md` §4 (D-03, D-09): §4.1 con el literal del workflow de historia y la cita al ADR; diagrama §4.2 sin `RFI` (`PLAN --> IMPLEMENT : APPROVED (PLAN/DONE)` y las tres transiciones `NEEDS-CHANGES (IMPLEMENT/TODO)` hacia `IMPLEMENT`, conservando `CR --> IMPLEMENT : BLOCKED (repetir revisión)`); §4.3 con el happy path literal y las tres filas de rework → `IMPLEMENT/TODO`. Depende de T009. Hecho: `grep -c "RFI"` = 0 en C-1 (V-12).
- [ ] T011 Reescribir `domain-story-lifecycle.md` §5 a §8 (D-04, D-05, D-06, D-09): eliminar la fila `READY-FOR-IMPLEMENT` de §5; `PLAN` añade «Termina en `PLAN/DONE` cuando `story-analyze` emite `APPROVED`» e `IMPLEMENT` añade «`IMPLEMENT/TODO` indica un rework pendiente si existe `fix-directives.md`»; §6 con las filas `TODO` (cualquier estado activo), `IN-PROGRESS`, `DONE` (todos los estados activos, `PLAN/DONE` = planificación aprobada) y `BLOCKED`; invariante 6 → retrocesos a `IMPLEMENT/TODO`, sin estado ni substatus de rework, señal `fix-directives.md`, con cita; invariante 7 → la consulta «primero `IMPLEMENT/TODO`, después `PLAN/DONE`», sin WIP; eliminar la fila «WIP Limit» de §8; §10 y §11 citan ADR-0022 según D-02. Depende de T010. Hecho: `grep -c "READY-FOR-IMPLEMENT\|READY-FOR-DEV"` = 0 y `grep -in "buffer"` = 0 en C-1.
- [ ] T012 [P] Reescribir `domain-epic-lifecycle.md` §2 a §4 (D-03, D-05): «Pipeline Epic» con el literal del ADR; eliminar «Buffer (READY-FOR-DEV)»; VO `WipLimit` → aplicable solo a `substatus: IN-PROGRESS`; §4.1 literal con la cita; diagrama §4.2 sin `RFD` y con `PLAN --> DEVELOP : aprobación del PO (PLAN/DONE)`; §4.3 con el happy path literal. Depende de T008. Hecho: `grep -c "RFD"` = 0 en C-2.
- [ ] T013 Reescribir `domain-epic-lifecycle.md` §5 a §8, §10 y §11 (D-04, D-05, D-10): eliminar la fila `READY-FOR-DEV` de §5; `PLAN` añade «Termina en `PLAN/DONE` con la aprobación del PO, escrita a mano: ningún skill la escribe»; §6 fila `TODO` → cualquier estado activo, «pendiente de iniciar», y la fila `DONE` añade que `PLAN/DONE` es la aprobación del PO; invariante 2 → «no puede llegar a `PLAN/DONE`»; eliminar la invariante 7 (WIP de cola) y renumerar las siguientes; gate de integridad → «`PLAN`, antes de la aprobación del PO (`PLAN/DONE`) (informativo)», sin cambiar «Qué valida»; eliminar la fila «WIP Limit» de §8; §10 y §11 citan ADR-0022 según D-02. No tocar §9 (contrato F1/F2/F3). Depende de T012. Hecho: `grep -c "READY-FOR-IMPLEMENT\|READY-FOR-DEV"` = 0 y `grep -in "buffer"` = 0 en C-2; `git diff` no muestra cambios en §9.

## 4. Máquina de estados (`state-machine.md`, C-4)

- [ ] T014 Reescribir el nivel STORY (D-03, D-04): diagrama sin `RFI` ni `RFI --> CANCELED`, con las transiciones de D-03; happy path literal con la cita al ADR; eliminar la fila `READY-FOR-IMPLEMENT` de la tabla de estados y aplicar las descripciones de `PLAN` e `IMPLEMENT` de D-04; tabla de transiciones: `story-analyze` → `PLAN/DONE` (`verdict: APPROVED`), `story-implement` con precondición `PLAN/DONE`, `IMPLEMENT/TODO` o `IMPLEMENT/IN-PROGRESS` (reanudación), y el retroceso de `story-code-review`, `story-verify` y `story-acceptance` → `IMPLEMENT/TODO` (`NEEDS-CHANGES`), conservando sus retrocesos `BLOCKED`. Depende de T011. Hecho: V-6 se cumple.
- [ ] T015 Reescribir el nivel ÉPICA y «Fuentes de verdad» (D-02, D-03, D-04, D-10): diagrama sin `RFD` (`PLAN --> DEVELOP`); happy path literal con la cita; eliminar la fila `READY-FOR-DEV`; tras la tabla, la frase «La aprobación del PO es `PLAN/DONE` y se escribe a mano: ningún skill la escribe ([[workflows-sin-estados-buffer]])»; la línea «Decisión de arquitectura» de «Fuentes de verdad» cita ADR-0022 y conserva ADR-0003 para los nombres; actualizar `updated:`. No tocar la línea del gateway de `epic-validate`. Depende de T014. Hecho: `grep -c "READY-FOR-IMPLEMENT\|READY-FOR-DEV\|RFI\|RFD"` = 0 en C-4 y `node --test test/epic-validate-gateway.test.js` pasa.

## 5. Dominio raíz y mapa de skills (C-5 y C-6)

- [ ] T016 [P] Reescribir `docs/domains/domain.md` (D-05, D-09, D-11): glosario `WIP` → límite de work items en `IN-PROGRESS` por nivel, sin WIP de cola; «State Models» con los dos literales del ADR y su cita; «Flow Catalog» paso 4 → `IMPLEMENT/TODO` con `fix-directives.md` escrito por el gate que rechazó; BR-004 según D-05; segunda línea de la pregunta cerrada → «ADR-0022 retira los buffers: no hay WIP de cola. — <fecha>»; fila nueva en `## Changelog`; actualizar `updated:`. Depende de T008. Hecho: `grep -c "READY-FOR-IMPLEMENT\|READY-FOR-DEV"` = 0 en C-5 y `grep -in "buffer"` solo devuelve la pregunta cerrada y la fila del changelog (V-11).
- [ ] T017 [P] Reescribir `docs/domains/domain-skills-map.md` (D-07): fila `epic-analyze` → «antes de la aprobación del PO (`PLAN/DONE`, escrita a mano)»; crear `## Historia (L1)` tras `## Épica (L2)` con una línea que cita el ADR y la tabla de cuatro filas (`story-analyze`, `story-code-review`, `story-verify`, `story-acceptance`) de D-07; antes de escribir la columna «Lee», contrastarla con `## Entrada` de cada `SKILL.md`; actualizar `updated:`. Depende de T008. Hecho: V-9 se cumple y `grep -c "READY-FOR"` = 0 en C-6.

## 6. Requisitos (C-7 a C-10)

- [ ] T018 [P] Reescribir `## Descripción` de NFR-006 (D-08): los dos workflows literales del ADR y la frase «`status` expresa solo la etapa y `substatus` el progreso: no existen estados buffer ni de cola ([[workflows-sin-estados-buffer]])»; `## Criterios de verificación` y `## Atributos` sin cambios; actualizar `updated:`. Depende de T001. Hecho: V-8 se cumple y `grep -c "READY-FOR"` = 0 en C-7.
- [ ] T019 [P] Reescribir `## Descripción` de FR-043 (D-08): «devolviendo entonces la historia a `IMPLEMENT/TODO` (ADR-0022, [[workflows-sin-estados-buffer]])»; actualizar `updated:`. Depende de T001. Hecho: `grep -c "READY-FOR"` = 0 en C-8 y el párrafo nombra `fix-directives.md` e `IMPLEMENT/TODO`.
- [ ] T020 [P] Reescribir `## Descripción` de FR-044 (D-08): con `NEEDS-CHANGES` SHALL escribir `fix-directives.md` con `based-on: verify-report.md` y un `round` que continúa las rondas de rework, y devolver la historia a `IMPLEMENT/TODO`, con la cita; actualizar `updated:`. Depende de T001. Hecho: `grep -c "READY-FOR"` = 0 en C-9 y aparecen `based-on: verify-report.md` e `IMPLEMENT/TODO`.
- [ ] T021 [P] Reescribir `## Descripción` de FR-045 (D-08): con al menos un criterio rechazado SHALL escribir `fix-directives.md` con `based-on: acceptance-report.md` y un `round` que continúa las rondas de rework, y devolver la historia a `IMPLEMENT/TODO`, con la cita; la rama `ACCEPTANCE/BLOCKED` sin cambios; actualizar `updated:`. Depende de T001. Hecho: `grep -c "READY-FOR"` = 0 en C-10 y aparecen `based-on: acceptance-report.md` e `IMPLEMENT/TODO`.

## 7. Verificación

- [ ] T022 Ejecutar los contratos de búsqueda sobre los 10 documentos: V-2 (`grep -c "READY-FOR-IMPLEMENT\|READY-FOR-DEV"` = 0 en cada uno, evidencia principal de CNF-3), V-3 (los dos workflows literales con `grep -F` en `domain.md`, C-1, C-2 y C-4), V-4 (`grep -c "workflows-sin-estados-buffer"` ≥ 1 en cada uno), V-11 y V-12 (`buffer`, `RFI`, `RFD`). Depende de T008, T011, T013, T015, T016, T017, T018, T019, T020, T021. Hecho: todos los conteos esperados, anotados en `implement-report.md`.
- [ ] T023 Leer AC-1, AC-2 (cinco filas de ejemplos) y AC-3 contra los documentos editados (V-5 a V-10) y comprobar CNF-1: ninguna frase añade una decisión que no esté en ADR-0022 (la cita y el contenido de cada transición coinciden con el ADR). Depende de T022. Hecho: cada fila de AC-2 y cada «Entonces» de AC-1 y AC-3 tiene la línea del documento que lo satisface anotada en `implement-report.md`.
- [ ] T024 Comprobar los bytes de los 10 archivos editados: sin BOM al inicio y sin U+FEFF en el cuerpo (V-14), y que solo cambiaron esos 10 archivos más los artefactos de la historia (`git status`). Depende de T022. Hecho: ningún archivo tiene BOM ni U+FEFF y no hay cambios fuera del alcance.
- [ ] T025 Ejecutar `npm run verify:repository` y `npm test` (V-15, CNF-4), con atención a `check-doc-links` (wikilinks al ADR), `verify-fixed-layout` (`domain.md`) y `test/epic-validate-gateway.test.js` (`state-machine.md`). Depende de T023, T024. Hecho: ambos comandos terminan con salida 0.
