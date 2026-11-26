---
type: epic
id: EPIC-031
slug: EPIC-031-optimizar-desglose-de-epicas
title: "Optimizar el desglose de épicas en historias"
status: DEFINE
substatus: IN-PROGRESS
parent: null
created: 2026-11-25
updated: 2026-11-25
related: []
---

# Épica: Optimizar el desglose de épicas en historias

## Objetivo

Reducir el costo total de proceso de una épica (artefactos, puertas humanas y cuota de tokens) haciendo que su desglose busque el tamaño de lote óptimo y no la historia más pequeña posible, y que las historias de documentación no paguen `testcases.md` ni TDD, sin perder la cobertura del contrato de salida, la trazabilidad ni los gates.

## Alcance

- Un ADR nuevo que fija los criterios de desglose por costo total, la conciliación de `S – Small = 1` con ese costo y el valor `docs` de `kind` con el contrato de su vía ligera; la plantilla de historia, la constitución, el dominio, NFR-009, las guías, `story-creation` y `header-aggregation` admiten `docs`.
- Desglose: `epic-generate-stories` y `epic-generate-all-stories` revisan las historias planificadas antes de asignarles ID y proponen fusiones que solo se aplican con confirmación humana; `story-evaluation`, `story-split` y `story-specify` concilian el tamaño de una historia con el costo de la épica; `epic-analyze` avisa del sobre-desglose.
- Vía ligera para `kind: docs`: `story-plan`, `story-tasking` y `story-analyze` planifican sin `testcases.md`; `story-implement-tasks`, `story-implement` y `story-verify` implementan y verifican sin TDD, con el comando de verificación de cada tarea como evidencia.
- Requisitos y `evals.json` de los skills que cambian.

## Historias

- ADR de desglose por costo total y tipo docs: Como mantenedor de agile-sddf que va a implementar las historias de EPIC-031, quiero un ADR aceptado que fije los criterios de desglose por costo total, cómo se concilia un `S – Small = 1` con ese costo y el valor `docs` de `kind` con el contrato de su vía ligera, y que la plantilla de historia, la constitución, el dominio, NFR-009, las guías, `/story-creation` y `/header-aggregation` admitan `docs`, para que las demás historias apliquen una sola decisión y ninguna la reabra en su `design.md`
- Revisión del desglose al generar historias: Como Solo Builder que genera las historias de una épica, quiero que `/epic-generate-stories` y `/epic-generate-all-stories` revisen las historias planificadas antes de asignarles ID, me propongan fusionar las que cambian los mismos archivos, las micro-historias y la documentación que se valida en conjunto, me avisen si la épica mezcla objetivos y generen con `kind: docs` las historias que solo cambian documentación, para corregir el desglose cuando todavía no hay ningún `story.md` que reagrupar
- Tamaño de historia conciliado con el costo de la épica: Como Solo Builder que especifica una historia que FINVEST considera demasiado grande, quiero que `/story-evaluation` no emita `SPLIT` cuando el ADR lo justifica (umbral de costo, excepción documentada o decisión del PO registrada en la historia) y no cuente como escenarios las filas de datos de un mismo escenario, que `/story-split` no divida cuando el corte comparte archivos o exige coordinar el orden entre hermanas y que `/story-specify` no invoque el split sobre una historia con esa decisión, para no aprobar a mano un veredicto `SPLIT` ni volver a partir lo que ya se reagrupó
- Aviso de sobre-desglose en epic-analyze: Como PO que revisa una épica antes de aprobarla, quiero que `/epic-analyze` emita un hallazgo WARNING cuando dos o más historias hijas cambian el mismo archivo, con el archivo y las historias, para reagrupar antes de planificar y no pagar varias veces el diseño, la revisión y la verificación del mismo `SKILL.md`
- Planificación de historias docs sin testcases.md: Como Solo Builder que planifica una historia `kind: docs`, quiero que `/story-plan` ejecute el diseño, las tareas y el análisis sin generar `testcases.md`, que cada tarea de `tasks.md` declare su comando de verificación (un `grep` o un gate) y que `/story-analyze` apruebe la planificación sin casos de prueba, para no especificar pruebas que no aportan nada a un cambio de Markdown
- Implementación y verificación de historias docs sin TDD: Como Solo Builder que implementa una historia `kind: docs`, quiero que `/story-implement-tasks` aplique cada tarea sin generar tests y registre en `implement-report.md` su comando de verificación con el resultado, que `/story-implement` no ejecute la fase RED, que `/story-verify` use esos comandos como evidencia y que una tarea fuera del alcance de `docs` saque la historia de la vía ligera con un aviso, para verificar la documentación con lo que de verdad la prueba sin saltarme los gates

