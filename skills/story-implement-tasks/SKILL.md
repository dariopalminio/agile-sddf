---
name: story-implement-tasks
description: >-
  Implementa una historia SDD tarea por tarea con TDD, generando implement-report.md.
  Usar después de story-plan para completar el flujo SDD.
  Invocar para "story-implement-tasks", "implementar historia", "codificar historia",
  "TDD historia" o "implementar tareas".
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
- Aplica las correcciones de `fix-directives.md` cuando el archivo existe (rework tras `story-code-review`, `story-verify` o `story-acceptance`, pre-paso 2f), sin depender de una tarea en `tasks.md`, y anuncia el gate de origen desde su `based-on`
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
[story.md: PLAN/DONE]                   ← precondición inicial: planificación aprobada por story-analyze (viene de story-plan/story-analyze)
[story.md: IMPLEMENT/TODO]              ← rework devuelto por story-code-review, story-verify o story-acceptance
                                          (señal de correcciones: fix-directives.md presente)
[story.md: IMPLEMENT/IN-PROGRESS]    ← precondición reanudación: tras DoD-ERRORs o ciclo interrumpido
     ↓
story-implement  → Entry point de la implementación: ejecuta TDD tarea por tarea  ← aquí
     │   Al iniciar: story.md → IMPLEMENT/IN-PROGRESS
     │   Al finalizar: story.md → IMPLEMENT/DONE + epic.md checklist actualizado
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
| `story.md` | `changes/<STORY-NNN>-<slug>/story.md` | ✓ obligatorio |
| `design.md` | `changes/<STORY-NNN>-<slug>/design.md` | ✓ obligatorio |
| `tasks.md` | `changes/<STORY-NNN>-<slug>/tasks.md` | ✓ obligatorio |
| `fix-directives.md` | `changes/<STORY-NNN>-<slug>/fix-directives.md` | opcional — señal de rework escrita por `story-code-review`, `story-verify` o `story-acceptance` (veredicto `NEEDS-CHANGES`, ADR-0022); su presencia dispara el pre-paso 2f; `round` y `based-on` los escribe el gate (este skill solo los lee) |
| DoD de la etapa `implement` | `docs/guardrails/dod-story-implement.md` (ver `## DoD aplicable`) | opcional |

---

## Parámetros

| Parámetro | Tipo | Descripción |
|---|---|---|
| `{story_id}` | posicional | ID de la historia (ej. `STORY-059`) |
| `{story_path}` | posicional opcional | Ruta explícita al directorio; sobreescribe la resolución por glob |

Si no se proporciona ningún argumento, el skill lo solicita interactivamente.

---

## Precondiciones

El frontmatter de `story.md` debe cumplir alguna de las siguientes condiciones antes de ejecutar:

| Condición | status | substatus | Descripción |
|---|---|---|---|
| Ejecución inicial | `PLAN` | `DONE` | planificación aprobada por story-analyze (story-plan / story-analyze) |
| Rework | `IMPLEMENT` | `TODO` | rework devuelto por story-code-review, story-verify o story-acceptance (señal de correcciones: `fix-directives.md`) |
| Reanudación | `IMPLEMENT` | `IN-PROGRESS` | reanudación tras DoD-ERRORs o ciclo interrumpido |

Durante la ventana de transición de ADR-0022 (hasta 7.0.0) el Paso 1d acepta además un valor legado con aviso y lo trata como `IMPLEMENT/TODO` o `PLAN/DONE`. Cualquier otro estado detiene la ejecución con error descriptivo.

---

## Dependencias

| Skill / Herramienta | Rol |
|---|---|
| Contrato de layout fijo | Resuelve `REPO_ROOT` y usa `changes/`, `docs/templates/` y `docs/guardrails/` (ADR-0023) antes de cualquier operación. |
| `story-code-review` | Skill downstream que consume `implement-report.md` para revisar la implementación |

---

## DoD aplicable

| Elemento | Valor |
|---|---|
| Etapa | `implement` |
| Archivo | `docs/guardrails/dod-story-implement.md` |
| Override | `sddf.config.yaml › guardrails.dod.story.implement` |
| Enforcement | el campo `enforcement` del frontmatter del archivo: `error` bloquea la transición; `warn` informa los criterios incumplidos sin bloquear |

Resolución (primera coincidencia):

1. `sddf.config.yaml › guardrails.dod.story.implement` → `docs/guardrails/<slug>.md`
2. Convención: `docs/guardrails/dod-story-implement.md`
3. Ninguno existe → emitir `⚠️ DoD de la etapa implement no encontrado (probado: <rutas>) → crea el archivo o ejecuta /memory-system migrate --from=dod-monolithic` y continuar sin validación DoD IMPLEMENT.

