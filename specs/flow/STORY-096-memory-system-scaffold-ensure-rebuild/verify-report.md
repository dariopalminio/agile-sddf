---
type: verify-report
id: STORY-096
slug: STORY-096-verify-report
title: "Verify Report: Crear y regenerar las capas de memoria con los modos scaffold, ensure y rebuild"
story: STORY-096
date: 2026-09-23
mode: config-driven
dod_version: "docs/guardrails/dod-story-checklist.md — sección VERIFY sin criterios (se aplican criterios mínimos genéricos)"
created: 2026-09-23
updated: 2026-09-23
---

# Test Report: Crear y regenerar las capas de memoria con los modos scaffold, ensure y rebuild

**Date**: 2026-09-23
**Story**: STORY-096
**Mode**: config-driven (`sddf.config.yaml` › `verify`, delivery-model: batch)
**DoD Version**: `docs/guardrails/dod-story-checklist.md`. La sección VERIFY existe pero declara "Por el momento sin criterios", así que se aplican los criterios mínimos genéricos del skill.

## Summary

| Metric | Value |
|--------|-------|
| Total Tests | 36 requeridos + auditoría de raíces (33 skills) · 121 en la suite completa (complementaria) |
| Passed | 36/36 requeridos · auditoría OK · 121/121 suite completa |
| Failed | 0 |
| Skipped | 0 |
| Coverage | N/A (el runner `node --test` no reporta cobertura) |

### Ejecuciones

| Tipo (`verify`) | Comando | Resultado |
|---|---|---|
| unit (`required: true`) | `npm run test:installer` | ✅ 11/11 · exit 0 |
| component (`required: true`) | `npm run test:eval:runner` | ✅ 25/25 · exit 0 |
| integration (`required: true`) | `node scripts/audit-root-resolution.js` | ✅ contrato verificado en 33 skills · exit 0 |
| complementaria (no configurada) | `npm test` | ✅ 121/121 · exit 0 |
| complementaria (no configurada) | `node --test test/memory-system.test.js` | ✅ 42/42 (incluye los 11 tests `S096-*`) |

Los tres tipos requeridos por la configuración no ejercitan `memory-system` de forma directa. Por eso se añaden como evidencia complementaria la suite completa y el archivo de tests del skill. Los evals conductuales del skill (`npm run test:eval -- memory-system`) no se reejecutaron aquí: dieron 14/14 en la implementación de la tercera ronda (el 2026-09-23, ver `implement-report.md`), y desde entonces no cambió ningún archivo bajo `skills/memory-system/`.

## Test Scope

- [x] Unit tests
- [x] Integration tests
- [ ] E2E tests: `e2e`/`e2e-regression` no son `required` en la configuración. Los escenarios E2E-001…004 están cubiertos de facto por los evals TC-005…TC-010 y la corrida manual T019
- [ ] Performance tests
- [ ] Security tests: fuera del alcance de VERIFY; la auditoría de seguridad de la cuarta revisión de código salió aprobada, sin hallazgos

## Findings

> Sin defectos encontrados en esta ejecución.

Observaciones no bloqueantes, heredadas de la revisión de código:

### [LOW] Eval TC-010 inestable
- **Location**: `skills/memory-system/evals/evals.json:345`
- **Steps to Reproduce**: ejecutar `npm run test:eval -- memory-system` varias veces
- **Expected**: PASS estable
- **Actual**: falló 1 de 3 ejecuciones durante la implementación; el `not_contains` "Sobrescribir con propuesta" se viola cuando el modelo enumera opciones del menú que no elige
- **Impact**: falsos negativos en CI de evals; el comportamiento del skill no se ve afectado
- **Fix**: reformular la aserción para que dependa de la opción elegida y no de la redacción del menú

### [LOW] Progreso E2E/IT sin marcar en testcases.md
- **Location**: `docs/specs/03-stories/STORY-096-memory-system-scaffold-ensure-rebuild/testcases.md:84-87, 96-99`
- **Steps to Reproduce**: revisar la sección *Test Cases Progress*
- **Expected**: E2E-001…004 e IT-001…004 con estado final
- **Actual**: 8 entradas `[ ]`; ninguna `[!]`
- **Impact**: la trazabilidad no refleja la evidencia existente (evals TC-005…TC-010, `S096-IT-001`, T019)
- **Fix**: marcarlas citando la evidencia. Este skill no modifica `testcases.md`

## Coverage Analysis

El runner no reporta cobertura de líneas. Cobertura funcional por criterio de aceptación, según la cuarta revisión de código:

| AC | Evidencia ejecutable |
|---|---|
| AC-1 (`ensure` en un paso) | TC-005, `S096-IT-001` |
| AC-2 (`scaffold` crea lo faltante, no indexa) | TC-007, `S096-UT-001`, `S096-UT-003` |
| AC-3 (`rebuild` sin `--force` se detiene) | TC-008 |
| AC-4 (`rebuild --force` conserva artefactos de autor) | TC-009, `S096-UT-006` |
| AC-5 (capas y `constitution.md`) | `S096-UT-001` |
| AC-6 (plantillas) | TC-007, `S096-UT-004`, `S096-UT-005`, `S096-UT-001c` (exhaustividad del árbol semilla) |
| AC-7 (idempotencia / no-eliminación) | TC-006, `S096-UT-002`, `S096-UT-006`, `S096-UT-007` |
| AC-8 (`--fix-frontmatter`) | TC-010 |

## DoD VERIFY Criteria

| # | Criterio | Estado | Evidencia |
|---|----------|--------|-----------|
| 1 | Todos los tests del proyecto pasan | ✓ | Los 3 tipos `required` pasan (36/36 + auditoría); suite completa 121/121; `memory-system` 42/42 |
| 2 | Sin defectos CRITICAL o HIGH sin resolver | ✓ | Sin defectos; solo 2 observaciones LOW heredadas |

**Resumen DoD**: 2/2 criterios ✓

## Recommendations

1. Estabilizar la aserción de TC-010 (LOW) para evitar falsos negativos en los evals.
2. Marcar E2E-001…004 e IT-001…004 en `testcases.md` con su evidencia antes de ACCEPTANCE.
3. Completar la sección VERIFY de `docs/guardrails/dod-story-checklist.md`: hoy está vacía y obliga a usar criterios genéricos.
4. Considerar marcar como `required` en `sddf.config.yaml` un tipo que ejercite la suite completa (`npm test`): los tres tipos requeridos actuales no cubren `memory-system`.
5. Pendientes LOW de la revisión: textos con "seis plantillas" (`README.md`, guía de comandos, `story.md`, `testcases.md`, cuerpo de `design.md`) y `type: guardrails` en `guardrail-template.md`.

## Sign-off

- [x] All critical issues addressed
- [ ] Coverage meets threshold (80%): no medible con el runner actual
- [ ] Performance meets SLA: no aplica / requiere evaluación manual

## Severity Definitions

| Severity | Criteria |
|----------|----------|
| **CRITICAL** | Security vulnerability, data loss, system crash |
| **HIGH** | Major functionality broken, severe performance |
| **MEDIUM** | Feature partially working, workaround exists |
| **LOW** | Minor issue, cosmetic, edge case |

## Historial de Ejecuciones Anteriores

### Ejecución 1 — 2026-09-23
- **Modo**: config-driven
- **Resultado**: VERIFY-PASSED
- **Tests**: 36/36 requeridos pasados (+ auditoría de raíces OK; 121/121 en la suite completa), 0 fallados
- **Findings**: 0 defectos (0 CRITICAL, 0 HIGH); 2 observaciones LOW
