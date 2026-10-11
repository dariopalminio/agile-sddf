---
type: implement-report
id: STORY-121
slug: STORY-121-implement-report
title: "Implement Report: Verificar que cada criterio de salida y smoke test de una épica está cubierto por sus historias"
story: STORY-121
created: 2026-10-08
updated: 2026-10-08
---

# Reporte de Implementación: Verificar que cada criterio de salida y smoke test de una épica está cubierto por sus historias

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-121 |
| Total de tareas | 21 |
| Tareas completadas | 21 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-10-08 |

**Estado:** ✅ Implementación completa

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Comprobar dependencia de STORY-120 y registrar la línea base | ✓ completado | `.tmp/story-implement/STORY-121/baseline.txt` |
| T002 | Línea base de `npm test`, `verify:eval-inventory`, `verify:links` y evals | ✓ completado | `.tmp/story-implement/STORY-121/baseline.txt` |
| T003 | Completar los mundos de TC-001…TC-010, TC-026, TC-027 con un contrato de salida cubierto por E1 | ✓ completado | `skills/epic-analyze/evals/evals.json` |
| T004 | Añadir TC-011…TC-015 (AC-1 y filas de AC-2) | ✓ completado | `skills/epic-analyze/evals/evals.json` |
| T005 | Añadir TC-016…TC-018 (límites E1/E2, `CANCELED`, idempotencia) | ✓ completado | `skills/epic-analyze/evals/evals.json` |
| T006 | Validar JSON, dry-run (21 casos) y commit RED solo de evals | ✓ completado | commit `555f706` |
| T007 | Sección `cobertura-salida` y conteo en `resumen` del template seed | ✓ completado | `skills/epic-analyze/assets/epic-analyze-report-template.md` |
| T008 | Universo de historias (Paso 4.6): `status` + cuerpo, exclusión de `CANCELED` | ✓ completado | `skills/epic-analyze/SKILL.md` |
| T009 | Cláusula `ai-untrusted-content-clause` ampliada al cuerpo de los `story.md` | ✓ completado | `skills/epic-analyze/SKILL.md` |
| T010 | Paso 5b: extracción del contrato por clave y estados de sección | ✓ completado | `skills/epic-analyze/SKILL.md` |
| T011 | Regla de evidencia E1 → E2 con los cinco ejemplos de D-4 | ✓ completado | `skills/epic-analyze/SKILL.md` |
| T012 | Catálogo SAL-01…SAL-04, combinación y orden conjunto con INT | ✓ completado | `skills/epic-analyze/SKILL.md` |
| T013 | Relleno de la clave `cobertura-salida` y del conteo de `resumen` (Paso 7) | ✓ completado | `skills/epic-analyze/SKILL.md` |
| T014 | Disparadores en `description`, `Objetivo`; I-1, I-3 y veredicto sin cambio | ✓ completado | `skills/epic-analyze/SKILL.md` |
| T015 | Revisión: 294 líneas, sin títulos como encabezado, sin `.tmp/`, solo lectura | ✓ completado | — |
| T016 | Entrada de `/epic-analyze` ampliada en `CHANGELOG.md` | ✓ completado | `CHANGELOG.md` |
| T017 | `domain-epic-lifecycle` §8 (fila del gate) y párrafo de §9 | ✓ completado | `docs/domains/domain-epic-lifecycle.md` |
| T018 | Checklist de skills y orden de commits (evals antes de `SKILL.md`) | ✓ completado | — |
| T019 | `npm run test:eval -- epic-analyze`: 21/21 PASS | ✓ completado | `.tmp/skill-test-evals/epic-analyze/report-20261009.md` |
| T020 | Ejecución real sobre EPIC-22 sin escribir `epic.md`/`story.md` | ✓ completado | `.tmp/story-implement/STORY-121/epic-analyze-report-EPIC-22.md` |
| T021 | Comprobaciones deterministas finales y codificación | ✓ completado | — |

---

## Decisiones no previstas (registradas en `design.md` › CR-005)

- **TC-006:** su mundo no tiene `story.md`, así que no hay contrato que pueda cubrirse. Su `input` declara un template de épica sin las claves `criterios-salida`/`smoke-tests` (regla desactivada de D-5); sus aserciones no cambian.
- **TC-028:** el mundo «solo placeholder» de TC-014 pasa a un caso propio, porque cada caso simula un único mundo. El inventario queda en 21 casos, no en los 20 de T006.
- **Smoke tests mal formados con ≥ 2 encabezados sin ID:** D-2 no fijaba la etiqueta. `SKILL.md` asigna `SMOKE-<posición>` `(implícito)` y deja una nota.
- **Autoría:** `SKILL.md` y el template seed se editaron directamente siguiendo el contrato de `gr-skill-creation-checklist` (0 incumplimientos de frontmatter). No se lanzó `skill-master`, porque las evals ya estaban escritas y el skill existía.

## Ejecución real sobre EPIC-22 (T020)