Se carga **solo** ese archivo: sus criterios son todas sus líneas `- [ ]`. Es el quality gate antes de escribir `IMPLEMENT/DONE`.

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
| Precondición inicial (ejecución nueva) | `PLAN` | `DONE` |
| Precondición rework (devuelta por un gate con `NEEDS-CHANGES`) | `IMPLEMENT` | `TODO` |
| Precondición reanudación (parcialmente implementada) | `IMPLEMENT` | `IN-PROGRESS` |
| Antes de la primera tarea (Paso 2) | `IMPLEMENT` | `IN-PROGRESS` |
| Después de generar `implement-report.md` (Paso 4) | `IMPLEMENT` | `DONE` |

### Reglas de comportamiento

- **Fail-fast en artefactos faltantes:** si falta cualquiera de los tres artefactos obligatorios, detener la ejecución antes de implementar cualquier tarea.
- **Actualización incremental de tasks.md:** marcar cada tarea como `[x]` o `[~]` inmediatamente al completarla o bloquearla, nunca en batch al final.
- **No bloquear el pipeline por tareas con componentes no definidos:** marcar como `[~]` y continuar con la siguiente tarea.
- **Gate de tareas completadas:** si `N_pendientes = 0` y `N_completadas > 0` y no existe `fix-directives.md` y la entrada no es `IMPLEMENT/TODO`, detener la ejecución sin modificar ningún archivo. Si `fix-directives.md` existe, el flujo continúa para aplicar las correcciones (pre-paso 2f). Si la entrada es `IMPLEMENT/TODO`, el flujo continúa hasta el Paso 4 para devolver la historia a `IMPLEMENT/DONE`.
- **Correcciones por presencia de `fix-directives.md`:** el disparador es la existencia del archivo, no una tarea en `tasks.md`. Este skill nunca escribe en `fix-directives.md` (escritores: `story-code-review`, `story-verify` y `story-acceptance`, ADR-0022).
- **No reimplementar artefactos de planning:** si los artefactos ya existen y son válidos, no sobrescribirlos.
- **Transición de estado bloqueada por DoD-ERRORs:** si hay criterios DoD con `❌`, el frontmatter permanece en `IMPLEMENT/IN-PROGRESS`.

---

## Flujo de ejecución

### Paso 0 — Resolver contexto local

<!-- SDDF-FIXED-LAYOUT: v1 -->

Resuelve `REPO_ROOT` (raíz del repositorio) y usa rutas fijas relativas a él:
work items en `changes/` (archivo en `changes/archive/`), especificación viva en `specs/`, templates en `docs/templates/` y DoD en `docs/guardrails/`.
El layout no es configurable (ADR-0023).

Resuelve `CLI_ROOT` (directorio de skills del runtime) solo para localizar el seed del template de épica.

El diagnóstico de entorno se solicita explícitamente con `/skill-preflight`; este workflow no lo invoca en su hot path.


### Paso 1 — Resolver Parámetros de Entrada

#### 1a. Argumentos aceptados

- `{story_id}` — identificador de la historia (ej. `STORY-059`)
- `{story_path}` — ruta explícita al directorio de la historia (opcional, sobreescribe la resolución por glob)

Si no se proporcionó ningún argumento, preguntar:
```
¿Qué historia deseas implementar?
Proporciona el ID (ej. STORY-059) o la ruta completa al directorio.
```

#### 1b. Resolución del directorio de la historia

1. Ruta explícita `{story_path}` si se proporcionó: se acepta solo si, normalizada y relativa a `REPO_ROOT`, tiene la forma `changes/STORY-NNN-<slug>/` (no `changes/archive/…`) y contiene `story.md`. Si no:
   ```
   ❌ La ruta {story_path} no es una historia de changes/ (se esperaba changes/STORY-NNN-<slug>/)
   ```
   Detener la ejecución sin escribir ningún archivo.
2. Glob `changes/{story_id}-*/` — primera coincidencia cuyo nombre comienza con el ID seguido de guion (nunca se consulta el layout legado ni `changes/archive/`)
3. Si no se encuentra ninguno:
   ```
   ❌ No se encontró la historia {story_id} en changes/

   Verifica el ID o ejecuta /epic-generate-stories para generar la historia.
   ```
   Detener la ejecución.

#### 1c. Verificar existencia de artefactos de planning

Verificar que el directorio resuelto contiene los tres artefactos requeridos:

**Si falta `story.md`:**
```
❌ No se encontró story.md en: <ruta>

La historia debe existir antes de ejecutar la implementación.
Sugerencia: ejecuta /epic-generate-stories para generar la historia primero.
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
  (status: PLAN                 AND substatus: DONE)        ← planificación aprobada por story-analyze
  OR
  (status: IMPLEMENT            AND substatus: TODO)        ← rework devuelto por story-code-review, story-verify o story-acceptance (señal de correcciones: fix-directives.md)
  OR
  (status: IMPLEMENT            AND substatus: IN-PROGRESS) ← reanudación tras DoD-ERRORs o ciclo interrumpido
  OR
  (status: READY-FOR-IMPLEMENT  AND substatus: DONE)        ← valor legado de la ventana de transición (ADR-0022): se acepta con aviso hasta 7.0.0
```

