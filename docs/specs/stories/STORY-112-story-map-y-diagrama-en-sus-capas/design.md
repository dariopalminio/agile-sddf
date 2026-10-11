---
alwaysApply: false
type: design
id: STORY-112
slug: STORY-112-story-map-y-diagrama-en-sus-capas-design
title: "Design: project-story-mapping y project-context-diagram escriben en product/ y architecture/c4/"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-21-colapsar-specs-dos-niveles
story: STORY-112
created: 2026-10-08
updated: 2026-10-08
related:
  - STORY-112-story-map-y-diagrama-en-sus-capas
  - eliminar-specs-01-projects
  - STORY-107-migrar-story-map-y-diagrama-contexto
  - STORY-110-discovery-escribe-stakeholders-y-requisitos
  - STORY-111-planning-escribe-roadmap
---

<!-- Referencias -->
[[STORY-112-story-map-y-diagrama-en-sus-capas]] · [[eliminar-specs-01-projects]] · [[STORY-107-migrar-story-map-y-diagrama-contexto]] · [[STORY-110-discovery-escribe-stakeholders-y-requisitos]] · [[STORY-111-planning-escribe-roadmap]]

# Diseño técnico: `project-story-mapping` y `project-context-diagram` escriben en `product/` y `architecture/c4/`

## Context

