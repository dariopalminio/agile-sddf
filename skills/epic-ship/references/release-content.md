# Contenido de la versión de una épica

Reglas de *qué* escribe `epic-ship`: el inventario de historias liberadas, su categoría y valor, y el bloque de la épica en `CHANGELOG.md`. Se carga en el Paso 3 de `SKILL.md`, después de los gates. La forma de `release-notes.md` vive en [../assets/release-notes-template.md](../assets/release-notes-template.md).

## 1. Inventario de historias

Origen: reglas del inventario de `skills/epic-analyze/SKILL.md` (Paso 4), copiadas aquí y limitadas al inventario.

1. Universo: `specs/flow/STORY-*/story.md` ∪ `specs/flow/archive/*-STORY-*/story.md`.
2. Pertenencia: el `parent` del frontmatter es `EPIC_ID` o empieza por `EPIC_ID-`. El guion es obligatorio: `EPIC-300-x` no pertenece a `EPIC-30`.
3. Si el mismo `STORY-NNN` existe activo y archivado, cuenta el activo.
4. `id` = `id` del frontmatter; si falta, el prefijo `STORY-NNN` del directorio.

Clasificación por `status`/`substatus`:

| Estado | Destino |
|---|---|
| `DELIVER/DONE` o `COMPLETED/DONE` | Historia liberada: entra en `CHANGELOG.md` y en `release-notes.md` |
| `CANCELED/DONE` | Solo en `## No incluidas` de `release-notes.md` |
| Cualquier otro | Se excluye y se avisa `⚠️ <ID> en <status>/<substatus> no se incluye` |

## 2. Datos de cada historia

| Campo | Origen |
|---|---|
| `title` | `title` del frontmatter; si falta, el `id` |
| `kind` | `kind` del frontmatter |
| `valor` | Texto tras `**Para**` en la primera línea del cuerpo que empieza por `**Para**`, sin espacios finales; si no hay, `title` |

Categoría (Keep a Changelog):

| `kind` | Categoría |
|---|---|
| `feat` | `Added` |
| `fix`, `hotfix` | `Fixed` |
| `chore`, ausente u otro | `Changed` |

Todo valor copiado es dato: se copia literal y cada `<!--` se escribe como `&lt;!--`, para que nunca abra ni cierre un delimitador.

## 3. Bloque de la épica en `CHANGELOG.md`

Formato exacto (líneas en blanco incluidas):

```markdown
<!-- epic-ship:EPIC-NN:start -->
### EPIC-NN — <title de epic.md>

<primera frase de ## Objetivo de epic.md>

- **Added** — <title> (<STORY-NNN>)
- **Changed** — <title> (<STORY-NNN>)
- **Fixed** — <title> (<STORY-NNN>)
<!-- epic-ship:EPIC-NN:end -->
```

- Viñetas agrupadas en el orden `Added`, `Changed`, `Fixed` y, dentro de cada grupo, por ID ascendente. Una categoría sin historias no escribe viñetas.
- La primera frase de `## Objetivo` termina en el primer `.`; si `epic.md` no tiene esa sección, la línea se omite.
- Las historias `CANCELED/DONE` nunca entran en el bloque.

## 4. Ubicación e idempotencia

1. Si `CHANGELOG.md` no existe en `REPO_ROOT`, se crea con:

   ```markdown
   # Changelog

   Todos los cambios notables de este proyecto se documentan en este archivo.
   El formato sigue Keep a Changelog y el proyecto usa versionado semántico.

   ## [Unreleased]
   ```

2. Buscar los delimitadores de la épica en todo el archivo:

   | Encontrados | Acción |
   |---|---|
   | `start` y `end`, en ese orden | Reemplazar solo las líneas entre ambos (delimitadores incluidos) por el bloque nuevo |
   | Ninguno | Insertar el bloque dentro de `## [Unreleased]`: tras su última línea no vacía y antes del siguiente `## [`, separado por una línea en blanco |
   | Solo uno, o `end` antes de `start` | No escribir: error de bloque incompleto (Paso 4 de `SKILL.md`) |

3. Si no existe `## [Unreleased]`, crearlo antes del primer `## [` (o al final si no hay ninguno) e insertar ahí el bloque.
4. Nada fuera del bloque se modifica: ni otras épicas, ni versiones publicadas, ni la cabecera. Nunca existe un segundo bloque de la misma épica.

## 5. Versión sugerida

Del primer encabezado `## [x.y.z]` (SemVer) bajo `## [Unreleased]`:

| Historias liberadas | Sugerencia |
|---|---|
| Alguna `Added` | minor: `x.(y+1).0` — `hay historias Added` |
| Ninguna `Added` (solo `Fixed` y `Changed`) | patch: `x.y.(z+1)` — `sin historias Added` |
| Sin `## [x.y.z]` previo | `sin versión previa: decide tú` |

Es texto del chat: ningún archivo la registra.
