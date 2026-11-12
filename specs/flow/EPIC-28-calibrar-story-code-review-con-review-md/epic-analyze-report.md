---
type: epic-analyze
id: EPIC-28
slug: EPIC-28-calibrar-story-code-review-con-review-md-analyze-report
title: "Epic analyze: Calibrar story-code-review con REVIEW.md"
epic: EPIC-28
verdict: NEEDS-REFINEMENT
errors: 6
warnings: 0
created: 2026-11-12
updated: 2026-11-12
related:
  - EPIC-28-calibrar-story-code-review-con-review-md
---
[[EPIC-28-calibrar-story-code-review-con-review-md]]

# Análisis de épica: Calibrar story-code-review con REVIEW.md

## Veredicto

**Veredicto:** `NEEDS-REFINEMENT` — 6 hallazgos ERROR
Informativo: este análisis no cambia el estado de la épica.

## Resumen

| Métrica | Valor |
|---|---|
| Épica | EPIC-28 (`specs/flow/EPIC-28-calibrar-story-code-review-con-review-md/epic.md`) |
| Hallazgos ERROR | 6 |
| Hallazgos WARNING | 0 |
| Contrato de salida | Contrato de salida: 6/12 cubiertos |
| Madurez de historias hijas | Madurez de historias hijas: 9/9 listas |
| Fecha | 2026-11-12 |
| Template de épica | `docs/templates/epic-template.md` |
| Template de reporte | `.opencode/skills/epic-analyze/assets/epic-analyze-report-template.md` (seed) |

## Índice de historias

| ID | Línea(s) en epic.md | En índice | story.md | parent | Estado |
|---|---|---|---|---|---|
| STORY-177 | 29 | sí | `specs/flow/STORY-177-corregir-rutas-story-code-review/story.md` | `EPIC-28-calibrar-story-code-review-con-review-md` | ✓ |
| STORY-178 | 30 | sí | `specs/flow/STORY-178-adr-guia-de-revision/story.md` | `EPIC-28-calibrar-story-code-review-con-review-md` | ✓ |
| STORY-179 | 31 | sí | `specs/flow/STORY-179-review-md-de-agile-sddf/story.md` | `EPIC-28-calibrar-story-code-review-con-review-md` | ✓ |
| STORY-180 | 32 | sí | `specs/flow/STORY-180-story-code-review-lee-review-md/story.md` | `EPIC-28-calibrar-story-code-review-con-review-md` | ✓ |
| STORY-181 | 33 | sí | `specs/flow/STORY-181-hallazgos-preexistentes/story.md` | `EPIC-28-calibrar-story-code-review-con-review-md` | ✓ |
| STORY-182 | 34 | sí | `specs/flow/STORY-182-verificar-y-deduplicar-hallazgos/story.md` | `EPIC-28-calibrar-story-code-review-con-review-md` | ✓ |
| STORY-183 | 35 | sí | `specs/flow/STORY-183-dod-code-review-sin-criterios-circulares/story.md` | `EPIC-28-calibrar-story-code-review-con-review-md` | ✓ |
| STORY-184 | 36 | sí | `specs/flow/STORY-184-review-md-semilla-para-proyectos-consumidores/story.md` | `EPIC-28-calibrar-story-code-review-con-review-md` | ✓ |
| STORY-185 | 37 | sí | `specs/flow/STORY-185-tope-de-low-y-arrastres/story.md` | `EPIC-28-calibrar-story-code-review-con-review-md` | ✓ |

## Cobertura del contrato de salida

