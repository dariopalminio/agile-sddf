---
alwaysApply: false
type: design
id: STORY-092
slug: STORY-092-reglas-robustez-modo-rework-design
title: "Design: El modo rework no da señal verde falsa ni cambia archivos fuera de alcance sin dejar rastro"
date: 2026-09-11
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-19-framework-consistency
related:
  - STORY-092-reglas-robustez-modo-rework
  - STORY-091-story-implement-modo-rework
  - STORY-089-rechazo-nombra-ejecutor-correcciones
  - STORY-090-campos-declarados-nombran-su-escritor
---

<!-- Referencias -->
[[STORY-092-reglas-robustez-modo-rework]]
[[STORY-091-story-implement-modo-rework]]
[[STORY-089-rechazo-nombra-ejecutor-correcciones]]

## Context

**Historia origen:** [[STORY-092-reglas-robustez-modo-rework]] (kind: `feat`, épica `EPIC-19-framework-consistency`). Tercera historia del split post-review: emisor del rechazo (STORY-089) → ejecutor en modo rework (STORY-091) → **endurecimiento del ejecutor (esta)**. Orden de implementación: 089 → 091 → 092.

**Criterios de aceptación de referencia** (numeración usada en todo el diseño):

| AC | Escenario / requerimiento en `story.md` |
|---|---|
| AC-1 | Escenario principal, fila `requirements-coverage` — en rework, si la Fase RED termina con 0 archivos de prueba generados o modificados y `fix-directives.md` contiene un hallazgo bloqueante de esa dimensión, el skill **se detiene con error antes de la Fase GREEN** |
| AC-2 | Escenario principal, filas `code-quality`, `integration-architecture`, `security`, `DoD-CODE-REVIEW` — misma condición, el skill **emite advertencia y continúa** con la Fase GREEN |
| AC-3 | Escenario alternativo, modo `interactivo` — un generator modifica un archivo ausente de la lista blanca; al consolidar la fase el skill muestra los archivos fuera de lista y pide confirmación; con `n` se detiene sin modificar `story.md` |
| AC-4 | Escenario alternativo, modo `--auto` — el cambio se permite y se registra en `implement-report.md` bajo "Archivos fuera de lista blanca" |
| AC-5 | Requerimiento — la regla de RED lee únicamente la columna `Dimensión` de la tabla "Instrucciones de corrección"; no interpreta el texto del hallazgo |
| AC-6 | Requerimiento — la lista blanca se deriva de la sección "Lista blanca de archivos permitidos para modificar"; es barrera de alcance (confirmar / registrar), no bloqueo absoluto |
| NFR-1 | Determinismo: ambas reglas se evalúan sin juicio del LLM (comparación de valores de columna; comparación de rutas contra una lista) |
| NFR-2 | Trazabilidad: la subsección "Archivos fuera de lista blanca" de `implement-report.md` es la entrada de `story-code-review` en la ronda siguiente |
| NFR-3 | En `--auto` ninguna de las dos reglas pide confirmación |

**Estado actual medido sobre el repositorio (2026-09-11):**

