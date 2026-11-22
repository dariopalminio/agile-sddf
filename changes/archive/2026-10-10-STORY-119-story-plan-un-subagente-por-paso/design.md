---
alwaysApply: false
type: design
id: STORY-119
slug: STORY-119-story-plan-un-subagente-por-paso-design
title: "Design: Ejecutar cada paso de /story-plan en un subagente aislado para consumir menos tokens"
status: PLAN
substatus: DONE
parent: EPIC-17-remediating-and-improvement
story: STORY-119
created: 2026-10-07
updated: 2026-10-07
related:
  - STORY-119-story-plan-un-subagente-por-paso
  - EPIC-17-remediating-and-improvement
  - best-practices-for-skills
  - ADR-0002-invocacion-agentes-locales-de-skill
---

<!-- Referencias -->
[[STORY-119-story-plan-un-subagente-por-paso]] · [[EPIC-17-remediating-and-improvement]] · [[best-practices-for-skills]] · [[ADR-0002-invocacion-agentes-locales-de-skill]]

# Diseño técnico: un subagente aislado por paso en `/story-plan`

## Context

`/story-plan` compone hoy sus cuatro workers **inline** (`story-design → story-tasking → story-testcases → story-analyze`):
la sesión principal carga los `SKILL.md` de todos ellos, explora el repo para cada paso y acumula los artefactos que
escribe. La historia pide ejecutar cada paso en un contexto aislado que lea sus insumos del disco y devuelva un estado
breve, con fallback inline cuando el runtime no admite subagentes.

**Estado medido (2026-10-07):**

| Elemento | Valor |
|---|---|
| `skills/story-plan/SKILL.md` | 431 líneas. Pasos 0 (raíz local) · 1 (flags, story_id, directorio, `PLAN/IN-PROGRESS` incondicional en 1e) · 2-5 (un paso por worker, "modo Agent") · 6 (resumen) |
| Tamaño de los workers | `story-design` 565 · `story-tasking` 346 · `story-testcases` 351 · `story-analyze` 685 líneas |
| Idempotencia de los workers | `story-design` (Paso 1d), `story-tasking` (1f) y `story-analyze` (1c) preguntan `(r) Regenerar / (n) No modificar` sin flags. `story-testcases` tiene `--force` (Paso 1d, `[INFO] testcases.md sobreescrito con --force`) y **no** tiene modo "saltar si existe" |
| `story-analyze` | Escribe `READY-FOR-IMPLEMENT/DONE` en `story.md` si no hay ERRORs (Paso 9a); en otro caso no toca el estado |
| Precedentes de delegación | `story-code-review` (4 agentes locales → `.tmp/story-code-review/{story_id}/`, limpieza al inicio) y `story-implement` (subagente `general-purpose` + bloque de contexto → `.tmp/story-implement/{story_id}/…/results.json`). Contrato en ADR-0002 |
| Regla de delegación | `docs/guides/best-practices-for-skills.md` §"Subagentes y skills": subagente → skill **worker** permitido si no interactúa, no lanza subagentes y recibe el contexto resuelto en el prompt |
| `config/runtimes.json` | `codex` declara `agentsDirectory: null`; el resto `agents`. `config/` se publica dentro del paquete npm, no en la raíz del proyecto consumidor |
| Runner de evals | `scripts/run-evals.js` **simula** el skill: el bloque `input` del caso describe el mundo (artefactos existentes, capacidades del runtime, resultado de cada subagente, respuestas del usuario). No lanza subagentes |
| `skills/story-plan/evals/evals.json` | TC-001…TC-005; TC-001 y TC-004 verifican literalmente `[1/3] → story-design`, `[1/3] ✓ story-design — design.md generado`, etc. |
| `.gitignore` | `.tmp` ignorado |

## Goals / Non-Goals

**Goals:**

- Cada paso del pipeline corre en su propio subagente, que recibe solo la ruta del `SKILL.md` del worker y un bloque de contexto (CNF-3).
- Cada paso deja `.tmp/story-plan/<STORY-ID>/<paso>.result.md` con `STATUS: OK|WARN|FAIL` + ≤ 5 líneas; el fail-fast y el resumen final se deciden leyendo solo esos archivos.
- Una única pregunta sobre artefactos existentes, antes de cualquier escritura; ningún worker vuelve a preguntar.
- `story-design`, `story-tasking` y `story-analyze` aceptan `--force` y `--skip-existing`; sin flags conservan el comportamiento interactivo.
- Fallback inline idéntico en artefactos, pregunta y resumen cuando el runtime no ofrece subagentes.
- `--only-tasks`, `--only-testcases`, `--skip-analyze` y la numeración `[n/total]` sin cambios.

