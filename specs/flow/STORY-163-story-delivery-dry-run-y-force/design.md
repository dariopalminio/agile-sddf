---
alwaysApply: false
type: design
id: STORY-163
slug: STORY-163-story-delivery-dry-run-y-force-design
title: "Design: story-delivery: --dry-run y --force"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-27-completar-flujo-de-story
story: STORY-163
created: 2026-10-25
updated: 2026-10-25
related:
  - STORY-163-story-delivery-dry-run-y-force
  - EPIC-27-completar-flujo-de-story
  - STORY-159-story-delivery-interactivo
  - STORY-160-completar-y-archivar-historia-entregada
  - STORY-162-story-delivery-modelo-continuous
---

<!-- Referencias -->
[[STORY-163-story-delivery-dry-run-y-force]] · [[EPIC-27-completar-flujo-de-story]] · [[STORY-159-story-delivery-interactivo]] · [[STORY-160-completar-y-archivar-historia-entregada]] · [[STORY-162-story-delivery-modelo-continuous]]

# Diseño técnico: story-delivery: --dry-run y --force

## Context

STORY-159 crea el skill `story-delivery` con flujo interactivo en `batch` (diseño en `specs/flow/STORY-159-story-delivery-interactivo/design.md`, en adelante «diseño base»). Esta historia lo extiende con dos flags: `--dry-run` (previsualizar sin escribir) y `--force` (entregar aunque el estado previo o el DoD bloqueen, con el override registrado en `delivery-report.md`). La épica fija el contrato en CS-2 y SMOKE-2 (`specs/flow/EPIC-27-completar-flujo-de-story/epic.md`).

Estado verificado en el filesystem (2026-10-25):

- `skills/story-delivery/` **todavía no existe**: STORY-159 está en `READY-FOR-IMPLEMENT/DONE`. Esta historia se implementa después de STORY-159 y modifica los artefactos que esa historia crea. Las referencias a pasos (Paso 1…Paso 6), decisiones (D-1…D-10 del diseño base) y mensajes son las del diseño base.
- Puntos de inserción ya previstos por el diseño base (F-4): «`--dry-run` corta tras el Paso 4; `--force` salta los Pasos 1 y 5 de bloqueo».
- Gates del diseño base que pueden bloquear: precondición `ACCEPTANCE/DONE` (Paso 1, D-1), `delivery-model` distinto de `batch` (Paso 2, D-2), DoD ausente (Paso 3, D-8), DoD incumplido con `enforcement: error` (Paso 5, D-4) y rechazo de la confirmación final (Paso 5, D-4).
- El diseño base decidió no crear `delivery-report.md` (D-6). La nota de la historia revierte esa decisión **solo para `--force`** (decisión confirmada 2026-10-25); la entrega normal sigue sin reporte.
- `scripts/verify-validation-contract.js` y `docs/policies/validation-contract-policy.md` §4 solo regulan reportes con `verdict` de los gates (`REPORT_TEMPLATES`). `delivery-report.md` no emite veredicto: no entra en ese contrato. Las reglas léxicas L-1…L-4 del script se aplican a `skills/` y `docs/`, así que el template nuevo no puede usar `APROBADA`, `Aprobada`, `review-status` ni `approved` tras `:`, `|`, backtick, etc.
- `package.json` no declara `prepack`, `prepare` ni `postpack`: `npm pack --dry-run` (el único criterio `comando` del DoD actual) no escribe en el repositorio.
- `docs/domains/domain-story-lifecycle.md` §4.2 solo dibuja `ACCEPTANCE --> DELIVER : APPROVED` y §4.3 lista las rutas alternativas (`* → CANCELED`, etc.). Una entrega forzada desde otro estado es una ruta nueva que debe documentarse por la regla de Veracidad de `AGENTS.md` (CR-002).
- STORY-162 (modelo `continuous`) está en `PLAN/IN-PROGRESS` sin `design.md`; extiende el Paso 2 del mismo skill.

Stack: skills en Markdown + scripts Node.js; el código de producción se genera con `skill-master` y las pruebas de skill son evals (`sddf.config.yaml › implement`).

## Goals / Non-Goals

**Goals:**

- `--dry-run`: evalúa el DoD, informa todos los bloqueos y la acción que ejecutaría, sin crear, modificar ni borrar ningún archivo (tampoco en `.tmp/`). // satisface: AC-1, CNF-1
- `--force`: omite el gate de estado previo y el de DoD incumplido, mantiene la confirmación humana final y, si omitió algún gate, registra el override en `delivery-report.md`. // satisface: AC-2, CNF-2
- Los bloqueos por estado previo o DoD sin `--force` sugieren `--force`; el rechazo de la confirmación no lo sugiere. // satisface: AC-3
- Gate en verde. // satisface: CNF-3

**Non-Goals:**

