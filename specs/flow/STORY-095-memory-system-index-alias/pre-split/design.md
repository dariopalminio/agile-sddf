---
alwaysApply: false
type: design
id: STORY-095
slug: STORY-095-memory-system-unificado-design
title: "Design: Unificar la gestión de memoria en un skill memory-system con modos"
date: 2026-09-20
status: PLAN
substatus: DONE
parent: EPIC-19-framework-consistency
story: STORY-095
related:
  - STORY-095-memory-system-unificado
  - STORY-044-directorio-docs-tipo-wiki
  - STORY-043-header-aggregation
  - STORY-054-inicializar-entorno-sddf
  - STORY-090-campos-declarados-nombran-su-escritor
  - memory-system
---

<!-- Referencias -->
[[STORY-095-memory-system-unificado]]
[[STORY-044-directorio-docs-tipo-wiki]]
[[STORY-043-header-aggregation]]
[[STORY-054-inicializar-entorno-sddf]]
[[STORY-090-campos-declarados-nombran-su-escritor]]
[[memory-system]]

# Diseño técnico: Unificar la gestión de memoria en un skill memory-system con modos

## Context

Hoy la memoria SDDF (`docs/`) se gestiona con tres utilidades desconectadas:

- `skills/docs-wiki-builder/` (STORY-044) genera `docs/index.md` con wikilinks, pero opera
  íntegramente inline (LLM), propone mover archivos y su template
  `assets/wiki-index-template.md` refleja una estructura ya obsoleta (`knowledge/`).
- `skills/header-aggregation/` (STORY-043) normaliza frontmatter, archivo a archivo o en
  batch, con confirmación interactiva.
- `skills/sddf-init/` (STORY-054) crea `specs/01..03`, `templates/`, `sddf.config.yaml` y
  `.env.template`; no crea ninguna otra capa.

`docs/architecture/memory-system.md` (ARCH-MEMORY, fuente de verdad) define once capas +
`constitution.md`, pero ningún skill las materializa: en este mismo repositorio faltan
`docs/product/` y `docs/requirements/` está vacío. No existe una forma determinista de
verificar la memoria (capas, frontmatter, wikilinks) apta para CI.

Contexto técnico extraído del proyecto:

- Skills en Markdown (`skills/<name>/SKILL.md`, frontmatter solo `name`/`description`);
  partes ejecutables en Node.js ≥ 18 (`scripts/*.js`, sin dependencias fuera de
  `fs-extra`, que no está disponible en el proyecto consumidor).
- Contrato de resolución de raíz `SDDF-ROOT-RESOLUTION: v1` (`SDDF_ROOT` →
  `sddf.config.yaml.root` → `docs`) replicado en cada skill; `CLI_ROOT` se resuelve aparte.
- Guardrail `gr-skill-creation-checklist`: `SKILL.md` < 500 líneas, `evals/evals.json`
  obligatorio, subdirectorios `assets/ references/ evals/ examples/ scripts/`, rutas
  relativas, sin `triggers:`.
- `config/eval-exemptions.json` exime hoy a `docs-wiki-builder` de evals.
- `docs/index.md` vigente usa el formato `- [[slug]] — [archivo](ruta) — descripción`,
  donde el slug es el declarado en el frontmatter.
- Versión actual `3.2.1` (SemVer) → esta historia entra en `3.3.0`; la retirada del alias
  corresponde a `4.0.0`.

Numeración de criterios de aceptación usada en este diseño (orden de `story.md`):

| ID | Criterio resumido |
|---|---|
| AC-1 | `/docs-wiki-builder` avisa deprecación, delega en `memory-system index` y produce el mismo `index.md`. |
| AC-2 | `ensure` (default) detecta capas faltantes entre 11, crea solo lo faltante, regenera índice, no sobrescribe, reporta creados/preservados/índice. |
| AC-3 | `scaffold` crea `constitution.md`, `product/{vision,stakeholders,objectives}.md`, `README.md` por capa faltante y 6 plantillas; no regenera índice. |
| AC-4 | `check` reporta sin escribir: capas faltantes, huérfanos, wikilinks rotos, frontmatter inválido; exit 1/0. |
| AC-5 | `migrate` detecta harness (`speckit` por `.specify/`), propone plan sin escribir, pide confirmación, luego `scaffold` adaptado. |
| AC-6 | `rebuild` sin `--force` se detiene con mensaje y no modifica nada. |
| AC-7 | `rebuild --force` regenera capas e índice y advierte pérdida de cambios manuales. |
| AC-8 | `sddf-init --level full` invoca `memory-system scaffold` al final; resultado idéntico a ejecutarlos por separado. |
| AC-9 | `ensure --harness openspec` crea capas bajo `docs/` sin tocar `openspec/`, sin duplicar `changes/`/`specs/`, e indexa artefactos OpenSpec. |
| AC-10 | `header-aggregation` sigue invocable de forma independiente. |
| AC-11 | Alias deprecado sobrevive ≥ 1 minor y se elimina en la siguiente major. |
| AC-12 | Seis modos idempotentes: ejecutar dos veces produce el mismo resultado. |
| AC-13 | Detección de harness `sddf|speckit|openspec|generic` con override `--harness`. |
| AC-14 | Once capas + `constitution.md` en la raíz de `docs/`. |
| AC-15 | `index` regenera `docs/index.md` con `[[slug]]` según patrón LLM Wiki. |
| AC-16 | `sddf-init` incorpora `--level`; solo `full` invoca el scaffolding. |
| AC-17 | `ensure` (y opcionalmente `scaffold`) puede invocar `header-aggregation` para normalizar frontmatter. |
| AC-18 | `check` produce salida parseable (`--json`) y exit code. |