**Non-Goals:**

- Paralelizar tasking y testcases; aplicar el patrón a otros orquestadores; crear agentes en `agents/`; editar `docs/guides/best-practices-for-skills.md` (todo según la sección "Fuera de alcance" de la historia).
- Cambiar la lógica de generación de los workers: solo cambia su paso de idempotencia.

## Decisions

### D-1 — Modo de ejecución por capacidad observada del runtime, con `--inline` explícito // satisface: AC-1, AC-4, CNF-1

`story-plan` determina `$EXEC_MODE` una vez, en el Paso 1:

| Condición | `$EXEC_MODE` | Línea del banner |
|---|---|---|
| Se pasó `--inline` | `inline` | `   Ejecución: inline (--inline)` |
| La sesión no dispone de una herramienta para lanzar subagentes (en Claude Code, `Agent`) | `inline` | `   Ejecución: inline (el runtime no admite subagentes)` |
| En otro caso | `subagentes` | `   Ejecución: subagentes (un contexto aislado por paso)` |

`--inline` es un flag nuevo del orquestador: hace falta para medir CNF-1 (comparar la corrida inline y la de subagentes
sobre la misma historia en el mismo runtime) y como vía de escape si un runtime ofrece la herramienta pero falla.

**Alternativas rechazadas:**

- *Leer `config/runtimes.json` y elegir por `agentsDirectory`*: en un proyecto consumidor `config/` vive dentro del
  paquete npm, no en `REPO_ROOT`; con varios runtimes instalados el runtime en curso es ambiguo; y `agentsDirectory`
  describe dónde se copian los agentes Markdown, no si la sesión puede lanzar un subagente `general-purpose`. El
  ejemplo de AC-4 (`codex`) se cumple igual: esa sesión no expone la herramienta.
- *Clave nueva en `sddf.config.yaml`*: configuración permanente para algo que el runtime ya revela en cada sesión (YAGNI).

### D-2 — Decisión única de sobrescritura, antes de cualquier escritura // satisface: AC-2, AC-4

Nuevo Paso 1e, **antes** de actualizar el estado de `story.md` (para que "cancelar" no cambie ningún archivo):

1. `artefactos_del_modo` = `design.md` + (`tasks.md` si el modo incluye tasking) + (`testcases.md` si incluye testcases) + (`analyze.md` salvo `--skip-analyze`).
2. `existentes` = los de esa lista presentes en el directorio de la historia (instantánea tomada en este momento).
3. Si `existentes` está vacío: `$OVERWRITE = nuevo`, sin pregunta.
4. Si no, una sola pregunta (AskUserQuestion o texto, según el runtime):

```
Artefactos de planning existentes en <ruta>: <lista separada por comas>
¿Qué deseas hacer?
  (t) Regenerar todos — reemplazar los artefactos existentes
  (f) Solo los que faltan — conservar los existentes y generar el resto
  (c) Cancelar — no ejecutar el pipeline
```

- `c` → `⏹ Pipeline cancelado — ningún archivo modificado` y fin. No se actualiza `story.md`, no se toca `.tmp/`, no se lanza ningún subagente.
- `t` → `$OVERWRITE = todos`; `f` → `$OVERWRITE = faltantes`.

Flag que recibe cada worker (siempre uno, nunca vacío, para que ningún worker pregunte):

| `$OVERWRITE` | Artefacto del paso en `existentes` | Flag |
|---|---|---|
| `nuevo` / `todos` | — | `--force` |
| `faltantes` | sí | `--skip-existing` |
| `faltantes` | no | `--force` |

La instantánea importa: con `todos`, `tasks.md` se regenera aunque `design.md` acabe de escribirse en el paso 1.

**Alternativas rechazadas:**

- *El orquestador omite el paso cuando el artefacto existe*: duplicaría en `story-plan` la idempotencia que la
  historia asigna a los workers y dejaría AC-5 sin uso real; además rompería "el resumen se arma solo con archivos de
  resultado" (un paso omitido no tendría resultado).
