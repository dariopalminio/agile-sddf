---
alwaysApply: false
type: design
id: STORY-122
slug: STORY-122-epic-analyze-madurez-historias-hijas-design
title: "Design: Señalar historias hijas no especificadas o con referencias rotas al analizar una épica"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-19-framework-consistency
story: STORY-122
created: 2026-10-08
updated: 2026-10-08
related:
  - STORY-122-epic-analyze-madurez-historias-hijas
  - EPIC-19-framework-consistency
  - STORY-120-epic-analyze-integridad-historias
  - STORY-121-epic-analyze-cobertura-criterios-salida
  - domain-story-lifecycle
---

<!-- Referencias -->
[[STORY-122-epic-analyze-madurez-historias-hijas]] · [[EPIC-19-framework-consistency]] · [[STORY-120-epic-analyze-integridad-historias]] · [[STORY-121-epic-analyze-cobertura-criterios-salida]] · [[domain-story-lifecycle]]

# Diseño técnico: `/epic-analyze` — madurez de las historias hijas

## Context

STORY-120 crea el skill worker `epic-analyze` (diseño en `STORY-120-…/design.md`, D-1…D-14): resuelve la épica, cruza
el índice de historias de `epic.md` con el `parent` de los `story.md` (familia `INT-`), escribe
`<EPIC_DIR>/epic-analyze-report.md` desde un template leído en runtime y calcula el veredicto como función pura de los
conteos ERROR/WARNING de **todas** las familias (D-7). Su punto de extensión (I-6) admite familias nuevas con prefijo
propio; STORY-120 › D-6 ya reserva `MAD-` para esta historia. STORY-121 añade la familia `SAL-` (cobertura del contrato
de salida) y define el **universo** de historias de la épica (su D-3). Esta historia añade la familia `MAD-`: estado
mínimo de especificación de cada historia hija y resolubilidad de sus referencias `related` a historias y épicas.

Estado actual (medido el 2026-10-08 sobre el filesystem):

| Pieza | Estado |
|---|---|
| `skills/epic-analyze/` | **No existe**: STORY-120 y STORY-121 están en `READY-FOR-IMPLEMENT/DONE` (diseño y tareas aprobados, sin implementar). Ver CR-001. |
| Orden de estados de historia | `domain-story-lifecycle` §4.1 (happy path): `SPECIFY → PLAN → READY-FOR-IMPLEMENT → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE → DELIVER → COMPLETED`; §5 añade el terminal `CANCELED`; §6: substatus `TODO`/`IN-PROGRESS`/`DONE`/`BLOCKED`. El documento no se distribuye con el paquete (ningún archivo de `skills/`, `scripts/` o `config/` lo referencia). |
| `status/substatus` reales (117 `story.md`) | Del vocabulario de §4.1/§5: `COMPLETED` (66), `READY-FOR-IMPLEMENT` (20), `CANCELED` (9), `VERIFY` (7), `IMPLEMENT` (4), `CODE-REVIEW` (3), `PLAN` (2). Fuera del vocabulario: `BACKLOG/READY`, `READY-FOR-CODE-REVIEW/DONE`, `READY-FOR-VERIFY/DONE` (1 cada uno). `COMPLETED/READY` (40) usa un substatus heredado. |
| `related` real de `story.md` | Lista YAML en bloque (`  - <valor>`) o en línea (`related: []`). Valores: 109 con prefijo `STORY-`, 56 `EPIC-`, 13 `ADR-`, 1 slug libre (`eliminar-specs-01-projects`). Formas `STORY-064` (solo ID) y `STORY-086-<slug>` (directorio completo) conviven. Una referencia rota real: `STORY-118 › related: STORY-XXX-epic-template-minimalista` (placeholder sin ID numérico). |
| Resolución de IDs en STORY-120 | D-5: `<STORY-NNN>` → glob `$SPECS_BASE/specs/03-stories/<STORY-NNN>-*/story.md` (guion obligatorio). D-2 regla 3: `<EPIC-NN>` → glob `$SPECS_BASE/specs/02-epics/<EPIC-NN>-*/epic.md`. |
| Universo de STORY-121 | D-3: listadas en el índice con `story.md` existente ∪ `pertenece = true`, excluidas las `CANCELED`; Vía B lee `status` del frontmatter solo para ellas. |
| Evals de STORY-120/121 | TC-001…TC-018 describen el "mundo" en `input`; no fijan `status` ni `related` de las historias de ejemplo (ver CR-002). |
| Propuesta de origen | `.tmp/propuestas-de-mejoras/mejora-004-epc-analyze.md`, checks 8 (historia hija no especificada) y 9 (`related` roto). |
| FINVEST de STORY-122 | I = 2 (depende de STORY-120; independiente de STORY-121). Resuelto en D-3 y D-8 (universo y rango de evals válidos en cualquier orden respecto a STORY-121). |

