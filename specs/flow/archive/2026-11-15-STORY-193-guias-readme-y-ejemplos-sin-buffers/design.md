---
alwaysApply: false
type: design
id: STORY-193
slug: STORY-193-guias-readme-y-ejemplos-sin-buffers-design
title: "Design: Guías, README y ejemplos sin buffers"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-029-eliminar-estados-buffer
story: STORY-193
created: 2026-11-14
updated: 2026-11-14
related:
  - STORY-193-guias-readme-y-ejemplos-sin-buffers
  - EPIC-029-eliminar-estados-buffer
  - STORY-186-adr-de-workflows-sin-estados-buffer
  - STORY-187-dominio-y-requisitos-sin-buffers
---

<!-- Referencias -->
[[STORY-193-guias-readme-y-ejemplos-sin-buffers]] · [[EPIC-029-eliminar-estados-buffer]] · [[STORY-186-adr-de-workflows-sin-estados-buffer]] · [[STORY-187-dominio-y-requisitos-sin-buffers]]

## Context

La historia es de tipo `chore` y solo edita documentación, fixtures y un caso de eval. No cambia ningún script ni el comportamiento de ningún skill. Cierra **CS-6** de EPIC-029 y la parte de **CS-7** que corresponde a `skills/story-fix-plan/evals/evals.json`.

Estado verificado el 2026-11-14:

- **ADR de referencia.** El diseño de STORY-186 fija el ADR como `docs/adr/ADR-0022-workflows-sin-estados-buffer.md`, con slug `workflows-sin-estados-buffer`. Este ADR todavía no existe: STORY-186 está en `READY-FOR-IMPLEMENT/DONE`. Los workflows son:
  - **Historia:** `SPECIFY → PLAN → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE → DELIVER → COMPLETED`.
  - **Épica:** `DEFINE → PLAN → DEVELOP → VALIDATE → SHIP → COMPLETED`. La aprobación del PO se escribe a mano como `PLAN/DONE`.
  - **Rework:** con `NEEDS-CHANGES`, los tres gates (`story-code-review`, `story-verify` y `story-acceptance`) escriben `IMPLEMENT/TODO` y un `fix-directives.md` cuyo `based-on` es su propio reporte. `round` es la ronda previa + 1, y la ronda previa es el máximo entre el `round` de `fix-directives.md` y los encabezados de ronda de `implement-report.md` (D-05 de STORY-186). Solo `story-code-review` borra `fix-directives.md`, y lo hace al aprobar.
  - **Cola de listos:** es una consulta, no un estado. Primero `IMPLEMENT/TODO` y después `PLAN/DONE` (D-06 de STORY-187).
- **Inventario** (`grep -rnE "READY-FOR-(IMPLEMENT|DEV)" skills docs README.md`) de los archivos en alcance:

| Archivo | Líneas | Mención |
|---|---|---|
| `docs/guides/process-for-story-implement.md` | 22, 35, 49, 58, 67 | workflow, fin de PLAN, rework de los tres gates |
| `docs/guides/sddf-commands-pipeline.md` | 196, 258, 260 | aprobación de la épica, precondición del ejecutor, rework de CR |
| `docs/guides/process-for-epic-development.md` | 23, 38 | workflow de épica, aprobación del PO |
| `docs/guides/specs-and-workflows.md` | 50, 55, 63, 78, 83 | happy path y rejected path de historia, viñeta de buffer, workflow de épica, viñeta de buffer |
| `docs/architecture/sdcl-sddf.md` | 25 | «`READY-FOR-IMPLEMENT` no tiene equivalente…» |
| `docs/architecture/diagrams/flowchart-skill-story-flow-relationships.mermaid` | 22 | comentario de la fase PLAN |
| `README.md` | 212 | ciclo de vida de la historia |
| `docs/product/objectives.md` | 112 | indicador de OBJ-10 |
| `skills/story-specify/README.md` | 17 | transición de `/story-plan` |
| `skills/memory-system/examples/**/story.md` | línea 6 (×11) | `status: READY-FOR-IMPLEMENT` |
| `skills/story-design/examples/input/story.md`, `skills/story-tasking/examples/input/story.md` | 7 | `status: READY-FOR-IMPLEMENT` + `substatus: TODO` |
| `skills/story-fix-plan/examples/example-coherente/design.md`, `tasks.md` | 6 | `status: READY-FOR-IMPLEMENT` + `substatus: DONE` |
| `skills/story-fix-plan/evals/evals.json` | 186 | `not_contains` de TC-007 |