Requisitos no funcionales: NFR-1 idempotencia · NFR-2 preservación · NFR-3 independencia de
stack (sin `package.json`) · NFR-4 trazabilidad del reporte · NFR-5 documentación
(`memory-system.md`, `sddf-commands-pipeline.md`, `README.md`, `CHANGELOG.md`) · NFR-6
deprecación gradual · NFR-7 portabilidad Windows.

## Goals / Non-Goals

**Goals:**

- Un único punto de entrada `memory-system` con seis modos que cubra scaffolding, indexado y
  verificación de la memoria SDDF, ejecutable en cualquier harness (`sddf`, `speckit`,
  `openspec`, `generic`).
- Determinismo donde el AC lo exige: `index` produce el mismo archivo ante la misma entrada
  (AC-1, AC-12) y `check` devuelve exit code y JSON (AC-4, AC-18).
- Preservación por defecto: solo `rebuild --force` sobrescribe, y solo archivos que el
  scaffold posee (NFR-2).
- Reutilizar lo existente: tabla de templates dueños de `sddf-init`, contrato de raíz v1,
  esquema canónico de `header-aggregation`, convención de entrada de `docs/index.md`.
- Deprecación con retirada gradual de `docs-wiki-builder` (AC-11, NFR-6).

**Non-Goals:**

- No se modifica `header-aggregation` (ni se le añade el flag `--fix-frontmatter`; ver CR-002).
- No se toca `sddf-init` más allá de `--level` y la invocación final (AC-16).
- `migrate` no convierte artefactos entre harness; solo hace scaffolding adaptado.
- No se reimplementa el "Flujo B" de `docs-wiki-builder` (mover archivos dispersos): esa
  responsabilidad desaparece con el alias; queda registrada en CR-005.
- No se generan índices derivados (`specs/.cache/index.json`) ni UI.
- No se crea la capa `rfcs/` que `memory-system.md` lista como soporte: la historia fija
  once capas (ver CR-006).

## Decisions

### D-1 — Un skill orquestador en Markdown + un motor determinista en Node sin dependencias

// satisface: AC-1, AC-4, AC-12, AC-18, NFR-1, NFR-3, NFR-7

`skills/memory-system/SKILL.md` orquesta los seis modos y toda interacción con el usuario.
La lógica que debe ser reproducible vive en `skills/memory-system/scripts/memory-system.js`,
un script Node (≥ 18) que usa exclusivamente módulos nativos (`node:fs`, `node:path`,
`node:process`) y expone tres subcomandos deterministas: `scaffold`, `index`, `check`, más
`detect` (harness). Los modos compuestos (`ensure`, `migrate`, `rebuild`) se definen en el
`SKILL.md` como secuencias de esos subcomandos.

Alternativas rechazadas:

1. *Todo inline en el LLM (como `docs-wiki-builder`)*: no puede garantizar "el mismo
   `index.md`" (AC-1) ni un exit code (AC-4); la idempotencia (AC-12) quedaría en manos del
   modelo.
2. *Un script por modo*: duplicaría el escáner de artefactos, el parser de frontmatter y la
   tabla de capas en tres lugares; viola el invariante "sin duplicación" de ARCH-MEMORY.
3. *Reutilizar `scripts/` de la raíz del paquete (`fs-extra`)*: esos scripts solo existen
   en el repositorio del framework, no en el proyecto consumidor; el skill debe funcionar
   copiado a `$CLI_ROOT/skills/` sin `package.json` (NFR-3).

El `SKILL.md` referencia el script con ruta relativa (`scripts/memory-system.js`) y lo
invoca como `node <CLI_ROOT>/skills/memory-system/scripts/memory-system.js <subcomando>`.
Degradación (P7): si `node` no está en PATH, el skill ejecuta `scaffold`/`index` inline
siguiendo las mismas reglas de D-3/D-4, avisa que `check` pierde el exit code y solo emite el
informe textual.

### D-2 — Catálogo de capas y perfiles de harness como datos del motor

