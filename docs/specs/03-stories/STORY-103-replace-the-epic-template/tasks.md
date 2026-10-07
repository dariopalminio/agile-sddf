---
type: tasks
id: STORY-103
slug: STORY-103-replace-the-epic-template-tasks
title: "Tasks: Reemplazar el template de Epic por la versión minimalista y output-oriented"
status: PLAN
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
story: STORY-103
design: STORY-103
created: 2026-10-06
updated: 2026-10-06
related:
  - STORY-103-replace-the-epic-template
  - STORY-103-replace-the-epic-template-design
---

<!-- Referencias -->
[[STORY-103-replace-the-epic-template]] · [[STORY-103-replace-the-epic-template-design]]

> Prerrequisito de ejecución: resolver CR-001 de `design.md` (`parent` de `story.md` →
> `EPIC-21-colapsar-specs-dos-niveles`) antes de cerrar la historia; sin ello el marcado F3 de la épica
> padre (T022) no tiene destino.

## 1. Setup — fixtures de migración

- [x] T001 [P] Crear `skills/memory-system/examples/epic-template-v1/` con épicas v1 de fixture bajo `docs/specs/02-epics/EPIC-NN-*/epic.md`: (a) v1 completa (Descripción, Historias, Flujos Críticos con 3 escenarios DADO/CUANDO/ENTONCES, Requerimiento, Impacto, Dependencias, Riesgos, `**Criterios de éxito:**`, Notas adicionales); (b) mínima tipo EPIC-01 (solo Descripción + Historias); (c) sin `##` tipo EPIC-00; (d) con `## Requerimiento: <x>` y `## Objetivo`; (e) smoke no-gherkin tipo EPIC-14 y línea `- [x] **Nombre**: desc` sin ID tipo EPIC-16; además (f) un template personalizado con las mismas claves pero otros títulos y otro orden, y (g) un template sin `clave:` — D-2b, D-7, D-10, AC-10
- [x] T002 [P] Crear junto a cada fixture de T001 su `expected.md` esperado contra el template v2 y, para (a), también contra el template personalizado (f) (aplicando a mano R1–R11 de D-7), usados como oráculo de los tests — D-7, AC-10

## 2. Template v2

- [x] T003 Reescribir `docs/templates/epic-template.md` con el contrato exacto de D-1 (frontmatter mínimo sin `alwaysApply`/`deliveryModel`/`children`, `status: DEFINE`, `related: []`; 5 secciones con marcador `<!-- sección obligatoria` y `clave:` única — `alcance`, `historias`, `criterios-salida`, `smoke-tests`, `notas`; comentarios guía de Alcance, Historias F1–F3, Criterios de salida, Smoke tests SMOKE-N + no-renumerar + numeración opcional, Notas opcional; ejemplo de Historias en F1); verificar ≤ 40 líneas. El borrador adjunto de la historia ya es ese contenido — D-1, D-2b, AC-1…AC-7, CNF-1, CNF-5
- [x] T004 Copiar byte a byte el resultado de T003 a `skills/epic-creation/assets/epic-template.md` y verificar con `diff` que no hay diferencias — D-8, AC-8

## 3. Migrador `memory-system migrate --from=epic-template-v1`

