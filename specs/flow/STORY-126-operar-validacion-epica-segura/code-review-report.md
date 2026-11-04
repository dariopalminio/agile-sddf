---
type: code-review-report
story: STORY-126
title: "Code Review Report: Operar la validación de épicas de manera segura"
verdict: APPROVED
date: 2026-10-31
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-126

## Veredicto

**Veredicto:** `APPROVED` — Sin hallazgos bloqueantes (severidad máxima: LOW).

Los cuatro revisores entregaron informe válido con `status: approved`, y los tres hallazgos funcionales de la ronda 1 quedaron resueltos. El límite entre STORY-126 y STORY-127 ya es trazable en `story.md` y en la Política de efectos de `SKILL.md`. TC-040 a TC-043 cubren el estado `VALIDATE`, y TC-018 compara el reporte completo. Los hallazgos restantes son LOW: deriva documental en `design.md` y mejoras opcionales de cobertura de los evals.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-126 — Operar la validación de épicas de manera segura |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-10-31 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | specs/flow/STORY-126-operar-validacion-epica-segura/design.md:47,105 | `design.md` sigue diciendo «fuera de `--dry-run` el único archivo escrito es `epic-validate-report.md`» y «en ninguna ejecución el skill … modifica `epic.md`». Contradice el AC-4/CNF-2 alineado de `story.md` y la Política de efectos de `SKILL.md`. El implementador lo marcó ⚠️ en el DoD #19 porque `design.md` no estaba en la lista blanca. | Con aprobación, añadir en `design.md` (C3/C5) una nota que remita la excepción del gateway a STORY-127 / CS-7, para que diseño y especificación no diverjan. |
| LOW | skills/epic-validate/evals/evals.json:4353 | La descripción de TC-042 dice «la épica de TC-014 quedó en VALIDATE/DONE», pero la épica de TC-014 no declara `status` (su gateway no transiciona). El estado `VALIDATE/DONE` resulta de TC-040. | Cambiar la referencia a «la épica de TC-040». |
| LOW | skills/epic-validate/evals/evals.json:1431-1614,4350-4552,4553-4760 | La comparación «completa» de TC-018/TC-042/TC-043 omite algunas líneas fijas no volátiles: la fila `\| Template de reporte \|` del resumen, el origen `(--mode)` de la línea `Modo:`, los encabezados de las tablas y, en TC-042, la columna «Historia dueña» de la fila `SMOKE-1`, que queda tras la fuente con duración. | Opcional: añadir esas líneas o prefijos a `previous_report.content` y a `contains`, para que la equivalencia cubra todas las líneas fijas. |
| LOW | skills/epic-validate/evals/evals.json:4743 | TC-043 asevera `RESULTADO`, `VEREDICTO` y `REPORTE`, pero no `MODO: manual`. Los demás casos del bloque sí aseveran el modo. | Opcional: añadir `"MODO: manual"` a `contains` de TC-043. |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-validate/evals/evals.json (TC-040, TC-041, TC-043; TC-014, TC-015) | `expected.files_written` no se califica: `gradeOutput` de `scripts/run-evals.js` solo usa `contains` y `not_contains`. Por eso «se escriben exactamente dos archivos» (o «el único archivo es el reporte», en TC-014 y TC-015) depende de una lista de rutas prohibidas. TC-040, TC-041 y TC-043 prohíben `STORY-40`, `epic-analyze-report.md`, `docs/`, `skills/`, `.tmp/` y `.bak`. TC-014 y TC-015 no prohíben `docs/`, `skills/` ni `epic-analyze-report.md`. Un bloque `=== FILE:` en otra ruta, como `sddf.config.yaml`, `package.json` u otro archivo de `specs/flow/EPIC-40-operativa/`, pasaría el caso. | Opcional: añadir a TC-014 y TC-015 las mismas exclusiones que tienen TC-040 y TC-041, o un `not_contains` genérico sobre bloques `=== FILE:` adicionales del directorio de la épica. A más largo plazo, evaluar que el runner califique `files_written`. |
| LOW | skills/epic-validate/evals/evals.json (TC-018, TC-042, TC-043) | Algunas líneas del reporte se comparan por prefijo: `\| OPE-02 \| verify:release \| cumple \| \`npm run verify:release\` · pasa (`, `⚠️ OPE-03 omitida —` y, en TC-042, `\| SMOKE-1 \| \`Publicar informe\` \| aprobado \|`. La parte fija que sigue a la duración o al guion no se verifica de forma literal. Además, el bloque de M-002 no incluye su línea `Acción sugerida`. | Opcional: completar esas líneas en el fixture con su cola fija, dejando fuera solo la duración, para que la comparación cubra todo lo que no es volátil. |

---

