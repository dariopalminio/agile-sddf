# epic-generate-stories

> **Type:** skill · **Category:** orchestrator  
> **Location:** `skills/epic-generate-stories/SKILL.md`  
> **Status:** stable

---

## What it does

Extrae las features de una épica y genera historias de usuario con criterios Gherkin a partir del template `story-template.md`. Puede resolver la épica por nombre de directorio o por ruta explícita y asigna IDs a features que aún no los tengan.

**Produces:**

- Directorios `$SPECS_BASE/specs/03-stories/STORY-NNN-nombre/`.
- Un `story.md` por feature y un resumen de la generación.

**Does not do:**

- No evalúa ni mejora la calidad FINVEST de las historias recién generadas.

---

## When to use

**Use it when:**

- Quieras derivar historias a partir de una épica específica ya documentada.
- Necesites procesar una ruta o un directorio de épica concreto.
- El usuario mencione: `"epic-generate-stories"`, `"generar historias de una épica"`, `"extraer features de épica"`.

**Do NOT use it when:**

- Debas procesar todas las épicas del repositorio → usa `[[epic-generate-all-stories]]`.
- Quieras evaluar una historia ya creada → usa `[[story-evaluation]]`.

---

## Installation

**Core (incluido en `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/epic-generate-stories <épica>` con el nombre o la ruta de la épica objetivo.
