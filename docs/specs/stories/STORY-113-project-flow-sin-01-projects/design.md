---
alwaysApply: false
type: design
id: STORY-113
slug: STORY-113-project-flow-sin-01-projects-design
title: "Design: project-flow, sddf-init y header-aggregation sin specs/01-projects/"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-21-colapsar-specs-dos-niveles
story: STORY-113
created: 2026-10-08
updated: 2026-10-08
related:
  - STORY-113-project-flow-sin-01-projects
  - eliminar-specs-01-projects
  - STORY-109-project-begin-escribe-vision
  - STORY-110-discovery-escribe-stakeholders-y-requisitos
  - STORY-111-planning-escribe-roadmap
  - STORY-108-renombrar-specs-sin-prefijos
  - STORY-115-scaffold-dos-niveles-y-capas-destino
---

<!-- Referencias -->
[[STORY-113-project-flow-sin-01-projects]] · [[eliminar-specs-01-projects]] · [[STORY-109-project-begin-escribe-vision]] · [[STORY-110-discovery-escribe-stakeholders-y-requisitos]] · [[STORY-111-planning-escribe-roadmap]] · [[STORY-108-renombrar-specs-sin-prefijos]] · [[STORY-115-scaffold-dos-niveles-y-capas-destino]]

# Diseño técnico: `project-flow`, `sddf-init` y `header-aggregation` sin `specs/01-projects/`

## Context

[[eliminar-specs-01-projects]] (ADR-0013) reparte `01-projects/` en capas: la visión va a `product/vision.md` (STORY-109), los
stakeholders y requisitos a `product/stakeholders.md` + `requirements/` (STORY-110) y el plan de épicas a `product/roadmap.md`
(STORY-111). Esta historia cierra el bloque de skills: el **orquestador** del pipeline de proyecto, el **bootstrap** y el
**normalizador de frontmatter**.

Estado actual (medido el 2026-10-08):

| Pieza | Estado |
|---|---|
| `skills/project-flow/SKILL.md` | 27 referencias a `01-projects`. El Paso 0 detecta la etapa por el `substatus` de `project-intent.md`, `project.md` y `project-plan.md` (y nombra un `requirement-spec.md` que no lee). Cada fase **reimplementa** su etapa: verifica WIP=1 sobre `01-projects/`, resuelve el template (`project-intent-template.md`, `project-template.md`, `project-plan-template.md`), invoca directamente a `project-pm` / `project-architect` con rutas fijas y edita el `substatus` a `DONE` tras su propio gate `Sí, continuar` / `No, necesito ajustes`. |
| `skills/project-flow/README.md` | `Produces`: `project-intent.md`, `project.md` y `project-plan.md` "en el proyecto activo". |
| `skills/project-flow/evals/` | No existe. `config/eval-exemptions.json` exime a `project-flow` ("matriz de evals para sus gates de revisión"). `scripts/verify-eval-inventory.js` rechaza un skill con `evals.json` que siga exento. |
| Etapas tras STORY-109…111 (diseñadas) | Cada skill de etapa ya tiene **su propio gate** y escribe su capa: `/project-begin` → `vision.md` y `substatus: DONE` tras `Confirmar` (STORY-109 D-5); `/project-discovery` → exige visión `DONE`, staging + `Confirmar` → `stakeholders.md` + un archivo por FR/NFR (STORY-110 D-1, D-6); `/project-planning` → exige ≥ 1 FR, staging + `Confirmar` → crea `roadmap.md` o le agrega una `## Propuesta (AAAA-MM-DD)` (STORY-111 D-4, D-6). Los tres renombran o eliminan los templates que `project-flow` sigue nombrando. |
| CR dirigidos a esta historia | STORY-109 CR-002 (template de Begin), STORY-110 CR-003 (template y salida de Discovery), STORY-111 CR-001 (template y salida de Planning): los tres piden que `project-flow` delegue la etapa en el skill correspondiente. |
| `skills/sddf-init/SKILL.md` | Paso 2 crea `specs/01-projects/` junto a `02-epics/`, `03-stories/` y `templates/`; los ejemplos del Paso 6 (lín. 193, 227, 243) lo muestran como `[CREADO]`. El nivel `full` compone `memory-system scaffold --yes`, cuya semilla todavía tiene `specs/01-projects/.gitkeep` (STORY-115). |
| `skills/sddf-init/README.md:66` y `evals/evals.json` TC-001 | El README lista `01-projects/` entre los directorios creados; TC-001 **exige** `docs/specs/01-projects` en la salida. |
| `skills/header-aggregation/SKILL.md` | Esquema canónico con `type: <project \| epic \| story \| wiki>`, `id`/`parent` con `PROJ-NN`; Paso 2 deriva `type` del prefijo de directorio (`PROJ-*` → `project`, resto → `wiki`) y `slug` del nombre del directorio; Paso 1 y Paso 4.1 buscan en `01-projects/` (lín. 76, 158, 167). Un archivo de `product/` o `requirements/` hoy recibe `type: wiki`, `slug: product` (nombre del directorio) y `alwaysApply`/`id`/`substatus`/`parent`. |
| Esquemas de las capas | `product/*.md` (semillas de `memory-system`): `type: product`, `slug: <archivo>`, `status`, `substatus`, `parent: null`, `created`, `updated`; sin `alwaysApply` ni `id`. `requirements/README.md` fija `type: requirement` (`kind`, `id: FR-NNN\|NFR-NNN`, `slug: <ID>-<slug>`, `status: active`, `related`, sin `substatus`/`parent`) para el archivo fragmentado y `type: srs` para el SRS único. Los `README.md` de capa son `type: wiki` con slug `<capa>-index`. |