## Criterios de salida

- [ ] **CS-1** — Un ADR nuevo, registrado en `docs/decisions/README.md` con `status: ACCEPTED`, fija: los criterios de desglose por costo total (superficie de cambio, independencia sin andamiaje de estados intermedios, micro-historias, documentación que se valida en conjunto y objetivos mezclados) con su heurística de archivos compartidos y complejidad del cambio; cómo se concilia `S – Small = 1` con ese costo (umbral, excepción documentada y decisión del PO, y dónde se registra cada una); y el valor `docs` de `kind` con el contrato de su vía ligera (qué puede cambiar una historia `docs`, qué artefactos omite y cómo se declara y se ejecuta su verificación). Si reemplaza a ADR-0005, este queda con `status: SUPERSEDED` y `superseded-by` apuntando al ADR nuevo.
- [ ] **CS-2** — `git grep -n -i -E "chore.{0,40}hotfix" -- README.md docs skills ':!docs/decisions' ':!docs/index.md' ':!**/evals.json'` (hoy 15 líneas en 13 archivos) solo devuelve líneas que nombran también `docs`; «Tipos de Story» de `docs/guides/flight-leves-model.md` define el tipo Docs, `/story-creation` lo ofrece al preguntar el tipo de la historia y `domain-story-lifecycle` describe la vía ligera en las etapas `PLAN` e `IMPLEMENT`.
- [ ] **CS-3** — Antes de asignar IDs (F1 → F2), `/epic-generate-stories` y `/epic-generate-all-stories` proponen fusionar las líneas F1 que, según el ADR, cambian los mismos archivos, son micro-historias o son documentación que se valida en conjunto, y avisan si la épica mezcla objetivos; la fusión solo se escribe en `epic.md` con confirmación humana y, sin ella, las líneas quedan byte a byte iguales y las propuestas van al resumen; las historias que solo cambian documentación se generan con `kind: docs`.
- [ ] **CS-4** — `/story-evaluation` no emite `SPLIT` para una historia que cumple la conciliación del ADR: aplica las demás filas de su tabla de veredicto, conserva el score de S y deja la excepción en `finvest-evaluation-report.md`, sin valores de veredicto nuevos (G-03 de `validation-contract-policy`); la rúbrica de S distingue las filas de datos de un mismo escenario de los escenarios independientes; `/story-split` evalúa los criterios de costo del ADR antes de escribir y, si el corte los viola, propone no dividir y no crea archivos sin confirmación; y `/story-specify` no invoca `/story-split` sobre una historia con la decisión del PO registrada.
- [ ] **CS-5** — `/epic-analyze` emite, en una familia de hallazgos nueva, un WARNING de sobre-desglose por cada archivo de cambio que citan dos o más historias hijas, con el archivo y las historias, sin modificar `epic.md` ni los `story.md` y sin cambiar las reglas de las familias INT, SAL y MAD.
- [ ] **CS-6** — Para una historia `kind: docs`: `/story-plan` ejecuta `story-design → story-tasking → story-analyze` sin generar `testcases.md`; cada tarea de `tasks.md` declara su comando de verificación; `/story-analyze` aprueba la planificación sin casos de prueba; `/story-implement-tasks` no crea archivos de test y registra en `implement-report.md` el comando y el resultado de cada tarea; `/story-implement` no ejecuta la fase RED; `/story-verify` ejecuta los comandos declarados como evidencia; y una tarea fuera del alcance que fija el ADR para `docs` saca la historia de la vía ligera con un aviso. Una historia con otro `kind` conserva el recorrido actual.
- [ ] **CS-7** — Los requisitos de los skills que cambian describen el comportamiento nuevo: FR-028, FR-029, FR-031, FR-032, FR-034, FR-036, FR-038, FR-039, FR-040, FR-042, FR-044 y NFR-009.
- [ ] **CS-8** — Los `evals.json` de los skills modificados incluyen casos de las reglas nuevas, escritos antes de cambiar su `SKILL.md` (principio 11 de la constitución), y `npm test` y `npm run verify:repository` pasan.

## Smoke tests

### SMOKE-1 — Reagrupar historias planificadas que cambian el mismo skill
```gherkin
Escenario: Reagrupar historias planificadas que cambian el mismo skill
  Dado una épica con tres historias planificadas (F1), dos de ellas sobre el mismo skills/<skill>/SKILL.md
  Cuando el usuario ejecuta /epic-generate-stories sobre la épica y confirma la fusión propuesta
  Entonces epic.md queda con dos líneas F2 y se genera un story.md por línea
```

