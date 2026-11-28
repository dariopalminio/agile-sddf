---
type: verify-report
id: STORY-201
slug: STORY-201-verify-report
title: "Verify Report: Template de historia con narrativa, contexto y reglas de negocio"
story: STORY-201
verdict: APPROVED
date: 2026-11-27
mode: config-driven
dod_version: 2026-09-24
created: 2026-11-27
updated: 2026-11-27
---

# Test Report: Template de historia con narrativa, contexto y reglas de negocio

## Veredicto

**Veredicto:** `APPROVED` — Sin criterios DoD VERIFY fallidos ni defectos CRITICAL o HIGH abiertos (3/5 criterios ✓).

Los dos criterios restantes quedan `⚠️`, sin `❌`: dependen de `npm run test:eval`, que el DoD y `AGENTS.md` reservan a ejecución humana.

## Summary

| Metric | Value |
|--------|-------|
| Story | STORY-201 |
| Date | 2026-11-27 |
| Mode | config-driven |
| DoD Version | 2026-09-24 |
| Total Tests | 24 |
| Passed | 24 |
| Failed | 0 |
| Skipped | 0 |
| Coverage | N/A |

Pruebas `required: true` de `sddf.config.yaml › verify` (`delivery-model: batch`; `e2e-regression` es `required: false`):

| Tipo | Comando | Resultado |
|---|---|---|
| unit | `npm run test:installer` | 23 pass, 0 fail, exit 0 |
| integration | `node scripts/verify-fixed-layout.js` | `[OK] Contrato de layout fijo verificado en 43 skill(s); 0 pendiente(s) de migración.`, exit 0 |

Ejecuciones adicionales que pide el DoD o `testcases.md` (no suman en Total Tests):

| Comando | Resultado |
|---|---|
| `npm test` | 580 pass, 0 fail, exit 0 |
| `npm run verify:repository` | `[OK] Verificación determinista del repositorio aprobada.`, exit 0 (incluye el smoke del tarball en 4 runtimes) |

## Test Scope

- [x] Unit tests
- [x] Integration tests
- [ ] E2E tests
- [ ] Performance tests
- [ ] Security tests
- [ ] Evals.

## Findings

### [LOW] testcases.md no refleja dos decisiones del rework
- **Location**: changes/STORY-201-template-historia-narrativa-contexto-reglas/testcases.md:35,39
- **Steps to Reproduce**:
  1. `grep -rn "📎 Notas / contexto adicional" skills/ --include=*.md | grep -v '/examples/\|/evals/\|refinement-log-template.md'`
  2. Comparar con el `Entonces` de UT-004 (`testcases.md:39`) y el de E2E-003 (`testcases.md:35`) con AC-3 de `story.md`
- **Expected**: UT-004 espera 0 coincidencias. E2E-003 describe AC-3 tal como quedó en el rework: siete skills, tres títulos e incluye `## 🚫 Fuera de alcance`
- **Actual**: el grep devuelve 2 coincidencias, `skills/story-refine/SKILL.md:244,247`. Son las menciones de compatibilidad que exige AC-3 y que documenta CR-004 de `design.md`. E2E-003 sigue con los cinco skills y los dos títulos de la versión anterior de AC-3
- **Impact**: ninguno en el comportamiento: la implementación cumple AC-3. Lo que queda desalineado es la especificación de pruebas: quien ejecute UT-004 al pie de la letra lo verá fallar
- **Fix**: ajustar el resultado esperado de UT-004 a «solo las 2 menciones de compatibilidad de story-refine (CR-004)» y alinear el `Dado`/`Entonces` de E2E-003 con AC-3. También conviene añadir filas EV para `epic-analyze` TC-038 y `epic-validate` TC-044 (con `/story-testcases` o a mano). Es el mismo LOW que dejó `code-review-report.md`

## Coverage Analysis

El runner no reporta cobertura de código, porque la historia solo cambia Markdown y JSON. Esta es la evidencia de cada caso de `testcases.md`: los 15 siguen en `[ ]` y ninguno está en `[!]`. `story-verify` no escribe en `testcases.md`.

