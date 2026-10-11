---
alwaysApply: false
type: design
id: STORY-115
slug: STORY-115-scaffold-dos-niveles-y-capas-destino-design
title: "Design: Actualizar scaffolding de memory-system a specs/ de dos niveles"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-21-colapsar-specs-dos-niveles
story: STORY-115
created: 2026-10-08
updated: 2026-10-08
related:
  - STORY-115-scaffold-dos-niveles-y-capas-destino
  - eliminar-specs-01-projects
  - STORY-108-renombrar-specs-sin-prefijos
  - STORY-111-planning-escribe-roadmap
  - STORY-113-project-flow-sin-01-projects
  - STORY-114-migrate-specs-3-levels
---

<!-- Referencias -->
[[STORY-115-scaffold-dos-niveles-y-capas-destino]] · [[eliminar-specs-01-projects]] · [[STORY-108-renombrar-specs-sin-prefijos]] · [[STORY-111-planning-escribe-roadmap]] · [[STORY-113-project-flow-sin-01-projects]] · [[STORY-114-migrate-specs-3-levels]]

# Diseño técnico: scaffolding de `memory-system` con `specs/` de dos niveles

## Context

[[eliminar-specs-01-projects]] (ADR-0013, consecuencia 5) establece que `memory-system` ya no crea `specs/01-projects/`. El
contenido de proyecto vive ahora en `product/` (visión, stakeholders, objetivos, roadmap) y `requirements/` (FR/NFR). Esta historia
ajusta el **scaffold**: deja de sembrar `01-projects/`, siembra `product/roadmap.md` y `requirements/{functional,non-functional}/`, y
avisa cuando encuentra la estructura antigua.

**Estado medido (2026-10-08):**

| Pieza | Estado |
|---|---|
| `skills/memory-system/scripts/memory-system.js` (1050 líneas) | `LAYERS` (11 capas). `SPECS_LAYERS = { '01-projects': 'specs-projects', '02-epics': 'specs-epics', '03-stories': 'specs-stories' }` (l. 86); `KNOWN_LAYERS` se deriva de él. `deriveLayer` traduce `specs/<x>/…` con `SPECS_LAYERS[x] \|\| 'specs-<x>'`; `validateLayers` lanza `UsageError` (exit 2) si una capa con nodos no tiene `{layer:…}` en el template. `scaffold()` (l. 805): copia-si-falta de `assets/scaffold/`, un `.gitkeep` solo materializa un directorio ausente, `result.warnings[]` se imprime como `[WARNING] …` antes de la línea de resumen, `runScaffold` devuelve siempre 0. |
| Árbol semilla `assets/scaffold/` | `product/{README,vision,stakeholders,objectives}.md`, `requirements/README.md`, `specs/README.md` y `specs/{01-projects,02-epics,03-stories}/.gitkeep`. Sin `roadmap.md` ni subcarpetas en `requirements/`. `specs/README.md` y `constitution.md` describen tres niveles con `01-projects/`. |
| `assets/index-template.md` | Sección `### L3 — Proyecto (specs/01-projects/)` con `{layer:specs-projects}`. |
| `references/memory-rules.md` | §2 "Capa" mapea `01-projects` → `specs-projects`; §3 lista `specs-projects` entre las capas conocidas; §5 tabla de archivos gestionados con la fila de los tres `.gitkeep`. |
| `SKILL.md` | "Qué hace" (l. 35), contrato de salida de `scaffold` (l. 210), regla "Plantilla sin dueño" (l. 150), scaffold inline (l. 437-450) y `## Salida` (l. 482-483) nombran `specs/01-projects/`, `02-epics/`, `03-stories/` y `product/{README,vision,stakeholders,objectives}.md`. |
| `test/memory-system.test.js` | `S096-UT-001` (l. 346) espera `.gitkeep` en `01-projects`, `02-epics`, `03-stories`; el test del árbol semilla (l. 550-575) lista las semillas exactas; `S096-UT-001b` verifica `LAYERS`/`KNOWN_LAYERS`. |
| `evals/evals.json` | TC-001…TC-022. TC-007 (scaffold sobre `examples/empty`) enumera las semillas creadas. STORY-114 reserva TC-023/TC-024. |
| Historias vecinas (diseñadas) | **STORY-108** (D-2/D-3): renombra las semillas a `specs/epics/` y `specs/stories/` y las claves de `SPECS_LAYERS` a `epics`/`stories`, dejando `01-projects` para esta historia. **STORY-114** (D-1): crea `scripts/specs-3-levels.js` con `LEGACY_LEVELS = { projects: '01-projects', epics: '02-epics', stories: '03-stories' }` como **único** lugar de `skills/` que nombra los niveles viejos; su D-8/D-10 rellena `## Épicas` del roadmap si está vacía (marcadores `[Por completar: …]` cuentan como vacío, su D-5). **STORY-111** (D-1/D-2): `roadmap-template.md` con `## Épicas` (foto), `## Propuesta (AAAA-MM-DD)` repetible, `### Resumen` y pie `Volver al mapa: [[index]].`. **STORY-113** (Context): asigna a esta historia `index-template.md`, `scaffold/constitution.md`, `scaffold/specs/README.md` y `memory-rules.md`. |

