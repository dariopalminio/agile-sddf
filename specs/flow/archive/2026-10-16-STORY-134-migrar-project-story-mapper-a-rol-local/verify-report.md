---
type: verify-report
id: STORY-134
slug: STORY-134-verify-report
title: "Verify Report: Migrar project-story-mapper a rol local"
story: STORY-134
date: 2026-10-16
mode: manual
dod_version: 2026-09-24
created: 2026-10-16
updated: 2026-10-16
---

# Test Report: Migrar project-story-mapper a rol local

**Date**: 2026-10-16
**Story**: STORY-134
**Mode**: manual (forzado con `--mode manual`; las pruebas `required: true` de `sddf.config.yaml` se ejecutaron igualmente como evidencia del DoD)
**DoD Version**: 2026-09-24

## Summary

| Metric | Value |
|--------|-------|
| Total Tests | 271 |
| Passed | 270 |
| Failed | 1 |
| Skipped | 0 |
| Coverage | N/A |

Desglose:

| Origen | Comando / fuente | Resultado | Exit |
|---|---|---|---|
| `verify.unit` (`required: true`) | `npm run test:installer` | 11/11 pass | 0 |
| `verify.integration` (`required: true`) | `node scripts/audit-root-resolution.js` | Contrato verificado en 34 skills fuente | 0 |
| Suite completa | `npm test` | 251/251 pass | 0 |
| Escenarios Gherkin (manual) | QA en sesión, `qa-output.json` | AC-1 PASS · AC-2 PASS | — |
| Evals del skill (humano) | `npm run test:eval -- project-story-mapping` | 7/8 pass; ❌ TC-007 (`.tmp/skill-test-evals/project-story-mapping/runs/TC-007.txt`) | — |

Esta ejecución usa el resultado real de los evals: 7/8, con TC-007 en rojo. Los 8 evals sí suman al total (263 deterministas + 8 evals). AC-1 y AC-2 se presentan como trazabilidad y no suman.

## Test Scope

- [x] Unit tests
- [x] Integration tests
- [ ] E2E tests
- [ ] Performance tests
- [ ] Security tests

## Findings

### [MEDIUM] TC-007 exige una salida que el contrato del Paso 3 no emite
- **Location**: `skills/project-story-mapping/SKILL.md:99` (Paso 3) · `skills/project-story-mapping/evals/evals.json` (TC-007)
- **Steps to Reproduce**:
  1. `npm run test:eval -- project-story-mapping`
  2. Abrir `.tmp/skill-test-evals/project-story-mapping/runs/TC-007.txt`
- **Expected**: la consola anterior a `=== END ===` contiene `assets/agents/story-mapper.md`, como evidencia de que la sesión lee el rol local (AC-1).
- **Actual**: `Missing contains: "assets/agents/story-mapper.md"`. La ruta aparece solo en las notas posteriores a `=== END ===`, que `gradeOutput` (`scripts/run-evals.js:648-663`) descarta. El Paso 3 manda leer el rol pero no define ningún mensaje que lo nombre, así que en el camino feliz el contrato nunca emite esa ruta. TC-008 pasa porque el error del Paso 0 (`SKILL.md:66`) sí la incluye.
- **Impact**: el comportamiento es correcto (la sesión lee el rol, sin subagente), pero AC-1 no deja evidencia observable de esa lectura y el criterio DoD #3 falla.
- **Fix**: aplicado en esta ejecución, con el patrón de `project-discovery` (commit `0a3b7fd`). Antes de leer el rol, el Paso 3 muestra `> 📋 Rol local: assets/agents/story-mapper.md — conduce esta sesión, sin subagente.`. `evals.json` no cambia. Pendiente: reejecutar los evals.

## Coverage Analysis

(No disponible en modo manual)

Trazabilidad de los criterios de aceptación:

| AC | Evidencia estática | Evidencia de ejecución | Estado |
|---|---|---|---|
| AC-1 — Sesión con rol local | `skills/project-story-mapping/assets/agents/story-mapper.md` existe; `agents/project-story-mapper.agent.md` no existe; `SKILL.md:99` lee el rol en la sesión sin lanzar subagente | ❌ TC-007 en rojo (falta evidencia observable en consola); el comportamiento lo confirma manualmente el humano | PASS (manual) · eval ❌ |
| AC-2 — Rol local ausente | `SKILL.md:64-66`: el Paso 0 falla cerrado con la ruta del rol y no escribe `product/story-map.md` | TC-008 en verde; confirmación manual del humano | PASS |
| CNF-1 — Interacción garantizada | `SKILL.md:99`: «Esta sesión conduce la entrevista… No lances un subagente para este paso» | Cubierto por AC-1 | ✓ |

## DoD VERIFY Criteria