Cualquier otro par se rechaza, incluidos `READY-FOR-DEV` con cualquier `substatus` y `READY-FOR-IMPLEMENT` con un `substatus` distinto de `DONE`.

**Si la precondición NO se cumple:**
```
❌ La historia <story_id> no está en un estado válido para implementar.

   Estado actual: status: <valor_actual> / substatus: <valor_actual>

   story-implement requiere uno de los siguientes estados:
   · PLAN/DONE                 → planificación aprobada por story-analyze
   · IMPLEMENT/TODO            → rework devuelto por story-code-review, story-verify o story-acceptance (señal de correcciones: fix-directives.md)
   · IMPLEMENT/IN-PROGRESS     → reanudación tras DoD-ERRORs o ciclo interrumpido
   · READY-FOR-IMPLEMENT/DONE  (valor legado, se acepta con aviso hasta 7.0.0 — ADR-0022)

   Para ejecución inicial: ejecuta /story-plan {story_id} para completar el planning.
   Si ya ejecutaste story-plan, verifica que story-analyze no reportó ERROREs.
```
Detener la ejecución **sin implementar ninguna tarea**.

**Si `status`/`substatus` no existen en el frontmatter**, tratar como `SPECIFY/TODO` y aplicar el mismo error anterior.

Registrar internamente:
- `$ENTRADA_STATUS`: el valor de `status` leído del frontmatter
- `$ENTRADA_SUBSTATUS`: el valor de `substatus` leído del frontmatter (necesario porque `IMPLEMENT/TODO` e `IMPLEMENT/IN-PROGRESS` comparten `status`)

**Valor legado de la ventana de transición (ADR-0022):** si el par leído es `READY-FOR-IMPLEMENT/DONE`, registrar `$ENTRADA_LEGADO = true` y clasificarlo por la existencia de `<ruta_directorio>/implement-report.md` (solo existencia: no se lee su contenido y un archivo vacío cuenta como existente):

| `implement-report.md` | Equivalente | `$ENTRADA_STATUS` / `$ENTRADA_SUBSTATUS` |
|---|---|---|
| existe | `IMPLEMENT/TODO` | `IMPLEMENT` / `TODO` |
| no existe | `PLAN/DONE` | `PLAN` / `DONE` |

Emitir una sola vez, antes del bloque de inicio:
```
[WARN] Valor legado READY-FOR-IMPLEMENT/DONE (ADR-0022): se acepta durante la ventana de transición y se retira en 7.0.0 — se trata como <equivalente>
```
y sustituir **en memoria** `$ENTRADA_STATUS`/`$ENTRADA_SUBSTATUS` por el equivalente. `story.md` no se escribe en este punto: sale del valor legado con la transición normal de 2e. Desde aquí, todas las reglas (gate anticipado y aviso de 2c, 2e, 2f) leen el equivalente, sin ramas propias del valor legado. En cualquier otra entrada admitida, `$ENTRADA_LEGADO = false`. La ventana termina en 7.0.0, que retira este alias.

La entrada `IMPLEMENT/TODO` indica que un gate posterior devolvió la historia, pero **no** activa por sí sola las correcciones: el pre-paso 2f lo dispara solo la presencia de `fix-directives.md`.

Mostrar confirmación de inicio (con el valor legado se muestra el equivalente, como si se hubiera leído):
```
🚀 Iniciando implementación para: <story_id>
   Directorio: <ruta_directorio>
   Artefactos: story.md ✓ | design.md ✓ | tasks.md ✓
   Estado: PLAN/DONE ✓                    (si la entrada es PLAN/DONE)
   Estado: IMPLEMENT/TODO ✓  → IMPLEMENT/IN-PROGRESS   (si la entrada es IMPLEMENT/TODO)
   Estado: IMPLEMENT/IN-PROGRESS ✓        (si la entrada es IMPLEMENT/IN-PROGRESS)
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

**Gate de salida anticipada (AC-3 de STORY-067):** si `N_pendientes = 0` AND `N_completadas > 0` AND `fix_directives_existe = false` AND la entrada no es `IMPLEMENT/TODO`, mostrar el siguiente mensaje y terminar **sin modificar ningún archivo**:

```
ℹ️  No hay tareas pendientes en tasks.md — todas están completadas.
   Tareas completadas: <N_completadas>
   Sugerencia: ejecuta /story-code-review <story_id> si la historia está en IMPLEMENT.
