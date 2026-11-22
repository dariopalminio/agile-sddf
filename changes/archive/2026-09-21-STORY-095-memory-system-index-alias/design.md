---
alwaysApply: false
type: design
id: STORY-095
slug: STORY-095-memory-system-index-alias-design
title: "Design: Crear el skill memory-system con el modo index y deprecar docs-wiki-builder"
date: 2026-09-20
status: PLAN
substatus: DONE
parent: EPIC-20-memory-system
story: STORY-095
related:
  - STORY-095-memory-system-index-alias
  - STORY-096-memory-system-scaffold-ensure-rebuild
  - STORY-097-memory-system-check-ci
  - STORY-098-memory-system-migrate-harness
  - STORY-044-directorio-docs-tipo-wiki
  - STORY-043-header-aggregation
  - memory-system
---

<!-- Referencias -->
[[STORY-095-memory-system-index-alias]]
[[STORY-096-memory-system-scaffold-ensure-rebuild]]
[[STORY-097-memory-system-check-ci]]
[[STORY-098-memory-system-migrate-harness]]
[[STORY-044-directorio-docs-tipo-wiki]]
[[STORY-043-header-aggregation]]
[[memory-system]]

# Diseño técnico: Crear el skill memory-system con el modo index y deprecar docs-wiki-builder

## Context

`skills/docs-wiki-builder/` (STORY-044) es hoy el único generador de `docs/index.md`. Opera
íntegramente inline (LLM): no produce dos veces el mismo índice, mezcla tres flujos (crear
estructura, reorganizar archivos, actualizar índice) y su template
`assets/wiki-index-template.md` describe una estructura (`knowledge/`) que ya no existe.
El índice vigente `docs/index.md` se mantiene a mano con un formato más rico que el del
template: `- [[slug]] — [archivo](ruta) — descripción`, donde el slug es el declarado en el
frontmatter.

Esta historia es la core del split de la STORY-095 original: crea el skill `memory-system`
con el modo `index`, la detección de harness y el alias deprecado de `docs-wiki-builder`.
Los modos `scaffold`/`ensure`/`rebuild` (STORY-096), `check` (STORY-097), la adaptación por
harness (STORY-098) y `sddf-init --level` (STORY-099) construyen sobre lo que aquí se decide;
por eso el diseño deja explícitos los puntos de extensión que esas historias usarán.

Contexto técnico extraído del proyecto (sin cambios respecto al diseño previo en `pre-split/`):

- Skills en Markdown (`skills/<name>/SKILL.md`, frontmatter solo `name`/`description`, sin
  `triggers:`, < 500 líneas); partes ejecutables en Node ≥ 18. En el proyecto consumidor no
  existe `package.json` ni `fs-extra`: cualquier script del skill usa solo módulos `node:`.
- Contrato `SDDF-ROOT-RESOLUTION: v1` (`SDDF_ROOT` → `sddf.config.yaml.root` → `docs`);
  `CLI_ROOT` se resuelve aparte y solo para localizar skills instalados.
- Guardrail `gr-skill-creation-checklist`: `evals/evals.json` obligatorio; subdirectorios
  `assets/ references/ evals/ examples/ scripts/`; rutas relativas.
- `config/eval-exemptions.json` exime a `docs-wiki-builder`; `npm run verify:eval-inventory`
  falla si un skill no tiene evals ni exención.
- `header-aggregation` deriva `slug` = nombre del directorio para `STORY-*`/`EPIC-*`/`PROJ-*`
  y `slug` = nombre de archivo para el resto; `docs/index.md` sigue esa convención.
- Versión `3.2.1` → esta historia entra en `3.3.0`; retirada del alias en `4.0.0`.

Numeración de criterios usada en este diseño (orden de `story.md`):

