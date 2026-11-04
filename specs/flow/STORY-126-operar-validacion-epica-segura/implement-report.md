---
type: implement-report
id: STORY-126
slug: STORY-126-implement-report
title: "Implement Report: Operar la validación de épicas de manera segura"
story: STORY-126
created: 2026-10-30
updated: 2026-10-31
---

# Reporte de Implementación: Operar la validación de épicas de manera segura

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-126 |
| Total de tareas | 24 |
| Tareas completadas | 0 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 24 |
| Fecha de implementación | 2026-10-31 (rework, ronda 1) |

**Estado:** ✅ Implementación completa

Rework encolado por `story-code-review` (`fix-directives.md`, ronda 1, `NEEDS-CHANGES`). No había tareas pendientes: el trabajo de esta ejecución son las correcciones del pre-paso 2f.

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Precondición CR-002: STORY-124 y STORY-125 presentes | ✓ completado (ejecución anterior) | — |
| T002 | CR-001 en `story.md` (AC-4 y «Contenido equivalente») | ✓ completado (ejecución anterior) | — |
| T003 | Paso 1: contrato de invocación | ✓ completado (ejecución anterior) | — |
| T004 | Paso 1: cinco errores de invocación en orden | ✓ completado (ejecución anterior) | — |
| T005 | Paso 1.2: resolución de `MODO` y `MODO_ORIGEN` | ✓ completado (ejecución anterior) | — |
| T006 | Interacción por modo y `<epica>` ausente en `auto` | ✓ completado (ejecución anterior) | — |
| T007 | Sección «Política de efectos» | ✓ completado (ejecución anterior) | — |
| T008 | Guardia de previsualización (C4) | ✓ completado (ejecución anterior) | — |
| T009 | Veredicto: `no ejecutada` sin efecto | ✓ completado (ejecución anterior) | — |
| T010 | Paso 5: previsualización, campos volátiles y reglas de orden | ✓ completado (ejecución anterior) | — |
| T011 | Paso 6: bloque de resultado | ✓ completado (ejecución anterior) | — |
| T012 | Parámetros, Modos de ejecución, Salida y `description` | ✓ completado (ejecución anterior) | — |
| T013 | Eval V-1 → TC-014 | ✓ completado (ejecución anterior) | — |
| T014 | Eval V-2 → TC-015 | ✓ completado (ejecución anterior) | — |
| T015 | Eval V-3 → TC-016 | ✓ completado (ejecución anterior) | — |
| T016 | Eval V-4 → TC-017 | ✓ completado (ejecución anterior) | — |
| T017 | Eval V-5 → TC-018 | ✓ completado (ejecución anterior) | — |
| T018 | Evals V-6 y V-7 → TC-019…TC-022 | ✓ completado (ejecución anterior) | — |
| T019 | Tamaño, codificación y mensajes literales | ✓ completado (ejecución anterior) | — |
| T020 | Verificación pendiente de STORY-169 | ✓ completado (ejecución anterior) | — |
| T021 | `verify:layout`, `verify:validation-contract`, `verify:eval-inventory` | ✓ completado (ejecución anterior) | — |
| T022 | `npm test` y `npm run verify:repository` | ✓ completado (ejecución anterior) | — |
| T023 | `graphify update .` | ✓ completado (ejecución anterior) | — |
| T024 | Evals y recorrido manual registrados como pendientes | ✓ completado (ejecución anterior) | — |

---

## Correcciones de fix-directives.md (ronda 1)

| # | Archivo:Línea | Severidad | Resultado |
|---|---|---|---|
| 1 | skills/epic-validate/SKILL.md:349 | HIGH | 💻 corregido: `skills/epic-validate/SKILL.md` y `specs/flow/STORY-126-operar-validacion-epica-segura/story.md` (fuera de la lista blanca, con aprobación del PO) |
| 2 | skills/epic-validate/evals/evals.json:1109,1206 | MEDIUM | 💻 corregido: `skills/epic-validate/evals/evals.json` |
| 3 | skills/epic-validate/evals/evals.json:1429-1541 | MEDIUM | 💻 corregido: `skills/epic-validate/evals/evals.json` |
| 4 | docs/guardrails/dod-story-code-review.md:21 | HIGH | Se resuelve con los hallazgos 1–3; el guardrail no se modificó. Requiere repetir `/story-code-review STORY-126` |
| 5 | docs/guardrails/dod-story-code-review.md:25 | HIGH | Depende del nuevo veredicto de `/story-code-review STORY-126`; el guardrail no se modificó |

**Detalle por hallazgo:**

- **#1 — Límite STORY-126 / STORY-127.** El PO eligió actualizar la especificación de forma trazable en vez de retirar el gateway, porque STORY-127 ya está implementada y aprobada y CS-7 de EPIC-23 ya incluye su escritura.
  - `story.md`: AC-4, CNF-2 y la nota CS-7 recogen la excepción del gateway (solo `status`, `substatus` y `updated` de `epic.md`, con la épica en `VALIDATE`). Se añadió una nota de alineación con la fecha y la aprobación del PO.
  - `SKILL.md`: la tabla de la Política de efectos separa la columna «Reporte escrito (validación)» (STORY-126) de la columna «`epic.md` (gateway, Paso 5b)» (STORY-127). La «Excepción del gateway» indica ahora su origen y aclara que el contenido del reporte no depende del gateway.
  - En el Paso 5.6, la escritura del reporte figura como la única de la validación.
  - Se resolvió también el hallazgo LOW de integración: ADR-0017 → ADR-0019 en el Paso 0.
