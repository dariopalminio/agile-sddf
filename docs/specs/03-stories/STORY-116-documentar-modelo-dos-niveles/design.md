---
alwaysApply: false
type: design
id: STORY-116
slug: STORY-116-documentar-modelo-dos-niveles-design
title: "Design: Actualizar documentación canónica al modelo de dos niveles"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-21-colapsar-specs-dos-niveles
story: STORY-116
created: 2026-10-08
updated: 2026-10-08
related:
  - STORY-116-documentar-modelo-dos-niveles
  - eliminar-specs-01-projects
  - nivel-l2-epic-y-directorios-numerados
  - STORY-108-renombrar-specs-sin-prefijos
  - STORY-113-project-flow-sin-01-projects
  - STORY-114-migrate-specs-3-levels
  - STORY-115-scaffold-dos-niveles-y-capas-destino
---

<!-- Referencias -->
[[STORY-116-documentar-modelo-dos-niveles]] · [[eliminar-specs-01-projects]] · [[nivel-l2-epic-y-directorios-numerados]] · [[STORY-108-renombrar-specs-sin-prefijos]] · [[STORY-113-project-flow-sin-01-projects]] · [[STORY-114-migrate-specs-3-levels]] · [[STORY-115-scaffold-dos-niveles-y-capas-destino]]

# Diseño técnico: documentación canónica del modelo de dos niveles

## Context

[[eliminar-specs-01-projects]] (ADR-0013, consecuencias "Actualización de documentación" y "Breaking change") retira el nivel
Project como work item: el contenido estratégico vive en `product/` y `requirements/`, y `specs/` queda con `epics/` y `stories/`.
Las historias STORY-104…115 cambian el contenido, los skills, el scaffold y la migración; esta historia reescribe los documentos
que **describen el modelo** y cierra el ciclo del ADR y del CHANGELOG. Es una historia `chore` solo de documentación, con una
excepción de código acotada (D-11).

**Estado medido (2026-10-08):**

| Pieza | Estado |
|---|---|
| Dominio (`docs/domains/`) | `domain-work-item-hierarchy.md` (296 l.) define Project como work item L3 (`PROJ-NNN`, `FolderSegment` `01-projects`, invariantes de parentesco Epic → Project). `domain-project-lifecycle.md` (203 l.) modela el agregado `Project` con 3 `FoundationalDocument`, WIP = 1 y fases `INTENT → REQUIREMENT → PLAN`; frontmatter solo `type`/`slug`/`title`. `README.md`, `domain-state-management.md`, `domain-epic-lifecycle.md` (`EpicParent` = `PROJ-NNN`, invariante 1), `domain-story-lifecycle.md`, `domain-knowledge-artifacts.md` (tipo "Spec (Project)", árbol, invariantes 8 y 14) y `domain.md` (glosario, BR-003, preguntas abiertas sobre WIP y padding de `PROJ-`) lo repiten. Siete documentos enlazan `[[domain-project-lifecycle]]`. |
| Arquitectura | `state-machine.md` §"Nivel PROJECT" (l. 112-129): solo `substatus`, 3 documentos, WIP = 1, "`project-flow` coordina las transiciones". `memory-system.md` (462 l.): árbol con `01-projects/PROJ-NNN-*/project.md` y los 3 `project-*-template.md`, reglas "3 niveles L3→L2→L1" y "prefijos numéricos solo en `specs/`", §9 "Project → Epic → Story", §10.2 capas `specs-projects` y semilla `specs/01-projects/`, §10.3 tabla de templates, §10.5 `migrate` sin `specs-3-levels`. `sddf-architecture.md` l. 146 "Project → Epic → Story" y l. 150 cita ADR-0004 como "Documentación en capas". `architecture/README.md` l. 61-62 fija la regla de reemplazo (`status: superseded` + enlace al sucesor; no se borra). |
| Guías | `flight-leves-model.md` (L3 - Project, árboles `01-projects`), `organization-of-artifacts.md` (tipos, IDs `PROJ-`, padre Project, búsqueda en tres carpetas, checklist, resumen visual), `sddf-commands-pipeline.md` §1-§2 (salidas en `specs/01-projects/`, entrada `project-plan.md`), `skill-structural-pattern.md` §7, §8, §14 (copia de los patrones de la constitución), `artifact-directory-migration.md` (migración `projects/` → `01-projects/`; STORY-108 D-5 ya ajusta sus columnas a `epics/`/`stories/`). `orchestrator-subagent-pattern.md:148` enlaza `testing-report.md` de STORY-119, que hoy son `testing-report-01.md` y `-02.md`. |
| Runbook | `runbooks/actualizar-spec-de-proyecto.md`: `status: COMPLETED`, procedimiento para resincronizar `01-projects/<PROJ>/project.md`, wikilink `[[PROJ-01-agile-sddf]]`. |
| Raíz | `constitution.md` ("tres niveles de workflow", "Jerarquía de desarrollo", reglas `project → epic → story` y "project.md debe mantenerse actualizado", §7 fila `PROJ-NN`, §8 `type: project \| epic \| story` y `parent: PROJ-NN`, §9 "WIP = 1 en el nivel de proyecto", §13 ruta `01-projects`). `README.md` (tabla de niveles l. 204, árbol l. 216-240 con `domain/` en lugar de `domains/`, l. 112/119 `project-plan.md`, bloque "Migración histórica desde 1.x"). `AGENTS.md` (árbol sin `product/`; WIP "(project, épica o story)"). `docs/specs/README.md` y `docs/product/README.md` de este repo (tres niveles; tres documentos fijos). |
| ADR | `ADR-0013` `status: PROPOSED`, `supersedes: null`; referencias `[[ADR-0001]]`, `[[ADR-0007]]`, `[[ADR-0010]]`, `[[ADR-0011]]` rotas (los slugs de ADR no llevan prefijo); rationale 6 dice "Intent-First" (la guía `sdd.md` y la constitución dicen Spec-First); consecuencias con "(optativo)" y "si se decide renumerar"; cierre conversacional ("Tu observación cierra el círculo…"). `ADR-0004` `ACCEPTED`, `superseded-by: null`. `adr/README.md`: índice hasta ADR-0009 (faltan 0010-0013) y convención "se actualiza `superseded-by` (único cambio permitido)". Precedente de reemplazo parcial: ADR-0001 (`SUPERSEDED` + nota `> **Superado por …**` que enumera lo que sigue vigente). |
| CHANGELOG | `[Unreleased]` con entradas `**BREAKING — …**` de STORY-103 bajo `### Changed` y una "Guía de actualización a 4.0.0 — épicas". STORY-109…115 añaden sus propias entradas (T019-T031 de sus `tasks.md`); ninguna redacta el resumen de ruptura ni la guía de migración global. |
| Enlaces | `npm run verify:links` (`scripts/check-doc-links.js`, raíces activas: `README.md`, `docs/index.md`, `constitution.md`, `policies/`, `guardrails/`, `guides/`, `runbooks/`; excluye `CHANGELOG.md`, `docs/adr`, `docs/specs`): 2 errores (el enlace de `orchestrator-subagent-pattern.md` y el wikilink placeholder de `docs/index.md` causado por `STORY-103/epic-template.md`, que corrige STORY-105 como prerrequisito). `memory-system check --root docs`: `problemas: 56 (orphan 8 · broken-wikilink 48)`; 31 son `[[ADR-0013-eliminar-specs-01-projects]]` en historias de EPIC-21, 1 `[[ADR-0003-workflow-canonico-story-y-epic]]` en `domain-epic-lifecycle.md`, 1 `[[security-checklist]]` en `domain-knowledge-artifacts.md`, 4 en ADR-0013. `check-doc-links.js:172` regex `canonical` con `project\|project-intent\|project-plan`. |
| Motor de memoria | `CANONICAL_FILES` incluye `project.md` y `SPEC_TYPES` incluye `project` (`memory-system.js` l. 100 y 609); ninguna historia de EPIC-21 los retira: siguen indexando y validando nodos de repositorios sin migrar. |

