---
alwaysApply: false
type: design
id: STORY-114
slug: STORY-114-migrate-specs-3-levels-design
title: "Design: Implementar memory-system migrate --from=specs-3-levels"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-21-colapsar-specs-dos-niveles
story: STORY-114
created: 2026-10-08
updated: 2026-10-08
related:
  - STORY-114-migrate-specs-3-levels
  - eliminar-specs-01-projects
  - STORY-101-dod-story-por-etapa
  - STORY-104-migrar-project-intent-a-vision
  - STORY-105-migrar-stakeholders-y-requisitos
  - STORY-106-migrar-plan-a-roadmap
  - STORY-107-migrar-story-map-y-diagrama-contexto
  - STORY-108-renombrar-specs-sin-prefijos
  - STORY-109-project-begin-escribe-vision
  - STORY-110-discovery-escribe-stakeholders-y-requisitos
  - STORY-111-planning-escribe-roadmap
  - STORY-115-scaffold-dos-niveles-y-capas-destino
---

<!-- Referencias -->
[[STORY-114-migrate-specs-3-levels]] · [[eliminar-specs-01-projects]] · [[STORY-101-dod-story-por-etapa]] · [[STORY-104-migrar-project-intent-a-vision]] · [[STORY-105-migrar-stakeholders-y-requisitos]] · [[STORY-106-migrar-plan-a-roadmap]] · [[STORY-107-migrar-story-map-y-diagrama-contexto]] · [[STORY-108-renombrar-specs-sin-prefijos]] · [[STORY-109-project-begin-escribe-vision]] · [[STORY-110-discovery-escribe-stakeholders-y-requisitos]] · [[STORY-111-planning-escribe-roadmap]] · [[STORY-115-scaffold-dos-niveles-y-capas-destino]]

# Diseño técnico: `memory-system migrate --from=specs-3-levels`

## Context

[[eliminar-specs-01-projects]] (ADR-0013) colapsa `specs/` a dos niveles y reparte `01-projects/` en `product/`, `requirements/`
y `architecture/`. En este repositorio la migración se hace a mano (STORY-104…108); esta historia la automatiza para repos de
terceros como un origen más de `memory-system migrate`.

**Estado medido (2026-10-08):**

| Pieza | Estado |
|---|---|
| `skills/memory-system/scripts/memory-system.js` (1050 líneas) | Motor determinista, solo módulos nativos (NFR-2). `MIGRATE_SOURCES = ['dod-monolithic', 'epic-template-v1']`; `runMigrate` despacha con un ternario a `dodStory.migrateDod` o `epicTemplate.migrateEpics`. Ambos devuelven `{ lines, summary, exitCode }`. Exporta `parseFrontmatter`, `extractWikilinks`, `scanNodes`, `readText`, `under`, `assertInsideRoot`, `toPosix`, `todayIso`, `UsageError`, `SCAFFOLD_DIR`. `SPECS_LAYERS` mapea `01-projects`/`02-epics`/`03-stories` (STORY-108 D-3 cambia las dos últimas claves a `epics`/`stories`). |
| `scripts/dod-story.js` (`migrate --from dod-monolithic`) | Precedente del contrato: cabecera `── memory-system migrate ── from: <origen> · root: <root>`, una línea `[ETIQUETA] <ruta> — <nota>` por destino, regla `─`×48, totales `creados: · sobrescritos: · preservados: · reemplazados:` y, con `--dry-run`, una última línea `cambios pendientes: N`. Etiquetas en condicional en `--dry-run`. `[NO MIGRADO]` → exit 1 y el origen no se reemplaza. |
| `scripts/epic-template.js` | Segundo precedente: conocimiento propio de un artefacto en un módulo aparte, utilidades del motor pedidas con `engine()` en tiempo de llamada (require circular). |
| `skills/memory-system/SKILL.md` | Secuencias 3.7 (`dod-monolithic`) y 3.8 (`epic-template-v1`): sin pregunta, reenvían la salida del motor. Regla dura: **"Nunca se elimina nada: ningún modo borra archivos ni directorios."** El Paso 1 normaliza `--from=valor` a `--from valor`. |
| `skills/memory-system/assets/scaffold/product/` | Semillas `vision.md` (3 secciones), `stakeholders.md`, `objectives.md` con marcadores `[Por completar: …]`; `roadmap.md` llega con STORY-115. |
| `test/memory-system.test.js` (1058 líneas) | `node --test`; fixtures copiadas de `skills/memory-system/examples/<caso>/` a un `mkdtemp`. `examples/sane/docs` pasa `check` con `problemas: 0`. |
| Mapa de destino | STORY-104 (intención → `vision.md`, D-1), STORY-105 (§1.8 → `stakeholders.md`; FR/NFR → un archivo por requisito, D-2/D-3), STORY-106 (plan → `roadmap.md`, `Objetivo` → `objectives.md`, D-1/D-3/D-5), STORY-107 (`story-map.md` → `product/`, `.puml` → `architecture/c4/`), STORY-108 (renombrado de niveles). Los cuatro primeros están `READY-FOR-IMPLEMENT`; STORY-108 en `PLAN`. |
| Escritores de las capas (diseñados) | STORY-109 D-2 (estructura de `vision.md`), STORY-110 D-2/D-3/D-8 (destino de cada sección de `project.md`, disposición siempre fragmentada, forma del archivo de requisito y de `stakeholders.md`), STORY-111 D-1/D-2 (`roadmap.md`: `## Épicas`, `## Plan original (…)`, `## Propuesta (…)`). |
| Templates de origen | `project-intent-template.md` (6 secciones `##`), `project-template.md` (§1.1–1.8, §2 con `- **FR-NNN**:`/`- **NFR-NNN**:`, §2.3, §3.x, §4.1, §11, §12), `project-plan-template.md` (`## Objetivo`, `## Backlog de Historias`, `## Propuesta de Épicas`, `## Resumen`). |
| `docs/requirements/README.md` | Declara "SRS único" como disposición por defecto (STORY-118, en SPECIFY), en tensión con AC-1 ("un archivo por FR y NFR"). Ver CR-003. |

Dependencia de ejecución: EPIC-21 ordena esta historia después de STORY-108 (renombrado). El diseño asume `SPECS_LAYERS` con claves
`epics`/`stories`; los nombres heredados solo existen dentro del módulo de esta historia (D-1).

Stack (constitución + `package.json`): Node.js ≥ 18, módulos nativos, `node --test`. No hay `skills.plan` en `sddf.config.yaml`.
Principio 11 de la constitución: los casos de `evals/evals.json` se escriben antes que el `SKILL.md`.

## Goals / Non-Goals

**Goals:**

- `migrate --from=specs-3-levels` deja el contenido de `01-projects/` en `product/`, `requirements/` y `architecture/c4/`, mueve
  `02-epics/` → `specs/epics/` y `03-stories/` → `specs/stories/`, elimina `01-projects/` y deja `check` en exit 0. // satisface: AC-1
