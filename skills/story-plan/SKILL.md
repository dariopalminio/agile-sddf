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

Orquesta el flujo completo de planning de una historia SDD ejecutando los sub-skills en secuencia. Su propósito es **reducir la fricción del planning a un solo comando**, con fail-fast, visibilidad de progreso e idempotencia delegada.

**Modo default (sin flags):** `story-design → story-tasking → story-testcases → story-analyze`

**Qué hace este skill:**
- Invoca los sub-skills en secuencia según el modo activo
- Implementa fail-fast: un fallo en story-design, story-tasking o story-testcases detiene la cadena
- Delega la idempotencia a cada sub-skill (no implementa su propia lógica de "¿sobreescribir?")
- Muestra el progreso paso a paso con estados en tiempo real
- Presenta un resumen final del estado de todos los pasos

**Qué NO hace este skill:**
- Reimplementar la lógica de `story-design`, `story-tasking`, `story-testcases` ni `story-analyze`
- Gestionar conflictos de artefactos por cuenta propia

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
  story-analyze   → analyze.md + story.md → READY-FOR-IMPLEMENT/DONE con verdict APPROVED
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
| Inicio del pipeline (siempre, sin condición) | `PLAN` | `IN-PROGRESS` |
| `story-analyze` emite verdict APPROVED | `READY-FOR-IMPLEMENT` | `DONE` (gestionado por `story-analyze`) |

La transición `PLAN/IN-PROGRESS` se aplica **incondicionalmente** al iniciar, independientemente del estado previo de la historia. Esto permite re-ejecutar el pipeline sobre historias en cualquier estado.

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

> ⚠️ `--only-tasks` y `--only-testcases` son mutuamente excluyentes. Si se pasan ambos, el skill reporta error y no ejecuta ningún sub-skill.

---

## Precondiciones

- El directorio de la historia existe bajo `specs/flow/`
- `story.md` existe en el directorio de la historia
- La raíz de artefactos debe resolverse mediante el contrato local antes de continuar.

---

## Dependencias

- Skills: [`story-design`, `story-tasking`, `story-testcases`, `story-analyze`]
- Herramientas: ninguna externa requerida

---

## DoD aplicable

| Elemento | Valor |
|---|---|
| Etapa | `plan` |
| Archivo | `docs/guardrails/dod-story-plan.md` |
| Override | `sddf.config.yaml › guardrails.dod.story.plan` |
| Enforcement | el campo `enforcement` del frontmatter del archivo: `error` bloquea la transición; `warn` informa los criterios incumplidos sin bloquear |

Resolución (primera coincidencia):

1. `sddf.config.yaml › guardrails.dod.story.plan` → `docs/guardrails/<slug>.md`
2. Convención: `docs/guardrails/dod-story-plan.md`
3. Ninguno existe → emitir `⚠️ DoD de la etapa plan no encontrado (probado: <rutas>) → crea el archivo o ejecuta /memory-system migrate --from=dod-monolithic` y `story-analyze` continúa sin validación DoD PLAN.

Se carga **solo** ese archivo: sus criterios son todas sus líneas `- [ ]`. `story-plan` **no** carga este archivo: lo evalúa `story-analyze` en el Paso 5, que es quien escribe `READY-FOR-IMPLEMENT/DONE`. Se declara aquí para que la etapa del orquestador sea explícita.

## Modos de ejecución

| Modo | Flags | Pipeline | Pasos |
|---|---|---|---|
| Default | *(ninguno)* | design → tasking → testcases → analyze | 4 |
| Solo tareas | `--only-tasks` | design → tasking → analyze | 3 |
| Solo testcases | `--only-testcases` | design → testcases → analyze | 3 |

En cualquier modo, `--skip-analyze` elimina el paso `story-analyze` del pipeline activo.

---

## Restricciones / Reglas

- El skill es un orquestador puro — no reimplementa lógica de los sub-skills
- Fail-fast en story-design, story-tasking y story-testcases: un fallo en cualquiera de estos pasos detiene la cadena; `story-analyze` no es bloqueante
- El estado `PLAN/IN-PROGRESS` se aplica incondicionalmente al iniciar, sin importar el estado previo
- La idempotencia de cada artefacto es responsabilidad del sub-skill correspondiente
- `--only-tasks` y `--only-testcases` son mutuamente excluyentes
- NO modifique ningún archivo existente en el código fuente (estamos en etapa de plan de especificación, no de implementación)
- NO genere código; estas orquestando el flujo de planificación, no implementando los artefactos técnicos

