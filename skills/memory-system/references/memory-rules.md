# Reglas de memoria (memory-system)

Fuente de verdad de las reglas que aplica `scripts/memory-system.js` en el modo `index`
(decisiones D-2, D-3 y D-4 de STORY-095). `SKILL.md` las aplica a mano cuando `node` no está
en PATH (degradación inline) y STORY-097 (`check`) las reutiliza sin duplicarlas.

## 1. Perfiles de harness (`HARNESS_PROFILES`)

Precedencia de detección: `--harness` explícito > `sddf.config.yaml` > `.specify/` > `openspec/` >
`generic`. Los marcadores se buscan en `REPO_ROOT` (directorio padre de `SPECS_BASE`). Un valor de
`--harness` fuera de la tabla termina con exit 2:
`valor no admitido para --harness: <v> (admitidos: sddf, speckit, openspec, generic)`.

| Harness | Marcador (`marker`) | Raíces externas indexadas (`externalRoots`, relativas a `REPO_ROOT`) | `skipLayers` | `mappings` |
|---|---|---|---|---|
| `sddf` | `sddf.config.yaml` | — | `[]` | `{}` |
| `speckit` | `.specify/` | `specs/*/spec.md`, `specs/*/plan.md` | `[]` | `{}` |
| `openspec` | `openspec/` | `openspec/specs/**/spec.md`, `openspec/changes/*/proposal.md` | `[]` | `{}` |
| `generic` | ninguno | — | `[]` | `{}` |

Las raíces externas se leen en modo solo lectura: `index` nunca escribe fuera de `SPECS_BASE`.
`skipLayers` y `mappings` están reservadas para STORY-098 (adaptación del scaffolding por harness).

## 2. Nodo indexable

Un nodo es un archivo `.md` bajo `SPECS_BASE` (más las raíces externas del perfil) que no cae en
las exclusiones. Esquema: `{ path, relPath, layer, slug, title, hasFrontmatter, wikilinks[] }`;
`relPath` es relativa a `SPECS_BASE` con `/` (los nodos externos empiezan por `../`).

### Exclusiones

- `index.md` en la raíz de `SPECS_BASE` (es el archivo que se genera).
- Directorios `specs/.cache/`, `templates/` (sus wikilinks son placeholders) y cualquier `pre-split/`.
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
  `specs/03-stories/` → `specs-stories`; otro subdirectorio `specs/<x>/` → `specs-<x>`; un archivo
  suelto directamente en `specs/` → capa `specs` (sin placeholder en el template: exit 2, a propósito).
- Nodos de raíces externas → `external`.

### Frontmatter

Parser propio del subconjunto YAML del esquema canónico de `header-aggregation`: escalares,
cadenas entrecomilladas (pueden contener `:`) y listas `- item`. Un archivo sin bloque `---`
inicial, o con `---` sin cierre, se marca `hasFrontmatter=false` y se enlaza solo por ruta.

### Wikilinks

Se extraen del cuerpo (no del frontmatter) ignorando bloques de código, código inline, el alias
(`[[slug|Alias]]` → `slug`) y el anchor (`[[slug#seccion]]` → `slug`). Un wikilink cuyo slug no
coincide con el de ningún nodo (ni con `index`) es un **nodo pendiente**.

## 3. Formato del índice

El motor lee `assets/index-template.md` en runtime y sustituye:

| Placeholder | Sustitución |
|---|---|
| `{layer:<capa>}` | Entradas de esa capa ordenadas por `relPath` (comparación ordinal, mismo orden en todos los SO); capa vacía → `_(sin artefactos)_` |
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
(`root`, `product`, `requirements`, `specs-projects`, `specs-epics`, `specs-stories`, `domains`,
`architecture`, `adr`, `policies`, `guardrails`, `guides`, `runbooks`, `external`) ni una capa con
nodos, o una capa con nodos sin placeholder. El mensaje nombra la capa.

Frontmatter del índice: `type: wiki`, `slug: index`, `title`, `status`, `substatus`, `parent`,
`updated: {date}`.

## 4. Resumen

Última línea de la salida del motor (también en `--dry-run`, tras imprimir el índice):

```
nodos indexados: N · sin frontmatter: M · nodos pendientes: K
```