| ID | Criterio resumido |
|---|---|
| AC-1 | `memory-system index` regenera `docs/index.md` completo: una entrada `[[slug]]` por artefacto, agrupada por capa; slug del frontmatter o derivado; excluye derivados de historia y `templates/`; idempotente salvo fecha. |
| AC-2 | `/docs-wiki-builder` (con o sin `--update`/`--dry-run`) avisa deprecación, delega en `memory-system index [--dry-run]` y produce el mismo índice. |
| AC-3 | `header-aggregation` sigue invocable sin depender de `memory-system`. |
| AC-4 | Detección de harness `sddf|speckit|openspec|generic` por `sddf.config.yaml` > `.specify/` > `openspec/`; `--harness` la fuerza; en esta historia solo decide qué raíces se indexan. |
| AC-5 | Índice con wikilinks según patrón LLM Wiki y formato vigente; wikilink sin destino marcado como nodo pendiente sin bloquear. |
| AC-6 | Alias con retirada gradual (≥ 1 minor, fuera en la major); conserva un eval mínimo y sale del inventario de exenciones. |
| AC-7 | `/memory-system` sin modo reserva `ensure`; mientras no exista, informa los modos disponibles sin fallar. |

NFR-1 idempotencia · NFR-2 independencia de stack · NFR-3 portabilidad Windows · NFR-4
documentación (`memory-system.md`, `sddf-commands-pipeline.md`, `README.md`, `CHANGELOG.md`)
· NFR-5 deprecación gradual.

## Goals / Non-Goals

**Goals:**

- Un skill `memory-system` cuyo modo `index` produce `docs/index.md` de forma reproducible.
- Un punto único de detección de harness reutilizable por las historias hermanas.
- `docs-wiki-builder` reducido a alias con aviso, sin lógica propia y con eval mínimo.
- Estructura del skill (motor, template del índice, reglas de slug) preparada para añadir
  `scaffold`, `check` y perfiles de harness sin reescribir lo hecho aquí.

**Non-Goals:**

- Crear capas o archivos de memoria (STORY-096); reportar problemas con exit code (STORY-097);
  omitir capas o mapear archivos por harness (STORY-098); tocar `sddf-init` (STORY-099).
- Reorganizar archivos `.md` dispersos (Flujo B de `docs-wiki-builder`): desaparece.
- Modificar `header-aggregation` (solo una nota).
- Índice incremental (`--update` del skill viejo): el índice se regenera siempre completo.

## Decisions

### D-1 — Skill orquestador en Markdown + motor determinista en Node sin dependencias

// satisface: AC-1, AC-2, AC-7, NFR-1, NFR-2, NFR-3

`skills/memory-system/SKILL.md` resuelve la raíz (contrato v1), interpreta el modo y los
flags, y delega la generación a `skills/memory-system/scripts/memory-system.js`, un script
Node ≥ 18 que usa exclusivamente `node:fs`, `node:path` y `node:process`. En esta historia
el motor expone dos subcomandos: `detect` y `index`. Los subcomandos `scaffold` y `check` se
añaden en STORY-096/097 sobre el mismo archivo y el mismo parseo de argumentos.

`SKILL.md` invoca el motor como
`node <CLI_ROOT>/skills/memory-system/scripts/memory-system.js index --root <SPECS_BASE> [--harness h] [--dry-run]`
y referencia el script por ruta relativa (`scripts/memory-system.js`) para cumplir el guardrail.

Modo por defecto (AC-7): si no se pasa modo, `SKILL.md` muestra
`ℹ️ Modo ensure aún no disponible en esta versión. Modos disponibles: index. Ejecuta /memory-system index.`
y termina con éxito. Cuando STORY-096 añada `ensure`, esa rama se sustituye.

Degradación (P7): si `node` no está en PATH, `SKILL.md` genera el índice inline aplicando las
mismas reglas de D-3 y D-4 y avisa que la reproducibilidad byte a byte no está garantizada.

Alternativas rechazadas: (a) todo inline como `docs-wiki-builder` — no cumple "el mismo
`index.md`" (AC-1, AC-2); (b) reutilizar `scripts/` de la raíz del paquete — no existen en el
proyecto consumidor (NFR-2).

### D-2 — Detección de harness como subcomando con precedencia fija y raíces externas de solo lectura

// satisface: AC-4

`detect` devuelve uno de `sddf | speckit | openspec | generic` con la precedencia
`--harness` explícito > `sddf.config.yaml` en `REPO_ROOT` > `.specify/` > `openspec/` >
`generic`. Un valor no admitido en `--harness` termina con exit 2 y mensaje.

El motor declara una tabla `HARNESS_PROFILES` con, por harness, las raíces externas que el
índice escanea en modo solo lectura:

