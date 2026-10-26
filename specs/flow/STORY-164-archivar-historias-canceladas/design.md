---
alwaysApply: false
type: design
id: STORY-164
slug: STORY-164-archivar-historias-canceladas-design
title: "Design: Skill story-complete: archivar historias canceladas"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-27-completar-flujo-de-story
story: STORY-164
created: 2026-10-25
updated: 2026-10-25
related:
  - STORY-164-archivar-historias-canceladas
  - EPIC-27-completar-flujo-de-story
  - STORY-160-completar-y-archivar-historia-entregada
---

<!-- Referencias -->
[[STORY-164-archivar-historias-canceladas]] · [[EPIC-27-completar-flujo-de-story]] · [[STORY-160-completar-y-archivar-historia-entregada]] · [[layout-fijo-de-tres-raices]]

# Diseño técnico: Skill story-complete: archivar historias canceladas

## Context

STORY-160 crea el skill `story-complete` (completar y archivar historias `DELIVER/DONE` y `COMPLETED/DONE`) respetando ADR-0016 tal como está: rechaza `CANCELED/DONE` nombrando ADR-0016 (fila 4 de su AC-2). Esta historia extiende ese skill para archivar también las historias `CANCELED/DONE` **sin cambiar su frontmatter**, y reemplaza ADR-0016 por un ADR nuevo que admite esas historias en `specs/flow/archive/`. En adelante, «historia base» es STORY-160 y sus criterios (AC-1…AC-3, CNF-1…CNF-7) son el contrato que se extiende.

Estado verificado en el filesystem (2026-10-25):

- `skills/story-complete/` **todavía no existe**: STORY-160 está en `PLAN/IN-PROGRESS` y sin `design.md`. Esta historia se implementa después de STORY-160 (nota de dependencia de la historia) y modifica los artefactos que esa historia crea. Los cambios de C-1 se anclan a los gates del contrato de STORY-160 (resolución, admisión por estado, fecha de archivo, confirmación, conflicto de destino, movimiento), no a números de paso (CR-001).
- ADR-0016 (`docs/adr/ADR-0016-layout-fijo-de-tres-raices.md`, `ACCEPTED`) fija: «`specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/` recibe solo las stories con `status: COMPLETED`; `<YYYY-MM-DD>` es el `updated:` … y, si falta, su `created:`. Las stories `CANCELED` … quedan en `specs/flow/`». Por `docs/adr/README.md` (Convención › Inmutabilidad), el ADR reemplazado solo admite cambios en `status`, `superseded-by` y una nota visible bajo su título (formato de ejemplo: `docs/adr/ADR-0010-specs-dentro-de-docs.md`).
- El siguiente número libre es **ADR-0017** (último: ADR-0016; hay dos archivos ADR-0013, sin efecto aquí).
- `scripts/migrate-specs-to-flow.js` exporta `archiveDate(frontmatter)` (líneas 75-80): usa `updated:` → `created:` y **solo si no existe ninguna de las dos claves** usa `date:`, siempre con formato `YYYY-MM-DD`. Es un script de un solo uso (STORY-153, «no es un comando reutilizable») y no se publica con el paquete, así que se reutiliza la **regla**, no el código (D-3).
- Ningún script de `npm run verify:repository` lee el `status` de las historias de `specs/flow/archive/`: `scripts/verify-fixed-layout.js` solo valida `skills/*/SKILL.md`, documentos activos y `.env.template`; `skills/memory-system/scripts/memory-system.js` clasifica por ruta (`archive/` → capa `specs-archive`, línea 368), sin mirar el status. CNF-3 ya se cumple hoy; falta una prueba que lo fije (D-7).
- 11 historias `CANCELED` viven hoy en `specs/flow/` (p. ej. STORY-030, STORY-080, STORY-119); ninguna en `specs/flow/archive/`. Esta historia no las archiva (Non-Goals: el movimiento lo decide el usuario con el skill).
- La regla de archivo «solo `COMPLETED`, fecha `updated:` → `created:`» aparece, además de en ADR-0016, en: `AGENTS.md:10`, `docs/constitution.md:95` y `:225`, `docs/domains/domain-work-item-hierarchy.md:72`, `docs/domains/domain-knowledge-artifacts.md:244`, `docs/guides/root-folder-practices.md:29`, `:32-33` («Las historias `CANCELED` y las épicas no se archivan») y `:80`, y `docs/architecture/sddf-architecture.md:141`. Las tres últimas rutas no las nombra la historia, pero quedarían falsas (regla de Veracidad de `AGENTS.md`, CR-002).
- Más de 20 `SKILL.md` declaran «El layout no es configurable (ADR-0016).» y `test/sddf-init-layout.test.js:60` y `test/verify-fixed-layout.test.js:23` comprueban ese texto. No se tocan (D-2).

