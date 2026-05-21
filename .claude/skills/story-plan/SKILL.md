---
name: story-plan
description: >-
  Orquesta el flujo completo de planning de una historia SDD ejecutando story-design → story-tasking → story-analyze
  en secuencia con un solo comando. Usar siempre que el usuario quiera planificar una historia completa,
  generar design.md + tasks.md + analyze.md en un solo paso, ejecutar el pipeline de planning,
  o necesite el punto de entrada único al flujo de planning antes de implementar.
  Invocar también cuando el usuario mencione "planificar historia", "pipeline de planning",
  "preparar historia para implementar", "story-plan", "orquestar planning" o equivalentes.
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

Orquesta el flujo completo de planning de una historia SDD ejecutando los tres sub-skills en secuencia: `story-design → story-tasking → story-analyze`. Su propósito es **reducir la fricción del planning a un solo comando**, con fail-fast, visibilidad de progreso e idempotencia delegada.

**Qué hace este skill:**
- Invoca `story-design`, `story-tasking` y `story-analyze` en secuencia
- Implementa fail-fast: un fallo en story-design o story-tasking detiene la cadena
- Delega la idempotencia a cada sub-skill (no implementa su propia lógica de "¿sobreescribir?")
- Muestra el progreso paso a paso con estados en tiempo real
- Presenta un resumen final del estado de los tres pasos

**Qué NO hace este skill:**
- Reimplementar la lógica de `story-design`, `story-tasking` ni `story-analyze`
- Permitir ejecución parcial sin design o tasking (solo se puede omitir analyze con `--skip-analyze`)
- Gestionar conflictos de artefactos por cuenta propia

### Posicionamiento

```
[story.md: SPECIFYING/DONE]  ← precondición implícita (viene de story-refine)
     ↓
story-plan   → Entry point: orquesta design → tasking → analyze  ← aquí
     │   Al iniciar: story.md → PLANNING/IN‑PROGRESS
     ↓
  story-design  → design.md
  story-tasking → tasks.md
  story-analyze → analyze.md + story.md → READY-FOR-IMPLEMENT/DONE (si sin ERROREs)
     ↓
[story.md: READY-FOR-IMPLEMENT/DONE]   → listo para story-implement
──────────────────────────────────────────────────────────────
story.md     → What: requisitos, criterios de aceptación, comportamiento esperado
design.md    → How: arquitectura, componentes, interfaces, decisiones técnicas
tasks.md     → When: tareas de implementación, orden, seguimiento
analyze.md   → Check: coherencia entre los tres artefactos
```

### Ciclo de vida de estados

| Evento | status | substatus |
|---|---|---|
| Inicio del pipeline (siempre, sin condición) | `PLANNING` | `IN‑PROGRESS` |
| `story-analyze` finaliza sin ERROREs | `READY-FOR-IMPLEMENT` | `DONE` (gestionado por `story-analyze`) |

La transición `PLANNING/IN‑PROGRESS` se aplica **incondicionalmente** al iniciar, independientemente del estado previo de la historia. Esto permite re-ejecutar el pipeline sobre historias en cualquier estado.

---

## Entrada

- `story.md` — historia de usuario con criterios de aceptación (obligatorio)

---

## Parámetros

- `{story_id}` — identificador de la historia (ej. `FEAT-057`)
- `{story_path}` — ruta explícita al directorio de la historia (opcional, sobreescribe la resolución por glob)
- `--skip-analyze` — omitir el paso `story-analyze` (útil si solo se quiere design + tasks)

---

## Precondiciones

- El directorio de la historia existe bajo `$SPECS_BASE/specs/stories/`
- `story.md` existe en el directorio de la historia
- `skill-preflight` retorna estado OK (entorno válido)

---

## Dependencias

- Skills: [`skill-preflight`, `story-design`, `story-tasking`, `story-analyze`]
- Herramientas: ninguna externa requerida

---

## Modos de ejecución

- **Manual**: `/story-plan {story_id}` — interactivo, muestra progreso en tiempo real
- **Automático**: invocado por orquestador de nivel superior — reporta resultado sin interacción

