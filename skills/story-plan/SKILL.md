---
name: story-plan
description: >-
  Orquesta el pipeline de planning SDD (story-design → story-tasking → story-testcases → story-analyze) en un solo comando.
  Usar para planificar una historia completa o prepararla para implementar.
  Invocar para "planificar historia", "pipeline de planning",
  "preparar historia para implementar", "story-plan" o "orquestar planning".
triggers:
  - "story-plan"
  - "planificar historia"
  - "pipeline de planning"
  - "preparar historia para implementar"
  - "orquestar planning"
  - "generar design tasks analyze"
---

# Skill: `/story-plan`

## Objetivo

Orquesta el flujo completo de planning de una historia SDD ejecutando los sub-skills en secuencia. Su propósito es **reducir la fricción del planning a un solo comando**, con fail-fast, visibilidad de progreso, una única decisión inicial sobre artefactos existentes y un hilo principal liviano: cada paso corre en su propio subagente cuando el runtime lo admite.

**Modo default (sin flags):** `story-design → story-tasking → story-testcases → story-analyze`

**Qué hace este skill:**
- Invoca los sub-skills en secuencia según el modo activo, cada uno en un subagente aislado (o inline si el runtime no admite subagentes o se pasa `--inline`)
- Implementa fail-fast: un fallo en story-design, story-tasking o story-testcases detiene la cadena
- Pregunta **una sola vez**, al inicio, qué hacer con los artefactos existentes; la decisión la ejecutan los workers con `--force` / `--skip-existing`
- Decide el progreso y el resumen final leyendo solo los archivos de resultado `.tmp/story-plan/<STORY-ID>/<paso>.result.md`
- Muestra el progreso paso a paso con estados en tiempo real
- Presenta un resumen final del estado de todos los pasos

**Qué NO hace este skill:**
- Reimplementar la lógica de `story-design`, `story-tasking`, `story-testcases` ni `story-analyze`
- Omitir pasos por su cuenta cuando un artefacto existe: lo resuelve el worker con el flag recibido

### Posicionamiento

```
[story.md: SPECIFY/DONE]  ← precondición implícita (viene de story-specify)
     ↓
story-plan   → Entry point: orquesta design → tasking → testcases → analyze  ← aquí
     │   Al iniciar: story.md → PLAN/IN-PROGRESS
     ↓
  story-design    → design.md
  story-tasking   → tasks.md            (omitido con --only-testcases)
  story-testcases → testcases.md        (omitido con --only-tasks)
  story-analyze   → analyze.md + story.md → READY-FOR-IMPLEMENT/DONE (si sin ERROREs)
     ↓
[story.md: READY-FOR-IMPLEMENT/DONE]   → listo para story-implement-tasks
──────────────────────────────────────────────────────────────
story.md      → What: requisitos, criterios de aceptación, comportamiento esperado
design.md     → How: arquitectura, componentes, interfaces, decisiones técnicas
tasks.md      → When: tareas de implementación, orden, seguimiento
testcases.md  → Test: casos de prueba tipificados y trazables a los ACs
analyze.md    → Check: coherencia entre los tres artefactos
```

### Ciclo de vida de estados

| Evento | status | substatus |
|---|---|---|
| Inicio del pipeline (siempre, tras la decisión inicial) | `PLAN` | `IN-PROGRESS` |
| `story-analyze` finaliza sin ERROREs | `READY-FOR-IMPLEMENT` | `DONE` (gestionado por `story-analyze`) |

La transición `PLAN/IN-PROGRESS` se aplica **incondicionalmente** al iniciar, independientemente del estado previo de la historia. Esto permite re-ejecutar el pipeline sobre historias en cualquier estado. Solo se omite si el usuario cancela en la pregunta inicial (Paso 1e).

---

## Entrada

- `story.md` — historia de usuario con criterios de aceptación (obligatorio)

---

## Parámetros

