---
type: implement-report
id: BUG-002
slug: BUG-002-implement-report
title: "Implement Report: story-implement lee los comandos de prueba de verify y registra los tipos no ejecutados"
story: BUG-002
created: 2026-11-08
updated: 2026-11-08
---

# Reporte de implementación: BUG-002 — story-implement lee los comandos de prueba de `verify`

## Resumen

| Métrica | Valor |
|---|---|
| Work item | BUG-002 |
| Tareas del plan | 11 |
| Tareas completadas | 10 (n.º 1–10) |
| Tareas pendientes | 1 (n.º 11, verificación manual — criterio humano por cuota) |
| Fecha de implementación | 2026-11-08 |
| Commit | `1c00730b fix: BUG-002` |

**Estado:** ✅ Implementación completa y verificada de forma determinista (gates re-ejecutados hoy). ⏸ Verificación manual (tarea 11) pendiente de ejecución humana por cuota de LLM (principio 14 de la constitución).

El defecto era que `skills/story-implement/SKILL.md` leía `defaults.{type}.command` en las tres fases del ciclo TDD, una clave que no existe desde `805a17af` (2026-06-07), de modo que ninguna prueba se ejecutaba y aun así la historia pasaba a `IMPLEMENT/DONE`. La corrección implementa las decisiones D-1 a D-8 del plan: una subsección única de resolución del comando desde `verify.{type}`, clasificación de tipos no ejecutados con `[WARN]` y motivo, rama explícita de no-regresión en REFACTOR, informe y Pause-2 con el resultado real, 7 evals nuevos (TC-038–TC-044) + migración de TC-004 y TC-006, y la guarda C1 en `scripts/verify-config-contract.js`.

## Tabla de estado por tarea

Fuente: `tasks.md`.

| # | Tarea | Estado | Evidencia verificada en el filesystem (2026-11-08) |
|---|---|---|---|
| 1 | `plan.md` y `tasks.md` | ✅ DONE | ambos archivos presentes en el directorio del bug |
| 2 | Evals TC-038–TC-044 y migración de TC-004/TC-006 | ✅ DONE | `evals.json` con 44 casos; los 7 nuevos existen; TC-004 y TC-006 declaran el comando **solo** en `verify` (`defaults` solo con `delivery-model`); los nuevos casos también (TC-039 es el caso legada intencional) |
| 3 | Subsección `Resolución del comando de prueba` | ✅ DONE | `SKILL.md:529`; tabla D-2, regla de clave legada (D-4), `[WARN]` (D-3) y `$TEST_RUNS` (D-3) en el cuerpo de la subsección |
| 4 | Paso 5 (RED) usa la subsección | ✅ DONE | invocación en `SKILL.md:573` |
| 5 | Paso 9b (GREEN), casillas y Pause-2 | ✅ DONE | invocación en `SKILL.md:870` |
| 6 | No-regresión de REFACTOR con rama explícita | ✅ DONE | invocación en `SKILL.md:992`; `$REFACTOR_VERIFICADO` en el cuerpo |
| 7 | Informe, 11a y tabla de errores | ✅ DONE | plantilla 11b (`SKILL.md:1027` en adelante) y filas de error (`SKILL.md:1222-1223`); sin sección «Pruebas ejecutadas» |
| 8 | Pruebas de la guarda C1 | ✅ DONE | `test/maintenance-contracts.test.js:146-190` (5 casos sobre directorios temporales) |
| 9 | `verifySkillConfigReferences` | ✅ DONE | `scripts/verify-config-contract.js:134` (definición), `:179` (integración en `verifyConfigContract`), `:196` (exportada) |
| 10 | Verificación determinista | ✅ DONE | re-ejecutada para este reporte (tabla siguiente) |
| 11 | Verificación manual (evals seleccionados + `/story-implement` real) | ⏸ PENDIENTE | 3 sub-items sin marcar en `tasks.md`; decisión humana por cuota |

## Verificación determinista (re-ejecutada para este reporte, 2026-11-08)

| # | Comprobación del plan | Resultado |
|---|---|---|
| 1 | `npm test` | ✅ 512/512 pass, 0 fail (incluye los 5 casos nuevos de la guarda C1) |
| 2 | `node scripts/verify-config-contract.js` | ✅ `[OK] Contrato de configuración válido.` |
| 3 | `grep -rn "defaults.{type}" skills/` | ✅ Las 3 lecturas originales (antiguas líneas 533, 834 y 956) desaparecieron. Quedan 2 citas intencionales del literal del aviso D-4: `SKILL.md:552` (mensaje `[WARN]`) y `SKILL.md:1223` (fila de la tabla de errores) — ver Observación 1 |
| 4 | `npm run verify:layout` | ✅ `[OK]` en 43 skills; `SDDF-FIXED-LAYOUT: v1` intacto en `SKILL.md` |
| 5 | `npm run verify:repository` | ✅ `[OK] Verificación determinista del repositorio aprobada` (incluye inventario de evals y contrato de configuración; smoke del tarball en 4 runtimes) |
| 6 | Sin U+FEFF literal | ✅ 0 ocurrencias en `SKILL.md`, `evals.json` y `verify-config-contract.js` |
| 7 | `graphify update .` | ✅ `graphify-out/graph.json` actualizado el 2026-11-08 13:53 |