[[eliminar-specs-01-projects]] (ADR-0013) elimina `specs/01-projects/`. STORY-107 fija los destinos de los dos artefactos que ADR-0013
dejó sin hogar: `docs/product/story-map.md` y `docs/architecture/c4/context-diagram.puml` (Interfaces de STORY-107: "contrato para
STORY-112"). Esta historia cambia a sus **escritores**: `/project-story-mapping` (+ agente `project-story-mapper`) y
`/project-context-diagram`.

Estado actual (medido el 2026-10-08):

| Pieza | Estado |
|---|---|
| `skills/project-story-mapping/SKILL.md` | Paso 0b resuelve `PROJ_DIR` buscando `project-intent.md` con `substatus: DONE` en `specs/01-projects/`; Paso 1 lee `project-intent.md` y `project.md`; Paso 2 delega en `project-story-mapper` pidiéndole escribir `01-projects/$PROJ_DIR/story-map.md`; Paso 3 antepone frontmatter `type: spec`, `slug` derivado del directorio del proyecto, `date`, `status: BACKLOG`, `related` a `project.md`/`project-plan.md`. Sin evals; exento en `config/eval-exemptions.json`. |
| `agents/project-story-mapper.agent.md` | Rutas **fijas** distintas de las del skill: lee `$SPECS_BASE/specs/01-projects/project-intent.md` y `project.md` (sin `PROJ_DIR`) y escribe `$SPECS_BASE/specs/01-projects/story-map.md` ("Crea el directorio si no existe"; "se sobreescribe si ya existe"). La `description` cita `project-intent.md`, `requirement-spec.md` y `docs/specs/01-projects/story-map.md`. Estructura del documento: `# Story Map — …`, `## Contexto del Proyecto`, `## Personas`, `## Mapa de Historias (ASCII)`, `## Backbone — Actividades del Usuario`, `## Walking Skeleton`, `## User Tasks por Actividad`, `## Slices de Épicas`, `## Notas y Decisiones`. |
| `skills/project-context-diagram/SKILL.md` | Destino `01-projects/<PROJ-slug>/context-diagram.puml`. `--from-files` lee `01-projects/*/project.md` (nombre, actores "Como un…", sistemas externos), luego `README.md`, manifiestos e imports. Paso 6.1 pide **elegir el proyecto** en modo interactivo y emite `❌ El proyecto <PROJ-slug> no existe …`. El fallback de ruta inexistente lista los proyectos de `01-projects/`. Paso 6.2 ya pregunta antes de sobrescribir. El modo automático omite el preview. Sin evals; exento. |
| `skills/project-context-diagram/examples/test-0{1,2,3}-*.md` | Los tres mencionan `01-projects` y `PROJ-` (invocaciones y rutas de salida). |
| `skills/project-context-diagram/assets/c4-context-template.puml` | Sin rutas del modelo de proyectos; no cambia. |
| `docs/architecture/README.md` | "fuente PlantUML en `c4/` junto a su render (`.png`); el `.puml` es la fuente de verdad. Nivel de nombre: `context-diagram` (L1)". |
| `docs/architecture/c4/` | `context-diagram.puml` + `context-diagram.png` vigentes (sin frontmatter; 22 líneas). |
| `docs/product/` | `vision.md`, `stakeholders.md`, `objectives.md` como semillas (`substatus: TODO`, marcadores `[Por completar: …]`). `story-map.md` llega con STORY-107 (aún no implementada: el mapa sigue en `01-projects/PROJ-01-agile-sddf/`). |
| Forma de las capas de entrada | `vision.md`: estructura de STORY-104/109 (`## Problema que resolvemos`, `### Visión (elevator pitch)` con `**Nuestro producto:**` y `**Que provee:**`, …). `stakeholders.md`: `## Usuarios y roles` con perfiles `- **US-NNN**: <perfil>` / `    - **Descripción**: …` (STORY-105 D-5, STORY-110 D-8). Requisitos: `requirements/functional/FR-NNN-*.md`, `non-functional/NFR-NNN-*.md` con `## Descripción` y `## Atributos` (`**Usuario**`, `**Fuente**`, `**Categoría**`; el stack es un NFR de categoría `Tecnología`, STORY-110 D-2) o encabezados `### FR-NNN` en `requirements/srs-*.md` (STORY-118). |
| Consumidores | `/project-planning` (STORY-111 D-5) compone `/project-story-mapping` inline y espera `$SPECS_BASE/product/story-map.md`; si no aparece emite un aviso (CR-002 de STORY-111, que esta historia resuelve). `/project-flow` (STORY-113) queda fuera. |

Stack aplicable (constitución + `package.json`): solo Markdown (skills, agente, ejemplos), JSON (evals, exenciones) y PlantUML.
`scripts/verify-eval-inventory.js` rechaza un skill con `evals/evals.json` que siga exento. No hay `skills.plan` en
`sddf.config.yaml`: no aplican skills complementarios.

## Goals / Non-Goals

**Goals:**

- `/project-story-mapping` toma su contexto de `product/` y `requirements/`, y al completar la sesión escribe
  `$SPECS_BASE/product/story-map.md` con personas, backbone, walking skeleton y release slices; nunca crea `specs/01-projects/`.
  // satisface: AC-1
- `/project-context-diagram --from-files` construye actores y sistemas externos desde `product/stakeholders.md`, `product/vision.md`
  y `requirements/`, y escribe `$SPECS_BASE/architecture/c4/context-diagram.puml` sin pedir un proyecto. // satisface: AC-2, CNF-2
- Si el diagrama ya existe, cualquier modo pide confirmación antes de sobrescribirlo; sin confirmación, `.puml` y `.png` quedan
  intactos. // satisface: AC-3
- Los dos skills (incluidos ejemplos y README) y el agente quedan sin `01-projects`, `project-intent.md`, `project.md` ni `PROJ-`;
  ambos skills tienen evals que pasan con `npm run test:eval`. // satisface: CNF-1
- Todo lo escrito (`story-map.md`, `.puml`) queda en UTF-8 sin BOM. // satisface: CNF-3

**Non-Goals:**

- Generar o regenerar `context-diagram.png` (Non-Goal de la historia).
- Que `project-planning` lea `product/story-map.md` (STORY-111) o cambiar `project-flow` (STORY-113).
- Mover el `story-map.md` y el `.puml` existentes de este repositorio (STORY-107).
- Reescribir la documentación canónica y las guías que nombran las rutas antiguas (STORY-116).
- Cambiar la semántica C4 del diagrama, el template PlantUML o el método de mapeo de Jeff Patton del agente.

## Decisions

### D-1 — Rutas de salida fijas por capa, sin resolución de proyecto // satisface: AC-1, AC-2, CNF-1, CNF-2

| Skill | Ruta de salida | Directorio que crea si falta |
|---|---|---|
| `project-story-mapping` | `$STORY_MAP_PATH = $SPECS_BASE/product/story-map.md` | `$SPECS_BASE/product/` |
| `project-context-diagram` | `$DIAGRAM_PATH = $SPECS_BASE/architecture/c4/context-diagram.puml` | `$SPECS_BASE/architecture/c4/` |

- Se eliminan: el Paso 0b (`PROJ_DIR`) de `project-story-mapping`; el Paso 6.1 ("¿En qué proyecto deseas guardar el diagrama?") y el
  error `El proyecto <PROJ-slug> no existe` de `project-context-diagram`; la precondición "debe existir al menos un proyecto en
  `01-projects/`".
- La ruta deriva de `SPECS_BASE` (Paso 0), nunca se escribe literal `docs/…`, para respetar `SDDF_ROOT`.
- Nombre y carpeta del `.puml` siguen la convención de `docs/architecture/README.md` (`c4/`, `context-diagram` para L1). No se crea
  ningún `.puml` fuera de `c4/`.

**Alternativas rechazadas:**

- *Ruta configurable en `sddf.config.yaml`:* ningún consumidor la necesita hoy y `project-planning` (STORY-111) depende de una ruta
  fija; un parámetro más es complejidad especulativa (P12).
- *Seguir permitiendo elegir destino (un diagrama por producto/área):* ADR-0013 deja una sola capa de arquitectura por repositorio; el
  nivel L1 describe un único sistema en foco.

### D-2 — Entradas de `project-story-mapping` y regla de "contenido" // satisface: AC-1, CNF-1

El skill arma `$INPUT_PATHS` (lista de rutas existentes y con contenido) y `$REQUIREMENTS_INVENTORY` antes de delegar:

| Insumo | Ruta | Uso |
|---|---|---|
| Visión | `$SPECS_BASE/product/vision.md` | problema, propuesta de valor, alcance → contexto del mapa |
| Stakeholders | `$SPECS_BASE/product/stakeholders.md` | perfiles `- **US-NNN**:` de `## Usuarios y roles` → personas |
| Objetivos | `$SPECS_BASE/product/objectives.md` | opcional; objetivo de negocio |
| Requisitos funcionales | `$SPECS_BASE/requirements/functional/FR-*.md` + encabezados `### FR-NNN` de `$SPECS_BASE/requirements/srs-*.md` | `$REQUIREMENTS_INVENTORY` (líneas `FR-NNN — título — ruta`) → actividades y user tasks |
| Story map existente | `$STORY_MAP_PATH` | solo si el usuario eligió sobrescribir (D-4): punto de partida de la sesión |

- **Regla de contenido:** un documento de `product/` cuenta como contexto si existe y su `substatus` ≠ `TODO` (las semillas de
  `memory-system` tienen `TODO`; `project-begin` y `project-discovery` lo cambian al escribir, STORY-109 D-3 y STORY-110 D-5). Uno
  ausente o en `TODO` se omite con `⚠️ <ruta> sin contenido (semilla o ausente); se omite como contexto.`
- **Sin precondición bloqueante** (regla vigente "Contexto opcional"): si `$INPUT_PATHS` y el inventario quedan vacíos, se delega igual
  y el agente aplica su Paso 1 (contexto interactivo).
- El inventario de FR es el mismo de STORY-110 D-4 / STORY-111 D-4 (archivos fragmentados + SRS único). NFR no se usan: no aportan
  actividades de usuario.

**Alternativas rechazadas:**

- *Exigir `vision.md` en `DONE` y ≥ 1 FR (precondición dura):* la historia no lo pide y el skill hoy funciona sin documentos; bloquear
  rompería el uso temprano del mapa (antes de discovery).
- *Detectar semillas buscando `[Por completar`:* depende del texto del marcador; el `substatus` es el contrato de estado de la capa.
- *Seguir leyendo `project-intent.md`/`project.md` como respaldo:* CNF-1 lo prohíbe.

### D-3 — Sesión en staging y materialización por el skill // satisface: AC-1, CNF-1, CNF-3

El agente deja de escribir en `$SPECS_BASE`. Escribe solo el cuerpo del mapa en `$STAGING_PATH = .tmp/project-story-mapping/story-map.md`
(canal `.tmp/<skill-name>/` de AGENTS.md; mismo patrón que STORY-110 D-5 y STORY-111 D-6).

| Paso | Responsable | Acción |
|---|---|---|
| 1 | skill | Paso 0 (raíz); `$STORY_MAP_PATH`; verificación de existencia (D-4); vacía `.tmp/project-story-mapping/`. |
| 2 | skill | Insumos (D-2). |
| 3 | `project-story-mapper` | Sesión interactiva; escribe `$STAGING_PATH` (D-5). |
| 4 | skill | **Valida** el staging: existe; empieza con una línea `# `; contiene los encabezados `## Personas`, `## Backbone`, `## Walking Skeleton` y `## Release slices` (comparación por prefijo); sin frontmatter. Ausente → `⚠️ La sesión terminó sin story map: no se modificó $SPECS_BASE/product/story-map.md.` → fin. Incompleto → `❌ El story map generado no contiene <sección>; no se escribió $SPECS_BASE/product/story-map.md.` → fin (el staging queda para inspección). |
| 5 | skill | Escribe `$STORY_MAP_PATH`: frontmatter (D-6) + `<!-- Referencias -->` con los wikilinks de los documentos leídos (`[[vision]] · [[stakeholders]] …`, omitido si no hubo ninguno) + cuerpo del staging + pie `Volver al mapa: [[index]].` (si el cuerpo no lo trae). UTF-8 sin BOM. |
| 6 | skill | `✅ Story map escrito en $SPECS_BASE/product/story-map.md (<n> personas · <a> actividades · <s> release slices). Siguiente paso sugerido: /project-planning` |

**Alternativas rechazadas:**

- *Que el agente escriba directamente en `$STORY_MAP_PATH` (patrón actual) y el skill anteponga el frontmatter después:* deja un
  estado intermedio sin frontmatter en `product/`, el skill no puede validar antes de escribir y la ruta queda en manos del agente (la
  divergencia skill/agente actual es justamente un fallo de ese diseño).
- *Gate `Confirmar`/`Cancelar` adicional tras la sesión:* la sesión del agente ya es colaborativa y confirmada por el usuario paso a
  paso; un segundo gate solo repite la aprobación (P12).

### D-4 — Story map existente // satisface: AC-1

- Si `$STORY_MAP_PATH` existe, **antes** de delegar: `AskUserQuestion` "Ya existe `$SPECS_BASE/product/story-map.md`. ¿Rehacer el story
  map?" con `Sobrescribir` (el mapa existente se pasa al agente como insumo) / `Cancelar` (por defecto, también sin respuesta) →
  `Story mapping cancelado: no se modificó $SPECS_BASE/product/story-map.md.` → fin.
- Al sobrescribir se conserva `created` del archivo existente (o su `date`, forma del mapa migrado por STORY-107).

**Alternativas rechazadas:**

- *Sobrescribir sin preguntar (regla actual del agente):* el mapa de `product/` es un documento curado de vida larga (el de este
  repositorio está `COMPLETED`); perderlo por una invocación accidental contradice P7.
- *Preguntar al final de la sesión:* el usuario invertiría la sesión completa antes de saber que pisará un documento existente.

### D-5 — Contrato del agente `project-story-mapper` // satisface: AC-1, CNF-1, CNF-3

| Variable inyectada | Contenido |
|---|---|
| `$INPUT_PATHS` | Rutas de D-2 con contenido (puede estar vacía). |
| `$REQUIREMENTS_INVENTORY` | `FR-NNN — título — ruta` (puede estar vacío). |
| `$STAGING_PATH` | `.tmp/project-story-mapping/story-map.md`. |

Cambios en `agents/project-story-mapper.agent.md`:

| Sección | Cambio |
|---|---|
| `description` (frontmatter) | "…usando el contexto del producto (`product/` y `requirements/`) para producir el story map con backbone, walking skeleton y release slices." Sin rutas `01-projects`, `project-intent.md`, `requirement-spec.md`. |
| Intro | "…producir un story map completo y accionable en `$STAGING_PATH`." |
| Paso 0 — Carga de contexto | Lee las rutas de `$INPUT_PATHS` y los requisitos del inventario. Personas: primero los perfiles `US-NNN` de stakeholders (máximo 3, confirmados con el usuario); actividades y tareas: a partir de los FR. Si ambos están vacíos → Paso 1. |
| Paso 6 | El título pasa a "Trazar los release slices"; se conserva la nota "cada slice se materializa como una épica". |
| Paso 7 | Escribe `$STAGING_PATH` (crea `.tmp/project-story-mapping/` si falta), **sin frontmatter**, UTF-8 sin BOM. Estructura: `# Story Map — [Nombre del producto]`, `## Contexto del producto`, `## Personas`, `## Mapa de Historias (ASCII)`, `## Backbone — Actividades del Usuario`, `## Walking Skeleton`, `## User Tasks por Actividad`, `## Release slices (épicas)` (antes `## Slices de Épicas`; misma tabla `Épica │ Objetivo │ Historias incluidas`), `## Notas y Decisiones`. |
| Criterios de calidad | Se reemplaza "El documento `story-map.md` se sobreescribe si ya existe" por "Escribe solo `$STAGING_PATH`; nunca escribe en la memoria del proyecto (la decisión de sobrescribir es del skill)". "Siempre lee los documentos del proyecto" → "los documentos de `$INPUT_PATHS`". |

El método (principios, backbone 5–10 actividades, walking skeleton mínimo, ASCII de Patton) no cambia.

**Alternativas rechazadas:**

- *Rutas fijas `$SPECS_BASE/product/…` dentro del agente:* duplicaría la resolución del skill y repetiría la divergencia actual entre
  ambos; con variables inyectadas el agente no conoce capas (STORY-110 D-9).
- *Mantener `## Slices de Épicas`:* AC-1 y el mapa existente del repositorio (`## Release Slices`) usan "release slices"; el sufijo
  `(épicas)` conserva la equivalencia SDDF que el agente ya documenta.

### D-6 — Frontmatter de `product/story-map.md` // satisface: AC-1, CNF-1

| Clave | Valor |
|---|---|
| `type` | `product` (tipo de la capa; igual que el mapa migrado por STORY-107 D-1) |
| `slug` | `story-map` (slug único; `[[story-map]]` resuelve aquí) |
| `title` | texto del primer `#` del cuerpo |
| `status` | `IN-PROGRESS` (valor de las semillas de `product/`) |
| `substatus` | `DONE` (el skill solo escribe un mapa validado y completo, D-3 paso 4) |
| `parent` | `null` |
| `created` | conservado (D-4) o fecha actual |
| `updated` | fecha actual |
| `related` | slugs de los documentos de `product/` leídos (`vision`, `stakeholders`, `objectives`); se omite si no hubo ninguno |

Desaparecen `type: spec`, `date`, `status: BACKLOG` y el `slug` derivado del directorio del proyecto.

**Alternativa rechazada:** *conservar `type: spec`:* `product/` no contiene work items (ADR-0013); `memory-system check` exige `id` a
los tipos de spec.

### D-7 — Fuentes de `project-context-diagram --from-files` // satisface: AC-2, CNF-1

Regla de contenido de D-2 (`substatus` ≠ `TODO`) para `vision.md` y `stakeholders.md`. Orden de lectura y qué aporta cada fuente:

| # | Fuente | Elemento C4 que aporta |
|---|---|---|
| 1 | `$SPECS_BASE/product/vision.md` | `System()`: nombre = valor de `**Nuestro producto:**` del elevator pitch; descripción = `**Que provee:**` (o la primera frase de `## Problema que resolvemos`). |
| 2 | `$SPECS_BASE/product/stakeholders.md › ## Usuarios y roles` | un `Person()` por perfil `- **US-NNN**: <perfil>`, descripción = su `**Descripción**`. `## Patrocinadores y decisores` no genera `Person()` (no interactúan con el sistema). |
| 3 | `$SPECS_BASE/requirements/` (`functional/FR-*.md`, `non-functional/NFR-*.md`, `srs-*.md`) | `System_Ext()`: cada sistema, servicio o API externo nombrado en `## Descripción` o con `**Categoría**` de integración; protocolo desde el NFR de categoría `Tecnología` o el texto del requisito. `Rel(persona, sistema, …)`: etiqueta a partir de los FR cuyo `**Usuario**` cita el `US-NNN`. |
| 4 | `README.md`, `package.json` / `pyproject.toml` / `*.csproj`, imports y código fuente | Complemento (pasos 2–5 vigentes): nombre del sistema si 1 no lo dio, hints de protocolo, servicios conocidos en imports. |

- Deduplicación por nombre normalizado (minúsculas, sin acentos); ante conflicto prevalece la fuente de menor número.
- Ruta explícita (Modo C) existente: se usa ese documento como fuente principal y se completa con la tabla.
- **Degradación (P7):** si tras el escaneo falta el nombre del sistema o no hay ningún `Person()` →
  `⚠️ No se encontraron <elementos> en product/ ni requirements/.` y se ofrece completar lo faltante en modo interactivo; en modo
  automático (sin usuario) → `❌ No hay contexto suficiente para el diagrama; ejecuta /project-discovery o usa --interactive.` → fin sin
  escribir.

**Alternativas rechazadas:**

- *Incluir patrocinadores como `Person()`:* en C4 L1 una persona es quien usa el sistema; aprobadores sin interacción ensucian el
  diagrama.
- *Leer solo `README.md` y código (sin capas):* ignora la fuente de verdad de actores (`stakeholders.md`) que ADR-0013 establece.
- *Exigir `stakeholders.md` en `DONE` como precondición:* el modo `--from-files` también sirve a proyectos con código y sin discovery;
  la degradación cubre el caso.

### D-8 — Fallback de ruta inexistente sin listado de proyectos // satisface: AC-2, CNF-1

`❌ No se encontró el archivo indicado: <ruta>` y se ofrece: **A)** continuar en `--from-files` con las capas (`product/` +
`requirements/`), **B)** continuar en `--interactive`. Sin respuesta → A. Se elimina el listado de `01-projects/`.

