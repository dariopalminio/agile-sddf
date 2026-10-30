---
type: code-review-report
story: STORY-166
title: "Code Review Report: Veredicto de epic-format-validation"
verdict: APPROVED
date: 2026-10-30
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-166

## Veredicto

**Veredicto:** `APPROVED` — Sin hallazgos bloqueantes (severidad máxima: LOW).

Los cuatro revisores entregaron informes válidos con estado `approved` y solo hallazgos LOW: la implementación cumple D-1…D-9 de `design.md`, los cuatro escenarios Gherkin tienen cobertura observable y el DoD CODE-REVIEW no tiene criterios incumplidos (8 ✓, 1 ⚠️ no bloqueante).

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-166 — Veredicto de epic-format-validation |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-10-30 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-format-validation/SKILL.md:279 | El texto sobre el fallo de escritura dice que un invocador automático «no encuentra un `verdict` actualizado y aplica G-06». Eso solo es cierto si no existía un reporte previo. Si ya había uno, el archivo queda en disco con el `verdict` anterior, quizá `APPROVED`. `epic-creation` Paso 7 (skills/epic-creation/SKILL.md:287) y `epic-from-project-plan` Fase 3 leen solo el frontmatter y no tienen en cuenta el aviso `⚠️ El reporte existente está obsoleto`, así que podrían aprobar una épica con un veredicto obsoleto. Es un caso límite que design.md F-5 contempla solo como aviso. | Elegir una de dos opciones. (a) Borrar o invalidar el reporte previo antes de escribir el nuevo, para que un fallo deje el reporte ausente. (b) Indicar en los invocadores que el aviso de reporte obsoleto, o un `updated` anterior a la ejecución, cuenta como no aprobado (G-06). |
| LOW | test/verify-validation-contract.test.js:237 | `row.includes(...)` se llama sin comprobar antes que `row` existe. Si falta la fila, la prueba falla con un `TypeError` y no con un mensaje de aserción. El resto de la prueba sí usa mensajes, como `'falta la fila de epic-format-validation en §4'`. | Añadir `assert.ok(row, 'falta la fila de epic-format-validation en la tabla §4');` antes de la línea 237. |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-format-validation/evals/evals.json:17 | AC-1 exige que no aparezca ninguno de `APROBADO`, `REFINAR` ni `RECHAZADO`, pero el `not_contains` de TC-001 omite `REFINAR`. Lo mismo ocurre en TC-006 (l.94), TC-011 (l.179) y TC-014 (l.230). TC-005 (l.77) omite también `REFINAR`. | Añadir `REFINAR` al `not_contains` de los casos que esperan `APPROVED`. |
| LOW | skills/epic-format-validation/evals/evals.json:263 | AC-2: el tercer `Entonces` ("diagnóstico suficiente para que /epic-improve aplique las correcciones sin volver a analizar") solo está respaldado por el template y el ejemplo estáticos. TC-016 no afirma la ubicación (`línea 23`, `tras ## Historias`) ni la corrección esperada (`añadir ## Criterios de salida`, forma F1/F2/F3). Tampoco incluye `RECHAZADO` en `not_contains`. | Añadir a `contains` de TC-016 un literal de ubicación y uno de corrección esperada (p. ej. `Línea 23`, `se esperaba`), y `RECHAZADO` a `not_contains`. |
| LOW | skills/epic-format-validation/evals/evals.json:31 | AC-3: TC-002 comprueba la ruta buscada y la ausencia de veredicto, pero no que la ejecución termine con error (el marcador `❌ Épica no encontrada` no se afirma). La condición "sin reporte" no se puede verificar con `contains`. | Añadir `Épica no encontrada` a `contains` de TC-002. |
| LOW | specs/flow/STORY-166-veredicto-de-epic-format-validation/implement-report.md:70 | AC-1, AC-2 y AC-3 solo tienen cobertura con evals, que siguen pendientes de ejecución manual (política de AGENTS.md, no es un defecto de la implementación). | Ejecutar `npm run test:eval -- epic-format-validation` (TC-001, TC-002, TC-016) antes de ACCEPTANCE. |

---

