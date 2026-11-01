---
type: verify-report
id: STORY-166
slug: STORY-166-verify-report
title: "Verify Report: Veredicto de epic-format-validation"
story: STORY-166
verdict: NEEDS-CHANGES
date: 2026-11-01
mode: config-driven
dod_version: 2026-09-24
created: 2026-11-01
updated: 2026-11-01
---

# Test Report: Veredicto de epic-format-validation

## Veredicto

**Veredicto:** `NEEDS-CHANGES` — Corrección implementada y gates deterministas aprobados; pendiente revalidación manual de TC-016 y de la suite completa del skill. La ausencia de `testcases.md` sigue pendiente.

## Summary

| Metric | Value |
|--------|-------|
| Story | STORY-166 |
| Date | 2026-11-01 |
| Mode | config-driven |
| DoD Version | 2026-09-24 |
| Total Tests | 456 |
| Passed | 456 |
| Failed | 0 |
| Skipped | 0 |
| Coverage | N/A |

Estos 456 resultados corresponden solo a las pruebas deterministas de `npm run verify:repository`
tras la corrección. El gate completo también aprobó layout, contratos, enlaces, seguridad de
workflow, release, empaquetado y smoke del tarball. Las ejecuciones focalizadas (58 del runner,
67 del runner más contrato y 20 del instalador) son subconjuntos y no se suman al total.
Los evals manuales se registran por separado; este resultado no demuestra un PASS de TC-016.

## Test Scope

- [x] Unit tests (UT)
- [x] Integration tests (IT)
- [ ] E2E tests (E2E)
- [ ] Performance tests (PT)
- [ ] Security tests (SEC)
- [ ] Eval de skill (EV), incluyendo TC-001, TC-002 y TC-016: npm run test:eval -- epic-format-validation --only TC-001,TC-002,TC-016 --eval-runner opencode --report
    - [x] TC-001: PASS histórico en `report-20261101.md`; pendiente repetir tras la corrección.
    - [x] TC-002: PASS histórico en `report-20261101.md`; pendiente repetir tras la corrección.
    - [ ] TC-016: último resultado manual FAIL; pendiente repetir tras la corrección con `--report`.

## Findings

| ID | Severidad | Hallazgo | Estado |
|---|---|---|---|
| F-1 | MEDIUM | TC-016 omitió el resumen de formato en `report-20261101.md`; la ejecución posterior comunicada reportó `created` como ausente, tres defectos, línea 10 y ubicación tras Alcance, aunque el fixture contiene `created`, la línea inválida es la 23 y la sección faltante sigue a Historias. | Corrección de lectura y trazabilidad implementada; pendiente confirmación manual con OpenCode. |

Las pruebas con runner simulado confirman la copia íntegra de las fuentes y la calificación de
archivos, no el cumplimiento del skill por el modelo. La lectura parcial o de fuentes distintas
es una hipótesis; los eventos completos de la reejecución deben comprobarla.

## Coverage Analysis

No se emitió cobertura en los runners ejecutados.

## DoD VERIFY Criteria

| # | Criterio | Estado | Evidencia |
|---|----------|--------|-----------|
| 1 | Todas las pruebas `required: true` de `sddf.config.yaml › verify` pasan (exit 0) | ✓ | `npm run test:installer` (20/20) aprobó; `node scripts/verify-fixed-layout.js` aprobó dentro de `npm run verify:repository`. |
| 2 | La suite completa `npm test` pasa sin fallos | ✓ | `npm run verify:repository` ejecutó el mismo comando de `npm test`, `node --test test`: 456/456, exit 0. |
| 3 | Si la historia modifica un skill con `evals/evals.json`, `npm run test:eval -- <skill>` pasa; un fallo solo se acepta como flaky si pasa al reejecutarlo (solo son ejecutados por humano manualmente no automaticamente) | ⚠️ | Hay ejecuciones manuales previas: TC-001 y TC-002 PASS; TC-016 FAIL. Tras la corrección no se ejecutaron evals; pendiente revalidación humana de TC-016 y de la suite completa. No se clasifica el fallo como flaky. |
| 4 | Ningún caso de `testcases.md` queda en `[!]` y cada `[ ]` restante cita en `verify-report.md` la evidencia que lo cubre | ⚠️ | No existe `testcases.md` para STORY-166; no hay casos canónicos que evaluar ni evidencia que vincular. |
| 5 | Sin defectos CRITICAL o HIGH abiertos en `verify-report.md` | ✓ | F-1 es MEDIUM; los gates deterministas no detectaron nuevos fallos. El code review previo declara severidad máxima LOW y no sustituye la revisión de esta corrección. |

