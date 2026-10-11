---
alwaysApply: false
type: design
id: STORY-118
slug: STORY-118-requirements-srs-unico-primero-design
title: "Design: Adoptar la estrategia 'SRS único primero, fragmentación cuando duela' en requirements/"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-21-colapsar-specs-dos-niveles
story: STORY-118
created: 2026-10-08
updated: 2026-10-08
related:
  - STORY-118-requirements-srs-unico-primero
  - memory-system
  - domain-knowledge-artifacts
  - STORY-105-migrar-stakeholders-y-requisitos
  - STORY-110-discovery-escribe-stakeholders-y-requisitos
  - STORY-114-migrate-specs-3-levels
  - STORY-115-scaffold-dos-niveles-y-capas-destino
---

<!-- Referencias -->
[[STORY-118-requirements-srs-unico-primero]] · [[memory-system]] · [[domain-knowledge-artifacts]] · [[STORY-105-migrar-stakeholders-y-requisitos]] · [[STORY-110-discovery-escribe-stakeholders-y-requisitos]] · [[STORY-114-migrate-specs-3-levels]] · [[STORY-115-scaffold-dos-niveles-y-capas-destino]]

# Diseño técnico: estrategia "SRS único primero" en `requirements/`

## Context

La historia pide dos disposiciones físicas para el mismo contenido lógico de `requirements/`: un **SRS único** (`srs-<project-slug>.md`,
por defecto) y una **disposición fragmentada** (`functional/FR-NNN-<slug>.md` + `non-functional/NFR-NNN-<slug>.md`). Además pide un
resolver que encuentre un requisito por su ID en cualquiera de las dos, migraciones en ambos sentidos y un `check` que valide ambas.

Estado actual (medido el 2026-10-08):

| Pieza | Estado |
|---|---|
| `docs/requirements/README.md` | Ya describe las dos disposiciones, el umbral (> 15 requisitos o > 500 líneas), la regla del resolver (archivo → sección → error), los dos comandos de migración y el scaffolding de SRS único. Dice que `index.md` "se regenera con `memory-system index`", algo que el motor todavía no hace. El frontmatter no tiene el pie `Volver al mapa: [[index]].` |
| `docs/templates/srs-template.md` | Existe, pero el frontmatter no tiene `substatus`, el slug está fijo (`srs-mi-proyecto`), los ejemplos de requisito están activos (no son placeholders), faltan las anotaciones `escritor:` (principio 13 de la constitución) y faltan los comentarios sobre el umbral y sobre no renumerar. No tiene copia en la semilla del scaffold. |
| `skills/memory-system/assets/scaffold/requirements/README.md` | Semilla anterior: solo describe la disposición fragmentada. |
| `skills/memory-system/scripts/memory-system.js` (1050 líneas) | Motor determinista que usa solo módulos nativos. `scaffold` copia las semillas (`{date}` es el único placeholder) y cinco plantillas compartidas (`SHARED_TEMPLATES`). `check` ejecuta 5 evaluadores (`CHECK_KINDS`). `slugSetOf(nodes)` es el conjunto contra el que se resuelven los wikilinks en `index` y en `check`. `extractWikilinks` descarta `#anchor` y `\|alias`. `parseFrontmatter` no interpreta listas en línea (`[FR-001, FR-002]` llega como cadena). `MIGRATE_SOURCES = ['dod-monolithic', 'epic-template-v1']` y `runMigrate` despacha con un ternario. La regla del SKILL dice "**nunca se elimina nada**". |
| Precedentes de módulo | `dod-story.js` y `epic-template.js` (y, cuando esté diseñado, `specs-3-levels.js` de STORY-114, que introduce la tabla `MIGRATORS` y la eliminación de orígenes `[ELIMINADO]`). Todos devuelven `{ lines, summary, exitCode }` y piden las utilidades del motor con un `require` diferido. |
| Historias hermanas | **STORY-105** (`READY-FOR-IMPLEMENT/DONE`) migra los 77 requisitos de este repositorio a disposición fragmentada con `README.md` como índice (su D-1), sin `requirements/index.md` y con wikilinks de slug completo; su CR-002 deja a esta historia decidir el índice. **STORY-110** hace que `/project-discovery` y `/reverse-engineering` escriban siempre fragmentado y crea `requirement-template.md` (dueño `project-discovery`); también cuenta los `### FR-NNN` de `srs-*.md` para asignar IDs y avisa si existe un SRS. **STORY-114** (`migrate --from=specs-3-levels`) escribe fragmentado y avisa si hay un SRS. **STORY-115** cambia el árbol semilla, pero no la estrategia de `requirements/`. |
| Consumidores de texto afectados | "cuatro plantillas de autoría manual" / "nueve plantillas" en `skills/memory-system/SKILL.md`, `references/memory-rules.md`, `assets/scaffold/templates/README.md`, `evals/evals.json`, `docs/architecture/memory-system.md` y `test/memory-system.test.js` (S096-UT-001c fija el árbol semilla exacto). |
| Verificador de enlaces | `scripts/check-doc-links.js` valida los wikilinks de las raíces activas (`README.md`, `docs/index.md`, `docs/guides`, `docs/policies`, `docs/guardrails`, `docs/runbooks`, `docs/constitution.md`) contra los `slug:` declarados. No conoce el alias corto `[[FR-NNN]]`. |

Stack (constitución + `package.json`): skills, templates y documentación en Markdown. La parte ejecutable es Node.js ≥ 18 en
`memory-system.js` y sus módulos (solo módulos nativos, porque el skill se instala en proyectos sin `node_modules`). Las pruebas usan
`node --test` (`npm test`). `sddf.config.yaml` no declara `skills.plan`, así que no aplican skills complementarios. La fase
implement exige evals (`skill-test-evals`, `required: true`) y `skill-master` como generador de código.

## Goals / Non-Goals

**Goals:**

- `docs/requirements/README.md` documenta las dos disposiciones, el umbral, el resolver, el catálogo generado y las dos migraciones. // satisface: AC-1
- `srs-template.md` (semilla del scaffold = copia en `docs/templates/`) incluye `type: srs`, `slug`, `title`, `status`, `substatus`, `created` y `updated`, ejemplos `### FR-001 — <nombre>` / `### NFR-001 — <nombre>`, comentarios sobre el umbral y sobre no renumerar, y ninguna sección de implementación. // satisface: AC-2
- `scaffold` crea `requirements/srs-<project-slug>.md` a partir del template solo si la capa todavía no tiene disposición. No crea `functional/` ni `non-functional/`, y el resultado pasa `check`. // satisface: AC-3
- Hay un resolver único `ID → archivo | sección | error` que usan `index` y `check`, tanto para `[[FR-NNN]]` como para `implements: [FR-NNN]`. // satisface: AC-4
- `migrate --from=srs-single` y `migrate --from=requirements-fragmented` son deterministas, idempotentes, admiten `--dry-run` y no pierden requisitos. // satisface: AC-5, AC-6, CNF-1, CNF-2
- `check` incorpora la familia `requirement`, que valida cada disposición. // satisface: AC-7
- La documentación canónica y el `CHANGELOG.md` reflejan la estrategia. // satisface: AC-8
- Un proyecto ya fragmentado no necesita migrar: el resolver encuentra sus archivos y `check` lo valida como fragmentado. // satisface: AC-9, CNF-3
- Un proyecto con SRS carga un solo archivo y uno fragmentado carga solo el archivo del requisito resuelto. // satisface: CNF-4
- Los slugs usan solo el guion ASCII U+002D. Todo lo escrito queda en UTF-8 sin BOM con saltos `\n`. // satisface: CNF-5

