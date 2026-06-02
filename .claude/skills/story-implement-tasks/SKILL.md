---
name: story-implement-tasks
description: >-
  Implementa el código de una historia SDD tarea por tarea siguiendo TDD, generando primero el test
  y luego el código de producción mínimo. Lee story.md, design.md y tasks.md del directorio de la historia,
  actualiza tasks.md en tiempo real y genera implement-report.md al finalizar.
  Usar siempre que el usuario quiera implementar una historia, generar código tarea por tarea,
  ejecutar el ciclo TDD sobre una historia planificada, o completar el flujo SDD después de story-plan.
  Invocar también cuando el usuario mencione "implementar historia", "story-implement-tasks",
  "generar código de la historia", "implementar tareas", "codificar historia",
  "programar historia", "TDD historia", "ejecutar story-implement-tasks" o equivalentes.
triggers:
  - story-implement-tasks
  - /story-implement-tasks-tasks
  - implementar historia
  - generar código de la historia
  - implementar tareas
  - codificar historia
  - programar historia
  - TDD historia
  - ejecutar story-implement-tasks
---

## Objetivo

Implementa una historia SDD tarea por tarea siguiendo TDD. Su propósito es **cerrar el ciclo completo de Spec-Driven Development** transformando los artefactos de planning (`story.md`, `design.md`, `tasks.md`) en código de producción con tests, trazabilidad completa y visibilidad de progreso en tiempo real.

**Qué hace este skill:**
- Lee los tres artefactos de planning como entrada
- Verifica precondiciones antes de implementar (fail-fast ante artefactos faltantes)
- Implementa cada tarea pendiente en orden TDD: test fallido → código mínimo → refactor si aplica
- Detecta tareas con componentes no definidos y las marca como bloqueadas sin detener el pipeline
- Actualiza `tasks.md` en tiempo real al completar o bloquear cada tarea
- Genera `implement-report.md` con trazabilidad completa al finalizar

**Qué NO hace este skill:**
- Reimplementar la lógica de `story-design`, `story-tasking` ni `story-analyze`
- Ejecutar los tests generados (responsabilidad del desarrollador)
- Gestionar dependencias externas ni hacer rollback de código generado
- Corregir inconsistencias entre artefactos (eso es trabajo de `story-analyze`)

### Posicionamiento

```
[story.md: READY-FOR-IMPLEMENT/DONE]    ← precondición inicial (viene de story-plan/story-analyze)
[story.md: IMPLEMENT/IN-PROGRESS]    ← precondición reanudación (viene de story-code-review needs-changes)
     ↓
story-implement  → Entry point de la implementación: ejecuta TDD tarea por tarea  ← aquí
     │   Al iniciar: story.md → IMPLEMENTING/IN‑PROGRESS
     │   Al finalizar: story.md → IMPLEMENT/DONE + release.md checklist actualizado
     ↓
[story.md: IMPLEMENT/DONE]
──────────────────────────────────────────────────────────────────────────────────────
story.md          → What: requisitos, criterios de aceptación, comportamiento esperado
design.md         → How: arquitectura, componentes, interfaces, decisiones técnicas
tasks.md          → When: tareas de implementación, orden, seguimiento
implement-report.md → Done: código generado, estado por tarea, bloqueos documentados ← aquí
story-plan        → Entry point del planning: orquesta design → tasking → analyze
story-implement   → Entry point de la implementación: ejecuta TDD tarea por tarea  ← aquí
```

---

## Entrada

| Artefacto | Ubicación | Requerido |
|---|---|---|
| `story.md` | `$SPECS_BASE/specs/stories/<FEAT-NNN>/story.md` | ✓ obligatorio |
| `design.md` | `$SPECS_BASE/specs/stories/<FEAT-NNN>/design.md` | ✓ obligatorio |
| `tasks.md` | `$SPECS_BASE/specs/stories/<FEAT-NNN>/tasks.md` | ✓ obligatorio |
| `fix-directives.md` | `$SPECS_BASE/specs/stories/<FEAT-NNN>/fix-directives.md` | opcional |
| `definition-of-done-story.md` | `$SPECS_BASE/policies/definition-of-done-story.md` | opcional |

---

## Parámetros