- Escribir con `--dry-run`, aunque se combine con `--force` (la combinación solo previsualiza; D-1).
- `continuous`, `delivery-model` ausente o inválido (STORY-162).
- Auditar, listar o revertir overrides previos.
- `delivery-report.md` en entregas sin `--force` o con `--force` que no omitió ningún gate (D-6).
- Que `--force` omita errores de configuración (`delivery-model`, DoD ausente) o la confirmación final (D-3).

## Componentes afectados

| # | Componente | Acción | Ubicación | AC / CNF |
|---|---|---|---|---|
| C-1 | Skill `story-delivery` | modificar | `skills/story-delivery/SKILL.md`: frontmatter (`outputs`, `triggers`), `## Parámetros`, `## Modos de ejecución`, `## Restricciones / Reglas`, Pasos 1, 4, 5 y 6, paso nuevo de registro del override, `## Salida` | AC-1, AC-2, AC-3, CNF-1, CNF-2 |
| C-2 | Template del reporte de override | crear | `skills/story-delivery/assets/delivery-report-template.md` | AC-2 |
| C-3 | Evals del skill | modificar | `skills/story-delivery/evals/evals.json` (casos nuevos y `not_contains` del caso de rechazo) | AC-1, AC-2, AC-3, CNF-1, CNF-2 |
| C-4 | README del skill | modificar | `skills/story-delivery/README.md` (uso de `--dry-run` y `--force`, `delivery-report.md`) | AC-1, AC-2 (Veracidad) |
| C-5 | Ciclo de vida de story | modificar | `docs/domains/domain-story-lifecycle.md` §4.3 (fila «Entrega forzada») | AC-2 (coherencia de dominio, CR-002) |
| C-6 | Guía del pipeline | modificar | `docs/guides/sddf-commands-pipeline.md` (fila `deliver` que deja STORY-159: añadir `[--dry-run] [--force]` y `delivery-report.md` solo con override) | AC-1, AC-2 (Veracidad) |

Sin cambios: `skills/memory-system/scripts/dod-story.js` (la etapa `deliver` ya lista `story-delivery` tras STORY-159), `test/dod-story.test.js`, `scripts/verify-validation-contract.js` y `docs/policies/validation-contract-policy.md` (el reporte no tiene `verdict`, D-5), `docs/guardrails/dod-story-deliver.md`, `sddf.config.yaml`, `package.json` (`files` ya incluye `skills/`, también `assets/`), `docs/domains/domain-state-management.md` y `docs/domains/domain.md` (el texto de STORY-159 —«`DELIVER` lo escribe `story-delivery` solo con confirmación humana»— sigue siendo cierto con `--force`, CNF-2).

## Decisions

### D-1 — Modo de ejecución: `--dry-run` manda sobre `--force` // satisface: AC-1, CNF-1

El skill resuelve un único modo antes del Paso 1, a partir de los flags:

| Flags | Modo | Escribe |
|---|---|---|
| ninguno | `interactivo` (diseño base) | `story.md` solo con confirmación |
| `--force` | `forzado` | `story.md` y, si omitió gates, `delivery-report.md`, solo con confirmación |
| `--dry-run` | `previsualización` | nada |
| `--dry-run --force` | `previsualización forzada` | nada; describe lo que escribiría `--force` |

Un flag desconocido detiene el skill sin cambios: `❌ Flag no reconocido: <flag>. Flags válidos: --dry-run, --force`.

| Alternativa | Motivo del rechazo |
|---|---|
| Rechazar la combinación `--dry-run --force` como mutuamente excluyente | Los Non-Goals de la historia la admiten «para previsualizar»; previsualizar un override es justo lo que el usuario necesita antes de forzarlo. |
| Que `--force` gane y escriba | Contradice «con `--dry-run` nunca se escribe» (Non-Goals) y CNF-1. |

### D-2 — Previsualización: evalúa todo, acumula bloqueos y no corta en el estado // satisface: AC-1, CNF-1

En `previsualización`, el gate de estado del Paso 1 **no detiene**: registra el bloqueo `estado` (con el estado actual) y continúa, para que el usuario vea la evaluación del DoD también en la fila 2 de AC-1 (`VERIFY/DONE` + DoD incumplido). Los Pasos 2 y 3 siguen fallando cerrado como en el diseño base (D-2, D-8): son errores de configuración, sin DoD no hay evaluación que mostrar. El Paso 4 se ejecuta con la regla de comandos de D-4. El Paso 5 no hace la pregunta final: calcula la acción y la muestra. El Paso 6 y el registro del override no se ejecutan.

Salida de la previsualización (además de la tabla del Paso 4):

