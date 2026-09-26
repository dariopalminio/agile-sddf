# story-split

> **Type:** skill · **Category:** worker  
> **Location:** `skills/story-split/SKILL.md`  
> **Status:** stable

---

## What it does

Divide una historia demasiado amplia en historias más pequeñas e independientes usando los ocho patrones de Richard Lawrence. Designa una historia core, asigna IDs consecutivos a las adicionales y valida que cada resultado conserve valor e INVEST.

**Produces:**

- La historia core reutilizando y renombrando el directorio original, y nuevos `story.md` para las historias adicionales.
- Un plan de división sin escrituras cuando se usa `--dry-run`.

**Does not do:**

- No divide tareas técnicas sin valor de usuario ni genera artefactos de planning.

---

## When to use

**Use it when:**

- FINVEST indique tamaño pequeño insuficiente, haya al menos cuatro escenarios Gherkin o la historia no sea estimable.
- Necesites dividir verticalmente una feature grande en incrementos con valor independiente.
- The user mentions: `"story-split"`, `"dividir historia"`, `"historia muy grande"`.

**Do NOT use it when:**

- Solo debas refinar la redacción de una historia que sigue siendo una unidad de valor → use `[[story-improve]]` instead.
- Necesites crear tareas técnicas para una historia acotada → use `[[story-tasking]]` instead.

---

## Installation

**Core (included in `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/story-split STORY-NNN`; admite `--dry-run`, `--pattern N` y `--core N`.
