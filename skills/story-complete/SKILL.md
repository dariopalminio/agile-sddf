---
name: story-complete
description: >-
  Completa una historia entregada (DELIVER/DONE → COMPLETED/DONE) y la archiva en specs/flow/archive/ con su fecha,
  conservando el historial de git y siempre con confirmación humana; también archiva sin cambio de status las COMPLETED/DONE
  y las CANCELED/DONE. Usar después de story-delivery para cerrar la historia, o para sacar de specs/flow/ una cancelada.
  Invocar para "story-complete", "completar historia", "archivar historia", "archivar historia cancelada", "cerrar historia" o "COMPLETED".
---

# Skill: `/story-complete`

## Objetivo

Cierra el ciclo de vida de una historia: la lleva de `DELIVER/DONE` a `COMPLETED/DONE` y mueve su directorio de `specs/flow/STORY-NNN-<slug>/` a `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/`, como fija ADR-0017. Las historias que ya están en `COMPLETED/DONE` y las canceladas (`CANCELED/DONE`) se archivan sin reescribir su frontmatter: una cancelada sigue figurando como `CANCELED` en el archivo.

El valor está en que el cierre deja de ser una edición manual más un movimiento a mano: la fecha del directorio sale siempre del frontmatter, la búsqueda falla cerrada ante cualquier ambigüedad y, si el movimiento falla, `story.md` vuelve a su contenido previo. `specs/flow/` queda solo con el trabajo activo y la historia archivada conserva su historial en git.

El trabajo determinista (localizar, validar, escribir, mover, verificar el conteo) lo hace el motor `scripts/story-complete.js`; este skill solo orquesta: pide el plan, lo muestra, pregunta y aplica. Así la operación irreversible no depende de que el agente siga pasos al pie de la letra, y el motor se prueba con `node --test` sin consumir cuota de evals.

## Posicionamiento

```
[story.md: DELIVER/DONE]             ← viene de story-delivery
     ↓
story-complete    ← aquí
      │   Entradas válidas:         DELIVER/DONE · COMPLETED/DONE · CANCELED/DONE (solo archivar)
      │   DELIVER/DONE + "s":       story.md → COMPLETED/DONE, updated: hoy, archivado
      │   COMPLETED/DONE + "s":     archivado sin tocar story.md
      │   CANCELED/DONE + "s":      archivado sin tocar story.md (sigue CANCELED)
      │   Cualquier rechazo:        no se pregunta; nada se modifica ni se mueve
      │   Respuesta distinta de "s": nada se modifica ni se mueve
     ↓
[specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/story.md: COMPLETED/DONE o CANCELED/DONE]
──────────────────────────────────────────────────────────────────────────────────────
story-acceptance  → validación humana final
story-delivery    → verifica el DoD de entrega y registra DELIVER
story-complete    → registra COMPLETED y archiva la historia (o la cancelada, sin cambiar su status) ← aquí
```

## Entrada

- `specs/flow/<STORY-NNN>-<slug>/story.md` — historia a cerrar (precondición de estado)
- `specs/flow/archive/` — se consulta para detectar conflictos de destino y, como pista, si la historia ya está archivada

## Parámetros

- `{story_id}` o primer argumento posicional: ID de la historia (ej. `STORY-160`)
- `{story_path}`: ruta explícita al directorio (`specs/flow/STORY-NNN-<slug>/`), en lugar del ID

No hay flags: ni modo automático ni `--yes`. `story-complete` escribe un estado terminal y la confirmación humana es obligatoria en cada ejecución.

## Precondiciones

| `status` / `substatus` | Acción |
|---|---|
| `DELIVER` / `DONE` | `complete`: escribe `status: COMPLETED`, `updated: <hoy>` y archiva con la fecha de hoy |
| `COMPLETED` / `DONE` | `archive-only`: archiva con la fecha de archivo; `story.md` no cambia |
| `CANCELED` / `DONE` | `archive-canceled`: archiva con la fecha de archivo conservando el status; `story.md` no cambia |
| `CANCELED` / otro substatus | rechazo: nombra el estado actual; solo se archivan las `CANCELED` con substatus `DONE` (no sugiere `/story-delivery`: una cancelada no se entrega) |
| cualquier otro par | rechazo: sugiere ejecutar antes `/story-delivery STORY-NNN` |

Esta tabla es el único lugar que decide por estado; la aplica el motor (`planCompletion`).

**Fecha de archivo** (ADR-0017), para `archive-only` y `archive-canceled`: el primer valor `YYYY-MM-DD` válido entre `updated:` y `created:`; `date:` solo se consulta si el frontmatter no tiene ninguna de esas dos claves. Sin fecha válida, la historia no se archiva y el mensaje nombra los tres campos buscados. En `complete` la fecha es la de hoy.

