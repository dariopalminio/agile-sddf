---
type: code-review-report
story: STORY-168
title: "Code Review Report: Skill epic-track-progress"
verdict: APPROVED
date: 2026-10-30
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-168

## Veredicto

**Veredicto:** `APPROVED` — Sin hallazgos bloqueantes (severidad máxima: LOW).

Los cuatro revisores entregaron informes válidos con `status: approved`. Los 14 hallazgos son de severidad LOW: son ajustes de coherencia entre `SKILL.md` y su referencia, aserciones de evals, metadatos y endurecimiento de la presentación. Ninguno compromete los criterios de aceptación ni la garantía de solo lectura.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-168 — Skill epic-track-progress |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-10-30 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-track-progress/SKILL.md:117-121 | El ejemplo de salida pone `STORY-201` antes de `STORY-200`, y la regla de la línea 121 manda ordenar por `STORY-NNN` ascendente. Un agente puede tomar el ejemplo como patrón y no la regla. | Intercambiar las dos filas del ejemplo para que respete el orden ascendente. |
| LOW | skills/epic-track-progress/SKILL.md:94 · references/story-sources.md:40 | El atributo `origen` (`índice` / `parent` / `índice + parent`) se calcula en el Paso 2 y en la referencia, pero ningún paso lo usa: no aparece en la tabla de salida del Paso 4 ni en la clasificación del Paso 3. El eval TC-002 dice que STORY-204 «figura con origen parent» sin poder comprobarlo. | Quitar `origen` del Paso 2 y de §4 de la referencia, o añadir la columna `Origen` a la tabla del Paso 4 (y a design.md). |
| LOW | skills/epic-track-progress/SKILL.md:134 | El Paso 5 dice que un `story.md` con frontmatter ilegible siempre genera una fila `pendiente`. En cambio, `references/story-sources.md` §3.4 lo ignora si no figura en el índice. Las dos instrucciones se contradicen en el caso de una historia no listada. | Precisar la fila del Paso 5: «`story.md` listado en el índice con frontmatter ilegible». También se puede remitir a §3.4. |
| LOW | CHANGELOG.md:13 | El commit a65291b añade al `### Added` la entrada de `/epic-validate` (STORY-124), pero no la de `/epic-track-progress`. | Añadir una entrada `/epic-track-progress (EPIC-23, STORY-168)` en `### Added`. |
| LOW | docs/domains/domain-skills-map.md:5 | Se añadieron filas al mapa sin actualizar `updated:` del frontmatter (sigue en `2026-10-08`). | Actualizar `updated:` a la fecha del cambio. |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