Dependencia de ejecución: EPIC-21 ordena esta historia **después de STORY-108**. El diseño asume las claves `epics`/`stories` en
`SPECS_LAYERS` y las semillas `specs/epics/.gitkeep` y `specs/stories/.gitkeep` ya renombradas.

Stack (constitución + `package.json`): Node.js ≥ 18 con módulos nativos para el motor, `node --test` (`npm test`). No hay
`skills.plan` en `sddf.config.yaml`: no aplican skills complementarios. Principio 11 de la constitución: los casos de
`evals/evals.json` se escriben antes que el `SKILL.md`.

## Goals / Non-Goals

**Goals:**

- `scaffold` sobre un proyecto vacío crea `specs/epics/`, `specs/stories/`, `product/{vision,stakeholders,objectives,roadmap}.md` y
  `requirements/{functional,non-functional}/`, y no crea `specs/01-projects/`. // satisface: AC-1
- Sobre un repositorio con `01-projects/`, `02-epics/` o `03-stories/`, `scaffold` no toca esos directorios, emite un
  `[WARNING]` que remite a `/memory-system migrate --from=specs-3-levels` y conserva su exit code. // satisface: AC-2
- La segunda ejecución de `scaffold` termina con `creados: 0 · sobrescritos: 0 · …` y conserva un `roadmap.md` editado. // satisface: AC-3
- Árbol semilla, tabla de `memory-rules.md` §5, `SKILL.md` y test del árbol describen la misma estructura; `npm test` exit 0. // satisface: CNF-1
- La semilla de `roadmap.md` tiene las secciones fijas del template de STORY-111. // satisface: CNF-2
- `specs-projects` desaparece de `index` y `check`; solo la detección de la estructura antigua conoce `01-projects`. // satisface: CNF-3
- Semillas nuevas y modificadas en UTF-8 sin BOM. // satisface: CNF-4

**Non-Goals:**

- Renombrar `02-epics/` → `epics/` y `03-stories/` → `stories/` (STORY-108).
- Migrar la estructura antigua (STORY-114) ni cambiar `sddf-init` (STORY-113).
- Crear `roadmap-template.md` y los demás templates de `docs/templates/` (STORY-109…111).
- Sembrar FR/NFR de ejemplo: `functional/` y `non-functional/` quedan vacíos (solo `.gitkeep`).
- Tratar la estructura antigua en `index`/`check` más allá de retirar `specs-projects` (ver D-6).
- Actualizar la documentación canónica (`docs/architecture/memory-system.md` l. 275 y 300 nombran `specs-projects`): STORY-116.
- Cambiar `requirements/README.md` de la semilla (la estrategia SRS/fragmentado es de STORY-118).

## Decisions

### D-1 — Árbol semilla de dos niveles con capas destino // satisface: AC-1, CNF-1, CNF-4

Cambios en `skills/memory-system/assets/scaffold/` (estado de partida: después de STORY-108):

| Ruta de la semilla | Acción | Contenido |
|---|---|---|
| `specs/01-projects/.gitkeep` | eliminar (`git rm`) | — |
| `specs/epics/.gitkeep`, `specs/stories/.gitkeep` | sin cambios | vacíos (los deja STORY-108) |
| `product/roadmap.md` | crear | D-2 |
| `requirements/functional/.gitkeep` | crear | vacío (0 bytes) |
| `requirements/non-functional/.gitkeep` | crear | vacío (0 bytes) |
| `product/README.md` | modificar | D-3 |
| `specs/README.md` | modificar | D-4 |
| `constitution.md` | modificar | D-4 |

- El motor **no cambia** para sembrar: `listSeeds` recorre el árbol y `scaffold()` aplica a los `.gitkeep` nuevos la regla existente
  ("solo materializa un directorio ausente"). Reutilización (P3): el mecanismo que hoy crea `specs/<nivel>/` crea las subcarpetas de
  `requirements/`.
- Orden de las semillas (`ordinalCompare`): `requirements/README.md` precede a `requirements/functional/.gitkeep` (`R` < `f`); el
  README crea el directorio padre y el `.gitkeep` el subdirectorio. Ninguna dependencia de orden adicional.
- Encoding: archivos `.md` en UTF-8 sin BOM con saltos `\n` (convención de las semillas existentes); los `.gitkeep` vacíos.

**Alternativas rechazadas:**

- *Crear `requirements/functional/` y `non-functional/` desde código (lista de directorios en el motor):* introduciría un segundo
  catálogo de directorios además del árbol semilla y rompería CNF-1 (fuente única).
- *Sembrar un `README.md` dentro de cada subcarpeta de `requirements/`:* crearía dos nodos indexables nuevos (con slug, título y capa)
  sin contenido propio; el `README.md` de la capa ya documenta la convención `functional/FR-NNN-<slug>.md`.

