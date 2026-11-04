---
type: implement-report
id: STORY-128
slug: STORY-128-implement-report
title: "Implement Report: Evaluar la validación de épicas de forma repetible"
story: STORY-128
created: 2026-10-30
updated: 2026-10-30
---

# Reporte de Implementación: Evaluar la validación de épicas de forma repetible

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-128 |
| Total de tareas | 18 |
| Tareas completadas | 18 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-10-30 |

**Estado:** ✅ Implementación completa

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Verificar las precondiciones de CR-001 | ✓ completado | — (ver «Precondiciones verificadas») |
| T002 | Aplicar CR-002 en `story.md` (CNF-2), con confirmación del PO | ✓ completado | `specs/flow/STORY-128-evaluar-validacion-epica-repetible/story.md` |
| T003 | Aplicar CR-003 en `epic.md`, con confirmación del PO | ✓ completado | `specs/flow/EPIC-23-completar-flujo-de-epic/epic.md` |
| T004 | Crear `test/epic-validate-evals.test.js` (lectura, `declaredVerdict`, validadores puros) | ✓ completado | `test/epic-validate-evals.test.js` |
| T005 | G-A y G-B: cobertura de los tres veredictos | ✓ completado | `test/epic-validate-evals.test.js` |
| T006 | G-C: forma cerrada en todos los casos | ✓ completado | `test/epic-validate-evals.test.js` |
| T007 | G-D, G-E y G-F sobre el conjunto de regresión | ✓ completado | `test/epic-validate-evals.test.js` |
| T008 | Pruebas negativas con manifiestos en memoria (V-7) | ✓ completado | `test/epic-validate-evals.test.js` |
| T009 | Caso `regresion-veredicto-approved` (TC-023) | ✓ completado | `skills/epic-validate/evals/evals.json` |
| T010 | Caso `regresion-veredicto-historia-no-terminal` (TC-024) | ✓ completado | `skills/epic-validate/evals/evals.json` |
| T011 | Caso `regresion-veredicto-smoke-no-ejecutable` (TC-025) | ✓ completado | `skills/epic-validate/evals/evals.json` |
| T012 | Caso `regresion-veredicto-precedencia` (TC-026) | ✓ completado | `skills/epic-validate/evals/evals.json` |
| T013 | Revisión de los cuatro casos nuevos | ✓ completado | — |
| T014 | Forma cerrada en los casos existentes (C2) | ✓ completado | `skills/epic-validate/evals/evals.json` |
| T015 | `node --test test/epic-validate-evals.test.js` (V-6, V-7) | ✓ completado | — (9/9 pasan) |
| T016 | `npm run verify:repository` y `npm test` (V-8); UTF-8 sin BOM y LF | ✓ completado | — |
| T017 | Registrar la verificación manual de evals (V-1…V-5) | ✓ completado | este reporte |
| T018 | `graphify update .` | ✓ completado | `graphify-out/` |

Fuera de las tareas, se agregó la entrada de STORY-128 en `CHANGELOG.md` (`[Unreleased] › Added`) y CR-004 en `design.md`.

---

## Precondiciones verificadas (T001)

| Precondición (CR-001) | Resultado | Evidencia |
|---|---|---|
| `skills/epic-validate/SKILL.md` y `evals/evals.json` existen (STORY-124) | ✓ | ambos presentes; `evals.json` tenía TC-001…TC-022 |
| `--mode auto`, `OPE-01` con `check-command` y `not-executable` → `SMOKE-N` `no ejecutable` → `OPE-01 bloqueada` (STORY-125) | ✓ | `SKILL.md` Paso 3b (tabla de `MODO`, fila «Motor → `not-executable`»; resultado `bloqueada`) |
| `created` sigue inmediatamente a `verdict` en el template seed (D-3) | ✓ | `skills/epic-validate/assets/epic-validate-report-template.md`, líneas 6–7 |
| Motivos con el marcador `[<VALOR>]` | ✓ | `SKILL.md` Paso 5, clave `motivos`: `### M-NNN [<VALOR>] — <comprobación>: <elemento>` |

STORY-126 también está implementada; los casos no dependen de ella (D-6).

## Decisiones del PO (T002, T003)

- **CR-002 aplicado:** CNF-2 dice ahora «los resultados no dependen de servicios externos, salvo el runner de evals, ni de comandos reales: el resultado de cada comando lo fija el propio caso».
- **CR-003 aplicado:** la línea de `epic.md` › Notas › «Alineación pendiente» ya decía «STORY-126 a STORY-128» (no «STORY-124 a STORY-128», como citaba el diseño); quedó «STORY-126 a STORY-127». No se tocó ninguna otra línea.

## Forma cerrada en los casos existentes (T014)

Se aplicó a los 16 casos que afirman un veredicto (TC-001…TC-004, TC-006…TC-016 y TC-018). No se cambiaron `input`, `name`, `description` ni las demás aserciones.

| Cambio | Casos |
|---|---|
| `verdict: <V>` → `verdict: <V>\ncreated:` | los 16 |
| Se agregó `` **Veredicto:** `<V>` `` en `contains` | TC-006…TC-016 y TC-018 (TC-001…TC-004 ya la tenían) |
| Se agregaron los otros dos `` **Veredicto:** `<O>` `` en `not_contains` | los 16 |
| `threshold` `0.95` → `1` | los 16 |