| Harness | Marcador | Raíces externas indexadas (relativas a `REPO_ROOT`) |
|---|---|---|
| `sddf` | `sddf.config.yaml` | — |
| `speckit` | `.specify/` | `specs/*/spec.md`, `specs/*/plan.md` |
| `openspec` | `openspec/` | `openspec/specs/**/spec.md`, `openspec/changes/*/proposal.md` |
| `generic` | ninguno | — |

La tabla lleva ya las claves `skipLayers` y `mappings` vacías: STORY-098 las rellena sin
cambiar la estructura. `index` nunca escribe fuera de `SPECS_BASE`.

Alternativa rechazada: detectar el harness dentro del `SKILL.md` — la detección tiene que
ser idéntica en `index`, `check` y `scaffold`; vivir en el motor la hace única.

### D-3 — Reglas de derivación de nodo indexable (slug, título, capa, exclusiones)

// satisface: AC-1, AC-5

Un **nodo indexable** es un `.md` bajo `SPECS_BASE` (más las raíces externas de D-2) que no
cae en las exclusiones. Reglas, documentadas en `references/memory-rules.md` para que
`check` (STORY-097) las reutilice sin duplicarlas:

- **slug**: `frontmatter.slug` si existe; si no, nombre de archivo sin extensión; para los
  nombres canónicos `story.md`, `epic.md`, `project.md`, `spec.md`, `proposal.md`, `plan.md`
  el nombre del directorio contenedor; para `README.md`, `<directorio>-index`.
- **título**: `frontmatter.title`; si no, primer encabezado `#`; si no, nombre del archivo.
- **capa**: primer segmento de la ruta relativa a `SPECS_BASE` (`adr`, `guides`, …);
  `specs/` se subdivide en `specs-projects`, `specs-epics`, `specs-stories`; `constitution.md`
  e `index.md` en raíz forman la capa `root`; las raíces externas forman `external`.
- **exclusiones**: `index.md`, `specs/.cache/`, `templates/` (sus wikilinks son
  placeholders), archivos derivados de historia (`design.md`, `tasks.md`, `testcases.md`,
  `analyze.md`, `*-report.md`, `fix-directives.md`, `finvest-evaluation-report.md`) y
  cualquier subdirectorio `pre-split/`.
- **frontmatter**: parser propio del subconjunto YAML usado por el esquema canónico
  (escalares, cadenas entrecomilladas, listas `- item`); sin bloque `---` inicial el nodo se
  marca `hasFrontmatter=false` y se enlaza solo por ruta con `⚠️ sin frontmatter`.

Alternativa rechazada: slug = nombre de directorio para todo (regla batch de
`header-aggregation`) — daría `slug: guides` para las 18 guías; `docs/index.md` ya usa la
regla por archivo (CHANGELOG 2026-08-29).

### D-4 — `index` regenera el archivo completo desde un template con placeholders por capa

// satisface: AC-1, AC-2, AC-5, NFR-1

`assets/index-template.md` (sucesor de `wiki-index-template.md`) contiene las secciones
fijas del índice vigente (Gobernanza, Especificaciones L3/L2/L1, capas de soporte, Artefactos
externos, Estado del grafo) y un placeholder por capa: `{layer:root}`, `{layer:product}`,
`{layer:requirements}`, `{layer:specs-projects}`, `{layer:specs-epics}`,
`{layer:specs-stories}`, `{layer:domains}`, `{layer:architecture}`, `{layer:adr}`,
`{layer:policies}`, `{layer:guardrails}`, `{layer:guides}`, `{layer:runbooks}`,
`{layer:external}`, más `{stats}` y `{date}`. El motor lee el template en runtime y
sustituye cada placeholder por las entradas de esa capa ordenadas por ruta normalizada (`/`):

```
- [[<slug>]] — [<archivo>](<ruta relativa a SPECS_BASE>) — <título>
```

Una capa sin nodos se sustituye por `_(sin artefactos)_`. Un placeholder de capa presente en
el template sin capa conocida, o una capa con nodos sin placeholder, termina con exit 2 sin
escribir (protege el template contra desalineaciones). `{stats}` rellena la tabla "Estado
del grafo" (total de nodos, nodos con frontmatter, wikilinks pendientes, fecha).

