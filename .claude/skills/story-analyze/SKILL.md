---
name: story-analyze
description: >-
  Analiza la coherencia entre story.md, design.md y los artefactos de implementación (testcases.md y/o tasks.md)
  de una historia antes de implementar. Al menos uno de testcases.md o tasks.md debe existir; si ambos faltan
  el análisis se rechaza. Usar siempre que el usuario quiera verificar la alineación de artefactos de una historia,
  detectar inconsistencias entre el diseño y las tareas, auditar la cobertura de criterios de aceptación,
  o necesite el paso de validación previo a story-implement-tasks o story-implement.
  Invocar también cuando el usuario mencione "analizar plan de historia", "coherencia de artefactos del plan de historia",
  "verificar alineación", "auditar historia", "story-analyze", "inconsistencias de diseño",
  "chequear story antes de implementar" o equivalentes.
triggers:
  - "story-analyze"
  - "analizar historia"
  - "coherencia de artefactos"
  - "verificar alineación"
  - "auditar historia"
  - "analizar plan de historia"
  - "chequear story antes de implementar"
  - "inconsistencias de diseño"
---

# Skill: `/story-analyze`

## Objetivo

Audita la coherencia entre los tres artefactos del trío SDD de una historia. Su propósito es **detectar desalineaciones antes de codificar**, reduciendo retrabajo en la fase de implementación.

El skill nunca modifica los artefactos que analiza. Solo lee, correlaciona y genera un reporte de coherencia.

**Qué hace este skill:**
- Detecta criterios de aceptación sin cobertura en design.md
- Detecta tareas en tasks.md sin elemento de diseño asociado (si tasks.md está presente)
- Detecta elementos de diseño sin tarea correspondiente (si tasks.md está presente)
- Verifica la cobertura de ACs en testcases.md (si existe)
- Informa la vía de implementación disponible (`/story-implement` o `/story-implement-tasks`)
- Detecta objetivos de la historia desalineados con el release padre
- Valida el cumplimiento del DoD para la fase PLAN
- Genera `analyze.md` con el reporte de coherencia y recomendaciones accionables
- Actualiza el estado de `story.md` a `READY-FOR-IMPLEMENT/DONE` si no hay ERROREs

**Qué NO hace este skill:**
- Modificar ningún artefacto analizado (story.md, design.md, tasks.md, testcases.md)
- Generar diseño, tareas ni historia nuevos
- Corregir inconsistencias automáticamente

### Posicionamiento

```
[story.md: PLAN/IN‑PROGRESS]  ← seteado por story-plan al inicio del pipeline
     ↓
story.md      → What: requisitos, criterios de aceptación, comportamiento esperado
design.md     → How: arquitectura, componentes, interfaces, decisiones técnicas
testcases.md  → Test: escenarios de prueba por AC (habilita /story-implement)
tasks.md      → When: tareas de implementación, orden, seguimiento (habilita /story-implement-tasks)
analyze.md    → Check: coherencia entre los artefactos ← aquí (ejecutar después de story-design, story-testcases o story-tasking)
     ↓
[story.md: READY-FOR-IMPLEMENT/DONE]    ← seteado por story-analyze si no hay ERROREs
```

### Ciclo de vida de estados

| Condición al finalizar | status | substatus |
|---|---|---|
| Sin inconsistencias ERROR-level | `READY-FOR-IMPLEMENT` | `DONE` |
| Con inconsistencias ERROR-level | `PLANNING` | `IN‑PROGRESS` (sin cambio — dejar como está) |

La actualización de estado ocurre tanto en modo manual como en modo Agent (invocado por `story-plan`).

---

## Entrada

- `story.md` — historia con criterios de aceptación numerados AC-1…AC-N (obligatorio)
- `design.md` — diseño técnico con componentes, interfaces y decisiones (obligatorio)
- `testcases.md` — casos de prueba por criterio de aceptación (opcional; requerido si tasks.md ausente)
- `tasks.md` — plan de tareas de implementación (opcional; requerido si testcases.md ausente)
- `$SPECS_BASE/policies/definition-of-done-story.md` — criterios DoD fase PLAN (opcional)
- `$SPECS_BASE/specs/releases/{parent}-*/release.md` — release padre para verificar alineación (opcional)
- Template del reporte: `assets/analyze-report-template.md` (opcional, hay fallback interno)

---

## Parámetros

