---
alwaysApply: false
type: design
id: STORY-183
slug: STORY-183-dod-code-review-sin-criterios-circulares-design
title: "Design: DoD CODE-REVIEW sin criterios circulares"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-28-calibrar-story-code-review-con-review-md
story: STORY-183
created: 2026-11-08
updated: 2026-11-11
related:
  - STORY-183-dod-code-review-sin-criterios-circulares
  - EPIC-28-calibrar-story-code-review-con-review-md
  - STORY-178-adr-guia-de-revision
  - STORY-180-story-code-review-lee-review-md
  - STORY-181-hallazgos-preexistentes
  - STORY-182-verificar-y-deduplicar-hallazgos
---

<!-- Referencias -->
[[STORY-183-dod-code-review-sin-criterios-circulares]] · [[EPIC-28-calibrar-story-code-review-con-review-md]] · [[STORY-178-adr-guia-de-revision]] · [[STORY-182-verificar-y-deduplicar-hallazgos]]

# Diseño técnico: DoD CODE-REVIEW sin criterios circulares

## Context

El DoD de CODE-REVIEW lo evalúa el árbitro de `/story-code-review` en el Paso 4c.1, después de calcular el veredicto con los informes de los cuatro revisores, y sus `❌` entran como filas `DoD-CODE-REVIEW` en la tabla consolidada y en `fix-directives.md`. Estado verificado en el filesystem (2026-11-08):

| Fuente | Hallazgo |
|---|---|
| `docs/guardrails/dod-story-code-review.md:17-25` | Nueve criterios. L21 «Sin hallazgo bloqueante de severidad HIGH o MEDIUM», L24 «El reporte de revisión de código (`code-review-report.md`) está creado o actualizado» y L25 «Revisión de código aprobada (`verdict: APPROVED` en `code-review-report.md`)» se cumplen por la propia revisión o dependen de su veredicto. |
| `skills/sddf-constitution/assets/dod-story/dod-story-code-review.md:17-25` | Mismos nueve criterios; L22 dice «Sin tareas pendientes en `tasks.md`» sin «(si existe el archivo)» (CNF-1). |
| `docs/guardrails/dod-story-code-review.md:17` | «Se cumple [[dod-story-implement]]». El Paso 2d (`SKILL.md:293`) lo evalúa contra todo `dod-story-implement.md`, que repite criterios de este DoD y de los revisores: L19 «Todos los escenarios Gherkin… pasan», L21 «El comportamiento coincide con… `design.md`», L26 «El código sigue las convenciones… `constitution.md`» y L44 «El `tasks.md`… tiene todas las tareas marcadas como `[x]`». |
| `docs/guardrails/dod-story-code-review.md:23` | «Metadatos frontmatter de `story.md` están completos y correctos con status y substatus actualizados». El propio skill escribe `CODE-REVIEW/IN-PROGRESS` en el Paso 1e (`SKILL.md:235-239`) antes de evaluar el DoD. |
| `skills/story-code-review/SKILL.md:214-233` | Paso 1d: sin `IMPLEMENT/DONE` o `CODE-REVIEW/IN-PROGRESS` el skill se detiene sin escribir. Una historia sin `substatus` nunca llega al Paso 4c.1 (ver CR-001). |
| `skills/story-code-review/SKILL.md:410-453` | Paso 4c.1: evalúa cada criterio «semánticamente» contra el código, los cuatro informes y `story.md`; cada `❌` añade una fila `DoD-CODE-REVIEW` con `Archivo:Línea` = `<$DOD_PATH>:<línea>` y recalcula `$MAX_SEVERITY` y `$VERDICT`. Sin regla que impida crear una fila para un defecto que ya reportó un revisor. |
| `skills/story-code-review/SKILL.md:426-429` | Severidad del `❌`: `HIGH` funcional, `MEDIUM` calidad de código, `LOW` documentación. «Tareas pendientes» y «frontmatter incompleto» no encajan en ninguna; un `LOW` no entraría en `fix-directives.md` (AC-3). |
| `skills/story-code-review/SKILL.md:345-351` | Product-Owner-Reviewer: «cada escenario Gherkin tiene correspondencia en el código». Integration-Reviewer: «los componentes respetan la arquitectura de design.md». `agents/tech-lead-reviewer.agent.md:3-5, 28, 55`: revisa contra `constitution.md`. |
| Diseño de STORY-182 (Non-Goals, D-4, D-6, F-5) | Las filas `DoD-CODE-REVIEW` no pasan por la verificación ni por la fusión; 4c.1 se evalúa sobre `$FINDINGS`; «STORY-183 puede decidir que los criterios DoD cubiertos por un revisor no creen filas nuevas». STORY-181 (D-5) y STORY-180 (C-1) también sacan hallazgos de la evaluación del DoD. |
| ADR de STORY-178 (D-3, D-5) | El DoD está por encima de `REVIEW.md`; una historia que modifica `$DOD_PATH` recibe una advertencia que no cambia `verdict`. Esta historia modifica el DoD: la advertencia es esperada. |
| `test/sddf-constitution.test.js:111-122` | Solo comprueba que la plantilla existe. Ninguna prueba compara guardrail y plantilla. |
| `skills/memory-system/examples/dod-*/` | Fixtures del DoD monolítico para la migración (`test/dod-story.test.js`, UT-009). Contienen los criterios viejos a propósito. |
| `skills/story-code-review/examples/example-approved/code-review-report.md:68-79` | Tabla DoD de una versión anterior del DoD; ya no coincide con el guardrail (STORY-180 lo dejó fuera de alcance). |

