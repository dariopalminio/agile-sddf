---
alwaysApply: false
type: design
id: STORY-192
slug: STORY-192-epica-sin-ready-for-dev-design
title: "Design: Épica sin READY-FOR-DEV"
story: STORY-192
created: 2026-11-13
updated: 2026-11-13
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-029-eliminar-estados-buffer
related:
  - STORY-192-epica-sin-ready-for-dev
  - EPIC-029-eliminar-estados-buffer
  - STORY-186-adr-de-workflows-sin-estados-buffer
  - STORY-187-dominio-y-requisitos-sin-buffers
---

<!-- Referencias -->
[[STORY-192-epica-sin-ready-for-dev]]

## Context

EPIC-029 retira los estados buffer `READY-FOR-IMPLEMENT` y `READY-FOR-DEV`. Esta historia cubre los tres skills de épica que aún los nombran. Estado verificado en el filesystem el 2026-11-13:

| Archivo | Línea | Mención actual |
|---|---|---|
| `skills/epic-analyze/SKILL.md` | 5 | `description`: «Usar antes de aprobar una épica en PLAN para READY-FOR-DEV» |
| `skills/epic-analyze/SKILL.md` | 12 | «antes de aprobar la épica para `READY-FOR-DEV`» |
| `skills/epic-analyze/SKILL.md` | 77 | «hoy ningún skill gestiona `PLAN → READY-FOR-DEV`» |
| `skills/epic-analyze/SKILL.md` | 236 | Orden de madurez `SPECIFY → PLAN → READY-FOR-IMPLEMENT → IMPLEMENT → …` |
| `skills/epic-analyze/SKILL.md` | 243 | Fila `no-clasificable`: ejemplos `BACKLOG`, `READY-FOR-VERIFY` (sin buffer; se conserva) |
| `skills/epic-analyze/SKILL.md` | 343 | «antes de aprobar la épica para `READY-FOR-DEV`» |
| `skills/epic-analyze/README.md` | 20, 30 | «la transición `PLAN → READY-FOR-DEV`», «aprobarse hacia `READY-FOR-DEV`» |
| `skills/epic-refine/SKILL.md` | 227 | Línea `Replanifica:` para historias de cierre en `PLAN` o `READY-FOR-IMPLEMENT` |
| `skills/epic-refine/references/sal-corrections.md` | 63, 127 | Fila de estados admitidos y resumen final con `READY-FOR-IMPLEMENT` |
| `skills/epic-generate-all-stories/SKILL.md` | 227 | «No usar `READY-FOR-IMPLEMENT`: saltaría los gates…» |

Hechos de contexto:

- Hoy el Paso 5c de `epic-analyze` clasifica `READY-FOR-IMPLEMENT` como `lista`, porque está en su orden de estados. Si solo se retira del orden, una historia planificada antes de 6.0.0 pasaría a `no-clasificable` y daría MAD-03. AC-2 y CS-4 lo prohíben.
- El Paso 9 de `epic-analyze` (modo manual) no tiene línea de siguiente paso. El texto de la línea 343 no se muestra al usuario. AC-1 pide que el siguiente paso indique la aprobación manual a `PLAN/DONE`.
- `sal-corrections.md` §«Estados admitidos» no define qué pasa con un `status` fuera de la tabla, por ejemplo `BACKLOG`. Si se quita `READY-FOR-IMPLEMENT` de la tabla, el valor legado cae en ese caso no definido.
- Evals actuales: `skills/epic-analyze/evals/evals.json` v1.5.0 (TC-001…TC-034; `BACKLOG` → MAD-03 en TC-024; estado posterior → `lista` en TC-022). `skills/epic-refine/evals/evals.json` v1.5.0 (TC-001…TC-026; la historia de cierre en `SPECIFY` está en TC-009 con el fixture `examples/cobertura-cierre/`; la historia de cierre implementada está en TC-013). Ningún eval prueba una historia de cierre en `PLAN`. `skills/epic-generate-all-stories/evals/evals.json` v1.1.0 no nombra buffers.
- El ADR que sustituye a ADR-0006 y ADR-0008 lo crea STORY-186 como **ADR-0022**. Hoy no existe: `docs/adr/` llega a ADR-0021.
- STORY-187 reescribe `domain-story-lifecycle` §4.1 con el literal `SPECIFY → PLAN → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE → DELIVER → COMPLETED`. Su CR pide a esta historia usar ese literal (`design.md` de STORY-187, CR sobre `epic-analyze`).
- Ninguna prueba de `test/` ni ningún script de `scripts/` depende del texto que cambia: `verify-validation-contract.js` solo lee el template del reporte, y `install.test.js:415` solo verifica que `SKILL.md` existe.

