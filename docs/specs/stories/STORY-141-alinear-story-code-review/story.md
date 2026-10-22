---
alwaysApply: false
type: story
id: STORY-141
kind: feat
slug: STORY-141-alinear-story-code-review
title: "Alinear story-code-review"
status: COMPLETED
substatus: DONE
parent: EPIC-25-unificar-contrato-de-validaciones-en-skills
created: 2026-10-17
updated: 2026-10-18
related:
  - EPIC-25-unificar-contrato-de-validaciones-en-skills
  - STORY-138
---
[[EPIC-25-unificar-contrato-de-validaciones-en-skills]]

# 📖 Historia: Alinear story-code-review

**Como** mantenedor de Agile-SDDF que automatiza el ciclo implementar → revisar → corregir  
**Quiero** que el reporte de code review declare `verdict` y una sección `## Veredicto` al inicio, con `APPROVED`, `NEEDS-CHANGES` o `BLOCKED`  
**Para** que `story-implement-tasks` y CI decidan si corregir, reintentar la revisión o avanzar sin depender del campo `review-status`

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

### AC-3 — Escenario alternativo — Revisión bloqueada por un revisor sin completar
```gherkin
Dado una historia implementada en IMPLEMENT/DONE
  Y uno de los cuatro subagentes revisores no completa su revisión
  Y los revisores que sí la completaron no reportan ningún hallazgo bloqueante
Cuando el mantenedor ejecuta /story-code-review sobre la historia
Entonces code-review-report.md declara "verdict: BLOCKED" y "## Veredicto" nombra al revisor que no completó su revisión
  Y story.md permanece en IMPLEMENT/DONE para volver a ejecutar /story-code-review una vez despejado el bloqueo
  Y no se genera fix-directives.md
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Sin cambio de criterio:** las reglas de severidad (`$MAX_SEVERITY`) y la regla que decide si un hallazgo es bloqueante no cambian. Única excepción: el fail-safe del Paso 4a deja de asumir `HIGH` para un informe de revisor ausente o con frontmatter inválido, y ese caso produce `BLOCKED` (AC-3).

## Fuera de alcance (Non-Goals)

- Cambiar los cuatro subagentes revisores o sus dimensiones.
- Reescribir los `code-review-report.md` históricos de `docs/specs/stories/`.

## 📎 Notas / contexto adicional

- **Estado actual:** `skills/story-code-review/assets/code-review-report-template.md` declara `review-status: {{REVIEW_STATUS}}`, con los valores `approved` / `needs-changes` (SKILL.md, línea 392), y pone la decisión al final en `## Decisión final`. `fix-directives-template.md` fija `review-status: needs-changes` y su ciclo menciona `approved`.
- **Consumidores que hay que actualizar:** `skills/story-implement-tasks/SKILL.md` lee `review-status`. Revisar también los evals de los dos skills.
- **Vocabulario:** `NEEDS-CHANGES` es el valor canónico de los gates de planificación, ejecución y QA, no un alias de `NEEDS-REFINEMENT`. En `docs/architecture/diagrams/flowchart-story-excecution-qa.mermaid`, `NEEDS-CHANGES` vuelve a `story-implement` / `story-implement-tasks`, que es el ciclo de `fix-directives.md` que ya existe. `BLOCKED` vuelve al propio `story-code-review`: el flujo se detiene y, despejado el bloqueo, se vuelve a ejecutar la revisión.
- **Decisión del PO (2026-10-18):** `story-code-review` emite `BLOCKED` cuando al menos uno de los cuatro subagentes revisores no completa su revisión (su informe en `.tmp/story-code-review/` falta o tiene frontmatter inválido). Hoy el Paso 4a aplica un fail-safe que asume `max-severity: HIGH` para ese revisor, y el resultado es `needs-changes`; ese fail-safe se reemplaza por `BLOCKED`, porque una revisión incompleta es un bloqueo del proceso y no un defecto del código. Si además los revisores que terminaron reportan algún hallazgo bloqueante, gana `NEEDS-CHANGES` (regla de precedencia de la política, STORY-138) y se genera `fix-directives.md` como en AC-2.
- **Dependencias:** depende de STORY-138. Puede ejecutarse en paralelo con STORY-139, STORY-140, STORY-142, STORY-144 y STORY-145.
- Cubre el criterio de salida de EPIC-25: **CS-7** — `story-code-review` produce un veredicto explícito `APPROVED` | `NEEDS-CHANGES` | `BLOCKED`. Contribuye además a `## Veredicto` como primera sección, a `verdict` en el frontmatter y a que no quede ninguna variante `approved` ni `review-status`.