- **Menciones permitidas por AC-1, que no se tocan:** ADR-0003, ADR-0006, ADR-0008, ADR-0022 y `docs/product/roadmap.md:106`. Esta última está bajo `## Plan original (2026-04-20)`, que es una propuesta fechada (CNF-1).
- **Menciones de otras historias:** `docs/domains/`, `docs/architecture/state-machine.md` y `docs/requirements/` son de STORY-187. Los `SKILL.md`, README, ejemplos y evals de `story-analyze`, `story-plan`, `story-implement`, `story-implement-tasks`, `story-code-review`, `story-verify`, `story-acceptance`, `epic-analyze`, `epic-refine` y `epic-generate-all-stories` son de STORY-188 a STORY-192. La lista incluye `skills/story-analyze/examples/input/story.md` y `skills/story-plan/examples/output/plan-summary.md`.
- **Contexto que no rompe la sustitución:**
  - Ningún test de `test/` contiene `READY-FOR`.
  - Los scripts de `memory-system` no leen el valor de `status` de una historia. `specs-3-levels.js` solo remapea `substatus`.
  - `verify-validation-contract.js` revisa también los `.mermaid` de `docs/`.
  - El fixture `sddf` es el único de `memory-system` que tiene `substatus` (`DONE`).
  - Los `design.md` y `tasks.md` de `example-con-hallazgos`, el fixture que usa TC-007, están en `PLAN/IN-PROGRESS`, y `fix-plan-report-template.md` no tiene `status` ni `substatus`.
- **Defectos que se corrigen al editar las mismas líneas:**
  - En el `.mermaid`, las aristas de `story-verify` y `story-acceptance` hacia el ejecutor usan la etiqueta `NEEDS-REFINEMENT`, y la de `story-analyze` hacia `story-fix-plan` también. El veredicto real de esos gates es `NEEDS-CHANGES` (`docs/policies/validation-contract-policy.md`).
  - `skills/story-specify/README.md:17` dice `PLANNING/IN-PROGRESS`, que no es un estado.
  - La nota de `sddf-commands-pipeline.md:263` presenta a `story-code-review` como «escritor único de `round`» y cita ADR-0008. Con ADR-0022 eso deja de ser cierto.

## Goals / Non-Goals

**Goals:**

- Que el `grep` de AC-1 solo devuelva las menciones permitidas una vez completadas STORY-186 a STORY-192. // satisface: AC-1
- Que las cinco filas de AC-2 muestren el flujo del ADR. // satisface: AC-2
- Reemplazar los estados de los fixtures y del eval sin que ningún caso pierda la condición que verificaba, con `npm test` y `npm run verify:repository` en verde. // satisface: AC-3, CNF-3
- Reescribir el indicador de OBJ-10 con una redacción propuesta y dejar registrado que necesita la confirmación del PO. // satisface: AC-4
- Que el `.mermaid` siga siendo válido. // satisface: CNF-2

**Non-Goals:**

- Documentos de dominio, `state-machine.md` y requisitos (STORY-187).
- Los artefactos de los skills que cambian de comportamiento (STORY-188 a STORY-192).
- Destinos de runtime (`.agents/skills/`, `.claude/skills/`): se regeneran con `agile-sddf install`.
- `CHANGELOG.md`, ADR-0003, ADR-0006, ADR-0008, las propuestas fechadas de `roadmap.md` y `specs/flow/archive/` (CNF-1).
- El layout del fixture `specs-3-levels`: solo cambia su `status`.
- `sddf-commands-pipeline.md:244` (`substatus: IN-PROGRESS / READY` de `story-specify`). No menciona un buffer y queda fuera del flujo de esta historia (ver CR-002).

## Componentes afectados

| # | Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|---|
| C-1 | Guía del pipeline de historia | modificar | `docs/guides/process-for-story-implement.md` | AC-1, AC-2 |
| C-2 | Guía de comandos del pipeline | modificar | `docs/guides/sddf-commands-pipeline.md` | AC-1, AC-2 |
| C-3 | Guía del pipeline de épica | modificar | `docs/guides/process-for-epic-development.md` | AC-1, AC-2 |
| C-4 | Guía de specs y workflows | modificar | `docs/guides/specs-and-workflows.md` | AC-1 |
| C-5 | Correspondencia SDLC ↔ SDDF | modificar | `docs/architecture/sdcl-sddf.md` | AC-1 |
| C-6 | Diagrama de relaciones del flujo de historia | modificar | `docs/architecture/diagrams/flowchart-skill-story-flow-relationships.mermaid` | AC-1, AC-2, CNF-2 |
| C-7 | README del paquete | modificar | `README.md` | AC-1, AC-2 |
| C-8 | Indicador de OBJ-10 | modificar | `docs/product/objectives.md` | AC-1, AC-4 |
| C-9 | README de `story-specify` | modificar | `skills/story-specify/README.md` | AC-1 |
| C-10 | Fixtures de historia de `memory-system` (11) | modificar | `skills/memory-system/examples/{broken,sane,sddf}/specs/flow/STORY-001-a/story.md`, `…/{requirements-fragmented,requirements-mixed,srs-single}/specs/flow/STORY-00{1,2}-prueba/story.md`, `…/requirements-legacy/specs/flow/STORY-001-prueba/story.md`, `…/specs-3-levels/docs/specs/03-stories/STORY-001-a/story.md` | AC-1, AC-3 |
| C-11 | Historias de entrada de `story-design` y `story-tasking` | modificar | `skills/story-design/examples/input/story.md`, `skills/story-tasking/examples/input/story.md` | AC-1, AC-3 |
| C-12 | Plan coherente de `story-fix-plan` y su TC-007 | modificar | `skills/story-fix-plan/examples/example-coherente/design.md`, `…/tasks.md`, `skills/story-fix-plan/evals/evals.json` | AC-1, AC-3 |

No se crea ningún archivo. No hay componentes nuevos que reutilizar (P3). Los cambios reutilizan el vocabulario y las decisiones de ADR-0022 (STORY-186) y de STORY-187 (cola de listos, forma de citar el ADR).

## Interfaces

En esta historia, las interfaces son los contratos que leen otros componentes. // satisface: AC-1, AC-3

| Interfaz | Consumidor | Contrato tras el cambio | AC |
|---|---|---|---|
| Frontmatter de un fixture de historia | `memory-system` (`index`, `check`, `migrate`) | `status` es un estado del ADR. No cambia la presencia ni la ausencia de `substatus` | AC-3 |
| Frontmatter de `example-coherente` | Evals de `story-fix-plan` con `input_path: …/example-coherente/` | Un plan coherente y aprobado está en `PLAN/DONE` | AC-3 |
| `expected.not_contains` de TC-007 | `npm run test:eval -- story-fix-plan` (`scripts/run-evals.js`) | Sigue comprobando que `story-fix-plan --auto` no avanza el estado del plan | AC-3 |
| Wikilink al ADR | `scripts/check-doc-links.js` (dentro de `verify:repository`) | `[[workflows-sin-estados-buffer]]` resuelve a ADR-0022 | AC-1, AC-2 |
| Diagrama `.mermaid` | renderizadores Mermaid y `verify-validation-contract.js` | Sintaxis `flowchart TD` válida, con veredictos del contrato de validación en las etiquetas | AC-2, CNF-2 |

## Decisions

### D-01 — Cómo citar el ADR // satisface: AC-1, AC-2

- **Elegida:** en `docs/guides/` y `docs/architecture/`, el wikilink `[[workflows-sin-estados-buffer]]` con «ADR-0022» en el texto, igual que en D-01 de STORY-187. En `README.md`, un enlace Markdown relativo `[ADR-0022](docs/adr/ADR-0022-workflows-sin-estados-buffer.md)`, porque el README se lee en GitHub y en npm, donde los wikilinks no resuelven. Las guías que hoy citan `[[rework-sin-estado-propio]]` (ADR-0008) como regla vigente pasan a citar ADR-0022. Si una frase describe la historia de la regla, mantiene ADR-0008 como antecedente.
- **Rechazadas:** (a) solo «ADR-0022» en texto: no lo valida ningún script. (b) un wikilink en `README.md`: en npm y GitHub se ve como texto literal `[[…]]`.

### D-02 — Guía del pipeline de historia (C-1) // satisface: AC-1, AC-2