- *Mantener la pregunta en cada worker*: es lo que AC-2 prohíbe y no funciona en un subagente sin usuario.

### D-3 — Flags `--force` y `--skip-existing` en los workers // satisface: AC-5, AC-2

Mismo contrato en `story-design`, `story-tasking`, `story-analyze` y, para cubrir "solo los que faltan" en modo
default, también `--skip-existing` en `story-testcases` (ver CR-001). Se aplica en el paso de idempotencia que ya existe
en cada skill (`story-design` 1d, `story-tasking` 1f, `story-testcases` 1d, `story-analyze` 1c):

| Situación | Comportamiento |
|---|---|
| `--force` y `--skip-existing` juntos | `❌ Los flags --force y --skip-existing son mutuamente excluyentes.` — detener sin escribir |
| Artefacto no existe | Generar normalmente (los flags no aplican) |
| Existe + `--force` | No preguntar; continuar y emitir al guardar `[INFO] <artefacto> sobreescrito con --force` (mensaje que ya usa `story-testcases`) |
| Existe + `--skip-existing` | No preguntar; emitir `[INFO] <artefacto> existente conservado (--skip-existing)` y terminar con éxito sin escribir nada (en `story-analyze` tampoco cambia el estado de `story.md`) |
| Existe, sin flags | Pregunta `(r) Regenerar / (n) No modificar` actual |

Los flags se documentan en `## Parámetros` de cada worker con la misma redacción que `--force` en `story-testcases`.

**Alternativas rechazadas:** `--no-overwrite`/`--keep` (nombres sin precedente en el repo; `--skip-*` ya existe como
convención en `story-plan --skip-analyze`); un único flag `--overwrite=<force|skip|ask>` (rompe la compatibilidad del
`--force` ya publicado en `story-testcases`).

### D-4 — Contrato de resultado `.tmp/story-plan/<STORY-ID>/<paso>.result.md` // satisface: AC-1, AC-3, AC-4

`<paso>` ∈ `design`, `tasking`, `testcases`, `analyze`. Formato:

| Línea | Contenido |
|---|---|
| 1 | Exactamente `STATUS: OK`, `STATUS: WARN` o `STATUS: FAIL` |
| 2 | `<artefacto> <generado \| regenerado \| sin cambios (--skip-existing) \| no generado>` |
| 3-6 | Opcional, ≤ 4 líneas: motivo del FAIL, CRs, conteos. En `analyze` la línea 3 es obligatoria: `ERRORs: <n> · WARNINGs: <m> · story.md: <status>/<substatus>` |

Semántica por paso:

| Paso | OK | WARN | FAIL |
|---|---|---|---|
| design | generado o conservado, sin CRs | generado con CRs | `design.md` no quedó escrito |
| tasking / testcases | generado o conservado | generado con advertencias del worker | artefacto no escrito |
| analyze | sin ERRORs ni WARNINGs | con inconsistencias, **o** conservado con `--skip-existing` (no re-auditó: `story.md` no pasa a `READY-FOR-IMPLEMENT`) | error técnico |

Lectura por el orquestador: archivo ausente, vacío o con una primera línea distinta de las tres válidas ⇒ se trata
como `FAIL` con resumen `resultado ausente o ilegible` (degradación P7). Mapeo al resumen: `OK → ✓`, `WARN → ⚠️`,
`FAIL → ✗`, paso no lanzado `→ —`. Fail-fast: `FAIL` en design, tasking o testcases detiene la cadena; `FAIL` en analyze
no bloquea (comportamiento actual).

Quién escribe: en `$EXEC_MODE = subagentes`, el subagente (por instrucción del prompt, D-5); en `inline`, el
orquestador, inmediatamente después de cada worker y con el mismo formato. Así el fail-fast y el Paso 6 tienen una sola
lógica en ambos modos.

Limpieza: tras la decisión de D-2 (nunca si se canceló), borrar y recrear `.tmp/story-plan/<STORY-ID>/`, igual que
`story-code-review`. Evita leer resultados de una corrida anterior.

**Alternativas rechazadas:** `results.json` como en `story-implement` (la historia fija `<paso>.result.md` y la primera
línea legible sin parser); un único archivo para todo el pipeline (escrituras concurrentes del orquestador y el
subagente sobre el mismo archivo, y pérdida del resultado previo si un paso lo corrompe).

