---
type: verify-report
id: STORY-097
slug: STORY-097-verify-report
title: "Verify Report: Verificar la consistencia de la memoria con un modo check apto para CI"
story: STORY-097
date: 2026-09-23
mode: config-driven
dod_version: "docs/guardrails/dod-story-checklist.md — sección VERIFY (5 criterios)"
created: 2026-09-23
updated: 2026-09-23
related:
  - STORY-097-memory-system-check-ci
---

<!-- Referencias -->
[[STORY-097-memory-system-check-ci]]

# Test Report: Verificar la consistencia de la memoria con un modo check apto para CI

**Date**: 2026-09-23
**Story**: STORY-097
**Mode**: config-driven (`sddf.config.yaml` › `verify`, delivery-model: batch)
**DoD Version**: `docs/guardrails/dod-story-checklist.md` § *Definition of Done para el estado VERIFY* (5 criterios). `docs/policies/definition-of-done-story.md` no existe; se usa la misma fuente que la revisión de código.

## Summary

| Metric | Value |
|--------|-------|
| Total Tests | 36 requeridos + auditoría de raíces (33 skills) · 121 suite completa · 14 evals `memory-system` |
| Passed | 36/36 requeridos · auditoría OK · 121/121 suite completa · 14/14 evals (2 tras reejecución) |
| Failed | 0 |
| Skipped | 0 |
| Coverage | N/A (el runner `node --test` no reporta cobertura) |

### Ejecuciones

| Tipo | Comando | Resultado |
|---|---|---|
| unit (`required: true`) | `npm run test:installer` | ✅ 11/11 · exit 0 |
| component (`required: true`) | `npm run test:eval:runner` | ✅ 25/25 · exit 0 |
| integration (`required: true`) | `node scripts/audit-root-resolution.js` | ✅ contrato verificado en 33 skills · exit 0 |
| DoD #2 | `npm test` | ✅ 121/121 · exit 0 |
| complementaria | `node --test test/memory-system.test.js` | ✅ 42/42 (incluye los 14 tests `S097-*`) |
| DoD #3 | `npm run test:eval -- memory-system` | ⚠️ 12/14 · exit 1: TC-005 y TC-010 terminaron en `ERROR — claude exit 1: sin salida` (fallo del runner, no una aserción) |
| DoD #3 (reejecución) | `npm run test:eval -- memory-system --only TC-005,TC-010` | ✅ 2/2 · exit 0 → **flaky**, aceptado según el DoD |

Los evals propios de esta historia (TC-011…TC-014, modo `check`) pasaron en la primera corrida. TC-005 y TC-010 ejercitan `ensure` (STORY-096). TC-010 ya estaba registrado como inestable en `STORY-096-*/verify-report.md`.

### Verificación sugerida de `story.md` (manual, motor directo)

| Paso | Resultado |
|---|---|
| `check --root docs --json` en este repositorio | exit 1 · 10 problemas reales (5 `orphan`, 5 `broken-wikilink`), ninguno de código inline ni de `templates/` · 473 ms (NFR < 5 s) |
| Hash de todo `docs/` antes y después de `check` | idéntico → solo lectura confirmado |
| Dos ejecuciones `--json` consecutivas | byte a byte idénticas → determinista |
| Fixture `examples/sane/docs` | `problemas: 0` · exit 0 |
| Fixture `examples/broken/docs` | `problemas: 4` (una por familia) · exit 1 |
| Copia de `sane/` con `[[slug-inexistente]]` añadido a `guides/sdd.md` → `--json` | `ok: false`, `summary.broken-wikilink: 1`, problema con `kind/path/detail`; exit 1 |
| Mismo árbol tras quitar el wikilink | `ok: true`, `problems: []`; exit 0 |
| `check --root no-existe` | `❌ raíz inexistente…` · exit 2 |

## Test Scope

- [x] Unit tests
- [x] Integration tests
- [x] E2E tests: `S097-E2E-001`/`S097-E2E-002` dentro de `test/memory-system.test.js`, más la reproducción manual de ambos escenarios Gherkin (tabla anterior)
- [ ] Performance tests: no hay tipo `performance` requerido; NFR-2 cubierto por `S097-UT-011` y la medición de 473 ms
- [ ] Security tests: fuera del alcance de VERIFY; la revisión de código evaluó 69 reglas sin hallazgos bloqueantes

## Findings

> Sin defectos encontrados en esta ejecución.

Observaciones no bloqueantes:

### [LOW] Evals TC-005 y TC-010 inestables por fallo del runner
- **Location**: `skills/memory-system/evals/evals.json` (TC-005, TC-010), `scripts/run-evals.js`
- **Steps to Reproduce**: `npm run test:eval -- memory-system` con la suite completa en paralelo
- **Expected**: PASS en la primera corrida
- **Actual**: `claude exit 1: sin salida` en ambos; PASS al reejecutarlos aislados (251 s y 573 s)
- **Impact**: exit 1 intermitente en el runner de evals; el comportamiento del skill no se ve afectado. Son casos de STORY-096
- **Fix**: investigar si el runner agota tiempo o recursos con casos largos en paralelo (TC-010 tarda ~10 min), y reintentar ante `sin salida`

