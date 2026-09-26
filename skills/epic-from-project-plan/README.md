# epic-from-project-plan

> **Type:** skill · **Category:** orchestrator  
> **Location:** `skills/epic-from-project-plan/SKILL.md`  
> **Status:** stable

---

## What it does

Extrae las épicas planificadas en `project-plan.md` y materializa una especificación `epic.md` por cada una usando el template canónico. Si un directorio ya existe, pide confirmar si se sobrescribe su archivo o se omite.

**Produces:**

- Directorios `$SPECS_BASE/specs/02-epics/EPIC-NN-nombre/`.
- Un archivo `epic.md` por cada épica planificada, creado o sobrescrito solo tras la decisión correspondiente.

**Does not do:**

- No crea ni modifica el `project-plan.md` de origen.

---

## When to use

**Use it when:**

- Ya exista un `project-plan.md` con épicas que deban materializarse como specs.
- Quieras generar las épicas de un proyecto de forma repetible y trazable.
- El usuario mencione: `"epic-from-project-plan"`, `"generar épicas del plan"`, `"crear épicas planificadas"`.

**Do NOT use it when:**

- El proyecto aún necesita su backlog y plan de épicas → usa `[[project-planning]]`.
- Quieras crear una sola épica sin plan previo → usa `[[epic-creation]]`.

---

## Installation

**Core (incluido en `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/epic-from-project-plan` para materializar las épicas del proyecto activo.