| Situación | Acción mostrada |
|---|---|
| Sin bloqueos | `🔍 Dry-run: escribiría status: DELIVER, substatus: DONE y updated: <hoy> en story.md (tras tu confirmación).` |
| Con bloqueos, sin `--force` | `🔍 Dry-run: la entrega quedaría bloqueada por:` + lista (`estado actual <status>/<substatus>` y/o criterios ❌) + `→ --force permitiría seguir y registraría el override en delivery-report.md.` |
| Con bloqueos y `--force` | `🔍 Dry-run (--force): escribiría DELIVER/DONE en story.md tras tu confirmación y registraría en delivery-report.md los gates omitidos:` + lista. |
| Criterios `comando` no ejecutados (D-4) | se añade `ℹ️ <N> criterio(s) no evaluados en dry-run; la acción supone que se cumplen.` |

Siempre cierra con `🔍 Dry-run: no se creó, modificó ni borró ningún archivo.`

Las preguntas por criterio de tipo `confirmación` (D-3 del diseño base) se hacen también en `previsualización`: responder no escribe nada y sin ellas la evaluación del DoD estaría incompleta.

| Alternativa | Motivo del rechazo |
|---|---|
| Cortar en el estado inválido como el modo interactivo | La fila 2 de AC-1 exige mostrar la evaluación del DoD con estado `VERIFY/DONE`. |
| Omitir las preguntas de `confirmación` y marcar esos criterios como desconocidos | En el DoD actual son 2 de 7 criterios (CI, secrets); el usuario no podría saber si la entrega quedaría bloqueada. |

### D-3 — Alcance de `--force`: solo los gates de estado y de DoD incumplido // satisface: AC-2, AC-3, CNF-2

| Gate del diseño base | Sin `--force` | Con `--force` |
|---|---|---|
| Estado ≠ `ACCEPTANCE/DONE` (Paso 1, D-1) | bloquea y sugiere `--force` (D-7) | omitido: `⚠️ --force: se omite la precondición ACCEPTANCE/DONE (estado actual: <status>/<substatus>)` |
| Historia bajo `specs/flow/archive/` (Paso 1) | rechazo | rechazo igual (es resolución, no estado; una historia archivada ya está `COMPLETED`) |
| `delivery-model` ≠ `batch` (Paso 2, D-2; STORY-162) | falla cerrado | falla cerrado igual |
| DoD ausente o sin criterios (Paso 3, D-8) | falla cerrado | falla cerrado igual |
| DoD con ❌ y `enforcement: error` (Paso 5, D-4) | bloquea y sugiere `--force` (D-7) | omitido: `⚠️ --force: se omiten <N> criterio(s) incumplidos del DoD` + lista |
| Confirmación final (Paso 5, D-4) | obligatoria | obligatoria (CNF-2) |

Con `--force` el DoD **se evalúa entero** (incluidas las preguntas de `confirmación`): el reporte necesita la lista de criterios incumplidos (AC-2). La confirmación final nombra el override cuando hay gates omitidos: `¿Confirmas la entrega FORZADA de STORY-NNN a DELIVER/DONE omitiendo <gates>? (s/n)`. Sin gates omitidos se usa la pregunta del diseño base. Solo `s`/`si`/`sí` confirma; cualquier otra respuesta → `Entrega cancelada por el usuario. story.md no cambió.` y no se crea `delivery-report.md`.

Aplica a cualquier `status` no archivado, también `CANCELED` o `BLOCKED`: la épica dice «sin importar el estado previo». El estado previo queda en el reporte.

| Alternativa | Motivo del rechazo |
|---|---|
| `--force` omite también `delivery-model` inválido y DoD ausente | Son errores de configuración que se corrigen en un archivo; forzarlos produciría un reporte sin criterios que listar. La historia limita `--force` a «el estado previo o el DoD la bloquean». |
| `--force` omite la confirmación final (entrega no interactiva) | Viola CNF-2 y el dominio de STORY-159 («siempre con confirmación humana»). |
| No evaluar el DoD con `--force` | El reporte no podría listar «los criterios incumplidos» (AC-2). |

### D-4 — Comandos de evidencia en `previsualización`: solo los que no escriben // satisface: CNF-1, AC-1

En `previsualización` (con o sin `--force`), un criterio de método `comando` se ejecuta solo si el comando citado lleva `--dry-run`; si no, no se ejecuta y su estado es `⏸ no evaluado (dry-run)` con evidencia `se ejecutaría: <comando>`. Los métodos `artefacto` (solo lectura), `confirmación` (pregunta) y `no-aplica-batch` no cambian. Un criterio `⏸` no cuenta como ❌ en la acción calculada, pero se avisa (tabla de D-2).

Con el DoD actual el único `comando` es `npm pack --dry-run`, que se ejecuta: la previsualización da el mismo resultado que la entrega real. `package.json` no tiene scripts de ciclo de vida de pack que escriban en el repo.

