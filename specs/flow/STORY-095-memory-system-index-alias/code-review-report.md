---
type: code-review-report
story: STORY-095
title: "Code Review Report: Crear el skill memory-system con el modo index y deprecar docs-wiki-builder"
review-status: approved
date: 2026-09-21
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-095

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-095 — Crear el skill memory-system con el modo index y deprecar docs-wiki-builder |
| Review status | approved (2ª pasada; la 1ª fue needs-changes por un U+FEFF literal en `memory-system.js:93`, corregido) |
| Severidad máxima detectada | LOW (efectiva; ver nota del árbitro en Seguridad) |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ✓ analizado (22 casos — UT:10/CT:0/IT:3/API:0/E2E:3/EV:6) |
| Fecha | 2026-09-21 |

### Historial de revisiones

| Pasada | Resultado | Bloqueante | Resolución |
|---|---|---|---|
| 1 | needs-changes (MEDIUM) | U+FEFF literal en `skills/memory-system/scripts/memory-system.js:93` (`ai-no-hidden-characters`, error) | Sustituido por el escape ASCII; `tasks.md` 27/27 `[x]`; T022 aplicado a `story.md` |
| 2 | approved (LOW) | Ninguno vigente: el U+FEFF reintroducido por la herramienta de edición en `implement-report.md:76` se corrigió y verificó a nivel de bytes durante la consolidación | — |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

**status: approved · max-severity: LOW**

Verificación del ciclo de corrección: el U+FEFF literal de `memory-system.js:93` está sustituido por el escape dentro de la regex; escaneo de U+FEFF / U+200B–U+200D / U+2060 sobre `skills/memory-system/**`, `skills/docs-wiki-builder/**`, `test/memory-system.test.js`, `scripts/check-doc-links.js`, `test/check-doc-links.test.js` y `config/eval-exemptions.json` sin resultados. Hallazgo cerrado.

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/memory-system/scripts/memory-system.js:123-127 | `valueFlags[token]` sobre un objeto literal con prototipo: un token posicional como `constructor` resuelve a una función truthy y consume el siguiente argumento, produciendo un error de uso engañoso. | `Object.hasOwn(valueFlags, token)` y `UsageError` si falta el valor. |
| LOW | skills/memory-system/scripts/memory-system.js:61,288 · references/memory-rules.md:33 | `EXCLUDED_DIRS` excluye `.cache`, `templates`, `pre-split` a cualquier profundidad; `memory-rules.md` documenta rutas concretas. | Alinear la regla documentada ("en cualquier nivel"). |
| LOW | skills/memory-system/scripts/memory-system.js:307-323 | `expandGlob` recorre todo el subárbol aunque el patrón no contenga `**`. Coste acotado (solo raíces externas). | Limitar la profundidad al número de segmentos del patrón. |
| LOW | skills/memory-system/scripts/memory-system.js:9,123,414 | `--date` sin validar formato `YYYY-MM-DD`. Flag interno de tests, no expuesto en SKILL.md. | Validar con `/^\d{4}-\d{2}-\d{2}$/` o anotarlo como flag de prueba. |
| LOW | test/memory-system.test.js:25,247,258 | Lambda `(t) => t.replace(...)` sombrea el contexto de test `t`; `run(args, cwd)` declara un parámetro `cwd` que ningún caso usa. | Renombrar a `tpl`; eliminar `cwd`. |
| LOW | scripts/check-doc-links.js:139-141 | `PENDING_NODE_MARKER` declarada a mitad de archivo en vez del bloque de constantes (l. 16-31). | Mover al bloque de constantes. |
| LOW | CHANGELOG.md:24 · memory-system/SKILL.md:202 · docs-wiki-builder/SKILL.md:4,14 · README.md:245 · sddf-commands-pipeline.md:52 · architecture/memory-system.md:237,244,277 | La entrada del CHANGELOG está bajo `[3.2.1]` (commit `b71e9e9` del mantenedor) mientras seis documentos afirman "deprecado desde 3.3.0". Registrado en implement-report como "no aplicado — decisión pendiente". | Decidir: renombrar a `[3.3.0]`/`[Unreleased]` o alinear los seis textos a 3.2.1. |

Nota fuera de alcance: `header-aggregation` evals 0/3 por falsos positivos preexistentes en su `evals.json`; abrir tarea aparte.

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

**status: approved · max-severity: LOW**

