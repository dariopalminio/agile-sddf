---
alwaysApply: false
type: design
id: STORY-187
slug: STORY-187-dominio-y-requisitos-sin-buffers-design
title: "Design: Dominio, requisitos y máquina de estados sin buffers"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-029-eliminar-estados-buffer
story: STORY-187
created: 2026-11-13
updated: 2026-11-13
related:
  - STORY-187-dominio-y-requisitos-sin-buffers
  - EPIC-029-eliminar-estados-buffer
  - STORY-186-adr-de-workflows-sin-estados-buffer
---

<!-- Referencias -->
[[STORY-187-dominio-y-requisitos-sin-buffers]] · [[EPIC-029-eliminar-estados-buffer]] · [[STORY-186-adr-de-workflows-sin-estados-buffer]]

## Context

EPIC-029 retira los estados buffer `READY-FOR-IMPLEMENT` y `READY-FOR-DEV`. STORY-186 registra la decisión en **ADR-0022** (`docs/adr/ADR-0022-workflows-sin-estados-buffer.md`, slug `workflows-sin-estados-buffer`, según su `design.md`, D-01). Esta historia alinea con ese ADR los diez documentos de autoridad que describen el ciclo de vida: cinco de `docs/domains/`, `docs/architecture/state-machine.md`, NFR-006 y FR-043/044/045.

Estado actual verificado en el filesystem (2026-11-13, `grep -c "READY-FOR-IMPLEMENT\|READY-FOR-DEV"`):

| Documento | Menciones | Además |
|---|---|---|
| `docs/domains/domain-story-lifecycle.md` | 14 | glosario «Buffer (READY-FOR-IMPLEMENT)», VO `WipLimit` en el buffer, invariantes 6 y 7, fila «WIP Limit» en §8, cita a ADR-0008 en «Rework» |
| `docs/domains/domain-epic-lifecycle.md` | 11 | glosario «Buffer (READY-FOR-DEV)», VO `WipLimit`, invariantes 2 y 7, gate de integridad `PLAN → READY-FOR-DEV`, fila «WIP Limit» |
| `docs/architecture/state-machine.md` | 11 | dos diagramas Mermaid con alias `RFI`/`RFD`, dos tablas de estados, tabla de transiciones por skill |
| `docs/domains/domain.md` | 3 | glosario «WIP … en un buffer» (línea 82), BR-004 con «buffers», pregunta cerrada «buffers L2/L1 configurables?» |
| `docs/domains/domain-state-management.md` | 2 | glosario «WIP Limit» y «Buffer», VO `WipLimit` por buffer, invariante 5, fila `BUFFER` de «Fases compartidas», §5.3 con cita a ADR-0008, gate de capacidad «en un buffer» |
| `docs/requirements/non-functional/NFR-006-…md` | 2 | los dos workflows en `## Descripción` |
| `docs/domains/domain-skills-map.md` | 1 | fila `epic-analyze` («antes de aprobar `READY-FOR-DEV`»); **no tiene sección de historia** |
| `FR-043`, `FR-044`, `FR-045` | 1 cada uno | el retroceso a `READY-FOR-IMPLEMENT/DONE` en `## Descripción` |

Otras restricciones verificadas:

- `scripts/check-doc-links.js` (línea 146) valida que cada `[[wikilink]]` resuelva a un archivo existente. Citar `[[workflows-sin-estados-buffer]]` exige que ADR-0022 exista: **STORY-186 debe estar implementada antes de implementar esta historia**.
- La constitución §9 limita solo `substatus: IN-PROGRESS` y no nombra los buffers (`grep -n "WIP\|READY-FOR" docs/constitution.md` → solo la línea 201-203). Su encabezado dice «WIP = 2» y su texto «una épica y una historia»: esa incoherencia no es de esta historia, así que los documentos citan «constitución §9» sin repetir el número.
- `test/epic-validate-gateway.test.js` lee `state-machine.md` y exige **una sola** línea que empiece por el prefijo del gateway de `epic-validate`. Esta historia no toca esa línea.
- `scripts/verify-fixed-layout.js` incluye `docs/domains/domain.md` en `ACTIVE_DOCS` (comprueba tokens de layout legado). Las ediciones de `domain.md` no añaden ninguno.
- `docs/requirements/index.md` lista FR-043/044/045 y NFR-006 por título; los títulos no cambian, así que el índice no se toca.
- `domain-story-lifecycle.md`, `domain-epic-lifecycle.md` y `domain-state-management.md` no tienen `updated:` en el frontmatter; `domain.md`, `domain-skills-map.md`, `state-machine.md`, NFR-006 y los tres FR sí lo tienen.
- Las salidas actuales de los gates (`skills/story-verify/SKILL.md` y `skills/story-acceptance/SKILL.md`, `## Salida`) todavía escriben `READY-FOR-IMPLEMENT/DONE`. Los documentos de esta historia describen el **comportamiento destino** fijado por el ADR (CNF-2); STORY-188 a STORY-191 alinean los skills.

