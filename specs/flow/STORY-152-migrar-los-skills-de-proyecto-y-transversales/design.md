---
alwaysApply: false
type: design
id: STORY-152
slug: STORY-152-migrar-los-skills-de-proyecto-y-transversales-design
title: "Design: Migrar los skills de proyecto y transversales"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-26-layout-y-flow-forward-mejorado
story: STORY-152
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-152-migrar-los-skills-de-proyecto-y-transversales
  - STORY-148-contrato-de-rutas-fijas-y-gate-determinista
  - STORY-147-adr-del-layout-fijo-de-tres-raices
  - STORY-149-sddf-init-crea-el-nuevo-layout
  - STORY-151-migrar-los-skills-de-epica-a-specs-flow
  - EPIC-26-layout-y-flow-forward-mejorado
---

<!-- Referencias -->
[[STORY-152-migrar-los-skills-de-proyecto-y-transversales]] · [[STORY-148-contrato-de-rutas-fijas-y-gate-determinista]] · [[STORY-147-adr-del-layout-fijo-de-tres-raices]] · [[STORY-149-sddf-init-crea-el-nuevo-layout]] · [[STORY-151-migrar-los-skills-de-epica-a-specs-flow]] · [[EPIC-26-layout-y-flow-forward-mejorado]]

## Context

La historia migra al layout fijo de ADR-0016 (STORY-147) los seis skills `project-*`, `memory-system`, `header-aggregation`, `reverse-engineering` y `sddf-constitution`. También convierte `skill-preflight` en el diagnóstico del layout legado y elimina el alias `docs-wiki-builder`. Adopta el contrato de STORY-148: marcador `<!-- SDDF-FIXED-LAYOUT: v1 -->`, reglas R1–R4 de `scripts/verify-fixed-layout.js`, región `SDDF-LEGACY-DIAGNOSTIC` exclusiva de `skill-preflight` (D-3) y lista `PENDING_MIGRATION` (D-4). El texto canónico del bloque es el de STORY-150 y STORY-151 (D-1).

Estado verificado en el filesystem (2026-10-22):

| Fuente | Hallazgo |
|---|---|
| Inventario de la historia | 26 archivos con `SPECS_BASE`/`SDDF_ROOT` en los skills de AC-1 (recuento confirmado con `grep -rlE`), más 3 en `skill-preflight` y 1 en `docs-wiki-builder`. |
| `project-begin`, `project-discovery`, `project-planning`, `project-story-mapping`, `project-context-diagram`, `project-flow` | Paso 0 con el bloque v1 (completo o abreviado). Todas las rutas cuelgan de `$SPECS_BASE/product/`, `$SPECS_BASE/requirements/`, `$SPECS_BASE/templates/` o `$SPECS_BASE/architecture/c4/`. `project-planning` inventaría épicas con `$EPICS_DIR = $SPECS_BASE/specs/epics/` (l. 82) y su rol `assets/agents/planning.md:30` prohíbe «escribir en `$SPECS_BASE`». Solo `project-flow` usa `CLI_ROOT` (para localizar skills instalados). Sus evals no contienen rutas legadas. |
| `header-aggregation` | Paso 0 v1. Busca nombres cortos y recorre el batch en `$SPECS_BASE/specs/{stories,epics}/` (l. 61–62, 118–123). Deriva `type`/`id`/`slug` de la ruta relativa a `$SPECS_BASE` (l. 72). Sus fixtures `examples/{batch,con-frontmatter,sin-frontmatter}/docs/specs/…` y los cuatro `examples/*/sddf.config.yaml` usan `root: docs`, y sus evals los citan 10 veces. |
| `reverse-engineering` | «Fase 0» con el marcador v1 y una precedencia abreviada en una línea (l. 29). Lee templates en `$SPECS_BASE/templates/` con fallback `$CLI_ROOT/skills/project-discovery/assets/` y escribe en `$SPECS_BASE/product/` y `$SPECS_BASE/requirements/`. |
| `sddf-constitution` | Paso 0 v1 y 38 rutas `$SPECS_BASE/{constitution.md,policies/,guardrails/}`, incluida la referencia de import `@$SPECS_BASE/constitution.md` (l. 366, 372). No usa `CLI_ROOT` fuera del Paso 0. No tiene `evals/`. |
| `memory-system` (`SKILL.md`, 47 coincidencias) | Paso 0 v1 con una excepción de bootstrap. El motor se invoca como `--root <SPECS_BASE>`. `scaffold` crea `specs/{epics,stories}/` (l. 38, 503, 538). La l. 327 contiene `--cli-root` y `sddf.config.yaml`: R4 la marcaría como falso positivo (`root` tras guion). Las l. 7, 23, 137 y 550–554 citan `docs-wiki-builder`. |
| `memory-system/scripts/memory-system.js` | `LAYERS` incluye `specs` (once capas): `scaffold` la crea, `check` la exige (`missing-layer`) y `assertSeedsCoverLayers` exige una semilla. `scanNodes` solo recorre `--root`, con `repoRoot = dirname(root)`. `deriveLayer` asigna `specs-epics`/`specs-stories` según el segundo segmento. `assertInsideRoot` solo permite escribir bajo `--root`. Hay 18 menciones de `SPECS_BASE` en comentarios, `USAGE` y el mensaje `falta --root <SPECS_BASE>`. Ninguna prueba compara ese texto. |
| `memory-system` (resto) | `assets/scaffold/specs/{README.md,epics/.gitkeep,stories/.gitkeep}`. `assets/index-template.md` declara `{layer:specs}`, `{layer:specs-epics}` y `{layer:specs-stories}`. `scripts/epic-template.js`: `discoverEpics` recorre `<root>/specs/*/EPIC-*/epic.md` (2 menciones). `references/memory-rules.md` (14) y `dod-rules.md` (5). `README.md` (3). `evals/evals.json`: 29 casos, 2 `SPECS_BASE`, 16 `root: docs`, un `not_contains` con `docs-wiki-builder está deprecado`. `examples/`: los fixtures de proyecto actual (`sddf`, `sane`, `broken`, `sddf-partial`, `requirements-{fragmented,legacy,mixed}`, `srs-single`) tienen work items en `docs/specs/`. `specs-3-levels` y `epic-template-v1` modelan entradas legadas. |
| `skill-preflight` | `## Contrato de resolución` con el bloque v1 y una tabla de precedencia `SDDF_ROOT` → `root` → `docs`. Verifica `specs/epics/` y `specs/stories/` bajo `SPECS_BASE` e informa `[OK] SPECS_BASE = …`. Su frontmatter cita `SDDF_ROOT` en `description` y `triggers`. Evals: 4 casos de resolución de raíz (TC-001–TC-004). |
| `docs-wiki-builder` | Alias sin lógica (`SKILL.md`, `README.md`, `evals/evals.json`). Menciones vigentes: `skills/memory-system/SKILL.md`, `skills/memory-system/evals/evals.json`, `docs/architecture/memory-system.md` §10.6, `docs/guides/sddf-commands-pipeline.md:165`, `docs/runbooks/actualizar-spec-de-proyecto.md:229` y `README.md:265`. Ningún script ni prueba lo nombra; `package.json › files` publica `skills/` completo. |
| Gate heredado | `scripts/audit-root-resolution.js` (que STORY-148 reemplaza) exige que `skill-preflight` se declare «diagnóstico explícito» y no cite `openspec/config.yaml`. STORY-148 D-5 conserva ambas reglas. |
| Pruebas | `test/memory-system.test.js`: `LAYER_DIRS` con 11 capas (l. 316, 586–594), `.gitkeep` de `specs/epics`/`specs/stories` en `scaffold` (l. 348, 574–575), nodos `specs/stories/STORY-001-a/…` de los fixtures (l. 158, 193, 476, 805) y `skipLayers: ['specs']` (l. 728, 982–1002). `test/requirements.test.js:196` escribe en `specs/stories/` de un fixture. `test/epic-template.test.js` usa el fixture legado (sin cambio). Ninguna prueba lee los `SKILL.md` de los skills `project-*`, `header-aggregation`, `reverse-engineering` ni `skill-preflight`. |
| Dependencias | `scripts/verify-fixed-layout.js` (STORY-148) y ADR-0016 (STORY-147) **aún no existen**: ambas historias están en `READY-FOR-IMPLEMENT`. `docs/guides/artifact-directory-migration.md` existe (STORY-154 redacta su sección de migración). `docs/guides/` no se publica en el paquete. |

