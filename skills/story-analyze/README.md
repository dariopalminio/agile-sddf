# story-analyze

> **Type:** skill · **Category:** guardrail  
> **Location:** `skills/story-analyze/SKILL.md`  
> **Status:** stable

---

## What it does

Audita la coherencia entre `story.md`, `design.md`, tareas y casos de prueba antes de implementar. Correlaciona criterios de aceptación, diseño, tareas, testcases, épica padre y DoD de PLAN para detectar inconsistencias con severidad.

**Produces:**

- `<directorio-historia>/analyze.md` con cobertura, inconsistencias y recomendaciones.
- La transición de `story.md` a `READY-FOR-IMPLEMENT/DONE` solo si no detecta errores bloqueantes.

**Does not do:**

- No redacta el diseño, las tareas ni los casos de prueba que audita.

---

## When to use

**Use it when:**

- Necesites revisar la alineación del plan de una historia antes de iniciar implementación.
- Exista `design.md` y al menos `tasks.md` o `testcases.md` para correlacionar.
- The user mentions: `"story-analyze"`, `"analizar plan de historia"`, `"coherencia de artefactos"`.

**Do NOT use it when:**

- Debas crear el diseño técnico → use `[[story-design]]` instead.
- Necesites generar tareas o casos de prueba → use `[[story-tasking]]` o `[[story-testcases]]` instead.

---

## Installation

**Core (included in `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/story-analyze STORY-NNN` sobre una historia planificada.
