---
name: story-acceptance
description: >-
  Genera acceptance-report.md con un veredicto (APPROVED / NEEDS-CHANGES / BLOCKED / PENDING) guiando la validación manual de criterios de aceptación criterio por criterio.
  Usar para el gate de aceptación antes de DELIVER.
  Invocar para "story-acceptance", "acceptance", "validación final",
  "gate de acceptance" o "aprobar historia".
triggers:
  - story-acceptance
  - /story-acceptance
  - acceptance
  - validación final de historia
  - gate de acceptance
  - aprobar historia para integration
outputs:
  - acceptance-report.md
  - story.md (frontmatter actualizado)
---

# Skill: `/story-acceptance`

## Objetivo

Orquesta la fase ACCEPTANCE del pipeline SDD: guía al validador humano a través de cada criterio de aceptación uno por vez, recopila el resultado (PASS/FAIL/BLOCKED) con observaciones, genera `acceptance-report.md` con un veredicto (APPROVED / NEEDS-CHANGES / BLOCKED / PENDING) y trazabilidad completa, y actualiza el frontmatter de `story.md` según el veredicto.

## Posicionamiento

```
[story.md: VERIFY/DONE]              ← viene de story-verify
     ↓
story-acceptance    ← aquí
      │   Entradas válidas:               VERIFY/DONE · ACCEPTANCE/IN-PROGRESS · ACCEPTANCE/BLOCKED (reintento)
      │   Al iniciar sesión nueva:         story.md → ACCEPTANCE/IN-PROGRESS
      │   Veredicto APPROVED:              story.md → ACCEPTANCE/DONE
      │   Veredicto NEEDS-CHANGES:         story.md → READY-FOR-IMPLEMENT/DONE
      │   Veredicto BLOCKED:               story.md → ACCEPTANCE/BLOCKED
      │   Veredicto PENDING:               story.md se mantiene en ACCEPTANCE/IN-PROGRESS
      │   Estado incorrecto:              → error sin modificar archivos
     ↓
[story.md: ACCEPTANCE/DONE]
──────────────────────────────────────────────────────────────────────────────────────
story-implement-tasks   → implementa código
story-code-review → revisa código
story-verify      → ejecuta pruebas automáticas
story-acceptance  → validación humana final              ← aquí
```

## Entrada

- `$SPECS_BASE/specs/stories/<story-id>/story.md` — historia a validar (precondición de estado)
- DoD de la etapa `acceptance` (`$SPECS_BASE/guardrails/dod-story-acceptance.md`, ver `## DoD aplicable`) — opcional
- `$SPECS_BASE/specs/stories/<story-id>/acceptance-report.md` — si existe, detección de sesión previa

## Parámetros

- `{story_id}` o primer argumento posicional: ID de la historia a validar (ej. `STORY-055`)
- `--restart`: descarta sesión previa y reinicia acceptance desde cero sin preguntar
- `--dry-run`: muestra la lista de criterios a validar sin iniciar la sesión interactiva
- `--validator "<nombre>"`: registra el nombre del validador humano en el informe

## Dependencias

- Archivos de entrada: DoD de la etapa `acceptance` (ver `## DoD aplicable`), `assets/acceptance-report-template.md`

## DoD aplicable

| Elemento | Valor |
|---|---|
| Etapa | `acceptance` |
| Archivo | `$SPECS_BASE/guardrails/dod-story-acceptance.md` (en este repositorio, `docs/guardrails/dod-story-acceptance.md`) |
| Override | `sddf.config.yaml › guardrails.dod.story.acceptance` |
| Enforcement | el campo `enforcement` del frontmatter del archivo: `error` bloquea la transición; `warn` informa los criterios incumplidos sin bloquear |

Resolución (primera coincidencia):

1. `sddf.config.yaml › guardrails.dod.story.acceptance` → `$SPECS_BASE/guardrails/<slug>.md`
2. Convención: `$SPECS_BASE/guardrails/dod-story-acceptance.md`
3. Ninguno existe → emitir `⚠️ DoD de la etapa acceptance no encontrado (probado: <rutas>) → crea el archivo o ejecuta /memory-system migrate --from=dod-monolithic` y continuar solo con los criterios Gherkin de `story.md`.

Se carga **solo** ese archivo: sus criterios son todas sus líneas `- [ ]`. Sus criterios se añaden a los Gherkin de `story.md` en la sesión de validación.

