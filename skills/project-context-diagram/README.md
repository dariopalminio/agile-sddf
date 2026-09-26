# project-context-diagram

> **Type:** skill · **Category:** worker  
> **Location:** `skills/project-context-diagram/SKILL.md`  
> **Status:** stable

---

## What it does

Genera un diagrama de contexto C4 de nivel 1 en PlantUML para el proyecto activo. Puede recopilar la información en una entrevista o inferirla desde archivos, y solicita confirmación antes de escribir el resultado.

**Produces:**

- `$SPECS_BASE/specs/01-projects/PROJ-slug/context-diagram.puml`.
- Un preview del diagrama antes de guardarlo en modo interactivo.

**Does not do:**

- No genera diagramas de componentes ni reemplaza la especificación de requisitos.

---

## When to use

**Use it when:**

- Necesites comunicar el alcance, actores y sistemas externos de un proyecto.
- Quieras documentar la arquitectura de contexto con C4 y PlantUML.
- The user mentions: `"project-context-diagram"`, `"diagrama de contexto"`, `"C4 context"`.

**Do NOT use it when:**

- Debas descubrir o especificar requisitos del proyecto → use `[[project-discovery]]` instead.
- Necesites un diseño técnico de una historia concreta → use `[[story-design]]` instead.

---

## Installation

**Core (included in `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/project-context-diagram` o `/project-context-diagram --from-files`.