- `{story_id}` — identificador de la historia (ej. `FEAT-059`)
- `{story_path}` — ruta explícita al directorio de la historia (opcional)
- `--output {path}` — ruta de salida del reporte (opcional)

---

## Precondiciones

- El directorio de la historia existe bajo `$SPECS_BASE/specs/stories/`
- `story.md` existe en el directorio de la historia
- `design.md` existe en el directorio de la historia (requiere haber ejecutado `/story-design`)
- `skill-preflight` retorna estado OK (entorno válido)
- Al menos uno de `testcases.md` o `tasks.md` debe existir en el directorio de la historia. Si ambos están ausentes, la ejecución se detiene con error.
- Si solo existe `testcases.md`: habilita implementación vía `/story-implement`
- Si solo existe `tasks.md`: habilita implementación vía `/story-implement-tasks`
- Si ambos existen: ambas vías disponibles

---

## Dependencias

- Skills: [`skill-preflight`]
- Herramientas: ninguna externa requerida

---

## Modos de ejecución

- **Manual**: `/story-analyze {story_id}` — interactivo, muestra resumen y pide confirmación
- **Automático**: invocado por orquestador — guarda directamente sin confirmación y reporta al orquestador

---

## Restricciones / Reglas

- El skill nunca modifica los artefactos que analiza — es estrictamente de solo lectura sobre story.md, design.md, testcases.md y tasks.md
- Sin `story.md` o `design.md` la ejecución se detiene
- Sin al menos uno de `testcases.md` o `tasks.md`, la ejecución se detiene (análisis rechazado)
- Si `tasks.md` está ausente pero `testcases.md` presente: las correlaciones tarea↔diseño se omiten con `⚠️`
- Si `testcases.md` está ausente pero `tasks.md` presente: la cobertura de ACs en testcases se omite con `⚠️`
- Los hallazgos de tipo ERROR (TIPO A, B o E) bloquean la transición a `READY-FOR-IMPLEMENT`
- Ante incertidumbre en la evaluación DoD, usar `⚠️` en lugar de `❌` (regla de duda — no bloquear indebidamente)
- El reporte debe referenciar secciones y líneas específicas de los archivos afectados — no se admiten mensajes genéricos
- NO modifique ningún archivo existente en el código fuente (estamos en etapa de plan de especificación, no de implementación)
- NO genere código; solo estamos analizando y auditando la planeación.
- **Encoding**: All generated `.md` files MUST be saved as **UTF-8 without BOM**. 
  Do not use Latin-1, CP-1252, or any other encoding. 
  If you see characters like `Ã³` or `ðŸ“–`, that indicates an encoding error — fix it.

---

## Flujo de ejecución

### Paso 0 — Verificar entorno (`skill-preflight`)

Invocar el skill `skill-preflight` antes de cualquier operación.

El preflight verifica `SDDF_ROOT`, resuelve `SPECS_BASE` (fallback: `docs`) y confirma los subdirectorios de specs estándar.

Si retorna `✗ Entorno inválido`, detener la ejecución inmediatamente. No generar ningún archivo.

Usar `$SPECS_BASE` (resuelto por `skill-preflight`) para todas las rutas en los pasos siguientes.

---

### Paso 1 — Resolver parámetros de entrada

#### 1a. Resolución del story_id

Si no se proporcionó ningún argumento, preguntar:
```
¿Qué historia quieres analizar?
Proporciona el ID (ej. FEAT-059) o la ruta completa al directorio.
```

#### 1b. Resolución del directorio de la historia

1. Ruta explícita `{story_path}` si se proporcionó
2. Glob `$SPECS_BASE/specs/stories/{story_id}-*/` — directorio cuyo nombre comienza con el ID
3. Si no se encuentra: notificar y detener (ver sección Manejo de errores)

#### 1c. Resolución de la ruta de salida

1. Ruta explícita `--output {path}` si se proporcionó
2. `{directorio_historia}/analyze.md`

Si `analyze.md` ya existe en la ruta de salida, preguntar al usuario:
```
El archivo analyze.md ya existe en: <ruta>
¿Qué deseas hacer?
  (r) Regenerar — reemplazar el reporte existente
  (n) No modificar — saltar el análisis
```
- `n` / `no modificar`: informar que se saltó y terminar
- `r` / `regenerar`: continuar

#### 1d. Cargar criterios DoD — Fase PLAN

Intentar localizar `$SPECS_BASE/policies/definition-of-done-story.md`.

