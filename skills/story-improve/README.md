# story-improve

> **Type:** skill · **Category:** worker  
> **Location:** `skills/story-improve/SKILL.md`  
> **Status:** stable (deprecado desde 4.2.0; se elimina en 5.0.0)

---

## What it does

Conserva la invocación histórica `/story-improve` y delega en `/story-refine` con
los mismos argumentos. Muestra un aviso de deprecación antes de delegar.

**Produces:** la salida de `story-refine`, incluidos sus artefactos cuando corresponda.

## When to use

Solo para automatizaciones que aún invoquen `/story-improve`. Para trabajo nuevo,
usa `[[story-refine]]` directamente.

## Installation

El alias se incluye en `agile-sddf` durante la ventana de compatibilidad.

### Invocation

`/story-improve --story-id STORY-NNN` delega en `/story-refine --story-id STORY-NNN`.