**Alternativa rechazada:** *detener con error:* el usuario ya expresó la intención de generar el diagrama; ofrecer las dos vías
vigentes es el comportamiento actual sin la dependencia de proyectos.

### D-9 — Sobrescritura del diagrama en cualquier modo // satisface: AC-3, CNF-3

- Paso 6 (nuevo): si `$DIAGRAM_PATH` existe → `⚠️ Ya existe $SPECS_BASE/architecture/c4/context-diagram.puml. ¿Deseas sobrescribirlo?
  (Sí / No)`. La pregunta se hace en **todos** los modos (`--interactive`, `--from-files`, ruta explícita y automático): el modo
  automático solo omite el preview (Paso 5), nunca esta confirmación. Sin respuesta → **No**.
- **No** → `Sin cambios: se conservan context-diagram.puml y context-diagram.png.` → fin sin escritura alguna.
- **Sí** → escribe el `.puml` (UTF-8 sin BOM). Si existe `context-diagram.png` en `c4/` → `⚠️ context-diagram.png no se regeneró:
  renderízalo desde el .puml para que coincidan.`
- El skill **nunca** escribe, mueve ni borra `context-diagram.png` (Restricciones).
- La pregunta va después del preview (orden actual): el usuario decide sobrescribir viendo el diagrama nuevo.

