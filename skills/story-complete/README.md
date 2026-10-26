# story-complete

> **Type:** skill · **Category:** workflow  
> **Location:** `skills/story-complete/SKILL.md`  
> **Status:** stable

---

## What it does

Cierra una historia entregada: la lleva de `DELIVER/DONE` a `COMPLETED/DONE` y mueve su directorio a `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/` (ADR-0016), conservando el historial de git. Las historias que ya están en `COMPLETED/DONE` se archivan sin reescribir el frontmatter. Siempre pide confirmación humana antes de escribir o mover nada.

**Produces:**

- `story.md` con `status: COMPLETED` y `updated:` de hoy, solo si venía de `DELIVER/DONE`.
- El directorio de la historia movido a `specs/flow/archive/`, con `git mv` (renombre en el índice) o, si el directorio no tiene historial de git, con un renombre simple y un aviso.

**Does not do:**

- No hace commit, push ni PR.
- No marca la historia en `epic.md`.
- No archiva historias `CANCELED` ni reabre historias archivadas.
- No crea reportes ni tiene DoD propio: el DoD de entrega lo verifica `story-delivery`.

## Estados admitidos

| Estado de `story.md` | Resultado |
|---|---|
| `DELIVER/DONE` | `COMPLETED/DONE`, `updated:` de hoy, archivada con la fecha de hoy |
| `COMPLETED/DONE` | archivada con la fecha de `updated:` (o `created:`), sin cambiar `story.md` |
| `CANCELED/*` | rechazo: ADR-0016 solo admite historias `COMPLETED` en el archivo |
| otro | rechazo: ejecuta antes `/story-delivery STORY-NNN` |

Los rechazos, el destino existente y la falta de fecha se detectan antes de preguntar: en esos casos no se modifica ni se mueve nada.

## Motor

`scripts/story-complete.js` hace todo el trabajo determinista: localizar la historia (solo en el primer nivel de `specs/flow/`, fallando cerrado si hay más de una coincidencia), validar, escribir el frontmatter, mover y comprobar que activas + archivadas no cambió. Si el movimiento falla, restaura `story.md`. Tiene dos subcomandos: `plan` (solo lectura) y `apply`. Sus pruebas viven en `test/story-complete.test.js`.

## Extensión prevista

STORY-164 añadirá el archivado de historias `CANCELED` (con un ADR que reemplace a ADR-0016) y el respaldo `date:` para la fecha. Hoy no están disponibles.

---

## When to use

**Use it when:**

- La historia está en `DELIVER/DONE` y quieres cerrarla y sacarla de `specs/flow/`.
- Una historia ya marcada `COMPLETED/DONE` a mano sigue en `specs/flow/` y quieres archivarla.
- The user mentions: `"story-complete"`, `"completar historia"`, `"archivar historia"`.

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