### D-2 — Semilla `product/roadmap.md` alineada con `roadmap-template.md` // satisface: AC-1, AC-3, CNF-2

Estructura (D-1/D-2 de STORY-111, restringida a las partes **no repetibles** del template):

| Elemento | Contenido de la semilla |
|---|---|
| Frontmatter | `type: product` · `slug: roadmap` · `title: "Roadmap del producto"` · `status: IN-PROGRESS` · `substatus: TODO` · `parent: null` · `created: {date}` · `updated: {date}` (esquema de las semillas de `product/`; sin anotaciones `escritor:`, regla de `memory-rules.md` §5) |
| Título | `# Roadmap del producto` |
| Cita | La misma línea `> …` del template de STORY-111 D-2 ("Plan de épicas del producto. "Épicas" es una foto … no se modifica después.") |
| `## Épicas` | Una línea marcador: `[Por completar: foto de las épicas existentes; la escribe /project-planning al registrar la primera propuesta]` |
| Pie | `Volver al mapa: [[index]].` |

- **Sin `## Propuesta (…)`:** es la sección `repetible` del template; la agrega `/project-planning` en cada planificación confirmada.
  Sembrar una propuesta vacía haría que `/epic-from-project-plan` la tomara como "la última propuesta" (STORY-111 D-8).
- **Marcador `[Por completar: …]`** igual que `vision.md`, `stakeholders.md` y `objectives.md`: STORY-114 D-5 ya lo clasifica como
  "vacío", así que la migración rellena `## Épicas` sobre la semilla (STORY-114 D-8/D-10). Para `/project-planning` ver CR-001.
- **Idempotencia (AC-3):** `roadmap.md` es un archivo gestionado más; la política copia-si-falta lo marca `[PRESERVADO]` y no lo lee
  ni compara. Su contenido solo cambia con `rebuild --force` (riesgo documentado).
- **Fuente de verdad de la estructura:** si STORY-111 está integrada, la semilla copia los encabezados fijos y la cita de
  `skills/project-planning/assets/roadmap-template.md`; si no, la semilla se escribe con la tabla anterior y STORY-111 debe respetarla
  (nota "Independencia" de la historia).

**Alternativas rechazadas:**

- *`## Épicas` con `Sin épicas creadas al {date}.`:* es verdad en un proyecto vacío (AC-1) pero falso cuando `scaffold`/`ensure`
  se ejecuta sobre un proyecto con épicas; la semilla no puede leer `specs/epics/` sin acoplar el scaffold al dominio de épicas.
- *No sembrar `roadmap.md` y dejar que lo cree `/project-planning`:* incumple AC-1 y SMOKE-1 de EPIC-21.
- *Copiar `roadmap-template.md` como semilla:* el template lleva comentarios `clave:`/`escritor:` y la sección repetible; una semilla
  es un documento inicial, no una plantilla (`memory-rules.md` §5).

### D-3 — `product/README.md`: cuatro documentos fijos // satisface: AC-1, CNF-1

- Línea "Convención de nombres" → "cuatro documentos fijos, `vision.md`, `stakeholders.md`, `objectives.md` y `roadmap.md`;
  cualquier otro documento de contexto en kebab-case (`<tema>.md`)".
- Se añade a la "Regla" que `roadmap.md` es el plan de épicas (qué incrementos se planifican), mientras `specs/epics/` contiene las
  épicas materializadas. Resuelve la nota "`product/README.md`" de la historia.

**Alternativa rechazada:** *mantener tres documentos fijos y tratar el roadmap como "otro documento":* la semilla lo crea siempre y
STORY-111 lo trata como destino canónico; el README mentiría sobre el contenido real de la capa.

### D-4 — Textos de dos niveles en `specs/README.md` y `constitution.md` // satisface: AC-1, CNF-1, CNF-3

- `specs/README.md` (semilla): "Convención de nombres" pasa a "dos niveles: épicas (L2) e historias (L1)", con el árbol
  `specs/epics/EPIC-NN-<slug>/epic.md` y `specs/stories/STORY-NNN-<slug>/story.md`, y una frase: la visión, los stakeholders, los
  objetivos y el roadmap viven en `product/`; los requisitos en `requirements/` ([[index]] como único enlace, regla de §5).
- `constitution.md` (semilla), sección "Jerarquía de desarrollo": "Una épica (epic) contiene varias historias (story)"; árbol de dos
  líneas (`epic (specs/epics/…/epic.md)` → `story (specs/stories/…/story.md)`) y una frase que remite el contexto del producto a
  `product/` y `requirements/`. Asignado por STORY-113 (Context).
- No se tocan las copias de este repositorio (`docs/specs/README.md`, `docs/constitution.md`): son documentos de autor (STORY-116).

**Alternativa rechazada:** *dejar los textos y quitar solo la línea de `01-projects/`:* el texto "tres niveles con prefijo numérico"
quedaría falso tras STORY-108 y esta historia.

### D-5 — Aviso de estructura de tres niveles en `scaffold` // satisface: AC-2, CNF-3