Stack: skills en Markdown + scripts Node.js (CommonJS, `node:test`); el código de producción se genera con `skill-master` y las pruebas de skill son evals (`sddf.config.yaml › implement`).

## Goals / Non-Goals

**Goals:**

- `/story-complete STORY-NNN` sobre una historia `CANCELED/DONE`, tras confirmación, mueve su directorio a `specs/flow/archive/<fecha>-STORY-NNN-<slug>/` sin escribir `story.md`, con la fecha de `updated:` → `created:` → `date:`. // satisface: AC-1, CNF-4
- Rechaza `CANCELED` con substatus distinto de `DONE` (nombrando el estado) y `CANCELED/DONE` sin fecha válida (nombrando los tres campos), sin efectos. // satisface: AC-2, CNF-4
- ADR-0017 reemplaza a ADR-0016 y la regla de archivo nueva queda descrita en `AGENTS.md`, `docs/constitution.md` y `docs/domains/`. // satisface: AC-3, CNF-1, CNF-2
- Gate en verde y una prueba que fija que el gate acepta historias `CANCELED` archivadas. // satisface: CNF-3

**Non-Goals:**

- Completar y archivar `DELIVER/DONE` o `COMPLETED/DONE` (STORY-160), salvo el cambio de la cadena de fecha que impone el ADR nuevo (D-3).
- Pasar una historia a `CANCELED`, reabrirla o desarchivarla.
- Archivar épicas.
- Archivar las 11 historias `CANCELED` actuales del repositorio.
- Mostrar el status en el índice de `docs/index.md` o separar canceladas de completadas en `specs/flow/archive/` (D-5).
- Reescribir las referencias «(ADR-0016)» de los skills (D-2).
- Commit, push o PR.

## Componentes afectados

| # | Componente | Acción | Ubicación | AC / CNF |
|---|---|---|---|---|
| C-1 | Skill `story-complete` | modificar | `skills/story-complete/SKILL.md`: frontmatter (`description`, `triggers`), `## Precondiciones`, `## Restricciones / Reglas`, pasos de admisión, fecha de archivo, confirmación y escritura, `## Manejo de errores`, `## Salida` | AC-1, AC-2, CNF-4 |
| C-2 | Evals del skill | modificar | `skills/story-complete/evals/evals.json` (casos nuevos y el caso `CANCELED` de STORY-160) | AC-1, AC-2, CNF-4 |
| C-3 | README del skill | modificar | `skills/story-complete/README.md` (estados admitidos, regla de fecha) si STORY-160 lo crea | AC-1 (Veracidad) |
| C-4 | ADR nuevo | crear | `docs/adr/ADR-0017-layout-fijo-con-archivo-de-historias-canceladas.md` | AC-3 |
| C-5 | ADR reemplazado | modificar (solo campos permitidos) | `docs/adr/ADR-0016-layout-fijo-de-tres-raices.md`: `status: SUPERSEDED`, `superseded-by: ADR-0017`, nota bajo el título | AC-3, CNF-1 |
| C-6 | Índice de ADRs | modificar | `docs/adr/README.md` (fila ADR-0016 → `SUPERSEDED → ADR-0017`; fila nueva ADR-0017) | AC-3 |
| C-7 | Instrucciones de agentes | modificar | `AGENTS.md` (regla «Layout fijo», frase de archivo) | AC-3 |
| C-8 | Constitución | modificar | `docs/constitution.md` (jerarquía, línea 95; mapa de rutas, línea 225) | AC-3 |
| C-9 | Dominio transversal | modificar | `docs/domains/domain-state-management.md` §4 invariante 6 (texto que deja STORY-160) | AC-3, CNF-2 |
| C-10 | Dominio de story | modificar | `docs/domains/domain-story-lifecycle.md` §5 fila `CANCELED`, §9 (archivo) | AC-3, CNF-2 |
| C-11 | Dominios con la regla de archivo | modificar | `docs/domains/domain-work-item-hierarchy.md:72`, `docs/domains/domain-knowledge-artifacts.md:244` | AC-3 |
| C-12 | Guía de raíces | modificar | `docs/guides/root-folder-practices.md:29`, `:32-33`, `:80` | AC-3 (Veracidad, CR-002) |
| C-13 | Arquitectura | modificar | `docs/architecture/sddf-architecture.md:141` | AC-3 (Veracidad, CR-002) |
| C-14 | Guía del pipeline | modificar | `docs/guides/sddf-commands-pipeline.md` (fila de `story-complete` que deja STORY-160: estados admitidos) | AC-1 (Veracidad) |
| C-15 | Prueba del gate | modificar | `test/memory-system.test.js` (caso nuevo junto al de la línea 1331) | CNF-3 |
| C-16 | Índice de memoria | regenerar | `docs/index.md` con `/memory-system index` (entrada de ADR-0017) | AC-3 |