**Non-Goals:**

- Cambiar `story-template.md`, `epic-template.md`, la máquina de estados o los tipos de requisito distintos de FR/NFR (fuera de alcance de la historia).
- Hacer que `/project-discovery`, `/reverse-engineering` o `migrate --from=specs-3-levels` escriban en el SRS cuando la capa está en modo SRS (ver CR-004).
- Ampliar `scripts/check-doc-links.js` para que entienda el alias corto `[[FR-NNN]]` (ver Riesgos).
- Imponer el umbral: `check` no lo trata como problema (el README lo declara orientativo).
- Una sincronización automática entre disposiciones o un subcomando `resolve` en la CLI.
- Quitar del `README.md` de este repositorio el índice por categorías que añade STORY-105 (ver CR-001).

## Decisions

### D-1 — Módulo propio `requirements.js` registrado en el motor // satisface: AC-4, AC-5, AC-6, AC-7, CNF-6

- Archivo nuevo: `skills/memory-system/scripts/requirements.js`. Sigue el patrón de `dod-story.js` y `epic-template.js`: concentra
  el conocimiento de la capa `requirements/` (las dos disposiciones, el resolver, el catálogo y las migraciones), pide las
  utilidades del motor con un `require` diferido (`engine()`) para evitar el ciclo y usa solo `node:fs` y `node:path`.
- `memory-system.js` solo cambia en estos puntos de registro:
  - `MIGRATE_SOURCES` añade `'srs-single'` y `'requirements-fragmented'`.
  - `runMigrate` despacha con la tabla `MIGRATORS`. La introduce STORY-114; si esta historia se implementa antes, la introduce
    ella con las mismas entradas.
  - `CHECK_KINDS` y `EVALUATORS` añaden `requirement`.
  - `slugSetOf` acepta alias (D-5).
  - `scaffold` delega la creación del SRS (D-3).
  - `runIndex` delega la escritura del catálogo (D-4).
  - `USAGE` y la cabecera de subcomandos se actualizan.
- Sin `fs-extra`: CNF-6 pide no añadir dependencias, y el motor ya funciona sin `package.json` en el consumidor (ver CR-002).

**Alternativas rechazadas:**

- *Todo dentro de `memory-system.js`:* añadiría unas 500 líneas de conocimiento de requisitos a un motor genérico. Los precedentes
  ya separaron ese tipo de conocimiento.
- *Usar `fs-extra`, como pide literalmente CNF-6:* rompería el skill en los proyectos consumidores, que lo instalan sin
  `node_modules`.

### D-2 — Inventario de la capa y detección de disposición // satisface: AC-4, AC-7, AC-9

`inventoryRequirements(specsBase)` lee `requirements/` una sola vez y devuelve `{ layout, srsFiles, sections, fragments, catalog }`:

| Elemento | Regla |
|---|---|
| `srsFiles` | `requirements/srs-*.md` (solo el primer nivel), en orden ordinal. |
| `sections` | Encabezados `### <ID>` de cada SRS, con `ID = (FR\|NFR)-\d{3,}`, sobre el texto **visible**: se descartan antes el frontmatter, los comentarios `<!-- … -->` y los bloques con fences (la misma regla de visibilidad que usa `extractWikilinks`). Cada sección guarda `{ id, title, relPath, line, bodyLines }`; el cuerpo llega hasta el siguiente `###` o `##`, o hasta el final. El separador del título admite `—`, `–`, `-` o `:`. |
| `fragments` | `requirements/functional/*.md` y `requirements/non-functional/*.md` cuyo nombre cumple `^(FR\|NFR)-\d{3,}(-.+)?\.md$`. El ID sale del prefijo del nombre. |
| `catalog` | `requirements/index.md`, si existe. |

Disposición (`layout`):

| Condición | `layout` |
|---|---|
| `fragments` > 0 y `sections` > 0 | `mixed` |
| `fragments` > 0 | `fragmented` (un SRS sin secciones visibles se ignora) |
| `srsFiles` > 0 | `srs` |
| ninguna | `empty` |

**Alternativas rechazadas:**

- *Declarar la disposición en `sddf.config.yaml`:* sería una segunda fuente de verdad que puede contradecir los archivos. La
  disposición se deduce del disco.
- *Contar como requisitos los encabezados que están dentro de comentarios:* el template trae ejemplos comentados (D-6) y el SRS
  recién creado tendría un `FR-001` fantasma.

### D-3 — `scaffold` crea el SRS único solo si la capa no tiene disposición // satisface: AC-3, AC-9, CNF-3, CNF-5

Después de las semillas y de las plantillas compartidas, `scaffold` llama a `requirements.scaffoldSrs(ctx)`:

1. Si la capa `requirements` está en `skipLayers`, no hace nada. Hoy ningún perfil la omite.
2. Si `layout ≠ empty`, registra `[PRESERVADO] requirements/<srs existente>` o, si es fragmentada,
   `[PRESERVADO] requirements/ — disposición fragmentada`, y no crea nada.
3. Si no, crea `requirements/srs-<project-slug>.md` → `[CREADO]` (`[CREARÍA]` con `--dry-run`).
   - `project-slug` es `slugify(basename(REPO_ROOT))`.
   - `slugify` aplica: NFD sin marcas diacríticas → minúsculas → `[^a-z0-9]+` → `-` → sin guiones en los extremos → como máximo
     50 caracteres cortando en un guion. Es la misma regla que STORY-105 D-3.
   - Si el resultado queda vacío, usa `proyecto`.
   - En este repositorio sería `srs-agile-sddf.md`.
4. Para el contenido usa `$SPECS_BASE/templates/srs-template.md` si existe (el template es la fuente de verdad dinámica, principio 5),
   o la semilla `assets/scaffold/templates/srs-template.md`. Aplica `renderSrs` (D-6).
5. El SRS **no es un archivo gestionado**: `--force` nunca lo sobrescribe, porque es contenido del autor. Cuenta en `creados` o
   `preservados` del resumen, que no cambia de formato.

No se crean `functional/` ni `non-functional/` en ningún modo de `scaffold`.

**Alternativas rechazadas:**

