---
type: implement-report
id: STORY-137
slug: STORY-137-implement-report
title: "Implement Report: Controlar el detalle y los límites de la ejecución de la validación de épicas"
story: STORY-137
created: 2026-10-30
updated: 2026-10-30
---

# Reporte de Implementación: Controlar el detalle y los límites de la ejecución de la validación de épicas

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-137 |
| Total de tareas | 24 |
| Tareas completadas | 24 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-10-30 |

**Estado:** ✅ Implementación completa

> La historia tiene 24 tareas (más de 20). Se procesó en una sola sesión porque las tareas son atómicas y tocan solo tres archivos de producción.

---

## Precondiciones (T001, CR-002, CR-003)

| Precondición | Resultado |
|---|---|
| (a) `skills/epic-validate/SKILL.md`, `evals/evals.json`, Paso 1 de STORY-126 (`{ epica, modoFlag, dryRun }`, cinco errores, bloque `RESULTADO`, Política de efectos) | ✓ existen (STORY-124/125/126 en `IMPLEMENT/DONE`) |
| (b) Regla del modo por defecto de STORY-125/126 | ✓ existe como Paso 1.2 «Modo» (no hay un paso separado «Modo de evidencia»; C2 y C3 se escribieron allí) |
| (c) `scripts/epic-suites.js` y `test/epic-suites.test.js` con el contrato I1 | ✓ `check-command` existe; **`run` no existe** (STORY-169 en `READY-FOR-IMPLEMENT/DONE`) |

No hizo falta un validador stub: los pasos de STORY-125/126 ya están implementados. T002 se saltó porque el motor existe.

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Verificar precondiciones CR-002/CR-003 | ✓ completado | este reporte |
| T002 | Crear el motor si no existe | ✓ completado (no aplica: el motor existe) | — |
| T003 | Prueba RED V-1 (`--full-output`, stdout antes de stderr, sin clave `output` sin la opción) | ✓ completado | `test/epic-suites.test.js` |
| T004 | Prueba RED V-2 (30 líneas, mismo `outputTail`; no lanzado → `output: null`) | ✓ completado | `test/epic-suites.test.js` |
| T005 | GREEN: `--full-output` en `check-command` | ✓ completado | `skills/epic-validate/scripts/epic-suites.js` |
| T006 | `run --full-output` | ✓ completado (no aplica: `run` no existe, ver Pendientes) | — |
| T007 | `node --test test/epic-suites.test.js` | ✓ completado: 17/17 | — |
| T008 | Paso 1.1: `--verbose` y `verbose` en la invocación parseada | ✓ completado | `skills/epic-validate/SKILL.md` |
| T009 | Predicado «pruebas configuradas» (C2) | ✓ completado | `skills/epic-validate/SKILL.md` |
| T010 | Guardia `--mode auto` sin pruebas (C3) | ✓ completado | `skills/epic-validate/SKILL.md` |
| T011 | Orden de evaluación de la invocación | ✓ completado | `skills/epic-validate/SKILL.md` |
| T012 | Regla «Presentación de comandos» (C4) | ✓ completado | `skills/epic-validate/SKILL.md` |
| T013 | `--full-output` en «Cómo invocar el motor» (regla genérica) | ✓ completado | `skills/epic-validate/SKILL.md` |
| T014 | Política de efectos: fila del rechazo y nota de `--verbose` | ✓ completado | `skills/epic-validate/SKILL.md` |
| T015 | Parámetros, Modos de ejecución, Salida; límites de tamaño | ✓ completado | `skills/epic-validate/SKILL.md` |
| T016 | Evals V-4 y V-5 | ✓ completado | `evals.json` (TC-027, TC-028) |
| T017 | Eval V-6 | ✓ completado | `evals.json` (TC-029) |
| T018 | Evals V-7 y V-8 | ✓ completado | `evals.json` (TC-030, TC-031) |
| T019 | Registrar la verificación pendiente | ✓ completado | este reporte |
| T020 | Mensajes literales y UTF-8 sin BOM | ✓ completado | — |
| T021 | `verify:layout`, `verify:validation-contract`, `verify:eval-inventory` | ✓ completado: los tres OK | — |
| T022 | `npm test` y `npm run verify:repository` | ✓ completado: 381/381 y gate aprobado | — |
| T023 | `graphify update .` | ✓ completado | `graphify-out/` |
| T024 | Registrar la ejecución manual pendiente | ✓ completado | este reporte |