```

**Si `fix_directives_existe = true`** el gate NO aplica aunque no haya tareas pendientes: la historia está en rework (STORY-089) y el flujo continúa 2d → 2e → 2f (aplicar correcciones) → Paso 3 (solo si `N_pendientes > 0`) → Paso 4. Con `N_pendientes = 0` el bucle de tareas del Paso 3 no se ejecuta y se pasa directamente al Paso 4.

**Si la entrada es `IMPLEMENT/TODO`** (`$ENTRADA_STATUS = IMPLEMENT` y `$ENTRADA_SUBSTATUS = TODO`) el gate tampoco aplica, aunque no haya tareas pendientes ni `fix-directives.md`: un gate posterior devolvió la historia y debe volver a `IMPLEMENT/DONE` para pasar de nuevo por `/story-code-review`. El flujo es el del rework sin tareas pendientes: 2d → 2e (`IMPLEMENT/IN-PROGRESS`) → 2f solo si `fix_directives_existe = true` → Paso 3 solo si `N_pendientes > 0` → Paso 4. Sin `fix-directives.md`, `$FIX_DIRECTIVES_APPLIED = false`: el resumen y `implement-report.md` no muestran `Correcciones de fix-directives.md` ni ronda. Con el valor legado, 2c lee el equivalente clasificado en 1d: si se trata como `IMPLEMENT/TODO`, no sale por el gate anticipado; si se trata como `PLAN/DONE`, el gate se aplica igual que a una entrada `PLAN/DONE`.

**Aviso de `IMPLEMENT/TODO` sin directivas:** si `fix_directives_existe = false` y la entrada es `IMPLEMENT/TODO` (`$ENTRADA_STATUS = IMPLEMENT` y `$ENTRADA_SUBSTATUS = TODO`), emitir:

```
[WARN] story.md está en IMPLEMENT/TODO sin fix-directives.md — se continúa sin modo rework (la única señal de rework es fix-directives.md)
```

El aviso no detiene la ejecución ni cambia el camino descrito arriba, y no lee `verify-report.md` ni `acceptance-report.md` para deducir el rework.

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

Antes de ejecutar la primera tarea, verificar el estado de entrada registrado en `$ENTRADA_STATUS` y `$ENTRADA_SUBSTATUS`:

- Si la entrada es `IMPLEMENT/IN-PROGRESS` (`$ENTRADA_STATUS = IMPLEMENT` **y** `$ENTRADA_SUBSTATUS = IN-PROGRESS`): **omitir la escritura** — el estado ya es correcto, no se realiza ninguna modificación al archivo.
- En cualquier otra entrada admitida (`PLAN/DONE` o `IMPLEMENT/TODO`, también cuando vienen del valor legado): actualizar el frontmatter de `story.md`:
  - `status: IMPLEMENT`
  - `substatus: IN-PROGRESS`

Esta verificación debe ocurrir antes de procesar cualquier tarea del Paso 3.

#### 2f. Aplicar correcciones de fix-directives.md (pre-paso de rework)

**Condición:** ejecutar este sub-paso **una sola vez** y únicamente si `fix_directives_existe = true` (calculado en 2c). Si el archivo no existe, omitir el sub-paso sin mensaje y registrar `$FIX_DIRECTIVES_APPLIED = false`.

**2f.1 — Leer la ronda y el origen:**
Leer el campo `round` del frontmatter de `$STORY_DIR/fix-directives.md`. Si el campo no existe o no es un entero ≥ 1, usar `1` como valor por defecto (archivo legado). Registrar como `$FIX_ROUND`. **NUNCA escribir ni completar `round` en `fix-directives.md`**: lo escriben los gates (`story-code-review`, `story-verify`, `story-acceptance`, ADR-0022); este skill solo lo lee.

Leer el campo `based-on` del frontmatter y registrar `$REWORK_ORIGIN`: `code-review-report.md` ⇒ `/story-code-review`; `verify-report.md` ⇒ `/story-verify`; `acceptance-report.md` ⇒ `/story-acceptance`. Cualquier otro valor o campo ausente ⇒ `$REWORK_ORIGIN = null` y emitir `[WARN] fix-directives.md sin based-on reconocible — origen del rework desconocido`; se continúa. El origen solo produce la línea `Origen:`: no cambia la condición de rework (`fix_directives_existe`) ni cómo se aplican las filas.

Mostrar:
```
🔁 Correcciones de fix-directives.md (ronda <$FIX_ROUND>)
   Origen: <gate> (<based-on>)