| Elemento | Texto o nombre | Línea en epic.md | Cubierto por | Evidencia | Estado |
|---|---|---|---|---|---|
| CS-1 | `REVIEW.md existe en la raíz con las secciones qué es importante, tope de Minor, qué no reportar y qué verificar siempre, y un ADR nuevo, registrado en docs/adr/README.md, fija su ubicación, precedencia, fuente de lectura y vocabulario` | 41 | STORY-178 (parcial), STORY-179 (parcial) | STORY-178 › AC-1 · story.md:30 `Entonces existe "docs/adr/ADR-NNNN-<slug>.md" con estado "ACCEPTED" y todas las secciones de "docs/adr/adr-template.md"` (parcial) · STORY-179 › AC-1 · story.md:31 `Entonces "REVIEW.md" tiene esas cuatro secciones, en ese orden, sin placeholders "[...]" ni comentarios de la plantilla` (parcial) | SAL-01 |
| CS-2 | `story-code-review pasa REVIEW.md a los cuatro revisores y al árbitro; sin REVIEW.md emite una advertencia y el contrato de code-review-report.md (frontmatter, secciones y veredicto) no cambia` | 42 | STORY-180 (parcial) | STORY-180 › AC-1 · story.md:33 `Entonces el resumen "Contexto cargado" muestra la ruta de "REVIEW.md"` (parcial) · STORY-180 › AC-3 · story.md:51 `Entonces el skill muestra una advertencia de que no hay guía de revisión` (parcial) | SAL-01 |
| CS-3 | `grep -rE "Principio 6|teléfono descompuesto|un solo nivel de delegación" skills/story-code-review/agents/ no devuelve resultados` | 43 | STORY-180 | STORY-180 › AC-5 · story.md:68 `Entonces no devuelve resultados` | ✓ |
| CS-4 | `Un hallazgo PREEXISTENTE, o un HIGH/MEDIUM sin Archivo:Línea y escenario de fallo, no cambia el veredicto ni entra en fix-directives.md; un hallazgo repetido entre revisores aparece una sola vez, y ningún revisor supera el tope de LOW` | 44 | STORY-181 (parcial), STORY-182 (parcial), STORY-185 (parcial) | STORY-181 › AC-1 · story.md:33 `Entonces el defecto figura en "code-review-report.md" con la categoría PREEXISTENTE` (parcial) · STORY-182 › AC-1 · story.md:35 `Entonces el hallazgo figura en "code-review-report.md" como "<estado>"` (parcial) · STORY-182 › AC-2 · story.md:48 `Entonces "code-review-report.md" y "fix-directives.md" lo muestran una sola vez, como HIGH y citando a los dos revisores` (parcial) · STORY-185 › AC-1 · story.md:36 `Entonces el informe muestra como máximo <tope> LOW de ese revisor` (parcial) | SAL-01 |
| CS-5 | `dod-story-code-review.md y su plantilla en skills/sddf-constitution/assets/dod-story/ no contienen criterios que el orquestador satisface por sí mismo (informe creado, veredicto APPROVED, ausencia de bloqueantes), y los criterios cubiertos por un revisor toman su resultado en lugar de crear hallazgos nuevos, y memory-system check pasa` | 45 | STORY-183 (parcial) | STORY-183 › AC-1 · story.md:31 `Entonces ninguno se cumple por el solo hecho de generar "code-review-report.md"` (parcial) · STORY-183 › AC-2 · story.md:42 `Entonces el criterio del DoD que cubre ese defecto queda incumplido con el resultado del revisor` (parcial) | SAL-01 |
| CS-6 | `/sddf-constitution crea REVIEW.md desde una plantilla cuando no existe y no lo modifica si ya existe` | 46 | STORY-184 | STORY-184 › AC-3 · story.md:51 `Entonces la primera ejecución crea "REVIEW.md"` `Y la segunda no lo modifica` | ✓ |
| CS-7 | `Los cuatro informes parciales se escriben en .tmp/story-code-review/{story_id}/, y el Security-Reviewer descubre los checklists docs/guardrails/gr-*security* sin depender de los enlaces de constitution.md` | 47 | STORY-177 (parcial) | STORY-177 › AC-1 · story.md:30 `Entonces existen "tech-lead-report.md", "product-owner-report.md", "integration-report.md" y "security-report.md" en ".tmp/story-code-review/STORY-NNN/"` (parcial) · STORY-177 › AC-2 · story.md:39 `Entonces "security-report.md" cita "gr-code-security-checklist.md" como fuente de reglas` (parcial) | SAL-01 |
| CS-8 | `skills/story-code-review/evals/evals.json incluye casos de calibración (secreto falso en examples/, hallazgo preexistente, tope de LOW, REVIEW.md presente y ausente), y npm run verify:repository y npm test pasan sin errores` | 48 | — | — | SAL-01 |
| SMOKE-1 | `Revisión calibrada por REVIEW.md` | 52 | STORY-180 | mención · story.md:86 `- Cubre **CS-2** y **CS-3** de EPIC-28, y el escenario **SMOKE-1** y **SMOKE-3**.` | ✓ |
| SMOKE-2 | `Un defecto preexistente no bloquea` | 60 | STORY-181 | mención · story.md:71 `- Cubre la parte PREEXISTENTE de **CS-4** de EPIC-28 y el escenario **SMOKE-2**.` | ✓ |
| SMOKE-3 | `Proyecto consumidor sin REVIEW.md` | 68 | STORY-180 | mención · story.md:86 `- Cubre **CS-2** y **CS-3** de EPIC-28, y el escenario **SMOKE-1** y **SMOKE-3**.` | ✓ |
| SMOKE-4 | `REVIEW.md semilla` | 76 | STORY-184 | mención · story.md:69 `- Cubre **CS-6** de EPIC-28 y el escenario **SMOKE-4**.` | ✓ |

