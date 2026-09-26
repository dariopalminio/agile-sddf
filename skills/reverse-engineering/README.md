# reverse-engineering

> **Type:** skill · **Category:** orchestrator  
> **Location:** `skills/reverse-engineering/SKILL.md`  
> **Status:** stable

---

## What it does

Genera `project.md` a partir de un código existente mediante cuatro análisis paralelos y una síntesis final. Puede limitar el análisis a una ruta, actualizar una especificación previa y mostrar información detallada de ejecución.

**Produces:**

- `$SPECS_BASE/specs/01-projects/PROJ-DIR/project.md`.
- Hallazgos temporales de arquitectura, features, reglas de negocio y navegación que alimentan la síntesis.

**Does not do:**

- No modifica el código fuente analizado ni sustituye una entrevista de intención para un proyecto nuevo.

---

## When to use

**Use it when:**

- Necesites documentar un codebase existente o extraer requisitos desde su implementación.
- Quieras actualizar una especificación basada en cambios reales del repositorio.
- The user mentions: `"reverse-engineering"`, `"documentar codebase"`, `"extraer requisitos del código"`.

**Do NOT use it when:**

- Vayas a iniciar un proyecto sin código preexistente → use `[[project-begin]]` instead.
- Necesites revisar la calidad de una implementación de historia → use `[[story-code-review]]` instead.

---

## Installation

**Core (included in `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/reverse-engineering`; admite `--focus <ruta>`, `--update` y `--verbose`.