**Alternativas rechazadas:**

- *Sobrescribir sin preguntar en modo automático:* AC-3 dice "en cualquier modo".
- *Preguntar antes de la entrevista:* el usuario decidiría sin ver el resultado; ya hay preview para eso.
- *Respaldar el `.puml` previo (`context-diagram.puml.bak`):* el repositorio versionado ya es el respaldo; un archivo extra en `c4/`
  rompe la convención de la capa.

### D-10 — Evals de ambos skills // satisface: CNF-1, AC-1, AC-2, AC-3

Se crean `skills/project-story-mapping/evals/evals.json` y `skills/project-context-diagram/evals/evals.json` (formato
`skill`/`version`/`description`/`cases`, `TC-NNN`, `expected.contains`/`not_contains`, `threshold`) y se retiran sus dos entradas de
`config/eval-exemptions.json`. Los contextos describen el entorno, el resultado de la sesión del agente y la respuesta del usuario a
cada pausa (el runner ejecuta en seco y sin respuesta interactiva).

| Skill | Caso | Escenario | Aserciones clave |
|---|---|---|---|
| story-mapping | TC-001 | `vision.md` y `stakeholders.md` en `DONE` (2 perfiles), FR-001…FR-004, sin story map; el agente deja un staging completo | contiene `product/story-map.md`, `Personas`, `Backbone`, `Walking Skeleton`, `Release slices`, `/project-planning`; no contiene `01-projects`, `PROJ-`, `project.md`, `project-intent.md` |
| story-mapping | TC-002 | semillas en `TODO`, sin requisitos | contiene `⚠️`, `sin contenido`, `product/story-map.md`; no contiene `01-projects` |
| story-mapping | TC-003 | requisitos en `requirements/srs-mi-app.md` (`### FR-001`, `### FR-002`) | contiene `FR-001`, `srs-mi-app.md`; no contiene `01-projects` |
| story-mapping | TC-004 | `product/story-map.md` existe; usuario `Cancelar` | contiene `no se modificó`; no contiene `✅ Story map escrito` |
| story-mapping | TC-005 | `product/story-map.md` existe; usuario `Sobrescribir` | contiene `Sobrescribir`, `created`, `✅ Story map escrito` |
| story-mapping | TC-006 | el agente devuelve un staging sin `## Walking Skeleton` | contiene `❌`, `Walking Skeleton`, `no se escribió` |
| context-diagram | TC-001 | `--from-files`; `stakeholders.md` con US-001 y US-002, FR que integra "Stripe", NFR `Tecnología`; sin diagrama | contiene `architecture/c4/context-diagram.puml`, `Person(`, `System_Ext(`, `Stripe`; no contiene `01-projects`, `PROJ-`, `project.md`, `En qué proyecto` |
| context-diagram | TC-002 | `--interactive`, respuestas dadas en el contexto, sin diagrama | contiene `architecture/c4/context-diagram.puml`; no contiene `PROJ-`, `En qué proyecto` |
| context-diagram | TC-003 | diagrama y `.png` existentes; usuario `No` | contiene `Ya existe`, `Sin cambios`, `context-diagram.png`; no contiene `✅ Diagrama de contexto C4 generado` |
| context-diagram | TC-004 | diagrama y `.png` existentes; usuario `Sí` | contiene `sobrescrib`, `no se regeneró` |
| context-diagram | TC-005 | invocado por otro skill (automático), diagrama existente, sin respuesta | contiene `Ya existe`, `Sin cambios`; no contiene `✅ Diagrama` |
| context-diagram | TC-006 | ruta explícita inexistente | contiene `No se encontró`, `--from-files`, `--interactive`; no contiene `01-projects`, `PROJ-` |
| context-diagram | TC-007 | `--from-files`, automático, semillas en `TODO`, sin requisitos ni README | contiene `❌`, `/project-discovery`; no contiene `✅ Diagrama` |