- [x] T005 Crear `skills/memory-system/scripts/epic-template.js` con `readTemplateContract(text) → [{ heading, clave, obligatoria }]` (orden del template; `UsageError` si hay claves duplicadas) y la función pura `planEpicMigration(text, contract) → { content, changed, findings }`: separar preámbulo (R10) y secciones `##`; mapear títulos v1 a clave (R1 Descripción→`alcance`, R3 `**Criterios de éxito:**`/`## Criterios de éxito`→`criterios-salida`, R5 Notas adicionales/Notas:→`notas`) y escribir el título que el contrato asigna a cada clave; R11 (quitar marcadores de encabezado) — D-2b, D-7, AC-10
- [x] T006 Añadir a `planEpicMigration` la regla R7 de líneas de la sección v1 `Historias` → clave `historias` (heredadas con ID → F2/F3 conservando checkbox; `- [ ] **N:** d` → F1; `[x]` sin ID o irreconocible → verbatim + hallazgo `completada-sin-id`/`historia-irreconocible`); ignorar líneas indentadas — D-2, D-7, AC-10
- [x] T007 Añadir R2 y R4 (Flujos Críticos → clave `smoke-tests` conservando el párrafo introductorio; `### Escenario N: t` + `**DADO/CUANDO/ENTONCES/Y**` → `### SMOKE-N — t` + bloque `gherkin`; cuerpo no reconocible → verbatim + hallazgo `smoke-sin-gherkin`) — D-7, AC-5, AC-10
- [x] T008 Añadir R6 (otros `##` → `### <original>` dentro de la sección `notas`, bajando sus `###` a `####`; eliminar si vacío/placeholder/comentario), R8 (insertar las obligatorias del contrato ausentes, con su título y placeholder según clave), R8b (clave destino no declarada → `notas`; sin `notas` → `[REVISAR]`) y R9 (orden del contrato); garantizar punto fijo para un mismo contrato y `changed=false` para una épica que ya cumple — D-2b, D-7, AC-10
- [x] T009 Añadir `migrateEpics(specsBase, { dryRun, displayRoot })`: resolver el contrato con `readTemplateContract` sobre el template central (o el seed si no existe); descubrir `specs/*/EPIC-*/epic.md`, `assertInsideRoot` por archivo, escribir solo si `!dryRun && changed`, emitir cabecera/líneas `[MIGRADO]`/`[MIGRARÍA]`/`[SIN CAMBIOS]`/`[REVISAR] <ruta>:<línea> — <motivo>`, resumen `migrados · sin cambios · a revisar` (+ `cambios pendientes` en `--dry-run`); si el template central no declara ninguna `clave:`, avisar `[REVISAR] templates/epic-template.md` sin sobrescribirlo y usar el seed como contrato; exit 1 si hay `[REVISAR]` — D-2b, D-7, D-8, AC-10
- [x] T010 Modificar `skills/memory-system/scripts/memory-system.js`: `MIGRATE_SOURCES = ['dod-monolithic', 'epic-template-v1']`, despacho en `runMigrate` por `args.from`, `USAGE` con ambos orígenes, `--force` ignorado para `epic-template-v1` — D-7, AC-10
- [x] T011 Modificar `skills/memory-system/SKILL.md`: fila `migrate --from=epic-template-v1 [--dry-run]` en Parámetros y Paso 1, secuencia `3.8`, fila del Paso 2 (salida del motor), línea del informe final (Paso 4), aviso de Paso 5 sin `node` (`❌ … requiere node`, sin escrituras) y `description` — D-7, AC-10

## 4. Gate `epic-format-validation`

- [x] T012 Modificar `skills/epic-format-validation/SKILL.md` Paso 3/4: leer también el contrato por claves (D-2b; clave duplicada → `❌ Template inválido`); sin detección de versión por título: las secciones faltantes se listan como hoy y `REFINAR` añade la nota `Si la épica se creó con una versión anterior del template → /memory-system migrate --from=epic-template-v1`; actualizar el "resultado esperado" de 3a/3b al template v2 sin escribir títulos como regla — D-2b, D-3, CNF-4, AC-11
- [x] T013 Añadir al gate la regla de forma de la sección con clave `historias` (F1/F2/F3 sobre líneas de nivel superior, referenciando `domain-epic-lifecycle`) y la de la sección con clave `smoke-tests` (≥ 1 `###`; con ≥ 2 todos `### SMOKE-<N> — <nombre>`; con 1 se admiten ambas formas; bloque `gherkin` con `Escenario:/Dado/Cuando/Entonces`; IDs duplicados); cada regla se omite si el template no declara su clave; bloque `Formato inválido:` en la salida `REFINAR` con línea, texto y forma esperada — D-2b, D-3, AC-5, AC-11
- [x] T014 [P] Actualizar `skills/epic-format-validation/README.md` si cita secciones v1 — D-9, AC-11

## 5. Productores de épicas

