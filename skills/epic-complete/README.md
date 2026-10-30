# epic-complete

> **Type:** skill · **Category:** workflow  
> **Location:** `skills/epic-complete/SKILL.md`  
> **Status:** stable

---

## What it does

Cierra una épica liberada: la lleva de `SHIP/DONE` a `COMPLETED/DONE`, registra en `epic.md` la fecha de cierre y la versión liberada y mueve su directorio a `specs/flow/archive/<YYYY-MM-DD>-EPIC-NN-<slug>/` (ADR-0019), conservando el historial de git. Una épica que ya está en `COMPLETED/DONE` se archiva sin reescribir su frontmatter, y una `CANCELED/DONE` también, conservando su status. Siempre pide confirmación humana antes de escribir o mover nada.

**Produces:**

- `epic.md` con `status: COMPLETED`, `updated:` y `completed:` de hoy y `version:` de la versión liberada, solo si venía de `SHIP/DONE`.
- El directorio de la épica movido a `specs/flow/archive/`, con `git mv` (renombre en el índice) o, si el directorio no tiene historial de git, con un renombre simple y un aviso.

**Does not do:**

- No hace commit, tag, push ni PR, ni promueve `[Unreleased]` en `CHANGELOG.md`.
- No archiva las historias hijas: eso lo hace `/story-complete`.
- No cancela épicas ni archiva las `CANCELED` cuyo substatus no es `DONE`.
- No crea reportes ni tiene DoD propio.

## Estados admitidos

| Estado de `epic.md` | Resultado |
|---|---|
| `SHIP/DONE` | `COMPLETED/DONE`, `completed:` y `version:`, archivada con la fecha de hoy |
| `COMPLETED/DONE` | archivada con la fecha de archivo, sin cambiar `epic.md` |
| `CANCELED/DONE` | archivada con la fecha de archivo, sin cambiar `epic.md`: sigue figurando como `CANCELED` |
| `CANCELED/<otro>` | rechazo: solo se archivan las épicas canceladas con substatus `DONE` |
| otro | rechazo: solo se completan épicas en `SHIP/DONE`, `COMPLETED/DONE` o `CANCELED/DONE` |

**Versión liberada:** `--version x.y.z`; si no se indica, el encabezado `## [x.y.z]` de `CHANGELOG.md` que contiene el bloque `<!-- epic-ship:EPIC-NN:start -->`. Si la entrada sigue en `[Unreleased]` o no existe, no se cierra y se pide `--version`.

**Fecha de archivo** (`COMPLETED/DONE` y `CANCELED/DONE`): `updated:`; si no es válido, `created:`; si el frontmatter no tiene ninguna de esas dos claves, `date:`.

## Motor

`scripts/epic-complete.js` hace todo el trabajo determinista: localizar la épica (solo en el primer nivel de `specs/flow/`), validar, resolver la versión, escribir el frontmatter, mover y comprobar que activas + archivadas no cambió. Si el movimiento falla, restaura `epic.md`. Tiene dos subcomandos: `plan` (solo lectura) y `apply`. Sus pruebas viven en `test/epic-complete.test.js`.

---

## When to use

**Use it when:**

- La épica está en `SHIP/DONE`, verificaste que la versión liberada opera correctamente y quieres cerrarla y sacarla de `specs/flow/`.
- Una épica ya marcada `COMPLETED/DONE` a mano sigue en `specs/flow/` y quieres archivarla.
- Cancelaste una épica (`CANCELED/DONE`) y quieres sacarla de `specs/flow/` sin que pase a `COMPLETED`.
- The user mentions: `"epic-complete"`, `"completar épica"`, `"archivar épica"`, `"archivar épica cancelada"`, `"cerrar épica"`.

**Do NOT use it when:**

- La épica aún no se liberó → use `[[epic-ship]]` instead.
- Quieres archivar una historia → use `[[story-complete]]` instead.

---

## Installation

**Core (included in `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/epic-complete EPIC-NN [--version x.y.z]` o `/epic-complete specs/flow/EPIC-NN-<slug>/ [--version x.y.z]`.
