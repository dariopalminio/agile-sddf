---
type: implement-report
id: STORY-177
slug: STORY-177-implement-report
title: "Implement Report: Corregir rutas de story-code-review"
story: STORY-177
created: 2026-11-08
updated: 2026-11-08
---

# Reporte de Implementación: Corregir rutas de story-code-review

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-177 |
| Total de tareas | 18 |
| Tareas completadas | 18 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-11-08 |
| Pruebas unitarias | `npm test`: 511/511 |
| Verificación determinista | `npm run verify:repository`: aprobado |
| Evals | Registrados (TC-008, TC-024, TC-025); no ejecutados, a criterio humano |
| fix-directives.md | no encontrado (ejecución inicial) |

**Estado:** ✅ Implementación completa

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Comprobar el estado de partida que cita design.md | ✓ completado | — |
| T002 | Añadir TC-024 `informes-parciales-en-directorio-de-historia` | ✓ completado | `skills/story-code-review/evals/evals.json` |
| T003 | Añadir TC-025 `checklist-de-guardrails-sin-enlace-en-constitucion` y reescribir TC-008 | ✓ completado | `skills/story-code-review/evals/evals.json` |
| T004 | Crear `test/story-code-review-paths.test.js` (RED: 4/4 fallidas) | ✓ completado | `test/story-code-review-paths.test.js` |
| T005 | Añadir `$STORY_ID` al bloque de contexto del Paso 3b | ✓ completado | `skills/story-code-review/SKILL.md` |
| T006 | Reescribir la descripción del Agente 4 (fuentes: glob `docs/guardrails/gr-*security*.md` + enlaces, skill instalado, baseline) | ✓ completado | `skills/story-code-review/SKILL.md` |
| T007 | Añadir la línea de informes parciales al mensaje de progreso | ✓ completado | `skills/story-code-review/SKILL.md` |
| T008 | Ruta `{story_id}/` + `$STORY_ID` + degradación F-3 en tech-lead-reviewer | ✓ completado | `skills/story-code-review/agents/tech-lead-reviewer.agent.md` |
| T009 | Idem en product-owner-reviewer | ✓ completado | `skills/story-code-review/agents/product-owner-reviewer.agent.md` |
| T010 | Idem en integration-reviewer | ✓ completado | `skills/story-code-review/agents/integration-reviewer.agent.md` |
| T011 | Idem en security-reviewer (incluida la ruta de la misión) | ✓ completado | `skills/story-code-review/agents/security-reviewer.agent.md` |
| T012 | Paso 2a: glob `docs/guardrails/gr-*security*.md` + enlaces deduplicados; descarte sin error | ✓ completado | `skills/story-code-review/agents/security-reviewer.agent.md` |
| T013 | Paso 2a: formato generalizado de línea de regla (método arbitrario, regla semántica `<archivo>:<línea>` LOW) | ✓ completado | `skills/story-code-review/agents/security-reviewer.agent.md` |
| T014 | `node --test test/story-code-review-paths.test.js` en verde | ✓ completado | — |
| T015 | Grep de rutas residuales y de `docs/policies/*security` | ✓ completado | — |
| T016 | Revisión manual de escenarios AC-2, AC-3 y F-3 | ✓ completado | — |
| T017 | `npm test`, `verify:repository`, UTF-8 sin BOM ni U+FEFF | ✓ completado | — |
| T018 | Registrar el comando de evals para criterio humano | ✓ completado | este archivo |

### Notas de implementación

