# project-discovery

> **Type:** skill · **Category:** orchestrator  
> **Location:** `skills/project-discovery/SKILL.md`  
> **Status:** stable

---

## What it does

Orquesta las fases de discovery y especificación de requisitos de ProjectSpecFactory con agentes especializados. Parte de `project-intent.md`, aplica el template del proyecto y consolida la especificación antes de que se inicie la planificación.

**Produces:**

- `$SPECS_BASE/specs/01-projects/PROJ-DIR/project.md`.
- El documento de proyecto con los requisitos y el estado resultante de la fase discovery.

**Does not do:**

- No crea la intención inicial ni el plan de backlog del proyecto.

---

## When to use

**Use it when:**

- Ya exista `project-intent.md` y necesites transformar la intención en requisitos especificados.
- Quieras ejecutar discovery con los agentes `project-pm` y `project-architect`.
- The user mentions: `"project-discovery"`, `"discovery del proyecto"`, `"especificación de requisitos"`.

**Do NOT use it when:**

- Falte capturar la intención inicial del proyecto → use `[[project-begin]]` instead.
- La especificación esté lista y necesites planificar el backlog → use `[[project-planning]]` instead.

---

## Installation

**Core (included in `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/project-discovery` para el proyecto activo cuya intención esté terminada.
