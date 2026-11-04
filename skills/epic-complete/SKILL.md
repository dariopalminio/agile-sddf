---
name: epic-complete
description: >-
  Completa una épica SHIP/DONE (→ COMPLETED/DONE con fecha de cierre y versión) y la archiva en specs/flow/archive/
  con confirmación humana; las CANCELED/DONE se archivan sin cambiar su status. Usar después de epic-ship. Invocar
  para "epic-complete", "completar épica", "archivar épica", "archivar épica cancelada", "cerrar épica" o "COMPLETED".
---

# Skill: `/epic-complete`

## Objetivo

Cierra el ciclo de vida de una épica: la lleva de `SHIP/DONE` a `COMPLETED/DONE`, deja en el frontmatter de `epic.md` la fecha de cierre (`completed:`) y la versión liberada (`version:`) y mueve su directorio de `specs/flow/EPIC-NN-<slug>/` a `specs/flow/archive/<YYYY-MM-DD>-EPIC-NN-<slug>/` (ADR-0019). Una épica que ya está en `COMPLETED/DONE` se archiva sin reescribir su frontmatter, y una `CANCELED/DONE` también, conservando su status para no confundirse con una liberada.

`specs/flow/` queda solo con el trabajo activo y la épica archivada conserva su historial en git; `created:` y `completed:` permiten medir el tiempo de ciclo y `version:` la enlaza con su entrada de `CHANGELOG.md`.

El trabajo determinista (localizar, validar, resolver la versión, escribir, mover, verificar el conteo) lo hace el motor `scripts/epic-complete.js`; este skill solo orquesta: pide el plan, lo muestra, pregunta y aplica.

## Posicionamiento

```
[epic.md: SHIP/DONE]                 ← viene de epic-ship (el humano liberó y desplegó)
     ↓
epic-complete    ← aquí
      │   SHIP/DONE + "s":          epic.md → COMPLETED/DONE, updated/completed: hoy, version: x.y.z, archivada
      │   COMPLETED/DONE + "s":     archivada sin tocar epic.md
      │   CANCELED/DONE + "s":      archivada sin tocar epic.md (sigue CANCELED/DONE)
      │   Cualquier rechazo:        no se pregunta; nada se modifica ni se mueve
      │   Respuesta distinta de "s": nada se modifica ni se mueve
     ↓
[specs/flow/archive/<YYYY-MM-DD>-EPIC-NN-<slug>/epic.md: COMPLETED/DONE | CANCELED/DONE]
```

Nodo `epic-complete` (`SHIP → COMPLETED`) de `docs/architecture/diagrams/flowchart-skill-epic-flow-relationship.mermaid`.

## Entrada

- `specs/flow/<EPIC-NN>-<slug>/epic.md` — épica a cerrar (precondición de estado)
- `CHANGELOG.md` (solo lectura) — fuente de la versión liberada cuando no se pasa `--version`: el encabezado `## [x.y.z]` que contiene el bloque `<!-- epic-ship:EPIC-NN:start -->`
- `specs/flow/archive/` — se consulta para detectar conflictos de destino y, como pista, si la épica ya está archivada

## Parámetros

- Primer argumento posicional: ID de la épica (`EPIC-NN`) o ruta explícita (`specs/flow/EPIC-NN-<slug>/`)
- `--version x.y.z` (opcional): versión liberada; prevalece sobre `CHANGELOG.md` (se acepta una `v` inicial, que se descarta)

No hay modo automático ni `--yes`: `epic-complete` escribe un estado terminal y la confirmación humana es obligatoria en cada ejecución.

## Precondiciones

| `status` / `substatus` | Acción |
|---|---|
| `SHIP` / `DONE` | `complete`: escribe `status: COMPLETED`, `updated:` y `completed:` de hoy, `version:` y archiva con la fecha de hoy |
| `COMPLETED` / `DONE` | `archive-only`: archiva con la fecha de `updated:` → `created:` (`date:` solo si faltan ambas); `epic.md` no cambia |
| `CANCELED` / `DONE` | `archive-canceled`: archiva con la misma fecha que `archive-only`; `epic.md` no cambia y conserva `CANCELED/DONE`; `--version` se ignora |
| `CANCELED` / otro substatus | rechazo `CANCELED_NOT_DONE`: solo se archivan las épicas canceladas con substatus `DONE` |
| cualquier otro par | rechazo `NOT_SHIPPED`: solo se completan épicas en `SHIP/DONE`, `COMPLETED/DONE` o `CANCELED/DONE` |

Esta tabla es el único lugar que decide por estado; la aplica el motor (`planCompletion`).

## Dependencias

- `node` en PATH y el motor propio `scripts/epic-complete.js` (sin dependencias npm)
- git: opcional. Con archivos versionados se mueve con `git mv`; sin repositorio o sin historial, con un renombre simple y un aviso

## DoD aplicable

N/A — el cierre no tiene DoD propio: `SHIP/DONE` ya implica el `APPROVED` de `epic-validate` y la confirmación de liberación de `epic-ship`. No emite reporte ni `verdict`.

## Modos de ejecución

- **Manual** (`/epic-complete EPIC-NN [--version x.y.z]`): único modo; muestra el plan y espera la confirmación
- **Automático** (invocado por orquestador): no disponible — la confirmación humana es parte del contrato

## Restricciones / Reglas