| Caso | Evidencia de esta ejecución | Cubierto |
|---|---|---|
| E2E-001 | `grep -n "^## " docs/templates/story-template.md`: los 7 títulos de AC-1 aparecen en orden (líneas 22, 27, 30, 64, 69, 74, 77). Hay 3 `### AC-<n> - ` y 0 con raya. `- **Regla-1:**`/`- **Regla-2:**` (66-67) terminan en `→ cubierta por [AC-1, AC-n]`. `cmp` entre el seed y la copia: idénticos | ✓ |
| E2E-002 | Sin ejecución en esta verificación: depende de `/story-creation` con un LLM. Lo cubre el eval `story-creation` TC-004 (`[STORY-201 AC-2 · E2E-002]`), que no se ha ejecutado (lo ejecuta un humano). Existe además la validación manual T016 de `implement-report.md`, con las limitaciones que el propio reporte anota | ⚠️ pendiente de eval humano |
| E2E-003 | `npm run verify:repository` termina con exit 0. Los siete consumidores de AC-3 nombran el comienzo común: `story-acceptance`, `story-verify` y `story-evaluation` («empieza por `## ✅ Criterios de aceptación`»), `story-refine` (`🔗 Notas`, ×2), `sal-corrections.md` (AC ×3, `🔗 Notas` ×1, `🚫 Fuera de alcance` ×2), `epic-analyze` (`🚫 Fuera de alcance` ×2) y `story-sources.md` (`🚫 Fuera de alcance` ×1). `sal-corrections.md:83,91` usa `### AC-<k+1> - ` y no queda ninguno con raya | ✓ |
| UT-001 | Orden de los títulos idéntico al de AC-1; `grep -c "  \*(si aplica)\*"` = 0 | ✓ |
| UT-002 | `grep -c "^### AC-[0-9]* —"` = 0; `grep -c "^### AC-[0-9]* - "` = 3 | ✓ |
| UT-003 | Recorrido por bytes con Node de los 30 archivos modificados o nuevos (`git diff --name-only` y `git ls-files --others`): 0 BOM, 0 CR, 0 U+FEFF y 0 U+FFFD | ✓ |
| UT-004 | El AC de cierre con raya en `sal-corrections.md` da 0. `📎 Notas / contexto adicional` da 2 coincidencias, `skills/story-refine/SKILL.md:244,247`: son las menciones de compatibilidad que exige AC-3 y documenta CR-004. El esperado «0» está desactualizado (ver Findings) | ✓ con desviación documentada (CR-004) |
| IT-001 | `npm test` 580/580 incluye `test/memory-system.test.js:476-477`: el `story-template.md` sembrado es igual byte a byte al seed (`owner.equals(...)`) | ✓ |
| IT-002 | `npm run verify:repository` termina con exit 0 (enlaces activos, layout fijo, release y smoke del tarball) | ✓ |
| EV-001 | Eval `story-creation` TC-005 (`[STORY-201 AC-1 · EV-001]`), sin ejecutar (lo ejecuta un humano) | ⚠️ pendiente de eval humano |
| EV-002 | No hay caso de eval. El comportamiento fail-fast no cambió en esta historia y su regla sigue en `skills/story-creation/SKILL.md:275` (`❌ No se encontró el template requerido…`). `implement-report.md` explica por qué no se añadió | ⚠️ sin eval; comportamiento no modificado |
| EV-003 | Eval `story-evaluation` TC-010 (fixture `skills/story-evaluation/examples/example-template-actual.md`), sin ejecutar | ⚠️ pendiente de eval humano |
| EV-004 | Eval `story-evaluation` TC-011 (fixture `examples/example-ready.md`, títulos anteriores), sin ejecutar | ⚠️ pendiente de eval humano |
| EV-005 | Eval `epic-refine` TC-029 (AC de cierre `### AC-3 - …` con guion), sin ejecutar | ⚠️ pendiente de eval humano |
| EV-006 | Eval `epic-refine` TC-029 cubre la forma `## 🔗 Notas adicionales…`. La forma `## 📎 Notas / contexto adicional` la cubren los fixtures con títulos anteriores de los casos existentes de `epic-refine`. Sin ejecutar | ⚠️ pendiente de eval humano |

## DoD VERIFY Criteria

| # | Criterio | Estado | Evidencia |
|---|----------|--------|-----------|
| 1 | Todas las pruebas `required: true` de `sddf.config.yaml › verify` pasan (exit 0) | ✓ | `unit`: `npm run test:installer` 23/23, exit 0. `integration`: `node scripts/verify-fixed-layout.js` exit 0 |
| 2 | La suite completa `npm test` pasa sin fallos | ✓ | 580 pass, 0 fail, exit 0 |
| 3 | Si la historia modifica un skill con `evals/evals.json`, `npm run test:eval -- <skill>` pasa; un fallo solo se acepta como flaky si pasa al reejecutarlo (solo son ejecutados por humano manualmente no automaticamente) | ⚠️ | Requiere ejecución humana (el propio criterio y `AGENTS.md`). La historia modifica skills con evals y añade 7 casos: `story-creation` TC-004/TC-005, `story-evaluation` TC-010/TC-011, `epic-refine` TC-029, `epic-analyze` TC-038 y `epic-validate` TC-044. En `implement-report.md`, `--dry-run` confirma que cargan; no se ha ejecutado ningún runner real |
| 4 | Ningún caso de `testcases.md` queda en `[!]` y cada `[ ]` restante cita en `verify-report.md` la evidencia que lo cubre | ⚠️ | 0 casos en `[!]`. Los 15 en `[ ]` citan su evidencia en «Coverage Analysis». 8 tienen evidencia ejecutada en esta verificación. Los otros 7 (E2E-002 y EV-001…EV-006) solo citan la definición del caso de eval, pendiente de ejecución humana; EV-002 no tiene caso de eval |
| 5 | Sin defectos CRITICAL o HIGH abiertos en `verify-report.md` | ✓ | 0 CRITICAL, 0 HIGH; 1 LOW (documentación de `testcases.md`) |

**Resumen DoD**: 3/5 criterios ✓

## Recommendations

1. **Ejecutar los evals nuevos** (humano, antes de `/story-acceptance` o durante esa fase). Así los criterios 3 y 4 quedan respaldados por resultados:
   - `npm run test:eval -- story-creation --only TC-004,TC-005`
   - `npm run test:eval -- story-evaluation --only TC-010,TC-011`
   - `npm run test:eval -- epic-refine --only TC-029`
   - `npm run test:eval -- epic-analyze --only TC-038`
   - `npm run test:eval -- epic-validate --only TC-044`
2. **Alinear `testcases.md`** (LOW): corregir el esperado de UT-004 y el texto de E2E-003, añadir filas EV para TC-038 y TC-044 y marcar `[x]` los 8 casos con evidencia ejecutada en este reporte.
3. **LOW opcionales de `code-review-report.md`** (TC-004 sin `**Quiero**`/`**Para**`, `**Dependencia:**` frente a `depends-on:`, cuerpo de `design.md` sin alinear con CR-005): atenderlos o pasarlos a una historia de seguimiento.
4. **Siguiente paso del pipeline:** `/story-acceptance STORY-201`.

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