| Parámetro | Tipo | Descripción |
|---|---|---|
| `{story_id}` | posicional | ID de la historia (ej. `FEAT-059`) |
| `{story_path}` | posicional opcional | Ruta explícita al directorio; sobreescribe la resolución por glob |

Si no se proporciona ningún argumento, el skill lo solicita interactivamente.

---

## Precondiciones

El frontmatter de `story.md` debe cumplir alguna de las siguientes condiciones antes de ejecutar:

| Condición | status | substatus | Descripción |
|---|---|---|---|
| Ejecución inicial o re-implementación | `READY-FOR-IMPLEMENT` | `DONE` | viene de story-plan / story-analyze / story-code-review (rejection) |
| Reanudación | `IMPLEMENTING` | `IN-PROGRESS` | viene de una ejecución parcial o de story-code-review con cambios requeridos |

Cualquier otro estado detiene la ejecución con error descriptivo.

---

## Dependencias

| Skill / Herramienta | Rol |
|---|---|
| `skill-preflight` | Verifica SDDF_ROOT y resuelve SPECS_BASE antes de cualquier operación (Paso 0) |
| `story-code-review` | Skill downstream que consume `implement-report.md` para revisar la implementación |

---

## Modos de ejecución

| Modo | Invocación | Comportamiento |
|---|---|---|
| Manual | `/story-implement-tasks {story_id}` | Interactivo, muestra progreso en tiempo real por tarea |
| Agent | Invocado por orquestador | Automático, reporta resultado al finalizar |

---

## Restricciones / Reglas

### Ciclo de vida de estados

| Evento | status | substatus |
|--------|--------|-----------|
| Precondición inicial (ejecución nueva) | `READY-FOR-IMPLEMENT` | `DONE` |
| Precondición reanudación (parcialmente implementada) | `IMPLEMENTING` | `IN-PROGRESS` |
| Antes de la primera tarea (Paso 2) | `IMPLEMENTING` | `IN-PROGRESS` |
| Después de generar `implement-report.md` (Paso 4) | `IMPLEMENTING` | `DONE` |

### Reglas de comportamiento

- **Fail-fast en artefactos faltantes:** si falta cualquiera de los tres artefactos obligatorios, detener la ejecución antes de implementar cualquier tarea.
- **Actualización incremental de tasks.md:** marcar cada tarea como `[x]` o `[~]` inmediatamente al completarla o bloquearla, nunca en batch al final.
- **No bloquear el pipeline por tareas con componentes no definidos:** marcar como `[~]` y continuar con la siguiente tarea.
- **Gate de tareas completadas:** si `N_pendientes = 0` y `N_completadas > 0`, detener la ejecución sin modificar ningún archivo.
- **No reimplementar artefactos de planning:** si los artefactos ya existen y son válidos, no sobrescribirlos.
- **Transición de estado bloqueada por DoD-ERRORs:** si hay criterios DoD con `❌`, el frontmatter permanece en `IMPLEMENT/IN-PROGRESS`.

---

## Flujo de ejecución

### Paso 0 — Verificar entorno (`skill-preflight`)

Invocar el skill `skill-preflight` antes de cualquier operación.

El preflight verifica `SDDF_ROOT`, resuelve `SPECS_BASE` (fallback: `docs`) y confirma los subdirectorios de specs estándar.

Si retorna `✗ Entorno inválido`, detener la ejecución inmediatamente. No generar ningún archivo.

Usar `$SPECS_BASE` (resuelto por `skill-preflight`) para todas las rutas en los pasos siguientes.

---

### Paso 1 — Resolver Parámetros de Entrada

#### 1a. Argumentos aceptados

- `{story_id}` — identificador de la historia (ej. `FEAT-059`)
- `{story_path}` — ruta explícita al directorio de la historia (opcional, sobreescribe la resolución por glob)

Si no se proporcionó ningún argumento, preguntar:
```
¿Qué historia deseas implementar?
Proporciona el ID (ej. FEAT-059) o la ruta completa al directorio.
```

#### 1b. Resolución del directorio de la historia