## Goals / Non-Goals

**Goals:**
- Añadir a `epic-analyze` la familia de comprobaciones `MAD-`: cada historia hija con estado anterior a `SPECIFY/DONE` y cada referencia `related` a una historia o épica inexistente producen un hallazgo WARNING con el elemento citado y la acción sugerida. // satisface: AC-1, AC-2, CNF-1
- Los hallazgos `MAD-` se escriben en el mismo `epic-analyze-report.md` y cuentan para el veredicto de STORY-120 › D-7 sin cambiar la regla; el skill sigue sin escribir `epic.md` ni `story.md`. // satisface: CNF-2
- Mismo input → mismos hallazgos, mismo orden. // satisface: CNF-3

**Non-Goals:** (los de `story.md › Fuera de alcance`, sin ampliaciones)
- Integridad del índice, reporte, veredicto, modos y resolución de la épica (STORY-120); cobertura de criterios de salida y smoke tests (STORY-121).
- Detectar ciclos en `related` (relación, no dependencia).
- Leer los `analyze.md` (ni ningún otro artefacto) de las historias hijas, ni el cuerpo de `story.md`.
- Resolver referencias `related` que no son a historias ni a épicas (`ADR-`, `domain-…`, slugs libres).
- Validar `parent` (ya es `INT-04` de STORY-120) o cambiar el estado de cualquier historia.

## Decisions

### D-1 — Familia `MAD-` dentro del skill de STORY-120 // satisface: AC-1, AC-2, CNF-2

La madurez se implementa como una familia más de `skills/epic-analyze/SKILL.md` (punto de extensión I-6 de STORY-120),
en un paso nuevo entre la Vía B (Paso 4 de STORY-120) y el veredicto (Paso 6 de STORY-120); si STORY-121 ya está
implementada, el paso va después del de la familia `SAL-`. El prefijo es `MAD-` (**mad**urez), el que anticipa
STORY-120 › D-6. El veredicto (D-7) no se toca: ya suma todas las familias.

| Alternativa | Rechazo |
|---|---|
| Skill propio (`epic-readiness`) | Dos reportes y dos veredictos para la misma decisión `PLAN → READY-FOR-DEV`; CNF-2 exige el mismo reporte y veredicto. |
| Ampliar `story-analyze` para que cada historia se autoevalúe | Opera sobre una historia, no sobre la épica; el PO tendría que ejecutarlo N veces y consolidar a mano lo que esta historia pide en un reporte. |
| Severidad ERROR para historias no especificadas | AC-2 fija WARNING; una historia en `SPECIFY` es trabajo pendiente, no una inconsistencia que impida leer la épica. |

### D-2 — Historias evaluadas (universo) // satisface: AC-1, AC-2, CNF-1, CNF-3

Se evalúa el mismo universo que STORY-121 › D-3, con la misma definición, para que ambas familias hablen de las mismas
historias:

`universo = { RegistroHistoria listado en el índice (F2/F3) con story.md existente } ∪ { RegistroHistoria con pertenece = true }`, excluidas las de `status: CANCELED`.

- Si STORY-121 ya está implementada, el paso `MAD-` **reutiliza** su universo (no lo recalcula). Si STORY-122 se implementa
  antes, introduce ella el cálculo del universo con esta definición y STORY-121 lo reutilizará (ver CR-001).
- La Vía B (Paso 4 de STORY-120) ya lee el frontmatter de cada `story.md` para `parent`; para el universo extrae además
  `status`, `substatus` y `related`, cada uno con su **número de línea** en `story.md`. **No** se lee el cuerpo
  (non-goal; la lectura del cuerpo es exclusiva de `SAL-`).
- Las historias `CANCELED` quedan fuera: ni `MAD-01` (CNF-1) ni `MAD-02` (una historia que no se planificará no
  compromete capacidad aunque referencie algo inexistente). Ver CR-003.
- Líneas F1 (planificadas sin `story.md`) e IDs `INT-01` (listados sin `story.md`) no están en el universo: ya tienen su
  hallazgo `INT-05` / `INT-01` y no hay frontmatter que leer.
- Las historias con `INT-02` / `INT-04` **sí** se evalúan: son hijas según una de las dos vías y su madurez es un defecto
  distinto del de índice.