Wikilinks pendientes (AC-5): para cada `[[slug]]` presente en los nodos indexados (ignorando
código inline, fences, `|alias` y `#anchor`) que no resuelve a un slug conocido, el índice
añade al final una sección "Nodos pendientes" con `- [[slug]] ⚠️ nodo pendiente`. No bloquea.

Con `--dry-run` el motor imprime el índice resultante por stdout y no escribe.

El frontmatter del índice conserva los campos del actual (`type: wiki`, `slug: index`,
`title`, `status`, `substatus`, `parent`) y `updated` = fecha de ejecución; es el único campo
que cambia entre dos ejecuciones consecutivas (AC-1).

Alternativas rechazadas: (a) merge incremental sobre el índice existente (modo `--update`
viejo) — no reproducible, deja entradas huérfanas; (b) secciones hardcodeadas en el motor —
rompe el patrón "template como fuente de verdad" de la constitución.

### D-5 — `docs-wiki-builder` pasa a alias delgado con eval mínimo y sin exención

// satisface: AC-2, AC-6, NFR-5

`skills/docs-wiki-builder/SKILL.md` queda con: (1) frontmatter `name` + `description` que
empieza por "Deprecado desde 3.3.0, se elimina en 4.0.0"; (2) el aviso literal
`⚠️ docs-wiki-builder está deprecado. Usa /memory-system index.`; (3) el mapeo de argumentos
`--update` → `index`, `--dry-run` → `index --dry-run`, sin args → `index`; (4) la invocación
de `memory-system` con ese modo; (5) ninguna lógica propia. `assets/wiki-index-template.md`
se elimina. `evals/evals.json` del alias contiene dos casos (aviso + delegación; mapeo
`--dry-run`), lo que permite retirar su entrada de `config/eval-exemptions.json`.

Alternativa rechazada: mantener ambos skills funcionales una versión — duplica el indexador
y es exactamente la fragmentación que la historia elimina.

### D-6 — `header-aggregation` no cambia; el índice consume su esquema, no su skill

// satisface: AC-3

`memory-system index` lee el frontmatter de los artefactos con su propio parser (D-3) y no
invoca `header-aggregation`. `skills/header-aggregation/SKILL.md` recibe una nota en su
introducción: "`memory-system` lee el `slug` y `title` de este esquema para indexar; sigue
siendo una utilidad independiente. STORY-096 podrá invocarlo desde `ensure --fix-frontmatter`".

### D-7 — Documentación y trazabilidad en la misma historia

// satisface: NFR-4, AC-6

- `docs/architecture/memory-system.md`: nueva sección "10. Herramienta: skill `memory-system`"
  con el modo `index`, la detección de harness, las reglas de D-3 y el calendario de
  deprecación; se anota que los modos restantes llegan con STORY-096…099.
- `docs/guides/sddf-commands-pipeline.md`: subsección "0. Memoria del proyecto" con
  `/memory-system index` y la nota de deprecación.
