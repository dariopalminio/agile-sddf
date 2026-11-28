---
type: code-review-report
story: STORY-201
title: "Code Review Report: Template de historia con narrativa, contexto y reglas de negocio"
verdict: APPROVED
date: 2026-11-27
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-201

## Veredicto

**Veredicto:** `APPROVED` — Sin hallazgos bloqueantes (severidad máxima: LOW).

Los cuatro informes son válidos y ninguno tiene hallazgos `HIGH` ni `MEDIUM`: los tres bloqueantes de la ronda 1 están corregidos. Los evals de AC-2, EV-003…EV-006 y CR-005 ya existen como casos `TC-NNN`, y las cuatro reglas de exclusión reconocen `## 🚫 Fuera de alcance` y `## Fuera de alcance`. Quedan 5 `LOW` que no bloquean. Dos de ellos están en líneas que la historia no tocó (`testcases.md:35` y `design.md:42`), pero no son PREEXISTENTE: su descripción atribuye el defecto al rework de la historia, que amplió AC-3 y registró CR-005 sin alinear esos artefactos.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-201 — Template de historia con narrativa, contexto y reglas de negocio |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ✓ analizado (15 casos — UT:4/CT:0/IT:2/API:0/E2E:3/EV:6) |
| Guía de revisión | ✓ REVIEW.md |
| Hallazgos preexistentes | ✓ clasificación aplicada (base: origin/main@9fc3f8d) — sin hallazgos PREEXISTENTE |
| Control de LOW | tope 5 LOW por revisor (REVIEW.md) · 0 LOW arrastrados de la ronda anterior omitidos (líneas sin cambios) |
| Fecha | 2026-11-27 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW       | skills/story-evaluation/evals/evals.json:188 | TC-010 y TC-011 remiten a su fixture completo, y ese fixture ya contiene las dos cadenas que exigen ambos casos: `` **Veredicto:** `APPROVED` `` y `F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3)` (`skills/story-evaluation/examples/example-template-actual.md:61,71` y `skills/story-evaluation/examples/example-ready.md:54,64`). Además, la `description` de TC-010, y también la de `skills/story-creation/evals/evals.json:67` (TC-004), anuncia el resultado esperado, y `scripts/run-evals.js:529` la copia en el prompt. Por eso estos casos detectan peor una regresión de la regla que cubren (`skills/story-evaluation/SKILL.md:224`, `skills/story-creation/SKILL.md:76`): el modelo puede copiar la respuesta | En `input.context`, indicar que solo se pega el bloque «Historia evaluada», o incrustar ese texto en `context` como hacen los evals de `story-split`. Limitar la `description` de los casos nuevos al escenario y dejar el resultado solo en `expected` |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW       | skills/story-creation/evals/evals.json:73-78 | TC-004, el caso nuevo de AC-2, solo comprueba `**Como**`, pero AC-2 (`changes/STORY-201-template-historia-narrativa-contexto-reglas/story.md:45`) exige que `## Narrativa` tenga las líneas «Como», «Quiero» y «Para». Tampoco distingue el AC principal del alternativo: `### AC-1 - ` y `### AC-2 - ` aparecen aunque los dos sean del mismo tipo. El resto de AC-2 sí está verificado: el `not_contains` de `## Contexto y valor`, `## Reglas` y sus placeholders detecta la regresión que señaló la ronda 1 | Añadir `**Quiero**` y `**Para**` a `contains` de TC-004 y, si se quiere fijar el tipo de escenario, `Escenario principal` y `Escenario alternativo` |

---