```
- Con `$REWORK_ORIGIN = /story-code-review`: `   Origen: /story-code-review (code-review-report.md)`.
- Con `/story-verify` o `/story-acceptance`: `   Origen: <gate> (<based-on>) — tras /story-code-review, vuelve a pasar <gate>` (p. ej. `   Origen: /story-acceptance (acceptance-report.md) — tras /story-code-review, vuelve a pasar /story-acceptance`).
- Con `$REWORK_ORIGIN = null`: `   Origen: desconocido`.

**2f.2 — Leer y aplicar correcciones:**
Leer `fix-directives.md` y extraer la tabla "Instrucciones de corrección" (columnas: `#`, `Archivo:Línea`, `Dimensión`, `Severidad`, `Hallazgo`, `Acción requerida`) y la sección "Lista blanca de archivos permitidos para modificar". Si la tabla no es legible o falta la sección de lista blanca, aplicar la degradación descrita en "Manejo de errores" (nunca detener la ejecución por ello). Una sección de lista blanca **presente sin viñetas** (p. ej. `Vacía: un rechazo de aceptación no tiene archivo de origen…`) no es un error ni emite aviso: no hay alcance declarado, y cada archivo existente que se modifique se registra en `$FIX_CORRECTED`.

Para cada fila de la tabla:
1. Extraer `archivo` y `línea` de la columna `Archivo:Línea` (texto antes y después del último `:`)
   - **Fila sin archivo destino:** si `archivo` es `story.md` (o la ruta de `story.md` de la historia) o la columna es `—`, la fila no designa un archivo a editar: `story.md` es la referencia del criterio y **nunca se modifica**. No se salta como «archivo no encontrado»: aplicar la `Acción requerida` en el código donde la ubica `design.md` (componentes e interfaces del criterio) y registrar en `$FIX_CORRECTED` el archivo realmente modificado; continuar con la siguiente fila
2. Verificar que el archivo existe en el repositorio
   - Si el archivo no existe: mostrar `⚠️ archivo no encontrado: <ruta>`, registrarlo en la lista interna `$FIX_SKIPPED` y continuar con la siguiente corrección **sin abortar las correcciones restantes**
3. Aplicar la corrección indicada en `Acción requerida` en el archivo y línea especificados, limitando los cambios a la lista blanca
4. Mostrar: `💻 corregido: <ruta>` y registrar la ruta en la lista interna `$FIX_CORRECTED`

**2f.3 — Registrar resultado:**
Al terminar todas las filas (incluso si alguna fue omitida por archivo inexistente), registrar `$FIX_DIRECTIVES_APPLIED = true`. Este sub-paso **no modifica `tasks.md`** (no añade, marca ni elimina tareas) **ni `fix-directives.md`**; el archivo lo elimina `story-code-review` al aprobar.

#### 2g. Cargar criterios DoD IMPLEMENT

Resolver el DoD de la etapa `implement` según `## DoD aplicable` (config → convención).

**Si no se resuelve ningún archivo:**
```
⚠️ DoD de la etapa implement no encontrado (probado: <rutas>) → crea el archivo o ejecuta /memory-system migrate --from=dod-monolithic
   Se omitirá la validación DoD IMPLEMENT
```
Registrar internamente `$DOD_IMPLEMENT_CRITERIA = []` y continuar.

**Si el archivo existe:** extraer todas sus líneas `- [ ] <texto>` y `- [x] <texto>` como lista de criterios planos; registrar internamente como `$DOD_IMPLEMENT_CRITERIA` y registrar su `enforcement` (`error` bloquea `IMPLEMENT/DONE`; `warn` solo informa).

Mostrar resumen de carga DoD:
```
📋 DoD IMPLEMENT: <N> criterios cargados desde <ruta>      (si encontrado)
📋 DoD IMPLEMENT: ⚠️ no disponible — se omitirá la validación  (si no encontrado)
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

#### 3c. Si tarea es implementable → Detección de tarea legada o Ciclo TDD

Mostrar:
```
[T001] → implementando…
```

**Detección de tarea legada (compatibilidad hacia atrás):** al inicio del ciclo, antes del TDD estándar, evaluar la descripción de la tarea:

```
si descripción_tarea.trim().toLowerCase() == "implementar fix-directives.md":
  NO ejecutar el ciclo TDD ni volver a aplicar las correcciones (ya se aplicaron en el pre-paso 2f)
  si $FIX_DIRECTIVES_APPLIED = true:
    ir al Paso 3d y marcar la tarea [x] con la nota "aplicado en pre-paso 2f"
  sino (fix-directives.md no existe en $STORY_DIR):
    marcar la tarea [~] en tasks.md con la razón "fix-directives.md no encontrado en <$STORY_DIR>"
    mostrar: [T] ⚠️ bloqueada — fix-directives.md no encontrado en <ruta>
    continuar con la siguiente tarea sin error fatal
sino:
  ejecutar ciclo TDD estándar (Paso TDD-1, TDD-2, TDD-3)