- `README.md`: fila en la tabla de comandos; `CHANGELOG.md` (`3.3.0`): Added / Deprecated.
- `docs/index.md`: regenerado con `/memory-system index` (sustituye el mantenimiento manual).
- `AGENTS.md`/`CLAUDE.md`/`docs/domains/domain-skills-map.md`: solo si listan skills
  (verificar con `ls skills/`, principio 12).

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Skill `memory-system` | crear | `skills/memory-system/SKILL.md` | AC-1, AC-2, AC-4, AC-7 |
| Motor determinista (`detect`, `index`) | crear | `skills/memory-system/scripts/memory-system.js` | AC-1, AC-4, AC-5 |
| Template del índice | crear | `skills/memory-system/assets/index-template.md` | AC-1, AC-5 |
| Reglas de memoria | crear | `skills/memory-system/references/memory-rules.md` | AC-1, AC-5 |
| Evals del skill | crear (antes del SKILL.md) | `skills/memory-system/evals/evals.json` | AC-1, AC-7 |
| Fixtures | crear | `skills/memory-system/examples/{sddf,openspec,speckit}/` | AC-1, AC-4 |
| Tests del motor | crear | `test/memory-system.test.js` | AC-1, AC-4, AC-5 |
| Alias deprecado | modificar (reducir) | `skills/docs-wiki-builder/SKILL.md`, `evals/evals.json`; eliminar `assets/wiki-index-template.md` | AC-2, AC-6 |
| Exención de evals | modificar | `config/eval-exemptions.json` | AC-6 |
| `header-aggregation` | modificar (nota) | `skills/header-aggregation/SKILL.md` | AC-3 |
| Documentación | modificar | `docs/architecture/memory-system.md`, `docs/guides/sddf-commands-pipeline.md`, `README.md`, `CHANGELOG.md` | NFR-4 |
| Índice de la wiki | regenerar | `docs/index.md` | AC-1 |

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| `/memory-system [index] [--harness h] [--dry-run]` | Sin modo: mensaje informativo de AC-7 y fin. `index`: resuelve raíz, invoca el motor, muestra el resumen (`nodos indexados N · sin frontmatter M · nodos pendientes K`). | AC-1, AC-4, AC-7 |
| `node scripts/memory-system.js detect --root <SPECS_BASE> [--harness h]` | Imprime el harness; exit 0; exit 2 si `--harness` no es admitido o la raíz no existe. | AC-4 |
| `node scripts/memory-system.js index --root <SPECS_BASE> [--harness h] [--dry-run]` | Escribe `<SPECS_BASE>/index.md` (o lo imprime con `--dry-run`); última línea `nodos indexados: N · sin frontmatter: M · nodos pendientes: K`; exit 0; exit 2 ante template/placeholder inválido o raíz inexistente. | AC-1, AC-5 |
| `assets/index-template.md` | Placeholders `{layer:<capa>}`, `{layer:external}`, `{stats}`, `{date}`; frontmatter con `updated: {date}`. | AC-1, AC-5 |
| `/docs-wiki-builder [--update\|--dry-run]` | Aviso literal + delegación a `/memory-system index [--dry-run]`. | AC-2, AC-6 |
| `references/memory-rules.md` | Reglas de slug/título/capa/exclusiones y tabla `HARNESS_PROFILES`; leído por `SKILL.md` en la degradación inline y por STORY-097 para `check`. | AC-1, AC-5 |

## Esquema de datos

- **Nodo indexable**: `{ path, relPath, layer, slug, title, hasFrontmatter, wikilinks[] }`.
- **Perfil de harness** (`HARNESS_PROFILES[h]`): `{ marker, externalRoots[], skipLayers: [], mappings: {} }`
  (las dos últimas claves vacías, reservadas para STORY-098).
- **Frontmatter parseado**: mapa `clave → escalar | lista`; claves consumidas aquí: `slug`, `title`.
- **Resumen de `index`**: `{ indexed, withoutFrontmatter, pending }`.

## Flujos clave

### F-1 — `/memory-system index` en este repositorio (AC-1, AC-5)

1. `SKILL.md` resuelve `SPECS_BASE=docs` (contrato v1) y `CLI_ROOT=.claude`.
2. Invoca `detect` → `sddf` (existe `sddf.config.yaml`); sin raíces externas.
3. `index` escanea `docs/`, excluye `templates/`, derivados de historia y `pre-split/`,
   deriva slug/título/capa, lee `assets/index-template.md`, sustituye placeholders, calcula
   `{stats}` y la sección "Nodos pendientes", escribe `docs/index.md`.
4. `SKILL.md` muestra el resumen. Segunda ejecución: mismo archivo salvo `updated`.

### F-2 — `/docs-wiki-builder --update` (AC-2)

1. El alias emite el aviso literal.
2. Mapea `--update` → `index` e invoca `/memory-system index` → F-1.
3. El `index.md` es el mismo que el de F-1.

### F-3 — `/memory-system` sin modo (AC-7)

1. `SKILL.md` no encuentra modo → muestra el mensaje informativo con los modos disponibles.
2. Termina sin invocar el motor y sin error.

### F-4 — Proyecto OpenSpec (AC-4)

1. `detect` → `openspec`.
2. `index` añade las raíces externas del perfil; sus nodos van a `{layer:external}` con
   slug = directorio contenedor (`auth`, `add-login`); no escribe bajo `openspec/`.

## Decisiones de complejidad justificada

- **Motor Node en un skill Markdown**: única forma de cumplir "el mismo `index.md`" (AC-1,
  AC-2); limitado a módulos nativos para no exigir `package.json` (NFR-2).
