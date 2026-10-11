# project-flow

> **Type:** skill · **Category:** orchestrator  
> **Location:** `skills/project-flow/SKILL.md`  
> **Status:** stable

---

## What it does

Orquesta Begin, Discovery y Planning en una sesión. Detecta la primera etapa pendiente a partir de las capas y compone el skill propietario de cada una.

**Produces:**

- `product/vision.md` mediante `/project-begin`.
- `product/stakeholders.md` y `requirements/` mediante `/project-discovery`.
- `product/roadmap.md` mediante `/project-planning`.

Cada etapa conserva su propio gate de documento. Tras cerrarla, `project-flow` ofrece el gate de avance `Continuar con` o `Detener aquí`.

**Does not do:**

- No escribe directamente en las capas ni sustituye a los skills de etapa.
- No implementa historias ni crea código de producto.

---

## When to use

**Use it when:**

- Quieras completar o retomar de extremo a extremo la especificación de un proyecto.
- Necesites conservar gates entre la intención, discovery y planificación.
- The user mentions: `"project-flow"`, `"pipeline completo"`, `"ProjectSpecFactory"`.

**Do NOT use it when:**

- Solo debas ejecutar una fase aislada: usa `[[project-begin]]`, `[[project-discovery]]` o `[[project-planning]]`.
- Quieras planificar una historia individual: usa `[[story-plan]]`.

---

## Installation

**Core (included in `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/project-flow`; el skill detecta la primera etapa pendiente o retoma la que esté en progreso.
