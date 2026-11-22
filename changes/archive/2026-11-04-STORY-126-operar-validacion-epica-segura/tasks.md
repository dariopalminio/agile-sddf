---
alwaysApply: false
type: tasks
id: STORY-126
slug: STORY-126-operar-validacion-epica-segura-tasks
title: "Tasks: Operar la validación de épicas de manera segura"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-23-completar-flujo-de-epic
story: STORY-126
design: STORY-126
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-126-operar-validacion-epica-segura
---

<!-- Referencias -->
[[STORY-126-operar-validacion-epica-segura]]

## 1. Precondiciones y alineación de la historia

- [x] T001 Verificar la precondición de CR-002: `skills/epic-validate/SKILL.md`, `assets/epic-validate-report-template.md` y `evals/evals.json` existen (STORY-124 implementada). Registrar si los pasos `OPE-*` de STORY-125 y los de suites de STORY-169 ya están en el `SKILL.md`; si no lo están, anotar que C4/C8 y los evals V-2, V-3 y V-6 se escriben contra un validador stub de veredicto fijo y que T020 queda pendiente (CR-002) // AC-1, AC-2
- [x] T002 Aplicar CR-001 de design.md en `story.md`, con confirmación del PO antes de escribir: en AC-4 cambiar «salvo la fecha de evaluación» por «salvo los datos de la ejecución (fecha de evaluación y duraciones medidas)» y ajustar igual la regla «Contenido equivalente» de las Notas (D-9) // AC-4, CNF-1

## 2. SKILL.md — invocación y modo (editar con `skill-master`)

- [x] T003 Reescribir el Paso 1 «Argumentos» (C1) de `skills/epic-validate/SKILL.md`: contrato `/epic-validate <epica> [--mode auto|manual] [--dry-run]` en cualquier orden; normalizar `--mode=<valor>` a `--mode <valor>`; salida interna `{ epica, modoFlag, dryRun }`; declarar que este paso no lee ningún archivo (D-2, D-3) // AC-1, AC-3, CS-10
- [x] T004 En el mismo Paso 1, escribir los cinco errores de invocación en su orden de evaluación (primer error gana), con los mensajes literales de la tabla de Interfaces de design.md: argumento `--…` no reconocido (incluye `--verbose`), `--mode` sin valor o seguido de `--…`, valor distinto de `auto`/`manual` (sensible a mayúsculas), `--mode` repetido, segundo posicional; `--dry-run` repetido no es error. Ante cualquiera: fin sin leer ni escribir, y emitir el bloque de resultado de T011 con `FALLO` y `MOTIVO:` (D-7, D-10) // AC-3
- [x] T005 Ajustar el paso «Modo de evidencia» (C2): `modoFlag` presente → `MODO = modoFlag`, origen `flag`; ausente → regla de STORY-125 (`auto` si `sddf.config.yaml › verify.e2e-smoke.command` está declarado, si no `manual`), origen `regla por defecto`; `sddf.config.yaml` ausente o ilegible → `manual`. Si el paso de STORY-125 aún no existe, crearlo con esta regla. Eliminar del paso cualquier mensaje genérico para valores de `--mode` (CR-003) // AC-1
- [x] T006 Escribir la regla de interacción por modo y el argumento ausente: con `MODO = auto` el skill no pregunta nada (las confirmaciones quedan `sin evidencia`, STORY-125 D-9) y `<epica>` ausente → `❌ Falta el argumento <epica>` como error de invocación; con `MODO = manual` se mantiene la pregunta `¿Qué épica deseas validar? …` de STORY-124 (D-8) // AC-1

## 3. SKILL.md — efectos, previsualización y determinismo

- [x] T007 Agregar en `## Restricciones / Reglas` la sección «Política de efectos» (C3) con la tabla de design.md (error de invocación · `--dry-run` · `MODO = auto` · `MODO = manual` × archivos escritos · comandos ejecutados vía `check-command` · preguntas) y la regla explícita: nunca `.tmp/`, `.bak`, ni cambios en `epic.md`, `story.md`, `epic-analyze-report.md`, reportes de historias, templates o código fuente; único archivo escrito fuera de `--dry-run`: `<EPIC_DIR>/epic-validate-report.md` (sobrescritura completa). Declarar que los comandos del proyecto son datos de su responsabilidad (Risks) // AC-1, AC-2, AC-3, CNF-2, CS-7
- [x] T008 Agregar la guardia de previsualización (C4) al inicio de cada paso cuya evidencia proviene de un comando o una confirmación (`OPE-01`, `OPE-02`, `OPE-03` y suites, los que existan): con `dryRun`, resultado `no ejecutada`, evidencia `` `--dry-run`: no se ejecutan comandos ni se piden confirmaciones ``, cada `SMOKE-N` `no ejecutado` con esa fuente, sin invocar `check-command` ni preguntar; redactarla como regla genérica para toda comprobación futura que pase por `check-command`. `EST-01` y `EST-02` se evalúan siempre (D-4, D-5) // AC-2
- [x] T009 En el Paso 4 (veredicto, C8), agregar `no ejecutada` como resultado sin efecto (igual que `omitida`), sin cambiar la función del veredicto, y la nota en `notas-validacion` con la lista de comprobaciones no ejecutadas (D-6) // AC-2
- [x] T010 En el Paso 5 (template y escritura, C5 y C6):
  - Con `dryRun`, renderizar el reporte con el template efectivo y el `created` del reporte previo (o hoy) e imprimirlo entre `── Previsualización (--dry-run): no se escribió <ruta relativa> ──` y `── Fin de la previsualización ──`, en un bloque de código `markdown`, sin escribir; sin `dryRun`, escribir solo `<EPIC_DIR>/epic-validate-report.md`.
  - Agregar la tabla de campos volátiles (`updated`, fecha de evaluación de `## Resumen` y duraciones medidas, fechas `YYYY-MM-DD` sin hora) y la advertencia de que `outputTail` cita datos del proyecto.
  - Agregar la tabla de reglas de orden y forma: comprobaciones por familia y número; historias por `STORY-NNN` ascendente y F1 en orden del índice; smoke tests por `N`; criterios del DoD por número; motivos con un máximo de uno por elemento; notas por fuente y línea; rutas relativas a `REPO_ROOT` con `/`; UTF-8 sin BOM con LF.
  (D-4, D-9) // AC-2, AC-4, CNF-1, CNF-2