- `skills/story-implement/SKILL.md` (fuente editable; `.claude/skills/` es copia instalada e ignorada por git) — **no tiene modo rework**: lo introduce STORY-091, ya planificada (`READY-FOR-IMPLEMENT/DONE`, con `design.md`, `tasks.md`, `testcases.md`) pero aún no implementada. Estructura relevante para esta historia: Paso 0b (`$EXEC_MODE ∈ {auto, interactive}`), Paso 4 (bucle de `test_generators`, registra `files_generated` por tipo en `$RED_GENERATORS_INVOKED`), Paso 5 (confirmar rojo), Paso 6 (escribe `red-phase-status.json` con `files_generated`) + "Validación post-escritura", Pause-1, Paso 9 (bucle GREEN por capa, acumula `$GREEN_FILES_GENERATED`), Paso 10 (bucle REFACTOR), Paso 11b (`implement-report.md` con secciones `## Resumen`, `## Ciclo TDD`, `## DoD IMPLEMENT`), tabla "Manejo de errores" (l. 773) y "Arquitectura de delegación" (l. 807).
- **Contrato `results.json` de los subagentes** (Fase RED `.tmp/story-implement/{story_id}/{tipo}/results.json`; GREEN/REFACTOR `.tmp/story-implement/{story_id}/{fase}/{capa}/results.json`): campos implícitos `status: ok|error`, `message`, `files_generated: []`. **No existe `files_modified`**: hoy el orquestador no distingue archivos creados de archivos existentes editados.
- Patrón de pausa interactiva ya existente (Pause-1 / Pause-2): pregunta `(s/n)`, Enter = `s`, entrada inválida se repite una vez y luego se asume `n`, salida limpia con `🛑 …`. Se reutiliza para la confirmación de alcance (P3).
- `skills/story-code-review/SKILL.md` Paso 4e/4f y `assets/fix-directives-template.md`: la tabla "Instrucciones de corrección" tiene columnas `#`, `Archivo:Línea`, `Dimensión`, `Severidad`, `Hallazgo`, `Acción requerida`; solo contiene hallazgos HIGH/MEDIUM (todas sus filas son bloqueantes por construcción). Valores de `Dimensión` que escribe hoy: `code-quality`, `requirements-coverage`, `integration-architecture`, `security`, `DoD-CODE-REVIEW`. La sección "Lista blanca de archivos permitidos para modificar" es una lista de bullets con la ruta entre backticks seguida de `— hallazgo #N`.
- **Fixture real `STORY-090/fix-directives.md`:** dimensiones presentes `code-quality`, `integration-architecture`, `DoD-CODE-REVIEW` (sin `requirements-coverage`); su lista blanca contiene un bullet anotado `**solo lectura**` (`docs/policies/dod-story.md`) y, dentro de la misma sección, una sub-lista "Destino de las acciones requeridas" con cinco rutas adicionales. Es el caso que la propia historia cita para justificar que la lista blanca no es un bloqueo absoluto.
- `skills/story-implement/evals/evals.json` existe (`version 1.0.0`, casos `TC-NNN` con `input.sddf_config`, `expected.contains/not_contains/output_file`). Principio 11 de la constitución: evals antes del `SKILL.md`.
- `sddf.config.yaml` de este repo: `code_generators.layer: monolithic` → `skill-master`; `test_generators.eval` → `skill-test-evals` (`required: true`), `unit`/`e2e` → `none`. En este repo "código de producción" = `SKILL.md`, `assets/`, `examples/`, `evals/`.
- **Contrato provisto por `STORY-091/design.md`** (D1–D3, D5 y fila "Contrato hacia STORY-092" de sus Interfaces): Paso 0c nuevo (gate de estado + detección + `story.md → IMPLEMENT/IN-PROGRESS`) que expone `$STORY_DIR`, `$REWORK_MODE ⇔ existe fix-directives.md`, `$FIX_DIRECTIVES_PATH`, `$REWORK_ROUND` (ausente ⇒ 1) y `$WHITELIST = [{path, note}]` (toda viñeta con ruta de la sección "Lista blanca…", conservando el texto libre como `note` **sin interpretarlo**; sección ausente ⇒ `[]` + `[WARN]`). Campos de bundle `rework_round`, `fix_directives_path`, `whitelist` (`null` fuera de rework) y párrafo "Instrucción de rework" que ya pide a GREEN/REFACTOR "reporta en `files_modified` todo archivo tocado". Sección `## Ciclo de corrección — ronda {N}` en `implement-report.md` (tras "## Ciclo TDD", antes de "## DoD IMPLEMENT") con tabla hallazgo → archivos tocados → estado `✓/⚠️` y la lista blanca recibida. STORY-091 declara explícitamente que **no aplica ninguna regla** sobre esos datos: "STORY-092 añade la verificación dura". Su CR-002 confirma que los generators instalados (`skill-test-evals`, `skill-master`) no viven en `skills/` y no pueden actualizarse para consumir los campos de rework.

**Restricciones que aplica este diseño:** constitución §3 (verificación: la IA demuestra que algo funciona), §4 (herramientas simples: `git status`), §6 (skills como orquestadores sin lógica de negocio), §10 (gates con precondiciones), §12 (flags para modos alternativos: se respeta `--auto`), principio 11 (evals primero), principio 12 (fuente en `skills/`, no en `.claude/`), `docs/guardrails/gr-skill-creation-checklist.md`. No se requiere ADR: la decisión no afecta a más de un skill (solo `story-implement`) y la decisión transversal "rework sin estado propio" ya está en ADR-0008 (STORY-089, D8).

## Goals / Non-Goals

**Goals:**
- Regla **"evidencia en RED"**: en rework, 0 archivos de prueba generados/modificados + hallazgo `requirements-coverage` ⇒ error antes de GREEN; cualquier otra dimensión ⇒ advertencia y continuar. `// satisface: AC-1, AC-2, AC-5`
- Regla **"alcance de la lista blanca"**: al consolidar cada fase (RED, GREEN, REFACTOR), todo archivo existente modificado fuera de la lista blanca se confirma en interactivo o se registra en `--auto`. `// satisface: AC-3, AC-4, AC-6, NFR-3`
- Subsección `### Archivos fuera de lista blanca` en `implement-report.md`, con contrato estable para que `story-code-review` la consuma en la ronda siguiente. `// satisface: AC-4, NFR-2`
- Ambas reglas evaluables mecánicamente (parseo de columna / comparación de rutas). `// satisface: NFR-1`
- Casos de eval en `skills/story-implement/evals/evals.json` que cubren AC-1..AC-4 antes de tocar `SKILL.md`.

**Non-Goals:**
- Detección del modo rework, gate de estado, anuncio `🔁 Modo rework (ronda N)`, parser de la lista blanca, bundle de contexto y sección `## Ciclo de corrección — ronda N`: [[STORY-091-story-implement-modo-rework]]. Este diseño **consume** esos elementos tal como los fija `STORY-091/design.md` (ver Interfaces y CR-001).
- Cambios en `story-code-review` (incluida la lectura de la subsección "Archivos fuera de lista blanca" en la ronda siguiente): [[STORY-089-rechazo-nombra-ejecutor-correcciones]] y futuro (ver CR-002).
- Ampliar la lista blanca automáticamente, regenerar `fix-directives.md` desde `story-implement`, o revertir en disco los archivos rechazados por el usuario.
- Interpretar el texto de los hallazgos para decidir si "necesitan test".

## Decisions

### D1 — La regla de evidencia se evalúa una sola vez, al cerrar la Fase RED (nuevo Paso 6b), sobre la unión de archivos de prueba generados y modificados

`// satisface: AC-1, AC-2`

