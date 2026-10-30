# epic-refine

> **Type:** skill · **Category:** worker  
> **Location:** `skills/epic-refine/SKILL.md`  
> **Status:** beta

---

## What it does

Corrige una épica que `epic-analyze` dejó en `NEEDS-REFINEMENT`: añade al índice de `epic.md` las historias huérfanas (INT-02), deja una sola línea por historia duplicada (INT-03) y retira de los `story.md` las entradas `related` que apuntan a historias o épicas inexistentes (MAD-02). Antes de escribir muestra un plan de cambios consolidado y pide confirmación; los hallazgos que requieren una decisión del PO no se tocan y quedan registrados como «fuera de alcance» con su responsable. Es el corrector del bucle de `PLAN`, `epic-analyze → epic-refine → epic-analyze`.

**Produces:**

- `epic.md` y los `story.md` activos de la épica corregidos (solo cambian las líneas del plan y `updated:`), cada uno con su `<archivo>.bak` previo.
- `<EPIC_DIR>/epic-refine-report.md` con cada hallazgo clasificado como `aplicado`, `ya resuelto` o `fuera de alcance`, los cambios aplicados y las notas; no lleva veredicto.
- Un resumen en consola (modo manual) o un bloque de retorno `STATUS`/`APLICADOS`/`YA-RESUELTOS`/`FUERA-DE-ALCANCE`/`REPORTE` (modo Agent o `--auto`).

**Does not do:**

- No diagnostica la épica ni vuelve a ejecutar `epic-analyze` al terminar.
- No cambia `status`, `substatus` ni `parent`; no modifica criterios de salida, smoke tests ni alcance; no crea historias.
- No cubre criterios de salida ni smoke tests (SAL-01, SAL-02) en esta versión.
- No modifica `epic-analyze-report.md` ni las historias archivadas.
- No corrige la forma de `epic.md` (eso es `epic-improve`).

---

## When to use

**Use it when:**

- `epic-analyze` declaró `NEEDS-REFINEMENT` por historias huérfanas, líneas duplicadas en el índice o `related` rotos.
- Quieras volver a analizar la épica sin corregir a mano el índice ni los enlaces.
- El usuario mencione: `"epic-refine"`, `"refinar épica"`, `"aplicar epic-analyze"`, `"historia huérfana"`, `"related roto"`.

**Do NOT use it when:**

- La épica no tiene todavía `epic-analyze-report.md` → usa `[[epic-analyze]]` primero.
- Debas corregir la forma de `epic.md` señalada por `epic-format-validation` → usa `[[epic-improve]]`.
- Falten historias por generar (INT-01, INT-05) → usa `[[epic-generate-stories]]`.
- Debas completar la especificación de una historia hija (MAD-01) → usa `[[story-specify]]`.

---

## Installation

**Core (incluido en `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/epic-refine <epica>`, donde `<epica>` es el ID (`EPIC-30`), el nombre del directorio (`EPIC-30-ejemplo`) o la ruta al directorio o a su `epic.md`. Añade `--auto` para aplicar el plan sin preguntas desde un orquestador.

```bash
/epic-refine EPIC-30
/epic-refine EPIC-30 --auto
```
