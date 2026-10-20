# story-code-review

> **Type:** skill · **Category:** orchestrator  
> **Location:** `skills/story-code-review/SKILL.md`  
> **Status:** stable

---

## What it does

Ejecuta el quality gate posterior a la implementación mediante cuatro revisores paralelos: código, requisitos, integración y seguridad. Arbitra sus hallazgos, evalúa el DoD de CODE-REVIEW y deja un veredicto consolidado (`APPROVED`, `NEEDS-CHANGES` o `BLOCKED`) para la historia.

**Produces:**

- `<directorio-historia>/code-review-report.md` en todas las ejecuciones válidas.
- `<directorio-historia>/fix-directives.md` solo cuando el veredicto es `NEEDS-CHANGES`.
- Actualizaciones de estado de `story.md` y reportes temporales de los revisores.

**Does not do:**

- No implementa correcciones ni ejecuta la fase VERIFY.

---

## When to use

**Use it when:**

- La historia está en `IMPLEMENT/DONE` y necesitas revisar su calidad antes de verificarla.
- Una revisión quedó en `CODE-REVIEW/IN-PROGRESS` y necesitas reanudarla; el skill vuelve a ejecutar los cuatro revisores con informes temporales nuevos.
- Quieras reunir revisión de código, requisitos, integración y seguridad en un único gate.
- The user mentions: `"story-code-review"`, `"revisar código"`, `"quality gate post-implement"`.

**Do NOT use it when:**

- Debas implementar o corregir hallazgos → use `[[story-implement]]` instead.
- Necesites ejecutar las pruebas de verificación → use `[[story-verify]]` instead.

---

## Installation

**Core (included in `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/story-code-review STORY-NNN` después de `story-implement` o para reanudar una revisión interrumpida. En la reanudación, los informes parciales de `.tmp/story-code-review/STORY-NNN/` se descartan y se repite la revisión completa.
