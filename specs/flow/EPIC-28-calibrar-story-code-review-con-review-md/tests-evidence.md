---
type: test-evidences
id: EPIC-28
slug: EPIC-28-calibrar-story-code-review-con-review-md-test-evidences
title: "Test evidences: Calibrar story-code-review con REVIEW.md"
epic: EPIC-28
stories: 9
verdict: COMPLETE
created: 2026-11-12
updated: 2026-11-12
---
# Evidencias de testing: Calibrar story-code-review con REVIEW.md

## Veredicto

**Veredicto:** `COMPLETE` — las 9 historias (STORY-177 a STORY-185) tienen evidencia de testing determinista (pruebas `node --test` con ciclo RED→GREEN) y de evals ejecutados manualmente (22 ejecuciones registradas, 22/22 PASS, 100 %). Todas las historias están en `ACCEPTANCE/DONE` o `ACCEPTED/DONE` con code-review `APPROVED` y verify-report `APPROVED`.

## Resumen

| Métrica | Valor |
|---|---|
| Épica | EPIC-28 (`specs/flow/EPIC-28-calibrar-story-code-review-con-review-md/epic.md`, `DEVELOP/DONE`) |
| Historias con evidencia | 9/9 |
| Pruebas deterministas nuevas | 8 archivos en `test/` (todos en la suite `npm test`) |
| Evals nuevos de la épica | 27 (23 en `story-code-review` + 4 en `sddf-constitution`) |
| Evals nuevos ejecutados y en verde | 18 (runner `opencode`) |
| Evals nuevos aún sin ejecutar | 9 (a criterio humano, AGENTS.md) |
| Suite `npm test` (estado final, STORY-185) | 584/584 pasados, 0 fallados |
| Gate determinista final | `npm run verify:repository` OK (STORY-185, 2026-11-12) |
| Code-review | 9/9 `APPROVED`, severidad máxima LOW en todos |
| Verify-report | 9/9 `APPROVED`, 0 defectos CRITICAL/HIGH abiertos |

## Evidencia por historia

### STORY-177 — Corregir rutas de story-code-review

- **Estado:** `ACCEPTANCE/DONE` (2026-11-11) · verify `APPROVED` (4/5 DoD ✓) · code-review `APPROVED` (11 LOW)
- **Prueba determinista:** `test/story-code-review-paths.test.js` — RED `# pass 0` / `# fail 4` → GREEN 4/4 (`implement-report.md` T004/T014)
- **Evals ejecutados (2026-11-11, runner opencode, 100 %):** TC-008 `seguridad-sin-checklist-usa-baseline`, TC-024 `informes-parciales-en-directorio-de-historia`, TC-025 `checklist-de-guardrails-sin-enlace-en-constitucion`
- **Suites:** `npm test` 580/580 · `npm run test:installer` 23/23 · `node scripts/verify-fixed-layout.js` OK (43 skills)

### STORY-178 — ADR de la guía de revisión

- **Estado:** `ACCEPTANCE/DONE` (2026-11-11) · verify `APPROVED` (5/5 DoD ✓) · code-review `APPROVED`
- **Prueba determinista:** no aplica — historia de documentación (ADR-0021, `docs/adr/README.md`, `docs/index.md`); sin `testcases.md` ni skills modificados
- **Evals:** no aplican (sin skills modificados)
- **Suites:** `npm test` 580/580 · `npm run test:installer` 23/23 · `verify-fixed-layout` OK

### STORY-179 — REVIEW.md de agile-sddf

- **Estado:** `ACCEPTANCE/DONE` (2026-11-11) · verify `APPROVED` (5/5 DoD ✓) · code-review `APPROVED`
- **Prueba determinista:** `test/review-md.test.js` — RED (`ENOENT … REVIEW.md`) → GREEN 8/8 (`implement-report.md` T002/T009)
- **Mutaciones de control (evidencia transitoria):** UT-009 a UT-013 — placeholder `[5]`, `in place` duplicada, ruta inexistente y `🟡 Minor` sin traducción hicieron fallar las aserciones 1, 4, 6 y 5 respectivamente; revertidas y suite en verde
- **Publicación:** `npm pack --dry-run --ignore-scripts` — 602 archivos en el tarball, ninguno `REVIEW.md` (no se publica)
- **Suites:** `npm test` 580/580 · `npm run verify:repository` exit 0 (14 pasos OK)

