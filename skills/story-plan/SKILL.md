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
     │   Al iniciar: story.md → PLAN/IN‑PROGRESS
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
| Inicio del pipeline (siempre, sin condición) | `PLAN` | `IN‑PROGRESS` |
| `story-analyze` finaliza sin ERROREs | `READY-FOR-IMPLEMENT` | `DONE` (gestionado por `story-analyze`) |

La transición `PLAN/IN-PROGRESS` se aplica **incondicionalmente** al iniciar, independientemente del estado previo de la historia. Esto permite re-ejecutar el pipeline sobre historias en cualquier estado.

---

## Entrada

- `story.md` — historia de usuario con criterios de aceptación (obligatorio)

---

## Parámetros

- `{story_id}` — identificador de la historia (ej. `FEAT-057`)
- `{story_path}` — ruta explícita al directorio de la historia (opcional, sobreescribe la resolución por glob)
- `--only-tasks` — ejecutar solo `story-design → story-tasking → story-analyze` (comportamiento anterior al default actual; no genera testcases.md)
- `--only-testcases` — ejecutar solo `story-design → story-testcases → story-analyze` (no genera tasks.md)
- `--skip-analyze` — omitir el paso `story-analyze` en cualquier modo

> ⚠️ `--only-tasks` y `--only-testcases` son mutuamente excluyentes. Si se pasan ambos, el skill reporta error y no ejecuta ningún sub-skill.

---

## Precondiciones

- El directorio de la historia existe bajo `$SPECS_BASE/specs/03-stories/`
- `story.md` existe en el directorio de la historia
- `skill-preflight` retorna estado OK (entorno válido)

---

## Dependencias

- Skills: [`skill-preflight`, `story-design`, `story-tasking`, `story-testcases`, `story-analyze`]
- Herramientas: ninguna externa requerida

---

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
- El estado `PLAN/IN‑PROGRESS` se aplica incondicionalmente al iniciar, sin importar el estado previo
- La idempotencia de cada artefacto es responsabilidad del sub-skill correspondiente
- `--only-tasks` y `--only-testcases` son mutuamente excluyentes
- NO modifique ningún archivo existente en el código fuente (estamos en etapa de plan de especificación, no de implementación)
- NO genere código; estas orquestando el flujo de planificación, no implementando los artefactos técnicos

---

## Flujo de ejecución

### Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight`. Si retorna `✗ Entorno inválido`, detener la ejecución. Usar `$SPECS_BASE` en todas las rutas siguientes.

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
Proporciona el ID (ej. FEAT-057) o la ruta completa al directorio.
```

#### 1d. Resolución del directorio de la historia

1. Ruta explícita `{story_path}` si se proporcionó
2. Glob `$SPECS_BASE/specs/03-stories/{story_id}-*/` — primera coincidencia cuyo nombre comienza con el ID
3. Si no se encuentra: notificar y detener (ver sección Manejo de errores)

#### 1e. Actualizar frontmatter a PLAN/IN‑PROGRESS

Actualizar el frontmatter de `story.md` estableciendo `status: PLAN` / `substatus: IN-PROGRESS`.

Esta actualización es **incondicional**. Si los campos `status`/`substatus` no existen, agregarlos.

Mostrar confirmación de inicio con el pipeline según el modo:

**Modo default:**
```
🚀 Iniciando pipeline de planning para: <story_id>
   Directorio: <ruta_directorio>
   Estado: PLAN/IN‑PROGRESS
   Pasos: story-design → story-tasking → story-testcases → story-analyze
```

**Modo --only-tasks:**
```
🚀 Iniciando pipeline de planning para: <story_id>  [--only-tasks]
   Directorio: <ruta_directorio>
   Estado: PLAN/IN‑PROGRESS
   Pasos: story-design → story-tasking → story-analyze
```

**Modo --only-testcases:**
```
🚀 Iniciando pipeline de planning para: <story_id>  [--only-testcases]
   Directorio: <ruta_directorio>
   Estado: PLAN/IN‑PROGRESS
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

**Si `story-analyze` completa sin inconsistencias:**
- Registrar estado: `✓`
- Mostrar: `[<paso_actual>/<total_pasos>] ✓ story-analyze — analyze.md generado, sin inconsistencias`

**Si `story-analyze` detecta inconsistencias (ERRORs o WARNINGs):**
- Registrar estado: `⚠️`
- Mostrar: `[<paso_actual>/<total_pasos>] ⚠️ story-analyze — inconsistencias detectadas (ver analyze.md)`
- **No detener la cadena** — continuar al resumen final

**Si `story-analyze` falla con error técnico (no puede ejecutarse):**
- Registrar estado: `✗`
- Mostrar: `[<paso_actual>/<total_pasos>] ✗ story-analyze — error técnico`
- Continuar al resumen final (el plan no se bloquea por este fallo)

---

### Paso 6 — Resumen final

Mostrar la tabla de estado acumulada según el modo activo:

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

Leyenda de estados: `✓` completado · `⚠️` con inconsistencias · `✗` fallido · `—` no ejecutado

**Si todos los pasos completaron sin errores ni inconsistencias:**
```
✅ Planning completo

Todos los artefactos están listos. La historia puede pasar a implementación.
Estado de story.md: READY-FOR-IMPLEMENT/DONE ✓
```

**Si `story-analyze` reportó inconsistencias (⚠️):**
```
⚠️ Planning completado — requiere revisión

Se detectaron inconsistencias entre los artefactos. Revisa antes de implementar:
→ <ruta_directorio>/analyze.md

Estado de story.md: PLAN/IN‑PROGRESS (no actualizado — hay ERROREs pendientes)

Puedes ajustar design.md o tasks.md y re-ejecutar /story-analyze cuando estés listo.
```

**Si algún paso falló (✗):**
```
✗ Pipeline interrumpido en: <nombre_del_paso>

Los artefactos generados antes del fallo están disponibles en: <ruta_directorio>
Estado de story.md: PLAN/IN‑PROGRESS (no completado)
Corrige el problema indicado arriba y re-ejecuta /story-plan <story_id>.

Nota: al re-ejecutar, cada sub-skill preguntará si deseas sobreescribir los artefactos existentes.
```

---

### Manejo de errores

| Condición | Mensaje | Acción |
|---|---|---|
| `--only-tasks` y `--only-testcases` simultáneos | `❌ Flags mutuamente excluyentes` | Detener inmediatamente antes de cualquier sub-skill |
| Entorno inválido (preflight) | `✗ Entorno inválido` | Detener inmediatamente. No invocar sub-skills |
| Historia no encontrada | `❌ No se encontró la historia {story_id} bajo $SPECS_BASE/specs/03-stories/` | Detener. Sugerir `/epic-generate-stories` |
| `story.md` ausente | `❌ No se encontró story.md en: <ruta>` | Detener sin invocar sub-skills. Sugerir `/epic-generate-stories` |
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
- Estado del workitem actualizado en `story.md`:
  - `READY-FOR-IMPLEMENT / DONE` si el pipeline completa sin ERROREs
  - `PLAN / IN-PROGRESS` si hay fallos o inconsistencias bloqueantes
