# story-tasking

> **Type:** skill · **Category:** worker  
> **Location:** `skills/story-tasking/SKILL.md`  
> **Status:** stable

---

## What it does

Descompone una historia y su diseño técnico en tareas atómicas, ordenadas por dependencias y trazables a criterios de aceptación. Señala las tareas que pueden ejecutarse en paralelo y conserva la estructura del template de tareas.

**Produces:**

- `<directorio-historia>/tasks.md`, o la ruta indicada mediante `--output`.
- Una secuencia de tareas con IDs, dependencias y referencias a los criterios cubiertos.

**Does not do:**

- No modifica `story.md`, no genera diseño y no ejecuta las tareas.

---

## When to use

**Use it when:**

- Ya existan `story.md` y `design.md` y necesites preparar pasos ejecutables antes de codificar.
- Quieras identificar dependencias y oportunidades de paralelización en la implementación.
- The user mentions: `"story-tasking"`, `"tareas de la historia"`, `"plan de implementación"`.

**Do NOT use it when:**

- Falte el diseño técnico de la historia → use `[[story-design]]` instead.
- Necesites derivar casos de prueba en lugar de tareas → use `[[story-testcases]]` instead.

---

## Installation

**Core (included in `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/story-tasking STORY-NNN`; usa `--output <ruta>` solo si necesitas otra ruta de salida.