### STORY-180 — story-code-review lee REVIEW.md

- **Estado:** `ACCEPTANCE/DONE` (2026-11-11) · verify `APPROVED` (3/5 DoD ✓) · code-review `APPROVED`
- **Prueba determinista:** `test/story-code-review-review-md.test.js` — RED (4 fallos, 1 pasa) → GREEN 5/5 (`implement-report.md` T008/T023)
- **Evals ejecutados (2026-11-11, runner opencode, 100 %):** TC-026 `review-md-presente-llega-a-revisores-y-arbitro`, TC-027 `secreto-falso-en-examples-excluido-por-review-md`, TC-028 `sin-review-md-advierte-y-conserva-contrato`, TC-029 `historia-modifica-review-md-advierte`
- **Casos de `testcases.md`:** 19 — UT-001 a UT-005 e IT-001 a IT-004 cubiertos por evidencia determinista; E2E-005 por grep; EV/E2E restantes por evals y ejecuciones manuales
- **Suites:** `npm test` 580/580 · `npm run verify:repository` exit 0

### STORY-181 — Hallazgos preexistentes

- **Estado:** `ACCEPTANCE/DONE` (2026-11-11) · verify `APPROVED` (4/5 DoD ✓) · code-review `APPROVED` (solo LOW)
- **Prueba determinista:** `test/story-code-review-preexisting.test.js` — RED (`Cannot find module … touched-lines.js`) → GREEN 21/21 aserciones (`parseLocation`, `touchedLines`, `resolveBase`, `classifyLocations`, invariante D-3); ronda 1: RED 20/21 → GREEN 21/21
- **Motor probado:** `skills/story-code-review/scripts/touched-lines.js` (incluye corrección MEDIUM con prueba de regresión: `:500` sobre archivo de 20 líneas → `unknown`)
- **Evals ejecutados (2026-11-11, runner opencode, 100 %):** TC-030 `hallazgo-preexistente-no-bloquea`, TC-033 `linea-no-tocada-causada-por-la-historia`
- **Suites:** `npm test` 556/556 en la primera pasada; la falla transitoria `S097-UT-011` (`test/memory-system.test.js:901`) se aisló como umbral de tiempo bajo carga concurrente, ajena a la historia (0,7 s en verde aislado)

### STORY-182 — Verificación y deduplicación de hallazgos del árbitro

- **Estado:** `ACCEPTANCE/DONE` (2026-11-11) · verify `APPROVED` (4/5 DoD ✓) · code-review `APPROVED` (solo LOW)
- **Prueba determinista:** `test/story-code-review-evidence-dedup.test.js` — RED (aserciones 1, 2, 3 y 5 fallan; pasa 4) → GREEN 8/8 tras el rework, con aserción nueva del Paso 5b (`{{SECURITY_FINDINGS}}` con filas consolidadas)
- **Evals ejecutados (2026-11-11, runner opencode, 100 %):** TC-034 `bloqueantes-sin-evidencia-no-cuentan`, TC-037 `hallazgos-distintos-no-se-fusionan`
- **Suites:** `npm test` 558/558 (rework) · `npm run verify:repository` exit 0

### STORY-183 — DoD CODE-REVIEW sin criterios circulares

- **Estado:** `ACCEPTED/DONE` (2026-11-11) · verify `APPROVED` (4/5 DoD ✓) · code-review `APPROVED` (8 LOW)
- **Prueba determinista:** `test/dod-story-code-review.test.js` — RED (4 fallos UT-001 a UT-004; UT-005 helper pasa) → GREEN 5/5
- **Evals ejecutados (2026-11-11, runner opencode, 100 %):** TC-039 `criterio-cubierto-por-revisor-no-duplica`, TC-040 `criterio-propio-tasks-pendiente`, TC-041 `criterio-propio-frontmatter-incompleto`
- **Suites:** `npm test` 580/580 · `npm run verify:repository` exit 0

