---
type: verify-report
id: STORY-099
slug: STORY-099-verify-report
title: "Verify Report: Inicializar la memoria completa desde sddf-init con el parámetro --level"
story: STORY-099
date: 2026-09-24
mode: config-driven
dod_version: docs/guardrails/dod-story-checklist.md (sección VERIFY)
created: 2026-09-24
updated: 2026-09-24
---

<!-- Referencias -->
[[STORY-099-sddf-init-level-full]]

# Test Report: Inicializar la memoria completa desde sddf-init con el parámetro --level

**Date**: 2026-09-24
**Story**: STORY-099
**Mode**: config-driven (`sddf.config.yaml › verify`, delivery model `batch`)
**DoD Version**: `docs/guardrails/dod-story-checklist.md` — sección "Definition of Done para el estado VERIFY" (`docs/policies/definition-of-done-story.md` no existe en este repo)

## Summary

| Metric | Value |
|--------|-------|
| Total Tests | 142 (132 `npm test` + 10 evals LLM de `sddf-init`) + auditoría de raíces + 1 E2E real (IT-002) |
| Passed | 142 + auditoría OK + IT-002 OK |
| Failed | 0 |
| Skipped | 0 |
| Coverage | N/A (repositorio de skills Markdown; no hay instrumentación de cobertura) |

Detalle por prueba `required: true` de `sddf.config.yaml › verify`:

| Tipo | Comando | Resultado |
|---|---|---|
| unit | `npm run test:installer` | ✅ 11/11 · exit 0 |
| component | `npm run test:eval:runner` | ✅ 25/25 · exit 0 |
| integration | `node scripts/audit-root-resolution.js` | ✅ `[OK] Contrato verificado en 33 skill(s) fuente.` · exit 0 |

`e2e-regression` no se añadió: el delivery model es `batch`, pero en la configuración está como `required: false`.

Pruebas adicionales exigidas por el DoD:

| Prueba | Resultado |
|---|---|
| `npm test` (suite completa) | ✅ 132/132 · exit 0 (incluye las suites de installer y runner) |
| `npm run test:eval -- sddf-init --report` | ✅ 10/10 (sonnet). Corrida post-REFACTOR terminada a las 09:41, posterior a la última modificación de `skills/sddf-init/SKILL.md` (09:27) y de `evals/evals.json` (09:04); el contenido evaluado es el vigente |
| **IT-002 real** (`claude -p` en directorio temporal con `agile-sddf install` y `.claude/skills/memory-system/` eliminado; `/sddf-init --level full`) | ✅ Pasos 1–5 completos; aviso de degradación; informe sin bloque de scaffold y sin `creados:`; cierre `(nivel standard)`; en disco solo `sddf.config.yaml`, `.env.template` y los cinco templates; exit 0 |

## Test Scope

- [x] Unit tests
- [x] Integration tests
- [x] E2E tests (reales en directorios temporales: E2E-001, E2E-002 y NFR-2 en IMPLEMENT; IT-002 en esta ejecución)
- [ ] Performance tests
- [x] Security tests (auditoría de 36 reglas en `story-code-review`)

## Findings

### [LOW] El aviso de degradación no se emite literalmente en la ejecución real
- **Location**: `skills/sddf-init/SKILL.md` Paso 5b (mensaje `⚠️ memory-system no está instalado — nivel full termina como standard`)
- **Steps to Reproduce**:
  1. Instalar los skills en un proyecto vacío y borrar `.claude/skills/memory-system/`.
  2. Ejecutar `/sddf-init --level full`.
- **Expected**: `⚠️ memory-system no está instalado — nivel full termina como standard`
- **Actual**: `⚠️ \`memory-system\` no está instalado (no existe .claude/skills/memory-system/SKILL.md) — nivel \`full\` termina como \`standard\`.` El sentido coincide, pero el LLM añadió formato y un paréntesis.
- **Impact**: cosmético. El comportamiento es correcto. Una comprobación por subcadena sobre la salida real no encontraría el literal (el eval TC-008, que es simulado, sí pasa).
- **Fix**: opcional. Marcar el mensaje en el SKILL.md como "emitir literalmente, sin formato adicional", como ya se hace con el `❌` de `--level`.