Stack: Markdown (DoD, skill), pruebas deterministas con `node:test` en `test/`, evals de simulación en `skills/story-code-review/evals/evals.json` (`contains`/`not_contains`), ejecutados a criterio humano.

## Goals / Non-Goals

**Goals:**
- El guardrail y la plantilla no tienen criterios que la revisión satisface por sí misma ni que dependan de su veredicto o de sus bloqueantes. // satisface: AC-1
- Guardrail y plantilla tienen la misma lista de criterios. // satisface: CNF-1
- Un criterio cubierto por un revisor toma el resultado de ese revisor y no crea fila propia. // satisface: AC-2
- Un criterio sin revisor sigue produciendo su hallazgo, con `Archivo:Línea` del DoD y una sola entrada en `fix-directives.md`. // satisface: AC-3
- Una prueba de contrato y evals fijan el comportamiento; el gate sigue verde. // satisface: CNF-2

**Non-Goals:**
- Migrar los DoD ya instalados en proyectos consumidores (`sddf-constitution` no sobrescribe un `dod-story-*.md` existente).
- El tope de LOW (STORY-185), la deduplicación entre revisores y la verificación de evidencia (STORY-182), PREEXISTENTE (STORY-181), `REVIEW.md` (STORY-180).
- Cambiar `assets/code-review-report-template.md` o `assets/fix-directives-template.md`.
- Actualizar los fixtures de `skills/memory-system/examples/dod-*/` y `skills/story-code-review/examples/example-approved/`.
- Regenerar las copias instaladas en `.claude/skills/` y demás runtimes (salida de `agile-sddf install`).

## Componentes afectados

| # | Componente | Acción | Ubicación | AC / CNF |
|---|---|---|---|---|
| C-1 | DoD CODE-REVIEW del repo | modificar | `docs/guardrails/dod-story-code-review.md`: quitar L17, L21, L24 y L25; reescribir L23; `updated` | AC-1, CNF-1 |
| C-2 | Plantilla del DoD CODE-REVIEW | modificar | `skills/sddf-constitution/assets/dod-story/dod-story-code-review.md`: los mismos cambios que C-1 y «(si existe el archivo)» en L22 | AC-1, CNF-1 |
| C-3 | Árbitro de `story-code-review` | modificar | `skills/story-code-review/SKILL.md`: Paso 4c.1 (tabla de criterios conocidos, regla de entrada única, criterios cubiertos); Paso 5b (evidencia de la tabla DoD); tabla de manejo de errores | AC-2, AC-3 |
| C-4 | Evals del skill | modificar (cuatro casos nuevos) | `skills/story-code-review/evals/evals.json` | AC-1, AC-2, AC-3 |
| C-5 | Prueba de contrato del DoD | crear | `test/dod-story-code-review.test.js` | AC-1, CNF-1, CNF-2 |

Sin cambios: los agentes de `skills/story-code-review/agents/`, `skills/sddf-constitution/SKILL.md` (la tabla de la línea 249 copia el archivo sin conocer su contenido), `docs/guardrails/README.md`, `docs/index.md` (el título del guardrail no cambia), `package.json` y `scripts/`.

## Interfaces