- *Semilla fija `requirements/srs.md`:* no cumple `srs-<project-slug>.md` (AC-3) y obliga a renombrar.
- *Un flag `--project <slug>`:* nadie lo necesita hoy (YAGNI). El archivo se puede renombrar y `check` acepta cualquier `srs-*.md`.
- *Sacar el slug de `product/vision.md`:* en un proyecto nuevo la visión todavía es una semilla sin nombre real.
- *Crear el SRS aunque ya existan fragmentos:* produciría una disposición `mixed` en todo proyecto existente (rompe AC-9).

### D-4 — Catálogo `requirements/index.md`, generado por el motor // satisface: AC-5, AC-6, AC-7, AC-9

En disposición fragmentada, el índice que piden AC-5 y AC-7 es `requirements/index.md`. Es un archivo **derivado y propiedad del
motor**, como `$SPECS_BASE/index.md`: se regenera entero y nadie lo edita a mano.

| Parte | Contenido |
|---|---|
| Frontmatter | `type: wiki`, `slug: requirements-catalog` (declarado, para no chocar con el slug `index` de la raíz), `title: "Catálogo de requisitos"`, `status: IN-PROGRESS`, `substatus: DONE`, `parent: null`, `created` (se conserva el del catálogo anterior si existe), `updated` (fecha de ejecución o `--date`) |
| Cuerpo | `# Catálogo de requisitos`, una línea `<!-- Generado por memory-system; no editar. -->`, `## Requisitos funcionales` y `## Requisitos no funcionales`, con una línea por fragmento en orden numérico de ID: `- [[<slug del fragmento>]] — <ID> — <title>`; una sección vacía lleva `_(sin requisitos)_`; pie `Volver al mapa: [[index]].` |

Quién lo escribe:

- `memory-system index` (y por tanto `ensure` y `rebuild --force`) lo regenera cuando `layout = fragmented`. Antes del resumen
  añade la línea `catálogo de requisitos: requirements/index.md (N requisitos)`.
- Con `index --dry-run` no lo escribe y solo informa la línea.
- En cualquier otra disposición, `index` no lo crea ni lo toca.
- `migrate --from=srs-single` lo escribe (D-7) y `migrate --from=requirements-fragmented` lo elimina (D-8).

**Alternativas rechazadas:**

- *Usar `requirements/README.md` como índice, como hace STORY-105 D-1:* contradice el texto de AC-5, AC-6 y AC-7 (`index.md`).
  Además, para eliminar el índice (AC-6) habría que editar una semilla gestionada con bloques delimitados, en un archivo que el autor
  también edita a mano. Ver CR-001.
- *Un `index.md` escrito a mano:* no se puede garantizar que "liste todos los IDs presentes" (AC-7) y se desincroniza con cada
  requisito nuevo.

### D-5 — Resolver con precedencia archivo → sección → error // satisface: AC-4, AC-9, CNF-4

`resolveRequirement(inventory, id)` devuelve uno de estos resultados:

1. `{ kind: 'file', relPath: 'functional/FR-001-eliminar-cuenta.md', slug }`: primer fragmento en orden ordinal cuyo ID es `id`,
   buscado tanto en `functional/` como en `non-functional/`.
2. `{ kind: 'section', relPath: 'srs-mi-proyecto.md', anchor: 'FR-001', target: 'srs-mi-proyecto.md#FR-001' }`: primera sección
   `### <id>` de cualquier `srs-*.md`.
3. `null`, que el llamador convierte en un error accionable (D-9).

Las rutas son relativas a `requirements/`. Integración en el motor:

- **Alias de wikilink.** `slugSetOf(nodes, aliases)` añade como slugs conocidos los IDs que resuelven. Así `[[FR-001]]` no aparece
  como roto en `check` ni como pendiente en `index`, en ninguna de las dos disposiciones. Un `[[srs-mi-proyecto#FR-001]]` ya
  resuelve hoy, porque `extractWikilinks` descarta el `#anchor`.
- **`implements:` del frontmatter.** `parseIdList(value)` acepta la lista YAML de bloque (array) o en línea (la cadena
  `"[FR-001, NFR-002]"` que deja `parseFrontmatter`). La lista se interpreta solo en `requirements.js`; el parser global no cambia.
- **Carga mínima (CNF-4).** El resolver devuelve **una** ruta. Quien lo consume abre solo ese archivo: el SRS completo en modo SRS
  o un único fragmento en modo fragmentado.

**Alternativas rechazadas:**

- *Un subcomando `resolve --id`:* ningún skill lo necesita hoy (P12). La función exportada se prueba directamente y `check` es la
  superficie que se observa.
- *Resolver primero la sección:* en una disposición `mixed`, el fragmento (más reciente y específico) debe ganar, como fija AC-4.
- *Reescribir `extractWikilinks` para que conozca los IDs:* mezclaría el conocimiento de requisitos con el parser genérico. Basta
  con el alias en el conjunto de slugs.

### D-6 — `srs-template.md`: semilla del scaffold con copia idéntica en `docs/templates/` // satisface: AC-2, AC-3

- Ruta canónica: `skills/memory-system/assets/scaffold/templates/srs-template.md`. Es una plantilla de **autoría manual**: ningún
  skill escribe el SRS (STORY-110 escribe fragmentos). Por eso vive en la semilla, como `adr-template.md` (ADR-0012), y no en
  `SHARED_TEMPLATES`.
- `docs/templates/srs-template.md` queda idéntica byte a byte (dogfood) y la prueba S118 lo comprueba.
- Contenido:

| Bloque | Contenido |
|---|---|
| Frontmatter | `type: srs`, `slug: srs-<project-slug>`, `title: "SRS — <Nombre del proyecto>"`, `status: IN-PROGRESS`, `substatus: TODO`, `parent: null`, `created: <YYYY-MM-DD>`, `updated: <YYYY-MM-DD>`. Cada clave lleva encima un comentario de línea completa `# escritor: autoría manual — …` (con el valor del placeholder que rellena `scaffold`). |
| `# SRS — <Nombre del proyecto>` | — |
| Comentario de estrategia | `<!-- escritor: autoría manual -->` y un comentario que explica: un requisito por `###` con el ID como prefijo; los IDs no se renumeran ni se reutilizan; umbral > 15 requisitos o > 500 líneas → `/memory-system migrate --from=srs-single`. |
| `## Requisitos funcionales` | Comentario con el ejemplo `### FR-001 — <nombre>`, una descripción con la forma "El sistema debe…" y `**Criterios de verificación:**` con `- [ ]`. |
| `## Requisitos no funcionales` | Comentario con el ejemplo `### NFR-001 — <nombre>`, igual que el anterior. |
| Pie | `Volver al mapa: [[index]].` |

- **No incluye** secciones de implementación, diseño ni decisiones técnicas.
- `renderSrs(text, { slug, name, date })`:
  - sustituye `<project-slug>`, `<Nombre del proyecto>` y `<YYYY-MM-DD>`;
  - quita las líneas `# escritor:` del frontmatter y los comentarios `<!-- escritor: … -->` del cuerpo (el principio 13 prohíbe
    copiarlos a los documentos generados);
  - conserva el comentario de estrategia y los ejemplos comentados.