La historia es `kind: chore` documental: no cambia código, skills, scripts ni tests.

## Goals / Non-Goals

**Goals:**

- Los diez documentos declaran los workflows del ADR-0022 y lo citan como fuente. // satisface: AC-1
- El `NEEDS-CHANGES` de los tres gates lleva a `IMPLEMENT/TODO`, sin estado ni substatus de rework, con `fix-directives.md` como señal. // satisface: AC-2
- `story-analyze` con `APPROVED` escribe `PLAN/DONE`, y la aprobación de épica es `PLAN/DONE` escrita a mano. // satisface: AC-1, AC-2
- La cola de listos se describe como una consulta (`IMPLEMENT/TODO` primero, después `PLAN/DONE`), `TODO` significa «pendiente de iniciar» en cualquier estado activo y ninguna invariante, gate ni VO define un WIP de cola. // satisface: AC-3
- Cero menciones de `READY-FOR-IMPLEMENT` y `READY-FOR-DEV` en los diez documentos, y gate verde. // satisface: CNF-2, CNF-3, CNF-4

**Non-Goals:**

- `docs/architecture/sdcl-sddf.md`, el diagrama `flowchart-skill-story-flow-relationships.mermaid`, `docs/guides/`, `README.md` y `docs/product/objectives.md` (STORY-193).
- Cambiar skills, evals, plantillas o scripts (STORY-188 a STORY-192).
- Editar ADR-0003, ADR-0006, ADR-0008, `CHANGELOG.md`, `docs/product/roadmap.md` o `specs/flow/archive/`.
- Corregir defectos ajenos a los buffers que aparecen en los mismos documentos (por ejemplo, `review.md` en `domain-story-lifecycle` §9, `SDDF_ROOT` en `domain.md`, el número de WIP de la constitución), salvo cuando están en la misma frase que se reescribe (D-08).
- Añadir filas a la tabla de transiciones de `state-machine.md` para skills que hoy no aparecen (`story-implement-tasks`).
- Describir la ventana de transición o el valor legado: eso vive en el ADR y en los skills (CNF-2).

## Componentes afectados

| # | Componente | Acción | Ubicación | Satisface |
|---|---|---|---|---|
| C-1 | Ciclo de vida de Story | modificar §2, §3, §4.1–4.3, §5, §6, §7, §8, §10, §11 | `docs/domains/domain-story-lifecycle.md` | AC-1, AC-2, AC-3 |
| C-2 | Ciclo de vida de Epic | modificar §2, §3, §4.1–4.3, §5, §6, §7, §8, §10, §11 | `docs/domains/domain-epic-lifecycle.md` | AC-1, AC-3 |
| C-3 | Gestión de estados (transversal) | modificar §2, §3, §4, «Fases compartidas», §5.3, §5.5 nueva, §6, §8, §9 | `docs/domains/domain-state-management.md` | AC-2, AC-3 |
| C-4 | Máquina de estados | modificar nivel STORY (diagrama, happy path, tablas) y nivel ÉPICA (diagrama, happy path, tabla, párrafo de aprobación) y «Fuentes de verdad» | `docs/architecture/state-machine.md` | AC-1, AC-2 |
| C-5 | Dominio raíz | modificar glosario «WIP», «State Models», «Flow Catalog» paso 4, BR-004, pregunta cerrada y `## Changelog` | `docs/domains/domain.md` | AC-1, AC-3 |
| C-6 | Mapa de skills | modificar fila `epic-analyze`; crear sección `## Historia (L1)` con 4 filas | `docs/domains/domain-skills-map.md` | AC-2 |
| C-7 | NFR-006 | modificar `## Descripción` | `docs/requirements/non-functional/NFR-006-control-de-ciclo-de-vida-con-status-substatus.md` | AC-2 |
| C-8 | FR-043 | modificar `## Descripción` | `docs/requirements/functional/FR-043-revision-de-codigo-multi-agente-gate-del-dod-code.md` | AC-2 |
| C-9 | FR-044 | modificar `## Descripción` | `docs/requirements/functional/FR-044-verificacion-por-ejecucion-de-pruebas-fase-verify.md` | AC-2 |
| C-10 | FR-045 | modificar `## Descripción` | `docs/requirements/functional/FR-045-aceptacion-humana-final-fase-acceptance.md` | AC-2 |