### D-5 — Prompt mínimo del subagente // satisface: AC-1, CNF-3, CNF-5

En Claude Code se lanza con `Agent` y `subagent_type: general-purpose` (patrón ADR-0002, pero pasando la **ruta** del
worker en lugar de su contenido). El prompt contiene solo esto:

```
Ejecuta el skill worker `<worker>`. Lee íntegro su contrato en: <WORKER_SKILL_PATH>

Contexto de invocación (valores ya resueltos; no vuelvas a resolverlos):
- REPO_ROOT: <ruta>
- SPECS_BASE: <ruta>
- ROOT_SOURCE: <SDDF_ROOT | sddf.config.yaml | default>
- story_id: <STORY-NNN>
- story_dir: <ruta del directorio de la historia>
- modo: Agent (sin confirmaciones interactivas)
- argumentos: <STORY-NNN> <--force | --skip-existing>
- result_path: <REPO_ROOT>/.tmp/story-plan/<STORY-NNN>/<paso>.result.md

Reglas:
- No lances subagentes ni invoques skills orquestadores; si el worker pide otro skill, síguelo inline.
- No preguntes al usuario; ante una pausa, aplica el valor por defecto documentado.
- Al terminar, también si fallas, escribe result_path con el formato: primera línea `STATUS: OK|WARN|FAIL`, luego como máximo 5 líneas de resumen.
- Tu respuesta final es solo el contenido de result_path.
```

`<WORKER_SKILL_PATH>` = `<directorio del SKILL.md de story-plan en ejecución>/../<worker>/SKILL.md`: el instalador
copia los skills como hermanos, así que el worker sale de la misma instalación que el orquestador. Antes de la pregunta
de D-2 se comprueba que existan los `SKILL.md` de los workers del modo; si falta uno:
`❌ No se encontró el skill worker <worker> en: <ruta>` y fin sin escrituras.

**Alternativas rechazadas:** incrustar el `SKILL.md` en el prompt como `story-implement` (obliga a la sesión principal a
leer 350-685 líneas por worker, justo el contexto que la historia quiere sacar del hilo principal); agentes registrados
en `agents/` (fuera de alcance y duplicaría la lógica de los workers).

### D-6 — Fallback inline equivalente // satisface: AC-4, CNF-4

En `$EXEC_MODE = inline` cada paso compone el worker como hoy (misma sesión, modo Agent), pero con los mismos
argumentos de D-2 y escribiendo el resultado de D-4. Las líneas de progreso no cambian en ningún modo
(`[n/total] → story-design...`, `[n/total] ✓ story-design — design.md generado`): el modo se informa solo en el banner,
lo que mantiene válidos TC-001…TC-005.

### D-7 — Reestructura de `skills/story-plan/SKILL.md` // satisface: AC-1…AC-4, CNF-4

| Sección | Cambio |
|---|---|
| `## Parámetros` | Agregar `--inline` |
| `## Restricciones / Reglas` | "Idempotencia delegada" pasa a "decisión única al inicio, ejecutada por los workers vía `--force`/`--skip-existing`"; regla de un solo salto (CNF-5) |
| Paso 1 | 1a-1d sin cambios; nuevo 1e (workers presentes + decisión D-2); nuevo 1f (`$EXEC_MODE`, D-1); 1g = actual 1e (estado `PLAN/IN-PROGRESS`, limpieza de `.tmp`, banner con línea `Ejecución:`) |
| Nueva sección `### Contrato de delegación por paso` | Prompt de D-5, contrato de D-4 y regla inline de D-6, referenciada por los Pasos 2-5 |
| Pasos 2-5 | Cada uno "ejecuta el paso según el contrato de delegación" y decide continuar/detener leyendo la línea 1 de su `<paso>.result.md` |
| Paso 6 | Tabla y mensaje final desde los archivos de resultado; el estado de `story.md` mostrado sale de la línea 3 de `analyze.result.md` (o `PLAN/IN-PROGRESS` si analyze no corrió) |
| `### Manejo de errores` | Filas: worker ausente, cancelación, resultado ilegible, flags `--force`/`--skip-existing` |
| `## Salida` | Agregar los archivos temporales `.tmp/story-plan/<STORY-ID>/*.result.md` |

