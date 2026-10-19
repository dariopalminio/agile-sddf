# story-fix-plan

> **Type:** skill · **Category:** worker  
> **Location:** `skills/story-fix-plan/SKILL.md`  
> **Status:** beta

---

## What it does

Corrige los archivos de planning de una historia a partir de los hallazgos de su `analyze.md`: inconsistencias detectadas, hallazgos, recomendaciones y criterios del DoD PLAN marcados `⚠️` o `❌`. Edita `design.md` (siempre obligatorio) y `tasks.md`, `testcases.md` o ambos, según cuáles existan. Planifica todos los cambios en un único ciclo, los aplica manteniendo coherentes esos archivos entre sí y registra el plan.

**Produces:**

- `design.md`, `tasks.md` y `testcases.md` corregidos (solo los que existen y el plan modifica).
- `<archivo>.bak` con el contenido previo de cada archivo modificado.
- `fix-plan-report.md` con el plan aplicado, las alternativas descartadas y los hallazgos fuera de alcance.

**Does not do:**

- No modifica `analyze.md`, `story.md` ni `epic.md`; los hallazgos que los afectan se listan como fuera de alcance.
- No crea `tasks.md` ni `testcases.md` si no existen: lo que requiera uno de ellos queda pendiente para `/story-tasking` o `/story-testcases`.
- No cambia `status` ni `substatus` ni vuelve a ejecutar `/story-analyze`.

---

## When to use

**Use it when:**

- `/story-analyze` dejó un `analyze.md` con `verdict: NEEDS-CHANGES` en el frontmatter. Con otro valor o sin `verdict`, el skill termina sin cambios.
- El veredicto es `APPROVED` pero quieres resolver sus advertencias: invoca `story-fix-plan STORY-NNN corrige advertencias` (o `corrige warnings`, o `--warnings`).
- Quieras resolver de forma trazable los criterios del DoD PLAN incumplidos antes de implementar.
- The user mentions: `"story-fix-plan"`, `"corregir plan de historia"`, `"aplicar recomendaciones de analyze"`.

**Do NOT use it when:**

- Aún no exista `analyze.md` → use `[[story-analyze]]` instead.
- No exista `design.md`, o no exista ni `tasks.md` ni `testcases.md` → use `[[story-design]]`, `[[story-tasking]]` o `[[story-testcases]]` instead.
- Los hallazgos afecten a la historia en sí (Como/Quiero/Para, criterios Gherkin) → use `[[story-refine]]` instead.

---

## Installation

**Core (included in `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/story-fix-plan STORY-NNN` para revisar el plan antes de aplicarlo, o `/story-fix-plan STORY-NNN --auto` para aplicarlo sin confirmación. Añade `corrige advertencias` (o `--warnings`) para corregir también las advertencias de un análisis `APPROVED`. Después, ejecuta `/story-analyze STORY-NNN` para verificar el resultado.