- Como los ejemplos están dentro de comentarios, un SRS recién creado tiene cero secciones visibles (D-2) y pasa `check` (AC-3).

**Alternativas rechazadas:**

- *Ejemplos activos con un placeholder en el título:* el SRS creado declararía un `FR-001` falso, que contaría para la asignación
  de IDs de STORY-110 y para la unicidad.
- *Ponerla en `SHARED_TEMPLATES` con dueño `project-discovery`:* ese skill no escribe SRS. Un dueño que no escribe el artefacto
  contradice ADR-0001 y ADR-0012.

### D-7 — `migrate --from=srs-single` // satisface: AC-5, CNF-1, CNF-2, CNF-5

La función es `migrateSrsSingle(specsBase, { dryRun, date, displayRoot })`. Todo o nada: el plan se calcula entero y, si contiene un
`[NO MIGRADO]`, no se escribe nada y el exit es 1.

1. **Sin `srs-*.md` con secciones visibles** → `[SIN CAMBIOS] requirements/ — no hay SRS con requisitos`, exit 0. Así se cumple la
   idempotencia: la segunda ejecución no encuentra SRS.
2. **Validación:**
   - Si `layout = mixed` → `[NO MIGRADO] requirements/ — requisitos en dos disposiciones`.
   - Si un ID se repite entre secciones → `[NO MIGRADO] <srs>:<línea> — ID duplicado <ID>`.
   - Contenido visible fuera de un bloque de requisito (que no sea el `#`, los dos `##` reconocidos, líneas en blanco o comentarios)
     → `[NO MIGRADO] <srs>:<línea> — contenido fuera de un requisito; muévelo (p. ej. a product/vision.md) y repite`.
   - Si el SRS está por debajo del umbral → `[WARNING] <srs> — por debajo del umbral (N requisitos, L líneas); se migra igualmente`.
     El aviso no cambia el exit.
3. **Un fragmento por sección.** Ruta: `functional/` (prefijo `FR`) o `non-functional/` (prefijo `NFR`), con nombre
   `<ID>-<slugify(title)>.md`. Contenido, según el esquema del README y STORY-105 D-2:
   - frontmatter `type: requirement`, `kind`, `id`, `slug` (nombre sin `.md`), `title` entre comillas dobles, `status: active`,
     `created` y `updated` (fecha), `related: []`;
   - cuerpo `# <ID> — <title>`, una línea en blanco y el cuerpo de la sección con los encabezados ascendidos dos niveles
     (`####` → `##`, `#####` → `###`). El resto del texto se copia literal.
   - Si el destino existe con el mismo contenido (sin contar `created` ni `updated`) → `[PRESERVADO]`, lo que permite reanudar. Si
     existe con contenido distinto → `[NO MIGRADO] <destino> — ya existe con otro contenido`.
4. **Catálogo:** escribe `requirements/index.md` (D-4) → `[CREADO]` o `[SOBRESCRITO]`.
5. **Reescritura de wikilinks:** en todos los `.md` de `SPECS_BASE` menos `templates/` y los propios fragmentos, sobre el texto
   visible (sin fences ni código en línea), reemplaza `[[srs-<slug>#<ID>(|alias)?]]` → `[[<ID>(|alias)?]]` y `[[srs-<slug>(|alias)?]]`
   → `[[requirements-catalog(|alias)?]]`. Emite `[REESCRITO] <ruta> — N wikilinks`. Los `[[FR-NNN]]` no se tocan: siguen
   resolviendo, ahora al archivo (D-5).
6. **Elimina** cada SRS migrado → `[ELIMINADO] requirements/<srs>`. Esto exige una excepción explícita a la regla "nunca se elimina
   nada" (CR-006), con el mismo precedente que STORY-114.

Salida: cabecera `── memory-system migrate ── from: srs-single · root: <root>`, una línea por acción, la regla `─` y
`creados: N · preservados: M · reescritos: R · eliminados: E` (más `cambios pendientes: P` con `--dry-run`). Con `--dry-run` se
usan las formas en condicional (`[CREARÍA]`, `[PRESERVARÍA]`, `[REESCRIBIRÍA]`, `[ELIMINARÍA]`) y no se escribe nada. `--force` se
ignora.

**Alternativas rechazadas:**

- *Conservar el SRS como índice deprecado (precedente `dod-monolithic`):* deja dos fuentes de verdad, y la disposición sería `mixed`
  para siempre.
- *Migrar por SRS de forma parcial:* deja la capa en `mixed` si falla a mitad. El todo o nada lo evita.
- *Copiar a `product/` el contenido que queda fuera de los requisitos:* sería una decisión de ubicación que no corresponde a una
  migración mecánica. Se informa y se deja al autor.

### D-8 — `migrate --from=requirements-fragmented` (inversa, opcional) // satisface: AC-6, CNF-1, CNF-2

La función es `migrateFragmented(specsBase, { dryRun, date, displayRoot })`, también todo o nada.

1. **Sin fragmentos** → `[SIN CAMBIOS] requirements/ — no hay requisitos fragmentados`, exit 0.
2. **Validación:**
   - Si `layout = mixed` → `[NO MIGRADO]`.
   - Si hay un ID duplicado → `[NO MIGRADO]`.
   - Un fragmento con datos que el SRS no puede representar (`status` distinto de `active`, `related` no vacío, claves fuera del
     esquema del README, un segundo `#`, o un `id` que no coincide con el prefijo del nombre) →
     `[NO MIGRADO] <ruta> — <motivo>`.
3. **Destino:**
   - si existe un `srs-*.md` sin secciones visibles (por ejemplo, el que creó `scaffold`), se usa ese;
   - si no, se crea `srs-<project-slug>.md` con `renderSrs` (D-6).
   - Para cada fragmento, en orden numérico de ID, se inserta `### <ID> — <title>` seguido del cuerpo sin el `#` y con los
     encabezados descendidos dos niveles (`##` → `####`, `###` → `#####`). Va al final de `## Requisitos funcionales` o de
     `## Requisitos no funcionales` según el prefijo; los comentarios del template se conservan.
   - La transformación es la inversa exacta de D-7, de modo que SRS → fragmentado → SRS deja las secciones idénticas.
4. **Reescritura de wikilinks:** `[[<slug del fragmento>(|alias)?]]` → `[[<ID>(|alias)?]]` y `[[requirements-catalog(|alias)?]]` →
   `[[srs-<slug>(|alias)?]]` → `[REESCRITO]`.
5. **Elimina** los fragmentos, `requirements/index.md` y los directorios `functional/` y `non-functional/` si quedan vacíos →
   `[ELIMINADO]`.

La salida usa el mismo formato que D-7, con `from: requirements-fragmented`.

**Alternativas rechazadas:**

