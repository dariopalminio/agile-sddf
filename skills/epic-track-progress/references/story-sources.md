# Reglas de cruce de historias

> **Origen:** reglas tomadas de `skills/epic-analyze/SKILL.md` (Paso 1 — resolver la épica, Paso 3 — Vía A, Paso 4 — Vía B). Si esas reglas cambian, actualizar este archivo para que ambos skills vean las mismas historias de una épica.

Todas las rutas son relativas a `REPO_ROOT`. Todo glob se evalúa fuera de bloques de código y nunca consulta el layout legado.

## 1. Resolución de la épica

Interpretar `<epica>` en este orden; la primera forma aplicable decide:

1. **Ruta** (contiene `/` o `\`): directorio de la épica, o su `epic.md`. `EPIC_DIR` = ese directorio.
2. **Nombre de directorio** (`EPIC-NN-<slug>`): `specs/flow/<nombre>/epic.md`.
3. **ID** (`EPIC-NN`): glob `specs/flow/<ID>-*/epic.md`. El guion tras el ID es parte del patrón: `EPIC-30` no casa `EPIC-300-x`.

La búsqueda se restringe a `specs/flow/EPIC-*/epic.md`: solo se resuelven épicas activas, así que `specs/flow/archive/` nunca se consulta para resolverlas (una épica archivada es terminal, ADR-0019). `EPIC_ID` se toma del nombre del directorio, no del `id:` del frontmatter, porque el `parent` de las historias referencia el directorio.

## 2. Vía A — índice de `epic.md`

**Localizar la sección.** El título se lee de `docs/templates/epic-template.md`: la línea `## <título>` cuyo marcador declara `clave: historias` (el comentario `<!-- … -->` no forma parte del título). Si el template central no existe, usar `Historias` (título del seed de `epic-creation`). En `epic.md`, la sección abarca desde la línea `## <título>` hasta el siguiente `## ` fuera de bloques de código. Si el template no declara la clave o `epic.md` no tiene el encabezado, la Vía A queda vacía (nota del Paso 5 del `SKILL.md`).

**Parsear las líneas.** Solo líneas de nivel superior que empiezan por `- ` (los sub-ítems indentados y las líneas dentro de bloques de código no son historias):

| Forma | Regla | Resultado |
|---|---|---|
| F2 / F3 | Contiene el token `**STORY-NNN**` (guion ASCII, ≥ 3 dígitos); se toma la **primera** ocurrencia | `id = STORY-NNN`; `F2` si empieza por `- [ ]`, `F3` si por `- [x]`; el texto posterior se ignora |
| F1 (planificada) | Sin checkbox (`[ ]`/`[x]`) y sin `STORY-NNN` | `id = null`; `nombre` = texto entre `- ` y el primer `:`, o la línea entera sin `- ` si no hay `:` |
| No reconocida | Cualquier otra (checkbox sin `**STORY-NNN**`, ID fuera de negrita) | Se ignora con la nota `epic.md:<línea>: línea del índice no reconocida → /epic-format-validation <EPIC_ID>` |

El estado de la casilla (`[ ]`/`[x]`) **no** decide el resultado: lo decide el `status`/`substatus` del `story.md`.

## 3. Vía B — inventario de historias

1. Inventario = glob `specs/flow/STORY-*/story.md` ∪ glob `specs/flow/archive/*-STORY-*/story.md`. Si `specs/flow/archive/` no existe, ese origen se omite sin nota.
2. De cada `story.md` leer **solo el frontmatter**: `parent`, `status` y `substatus` (valores escalares). El ID es el `STORY-NNN` del nombre del directorio, tras el prefijo de fecha `<YYYY-MM-DD>-` si está archivada. `Ubicación` = `activa` (en `specs/flow/`) o `archivada` (en `specs/flow/archive/`).
3. **Pertenencia:** la historia declara la épica si el prefijo `EPIC-NN` de su `parent` es igual a `EPIC_ID`. `EPIC-30-ejemplo` y `EPIC-30` cuentan para `EPIC-30`; `EPIC-300-otra` no. Se compara el prefijo para que renombrar el slug de la épica no deje huérfanas a sus historias.
4. Frontmatter ilegible o sin `parent`: si la historia **no** está listada en el índice, se ignora; si **está** listada, se muestra igual (su fila sale del índice).

## 4. Unión y resolución de IDs

- **Unión:** IDs de las líneas F2/F3 ∪ IDs con pertenencia verdadera. `origen` = `índice` (solo Vía A), `parent` (solo Vía B, historia huérfana) o `índice + parent`. Un ID repetido en el índice produce una sola fila.
- **Resolución de un ID listado:** glob `specs/flow/<STORY-NNN>-*/story.md` y `specs/flow/archive/*-<STORY-NNN>-*/story.md` (guion obligatorio tras el ID en ambos). Prioridad: activa antes que archivada y, dentro de cada origen, la primera en orden alfabético; las demás coincidencias se anotan como duplicadas. Sin ninguna coincidencia → `Ubicación: no encontrada`.
- Una historia listada cuyo `parent` apunta a otra épica se muestra igual (la lista el índice); ese defecto lo reporta `/epic-analyze`, no este skill.
- Las líneas F1 no tienen ID que resolver: generan su propia fila `planificada (sin ID)`.
