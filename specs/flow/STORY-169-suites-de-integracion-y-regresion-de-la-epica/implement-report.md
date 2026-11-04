---
type: implement-report
id: STORY-169
slug: STORY-169-implement-report
title: "Implement Report: Suites de integración y regresión de la épica"
story: STORY-169
created: 2026-10-30
updated: 2026-10-30
---

# Reporte de Implementación: Suites de integración y regresión de la épica

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-169 |
| Total de tareas | 27 |
| Tareas completadas | 27 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-10-30 |

**Estado:** ✅ Implementación completa

El skill `epic-validate` y su motor `epic-suites.js` (`check-command`) ya existían porque STORY-124, STORY-125, STORY-126, STORY-127 y STORY-137 se entregaron antes. Esta historia agrega:

- el subcomando `run` del motor;
- la comprobación `OPE-04` (suites de nivel épica);
- la sección `suites-epica` del reporte;
- 8 casos de eval.

El DoD de épica (C4) ya lo evalúa `OPE-03`, de STORY-125: CR-002 quedó resuelto en `epic.md`. Los ajustes respecto del diseño están en `design.md › Notas de implementación (2026-10-30)`.

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Cabecera del motor `epic-suites.js` | ✓ completado (ya existía: se amplió con `run`) | `skills/epic-validate/scripts/epic-suites.js` |
| T002 | Archivo de pruebas y helpers de fixture | ✓ completado (ya existía: se agregaron `verifyYaml` y `writeConfig`) | `test/epic-suites.test.js` |
| T003 | `readEpicSuites` (lector de `verify` sin librería YAML) | ✓ completado | `test/epic-suites.test.js`, `skills/epic-validate/scripts/epic-suites.js` |
| T004 | Detección previa de script npm | ✓ completado (reutiliza `precheckCommand` de STORY-125; probado a través de `run`) | `test/epic-suites.test.js` |
| T005 | `classifyCommand` | ✓ completado (ya existía; `run` la reutiliza) | `test/epic-suites.test.js` |
| T006 | Subcomando `run` → `SuitesResult` | ✓ completado | `test/epic-suites.test.js`, `skills/epic-validate/scripts/epic-suites.js` |
| T007 | Paridad `check-command` ↔ `run` (V-6) | ✓ completado | `test/epic-suites.test.js` |
| T008 | Parseo de argumentos de `run` (salida 2) | ✓ completado | `test/epic-suites.test.js`, `skills/epic-validate/scripts/epic-suites.js` |
| T009 | No escritura de `run` (V-9) | ✓ completado | `test/epic-suites.test.js` |
| T010 | Escenarios AC-1 y AC-3 a nivel motor | ✓ completado | `test/epic-suites.test.js` |
| T011 | Dependencias y restricciones del SKILL.md | ✓ completado | `skills/epic-validate/SKILL.md` |
| T012 | Paso 3e «Suites de nivel épica» (`OPE-04`) | ✓ completado | `skills/epic-validate/SKILL.md` |
| T013 | Paso «DoD de validación de épica» | ✓ completado (sin cambios: lo cubre `OPE-03` de STORY-125) | — |
| T014 | Regla del veredicto y motivos con `OPE-04` | ✓ completado | `skills/epic-validate/SKILL.md` |
| T015 | Sección `suites-epica` del template | ✓ completado | `skills/epic-validate/assets/epic-validate-report-template.md` |
| T016 | Sección `dod-epica` del template | ✓ completado (sin cambios: ya existía) | — |
| T017 | Eval AC-1 | ✓ completado | `skills/epic-validate/evals/evals.json` (TC-032) |
| T018 | Evals AC-2 (cuatro ejemplos) | ✓ completado | `skills/epic-validate/evals/evals.json` (TC-033 a TC-036) |
| T019 | Eval AC-3 | ✓ completado | `skills/epic-validate/evals/evals.json` (TC-037) |
| T020 | Evals AC-4 | ✓ completado (TC-006 y TC-011 ya cubrían «no existe» e «incumplido») | `skills/epic-validate/evals/evals.json` (TC-038, TC-039) |
| T021 | CR-005 en `story.md` | ✓ completado | `story.md` |
| T022 | CR-004 en el índice de `epic.md` | ✓ completado | `specs/flow/EPIC-23-completar-flujo-de-epic/epic.md` |
| T023 | CR-002 y CR-003 en las Notas de `epic.md` | ✓ completado | `specs/flow/EPIC-23-completar-flujo-de-epic/epic.md` |
| T024 | `node --test test/epic-suites.test.js` y `npm test` | ✓ completado (30/30 y 394/394) | — |
| T025 | `npm run verify:repository` | ✓ completado (`[OK] Verificación determinista del repositorio aprobada.`) | — |
| T026 | Motor sobre este repositorio | ✓ completado (evidencia abajo) | — |
| T027 | Evals pendientes de ejecución manual | ✓ completado (ver «Verificación pendiente») | — |

También se modificaron `CHANGELOG.md` (entrada en `[Unreleased] › Added`) y `design.md` (notas de implementación).

### Evidencia de T026

`node skills/epic-validate/scripts/epic-suites.js run --repo-root .` → código de salida 0:

