---
alwaysApply: false
type: tasks
id: STORY-128
slug: STORY-128-evaluar-validacion-epica-repetible-tasks
title: "Tasks: Evaluar la validación de épicas de forma repetible"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-23-completar-flujo-de-epic
story: STORY-128
design: STORY-128
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-128-evaluar-validacion-epica-repetible
---

<!-- Referencias -->
[[STORY-128-evaluar-validacion-epica-repetible]]

> **Orden por dependencia (CR-001 de design.md):** esta historia se implementa después de STORY-124 y STORY-125. STORY-126 no es requisito (D-6). Si T001 encuentra que falta alguna precondición, las tareas T009–T013 quedan bloqueadas y no se escriben casos contra un `SKILL.md` incompleto. El grupo 2 puede escribirse antes, pero falla por diseño mientras no exista `evals.json`.

## 1. Precondiciones y alineación documental

- [ ] T001 Verificar las precondiciones de CR-001 y registrar el resultado en `implement-report.md`:
  - `skills/epic-validate/SKILL.md` y `skills/epic-validate/evals/evals.json` existen (STORY-124).
  - `SKILL.md` reconoce `--mode auto`, evalúa `OPE-01` con `check-command` y clasifica `not-executable` como `SMOKE-N` `no ejecutable` → `OPE-01 bloqueada` (STORY-125).
  - En el frontmatter de `skills/epic-validate/assets/epic-validate-report-template.md`, `created` sigue inmediatamente a `verdict` (D-3).
  - Los motivos usan el marcador `[<VALOR>]` (`M-NNN [<VALOR>] …`).

  Si falta algo, detener las tareas T009–T013 y registrar la dependencia // AC-1, AC-2, CNF-3
- [ ] T002 [P] Aplicar CR-002 de design.md en `story.md`, con confirmación del PO antes de escribir: precisar CNF-2 como «los resultados no dependen de servicios externos, salvo el runner de evals, ni de comandos reales: el resultado de cada comando lo fija el propio caso». Si el PO no lo confirma, dejar constancia en `implement-report.md` y continuar con la interpretación de design.md // CNF-2
- [ ] T003 [P] Aplicar CR-003 de design.md en `specs/flow/EPIC-23-completar-flujo-de-epic/epic.md`, con confirmación del PO: en Notas, «Alineación pendiente de historias existentes», quitar STORY-128 de la línea «STORY-124 a STORY-128 todavía usan `APPROVED` / `BLOCKED`» (pasa a «STORY-124 a STORY-127»). No tocar ninguna otra línea // AC-2

## 2. Guardia de cobertura de evals (C3)

- [ ] T004 Crear `test/epic-validate-evals.test.js` siguiendo el estilo de `test/sddf-init-layout.test.js` (`node:test`, `node:assert/strict`, lectura desde `REPO_ROOT`):
  - Una función que lee y parsea `skills/epic-validate/evals/evals.json`. Si el archivo no existe, falla con `skills/epic-validate/evals/evals.json no existe (STORY-124 sin implementar)`.
  - Una función `declaredVerdict(testCase)` que devuelve `<V>` cuando `expected.contains` tiene una entrada exactamente igual a `verdict: <V>\ncreated:`, y `null` en caso contrario.
  - Funciones de validación que reciben un manifiesto ya parseado y devuelven la lista de errores con los mensajes literales de la tabla de Interfaces de design.md. Así se pueden probar con manifiestos en memoria (T008).

  (Interfaces «Veredicto esperado de un caso» y «Mensajes de C3») // AC-3, CNF-3
