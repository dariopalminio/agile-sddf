---
type: code-review-report
story: STORY-186
title: "Code Review Report: ADR de workflows sin estados buffer"
verdict: APPROVED
date: 2026-11-14
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-186

## Veredicto

**Veredicto:** `APPROVED` — Sin hallazgos bloqueantes (severidad máxima: LOW).

Los cuatro revisores entregaron informes válidos con `status: approved` y los 5 criterios del DoD CODE-REVIEW se cumplen. Los 8 hallazgos son `LOW`: mejoras de precisión en el ADR y en los artefactos de la historia, huecos heredados que deben resolver los `design.md` de STORY-189/STORY-190 y una prueba de tiempo preexistente que impide cumplir CNF-4 al pie de la letra.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-186 — ADR de workflows sin estados buffer |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-11-14 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | docs/adr/ADR-0022-workflows-sin-estados-buffer.md:219 | El motivo de descarte de «Lista blanca de aceptación con los archivos que tocó la implementación» afirma que «`implement-report.md` solo lista archivos en modo rework». No es exacto: `story-implement-tasks` lista `Archivos generados` por tarea en toda ejecución (`skills/story-implement-tasks/SKILL.md:578`) y `story-implement` nombra los archivos generados en la fila GREEN de `## Ciclo TDD` (`skills/story-implement/SKILL.md:1052`). La frase viene literal de `design.md:113`. El descarte sigue en pie, pero por otro motivo: ningún ejecutor registra de forma estructurada y uniforme los archivos modificados fuera del rework, y `story-implement` sobrescribe el reporte en cada ejecución. | Antes de cerrar la historia, cambiar la frase por algo como «`implement-report.md` no registra de forma uniforme entre ejecutores los archivos modificados fuera del modo rework». Así se cumple la regla de veracidad de AGENTS.md. Si se corrige, alinear también `design.md:113`. |
| LOW | docs/adr/ADR-0006-migracion-retroactiva-de-estados-de-epica.md:15 | ADR-0006 y ADR-0008 (`ADR-0008-rework-sin-estado-propio.md:11`) quedan `SUPERSEDED` sin una nota de reemplazo bajo el título. `docs/adr/README.md:34` pide esa nota, y ADR-0001, ADR-0004, ADR-0010, ADR-0016 y ADR-0017 la tienen. Quien abra el cuerpo del ADR solo ve el reemplazo en el frontmatter. Es una decisión deliberada y documentada (D-07, CR-001), exigida por AC-1 y CNF-3. | No cambiar nada en esta historia. Más adelante, aclarar en `docs/adr/README.md` que la nota es opcional (ADR-0003 tampoco la tiene) o añadirla en una historia que lo permita, para que la convención y la práctica no diverjan. |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | specs/flow/STORY-186-adr-de-workflows-sin-estados-buffer/implement-report.md:95 | CNF-4 («`npm run verify:repository` y `npm test` pasan») no se cumple literalmente. En esta revisión, `npm test` volvió a fallar en `S097-UT-011` (`test/memory-system.test.js:901`, «check tardó 9255 ms»), y `verify:repository` se detiene en ese mismo paso. El fallo es preexistente y depende de la carga de la máquina: falla igual en la línea base de T001 y no tiene relación con los archivos de la historia, que son solo Markdown. Los otros 13 pasos del gate salen con 0, según el implement-report. | Volver a ejecutar `npm test` y `npm run verify:repository` con la máquina descargada antes de VERIFY y adjuntar el resultado en verify-report.md. Si sigue fallando, registrar la deuda de `S097-UT-011` aparte, sin bloquear esta historia. |
| LOW | specs/flow/STORY-186-adr-de-workflows-sin-estados-buffer/story.md:74 | Los Non-Goals de `story.md` dicen que el ADR lo implementan «STORY-187 a STORY-192 y STORY-194», pero STORY-194 no existe en `specs/flow/` ni en el índice de la épica. ADR-0022, en las líneas 40, 230 y 253-256, nombra correctamente STORY-187 a STORY-193, de acuerdo con la reagrupación de `epic.md`. La inconsistencia está en la especificación, no en el entregable. | Corregir el Non-Goal de `story.md` para que diga «STORY-187 a STORY-193». |

---

