---
name: story-acceptance
description: >-
  Orquesta la fase ACCEPTANCE del pipeline SDD: guía la validación manual de los criterios
  de aceptación de una historia, criterio por criterio, recopila evidencia del validador humano,
  genera acceptance-report.md y actualiza el frontmatter de story.md.
  Usar siempre que el usuario quiera ejecutar la validación final de una historia, confirmar
  que cumple los requisitos funcionales y de calidad antes de INTEGRATION, o generar un
  acceptance-report.md con trazabilidad completa de la validación humana.
  Invocar también cuando el usuario mencione "story-acceptance", "acceptance", "validación final",
  "gate de acceptance", "aprobar historia", "validar criterios de aceptación manualmente" o equivalentes.
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

Orquesta la fase ACCEPTANCE del pipeline SDD: guía al validador humano a través de cada criterio de aceptación uno por vez, recopila el resultado (PASS/FAIL/BLOCKED) con observaciones, genera `acceptance-report.md` con trazabilidad completa y actualiza el frontmatter de `story.md`.

## Posicionamiento

```
[story.md: VERIFY/DONE]              ← viene de story-verify
     ↓
story-acceptance    ← aquí
     │   Al iniciar sesión nueva:       story.md → ACCEPTANCE/IN-PROGRESS
     │   Todos APPROVED:                story.md → ACCEPTANCE/DONE
     │   ≥1 REJECTED (sin BLOCKED):      story.md → READY-FOR-IMPLEMENT/DONE
     │   ≥1 BLOCKED (sin REJECTED):      story.md → ACCEPTANCE/BLOCKED
     │   ≥1 REJECTED + ≥1 BLOCKED:       story.md → READY-FOR-IMPLEMENT/DONE
     │   Estado incorrecto:             → error sin modificar archivos
     ↓
[story.md: ACCEPTANCE/DONE]
──────────────────────────────────────────────────────────────────────────────────────
story-implement   → implementa código
story-code-review → revisa código
story-verify      → ejecuta pruebas automáticas
story-acceptance  → validación humana final              ← aquí
```

## Entrada

- `$SPECS_BASE/specs/stories/<story-id>/story.md` — historia a validar (precondición de estado)
- `$SPECS_BASE/policies/definition-of-done-story.md` — criterios DoD sección ACCEPTANCE (opcional)
- `$SPECS_BASE/specs/stories/<story-id>/acceptance-report.md` — si existe, detección de sesión previa

## Parámetros

- `{story_id}` o primer argumento posicional: ID de la historia a validar (ej. `FEAT-055`)
- `--restart`: descarta sesión previa y reinicia acceptance desde cero sin preguntar
- `--dry-run`: muestra la lista de criterios a validar sin iniciar la sesión interactiva
- `--validator "<nombre>"`: registra el nombre del validador humano en el informe

## Dependencias

- Skills: [`skill-preflight`]
- Archivos de entrada: `$SPECS_BASE/policies/definition-of-done-story.md`, `assets/acceptance-report-template.md`

## Modos de ejecución

- **Manual** (`/story-acceptance {story_id}`): interactivo, presenta criterios uno por vez esperando respuesta
- **Automático** (invocado por orquestador): no disponible — este skill requiere interacción humana por diseño

## Restricciones / Reglas

- **No modifica código fuente:** solo escribe `acceptance-report.md` y actualiza el frontmatter de `story.md`
- **No ejecuta pruebas automáticas:** eso corresponde a `story-verify`
- **No revisa código:** eso corresponde a `story-code-review`
- **Idempotente:** ejecutable múltiples veces; preserva historial en `acceptance-report.md`
- **Precondición de estado:** solo ejecuta si `story.md` tiene `status: VERIFY/DONE` o `ACCEPTANCE/IN-PROGRESS`
- **FAIL/BLOCKED requieren observación:** el skill rechaza respuestas sin texto de observación no vacío
- **DoD dinámico:** los criterios ACCEPTANCE se leen en runtime; nunca están hardcodeados
- NO modifique ningún archivo existente en el código fuente (estamos aceptando la implementación, no implementando los artefactos técnicos)
- NO genere código; estamos aceptando la implementación, no implementando los artefactos técnicos

---

## Flujo de ejecución

### Paso 0 — Verificar entorno (skill-preflight)

Invocar el skill `skill-preflight` antes de cualquier operación.

El preflight verifica `SDDF_ROOT`, resuelve `SPECS_BASE` (fallback: `docs`) y confirma los subdirectorios de specs estándar.

Si retorna `✗ Entorno inválido`, detener la ejecución inmediatamente. No generar ningún archivo.

Usar `$SPECS_BASE` para todas las rutas en los pasos siguientes.

---

### Paso 1 — Resolver historia y verificar precondiciones

#### 1a. Resolver el story_id

Aceptar como argumento:
- `{story_id}` — identificador de la historia (ej. `FEAT-055`)
- `{story_path}` — ruta explícita al directorio de la historia (sobreescribe la resolución por glob)
- `--story <ID>` — forma larga del flag