// satisface: AC-2, AC-5, AC-9, AC-13, AC-14

El motor declara un catálogo `LAYERS` con las once capas y sus archivos semilla, y una tabla
`HARNESS_PROFILES` que dice, por harness, qué capas se materializan, qué archivos se mapean a
un equivalente ya existente y qué raíces externas se escanean para el índice:

| Harness | Marcador de detección | Capas omitidas | Mapeos (no se crea, se enlaza) | Raíces extra indexadas |
|---|---|---|---|---|
| `sddf` | `sddf.config.yaml` | ninguna | — | — |
| `speckit` | `.specify/` | `specs/` | `constitution.md` → `.specify/memory/constitution.md` si existe | `specs/*/spec.md`, `specs/*/plan.md` |
| `openspec` | `openspec/` | `specs/` | — | `openspec/specs/**/spec.md`, `openspec/changes/*/proposal.md` |
| `generic` | ninguno | ninguna | — | — |

Precedencia de detección (`detect`): `--harness` explícito > `sddf.config.yaml` >
`.specify/` > `openspec/` > `generic`. Las raíces externas son de solo lectura: el motor
nunca escribe fuera de `SPECS_BASE` (AC-9).

Alternativas rechazadas: (a) un único layout fijo con `if harness == …` disperso por el
código — cada harness nuevo tocaría todos los subcomandos; (b) un archivo de perfil por
harness en `assets/` — añade parsing YAML sin `yaml` disponible y no hay hoy variabilidad
que lo justifique (P12).

### D-3 — `scaffold` es una copia-si-falta de un árbol semilla, con templates tomados de sus skills dueños

// satisface: AC-3, AC-8, AC-14, NFR-2, NFR-4

`assets/scaffold/` reproduce el árbol destino (`constitution.md`, `product/vision.md`,
`product/stakeholders.md`, `product/objectives.md`, `<capa>/README.md` para cada una de las
once capas, `templates/README.md`). El subcomando `scaffold` recorre ese árbol y, para cada
entrada, crea el archivo solo si no existe en `SPECS_BASE`; nunca sobrescribe. Cada archivo
creado se registra como `[CREADO]`; cada existente como `[PRESERVADO]`.

Las **seis plantillas base** de `templates/` son: `story-template.md`, `epic-template.md`,
`project-template.md`, `project-intent-template.md`, `project-plan-template.md` (copiadas
desde el `assets/` de su skill dueño con la misma tabla y reglas del Paso 2b de `sddf-init`,
incluido el `[WARNING]` no bloqueante si el dueño no está instalado) y `adr-template.md`
(semilla propia de `memory-system`, hoy en `docs/adr/adr-template.md`). Ver CR-003.

Los archivos semilla llevan frontmatter conforme al esquema canónico de
`header-aggregation` (`type`, `slug`, `title`, `status`, `substatus`, `parent`, `created`,
`updated`) y contenido plantilla mínimo; la fecha se rellena en tiempo de ejecución.

El informe final del subcomando es la única salida que consumen `ensure`, `migrate` y
`sddf-init`: `creados: N · preservados: M · omitidos por harness: K`.

Alternativas rechazadas: (a) duplicar las cinco plantillas compartidas dentro de
`assets/scaffold/templates/` — rompe ADR-0001 (un dueño por template); (b) generar los
README con el LLM — no idempotente ni verificable.

### D-4 — `index` regenera `docs/index.md` desde un template con placeholders por capa

// satisface: AC-1, AC-2, AC-9, AC-15, NFR-1

`assets/index-template.md` (sucesor de `wiki-index-template.md`) contiene las secciones
fijas del índice y un placeholder por capa (`{layer:product}`, `{layer:specs-projects}`,
`{layer:specs-epics}`, `{layer:specs-stories}`, `{layer:domains}`, …, `{layer:external}`,
`{stats}`). El motor lee el template en runtime (patrón "template como fuente de verdad") y
sustituye cada placeholder con la lista de nodos de esa capa, ordenados por ruta, en el
formato vigente de `docs/index.md`:

```
- [[<slug>]] — [<archivo>](<ruta relativa a SPECS_BASE>) — <título>
```

Reglas de derivación (mismas para `index` y `check`):

- **slug**: `frontmatter.slug` si existe; si no, nombre de archivo sin extensión; para
  nombres canónicos (`story.md`, `epic.md`, `project.md`, `spec.md`, `proposal.md`,
  `plan.md`) el nombre del directorio contenedor; para `README.md`, `<directorio>-index`.
- **título**: `frontmatter.title`; si no, primer encabezado `#`; si no, nombre del archivo.
- **artefactos derivados de historia** (`design.md`, `tasks.md`, `testcases.md`,
  `analyze.md`, `*-report.md`) no se listan (convención actual del índice); solo `story.md`.