- **Parser de frontmatter propio**: `yaml` no está disponible fuera del repositorio del
  framework; el subconjunto necesario es pequeño (escalares y listas simples).
- **Tabla de perfiles con claves reservadas**: evita que STORY-098 tenga que reestructurar el
  motor; el coste hoy es dos claves vacías.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | `index` ×2 sobre fixture `examples/sddf/` produce archivos idénticos salvo `updated` | `node --test test/memory-system.test.js` | AC-1 |
| 2 | Slugs derivados según D-3 para frontmatter, archivo, canónicos y README | test del motor | AC-1 |
| 3 | `templates/`, derivados de historia, `pre-split/` e `index.md` no aparecen | test del motor | AC-1 |
| 4 | `/docs-wiki-builder` emite el aviso literal y el índice coincide con `/memory-system index` | eval del alias + diff | AC-2, AC-6 |
| 5 | `header-aggregation` invocable con su eval existente sin cambios | `npm run test:eval -- header-aggregation` | AC-3 |
| 6 | `detect` respeta la precedencia y rechaza `--harness foo` con exit 2 | test del motor | AC-4 |
| 7 | Fixture `examples/openspec/`: nodos externos indexados, nada escrito bajo `openspec/` | test del motor (hashes) | AC-4 |
| 8 | Wikilink sin destino aparece en "Nodos pendientes" y exit 0 | test del motor | AC-5 |
| 9 | `config/eval-exemptions.json` sin `docs-wiki-builder` y `npm run verify:eval-inventory` en verde | comando | AC-6 |
| 10 | `/memory-system` sin modo muestra el mensaje de AC-7 y termina sin error | eval del skill | AC-7 |
| 11 | Guardrail `gr-skill-creation-checklist` en verde para `memory-system` y el alias | comandos del guardrail | — |
| 12 | Los cuatro documentos de NFR-4 mencionan `memory-system index` y la deprecación; `npm run verify:links` en verde | grep + comando | NFR-4 |

## Risks / Trade-offs

- [Orden de escaneo distinto entre SO] → ordenar por ruta normalizada con `/` y comparación
  ordinal; probado en el test con nombres mixtos.
- [`node` ausente en el consumidor] → degradación inline (D-1); el aviso deja claro que la
  reproducibilidad no está garantizada.
- [El índice manual vigente tiene descripciones escritas a mano que el título del frontmatter
  no reproduce] → se acepta la pérdida de descripciones largas: la entrada usa `title`. La
  primera regeneración se revisa con diff (T-final) antes de commitear.
- [`verify:eval-inventory` falla si el alias pierde la exención antes de tener evals] → T003
  crea el eval antes de retirar la exención.
- [Las historias hermanas reestructuran el motor] → claves reservadas en `HARNESS_PROFILES`
  y reglas en `references/memory-rules.md` fijan los puntos de extensión.

## Open Questions

Sin preguntas abiertas.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: la reproducibilidad de `index` (AC-1, AC-2) exige un ejecutable; la historia no nombra runtime. El diseño introduce `scripts/memory-system.js` (Node ≥ 18, sin dependencias) con degradación inline.
- **Documento afectado**: story.md
- **Acción requerida**: añadir a las notas que `index` reproducible requiere Node ≥ 18 en PATH (sin `package.json`); sin Node el skill degrada a generación inline.

### CR-002
- **Tipo**: reutilización
- **Descripción**: la regla de slug por archivo ya está aplicada en `docs/index.md` y documentada en CHANGELOG (2026-08-29); el diseño la adopta en lugar de la regla batch de `header-aggregation` (slug = directorio) para evitar `slug: guides` repetido.
- **Documento afectado**: design.md
- **Acción requerida**: ninguna; registrar la reutilización.

### CR-003
- **Tipo**: ambigüedad
- **Descripción**: el índice manual contiene descripciones que no existen en el frontmatter de los artefactos; la historia pide "el mismo índice" entre alias y skill, no entre índice manual y generado. Se decide que la entrada use `title` y se acepte perder descripciones a mano.
- **Documento afectado**: story.md
- **Acción requerida**: anotar en "Verificación sugerida" que la comparación con el índice manual es por entradas (slug y ruta), no por descripciones.