P3: no se crea ningún documento. Se reutilizan la cita `[[slug]]` que ya usan los documentos para ADR-0003 (`[[workflow-canonico-story-y-epic]]`), la tabla de `domain-skills-map.md` y la forma de `## Changelog` de `domain.md`.

## Interfaces

| Interfaz | Contrato | Satisface |
|---|---|---|
| Cita del ADR | `[[workflows-sin-estados-buffer]]` (ADR-0022). Va en la sección que declara el workflow o la transición y en «Fuentes de verdad» / «Referencias cruzadas» cuando el documento las tiene | AC-1 |
| Workflow de historia (literal) | `SPECIFY → PLAN → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE → DELIVER → COMPLETED` | AC-1 |
| Workflow de épica (literal) | `DEFINE → PLAN → DEVELOP → VALIDATE → SHIP → COMPLETED` | AC-1 |
| Rework de historia | `NEEDS-CHANGES` de `story-code-review`, `story-verify` o `story-acceptance` → `IMPLEMENT/TODO` + `fix-directives.md` (con `based-on` igual al reporte del gate). Frase obligatoria en C-1 y C-3: «no existe estado ni substatus de rework» | AC-2 |
| Consulta de la cola | Literal «primero `IMPLEMENT/TODO`, después `PLAN/DONE`» y la frase «es una consulta, no un estado, un gate ni un límite WIP» | AC-3 |
| Significado de `TODO` | «pendiente de iniciar en cualquier estado activo» | AC-3 |
| WIP | El límite WIP aplica solo a `substatus: IN-PROGRESS` por nivel (constitución §9); ninguna cola tiene WIP | AC-3 |
| `updated:` | fecha de implementación en los documentos que ya tienen el campo (C-4, C-5, C-6, C-7, C-8, C-9, C-10); no se añade el campo donde no existe | CNF-4 |

## Decisions

### D-01 — Forma de citar el ADR // satisface: AC-1

- **Elegida:** wikilink `[[workflows-sin-estados-buffer]]` con el identificador «ADR-0022» en el texto, en la sección que declara el workflow o la transición y en «Fuentes de verdad». Así lo validan `check-doc-links` (destino existente) y el lector (número visible).
- **Rechazadas:** (a) solo «ADR-0022» en texto: no lo valida ningún script y queda roto en silencio si cambia el número. (b) enlace Markdown relativo `[ADR-0022](../adr/ADR-0022-….md)`: los documentos de dominio usan wikilinks para los ADR, y mezclar estilos rompe la uniformidad (P5).

### D-02 — ADR-0003 y ADR-0008 en las citas existentes // satisface: AC-1, CNF-1

- **Elegida:** la línea «Decisión de arquitectura» de «Fuentes de verdad» pasa a citar ADR-0022 como fuente de los workflows y las transiciones, y conserva `[[workflow-canonico-story-y-epic]]` (ADR-0003) solo como rationale de los nombres en infinitivo, que el ADR-0022 no cambia (`state-machine.md:78`, invariante 8 de C-3). Las citas a ADR-0008 sobre la señal de rework se sustituyen por ADR-0022, que la conserva.
- **Rechazadas:** (a) mantener ADR-0003/0008 como fuentes de los workflows: ADR-0006 y ADR-0008 quedan `SUPERSEDED` y citarlos como vigentes contradice el ADR nuevo. (b) borrar toda referencia a ADR-0003: se pierde el rationale de los nombres, que sigue vigente.

### D-03 — Diagramas Mermaid sin alias de buffer // satisface: AC-1, AC-2