Veredicto `BLOCKED`: `Contrato de salida: 5/8 cubiertos`, sin hallazgos INT y 3 `SAL-01`:
- CS-1 (`SKILL.md` existe y resuelve la raíz…, línea 31) y CS-6 (`files` de `package.json`, línea 36): ninguna historia los verifica en un AC. STORY-120 solo los menciona en sus CNF.
- CS-3 (tabla de cobertura **y** un hallazgo por elemento sin cubrir, línea 33): el AC-1 de STORY-121 afirma solo la tabla (`parcial`).

Es el riesgo documentado en `design.md` › Risks: no es un defecto del skill. Para cubrirlos, basta citar esos criterios (E1) en los `story.md` que los entregan, o ajustar los criterios de la épica.

**Observación para code review:** E1 aplicado a smokes casa el token `SMOKE-N` en cualquier línea del cuerpo. En EPIC-22, `SMOKE-1` y `SMOKE-2` quedan «cubiertos» por STORY-121 porque su AC usa esos IDs en ejemplos sobre `EPIC-30-ejemplo`. `SMOKE-2` está además cubierto por STORY-120 por la vía E2, y `SMOKE-1` no tiene otra cobertura no parcial. La regla es la de D-4 y se aplicó literalmente. Endurecerla (por ejemplo, excluir los bloques `gherkin` de los AC de E1) sería un cambio de diseño.

El reporte se generó y se movió fuera de la épica (no se versiona). La ejecución la hizo la misma sesión que implementó, así que la segunda pasada de idempotencia de T020 es evidencia débil. CNF-3 queda cubierto por TC-008 y TC-018 con un ejecutor independiente.

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ✓ | AC-1 → TC-011; AC-2 filas 1–4 → TC-012, TC-013, TC-014/TC-028, TC-015; 21/21 PASS |
| 2 | Criterios no funcionales verificados | ✓ | CNF-1 → TC-011/TC-016 (citas `AC-n`/`mención · story.md:`); CNF-2 → `not_contains` de bloques FILE en todos los casos + T020; CNF-3 → TC-018 |
| 3 | El comportamiento coincide con `design.md` | ✓ | D-1…D-9 implementados; desviaciones registradas en CR-005 |
| 4 | Sin regresiones | ✓ | TC-001…TC-010, TC-026, TC-027 conservan sus aserciones y pasan; `npm test` 219/219 |
| 5 | Convenciones de `constitution.md` | ✓ | Skill en español, UTF-8 sin BOM, evals antes que `SKILL.md` (principio 11) |
| 6 | Sin código comentado ni `TODO` | ✓ | `grep TODO\|FIXME` vacío en los archivos del skill |
| 7 | Sin variables/imports/funciones sin usar | ✓ | Solo Markdown/JSON; no hay código ejecutable nuevo |
| 8 | Linter y formateador sin errores | ⚠️ | El repo no tiene linter genérico; JSON validado y `verify-eval-inventory` OK |
| 9 | Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| 10 | Se usó `skill-master` para crear skills nuevos | ⚠️ | No aplica: no se crea un skill nuevo; se amplió `epic-analyze` editándolo directamente (ver Decisiones) |
| 11 | Skill nuevo incluido en `files` de `package.json` | ✓ | No aplica (skill existente); `"skills/"` ya lo publica |
| 12 | Se cumple `gr-ai-security-checklist` | ✓ | Cláusula de contenido no confiable ampliada al cuerpo de los `story.md` (D-7) |
| 13 | Se cumple `gr-code-security-checklist` | ✓ | Sin código ejecutable, secretos ni URLs nuevas |
| 14 | Se cumple `gr-skill-creation-checklist` | ✓ | 294 líneas < 500; script de frontmatter: 0 incumplimientos; sin rutas absolutas ni URLs. `description` tiene 385 caracteres: dentro del límite de 500, por encima del objetivo de 350 |
| 15 | Skills críticos con `evals/evals.json` | ✓ | 21 casos |
| 16 | Casos de prueba ejecutados automáticamente | ✓ | `npm run test:eval -- epic-analyze`: 21/21 PASS (sonnet) |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 21/21 |
| 18 | Docs actualizadas si cambian contratos | ✓ | `domain-epic-lifecycle` §8/§9; nueva clave `cobertura-salida` en el template seed |
| 19 | Decisiones no previstas documentadas en `design.md` | ✓ | CR-005 |
| 20 | CHANGELOG actualizado | ✓ | `[Unreleased]` › `Added`, entrada de `/epic-analyze` |
| 21 | Build de CI pasa | ⚠️ | Requiere ejecución de CI: no evaluable por story-implement. En local: `npm test` y `verify:eval-inventory` OK; `verify:links` con los mismos 2 enlaces rotos de la línea base, ajenos a esta historia |
| 22 | Sin secrets ni credenciales | ✓ | Ninguno |
| 23 | Variables de entorno documentadas | ✓ | Ninguna nueva |
| 24 | Despliegue reversible | ✓ | Cambios solo en Markdown/JSON, reversibles con git |

**Resumen:** 21/24 criterios ✓ (3 ⚠️, 0 ❌)

---

## Nota sobre los Tests Generados

Las evals se ejecutaron con `npm run test:eval -- epic-analyze` (21/21 PASS). Si se modifica `SKILL.md` en code review, hay que volver a ejecutarlas.
