---
type: code-review-report
story: STORY-174
title: "Code Review Report: Skill epic-refine: corregir referencias obsoletas tras un split"
verdict: APPROVED
date: 2026-10-31
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-174

## Veredicto

**Veredicto:** `APPROVED` — Sin hallazgos bloqueantes (severidad máxima: LOW).

Re-revisión (ronda 2) tras `fix-directives.md` ronda 1: los cuatro revisores emiten informe válido con `status: approved` y confirman resuelto el MEDIUM de TC-014 (`evals.json:225`), que ahora exige los bloques FILE de `epic.md` y del `story.md` de STORY-302 con sus `.bak`, mientras TC-015/TC-016 excluyen esas escrituras. Los 17 hallazgos restantes son LOW (varios arrastrados de la ronda 1, fuera de su lista blanca) y no bloquean.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-174 — Skill epic-refine: corregir referencias obsoletas tras un split |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-10-31 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-refine/evals/evals.json:238 | El `context` de TC-015 (y el de TC-016, línea 254) no fija la convención de los bloques FILE («Los bloques FILE usan la ruta relativa a specs/flow/ del fixture… e incluyen cada <archivo>.bak creado»), que sí aparece en TC-001, TC-013 y TC-014. Los nuevos `not_contains` de marcadores `<ruta> ===` dependen de esa convención: si se escribiera el archivo con otra ruta (p. ej. con separador `\`), el negativo pasaría vacío. | Añadir la misma frase de convención al `context` de TC-015 y TC-016. |
| LOW | skills/epic-refine/evals/evals.json:225 | `  - STORY-301-exportar-informe-csv` y `[[STORY-301-exportar-informe-csv]]` se comprueban como subcadenas sueltas y no quedan ligadas a su bloque FILE. Hoy el fixture las vuelve discriminantes, pero `epic-refine-report.md` podría llegar a contenerlas. | Opcional: anclar con un fragmento de varias líneas, como hace TC-001 (p. ej. `related:\n  - EPIC-30-ejemplo\n  - STORY-301-exportar-informe-csv` o `— [[STORY-301-exportar-informe-csv]]`). |
| LOW | skills/epic-refine/SKILL.md:174 | (Pendiente de la ronda 1.) Las plantillas de las listas «Ya resueltos» y «Fuera de alcance» (líneas 175 y 177) solo muestran `H-NNN · <código>`. La viñeta de la línea 183 amplía **Origen** a `COH-<n>` solo para la tabla. | Generalizar a `- <Origen>: <motivo>` / `- <Origen> · responsable PO: <nota>`. |
| LOW | skills/epic-refine/references/coh-corrections.md:33 | (Pendiente de la ronda 1.) Para la existencia basta `specs/flow/S/`, pero la regla de reemplazo (línea 58) exige directorios que contengan `story.md`. | Alinear la existencia con `specs/flow/S/story.md` o `specs/flow/archive/<YYYY-MM-DD>-S/story.md`. |
| LOW | skills/epic-refine/SKILL.md:6 | (Pendiente de la ronda 1.) `La forma de epic.md es /epic-improve.` perdió la forma de disparador negativo. | Usar p. ej. `No para la forma de epic.md (/epic-improve).`, sin pasar de 500 caracteres. |
| LOW | skills/epic-refine/examples/split-ambiguo/archive/2026-10-01-STORY-301-exportar-informe-pdf/story.md:12 | (Pendiente de la ronda 1.) El prefijo `2026-10-01-` no coincide con `updated: 2026-10-24` (ADR-0019), y la línea 21 dice «exportar el informe mensual a CSV» en la historia de PDF. No afecta a TC-016. | Alinear la fecha del directorio con `updated:` y corregir la oración Quiero a PDF. |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

Escenarios verificados: 6/6 (AC-1, AC-2, CNF-1, CNF-2, CNF-3 y la nota de disparo con `verdict: APPROVED`).

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-refine/evals/evals.json:225 | AC-1 «el índice de `epic.md` y el `related` de STORY-302 citan `STORY-301-exportar-informe-csv`»: TC-014 ya verifica que se escriben los dos archivos y sus `.bak`, pero las dos aserciones de contenido (`[[STORY-301-exportar-informe-csv]]` y `  - STORY-301-exportar-informe-csv`) también aparecen en la columna **Después** del plan del Paso 5. Según `coh-corrections.md:76-77`, **Después** es la línea completa del índice o la entrada `related` sustituida. Por eso las aserciones no prueban que el contenido esté *dentro* del bloque FILE. | Anclar el contenido con fragmentos multilínea que solo existen en el archivo escrito, como hace TC-001: `"  - EPIC-30-ejemplo\n  - STORY-301-exportar-informe-csv\n---"` y `"para compartirlo con finanzas — [[STORY-301-exportar-informe-csv]]\n- [ ] **STORY-302**"`. Alternativa: un caso sandbox sobre `split-slug-obsoleto/` con `expected.files.contains`, como TC-023. |
| LOW | skills/epic-refine/evals/evals.json:225 | AC-1 «Y `epic-refine-report.md` lista COH-1 y COH-2 como aplicados»: TC-014 no exige el bloque `EPIC-30-ejemplo/epic-refine-report.md ===` ni sus conteos, a diferencia de TC-001. `COH-1`, `COH-2` y `aplicado` ya salen en el plan y en la consola. | Añadir a `contains` `EPIC-30-ejemplo/epic-refine-report.md ===` y `findings-applied: 2` (COH-1 y COH-2; INT-01 e INT-05 quedan fuera de alcance → `findings-out-of-scope: 2`). |
| LOW | skills/epic-refine/evals/evals.json:238 | En TC-015 (y TC-016, línea 254) el `context` no fija la ruta de los bloques FILE. Por eso los nuevos `not_contains` `STORY-302-programar-envio-informe/story.md ===` y `EPIC-30-ejemplo/epic.md ===` dependen de un formato de ruta que no se especifica, aunque `story.md.bak`/`epic.md.bak` sí cubren los backups. Además, `responsable PO` también casa con las líneas de INT-01/INT-05: la que distingue el COH es la nota `reemplazo no determinable`. | Añadir al `context` de TC-015 y TC-016 la frase de TC-014: «Los bloques FILE usan la ruta relativa a specs/flow/ del fixture … e incluyen cada <archivo>.bak creado». |
| LOW | skills/epic-refine/examples/split-sin-reemplazo/STORY-302-programar-envio-informe/story.md:12 | (Arrastrado de la ronda 1, fuera de la lista blanca.) El `updated: 2026-10-24` de STORY-302 es anterior al `updated: 2026-10-28` del reporte. Eso contradice la justificación «reporte anterior a la referencia» (CR-001, descripción de TC-015) y no dispara el aviso de reporte desactualizado (`SKILL.md:122`). | Subir `updated:` a una fecha posterior al reporte (p. ej. `2026-10-29`) y, opcionalmente, comprobar `puede estar desactualizado` en TC-015. |
| LOW | skills/epic-refine/examples/split-ambiguo/archive/2026-10-01-STORY-301-exportar-informe-pdf/story.md:12 | (Arrastrado de la ronda 1.) El prefijo `2026-10-01` no coincide con `updated: 2026-10-24` (regla de archivo de ADR-0019), y la línea 21 dice «exportar el informe mensual a CSV» en la historia de PDF. No afecta al resultado de TC-016. | Renombrar a `2026-10-24-STORY-301-exportar-informe-pdf/` (y actualizar la descripción de TC-016) y corregir la oración Quiero a PDF. |

---

### Integración y Arquitectura (Integration-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | specs/flow/STORY-174-corregir-referencias-obsoletas-tras-split/design.md:138 | (Pendiente de la ronda 1, fuera de la lista blanca.) La tabla «Fuera de alcance (`PO`)» de D-5 solo lista «0 o ≥ 2 directorios» y «`related` no reconocido». La implementación añade la regla de **Pertenencia** (historia listada de otra épica o sin `parent` → fuera de alcance · PO: `coh-corrections.md:18-20`, `:104-105`; `SKILL.md:147`; TC-022), y ningún CR del design.md la documenta. | Añadir un CR-006 a design.md con la regla de pertenencia y sus dos casos de fuera de alcance. No cambia el código. |
| LOW | skills/epic-refine/SKILL.md:11 | (Pendiente de la ronda 1.) «Cuándo usar este skill» enumera INT, MAD y SAL, pero no el caso COH. El disparador sí está en `description` (`SKILL.md:4-5`) y en `README.md:37-38`. | Añadir una viñeta COH, alineada con `README.md:37`. |
| LOW | skills/epic-refine/examples/split-ambiguo/archive/2026-10-01-STORY-301-exportar-informe-pdf/story.md:12 | (Pendiente de la ronda 1.) El prefijo de archivo `2026-10-01-` no coincide con `updated: 2026-10-24`. ADR-0019 / AGENTS.md toman la fecha de archivo de `updated:`. La oración Quiero (línea 21) dice «CSV» en la historia de PDF. No afecta a la regla de reemplazo ni a TC-016. | Renombrar el directorio a `2026-10-24-STORY-301-exportar-informe-pdf/` (y la descripción de TC-016) o ajustar `updated:`; corregir la oración Quiero. |
| LOW | skills/epic-refine/evals/evals.json:225 | V-1 (AC-1 «el `related` de STORY-302 cita `STORY-301-exportar-informe-csv`»). El `contains` `  - STORY-301-exportar-informe-csv` también se cumple con la columna **Después** del plan del Paso 5 (`` `  - STORY-301-exportar-informe-csv` ``), así que no queda atado al bloque FILE de STORY-302. Los marcadores `… story.md ===` sí prueban que el archivo se escribe. | Anclar el contenido al archivo con una cadena multilínea, como hace TC-001: `"related:\n  - EPIC-30-ejemplo\n  - STORY-301-exportar-informe-csv\n---"`. |
| LOW | skills/epic-refine/evals/evals.json:241 | V-2. En TC-015 (y TC-016, línea 257), `responsable PO` y `fuera de alcance` se cumplen siempre con las líneas de H-001 INT-01 y H-002 INT-05 del fixture, así que no prueban que COH-1 vaya al PO. La discriminación real la aportan `reemplazo no determinable` y `varios directorios con el ID STORY-301`. La raíz está en que la plantilla de las listas del Paso 5 (`SKILL.md:175-177`) solo define `H-NNN · <código>`. | Usar una cadena propia de COH, como la fila del reporte `` | COH-1 | COH | — | `` o `fuera de alcance \| PO`, tras generalizar las listas del Paso 5 a `<Origen>`. |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-ai-security-checklist.md, docs/guardrails/gr-code-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md, .claude/skills/security-audit/assets/ai-security-checklist.md (40 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| LOW | skills/epic-refine/references/coh-corrections.md:62 | gr-code-security-checklist (semántica: validar por forma las entradas antes de usarlas) / SEC-051 / AI-014 | Persiste desde la ronda 1, porque `fix-directives.md` lo dejó fuera de la lista blanca. El reemplazo es el nombre del directorio tal cual: «Reemplazo = nombre del directorio». No se le exige la «Forma del slug» de la línea 24, que solo se aplica al slug obsoleto. El glob `specs/flow/<STORY-NNN>-*/` acepta nombres con mayúsculas, espacios, `]]`, comillas invertidas o saltos de línea en sistemas POSIX, y ese valor se escribe literal dentro de `[[…]]` en `epic.md` o en el `related:` del frontmatter YAML de un `story.md`. Además, la sección «Contenido no confiable» (línea 125) presenta el nombre de directorio como fuente confiable. El impacto está acotado: hace falta poder crear directorios en `specs/flow/`, y el Paso 7 revierte si cambian `status`/`substatus`. Sin embargo, la relectura no comprueba otras claves, como `parent`. | Exigir que el reemplazo cumpla la misma forma de slug de la sección 1 y empiece por el mismo `STORY-NNN-`. Si no la cumple, clasificar el COH como fuera de alcance · `PO` con la nota `directorio con nombre no conforme: reemplazo no aplicado` y añadir esa fila a la tabla de la sección 5. |

---

### Nota de Tamaño de Cambio

⚠️ Nota informativa: tamaño de cambio elevado (17 archivos modificados). Considera ejecutar /story-split antes de futuras historias similares para reducir el alcance. Esta nota es informativa y no afecta la decisión de este review.

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Siguiente acción

Ejecuta `/story-verify STORY-174`. Pendiente a criterio humano (AGENTS.md): `npm run test:eval -- epic-refine` para TC-014…TC-018. Los hallazgos LOW pueden agruparse en una historia de mantenimiento de `epic-refine`. El de mayor valor es la validación de forma del slug de reemplazo (`coh-corrections.md:62`).

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Se cumple [[dod-story-implement]] | ⚠️ | — | `implement-report.md`: 22/24 ✓, 0 ❌. Los 2 ⚠️ (Gherkin pasan, evals ejecutados) requieren `npm run test:eval -- epic-refine`, reservado a criterio humano. Requiere acceso a ejecución de tests: no se puede evaluar desde los artefactos disponibles |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Markdown en español, layout fijo intacto (`verify-fixed-layout.js` OK), fuente única en `skills/epic-refine/`, sin BOM (Integration y Tech-Lead) |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner-Reviewer: 6/6 escenarios verificados (AC-1 → TC-014, AC-2 → TC-015/TC-016) |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration-Reviewer: D-1…D-8 y CR-005 conformes; templates central = seed (`cmp` sin diferencias, 32/32 tests) |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | Los cuatro informes con `max-severity: LOW`; 0 HIGH, 0 MEDIUM |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | 24/24 tareas `[x]` |
| 7 | Metadatos frontmatter de `story.md` están completos y correctos con status y substatus actualizados | ✓ | — | `story.md` → `CODE-REVIEW/DONE`, `updated: 2026-10-31`, `parent` y `related` completos |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este reporte (2026-10-31) |
| 9 | Revisión de código aprobada (`verdict: APPROVED` en `code-review-report.md`) | ✓ | — | `verdict: APPROVED` |

**Resumen:** 8/9 criterios ✓ · 1 ⚠️ · 0 ❌