| Alternativa | Rechazo |
|---|---|
| Solo las listadas en el índice | Una huérfana (`INT-02`) en `SPECIFY/IN-PROGRESS` quedaría sin aviso de madurez; al corregir el índice aparecería un defecto nuevo que ya existía. |
| Universo propio distinto del de STORY-121 | Dos definiciones de "historia hija" en el mismo reporte divergirían (una historia contada como hija en una familia y no en otra). |
| Incluir las `CANCELED` en `MAD-02` | Ruido: el PO tendría que corregir referencias de historias que no se van a desarrollar para obtener `APPROVED`. |

### D-3 — Regla de estado mínimo (`MAD-01`) // satisface: AC-1, AC-2, CNF-1

El orden de estados es el de `domain-story-lifecycle` §4.1. Como ese documento no se distribuye a los proyectos
consumidores, `SKILL.md` declara la lista ordenada (citando el documento como fuente) en lugar de leerla en runtime.

| `status` | `substatus` | Clasificación | Resultado |
|---|---|---|---|
| `SPECIFY` | `DONE` | lista | Sin hallazgo |
| `SPECIFY` | cualquier otro valor o ausente (`TODO`, `IN-PROGRESS`, `BLOCKED`, …) | no lista | `MAD-01` |
| `PLAN`, `READY-FOR-IMPLEMENT`, `IMPLEMENT`, `CODE-REVIEW`, `VERIFY`, `ACCEPTANCE`, `DELIVER`, `COMPLETED` | cualquiera (no se evalúa) | lista (posterior a `SPECIFY/DONE`) | Sin hallazgo |
| `CANCELED` | — | excluida del universo (D-2) | Sin hallazgo |
| ausente, vacío o fuera de la lista anterior (p. ej. `BACKLOG`, `READY-FOR-VERIFY`) | — | no clasificable | `MAD-03` |

- Comparación exacta tras recortar espacios y comillas, en mayúsculas (el vocabulario del dominio es en mayúsculas).
- El `substatus` solo se mira cuando `status = SPECIFY`: en los estados posteriores la historia ya superó la especificación
  y el substatus describe otra etapa (CNF-1: "cualquier estado posterior").

| Alternativa | Rechazo |
|---|---|
| Leer el orden de `$SPECS_BASE/domains/domain-story-lifecycle.md` en runtime | El documento no existe en los proyectos consumidores y su forma (diagrama en texto libre) no es un contrato de máquina. |
| Tratar un `status` desconocido como `MAD-01` | La acción "completar su especificación con /story-specify" sería falsa para `READY-FOR-VERIFY` (ya implementada); el PO necesita otra acción: normalizar el estado. |
| Ignorar un `status` desconocido (solo nota) | Una historia sin estado legible es justo una cuya madurez el PO no puede conocer; ocultarlo en notas no cuenta para el veredicto. Ver CR-004. |

### D-4 — Regla de referencias `related` (`MAD-02`) // satisface: AC-1, AC-2

Se leen las entradas de `related` del frontmatter, en forma de bloque (`  - <valor>`) o en línea (`related: [a, b]`,
`related: []`). Normalización de cada valor: recortar espacios, comillas y un envoltorio `[[…]]`.

| Valor normalizado | Tipo | Resolución | Resultado |
|---|---|---|---|
| Empieza por `STORY-` seguido de ≥ 3 dígitos (`STORY-064`, `STORY-086-slug`) | referencia a historia | Glob `$SPECS_BASE/specs/03-stories/<STORY-NNN>-*/story.md` con el prefijo `STORY-NNN` (guion obligatorio, regla de STORY-120 › D-5) | Existe → sin hallazgo; no existe → `MAD-02` |
| Empieza por `EPIC-` seguido de ≥ 2 dígitos (`EPIC-19`, `EPIC-19-framework-consistency`) | referencia a épica | Glob `$SPECS_BASE/specs/02-epics/<EPIC-NN>-*/epic.md` (regla de STORY-120 › D-2.3) | Existe → sin hallazgo; no existe → `MAD-02` |
| Empieza por `STORY-` o `EPIC-` sin ID numérico (`STORY-XXX-…`) | referencia a historia/épica no resoluble | No hay ID que buscar | `MAD-02` |
| Cualquier otro (`ADR-0008`, `domain-…`, slug libre) | fuera de alcance | No se evalúa | Sin hallazgo ni nota |

- La resolución es **por ID**, no por slug: `STORY-086-otro-slug` resuelve si existe `STORY-086-*`. Un slug desactualizado
  no es una referencia rota (mismo criterio que la pertenencia por prefijo en STORY-120 › D-5).