### Integración y Arquitectura (Integration-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | docs/adr/ADR-0022-workflows-sin-estados-buffer.md:111 | La regla «lista blanca de aceptación vacía, sin error» solo describe cómo se comporta `story-implement`: confirmación en interactivo y registro con `--auto` en `### Archivos fuera de lista blanca`. `story-implement-tasks` es el otro ejecutor que consume el contrato, y limita los cambios a la lista blanca (`skills/story-implement-tasks/SKILL.md:395`). Si falta la lista, recurre a la columna `Archivo:Línea` (`SKILL.md:761`), que en un rechazo de aceptación es `story.md:<línea>`, así que no podría corregir el código. Copia literal de design.md D-04: es un hueco del diseño, no una desviación. Hoy no tiene impacto, porque esta historia no cambia skills. | En el `design.md` de STORY-190 (o de STORY-189), definir qué hace `story-implement-tasks` con una lista blanca vacía. No editar ADR-0022 una vez aceptado: si la regla cambia, hace falta un ADR nuevo. |
| LOW | specs/flow/STORY-186-adr-de-workflows-sin-estados-buffer/design.md:29 | `design.md` (Context y V-2, línea 185) y `tasks.md` (T001 y T002) hablan de 7 secciones o encabezados en `adr-template.md`, pero la plantilla tiene 6 `##`. La implementación reproduce correctamente los 6 y documenta la desviación en `implement-report.md`. | Corregir el conteo en `design.md` y `tasks.md` (6), o dejarlo registrado como CR en `design.md`. |
| LOW | docs/adr/README.md:34 | La convención de inmutabilidad del índice dice que al reemplazar un ADR «se añade una nota visible de reemplazo bajo su título (únicos cambios permitidos)». ADR-0006 y ADR-0008 no llevan esa nota. Es la decisión deliberada D-07/CR-001, que exigen AC-1 y CNF-3, y es consistente con el diseño. Aun así, el índice que modifica esta historia sigue enunciando una regla que sus propias filas no cumplen. | Tramitar aparte la propuesta de CR-001: redactar la nota como «opcional» en `docs/adr/README.md`. No bloquea. |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-code-security-checklist.md, docs/guardrails/gr-ai-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md (37 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| LOW | docs/adr/ADR-0022-workflows-sin-estados-buffer.md:111 | gr-ai semántica «OWASP LLM/Agentic» (LLM06 Excessive Agency) / SEC-037 | Con la lista blanca vacía de un rechazo de `story-acceptance`, el ejecutor en `--auto` puede modificar cualquier archivo existente del repositorio sin confirmación y solo lo registra en `### Archivos fuera de lista blanca` de `implement-report.md` (líneas 111-113). Es una confinación más débil que la de los otros dos gates, y la sección de consecuencias (línea 237) solo menciona el efecto en modo interactivo, no la ausencia de confinamiento en `--auto`. No hay exposición: el cambio es reversible con git y vuelve a pasar por `/story-code-review` (línea 114). | Endurecimiento opcional, no bloqueante: al diseñar STORY-189/STORY-190, valorar que `--auto` con lista blanca vacía falle cerrado (se detenga y pida intervención) o acote la lista a los archivos citados en el AC rechazado o en `tasks.md`; o al menos documentar el efecto en `--auto` en el `design.md` correspondiente. |

---

### Nota de Tamaño de Cambio

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Siguiente acción

Ejecuta `/story-verify STORY-186`. Antes de VERIFY, vuelve a ejecutar `npm test` y `npm run verify:repository` con la máquina descargada para confirmar que `S097-UT-011` pasa (CNF-4). Las mejoras `LOW` son opcionales:

- Corregir la referencia a STORY-194 en `story.md:74`.
- Ajustar el conteo de secciones (6) en `design.md` y `tasks.md`.
- Precisar la frase de `ADR-0022:219`. Esta mejora conviene hacerla antes de cerrar la historia, porque un ADR aceptado es inmutable una vez cerrado.
- Trasladar la regla de la lista blanca vacía con `story-implement-tasks` y `--auto` a los `design.md` de STORY-189 y STORY-190.

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Tech-Lead-Reviewer `approved`: ADR en español, estructura de `adr-template.md`, wikilinks válidos y sin BOM ni caracteres invisibles |
| 2 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner-Reviewer: AC-1, AC-2 (las 3 filas de Ejemplos) y AC-3 trazados a líneas concretas de ADR-0022, ADR-0006, ADR-0008 y `docs/adr/README.md` |
| 3 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration-Reviewer: C-1 a C-5, interfaces y D-01 a D-08 coinciden; ADR-0006 y ADR-0008 cambian solo 2 líneas; ADR-0003 intacto |
| 4 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | `tasks.md`: 20 `[x]`, 0 `[ ]` |
| 5 | Metadatos frontmatter de `story.md` están completos y correctos | ✓ | — | `type`, `id`, `kind`, `slug`, `title`, `status`, `substatus`, `parent`, `created`, `updated` y `related` presentes y coherentes con EPIC-029 |

**Resumen:** 5/5 criterios ✓