## Dependencias

- `node` en PATH y el motor propio `scripts/story-complete.js` (sin dependencias npm)
- git: opcional. Si el directorio tiene archivos versionados se mueve con `git mv` y conserva el historial; si no hay repositorio o el directorio no tiene historial, se mueve con un renombre simple y se avisa

## DoD aplicable

N/A — el cierre no tiene DoD propio: el DoD de entrega lo verifica `story-delivery` antes de `DELIVER/DONE`. Este skill no emite reporte ni `verdict` (no es un gate de validación).

## Modos de ejecución

- **Manual** (`/story-complete {story_id}`): único modo; muestra el plan y espera la confirmación
- **Automático** (invocado por orquestador): no disponible — la confirmación humana es parte del contrato

## Restricciones / Reglas

- **Nunca escribe ni mueve sin `s`:** todas las validaciones ocurren antes de preguntar; si alguna falla, el skill no pregunta, porque confirmar una operación que luego aborta no aporta nada.
- **No hace commit, push ni PR:** el renombre queda en el índice de git y el commit es del usuario.
- **No toca `epic.md`:** la marca `- [x]` de la historia en la épica es de `story-implement` / `story-implement-tasks`.
- **Una historia `CANCELED` se archiva sin escribir `story.md`:** status, substatus y `updated:` no cambian; el status es lo que la distingue de una entregada en el archivo (ADR-0017).
- **No reabre historias archivadas** ni busca dentro de `specs/flow/archive/` para resolver la historia.
- **No edita archivos a mano:** toda escritura y movimiento la hace el motor; el skill solo muestra su salida.
- **Encoding:** el motor escribe `story.md` en UTF-8 sin BOM y conserva sus finales de línea.

---

## Flujo de ejecución

### Paso 0 — Resolver contexto local

<!-- SDDF-FIXED-LAYOUT: v1 -->

Resuelve `REPO_ROOT` (raíz del repositorio) y usa rutas fijas relativas a él:
work items en `specs/flow/`, templates en `docs/templates/` y DoD en `docs/guardrails/`.
El layout no es configurable (ADR-0016).

Resuelve `CLI_ROOT` (instalación del paquete) por separado y solo para localizar el motor; nunca lo derives de `REPO_ROOT`.

El diagnóstico de entorno se solicita explícitamente con `/skill-preflight`; este workflow no lo invoca en su hot path.

### Paso 1 — Resolver el argumento

- Si el argumento tiene la forma `STORY-NNN`, úsalo como `--id STORY-NNN`.
- Si es una ruta, úsala como `--path <ruta>`; el motor la acepta solo si es `specs/flow/STORY-NNN-<slug>/`.
- Sin argumento, pregunta:
  ```
  ¿Qué historia deseas completar y archivar?
  Proporciona el ID (ej. STORY-160) o la ruta al directorio.
  ```

### Paso 2 — Localizar el motor

Localiza `<CLI_ROOT>/skills/story-complete/scripts/story-complete.js` y comprueba que `node` está en PATH (`node --version`). Si el archivo no existe o `node` no responde, muestra y termina sin tocar nada:

```
❌ No se encontró el motor de story-complete (<ruta probada>) o node no está en PATH
```

Todas las invocaciones se hacen desde `REPO_ROOT`:

```
node <CLI_ROOT>/skills/story-complete/scripts/story-complete.js <plan|apply> --repo-root <REPO_ROOT> (--id STORY-NNN | --path <ruta>)
```

El motor escribe un único objeto JSON en stdout (`ok`, `code`, `message`, `story`, `action`, `archiveDate`, `from`, `to`, `moveMethod`, `warnings`, `counts`). Exit `0` si `ok: true`, `1` si `ok: false`, `2` ante argumentos inválidos (error en stderr). Interpreta siempre el JSON, nunca el texto de stderr, salvo con exit `2`.

### Paso 3 — Planificar (solo lectura)

Invoca `plan`. `plan` no escribe nada.

- **`ok: false`** → muestra `❌ <message>` y termina **sin preguntar**. Cubre la historia no encontrada o ambigua, la ruta inválida, el estado no admitido, la `CANCELED` con substatus distinto de `DONE`, la falta de fecha y el destino existente.
- **`ok: true`** → continúa al Paso 4.

### Paso 4 — Confirmación humana

Muestra el resumen a partir del JSON:

```
📋 story-complete — <story.id>
   Estado actual:  <story.status>/<story.substatus>
   Acción:         COMPLETED/DONE · updated: <archiveDate>     (si action = complete)
   Acción:         sin cambio de status (ya COMPLETED/DONE)    (si action = archive-only)
   Acción:         sin cambio de status (CANCELED/DONE)        (si action = archive-canceled)
   Origen:         <from>/
   Destino:        <to>/
   Movimiento:     <moveMethod>
<cada línea de warnings>
```