| Alternativa | Motivo del rechazo |
|---|---|
| Ejecutar todos los comandos como en la entrega real | Un DoD de un proyecto consumidor puede citar un comando que escriba (build, `npm version`): violaría CNF-1. |
| No ejecutar ningún comando en dry-run | Con el DoD actual la previsualización perdería un criterio verificable sin motivo; `--dry-run` en el propio comando declara que no escribe. |
| Detectar escrituras con `git status --porcelain` antes y después | Detecta pero no evita el cambio; además exige git en proyectos consumidores. |

### D-5 — `delivery-report.md`: template propio, sin `verdict`, append-only // satisface: AC-2

Ubicación: `<directorio_historia>/delivery-report.md`, solo en modo `forzado`, solo si se omitió al menos un gate (D-6) y solo tras la confirmación. Se archiva con la historia (STORY-160 mueve la carpeta completa).

Estructura (C-2, `skills/story-delivery/assets/delivery-report-template.md`, leída en runtime):

- Frontmatter: `type: delivery-report`, `id: <STORY-NNN>`, `slug: <slug-historia>-delivery-report`, `title: "Delivery report: <título>"`, `story: <STORY-NNN>`, `created: <hoy>`, `updated: <hoy>`, `related: [<slug-historia>]`. **Sin** `verdict`: no es un gate con veredicto (fuera de `validation-contract-policy.md` §4).
- Enlace `[[<slug-historia>]]`.
- Una sección por override: `## Override <n> — <YYYY-MM-DD>` con:
  - `Fecha del override: <YYYY-MM-DD>` // AC-2
  - `Estado previo: <status>/<substatus>` (leído en el Paso 1, antes de escribir) // AC-2
  - `Estado escrito: DELIVER/DONE`
  - `Gates omitidos:` lista con `precondición ACCEPTANCE/DONE` y/o `DoD de entrega (<slug>, enforcement: <valor>)`
  - `Criterios incumplidos:` tabla `| # | Criterio | Evidencia |` con los ❌ del Paso 4; `Ninguno` si solo se omitió el estado // AC-2
  - `Criterios no aplicables:` los `no aplica en batch`
  - `Confirmado por: confirmación humana en la sesión`

Si `delivery-report.md` ya existe (historia forzada antes), se **añade** una sección `## Override <n+1>` y se actualiza `updated:`; nunca se reescriben secciones previas.

| Alternativa | Motivo del rechazo |
|---|---|
| Sección en `story.md` | Descartada por la historia: el cuerpo pertenece a story-creation/refine/split; los skills de transición solo escriben frontmatter. |
| Sobrescribir el reporte previo | Perdería la traza del override anterior; los Non-Goals excluyen auditar overrides, no borrarlos. |
| Fallar si el reporte ya existe | Bloquearía un segundo `--force` legítimo sin dar alternativa. |
| Formato libre sin template | Los reportes de los demás skills (`acceptance-report.md`, `verify-report.md`) se generan desde `assets/`; el template mantiene la estructura estable para STORY-160 y para lectura humana. |

### D-6 — Reporte solo si `--force` omitió algún gate // satisface: AC-2

Con `--force` sobre una historia en `ACCEPTANCE/DONE` con DoD cumplido no hay override: el skill emite `ℹ️ --force no fue necesario: no se omitió ningún gate.`, sigue el flujo interactivo del diseño base y no crea `delivery-report.md`.

| Alternativa | Motivo del rechazo |
|---|---|
| Crear el reporte siempre que se pase `--force` | Registraría «qué se omitió» cuando no se omitió nada; contradice el Non-Goal «sin `delivery-report.md` en entregas normales». |

### D-7 — Sugerencia de `--force` solo en bloqueos superables // satisface: AC-3

Los mensajes de bloqueo del diseño base en modo `interactivo` se extienden así:

| Bloqueo | Mensaje | Sugiere `--force` |
|---|---|---|
| Estado inválido (Paso 1) | `❌ La historia STORY-NNN no está en ACCEPTANCE/DONE. Estado actual: <status>/<substatus>` + `→ Para entregar igualmente: /story-delivery STORY-NNN --force (el override queda en delivery-report.md). Para previsualizar: --dry-run.` | sí |
| DoD incumplido (Paso 5) | `❌ Entrega bloqueada: criterios incumplidos del DoD` + lista + la misma línea `→ …--force…` | sí |
| Rechazo de la confirmación (Paso 5) | `Entrega cancelada por el usuario. story.md no cambió.` | no |
| `delivery-model` inválido, DoD ausente, flag no reconocido | mensajes del diseño base / D-1 | no (`--force` no los omite, D-3) |

La línea de sugerencia es un texto único definido una vez en `## Restricciones / Reglas` del SKILL.md y referenciado por los dos pasos, para que no diverja.