**Si el archivo no existe:**
- Emitir: `⚠️ definition-of-done-story.md no encontrado — se omitirá la validación DoD PLAN`
- Registrar internamente: `$DOD_PLAN_CRITERIA = []`
- Continuar (no detener la ejecución)

**Si el archivo existe:**
- Buscar el primer encabezado `###` cuyo texto contenga, case-insensitive, alguno de: `PLAN`, `PLANNING`, `PLANIFICACIÓN`
- **Si no hay coincidencia:** emitir `⚠️ Sección PLAN no encontrada en DoD — se omitirá la validación DoD PLAN`; registrar `$DOD_PLAN_CRITERIA = []`
- **Si se encontró:** extraer todas las líneas de checkbox (`- [ ]` y `- [x]`) como lista de criterios planos; registrar `$DOD_PLAN_CRITERIA`; emitir `✓ DoD PLAN cargado: <N> criterios encontrados`

---

### Paso 2 — Leer story.md y extraer requisitos

Leer `story.md` del directorio resuelto.

Extraer y registrar internamente:
- `story_id` del frontmatter (`id: FEAT-NNN`)
- `story_slug`, `story_title`, `story_parent` (release EPIC del frontmatter)
- **Criterios de aceptación numerados como AC-1, AC-2 … AC-N** — fuente de verdad del comportamiento esperado
- Requisitos no funcionales
- Objetivo de la historia (frase "Para ..." del user story)

Construir la tabla interna de ACs:
```
AC-1: <descripción>
AC-2: <descripción>
...
```

---

### Paso 3 — Leer design.md y extraer elementos de diseño

Leer `design.md` del directorio resuelto.

Extraer y registrar internamente:
- **Componentes afectados**: nombre, acción, ubicación, AC referenciado (buscar `AC-{n}` o `satisface: AC-{n}` en el texto cercano)
- **Interfaces definidas**: nombre, contrato, AC referenciado
- **Decisiones técnicas**: descripción, AC relacionado (si aplica)
- **Flujos clave**: descripción de flujos documentados

Construir la tabla interna de cobertura de ACs en design.md:
```
AC-1: cubierto por [Componente X, Interfaz Y]
AC-2: ❌ sin cobertura detectada
```

Para detectar cobertura buscar:
1. Referencias explícitas `// satisface: AC-{n}` o `AC-{n}` junto a un componente/interfaz
2. Mención del nombre del AC o su concepto clave en la sección de componentes

Si design.md no tiene anotaciones `satisface: AC-N`, realizar matching semántico: buscar si los conceptos clave del AC aparecen en los componentes y decisiones de diseño.

---

### Paso 4 — Leer tasks.md y extraer tareas (condicional)

Intentar leer `tasks.md` del directorio resuelto.

**Si `tasks.md` no existe:**
- Emitir: `⚠️ tasks.md no encontrado — las correlaciones tarea↔diseño se omitirán`
- Registrar internamente: `$TASKS_AVAILABLE = false`
- Continuar (no detener la ejecución)

**Si `tasks.md` existe:**
- Registrar internamente: `$TASKS_AVAILABLE = true`
- Extraer lista de tareas con ID (`T001`, `T002`...) y descripción
- Extraer agrupaciones (`##` de grupos) como contexto de área técnica
- Extraer tareas de verificación de ACs (buscar menciones de `AC-{n}` en la descripción)
- Construir la tabla interna de alineación tarea-diseño:
  - Para cada tarea, determinar si existe un componente o interfaz en design.md que justifique la tarea
  - Estrategia: buscar menciones de nombres de componentes del diseño en la descripción de la tarea, o si la tarea pertenece a un grupo cuyo nombre coincide con un componente del diseño

---

### Paso 4b — Leer testcases.md y extraer casos de prueba (condicional)

Intentar leer `testcases.md` del directorio resuelto.

**Si `testcases.md` no existe:**
- Emitir: `⚠️ testcases.md no encontrado — la cobertura de ACs en casos de prueba se omitirá`
- Registrar internamente: `$TESTCASES_AVAILABLE = false`
- Continuar (no detener la ejecución)

**Si `testcases.md` existe:**
- Registrar internamente: `$TESTCASES_AVAILABLE = true`
- Extraer escenarios de prueba con referencia a AC (buscar menciones de `AC-{n}`, `Scenario`, `Given/When/Then`, `Dado/Cuando/Entonces`)
- Construir tabla interna de cobertura de ACs en testcases.md:
  - Para cada AC de story.md, determinar si existe al menos un escenario de prueba que lo cubra
  - Buscar: mención explícita de `AC-{n}` en el escenario, o matching semántico del concepto clave del AC