**Resumen DoD**: 3/5 criterios ✓

## Recommendations

- Una persona debe ejecutar primero `npm run test:eval -- epic-format-validation --only TC-016 --eval-runner opencode --report`; comprobar el reporte en disco y los eventos completos, no solo los primeros 300 caracteres.
- Tras PASS, repetir TC-001/TC-002/TC-016 y la suite completa con OpenCode y `--report` antes de ACCEPTANCE. TC-016 debe mostrar `Archivo validado`, ambos bloques de diagnóstico, `defects: 2`, `línea 23 (## Historias)` y `tras ## Historias`, sin modificar las fuentes.
- Generar `testcases.md` para que futuras verificaciones puedan trazar evidencia por caso.

## Sign-off

- [x] All critical issues addressed
- [ ] Coverage meets threshold (80%)
- [ ] Performance meets SLA

## Severity Definitions

| Severity | Criteria |
|----------|----------|
| **CRITICAL** | Security vulnerability, data loss, system crash |
| **HIGH** | Major functionality broken, severe performance |
| **MEDIUM** | Feature partially working, workaround exists |
| **LOW** | Minor issue, cosmetic, edge case |

## Historial de Ejecuciones

### Corrección y validación determinista — 2026-11-01

Se conservan los resultados manuales anteriores a continuación y en `report-20261101.md`.
Esta ejecución no invocó modelos ni modificó el manifest de evals, sus fixtures o los destinos instalados.

| Comando | Resultado | Alcance |
|---|---|---|
| `npm run test:eval:runner` antes del cambio del prompt | RED: 57/58; falló solo la nueva exigencia de lectura completa. | La copia del fixture y las regresiones de TC-016 pasaron. |
| `npm run test:eval:runner` tras el cambio del prompt | PASS: 58/58. | Lectura completa exigida, sin filtración de expectativas; permisos y aislamiento preservados. |
| `node --test test/run-evals.test.js test/verify-validation-contract.test.js` tras el cambio del skill | PASS: 67/67. | Runner y contrato del skill. |
| `npm run verify:repository` | PASS: 456/456 pruebas y todos los gates adicionales. | Suite completa, sintaxis, layout, contratos, enlaces, cadena de suministro, workflow de seguridad, release y smoke del tarball en 4 runtimes. |
| `npm run test:installer` | PASS: 20/20. | Comando obligatorio de VERIFY. |
| `graphify update .` | Completado con advertencias. | Extracción AST sin LLM; advertencias de dos nodos sin `source_file` y archivos sin símbolos, fuera del alcance del fix. |

El prompt exige leer las fuentes del sandbox hasta EOF y conservar las líneas físicas. El skill
contrasta campos faltantes, ubicaciones, conteo y consola con las fuentes completas. Las regresiones
rechazan consola sin `Archivo validado`, tres defectos, línea 10 y ubicación tras Alcance.
No hay evidencia de PASS del eval real después de estos cambios; `NEEDS-CHANGES` se conserva.

### TC-001 ❌ FAIL

npm run test:eval -- epic-format-validation --only TC-001 --eval-runner opencode

> agile-sddf@5.0.0 test:eval
> node scripts/run-evals.js epic-format-validation --only TC-001 --eval-runner opencode

[INFO] Skills a evaluar: epic-format-validation
[INFO] Plan de selección: 1 caso(s) en 1 skill(s)
[INFO]   epic-format-validation: 1 caso(s)
[INFO] Ejecutor de eval: opencode · modelo: predeterminado del runner · concurrencia: 4 · timeout: 900s

[INFO] 1 caso(s) encontrados en epic-format-validation/evals/evals.json
[TC-001] ejecutando…
[TC-001] ❌ FAIL (21s)

# Eval Report: epic-format-validation

**Fecha:** 2026-11-01 | **Total:** 1 | ✅ Passed: 0 | ❌ Failed: 1 | **Pass rate:** 0%
**Ejecutor:** opencode

| ID | Nombre | Tipo | Threshold | Estado | Notas |
|---|---|---|---|---|---|
| TC-001 | épica-completa-resultado-approved | happy-path | 0.95 | ❌ FAIL | missing: "APPROVED", "cumple la estructura" |

#### ❌ TC-001 — épica-completa-resultado-approved