Stakeholders: el practitioner de un repo inicializado con `/sddf-init` (AC-1, AC-3); el mantenedor de un proyecto con layout legado que ejecuta `/skill-preflight` (AC-2); quien invocaba `/docs-wiki-builder` (AC-4); STORY-157, que verifica que `PENDING_MIGRATION` quedó vacía.

## Goals / Non-Goals

**Goals:**
- Sustituir el Paso 0 de los once `SKILL.md` por el bloque canónico del contrato de layout fijo // satisface: AC-1, CNF-1, CNF-3
- Reescribir las rutas `$SPECS_BASE/…` de esos skills (SKILL.md, README.md, `references/`, `assets/agents/`, `examples/`, `evals/`, scripts) a rutas fijas relativas a `REPO_ROOT` // satisface: AC-1, CNF-2, CNF-3
- Que `/memory-system index` liste los work items de `specs/flow/` y que `scaffold` deje de crear `docs/specs/` // satisface: AC-1
- Convertir `skill-preflight` en diagnóstico del layout fijo y de las señales del layout legado, sin escrituras // satisface: AC-2, AC-3, CNF-1
- Eliminar `skills/docs-wiki-builder/` y sus menciones vigentes, y registrarlo en el CHANGELOG como cambio incompatible // satisface: AC-4
- Retirar los doce skills afectados de `PENDING_MIGRATION` // satisface: AC-1, AC-4

**Non-Goals:**
- Validar `sddf.config.yaml` o detectar rutas viejas en `/memory-system check` (épica de Enforcement)
- Mover `docs/requirements/` a `specs/living/` (épica de Living Spec)
- Redactar la guía `docs/guides/artifact-directory-migration.md` ni su nota para borrar a mano las copias instaladas de `docs-wiki-builder` (STORY-154, CR-003)
- Que `memory-system scaffold` cree `specs/flow/` (responsabilidad de `/sddf-init`, STORY-149) o que los migradores `specs-3-levels`, `epic-template-v1`, `srs-single` y `requirements-fragmented` lean o escriban en `specs/flow/` (D-6)
- Mover work items de este repositorio (STORY-153) ni regenerar `docs/index.md`
- Crear `scripts/verify-fixed-layout.js` o cambiar sus reglas (STORY-148)
- Reinstalar las copias de runtime (`.claude/skills/`) o ejecutar `npm run test:eval` (a criterio humano, CNF-2)

## Decisions

### D-1 — Paso 0 con el bloque canónico del contrato // satisface: AC-1, CNF-1, CNF-3

En los once `skills/<skill>/SKILL.md`, el bloque desde `<!-- SDDF-ROOT-RESOLUTION: v1 -->` hasta el siguiente encabezado se sustituye por el texto canónico de STORY-148 D-1, el mismo de STORY-150 y STORY-151. Cada skill conserva su encabezado y su número de paso:

```markdown
<!-- SDDF-FIXED-LAYOUT: v1 -->

Resuelve `REPO_ROOT` (raíz del repositorio) y usa rutas fijas relativas a él:
work items en `specs/flow/`, templates en `docs/templates/` y DoD en `docs/guardrails/`.
El layout no es configurable (ADR-0016).
```

| Skill | Encabezado que se conserva | Se elimina | Se añade tras el bloque |
|---|---|---|---|
| `project-begin`, `project-discovery`, `project-planning`, `project-story-mapping`, `project-context-diagram`, `sddf-constitution` | `### Paso 0 — Resolver contexto local` | pasos 1–4, incluida la línea `CLI_ROOT` (no lo usan) | — |
| `header-aggregation` | `## Paso 0 — Resolver contexto local` | pasos 1–4 | — |
| `project-flow` | `## Paso 0 — Resolver contexto local` | pasos 1–4 | línea `CLI_ROOT` para localizar skills instalados |
| `reverse-engineering` | `## Fase 0 — Resolver contexto, templates e inventario` | línea de precedencia (l. 29) | línea `CLI_ROOT` para los seeds y la referencia de `project-discovery` |
| `memory-system` | `### Paso 0 — Resolver contexto local` | pasos 1–4 y la excepción de bootstrap (pasa a D-3) | línea `CLI_ROOT` para las plantillas compartidas y `--cli-root` |
| `skill-preflight` | el encabezado pasa a `## Contrato de layout` | tabla de precedencia y párrafo de raíz | el texto actual sobre `CLI_ROOT` y `config/runtimes.json`, sin cambios de fondo |

La línea `CLI_ROOT` dice: «Resuelve `CLI_ROOT` (instalación del paquete) por separado y solo para <uso>; nunca lo derives de `REPO_ROOT`.» Se conserva la línea sobre `/skill-preflight` donde exista. En el resto del cuerpo, las frases que describen la raíz configurable se reescriben como rutas fijas: `project-begin` l. 36, `project-story-mapping` l. 46 («`$STORY_MAP_PATH` es la ruta fija `docs/product/story-map.md`») y `memory-system` l. 488–489.

Cumplimiento: R1 (marcador), R2 (los cuatro tokens en el bloque), R3 (sin `SDDF-ROOT-RESOLUTION: v1`, `SPECS_BASE` ni `SDDF_ROOT`) y R4 (ninguna línea combina `root` y `sddf.config.yaml`). La l. 327 de `memory-system` (`--cli-root` + `sddf.config.yaml`) se parte en dos frases. Antes de cerrar se ejecuta el contrato de verificación 5 sobre los once archivos.

**Alternativas rechazadas:**
- **Conservar `CLI_ROOT` en todos:** en ocho skills no tiene uso; mantenerlo sería ruido (P12) y contradice el criterio de STORY-150.
- **Meter `CLI_ROOT` dentro del bloque:** el bloque canónico debe ser idéntico en todos los skills migrados (P5).
- **Mantener el bloque v1 y cambiar solo las rutas de salida:** seguiría aceptando `SDDF_ROOT` y `root`, y el gate fallaría por R3 y R4.

### D-2 — Mapa de sustitución de rutas // satisface: AC-1, CNF-2, CNF-3

Se aplica una regla única a todos los archivos de los once skills: `SKILL.md` (incluido el frontmatter), `README.md`, `references/**`, `assets/agents/**`, `examples/**/*.md` y `evals/evals.json`. Las rutas se escriben relativas a `REPO_ROOT`, sin variable:

| Forma legada | Forma fija | Dónde aparece |
|---|---|---|
| `$SPECS_BASE/product/…` | `docs/product/…` | project-*, reverse-engineering, header-aggregation |
| `$SPECS_BASE/requirements/…` | `docs/requirements/…` | project-*, reverse-engineering, header-aggregation |
| `$SPECS_BASE/templates/…`, «centralizarlo en `$SPECS_BASE/templates/`» | `docs/templates/…` | project-begin, project-discovery, project-planning, reverse-engineering |
| `$SPECS_BASE/architecture/c4/context-diagram.puml` | `docs/architecture/c4/context-diagram.puml` | project-context-diagram (SKILL, README y los dos `examples/test-0*.md`) |
| `$SPECS_BASE/constitution.md`, `policies/`, `guardrails/` | `docs/constitution.md`, `docs/policies/`, `docs/guardrails/` | sddf-constitution, memory-system |
| `@$SPECS_BASE/constitution.md`, `@$SPECS_BASE/policies/constitution.md` | `@docs/constitution.md`, `@docs/policies/constitution.md` | sddf-constitution l. 366, 372 |
| `$SPECS_BASE/specs/epics/` (`$EPICS_DIR`) | `specs/flow/EPIC-*/epic.md` (D-8) | project-planning |
| `$SPECS_BASE/specs/{stories,epics}/…` | `specs/flow/STORY-*/…`, `specs/flow/EPIC-*/…` (D-7) | header-aggregation |
| «escribir en `$SPECS_BASE`», «sin tocar `$SPECS_BASE`» | «escribir en `docs/`», «sin tocar `docs/`» | project-discovery, project-planning y su rol `planning.md` |
| `$SPECS_BASE/` y `<SPECS_BASE>` en `memory-system` | `docs/` y `--root docs` (D-3) | memory-system |
| Tabla `$SPECS_BASE` de `README.md` (memory-system l. 42, sddf-constitution l. 35) | fila «`docs/` y `specs/flow/` — rutas fijas (ADR-0016)» | READMEs |

**Alternativas rechazadas:**
- **Variable nueva (`DOCS_BASE`, `$EPICS_DIR` relativo):** reintroduce la indirección que ADR-0016 retira.
- **Dejar `README.md`, `references/` y ejemplos con `$SPECS_BASE`:** el gate solo lee `SKILL.md`, pero CNF-3 cuenta todos los archivos del skill, y una referencia obsoleta induce al LLM a resolver una raíz.

### D-3 — `memory-system`: raíz de conocimiento fija `docs/` // satisface: AC-1, CNF-3

- El skill invoca siempre el motor con `--root docs`, relativo a `REPO_ROOT`. El flag `--root` del motor se conserva: las pruebas y los fixtures pasan otras rutas, y el layout fijo del skill no depende del motor. El bootstrap de `scaffold`/`ensure` sigue igual: si `docs/` no existe pero `REPO_ROOT` sí, el motor lo crea.
- En `scripts/memory-system.js` y `scripts/epic-template.js`, las menciones `SPECS_BASE` de comentarios, `USAGE` y mensajes pasan a `DOCS_DIR`. Ejemplos: `uso: memory-system.js <…> --root <DOCS_DIR>` y `falta --root <DOCS_DIR>`. Los identificadores en minúsculas (`specsBase`) no se renombran: no los cuenta CNF-3 y renombrarlos ampliaría el diff sin cambiar el comportamiento.
- `references/memory-rules.md` y `dod-rules.md`: «`SPECS_BASE`» pasa a «la raíz de conocimiento (`docs/`, el `--root` del motor)», y «directorio padre de `SPECS_BASE`» a «`REPO_ROOT`, directorio padre de `docs/`».

**Alternativas rechazadas:**
- **Quitar `--root` y fijar `docs` en el motor:** rompe todas las pruebas con fixtures (`examples/<fixture>/docs`) sin aportar nada; el contrato fijo pertenece al skill.
- **Renombrar `specsBase` en los tres scripts:** son más de 150 apariciones sin valor funcional (P12).

### D-4 — `memory-system index`: work items de `specs/flow/` // satisface: AC-1

`scanNodes(docsDir, harness)` añade un tercer origen después de los nodos de `docs/` y antes de los externos: el **origen flow**, en `<REPO_ROOT>/specs/flow/`, donde `REPO_ROOT = dirname(docsDir)`.

| Regla | Contrato |
|---|---|
| Constante | `FLOW_DIR = 'specs/flow'` (relativa a `REPO_ROOT`) |
| Recorrido | el mismo `walk` y las mismas exclusiones (`EXCLUDED_DIRS`, `EXCLUDED_FILES`, `*-report.md`) |
| `relPath` | relativa a `docsDir` con `/`: `../specs/flow/STORY-001-a/story.md`, la misma convención que los nodos externos y válida como enlace desde `docs/index.md` |
| Capa (`deriveNode(file, docsDir, { flow: true })`) | se calcula sobre la ruta relativa a `specs/flow/`: `archive/**` → `specs-archive`; primer segmento `EPIC-*` → `specs-epics`; `STORY-*` → `specs-stories`; cualquier otro → `specs` |
| Slug y título | reglas actuales (`slug` declarado; si no, el directorio para `story.md`/`epic.md`) |
| Naturaleza | nodo **propio**: `check` lo evalúa (`orphan`, `invalid-frontmatter`, `broken-wikilink`, `requirement`), igual que hoy los de `docs/specs/` |
| Harness | si el perfil incluye `specs` en `skipLayers` (Speckit, OpenSpec), el origen flow no se recorre: `specs/` pertenece al harness |
| Ausencia | sin `specs/flow/`, el origen está vacío, sin aviso |
| Escritura | ninguna: `index` sigue escribiendo solo `docs/index.md` (guardia `assertInsideRoot` sin cambios) |

`KNOWN_LAYERS` deja de derivar el desglose de `specs` desde `LAYERS` (D-5). Se declara de forma explícita: `root`, las capas indexables de `LAYERS`, `specs`, `specs-epics`, `specs-stories`, `specs-archive` y `external`.

`assets/index-template.md`: la sección `## 🗂️ Especificaciones (specs/)` pasa a `## 🗂️ Work items (specs/flow/)` y contiene `{layer:specs}`, `### Épicas` (`{layer:specs-epics}`), `### Historias de usuario` (`{layer:specs-stories}`, con la nota de convención de directorio actual) y el bloque nuevo `### Historias archivadas (archive/)` (`{layer:specs-archive}`). Los subtítulos no repiten la ruta, porque durante la transición conviven las entradas de `docs/specs/`.

Transición: un repo sin migrar (`docs/specs/` bajo `docs/`) sigue indexando esos nodos con `deriveLayer` sin cambios (`specs-epics`/`specs-stories`). El índice no falla mientras conviven ambos layouts.

**Alternativas rechazadas:**
- **Capas nuevas `flow-*`:** obligaría a que el template declare las capas legadas y las nuevas. Un repo sin migrar fallaría con `la capa "specs-stories" tiene N nodo(s) pero el template no declara…`, o el índice mostraría secciones duplicadas.
- **Tratar `specs/flow/` como raíz externa del perfil `sddf`:** los externos no se evalúan en `check` y se agrupan bajo «Artefactos externos». Los work items perderían la verificación que tienen hoy.
- **Mover `index.md` a `REPO_ROOT` o escanear todo `REPO_ROOT`:** cambia el contrato del índice y arrastraría `skills/`, `node_modules/`, etc.

### D-5 — Catálogo de capas sin `specs`: el scaffold no crea `docs/specs/` // satisface: AC-1