Escenarios verificados: 4/4 (AC-1 → TC-001, AC-2 → TC-002, AC-3 → TC-003, AC-4 → TC-004), además de D-3 (canceladas) → TC-005.

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-track-progress/evals/evals.json:55-95 | AC-2 (y SMOKE-6 / CNF-1): el paso «Y ningún archivo cambia» solo se verifica por texto, con la línea fija `Solo lectura: no se modificó ningún archivo` y `not_contains` `.tmp/`/`report.md`. Un caso declarativo no observa el disco. | Convertir TC-002 (o añadir un caso) al modo `sandbox` de `scripts/run-evals.js` con `expected.files.written: []`. |
| LOW | skills/epic-track-progress/evals/evals.json:34-51 | AC-1 pide una fila por historia con ID, status, substatus y ubicación, pero TC-001 no afirma `STORY-202`, ni los valores `DELIVER`/`COMPLETED`/`DONE`, ni la ubicación `activa`. | Añadir a `expected.contains` de TC-001: `STORY-202`, `DELIVER`, `COMPLETED`, `activa`. |
| LOW | specs/flow/STORY-168-skill-epic-track-progress/implement-report.md:71,86 | Los evals TC-001…TC-005 no se han ejecutado (DoD IMPLEMENT #1 y #16 en ⚠️). Es lo esperado según AGENTS.md. | Ejecutar `npm run test:eval -- epic-track-progress` y el recorrido SMOKE-6 antes de ACCEPTANCE (story-verify). |

---

### Integración y Arquitectura (Integration-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-track-progress/SKILL.md:134 | El Paso 5 no recoge el matiz de §3.4 de la referencia (una historia no listada con frontmatter ilegible se ignora). Además, `epic-validate/references/story-sources.md:47` la incluye sin distinguir si está listada, así que las tres copias difieren en este borde. | Precisar la fila del Paso 5 o remitir a §3.4. Alinear con `epic-validate` §4.5 en una historia posterior. |
| LOW | skills/epic-track-progress/references/story-sources.md:19 | El fallback del template es el literal `Historias`, y `epic-analyze`/`epic-validate` usan el seed `$CLI_ROOT/...`. Hoy el comportamiento es equivalente; la desviación está justificada (CNF-3) y documentada. | Aceptable. Si el seed renombra la sección, actualizar el literal. |
| LOW | skills/epic-track-progress/references/story-sources.md:11-15 | La forma 1 (ruta explícita) no define qué pasa con una épica bajo `specs/flow/archive/`; `epic-analyze` emite `❌ … está archivada`. | Indicar que una ruta bajo `specs/flow/archive/` termina con el `❌` del Paso 1. |
| LOW | specs/flow/STORY-168-skill-epic-track-progress/design.md (Context, Non-Goals) | design.md cita ADR-0017, ya reemplazado por ADR-0019. La implementación cita bien ADR-0019. | Opcionalmente, actualizar la referencia en design.md. |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-ai-security-checklist.md, docs/guardrails/gr-code-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md (33 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| LOW | skills/epic-track-progress/SKILL.md:113 | ai-semantic (contenido ingerido como dato) / SEC-051 | La cláusula de `SKILL.md:62` dice que los valores leídos se muestran en código en línea, pero la plantilla de salida muestra `<title>` (`:113`), el nombre de las líneas F1 (`:121`) y `<status>/<substatus>` de la línea `⏳` (`:124`) sin código en línea. Solo afecta al render en el chat. | Envolver esos valores en código en línea, o acotar la cláusula de `:62` a las celdas de la tabla. |
| LOW | skills/epic-track-progress/references/story-sources.md:11 | gr-code semántica (ruta confinada) / gr-ai semántica (nada fuera del directorio de trabajo) | La forma **Ruta** no exige de forma explícita que la ruta quede bajo `REPO_ROOT/specs/flow/EPIC-NN-<slug>/`. El impacto es bajo porque el skill es de solo lectura. | Agregar que la ruta se normaliza y debe quedar bajo `specs/flow/EPIC-NN-<slug>/`; si no, terminar con el `❌` del Paso 1. |

---

### Nota de Tamaño de Cambio

ℹ️ Nota informativa: tamaño de cambio aceptable (7 archivos modificados) — sin acción requerida.

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Siguiente acción

Ejecuta `/story-verify STORY-168`. Incluye `npm run test:eval -- epic-track-progress` (TC-001…TC-005) y el recorrido manual SMOKE-6, que siguen pendientes. Los hallazgos LOW son opcionales: pueden atenderse en una historia de mantenimiento junto con la alineación de `epic-validate` §4.5.

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Se cumple [[dod-story-implement]] | ⚠️ | — | implement-report: 20/24 ✓, 0 ❌. Los 4 ⚠️ (ejecución de evals, casos de prueba, CHANGELOG, CI remoto) requieren ejecución o acceso a CI/CD y no se pueden evaluar desde los artefactos |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Skill en español, fuente en `skills/`, layout fijo verificado (`verify-fixed-layout.js` OK), UTF-8 sin BOM |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | product-owner-report: AC-1…AC-4 → instrucción en SKILL.md/referencia + eval TC-001…TC-004 |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | integration-report: los cinco componentes, las interfaces y D-1…D-8 se respetan |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | 14 hallazgos, todos LOW |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | 23/23 tareas `[x]` |
| 7 | Metadatos frontmatter de `story.md` completos y correctos con status y substatus actualizados | ✓ | — | Frontmatter completo; se actualiza a `CODE-REVIEW/DONE` |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este archivo |
| 9 | Revisión de código aprobada (`verdict: APPROVED` en `code-review-report.md`) | ✓ | — | `verdict: APPROVED` |

**Resumen:** 8/9 criterios ✓ (1 ⚠️, 0 ❌)