## Goals / Non-Goals

**Goals:**

- `epic-analyze` declara el orden de madurez sin buffers y acepta el valor legado `READY-FOR-IMPLEMENT` como `lista`, con una nota que no cuenta para el veredicto. // satisface: AC-1, AC-2
- `epic-analyze` indica, en el resumen manual, que la aprobación de la épica es una edición manual del PO a `PLAN/DONE`. No escribe `status` ni `substatus`. // satisface: AC-1, CNF-2
- `epic-refine` y `sal-corrections.md` replanifican solo las historias de cierre en `PLAN` y no nombran ningún buffer. // satisface: AC-3, CNF-1
- `epic-generate-all-stories` deja de nombrar el buffer. // satisface: CNF-1
- Los evals se escriben antes que el texto de los `SKILL.md`. // satisface: CNF-3

**Non-Goals:**

- Un skill que apruebe la épica o escriba `PLAN/DONE` en `epic.md`.
- Los documentos de dominio (`domain-epic-lifecycle`, `domain-story-lifecycle`): STORY-187.
- El aviso de `skill-preflight` para el valor legado: STORY-191.
- Cambiar el template del reporte (`assets/epic-analyze-report-template.md`) o el bloque de retorno de cuatro líneas del modo Agent.
- Los destinos de runtime (`.claude/skills/…`, etc.): los regenera `agile-sddf install`.
- Ejecutar `npm run test:eval`: se corre a criterio humano (AGENTS.md).

## Componentes afectados

| ID | Componente | Acción | Ubicación | Satisface |
|---|---|---|---|---|
| C-1 | Evals de `epic-analyze` | modificar: TC-035, TC-036 y TC-037 nuevos; `version` 1.5.0 → 1.6.0 | `skills/epic-analyze/evals/evals.json` | AC-1, AC-2, CNF-3 |
| C-2 | Evals y fixture de `epic-refine` | modificar: TC-027 y TC-028 nuevos; `Replanifica:` en `not_contains` de TC-009; `version` 1.5.0 → 1.6.0. Crear los fixtures `examples/cobertura-cierre-planificada/` y `examples/cobertura-cierre-status-desconocido/` | `skills/epic-refine/evals/evals.json`, `skills/epic-refine/examples/` | AC-3, CNF-3 |
| C-3 | Skill `epic-analyze` | modificar las líneas 5, 12, 77, 236, la tabla de 238–243, el Paso 9 manual y la línea 343 | `skills/epic-analyze/SKILL.md` | AC-1, AC-2, CNF-1, CNF-2 |
| C-4 | README de `epic-analyze` | modificar las líneas 20 y 30 | `skills/epic-analyze/README.md` | AC-1, CNF-1 |
| C-5 | Skill `epic-refine` | modificar la línea 227 | `skills/epic-refine/SKILL.md` | AC-3, CNF-1 |
| C-6 | Catálogo SAL | modificar §3 (fila nueva), §«Estados admitidos» (líneas 61–65) y §6 (línea 127) | `skills/epic-refine/references/sal-corrections.md` | AC-3, CNF-1 |
| C-7 | Skill `epic-generate-all-stories` | modificar la línea 227 | `skills/epic-generate-all-stories/SKILL.md` | CNF-1 |

No se crea ningún componente nuevo: las reglas nuevas se suman a las tablas de clasificación ya existentes (Paso 5c de `epic-analyze`, §3 y §«Estados admitidos» de `sal-corrections.md`). // P3

## Decisions

### D-1 — Valor legado en `epic-analyze`: fila propia en la tabla de clasificación // satisface: AC-2, CNF-1