- **Detección:** `detectLegacyLevels(specsBase) → string[]` devuelve, en el orden de `LEGACY_LEVELS` (`01-projects`, `02-epics`,
  `03-stories`), los nombres que existen como **directorio** en `<specsBase>/specs/`. Solo lectura (`fs.statSync`), sin recorrer su
  contenido. Vive en `scripts/specs-3-levels.js` junto a `LEGACY_LEVELS` (único lugar de `skills/` que nombra los niveles viejos,
  STORY-114 D-1).
  - Si STORY-114 ya está integrada: se añade la función al módulo existente.
  - Si no: esta historia crea `specs-3-levels.js` con solo `LEGACY_LEVELS` y `detectLegacyLevels` (mismo patrón de módulo que
    `dod-story.js`), y STORY-114 lo amplía.
- **Uso en `scaffold()`:** después de calcular el perfil y antes de colocar semillas, si `specs` **no** está en `skipLayers` y
  `detectLegacyLevels` devuelve algo, se agrega como **primer** elemento de `result.warnings`:
  `estructura de specs/ de tres niveles detectada (<n1>/, <n2>/…): ejecuta /memory-system migrate --from=specs-3-levels`.
  `runScaffold` ya lo imprime como `[WARNING] …` antes de la línea de resumen; con `--dry-run` también (la detección no escribe).
- **Exit code:** sin cambio (`runScaffold` devuelve 0). La advertencia no altera `summary` ni la última línea.
- **Lo que no cambia:** ninguna semilla apunta a los niveles viejos, así que `scaffold` no crea, modifica, mueve ni elimina nada bajo
  `01-projects/`, `02-epics/` ni `03-stories/`. Sí crea `specs/epics/.gitkeep` y `specs/stories/.gitkeep` si faltan (copia-si-falta
  normal); STORY-114 D-11 ya admite que el destino exista al migrar.
- **Harness con `specs` omitido** (Speckit, OpenSpec): no se detecta, porque `specs/` de `SPECS_BASE` no es del framework en esos
  perfiles.

**Alternativas rechazadas:**

- *Exit 1 o fallo cuando hay estructura vieja:* AC-2 exige el mismo exit code.
- *No sembrar `specs/epics/` ni `specs/stories/` cuando hay estructura vieja:* haría que el plan del scaffold dependiera de la
  detección (dos comportamientos que probar) sin beneficio: la migración ya tolera el destino existente.
- *Constante `LEGACY_LEVELS` propia en `memory-system.js`:* duplicaría los nombres viejos en dos archivos y contradiría STORY-114 D-1
  (y el grep de cierre de EPIC-21, CR-005 de STORY-114).
- *Detectar por contenido (`PROJ-*/project.md`):* más frágil y más caro; un directorio de nivel viejo vacío también indica una
  estructura pendiente de migrar.

### D-6 — Retirar la capa `specs-projects` de `index` y `check` // satisface: CNF-3, CNF-1

- `memory-system.js`: `SPECS_LAYERS = { epics: 'specs-epics', stories: 'specs-stories' }` (se quita la clave `'01-projects'`).
  `KNOWN_LAYERS` deja de incluir `specs-projects` por derivación.
- `assets/index-template.md`: se elimina el bloque `### L3 — Proyecto (specs/01-projects/)` + `{layer:specs-projects}`.
- `check` no usa el template ni `SPECS_LAYERS` para sus evaluadores: no requiere cambios.
- **Repositorio con `specs/01-projects/` y nodos `.md`:** `deriveLayer` devuelve la capa de fallback `specs-01-projects` y `index`
  termina con exit 2 sin escribir (`la capa "specs-01-projects" tiene N nodo(s) pero el template no declara …`). Es el comportamiento
  existente para cualquier subdirectorio desconocido de `specs/` (documentado en `memory-rules.md` §2: "exit 2, a propósito") y el
  mismo que STORY-108 produce para `02-epics/` (CR-002). El `[WARNING]` de D-5 es la guía al usuario.
- `memory-rules.md` §2 y §3 se actualizan: sin `specs-projects`; nota de que los niveles de tres niveles caen en el fallback y que
  `scaffold` avisa.

**Alternativas rechazadas:**

- *Conservar `specs-projects` como capa "legacy" en el índice:* contradice CNF-3 y mantendría `01-projects` vivo en el motor.
- *Indexar los nodos de niveles viejos bajo `{layer:specs}`:* cambiaría el fallback para todo subdirectorio desconocido y ocultaría
  una estructura sin migrar; el fallo explícito de `index` es la señal correcta.
- *Añadir la pista de migración al error de `index`:* tercera consulta de `LEGACY_LEVELS` fuera de la detección de AC-2 y de
  `migrate`, que CNF-3 limita a esos dos puntos.

### D-7 — Documentación del skill y de las reglas // satisface: CNF-1, AC-2