**CRs heredados que asignan trabajo a esta historia:** STORY-109 CR-003 (`memory-system.md`, constitución §7/§13,
`check-doc-links.js:172`), STORY-111 Non-Goal (regex `canonical`), STORY-113 CR-003 (constitución §8 con tipos
`product`/`requirement`/`srs`, §9 WIP, `state-machine.md:128`, `sddf-commands-pipeline.md:178`, rol de `project-flow` como
compositor que no escribe `substatus`), STORY-115 Non-Goals (`memory-system.md` `specs-projects`; `docs/specs/README.md` y
`docs/constitution.md` de este repo), STORY-108 D-5 (la reescritura del modelo es de esta historia).

**Dependencia de ejecución:** EPIC-21 ordena esta historia después de STORY-104…115. El diseño asume ese estado final:
`docs/specs/01-projects/` no existe, las rutas vivas ya dicen `specs/epics/` y `specs/stories/` (STORY-108), existen
`product/{vision,stakeholders,objectives,roadmap,story-map}.md`, `requirements/{functional,non-functional}/` poblados,
`architecture/c4/context-diagram.puml`, los templates `vision-`, `stakeholders-`, `requirement-` y `roadmap-template.md`, y
`memory-system migrate --from=specs-3-levels`. Ver F-4 si alguna precondición falla.

Stack: Markdown versionado (UTF-8 sin BOM) más el verificador Node de enlaces (`node --test`). No hay `skills.plan` en
`sddf.config.yaml`: no aplican skills complementarios. No se toca ningún `SKILL.md` ni agente.

## Goals / Non-Goals

**Goals:**

- Los seis documentos de AC-1 y el resto del inventario describen una sola jerarquía: `product/ + requirements/` (estratégico,
  documentación) → `specs/epics/` (coordinación) → `specs/stories/` (operativo); ninguno presenta a Project como work item,
  agregado con estado propio ni directorio `PROJ-NN`. // satisface: AC-1
- La tabla de fases del pipeline de proyecto (dominio, máquina de estados, guía de comandos) indica como salidas `vision.md`,
  `stakeholders.md`, `requirements/` y `roadmap.md`. // satisface: AC-1
- `ADR-0013` queda `ACCEPTED`, `ADR-0004` registra el reemplazo de los directorios numerados en frontmatter y nota visible, y
  `adr/README.md` lista ambos con su estado. // satisface: AC-2
- `[Unreleased]` de `CHANGELOG.md` tiene una sección `BREAKING` (rutas, hogares nuevos, skills con otro output, versión 4.0.0)
  que enlaza a una guía con `--dry-run` primero y la ejecución real después. // satisface: AC-3
- `verify:links` termina en exit 0 y `memory-system check` no reporta wikilinks rotos con origen en los archivos tocados ni
  hacia los nodos reemplazados. // satisface: CNF-1
- Los documentos que dejan de ser vigentes se conservan con `status: superseded` y enlace a su sucesor. // satisface: CNF-2
- Todo archivo tocado queda en UTF-8 sin BOM. // satisface: CNF-3

**Non-Goals:**

- Sustituir cadenas de ruta `02-epics`/`03-stories` (STORY-108); aquí solo se reescriben los párrafos del modelo.
- `package.json` 4.0.0, corte de `[Unreleased]` y release notes (`doc-release-notes`).
- `SKILL.md`, `README.md` de skills, agentes y templates de skills (STORY-109…115), incluido el comentario `PROJ-NN o null` de
  `epic-template.md`.
- Épicas e historias cerradas y ADRs distintos de ADR-0004 y ADR-0013 (incluidos ADR-0006, que enlaza `[[PROJ-01-agile-sddf]]`,
  y ADR-0011, `PROPOSED`, cuyo título nombra `project.md`).
- Retirar `project.md` de `CANONICAL_FILES` o `project` de `SPEC_TYPES` del motor de memoria (ver Risks).
- Alinear el término "Intent-First" en `epic.md` de EPIC-21 (STORY-117).

## Decisions

### D-1 — Modelo canónico único y frase de referencia // satisface: AC-1, CNF-1

Todos los documentos reescritos usan el mismo modelo y el mismo vocabulario (P4, P5). Tabla canónica (se reproduce en
`domain-work-item-hierarchy.md` §6 y se resume, no se copia, en los demás):

| Nivel (Flight Levels) | Dónde vive | Naturaleza | Identificador | Escritores |
|---|---|---|---|---|
| Estratégico | `product/` (`vision.md`, `stakeholders.md`, `objectives.md`, `roadmap.md`, `story-map.md`) + `requirements/` (`functional/FR-NNN-*.md`, `non-functional/NFR-NNN-*.md` o `srs-*.md`) | Documentación fundacional; **no es work item**: sin `status` de pipeline, sin `parent`, sin WIP | `FR-NNN` / `NFR-NNN` solo para requisitos | `/project-begin`, `/project-discovery`, `/reverse-engineering`, `/project-planning`, `/project-story-mapping` |
| Coordinación | `specs/epics/EPIC-NN-<slug>/epic.md` | Work item **L2** (`type: epic`) | `EPIC-NN` | `/epic-creation`, `/epic-from-project-plan` |
| Operativo | `specs/stories/STORY-NNN-<slug>/story.md` | Work item **L1** (`type: story`) | `STORY-NNN` | `/story-creation`, `/epic-generate-stories` |

Reglas que derivan de la tabla y que todos los documentos repiten igual:

- **Work items:** solo Epic y Story. `Level` = `{L1, L2}`; "L3" deja de nombrar un work item y solo aparece como sinónimo del
  nivel estratégico de Flight Levels.
- **Parentesco:** `Story.parent` = una Epic (obligatorio); `Epic.parent` = `null` (la épica es la raíz de la jerarquía de work
  items). Sin saltos ni parent hacia documentos de `product/`.
- **Trazabilidad ascendente:** la historia declara `implements: [FR-NNN]`; la épica se vincula al nivel estratégico por
  `product/roadmap.md` (`## Épicas` y `## Propuesta (<fecha>)`, STORY-111 D-1) y por `related`.