**Gate de exclusión — verificar después de leer ambos artefactos:**

Si `$TASKS_AVAILABLE = false` Y `$TESTCASES_AVAILABLE = false`:
- Emitir:
  ```
  ❌ Análisis rechazado: no se encontró ningún artefacto de implementación.
     Se requiere al menos uno de:
       - testcases.md (para implementar con /story-implement)
       - tasks.md    (para implementar con /story-implement-tasks)
     Ejecuta primero /story-testcases {story_id} o /story-tasking {story_id}
  ```
- Detener la ejecución. No generar ningún archivo.

---

### Paso 5 — Verificar alineación con el release padre

#### 5a. Localizar el release padre

Buscar el ID del release en el frontmatter `parent:` de story.md (ej. `EPIC-12-story-sdd-workflow`).

Intentar encontrar `$SPECS_BASE/specs/releases/{parent}-*/release.md`.

Si no existe: emitir advertencia y continuar sin verificación de release:
```
⚠️ No se encontró release.md para: <parent>
   La verificación de alineación con el release se omitirá.
```

#### 5b. Leer objetivos del release

Si release.md existe, extraer:
- Objetivos del release / descripción del épica
- Lista de features incluidas (buscar la feature correspondiente a la historia analizada)
- Restricciones o criterios del release

#### 5c. Verificar alineación

Comparar:
- ¿El objetivo de la historia ("Para ..." del user story) está alineado con los objetivos del release?
- ¿La historia está listada como feature del release?
- ¿Existen restricciones del release que la historia no respeta?

Registrar internamente:
```
Release alineado: ✓ / ❌
  - Historia listada en release: ✓ / ❌
  - Objetivo alineado: ✓ / ❌ [descripción]
  - Restricciones respetadas: ✓ / ❌ [descripción]
```

---

### Paso 6 — Correlacionar y detectar inconsistencias

Con los datos de los Pasos 2–5, ejecutar las siguientes correlaciones:

#### Correlación 1 — Cobertura de ACs en design.md

Para cada AC de story.md:
- ✓ **Cubierto**: existe al menos un componente, interfaz o decisión en design.md que lo referencia o cubre semánticamente
- ❌ **Sin cobertura**: ningún elemento del diseño cubre este AC

Registrar ACs sin cobertura como inconsistencia **TIPO A**.

#### Correlación 2 — Tareas sin diseño asociado

**Si `$TASKS_AVAILABLE = false`:** omitir con nota `⚠️ Omitida — tasks.md no disponible`.

**Si `$TASKS_AVAILABLE = true`:**

Para cada tarea de tasks.md:
- ✓ **Con diseño**: su descripción o grupo corresponde a un componente/interfaz del diseño
- ❌ **Sin diseño**: no se puede trazar a ningún elemento del diseño

Registrar tareas sin diseño como inconsistencia **TIPO B**.

#### Correlación 3 — Elementos de diseño sin tarea

**Si `$TASKS_AVAILABLE = false`:** omitir con nota `⚠️ Omitida — tasks.md no disponible`.

**Si `$TASKS_AVAILABLE = true`:**

Para cada componente e interfaz de design.md:
- ✓ **Con tarea**: existe al menos una tarea que lo implementa
- ⚠️ **Sin tarea**: ninguna tarea lo implementa

Registrar elementos sin tarea como inconsistencia **TIPO C** (advertencia, no error).

#### Correlación 4 — Alineación con release

Si la verificación del release encontró desalineaciones, registrar como inconsistencia **TIPO D**.

#### Correlación 5 — Cumplimiento DoD PLAN

**Si `$DOD_PLAN_CRITERIA` está vacío:**
- Registrar esta correlación como: `⚠️ No evaluada — DoD PLAN no disponible`
- No añadir ningún hallazgo de tipo E al reporte

**Si `$DOD_PLAN_CRITERIA` tiene criterios:**

Para cada criterio, evaluar semánticamente contra el contenido combinado de story.md, design.md y tasks.md (si está disponible):
- `✓` — evidencia clara de cumplimiento presente en los artefactos
- `❌` — evidencia clara de incumplimiento → clasificar como **ERROR** (TIPO E)
- `⚠️` — evidencia insuficiente o criterio no evaluable → clasificar como **WARNING**