Referencias residuales a `01-projects` en `skills/` y `agents/` **fuera** de las cinco historias del bloque (109–113):
`skills/skill-preflight/{SKILL.md,evals/evals.json}` (STORY-108 D-8) y `skills/memory-system/**` (semilla, `SPECS_LAYERS`,
`index-template.md`, `scaffold/constitution.md`, `scaffold/specs/README.md`, `memory-rules.md`: STORY-115; detección de la
estructura antigua: STORY-114). Ver CR-001.

Stack (constitución + `package.json`): Markdown para skills, agentes y fixtures; Node.js solo en el runner de evals y los
verificadores (`npm run test:eval`, `verify:eval-inventory`, `verify:links`). No hay `skills.plan` en `sddf.config.yaml`: no
aplican skills complementarios. Composición skill → skill inline permitida en cadenas cortas
(`docs/guides/best-practices-for-skills.md`); un subagente no ejecuta skills orquestadores (constitución §4).

## Goals / Non-Goals

**Goals:**

- `/project-flow` recorre Begin → Discovery → Planning sobre `vision.md`, `stakeholders.md`/`requirements/` y `roadmap.md`
  componiendo los skills de etapa, sin crear ni leer `specs/01-projects/`. // satisface: AC-1
- La etapa a retomar se decide por el estado de las capas (`substatus` de `vision.md`, presencia de FR, roadmap planificado). // satisface: AC-2
- `skills/project-flow/`, `skills/sddf-init/` y `skills/header-aggregation/` quedan sin `01-projects`, `PROJ-` ni `type: project`;
  `/sddf-init` no crea `specs/01-projects/`; `/header-aggregation` asigna `type` por capa en `product/` y `requirements/`. // satisface: AC-3
- La confirmación del usuario entre etapas se conserva. // satisface: CNF-1
- `project-flow` gana evals (y pierde su exención); los evals de `sddf-init` y `header-aggregation` se actualizan y pasan. // satisface: CNF-2

**Non-Goals:**

- Cambiar el comportamiento interno de `/project-begin`, `/project-discovery` o `/project-planning` (STORY-109…111), ni sus
  mensajes finales `Siguiente comando: …`.
- `memory-system scaffold`, su capa `specs-projects` y `migrate --from=specs-3-levels` (STORY-114, STORY-115).
- Renombrar `02-epics`/`03-stories` en `sddf-init`, `header-aggregation` y sus fixtures, y la Verificación 2 de `skill-preflight` (STORY-108).
- Registrar los templates nuevos en la tabla del Paso 2b de `sddf-init` (lo hacen STORY-109…111 como consumidores del renombrado).
- Añadir `/project-story-mapping` o `/project-context-diagram` como etapas de `project-flow` (hoy no lo son; `/project-planning`
  ya ofrece el story map, STORY-111 D-5).
- Documentación canónica que aún describe `project-flow` sobre `01-projects` o WIP de proyecto (STORY-116, CR-003).

## Decisions

### D-1 — `project-flow` compone los skills de etapa en lugar de reimplementarlos // satisface: AC-1, AC-3, CNF-1

Cada fase de `project-flow` pasa a ser una **composición inline** del skill de etapa: lee `$CLI_ROOT/skills/<skill>/SKILL.md` y
sigue sus instrucciones sin argumentos, en la misma sesión (mismo patrón que `sddf-init` usa con `memory-system`, Paso 5b).

| Etapa | Skill compuesto | Escribe (lo decide el skill de etapa) |
|---|---|---|
| Begin | `/project-begin` | `$SPECS_BASE/product/vision.md` |
| Discovery | `/project-discovery` | `$SPECS_BASE/product/stakeholders.md`, `$SPECS_BASE/requirements/{functional,non-functional}/` |
| Planning | `/project-planning` | `$SPECS_BASE/product/roadmap.md` |

`project-flow` deja de: verificar WIP=1 sobre `01-projects/`, resolver templates, invocar a `project-pm`/`project-architect` y
editar `substatus`. Las precondiciones (visión `DONE`, ≥ 1 FR), los templates, el staging y el gate de cada documento son del
skill de etapa. Con ello quedan resueltos STORY-109 CR-002, STORY-110 CR-003 y STORY-111 CR-001 sin tocar esas historias.