| Interfaz | Contrato | AC / CNF |
|---|---|---|
| I-1 — Lista de criterios del DoD | Las líneas `- [ ]` de C-1 y C-2, en este orden y con este texto: (1) «Se cumplen los estándares del proyecto (`constitution.md`)», (2) «Cada escenario Gherkin tiene correspondencia en el código», (3) «Los componentes respetan la arquitectura de `design.md`», (4) «Sin tareas pendientes en `tasks.md` (si existe el archivo)», (5) «Metadatos frontmatter de `story.md` están completos y correctos». En C-1 ocupan las líneas 17 a 21. | AC-1, CNF-1 |
| I-2 — Texto normalizado de un criterio | El texto tras `- [ ] ` o `- [x] `, sin espacios al inicio ni al final y con los espacios internos colapsados a uno. Las comillas invertidas se conservan. Dos criterios son el mismo si su texto normalizado es igual. | AC-2, AC-3 |
| I-3 — Tabla «Criterios conocidos» (Paso 4c.1) | Una fila por criterio de I-1: texto normalizado, `cobertura` (`revisor` o `propia`), revisor que lo cubre o fuente de evidencia propia, y severidad del `❌` propio. Contenido en el Esquema de datos. Un criterio del DoD que no está en la tabla es «no conocido». | AC-2, AC-3 |
| I-4 — Hallazgos que cuentan de un revisor | Los `HIGH`/`MEDIUM` del informe válido de ese revisor que cuentan para el veredicto tras los pasos del Paso 4a que existan al implementar: sin los excluidos por «No reportar» (STORY-180), sin los `no verificado` ni los fusionados en otro revisor (STORY-182) y sin los PREEXISTENTE (STORY-181). Un hallazgo fusionado cuenta para todos los revisores que cita en `Reportado por:`. Si ninguno de esos pasos existe, son los `HIGH`/`MEDIUM` de su tabla `## Hallazgos`. | AC-2 |
| I-5 — Resultado de un criterio cubierto | `✓` si el revisor tiene informe válido y ningún hallazgo que cuente (I-4). `❌` si tiene alguno: `Severidad` = la mayor de esos hallazgos; `Evidencia` = `Cubierto por <Revisor>: <Archivo:Línea>[, …]`. `⚠️` si el revisor está en `$REVIEWERS_BLOCKED`: `Evidencia` = `Revisor sin informe válido`. En ningún caso añade fila a la tabla consolidada. | AC-2 |
| I-6 — Resultado de un criterio propio | Se evalúa con evidencia de los archivos de la historia (I-3). `❌` añade una fila `DoD-CODE-REVIEW` con `Archivo:Línea` = `<$DOD_PATH>:<línea del criterio>` y la severidad de I-3, salvo que la regla de entrada única (D-4) lo impida. | AC-3 |
| I-7 — Fila DoD en `fix-directives.md` | Sin cambios respecto a hoy (`SKILL.md:504-507`): una fila por `❌` propio `HIGH`/`MEDIUM`, numerada tras los hallazgos de los revisores. | AC-3 |

## Decisions

### D-1 — Quitar los tres criterios circulares, sin sustituto // satisface: AC-1

Se eliminan de C-1 y C-2:

- «Sin hallazgo bloqueante de severidad HIGH o MEDIUM»: es la definición de `NEEDS-CHANGES` del Paso 4c; el DoD repetía el veredicto que ayuda a calcular.
- «El reporte de revisión de código (`code-review-report.md`) está creado o actualizado»: el Paso 5 lo crea siempre, después de evaluar el DoD; se marcaba `✓` por haberse ejecutado la revisión (`examples/example-approved/code-review-report.md:77`).
- «Revisión de código aprobada (`verdict: APPROVED` en `code-review-report.md`)»: depende del veredicto que el propio DoD alimenta.

La transición `CODE-REVIEW/DONE` ya exige `verdict: APPROVED` (Paso 6), y `/story-verify` exige `CODE-REVIEW/DONE` para empezar. Quitarlos no deja ningún hueco en el gate.

| Alternativa | Motivo del rechazo |
|---|---|
| Reescribirlos como precondiciones («existe un `code-review-report.md` previo») | Siguen sin poder comprobarse antes del Paso 5 y no aportan nada que no garantice el flujo de estados. |
| Mantenerlos y que el árbitro los marque siempre `⚠️ autorreferente` | AC-1 se evalúa sobre el texto del DoD, no sobre el árbitro; el DoD seguiría teniendo criterios que nadie puede incumplir. |
| Moverlos al DoD de VERIFY | `story-verify` ya valida el estado de entrada; sería un criterio duplicado en otra etapa. |

### D-2 — Quitar «Se cumple [[dod-story-implement]]» y reescribir el criterio de metadatos // satisface: AC-1, AC-2, AC-3