- *Llevar `status` y `related` a un comentario dentro del SRS:* añade un formato oculto que el resolver y `check` tendrían que
  entender (P12). Una migración opcional y poco frecuente puede pedir al autor que normalice antes.
- *No eliminar `index.md`:* contradice AC-6 y dejaría un catálogo con enlaces rotos.

### D-9 — Familia `requirement` en `check` // satisface: AC-4, AC-7, AC-9

Hay un evaluador nuevo, `requirements.requirementProblems(ctx)`. Se ejecuta sobre el mismo `ctx` (un único escaneo) y recibe
`ctx.requirements = inventoryRequirements(root)`. Cada problema es `{ kind: 'requirement', path, detail }`:

| Disposición | Regla | `path` | `detail` |
|---|---|---|---|
| todas | ID repetido entre secciones, fragmentos o ambos | segunda aparición | `ID duplicado <ID> (ya en <ruta>)` |
| todas | `implements:` con un ID mal formado | nodo | `implements: <valor> no es un ID FR-NNN/NFR-NNN` |
| todas | `implements:` con un ID que no resuelve (D-5, paso 3) | nodo | `implements: <ID> no resuelve — no existe functional/<ID>-*.md, non-functional/<ID>-*.md ni "### <ID>" en requirements/srs-*.md` |
| `mixed` | requisitos en las dos disposiciones | `requirements/` | `requisitos en dos disposiciones — migra con /memory-system migrate --from=srs-single o --from=requirements-fragmented` |
| `srs` | — (existe al menos un `srs-*.md` por definición; la unicidad la cubre la primera fila) | — | — |
| `fragmented` | falta `requirements/index.md` | `requirements/index.md` | `falta el catálogo — ejecuta /memory-system index` |
| `fragmented` | fragmento con frontmatter inválido: `type ≠ requirement`, `id` ≠ prefijo del nombre, `kind` ≠ carpeta, `slug` ≠ nombre sin `.md`, o `title` vacío | fragmento | `frontmatter de requisito: <campo> <motivo>` |
| `fragmented` | el catálogo no lista un ID presente | `requirements/index.md` | `no lista <ID>` |
| `fragmented` | el catálogo lista un ID ausente | `requirements/index.md` | `lista <ID>, que no existe` |
| `empty` | — | — | — |

Notas:

- Los wikilinks `[[FR-NNN]]` que no resuelven siguen apareciendo en `broken-wikilink`. Los que resuelven no aparecen gracias al
  alias (D-5).
- En AC-7, "IDs únicos en toda la memoria" se aplica al conjunto de los requisitos (secciones + fragmentos). Ningún otro tipo de
  artefacto usa el prefijo FR/NFR.
- Para un proyecto fragmentado anterior a esta historia, sin catálogo (AC-9), el resultado es **un solo** problema, que se corrige
  con `/memory-system index` sin migrar (ver CR-003).
- `CHECK_KINDS` añade `requirement` al final. `KIND_WIDTH` se deriva solo y el JSON gana la clave `summary.requirement` (cambio
  aditivo).

**Alternativas rechazadas:**

- *Repartir los problemas entre `invalid-frontmatter` y `broken-wikilink`:* el `detail` no podría nombrar la acción de requisitos,
  y la línea de resumen no distinguiría el origen.
- *Tratar como problema que se supere el umbral:* el README lo declara orientativo. Un gate no debe fallar por una recomendación.

### D-10 — Documentación del skill, reglas, README y canónica // satisface: AC-1, AC-8

| Artefacto | Cambio |
|---|---|
| `docs/requirements/README.md` | Se ajusta al diseño sin perder el texto vigente: (a) añade `substatus` al frontmatter y el pie `Volver al mapa: [[index]].`; (b) en el modo fragmentado, `index.md` es el **catálogo generado** (`[[requirements-catalog]]`, D-4); (c) el resolver acepta tanto `[[FR-NNN]]` como `implements: [FR-NNN]` y apunta a `srs-<slug>.md#FR-NNN` o al archivo; (d) la tabla de migración enlaza los dos comandos y menciona `--dry-run`; (e) el scaffolding solo crea el SRS si la capa no tiene disposición; (f) los ejemplos de frontmatter usan los valores de D-6. El índice por categorías que añade STORY-105, si ya existe, no se toca. |
| `skills/memory-system/assets/scaffold/requirements/README.md` | Se reescribe con la estrategia (la misma redacción que el README de `docs/`, sin el índice propio de este repositorio). |
| `skills/memory-system/assets/scaffold/templates/srs-template.md` | Archivo nuevo (D-6). `docs/templates/srs-template.md` se reemplaza por una copia idéntica. |
| `assets/scaffold/templates/README.md` y `docs/templates/README.md` | Añaden `srs-template.md` a las plantillas de autoría manual (cinco en total, diez plantillas base). |
| `skills/memory-system/SKILL.md` | `description` (menciona las migraciones de requisitos); `Qué hace` (scaffold SRS, catálogo en `index`, familia `requirement`); tabla de Parámetros y Paso 1 (dos filas `migrate --from=…`); Paso 2 (filas del motor); secuencia nueva **3.9** (las dos migraciones de requisitos: sin pregunta, reenvían la salida y propagan el exit, y recomiendan `--dry-run` primero); tabla de familias de 3.5; Paso 4 (dos filas de informe); Paso 5 (estas migraciones no tienen degradación inline: `❌ migrate --from=<origen> requiere node`); Restricciones: la excepción de eliminación (CR-006); Salida. |
| `skills/memory-system/references/memory-rules.md` | §5: el SRS se crea solo si falta y nunca se sobrescribe; `srs-template.md` va en la semilla. §7: familia `requirement`. **§9 nuevo**: "Requisitos: disposiciones, resolver y catálogo" (D-2, D-4, D-5). |
| `skills/memory-system/README.md` | Modos nuevos. |
| `docs/architecture/memory-system.md` | Sección de las dos disposiciones (estructura, umbral, resolver, catálogo y migración). §5 usa `requirements/functional/FR-001-<slug>.md` o `srs-<slug>.md#FR-001`. Recuento de plantillas. |
| `docs/domains/domain-knowledge-artifacts.md` | `srs` en el conjunto cerrado de `ArtifactType` y en la tabla de artefactos (prefijo `srs-`, capa `requirements/`, evoluciona, "Requisitos agrupados en un único documento"). La regla 7 pasa a "en `functional/`/`non-functional/` o como sección `### <ID>` de un `srs-*.md`". |
| `docs/guides/sddf-commands-pipeline.md` | Dos líneas en el bloque de comandos y dos filas en la tabla de `memory-system`. |
| `README.md` (raíz) | Una línea en la sección de estructura: `requirements/` empieza con un SRS único y se fragmenta al superar el umbral. |
| `CHANGELOG.md` | En `[Unreleased]` → `Added`: la estrategia, las dos migraciones, la familia `requirement`, el catálogo y `srs-template.md`. En `Changed`: `scaffold` crea el SRS único y `index` regenera el catálogo. |