Si `$CLI_ROOT/skills/<skill>/SKILL.md` no existe: `❌ El skill <skill> no está instalado en $CLI_ROOT/skills/. Ejecuta npx agile-sddf install.`
y fin sin escribir (P7).

**Alternativas rechazadas:**

- *Actualizar las rutas y templates de cada fase dentro de `project-flow`:* triplica la lógica de STORY-109…111 (estados de
  `vision.md`, inventario de IDs, staging, materialización, gate de roadmap) en un segundo archivo que derivaría en la primera
  modificación; contradice la constitución §6 (el skill orquesta, no contiene la lógica de dominio).
- *Delegar cada etapa en un subagente que ejecute el skill:* las etapas son entrevistas con `AskUserQuestion` y lanzan agentes;
  un subagente no puede sostener la entrevista ni delegar en otro agente (constitución §4, AGENTS.md).
- *Invocar a los agentes con las rutas nuevas y dejar los gates en `project-flow`:* duplica el contrato agente ↔ skill que
  STORY-110/111 fijan con staging, y dos escritores de la misma capa romperían la garantía "nada se sobrescribe sin confirmación".

### D-2 — Detección de la etapa por el estado de las capas // satisface: AC-2, AC-1

Paso 1 de `project-flow` (único punto que lee las capas; no escribe nada). Se evalúa en orden y gana la **primera** etapa pendiente:

| # | Condición | Etapa |
|---|---|---|
| 1 | `$SPECS_BASE/product/vision.md` no existe, o su `substatus` ≠ `DONE` (incluido ausente) | Begin |
| 2 | `$FR_COUNT = 0` | Discovery |
| 3 | `$ROADMAP_PLANNED = false` | Planning |
| 4 | — | Pipeline completo (D-4) |

Definiciones (reutilizadas de STORY-110 D-4 y STORY-111 D-4 para que `project-flow` y las precondiciones de las etapas coincidan):

- `$FR_COUNT` = número de archivos `$SPECS_BASE/requirements/functional/FR-*.md` + encabezados `### FR-NNN` en
  `$SPECS_BASE/requirements/srs-*.md`. Directorio ausente = 0.
- `$ROADMAP_PLANNED` = `$SPECS_BASE/product/roadmap.md` existe **y** contiene al menos una sección `## Propuesta (` **o** su
  sección `## Épicas` contiene al menos una línea con un ID `EPIC-NN`.

La segunda cláusula cubre los dos roadmaps que existen sin propuesta: la semilla que sembrará STORY-115 (sin épicas → Planning
pendiente) y el roadmap migrado por STORY-106 en este repositorio (`## Épicas` con 22 épicas → planificado). Ver CR-002.

Antes de ejecutar, el skill informa el estado detectado:
`🚀 Pipeline de proyecto — estado: vision.md <substatus|ausente> · <n> FR · roadmap <planificado|sin planificar|ausente>` y
`Etapas a ejecutar: <lista desde la etapa detectada>`.

**Alternativas rechazadas:**

- *Solo existencia de `roadmap.md` (lectura literal de la tabla de AC-2):* un proyecto con el scaffold de STORY-115 nunca
  llegaría a Planning, y este repositorio tras STORY-106 se trataría igual que uno vacío si se cambiara la regla al revés.
- *`substatus` de `roadmap.md`:* ningún escritor lo mantiene (STORY-111 crea el archivo con el `substatus` del template y añade
  propuestas append-only); no describe si hay plan.
- *`substatus: DONE` de `stakeholders.md` como señal de Discovery:* AC-2 fija la señal en los FR, y `/project-planning` solo
  exige FR; dos señales distintas para la misma transición divergerían (p. ej. requisitos de `/reverse-engineering` sin
  stakeholders cerrados).

### D-3 — Gate entre etapas y retoma // satisface: CNF-1, AC-1, AC-2

Bucle del Paso 2, a partir de la etapa detectada:

1. Componer el skill de la etapa (D-1). Su gate interno decide si el documento se cierra.
2. Al volver, **re-detectar** con la misma regla de D-2 (sin estado propio en memoria).
3. Según el resultado:

| Re-detección | Acción de `project-flow` |
|---|---|
| Misma etapa (no se cerró: `Dejar en revisión`, `Cancelar`, `❌` de precondición o fallo) | `⏸ La etapa <Etapa> no quedó cerrada (<condición de D-2 que sigue pendiente>).` + `AskUserQuestion` `Reintentar <Etapa>` / `Detener`. Sin respuesta → `Detener`. `Detener` → `Retoma cuando quieras con /project-flow.` y fin. |
| Etapa siguiente | `📋 Etapa <Etapa> completa.` + `AskUserQuestion` `Continuar con <Siguiente>` / `Detener aquí`. Sin respuesta → `Detener aquí` (mismo mensaje de retoma). |
| Pipeline completo | Paso final (D-4, mensaje de cierre). |