## Cambios por componente

- **C5 motor** (`epic-suites.js`): `classifyCommand(repoRoot, command, { fullOutput })` y `parseArgs` aceptan `--full-output` en cualquier posición. Con la opción se agrega `output` (stdout + stderr completos, misma composición que `outputTail`, para `pass` y `fail`; `null` si el comando no se lanzó). Sin la opción la clave no aparece. Los demás campos y los códigos de salida 0/1/2 no cambian; una opción desconocida (p. ej. `--verbose`) sigue saliendo con 2. Se actualizaron el JSDoc y el texto de uso.
- **C6 pruebas** (`test/epic-suites.test.js`): 4 pruebas nuevas (V-1, V-2, no lanzado → `null`, posición de la opción y opción desconocida).
- **C1–C4, C7, C8** (`SKILL.md`): `--verbose` en el contrato y en la invocación parseada; error 1 sin la excepción «hasta STORY-137» (`--verbose=<algo>` sigue rechazado); predicado «pruebas configuradas» con nombre, citado por el modo por defecto y por la guardia; guardia con sus tres causas, `MODO: auto` en el bloque de resultado; orden de evaluación; regla «Presentación de comandos» (línea `▶`, bloque `text` con valla segura, aviso `ℹ️`); `--full-output` solo con `verbose`; fila nueva en la Política de efectos; Parámetros, Modos, Paso 6, Errores, Verificación del flujo y Salida actualizados. La fila de Errores «`--mode auto` sin `verify.e2e-smoke.command`» queda como defensa (CR-001). El archivo mide 445 líneas.
- **`description` del skill:** ya medía 572 caracteres antes de esta historia (superaba el presupuesto de 500, que es un warn). Se compactó a 492 sin perder disparadores y se le agregó `--verbose`.
- **C9 evals:** TC-027…TC-031 y TC-012 reescrito (CR-001); el manifiesto pasa a la versión 1.4.0. Las adaptaciones al runner están en `design.md` › CR-004.
- **CHANGELOG:** nueva entrada en `[Unreleased] › Added`.

## Pendientes registrados (T006, T019, T024)