- **L22:** `SPECIFY → PLAN → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE → DELIVER → COMPLETED`.
- **Paso 2, «Estado al terminar» (L35):** `PLAN/DONE` con `APPROVED` (lista para implementar). Con `NEEDS-CHANGES` sigue en `PLAN/IN-PROGRESS`.
- **Paso 3, «Acción»:** se añade la entrada. «Parte de `PLAN/DONE` (primera ejecución) o de `IMPLEMENT/TODO` con `fix-directives.md` (rework). La cola de listos se consulta en ese orden: primero `IMPLEMENT/TODO`, después `PLAN/DONE` ([[workflows-sin-estados-buffer]], ADR-0022).»
- **Pasos 4, 5 y 6, `NEEDS-CHANGES` (L49, L58, L67):** `IMPLEMENT/TODO` + `fix-directives.md` con `based-on: <reporte del gate>` (`code-review-report.md`, `verify-report.md` o `acceptance-report.md`). Se vuelve al paso 3, que aplica `fix-directives.md`, y el rework vuelve a pasar por el paso 4.
- **Rechazadas:** (a) dejar el «Se vuelve al paso 3» sin el destino: AC-2 exige ver `IMPLEMENT/TODO`. (b) explicar el contrato completo de `fix-directives.md` en la guía: lo fija ADR-0022 y la guía lo enlaza (P12).

### D-03 — Guía de comandos del pipeline (C-2) // satisface: AC-1, AC-2

- **L196:** «…antes de que el PO apruebe la épica escribiendo `PLAN/DONE` a mano; no cambia ningún estado.»
- **§4, título:** «Pipeline de implementación y ciclo de corrección». Ya no es solo post-review.
- **§4, diagrama:** se añade una primera línea `story-analyze → APPROVED → PLAN/DONE → story-implement | story-implement-tasks`. Las ramas `NEEDS-CHANGES` de `story-verify` y de `story-acceptance` vuelven al ejecutor con `→ IMPLEMENT/TODO`.
- **§4, tabla:**
  - La precondición del ejecutor pasa a ser `PLAN/DONE` (ejecución inicial) o `IMPLEMENT/TODO` (rework, con `fix-directives.md`).
  - El resultado de `story-code-review → NEEDS-CHANGES` pasa a `IMPLEMENT/TODO`.
  - Se añaden dos filas: `story-verify → NEEDS-CHANGES` (precondición `CODE-REVIEW/DONE` o `IMPLEMENT/DONE`, como en el paso 5 de C-1) y `story-acceptance → NEEDS-CHANGES` (precondición `VERIFY/DONE`). Las dos tienen como resultado `IMPLEMENT/TODO` + su reporte con `verdict: NEEDS-CHANGES` + `fix-directives.md` con `based-on` igual a su reporte y `round: N`.
- **Nota L263:** «La señal de rework es la presencia de `fix-directives.md`. Lo escriben los tres gates en `NEEDS-CHANGES`, y `round` continúa la numeración de todas las rondas de la historia. Solo `story-code-review` lo elimina, en `APPROVED`. No existe estado ni substatus de rework ([[workflows-sin-estados-buffer]], ADR-0022, que reemplaza a ADR-0008).»
- **Rechazadas:** (a) cambiar solo las dos celdas con `READY-FOR-IMPLEMENT`: la nota y la tabla seguirían diciendo que solo `story-code-review` produce rework, lo que contradice el ADR (veracidad, AGENTS.md). (b) crear una sección nueva para verify y acceptance: duplica §4.

### D-04 — Guías de épica y de workflows (C-3, C-4) // satisface: AC-1, AC-2

- **C-3, L23:** `DEFINE → PLAN → DEVELOP → VALIDATE → SHIP → COMPLETED`. **L38:** «`PLAN`. Con `APPROVED`, el PO aprueba la épica escribiendo `PLAN/DONE` a mano. El veredicto es informativo, pero `/epic-validate` volverá a exigirlo.»
- **C-4, historia:**
  - Happy path (L50) sin `READY-FOR-IMPLEMENT`.
  - El rejected path (L55) empieza en `PLAN`, y su flecha de retorno se rotula `NEEDS-CHANGES → IMPLEMENT/TODO`.
  - Se elimina la viñeta de L63.
  - La viñeta `PLAN` pasa a decir: «Diseño técnico. `PLAN/DONE` significa lista para implementar; la cola de listos es una consulta (primero `IMPLEMENT/TODO`, después `PLAN/DONE`), no un estado ([[workflows-sin-estados-buffer]], ADR-0022).»
- **C-4, épica:**
  - L78 queda sin `READY-FOR-DEV`.
  - Se elimina la viñeta de L83.
  - La viñeta `PLAN` añade: «La aprobación del PO se escribe a mano como `PLAN/DONE`.»
- **Rechazadas:** cambiar el nombre de la viñeta de buffer por «cola de listos»: la cola no es un estado, y como viñeta de la lista de estados lo parecería.

### D-05 — Arquitectura: `sdcl-sddf.md` y el diagrama (C-5, C-6) // satisface: AC-1, AC-2, CNF-2

