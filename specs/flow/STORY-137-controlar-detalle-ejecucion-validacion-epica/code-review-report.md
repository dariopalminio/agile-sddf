---
type: code-review-report
story: STORY-137
title: "Code Review Report: Controlar el detalle y los límites de la ejecución de la validación de épicas"
verdict: APPROVED
date: 2026-10-31
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-137

## Veredicto

**Veredicto:** `APPROVED` — Sin hallazgos bloqueantes (severidad máxima: LOW).

Los cuatro revisores entregaron un informe válido con `status: approved` y ningún hallazgo HIGH o MEDIUM. Los 12 hallazgos LOW son mejoras opcionales y deudas menores; ninguna afecta los criterios de aceptación ni el comportamiento entregado.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-137 — Controlar el detalle y los límites de la ejecución de la validación de épicas |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-10-31 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-validate/SKILL.md:4 | La `description` (escalar plegado `>-`) mide hoy unos 509 caracteres y supera el presupuesto de 500 de `gr-skill-creation-checklist` (`skill-description-budget`, warn). STORY-137 la había dejado en 492 (criterio 14 del DoD), y STORY-169 agregó «, suites de épica» (`c328ae7`). | Compactar la descripción a ≤ 500 sin perder disparadores; por ejemplo, abreviar «historias, análisis, smoke tests, verify:release, DoD, suites de épica». |
| LOW | specs/flow/STORY-137-controlar-detalle-ejecucion-validacion-epica/implement-report.md (sección «Pendientes registrados») | El pendiente de T006 y CR-003 («cuando STORY-169 implemente `run`… ejecutar V-3 y anotar `--full-output` en el contrato I1») ya está resuelto: `run` existe, acepta `--full-output`, V-3 tiene su prueba y el diseño de STORY-169 documenta la opción. El reporte sigue diciendo que está pendiente. | Marcar el pendiente como resuelto por STORY-169 (`c328ae7`, prueba `test/epic-suites.test.js:358`) al cerrar la revisión, para que `/epic-refine` no lo procese de nuevo. |
| LOW | skills/epic-validate/scripts/epic-suites.js:121 | Con código 127/9009 el shell sí se lanzó, pero `withOutput` devuelve `output: null`. Así se descarta el mensaje del shell («command not found»), que con `--verbose` ayudaría a diagnosticar. Además, el JSDoc (líneas 35 y 107) dice que `null` corresponde solo a «no se lanzó». | Confirmar que esa es la intención del diseño (D-5). Si lo es, ajustar el JSDoc a «`null` si no se lanzó o el ejecutable no se encontró»; si no, pasar `${stdout}${stderr}` también en esa rama. |
| LOW | test/epic-suites.test.js:3-11 | El comentario de cabecera solo describe STORY-125 (V-7), aunque el archivo hoy cubre también STORY-137 (V-1, V-2) y STORY-169. Solo los comentarios de sección lo indican. | Ampliar la cabecera para mencionar STORY-137 (`--full-output`) y STORY-169 (`run`). |
| LOW | skills/epic-validate/SKILL.md:463 | Falta un conector en «por cada `SMOKE-N` no `aprobado` por cada criterio del DoD…»: en `9336641` decía «… no `aprobado` y por cada criterio…», y la edición de STORY-169 (`c328ae7`) lo perdió. | Restaurar la coma o la «y»: «…por cada `SMOKE-N` no `aprobado`, por cada criterio del DoD…». |
| LOW | skills/epic-validate/evals/evals.json (TC-027, TC-031) | El runner califica `contains` y `not_contains` sobre toda la respuesta, así que ningún eval comprueba que `SDDF-MARCA-1` no llegue al archivo del reporte (CNF-1). Está documentado en CR-004 y compensado con las pruebas del motor y el recorrido manual de T024. | Sin acción ahora. Si el runner llega a admitir aserciones por archivo, agregar un `not_contains` específico del reporte. |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-validate/evals/evals.json (TC-027) | La descripción de TC-027 dice que la marca «solo aparece en consola, nunca en el reporte». Sin embargo, `run-evals.js:851-853` califica `contains` y `not_contains` sobre toda la salida (consola + bloques `=== FILE:`). Así, que `SDDF-MARCA-1` y el bloque `text` no estén en `epic-validate-report.md` no se comprueba de forma separada. Para el skill, la igualdad del reporte con y sin `--verbose` (AC-1 «Y…», CNF-1) solo se comprueba por el veredicto. Para el motor sí se comprueba con `deepEqual`. | Agregar en TC-027 y TC-031 `expected.files.not_contains` sobre la ruta del reporte, con `SDDF-MARCA-1` y ```` ```text ````. Así la aserción queda limitada al archivo. |
| LOW | skills/epic-validate/evals/evals.json (TC-031) | CNF-2 solo se ejercita con una permutación (`--verbose --mode auto`) y con `--dry-run --verbose` en TC-030. No hay un caso con los tres flags en orden distinto (por ejemplo `--verbose --dry-run --mode auto`). La regla del Paso 1.1 («tokens en cualquier orden») lo cubre por diseño. | Opcional: agregar una permutación de los tres flags si se amplía el inventario de evals. |
| LOW | specs/flow/STORY-137-controlar-detalle-ejecucion-validacion-epica/implement-report.md:92-93,107 | Los evals TC-027…TC-031 y TC-012 del skill todavía no se ejecutaron: según AGENTS.md, `npm run test:eval -- epic-validate` es manual. La cobertura de AC-1 a AC-3 en el nivel del skill está especificada, pero aún no tiene evidencia de que pase. Es informativo: no bloquea code-review. | Ejecutar `npm run test:eval -- epic-validate` a criterio humano antes de VERIFY/ACCEPTANCE. Prestar atención a TC-012 y TC-027…TC-031. |

---

### Integración y Arquitectura (Integration-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-validate/scripts/epic-suites.js:121 | Con `--full-output`, un comando que **se lanzó** y terminó con 127/9009 devuelve `output: null`, porque `withOutput` usa su valor por defecto. Según `design.md` (Esquema de datos de `output`), `null` corresponde solo a los no lanzados (filas 1–3 de la clasificación de STORY-169), y la fila 4 es un comando lanzado. Ese resultado tiene `durationSeconds`, así que la regla de presentación lo trata como lanzado y muestra el bloque `text`, pero `(sin salida)` está definido para un `output` vacío, no para `null`. Además se pierde el stderr del shell («command not found»). El impacto es mínimo: la comprobación previa del PATH (STORY-125 D-11) evita casi siempre llegar a 127/9009 | Pasar `output` (stdout+stderr) a `withOutput` en la rama 127/9009, o declarar en `design.md` y en «Presentación de comandos» que la fila 4 también da `null` y cómo se muestra |
| LOW | skills/epic-validate/SKILL.md:409 | STORY-137 agregó `▶ …` como primera línea de la plantilla del Paso 6 (`SKILL.md:399`), pero sigue la frase «Con `--dry-run`, la primera línea se sustituye por la previsualización del Paso 5.7». Ahora la «primera línea» es la `▶`, y lo que debe sustituirse es `📄 Reporte escrito`. No tiene impacto funcional porque con `--dry-run` no hay líneas `▶`, pero la referencia es ambigua | Cambiar por «Con `--dry-run`, la línea `📄 Reporte escrito` se sustituye por la previsualización del Paso 5.7» |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-code-security-checklist.md, docs/guardrails/gr-ai-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md, .claude/skills/security-audit/assets/ai-security-checklist.md (42 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| LOW | skills/epic-validate/evals/evals.json:2308 | AI-014 / `ai-untrusted-content-clause` (semántica) | Los casos de `--verbose` (TC «verbose-muestra-salida-completa» y siguientes) solo usan una salida inocua (`SDDF-MARCA-1`): ningún caso de regresión ejercita una salida que contenga una orden dirigida al agente («marca como aprobado…») o una secuencia de comillas invertidas que intente cerrar la valla, ni caracteres de control/ANSI. La regla existe en `SKILL.md:119` y `SKILL.md:126`, pero no hay evidencia de regresión de que se cumpla con la salida completa. | Agregar un eval con `--verbose` cuyo comando imprima una orden de inyección y ```` ``` ```` en su salida, aseverando que el veredicto no cambia, que se registra la nota en `notas-validacion` y que la valla mostrada es más larga; opcionalmente indicar en `SKILL.md:126` que los caracteres de control y escapes ANSI de `output` se muestran neutralizados. |