- Una historia que se referencia a sí misma, o a su propia épica, resuelve normalmente.
- El mismo valor repetido en el `related` de una historia produce **un** `MAD-02` (con todas sus líneas). El mismo valor
  roto en dos historias produce un `MAD-02` por historia: la acción se aplica en cada `story.md`.
- `related` ausente, vacío o ilegible: sin hallazgo (el campo es opcional en el template de historia); si es ilegible,
  nota con la ruta.

| Alternativa | Rechazo |
|---|---|
| Igualdad exacta del slug con el nombre del directorio | Marcaría como rotas las 109 referencias en forma `STORY-064` (solo ID) y cualquier slug renombrado, sin que el destino falte. |
| Resolver también `ADR-` y slugs de `docs/` | AC-1 limita la regla a "historias o épicas"; cada tipo tiene su propio layout y ampliar el alcance no lo pide ningún AC. |
| Ignorar los valores `STORY-`/`EPIC-` sin ID numérico | El caso real `STORY-XXX-epic-template-minimalista` es una referencia a historia que nunca resolverá: justo lo que el PO debe corregir. |

### D-5 — Catálogo de comprobaciones de madurez (familia MAD) // satisface: AC-2, CNF-1, CNF-2

| Código | Severidad | Condición | Elemento citado | Evidencia | Acción sugerida |
|---|---|---|---|---|---|
| MAD-01 | WARNING | Historia del universo en `SPECIFY` con `substatus` ≠ `DONE` (D-3) | `STORY-NNN` (la historia hija) + `status/substatus` literales | `story.md:<línea de status>` | `completar su especificación con /story-specify` |
| MAD-02 | WARNING | Entrada `related` a historia o épica que no resuelve (D-4) | El valor referenciado (p. ej. `STORY-999`) | `STORY-NNN › story.md:<línea(s) de related>` de la historia que lo declara | `corregir o retirar la referencia` |
| MAD-03 | WARNING | Historia del universo con `status` ausente o fuera del vocabulario (D-3) | `STORY-NNN` + `status` literal (o `ausente`) | `story.md:<línea de status>` o la ruta si falta | `normalizar status/substatus al vocabulario de domain-story-lifecycle` |

- Las acciones de `MAD-01` y `MAD-02` son los literales de AC-2.
- Una historia puede tener a la vez `MAD-01` (o `MAD-03`) y varios `MAD-02`: son defectos distintos con acciones distintas.
- **Orden** (CNF-3), integrado en el de STORY-120 › D-6: código ascendente (`INT-` < `MAD-` < `SAL-` por orden
  alfabético del prefijo, el mismo criterio "código ascendente"); dentro de `MAD-01`/`MAD-03`, por `STORY-NNN` de la
  historia ascendente; dentro de `MAD-02`, por `STORY-NNN` de la historia que declara y luego por la primera línea del
  valor en su `related`. Los `H-NNN` se numeran tras ordenar todas las familias.
- Todos son WARNING: cuentan para el umbral de `NEEDS-REFINEMENT` (> 3 WARNING) de STORY-120 › D-7 y nunca producen
  `BLOCKED` por sí solos.

AC-2 se sigue directamente: fila 1 (`STORY-202` en `SPECIFY/IN-PROGRESS`) → `MAD-01` citando `STORY-202`; fila 2
(`STORY-201 › related: STORY-999`) → `MAD-02` citando `STORY-999`. AC-1 (ambas en `SPECIFY/DONE`, `related`
resolubles) → ningún `MAD-`.

| Alternativa | Rechazo |
|---|---|
| `MAD-02` citando la historia que declara como elemento | AC-2 exige que el hallazgo cite `STORY-999`; la historia que declara va en la evidencia. |
| Un único `MAD-02` por valor roto, agregando todas las historias | La acción se ejecuta por `story.md`; agrupar complica el orden y la evidencia sin beneficio para el PO. |

### D-6 — Reporte: sin sección nueva, con conteo en `resumen` // satisface: AC-1, CNF-2

- Los hallazgos `MAD-` van en la sección `hallazgos` con el formato de STORY-120 › D-8 (`### H-NNN [WARNING] — MAD-0N: <título>`
  con **Elemento**, **Evidencia** y **Acción sugerida**).
- La sección `resumen` del template seed `skills/epic-analyze/assets/epic-analyze-report-template.md` añade un campo:
  `Madurez de historias hijas: <l>/<t> listas` (`t` = tamaño del universo, `l` = historias sin `MAD-01`/`MAD-03`).
  Con universo vacío: `Madurez de historias hijas: 0/0 listas`.