- [ ] T005 Implementar y probar G-A y G-B sobre el `evals.json` real: el archivo es JSON válido con `cases[]` no vacío, y entre los veredictos declarados hay al menos un `APPROVED`, un `NEEDS-CHANGES` y un `BLOCKED`. Si falta uno, el mensaje es `evals.json no conserva ningún caso <V> (CS-9)` // AC-3, CNF-1
- [ ] T006 Implementar y probar G-C sobre todos los casos. Un caso con una entrada de `contains` que empieza por `verdict: ` o por `` **Veredicto:** ` `` debe:
  - declarar exactamente un `<V>` ∈ {`APPROVED`, `NEEDS-CHANGES`, `BLOCKED`} (si no, `<TC-NNN>: veredicto no permitido <valor> (CNF-3)`);
  - tener en `contains` `verdict: <V>\ncreated:` y `` **Veredicto:** `<V>` ``;
  - tener en `not_contains` `` **Veredicto:** `<O1>` `` y `` **Veredicto:** `<O2>` ``;
  - tener `threshold` ausente o igual a `1`.

  Cada falta produce `<TC-NNN>: falta <aserción> (CNF-3)` (D-3) // CNF-3
- [ ] T007 Implementar y probar G-D, G-E y G-F sobre el conjunto de regresión:
  - G-D: existen los casos con `name` `regresion-veredicto-approved` (`APPROVED`), `regresion-veredicto-historia-no-terminal` (`NEEDS-CHANGES`), `regresion-veredicto-smoke-no-ejecutable` (`BLOCKED`) y `regresion-veredicto-precedencia` (`NEEDS-CHANGES`), cada uno con ese veredicto declarado.
  - G-E: `input.invocation` contiene `--mode auto`, y `input` no tiene la clave `user_answers` ni ninguna cadena (recorrido recursivo) que empiece por `> `.
  - G-F: los comandos de `input.sddf_config.verify["e2e-smoke"].command` y de `input.package_json.scripts["verify:release"]`, si están presentes, tienen una entrada en `input.command_results` con `outcome` ∈ {`pass`, `fail`, `not-executable`}, y ninguna cadena de `input` contiene `http://` ni `https://`.

  Mensajes: `falta el caso de regresión <nombre> (AC-3)`, `<TC-NNN>: requiere intervención manual (<motivo>)` y `<TC-NNN>: comando sin resultado simulado: <cmd> (CNF-2)` // AC-3, CNF-2
- [ ] T008 Agregar las pruebas negativas con manifiestos en memoria, derivados del real por copia profunda (V-7):
  - sin ningún caso `BLOCKED` → mensaje de G-B;
  - un caso que conserva solo `verdict: <V>` → mensaje de G-C;
  - un caso de regresión con `user_answers` → mensaje de G-E;
  - un caso de regresión sin `command_results` para su comando → mensaje de G-F.

  Cada prueba afirma el mensaje literal // AC-3, CNF-2, CNF-3

## 3. Conjunto de regresión del veredicto (C1)

- [ ] T009 Agregar a `skills/epic-validate/evals/evals.json` el caso `regresion-veredicto-approved`, con el siguiente `TC-NNN` libre y `type: happy-path`. Su `input` es el mundo base completo de design.md:
  - `invocation`: `/epic-validate EPIC-90 --mode auto`.
  - `epic_md_path` y `epic_md_lines` con `id: EPIC-90`, `status: DEVELOP`, `## Historias` (`clave: historias`) con `**STORY-901**` y `**STORY-902**` en F2, y `## Smoke tests` (`clave: smoke-tests`) con `### SMOKE-1 — Validación visible` y su bloque `gherkin`.
  - `stories[]`: `STORY-901` activa, `DELIVER/DONE`, cuyo cuerpo cita `SMOKE-1`; `STORY-902` archivada en `specs/flow/archive/2026-10-20-STORY-902-…/story.md`, `COMPLETED/DONE`.
  - `epic_analyze_report` con `verdict: APPROVED`; `sddf_config` y `package_json` con `node -e "process.exit(0)"`; `command_results` con ambos en `pass`/`0`.
  - `dod_epic_validate` ausente, `templates` (central ausente, seed presente), `previous_report: null` y `today: 2026-10-29`.

  `expected`: la forma cerrada para `APPROVED` más `contains` `Sin motivos.` y `not_contains` `[NEEDS-CHANGES]`, `[BLOCKED]` y `sección obligatoria ·` // AC-1, CNF-2, CNF-3