---

## Restricciones / Reglas

- El skill es un orquestador puro — no reimplementa lógica de los sub-skills
- Fail-fast en Pasos 2 y 3: un fallo en `story-design` o `story-tasking` detiene la cadena; `story-analyze` (Paso 4) no es bloqueante técnicamente
- El estado `PLANNING/IN‑PROGRESS` se aplica incondicionalmente al iniciar, sin importar el estado previo
- La idempotencia de cada artefacto (design.md, tasks.md, analyze.md) es responsabilidad del sub-skill correspondiente
- Con `--skip-analyze` solo se omite el análisis de coherencia; design y tasking siempre se ejecutan
- NO modifique ningún archivo existente en el código fuente (estamos en etapa de plan de especificación, no de implementación)
- NO genere código; estas orquestando el flujo de planificación, no implementando los artefactos técnicos

---

## Flujo de ejecución

### Paso 0 — Verificar entorno (`skill-preflight`)

Invocar el skill `skill-preflight` antes de cualquier operación.

El preflight verifica `SDDF_ROOT`, resuelve `SPECS_BASE` (fallback: `docs`) y confirma los subdirectorios de specs estándar.

Si retorna `✗ Entorno inválido`, detener la ejecución inmediatamente. No invocar ningún sub-skill.

Usar `$SPECS_BASE` (resuelto por `skill-preflight`) para todas las rutas en los pasos siguientes.

---

### Paso 1 — Resolver parámetros de entrada

#### 1a. Resolución del story_id

Si no se proporcionó ningún argumento, preguntar:
```
¿Qué historia deseas planificar?
Proporciona el ID (ej. FEAT-057) o la ruta completa al directorio.
```

#### 1b. Resolución del directorio de la historia

1. Ruta explícita `{story_path}` si se proporcionó
2. Glob `$SPECS_BASE/specs/stories/{story_id}-*/` — primera coincidencia cuyo nombre comienza con el ID
3. Si no se encuentra: notificar y detener (ver sección Manejo de errores)

#### 1c. Actualizar frontmatter a PLANNING/IN‑PROGRESS

Actualizar el frontmatter de `story.md` estableciendo `status: PLANNING` / `substatus: IN‑PROGRESS`.

Esta actualización es **incondicional**: se aplica independientemente del estado previo de la historia. Si los campos `status`/`substatus` no existen, agregarlos.

Mostrar confirmación de inicio:
```
🚀 Iniciando pipeline de planning para: <story_id>
   Directorio: <ruta_directorio>
   Estado: PLANNING/IN‑PROGRESS
   Pasos: story-design → story-tasking → story-analyze
```

---

### Paso 2 — Invocar `story-design` (modo Agent)

Mostrar:
```
[1/3] → story-design...
```

Invocar el skill `story-design` en modo Agent con los siguientes parámetros:
- Directorio de la historia: la ruta resuelta en el Paso 1
- Modo: Agent (automático, sin confirmación interactiva)

**Si `story-design` completa exitosamente:**
- Registrar estado: `✓`
- Mostrar: `[1/3] ✓ story-design — design.md generado`
- Continuar al Paso 3

**Si `story-design` falla:**
- Registrar estado: `✗`
- Registrar pasos no ejecutados: `story-tasking → —`, `story-analyze → —`
- Ir directamente al Paso 5 (resumen final con fallo)

---

### Paso 3 — Invocar `story-tasking` (modo Agent)

Mostrar:
```
[2/3] → story-tasking...
```

Invocar el skill `story-tasking` en modo Agent con los siguientes parámetros:
- Directorio de la historia: la ruta resuelta en el Paso 1
- Modo: Agent (automático, sin confirmación interactiva)

**Si `story-tasking` completa exitosamente:**
- Registrar estado: `✓`
- Mostrar: `[2/3] ✓ story-tasking — tasks.md generado`
- Continuar al Paso 4 (o saltar al Paso 5 si se especificó `--skip-analyze`)

**Si `story-tasking` falla:**
- Registrar estado: `✗`
- Registrar paso no ejecutado: `story-analyze → —`
- Ir directamente al Paso 5 (resumen final con fallo)

