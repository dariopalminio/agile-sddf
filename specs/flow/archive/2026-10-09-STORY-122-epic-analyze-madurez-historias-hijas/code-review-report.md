---
type: code-review-report
story: STORY-122
title: "Code Review Report: Señalar historias hijas no especificadas o con referencias rotas al analizar una épica"
review-status: approved
date: 2026-10-09
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-122

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-122 — Señalar historias hijas no especificadas o con referencias rotas al analizar una épica |
| Review status | approved |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-10-09 |

Alcance revisado (`implement-report.md`): `skills/epic-analyze/SKILL.md`, `skills/epic-analyze/assets/epic-analyze-report-template.md`, `skills/epic-analyze/evals/evals.json` (commit RED `5bcc84e`, TC-019…TC-025), `CHANGELOG.md` y `docs/domains/domain-epic-lifecycle.md`. El árbol de trabajo mezcla cambios aún sin commit de STORY-121 (familia `SAL-`); la revisión se centró en lo que añade STORY-122 (familia `MAD-`).

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

El contrato de la familia MAD es claro y coincide con el diseño: universo compartido, catálogo, orden y cláusula de datos no confiables. `SKILL.md` tiene 335 líneas (por debajo de 500). Los 28 casos de `evals.json` declaran `status`, `substatus` y `related` de forma coherente.

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-analyze/SKILL.md:172 | El orden de MAD-02 no resuelve el empate cuando hay varios valores rotos en la misma línea (`related: [a, b]`). Es un hueco pequeño en el determinismo (CNF-3). | Desempatar por la posición del valor en la lista. |
| LOW | skills/epic-analyze/SKILL.md:245-248 | `STORY-12` o `EPIC-7` (con menos dígitos de los exigidos) no casan con ninguna fila, caen en "cualquier otro" y no generan hallazgo. | Reformular la fila 3 como "prefijo `STORY-`/`EPIC-` con un ID que no cumple el formato", o declararlo fuera de alcance de forma explícita. |
| LOW | skills/epic-analyze/SKILL.md:230 | "Comparación exacta, en mayúsculas" es ambiguo: puede entenderse como convertir a mayúsculas o como tratar las minúsculas como MAD-03. | Precisar la regla. |
| LOW | skills/epic-analyze/assets/epic-analyze-report-template.md:29-30 | El placeholder `{t}` se usa para dos totales distintos, y la celda Valor repite la etiqueta. | Usar `{l}/{u}` o documentar por qué la etiqueta se repite. |
| LOW | skills/epic-analyze/assets/epic-analyze-report-template.md:50 | El comentario guía de `hallazgos` no refleja el orden secundario de MAD-02 ni la evidencia `story.md:<línea>`. | Remitir al Paso 5 de SKILL.md. |
| LOW | skills/epic-analyze/assets/epic-analyze-report-template.md:61 | El comentario de `notas-analisis` no menciona la nota "related no reconocido". | Añadirla a la lista. |
| LOW | docs/domains/domain-epic-lifecycle.md:224-226 | El párrafo de §9 no menciona la madurez, aunque la fila de §8 (línea 157) sí la incluye. | Añadir la madurez o remitir a §8. |
| LOW | CHANGELOG.md:18 | La entrada `/epic-analyze` es un único bullet de unos 2 500 caracteres que mezcla tres historias. | Dividirla en sub-bullets INT / SAL / MAD. |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

| Requisito | Implementación | Eval | Resultado |
|---|---|---|---|
| AC-1 — historias listas, sin hallazgos de madurez | `SKILL.md:232-236`, `:241-250` | TC-019 | PASS |
| AC-2 fila 1 — `STORY-202` en `SPECIFY/IN-PROGRESS` → MAD-01, acción `completar su especificación con /story-specify` | `SKILL.md:235`, `:259` | TC-020 | PASS |
| AC-2 fila 2 — `related` a `STORY-999` → MAD-02, acción `corregir o retirar la referencia` | `SKILL.md:245`, `:260` | TC-021 | PASS |
| CNF-1 — estado mínimo; `CANCELED` sin hallazgo | `SKILL.md:230` (orden = `domain-story-lifecycle.md:38/85`), `:236`, `:149/239` | TC-022, TC-024 | PASS |
| CNF-2 — mismo reporte, regla de veredicto de STORY-120, sin escribir `epic.md`/`story.md` | `SKILL.md:255/263`, `:267-273`, `:76-77/327` | TC-019…TC-025 | PASS |
| CNF-3 — idempotencia | `SKILL.md:79/172/298` | TC-025 | PASS |

Evidencia de ejecución: corrida 1 (TC-001…TC-020 PASS) y corrida 2 (`--only TC-021…TC-028`, 8/8 PASS) sobre el mismo `SKILL.md`.

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-analyze/evals/evals.json:739 | `contains "STORY-202"` también lo satisface la tabla del índice, así que no ancla la cita al bloque del hallazgo. | Una aserción que una el código MAD-01 y el elemento citado. |
| LOW | skills/epic-analyze/evals/evals.json:955 | TC-025 prueba la regeneración con fuentes que cambiaron, no dos corridas con fuentes idénticas. | Opcional: un caso con `previous_report` idéntico al esperado, o documentar CNF-3 como verificado por diseño. |
| LOW | skills/epic-analyze/evals/evals.json:831 | CNF-1 solo se ejercita con `COMPLETED`; ningún caso usa un estado intermedio. | Opcional: usar `PLAN/IN-PROGRESS` en algún caso. |

---

### Integración y Arquitectura (Integration-Reviewer)

La implementación cumple D-1…D-9 e I-1…I-6. Puntos concretos:

