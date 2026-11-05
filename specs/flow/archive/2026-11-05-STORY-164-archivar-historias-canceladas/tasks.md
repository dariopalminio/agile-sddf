---
alwaysApply: false
type: tasks
id: STORY-164
slug: STORY-164-archivar-historias-canceladas-tasks
title: "Tasks: Skill story-complete: archivar historias canceladas"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-27-completar-flujo-de-story
story: STORY-164
design: STORY-164
created: 2026-10-25
updated: 2026-10-25
related:
  - STORY-164-archivar-historias-canceladas
  - STORY-164-archivar-historias-canceladas-design
---

<!-- Referencias -->
[[STORY-164-archivar-historias-canceladas]] · [[STORY-164-archivar-historias-canceladas-design]]

> Precondición de implementación (CR-001): `skills/story-complete/` existe porque STORY-160 ya se implementó. El grupo 2 (ADR) no depende de STORY-160 y puede hacerse antes (nota de la historia: «El ADR nuevo (AC-3) sí puede redactarse en paralelo»).

## 1. Precondición y pruebas primero (RED)

- [x] T001 Comprobar la precondición CR-001: existen `skills/story-complete/SKILL.md` y `evals/evals.json`; anotar el último `TC-NNN` de `evals.json`, el paso del SKILL.md donde viven la tabla de admisión por estado, la cadena de fecha, la confirmación, la comprobación de destino y el movimiento, y si existen `skills/story-complete/README.md` y la fila de `story-complete` en `docs/guides/sddf-commands-pipeline.md` (C-3, C-14). Hecho: se conoce el primer ID libre y el paso donde vive cada gate, para anclar los cambios a los gates y no a números de paso (Risks).
- [x] T002 [P] Añadir a `skills/story-complete/evals/evals.json`, con IDs consecutivos desde el primero libre, los cinco casos del esquema de datos de design.md con sus `expected.contains`/`not_contains`: cancelada con `updated:` (AC-1 fila 1), cancelada con `created:` (AC-1 fila 2), cancelada con `date:` (AC-1 fila 3), cancelada en curso `CANCELED/IN-PROGRESS` (AC-2 fila 1) y cancelada sin fecha (AC-2 fila 2) (C-2). Hecho: `node scripts/verify-eval-inventory.js` acepta todos los IDs y no hay duplicados.
- [x] T003 [P] Ajustar los casos existentes de STORY-160 en `evals.json`: el de `CANCELED/DONE` que espera el rechazo por ADR-0016 pasa a esperar la confirmación de D-4 (`¿Confirmas archivar`, `el status no cambia`) y añade `ADR-0016` a `expected.not_contains`; el de `COMPLETED/DONE` sin fecha válida añade `date:` a `expected.contains` (C-2, D-1, D-3, CR-001). Hecho: ningún caso espera ya el rechazo de `CANCELED/DONE`.
- [x] T004 [P] Añadir en `test/memory-system.test.js`, junto al fixture de `archive/2026-01-01-STORY-000-z/story.md` (línea 1331), un caso que siembre `archive/2026-01-01-STORY-001-cancelada/story.md` con `status: CANCELED` y `substatus: DONE` y compruebe que `index` lo lista bajo «Historias archivadas (archive/)» y que `check` no reporta errores (C-15, D-7, CNF-3). Hecho: `node --test test/memory-system.test.js` pasa con el caso nuevo.

## 2. ADR de la regla de archivo

- [x] T005 Crear `docs/adr/ADR-0017-layout-fijo-con-archivo-de-historias-canceladas.md` desde `docs/adr/adr-template.md`: `id: ADR-0017`, `slug: layout-fijo-con-archivo-de-historias-canceladas`, `status: ACCEPTED`, `date:` de hoy, `supersedes: ADR-0016`, `superseded-by: null`; Contexto (EPIC-27/STORY-164), Decisión con las tres raíces, layout no configurable, `docs/requirements/` y nombre de directorio de ADR-0016 sin cambios y la viñeta **Archivo** de D-2 (`COMPLETED` o `CANCELED` con `substatus: DONE`, status conservado, fecha `updated:` → `created:` → `date:` solo si faltan ambas claves, sin fecha no se archiva); árbol con `archive/` comentado como `stories COMPLETED o CANCELED`; Alternativas (tabla de D-2) y Consecuencias (referencias «(ADR-0016)» al layout siguen válidas) (C-4, AC-3). Hecho: el ADR enuncia la regla de AC-3 y no contiene `SPECS_BASE`, `SDDF_ROOT` ni la clave `root` como vigentes.
- [x] T006 Modificar `docs/adr/ADR-0016-layout-fijo-de-tres-raices.md` solo en los campos permitidos: `status: SUPERSEDED`, `superseded-by: ADR-0017` y bajo el título la nota de D-2 con enlace a ADR-0017 y la fecha (C-5, CNF-1). Depende de T005. Hecho: `git diff` del archivo muestra solo esas tres líneas cambiadas o añadidas.
- [x] T007 Actualizar `docs/adr/README.md`: fila ADR-0016 con estado `SUPERSEDED → [ADR-0017](ADR-0017-layout-fijo-con-archivo-de-historias-canceladas.md)` y fila nueva ADR-0017 (`ACCEPTED`, fecha de hoy) (C-6, AC-3). Depende de T005. Hecho: los dos enlaces resuelven.

