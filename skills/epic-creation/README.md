# epic-creation

> **Type:** skill · **Category:** orchestrator  
> **Location:** `skills/epic-creation/SKILL.md`  
> **Status:** stable

---

## What it does

Crea una especificación `epic.md` de forma interactiva, sección por sección, a partir del template de épica vigente. Permite iniciar una épica sin requerir un `project-plan.md` previo.

**Produces:**

- `$SPECS_BASE/specs/02-epics/EPIC-NN-nombre/epic.md`.
- Un resultado de validación de estructura para la épica creada.

**Does not do:**

- No genera las épicas ya planificadas en un `project-plan.md`.

---

## When to use

**Use it when:**

- Quieras definir una nueva épica desde cero mediante una entrevista guiada.
- Aún no exista un plan de proyecto del que extraer las épicas.
- El usuario mencione: `"epic-creation"`, `"crear épica"`, `"nueva épica"`.

**Do NOT use it when:**

- Las épicas ya estén definidas en un plan de proyecto → usa `[[epic-from-project-plan]]`.
- Solo necesites comprobar una épica existente → usa `[[epic-format-validation]]`.

---

## Installation

**Core (incluido en `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/epic-creation` y proporciona el nombre de la épica cuando el flujo lo solicite.