- **Elegida:** quitar `READY-FOR-IMPLEMENT` del orden de estados (línea 236) y añadir a la tabla del Paso 5c.1 una fila antes de la de `no-clasificable`:

  | `status` | `substatus` | Clasificación |
  |---|---|---|
  | `READY-FOR-IMPLEMENT` (valor legado, anterior a 6.0.0) | no se evalúa | `lista` + nota de valor legado |

  Texto de la nota, que va a `notas-analisis`: `` `<ruta del story.md>:<línea de status>`: STORY-NNN conserva el valor legado `READY-FOR-IMPLEMENT`, que se lee como planificación aprobada (`PLAN/DONE`); no cuenta para el veredicto ``. Debajo de la tabla, una frase dice que la nota no es hallazgo MAD ni cuenta en el Paso 6, y que la historia cuenta como `lista` en `Madurez de historias hijas`. La regla es la única mención de `READY-FOR-IMPLEMENT` en `epic-analyze` (CNF-1).
- **Rechazada A — hallazgo WARNING nuevo (MAD-04):** una épica sana con 4 historias legadas bajaría a `NEEDS-REFINEMENT`. La historia lo descarta («decidido con el usuario, 2026-11-13»).
- **Rechazada B — dejar `READY-FOR-IMPLEMENT` dentro del orden de madurez:** CS-6 no permite el buffer como estado del workflow, y STORY-187 retira ese orden del dominio.
- **Rechazada C — sin nota:** AC-2 exige la nota que cita STORY-NNN.

### D-2 — Orden de madurez: literal de STORY-187 // satisface: AC-1, CNF-1

- **Elegida:** línea 236 = `SPECIFY → PLAN → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE → DELIVER → COMPLETED`, más el terminal `CANCELED`. Se mantiene la cita «según `domain-story-lifecycle` §4.1 y §5», que tras STORY-187 dice lo mismo. La fila `PLAN … COMPLETED` → `lista` no cambia, y `PLAN/DONE` e `IMPLEMENT/TODO` siguen como `lista` (AC-1).
- **Rechazada — referenciar el dominio sin copiar el orden:** el skill se distribuye sin `docs/domains/` (la línea 236 ya lo explica), así que el orden debe estar en el propio skill.

### D-3 — Siguiente paso de aprobación en el resumen manual // satisface: AC-1, CNF-2

- **Elegida:** el bloque manual del Paso 9 añade una última línea según el veredicto:
  - `APPROVED`: `` Siguiente paso: el PO aprueba la épica editando a mano su estado a `PLAN/DONE` (este análisis no lo escribe). ``
  - `NEEDS-REFINEMENT`: `` Siguiente paso: /epic-refine <EPIC_ID> y volver a ejecutar /epic-analyze <EPIC_ID>. ``

  Las líneas 5, 12, 77 y 343 cambian «aprobar … para `READY-FOR-DEV`» por «antes de que el PO apruebe la épica (`PLAN/DONE`, edición manual)». La línea 77 queda: «nunca se escriben `status` ni `substatus`: la aprobación de la épica (`PLAN/DONE`) es una edición manual del PO, y un análisis no debe tomar esa decisión por él».
- **Rechazada A — añadir la línea al bloque de retorno del modo Agent:** el contrato es de «exactamente estas cuatro líneas» y lo leen orquestadores.
- **Rechazada B — escribirla en el reporte (sección `veredicto`):** hay que cambiar el template del reporte y su contrato de validación (`verify-validation-contract.js` lee ese template). Es más alcance del que pide AC-1.
- **Rechazada C — solo cambiar el texto de la línea 343:** ese texto no se muestra al usuario, y AC-1 pide que el siguiente paso lo indique la ejecución.

### D-4 — Historia de cierre SAL con `status` fuera del workflow en `epic-refine` // satisface: AC-3, CNF-1