- **TDD:** el test de `T004` se escribió y ejecutó en rojo (4/4 fallidas) antes de tocar `SKILL.md` ni los agentes (`T005`–`T013`); después quedó en verde 4/4.
- **`$STORY_ID`:** el orquestador lo pasa como primera variable del bloque de contexto del Paso 3b, con el valor del campo `id` del frontmatter de `story.md`. Cada agente lo declara en «Contexto recibido del orquestador» con la aclaración `{story_id}` = `$STORY_ID`.
- **Degradación F-3:** los cuatro agentes declaran en sus **Reglas**: si `$STORY_ID` falta o está vacío, no escriben ningún archivo, no crean el directorio de salida y devuelven el control al orquestador.
- **Paso 2a del Security-Reviewer:** glob `docs/guardrails/gr-*security*.md` bajo `$REPO_PATH` + checklists enlazados desde `$CONSTITUTION_PATH` o `$DOD_PATH` que existan, deduplicados por ruta relativa a `$REPO_PATH`; un checklist ilegible o sin líneas `- [ ]` se descarta sin error. Formato de línea generalizado: `- [ ] <regla> — <método>: \`<rule-id>\` (error|warn)` con método arbitrario; una línea sin método, id ni peso es regla semántica con id `<archivo>:<línea>` y severidad `LOW`. Los Pasos 2b, 2c y la tabla de normalización del Paso 4 no cambiaron.
- **Sin cambios fuera de alcance:** Pasos 3a y 4a de `SKILL.md`, `## Salida`, el contrato de `code-review-report.md` y las copias instaladas en `.claude/skills/` quedaron intactos (Non-Goals).

## Evidencia de verificación

### T014 — test de rutas (GREEN)

```
1..4
# tests 4
# suites 0
# pass 4
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 32.691574
```

Salida previa (RED, antes de `T005`–`T013`): `# pass 0` · `# fail 4`.

### T015 — grep de residuales

- `grep -rn "policies/\*security" skills/story-code-review/` → 1 hit: `evals/evals.json:941` (el `not_contains` de TC-025, exigido por D-4). Cero en Markdown.
- `grep -rnE "\.tmp/story-code-review/[a-z-]+-report\.md" skills/story-code-review/` → 4 hits, todos en `evals/evals.json` (el `not_contains` de TC-024, líneas 904–907). Cero en Markdown.
- Complemento: `grep -rn "\.tmp/story-code-review/" --include="*.md"` sin `{story_id}` solo deja `README.md:60` (`.tmp/story-code-review/STORY-NNN/`) y `examples/example-missing-artifacts/expected-output.md:27` (el directorio base), ambas correctas.

### T016 — escenarios manuales (línea del agente que resuelve cada uno)

| Escenario | Resolución | Agente / sección |
|---|---|---|
| AC-2 (solo `gr-code-security-checklist.md`, sin enlace en `constitution.md`) | el Paso 2a lo resuelve por el glob `docs/guardrails/gr-*security*.md` bajo `$REPO_PATH` y lo lista en `checklist-sources`; no cae al baseline. En este repo el glob resuelve exactamente `gr-code-security-checklist.md` y `gr-ai-security-checklist.md` | `security-reviewer.agent.md` Paso 2a; `SKILL.md` Agente 4 (orden de fuentes) |
| AC-3 (sin `gr-*security*` ni skill instalado) | 2a y 2b sin reglas → Paso 2c: `checklist-sources: [baseline-embebido]`; la revisión termina y el árbitro genera `code-review-report.md` | `security-reviewer.agent.md` Paso 2c |
| F-3 (`$STORY_ID` vacío) | cada revisor aplica su regla «no escribas ningún archivo, no crees el directorio de salida y devuelve el control» | los cuatro `agents/*.agent.md` (sección **Reglas**) |

### T017 — suite completa e integridad de archivos

- `npm test`: 511 tests, 511 pass, 0 fail.
- `npm run verify:repository`: «Verificación determinista del repositorio aprobada» (sintaxis, inventario de evals, contrato de validación, enlaces, cadena de suministro, release, smoke del tarball).
- Los 7 archivos modificados/creados inician en `2d 2d 2d` (los Markdown), `7b 0a 20` (`evals.json`) o `27 75 73` (el test): sin BOM `EF BB BF` y sin U+FEFF.

## Cumplimiento DoD — Fase IMPLEMENT

