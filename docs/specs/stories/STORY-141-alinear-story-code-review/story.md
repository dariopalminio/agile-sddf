---
alwaysApply: false
type: story
id: STORY-141
kind: feat
slug: STORY-141-alinear-story-code-review
title: "Alinear story-code-review"
status: SPECIFY
substatus: DONE
parent: EPIC-25-unificar-contrato-de-validaciones-en-skills
created: 2026-10-17
updated: 2026-10-17
related:
  - EPIC-25-unificar-contrato-de-validaciones-en-skills
  - STORY-138
---
[[EPIC-25-unificar-contrato-de-validaciones-en-skills]]

# 📖 Historia: Alinear story-code-review

**Como** mantenedor de Agile-SDDF que automatiza el ciclo implementar → revisar → corregir  
**Quiero** que el reporte de code review declare `verdict` y una sección `## Veredicto` al inicio, con `APPROVED` o `NEEDS-CHANGES`  
**Para** que `story-implement-tasks` y CI decidan si corregir o avanzar sin depender del campo `review-status`

## ✅ Criterios de aceptación

### AC-1 — Escenario principal — Veredicto canónico según los hallazgos
```gherkin
Esquema del escenario: Veredicto canónico según los hallazgos
  Dado una historia implementada cuya revisión tiene <hallazgos>
  Cuando el mantenedor ejecuta /story-code-review sobre la historia
  Entonces code-review-report.md tiene "## Veredicto" como primera sección tras el título con el valor <verdict>
    Y el frontmatter declara "verdict: <verdict>"
Ejemplos:
  | hallazgos                  | verdict       |
  | ningún hallazgo bloqueante | APPROVED      |
  | al menos uno bloqueante    | NEEDS-CHANGES |
```

### AC-2 — Escenario alternativo — Ciclo de corrección con el nuevo veredicto
```gherkin
Dado una revisión con verdict NEEDS-CHANGES
Cuando se genera fix-directives.md y story-implement-tasks lo lee
Entonces la corrección se aplica igual que con el antiguo needs-changes
  Pero ni code-review-report.md ni fix-directives.md contienen el campo review-status ni el valor approved
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Sin cambio de criterio:** las reglas de severidad (`$MAX_SEVERITY`) y la regla que decide si un hallazgo es bloqueante no cambian.

## Fuera de alcance (Non-Goals)

- Cambiar los cuatro subagentes revisores o sus dimensiones.
- Reescribir los `code-review-report.md` históricos de `docs/specs/stories/`.

## 📎 Notas / contexto adicional

- **Estado actual:** `skills/story-code-review/assets/code-review-report-template.md` declara `review-status: {{REVIEW_STATUS}}`, con los valores `approved` / `needs-changes` (SKILL.md, línea 392), y pone la decisión al final en `## Decisión final`. `fix-directives-template.md` fija `review-status: needs-changes` y su ciclo menciona `approved`.
- **Consumidores que hay que actualizar:** `skills/story-implement-tasks/SKILL.md` lee `review-status`. Revisar también los evals de los dos skills.
- **Vocabulario:** `NEEDS-CHANGES` es el valor canónico de los gates de planificación, ejecución y QA, no un alias de `NEEDS-REFINEMENT`. En `docs/architecture/diagrams/flowchart-story-excecution-qa.mermaid`, `NEEDS-CHANGES` vuelve a `story-implement` / `story-implement-tasks`, que es el ciclo de `fix-directives.md` que ya existe.
- **Dependencias:** depende de STORY-138. Puede ejecutarse en paralelo con STORY-139, STORY-140, STORY-142, STORY-144 y STORY-145.
- Cubre el criterio de salida de EPIC-25: **CS-7** — `story-code-review` produce un veredicto explícito `APPROVED` | `NEEDS-CHANGES`. Contribuye además a `## Veredicto` como primera sección, a `verdict` en el frontmatter y a que no quede ninguna variante `approved` ni `review-status`.
