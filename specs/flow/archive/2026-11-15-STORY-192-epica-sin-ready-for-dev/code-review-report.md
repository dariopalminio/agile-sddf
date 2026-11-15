---
type: code-review-report
story: STORY-192
title: "Code Review Report: Épica sin READY-FOR-DEV"
verdict: APPROVED
date: 2026-11-14
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-192

## Veredicto

**Veredicto:** `APPROVED` — Sin hallazgos bloqueantes (severidad máxima: LOW).

Los cuatro revisores entregaron un informe válido y aprobaron. Los 8 hallazgos son LOW: 6 sobre la precisión de las aserciones de los evals y 2 sobre la redacción de los skills, y ninguno afecta al comportamiento de los AC. El DoD CODE-REVIEW se cumple completo.

**Resumen para el PR**

- **Qué cambia:** los skills de épica ya no nombran los estados buffer. `/epic-analyze` declara el orden de madurez sin buffers. Clasifica `lista` una historia con el valor legado `READY-FOR-IMPLEMENT`, con una nota que no cuenta para el veredicto. Su resumen manual indica que el PO aprueba la épica a mano (`PLAN/DONE`). `/epic-refine` replanifica solo las historias de cierre en `PLAN` y deja para el PO cualquier `status` fuera del workflow de historia.
- **Cómo se verificó:** `npm run verify:repository` (592/592 pruebas), los greps V-3, V-4 y V-5, y una búsqueda de bytes BOM. Hay cinco evals nuevos y uno ajustado (TC-035…TC-037 en `epic-analyze`; TC-027, TC-028 y TC-009 en `epic-refine`). Los evals no se ejecutaron: quedan a criterio humano.
- **Riesgo residual:** las aserciones de algunos evals son débiles (ver hallazgos LOW). La nota del valor legado dice siempre `PLAN/DONE`, mientras que ADR-0022 lo mapea a `PLAN/DONE` o a `IMPLEMENT/TODO`. La clasificación no cambia.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-192 — Épica sin READY-FOR-DEV |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-11-14 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-analyze/assets/epic-analyze-report-template.md:68 | El comentario guía de `notas-analisis` enumera los tipos de nota admitidos, pero no la nueva «nota de valor legado» que define `SKILL.md:246`. El agente que rellena el template podría omitirla o ubicarla con menos determinismo. El archivo no está en `$IMPL_FILES` y la regla del `SKILL.md` prevalece | Añadir al comentario «historias con el valor legado de `status` (nota de valor legado)», o registrar la omisión como deuda menor |
| LOW | skills/epic-analyze/SKILL.md:327 | Con `NEEDS-REFINEMENT`, la nueva línea `Siguiente paso:` remite siempre a `/epic-refine`, aunque los hallazgos sean de familias que ese skill deja al PO (p. ej. solo MAD-01/MAD-03). El párrafo final (línea 350) indica en cambio «corregir … y volver a ejecutar» y «completar la especificación de las historias hijas» | Aceptable porque `/epic-refine` deriva al PO lo que no corrige. Opcionalmente, alinear las dos redacciones para que el usuario no reciba dos instrucciones distintas |
| LOW | skills/epic-refine/evals/evals.json:146 | `Replanifica:` en `not_contains` de TC-009 se cumple de forma trivial: TC-009 corre en `--auto`, cuyo bloque de retorno nunca incluye esa línea (`sal-corrections.md:129`). La protección real del caso `SPECIFY` sin replanificación depende solo del texto del catálogo | Opcional: un caso manual con la historia de cierre en `SPECIFY` haría efectiva la aserción (la fila `SPECIFY` de AC-3) |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-refine/evals/evals.json:146 | AC-3, fila `SPECIFY`: TC-009 corre en `--auto`. La línea `Replanifica:` solo se emite en el resumen manual (`epic-refine/SKILL.md:227-231`; `sal-corrections.md`: «En `--auto` el bloque de retorno no cambia»). Por eso el `not_contains: "Replanifica:"` añadido no discrimina: pasaría aunque la historia de cierre estuviera en `PLAN`. La aplicación de la corrección sí está cubierta, pero «sin línea `Replanifica:`» no se verifica de forma observable. Lo mismo pasa con el `not_contains: "Replanifica"` de TC-028 (`--auto`). | Añadir un caso manual (respuesta `s`) sobre el fixture `cobertura-cierre/` que compruebe `Siguiente paso: /epic-analyze EPIC-30` y la ausencia de `Replanifica:`, simétrico a TC-027. Otra opción es documentar en el eval que la ausencia queda garantizada por el modo. |
| LOW | skills/epic-analyze/evals/evals.json:1706 | AC-1: TC-035 comprueba `PLAN/DONE` y `Siguiente paso` como cadenas sueltas. Si el reporte o la consola mencionan el estado `PLAN/DONE` de STORY-202 por otra vía, el caso pasaría aunque el `Siguiente paso:` no remita a la aprobación manual. | Usar un fragmento propio de la línea, por ejemplo `editando a mano su estado a`. |
| LOW | skills/epic-analyze/evals/evals.json:1784 | AC-2, fila 1: `STORY-202` aparece en todo el reporte (índice cruzado), así que no demuestra que la nota de valor legado cite la historia. Solo `valor legado` ancla la nota. | Usar un fragmento de la nota que incluya el ID, por ejemplo `STORY-202 conserva el valor legado`. |