- **Frase corta** para documentos que solo mencionan la jerarquía: "`product/` + `requirements/` → Epic → Story".
- **Mención del modelo anterior:** solo en una nota de una línea que cita `[[eliminar-specs-01-projects]]`
  ("Hasta 3.x existía un nivel Project en `specs/01-projects/`; ver …"). Ninguna otra línea viva nombra `PROJ-` ni
  `01-projects` (contrato #1).

**Alternativas rechazadas:**

- *Renumerar los niveles (Epic = L2 → L1… o Strategic = L2):* ADR-0004, ADR-0005, los skills y 100+ historias dicen "nivel L1"
  y "nivel L2"; renumerar exigiría reescribir registros históricos.
- *Eliminar toda mención de "L3":* Flight Levels sigue siendo el marco explicativo (guía `flight-leves-model`, ADR-0013); el
  nivel estratégico existe, solo deja de ser work item.
- *Que la épica declare `parent: roadmap`:* el roadmap es un documento con propuestas append-only (STORY-111), no un agregado;
  introduciría un parent hacia un no-work-item y un campo que ningún escritor mantiene.

### D-2 — `domain-work-item-hierarchy.md`: reescritura in situ // satisface: AC-1

El bounded context sigue vigente (la jerarquía existe, con dos niveles): se edita el documento, no se reemplaza. Mismo slug,
mismas 11 secciones.

| Sección | Cambio |
|---|---|
| Cabecera `> Alcance:` | "Estructura transversal Epic → Story y su relación con el nivel estratégico (`product/` + `requirements/`)" |
| §1 Visión General | Objetivo: estructura de los work items Epic y Story; el nivel estratégico es documentación (D-1). Bounded context relacionado: **Foundational Docs Lifecycle** ([[domain-foundational-docs-lifecycle]], D-3) en lugar de Project Lifecycle. |
| §2 Glosario | Se elimina `Project`; se añade **Nivel estratégico** (documentación fundacional en `product/` + `requirements/`, no es work item). `Parent`: "todo work item excepto Epic". `Nivel`: L2 (Epic), L1 (Story). `Prefijo`: `EPIC-`, `STORY-`. |
| §3 Modelo táctico | `WorkItemId` ejemplos `STORY-001`, `EPIC-01`; `Level` = `L1`, `L2`; `ParentRef` `null` para L2; `FolderSegment` = `epics`, `stories`. Relaciones: L1 → L2 como parent; L2 sin parent. |
| §4 Diagrama de jerarquía | Árbol de dos niveles bajo un bloque "Nivel estratégico (documentación)" separado por línea discontinua; Mermaid `E[Epic L2] -->|1..N| S[Story L1]` más nodo `P[product/ + requirements/]` unido a `E` con arista punteada `-.->|roadmap / implements|`. |
| §5 Cardinalidad e invariantes | Tabla con dos filas (Epic: sin parent, 0..N Stories; Story: 1 Epic, sin children). Invariantes 1-6 reescritas: una Story no existe sin Epic; integridad referencial solo `Story → Epic`; trazabilidad bidireccional Epic ↔ Stories; se elimina "no saltos hacia Project". |
| §6 Nomenclatura y Flight Levels | Tabla de prefijos sin `PROJ-`; tabla de mapeo = tabla canónica de D-1; "Coordinación entre niveles": las decisiones estratégicas (visión, requisitos, roadmap) se traducen en épicas (L2) e historias (L1). |
| §7 Estructura de carpetas | "Dos carpetas por nivel de work item, sin prefijo numérico (ADR-0013)"; árbol `specs/epics/…`, `specs/stories/…`; nota de una línea del modelo anterior (D-1). |
| §8-§9 Resolución y validación | Búsqueda por ID en `epics/` y `stories/`; reglas "parent del nivel correcto" y "sin saltos" solo para Story → Epic; nomenclatura `EPIC-`, `STORY-`. |
| §11 Referencias | `[[domain-project-lifecycle]]` → `[[domain-foundational-docs-lifecycle]]`; se añade `[[eliminar-specs-01-projects]]`. |

**Alternativa rechazada:** *marcarlo `superseded` y crear `domain-two-level-hierarchy.md`:* el concepto (jerarquía de work
items) no desaparece; un sucesor obligaría a repuntar ~10 wikilinks sin ganancia y CNF-2 aplica solo a documentos que dejan
de ser vigentes.

### D-3 — `domain-project-lifecycle.md` reemplazado por `domain-foundational-docs-lifecycle.md` // satisface: AC-1, CNF-2

**Decisión (nota de la historia):** el agregado `Project` deja de existir, así que el documento deja de ser vigente → se
conserva con `status: superseded` y se crea un sucesor que modela el ciclo de vida de los **documentos fundacionales**, que sí
sigue existiendo (STORY-109, 110, 111, 113).

Documento retirado (`docs/domains/domain-project-lifecycle.md`):

- Frontmatter: se añaden `status: superseded` y `superseded-by: domain-foundational-docs-lifecycle` (se conservan `type`,
  `slug`, `title`).
- Bajo el `#`, nota visible: `> **Reemplazado por [[domain-foundational-docs-lifecycle]] (ADR-0013, [[eliminar-specs-01-projects]]):**
  el nivel Project y su directorio `specs/01-projects/` ya no existen; el pipeline Begin → Discovery → Planning escribe
  `product/` y `requirements/`. Este documento describe el modelo hasta 3.x.` El cuerpo no se modifica.

Sucesor (`docs/domains/domain-foundational-docs-lifecycle.md`), misma estructura de 11 secciones que
`domain-epic-lifecycle.md`/`domain-story-lifecycle.md` (P5):

| Elemento | Contenido |
|---|---|
| Frontmatter | `type: domain` · `slug: domain-foundational-docs-lifecycle` · `title: "Documentación del Dominio: Ciclo de Vida de la Documentación Fundacional (Foundational Docs Lifecycle)"` · `status: active` · `supersedes: domain-project-lifecycle` |
| Cabecera | `> Bounded Context: Foundational Docs Lifecycle` · `> Nivel: Estratégico — documentación, no work item` · transversal [[domain-state-management]] · canónico [[state-machine]] |
| §1 Visión General | Gobernar la producción de visión, stakeholders, requisitos y roadmap mediante etapas con gate humano. Actores: PO/PM, equipo, `project-flow` (compositor). |
| §2 Glosario | Documento fundacional (los de la tabla de §5), Etapa (`Begin`, `Discovery`, `Planning`), Visión cerrada (`substatus: DONE` de `vision.md`), Requisito (`FR`/`NFR`), Roadmap planificado (STORY-113 D-2: alguna `## Propuesta (` o alguna línea con `EPIC-NN` en `## Épicas`), Propuesta (sección fechada append-only). |
| §3 Modelo táctico | Sin agregado con identidad propia: entidades `FoundationalDocument` (identidad = ruta), `Requirement` (identidad `FR-NNN`/`NFR-NNN`), objeto de valor `StageSignal`. Se declara explícitamente: **no hay `PROJ-NN`, ni `status` de pipeline, ni WIP**. |
| §4 Pipeline de etapas | `Begin → Discovery → Planning` (Mermaid), cada etapa con gate humano del skill de etapa. |
| §5 Tabla de fases y documentos | Ver tabla siguiente. |
| §6 Señales de avance | Regla de detección de STORY-113 D-2 (primera pendiente gana): `vision.md` ausente o `substatus ≠ DONE` → Begin; `FR_COUNT = 0` → Discovery; roadmap no planificado → Planning; si no, completo. `vision.md` usa `substatus` `TODO`/`IN-PROGRESS`/`DONE` (STORY-109 D-3); `stakeholders.md` y `roadmap.md` llevan el `substatus` de su template, que no gobierna el pipeline; los requisitos usan `status: active`. |
| §7 Invariantes | Una raíz `docs/` = un producto (caso multi-proyecto fuera, ADR-0013); `/project-discovery` exige visión `DONE`; `/project-planning` exige ≥ 1 FR; nada se sobrescribe sin confirmación (staging + gate); los IDs de requisito no se reutilizan; las propuestas del roadmap no se editan; `project-flow` compone las etapas y **no escribe `substatus`**. |
| §8 Gates | Gate de visión (`/project-begin`), gate de requisitos (`/project-discovery`, `Confirmar`/`Cancelar`), gate de propuesta (`/project-planning`), gate de avance entre etapas (`project-flow`, STORY-113 D-3). |
| §9 Trazabilidad | Historias → `implements: [FR-NNN]`; roadmap → épicas; `/epic-from-project-plan` lee la última propuesta. |
| §10-§11 | Fuentes de verdad (`state-machine`, `header-aggregation/SKILL.md`, ADR-0013) y referencias (`[[domain-work-item-hierarchy]]`, `[[domain-epic-lifecycle]]`, `[[domain-project-lifecycle]]` como predecesor). |

Tabla de fases (texto idéntico en este documento, en `state-machine.md` y en `sddf-commands-pipeline.md` §1, columnas según el
documento):

| Etapa | Skill | Entrada | Salida |
|---|---|---|---|
| Begin | `/project-begin` | conversación con el usuario | `product/vision.md` |
| Discovery | `/project-discovery` (o `/reverse-engineering`) | `product/vision.md` en `DONE` (no aplica a `/reverse-engineering`) | `product/stakeholders.md` y `requirements/` (un `FR-NNN-*.md`/`NFR-NNN-*.md` por requisito) |
| Planning | `/project-planning` | ≥ 1 FR en `requirements/` | `product/roadmap.md` (propuesta fechada) |

**Alternativas rechazadas:**

- *Reescribir `domain-project-lifecycle.md` in situ:* el slug y el título seguirían diciendo "Project Lifecycle" para un
  bounded context sin Project; CNF-2 fija la regla de reemplazo para documentos que dejan de ser vigentes.
- *Marcarlo `superseded` con sucesor `state-machine.md`:* la máquina de estados es arquitectura; el dominio (glosario,
  invariantes, gates) quedaría sin documento y la carpeta `domains/` perdería el nivel estratégico.
- *Borrarlo:* contradice CNF-2 y `architecture/README.md`.

### D-4 — Resto de `docs/domains/` // satisface: AC-1, CNF-1

| Archivo | Cambio |
|---|---|
| `README.md` | Tabla de dominios: fila `[[domain-foundational-docs-lifecycle]]` (nivel **Estratégico**) en lugar de Project (la de `domain-project-lifecycle` se mueve a una línea "Reemplazados" con su sucesor). "Jerarquía de niveles" y tabla de mapeos = D-1 (sin `01-projects/`/`PROJ-`). "Relación entre dominios", "Fuera de alcance", "Lectura recomendada" (orden: hierarchy → state-management → foundational-docs → epic → story) y Mermaid (`PL` → `FD[domain-foundational-docs-lifecycle<br/>Estratégico]`). Principio 6: "No se mezclan reglas de documentación fundacional con reglas de Story". |
| `domain-state-management.md` | Cabecera "aplica a Story y Epic; la documentación fundacional solo usa `substatus` sin pipeline"; `WorkItem` = `epic` o `story`; gate WIP: "WIP = 1 por nivel de work item"; nota y referencias a `[[domain-foundational-docs-lifecycle]]`. |
| `domain-epic-lifecycle.md` | §1: "Foundational Docs Lifecycle — nivel estratégico (visión, requisitos, roadmap)". `EpicParent` se elimina del modelo táctico; invariante 1 → "Una `Epic` es la raíz de la jerarquía de work items (`parent: null`); su vínculo con el nivel estratégico es `product/roadmap.md`". F1 menciona "`epic-from-project-plan` (desde `product/roadmap.md`)". Referencia `[[ADR-0003-workflow-canonico-story-y-epic]]` → `[[workflow-canonico-story-y-epic]]`; l. 241 → sucesor. |
| `domain-story-lifecycle.md` | l. 30 y l. 211: Project Lifecycle → Foundational Docs Lifecycle / `[[domain-foundational-docs-lifecycle]]`. |
| `domain-knowledge-artifacts.md` | Tabla §4: se elimina "Spec (Project)"; se añade **Product** (`product/`, sin prefijo, evoluciona, "visión, stakeholders, objetivos, roadmap y story map"); Epic/Story con `specs/epics/`, `specs/stories/`. Árbol §5: `product/` y `specs/{epics,stories}/`. Invariante 8 → "`spec` vive en `specs/epics/` o `specs/stories/`"; invariante 14 → "`parent` obligatorio para Story, `null` para Epic"; l. 28/44/266 sin Project. `[[security-checklist]]` → `[[gr-code-security-checklist]]` (slug real, verificado al implementar con `grep -n "^slug:" docs/guardrails/gr-code-security-checklist.md`). Referencia a `[[domain-project-lifecycle]]` → sucesor. |
| `domain.md` | Glosario: "Work item: Epic o Story"; "L2 / L1: coordinación y operativo; el nivel estratégico es documentación"; fila de entidades Project → **Documentación fundacional** (`product/` + `requirements/`); Epic "parent `null`"; jerarquía "`product/` + `requirements/` → Epic (L2) → Story (L1)"; pipeline (l. 105, 138) con las salidas de D-3; relación l. 119 "roadmap lista Epic"; BR-003 "Epic → Story; sin saltos"; tabla de detalle l. 198 → sucesor; preguntas abiertas l. 209 (WIP de Project) y l. 211 (padding de `PROJ-`) marcadas `[x]` resueltas por ADR-0013; nueva fila en Change Log con fecha de implementación. |

### D-5 — Arquitectura // satisface: AC-1, CNF-1

**`state-machine.md`:** la sección `## Nivel PROJECT` se sustituye por `## Documentación fundacional (sin work item)`:
párrafo "No es un work item: sin `status` de pipeline ni WIP. El avance se detecta por el estado de las capas (`/project-flow`,
STORY-113 D-2)"; Mermaid `Begin → Discovery → Planning` con estados nombrados por su salida (`product/vision.md`,
`product/stakeholders.md + requirements/`, `product/roadmap.md`); la tabla de fases de D-3; la frase "Cada skill de etapa
escribe su documento y su gate; `/project-flow` compone las etapas, pregunta antes de avanzar y **no escribe `substatus`**". La
cita "es la fuente de verdad para los skills que actualizan `story.md`, `epic.md` y los documentos de proyecto" →
"… y `product/vision.md`". "Fuentes de verdad" añade `[[eliminar-specs-01-projects]]`.