Trazabilidad verificada: Escenario 1 (AC-1, AC-5) → `memory-system` TC-001 + UT-006/007/008/009 — cubierto. Escenario 2 (AC-2, AC-6) → `docs-wiki-builder` TC-001/002 — cubierto. Escenario 3 (AC-3) → diff de `header-aggregation/SKILL.md` (solo nota) + sus 3 evals preexistentes — cubierto con evidencia débil. AC-4 → UT-001…003, IT-002, TC-004. AC-5 → UT-009. AC-6 → `eval-exemptions.json` sin `docs-wiki-builder` + V-9. AC-7 → TC-003.

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | test/memory-system.test.js:207-213 | "Agrupada por capa": UT-008 comprueba formato y orden pero no que cada entrada quede bajo el encabezado de su capa; cubierto indirectamente por UT-010/UT-010b e IT-002. | Aserción de posición sección < entrada para dos capas del fixture `sddf`. |
| LOW | skills/docs-wiki-builder/evals/evals.json | Gherkin "con o sin `--update`/`--dry-run`": sin eval para `--update` (mapeo idéntico a "sin args"). | Añadir TC-003 con `flags: ["--update"]`. |
| LOW | skills/docs-wiki-builder/evals/evals.json | "Produce el mismo `docs/index.md`" se infiere estructuralmente (alias sin lógica); V-4 ("eval + diff") queda para VERIFY manual (E2E-002). | Registrar el diff manual en `verify-report.md`. |
| LOW | skills/header-aggregation/evals/evals.json:17,32 | Evals preexistentes de `header-aggregation` fallan 0/3 por falsos positivos de grading ajenos a la historia. | Endurecer `not_contains` en tarea aparte; confirmar E2E-003 manualmente en VERIFY. |

---

### Integración y Arquitectura (Integration-Reviewer)

**status: approved · max-severity: LOW**

Verificado: motor determinista con `detect`/`index`, alias sin lógica propia (D-5), `header-aggregation` independiente (D-6), escritura confinada a `SPECS_BASE` (D-2), template como fuente de verdad (D-4), contratos de interfaz y esquema de datos conformes, frontmatter de ambos `SKILL.md` solo `name` + `description`.

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | CHANGELOG.md:16-30 | Entrada bajo `[3.2.1]` vs "desde 3.3.0" en design.md, alias, README, guías y arquitectura. Sin cambios desde la 1ª pasada (decisión del mantenedor pendiente). | Ver hallazgo equivalente de Tech-Lead. |
| LOW | scripts/check-doc-links.js:139-151 | Verificador transversal modificado sin CR en `design.md` (documentado en implement-report, memory-rules.md:95 y CHANGELOG). | Añadir `CR-004` (tipo: dependencia) a design.md. |
| LOW | skills/memory-system/scripts/memory-system.js:9,123 | Flags `--template` y `--date` ausentes en "Interfaces" de design.md y "Parámetros" de SKILL.md; `--template` no declarado en ningún documento. | Declararlos como flags de prueba. |
| LOW | skills/memory-system/scripts/memory-system.js:327,430,436 | `REPO_ROOT = dirname(SPECS_BASE)`: con `root` anidado el motor buscaría marcadores en otro directorio. Documentado en memory-rules.md, no en design.md. Sin impacto aquí. | Documentar en D-2 o añadir `--repo-root` opcional. |
| LOW | docs/domains/domain.md:3 | `slug: domain` añadido fuera de "Componentes afectados"; documentado en implement-report y CHANGELOG. | Sin acción obligatoria. |
| LOW | — | D-7 sin caso `Ref: D-7`; no huérfano (NFR-4/NFR-5 se verifican por revisión y `verify:links`, contrato 12). | Sin acción. |

**Trazabilidad de diseño en testcases.md:** correcta — D-1…D-6 y F-1…F-4 existen; IT-001/002/003 con referencia de diseño; sin huérfanas.

---

### Seguridad (Security-Reviewer)

**status (agente): needs-changes · max-severity (agente): MEDIUM → efectiva LOW tras consolidación**