- [x] T011 En el Paso 6 (salida, C7), agregar el bloque de resultado como últimas líneas de toda ejecución: `RESULTADO: <ÉXITO | FALLO | SIMULACIÓN>`, `VEREDICTO:`, `MODO:`, `REPORTE:` y `MOTIVO:` solo ante error de invocación o fallo que detiene el skill; escribir la tabla de correspondencia de design.md (`ÉXITO` ⇔ reporte escrito con `APPROVED`; `FALLO` ⇔ `NEEDS-CHANGES`/`BLOCKED`, error de invocación, template ausente o escritura fallida con `VEREDICTO: —`; `SIMULACIÓN` ⇔ `--dry-run` completado con `REPORTE: —`) y la regla «todo valor distinto de `ÉXITO` es no aprobado» (D-1, P7) // AC-1, AC-2, AC-3
- [x] T012 Actualizar `## Parámetros`, `## Modos de ejecución` y `## Salida` del `SKILL.md` con `--mode auto|manual` y `--dry-run` (sin `--verbose`), y comprobar que la `description` sigue ≤ 500 caracteres // CS-10

## 4. Evals (`skills/epic-validate/evals/evals.json`)

- [x] T013 [P] Agregar el caso V-1 (siguiente `TC-NNN` libre): `--mode auto` con fixture aprobada → `contains` `verdict: APPROVED`, `RESULTADO: ÉXITO`, `MODO: auto`; `not_contains` `¿` (ninguna pregunta) y escrituras distintas de `epic-validate-report.md` // AC-1
- [x] T014 [P] Agregar el caso V-2: `--mode manual` con un `SMOKE-N` sin reporte aprobado y sin respuesta → `contains` `verdict: BLOCKED`, `RESULTADO: FALLO`, `VEREDICTO: BLOCKED` (con validador stub si STORY-125 no está, T001) // AC-1
- [x] T015 [P] Agregar el caso V-3: `--dry-run` → `contains` `── Previsualización (--dry-run)`, `## Veredicto`, `no ejecutada`, `RESULTADO: SIMULACIÓN`, `REPORTE: —`; `not_contains` `=== epic-validate-report.md ===`, `check-command` y cualquier otra escritura // AC-2, CNF-2
- [x] T016 [P] Agregar el caso V-4: `--mode rapido` → `contains` `❌ Valor no reconocido para --mode: rapido. Valores válidos: auto, manual`, `RESULTADO: FALLO`, `MOTIVO:`; `not_contains` `===` (ningún archivo) // AC-3
- [x] T017 [P] Agregar el caso V-5: fixture con `epic-validate-report.md` previo (`created: 2026-10-01`) y dos motivos → `contains` `created: 2026-10-01`, `M-001`, `M-002`; `not_contains` `M-003` y escrituras de `epic.md` o `story.md` // AC-4, CNF-1
- [x] T018 [P] Agregar los casos V-6 (`--dry-run --mode manual` y `--mode manual --dry-run` con el mismo fixture y el mismo `expected`) y V-7 (`--mode` sin valor y `--mode auto --mode manual` → sus mensajes y `RESULTADO: FALLO`) // AC-2, AC-3, CS-10

## 5. Verificación

- [x] T019 Verificar que `SKILL.md` mide < 500 líneas, que los archivos editados son UTF-8 sin BOM y que los mensajes de error, las líneas de previsualización y el bloque de resultado coinciden literalmente con design.md // AC-1, AC-2, AC-3
- [x] T020 Si al implementar no estaban los pasos de STORY-125 o STORY-169 (T001), dejar registrada en `implement-report.md` la verificación pendiente: al integrarlos, comprobar que C4 los cubre y re-ejecutar V-2, V-3 y V-6 (CR-002) // AC-2
- [x] T021 Ejecutar `npm run verify:layout`, `npm run verify:validation-contract` y `npm run verify:eval-inventory` sin errores // CS-10, CS-21
- [x] T022 Ejecutar `npm test` y `npm run verify:repository`; deben pasar sin errores (V-8) // CS-21
- [x] T023 Ejecutar `graphify update .` para actualizar el grafo tras los cambios
- [x] T024 Registrar como pendiente de ejecución manual (criterio humano, AGENTS.md) `npm run test:eval -- epic-validate` con los casos nuevos, y el recorrido manual: `/epic-validate EPIC-23 --dry-run` y `/epic-validate EPIC-23 --mode rapido` dejan `git status` sin cambios // AC-2, AC-3, CS-7
