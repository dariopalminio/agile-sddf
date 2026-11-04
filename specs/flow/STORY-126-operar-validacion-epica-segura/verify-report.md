---
type: verify-report
id: STORY-126
slug: STORY-126-verify-report
title: "Verify Report: Operar la validación de épicas de manera segura"
story: STORY-126
verdict: APPROVED
date: 2026-11-03
mode: config-driven
dod_version: 2026-09-24
created: 2026-11-03
updated: 2026-11-03
---

# Test Report: Operar la validación de épicas de manera segura

## Veredicto

**Veredicto:** `APPROVED` — Sin criterios DoD VERIFY fallidos ni defectos CRITICAL o HIGH abiertos (4/5 criterios ✓).

## Summary

| Metric | Value |
|--------|-------|
| Story | STORY-126 |
| Date | 2026-11-03 |
| Mode | config-driven |
| DoD Version | 2026-09-24 |
| Total Tests | 473 |
| Passed | 473 |
| Failed | 0 |
| Skipped | 0 |
| Coverage | N/A |

Notas de ejecución (modo config-driven, `sddf.config.yaml › verify`):

- `unit` — `npm run test:installer` (`node --test test/install.test.js`): 20/20 pasados, exit 0.
- `integration` — `node scripts/verify-fixed-layout.js`: `[OK] Contrato de layout fijo verificado en 43 skill(s)`, exit 0.
- Suite completa (DoD criterio 2) — `npm test` (`node --test test`): 473/473 pasados, exit 0. Incluye `test/install.test.js`; por eso `Total Tests` no suma los 20 casos del subset para no contarlos dos veces.
- Demás tipos de `verify` (`component`, `contract`, `e2e*`, `performance`, `eval`): `required: false`, no ejecutados.
- `delivery-model: batch`; `verify.e2e-regression` está en `required: false`, por lo que no se añade a la lista de ejecución.

## Test Scope

- [x] Unit tests
- [x] Integration tests
- [ ] E2E tests
- [ ] Performance tests
- [ ] Security tests
- [x] Evals: `npm run test:eval -- epic-validate` TC-T014…TC-022

## Findings

> Sin defectos encontrados en esta ejecución.

## Coverage Analysis

(No disponible — el runner `node --test` no reporta cobertura en esta ejecución)

## DoD VERIFY Criteria

| # | Criterio | Estado | Evidencia |
|---|----------|--------|-----------|
| 1 | Todas las pruebas `required: true` de `sddf.config.yaml › verify` pasan (exit 0) | ✓ | `unit` `npm run test:installer`: 20/20 pasados, exit 0 · `integration` `node scripts/verify-fixed-layout.js`: `[OK]`, exit 0 |
| 2 | La suite completa `npm test` pasa sin fallos | ✓ | `npm test` (`node --test test`): 473/473 pasados, exit 0 (incluye `test/install.test.js`) |
| 3 | Si la historia modifica un skill con `evals/evals.json`, `npm run test:eval -- <skill>` pasa; un fallo solo se acepta como flaky si pasa al reejecutarlo | ⚠️ | La historia modifica el skill `epic-validate` (con `evals/evals.json`); el DoD y AGENTS.md reservan su ejecución al criterio humano para economizar cuota: no ejecutada en esta corrida automática |
| 4 | Ningún caso de `testcases.md` queda en `[!]` y cada `[ ]` restante cita en `verify-report.md` la evidencia que lo cubre | ✓ | `testcases.md` no existe en el directorio de la historia (`code-review-report.md:30`: «no encontrado»); por tanto ningún caso queda en `[!]` |
| 5 | Sin defectos CRITICAL o HIGH abiertos en `verify-report.md` | ✓ | Esta ejecución: 0 findings CRITICAL, 0 findings HIGH |

**Resumen DoD**: 4/5 criterios ✓

## Recommendations

1. (Recomendado) Ejecutar manualmente `npm run test:eval -- epic-validate` a criterio humano antes de avanzar a ACCEPTANCE; es la única evidencia pendiente del DoD (criterio 3, marcado ⚠️).
2. (Opcional) Adoptar los hallazgos LOW de `code-review-report.md`: añadir en `design.md` la nota del gateway de STORY-127 (CS-7) y un eval `--dry-run` con la épica en `VALIDATE`.

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

## Historial de Ejecuciones Anteriores

**Precondiciones:**
- LLM Model: Qwen3.8-27B-Uncensored-Q4_K_M.gguf
- ctx-size 131072 
- spec-type draft-mtp 
- spec-draft-n-max 2
- opencode con límite "context": 131072
- opencode con límite "output": 32768

npm run test:eval -- epic-validate --only TC-014, TC-015, TC-016, TC-017, TC-018, TC-019, TC-020, TC-021, TC-022 --eval-runner opencode --report

En ejecuciones individuales:

npm run test:eval -- epic-validate --only TC-014 --eval-runner opencode --report

**Eval Report: epic-validate**

**Fecha:** 2026-11-03 | **Total:** 9 | ✅ Passed: 9 | ❌ Failed: 0 | **Pass rate:** 100%
**Ejecutor:** opencode

| ID | Nombre | Tipo | Threshold | Estado | Notas |
|---|---|---|---|---|---|
| TC-014 | modo-auto-aprobado-resultado-exito | happy-path | 1 | ✅ PASS | — |
| TC-015 | modo-manual-bloqueado-resultado-fallo | error-handling | 1 | ✅ PASS | — |
| TC-016 | dry-run-previsualiza-sin-escribir | happy-path | 1 | ✅ PASS | — |
| TC-017 | modo-no-reconocido-sin-efectos | fail-fast | 0.95 | ✅ PASS | — |
| TC-018 | repeticion-conserva-created-y-orden | regression | 1 | ✅ PASS | — |
| TC-019 | dry-run-antes-de-mode-manual | happy-path | 0.95 | ✅ PASS | — |
| TC-020 | mode-manual-antes-de-dry-run | happy-path | 0.95 | ✅ PASS | — |
| TC-021 | mode-sin-valor | fail-fast | 0.95 | ✅ PASS | — |
| TC-022 | mode-repetido | fail-fast | 0.95 | ✅ PASS | — |

✅ Todos los 9 casos pasaron. El skill está listo.