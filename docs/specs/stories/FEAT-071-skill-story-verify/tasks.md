---
alwaysApply: false
type: tasks
id: FEAT-071
slug: FEAT-071-skill-story-verify-tasks
title: "Tasks: Skill story-verify — Orquestar la fase VERIFY de pruebas de una historia"
story: FEAT-071
design: FEAT-071
created: 2026-05-15
updated: 2026-05-15
related:
  - FEAT-071-skill-story-verify
---

<!-- Referencias -->
[[FEAT-071-skill-story-verify]]
[[FEAT-071-skill-story-verify-design]]

## 1. Scaffolding — Estructura de directorios

- [x] 1.1 Crear la estructura de directorios del skill: `.claude/skills/story-verify/`, `assets/`, `agents/`, `examples/pytest-project/tests/`, `examples/jest-project/src/__tests__/`, `examples/no-tests-project/src/`, `evals/`

## 2. Template del reporte de verificación

- [x] 2.1 Escribir `assets/verify-report-template.md` con las secciones definidas en la historia: Metadata (story-id, fecha, modo, versión DoD), Summary (tabla total/passed/failed/skipped/coverage), Test Scope (checkboxes unit/integration/E2E/performance/security), Findings por severidad (CRITICAL/HIGH/MEDIUM/LOW con location/steps/expected/actual/fix), Coverage Analysis, DoD VERIFY criteria (lista con estado), Recommendations, Sign-off, Historial de ejecuciones anteriores
- [x] 2.2 Copiar o crear `$SPECS_BASE/specs/templates/verify-report-template.md` como ubicación canónica del template (SKILL.md lee primero esta ruta, con fallback a `assets/verify-report-template.md`)

## 3. Agente QA Engineer

- [x] 3.1 Escribir `agents/qa-engineer.agent.md` con rol de QA Engineer y dos modos de operación: (a) **modo manual**: leer `qa-input.json` con la lista de escenarios Gherkin y criterios DoD, guiar al usuario escenario por escenario solicitando resultado PASS/FAIL/BLOCKED + observaciones, escribir `qa-output.json` con `scenario_results` y `findings`; (b) **modo e2e-assessment**: evaluar la estrategia de prueba E2E y reportar gaps de cobertura de escenarios. El agente no accede directamente a archivos de la historia.

## 4. Orquestador principal (SKILL.md)

- [x] 4.1 Escribir `SKILL.md` con frontmatter YAML estandarizado (name, description, triggers, outputs) e instrucciones completas de orquestación cubriendo los 5 flujos del diseño:
  - **(a) Precondición (AC-4):** leer frontmatter de story.md; si status ≠ READY-FOR-VERIFY y ≠ IMPLEMENT/DONE → emitir mensaje de error específico y terminar sin modificar archivos
  - **(b) Inicio:** actualizar story.md → VERIFY/IN-PROGRESS
  - **(c) Lectura DoD (D-6):** leer `$SPECS_BASE/policies/definition-of-done-story.md`, extraer sección VERIFY; si no existe → usar criterios mínimos genéricos + advertencia
  - **(d) Detección de modo (D-2):** buscar en este orden: skill de testing personalizado en `.claude/skills/` → modo delegado; playwright.config/cypress.config/cucumber → modo e2e; pytest.ini/jest.config/etc. → modo unit; ninguno → modo manual
  - **(e) Ejecución de pruebas (AC-1, AC-2):** invocar comando detectado; si duración >30s mostrar progreso cada 15s; recopilar resultados
  - **(f) Modo manual (AC-3):** crear `.tmp/story-verify/qa-input.json`; invocar `qa-engineer.agent.md`; leer `qa-output.json`
  - **(g) Generación de reporte (D-5):** leer template de verify-report; si verify-report.md existe, extraer sección Historial; completar template con resultados; escribir verify-report.md
  - **(h) Evaluación DoD y transición de estado (D-4, AC-5):** evaluar criterios DoD contra resultados; si todos pasan → story.md: VERIFY/DONE; si alguno falla → story.md: substatus BLOCKED; mostrar resumen

## 5. Ejemplos de prueba