| Suite | Required | Comando | `outcome` | Duración | `reason` | Registro en el reporte |
|---|---|---|---|---|---|---|
| integration | `true` | `node scripts/verify-fixed-layout.js` | `pass` | 0.5 s | — | `pasa` |
| e2e | `false` | `npm run test:e2e:smoke` | `not-executable` | — | `script npm test:e2e:smoke no declarado en package.json` | `omitida` |
| e2e-regression | `false` | `npm run test:e2e:regression` | `not-executable` | — | `script npm test:e2e:regression no declarado en package.json` | `omitida` |

`warnings: []`. Con la configuración actual, `OPE-04` = `cumple`.

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | Motor: AC-1 a AC-3 probados con `node --test` (30/30). La composición del veredicto (AC-2, AC-3, AC-4) depende del agente: TC-032 a TC-039 están pendientes de ejecución manual |
| 2 | Criterios no funcionales verificados | ✓ | CNF-1: los comandos se leen de `verify` en runtime (prueba con el `sddf.config.yaml` real) y el DoD, de la ruta fija. CNF-2: tabla de efecto del Paso 3e y TC-035. CNF-3: ningún código selecciona ni comprueba un entorno (regla «Entorno de las suites») |
| 3 | El comportamiento coincide con `design.md` | ✓ | Contratos I1, `SuitesResult`, clasificación y tabla de efecto implementados. Ajustes documentados en `design.md › Notas de implementación` |
| 4 | No hay regresiones | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement. Se ejecutaron en T024/T025: `npm test` 394/394 y `verify:repository` OK |
| 5 | Convenciones de `constitution.md` | ✓ | JS CommonJS sin dependencias y con el mismo estilo que el motor existente; documentos en español |
| 6 | Sin código comentado ni `TODO` | ✓ | No se agregaron |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | Se refactorizó la desestructuración de `runSuites`; todas las exportaciones tienen prueba |
| 8 | Linter y formateador sin errores | ⚠️ | El repositorio no tiene linter; `verify:syntax` (dentro de `verify:repository`) pasa |
| 9 | Sin dependencias nuevas | ✓ | Solo `fs`, `path` y `child_process` |
| 10 | `skill-master` para skills nuevos | ✓ | No aplica: no se creó ningún skill |
| 11 | Ruta del skill nuevo en `package.json › files` | ✓ | No aplica: `skills/` ya está incluido y el tarball del gate contiene el motor |
| 12 | [[gr-ai-security-checklist]] | ✓ | La salida de las suites es dato no confiable (sección `ai-untrusted-content-clause` y regla «Entorno de las suites»). En `--mode auto` no se pregunta nada |
| 13 | [[gr-code-security-checklist]] | ✓ | Ejecución con shell solo de comandos versionados del proyecto (excepción documentada en STORY-125 D-12). El lector YAML devuelve `null` ante algo que no entiende, nunca un comando inferido |
| 14 | [[gr-skill-creation-checklist]] | ✓ | La descripción y las secciones del SKILL.md se mantienen. `verify:repository` (contrato de validación, layout, eval inventory) pasa |
| 15 | Skills críticos con `evals/evals.json` | ✓ | 8 casos nuevos (TC-032 a TC-039), versión 1.5.0 |
| 16 | Casos de prueba ejecutados automáticamente | ⚠️ | `npm run test:eval -- epic-validate` queda para ejecución manual a criterio humano (AGENTS.md) |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 27/27 |
| 18 | Docs de contratos públicos actualizados | ✓ | SKILL.md, template del reporte y CHANGELOG |
| 19 | Decisiones no previstas documentadas en `design.md` | ✓ | Sección «Notas de implementación (2026-10-30)» |
| 20 | CHANGELOG actualizado | ✓ | `[Unreleased] › Added`, entrada de STORY-169 |
| 21 | Build de CI pasa | ⚠️ | Requiere ejecución de CI — no evaluable por story-implement. El gate local equivalente (`verify:repository`) pasa |
| 22 | Sin secretos ni credenciales | ✓ | No hay |
| 23 | Variables de entorno documentadas | ✓ | No se agregan. CNF-3 documenta que el comando de una suite resuelve su propio entorno |
| 24 | Despliegue reversible | ✓ | Solo cambian archivos versionados; no hay datos ni migraciones |

**Resumen:** 19/24 criterios ✓ · 5 ⚠️ · 0 ❌

---

## Verificación pendiente

- **V-7 (evals):** `npm run test:eval -- epic-validate --only TC-032` … `TC-039` (o el skill completo) para validar la composición del veredicto. Ejecución manual a criterio humano (AGENTS.md). Los casos simulan la salida de `run` en `input.suites_result`.
- **Observaciones para `story-code-review`:**
  - Los evals TC-001 a TC-031 no declaran las suites en `verify`. En `--mode auto`, ahora `OPE-04` queda `omitida` con advertencia, sin efecto en el veredicto. Ninguna aserción existente lo contradice, pero conviene confirmarlo al ejecutar los evals.
  - CR-003 (semántica fuera de `--mode auto`) está registrado en `epic.md` como pendiente de confirmar al refinar la épica.

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto. En esta ejecución se corrieron `node --test test/epic-suites.test.js`, `npm test` y `npm run verify:repository`, y pasaron; los evals siguen pendientes.

Pasos recomendados:
1. Ejecutar el suite de tests del proyecto
2. Si algún test falla, revisar el código generado y ajustar manualmente
3. Consultar `design.md` para verificar que la implementación respeta las interfaces definidas