Si `$TASKS_AVAILABLE = false`, los criterios DoD que refieran explícitamente a `tasks.md` deben evaluarse como `⚠️` (no evaluable), no como `❌`.

Registrar internamente: `$DOD_ERROR_COUNT` = número de criterios con resultado `❌`.

#### Correlación 6 — Cobertura de ACs en testcases.md

**Si `$TESTCASES_AVAILABLE = false`:** omitir con nota `⚠️ Omitida — testcases.md no disponible`.

**Si `$TESTCASES_AVAILABLE = true`:**

Para cada AC de story.md:
- ✓ **Cubierto**: existe al menos un escenario de prueba en testcases.md que lo referencia o cubre semánticamente
- ⚠️ **Sin caso de prueba**: ningún escenario cubre este AC

Registrar ACs sin caso de prueba como inconsistencia **TIPO F** (WARNING, no bloquea).

#### Clasificación de severidad

| Tipo | Descripción | Severidad |
|---|---|---|
| A | AC sin cobertura en design.md | ERROR |
| B | Tarea sin diseño asociado | ERROR |
| C | Elemento de diseño sin tarea | WARNING |
| D | Desalineación con release | WARNING |
| E | Criterio DoD PLAN no cumplido | ERROR |
| F | AC sin caso de prueba en testcases.md | WARNING |

---

### Paso 7 — Leer el template en tiempo de ejecución

Intentar localizar el template del reporte en este orden:
1. `assets/analyze-report-template.md` (relativo al directorio del skill)
2. Template de fallback interno (definido en la sección `## Salida`)

Informar qué template se está usando:
```
✓ Template: <ruta-del-template>  [externo | assets | fallback interno]
```

---

### Paso 8 — Generar el reporte

Usar la estructura del template del Paso 7 como base.

Completar el frontmatter del reporte:
```yaml
type: analyze
id: <FEAT-NNN>
slug: {story_id}-analyze-report
title: "Analyze: <título>"
story: <FEAT-NNN>
design: <FEAT-NNN>
testcases: <FEAT-NNN>  # omitir este campo si $TESTCASES_AVAILABLE = false
tasks: <FEAT-NNN>      # omitir este campo si $TASKS_AVAILABLE = false
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
related:
  - <slug-historia>
```

Completar el reporte con los resultados de la correlación del Paso 6:

- **Resumen ejecutivo**: estado general (✓ Coherente / ⚠️ Advertencias / ❌ Inconsistencias). Completar la fila `Cumplimiento DoD — Fase PLAN` con `{dod_status}` = ✓ / ⚠️ / ❌ según los resultados de Correlación 5, y `{dod_n}/{dod_total}` con el conteo de criterios ✓. Si `$DOD_PLAN_CRITERIA` estuvo vacío, usar `{dod_status}` = `⚠️` y `{dod_n}/{dod_total}` = `—`
- **Tabla de cobertura de ACs**: cada AC + estado + elemento de diseño que lo cubre
- **Tabla de alineación tareas ↔ diseño**: cada tarea + estado + justificación (si `$TASKS_AVAILABLE = false`: reemplazar con nota `⚠️ tasks.md no presente — análisis de tareas omitido`)
- **Tabla de cobertura diseño → tareas**: cada componente/interfaz + estado (si `$TASKS_AVAILABLE = false`: reemplazar con nota `⚠️ tasks.md no presente — análisis de tareas omitido`)
- **Tabla de cobertura de ACs en testcases.md**: cada AC + estado + escenario que lo cubre (si `$TESTCASES_AVAILABLE = false`: reemplazar con nota `⚠️ testcases.md no presente — cobertura de pruebas no evaluada`)
- **Sección "Vía de implementación disponible"**: tabla indicando qué skills están habilitados según los artefactos presentes (`/story-implement` si testcases.md presente; `/story-implement-tasks` si tasks.md presente)
- **Alineación con release**: estado + detalles
- **Inconsistencias detectadas**: lista numerada con tipo, descripción, archivo afectado, sección específica
- **Recomendaciones**: para cada inconsistencia, una acción concreta
- **Sección "Cumplimiento DoD — Fase PLAN"**: si `$DOD_PLAN_CRITERIA` estuvo vacío, mostrar aviso de omisión; si hay criterios, completar la tabla con una fila por criterio evaluado en Correlación 5