- `--dry-run` informa el plan sin escribir; repetir la migración sobre un repo ya migrado informa 0 cambios. // satisface: AC-2
- Todo lo que no tiene destino seguro se marca `[NO MIGRADO]` con motivo, exit 1, y `01-projects/` sobrevive. // satisface: AC-3
- Informe con el formato de `dod-monolithic`; los orígenes existentes no cambian. // satisface: CNF-1
- Ningún archivo se pierde; épicas e historias se mueven sin cambiar de contenido en el movimiento. // satisface: CNF-2
- Los movimientos se ven en git como renombrados. // satisface: CNF-3
- Cobertura en `test/memory-system.test.js`; `npm test` exit 0. // satisface: CNF-4

**Non-Goals:**

- Reconciliar el plan con las épicas reales (la sección `## Épicas` es una foto, no una conciliación) ni reescribir menciones
  textuales a rutas viejas o claves de frontmatter (`parent:`, `related:`).
- Repos multi-proyecto (se rechazan, D-3) y la migración SRS → fragmentado (STORY-118).
- Aplicar las transformaciones de STORY-110 D-2 a las secciones sin destino de ADR-0013 (CR-002).
- Que `scaffold` deje de crear `01-projects/` o avise de la estructura vieja (STORY-115); migrar este repositorio (STORY-104…108).
- Regenerar `requirements/README.md` como índice de requisitos (el índice es `docs/index.md`, regenerado por la secuencia del skill).

## Decisions

### D-1 — Módulo propio `specs-3-levels.js` registrado en el motor // satisface: CNF-1, AC-1

- Archivo nuevo `skills/memory-system/scripts/specs-3-levels.js`, mismo patrón que `dod-story.js` y `epic-template.js`: conocimiento
  de la estructura de tres niveles (nombres heredados, templates de origen, mapa de destino) separado del motor genérico; utilidades
  del motor pedidas con `engine()` en tiempo de llamada; solo módulos nativos.
- Constante única `LEGACY_LEVELS = { projects: '01-projects', epics: '02-epics', stories: '03-stories' }` (exportada). Es el **único**
  lugar del código de `skills/` que nombra los niveles viejos; las pruebas construyen rutas con ella (CR-005).
- `memory-system.js`: `MIGRATE_SOURCES` suma `'specs-3-levels'`; `USAGE` y la cabecera de subcomandos lo listan; `runMigrate`
  reemplaza el ternario por una tabla `MIGRATORS = { 'dod-monolithic': …, 'epic-template-v1': …, 'specs-3-levels': … }` (cada
  entrada recibe `(specsBase, args)` y devuelve `{ lines, summary, exitCode }`). Los dos orígenes existentes no cambian de
  comportamiento ni de salida.

**Alternativas rechazadas:**

- *Implementarlo dentro de `memory-system.js`:* añadiría ~600 líneas de conocimiento de `project*.md` a un motor que hoy es genérico;
  los dos precedentes ya separaron su conocimiento propio.
- *Migración asistida solo en `SKILL.md` (el LLM lee y redacta):* no determinista, no idempotente y no comprobable por `npm test`;
  la nota de la historia pide un motor determinista y relegar lo ambiguo a `[NO MIGRADO]`.
- *Reglas de movimiento declarativas en un JSON:* el reparto de `project.md` exige parseo (requisitos, cobertura de §1.x) que un
  archivo de reglas no expresa; sería un intérprete para un único caso (YAGNI).

### D-2 — Unidad de migración = archivo de origen, atómica; bloqueo global solo para multi-proyecto // satisface: AC-1, AC-3, CNF-2

- Cada archivo de `01-projects/<PROJ>/` es una **unidad**: o se migra completa (todos sus destinos escritos y el origen eliminado) o no
  se toca (queda en su sitio y el informe dice por qué). No hay migración parcial de un archivo ni reescritura del origen.
- Los dos niveles (`02-epics`, `03-stories`) son unidades de movimiento independientes, entrada por entrada (D-11).
- **Bloqueo global** (no se escribe nada en todo el repo): `01-projects/` con dos o más proyectos (D-3). Es el único caso en que la
  migración no puede elegir una fuente.
- **Orden de aplicación** (no-pérdida, P7): (1) escribir destinos de las unidades listas → (2) mover `story-map.md` y diagramas →
  (3) mover entradas de `02-epics`/`03-stories` → (4) reescribir wikilinks (D-12) → (5) eliminar los orígenes migrados →
  (6) eliminar directorios vaciados (`01-projects/<PROJ>/`, `01-projects/` y los niveles viejos), y `01-projects/` solo si el plan no
  tiene ningún `[NO MIGRADO]` (AC-3, literal).
- **Reanudación:** si la ejecución se interrumpe, la siguiente encuentra los orígenes aún presentes; sus destinos ya escritos
  coinciden con lo que se renderizaría (comparación de cuerpos, D-10) y se informan `[PRESERVADO]`, así que la unidad completa los
  pasos 4–6 sin duplicar nada.

**Alternativas rechazadas:**

- *Todo o nada (transacción global):* un solo `[NO MIGRADO]` impediría incluso el renombrado de niveles; el precedente
  `dod-monolithic` aplica lo seguro y conserva el origen.
- *Migración por sección reescribiendo el origen (dejar en `project.md` solo lo pendiente):* modifica un archivo del usuario que todavía
  no se migró y complica la reanudación; la unidad atómica deja el origen intacto hasta que todo su contenido tiene hogar.
- *Conservar siempre los orígenes y borrarlos a mano:* rompe AC-1 ("`01-projects/` ya no existe") y deja doble fuente de verdad.

### D-3 — Descubrimiento y precondiciones // satisface: AC-1, AC-3

Sobre `<SPECS_BASE>/specs/`:

| Situación | Resultado |
|---|---|
| Ningún nivel viejo existe | Plan vacío: cabecera, regla y totales en 0; exit 0 (AC-2 filas 2 y 3). No es un error de uso. |
| `01-projects/` sin subdirectorios (vacío o solo `.gitkeep`) | Solo se elimina `01-projects/` (si no hay `[NO MIGRADO]`). |
| `01-projects/` con un subdirectorio | Ese es el proyecto; sus archivos se clasifican (D-4). |
| `01-projects/` con ≥ 2 subdirectorios | Bloqueo global: `[NO MIGRADO] specs/01-projects/ — <N> proyectos (<a>, <b>): ADR-0013 admite un solo proyecto por raíz; migra o separa cada proyecto a mano y re-ejecuta`. Exit 1, nada se escribe. |
| Archivo suelto en `01-projects/` distinto de `.gitkeep` | `[NO MIGRADO] <ruta> — archivo fuera de un proyecto` (impide eliminar `01-projects/`). |
| Subdirectorio dentro del proyecto | `[NO MIGRADO] <ruta>/ — subdirectorio sin destino`. |

**Alternativas rechazadas:** elegir el proyecto con número menor o el único con `substatus` activo (decide por el usuario, lo que AC-3
prohíbe) y migrar cada proyecto a subcarpetas `product/<PROJ>/` (estructura multi-proyecto que ADR-0013 difiere a otro ADR).

### D-4 — Mapa de destino (sin redefinirlo) // satisface: AC-1, CNF-2