---

## Flujo de ejecución

### Paso 0 — Resolver contexto local

<!-- SDDF-FIXED-LAYOUT: v1 -->

Resuelve `REPO_ROOT` (raíz del repositorio) y usa rutas fijas relativas a él:
work items en `specs/flow/`, templates en `docs/templates/` y DoD en `docs/guardrails/`.
El layout no es configurable (ADR-0016).

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

#### 1c. Resolución del story_id

Si no se proporcionó ningún argumento, preguntar:
```
¿Qué historia deseas planificar?
Proporciona el ID (ej. STORY-057) o la ruta completa al directorio.
```

#### 1d. Resolución del directorio de la historia

1. Ruta explícita `{story_path}` si se proporcionó
2. Glob `specs/flow/{story_id}-*/` — primera coincidencia cuyo nombre comienza con el ID
3. Si no se encuentra: notificar y detener (ver sección Manejo de errores)

#### 1e. Actualizar frontmatter a PLAN/IN-PROGRESS

Actualizar el frontmatter de `story.md` estableciendo `status: PLAN` / `substatus: IN-PROGRESS`.

Esta actualización es **incondicional**. Si los campos `status`/`substatus` no existen, agregarlos.

Mostrar confirmación de inicio con el pipeline según el modo:

**Modo default:**
```
🚀 Iniciando pipeline de planning para: <story_id>
   Directorio: <ruta_directorio>
   Estado: PLAN/IN-PROGRESS
   Pasos: story-design → story-tasking → story-testcases → story-analyze
```

**Modo --only-tasks:**
```
🚀 Iniciando pipeline de planning para: <story_id>  [--only-tasks]
   Directorio: <ruta_directorio>
   Estado: PLAN/IN-PROGRESS
   Pasos: story-design → story-tasking → story-analyze
```

**Modo --only-testcases:**
```
🚀 Iniciando pipeline de planning para: <story_id>  [--only-testcases]
   Directorio: <ruta_directorio>
   Estado: PLAN/IN-PROGRESS
   Pasos: story-design → story-testcases → story-analyze
```

Si `--skip-analyze` está activo en cualquier modo, omitir `story-analyze` del listado de pasos y ajustar `total_pasos` según corresponda.

---

### Paso 2 — Invocar `story-design` (modo Agent)

**Aplica a: todos los modos**

Mostrar: `[1/<total_pasos>] → story-design...`

Invocar el skill `story-design` en modo Agent:
- Directorio de la historia: la ruta resuelta en el Paso 1
- Modo: Agent (automático, sin confirmación interactiva)

**Si `story-design` completa exitosamente:**
- Registrar estado: `✓`
- Mostrar: `[1/<total_pasos>] ✓ story-design — design.md generado`
- Continuar al siguiente paso según el modo

**Si `story-design` falla:**
- Registrar estado: `✗`
- Registrar todos los pasos restantes como `—`
- Ir directamente al resumen final con fallo

---

### Paso 3 — Invocar `story-tasking` (modo Agent)

**Aplica a: modo default y modo --only-tasks**
**Omitir si: modo --only-testcases**

Mostrar: `[2/<total_pasos>] → story-tasking...`

Invocar el skill `story-tasking` en modo Agent:
- Directorio de la historia: la ruta resuelta en el Paso 1
- Modo: Agent (automático, sin confirmación interactiva)

**Si `story-tasking` completa exitosamente:**
- Registrar estado: `✓`
- Mostrar: `[2/<total_pasos>] ✓ story-tasking — tasks.md generado`
- Continuar al siguiente paso

**Si `story-tasking` falla:**
- Registrar estado: `✗`
- Registrar todos los pasos restantes como `—`
- Ir directamente al resumen final con fallo

---

### Paso 4 — Invocar `story-testcases` (modo Agent)

**Aplica a: modo default y modo --only-testcases**
**Omitir si: modo --only-tasks**

En modo default el indicador es `[3/4]`; en modo `--only-testcases` es `[2/3]`.

Mostrar: `[<paso_actual>/<total_pasos>] → story-testcases...`

Invocar el skill `story-testcases` en modo Agent:
- Directorio de la historia: la ruta resuelta en el Paso 1
- Modo: Agent (automático, sin confirmación interactiva)
- Si `tasks.md` existe (generado en Paso 3), el sub-skill lo utilizará automáticamente como enriquecimiento opcional