Los tres AC y las cuatro filas de Ejemplos tienen correspondencia en los skills y en los evals TC-035, TC-036, TC-037, TC-009 y TC-027.

---

### Integración y Arquitectura (Integration-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-analyze/SKILL.md:246 | La nota del valor legado cita ADR-0022, pero dice siempre que `READY-FOR-IMPLEMENT` «se lee como planificación aprobada (`PLAN/DONE`)». ADR-0022 («Valor legado y ventana de transición») lo mapea a `IMPLEMENT/TODO` si existe `implement-report.md` y a `PLAN/DONE` si no. La clasificación (`lista`) es la misma en los dos casos, así que no hay impacto en el veredicto. Solo la nota es inexacta frente a la fuente que cita. El texto es el literal de D-1, que se redactó antes de que existiera el ADR. | Cambiar la frase por «que se lee como `PLAN/DONE` o `IMPLEMENT/TODO` según ADR-0022», o quitar el paréntesis. Ajustar D-1 de `design.md` con un CR para mantener la trazabilidad. |
| LOW | skills/epic-refine/evals/evals.json (TC-028, `input.context`) | TC-028 espera en `contains` el texto de la nota del reporte («fuera del workflow de historia» y `BACKLOG`). Su `context` no incluye la cláusula «Los bloques FILE usan la ruta relativa… e incluyen cada <archivo>.bak creado», que sí tiene TC-013, el caso `--auto` análogo con nota fuera de alcance. Sin esa cláusula, la salida evaluada puede no incluir `epic-refine-report.md` y el caso podría fallar por falta de visibilidad, no por el comportamiento del skill. | Añadir a `input.context` de TC-028 la misma cláusula de bloques FILE que tiene TC-013. |

Conformes con `design.md`: C-1…C-7, D-1…D-7 y V-3…V-5. El orden de madurez de la línea 236 es idéntico al de `docs/domains/domain-story-lifecycle.md:84`, y ADR-0022 existe con `status: ACCEPTED`.

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-ai-security-checklist.md, docs/guardrails/gr-code-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md (32 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| — | — | — | Sin hallazgos de seguridad | — |

---

### Nota de Tamaño de Cambio

ℹ️ Nota informativa: tamaño de cambio aceptable (9 archivos modificados) — sin acción requerida.

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Siguiente acción

Ejecuta `/story-verify STORY-192`. Los 8 hallazgos LOW son opcionales: pueden corregirse antes de verificar o registrarse como deuda menor. Los de más valor son reforzar las aserciones de TC-035 y TC-036 y alinear la nota del valor legado con ADR-0022. Recuerda que `npm run test:eval -- epic-analyze` y `npm run test:eval -- epic-refine` siguen pendientes de ejecución humana.

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|---|---|---|---|
| 1 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Tech-Lead-Reviewer aprobado. El texto está en español, la fuente única es `skills/` y los evals se escribieron antes que los `SKILL.md` |
| 2 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner-Reviewer: AC-1…AC-3 (4 filas de Ejemplos) definidos en los skills y cubiertos por TC-035…TC-037, TC-009 y TC-027 |
| 3 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration-Reviewer: C-1…C-7 y D-1…D-7 conformes; solo hay hallazgos LOW |
| 4 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | `tasks.md`: 24/24 `[x]` |
| 5 | Metadatos frontmatter de `story.md` están completos y correctos | ✓ | — | `id`, `slug`, `title`, `status`, `substatus`, `parent`, `created`, `updated` y `related` presentes y coherentes |

**Resumen:** 5/5 criterios ✓