- `{story_id}` — identificador de la historia (ej. `STORY-057`)
- `{story_path}` — ruta explícita al directorio de la historia (opcional, sobreescribe la resolución por glob)
- `--only-tasks` — ejecutar solo `story-design → story-tasking → story-analyze` (comportamiento anterior al default actual; no genera testcases.md)
- `--only-testcases` — ejecutar solo `story-design → story-testcases → story-analyze` (no genera tasks.md)
- `--skip-analyze` — omitir el paso `story-analyze` en cualquier modo
- `--inline` — forzar la composición inline de los workers en la sesión principal aunque el runtime admita subagentes (combinable con los demás flags; útil para comparar consumo o como vía de escape si el lanzamiento de subagentes falla)

> ⚠️ `--only-tasks` y `--only-testcases` son mutuamente excluyentes. Si se pasan ambos, el skill reporta error y no ejecuta ningún sub-skill.

---

## Precondiciones

- El directorio de la historia existe bajo `$SPECS_BASE/specs/03-stories/`
- `story.md` existe en el directorio de la historia
- La raíz de artefactos debe resolverse mediante el contrato local antes de continuar.
- Los `SKILL.md` de los workers del modo existen junto al de `story-plan` (misma instalación)

---

## Dependencias

- Skills worker: [`story-design`, `story-tasking`, `story-testcases`, `story-analyze`]
- Herramientas: la herramienta de subagentes del runtime, si existe (en Claude Code, `Agent` con `subagent_type: general-purpose`); sin ella, composición inline

---

## DoD aplicable

| Elemento | Valor |
|---|---|
| Etapa | `plan` |
| Archivo | `$SPECS_BASE/guardrails/dod-story-plan.md` (en este repositorio, `docs/guardrails/dod-story-plan.md`) |
| Override | `sddf.config.yaml › guardrails.dod.story.plan` |
| Enforcement | el campo `enforcement` del frontmatter del archivo: `error` bloquea la transición; `warn` informa los criterios incumplidos sin bloquear |

Resolución (primera coincidencia):

1. `sddf.config.yaml › guardrails.dod.story.plan` → `$SPECS_BASE/guardrails/<slug>.md`
2. Convención: `$SPECS_BASE/guardrails/dod-story-plan.md`
3. Ninguno existe → emitir `⚠️ DoD de la etapa plan no encontrado (probado: <rutas>) → crea el archivo o ejecuta /memory-system migrate --from=dod-monolithic` y `story-analyze` continúa sin validación DoD PLAN.

Se carga **solo** ese archivo: sus criterios son todas sus líneas `- [ ]`. `story-plan` **no** carga este archivo: lo evalúa `story-analyze` en el Paso 5, que es quien escribe `READY-FOR-IMPLEMENT/DONE`. Se declara aquí para que la etapa del orquestador sea explícita.

## Modos de ejecución

| Modo | Flags | Pipeline | Pasos |
|---|---|---|---|
| Default | *(ninguno)* | design → tasking → testcases → analyze | 4 |
| Solo tareas | `--only-tasks` | design → tasking → analyze | 3 |
| Solo testcases | `--only-testcases` | design → testcases → analyze | 3 |

En cualquier modo, `--skip-analyze` elimina el paso `story-analyze` del pipeline activo.

Independientemente del modo, cada paso se ejecuta en **subagentes** (un contexto aislado por paso) o **inline** (misma sesión), según el Paso 1f. Los artefactos, la pregunta inicial, los mensajes de progreso y el resumen son iguales en ambos.

---

## Restricciones / Reglas