- **C-5, L25:** «`CANCELED` no tiene equivalente en el SDLC clásico: es el terminal de una historia abandonada sin entregar. Entre el diseño y la codificación no hay un estado de cola. `PLAN/DONE` significa lista para implementar, y la cola de listos es una consulta ([[workflows-sin-estados-buffer]], ADR-0022).»
- **C-6:**
  - Comentario L22: `%% FASE: PLAN (termina en PLAN/DONE)`.
  - La arista `dec_plan -->|APPROVED| story-implement` pasa a `dec_plan -->|"APPROVED → PLAN/DONE"| story-implement`.
  - Los tres retornos al ejecutor (`dec_impl`, `dec_verify` y `dec_acceptance`) pasan a `-->|"NEEDS-CHANGES → IMPLEMENT/TODO"| story-implement`.
  - `dec_plan -->|NEEDS-REFINEMENT| story-fix-plan` pasa a `-->|NEEDS-CHANGES| story-fix-plan`, el veredicto real de `story-analyze`.
  - Las etiquetas que llevan espacios, `→` o `/` van entre comillas dobles, que Mermaid admite en las etiquetas de arista. No se mueven nodos ni subgrafos.
- **Rechazadas:** (a) un nodo de estado `IMPLEMENT/TODO` en el diagrama: el diagrama relaciona skills, no estados, y un nodo nuevo cambiaría su naturaleza. (b) dejar `NEEDS-REFINEMENT` en las aristas: es un veredicto que esos gates no emiten, y el lector aprendería un valor falso.

### D-06 — README del paquete (C-7) // satisface: AC-1, AC-2

- **L212:** «El ciclo de vida de una historia es `SPECIFY → PLAN → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE → DELIVER → COMPLETED` ([ADR-0022](docs/adr/ADR-0022-workflows-sin-estados-buffer.md)). Una historia aprobada en el plan queda en `PLAN/DONE`, y un `NEEDS-CHANGES` de `story-code-review`, `story-verify` o `story-acceptance` la devuelve a `IMPLEMENT/TODO` con `fix-directives.md`.» El resto del párrafo (`DELIVER` y `COMPLETED`) no cambia.
- **Rechazada:** solo quitar el estado de la secuencia. AC-2 pide «el workflow de historia del ADR», y el rework es parte de él.

### D-07 — Indicador de OBJ-10 (C-8) // satisface: AC-4

- **Redacción propuesta, L112:** «**Indicador:** las historias listas para implementar se consultan como cola (primero `IMPLEMENT/TODO`, después `PLAN/DONE`), sin estado buffer; el WIP se limita sobre `IN-PROGRESS`, y el framework expone lead time y throughput por nivel.»
- **L108, descripción:** «buffers con WIP limitado» pasa a «colas como consulta y WIP limitado sobre `IN-PROGRESS`», para que la descripción y el indicador no se contradigan.
- **Confirmación del PO:** esta redacción es una propuesta. El ejecutor la aplica y registra en `implement-report.md` que necesita la confirmación del PO, junto con el texto aplicado. La confirmación se da en `/story-acceptance`, en el criterio AC-4. Si el PO pide otra redacción, el rechazo de AC-4 produce `fix-directives.md` con dimensión `requirements-coverage` (ADR-0022), y la historia no se cierra sin esa confirmación.
- **Rechazadas:** (a) mantener «WIP configurable» aplicado a la cola: ADR-0022 y STORY-187 dicen que la cola de listos no tiene límite WIP. (b) bloquear la implementación hasta tener la confirmación: la épica fija que el PO confirma en la aceptación, y el `--auto` del ejecutor no puede pedir confirmación.

### D-08 — Fixtures de `memory-system` (C-10) // satisface: AC-1, AC-3

- **Elegida:** en las once historias, `status: READY-FOR-IMPLEMENT` → `status: PLAN`. El fixture `sddf` mantiene su `substatus: DONE`, así que queda en `PLAN/DONE`, el equivalente exacto del valor legado sin `implement-report.md` (D-06 de STORY-186). Los otros diez siguen sin `substatus`. El fixture `specs-3-levels` mantiene su layout (`docs/specs/03-stories/`).
- **Condición conservada:** los fixtures se usan para el índice, los enlaces y la migración. Ningún test ni script compara el valor de `status`, y el valor nuevo sigue siendo un estado válido y no terminal, como el anterior.
- **Rechazadas:** (a) añadir `substatus: DONE` a los diez que no lo tienen: cambia la forma del fixture, y algunos casos (`broken`, `requirements-*`) prueban frontmatter mínimo. (b) usar `IMPLEMENT/TODO`: sin `implement-report.md`, la regla del valor legado da `PLAN/DONE`.

