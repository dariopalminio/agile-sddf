---
type: code-review-report
story: STORY-174
title: "Code Review Report: Skill epic-refine: corregir referencias obsoletas tras un split"
verdict: NEEDS-CHANGES
date: 2026-10-30
max-severity: MEDIUM
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-174

## Veredicto

**Veredicto:** `NEEDS-CHANGES` — 3 hallazgo(s) bloqueante(s) (severidad máxima: MEDIUM).

El eval del happy path de AC-1 (TC-014) no verifica los archivos que se escriben: todas sus aserciones ya aparecen en la consola (plan, `Recibirán .bak:`, `Archivos modificados:`), así que el caso pasaría aunque no se escriba ningún archivo ni `.bak`. Los otros dos bloqueantes son criterios DoD que dependen de ese mismo hallazgo. Los cuatro revisores entregaron un informe válido. La especificación de la familia COH es correcta y coherente con el diseño, y los 13 hallazgos restantes son LOW.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-174 — Skill epic-refine: corregir referencias obsoletas tras un split |
| Severidad máxima detectada | MEDIUM |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-10-30 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| MEDIUM | skills/epic-refine/evals/evals.json:225 | El oráculo de TC-014 (happy path de AC-1) no verifica los efectos que se persisten. Todos sus `contains` (`` `STORY-301-exportar-informe` → `STORY-301-exportar-informe-csv` ``, `[[STORY-301-exportar-informe-csv]]`, `EPIC-30-ejemplo/epic.md.bak`, `STORY-302-programar-envio-informe/story.md.bak`) ya salen en la consola: en la columna **Después** del plan del Paso 5, en `Recibirán .bak:` y en `Archivos modificados:` del Paso 9. El caso pasaría aunque no se escriba `epic.md`, el `story.md` de STORY-302 ni ningún `.bak`, y no comprueba en el archivo el Entonces de AC-1 «el `related` de STORY-302 cita `STORY-301-exportar-informe-csv`». No sigue la convención que este skill ya usa para los efectos persistidos: marcadores `<ruta> ===` de los bloques FILE en TC-001 y en el caso COH de pertenencia (línea 355). | Añadir al `context` la frase «Los bloques FILE usan la ruta relativa a specs/flow/ del fixture… e incluyen cada <archivo>.bak creado». En `contains`, usar `EPIC-30-ejemplo/epic.md.bak ===`, `EPIC-30-ejemplo/epic.md ===`, `STORY-302-programar-envio-informe/story.md.bak ===`, `STORY-302-programar-envio-informe/story.md ===` y la entrada ya reemplazada (`  - STORY-301-exportar-informe-csv`). Por coherencia, en TC-015/TC-016 (líneas 242 y 258) añadir a `not_contains` `STORY-302-programar-envio-informe/story.md ===` y `EPIC-30-ejemplo/epic.md ===`, para verificar que esos archivos no se escriben. |
| LOW | skills/epic-refine/evals/evals.json:290 | En TC-018, `not_contains: "COH"` (y `"MAD-02"` en TC-014, línea 226) es frágil: una salida correcta que explique «no se ejecuta la detección COH» o «no reportado como MAD-02» falla el caso aunque el comportamiento sea el esperado. | Acotar a marcadores del comportamiento: `COH-1` en lugar de `COH` en TC-018; en TC-014, `H-003` o `· MAD-02` en lugar de `MAD-02`. |
| LOW | skills/epic-refine/SKILL.md:174 | El bloque del plan del Paso 5 sigue mostrando solo `H-NNN · <código>` en las listas «Ya resueltos» y «Fuera de alcance» (líneas 175 y 177). La viñeta de la línea 183 amplía **Origen** a `COH-<n>` solo para la columna de la tabla, así que no queda especificado cómo aparece un COH en esas listas (p. ej. el COH-1 fuera de alcance de AC-2 en `--auto`). | Generalizar las plantillas de las listas a `- <Origen>: <motivo>` / `- <Origen> · responsable PO: <nota>`, con Origen = `H-NNN · <código>` o `COH-<n>`. |
| LOW | skills/epic-refine/references/coh-corrections.md:33 | La regla de existencia (línea 33) basta con que exista el directorio `specs/flow/S/`, pero la regla de reemplazo (línea 58) exige directorios que contengan `story.md`, igual que los globs de `epic-analyze` Paso 4.4. Un directorio con el slug citado y sin `story.md` deja la referencia fuera de COH y tampoco la resuelve como historia. | Alinear la existencia con los mismos globs: `specs/flow/S/story.md` o `specs/flow/archive/<YYYY-MM-DD>-S/story.md`. |
| LOW | skills/epic-refine/SKILL.md:6 | La frase `La forma de epic.md es /epic-improve.` sustituyó a `No usar para la forma de epic.md: eso es /epic-improve.` para ajustar la `description` a 490 caracteres. Pierde la forma explícita de disparador negativo y se lee como una afirmación suelta. | Recuperar el negativo de forma compacta (p. ej. `No para la forma de epic.md (/epic-improve).`), manteniendo ≤ 500 caracteres. |
| LOW | skills/epic-refine/examples/split-ambiguo/archive/2026-10-01-STORY-301-exportar-informe-pdf/story.md:12 | El fixture archivado no es realista. El prefijo `2026-10-01-` no coincide con `updated: 2026-10-24`, y AGENTS.md fija que la fecha de archivo sale de `updated:`. Además, la línea 21 dice «Quiero exportar el informe mensual a CSV» en la historia de PDF (copia de STORY-301). No afecta a TC-016. | Renombrar el directorio a `2026-10-24-STORY-301-exportar-informe-pdf/` (y actualizar la descripción de TC-016) o ajustar `updated:`, y corregir la oración Quiero a PDF. |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