### SMOKE-2 — Historia grande por decisión del PO
```gherkin
Escenario: Historia grande por decisión del PO
  Dado una historia STORY-NNN con S – Small = 1 y la decisión del PO sobre su tamaño registrada en story.md como fija el ADR
  Cuando el usuario ejecuta /story-specify STORY-NNN
  Entonces finvest-evaluation-report.md no tiene verdict SPLIT y registra la excepción, y story-specify no invoca story-split
```

### SMOKE-3 — Aviso de sobre-desglose
```gherkin
Escenario: Aviso de sobre-desglose
  Dado una épica con dos historias hijas en SPECIFY/DONE cuyos story.md citan el mismo skills/<skill>/SKILL.md como archivo de cambio
  Cuando el usuario ejecuta /epic-analyze sobre la épica
  Entonces epic-analyze-report.md tiene un hallazgo WARNING de sobre-desglose con ese archivo y las dos historias, y epic.md y los story.md no cambian
```

### SMOKE-4 — Historia docs por la vía ligera
```gherkin
Escenario: Historia docs por la vía ligera
  Dado una historia STORY-NNN con kind: docs en SPECIFY/DONE que solo cambia Markdown de docs/
  Cuando el usuario ejecuta /story-plan, /story-implement-tasks, /story-code-review y /story-verify sobre STORY-NNN
  Entonces no existe testcases.md ni se crearon archivos de test, implement-report.md registra el comando de verificación de cada tarea con su resultado y verify-report.md emite APPROVED con esos comandos como evidencia
```

### SMOKE-5 — Historia feat con el recorrido completo
```gherkin
Escenario: Historia feat con el recorrido completo
  Dado una historia STORY-NNN con kind: feat en SPECIFY/DONE
  Cuando el usuario ejecuta /story-plan STORY-NNN
  Entonces story-plan genera design.md, tasks.md y testcases.md y ejecuta story-analyze, como antes de esta épica
```

## Notas

- **Fuente:** [intent.md](intent.md) (2026-11-25), con las respuestas del PO a sus preguntas abiertas, y `.temp/propuestas-de-mejoras/mejora-021-desglose-de-epica.md` (no versionado), con la evaluación en dos iteraciones del desglose de EPIC-029 (`changes/archive/2026-11-15-EPIC-029-eliminar-estados-buffer/`, nota «Reagrupación»).
- **Evidencia (medida el 2026-11-25 en `changes/archive/`):** cada historia de STORY-180 a STORY-184 suma entre 1.180 y 1.268 líneas de Markdown (1.215 de promedio, 319 de ellas en `design.md`); las 8 historias de EPIC-029, ya reagrupadas desde 14, suman 8.261. EPIC-030 se implementó en una sola sesión sin `design.md`, `tasks.md`, `testcases.md` ni reportes de gate por historia (según sus Notas), y sus 7 historias suman 285 líneas, solo `story.md`: el recorrido completo por historia ya se esquivó a mano en una épica mayormente mecánica. Las cifras de Spec Kit y OpenSpec de la intención son estimaciones y no sirven para calibrar.
- **El conflicto con FINVEST, en datos:** la rúbrica de S cuenta cada fila de `Ejemplos` como un escenario (`skills/story-evaluation/SKILL.md:307`) y, con `S = 1`, la fila 3 de su tabla emite `SPLIT` (`skills/story-evaluation/SKILL.md:151`). STORY-190 y STORY-191 obtuvieron `S = 1` con 6 y 11 «escenarios contando las filas de Ejemplos», justo la técnica con la que la reagrupación las acotó, y sus `finvest-evaluation-report.md` se aprobaron a mano (`verdict: APPROVED` con «Se decide aprobar igual» y «Se aprueba de todos modos»), un reporte que la tabla de veredicto no puede producir. Además, `/story-specify` invoca `/story-split` ante `SPLIT` o ante `NEEDS-REFINEMENT` con `S – Small: 1 / 5` (`skills/story-specify/SKILL.md:205`), así que conciliar el tamaño solo en `story-evaluation` no basta.
- **Puntos de partida verificados:**
  - `/epic-generate-stories` genera una historia por línea y «no realiza evaluación INVEST ni splitting» (`skills/epic-generate-stories/SKILL.md:69`); `epic-generate-all-stories` aplica sus Pasos 1b, 2 y 2b por referencia (`skills/epic-generate-all-stories/SKILL.md:68`).
  - `/story-split` ya nombra el over-splitting como anti-patrón, sin un criterio operativo (`skills/story-split/SKILL.md:90`).
  - `/story-plan` ya tiene `--only-tasks` (`skills/story-plan/SKILL.md:79`), `dod-story-plan` ya admite `tasks.md` sin `testcases.md` (`docs/guardrails/dod-story-plan.md:23`) y `story-analyze` acepta `tasks.md` solo, con un aviso (`skills/story-analyze/SKILL.md:138`). En cambio, sin `testcases.md`, `/story-implement` genera las pruebas desde `story.md` y `design.md` (`skills/story-implement/SKILL.md:434`).
  - `/epic-ship` clasifica un `kind` desconocido como `Changed` (`skills/epic-ship/references/release-content.md:35`), así que `docs` no exige cambiarlo.