El gate de `project-flow` no reemplaza al de la etapa: el de la etapa aprueba **el documento**; el de `project-flow` aprueba
**avanzar**. Es el equivalente de la pregunta actual "¿listo para continuar con la fase …?", ahora separada de la escritura del
`substatus`, que ya no es de `project-flow`.

**Alternativas rechazadas:**

- *Encadenar las etapas sin preguntar (el `Confirmar` de la etapa basta):* elimina la pausa entre etapas que CNF-1 conserva; un
  usuario que aprueba la visión no podría detenerse antes del discovery.
- *Volver a la etapa automáticamente si no se cerró:* bucle sin salida cuando la causa es estructural (precondición `❌`).
- *Recordar en memoria la etapa ejecutada en vez de re-detectar:* dos fuentes del estado; la re-detección es la misma regla
  que usa el arranque y es la que hace la retoma determinista.

### D-4 — Pipeline ya completo // satisface: AC-2, CNF-1

Con la etapa 4 de D-2 al arrancar: `✅ El pipeline de proyecto ya está completo: visión cerrada, <n> FR y roadmap planificado.`
+ `AskUserQuestion` `Replanificar` / `Cancelar`. `Replanificar` compone `/project-planning` (agrega una propuesta nueva sin
tocar el resto, STORY-111 D-6) y termina. Sin respuesta → `Cancelar` → fin sin escritura.

Mensaje de cierre tras completar la última etapa en esta sesión:
`🎉 Pipeline de proyecto completo` con las rutas `$SPECS_BASE/product/vision.md`, `$SPECS_BASE/product/stakeholders.md`,
`$SPECS_BASE/requirements/` y `$SPECS_BASE/product/roadmap.md`, y `Siguiente comando: /epic-from-project-plan`.

**Alternativas rechazadas:**

- *"Reiniciar desde el principio" (opción actual):* sobrescribía los tres documentos; en el modelo de capas los requisitos son
  incrementales y `/project-begin` ya ofrece `Actualizar` sobre una visión cerrada. Un reinicio global no tiene equivalente seguro.
- *Ofrecer también `Actualizar visión` y `Ampliar requisitos`:* son `/project-begin` y `/project-discovery` invocados
  directamente; YAGNI en el orquestador.

### D-5 — `sddf-init` deja de crear `specs/01-projects/` // satisface: AC-3, AC-1

- Paso 2: la lista de directorios pierde `specs/01-projects/`; el resto (`02-epics/`, `03-stories/` — o sus nombres tras
  STORY-108 — y `templates/`) no cambia.
- No se añaden `product/` ni `requirements/` al Paso 2: los crean los skills de etapa al escribir (STORY-109 D-3, STORY-110 D-5,
  STORY-111 D-6) o `memory-system scaffold` en el nivel `full`.
- Paso 6: se quitan las líneas `[CREADO] … specs/01-projects/` de los tres ejemplos (por defecto, `minimal`, `full`).
- README (`Output`): la frase de directorios queda sin `01-projects/`.
- Un `specs/01-projects/` preexistente no se toca (idempotencia declarada, constitución §11); su migración es de STORY-114.

**Alternativas rechazadas:**

- *Crear `product/` y `requirements/{functional,non-functional}/` en el Paso 2:* duplica la semilla de `memory-system`
  (STORY-115) con directorios vacíos que el nivel `standard` hoy no promete.
- *Avisar si existe `specs/01-projects/`:* el aviso de estructura antigua es de `memory-system` (STORY-115 AC-2) y la mención
  reintroduciría `01-projects` en `sddf-init` (AC-3).

### D-6 — `header-aggregation`: `type` y campos por capa // satisface: AC-3

**Derivación de `type`** (Paso 2), por la ruta relativa a `$SPECS_BASE`, primera coincidencia:

| Ruta | `type` | `id` | `kind` | `slug` |
|---|---|---|---|---|
| `product/README.md`, `requirements/README.md` | `wiki` | — | — | `<capa>-index` |
| `product/<nombre>.md` | `product` | — | — | `<nombre>` |
| `requirements/functional/FR-NNN-*.md` | `requirement` | `FR-NNN` | `functional` | nombre sin extensión |
| `requirements/non-functional/NFR-NNN-*.md` | `requirement` | `NFR-NNN` | `non-functional` | nombre sin extensión |
| `requirements/srs-*.md` | `srs` | — | — | nombre sin extensión |
| otro archivo bajo `requirements/` | `wiki` | — | — | nombre sin extensión |
| directorio `STORY-*` | `story` | `STORY-NNN` | `feat` si falta | nombre del directorio (sin cambios) |
| directorio `EPIC-*` | `epic` | `EPIC-NN` | — | nombre del directorio (sin cambios) |
| resto | `wiki` | — | — | sin cambios |

Las reglas de slug coinciden con las de `memory-system` (`memory-rules.md` §2: `README.md` → `<directorio>-index`; otro archivo
→ nombre sin extensión), de modo que `index` encuentra el mismo slug que escribe `header-aggregation`.

**Campos obligatorios por `type`** (el esquema canónico pasa a declarar qué campos aplican a cada tipo; se omiten los que no):