AC-1, AC-2, CNF-1, CNF-2, CNF-3 y la nota de disparo con `verdict: APPROVED` tienen correspondencia concreta en `SKILL.md`, `references/coh-corrections.md`, los fixtures `split-*` y los evals TC-014…TC-018 (6/6 verificados). Los evals no se ejecutaron (`npm run test:eval -- epic-refine` queda a criterio humano).

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-refine/evals/evals.json:225 | AC-1 «Y el `related` de STORY-302 cita `STORY-301-exportar-informe-csv`»: ninguna aserción comprueba el contenido escrito de ese `related`. La cadena `STORY-301-exportar-informe-csv` ya aparece en el `related` de STORY-306 y en la flecha del reporte o del plan. La comprobación vale para el índice (`[[STORY-301-exportar-informe-csv]]`), no para STORY-302. TC-014 no usa el modo `sandbox` de `run-evals`, que sí califica el árbol en disco (como TC-023). | Añadir un caso sandbox sobre `split-slug-obsoleto/` con `expected.files.contains` de `specs/flow/STORY-302-programar-envio-informe/story.md`, o en TC-014 añadir a contains el fragmento `  - STORY-301-exportar-informe-csv` del bloque FILE de STORY-302 |
| LOW | skills/epic-refine/evals/evals.json:241 | En TC-015 (y TC-016, línea 257), la aserción `PO` es trivial: la línea fija `REPORTE:` del bloque de retorno ya contiene la subcadena «PO». «Responsable PO» y «el reporte lista COH-1» tampoco distinguen entre el plan y el `epic-refine-report.md` escrito. | Usar una cadena discriminante, como la fila del reporte `` | COH-1 | COH | — | `` o `fuera de alcance \| PO`, o un caso sandbox con `expected.files.contains` sobre `epic-refine-report.md` |
| LOW | skills/epic-refine/evals/evals.json:290 | TC-018: la nota de la historia exige que con `APPROVED` no se cree ni modifique ningún archivo. Las aserciones solo excluyen textos de consola y no excluyen que aparezcan bloques `=== FILE:`. | Añadir `=== FILE:` a not_contains, o convertir el caso a sandbox con `files.written: []`, como TC-024 sobre `aprobada/` |
| LOW | skills/epic-refine/examples/split-sin-reemplazo/STORY-302-programar-envio-informe/story.md:12 | El fixture de AC-2 justifica la ausencia de MAD-02 para `STORY-310-importar-datos` con «reporte anterior a la referencia» (CR-001), pero el `updated: 2026-10-24` de STORY-302 es anterior al `updated: 2026-10-28` del reporte. Así el aviso de reporte desactualizado (`SKILL.md:122`) no se dispara. | Subir el `updated:` de STORY-302 a una fecha posterior a la del reporte (p. ej. `2026-10-29`); TC-015 puede comprobar además el aviso `puede estar desactualizado` |
| LOW | skills/epic-refine/examples/split-ambiguo/archive/2026-10-01-STORY-301-exportar-informe-pdf/story.md:12 | El prefijo de fecha del directorio archivado (`2026-10-01`) no coincide con su `updated: 2026-10-24`, contra la regla de archivo de ADR-0019. No afecta al resultado de TC-016. | Renombrar el directorio a `2026-10-24-STORY-301-exportar-informe-pdf/` o ajustar `updated:`, y actualizar la descripción de TC-016 |

