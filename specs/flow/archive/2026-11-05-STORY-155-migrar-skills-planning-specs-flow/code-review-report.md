---
type: code-review-report
story: STORY-155
title: "Code Review Report: Migrar los skills de planning a specs/flow"
verdict: APPROVED
date: 2026-10-23
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-155

## Veredicto

**Veredicto:** `APPROVED` — Sin hallazgos bloqueantes (severidad máxima: LOW).

Los cuatro revisores entregaron informes válidos con `status: approved`. Los 10 hallazgos son LOW: mejoras de ejemplos, evals y documentación, algunas de ellas ya existían antes de la historia. Los criterios DoD CODE-REVIEW no tienen ningún ❌.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-155 — Migrar los skills de planning a specs/flow |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-10-23 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/story-analyze/examples/output/analyze.md:91 | El ejemplo usa el glob `specs/flow/EPIC-10-data-management*/` (sin guion), que no coincide con ninguna de las dos reglas de D-4 de `SKILL.md:311-312` (`{parent}/` o `{parent}-*/`). La línea 110 del mismo ejemplo sí usa `specs/flow/EPIC-10-data-management/` (regla 1). El ejemplo queda internamente inconsistente y contradice la nota de que el guion evita que `EPIC-1` coincida con `EPIC-12-…`. | Cambiar a `specs/flow/EPIC-10-data-management/` (o `…-*/`) para que el ejemplo siga la resolución que documenta el skill. |
| LOW | skills/story-analyze/evals/evals.json:196 | La aserción positiva de TC-007, `"Alineación con la épica EPIC-10-data-management"`, aparece en el reporte se encuentre o no la épica (la fila del resumen siempre se emite; ver `examples/output/analyze.md:31`, donde no se encuentra). La única aserción que distingue los dos casos es `not_contains: "No se encontró epic.md"`, y depende de que el aviso salga en stdout. | Agregar a `contains` una cadena que solo aparezca cuando la épica se resuelve, por ejemplo un fragmento del objetivo del fixture (`exportar y gestionar sus datos`). |
| LOW | skills/story-design/assets/README.md:6, skills/story-tasking/assets/README.md:6, skills/story-analyze/assets/README.md:6 | Las líneas reescritas ahora dicen que el template canónico está en `docs/templates/{design,tasks,analyze-report}-template.md`, pero esos archivos no existen en `docs/templates/`. Además los `SKILL.md` leen el template desde `assets/` (story-design 1c, story-tasking l. 163-228). El error ya existía con `$SPECS_BASE/templates/`, pero la migración lo vuelve a afirmar como ruta concreta, lo que choca con la regla de Veracidad de AGENTS.md. | Fuera del mapa D-2 de esta historia. Registrar un seguimiento para corregir los `assets/README.md` y que describan la resolución real (`assets/` y fallback interno), o crear los templates en `docs/templates/`. |
| LOW | skills/story-design/examples/output/design.md:162, 196, 204 | El ejemplo cambió la l. 148 (`REPO_ROOT` resuelto) pero sigue diciendo que `skill-preflight` corre como Paso 0 y detiene la ejecución si falla. Eso contradice el `SKILL.md` migrado («este workflow no lo invoca en su hot path»). La desviación está documentada en implement-report.md. | Opcional: en una historia posterior, ajustar el ejemplo para que no presente `skill-preflight` como paso automático. |
| LOW | skills/story-design/SKILL.md:71, skills/story-analyze/SKILL.md:94, skills/story-fix-plan/SKILL.md:58, skills/story-plan/SKILL.md:91 | La precondición «La raíz de artefactos debe resolverse mediante el contrato local antes de continuar» viene del modelo configurable. Con el layout fijo solo se resuelve `REPO_ROOT`. Se mantiene igual que en los skills ya migrados en STORY-150/151 (story-creation, story-refine, story-split, story-specify, sddf-constitution), así que el conjunto es consistente. | Opcional: reformular la frase en todos los skills a la vez (por ejemplo en STORY-157) como «`REPO_ROOT` debe resolverse (Paso 0) antes de continuar». |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/story-design/evals/evals.json:0, skills/story-tasking/evals/evals.json:0, skills/story-testcases/evals/evals.json:0, skills/story-plan/evals/evals.json:0 | El `Entonces` de AC-1 («`<artefacto>` se escribe en `specs/flow/STORY-NNN-<slug>/`») no tiene ningún eval *happy-path* que lo afirme en las filas design, tasking, testcases y plan. Esos evals usan `input_path: examples/input` sin `context` que ubique la historia en `specs/flow/`. Esas filas solo las cubren el texto del `SKILL.md` y el gate estático `verify:layout`. Solo analyze (TC-007) y fix-plan (sus `context`) fijan la historia en `specs/flow/`. | Añadir al menos un eval *happy-path* en `story-plan`, que cubre las cuatro filas por delegación. Su `context` debe ubicar la historia en `specs/flow/STORY-NNN-<slug>/` y debe afirmar la ruta de salida. Así se ejercita de forma observable el escenario principal. |
| LOW | skills/story-tasking/evals/evals.json:70 | La aserción de TC-003 se aflojó de `"No se encontro"` a `"No se encontr"`: tolera la tilde, pero sigue sin afirmar `specs/flow/`. Lo mismo pasa con `story-design` TC-002 y `story-testcases` TC-003. El mensaje común de AC-2 solo se exige con su ruta en `story-plan` TC-002. | Opcional: añadir `"specs/flow/"` a `contains` en los evals *fail-fast* de los sub-skills, para que el mensaje común quede fijado en todos. |