## 3. Skill story-complete: admisión de canceladas (componente central)

- [x] T008 Actualizar `skills/story-complete/SKILL.md` en frontmatter (`description` y `triggers` con «archivar historia cancelada»), `## Precondiciones` (estados admitidos: `DELIVER/DONE`, `COMPLETED/DONE`, `CANCELED/DONE`) y `## Restricciones / Reglas` («una historia `CANCELED` se archiva sin escribir `story.md`: status, substatus y `updated:` no cambian»; regla de archivo según ADR-0017); conservar intacto el bloque `<!-- SDDF-FIXED-LAYOUT: v1 -->` (C-1, D-1, D-2). Hecho: `node scripts/verify-fixed-layout.js` sigue en verde y ninguna sección afirma que ADR-0016 impide archivar canceladas.
- [x] T009 Modificar el paso de admisión con la tabla de D-1: fila `CANCELED/DONE` → archivar sin escribir; fila `CANCELED/<substatus ≠ DONE>` → `❌ La historia STORY-NNN no puede archivarse: estado actual CANCELED/<substatus>. Solo se archivan las historias CANCELED con substatus DONE.` sin sugerir `/story-delivery`; eliminar la fila de rechazo de `CANCELED/DONE` por ADR-0016 (C-1, AC-1, AC-2 fila 1). Depende de T008. Hecho: la tabla de admisión es el único lugar del SKILL.md que decide por estado.
- [x] T010 Modificar el paso de fecha de archivo con la cadena de D-3 para todas las historias archivables: primer valor `YYYY-MM-DD` válido entre `updated:` y `created:`; `date:` solo si el frontmatter no tiene ninguna de esas dos claves; sin fecha → `❌ La historia STORY-NNN no tiene fecha de archivo válida (YYYY-MM-DD): se buscó updated:, created: y date:.` sin efectos; en `DELIVER/DONE` la fecha sigue siendo la de hoy (C-1, D-3, AC-1, AC-2 fila 2). Depende de T009. Hecho: las cuatro filas de la tabla de D-3 se deducen del texto del paso sin ambigüedad.
- [x] T011 Modificar los pasos de confirmación y escritura para `CANCELED/DONE` según D-4: comprobación de destino existente antes de preguntar (rechazo de STORY-160); pregunta `¿Confirmas archivar STORY-NNN (CANCELED/DONE, el status no cambia) en specs/flow/archive/<fecha>-STORY-NNN-<slug>/? (s/n)`; rechazo → mensaje sin cambios de STORY-160; confirmación → solo el movimiento de STORY-160, sin escribir `story.md` ni compensación; mensaje final `✅ STORY-NNN archivada como CANCELED (status sin cambios): specs/flow/archive/<fecha>-STORY-NNN-<slug>/`; reflejar los mensajes nuevos en `## Manejo de errores` y el caso `CANCELED` en `## Salida` (C-1, AC-1, CNF-4). Depende de T010. Hecho: el flujo F-1 de design.md se recorre en el SKILL.md sin ninguna escritura de frontmatter para `CANCELED`.
- [x] T012 [P] Actualizar `skills/story-complete/README.md` (si T001 confirmó que existe) con los estados admitidos, que las canceladas conservan su status y la cadena de fecha de D-3 (C-3). Hecho: el README no contradice el SKILL.md.

## 4. Documentación de la regla de archivo