**Alternativas rechazadas:** mantener las exenciones (CNF-1 exige evals que pasen) y fixtures de PlantUML con render (el render está
fuera de alcance; los casos de flujo verifican rutas y decisiones).

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Skill `project-story-mapping` | modificar (D-1…D-4, D-6) | `skills/project-story-mapping/SKILL.md` | AC-1, CNF-1, CNF-3 |
| README `project-story-mapping` | modificar (`Produces`, invocación) | `skills/project-story-mapping/README.md` | CNF-1 |
| Agente `project-story-mapper` | modificar (D-5) | `agents/project-story-mapper.agent.md` | AC-1, CNF-1, CNF-3 |
| Skill `project-context-diagram` | modificar (D-1, D-7…D-9) | `skills/project-context-diagram/SKILL.md` | AC-2, AC-3, CNF-1, CNF-2, CNF-3 |
| README `project-context-diagram` | modificar (`Produces`, "para el producto") | `skills/project-context-diagram/README.md` | CNF-1 |
| Ejemplos de `project-context-diagram` | reescribir (test-01: salida en `c4/`, sin elegir proyecto; test-02: `--from-files` desde capas; test-03: ruta inexistente → A/B) | `skills/project-context-diagram/examples/test-0{1,2,3}-*.md` | AC-2, CNF-1 |
| Template PlantUML | sin cambios | `skills/project-context-diagram/assets/c4-context-template.puml` | AC-2 |
| Evals | crear | `skills/project-story-mapping/evals/evals.json`, `skills/project-context-diagram/evals/evals.json` | CNF-1 |
| Exenciones de evals | modificar (quitar 2 entradas) | `config/eval-exemptions.json` | CNF-1 |
| CHANGELOG | modificar (`[Unreleased]` › `Changed`, BREAKING) | `CHANGELOG.md` | — (trazabilidad de release) |