- El skill es un orquestador puro — no reimplementa lógica de los sub-skills
- Fail-fast en story-design, story-tasking y story-testcases: un fallo en cualquiera de estos pasos detiene la cadena; `story-analyze` no es bloqueante
- El estado `PLAN/IN-PROGRESS` se aplica incondicionalmente al iniciar, sin importar el estado previo (salvo cancelación en el Paso 1e)
- Una única decisión inicial sobre artefactos existentes, ejecutada por los workers con `--force` / `--skip-existing`; cada worker recibe siempre uno de los dos flags, así que ningún worker vuelve a preguntar
- Un solo salto de delegación: ningún subagente lanza otro subagente ni invoca skills orquestadores; los 4 sub-skills se usan como skills worker (`docs/guides/best-practices-for-skills.md`, sección "Subagentes y skills")
- El prompt de cada subagente contiene solo la ruta del `SKILL.md` del worker y el bloque de contexto resuelto, nunca el contexto conversacional de la sesión
- El fail-fast y el resumen final se deciden leyendo solo `.tmp/story-plan/<STORY-ID>/<paso>.result.md`
- `--only-tasks` y `--only-testcases` son mutuamente excluyentes
- NO modifique ningún archivo existente en el código fuente (estamos en etapa de plan de especificación, no de implementación)
- NO genere código; estas orquestando el flujo de planificación, no implementando los artefactos técnicos

---

## Flujo de ejecución

### Paso 0 — Resolver contexto local

<!-- SDDF-ROOT-RESOLUTION: v1 -->

Resuelve una sola vez `REPO_ROOT` y el contexto local antes de leer o escribir artefactos:

1. Si `SDDF_ROOT` está definida, exige un valor no vacío que apunte a un directorio accesible; úsalo como `SPECS_BASE` y registra `ROOT_SOURCE = SDDF_ROOT`. Si no es utilizable, informa la fuente y el valor y detén el workflow antes de cualquier escritura.
2. Solo si `SDDF_ROOT` no está definida, lee `<REPO_ROOT>/sddf.config.yaml`. Si su clave superior `root` existe, debe ser un escalar no vacío que resuelva a un directorio accesible (las rutas relativas se anclan en `REPO_ROOT`); úsalo como `SPECS_BASE` y registra `ROOT_SOURCE = sddf.config.yaml`. Una configuración o raíz explícita inválida detiene el workflow sin fallback ni escrituras.
3. Si no existe ninguna fuente explícita, usa `docs` relativo a `REPO_ROOT` y registra `ROOT_SOURCE = default`. Conserva `SPECS_BASE` y `ROOT_SOURCE` durante toda la invocación.
4. Resuelve `CLI_ROOT` independientemente y solo cuando el workflow necesite skills, agentes o comandos del runtime; nunca lo derives de `SPECS_BASE`.

El diagnóstico de entorno se solicita explícitamente con `/skill-preflight`; este workflow no lo invoca en su hot path.


### Paso 1 — Resolver parámetros de entrada

#### 1a. Validar flags mutuamente excluyentes

Si se proporcionaron `--only-tasks` y `--only-testcases` simultáneamente:
```
❌ Los flags --only-tasks y --only-testcases son mutuamente excluyentes.
   Usa solo uno de los dos, o ninguno para ejecutar el pipeline completo.
```
Detener inmediatamente. No invocar ningún sub-skill.

#### 1b. Determinar modo y número total de pasos

- `--only-tasks` activo → modo = "only-tasks", total_pasos = 3 (o 2 con `--skip-analyze`)
- `--only-testcases` activo → modo = "only-testcases", total_pasos = 3 (o 2 con `--skip-analyze`)
- ninguno activo → modo = "default", total_pasos = 4 (o 3 con `--skip-analyze`)

Los pasos del modo, en orden, con su nombre corto (usado en los archivos de resultado):

| Worker | Paso corto | Artefacto | Presente en |
|---|---|---|---|
| `story-design` | `design` | `design.md` | todos los modos |
| `story-tasking` | `tasking` | `tasks.md` | default, `--only-tasks` |
| `story-testcases` | `testcases` | `testcases.md` | default, `--only-testcases` |
| `story-analyze` | `analyze` | `analyze.md` | todos, salvo `--skip-analyze` |

#### 1c. Resolución del story_id

Si no se proporcionó ningún argumento, preguntar:
```
¿Qué historia deseas planificar?
Proporciona el ID (ej. STORY-057) o la ruta completa al directorio.
```

#### 1d. Resolución del directorio de la historia

1. Ruta explícita `{story_path}` si se proporcionó
2. Glob `$SPECS_BASE/specs/03-stories/{story_id}-*/` — primera coincidencia cuyo nombre comienza con el ID
3. Si no se encuentra: notificar y detener (ver sección Manejo de errores)