| # | Criterio | Estado | Evidencia |
|---|----------|--------|-----------|
| 1 | Todas las pruebas `required: true` de `sddf.config.yaml › verify` pasan (exit 0) | ✓ | `unit` (`npm run test:installer`) 11/11, exit 0; `integration` (`audit-root-resolution.js`) exit 0 |
| 2 | La suite completa `npm test` pasa sin fallos | ✓ | 251/251 pass, 0 fail, exit 0 |
| 3 | Si la historia modifica un skill con `evals/evals.json`, `npm run test:eval -- <skill>` pasa | ❌ | `npm run test:eval -- project-story-mapping`: 7/8. TC-007 `Missing contains: "assets/agents/story-mapper.md"` (ver finding MEDIUM) |
| 4 | Ningún caso de `testcases.md` queda en `[!]` y cada `[ ]` restante cita evidencia | ✓ | La historia no tiene `testcases.md`, así que no hay casos en `[!]` ni `[ ]`; los AC se trazan a TC-007 y TC-008 de `evals.json` |
| 5 | Sin defectos CRITICAL o HIGH abiertos en `verify-report.md` | ✓ | 1 finding MEDIUM; 0 CRITICAL/HIGH |

**Resumen DoD**: 4/5 criterios ✓ · 1 ❌ (enforcement `error`: bloquea `VERIFY/DONE`)

## Recommendations

1. Reejecutar `npm run test:eval -- project-story-mapping --only TC-007` y luego la suite completa. Se espera 8/8 y que `runs/TC-007.txt` muestre `📋 Rol local: assets/agents/story-mapper.md` antes de `=== END ===`.
2. (LOW, heredado de `code-review-report.md`) Pulir la redacción de `skills/project-story-mapping/README.md:9` y corregir el conteo del resumen DoD en `implement-report.md`.
3. Con los evals en verde, volver a ejecutar `/story-verify STORY-134 --mode manual`. La historia queda en `CODE-REVIEW/DONE` para permitirlo sin repetir code-review (decisión del humano).

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

### Ejecución 1 — 2026-10-16
- **Modo**: manual
- **Resultado**: VERIFY-PASSED
- **Tests**: 265/265 pasados, 0 fallados
- **Findings**: 0 defectos (0 CRITICAL, 0 HIGH)
- **Nota**: anulada por la Ejecución 2. El criterio DoD #3 se dio por cumplido con un 8/8 reportado que no coincidió con la ejecución real (7/8).

### Ejecución 2 — 2026-10-16
- **Modo**: manual
- **Resultado**: VERIFY-REJECTED
- **Tests**: 8/8 pasados, 0 fallados
- **Findings**: 0 defectos (0 CRITICAL, 0 HIGH, 0 MEDIUM).

npm run test:eval -- project-story-mapping

> agile-sddf@4.0.1 test:eval
> node scripts/run-evals.js project-story-mapping

[INFO] Skills a evaluar: project-story-mapping
[INFO] Plan de selección: 8 caso(s) en 1 skill(s)
[INFO]   project-story-mapping: 8 caso(s)
[INFO] Ejecutor de eval: claude · modelo: sonnet · concurrencia: 4 · timeout: 900s

[INFO] 8 caso(s) encontrados en project-story-mapping/evals/evals.json
[TC-001] ejecutando…
[TC-002] ejecutando…
[TC-003] ejecutando…
[TC-004] ejecutando…
[TC-004] ✅ PASS (16s)
[TC-005] ejecutando…
[TC-002] ✅ PASS (27s)
[TC-006] ejecutando…
[TC-003] ✅ PASS (30s)
[TC-007] ejecutando…
[TC-005] ✅ PASS (25s)
[TC-008] ejecutando…
[TC-006] ✅ PASS (14s)
[TC-008] ✅ PASS (10s)
[TC-001] ✅ PASS (54s)
[TC-007] ✅ PASS (30s)

# Eval Report: project-story-mapping

**Fecha:** 2026-10-16 | **Total:** 8 | ✅ Passed: 8 | ❌ Failed: 0 | **Pass rate:** 100%
**Ejecutor:** claude | **Modelo:** sonnet

| ID | Nombre | Tipo | Threshold | Estado | Notas |
|---|---|---|---|---|---|
| TC-001 | capas-con-contenido | happy-path | 1 | ✅ PASS | — |
| TC-002 | semillas-sin-contexto | edge-case | 1 | ✅ PASS | — |
| TC-003 | requisitos-srs | happy-path | 1 | ✅ PASS | — |
| TC-004 | mapa-existente-cancelar | safety | 1 | ✅ PASS | — |
| TC-005 | mapa-existente-sobrescribir | happy-path | 1 | ✅ PASS | — |
| TC-006 | staging-incompleto | fail-fast | 1 | ✅ PASS | — |
| TC-007 | sesion-con-rol-local | happy-path | 1 | ✅ PASS | — |
| TC-008 | falla-sin-rol-local | fail-fast | 1 | ✅ PASS | — |
