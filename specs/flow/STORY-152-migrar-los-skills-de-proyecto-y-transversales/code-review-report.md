---
type: code-review-report
story: STORY-152
title: "Code Review Report: Migrar los skills de proyecto y transversales"
verdict: APPROVED
date: 2026-10-23
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-152

## Veredicto

**Veredicto:** `APPROVED` — Sin hallazgos bloqueantes (severidad máxima: LOW).

Los cuatro revisores entregaron un informe válido y aprobaron el cambio, con 12 hallazgos LOW en total. Ninguno es HIGH ni MEDIUM. Los criterios DoD CODE-REVIEW no tienen ningún ❌.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-152 — Migrar los skills de proyecto y transversales |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-10-23 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Recomendación |
|---|---|---|---|---|---|
| 1 | skills/memory-system/scripts/memory-system.js:374 | Calidad / consistencia | LOW | Si una historia archivada (`specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/story.md`) no declara `slug`, `deriveSlug` toma el nombre del directorio con el prefijo de fecha. Eso contradice la regla de `header-aggregation` (D-7: slug sin el prefijo). `check` ya informa `falta slug` en ese caso, así que no hay impacto funcional. | Quitar el prefijo `^\d{4}-\d{2}-\d{2}-` al derivar el slug en la capa `specs-archive` y cubrirlo en S152-UT-001, o documentar la divergencia en `references/memory-rules.md`. |
| 2 | skills/memory-system/scripts/memory-system.js:396 | Mantenibilidad | LOW | `deriveNode` recalcula la raíz flow para cada nodo, aunque `scanFlowNodes` (l. 505) ya la tiene en `flowDir`. | Pasar `flowDir` en `options` desde `scanFlowNodes` para que la regla viva en un solo sitio. |
| 3 | skills/memory-system/scripts/memory-system.js:106 | Compatibilidad | LOW | Con la capa nueva `specs-archive`, `index` termina con exit 2 cuando un `--template` propio no declara `{layer:specs-archive}` y ya hay historias archivadas. Este cambio incompatible para templates personalizados todavía no figura en el CHANGELOG (aplazado a STORY-154, CR-003). | Al cerrar CR-003 en STORY-154, incluirlo en la entrada BREAKING del CHANGELOG y en la guía de migración. |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Recomendación |
|---|---|---|---|---|---|
| 1 | skills/skill-preflight/evals/evals.json:52 | requirements-coverage | LOW | La no mutación que exige AC-2 solo se comprueba por el texto de la salida | Verificar en el eval real que el árbol queda igual |
| 2 | skills/skill-preflight/evals/evals.json:37 | requirements-coverage | LOW | Faltan los casos de L2 sola y L3 sola | Opcional: añadir un caso con una señal aislada distinta de L1 |
| 3 | skills/skill-preflight/evals/evals.json:22 | requirements-coverage | LOW | AC-2 y AC-3 dependen de evals de LLM que todavía no se ejecutaron | Ejecutar `npm run test:eval -- skill-preflight` a criterio humano |
| 4 | scripts/verify-fixed-layout.js:26 | requirements-coverage | LOW | CNF-1 se cumple en el alcance de la historia, pero en todo el repo solo cuando se migren los `story-*` | Informativo: confirmarlo al cierre de EPIC-26 |
| 5 | CHANGELOG.md:17 | requirements-coverage | LOW | Nada impide que `docs-wiki-builder` reaparezca (AC-4) | Opcional: añadir el término prohibido al gate |

Escenarios verificados: AC-1 y AC-4 de forma determinista (gate, pruebas y greps); AC-2 y AC-3 en el contrato de `skill-preflight/SKILL.md` y en los evals TC-005–TC-007, que todavía no se ejecutaron. CNF-1, CNF-2 y CNF-3 se cumplen.

---

### Integración y Arquitectura (Integration-Reviewer)

| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Recomendación |
|---|---|---|---|---|---|
| 1 | docs/architecture/memory-system.md:60, 141, 216, 455 | Coherencia con ADR-0016 | LOW | El documento sigue diciendo que `docs/` es «configurable vía `sddf.config.yaml` (`root:`)» y menciona `SPECS_BASE`, lo que contradice ADR-0016. D-14 y CR-003 lo derivan a STORY-154, así que no es una desviación del diseño. | Confirmar que el alcance de STORY-154 incluye estas cuatro líneas. |
| 2 | skills/memory-system/references/dod-rules.md:95-96 | Consistencia interna del skill | LOW | `dod-rules.md` usa la notación `<REPO_ROOT>/<--cli-root>/skills` y `SKILL.md:334` usa `<CLI_ROOT>/skills`. Son equivalentes. | Opcional: unificar con `<CLI_ROOT>/skills`. |
| 3 | skills/project-planning/assets/agents/planning.md:30 | Conformidad con D-2 | LOW | La implementación prohíbe escribir «en `docs/` y en `specs/`», mientras que D-2 solo menciona `docs/`. Es una ampliación coherente que no está registrada en CR-004. | Opcional: registrarla en CR-004 de `design.md`. |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-code-security-checklist.md, docs/guardrails/gr-ai-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md (41 reglas evaluadas)

| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Recomendación |
|---|---------------|-----------|-----------|----------|---------------|
| 1 | skills/skill-preflight/SKILL.md:99-100 | security (gr-code-security, regla semántica sobre lo que se repite en la salida) | LOW | Las señales L2 y L3 repiten tal cual el valor de `root` y de `SDDF_ROOT`, que puede ser una ruta absoluta del host o contener caracteres de control. La versión anterior ya lo repetía, así que no es una exposición nueva. | Informar solo que la señal existe, o recortar el valor y escapar sus caracteres de control. No bloquea. |

---

### Nota de Tamaño de Cambio

⚠️ Nota informativa: tamaño de cambio elevado (74 archivos modificados). Considera ejecutar /story-split antes de futuras historias similares para reducir el alcance. Esta nota es informativa y no afecta la decisión de este review.

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Siguiente acción

Ejecuta `/story-verify STORY-152`. Antes de ACCEPTANCE, conviene ejecutar a criterio humano `npm run test:eval -- skill-preflight` (también `-- memory-system` y `-- header-aggregation`), porque AC-2 y AC-3 solo están cubiertos por evals de LLM. Los hallazgos LOW son opcionales; los de compatibilidad y documentación (Tech-Lead #3 e Integration #1) corresponden al alcance de STORY-154 (CR-003).

---

## Cumplimiento DoD — Fase CODE-REVIEW

DoD cargado desde `docs/guardrails/dod-story-code-review.md` (`enforcement: error`).

| # | Criterio | Estado | Severidad | Evidencia |
|---|---|---|---|---|
| 1 | Se cumple [[dod-story-implement]] | ⚠️ | — | `implement-report.md`: 19/24 ✓, 5 ⚠️ y 0 ❌. Los ⚠️ corresponden a evals y CI que no se ejecutaron y a checklists de seguridad que no se recorrieron formalmente; el Security-Reviewer los cubrió en esta revisión. Requiere acceso a CI/CD, no evaluable desde los artefactos disponibles. |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Tech-Lead: Markdown + JS nativo, sin dependencias nuevas, secretos, TODOs ni código sin usar |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner: AC-1..AC-4 trazados a gate, pruebas S152-UT-*, `skill-preflight/SKILL.md` y evals TC-005–TC-007 |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration: cumple D-1..D-14, las interfaces y los contratos de verificación, incluido CR-004 |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | Los cuatro informes tienen `max-severity: LOW` |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | `tasks.md`: 0 tareas `[ ]` (41/41) |
| 7 | Metadatos frontmatter de `story.md` completos y correctos con status y substatus actualizados | ✓ | — | Frontmatter completo; esta revisión lo deja en `CODE-REVIEW/DONE` |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este archivo |
| 9 | Revisión de código aprobada (`verdict: APPROVED` en `code-review-report.md`) | ✓ | — | `verdict: APPROVED` |

**Resumen:** 8/9 criterios ✓ · 1 ⚠️ · 0 ❌