**Elegida:** nuevo **Paso 6b "Gate de evidencia en rework"**, inmediatamente después de la "Validación post-escritura" del Paso 6 y antes de Pause-1. Solo se ejecuta si `$REWORK_MODE = true`. Calcula `$RED_TEST_FILES = files_generated ∪ files_modified` de todos los `results.json` de la Fase RED (ver D3 para el origen de `files_modified`). Si `|$RED_TEST_FILES| = 0`:
- `requirements-coverage ∈ $FIX_DIRECTIVES_DIMENSIONS` ⇒ error `❌ Rework sin evidencia …` y **detener**: no se ejecuta Pause-1 ni Paso 7; `story.md` no recibe escrituras adicionales.
- En caso contrario ⇒ `⚠️ Rework sin tests nuevos …` listando las dimensiones presentes y **continuar**.

Si `|$RED_TEST_FILES| > 0` no se emite nada. El resultado se persiste en `red-phase-status.json` como `rework_evidence: ok | warning | error | n/a` (`n/a` fuera de rework).

**Alternativas rechazadas:**
- *Evaluar dentro del bucle del Paso 4, por generator* — un proyecto con varios `test_generators` (unit + eval) produciría falsos errores cuando el primer tipo no genera nada y el segundo sí; la historia habla de "la Fase RED termina con 0 archivos", es decir, del agregado.
- *Evaluar en el Paso 7 (precondición GREEN) junto a `red_confirmed`* — mezclaría dos precondiciones de naturaleza distinta y dejaría al usuario pasar por Pause-1 antes de enterarse del error. Persistir `rework_evidence` en `red-phase-status.json` permite que el Paso 7 lo lea en una reanudación sin duplicar la regla.

### D2 — La dimensión bloqueante se decide comparando literalmente los valores de la columna `Dimensión`; cualquier valor distinto de `requirements-coverage` es advertencia

`// satisface: AC-2, AC-5, NFR-1`

**Elegida:** procedimiento `Lectura de dimensiones` (ver Interfaces): parte de `$REWORK_FINDINGS` (filas de la tabla "Instrucciones de corrección" que el Paso 0c.3 de STORY-091 ya parsea, con `#`, `Archivo:Línea`, `Dimensión`, `Acción requerida`); identifica el índice de la columna cuyo encabezado es `Dimensión` (no se asume posición) y recoge los valores de esa columna en cada fila de datos (trim, sin backticks). Resultado: `$FIX_DIRECTIVES_DIMENSIONS` (conjunto). Se parsea una sola vez, en el orquestador (constitución §6), no en cada generator. Regla: `requirements-coverage ∈ conjunto` ⇒ error; conjunto no vacío sin ese valor ⇒ advertencia. Los valores no reconocidos (una dimensión futura de un agente nuevo) caen en "advertencia": la única dimensión que la historia declara "siempre testeable" es `requirements-coverage`.

**Degradación (P7):** si el encabezado o la tabla no existen, o ninguna columna se llama `Dimensión`, el conjunto queda **vacío** y el gate se resuelve como `error` con mensaje propio (`❌ fix-directives.md sin tabla "Instrucciones de corrección" legible`). Fallar cerrado evita la "señal verde falsa" que la historia quiere impedir; un `fix-directives.md` sin tabla legible no es un rework ejecutable.

**Alternativas rechazadas:**
- *Lista cerrada de las cinco dimensiones y error ante un valor desconocido* — acoplaría `story-implement` al catálogo de agentes de `story-code-review`; añadir un revisor nuevo rompería el rework. La historia solo fija la semántica de `requirements-coverage`.
- *Inferir de la columna `Hallazgo` si el hallazgo "requiere test"* — prohibido explícitamente por AC-5 y NFR-1 (juicio del LLM).
- *Tratar la tabla ilegible como advertencia* — más permisivo, pero contradice el objetivo de la historia (no dar verde sin evidencia).

### D3 — Los archivos modificados por una fase se obtienen de un snapshot `git status --porcelain` antes/después del bucle de generators, unido al autoinforme `files_generated`/`files_modified` de los `results.json`

`// satisface: AC-3, AC-4, NFR-1`

**Elegida:** procedimiento `Consolidación de alcance` (ver Interfaces), ejecutado al final del bucle de generators de cada fase (Paso 4, Paso 9, Paso 10), solo si `$REWORK_MODE = true`:
1. Antes del bucle: `$SNAPSHOT_BEFORE = git status --porcelain` (rutas normalizadas).
2. Después del bucle: `$SNAPSHOT_AFTER`; el **delta** clasifica: código `??`/`A ` ⇒ nuevo; ` M`/`MM`/`AM`/`RM` ⇒ modificado. Solo cuentan las rutas cuyo estado cambió entre los dos snapshots.
3. `$PHASE_NEW = delta.nuevos ∪ files_generated`; `$PHASE_MODIFIED = delta.modificados ∪ files_modified` (de todos los `results.json` de la fase).
4. El campo `files_modified` de `results.json` — que la "Instrucción de rework" de STORY-091 ya pide en prosa a GREEN/REFACTOR — se **formaliza** en el contrato del subagente como campo opcional (ausente ⇒ `[]`) en todas las fases y modos; el bloque de contexto de invocación añade la línea `Salida esperada en results.json: status, message, files_generated, files_modified` (retrocompatible: hoy `SKILL.md` no documenta el contrato de salida).
5. Si `git` no está disponible o el directorio no es un repositorio: `[WARN] Sin control de versiones — el alcance se evalúa solo con el autoinforme de los generators`, y se usa únicamente el paso 3 con el autoinforme (P7).