| Alternativa | Motivo del rechazo |
|---|---|
| Sugerir `--force` en todo bloqueo | Sugeriría una salida que no funciona (D-3) y AC-3 lo prohíbe en el rechazo. |
| No sugerir `--dry-run` | AC-3 solo exige `--force`; añadir `--dry-run` en la misma línea cuesta nada y orienta a previsualizar antes de forzar. |

### D-8 — Orden de escritura en modo forzado: reporte primero // satisface: AC-2, CNF-2

Tras la confirmación, en modo `forzado` con gates omitidos:

1. Escribir (o ampliar) `delivery-report.md`. Si falla → `❌ No se pudo escribir delivery-report.md. story.md no cambió.` y fin.
2. Escribir `story.md` como en D-5 del diseño base. Si falla → borrar el `delivery-report.md` recién creado (o restaurar su contenido previo si se amplió) y emitir `❌ No se pudo escribir story.md. Se deshizo delivery-report.md; el estado no cambió.`
3. Mensaje final: `✅ STORY-NNN entregada (forzada): DELIVER/DONE — override registrado en <ruta>/delivery-report.md` y la sugerencia `/story-complete STORY-NNN` del diseño base.

| Alternativa | Motivo del rechazo |
|---|---|
| `story.md` primero | Si el reporte falla, quedaría una entrega forzada sin traza: el objetivo de la historia («dejar trazado qué se omitió»). |
| Sin compensación ante fallo de `story.md` | Dejaría un override registrado que no ocurrió. |

### D-9 — Estructura de los cambios en el SKILL.md // satisface: AC-1, AC-2, AC-3

Sobre la estructura del diseño base (D-10 de STORY-159):

- Frontmatter: `outputs` pasa a `[story.md (frontmatter actualizado), delivery-report.md (solo con --force y gates omitidos)]`; `triggers` añade «dry-run de entrega» y «forzar entrega».
- `## Parámetros`: `--dry-run` y `--force` con el texto de D-1/D-3.
- `## Modos de ejecución`: la tabla de cuatro modos de D-1.
- `## Restricciones / Reglas`: «`--dry-run` nunca crea, modifica ni borra archivos, tampoco en `.tmp/`» (CNF-1); «`--force` no omite la confirmación final» (CNF-2); línea de sugerencia de D-7.
- `## Flujo de ejecución`: paso nuevo «Paso 0b — Resolver modo» (D-1) tras el Paso 0; Paso 1 con la tabla de D-3 por modo; Paso 4 con la regla de D-4; Paso 5 con las ramas de D-2/D-3/D-6/D-7; Paso 6 con D-8; paso nuevo «Paso 7 — Mostrar la previsualización» que solo se ejecuta en `previsualización` y sustituye a la escritura.
- `## Salida`: los dos archivos posibles y la garantía de dry-run.

El bloque `<!-- SDDF-FIXED-LAYOUT: v1 -->` del Paso 0 no cambia.

| Alternativa | Motivo del rechazo |
|---|---|
| Skill separado `story-delivery-force` | Duplicaría la evaluación del DoD y los gates; la épica define un solo skill con flags. |
| Ramas por flag dentro de cada paso sin un modo resuelto | Las combinaciones (`--dry-run --force`) quedarían repartidas e inconsistentes entre pasos. |

## Interfaces

| Interfaz | Contrato | AC / CNF |
|---|---|---|
| Invocación | `/story-delivery {story_id \| story_path} [--dry-run] [--force]` (orden libre). Flag desconocido → error sin cambios (D-1). | AC-1, AC-2 |
| Modo resuelto | `interactivo` · `forzado` · `previsualización` · `previsualización forzada` (D-1) | AC-1, AC-2 |
| Lista de bloqueos | en memoria: `estado` (con `<status>/<substatus>`) y/o `dod` (con los criterios ❌); alimenta la acción de D-2, los avisos de D-3 y el reporte de D-5 | AC-1, AC-2, AC-3 |
| Confirmación final forzada | `¿Confirmas la entrega FORZADA de STORY-NNN a DELIVER/DONE omitiendo <gates>? (s/n)` (D-3) | AC-2, CNF-2 |
| Salida de previsualización | líneas `🔍 Dry-run: …` de D-2, cierre fijo `🔍 Dry-run: no se creó, modificó ni borró ningún archivo.` | AC-1, CNF-1 |
| Sugerencia de override | línea `→ Para entregar igualmente: /story-delivery STORY-NNN --force …` (D-7) | AC-3 |
| Escritura forzada | `delivery-report.md` (D-5) y luego `story.md` (D-5 del diseño base), en el orden de D-8 | AC-2 |
| Template | `skills/story-delivery/assets/delivery-report-template.md` (C-2) | AC-2 |

## Esquema de datos // satisface: AC-1, AC-2

Se reutiliza el resultado por criterio del diseño base y se amplía el enum de `estado`:

| Campo | Cambio | Valores |
|---|---|---|
| `estado` | nuevo valor | `✅` · `❌` · `no aplica en batch` · `⏸ no evaluado (dry-run)` (D-4) |
| `evidencia` | nuevo valor | `se ejecutaría: <comando>` para `⏸` |

Bloqueo (en memoria, no persistido salvo en el reporte):

| Campo | Tipo | Valores |
|---|---|---|
| `gate` | enum | `estado` · `dod` |
| `detalle` | texto | `<status>/<substatus>` para `estado`; lista de criterios ❌ para `dod` |

Override (persistido en `delivery-report.md`, D-5): `n`, `fecha`, `estado_previo`, `gates_omitidos[]`, `criterios_incumplidos[]` (`#`, `criterio`, `evidencia`), `criterios_no_aplicables[]`.

Casos nuevos de `evals.json` (C-3), mismo formato que los de STORY-159; los IDs son los `TC-NNN` consecutivos siguientes al último existente al implementar (TC-007… si STORY-162 no añadió casos antes):

| Caso | Entrada | `expected.contains` | `expected.not_contains` | Origen |
|---|---|---|---|---|
| dry-run sin bloqueos | `ACCEPTANCE/DONE`, DoD cumplido, `--dry-run` | `escribiría status: DELIVER`, `no se creó, modificó ni borró ningún archivo` | `¿Confirmas la entrega`, `entregada` | AC-1 fila 1, CNF-1 |
| dry-run con bloqueos | `VERIFY/DONE`, DoD incumplido, `--dry-run` | tabla del DoD, `Estado actual VERIFY/DONE`, criterio ❌, `--force permitiría seguir` | `entregada`, `delivery-report.md creado` | AC-1 fila 2, CNF-1 |
| dry-run + force | `VERIFY/DONE`, DoD incumplido, `--dry-run --force` | `Dry-run (--force): escribiría DELIVER/DONE`, `gates omitidos` | `entregada (forzada)` | D-1, CNF-1 |
| force confirmado | `VERIFY/DONE`, DoD incumplido, `--force`, responde `s` | `entregada (forzada): DELIVER/DONE`, `delivery-report.md`, `Estado previo: VERIFY/DONE`, criterio incumplido, fecha de hoy | — | AC-2 |
| force rechazado | `VERIFY/DONE`, DoD incumplido, `--force`, responde `n` | `¿Confirmas la entrega FORZADA`, `Entrega cancelada por el usuario` | `--force permitiría`, `Para entregar igualmente`, `delivery-report.md` | CNF-2, AC-3 (Pero) |
| sugerencia por estado | `VERIFY/DONE`, sin flags | `no está en ACCEPTANCE/DONE`, `--force` | `¿Confirmas la entrega` | AC-3 |
| sugerencia por DoD | `ACCEPTANCE/DONE`, DoD incumplido, sin flags | `Entrega bloqueada`, `--force` | `¿Confirmas la entrega` | AC-3 |

Caso existente modificado: el de rechazo del usuario de STORY-159 (TC-004) añade `--force` a `expected.not_contains` (AC-3, «Pero»).

## Flujos clave

### F-1 — Previsualización con bloqueos // AC-1 fila 2, CNF-1

1. Paso 0 y Paso 0b: `REPO_ROOT`; modo `previsualización`.
2. Paso 1: estado `VERIFY/DONE` → registra bloqueo `estado`, sigue (D-2).
3. Pasos 2–3: `batch` ✓; DoD resuelto.
4. Paso 4: evalúa los 7 criterios; `npm pack --dry-run` se ejecuta (D-4); preguntas de `confirmación`. Tabla.
5. Paso 5: hay ❌ → registra bloqueo `dod`; no pregunta.
6. Paso 7: muestra bloqueos, `--force permitiría seguir…` y el cierre fijo. Fin sin escribir.

### F-2 — Entrega forzada // AC-2, CNF-2

1. Paso 0b: modo `forzado`.
2. Paso 1: `VERIFY/DONE` → aviso `⚠️ --force: se omite la precondición…`; guarda `estado_previo`.
3. Pasos 2–4 como en el diseño base.
4. Paso 5: ❌ con `enforcement: error` → aviso `⚠️ --force: se omiten <N> criterio(s)…`; pregunta final forzada → `s`.
5. Paso 6 (D-8): `delivery-report.md` → `story.md` → mensaje final.

### F-3 — Bloqueo sin `--force` // AC-3

Igual que F-2 del diseño base, con la línea de sugerencia de D-7 en los bloqueos de estado y DoD. El rechazo de la confirmación termina sin sugerencia.

### F-4 — Degradación // P7