Sin cambios: `scripts/verify-fixed-layout.js` y el resto de `scripts/verify-*.js` (no leen el status de las historias archivadas, D-7), `scripts/migrate-specs-to-flow.js` (un solo uso; su `archiveDate` ya aplica la cadena de D-3), `skills/memory-system/scripts/memory-system.js` (clasifica por ruta), los `SKILL.md` con «(ADR-0016)» y sus pruebas (D-2), `package.json` (`skills/story-complete` lo agrega STORY-160, CNF-2 de esa historia), `docs/guardrails/` (no hay DoD de la etapa de archivo), `specs/flow/EPIC-27-completar-flujo-de-story/epic.md` (CR-003).

## Decisions

### D-1 — Admisión por estado: `CANCELED/DONE` se archiva sin escribir // satisface: AC-1, AC-2

La tabla de admisión de STORY-160 se amplía. Es el único lugar del `SKILL.md` que decide qué se hace por estado:

| `status` / `substatus` | Acción | Escribe `story.md` | Origen |
|---|---|---|---|
| `DELIVER` / `DONE` | completar (`COMPLETED`, `updated:` = hoy) y archivar | sí | STORY-160 |
| `COMPLETED` / `DONE` | archivar | no | STORY-160 |
| `CANCELED` / `DONE` | **archivar conservando el status** | **no** | esta historia |
| `CANCELED` / otro substatus | rechazo: `❌ La historia STORY-NNN no puede archivarse: estado actual CANCELED/<substatus>. Solo se archivan las historias CANCELED con substatus DONE.` | no | AC-2 fila 1 |
| cualquier otro | rechazo de STORY-160 (sugiere `/story-delivery`) | no | STORY-160 AC-2 |

La fila `CANCELED/DONE` de AC-2 de STORY-160 («ADR-0016 no admite su archivado») se elimina, como pide la nota de la historia. El mensaje de rechazo de la fila `CANCELED/otro` no sugiere `/story-delivery`: una historia cancelada no se entrega.

| Alternativa | Motivo del rechazo |
|---|---|
| Escribir `updated:` = hoy al archivar una `CANCELED` (como `DELIVER`) | AC-1 exige «frontmatter sin cambios»; la nota de la historia: «conserva su status y su `updated:`». |
| Archivar `CANCELED` con cualquier substatus | `IN-PROGRESS` indica una cancelación no cerrada; AC-2 fila 1 lo rechaza. |
| Flag explícito (`--canceled`) para archivar canceladas | El status ya distingue el caso; un flag añadiría un error nuevo («falta --canceled») sin información adicional. |

### D-2 — ADR-0017 reemplaza a ADR-0016 por completo, re-enunciando el layout // satisface: AC-3, CNF-1

ADR-0017 (`docs/adr/ADR-0017-layout-fijo-con-archivo-de-historias-canceladas.md`, `slug: layout-fijo-con-archivo-de-historias-canceladas`) sigue `docs/adr/adr-template.md`, con `supersedes: ADR-0016`, `superseded-by: null`, `status: ACCEPTED` y `date:` de la implementación. Contenido:

- **Contexto:** ADR-0016 no deja archivar historias `CANCELED`; EPIC-27/STORY-164 necesitan sacarlas de `specs/flow/` sin confundirlas con entregadas.
- **Decisión:** re-enuncia **sin cambios** las tres raíces, el layout no configurable, `docs/requirements/` y el nombre de directorio de ADR-0016, y sustituye solo la viñeta **Archivo** por: «`specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/` recibe las stories con `status: COMPLETED` o `status: CANCELED` (ambas con `substatus: DONE`); el status se conserva al archivar y es lo que distingue una historia entregada de una cancelada. `<YYYY-MM-DD>` es el `updated:`; si no es válido, el `created:`; si el frontmatter no tiene ninguna de esas dos claves, el `date:`. Una story sin fecha válida no se archiva. Las épicas y las stories en cualquier otro estado quedan en `specs/flow/`.» El árbol de la sección cambia el comentario de `archive/` a `stories COMPLETED o CANCELED`.
- **Alternativas consideradas:** las de la tabla siguiente.
- **Consecuencias:** las menciones «(ADR-0016)» de skills y documentos que se refieren al layout siguen siendo válidas (ADR-0016 remite a ADR-0017 en su nota); las que describen la **regla de archivo** se actualizan (C-7…C-13).