- `LAYERS` pasa a **diez** capas: `product`, `requirements`, `domains`, `architecture`, `adr`, `policies`, `guardrails`, `guides`, `runbooks`, `templates`. En consecuencia, `scaffold` no crea `docs/specs/`, `check` no informa `missing-layer specs/` en un repo con layout fijo, y `assertSeedsCoverLayers` deja de exigir una semilla `specs`.
- Se eliminan `assets/scaffold/specs/README.md`, `specs/epics/.gitkeep` y `specs/stories/.gitkeep`.
- `skipLayers: ['specs']` de Speckit y OpenSpec se conserva: ahora solo controla el origen flow (D-4) y el texto `_(gestionado por el harness)_` de los placeholders `specs*`. `scaffold` deja de emitir `[OMITIDO] specs/`, porque ninguna semilla cae en esa capa.
- El aviso de tres niveles (`detectLegacyLevels`) se conserva sin cambios.
- `SKILL.md` (l. 28–29, 38, 42, 323, 502–503, 537–538) y `references/memory-rules.md` (§5, §6 y las menciones de «once capas») pasan a diez capas. Los directorios de work items los crea `/sddf-init`.

Esto atiende CR-002 de STORY-149 (`/sddf-init --level full` dejaba `docs/specs/` en un repo limpio, contra CS-8).

**Alternativas rechazadas:**
- **Que `scaffold` cree `specs/flow/`:** exige escribir fuera de `docs/` (la guardia D-5 de STORY-098 lo prohíbe) y duplica la responsabilidad de `/sddf-init` (P11).
- **Conservar `specs` en `LAYERS` y omitirla con un caso especial:** el catálogo dejaría de ser la fuente única de `scaffold`, `check` e `index`.

### D-6 — Migradores legados sin cambio de alcance // satisface: CNF-3

`migrate --from=epic-template-v1` sigue descubriendo `docs/specs/*/EPIC-*/epic.md` y `--from=specs-3-levels` sigue colapsando `docs/specs/0N-*` en `docs/specs/{epics,stories}`. `srs-single` y `requirements-fragmented` reescriben enlaces solo bajo `docs/`. Todos transforman entradas del layout legado, que se procesan **antes** de la migración a `specs/flow/`. Solo cambia el texto: «`specs/*/EPIC-*/epic.md`» pasa a «`docs/specs/*/EPIC-*/epic.md` (layout legado)» en `SKILL.md` l. 106 y 415 y en el comentario de `epic-template.js`. Los fixtures `examples/specs-3-levels/` y `examples/epic-template-v1/` no se tocan.

**Alternativas rechazadas:**
- **Extender los migradores a `specs/flow/`:** exige abrir la guardia de escritura fuera de `docs/`. Una épica v1 en `specs/flow/` no existe: el template v2 es anterior a EPIC-26 (YAGNI).

### D-7 — `header-aggregation` con dos raíces fijas // satisface: AC-1, CNF-2

| Elemento | Contrato nuevo |
|---|---|
| Nombre corto (Paso 1) | `specs/flow/STORY-*/story.md` → `specs/flow/EPIC-*/epic.md` → `docs/product/<término>.md` → `docs/requirements/**/<término>*.md` |
| Derivación (Paso 2) | la tabla se evalúa sobre la ruta relativa a `REPO_ROOT`: `docs/product/…`, `docs/requirements/…`, directorio `specs/flow/STORY-*` → `story`, `specs/flow/EPIC-*` → `epic`, directorio `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>` → `story` con `id: STORY-NNN` y `slug` igual al nombre del directorio **sin** el prefijo de fecha; el resto → `wiki` |
| Batch (Paso 4.1) | `REPO_ROOT` (o `.`) → `docs/product/**`, `docs/requirements/**`, `specs/flow/EPIC-*/epic.md`, `specs/flow/STORY-*/story.md`; `docs/` → solo `product/` y `requirements/`; `specs/flow/` → solo los canónicos de épicas e historias; un subdirectorio → sus Markdown (así `specs/flow/archive/` se procesa solo si se pide de forma explícita) |
| `memory-system ensure --fix-frontmatter` | pasa `REPO_ROOT` como input del batch: conserva el conjunto actual (product, requirements, épicas, historias) |
| Fixtures | `git mv examples/{batch,con-frontmatter,sin-frontmatter}/docs/specs/{epics,stories}/<X>` → `examples/<fixture>/specs/flow/<X>`; `examples/*/sddf.config.yaml` cambia `root: docs` por el comentario `# marcador de proyecto SDDF (layout fijo, ADR-0016)` |

**Alternativas rechazadas:**
- **Slug de una archivada con el prefijo de fecha:** rompería los wikilinks `[[STORY-NNN-<slug>]]` existentes al archivar.
- **Incluir `archive/` en el batch por defecto:** las historias archivadas están `COMPLETED` y congeladas, así que normalizarlas en masa no aporta nada.

### D-8 — `project-planning`: inventario de épicas en `specs/flow/` // satisface: AC-1

`$EPICS_DIR = $SPECS_BASE/specs/epics/` se sustituye por el patrón `specs/flow/EPIC-*/epic.md`, con la misma regla de STORY-151 D-3, para no confundir épicas con historias en el directorio plano. `$EPICS_INVENTORY` se construye igual que hoy. Sin coincidencias, el inventario queda vacío y la propuesta continúa como ahora. No se consulta `archive/`, porque las épicas no se archivan.

### D-9 — `skill-preflight`: diagnóstico del layout fijo y de las señales legadas // satisface: AC-2, AC-3, CNF-1

Estructura nueva de `skills/skill-preflight/SKILL.md`:

| Sección | Contenido |
|---|---|
| Frontmatter | `description`: «Diagnostica explícitamente el layout fijo SDDF, las señales del layout legado y el estado del entorno sin modificarlo…»; `triggers` sustituye «revisar SDDF_ROOT» por «diagnosticar layout legado». Sin `SPECS_BASE` ni `SDDF_ROOT` (están fuera de la región) |
| Introducción | se conserva «diagnóstico explícito, de solo lectura y bajo demanda» (regla heredada de STORY-148 D-5); «No hace» deja de citar `SPECS_BASE`/`ROOT_SOURCE` |
| `## Contrato de layout` | bloque canónico (D-1) y el texto de `CLI_ROOT`. `REPO_ROOT` es la raíz del repositorio de trabajo (top-level de git o, si no es un repo git, el directorio de la invocación); ya no se exige `sddf.config.yaml` |
| Verificación 1 — Raíz | `[OK] REPO_ROOT = <ruta>` |
| Verificación 2 — Layout fijo (AC-3) | por cada ruta de `specs/flow/`, `specs/flow/archive/`, `specs/living/`, `workflow/`, `docs/templates/`: `[OK] <ruta> existe` o `[WARNING] <ruta> no encontrado`. El sufijo `— ejecuta /sddf-init` se añade solo si la Verificación 3 no detecta ninguna señal legada: con alguna de L1–L3, `/sddf-init` no crea el layout (CS-13, STORY-149 D-5) y la remisión la da la línea `ℹ️ Guía de migración` |
| Verificación 3 — Señales de layout legado (AC-2) | **dentro** de `<!-- SDDF-LEGACY-DIAGNOSTIC:start -->` … `<!-- SDDF-LEGACY-DIAGNOSTIC:end -->` (tabla abajo) |
| Verificación 4 — Templates centrales | los seis templates de hoy, buscados en `docs/templates/` |
| Verificación 5 — Runtime | sin cambios (`CLI_ROOT`, `config/runtimes.json`, `SDDF_CLI_ROOT`) |
| Informe final | sin las líneas `SPECS_BASE`/`ROOT_SOURCE`; cierra con `✓ Diagnóstico completado — sin cambios`. Se elimina la rama `✗ Diagnóstico incompleto`, porque ya no hay fuente explícita que pueda ser inválida |

Señales de la Verificación 3, evaluadas todas y en este orden:

| Señal | Detección | Línea emitida solo si está presente |
|---|---|---|
| L1 | existe el directorio `docs/specs/` | `[WARNING] Layout legado: existe docs/specs/ — los work items van en specs/flow/` |
| L2 | `sddf.config.yaml` existe y declara la clave superior `root` | `[WARNING] Layout legado: sddf.config.yaml declara la clave root (<valor>), que ya no se lee` |
| L3 | la variable de entorno `SDDF_ROOT` está definida (aunque esté vacía) | `[WARNING] Layout legado: SDDF_ROOT está definida (<valor>) y ya no se usa` |
| Cierre | al menos una señal presente | `ℹ️ Guía de migración: docs/guides/artifact-directory-migration.md (repositorio de agile-sddf)` |

- Las señales ausentes no producen ninguna línea. Sin señales, la verificación no emite nada (AC-3: «no emite avisos de layout legado»).
- Las señales son `[WARNING]`, nunca `[ERROR]`: el diagnóstico describe y no bloquea. Un `sddf.config.yaml` ilegible se informa como `[WARNING] sddf.config.yaml no se pudo leer — señal L2 no evaluada` y el diagnóstico continúa.
- Un repo en estado mixto (layout fijo y señales legadas, STORY-149 D-2) recibe las dos verificaciones completas.
- Nada se escribe ni se crea en ninguna rama (AC-2 «Pero no modifica ningún archivo»).

Uso de los tokens legados en `skill-preflight` (CNF-1, CS-2): `SPECS_BASE` desaparece del skill; `SDDF_ROOT` solo aparece en (a) las líneas de la región, (b) la lista «Señales de layout legado» de `README.md` y (c) los casos de evals que fijan la señal L3.

**Alternativas rechazadas:**
- **Señales como `[ERROR]` con cierre `✗`:** un proyecto sin migrar es un estado válido mientras se migra. AC-2 pide nombrar y remitir, no bloquear.
- **Emitir siempre las tres señales con `[OK] ausente`:** contradice «omite las ausentes» (AC-2) y añade ruido en un repo limpio (AC-3).
- **Que la guía se busque en el repo consumidor:** `docs/guides/` no se publica en el paquete, así que la ruta se cita como referencia del repositorio de agile-sddf, que es lo que AC-2 exige.

### D-10 — Eliminación de `docs-wiki-builder` // satisface: AC-4

| Archivo | Cambio |
|---|---|
| `skills/docs-wiki-builder/` | **eliminar** (`git rm -r`: `SKILL.md`, `README.md`, `evals/evals.json`) |
| `skills/memory-system/SKILL.md` | quitar «Sustituye a docs-wiki-builder» (l. 7), la frase «o el skill deprecado…» (l. 22–23), «`/docs-wiki-builder`,» de la l. 137 y la sección `## Deprecación de docs-wiki-builder` (l. 550–554) |
| `skills/memory-system/evals/evals.json` | quitar el `not_contains` `docs-wiki-builder está deprecado` (l. 37); los demás valores del caso no cambian |
| `docs/architecture/memory-system.md` §10.6 | título «Alias histórico del modo index (eliminado)»: el alias de STORY-044, deprecado desde 3.3.0, se eliminó en la versión mayor de EPIC-26; el índice se regenera con `/memory-system index`. Se conserva el párrafo sobre `header-aggregation`, sin nombrar el alias |
| `docs/guides/sddf-commands-pipeline.md:165-166` | eliminar la nota de deprecación |
| `docs/runbooks/actualizar-spec-de-proyecto.md:229` | «Lo mantiene un skill (`docs-wiki-builder`)» → «Lo regenera `/memory-system index`» |
| `README.md:265` | quitar la frase «`docs-wiki-builder` queda como alias deprecado…» |
| `CHANGELOG.md` `## [Unreleased]` | nueva sección `### Removed`: «**BREAKING** — se elimina el alias deprecado `docs-wiki-builder` (anunciado para 4.0.0). Usa `/memory-system index` (`--update` → `index`, `--dry-run` → `index --dry-run`).» |

Se conservan las menciones históricas que AC-4 permite: entradas previas del CHANGELOG, historias cerradas, el título de STORY-095 en `docs/index.md` y `docs/requirements/`. La nota para borrar a mano las copias instaladas corresponde a la guía de STORY-154 (CR-003).

**Alternativas rechazadas:**
- **Migrarlo al layout fijo:** supone esfuerzo sobre un alias sin lógica cuya eliminación ya estaba anunciada (decisión de la historia).
- **Dejar un stub que avise:** prolonga el alias sin fecha y el gate lo seguiría validando.

### D-11 — Retiro de la lista transitoria del gate // satisface: AC-1, AC-4

En el mismo cambio, se retiran de `PENDING_MIGRATION` de `scripts/verify-fixed-layout.js` estas doce entradas: `docs-wiki-builder` (su directorio desaparece; si no, salta el error de higiene «no existe en skills/»), `header-aggregation`, `memory-system`, `project-begin`, `project-context-diagram`, `project-discovery`, `project-flow`, `project-planning`, `project-story-mapping`, `reverse-engineering`, `sddf-constitution` y `skill-preflight`. La lista conserva el orden alfabético.

**Alternativas rechazadas:**
- **Retirarlos en otra historia:** el gate no validaría la migración y fallaría por la regla «ya cumple el contrato — retíralo de la lista».

### D-12 — Fixtures y evals // satisface: CNF-2, AC-1, AC-2, AC-3

**`memory-system`:**
- En los fixtures de proyecto actual (`sddf`, `sane`, `broken`, `sddf-partial`, `requirements-fragmented`, `requirements-legacy`, `requirements-mixed`, `srs-single`): `git mv examples/<f>/docs/specs/stories/<STORY>` → `examples/<f>/specs/flow/<STORY>`; se eliminan los `docs/specs/epics/.gitkeep` y los `docs/specs/` que queden vacíos. `specs-3-levels` y `epic-template-v1` no cambian (D-6).
- `examples/*/sddf.config.yaml`: `root: docs` pasa al comentario de D-7. El archivo se mantiene porque es el marcador del harness `sddf`.
- `evals/evals.json`: eliminar `SPECS_BASE` («resolver SPECS_BASE=docs» → «usar la raíz fija docs/») y «(root: docs)»; actualizar a `../specs/flow/…` las rutas `specs/stories/…` de las descripciones y `expected`. En TC-001 (índice del fixture `sddf`), `contains` añade `../specs/flow/STORY-001-a/story.md` (AC-1).

**`header-aggregation`:** se actualizan los tres casos con `input_path`, `context` y `expected` en `specs/flow/…` (D-7), sin «root: docs».

**`skill-preflight`:** los casos TC-001–TC-003 verifican una resolución de raíz que ya no existe y **se retiran**; sus IDs no se reutilizan. TC-004 se adapta a «templates faltantes en `docs/templates/` son advertencias no mutantes». Casos nuevos:

| ID | Nombre | Fixture | Expectativa |
|---|---|---|---|
| TC-005 | `layout-fijo-sin-senales` | repo con `specs/flow/`, `specs/flow/archive/`, `specs/living/`, `workflow/`, `docs/templates/`, sin `docs/specs/`, sin `root`, sin `SDDF_ROOT` | `contains`: las cinco rutas con `existe`, `✓ Diagnóstico completado — sin cambios`; `not_contains`: `Layout legado`, `Guía de migración` (AC-3) |
| TC-006 | `senal-docs-specs-unica` | layout fijo más `docs/specs/stories/STORY-001-x/story.md`; sin `root` ni `SDDF_ROOT` | `contains`: `existe docs/specs/`, `docs/guides/artifact-directory-migration.md`; `not_contains`: `declara la clave root`, `SDDF_ROOT está definida` (AC-2, omite ausentes) |
| TC-007 | `tres-senales-legadas` | `docs/specs/`, `sddf.config.yaml` con `root: docs`, entorno `SDDF_ROOT=docs` | `contains`: las tres líneas de señal y la guía; `not_contains`: `ejecuta /sddf-init`; ningún archivo creado ni modificado (AC-2) |