1. Ruta explícita `{story_path}` si se proporcionó
2. Glob `$SPECS_BASE/specs/stories/{story_id}-*/` — primera coincidencia cuyo nombre comienza con el ID
3. Si no se encuentra ninguno:
   ```
   ❌ No se encontró la historia {story_id} bajo $SPECS_BASE/specs/stories/

   Verifica el ID o ejecuta /release-generate-stories para generar la historia.
   ```
   Detener la ejecución.

#### 1c. Verificar existencia de artefactos de planning

Verificar que el directorio resuelto contiene los tres artefactos requeridos:

**Si falta `story.md`:**
```
❌ No se encontró story.md en: <ruta>

La historia debe existir antes de ejecutar la implementación.
Sugerencia: ejecuta /release-generate-stories para generar la historia primero.
```

**Si falta `design.md`:**
```
❌ No se encontró design.md en: <ruta>

La implementación requiere el diseño técnico de la historia.
Sugerencia: ejecuta /story-plan {story_id} para generar los artefactos de planning.
```

**Si falta `tasks.md`:**
```
❌ No se encontró tasks.md en: <ruta>

La implementación requiere el plan de tareas de la historia.
Sugerencia: ejecuta /story-plan {story_id} para generar los artefactos de planning.
```

Si alguno de los tres artefactos falta, detener la ejecución **sin implementar ninguna tarea**.

#### 1d. Verificar precondición de estado

Leer el frontmatter de `story.md` y verificar que se cumple alguna de las siguientes condiciones:

```
Precondición válida si:
  (status: READY-FOR-IMPLEMENT  AND substatus: DONE)        ← ejecución inicial o re-implementación tras code review
  OR
  (status: IMPLEMENTING          AND substatus: IN-PROGRESS) ← reanudación de implementación parcial
```

**Si la precondición NO se cumple:**
```
❌ La historia <story_id> no está en un estado válido para implementar.

   Estado actual: status: <valor_actual> / substatus: <valor_actual>

   story-implement requiere uno de los siguientes estados:
   · READY-FOR-IMPLEMENT/DONE      → ejecución inicial
   · IMPLEMENT/IN-PROGRESS     → reanudación de implementación parcial

   Para ejecución inicial: ejecuta /story-plan {story_id} para completar el planning.
   Si ya ejecutaste story-plan, verifica que story-analyze no reportó ERROREs.
```
Detener la ejecución **sin implementar ninguna tarea**.

**Si `status`/`substatus` no existen en el frontmatter**, tratar como `SPECIFY/TODO` y aplicar el mismo error anterior.

Registrar internamente:
- `$ENTRADA_STATUS`: el valor de `status` leído del frontmatter

Mostrar confirmación de inicio:
```
🚀 Iniciando implementación para: <story_id>
   Directorio: <ruta_directorio>
   Artefactos: story.md ✓ | design.md ✓ | tasks.md ✓
   Estado: READY-FOR-IMPLEMENT/DONE ✓        (si $ENTRADA_STATUS = READY-FOR-IMPLEMENT)
   Estado: IMPLEMENT/IN-PROGRESS ✓        (si $ENTRADA_STATUS = IMPLEMENTING)
```

---

### Paso 2 — Cargar Contexto de Planning

#### 2a. Leer story.md y extraer criterios de aceptación

Leer `story.md` del directorio resuelto.

Extraer y registrar internamente:
- `story_id` del frontmatter
- `story_title` (título de la historia)
- **Criterios de aceptación numerados como AC-1, AC-2 … AC-N** — fuente de verdad del comportamiento esperado

Construir la tabla interna de ACs:
```
AC-1: <descripción>
AC-2: <descripción>
...
```

#### 2b. Leer design.md y extraer componentes definidos

Leer `design.md` del directorio resuelto.

Extraer y registrar internamente:
- **Componentes afectados**: nombres de componentes de la sección "Componentes Afectados" o equivalente
- **Interfaces definidas**: nombre e información de contrato
- **Rutas de archivos** asociadas a cada componente (si están documentadas)

Construir la lista interna de componentes definidos:
```
[ComponenteA, ComponenteB, InterfazX, ...]
```

#### 2c. Leer tasks.md, detectar modo y verificar fix-directives.md

Leer `tasks.md` del directorio resuelto.