| Archivo | Cambio |
|---|---|
| `references/memory-rules.md` §5 tabla | Fila `product/vision.md, stakeholders.md, objectives.md` → añade `product/roadmap.md` (`product` / `roadmap`). Fila de `.gitkeep` → `specs/epics/.gitkeep`, `specs/stories/.gitkeep`, `requirements/functional/.gitkeep`, `requirements/non-functional/.gitkeep` (misma regla "solo si el directorio no existe"). |
| `references/memory-rules.md` §5 reglas | Nueva viñeta **Estructura de tres niveles**: texto exacto del `[WARNING]` de D-5, no bloquea, exit 0, nada bajo los niveles viejos se toca, no aplica si el harness omite `specs`. "Nunca se elimina nada" no cambia (la excepción de `migrate` es de STORY-114). |
| `references/memory-rules.md` §2 y §3 | D-6. |
| `SKILL.md` "Qué hace este skill" | `scaffold`: constitución, `product/*` (incluido `roadmap.md`), `requirements/{functional,non-functional}/`, `specs/{epics,stories}/`; avisa `[WARNING]` ante la estructura de tres niveles. |
| `SKILL.md` contrato de salida de `scaffold` (Paso 2) | Añade `[WARNING] estructura de specs/ de tres niveles detectada (…): ejecuta /memory-system migrate --from=specs-3-levels` si procede (antes del resumen). |
| `SKILL.md` regla junto a "Plantilla sin dueño instalado" | Nueva regla **Estructura de tres niveles**: no bloquea; el motor la informa y el skill reenvía el aviso tal cual. |
| `SKILL.md` scaffold inline (sin node) | Crea `requirements/functional/`, `requirements/non-functional/`, `specs/epics/`, `specs/stories/` (con `.gitkeep` solo si faltaban); si existe alguno de los tres niveles viejos, emite el mismo `[WARNING]` antes del resumen. |
| `SKILL.md` `## Salida` | `product/{README,vision,stakeholders,objectives,roadmap}.md`, `requirements/{functional,non-functional}/`, `specs/{epics,stories}/`. |

El `description` del frontmatter de `SKILL.md` no enumera directorios: no cambia en esta historia (`migrate --from=specs-3-levels` lo
añade STORY-114).

### D-8 — Pruebas y evals // satisface: CNF-1, AC-1, AC-2, AC-3, CNF-2, CNF-3, CNF-4

`test/memory-system.test.js` (prefijo `S115-` para los nuevos):

| Prueba | Cambio / aserción | AC |
|---|---|---|
| `S096-UT-001` | `product/` incluye `roadmap`; `specs/epics/.gitkeep` y `specs/stories/.gitkeep` existen; `requirements/functional/` y `requirements/non-functional/` existen; **no** existen `specs/01-projects`, `specs/02-epics`, `specs/03-stories` (rutas construidas con `LEGACY_LEVELS`) | AC-1 |
| Árbol semilla exacto (l. 550-575) | `expected` sin `specs/01-projects/.gitkeep`; con `product/roadmap.md`, `requirements/functional/.gitkeep`, `requirements/non-functional/.gitkeep` | CNF-1 |
| `S096-UT-001b` | Añade `assert.ok(!engine.KNOWN_LAYERS.includes('specs-projects'))` | CNF-3 |
| `S115-UT-001` aviso | Copia `examples/sane`, crea `docs/specs/<LEGACY_LEVELS.projects>/PROJ-01-demo/project.md`, `…/<epics>/` y `…/<stories>/` con un archivo cada uno; `hashTree` de esos tres directorios antes/después idéntico; stdout contiene `[WARNING] estructura de specs/ de tres niveles detectada (01-projects/, 02-epics/, 03-stories/): ejecuta /memory-system migrate --from=specs-3-levels`; `status` igual al de una corrida sobre `examples/sane` sin esos directorios (0); la última línea casa `SCAFFOLD_SUMMARY` | AC-2 |
| `S115-UT-002` aviso parcial y `--dry-run` | Solo `01-projects/` presente → el aviso nombra solo `01-projects/`; con `--dry-run` el aviso aparece y nada se escribe | AC-2 |
| `S115-UT-003` harness | `--harness openspec` con un `specs/01-projects/` en `SPECS_BASE` → sin `[WARNING] estructura` | AC-2 |
| `S115-UT-004` idempotencia | `examples/empty` → `scaffold`; se reescribe `product/roadmap.md` con contenido propio; segundo `scaffold` → última línea empieza con `creados: 0 · sobrescritos: 0`, `[PRESERVADO] product/roadmap.md`, contenido idéntico byte a byte | AC-3 |
| `S115-UT-005` roadmap vs template | Encabezados `#`/`##` y pie de la semilla = encabezados no repetibles de `skills/project-planning/assets/roadmap-template.md` (se excluye el bloque `## Propuesta (…)`); frontmatter con `type: product`, `slug: roadmap`. Si el template aún no existe (STORY-111 sin integrar) → `t.skip('roadmap-template.md pendiente de STORY-111')` | CNF-2 |
| `S115-UT-006` encoding | Todo `.md` de `assets/scaffold/` no empieza con `EF BB BF` y no contiene `Ã` ni `ðŸ` | CNF-4 |
| `S115-UT-007` capa retirada | Fixture temporal con `docs/specs/01-projects/PROJ-01-demo/project.md` → `index --dry-run` sale con 2 y stderr nombra `specs-01-projects`; nada escrito | CNF-3 |