- [x] T015 Modificar `skills/epic-creation/SKILL.md`: Paso 3 sin `alwaysApply`; Paso 4 sin guía escrita por título: una pregunta por sección construida con su título y su comentario guía del template; manejo especial solo por clave — `historias` (pide `Nombre: descripción`, escribe F1, sin IDs) y `smoke-tests` (pide Dado/Cuando/Entonces, escribe `### SMOKE-N — <nombre>` + `gherkin` desde 1); eliminar la guía de las secciones v1; Referencias — D-2b, D-4, AC-8
- [x] T016 Añadir a `skills/epic-creation/SKILL.md` la sección `## DoD aplicable` (etapa DEFINE de Epic; sin guardrail vigente; gate = Gate de formato `DEFINE → PLAN` de `domain-epic-lifecycle` §8 ejecutado por `epic-format-validation` en el Paso 7; override no aplica) — D-4, CR-002, AC-8
- [x] T017 [P] Alinear `skills/epic-creation/README.md` y `skills/epic-creation/examples/` al formato v2 — D-9, AC-8
- [x] T018 Modificar `skills/epic-from-project-plan/SKILL.md` Fase 3d: reemplazar el ejemplo embebido (títulos fijos) por el mapeo plan → clave (`alcance`; F1/F2/F3 en `historias`; `criterios-salida`; SMOKE-N en `smoke-tests`; requisitos/dependencias/riesgos → `###` en `notas`, omitidas si vacías); títulos y orden leídos del template; `[Por completar]` en secciones sin dato o sin clave mapeada — D-2b, D-4, AC-8
- [x] T019 Añadir a `skills/epic-from-project-plan/SKILL.md` la Fase 3e (invocar `epic-format-validation` en modo automático por cada épica generada; `REFINAR` no detiene el batch) y su reporte en la Fase 4; eliminar la nota "el skill no valida" — D-4, AC-8

## 6. Editores de la sección `historias`

- [x] T020 Modificar `skills/epic-generate-stories/SKILL.md`: nuevo Paso 1b que resuelve el template (central → seed) y el título de la clave `historias` (declarar la dependencia `epic-template.md`); template sin esa clave → `❌` y detener; épica sin ese título → fail-fast sin escrituras con la nota de migración; Paso 2 acepta solo F1/F2/F3 (eliminar los 5 formatos heredados; solo nivel superior de esa sección); Paso 2b reescribe cada F1 a F2 `- [ ] **STORY-NNN** — <Nombre>: <desc>`, no toca F2/F3 ni otras secciones, actualiza `updated:`; actualizar "Restricciones" — D-2b, D-5, AC-9
- [x] T021 Modificar `skills/epic-generate-all-stories/SKILL.md`: Paso 4a aplica por referencia los Pasos 2 y 2b de `epic-generate-stories` con contador `NNN` global al batch; ajustar el Paso 2 (conflictos solo para líneas con ID) y Restricciones — D-5, CR-009, AC-9
- [x] T022 [P] Modificar `skills/story-implement/SKILL.md` Paso 11d: resolver del template el título de la clave `historias`; si el template no la declara o la épica no tiene ese título → `[WARN] … /memory-system migrate --from=epic-template-v1; omitiendo actualización` (no bloquea); si no, buscar dentro de esa sección la línea de nivel superior con `**<story_id>**` (token exacto), cambiar `- [ ]` → `- [x]` solo ahí y actualizar `updated:` — D-2b, D-6, AC-9
- [x] T023 [P] Aplicar el mismo cambio de T022 a `skills/story-implement-tasks/SKILL.md` Paso 4c — D-6, AC-9

## 7. Documentación y registro

- [x] T024 [P] Modificar `docs/domains/domain-epic-lifecycle.md` §9: nueva subsección "Estructura de `epic.md`" con el contrato por claves (vocabulario `alcance`/`historias`/`criterios-salida`/`smoke-tests`/`notas`, qué edita el usuario y qué es fijo, procedimiento de lectura del template), la tabla F1–F3 con transiciones y skills responsables y la regla SMOKE-N; quitar `deliveryModel` del bullet de frontmatter; no tocar §4–§8 — D-2, D-2b, D-9, CNF-2
- [x] T025 [P] Revisar `docs/guides/sddf-commands-pipeline.md` y actualizarlo solo si menciona secciones v1 del Epic (`Descripción`, `Flujos Críticos`, `Criterios de éxito`); registrar N/A para `docs/templates/README.md` y `docs/guides/how-to-write-epics.md` (inexistente) — D-9, CNF-2
- [x] T026 [P] Añadir a `CHANGELOG.md` `[Unreleased]` → `### Changed` **BREAKING** (template v2, skills afectados, el formato v1 deja de aceptarse — CR-007), `### Added` (`migrate --from=epic-template-v1`; atributo `clave:` en los marcadores del template, que permite renombrar y reordenar secciones sin tocar skills — CR-011) y los pasos para la guía de actualización a 4.0.0 (reinstalar con `npx agile-sddf install --force`, reemplazar el template central, migrar con `--dry-run` y luego real) — D-9, CNF-3, CNF-4