- **exclusiones**: `specs/.cache/`, `templates/` (contienen wikilinks placeholder) y el
  propio `index.md`.
- Un nodo sin frontmatter se enlaza solo por ruta y se marca `⚠️ sin frontmatter`; un
  wikilink que no resuelve se marca `⚠️ nodo pendiente` (no bloquea, como hoy).

El frontmatter del índice se genera con `updated` = fecha actual y el resto de campos del
template. `index` escribe el archivo completo cada vez (regeneración, no merge): es la única
forma de que dos ejecuciones consecutivas coincidan byte a byte salvo `updated`.

Alternativas rechazadas: (a) merge incremental sobre el índice existente (modo `--update`
actual) — no determinista y propenso a dejar entradas huérfanas; (b) sección por directorio
sin template — dejaría la estructura del índice hardcodeada en el motor.

### D-5 — `check` es de solo lectura, con cuatro familias de problemas, `--json` y exit code

// satisface: AC-4, AC-18

El subcomando `check` no escribe ningún archivo. Evalúa, sobre el harness detectado:

| Familia (`kind`) | Regla |
|---|---|
| `missing-layer` | Directorio de capa (o `constitution.md`) ausente según `HARNESS_PROFILES`. |
| `orphan` | `.md` bajo `SPECS_BASE` (excl. exclusiones de D-4) sin bloque `---` inicial. |
| `invalid-frontmatter` | Frontmatter presente pero sin `type`, `slug` o `title`; para `type ∈ {project, epic, story}` además sin `id` o `status`. |
| `broken-wikilink` | `[[slug]]` (ignorando `|alias`, `#anchor`, código inline y fences) cuyo slug no coincide con ningún slug derivado por D-4. |

Salida por defecto: informe textual agrupado por familia. Con `--json`, un objeto:

```
{ "harness": "sddf", "root": "docs", "ok": false,
  "summary": { "missing-layer": 1, "orphan": 0, "invalid-frontmatter": 2, "broken-wikilink": 3 },
  "problems": [ { "kind": "…", "path": "…", "detail": "…" } ] }
```

Exit code `1` si `problems` no está vacío, `0` en caso contrario, `2` ante error técnico
(raíz inválida, `node` incompatible). El conjunto de campos obligatorios se documenta en
`memory-system.md` (ver CR-004 sobre la divergencia `date` vs `created/updated`).

Alternativa rechazada: hacer bloqueante el `⚠️ nodo pendiente` del índice — mezclaría la
generación (tolerante) con la verificación (estricta); se mantienen separadas.

### D-6 — Los modos compuestos se definen en `SKILL.md` como secuencias con gates

// satisface: AC-2, AC-5, AC-6, AC-7, AC-17, NFR-2, NFR-4

| Modo | Secuencia | Gate / interacción |
|---|---|---|
| `ensure` (default) | `detect` → `scaffold` → [`header-aggregation` batch si `--fix-frontmatter`] → `index` | Ninguna; informe final `creados N · preservados M · índice regenerado S/N`. |
| `scaffold` | `detect` → `scaffold` | Ninguna. |
| `index` | `detect` → `index` | Ninguna; acepta `--dry-run`. |
| `check` | `detect` → `check` | Ninguna; propaga exit code. |
| `migrate` | `detect` → `scaffold --dry-run` (plan) → confirmación → `scaffold` | Pregunta "¿Confirmas el plan de migración?"; sin confirmación no escribe. En modo Agent (`--yes`) se asume confirmación. |
| `rebuild` | Verificar `--force` → `scaffold --force` → `index` | Sin `--force`: `❌ rebuild es destructivo. Añade --force para confirmar.` y termina sin escribir. Con `--force`: advertencia previa `⚠️ Los cambios manuales en archivos gestionados por el scaffold se perderán.` |

`scaffold --force` sobrescribe **únicamente** los archivos que el árbol semilla posee
(`constitution.md`, `product/*.md`, `<capa>/README.md`, `templates/*.md`) y nunca elimina ni
toca artefactos de autor (`ADR-*`, `STORY-*`, guías, runbooks). Así "regenerar desde cero"
es destructivo para lo gestionado y seguro para lo autoral.

El flag `--fix-frontmatter` pertenece a `memory-system` (no a `header-aggregation`): con él,
`ensure` invoca `header-aggregation <SPECS_BASE>` en modo batch con la estrategia "saltar
todos los conflictos", de modo que solo se procesan archivos sin frontmatter y no se abre
ningún diálogo de merge en modo Agent. Sin el flag no se invoca (AC-17 lo declara opcional).

Alternativas rechazadas: (a) `rebuild` = borrar `docs/` y recrear — destruiría specs e
historial; (b) `ensure` siempre normaliza frontmatter — introduce interacción en el modo
por defecto y contradice "no sobrescribe ningún archivo existente" (AC-2).

### D-7 — `docs-wiki-builder` pasa a ser un alias delgado con plan de retirada