- **STORY-169 (`run`):** cuando implemente el subcomando `run`, debe aceptar `--full-output` y agregar `output` a cada `Suite` lanzada (`null` a las no lanzadas). En ese momento hay que ejecutar V-3 y anotar `--full-output` en el contrato I1 (CR-003). La regla «Cómo invocar el motor» del `SKILL.md` ya exige `--full-output` en toda invocación del motor cuando hay `verbose`.
- **CR-001 aplicado a los evals:** TC-012 (STORY-125 V-6) esperaba un reporte `BLOCKED` para `--mode auto` sin `verify.e2e-smoke`, pero la guardia del Paso 1.2 ahora rechaza esa invocación (ese caso lo cubre TC-029). Se reescribió como `auto-smoke-configurado-no-ejecutable-blocked`: el comando está declarado pero no es ejecutable, así que hay pruebas configuradas, no hay rechazo, aparece la línea `▶ … → not-executable` y el reporte es `BLOCKED` (D-1, fila «declarado pero no ejecutable» de Degradación). Sigue habiendo un caso `BLOCKED` fuera del conjunto de regresión.
- **Al refinar EPIC-23 (`/epic-refine`):** anotar en STORY-125 (`design.md`/`tasks.md`) la remisión de CR-001: su fila `auto`/1 queda como defensa y su V-6 queda reemplazado. Aplicar también CR-003.
- **Ejecución manual (criterio humano, AGENTS.md):** `npm run test:eval -- epic-validate`, con atención a TC-012 y TC-027…TC-031.
- **Recorrido manual:** `/epic-validate EPIC-23 --dry-run --verbose` debe dejar `git status` sin cambios. Además, `/epic-validate <épica> --mode auto` en un `REPO_ROOT` temporal cuyo `sddf.config.yaml` no declare `verify.e2e-smoke` debe terminar con `❌ --mode auto sin pruebas configuradas: …` sin crear archivos.

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | AC-1/AC-2/AC-3 se cubren con TC-027…TC-030. Requieren la ejecución manual de `test:eval`, que este skill no evalúa; la parte del motor de AC-1 pasa en `node --test` |
| 2 | Criterios no funcionales verificados | ⚠️ | CNF-1: las pruebas del motor confirman que `--full-output` no cambia los campos de evidencia. CNF-2: TC-031 queda pendiente de ejecución manual |
| 3 | Comportamiento coincide con `design.md` | ✓ | Mensajes literales verificados (T020); ajustes de evals documentados en CR-004 |
| 4 | Sin regresiones | ✓ | `npm test` 381/381; `npm run verify:repository` aprobado |
| 5 | Convenciones de `constitution.md` | ✓ | Mismo estilo del motor (CommonJS, JSDoc en español, sin dependencias) |
| 6 | Sin código comentado ni `TODO` | ✓ | Revisado en el diff |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | `sinVolatiles` descarta `durationSeconds`/`output` a propósito con destructuring de resto |
| 8 | Linter y formateador sin errores | ✓ | El gate `verify:repository` (el mismo de `quality.yml`) aprueba |
| 9 | Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| 10 | `skill-master` para skills nuevos | ✓ | No aplica: no se crea ningún skill |
| 11 | Ruta de skill nuevo en `files` de `package.json` | ✓ | No aplica: skill existente |
| 12 | [[gr-ai-security-checklist]] | ✓ | `output` es un dato no confiable: va en un bloque `text` con valla más larga que su secuencia de comillas invertidas más larga y nunca se sigue como instrucción |
| 13 | [[gr-code-security-checklist]] | ✓ | No hay superficie de ejecución nueva: `spawnSync` no cambia y `output` no se escribe en ningún archivo |
| 14 | [[gr-skill-creation-checklist]] | ✓ | `description` de 492 caracteres (≤ 500) y `SKILL.md` de 445 líneas (< 500), en UTF-8 sin BOM con LF |
| 15 | Skills críticos con `evals/evals.json` | ✓ | 31 casos; `verify:eval-inventory` OK |
| 16 | Casos de prueba ejecutados automáticamente | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement (`test:eval` es manual según AGENTS.md) |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 24/24 |
| 18 | README/docs actualizados si cambian contratos | ✓ | `SKILL.md` (Parámetros, Salida), JSDoc del motor y CHANGELOG; las guías no listan los flags del skill |
| 19 | Decisiones no previstas en `design.md` | ✓ | CR-004 |
| 20 | CHANGELOG actualizado | ✓ | `[Unreleased] › Added` |
| 21 | Build de CI pasa | ✓ | `verify:repository` aprobado en local (el mismo gate que corre `quality.yml`) |
| 22 | Sin secretos ni credenciales | ✓ | Ninguno en el diff |
| 23 | Variables de entorno documentadas | ✓ | No aplica: no se agregan variables |
| 24 | Despliegue reversible | ✓ | Cambios aditivos en Markdown/JS, reversibles con git |

**Resumen:** 21/24 criterios ✓ (3 ⚠️, 0 ❌)

---

## Nota sobre los Tests Generados

Las pruebas del motor ya se ejecutaron (17/17), y también `npm test` y `verify:repository`. Los evals TC-027…TC-031 y la revisión de TC-012 deben ejecutarse manualmente con `npm run test:eval -- epic-validate`.
