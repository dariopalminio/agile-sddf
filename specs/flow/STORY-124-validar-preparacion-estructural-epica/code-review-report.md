---
type: code-review-report
story: STORY-124
title: "Code Review Report: Validar la preparación estructural de una épica"
verdict: APPROVED
date: 2026-10-31
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-124

## Veredicto

**Veredicto:** `APPROVED` — Sin hallazgos bloqueantes (severidad máxima: LOW).

Los cuatro revisores emitieron informes válidos con `status: approved` y ningún hallazgo HIGH o MEDIUM. Los 9 hallazgos LOW son mejoras de precisión de la especificación, de los datos de los evals y endurecimientos opcionales; no bloquean y se recomienda tratarlos en una historia de mantenimiento. La revisión se acotó al aporte de STORY-124 (commit `a65291b`, sin STORY-168); las extensiones de STORY-125…128, 137, 169 y 175 sobre `skills/epic-validate/` no se atribuyen a esta historia.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-124 — Validar la preparación estructural de una épica |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-10-31 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-validate/references/story-sources.md:47 | La regla «Frontmatter ilegible: la historia entra con `status`/`substatus` = `—`» no distingue si la historia está listada en el índice. Si no está listada, su pertenencia (Vía B, §4.3) no se puede determinar sin `parent`; una lectura literal la mete en el universo de cualquier épica y produce un `NEEDS-CHANGES` espurio. La misma regla está en `SKILL.md:443`. Además, la línea 3 afirma que las reglas son una copia idéntica de `epic-analyze` (Paso 4.5) y de `epic-track-progress` (`references/story-sources.md` §3.4), y las dos sí hacen esa distinción (listada → se evalúa; no listada → solo nota). | Acotar §4.5: «si la historia está listada en el índice, entra con `—` y la nota; si no está listada, solo se anota `<ruta>: frontmatter ilegible` y no entra en el universo», en línea con los skills hermanos. |
| LOW | skills/epic-validate/SKILL.md:192 | En `EST-02`, la fila «El archivo no existe o no es legible» usa la evidencia `no existe <ruta>` en los dos casos. Si el archivo existe pero no se puede leer, el reporte afirma algo falso y despista al mantenedor (la acción sugerida, `ejecutar /epic-analyze`, puede no resolverlo). | Separar la evidencia: `no existe <ruta>` para la ausencia y `<ruta> no legible: <causa>` para el error de lectura. El resultado `bloqueada` no cambia. |
| LOW | skills/epic-validate/SKILL.md:138 | El Paso 0 cita ADR-0017, que ADR-0019 reemplazó el 2026-10-30 (el mismo día de la implementación). `references/story-sources.md:9` ya cita ADR-0019 y los skills hermanos citan ADR-0016, así que la referencia es inconsistente. `verify:layout` no lo detecta. Es informativo: la historia (CNF-1, `story.md:63`) pedía ADR-0017 de forma explícita. | Cuando se toque el skill, alinear la cita con el ADR vigente (ADR-0019), también en el CNF-1 de la historia si se edita. No bloquea. |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-validate/evals/evals.json (TC-002, TC-003) | Desde STORY-125, en TC-002 y TC-003 la épica no declara ningún `SMOKE-N` y la entrada no fija `sddf_config` ni `package_json`. Por eso `OPE-01` queda `no cumple` y el veredicto `NEEDS-CHANGES` ya no depende solo de EST-01/EST-02: la aserción de veredicto no distingue nada. La cobertura de AC-2 se mantiene por otras vías: las aserciones del motivo (`IMPLEMENT/IN-PROGRESS`, `/epic-analyze EPIC-32`) y los casos limpios TC-024 y TC-018. | Alinear sus fixtures con TC-001/TC-004: añadir `SMOKE-1` con dueña aprobada y `sddf_config`/`package_json: "no existe"`, para que el único motivo sea el estructural. |
| LOW | skills/epic-validate/evals/evals.json (TC-005) | AC-3 dice «identificador o ruta», pero solo se prueba con un ID (`EPIC-77`). Ni la ruta inexistente ni un directorio sin `epic.md` tienen un caso, aunque el Paso 1.4 de SKILL.md los trata. | Opcional: añadir un caso con una ruta inexistente (`specs/flow/EPIC-77-x`) que compruebe la ruta citada y `files_written: []`. |
| LOW | skills/epic-validate/evals/evals.json (TC-002, TC-024) | AC-2 pide identificar «cada» historia no terminal, pero todos los casos tienen una sola. La regla de un motivo por historia (Paso 4) no se ejerce con dos o más. | Opcional: una variante con dos historias no terminales que compruebe `M-001` y `M-002`, cada una con su estado. |