#### 1e. Workers y artefactos existentes (decisión única)

Este paso ocurre **antes** de cualquier escritura: si el usuario cancela, ningún archivo cambia.

1. **Workers presentes.** Para cada worker del modo, comprobar que existe `<WORKER_SKILL_PATH>` = `<directorio del SKILL.md de story-plan en ejecución>/../<worker>/SKILL.md` (el instalador copia los skills como hermanos, así que el worker sale de la misma instalación que el orquestador). Si falta uno:
   ```
   ❌ No se encontró el skill worker <worker> en: <ruta>
   ```
   Detener sin escribir ningún archivo.

2. **Instantánea.** `artefactos_del_modo` = los artefactos de los pasos del modo (tabla de 1b). `existentes` = los de esa lista presentes **ahora** en el directorio de la historia. La instantánea no se recalcula después: con "regenerar todos", `tasks.md` se regenera aunque `design.md` se acabe de escribir.

3. **Decisión.**
   - Si `existentes` está vacío: `$OVERWRITE = nuevo`, sin pregunta.
   - Si no, hacer **una sola pregunta** (con la herramienta de preguntas del runtime o como texto):
     ```
     Artefactos de planning existentes en <ruta_directorio>: <existentes separados por comas>
     ¿Qué deseas hacer?
       (t) Regenerar todos — reemplazar los artefactos existentes
       (f) Solo los que faltan — conservar los existentes y generar el resto
       (c) Cancelar — no ejecutar el pipeline
     ```
     - `t` → `$OVERWRITE = todos`
     - `f` → `$OVERWRITE = faltantes`
     - `c` → mostrar `⏹ Pipeline cancelado — ningún archivo modificado` y terminar. No se actualiza `story.md`, no se toca `.tmp/` y no se lanza ningún subagente.

4. **Flag por paso.** Cada worker recibe siempre exactamente uno, para que ninguno pregunte:

   | `$OVERWRITE` | Artefacto del paso en `existentes` | Flag |
   |---|---|---|
   | `nuevo` / `todos` | — | `--force` |
   | `faltantes` | sí | `--skip-existing` |
   | `faltantes` | no | `--force` |

   Si se hizo la pregunta, mostrar la decisión aplicada, con los pasos del modo en orden:
   ```
   Flags por paso: design <flag> · tasking <flag> · testcases <flag> · analyze <flag>
   ```
   (ej. con `(t)`: `Flags por paso: design --force · tasking --force · testcases --force · analyze --force`). Si no hubo pregunta (`$OVERWRITE = nuevo`), no mostrar esta línea.

#### 1f. Modo de ejecución

Determinar `$EXEC_MODE` una sola vez (primera condición que se cumpla):

| Condición | `$EXEC_MODE` | Línea del banner |
|---|---|---|
| Se pasó `--inline` | `inline` | `   Ejecución: inline (--inline)` |
| La sesión no dispone de una herramienta para lanzar subagentes (en Claude Code, `Agent`) | `inline` | `   Ejecución: inline (el runtime no admite subagentes)` |
| En otro caso | `subagentes` | `   Ejecución: subagentes (un contexto aislado por paso)` |

La capacidad se observa en la sesión en curso; no se deduce de `config/runtimes.json` (ese archivo describe dónde se instalan los agentes Markdown, no si la sesión puede lanzar un subagente).

#### 1g. Actualizar frontmatter a PLAN/IN-PROGRESS y preparar resultados

Actualizar el frontmatter de `story.md` estableciendo `status: PLAN` / `substatus: IN-PROGRESS`.

Esta actualización es **incondicional** (una vez superada la decisión del Paso 1e). Si los campos `status`/`substatus` no existen, agregarlos.

Borrar y recrear `<REPO_ROOT>/.tmp/story-plan/<story_id>/` para no leer resultados de una corrida anterior. Si el directorio no se puede crear, informar el error técnico y detener antes del primer paso.

Mostrar confirmación de inicio con el pipeline según el modo:

**Modo default:**
```
🚀 Iniciando pipeline de planning para: <story_id>
   Directorio: <ruta_directorio>
   Estado: PLAN/IN-PROGRESS
   Pasos: story-design → story-tasking → story-testcases → story-analyze
   Ejecución: <línea del Paso 1f>
```

**Modo --only-tasks:**
```
🚀 Iniciando pipeline de planning para: <story_id>  [--only-tasks]
   Directorio: <ruta_directorio>
   Estado: PLAN/IN-PROGRESS
   Pasos: story-design → story-tasking → story-analyze
   Ejecución: <línea del Paso 1f>
```

**Modo --only-testcases:**
```
🚀 Iniciando pipeline de planning para: <story_id>  [--only-testcases]
   Directorio: <ruta_directorio>
   Estado: PLAN/IN-PROGRESS
   Pasos: story-design → story-testcases → story-analyze
   Ejecución: <línea del Paso 1f>
```

Si `--skip-analyze` está activo en cualquier modo, omitir `story-analyze` del listado de pasos y ajustar `total_pasos` según corresponda.

---

### Contrato de delegación por paso

Los Pasos 2-5 ejecutan su worker con este contrato. `<paso>` es el nombre corto de la tabla de 1b y `<flag>` el que le asignó el Paso 1e.

#### Ejecución en `$EXEC_MODE = subagentes`

Lanzar un subagente nuevo (en Claude Code, `Agent` con `subagent_type: general-purpose`; en otros runtimes, su mecanismo equivalente) cuyo prompt es **exactamente** este bloque, sin agregar el contexto conversacional de la sesión ni el contenido del `SKILL.md`:

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

Si el lanzamiento del subagente falla (error de la herramienta), el orquestador escribe él mismo `<paso>.result.md` con `STATUS: FAIL` y la línea 3 `fallo al lanzar el subagente`.

#### Ejecución en `$EXEC_MODE = inline`

Componer el worker en la sesión principal, como skill worker en modo Agent, con los mismos argumentos (`<STORY-NNN> <flag>`) y el mismo contexto resuelto. Inmediatamente después, el **orquestador** escribe `<paso>.result.md` con el formato de abajo, de modo que el fail-fast y el resumen tienen una sola lógica en ambos modos.

#### Archivo de resultado `.tmp/story-plan/<STORY-ID>/<paso>.result.md`

| Línea | Contenido |
|---|---|
| 1 | Exactamente `STATUS: OK`, `STATUS: WARN` o `STATUS: FAIL` |
| 2 | `<artefacto> <generado \| regenerado \| sin cambios (--skip-existing) \| no generado>` |
| 3-6 | Opcional, como máximo 4 líneas: motivo del FAIL, CRs, conteos. En `analyze` la línea 3 es obligatoria: `ERRORs: <n> · WARNINGs: <m> · story.md: <status>/<substatus>` |

Semántica por paso:

| Paso | OK | WARN | FAIL |
|---|---|---|---|
| design | generado o conservado, sin CRs | generado con CRs | `design.md` no quedó escrito |
| tasking / testcases | generado o conservado | generado con advertencias del worker | artefacto no escrito |
| analyze | sin ERRORs ni WARNINGs | con inconsistencias, **o** conservado con `--skip-existing` (no re-auditó: `story.md` no pasa a `READY-FOR-IMPLEMENT`) | error técnico |

**Lectura por el orquestador:** leer solo ese archivo. Si está ausente, vacío o su primera línea no es una de las tres válidas, tratarlo como `STATUS: FAIL` con línea 2 `<artefacto> no generado` y línea 3 `resultado ausente o ilegible`.

Mapeo al estado del paso: `OK → ✓` · `WARN → ⚠️` · `FAIL → ✗` · paso no lanzado `→ —`.

---

### Paso 2 — Ejecutar `story-design`

**Aplica a: todos los modos**

Mostrar: `[1/<total_pasos>] → story-design...`

Ejecutar `story-design` según el contrato de delegación, con el flag del Paso 1e, y leer la línea 1 de `design.result.md`:

- **`STATUS: OK`** → estado `✓`; mostrar `[1/<total_pasos>] ✓ story-design — <línea 2>` (ej. `design.md generado`); continuar
- **`STATUS: WARN`** → estado `⚠️`; mostrar `[1/<total_pasos>] ⚠️ story-design — <línea 2> (<línea 3>)`; continuar
- **`STATUS: FAIL`** → estado `✗`; mostrar `[1/<total_pasos>] ✗ story-design — FALLO (<línea 3>)`; registrar todos los pasos restantes como `—` y no lanzar ninguno; ir directamente al resumen final

---

### Paso 3 — Ejecutar `story-tasking`

**Aplica a: modo default y modo --only-tasks**
**Omitir si: modo --only-testcases**

Mostrar: `[2/<total_pasos>] → story-tasking...`

Ejecutar `story-tasking` según el contrato de delegación, con el flag del Paso 1e, y leer la línea 1 de `tasking.result.md`:

- **`STATUS: OK`** → estado `✓`; mostrar `[2/<total_pasos>] ✓ story-tasking — <línea 2>` (ej. `tasks.md generado`); continuar
- **`STATUS: WARN`** → estado `⚠️`; mostrar `[2/<total_pasos>] ⚠️ story-tasking — <línea 2> (<línea 3>)`; continuar
- **`STATUS: FAIL`** → estado `✗`; mostrar `[2/<total_pasos>] ✗ story-tasking — FALLO (<línea 3>)`; registrar todos los pasos restantes como `—` y no lanzar ninguno; ir directamente al resumen final

---

### Paso 4 — Ejecutar `story-testcases`

**Aplica a: modo default y modo --only-testcases**
**Omitir si: modo --only-tasks**

En modo default el indicador es `[3/4]`; en modo `--only-testcases` es `[2/3]`.

Mostrar: `[<paso_actual>/<total_pasos>] → story-testcases...`

Ejecutar `story-testcases` según el contrato de delegación, con el flag del Paso 1e. Si `tasks.md` existe (generado en el Paso 3), el worker lo utiliza como enriquecimiento opcional. Leer la línea 1 de `testcases.result.md`:

- **`STATUS: OK`** → estado `✓`; mostrar `[<paso_actual>/<total_pasos>] ✓ story-testcases — <línea 2>` (ej. `testcases.md generado`); continuar
- **`STATUS: WARN`** → estado `⚠️`; mostrar `[<paso_actual>/<total_pasos>] ⚠️ story-testcases — <línea 2> (<línea 3>)`; continuar
- **`STATUS: FAIL`** → estado `✗`; mostrar `[<paso_actual>/<total_pasos>] ✗ story-testcases — FALLO (<línea 3>)`; registrar `story-analyze → —` y no lanzarlo; ir directamente al resumen final

---

### Paso 5 — Ejecutar `story-analyze` (no bloqueante)

**Aplica a: todos los modos, salvo que se especifique `--skip-analyze`**

Si se especificó `--skip-analyze`, saltar este paso y registrar estado: `—` (saltado por flag).

El indicador de paso varía según el modo:
- Modo default: `[4/4]`
- Modo `--only-tasks` o `--only-testcases`: `[3/3]`

Mostrar: `[<paso_actual>/<total_pasos>] → story-analyze...`

Ejecutar `story-analyze` según el contrato de delegación, con el flag del Paso 1e, y leer `analyze.result.md`:

- **`STATUS: OK`** → estado `✓`; mostrar `[<paso_actual>/<total_pasos>] ✓ story-analyze — <línea 2>, sin inconsistencias` (ej. `analyze.md generado, sin inconsistencias`)
- **`STATUS: WARN` con inconsistencias** → estado `⚠️`; mostrar `[<paso_actual>/<total_pasos>] ⚠️ story-analyze — inconsistencias detectadas (ver analyze.md)`. **No detener la cadena** — continuar al resumen final
- **`STATUS: WARN` por `--skip-existing`** → estado `⚠️`; mostrar `[<paso_actual>/<total_pasos>] ⚠️ story-analyze — analyze.md sin cambios (--skip-existing); la historia no se re-auditó`. Sugerir `/story-analyze <story_id> --force` en el resumen
- **`STATUS: FAIL`** → estado `✗`; mostrar `[<paso_actual>/<total_pasos>] ✗ story-analyze — error técnico`. Continuar al resumen final (el plan no se bloquea por este fallo)