Ningún `not_contains` existente choca con la forma cerrada. Los `not_contains` previos más amplios (`verdict: BLOCKED`, `NEEDS-CHANGES`` ` ``) se conservaron. Con `threshold: 0.95` y menos de 20 aserciones, un `contains` que faltaba ya hacía fallar el caso; el cambio a `1` deja explícito que la forma cerrada no admite fallos parciales (CNF-3). Los casos sin veredicto (TC-005, TC-017, TC-019…TC-022) no cambian.

## Decisiones no previstas (CR-004 de design.md)

- `threshold` vive en el caso, no en `expected`: G-C lo comprueba en ambos lugares.
- Las respuestas simuladas de STORY-125/126 usan `maintainer_answers`: G-E rechaza esa clave además de `user_answers`.
- `command_results` incluye `npm run verify:release`, el comando que ejecuta el Paso 3c.
- Tres mensajes de C3 sin fila en la tabla de Interfaces (G-D con otro veredicto, G-F con una URL, G-A con `cases[]` vacío).

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | AC-1 y AC-2 se demuestran ejecutando TC-023…TC-026, que consume cuota y queda a criterio humano (`AGENTS.md`). La parte determinista de AC-3 pasa en `npm test` |
| 2 | Criterios no funcionales verificados | ✓ | CNF-1 (G-B), CNF-2 (G-E, G-F, `command_results`) y CNF-3 (G-C) los comprueba `test/epic-validate-evals.test.js` sobre el `evals.json` real |
| 3 | El comportamiento coincide con `design.md` | ✓ | C1, C2 y C3 según el diseño; las desviaciones menores están en CR-004 |
| 4 | Sin regresiones | ⚠️ | `npm test` 377/377 y `npm run verify:repository` aprobados. Los evals TC-001…TC-026 no se ejecutaron: requieren ejecución de tests, no evaluable por story-implement |
| 5 | Convenciones de `constitution.md` | ✓ | La prueba sigue el estilo de `test/sddf-init-layout.test.js` (`node:test`, `assert/strict`, `REPO_ROOT`) |
| 6 | Sin código comentado ni `TODO` | ✓ | Revisión de `test/epic-validate-evals.test.js` |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | Revisión de `test/epic-validate-evals.test.js` |
| 8 | Linter y formateador sin errores | ✓ | `npm run verify:repository` aprobado (el repositorio no tiene un linter aparte) |
| 9 | Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| 10 | `skill-master` para skills nuevos | ✓ | No aplica: no se creó ningún skill |
| 11 | Ruta del skill nuevo en `files` de `package.json` | ✓ | No aplica: no se creó ningún skill |
| 12 | Se cumple gr-ai-security-checklist | ✓ | Los casos describen un mundo simulado; ninguna entrada contiene URLs ni instrucciones (G-F) |
| 13 | Se cumple gr-code-security-checklist | ✓ | La prueba solo lee un archivo del repositorio; no hay secretos, red ni ejecución de comandos |
| 14 | Se cumple gr-skill-creation-checklist | ✓ | No aplica: `SKILL.md` no cambia |
| 15 | Los skills críticos tienen `evals/evals.json` | ✓ | `skills/epic-validate/evals/evals.json` con 26 casos |
| 16 | Casos de prueba ejecutados y evaluados automáticamente | ⚠️ | Requiere ejecución de tests (`npm run test:eval`), no evaluable por story-implement; ver «Verificación pendiente» |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 18/18 |
| 18 | README o docs actualizados si cambian APIs o contratos | ✓ | No cambia ninguna API ni contrato público (Non-Goals de `design.md`) |
| 19 | Decisiones de diseño no previstas documentadas en `design.md` | ✓ | CR-004 |
| 20 | CHANGELOG actualizado si aplica | ✓ | `CHANGELOG.md` › `[Unreleased]` › Added |
| 21 | Build de CI pasa (build + tests + lint) | ⚠️ | Requiere ejecución de CI. Localmente pasan `npm run verify:repository` (el mismo gate de `quality.yml`) y `npm test` |
| 22 | Sin secrets ni credenciales | ✓ | Revisión del diff |
| 23 | Variables de entorno documentadas | ✓ | No se agregan variables de entorno |
| 24 | Despliegue reversible sin pérdida de datos | ✓ | Solo cambian un JSON de evals, una prueba y documentos versionados |

**Resumen:** 20/24 criterios ✓ (4 ⚠️, 0 ❌)

---

## Verificación pendiente de ejecución manual (T017)

A criterio humano (`AGENTS.md`), para V-1…V-5:

```bash
npm run test:eval -- epic-validate --only TC-023,TC-024,TC-025,TC-026
```

Ejecutarlo **dos veces seguidas** con los mismos artefactos. En ambas ejecuciones, cada caso debe obtener su veredicto sin preguntas:

| Caso | Nombre | Veredicto esperado |
|---|---|---|
| TC-023 | `regresion-veredicto-approved` | `APPROVED` |
| TC-024 | `regresion-veredicto-historia-no-terminal` | `NEEDS-CHANGES` |
| TC-025 | `regresion-veredicto-smoke-no-ejecutable` | `BLOCKED` |
| TC-026 | `regresion-veredicto-precedencia` | `NEEDS-CHANGES` |

Como T014 endureció las aserciones de los casos previos, conviene ejecutar también la suite completa (`npm run test:eval -- epic-validate`) antes de entregar.

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.
`test/epic-validate-evals.test.js` ya se ejecutó en esta sesión (9/9, y `npm test` 377/377). Los evals de `epic-validate` no se ejecutaron.

Pasos recomendados:
1. Ejecutar el suite de tests del proyecto
2. Si algún test falla, revisar el código generado y ajustar manualmente
3. Consultar `design.md` para verificar que la implementación respeta las interfaces definidas