`skills/memory-system/evals/evals.json` (antes que el `SKILL.md`, principio 11):

- **TC-007:** la lista de semillas `[CREADO]` de la descripción incluye `product/roadmap.md`; `expected.contains` añade
  `product/roadmap.md`; `not_contains` añade `specs/01-projects`.
- **Caso nuevo** (siguiente ID libre: `TC-025` si STORY-114 ya registró TC-023/TC-024; si no, `TC-023` y STORY-114 renumera):
  `scaffold` sobre la fixture de tres niveles → contiene `[WARNING] estructura de specs/ de tres niveles detectada` y
  `migrate --from=specs-3-levels`; no contiene `[SOBRESCRITO]` ni `Entorno inválido`. Fixture: `examples/specs-3-levels` de STORY-114
  si existe; si no, esta historia crea una mínima con ese nombre (`sddf.config.yaml` + `docs/specs/{01-projects/PROJ-01-demo/project.md,
  02-epics/EPIC-01-demo/epic.md, 03-stories/STORY-001-demo/story.md}`) que STORY-114 amplía.

**Alternativa rechazada:** *Fixture versionada para las pruebas unitarias del aviso:* las pruebas construyen la estructura vieja en
el `mkdtemp` con `LEGACY_LEVELS` (patrón de CR-005 de STORY-114), sin añadir más nombres viejos a `skills/`.

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Semilla `01-projects` | eliminar | `skills/memory-system/assets/scaffold/specs/01-projects/.gitkeep` | AC-1 |
| Semilla roadmap | crear | `skills/memory-system/assets/scaffold/product/roadmap.md` | AC-1, AC-3, CNF-2 |
| Semillas de requisitos | crear | `skills/memory-system/assets/scaffold/requirements/{functional,non-functional}/.gitkeep` | AC-1 |
| README de producto | modificar | `skills/memory-system/assets/scaffold/product/README.md` | AC-1, CNF-1 |
| README de specs y constitución (semillas) | modificar | `skills/memory-system/assets/scaffold/specs/README.md`, `…/scaffold/constitution.md` | CNF-1, CNF-3 |
| Motor | modificar | `skills/memory-system/scripts/memory-system.js` (`SPECS_LAYERS`, `scaffold()`, `require` del módulo de niveles) | AC-2, CNF-3 |
| Módulo de niveles heredados | modificar (o crear mínimo) | `skills/memory-system/scripts/specs-3-levels.js` (`detectLegacyLevels`) | AC-2, CNF-3 |
| Template del índice | modificar | `skills/memory-system/assets/index-template.md` | CNF-3 |
| Reglas | modificar | `skills/memory-system/references/memory-rules.md` (§2, §3, §5) | CNF-1, CNF-3, AC-2 |
| Skill | modificar | `skills/memory-system/SKILL.md` | CNF-1, AC-2 |
| Evals | modificar | `skills/memory-system/evals/evals.json` (TC-007 + caso nuevo) | AC-1, AC-2 |
| Fixture de tres niveles | reutilizar (o crear mínima) | `skills/memory-system/examples/specs-3-levels/` | AC-2 |
| Pruebas | modificar | `test/memory-system.test.js` | CNF-1, AC-1, AC-2, AC-3, CNF-2, CNF-3, CNF-4 |
| Índice de este repo | regenerar | `docs/index.md` (`memory-system index --root docs`), solo si `docs/specs/01-projects/` ya no existe | CNF-3 |

`package.json › files` no cambia: `skills/memory-system/` ya se publica entero (las semillas y el módulo nuevo viajan con él).

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| `detectLegacyLevels(specsBase)` | `→ string[]`: subconjunto ordenado de `Object.values(LEGACY_LEVELS)` que existe como directorio en `<specsBase>/specs/`; `[]` si `specs/` no existe. Sin escrituras ni excepciones por ausencia. | AC-2 |
| `LEGACY_LEVELS` | `{ projects: '01-projects', epics: '02-epics', stories: '03-stories' }`, exportada por `specs-3-levels.js` | AC-2, CNF-3 |
| `scaffold(options)` | Firma y valor de retorno sin cambios; `warnings[0]` = aviso de tres niveles cuando aplica | AC-2 |
| Línea de aviso | `[WARNING] estructura de specs/ de tres niveles detectada (<lista de "<nivel>/" separada por ", ">): ejecuta /memory-system migrate --from=specs-3-levels` | AC-2 |
| Resumen | Sigue siendo la **última** línea: `creados: N · sobrescritos: S · preservados: M · mapeados: X · omitidos por harness: K` | AC-3 |
| `SPECS_LAYERS` / `KNOWN_LAYERS` | `{ epics: 'specs-epics', stories: 'specs-stories' }`; `KNOWN_LAYERS` sin `specs-projects` | CNF-3 |
| Exit code de `scaffold` | 0 con o sin aviso; 2 solo por los errores de uso existentes | AC-2 |