## Modos de ejecución

- **Manual** (`/story-acceptance {story_id}`): interactivo, presenta criterios uno por vez esperando respuesta
- **Automático** (invocado por orquestador): no disponible — este skill requiere interacción humana por diseño

## Restricciones / Reglas

- **No modifica código fuente:** solo escribe `acceptance-report.md` y actualiza el frontmatter de `story.md`
- **No ejecuta pruebas automáticas:** eso corresponde a `story-verify`
- **No revisa código:** eso corresponde a `story-code-review`
- **Idempotente:** ejecutable múltiples veces; preserva historial en `acceptance-report.md`
- **Precondición de estado:** solo ejecuta si `story.md` tiene `status: VERIFY/DONE`, `ACCEPTANCE/IN-PROGRESS` o `ACCEPTANCE/BLOCKED` (reintento tras resolver el impedimento)
- **FAIL/BLOCKED requieren observación:** el skill rechaza respuestas sin texto de observación no vacío
- **DoD dinámico:** los criterios ACCEPTANCE se leen en runtime; nunca están hardcodeados
- NO modifique ningún archivo existente en el código fuente (estamos aceptando la implementación, no implementando los artefactos técnicos)
- NO genere código; estamos aceptando la implementación, no implementando los artefactos técnicos
- **Encoding**: All generated `.md` files MUST be saved as **UTF-8 without BOM**. 
  Do not use Latin-1, CP-1252, or any other encoding. 
  If you see characters like `Ã³` or `ðŸ“–`, that indicates an encoding error — fix it.
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


### Paso 1 — Resolver historia y verificar precondiciones

#### 1a. Resolver el story_id

Aceptar como argumento:
- `{story_id}` — identificador de la historia (ej. `STORY-055`)
- `{story_path}` — ruta explícita al directorio de la historia (sobreescribe la resolución por glob)
- `--story <ID>` — forma larga del flag

Si no se proporcionó ningún argumento, preguntar:
```
¿Qué historia deseas validar en acceptance?
Proporciona el ID (ej. STORY-055) o la ruta completa al directorio.
```

#### 1b. Resolver el directorio de la historia

1. Ruta explícita `{story_path}` si se proporcionó
2. Glob `$SPECS_BASE/specs/stories/{story_id}-*/` — primera coincidencia

Si no se encuentra:
```
❌ No se encontró la historia {story_id} bajo $SPECS_BASE/specs/stories/

Verifica el ID o ejecuta /epic-generate-stories para generar la historia primero.
```
Detener la ejecución.

#### 1c. Verificar existencia de story.md

Si falta `story.md`:
```
❌ No se encontró story.md en: <ruta>

La historia debe existir antes de ejecutar acceptance.
```
Detener la ejecución.

#### 1d. Verificar precondición de estado

Leer el frontmatter de `story.md` y verificar:

```
Precondición válida si:
  (status: VERIFY        AND substatus: DONE)         ← camino normal
  OR
  (status: ACCEPTANCE    AND substatus: IN-PROGRESS)  ← sesión en curso
  OR
  (status: ACCEPTANCE    AND substatus: BLOCKED)      ← reintento tras resolver el impedimento
```

Si la precondición NO se cumple:
```
❌ La historia {story_id} no está en un estado válido para acceptance.

   Estado actual: status: {valor} / substatus: {valor}

   story-acceptance requiere uno de los siguientes estados:
   · VERIFY/DONE           → camino normal desde story-verify
   · ACCEPTANCE/IN-PROGRESS → sesión de acceptance en curso
   · ACCEPTANCE/BLOCKED → reintento tras resolver el impedimento

   La historia {story_id} tiene status {status}/{substatus}.
   Completa primero story-code-review y story-verify antes de ejecutar story-acceptance.
```
Detener sin modificar ningún archivo.

Mostrar confirmación de inicio:
```
🚀 Iniciando acceptance para: {story_id}
   Directorio: {ruta}
   Estado válido: {status}/{substatus} ✓
```

---

### Paso 2 — Cargar criterios a validar

#### 2a. Leer story.md — extraer escenarios Gherkin

Leer `story.md` y extraer todos los escenarios Gherkin de la sección `## ✅ Criterios de aceptación` como lista numerada. Cada escenario Gherkin es un criterio a validar.

Registrar internamente como `$GHERKIN_CRITERIOS`.

#### 2b. Leer el DoD de la etapa acceptance