- **«Se cumple [[dod-story-implement]]» se elimina.** Arrastra al DoD de CODE-REVIEW los criterios de `dod-story-implement.md` que repiten a los revisores (Gherkin, `design.md`, `constitution.md`) y al criterio propio de `tasks.md`. Con él, una tarea `- [ ]` daría dos filas `DoD-CODE-REVIEW` (L17 vía `dod-story-implement.md:44` y el criterio 4), contra AC-3, y un escenario Gherkin sin código podría dar una fila propia vía `dod-story-implement.md:19`, contra AC-2. El DoD de IMPLEMENT ya se evalúa en la transición a `IMPLEMENT/DONE`, que es la precondición del Paso 1d, también en cada ronda de corrección. Ver CR-002.
- **«… con status y substatus actualizados» se elimina del criterio de metadatos.** El skill escribe `CODE-REVIEW/IN-PROGRESS` en el Paso 1e antes de evaluar el DoD: esa parte se cumple por la propia revisión (AC-1). El criterio queda «Metadatos frontmatter de `story.md` están completos y correctos», con el significado de I-3.

La frase del Paso 2d sobre `Se cumple [[dod-story-implement]]` (`SKILL.md:293`) se conserva: los DoD instalados en consumidores la siguen teniendo.

| Alternativa | Motivo del rechazo |
|---|---|
| Conservar «Se cumple [[dod-story-implement]]» y deduplicar sus subcriterios contra los revisores y el criterio 4 | Exige mapear más de veinte criterios de otro archivo que cada proyecto edita; la evaluación ya ocurrió en el gate de IMPLEMENT. |
| Quitar el criterio 4 («Sin tareas pendientes») y dejar el de IMPLEMENT | AC-3 nombra el criterio 4 en su primer ejemplo. |
| Conservar el criterio de metadatos completo | Una parte del criterio la satisface el propio Paso 1e (AC-1). |

### D-3 — Criterios cubiertos por un revisor: tabla explícita en el Paso 4c.1 // satisface: AC-2

La historia deja abierto el mecanismo (Notas). Se elige un **mapeo explícito criterio → revisor** en una tabla «Criterios conocidos» dentro del Paso 4c.1 (I-3). El árbitro compara cada criterio del DoD por texto normalizado (I-2) con la tabla:

- Criterio 1 (`constitution.md`) → Tech-Lead-Reviewer, que ya revisa contra `$CONSTITUTION_PATH` (`tech-lead-reviewer.agent.md:28, 55`). La historia nombra solo dos criterios cubiertos; este se añade porque, evaluado por el árbitro, reportaría de nuevo los defectos de convención que reporta el Tech-Lead.
- Criterio 2 (Gherkin) → Product-Owner-Reviewer.
- Criterio 3 (`design.md`) → Integration-Reviewer.

Su resultado sale de I-4 e I-5: `❌` con la severidad y la ubicación de los hallazgos del revisor, sin fila nueva. El defecto entra en `fix-directives.md` una vez, como hallazgo del revisor. No cambian `$MAX_SEVERITY` ni `$VERDICT`, porque los hallazgos del revisor ya cuentan en 4b-4c.

| Alternativa | Motivo del rechazo |
|---|---|
| Deduplicar las filas DoD contra los hallazgos de los revisores | STORY-182 deja las filas `DoD-CODE-REVIEW` fuera de la fusión (cita el DoD, no el código: rutas distintas, nunca candidatas). Y AC-2 pide que el DoD «no añada un hallazgo propio», no que lo cree y luego lo fusione. |
| Anotar el revisor en el propio DoD (`<!-- revisor: … -->` en la línea del criterio) | El texto del criterio lo leen también `memory-system check` y la migración del DoD monolítico; un comentario en la línea pasaría al texto del criterio. Los DoD ya instalados no tendrían la anotación. |
| Juicio libre del árbitro («¿este criterio lo cubre un revisor?») | Variaría entre ejecuciones; ni la prueba ni los evals podrían fijarlo. |

### D-4 — Regla de entrada única para los criterios propios // satisface: AC-2, AC-3

Un criterio propio o no conocido solo crea fila `DoD-CODE-REVIEW` si su evidencia de incumplimiento no es ya un hallazgo que cuenta de un revisor (I-4). Si lo es, el criterio queda `❌` con `Evidencia` = `Ya reportado por <Revisor>: <Archivo:Línea>` y sin fila. Cubre los DoD de los consumidores, cuyos criterios no conocidos pueden solaparse con un revisor (p. ej. el viejo «Se cumple [[dod-story-implement]]»).

| Alternativa | Motivo del rechazo |
|---|---|
| Aplicar solo el mapeo de D-3 | Un criterio no conocido seguiría pudiendo duplicar a un revisor en los DoD instalados. |
| Prohibir que un criterio propio use informes de revisores como evidencia | Un criterio no conocido puede necesitarlos para su `✓`; lo que se evita es la fila duplicada, no la lectura. |