**Alternativas rechazadas:**
- *Solo autoinforme de los generators* — los generators instalados en este repo (`skill-test-evals`, `skill-master`) no viven en `skills/` y no pueden actualizarse (STORY-091, CR-002); un generator que omite `files_modified` haría la regla inoperante y la barrera dependería de la honestidad del subagente.
- *Solo `git status`* — pierde los archivos en proyectos sin repositorio y no distingue el generator de origen; la unión conserva la atribución cuando el autoinforme existe.
- *Instrumentar el filesystem (hash de todos los archivos antes/después)* — más caro y equivalente en resultado a `git status` en un repo, que es la herramienta simple del ecosistema (constitución §4).

### D4 — La barrera de alcance aplica a archivos existentes modificados; los archivos nuevos siempre se registran y nunca bloquean

`// satisface: AC-3, AC-4, AC-6, NFR-2`

**Elegida:** `$OUT_OF_SCOPE = { f ∈ $PHASE_MODIFIED | f ∉ $WHITELIST_PATHS }`. Solo `$OUT_OF_SCOPE` dispara confirmación (interactivo) o registro con `[WARN]` (`--auto`). `$PHASE_NEW` se registra íntegro en la subsección del reporte bajo "Archivos nuevos" sin confirmación en ningún modo.

**Justificación:** la lista blanca se deriva de `Archivo:Línea` de hallazgos sobre código existente; por construcción **ningún archivo nuevo puede estar en ella**. Aplicar la barrera a los nuevos haría que todo rework con tests nuevos (exigidos por AC-1) pidiera confirmación en RED, convirtiendo la regla en ruido. El Gherkin de la historia dice literalmente "archivo modificado". Registrarlos igualmente cumple "sin dejar rastro" para la ronda siguiente.

**Alternativas rechazadas:**
- *Barrera sobre nuevos y modificados* — ruido sistemático en RED (ver arriba) y contradicción práctica con AC-1.
- *Ignorar los archivos nuevos por completo* — un generator podría crear un archivo de producción fuera de alcance sin dejar rastro; contradice NFR-2.

### D5 — Rutas permitidas = `path` de cada entrada de `$WHITELIST` (parseada por STORY-091) cuya `note` no contiene `solo lectura`; comparación por igualdad exacta tras normalizar

`// satisface: AC-6, NFR-1`

**Elegida:** esta historia **no parsea** la sección "Lista blanca de archivos permitidos para modificar": consume `$WHITELIST = [{path, note}]` tal como la construye el Paso 0c de STORY-091 (toda viñeta con ruta de la sección, incluida la sub-lista "Destino de las acciones requeridas", con el texto libre conservado en `note` sin interpretar). Sobre ella aplica el procedimiento `Rutas permitidas` (ver Interfaces): `$WHITELIST_PATHS = { normalizar(e.path) | e ∈ $WHITELIST ∧ "solo lectura" ∉ e.note }`. Normalización (aplicada también a los archivos observados): relativa a la raíz del repositorio, separador `/`, sin `./` inicial, sin sufijo `:línea`. Comparación por igualdad exacta (sin globs ni directorios).

Con el fixture STORY-090 esto produce 8 rutas (2 evals de la historia, `scripts/migrate-finvest-field.js`, y las 5 de "Destino de las acciones requeridas") y excluye `docs/policies/dod-story.md`. La sub-lista "Destino…" queda dentro porque STORY-091 la parsea de la misma sección: es exactamente el caso que AC-6 cita como corrección legítima fuera de la lista derivada.

**Alternativas rechazadas:**
- *Parser propio en esta historia* — duplicaría el de STORY-091 D2 (dos lecturas del mismo texto con riesgo de divergir); AC-6 se satisface interpretando la `note` que 091 ya conserva "para que la use quien la necesite".
- *Ignorar la anotación `solo lectura`* — `dod-story.md` es origen de criterios, no objeto de corrección; una modificación suya debe salir a la luz como fuera de alcance. Coste: una comparación de substring sobre `note`.
- *Soportar globs/directorios* — `story-code-review` 4e nunca los escribe; YAGNI.

### D6 — La confirmación de alcance reutiliza el patrón Pause-1/Pause-2; `n` termina con salida limpia sin revertir archivos ni tocar `story.md`

`// satisface: AC-3, NFR-3`

**Elegida:** en `$EXEC_MODE = interactive` con `$OUT_OF_SCOPE ≠ ∅`, mostrar la lista `(archivo ← origen skill/capa)` y preguntar `¿Aceptar estos cambios fuera de la lista blanca? (s/n)`. Semántica idéntica a Pause-1: Enter = `s`; entrada inválida se repite una vez y luego se asume `n`. `s` ⇒ cada archivo se añade a `$OUT_OF_SCOPE_LOG` con resolución `confirmado (interactivo)` y la fase continúa. `n` ⇒ `🛑 Ciclo TDD detenido en Fase {fase}: cambios fuera de la lista blanca rechazados por el usuario`, listado de archivos con la sugerencia `git diff -- <archivos>` / `git checkout -- <archivos>`, y **terminar sin error** sin ejecutar pasos siguientes ni escribir en `story.md` (queda en el `IMPLEMENT/IN-PROGRESS` que STORY-091 fija al arrancar; una reanudación posterior es válida). En `$EXEC_MODE = auto`: sin prompt; cada archivo va a `$OUT_OF_SCOPE_LOG` con resolución `registrado (--auto)` y se emite `[WARN] {N} archivo(s) fuera de la lista blanca en Fase {fase} — registrados en implement-report.md`.