// satisface: AC-1, AC-11, NFR-6

`skills/docs-wiki-builder/SKILL.md` se reduce a: (1) emitir
`⚠️ docs-wiki-builder está deprecado. Usa /memory-system index.`; (2) mapear argumentos
(`--update` → `index`, `--dry-run` → `index --dry-run`, sin args → `index`); (3) invocar
`memory-system` con ese modo; (4) no contener lógica propia. `assets/wiki-index-template.md`
se elimina del alias (su sucesor es `memory-system/assets/index-template.md`).
`evals/evals.json` del alias contiene un caso: aviso de deprecación + delegación (así deja
de necesitar la exención en `config/eval-exemptions.json`, que se retira).

Calendario: alias presente en `3.3.0` (esta historia); eliminación registrada como tarea de
`4.0.0` en `CHANGELOG.md` ("Deprecated") y en la `description` del alias.

Alternativa rechazada: mantener `docs-wiki-builder` funcional en paralelo — duplica el
indexador y contradice el objetivo de un solo punto de entrada.

### D-8 — `sddf-init --level minimal|standard|full` con `standard` como default

// satisface: AC-8, AC-16

| Nivel | Pasos de `sddf-init` ejecutados |
|---|---|
| `minimal` | Paso 1 (raíz), Paso 2 (directorios base), Paso 3 (`sddf.config.yaml`), Paso 4 (`.env.template`). Omite 2b y 5. |
| `standard` (default) | Comportamiento actual completo (Pasos 1–6). |
| `full` | `standard` + Paso 5b: invocar `memory-system scaffold --yes`; su informe se concatena al informe final de `sddf-init`. |

El Paso 5b es la única inserción; el resto del skill no cambia. Como `scaffold` es
copia-si-falta y `sddf-init` ya creó `specs/` y `templates/`, el resultado de `--level full`
es idéntico al de `sddf-init` seguido de `memory-system scaffold` (AC-8): los cinco templates
compartidos ya existen y se registran como `[PRESERVADO]`. La semántica de `minimal` no está
definida en la historia; se registra como CR-007.

Alternativa rechazada: hacer que `standard` invoque el scaffold — cambiaría el comportamiento
por defecto de todos los consumidores actuales (AC-16 lo prohíbe).

### D-9 — `header-aggregation` no cambia; solo se documenta su relación

// satisface: AC-10

`skills/header-aggregation/SKILL.md` recibe una nota en su sección introductoria: "Puede ser
invocado por `memory-system ensure --fix-frontmatter` en modo batch; sigue siendo una utilidad
independiente". No se altera ningún paso ni el esquema canónico. Los campos obligatorios que
`check` valida (D-5) son un subconjunto de ese esquema, por lo que ambos skills coinciden sin
acoplarse.

### D-10 — Documentación y trazabilidad se actualizan en la misma historia

// satisface: NFR-5, AC-11

- `docs/architecture/memory-system.md`: nueva sección "10. Herramienta: skill `memory-system`"
  (modos, harness, reglas de slug, campos verificados por `check`) y corrección del árbol
  (once capas; `rfcs/` opcional, ver CR-006).
- `docs/guides/sddf-commands-pipeline.md`: nueva subsección "0. Memoria del proyecto"
  (`sddf-init --level full` / `memory-system ensure|check`).
- `README.md`: fila en la tabla de comandos y nota de deprecación de `docs-wiki-builder`.
- `CHANGELOG.md` (`3.3.0`): Added `memory-system`, Changed `sddf-init --level`, Deprecated
  `docs-wiki-builder` (eliminación en `4.0.0`).
- `AGENTS.md`/`CLAUDE.md` solo si listan skills (principio 12 de la constitución: verificar
  con `ls skills/` antes de editar).
