---
type: verify-report
id: STORY-131
slug: STORY-131-verify-report
title: "Verify Report: Partir project-pm en roles locales"
story: STORY-131
date: 2026-10-16
mode: manual
dod_version: 2026-09-24
created: 2026-10-16
updated: 2026-10-16
---

# Test Report: Partir project-pm en roles locales

**Date**: 2026-10-16
**Story**: STORY-131
**Mode**: manual (override `--mode manual`; el agente `qa-engineer` evaluó los escenarios contra la evidencia recopilada y el usuario confirmó el resultado)
**DoD Version**: 2026-09-24

## Summary

| Metric | Value |
|--------|-------|
| Total Tests | 288 (5 escenarios manuales + 283 pruebas automáticas de soporte) |
| Passed | 288 |
| Failed | 0 |
| Skipped | 0 |
| Coverage | N/A (repo de Markdown + scripts; sin medición de cobertura) |

### Ejecuciones

| Tipo | Comando | Resultado |
|------|---------|-----------|
| unit (`required: true`) | `npm run test:installer` | exit 0 — 11/11 pass |
| integration (`required: true`) | `node scripts/audit-root-resolution.js` | exit 0 — `[OK] Contrato verificado en 34 skill(s) fuente.` |
| Suite completa | `npm test` | exit 0 — 251/251 pass, 0 fail |
| Evals `project-begin` | `npm run test:eval -- project-begin` | 8/8 pass — ejecutado manualmente por el usuario el 2026-10-16 15:24–15:25, después del último cambio de `skills/project-begin/SKILL.md` (15:10). Las salidas del runner en `.tmp/skill-test-evals/project-begin/runs/TC-001…TC-008.txt` cumplen todos los `contains`/`not_contains` |
| Evals `project-discovery` | `npm run test:eval -- project-discovery` | 12/12 pass — ejecutado manualmente por el usuario tras el commit `0a3b7fd` (registrado en el verify-report de STORY-133); incluye TC-007 y TC-008 de esta historia |

### Escenarios (modo manual)

| Escenario | Estado | Evidencia |
|-----------|--------|-----------|
| AC-1 — `project-begin` / `begin-intent.md` | PASS | `skills/project-begin/assets/agents/begin-intent.md` versionado; el directorio `agents/` ya no existe. `skills/project-begin/SKILL.md:106-112` (Paso 3) lee el rol, sigue `## Estado Visión` y dice «Esta sesión conduce la entrevista; no lances un subagente para este paso». TC-008 pasa |
| AC-1 — `project-discovery` / `discovery-pm.md` | PASS | `skills/project-discovery/assets/agents/discovery-pm.md` versionado. `skills/project-discovery/SKILL.md:87-89` (Paso 4) lee el rol, sigue `## Estado Discovery` y prohíbe lanzar un subagente. TC-007 pasa |
| AC-2 — Rol local ausente | PASS | `skills/project-begin/SKILL.md:73-75` (Paso 0) termina con `❌ Rol local no encontrado: assets/agents/begin-intent.md (skill project-begin). Reinstala el skill; no se modificó ningún archivo.` y «no se buscan roles fuera del directorio de este skill». TC-007 de `project-begin` pasa (su salida es exactamente ese mensaje) |
| CNF-1 — Sin pérdida de instrucciones | PASS | `begin-intent.md`: `## Principios de PM` (l.11), `## Protocolo de Resiliencia…` (l.18), `## Estado Visión` (l.25). `discovery-pm.md`: `## Principios de PM` (l.11), `## Protocolo de Resiliencia…` (l.18), `## Estado Discovery` (l.25). Ninguna sección de estado aparece en el rol que no le toca |
| CNF-2 — Contexto acotado por fase | PASS | 38 y 37 líneas frente a las 57 de `project-pm.agent.md`; ninguno declara `tools:` ni `model:` |

Verificaciones complementarias: `git grep "project-pm"` sobre `skills/`, `docs/templates/vision-template.md` y `docs/guides/harness-eng-agents-orchestration.md` no devuelve nada. Ningún `SKILL.md` de los dos skills referencia `agents/` fuera de `assets/agents/`. Las dos copias de `vision-template.md` son idénticas (`cmp`). En el entorno local, `.claude/agents/project-pm.agent.md` ya no existe y los dos roles están instalados bajo `.claude/skills/*/assets/agents/`.

## Test Scope

- [x] Unit tests
- [x] Integration tests
- [ ] E2E tests
- [ ] Performance tests
- [ ] Security tests

> Los evals de skill (`npm run test:eval`) cubren el comportamiento de AC-1 y AC-2 en los dos skills afectados.

## Findings

> Sin defectos encontrados en esta ejecución.

Los 13 hallazgos LOW de `code-review-report.md` siguen abiertos como mejoras de redacción, de la fuerza de las aserciones de los evals y de endurecimiento opcional. Ninguno afecta al comportamiento verificado.

## Coverage Analysis

No hay `testcases.md` para STORY-131. Trazabilidad de criterios a casos de eval:

| Criterio | Casos que lo cubren |
|----------|---------------------|
| AC-1 (`project-begin`) | `skills/project-begin/evals/evals.json` TC-008 (happy-path con `begin-intent.md`) |
| AC-1 (`project-discovery`) | `skills/project-discovery/evals/evals.json` TC-007 (happy-path con `discovery-pm.md`) |
| AC-2 | `project-begin` TC-007 (fail-fast); por simetría, `project-discovery` TC-008 |
| CNF-1, CNF-2 | Comprobación estructural de los dos archivos de rol (sin eval) |

## DoD VERIFY Criteria

| # | Criterio | Estado | Evidencia |
|---|----------|--------|-----------|
| 1 | Todas las pruebas `required: true` de `sddf.config.yaml › verify` pasan (exit 0) | ✓ | `unit` (`npm run test:installer`): exit 0, 11/11. `integration` (`node scripts/audit-root-resolution.js`): exit 0 |
| 2 | La suite completa `npm test` pasa sin fallos | ✓ | 251/251 pass, 0 fail |
| 3 | Si la historia modifica un skill con `evals/evals.json`, `npm run test:eval -- <skill>` pasa | ✓ | `project-begin` 8/8 y `project-discovery` 12/12, ejecutados manualmente por el usuario sobre la versión actual |
| 4 | Ningún caso de `testcases.md` queda en `[!]` y cada `[ ]` restante cita en `verify-report.md` la evidencia que lo cubre | ✓ | No aplica: la historia no tiene `testcases.md`, así que no hay casos `[!]` ni `[ ]`. Los AC se trazan a los evals (ver Coverage Analysis) |
| 5 | Sin defectos CRITICAL o HIGH abiertos en `verify-report.md` | ✓ | 0 findings en VERIFY; la severidad máxima del code review es LOW |

**Resumen DoD**: 5/5 criterios ✓

## Recommendations

1. Antes de STORY-132/133 o en el cierre de EPIC-24, atender los LOW del code review que tienen más impacto: generalizar el mensaje de rol ausente a `assets/agents/<rol>.md` y corregir las cifras de `design.md:41,43,60`.
2. Reforzar los evals: añadir el nombre `project-pm` sin ruta (escapado) a `not_contains` y una copia global instalada al contexto de AC-2, para que la ausencia de fallback no se cumpla de forma trivial.
3. En las próximas corridas manuales de evals, usar `--report` para dejar un informe fechado en `.tmp/skill-test-evals/<skill>/`.
4. Continuar con `/story-acceptance STORY-131`.

## Sign-off

- [x] All critical issues addressed
- [ ] Coverage meets threshold (80%) — no se mide cobertura en este repo
- [ ] Performance meets SLA — requiere evaluación manual; fuera de alcance

## Severity Definitions

| Severity | Criteria |
|----------|----------|
| **CRITICAL** | Security vulnerability, data loss, system crash |
| **HIGH** | Major functionality broken, severe performance |
| **MEDIUM** | Feature partially working, workaround exists |
| **LOW** | Minor issue, cosmetic, edge case |

## Historial de Ejecuciones Anteriores

(sin ejecuciones anteriores)

### Ejecución 1 — 2026-10-16
- **Modo**: manual
- **Resultado**: VERIFY-PASSED
- **Tests**: 288/288 pasados, 0 fallados (5/5 escenarios; soporte: 11/11 installer, audit OK, 251/251 `npm test`, 8/8 evals `project-begin`, 12/12 evals `project-discovery`)
- **Findings**: 0 defectos (0 CRITICAL, 0 HIGH)

> npm run test:eval -- project-begin                                                     
> agile-sddf@4.0.1 test:eval
> node scripts/run-evals.js project-begin

[INFO] Skills a evaluar: project-begin
[INFO] Plan de selección: 8 caso(s) en 1 skill(s)
[INFO]   project-begin: 8 caso(s)
[INFO] Ejecutor de eval: claude · modelo: sonnet · concurrencia: 4 · timeout: 900s
[INFO] 8 caso(s) encontrados en project-begin/evals/evals.json

Eval Report: project-begin

**Fecha:** 2026-10-16 | **Total:** 8 | ✅ Passed: 8 | Failed: 0 | **Pass rate:** 100%
**Ejecutor:** claude | **Modelo:** sonnet

| ID | Nombre | Tipo | Threshold | Estado | Notas |
|---|---|---|---|---|---|
| TC-001 | semilla-completa-vision-confirmada | happy-path | 1 | ✅ PASS | — |
| TC-002 | estado-todo-entrevista-completa | happy-path | 0.95 | ✅ PASS | — |
| TC-003 | retoma-solo-secciones-pendientes | edge-case | 1 | ✅ PASS | — |
| TC-004 | vision-completa-ofrece-actualizar-o-cancelar | edge-case | 1 | ✅ PASS | — |
| TC-005 | usa-seed-cuando-falta-template-central | fallback | 1 | ✅ PASS | — |
| TC-006 | falla-sin-template-sin-escribir | fail-fast | 1 | ✅ PASS | — |
| TC-007 | falla-sin-rol-local-begin-intent | fail-fast | 1 | ✅ PASS | — |
| TC-008 | entrevista-con-rol-local-begin-intent | happy-path | 1 | ✅ PASS | — |