Extraer:
- Lista de tareas con patrón `- [ ] T\d+` o `- [ ] \d+\.\d+` — tareas pendientes
- Lista de tareas con patrón `- [x] T\d+` o `- [x] \d+\.\d+` — tareas ya completadas (no procesar)
- IDs de tareas y sus descripciones completas
- Agrupaciones por sección `##` como contexto de área técnica

Calcular y registrar internamente:
- `N_completadas` = número de tareas `[x]`
- `N_pendientes` = número de tareas `[ ]`
- `fix_directives_existe` = `true` si `$STORY_DIR/fix-directives.md` existe, `false` si no
- `modo` = `inicial` si `N_completadas = 0`; `reanudación` si `N_completadas > 0`

**Gate de salida anticipada (AC-3):** si `N_pendientes = 0` AND `N_completadas > 0`, mostrar el siguiente mensaje y terminar **sin modificar ningún archivo**:

```
ℹ️  No hay tareas pendientes en tasks.md — todas están completadas.
   Tareas completadas: <N_completadas>
   Sugerencia: ejecuta /story-code-review <story_id> si la historia está en IMPLEMENTING.
```

**Si `modo = reanudación`** (y `N_pendientes > 0`), mostrar el siguiente resumen antes de la primera tarea:

```
🔁 Modo reanudación detectado
   Tareas ya completadas (omitidas): <N_completadas>
   Tareas pendientes a ejecutar:     <N_pendientes>
   fix-directives.md:                <detectado | no encontrado>
```

#### 2d. Verificar tamaño de la historia

Si el número de tareas pendientes supera 20, mostrar advertencia y pedir confirmación:
```
⚠️ Esta historia tiene <N> tareas pendientes.

Procesar más de 20 tareas en una sesión puede saturar el contexto del LLM y
reducir la calidad de la implementación.

Recomendación: divide la historia con /story-split antes de continuar.

¿Deseas continuar de todas formas? (s/n)
```

Si el usuario responde `n`, detener la ejecución.
Si el usuario responde `s` o si la invocación es en modo Agent, continuar.

Mostrar resumen de carga:
```
📋 Contexto cargado:
   ACs encontrados:        <N>
   Componentes en diseño:  <N>
   Tareas pendientes:      <N>
   Tareas ya completadas:  <N>
```

#### 2e. Actualizar frontmatter a IMPLEMENT/IN-PROGRESS (si no está ya en ese estado)

Antes de ejecutar la primera tarea, verificar el estado de entrada registrado en `$ENTRADA_STATUS`:

- Si `$ENTRADA_STATUS` es `IMPLEMENTING` (el frontmatter ya tiene `status: IMPLEMENTING / substatus: IN-PROGRESS`): **omitir la escritura** — el estado ya es correcto, no se realiza ninguna modificación al archivo.
- Si `$ENTRADA_STATUS` es `READY-FOR-IMPLEMENT`: actualizar el frontmatter de `story.md`:
  - `status: IMPLEMENTING`
  - `substatus: IN-PROGRESS`

Esta verificación debe ocurrir antes de procesar cualquier tarea del Paso 3.

#### 2f. Cargar criterios DoD IMPLEMENTING

Intentar localizar `$SPECS_BASE/policies/definition-of-done-story.md`.

**Si el archivo no existe:**
```
⚠️ definition-of-done-story.md no encontrado en $SPECS_BASE/policies/ — se omitirá la validación DoD IMPLEMENTING
```
Registrar internamente `$DOD_IMPLEMENTING_CRITERIA = []` y continuar.

**Si el archivo existe:**
1. Buscar el primer encabezado h3 (`###`) cuyo texto contenga, case-insensitive, alguno de los términos: `IMPLEMENTING`, `IMPLEMENTANDO` o `IMPLEMENTACIÓN`
2. Registrar en log el encabezado encontrado
3. **Si no se encuentra ningún encabezado coincidente:**
   ```
   ⚠️ Sección IMPLEMENTING no encontrada en DoD — se omitirá la validación DoD IMPLEMENTING
   ```
   Registrar internamente `$DOD_IMPLEMENTING_CRITERIA = []` y continuar.
4. **Si se encontró la sección:** extraer todas las líneas `- [ ] <texto>` y `- [x] <texto>` dentro de esa sección como lista de criterios planos; registrar internamente como `$DOD_IMPLEMENTING_CRITERIA`