## 8. Tests y evals

- [x] T027 Crear `test/epic-template.test.js` (`node --test`): `readTemplateContract` (template v2 → 5 entradas en orden; clave duplicada → `UsageError`; template sin claves → todas `clave: null`); por cada fixture de T001 `planEpicMigration(input, contrato v2).content === expected` (T002) y la fixture (a) contra el template personalizado (f); punto fijo; `changed=false` y `[SIN CAMBIOS]` en segunda ejecución; hallazgos `[REVISAR]` y exit 1 en fixture (e); aviso `[REVISAR]` con el template sin claves (g) sin sobrescribirlo; `--dry-run` sin escrituras; `parseArgs` acepta `--from epic-template-v1` — D-2b, D-10, AC-10
- [x] T028 Añadir a `test/epic-template.test.js` las comprobaciones del template: exactamente 5 `##` en orden con marcador, las claves `alcance`/`historias`/`criterios-salida`/`smoke-tests`/`notas` presentes y únicas, sin las 8 secciones eliminadas, guías de AC-2…AC-6 presentes, frontmatter sin `implements/deliveryModel/children/alwaysApply` y con `status: DEFINE`, ≤ 40 líneas, central == seed, IDs/slugs con `-` U+002D — D-2b, D-10, AC-1…AC-7, CNF-1, CNF-5
- [x] T029 [P] Actualizar `skills/epic-format-validation/evals/evals.json` (descripción y casos: v2 aprobado, épica v1 → REFINAR con faltantes + nota de migración, línea de Historias inválida, ≥ 2 smoke sin `SMOKE-N`, falta la sección `notas`, template con `## Historias` renombrado a `## Features` (misma clave) → la regla F1–F3 se aplica a `Features`, template sin `smoke-tests` → no exige `SMOKE-N`) — D-2b, D-10, AC-11, CNF-4
- [x] T030 [P] Actualizar `evals.json` de `epic-creation` (genera F1 + SMOKE-1 y pasa el gate; con un template de títulos renombrados usa esos títulos), `epic-generate-stories` (F1 → F2 sin cambios fuera de la sección `historias` salvo `updated`; funciona con el título renombrado; épica sin esa sección → se detiene sin escribir) y `epic-from-project-plan` (generado → `APROBADO`) — D-2b, D-10, AC-8, AC-9

## 9. Migración del repositorio y verificación

- [x] T031 Ejecutar `node skills/memory-system/scripts/memory-system.js migrate --root docs --from epic-template-v1 --dry-run`, revisar el plan y ejecutar la migración real sobre las 22 épicas de `docs/specs/02-epics/` — F-4, AC-10
- [x] T032 Resolver a mano cada `[REVISAR]` reportado (p. ej. EPIC-14 smoke no-gherkin, EPIC-16 `[x]` sin ID) sin perder contenido y re-ejecutar `--dry-run` hasta `cambios pendientes: 0` y exit 0 — F-4, AC-10
- [x] T033 Ejecutar `epic-format-validation` sobre las 22 épicas migradas y sobre una épica generada por `epic-creation`; todas `APROBADO` — AC-8, AC-10, AC-11
- [x] T034 Ejecutar `npm test` (incluye `test/epic-template.test.js`, `memory-system.test.js`, `dod-story.test.js`) y `npm run verify:links`; todo en verde — AC-1…AC-11, CNF-2
- [x] T035 Ejecutar `npm run test:eval -- --dry-run` sobre los skills modificados (plan no vacío) y, si hay runner disponible, `npm run test:eval` de `epic-format-validation`, `epic-creation`, `epic-generate-stories`, `epic-from-project-plan` — AC-8, AC-9, AC-11 · **Parcial (2026-10-06):** `npm run test:eval -- --dry-run` OK (plan de 106 casos, exit 0); pendiente ejecutar los evals reales con LLM
- [ ] Run EVs (npm run test:eval) TC-036 and TC-037 from skill `story-implement`.