### [LOW] `[[story-template]]` y similares resuelven en Foam pero no en `check`
- **Location**: `docs/specs/02-epics/EPIC-17-remediating-and-improvement/plan-06-centralizar-templates-compartidos.md:139`
- **Steps to Reproduce**: `node skills/memory-system/scripts/memory-system.js check --root docs --json`
- **Expected**: coherente con el diseño (D-3 excluye `templates/`, cuyos slugs son placeholders)
- **Actual**: tres `broken-wikilink` que Foam sí resuelve por nombre de archivo
- **Impact**: ninguno sobre la historia; el comportamiento es el diseñado, pero puede sorprender a quien use Foam
- **Fix**: reemplazar esos wikilinks por enlaces con ruta, o documentar la diferencia en `docs/architecture/memory-system.md`

## Coverage Analysis

El runner no reporta cobertura de líneas. Cobertura funcional por criterio de aceptación:

| AC | Evidencia ejecutable |
|---|---|
| AC-1 (check determinista, exit 0/1) | `S097-E2E-001`, TC-011, TC-013, reproducción manual sobre fixtures |
| AC-2 (salida JSON para CI) | `S097-E2E-002`, `S097-UT-008`, TC-012, reproducción manual romper/corregir wikilink |
| AC-3 (familias y exclusiones) | `S097-UT-001`…`S097-UT-007`, corrida sobre `docs/` sin falsos positivos |
| AC-4 (solo lectura, exit 2) | `S097-UT-009`, `S097-UT-010`, `S097-UT-012`, TC-014, hash de `docs/` intacto |

Casos `[ ]` restantes en `testcases.md`:

| Caso | Evidencia que lo cubre |
|---|---|
| IT-001 (SKILL.md propaga stdout y exit code) | Evals TC-011…TC-014 en verde en esta ejecución (ejercitan el skill completo y su exit code) y `S097-E2E-001`/`S097-E2E-002` en la capa del motor |
| IT-002 (degradación sin `node` en PATH) | Verificación manual no automatizable en CI; degradación descrita en `skills/memory-system/SKILL.md` §3.5. No ejecutada en esta VERIFY |

## DoD VERIFY Criteria

| # | Criterio | Estado | Evidencia |
|---|----------|--------|-----------|
| 1 | Todas las pruebas `required: true` de `sddf.config.yaml › verify` pasan (exit 0) | ✓ | unit 11/11, component 25/25, integration OK; los tres con exit 0 |
| 2 | La suite completa `npm test` pasa sin fallos | ✓ | 121/121 · exit 0 |
| 3 | Si la historia modifica un skill con `evals/evals.json`, `npm run test:eval -- <skill>` pasa; un fallo solo se acepta como flaky si pasa al reejecutarlo y queda registrado | ✓ | 12/14 en la primera corrida; TC-005 y TC-010 (`claude exit 1: sin salida`) pasan al reejecutarlos → flaky, registrado en Findings |
| 4 | Ningún caso de `testcases.md` queda en `[!]` y cada `[ ]` restante cita su evidencia en `verify-report.md` | ✓ | 0 `[!]`; IT-001 e IT-002 citados en *Coverage Analysis* |
| 5 | Sin defectos CRITICAL o HIGH abiertos en `verify-report.md` | ✓ | 0 CRITICAL, 0 HIGH; solo 2 observaciones LOW |

**Resumen DoD**: 5/5 criterios ✓

## Recommendations

1. Estabilizar el runner de evals ante `claude exit 1: sin salida` (TC-005, TC-010), por ejemplo con un reintento automático.
2. Ejecutar IT-002 a mano (entorno sin `node`) durante ACCEPTANCE para cerrar NFR-3.
3. Resolver los 10 problemas que `check --root docs` detecta en el repositorio antes de usarlo como gate de CI; STORY-100 (pendiente de crear) cubre parte de la deuda de wikilinks.
4. Pendientes LOW de la revisión de código: conteos desfasados en `implement-report.md` y precisiones de UT-005/UT-007 en `testcases.md`.
5. Crear `docs/policies/definition-of-done-story.md` o actualizar el skill para que lea `docs/guardrails/dod-story-checklist.md`: hoy la ruta que declara el skill no existe.

## Sign-off

- [x] All critical issues addressed
- [ ] Coverage meets threshold (80%): no medible con el runner actual
- [ ] Performance meets SLA: requiere evaluación manual (NFR-2 medido: 473 ms < 5 s)

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
- **Tests**: 36/36 requeridos pasados (+ auditoría OK; 121/121 suite completa; 14/14 evals, 2 flaky tras reejecución), 0 fallados
- **Findings**: 0 defectos (0 CRITICAL, 0 HIGH); 2 observaciones LOW