**`project-*`, `reverse-engineering`:** sus evals no tienen rutas legadas; solo se comprueba que ningún caso espere `$SPECS_BASE` o `docs/specs`. `sddf-constitution` no tiene evals.

Todos los `evals.json` deben seguir siendo válidos para `npm run test:eval -- <skill> --dry-run` y para `verify:repository` (inventario de evals). No se ejecutan en esta historia (CNF-2).

**Alternativas rechazadas:**
- **Conservar los fixtures de memory-system en `docs/specs/`:** el índice seguiría funcionando por la transición de D-4, pero los evals de AC-1 no probarían `specs/flow/` y CNF-2 exige rutas fijas.
- **Reutilizar TC-001–TC-003 de `skill-preflight` con contenido nuevo:** borraría la trazabilidad con su origen (STORY-093).

### D-13 — Pruebas unitarias // satisface: AC-1, CNF-3

| Archivo | Cambio |
|---|---|
| `test/memory-system.test.js` | `LAYER_DIRS` con diez capas; S096-UT-001b verifica que `KNOWN_LAYERS` contiene `specs`, `specs-epics`, `specs-stories` y `specs-archive`; `scaffold` no crea `docs/specs/` (sustituye las aserciones de los `.gitkeep` de l. 348 y 574–575); los nodos de fixtures pasan a `../specs/flow/STORY-001-a/story.md` con capa `specs-stories`; el perfil speckit ya no produce `[OMITIDO] specs/` en `scaffold` |
| `test/memory-system.test.js` (nuevas) | (1) `scanNodes` en un repo temporal con `specs/flow/EPIC-01-x/epic.md`, `specs/flow/STORY-001-a/{story,design}.md` y `specs/flow/archive/2026-01-01-STORY-000-z/story.md` devuelve tres nodos con capas `specs-epics`, `specs-stories`, `specs-archive` y rutas `../specs/flow/…` (`design.md` excluido); (2) con `--harness speckit` el origen flow no se recorre; (3) `renderIndex` con el template por defecto incluye la entrada archivada bajo `Historias archivadas`; (4) `checkMemory` informa `invalid-frontmatter` en `../specs/flow/STORY-…/story.md`; (5) repo sin `specs/flow/`: el índice no falla; (6) transición: un `docs/specs/stories/STORY-…/story.md` sin `specs/flow/` sigue indexándose con capa `specs-stories` |
| `test/requirements.test.js:196` | la ruta del `story.md` del fixture pasa a `specs/flow/STORY-001-prueba/story.md` (relativa al repo del fixture) |
| `test/epic-template.test.js` | sin cambio (fixture legado, D-6) |

**Alternativas rechazadas:**
- **Solo evals para AC-1:** los evals no se ejecutan en el gate (CNF-2), así que el comportamiento del motor necesita pruebas deterministas en `npm test`.

### D-14 — Documentación del motor afectada // satisface: AC-1, AC-4

Solo se actualiza la documentación que describe el comportamiento que esta historia cambia:
- `docs/architecture/memory-system.md`: catálogo de diez capas (§2–3 y las menciones de «once capas»), origen flow del índice (D-4) y §10.6 (D-10).
- `docs/architecture/README.md:24`: «Las once capas» → «Las diez capas».
- `README.md:265`: «once capas» → «diez capas», además de D-10.

El resto de menciones de `$SPECS_BASE` en guías (por ejemplo, `docs/guides/sddf-commands-pipeline.md:69`) corresponde a STORY-154 (CR-003).

### D-15 — Orden de implementación

1. D-10 (eliminación del alias): reduce el número de archivos que hay que migrar.
2. D-1, D-2, D-7 y D-8 sobre `project-*`, `header-aggregation`, `reverse-engineering` y `sddf-constitution`.
3. D-3, D-4, D-5, D-6, D-12 y D-13 sobre `memory-system`.
4. D-9 sobre `skill-preflight`.
5. D-11, D-14 y verificación.

Cada bloque deja `npm test` en verde. Este orden coincide con la sugerencia de la historia (3 → 1 → 2).

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Skills de proyecto | modificar (Paso 0, rutas) | `skills/project-{begin,discovery,flow,planning,story-mapping,context-diagram}/SKILL.md`, `README.md` | AC-1 |
| Rol de planning | modificar (prohibición de escritura) | `skills/project-planning/assets/agents/planning.md` | AC-1 |
| Ejemplos de diagrama C4 | modificar (ruta de salida) | `skills/project-context-diagram/examples/test-0{1,2}-*.md` | CNF-3 |
| Normalización de frontmatter | modificar (Paso 0, búsqueda, derivación, batch) | `skills/header-aggregation/SKILL.md` | AC-1 |
| Fixtures y evals de frontmatter | mover y modificar | `skills/header-aggregation/examples/**`, `evals/evals.json` | CNF-2 |
| Ingeniería inversa | modificar (Fase 0, rutas) | `skills/reverse-engineering/SKILL.md`, `README.md` | AC-1 |
| Constitución y DoD | modificar (Paso 0, rutas, import) | `skills/sddf-constitution/SKILL.md`, `README.md` | AC-1 |
| Skill de memoria | modificar (Paso 0, `--root docs`, diez capas, alias) | `skills/memory-system/SKILL.md`, `README.md`, `references/{memory,dod}-rules.md` | AC-1, AC-4 |
| Motor de memoria | modificar (origen flow, `LAYERS`, `KNOWN_LAYERS`, textos) | `skills/memory-system/scripts/memory-system.js`, `scripts/epic-template.js` | AC-1, CNF-3 |
| Semillas e índice | eliminar `assets/scaffold/specs/**`; modificar template | `skills/memory-system/assets/` | AC-1 |
| Fixtures y evals de memoria | mover y modificar | `skills/memory-system/examples/**`, `evals/evals.json` | AC-1, AC-4, CNF-2 |
| Diagnóstico de entorno | modificar (contrato, verificaciones 2–3, región, informe) | `skills/skill-preflight/SKILL.md`, `README.md`, `evals/evals.json` | AC-2, AC-3, CNF-1 |
| Alias del índice | eliminar | `skills/docs-wiki-builder/` | AC-4 |
| Lista transitoria del gate | modificar (retirar 12 entradas) | `scripts/verify-fixed-layout.js` (`PENDING_MIGRATION`) | AC-1, AC-4 |
| Pruebas del motor | modificar y añadir | `test/memory-system.test.js`, `test/requirements.test.js` | AC-1 |
| Documentación | modificar | `docs/architecture/memory-system.md`, `docs/architecture/README.md`, `docs/guides/sddf-commands-pipeline.md`, `docs/runbooks/actualizar-spec-de-proyecto.md`, `README.md`, `CHANGELOG.md` | AC-1, AC-4 |