- [x] 5.1 [P] Crear `examples/pytest-project/` con: `pytest.ini`, `tests/test_auth.py` con un test que pasa y uno que falla (para verificar el flujo AC-5 BLOCKED además del AC-1)
- [x] 5.2 [P] Crear `examples/jest-project/` con: `jest.config.js`, `src/__tests__/auth.test.js` con tests básicos para verificar detección del modo `automatico-unit` en stack Node.js
- [x] 5.3 [P] Crear `examples/no-tests-project/` con: solo archivos fuente sin configuración de tests (pytest.ini, jest.config, etc. ausentes) para verificar activación del modo `manual` (AC-3)

## 6. Verificación de criterios de aceptación

- [x] 6.1 Verificar AC-1: ejecutar skill sobre `examples/pytest-project/` con historia en READY-FOR-VERIFY/DONE y confirmar que genera verify-report.md con Summary, Test Scope, DoD criteria y que story.md se actualiza a VERIFY/DONE (si todos los tests del ejemplo pasan)
- [x] 6.2 Verificar AC-2: simular proyecto con `playwright.config.ts` y confirmar que SKILL.md detecta modo `automatico-e2e`, ejecuta suite E2E y registra resultados PASS/FAIL/SKIP por escenario Gherkin en verify-report.md
- [x] 6.3 Verificar AC-3: ejecutar skill sobre `examples/no-tests-project/` y confirmar que qa-engineer.agent.md es invocado en modo manual, guía escenario por escenario y los resultados ingresados manualmente quedan registrados en verify-report.md
- [x] 6.4 Verificar AC-4: ejecutar skill sobre una historia con status IMPLEMENT/IN-PROGRESS y confirmar que el mensaje de error es "La historia <ID> tiene status IMPLEMENT/IN-PROGRESS. Ejecuta story-code-review antes de continuar." y que ningún archivo es creado ni modificado
- [x] 6.5 Verificar AC-5: ejecutar skill sobre `examples/pytest-project/` con el test fallido activo y confirmar que verify-report.md tiene sección Findings con el defecto, story.md queda con substatus BLOCKED y se muestra "VERIFY BLOQUEADO: se encontraron N defectos."
- [x] 6.6 Verificar AC-7 (idempotencia): ejecutar story-verify dos veces sobre la misma historia y confirmar que la segunda ejecución sobreescribe verify-report.md pero preserva la entrada de la primera ejecución en la sección "Historial de ejecuciones anteriores"
- [x] 6.7 Verificar AC-8 (DoD dinámico): modificar la sección VERIFY en definition-of-done-story.md añadiendo un nuevo criterio y re-ejecutar el skill; confirmar que el nuevo criterio aparece evaluado en verify-report.md sin modificar SKILL.md
- [x] 6.8 Verificar mitigaciones de riesgos (INC-001): al completar la tarea 4.1 (SKILL.md), revisar la tabla `Risks / Trade-offs` de `design.md` y confirmar que cada mitigación está implementada: (a) detección de config no estándar → SKILL.md cae en modo `manual` como fallback; (b) tests que tardan >30s → SKILL.md muestra progreso cada 15s; (c) E2E no mapeables a escenarios Gherkin por nombre → se registran como SKIP con nota explicativa; (d) sección VERIFY no encontrada en DoD → SKILL.md usa criterios mínimos genéricos y emite advertencia; (e) directorio `.tmp/story-verify/` no puede crearse → SKILL.md aborta con mensaje de error de permisos
- [x] 6.9 Verificar AC-13: Seguir lineamientos de `skill-master`.md 

## 7. Documentación y evals

- [x] 7.1 [P] Escribir `README.md` del skill con: descripción del propósito, precondiciones requeridas, modos de ejecución (automatico-unit, automatico-e2e, manual, delegado), flags aceptados (--mode, --dry-run, --verbose), cómo extender los criterios de verificación editando el DoD
- [x] 7.2 [P] Escribir `evals/eval-mode-detection.md` con benchmarks para verificar la detección correcta del modo de ejecución dado: pytest.ini, jest.config, playwright.config, cypress.config, cucumber.js/features/, y directorio sin configuración de tests