| `type` | Campos | Valores derivados si faltan |
|---|---|---|
| `story`, `epic`, `wiki` | los actuales | sin cambios, salvo `parent` de épica → `null` (ya no hay proyecto padre) |
| `product` | `type`, `slug`, `title`, `status`, `substatus`, `parent`, `created`, `updated` | `status: IN-PROGRESS`, `substatus: TODO`, `parent: null` (valores de la semilla) |
| `requirement` | `type`, `kind`, `id`, `slug`, `title`, `status`, `created`, `updated`, `related` | `status: active`, `related: []` |
| `srs` | `type`, `slug`, `title`, `status`, `substatus`, `parent`, `created`, `updated` | `status: IN-PROGRESS`, `substatus: IN-PROGRESS`, `parent: null` |

En un merge (Paso 3.3) los campos existentes se conservan como hoy; solo se proponen los obligatorios del tipo que falten.

**Esquema y búsquedas:** el enum pasa a `type: <epic | story | product | requirement | srs | wiki>`; `id` a
`<EPIC-NN | STORY-NNN | FR-NNN | NFR-NNN>`; `kind` admite también `functional | non-functional` (si `type = requirement`);
`parent` a `<null | EPIC-NN>`. Paso 1 (nombre corto): la búsqueda en `01-projects/` se sustituye por `$SPECS_BASE/product/<término>.md`
y `$SPECS_BASE/requirements/**/<término>*.md`; el ejemplo `project-intent` pasa a `vision`. Paso 4.1: `product/` y
`requirements/` (recursivo en `functional/` y `non-functional/`) se admiten como directorios de batch y, al recibir `$SPECS_BASE`,
se escanean en lugar de `01-projects/` (paridad de cobertura con el escaneo retirado).

**Alternativas rechazadas:**

- *Solo cambiar `type` y mantener los campos de `story` para todo:* escribiría `alwaysApply`, `id` y `substatus` en `vision.md`
  y en cada FR, contra las semillas y el esquema de `requirements/README.md`, y `slug: product` (nombre del directorio) rompería
  los wikilinks `[[vision]]`.
- *Un único `type: layer` con la capa en otro campo:* no coincide con el `type` que ya llevan las semillas (`product`) ni con el
  README de requisitos (`requirement`, `srs`).
- *Conservar `type: project` para los archivos `PROJ-*`:* AC-3 exige que `01-projects` solo sobreviva en la migración; los
  archivos antiguos caen en `wiki` hasta que se migren.

### D-7 — Evals // satisface: CNF-2, AC-2, AC-3

Formato vigente (`skill`/`version`/`description`/`cases`, IDs `TC-NNN`, `input.context`, `expected.contains`/`not_contains`,
`threshold`). El runner ejecuta `claude -p` en solo lectura: los gates quedan sin respuesta y se aplican los valores por defecto
de D-3/D-4, así que los casos verifican decisiones de flujo.

**`skills/project-flow/evals/evals.json` (nuevo)** y retirada de la entrada `project-flow` de `config/eval-exemptions.json`:

| Caso | Escenario | Aserciones clave |
|---|---|---|
| TC-001 | `vision.md` semilla (`substatus: TODO`), sin FR, sin roadmap | contiene `Begin`, `/project-begin`, `product/vision.md`; no contiene `01-projects`, `project-intent`, `PROJ-` |
| TC-002 | `vision.md` en `IN-PROGRESS` | contiene `Begin`, `/project-begin`; no contiene `/project-discovery` como etapa en ejecución |
| TC-003 | `vision.md` en `DONE`, `requirements/functional/` vacío | contiene `Discovery`, `/project-discovery`; no contiene `/project-begin` como etapa a ejecutar |
| TC-004 | visión `DONE`, `FR-001…FR-003`, sin `roadmap.md` | contiene `Planning`, `/project-planning`; no contiene `project-plan.md` |
| TC-005 | visión `DONE`, FR presentes, `roadmap.md` semilla sin `## Propuesta (` ni épicas | contiene `Planning` |
| TC-006 | visión `DONE`, FR presentes, `roadmap.md` con una `## Propuesta (2026-10-01)` | contiene `ya está completo`, `Replanificar`, `Cancelar` |
| TC-007 | etapa compuesta sin cierre (usuario sin respuesta en el gate de la etapa) | contiene `⏸`, `/project-flow`; no contiene `Continuar con` |
| TC-008 | `$CLI_ROOT/skills/project-discovery/` no existe y la etapa es Discovery | contiene `❌`, `npx agile-sddf install` |

**`skills/sddf-init/evals/evals.json`:** TC-001 cambia `docs/specs/01-projects` por `docs/templates` en `contains` y añade
`01-projects` a `not_contains`; TC-006 (`minimal`) añade `01-projects` a `not_contains`. TC-007/TC-010 (`full`) no lo añaden
hasta STORY-115 (el scaffold aún siembra `specs/01-projects/.gitkeep`, CR-001). Sube `version` (minor).

