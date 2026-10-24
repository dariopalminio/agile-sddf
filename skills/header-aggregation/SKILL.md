---
name: header-aggregation
description: >-
  Añade o actualiza frontmatter YAML estandarizado en archivos Markdown de spec, individual o en batch.
  Usar para estandarizar metadatos de trazabilidad o preparar archivos para el patrón LLM Wiki.
  Invocar para "header-aggregation", "frontmatter", "añadir frontmatter",
  "estandarizar metadatos" o "slug/type/status de forma masiva".
---

# Skill: /header-aggregation

Aplica frontmatter YAML a archivos Markdown de especificación. El esquema se deriva de la ruta relativa a `REPO_ROOT`, para que las capas de producto y requisitos mantengan sus contratos propios sin campos de work item ajenos.

## Esquema canónico de frontmatter

Los campos se omiten cuando no aplican al tipo.

```yaml
---
alwaysApply: false                         # solo story, epic y wiki
type: <epic | story | product | requirement | srs | wiki>
id: <EPIC-NN | STORY-NNN | FR-NNN | NFR-NNN>
kind: <feat | fix | chore | hotfix | functional | non-functional>
slug: <nombre-kebab>
title: "<Título legible del documento>"
status: <valor según tipo>
substatus: <null | TODO | IN-PROGRESS | DONE | BLOCKED>
parent: <null | EPIC-NN>
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
related: []
---
```

| `type` | Campos obligatorios | Valores derivados si faltan |
|---|---|---|
| `story`, `epic`, `wiki` | esquema histórico aplicable | sin cambios; `parent` de epic es `null` |
| `product` | `type`, `slug`, `title`, `status`, `substatus`, `parent`, `created`, `updated` | `IN-PROGRESS`, `TODO`, `null` |
| `requirement` | `type`, `kind`, `id`, `slug`, `title`, `status`, `created`, `updated`, `related` | `active`, `[]` |
| `srs` | `type`, `slug`, `title`, `status`, `substatus`, `parent`, `created`, `updated` | `IN-PROGRESS`, `IN-PROGRESS`, `null` |

## Paso 0 — Resolver contexto local

<!-- SDDF-FIXED-LAYOUT: v1 -->

Resuelve `REPO_ROOT` (raíz del repositorio) y usa rutas fijas relativas a él:
work items en `specs/flow/`, templates en `docs/templates/` y DoD en `docs/guardrails/`.
El layout no es configurable (ADR-0016).

El diagnóstico de entorno se solicita explícitamente con `/skill-preflight`; este workflow no lo invoca en su hot path.

## Paso 1 — Resolver el input

El skill acepta una ruta relativa o absoluta, un nombre corto o ningún argumento.

Para un nombre corto, busca en este orden:

- `specs/flow/STORY-*/story.md`
- `specs/flow/EPIC-*/epic.md`
- `docs/product/<término>.md`
- `docs/requirements/**/<término>*.md`

Por ejemplo, `vision` resuelve la visión de producto. Un resultado único se usa directamente; resultados múltiples se presentan para elegir. Si no hay resultado, trata el input como texto libre e informa al usuario.

Una ruta de directorio activa el modo batch. Sin input, pregunta si se procesará un archivo individual o todos los archivos de un directorio.

## Paso 2 — Derivar campos

La primera coincidencia de esta tabla decide `type`, `id`, `kind` y `slug` a partir de la ruta relativa a `REPO_ROOT`:

| Ruta | `type` | `id` / `kind` | `slug` |
|---|---|---|---|
| `docs/product/README.md`, `docs/requirements/README.md` | `wiki` | — | `<capa>-index` |
| `docs/product/<nombre>.md` | `product` | — | `<nombre>` |
| `docs/requirements/functional/FR-NNN-*.md` | `requirement` | `FR-NNN` / `functional` | nombre sin extensión |
| `docs/requirements/non-functional/NFR-NNN-*.md` | `requirement` | `NFR-NNN` / `non-functional` | nombre sin extensión |
| `docs/requirements/srs-*.md` | `srs` | — | nombre sin extensión |
| otro archivo bajo `docs/requirements/` | `wiki` | — | nombre sin extensión |
| directorio `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>` | `story` | `STORY-NNN` / `feat` si falta | nombre del directorio sin el prefijo de fecha |
| directorio `specs/flow/STORY-*` | `story` | `STORY-NNN` / `feat` si falta | nombre del directorio |
| directorio `specs/flow/EPIC-*` | `epic` | `EPIC-NN` | nombre del directorio |
| resto | `wiki` | — | regla histórica |

