---
alwaysApply: false
type: design
id: STORY-111
slug: STORY-111-planning-escribe-roadmap-design
title: "Design: project-planning escribe en product/roadmap.md y epic-from-project-plan lee de allí"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-21-colapsar-specs-dos-niveles
story: STORY-111
created: 2026-10-08
updated: 2026-10-08
related:
  - STORY-111-planning-escribe-roadmap
  - eliminar-specs-01-projects
  - STORY-106-migrar-plan-a-roadmap
  - STORY-108-renombrar-specs-sin-prefijos
  - STORY-110-discovery-escribe-stakeholders-y-requisitos
---

<!-- Referencias -->
[[STORY-111-planning-escribe-roadmap]] · [[eliminar-specs-01-projects]] · [[STORY-106-migrar-plan-a-roadmap]] · [[STORY-108-renombrar-specs-sin-prefijos]] · [[STORY-110-discovery-escribe-stakeholders-y-requisitos]]

# Diseño técnico: `project-planning` escribe en `product/roadmap.md` y `epic-from-project-plan` lee de allí

## Context

[[eliminar-specs-01-projects]] (ADR-0013) mueve el plan de épicas (`project-plan.md`) a `docs/product/roadmap.md`, y establece
que "el roadmap en `product/roadmap.md` lista los Epics planificados". STORY-106 migra el contenido de este repositorio; esta
historia cambia el **escritor** (`/project-planning` + agente `project-architect`) y el **lector** (`/epic-from-project-plan`).

Estado actual (medido el 2026-10-08):

| Pieza | Estado |
|---|---|
| `skills/project-planning/SKILL.md` | Paso 0b resuelve `PROJ_DIR` en `specs/01-projects/` (busca `project-intent.md` en `DONE`); Paso 1 exige `project.md` con `substatus: DONE`; Paso 2 detecta retoma por el `substatus` de `project-plan.md`; Paso 3 resuelve `project-plan-template.md` (central → seed `assets/`); Paso 4 ofrece `/project-story-mapping` si falta `01-projects/$PROJ_DIR/story-map.md`; Paso 5 delega en `project-architect`, que **escribe directamente** `project-plan.md`. |
| `skills/epic-from-project-plan/SKILL.md` | Configuración 0b resuelve `PROJ_DIR`; Fase 0 exige `project-plan.md`; Fase 1 parsea `## Propuesta de Épicas` → bloques `### Épica <N> — / : <Nombre>`; el **ID de la épica sale del número del encabezado** (`Walking Skeleton` → `00`); duplicados → `-bis`; `parent` = `PROJ-NN` o `null`; Fase 3e valida con `epic-format-validation`. |
| `agents/project-architect.agent.md` (estado *Planning*, líneas 117–221) | Rutas fijas a `01-projects/$PROJ_DIR/`; extrae features con ID `STORY-NNN` (numeración desde `STORY-001`); MVP en la Épica 1; escribe frontmatter `type: project`, `id: PROJ-NN`, `status: PLANNING`. La descripción del frontmatter del agente cita `project-plan.md`. |
| `project-plan-template.md` | Seed (`skills/project-planning/assets/`) y central (`docs/templates/`), idénticos byte a byte. Secciones `## Objetivo`, `## Backlog de Historias` (líneas `STORY-NNN` con `deps`), `## Propuesta de Épicas` (`### Épica Walking Skeleton: MVP`, `### Épica 1: …`), `## Resumen`. |
| `docs/product/roadmap.md` | No existe todavía. STORY-106 (diseñada, `READY-FOR-IMPLEMENT`) lo crea con dos secciones `##`: `## Épicas` (tabla `ID │ Épica │ Título │ Status │ Substatus`, foto de las 22 épicas) y `## Plan original (2026-04-20)` (histórico literal), seguidas de `Volver al mapa: [[index]].`. Su diseño declara ambas secciones como **contrato para STORY-111** (Interfaces de STORY-106). |
| `docs/requirements/` | Solo `README.md`. STORY-105 crea `functional/FR-001…FR-054` y `non-functional/NFR-001…NFR-024`; STORY-110 hace que `/project-discovery` y `/reverse-engineering` escriban un archivo por requisito y cuenta además los encabezados `### FR-NNN` de `requirements/srs-*.md` (D-3/D-4 de STORY-110). |
| `docs/product/vision.md`, `story-map.md` | `vision.md` existe (semilla, `substatus: TODO`); `story-map.md` llega con STORY-107 (migración) y su escritor `/project-story-mapping` cambia con STORY-112. |
| Nivel de épicas | `docs/specs/02-epics/` con `EPIC-00…EPIC-21`. STORY-108 lo renombra a `specs/epics/` mediante sustitución textual de `02-epics` → `epics` en `skills/`, `agents/`, `test/` y `docs/` (D-4 de STORY-108). |
| Evals | `epic-from-project-plan` tiene `evals/evals.json` v1.1.0 (TC-001…TC-008), todos con contexto `PROJ_DIR` / `01-projects` / `project-plan.md`. `project-planning` no tiene evals y está exento en `config/eval-exemptions.json`; `scripts/verify-eval-inventory.js` rechaza un skill con `evals.json` que siga exento. |
| Contrato F1/F2/F3 | `domain-epic-lifecycle` §9: F1 (`- <Nombre>: <desc>`, sin ID) la escriben `epic-creation` y `epic-from-project-plan`; el ID `STORY-NNN` lo asignan `epic-generate-stories` / `epic-generate-all-stories` (máximo existente + 1). |

Consumidores de `project-plan-template.md` (`git grep -n project-plan-template -- skills scripts test config agents`):
`skills/memory-system/scripts/memory-system.js:127` (`SHARED_TEMPLATES`, owner `project-planning`),
`test/memory-system.test.js:319` (`NINE_TEMPLATES`), `skills/memory-system/references/memory-rules.md:173`,
`skills/memory-system/assets/scaffold/templates/README.md:19`, `skills/memory-system/evals/evals.json` (TC-007, texto),
`skills/sddf-init/SKILL.md:112,201,259`, `skills/skill-preflight/SKILL.md:108`, `skills/skill-preflight/evals/evals.json:57,61`,
`agents/project-architect.agent.md:136` y `skills/project-flow/SKILL.md:215,221` (STORY-113, ver CR-001).