Resolver el DoD de la etapa `acceptance` según `## DoD aplicable` (config → convención).

**Si no se resuelve ningún archivo, o no contiene ninguna línea `- [ ]`:**
```
⚠️ DoD de la etapa acceptance no encontrado (probado: <rutas>) → crea el archivo o ejecuta /memory-system migrate --from=dod-monolithic
   Se usarán los criterios de aceptación de story.md como lista de validación.
```
Registrar `$DOD_CRITERIOS = []`.

**Si el archivo existe:**
Extraer todas sus líneas `- [ ] <texto>` como lista de criterios DoD.
Registrar internamente como `$DOD_CRITERIOS`.

Mostrar:
```
📋 Criterios Gherkin de story.md:  {N} criterios
📋 Criterios DoD ACCEPTANCE:       {N} criterios   (o ⚠️ no disponible)
📋 Total de criterios a validar:   {N}
```

El orden de presentación en la sesión interactiva será: primero los criterios Gherkin (AC-1, AC-2...), luego los criterios DoD ACCEPTANCE.

---

### Paso 3 — Detectar estado de sesión

Verificar si existe `acceptance-report.md` en el directorio de la historia.

#### Estado A — No existe → sesión nueva

Continuar al Paso 4 directamente.

#### Estado B — Existe con sesión parcial

Condición: `session-status: partial` en el frontmatter del `acceptance-report.md` existente.

**Si se pasó `--restart`:** continuar al Paso 4 (reinicio forzado).

**Si no se pasó `--restart`:**
```
Se encontró una sesión de acceptance parcial.
Criterios ya evaluados: {N_evaluados} de {N_total}

¿Qué deseas hacer?
  (c) Continuar — reanudar desde el criterio {N_evaluados + 1}
  (r) Reiniciar — iniciar desde el primer criterio (el historial anterior se preserva)
```
Esperar respuesta. Según la respuesta:
- `(c)` → cargar criterios ya evaluados, registrar los pendientes como `$CRITERIOS_PENDIENTES`, continuar al Paso 4 sin actualizar frontmatter de story.md (ya está en ACCEPTANCE/IN-PROGRESS)
- `(r)` → continuar al Paso 4 con todos los criterios pendientes (reinicio)

#### Estado C — Existe con sesión completa

Condición: `session-status: complete` en el frontmatter del `acceptance-report.md` existente.

**Si se pasó `--restart`:** continuar al Paso 4 (reinicio forzado).

**Si no se pasó `--restart`:** leer `verdict` del frontmatter del reporte existente y mostrar el aviso (el valor mostrado es informativo; ninguna opción depende de él):

- Si el frontmatter declara `verdict`:
```
Se encontró un acceptance-report.md completo con veredicto {verdict}.
```
- Si el frontmatter no declara `verdict` (reporte heredado, anterior al contrato de validación):
```
Se encontró un acceptance-report.md completo sin veredicto (reporte anterior al contrato de validación).
```

Luego:
```
¿Qué deseas hacer?
  (r) Reiniciar  — iniciar nueva sesión (el historial anterior se preserva)
  (v) Ver report — mostrar el resultado anterior sin modificar nada
```
- `(v)` → mostrar el contenido del `acceptance-report.md` existente y terminar sin modificar ningún archivo
- `(r)` → continuar al Paso 4 (reinicio)

---

### Paso 4 — Actualizar frontmatter a ACCEPTANCE/IN-PROGRESS

**Si se pasó `--dry-run`:** omitir completamente la actualización del frontmatter y continuar directamente al Paso 5 en modo dry-run. No se escribe ningún archivo.

**Si NO es dry-run**, y el estado actual de `story.md` NO es `ACCEPTANCE/IN-PROGRESS` (es decir, es `VERIFY/DONE`):

Actualizar el frontmatter de `story.md`:
- `status: ACCEPTANCE`
- `substatus: IN-PROGRESS`
- `updated: {fecha actual}`

Si el estado ya es `ACCEPTANCE/IN-PROGRESS` (reanudación), omitir esta escritura.

---

### Paso 5 — Sesión interactiva de validación

**Si se pasó `--dry-run`:**
```
📋 Criterios a validar (modo --dry-run — no se inicia la sesión):

Criterios Gherkin ({N}):
  1. {título escenario AC-1}
  2. {título escenario AC-2}
  ...

Criterios DoD ACCEPTANCE ({N}):
  1. {texto criterio DoD 1}
  ...

Total: {N} criterios. Ejecuta sin --dry-run para iniciar la sesión.
```
Terminar sin modificar ningún archivo.