Pregunta exactamente:

```
¿Confirmas completar y archivar <story.id> en <to>/? (s/n)                               (action = complete o archive-only)
¿Confirmas archivar <story.id> (CANCELED/DONE, el status no cambia) en <to>/? (s/n)      (action = archive-canceled)
```

Solo `s`, `si` o `sí` (sin distinguir mayúsculas) confirman. Cualquier otra respuesta, o ninguna, muestra `Operación cancelada por el usuario: no hubo cambios.` y termina **sin invocar `apply`**.

### Paso 5 — Aplicar

Tras `s`, invoca `apply` con los mismos argumentos. `apply` vuelve a validar todo (por si el filesystem cambió desde el plan) y, en este orden: escribe `story.md` (solo si `action: complete`), mueve el directorio, restaura `story.md` si el movimiento falla y comprueba que activas + archivadas no cambió. Con `archive-canceled` (como con `archive-only`) solo se mueve: no hay escritura previa ni nada que restaurar.

### Paso 6 — Mostrar el resultado

**`ok: true`:**

```
✅ <story.id> archivada en <to>/                              (action = complete o archive-only)
✅ <story.id> archivada como CANCELED (status sin cambios): <to>/   (action = archive-canceled)
   status: COMPLETED/DONE · updated: <archiveDate>            (solo si action = complete)
<cada línea de warnings>                                     (aviso de movimiento sin git mv, si aplica)
   El movimiento quedó en el índice de git (git-mv) o en el árbol de trabajo (rename); el commit queda a cargo del usuario.
```

**`ok: false`:** muestra `❌ <message>` y lo que quedó según el código (ver `## Manejo de errores`). No reintentes ni intentes reparar a mano: el mensaje del motor ya dice qué hacer.

## Manejo de errores

| Código | Cuándo | Mensaje (contenido) | Estado resultante |
|---|---|---|---|
| `NOT_FOUND` | ningún `specs/flow/STORY-NNN-*/` | la ruta buscada; si existe en el archivo, «ya archivada en <ruta>» | sin cambios |
| `AMBIGUOUS` | más de un `specs/flow/STORY-NNN-*/` | las rutas coincidentes | sin cambios |
| `INVALID_PATH` | `--path` fuera de `specs/flow/STORY-NNN-<slug>/` | la forma esperada | sin cambios |
| `NO_STORY_FILE` | el directorio no tiene `story.md` | la ruta | sin cambios |
| `NO_STATUS` | frontmatter sin `status`/`substatus` | los campos buscados | sin cambios |
| `NOT_DELIVERED` | estado distinto de `DELIVER/DONE`, `COMPLETED/DONE` y `CANCELED/*` | el estado actual y `/story-delivery STORY-NNN` | sin cambios |
| `CANCELED_NOT_DONE` | `status: CANCELED` con substatus distinto de `DONE` | el estado actual y que solo se archivan las `CANCELED` con substatus `DONE` | sin cambios |
| `NO_ARCHIVE_DATE` | `COMPLETED/DONE` o `CANCELED/DONE` sin fecha de archivo válida | los campos buscados (`updated:`, `created:`, `date:`) | sin cambios |
| `ARCHIVE_CONFLICT` | el destino ya existe | la ruta en conflicto | sin cambios |
| `WRITE_FAILED` | error de E/S al escribir `story.md` | la ruta y el error | nada movido |
| `MOVE_FAILED` | `git mv` o el renombre fallan | el error; `story.md` restaurado | sin cambios |
| `ROLLBACK_FAILED` | falla el movimiento y también la restauración | `git checkout -- <ruta>/story.md` para recuperar | `story.md` en `COMPLETED` dentro de `specs/flow/`: recupéralo con el comando |
| `COUNT_MISMATCH` | activas + archivadas cambió tras mover | ambas cifras y las rutas | directorio movido; revisar a mano |
| exit `2` | argumentos inválidos | el error de uso en stderr | sin cambios |
| motor o `node` ausentes | Paso 2 | `❌ No se encontró el motor de story-complete …` | sin cambios |

## Salida

| Artefacto | Ruta | Descripción |
|---|---|---|
| `story.md` (actualizado) | `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/story.md` | `status: COMPLETED`, `updated: <hoy>` (solo desde `DELIVER/DONE`) |
| Directorio archivado | `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/` | la historia completa, con sus reportes; renombre en el índice de git. Una `CANCELED/DONE` conserva su `story.md` byte a byte |

No se crea ningún reporte ni se modifica ningún otro archivo.