### D-11 — Pruebas, fixtures y evals // satisface: AC-3, AC-4, AC-5, AC-6, AC-7, AC-9, CNF-1, CNF-2

- **Fixtures** en `skills/memory-system/examples/`:
  - `srs-single/`: SRS con 3 FR y 2 NFR, uno con `####`; una historia con `implements: [FR-001, NFR-002]` y otra con
    `implements:` en bloque; una guía con `[[FR-001]]` y `[[srs-<slug>#FR-002]]`.
  - `requirements-fragmented/`: los fragmentos equivalentes más `index.md`.
  - `requirements-legacy/`: fragmentos sin `index.md` (AC-9).
  - `requirements-mixed/`.
- **`test/requirements.test.js`** (nuevo, `S118-*`), siempre sobre copias temporales:
  - inventario y disposición;
  - precedencia del resolver;
  - `parseIdList` con las dos formas;
  - `renderSrs`;
  - scaffold en una raíz vacía (crea el SRS, no crea `functional/`, `check` con exit 0) y sobre `requirements-legacy` (no crea
    nada);
  - `srs-single` real y con `--dry-run`, y su repetición (`[SIN CAMBIOS]`);
  - ida y vuelta SRS → fragmentado → SRS con secciones idénticas;
  - los casos `[NO MIGRADO]` sin escrituras;
  - las reglas de `check` de D-9;
  - copia idéntica `docs/templates/srs-template.md` = semilla;
  - UTF-8 sin BOM.
- **`test/memory-system.test.js`**: S096-UT-001c (árbol semilla con `templates/srs-template.md`) y la lista de plantillas.
- **Evals** (`skills/memory-system/evals/evals.json`, a partir de TC-023): scaffold con SRS, `check` en los dos modos, las dos
  migraciones con `--dry-run` y su idempotencia. TC-007 se actualiza con el recuento de plantillas. Se ejecutan con
  `npm run test:eval -- memory-system`.

## Componentes y archivos

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Módulo de requisitos | crear | `skills/memory-system/scripts/requirements.js` | AC-3, AC-4, AC-5, AC-6, AC-7, AC-9 |
| Motor (registro) | modificar | `skills/memory-system/scripts/memory-system.js` | AC-3, AC-4, AC-5, AC-6, AC-7 |
| Template SRS (semilla) | crear | `skills/memory-system/assets/scaffold/templates/srs-template.md` | AC-2, AC-3 |
| Template SRS (dogfood) | modificar (copia idéntica) | `docs/templates/srs-template.md` | AC-2 |
| README de requisitos (semilla) | modificar | `skills/memory-system/assets/scaffold/requirements/README.md` | AC-1, AC-3 |
| README de requisitos | modificar | `docs/requirements/README.md` | AC-1 |
| README de plantillas | modificar | `skills/memory-system/assets/scaffold/templates/README.md`, `docs/templates/README.md` | AC-2 |
| Skill | modificar | `skills/memory-system/SKILL.md`, `skills/memory-system/README.md` | AC-5, AC-6, AC-7, AC-8 |
| Reglas | modificar | `skills/memory-system/references/memory-rules.md` | AC-4, AC-7 |
| Documentación canónica | modificar | `docs/architecture/memory-system.md`, `docs/domains/domain-knowledge-artifacts.md`, `docs/guides/sddf-commands-pipeline.md`, `README.md`, `CHANGELOG.md` | AC-8 |
| Fixtures | crear | `skills/memory-system/examples/{srs-single,requirements-fragmented,requirements-legacy,requirements-mixed}/` | AC-4…AC-7, AC-9 |
| Pruebas | crear / modificar | `test/requirements.test.js`, `test/memory-system.test.js` | AC-3…AC-7, AC-9, CNF-1, CNF-2 |
| Evals | modificar | `skills/memory-system/evals/evals.json` | AC-3, AC-5, AC-6, AC-7 |
| Catálogo de este repo | generar con `memory-system index` (solo si STORY-105 ya está implementada) | `docs/requirements/index.md` | AC-9 |

`requirement-template.md` no se crea ni se modifica aquí: lo crea STORY-110 (CR-005).

## Interfaces

Exportaciones de `requirements.js`; firmas abstractas, sin lógica:

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| `REQUIREMENT_ID` | Expresión regular `^(FR\|NFR)-\d{3,}$` | AC-4, AC-7 |
| `slugify(text, max = 50) → string` | Regla de D-3; usa solo el guion ASCII | AC-3, AC-5, CNF-5 |
| `projectSlug(repoRoot) → string` | `slugify(basename)` o `proyecto` | AC-3, AC-6 |
| `parseIdList(value) → string[]` | Acepta un array o la cadena `"[A, B]"`; `[]` si no hay nada | AC-4, AC-7 |
| `inventoryRequirements(specsBase) → { layout, srsFiles, sections, fragments, catalog }` | Solo lectura (D-2) | AC-4, AC-7, AC-9 |
| `resolveRequirement(inventory, id) → { kind, relPath, slug?, anchor?, target } \| null` | Precedencia de D-5 | AC-4, AC-9 |
| `requirementAliases(inventory) → string[]` | IDs que resuelven, para `slugSetOf` | AC-4 |
| `renderSrs(templateText, { slug, name, date }) → string` | D-6 | AC-2, AC-3 |
| `scaffoldSrs({ specsBase, repoRoot, seedTemplate, dryRun, date }) → { relPath, action, note }` | D-3; `action ∈ created \| preserved` | AC-3 |
| `renderCatalog(inventory, { date, created }) → string` | D-4; determinista salvo `updated` | AC-5, AC-7 |
| `writeCatalog(specsBase, { dryRun, date }) → { written, count } \| null` | Lo invoca `runIndex`; devuelve `null` si `layout ≠ fragmented` | AC-7, AC-9 |
| `requirementProblems(ctx) → problem[]` | D-9; `ctx.requirements` precalculado | AC-4, AC-7, AC-9 |
| `migrateSrsSingle(specsBase, opts) → { lines, summary, exitCode }` | D-7 | AC-5 |
| `migrateFragmented(specsBase, opts) → { lines, summary, exitCode }` | D-8 | AC-6 |

Cambios de interfaz en `memory-system.js`:

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| `slugSetOf(nodes, aliases = [])` | Añade los alias al conjunto. Sin alias, el comportamiento no cambia | AC-4 |
| `MIGRATE_SOURCES` | Añade `srs-single` y `requirements-fragmented` | AC-5, AC-6 |
| `MIGRATORS[from](specsBase, args)` | Entradas nuevas que delegan en `requirements.js` | AC-5, AC-6 |
| `CHECK_KINDS` / `EVALUATORS` | Añaden `requirement` / `requirementProblems` | AC-7 |
| CLI | `migrate --root <SPECS_BASE> --from srs-single\|requirements-fragmented [--dry-run] [--date]` | AC-5, AC-6, CNF-2 |