**Si NO es dry-run:**

Por cada criterio pendiente (en orden: Gherkin primero, DoD después):

```
─────────────────────────────────────────────────────
 Criterio {N} de {Total}: {tipo} — {título del criterio}
─────────────────────────────────────────────────────
 Texto:
   {descripción completa del criterio o escenario Gherkin}

 Instrucción: Ejecuta este escenario manualmente y registra el resultado.

 Resultado:
   [P] PASS    — el criterio se cumple
   [F] FAIL    — el criterio no se cumple (requiere observación)
   [B] BLOCKED — no se pudo probar (requiere razón)
   [Q] Salir   — interrumpir y guardar sesión parcial
─────────────────────────────────────────────────────
```

**Procesamiento de respuestas:**

- `[P]` / `PASS` / `p` → resultado: `APPROVED`, observación: optional
- `[F]` / `FAIL` / `f` → solicitar observación obligatoria (rechazar si está vacía):
  ```
  Observación requerida para FAIL. Describe qué falló:
  ```
  Resultado: `REJECTED`
- `[B]` / `BLOCKED` / `b` → solicitar razón obligatoria (rechazar si está vacía):
  ```
  Razón requerida para BLOCKED. Describe por qué no se pudo probar:
  ```
  Resultado: `BLOCKED`
- `[Q]` / `QUIT` / `q` → guardar sesión parcial:
   1. Generar `acceptance-report.md` con el mismo template y la misma tabla de placeholders de 7d, con `{session_status}` = `partial` y `{verdict}` = `PENDING`, incluyendo los criterios evaluados hasta el momento; la forma de la tabla de detalle no cambia (`PENDIENTE` para los criterios sin evaluar)
   2. Mantener `story.md` en `ACCEPTANCE/IN-PROGRESS`
   3. Mostrar: `💾 Sesión guardada (verdict: PENDING). Ejecuta /story-acceptance {story_id} para reanudar.`
   4. Terminar el skill

Registrar por cada criterio: `{id, texto, resultado, observación, timestamp}`.

---

### Paso 6 — Registrar el nombre del validador

Si se pasó `--validator "<nombre>"`, registrar el nombre.
Si no se pasó, usar `"no especificado"`.

Registrar internamente como `$VALIDATOR_NAME`.

---

### Paso 7 — Consolidar resultados y generar acceptance-report.md

Al completar todos los criterios de la sesión:

#### 7a. Calcular totales

```
$TOTAL_CRITERIOS = todos los criterios a validar (Gherkin + DoD), más las filas de sesiones anteriores (si reanudación)
$TOTAL_APPROVED  = criterios con APPROVED
$TOTAL_REJECTED  = criterios con REJECTED
$TOTAL_BLOCKED   = criterios con BLOCKED
$N_EVALUADOS     = $TOTAL_APPROVED + $TOTAL_REJECTED + $TOTAL_BLOCKED
```

#### 7b. Determinar el veredicto

Deriva `$VERDICT` evaluando esta tabla **en orden** (primera fila que se cumple):

| # | Condición | `$VERDICT` |
|---|---|---|
| 1 | La sesión termina con `[Q]` (`session-status: partial`) | `PENDING` |
| 2 | `$TOTAL_REJECTED > 0` | `NEEDS-CHANGES` |
| 3 | `$TOTAL_BLOCKED > 0` | `BLOCKED` |
| 4 | En otro caso | `APPROVED` |

El orden aplica la precedencia G-05 de `docs/policies/validation-contract-policy.md`: con rechazo y bloqueo gana `NEEDS-CHANGES`, y mientras la sesión es `partial` el veredicto es `PENDING`. Al completar una sesión reanudada, 7a ya suma las filas de la sesión anterior, así que el veredicto se recalcula con ellas.

#### 7c. Preservar historial si existe acceptance-report.md previo

Si existe un `acceptance-report.md` con sesión previa (completa o parcial):
- Extraer la sección `## Detalle por criterio` anterior
- Añadirla como nueva entrada en `## Historial de sesiones anteriores`

#### 7d. Generar acceptance-report.md desde el template

Leer `assets/acceptance-report-template.md` y completar todos los placeholders:

| Placeholder | Valor |
|---|---|
| `{story_id}` | ID de la historia |
| `{story_title}` | Título de la historia |
| `{date}` | Fecha actual (YYYY-MM-DD) |
| `{validator}` | `$VALIDATOR_NAME` |
| `{dod_version}` | Fecha de modificación del DoD leído, o "no disponible" |
| `{session_status}` | `complete` al terminar la sesión; `partial` en el camino `[Q]` |
| `{verdict}` | `$VERDICT` según la regla de 7b |
| `{verdict_reason}` | `APPROVED`: `{total_approved} de {total_criterios} criterios aprobados.` · `NEEDS-CHANGES`: `{total_rejected} criterio(s) rechazado(s) y {total_blocked} bloqueado(s).` · `BLOCKED`: `{total_blocked} criterio(s) bloqueado(s) sin evaluar; ninguno rechazado.` · `PENDING`: `Sesión parcial: {n_evaluados} de {total_criterios} criterios evaluados.` |
| `{verdict_details}` | `APPROVED`: cadena vacía · `NEEDS-CHANGES` / `BLOCKED`: una línea por criterio `REJECTED` o `BLOCKED`, en orden: `- Criterio {N} — {RESULTADO}: {título del criterio}` · `PENDING`: `Ejecuta /story-acceptance {story_id} para reanudar.` |
| `{total_criterios}` | Total de criterios a validar |
| `{total_approved}` | Criterios APPROVED |
| `{total_rejected}` | Criterios REJECTED |
| `{total_blocked}` | Criterios BLOCKED |
| `{n_evaluados}` | `$N_EVALUADOS` |
| `{criterios_detalle}` | Tabla con filas: `\| N \| texto \| RESULTADO \| observación \| HH:MM \|` |
| `{dod_criterios}` | Filas: `\| texto criterio DoD \| ✓ cumplido / ✗ no cumplido \|` según resultados |
| `{historial_sesiones}` | Historial de sesiones previas o `<!-- Sin sesiones anteriores -->` |

Escribir el archivo en `$STORY_DIR/acceptance-report.md`.

#### 7e. Criterios DoD ACCEPTANCE en el reporte

Para cada criterio en `$DOD_CRITERIOS`:
- Si fue evaluado y APPROVED → `✓ cumplido`
- Si fue evaluado y REJECTED/BLOCKED → `✗ no cumplido`
- Si no fue evaluado en esta sesión → `— no evaluado`

---

### Paso 8 — Actualizar frontmatter de story.md y mostrar resultado

#### 8a. Actualizar frontmatter según el veredicto

**Si `$VERDICT = APPROVED`:**
```yaml
status: ACCEPTANCE
substatus: DONE
updated: {fecha}
```
Mostrar: `✅ Veredicto: APPROVED — historia {story_id} lista para DELIVER`

**Si `$VERDICT = NEEDS-CHANGES`:**
```yaml
status: READY-FOR-IMPLEMENT
substatus: DONE
updated: {fecha}
```
Mostrar: `⚠️ Veredicto: NEEDS-CHANGES — {verdict_reason} La historia regresa a READY-FOR-IMPLEMENT/DONE.`

**Si `$VERDICT = BLOCKED`:**
```yaml
status: ACCEPTANCE
substatus: BLOCKED
updated: {fecha}
```
Mostrar: `⛔ Veredicto: BLOCKED — {verdict_reason} La historia permanece en ACCEPTANCE/BLOCKED. Resuelve el impedimento y vuelve a ejecutar /story-acceptance.`

**Si `$VERDICT = PENDING`:** no llega a 8a — el camino `[Q]` del Paso 5 termina el skill y `story.md` se mantiene en `ACCEPTANCE/IN-PROGRESS`.

#### 8b. Mostrar resumen final

