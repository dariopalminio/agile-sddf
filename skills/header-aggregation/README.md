# header-aggregation

> **Type:** skill · **Category:** utility  
> **Location:** `skills/header-aggregation/SKILL.md`  
> **Status:** stable

---

## What it does

Añade o actualiza el frontmatter YAML canónico de archivos Markdown de especificación, individualmente o en lote. Deriva metadatos de trazabilidad y valida referencias cruzadas para preparar los documentos para el patrón LLM Wiki.

**Produces:**

- Frontmatter YAML estandarizado en los archivos Markdown seleccionados.
- Un resumen de archivos procesados, actualizados, omitidos y de referencias verificadas.

**Does not do:**

- No genera ni regenera el índice wiki del repositorio.

---

## When to use

**Use it when:**

- Necesites estandarizar `slug`, `type`, `status` u otros metadatos de specs.
- Quieras preparar un conjunto de documentos para ser indexado por el sistema de memoria.
- El usuario mencione: `"header-aggregation"`, `"frontmatter"`, `"añadir frontmatter"`.

**Do NOT use it when:**

- Debas construir o actualizar el índice de documentación → usa `[[memory-system]]` con `index`.
- Quieras crear el contenido de una historia o una épica → usa `[[story-creation]]` o `[[epic-creation]]`.

---

## Installation

**Core (incluido en `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/header-aggregation <archivo-o-directorio>` y selecciona el modo individual o batch según el input.