| Dependencia | Fallo | Comportamiento |
|---|---|---|
| Template `delivery-report-template.md` | ausente o ilegible | modo `forzado` con gates omitidos se detiene **antes** de la confirmación: `❌ No se encontró assets/delivery-report-template.md: no se puede registrar el override. story.md no cambió.` La previsualización solo lo avisa. |
| Escritura de `delivery-report.md` | error de E/S | D-8 paso 1: fin sin tocar `story.md` |
| Escritura de `story.md` | error de E/S | D-8 paso 2: compensación del reporte |
| Comando de evidencia en dry-run | sin `--dry-run` en el comando | `⏸ no evaluado (dry-run)`, nunca se ejecuta |
| `delivery-report.md` previo ilegible o sin frontmatter | no se puede ampliar | `❌ delivery-report.md existe pero no se puede ampliar: <motivo>. story.md no cambió.`; no se sobrescribe |

### F-5 — Puntos de cambio // P6

- Modelo de entrega: STORY-162 cambia el Paso 2 y el método `no-aplica-batch`; el modo resuelto en el Paso 0b no depende del modelo. Coordinación: la afirmación «el incremento ya está desplegado» de `continuous` es una confirmación humana y `--force` no la omite (misma regla que CNF-2); STORY-162 la ubica antes de la confirmación final.
- Gates omitibles: la tabla de D-3 es el único lugar que decide qué omite `--force`.
- Formato del reporte: vive en el template (C-2), no en el SKILL.md.

## Decisiones de complejidad justificada

- **Modo resuelto en un paso (D-1, Paso 0b):** dos flags booleanos generan cuatro combinaciones; resolverlas una vez evita condiciones cruzadas en cada paso. No se introduce ninguna abstracción adicional.
- **Regla de comandos en dry-run (D-4):** ejecutar siempre o nunca serían más simples, pero lo primero viola CNF-1 con DoD ajenos y lo segundo degrada la previsualización del DoD actual sin necesidad. La regla es una sola condición textual.
- **Append-only y compensación (D-5, D-8):** son el mínimo para que el reporte nunca mienta (override registrado que no ocurrió) ni se pierda (override sobrescrito).
- **Template en `assets/` (C-2):** un archivo pequeño; sigue el patrón de los reportes de los demás skills y saca el formato del SKILL.md.

## Contratos de verificación

| # | Criterio | Método de verificación | Origen |
|---|---|---|---|
| 1 | Dry-run sin bloqueos muestra «escribiría DELIVER/DONE» y no escribe | eval «dry-run sin bloqueos» (`npm run test:eval -- story-delivery`, ejecución manual) + `git status --porcelain` idéntico antes y después en una prueba manual | AC-1, CNF-1 |
| 2 | Dry-run con `VERIFY/DONE` y DoD incumplido muestra el DoD, los bloqueos y que `--force` permitiría seguir | eval «dry-run con bloqueos» | AC-1 |
| 3 | `--dry-run --force` describe la escritura forzada sin escribir | eval «dry-run + force» | D-1, CNF-1 |
| 4 | `--force` confirmado deja `DELIVER/DONE` + `updated` de hoy y crea `delivery-report.md` con estado previo, criterios incumplidos y fecha | eval «force confirmado» | AC-2 |
| 5 | `--force` rechazado no escribe ni sugiere `--force` | eval «force rechazado» | CNF-2, AC-3 |
| 6 | Bloqueos por estado y por DoD sugieren `--force`; el rechazo normal no | evals «sugerencia por estado», «sugerencia por DoD» y TC-004 modificado | AC-3 |
| 7 | El template no usa variantes léxicas prohibidas ni `verdict` | `node scripts/verify-validation-contract.js` (dentro de `verify:repository`) | D-5 |
| 8 | `domain-story-lifecycle.md` §4.3 documenta la entrega forzada | revisión por búsqueda (`grep -n "forzada" docs/domains/domain-story-lifecycle.md`) | C-5 |
| 9 | Gate completo | `npm run verify:repository` y `npm test` en verde | CNF-3 |

## Risks / Trade-offs

- [STORY-159 cambia durante su implementación y los pasos no coinciden con el diseño base] → los cambios de C-1 se anclan a los gates (estado, modelo, DoD, confirmación), no a números de paso; la implementación ajusta la numeración.
- [IDs de evals en conflicto con STORY-162] → regla de IDs consecutivos al implementar (esquema de datos).
- [Un DoD consumidor cita comandos de solo lectura sin `--dry-run` (p. ej. `npm test`)] → quedan `⏸` en dry-run; es conservador por diseño (CNF-1) y se informa cuántos.
- [Uso rutinario de `--force` vacía el DoD] → cada uso queda en `delivery-report.md` con los criterios omitidos y la confirmación humana es obligatoria; auditar el abuso queda fuera de alcance.
- [Trade-off: dry-run hace preguntas] → la previsualización no es totalmente desatendida; se acepta para dar una acción fiable (D-2).