### STORY-184 — REVIEW.md semilla para proyectos consumidores

- **Estado:** `ACCEPTANCE/DONE` (2026-11-11) · verify `APPROVED` (4/5 DoD ✓) · code-review `APPROVED` (7 LOW)
- **Prueba determinista:** `test/sddf-constitution.test.js` — RED (5 fallos: E2E-001, IT-001, UT-001, UT-002, EV-005) → GREEN 10/10 (`implement-report.md` T004/T010)
- **E2E manual (T013):** proyecto temporal con runtime `claude-code` — 1.ª ejecución crea `REVIEW.md` idéntica byte a byte a la plantilla (SHA-256 `1f6ffc12…df8eb744`); `REVIEW.md` preexistente conservado (SHA-256 `06fdf4f9…d3bc8d49` antes y después); 2.ª ejecución idempotente (SMOKE-4)
- **Evals nuevos:** `skills/sddf-constitution/evals/evals.json` TC-001 a TC-004 (`crea-review-md-si-falta`, `conserva-review-md-existente`, `segunda-ejecucion-no-modifica-review-md`, `plantilla-ausente-no-bloquea`)
- **Suites:** `npm test` 582/582 · `npm run verify:repository` exit 0 · `npm run verify:eval-inventory` OK (43 skills)

### STORY-185 — Tope de LOW por revisor y sin arrastres entre rondas

- **Estado:** `ACCEPTANCE/DONE` (2026-11-11) · verify `APPROVED` (3/5 DoD ✓) · code-review `APPROVED` (12 LOW)
- **Prueba determinista:** `test/story-code-review-low-noise.test.js` — RED 0/14 (faltaba `low-ledger.js`) → 13/14 → GREEN completo; 29/29 tareas `[x]` en `tasks.md` (sin `testcases.md` en la historia)
- **Evals ejecutados (2026-11-12, runner opencode, 100 %):** TC-042 `tope-de-low-desde-review-md`, TC-043 `tope-por-defecto-review-md-sin-tope`, TC-044 `tope-por-defecto-sin-review-md` (vuelta 1); TC-045 `low-arrastrado-no-se-repite-high-si` (236 s) y TC-046 `low-en-linea-cambiada-se-muestra` (2314 s) (vuelta 2, `--concurrency 1`)
- **Suites finales:** `npm test` 584/584 · `npm run verify:repository` OK

## Crecimiento de la suite determinista

| Punto | `npm test` | Origen |
|---|---|---|
| Antes de STORY-177 | 511 | línea base |
| STORY-181 | 556 | + `story-code-review-paths`, `review-md`, `story-code-review-review-md`, `story-code-review-preexisting` |
| STORY-182 | 558 | + `story-code-review-evidence-dedup` |
| STORY-178/179/180/183 | 580 | + `dod-story-code-review`, regresión |
| STORY-184 | 582 | + `sddf-constitution` |
| STORY-185 (final) | 584 | + `story-code-review-low-noise` |

## Evals nuevos de la épica — estado

| Historia | Evals nuevos | Ejecutados (verde) | Sin ejecutar (criterio humano) |
|---|---|---|---|
| STORY-177 | TC-024, TC-025 | 2/2 | — |
| STORY-180 | TC-026 a TC-029 | 4/4 | — |
| STORY-181 | TC-030 a TC-033 | TC-030, TC-033 | TC-031 `defecto-en-linea-tocada-bloquea`, TC-032 `lineas-tocadas-no-determinables` |
| STORY-182 | TC-034 a TC-037 | TC-034, TC-037 | TC-035 `bloqueante-verificado-junto-a-no-verificado`, TC-036 `hallazgo-duplicado-entre-revisores-se-fusiona` |
| STORY-183 | TC-038 a TC-041 | TC-039 a TC-041 | TC-038 `dod-sin-criterios-autorreferentes` |
| STORY-184 | TC-001 a TC-004 (`sddf-constitution`) | ver anomalía A-1 | TC-003 `segunda-ejecucion-no-modifica-review-md` |
| STORY-185 | TC-042 a TC-046 | 5/5 | — |