- [x] T013 [P] `AGENTS.md`: en la regla «Layout fijo», cambiar la referencia a «(ADR-0017)» y sustituir la frase de archivo por la frase canónica de D-6 (C-7, AC-3). Hecho: `AGENTS.md` describe `COMPLETED` y `CANCELED` y la cadena `updated:`, `created:` o `date:`.
- [x] T014 [P] `docs/constitution.md`: línea 95 «archivada … al completarse o cancelarse»; línea 225 «historias COMPLETED o CANCELED archivadas» (C-8, AC-3). Hecho: ambas líneas mencionan `CANCELED`.
- [x] T015 [P] `docs/domains/domain-state-management.md` §4 invariante 6 (texto que deja STORY-160): añadir «`story-complete` archiva sin cambiar el status las historias `CANCELED/DONE`, siempre con confirmación humana» (C-9, CNF-2). Hecho: la invariante nombra `CANCELED/DONE` y la confirmación humana.
- [x] T016 [P] `docs/domains/domain-story-lifecycle.md`: §5 fila `CANCELED` con «`story-complete` la archiva sin cambiar el status, con confirmación humana»; §9 viñeta **Archivo** con la frase canónica de D-6 (C-10, CNF-2). Hecho: §5 y §9 describen el archivado de canceladas.
- [x] T017 [P] `docs/domains/domain-work-item-hierarchy.md:72` y `docs/domains/domain-knowledge-artifacts.md:244`: frase canónica de D-6; en `domain-work-item-hierarchy.md` el wikilink `[[layout-fijo-de-tres-raices]]` pasa a `[[layout-fijo-con-archivo-de-historias-canceladas]]` (C-11, AC-3). Depende de T005. Hecho: ninguno de los dos dice que solo se archivan las `COMPLETED`.
- [x] T018 [P] `docs/guides/root-folder-practices.md`: líneas 29 y 80 con «`COMPLETED` o `CANCELED`»; líneas 32-33 con la cadena de fecha de D-3 y «Las épicas no se archivan» (se elimina «Las historias `CANCELED` … no se archivan») (C-12, CR-002). Hecho: la guía no afirma que las canceladas quedan fuera del archivo.
- [x] T019 [P] `docs/architecture/sddf-architecture.md:141`: comentario `# <YYYY-MM-DD>-STORY-NNN-<slug>/ de las stories COMPLETED o CANCELED` (C-13, CR-002). Hecho: el árbol menciona ambos estados.
- [x] T020 [P] `docs/guides/sddf-commands-pipeline.md`: en la fila de `story-complete` que dejó STORY-160 (si T001 confirmó que existe), añadir `CANCELED/DONE` a los estados admitidos y que conserva el status (C-14, CR-002). Hecho: la fila coincide con la tabla de admisión de D-1.
- [x] T021 Regenerar `docs/index.md` con `/memory-system index` (nunca a mano) para incluir ADR-0017 (C-16, AC-3). Depende de T005 y T013–T020. Hecho: `docs/index.md` lista `[[layout-fijo-con-archivo-de-historias-canceladas]]` y `node scripts/check-doc-links.js` pasa.

## 5. Verificación

- [x] T022 Ejecutar `npm test` (incluye el caso de T004) (CNF-3, contrato 7). Hecho: todas las pruebas pasan.
- [x] T023 Ejecutar `npm run verify:repository` (CNF-3, contrato 8). Hecho: el gate completo termina en verde.
- [x] T024 Verificar la documentación y el ADR: `git diff docs/adr/ADR-0016-layout-fijo-de-tres-raices.md` solo muestra `status`, `superseded-by` y la nota (contrato 4, CNF-1); `grep -n "CANCELED" AGENTS.md docs/constitution.md docs/domains/domain-*.md docs/guides/root-folder-practices.md` muestra la regla nueva (contrato 5); `grep -rn "CANCELED.*no se archivan" AGENTS.md docs/` no devuelve resultados (contrato 6) (AC-3, CNF-2). Hecho: las tres comprobaciones cumplen.
- [x] T025 Prueba manual de AC-1 en un repositorio git temporal fuera del proyecto (en el scratchpad, con `skills/story-complete` instalado y `specs/flow/` y `specs/flow/archive/` creados): tres historias `CANCELED/DONE` versionadas con las fechas de las tres filas de AC-1; ejecutar `/story-complete` y confirmar cada una; comprobar el destino `specs/flow/archive/<fecha>-STORY-NNN-<slug>/`, que `git diff --cached --stat -M` solo muestra renombres (frontmatter idéntico), que el origen ya no existe y que el total `specs/flow/STORY-*/` + `specs/flow/archive/*-STORY-*/` no cambió (contratos 1 y 3, AC-1, CNF-4). Hecho: las tres filas cumplen.
- [x] T026 Prueba manual de AC-2 en el mismo repositorio temporal: una historia `CANCELED/IN-PROGRESS` y una `CANCELED/DONE` sin `updated:`, `created:` ni `date:` válidos; ejecutar `/story-complete` en cada una y comprobar el mensaje (estado actual; los tres campos buscados) y que `git status --porcelain` y el conteo son idénticos antes y después (contratos 2 y 3, AC-2, CNF-4). Hecho: ambas filas terminan sin efectos.
- [x] T027 (A criterio humano, por cuota) Ejecutar `npm run test:eval -- story-complete` y revisar los casos de T002 y T003 (contratos 1 y 2). Hecho: los casos nuevos y ajustados pasan, o la decisión de no ejecutarlos queda registrada en el reporte de implementación. — no ejecutado en esta sesión: `test:eval` queda a criterio humano (AGENTS.md); decisión registrada en implement-report.md.
- [x] T028 Ejecutar `graphify update .` para mantener el grafo de conocimiento al día (AGENTS.md › graphify). Hecho: el comando termina sin errores.