- **Elegida:** §«Estados admitidos» de `sal-corrections.md` queda con tres filas: `SPECIFY` (o sin `status`) → se aplica; `PLAN` → se aplica + `Replanifica:`; `IMPLEMENT` o posterior → fuera de alcance. Se añade una cuarta: «Cualquier otro valor (fuera del workflow de historia)» → fuera de alcance, responsable `PO`. La tabla de §3 suma la nota `` <STORY-NNN> con status `<valor>` fuera del workflow de historia: normaliza su status antes de asignarle cobertura ``, con `<valor>` literal entre comillas invertidas. Así el valor legado se trata sin nombrarlo: el reporte cita el valor del `story.md` y el skill no lo menciona. Las líneas 127 de `sal-corrections.md` y 227 de `SKILL.md` dicen «en `PLAN`».
- **Rechazada A — tratar el valor legado como `PLAN`:** para hacerlo hay que nombrarlo en `epic-refine`, y CNF-1 y CS-6 lo prohíben.
- **Rechazada B — tratar cualquier `status` desconocido como `SPECIFY`:** añadiría un AC a una historia de la que no se sabe la etapa. La misma regla de `epic-analyze` lo descarta: «un estado desconocido no se asimila a `SPECIFY`».
- **Rechazada C — no definir el caso:** cerraría la tabla con un hueco no determinista y violaría la regla de determinismo de `epic-refine`.

### D-5 — Evals primero, con un fixture por estado nuevo // satisface: CNF-3, AC-1, AC-2, AC-3

- **Elegida:**
  - `epic-analyze`, en el formato inline de TC-022/TC-024 (`epic_md_lines` + `stories` con `body_lines`), `mode: manual`:
    - **TC-035** `epica-sin-buffers-madurez-y-aprobacion-manual` (AC-1): STORY-201 `SPECIFY/DONE` (cita el criterio y SMOKE-1), STORY-202 `PLAN/DONE`, STORY-203 `IMPLEMENT/TODO`. `contains`: `verdict: APPROVED`, `Madurez de historias hijas: 3/3`, `PLAN/DONE`, `Siguiente paso`. `not_contains`: `MAD-0`, `READY-FOR-DEV`, `epic.md ===`.
    - **TC-036** `historia-legada-ready-for-implement-nota-sin-mad-03` (AC-2, fila 1): STORY-201 `SPECIFY/DONE` (con cobertura) y STORY-202 `READY-FOR-IMPLEMENT/DONE`. `contains`: `verdict: APPROVED`, `warnings: 0`, `Madurez de historias hijas: 2/2`, `valor legado`, `STORY-202`. `not_contains`: `MAD-03`.
    - **TC-037** `status-ready-for-verify-no-clasificable-mad-03` (AC-2, fila 2): STORY-201 `SPECIFY/DONE` (con cobertura) y STORY-202 `READY-FOR-VERIFY`. `contains`: `MAD-03`, `READY-FOR-VERIFY`, `Madurez de historias hijas: 1/2`. `not_contains`: `valor legado`.
  - `epic-refine`, con fixtures de disco como TC-009:
    - **TC-027** `historia-de-cierre-planificada-replanifica` (AC-3, fila `PLAN`): fixture `examples/cobertura-cierre-planificada/`, copia de `cobertura-cierre/` con STORY-302 en `status: PLAN` / `substatus: DONE`. Modo manual con respuesta `s` al plan, porque la línea `Replanifica:` solo sale en el resumen manual («En `--auto` el bloque de retorno no cambia»). `contains`: `SAL-01 · CS-1 → STORY-302`, `Replanifica: /story-plan STORY-302`, `Siguiente paso: /epic-analyze EPIC-30`. `not_contains`: `READY-FOR-`.
    - **TC-028** `historia-de-cierre-con-status-desconocido-al-po` (D-4): fixture `examples/cobertura-cierre-status-desconocido/`, copia con STORY-302 en `status: BACKLOG`. `--auto`. `contains`: `fuera del workflow de historia`, `BACKLOG`, `FUERA-DE-ALCANCE: 1`. `not_contains`: `STORY-302-enviar-csv-por-correo/story.md.bak`, `Replanifica`.
    - **TC-009** (AC-3, fila `SPECIFY`): se añade `Replanifica:` a `not_contains`. No hace falta un caso nuevo.
- **Rechazada A — un solo fixture con varias historias de cierre:** la historia de cierre es única por elemento (`sal-corrections.md` §2), así que no se pueden probar varios estados en un mismo fixture.
- **Rechazada B — fixture de `epic-refine` con el valor legado:** CS-6 (`grep … skills docs`) lo contaría como una mención fuera de lo permitido. El caso se prueba con `BACKLOG`, que pasa por la misma fila genérica.

### D-6 — Cita al ADR condicionada a su existencia // satisface: CNF-1 (veracidad)