## Open Questions

Ninguna bloqueante. Las ambigüedades se resolvieron en D-2, D-3, D-4, D-6 o se registran como CR.

## Autoevaluación (P9, P10)

- **Cobertura:** AC-1 → D-1, D-2, D-4, F-1; AC-2 → D-3, D-5, D-6, D-8, F-2; AC-3 → D-7, F-3; CNF-1 → D-1, D-2, D-4; CNF-2 → D-3, D-8; CNF-3 → contrato 9.
- **Omisiones:** combinación de flags (D-1), flags desconocidos (D-1), `--force` sin override necesario (D-6), reporte previo (D-5), fallos de escritura (D-8, F-4).
- **Ambigüedad:** qué gates omite `--force` → D-3; qué significa «sin efectos» con comandos → D-4.
- **Nombres:** «previsualización» (modo de `--dry-run`), «entrega forzada» / «override» (efecto de `--force`), «gate omitido», «bloqueo», `delivery-report.md`; un término por concepto.
- **Estructura:** sin ciclos (skill → template/DoD/config/story.md); el template no depende del skill; cada componente una responsabilidad.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: ambigüedad
- **Descripción**: la historia dice que `--force` sirve «cuando el estado previo o el DoD la bloquean», pero el skill base tiene más bloqueos (DoD ausente, `delivery-model` inválido, historia archivada, afirmación de despliegue en `continuous` de STORY-162). No define si `--force` los omite.
- **Documento afectado**: design.md
- **Acción requerida**: resuelto en D-3: solo se omiten el gate de estado y el de DoD incumplido; el resto sigue fallando cerrado y no sugiere `--force`. Sin cambio en story.md.

### CR-002
- **Tipo**: dependencia
- **Descripción**: `--force` habilita una transición `* → DELIVER/DONE` que no figura en `docs/domains/domain-story-lifecycle.md` (§4.2 solo `ACCEPTANCE --> DELIVER : APPROVED`). La historia no menciona el documento de dominio; dejarlo sin cambios incumple la regla de Veracidad.
- **Documento afectado**: design.md
- **Acción requerida**: incluido como C-5 (fila «Entrega forzada» en §4.3: `* → DELIVER/DONE` desde una historia no archivada, vía `story-delivery --force`, con confirmación humana y override en `delivery-report.md`). El diagrama de §4.2 no se toca: las rutas alternativas viven en §4.3, como `* → CANCELED`.

### CR-003
- **Tipo**: dependencia
- **Descripción**: esta historia modifica `skills/story-delivery/` (SKILL.md, README.md, evals.json), que crea STORY-159, todavía en `READY-FOR-IMPLEMENT/DONE`.
- **Documento afectado**: design.md
- **Acción requerida**: implementar STORY-163 después de cerrar la implementación de STORY-159 (la nota de la historia ya lo pide). Si STORY-162 se implementa antes, C-1 respeta su Paso 2.

### CR-004
- **Tipo**: reutilización
- **Descripción**: el diseño base (D-6 de STORY-159) descartó `delivery-report.md`. La decisión confirmada de esta historia lo reintroduce solo para `--force`.
- **Documento afectado**: design.md
- **Acción requerida**: D-5/D-6 lo limitan a overrides efectivos; la entrega normal sigue sin reporte, así que D-6 de STORY-159 sigue valiendo para el modo `interactivo`. Sin cambio en story.md ni en el diseño base.

### CR-005
- **Tipo**: desvío de implementación
- **Descripción**: D-9 pedía cambiar las claves `outputs` y `triggers` del frontmatter del SKILL.md, pero el skill que dejaron STORY-159 y STORY-162 solo declara `name` y `description`.
- **Documento afectado**: design.md
- **Acción requerida**: no se añadieron claves nuevas al frontmatter. Los triggers («dry-run de entrega», «forzar entrega») y la salida `delivery-report.md` se reflejan en `description`; `## Salida` del SKILL.md documenta los dos archivos posibles.

### CR-006
- **Tipo**: ambigüedad resuelta al implementar
- **Descripción**: STORY-162 se implementó antes y añadió el Paso 2b (afirmación de despliegue en `continuous`). El diseño solo fijaba que `--force` no la omite (F-5), no qué hace en `previsualización`. Además, F-4 no fijaba en qué momento se detecta un `delivery-report.md` previo que no se puede ampliar.
- **Documento afectado**: design.md
- **Acción requerida**: el Paso 2b pregunta en todos los modos y un `n` detiene en todos ellos (en `previsualización` con el cierre fijo de dry-run). La comprobación del reporte previo se hace en el Paso 5a junto con la del template, antes de la confirmación final, para que la confirmación nunca autorice una escritura imposible. La tabla de gates por modo vive en el Paso 1d del SKILL.md como único lugar que decide qué omite `--force`.