Dependencias: `requirements.js` → utilidades del motor (`parseFrontmatter`, `readText`, `toPosix`, `assertInsideRoot`, `under`,
`todayIso`, `UsageError`) con `require` diferido. El motor → `requirements.js` solo en los puntos de registro. No hay ciclos en
tiempo de carga.

## Flujos clave

### F-1 — Proyecto nuevo (AC-3, AC-4)

`/memory-system ensure` → `scaffold` (`layout = empty` → `[CREADO] requirements/srs-<slug>.md`) → `index` (sin catálogo, porque
`layout = srs`). El autor añade `### FR-001 — …`. Una historia declara `implements: [FR-001]` → `check` lo resuelve a
`srs-<slug>.md#FR-001` y da `problemas: 0`.

### F-2 — El proyecto crece (AC-5)

`/memory-system migrate --from=srs-single --dry-run` (plan) → `/memory-system migrate --from=srs-single` (fragmentos, catálogo,
`[REESCRITO]` y `[ELIMINADO]`) → `check`: `implements: [FR-001]` resuelve ahora a `functional/FR-001-<slug>.md`. Una segunda
ejecución da `[SIN CAMBIOS]`.

### F-3 — Proyecto fragmentado existente (AC-9)

Tras actualizar el framework, `check` informa `[requirement] requirements/index.md — falta el catálogo — ejecuta /memory-system
index`. Con `/memory-system index` (o `ensure`) se genera el catálogo y `check` queda limpio. `scaffold` no crea ningún SRS
(`[PRESERVADO] requirements/ — disposición fragmentada`). No hace falta migrar.

### F-4 — Vuelta atrás (AC-6)

`/memory-system migrate --from=requirements-fragmented` consolida en `srs-<slug>.md` (o en el SRS vacío que exista), elimina los
fragmentos y el catálogo y reescribe los wikilinks de slug completo a `[[ID]]`.

### F-5 — Degradación (P7)

| Situación | Comportamiento |
|---|---|
| Plan con `[NO MIGRADO]` | No se escribe nada; exit 1; cada línea nombra la ruta, la línea y la acción. |
| Error de E/S a mitad de la escritura | El orden es crear → reescribir → eliminar, así que nunca se elimina un origen antes de que existan sus destinos. Al reintentar, los destinos idénticos salen `[PRESERVADO]`. |
| Sin `node` | Las dos migraciones terminan con `❌ … requiere node`, sin escribir. `check` inline del Paso 5 aplica la familia `requirement` siguiendo `memory-rules.md` §9. |
| Template del proyecto ausente o ilegible | `scaffold` usa la semilla. |

## Risks / Trade-offs

- [Este repositorio sin STORY-105 implementada: `ensure` crearía `docs/requirements/srs-agile-sddf.md`] → La implementación de esta
  historia comprueba `layout` antes de ejecutar `ensure` sobre `docs/`. Si es `empty`, no ejecuta `ensure`; solo ejecuta `index`
  cuando existan los fragmentos de STORY-105.
- [Cada proyecto nuevo nace con un SRS vacío, y `/project-discovery` (STORY-110) escribe fragmentos igualmente] → El SRS sin
  secciones visibles se ignora (`layout = fragmented`, D-2) y no hay disposición `mixed`; `check` solo pide el catálogo. La solución
  completa (que discovery escriba en el SRS por debajo del umbral) queda en CR-004.
- [El alias corto `[[FR-NNN]]` no lo entiende `scripts/check-doc-links.js`] → Solo afecta a las raíces activas (`docs/guides`,
  `docs/policies`, …). El README y la guía recomiendan el slug completo fuera de `specs/`. `check-doc-links` excluye `docs/specs`,
  donde las historias usan el alias.
- [Eliminar archivos rompe una regla dura del skill] → Ocurre solo en las dos migraciones explícitas, después de escribir los
  destinos y con `--dry-run` disponible. La excepción queda escrita (CR-006), como en STORY-114.
- [El catálogo de este repositorio duplica la navegación por categorías del `README.md` de STORY-105] → El catálogo es plano y
  generado; el README es curado. Recomendación en CR-001.
- [Un SRS con texto libre fuera de los requisitos no se migra] → Es intencionado: se evita perder contenido o decidir su ubicación.
  El `[NO MIGRADO]` indica la línea.
- [`summary.requirement` en el JSON de `check`] → Es un cambio aditivo. Los consumidores `jq` que leen `.ok`, `.problems` o claves
  concretas no se rompen.

## Decisiones de complejidad justificada

- **Un módulo nuevo en lugar de unas funciones en el motor.** El conocimiento de requisitos (dos disposiciones, resolver, catálogo,
  dos migraciones) tiene una sola razón de cambio. Separarlo mantiene genérico el motor, como hicieron `dod-story.js` y
  `epic-template.js`.
- **Catálogo generado en lugar de manual.** Una regla de `check` como "lista todos los IDs" solo es sostenible si el archivo lo
  produce una máquina. Un índice manual fallaría con cada requisito nuevo.
- **Reescritura de wikilinks en las migraciones.** Sin ella, cada migración rompería `[[srs-x#FR-001]]` o `[[FR-001-slug]]` y
  `check` fallaría justo después de una operación "segura". Se limita a formas exactas y al texto visible.
- **Todo o nada.** Es más simple que reanudar por unidad, y la detección de destinos idénticos (`[PRESERVADO]`) ya cubre el
  reintento tras un fallo de E/S.
