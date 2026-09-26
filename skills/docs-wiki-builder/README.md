# docs-wiki-builder

> **Type:** skill · **Category:** utility  
> **Location:** `skills/docs-wiki-builder/SKILL.md`  
> **Status:** stable (deprecado desde 3.3.0; se elimina en 4.0.0)

---

## What it does

Redirige el comando histórico `docs-wiki-builder` a `memory-system index` para regenerar `docs/index.md` con wikilinks. Se conserva únicamente para mantener compatibilidad con invocaciones anteriores.

**Produces:**

- La delegación a `/memory-system index`.
- Un `docs/index.md` regenerado por `memory-system`, cuando corresponde.

**Does not do:**

- No mantiene una implementación propia del índice ni debe elegirse para trabajo nuevo.

---

## When to use

**Use it when:**

- Necesites mantener una automatización existente que aún invoque el nombre anterior.
- El usuario mencione: `"docs-wiki-builder"`, `"wiki de docs"`, `"índice de documentación"` con el nombre legado.

**Do NOT use it when:**

- Quieras generar o actualizar un índice nuevo → usa `[[memory-system]]` con `index`.
- Necesites estandarizar el frontmatter de specs → usa `[[header-aggregation]]`.

---

## Installation

**Core (incluido en `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/docs-wiki-builder`; para trabajo nuevo, invoca directamente `/memory-system index`.
