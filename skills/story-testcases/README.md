# story-testcases

> **Type:** skill · **Category:** worker  
> **Location:** `skills/story-testcases/SKILL.md`  
> **Status:** stable

---

## What it does

Deriva una tabla de casos de prueba tipificados (UT, CT, IT, API, E2E y EV) desde los criterios de aceptación y el diseño técnico. Puede incorporar `tasks.md` como contexto adicional y verifica la cobertura mínima antes de guardar el documento.

**Produces:**

- `<directorio-historia>/testcases.md` con trazabilidad hacia los criterios de aceptación.
- Un resumen de cobertura y de los tipos de prueba propuestos.

**Does not do:**

- No ejecuta pruebas ni modifica las tareas, el diseño o la historia fuente.

---

## When to use

**Use it when:**

- Ya existan `story.md` y `design.md` y necesites especificar cómo comprobarlos antes de implementar.
- Quieras cubrir criterios funcionales y contratos técnicos en una tabla de pruebas trazable.
- The user mentions: `"story-testcases"`, `"casos de prueba"`, `"tabla de pruebas"`.

**Do NOT use it when:**

- Debas preparar tareas ejecutables → use `[[story-tasking]]` instead.
- Necesites ejecutar o verificar pruebas ya implementadas → use `[[story-verify]]` instead.

---

## Installation

**Core (included in `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/story-testcases STORY-NNN` sobre una historia con diseño técnico.