**Si `story-testcases` completa exitosamente:**
- Registrar estado: `✓`
- Mostrar: `[<paso_actual>/<total_pasos>] ✓ story-testcases — testcases.md generado`
- Continuar al siguiente paso

**Si `story-testcases` falla:**
- Registrar estado: `✗`
- Registrar `story-analyze → —`
- Ir directamente al resumen final con fallo

---

### Paso 5 — Invocar `story-analyze` (modo Agent, no bloqueante)

**Aplica a: todos los modos, salvo que se especifique `--skip-analyze`**

Si se especificó `--skip-analyze`, saltar este paso y registrar estado: `—` (saltado por flag).

El indicador de paso varía según el modo:
- Modo default: `[4/4]`
- Modo `--only-tasks` o `--only-testcases`: `[3/3]`

Mostrar: `[<paso_actual>/<total_pasos>] → story-analyze...`

Invocar el skill `story-analyze` en modo Agent:
- Directorio de la historia: la ruta resuelta en el Paso 1
- Modo: Agent (automático, sin confirmación interactiva)

Tras invocar `story-analyze`, leer `verdict` del frontmatter de `<directorio>/analyze.md` (G-06). Leer la línea `**Veredicto:**` solo para mostrar el motivo, nunca para inferir el valor. Registrar el resultado según esta tabla:

| Resultado | Estado | Línea de progreso |
|---|---|---|
| `verdict: APPROVED` | `✓` | `[<paso_actual>/<total_pasos>] ✓ story-analyze — analyze.md generado (verdict: APPROVED)` |
| `verdict: NEEDS-CHANGES` | `⚠️` | `[<paso_actual>/<total_pasos>] ⚠️ story-analyze — analyze.md generado (verdict: NEEDS-CHANGES)` |
| `verdict` ausente o fuera de `APPROVED \| NEEDS-CHANGES` | `✗` | `[<paso_actual>/<total_pasos>] ✗ story-analyze — analyze.md sin verdict válido` |
| `analyze.md` no generado | `✗` | `[<paso_actual>/<total_pasos>] ✗ story-analyze — error técnico` |

Antes del resumen, si el veredicto no es `APPROVED` y `story.md` quedó en `READY-FOR-IMPLEMENT`, restaurar `status: PLAN` / `substatus: IN-PROGRESS` y emitir `⚠️ story.md estaba en READY-FOR-IMPLEMENT sin verdict APPROVED — restaurado a PLAN/IN-PROGRESS`. `story-plan` nunca escribe `READY-FOR-IMPLEMENT`; solo aplica esta guardia ante un fallo del gate. Continuar al resumen final en todos los casos.

---

### Paso 6 — Resumen final

Mostrar la tabla de estado acumulada según el modo activo:

Con `--skip-analyze`, omitir la fila del gate de coherencia de cualquiera de las tablas siguientes y ajustar el total de pasos al número efectivamente ejecutado.

**Modo default:**
```
─────────────────────────────────────────────────────────
 Planning: <story_id> — <título de la historia>
─────────────────────────────────────────────────────────
 Paso              │ Estado │ Artefacto
─────────────────────────────────────────────────────────
 story-design      │   ✓    │ design.md
 story-tasking     │   ✓    │ tasks.md
 story-testcases   │   ✓    │ testcases.md
 story-analyze     │   ✓    │ analyze.md
─────────────────────────────────────────────────────────
```

**Modo --only-tasks:**
```
─────────────────────────────────────────────────────────
 Planning: <story_id> — <título de la historia>  [--only-tasks]
─────────────────────────────────────────────────────────
 Paso            │ Estado │ Artefacto
─────────────────────────────────────────────────────────
 story-design    │   ✓    │ design.md
 story-tasking   │   ✓    │ tasks.md
 story-analyze   │   ✓    │ analyze.md
─────────────────────────────────────────────────────────
```

**Modo --only-testcases:**
```
─────────────────────────────────────────────────────────
 Planning: <story_id> — <título de la historia>  [--only-testcases]
─────────────────────────────────────────────────────────
 Paso              │ Estado │ Artefacto
─────────────────────────────────────────────────────────
 story-design      │   ✓    │ design.md
 story-testcases   │   ✓    │ testcases.md
 story-analyze     │   ✓    │ analyze.md
─────────────────────────────────────────────────────────
```