No se crea ningún script ni skill. No se modifican `dod-story.js`, `requirements.js`, `specs-3-levels.js` ni los fixtures legados.

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Paso 0 de cada skill | bloque de D-1 entre el marcador y el siguiente encabezado | AC-1 |
| Rutas de conocimiento | `docs/{product,requirements,templates,architecture,constitution.md,policies,guardrails}/…` relativas a `REPO_ROOT` | AC-1 |
| Rutas de work items | `specs/flow/EPIC-NN-<slug>/epic.md`, `specs/flow/STORY-NNN-<slug>/story.md`, `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/story.md` | AC-1 |
| Invocación del motor | `node <CLI_ROOT>/skills/memory-system/scripts/memory-system.js <subcomando> --root docs [flags]` | AC-1 |
| Origen flow del índice | `<dirname(--root)>/specs/flow/**`, `relPath` `../specs/flow/…`, capas `specs`/`specs-epics`/`specs-stories`/`specs-archive` (D-4) | AC-1 |
| Catálogo `LAYERS` | diez capas, sin `specs` (D-5) | AC-1 |
| Diagnóstico | Verificación 2 (cinco rutas fijas) y Verificación 3 (señales L1–L3 en la región `SDDF-LEGACY-DIAGNOSTIC`) | AC-2, AC-3 |
| Gate | `npm run verify:repository` aplica R1–R4 a los once skills | AC-1, CNF-1 |

## Esquema de datos

N/A: ningún frontmatter ni formato de artefacto cambia. Cambian la ubicación de los fixtures, la forma de un nodo del índice (`relPath` con `../specs/flow/`), una capa conocida nueva (`specs-archive`) y el contenido de los `sddf.config.yaml` de ejemplo, que pierden `root`. El esquema de `evals.json` se conserva.

## Flujos clave

### F-1 — `/memory-system index` en un repo con layout fijo // AC-1
1. Paso 0: resuelve `REPO_ROOT`; invoca `index --root docs`.
2. El motor detecta el harness `sddf` y recorre `docs/` y luego `specs/flow/` (D-4).
3. Rellena el template: las épicas en `Épicas`, las historias activas en `Historias de usuario` y las archivadas en `Historias archivadas`, todas enlazadas como `../specs/flow/…`.
4. Escribe `docs/index.md` y muestra `nodos indexados: N · sin frontmatter: M · nodos pendientes: K`.

### F-2 — `/skill-preflight` con layout legado // AC-2
1. Verificación 1: `REPO_ROOT`. Verificación 2: avisa por cada ruta fija ausente, sin sugerir `/sddf-init`.
2. Verificación 3: evalúa L1, L2 y L3; emite solo las presentes y la línea de la guía.
3. Verificaciones 4 y 5; informe `✓ Diagnóstico completado — sin cambios`. No escribe nada.

### F-3 — `/skill-preflight` con layout fijo // AC-3
1. Verificación 2: cinco líneas `[OK] <ruta> existe`.
2. Verificación 3: ninguna señal, así que ninguna línea; no aparece `Layout legado` ni `Guía de migración`.

### F-4 — Gate tras la migración // AC-1, AC-4, CNF-3
1. `grep -rnE "SPECS_BASE|SDDF_ROOT"` sobre los diez skills de AC-1 no devuelve nada.
2. `skills/docs-wiki-builder/` no existe y `PENDING_MIGRATION` no lo lista.
3. `npm run verify:repository` termina en `[OK]` en el paso «contrato de layout fijo», con los once skills validados.

### F-5 — Degradación // P7
- `specs/flow/` ausente: el origen flow queda vacío; el índice y `check` funcionan igual que con `docs/` solo.
- Repo sin migrar (`docs/specs/` presente): el índice indexa ambos orígenes en las mismas secciones; `check` ya no exige `docs/specs/`; `skill-preflight` lo señala (L1).
- `sddf.config.yaml` ilegible en `skill-preflight`: aviso y L2 sin evaluar; el diagnóstico continúa.
- `node` ausente: la degradación inline del Paso 5 de `memory-system` recorre `docs/` y `specs/flow/` con las mismas reglas (`memory-rules.md` documenta el origen flow).
- Templates ausentes en `docs/templates/`: los seeds locales o los de `CLI_ROOT` dan el mismo aviso que hoy, en la ruta nueva.

### F-6 — Puntos de cambio // P6
- **Archivado de épicas (épica de Workflow):** se añade `archive/*-EPIC-*` → `specs-epics` en la tabla de capas de D-4.
- **`specs/living/` (épica de Living Spec):** se añade un segundo origen fijo con su capa, sin tocar D-4.
- **Contrato v2:** cambia el texto canónico en todos los skills migrados.

## Decisiones de complejidad justificada

- **Origen flow como nodos propios (D-4):** es la única forma de que el índice liste `specs/flow/` sin perder la verificación de `check`. Reutiliza `walk`, `deriveNode` y la convención `../`; solo añade una función de capa y una constante.
- **Reutilizar los ids de capa `specs-*` (D-4):** permite que convivan los dos layouts durante la transición sin cambiar el template para cada estado.
- **Región delimitada en `skill-preflight` (D-9):** la impone STORY-148 D-3; son dos comentarios HTML alrededor de una tabla.
- **Línea `CLI_ROOT` en tres skills (D-1):** solo donde se usa.
- No se añade ninguna variable, script, flag ni fallback: el resto es sustitución textual guiada por el contrato.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Sin referencias legadas en los skills de AC-1 | `grep -rnE "SPECS_BASE\|SDDF_ROOT" skills/project-* skills/memory-system skills/header-aggregation skills/reverse-engineering skills/sddf-constitution` → sin salida (exit 1) | AC-1, CNF-3 |
| 2 | Excepción acotada | `grep -rn "SPECS_BASE" skills/skill-preflight` → sin salida; `grep -n "SDDF_ROOT" skills/skill-preflight/SKILL.md` → solo líneas dentro de la región | CNF-1 |
| 3 | Contrato declarado | `grep -c "<!-- SDDF-FIXED-LAYOUT: v1 -->"` = 1 en cada uno de los once `SKILL.md` | AC-1 |
| 4 | Gate verde | doce entradas ausentes de `PENDING_MIGRATION`; `npm run verify:repository` → exit 0 | AC-1, AC-4 |
| 5 | Sin lectura de `root` | `grep -nE "\broot\b.*sddf\.config\.yaml\|sddf\.config\.yaml.*\broot\b"` sobre los once `SKILL.md` → solo líneas de la región de `skill-preflight` | AC-1, CNF-1 |
| 6 | Índice con `specs/flow/` | pruebas nuevas de D-13 (1)–(6) en `npm test` | AC-1 |
| 7 | Scaffold sin `docs/specs/` | prueba de D-13: `scaffold` sobre una raíz vacía no crea `docs/specs/`; `LAYERS.length === 10` | AC-1 |
| 8 | Alias eliminado | `test ! -d skills/docs-wiki-builder`; `grep -rn "docs-wiki-builder" skills docs/architecture docs/guides docs/runbooks README.md` → sin salida, salvo `docs/guides/artifact-directory-migration.md` si STORY-154 ya lo nombra | AC-4 |
| 9 | CHANGELOG | `## [Unreleased]` contiene `### Removed` con `docs-wiki-builder`, `BREAKING` y `/memory-system index` | AC-4 |
| 10 | Diagnóstico legado | `skill-preflight/SKILL.md` contiene la región con las tres señales y `docs/guides/artifact-directory-migration.md`; evals TC-005–TC-007 presentes | AC-2, AC-3 |
| 11 | Diagnóstico sin escrituras | `skill-preflight/SKILL.md` no contiene verbos de escritura sobre rutas del repo (`crea`, `escribe`, `mueve`) fuera de «No hace»; conserva «diagnóstico explícito» | AC-2 |
| 12 | Evals válidos | `node -e` parsea los `evals.json` afectados; `npm run test:eval -- skill-preflight --dry-run` (también `memory-system` y `header-aggregation`) sin error | CNF-2 |
| 13 | Pruebas verdes | `npm test` → exit 0 | AC-1 |
| 14 | Alcance acotado | `git diff --stat` solo muestra los archivos de «Componentes afectados» y los artefactos de la historia | Non-Goals |
| 15 | Ejecución real de evals (a criterio humano) | `npm run test:eval -- skill-preflight`, `-- memory-system`, `-- header-aggregation` | AC-1, AC-2, AC-3 |