ADR-0016 solo recibe `status: SUPERSEDED`, `superseded-by: ADR-0017` y bajo su título: `> **Superado por [ADR-0017](ADR-0017-layout-fijo-con-archivo-de-historias-canceladas.md) (<fecha>):** el layout de tres raíces se mantiene; el archivo admite también las historias `CANCELED` y la fecha puede salir de `date:`.` (CNF-1, formato de ADR-0010).

| Alternativa | Motivo del rechazo |
|---|---|
| Editar la viñeta de archivo de ADR-0016 in place | Viola la inmutabilidad de los ADR aceptados (`AGENTS.md`, `docs/adr/README.md`, CNF-1). |
| ADR-0017 que solo trate el archivo y deje ADR-0016 `ACCEPTED` | La historia exige `superseded-by`; además dos ADR vigentes se contradirían en la viñeta de archivo. |
| ADR-0017 solo con el archivo y ADR-0016 `SUPERSEDED` | El layout de tres raíces quedaría sin ADR vigente que lo enuncie. |
| Reescribir «(ADR-0016)» en los skills a «(ADR-0017)» | Toca más de 20 skills y dos pruebas sin cambio de comportamiento; la nota de reemplazo basta para llegar al ADR vigente. |

### D-3 — Cadena de fecha `updated:` → `created:` → `date:`, la misma de la migración // satisface: AC-1, AC-2

Regla única de fecha de archivo, para **todas** las historias archivables (la impone el ADR nuevo, AC-3): valores con formato `YYYY-MM-DD`; se toma el primer valor válido entre `updated:` y `created:`; `date:` solo se consulta si el frontmatter no tiene ninguna de esas dos claves. Es la semántica de `archiveDate` en `scripts/migrate-specs-to-flow.js`, con la que se archivaron las 98 historias actuales: las fechas del archivo siguen un único criterio.

| Frontmatter | Fecha | Origen |
|---|---|---|
| `updated: 2026-09-10`, `created: 2026-08-01` | `2026-09-10` | AC-1 fila 1 |
| `created: 2026-08-01`, sin `updated:` | `2026-08-01` | AC-1 fila 2 |
| `date: 2026-07-15`, sin `updated:` ni `created:` | `2026-07-15` | AC-1 fila 3 |
| ninguna válida | rechazo: `❌ La historia STORY-NNN no tiene fecha de archivo válida (YYYY-MM-DD): se buscó updated:, created: y date:.` | AC-2 fila 2 |

En `DELIVER/DONE` la fecha sigue siendo la de hoy (STORY-160 escribe `updated:` antes de mover). En `COMPLETED/DONE` la cadena gana `date:` y el mensaje de STORY-160 AC-3 fila 3 pasa a nombrar los tres campos (CR-001).

El skill aplica la regla leyendo el frontmatter (es Markdown ejecutado por el agente); no invoca el script.

| Alternativa | Motivo del rechazo |
|---|---|
| Invocar `archiveDate` desde el skill (`node -e require(...)`) | `scripts/` no se instala en proyectos consumidores y el script se declara de un solo uso. |
| Primer valor válido de los tres sin condición de claves | Para `updated:` inválido + `date:` válido archivaría con una fecha que la migración habría rechazado; dos criterios para el mismo archivo. |
| `date:` solo para `CANCELED` | El ADR nuevo fija una regla de fecha para el archivo, no por status; y dos reglas en el mismo paso divergen. |

### D-4 — Archivar una `CANCELED` es solo el movimiento // satisface: AC-1, CNF-4

Tras la confirmación, para `CANCELED/DONE` el skill **no** escribe `story.md` y ejecuta el mismo movimiento de STORY-160 (mecanismo que decida su diseño, p. ej. `git mv`, con su comportamiento ante directorio no versionado y su comprobación previa de destino existente). Al no haber escritura previa, no hace falta compensación: si el movimiento falla, nada cambió (CNF-4).