- **Historia (C-1 §4.2 y C-4):** se eliminan `state "READY-FOR-IMPLEMENT" as RFI` y `RFI --> CANCELED`. `PLAN --> IMPLEMENT : APPROVED (PLAN/DONE)`. `CR --> IMPLEMENT : NEEDS-CHANGES (IMPLEMENT/TODO)`, `VERIFY --> IMPLEMENT : NEEDS-CHANGES (IMPLEMENT/TODO)` y `ACCEPTANCE --> IMPLEMENT : NEEDS-CHANGES (IMPLEMENT/TODO)`. La transición `CR --> IMPLEMENT : BLOCKED (repetir revisión)` se conserva.
- **Épica (C-2 §4.2 y C-4):** se elimina `state "READY-FOR-DEV" as RFD`; `PLAN --> DEVELOP : aprobación del PO (PLAN/DONE)` en C-2 y `PLAN --> DEVELOP` en C-4 (el diagrama de C-4 no lleva etiquetas hoy).
- **Rechazadas:** (a) mantener un nodo intermedio `PLAN_DONE`: reintroduce visualmente el buffer que el ADR retira. (b) dejar el rework sin etiqueta de substatus: el lector no distingue `IMPLEMENT/TODO` del arranque normal.

### D-04 — Tablas de estados y substatus // satisface: AC-1, AC-3

- Se elimina la fila `READY-FOR-IMPLEMENT` (C-1 §5, C-4) y la fila `READY-FOR-DEV` (C-2 §5, C-4).
- La descripción de `PLAN` de historia añade «Termina en `PLAN/DONE` cuando `story-analyze` emite `APPROVED`». La de `PLAN` de épica añade «Termina en `PLAN/DONE` con la aprobación del PO, escrita a mano: ningún skill la escribe». La de `IMPLEMENT` de historia añade «`IMPLEMENT/TODO` indica un rework pendiente si existe `fix-directives.md`».
- **§6 de C-1 (Story):** filas `TODO` — «cualquier estado activo» — «pendiente de iniciar; en `IMPLEMENT/TODO` con `fix-directives.md`, rework pendiente»; `IN-PROGRESS` sin cambio; `DONE` — «todos los estados activos» — «trabajo de la etapa terminado; `PLAN/DONE` es la planificación aprobada, lista para implementar»; `BLOCKED` sin cambio.
- **§6 de C-2 (Epic):** fila `TODO` — «cualquier estado activo» — «pendiente de iniciar». La fila `DONE` añade «`PLAN/DONE` es la aprobación del PO».
- **Rechazada:** conservar en §6 una fila con el significado «en cola, esperando capacidad»: es el significado del buffer con otro nombre.

### D-05 — WIP: solo `IN-PROGRESS`, ninguna cola // satisface: AC-3, CNF-1

- **C-3:** glosario `WIP Limit` → «Límite de work items con `substatus: IN-PROGRESS` por nivel (constitución §9). No se aplica a ninguna cola». Se elimina el término `Buffer`. VO `WipLimit` → «Se define por nivel de work item y aplica solo a `IN-PROGRESS`»; en el agregado, «aplicable solo a `substatus: IN-PROGRESS`». Invariante 5 → «El WIP limit de cada nivel limita solo los work items en `IN-PROGRESS` (constitución §9); ninguna cola tiene WIP». Gate de capacidad (§6) → «Control del número máximo de work items en `IN-PROGRESS` por nivel» — ejemplo «constitución §9».
- **C-1 y C-2:** VO `WipLimit` → «aplicable solo a `substatus: IN-PROGRESS` (constitución §9)». La fila «WIP Limit» de §8 se elimina. En C-1, la invariante 7 se reescribe como la consulta de la cola (D-06). En C-2, la invariante 7 se elimina y las siguientes se renumeran: la consulta de la cola es de historias, no de épicas.
- **C-5:** glosario `WIP` → «Límite de work items en `IN-PROGRESS` por nivel; la cola de listos no tiene WIP». BR-004 → «Debe verificarse el WIP limit de `IN-PROGRESS` antes de activar un nuevo ítem por nivel (constitución §9); la cola de listos es una consulta y no tiene límite».
- **Rechazadas:** (a) eliminar el VO `WipLimit`: el límite de `IN-PROGRESS` existe (constitución §9) y el modelo táctico lo necesita. (b) repetir el número del WIP: la constitución es incoherente entre encabezado y texto, y repetirlo duplicaría una cifra que no decide esta historia (CNF-1). (c) un WIP configurable para `PLAN/DONE`: fuera de alcance de la épica.

### D-06 — La cola de listos como consulta // satisface: AC-3