Fuente: `docs/guardrails/dod-story-implement.md` (`enforcement: error`).

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | Contratos verificados en `test/story-code-review-paths.test.js` (4/4). El comportamiento de punta a punta (AC-1, AC-2, AC-3) lo cubren TC-008, TC-024 y TC-025; los evals se ejecutan a criterio humano |
| 2 | Criterios no funcionales verificados | ✓ | CNF-1: test 4/4 + grep de residuales limpio en Markdown (los únicos hits son los `not_contains` de TC-024/TC-025, exigidos por D-4). CNF-2: evals añadidos antes de modificar el skill (RED antes de GREEN); `npm test` 511/511 y `verify:repository` aprobados |
| 3 | Comportamiento coincide con `design.md` | ✓ | Los cambios siguen D-1..D-5, I-1..I-6 y F-3 sin desviaciones |
| 4 | Sin regresiones | ✓ | `npm test` 511/511; `npm run verify:repository` aprobado |
| 5 | Convenciones de `constitution.md` | ✓ | Contratos en español, test con el estilo de `test/sddf-init-layout.test.js`, sin dependencias |
| 6 | Sin código comentado ni `TODO` | ✓ | El cambio es Markdown + 1 archivo de test; sin `TODO` ni código comentado |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | El test usa todos sus imports (`node:assert`, `node:fs`, `node:path`, `node:test`) |
| 8 | Linter y formateador sin errores | ✓ | `verify:repository` (sintaxis + contratos) aprobado |
| 9 | Sin dependencias nuevas sin aprobación | ✓ | `package.json` sin cambios |
| 10 | `skill-master` para skills nuevos | ✓ | N/A: no se crea ningún skill |
| 11 | Ruta de skill nuevo en `files` de `package.json` | ✓ | N/A: no se crea ningún skill |
| 12 | Se cumple `gr-ai-security-checklist` | ✓ | Sin comandos nuevos ni contenido remoto ejecutado; la degradación por `$STORY_ID` vacío está declarada en los cuatro agentes |
| 13 | Se cumple `gr-code-security-checklist` | ✓ | Sin secretos ni dependencias nuevas; el test resuelve rutas con `__dirname` (sin literales absolutos) |
| 14 | Se cumple `gr-skill-creation-checklist` | ✓ | N/A: `story-code-review` ya existía |
| 15 | Skills críticos con `evals/evals.json` | ✓ | `skills/story-code-review/evals/evals.json`: 25 casos; `verify:eval-inventory` OK |
| 16 | Casos de prueba ejecutados y evaluados automáticamente | ⚠️ | `npm run test:eval -- story-code-review --only TC-008,TC-024,TC-025` registrado; no ejecutado, a criterio humano (AGENTS.md) |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | T001–T018 marcadas |
| 18 | README o docs actualizados si cambian contratos | ✓ | `skills/story-code-review/README.md` y `examples/` ya usaban `.tmp/story-code-review/STORY-NNN/`; `docs/` sin referencias a las rutas retiradas |
| 19 | Decisiones de diseño no previstas documentadas | ✓ | Ninguna: se siguió `design.md` tal cual |
| 20 | CHANGELOG actualizado si aplica | ✓ | La release se gestiona en `epic-ship` de EPIC-28; esta historia no libera una versión independiente |
| 21 | Build de CI pasa sin errores | ⚠️ | Local: `npm test` 511/511 y `verify:repository` aprobados; CI remota no ejecutada |
| 22 | Sin secrets ni credenciales expuestos | ✓ | Diff revisado: rutas sintéticas, sin valores de credencial |
| 23 | Variables de entorno documentadas | ✓ | N/A: `$STORY_ID` es una variable de contexto que el orquestador resuelve de `story.md`, no una variable de entorno |
| 24 | Despliegue reversible sin pérdida de datos | ✓ | Cambios versionados en git; `.tmp/` nunca se versiona |

**Resumen:** 21/24 criterios ✓ · 3 ⚠️ · 0 ❌

---

## Evals pendientes (a criterio humano)

Comando registrado (T018, contratos 3, 4 y 5; AC-1, AC-2, AC-3):

```
npm run test:eval -- story-code-review --only TC-008,TC-024,TC-025
```

**Resultado:** no ejecutado, a criterio humano (AGENTS.md: las regresiones de evals se ejecutan manualmente para economizar cuota).

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.
Este skill genera el código pero no ejecuta ni verifica que los tests pasen.

Pasos recomendados:
1. Ejecutar `npm test` (ya ejecutado: 511/511).
2. Ejecutar `npm run test:eval -- story-code-review --only TC-008,TC-024,TC-025` y registrar el resultado aquí.
3. Ejecutar `/story-code-review STORY-177` cuando la historia avance a CODE-REVIEW.
