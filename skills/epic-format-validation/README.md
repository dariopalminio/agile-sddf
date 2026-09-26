# epic-format-validation

> **Type:** skill · **Category:** utility  
> **Location:** `skills/epic-format-validation/SKILL.md`  
> **Status:** stable

---

## What it does

Valida que una especificación de épica cumple el contrato estructural del template `epic-template.md`, incluidos el frontmatter y las secciones obligatorias. Informa una decisión `APROBADO`, `REFINAR` o `RECHAZADO` con los elementos faltantes.

**Produces:**

- Un diagnóstico de validez de la épica solicitada.
- Una lista de campos o secciones faltantes cuando la decisión es `REFINAR`.

**Does not do:**

- No crea ni modifica el archivo `epic.md` validado.

---

## When to use

**Use it when:**

- Necesites comprobar una épica antes de seguir con la generación de historias.
- Quieras conocer exactamente qué parte del template falta en una épica.
- El usuario mencione: `"epic-format-validation"`, `"validar épica"`, `"estructura de épica"`.

**Do NOT use it when:**

- Debas redactar una épica nueva → usa `[[epic-creation]]`.
- Debas generar las épicas a partir de un plan → usa `[[epic-from-project-plan]]`.

---

## Installation

**Core (incluido en `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/epic-format-validation <ruta-o-nombre-de-épica>`.