| Origen (`specs/01-projects/<PROJ>/`) | Destino | Regla | Precedente |
|---|---|---|---|
| `project-intent.md` | `product/vision.md` | D-6 | STORY-104 D-1, STORY-109 D-2 |
| `project.md` §1.1–1.7 | — (cubiertas por la visión) o `product/vision.md` si no hay `project-intent.md` | D-6 | STORY-110 D-2 |
| `project.md` §1.8 | `product/stakeholders.md › Usuarios y roles` | D-7 | STORY-105 D-5 |
| `project.md` FR / NFR | `requirements/functional/FR-NNN-<slug>.md` · `requirements/non-functional/NFR-NNN-<slug>.md` | D-7 | STORY-105 D-2/D-3, STORY-110 D-3/D-8 |
| `project.md` §2.3, §3.x, §4.x, §11, §12 y secciones fuera del template | `[NO MIGRADO]` si tienen contenido; `[OMITIDO]` si están vacías | D-5 | nota "Dependencia de decisión" de la historia |
| `project-plan.md` `## Objetivo` | `product/objectives.md › Objetivos de negocio` | D-8 | STORY-106 D-5 |
| `project-plan.md` resto | `product/roadmap.md › ## Plan original (<fecha>)` | D-8 | STORY-106 D-3, STORY-111 D-1 |
| `story-map.md` | `product/story-map.md` (movido; `type: product`) | D-9 | STORY-107 D-1 |
| `*.puml` y su render homónimo `.png`/`.svg` | `architecture/c4/<nombre>` (movido) | D-9 | STORY-107 D-2 |
| Cualquier otro archivo | `[NO MIGRADO] <ruta> — archivo sin destino en ADR-0013` | — | — |
| `specs/02-epics/*` · `specs/03-stories/*` | `specs/epics/*` · `specs/stories/*` | D-11 | STORY-108 D-1 |

Los nombres de archivo de origen son fijos (los que escriben los skills de proyecto); se reconocen por nombre, no por contenido.

### D-5 — Reconocimiento de secciones y regla de "vacío" // satisface: AC-3, CNF-2

- **Normalización de encabezado** (para comparar con los templates): quitar comentarios HTML en línea, quitar numeración inicial
  (`^\d+(\.\d+)*\.?\s+`), NFD sin diacríticos, minúsculas, espacios colapsados. `## 1.3. Visión (elevator pitch)` →
  `vision (elevator pitch)`.
- **Cuerpo propio** de una sección: sus líneas hasta el siguiente encabezado de cualquier nivel (las subsecciones se evalúan aparte).
- **Línea vacía de contenido**: en blanco; dentro de un bloque `<!-- … -->` (también multilínea); o **marcador**: tras quitar viñeta,
  casilla `[ ]`/`[x]` y etiqueta en negrita `**X**:`/`**X:**`, lo que queda es solo `[...]` sin `(` a continuación (no es un enlace)
  — cubre `[Por completar: …]` y los placeholders de template (`- [Beneficio clave 1]`, `- **Technical**: [Stack…]`).
- Sección **vacía** = todo su cuerpo propio son líneas vacías de contenido. Una sección vacía nunca bloquea: se informa
  `[OMITIDO] <origen> › <encabezado> — sección vacía`.
- Clasificación de cada sección de `project.md` por encabezado normalizado:

| Clase | Encabezados normalizados | Con contenido |
|---|---|---|
| visión | `nombre de proyecto`, `definicion del problema`, `vision (elevator pitch)`, `beneficios clave`, `criterios de exito`, `restricciones`, `fuera de alcance (non-goals)` | D-6 |
| usuarios | `caracteristicas de los usuarios` | `stakeholders.md` (D-7) |
| contenedor | `definicion del proyecto`, `requisitos`, `requisitos funcionales`, `requisitos no funcionales` | su cuerpo propio debe estar vacío; si no: `[NO MIGRADO] … — contenido fuera de un requisito` |
| categoría | cualquier otro encabezado **dentro** del subárbol de `requisitos` que no sea de la clase "sin destino" | requisitos (D-7) |
| sin destino | `experiencia de usuario (ux) y diseno de interfaz (ui)`, `diseno de interfaz grafica (ui) y experiencia de usuario (ux)`, `design vibe`, `visual inspiration`, `mapas de navegacion`, `wireframe ascii (box drawing)`, `arquitectura tecnica`, `stack tecnologico`, `referencias`, `definiciones y acronimos` | `[NO MIGRADO] … — sección del template sin destino asignado por ADR-0013; muévela a mano y re-ejecuta` |
| no reconocida | cualquier otra (p. ej. `Apéndice A — …`) | `[NO MIGRADO] … — sección no reconocida por el template de SDDF` |

- **Preámbulo** (antes del primer encabezado `##` en `project-intent.md`/`project-plan.md`, o del primer `#` numerado en `project.md`):
  se descartan el título `# …`, los comentarios HTML y la línea `<!-- Referencias -->` con las líneas que solo contienen wikilinks;
  cualquier otra línea → `[NO MIGRADO] <origen> › preámbulo — contenido antes de la primera sección`.
- Un `[NO MIGRADO]` de sección bloquea su unidad completa (D-2).

**Alternativas rechazadas:**

- *Tratar como vacío solo `[Por completar`:* un `project.md` generado conserva placeholders `[...]` del template en secciones que nadie
  rellenó; bloquearían la migración sin que haya contenido que perder.
- *Reconocer secciones por número (`1.8`, `2.1`):* la numeración diverge entre el template (`### 2.1 [Categoría]`) y los proyectos reales
  (`## 2.1 Requisitos Funcionales` + `### 2.1.1 …`); el título normalizado es estable.
- *Aplicar a las secciones "sin destino" el reparto de STORY-110 D-2:* exige sintetizar criterios de verificación y atribuir fuentes
  (no determinista) y descarta §3.4 y §12, contra CNF-2 (CR-002).

### D-6 — `product/vision.md` // satisface: AC-1, AC-3

- **Fuente de la visión:** `project-intent.md` si existe; si no, las secciones de clase "visión" de `project.md` (caso
  `reverse-engineering`, que no genera intención).
- **Correspondencia** (STORY-104 D-1 / STORY-109 D-2):

| Encabezado de origen (normalizado) | Destino |
|---|---|
| `definicion del problema` | `## Problema que resolvemos` |
| `vision (elevator pitch)` | `## Propuesta de valor` › `### Visión (elevator pitch)` |
| `beneficios clave` | `## Propuesta de valor` › `### Beneficios clave` |
| `criterios de exito` | `## Criterios de éxito` |
| `restricciones` | `## Alcance y límites` › `### Restricciones` |
| `fuera de alcance (non-goals)` | `## Alcance y límites` › `### Fuera de alcance (Non-Goals)` |

- **Copia literal:** el cuerpo se traslada sin parafrasear; se descartan solo los bloques de comentario HTML y las líneas en blanco de
  los extremos; los encabezados internos se desplazan tantos niveles como el destino (`##` → `###`). Una sección de origen vacía o
  ausente deja en el destino el marcador `[Por completar]` (STORY-109 D-4 la tratará como pendiente).