- **Nunca escribe ni mueve sin `s`:** todas las validaciones ocurren antes de preguntar; si alguna falla, el skill no pregunta.
- **No hace commit, push, tag ni PR:** el renombre queda en el índice de git y el commit es del usuario.
- **No archiva las historias hijas** (lo hace `/story-complete`) ni promueve `[Unreleased]` en `CHANGELOG.md`.
- **No reabre épicas archivadas** ni busca dentro de `specs/flow/archive/` para resolver la épica.
- **No edita archivos a mano:** toda escritura y movimiento la hace el motor; el skill solo muestra su salida.
- **Encoding:** el motor escribe `epic.md` en UTF-8 sin BOM y conserva sus finales de línea.

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

- `EPIC-NN` → `--id EPIC-NN`; una ruta → `--path <ruta>` (el motor solo acepta `specs/flow/EPIC-NN-<slug>/`).
- `--version x.y.z`, si se indicó, se pasa tal cual.
- Sin argumento, pregunta:
  ```
  ¿Qué épica deseas completar y archivar?
  Proporciona el ID (ej. EPIC-23) o la ruta al directorio.
  ```

### Paso 2 — Localizar el motor

Localiza `<CLI_ROOT>/skills/epic-complete/scripts/epic-complete.js` y comprueba `node --version`. Si falta alguno, muestra y termina sin tocar nada:

```
❌ No se encontró el motor de epic-complete (<ruta probada>) o node no está en PATH
```

Todas las invocaciones se hacen desde `REPO_ROOT`:

```
node <CLI_ROOT>/skills/epic-complete/scripts/epic-complete.js <plan|apply> --repo-root <REPO_ROOT> (--id EPIC-NN | --path <ruta>) [--version <x.y.z>]
```

El motor escribe un único objeto JSON en stdout (`ok`, `code`, `message`, `epic`, `action`, `archiveDate`, `version`, `versionSource`, `from`, `to`, `moveMethod`, `warnings`, `counts`). Exit `0` si `ok: true`, `1` si `ok: false`, `2` ante argumentos inválidos (error en stderr). Interpreta siempre el JSON, nunca stderr, salvo con exit `2`.

### Paso 3 — Planificar (solo lectura)

Invoca `plan`; no escribe nada.

- **`ok: false`** (o exit `2`) → carga `references/error-codes.md` para saber qué quedó, muestra `❌ <message>` y termina **sin preguntar**.
- **`ok: true`** → continúa al Paso 4.

### Paso 4 — Confirmación humana

Muestra el resumen a partir del JSON:

```
📋 epic-complete — <epic.id>
   Estado actual:  <epic.status>/<epic.substatus>
   Acción:         COMPLETED/DONE · completed: <archiveDate>   (si action = complete)
   Acción:         sin cambio de status (ya COMPLETED/DONE)    (si action = archive-only)
   Acción:         sin cambio de status (CANCELED/DONE)        (si action = archive-canceled)
   Versión:        <version> (fuente: <versionSource>)         (solo si action = complete)
   Origen:         <from>/
   Destino:        <to>/
   Movimiento:     <moveMethod>
<cada línea de warnings>
```

Pregunta exactamente:

```
¿Confirmas que la versión <version> de <epic.id> opera correctamente tras el despliegue y quieres completarla y archivarla en <to>/? (s/n)   (action = complete)
¿Confirmas archivar <epic.id> (ya COMPLETED/DONE, el status no cambia) en <to>/? (s/n)                                                    (action = archive-only)
¿Confirmas archivar <epic.id> (CANCELED/DONE, el status no cambia) en <to>/? (s/n)                                                        (action = archive-canceled)
```

Solo `s`, `si` o `sí` (sin distinguir mayúsculas) confirman. Cualquier otra respuesta, o ninguna, muestra `Operación cancelada por el usuario: no hubo cambios.` y termina **sin invocar `apply`**: la épica sigue en su estado dentro de `specs/flow/`.

### Paso 5 — Aplicar

Tras `s`, invoca `apply` con los mismos argumentos. `apply` vuelve a validar todo y, en este orden: escribe `epic.md` (solo si `action: complete`), crea `specs/flow/archive/` si falta, mueve el directorio, restaura `epic.md` si el movimiento falla y comprueba que activas + archivadas no cambió.

### Paso 6 — Mostrar el resultado

**`ok: true`:**

```
✅ <epic.id> archivada en <to>/ · COMPLETED/DONE · versión <version> · completed: <archiveDate>   (action = complete)
✅ <epic.id> archivada en <to>/ · sin cambio de status (ya COMPLETED/DONE)                        (action = archive-only)
✅ <epic.id> archivada como CANCELED (status sin cambios): <to>/                                  (action = archive-canceled)
<cada línea de warnings>
   El movimiento quedó en el índice de git (git-mv) o en el árbol de trabajo (rename); el commit queda a cargo del usuario.
```

**`ok: false`:** carga `references/error-codes.md`, muestra `❌ <message>` y lo que quedó según el código. No reintentes ni repares a mano: el mensaje del motor ya dice qué hacer.

**Verificación:** con `ok: true`, `<to>/epic.md` existe y `<from>/` ya no; si no es así, informa la discrepancia en lugar del `✅`.

## Salida

| Artefacto | Ruta | Descripción |
|---|---|---|
| `epic.md` (actualizado) | `specs/flow/archive/<YYYY-MM-DD>-EPIC-NN-<slug>/epic.md` | `status: COMPLETED`, `updated:` y `completed:` de hoy, `version:` (solo desde `SHIP/DONE`) |
| Directorio archivado | `specs/flow/archive/<YYYY-MM-DD>-EPIC-NN-<slug>/` | la épica completa, con sus reportes; renombre en el índice de git |

No se crea ningún reporte ni se modifica ningún otro archivo.

## References

- `references/error-codes.md` — código → cuándo → mensaje → estado resultante; se carga solo ante `ok: false`