- **Elegida:** la regla del valor legado (D-1) y la línea 77 (D-3) citan `ADR-0022` solo si al implementar existe `docs/adr/ADR-0022-*.md` con `status: ACCEPTED`. Si no, el texto va sin cita al ADR y `implement-report.md` registra la cita pendiente para cuando STORY-186 se entregue. Así se cumple «Solo hay que actualizar la cita cuando exista» de la historia sin documentar algo que no existe (AGENTS.md, Veracidad).
- **Rechazada — citar ADR-0022 desde ya:** sería una referencia rota mientras STORY-186 no se entregue.

### D-7 — `epic-generate-all-stories` sin nombrar el buffer // satisface: CNF-1

- **Elegida:** línea 227 → «No usar un estado posterior (`PLAN` o siguientes): saltaría los gates SPECIFY y PLAN que la máquina de estados declara secuenciales». La regla se mantiene, sin el buffer.
- **Rechazada — borrar la advertencia:** se pierde una restricción vigente, porque generar historias en un estado posterior sigue sin estar permitido.

## Interfaces y contratos

| Interfaz | Contrato | Cambio | Satisface |
|---|---|---|---|
| Clasificación de madurez (`epic-analyze` Paso 5c.1) | `status`/`substatus` → `lista` \| `no-lista` (MAD-01) \| `no-clasificable` (MAD-03) | Se suma el caso `lista` + nota para el valor legado. Los demás casos no cambian | AC-1, AC-2 |
| Resumen manual (`epic-analyze` Paso 9) | Reporte, veredicto, hallazgos | Línea `Siguiente paso:` al final según el veredicto | AC-1 |
| Retorno Agent (`epic-analyze`) | 4 líneas `STATUS`/`VEREDICTO`/`HALLAZGOS`/`REPORTE` | Sin cambio | — |
| Estados admitidos SAL (`sal-corrections.md`) | `status` de la historia de cierre → aplica \| aplica + replanifica \| fuera de alcance | `PLAN` es el único estado que replanifica, y un valor desconocido queda fuera de alcance con una nota | AC-3 |
| Resumen manual (`epic-refine` Paso 9) | Línea `Replanifica: /story-plan <STORY-NNN>` | Solo para historias de cierre en `PLAN` | AC-3 |

## Flujos clave

1. **AC-1:** `/epic-analyze EPIC-NN` → universo de 3 historias → Paso 5c: `SPECIFY/DONE`, `PLAN/DONE` e `IMPLEMENT/TODO` son `lista` → `Madurez de historias hijas: 3/3` → veredicto según conteos → reporte → resumen manual con `Siguiente paso: el PO aprueba … PLAN/DONE`. `epic.md` no se escribe.
2. **AC-2, legado:** la historia en `READY-FOR-IMPLEMENT` → `lista` + nota en `notas-analisis` → no hay MAD-03 → la nota no cuenta en el Paso 6.
3. **AC-2, desconocido:** `READY-FOR-VERIFY` → `no-clasificable` → MAD-03 (WARNING).
4. **AC-3:** `/epic-refine` → SAL-01 con historia de cierre única → `status` `SPECIFY` → aplica sin `Replanifica:`. `PLAN` → aplica y el resumen añade `Replanifica: /story-plan STORY-NNN`. Otro valor → fuera de alcance, responsable PO, con nota.

## Contratos de verificación

| # | Criterio | Método | Origen |
|---|---|---|---|
| V-1 | TC-035, TC-036 y TC-037 existen en `skills/epic-analyze/evals/evals.json` (v1.6.0) y se escribieron antes del cambio del `SKILL.md` | orden de las tareas + lectura | CNF-3 |
| V-2 | TC-027 y TC-028 y sus fixtures existen; TC-009 tiene `Replanifica:` en `not_contains` (`epic-refine` v1.6.0) | lectura | AC-3, CNF-3 |
| V-3 | `grep -nE "READY-FOR-(IMPLEMENT\|DEV)" skills/epic-analyze/SKILL.md skills/epic-analyze/README.md` solo devuelve la fila y la nota del valor legado | grep | CNF-1 |
| V-4 | `grep -rnE "READY-FOR-(IMPLEMENT\|DEV)" skills/epic-refine skills/epic-generate-all-stories` no devuelve nada | grep | CNF-1 |
| V-5 | `grep -rn "PLAN/DONE"` en los tres skills: ninguna aparición indica a un skill que escriba el estado de la épica | grep + lectura | CNF-2 |
| V-6 | La línea 236 tiene el literal sin buffers de D-2 | lectura | AC-1 |
| V-7 | `npm run verify:repository` y `npm test` pasan | comando | CNF-4 |
| V-8 | `npm run test:eval -- epic-analyze` y `-- epic-refine` pasan (a criterio humano) | comando manual | AC-1, AC-2, AC-3 |