- [ ] T010 [P] Agregar `regresion-veredicto-historia-no-terminal` (siguiente `TC-NNN`). Copia literal del mundo base, salvo `STORY-902`, que pasa a estar activa en `specs/flow/STORY-902-…/story.md` con `IMPLEMENT/IN-PROGRESS`. `expected`: la forma cerrada para `NEEDS-CHANGES` más `contains` `EST-01`, `STORY-902` e `IMPLEMENT/IN-PROGRESS`, y `not_contains` `[BLOCKED]` // AC-2, CNF-3
- [ ] T011 [P] Agregar `regresion-veredicto-smoke-no-ejecutable` (siguiente `TC-NNN`). Copia literal del mundo base, salvo que `sddf_config.verify["e2e-smoke"].command` es `sddf-eval-smoke-inexistente` y su entrada en `command_results` es `{ outcome: not-executable, exitCode: 127, reason: ejecutable no encontrado }`. `expected`: la forma cerrada para `BLOCKED` más `contains` `OPE-01`, `SMOKE-1`, `no ejecutable` y `[BLOCKED]`, y `not_contains` `[NEEDS-CHANGES]` (D-2) // AC-2, CNF-2, CNF-3
- [ ] T012 [P] Agregar `regresion-veredicto-precedencia` (siguiente `TC-NNN`), con las variaciones de T010 y T011 a la vez. `expected`: la forma cerrada para `NEEDS-CHANGES` más `contains` `STORY-902`, `IMPLEMENT/IN-PROGRESS`, `SMOKE-1`, `no ejecutable`, `[NEEDS-CHANGES]` y `[BLOCKED]` (G-05) // AC-2, CNF-3
- [ ] T013 Revisar los cuatro casos nuevos:
  - Los `TC-NNN` son consecutivos, siguen el orden de la tabla de Interfaces y no repiten ningún ID existente.
  - Cada `description` nombra el AC y la fila que cubre.
  - Ningún `input` define directorios reales del repositorio (el mundo es simulado).
  - Las aserciones específicas usan solo los tokens contractuales de design.md (D-7).

  // AC-1, AC-2, AC-3

## 4. Forma cerrada en los casos existentes (C2)

- [ ] T014 Recorrer los casos de STORY-124/125/126 en `skills/epic-validate/evals/evals.json` con alguna entrada `verdict: ` o `` **Veredicto:** ` `` en `contains`:
  - Reemplazar `verdict: <V>` por `verdict: <V>\ncreated:`.
  - Agregar las aserciones que falten de la forma cerrada (`` **Veredicto:** `<V>` `` en `contains`, y los otros dos valores en `not_contains`).
  - Si un `not_contains` existente choca con la forma cerrada, registrarlo en `implement-report.md` y conservar la intención del caso.

  No se cambian `input`, `name`, `description` ni las demás aserciones // CNF-3

## 5. Verificación

- [ ] T015 Ejecutar `node --test test/epic-validate-evals.test.js`: pasan G-A…G-F sobre el `evals.json` real (V-6) y las cuatro pruebas negativas de T008 (V-7) // AC-3, CNF-1, CNF-2, CNF-3
- [ ] T016 Ejecutar `npm run verify:repository` (incluye `verify:eval-inventory`: IDs `TC-NNN` válidos y únicos) y `npm test`: ambos pasan sin errores (V-8). Confirmar que `evals.json` y el archivo de prueba están en UTF-8 sin BOM con finales LF // CS-21
- [ ] T017 Registrar en `implement-report.md`, como verificación pendiente de ejecución manual (criterio humano, `AGENTS.md`), el comando `npm run test:eval -- epic-validate --only <los cuatro TC-NNN>`. Se ejecuta dos veces seguidas con los mismos artefactos y se espera el veredicto de cada caso en ambas ejecuciones, sin preguntas (V-1…V-5) // AC-1, AC-2, AC-3
- [ ] T018 Ejecutar `graphify update .` para actualizar el grafo tras agregar `test/epic-validate-evals.test.js` (regla de `AGENTS.md`) // CS-21