---

### Integración y Arquitectura (Integration-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-validate/SKILL.md:138 | El Paso 0 dice «El layout no es configurable (ADR-0017)». ADR-0019 (creado después de `a65291b`, en STORY-175) reemplaza a ADR-0017, y `references/story-sources.md:9` ya cita ADR-0019. Cuando se escribió STORY-124 la cita era correcta; la referencia quedó desactualizada por un cambio posterior. Es informativo y sin impacto funcional (`verify:layout` solo exige el marcador). | Cambiar la cita a ADR-0019 en el Paso 0, preferiblemente en una historia de mantenimiento de EPIC-23/26 y no como retrabajo de STORY-124. |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-ai-security-checklist.md, docs/guardrails/gr-code-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md (71 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| LOW | skills/epic-validate/references/story-sources.md:11 | gr-code (semántica: confinar las rutas derivadas de un argumento) / gr-ai (semántica: no leer fuera del directorio de trabajo) / SEC-071 | La forma «Ruta» de `<epica>` fija `EPIC_DIR` en el directorio que se recibe, sin resolverlo ni confinarlo a `REPO_ROOT`. Esto contradice la restricción de la línea 9 («toda búsqueda de épicas se restringe al patrón `specs/flow/EPIC-*/epic.md`»). Una ruta como `../otro-repo/EPIC-01-x` lleva a leer el frontmatter de un `epic.md` ajeno y a escribir `epic-validate-report.md` fuera del repositorio. El argumento lo controla quien invoca y el patrón ya existía en `epic-analyze`, así que el impacto es bajo. | Añadir a §1.1: «resolver la ruta y exigir que quede bajo `REPO_ROOT/specs/flow/EPIC-*/`; si no, `❌ No se encontró la épica <arg>` y fin sin escribir». Conviene alinear `epic-analyze` y `epic-track-progress`. |
| LOW | skills/epic-validate/SKILL.md:119 | gr-ai `ai-untrusted-content-clause` (semántica: el contenido ingerido es dato) / SEC-051 | La cláusula promete que copiar los valores en código en línea (`` `…` ``) evita que `[[…]]` o `<!-- -->` alteren el reporte. Pero un valor que contenga una comilla invertida puede cerrar el código en línea y dejar Markdown activo en `epic-validate-report.md`; ese valor puede ser el nombre de una línea F1 del índice, o `status` / `substatus` / `verdict` del frontmatter. El reporte lo leen después humanos y otros skills. | Indicar que el delimitador del código en línea sea más largo que la secuencia de comillas invertidas más larga del valor, o que esas comillas se escapen. Es la misma regla que el skill ya aplica a la valla de `output` en la línea 126. |

---

### Nota de Tamaño de Cambio

ℹ️ Nota informativa: tamaño de cambio aceptable (10 archivos modificados) — sin acción requerida.

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Siguiente acción

Ejecuta `/story-verify STORY-124`. Quedan pendientes de ejecución manual (criterio humano, AGENTS.md) `npm run test:eval -- epic-validate` y los recorridos SMOKE-2 y SMOKE-3 registrados en `implement-report.md`. Los hallazgos LOW pueden agruparse en una historia de mantenimiento de `epic-validate`.

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|---|---|---|---|
| 1 | Se cumple [[dod-story-implement]] | ⚠️ | — | `implement-report.md`: 18/24 ✓, 6 ⚠️, 0 ❌; los ⚠️ requieren ejecución manual de evals/CI o revisión semántica de checklists (los revisores de seguridad y calidad no encontraron incumplimientos) |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Tech-Lead e Integration: kebab-case, documentos en español, marcador `SDDF-FIXED-LAYOUT: v1`, un solo nivel de delegación |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner: AC-1 (TC-001, TC-003, TC-023), AC-2 (TC-002, TC-024, TC-003, TC-018), AC-3 (TC-005), AC-4 (TC-004), con instrucciones en SKILL.md |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration: los 7 componentes en sus rutas, interfaces D-7/D-9/D-10, EST-01/EST-02, G-05; `verify:layout`, `verify:validation-contract`, `verify:eval-inventory` OK |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | Severidad máxima de los cuatro informes: LOW |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | 26/26 tareas `[x]` |
| 7 | Metadatos frontmatter de `story.md` completos y correctos con status y substatus actualizados | ✓ | — | `story.md` → `CODE-REVIEW/DONE` con `updated: 2026-10-31` al cerrar esta revisión |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este archivo |
| 9 | Revisión de código aprobada (`verdict: APPROVED` en `code-review-report.md`) | ✓ | — | `verdict: APPROVED` |

**Resumen:** 8/9 criterios ✓