## Decisiones de complejidad justificada

- **Dos fixtures nuevos en `epic-refine`:** los fixtures de `epic-refine` son directorios en disco y la historia de cierre es única por elemento. Probar dos estados obliga a tener dos copias. Cada una es `cobertura-cierre/` con una sola línea de frontmatter distinta.
- **Fila genérica en §«Estados admitidos» (D-4):** sin ella, quitar el buffer de la tabla deja un caso sin definir. Es la forma más simple de cumplir CNF-1 y el determinismo a la vez.
- **Sin componente nuevo:** las reglas se suman a tablas que ya existen. No hay un catálogo nuevo de hallazgos (D-1, alternativa A).

## Autoevaluación (P9–P11)

- **Omisiones:** los 3 AC y los 4 CNF tienen elemento de diseño (componentes C-1…C-7, V-1…V-8). Todos los puntos de cambio de las Notas de la historia están en C-3…C-7.
- **Ambigüedad:** el «siguiente paso» de AC-1 se fija en el resumen manual (D-3). El tratamiento del valor legado en `epic-refine` queda fijado en D-4.
- **Nombres:** se usan «valor legado», «historia de cierre», «aprobación del PO» y «`PLAN/DONE`» igual en los tres skills y en la historia.
- **Acoplamiento:** `epic-analyze` y `epic-refine` siguen sin invocarse entre sí. La única dependencia externa es documental: STORY-187 para el orden y STORY-186 para el ADR (D-6). No hay dependencias cíclicas.
- **Cohesión:** cada cambio toca una regla con una sola responsabilidad: clasificar madurez, indicar el siguiente paso, admitir el estado de la historia de cierre.

## Risks / Trade-offs

- [STORY-187 entrega un orden distinto del literal de D-2] → D-2 copia el literal que fija el CR de STORY-187. Si cambia, la tarea de verificación final (V-6) compara la línea 236 con `docs/domains/domain-story-lifecycle.md` §4.1 cuando ese documento ya esté reescrito.
- [La cita a ADR-0022 queda pendiente si STORY-186 no se entregó] → D-6: sin cita, y `implement-report.md` lo registra.
- [Una historia legada en `epic-refine` queda fuera de alcance aunque esté planificada] → el PO normaliza su `status`. La nota de `epic-analyze` y el aviso de `skill-preflight` (STORY-191) lo señalan. Es el precio de no nombrar el buffer en `epic-refine` (CS-6).
- [Evals de `epic-refine` en modo manual (TC-027)] → la respuesta `s` al plan va en `input.context`, como en TC-001.
- [Los destinos de runtime ya instalados siguen con el texto viejo] → los regenera `agile-sddf install`. No se editan a mano.

## Open Questions

Ninguna. El tratamiento del valor legado en `epic-refine` quedó decidido en D-4, y la cita al ADR en D-6.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: AC-1 pide que «el siguiente paso» indique la aprobación manual, pero el Paso 9 de `epic-analyze` no tiene línea de siguiente paso. La historia no lo dice.
- **Documento afectado**: design.md
- **Acción requerida**: ninguna en `story.md`. D-3 añade la línea solo al resumen manual y deja intacto el retorno Agent.

### CR-002
- **Tipo**: ambigüedad
- **Descripción**: la Nota de la historia lista la línea 243 de `epic-analyze` como punto de cambio, pero esa línea nombra `READY-FOR-VERIFY`, que no es un buffer de EPIC-029 y que AC-2 usa como caso `no-clasificable`.
- **Documento afectado**: design.md
- **Acción requerida**: la línea 243 se conserva. La fila nueva del valor legado (D-1) va justo antes.