Si no se proporcionó ningún argumento, preguntar:
```
¿Qué historia deseas validar en acceptance?
Proporciona el ID (ej. FEAT-055) o la ruta completa al directorio.
```

#### 1b. Resolver el directorio de la historia

1. Ruta explícita `{story_path}` si se proporcionó
2. Glob `$SPECS_BASE/specs/stories/{story_id}-*/` — primera coincidencia

Si no se encuentra:
```
❌ No se encontró la historia {story_id} bajo $SPECS_BASE/specs/stories/

Verifica el ID o ejecuta /release-generate-stories para generar la historia primero.
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
```

Si la precondición NO se cumple:
```
❌ La historia {story_id} no está en un estado válido para acceptance.

   Estado actual: status: {valor} / substatus: {valor}

   story-acceptance requiere uno de los siguientes estados:
   · VERIFY/DONE           → camino normal desde story-verify
   · ACCEPTANCE/IN-PROGRESS → sesión de acceptance en curso

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

#### 2b. Leer DoD sección ACCEPTANCE

Buscar `$SPECS_BASE/policies/definition-of-done-story.md`.

**Si el archivo no existe o no tiene sección ACCEPTANCE:**
```
⚠️ No se encontró sección ACCEPTANCE en el DoD.
   Se usarán los criterios de aceptación de story.md como lista de validación.
```
Registrar `$DOD_CRITERIOS = []`.

**Si existe la sección ACCEPTANCE:**
Extraer todas las líneas `- [ ] <texto>` como lista de criterios DoD.
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

**Si no se pasó `--restart`:**
```
Se encontró un acceptance-report.md completo con resultado {final-status}.

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
  1. Generar `acceptance-report.md` con `session-status: partial` incluyendo los criterios evaluados hasta el momento
  2. Mantener `story.md` en `ACCEPTANCE/IN-PROGRESS`
  3. Mostrar: `💾 Sesión guardada. Ejecuta /story-acceptance {story_id} para reanudar.`
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
$TOTAL_CRITERIOS = total de criterios evaluados en esta sesión + ejecuciones anteriores (si reanudación)
$TOTAL_APPROVED  = criterios con APPROVED
$TOTAL_REJECTED  = criterios con REJECTED
$TOTAL_BLOCKED   = criterios con BLOCKED
```

#### 7b. Determinar resultado final

```
si $TOTAL_REJECTED = 0 AND $TOTAL_BLOCKED = 0  → $FINAL_STATUS = ACCEPTANCE-APPROVED
si $TOTAL_REJECTED > 0                         → $FINAL_STATUS = ACCEPTANCE-REJECTED
si $TOTAL_REJECTED = 0 AND $TOTAL_BLOCKED > 0  → $FINAL_STATUS = ACCEPTANCE-BLOCKED
```

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
| `{session_status}` | `complete` |
| `{final_status}` | `ACCEPTANCE-APPROVED`, `ACCEPTANCE-REJECTED` o `ACCEPTANCE-BLOCKED` |
| `{total_criterios}` | Total de criterios evaluados |
| `{total_approved}` | Criterios APPROVED |
| `{total_rejected}` | Criterios REJECTED |
| `{total_blocked}` | Criterios BLOCKED |
| `{criterios_detalle}` | Tabla con filas: `\| N \| texto \| RESULTADO \| observación \| HH:MM \|` |
| `{dod_criterios}` | Filas: `\| texto criterio DoD \| ✓ cumplido / ✗ no cumplido \|` según resultados |
| `{estado_final_texto}` | `**ACCEPTANCE APROBADO**`, `**ACCEPTANCE RECHAZADO: N criterios no aprobados**` o `**ACCEPTANCE BLOQUEADO: N criterios sin evaluar**` |
| `{historial_sesiones}` | Historial de sesiones previas o `<!-- Sin sesiones anteriores -->` |

Escribir el archivo en `$STORY_DIR/acceptance-report.md`.

#### 7e. Criterios DoD ACCEPTANCE en el reporte

Para cada criterio en `$DOD_CRITERIOS`:
- Si fue evaluado y APPROVED → `✓ cumplido`
- Si fue evaluado y REJECTED/BLOCKED → `✗ no cumplido`
- Si no fue evaluado en esta sesión → `— no evaluado`

---

### Paso 8 — Actualizar frontmatter de story.md y mostrar resultado

#### 8a. Actualizar frontmatter según resultado

**Si `$FINAL_STATUS = ACCEPTANCE-APPROVED`:**
```yaml
status: ACCEPTANCE
substatus: DONE
updated: {fecha}
```
Mostrar: `✅ ACCEPTANCE APROBADO: historia {story_id} lista para INTEGRATION`

**Si `$FINAL_STATUS = ACCEPTANCE-REJECTED`:**
```yaml
status: READY-FOR-IMPLEMENT
substatus: DONE
updated: {fecha}
```
Mostrar: `⚠️ ACCEPTANCE RECHAZADO: {N} criterio(s) no cumplen los criterios de aceptación. La historia regresa a READY-FOR-IMPLEMENT/DONE.`

**Si `$FINAL_STATUS = ACCEPTANCE-BLOCKED`:**
```yaml
status: ACCEPTANCE
substatus: BLOCKED
updated: {fecha}
```
Mostrar: `⚠️ ACCEPTANCE BLOQUEADO: {N} criterio(s) no pudieron evaluarse. La historia permanece en ACCEPTANCE. Resuelve el impedimento y re-ejecuta /story-acceptance.`

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
─────────────────────────────────────────────────────────────

📄 Reporte generado: {$STORY_DIR}/acceptance-report.md
📋 Estado story.md: ACCEPTANCE/DONE ✓                        (si ACCEPTANCE-APPROVED)
📋 Estado story.md: READY-FOR-IMPLEMENT/DONE ⚠️               (si ACCEPTANCE-REJECTED)
📋 Estado story.md: ACCEPTANCE/BLOCKED ⚠️                     (si ACCEPTANCE-BLOCKED)

✅ ACCEPTANCE APROBADO: historia {story_id} lista para INTEGRATION
```
o bien:
```
⚠️ ACCEPTANCE RECHAZADO: {N} criterio(s) no cumplen los criterios de aceptación.
   La historia regresa a READY-FOR-IMPLEMENT/DONE para corrección.
   Revisa acceptance-report.md para detalles de los criterios rechazados.
```
o bien (si ACCEPTANCE-BLOCKED):
```
⚠️ ACCEPTANCE BLOQUEADO: {N} criterio(s) no pudieron evaluarse.
   La historia permanece en ACCEPTANCE/BLOCKED. Resuelve el impedimento y re-ejecuta /story-acceptance.
```