### D-09 — Ejemplos de `story-design`, `story-tasking` y `story-fix-plan` (C-11, C-12) // satisface: AC-1, AC-3

- **C-11:** `status: READY-FOR-IMPLEMENT` + `substatus: TODO` → `status: PLAN` + `substatus: IN-PROGRESS`. Es el estado real de una historia cuando se diseña o se desglosa en tareas, porque `story-plan` lo escribe antes de invocar a estos sub-skills. Los evals de `story-design` y `story-tasking` no comprueban el `status` de la entrada (verificado con `grep`).
- **C-12, `example-coherente`:** `design.md` y `tasks.md` pasan de `READY-FOR-IMPLEMENT/DONE` a `PLAN/DONE`. El fixture representa un plan coherente con `analyze.md` en `verdict: APPROVED`, que con el ADR deja la historia en `PLAN/DONE`.
- **C-12, TC-007:** en `expected.not_contains`, `"READY-FOR-IMPLEMENT"` → `"substatus: DONE"`.
  - La condición era «`story-fix-plan --auto` no avanza el estado». Con el ADR, avanzar sería `PLAN/IN-PROGRESS` → `PLAN/DONE`, y como `status` no cambia, la única marca observable es `substatus: DONE`.
  - La entrada (`example-con-hallazgos`) está en `PLAN/IN-PROGRESS`, y `fix-plan-report-template.md` no tiene `substatus`, así que `substatus: DONE` solo aparece si `story-fix-plan` escribe el estado.
  - `contains` ya exige `status: PLAN` y `substatus: IN-PROGRESS`.
- **Rechazadas:** (a) en C-11, `PLAN/DONE`: describe un plan terminado, no una historia que se está diseñando. (b) en TC-007, `"PLAN/DONE"`: es el formato de los mensajes y no el del frontmatter. `story-fix-plan` podría escribir `substatus: DONE` sin que la cadena apareciera, y la condición se perdería. (c) en TC-007, eliminar la entrada: el caso perdería la condición, lo que AC-3 prohíbe.

### D-10 — README de `story-specify` (C-9) // satisface: AC-1

- **L17:** `/story-plan [story.md: PLAN/IN-PROGRESS → PLAN/DONE]`. Corrige también `PLANNING`, que no es un estado.
- **Rechazada:** cambiar solo el destino. `PLANNING/IN-PROGRESS` seguiría enseñando un estado inexistente en la misma línea.

## Esquema de datos // satisface: AC-1, AC-3

No hay esquema nuevo. Las sustituciones de frontmatter son:

| Archivos | Antes | Después |
|---|---|---|
| C-10 `sddf` | `status: READY-FOR-IMPLEMENT` / `substatus: DONE` | `status: PLAN` / `substatus: DONE` |
| C-10, los otros 10 | `status: READY-FOR-IMPLEMENT` (sin `substatus`) | `status: PLAN` (sin `substatus`) |
| C-11 (2) | `status: READY-FOR-IMPLEMENT` / `substatus: TODO` | `status: PLAN` / `substatus: IN-PROGRESS` |
| C-12 `design.md`, `tasks.md` | `status: READY-FOR-IMPLEMENT` / `substatus: DONE` | `status: PLAN` / `substatus: DONE` |
| C-12 `evals.json` TC-007 | `not_contains: [..., "READY-FOR-IMPLEMENT", ...]` | `not_contains: [..., "substatus: DONE", ...]` |

## Flujos clave

1. **Lector que sigue una historia (AC-2):** abre `process-for-story-implement.md`, `story-analyze` da `APPROVED`, y la historia pasa a `PLAN/DONE`, luego a `/story-implement` y a `IMPLEMENT/DONE`. Si uno de los tres gates da `NEEDS-CHANGES`, la historia pasa a `IMPLEMENT/TODO` con `fix-directives.md` y vuelve al paso 3. El mismo recorrido aparece en `sddf-commands-pipeline.md` §4, en el `.mermaid` y en `README.md`.
2. **Comprobación de cierre (AC-1):** con STORY-186 a STORY-192 en `COMPLETED`, se ejecuta el `grep` de AC-1 y cada línea devuelta se compara con la lista blanca: ADR-0003/0006/0008, ADR-0022, `roadmap.md` (propuestas fechadas), el valor legado en los gates de entrada de `story-implement`, `story-implement-tasks`, `epic-analyze` y `skill-preflight`, y sus evals. Cualquier otra línea es un hallazgo. Si cae en un archivo de otra historia, se resuelve según D-11.
3. **Gate (AC-3, CNF-3):** se ejecutan `npm test` y `npm run verify:repository`. TC-007 se puede ejecutar a mano con `npm run test:eval -- story-fix-plan`, a criterio humano (AGENTS.md).