- **C-3:** nueva subsección `### 5.5 Flujo de la cola de listos (consulta, no estado)` al final de §5 («Tipos de Transición»): la cola de historias listas para implementar se obtiene con la consulta «primero `IMPLEMENT/TODO`, después `PLAN/DONE`»; es una consulta, no un estado, un gate ni un límite WIP; `TODO` significa «pendiente de iniciar» en cualquier estado activo. Cita `[[workflows-sin-estados-buffer]]`. Se añade además la frase sobre `TODO` a la invariante 2.
- **C-1:** invariante 7 → «Las historias listas para implementar se consultan en este orden: primero `IMPLEMENT/TODO`, después `PLAN/DONE`. Es una consulta, no un estado ni una cola con WIP».
- **C-3 «Fases compartidas entre niveles»:** se elimina la fila `BUFFER`; el párrafo siguiente añade «No hay fase de cola: la cola de listos es una consulta (§5.5)».
- **Rechazadas:** (a) poner la consulta en `domain-story-lifecycle` solamente: AC-3 la busca en `domain-state-management`. (b) definir un «estado virtual» o `phase_type` de cola: es el buffer con otro nombre.

### D-07 — Mapa de skills con sección de historia // satisface: AC-2

- **Elegida:** crear `## Historia (L1)` tras `## Épica (L2)`, con la misma cabecera `| Skill | Momento | Lee | Escribe | Cambia estado |` y cuatro filas:

| Skill | Momento | Lee | Escribe | Cambia estado |
|---|---|---|---|---|
| `story-analyze` | `PLAN`, invocado por `story-plan` tras `story-design` y `story-tasking`/`story-testcases` | `story.md`, `design.md`, `testcases.md` y/o `tasks.md`, `docs/guardrails/dod-story-plan.md`, `epic.md` padre | `analyze.md` y `story.md` (solo `status`/`substatus`) | `PLAN/IN-PROGRESS → PLAN/DONE` (`APPROVED`) · sin cambio (`NEEDS-CHANGES`) |
| `story-code-review` | `IMPLEMENT/DONE`, antes de `story-verify` | `story.md`, `design.md`, `implement-report.md`, `testcases.md`, `tasks.md`, `constitution.md`, `dod-story-code-review.md`, `REVIEW.md` | `code-review-report.md`; `fix-directives.md` con `NEEDS-CHANGES` (lo borra con `APPROVED`) | `→ CODE-REVIEW/DONE` (`APPROVED`) · `→ IMPLEMENT/TODO` (`NEEDS-CHANGES`) · `→ IMPLEMENT/DONE` (`BLOCKED`) |
| `story-verify` | `CODE-REVIEW/DONE`, antes de `story-acceptance` | `story.md`, `dod-story-verify.md`, `sddf.config.yaml` | `verify-report.md`; `fix-directives.md` (`based-on: verify-report.md`) con `NEEDS-CHANGES` | `→ VERIFY/DONE` (`APPROVED`) · `→ IMPLEMENT/TODO` (`NEEDS-CHANGES`) · `→ VERIFY/BLOCKED` (`BLOCKED`) |
| `story-acceptance` | `VERIFY/DONE`, antes de `story-delivery` | `story.md`, `dod-story-acceptance.md`, `acceptance-report.md` previo | `acceptance-report.md`; `fix-directives.md` (`based-on: acceptance-report.md`) con `NEEDS-CHANGES` | `→ ACCEPTANCE/DONE` (`APPROVED`) · `→ IMPLEMENT/TODO` (`NEEDS-CHANGES`) · `→ ACCEPTANCE/BLOCKED` (`BLOCKED`) |

  Las columnas «Lee» salen de `## Entrada` de cada `SKILL.md` (verificado el 2026-11-13); «Escribe» y «Cambia estado», del ADR-0022. Una línea bajo el encabezado de la sección cita `[[workflows-sin-estados-buffer]]`.
- **Fila `epic-analyze`:** «antes de aprobar `READY-FOR-DEV`» → «antes de la aprobación del PO (`PLAN/DONE`, escrita a mano)».
- **Rechazadas:** (a) añadir la frase en la nota de cabecera sin tabla: AC-2 la busca en el mapa como transición de un skill, y el mapa organiza todo por fila. (b) incluir también `story-implement`, `story-implement-tasks` y el resto del pipeline: el mapa «se completa de forma incremental», y AC-2 solo pide `story-analyze` y los tres gates (P12).

### D-08 — Requisitos FR-043/044/045 y NFR-006 // satisface: AC-2, CNF-2