Se reutilizan (P3): la regla de contenido por `substatus` de las capas, el inventario de FR de STORY-110 D-4, el canal
`.tmp/<skill-name>/` + materialización por el skill de STORY-110 D-5 / STORY-111 D-6, el slug y el tipo del mapa de STORY-107 D-1, el
template PlantUML y la semántica C4 vigentes.

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Salida del story map | `$SPECS_BASE/product/story-map.md`, `type: product`, `slug: story-map`; consumida por `/project-planning` (STORY-111 D-5) | AC-1 |
| Skill → `project-story-mapper` | `$INPUT_PATHS`, `$REQUIREMENTS_INVENTORY`, `$STAGING_PATH` | AC-1 |
| `project-story-mapper` → skill | `.tmp/project-story-mapping/story-map.md`: cuerpo sin frontmatter con `#` + `## Personas`, `## Backbone…`, `## Walking Skeleton`, `## Release slices…` | AC-1 |
| Sobrescritura del story map | `Sobrescribir` / `Cancelar` (por defecto) antes de delegar | AC-1 |
| Salida del diagrama | `$SPECS_BASE/architecture/c4/context-diagram.puml` (convención de `architecture/README.md`) | AC-2, CNF-2 |
| Fuentes de `--from-files` | `product/vision.md` → `System`; `product/stakeholders.md › Usuarios y roles` → `Person`; `requirements/` → `System_Ext` y `Rel`; README/código como complemento | AC-2 |
| Sobrescritura del diagrama | confirmación `Sí` / `No` (por defecto) en todo modo; `No` → ni `.puml` ni `.png` cambian; el `.png` nunca se escribe | AC-3 |