- Las notas (`related` ilegible, texto con apariencia de instrucción) van en `notas-analisis` y no cuentan.
- Un template central personalizado sin el campo nuevo en `resumen`: el campo se omite; hallazgos y veredicto intactos
  (comportamiento de STORY-120 › D-8 para contenido no declarado).
- Los valores citados (`status`, valores de `related`) van en código en línea, nunca como Markdown activo (STORY-120 › D-10).

| Alternativa | Rechazo |
|---|---|
| Sección nueva `madurez-historias` con una tabla por historia | AC-1 solo pide ausencia de hallazgos; una tabla de historias listas repite el índice de STORY-120 (YAGNI). |
| Ampliar la tabla `indice-historias` con una columna `status` | Mezcla dos familias en una sección; I-6 prevé que cada familia aporte sus propios datos. |
| Sin conteo en `resumen` | El PO no distinguiría "historias listas" de "comprobación no ejecutada" cuando no hay hallazgos `MAD-` (AC-1). |

### D-7 — Frontmatter de `story.md` como datos // satisface: CNF-2, CNF-3

La cláusula `ai-untrusted-content-clause` de STORY-120 › D-10 cubre también los campos nuevos: de `status`,
`substatus` y `related` solo se extraen valores escalares; un valor que parezca una instrucción no se sigue, no cambia la
clasificación de D-3/D-4 (se clasifica como cualquier otro valor) y, si contiene texto imperativo, se anota en
`Notas del análisis` con su ubicación. El skill no escribe ningún `story.md` (CNF-2).

### D-8 — Evals: casos nuevos y mundos previos // satisface: AC-1, AC-2, CNF-1, CNF-2, CNF-3

TDD de skills (constitución principio 11): los casos se añaden a `skills/epic-analyze/evals/evals.json` **antes** de
modificar `SKILL.md` y el template seed. Se usa el rango **TC-019…TC-025**, posterior al de STORY-121 (TC-011…TC-018),
para que ambos órdenes de implementación eviten colisiones de ID.

| Caso | Tipo | Escenario | Fragmentos esperados |
|---|---|---|---|
| TC-019 | happy-path | AC-1: `STORY-201` y `STORY-202` en `SPECIFY/DONE`; `related` → `EPIC-30-ejemplo` y `STORY-202`/`STORY-201` existentes | `Madurez de historias hijas: 2/2`; `not_contains`: `MAD-0` |
| TC-020 | happy-path | AC-2 fila 1: `STORY-202` en `SPECIFY/IN-PROGRESS` | `MAD-01`, `STORY-202`, `WARNING`, `completar su especificación con /story-specify`, `APPROVED` |
| TC-021 | happy-path | AC-2 fila 2: `STORY-201 › related: STORY-999` | `MAD-02`, `STORY-999`, `WARNING`, `corregir o retirar la referencia`, `APPROVED` |
| TC-022 | happy-path | CNF-1: `STORY-202` en `CANCELED` con `related: STORY-999`; `STORY-201` en `COMPLETED/READY` | `not_contains`: `MAD-0` |
| TC-023 | happy-path | D-4: `related` con `ADR-0008`, `domain-story-lifecycle`, `STORY-201` (solo ID) y `STORY-XXX-placeholder` | Un único `MAD-02` citando `STORY-XXX-placeholder`; `not_contains`: `ADR-0008` en hallazgos |
| TC-024 | happy-path | D-3 + regla de veredicto: 4 historias en `SPECIFY/TODO` → 4 × `MAD-01`; una con `status: BACKLOG` → `MAD-03` | `MAD-01`, `MAD-03`, `NEEDS-REFINEMENT` |
| TC-025 | happy-path | CNF-3: reporte previo con un `MAD-01` de una historia que ya está en `SPECIFY/DONE` | reporte nuevo sin ese hallazgo; `not_contains`: `MAD-01` |

En todos: `not_contains` de bloques `=== FILE:` para `epic.md` y `story.md` (CNF-2).

**Mundos de TC-001…TC-018 (CR-002):** sus `input` se completan con `status: SPECIFY`, `substatus: DONE` (o un estado
posterior) y un `related` vacío o resoluble en cada historia de ejemplo, para que la familia `MAD-` no altere sus
veredictos esperados. Solo cambia el `input`; las aserciones no se tocan. Los casos que fallan antes del análisis
(TC-007, TC-009) no requieren cambio. Si STORY-121 aún no está implementada, solo se completan TC-001…TC-010 y
STORY-121 aplicará la misma regla a TC-011…TC-018 al implementarse.