---

### Paso 6 — Resumen final

Construir el resumen **solo** desde los archivos de resultado de los pasos lanzados (sin releer artefactos ni el contexto de los workers):

- Columna **Estado**: el mapeo de la línea 1 (`✓`, `⚠️`, `✗`) o `—` si el paso no se lanzó.
- Columna **Artefacto**: la línea 2 del archivo de resultado (ej. `design.md generado`, `tasks.md sin cambios (--skip-existing)`), o el nombre del artefacto si el paso no se lanzó.
- **Estado de story.md**: el que informa la línea 3 de `analyze.result.md`; si analyze no corrió (fallo previo o `--skip-analyze`), `PLAN/IN-PROGRESS`.

Mostrar la tabla de estado acumulada según el modo activo:

**Modo default:**
```
─────────────────────────────────────────────────────────
 Planning: <story_id> — <título de la historia>
─────────────────────────────────────────────────────────
 Paso              │ Estado │ Artefacto
─────────────────────────────────────────────────────────
 story-design      │   ✓    │ design.md generado
 story-tasking     │   ✓    │ tasks.md generado
 story-testcases   │   ✓    │ testcases.md generado
 story-analyze     │   ✓    │ analyze.md generado
─────────────────────────────────────────────────────────
 Resultados leídos: .tmp/story-plan/<story_id>/design.result.md · tasking.result.md · testcases.result.md · analyze.result.md
```

**Modo --only-tasks:**
```
─────────────────────────────────────────────────────────
 Planning: <story_id> — <título de la historia>  [--only-tasks]
─────────────────────────────────────────────────────────
 Paso            │ Estado │ Artefacto
─────────────────────────────────────────────────────────
 story-design    │   ✓    │ design.md generado
 story-tasking   │   ✓    │ tasks.md generado
 story-analyze   │   ✓    │ analyze.md generado
─────────────────────────────────────────────────────────
 Resultados leídos: .tmp/story-plan/<story_id>/design.result.md · tasking.result.md · analyze.result.md
```

**Modo --only-testcases:**
```
─────────────────────────────────────────────────────────
 Planning: <story_id> — <título de la historia>  [--only-testcases]
─────────────────────────────────────────────────────────
 Paso              │ Estado │ Artefacto
─────────────────────────────────────────────────────────
 story-design      │   ✓    │ design.md generado
 story-testcases   │   ✓    │ testcases.md generado
 story-analyze     │   ✓    │ analyze.md generado
─────────────────────────────────────────────────────────
 Resultados leídos: .tmp/story-plan/<story_id>/design.result.md · testcases.result.md · analyze.result.md
```

La línea `Resultados leídos:` lista, en orden, solo los archivos de los pasos que se lanzaron (la primera ruta completa, las siguientes por nombre). Con `--skip-analyze` no se lista `analyze.result.md` ni la fila de `story-analyze`.

Leyenda de estados: `✓` completado · `⚠️` con advertencias o inconsistencias · `✗` fallido · `—` no ejecutado

Mensaje final (primera condición que se cumpla):

**Si algún paso falló (✗):**
```
✗ Pipeline interrumpido en: <nombre_del_paso>

Los artefactos generados antes del fallo están disponibles en: <ruta_directorio>
Estado de story.md: PLAN/IN-PROGRESS (no completado)
Corrige el problema indicado arriba y re-ejecuta /story-plan <story_id>.

Nota: al re-ejecutar, story-plan preguntará una sola vez qué hacer con los artefactos existentes.
```
Si el fallo fue del lanzamiento de un subagente (`fallo al lanzar el subagente`), agregar: `Sugerencia: re-ejecuta con /story-plan <story_id> --inline`.

