# project-story-mapping

> **Type:** skill · **Category:** orchestrator  
> **Location:** `skills/project-story-mapping/SKILL.md`  
> **Status:** stable

---

## What it does

Conduce una sesión de User Story Mapping mediante el agente especializado y añade el frontmatter canónico al resultado. Organiza requisitos en backbone, walking skeleton y slices de épicas para apoyar decisiones de MVP.

**Produces:**

- `$SPECS_BASE/specs/01-projects/PROJ-DIR/story-map.md`.
- Frontmatter YAML de trazabilidad en el mapa generado.

**Does not do:**

- No reemplaza el plan de proyecto ni crea tareas de implementación.

---

## When to use

**Use it when:**

- Necesites organizar requisitos en incrementos entregables o definir el MVP.
- Quieras facilitar el paso de requisitos a planificación con un walking skeleton.
- The user mentions: `"project-story-mapping"`, `"story mapping"`, `"walking skeleton"`.

**Do NOT use it when:**

- Debas construir el backlog y las épicas formales → use `[[project-planning]]` instead.
- Necesites descomponer tareas técnicas de una historia → use `[[story-tasking]]` instead.

---

## Installation

**Core (included in `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/project-story-mapping` para el proyecto activo.