## Hallazgos

### H-001 [ERROR] — SAL-01: Criterio de salida sin evidencia que lo cubra

- **Elemento:** `REVIEW.md existe en la raíz con las secciones qué es importante, tope de Minor, qué no reportar y qué verificar siempre, y un ADR nuevo, registrado en docs/adr/README.md, fija su ubicación, precedencia, fuente de lectura y vocabulario`
- **Evidencia:** epic.md:41 · evidencia parcial: STORY-178 › AC-1 · story.md:30 `Entonces existe "docs/adr/ADR-NNNN-<slug>.md" con estado "ACCEPTED" y todas las secciones de "docs/adr/adr-template.md"` · STORY-179 › AC-1 · story.md:31 `Entonces "REVIEW.md" tiene esas cuatro secciones, en ese orden, sin placeholders "[...]" ni comentarios de la plantilla`
- **Acción sugerida:** Crear o ajustar una historia que lo verifique (si la cubrirá una historia planificada, generarla con `/epic-generate-stories`); si una historia ya lo cubre, citar el criterio en su `story.md`; o retirar el criterio si es obsoleto

### H-002 [ERROR] — SAL-01: Criterio de salida sin evidencia que lo cubra

- **Elemento:** `story-code-review pasa REVIEW.md a los cuatro revisores y al árbitro; sin REVIEW.md emite una advertencia y el contrato de code-review-report.md (frontmatter, secciones y veredicto) no cambia`
- **Evidencia:** epic.md:42 · evidencia parcial: STORY-180 › AC-1 · story.md:33 `Entonces el resumen "Contexto cargado" muestra la ruta de "REVIEW.md"` · STORY-180 › AC-3 · story.md:51 `Entonces el skill muestra una advertencia de que no hay guía de revisión`
- **Acción sugerida:** Crear o ajustar una historia que lo verifique (si la cubrirá una historia planificada, generarla con `/epic-generate-stories`); si una historia ya lo cubre, citar el criterio en su `story.md`; o retirar el criterio si es obsoleto

### H-003 [ERROR] — SAL-01: Criterio de salida sin evidencia que lo cubra