### Integración y Arquitectura (Integration-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-format-validation/SKILL.md:279 | Fallo de escritura (F-5): el SKILL.md afirma que «un invocador automático no encuentra un `verdict` actualizado y aplica G-06», pero `epic-creation` (Paso 7, `skills/epic-creation/SKILL.md:284`) y `epic-from-project-plan` (`skills/epic-from-project-plan/SKILL.md:77`) leen el `verdict` del frontmatter del reporte sin comprobar si está actualizado. Si quedaba un reporte anterior con `APPROVED` (p. ej. al sobrescribir un directorio en `epic-creation`) y la escritura falla, el invocador leería el `APPROVED` obsoleto. El aviso `⚠️ El reporte existente está obsoleto` solo llega a la consola. | Indicar en el Paso 7 de `epic-creation` y en la Fase 3 de `epic-from-project-plan` que un aviso `⚠️ No se pudo escribir …` del gate se trata como no aprobado, o que se compare `updated:` del reporte con la fecha de la ejecución, como ya hace `epic-improve` (Paso 3.2). |
| LOW | skills/epic-generate-stories/SKILL.md:0 | FR-027 (actualizado en esta historia) y el flowchart (`dec_def -->\|APPROVED\| epic-generate-stories`) presentan el gate como precondición de la generación de historias, pero `epic-generate-stories` no lee `epic-format-validation-report.md` ni su `verdict`. Es una brecha que ya existía y que la historia no introduce: D-8 solo cubre a los consumidores del vocabulario. | Fuera del alcance de STORY-166. Registrar un CR o una historia para que `epic-generate-stories` aplique G-06 sobre el reporte, o aclarar en FR-027 que la precondición es de proceso y no se hace cumplir. |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-code-security-checklist.md, docs/guardrails/gr-ai-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md (68 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| LOW | skills/epic-format-validation/SKILL.md:68 | gr-code-security (semántica: ruta derivada de argumento confinada al repo) / gr-ai-security (semántica: no operar fuera del directorio de trabajo) | La historia convierte el skill de solo lectura en uno que escribe `epic-format-validation-report.md` en `<EPIC_DIR>` (Paso 5). Para el input Tipo A (línea 101), la ruta se usa "directamente", sin exigir que esté resuelta y confinada a `REPO_ROOT`. Una ruta con `..` o absoluta haría que el agente leyera y escribiera el reporte fuera del repositorio. El impacto es bajo: el usuario elige la ruta y solo se escribe un reporte con nombre fijo. | En el Tipo A, resolver la ruta contra `REPO_ROOT` y rechazarla con el error "Épica no encontrada" si queda fuera del repositorio, o limitar el Tipo A a `specs/flow/EPIC-*/epic.md`. |

---

### Nota de Tamaño de Cambio

⚠️ Nota informativa: tamaño de cambio elevado (18 archivos modificados). Considera ejecutar /story-split antes de futuras historias similares para reducir el alcance. Esta nota es informativa y no afecta la decisión de este review.

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Siguiente acción

1. Ejecuta `/story-verify STORY-166` para la fase VERIFY.
2. Antes de ACCEPTANCE, ejecuta manualmente `npm run test:eval -- epic-format-validation` (TC-001, TC-002, TC-016): AC-1…AC-3 solo están cubiertos por evals.
3. Opcional (no bloqueante): atender los hallazgos LOW. El más relevante es el reporte obsoleto ante un fallo de escritura (señalado por dos revisores), que conviene anotar como CR o historia junto con la brecha de `epic-generate-stories`.

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|---|---|---|---|
| 1 | Se cumple [[dod-story-implement]] | ⚠️ | — | `implement-report.md`: 16/24 ✓, 8 ⚠️, 0 ❌. Los ⚠️ requieren CI, evals manuales o revisiones formales de checklist: no evaluables desde los artefactos disponibles. |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Tech-Lead e Integration: estilo coherente con los archivos vecinos, kebab-case, frontmatter requerido y `SDDF-FIXED-LAYOUT: v1` conservado. |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner: AC-4 → prueba determinista (9/9 en verde); AC-1 → TC-001/005/006/011/014; AC-2 → TC-016 y ejemplo; AC-3 → TC-002. |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration: los 11 componentes de «Componentes afectados» están implementados en las rutas declaradas, conforme a D-1…D-9. |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | Severidad máxima en los cuatro informes: LOW. |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | 29/29 tareas `[x]`; las dos coincidencias de `[ ]` son texto citado dentro de T016 y T018. |
| 7 | Metadatos frontmatter de `story.md` están completos y correctos con status y substatus actualizados | ✓ | — | Frontmatter completo; pasa a `CODE-REVIEW/DONE` al cerrar esta revisión. |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este archivo. |
| 9 | Revisión de código aprobada (`verdict: APPROVED` en `code-review-report.md`) | ✓ | — | `verdict: APPROVED`. |

**Resumen:** 8/9 criterios ✓ · 1 ⚠️ · 0 ❌