- El Paso 5c queda entre SAL y el veredicto.
- El universo (Paso 4.6) es único y lo comparten SAL y MAD.
- El orden de estados coincide con `domain-story-lifecycle` §4.1/§5.
- `related` se resuelve por ID.
- El catálogo MAD-01…MAD-03 usa las acciones literales de AC-2.
- Se mantiene el orden `INT-` < `MAD-` < `SAL-`.
- El campo de madurez está en `resumen`.
- La cláusula de datos no confiables cubre los campos nuevos.
- El commit RED solo trae `evals.json`.

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-analyze/SKILL.md:149 | La exclusión de `CANCELED` en el Paso 4.6 no aplica la normalización que define el Paso 5c; `"canceled"` queda ambiguo. | Aplicar o citar la misma normalización. |
| LOW | skills/epic-analyze/assets/epic-analyze-report-template.md:50 | El comentario de orden no recoge el desempate de MAD-02 (coincide con Tech-Lead). | Completarlo o remitir al Paso 5. |
| LOW | skills/epic-analyze/assets/epic-analyze-report-template.md:61 | No menciona la nota MAD "related no reconocido" (coincide con Tech-Lead). | Añadirla. |
| LOW | skills/epic-analyze/assets/epic-analyze-report-template.md:29-30 | `{t}` tiene dos significados (coincide con Tech-Lead). | Renombrar a `{u}`. |
| LOW | docs/domains/domain-epic-lifecycle.md:223-226 | §9 no menciona la madurez (coincide con Tech-Lead). | Completar el párrafo. |
| LOW | docs/domains/domain-skills-map.md:19 | La columna "Lee" de `epic-analyze` no refleja `status`/`substatus`/`related`. D-9 decidió no cambiarla. | Valorar una actualización mínima. |
| LOW | docs/specs/03-stories/STORY-122-epic-analyze-madurez-historias-hijas/design.md:242 | D-9 pedía `skill-master`. La desviación consta en `implement-report.md:81`, pero no como CR en `design.md`. | Registrar un CR-006 o aceptar la nota. |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-ai-security-checklist.md, docs/guardrails/gr-code-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md, .claude/skills/security-audit/assets/ai-security-checklist.md (55 reglas evaluadas)

Las comprobaciones deterministas salen limpias y no hay BOM. La cláusula `ai-untrusted-content-clause` está presente y ampliada (`SKILL.md:85`). Se mantiene una única escritura, sin cambios de estado, sin red y sin delegación. `related` solo se resuelve con un prefijo numérico, así que no puede salir de `$SPECS_BASE`. Los datos de los evals son sintéticos.

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| LOW | skills/epic-analyze/SKILL.md:85 | ai-untrusted-content-clause / SEC-051 | Valores arbitrarios de `status`/`substatus`/`related` se citan en código en línea sin escapar las comillas invertidas. Uno de esos valores podría activar Markdown (`<!--`) y ocultar hallazgos en la vista renderizada. El veredicto y los conteos no cambian. | Indicar un delimitador más largo que la racha de comillas invertidas del valor, o sustituirlas. |
| LOW | skills/epic-analyze/evals/evals.json:643 | AI-014 / AI-025 | Ningún eval prueba un `status` o `related` con texto en forma de instrucción. | Añadir un caso de prompt injection en el frontmatter. |

---

### Nota de Tamaño de Cambio

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ No se encontró testcases.md, así que se omitió el análisis de cobertura. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Decisión final

**review-status: approved**

Los cuatro revisores aprueban con severidad máxima LOW. Quedan 20 hallazgos LOW; varios se repiten entre Tech-Lead e Integration: el template seed en 29-30, 50 y 61, y §9 del dominio. Son ambigüedades menores del contrato, comentarios guía desactualizados, aserciones de eval mejorables y endurecimiento de seguridad sin impacto en el veredicto. Ninguno bloquea:

- AC-1, AC-2 (las dos filas) y CNF-1…CNF-3 están implementados con las acciones literales de la historia.
- Esos requisitos están cubiertos por TC-019…TC-025, que pasan.
- La integración con las familias INT y SAL respeta `design.md`.

Los candidatos más rentables a un ajuste posterior son el desempate de MAD-02 en línea (determinismo), la normalización de `CANCELED` en el Paso 4.6 y el escape de comillas invertidas al citar valores no confiables.

---

## Siguiente acción

Ejecuta `/story-verify STORY-122`. Si aplicas alguno de los ajustes LOW a `SKILL.md` o al template seed, vuelve a ejecutar `npm run test:eval -- epic-analyze` antes de verificar.

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Se cumple [[dod-story-implement]] | ⚠️ | — | `implement-report.md`: 21/24 ✓, 3 ⚠️ (linter no definido, `skill-master` no usado (D-9), build de CI). El build de CI requiere acceso a CI/CD y no se puede evaluar desde los artefactos. |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Skill en español, evals antes de `SKILL.md` (commit `5bcc84e`), UTF-8 sin BOM, checklist de skills con 0 incumplimientos |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner-Reviewer: AC-1 → TC-019; AC-2 → TC-020/TC-021 |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration-Reviewer: D-1…D-9 e I-1…I-6 conformes |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | Severidad máxima entre los cuatro agentes: LOW |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | `tasks.md`: 21 `[x]`, 0 `[ ]` |
| 7 | Metadatos frontmatter de `story.md` completos y correctos con status y substatus actualizados | ✓ | — | Frontmatter completo; pasa a `CODE-REVIEW/DONE` al cerrar esta revisión |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este archivo |
| 9 | Revisión de código aprobada (Review status approved en `code-review-report.md`) | ✓ | — | `review-status: approved` |

**Resumen:** 8/9 criterios ✓ (1 ⚠️, 0 ❌)