**Si algún paso terminó con advertencias (⚠️):**
```
⚠️ Planning completado — requiere revisión

Revisa los pasos marcados con ⚠️ antes de implementar:
→ <ruta_directorio>/analyze.md

Estado de story.md: <estado de la línea 3 de analyze.result.md>

Puedes ajustar design.md o tasks.md y re-ejecutar /story-analyze cuando estés listo.
```

**Si todos los pasos completaron sin errores ni inconsistencias:**
```
✅ Planning completo

Todos los artefactos están listos. La historia puede pasar a implementación.
Estado de story.md: READY-FOR-IMPLEMENT/DONE ✓
```
Con `--skip-analyze`, sustituir la última línea por `Estado de story.md: PLAN/IN-PROGRESS (sin auditoría de coherencia)`.

---

### Manejo de errores

| Condición | Mensaje | Acción |
|---|---|---|
| `--only-tasks` y `--only-testcases` simultáneos | `❌ Flags mutuamente excluyentes` | Detener inmediatamente antes de cualquier sub-skill |
| Entorno inválido (preflight) | `✗ Entorno inválido` | Detener inmediatamente. No invocar sub-skills |
| Historia no encontrada | `❌ No se encontró la historia {story_id} bajo $SPECS_BASE/specs/03-stories/` | Detener. Sugerir `/epic-generate-stories` |
| `story.md` ausente | `❌ No se encontró story.md en: <ruta>` | Detener sin invocar sub-skills. Sugerir `/epic-generate-stories` |
| Falta el `SKILL.md` de un worker | `❌ No se encontró el skill worker <worker> en: <ruta>` | Detener antes de la pregunta inicial, sin escribir archivos |
| Usuario cancela en la pregunta inicial | `⏹ Pipeline cancelado — ningún archivo modificado` | Terminar sin actualizar `story.md`, sin tocar `.tmp/` y sin lanzar subagentes |
| `.tmp/story-plan/<story_id>/` no se puede crear | error técnico | Detener antes del primer paso (`story.md` ya en `PLAN/IN-PROGRESS`) |
| Resultado ausente, vacío o con línea 1 inválida | `resultado ausente o ilegible` | Tratar como `STATUS: FAIL` del paso; fail-fast según el paso |
| Fallo al lanzar un subagente | `fallo al lanzar el subagente` | `STATUS: FAIL` del paso; el resumen sugiere `--inline` |
| Fallo en `story-design` | `[1/<N>] ✗ story-design — FALLO` | Registrar todos los pasos restantes como `—`. Ir a resumen |
| Fallo en `story-tasking` | `[2/<N>] ✗ story-tasking — FALLO` | Registrar pasos restantes como `—`. Ir a resumen |
| Fallo en `story-testcases` | `[<N>/<N>] ✗ story-testcases — FALLO` | Registrar `story-analyze → —`. Ir a resumen |
| Error técnico en `story-analyze` | `[<N>/<N>] ✗ story-analyze — error técnico` | No bloquear. Continuar a resumen |

---

## Salida

- `{directorio_historia}/design.md` — diseño técnico de la historia (generado por `story-design`)
- `{directorio_historia}/tasks.md` — plan de tareas de implementación (generado por `story-tasking`; omitido con `--only-testcases`)
- `{directorio_historia}/testcases.md` — casos de prueba tipificados y trazables (generado por `story-testcases`; omitido con `--only-tasks`)
- `{directorio_historia}/analyze.md` — reporte de coherencia entre artefactos (generado por `story-analyze`, omitido con `--skip-analyze`)
- `.tmp/story-plan/<STORY-ID>/<paso>.result.md` — resultado breve de cada paso lanzado (temporal, no versionado; se recrea en cada corrida)
- Estado del workitem actualizado en `story.md`:
  - `READY-FOR-IMPLEMENT / DONE` si el pipeline completa sin ERROREs
  - `PLAN / IN-PROGRESS` si hay fallos o inconsistencias bloqueantes
  - Sin cambios si el usuario cancela en la pregunta inicial