Stack (constitución + `package.json`): Markdown para skills, agentes y templates; Node.js solo en `memory-system.js`, verificadores y
tests (`node --test`). No hay `skills.plan` en `sddf.config.yaml`: no aplican skills complementarios.

## Goals / Non-Goals

**Goals:**

- Con al menos un FR en `requirements/` y sin `roadmap.md`, `/project-planning` crea `docs/product/roadmap.md` tras la confirmación
  del desarrollador, con una propuesta de épicas (objetivo, historias y criterios de éxito por épica); nunca crea `project-plan.md`
  ni `specs/01-projects/`. // satisface: AC-1
- Sobre un `roadmap.md` existente, `/project-planning` agrega una propuesta fechada nueva; `## Épicas`, `## Plan original (2026-04-20)`
  y las propuestas anteriores quedan byte a byte iguales. // satisface: AC-2
- `/epic-from-project-plan` lee la última propuesta de `roadmap.md` y crea un `EPIC-NN-<slug>/epic.md` por épica que aún no existe,
  numerando desde el mayor `EPIC-NN` existente + 1; sin `roadmap.md` no crea nada y remite a `/project-planning`. // satisface: AC-3
- Los dos skills y el estado *Planning* de `project-architect` quedan sin `01-projects`, `project-plan.md` (como ruta) ni `PROJ-`;
  ambos skills tienen evals que pasan con `npm run test:eval`. // satisface: CNF-1
- La estructura del roadmap y de cada propuesta se deriva en runtime de `roadmap-template.md` (central en `docs/templates/`, seed del
  skill dueño), que reemplaza a `project-plan-template.md`. // satisface: CNF-2
- Todo lo escrito en `roadmap.md` (y en los `epic.md`) queda en UTF-8 sin BOM. // satisface: CNF-3

**Non-Goals:**

- Renombrar `epic-from-project-plan` (Non-Goal de la historia).
- Sincronizar `## Épicas` con el `status` real de las épicas, o marcar en el roadmap qué épica propuesta se materializó (Non-Goal).
- Crear el `roadmap.md` de este repositorio (STORY-106) o renombrar `02-epics/` (STORY-108).
- Cambiar el escritor de `story-map.md` (`/project-story-mapping`, STORY-112) o `project-flow` (STORY-113, CR-001).
- Reescribir la documentación canónica (`docs/architecture/memory-system.md`, `domain-project-lifecycle.md`, guías) ni el regex
  `canonical` de `scripts/check-doc-links.js` (STORY-116).
- Cambiar el estado *Discovery* de `project-architect` (STORY-110).

## Decisions

### D-1 — Estructura del roadmap: secciones `##` disjuntas y propuestas acumulativas // satisface: AC-1, AC-2, CNF-2

```
# Roadmap del producto
> nota de vigencia (del template)
## Épicas                          ← foto de épicas reales; la escribe solo quien CREA el archivo
## Plan original (2026-04-20)      ← solo en este repo (STORY-106); ningún skill lo escribe
## Propuesta (AAAA-MM-DD)          ← una por ejecución confirmada de /project-planning, en orden de llegada
### Épica 1: <Nombre> … ### Épica k: <Nombre>
### Resumen
Volver al mapa: [[index]].
```

- **Contrato de encabezado de propuesta** (compartido por los dos skills, declarado en el comentario guía del template):
  `## Propuesta (AAAA-MM-DD)`; si ya existe una propuesta con la misma fecha, `## Propuesta (AAAA-MM-DD #2)`, `#3`, … La palabra
  `Propuesta` no colisiona con `Épicas` ni con `Plan original`.
- **Append-only:** una propuesta escrita no se edita ni se borra desde los skills; replanificar = agregar otra. El orden del documento
  es cronológico, así que "la última propuesta" es la última sección `## Propuesta (…)` del archivo.
- El roadmap de este repositorio (STORY-106) ya tiene `## Épicas` y `## Plan original (2026-04-20)`: la primera propuesta nueva se
  agrega **después** del histórico, conservando el orden cronológico.

**Alternativas rechazadas:**