**Alternativas rechazadas:**
- *Revertir los archivos con `git checkout` al responder `n`* — destructivo sobre cambios que podrían mezclarse con trabajo previo del usuario; fuera de alcance de la historia. Se sugiere el comando, no se ejecuta.
- *Preguntar archivo por archivo* — más prompts sin más información; la decisión es sobre el conjunto de la fase.
- *Confirmar también en `--auto` con timeout* — NFR-3 lo prohíbe.

### D7 — La subsección `### Archivos fuera de lista blanca` vive dentro de `## Ciclo de corrección — ronda N` de `implement-report.md`, con tabla de columnas fijas y valor `Ninguno` cuando está vacía

`// satisface: AC-4, NFR-2`

**Elegida:** el Paso 11b, si `$REWORK_MODE = true`, añade bajo la sección que STORY-091 introduce (`## Ciclo de corrección — ronda {round}`) la subsección `### Archivos fuera de lista blanca` con: (a) tabla `| Fase | Archivo | Origen | Resolución |` con una fila por entrada de `$OUT_OF_SCOPE_LOG` (`Origen` = `{skill}` en RED o `{skill}/{capa}` en GREEN/REFACTOR; `Resolución ∈ {confirmado (interactivo), registrado (--auto)}`), o la línea `Ninguno` si no hay entradas; (b) lista `**Archivos nuevos:**` con las rutas de `$PHASE_NEW` de todas las fases, o `Ninguno`. La subsección se escribe siempre en rework (aunque esté vacía) para que `story-code-review` tenga un anclaje estable; fuera de rework no se escribe.

**Alternativas rechazadas:**
- *Sección de nivel `##` propia* — la historia habla de "subsección"; y el contexto de ronda (`round`) ya está en el encabezado de STORY-091.
- *Escribir solo cuando hay entradas* — un consumidor no distinguiría "sin desvíos" de "versión antigua sin la regla".
- *Persistir el log en `.tmp/` únicamente* — `.tmp/` no se versiona; la ronda siguiente de `story-code-review` puede ejecutarse en otra sesión.

### D8 — Evals primero: los casos AC-1..AC-4 se añaden a `skills/story-implement/evals/evals.json` antes de editar `SKILL.md`

`// satisface: AC-1, AC-2, AC-3, AC-4`

**Elegida:** nuevos casos `TC-NNN` (numeración correlativa tras el último existente) con `input.fix_directives` (dimensiones y lista blanca sintéticas), `input.exec_mode`, `input.generator_results` (con `files_generated`/`files_modified`) y `expected.contains/not_contains/output_contains`. Se mantiene el formato del archivo (`version` → `1.1.0`).

**Alternativas rechazadas:** *evals en el directorio de la historia* (`docs/specs/03-stories/STORY-092/evals/`) — es el antipatrón que el hallazgo #1 de STORY-090 documenta (no alcanzables por `skill-test-evals`).

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Skill `story-implement` — "Qué hace este skill", "Reglas", Paso 4 (snapshot + `Consolidación de alcance` + línea de salida esperada en el bloque de contexto), Paso 6 (`files_modified`, `rework_evidence` en `red-phase-status.json`), **nuevo Paso 6b**, Paso 7 (lee `rework_evidence`), Paso 9 y Paso 10 (snapshot + consolidación), Paso 11b (subsección), tabla "Manejo de errores", "Arquitectura de delegación" (contrato `results.json`), "Salida" | modificar | `skills/story-implement/SKILL.md` | AC-1..AC-6, NFR-1..NFR-3 |
| Evals de `story-implement` | modificar (añadir casos) | `skills/story-implement/evals/evals.json` | AC-1, AC-2, AC-3, AC-4 |
| README de `story-implement` — tabla de outputs (`results.json` con `files_modified`), nota de modo rework | modificar | `skills/story-implement/README.md` | NFR-2 |
| CHANGELOG | modificar | `CHANGELOG.md` | — (DoD documentación) |
| Copia instalada de skills | refrescar (`scripts/install.js`) | `.claude/skills/story-implement/` (ignorado por git) | — (operativo) |

Componentes **no** tocados: `skills/story-code-review/` (consumo de la subsección: CR-002), `skills/story-implement-tasks/` (su pre-paso 2f de STORY-089 aplica correcciones sin ciclo RED; estas reglas son específicas del ciclo TDD de `story-implement`), `assets/fix-directives-template.md` (no se añaden campos al artefacto), `sddf.config.yaml`.

