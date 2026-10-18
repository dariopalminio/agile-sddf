# story-evaluation

> **Type:** skill · **Category:** guardrail  
> **Location:** `skills/story-evaluation/SKILL.md`  
> **Status:** stable

---

## What it does

Evalúa una historia con la rúbrica FINVEST (Formato + INVEST), asigna puntuaciones Likert por dimensión y emite un veredicto `APPROVED`, `NEEDS-REFINEMENT` o `SPLIT` con recomendaciones accionables.

**Produces:**

- Un informe de evaluación con puntuaciones, `## Veredicto`, `verdict` y recomendaciones.
- `<directorio-historia>/finvest-evaluation-report.md` cuando el input identifica una historia o ruta existente.
- La actualización de `story.md` a `SPECIFY/DONE` cuando corresponde un veredicto `APPROVED` sobre un archivo.

**Does not do:**

- No reescribe la historia ni genera artefactos de diseño, tareas o implementación.

---

## When to use

**Use it when:**

- Necesites evaluar la calidad y el tamaño de una historia antes de planificarla.
- Quieras decidir si la historia debe aprobarse, refinarse o dividirse.
- The user mentions: `"story-evaluation"`, `"FINVEST"`, `"evaluar historia"`.

**Do NOT use it when:**

- Debas aplicar las recomendaciones de un reporte existente → use `[[story-improve]]` instead.
- El veredicto sea dividir una historia grande → use `[[story-split]]` instead.

---

## Installation

**Core (included in `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/story-evaluation <texto, STORY-NNN o ruta>`.