- Un `##` de `project-intent.md` fuera de la tabla → `[NO MIGRADO]` (sección no reconocida).
- **Cobertura de `project.md` §1.1–1.7 cuando existe `project-intent.md`:** cada sección con contenido está **cubierta** si cada línea
  de contenido (recortada, espacios colapsados) aparece como subcadena del texto normalizado de `project-intent.md`. Cubierta →
  `[OMITIDO] project.md › <sección> — cubierta por project-intent.md`; no cubierta → `[NO MIGRADO] project.md › <sección> — difiere
  de project-intent.md ("<primera línea no cubierta, 60 caracteres>"); unifica el texto y re-ejecuta`. Sin `project-intent.md`, `Nombre
  de Proyecto` aplica la misma prueba contra el texto de las otras seis secciones.
- **Frontmatter:** el de la semilla o el existente; cambia `updated` (fecha de migración) y `substatus` = `DONE` si el origen tiene
  `substatus` `DONE`/`READY` o `status: COMPLETED`, `IN-PROGRESS` si su `substatus` es `IN-PROGRESS`; en otro caso se conserva.

**Alternativas rechazadas:**

- *Añadir a `vision.md` las §1.x de `project.md` que difieren, como subsecciones "(desde project.md)":* dos textos para el mismo concepto
  dentro de la misma fuente de verdad; es la deriva que ADR-0013 elimina.
- *Ignorar §1.1–1.7 de `project.md` siempre (darlas por duplicadas):* perdería texto refinado durante el discovery sin avisar (CNF-2).
- *Conservar el `substatus` de la semilla (`TODO`):* `project-discovery` exige visión `DONE` (STORY-110 D-1) y obligaría a repetir la
  entrevista de una visión ya aprobada.

### D-7 — `stakeholders.md` y requisitos // satisface: AC-1, AC-3, CNF-2

- **Usuarios:** el cuerpo literal de §1.8 (sin comentarios) rellena `## Usuarios y roles` de `product/stakeholders.md` (D-10). Las otras
  dos secciones de la semilla no se tocan.
- **Parseo de requisitos** (dentro del subárbol `requisitos`, por sección de clase "categoría"):
  - ítem: `^- \*\*(FR|NFR)-(\d{3,})(\*\*:|:\*\*)\s*(.+)$` → ID y título; el `kind` sale del prefijo, no de la sección.
  - campo: línea sangrada `- **<Campo>**: <valor>` (o `**<Campo>:**`); continuación: línea no vacía con sangría mayor que la del
    guion del campo, que se une conservando el salto de línea y quitando la sangría de continuación (STORY-105 D-2).
  - ítem cuyo título es un marcador (D-5) → ejemplo del template: `[OMITIDO] … › <ID> — requisito de ejemplo del template`.
  - línea con contenido que no es ítem, campo ni continuación → `[NO MIGRADO] project.md › <categoría> — contenido fuera del patrón
    de requisito ("<línea>")`.
  - ID repetido en `project.md` → `[NO MIGRADO] project.md › <ID> — ID duplicado`.
- **Archivo de requisito** (forma de STORY-105 D-2 con la etiqueta `Categoría` del template de STORY-110 D-8):
  - ruta `requirements/functional/<ID>-<slug>.md` o `requirements/non-functional/<ID>-<slug>.md`; `slug` = regla de STORY-105 D-3
    (NFD sin diacríticos → minúsculas → `[^a-z0-9]+` → `-` → sin guiones extremos → recorte ≤ 50 en el último `-`).
  - frontmatter `type: requirement`, `kind`, `id`, `slug: <ID>-<slug>`, `title` (literal, entre comillas dobles, `"` escapada),
    `status: active`, `created`/`updated` = fecha de migración, `related: []`.
  - cuerpo: `# <ID> — <título>`; `## Descripción` (campo `Descripción`, o `[Por completar]` si falta); `## Criterios de verificación`
    solo si existe el campo `Criterio de aceptación`; `## Atributos` con `Prioridad`, `Usuario`, `Fuente` (los presentes, en ese orden),
    `Categoría` (encabezado de la categoría sin numeración) y después cualquier otro campo en el orden de origen, todos como
    `- **<Campo>**: <valor>` literal.
- **Colisiones de ID** (los IDs nunca se renumeran): si ya existe `requirements/<kind>/<ID>-*.md` o un `### <ID>` en
  `requirements/srs-*.md`: cuerpo idéntico al renderizado → `[PRESERVADO]` (reanudación); distinto → `[NO MIGRADO] project.md › <ID> —
  ya existe <ruta>`. `--force` **no** aplica a requisitos.
- Si existe algún `requirements/srs-*.md`: `[WARNING] requirements/<srs> — existe un SRS único; los requisitos migrados se escriben
  fragmentados (STORY-118)`.

**Alternativas rechazadas:**

- *Escribir un SRS único `srs-<proyecto>.md` por debajo del umbral del README:* contradice AC-1 ("un archivo por FR y NFR") y la
  disposición de STORY-110 D-3 (CR-003).
- *Llevar `Prioridad`/`Usuario` al frontmatter:* nadie los consulta ahí y se alejan del lector (STORY-105 D-2).
- *Permitir `--force` sobre un ID existente:* sobrescribiría un requisito distinto con el mismo ID o dejaría dos archivos con un ID.

### D-8 — `roadmap.md` y `objectives.md` // satisface: AC-1, CNF-2

- `## Objetivo` de `project-plan.md` (si no está vacío) rellena `## Objetivos de negocio` de `product/objectives.md` (D-10).
- El resto del plan va a `product/roadmap.md` en la sección `## Plan original (<fecha>)`:
  - `<fecha>` = `created` del plan si es `YYYY-MM-DD`; si no, `date`; si no, la fecha de migración.
  - primera línea del cuerpo: `> Histórico: plan de épicas de \`project-plan.md\` migrado sin cambios; no refleja el estado actual de
    las épicas.`
  - contenido: el cuerpo literal sin frontmatter, sin preámbulo (D-5), sin `## Objetivo`, sin las líneas separadoras `---` y con cada
    encabezado un nivel más profundo (STORY-106 D-3).
- `## Épicas` (STORY-111 D-1/D-2): si el roadmap se crea o su `## Épicas` está vacía, se rellena con la foto de épicas — línea
  `Foto del <fecha>: <N> épicas. Valores copiados del frontmatter de cada epic.md.` y tabla `ID | Épica | Título | Status | Substatus`
  (una fila por `epic.md` de `specs/02-epics/` o `specs/epics/`, orden ordinal por `id`, `[[<slug declarado o nombre del directorio>]]`,
  `—` para campos ausentes, `|` escapado); sin épicas → `Sin épicas creadas al <fecha>.`. Si ya tiene contenido, no se toca (no es
  conflicto: es una foto).
- Un plan sin contenido fuera de `Objetivo` no crea roadmap (`[OMITIDO] project-plan.md — sin plan de épicas`).

**Alternativas rechazadas:**

- *Escribir el plan como `## Propuesta (<fecha>)`:* `epic-from-project-plan` lo tomaría como la última propuesta y rematerializaría
  épicas que el repo ya tiene (STORY-111 D-8); `Plan original` es la sección que ningún skill consume.
- *Reformatear el plan al bloque de épica de STORY-111 D-3:* reescribe contenido (CNF-2) y es la conciliación que la historia excluye.
- *Omitir `## Épicas`:* el roadmap creado tendría otra forma que el de `project-planning` y el de STORY-106.

### D-9 — `story-map.md` y diagramas: movimiento // satisface: AC-1, CNF-3