### D-5 — Evidencia y severidad fijas para los dos criterios propios // satisface: AC-3

- **Criterio 4 (`tasks.md`):** si `$STORY_DIR/tasks.md` no existe → `✓` con `Evidencia` = `tasks.md no existe`. Si existe y tiene alguna línea `- [ ]` → `❌ MEDIUM` con `Evidencia` = `tasks.md:<línea>[, …]`. Si no → `✓`.
- **Criterio 5 (metadatos):** campos requeridos `type`, `id`, `slug`, `title`, `status`, `substatus`, `parent` (puede ser `null`), `created`, `updated`, los del template de `story-creation`. «Correctos»: `id` es el prefijo `STORY-NNN` del directorio y `slug` es el nombre del directorio. Falta un campo o hay una incoherencia → `❌ MEDIUM` con `Evidencia` = `story.md: falta <campo>` o `story.md: <campo> no coincide con el directorio`. El valor de `status`/`substatus` no se juzga (lo escribe el Paso 1e).

Las dos severidades son `MEDIUM`: son defectos del incremento que deben corregirse antes de avanzar (AC-3 exige su entrada en `fix-directives.md`, que solo admite `HIGH`/`MEDIUM`). Los criterios no conocidos mantienen la regla de severidad actual (`SKILL.md:426-429`) y la regla de duda.

| Alternativa | Motivo del rechazo |
|---|---|
| Mantener la clasificación genérica `HIGH`/`MEDIUM`/`LOW` | «Tareas pendientes» o «falta un campo» podrían leerse como documentación (`LOW`) y no entrarían en `fix-directives.md` (AC-3). |
| `HIGH` | No son fallos funcionales ni regresiones; `HIGH` queda para esos casos según la regla actual. |

### D-6 — Evals primero // satisface: AC-1, AC-2, AC-3

Se escriben en `evals.json` antes de modificar `SKILL.md` (principio 11, CS-8), con el formato de simulación de TC-002. Los casos añaden en `input` el campo `dod_criteria` (lista de `{ "line": <n>, "text": "<criterio>" }`) con I-1, para no depender del DoD del working tree. Numeración: los siguientes libres tras las reservas de STORY-177 (TC-024, TC-025), STORY-180 (TC-026 a TC-029) y STORY-181/STORY-182 (TC-030 a TC-033, cada una con su regla de «siguientes libres»); nominalmente TC-038 a TC-041.

- **TC-038 `dod-sin-criterios-autorreferentes`** (AC-1): revisores sin hallazgos, `tasks.md` con todas las tareas `[x]`, frontmatter completo. `contains`: `(verdict: APPROVED)`, `5/5 criterios ✓`. `not_contains`: `está creado o actualizado`, `Revisión de código aprobada`, `Sin hallazgo bloqueante`, `Se cumple [[dod-story-implement]]`.
- **TC-039 `criterio-cubierto-por-revisor-no-duplica`** (AC-2): Product-Owner `MEDIUM` en `specs/flow/STORY-040-x/story.md:30` («escenario AC-2 sin correspondencia en el código», con `failure_scenario` para STORY-182); demás revisores sin hallazgos. `contains`: `(verdict: NEEDS-CHANGES)`, `1 hallazgo(s) bloqueante(s)`, `Cubierto por Product-Owner-Reviewer`, `round: 1`. `not_contains`: `DoD-CODE-REVIEW`, `2 hallazgo(s) bloqueante(s)`.
- **TC-040 `criterio-propio-tasks-pendiente`** (AC-3, fila 1): revisores sin hallazgos; `tasks.md` con `- [ ] T-3` en la línea 30. `contains`: `DoD-CODE-REVIEW`, `dod-story-code-review.md:20`, `Sin tareas pendientes en`, `tasks.md:30`, `1 hallazgo(s) bloqueante(s)`, `(verdict: NEEDS-CHANGES)`, `round: 1`. `not_contains`: `(verdict: APPROVED)`, `2 hallazgo(s) bloqueante(s)`.
- **TC-041 `criterio-propio-frontmatter-incompleto`** (AC-3, fila 2, con el campo de CR-001): revisores sin hallazgos; `story.md` sin `created`. `contains`: `DoD-CODE-REVIEW`, `dod-story-code-review.md:21`, `falta created`, `1 hallazgo(s) bloqueante(s)`, `(verdict: NEEDS-CHANGES)`. `not_contains`: `(verdict: APPROVED)`, `2 hallazgo(s) bloqueante(s)`.