## Interfaces / contratos

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| **Entradas provistas por STORY-091** (Paso 0c; fila "Contrato hacia STORY-092" de su diseño) | Variables en memoria: `$STORY_DIR`; `$REWORK_MODE: bool`; `$FIX_DIRECTIVES_PATH: ruta \| null`; `$REWORK_ROUND: entero ≥ 1 \| null`; `$WHITELIST: [{path, note}] \| null` (`[]` si la sección falta). `$REWORK_FINDINGS` (filas de la tabla "Instrucciones de corrección" con sus columnas); `$GREEN_FILES_MODIFIED` / `$REFACTOR_FILES_MODIFIED` consolidados desde `results.json` (tarea 3.3 de STORY-091). Campos de bundle `rework_round`, `fix_directives_path`, `whitelist` y párrafo "Instrucción de rework" (que ya pide `files_modified`). Sección `## Ciclo de corrección — ronda {N}` en `implement-report.md`. Esta historia no modifica ninguno de estos elementos; solo los lee. | AC-1..AC-6 |
| **`Lectura de dimensiones`** (`$REWORK_FINDINGS` → `$FIX_DIRECTIVES_DIMENSIONS`) | Entrada: `$REWORK_FINDINGS` (filas parseadas por 0c.3 de STORY-091). Columna con encabezado `Dimensión` (índice por nombre). Salida: conjunto de valores (trim, sin backticks) de las filas de datos. Tabla/columna ausente ⇒ conjunto vacío. No lee ninguna otra columna. | AC-5, NFR-1 |
| **`Rutas permitidas`** (`$WHITELIST` → `$WHITELIST_PATHS`) | Entrada: `$WHITELIST = [{path, note}]` de STORY-091. Salida: conjunto `{ normalizar(e.path) \| "solo lectura" ∉ e.note }`, deduplicado. Normalización: relativa a la raíz, `/`, sin `./`, sin `:línea`. `$WHITELIST = []` o `null` ⇒ conjunto vacío (toda modificación queda fuera de lista, nunca error). | AC-6, NFR-1 |
| **Gate de evidencia en rework** (Paso 6b) | Precondición: `$REWORK_MODE = true`. Entrada: `$RED_TEST_FILES = ⋃ (files_generated ∪ files_modified)` de los `results.json` de RED; `$FIX_DIRECTIVES_DIMENSIONS`. Salida: `rework_evidence ∈ {ok, warning, error}` persistido en `red-phase-status.json`; `error` ⇒ detener antes de Pause-1/Paso 7. Mensajes: `❌ Rework sin evidencia: la Fase RED no generó ni modificó archivos de prueba y fix-directives.md contiene hallazgos requirements-coverage (#N, #M)` / `⚠️ Rework sin tests nuevos: la Fase RED no generó ni modificó archivos de prueba; dimensiones presentes: {lista} — continuando con la Fase GREEN` / `❌ fix-directives.md sin tabla "Instrucciones de corrección" legible — no se puede evaluar la evidencia del rework`. | AC-1, AC-2 |
| **Contrato `results.json` de subagentes** (ampliado) | `{ "status": "ok" \| "error", "message": string?, "files_generated": [ruta], "files_modified": [ruta] }`. `files_modified` opcional (ausente ⇒ `[]`). El bloque de contexto de invocación incluye, en todas las fases y modos, la línea `Salida esperada en results.json: status, message, files_generated, files_modified`. | AC-3, AC-4 |
| **`Consolidación de alcance`** (por fase; Pasos 4, 9, 10) | Precondición: `$REWORK_MODE = true`. Entradas: `$SNAPSHOT_BEFORE`, `$SNAPSHOT_AFTER` (`git status --porcelain`, rutas normalizadas), `results.json` de la fase, `$WHITELIST_PATHS`, `$EXEC_MODE`. Salidas: `$PHASE_NEW`, `$PHASE_MODIFIED`, `$OUT_OF_SCOPE = $PHASE_MODIFIED \ $WHITELIST`; entradas añadidas a `$OUT_OF_SCOPE_LOG: [{fase, archivo, origen, resolución}]` y `$NEW_FILES_LOG: [{fase, archivo, origen}]`. Efecto en `interactive` con `$OUT_OF_SCOPE ≠ ∅`: prompt `(s/n)`; `n` ⇒ terminar (D6). En `auto`: `[WARN]` y continuar. Sin git ⇒ `[WARN]` y solo autoinforme. | AC-3, AC-4, AC-6, NFR-3 |
| **`red-phase-status.json`** (ampliado) | Campos nuevos: `files_modified: [ruta]`, `rework_evidence: "ok" \| "warning" \| "error" \| "n/a"`. El Paso 7 trata `rework_evidence: "error"` como precondición no cumplida (`❌ Precondición RED no cumplida: rework_evidence es error`). | AC-1 |
| **Subsección de `implement-report.md`** (contrato para `story-code-review`, ronda siguiente) | Ruta: `## Ciclo de corrección — ronda {round}` → `### Archivos fuera de lista blanca`. Contenido: tabla `\| Fase \| Archivo \| Origen \| Resolución \|` (`Fase ∈ {RED, GREEN, REFACTOR}`; `Origen` = skill o skill/capa; `Resolución ∈ {confirmado (interactivo), registrado (--auto)}`) o `Ninguno`; luego `**Archivos nuevos:**` con lista `- ruta (fase, origen)` o `Ninguno`. Presente siempre que `$REWORK_MODE = true`. | AC-4, NFR-2 |

## Flujos clave

**F1 — Fase RED en rework sin tests nuevos** `// satisface: AC-1, AC-2`

```
Paso 4  snapshot_before ─► bucle test_generators ─► snapshot_after ─► Consolidación de alcance (RED)
Paso 5  confirmar rojo (sin cambios)
Paso 6  red-phase-status.json {files_generated, files_modified, rework_evidence}
Paso 6b $REWORK_MODE? ── no ─► rework_evidence = n/a ─► Pause-1
           │ sí
           ▼
        |$RED_TEST_FILES| = 0 ? ── no ─► rework_evidence = ok ─► Pause-1
           │ sí
           ▼
        $FIX_DIRECTIVES_DIMENSIONS vacío ? ── sí ─► ❌ tabla ilegible ─► DETENER
           │ no
           ▼
        requirements-coverage ∈ conjunto ? ── sí ─► rework_evidence = error ─► ❌ Rework sin evidencia ─► DETENER
           │ no
           ▼
        rework_evidence = warning ─► ⚠️ Rework sin tests nuevos ─► Pause-1 ─► Paso 7 (GREEN)
```

