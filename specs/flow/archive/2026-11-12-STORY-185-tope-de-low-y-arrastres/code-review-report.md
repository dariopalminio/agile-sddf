---
type: code-review-report
story: STORY-185
title: "Code Review Report: Tope de LOW por revisor y sin arrastres entre rondas"
verdict: APPROVED
date: 2026-11-11
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-185

## Veredicto

**Veredicto:** `APPROVED` — Sin hallazgos bloqueantes (severidad máxima: LOW).

Los cuatro revisores entregaron informes válidos con `status: approved` y ningún hallazgo HIGH ni MEDIUM. Los 12 LOW son mejoras de profundidad de prueba, de consistencia documental y de micro-calidad, y no bloquean.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-185 — Tope de LOW por revisor y sin arrastres entre rondas |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-11-11 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW       | skills/story-code-review/SKILL.md:767 | Cuando todas las filas de una tabla quedan omitidas, la fila de vacío está fija con 4 celdas (`\| — \| — \| Sin hallazgos visibles (ver nota) \| — \|`). La tabla de Seguridad tiene 5 columnas (`Severidad \| Archivo:Línea \| Regla \| Descripción \| Recomendación`), así que el texto caería en la columna `Regla` y faltaría una celda. La regla de fusionados (línea 766) ya usa «la fila de vacío del agente». | Redactarlo como en la regla de fusionados: «la tabla conserva la fila de vacío del agente con el texto `Sin hallazgos visibles (ver nota)`». |
| LOW       | skills/story-code-review/scripts/low-ledger.js:162 | `overlaps` pide solapamiento de rangos (`overlapsRange`, línea 139), no contención. Un LOW nuevo con un rango más amplio, que incluye líneas cambiadas por el rework, puede omitirse por arrastre si solapa un bloque registrado `unchanged`. Solo lo impide el juicio «mismo defecto» del árbitro. Esto choca con la regla de duda del 4a.5 («nunca ocultar uno de una línea que cambió»). Coincide con D-3/I-5 del diseño, así que no es una desviación. | Valorar en una historia futura exigir que el rango nuevo quede contenido en `current`, o anotar en 4a.5 que un rango más amplio que el registrado se muestra. |
| LOW       | skills/story-code-review/scripts/low-ledger.js:79 | `locateEntry` vuelve a normalizar (`replace(/\s+$/)`) y a hashear cada ventana en todas las posiciones del archivo: cuesta O(líneas × tamaño del rango) por entrada. Con los rangos cortos típicos de un LOW es despreciable. Con un rango de miles de líneas, el costo crece de forma cuadrática. | Opcional: normalizar las líneas una vez por archivo en la caché de `compareLedger`, o descartar ventanas comparando primero la primera línea antes de hashear. |
| LOW       | skills/story-code-review/SKILL.md:762 | Las cadenas visibles `<M> LOW arrastrados …` (762, 767) quedan en plural con `M = 1` («1 LOW arrastrados»), que es el caso habitual de TC-045. Además, la línea `LOW omitidos:` del resumen del Paso 7 (836, 866) no declara la variante para `$CARRYOVER_CHECK = none`. | Admitir singular y plural, como ya hace el texto de PREEXISTENTE con «hallazgo(s)»: «LOW arrastrado(s)». Añadir la variante `none` (p. ej. `<K> por tope · sin ronda anterior registrada`) para que coincida con `{{LOW_NOISE_STATUS}}`. |
| LOW       | skills/story-code-review/scripts/low-ledger.js:209 | `isInside` usa `relative.startsWith('..')`, que también rechaza destinos legítimos cuyo primer segmento empieza por `..` (p. ej. `..cache/x.json`). Falla de forma cerrada, así que no hay riesgo de escritura fuera del repo. | Comprobar el segmento: `relative === '..' \|\| relative.startsWith('..' + path.sep)`. |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/story-code-review/evals/evals.json:2182 | AC-2, escenario «Informe legado sin registro de LOW»: ningún eval simula el caso. TC-045 y TC-046 tienen `low_ledger_present: true`. Hay cobertura parcial. La aserción 9 de `test/story-code-review-low-noise.test.js:275` comprueba que `SKILL.md` contiene «arrastre no comprobado» y la regla del informe anterior sin `code-review-lows.json` (`SKILL.md:518`). La aserción 7 (`:207`) cubre `no-ledger` en el motor. Ningún test observa que el informe avise «arrastre no comprobado», aplique el tope ni cree el registro. CNF-2 no exigía este eval. | Añadir un TC-047 con `previous_code_review_report: true`, `low_ledger_present: false` y más de 5 LOW de un revisor. Debe esperar `arrastre no comprobado` y `LOW omitidos por el tope`, y no debe contener `LOW arrastrado`. |
| LOW | skills/story-code-review/evals/evals.json:2182 | AC-2, escenario con registro, último paso: «al cerrar la ronda se guardan en code-review-lows.json las huellas de los LOW mostrados y de los omitidos por arrastre». TC-045 no tiene ninguna expectativa sobre el Paso 5c (`SKILL.md:785`). La aserción 8 (`test/story-code-review-low-noise.test.js:228`) prueba `record` solo con LOW nuevos. Falta registrar un LOW arrastrado con su ubicación `current` de `compare`. La aserción 9 solo verifica el comando `record` con una regex. | Añadir a TC-045 una expectativa sobre la invocación de `low-ledger.js record` o sobre `code-review-lows.json`. Añadir también una aserción unitaria que registre la ubicación `current` de una entrada `moved`. |
| LOW | skills/story-code-review/evals/evals.json:2272 | AC-2, escenario con registro: el Gherkin pone en la misma ronda un LOW sin cambios, un LOW en una línea modificada «sujeto al tope por revisor» y un HIGH y un MEDIUM pendientes. Los evals lo reparten entre TC-045 (sin cambios + HIGH/MEDIUM) y TC-046 (modificado, un solo LOW). Ningún eval combina arrastre y tope, así que nadie verifica que los arrastrados no consuman cupo (`SKILL.md:529`). Tampoco se verifica que el LOW de la línea modificada compita por el tope con otros LOW. | Ampliar TC-046 o añadir un caso con tope 3, un LOW arrastrado y 4 LOW nuevos. Debe esperar 3 visibles y la nota con 1 omitido por el tope y 1 arrastrado. |