**`memory-system.md`:**

| Lugar | Cambio |
|---|---|
| Árbol §3 | `product/` lista `vision`, `stakeholders`, `objectives`, `roadmap`, `story-map`; `specs/` con `epics/` y `stories/` sin comentarios L3; `architecture/c4/` con `context-diagram.puml`; `templates/` con los templates vigentes (`story`, `epic`, `vision`, `stakeholders`, `requirement`, `roadmap` con su dueño, más los cuatro de autoría manual). El conteo "nueve plantillas" y la frase "No existe `requirement-template.md` …" se reescriben con el número y la lista que declare `SHARED_TEMPLATES` en `memory-system.js` al implementar (fuente única; contrato #6). |
| Reglas del árbol | "Sin anidamiento profundo": `specs/` tiene dos niveles (`epics/`, `stories/`). "Prefijos numéricos": "Ninguna capa usa prefijos numéricos (ADR-0013)". |
| §9 Referencias | `[[domain-work-item-hierarchy]]` → "Jerarquía Epic → Story y nivel estratégico"; se añade `[[domain-foundational-docs-lifecycle]]` y `[[eliminar-specs-01-projects]]`. |
| §10.2 | Placeholders `specs-epics\|specs-stories`; semilla con `product/{README,vision,stakeholders,objectives,roadmap}.md`, `requirements/{functional,non-functional}/`, `specs/{epics,stories}/`; aviso `[WARNING] estructura de specs/ de tres niveles detectada (…)` (STORY-115 D-5); reglas de nodo: se mantiene `project.md` en la lista de archivos canónicos con la aclaración "(solo repositorios sin migrar)". |
| §10.3 | Fila de `product/` con `roadmap.md`; fila de templates de skill dueño con los nombres vigentes; "proyectos" desaparece de la lista de artefactos de autor (pasa a "documentos de `product/` y `requirements/` escritos por los skills de proyecto"). |
| §10.4 | `type ∈ {project, epic, story}` se conserva (describe el motor) con "(`project` solo aparece en repositorios sin migrar)". |
| §10.5 | Nuevo párrafo `migrate --from=specs-3-levels` (STORY-114): colapsa `specs/01-projects/` en `product/`, `requirements/` y `architecture/c4/`, mueve `02-epics/`/`03-stories/`, admite `--dry-run` y es idempotente; es el único modo que mueve y elimina orígenes ya migrados. Enlace a la guía de D-8. |

**`sddf-architecture.md`:** l. 146 `Project → Epic → Story` → "`product/` + `requirements/` → Epic → Story"; fila nueva
`[[eliminar-specs-01-projects]]` | "`specs/` de dos niveles; nivel estratégico en `product/` y `requirements/`"; la fila de
`[[nivel-l2-epic-y-directorios-numerados]]` pasa a "Épica como nivel L2 (directorios numerados reemplazados por ADR-0013)".

**Alternativa rechazada:** *mantener la sección "Nivel PROJECT" con una nota de obsolescencia:* `state-machine.md` es un
documento vivo (`architecture/README.md`: "al cambiar el sistema se edita el documento vigente") y la nota no eliminaría la
afirmación de AC-1.

### D-6 — Guías y runbook // satisface: AC-1, CNF-2

| Archivo | Cambio |
|---|---|
| `flight-leves-model.md` | "Niveles de flujos": **L3 - Estratégico** (visión, requisitos y roadmap en `product/` + `requirements/`; documentación, no work item), L2 - Épica, L1 - Story. "Work-items": se elimina el bullet Project; se añade párrafo "El producto o iniciativa no es un work item…"; la épica es "un entregable dentro del producto". "Jerarquía de work-items" y "Jerarquía Flight Levels": árboles de D-1. "Documentos de especificaciones": estratégico en `docs\product` + `docs\requirements`; L2 `docs\specs\epics`; L1 `docs\specs\stories`. La analogía con Jira (Initiative → Epic → Story) se conserva aclarando que Initiative corresponde al nivel estratégico documental. |
| `organization-of-artifacts.md` | §2 tipos de workitem: Épica y Story (el nivel estratégico se remite a `product/`/`requirements/`); §3 IDs `EPIC-`, `STORY-` (+ `FR-`/`NFR-` para requisitos, que no son workitems); §4 tabla sin Project; §5 frontmatter sin `type: project`; §6 Épica `parent: null`, Story `parent: <épica>` y se elimina el ejemplo `parent: PROJ-001`; §7 búsqueda en `epics/` y `stories/`; §8 archivos canónicos `epic.md`, `story.md`; §10 checklist; §11 resumen visual. |
| `sddf-commands-pipeline.md` | §1 tabla con la tabla de fases de D-3 (Input/Output) y la nota "`project-flow` detecta la etapa por el estado de las capas y compone los tres skills; no escribe `substatus`" (sustituye a l. 178); §2 `epic-from-project-plan` lee `product/roadmap.md` (última propuesta) y escribe `specs/epics/EPIC-NN-<slug>/epic.md`. |
| `skill-structural-pattern.md` | §7, §8, §9 y §14 con el mismo texto que la constitución (D-7) para que la copia no diverja. |
| `artifact-directory-migration.md` | Guía de migración (D-8). |
| `orchestrator-subagent-pattern.md` | l. 148: `testing-report.md` → `testing-report-01.md` (contiene la tabla citada; CNF-1). |
| `runbooks/actualizar-spec-de-proyecto.md` | CNF-2: `status: superseded`, `superseded-by: domain-foundational-docs-lifecycle`; `related` y la línea de referencias pasan de `[[PROJ-01-agile-sddf]]` a `[[eliminar-specs-01-projects]]`; nota visible bajo el `#`: "Reemplazado: `project.md` ya no existe (ADR-0013). Para resincronizar requisitos con el código usa `/reverse-engineering` o `/project-discovery`, que escriben `requirements/` de forma incremental; ver [[domain-foundational-docs-lifecycle]]. Las lecciones de este runbook (contar, no recordar; verificar antes de afirmar) siguen siendo válidas." El cuerpo no se modifica. |

**Alternativa rechazada (runbook):** *reescribirlo para `requirements/`:* sería un procedimiento nuevo sin ejecución real de
referencia (su valor es "escrito a partir de la ejecución del 2026-08-30"); el proceso vigente ya está en los skills.

### D-7 — Constitución, README, AGENTS.md y READMEs de capa // satisface: AC-1, CNF-1

**`docs/constitution.md`** (y copia literal en `skill-structural-pattern.md` para §7/§8/§9/§14):

| Sección | Texto nuevo |
|---|---|
| Proceso de desarrollo | "SDD con dos niveles de work item, epic y story, sobre la documentación fundacional de `product/` y `requirements/`." |
| Jerarquía de desarrollo | "La documentación fundacional (`$SPECS_BASE/product/`, `$SPECS_BASE/requirements/`) orienta las épicas; cada épica contiene varias historias." Árbol: `epic ($SPECS_BASE/specs/epics/<EPIC-NAME>/epic.md)` → `story ($SPECS_BASE/specs/stories/<STORY-NAME>/story.md)`. |
| Reglas de framework | Jerarquía `epic → story`; "project.md debe mantenerse actualizado" → "`product/` y `requirements/` deben mantenerse actualizados (documentos vivos): visión, stakeholders, requisitos y roadmap reflejan el estado actual del producto". |
| §7 IDs | Filas `Épica EPIC-NN-kebab` y `Historia STORY-NNN-kebab`; línea "Los requisitos usan `FR-NNN`/`NFR-NNN` y no son work items". |
| §8 Frontmatter | Esquema de STORY-113 D-6: `type: epic \| story \| product \| requirement \| srs \| wiki`; `id: EPIC-NN \| STORY-NNN \| FR-NNN \| NFR-NNN`; `kind: feat \| fix \| chore \| hotfix` (story) `\| functional \| non-functional` (requirement); `parent: null \| EPIC-NN`; "Los campos obligatorios por `type` los fija `header-aggregation`". |
| §9 WIP | "Control WIP = 1 por nivel de work item: solo una épica y una historia pueden tener `substatus: IN-PROGRESS` a la vez en su nivel. La documentación fundacional no tiene WIP: su avance lo decide el estado de las capas." |
| §13 Rutas | `product/vision.md`, `product/stakeholders.md`, `product/roadmap.md` → documentación fundacional; `requirements/functional/FR-NNN-<slug>.md`, `requirements/non-functional/NFR-NNN-<slug>.md` → requisitos; `specs/epics/<EPIC-NN>-<slug>/epic.md`; `specs/stories/<STORY-NNN>-<slug>/story.md`. |

**`README.md`:** tabla de niveles: fila "Producto (estratégico) · Entender qué se construye y por qué · `/project-flow` ·
`product/vision.md`, `product/stakeholders.md`, `requirements/`, `product/roadmap.md`"; l. 112 y l. 119 `project-plan.md` →
`product/roadmap.md`; árbol "Artefactos que deja el flujo" con `product/`, `requirements/{functional,non-functional}/`,
`architecture/c4/`, `domains/` (corrige `domain/`), `specs/epics/`, `specs/stories/`; bloque de migración: nuevo
`<details><summary>Migración a 4.0.0 (specs de dos niveles)</summary>` con dos líneas y enlace a la guía de D-8, y en la tabla
1.x la fila `docs/specs/projects/` apunta a "`docs/product/` + `docs/requirements/` (ver guía de migración)".

**`AGENTS.md`** (regla de veracidad: verificar con `ls docs/` antes de editar): árbol con
`├── product/  # Visión, stakeholders, objetivos, roadmap y story map (nivel estratégico)` y `specs/{epics,stories}/`; línea WIP
→ "(épica o story)". La línea 13 ya la corrige STORY-104 (T009).

**`docs/specs/README.md`** (este repo): mismo texto que la semilla de STORY-115 D-4 (dos niveles, árbol, remisión a `product/`
y `requirements/`). **`docs/product/README.md`**: "Convención de nombres" = semilla de STORY-115 D-3 (cuatro documentos fijos
incluido `roadmap.md`; `story-map.md` como documento de contexto) y la regla del roadmap. Se copian los textos de las semillas
para que repo y scaffold no diverjan (P3).

**Alternativa rechazada:** *dejar AGENTS.md fuera por no estar en la lista de la historia:* es el primer documento que lee un
agente y su regla de WIP seguiría nombrando un nivel inexistente (CR-001).

### D-8 — Guía de migración y entrada BREAKING del CHANGELOG // satisface: AC-3, CNF-1

**Guía:** `docs/guides/artifact-directory-migration.md` (nota de la historia: una sección de la guía existente). Título del
documento → "Guía de migración de la estructura de artefactos SDDF" (slug sin cambios). Nueva sección **primera**:
`## Migración a 4.0.0 — specs/ de dos niveles`:

| Bloque | Contenido |
|---|---|
| Qué cambia | Tabla origen → destino = mapa de STORY-114 D-4 resumido: `project-intent.md` → `product/vision.md`; `project.md` → `product/stakeholders.md` + `requirements/functional/FR-NNN-*.md` + `requirements/non-functional/NFR-NNN-*.md`; `project-plan.md` → `product/roadmap.md` (`## Objetivo` → `product/objectives.md`); `story-map.md` → `product/story-map.md`; `*.puml` → `architecture/c4/`; `specs/02-epics/` → `specs/epics/`; `specs/03-stories/` → `specs/stories/`. |
| Pasos | 1. Commit de respaldo. 2. `npx agile-sddf install --force` (instala `memory-system` con el modo nuevo y los skills de proyecto actualizados). 3. **`/memory-system migrate --from=specs-3-levels --dry-run`**: revisar `[MOVERÍA]`/`[CREARÍA]`/`[NO MIGRADO]` y `cambios pendientes: N`. 4. Resolver cada `[NO MIGRADO]` (secciones sin destino, varios `PROJ-*`). 5. **`/memory-system migrate --from=specs-3-levels`** (sin `--dry-run`). 6. Repetir el paso 3 hasta `cambios pendientes: 0`. 7. Borrar a mano los templates centrales retirados (`project-intent-`, `project-`, `project-plan-template.md`: ningún modo borra templates) y crear los nuevos con `/sddf-init` (copia-si-falta). 8. `/memory-system check`. 9. Si también migras épicas v1, sigue la guía de épicas del CHANGELOG después. |
| Repositorios con varios proyectos | No soportado por ADR-0013: un `docs/` por proyecto; la migración lo informa como `[NO MIGRADO]` y no escribe. |

Las secciones actuales pasan, sin cambios de contenido, bajo `## Migración histórica 1.x → 2.x`, con una línea inicial: "Su
destino `01-projects/` quedó reemplazado en 4.0.0; tras aplicarla, sigue la sección anterior".

**CHANGELOG** (`[Unreleased]`, primera subsección, antes de `### Changed`):

- Encabezado: `### BREAKING — specs/ de dos niveles (requiere 4.0.0)`.
- Párrafo: "Se elimina `specs/01-projects/` y se quitan los prefijos numéricos de `specs/` (ADR-0013, EPIC-21). Requiere la
  versión major **4.0.0**."
- **Rutas:** `specs/01-projects/` eliminado; `specs/02-epics/` → `specs/epics/`; `specs/03-stories/` → `specs/stories/`.
- **Nuevos hogares:** la tabla de la guía en forma de lista (mismos siete destinos).
- **Templates:** `project-intent-template.md` → `vision-template.md`; `project-template.md` → `stakeholders-template.md` +
  `requirement-template.md`; `project-plan-template.md` → `roadmap-template.md`.
- **Skills cuyo output cambió:** `/project-begin`, `/project-discovery`, `/reverse-engineering`, `/project-planning`,
  `/epic-from-project-plan` (lee `product/roadmap.md`), `/project-story-mapping`, `/project-context-diagram`, `/project-flow`,
  `/sddf-init`, `/header-aggregation`, `/memory-system` (`scaffold`, `migrate --from=specs-3-levels`). La lista se contrasta al
  implementar con las entradas `[Unreleased]` de STORY-109…115 (contrato #5).
- **Guía:** "Migra con [la guía de migración a 4.0.0](docs/guides/artifact-directory-migration.md): primero
  `/memory-system migrate --from=specs-3-levels --dry-run`, luego sin `--dry-run`."

Las entradas detalladas de STORY-109…115 se quedan en `### Changed`/`### Added`; la sección BREAKING es el resumen de ruptura
y no las repite.

**Alternativas rechazadas:**

- *Guía nueva `guides/migration-4.0.md`:* la nota de la historia prefiere una sección de la guía existente, que ya es el
  destino de la tabla del README; una segunda guía de migración de estructura partiría el tema.
- *Pasos completos dentro del CHANGELOG (como la guía de épicas):* `check-doc-links` excluye `CHANGELOG.md`, así que los pasos
  no se verifican allí; la guía sí está en raíces activas.
- *Bullets `**BREAKING —**` dentro de `### Changed` sin subsección propia:* AC-3 pide "una sección BREAKING".

### D-9 — Ciclo de vida de los ADR // satisface: AC-2, CNF-1

**ADR-0013** (`PROPOSED`, por tanto editable; las ediciones se hacen **antes** de pasar a `ACCEPTED`, en el mismo commit):

| Cambio | Detalle |
|---|---|
| Frontmatter | `status: ACCEPTED` · `supersedes: ADR-0004` (`date` sin cambios). |
| Referencias rotas | `[[ADR-0001]]` → `[[centralizar-templates-compartidos]]`, `[[ADR-0007]]` → `[[templates-como-capa-propia]]`, `[[ADR-0010]]` → `[[specs-dentro-de-docs]]`, `[[ADR-0011]]` → `[[archivos-canonicos-por-tipo]]`; "(a actualizar)" se quita de `[[domain-work-item-hierarchy]]`. |
| Coherencia previa a la aceptación | Rationale 6: "Intent-First" → "Spec-First" (término de `sdd.md` y la constitución). Consecuencias: "(optativo)" → "la implementa `memory-system migrate --from=specs-3-levels`"; "si se decide renumerar…" → "el renombrado de `02-epics/`/`03-stories/` obliga a actualizar los skills con rutas". Se elimina el párrafo conversacional final ("Tu observación cierra el círculo…"); la tabla `🏁 Resumen` se conserva. |

**ADR-0004** (`ACCEPTED`): cambios permitidos por la convención (D-9, `adr/README.md`) y por el precedente ADR-0001:

- Frontmatter: `status: SUPERSEDED`, `superseded-by: ADR-0013`.
- Nota visible bajo el `#`: `> **Superado parcialmente por [ADR-0013](ADR-0013-eliminar-specs-01-projects.md) (<fecha>):** los
  directorios numerados (`01-projects/`, `02-epics/`, `03-stories/`) se reemplazan por `specs/epics/` y `specs/stories/`, y el
  nivel Project deja de ser work item. Siguen vigentes sin cambios: el nivel L2 se llama **épica** (`EPIC-NN`, `epic.md`,
  skills `epic-*`) y «release» queda reservado para CI/CD.` El cuerpo no cambia.

**`adr/README.md`:**

- Convención "Inmutabilidad": "… se actualizan `status` y `superseded-by` del antiguo y se añade una nota visible de reemplazo
  bajo su título (únicos cambios permitidos)" (refleja la práctica de ADR-0001 y AC-2).
- Índice: fila ADR-0004 → `SUPERSEDED → [ADR-0013](…)`; filas nuevas ADR-0010, ADR-0011 y ADR-0012 (`PROPOSED`, título y fecha
  de su frontmatter) y ADR-0013 (`ACCEPTED`, 2026-10-05). El índice queda completo hasta ADR-0013.

**Alternativas rechazadas:**

- *ADR-0004 `ACCEPTED` con `superseded-by: ADR-0013`:* el README define `superseded-by` solo para `SUPERSEDED`; el precedente
  ADR-0001 (reemplazo parcial) usa `SUPERSEDED` + nota de lo vigente.
- *Nuevo ADR solo para "el L2 es épica":* duplica una decisión que nadie cuestiona; la nota la mantiene visible.
- *Cambiar el slug de ADR-0013 a `ADR-0013-eliminar-specs-01-projects`* (para resolver los wikilinks rotos de las historias):
  rompe la convención de slugs de ADR y los `[[eliminar-specs-01-projects]]` ya escritos (STORY-104 D-2, diseños hermanos).
- *Añadir solo la fila de ADR-0013 al índice:* dejaría un hueco 0010-0012 en un índice que se presenta como completo.

### D-10 — Wikilinks hacia los nodos reemplazados // satisface: CNF-1, CNF-2

- Todo `[[domain-project-lifecycle]]` en documentos vivos (`domains/README.md` ×3, `domain-work-item-hierarchy.md`,
  `domain-story-lifecycle.md`, `domain-state-management.md` ×2, `domain-knowledge-artifacts.md`, `domain-epic-lifecycle.md`) se
  repunta a `[[domain-foundational-docs-lifecycle]]`. Solo lo conservan el sucesor (como predecesor) y el propio documento
  retirado.
- `[[PROJ-01-agile-sddf]]` solo se elimina del runbook (D-6). El de ADR-0006 (`ACCEPTED`) queda roto: es un registro inmutable
  (Non-Goal) y entra en la línea base (CR-002).
- `docs/index.md` se regenera con `node skills/memory-system/scripts/memory-system.js index --root docs` al final (incluye el
  nodo nuevo, quita los nodos de `01-projects` si STORY-115 retiró la sección).

### D-11 — Regex `canonical` de `check-doc-links.js` // satisface: CNF-1

- `scripts/check-doc-links.js:172`: `/(?:^|[\\/])(story|epic|project|project-intent|project-plan)\.md$/i` →
  `/(?:^|[\\/])(story|epic)\.md$/i`. Los tres nombres retirados ya no existen como archivos canónicos.
- `test/check-doc-links.test.js`: caso nuevo `slugIndex prefiere epic.md/story.md ante slugs duplicados y no trata project.md
  como canónico` (dos archivos con el mismo slug, uno `epic.md` → resuelve al `epic.md`; dos con el mismo slug, uno
  `project.md` y otro `notes.md` → ambos se conservan como duplicados). Si `slugIndex` no se exporta, se exporta junto a las
  funciones que ya use el test (sin cambiar su firma).

**Alternativas rechazadas:** *dejar el regex:* código muerto que nombra el modelo retirado, asignado aquí por STORY-109 CR-003 y
STORY-111; *eliminar la preferencia de canónicos:* cambia la resolución de duplicados de épicas e historias (fuera de alcance).

### D-12 — Verificación de enlaces por línea base // satisface: CNF-1, CNF-3

- **Antes** de editar: guardar `npm run verify:links` y `memory-system check --root docs` en
  `.tmp/story-implement/STORY-116/links-baseline.txt` (no versionado).
- **Después:** `verify:links` exit 0 (los dos errores actuales desaparecen: guía de STORY-119 por D-6 y placeholder de
  `docs/index.md` por el prerrequisito de STORY-105); `memory-system check` sin ninguna línea `[broken-wikilink]` cuyo origen
  sea un archivo de "Componentes afectados" ni cuyo destino sea `domain-project-lifecycle`, `domain-foundational-docs-lifecycle`
  o un slug de ADR; recuento `broken-wikilink` ≤ línea base.
- Encoding: cada archivo tocado sin BOM (`EF BB BF`) y sin `Ã`/`ðŸ`; saltos de línea como el archivo original.

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Jerarquía de work items | modificar | `docs/domains/domain-work-item-hierarchy.md` | AC-1 |
| Ciclo de vida de Project | marcar `superseded` | `docs/domains/domain-project-lifecycle.md` | AC-1, CNF-2 |
| Ciclo de vida de la documentación fundacional | crear | `docs/domains/domain-foundational-docs-lifecycle.md` | AC-1, CNF-2 |
| Resto de dominios | modificar | `docs/domains/{README,domain-state-management,domain-epic-lifecycle,domain-story-lifecycle,domain-knowledge-artifacts,domain}.md` | AC-1, CNF-1 |
| Máquina de estados | modificar | `docs/architecture/state-machine.md` | AC-1 |
| Sistema de memoria | modificar | `docs/architecture/memory-system.md` | AC-1 |
| Arquitectura SDDF | modificar | `docs/architecture/sddf-architecture.md` | AC-1 |
| Guías | modificar | `docs/guides/{flight-leves-model,organization-of-artifacts,sddf-commands-pipeline,skill-structural-pattern,orchestrator-subagent-pattern}.md` | AC-1, CNF-1 |
| Guía de migración | modificar | `docs/guides/artifact-directory-migration.md` | AC-3 |
| Runbook de `project.md` | marcar `superseded` | `docs/runbooks/actualizar-spec-de-proyecto.md` | CNF-2, CNF-1 |
| Constitución | modificar | `docs/constitution.md` | AC-1 |
| READMEs de capa (este repo) | modificar | `docs/specs/README.md`, `docs/product/README.md` | AC-1 |
| README y AGENTS | modificar | `README.md`, `AGENTS.md` | AC-1, AC-3 |
| CHANGELOG | modificar (`[Unreleased]`) | `CHANGELOG.md` | AC-3 |
| ADR-0013 | modificar y aceptar | `docs/adr/ADR-0013-eliminar-specs-01-projects.md` | AC-2, CNF-1 |
| ADR-0004 | marcar `SUPERSEDED` + nota | `docs/adr/ADR-0004-nivel-l2-epic-y-directorios-numerados.md` | AC-2 |
| Índice de ADRs | modificar | `docs/adr/README.md` | AC-2 |
| Verificador de enlaces | modificar | `scripts/check-doc-links.js` (regex `canonical`) | CNF-1 |
| Prueba del verificador | modificar | `test/check-doc-links.test.js` | CNF-1 |
| Índice wiki | regenerar | `docs/index.md` | CNF-1 |

`package.json › files` no cambia (solo documentación y un script ya publicado).

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Frontmatter de documento reemplazado | `status: superseded` + `superseded-by: <slug del sucesor>` + nota `> **Reemplazado por [[<sucesor>]] …**` bajo el `#` | CNF-2 |
| Frontmatter del sucesor | `status: active` + `supersedes: domain-project-lifecycle` (bidireccional, invariante 15 de `domain-knowledge-artifacts`) | CNF-2 |
| Frontmatter de ADR reemplazado | `status: SUPERSEDED` + `superseded-by: ADR-NNNN` + nota `> **Superado (parcialmente) por …**` | AC-2 |
| Frontmatter de ADR que reemplaza | `status: ACCEPTED` + `supersedes: ADR-0004` | AC-2 |
| Sección BREAKING | `### BREAKING — specs/ de dos niveles (requiere 4.0.0)` dentro de `## [Unreleased]`, con enlace relativo `docs/guides/artifact-directory-migration.md` | AC-3 |
| Wikilinks a ADR | Slug del frontmatter del ADR (sin prefijo `ADR-NNNN-`) | CNF-1 |
| `slugIndex(files)` | Firma y retorno sin cambios; canónicos = `story.md`, `epic.md` | CNF-1 |

Dependencias entre documentos (sin ciclos): `domain-foundational-docs-lifecycle` → `domain-state-management`, `state-machine`,
`domain-work-item-hierarchy`; `state-machine` → (tabla de fases, texto) ← `sddf-commands-pipeline`; `CHANGELOG` →
`artifact-directory-migration`; `ADR-0004` ↔ `ADR-0013` (supersedes / superseded-by).

## Esquema de datos

Árbol de `docs/domains/` resultante:

```
README.md · domain.md · domain-skills-map.md
domain-work-item-hierarchy.md            (activo, reescrito)
domain-state-management.md               (activo)
domain-foundational-docs-lifecycle.md    (nuevo, status: active, supersedes: domain-project-lifecycle)
domain-project-lifecycle.md              (status: superseded, superseded-by: domain-foundational-docs-lifecycle)
domain-epic-lifecycle.md · domain-story-lifecycle.md · domain-knowledge-artifacts.md
```

## Flujos clave

### F-1 — Lector que aprende el modelo (AC-1)

`README.md` (tabla de niveles) → `[[domain-work-item-hierarchy]]` (tabla canónica de D-1) →
`[[domain-foundational-docs-lifecycle]]` (etapas y salidas) → `[[state-machine]]` (misma tabla de fases). Si llega por un
enlace antiguo a `[[domain-project-lifecycle]]`, la nota de reemplazo lo envía al sucesor.

### F-2 — Usuario que actualiza un repo 3.x (AC-3)

`CHANGELOG.md › [Unreleased] › BREAKING` → guía `artifact-directory-migration.md › Migración a 4.0.0` → reinstalar →
`migrate --dry-run` → resolver `[NO MIGRADO]` → `migrate` → `check`.

### F-3 — Cierre de ADR (AC-2)

Editar ADR-0013 (coherencia + referencias) → `ACCEPTED` + `supersedes` → ADR-0004 `SUPERSEDED` + nota → índice. Un solo commit
para que nunca exista un ADR-0004 reemplazado por un ADR aún `PROPOSED`.

### F-4 — Degradación (precondiciones de EPIC-21 incumplidas)

- `docs/specs/01-projects/` aún existe o STORY-108 no está integrada: no se implementa; la historia depende de STORY-104…115
  (EPIC-21) y AC-1 describiría rutas inexistentes.
- `SHARED_TEMPLATES` no coincide con los templates de STORY-109…111 (alguna sin integrar): `memory-system.md` y el CHANGELOG
  nombran solo los templates que el motor declara; el resto se registra en `implement-report.md` como pendiente.
- `memory-system index` falla (exit 2) por una capa sin placeholder: se reporta y no se regenera `docs/index.md`; los
  contratos #7-#8 quedan en rojo hasta corregir la historia responsable (STORY-115).

## Decisiones de complejidad justificada

- **Documento de dominio nuevo** en lugar de editar el existente: necesario por CNF-2 (regla de reemplazo) y porque el slug del
  existente nombra un agregado que ya no existe; coste = un archivo y ~10 wikilinks repuntados.
- **Cambio de código en `check-doc-links.js`** dentro de una historia de documentación: una línea más un caso de prueba,
  asignada aquí por dos historias hermanas; dejarla crea deuda sin dueño.
- **Ediciones de ADR-0013 antes de aceptarlo:** tras `ACCEPTED` es inmutable; corregir después exigiría otro ADR.
- **Índice de ADRs completado (0010-0012):** tres filas; sin ellas el índice afirma un estado falso (veracidad de AGENTS.md).
- Nada más: no se añade tooling, ni plantillas, ni verificaciones automáticas nuevas; la verificación usa los comandos
  existentes (`verify:links`, `memory-system check`, `node --test`, `git grep`).

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Sin Project como work item | `git grep -n -E "PROJ-\|01-projects\|Project \(L3\)\|work item de nivel L3" -- docs/domains docs/architecture/state-machine.md docs/architecture/memory-system.md docs/architecture/sddf-architecture.md docs/guides/flight-leves-model.md docs/guides/organization-of-artifacts.md docs/guides/sddf-commands-pipeline.md docs/guides/skill-structural-pattern.md docs/constitution.md README.md AGENTS.md docs/specs/README.md ':!docs/domains/domain-project-lifecycle.md'` → toda coincidencia contiene `eliminar-specs-01-projects`, `ADR-0013`, `migrate --from=specs-3-levels` o `sin migrar` | AC-1 |
| 2 | Jerarquía documentada | Los seis documentos de AC-1 contienen `product/` + `requirements/`, `specs/epics/` y `specs/stories/` (`grep -c`); `domain-project-lifecycle.md` tiene `status: superseded` | AC-1, CNF-2 |
| 3 | Tabla de fases | `grep -n "product/vision.md" ` + `stakeholders.md` + `requirements/` + `product/roadmap.md` en la tabla de `domain-foundational-docs-lifecycle.md` §5, `state-machine.md` y `sddf-commands-pipeline.md` §1 | AC-1 |
| 4 | ADR | `grep -E "^(status\|supersedes\|superseded-by):"` en ADR-0013 → `ACCEPTED`, `ADR-0004`; en ADR-0004 → `SUPERSEDED`, `ADR-0013`; ADR-0004 contiene la nota `Superado parcialmente por`; `adr/README.md` tiene filas ADR-0004 (`SUPERSEDED → ADR-0013`) y ADR-0013 (`ACCEPTED`) | AC-2 |
| 5 | CHANGELOG | Dentro de `## [Unreleased]`: `### BREAKING`, `4.0.0`, `specs/01-projects/`, `product/vision.md`, `specs/epics/`, `docs/guides/artifact-directory-migration.md`; cada skill de la lista aparece también en alguna entrada `[Unreleased]` de STORY-109…115 | AC-3 |
| 6 | Guía | `artifact-directory-migration.md` contiene `/memory-system migrate --from=specs-3-levels --dry-run` antes que `/memory-system migrate --from=specs-3-levels` sin `--dry-run`; la lista de templates de `memory-system.md` coincide con `SHARED_TEMPLATES` | AC-3, AC-1 |
| 7 | Enlaces | `npm run verify:links` exit 0; `memory-system check --root docs` sin `[broken-wikilink]` con origen en "Componentes afectados" ni destino en los slugs de D-10/D-9; `broken-wikilink` ≤ línea base (D-12) | CNF-1 |
| 8 | Índice | `node skills/memory-system/scripts/memory-system.js index --root docs` exit 0; `docs/index.md` contiene `[[domain-foundational-docs-lifecycle]]` | CNF-1 |
| 9 | Verificador | `node --test test/check-doc-links.test.js` y `npm test` exit 0 | CNF-1 |
| 10 | Encoding | Para cada archivo tocado: primeros 3 bytes ≠ `EF BB BF`; `grep -c "Ã\|ðŸ"` = 0 | CNF-3 |

## Risks / Trade-offs

- [El motor conserva `project.md` en `CANONICAL_FILES` y `project` en `SPEC_TYPES`] → `memory-system.md` lo describe como
  soporte de repos sin migrar (texto verdadero). Retirarlo es una decisión del motor, no de documentación; si STORY-117 lo
  exige para su grep de cierre, se abre una historia.
- [Los wikilinks `[[ADR-0013-eliminar-specs-01-projects]]` de las historias de EPIC-21 siguen rotos] → Son registros que estarán
  cerrados al implementar (Non-Goal); verificación por línea base (CR-002).
- [Dos textos paralelos: constitución y `skill-structural-pattern.md`] → Se copian literalmente en el mismo commit; divergencia
  futura posible (preexistente).
- [Un lector con enlaces externos a `#nivel-project` de `state-machine.md`] → El ancla desaparece; aceptado (documento vivo).
- [La lista de skills del BREAKING diverge de lo realmente integrado] → Contrato #5 la contrasta con las entradas de las historias.
- [STORY-117 encuentra "Intent-First" en `epic.md`] → Fuera de alcance; ADR-0013 ya queda alineado.

## Open Questions

Ninguna. Las ambigüedades se resolvieron en las decisiones y quedan registradas como CR.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: el diseño incluye piezas que `story.md` no nombra pero que las historias hermanas asignan aquí o que quedarían
  falsas: `scripts/check-doc-links.js` + su prueba (STORY-109 CR-003, STORY-111), constitución §8/§9 y el rol de `project-flow`
  (STORY-113 CR-003), `AGENTS.md` (árbol y regla WIP), `docs/product/README.md`, `docs/adr/README.md` completo (0010-0012) y el
  enlace roto de `orchestrator-subagent-pattern.md`.
- **Documento afectado**: story.md
- **Acción requerida**: añadir a "Notas / contexto adicional" la lista de piezas extra (D-6, D-7, D-9, D-11) para que
  `story-analyze` y la aceptación las reconozcan como alcance.

### CR-002
- **Tipo**: ambigüedad
- **Descripción**: CNF-1 ("`memory-system check` termina sin enlaces ni wikilinks rotos") no es alcanzable en términos absolutos
  sin reescribir registros históricos: la línea base tiene 48 `broken-wikilink`, 31 de ellos `[[ADR-0013-eliminar-specs-01-projects]]`
  en historias de EPIC-21 que estarán cerradas al implementar, más los de EPIC-17, EPIC-20, STORY-053, STORY-103 y ADR-0006
  (`[[PROJ-01-agile-sddf]]`, roto tras eliminar `01-projects/`).
- **Documento afectado**: story.md (y criterio de salida de EPIC-21 "`memory-system check` devuelve exit code 0", verificado
  por STORY-117)
- **Acción requerida**: precisar CNF-1 como "sin enlaces rotos nuevos ni con origen en los archivos modificados; `verify:links`
  exit 0" (D-12). Para el criterio de salida de la épica, decidir en STORY-117 entre corregir los wikilinks de registros
  cerrados (excepción explícita a la regla de congelado) o excluir registros históricos del recuento de `check`.

### CR-003
- **Tipo**: ambigüedad
- **Descripción**: la convención de `adr/README.md` permite actualizar solo `superseded-by` de un ADR aceptado, pero AC-2 exige
  además una nota visible (y la práctica de ADR-0001 ya cambia `status` y añade nota).
- **Documento afectado**: design.md (resuelto aquí)
- **Acción requerida**: ninguna en la historia; D-9 actualiza la convención para que documente la práctica vigente (`status`,
  `superseded-by` y nota de reemplazo).