- `story-map.md` se mueve con `fs.renameSync` a `product/story-map.md` y, si su frontmatter declara `type:`, esa línea pasa a
  `type: product` (única edición, STORY-107 D-1). El slug no cambia (declarado, o derivado `story-map`).
- `*.puml` y su render homónimo (`.png`, `.svg`) se mueven a `architecture/c4/`. Si el destino existe y es idéntico byte a byte, el
  origen se elimina (`[PRESERVADO]` destino + `[ELIMINADO]` origen, STORY-107 D-2).
- Destino existente y distinto → `[NO MIGRADO]` sin `--force`; con `--force`, el destino se reemplaza (`[SOBRESCRITO]`).

**Alternativas rechazadas:** copiar y borrar (mismo resultado, más I/O, y una ventana con el archivo duplicado) y comparar ignorando
fines de línea (un `.puml` que difiere solo en CRLF es "igual" para el lector pero el `.png` podría no corresponder; byte a byte es la
regla verificable).

### D-10 — Relleno por sección de documentos de `product/` // satisface: AC-1, AC-3

`fillDocument` aplica a `vision.md`, `stakeholders.md`, `objectives.md` y `roadmap.md`:

1. **Destino ausente** → base = semilla `assets/scaffold/product/<nombre>.md` con `{date}` resuelto; si no hay semilla (roadmap antes de
   STORY-115) → frontmatter de STORY-111 D-2 (`type: product`, `slug`, `title`, `status: IN-PROGRESS`, `substatus: TODO`,
   `parent: null`, `created`, `updated`) + título + `Volver al mapa: [[index]].`. Acción `[CREADO]`.
2. Se insertan los encabezados del **layout** que falten (constante por documento, en orden): después del último hermano previo del
   layout presente; si no hay, antes del primer hermano siguiente; si no, antes de `Volver al mapa`; si no, al final. Un contenedor del
   layout (`Propuesta de valor`, `Alcance y límites`) cuyo cuerpo propio es vacío (D-5) queda sin cuerpo propio.
3. Por cada sección destino a rellenar: cuerpo vacío (D-5) → se escribe; cuerpo igual al renderizado (comparación de líneas
   normalizadas: sin espacios finales, saltos `\n`) → sin cambio; cuerpo con contenido distinto → **conflicto**.
4. Algún conflicto sin `--force` → la unidad entera es `[NO MIGRADO] <origen> — <destino> tiene contenido propio en: <secciones>; usa
   --force para sobrescribir` y el destino no se escribe (AC-3 fila 2). Con `--force`, los cuerpos en conflicto se reemplazan.
5. Secciones del destino que no están en el layout se conservan en su sitio. Frontmatter: solo `updated` (y `substatus` en la visión,
   D-6). Si nada cambió → `[PRESERVADO]`; si cambió → `[SOBRESCRITO] <destino> — secciones: <lista>` (`— --force: <lista>` si hubo
   reemplazo forzado).

**Alternativas rechazadas:**

- *Regla de documento completo ("semilla intacta" o conflicto):* con `--force` destruiría secciones que la migración no escribe (p. ej.
  `Patrocinadores y decisores` rellenada a mano) — ver Decisiones de complejidad justificada.
- *Detectar contenido propio solo por ausencia de `[Por completar`:* una semilla parcialmente rellenada contiene marcadores y se
  sobrescribiría sin aviso.
- *Fusionar textos en conflicto (añadir al final):* duplica conceptos y decide por el usuario.

### D-11 — Movimiento de épicas e historias // satisface: AC-1, CNF-2, CNF-3

- Para cada nivel (`02-epics` → `epics`, `03-stories` → `stories`): se asegura el directorio destino y se mueve **cada entrada** del
  nivel viejo con `fs.renameSync`. Entrada cuyo nombre ya existe en el destino → `[NO MIGRADO] specs/<viejo>/<entrada> — ya existe
  specs/<nuevo>/<entrada>`. `.gitkeep` del nivel viejo se elimina.
- El nivel viejo se elimina cuando queda vacío. Error del sistema de archivos al mover (p. ej. `EPERM` en Windows con un archivo abierto)
  → `[NO MIGRADO] … — no se pudo mover: <código>`, se sigue con la entrada siguiente.
- Informe: una línea por nivel `[MOVIDO] specs/<viejo>/ → specs/<nuevo>/ — <D> directorios, <F> archivos` más una línea por colisión o
  error (CR-006). El contenido no cambia al mover; git detecta los renombrados al comparar el índice con el árbol (`git add -A` →
  `R`), sin que el motor invoque git.

**Alternativas rechazadas:**

- *Renombrar el directorio del nivel de una vez:* falla si el destino ya existe (scaffold de STORY-115 crea `specs/epics/`) y no permite
  informar colisiones por entrada.
- *Invocar `git mv` con `child_process`:* exige git en PATH y un repo, toca el índice del usuario y falla con archivos no versionados;
  la detección de renombrados de git ya cubre CNF-3 con un movimiento de archivos sin cambios.

### D-12 — Reescritura de wikilinks cuyo slug cambia // satisface: AC-1, CNF-2

- Mapa `slug viejo → slug nuevo`, solo para unidades **migradas en esta ejecución**: slug de `project-intent.md` (declarado o derivado)
  → `vision`; slug de `project.md` (declarado o nombre del directorio del proyecto) → `vision`; slug de `project-plan.md` → `roadmap`.
  `story-map.md` conserva su slug.
- Alcance: los nodos que devuelve `scanNodes(specsBase, 'generic')` después de los movimientos (los mismos que evalúa `check`; quedan
  fuera `index.md`, `templates/` y los derivados de historia). Solo el cuerpo, nunca el frontmatter.