## Risks / Trade-offs

- **[Riesgo] Precondición: STORY-147 y STORY-148 sin implementar** (`scripts/verify-fixed-layout.js` y ADR-0016 no existen). → Implementar STORY-152 solo con ambas en `DONE`; la primera tarea lo comprueba. Sin el validador, D-11 no tiene lista que editar y AC-1 se verifica con los contratos 1 y 5 (vía alternativa que prevé la historia).
- **[Riesgo] Tamaño:** la evaluación FINVEST (S = 2) recomendó dividir la historia. → D-15 la ordena en cinco bloques verificables por separado, en el orden 3 → 1 → 2; cada bloque deja `npm test` en verde.
- **[Riesgo] Dogfooding en transición:** este repo conserva `docs/specs/` hasta STORY-153 y declara `root: docs`. Tras esta historia, `/skill-preflight` en el repo informará L1 y L2, que es lo esperado. → No reinstalar las copias de runtime (`.claude/`) antes de STORY-153; dejarlo anotado en `implement-report.md`.
- **[Trade-off] Ids de capa `specs-*` para `specs/flow/`:** los nombres reflejan la raíz `specs/`, no `specs/flow/`. Se aceptan para que los dos layouts convivan sin romper el template.
- **[Riesgo] Enlaces a requisitos en historias de `specs/flow/`:** `migrate --from=srs-single|requirements-fragmented` solo reescribe wikilinks bajo `docs/` (D-6). → `check` evalúa los nodos flow, así que un wikilink que quede roto aparece como `broken-wikilink`; la conversión de requisitos es de la épica de Living Spec.
- **[Riesgo] R4 con falsos positivos** (`--cli-root`, `root:` en ejemplos de `memory-system`). → Contrato 5 sobre los once `SKILL.md` antes de cerrar; las líneas se reformulan.
- **[Trade-off] Retirar TC-001–TC-003 de `skill-preflight`:** el comportamiento que probaban deja de existir y sus IDs no se reutilizan.
- **[Limitación] La guía de migración no viaja en el paquete:** `skill-preflight` la cita como ruta del repositorio de agile-sddf (D-9).
- **[Riesgo] Copias instaladas de `docs-wiki-builder` en proyectos consumidores:** `agile-sddf install` no las borra. → Lo cubren el CHANGELOG (D-10) y la guía de STORY-154 (CR-003).

## Open Questions

Ninguna. Las ambigüedades de la historia se resuelven en D-4 (cómo listar `specs/flow/`), D-5 (scaffold sin `docs/specs/`), D-7 (slug de una historia archivada) y D-9 (formato de las señales legadas).

## Autoevaluación (P9, P10)

- **Omisiones:** AC-1 (D-1–D-8, D-11–D-14; F-1, F-4; contratos 1, 3–7), AC-2 (D-9, D-12; F-2; contratos 2, 10, 11), AC-3 (D-9, D-12; F-3; contrato 10), AC-4 (D-10, D-11, D-14; contratos 8, 9), CNF-1 (D-1, D-9; contratos 2, 5), CNF-2 (D-7, D-12; contratos 12, 15), CNF-3 (D-1–D-3; contrato 1). Se revisaron los doce skills completos, con sus `README.md`, `references/`, `assets/agents/`, `examples/`, `evals/` y scripts.
- **Ambigüedad:** «usan rutas fijas» se concreta en D-1 y D-2 (contrato) y en D-3–D-8 (comportamiento); «lista los work items de `specs/flow/`», en el origen flow de D-4; «nombra cada señal y omite las ausentes», en la tabla L1–L3.
- **Nombres:** «contrato de layout fijo», «lista transitoria» / `PENDING_MIGRATION`, «región de diagnóstico», «señal legada», «origen flow» y «raíz de conocimiento (`docs/`)» se usan siempre igual. Las rutas aparecen siempre como literales relativos a `REPO_ROOT`.
- **Estructura:** no hay componentes nuevos. Los skills dependen del contrato y de rutas fijas; las composiciones existentes (`memory-system ensure` → `header-aggregation`, `project-flow` → `project-*`, `project-planning` → `project-story-mapping`) no forman ciclos. El motor añade una función de capa y una constante. El documento no contiene código de implementación: los bloques son contenido Markdown del contrato.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: la historia depende de STORY-148 (`scripts/verify-fixed-layout.js`, `PENDING_MIGRATION` y la región `SDDF-LEGACY-DIAGNOSTIC`) y de ADR-0016 (STORY-147), que cita el bloque canónico. Ninguno existe a 2026-10-22.
- **Documento afectado**: story.md (Notas: dependencia de STORY-148)
- **Acción requerida**: implementar STORY-152 solo con STORY-147 y STORY-148 en `DONE`. Si se adelanta, verificar AC-1 con los contratos 1 y 5 y aplazar D-11 hasta que exista el validador.

### CR-002
- **Tipo**: dependencia
- **Descripción**: CR-002 de STORY-149 pide a esta historia que `memory-system scaffold` deje de crear `docs/specs/`. AC-1 no lo menciona, pero es una consecuencia directa de «`memory-system` usa rutas fijas» y de CS-8.
- **Documento afectado**: story.md (AC-1, Notas), design.md (D-5)
- **Acción requerida**: el diseño lo resuelve en D-5. Opcional: añadir a la historia una nota de que el scaffold deja de crear `docs/specs/`.

### CR-003
- **Tipo**: dependencia
- **Descripción**: la guía `docs/guides/artifact-directory-migration.md` debe indicar que se borren a mano las copias instaladas de `docs-wiki-builder` y que se elimine `root` de `sddf.config.yaml`. El resto de guías aún citan `$SPECS_BASE` (por ejemplo, `docs/guides/sddf-commands-pipeline.md:69`), y el CHANGELOG debe registrar como incompatible el cambio de capas de `memory-system` (diez capas, índice con `specs/flow/`).
- **Documento afectado**: story.md de STORY-154
- **Acción requerida**: STORY-154 incluye esos puntos en su alcance documental. Esta historia solo edita las líneas de D-10 y D-14.

### CR-004
- **Tipo**: desviación menor de implementación
- **Descripción**: durante `story-implement-tasks` (2026-10-23) se tomaron cuatro decisiones de detalle no previstas literalmente: (1) en `memory-system/SKILL.md` la fila `dod-guardrail` no se partió en dos frases (R4): se sustituyó la notación `<REPO_ROOT>/<--cli-root>/skills` por `<CLI_ROOT>/skills`, porque una celda de tabla no admite dos líneas; (2) `test/requirements.test.js › fixture()` copia el repo completo del fixture y devuelve su `docs/`, para que los work items de `specs/flow/` viajen con la copia; (3) en TC-004 de `skill-preflight` el `not_contains` usa `ROOT_SOURCE` en lugar de `SPECS_BASE` para cumplir el contrato de verificación 2; (4) `header-aggregation` evalúa la fila de `specs/flow/archive/` antes que la de `specs/flow/STORY-*`.
- **Documento afectado**: design.md (D-1, D-7, D-12, D-13)
- **Acción requerida**: ninguna; el comportamiento y los contratos de verificación se mantienen.