- Confirmación: `¿Confirmas archivar STORY-NNN (CANCELED/DONE, el status no cambia) en specs/flow/archive/<fecha>-STORY-NNN-<slug>/? (s/n)`. Rechazo → el mensaje de STORY-160 AC-3 fila 1 (sin cambios).
- Destino existente → el rechazo de STORY-160 AC-3 fila 2, antes de preguntar.
- Mensaje final: `✅ STORY-NNN archivada como CANCELED (status sin cambios): specs/flow/archive/<fecha>-STORY-NNN-<slug>/`. La palabra «CANCELED» en el mensaje evita leerlo como una entrega.

| Alternativa | Motivo del rechazo |
|---|---|
| Copiar y luego borrar | Pierde el historial de git y deja un estado intermedio con la historia duplicada (CNF-4). |
| Saltar la confirmación porque no cambia el status | AC-1 exige «confirma la acción»; el movimiento sigue siendo un cambio visible del repositorio. |

### D-5 — Distinción cancelada/entregada: solo por el status del frontmatter // satisface: AC-1

Archivo plano: canceladas y completadas conviven en `specs/flow/archive/` con el mismo formato de nombre; las distingue el `status` del frontmatter, que no cambia (D-1, D-4).

| Alternativa | Motivo del rechazo |
|---|---|
| Subdirectorio `specs/flow/archive/canceled/` | Contradice «sin subniveles» del layout y rompe la clasificación por ruta de `memory-system.js` y los globs `archive/<fecha>-STORY-*`. |
| Sufijo en el nombre (`-canceled`) | Cambia el formato de directorio fijado por el ADR y rompe la resolución de wikilinks `STORY-NNN-<slug>`. |
| Mostrar el status en `docs/index.md` | Cambia el generador de `memory-system` para un beneficio que el frontmatter ya da; fuera del alcance de la historia (YAGNI). |

### D-6 — Documentación: una frase canónica de la regla // satisface: AC-3, CNF-2

Todos los documentos de C-7…C-14 usan la misma formulación corta, con enlace al ADR vigente donde el documento ya enlace ADRs:

> las historias `COMPLETED` y `CANCELED` (con `substatus: DONE`) se archivan en `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/` conservando su status, con la fecha de `updated:`, `created:` o `date:` (ADR-0017)

Cambios específicos:

- `AGENTS.md`: sustituye «las historias `COMPLETED` se archivan … (o `created:` si falta)» por la frase canónica; el título «Layout fijo (ADR-0016)» pasa a «Layout fijo (ADR-0017)».
- `docs/constitution.md:95`: «archivada … al completarse o cancelarse»; `:225`: «historias COMPLETED o CANCELED archivadas».
- `docs/domains/domain-state-management.md` §4 invariante 6 (texto de STORY-160): añade «`story-complete` archiva sin cambiar el status las historias `CANCELED/DONE`, siempre con confirmación humana». // CNF-2
- `docs/domains/domain-story-lifecycle.md` §5 fila `CANCELED`: «… Estado terminal. `story-complete` la archiva sin cambiar el status, con confirmación humana.»; §9: viñeta **Archivo** con la frase canónica. // CNF-2
- `docs/domains/domain-work-item-hierarchy.md:72` y `docs/domains/domain-knowledge-artifacts.md:244`: frase canónica; el wikilink `[[layout-fijo-de-tres-raices]]` pasa a `[[layout-fijo-con-archivo-de-historias-canceladas]]`.
- `docs/guides/root-folder-practices.md`: `:29` y `:80` con «`COMPLETED` o `CANCELED`»; `:32-33`: la cadena de fecha de D-3 y «Las épicas no se archivan».
- `docs/architecture/sddf-architecture.md:141`: comentario `de las stories COMPLETED o CANCELED`.
- `docs/adr/README.md`: fila ADR-0016 → `SUPERSEDED → [ADR-0017](…)`; fila ADR-0017 `ACCEPTED`.
- `docs/index.md`: se regenera con `/memory-system index`, nunca a mano.

| Alternativa | Motivo del rechazo |
|---|---|
| Actualizar solo los documentos que nombra AC-3 | `root-folder-practices.md` afirmaría «Las historias `CANCELED` … no se archivan», falso tras la historia (regla de Veracidad, CR-002). |
| Remitir a ADR-0017 sin repetir la regla | `AGENTS.md` y la constitución se cargan como contexto en cada sesión; la regla debe leerse sin abrir el ADR. |

### D-7 — Gate: prueba de regresión, sin regla nueva de validación // satisface: CNF-3