---

### Paso 9 — Guardar el reporte y actualizar estado de la historia

Guardar el reporte en la ruta resuelta en el Paso 1.

Si el directorio no existe, crearlo.

#### 9a. Actualizar frontmatter de story.md

Después de guardar `analyze.md`, evaluar si hay inconsistencias de tipo ERROR (TIPO A, B o E):

**Si no hay ERROREs (solo WARNINGs o todo OK):**
- Actualizar el frontmatter de `story.md`: `status: READY-FOR-IMPLEMENT` / `substatus: DONE`
- Esta actualización ocurre tanto en modo manual como en modo Agent

**Si hay ERROREs (inconsistencias bloqueantes — TIPO A, B o E):**
- NO actualizar el frontmatter de `story.md`
- El estado permanece en `PLAN/IN‑PROGRESS` (o el que tuviera antes)
- Registrar internamente: `Estado story.md: PLAN/IN‑PROGRESS (no actualizado — hay ERROREs)`

---

### Paso 10 — Confirmación interactiva (solo modo manual)

Mostrar al usuario:

```
✅ Análisis guardado: <ruta>/analyze.md

📊 Resumen de coherencia:
   Historia: <FEAT-NNN> — <título>

   Cobertura de ACs:     <N>/<Total> criterios cubiertos en design.md
   Alineación tareas:    <N>/<Total> tareas con diseño asociado  |  ⚠️ no evaluada — tasks.md no presente
   Cobertura de diseño:  <N>/<Total> elementos de diseño con tarea  |  ⚠️ no evaluada — tasks.md no presente
   Cobertura testcases:  <N>/<Total> ACs con caso de prueba  |  ⚠️ no evaluada — testcases.md no presente

   Release (<EPIC-NN>):  <alineado ✓ / desalineado ❌ / no verificado ⚠️>
   DoD PLAN:             <N>/<Total> criterios ✓  |  ⚠️ no evaluado (sección no encontrada)

   Vía de implementación:
   · testcases.md <✓ presente | ❌ ausente> → /story-implement <disponible | no disponible>
   · tasks.md     <✓ presente | ❌ ausente> → /story-implement-tasks <disponible | no disponible>

   Inconsistencias:
   · <N> ERROR(ES) — requieren corrección antes de implementar
   · <N> WARNING(S) — revisar pero no bloquean

   Estado story.md: <READY-FOR-IMPLEMENT/DONE ✓ | PLAN/IN‑PROGRESS — hay ERROREs pendientes>
```

Cuando `$TASKS_AVAILABLE = false`, mostrar las líneas `Alineación tareas` y `Cobertura de diseño` con el valor `⚠️ no evaluada — tasks.md no presente` en lugar de los conteos.

Cuando `$TESTCASES_AVAILABLE = false`, mostrar la línea `Cobertura testcases` con el valor `⚠️ no evaluada — testcases.md no presente` en lugar del conteo.

Si hay ERROREs:
```
⛔ Se encontraron <N> inconsistencias bloqueantes.
   Corrige los ERROREs en design.md o tasks.md antes de comenzar la implementación.
   Sugerencias en: <ruta>/analyze.md → sección "Recomendaciones"

   Estado story.md: PLAN/IN‑PROGRESS (no se actualizó a READY-FOR-IMPLEMENT — hay ERROREs)
```

Si solo hay WARNINGs o está todo OK:
```
✅ Sin inconsistencias bloqueantes. Puedes proceder con la implementación.
   Estado story.md: READY-FOR-IMPLEMENT/DONE ✓
```

---

### Manejo de errores