Dependencias: `memory-system.js` → `specs-3-levels.js` (`detectLegacyLevels`, `LEGACY_LEVELS`); `specs-3-levels.js` → motor solo
mediante `engine()` en tiempo de llamada (STORY-114 D-1). `detectLegacyLevels` usa solo `node:fs`/`node:path`, así que no necesita al
motor y no crea ciclo en tiempo de carga.

## Esquema de datos

Árbol semilla resultante (archivos, relativo a `assets/scaffold/`):

```
constitution.md
adr/README.md · architecture/README.md · domains/README.md · guardrails/README.md · guides/README.md
policies/README.md · runbooks/README.md
product/README.md · product/objectives.md · product/roadmap.md · product/stakeholders.md · product/vision.md
requirements/README.md · requirements/functional/.gitkeep · requirements/non-functional/.gitkeep
specs/README.md · specs/epics/.gitkeep · specs/stories/.gitkeep
templates/README.md · templates/{adr,domain,guardrail,policy}-template.md
```

Frontmatter de `product/roadmap.md` (semilla): ver D-2.

## Flujos clave

### F-1 — Proyecto vacío (AC-1)

`/memory-system scaffold` → `detect` → motor `scaffold`: `detectLegacyLevels` → `[]` (sin aviso) → semillas en orden ordinal
(`[CREADO]` por archivo, incluidos `product/roadmap.md`, `requirements/functional/.gitkeep`, `requirements/non-functional/.gitkeep`,
`specs/epics/.gitkeep`, `specs/stories/.gitkeep`) → directorios de capa → plantillas compartidas → resumen.

### F-2 — Estructura antigua (AC-2)

`scaffold` → `detectLegacyLevels` → `['01-projects', '02-epics', '03-stories']` → `warnings[0]` = aviso → semillas copia-si-falta
(ninguna bajo los niveles viejos) → `[WARNING] estructura …` → resumen → exit 0. En `ensure`, el `index` posterior falla con exit 2
nombrando `specs-01-projects` o `specs-02-epics` (D-6); el aviso ya indicó la migración.

### F-3 — Segunda ejecución con roadmap editado (AC-3)

`scaffold` → cada semilla existe → `[PRESERVADO]` (los `.gitkeep` de directorios existentes no se listan) → plantillas compartidas
`[PRESERVADO]` → `creados: 0 · sobrescritos: 0 · preservados: M · …`.

### F-4 — Degradación (P7)

- `specs/` ausente o ilegible al detectar → `[]`, sin aviso (la detección nunca bloquea el scaffold).
- `specs-3-levels.js` ausente en una instalación incompleta → error de `require` al cargar el motor (exit 1, "error inesperado"): el
  módulo viaja en `skills/memory-system/` y lo instala `agile-sddf install` con el resto del skill; no se añade fallback silencioso.
- Sin `node` → scaffold inline del `SKILL.md` con la misma regla de aviso (D-7).
- `roadmap-template.md` aún no existe → `S115-UT-005` se omite con motivo; la semilla manda (D-2).

## Decisiones de complejidad justificada

- **Función de detección en el módulo de STORY-114** en lugar de una comprobación en línea dentro de `scaffold()`: una línea más de
  indirección, pero mantiene `LEGACY_LEVELS` en un único archivo, condición del grep de cierre de EPIC-21 (CR-005 de STORY-114).
- **Regla condicional de creación del módulo** (crear mínimo o ampliar): necesaria porque EPIC-21 no ordena STORY-114 respecto de
  esta historia; la alternativa (bloquear esta historia hasta STORY-114) serializa trabajo independiente.
- **Prueba de coherencia con el template que puede omitirse:** el template lo crea STORY-111, cuyo orden respecto de esta historia
  tampoco está fijado; un `skip` explícito con motivo es más simple que duplicar el template en un fixture.