- **#2 — Estado `VALIDATE` y política de escrituras observables.**
  - Nuevos TC-040 (`--mode auto`, `APPROVED`) y TC-041 (`--mode manual`, `BLOCKED`), con la épica en `VALIDATE/IN-PROGRESS`. Cada uno asevera los dos archivos escritos y el frontmatter exacto de `epic.md` (cambian solo `status`, `substatus` y `updated`; no cambian `title`, `created` ni el cuerpo), además de su línea `Gateway:`.
  - TC-014 y TC-015 aseveran ahora `Gateway: sin cambio` cuando la épica no declara `status`.
- **#3 — Repetición equivalente completa.**
  - TC-018 incluye el reporte previo completo (`previous_report.content`) y compara cada línea fija del reporte nuevo. Solo pueden variar `updated`, la fila `Fecha` y las duraciones medidas.
  - Nuevos TC-042 (repetición desde `VALIDATE/DONE` con `APPROVED`: el reporte es equivalente y `epic.md` no se escribe) y TC-043 (repetición desde `VALIDATE/IN-PROGRESS` con `NEEDS-CHANGES`: el reporte es equivalente y el frontmatter exacto pasa a `DEVELOP/IN-PROGRESS`).
  - `evals.json` pasa a la versión 1.6.0, con 43 casos.

**Archivos corregidos:** `skills/epic-validate/SKILL.md`, `skills/epic-validate/evals/evals.json`, `specs/flow/STORY-126-operar-validacion-epica-segura/story.md`
**Hallazgos omitidos por archivo inexistente:** ninguno

---

## Verificaciones pendientes

- **Evals (criterio humano según AGENTS.md):** `npm run test:eval -- epic-validate --only TC-014,TC-015,TC-018,TC-040,TC-041,TC-042,TC-043`. Las comparaciones línea a línea de TC-018, TC-042 y TC-043 se basan en la lectura literal del template seed. Si la redacción del runner difiere en una celda que el `SKILL.md` no fija, hay que revisar el `expected` antes de cambiar el skill.
- **Recorrido manual:** `/epic-validate EPIC-23 --dry-run` y `/epic-validate EPIC-23 --mode rapido` dejan `git status` sin cambios.
- **Code review:** repetir `/story-code-review STORY-126` (hallazgos #4 y #5).

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin de `story.md` pasan | ⚠️ | Requiere ejecución de tests — no evaluable por story-implement (`npm run test:eval` manual) |
| 2 | Criterios no funcionales verificados | ⚠️ | CNF-1 (TC-018, TC-042, TC-043) y CNF-2 con su excepción (TC-040…TC-043) especificados; requieren ejecución de evals |
| 3 | El comportamiento coincide con `design.md` | ✓ | C1…C9 sin cambios de comportamiento; la Política de efectos solo hace explícito el origen de la columna del gateway (STORY-127) |
| 4 | Sin regresiones | ✓ | `npm test` 439/439 y `npm run verify:repository` aprobado |
| 5 | Convenciones de `constitution.md` | ✓ | Español, Markdown + JSON, sin código nuevo |
| 6 | Sin código comentado ni `TODO` | ✓ | No se agregó código |
| 7 | Sin variables, imports ni funciones sin usar | ✓ | No se agregó código |
| 8 | Linter y formateador sin errores | ✓ | `verify:repository` aprobado |
| 9 | Sin dependencias nuevas | ✓ | `package.json` sin cambios |
| 10 | `skill-master` para skills nuevos | ✓ | No aplica: skill existente |
| 11 | Ruta de skill nuevo en `files` de `package.json` | ✓ | No aplica |
| 12 | Se cumple gr-ai-security-checklist | ✓ | La cláusula de contenido untrusted no cambia; los fixtures no traen instrucciones |
| 13 | Se cumple gr-code-security-checklist | ✓ | Sin código ni secretos nuevos |
| 14 | Se cumple gr-skill-creation-checklist | ✓ | `SKILL.md` 480 líneas (< 500), `description` sin cambios, UTF-8 sin BOM con LF |
| 15 | Los skills críticos tienen `evals/evals.json` | ✓ | 43 casos (versión 1.6.0) |
| 16 | Casos de prueba ejecutados automáticamente | ⚠️ | Requiere ejecución de tests — `npm run test:eval -- epic-validate` es manual (AGENTS.md); `test/epic-validate-evals.test.js` (forma cerrada G-C) pasa |
| 17 | `tasks.md` con todas las tareas `[x]` | ✓ | 24/24 |
| 18 | Docs actualizadas si cambian contratos | ✓ | `SKILL.md` (Política de efectos, Paso 5.6) y `story.md` (AC-4, CNF-2, CS-7) |
| 19 | Decisiones no previstas documentadas en `design.md` | ⚠️ | La decisión de alineación con STORY-127 está en `story.md` (Notas) y en este reporte; `design.md` no está en la lista blanca de `fix-directives.md` |
| 20 | CHANGELOG actualizado | ⚠️ | No se actualizó: `CHANGELOG.md` no está en la lista blanca y el rework no añade capacidad pública |
| 21 | Build de CI pasa | ⚠️ | Requiere ejecución de CI; el gate local equivalente (`verify:repository`) pasa |
| 22 | Sin secretos ni credenciales | ✓ | Fixtures sin credenciales |
| 23 | Variables de entorno documentadas | ✓ | No se agregan variables |
| 24 | Despliegue reversible | ✓ | Solo Markdown y JSON |

**Resumen:** 18/24 criterios ✓ · 6 ⚠️ · 0 ❌

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.
Este skill genera el código pero no ejecuta ni verifica que los tests pasen.

Pasos recomendados:
1. Ejecutar `npm run test:eval -- epic-validate`
2. Si algún caso falla, revisar `SKILL.md` o el `expected` del caso y ajustar manualmente
3. Consultar `design.md` para verificar que la implementación respeta las interfaces definidas