---

### Integración y Arquitectura (Integration-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | docs/specs/stories/STORY-155-migrar-skills-planning-specs-flow/design.md:282 | El contrato #2 (`grep -rnE "docs/specs\|…"` → sin salida) contradice D-8, que exige `not_contains: "docs/specs"` en `skills/story-plan/evals/evals.json:71` y `skills/story-analyze/evals/evals.json:200`. La implementación sigue bien D-8, pero el contrato #2 no puede cumplirse literalmente. `implement-report.md` ya documenta la excepción. | No hace falta cambiar código. Si se reutiliza el contrato, excluir las aserciones negativas (`not_contains`) o anotar la excepción en `design.md`. |
| LOW | skills/story-analyze/examples/output/analyze.md:91 | El ejemplo cita `specs/flow/EPIC-10-data-management*/`, un glob sin guion que no corresponde a ninguna de las dos reglas de D-4. La línea 110 del mismo ejemplo sí usa la forma exacta `specs/flow/EPIC-10-data-management/`. No tiene impacto funcional, pero puede inducir al LLM a usar el patrón antiguo. | Cambiar a `specs/flow/EPIC-10-data-management/` (regla 1 de D-4) para alinearlo con la línea 110. |
| LOW | skills/story-design/assets/README.md:6 | El README declara como template canónico `docs/templates/design-template.md`, pero el Paso 1c de `skills/story-design/SKILL.md:150-154` solo resuelve `--template` → `assets/design-template.md` → fallback interno y nunca consulta `docs/templates/`. La incoherencia ya existía con `$SPECS_BASE/templates/`: la migración solo cambió el prefijo. Lo mismo pasa en `skills/story-tasking/assets/README.md:6`. Queda fuera de alcance (Non-Goals: no cambiar templates ni la lógica). | Registrarlo como deuda para una historia posterior: alinear el README con la resolución real o añadir `docs/templates/` a la cadena de resolución. |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-code-security-checklist.md, docs/guardrails/gr-ai-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md (41 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| — | — | — | Sin hallazgos de seguridad | — |

---

### Nota de Tamaño de Cambio

⚠️ Nota informativa: tamaño de cambio elevado (23 archivos modificados). Considera ejecutar /story-split antes de futuras historias similares para reducir el alcance. Esta nota es informativa y no afecta la decisión de este review.

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Siguiente acción

Ejecuta `/story-verify STORY-155`. Pendiente a criterio humano: `npm run test:eval -- story-plan` y `npm run test:eval -- story-analyze` (CNF-1). Los hallazgos LOW pueden registrarse como deuda, por ejemplo para STORY-157 o STORY-154. No reinstales las copias de runtime antes de STORY-153 (advertencia de dogfooding de `implement-report.md`).

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Se cumple [[dod-story-implement]] | ⚠️ | — | `implement-report.md`: 21/24 ✓, 3 ⚠️, 0 ❌. Los ⚠️ corresponden a la ejecución real de evals y requieren acceso a CI/CD o a ejecutar tests, así que no son evaluables desde los artefactos disponibles. |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Tech-Lead e Integration: Markdown en español y bloque canónico idéntico al de STORY-150/151. Sin dependencias ni secretos nuevos. |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner: AC-1 (6 filas), AC-2 y AC-3 están cubiertos en los `SKILL.md`, evals y gates. |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration: D-1…D-8 y los contratos #1, #3–#11 conformes. El alcance coincide con «Componentes afectados». |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | Severidad máxima entre los cuatro informes: LOW. |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | `tasks.md`: 26 `[x]`, 0 `[ ]`. |
| 7 | Metadatos frontmatter de `story.md` están completos y correctos con status y substatus actualizados | ✓ | — | Frontmatter completo, con transición a `CODE-REVIEW/DONE` en esta revisión. |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este archivo. |
| 9 | Revisión de código aprobada (`verdict: APPROVED` en `code-review-report.md`) | ✓ | — | `verdict: APPROVED`. |

**Resumen:** 8/9 criterios ✓ (1 ⚠️, 0 ❌)