- Nada más se añade: el `.gitkeep` de subcarpetas, la copia-si-falta, la idempotencia y el canal `[WARNING]` ya existen.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Árbol limpio | `S096-UT-001` + `S096-UT-001b`: existen `specs/epics/`, `specs/stories/`, `product/{vision,stakeholders,objectives,roadmap}.md`, `requirements/{functional,non-functional}/`; no existen los tres niveles viejos | AC-1 |
| 2 | Aviso sin tocar | `S115-UT-001…003`: línea `[WARNING]` exacta, árbol viejo con el mismo hash, exit 0, resumen última línea | AC-2 |
| 3 | Idempotencia | `S115-UT-004`: segunda corrida `creados: 0 · sobrescritos: 0`, roadmap byte a byte igual | AC-3 |
| 4 | Fuente única | Test del árbol semilla exacto; `memory-rules.md` §5 nombra las mismas rutas (`grep -n "roadmap.md\|requirements/functional/.gitkeep\|specs/epics/.gitkeep" skills/memory-system/references/memory-rules.md`); `npm test` exit 0 | CNF-1 |
| 5 | Roadmap = template | `S115-UT-005` | CNF-2 |
| 6 | Capa retirada | `git grep -n "specs-projects" -- skills test` → vacío salvo la aserción negativa de `S096-UT-001b`; `git grep -n "01-projects" -- skills/memory-system` → solo `scripts/specs-3-levels.js`, su fixture, las evals del modo migrate/aviso y la nota de §2/§5 de `memory-rules.md` y del `SKILL.md`; `S115-UT-007` | CNF-3 |
| 7 | Encoding | `S115-UT-006` | CNF-4 |
| 8 | Evals | `npm run test:eval -- memory-system --dry-run` planifica TC-007 y el caso nuevo; `node scripts/verify-eval-inventory.js` OK | AC-1, AC-2 |
| 9 | Índice del repo | Si `docs/specs/01-projects/` no existe: `node skills/memory-system/scripts/memory-system.js index --root docs` exit 0 y `docs/index.md` sin `L3 — Proyecto` | CNF-3 |

## Risks / Trade-offs

- [`ensure` sobre un repo de tres niveles termina con exit 2 en `index`] → Ya ocurre desde STORY-108 para `02-epics/` (CR-002); el
  `[WARNING]` del scaffold, impreso antes, indica `migrate --from=specs-3-levels`.
- [`rebuild --force` sobrescribe `roadmap.md`, que acumula propuestas] → Misma regla que `vision.md` y demás semillas gestionadas; el
  modo exige `--force` y muestra la advertencia de pérdida de cambios. Aceptado para no introducir una categoría de "semilla no
  sobrescribible".
- [El marcador de `## Épicas` sobrevive si `/project-planning` no lo rellena] → CR-001 a STORY-111.
- [Orden con STORY-111 y STORY-114 no fijado por EPIC-21] → Reglas condicionales de D-2, D-5 y D-8 (crear mínimo o reutilizar).
- [`docs/specs/01-projects/` de este repo aún existe al implementar] → No se regenera `docs/index.md` (contrato #9 condicionado); la
  sección `L3` queda hasta que STORY-104…108 lo vacíen y se regenere.
- [Directorios `specs/epics/` vacíos creados junto a los niveles viejos] → Inofensivos; STORY-114 mueve dentro de ellos.

## Open Questions

Ninguna. Las ambigüedades se resolvieron en las decisiones y quedan registradas como CR.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: con la semilla, `product/roadmap.md` existe desde el scaffold, así que `/project-planning` entra siempre por la rama
  "Roadmap existente" de STORY-111 D-6, que solo inserta la propuesta y nunca escribe la foto de `## Épicas`. El marcador
  `[Por completar: …]` de la semilla quedaría para siempre.
- **Documento afectado**: design.md de STORY-111
- **Acción requerida**: en la materialización sobre un roadmap existente, si el cuerpo propio de `## Épicas` está vacío según la regla
  de STORY-114 D-5 (blancos, comentarios, marcadores `[…]`), reemplazarlo por la foto de `$EPICS_INVENTORY` (o `Sin épicas creadas
  al <fecha>.`). Es la misma regla que STORY-114 D-8 aplica al migrar.

### CR-002
- **Tipo**: inconsistencia (dependencia)
- **Descripción**: STORY-108 D-3 y F-3 afirman que un repo con layout viejo "degrada a la capa `specs-02-epics` … sin error". El
  motor (`validateLayers`) lanza `UsageError` (exit 2) cuando una capa con nodos no tiene placeholder en el template, así que `index`
  y `ensure` fallan sobre ese repo. Esta historia hereda y documenta ese comportamiento para `01-projects` (D-6).
- **Documento afectado**: design.md de STORY-108
- **Acción requerida**: corregir F-3 de STORY-108 ("`index` termina con exit 2 nombrando la capa; se resuelve con STORY-114") o, si
  se quiere degradación sin error, decidirlo allí; esta historia no cambia el fallback.

### CR-003
- **Tipo**: ambigüedad
- **Descripción**: `story.md` enlaza `[[ADR-0013-eliminar-specs-01-projects]]` (referencias y `related`), pero el slug declarado del
  ADR es `eliminar-specs-01-projects`; `memory-system check` informa el wikilink como `broken-wikilink`.
- **Documento afectado**: story.md
- **Acción requerida**: sustituir el wikilink por `[[eliminar-specs-01-projects]]` (como hacen los diseños de STORY-111 y STORY-114).

### CR-004
- **Tipo**: dependencia
- **Descripción**: CNF-1 cita "la descripción del `SKILL.md`"; el `description` del frontmatter no enumera directorios y su cambio
  (`--from=specs-3-levels`) pertenece a STORY-114. El diseño interpreta "descripción" como las secciones que describen el scaffold
  (D-7).
- **Documento afectado**: story.md
- **Acción requerida**: aceptar la interpretación o precisar CNF-1 ("las secciones del `SKILL.md` que describen el scaffold").
