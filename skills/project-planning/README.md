# project-planning

> **Type:** skill · **Category:** orchestrator  
> **Location:** `skills/project-planning/SKILL.md`  
> **Status:** stable

---

## What it does

Orquesta la generación del backlog y del plan de proyecto mediante `project-architect`, a partir de `project.md`. Puede incorporar un `story-map.md` existente como insumo opcional antes de crear el plan.

**Produces:**

- `$SPECS_BASE/specs/01-projects/PROJ-DIR/project-plan.md`.
- Un plan de proyecto con el backlog y las épicas derivadas de los requisitos.

**Does not do:**

- No inicia discovery ni materializa los directorios de épicas.

---

## When to use

**Use it when:**

- `project.md` esté terminado y necesites ordenar el trabajo en un backlog y plan.
- Quieras usar un story map existente para orientar la planificación.
- The user mentions: `"project-planning"`, `"planificación del proyecto"`, `"plan del proyecto"`.

**Do NOT use it when:**

- Falten los requisitos del proyecto → use `[[project-discovery]]` instead.
- Necesites crear las especificaciones de épica desde el plan → use `[[epic-from-project-plan]]` instead.

---

## Installation

**Core (included in `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/project-planning` para el proyecto activo con discovery completado.