**`skills/header-aggregation/evals/evals.json`:** fixture nuevo `skills/header-aggregation/examples/capas/` (`sddf.config.yaml`
con `root: docs`, `docs/product/vision.md` y `docs/requirements/functional/FR-001-fixture-requisito.md`, ambos sin frontmatter).

| Caso | Escenario | Aserciones clave |
|---|---|---|
| TC-00x | archivo de `product/` sin frontmatter | contiene `Frontmatter aplicado`, `product`, `vision`; no contiene `PROJ-`, `alwaysApply`, `type:    wiki` |
| TC-00y | archivo de `requirements/functional/` sin frontmatter | contiene `requirement`, `FR-001`, `functional`, `active`; no contiene `PROJ-`, `substatus` |

**Alternativas rechazadas:** mantener la exención de `project-flow` (CNF-2 exige que sus evals pasen) y fixtures de repositorio
completo para `project-flow` (la regla de D-2 se expresa en `input.context`; los fixtures solo aportan valor donde el skill lee el
archivo real, como en `header-aggregation`).

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Skill `project-flow` | reescribir flujo (D-1…D-4) | `skills/project-flow/SKILL.md` | AC-1, AC-2, AC-3, CNF-1 |
| README `project-flow` | modificar (`Produces`, gates, invocación) | `skills/project-flow/README.md` | AC-1, AC-3 |
| Evals `project-flow` | crear | `skills/project-flow/evals/evals.json` | CNF-2, AC-2 |
| Exenciones de evals | modificar (quitar `project-flow`) | `config/eval-exemptions.json` | CNF-2 |
| Skill `sddf-init` | modificar Paso 2 y Paso 6 (D-5) | `skills/sddf-init/SKILL.md` | AC-3, AC-1 |
| README `sddf-init` | modificar `Output` | `skills/sddf-init/README.md` | AC-3 |
| Evals `sddf-init` | modificar TC-001, TC-006 | `skills/sddf-init/evals/evals.json` | AC-3, CNF-2 |
| Skill `header-aggregation` | modificar esquema, Pasos 1, 2 y 4.1 (D-6) | `skills/header-aggregation/SKILL.md` | AC-3 |
| Fixture de capas | crear | `skills/header-aggregation/examples/capas/` | AC-3, CNF-2 |
| Evals `header-aggregation` | añadir 2 casos | `skills/header-aggregation/evals/evals.json` | AC-3, CNF-2 |
| CHANGELOG | modificar (`[Unreleased]`, breaking) | `CHANGELOG.md` | — (trazabilidad de release) |

Se reutilizan (P3): la composición inline `skill → skill` de `sddf-init` (Paso 5b), el inventario de FR de STORY-110/111, el
contrato `## Propuesta (` de STORY-111 D-1, las reglas de slug de `memory-rules.md` §2 y el gate `AskUserQuestion` con valor
por defecto en ausencia de respuesta.

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Detección de etapa | Entrada: `vision.md` (frontmatter), `requirements/functional/`, `requirements/srs-*.md`, `roadmap.md`. Salida: `Begin` \| `Discovery` \| `Planning` \| `Completo` (D-2). Solo lectura. | AC-2 |
| `project-flow` → skill de etapa | Composición inline de `$CLI_ROOT/skills/<skill>/SKILL.md` sin argumentos; el skill resuelve su raíz y escribe su capa; `project-flow` no recibe valores de retorno, re-detecta (D-3) | AC-1 |
| Gate entre etapas | `AskUserQuestion` `Continuar con <Siguiente>` / `Detener aquí` (defecto `Detener aquí`) | CNF-1 |
| Gate de etapa no cerrada | `AskUserQuestion` `Reintentar <Etapa>` / `Detener` (defecto `Detener`) | CNF-1, AC-2 |
| Gate de pipeline completo | `AskUserQuestion` `Replanificar` / `Cancelar` (defecto `Cancelar`) | AC-2 |
| `sddf-init` Paso 2 | Directorios: `specs/<épicas>/`, `specs/<historias>/`, `templates/` | AC-3 |
| `header-aggregation` Paso 2 | `ruta relativa a $SPECS_BASE → (type, id, kind, slug, campos obligatorios)` según D-6 | AC-3 |

## Esquema de datos

Frontmatter derivado por `header-aggregation` para un archivo sin encabezado:

```
product/vision.md                                requirements/functional/FR-001-fixture-requisito.md
---                                              ---
type: product                                    type: requirement
slug: vision                                     kind: functional
title: "<primer #>"                              id: FR-001
status: IN-PROGRESS                              slug: FR-001-fixture-requisito
substatus: TODO                                  title: "<primer # sin el prefijo 'FR-001 — '>"
parent: null                                     status: active
created: <hoy>                                   created: <hoy>
updated: <hoy>                                   updated: <hoy>
---                                              related: []
                                                 ---
```

Para `requirement`, `title` se toma del primer `#` quitando el prefijo `<ID> — ` (forma de encabezado de STORY-105/110), para no
duplicar el ID en el título.