### D-9 — Documentación // satisface: CNF-2

| Destino | Cambio |
|---|---|
| `CHANGELOG.md` | `## [Unreleased] › ### Added`: en la entrada de `/epic-analyze` (o una propia si ya se publicó), la familia `MAD-01…MAD-03`, el umbral `SPECIFY/DONE` y la resolución de `related` por ID (STORY-122, EPIC-19). |
| `docs/domains/domain-epic-lifecycle.md` §8 | La fila `Gate de integridad de historias` que añade STORY-120 amplía su "Qué valida" con "y madurez de las historias hijas (estado ≥ `SPECIFY/DONE`, `related` resolubles)". |
| `docs/domains/domain-story-lifecycle.md` | Sin cambio: es la fuente del orden de estados, no se modifica. |
| `docs/guides/sddf-commands-pipeline.md`, `docs/domains/domain-skills-map.md`, `package.json` | Sin cambio: la fila de STORY-120 sigue siendo exacta y `"skills/"` ya publica el skill. |

Autoría: `skill-master` (worker `monolithic`) para `SKILL.md` y el template seed; `skill-test-evals` para `evals.json`.
La copia en `.claude/skills/` es salida de `agile-sddf install`.

## Componentes afectados

| Componente | Acción | Ubicación | AC / CNF que satisface |
|---|---|---|---|
| Casos de eval | modificar (antes que `SKILL.md`): TC-019…TC-025 + `input` de los casos previos | `skills/epic-analyze/evals/evals.json` | // satisface: AC-1, AC-2, CNF-1, CNF-3 |
| Template seed del reporte | modificar: campo de madurez en `resumen` | `skills/epic-analyze/assets/epic-analyze-report-template.md` | // satisface: AC-1 |
| Contrato del skill | modificar: Vía B extrae `status`/`substatus`/`related` con línea para el universo (D-2), paso de la familia MAD (D-3…D-5), lista ordenada de estados con cita a `domain-story-lifecycle`, orden integrado, cláusula de datos (D-7) | `skills/epic-analyze/SKILL.md` | // satisface: AC-1, AC-2, CNF-1, CNF-2, CNF-3 |
| Changelog | modificar | `CHANGELOG.md` | // satisface: CNF-2 (comunica el comportamiento) |
| Ciclo de vida de épica | modificar (§8, una fila) | `docs/domains/domain-epic-lifecycle.md` | // satisface: CNF-2 (documenta el gate ampliado) |

No se modifica: ningún `epic.md` ni `story.md`, `epic-template.md`, `story-template.md`, `epic-format-validation`,
`story-analyze`, la regla de veredicto D-7 ni el retorno I-3 de STORY-120, `package.json`.

## Interfaces

| ID | Interfaz | Contrato | AC / CNF |
|---|---|---|---|
| I-1 | Invocación | Sin cambio: `/epic-analyze <epica> [--auto]` (STORY-120 › I-1). Sin flag para activar la familia `MAD-`. | AC-1, AC-2 |
| I-2 | Lectura de madurez | Entrada: `universo` (D-2) con `status`, `substatus`, `related[]` y sus líneas. Salida: `Madurez[]`, una por historia (D-3, D-4) | AC-1, AC-2, CNF-1 |
| I-3 | Resolución de referencia | Entrada: valor normalizado de `related`. Salida: `historia` \| `epica` \| `fuera-de-alcance` × `resuelve` (bool) (D-4) | AC-2 |
| I-4 | Hallazgo | Sin cambio de forma (STORY-120 › I-5): `codigo ∈ MAD-01…MAD-03`, `severidad = WARNING` | AC-2, CNF-2 |
| I-5 | Template del reporte | `resumen` admite `Madurez de historias hijas: <l>/<t> listas`; sin clave nueva (D-6) | AC-1 |
| I-6 | Retorno en modo Agent | Sin cambio (STORY-120 › I-3): los `MAD-` se reflejan en `VEREDICTO` y `HALLAZGOS` | CNF-2 |

## Esquema de datos

Modelo interno (abstracto, no código), que se suma al de STORY-120 y STORY-121:

| Entidad | Campos | Origen |
|---|---|---|
| `RegistroHistoria` (ampliado) | + `status` (texto \| ausente) y su `linea`, + `substatus` (texto \| ausente), + `related[]` de `ReferenciaRelated` | D-2 |
| `ReferenciaRelated` | `valor` (literal), `normalizado`, `lineas[]` (en `story.md`), `tipo` (historia \| epica \| fuera-de-alcance), `resuelve` (bool \| n/a) | D-4 |
| `Madurez` | `historia` (`STORY-NNN`), `clasificacion` (lista \| no-lista \| no-clasificable), `rotas[]` (`ReferenciaRelated` con `resuelve = false`) | D-3, D-4 |

Cruce: `MAD-01` = `Madurez` con `clasificacion = no-lista`; `MAD-03` = `clasificacion = no-clasificable`; `MAD-02` = cada
elemento de `rotas[]`. `l` del resumen = `Madurez` con `clasificacion = lista`; `t` = tamaño del universo.

## Flujos clave

### F-1 — Historias hijas listas (AC-1)
1. Pasos 0–4 de STORY-120: `EPIC-30-ejemplo` resuelta; índice y Vía B cruzados; universo = {STORY-201, STORY-202}.
2. D-2: Vía B aporta `status`, `substatus`, `related` de ambas.
3. D-3: ambas `SPECIFY/DONE` → `lista`. D-4: cada `related` `STORY-`/`EPIC-` resuelve por glob.
4. D-5: ningún `MAD-`; el veredicto (D-7 de STORY-120) depende solo de las demás familias.
5. D-6: `resumen` muestra `Madurez de historias hijas: 2/2 listas`.

### F-2 — Historias no listas o referencias rotas (AC-2)
Igual que F-1 hasta el paso 2; D-3 clasifica `STORY-202` (`SPECIFY/IN-PROGRESS`) como `no-lista` → `MAD-01`, o D-4 no
resuelve `STORY-999` en el `related` de `STORY-201` → `MAD-02`. D-7 de STORY-120 suma los WARNING.

### F-3 — Degradación (P7)

| Fallo | Comportamiento |
|---|---|
| `story.md` del universo con frontmatter ilegible | Ya cubierto por STORY-120 › D-5 (`INT-04` si listada; nota si no). Sin `status` legible → `MAD-03`. Nunca se aborta. |
| `related` en forma no reconocida (ni bloque ni en línea) | Sin `MAD-02` para esa historia; nota con la ruta y la línea. |
| `specs/02-epics/` o `specs/03-stories/` ausente | Toda referencia del tipo correspondiente no resuelve → `MAD-02`. |
| Universo vacío | Ningún `MAD-`; `resumen`: `0/0 listas`. |
| Template central sin el campo de madurez en `resumen` | Campo omitido; hallazgos y veredicto intactos (D-6). |

## Decisiones de complejidad justificada

- **`MAD-03` además de los dos códigos de AC-2:** existen estados reales fuera del vocabulario (`BACKLOG`,
  `READY-FOR-VERIFY`, `READY-FOR-CODE-REVIEW`); asignarlos a `MAD-01` daría una acción falsa y ocultarlos en notas
  impediría que cuenten para el veredicto. Un código más es la forma más simple de dar una acción correcta.
- **Lista de estados declarada en `SKILL.md`:** duplica el orden de `domain-story-lifecycle` §4.1, pero ese documento no
  llega a los proyectos consumidores; la cita explícita permite detectar la divergencia en revisión.
- **Resolución por ID y no por slug:** una regla de una línea evita 109 falsos positivos en el repositorio actual.
- **Universo compartido con STORY-121:** una sola definición de "historia hija" en el reporte; el coste es coordinar
  qué historia lo introduce (CR-001).
- Lo que **no** se añade: sección nueva del reporte, resolución de `ADR-`/slugs, detección de ciclos, lectura del cuerpo
  o de `analyze.md`, flags. Ninguno lo exige un AC o CNF.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Historias `SPECIFY/DONE` con `related` resolubles → sin hallazgos `MAD-` | TC-019 | AC-1 |
| 2 | `SPECIFY/IN-PROGRESS` → `MAD-01` WARNING citando la historia y con la acción literal | TC-020 | AC-2 |
| 3 | `related` a `STORY-999` → `MAD-02` WARNING citando `STORY-999` y con la acción literal | TC-021 | AC-2 |
| 4 | `CANCELED` y estados posteriores no generan `MAD-` | TC-022 | CNF-1 |
| 5 | Solo `STORY-`/`EPIC-` se resuelven, por ID; placeholders sin ID son rotos | TC-023 | AC-2 |
| 6 | Los `MAD-` cuentan para el veredicto (> 3 WARNING → `NEEDS-REFINEMENT`) y no se escribe `epic.md`/`story.md` | TC-024; `not_contains` de bloques FILE de fuentes en TC-019…TC-025 | CNF-2 |
| 7 | Mismo input → mismos hallazgos; sin acumulación del reporte previo | TC-025 + segunda ejecución real sobre EPIC-19 con `git diff --no-index` (solo difiere `updated:`) | CNF-3 |
| 8 | Los mundos previos conservan sus veredictos | `npm run test:eval -- epic-analyze` con todos los TC aprobados | AC-1, AC-2 |
| 9 | Checklist de skills sigue cumpliéndose | `gr-skill-creation-checklist › How to run the validation` con `SKILL=skills/epic-analyze` (`SKILL.md` < 500 líneas), `node scripts/verify-eval-inventory.js`, `grep` de `ai-untrusted-content-clause` | CNF-2 |

