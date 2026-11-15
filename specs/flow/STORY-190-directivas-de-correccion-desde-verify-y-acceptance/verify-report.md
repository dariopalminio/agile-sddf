---
type: verify-report
id: STORY-190
slug: STORY-190-verify-report
title: "Verify Report: Directivas de corrección desde verify y acceptance"
story: STORY-190
verdict: APPROVED
date: 2026-11-14
mode: config-driven
dod_version: 2026-09-24
created: 2026-11-14
updated: 2026-11-14
---

# Test Report: Directivas de corrección desde verify y acceptance

## Veredicto

**Veredicto:** `APPROVED` — Sin criterios DoD VERIFY fallidos ni defectos CRITICAL o HIGH abiertos (4/5 criterios ✓).



## Summary

| Metric | Value |
|--------|-------|
| Story | STORY-190 |
| Date | 2026-11-14 |
| Mode | config-driven |
| DoD Version | 2026-09-24 |
| Total Tests | 616 |
| Passed | 616 |
| Failed | 0 |
| Skipped | 0 |
| Coverage | N/A |

Ejecuciones que suman en el total:

| Origen | Comando | Resultado |
|---|---|---|
| `verify.unit` (`required: true`) | `npm run test:installer` | 23/23, exit 0 |
| `verify.integration` (`required: true`) | `node scripts/verify-fixed-layout.js` | 1/1: contrato de layout fijo verificado en 43 skills, 0 pendientes; exit 0 |
| DoD VERIFY, criterio 2 | `npm test` | 592/592, exit 0. Incluye los 8 tests de `test/fix-directives-template.test.js` (plantilla central, tres semillas idénticas byte a byte, `{{BASED_ON}}`, secciones, sin BOM ni U+FEFF) |

## Test Scope

- [x] Unit tests
- [x] Integration tests
- [ ] E2E tests
- [ ] Performance tests
- [ ] Security tests

## Findings

### [MEDIUM] El gate `verify:repository` falla por el presupuesto de tiempo de S097-UT-011, no por esta historia
- **Location**: `test/memory-system.test.js:893` (S097-UT-011, `check: docs/ de este repositorio en menos de 5 s (V-10)`)
- **Steps to Reproduce**:
  1. `npm run verify:repository`
  2. El paso de pruebas deterministas termina con 591/592 y `[ERROR] pruebas deterministas: falló con exit 1`.
- **Expected**: `npm run verify:repository` termina con exit 0 (CNF-9 de la historia).
- **Actual**: falló en dos ejecuciones seguidas (7930 ms y 7236 ms frente al límite de 5000 ms). El mismo test pasa en `npm test` (4338 ms) y ejecutado solo (3448 ms). `memory-system check --root docs --json` tarda entre 3,9 y 4,8 s con la máquina en reposo, al borde del presupuesto.
- **Impact**: CNF-9 queda verde en `npm test` pero no en el gate completo de esta máquina. No es atribuible a STORY-190: su único aporte a `docs/` evaluado por `check` es una línea de `docs/guides/sddf-commands-pipeline.md` y el registro en `docs/templates/README.md`; `docs/templates/` no se evalúa (V-5). El coste crece con el repositorio (el origen `flow` recorre 10 ítems en `specs/flow/` y 207 en `specs/flow/archive/`). `implement-report.md` ya registró un fallo intermitente de la línea base y el gate con exit 0 al implementar. No es un defecto de los criterios de aceptación y no bloquea.
- **Fix**: fuera del alcance de esta historia. Registrar un work item para `memory-system check` (rendimiento del recorrido de `specs/flow/archive/`) o revisar el presupuesto V-10 de S097-UT-011.

## Coverage Analysis

No hay cobertura de líneas: el código de producción de esta historia son `SKILL.md`, plantillas y `evals.json`.

| Área | Evidencia determinista | Pendiente de ejecución humana |
|---|---|---|
| CNF-1 — plantilla única y semillas | `test/fix-directives-template.test.js` 8/8 dentro de `npm test` | — |
| AC-1 (verify: CRITICAL/HIGH y DoD fallido) | Estructura de evals validada por `npm test` (V-7) | `npm run test:eval -- story-verify` (TC-009 a TC-011; TC-001, TC-005 y TC-008 migrados) |
| AC-1 (acceptance: criterio rechazado) | Estructura de evals validada por `npm test` (V-7) | `npm run test:eval -- story-acceptance` (TC-017, TC-018; TC-006, TC-012 y TC-016 migrados) |
| AC-2 — `round` continuo entre gates | Estructura de evals validada por `npm test` (V-7) | `npm run test:eval -- story-code-review` (TC-047, TC-048; TC-002 migrado) |
| AC-1 anuncio del origen y AC-3 aviso | Estructura de evals validada por `npm test` (V-7) | `npm run test:eval -- story-implement` (TC-048 a TC-051) y `npm run test:eval -- story-implement-tasks` (TC-010 a TC-012) |
| CNF-9 — gate verde | `npm test` 592/592 | `npm run verify:repository`: ver el finding MEDIUM |

## DoD VERIFY Criteria

| # | Criterio | Estado | Evidencia |
|---|----------|--------|-----------|
| 1 | Todas las pruebas `required: true` de `sddf.config.yaml › verify` pasan (exit 0) | ✓ | `unit` (`npm run test:installer`) 23/23 exit 0; `integration` (`node scripts/verify-fixed-layout.js`) exit 0 |
| 2 | La suite completa `npm test` pasa sin fallos | ✓ | 592/592, exit 0 |
| 3 | Si la historia modifica un skill con `evals/evals.json`, `npm run test:eval -- <skill>` pasa | ⚠️ | Modifica cinco skills con evals (`story-code-review`, `story-verify`, `story-acceptance`, `story-implement`, `story-implement-tasks`). Según el DoD y AGENTS.md los ejecuta una persona a mano; no se ejecutaron en esta verificación |
| 4 | Ningún caso de `testcases.md` queda en `[!]` y cada `[ ]` restante cita la evidencia que lo cubre | ✓ | No existe `testcases.md` (planificación `--only-tasks`, ver `analyze.md`): no hay casos en `[!]` ni en `[ ]`. Los casos de eval por AC se citan en `## Coverage Analysis` |
| 5 | Sin defectos CRITICAL o HIGH abiertos en `verify-report.md` | ✓ | Un único finding, MEDIUM |

**Resumen DoD**: 4/5 criterios ✓

## Recommendations

1. Ejecutar a mano `npm run test:eval -- <skill>` para los cinco skills modificados antes de `/story-acceptance` (criterio 3 del DoD).
2. Ejecutar `npx agile-sddf install` para el dogfooding: `.claude/skills/` sigue con la versión anterior de los cinco skills (anotado en `implement-report.md`).
3. Registrar un work item para el presupuesto V-10 de `memory-system check` (finding MEDIUM), para que `verify:repository` vuelva a ser verde de forma estable.

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