- **NFR-006:** los dos workflows se sustituyen por los literales del ADR y se añade, tras la frase de los dos ejes: «`status` expresa solo la etapa y `substatus` el progreso: no existen estados buffer ni de cola ([[workflows-sin-estados-buffer]])». `## Criterios de verificación` no cambia.
- **FR-043:** «retrocediendo entonces la historia a `READY-FOR-IMPLEMENT/DONE`» → «devolviendo entonces la historia a `IMPLEMENT/TODO` (ADR-0022, [[workflows-sin-estados-buffer]])». El resto del párrafo ya nombra `fix-directives.md`.
- **FR-044:** la frase del retroceso → «Con veredicto `NEEDS-CHANGES` SHALL escribir `fix-directives.md` con `based-on: verify-report.md` y un `round` que continúa las rondas de rework de la historia, y devolver la historia a `IMPLEMENT/TODO` ([[workflows-sin-estados-buffer]])».
- **FR-045:** «retrocede a `READY-FOR-IMPLEMENT/DONE`» → «SHALL escribir `fix-directives.md` con `based-on: acceptance-report.md` y un `round` que continúa las rondas de rework, y devolver la historia a `IMPLEMENT/TODO` ([[workflows-sin-estados-buffer]])».
- Los FR describen el destino; la ventana de transición no se menciona (CNF-2). `## Atributos` no cambia (sin nuevas fuentes de historia: la trazabilidad la da el ADR citado).
- **Rechazada:** describir en los FR la dimensión y la lista blanca de cada gate: duplica la tabla del ADR (D-04 de STORY-186) y obliga a mantener dos copias; el FR nombra el escritor, `based-on` y `round`, que es lo que pide la nota de la historia.
- **Incidental permitido:** en C-3 §5.3, la frase que se reescribe nombra `review.md`; se sustituye por los nombres reales (`code-review-report.md`, `verify-report.md`, `acceptance-report.md`) porque está en la misma frase.

### D-09 — Rework transversal y de épica // satisface: AC-2, CNF-1

- **C-3 §2 «Rework»:** «Retorno a la etapa de ejecución tras un rechazo en revisión, verificación o aceptación: en Story, `IMPLEMENT/TODO`».
- **C-3 §5.3:** «El work item regresa a su etapa de ejecución: una historia, a `IMPLEMENT/TODO` desde cualquiera de los tres gates; una épica, a `DEVELOP` con un veredicto distinto de `APPROVED` de `epic-validate`. No existe estado ni substatus de rework. El gate escribe `fix-directives.md` con `based-on` igual a su reporte, y el skill de implementación detecta el rework solo por ese archivo ([[workflows-sin-estados-buffer]])».
- **C-1 §2 «Rework»** y **§4.3**: las tres filas de rework → `CODE-REVIEW → IMPLEMENT/TODO`, `VERIFY → IMPLEMENT/TODO`, `ACCEPTANCE → IMPLEMENT/TODO` (`NEEDS-CHANGES`); el happy path usa el literal del ADR. Invariante 6 → «Todos los retrocesos por `NEEDS-CHANGES` apuntan a `IMPLEMENT/TODO`; no existe estado ni substatus de rework y la señal es `fix-directives.md` ([[workflows-sin-estados-buffer]])».
- **C-5 Flow Catalog paso 4:** «Fallos de review, verify o acceptance devuelven una historia a `IMPLEMENT/TODO`; la señal de rework es `fix-directives.md`, que escribe el gate que la rechazó».
- La épica conserva su rework existente (`VALIDATE → DEVELOP`, de `epic-validate`): no lo cambia el ADR.
- **Rechazada:** describir el rework de épica como `DEVELOP/TODO`: `epic-validate` escribe `DEVELOP/IN-PROGRESS` (`domain-skills-map.md`), y cambiarlo sería una decisión nueva (CNF-1).

### D-10 — Gate de integridad e invariante 2 de épica // satisface: AC-1

- Invariante 2 de C-2 → «Una épica sin historias no puede llegar a `PLAN/DONE`».
- Gate de integridad de historias (§8 de C-2): columna «Estado» `PLAN` → `READY-FOR-DEV` (informativo) → «`PLAN`, antes de la aprobación del PO (`PLAN/DONE`) (informativo)». El texto de la columna «Qué valida» no cambia.
- `state-machine.md` nivel ÉPICA: tras la tabla de estados, una frase «La aprobación del PO es `PLAN/DONE` y se escribe a mano: ningún skill la escribe ([[workflows-sin-estados-buffer]])».
- **Rechazada:** convertir el gate informativo en un gate de transición: `epic-analyze` no cambia estado y cambiarlo es de STORY-192.

### D-11 — `domain.md`: pregunta cerrada y changelog // satisface: AC-1, CNF-3