CNF-3 ya se cumple: ningún script del gate lee el status de las historias archivadas. Se añade un caso en `test/memory-system.test.js`, junto al fixture de la línea 1331, que siembra `archive/2026-01-01-STORY-001-cancelada/story.md` con `status: CANCELED` / `substatus: DONE` y comprueba que `index` lo lista bajo «Historias archivadas (archive/)» y que `check` no reporta errores.

| Alternativa | Motivo del rechazo |
|---|---|
| Regla nueva en `verify-fixed-layout.js` que solo admita `COMPLETED`/`CANCELED` en el archivo | Ese script es «no mutante» sobre skills y documentos, no sobre work items; ampliar su alcance es otra decisión y la historia solo pide aceptar. |
| No añadir prueba | Un cambio futuro del índice que filtre por `COMPLETED` rompería CNF-3 sin aviso. |

## Interfaces

| Interfaz | Contrato | AC / CNF |
|---|---|---|
| Invocación | `/story-complete {story_id \| story_path}` sin cambios (STORY-160) | AC-1 |
| Admisión | tabla de D-1: `estado → acción ∈ {completar y archivar, archivar, rechazar}` | AC-1, AC-2 |
| Fecha de archivo | `frontmatter → YYYY-MM-DD \| sin fecha` (D-3) | AC-1, AC-2 |
| Confirmación `CANCELED` | `¿Confirmas archivar STORY-NNN (CANCELED/DONE, el status no cambia) en <destino>? (s/n)` (D-4) | AC-1 |
| Movimiento | `origen → destino` de STORY-160, sin escritura previa para `CANCELED` (D-4) | AC-1, CNF-4 |
| Mensajes nuevos | rechazo por substatus (D-1), rechazo por fecha (D-3), final `archivada como CANCELED` (D-4) | AC-1, AC-2 |
| ADR vigente | ADR-0017 con `supersedes: ADR-0016`; ADR-0016 con `superseded-by: ADR-0017` (D-2) | AC-3, CNF-1 |

## Esquema de datos // satisface: AC-1, AC-2

Frontmatter de `story.md` leído (no escrito para `CANCELED`):

| Campo | Uso |
|---|---|
| `status`, `substatus` | admisión (D-1) |
| `updated`, `created`, `date` | fecha de archivo (D-3); formato `YYYY-MM-DD` |

Casos nuevos de `evals.json` (C-2), mismo formato que los de STORY-160; los IDs son los `TC-NNN` consecutivos siguientes al último existente al implementar:

| Caso | Entrada | `expected.contains` | `expected.not_contains` | Origen |
|---|---|---|---|---|
| cancelada con `updated:` | `CANCELED/DONE`, `updated: 2026-09-10`, `created: 2026-08-01`, confirma | `archive/2026-09-10-STORY-`, `archivada como CANCELED` | `status: COMPLETED`, `/story-delivery` | AC-1 fila 1 |
| cancelada con `created:` | `CANCELED/DONE`, `created: 2026-08-01`, sin `updated:`, confirma | `archive/2026-08-01-STORY-` | `status: COMPLETED` | AC-1 fila 2 |
| cancelada con `date:` | `CANCELED/DONE`, `date: 2026-07-15`, confirma | `archive/2026-07-15-STORY-` | `status: COMPLETED` | AC-1 fila 3 |
| cancelada en curso | `CANCELED/IN-PROGRESS` | `CANCELED/IN-PROGRESS` | `¿Confirmas archivar`, `/story-delivery` | AC-2 fila 1 |
| cancelada sin fecha | `CANCELED/DONE`, sin `updated:`/`created:`/`date:` válidos | `updated:`, `created:`, `date:` | `¿Confirmas archivar` | AC-2 fila 2 |

Caso existente modificado: el de STORY-160 para `CANCELED/DONE` (rechazo por ADR-0016) se elimina o pasa a esperar la confirmación de D-4, y el de `COMPLETED/DONE` sin fecha añade `date:` a `expected.contains` (D-3).

## Flujos clave

### F-1 — Archivado de una cancelada // AC-1, CNF-4

1. Resolución de STORY-160 (`specs/flow/STORY-NNN-*/` en el primer nivel, fallo cerrado ante varias coincidencias).
2. Admisión (D-1): `CANCELED/DONE` → archivar sin escribir.
3. Fecha (D-3) → destino `specs/flow/archive/<fecha>-STORY-NNN-<slug>/`; destino existente → rechazo de STORY-160.
4. Confirmación (D-4) → `s`.
5. Movimiento (STORY-160). Mensaje final de D-4.

### F-2 — Rechazo // AC-2

- `CANCELED/<substatus ≠ DONE>` → mensaje de D-1, fin en el paso 2.
- `CANCELED/DONE` sin fecha válida → mensaje de D-3, fin en el paso 3.