## Verificación manual pendiente (tarea 11, criterio humano por cuota)

| # | Sub-item | Estado |
|---|---|---|
| 11.1 | `npm run test:eval -- story-implement --only TC-004,TC-006,TC-038,TC-039,TC-040,TC-041,TC-042,TC-043,TC-044` | ⏸ sin ejecutar |
| 11.2 | `/story-implement` sobre una historia de prueba con `verify.unit.required: true`: `implement-report.md` muestra los exit codes de RED, GREEN y REFACTOR sin que el agente ejecute nada por su cuenta | ⏸ sin ejecutar |
| 11.3 | Evidencias anotadas | ⏸ pendiente de 11.1 y 11.2 |

Estos 3 sub-items son el único trabajo restante del plan. No son defectos: la decisión D-8 y el principio 14 reservan la ejecución de evals al criterio humano.

## Evidencias del cambio (commit `1c00730b`)

| Archivo | Δ |
|---|---|
| `skills/story-implement/evals/evals.json` | +556 líneas (TC-038–TC-044, migración de TC-004 y TC-006) |
| `skills/story-implement/SKILL.md` | +97 líneas (subsección D-1/D-2/D-4, pasos 5/9b/REFACTOR, Pause-2, informe, errores) |
| `scripts/verify-config-contract.js` | +92 líneas (`verifySkillConfigReferences`, C1) |
| `test/maintenance-contracts.test.js` | +63 líneas (5 casos de la guarda C1) |
| `specs/flow/BUG-002-.../tasks.md` | checklist del plan |

Sin cambios, conforme al plan: `sddf.config.yaml`, plantilla y ejemplo de `sddf-init`, `skills/story-verify/` y `skills/story-implement/README.md`.

## Observaciones

1. **Verificación 3 del plan vs. realidad:** el plan decía «`grep -rn "defaults.{type}" skills/` → sin resultados». La corrección es correcta, pero el literal `defaults.{type}.command` aparece de forma intencional en dos sitios nuevos (el mensaje `[WARN]` de D-4 en `SKILL.md:552` y su fila en la tabla de errores en `SKILL.md:1223`). El criterio efectivo —ninguna *lectura* de la clave legada— se cumple: las tres lecturas originales no existen.
2. **Destino de las evidencias de la tarea 11:** `tasks.md` dice «Evidencias anotadas en `implement-report.md`» y el paso 8 de la sección Verificación del plan dice «Las evidencias se anotan en `bug.md`». Este reporte sirve de ancla para ambas lecturas: al completarse 11.1–11.3, las evidencias deben reflejarse también en `bug.md` (estado del work item) antes de cerrar.
3. **`bug.md` aún en `PLAN`/`IN-PROGRESS`:** con la tarea 11 pendiente, el estado del bug es coherente; no se ha mutado.
4. **Riesgo de coordinación (recordado):** EPIC-029 (`TODO`) tocará el mismo `SKILL.md` y `evals.json`; conviene integrar BUG-02 antes de que EPIC-029 pase a `IN-PROGRESS` (sección Riesgos del plan).

## Verificación manual

npm run test:eval -- story-implement --only TC-004 --eval-runner opencode --timeout 3600 --report
npm run test:eval -- story-implement --only TC-006 --eval-runner opencode --timeout 3600 --report
npm run test:eval -- story-implement --only TC-038 --eval-runner opencode --timeout 3600 --report
npm run test:eval -- story-implement --only TC-039 --eval-runner opencode --timeout 3600 --report
npm run test:eval -- story-implement --only TC-040 --eval-runner opencode --timeout 3600 --report
npm run test:eval -- story-implement --only TC-041 --eval-runner opencode --timeout 3600 --report

| ID | Nombre | Tipo | Threshold | Estado | Notas |
|---|---|---|---|---|---|
| TC-004 | happy-path-green-refactor-exitoso-story-actualizada-cycle-status-escrito | happy-path | 0.95 | ✅ PASS | — |
| TC-006 | refactor-introduce-regresiones-warning-con-lista-story-sin-cambio | error-flow | 1 | ✅ PASS | — |
| TC-038 | BUG-002: comando solo en verify.unit (required true) se resuelve y ejecuta en las tres fases | happy-path | 0.95 | ✅ PASS | — |
| TC-039 | BUG-002: clave legada defaults.unit.command → [WARN] de migración y tipo no ejecutado | alternative-flow | 1 | ✅ PASS | — |
| TC-040 | BUG-002: verify.eval required false → no ejecuta y casillas EV sin marcar | alternative-flow | 1 | ✅ PASS | — |
| TC-041 | BUG-002: verify.e2e command manual (required true) → no ejecutado | alternative-flow | 1 | ✅ PASS | — |

## Veredicto

**Implementación completa (10/11 tareas) y verificada deterministicamente.** Queda la verificación manual de la tarea 11 (una ejecución real de `/story-implement`), a criterio humano por cuota. Al completarla y anotar las evidencias, el work item puede pasar de `PLAN` a su estado de cierre.