**Missing contains:** "APPROVED", "cumple la estructura"
**Violated not_contains:** —
**Evidencia (primeros 300 chars):**
> === CONSOLE ===
> ❌ Épica no encontrada: specs/flow/EPIC-01-mvp/epic.md
>    Ruta buscada: specs/flow/EPIC-01-mvp/epic.md
>    Ruta buscada: specs/flow/EPIC-*<término>*/epic.md
>
> Verifica que el nombre o ruta sea correcto e inténtalo de nuevo.
>


---

### TC-016 ❌ FAIL

npm run test:eval -- epic-format-validation --only TC-016 --eval-runner opencode

> agile-sddf@5.0.0 test:eval
> node scripts/run-evals.js epic-format-validation --only TC-016 --eval-runner opencode

[INFO] Skills a evaluar: epic-format-validation
[INFO] Plan de selección: 1 caso(s) en 1 skill(s)
[INFO]   epic-format-validation: 1 caso(s)
[INFO] Ejecutor de eval: opencode · modelo: predeterminado del runner · concurrencia: 4 · timeout: 900s

[INFO] 1 caso(s) encontrados en epic-format-validation/evals/evals.json
[TC-016] ejecutando…
[TC-016] ❌ FAIL (61s)

# Eval Report: epic-format-validation

**Fecha:** 2026-11-01 | **Total:** 1 | ✅ Passed: 0 | ❌ Failed: 1 | **Pass rate:** 0%
**Ejecutor:** opencode

| ID | Nombre | Tipo | Threshold | Estado | Notas |
|---|---|---|---|---|---|
| TC-016 | épica-sin-criterios-de-salida-y-línea-inválida-needs-refinement | fail-fast | 1 | ❌ FAIL | missing: "NEEDS-REFINEMENT", "Criterios de salida", "Formato inválido:", "- [ ] Exportar CSV: descarga del historial", "epic-format-validation-report.md" |

#### ❌ TC-016 — épica-sin-criterios-de-salida-y-línea-inválida-needs-refinement

**Missing contains:** "NEEDS-REFINEMENT", "Criterios de salida", "Formato inválido:", "- [ ] Exportar CSV: descarga del historial", "epic-format-validation-report.md"
**Violated not_contains:** —
**Evidencia (primeros 300 chars):**
> === CONSOLE ===
> ❌ Épica no encontrada: specs/flow/EPIC-05-pagos/epic.md
>    Ruta buscada: specs/flow/EPIC-05-pagos/epic.md
>
> Verifica que el nombre o ruta sea correcto e inténtalo de nuevo.
>

---
⚠️ Pass rate: 0%. Considera ejecutar /skill-master build para mejorar el skill.

### Resultados de la ejecución completa
    
> agile-sddf@5.0.0 test:eval
> node scripts/run-evals.js epic-format-validation --eval-runner opencode

[INFO] Skills a evaluar: epic-format-validation
[INFO] Plan de selección: 16 caso(s) en 1 skill(s)
[INFO]   epic-format-validation: 16 caso(s)
[INFO] Ejecutor de eval: opencode · modelo: predeterminado del runner · concurrencia: 4 · timeout: 900s

[INFO] 16 caso(s) encontrados en epic-format-validation/evals/evals.json
[TC-001] ejecutando…
[TC-002] ejecutando…
[TC-003] ejecutando…
[TC-004] ejecutando…
[TC-002] ✅ PASS (79s)
[TC-005] ejecutando…
[TC-001] ❌ FAIL (97s)
[TC-006] ejecutando…
[TC-003] ❌ FAIL (110s)
[TC-007] ejecutando…
[TC-004] ❌ FAIL (134s)
[TC-008] ejecutando…
[TC-005] ❌ FAIL (166s)
[TC-009] ejecutando…
[TC-008] ❌ FAIL (192s)
[TC-010] ejecutando…
[TC-009] ❌ FAIL (244s)
[TC-011] ejecutando…
[TC-007] ❌ FAIL (442s)
[TC-012] ejecutando…
[TC-011] ❌ FAIL (170s)
[TC-013] ejecutando…
[TC-012] ❌ FAIL (161s)
[TC-014] ejecutando…
[TC-014] ❌ FAIL (119s)
[TC-015] ejecutando…
[TC-015] ✅ PASS (105s)
[TC-016] ejecutando…
[TC-006] ❌ ERROR — opencode timeout tras 900s
^C