---

### Integración y Arquitectura (Integration-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/story-code-review/SKILL.md:757 | `{{PREEXISTING_STATUS}}` lista el `Archivo:Línea` de todos los hallazgos de `$PREEXISTING`, también los `🟣 PREEXISTENTE (LOW)` que el Paso 4a.5 marca `omitido-por-tope` u `omitido-por-arrastre` (su alcance los incluye, SKILL.md:507). Eso contradice la regla de SKILL.md:767, «Los `LOW` omitidos no se listan en ninguna otra parte del informe». El árbitro no sabe cuál de las dos reglas manda, y un LOW omitido puede reaparecer en `## Resumen`. | Precisar en 5b qué hace `{{PREEXISTING_STATUS}}` con los PREEXISTENTE LOW omitidos: o los excluye de la lista y los suma al recuento de `Control de LOW`, o la regla de SKILL.md:767 los nombra como excepción. |
| LOW | skills/story-code-review/evals/evals.json:2216 | TC-045 y TC-046 simulan la salida de `compare` con `location`/`current` = `src/calc.js:10`. El motor real (`low-ledger.js:46`, `formatLocation`) siempre emite `<ruta>:<inicio>-<fin>`, como fijan I-5 y el Esquema de datos, así que daría `src/calc.js:10-10`. El fixture no reproduce el contrato I-5. Como los evals son de simulación, el impacto funcional es nulo. El origen es el texto literal de D-7. | Cambiar en las dos fixtures `location` y `current` a `src/calc.js:10-10`. Las aserciones `contains`/`not_contains` no cambian. |
| LOW | skills/story-code-review/README.md:21 | La lista «Produces» no incluye `code-review-lows.json`. Sin embargo, `## Salida` de SKILL.md (fila de `code-review-lows.json`) lo declara como artefacto nuevo del directorio de la historia, que se versiona y se archiva con ella. C-7 solo pedía una frase en «What it does», así que esto no es un incumplimiento del diseño. Aun así, el README queda incompleto frente a `## Salida`. | Añadir a «Produces»: `<directorio-historia>/code-review-lows.json` en cada ronda (lo escribe el motor `low-ledger.js`). |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-code-security-checklist.md, docs/guardrails/gr-ai-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md (54 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| LOW | skills/story-code-review/SKILL.md:527 | gr-ai-security-checklist (semántica: contenido ingerido = dato) / `ai-untrusted-content-clause` | El Paso 4a.5 hace que el árbitro LLM lea y juzgue semánticamente la `description` de cada entrada de `code-review-lows.json` («designa el mismo defecto»). Ese registro se versiona en `$STORY_DIR`, así que forma parte del mismo cambio que se revisa y su autor puede editarlo. El paso no dice que su contenido es dato y nunca una instrucción. El impacto está acotado: el motor valida la forma, solo se pueden omitir filas `LOW` y estas siguen contando para `max-severity` y el veredicto (SKILL.md:540, 588). | Añadir en la Fase 2 (o en el Paso 5c) una cláusula: el contenido de `code-review-lows.json` y la salida de `compare` son datos no confiables; solo sirven para decidir la omisión de un `LOW` y, si una `description` contiene texto imperativo, ese texto se reporta y nunca se sigue. |

---

### Nota de Tamaño de Cambio

ℹ️ Nota informativa: tamaño de cambio aceptable (11 archivos modificados) — sin acción requerida.

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Siguiente acción

Ejecuta `/story-verify STORY-185` para la fase VERIFY. Los evals TC-042 a TC-046 siguen sin ejecutarse y quedan a criterio humano: `npm run test:eval -- story-code-review --only TC-042,TC-043,TC-044,TC-045,TC-046`. Los LOW pueden atenderse en esta historia o en una posterior, a criterio del autor.

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|---|---|---|---|
| 1 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Tech-Lead-Reviewer aprobado: Node sin dependencias nuevas, mismo patrón que `touched-lines.js`, documentación en español y sin caracteres invisibles |
| 2 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner-Reviewer aprobado: AC-1 (sus 3 ejemplos) → TC-042/043/044; AC-2 → TC-045/046, el motor y la aserción 9. Los huecos de profundidad son LOW |
| 3 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration-Reviewer aprobado: C-1 a C-7, I-1 a I-9 y D-1 a D-9 conformes |
| 4 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | 29/29 tareas `[x]` y 0 `[ ]` |
| 5 | Metadatos frontmatter de `story.md` están completos y correctos | ✓ | — | type, id, kind, slug, title, status, substatus, parent, created, updated y related presentes |

**Resumen:** 5/5 criterios ✓