```

Formato de marcado en `tasks.md` para la tarea legada:
```
- [x] Implementar fix-directives.md — aplicado en pre-paso 2f
- [~] Implementar fix-directives.md — fix-directives.md no encontrado en <$STORY_DIR>
```

> **Nota de diseño (D-3, actualizada por STORY-089):** el disparador de las correcciones es la **presencia** de `fix-directives.md` en el directorio de la historia (pre-paso 2f), no una tarea en `tasks.md`. El literal `"implementar fix-directives.md"` (normalizado con trim + lowercase) solo se reconoce para no procesar como ciclo TDD estándar las líneas legadas que `story-code-review` escribía en `tasks.md` antes de STORY-089; nunca vuelve a aplicar las correcciones. Si la línea legada difiere del literal (typo, traducción manual), se procesa como ciclo TDD estándar — degradación controlada sin error fatal. Esta rama desaparece cuando no queden `tasks.md` legados.

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

Al finalizar el procesamiento de todas las tareas (completadas + bloqueadas), o directamente tras el pre-paso 2f cuando `N_pendientes = 0` (rework sin tareas pendientes, incluida la entrada `IMPLEMENT/TODO` sin `fix-directives.md`, en la que 2f se omite), ejecutar los siguientes pasos en orden:

#### 4a. Generar `implement-report.md`

Generar `implement-report.md` en el directorio de la historia.

El reporte **no se actualiza incrementalmente**: se genera como artefacto de cierre al finalizar todas las tareas.

**Estructura del reporte:**

```markdown
---
type: implement-report
id: <STORY-NNN>
slug: <story_id>-implement-report
title: "Implement Report: <story_title>"
story: <STORY-NNN>
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
---

# Reporte de Implementación: <story_title>

## Resumen

| Métrica | Valor |
|---|---|
| Historia | <STORY-NNN> |
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

## Correcciones de fix-directives.md (ronda <N>)

<!-- Solo si $FIX_DIRECTIVES_APPLIED = true (pre-paso 2f); <N> = $FIX_ROUND -->

| # | Archivo:Línea | Severidad | Resultado |
|---|---|---|---|
| 1 | src/auth.ts:42 | HIGH | 💻 corregido: src/auth.ts |
| 2 | src/legacy/removed.ts:10 | MEDIUM | ⚠️ archivo no encontrado: src/legacy/removed.ts (omitido) |

**Archivos corregidos:** <lista de $FIX_CORRECTED>
**Hallazgos omitidos por archivo inexistente:** <lista de $FIX_SKIPPED, o "ninguno">

---

## Tareas Bloqueadas

<!-- Solo si hay tareas en [~] -->

| Tarea | Razón del bloqueo | Acción recomendada |
|---|---|---|
| T002 | Componente "X" no encontrado en design.md | Definir "X" en design.md y re-ejecutar /story-implement-tasks |

---

## Cumplimiento DoD — Fase IMPLEMENT

<!-- Completar con resultados del sub-paso 4g -->

**Si `$DOD_IMPLEMENT_CRITERIA` está vacío:**
```
⚠️ DoD IMPLEMENT no encontrado — se omitió la validación.
   Verifica que existe el DoD de la etapa implement (ver `## DoD aplicable`).
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

#### 4g. Evaluar criterios DoD IMPLEMENT

**Si `$DOD_IMPLEMENT_CRITERIA` está vacío** (no se cargó la sección DoD en el paso 2g):
- Registrar `$DOD_RESULT = []` y `$DOD_BLOQUEADO = false`
- Completar la sección "Cumplimiento DoD — Fase IMPLEMENT" en `implement-report.md` con el aviso de sección no encontrada
- Continuar sin bloquear la transición de estado

**Si `$DOD_IMPLEMENT_CRITERIA` tiene criterios:**

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

Completar la sección "Cumplimiento DoD — Fase IMPLEMENT" en `implement-report.md` con la tabla resultante y la línea de resumen `**Resumen:** N_dod_ok/Total criterios ✓`.

#### 4b. Actualizar frontmatter a IMPLEMENT/DONE (condicional según DoD)

**Si `$DOD_BLOQUEADO = false`** (no hay criterios DoD con `❌`):
- Actualizar el frontmatter de `story.md`:
  - `status: IMPLEMENT`
  - `substatus: DONE`

**Si `$DOD_BLOQUEADO = true`** (hay al menos un criterio DoD con `❌`):
- NO actualizar el frontmatter — `story.md` permanece en `IMPLEMENT/IN-PROGRESS`
- Mostrar al usuario los criterios DoD fallidos:
  ```
  ⚠️ Transición a IMPLEMENT bloqueada por DoD-ERRORs:

  <lista de criterios con ❌ y su evidencia>

  Resuelve los criterios pendientes antes de avanzar a code review.
  ```

#### 4c. Actualizar checklist de la épica padre

Leer el campo `parent` del frontmatter de `story.md` (ej. `EPIC-12-story-sdd-workflow`).

