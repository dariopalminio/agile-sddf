---
type: verify-report
id: STORY-186
slug: STORY-186-verify-report
title: "Verify Report: ADR de workflows sin estados buffer"
story: STORY-186
verdict: APPROVED
date: 2026-11-14
mode: config-driven
dod_version: 2026-09-24
created: 2026-11-14
updated: 2026-11-14
---

# Test Report: ADR de workflows sin estados buffer

## Veredicto

**Veredicto:** `APPROVED` — Sin criterios DoD VERIFY fallidos ni defectos CRITICAL o HIGH abiertos (4/5 criterios ✓).

## Summary

| Metric | Value |
|--------|-------|
| Story | STORY-186 |
| Date | 2026-11-14 |
| Mode | config-driven |
| DoD Version | 2026-09-24 |
| Total Tests | 24 |
| Passed | 24 |
| Failed | 0 |
| Skipped | 0 |
| Coverage | N/A |

Los contadores suman las pruebas `required: true` de `sddf.config.yaml › verify` (delivery model `batch`; `e2e-regression` no es `required`):

| Tipo | Comando | Resultado |
|------|---------|-----------|
| unit | `npm run test:installer` | 23/23 pasan, exit 0 |
| integration | `node scripts/verify-fixed-layout.js` | 1/1: contrato de layout fijo verificado en 43 skills, 0 pendientes; exit 0 |

La suite completa `npm test`, que exige el DoD VERIFY, se ejecutó aparte: 583/584 pasan y falla `S097-UT-011`. Ver `## Findings`.

## Test Scope

- [x] Unit tests
- [x] Integration tests
- [ ] E2E tests
- [ ] Performance tests
- [ ] Security tests

Además, se comprobaron sobre los archivos los criterios de aceptación de la historia (`kind: chore`, documental):

| Criterio | Comprobación | Resultado |
|----------|--------------|-----------|
| AC-1 | Frontmatter de ADR-0022 | ✓ `status: ACCEPTED`, `date: 2026-11-14`, `supersedes: [ADR-0006, ADR-0008]` |
| AC-1 | `diff` de los encabezados `## ` de `docs/adr/adr-template.md` y ADR-0022 | ✓ idénticos |
| AC-1 | Los dos workflows literales en ADR-0022 | ✓ 1 coincidencia de cada uno |
| AC-1 / CNF-3 | `git diff HEAD~1` de ADR-0006 y ADR-0008 | ✓ solo cambian `status: SUPERSEDED` y `superseded-by: ADR-0022` |
| CNF-3 | `git diff --quiet HEAD~1` de ADR-0003 | ✓ sin cambios |
| AC-1 | `docs/adr/README.md` | ✓ ADR-0022 con el mismo título, `ACCEPTED` y `2026-11-14`; ADR-0006 y ADR-0008 como `SUPERSEDED → ADR-0022` |
| AC-2 | Tabla de gates de `## Decisión` | ✓ 3 filas con `based-on`, dimensiones `DoD-CODE-REVIEW` (o la del revisor), `verify-defect` y `requirements-coverage`; destino `IMPLEMENT/TODO`; regla de `round` continua |
| AC-3 | Regla del valor legado | ✓ por `implement-report.md`; ventana de 6.0.0 a 7.0.0; «no define ningún estado ni substatus de rework» |
| Encoding | Primeros bytes de ADR-0022 | ✓ sin BOM |

## Findings

### [MEDIUM] S097-UT-011 falla en la suite completa por tiempo (preexistente)
- **Location**: `test/memory-system.test.js` — `S097-UT-011 check: docs/ de este repositorio en menos de 5 s (V-10)`
- **Steps to Reproduce**:
  1. Ejecutar `npm test` en el repositorio completo.
  2. Observar el tiempo de `S097-UT-011`.
- **Expected**: `memory-system check` sobre `docs/` termina en menos de 5 s y la suite pasa sin fallos.
- **Actual**: tarda 7,9 s en la suite completa (583/584). Aislada (`node --test --test-name-pattern="S097-UT-011" test/memory-system.test.js`) pasa en 1,8 s.
- **Impact**: `npm test` y `npm run verify:repository`, cuyo primer paso son las pruebas deterministas, no salen en verde en esta máquina. No es una regresión de STORY-186: `implement-report.md` registra el mismo fallo en la línea base de T001, antes de cualquier cambio, y `code-review-report.md` lo clasifica como LOW preexistente.
- **Fix**: fuera del alcance de esta historia. Registrar un bug para que el umbral de `S097-UT-011` no dependa de la carga de la suite (umbral relativo, ejecución aislada o tolerancia configurable).

## Coverage Analysis

No disponible: la historia solo cambia documentación (ADR-0022, ADR-0006, ADR-0008, `docs/adr/README.md`, `docs/index.md`) y ningún runner configurado reporta cobertura.

## DoD VERIFY Criteria

| # | Criterio | Estado | Evidencia |
|---|----------|--------|-----------|
| 1 | Todas las pruebas `required: true` de `sddf.config.yaml › verify` pasan (exit 0) | ✓ | `unit` (`npm run test:installer`) 23/23, exit 0; `integration` (`node scripts/verify-fixed-layout.js`) exit 0 |
| 2 | La suite completa `npm test` pasa sin fallos | ⚠️ | 583/584: falla solo `S097-UT-011` (7,9 s, umbral 5 s), preexistente y ajena a la historia; pasa al reejecutarla aislada (1,8 s). Decisión humana del 2026-11-14: tratarlo como fallo preexistente de tiempo, no como incumplimiento de esta historia (ver finding MEDIUM) |
| 3 | Si la historia modifica un skill con `evals/evals.json`, `npm run test:eval -- <skill>` pasa | ✓ | No aplica: la historia no modifica ningún skill |
| 4 | Ningún caso de `testcases.md` queda en `[!]` y cada `[ ]` restante cita en `verify-report.md` la evidencia que lo cubre | ✓ | No aplica: la historia no tiene `testcases.md`; se verificó con los contratos V-1 a V-11 de `design.md` y las comprobaciones de `## Test Scope` |
| 5 | Sin defectos CRITICAL o HIGH abiertos en `verify-report.md` | ✓ | Un único finding, de severidad MEDIUM |

**Resumen DoD**: 4/5 criterios ✓

## Recommendations

1. Registrar un bug para `S097-UT-011`: su umbral de 5 s falla de forma consistente bajo la carga de la suite completa y bloquea `npm run verify:repository` para todas las historias, no solo esta.
2. Continuar con `/story-acceptance STORY-186`.
3. Resolver, en los `design.md` de STORY-189 y STORY-190, los huecos heredados que registra `code-review-report.md` (hallazgos LOW).

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

(sin ejecuciones anteriores)