| Condición | Mensaje | Acción |
|---|---|---|
| Historia no encontrada | `❌ No se encontró la historia {story_id} bajo $SPECS_BASE/specs/stories/` | Detener. Sugerir `/release-generate-stories` |
| `story.md` ausente | `❌ No se encontró story.md en: <ruta>` | Detener. Sugerir `/release-generate-stories` |
| `design.md` ausente | `❌ No se encontró design.md en: <ruta>` | Detener. Sugerir `/story-design {story_id}` |
| `testcases.md` y `tasks.md` ambos ausentes | `❌ Análisis rechazado: sin artefacto de implementación` | Detener. Sugerir `/story-testcases {story_id}` o `/story-tasking {story_id}` |
| `testcases.md` ausente (tasks.md presente) | `⚠️ testcases.md no encontrado — cobertura de pruebas omitida` | Advertir y continuar |
| `tasks.md` ausente (testcases.md presente) | `⚠️ No se encontró tasks.md en: <ruta> — análisis de tareas omitido` | Advertir y continuar. Informar que `/story-tasking {story_id}` habilita el análisis completo |
| Entorno inválido (preflight) | `✗ Entorno inválido` | Detener inmediatamente. No generar archivos |
| `definition-of-done-story.md` ausente | `⚠️ definition-of-done-story.md no encontrado` | Advertir y continuar sin validación DoD |
| Sección PLAN no encontrada en DoD | `⚠️ Sección PLAN no encontrada en DoD` | Advertir y continuar sin validación DoD |
| Release padre no encontrado | `⚠️ No se encontró release.md para: <parent>` | Advertir y continuar sin verificación de release |
| Template no encontrado | — | Usar template de fallback interno. Informar al usuario |

---

## Salida

- `{directorio_historia}/analyze.md` — reporte de coherencia entre story.md, design.md, testcases.md (si existe) y tasks.md (si existe)
- Estado del workitem actualizado en `story.md`:
  - `READY-FOR-IMPLEMENT / DONE` si no hay ERROREs
  - Sin cambio si hay ERROREs bloqueantes

### Template de Fallback

Usar solo si no se encontró ningún template externo en el Paso 7:

```markdown
---
type: analyze
id: {story_id}
slug: {story_id}-analyze
title: "Analyze: {story_title}"
story: {story_id}
design: {story_id}
tasks: {story_id}
created: {date}
updated: {date}
---

# Reporte de Coherencia: {story_title}

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | {ac_coverage_status} | {ac_coverage_N}/{ac_total} criterios cubiertos |
| Cobertura de ACs en testcases.md | {tc_coverage_status} | {tc_covered_N}/{ac_total} ACs con caso de prueba |
| Alineación tareas → diseño | {tasks_coverage_status} | {tasks_covered_N}/{tasks_total} tareas con diseño |
| Cobertura diseño → tareas | {design_coverage_status} | {design_covered_N}/{design_total} elementos con tarea |
| Alineación con release {parent} | {release_status} | {release_detail} |
| Cumplimiento DoD — Fase PLAN | {dod_status} | {dod_n}/{dod_total} criterios ✓ |

**Estado general:** {overall_status}

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | {ac_1_desc} | ✓ / ❌ | {design_element} |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | {task_desc} | {design_element} | ✓ / ❌ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Ubicación en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| {component} | {section} | {task_id} | ✓ / ⚠️ |

---

## Alineación con Release

**Release padre:** {parent}

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en release | ✓ / ❌ | {detail} |
| Objetivo alineado | ✓ / ❌ | {detail} |
| Restricciones respetadas | ✓ / ❌ | {detail} |

---

## Inconsistencias Detectadas

<!-- Si no hay inconsistencias, escribir: Sin inconsistencias detectadas. -->

### INC-001 [ERROR / WARNING]

- **Tipo:** A / B / C / D / E / F
- **Descripción:** {description}
- **Archivo afectado:** {file} — sección "{section}"
- **Acción requerida:** {action}

---

## Recomendaciones

<!-- Para cada inconsistencia, una acción concreta con el archivo y sección a modificar. -->

1. {recommendation_1}

---

## Cobertura de ACs en Testcases

<!-- Si $TESTCASES_AVAILABLE = false, reemplazar la tabla con: ⚠️ testcases.md no presente — cobertura de pruebas no evaluada -->

| AC | Descripción | Cubierto en testcases.md | Escenario |
|---|---|---|---|
| AC-1 | {ac_1_desc} | ✓ / ⚠️ | {scenario_name} |

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ✓ / ❌ | `/story-implement {story_id}` |
| tasks.md | ✓ / ❌ | `/story-implement-tasks {story_id}` |

---

## Cumplimiento DoD — Fase PLAN

<!-- Si $DOD_PLAN_CRITERIA estuvo vacío al ejecutar Correlación 5, mostrar el texto de aviso a continuación y omitir la tabla. -->
<!-- ⚠️ DoD PLAN no encontrado — se omitió la validación. Verifica que $SPECS_BASE/policies/definition-of-done-story.md contiene una sección con el término "PLAN". -->

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| {criterio_dod_1} | ✓ / ❌ / ⚠️ | ERROR / WARNING / — | {evidencia_breve} |
```
