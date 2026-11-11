# story-code-review

> **Type:** skill · **Category:** orchestrator  
> **Location:** `skills/story-code-review/SKILL.md`  
> **Status:** stable

---

## What it does

Ejecuta el quality gate posterior a la implementación mediante cuatro revisores paralelos: código, requisitos, integración y seguridad. Arbitra sus hallazgos, evalúa el DoD de CODE-REVIEW y deja un veredicto consolidado (`APPROVED`, `NEEDS-CHANGES` o `BLOCKED`) para la historia.

Si existe `REVIEW.md` en la raíz del repositorio, el skill lo pasa a los revisores y al árbitro para calibrar qué se reporta y con qué severidad; si no existe, advierte y revisa como antes.

Los hallazgos en líneas que la historia no tocó se informan como PREEXISTENTE y no bloquean: no cuentan para `max-severity`, el veredicto ni `fix-directives.md`. Sin git, en la rama principal o sin el motor `scripts/touched-lines.js`, la clasificación no se aplica y el informe dice por qué.

El árbitro no cuenta un hallazgo `HIGH`/`MEDIUM` sin `Archivo:Línea` y escenario de fallo concreto: lo marca `no verificado` y lo deja visible sin bloquear. Si varios revisores reportan el mismo defecto, lo fusiona en un solo hallazgo con la severidad mayor y lo cita con `Reportado por:`.

Para que el informe conserve señal, el árbitro muestra como máximo el «Tope de Minor» de `REVIEW.md` (5 `LOW` por revisor por defecto) y dice cuántos omitió. Al cerrar cada ronda, el motor `scripts/low-ledger.js` guarda las huellas de los `LOW` mostrados en `code-review-lows.json`; en la ronda siguiente, los `LOW` que se repiten sobre líneas cuyo contenido no cambió no se vuelven a mostrar. Sin ese registro (informe legado), el informe avisa «arrastre no comprobado». Los `HIGH`/`MEDIUM` se muestran siempre.

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

Para Claude:
```bash
npx agile-sddf install --target claude-code
```

Para OpenCode:
```bash
npx agile-sddf install --target opencode
```


Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/story-code-review STORY-NNN` después de `story-implement` o para reanudar una revisión interrumpida. En la reanudación, los informes parciales de `.tmp/story-code-review/STORY-NNN/` se descartan y se repite la revisión completa.
