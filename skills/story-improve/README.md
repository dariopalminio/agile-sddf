# story-improve

> **Type:** skill · **Category:** worker  
> **Location:** `skills/story-improve/SKILL.md`  
> **Status:** stable

---

## What it does

Aplica a `story.md` las recomendaciones FINVEST de las dimensiones con puntuación menor o igual que 3. Preserva el contenido previo antes de modificar la historia y documenta las mejoras aplicadas.

**Produces:**

- Una versión mejorada de `<directorio-historia>/story.md`.
- `<directorio-historia>/story.md.bak` y `story-improvement-log.md` cuando la decisión FINVEST no es `APROBADA`.

**Does not do:**

- No modifica el reporte FINVEST ni ejecuta una nueva evaluación automáticamente.

---

## When to use

**Use it when:**

- Exista un `finvest-evaluation-report.md` con decisión `REFINAR` o `RECHAZAR`.
- Quieras aplicar de forma trazable las recomendaciones antes de reevaluar la historia.
- The user mentions: `"story-improve"`, `"mejorar historia"`, `"aplicar recomendaciones FINVEST"`.

**Do NOT use it when:**

- Necesites decidir primero la calidad de la historia → use `[[story-evaluation]]` instead.
- La historia deba descomponerse en varias historias → use `[[story-split]]` instead.

---

## Installation

**Core (included in `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/story-improve --story-id STORY-NNN`.