- `rewriteWikilinks(text, map)` reemplaza `[[viejo]]`, `[[viejo|alias]]` y `[[viejo#ancla]]` conservando alias y ancla, fuera de bloques
  `` ``` ``/`~~~` y de código en línea, y sin tocar los embebidos `![[…]]` (misma semántica que `extractWikilinks`).
- Informe: `[ACTUALIZADO] <ruta> — [[viejo]] → [[nuevo]] (<n>)` por archivo modificado.
- Se aplica entre los movimientos y la eliminación de orígenes (D-2): los archivos de épicas/historias se mueven sin cambios y después
  se ajustan sus wikilinks (CR-004).

**Alternativas rechazadas:**

- *`project.md` → `[[stakeholders]]` o `[[requirements-index]]`:* el wikilink al proyecto nombra "el proyecto" (épicas, story map), cuyo
  documento estratégico raíz es la visión; `requirements-index` además depende de una semilla que el repo puede no tener.
- *Excluir `adr/` de la reescritura:* dejaría wikilinks rotos y AC-1 exige `check` sin wikilinks rotos; la sustitución de slug no altera
  la decisión registrada.
- *Dejar los wikilinks y crear nodos "alias" con el slug viejo:* reintroduce archivos en la ruta que se elimina o nodos fantasma.

### D-13 — Informe, totales y exit codes // satisface: CNF-1, AC-2, AC-3

| Etiqueta (real / `--dry-run`) | Uso |
|---|---|
| `[CREADO]` / `[CREARÍA]` | Destino nuevo (documento de `product/` o requisito). |
| `[SOBRESCRITO]` / `[SOBRESCRIBIRÍA]` | Documento existente rellenado o reemplazado (`--force`). |
| `[PRESERVADO]` / `[PRESERVARÍA]` | Destino que ya contiene lo migrado. |
| `[MOVIDO]` / `[MOVERÍA]` | `story-map.md`, diagramas y niveles. |
| `[ACTUALIZADO]` / `[ACTUALIZARÍA]` | Archivo con wikilinks reescritos. |
| `[ELIMINADO]` / `[ELIMINARÍA]` | Origen migrado o directorio vaciado. |
| `[OMITIDO]` / `[OMITIRÍA]` | Sección vacía, ejemplo del template o sección cubierta. |
| `[NO MIGRADO]` | Elemento que la migración no decide, con motivo y acción sugerida. |
| `[WARNING]` | SRS único presente (no cuenta). |

- Cabecera: `── memory-system migrate ── from: specs-3-levels · root: <root>`. Orden de las líneas: el de aplicación (D-2), y dentro de
  cada paso por ruta (orden ordinal).
- Regla `─`×48 y totales: `creados: C · sobrescritos: S · preservados: P · movidos: M · actualizados: A · eliminados: E` (`M` cuenta
  archivos). Con `--dry-run`, última línea `cambios pendientes: C+S+M+A+E`.
- Exit 0 sin `[NO MIGRADO]`; 1 con alguno; 2 para errores de uso (raíz inexistente, destino fuera de la raíz por `assertInsideRoot`),
  sin escribir.

**Alternativas rechazadas:** reutilizar solo las cuatro etiquetas de CNF-1 (un movimiento informado como `[CREADO]` falsea los
conteos de AC-1) y emitir un JSON (el contrato de los demás orígenes es texto).

### D-14 — Skill, documentación y evals // satisface: CNF-1, AC-1, AC-2

- `skills/memory-system/evals/evals.json` (antes que el `SKILL.md`, principio 11): `TC-023` dry-run sobre `examples/specs-3-levels`
  (cabecera, líneas `[MOVERÍA]`/`[CREARÍA]`, `cambios pendientes: N>0`, ningún archivo cambia) y `TC-024` multi-proyecto (`[NO MIGRADO]
  specs/01-projects/`, exit 1, sin escrituras).
- `SKILL.md`: fila en la tabla de modos; Paso 1 admite `--from=specs-3-levels` (misma normalización); fila del contrato de salida en el
  Paso 2; secuencia **3.9** — invoca `migrate --root <SPECS_BASE> --from specs-3-levels [--dry-run] [--force]`, reenvía la salida tal
  cual, recomienda `--dry-run` primero; si el exit es 0 y no es `--dry-run`, ejecuta `index` (regenera `docs/index.md`, SMOKE-3) y
  sugiere `/memory-system check`; con exit 1 no regenera el índice (la capa de `01-projects/` remanente puede no estar en el template)
  y sugiere resolver cada `[NO MIGRADO]` y repetir. Fila del Paso 4 con `✅`/`⚠️`. Sin node: `❌ migrate --from=specs-3-levels requiere
  node` y fin sin escribir (como `epic-template-v1`).
- Regla "Nunca se elimina nada" → "Ningún modo borra archivos ni directorios, salvo `migrate --from=specs-3-levels`, que mueve y elimina
  solo orígenes cuyo contenido ya está en su destino."
- `README.md` del skill (tabla de modos y ejemplo) y `references/memory-rules.md` (fila del origen). Reglas detalladas del mapa en
  `references/specs-3-levels-rules.md` (equivalente de `dod-rules.md`), enlazada desde la secuencia 3.9.

**Alternativas rechazadas:** pedir confirmación antes de aplicar (los otros dos orígenes no preguntan y `--dry-run` cumple ese papel) y
regenerar el índice también con exit 1 (el motor de `index` falla si una capa remanente no está en el template).

### D-15 — Pruebas y fixture // satisface: CNF-4, CNF-3

- Fixture versionada `skills/memory-system/examples/specs-3-levels/docs/`: la base de `examples/sane` (todas las capas y
  `constitution.md`) más `specs/01-projects/PROJ-01-demo/` con `project-intent.md` (6 secciones), `project.md` (§1.1–1.7 copiadas de la
  intención, §1.8 con 2 perfiles, 3 FR y 2 NFR en 2 categorías, §2.3/§3/§4/§11/§12 solo con comentarios del template),
  `project-plan.md`, `story-map.md` y `context-diagram.puml`; `specs/02-epics/EPIC-00-demo/epic.md` y `specs/03-stories/STORY-001-a/story.md`
  con `[[PROJ-01-demo]]` y `[[PROJ-01-demo-project-intent]]`.
- Pruebas nuevas en `test/memory-system.test.js` (prefijo `S114-`), sobre copias en `mkdtemp` y fechas fijas con `--date`; las rutas
  viejas se construyen con `LEGACY_LEVELS`.

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Migrador de tres niveles | crear | `skills/memory-system/scripts/specs-3-levels.js` | AC-1, AC-2, AC-3, CNF-1, CNF-2, CNF-3 |
| Motor de memoria | modificar (`MIGRATE_SOURCES`, `MIGRATORS`, `USAGE`, cabecera) | `skills/memory-system/scripts/memory-system.js` | CNF-1 |
| Contrato del skill | modificar (modos, Paso 1/2/4/5, secuencia 3.9, regla de borrado) | `skills/memory-system/SKILL.md` | AC-1, AC-2, CNF-1 |
| Documentación del skill | modificar | `skills/memory-system/README.md`, `skills/memory-system/references/memory-rules.md` | CNF-1 |
| Reglas del mapa | crear | `skills/memory-system/references/specs-3-levels-rules.md` | AC-1, AC-3 |
| Evals | modificar (`TC-023`, `TC-024`) | `skills/memory-system/evals/evals.json` | AC-2, AC-3 |
| Fixture | crear | `skills/memory-system/examples/specs-3-levels/` | CNF-4 |
| Pruebas | modificar | `test/memory-system.test.js` | CNF-4 |

Se reutilizan del motor `parseFrontmatter`, `extractWikilinks`, `scanNodes`, `readText`, `under`, `assertInsideRoot`, `toPosix`,
`todayIso`, `UsageError` y `SCAFFOLD_DIR` (P3); no se añaden dependencias.

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| `migrateSpecs(specsBase, { dryRun, force, date, displayRoot }) → { lines, summary, exitCode }` | Misma forma que `migrateDod`/`migrateEpics`. Con `dryRun` no escribe. `summary = { created, overwritten, preserved, moved, updated, deleted, unmigrated }`. | AC-1, AC-2, AC-3, CNF-1 |
| `planSpecsMigration(specsBase, { force, date }) → Plan` | Solo lectura. Devuelve el plan completo (D-2) que `migrateSpecs` imprime o aplica. | AC-2 |
| `fillDocument(text \| null, layout, fills, { force, date, seed }) → { action, content, conflicts }` | Pura. `action ∈ create \| fill \| unchanged \| conflict`. | AC-1, AC-3 |
| `parseRequirements(sections) → { requirements, findings }` | Pura. `requirements[] = { id, kind, title, fields: [[campo, valor]], category }`. | AC-1, AC-3 |
| `renderRequirement(req, { date }) → { relPath, content }` | Pura (D-7). | AC-1 |
| `requirementSlug(title) → string` | Pura (regla de STORY-105 D-3). | AC-1 |
| `isEmptyBody(lines) → boolean` | Pura (D-5). | AC-3 |
| `rewriteWikilinks(text, map) → { text, counts }` | Pura (D-12). | AC-1 |
| `LEGACY_LEVELS` | `{ projects, epics, stories }` → nombres de directorio heredados. | CNF-2 |
| CLI | `memory-system.js migrate --root <SPECS_BASE> --from specs-3-levels [--dry-run] [--force] [--date YYYY-MM-DD]` | AC-1, AC-2, AC-3 |
| Skill | `/memory-system migrate --from=specs-3-levels [--dry-run] [--force]` | AC-1, AC-2, AC-3 |

Dependencias: `specs-3-levels.js` → motor (utilidades); motor → `specs-3-levels.js` solo vía `MIGRATORS` (require circular resuelto en
tiempo de llamada, como los dos precedentes). Sin otras dependencias entre módulos.

## Esquema de datos

`Plan`:

| Campo | Contenido |
|---|---|
| `blocked` | `null` o `{ element, reason }` (multi-proyecto, D-3). |
| `units[]` | `{ source, kind (intent \| project \| plan \| story-map \| diagram \| unknown), ready, writes[], omitted[], blockers[], slugChange }`; `writes[] = { target, action (create \| fill \| unchanged \| overwrite \| move), content?, note }`. |
| `levelMoves[]` | `{ from, to, entries[], collisions[], dirs, files }`. |
| `rewrites[]` | `{ path, pairs: [[viejo, nuevo, n]] }`. |
| `removals[]` | rutas de orígenes y directorios a eliminar. |
| `warnings[]` | líneas `[WARNING]`. |

Layouts (constantes, solo encabezados que la migración escribe o necesita):

| Documento | Layout |
|---|---|
| `vision.md` | `## Problema que resolvemos` · `## Propuesta de valor` (`### Visión (elevator pitch)`, `### Beneficios clave`) · `## Criterios de éxito` · `## Alcance y límites` (`### Restricciones`, `### Fuera de alcance (Non-Goals)`) |
| `stakeholders.md` | `## Usuarios y roles` · `## Patrocinadores y decisores` · `## Intereses y conflictos` |
| `objectives.md` | `## Objetivos de negocio` · `## Métricas de éxito` · `## Prioridades` |
| `roadmap.md` | `## Épicas` · `## Plan original (<fecha>)` (insertado antes de la primera `## Propuesta (`) |

