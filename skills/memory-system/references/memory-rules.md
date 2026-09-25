# Reglas de memoria (memory-system)

Fuente de verdad de las reglas que aplica `scripts/memory-system.js` en los modos `index`
(decisiones D-2, D-3 y D-4 de STORY-095), `scaffold` (D-1, D-2 y D-4 de STORY-096) y `check`
(D-1, D-2 y D-3 de STORY-097, §6 de este documento), más la adaptación por harness y `migrate`
(D-1 a D-5 de STORY-098, §8). `SKILL.md` las aplica a mano cuando `node` no
está en PATH (degradación inline). `check` no define reglas propias de slug, capa ni exclusión:
reutiliza las de §2, y cualquier ajuste se hace aquí una sola vez y lo heredan los tres modos.

**Contenido:** [1. Perfiles de harness](#1-perfiles-de-harness-harness_profiles) ·
[2. Nodo indexable](#2-nodo-indexable) · [3. Formato del índice](#3-formato-del-índice) ·
[4. Resumen](#4-resumen) · [5. Scaffold](#5-scaffold-y-archivos-gestionados) ·
[6. Campos de `check`](#6-campos-obligatorios-de-check-required_fields) ·
[7. Familias de `check`](#7-familias-de-problemas-de-check) ·
[8. Harness](#8-harness-omisión-mapeo-solo-lectura-y-colisiones)

## 1. Perfiles de harness (`HARNESS_PROFILES`)

Precedencia de detección: `--harness` explícito > `sddf.config.yaml` > `.specify/` > `openspec/` >
`generic`. Los marcadores se buscan en `REPO_ROOT` (directorio padre de `SPECS_BASE`). Un valor de
`--harness` fuera de la tabla termina con exit 2:
`valor no admitido para --harness: <v> (admitidos: sddf, speckit, openspec, generic)`.

| Harness | Marcador (`marker`) | Raíces externas indexadas (`externalRoots`, relativas a `REPO_ROOT`) | `skipLayers` | `mappings` |
|---|---|---|---|---|
| `sddf` | `sddf.config.yaml` | — | `[]` | `{}` |
| `speckit` | `.specify/` | `specs/*/spec.md`, `specs/*/plan.md` | `['specs']` | `{ 'constitution.md': '.specify/memory/constitution.md' }` |
| `openspec` | `openspec/` | `openspec/specs/**/spec.md`, `openspec/changes/*/proposal.md` | `['specs']` | `{}` |
| `generic` | ninguno | — | `[]` | `{}` |

Las raíces externas se leen en modo solo lectura: `index` nunca escribe fuera de `SPECS_BASE`.
La semántica de `skipLayers` y `mappings` (STORY-098) está en §8. `skipLayers` admite, además de
las once capas, el valor `constitution.md`: `check` lo consulta también para el archivo raíz, que
no es una capa pero sí una entrada esperada de la memoria (§7).

## 2. Nodo indexable

Un nodo es un archivo `.md` bajo `SPECS_BASE` (más las raíces externas del perfil) que no cae en
las exclusiones. Esquema: `{ path, relPath, layer, slug, title, hasFrontmatter, slugPlaceholder, wikilinks[], declared }`;
`relPath` es relativa a `SPECS_BASE` con `/` (los nodos externos empiezan por `../`) y `declared` es
el frontmatter tal cual lo declara el archivo (`{}` si no hay bloque), que es lo que evalúa `check` (§6).

### Exclusiones

- `index.md` en la raíz de `SPECS_BASE` (es el archivo que se genera).
- Directorios `.cache/`, `templates/` (sus wikilinks son placeholders) y `pre-split/`, a cualquier profundidad.
- Derivados de historia: `design.md`, `tasks.md`, `testcases.md`, `analyze.md`, `*-report.md`,
  `fix-directives.md`, `finvest-evaluation-report.md`, `story-improvement-log.md`.
- Cualquier archivo que no sea `.md`.

### Slug

1. `frontmatter.slug` si existe y no está vacío.
2. Para los nombres canónicos `story.md`, `epic.md`, `project.md`, `spec.md`, `proposal.md`,
   `plan.md`: el nombre del directorio contenedor (`STORY-001-a`, `auth`, `add-login`).
3. Para `README.md`: `<directorio>-index` (`policies-index`, `adr-index`).
4. En cualquier otro caso: el nombre del archivo sin extensión (`sdd`, `ADR-0001-x`).

Un slug declarado con forma de placeholder (`<slug-kebab>`) identifica un template suelto: el nodo
se enlaza solo por ruta con `⚠️ slug placeholder` y sus wikilinks no cuentan como pendientes.

### Título

`frontmatter.title`; si no, el primer encabezado `# `; si no, el nombre del archivo sin extensión.

### Capa

Primer segmento de `relPath` (`adr`, `guides`, `policies`, …). Reglas especiales:

- Archivo en la raíz de `SPECS_BASE` (`constitution.md`) → `root`.
- `specs/01-projects/` → `specs-projects`; `specs/02-epics/` → `specs-epics`;
  `specs/03-stories/` → `specs-stories`; otro subdirectorio `specs/<x>/` → `specs-<x>` (sin
  placeholder en el template: exit 2, a propósito); un archivo suelto directamente en `specs/`
  (su `README.md` semilla) → capa `specs`.
- Nodos de raíces externas → `external`.

### Frontmatter

Parser propio del subconjunto YAML del esquema canónico de `header-aggregation`: escalares,
cadenas entrecomilladas (pueden contener `:`) y listas `- item`. Un archivo sin bloque `---`
inicial, o con `---` sin cierre, se marca `hasFrontmatter=false` y se enlaza solo por ruta.

### Wikilinks

Se extraen del cuerpo, nunca del frontmatter. El orden de los cuatro pasos es normativo
(STORY-097 D-2): `check` los convierte en bloqueantes, así que una variación cambia el veredicto
del gate.

1. **Primero los fences, después el código inline.** Se eliminan del cuerpo los bloques cercados
   ```` ``` ```` y `~~~` (apertura y cierre a principio de línea) y **solo entonces** las
   secuencias de código inline `` `…` ``. El orden importa: limpiar el inline primero rompería un
   fence que contuviera backticks sueltos y dejaría visible su contenido.
2. **Captura y normalización.** Sobre el resto se capturan las ocurrencias de `[[…]]`; de cada
   captura se toma el texto **antes del primer `|`** (alias: `[[slug|Alias]]` → `slug`) y **antes
   del primer `#`** (anchor: `[[slug#seccion]]` → `slug`), recortado por ambos extremos.
3. **Descartes.** Una captura vacía (`[[]]`, `[[ ]]`) o que contenga `<` o `>` se descarta: es un
   placeholder de plantilla (`[[<slug>]]`, `[[<STORY-ID>]]`), no un enlace a un nodo real. Sin esta
   regla cada plantilla suelta produciría un `broken-wikilink` falso.
4. **Nodos no escaneados.** Los nodos de `templates/` y los demás excluidos (§2, *Exclusiones*) no
   se escanean, de modo que sus wikilinks no existen para `index` ni para `check`. Un nodo con
   `slug` placeholder (`<slug-kebab>`) tampoco aporta wikilinks.

Un wikilink cuyo slug no coincide con el de ningún nodo (ni con `index`) es un **nodo pendiente**
para `index` (informativo, no bloquea) y un problema `broken-wikilink` para `check` (bloquea, una
ocurrencia = un problema).

## 3. Formato del índice

El motor lee `assets/index-template.md` en runtime y sustituye:

| Placeholder | Sustitución |
|---|---|
| `{layer:<capa>}` | Entradas de esa capa ordenadas por `relPath` (comparación ordinal, mismo orden en todos los SO); capa vacía → `_(sin artefactos)_`, o `_(gestionado por el harness)_` si el perfil la omite (`skipLayers`, también su desglose `specs-*`) |
| `{layer:external}` | Un subtítulo `### <grupo>` por `externalGroup` (§8) con sus entradas; sin nodos externos → `_(sin artefactos externos)_` |
| `{stats}` | Filas de la tabla "Estado del grafo": nodos indexados, con frontmatter, sin frontmatter, wikilinks pendientes |
| `{date}` | Fecha de ejecución `YYYY-MM-DD` (solo en `updated:` del frontmatter: es lo único que cambia entre dos ejecuciones) |

Formato de entrada:

```
- [[<slug>]] — [<archivo>](<ruta relativa a SPECS_BASE>) — <título>
- [<archivo>](<ruta>) — <título> ⚠️ sin frontmatter          (nodo sin frontmatter)
- [<archivo>](<ruta>) — <título> ⚠️ slug placeholder        (slug con forma <placeholder>)
```

Si hay nodos pendientes, el índice termina con la sección `## ⚠️ Nodos pendientes` y una línea
`- [[slug]] ⚠️ nodo pendiente` por cada uno (ordenados). No bloquea la generación.
`scripts/check-doc-links.js` del framework ignora los wikilinks marcados así.

Protección del template (exit 2 sin escribir): un `{layer:<capa>}` que no sea una capa conocida
(`root`, `product`, `requirements`, `specs`, `specs-projects`, `specs-epics`, `specs-stories`, `domains`,
`architecture`, `adr`, `policies`, `guardrails`, `guides`, `runbooks`, `external`) ni una capa con
nodos, o una capa con nodos sin placeholder. El mensaje nombra la capa.

Frontmatter del índice: `type: wiki`, `slug: index`, `title`, `status`, `substatus`, `parent`,
`updated: {date}`.

## 4. Resumen

Última línea de la salida del motor (también en `--dry-run`, tras imprimir el índice):

```
nodos indexados: N · sin frontmatter: M · nodos pendientes: K
```

## 5. Scaffold y archivos gestionados

`scaffold` copia el árbol semilla `assets/scaffold/` (espejo del destino) sobre `SPECS_BASE` y
después aplica la tabla de plantillas compartidas. Las once capas son el mismo catálogo `LAYERS`
del índice: `product`, `requirements`, `specs`, `domains`, `architecture`, `adr`, `policies`,
`guardrails`, `guides`, `runbooks`, `templates`.

### Archivos gestionados

Esta lista define lo que `scaffold` crea si falta y **lo único** que `rebuild --force`
(`scaffold --force`) sobrescribe. Todo lo demás son artefactos de autor y ningún modo los toca.

| Archivo (relativo a `SPECS_BASE`) | Origen | `type` / `slug` |
|---|---|---|
| `constitution.md` | semilla | `constitution` / `constitution` |
| `product/README.md` | semilla | `wiki` / `product-index` |
| `product/vision.md`, `product/stakeholders.md`, `product/objectives.md` | semilla | `product` / `vision`, `stakeholders`, `objectives` |
| `requirements/README.md`, `specs/README.md`, `domains/README.md`, `architecture/README.md`, `adr/README.md`, `policies/README.md`, `guardrails/README.md`, `guides/README.md`, `runbooks/README.md`, `templates/README.md` | semilla | `wiki` / `<capa>-index` |
| `specs/01-projects/.gitkeep`, `specs/02-epics/.gitkeep`, `specs/03-stories/.gitkeep` | semilla | solo si el directorio no existe; nunca se listan ni se sobrescriben si ya existe |
| `templates/adr-template.md` | semilla (contenido de `docs/adr/adr-template.md` del framework) | template |
| `templates/domain-template.md` | semilla (autoría manual, sin skill dueño; ADR-0012) | template |
| `templates/guardrail-template.md` | semilla (autoría manual, sin skill dueño; ADR-0012) | template |
| `templates/policy-template.md` | semilla (autoría manual, sin skill dueño; ADR-0012) | template |
| `templates/story-template.md` | `<CLI_ROOT>/skills/story-creation/assets/` | template |
| `templates/epic-template.md` | `<CLI_ROOT>/skills/epic-creation/assets/` | template |
| `templates/project-template.md` | `<CLI_ROOT>/skills/project-discovery/assets/` | template |
| `templates/project-intent-template.md` | `<CLI_ROOT>/skills/project-begin/assets/` | template |
| `templates/project-plan-template.md` | `<CLI_ROOT>/skills/project-planning/assets/` | template |

### Reglas

- **Copia-si-falta:** destino ausente → `[CREADO]`; presente → `[PRESERVADO]`, sin comparar
  contenido. Con `--force` un destino presente → `[SOBRESCRITO]`. Con `--dry-run` se imprime el
  plan (`[CREARÍA]`, `[PRESERVARÍA]`, `[SOBRESCRIBIRÍA]`) y no se escribe nada.
- **Nunca se elimina nada**, ni archivos ni directorios, en ningún modo.
- **`{date}`** es el único placeholder de las semillas: se sustituye por la fecha de ejecución
  (`YYYY-MM-DD`, o `--date`) en `created`/`updated` al copiar. Las plantillas compartidas se
  copian byte a byte, sin sustituciones.
- **Frontmatter de las semillas:** esquema canónico de `header-aggregation` (`type`, `slug`,
  `title`, `status`, `substatus`, `parent`, `created`, `updated`); el slug de un `README.md` de
  capa es `<capa>-index`, coherente con la regla de slug de §2. Las semillas solo enlazan a
  `[[index]]` para no generar nodos pendientes recién scaffoldeadas; no declaran `escritor:`
  (son documentos iniciales, no plantillas de generación).
- **`escritor:` en `templates/adr-template.md`:** la excepción a la regla anterior. Es la única
  semilla que sí es plantilla de generación, así que el principio 13 de la constitución le exige
  declarar escritor en cada campo. Ningún skill escribe ADRs, de modo que todos los campos se
  anotan `escritor: autoría manual` (ADR-0012). La anotación va en **comentario de línea
  completa** encima del campo, nunca al final de su línea: `parseFrontmatter` ignora las líneas
  que empiezan por `#` pero incorporaría un comentario final al valor, contaminando `title` en el
  índice del proyecto scaffoldeado. La semilla y `docs/adr/adr-template.md` del framework se
  mantienen byte a byte idénticas.
- **Dueño ausente:** si `--cli-root` no se pasa o `<CLI_ROOT>/skills/<dueño>/assets/<nombre>` no
  existe, el motor emite `[WARNING] template no copiado: <nombre> (skill <dueño> no instalado)`,
  no crea ese archivo y termina con exit 0 (misma regla que `sddf-init` Paso 2b; ADR-0007, que
  conserva la regla de ADR-0001: un dueño por template compartido, sin copias en
  `assets/scaffold/`. Las cuatro plantillas de autoría manual —`adr`, `domain`, `guardrail`,
  `policy`— no tienen dueño y por eso viven en la semilla, conforme a ADR-0012).
- **Directorios:** se crean los intermedios que hagan falta y los once de capa aunque el harness
  omita sus semillas. Raíz ausente con padre existente → se crea (bootstrap); sin padre → exit 2.
  `assets/scaffold/` ausente → exit 2 nombrando la ruta.
- **Harness:** una capa de `skipLayers` se informa con una sola línea
  `[OMITIDO] <capa>/ — gestionado por el harness <h>` (cuenta 1 en `omitidos por harness`) y no se
  crea ni su directorio ni sus semillas; una semilla de `mappings` cuyo equivalente existe se
  informa `[MAPEADO] <semilla> → <ruta del harness>` y no se crea (§8). Con `--dry-run`:
  `[OMITIRÍA]` y `[MAPEARÍA]`.

### Resumen

Última línea de `scaffold`:

```
creados: N · sobrescritos: S · preservados: M · mapeados: X · omitidos por harness: K
```

`ensure` la combina con el índice en `creados: N · preservados: M · índice regenerado: sí|no`;
`rebuild --force` en `creados: N · sobrescritos: S · índice regenerado: sí`.

## 6. Campos obligatorios de `check` (`REQUIRED_FIELDS`)

`check` no valida el esquema canónico completo de `header-aggregation`, sino un subconjunto
declarado en `REQUIRED_FIELDS` del motor (STORY-097 D-3):

```js
const REQUIRED_FIELDS = { all: ['type', 'slug', 'title'], specs: ['id', 'status'] };
```

| Conjunto | Campos | A qué nodos se exige |
|---|---|---|
| `all` | `type`, `slug`, `title` | A todo nodo indexable con frontmatter. |
| `specs` | `id`, `status` | Además de `all`, a los nodos cuyo `type` declarado es `project`, `epic` o `story`. |

Reglas de evaluación:

- Se mira el frontmatter **declarado**, no el derivado. Un artefacto cuyo `slug` deduce el motor
  del nombre del archivo (§2, regla de slug) sigue siendo `invalid-frontmatter` si no lo declara:
  el derivado sirve para enlazar, no para certificar trazabilidad.
- Un campo presente pero vacío (`title:` o `title: "   "`) cuenta como ausente.
- **Un problema por campo ausente**, con `detail: "falta <campo>"`. Un nodo al que le faltan `slug`
  y `title` produce dos problemas.
- Un nodo sin bloque de frontmatter no se evalúa aquí: ya es `orphan`, y reportarlo dos veces
  duplicaría el mismo defecto.

### Por qué no se exigen `date`, `created`, `updated`, `substatus` ni `parent`

- `date` **no existe** en el esquema canónico de `header-aggregation`, que usa `created` y
  `updated`. Exigirlo contradiría al skill dueño del esquema (el invariante 2 de
  `docs/architecture/memory-system.md` lo pedía por error; CR-001 de STORY-097 lo corrige).
- `created` y `updated` los **deriva** `header-aggregation` en el momento de escribir: son
  metadatos de mantenimiento, no trazabilidad. Un artefacto correcto escrito a mano no los tiene,
  y un `check` que los exigiera obligaría a pasar `ensure --fix-frontmatter` antes de cada gate.
- `substatus` y `parent` solo tienen sentido en artefactos dentro de un flujo (una historia dentro
  de una épica). Guías, ADRs, runbooks y policies no tienen padre ni subestado.
- `id` solo aplica a specs: un `guides/sdd.md` no tiene identificador de backlog.

El criterio es el mismo en los cuatro casos: `check` es un gate de CI, y un gate que marca en rojo
decenas de artefactos legítimos se desactiva el primer día. Los campos exigidos son los que hacen
que un nodo sea **localizable** (`slug`), **clasificable** (`type`), **legible** (`title`) y, en
specs, **trazable** (`id`, `status`). El esquema completo sigue siendo el de `header-aggregation`;
ampliar `REQUIRED_FIELDS` es una decisión de esta tabla, no del código.

## 7. Familias de problemas de `check`

| Familia (`kind`) | Regla | `detail` |
|---|---|---|
| `missing-layer` | Una de las once capas de §5 no existe como directorio de la raíz, o falta `constitution.md`, y el perfil del harness no la omite (`skipLayers`, §1) ni, para `constitution.md`, la mapea a un equivalente existente (`mappings`, §8). | `capa ausente` |
| `orphan` | Nodo indexable con `hasFrontmatter=false` (§2, *Frontmatter*). | `sin frontmatter` |
| `invalid-frontmatter` | Campo de `REQUIRED_FIELDS` ausente del frontmatter declarado (§6). | `falta <campo>` |
| `broken-wikilink` | Ocurrencia de `[[slug]]` cuyo slug no está en el conjunto de slugs derivados (§2, incluidas las raíces externas del perfil). | `[[slug]] no resuelve` |
| `dod-guardrail` | DoD de historia por etapa: reglas R1–R7 de `references/dod-rules.md` §4 (solo si el proyecto tiene DoD). | según la regla |

`path` es `<capa>/` para `missing-layer` —excepto `constitution.md`, que se reporta tal cual, sin
barra final, por ser un archivo y no un directorio— y la `relPath` del nodo en las demás familias,
siempre relativa a `SPECS_BASE` y con `/`. Los problemas se ordenan por `(kind, path, detail)` con
comparación ordinal; el informe textual los agrupa en el orden de la tabla. `check` no escribe
nada: ni `index.md`, ni frontmatter, ni directorios.

Los nodos externos (capa `external`, §8) solo cuentan como **destino** de wikilinks: `orphan`,
`invalid-frontmatter` y `broken-wikilink` no los evalúan, porque son artefactos del harness que
`memory-system` no puede corregir y siguen las convenciones de su propio harness.

### Resumen

Última línea de `check` (texto):

```
problemas: N (missing-layer n · orphan n · invalid-frontmatter n · broken-wikilink n · dod-guardrail n)
```

Solo aparecen entre paréntesis las familias con al menos un problema; sin problemas la línea es
`problemas: 0`. Con `--json`, el mismo resultado es
`{ harness, root, ok, summary, problems }` y stdout no lleva nada más. Exit 0 sin problemas, 1 con
al menos uno, 2 ante error técnico: raíz inexistente, `--harness` no admitido, Node < 18, argumentos
mal formados y **cualquier error inesperado durante el chequeo** (CR-008). En `check` el 1 significa
exclusivamente "memoria con problemas", que es lo que hace el gate legible en CI. Con `--json`,
todo exit 2 deja `{ "ok": false, "error": "…" }` en stdout, incluidos los errores de parseo de
argumentos, que se detectan antes de entrar al subcomando.

## 8. Harness: omisión, mapeo, solo lectura y colisiones

Reglas de STORY-098 para adoptar la memoria SDDF en un proyecto Speckit u OpenSpec. Los perfiles
son datos (§1): actualizar un layout de harness es editar una fila, no el código.

| Clave | Semántica |
|---|---|
| `skipLayers` | Capas que el harness ya modela. `scaffold` no crea su directorio ni sus semillas y lo informa con una sola línea `[OMITIDO] <capa>/ — gestionado por el harness <h>`; `check` no las reporta como `missing-layer`; el índice las muestra como `_(gestionado por el harness)_`. |
| `mappings` | Semilla (relativa a `SPECS_BASE`) → equivalente del harness (relativo a `REPO_ROOT`). Si el equivalente **existe**, `scaffold` no crea la semilla (`[MAPEADO] <semilla> → <ruta>`), `check` no la exige y `index` enlaza el equivalente como nodo externo con el slug de la semilla (`[[constitution]]`). Si no existe, se crea la semilla como siempre. |
| `externalRoots` | Patrones que `index` escanea en solo lectura (`*` = un segmento, `**` = cero o más). |

- **Solo lectura:** `openspec/`, `.specify/` y `specs/` del harness nunca reciben un destino de
  escritura. El motor valida **todo el plan** de `scaffold` (semillas, plantillas compartidas y
  claves de `mappings`) y el `index.md` de `index` contra `SPECS_BASE` antes de escribir: un
  destino fuera de la raíz termina con exit 2 y `destino fuera de la raíz: <ruta>`, sin haber
  escrito nada (ni siquiera la raíz del bootstrap).
- **Grupos del índice (`externalGroup`):** cada nodo externo se anota con el grupo del patrón que
  lo originó y se lista bajo su subtítulo, en este orden: `openspec-specs` → `### OpenSpec — specs`,
  `openspec-changes` → `### OpenSpec — changes`, `speckit-features` → `### Speckit — features`,
  `mapped` → `### Mapeados desde el harness`. Las rutas son relativas a `SPECS_BASE` (`../…`).
- **Colisión de slug (CR-002):** si el slug de un nodo externo coincide con el de un nodo de
  `SPECS_BASE`, gana el de `SPECS_BASE`; el externo se indexa como `[[<slug>-external]]` y `index`
  emite por stderr `⚠️ colisión de slug: <slug> — …`, sin cambiar el exit code.
- **`migrate`:** es `scaffold --dry-run` (plan) → confirmación → `scaffold`, siempre con el perfil
  del harness. No transforma ni mueve artefactos y no invoca `index`. En un proyecto `sddf`
  informa `El proyecto ya es SDDF` y remite a `ensure`.