Mensaje final: cualquier `✗` → "Pipeline interrumpido"; si no, cualquier `⚠️` → "requiere revisión"; si no, "Planning completo".

### D-8 — Verificación: evals primero // satisface: AC-1…AC-5, CNF-4, CNF-6

Constitución, principio 11: los casos se escriben antes que el `SKILL.md`. Como el runner simula, cada caso describe en
`input` el runtime (`subagents: true|false`), los artefactos existentes, la respuesta del usuario y el `STATUS` que
escribe cada subagente.

| Archivo | Caso nuevo | Cubre |
|---|---|---|
| `skills/story-plan/evals/evals.json` | TC-006 pipeline con subagentes: banner `Ejecución: subagentes`, 4 result files, resumen desde ellos | AC-1 |
| | TC-007 artefactos existentes + "solo los que faltan": una sola pregunta, `--skip-existing` a design/tasking | AC-2 |
| | TC-008 artefactos existentes + "cancelar": `Pipeline cancelado`, sin `Iniciando pipeline`, sin `PLAN/IN-PROGRESS` | AC-2 |
| | TC-009 `STATUS: FAIL` en design: tasking/testcases/analyze no lanzados, `✗` + `—` | AC-3 |
| | TC-010 runtime sin subagentes: `Ejecución: inline (el runtime no admite subagentes)`, mismos 4 artefactos | AC-4 |
| `skills/story-design/evals/evals.json` | design.md existente + `--force`: sin pregunta, `sobreescrito con --force` | AC-5 |
| `skills/story-tasking/evals/evals.json` | tasks.md existente + `--skip-existing`: sin pregunta, `existente conservado`, sin bloque FILE | AC-5 |
| `skills/story-analyze/evals/evals.json` | analyze.md existente + `--force`: sin pregunta, regenerado | AC-5 |

"Regenerar todos" (fila 1 de AC-2) queda cubierto por la tabla de D-2 y por TC-006 (`--force` a todos). Los IDs de los
workers son el siguiente `TC-NNN` libre de cada archivo.

CNF-1 y CNF-2 se verifican en implementación sobre una copia desechable de STORY-107 bajo `.tmp/`, pasada como
`{story_path}`: una corrida con `--inline` y otra sin flag, cada una en sesión nueva; se registra la entrada acumulada
(`/cost`), el contexto del hilo principal al terminar (`/context`) y los ERRORs de cada `analyze.md` en
`implement-report.md`. La copia se borra al terminar.

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Orquestador `story-plan` | modificar | `skills/story-plan/SKILL.md` | AC-1, AC-2, AC-3, AC-4, CNF-3, CNF-4, CNF-5 |
| Documentación de `story-plan` | modificar | `skills/story-plan/README.md` (modo subagentes, `--inline`, fallback, archivos `.tmp`) | AC-1, AC-4 |
| Evals de `story-plan` | modificar | `skills/story-plan/evals/evals.json` (TC-006…TC-010) | AC-1…AC-4, CNF-6 |
| Worker `story-design` | modificar (Parámetros + Paso 1d) | `skills/story-design/SKILL.md` | AC-5 |
| Worker `story-tasking` | modificar (Parámetros + Paso 1f) | `skills/story-tasking/SKILL.md` | AC-5 |
| Worker `story-analyze` | modificar (Parámetros + Paso 1c) | `skills/story-analyze/SKILL.md` | AC-5 |
| Worker `story-testcases` | modificar (`--skip-existing` en Parámetros + Paso 1d) | `skills/story-testcases/SKILL.md` | AC-2 (CR-001) |
| Evals de los workers | modificar (+1 caso cada uno) | `skills/story-{design,tasking,analyze}/evals/evals.json` | AC-5 (CR-002) |
| Resultados por paso | crear en ejecución (no versionado) | `.tmp/story-plan/<STORY-ID>/<paso>.result.md` | AC-1, AC-3 |