- **Dónde se corrige el desglose:** en `/epic-generate-stories`, antes de asignar IDs. Es el paso común de las líneas F1 que escriben `/epic-creation`, `/epic-from-project-plan` o la edición manual, y en ese momento fusionar no exige cancelar, renombrar ni reevaluar historias, como pasó en EPIC-029. `/story-split` y `/epic-analyze` cubren lo que aparece después: el split de una historia ya creada y el sobre-desglose que quede en los `story.md`.
- **Decisiones tomadas (2026-11-25, respuestas del PO en la intención):** la heurística de costo usa los archivos compartidos entre historias y la complejidad de los cambios; la conciliación con FINVEST combina un umbral de costo, excepciones documentadas y decisiones explícitas del PO, según corresponda; la vía ligera es parte de esta épica y se activa con un valor nuevo de `kind`, `docs`; reducir `design.md` queda fuera; y `/epic-analyze` gana un aviso de sobre-desglose.
- **Decisiones para el ADR:**
  - El umbral de costo y cómo se calcula con los archivos compartidos y la complejidad del cambio, calibrado con los datos medidos de `changes/archive/`.
  - Dónde y con qué forma se registra la decisión del PO sobre el tamaño: una nota con forma fija en `story.md` o una clave nueva de frontmatter, que por el principio 13 de la constitución nombra a su escritor en la plantilla.
  - Cómo cuenta S las filas de `Ejemplos` de un mismo escenario.
  - Qué cuenta como archivo de cambio citado en un `story.md`, para que las referencias de contexto no produzcan avisos falsos, y el código de la familia nueva de `epic-analyze`.
  - El límite de una historia `docs` (por ejemplo, solo Markdown fuera de los `SKILL.md`, sin scripts ni `evals.json`) y si una historia `chore` que solo cambia Markdown usa la vía ligera o se reclasifica como `docs`.
  - Dónde se declara el comando de verificación de cada tarea y cómo lo registran `implement-report.md` y `verify-report.md`.
  - Si el ADR reemplaza a ADR-0005, que enumera los valores de `kind`, o lo complementa.
- **Orden y coordinación:** la historia del ADR va primero. Las de revisión del desglose, conciliación del tamaño, sobre-desglose y planificación de historias `docs` pueden avanzar en cualquier orden tras ella; la de implementación y verificación de historias `docs` va después de la de planificación, porque lee el comando de verificación que esta escribe en `tasks.md`. Cada `SKILL.md` lo cambia una sola historia: la línea de `kind` de `epic-generate-stories` y `epic-generate-all-stories` la cambia la revisión del desglose, no la del ADR; y si el ADR elige una clave de frontmatter para la decisión del PO, la añade a la plantilla la historia del ADR, junto con `docs`. Las historias de esta épica se especifican con la rúbrica FINVEST actual: si alguna obtiene `SPLIT` antes de que se entregue la conciliación del tamaño, decide el PO y lo registra en la historia.
- **Release y evals:** se espera un cambio aditivo, sin BREAKING: `docs` es un valor nuevo de `kind` y las historias de los demás tipos conservan su recorrido, así que basta una versión menor (hoy 6.0.0). `/epic-ship` escribe el bloque de `CHANGELOG.md` y el bump es un paso humano. Cada historia que cambie un skill escribe primero sus casos en `evals/evals.json` (principio 11); `npm run test:eval` de los skills afectados se ejecuta a mano (principio 14).
- **Registros históricos que no se editan:** ADR-0005 (salvo `status`, `superseded-by` y la nota de reemplazo, si el ADR nuevo lo reemplaza), las entradas anteriores de `CHANGELOG.md` y `changes/archive/`, incluidos los reportes aprobados a mano de STORY-190 y STORY-191. Las historias existentes no se reclasifican como `docs`.
- **Fuera de alcance:** reducir `design.md`, que queda para una épica futura de optimización; un skill que fusione historias ya creadas (tras asignar IDs, la reagrupación sigue siendo manual, como en EPIC-029) y que `/epic-refine` corrija los avisos de sobre-desglose; cambiar `/epic-creation` y `/epic-from-project-plan`, porque la revisión ocurre en `/epic-generate-stories`; y cambiar `/story-code-review`, `/story-acceptance` o sus gates para las historias `docs`: la vía ligera solo omite `testcases.md` y el TDD.
