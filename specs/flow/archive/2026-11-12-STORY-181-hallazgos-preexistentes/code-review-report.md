---
type: code-review-report
story: STORY-181
title: "Code Review Report: Hallazgos preexistentes"
verdict: APPROVED
date: 2026-11-11
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-181

## Veredicto

**Veredicto:** `APPROVED` — Sin hallazgos bloqueantes (severidad máxima: LOW).

La corrección de la ronda 1 está verificada por los cuatro revisores. `touched-lines.js` ahora devuelve `unknown` cuando una ubicación supera el final del archivo, tiene su prueba de regresión y `node --test test/story-code-review-preexisting.test.js` da 21/21. Los cuatro informes son válidos y solo quedan hallazgos LOW, que no bloquean.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-181 — Hallazgos preexistentes |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ✓ analizado (23 casos — UT:14/CT:0/IT:2/API:0/E2E:3/EV:4) |
| Ronda de revisión | 2 (re-revisión tras la ronda 1 de `fix-directives.md`) |
| Fecha | 2026-11-11 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/story-code-review/scripts/touched-lines.js:118-123 | `countLines` hace `fs.readFileSync` sin `try/catch` y se llama en `fileEvidence` para todo archivo existente. Antes de la ronda 1 el motor no leía el contenido, así que este camino de fallo es nuevo. Si la lectura falla (EACCES, o EBUSY en Windows con el archivo bloqueado), la excepción no se captura: el proceso sale con código 1 y traza de pila en vez del JSON con `unknown`, y no se cumple el contrato de la cabecera («Exit code: 0 siempre que se emita el JSON»). El error va en el sentido seguro: el Paso 4a.2 trata un exit distinto de 0 como `unavailable` y ningún hallazgo pasa a PREEXISTENTE. Pero se pierde la clasificación de todas las ubicaciones por un solo archivo ilegible. | Envolver la lectura en `try/catch` dentro de `fileEvidence` y devolver `{ status: 'unknown', why: 'el archivo no se pudo leer en el working tree' }`. De paso, contar las líneas solo cuando haga falta (después de la comprobación `new`), porque un archivo nuevo nunca usa `lineCount`. |
| LOW | test/story-code-review-preexisting.test.js:157-169 | La prueba de regresión de la ronda 1 solo usa un archivo que termina en `\n` (el fixture `write` añade siempre el salto final). Las ramas de `countLines` para un archivo sin salto final (`breaks + 1`) y para un archivo vacío (`0`) no tienen prueba. Si esas ramas tuvieran un error de uno, una línea N+1 inexistente podría volver a salir `untouched`. | Añadir dos casos: un archivo sin `\n` final en el que `:<última>` sea `untouched` y `:<última+1>` sea `unknown`, y un archivo vacío de la base en el que `:1` sea `unknown`. |
| LOW | skills/story-code-review/scripts/touched-lines.js:138 | Hallazgo LOW de la ronda anterior que sigue abierto: `git diff ... -- <file>` toma la ruta como pathspec con comodines, así que `g[1].js` coincide también con `g1.js`. El error va en el sentido seguro (más `touched`) y solo resta precisión. | Pasar `--literal-pathspecs` a la llamada (o prefijar la ruta con `:(literal)`). |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/story-code-review/evals/evals.json:1123 | Los pasos `Entonces` de AC-1 a AC-3 que dependen del árbitro (veredicto `APPROVED`/`NEEDS-CHANGES`, ausencia o presencia de `fix-directives.md`, fila `Hallazgos preexistentes`) solo los aseveran los evals TC-030 a TC-033, que siguen sin ejecutarse (`npm run test:eval`, a criterio humano según `implement-report.md:112`). La suite determinista cubre la clasificación del motor y la degradación, pero no el cálculo del veredicto. Es un hueco esperado para un árbitro LLM, y las reglas existen en `SKILL.md`. Se arrastra de la ronda 1. | Ejecutar `npm run test:eval -- story-code-review` (al menos TC-030 a TC-033) antes de ACCEPTANCE. |
| LOW | test/story-code-review-preexisting.test.js:307 | La aserción 7 no fija las exclusiones de los Pasos 4b, 4c y 4e («ni PREEXISTENTE», «nunca un PREEXISTENTE»), que materializan «no cuenta para max-severity» y «no se genera fix-directives.md» (AC-1). Una edición concurrente de `SKILL.md` (STORY-182 ya reescribió esas frases) podría quitarlas sin que falle ningún test determinista. Se arrastra de la ronda 1. | Opcional: añadir a la aserción 7 una comprobación de que 4b, 4c y 4e mencionan la exclusión de los PREEXISTENTE. |