**Fuentes de checklist:** docs/guardrails/gr-code-security-checklist.md, docs/guardrails/gr-ai-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md (65 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| ~~MEDIUM~~ → corregido | docs/specs/03-stories/STORY-095-memory-system-index-alias/implement-report.md:76 | ai-no-hidden-characters (error) | El ciclo de corrección eliminó el U+FEFF del motor pero la herramienta de edición lo reintrodujo como carácter literal en la celda "Sustituido por el escape ASCII" del informe de implementación (bytes `ef bb bf`). | **Nota del árbitro:** corregido durante la consolidación (texto del escape en ASCII) y verificado con `grep -P` de rangos Unicode sobre `docs/specs/03-stories/STORY-095*/`, `skills/memory-system/`, `skills/docs-wiki-builder/` y `.tmp/story-code-review/STORY-095/` → 0 ocurrencias. No queda hallazgo vigente. |
| LOW | skills/memory-system/scripts/memory-system.js:245,262-269,339-344 | gr-code semántica (validar inputs del Markdown parseado) | `slug`/`title` del frontmatter se insertan en `index.md` sin restricción de forma (`]]`, `|`, `[[…]]`). Impacto acotado: los archivos fuente ya son legibles por el agente. | Restringir `slug` a `/^[A-Za-z0-9._-]+$/` y neutralizar `[[`, `]]`, `|` en `title`. |
| LOW | skills/memory-system/SKILL.md:156-180 | ai-untrusted-content-clause (warn) | El Paso 4 (degradación inline) lee cada `.md` y raíces externas sin declarar que su contenido es dato, nunca instrucción. | Añadir la cláusula mínima del guardrail en el Paso 4. |

Sin hallazgos: el motor y los skills están limpios a nivel de bytes (33 archivos), sin secretos, shell/eval, TLS off, rutas absolutas ni patrones de override; escritura confinada a `<root>/index.md`. Fuera de alcance: `sec-gitignore-coverage` para `.temp`/`__pycache__` en `.gitignore` (archivo no tocado).

---

### Nota de Tamaño de Cambio

⚠️ Nota informativa: tamaño de cambio elevado (19 archivos modificados). Considera ejecutar /story-split antes de futuras historias similares para reducir el alcance. Esta nota es informativa y no afecta la decisión de este review.

---

### Cobertura de Casos de Prueba (testcases.md)

**Product-Owner — Cobertura en testcases.md:**

| Severidad | AC / Escenario | Descripción | Recomendación |
|-----------|----------------|-------------|---------------|
| — | — | Todos los ACs cubiertos en testcases.md: AC-1 (E2E-001, UT-006…008, IT-001, EV-001/002), AC-2 (E2E-002, EV-005/006), AC-3 (E2E-003), AC-4 (UT-001…003, IT-002, EV-004), AC-5 (E2E-001, UT-009, IT-002), AC-6 (E2E-002, EV-005), AC-7 (EV-003). Tres escenarios con E2E 1-a-1. Sin `[!]`. | — |
| LOW | E2E-001…003, IT-001, IT-003 | 5 entradas `[ ]` en "Test Cases Progress": E2E-001/002 e IT-001 cubiertos indirectamente por EV-001/EV-005; IT-003 manual por diseño; E2E-003 depende de los evals de `header-aggregation`. | Marcarlas en VERIFY tras la confirmación manual. |

**Integration — Trazabilidad de diseño en testcases.md:** `| — | — | Trazabilidad de diseño correcta en testcases.md | — |`

---

## Decisión final

**review-status: approved**

Los cuatro revisores coinciden en que la implementación es correcta, determinista, confinada y bien cubierta (17 tests del motor, 6 evals de skill en verde, 7/7 ACs trazados). El único hallazgo MEDIUM de esta pasada — un U+FEFF literal reintroducido en `implement-report.md` por la herramienta de edición, no en código de producción — fue corregido y verificado a nivel de bytes durante la consolidación, por lo que no queda ningún hallazgo bloqueante vigente. Los 20 hallazgos LOW son mejoras opcionales de robustez, cobertura y alineación documental; el más relevante para el mantenedor es la inconsistencia de versión (`[3.2.1]` en CHANGELOG vs "desde 3.3.0" en seis documentos), que requiere una decisión explícita.

---

## Siguiente acción

1. Decidir la versión de la deprecación: renombrar la entrada del CHANGELOG a `[3.3.0]` (o `[Unreleased]`) **o** alinear los seis textos "desde 3.3.0" a 3.2.1.
2. Ejecutar `/story-verify STORY-095` (cerrar E2E-001…003, IT-001, IT-003 con verificación manual: `/memory-system index --dry-run`, `/docs-wiki-builder --dry-run`, `/header-aggregation <story.md>`).
3. Opcional (LOW): aplicar las mejoras de robustez del motor (`Object.hasOwn`, validación de `--date`, charset de `slug`), la cláusula de contenido no confiable en el Paso 4 de `SKILL.md`, y registrar `CR-004` en `design.md`.
4. ~~Tarea aparte: endurecer los `not_contains` de `skills/header-aggregation/evals/evals.json`.~~ **Hecho tras la revisión:** `evals.json` v1.1.0 con fixtures en `examples/` → 3/3 PASS.

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Definition of Done para el estado IMPLEMENT es satisfactorio | ✓ | — | implement-report.md: 11 ✓ · 3 ⚠️ · 0 ❌; ciclo de corrección aplicado |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Tech-Lead e Integration: skill Markdown < 500 líneas, motor `node:` sin dependencias, rutas relativas, kebab-case |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner: 3/3 escenarios y 7/7 ACs trazados a tests/evals |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration: D-1…D-7, interfaces y esquema de datos conformes |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | Único MEDIUM (U+FEFF en implement-report.md) corregido y verificado en consolidación; sin hallazgos vigentes > LOW |
| 6 | Sin tareas pendientes en `tasks.md` | ✓ | — | 27/27 `[x]` (T001–T026 + "Implementar fix-directives.md") |
| 7 | Metadatos frontmatter de `story.md` completos y con status/substatus actualizados | ✓ | — | Frontmatter completo; → CODE-REVIEW/DONE |
| 8 | `code-review-report.md` creado o actualizado | ✓ | — | Este documento (2ª pasada) |
| 9 | Revisión de código aprobada (`approved`) | ✓ | — | review-status: approved |

**Resumen:** 9/9 criterios ✓