## Esquema de datos

Mapeo de un perfil de stakeholders a C4:

| Origen | Destino |
|---|---|
| `- **US-NNN**: <perfil>` | `Person(<id>, "<perfil>", "<Descripción>")`, `<id>` = perfil en minúsculas, sin acentos, `[^a-z0-9]+` → `_` |
| FR con `**Usuario**: US-NNN` | `Rel(<id>, sistema, "<acción resumida de los FR>", "<protocolo>")` |
| Sistema externo nombrado en un requisito | `System_Ext(<id>, "<nombre>", "<qué provee/consume>")` + `Rel(sistema, <id>, …)` o en sentido inverso según el requisito |

Frontmatter de `story-map.md`: tabla de D-6. El `.puml` no lleva frontmatter (forma vigente de `c4/context-diagram.puml`).

## Flujos clave

### F-1 — Story mapping sobre capas con contenido (AC-1)

1. `/project-story-mapping` → raíz → `$STORY_MAP_PATH` no existe → insumos (D-2): vision, stakeholders, inventario FR.
2. Delega en `project-story-mapper` con las tres variables → sesión interactiva → staging.
3. Valida el staging → escribe `product/story-map.md` (frontmatter D-6 + referencias + cuerpo + pie) → `✅ …`.
4. `specs/01-projects/` no se lee ni se crea.

### F-2 — Diagrama desde las capas (AC-2)

1. `/project-context-diagram --from-files` → template → fuentes D-7 → `System`, `Person`, `System_Ext`, `Rel`.
2. Preview y confirmación (manual) → `$DIAGRAM_PATH` no existe → crea `architecture/c4/` si falta y escribe el `.puml` → `✅ …` con la ruta
   y la sugerencia de renderizar.

### F-3 — Diagrama existente (AC-3)

1. Cualquier modo llega al Paso 6 con `$DIAGRAM_PATH` existente → pregunta de sobrescritura.
2. `No` (o sin respuesta) → `Sin cambios …` → fin; `Sí` → escribe `.puml` y avisa que el `.png` no se regeneró.

### F-4 — Degradación (P7)

- Sesión de story mapping abandonada → no hay staging → no se toca `product/` (D-3 paso 4).
- `--from-files` sin contexto suficiente → interactivo para lo faltante o, en automático, `❌` sin escribir (D-7).
- `product/` o `architecture/c4/` inexistentes → se crean al escribir (D-1).
- Repositorio sin STORY-107 aplicada: el mapa antiguo sigue en `01-projects/`; el skill no lo lee ni lo mueve (CR-002).

## Decisiones de complejidad justificada

- **Staging + validación para el story map** en vez de escritura directa: la escritura directa no garantiza que no se cree un archivo
  parcial ni centraliza la ruta; el patrón ya existe en STORY-110/111, así que no se introduce un mecanismo nuevo.
- **Regla de contenido por `substatus`:** una sola regla para cuatro documentos, usando el campo que las capas ya mantienen; evita
  heurísticas sobre marcadores.
- **Siete casos de eval en `project-context-diagram`:** cubren los tres AC, el modo automático (AC-3 "en cualquier modo") y las dos
  degradaciones; con menos casos AC-3 quedaría verificado solo en modo manual.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Sin rutas del modelo de proyectos | `grep -rnE --exclude-dir=evals "01-projects\|project-intent\.md\|project\.md\|PROJ-" skills/project-story-mapping skills/project-context-diagram agents/project-story-mapper.agent.md` → vacío | CNF-1 |