> Sin defectos CRITICAL, HIGH ni MEDIUM. Los 11 hallazgos LOW de `code-review-report.md` siguen abiertos como mejoras opcionales.

## Coverage Analysis

Cobertura de `testcases.md` (sección "Test Cases Progress"):

| Caso | Estado | Evidencia |
|---|---|---|
| E2E-001 | [x] | E2E real en IMPLEMENT: listado de A (`--level full`) igual al de B (`sddf-init` + `scaffold`), contenido idéntico byte a byte |
| E2E-002 | [x] | E2E real en IMPLEMENT: sin argumentos no menciona `memory-system`; `minimal` sin templates, sin pregunta de políticas y con `[OMITIDO] … (nivel minimal)` |
| IT-001 | [x] | Informe real de A: los templates figuran `[CREADO]` en el bloque de `sddf-init` y `[PRESERVADO]` en el de scaffold, y el cierre lleva `(nivel full)` |
| **IT-002** | [ ] → **cubierto** | **E2E real en esta ejecución** (ver Summary). El skill solo escribe este reporte y el frontmatter, por eso la casilla de `testcases.md` no se toca y la evidencia queda aquí |
| IT-003 | [x] | Motor determinista: un `docs/constitution.md` previo queda `[PRESERVADO]` sin cambios |
| EV-001..EV-006 | [x] | `npm run test:eval -- sddf-init`: 10/10 |

Ningún caso está en `[!]`.

## DoD VERIFY Criteria

| # | Criterio | Estado | Evidencia |
|---|----------|--------|-----------|
| 1 | Todas las pruebas `required: true` de `sddf.config.yaml › verify` pasan (exit 0) | ✓ | unit 11/11, component 25/25, integration OK: los tres con exit 0 |
| 2 | La suite completa `npm test` pasa sin fallos | ✓ | 132/132, exit 0 |
| 3 | Si la historia modifica un skill con `evals/evals.json`, `npm run test:eval -- <skill>` pasa | ✓ | `sddf-init` 10/10 sobre el contenido vigente, sin fallos flaky |
| 4 | Ningún caso de `testcases.md` en `[!]` y cada `[ ]` restante cita su evidencia en `verify-report.md` | ✓ | 0 en `[!]`; el único `[ ]` (IT-002) está cubierto por la E2E real de esta ejecución |
| 5 | Sin defectos CRITICAL o HIGH abiertos en `verify-report.md` | ✓ | Solo 1 hallazgo LOW |

**Resumen DoD**: 5/5 criterios ✓

## Recommendations

1. (Opcional) Marcar como `[x]` IT-002 en `testcases.md`, citando este reporte.
2. (Opcional) Resolver en una iteración menor los hallazgos LOW del code review: casos límite de `--level`, "continuar al Paso 6" en el Paso 5 y la redacción de `standard`. Añadir además la instrucción de emitir literalmente el aviso de degradación (finding de arriba).
3. Reinstalar el `sddf-init` global (`npx agile-sddf install --global --force`): el de `~/.claude/skills/` es anterior a `--level` y tiene prioridad sobre el del proyecto.
4. Siguiente fase: `/story-acceptance STORY-099`.

## Sign-off

- [x] All critical issues addressed
- [ ] Coverage meets threshold (80%) — N/A: no hay métrica de cobertura para skills Markdown
- [ ] Performance meets SLA — fuera de alcance

## Severity Definitions

| Severity | Criteria |
|----------|----------|
| **CRITICAL** | Security vulnerability, data loss, system crash |
| **HIGH** | Major functionality broken, severe performance |
| **MEDIUM** | Feature partially working, workaround exists |
| **LOW** | Minor issue, cosmetic, edge case |

## Historial de Ejecuciones Anteriores

### Ejecución 1 — 2026-09-24
- **Modo**: config-driven
- **Resultado**: VERIFY-PASSED
- **Tests**: 142/142 pasados, 0 fallados (+ auditoría de raíces OK + IT-002 real OK)
- **Findings**: 1 defecto (0 CRITICAL, 0 HIGH, 0 MEDIUM, 1 LOW)