## Flujos clave

### F-1 — Pipeline completo sobre repo recién inicializado (AC-1)

1. `/sddf-init` crea `specs/<épicas>/`, `specs/<historias>/`, `templates/` y los templates; ningún `01-projects/`.
2. `/project-flow`: detección → Begin (sin `vision.md`). Compone `/project-begin` → `Confirmar` → `vision.md` en `DONE`.
3. Re-detección → Discovery → `Continuar con Discovery` → compone `/project-discovery` → `Confirmar` → `stakeholders.md` + FR/NFR.
4. Re-detección → Planning → `Continuar con Planning` → compone `/project-planning` → `Confirmar` → `roadmap.md`.
5. Re-detección → Completo → mensaje de cierre con `/epic-from-project-plan`. Ninguna etapa nombra `specs/01-projects/`.

### F-2 — Retoma (AC-2)

`/project-flow` en cualquier estado → D-2 elige la primera etapa pendiente y el bucle de D-3 continúa desde allí. Ejemplos de la
tabla de AC-2: `vision.md` `IN-PROGRESS` → Begin (`/project-begin` entra en `resume`); visión `DONE` sin FR → Discovery; visión
`DONE` con FR y sin `roadmap.md` → Planning.

### F-3 — Normalización por capa (AC-3)

`/header-aggregation docs/requirements/functional/FR-001-x.md` → D-6 → `type: requirement`, `kind: functional`, `id: FR-001` →
resumen `✓ Frontmatter aplicado`. Sobre `docs/product/vision.md` → `type: product`, `slug: vision`.

### F-4 — Degradación (P7)

- Skill de etapa no instalado → `❌ … npx agile-sddf install` y fin (D-1).
- Etapa no cerrada (precondición, cancelación, fallo del agente) → `⏸` + `Reintentar`/`Detener` (D-3); las capas quedan como
  las dejó el skill de etapa (que solo escribe tras su propio gate).
- Frontmatter de `vision.md` ilegible o sin `substatus` → se trata como no `DONE` → Begin (`/project-begin` lo trata como `TODO`).
- `requirements/` o `product/` ausentes → `$FR_COUNT = 0` / roadmap ausente; no es un error.
- Sin respuesta en cualquier gate de `project-flow` → opción que no avanza ni escribe.

## Decisiones de complejidad justificada

- **Regla de roadmap con dos cláusulas (D-2).** La existencia del archivo bastaría para un repositorio nuevo sin scaffold, pero
  la semilla de STORY-115 y el roadmap migrado de STORY-106 existen sin propuesta con significados opuestos.
- **Dos gates por etapa (el de la etapa y el de `project-flow`, D-3).** Una pregunta más por etapa; sin ella CNF-1 no se cumple
  porque el gate de la etapa ya no decide el avance.
- **Campos obligatorios por tipo en `header-aggregation` (D-6).** Una tabla en lugar de un esquema único; sin ella el skill
  ensuciaría las capas con campos de work item que sus semillas y el README de requisitos excluyen.
- **Re-detección tras cada etapa en vez de estado en memoria (D-3).** Una lectura extra de tres rutas; a cambio, arranque y
  avance usan la misma regla y la retoma es determinista.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Sin modelo de proyectos en los tres skills | `git grep -nE "01-projects\|PROJ-\|project-intent\|project-plan\|project\.md\|type: project" -- skills/project-flow skills/sddf-init skills/header-aggregation` → vacío | AC-3 |
| 2 | Cierre del bloque | `git grep -n "01-projects" -- skills agents` → solo `skills/memory-system/**` y `skills/skill-preflight/**` mientras STORY-108/115 no estén integradas; tras ellas, solo la lógica de detección de `memory-system` (CR-001; verificación final en STORY-117) | AC-3 |
| 3 | Detección por capas | `skills/project-flow/SKILL.md` contiene la tabla de D-2 (`vision.md`, `substatus`, `requirements/functional/FR-`, `srs-`, `## Propuesta (`, `## Épicas`) y ninguna lectura de otros archivos para decidir la etapa | AC-2 |
| 4 | Composición de etapas | `skills/project-flow/SKILL.md` nombra `/project-begin`, `/project-discovery`, `/project-planning` como skills compuestos y no contiene `project-pm`, `project-architect` ni `-template.md` | AC-1, AC-3 |
| 5 | Gates conservados | `SKILL.md` contiene `Continuar con`, `Detener aquí`, `Reintentar`, `Replanificar` con sus valores por defecto | CNF-1 |
| 6 | Evals | `npm run test:eval -- project-flow`, `-- sddf-init` y `-- header-aggregation` → exit 0 | CNF-2 |
| 7 | Inventario de evals | `npm run verify:eval-inventory` → `[OK]`; `project-flow` no figura en `config/eval-exemptions.json` | CNF-2 |
| 8 | `sddf-init` no crea `01-projects` | Paso 2 lista solo `specs/<épicas>/`, `specs/<historias>/`, `templates/`; TC-001 y TC-006 lo aseguran con `not_contains` | AC-3 |
| 9 | Tipo por capa | Ejecutar `/header-aggregation` sobre los dos archivos del fixture `examples/capas/` → `type: product` y `type: requirement` (`kind: functional`, `id: FR-001`) | AC-3 |
| 10 | Encoding | Archivos creados o modificados sin BOM (`EF BB BF`) ni `Ã`/`ðŸ` | — |
| 11 | Enlaces | `npm run verify:links` → `[OK]` | — |