Reglas complementarias:

- `title` usa el primer heading `#`; para `requirement`, quita el prefijo `<ID> — `.
- `created` preserva `created` o `date`; si no existe, usa la fecha actual. `updated` usa la fecha actual al actualizar.
- Los campos existentes se preservan. Solo se proponen los obligatorios que falten para el tipo derivado.
- `related` conserva las referencias existentes; para un requisito nuevo se deriva como `[]`.
- El bloque de referencias de wikilinks se añade solo cuando `related` contiene valores.

Muestra los valores derivados antes de escribir y permite correcciones.

## Paso 3 — Archivo individual

Un archivo tiene frontmatter si inicia exactamente con `---` en la primera línea.

### Sin frontmatter

1. Deriva los campos del Paso 2 y valida las referencias del Paso 5.
2. Antepone el bloque YAML sin alterar el contenido posterior.
3. Escribe el archivo y muestra el resumen de salida.

### Con frontmatter

1. Preserva todos los campos existentes.
2. Construye una propuesta con solo los obligatorios ausentes del tipo derivado.
3. Muestra `Campos añadidos:` y `Campos existentes:`.
4. Ofrece `Sobrescribir con propuesta`, `Mantener el existente` o `Cancelar`.
5. Solo escribe si se elige `Sobrescribir con propuesta`.

## Paso 4 — Modo batch

### 4.1 Conjunto de archivos

El conjunto depende del directorio recibido:

| Input | Archivos escaneados |
|---|---|
| `REPO_ROOT` (o `.`) | `docs/product/**/*.md`, `docs/requirements/**/*.md` (incluidos `functional/` y `non-functional/`), `specs/flow/EPIC-*/epic.md` y `specs/flow/STORY-*/story.md` |
| `docs/` | solo `docs/product/**/*.md` y `docs/requirements/**/*.md` |
| `specs/flow/` | solo los canónicos `specs/flow/EPIC-*/epic.md` y `specs/flow/STORY-*/story.md` |
| otro subdirectorio | los Markdown de ese directorio |

Para `product/` y `requirements/`, procesa los Markdown recursivamente. Para las épicas y las historias, conserva el escaneo de archivos canónicos por subdirectorio. `specs/flow/archive/` solo se procesa si se recibe de forma explícita como subdirectorio.

### 4.2 Clasificación y confirmación

1. Clasifica los archivos en sin frontmatter y con frontmatter existente.
2. Muestra el resumen anticipado con la ruta de cada archivo:

   ```text
   Archivos a modificar (sin frontmatter): <n>
     - <ruta>
   Archivos con conflicto (frontmatter existente): <m>
     - <ruta>
   ```

   Omite la lista de un grupo vacío y conserva su línea con el contador en `0`.
3. Para conflictos, ofrece `Proponer merge en todos`, `Saltar todos los conflictos` o `Decidir uno por uno`.
4. Pregunta `¿Confirmas el procesamiento de N archivos?`, donde `N` cuenta solo los archivos que se procesarán con la estrategia elegida (los conflictos saltados no cuentan).
5. Procesa en secuencia y muestra el resumen final.

## Paso 5 — Validar referencias cruzadas

Para cada valor de `related` o `parent`, busca el slug en los Markdown del repositorio. Si no existe, guárdalo como `[pendiente] <slug>`, informa el aviso y continúa; una referencia pendiente no cancela la operación.

## Resumen de salida

Al terminar, muestra:

```text
✓ Frontmatter aplicado: <ruta-del-archivo>
  type:    <type derivado>
  id:      <id si aplica>
  slug:    <slug>
  title:   "<título>"
  status:  <status>
  created: <fecha>
  updated: <fecha>

⚠ Referencias marcadas como [pendiente]: <n>
```

En batch añade los contadores de procesados, saltados y errores.