No cambian: `package.json` (`skills/` ya está en `files`), `config/`, `agents/`, `docs/guides/`, `.claude/skills/`
(copia instalada, no fuente).

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| CLI de `story-plan` | `/story-plan <STORY-ID> [story_path] [--only-tasks \| --only-testcases] [--skip-analyze] [--inline]` | AC-1, AC-4, CNF-4 |
| CLI de los workers | `/<worker> <STORY-ID> [--force \| --skip-existing]` (+ parámetros actuales) | AC-5 |
| Pregunta inicial | Opciones `(t)` / `(f)` / `(c)` de D-2; se emite solo si `existentes` no está vacío | AC-2 |
| Prompt del subagente | Bloque de D-5: ruta del worker + contexto + reglas; nada más | AC-1, CNF-3, CNF-5 |
| Archivo de resultado | D-4: línea 1 `STATUS: OK\|WARN\|FAIL`, ≤ 5 líneas de resumen | AC-1, AC-3 |

## Esquema de datos

Variables en memoria del orquestador (no se persisten): `$EXEC_MODE ∈ {subagentes, inline}`,
`$OVERWRITE ∈ {nuevo, todos, faltantes}`, `existentes` (lista), `$STEP_STATUS[paso] ∈ {✓, ⚠️, ✗, —}`.
Único dato persistido nuevo: los archivos de resultado de D-4 (temporales, ignorados por git).

## Flujos clave

### F-1 — Pipeline con subagentes (AC-1)

Paso 0 raíz → Paso 1a-1d → 1e workers presentes + `existentes = ∅` → `$OVERWRITE = nuevo` → 1f `$EXEC_MODE = subagentes`
→ 1g `PLAN/IN-PROGRESS`, limpiar `.tmp/story-plan/<ID>/`, banner → por cada paso del modo: lanzar subagente (D-5) →
leer línea 1 de `<paso>.result.md` → continuar → Paso 6 con los archivos de resultado.

### F-2 — Artefactos existentes (AC-2)

1e detecta `existentes = {design.md, tasks.md}` → pregunta única → `f`: design/tasking reciben `--skip-existing`
(resultado `OK`, `sin cambios`), testcases/analyze reciben `--force` · `t`: todos `--force` · `c`: mensaje de
cancelación y fin antes de 1g.

### F-3 — FAIL en design (AC-3)

Subagente escribe `STATUS: FAIL` → el orquestador marca design `✗`, el resto `—`, no lanza más subagentes → Paso 6
"Pipeline interrumpido en: story-design", `story.md` queda en `PLAN/IN-PROGRESS`.

### F-4 — Runtime sin subagentes (AC-4)

1f sin herramienta de subagentes → `inline` → mismos 1e/1g, cada worker compuesto inline con el mismo flag, el
orquestador escribe el `<paso>.result.md` → mismo Paso 6.

### F-5 — Degradación (P7)

| Falla | Comportamiento |
|---|---|
| Subagente termina sin escribir `result_path` o con línea 1 inválida | `FAIL` con `resultado ausente o ilegible`; fail-fast según el paso |
| Falta el `SKILL.md` de un worker | Error antes de la pregunta inicial; ningún archivo cambia |
| El lanzamiento de un subagente falla (error de la herramienta) | `FAIL` del paso; el mensaje final sugiere re-ejecutar con `--inline` |
| `.tmp/` no se puede crear | Error técnico antes del primer paso; `story.md` ya en `PLAN/IN-PROGRESS` (igual que hoy ante un fallo) |

## Decisiones de complejidad justificada

- **`--inline`**: sin él CNF-1 no se puede medir en Claude Code (siempre elegiría subagentes) y no habría escape ante
  un fallo de la herramienta. Es un booleano sin interacción con los demás flags.
- **Result files también en inline**: cuesta una escritura de ≤ 6 líneas por paso y evita dos versiones del fail-fast y
  del resumen.
- **`--skip-existing` en `story-testcases`**: sin él "solo los que faltan" obligaría a `story-testcases` a preguntar o a
  sobrescribir en modo default. Es la misma fila de tabla que en los otros tres workers.
- **Sin ADR nuevo**: el patrón ya está autorizado por la constitución (§4) y la guía de skills (subagente → worker) y su
  mecanismo es el de ADR-0002; la decisión queda registrada aquí, en el nivel de historia.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Orden de pasos, un subagente por paso, 4 result files, resumen desde ellos | `npm run test:eval -- story-plan --only TC-006` | AC-1 |