## Risks / Trade-offs

- [El contexto se acumula al componer tres skills de etapa (más el `/project-story-mapping` opcional dentro de Planning)] →
  Cada `SKILL.md` se lee solo al entrar en su etapa; el usuario puede `Detener aquí` y retomar en otra sesión sin perder estado,
  porque el estado vive en las capas.
- [Los skills de etapa terminan con `Siguiente comando: /project-…` aunque el flujo continúe] → Aceptado: el gate de
  `project-flow` aparece a continuación; cambiar esos mensajes es alcance de STORY-109…111.
- [`/sddf-init --level full` sigue creando `specs/01-projects/` vía `memory-system scaffold` hasta STORY-115] → Aceptado y
  registrado (CR-001); los evals `full` no lo prohíben todavía.
- [Orden de integración: esta historia depende de que STORY-109…111 estén implementadas para que las etapas compuestas escriban
  en las capas] → Implementar después de ellas en la rama de la épica; antes de eso las etapas se detendrían por sus templates
  antiguos (ya aceptado en los CR de esas historias).
- [`memory-system ensure --fix-frontmatter` recorrerá también `product/` y `requirements/`] → Solo toca archivos **sin**
  frontmatter (estrategia "Saltar todos los conflictos"); las semillas y los archivos generados ya lo tienen.
- [Archivos `PROJ-*` antiguos normalizados con `header-aggregation` antes de migrar reciben `type: wiki`] → Aceptado; la
  migración (STORY-114) es el camino soportado.

## Open Questions

Ninguna. Las ambigüedades detectadas se resolvieron en el diseño y las dependencias quedan registradas como CR.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: AC-3 ("solo aparece en la lógica de migración de `memory-system`") se condiciona solo a STORY-109…112, pero
  quedan `01-projects` en `skills/skill-preflight/` (STORY-108 D-8) y en `skills/memory-system/` fuera de la detección
  (semilla `specs/01-projects/`, `SPECS_LAYERS`, `index-template.md`, `scaffold/constitution.md`, `scaffold/specs/README.md`,
  `memory-rules.md`: STORY-115). La lógica de detección permitida la aporta STORY-114. Por el mismo motivo, `/sddf-init --level full`
  crea `specs/01-projects/` hasta STORY-115.
- **Documento afectado**: story.md (STORY-113)
- **Acción requerida**: ampliar el "Dado" de AC-3 a "STORY-108, STORY-109 a STORY-112, STORY-114, STORY-115 y este cambio", o
  verificar AC-3 aquí sobre los tres skills de la historia (contrato 1) y dejar la búsqueda global a STORY-117.

### CR-002
- **Tipo**: ambigüedad
- **Descripción**: la tabla de AC-2 usa "sin `roadmap.md`" como señal de Planning, pero STORY-115 (AC-1) siembra
  `product/roadmap.md` en todo proyecto nuevo y STORY-106 deja en este repositorio un roadmap sin `## Propuesta`.
- **Documento afectado**: story.md
- **Acción requerida**: el diseño usa "roadmap planificado" (D-2: alguna `## Propuesta (` o alguna épica en `## Épicas`).
  Recomendado: precisar la fila de AC-2 a "sin `roadmap.md` planificado" en las notas de la historia.

### CR-003
- **Tipo**: dependencia
- **Descripción**: la documentación canónica sigue describiendo el modelo retirado: constitución §8 (`type: project | epic | story`,
  `parent: PROJ-NN`), §9 (WIP = 1 a nivel de proyecto) y §13 (ruta `01-projects`); `docs/architecture/state-machine.md:128`
  ("`project-flow` coordina las transiciones" de `substatus`); `docs/guides/sddf-commands-pipeline.md:178`.
- **Documento afectado**: story.md (STORY-116)
- **Acción requerida**: incluir en STORY-116 los tipos `product`/`requirement`/`srs` del esquema de frontmatter y el rol de
  `project-flow` como compositor de etapas que no escribe `substatus`.

### CR-004
- **Tipo**: reutilización
- **Descripción**: los CR de STORY-109 (CR-002), STORY-110 (CR-003) y STORY-111 (CR-001) proponen alternativas para
  `project-flow` (adoptar templates nuevos o delegar). D-1 elige delegar en los tres skills de etapa, lo que elimina de
  `project-flow` toda resolución de templates e invocación directa de agentes.
- **Documento afectado**: design.md
- **Acción requerida**: ninguna en las historias hermanas; sus CR quedan cerrados por esta historia.