---

### Integración y Arquitectura (Integration-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | specs/flow/STORY-174-corregir-referencias-obsoletas-tras-split/design.md:138 | La tabla «Fuera de alcance (`PO`)» de D-5 solo lista «0 o ≥ 2 directorios» y «`related` no reconocido». La implementación añade la regla de **Pertenencia** (historia listada que declara otra épica o no tiene `parent` → fuera de alcance · PO: `coh-corrections.md:18-20`, `:104-105`; fila COH de `SKILL.md:147`). Llegó con la corrección del code review de STORY-165 (commit `fa0f2bf`), pero el design.md de STORY-174 no la recoge ni en D-5 ni en un CR. | Añadir un CR-006 a design.md que documente la regla de pertenencia y los dos casos nuevos de fuera de alcance de COH. No cambia el código. |
| LOW | skills/epic-refine/SKILL.md:11-14 | La sección «Cuándo usar este skill» enumera INT, MAD y SAL, pero no el caso COH. El disparador sí está en `description` (línea 5) y en `README.md:37-38`. | Añadir una viñeta COH a «Cuándo usar este skill», igual a la de `README.md:37`. |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-ai-security-checklist.md, docs/guardrails/gr-code-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md, .claude/skills/security-audit/assets/ai-security-checklist.md (35 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| LOW | skills/epic-refine/references/coh-corrections.md:62 | gr-code (semántica: validar entradas por forma antes de usarlas) / AI-014 | El reemplazo es el nombre del directorio tal cual, sin exigir que cumpla la «Forma del slug» de la línea 24, que solo se aplica a los candidatos obsoletos. El glob `specs/flow/<STORY-NNN>-*/` acepta nombres con mayúsculas, espacios, `]]` o comillas invertidas, y ese valor se escribe literal dentro de `[[…]]` en `epic.md` o en `related:` del `story.md`. El impacto está acotado: hace falta poder crear directorios en `specs/flow/`, y el Paso 7 revierte si cambian `status`/`substatus`. | Exigir que el reemplazo cumpla la misma forma de slug y, si no la cumple, clasificar el COH como fuera de alcance · `PO` con la nota `directorio con nombre no conforme: reemplazo no aplicado`. |

---

### Nota de Tamaño de Cambio

⚠️ Nota informativa: tamaño de cambio elevado (17 archivos modificados). Considera ejecutar /story-split antes de futuras historias similares para reducir el alcance. Esta nota es informativa y no afecta la decisión de este review.

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Siguiente acción

Aplica `fix-directives.md` (ronda 1) con `/story-implement STORY-174` (alternativa, ya que existe `tasks.md`: `/story-implement-tasks STORY-174`) y vuelve a ejecutar `/story-code-review STORY-174`. Los hallazgos LOW son opcionales; los de `evals.json` (TC-014…TC-018) conviene resolverlos en la misma pasada que el MEDIUM.

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Se cumple [[dod-story-implement]] | ⚠️ | — | `implement-report.md`: 22/24 ✓, 0 ❌; los 2 ⚠️ (Gherkin pasan, casos ejecutados) requieren `npm run test:eval -- epic-refine`, reservado a criterio humano |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Markdown en español, layout fijo intacto, fuente única en `skills/epic-refine/`, sin BOM (Integration y Tech-Lead) |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner-Reviewer: AC-1 y AC-2 trazados a `SKILL.md`, `coh-corrections.md`, fixtures `split-*` y TC-014…TC-016 |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration-Reviewer: D-1…D-8 y CR-005 respetados; solo 2 LOW documentales |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ❌ | MEDIUM | Tech-Lead-Reviewer: MEDIUM en `skills/epic-refine/evals/evals.json:225` (TC-014 no verifica los archivos escritos) |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | `tasks.md`: 24/24 `[x]`, ninguna `[ ]` |
| 7 | Metadatos frontmatter de `story.md` están completos y correctos con status y substatus actualizados | ✓ | — | Frontmatter completo; status/substatus actualizados por esta revisión |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este archivo |
| 9 | Revisión de código aprobada (`verdict: APPROVED` en `code-review-report.md`) | ❌ | MEDIUM | `verdict: NEEDS-CHANGES` por el criterio 5 |

**Resumen:** 6/9 criterios ✓ · 1 ⚠️ · 2 ❌