Mostrar resumen de carga DoD:
```
📋 DoD IMPLEMENTING: <N> criterios cargados desde <ruta>      (si encontrado)
📋 DoD IMPLEMENTING: ⚠️ no disponible — se omitirá la validación  (si no encontrado)
```

---

### Paso 3 — Implementar Tareas en Orden TDD

Para cada tarea pendiente (en el orden en que aparecen en `tasks.md`):

#### 3a. Pre-check de componentes

Antes de implementar la tarea, verificar si los componentes mencionados en la descripción de la tarea están presentes en la lista de componentes de `design.md`.

Estrategia de matching:
1. Buscar nombres de componentes del diseño en el texto de la descripción de la tarea
2. Si la tarea pertenece a un grupo `##` cuyo nombre coincide con un componente del diseño, considerar implícitamente cubierta
3. Si la descripción de la tarea no menciona ningún componente conocido, considerar implementable (no bloquear por ambigüedad de naming)

#### 3b. Si componente no definido → Bloquear tarea

Si la búsqueda detecta que la tarea menciona explícitamente un componente que **no existe** en `design.md`:

Marcar la tarea en `tasks.md` de inmediato:
```
- [~] T001: <descripción>
```

Registrar en la lista interna de bloqueos:
```
T001: Componente "<nombre>" no encontrado en design.md — requiere aclaración
```

Mostrar:
```
[T001] ⚠️ bloqueada — componente "<nombre>" no definido en design.md
```

Continuar con la siguiente tarea sin detener el pipeline.

#### 3c. Si tarea es implementable → Detección de tarea especial o Ciclo TDD

Mostrar:
```
[T001] → implementando…
```

**Detección de tarea especial:** al inicio del ciclo, antes del TDD estándar, evaluar la descripción de la tarea:

```
si descripción_tarea.trim().toLowerCase() == "implementar fix-directives.md":
  ejecutar sub-flujo de fix-directives (ver abajo)
sino:
  ejecutar ciclo TDD estándar (Paso TDD-1, TDD-2, TDD-3)
```

> **Nota de diseño (D-3):** La comparación usa el literal exacto `"implementar fix-directives.md"` (normalizado con trim + lowercase). Este es el texto canónico generado por `story-code-review` en el Paso 4g.1. Si el nombre en `tasks.md` difiere por cualquier motivo (typo, traducción manual), la tarea se procesará como ciclo TDD estándar en lugar del sub-flujo — degradación controlada sin error fatal. Ver justificación en `design.md D-3`.

**Sub-flujo: Implementar fix-directives.md**

**Sub-paso 1 — Verificar existencia:**
Verificar que `$STORY_DIR/fix-directives.md` existe.

Si no existe:
- Marcar la tarea como `[~]` en `tasks.md` con mensaje: `fix-directives.md no encontrado en <$STORY_DIR>`
- Mostrar: `[T] ⚠️ bloqueada — fix-directives.md no encontrado en <ruta>`
- Continuar con la siguiente tarea sin ejecutar el resto del sub-flujo.

**Sub-paso 2 — Leer y aplicar correcciones:**
Leer `fix-directives.md` y extraer la tabla "Instrucciones de corrección" (columnas: `#`, `Archivo:Línea`, `Dimensión`, `Severidad`, `Hallazgo`, `Acción requerida`).

Para cada fila de la tabla:
1. Extraer `archivo` y `línea` de la columna `Archivo:Línea` (texto antes y después del último `:`)
2. Verificar que el archivo existe en el repositorio
   - Si el archivo no existe: mostrar `⚠️ archivo no encontrado: <ruta>` y continuar con la siguiente corrección **sin abortar las correcciones restantes**
3. Aplicar la corrección indicada en `Acción requerida` en el archivo y línea especificados
4. Mostrar: `[T] 💻 corregido: <ruta>`

**Sub-paso 3 — Marcar completada:**
Al completar todas las correcciones (incluso si alguna fue omitida por archivo inexistente), continuar al Paso 3d para marcar la tarea como `[x]` en `tasks.md`.

---

**Paso TDD-1: Generar test fallido**