**F2 — Archivo fuera de la lista blanca, modo interactivo** `// satisface: AC-3`

```
Paso 9  snapshot_before ─► bucle code_generators (capa monolithic: skill-master) ─► snapshot_after
        Consolidación de alcance (GREEN):
          $PHASE_MODIFIED = delta( M) ∪ files_modified   →  {skills/story-implement/SKILL.md, README.md}
          $OUT_OF_SCOPE  = $PHASE_MODIFIED \ $WHITELIST_PATHS →  {README.md}
          $PHASE_NEW     = delta(??) ∪ files_generated    →  {} (se registran en $NEW_FILES_LOG)
        ┌─────────────────────────────────────────────────────────────┐
        │ ⚠️ Archivos modificados fuera de la lista blanca (GREEN):    │
        │    · README.md  ← skill-master/monolithic                   │
        │ ¿Aceptar estos cambios fuera de la lista blanca? (s/n)      │
        └─────────────────────────────────────────────────────────────┘
          s ─► $OUT_OF_SCOPE_LOG += {GREEN, README.md, skill-master/monolithic, confirmado (interactivo)} ─► Paso 9b
          n ─► 🛑 Ciclo TDD detenido en Fase GREEN: cambios fuera de la lista blanca rechazados por el usuario
               (sugerencia: git diff -- README.md · git checkout -- README.md) ─► FIN (exit limpio; story.md intacto)
```

**F3 — Archivo fuera de la lista blanca, modo `--auto`** `// satisface: AC-4, NFR-3`

```
Consolidación de alcance (fase X) con $EXEC_MODE = auto:
  $OUT_OF_SCOPE ≠ ∅ ─► [WARN] N archivo(s) fuera de la lista blanca en Fase X — registrados en implement-report.md
                   ─► $OUT_OF_SCOPE_LOG += {X, archivo, origen, registrado (--auto)} ─► continuar
Paso 11b (rework):
  ## Ciclo de corrección — ronda N            ← STORY-091
  ### Archivos fuera de lista blanca          ← esta historia
  | Fase | Archivo | Origen | Resolución |
  | GREEN | README.md | skill-master/monolithic | registrado (--auto) |
  **Archivos nuevos:** Ninguno
```

## Risks / Trade-offs