```
─────────────────────────────────────────────────────────────
 Acceptance: {story_id} — {story_title}
─────────────────────────────────────────────────────────────
 Criterio │ Resultado │ Observación
─────────────────────────────────────────────────────────────
 AC-1     │ APPROVED  │ —
 AC-2     │ REJECTED  │ "No muestra el error esperado"
 DoD-1    │ APPROVED  │ —
─────────────────────────────────────────────────────────────
 Total: {N} criterios │ {N_approved} APPROVED │ {N_rejected} REJECTED │ {N_blocked} BLOCKED
 Veredicto: {verdict}
─────────────────────────────────────────────────────────────

📄 Reporte generado: {$STORY_DIR}/acceptance-report.md (verdict: {verdict})
📋 Estado story.md: ACCEPTANCE/DONE ✓                        (si APPROVED)
📋 Estado story.md: READY-FOR-IMPLEMENT/DONE ⚠️               (si NEEDS-CHANGES)
📋 Estado story.md: ACCEPTANCE/BLOCKED ⚠️                     (si BLOCKED)

✅ Veredicto: APPROVED — historia {story_id} lista para DELIVER
```
o bien:
```
⚠️ Veredicto: NEEDS-CHANGES — {verdict_reason} La historia regresa a READY-FOR-IMPLEMENT/DONE.
   La historia regresa a READY-FOR-IMPLEMENT/DONE para corrección.
   Revisa acceptance-report.md para detalles de los criterios rechazados.
```
o bien (si BLOCKED):
```
⛔ Veredicto: BLOCKED — {verdict_reason} La historia permanece en ACCEPTANCE/BLOCKED. Resuelve el impedimento y vuelve a ejecutar /story-acceptance.
   La historia permanece en ACCEPTANCE/BLOCKED. Resuelve el impedimento y re-ejecuta /story-acceptance.
```

---

## Salida

- `$SPECS_BASE/specs/stories/<story-id>/acceptance-report.md` — reporte de validación con `verdict` en el frontmatter, `## Veredicto` como primera sección, trazabilidad por criterio, resumen ejecutivo e historial de sesiones
- `story.md` frontmatter actualizado según el veredicto:
  - `status: ACCEPTANCE / substatus: DONE` — veredicto `APPROVED`
  - `status: READY-FOR-IMPLEMENT / substatus: DONE` — veredicto `NEEDS-CHANGES`
  - `status: ACCEPTANCE / substatus: BLOCKED` — veredicto `BLOCKED`
  - `status: ACCEPTANCE / substatus: IN-PROGRESS` — veredicto `PENDING` (se mantiene; sesión por reanudar)

## Test Cases

### Caso 1 — Happy path (todos APPROVED)

**Input:** Historia `STORY-NNN` con `status: VERIFY / substatus: DONE`, 2 escenarios Gherkin, DoD de la etapa acceptance presente
**Acción:** Ejecutar `/story-acceptance STORY-NNN`, responder PASS a todos los criterios
**Output esperado:**
- `acceptance-report.md` con `verdict: APPROVED`, `session-status: complete`
- `story.md` actualizado a `status: ACCEPTANCE / substatus: DONE`
- Mensaje: "Veredicto: APPROVED — historia STORY-NNN lista para DELIVER"

### Caso 2 — Criterio rechazado

**Input:** Historia `STORY-NNN` con `status: VERIFY / substatus: DONE`
**Acción:** Responder FAIL con observación "No muestra mensaje de error" al segundo criterio
**Output esperado:**
- `acceptance-report.md` con `verdict: NEEDS-CHANGES`, criterio 2 como REJECTED con observación
- `story.md` actualizado a `status: READY-FOR-IMPLEMENT / substatus: DONE`
- Mensaje: "Veredicto: NEEDS-CHANGES — 1 criterio(s) rechazado(s) y 0 bloqueado(s). La historia regresa a READY-FOR-IMPLEMENT/DONE."

### Caso 3 — Estado incorrecto

**Input:** Historia con `status: IMPLEMENT / substatus: IN-PROGRESS`
**Acción:** Ejecutar `/story-acceptance STORY-NNN`
**Output esperado:**
- Mensaje de error con estado actual y estados válidos requeridos
- Ningún archivo modificado

### Caso 4 — DoD de la etapa acceptance ausente

**Input:** Historia en `VERIFY/DONE`, sin `dod-story-acceptance.md` ni override en `sddf.config.yaml`
**Acción:** Ejecutar `/story-acceptance STORY-NNN`
**Output esperado:**
- Aviso: "DoD de la etapa acceptance no encontrado … Se usarán los criterios de aceptación de story.md"
- Sesión continúa usando solo criterios Gherkin

### Caso 5 — Sesión interrumpida y reanudada

**Input:** `acceptance-report.md` con `session-status: partial` (1 de 2 criterios evaluados)
**Acción:** Ejecutar `/story-acceptance STORY-NNN` nuevamente, responder "c" para continuar
**Output esperado:**
- El skill presenta desde el criterio 2 (el primero pendiente)
- No repite el criterio 1 ya evaluado