En ambos, ni escritura ni movimiento.

### F-3 — Degradación // P7

| Dependencia | Fallo | Comportamiento |
|---|---|---|
| Lectura del frontmatter | ausente o mal formado | rechazo de STORY-160 (sin status) |
| Movimiento | error (no versionado, permisos) | comportamiento de STORY-160; para `CANCELED` no hay nada que deshacer (D-4) |
| Destino | ya existe | rechazo antes de la confirmación (STORY-160 AC-3 fila 2) |

### F-4 — Puntos de cambio // P6

- Estados archivables: la tabla de D-1 es el único lugar que decide.
- Regla de fecha: un único paso del skill con la cadena de D-3; un cambio futuro exige un ADR nuevo.
- Mecanismo de movimiento: lo fija STORY-160 y esta historia no lo duplica.

## Decisiones de complejidad justificada

- **Reemplazo completo del ADR (D-2):** un ADR que solo tratase el archivo sería más corto, pero dejaría el layout sin ADR vigente; re-enunciar es copiar texto ya aceptado, sin decisiones nuevas.
- **Cadena con condición de claves (D-3):** «primer valor válido» sería una regla más simple, pero crearía un segundo criterio de fecha distinto del que generó el archivo actual.
- **Documentos fuera de AC-3 (D-6, CR-002):** son cambios de una frase; dejarlos rompe la regla de Veracidad.
- **Sin regla nueva de validación (D-7):** una prueba basta para CNF-3.

## Contratos de verificación

| # | Criterio | Método de verificación | Origen |
|---|---|---|---|
| 1 | `CANCELED/DONE` se archiva con la fecha de cada fila y el frontmatter idéntico | evals de las tres filas (`npm run test:eval -- story-complete`, ejecución manual) + prueba manual con `git diff --stat -M` que muestre solo renombres | AC-1, CNF-4 |
| 2 | Rechazos sin efectos | evals «cancelada en curso» y «cancelada sin fecha» + `git status --porcelain` idéntico antes y después | AC-2, CNF-4 |
| 3 | Conteo invariante | número de `specs/flow/STORY-*/` + `specs/flow/archive/*-STORY-*/` igual antes y después de cada prueba manual | CNF-4 |
| 4 | ADR-0017 existe con `supersedes: ADR-0016`; ADR-0016 solo cambia `status`, `superseded-by` y la nota | `git diff docs/adr/ADR-0016-layout-fijo-de-tres-raices.md` | AC-3, CNF-1 |
| 5 | La regla nueva figura en los documentos | `grep -n "CANCELED" AGENTS.md docs/constitution.md docs/domains/domain-*.md docs/guides/root-folder-practices.md` | AC-3, CNF-2 |
| 6 | Ningún documento activo dice que las `CANCELED` no se archivan | `grep -rn "CANCELED.*no se archivan" AGENTS.md docs/` sin resultados | AC-3 |
| 7 | El gate acepta una `CANCELED` archivada | caso nuevo de `test/memory-system.test.js` (D-7) | CNF-3 |
| 8 | Gate completo | `npm run verify:repository` y `npm test` en verde | CNF-3 |

## Risks / Trade-offs

- [STORY-160 cambia su estructura durante la implementación] → C-1 se ancla a los gates de su contrato (admisión, fecha, confirmación, destino, movimiento), no a números de paso (CR-001).
- [Las 11 historias `CANCELED` actuales siguen en `specs/flow/`] → archivarlas es una decisión del usuario con el skill ya entregado; fuera de alcance.
- [Las referencias «(ADR-0016)» de los skills apuntan a un ADR reemplazado] → la nota de ADR-0016 remite a ADR-0017 y el layout no cambia (D-2).
- [Trade-off: `ACCEPTED` en un ADR escrito durante la implementación] → la decisión ya la tomó la épica (CS-5) y la historia (AC-3); la revisión humana de `story-code-review`/`story-acceptance` la valida.

## Open Questions

Ninguna bloqueante. Las ambigüedades se resolvieron en D-1…D-7 o se registran como CR.

## Autoevaluación (P9, P10)