- La pregunta cerrada «WIP=1 aplica por nivel… buffers L2/L1 configurables? — 2026-09-12» cambia su segunda línea a «ADR-0022 retira los buffers: no hay WIP de cola. — 2026-11-13». Es el único registro de la pregunta y sigue cerrada; la línea es texto de autoridad, no histórico (no es ADR, CHANGELOG ni roadmap).
- `## Changelog` añade una fila: `| <fecha> | Workflows sin estados buffer (ADR-0022): rework en IMPLEMENT/TODO, cola de listos como consulta. | — | BR-004 reescrita. |`.
- **Rechazada:** borrar la pregunta: pierde el rastro de que el WIP por nivel se resolvió con ADR-0013.

## Esquema de datos // satisface: AC-1, AC-2, AC-3

N/A — la historia no define datos ni frontmatter nuevos. Solo cambia `updated:` en los siete documentos que ya tienen el campo.

## Flujos clave

**F-1 — Precondición:** comprobar que `docs/adr/ADR-0022-workflows-sin-estados-buffer.md` existe con `status: ACCEPTED`. Si no existe, detener: los wikilinks romperían `check-doc-links`.

**F-2 — Edición por documento (AC-1 a AC-3):** C-3 (transversal) → C-1 → C-2 → C-4 → C-5 → C-6 → C-7 → C-8 → C-9 → C-10. El orden va de lo transversal a lo particular para que los documentos de nivel remitan a definiciones ya escritas.

**F-3 — Verificación (CNF-3, CNF-4):** `grep -c` de buffers por documento = 0 → `grep -c "workflows-sin-estados-buffer"` ≥ 1 por documento → comprobación de bytes (sin BOM ni U+FEFF) → `grep -n "WIP\|READY-FOR" docs/constitution.md` (sin cambios necesarios) → `npm run verify:repository` y `npm test`.

## Decisiones de complejidad justificada

- **Sección nueva en `domain-skills-map.md` (D-07):** AC-2 exige la transición de `story-analyze` y de los gates en el mapa, que hoy no tiene sección de historia. Se añaden solo las cuatro filas pedidas; el resto del pipeline sigue fuera, como prevé la nota «se completa de forma incremental».
- **Subsección §5.5 nueva (D-06):** AC-3 busca la consulta en `domain-state-management`. Una subsección propia evita mezclar la consulta con los tipos de transición de §5.1–5.4.
- **Cita doble (wikilink + número, D-01):** una sola forma no se valida o no se lee; el wikilink cuesta los mismos caracteres que el enlace relativo.

## Contratos de verificación

| # | Criterio | Método de verificación | Origen |
|---|---|---|---|
| V-1 | ADR-0022 existe y está `ACCEPTED` antes de editar | lectura del frontmatter | Precondición (F-1) |
| V-2 | Los 10 documentos tienen 0 menciones de `READY-FOR-IMPLEMENT` y `READY-FOR-DEV` | `grep -c "READY-FOR-IMPLEMENT\|READY-FOR-DEV"` por documento | CNF-2, CNF-3 |
| V-3 | `domain.md`, C-1, C-2 y C-4 contienen los dos workflows literales del ADR | `grep -F` de cada literal | AC-1 |
| V-4 | Los 10 documentos citan `[[workflows-sin-estados-buffer]]` | `grep -c` ≥ 1 por documento | AC-1 |
| V-5 | C-1 y C-3: rework → `IMPLEMENT/TODO` y la frase «no existe estado ni substatus de rework» | grep | AC-2 |
| V-6 | C-4: las tres filas de los gates con `IMPLEMENT/TODO` (`NEEDS-CHANGES`) y `story-analyze` → `PLAN/DONE` | lectura de la tabla de transiciones | AC-2 |
| V-7 | FR-043/044/045: `IMPLEMENT/TODO` y `fix-directives.md`; FR-044/045 con su `based-on` | grep | AC-2 |
| V-8 | NFR-006: «status expresa solo la etapa» y «no existen estados buffer» | grep | AC-2 |
| V-9 | `domain-skills-map.md`: `story-analyze` → `PLAN/DONE` y tres filas → `IMPLEMENT/TODO` | grep | AC-2 |
| V-10 | C-3 §5.5: la consulta «primero `IMPLEMENT/TODO`, después `PLAN/DONE`», `TODO` en cualquier estado activo y «no un estado, un gate ni un límite WIP» | lectura | AC-3 |
| V-11 | Ningún glosario, VO, invariante ni gate de C-1, C-2, C-3 o C-5 define WIP para una cola (`grep -in "buffer"` = 0 en C-1, C-2, C-3; en C-5 solo la línea de la pregunta cerrada y la fila del changelog) | grep y lectura | AC-3, CS-5 |
| V-12 | Los diagramas Mermaid no tienen alias `RFI`/`RFD` | `grep -c "RFI\|RFD"` = 0 en C-1, C-2 y C-4 | AC-1 |
| V-13 | La constitución no necesita cambios | `grep -n "WIP\|READY-FOR" docs/constitution.md` | Nota de la historia |
| V-14 | Sin BOM ni U+FEFF en los 10 archivos | comprobación de bytes | CNF-4 (memoria del proyecto) |
| V-15 | Gate verde | `npm run verify:repository` y `npm test` con salida 0 | CNF-4 |