Leer el AC correspondiente de la lista interna. Determinar el AC relevante para la tarea buscando referencias a `AC-N` en la descripción de la tarea o inferiendo por el contexto de la sección `##`.

Generar un archivo de test que:
- Importa / referencia los componentes que la tarea debe crear o modificar
- Verifica el comportamiento esperado descrito en el AC correspondiente
- Está escrito en el lenguaje y framework del proyecto (inferir de archivos existentes; si no hay referencia, usar el lenguaje más probable dado el stack en `constitution.md` o en el repo)
- Fallará inicialmente porque el código de producción aún no existe

Mostrar la ruta del test generado:
```
[T001]   📝 test: <ruta/del/test>
```

**Paso TDD-2: Generar código de producción mínimo**

Generar el código de producción mínimo necesario para:
- Satisfacer el test generado en TDD-1
- Respetar el contrato de interfaz definido en `design.md`
- Seguir las convenciones de código de `constitution.md`

No sobre-ingeniería: el código debe hacer pasar el test, nada más.

Mostrar la(s) ruta(s) de los archivos de producción generados:
```
[T001]   💻 código: <ruta/del/archivo>
```

**Paso TDD-3: Refactorizar (si aplica)**

Si el código generado tiene duplicaciones obvias, nombres poco claros, o puede simplificarse sin cambiar el comportamiento, aplicar refactor mínimo. No refactorizar por convención si el código ya es claro.

#### 3d. Marcar tarea completada en tasks.md

Inmediatamente al completar los pasos TDD, actualizar `tasks.md`:
```
- [x] T001: <descripción>
```

La actualización es por tarea, no en batch al final.

#### 3e. Mostrar progreso

```
[T001] ✓ completado
```

---

### Paso 4 — Generar Reporte Final y Actualizar Estado

Al finalizar el procesamiento de todas las tareas (completadas + bloqueadas), ejecutar los siguientes pasos en orden:

#### 4a. Generar `implement-report.md`

Generar `implement-report.md` en el directorio de la historia.

El reporte **no se actualiza incrementalmente**: se genera como artefacto de cierre al finalizar todas las tareas.

**Estructura del reporte:**

```markdown
---
type: implement-report
id: <FEAT-NNN>
slug: <story_id>-implement-report
title: "Implement Report: <story_title>"
story: <FEAT-NNN>
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
---

# Reporte de Implementación: <story_title>

## Resumen

| Métrica | Valor |
|---|---|
| Historia | <FEAT-NNN> |
| Total de tareas | <N> |
| Tareas completadas | <N_completadas_en_esta_ejecución> |
| Tareas bloqueadas | <N_bloqueadas> |
| Tareas omitidas (ya completadas antes) | <N_completadas> |
| Fecha de implementación | <YYYY-MM-DD> |

**Estado:** ✅ Implementación completa / ⚠️ Implementación completada con tareas pendientes de aclaración

---

## Tabla de Estado por Tarea

Si `N_completadas > 0` (modo reanudación), incluir primero las tareas previas:

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | <descripción tarea previa [x]> | ✓ completado (ejecución anterior) | — |
| T002 | <descripción tarea nueva [x]> | ✓ completado | `ruta/test.ts`, `ruta/codigo.ts` |
| T003 | <descripción tarea bloqueada> | ⚠️ requiere aclaración | — |

Si `N_completadas = 0` (ejecución inicial), omitir las filas de "ejecución anterior".

---

## Tareas Bloqueadas

<!-- Solo si hay tareas en [~] -->

| Tarea | Razón del bloqueo | Acción recomendada |
|---|---|---|
| T002 | Componente "X" no encontrado en design.md | Definir "X" en design.md y re-ejecutar /story-implement-tasks |

---

## Cumplimiento DoD — Fase IMPLEMENTING

<!-- Completar con resultados del sub-paso 4g -->

**Si `$DOD_IMPLEMENTING_CRITERIA` está vacío:**
```
⚠️ DoD IMPLEMENTING no encontrado — se omitió la validación.
   Verifica que $SPECS_BASE/policies/definition-of-done-story.md contiene la sección "IMPLEMENTING".