Ejemplo de informe (fixture, ejecución real):

```
── memory-system migrate ── from: specs-3-levels · root: docs
[CREADO] product/vision.md — desde specs/01-projects/PROJ-01-demo/project-intent.md
[OMITIDO] specs/01-projects/PROJ-01-demo/project.md › 1.2. Definición del Problema — cubierta por project-intent.md
[SOBRESCRITO] product/stakeholders.md — secciones: Usuarios y roles
[CREADO] requirements/functional/FR-001-<slug>.md
[MOVIDO] specs/03-stories/ → specs/stories/ — 1 directorios, 1 archivos
[ACTUALIZADO] specs/stories/STORY-001-a/story.md — [[PROJ-01-demo-project-intent]] → [[vision]] (1)
[ELIMINADO] specs/01-projects/ — vacío tras la migración
────────────────────────────────────────────────
creados: 7 · sobrescritos: 2 · preservados: 0 · movidos: 4 · actualizados: 3 · eliminados: 6
```

(las cifras son ilustrativas; las pruebas fijan las de la fixture).

## Flujos clave

### F-1 — Colapso completo (AC-1)

1. `planSpecsMigration`: un proyecto; todas las unidades listas; `vision`, `stakeholders`, `objectives` desde semillas; 5 requisitos;
   roadmap creado; niveles sin colisiones.
2. Aplicación en el orden de D-2; reescritura de wikilinks en épica, historia, story map y roadmap.
3. `01-projects/` eliminado; exit 0. La secuencia 3.9 regenera `docs/index.md`.
4. `check --root <docs>` → exit 0.

### F-2 — Plan y repetición (AC-2)

- `--dry-run` sobre la fixture: mismo plan con etiquetas en condicional; ningún archivo cambia (hash del árbol igual);
  `cambios pendientes: N > 0`.
- Tras F-1: el descubrimiento no encuentra niveles viejos; `--dry-run` → `cambios pendientes: 0`; real → última línea que empieza por
  `creados: 0 · sobrescritos: 0`; árbol sin cambios.

### F-3 — Rechazos (AC-3)

- Dos proyectos → bloqueo global (D-3), nada se escribe.
- `vision.md` con contenido propio → conflicto en `project-intent.md` (D-10); el resto de unidades se migra; `project-intent.md` y
  `01-projects/` se conservan; `vision.md` byte a byte igual; exit 1. Con `--force` → exit 0.
- Sección no reconocida en `project.md` → `project.md` completo queda; sus requisitos no se escriben; exit 1; `01-projects/` se conserva.

### F-4 — Reanudación y degradación (P7)

- Interrupción tras escribir destinos: la reejecución informa `[PRESERVADO]` para lo ya escrito y completa movimientos, wikilinks y
  borrados.
- Error al mover una entrada: `[NO MIGRADO]` con el código; el resto sigue; reejecutar mueve lo pendiente.
- Sin `node`: el skill no degrada inline (D-14).

## Decisiones de complejidad justificada

- **Relleno por sección (D-10) en lugar de reemplazo de documento completo.** Lo simple sería "semilla intacta o conflicto", pero en
  `stakeholders.md` y `objectives.md` la migración escribe una sola de tres secciones; con `--force`, el reemplazo completo borraría
  secciones que el usuario rellenó y que la migración no conoce. El relleno por sección es el mínimo que hace `--force` seguro.
- **Prueba de cobertura de §1.1–1.7 (D-6).** Ignorarlas pierde texto; copiarlas duplica la visión. Una comprobación por subcadena es
  determinista, barata y deja la decisión al usuario solo cuando hay diferencia real.
- **Siete etiquetas en lugar de cuatro (D-13).** Movimientos, reescrituras y borrados son operaciones distintas que el usuario debe ver
  y que AC-1 cuenta ("mismo número de archivos"); reutilizar `[CREADO]` falsearía el resumen.
- **Un solo módulo nuevo.** El conocimiento (nombres heredados, templates de origen, mapa) cambia junto; dividirlo en parser y
  orquestador crearía dos módulos acoplados por la misma tabla de clasificación.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Colapso completo | `S114-IT-001`: tras migrar la fixture existen `product/{vision,stakeholders,objectives,roadmap,story-map}.md`, `architecture/c4/context-diagram.puml`, un archivo por FR/NFR (3 + 2) con el ID en el nombre; no existe `specs/01-projects/`; exit 0 | AC-1 |