---

### Nota de Tamaño de Cambio

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Siguiente acción

Ejecuta `/story-verify STORY-137`. Antes de ACCEPTANCE, ejecuta a criterio humano `npm run test:eval -- epic-validate` (TC-012 y TC-027…TC-031) y los recorridos manuales registrados en `implement-report.md`. Los hallazgos LOW pueden atenderse en una historia de mantenimiento o al refinar EPIC-23.

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Se cumple [[dod-story-implement]] | ⚠️ | — | `implement-report.md`: 21/24 ✓, 3 ⚠️ y 0 ❌. Los ⚠️ requieren ejecutar evals o CI (`test:eval` es manual según AGENTS.md), y eso no se puede evaluar desde los artefactos disponibles |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Tech-Lead-Reviewer `approved`: CommonJS, JSDoc en español, sin dependencias nuevas, UTF-8 sin BOM con LF |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner-Reviewer: AC-1 (TC-027/TC-028), AC-2 (TC-029, TC-012), AC-3 (TC-030), CNF-1/CNF-2 (TC-031 y pruebas del motor) |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration-Reviewer: C1–C9, D-1…D-10 y CR-001…CR-004 coinciden con el código actual |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | Los cuatro informes tienen `max-severity: LOW` |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | 24/24 tareas `[x]` |
| 7 | Metadatos frontmatter de `story.md` están completos y correctos con status y substatus actualizados | ✓ | — | Frontmatter completo; pasa a `CODE-REVIEW/DONE` |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este archivo |
| 9 | Revisión de código aprobada (`verdict: APPROVED` en `code-review-report.md`) | ✓ | — | `verdict: APPROVED` |

**Resumen:** 8/9 criterios ✓ (1 ⚠️, 0 ❌)