| Alternativa | Motivo del rechazo |
|---|---|
| Que los casos lean el DoD del working tree | El resultado cambiaría con cualquier edición del guardrail; `dod_criteria` hace el caso autocontenido. |
| Solo la prueba de contrato | No comprueba el comportamiento del árbitro (AC-2, AC-3). |

### D-7 — Prueba de contrato del DoD // satisface: AC-1, CNF-1, CNF-2

`test/dod-story-code-review.test.js` (`node:test`, lectura de archivos como `test/sddf-constitution.test.js`) fija:

1. Las listas de criterios de C-1 y C-2 son iguales, en orden (CNF-1).
2. Ningún criterio de C-1 ni de C-2 contiene `code-review-report.md`, `verdict`, `APPROVED`, `HIGH o MEDIUM` ni `[[dod-story-implement]]`, ni el texto `status y substatus actualizados` (AC-1).
3. Cada texto de la tabla «Criterios conocidos» de `skills/story-code-review/SKILL.md` es un criterio de C-1 y de C-2, y viceversa. Si alguien edita un criterio en el DoD y no en la tabla, falla.
4. La tabla nombra `Tech-Lead-Reviewer`, `Product-Owner-Reviewer` e `Integration-Reviewer` como revisores de los criterios 1, 2 y 3.

`memory-system check` y `npm run verify:repository` validan el frontmatter del guardrail, que no cambia salvo `updated`.

| Alternativa | Motivo del rechazo |
|---|---|
| Ampliar `test/sddf-constitution.test.js` | Esa prueba cubre los artefactos del skill; la consistencia DoD ↔ árbitro cruza dos skills y un guardrail. |
| Sin aserción 3 | El mapeo de D-3 por texto se rompería en silencio con la primera edición del DoD. |

## Esquema de datos // satisface: AC-1, AC-2, AC-3

**DoD resultante (C-1; C-2 idéntico salvo `created`/`updated` con placeholders):**

| Línea | Criterio |
|---|---|
| 17 | Se cumplen los estándares del proyecto (`constitution.md`) |
| 18 | Cada escenario Gherkin tiene correspondencia en el código |
| 19 | Los componentes respetan la arquitectura de `design.md` |
| 20 | Sin tareas pendientes en `tasks.md` (si existe el archivo) |
| 21 | Metadatos frontmatter de `story.md` están completos y correctos |

**Tabla «Criterios conocidos» del Paso 4c.1 (C-3):**

| Criterio (texto normalizado) | Cobertura | Revisor / evidencia propia | Severidad del `❌` propio |
|---|---|---|---|
| Se cumplen los estándares del proyecto (`constitution.md`) | revisor | Tech-Lead-Reviewer | — |
| Cada escenario Gherkin tiene correspondencia en el código | revisor | Product-Owner-Reviewer | — |
| Los componentes respetan la arquitectura de `design.md` | revisor | Integration-Reviewer | — |
| Sin tareas pendientes en `tasks.md` (si existe el archivo) | propia | líneas `- [ ]` de `$STORY_DIR/tasks.md` (D-5) | `MEDIUM` |
| Metadatos frontmatter de `story.md` están completos y correctos | propia | campos y coherencia de D-5 | `MEDIUM` |

**Fila de la tabla DoD del informe** (`{{DOD_CODE_REVIEW_SECTION}}`, columnas actuales `# | Criterio | Estado | Severidad | Evidencia`): un criterio cubierto con `❌` lleva la severidad del revisor y `Cubierto por <Revisor>: <Archivo:Línea>`; un propio con `❌` sin fila (D-4), `Ya reportado por <Revisor>: <Archivo:Línea>`.

## Flujos clave

### F-1 — DoD sin criterios autorreferentes // AC-1

1. El Paso 2d carga los cinco criterios de I-1.
2. 4c.1 los compara con la tabla: tres cubiertos, dos propios.
3. Sin hallazgos de revisores, `tasks.md` cerrado y frontmatter completo → `5/5 criterios ✓`, `APPROVED`.
4. Ningún criterio cambia su resultado por la existencia del informe o por el veredicto.

### F-2 — Defecto cubierto por un revisor // AC-2

1. El Product-Owner-Reviewer reporta un `MEDIUM` en el escenario sin código.
2. 4b-4c: `$MAX_SEVERITY = MEDIUM`, `NEEDS-CHANGES`, un bloqueante.
3. 4c.1: el criterio 2 es cubierto → `❌ MEDIUM`, `Cubierto por Product-Owner-Reviewer: <Archivo:Línea>`, sin fila nueva. `$MAX_SEVERITY` y `$VERDICT` no cambian.
4. 4f: `fix-directives.md` tiene una fila, la del revisor. El informe lista el defecto una vez en `### Cobertura de Requisitos`; la tabla DoD lo cita, no lo repite como hallazgo.

