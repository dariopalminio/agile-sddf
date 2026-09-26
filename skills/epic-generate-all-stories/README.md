# epic-generate-all-stories

> **Type:** skill · **Category:** orchestrator  
> **Location:** `skills/epic-generate-all-stories/SKILL.md`  
> **Status:** stable

---

## What it does

Procesa todas las épicas existentes en orden alfabético y deriva una historia de usuario por cada feature definida, aplicando el flujo de `epic-generate-stories`. Detecta conflictos antes de escribir y permite sobrescribir, omitir o decidirlos uno a uno.

**Produces:**

- Directorios `$SPECS_BASE/specs/03-stories/STORY-NNN-nombre/`.
- Un `story.md` por feature extraída y un resumen consolidado del lote.

**Does not do:**

- No crea historias fuera de las features documentadas en las épicas fuente.

---

## When to use

**Use it when:**

- Necesites convertir todas las épicas disponibles en historias de usuario de una vez.
- Quieras detectar conflictos de IDs o directorios antes de iniciar el procesamiento batch.
- El usuario mencione: `"epic-generate-all-stories"`, `"generar historias de todas las épicas"`, `"historias en batch"`.

**Do NOT use it when:**

- Solo debas procesar una épica concreta → usa `[[epic-generate-stories]]`.
- Necesites redactar una historia individual desde contexto libre → usa `[[story-creation]]`.

---

## Installation

**Core (incluido en `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/epic-generate-all-stories` para procesar el conjunto completo de épicas.