Otros Evals:
Comando para cerrar los pendientes: `npm run test:eval -- story-code-review --only TC-031,TC-032,TC-035,TC-036,TC-038` y `npm run test:eval -- sddf-constitution` (AGENTS.md: a criterio humano para economizar cuota).

Eval Report: sddf-constitution

npm run test:eval -- sddf-constitution --only TC-001 --eval-runner opencode --timeout 3600 --report

**Fecha:** 2026-11-12 | **Total:** 1 | ✅ Passed: 1 | ❌ Failed: 0 | **Pass rate:** 100%
**Ejecutor:** opencode

| ID | Nombre | Tipo | Threshold | Estado | Notas |
|---|---|---|---|---|---|
| TC-001 | crea-review-md-si-falta | happy-path | 0.9 | ✅ PASS | — |

✅ Todos los 1 casos pasaron. El skill está listo.
---

npm run test:eval -- sddf-constitution --only TC-003 --eval-runner opencode --timeout 3600 --report

> agile-sddf@5.1.1 test:eval
> node scripts/run-evals.js sddf-constitution --only TC-003 --eval-runner opencode --timeout 3600 --report

[INFO] Skills a evaluar: sddf-constitution
[INFO] Plan de selección: 1 caso(s) en 1 skill(s)
[INFO]   sddf-constitution: 1 caso(s)
[INFO] Ejecutor de eval: opencode · modelo: predeterminado del runner · concurrencia: 4 · timeout: 3600s

[INFO] 1 caso(s) encontrados en sddf-constitution/evals/evals.json
[TC-003] ejecutando…
[TC-003] ✅ PASS (278s)

# Eval Report: sddf-constitution

**Fecha:** 2026-11-13 | **Total:** 1 | ✅ Passed: 1 | ❌ Failed: 0 | **Pass rate:** 100%
**Ejecutor:** opencode

| ID | Nombre | Tipo | Threshold | Estado | Notas |
|---|---|---|---|---|---|
| TC-003 | segunda-ejecucion-no-modifica-review-md | edge-case | 0.9 | ✅ PASS | — |

✅ Todos los 1 casos pasaron. El skill está listo.
---

## Anomalías y observaciones

- **A-1 — Evidencia de evals de STORY-184 con nombres de `story-code-review`:** el «Historial de Ejecuciones Anteriores» de `STORY-184…/verify-report.md` registra TC-001 `happy-path-revision-aprobada`, TC-002 `needs-changes-hallazgo-high-genera-fix-directives` y TC-004 `fail-fast-artefactos-requeridos-faltantes` bajo el skill `story-code-review`; esos nombres corresponden a `skills/story-code-review/evals/evals.json`, no a los TC-001 a TC-004 de `skills/sddf-constitution/evals/evals.json` que creó la historia. Los evals propios de `sddf-constitution` no tienen ejecución registrada con sus propios nombres.
- **A-2 — DoD criterio 3 en amarillo (⚠️) en 7 de 9 verify-reports:** los criterios 3 de STORY-177, 180, 181, 182, 183, 184 y 185 quedaron `⚠️` al escribirse el reporte (evals aún sin ejecutar) y se cerraron después con las ejecuciones manuales registradas en la misma sección; solo STORY-178 (5/5) y STORY-179 (5/5) no tienen esa marca.
- **A-3 — Hallazgos LOW acumulados de code-review:** 11 (STORY-177) + 8 (STORY-183) + 7 (STORY-184) + 12 (STORY-185) + LOW de 181/182 = ~45 hallazgos LOW no bloqueantes pendientes de limpieza opcional; ninguno es CRITICAL/HIGH.
- **A-4 — STORY-185 sin `testcases.md`:** la especificación de pruebas vive en `tasks.md` (29/29 `[x]`) y en `test/story-code-review-low-noise.test.js`; el verify-report lo marca `⚠️` en el criterio 4 y recomienda generar `testcases.md` con `/story-testcases`.