### F-3 — Criterio propio incumplido // AC-3

1. Revisores sin hallazgos que cuenten.
2. 4c.1: criterio 4 → `tasks.md:30` tiene `- [ ]` → `❌ MEDIUM`; D-4 no encuentra hallazgo de revisor con esa evidencia → fila `DoD-CODE-REVIEW`, `docs/guardrails/dod-story-code-review.md:20`.
3. Recalculo: `$MAX_SEVERITY = MEDIUM`, `NEEDS-CHANGES`.
4. 4e-4f: lista blanca con `docs/guardrails/dod-story-code-review.md` (comportamiento actual de las filas DoD), una fila en `fix-directives.md`.

### F-4 — Degradación // P7

- **DoD instalado con los criterios viejos (consumidores):** los criterios no conocidos se evalúan como hoy, con la regla de entrada única de D-4. Los tres circulares siguen apareciendo hasta que el proyecto edite su DoD (Non-Goals).
- **Criterio conocido con un texto ligeramente distinto** (un consumidor lo editó): es no conocido; se evalúa con la regla genérica y D-4 evita la duplicación.
- **Revisor que cubre un criterio sin informe válido:** `⚠️`, sin fila; el veredicto ya es `BLOCKED` o `NEEDS-CHANGES` por el Paso 4c.
- **`--single-agent`:** solo hay Tech-Lead; los criterios 2 y 3 quedan `⚠️ Revisor sin informe válido` (no se lanzó), sin bloquear.
- **`tasks.md` ilegible:** `⚠️` con la evidencia del error, por la regla de duda.
- **La historia modifica `$DOD_PATH`** (esta misma historia): advertencia de STORY-180/ADR (D-5), sin efecto en `verdict`.

### F-5 — Puntos de cambio // P6

- Un criterio nuevo del DoD cubierto por un revisor: una fila en la tabla de I-3; la prueba de D-7 obliga a añadirla.
- Si STORY-182, STORY-181 o STORY-180 se implementan después, I-4 ya define qué hallazgos cuentan con o sin sus pasos.
- Si un ADR futuro asigna el criterio de `constitution.md` a varios revisores, la columna de revisor admite una lista; I-5 tomaría la mayor severidad.

## Decisiones de complejidad justificada

- **Tabla «Criterios conocidos» (D-3):** sin ella, «cubierto por un revisor» lo decidiría el LLM en cada ejecución. Cinco filas que la prueba mantiene alineadas con el DoD.
- **Regla de entrada única (D-4):** una frase que protege los DoD de consumidores, que esta historia no migra.
- **Severidades fijas para dos criterios (D-5):** la regla genérica no da un resultado único para ellos y AC-3 exige que entren en `fix-directives.md`.
- **Prueba nueva (D-7):** los evals se ejecutan a criterio humano; la prueba de contrato corre en cada `npm test`.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Ningún criterio circular en guardrail ni plantilla | D-7, aserción 2; TC-038 | AC-1 |
| 2 | `memory-system check` pasa con el guardrail modificado | `npm run verify:repository` (incluye `memory-system check`) | AC-1, CNF-2 |
| 3 | Un defecto de un revisor no crea fila DoD y aparece una vez en `fix-directives.md` y en el informe | TC-039 | AC-2 |
| 4 | Criterio propio de `tasks.md` incumplido: fila DoD con `dod-story-code-review.md:20`, una entrada en `fix-directives.md` | TC-040 | AC-3 |
| 5 | Criterio propio de metadatos incumplido: fila DoD con `dod-story-code-review.md:21`, una entrada | TC-041 | AC-3 |
| 6 | Guardrail y plantilla con los mismos criterios | D-7, aserción 1 | CNF-1 |
| 7 | La tabla del árbitro y el DoD no divergen | D-7, aserciones 3 y 4 | AC-2, AC-3 |
| 8 | Gate verde | `npm run verify:repository` y `npm test` con código 0 | CNF-2 |

## Risks / Trade-offs