---

### Paso 4 — Invocar `story-analyze` (modo Agent, no bloqueante)

Si se especificó `--skip-analyze`, saltar este paso y registrar estado: `—` (saltado por flag).

Mostrar:
```
[3/3] → story-analyze...
```

Invocar el skill `story-analyze` en modo Agent con los siguientes parámetros:
- Directorio de la historia: la ruta resuelta en el Paso 1
- Modo: Agent (automático, sin confirmación interactiva)

**Si `story-analyze` completa sin inconsistencias:**
- Registrar estado: `✓`
- Mostrar: `[3/3] ✓ story-analyze — analyze.md generado, sin inconsistencias`

**Si `story-analyze` detecta inconsistencias (ERRORs o WARNINGs):**
- Registrar estado: `⚠️`
- Mostrar: `[3/3] ⚠️ story-analyze — inconsistencias detectadas (ver analyze.md)`
- **No detener la cadena** — continuar al Paso 5

**Si `story-analyze` falla con error técnico (no puede ejecutarse):**
- Registrar estado: `✗`
- Mostrar: `[3/3] ✗ story-analyze — error técnico`
- Continuar al Paso 5 (el plan no se bloquea por este fallo)

---

### Paso 5 — Resumen final

Mostrar la tabla de estado acumulada:

```
─────────────────────────────────────────────────────
 Planning: <story_id> — <título de la historia>
─────────────────────────────────────────────────────
 Paso            │ Estado │ Artefacto
─────────────────────────────────────────────────────
 story-design    │   ✓    │ design.md
 story-tasking   │   ✓    │ tasks.md
 story-analyze   │   ✓    │ analyze.md
─────────────────────────────────────────────────────
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

Estado de story.md: PLANNING/IN‑PROGRESS (no actualizado — hay ERROREs pendientes)

Puedes ajustar design.md o tasks.md y re-ejecutar /story-analyze cuando estés listo.
```

**Si algún paso falló (✗):**
```
✗ Pipeline interrumpido en: <nombre_del_paso>

Los artefactos generados antes del fallo están disponibles en: <ruta_directorio>
Estado de story.md: PLANNING/IN‑PROGRESS (no completado)
Corrige el problema indicado arriba y re-ejecuta /story-plan <story_id>.

Nota: al re-ejecutar, cada sub-skill preguntará si deseas sobreescribir los artefactos existentes.
```

---

### Manejo de errores

| Condición | Mensaje | Acción |
|---|---|---|
| Entorno inválido (preflight) | `✗ Entorno inválido` | Detener inmediatamente. No invocar sub-skills |
| Historia no encontrada | `❌ No se encontró la historia {story_id} bajo $SPECS_BASE/specs/stories/` | Detener. Sugerir `/release-generate-stories` |
| `story.md` ausente | `❌ No se encontró story.md en: <ruta>` | Detener sin invocar sub-skills. Sugerir `/release-generate-stories` |
| Fallo en `story-design` | `[1/3] ✗ story-design — FALLO` | Registrar `story-tasking → —`, `story-analyze → —`. Ir a Paso 5 |
| Fallo en `story-tasking` | `[2/3] ✗ story-tasking — FALLO` | Registrar `story-analyze → —`. Ir a Paso 5 |
| Error técnico en `story-analyze` | `[3/3] ✗ story-analyze — error técnico` | No bloquear. Continuar a Paso 5 |

---

## Salida

- `{directorio_historia}/design.md` — diseño técnico de la historia (generado por `story-design`)
- `{directorio_historia}/tasks.md` — plan de tareas de implementación (generado por `story-tasking`)
- `{directorio_historia}/analyze.md` — reporte de coherencia entre artefactos (generado por `story-analyze`, omitido con `--skip-analyze`)
- Estado del workitem actualizado en `story.md`:
  - `READY-FOR-IMPLEMENT / DONE` si el pipeline completa sin ERROREs
  - `PLANNING / IN‑PROGRESS` si hay fallos o inconsistencias bloqueantes
