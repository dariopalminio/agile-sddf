# story-acceptance

> **Type:** skill · **Category:** guardrail  
> **Location:** `skills/story-acceptance/SKILL.md`  
> **Status:** stable

---

## What it does

Guía una validación humana, criterio por criterio, para la etapa ACCEPTANCE del pipeline SDD. Recopila resultados `PASS`, `FAIL` o `BLOCKED`, conserva el historial de la sesión y actualiza el estado de la historia según el veredicto.

**Produces:**

- `<directorio-historia>/acceptance-report.md` con trazabilidad de la validación.
- El frontmatter de `story.md` actualizado de forma condicional según el veredicto.

**Does not do:**

- No ejecuta pruebas automáticas ni revisa código fuente.

## Veredicto

El reporte declara `verdict` en el frontmatter y en la sección `## Veredicto` (primer `##` tras el título). Regla evaluada en orden (primera fila que se cumple):

| Veredicto | Condición | Estado de `story.md` |
|---|---|---|
| `PENDING` | La sesión termina con `[Q]` (`session-status: partial`) | `ACCEPTANCE/IN-PROGRESS` (se mantiene) |
| `NEEDS-CHANGES` | `≥ 1` criterio `REJECTED`, con o sin bloqueados | `READY-FOR-IMPLEMENT/DONE` |
| `BLOCKED` | `≥ 1` criterio `BLOCKED` y ninguno `REJECTED` | `ACCEPTANCE/BLOCKED` |
| `APPROVED` | En otro caso | `ACCEPTANCE/DONE` |

El vocabulario y la precedencia siguen `docs/policies/validation-contract-policy.md`.

---

## When to use

**Use it when:**

- La historia esté en `VERIFY/DONE` y necesites su validación humana final antes de DELIVER.
- Quieras reanudar una sesión de aceptación parcial o reiniciarla explícitamente.
- The user mentions: `"story-acceptance"`, `"validación final"`, `"gate de acceptance"`.

**Do NOT use it when:**

- Debas ejecutar pruebas automatizadas de la historia → use `[[story-verify]]` instead.
- Necesites realizar el quality gate de la implementación → use `[[story-code-review]]` instead.

---

## Installation

**Core (included in `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/story-acceptance STORY-NNN`; admite `--restart`, `--dry-run` y `--validator "<nombre>"`.