- *Sobrescribir una única sección `## Propuesta de épicas`:* pierde el registro de lo planificado y contradice AC-2 ("se agrega … con su
  fecha").
- *Un archivo por propuesta (`product/roadmap-AAAA-MM-DD.md`):* ADR-0013 nombra un único `roadmap.md` como fuente del plan de épicas;
  varios archivos reintroducen la deriva que el ADR elimina.
- *Insertar la propuesta nueva arriba (más reciente primero):* obligaría a insertar entre `## Épicas` y el histórico, y "la última
  propuesta" dejaría de ser posicional; el lector necesitaría ordenar por fecha (y resolver `#2`).

### D-2 — `roadmap-template.md` reemplaza a `project-plan-template.md` // satisface: CNF-2, AC-1

| Copia | Ruta |
|---|---|
| Seed (dueño `project-planning`) | `skills/project-planning/assets/roadmap-template.md` |
| Central | `docs/templates/roadmap-template.md` |

Seed y central idénticos byte a byte (ADR-0001). `project-plan-template.md` se elimina en sus dos copias (`git rm`). Resolución en
`project-planning`: central → seed (`⚠️ Usando template seed del skill. Ejecuta sddf-init para centralizarlo en $SPECS_BASE/templates/.`)
→ ninguno: `❌ Template roadmap-template.md no encontrado. Ejecuta sddf-init.` y fin sin escribir.

Contenido del template (cada `##` con comentario `clave:`, patrón del template de épica v2):

| Elemento | Contenido |
|---|---|
| Frontmatter | `type: product` · `slug: roadmap` · `title: "Roadmap del producto"` · `status: IN-PROGRESS` · `substatus: TODO` · `parent: null` · `created` · `updated`, cada clave con su anotación `# escritor: project-planning` (convención de `product/` y de STORY-106 D-4). |
| `# Roadmap del producto` + cita | `> Plan de épicas del producto. "Épicas" es una foto de las épicas existentes al crear este archivo; cada "Propuesta" registra una planificación y no se modifica después.` |
| `## Épicas` · `clave: epicas` | Guía: tabla `ID │ Épica │ Título │ Status │ Substatus` (formato de STORY-106 D-2), una fila por `epic.md` existente al crear el archivo, wikilink `[[<slug declarado>]]`; sin épicas → línea `Sin épicas creadas al <AAAA-MM-DD>.` Nadie la reescribe después. |
| `## Propuesta (<AAAA-MM-DD>)` · `clave: propuesta · repetible` | Guía: contrato de encabezado de D-1; contiene los bloques de épica y el resumen. |
| `### Épica <N>: <Nombre>` (dentro de `propuesta`) | Guía + campos de D-3. `N` es ordinal dentro de la propuesta (1…k), no un ID. |
| `### Resumen` (dentro de `propuesta`) | Tabla `Métrica │ Valor`: `Épicas propuestas`, `Historias propuestas`, `Requisitos FR cubiertos`. |
| Pie | `Volver al mapa: [[index]].` |

Registros que cambian `project-plan-template.md` → `roadmap-template.md` (owner `project-planning`, sin otros cambios):
`memory-system.js` (`SHARED_TEMPLATES`), `test/memory-system.test.js` (`NINE_TEMPLATES`), `memory-rules.md` (tabla de semillas),
`scaffold/templates/README.md` (lista de plantillas base), `memory-system/evals/evals.json` (texto de TC-007), `sddf-init/SKILL.md`
(tabla del Paso 2b y dos ejemplos de salida), `skill-preflight/SKILL.md` (Verificación 3) y `skill-preflight/evals/evals.json`
(contexto y `contains` del caso que espera la plantilla ausente). Las ediciones son de **subcadena**, porque STORY-110 sustituye
`project-template.md` y STORY-109 `project-intent-template.md` en las mismas listas.

**Alternativas rechazadas:**

- *Conservar `project-plan-template.md` con el nombre antiguo y nuevo contenido:* el nombre seguiría remitiendo al artefacto que
  ADR-0013 elimina y a la ruta prohibida por CNF-1.
- *Dos templates (`roadmap-template.md` + `roadmap-proposal-template.md`):* la propuesta solo existe dentro del roadmap; un único
  template con la sección `repetible` mantiene una sola fuente de estructura (CNF-2).
- *Template sin `## Épicas` (solo propuestas):* un roadmap creado por el skill tendría una forma distinta del de STORY-106 y del
  SMOKE-1 de EPIC-21; AC-2 presupone que la sección existe.

### D-3 — Contenido de un bloque de épica en la propuesta // satisface: AC-1, AC-3

| Campo | Forma | Obligatorio | Lo consume `epic-from-project-plan` como |
|---|---|---|---|
| Encabezado | `### Épica <N>: <Nombre>` | sí | nombre → slug y `title` |
| Objetivo | `**Objetivo:** <2-4 líneas, output-oriented>` | sí | clave `alcance` |
| Historias | `**Historias:**` + líneas F1 `- <Nombre>: <descripción>` en orden de prioridad | sí (≥ 1) | clave `historias` (F1) |
| Requisitos | `**Requisitos:** FR-NNN, FR-NNN` (los FR que cubre) | sí (≥ 1) | `notas › ### Requisitos` |
| Dependencias | `**Dependencias:** <épica de la propuesta o EPIC-NN existente>` | no | `notas › ### Dependencias` |
| Riesgos | `**Riesgos:** <texto>` | no | `notas › ### Riesgos` |
| Criterios de éxito | `**Criterios de éxito:**` + `- [ ] <criterio medible>` | sí (≥ 1) | clave `criterios-salida` + `smoke-tests` |

- **Las historias no llevan `STORY-NNN`.** Son F1 (planificadas): el ID lo asigna `epic-generate-stories` con "máximo existente + 1"
  (contrato §9 de `domain-epic-lifecycle`). Numerar desde `STORY-001` en el agente colisionaría con las 119 historias de este repo.
- Desaparece el `## Backlog de Historias` independiente: la prioridad la da el orden de las épicas y de las historias dentro de cada
  una; las dependencias se declaran por épica.
- `**Requisitos:**` traza la épica al nivel estratégico, como pide ADR-0013 (rationale 7: los Epics referencian requisitos).

**Alternativas rechazadas:**

- *Mantener el backlog con IDs `STORY-NNN` calculados por el skill (máximo + 1):* reserva IDs para historias que quizá nunca se
  creen y duplica la responsabilidad de `epic-generate-stories`; `epic-from-project-plan` las escribiría como F2 ("creada") sin que
  exista el directorio.
- *Historias como líneas sueltas sin la etiqueta `**Historias:**` (forma del template antiguo):* el lector tendría que separar
  historias de criterios por posición; la etiqueta hace el parseo inequívoco.

### D-4 — Precondición e insumos de `project-planning` // satisface: AC-1, CNF-1

Se eliminan el Paso 0b (`PROJ_DIR`), la exigencia de `project.md` y el flujo de retoma por `substatus` de `project-plan.md`.

| Insumo | Ruta | Regla |
|---|---|---|
| Requisitos funcionales | `$SPECS_BASE/requirements/functional/FR-*.md` + encabezados `### FR-NNN` de `$SPECS_BASE/requirements/srs-*.md` | **Precondición:** ≥ 1 FR. Si no: `❌ No hay requisitos funcionales en $SPECS_BASE/requirements/. Ejecuta /project-discovery (o /reverse-engineering) antes de planificar.` → fin, sin escribir nada (ni en `.tmp/`). |
| Requisitos no funcionales | `$SPECS_BASE/requirements/non-functional/NFR-*.md` (+ `### NFR-NNN` de `srs-*.md`) | Opcional (contexto). |
| Visión | `$SPECS_BASE/product/vision.md` | Opcional. Ausente o con `substatus` ≠ `DONE` → `⚠️ La visión del producto no está terminada; la propuesta se basará solo en los requisitos.` y continúa (la historia solo exige FR). |
| Stakeholders | `$SPECS_BASE/product/stakeholders.md` | Opcional (contexto). |
| Story map | `$SPECS_BASE/product/story-map.md` | Opcional; D-5. |
| Roadmap existente | `$SPECS_BASE/product/roadmap.md` | Si existe: el agente lo lee para no repetir épicas ya propuestas. |
| Épicas existentes | `$EPICS_DIR/EPIC-*/epic.md` | El skill construye `$EPICS_INVENTORY` (líneas `EPIC-NN — <title> — <slug>`, leídos del frontmatter). |

`$EPICS_DIR` es la ruta del nivel de épicas **vigente al implementar** (`$SPECS_BASE/specs/02-epics` hoy; `…/specs/epics` si STORY-108
ya está integrada). No se resuelven las dos: la sustitución textual de STORY-108 corrige la ruta escrita por esta historia si se
implementa antes (Notas de la historia).

**Alternativas rechazadas:**

- *Exigir `vision.md` en `DONE` (como `/project-discovery` en STORY-110):* la historia fija como única precondición "existe al menos un
  FR"; `/project-discovery` ya bloquea sin visión, así que un FR implica que la visión se terminó en el flujo normal.
- *Contar solo archivos `FR-*.md`:* rompería en proyectos que adopten el SRS único (STORY-118); se usa el mismo inventario que
  STORY-110 D-4.

### D-5 — Story map previo // satisface: AC-1

- `$SPECS_BASE/product/story-map.md` existe → `✅ Se usará $SPECS_BASE/product/story-map.md como guía estructural.`
- No existe → misma pregunta actual (`1. Sí, hacer Story Mapping ahora` / `2. No, continuar sin Story Mapping`); sin respuesta → `2`.
  Con `1` se compone `/project-story-mapping` inline; al volver, si `product/story-map.md` sigue sin existir (escritor aún no migrado,
  STORY-112) → `⚠️ /project-story-mapping no dejó $SPECS_BASE/product/story-map.md; se continúa sin story map.` (CR-002).

**Alternativa rechazada:** *buscar también el story map en su ubicación antigua:* reintroduce la ruta de `01-projects` que CNF-1
prohíbe.

### D-6 — Propuesta en staging, gate y materialización por el skill // satisface: AC-1, AC-2, CNF-3

El agente **no escribe en `$SPECS_BASE`**. Escribe solo la sección de propuesta en `$STAGING_PATH =
.tmp/project-planning/proposal.md` (canal `.tmp/<skill-name>/` de AGENTS.md, mismo patrón que STORY-110 D-5).

| Paso | Responsable | Acción |
|---|---|---|
| 1 | skill | Precondición D-4; resuelve template (D-2); calcula `$EPICS_INVENTORY` y `$PROPOSAL_HEADING` (fecha de hoy; `#2`… si ya existe en el roadmap); vacía `.tmp/project-planning/`. |
| 2 | skill | Story map (D-5). |
| 3 | `project-architect` (*Planning*) | Escribe `$STAGING_PATH` (D-7). |
| 4 | skill | **Valida** el staging: empieza con `## <$PROPOSAL_HEADING>`; ≥ 1 `### Épica`; cada bloque con `**Objetivo:**`, ≥ 1 historia, `**Requisitos:**` con ≥ 1 `FR-NNN` existente en el inventario, ≥ 1 criterio; termina con `### Resumen`; sin `STORY-NNN`. Falla → `❌ La propuesta generada no cumple el contrato del template: <motivo>.` → fin sin escribir. |
| 5 | skill | Resumen (`<k> épicas · <h> historias`, una línea `Épica N: <Nombre> — <h> historias — <FR…>` por épica, y si el roadmap existe, `Se agregará como "<heading>" sin modificar el resto del roadmap.`) + `AskUserQuestion` `Confirmar` / `Cancelar`. Sin respuesta → `Cancelar`. `Cancelar` → `Planificación cancelada: no se modificó $SPECS_BASE/product/roadmap.md.` → fin. |
| 6 | skill | Materialización (abajo). |
| 7 | skill | `✅ Propuesta (<fecha>) agregada a $SPECS_BASE/product/roadmap.md: <k> épicas, <h> historias. Siguiente comando: /epic-from-project-plan` |

**Materialización:**

- **Roadmap inexistente (AC-1):** crea `$SPECS_BASE/product/` si falta y escribe, desde el template: frontmatter (claves del template
  sin comentarios `# escritor:`, `created`/`updated` = hoy), `# Roadmap del producto`, la cita, `## Épicas` con la foto de
  `$EPICS_INVENTORY` (o la línea "Sin épicas…"), el contenido del staging y el pie `Volver al mapa: [[index]].`.
- **Roadmap existente (AC-2):** inserta el contenido del staging, precedido de una línea en blanco, **inmediatamente antes** de la
  última línea `Volver al mapa: [[index]].`; si no hay pie, lo agrega al final. Lo único que cambia además es `updated:` del
  frontmatter. No se reordena, reformatea ni normaliza ninguna otra línea (incluidos finales de línea).
- Escritura en UTF-8 sin BOM. El staging queda en `.tmp/` para inspección.

**Alternativas rechazadas:**

- *Escritura directa del agente en `roadmap.md`:* la garantía de AC-2 dependería de que el agente no toque nada más, y el skill no
  podría presentar el resultado antes de escribir ("confirma el resultado", AC-1).
- *Retoma de propuestas a medio hacer (equivalente al `substatus: IN-PROGRESS` de `project-plan.md`):* una propuesta solo se escribe
  completa y confirmada; el `substatus` de `roadmap.md` (capa `product/`) no describe a una propuesta concreta. Un plan cancelado se
  regenera ejecutando de nuevo.
- *Gate de tres opciones con "dejar en revisión":* escribiría una propuesta no aprobada que `/epic-from-project-plan` tomaría como la
  última.

### D-7 — Estado *Planning* de `project-architect` // satisface: AC-1, CNF-1, CNF-3

Se reescribe la sección `## Estado Planning` con variables inyectadas (alineado con la fila *Planning* de STORY-110 D-9, que la deja
parametrizada "hasta STORY-111"):

| Variable | Contenido |
|---|---|
| `$INPUT_PATHS` | Rutas existentes de D-4 (requisitos, visión, stakeholders, story map, roadmap). |
| `$EPICS_INVENTORY` | Épicas existentes (`EPIC-NN — título — slug`). |
| `$TEMPLATE_PATH` | `roadmap-template.md` resuelto por el skill. |
| `$PROPOSAL_HEADING` | `Propuesta (AAAA-MM-DD)` o con `#n`. |
| `$STAGING_PATH` | `.tmp/project-planning/proposal.md`. |

Proceso del agente: leer insumos → derivar de la sección `clave: propuesta` del template los campos del bloque → identificar historias
(unidades de valor, sin ID) → priorizar (valor, dependencias, riesgo, esfuerzo; sin cambios) → agrupar en épicas incrementales que **no
dupliquen** épicas del inventario ni de propuestas previas → escribir `$STAGING_PATH` sin comentarios `<!-- -->`, sin frontmatter.
Regla MVP: si `$EPICS_INVENTORY` está vacío, la Épica 1 es el MVP (walking skeleton, 3-5 historias, ≥ 2 criterios); si no, cada épica
agrega valor incremental sobre lo existente (≥ 1 criterio). Mínimo 1 épica (antes "mínimo 2", pensado solo para un plan inicial).

Se eliminan del estado *Planning*: rutas `01-projects/$PROJ_DIR/…`, `project-intent.md`/`project.md` como insumos, `STORY-NNN` y su
numeración, el paso de retoma y la escritura de frontmatter `type: project` / `id: PROJ-NN`. La `description` del frontmatter del
agente pasa a "…en Planning para proponer las épicas del roadmap". La variable `$PROJ_DIR` de la tabla de variables se elimina si
STORY-110 no lo hizo antes.

**Alternativas rechazadas:**

- *Agente nuevo `roadmap-planner`:* el método de planificación no cambia, solo entradas y salida; un agente nuevo duplicaría
  principios (P3, P12).
- *Que el agente reciba el roadmap completo como plantilla a reescribir:* le daría acceso a `## Épicas` y al histórico, que AC-2
  protege.

### D-8 — `epic-from-project-plan`: entrada, selección de propuesta y numeración // satisface: AC-3, CNF-1

| Fase | Cambio |
|---|---|
| Configuración 0b | Se elimina (`PROJ_DIR`). |
| Fase 0 | `$ROADMAP_PATH = $SPECS_BASE/product/roadmap.md`. No existe → `❌ No se encontró $SPECS_BASE/product/roadmap.md. Ejecuta /project-planning para planificar las épicas antes de usar este skill.` → fin sin crear directorios ni archivos. |
| Fase 1 | Selecciona la **última** sección cuyo encabezado cumple el contrato `## Propuesta (AAAA-MM-DD[ #n])` (D-1); ignora `## Épicas`, `## Plan original …` y cualquier otra sección. Sin propuesta → `❌ $SPECS_BASE/product/roadmap.md no contiene ninguna sección "## Propuesta (AAAA-MM-DD)". Ejecuta /project-planning.` → fin. Bloques: cada `### Épica <etiqueta><sep><Nombre>` (separador `:` o `—`; la etiqueta se ignora) hasta el siguiente `###` o `##`; `### Resumen` no es bloque. Sin bloques → mensaje actual `No se encontraron épicas planificadas …` citando la propuesta. Campos de D-3; las líneas de historia con ID (formatos antiguos) se siguen aceptando con el mapeo F2/F3 vigente. |
| Fase 2 | Asegura `$EPICS_DIR`. Calcula `$MAX_EPIC` = mayor `NN` de los directorios `$EPICS_DIR/EPIC-<NN>-*/`; sin ninguno → `-1`. |
| Fase 3a | Slug kebab (reglas actuales). **Existencia por nombre:** la épica "ya existe" si hay un directorio `EPIC-<cualquier NN>-<slug>`. Si existe → pregunta actual de sobrescritura sobre ese directorio (sin respuesta → `n`, se lista como `saltado (ya existía)`). Si no existe → ID = `$MAX_EPIC + 1`, que luego se incrementa; solo las épicas nuevas consumen ID, en el orden de la propuesta. Relleno a 2 dígitos (3 a partir de 100). Dos bloques con el mismo slug en la propuesta → el segundo recibe `-bis` (regla vigente, ahora sobre el nombre). |
| Fase 3d | Mapeo plan → clave sin cambios (D-3 da los datos). Frontmatter: `parent: null` siempre; `status: DEFINE` ("estado inicial de toda épica generada desde el roadmap"). |
| Fase 4 | Resumen sin cambios de forma; ruta `$EPICS_DIR`. |
| Notas | "El skill **no modifica** `roadmap.md`." |

Ejemplo (AC-3): `EPIC-00…EPIC-21` existentes y una propuesta con 3 épicas nuevas → `EPIC-22-<slug>`, `EPIC-23-<slug>`, `EPIC-24-<slug>`.
Directorio vacío → la primera épica es `EPIC-00` (convención del repo, que empieza en `EPIC-00`; CR-003).

Textos del `SKILL.md` y del `README.md` que nombran `project-plan.md` como origen pasan a `roadmap.md` (descripción del frontmatter,
"Usar cuando", "Produces", "Does not do"). Se actualizan además las anotaciones `# escritor:` del template de épica (seed
`skills/epic-creation/assets/epic-template.md` y central `docs/templates/epic-template.md`): `parent` → "epic-from-project-plan (null)".

**Alternativas rechazadas:**

- *Conservar el ID del encabezado del plan (`Épica 3` → `EPIC-03`):* colisiona con épicas existentes; AC-3 exige numerar desde el mayor.
- *Generar desde todas las propuestas del roadmap:* rematerializaría planes viejos ya ejecutados o descartados; AC-3 habla de "una
  propuesta".
- *Existencia por directorio exacto `EPIC-NN-<slug>`:* con numeración nueva el `NN` nunca coincide, y la protección contra sobrescritura
  dejaría de funcionar.
- *Escribir en el roadmap qué `EPIC-NN` materializó cada épica propuesta:* sincronización que la historia declara Non-Goal; además
  rompería el append-only de D-1.

### D-9 — Evals // satisface: CNF-1, AC-1, AC-2, AC-3

Se crea `skills/project-planning/evals/evals.json` y se retira su entrada de `config/eval-exemptions.json`. Se reescribe
`skills/epic-from-project-plan/evals/evals.json` (versión `2.0.0`): ningún caso menciona `01-projects`, `PROJ`, `project-plan.md` ni
`PROJ_DIR`. Formato vigente (`skill`/`version`/`description`/`cases`, `TC-NNN`, `expected.contains`/`not_contains`, `threshold`); los
contextos describen el resultado del subagente y la respuesta del usuario a cada pausa (el runner simula en seco y asume la opción
afirmativa si no se especifica).

| Skill | Caso | Escenario | Aserciones clave |
|---|---|---|---|
| planning | TC-001 | FR-001…FR-003, sin roadmap, sin épicas; el agente devuelve 2 épicas; usuario `Confirmar` | contiene `product/roadmap.md`, `## Épicas`, `## Propuesta (`, `**Objetivo:**`, `**Criterios de éxito:**`, `/epic-from-project-plan`; no contiene `01-projects`, `project-plan.md`, `PROJ-`, `STORY-0` |
| planning | TC-002 | roadmap con `## Épicas` (22 filas) y `## Plan original (2026-04-20)`; usuario `Confirmar` | contiene `## Propuesta (`, `sin modificar el resto`, `Plan original (2026-04-20)`; no contiene `sobrescrib` |
| planning | TC-003 | ya existe `## Propuesta (<hoy>)` | contiene `#2)` |
| planning | TC-004 | sin FR (solo `requirements/README.md`) | contiene `❌`, `/project-discovery`; no contiene `roadmap.md:` como escrito, `✅` |
| planning | TC-005 | usuario `Cancelar` | contiene `no se modificó`; no contiene `✅ Propuesta` |
| planning | TC-006 | sin template central, con seed | contiene `⚠️`, `roadmap-template.md` |
| planning | TC-007 | sin template central ni seed | contiene `❌ Template roadmap-template.md`; no contiene `✅` |
| epic | TC-001…TC-004, TC-007, TC-008 | casos vigentes reescritos sobre una propuesta del roadmap con `$EPICS_DIR` vacío | IDs esperados desde `EPIC-00` en orden de propuesta (TC-002 pasa a `EPIC-00-catalogo-de-productos`, `EPIC-01-carrito-de-compra`); TC-007: directorio `EPIC-01-autenticacion` existente → `ya existe`, `saltado`, la otra épica recibe `EPIC-02` |
| epic | TC-005 | roadmap inexistente | contiene `No se encontró`, `roadmap.md`, `/project-planning`; no contiene `epic.md`, `EPIC-00` |
| epic | TC-006 | propuesta sin bloques `### Épica` | contiene `No se encontraron épicas planificadas` |
| epic | TC-009 | `EPIC-00…EPIC-21` existentes; última propuesta con 3 épicas nuevas (AC-3) | contiene `EPIC-22-`, `EPIC-23-`, `EPIC-24-`; no contiene `EPIC-01-`, `EPIC-03-` como creados |
| epic | TC-010 | roadmap con `## Plan original`, `## Propuesta (2026-10-01)` y `## Propuesta (2026-10-08)` | genera solo las épicas de la propuesta del 2026-10-08 |
| epic | TC-011 | roadmap solo con `## Épicas` y `## Plan original` | contiene `ninguna sección "## Propuesta`; no contiene `epic.md` |

**Alternativas rechazadas:** mantener la exención de `project-planning` (CNF-1 exige evals que pasen) y fixtures de repositorio completos
(los casos de flujo bastan; el resto lo cubren los contratos de verificación sobre archivos).

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Skill `project-planning` | modificar (D-4…D-6) | `skills/project-planning/SKILL.md` | AC-1, AC-2, CNF-1, CNF-3 |
| README `project-planning` | modificar (`Produces`, entradas, invocación) | `skills/project-planning/README.md` | CNF-1 |
| Template del roadmap (seed + central) | crear | `skills/project-planning/assets/roadmap-template.md`, `docs/templates/roadmap-template.md` | CNF-2 |
| `project-plan-template.md` (seed + central) | eliminar | `skills/project-planning/assets/`, `docs/templates/` | CNF-2, CNF-1 |
| Agente `project-architect` (estado *Planning* + `description`) | modificar (D-7) | `agents/project-architect.agent.md` | AC-1, CNF-1 |
| Skill `epic-from-project-plan` | modificar (D-8) | `skills/epic-from-project-plan/SKILL.md` | AC-3, CNF-1, CNF-3 |
| README `epic-from-project-plan` | modificar | `skills/epic-from-project-plan/README.md` | CNF-1 |
| Template de épica (anotación `parent`) | modificar 1 comentario | `skills/epic-creation/assets/epic-template.md`, `docs/templates/epic-template.md` | AC-3 |
| `epic-creation` (texto "sin `project-plan.md` previo") | modificar prosa | `skills/epic-creation/SKILL.md`, `skills/epic-creation/README.md` | — (veracidad) |
| Evals | crear / reescribir | `skills/project-planning/evals/evals.json`, `skills/epic-from-project-plan/evals/evals.json` | CNF-1 |
| Exenciones de evals | modificar (quitar `project-planning`) | `config/eval-exemptions.json` | CNF-1 |
| Registros del template compartido | modificar (subcadena) | los 8 archivos de D-2 | CNF-2 |
| CHANGELOG | modificar (`[Unreleased]`, breaking) | `CHANGELOG.md` | — (trazabilidad de release) |

Se reutilizan (P3): el formato de tabla de `## Épicas` de STORY-106 D-2, la resolución central → seed (ADR-0001), el canal
`.tmp/<skill-name>/` y el gate `Confirmar`/`Cancelar` de STORY-110 D-6, el inventario de FR de STORY-110 D-4, las reglas de slug
kebab y el mapeo plan → clave vigentes de `epic-from-project-plan`, y la asignación de `STORY-NNN` de `epic-generate-stories`.

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Precondición de planning | ≥ 1 FR en `requirements/functional/FR-*.md` o `### FR-NNN` de `requirements/srs-*.md`; si no → `❌ … Ejecuta /project-discovery …` sin escrituras | AC-1 |
| Skill → agente (*Planning*) | `$INPUT_PATHS`, `$EPICS_INVENTORY`, `$TEMPLATE_PATH`, `$PROPOSAL_HEADING`, `$STAGING_PATH` | AC-1 |
| Agente → skill | `.tmp/project-planning/proposal.md`: una sección `## <$PROPOSAL_HEADING>` con bloques D-3 y `### Resumen` | AC-1, AC-2 |
| Gate de planning | `AskUserQuestion` `Confirmar` (materializa) · `Cancelar` (por defecto, sin escritura) | AC-1 |
| Encabezado de propuesta | `## Propuesta (AAAA-MM-DD)` / `## Propuesta (AAAA-MM-DD #n)`; append-only; la última del archivo es la vigente | AC-2, AC-3 |
| Secciones protegidas | `## Épicas` (solo al crear), `## Plan original (…)` y propuestas previas: ningún skill las modifica | AC-2 |
| Lectura del roadmap | `epic-from-project-plan` lee solo la última propuesta; nunca escribe `roadmap.md` | AC-3 |
| Numeración de épicas | nueva épica = mayor `NN` de `$EPICS_DIR/EPIC-NN-*/` + 1 (vacío → `00`); existencia por slug | AC-3 |
| Template | `roadmap-template.md`; dueño `project-planning`; central → seed → `❌` | CNF-2 |

## Esquema de datos

Bloque de épica dentro de una propuesta (D-3):

| Campo | Tipo | Cardinalidad |
|---|---|---|
| Nombre | texto (encabezado `### Épica <N>: …`) | 1 |
| Objetivo | párrafo | 1 |
| Historias | líneas F1 `- <Nombre>: <descripción>` | ≥ 1 |
| Requisitos | lista de `FR-NNN` | ≥ 1 |
| Dependencias | texto | 0..1 |
| Riesgos | texto | 0..1 |
| Criterios de éxito | líneas `- [ ] <criterio>` | ≥ 1 |

`### Resumen`: `Épicas propuestas` (k), `Historias propuestas` (suma), `Requisitos FR cubiertos` (distintos citados).

Frontmatter de `roadmap.md` creado por el skill: el del template (D-2) con `created`/`updated` = fecha de creación. En un roadmap
existente solo cambia `updated`.

## Flujos clave

### F-1 — Primera planificación (AC-1)

1. `/project-planning` → precondición (≥ 1 FR) → template → inventario de épicas → `$PROPOSAL_HEADING = Propuesta (<hoy>)`.
2. Story map (D-5) → `project-architect` escribe `.tmp/project-planning/proposal.md`.
3. Validación → resumen → `Confirmar` → se crea `product/roadmap.md` (frontmatter, título, cita, `## Épicas` con la foto, propuesta, pie).
4. `✅ … Siguiente comando: /epic-from-project-plan`. No se crea `project-plan.md` ni `specs/01-projects/`.

### F-2 — Replanificación (AC-2)

Igual que F-1 hasta el gate; el agente recibe el roadmap para no repetir épicas. Con `Confirmar`, la propuesta se inserta antes del pie
y solo cambia `updated:`; `## Épicas`, `## Plan original (2026-04-20)` y las propuestas previas quedan idénticas.

### F-3 — Materialización de épicas (AC-3)

`/epic-from-project-plan` → `roadmap.md` existe → última `## Propuesta (…)` → bloques → `$MAX_EPIC` → por épica: existe por slug
(confirmar / saltar) o nueva (`EPIC-<MAX+1>-<slug>/epic.md`) → `epic-format-validation` → resumen.

### F-4 — Degradación (P7)

- Sin FR → `project-planning` se detiene antes de cualquier escritura (incluido `.tmp/`).
- El agente no deja `$STAGING_PATH` o lo deja fuera de contrato → `❌` del paso 4 de D-6; el roadmap no se toca y el staging queda
  para diagnóstico.
- Sin respuesta al gate → `Cancelar`.
- `/project-story-mapping` no deja `product/story-map.md` → `⚠️` y continúa (D-5).
- `roadmap.md` sin pie `Volver al mapa` (editado a mano) → la propuesta se agrega al final.
- `roadmap.md` inexistente o sin propuestas → `epic-from-project-plan` se detiene sin crear nada.
- Un `epic.md` sin `title`/`slug` en el inventario → la fila usa el nombre del directorio y se emite `⚠️ <ruta>: frontmatter incompleto`.

## Decisiones de complejidad justificada

- **Staging + materialización por el skill** en lugar de escritura directa del agente: más pasos, pero es lo único que permite
  garantizar AC-2 (no tocar nada fuera de la inserción) y el "confirma el resultado" de AC-1. El patrón ya existe (STORY-110).
- **Sufijo `#n` para propuestas del mismo día:** lo más simple sería la fecha sola, pero dos planificaciones el mismo día dejarían dos
  encabezados idénticos y el anclaje Markdown ambiguo; el sufijo es la diferencia mínima.
- **Existencia de épica por slug:** una comparación más que el directorio exacto, imprescindible porque la numeración nueva cambia el
  `NN`.
- **Etiqueta `**Historias:**` nueva:** añade una línea por bloque, pero elimina la heurística posicional del parseo.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Sin modelo de proyectos | `grep -rnE "01-projects\|PROJ-" skills/project-planning skills/epic-from-project-plan` → vacío; `grep -rn "project-plan\.md" skills/project-planning skills/epic-from-project-plan` → vacío; `sed -n '/^## Estado Planning/,$p' agents/project-architect.agent.md \| grep -nE "01-projects\|PROJ-\|project-plan\.md"` → vacío; la `description` del agente no contiene `project-plan.md` | CNF-1 |
| 2 | Template reemplazado | `cmp skills/project-planning/assets/roadmap-template.md docs/templates/roadmap-template.md` → exit 0; `test ! -e` de las dos copias de `project-plan-template.md`; `git grep -n "project-plan-template" -- skills agents scripts test config` → solo `skills/project-flow/SKILL.md` (CR-001) | CNF-2 |
| 3 | Template con contrato | `roadmap-template.md` contiene `clave: epicas`, `clave: propuesta`, `## Propuesta (`, `**Historias:**`, `**Requisitos:**`, `**Criterios de éxito:**`, `### Resumen`, `Volver al mapa: [[index]].`; frontmatter `type: product`, `slug: roadmap` | CNF-2, AC-1 |
| 4 | Precondición y gate en el skill | `skills/project-planning/SKILL.md` contiene `requirements/functional/FR-`, `/project-discovery`, `Confirmar`, `Cancelar`, `.tmp/project-planning/proposal.md`, `product/roadmap.md` | AC-1 |
| 5 | Inserción sin tocar lo existente | Fixture en `.tmp/story-verify/STORY-111/`: copia del `roadmap.md` de STORY-106; tras simular la materialización, `git diff --no-index` contra la copia muestra solo líneas añadidas antes del pie y el cambio de `updated:` | AC-2 |
| 6 | Lector del roadmap | `skills/epic-from-project-plan/SKILL.md` contiene `product/roadmap.md`, `## Propuesta (`, `/project-planning`, la regla "mayor `NN` + 1" y `parent: null`; no contiene `Propuesta de Épicas` como sección buscada | AC-3 |
| 7 | Evals | `npm run test:eval -- project-planning` y `npm run test:eval -- epic-from-project-plan` → todos los casos pasan; `node scripts/verify-eval-inventory.js` → OK | CNF-1, AC-1, AC-2, AC-3 |
| 8 | Registros y tests | `npm test` exit 0 (incluye `test/memory-system.test.js` con `roadmap-template.md`) | CNF-2 |
| 9 | Encoding | Los primeros 3 bytes de los archivos creados o modificados ≠ `EF BB BF`; `grep -lE "Ã\|ðŸ"` sobre ellos → vacío; `SKILL.md` de `project-planning` declara UTF-8 sin BOM para `roadmap.md` | CNF-3 |

## Risks / Trade-offs

- [STORY-106 no implementada al probar AC-2] → El roadmap real aún no existe; TC-002 y el contrato #5 usan un fixture con la forma de
  STORY-106 (D-1 de su diseño). Si STORY-106 cambia esa forma, se actualizan el fixture y el caso.
- [Conflicto de edición con STORY-110 en `project-architect.agent.md` y en los registros de templates] → STORY-110 toca el estado
  *Discovery* y la tabla de variables; esta historia, solo `## Estado Planning` y la `description`. Registros por subcadena (D-2).
- [Orden con STORY-108] → `$EPICS_DIR` se escribe con la ruta vigente; la sustitución textual de STORY-108 la actualiza (D-4).
- [`project-flow` sigue usando `project-plan-template.md` y `01-projects/project-plan.md`] → Su fase de planificación queda rota entre
  esta historia y STORY-113 (CR-001). Aceptado: `project-flow` ya depende de rutas que EPIC-21 retira en varias historias.
- [El agente propone épicas que ya existen con otro nombre] → El inventario y las propuestas previas se le pasan como contexto; la
  existencia por slug de D-8 solo detecta nombres iguales. La revisión humana del gate es la mitigación.
- [Propuestas acumuladas hacen crecer el roadmap] → Aceptado: es el registro de lo planificado; el lector solo usa la última.

## Open Questions

Ninguna. Las ambigüedades detectadas se resolvieron en el diseño y quedan registradas como CR.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: `skills/project-flow/SKILL.md:207-225` tiene su propia fase de planificación que lee `project-plan-template.md`
  (central y fallback en `skills/project-planning/assets/`) y escribe `01-projects/project-plan.md`. Al eliminar el template, esa fase
  falla hasta que STORY-113 actualice `project-flow`.
- **Documento afectado**: story.md (STORY-113)
- **Acción requerida**: STORY-113 debe delegar la fase de planificación en el contrato de `/project-planning` (roadmap, staging, gate) y
  dejar de citar `project-plan-template.md`.

### CR-002
- **Tipo**: dependencia
- **Descripción**: `/project-planning` lee `product/story-map.md`, pero `/project-story-mapping` sigue escribiendo en `01-projects/`
  hasta STORY-112. La opción "hacer Story Mapping ahora" no aporta guía mientras tanto.
- **Documento afectado**: design.md
- **Acción requerida**: D-5 degrada con `⚠️` y continúa; STORY-112 cierra la dependencia sin cambios en este skill.

### CR-003
- **Tipo**: ambigüedad
- **Descripción**: AC-3 fija "numerados a partir del mayor `EPIC-NN` existente" y "épicas que aún no existen", pero no define el caso
  sin épicas ni cómo se decide que una épica propuesta ya existe.
- **Documento afectado**: story.md
- **Acción requerida**: el diseño usa `EPIC-00` para la primera épica de un directorio vacío y existencia por slug (D-8). Opcional:
  precisar ambos puntos en las notas de la historia.

### CR-004
- **Tipo**: ambigüedad
- **Descripción**: AC-1 pide "historias" en la propuesta, y el template antiguo las identificaba con `STORY-NNN` numeradas desde
  `STORY-001`, lo que colisiona con historias existentes y contradice el contrato F1/F2/F3 (`domain-epic-lifecycle` §9).
- **Documento afectado**: design.md
- **Acción requerida**: las historias de la propuesta son F1 sin ID (D-3); el ID lo asigna `epic-generate-stories`. Sin cambio
  necesario en la historia.