```

**Si hay criterios evaluados**, incluir la siguiente tabla con los resultados del sub-paso 4g:

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | <criterio del DoD> | ✓ / ❌ / ⚠️ | <descripción breve de la evidencia> |

**Resumen:** N/Total criterios ✓

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.
Este skill genera el código pero no ejecuta ni verifica que los tests pasen.

Pasos recomendados:
1. Ejecutar el suite de tests del proyecto
2. Si algún test falla, revisar el código generado y ajustar manualmente
3. Consultar `design.md` para verificar que la implementación respeta las interfaces definidas
```

#### 4g. Evaluar criterios DoD IMPLEMENTING

**Si `$DOD_IMPLEMENTING_CRITERIA` está vacío** (no se cargó la sección DoD en el paso 2f):
- Registrar `$DOD_RESULT = []` y `$DOD_BLOQUEADO = false`
- Completar la sección "Cumplimiento DoD — Fase IMPLEMENTING" en `implement-report.md` con el aviso de sección no encontrada
- Continuar sin bloquear la transición de estado

**Si `$DOD_IMPLEMENTING_CRITERIA` tiene criterios:**

Para cada criterio, evaluar semánticamente contra:
- Contenido de `tasks.md` (tareas completadas con `[x]`)
- Tabla de estado en `implement-report.md` (archivos generados por tarea)
- Código generado durante la implementación

Clasificar cada criterio como:
- `✓` — evidencia clara de cumplimiento presente en los artefactos
- `❌` — evidencia clara de incumplimiento (ej. tarea de código ignorada, criterio explícitamente violado)
- `⚠️` — evidencia insuficiente, criterio requiere ejecución externa, o no evaluable desde los artefactos

**Regla de duda obligatoria:** ante incertidumbre, usar `⚠️` en lugar de `❌`.

**Criterios de ejecución de tests o CI:** clasificar siempre como `⚠️` con evidencia: `"Requiere ejecución de tests — no evaluable por story-implement"`.

Registrar internamente `$DOD_RESULT` (tabla de criterio | resultado | evidencia).

Calcular:
- `N_dod_ok` = criterios con `✓`
- `N_dod_warning` = criterios con `⚠️`
- `N_dod_error` = criterios con `❌`
- `$DOD_BLOQUEADO` = `true` si `N_dod_error > 0`; `false` en caso contrario

Completar la sección "Cumplimiento DoD — Fase IMPLEMENTING" en `implement-report.md` con la tabla resultante y la línea de resumen `**Resumen:** N_dod_ok/Total criterios ✓`.

#### 4b. Actualizar frontmatter a IMPLEMENT/DONE (condicional según DoD)

**Si `$DOD_BLOQUEADO = false`** (no hay criterios DoD con `❌`):
- Actualizar el frontmatter de `story.md`:
  - `status: IMPLEMENTING`
  - `substatus: DONE`

**Si `$DOD_BLOQUEADO = true`** (hay al menos un criterio DoD con `❌`):
- NO actualizar el frontmatter — `story.md` permanece en `IMPLEMENT/IN-PROGRESS`
- Mostrar al usuario los criterios DoD fallidos:
  ```
  ⚠️ Transición a IMPLEMENTING bloqueada por DoD-ERRORs:

  <lista de criterios con ❌ y su evidencia>

  Resuelve los criterios pendientes antes de avanzar a code review.
  ```

#### 4c. Actualizar checklist del release padre

Leer el campo `parent` del frontmatter de `story.md` (ej. `EPIC-12-story-sdd-workflow`).

Buscar el archivo `release.md` correspondiente en: `$SPECS_BASE/specs/releases/<parent>-*/release.md`

**Si se encuentra `release.md`:**
- Localizar la línea que contiene el `story_id` (patrón `FEAT-NNN`) en el checklist del release
- Cambiar `- [ ]` por `- [x]` en esa línea
- Registrar: `Release checklist: ✓ actualizado en <ruta>/release.md`

**Si NO se encuentra `release.md` o la historia no está en el checklist:**
- Emitir WARNING en consola: `⚠️ No se pudo actualizar el release checklist: <razón>`
- Agregar en `implement-report.md` una sección de advertencia:
  ```
  ⚠️ Release checklist no actualizado: <razón>
  ```
- Continuar sin bloquear — la transición a `IMPLEMENT/DONE` ya fue aplicada