### D-11 — Menciones residuales tras el `grep` final // satisface: AC-1

- **Elegida:** la épica asigna a esta historia «todo lo que no toque otra historia». Si el `grep` final devuelve una mención fuera de la lista blanca en un archivo que no está en la tabla de componentes:
  - si el archivo no es de ninguna otra historia de la épica (ver «Fuera de alcance» de la historia), se corrige aquí con el mismo criterio de D-02 a D-10 y se registra en `implement-report.md`;
  - si es de otra historia (por ejemplo, `skills/story-analyze/examples/input/story.md`, de STORY-188), no se edita y se informa como hallazgo bloqueante de AC-1 para esa historia.
- **Rechazada:** corregir cualquier mención sin mirar a qué historia pertenece. Invade el alcance de otras historias y puede romper sus evals.

## Decisiones de complejidad justificada

- **Dos filas nuevas en la tabla de §4 de `sddf-commands-pipeline.md` (D-03):** es la única ampliación de contenido de la historia. Una sustitución literal dejaría la tabla diciendo que solo `story-code-review` produce rework, lo que es falso con ADR-0022.
- **Corregir las etiquetas `NEEDS-REFINEMENT` del `.mermaid` (D-05):** están en las mismas aristas que hay que reetiquetar para AC-2. Dejarlas exigiría escribir `NEEDS-REFINEMENT → IMPLEMENT/TODO`, un veredicto inexistente.
- **Sin script de sustitución:** son 25 archivos con ediciones puntuales sobre frontmatter y prosa. Un script sería una abstracción para un solo uso (P12).

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| V-1 | Ninguno de los archivos de la tabla de componentes contiene `READY-FOR-IMPLEMENT` ni `READY-FOR-DEV` | `grep -nE "READY-FOR-(IMPLEMENT\|DEV)"` sobre los 25 archivos de C-1 a C-12 → 0 líneas | AC-1 |
| V-2 | Con STORY-186 a STORY-192 completadas, el `grep` de AC-1 solo devuelve las menciones permitidas | `grep -rnE "READY-FOR-(IMPLEMENT\|DEV)" skills docs README.md`, revisando cada línea contra la lista blanca (Flujo 2) | AC-1 |
| V-3 | `process-for-story-implement.md` muestra `PLAN/DONE` como entrada y `IMPLEMENT/TODO` en los pasos 4, 5 y 6 | `grep -c "IMPLEMENT/TODO"` ≥ 3 y lectura del paso 3 | AC-2 |
| V-4 | `sddf-commands-pipeline.md` §4 muestra `story-analyze → APPROVED → PLAN/DONE → story-implement` y las filas de verify y acceptance | lectura de §4 | AC-2 |
| V-5 | `process-for-epic-development.md` presenta la aprobación del PO como `PLAN/DONE` | `grep -n "PLAN/DONE"` en el paso 2 | AC-2 |
| V-6 | El `.mermaid` tiene tres aristas `NEEDS-CHANGES → IMPLEMENT/TODO` y `NEEDS-REFINEMENT` solo en la arista de `story-evaluation` (`dec_specify`), que sí emite ese veredicto | `grep -c "IMPLEMENT/TODO"` = 3 y `grep -n NEEDS-REFINEMENT` = 1 línea (`dec_specify`) | AC-2 |
| V-7 | El `.mermaid` renderiza sin errores | vista previa Mermaid del editor o mermaid.live (sin dependencias nuevas) y `verify-validation-contract` en verde | CNF-2 |
| V-8 | `README.md` muestra el workflow del ADR con el rework a `IMPLEMENT/TODO` | lectura de L212 y enlace a ADR-0022 | AC-2 |
| V-9 | Fixtures y ejemplos con los estados de la tabla de «Esquema de datos» | lectura del frontmatter de cada archivo | AC-3 |
| V-10 | TC-007 conserva su condición | `not_contains` incluye `substatus: DONE`; `contains` sigue con `status: PLAN` y `substatus: IN-PROGRESS` | AC-3 |
| V-11 | Gate verde | `npm test` y `npm run verify:repository` en exit 0 | AC-3, CNF-3 |
| V-12 | El indicador de OBJ-10 no menciona buffers, y la confirmación del PO queda registrada | lectura de L108 y L112; nota en `implement-report.md`; AC-4 `APPROVED` en `acceptance-report.md` | AC-4 |
| V-13 | No cambian los registros históricos | `git diff --stat` sin `CHANGELOG.md`, `docs/adr/ADR-000{3,6,8}*`, `docs/product/roadmap.md` ni `specs/flow/archive/` | CNF-1 |
| V-14 | Codificación | UTF-8 sin BOM en los archivos editados (bytes iniciales distintos de `EF BB BF`) | CNF-3 |