- **Lo que no se hace:** no hay subcomando `resolve`, ni disposición declarada en la configuración, ni metadatos ocultos en el SRS,
  ni cambios en `check-doc-links` (P12).

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | El README documenta la estrategia | `docs/requirements/README.md` contiene: las dos disposiciones con sus rutas, `> 15` y `> 500`, el orden archivo → sección → error y los dos comandos `migrate --from=…` | AC-1 |
| 2 | Contenido del template | El frontmatter de `srs-template.md` tiene `type: srs`, `slug`, `title`, `status`, `substatus`, `created` y `updated`; hay `## Requisitos funcionales` con `### FR-001 — <nombre>` y `## Requisitos no funcionales` con `### NFR-001 — <nombre>`; los comentarios mencionan el umbral y que no se renumera; no hay `## Diseño`, `## Implementación` ni `## Decisiones`; la semilla y `docs/templates/` son idénticas byte a byte | AC-2 |
| 3 | Scaffold con SRS | En un temporal sin `docs/requirements/`, `scaffold` → `[CREADO] requirements/srs-<slug>.md`; no existen `functional/` ni `non-functional/`; `check` da exit 0 | AC-3 |
| 4 | Scaffold sin pisar | Sobre `requirements-legacy`, `scaffold` y `scaffold --force` → `[PRESERVADO] requirements/ — disposición fragmentada`; no aparece ningún `srs-*.md` | AC-3, AC-9 |
| 5 | Precedencia del resolver | Archivo y sección con el mismo ID → `kind: 'file'`; solo sección → `target: 'srs-<slug>.md#FR-001'`; nada → `null` | AC-4 |
| 6 | `implements:` y `[[FR-NNN]]` | En `srs-single` y en `requirements-fragmented` (con catálogo), `check` no informa ningún `broken-wikilink` ni `requirement` para `FR-001`; `implements: [FR-099]` → `[requirement] … no resuelve — …` | AC-4 |
| 7 | Migración SRS → fragmentado | Un archivo por sección en la carpeta correcta, con contenido igual (encabezados ascendidos); `requirements/index.md` lista todos los IDs; el SRS no existe; `[[srs-<slug>#FR-002]]` pasa a ser `[[FR-002]]`; `check` da exit 0 | AC-5 |
| 8 | Idempotencia y dry-run | Segunda ejecución → `[SIN CAMBIOS]` sin cambios en disco (hash del árbol igual); `--dry-run` no cambia el hash y muestra `cambios pendientes: P > 0` | AC-5, AC-6, CNF-1, CNF-2 |
| 9 | Ida y vuelta | SRS → fragmentado → SRS: las secciones `###` y sus cuerpos son idénticos al original | AC-5, AC-6 |
| 10 | Migración inversa | Las secciones `### FR-NNN` están en el SRS; ni `index.md` ni los fragmentos existen; `[[FR-001-<slug>]]` pasa a ser `[[FR-001]]`; `check` da exit 0 | AC-6 |
| 11 | Fallo seguro | Para las fixtures con ID duplicado, texto fuera de los requisitos o `mixed`, el resultado es `[NO MIGRADO]`, exit 1 y ningún archivo cambia | AC-5, AC-6 |
| 12 | `check` por disposición | Las reglas de D-9 se activan una a una en fixtures mínimas, con su `detail` exacto; `summary.requirement` en `--json` | AC-7 |
| 13 | Compatibilidad | En `requirements-legacy`, `check` da exactamente 1 problema (`falta el catálogo`); tras `index`, exit 0; `implements` resuelve al archivo | AC-9 |
| 14 | Documentación canónica | Por grep: `srs` en `domain-knowledge-artifacts.md` (`ArtifactType` y tabla); `migrate --from=srs-single` en `sddf-commands-pipeline.md`; "dos disposiciones" en `architecture/memory-system.md`; entradas `Added` y `Changed` en `[Unreleased]` del `CHANGELOG.md` | AC-8 |
| 15 | Calidad del gate | `npm test`, `npm run verify:repository` y `npm run test:eval -- memory-system` en verde | CNF-1, CNF-3 |
| 16 | Convenciones | Ningún slug ni nombre generado contiene un guion que no sea U+002D; ningún archivo empieza por `EF BB BF`; no se añade ninguna dependencia a `package.json` | CNF-5, CNF-6 |

## Open Questions

Ninguna. Las ambigüedades se resolvieron en el diseño y quedan registradas como CR.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: ambigüedad
- **Descripción**: AC-5, AC-6 y AC-7 llaman `requirements/index.md` al índice de la disposición fragmentada, pero STORY-105 D-1
  (diseñada) usa `requirements/README.md` como índice y rechaza crear `index.md`. Su CR-002 delega la decisión en esta historia.
- **Documento afectado**: design.md (STORY-118) / docs/requirements/README.md
- **Acción requerida**: el diseño adopta `requirements/index.md` como catálogo generado (`slug: requirements-catalog`, D-4).
  `README.md` sigue siendo el punto de entrada de la capa. Recomendado: cuando estén implementadas STORY-105 y STORY-118, sustituir
  en este repositorio el índice manual por categorías del README por un enlace a `[[requirements-catalog]]`, o mantenerlo como
  navegación curada de forma explícita.

### CR-002
- **Tipo**: inviabilidad
- **Descripción**: CNF-6 dice que el resolver y la migración usan `fs-extra`. El motor de `memory-system` se ejecuta en proyectos
  consumidores donde el skill se copia sin `node_modules`, y su contrato es "solo módulos nativos".
- **Documento afectado**: story.md
- **Acción requerida**: el diseño usa `node:fs` (D-1), lo que cumple la intención de CNF-6 ("sin dependencias nuevas"). Recomendado:
  cambiar CNF-6 por "solo módulos nativos de Node, sin dependencias nuevas".

### CR-003
- **Tipo**: ambigüedad
- **Descripción**: AC-7 exige `index.md` en la disposición fragmentada. AC-9 exige que un proyecto fragmentado existente "siga
  funcionando sin migración obligatoria", y esos proyectos no tienen `index.md`.
- **Documento afectado**: story.md
- **Acción requerida**: `check` informa un único problema accionable (`falta el catálogo — ejecuta /memory-system index`), que se
  corrige con el mantenimiento habitual (`index`/`ensure`) y sin migrar (D-9, F-3). Recomendado: precisarlo en AC-9.

### CR-004
- **Tipo**: dependencia
- **Descripción**: con "SRS único primero", `scaffold` crea un SRS en todo proyecto nuevo, pero `/project-discovery` y
  `/reverse-engineering` (STORY-110) y `migrate --from=specs-3-levels` (STORY-114) escriben siempre fragmentos. El proyecto queda
  fragmentado con pocos requisitos, en contra de la estrategia.
- **Documento afectado**: story.md (STORY-118) / épica EPIC-21
- **Acción requerida**: el diseño lo tolera (un SRS sin secciones visibles se ignora, D-2). Recomendado: una historia nueva para que
  esos escritores añadan secciones `### FR-NNN` al SRS cuando `layout ∈ {empty, srs}` y no se supere el umbral, usando
  `inventoryRequirements` y `resolveRequirement`.

### CR-005
- **Tipo**: dependencia
- **Descripción**: el mapa de implementación dice "Mantener `docs/templates/requirement-template.md`", pero ese archivo no existe
  hoy. Lo crea STORY-110 (dueño `project-discovery`).
- **Documento afectado**: story.md
- **Acción requerida**: esta historia no crea ni modifica `requirement-template.md`. El esquema de fragmento que escribe
  `migrate --from=srs-single` (D-7) es el del README, y STORY-110 lo reproduce. Recomendado: cambiar la fila del mapa a "lo crea
  STORY-110".

### CR-006
- **Tipo**: dependencia
- **Descripción**: AC-5 ("el SRS se reemplaza") y AC-6 ("el `index.md` se elimina") obligan a eliminar archivos. `SKILL.md` y
  `memory-rules.md` dicen "nunca se elimina nada" en ningún modo.
- **Documento afectado**: design.md / skills/memory-system/SKILL.md
- **Acción requerida**: añadir la excepción explícita: solo `migrate --from=srs-single`, `migrate --from=requirements-fragmented` (y
  `specs-3-levels`, STORY-114) eliminan, y solo orígenes ya escritos en su destino, con `--dry-run` disponible (D-7, D-8, D-10).
