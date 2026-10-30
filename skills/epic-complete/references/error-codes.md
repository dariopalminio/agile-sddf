# Códigos de error de `epic-complete`

Se carga solo cuando el motor devuelve `ok: false` o termina con exit `2`. El `message` del JSON ya trae el detalle; esta tabla dice qué quedó en el repositorio y qué hacer.

| Código | Cuándo | Mensaje (contenido) | Estado resultante |
|---|---|---|---|
| `NOT_FOUND` | ningún `specs/flow/EPIC-NN-*/` (o `--path` inexistente) | la ruta buscada; si existe en el archivo, «ya archivada en <ruta>» | sin cambios |
| `AMBIGUOUS` | más de un `specs/flow/EPIC-NN-*/` | las rutas coincidentes | sin cambios; deja uno solo o usa la ruta explícita |
| `INVALID_PATH` | `--path` fuera de `specs/flow/EPIC-NN-<slug>/` (incluido `specs/flow/archive/…`) | la forma esperada | sin cambios |
| `NO_EPIC_FILE` | el directorio no tiene `epic.md` | la ruta | sin cambios |
| `NO_STATUS` | frontmatter sin `status`/`substatus` | los campos buscados | sin cambios |
| `NOT_SHIPPED` | estado distinto de `SHIP/DONE`, `COMPLETED/DONE` y `CANCELED/*` | `La épica EPIC-NN está en <status>/<substatus>: solo se completan épicas en SHIP/DONE, COMPLETED/DONE o CANCELED/DONE.`; con `VALIDATE/DONE` añade `Ejecuta antes /epic-ship EPIC-NN` | sin cambios |
| `CANCELED_NOT_DONE` | `status: CANCELED` con substatus distinto de `DONE` | `La épica EPIC-NN no puede archivarse: estado actual CANCELED/<substatus>. Solo se archivan las épicas canceladas con substatus DONE.`; sin sugerencia de otro comando | sin cambios |
| `NO_VERSION` | `SHIP/DONE` sin `--version` y sin versión en `CHANGELOG.md` | el motivo (`reason`): `unreleased` (la entrada sigue en `[Unreleased]`: promuévela a `## [x.y.z]`), `no-block` o `no-changelog` (no se encontró la entrada en `CHANGELOG.md`); pide reejecutar con `--version x.y.z` | sin cambios |
| `NO_ARCHIVE_DATE` | `COMPLETED/DONE` o `CANCELED/DONE` sin fecha de archivo válida | los campos buscados (`updated:`, `created:`, `date:`) | sin cambios |
| `ARCHIVE_CONFLICT` | el destino ya existe | la ruta en conflicto | sin cambios |
| `WRITE_FAILED` | error de E/S al escribir `epic.md` | la ruta y el error | nada movido |
| `MOVE_FAILED` | `git mv` o el renombre fallan | el error; `epic.md` restaurado | sin cambios |
| `ROLLBACK_FAILED` | falla el movimiento y también la restauración | `git checkout -- <ruta>/epic.md` para recuperar | `epic.md` en `COMPLETED` dentro de `specs/flow/`: recupéralo con el comando |
| `COUNT_MISMATCH` | activas + archivadas cambió tras mover | ambas cifras y las rutas | directorio movido; revisar a mano |
| exit `2` | argumentos inválidos (subcomando, `--id`, `--version` mal formados, flags desconocidos) | el error de uso en stderr | sin cambios |
| motor o `node` ausentes | Paso 2 del skill | `❌ No se encontró el motor de epic-complete (<ruta probada>) o node no está en PATH` | sin cambios |