## Risks / Trade-offs

- **[Riesgo] ADR-0022 no existe todavía** → los wikilinks `[[workflows-sin-estados-buffer]]` romperían `check-doc-links`. *Mitigación:* la historia depende de STORY-186 a STORY-192 (AC-1). Antes de implementar, se comprueba que ADR-0022 exista. Si no existe, la historia se bloquea, en lugar de citar un ADR que no existe.
- **[Riesgo] `grep` final con menciones de otras historias** → AC-1 no se cumple por causas ajenas. *Mitigación:* D-11, que informa la mención como hallazgo de la historia propietaria y no la corrige aquí.
- **[Riesgo] La redacción de OBJ-10 no convence al PO** → retrabajo en la aceptación. *Mitigación:* D-07 registra la redacción como propuesta y el ADR prevé el rechazo de AC-4 con dimensión `requirements-coverage`.
- **[Trade-off] Diez fixtures de `memory-system` quedan en `status: PLAN` sin `substatus`** → no expresan «listo» de forma explícita. Se acepta porque conservar la forma mínima del fixture vale más que el detalle de su estado, que ningún test lee.
- **[Trade-off] Las etiquetas entre comillas del `.mermaid`** son más largas y pueden ensanchar el diagrama. Se acepta porque AC-2 exige que el destino `IMPLEMENT/TODO` se vea.

## Open Questions

Ninguna de diseño. La única decisión que queda abierta es la redacción final del indicador de OBJ-10, que la historia reserva al PO (AC-4) y que D-07 resuelve con una propuesta y un punto de confirmación en la aceptación.

## Autoevaluación (P9, P10)

- **Omisiones:**
  - Los 25 archivos del inventario tienen un componente: C-1 a C-12, donde C-10 agrupa 11 archivos y C-11 y C-12 agrupan varios.
  - Las cinco filas de AC-2 tienen una decisión cada una: D-02, D-03, D-04, D-05 y D-06.
  - AC-3 está cubierto por D-08 y D-09, y AC-4 por D-07.
  - Los CNF tienen su verificación: CNF-1 en V-13, CNF-2 en V-7 y CNF-3 en V-11 y V-14.
- **Ambigüedad:** el destino de las menciones residuales queda resuelto en D-11. El orden de la cola de listos y la forma de citar el ADR se toman de STORY-187.
- **Nombres:** «cola de listos», «valor legado», «ronda» y «rework» se usan con el mismo significado que en la épica y en STORY-186 y STORY-187.
- **Estructura:** los componentes son documentos independientes, sin dependencias cíclicas. La única dependencia externa es ADR-0022, que se referencia por slug y no por contenido. Cada componente tiene una única razón de cambio: el workflow de un público concreto.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: los wikilinks a `[[workflows-sin-estados-buffer]]` y la verificación de AC-1 necesitan que exista ADR-0022 (STORY-186) y que STORY-187 a STORY-192 estén completadas. Hoy STORY-186 está en `READY-FOR-IMPLEMENT/DONE`, sin implementar.
- **Documento afectado**: design.md
- **Acción requerida**: implementar esta historia en último lugar dentro de EPIC-029. Antes de empezar, comprobar que existe `docs/adr/ADR-0022-workflows-sin-estados-buffer.md`.

### CR-002
- **Tipo**: dependencia
- **Descripción**: `docs/guides/sddf-commands-pipeline.md:244` atribuye a `story-specify` los substatus `IN-PROGRESS / READY`, y `READY` no es un substatus del modelo. No es una mención de buffer y no forma parte de esta historia.
- **Documento afectado**: ninguno de esta historia
- **Acción requerida**: registrar una mejora aparte en el backlog si se quiere corregir. No se toca aquí, para no ampliar el alcance.
