# story-design

> **Type:** skill · **Category:** worker  
> **Location:** `skills/story-design/SKILL.md`  
> **Status:** stable

---

## What it does

Documenta el diseño técnico de una historia antes de implementar, conectando criterios de aceptación con componentes, interfaces, datos, flujos, decisiones y contratos de verificación. Comprueba inconsistencias que requieran volver a especificación.

**Produces:**

- `<directorio-historia>/design.md` a partir del template de diseño vigente.
- Un registro de inconsistencias de requisitos cuando corresponda.

**Does not do:**

- No crea tareas, casos de prueba ni código, y no actualiza el frontmatter de `story.md`.

---

## When to use

**Use it when:**

- La historia esté lista para PLAN y necesites definir su puente técnico hacia la implementación.
- Quieras documentar decisiones arquitectónicas y contratos verificables antes de codificar.
- The user mentions: `"story-design"`, `"diseño técnico"`, `"crear design.md"`.

**Do NOT use it when:**

- Debas descomponer el diseño en tareas → use `[[story-tasking]]` instead.
- Necesites implementar una historia ya planificada → use `[[story-implement]]` instead.

---

## Installation

**Core (included in `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/story-design STORY-NNN` antes de generar tareas y casos de prueba.