---

### Integración y Arquitectura (Integration-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/story-code-review/scripts/touched-lines.js:129-142 | Viene de la ronda 1 y no se corrigió (opcional). La invariante de D-3 («`untouched` exige que git pruebe que el archivo existía en la base y que el rango no cambió») sigue sin cumplirse cuando el índice oculta los cambios del working tree. Lo reproduje de nuevo tras la ronda en un repo temporal. Un archivo con `git update-index --skip-worktree` y la línea 10 modificada da `a.js:10` → `untouched`. Un archivo sacado del índice con `git rm --cached` que sigue en el working tree da `b.js:10` → `untouched`: el diff trae `deleted file mode` con `@@ -1,20 +0,0 @@` y `touchedLines` solo marca las líneas 0 y 1. Hacen falta estados de índice poco comunes, y el flujo normal no se ve afectado. | Dar `unknown` (o `touched`) a todo el archivo si el diff trae `deleted file mode` o `+++ /dev/null` y el archivo existe en el working tree, o si `git ls-files -v -- <ruta>` muestra el bit `S`/`h` o no lista el archivo. Añadir el caso a la aserción 3 o 4 de D-8. |
| LOW | skills/story-code-review/scripts/touched-lines.js:150-153 | La ronda añade a D-3 una regla nueva («rango más allá del final del archivo → `unknown`»). Con ella son cuatro las decisiones de implementación que amplían D-3: esta, `--no-textconv`, «diff sin hunks → todo tocado» y `cat-file -e <base>:./<ruta>`. Las cuatro solo figuran en `implement-report.md` («Decisiones de implementación dentro de D-3»). La tabla de D-3 de `design.md` no las recoge y no tiene CR. Todas van en el sentido seguro y no cambian I-1 ni I-2. | Registrar un CR-003 en el «Registro de Cambios» de `design.md` con las cuatro reglas, para que la spec anclada describa el motor tal cual es. |
| LOW | specs/flow/STORY-181-hallazgos-preexistentes/story.md:51 | Viene de la ronda 1. CR-001 de `design.md` sigue sin aplicarse: AC-3 dice «con el método que fija el ADR de la guía de revisión», y la nota de la línea 72 dice «el ADR decide cómo identificar las líneas no tocadas». No tiene impacto funcional. | Aplicar CR-001 en AC-3 y en la nota de dependencias antes de `/story-acceptance`. |
| LOW | specs/flow/STORY-181-hallazgos-preexistentes/implement-report.md:94-95 | La viñeta «Línea fuera de rango (ronda 1)» tiene un salto de línea literal dentro del código en línea: la línea 94 termina en «Un `» y la 95 empieza por «` final no abre…». Es el escape `\n` convertido en carácter literal. La viñeta se rompe al renderizar y el texto ya no dice «un `\n` final». | Sustituir el salto literal por `` `\n` `` en una sola línea. |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-code-security-checklist.md, docs/guardrails/gr-ai-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md (62 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| — | — | — | Sin hallazgos de seguridad | — |

---

### Nota de Tamaño de Cambio

ℹ️ Nota informativa: tamaño de cambio aceptable (6 archivos modificados) — sin acción requerida.

---

### Cobertura de Casos de Prueba (testcases.md)

**Cobertura en testcases.md (Product-Owner-Reviewer)**

| Severidad | AC / Escenario | Descripción | Recomendación |
|-----------|----------------|-------------|---------------|
| LOW | Test Cases Progress (specs/flow/STORY-181-hallazgos-preexistentes/testcases.md:70-92) | Las 23 entradas del checklist siguen en `[ ]`, aunque UT-001 a UT-014, IT-001 e IT-002 pasan (21/21 en esta revisión). No hay entradas `[!]`. E2E-001 a E2E-003 y EV-001 a EV-004 sí están pendientes (manual y `test:eval`). | Marcar `[x]` en los UT e IT que pasan y dejar `[ ]` en los E2E y EV hasta ejecutarlos. |
| LOW | AC-3 (specs/flow/STORY-181-hallazgos-preexistentes/story.md:51) | CR-001 sigue sin aplicarse: el `Dado` de AC-3 remite al «método que fija el ADR de la guía de revisión», pero ese método lo fijan D-1 a D-3 de `design.md` conforme a ADR-0021. La nota de la línea 72 tiene el mismo problema. La trazabilidad de fondo es correcta: AC-3 → E2E-003, EV-003 y UT-011 a UT-013. | Actualizar el `Dado` de AC-3 y la nota «Depende de STORY-178» según CR-001 antes de `/story-acceptance`. |
| LOW | AC-1 (fail-safe de D-3, ronda 1) | La prueba de regresión nueva («una línea o un rango más allá del final del archivo es unknown») no tiene caso en la tabla de `testcases.md`. UT-010 («Ubicaciones sin evidencia son `unknown`») no menciona el rango fuera del archivo, así que la cobertura de la invariante en las Notas (línea 61) queda desactualizada. | Ampliar UT-010 (o añadir un UT-015) con `src/calc.js:500` → `unknown`, y la última línea → `untouched`. |

**Trazabilidad de diseño en testcases.md (Integration-Reviewer)**

Todas las referencias D-N de `testcases.md` (D-1 a D-8) apuntan a decisiones que existen en `design.md`: no hay referencias huérfanas.

| Severidad | Test Case ID | Descripción | Recomendación |
|-----------|--------------|-------------|---------------|
| LOW | IT-002 | Viene de la ronda 1. Es un caso de tipo Integration sin referencia D-N: su columna Ref solo tiene `I-1, T010`, aunque lo verifica la aserción 6 de D-8. | Añadir `D-8` a la columna Ref de IT-002. |
| LOW | UT-010 | La prueba de regresión de la ronda 1 (`test/story-code-review-preexisting.test.js:157-169`, «una línea o un rango más allá del final del archivo es unknown») no tiene caso en `testcases.md`. Ni UT-010 («Ubicaciones sin evidencia son `unknown`») ni otro UT nombran la línea fuera de rango, así que la regla nueva de la invariante no tiene trazabilidad caso → D-3. | Añadir un UT-015 «Línea o rango más allá del final del archivo» (`src/mod.js:500`, `:18-25` y `:21` → `unknown`; `:20` y `:19-20` → `untouched`) con Ref `D-3, invariante`, o ampliar UT-010. |

---

## Siguiente acción

La historia queda en `CODE-REVIEW/DONE`, lista para `/story-verify STORY-181`. Antes de ACCEPTANCE conviene ejecutar `npm run test:eval -- story-code-review` (TC-030 a TC-033) a criterio humano. Los LOW de documentación (CR-001 en `story.md`, CR-003 en `design.md`, el checklist de `testcases.md` y la viñeta rota de `implement-report.md`) pueden resolverse de paso, porque ninguno bloquea.

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Se cumple [[dod-story-implement]] | ⚠️ | — | `implement-report.md`: 19/24 ✓, 5 ⚠️ y 0 ❌. Los ⚠️ (evals, linter, CI, desviaciones de D-3 fuera de `design.md`) necesitan CI o `test:eval`, que este skill no puede ejecutar |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Tech-Lead `approved` (LOW): motor Node sin dependencias, JSDoc, JSON en stdout. Seguridad sin hallazgos frente a los guardrails de la constitución |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner `approved`: AC-1 a AC-3 trazados al motor (21/21), al Paso 4a.2 de `SKILL.md` y a TC-030 a TC-033 |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration `approved`: D-1 a D-8, I-1 a I-8 y C-1 a C-6 conformes. Solo hay desviaciones LOW de documentación |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | Severidad máxima LOW en los cuatro informes válidos |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | `tasks.md`: 25 `[x]`, 0 `[ ]` |
| 7 | Metadatos frontmatter de `story.md` están completos y correctos con status y substatus actualizados | ✓ | — | `story.md` pasa a `CODE-REVIEW/DONE` en el Paso 6 |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este reporte (2026-11-11) |
| 9 | Revisión de código aprobada (`verdict: APPROVED` en `code-review-report.md`) | ✓ | — | `verdict: APPROVED` |

**Resumen:** 8/9 criterios ✓ (1 ⚠️, 0 ❌)
