# project-flow

> **Type:** skill · **Category:** orchestrator  
> **Location:** `skills/project-flow/SKILL.md`  
> **Status:** stable

---

## What it does

Orquesta el pipeline completo de ProjectSpecFactory en una sola sesión: begin, discovery y planning. Detecta el punto de reanudación, aplica gates de revisión entre fases y solo avanza cuando cada documento queda listo.

**Produces:**

- `project-intent.md`, `project.md` y `project-plan.md` en el proyecto activo.
- Las transiciones de `substatus` asociadas a los gates de cada fase.

**Does not do:**

- No sustituye el trabajo de implementación ni crea código de producto.

---

## When to use

**Use it when:**

- Quieras completar o retomar de extremo a extremo la especificación de un proyecto.
- Necesites que las fases de intención, discovery y planificación mantengan sus gates de revisión.
- The user mentions: `"project-flow"`, `"pipeline completo"`, `"ProjectSpecFactory"`.

**Do NOT use it when:**

- Solo debas ejecutar una fase aislada → use `[[project-begin]]`, `[[project-discovery]]` o `[[project-planning]]` instead.
- Quieras planificar una historia individual → use `[[story-plan]]` instead.

---

## Installation

**Core (included in `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/project-flow`; el skill detecta la primera fase pendiente o retoma la que esté en progreso.