- `docs/domains/domain-skills-map.md` y `docs/index.md`: se regeneran/ajustan para incluir
  el nuevo skill (el índice, ejecutando `memory-system index`).

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Skill `memory-system` | crear | `skills/memory-system/SKILL.md` | AC-2…AC-7, AC-9, AC-12…AC-15, AC-17 |
| Motor determinista | crear | `skills/memory-system/scripts/memory-system.js` | AC-1, AC-4, AC-12, AC-18 |
| Árbol semilla | crear | `skills/memory-system/assets/scaffold/**` (constitution, product/*, README por capa, adr-template) | AC-3, AC-14 |
| Template del índice | crear | `skills/memory-system/assets/index-template.md` | AC-15 |
| Evals del skill | crear (antes del SKILL.md, principio 11) | `skills/memory-system/evals/evals.json` | AC-12 |
| Fixtures de evals | crear | `skills/memory-system/examples/{sddf,speckit,openspec,generic}/` | AC-5, AC-9, AC-13 |
| Alias deprecado | modificar (reducir) | `skills/docs-wiki-builder/SKILL.md`, `evals/evals.json`; eliminar `assets/wiki-index-template.md` | AC-1, AC-11 |
| Exención de evals | modificar | `config/eval-exemptions.json` (retirar `docs-wiki-builder`) | AC-11 |
| `sddf-init` | modificar | `skills/sddf-init/SKILL.md` (parámetro `--level`, Paso 5b, informe) y `evals/evals.json` | AC-8, AC-16 |
| `header-aggregation` | modificar (solo nota) | `skills/header-aggregation/SKILL.md` | AC-10, AC-17 |
| Arquitectura de memoria | modificar | `docs/architecture/memory-system.md` | NFR-5 |
| Guía de pipeline | modificar | `docs/guides/sddf-commands-pipeline.md` | NFR-5 |
| README / CHANGELOG | modificar | `README.md`, `CHANGELOG.md` | NFR-5, AC-11 |
| Índice de la wiki | regenerar | `docs/index.md` (vía `memory-system index`) | AC-15 |

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| `/memory-system [modo] [flags]` | `modo ∈ {ensure, scaffold, index, check, migrate, rebuild}` (default `ensure`); flags `--harness <sddf\|speckit\|openspec\|generic>`, `--json` (check), `--dry-run` (index, scaffold), `--force` (rebuild), `--fix-frontmatter` (ensure), `--yes` (modo Agent: sin preguntas). | AC-2…AC-7, AC-13 |
| `node scripts/memory-system.js <sub> --root <SPECS_BASE> [--harness h] [--json] [--dry-run] [--force]` | `sub ∈ {detect, scaffold, index, check}`. `detect` imprime el harness; `scaffold` imprime `[CREADO]/[PRESERVADO]/[OMITIDO]` por archivo y el resumen `creados/preservados/omitidos`; `index` escribe `index.md` (o muestra el plan con `--dry-run`); `check` imprime el informe (texto o JSON) y devuelve 0/1/2. | AC-3, AC-4, AC-15, AC-18 |
| Informe de `scaffold` | Última línea `creados: N · preservados: M · omitidos por harness: K` — consumida textualmente por `ensure`, `migrate`, `rebuild` y `sddf-init --level full`. | AC-2, AC-8 |
| `/docs-wiki-builder [--update\|--dry-run]` | Emite el aviso de deprecación y delega en `/memory-system index [--dry-run]`. Sin lógica propia. | AC-1 |
| `/sddf-init [--level minimal\|standard\|full]` | Default `standard`; `full` añade `memory-system scaffold --yes` como Paso 5b y concatena su informe. | AC-8, AC-16 |
| `/header-aggregation <SPECS_BASE>` (batch, "saltar conflictos") | Invocación existente sin cambios; usada solo con `ensure --fix-frontmatter`. | AC-10, AC-17 |
| `assets/index-template.md` | Placeholders `{layer:<nombre>}`, `{layer:external}`, `{stats}`, `{date}`; el motor falla con exit 2 si falta un placeholder de capa presente en el harness. | AC-15 |

## Esquema de datos

- **Catálogo de capas** (`LAYERS`, en el motor): `{ name, dir, seeds[], indexSection }` ×
  11 (`product`, `requirements`, `specs`, `domains`, `architecture`, `adr`, `policies`,
  `guardrails`, `guides`, `runbooks`, `templates`) + raíz (`constitution.md`, `index.md`).
- **Perfil de harness** (`HARNESS_PROFILES`): `{ marker, skipLayers[], mappings{}, externalRoots[] }`
  (tabla de D-2).
- **Nodo indexable**: `{ path, slug, title, type?, hasFrontmatter, layer }` — derivado por D-4.
- **Problema de `check`**: `{ kind, path, detail }` con `kind ∈ {missing-layer, orphan, invalid-frontmatter, broken-wikilink}` (D-5).
- **Frontmatter mínimo verificado**: `type`, `slug`, `title` (+ `id`, `status` para
  `project|epic|story`). El parser del motor soporta el subconjunto YAML usado por el esquema
  canónico: escalares, cadenas entre comillas y listas `- item`; cualquier otra construcción
  se conserva sin interpretar.

## Flujos clave

### F-1 — `ensure` en un proyecto SDDF parcialmente inicializado (AC-2)

1. `SKILL.md` resuelve `SPECS_BASE` (contrato v1) y `CLI_ROOT`.
2. `detect` → `sddf`.
3. `scaffold` recorre el árbol semilla: crea `product/*` y `requirements/README.md`
   faltantes, preserva el resto; imprime `creados: 4 · preservados: 14 · omitidos: 0`.
4. Sin `--fix-frontmatter`, no se invoca `header-aggregation`.
5. `index` regenera `docs/index.md` desde el template.
6. Informe: `creados 4 · preservados 14 · índice regenerado: sí`.
7. Segunda ejecución: `creados 0 · preservados 18 · índice regenerado: sí` (solo cambia
   `updated`), sin errores (AC-12).

### F-2 — `check` en CI (AC-4, AC-18)

1. `node …/memory-system.js check --root docs --json`.
2. El motor escanea, deriva slugs, valida frontmatter y wikilinks; no escribe.
3. Devuelve JSON con `ok:false` y exit 1 si hay ≥ 1 problema; `ok:true` y exit 0 si no.

### F-3 — `migrate` en un proyecto Speckit (AC-5)

1. `detect` → `speckit` (`.specify/` presente, sin `sddf.config.yaml`).
2. `scaffold --dry-run --harness speckit` produce el plan: capas a crear (10, sin `specs/`),
   `constitution.md` mapeado a `.specify/memory/constitution.md` (preservar), archivos a
   preservar.
3. `SKILL.md` muestra el plan y pregunta; con `--yes` continúa sin preguntar.
4. Al confirmar, `scaffold --harness speckit` escribe solo lo faltante bajo `docs/`.

### F-4 — `/docs-wiki-builder --update` (AC-1)

1. El alias emite el aviso de deprecación.
2. Invoca `/memory-system index`, que ejecuta F-1 pasos 1, 2 y 5.
3. El `index.md` resultante es el mismo que produciría `/memory-system index` directamente.

### F-5 — `rebuild` (AC-6, AC-7)

1. Sin `--force`: mensaje `❌ rebuild es destructivo…`, exit sin escribir.
2. Con `--force`: advertencia de pérdida; `scaffold --force` sobrescribe solo archivos
   semilla; `index` regenera; informe con `sobrescritos: N`.

## Decisiones de complejidad justificada

- **Un script Node en un framework "de Markdown"**: la constitución admite ejecutables en
  Node para lo que necesita ser determinista; sin él AC-1, AC-4 y AC-18 no son satisfacibles.
  Se limita a módulos nativos para no exigir `package.json` en el consumidor.
- **Parser de frontmatter propio (subconjunto YAML)**: `yaml` no está disponible fuera del
  repositorio del framework; el esquema canónico solo usa escalares y listas simples.
- **Tabla de perfiles de harness**: cuatro harness con reglas distintas justifican datos en
  lugar de condicionales dispersos; no se externaliza a archivos porque no hay variabilidad
  en runtime.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | `/docs-wiki-builder` emite el aviso y el `index.md` coincide con el de `/memory-system index` (salvo `updated`) | eval TC en `docs-wiki-builder/evals` + diff de archivos | AC-1 |
| 2 | `ensure` ×2 en fixture parcial: segunda corrida `creados 0`, sin errores | eval TC con fixture `examples/sddf-partial/` | AC-2, AC-12 |
| 3 | `scaffold` crea `constitution.md`, `product/{vision,stakeholders,objectives}.md`, 11 README y 6 templates; no toca `index.md` | eval TC + listado de archivos | AC-3, AC-14 |
| 4 | `check --json` devuelve exit 0 en fixture sana; tras romper un wikilink, exit 1 y `broken-wikilink` en `problems` | prueba del script (`node --test`) con fixtures | AC-4, AC-18 |
| 5 | `migrate` en fixture `examples/speckit/` muestra plan y no escribe sin confirmación | eval TC (modo interactivo simulado) | AC-5 |
| 6 | `rebuild` sin `--force` no modifica ningún archivo (hash antes/después) | prueba del script | AC-6 |
| 7 | `rebuild --force` sobrescribe semillas, conserva `ADR-*`/`STORY-*`, regenera índice | prueba del script | AC-7 |
| 8 | `sddf-init --level full` ≡ `sddf-init` + `memory-system scaffold` (mismo listado) | eval TC en `sddf-init/evals` | AC-8, AC-16 |
| 9 | `ensure --harness openspec` no escribe bajo `openspec/`, omite `docs/specs/`, indexa `openspec/specs/**/spec.md` | prueba del script con fixture `examples/openspec/` | AC-9, AC-13 |
| 10 | `header-aggregation --file …` funciona sin `memory-system` instalado | eval existente de `header-aggregation` sin cambios | AC-10 |
| 11 | Guardrail `gr-skill-creation-checklist` pasa para `memory-system` y el alias | comandos del guardrail | — |
| 12 | Los cuatro documentos de NFR-5 mencionan `memory-system` y la deprecación | `npm run verify:links` + grep | NFR-5 |

## Risks / Trade-offs

- [Reproducibilidad del índice depende del orden de escaneo] → el motor ordena por ruta
  normalizada con `/` y compara sin distinguir mayúsculas solo para ordenar; en Windows y
  Linux el resultado es el mismo.
- [`node` ausente en el proyecto consumidor] → degradación inline documentada en D-1;
  `check` avisa que no hay exit code.
- [Alias y exención de evals: `verify:eval-inventory` fallaría si el alias no tiene evals]
  → el alias conserva `evals/evals.json` con un caso mínimo y se retira la exención.
- [`rebuild --force` interpreta "desde cero" de forma conservadora] → se documenta en el
  aviso y en `memory-system.md` que solo se regeneran archivos gestionados por el scaffold.
- [Templates compartidos ausentes en harness no-SDDF] → `[WARNING]` no bloqueante, igual
  que `sddf-init`; `check` no los reporta como problema.
- [`SKILL.md` de `memory-system` podría superar 500 líneas con seis modos] → la referencia
  de reglas de slug/frontmatter va a `references/memory-rules.md` (< 300 líneas), enlazada
  desde el modo que la necesita.

## Open Questions

Sin preguntas abiertas: las ambigüedades detectadas se resolvieron con una decisión y
quedan registradas como CR para retroalimentar `story.md` y `memory-system.md`.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: `check` exige exit code y `--json`, lo que requiere un ejecutable; la historia no menciona Node ni ningún runtime. El diseño introduce `scripts/memory-system.js` (Node ≥ 18, sin dependencias) con degradación inline si `node` no existe.
- **Documento afectado**: story.md
- **Acción requerida**: añadir a las notas de la historia que `check` (y la reproducibilidad de `index`) dependen de Node ≥ 18 disponible en PATH, sin `package.json`.

### CR-002
- **Tipo**: ambigüedad
- **Descripción**: el requerimiento "Integración con `header-aggregation`" menciona `header-aggregation --fix-frontmatter`, flag que no existe, mientras los Non-Goals prohíben cambiar ese skill. Se decide que `--fix-frontmatter` es un flag de `memory-system ensure` que invoca `header-aggregation` en batch con "saltar conflictos".
- **Documento afectado**: story.md
- **Acción requerida**: reescribir el requerimiento como `memory-system ensure --fix-frontmatter` invoca `header-aggregation` (batch, solo archivos sin frontmatter).

### CR-003
- **Tipo**: ambigüedad
- **Descripción**: "6 plantillas base en `docs/templates/`" no está enumerada; `sddf-init` centraliza 5 y `memory-system.md` lista 5 distintas (incluye `requirement-template.md` y `adr-template.md`, sin `project-intent`/`project-plan`). Se decide: las 5 de `sddf-init` + `adr-template.md`. `requirement-template.md` no se crea porque ningún skill la escribe (principio 13).
- **Documento afectado**: story.md, docs/architecture/memory-system.md
- **Acción requerida**: enumerar las seis plantillas en la historia y alinear la lista de `templates/` en `memory-system.md`.

### CR-004
- **Tipo**: ambigüedad
- **Descripción**: `memory-system.md` §7 declara frontmatter obligatorio `type, id, title, date, status`; el esquema canónico de `header-aggregation` usa `slug`, `created`, `updated` y no exige `id` fuera de specs. `check` valida el subconjunto `type, slug, title` (+ `id`, `status` en specs).
- **Documento afectado**: docs/architecture/memory-system.md
- **Acción requerida**: actualizar el invariante 2 al conjunto verificado por `check` y remitir a `header-aggregation` como esquema completo.

### CR-005
- **Tipo**: dependencia
- **Descripción**: al convertir `docs-wiki-builder` en alias desaparece su Flujo B (reorganizar archivos `.md` dispersos con confirmación). La historia no lo menciona.
- **Documento afectado**: story.md
- **Acción requerida**: añadir a Non-Goals que la reorganización de archivos no forma parte de `memory-system`; si se necesita, será una historia aparte.

### CR-006
- **Tipo**: ambigüedad
- **Descripción**: `memory-system.md` §2/§3 incluye `rfcs/` como capa de soporte (12 capas), pero la historia fija once. El diseño sigue la historia y no crea `rfcs/`.
- **Documento afectado**: docs/architecture/memory-system.md
- **Acción requerida**: marcar `rfcs/` como capa opcional no gestionada por el scaffold, o incorporarla en una historia futura.

### CR-007
- **Tipo**: ambigüedad
- **Descripción**: la historia introduce `--level minimal|standard|full` pero solo define `full`. Se decide `minimal` = Pasos 1–4 de `sddf-init` (sin copiar templates ni ofrecer políticas) y `standard` = comportamiento actual.
- **Documento afectado**: story.md
- **Acción requerida**: documentar la semántica de `minimal` y `standard` en el requerimiento de integración con `sddf-init`.

### CR-008
- **Tipo**: reutilización
- **Descripción**: `docs-wiki-builder` está exento de evals en `config/eval-exemptions.json`; el alias con un caso mínimo de deprecación permite retirar la exención y cumplir el guardrail de skills.
- **Documento afectado**: design.md
- **Acción requerida**: incluir en tasks.md la retirada de la exención y el eval del alias.