- **[Trade-off] Los consumidores conservan sus criterios circulares** → fuera de alcance por la regla de no sobrescritura; D-4 evita al menos la duplicación con los revisores.
- **[Riesgo] Quitar «Se cumple [[dod-story-implement]]» oculta un criterio de IMPLEMENT que el gate de IMPLEMENT dejó pasar** → ese gate es `enforcement: error` y se vuelve a aplicar en cada ronda de corrección; el DoD de CODE-REVIEW no era un segundo control fiable (evaluaba CI con `⚠️`). Ver CR-002.
- **[Riesgo] Un revisor marca `❌` el criterio cubierto con un hallazgo que no es de ese criterio** (p. ej. un `MEDIUM` del Product-Owner sobre `testcases.md`) → el criterio refleja el resultado del revisor en su dimensión, que es lo que pide AC-2; no crea filas, así que no afecta al veredicto ni a `fix-directives.md`.
- **[Conflicto de edición] STORY-180, STORY-181 y STORY-182 también editan el Paso 4c.1** → I-4 se redacta para cualquier orden; C-3 solo añade la tabla, la regla de entrada única y los dos criterios propios.
- **[Conflicto de numeración] STORY-181 y STORY-182 reservan los mismos TC-030 a TC-033** → esta historia toma los siguientes libres al implementar (D-6).
- **[Limitación] Las copias instaladas** (`.claude/skills/story-code-review/`…) no tienen los cambios hasta reinstalar.

## Open Questions

Ninguna. El mecanismo abierto de la historia lo fija D-3 (mapeo explícito) con D-4 como salvaguarda.

## Autoevaluación (P9, P10)

- **Omisiones:** AC-1 (D-1, D-2, D-7, TC-038), AC-2 (D-3, D-4, TC-039), AC-3 (D-4, D-5, TC-040, TC-041), CNF-1 (C-2, D-7), CNF-2 (D-7, contrato 8). La posible división de las Notas no es necesaria: el cambio en `story-code-review` se limita al Paso 4c.1 y una línea del 5b.
- **Ambigüedad:** «cubierto por un revisor» (I-3), «hallazgo que cuenta» (I-4), «completos y correctos» (D-5) y «mismo criterio» (I-2) tienen definición operable.
- **Nombres:** «criterio cubierto», «criterio propio», «criterio no conocido», `DoD-CODE-REVIEW`, `$DOD_PATH` y `$REVIEWERS_BLOCKED` se usan igual que en la historia y en `SKILL.md`.
- **Estructura:** sin dependencias cíclicas: los revisores producen hallazgos; el árbitro los lee y evalúa el DoD; el DoD no conoce al árbitro. La tabla de I-3 es la única interfaz nueva entre DoD y árbitro, y la prueba de D-7 la mantiene. Sin código.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: inviabilidad
- **Descripción**: El segundo ejemplo de AC-3 («`story.md` no tiene el campo `substatus`») no puede ocurrir en el Paso 4c.1: el Paso 1d se detiene sin escribir si `story.md` no está en `IMPLEMENT/DONE` o `CODE-REVIEW/IN-PROGRESS`, y el Paso 1e escribe `substatus: IN-PROGRESS` antes de evaluar el DoD. El diseño usa un campo que el skill no escribe (`created`) en TC-041.
- **Documento afectado**: story.md
- **Acción requerida**: en el `Ejemplos:` de AC-3, cambiar `"story.md" no tiene el campo "substatus"` por `"story.md" no tiene el campo "created"`.

### CR-002
- **Tipo**: dependencia
- **Descripción**: D-2 elimina del DoD «Se cumple [[dod-story-implement]]», que la historia no nombra entre los criterios a quitar. Es necesario para AC-2 y AC-3: ese criterio arrastra criterios de `dod-story-implement.md` que duplican a los revisores y al criterio de `tasks.md`, y una tarea pendiente daría dos entradas en `fix-directives.md`. También reescribe el criterio de metadatos sin «con status y substatus actualizados» (lo satisface el Paso 1e).
- **Documento afectado**: story.md
- **Acción requerida**: añadir a las Notas de la historia los dos cambios, o confirmarlos en `/story-acceptance`.

### CR-003
- **Tipo**: dependencia (descubierta en la implementación, 2026-11-11)
- **Descripción**: `test/story-code-review-evidence-dedup.test.js` (STORY-182, D-8) exige que todo eval que espera `NEEDS-CHANGES` traiga un hallazgo de revisor `HIGH`/`MEDIUM` con `Archivo:Línea` y escenario de fallo. TC-040 y TC-041 llegan a `NEEDS-CHANGES` por una fila `DoD-CODE-REVIEW`, sin hallazgo de revisor, y esas filas no pasan por la verificación del Paso 4a.3. La prueba ahora exime a los casos cuyo `expected.contains` incluye `DoD-CODE-REVIEW`; el resto de los casos `NEEDS-CHANGES` se siguen comprobando igual.
- **Documento afectado**: `test/story-code-review-evidence-dedup.test.js` (fuera de los Componentes afectados de este diseño)
- **Acción requerida**: ninguna; se registra para la revisión de código.