| 2 | Destino del story map | `skills/project-story-mapping/SKILL.md` contiene `$SPECS_BASE/product/story-map.md` y `.tmp/project-story-mapping/story-map.md`; el agente contiene `$STAGING_PATH` y `## Release slices (épicas)` y no contiene `$SPECS_BASE/specs` | AC-1 |
| 3 | Destino del diagrama | `skills/project-context-diagram/SKILL.md` contiene `$SPECS_BASE/architecture/c4/context-diagram.puml`; no contiene `En qué proyecto`; ninguna otra ruta de salida `.puml` | AC-2, CNF-2 |
| 4 | Fuentes de `--from-files` | El SKILL.md cita `product/vision.md`, `product/stakeholders.md` y `requirements/` en la tabla de fuentes | AC-2 |
| 5 | Sobrescritura en todo modo | El Paso 6 declara la pregunta para todos los modos, `No` por defecto y el mensaje `Sin cambios`; `context-diagram.png` solo aparece en avisos y en la restricción "nunca se escribe" | AC-3 |
| 6 | Evals y exenciones | Existen los dos `evals.json` (JSON válido, IDs `TC-NNN` únicos); `config/eval-exemptions.json` no contiene `project-story-mapping` ni `project-context-diagram`; `node scripts/verify-eval-inventory.js` → exit 0 | CNF-1 |
| 7 | Evals pasan | `npm run test:eval -- project-story-mapping` y `npm run test:eval -- project-context-diagram` → todos los casos pasan | CNF-1, AC-1, AC-2, AC-3 |
| 8 | Contratos del repositorio | `npm run test:installer`, `npm run test:eval:runner`, `node scripts/audit-root-resolution.js` (bloque `SDDF-ROOT-RESOLUTION: v1` intacto en ambos skills) → exit 0 | CNF-1 |
| 9 | Encoding | Los archivos tocados no empiezan con `EF BB BF`; `grep -lE "Ã\|ðŸ"` sobre ellos → vacío; ambos SKILL.md exigen UTF-8 sin BOM para `story-map.md` y el `.puml` | CNF-3 |

## Risks / Trade-offs

- [El modelo ignora la regla de "nunca escribir el `.png`" o la confirmación en modo automático] → TC-003/TC-005 de
  `project-context-diagram` lo detectan; la restricción queda en `## Restricciones / Reglas` y en el Paso 6.
- [Ejecutar `/project-story-mapping` en este repositorio antes de STORY-107 crea `product/story-map.md` mientras el antiguo sigue en
  `01-projects/`] → CR-002; la confirmación de D-4 no aplica porque el destino aún no existe.
- [Los requisitos no nombran explícitamente sistemas externos] → el complemento README/código (D-7 fila 4) y el modo interactivo
  cubren el hueco; el preview permite corregir antes de escribir.
- [Renombrar `## Slices de Épicas` a `## Release slices (épicas)`] → mapas antiguos con el encabezado anterior no se validan al pasarlos
  como insumo; la validación de D-3 aplica solo al staging nuevo, no al mapa existente.
- [El `.png` queda desfasado tras sobrescribir] → aviso explícito (D-9); el render es Non-Goal.

## Open Questions

Ninguna. Las ambigüedades se resolvieron en el diseño y quedan registradas como CR.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: ambigüedad
- **Descripción**: `story.md` enlaza `[[ADR-0013-eliminar-specs-01-projects]]` y lo declara en `related`, pero el slug real del ADR es
  `eliminar-specs-01-projects`; `memory-system check` lo reporta como `broken-wikilink` (ya registrado en STORY-107 CR-002).
- **Documento afectado**: story.md
- **Acción requerida**: corregir el wikilink y la entrada de `related` a `eliminar-specs-01-projects` (fuera del alcance de este
  diseño; no bloquea la implementación).
- **Resolución (2026-10-08)**: aplicada en `story.md` (`related` y bloque `<!-- Referencias -->`).

### CR-002
- **Tipo**: dependencia
- **Descripción**: STORY-107 (migración del mapa a `product/`) no está implementada. Si STORY-112 se implementa antes y alguien ejecuta
  `/project-story-mapping` en este repositorio, se crea `product/story-map.md` y STORY-107 F-3 ("si ya existe, no se sobrescribe")
  dejaría el mapa antiguo sin migrar.
- **Documento afectado**: story.md (notas) / tasks.md
- **Acción requerida**: implementar STORY-107 antes que STORY-112, o no ejecutar `/project-story-mapping` en este repositorio hasta
  que STORY-107 esté integrada. Este diseño no añade lógica de migración (Non-Goal).

### CR-003
- **Tipo**: ambigüedad
- **Descripción**: el contrato #1 exigía que el `grep` de CNF-1 sobre los dos skills y el agente devolviera vacío, pero D-10 coloca
  esas mismas cadenas en `skills/*/evals/evals.json` como aserciones `not_contains`, y T006 redactaba la restricción del skill con el
  literal `specs/01-projects/`. Implementado tal cual, T022 fallaba por diseño (INC-001 de analyze.md).
- **Documento afectado**: story.md (CNF-1) / design.md (contrato #1) / tasks.md (T001, T006, T022)
- **Resolución (2026-10-08)**: las aserciones `not_contains` verifican la ausencia de las rutas, no las referencian; el contrato #1 y
  T001/T022 usan `grep -rnE --exclude-dir=evals …`, CNF-1 lo explicita y T006 redacta la restricción sin el literal ("nunca se lee
  ni crea el nivel de proyectos retirado por ADR-0013").