- **[Riesgo] Proyecto sin `test_generators` activos (todos `skill: none`) + hallazgo `requirements-coverage`** → en rework el Paso 6b siempre termina en error. → Mitigación: el mensaje de error nombra la causa ("revisa los test_generators de sddf.config.yaml"); es el comportamiento que la historia exige (un AC no cubierto siempre es testeable) y hace visible una configuración incompleta.
- **[Riesgo] Responder `n` deja los archivos ya modificados en disco** → Mitigación: el mensaje lista los archivos y sugiere `git diff` / `git checkout --`; revertir automáticamente queda fuera de alcance (D6).
- **[Riesgo] La barrera es post-hoc: el generator ya escribió antes de la consolidación** → aceptado por diseño (AC-6: barrera de alcance, no bloqueo). STORY-091 pasa `whitelist` al generator para que restrinja su propio alcance; esta regla es la red de seguridad.
- **[Riesgo] Cambios del usuario concurrentes durante una fase se atribuyen al generator** → Mitigación: solo se consideran rutas cuyo estado cambió entre snapshots; una atribución errónea solo añade una fila al reporte, nunca bloquea en `--auto`.
- **[Trade-off] Fallar cerrado ante tabla ilegible (D2)** → un `fix-directives.md` escrito a mano con formato distinto detiene el rework. Aceptado: el escritor único es `story-code-review` (STORY-089) y su template fija el formato.
- **[Trade-off] Rutas con igualdad exacta (D5)** → un generator que escribe la misma ruta con otra forma (`./`, `\`) produciría un falso "fuera de lista"; la normalización cubre las variantes conocidas.

## Decisiones de complejidad justificada

- **Snapshot `git status` además del autoinforme (D3):** la solución más simple (solo `files_modified`) es inoperante hoy: ningún generator existente reporta ese campo y la regla dependería de la honestidad del subagente. `git status --porcelain` es una herramienta simple del ecosistema (constitución §4) y ya está disponible en el flujo. Coste: dos invocaciones por fase y un diff de listas.
- **Exclusión de entradas con `note` `solo lectura` (D5):** una comparación de substring sobre la nota que STORY-091 ya conserva evita que el archivo de criterios DoD (que el fixture real anota como no editable) pase como "permitido".
- **Registro de archivos nuevos sin confirmación (D4):** una lista extra en el reporte a cambio de no convertir la regla en ruido sistemático en RED.
- **Subsección escrita siempre en rework, aunque vacía (D7):** una línea `Ninguno` a cambio de un anclaje estable para el consumidor futuro.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Rework, RED con 0 archivos de prueba, `fix-directives.md` con fila `requirements-coverage` ⇒ salida contiene `❌ Rework sin evidencia`, no contiene `[GREEN/`; `red-phase-status.json` tiene `rework_evidence: "error"` | Eval `rework-red-sin-tests-requirements-coverage-detiene` (nuevo) | AC-1 |
| 2 | Rework, RED con 0 archivos de prueba, filas solo de `code-quality`/`integration-architecture`/`security`/`DoD-CODE-REVIEW` ⇒ `⚠️ Rework sin tests nuevos` y la salida continúa con `[GREEN/`; `rework_evidence: "warning"` | Eval `rework-red-sin-tests-otras-dimensiones-advierte-y-continua` (nuevo; `input.dimensiones` con las cuatro) | AC-2 |
| 3 | Rework, RED con ≥1 archivo en `files_modified` (sin `files_generated`) ⇒ sin `❌` ni `⚠️ Rework`; `rework_evidence: "ok"` | Eval `rework-red-con-test-modificado-cuenta-como-evidencia` (nuevo) | AC-1, D1 |
| 4 | Rework interactivo, generator GREEN modifica un archivo fuera de `$WHITELIST_PATHS`, respuesta `n` ⇒ `🛑 Ciclo TDD detenido en Fase GREEN`, `story.md` sin cambios, sin `[REFACTOR/` | Eval `rework-interactivo-fuera-de-lista-n-detiene` (nuevo) | AC-3 |
| 5 | Mismo caso con respuesta `s` ⇒ continúa; `implement-report.md` contiene fila `confirmado (interactivo)` | Eval `rework-interactivo-fuera-de-lista-s-continua-y-registra` (nuevo) | AC-3, NFR-2 |
| 6 | Rework `--auto`, archivo fuera de lista ⇒ salida sin `(s/n)`, con `[WARN]`; `implement-report.md` contiene `### Archivos fuera de lista blanca` y `registrado (--auto)` | Eval `rework-auto-fuera-de-lista-registra-sin-confirmar` (nuevo) | AC-4, NFR-3 |
| 7 | Rework sin desvíos ⇒ `implement-report.md` contiene `### Archivos fuera de lista blanca` seguido de `Ninguno` | Eval `rework-sin-desvios-subseccion-ninguno` (nuevo) | AC-4, D7 |
| 8 | Fuera de rework (`$REWORK_MODE = false`) ⇒ sin snapshot, sin subsección, sin `⚠️ Rework`; `rework_evidence: "n/a"` | Eval `sin-rework-reglas-inactivas` (nuevo) | — (no regresión) |
| 9 | `Rutas permitidas` sobre el `$WHITELIST` que STORY-091 parsea de `STORY-090/fix-directives.md` produce 8 rutas y excluye `docs/policies/dod-story.md` | Inspección manual con el fixture real | AC-6, D5 |
| 10 | `Lectura de dimensiones` sobre la tabla parseada de `STORY-090/fix-directives.md` produce `{code-quality, integration-architecture, DoD-CODE-REVIEW}` (⇒ advertencia, no error) | Inspección manual con el fixture real | AC-5, D2 |
| 11 | `grep -n "files_modified\|rework_evidence\|Archivos fuera de lista blanca" skills/story-implement/SKILL.md` devuelve ≥1 resultado por término; `grep -n "solo lectura" skills/story-implement/SKILL.md` ≥1 | Inspección (`grep`) | AC-3..AC-6 |
| 12 | `skill-test-evals` sobre `story-implement` pasa (`verify.eval.required: true`) | `/skill-test-evals evals story-implement` | AC-1..AC-4 |

## Open Questions

- Ninguna que bloquee el diseño. La alineación de nombres con STORY-091 y el consumidor de la subsección se gestionan como CR-001 y CR-002.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: este diseño se apoya en elementos que **solo existen tras implementar STORY-091** (Paso 0c, `$REWORK_MODE`, `$FIX_DIRECTIVES_PATH`, `$REWORK_ROUND`, `$WHITELIST = [{path, note}]`, tabla parseada, bundles con `rework_round`/`fix_directives_path`/`whitelist`, sección `## Ciclo de corrección — ronda {N}`). Los nombres ya están alineados con `STORY-091/design.md` (D1–D3, D5), pero STORY-091 está en `READY-FOR-IMPLEMENT/DONE`, no implementada. Dos puntos de contacto a vigilar: (a) STORY-091 conserva `note` "sin interpretarla" y esta historia la interpreta (`solo lectura`, D5) — coherente con la intención declarada en 091 de dejar la nota "para quien la necesite"; (b) STORY-091 trata `files_modified` como "contrato existente" en prosa; esta historia lo documenta formalmente en `SKILL.md` (D3.4).
- **Documento afectado**: este `design.md`; `skills/story-implement/SKILL.md` (tras STORY-091)
- **Acción requerida**: no iniciar `story-implement-tasks STORY-092` hasta que STORY-091 esté en `IMPLEMENT/DONE` o posterior; al arrancar, verificar con `grep -n "REWORK_MODE\|WHITELIST\|rework_round" skills/story-implement/SKILL.md` que los nombres implementados coinciden con los de las Interfaces de este documento y ajustar si divergen.

### CR-002
- **Tipo**: dependencia
- **Descripción**: NFR-2 afirma que la subsección "Archivos fuera de lista blanca" es "la entrada que `story-code-review` usa en la ronda siguiente", pero modificar `story-code-review` es Non-Goal de esta historia y STORY-089 no incluye esa lectura. Tras 089 → 091 → 092 ningún skill consume la subsección: la revisa el humano o el revisor la lee por su cuenta.
- **Documento afectado**: `story.md` (NFR-2) / backlog de EPIC-19
- **Acción requerida**: crear una historia de seguimiento en EPIC-19 ("`story-code-review` revisa los archivos fuera de lista blanca de la ronda anterior") o reformular NFR-2 como "entrada disponible para la ronda siguiente". Este diseño fija el contrato de la subsección (D7) para que esa historia no necesite cambiarlo.