## Risks / Trade-offs

- [La lista de estados en `SKILL.md` diverge de `domain-story-lifecycle` si el dominio cambia] → cita explícita a §4.1
  en `SKILL.md`; un estado nuevo no previsto aparece como `MAD-03`, nunca como "lista" por error.
- [Una épica real (EPIC-19) puede pasar a `NEEDS-REFINEMENT` por varias historias en `SPECIFY` o con estados heredados]
  → comportamiento esperado: es la señal que la historia pide dar al PO.
- [Implementación en orden distinto al previsto (STORY-122 antes que STORY-121)] → universo con la misma definición y
  rango de evals separado (D-2, D-8); CR-001 indica qué revisar.
- [`SKILL.md` crece con una tercera familia (límite de 500 líneas)] → catálogo y reglas en tablas compactas; si el
  límite se acerca, las tablas de reglas de las familias pasan a `references/` del skill.

## Open Questions

Ninguna: las ambigüedades detectadas se resolvieron en D-1…D-9 o se registran como CR.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: `skills/epic-analyze/` no existe todavía; STORY-120 y STORY-121 están en `READY-FOR-IMPLEMENT/DONE`. Este diseño modifica archivos que crea STORY-120 (`SKILL.md`, template seed, `evals.json`), se apoya en sus D-5, D-6, D-7, D-8 y D-10, y comparte con STORY-121 la definición del universo (su D-3).
- **Documento afectado**: story.md / design.md
- **Acción requerida**: Implementar STORY-122 después de STORY-120 (al menos `story-implement`). Si se implementa antes que STORY-121, introduce el cálculo del universo (D-2) y STORY-121 lo reutiliza en lugar de recalcularlo. Si el contrato de STORY-120 cambia durante su implementación (pasos, orden de hallazgos, campos de `resumen`), revisar D-1, D-5 y D-6 antes de implementar.

### CR-002
- **Tipo**: dependencia
- **Descripción**: Los mundos de TC-001…TC-018 (STORY-120/121) no fijan `status` ni `related` de sus historias de ejemplo; con la familia `MAD-` podrían recibir `MAD-01`/`MAD-03` y cambiar sus veredictos esperados (p. ej. TC-005 con 1 WARNING pasaría a 2+, y TC-006 ya está en el umbral). La historia no lo menciona.
- **Documento afectado**: design.md
- **Acción requerida**: Completar el `input` de esos casos con historias en `SPECIFY/DONE` o posterior y `related` resoluble (D-8), sin tocar sus aserciones. Misma regla que CR-002 de STORY-121.

### CR-003
- **Tipo**: ambigüedad
- **Descripción**: CNF-1 dice que `CANCELED` "no genera hallazgo de madurez", pero no si una historia cancelada con una referencia `related` rota genera `MAD-02`. El diseño excluye las canceladas de ambas comprobaciones (D-2).
- **Documento afectado**: story.md
- **Acción requerida**: El Product Owner confirma la exclusión; si prefiere evaluar `related` también en las canceladas, el cambio queda en D-2 (una línea) y en TC-022.

### CR-004
- **Tipo**: ambigüedad
- **Descripción**: La historia no define qué ocurre con un `status` ausente o fuera del vocabulario de `domain-story-lifecycle` (en el repositorio hay `BACKLOG`, `READY-FOR-VERIFY` y `READY-FOR-CODE-REVIEW`). El diseño añade `MAD-03` (WARNING, acción "normalizar status/substatus") en lugar de asignarlos a `MAD-01` o a notas (D-3).
- **Documento afectado**: story.md
- **Acción requerida**: El Product Owner confirma `MAD-03`; opcionalmente se añade una fila a la tabla de ejemplos de AC-2. Hasta entonces el diseño lo mantiene y `story-testcases` lo cubre (TC-024) como caso adicional.