Leyenda de estados: `✓` completado (APPROVED) · `⚠️` veredicto NEEDS-CHANGES · `✗` fallido · `—` no ejecutado

Elegir la rama por el veredicto leído en el Paso 5. La línea `Estado de story.md` muestra siempre el `status`/`substatus` leído del archivo tras ese paso.

**Si `verdict: APPROVED`:**
```
✅ Planning completo

Todos los artefactos están listos. La historia puede pasar a implementación.
Veredicto de story-analyze: APPROVED — <motivo>
Estado de story.md: <estado leído, normalmente READY-FOR-IMPLEMENT/DONE ✓>
```

**Si `verdict: NEEDS-CHANGES`:**
```
⚠️ Planning completado — requiere revisión

Veredicto de story-analyze: NEEDS-CHANGES — <motivo>
→ <ruta_directorio>/analyze.md

Estado de story.md: <estado leído, normalmente PLAN/IN-PROGRESS> (veredicto NEEDS-CHANGES)

Corrige el plan con /story-fix-plan <story_id> y vuelve a ejecutar /story-analyze <story_id>.
```

**Si se usó `--skip-analyze` y no hubo fallos:**
```
✅ Planning completo (sin gate de coherencia)

ℹ️ Sin veredicto: se omitió el gate con --skip-analyze
Estado de story.md: <estado leído, normalmente PLAN/IN-PROGRESS>
```

**Si algún paso falló (✗):**
```
✗ Pipeline interrumpido en: <nombre_del_paso>

Los artefactos generados antes del fallo están disponibles en: <ruta_directorio>
Estado de story.md: <estado leído tras el Paso 5> (no completado)
Corrige el problema indicado arriba y re-ejecuta /story-plan <story_id>.

Nota: al re-ejecutar, cada sub-skill preguntará si deseas sobreescribir los artefactos existentes.
```

---

### Manejo de errores

| Condición | Mensaje | Acción |
|---|---|---|
| `--only-tasks` y `--only-testcases` simultáneos | `❌ Flags mutuamente excluyentes` | Detener inmediatamente antes de cualquier sub-skill |
| Historia no encontrada | `❌ No se encontró la historia {story_id} en specs/flow/` | Detener. Sugerir `/epic-generate-stories` |
| `story.md` ausente | `❌ No se encontró story.md en: <ruta>` | Detener sin invocar sub-skills. Sugerir `/epic-generate-stories` |
| Fallo en `story-design` | `[1/<N>] ✗ story-design — FALLO` | Registrar todos los pasos restantes como `—`. Ir a resumen |
| Fallo en `story-tasking` | `[2/<N>] ✗ story-tasking — FALLO` | Registrar pasos restantes como `—`. Ir a resumen |
| Fallo en `story-testcases` | `[<N>/<N>] ✗ story-testcases — FALLO` | Registrar `story-analyze → —`. Ir a resumen |
| Error técnico en `story-analyze` | `[<N>/<N>] ✗ story-analyze — error técnico` | No bloquear. Continuar a resumen |
| `analyze.md` sin `verdict` o con valor no permitido | `[<N>/<N>] ✗ story-analyze — analyze.md sin verdict válido` | Aplicar la guardia de cierre del Paso 5 y mostrar «Pipeline interrumpido» |

---

## Salida

- `{directorio_historia}/design.md` — diseño técnico de la historia (generado por `story-design`)
- `{directorio_historia}/tasks.md` — plan de tareas de implementación (generado por `story-tasking`; omitido con `--only-testcases`)
- `{directorio_historia}/testcases.md` — casos de prueba tipificados y trazables (generado por `story-testcases`; omitido con `--only-tasks`)
- `{directorio_historia}/analyze.md` — reporte de coherencia entre artefactos (generado por `story-analyze`, omitido con `--skip-analyze`)
- Estado del workitem actualizado en `story.md`:
  - `READY-FOR-IMPLEMENT / DONE` solo con `verdict: APPROVED` de `analyze.md`
  - Estado previo, normalmente `PLAN / IN-PROGRESS`, con `NEEDS-CHANGES` o `--skip-analyze`
  - `PLAN / IN-PROGRESS` restaurado por la guardia si falta un veredicto válido y la historia quedó en `READY-FOR-IMPLEMENT`