Buscar el archivo `epic.md` correspondiente en `changes/<parent>/epic.md`; si no existe y `parent` es solo `EPIC-NNN`, Glob `changes/<parent>-*/epic.md` (primera coincidencia). No se consulta `changes/archive/`.

**Si se encuentra `epic.md`** (transición F2 → F3 de la historia; formatos en `domain-epic-lifecycle` §9):
- Resolver del template de épica (`docs/templates/epic-template.md`; si no existe, el seed `$CLI_ROOT/skills/epic-creation/assets/epic-template.md`) el **título** de la sección cuyo marcador declara `clave: historias` (las secciones se localizan por clave, nunca por un título fijo; contrato en `domain-epic-lifecycle` §9).
- Si el template no declara esa clave o la épica no tiene un encabezado `## <título>`: emitir `[WARN] epic.md sin la sección "<título>" → si se creó con una versión anterior del template: /memory-system migrate --from=epic-template-v1; omitiendo actualización` y continuar (no bloquea el cierre de la historia).
- **Solo dentro de esa sección**, localizar la línea de **nivel superior** (empieza por `- `) que contenga el token exacto `**{story_id}**` en negrita (`**STORY-103**` no casa `**STORY-1030**`; menciones en otras secciones no cuentan)
- Cambiar `- [ ]` por `- [x]` solo en esa línea y actualizar `updated:` del frontmatter de la épica
- Registrar: `Checklist de épica: ✓ actualizado en <ruta>/epic.md`

**Si NO se encuentra `epic.md` o la historia no está en esa sección:**
- Emitir WARNING en consola: `⚠️ No se pudo actualizar el checklist de la épica: <razón>`
- Agregar en `implement-report.md` una sección de advertencia:
  ```
  ⚠️ Checklist de épica no actualizado: <razón>
  ```
- Continuar sin bloquear — la transición a `IMPLEMENT/DONE` ya fue aplicada

#### 4d. Secciones condicionales: "Correcciones de fix-directives.md" y "Tareas Bloqueadas"

Incluir la sección `## Correcciones de fix-directives.md (ronda N)` **solo si `$FIX_DIRECTIVES_APPLIED = true`**, con `N = $FIX_ROUND`, la lista de archivos corregidos (`$FIX_CORRECTED`) y los hallazgos omitidos por archivo inexistente (`$FIX_SKIPPED`).

Incluir la sección "Tareas Bloqueadas" **solo si hay al menos una tarea con estado `- [~]`**. Listar cada tarea bloqueada con su razón de bloqueo y la acción recomendada para desbloquearla.

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

### Manejo de errores

| Condición | Mensaje | Acción |
|---|---|---|
| Entorno inválido (preflight) | `✗ Entorno inválido` | Detener inmediatamente. No generar archivos |
| Historia no encontrada | `❌ No se encontró la historia {story_id} en changes/` | Detener. Sugerir `/epic-generate-stories` |
| Ruta explícita fuera de changes/ | `❌ La ruta {story_path} no es una historia de changes/ (se esperaba changes/STORY-NNN-<slug>/)` | Detener sin escribir ningún archivo |
| `story.md`, `design.md` o `tasks.md` ausente | `❌ No se encontró <artefacto> en: <ruta>` | Detener sin implementar ninguna tarea |
| Estado de `story.md` no válido | `❌ La historia <story_id> no está en un estado válido para implementar.` | Detener sin implementar ninguna tarea |
| Sin tareas pendientes y sin `fix-directives.md` (entrada distinta de `IMPLEMENT/TODO`) | `ℹ️  No hay tareas pendientes en tasks.md — todas están completadas.` | Terminar sin modificar ningún archivo (gate 2c). Con entrada `IMPLEMENT/TODO` el gate no aplica: 2e → Paso 4 sin anunciar correcciones |
| `fix-directives.md` presente con `round` ausente o no entero ≥ 1 | — (sin advertencia: archivo legado) | `$FIX_ROUND = 1` y continuar; nunca escribir `round` |
| `fix-directives.md` presente sin tabla "Instrucciones de corrección" legible | `[WARN] fix-directives.md sin tabla de correcciones legible — correcciones omitidas` | Advertir, `$FIX_DIRECTIVES_APPLIED = false` y continuar con el bucle de tareas |
| `fix-directives.md` con la sección "Lista blanca de archivos permitidos para modificar" presente sin viñetas (p. ej. rechazo de `story-acceptance`) | — (sin aviso: una lista vacía no es un error) | Aplicar las correcciones y registrar en `$FIX_CORRECTED` cada archivo existente modificado |
| Fila con `Archivo:Línea` en `story.md` o `—` (pre-paso 2f) | — | No es «archivo no encontrado»: aplicar la `Acción requerida` donde la ubica `design.md`; `story.md` nunca se modifica |
| `fix-directives.md` con `based-on` ausente o no reconocido (2f.1) | `[WARN] fix-directives.md sin based-on reconocible — origen del rework desconocido` | Continuar con `Origen: desconocido`; la aplicación de las correcciones no cambia |
| Entrada `IMPLEMENT/TODO` sin `fix-directives.md` (2c) | `[WARN] story.md está en IMPLEMENT/TODO sin fix-directives.md — se continúa sin modo rework (la única señal de rework es fix-directives.md)` | Continuar por el camino de la entrada `IMPLEMENT/TODO` (2c); no se leen `verify-report.md` ni `acceptance-report.md` |
| `fix-directives.md` presente sin la sección "Lista blanca de archivos permitidos para modificar" | `[WARN] fix-directives.md sin lista blanca — se aplican las correcciones solo en los archivos de la columna Archivo:Línea` | Advertir y continuar aplicando las correcciones |
| Hallazgo con archivo inexistente (pre-paso 2f) | `⚠️ archivo no encontrado: <ruta>` | Registrar en `$FIX_SKIPPED` y continuar con el siguiente hallazgo |
| Tarea legada `Implementar fix-directives.md` sin `fix-directives.md` en `$STORY_DIR` | `[T] ⚠️ bloqueada — fix-directives.md no encontrado en <ruta>` | Marcar `[~]` en `tasks.md` y continuar sin error fatal |
| Tarea con componente no definido en `design.md` | `[T] ⚠️ bloqueada — componente "<nombre>" no definido en design.md` | Marcar `[~]` y continuar |
| DoD de la etapa implement ausente | `⚠️ DoD de la etapa implement no encontrado …` | Advertir y continuar sin validación DoD |
| Épica padre no encontrada | `⚠️ No se pudo actualizar el checklist de la épica: <razón>` | Advertir y continuar; la transición de estado ya fue aplicada |

