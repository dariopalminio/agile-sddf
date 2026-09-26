# story-creation

> **Type:** skill · **Category:** worker  
> **Location:** `skills/story-creation/SKILL.md`  
> **Status:** stable

---

## What it does

Convierte una necesidad, feature o texto de entrada en una historia de usuario con formato Como/Quiero/Para, escenarios Gherkin y criterios INVEST. Lee el template de historia en tiempo de ejecución y asigna el siguiente identificador disponible.

**Produces:**

- `$SPECS_BASE/specs/03-stories/STORY-NNN-slug/story.md`.
- Una historia inicial en la etapa `SPECIFY` con criterios de aceptación trazables.

**Does not do:**

- No evalúa FINVEST ni produce diseño técnico o tareas de implementación.

---

## When to use

**Use it when:**

- Necesites redactar una historia desde texto libre, una ruta de archivo o un término de búsqueda.
- Quieras transformar una feature en criterios de aceptación Gherkin.
- The user mentions: `"story-creation"`, `"crear historia"`, `"historia de usuario"`.

**Do NOT use it when:**

- Debas evaluar la calidad de una historia existente → use `[[story-evaluation]]` instead.
- Quieras generar historias a partir de una épica documentada → use `[[epic-generate-stories]]` instead.

---

## Installation

**Core (included in `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/story-creation <necesidad, ruta o término>`.