### Integración y Arquitectura (Integration-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | specs/flow/STORY-126-operar-validacion-epica-segura/design.md:47,98-105,141,163,213 | El rework alineó `story.md` (AC-4, CNF-2, CS-7) y la Política de efectos de `SKILL.md:93-107` con el gateway de STORY-127, pero `design.md` no se actualizó. El Goal «fuera de `--dry-run` el único archivo escrito es `epic-validate-report.md`», la tabla C3 y su párrafo («ni modifica `epic.md`»), F1 paso 3 («escribe solo…»), F5 paso 3 y V-5 («no se escribe ningún otro archivo») contradicen ahora la historia y la implementación. El CR-005 de STORY-127 (`design.md:225-229`) nombra este `design.md` como documento afectado. El `implement-report.md` lo registra en DoD #19 como ⚠️. No tiene impacto funcional: C1–C9 se respetan, el gateway es el componente C5/C6 documentado en el diseño de STORY-127, y el Punto de variación P6 de este diseño ya preveía agregar «una fila o columna» a la Política de efectos. | Añadir a `design.md`, con aprobación porque está fuera de la lista blanca, una nota de rework 2026-10-31 o un CR que registre la excepción del gateway (STORY-127 C6 / CR-005). La nota debe aclarar que el Goal, C3, F1, F5 y V-5 se leen como «la única escritura de la validación es el reporte; `epic.md` lo escribe solo el gateway según el Paso 5b». No hace falta reescribir las decisiones D-1…D-10. |
| LOW | skills/epic-validate/SKILL.md:100-101 | La columna «`epic.md` (gateway, Paso 5b)» dice «con la épica en `VALIDATE`, solo `status`, `substatus` y `updated`». Sin embargo, la fila `VALIDATE/DONE` + `APPROVED` del Paso 5b (`SKILL.md:384`) no escribe nada (TC-042 lo verifica). Esa celda puede leerse como si siempre hubiera escritura en `VALIDATE`. El párrafo «Excepción del gateway» remite a la tabla del Paso 5b, así que la ambigüedad es menor. | Redactar la celda como «según la tabla del Paso 5b, como máximo `status`, `substatus` y `updated`, después del reporte; fuera de `VALIDATE` o ya en `VALIDATE/DONE` con `APPROVED`, sin cambio». |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-code-security-checklist.md, docs/guardrails/gr-ai-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md, .claude/skills/security-audit/assets/ai-security-checklist.md (88 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| LOW | skills/epic-validate/evals/evals.json:1302 | AI-019 / gr-ai semántica (paso irreversible que falla cerrado) | Los cuatro casos `--dry-run` (TC-016, TC-019, TC-020, TC-030) usan un `epic.md` sin `status: VALIDATE`, así que ningún eval prueba que `--dry-run` deja `epic.md` sin cambio cuando el gateway sí escribiría (`SKILL.md:99`; la línea `sin cambio (--dry-run) — aplicaría …` no se afirma en ningún caso). Con la nueva columna de escritura sobre `epic.md`, la garantía «`--dry-run` no escribe» solo se prueba en el caso trivial. | Agregar un caso `--dry-run` con la épica en `VALIDATE/IN-PROGRESS`, `files_written: []`, `not_contains` sobre `=== FILE: specs/flow/EPIC-40-operativa/epic.md` y `contains` sobre `Gateway: sin cambio (--dry-run) — aplicaría`. No bloquea. |
| LOW | skills/epic-validate/SKILL.md:267 | SEC-070 (allowlist mejor que denylist) | Es anterior al rework. En OPE-03 se ejecuta, también en `--mode auto` y sin confirmación, cualquier comando entre backticks del DoD que no esté en una lista abierta de comandos que «escriben, publican o despliegan» (`npm publish`, `git push`, `npm pack`…). El DoD es un archivo versionado del proyecto, con la misma confianza que `package.json`, y la política lo asume (`SKILL.md:107`). Por eso no hay una exposición demostrable, pero la lista abierta se presta a interpretaciones distintas. | Valorar en una historia futura una allowlist explícita de prefijos de verificación (p. ej., `npm run verify:*`, `npm test`, `node --test`) o una clasificación determinista en el motor. No bloquea. |

---

### Nota de Tamaño de Cambio

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Siguiente acción

Historia aprobada en `CODE-REVIEW/DONE`. Continúa con `/story-verify STORY-126`. Los hallazgos LOW son opcionales y no bloquean. Lo más relevante es actualizar `design.md` con la excepción del gateway de STORY-127 y añadir un eval `--dry-run` con la épica en `VALIDATE`. Ambos requieren aprobación del PO, en esta historia o en una de seguimiento.

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Se cumple [[dod-story-implement]] | ⚠️ | — | `implement-report.md`: 18/24 ✓, 6 ⚠️, 0 ❌. Los ⚠️ dependen de ejecutar los evals o la CI. El DoD #19 (decisiones documentadas en `design.md`) queda pendiente según el hallazgo LOW de integración |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Tech-Lead: Markdown/JSON en español, UTF-8 sin BOM ni CR, `SKILL.md` de 480 líneas; `verify:repository` aprobado |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner: AC-1 (TC-014/040, TC-015/041), AC-2 (TC-016), AC-3 (TC-017), AC-4 (TC-018/042/043), CNF-1 y CNF-2 |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration: C1–C9 respetados; el gateway pertenece a C5/C6 de STORY-127. Solo hay una deriva documental LOW |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | Los cuatro informes con `max-severity: LOW` |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | `tasks.md`: 24 `[x]`, 0 `[ ]` |
| 7 | Metadatos frontmatter de `story.md` están completos y correctos con status y substatus actualizados | ✓ | — | `story.md` → `CODE-REVIEW/DONE`, `updated: 2026-10-31` |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este archivo, 2026-10-31 |
| 9 | Revisión de código aprobada (`verdict: APPROVED` en `code-review-report.md`) | ✓ | — | `verdict: APPROVED` |

**Resumen:** 8/9 criterios ✓ (1 ⚠️, 0 ❌)