---

## Salida

### Artefactos generados

| Artefacto | Ruta | Descripción |
|---|---|---|
| `implement-report.md` | `changes/<STORY-NNN>-<slug>/implement-report.md` | Reporte con estado por tarea, DoD y trazabilidad |
| `story.md` (actualizado) | mismo directorio | Frontmatter → `IMPLEMENT/DONE` (o `IMPLEMENT/IN-PROGRESS` si hay DoD-ERRORs) |
| `tasks.md` (actualizado) | mismo directorio | Tareas marcadas `[x]` (completadas) o `[~]` (bloqueadas) |
| `epic.md` (actualizado) | `changes/<parent>/epic.md` | Checklist con `[x]` para la historia completada (si existe) |
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

🔁 Correcciones de fix-directives.md (ronda <N>): <N_corregidos> corregidos │ <N_omitidos> omitidos   (solo si $FIX_DIRECTIVES_APPLIED = true)
📄 Reporte generado: <ruta>/implement-report.md
📋 Estado story.md: IMPLEMENT/DONE ✓             (si $DOD_BLOQUEADO = false)
→ Ejecuta /story-code-review <story_id>          (si $DOD_BLOQUEADO = false)
📋 Estado story.md: IMPLEMENT/IN-PROGRESS ✓               (si $DOD_BLOQUEADO = true)
📋 Checklist de épica: <✓ actualizado en <ruta>/epic.md | ⚠️ no actualizado — <razón>>
📋 DoD IMPLEMENT: {N_dod_ok}/{Total} criterios ✓          (si DoD fue evaluado)
📋 DoD IMPLEMENT: ⚠️ no evaluado (sección no encontrada)  (si DoD no disponible)

✅ Implementación completa                                    (si no hay DoD-ERRORs ni bloqueos)
```

Cuando el rework no tenía tareas pendientes (`N_pendientes = 0` y `fix_directives_existe = true`), la tabla de tareas muestra todas las filas como `✓ completado (ejecución anterior)` y el trabajo de esta ejecución queda reflejado en la línea de correcciones.

O si hay DoD-ERRORs:

```
⚠️ Implementación completada con DoD-ERRORs pendientes
   Revisa implement-report.md → sección "Cumplimiento DoD — Fase IMPLEMENT"
📋 Estado story.md: IMPLEMENT/IN-PROGRESS (transición bloqueada por DoD-ERRORs)
📋 DoD IMPLEMENT: {N_dod_ok}/{Total} criterios ✓ | {N_dod_error} criterios ❌
```

O si hay bloqueos de tareas (sin DoD-ERRORs):

```
⚠️ Implementación completada con tareas pendientes de aclaración
   Revisa implement-report.md → sección "Tareas Bloqueadas"
📋 Estado story.md: IMPLEMENT/DONE ✓
→ Ejecuta /story-code-review <story_id>
📋 Checklist de épica: <✓ actualizado | ⚠️ no actualizado — <razón>>
📋 DoD IMPLEMENT: {N_dod_ok}/{Total} criterios ✓
```