- **Elemento:** `Un hallazgo PREEXISTENTE, o un HIGH/MEDIUM sin Archivo:Línea y escenario de fallo, no cambia el veredicto ni entra en fix-directives.md; un hallazgo repetido entre revisores aparece una sola vez, y ningún revisor supera el tope de LOW`
- **Evidencia:** epic.md:44 · evidencia parcial: STORY-181 › AC-1 · story.md:33 `Entonces el defecto figura en "code-review-report.md" con la categoría PREEXISTENTE` · STORY-182 › AC-1 · story.md:35 `Entonces el hallazgo figura en "code-review-report.md" como "<estado>"` · STORY-182 › AC-2 · story.md:48 `Entonces "code-review-report.md" y "fix-directives.md" lo muestran una sola vez, como HIGH y citando a los dos revisores` · STORY-185 › AC-1 · story.md:36 `Entonces el informe muestra como máximo <tope> LOW de ese revisor`
- **Acción sugerida:** Crear o ajustar una historia que lo verifique (si la cubrirá una historia planificada, generarla con `/epic-generate-stories`); si una historia ya lo cubre, citar el criterio en su `story.md`; o retirar el criterio si es obsoleto

### H-004 [ERROR] — SAL-01: Criterio de salida sin evidencia que lo cubra

- **Elemento:** `dod-story-code-review.md y su plantilla en skills/sddf-constitution/assets/dod-story/ no contienen criterios que el orquestador satisface por sí mismo (informe creado, veredicto APPROVED, ausencia de bloqueantes), y los criterios cubiertos por un revisor toman su resultado en lugar de crear hallazgos nuevos, y memory-system check pasa`
- **Evidencia:** epic.md:45 · evidencia parcial: STORY-183 › AC-1 · story.md:31 `Entonces ninguno se cumple por el solo hecho de generar "code-review-report.md"` · STORY-183 › AC-2 · story.md:42 `Entonces el criterio del DoD que cubre ese defecto queda incumplido con el resultado del revisor`
- **Acción sugerida:** Crear o ajustar una historia que lo verifique (si la cubrirá una historia planificada, generarla con `/epic-generate-stories`); si una historia ya lo cubre, citar el criterio en su `story.md`; o retirar el criterio si es obsoleto

### H-005 [ERROR] — SAL-01: Criterio de salida sin evidencia que lo cubra

- **Elemento:** `Los cuatro informes parciales se escriben en .tmp/story-code-review/{story_id}/, y el Security-Reviewer descubre los checklists docs/guardrails/gr-*security* sin depender de los enlaces de constitution.md`
- **Evidencia:** epic.md:47 · evidencia parcial: STORY-177 › AC-1 · story.md:30 `Entonces existen "tech-lead-report.md", "product-owner-report.md", "integration-report.md" y "security-report.md" en ".tmp/story-code-review/STORY-NNN/"` · STORY-177 › AC-2 · story.md:39 `Entonces "security-report.md" cita "gr-code-security-checklist.md" como fuente de reglas`
- **Acción sugerida:** Crear o ajustar una historia que lo verifique (si la cubrirá una historia planificada, generarla con `/epic-generate-stories`); si una historia ya lo cubre, citar el criterio en su `story.md`; o retirar el criterio si es obsoleto

### H-006 [ERROR] — SAL-01: Criterio de salida sin evidencia que lo cubra

- **Elemento:** `skills/story-code-review/evals/evals.json incluye casos de calibración (secreto falso en examples/, hallazgo preexistente, tope de LOW, REVIEW.md presente y ausente), y npm run verify:repository y npm test pasan sin errores`
- **Evidencia:** epic.md:48
- **Acción sugerida:** Crear o ajustar una historia que lo verifique (si la cubrirá una historia planificada, generarla con `/epic-generate-stories`); si una historia ya lo cubre, citar el criterio en su `story.md`; o retirar el criterio si es obsoleto

## Notas del análisis

- ⚠️ Usando template seed del skill. Copia assets/epic-analyze-report-template.md a docs/templates/ para personalizarlo.