### Integración y Arquitectura (Integration-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | docs/templates/story-template.md:78 | El template nuevo trae `- **Dependencia:** [API, diseño, otra historia]` como el lugar donde se declara la dependencia de una historia. Pero `skills/epic-refine/references/sal-corrections.md:37-39` solo cuenta como dependencia el token `depends-on:` y excluye de forma explícita las frases libres. Una historia creada con el template que escriba `- **Dependencia:** STORY-301` no tiene dependientes para `/epic-refine`, y la elección de la historia de cierre cae en «varias candidatas sin dependientes» y pasa al PO. El fallo es seguro, pero se pierde la corrección automática. El fixture nuevo usa `- depends-on: STORY-301` y no la línea del template | Hacer que la regla de `sal-corrections.md` §2 también reconozca `**Dependencia:** STORY-NNN` (registrarlo con un CR), o indicar en el comentario del template que una dependencia de otra historia se escribe como `depends-on: STORY-NNN`. También vale una historia de seguimiento |
| LOW | changes/STORY-201-template-historia-narrativa-contexto-reglas/design.md:42 | CR-005 se registró, pero el cuerpo de `design.md` no se alineó con él. La línea `:42` sigue diciendo que `epic-analyze` «no necesita cambios», y la tabla Interfaces (`:160-165`) no declara el contrato de la sección de exclusión (`## 🚫 Fuera de alcance` / `## Fuera de alcance` → epic-analyze, epic-refine, epic-validate). F-3 (`:182`), el contrato de verificación 7 (`:205`) y `tasks.md:48` hablan de «cinco skills» de AC-3, y AC-3 ahora lista siete | Actualizar `:42`, añadir la fila del contrato de exclusión a Interfaces y cambiar «cinco» por los siete skills de AC-3 en F-3, en el contrato 7 y en T014 |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-ai-security-checklist.md, docs/guardrails/gr-code-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md (60 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| — | — | — | Sin hallazgos de seguridad | — |

`ai-no-hidden-characters` (REVIEW.md «Verificar siempre») se comprobó por bytes, con el comando de `docs/guardrails/gr-ai-security-checklist.md` y con un recorrido por code point, sobre los 27 archivos del alcance. Hubo 0 coincidencias: sin BOM, CR, caracteres de control ni homoglifos. Los U+FE0F presentes siguen todos a una base de emoji, y el separador `### AC-<n> - ` es el guion ASCII 0x2D. Los correos de los fixtures nuevos usan `example.com`.

---

### Nota de Tamaño de Cambio

⚠️ Nota informativa: tamaño de cambio elevado (27 archivos modificados). Considera ejecutar /story-split antes de futuras historias similares para reducir el alcance. Esta nota es informativa y no afecta la decisión de este review.

---

### Cobertura de Casos de Prueba (testcases.md)

**Cobertura en testcases.md (Product-Owner-Reviewer)**

| Severidad | AC / Escenario | Descripción | Recomendación |
|-----------|----------------|-------------|---------------|
| LOW       | E2E-003 (changes/STORY-201-template-historia-narrativa-contexto-reglas/testcases.md:35) | El rework amplió AC-3 (`story.md:52-55`), pero `testcases.md` no se actualizó. El `Dado` de E2E-003 no incluye `## Fuera de alcance (Non-Goals)`, y su `Entonces` no nombra `epic-analyze` ni `epic-validate` ni el comienzo `## 🚫 Fuera de alcance` / `## Fuera de alcance`. Los evals que sí lo cubren, `epic-analyze` TC-038 y `epic-validate` TC-044, no tienen fila en `testcases.md`: `implement-report.md:77-78` los traza con «— (CR-005)». La cobertura real existe, porque TC-038, TC-044 y TC-029 de `epic-refine` distinguen las dos formas. Lo que falta es la trazabilidad en el artefacto que ejecuta `/story-verify` | Ajustar el `Dado` y el `Entonces` de E2E-003 al texto actual de AC-3. Añadir filas EV con `Ref: AC-3` para TC-038 y TC-044, con `/story-testcases` o a mano |

**Trazabilidad de diseño en testcases.md (Integration-Reviewer)**

| Severidad | Test Case ID | Descripción | Recomendación |
|-----------|--------------|-------------|---------------|
| — | — | Trazabilidad de diseño correcta en testcases.md | — |

---

## Siguiente acción

La historia queda en `CODE-REVIEW/DONE`. Continúa con `/story-verify STORY-201`. Los 5 `LOW` son opcionales: se pueden atender antes de `/story-acceptance` o en una historia de seguimiento. Los casos de eval nuevos (`story-creation` TC-004/TC-005, `story-evaluation` TC-010/TC-011, `epic-refine` TC-029, `epic-analyze` TC-038, `epic-validate` TC-044) siguen sin ejecutarse con un runner real: su ejecución queda a criterio humano (`AGENTS.md`).

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Cubierto por Tech-Lead-Reviewer: informe válido sin hallazgos bloqueantes |
| 2 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Cubierto por Product-Owner-Reviewer: informe válido sin hallazgos bloqueantes |
| 3 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Cubierto por Integration-Reviewer: informe válido sin hallazgos bloqueantes |
| 4 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | tasks.md: 16/16 `[x]`, ninguna línea `- [ ]` |
| 5 | Metadatos frontmatter de `story.md` están completos y correctos | ✓ | — | `type`, `id`, `slug`, `title`, `status`, `substatus`, `parent` (null), `created` y `updated` presentes; `id` y `slug` coinciden con el directorio |

**Resumen:** 5/5 criterios ✓