| 2 | Mismo número de archivos | `S114-IT-002`: conteo de archivos de `02-epics`/`03-stories` antes = de `epics`/`stories` después; contenido byte a byte igual salvo líneas de wikilink reescritas | AC-1, CNF-2 |
| 3 | `check` sano | `S114-IT-003`: `checkMemory` sobre el resultado → `ok: true` (0 `broken-wikilink`) | AC-1 |
| 4 | Literalidad | `S114-UT-*`: cada línea de contenido de las 6 secciones de la intención aparece en `vision.md`; requisito renderizado con `Descripción`, `Criterios de verificación` (NFR), `Atributos` | AC-1, CNF-2 |
| 5 | Dry-run sin escrituras | `S114-IT-004`: hash del árbol igual antes y después; última línea `cambios pendientes: N`, N > 0 | AC-2 |
| 6 | Idempotencia | `S114-IT-005`: segunda ejecución `--dry-run` → `cambios pendientes: 0`; real → última línea empieza por `creados: 0 · sobrescritos: 0`; hash igual | AC-2 |
| 7 | Multi-proyecto | `S114-IT-006`: `[NO MIGRADO] specs/01-projects/`, exit 1, hash igual | AC-3 |
| 8 | Visión con contenido propio | `S114-IT-007`: `[NO MIGRADO]` sobre `project-intent.md`, exit 1, `vision.md` intacto, `01-projects/` existe; con `--force` exit 0 | AC-3 |
| 9 | Sección no reconocida | `S114-IT-008`: `[NO MIGRADO] … › <sección>` por cada una, exit 1, `project.md` y `01-projects/` existen | AC-3 |
| 10 | Formato del informe | Cabecera `from: specs-3-levels`; regla; totales; `--from dod-monolithic` y `epic-template-v1` siguen pasando sus pruebas | CNF-1 |
| 11 | Renombrados en git | `S114-IT-009` (se salta sin git): repo temporal con `core.autocrlf=false`, commit, migrar, `git add -A`, `git status --porcelain` → una línea `R` por archivo de épica/historia | CNF-3 |
| 12 | Unitarias puras | `isEmptyBody`, `requirementSlug` (ejemplos de STORY-105 D-3), `rewriteWikilinks` (alias, ancla, fences, código en línea, embebidos), `fillDocument` (create, fill, unchanged, conflict, force) | AC-1, AC-3 |
| 13 | Suite completa | `npm test` → exit 0 | CNF-4 |
| 14 | Evals | `TC-023`, `TC-024` en `evals.json`; `npm run verify:eval-inventory` pasa | AC-2, AC-3 |

## Risks / Trade-offs

- [En repos reales, §3/§4/§11/§12 de `project.md` suelen tener contenido → `project.md` queda `[NO MIGRADO]` en la primera ejecución]
  → Es el comportamiento pedido (la migración no decide); cada línea dice qué sección mover. CR-001 y CR-002.
- [Claves de frontmatter (`parent: PROJ-01-…`, `related:`) siguen nombrando slugs viejos] → Non-Goal; `check` no las evalúa.
- [`docs/index.md` queda desactualizado si la migración termina con exit 1] → La secuencia 3.9 lo regenera solo con exit 0 y lo indica.
- [El layout de `roadmap.md` depende de STORY-111/115] → Sin semilla, la migración usa el esqueleto mínimo de STORY-111 D-2; con
  semilla, rellena por sección.
- [Movimientos en Windows con archivos abiertos] → Error por entrada, reanudable (D-11).
- [Mayor superficie de `[NO MIGRADO]` por la prueba de cobertura de §1.x] → Preferible a perder texto; el mensaje cita la primera línea
  distinta.

## Open Questions

Ninguna. Las ambigüedades de la historia se resolvieron en las decisiones y quedan registradas como CR.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: ambigüedad
- **Descripción**: AC-1 espera el colapso completo de un `project.md` "generado con los templates de SDDF", pero la nota "Dependencia de
  decisión" marca `[NO MIGRADO]` las secciones del template sin destino (UI/UX, stack, referencias, glosario), lo que impide eliminar
  `01-projects/`. Además, las §1.1–1.7 de `project.md` repiten la intención y pueden diferir de ella.
- **Documento afectado**: story.md
- **Acción requerida**: precisar el "Dado" de AC-1: "cuyas secciones sin destino en ADR-0013 están vacías y cuyas §1.1–1.7 repiten
  `project-intent.md`". El diseño aplica la regla de vacío (D-5) y la de cobertura (D-6).

### CR-002
- **Tipo**: dependencia
- **Descripción**: la nota de la historia espera la historia pendiente "Reubicar las secciones restantes de `project.md`", pero
  STORY-110 D-2 ya decidió el destino de esas secciones para los escritores (UX → NFR/FR, stack → NFR, referencias → `Fuente`,
  wireframes y glosario no se producen). Esa transformación exige síntesis y descarta contenido, así que la migración determinista no la
  aplica.
- **Documento afectado**: story.md
- **Acción requerida**: actualizar la nota para citar STORY-110 D-2 y dejar explícito que `migrate` las marca `[NO MIGRADO]`; si se
  quiere automatizar, nueva historia.

### CR-003
- **Tipo**: dependencia
- **Descripción**: AC-1 ("un archivo por FR y NFR") contradice el `README.md` de `requirements/` ("SRS único" por defecto, STORY-118).
- **Documento afectado**: story.md
- **Acción requerida**: el diseño sigue AC-1 y STORY-110 D-3 (siempre fragmentado) y avisa si existe un SRS (D-7). Al cerrar STORY-118,
  revisar si la migración debe respetar el umbral.

### CR-004
- **Tipo**: ambigüedad
- **Descripción**: CNF-2 ("ningún archivo de `02-epics/` ni `03-stories/` se modifica en su contenido al moverse") y el Non-Goal ("solo
  se ajustan los wikilinks cuyo slug cambia") se leen en conflicto: el ajuste toca épicas e historias.
- **Documento afectado**: story.md
- **Acción requerida**: el diseño mueve sin cambios y después reescribe solo los wikilinks del mapa de D-12, informados con
  `[ACTUALIZADO]`. Precisar CNF-2: "… al moverse; después solo cambian los wikilinks cuyo slug cambia".

### CR-005
- **Tipo**: dependencia
- **Descripción**: el criterio de salida de EPIC-21 "Ningún skill ni agente referencia `specs/01-projects/`, `specs/02-epics/` ni
  `specs/03-stories/`" (y el grep de AC-2 de STORY-108) no admite la lógica de migración, que necesita los nombres viejos.
- **Documento afectado**: epic.md (EPIC-21)
- **Acción requerida**: añadir la excepción "salvo la lógica de migración de `memory-system` (`LEGACY_LEVELS` en
  `scripts/specs-3-levels.js`, su fixture, sus pruebas y la documentación del modo)". Lo verifica STORY-117.

### CR-006
- **Tipo**: ambigüedad
- **Descripción**: CNF-1 pide "una línea por archivo" con cuatro etiquetas, y AC-2 que la última línea "dice" `creados: 0 · sobrescritos:
  0`. El diseño informa una línea por nivel movido (con conteos), añade etiquetas para mover, actualizar y eliminar, y su línea de
  totales empieza por `creados: C · sobrescritos: S` y sigue con los demás contadores.
- **Documento afectado**: story.md
- **Acción requerida**: aceptar la interpretación (D-11, D-13) o precisar CNF-1/AC-2 ("la última línea empieza con …", como STORY-115 AC-3).
