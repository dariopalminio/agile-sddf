# story-complete

> **Type:** skill · **Category:** workflow  
> **Location:** `skills/story-complete/SKILL.md`  
> **Status:** stable

---

## What it does

Cierra una historia entregada: la lleva de `DELIVER/DONE` a `COMPLETED/DONE` y mueve su directorio a `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/` (ADR-0017), conservando el historial de git. Las historias que ya están en `COMPLETED/DONE` y las canceladas (`CANCELED/DONE`) se archivan sin reescribir el frontmatter: una cancelada conserva su status y no se confunde con una entregada. Siempre pide confirmación humana antes de escribir o mover nada.

**Produces:**

- `story.md` con `status: COMPLETED` y `updated:` de hoy, solo si venía de `DELIVER/DONE`.
- El directorio de la historia movido a `specs/flow/archive/`, con `git mv` (renombre en el índice) o, si el directorio no tiene historial de git, con un renombre simple y un aviso.

**Does not do:**

- No hace commit, push ni PR.
- No marca la historia en `epic.md`.
- No pasa historias a `CANCELED` ni reabre historias archivadas.
- No crea reportes ni tiene DoD propio: el DoD de entrega lo verifica `story-delivery`.

## Estados admitidos

| Estado de `story.md` | Resultado |
|---|---|
| `DELIVER/DONE` | `COMPLETED/DONE`, `updated:` de hoy, archivada con la fecha de hoy |
| `COMPLETED/DONE` | archivada con la fecha de archivo, sin cambiar `story.md` |
| `CANCELED/DONE` | archivada con la fecha de archivo, sin cambiar `story.md` (sigue `CANCELED`) |
| `CANCELED/<otro>` | rechazo: solo se archivan las `CANCELED` con substatus `DONE` |
| otro | rechazo: ejecuta antes `/story-delivery STORY-NNN` |

**Fecha de archivo:** `updated:`; si no es válido, `created:`; si el frontmatter no tiene ninguna de esas dos claves, `date:` (formato `YYYY-MM-DD`).

Los rechazos, el destino existente y la falta de fecha se detectan antes de preguntar: en esos casos no se modifica ni se mueve nada.

## Motor

`scripts/story-complete.js` hace todo el trabajo determinista: localizar la historia (solo en el primer nivel de `specs/flow/`, fallando cerrado si hay más de una coincidencia), validar, escribir el frontmatter, mover y comprobar que activas + archivadas no cambió. Si el movimiento falla, restaura `story.md`. Tiene dos subcomandos: `plan` (solo lectura) y `apply`. Sus pruebas viven en `test/story-complete.test.js`.

---

## When to use

**Use it when:**

- La historia está en `DELIVER/DONE` y quieres cerrarla y sacarla de `specs/flow/`.
- Una historia ya marcada `COMPLETED/DONE` a mano sigue en `specs/flow/` y quieres archivarla.
- Una historia cancelada (`CANCELED/DONE`) sigue en `specs/flow/` y quieres sacarla del trabajo activo.
- The user mentions: `"story-complete"`, `"completar historia"`, `"archivar historia"`, `"archivar historia cancelada"`.

**Do NOT use it when:**

- La historia aún no se entregó → use `[[story-delivery]]` instead.

---

## Installation

**Core (included in `agile-sddf`):**

```bash
npx agile-sddf install --target claude-code
```

Para otro runtime compatible, sustituye `claude-code` por un identificador declarado como `supported` en `config/runtimes.json`.

### Invocation

Usa `/story-complete STORY-NNN` o `/story-complete specs/flow/STORY-NNN-<slug>/`; no admite flags.