| 2 | Una sola pregunta; "solo los que faltan" conserva design/tasks; "cancelar" no cambia archivos | `npm run test:eval -- story-plan --only TC-007,TC-008` | AC-2 |
| 3 | `STATUS: FAIL` en design corta la cadena | `npm run test:eval -- story-plan --only TC-009` | AC-3 |
| 4 | Fallback inline con los mismos artefactos y la misma pregunta | `npm run test:eval -- story-plan --only TC-010` | AC-4 |
| 5 | Workers sin pregunta con `--force`/`--skip-existing` | `npm run test:eval -- story-design story-tasking story-analyze` (casos nuevos) | AC-5 |
| 6 | Compatibilidad de modos y numeración | TC-001…TC-005 de `story-plan` siguen pasando | CNF-4 |
| 7 | Ahorro de tokens y contexto final ≤ ~15k | Medición de CNF-1 descrita en D-8, registrada en `implement-report.md` | CNF-1 |
| 8 | Sin pérdida de calidad | Ambas corridas cumplen `dod-story-plan.md`; ERRORs de `analyze.md` (subagentes) ≤ ERRORs (inline) | CNF-2 |
| 9 | Prompt sin contexto conversacional | Revisión del bloque de D-5 en `SKILL.md`: solo ruta + contexto + reglas | CNF-3 |
| 10 | Sin delegación anidada | Regla en el prompt de D-5; ningún worker menciona `Agent`/subagentes (`grep`) | CNF-5 |
| 11 | Suite determinista | `npm run test:eval -- story-plan --dry-run` (plan no vacío), `node scripts/verify-eval-inventory.js`, `npm test` | CNF-6 |

## Risks / Trade-offs

- [Cada subagente vuelve a explorar el repo para su contexto técnico] → el ahorro puede quedar por debajo del 40-50 %
  estimado. Mitigación: CNF-1 lo mide; el objetivo verificable es "menor que inline" y el hilo principal ≤ ~15k.
- ["Solo los que faltan" conserva un `design.md` viejo y genera `tasks.md` nuevo sobre él] → posible desalineación.
  Es la elección explícita del usuario; `story-analyze` la detecta si corre.
- [El subagente no respeta "no preguntes"] → el prompt siempre lleva un flag, así que ningún worker llega a su pregunta;
  un paso que aun así no escriba resultado cae en `FAIL` (F-5).
- [Un runtime expone la herramienta pero la hace fallar] → `FAIL` del paso con sugerencia de `--inline`.
- [`analyze` conservado con `--skip-existing` deja la historia en `PLAN/IN-PROGRESS`] → se reporta como `WARN` con la
  indicación de ejecutar `/story-analyze <ID> --force`.

## Open Questions

Ninguna bloqueante. El porcentaje real de ahorro se conoce al ejecutar CNF-1.

## Registro de Cambios (CR)

### CR-001

- **Tipo**: dependencia
- **Descripción**: AC-2 ("solo los que faltan") en modo default necesita que `story-testcases` conserve un `testcases.md` existente sin preguntar, pero hoy solo tiene `--force`. La tabla "Superficie de cambio prevista" de la historia no incluye `skills/story-testcases/SKILL.md`.
- **Documento afectado**: story.md / design.md
- **Acción requerida**: agregar `--skip-existing` a `story-testcases` con el mismo contrato de D-3 (incluido en Componentes afectados).

### CR-002

- **Tipo**: dependencia
- **Descripción**: AC-5 se verifica con casos en `skills/story-{design,tasking,analyze}/evals/evals.json`, que no figuran en la superficie de cambio prevista de la historia.
- **Documento afectado**: design.md
- **Acción requerida**: agregar un caso por worker (D-8).

### CR-003

- **Tipo**: ambigüedad
- **Descripción**: AC-4 ejemplifica "runtime sin subagentes" con `agentsDirectory: null` de `config/runtimes.json`. Ese campo describe el destino de los agentes Markdown, no la capacidad de lanzar subagentes, y `config/` no está en la raíz de un proyecto consumidor.
- **Documento afectado**: design.md
- **Acción requerida**: detectar por la herramienta disponible en la sesión (D-1); el ejemplo `codex` se mantiene válido.

### CR-004

- **Tipo**: dependencia
- **Descripción**: CNF-1 exige comparar inline y subagentes sobre la misma historia; en Claude Code no hay forma de forzar inline sin un flag.
- **Documento afectado**: story.md (Parámetros implícitos) / design.md
- **Acción requerida**: agregar `--inline` a `story-plan` (D-1).