#### 4d. Sección "Tareas Bloqueadas"

Incluir esta sección **solo si hay al menos una tarea con estado `- [~]`**. Listar cada tarea bloqueada con su razón de bloqueo y la acción recomendada para desbloquearla.

#### 4e. Estado final del reporte

**Si todos los pasos completaron sin bloqueos:**
```
✅ Implementación completa

Todas las tareas han sido implementadas. Ejecuta los tests del proyecto para verificar.
```

**Si hay bloqueos:**
```
⚠️ Implementación completada con tareas pendientes de aclaración

<N> tarea(s) requieren aclaración antes de poder implementarse.
Revisa la sección "Tareas Bloqueadas" en implement-report.md para los detalles.
```

#### 4f. Nota sobre los tests

Siempre añadir al reporte:
```
Los tests generados deben ejecutarse manualmente con el runner del proyecto.
```

---

## Salida

### Artefactos generados

| Artefacto | Ruta | Descripción |
|---|---|---|
| `implement-report.md` | `$SPECS_BASE/specs/stories/<FEAT-NNN>/implement-report.md` | Reporte con estado por tarea, DoD y trazabilidad |
| `story.md` (actualizado) | mismo directorio | Frontmatter → `IMPLEMENT/DONE` (o `IMPLEMENT/IN-PROGRESS` si hay DoD-ERRORs) |
| `tasks.md` (actualizado) | mismo directorio | Tareas marcadas `[x]` (completadas) o `[~]` (bloqueadas) |
| `release.md` (actualizado) | `$SPECS_BASE/specs/releases/<parent>/release.md` | Checklist con `[x]` para la historia completada (si existe) |
| Archivos de test | según stack del proyecto | Tests generados por ciclo TDD (uno por tarea completada) |
| Archivos de producción | según stack del proyecto | Código de producción generado por ciclo TDD |

### Resumen para el usuario

Al terminar, mostrar:

```
─────────────────────────────────────────────────────────────
 Implementación: <story_id> — <story_title>
─────────────────────────────────────────────────────────────
 Tarea  │ Estado                │ Archivos
─────────────────────────────────────────────────────────────
 T001   │ ✓ completado          │ test_foo.ts, foo.ts
 T002   │ ⚠️ requiere aclaración │ —
 T003   │ ✓ completado          │ test_bar.ts, bar.ts
─────────────────────────────────────────────────────────────
 Total: <N> tareas │ <N_x> completadas │ <N_b> bloqueadas
─────────────────────────────────────────────────────────────

📄 Reporte generado: <ruta>/implement-report.md
📋 Estado story.md: IMPLEMENT/DONE ✓             (si $DOD_BLOQUEADO = false)
📋 Estado story.md: IMPLEMENT/IN-PROGRESS ✓               (si $DOD_BLOQUEADO = true)
📋 Release checklist: <✓ actualizado en <ruta>/release.md | ⚠️ no actualizado — <razón>>
📋 DoD IMPLEMENTING: {N_dod_ok}/{Total} criterios ✓          (si DoD fue evaluado)
📋 DoD IMPLEMENTING: ⚠️ no evaluado (sección no encontrada)  (si DoD no disponible)

✅ Implementación completa                                    (si no hay DoD-ERRORs ni bloqueos)
```

O si hay DoD-ERRORs:

```
⚠️ Implementación completada con DoD-ERRORs pendientes
   Revisa implement-report.md → sección "Cumplimiento DoD — Fase IMPLEMENTING"
📋 Estado story.md: IMPLEMENT/IN-PROGRESS (transición bloqueada por DoD-ERRORs)
📋 DoD IMPLEMENTING: {N_dod_ok}/{Total} criterios ✓ | {N_dod_error} criterios ❌
```

O si hay bloqueos de tareas (sin DoD-ERRORs):

```
⚠️ Implementación completada con tareas pendientes de aclaración
   Revisa implement-report.md → sección "Tareas Bloqueadas"
📋 Estado story.md: IMPLEMENT/DONE ✓
📋 Release checklist: <✓ actualizado | ⚠️ no actualizado — <razón>>
📋 DoD IMPLEMENTING: {N_dod_ok}/{Total} criterios ✓
```