---

## Salida

- `$SPECS_BASE/specs/stories/<story-id>/acceptance-report.md` — reporte de validación con trazabilidad por criterio, resumen ejecutivo, historial de sesiones e historial de versiones anteriores
- `story.md` frontmatter actualizado:
  - `status: ACCEPTANCE / substatus: DONE` — si todos los criterios APPROVED (ACCEPTANCE-APPROVED)
  - `status: READY-FOR-IMPLEMENT / substatus: DONE` — si ≥1 criterio REJECTED (ACCEPTANCE-REJECTED)
  - `status: ACCEPTANCE / substatus: BLOCKED` — si ≥1 criterio BLOCKED sin ningún REJECTED (ACCEPTANCE-BLOCKED)

## Test Cases

### Caso 1 — Happy path (todos APPROVED)

**Input:** Historia `FEAT-NNN` con `status: VERIFY / substatus: DONE`, 2 escenarios Gherkin, sección ACCEPTANCE en DoD
**Acción:** Ejecutar `/story-acceptance FEAT-NNN`, responder PASS a todos los criterios
**Output esperado:**
- `acceptance-report.md` con `final-status: ACCEPTANCE-APPROVED`, `session-status: complete`
- `story.md` actualizado a `status: ACCEPTANCE / substatus: DONE`
- Mensaje: "ACCEPTANCE APROBADO: historia FEAT-NNN lista para INTEGRATION"

### Caso 2 — Criterio rechazado

**Input:** Historia `FEAT-NNN` con `status: VERIFY / substatus: DONE`
**Acción:** Responder FAIL con observación "No muestra mensaje de error" al segundo criterio
**Output esperado:**
- `acceptance-report.md` con `final-status: ACCEPTANCE-REJECTED`, criterio 2 como REJECTED con observación
- `story.md` actualizado a `status: READY-FOR-IMPLEMENT / substatus: DONE`
- Mensaje: "ACCEPTANCE RECHAZADO: 1 criterio(s) no cumplen los criterios de aceptación. La historia regresa a READY-FOR-IMPLEMENT/DONE."

### Caso 3 — Estado incorrecto

**Input:** Historia con `status: IMPLEMENTING / substatus: IN-PROGRESS`
**Acción:** Ejecutar `/story-acceptance FEAT-NNN`
**Output esperado:**
- Mensaje de error con estado actual y estados válidos requeridos
- Ningún archivo modificado

### Caso 4 — DoD sin sección ACCEPTANCE

**Input:** Historia en `VERIFY/DONE`, `definition-of-done-story.md` sin sección ACCEPTANCE
**Acción:** Ejecutar `/story-acceptance FEAT-NNN`
**Output esperado:**
- Aviso: "No se encontró sección ACCEPTANCE en el DoD. Se usarán los criterios de story.md"
- Sesión continúa usando solo criterios Gherkin

### Caso 5 — Sesión interrumpida y reanudada

**Input:** `acceptance-report.md` con `session-status: partial` (1 de 2 criterios evaluados)
**Acción:** Ejecutar `/story-acceptance FEAT-NNN` nuevamente, responder "c" para continuar
**Output esperado:**
- El skill presenta desde el criterio 2 (el primero pendiente)
- No repite el criterio 1 ya evaluado