## Risks / Trade-offs

- [ADR-0022 todavía no existe (STORY-186 en `PLAN`)] → F-1 bloquea la implementación hasta que exista; el plan y el diseño no dependen de él.
- [Los documentos describen el destino mientras los skills aún escriben `READY-FOR-IMPLEMENT`] → trade-off aceptado por CNF-2: la ventana se describe en el ADR y en los skills (STORY-188 a STORY-191). El ADR es la referencia citada en cada documento.
- [Coordinación con STORY-192: `epic-analyze` declara el orden de madurez según `domain-story-lifecycle` §4.1 y §5] → §4.1 queda con el literal del ADR y §5 con los estados sin `READY-FOR-IMPLEMENT`; STORY-192 debe leer ese orden. Se registra en CR-001.
- [Un Mermaid inválido no lo detecta el gate] → se mantiene la sintaxis de los diagramas existentes (`A --> B : etiqueta`) y se revisa la vista previa al implementar.
- [Editar `domain.md` podría introducir un token de layout legado detectado por `verify-fixed-layout`] → las ediciones no tocan la terminología de layout; el gate lo comprueba.
- [`test/epic-validate-gateway.test.js` exige una sola línea del gateway en `state-machine.md`] → la frase nueva de D-10 no empieza por el prefijo del gateway y no menciona sus tokens en el mismo orden.

## Open Questions

Ninguna. La redacción depende solo de decisiones ya fijadas en EPIC-029 y en el diseño de STORY-186 (D-02 a D-06).

## Autoevaluación (P9, P10)

- **Omisiones:** AC-1 → D-01, D-02, D-03, D-04, D-10, D-11; C-1, C-2, C-4, C-5. AC-2 → D-03, D-07, D-08, D-09; C-1, C-3, C-4, C-6 a C-10. AC-3 → D-05, D-06; C-3. CNF-1 → D-02, D-05, D-09. CNF-2/CNF-3 → V-2. CNF-4 → V-14, V-15.
- **Ambigüedad:** AC-3 dice «la sección de flujo» y `domain-state-management` no tiene una con ese nombre; el diseño la crea como §5.5 con «Flujo» en el título. AC-2 pide el mapa de skills para historia, que no tenía sección: se crea (D-07).
- **Nombres:** «cola de listos», «rework», «valor legado» y «aprobación del PO» se usan como en la épica. El literal de la consulta es idéntico en C-1, C-3 y C-5.
- **Estructura:** C-3 es la definición transversal; C-1, C-2 y C-5 remiten a ella; C-4 y C-6 a C-10 solo citan el ADR. Sin ciclos; cada documento cambia por una sola razón (alinearse con ADR-0022).

## Registro de Cambios (CR)

### CR-001

- **Tipo:** dependencia
- **Descripción:** `skills/epic-analyze/SKILL.md` declara el orden de madurez de las historias «según `domain-story-lifecycle` §4.1 y §5». Esta historia cambia ese orden (retira `READY-FOR-IMPLEMENT`).
- **Documento afectado:** STORY-192 (no esta historia).
- **Acción requerida:** STORY-192 toma como orden el literal de §4.1 que deja esta historia (`SPECIFY → PLAN → IMPLEMENT → …`), con `PLAN/DONE` como planificación aprobada. Ninguna acción en STORY-187.

### CR-002

- **Tipo:** dependencia
- **Descripción:** los wikilinks `[[workflows-sin-estados-buffer]]` exigen que ADR-0022 exista (`scripts/check-doc-links.js`). La historia lo menciona como dependencia de STORY-186, pero no como bloqueo del gate.
- **Documento afectado:** design.md (F-1, V-1).
- **Acción requerida:** implementar después de STORY-186. Ningún cambio en `story.md`.