- **Cobertura:** AC-1 → D-1, D-3, D-4, D-5, F-1; AC-2 → D-1, D-3, F-2; AC-3 → D-2, D-6; CNF-1 → D-2; CNF-2 → D-6; CNF-3 → D-7; CNF-4 → D-4, contrato 3.
- **Omisiones:** substatus distinto de `DONE` (D-1), `updated:` inválido (D-3), destino existente y rechazo de la confirmación (D-4, STORY-160), documentos fuera de AC-3 (CR-002).
- **Ambigüedad:** alcance del reemplazo del ADR → D-2; cadena de fecha con valores inválidos → D-3.
- **Nombres:** «archivar» (mover sin cambiar status), «completar» (escribir `COMPLETED`, STORY-160), «fecha de archivo», «ADR vigente»; un término por concepto.
- **Estructura:** sin ciclos (skill → `story.md`/archivo; documentos → ADR-0017); cada componente una responsabilidad; la tabla de admisión y la cadena de fecha viven en un solo lugar.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: el skill `story-complete` lo crea STORY-160, que aún no tiene `design.md`. Esta historia cambia dos comportamientos de su contrato: elimina la fila `CANCELED/DONE` de su AC-2 y amplía la cadena de fecha de su AC-3 fila 3 con `date:`.
- **Documento afectado**: design.md (esta historia); `specs/flow/STORY-160-completar-y-archivar-historia-entregada/design.md` (pendiente)
- **Acción requerida**: implementar STORY-164 después de STORY-160. Al diseñar STORY-160, conviene que la admisión por estado y la cadena de fecha queden en un solo paso cada una, para que esta historia las amplíe sin duplicarlas.

### CR-002
- **Tipo**: dependencia
- **Descripción**: AC-3 nombra `AGENTS.md`, `docs/constitution.md` y `docs/domains/`, pero la regla vieja también figura en `docs/guides/root-folder-practices.md` (que afirma «Las historias `CANCELED` … no se archivan»), `docs/architecture/sddf-architecture.md` y `docs/guides/sddf-commands-pipeline.md`.
- **Documento afectado**: design.md
- **Acción requerida**: incluidos como C-12, C-13 y C-14 (regla de Veracidad). Sin cambio en story.md.

### CR-003
- **Tipo**: ambigüedad
- **Descripción**: la nota «Regla de archivo» de `specs/flow/EPIC-27-completar-flujo-de-story/epic.md` dice que STORY-160 incluye el ADR nuevo; tras el split lo incluye STORY-164.
- **Documento afectado**: epic.md
- **Acción requerida**: corregir la nota de la épica fuera de esta historia (p. ej. con `/epic-analyze` o edición manual al cerrar la épica). No bloquea el diseño.

### CR-004
- **Tipo**: decisión de implementación no prevista
- **Descripción**: STORY-160 se implementó con un motor determinista (`skills/story-complete/scripts/story-complete.js`, `plan|apply`) que decide la admisión por estado y la fecha de archivo; el `SKILL.md` solo orquesta. D-1 y D-3 («el skill aplica la regla leyendo el frontmatter; no invoca el script») se aplicaron por eso en el motor: `planCompletion` añade la acción `archive-canceled` (`CANCELED/DONE`, sin escritura) y el código `CANCELED_NOT_DONE` (`CANCELED` con otro substatus), sustituye `CANCELED_NOT_ADMITTED`, y `archiveDateOf` adopta la cadena `updated:` → `created:` → `date:` (`date:` solo sin ninguna de las dos claves). El mensaje final de `apply` para `archive-canceled` es el de D-4. Las pruebas del motor viven en `test/story-complete.test.js` (casos STORY-164 y ajuste de los casos de `CANCELED` y `date:` de STORY-160). El caso «`COMPLETED/DONE` sin fecha» de T003 no existía en `evals.json`; su ajuste se hizo en la prueba del motor. La tabla de D-1 sigue viviendo en un solo lugar (`planCompletion`), que el `SKILL.md` documenta en `## Precondiciones`.
- **Documento afectado**: `skills/story-complete/scripts/story-complete.js`, `test/story-complete.test.js`
- **Acción requerida**: ninguna; registrado para `story-code-review`.

### CR-005
- **Tipo**: dependencia (Veracidad)
- **Descripción**: el contrato de verificación 6 encontró la regla vieja en `docs/guides/organization-of-artifacts.md` («Las historias `CANCELED` y las épicas no se archivan»), no listado en C-7…C-14. Se actualizó con la frase canónica de D-6. También se actualizó la entrada «Layout» de `AGENTS.md › Dónde está el detalle` para apuntar a ADR-0017, y la introducción de `docs/guides/root-folder-practices.md` enlaza el ADR vigente.
- **Documento afectado**: `docs/guides/organization-of-artifacts.md`, `AGENTS.md`, `docs/guides/root-folder-practices.md`
- **Acción requerida**: ninguna.
