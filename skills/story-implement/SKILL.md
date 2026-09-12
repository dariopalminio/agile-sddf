---
name: story-implement
description: >-
  Orquesta el ciclo TDD completo (RED→GREEN→REFACTOR) delegando generación de pruebas y código a skills en sddf.config.yaml.
  Usar para implementar una historia con TDD (modos: interactivo y --auto para CI).
  Invocar para "story-implement", "implementar con TDD", "ciclo TDD historia", "ciclo TDD completo".
triggers:
  - "story-implement"
  - "implementar con TDD"
  - "ciclo TDD historia"
  - "ciclo TDD completo"
  - "fase RED historia"
  - "fase GREEN historia"
  - "fase REFACTOR historia"
  - "generar tests y código"
  - "modo automático"
  - "--auto"
---

# Skill: /story-implement

## Objetivo

Orquesta el ciclo TDD (RED → GREEN → REFACTOR) para una historia SDDF delegando la generación de pruebas y código a skills especializados declarados en `sddf.config.yaml`. El skill es agnóstico al stack: solo lee configuración y delega; los skills de generación son subagentes independientes.

**Posición en el pipeline:**
```
story-plan → story-testcases → story-implement (ciclo TDD completo) → story-code-review
```

**Qué hace este skill:**
- Invoca `skill-preflight` como Paso 0
- **Paso 0c:** gate de estado (`READY-FOR-IMPLEMENT/DONE` o `IMPLEMENT/IN-PROGRESS`), detección del modo rework por presencia de `fix-directives.md` (ronda, hallazgos y lista blanca) y transición de `story.md` a `IMPLEMENT/IN-PROGRESS` antes de leer `sddf.config.yaml`
- **Fase RED:** Lee `implement.test_generators` de `sddf.config.yaml`; valida skills (fail-fast); resuelve artefactos (`testcases.md` o fallback `story.md`+`design.md`); invoca cada skill de pruebas en orden con un bundle que lleva siempre `rework_round`, `fix_directives_path` y `whitelist` (`null` fuera de rework); confirma estado rojo; escribe `red-phase-status.json` (con `files_modified`, `rework_round` y `rework_evidence`)
- **Fase GREEN:** Lee `red-phase-status.json` como precondición; lee y valida `implement.code_generators` como lista; itera sobre cada capa activa invocando su skill con `phase:"GREEN"`, `layer:"{layer}"` y los mismos tres campos de rework en el bundle; consolida resultados (`files_generated` y `files_modified`); confirma que los tests pasan
- **Fase REFACTOR:** Itera sobre cada capa activa invocando su skill con `phase:"REFACTOR"`, `layer:"{layer}"` y los mismos tres campos de rework; verifica no-regresión ejecutando comandos de test
- **Reglas de robustez del rework:** gate de evidencia en RED (Paso 6b — error si 0 archivos de prueba generados/modificados y algún hallazgo con dimensión `requirements-coverage`; advertencia en otro caso) y barrera de alcance por lista blanca (Procedimiento — Consolidación de alcance, al cerrar cada fase: confirmación en interactivo, registro en `--auto`, rastro en `implement-report.md › Archivos fuera de lista blanca`)
- Al completar el ciclo exitosamente: evalúa DoD IMPLEMENT, genera `implement-report.md` (con la sección `## Ciclo de corrección — ronda N` solo en modo rework), actualiza `story.md` a `IMPLEMENT/DONE` (o `IMPLEMENT/IN-PROGRESS` si hay DoD-ERRORs), actualiza checklist de `epic.md`, escribe `cycle-status.json` (con `rework_round` y `out_of_scope_files`) y sugiere el siguiente paso (`→ Ejecuta /story-code-review {story_id}`)

**Qué NO hace este skill:**
- Crear skills de generación específicos (ej. `story-test-unit-jest`, `story-code-nodejs`) — son skills separados
- Gestionar modos interactivo/automático (`--auto`) — cubiertos en STORY-082
- Ejecutar el suite completo de CI — solo ejecuta comandos de test configurados por tipo
- Revertir archivos fuera de la lista blanca rechazados por el usuario — se sugiere `git diff --` / `git checkout --`, nunca se ejecuta
- Interpretar el texto de los hallazgos para decidir si requieren test — la regla de evidencia lee solo la columna `Dimensión` de `fix-directives.md`
- Reconocer `verify-report.md` / `acceptance-report.md` como señal de rework — solo `fix-directives.md` (rechazo de `story-code-review`) activa el modo rework
- Crear, modificar o eliminar `fix-directives.md` — su escritor único es `story-code-review`

---

### Posicionamiento

```
[story.md: READY-FOR-IMPLEMENT/DONE]  ← ejecución inicial (story-plan) o rework encolado por story-code-review (señal: fix-directives.md)
[story.md: IMPLEMENT/IN-PROGRESS]     ← reanudación (ciclo interrumpido o DoD con ❌)
     ↓
story-implement  → Entry point de la implementación: ejecuta TDD tarea por tarea  ← aquí
     │   Al iniciar (Paso 0c): story.md → IMPLEMENT/IN-PROGRESS
     │   Al finalizar: story.md → IMPLEMENT/DONE + epic.md checklist actualizado
     ↓
[story.md: IMPLEMENT/DONE]
──────────────────────────────────────────────────────────────────────────────────────
story.md            → What: requisitos, criterios de aceptación, comportamiento esperado
design.md           → How: arquitectura, componentes, interfaces, decisiones técnicas
testcases.md        → test plan detallado, casos de prueba explícitos
fix-directives.md   → Rework: hallazgos, lista blanca y ronda (solo si existe; escritor: story-code-review)
tasks.md            → (optativo) When: tareas de implementación, orden, seguimiento
implement-report.md → Done: código generado, estado por tarea, bloqueos documentados ← aquí
story-plan          → Entry point del planning: orquesta design → tasking → analyze
story-implement     → Entry point de la implementación: ejecuta TDD tarea por tarea  ← aquí
```
---

## Parámetros

| Parámetro | Tipo | Descripción |
|---|---|---|
| `{story_id}` | posicional | ID de la historia (ej. `STORY-059`) |

Si no se proporciona argumento, solicitar interactivamente.

---

## Filosofía, Restricciones y Reglas

### Filosofía
> **Write Tests First, Code Later**

### Reglas
- **Primero escribe las pruebas, luego el código**: cada punto funcional debe tener sus casos de prueba correspondientes
- **Las pruebas son documentación**: los casos de prueba describen el comportamiento esperado del sistema
- **Rojo-Verde-Refactorizar**: primero haz fallar la prueba, luego hazla pasar
- **Utiliza los fallos en las pruebas como retroalimentación**: una prueba fallida debe guiar su desarrollo y resaltar las mejoras necesarias.
- **Historias de nueva funcionalidad** → Los tests preexistentes no deben romperse.
- **Historias de refactorización** → Los tests pueden modificarse, siempre que el comportamiento funcional (criterios de aceptación) no cambie y que los tests sigan pasando después de la refactorización.
- **Transición de estado bloqueada por DoD-ERRORs:** si hay criterios DoD con `❌`, el frontmatter permanece en `IMPLEMENT/IN-PROGRESS`. Solo al resolver todos los bloqueos, cumplir el DoD y pruebas pasan, se actualiza a `IMPLEMENT/DONE`.
- **Las reglas de rework son deterministas:** la regla de RED (Paso 6b) compara únicamente valores de la columna `Dimensión`; la barrera de alcance (Procedimiento — Consolidación de alcance) compara rutas normalizadas contra `$WHITELIST_PATHS`. En `--auto` ninguna pide confirmación.
---

### Procedimiento — Consolidación de alcance (solo rework)

Procedimiento único que invocan los Pasos 4 (RED), 9 (GREEN) y 10 (REFACTOR) al cerrar su bucle de generators. **Precondición: `$REWORK_MODE = true`.** Si `$REWORK_MODE = false` el procedimiento **no se ejecuta**: no se toma ningún snapshot (no se invoca `git status`), no se emite ningún mensaje y no se registra nada. Es determinista: compara rutas normalizadas contra una lista; nunca interpreta el contenido de los archivos.

**Snapshots.** Antes del bucle de la fase, si `$REWORK_MODE = true`, `$SNAPSHOT_BEFORE = git status --porcelain` (ejecutado en la raíz del repositorio). Después del bucle, `$SNAPSHOT_AFTER` con el mismo comando. Todas las rutas (de los snapshots, de `results.json` y de `$WHITELIST`) se **normalizan**: relativas a la raíz del repositorio, separador `/`, sin `./` inicial, sin sufijo `:línea`.

**Sin control de versiones.** Si `git` no está disponible o el directorio no es un repositorio (la comprobación se hace una sola vez, antes del primer snapshot; `git status` no se invoca si falla), emitir:
```
[WARN] Sin control de versiones — el alcance se evalúa solo con el autoinforme de los generators
```
y omitir los snapshots: `$PHASE_NEW` y `$PHASE_MODIFIED` se calculan únicamente con el autoinforme (`files_generated` / `files_modified` de los `results.json` de la fase).

**Delta.** Solo cuentan las rutas cuyo estado cambió entre `$SNAPSHOT_BEFORE` y `$SNAPSHOT_AFTER`. Clasificación por el código de dos caracteres de `git status --porcelain`:
- `??` o `A ` ⇒ **nuevo** (`delta.nuevos`)
- ` M`, `MM`, `AM` o `RM` ⇒ **modificado** (`delta.modificados`)

**Conjuntos de la fase** (`files_generated` y `files_modified` = unión de esos campos en todos los `results.json` de la fase; campo ausente ⇒ `[]`):
- `$PHASE_NEW = delta.nuevos ∪ files_generated`
- `$PHASE_MODIFIED = delta.modificados ∪ files_modified`

**Procedimiento `Rutas permitidas`** (`$WHITELIST` → `$WHITELIST_PATHS`): a partir del `$WHITELIST = [{path, note}]` del Paso 0c.3:
```
$WHITELIST_PATHS = { normalizar(e.path) | e ∈ $WHITELIST ∧ "solo lectura" ∉ e.note }
```
Es decir, se **excluye** toda entrada cuya `note` contiene el texto `solo lectura` (p. ej. `docs/policies/dod-story.md — hallazgo #3 · **solo lectura**: …` no es una ruta permitida aunque figure en la lista blanca). Conjunto deduplicado; comparación por igualdad exacta de rutas normalizadas (sin globs ni directorios). `$WHITELIST = []` o `null` ⇒ `$WHITELIST_PATHS = ∅` (toda modificación queda fuera de lista; nunca es error).

**Fuera de alcance.** `$OUT_OF_SCOPE = $PHASE_MODIFIED \ $WHITELIST_PATHS`. Los archivos **nuevos** nunca disparan confirmación ni `[WARN]`: por cada `f ∈ $PHASE_NEW`, `$NEW_FILES_LOG += {fase, archivo: f, origen}` y nada más.

**Origen** de cada archivo = `{skill}` en RED (el `test_generator` cuyo `results.json` lo reporta) y `{skill}/{capa}` en GREEN/REFACTOR (p. ej. `skill-master/monolithic`). Si el archivo solo aparece en el delta de git y en ningún `results.json`, origen = el único generator invocado en la fase, o `desconocido` si hubo varios.

**Si `$OUT_OF_SCOPE = ∅`:** no emitir nada y continuar.

**Si `$OUT_OF_SCOPE ≠ ∅` y `$EXEC_MODE = interactive`:** mostrar el bloque (una línea `   · {archivo}  ← {origen}` por archivo fuera de lista; los archivos en lista blanca y los nuevos **no** se listan) y preguntar:
```
⚠️ Archivos modificados fuera de la lista blanca ({fase}):
   · {archivo}  ← {origen}

¿Aceptar estos cambios fuera de la lista blanca? (s/n)
```
Semántica idéntica a Pause-1:
- `s` (o Enter vacío) → por cada archivo: `$OUT_OF_SCOPE_LOG += {fase, archivo, origen, resolución: "confirmado (interactivo)"}`; la fase continúa.
- `n` → emitir y **terminar sin error** (exit limpio): no se ejecutan los pasos siguientes de la fase ni las fases posteriores, y **no se escribe en `story.md`** (queda en `IMPLEMENT/IN-PROGRESS`, fijado en 0c.4; una reanudación posterior es válida). Los archivos **no se revierten**: solo se sugiere el comando.
  ```
  🛑 Ciclo TDD detenido en Fase {fase}: cambios fuera de la lista blanca rechazados por el usuario
     · {archivo}  ← {origen}

     Revisa los cambios con:  git diff -- {archivo_1} {archivo_2}
     Revierte con:            git checkout -- {archivo_1} {archivo_2}
  ```
- Cualquier otra entrada → repetir la pregunta una sola vez más; si vuelve a ser inválida → asumir `n`.

**Si `$OUT_OF_SCOPE ≠ ∅` y `$EXEC_MODE = auto`:** sin prompt. Emitir (`{N}` = `|$OUT_OF_SCOPE|`):
```
[WARN] {N} archivo(s) fuera de la lista blanca en Fase {fase} — registrados en implement-report.md
   · {archivo}  ← {origen}
```
y por cada archivo: `$OUT_OF_SCOPE_LOG += {fase, archivo, origen, resolución: "registrado (--auto)"}`. Continuar.

`$OUT_OF_SCOPE_LOG: [{fase, archivo, origen, resolución}]` y `$NEW_FILES_LOG: [{fase, archivo, origen}]` se inicializan vacíos en 0c.3 y se acumulan a lo largo de las tres fases; 11b los vuelca en `### Archivos fuera de lista blanca` y 11e cuenta `|$OUT_OF_SCOPE_LOG|` en `out_of_scope_files`.

**Ejemplo (GREEN, capa `monolithic` con `skill-master`, `$WHITELIST_PATHS = {skills/story-implement/SKILL.md}`, el generator reporta `files_modified: ["skills/story-implement/SKILL.md", "README.md"]`):** `$OUT_OF_SCOPE = {README.md}`; `SKILL.md` no se lista porque está en la lista blanca.

- Interactivo:
  ```
  ⚠️ Archivos modificados fuera de la lista blanca (GREEN):
     · README.md  ← skill-master/monolithic

  ¿Aceptar estos cambios fuera de la lista blanca? (s/n)
  ```
  `s` ⇒ fila `| GREEN | README.md | skill-master/monolithic | confirmado (interactivo) |` en el reporte y continúa con el Paso 9b. `n` ⇒
  ```
  🛑 Ciclo TDD detenido en Fase GREEN: cambios fuera de la lista blanca rechazados por el usuario
     · README.md  ← skill-master/monolithic

     Revisa los cambios con:  git diff -- README.md
     Revierte con:            git checkout -- README.md
  ```
  y termina (exit limpio, `story.md` intacto, sin Paso 9b ni REFACTOR; `git checkout` **no** se ejecuta).
- `--auto`:
  ```
  [WARN] 1 archivo(s) fuera de la lista blanca en Fase GREEN — registrados en implement-report.md
     · README.md  ← skill-master/monolithic
  ```
  ⇒ fila `| GREEN | README.md | skill-master/monolithic | registrado (--auto) |` en el reporte y continúa.
- Entrada `solo lectura`: con `$WHITELIST = [{path: "docs/policies/dod-story.md", note: "hallazgos #3 · **solo lectura**: …"}, {path: "scripts/x.js", note: "hallazgo #1"}]` y `files_modified: ["docs/policies/dod-story.md", "scripts/x.js"]`, `$WHITELIST_PATHS = {scripts/x.js}` y `$OUT_OF_SCOPE = {docs/policies/dod-story.md}` ⇒ en `--auto`, `[WARN] 1 archivo(s) fuera de la lista blanca en Fase GREEN — registrados en implement-report.md` y fila `| GREEN | docs/policies/dod-story.md | skill-master/monolithic | registrado (--auto) |`; `scripts/x.js` no genera fila.

---

## Flujo de ejecución

> **Concepto fundamental — test_generators vs. ejecución de tests:**
>
> Los `test_generators` (Paso 4) generan **archivos estáticos** de especificación de pruebas:
> feature files Gherkin, archivos `.test.tsx`, step definitions TypeScript, etc.
> Estos archivos son la Fase RED del ciclo TDD — deben existir (y fallar) **antes** de la implementación.
>
> - **Paso 4 = GENERAR** archivos de prueba → no necesita servidor, base de datos, ni servicios externos corriendo
> - **Paso 5 = EJECUTAR** comandos para confirmar estado rojo → puede fallar por infraestructura
>
> `tasks.md` es un artefacto del desarrollador y **no guía el pipeline** de `story-implement`.
> El pipeline está guiado exclusivamente por `sddf.config.yaml` (qué skills invocar) y `testcases.md` (qué casos generar).

---

### Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight`. Si retorna `✗ Entorno inválido`, detener la ejecución. `skill-preflight` resuelve y expone `$SPECS_BASE` y `$CLI_ROOT` — usar `$SPECS_BASE` en todas las rutas a artefactos de specs y `$CLI_ROOT` en todas las rutas a skills (`$CLI_ROOT/skills/{skill}/SKILL.md`) en los pasos siguientes.

### Paso 0b — Parsear flags de invocación e inicializar `$EXEC_MODE`

Inspeccionar los argumentos de invocación buscando el flag `--auto`:

1. Si `--auto` está presente → `$EXEC_MODE = auto`
2. Si `--auto` está ausente → `$EXEC_MODE = interactive` (predeterminado)

Emitir: `[INFO] Modo de ejecución: {$EXEC_MODE}`

`$EXEC_MODE` es una variable en memoria para esta ejecución. No se persiste en ningún archivo ni se pasa a los subagentes.

---

### Paso 0c — Gate de estado, detección de modo y arranque

Este paso se ejecuta **antes** de leer `sddf.config.yaml` (Pasos 1–2): la historia debe ser implementable antes de validar la configuración. Las variables que resuelve (`$STORY_DIR`, `$ENTRADA_STATUS`, `$REWORK_MODE`, `$REWORK_ROUND`, `$FIX_DIRECTIVES_PATH`, `$WHITELIST`, `$REWORK_FINDINGS`, `$REWORK_MAX_SEVERITY`) viven en memoria durante esta ejecución y se reutilizan en los Pasos 3, 4, 6, 9, 10 y 11.

#### 0c.1 — Resolver `$STORY_DIR`

Resolver el directorio de la historia con Glob: `$SPECS_BASE/specs/03-stories/{story_id}*/`.

**Si no hay coincidencia:**
```
❌ No se encontró la historia {story_id} bajo $SPECS_BASE/specs/03-stories/

Verifica el ID o ejecuta /epic-generate-stories para generar la historia desde su épica.
```
Detener la ejecución.

Registrar `$STORY_DIR` = ruta del directorio encontrado. Los Pasos 3, 9, 10 y 11 usan `$STORY_DIR` en lugar de volver a resolver el glob.

#### 0c.2 — Gate de estado

Leer el frontmatter de `$STORY_DIR/story.md` y extraer `status` y `substatus`. Si alguno de los dos campos no existe, tratarlo como `status: SPECIFY` / `substatus: TODO`.

```
Precondición válida si:
  (status: READY-FOR-IMPLEMENT  AND substatus: DONE)        ← ejecución inicial, o rework encolado por story-code-review (señal: fix-directives.md)
  OR
  (status: IMPLEMENT            AND substatus: IN-PROGRESS) ← reanudación de un ciclo interrumpido o con DoD pendiente (❌)
```

**Si la precondición NO se cumple:** detener la ejecución **sin escribir nada** (ni `story.md`, ni `.tmp/`, ni código, ni invocar ningún subagente):
```
❌ La historia {story_id} no está en un estado válido para implementar

   Estado actual: status: {status} / substatus: {substatus}
   Estados admitidos:
     · READY-FOR-IMPLEMENT/DONE  (ejecución inicial, o rework encolado por story-code-review)
     · IMPLEMENT/IN-PROGRESS     (reanudación de un ciclo interrumpido o con DoD pendiente)

   → Si la historia aún no está planificada, ejecuta /story-plan {story_id}
```
Ejemplos: una historia ya aprobada (`CODE-REVIEW/DONE`) produce `Estado actual: status: CODE-REVIEW / substatus: DONE`; una historia sin `status`/`substatus` en el frontmatter produce `Estado actual: status: SPECIFY / substatus: TODO`. Una historia aprobada no se re-implementa sin pasar por un rechazo de `story-code-review`.

**Si la precondición se cumple:** registrar `$ENTRADA_STATUS` = valor de `status` leído (`READY-FOR-IMPLEMENT` o `IMPLEMENT`).

> **Reanudación (`IMPLEMENT/IN-PROGRESS`):** el gate la admite tanto si el ciclo anterior se interrumpió como si terminó con criterios DoD `❌`. En reanudación **no** se consulta `red-phase-status.json` ni `cycle-status.json` para saltar fases: el ciclo TDD se re-ejecuta completo (RED → GREEN → REFACTOR). El estado **no** decide el modo de trabajo — eso lo hace 0c.3.

#### 0c.3 — Detección de modo rework

`$REWORK_MODE = true` **si y solo si** existe el archivo `$STORY_DIR/fix-directives.md`. Es la **única** señal consultada: ni el estado de `story.md`, ni `verify-report.md`, ni `acceptance-report.md` (aunque existan con fallos o `REJECTED`) activan el modo rework. El skill **nunca crea, modifica ni elimina** `fix-directives.md`: su escritor único es `story-code-review`.

**Si `$REWORK_MODE = true`**, leer `fix-directives.md` (solo lectura) y registrar:

| Variable | Origen | Regla |
|---|---|---|
| `$FIX_DIRECTIVES_PATH` | ruta del archivo | `$STORY_DIR/fix-directives.md` |
| `$REWORK_ROUND` | campo `round` del frontmatter | entero ≥ 1; si el campo falta o no es un entero ≥ 1 (p. ej. `abc`) ⇒ `1`. **Nunca se escribe de vuelta** al archivo |
| `$REWORK_MAX_SEVERITY` | campo `max-severity` del frontmatter | texto tal cual; ausente ⇒ `null` |
| `$REWORK_FINDINGS` | tabla de `## Instrucciones de corrección` | filas cuya columna `#` es numérica; columnas `#`, `Archivo:Línea`, `Dimensión`, `Severidad`, `Hallazgo`, `Acción requerida`. `H` = número de filas. Tabla ausente o ilegible ⇒ `[]` + `[WARN] fix-directives.md sin tabla de hallazgos legible — continuando con 0 hallazgo(s)` |
| `$WHITELIST` | sección `## Lista blanca de archivos permitidos para modificar` | por cada línea que empieza por `- ` desde el encabezado hasta el siguiente `##`: `{ "path": primera ruta entre acentos graves, "note": texto libre restante de la viñeta }` (p. ej. `note: "hallazgo #2 · **solo lectura**: …"`). Las líneas de texto intermedias sin viñeta (p. ej. `Destino de las acciones requeridas:`) se ignoran, pero las viñetas que las siguen sí cuentan. `W` = número de entradas. La nota se conserva sin interpretarla |

**Si la sección de lista blanca no existe o no tiene viñetas:** `$WHITELIST = []` y emitir:
```
[WARN] fix-directives.md sin lista blanca — los generators recibirán whitelist vacía
```
Ningún fallo de parseo de `fix-directives.md` detiene la ejecución: se emite `[WARN]` y se continúa con valores vacíos.

**Si `$REWORK_MODE = false`:** `$REWORK_ROUND = null`, `$FIX_DIRECTIVES_PATH = null`, `$WHITELIST = null`, `$REWORK_FINDINGS = null`, `$REWORK_MAX_SEVERITY = null`.

En ambos casos inicializar `$OUT_OF_SCOPE_LOG = []` y `$NEW_FILES_LOG = []` (acumuladores de "Procedimiento — Consolidación de alcance"; solo reciben entradas en modo rework).

**Propagación a los subagentes:** `$REWORK_ROUND`, `$FIX_DIRECTIVES_PATH` y `$WHITELIST` viajan como las claves `rework_round`, `fix_directives_path` y `whitelist` en **todos** los bundles y bloques de contexto (Paso 4 — todos los tipos, incluido `e2e` —, Paso 9 y Paso 10), y `rework_round` también en `red-phase-status.json` (Paso 6) y `cycle-status.json` (11e). Los tres campos están **siempre** presentes: con los valores anteriores en modo rework y `null` fuera de él — el bundle tiene forma fija y un generator nunca debe distinguir "campo ausente" de "campo null". El párrafo "Instrucción de rework" del bloque de contexto se emite **solo si `$REWORK_MODE = true`**; fuera del modo rework el bloque no incluye ninguna mención a rework.

#### 0c.4 — Arranque

Escribir en el frontmatter de `$STORY_DIR/story.md`:
- Si `$ENTRADA_STATUS = READY-FOR-IMPLEMENT`: `status: IMPLEMENT`, `substatus: IN-PROGRESS`, `updated: {YYYY-MM-DD}`
- Si `$ENTRADA_STATUS = IMPLEMENT` (ya en `IMPLEMENT/IN-PROGRESS`): solo `updated: {YYYY-MM-DD}`

Esta es la transición `→ IMPLEMENT/IN-PROGRESS` del Posicionamiento: la historia sale de la cola (`READY-FOR-IMPLEMENT`) en cuanto empieza a trabajarse.

Mostrar el bloque de inicio:
```
🚀 Iniciando implementación para: {story_id}
   Directorio: {$STORY_DIR}
   Estado: {READY-FOR-IMPLEMENT/DONE | IMPLEMENT/IN-PROGRESS} ✓  → IMPLEMENT/IN-PROGRESS
   Modo: {🔁 Modo rework (ronda {N}) — {H} hallazgo(s) bloqueante(s), {W} archivo(s) en lista blanca | ciclo TDD completo}
```
- Línea `Estado`: en ejecución inicial `Estado: READY-FOR-IMPLEMENT/DONE ✓  → IMPLEMENT/IN-PROGRESS`; en reanudación `Estado: IMPLEMENT/IN-PROGRESS ✓  → IMPLEMENT/IN-PROGRESS`.
- Línea `Modo`: si `$REWORK_MODE = true`, `Modo: 🔁 Modo rework (ronda {N}) — {H} hallazgo(s) bloqueante(s), {W} archivo(s) en lista blanca` (p. ej. `🔁 Modo rework (ronda 1) — 2 hallazgo(s) bloqueante(s), 10 archivo(s) en lista blanca`; con lista blanca vacía, `0 archivo(s) en lista blanca`). Si `$REWORK_MODE = false`, `Modo: ciclo TDD completo` — sin mencionar rework. Este anuncio precede siempre a la Fase RED.

> **Detención posterior por configuración inválida:** si los Pasos 1–2 detienen la ejecución (p. ej. `sddf.config.yaml` ausente o skill `required: true` no encontrado), `story.md` queda en `IMPLEMENT/IN-PROGRESS`. Ese estado lo admite el gate en la siguiente ejecución (equivale a un ciclo interrumpido): basta corregir la configuración y volver a ejecutar `/story-implement {story_id}`. Los mensajes de error de los Pasos 1–2 no cambian.

---

### Paso 1 — Leer configuración de test_generators

Leer `sddf.config.yaml`.

**Si `sddf.config.yaml` no existe:**
```
❌ sddf.config.yaml no encontrado

Verifica que el archivo existe o ejecuta /sddf-init para inicializar el entorno.
```
Detener la ejecución.

Extraer la sección `implement.test_generators`.

Extraer también la sección `implement.e2e_context` (opcional). Si no existe, registrar `$E2E_CONTEXT = null`.

**Si la sección `implement` no existe o `test_generators` está vacío:**
```
[WARN] No hay test_generators configurados en sddf.config.yaml — Fase RED sin generación de pruebas
```
Continuar con Paso 4 (confirmación RED) sin invocar subagentes.

**Si un tipo activo no tiene campo `skill` declarado:**
```
[WARN] Sin skill declarado para tipo '<tipo>' — omitiendo ese tipo
```

---

### Paso 2 — Validar existencia de skills declarados (fail-fast)

Validar **todos** los skills declarados en `test_generators` **antes** de invocar ninguno:

Para cada entry en `test_generators`:
1. Construir ruta: `$CLI_ROOT/skills/{entry.skill}/SKILL.md`
2. Verificar existencia con Glob
3. **Si no existe y `required: true`:**
   ```
   ❌ Skill '<nombre>' declarado en sddf.config.yaml no encontrado en $CLI_ROOT/skills/
   
   Verifica el nombre del skill en sddf.config.yaml o instálalo antes de continuar.
   ```
   Detener la ejecución sin generar ningún archivo de prueba.
4. **Si no existe y `required: false`:**
   ```
   [WARN] Skill '<nombre>' no encontrado — omitiendo tipo '<tipo>'
   ```
   Marcar entry como omitida y continuar con la siguiente.

---

### Paso 3 — Resolver artefactos de especificación

Resolver los artefactos de la historia en `$STORY_DIR` (resuelto en el Paso 0c.1; no se vuelve a ejecutar el glob):

| Prioridad | Artefacto | Acción |
|-----------|-----------|--------|
| 1 | `testcases.md` existe | Usarlo como fuente primaria |
| 2 | `testcases.md` ausente | `⚠️ testcases.md no encontrado — generando pruebas desde story.md y design.md` |
| 3 | `story.md` o `design.md` ausentes (fallback) | `❌ Artefactos de especificación insuficientes (falta story.md y/o design.md)` + detener |

Registrar `$TESTCASES_PATH` (ruta de `testcases.md`, o `null` en fallback), `$STORY_PATH` y `$DESIGN_PATH`: son los valores de `testcases_path`, `story_path` y `design_path` en el bundle y en el bloque de contexto del Paso 4.

Construir bundle base de inputs (común a todos los test_generators):
```json
{
  "story_id": "<STORY-NNN>",
  "testcases_path": "<ruta o null>",
  "story_path": "<ruta>",
  "design_path": "<ruta>",
  "rework_round": <N | null>,
  "fix_directives_path": "<ruta> | null",
  "whitelist": [{ "path": "<ruta>", "note": "<texto libre>" }] | null
}
```

Los tres campos de rework (`rework_round`, `fix_directives_path`, `whitelist`) llevan los valores del Paso 0c.3 y están siempre presentes — `null` fuera del modo rework (ver 0c.3, "Propagación a los subagentes").

> **Nota sobre testcases.md:** Si existe, es la **fuente canónica y excluyente** de casos de prueba.
> Contiene todos los tipos (UT, CT, IT, E2E, etc.) ya derivados y tipificados por `story-testcases`.
> El skill NO necesita releer `story.md` ni `design.md` para derivar casos adicionales cuando
> `testcases.md` está presente. El subagente generador debe leer `testcases.md` y filtrar los casos
> del tipo que le corresponde.
>
> **Nota sobre tasks.md:** El skill NO lee ni considera `tasks.md` en ningún paso del ciclo TDD.
> La presencia de una tarea "T-NNN — ejecutar E2E" en `tasks.md` no reemplaza ni posterga la
> generación del spec E2E en Paso 4. `tasks.md` es un artefacto del desarrollador, no del pipeline.
>
> **Nota sobre fix-directives.md:** En modo rework, `testcases.md` sigue siendo la **fuente canónica** de casos
> (la resolución de artefactos de este paso no cambia). El acotamiento a los hallazgos de `fix-directives.md`
> **no** viaja en el bundle: lo aporta el párrafo "Instrucción de rework" del bloque de contexto (Paso 4).
> `tasks.md` sigue sin leerse también en modo rework.

---

### Paso 4 — Invocar skills de generación en orden

> ⚠️ **RESTRICCIÓN CRÍTICA — Omisiones válidas e inválidas:**
>
> Las **únicas** condiciones que justifican no invocar un test_generator en este paso son:
> - `skill: "none"` en el YAML → omisión declarada explícitamente por el proyecto
> - `required: false` + el skill no existe en `$CLI_ROOT/skills/` → skill opcional ausente
> - El skill retorna `status: error` durante la invocación → error real del subagente
>
> Los siguientes razonamientos **NO son válidos** para omitir un test_generator:
>
> | Razonamiento incorrecto | Por qué es incorrecto |
> |---|---|
> | "El tipo e2e requiere servidor corriendo" | Paso 4 genera archivos estáticos; el servidor no es relevante |
> | "El test E2E se genera/verifica en task T-NNN" | `tasks.md` no guía el pipeline; esta fase no lo lee |
> | "Hay un bloqueador de infraestructura para otro tipo" | Cada tipo es independiente; un error en `unit` no afecta a `e2e` |
> | "El servidor de la demo no está disponible" | Paso 4 genera archivos; Paso 5 ejecuta comandos — son pasos distintos |
> | "Estamos en modo rework, este tipo no aplica" | El modo rework no cambia las condiciones de omisión; el acotamiento viaja en la Instrucción de rework |
>
> Si un generator con `required: true` y `skill != "none"` no es invocado sin una condición válida,
> es un **error del orquestador**, no una situación prevista. Ver Paso 6 — validación post-escritura.

Inicializar `$RED_FILES_GENERATED = []` y `$RED_FILES_MODIFIED = []`.

**Si `$REWORK_MODE = true`:** antes de invocar el primer generator, tomar `$SNAPSHOT_BEFORE` según "Procedimiento — Consolidación de alcance" (o emitir el `[WARN] Sin control de versiones …` si no hay git). Fuera de rework no se toma ningún snapshot.

Para cada entry de `test_generators` no omitida (en el orden del YAML):

1. Mostrar: `[{tipo}] → invocando {skill}...`
2. Construir el bundle de inputs según el tipo:
   - **Tipos que no sean `e2e`**: usar el bundle base del Paso 3
   - **Tipo `e2e`**: usar el bundle base del Paso 3 **más** el campo `e2e_context`:
     ```json
     {
       "story_id": "<STORY-NNN>",
       "testcases_path": "<ruta o null>",
       "story_path": "<ruta>",
       "design_path": "<ruta>",
       "rework_round": <N | null>,
       "fix_directives_path": "<ruta> | null",
       "whitelist": [{ "path": "<ruta>", "note": "<texto libre>" }] | null,
       "e2e_context": {
         "framework": "<valor de sddf.config.yaml implement.e2e_context o null>",
         "base_path": "<valor de sddf.config.yaml o null>",
         "features_path": "<valor de sddf.config.yaml o null>",
         "steps_path": "<valor de sddf.config.yaml o null>",
         "pages_path": "<valor de sddf.config.yaml o null>",
         "support_path": "<valor de sddf.config.yaml o null>"
       }
     }
     ```
     Si `$E2E_CONTEXT = null` (sección ausente en el YAML), pasar `"e2e_context": null`.
     En ese caso el subagente es responsable de explorar el proyecto para detectar el framework E2E
     (buscar scripts E2E en `package.json`, archivos de configuración comunes como `cucumber.js`,
     `playwright.config.ts`, `cypress.config.ts`) y respetar la estructura de directorios existente.
3. Invocar el skill siguiendo el contrato ADR-0002:
   a. Leer `$CLI_ROOT/skills/{skill}/SKILL.md` con `Read`
   b. Lanzar subagente vía `Agent` tool con `subagent_type: general-purpose`, cuyo prompt es:
      - Contenido íntegro del SKILL.md leído
      - Bloque de contexto con las variables resueltas:
        ```
        Contexto de invocación:
        - story_id: {story_id}
        - testcases_path: {$TESTCASES_PATH}
        - story_path: {$STORY_PATH}
        - design_path: {$DESIGN_PATH}
        - e2e_context: {$E2E_CONTEXT}   ← solo para tipo e2e; null si la sección está ausente en el YAML
        - rework_round: {$REWORK_ROUND}   ← entero en modo rework; null fuera de él
        - fix_directives_path: {$FIX_DIRECTIVES_PATH}   ← ruta en modo rework; null fuera de él
        - whitelist: {$WHITELIST}   ← [{path, note}] en modo rework ([] si la sección faltaba); null fuera de él
        - Salida esperada en results.json: status, message, files_generated, files_modified

        Instrucción de rework (RED): genera únicamente los tests que cubren los hallazgos de la tabla "Instrucciones de corrección" de {fix_directives_path}; no regeneres tests existentes que ya pasan.
        ```
      Las tres claves de rework se emiten siempre; el párrafo "Instrucción de rework (RED)" solo si `$REWORK_MODE = true` (ver 0c.3). La línea `Salida esperada …` se emite **siempre** (todos los tipos, incluido `e2e`; todos los modos): fija el contrato de salida del subagente (`files_modified` es opcional para el generator — ausente ⇒ `[]`).
4. El subagente escribe sus resultados en `.tmp/story-implement/{story_id}/{tipo}/results.json`
5. **Si el subagente retorna `status: error`:**
   ```
   ❌ El skill '{skill}' retornó error durante la Fase RED — deteniendo ejecución
   
   Error: {message}
   ```
   Detener sin invocar skills siguientes.
6. **Si retorna `status: ok`:**
   - Registrar `files_generated` del subagente y agregarlo a `$RED_FILES_GENERATED`
   - Registrar `files_modified` del subagente (si el campo existe; `[]` si no) y agregarlo a `$RED_FILES_MODIFIED` — en rework un generator puede añadir casos a un archivo de pruebas existente en lugar de crear uno nuevo
   - Mostrar: `[{tipo}] ✓ {N} archivo(s) generado(s), {M} modificado(s)`
   - Añadir el tipo a `$RED_GENERATORS_INVOKED`

**Al finalizar el bucle, si `$REWORK_MODE = true`:** tomar `$SNAPSHOT_AFTER` y ejecutar **Consolidación de alcance (RED)** con `fase = RED`, los `results.json` de todos los tipos invocados y origen `{skill}` (el `test_generator` que reportó cada archivo). Una detención por `n` ocurre aquí, antes del Paso 5. Fuera de rework este bloque no se ejecuta.

---

### Paso 5 — Confirmar estado RED

Para cada tipo generado exitosamente:

1. Leer `defaults.{type}.command` de `sddf.config.yaml`
2. **Si el comando existe:**
   - Ejecutarlo en el directorio raíz del proyecto
   - Exit code ≠ 0: `✅ Tests en estado rojo (fallan correctamente) — tipo: {tipo}`
   - Exit code = 0: `⚠️ Los tests PASAN sin implementación — verificar que los tests sean correctos`
3. **Si no hay comando declarado:**
   ```
   [INFO] Sin comando configurado para tipo '{tipo}' — confirmación de RED omitida
   ```

La confirmación RED **no cambia en modo rework**: exit code ≠ 0 ⇒ rojo confirmado; exit code = 0 ⇒ la misma advertencia `⚠️ Los tests PASAN sin implementación — verificar que los tests sean correctos`. Que un generator haya devuelto `files_generated: []` (p. ej. correcciones ya cubiertas por tests existentes) no es condición de error en este paso — la regla "RED sin tests nuevos" se evalúa en el Paso 6b (Gate de evidencia en rework), sobre el agregado de todos los generators.

---

### Paso 6 — Escribir output intermedio

Escribir `.tmp/story-implement/{story_id}/red-phase-status.json`:

```json
{
  "story_id": "{story_id}",
  "generators_invoked": ["unit", "e2e"],
  "generators_skipped": ["eval"],
  "files_generated": ["ruta/al/test.spec.js"],
  "files_modified": ["ruta/al/test-existente.spec.js"],
  "red_confirmed": true,
  "rework_round": {$REWORK_ROUND},
  "rework_evidence": "n/a",
  "timestamp": "{ISO timestamp}"
}
```

`rework_round` = `$REWORK_ROUND` (ver 0c.3): siempre presente, `null` fuera del modo rework.
`files_generated` = `$RED_FILES_GENERATED`; `files_modified` = `$RED_FILES_MODIFIED` (siempre presente; `[]` si ningún generator reportó modificaciones).
`rework_evidence` se escribe con el valor inicial `"n/a"`; el Paso 6b lo reescribe a `ok`, `warning` o `error` en modo rework y lo deja en `"n/a"` fuera de él.

Este archivo es la precondición que leerá la Fase GREEN antes de invocar el code-generator.

#### Validación post-escritura — Omisiones inválidas

Después de escribir el archivo, verificar que ningún generator con `required: true` y `skill != "none"` aparece en `generators_skipped`:

Para cada entry en `generators_skipped`:
1. Buscar esa entry en `sddf.config.yaml → implement.test_generators`
2. Si tiene `required: true` y `skill != "none"` → **detener la ejecución**:
   ```
   ❌ ERROR: El test_generator de tipo '{tipo}' (skill: '{skill}') está declarado como
      required:true en sddf.config.yaml pero fue omitido sin una condición válida.
   
   Condiciones válidas de omisión:
     · skill: "none" en el YAML
     · required: false + skill no existe en $CLI_ROOT/skills/
   
   Acción requerida:
     a) Volver al Paso 4 e invocar el skill '{skill}' para el tipo '{tipo}'
     b) O cambiar required: false en sddf.config.yaml si la omisión es intencional permanente
   ```
3. No continuar con Pause-1 ni Paso 7 hasta resolver.

---

### Paso 6b — Gate de evidencia en rework

Evalúa **una sola vez**, al cerrar la Fase RED (después de la Consolidación de alcance del Paso 4 y de la validación post-escritura del Paso 6), si el rework aporta evidencia (tests) sobre el agregado de todos los `test_generators`. Es determinista: compara valores de columna, nunca interpreta el texto de los hallazgos. Es independiente de la barrera de alcance: esta regla decide *si hay tests*, aquella *dónde se tocó*.

**Si `$REWORK_MODE = false`:** dejar `"rework_evidence": "n/a"` en `red-phase-status.json` y continuar con Pause-1 sin emitir nada.

**Si `$REWORK_MODE = true`:**

1. `$RED_TEST_FILES = $RED_FILES_GENERATED ∪ $RED_FILES_MODIFIED` (unión de `files_generated` y `files_modified` de todos los `results.json` de la Fase RED). Un archivo de pruebas existente **modificado** cuenta como evidencia igual que uno nuevo.
2. **Si `|$RED_TEST_FILES| > 0`:** reescribir `red-phase-status.json` con `"rework_evidence": "ok"` y continuar con Pause-1 sin emitir mensaje.
3. **Si `|$RED_TEST_FILES| = 0`:** aplicar el procedimiento **`Lectura de dimensiones`** sobre `$REWORK_FINDINGS` (0c.3):
   - Localizar la columna cuyo encabezado es `Dimensión` **por nombre** (no se asume posición).
   - Recoger el valor de esa columna en cada fila de datos (trim, sin acentos graves) ⇒ `$FIX_DIRECTIVES_DIMENSIONS` (conjunto).
   - **Solo se lee la columna `Dimensión`**: ni `Hallazgo`, ni `Acción requerida`, ni `Severidad` influyen en la decisión. Tabla ausente, ilegible, o sin columna `Dimensión` (`$REWORK_FINDINGS = []`) ⇒ conjunto vacío.

   Luego decidir, en este orden:

   a. **`$FIX_DIRECTIVES_DIMENSIONS = ∅`** (tabla ilegible — fallar cerrado): reescribir `"rework_evidence": "error"`, emitir y **detener** (sin Pause-1 ni Paso 7; `story.md` no se toca — queda en `IMPLEMENT/IN-PROGRESS`):
      ```
      ❌ fix-directives.md sin tabla "Instrucciones de corrección" legible — no se puede evaluar la evidencia del rework

      Un rework sin tabla de hallazgos legible no es ejecutable. Regenera fix-directives.md con /story-code-review {story_id}.
      ```
   b. **`requirements-coverage ∈ $FIX_DIRECTIVES_DIMENSIONS`:** reescribir `"rework_evidence": "error"`, emitir y **detener** (sin Pause-1 ni Paso 7; ningún code_generator se invoca; `story.md` no recibe escrituras adicionales). `(#N, #M)` = valores de la columna `#` de las filas cuya `Dimensión` es `requirements-coverage`:
      ```
      ❌ Rework sin evidencia: la Fase RED no generó ni modificó archivos de prueba y fix-directives.md contiene hallazgos requirements-coverage (#N, #M)

      Un criterio de aceptación no cubierto siempre es testeable. Añade los tests que demuestran la cobertura o revisa los test_generators de sddf.config.yaml.
      ```
   c. **En cualquier otro caso** (conjunto no vacío sin `requirements-coverage` — incluye `code-quality`, `integration-architecture`, `security`, `DoD-CODE-REVIEW` y **cualquier valor desconocido**, p. ej. una dimensión de un revisor futuro; no se emite ningún mensaje de "dimensión desconocida"): reescribir `"rework_evidence": "warning"`, emitir y **continuar** con Pause-1 / Paso 7. `{lista}` = valores de `$FIX_DIRECTIVES_DIMENSIONS` separados por `, ` en el orden de la tabla:
      ```
      ⚠️ Rework sin tests nuevos: la Fase RED no generó ni modificó archivos de prueba; dimensiones presentes: {lista} — continuando con la Fase GREEN
      ```
      Ejemplos: con la tabla del fixture `STORY-090/fix-directives.md` ⇒ `dimensiones presentes: code-quality, integration-architecture, DoD-CODE-REVIEW`; con una única fila de un revisor futuro ⇒ `dimensiones presentes: performance`.

`rework_evidence ∈ {ok, warning, error, n/a}` queda persistido en `red-phase-status.json` con el valor final; el Paso 7 lo lee como precondición en una reanudación sin duplicar la regla.

---

### Pause-1 — Confirmación interactiva antes de Fase GREEN

**Si `$EXEC_MODE = auto`:** saltar este bloque completamente sin mostrar nada.

**Si `$EXEC_MODE = interactive`:**

Mostrar resumen de la Fase RED completada:
```
📋 Fase RED completada
   · Tipos generados: {$RED_GENERATORS_INVOKED}
   · Tests en rojo: ✅ (confirmado) / ⚠️ (sin confirmar)

¿Continuar con la Fase GREEN? (s/n)
```

Leer respuesta del usuario:
- `s` (o Enter vacío) → continuar con Paso 7
- `n` → emitir `🛑 Ciclo TDD pausado por el usuario tras Fase RED` y terminar sin error (exit limpio)
- Cualquier otra entrada → repetir la pregunta una sola vez más
  - Si vuelve a ser inválida → asumir `n` (emitir `🛑 Ciclo TDD pausado por el usuario tras Fase RED` y terminar)

---

### Paso 7 — Verificar precondición RED (Fase GREEN)

Leer `.tmp/story-implement/{story_id}/red-phase-status.json`.

**Si el archivo no existe:**
```
❌ Precondición RED no cumplida: .tmp/story-implement/{story_id}/red-phase-status.json no encontrado

Ejecuta story-implement primero para completar la Fase RED antes de continuar con GREEN.
```
Detener la ejecución.

**Si el archivo existe pero `red_confirmed: false`:**
```
❌ Precondición RED no cumplida: red_confirmed es false en red-phase-status.json

La Fase RED no fue confirmada correctamente. Revisa los archivos de prueba generados.
```
Detener la ejecución.

**Si el archivo existe pero `rework_evidence: "error"`:**
```
❌ Precondición RED no cumplida: rework_evidence es error en red-phase-status.json

La Fase RED del rework no aportó evidencia (ver Paso 6b). Añade los tests que cubren los hallazgos requirements-coverage y re-ejecuta /story-implement {story_id}.
```
Detener la ejecución sin invocar ningún code_generator y sin modificar `story.md`.

**Si el archivo existe, `red_confirmed: true` y `rework_evidence ≠ "error"`:**
Extraer y registrar internamente:
- `$RED_STORY_ID` = `story_id`
- `$RED_FILES_GENERATED` = `files_generated`
- `$RED_FILES_MODIFIED` = `files_modified` (ausente en archivos anteriores a este campo ⇒ `[]`)
- `$RED_GENERATORS_INVOKED` = `generators_invoked`
- `rework_round`: solo informativo — `$REWORK_ROUND` ya quedó fijado en 0c.3 en esta misma ejecución y no se sobreescribe desde este archivo

Este paso valida **únicamente** `red_confirmed` y `rework_evidence`: el valor de `rework_round` (entero, `null` o ausente en archivos anteriores a este campo) nunca invalida la precondición; `rework_evidence` ausente, `"n/a"`, `"ok"` o `"warning"` tampoco.

Mostrar: `[INFO] Precondición RED verificada — story_id: {$RED_STORY_ID}, {N} archivo(s) de prueba`

---

### Paso 8 — Leer y validar code_generators

Leer `sddf.config.yaml` (ya cargado en Paso 1).

Extraer `implement.code_generators` como lista.

**Si `implement.code_generators` no existe en el YAML o está vacío:**
```
❌ implement.code_generators no declarado o vacío en sddf.config.yaml

Añade la sección code_generators bajo implement en sddf.config.yaml.
```
Detener la ejecución.

Inicializar `$CODE_GENERATORS_VALID = []` y `$CODE_GENERATORS_SKIPPED = []`.

Para cada entry `{layer, skill, required}` en la lista (en orden del YAML):

1. **Si `skill == "none"`:**
   ```
   [INFO] Capa '{layer}': skill none — omitiendo
   ```
   Añadir `{layer}` a `$CODE_GENERATORS_SKIPPED`. Continuar con la siguiente entry.

2. Verificar existencia: `$CLI_ROOT/skills/{skill}/SKILL.md` (Glob).

3. **Si el skill no existe y `required: true`:**
   ```
   ❌ Skill '{skill}' (capa '{layer}') declarado como code_generator no encontrado en $CLI_ROOT/skills/

   Verifica el nombre del skill en sddf.config.yaml o instálalo antes de continuar.
   ```
   Detener la ejecución.

4. **Si el skill no existe y `required: false`:**
   ```
   [WARN] Skill '{skill}' (capa '{layer}') no encontrado — omitiendo capa
   ```
   Añadir `{layer}` a `$CODE_GENERATORS_SKIPPED`. Continuar con la siguiente entry.

5. **Si el skill existe:** añadir la entry completa `{layer, skill, required}` a `$CODE_GENERATORS_VALID`.

**Si `$CODE_GENERATORS_VALID` está vacío** (ningún error bloqueante, pero ningún skill activo):
```
[WARN] Ningún code_generator activo — Fases GREEN y REFACTOR sin invocación de skills
```
Continuar (no es error).

Mostrar: `[INFO] code_generators resueltos: {N} activo(s), {M} omitido(s)`

---

### Paso 9 — Fase GREEN: invocar code_generators

Inicializar `$GREEN_FILES_GENERATED = []`, `$GREEN_FILES_MODIFIED = []` y `$GREEN_LAYERS_OK = []`.

**Si `$REWORK_MODE = true`:** antes de invocar la primera capa, tomar `$SNAPSHOT_BEFORE` según "Procedimiento — Consolidación de alcance". Fuera de rework no se toma ningún snapshot.

Para cada entry `{layer, skill, required}` en `$CODE_GENERATORS_VALID` (en orden del YAML):

Construir bundle de inputs:
```json
{
  "story_id": "{$RED_STORY_ID}",
  "phase": "GREEN",
  "layer": "{layer}",
  "test_files": "{$RED_FILES_GENERATED}",
  "story_path": "{$STORY_DIR}/story.md",
  "design_path": "{$STORY_DIR}/design.md",
  "rework_round": <N | null>,
  "fix_directives_path": "<ruta> | null",
  "whitelist": [{ "path": "<ruta>", "note": "<texto libre>" }] | null
}
```

Mostrar: `[GREEN/{layer}] → invocando {skill}...`

Invocar el skill siguiendo el contrato ADR-0002:
1. Leer `$CLI_ROOT/skills/{skill}/SKILL.md` con `Read`
2. Lanzar subagente vía `Agent` tool con `subagent_type: general-purpose`, cuyo prompt es:
   - Contenido íntegro del SKILL.md leído
   - Bloque de contexto con las variables resueltas:
     ```
     Contexto de invocación:
     - story_id: {$RED_STORY_ID}
     - phase: GREEN
     - layer: {layer}
     - test_files: {$RED_FILES_GENERATED}
     - story_path: {$STORY_DIR}/story.md
     - design_path: {$STORY_DIR}/design.md
     - rework_round: {$REWORK_ROUND}   ← entero en modo rework; null fuera de él
     - fix_directives_path: {$FIX_DIRECTIVES_PATH}   ← ruta en modo rework; null fuera de él
     - whitelist: {$WHITELIST}   ← [{path, note}] en modo rework ([] si la sección faltaba); null fuera de él
     - Salida esperada en results.json: status, message, files_generated, files_modified

     Instrucción de rework (GREEN/REFACTOR): aplica solo la "Acción requerida" de cada hallazgo de {fix_directives_path}; limita los cambios a los archivos de whitelist; reporta en files_modified todo archivo tocado.
     ```
   Las tres claves de rework se emiten siempre; el párrafo "Instrucción de rework (GREEN/REFACTOR)" solo si `$REWORK_MODE = true` (ver 0c.3). La línea `Salida esperada …` se emite siempre (todos los modos).
3. El subagente escribe sus resultados en `.tmp/story-implement/{story_id}/green/{layer}/results.json`

**Si el subagente retorna `status: error`:**

- Si `required: true`:
  ```
  ❌ Fase GREEN fallida: skill '{skill}' (capa '{layer}') retornó error

  Error: {message}
  Sugerencia: revisa el código generado manualmente o ajusta la configuración del skill.
  ```
  Detener la ejecución **sin procesar capas restantes, sin ejecutar la Fase REFACTOR ni modificar story.md**.

- Si `required: false`:
  ```
  [WARN] Capa '{layer}' falló en GREEN — continuando con capas restantes
  Error: {message}
  ```
  Continuar con la siguiente entry.

**Si retorna `status: ok`:**
- Agregar `files_generated` del subagente a `$GREEN_FILES_GENERATED`.
- Agregar `files_modified` del subagente (si el campo existe; `[]` si no) a `$GREEN_FILES_MODIFIED` — en modo rework las correcciones suelen llegar como modificaciones, no como archivos nuevos; 11b usa ambas listas.
- Agregar `{layer}` a `$GREEN_LAYERS_OK`.
- Mostrar: `[GREEN/{layer}] ✓ {N} archivo(s) de producción generado(s), {M} modificado(s)`

Al finalizar todas las capas:

**Si `$REWORK_MODE = true`:** tomar `$SNAPSHOT_AFTER` y ejecutar **Consolidación de alcance (GREEN)** con `fase = GREEN`, `$GREEN_FILES_GENERATED`, `$GREEN_FILES_MODIFIED` y origen `{skill}/{layer}` (p. ej. `skill-master/monolithic`). Una detención por `n` ocurre aquí — antes de la línea `[GREEN] ✓ …` y del Paso 9b — y no modifica `story.md`. Fuera de rework este bloque no se ejecuta.

Mostrar: `[GREEN] ✓ {N} archivo(s) de producción generado(s) en {M} capa(s) ({$GREEN_LAYERS_OK})`

---

### Paso 9b — Confirmar estado GREEN (tests en verde)

Para cada tipo en `$RED_GENERATORS_INVOKED`:

1. Leer `defaults.{type}.command` de `sddf.config.yaml`
2. **Si el comando existe:**
   - Ejecutarlo en el directorio raíz del proyecto
   - Exit code = 0:
     - Emitir: `✅ Fase GREEN exitosa — tipo: {tipo} (tests pasan)`
     - **Actualizar checkboxes en testcases.md** (si existe la sección `## Test Cases Progress for`):
       - Determinar el prefijo de ID según el tipo del generador:
         `unit → UT` | `component → CT` | `integration → IT` | `api → API` | `e2e → E2E` | `eval → EV` | `store → ST`
       - En la sección de progreso, reemplazar `- [ ] {PREFIX}-` → `- [x] {PREFIX}-` para todas las líneas del prefijo
       - Emitir: `✅ testcases.md — {count} caso(s) de tipo {PREFIX} marcados como [x]`
       - Si testcases.md no existe o no tiene la sección: omitir silenciosamente
   - Exit code ≠ 0:
     - **Actualizar checkboxes en testcases.md** (si existe la sección `## Test Cases Progress for`):
       - Reemplazar `- [ ] {PREFIX}-` → `- [!] {PREFIX}-` para todas las líneas del prefijo
       - Emitir: `⚠️ testcases.md — {count} caso(s) de tipo {PREFIX} marcados como [!]`
     ```
     ❌ Fase GREEN fallida: el skill '{skill}' retornó error — los tests de tipo '{tipo}' no pasan
     
     Sugerencia: revisa el código generado en {archivos} y asegúrate de que satisface los tests.
     ```
     Detener sin ejecutar Fase REFACTOR ni modificar story.md.
3. **Si no hay comando declarado:**
   ```
   [INFO] confirmación GREEN omitida para tipo '{tipo}' — sin comando configurado
   ```

---

### Pause-2 — Confirmación interactiva antes de Fase REFACTOR

**Si `$EXEC_MODE = auto`:** saltar este bloque completamente sin mostrar nada.

**Si `$EXEC_MODE = interactive`:**

Mostrar resumen de la Fase GREEN completada:
```
📋 Fase GREEN completada
   · Archivos de producción generados: {N} ({$GREEN_FILES_GENERATED})
   · Tests: todos pasan ✅

¿Continuar con la Fase REFACTOR? (s/n)
```

Leer respuesta del usuario:
- `s` (o Enter vacío) → continuar con Paso 10
- `n` → emitir `🛑 Ciclo TDD pausado por el usuario tras Fase GREEN` y terminar sin error (exit limpio)
- Cualquier otra entrada → repetir la pregunta una sola vez más
  - Si vuelve a ser inválida → asumir `n` (emitir `🛑 Ciclo TDD pausado por el usuario tras Fase GREEN` y terminar)

---

### Paso 10 — Fase REFACTOR: invocar code_generators y verificar no-regresión

Inicializar `$REFACTOR_FILES_GENERATED = []` y `$REFACTOR_FILES_MODIFIED = []`.

**Si `$REWORK_MODE = true`:** antes de invocar la primera capa, tomar `$SNAPSHOT_BEFORE` según "Procedimiento — Consolidación de alcance". Fuera de rework no se toma ningún snapshot.

Para cada entry `{layer, skill, required}` en `$CODE_GENERATORS_VALID` (en orden del YAML):

Construir bundle de inputs:
```json
{
  "story_id": "{$RED_STORY_ID}",
  "phase": "REFACTOR",
  "layer": "{layer}",
  "test_files": "{$RED_FILES_GENERATED}",
  "story_path": "{$STORY_DIR}/story.md",
  "design_path": "{$STORY_DIR}/design.md",
  "rework_round": <N | null>,
  "fix_directives_path": "<ruta> | null",
  "whitelist": [{ "path": "<ruta>", "note": "<texto libre>" }] | null
}
```

Mostrar: `[REFACTOR/{layer}] → invocando {skill}...`

Invocar el skill siguiendo el contrato ADR-0002:
1. Leer `$CLI_ROOT/skills/{skill}/SKILL.md` con `Read`
2. Lanzar subagente vía `Agent` tool con `subagent_type: general-purpose`, cuyo prompt es:
   - Contenido íntegro del SKILL.md leído
   - Bloque de contexto con las variables resueltas:
     ```
     Contexto de invocación:
     - story_id: {$RED_STORY_ID}
     - phase: REFACTOR
     - layer: {layer}
     - test_files: {$RED_FILES_GENERATED}
     - story_path: {$STORY_DIR}/story.md
     - design_path: {$STORY_DIR}/design.md
     - rework_round: {$REWORK_ROUND}   ← entero en modo rework; null fuera de él
     - fix_directives_path: {$FIX_DIRECTIVES_PATH}   ← ruta en modo rework; null fuera de él
     - whitelist: {$WHITELIST}   ← [{path, note}] en modo rework ([] si la sección faltaba); null fuera de él
     - Salida esperada en results.json: status, message, files_generated, files_modified

     Instrucción de rework (GREEN/REFACTOR): aplica solo la "Acción requerida" de cada hallazgo de {fix_directives_path}; limita los cambios a los archivos de whitelist; reporta en files_modified todo archivo tocado.
     ```
   Las tres claves de rework se emiten siempre; el párrafo "Instrucción de rework (GREEN/REFACTOR)" solo si `$REWORK_MODE = true` (ver 0c.3). La línea `Salida esperada …` se emite siempre (todos los modos).
3. El subagente escribe sus resultados en `.tmp/story-implement/{story_id}/refactor/{layer}/results.json`

**Si el subagente retorna `status: error`:**

- Si `required: true`:
  ```
  ❌ Fase REFACTOR fallida: skill '{skill}' (capa '{layer}') retornó error

  Nota: los tests siguen en verde (Fase GREEN fue exitosa). El refactor no se aplicó.
  ```
  Detener sin modificar story.md.

- Si `required: false`:
  ```
  [WARN] Capa '{layer}' falló en REFACTOR — continuando con capas restantes
  ```
  Continuar con la siguiente entry.

**Si retorna `status: ok`:** agregar `files_generated` (si el campo existe; `[]` si no) a `$REFACTOR_FILES_GENERATED` y `files_modified` del subagente (si el campo existe; `[]` si no) a `$REFACTOR_FILES_MODIFIED`, y continuar con la siguiente capa.

**Al finalizar todas las capas, si `$REWORK_MODE = true`:** tomar `$SNAPSHOT_AFTER` y ejecutar **Consolidación de alcance (REFACTOR)** con `fase = REFACTOR`, `$REFACTOR_FILES_GENERATED`, `$REFACTOR_FILES_MODIFIED` y origen `{skill}/{layer}`. Una detención por `n` ocurre aquí, antes de la verificación de no-regresión, y no modifica `story.md`. Fuera de rework este bloque no se ejecuta.

A continuación (en ambos modos), verificar no-regresión ejecutando comandos de test por tipo:

Para cada tipo en `$RED_GENERATORS_INVOKED`:
1. Leer `defaults.{type}.command` de `sddf.config.yaml`
2. Si existe, ejecutar:
   - Exit code = 0: `✅ Fase REFACTOR sin regresiones — tipo: {tipo}`
   - Exit code ≠ 0: recopilar tests fallidos y emitir:
     ```
     ⚠️ Fase REFACTOR introdujo regresiones: {N} tests que pasaban ahora fallan
        Tests regresados:
        · {test_1}
        · {test_2}
     ```
     Registrar `$REFACTOR_REGRESIONES = true`. No modificar story.md. Continuar para reportar todos los tipos.

**Si todos los tipos sin regresiones:** registrar `$REFACTOR_REGRESIONES = false`.

---

### Paso 11 — Transición de estado y output final

**Si GREEN y REFACTOR completaron sin errores ni regresiones** (`$REFACTOR_REGRESIONES = false`):

#### 11a — Evaluar criterios DoD IMPLEMENT

Cargar los criterios de la sección `IMPLEMENT` de `docs/policies/dod-story.md`.

Para cada criterio evaluar:
- `✓` si hay evidencia positiva en los artefactos generados por el ciclo (archivos de test, código, sin errores reportados)
- `❌` si hay evidencia explícita de incumplimiento
- `⚠️` cuando no se puede determinar con certeza (caso por defecto para ejecución manual de tests)

Registrar `$DOD_BLOQUEADO`:
- `true` si algún criterio resultó `❌`
- `false` si ningún criterio resultó `❌`

#### 11b — Generar `implement-report.md`

Escribir `$STORY_DIR/implement-report.md` (sobreescritura completa en cada ejecución — no se acumulan rondas):

```markdown
---
type: implement-report
id: <story_id>
story: <STORY-NNN>
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
---

## Resumen

| Métrica | Valor |
|---|---|
| Fase RED confirmada | sí / no |
| Fase GREEN confirmada | sí / no |
| Fase REFACTOR confirmada | sí / no |
| Archivos de prueba generados | N |
| Archivos de producción generados | N |

## Ciclo TDD

| Fase | Estado | Detalle |
|---|---|---|
| RED | ✅/❌ | {tipos generados, rojo confirmado} |
| GREEN | ✅/❌ | {capas, archivos generados} |
| REFACTOR | ✅/❌ | {sin regresiones / regresiones detectadas} |

<!-- Sección condicional: SOLO si $REWORK_MODE = true. En modo normal se omite completa (ni el título). -->
## Ciclo de corrección — ronda {N}

- **Origen:** `fix-directives.md` (max-severity: {sev}) — {H} hallazgo(s) bloqueante(s)

| # | Archivo:Línea | Dimensión | Acción requerida | Archivos tocados | Estado |
|---|---|---|---|---|---|
| {n} | {archivo:línea} | {dimensión} | {acción} | {archivos de files_generated ∪ files_modified que coinciden} | ✓ aplicado / ⚠️ sin evidencia |

**Lista blanca recibida:**
- `{path}` — {note}

### Archivos fuera de lista blanca

| Fase | Archivo | Origen | Resolución |
|---|---|---|---|
| {RED/GREEN/REFACTOR} | {archivo} | {skill o skill/capa} | {confirmado (interactivo) / registrado (--auto)} |

**Archivos nuevos:**
- {ruta} ({fase}, {origen})

## DoD IMPLEMENT

| Criterio | Estado | Observación |
|---|---|---|
| {criterio 1} | ✓/❌/⚠️ | {observación} |
| {criterio N} | ✓/❌/⚠️ | {observación} |

> Los tests deben ejecutarse manualmente para confirmar el resultado final.
```

**Reglas de la sección "Ciclo de corrección — ronda {N}"** (entre `## Ciclo TDD` y `## DoD IMPLEMENT`):
- Se escribe **solo si `$REWORK_MODE = true`**; en modo normal no aparece ni el título.
- `{N}` = `$REWORK_ROUND`, `{sev}` = `$REWORK_MAX_SEVERITY` (`n/a` si `null`), `{H}` = número de filas de `$REWORK_FINDINGS`. Una fila de la tabla por hallazgo, en el orden de `fix-directives.md`.
- **Archivos tocados:** archivos de `$GREEN_FILES_GENERATED ∪ $GREEN_FILES_MODIFIED ∪ $REFACTOR_FILES_MODIFIED` cuya ruta coincide con la del hallazgo (la parte anterior a `:` de `Archivo:Línea`); `—` si ninguno.
- **Estado:** `✓ aplicado` si el archivo del hallazgo pertenece a esa unión; en cualquier otro caso `⚠️ sin evidencia` (p. ej. re-ejecución con correcciones ya aplicadas y `files_modified: []`). **Nunca `❌`**: este skill solo registra evidencia; el juicio sobre si el hallazgo quedó resuelto corresponde al siguiente `story-code-review`.
- **Lista blanca recibida:** una viñeta por entrada de `$WHITELIST` con la ruta entre acentos graves seguida de `— {note}` (omitir `— {note}` si la nota está vacía); si `$WHITELIST = []`, escribir `(vacía)`.

**Reglas de la subsección `### Archivos fuera de lista blanca`** (al final de `## Ciclo de corrección — ronda {N}`, antes de `## DoD IMPLEMENT`):
- Se escribe **siempre que `$REWORK_MODE = true`**, aunque no haya entradas (anclaje estable para la siguiente ronda de `story-code-review`). Fuera de rework **no se escribe** (ni el título).
- Tabla `| Fase | Archivo | Origen | Resolución |`: una fila por entrada de `$OUT_OF_SCOPE_LOG`, en orden RED → GREEN → REFACTOR, con `Resolución ∈ {confirmado (interactivo), registrado (--auto)}` (p. ej. `| GREEN | README.md | skill-master/monolithic | registrado (--auto) |`). Si `$OUT_OF_SCOPE_LOG` está vacío, sustituir la tabla por la línea `Ninguno`.
- Línea en blanco; luego `**Archivos nuevos:**` seguido de una viñeta `- {ruta} ({fase}, {origen})` por entrada de `$NEW_FILES_LOG` (p. ej. `- skills/story-implement/evals/evals.json (RED, skill-test-evals)`), o `Ninguno` si no hay entradas.

#### 11c — Actualizar `story.md` (condicional)

**Si `$DOD_BLOQUEADO = false`:**
- `status: IMPLEMENT`
- `substatus: DONE`
- `updated: {YYYY-MM-DD}`

**Si `$DOD_BLOQUEADO = true`:**
- `status: IMPLEMENT`
- `substatus: IN-PROGRESS`
- `updated: {YYYY-MM-DD}`
- Emitir: `⚠️ story.md permanece en IMPLEMENT/IN-PROGRESS por criterios DoD con ❌ — resolver antes de continuar`
- El pie del resumen final (11e) pasa a ser `→ Resuelve los criterios DoD ❌ y re-ejecuta /story-implement {story_id}` (el gate del Paso 0c admite `IMPLEMENT/IN-PROGRESS` en esa re-ejecución).

#### 11d — Actualizar `epic.md` (si existe épica padre)

1. Leer campo `parent` del frontmatter de `story.md`
2. Si `parent` existe, resolver ruta: `$SPECS_BASE/specs/02-epics/<parent>/epic.md`
3. **Si el archivo existe:**
   - Buscar la línea del checklist que contenga el id o slug de la historia (ej. `STORY-NNN`)
   - Cambiar `- [ ]` → `- [x]` en esa línea
   - Emitir: `[INFO] epic.md actualizado: [{story_id}] marcado como completado`
4. **Si no existe o `parent` está vacío:**
   - Emitir: `[INFO] epic.md no encontrado o sin parent declarado — omitiendo actualización`
   - No es condición de error.

#### 11e — Escribir `cycle-status.json` y mostrar resumen final

Escribir `.tmp/story-implement/{story_id}/cycle-status.json`:
```json
{
  "story_id": "{$RED_STORY_ID}",
  "red_confirmed": true,
  "green_confirmed": true,
  "refactor_confirmed": true,
  "files_generated": "{$GREEN_FILES_GENERATED}",
  "files_modified": "{$GREEN_FILES_MODIFIED ∪ $REFACTOR_FILES_MODIFIED}",
  "dod_bloqueado": false,
  "final_status": "IMPLEMENT/DONE",
  "rework_round": {$REWORK_ROUND},
  "out_of_scope_files": {N},
  "timestamp": "{ISO timestamp}"
}
```

`rework_round` = `$REWORK_ROUND`, igual que en `red-phase-status.json` (ver 0c.3). `out_of_scope_files` = `|$OUT_OF_SCOPE_LOG|` (siempre presente; `0` fuera de rework).

Mostrar resumen según `$EXEC_MODE`:

**Si `$EXEC_MODE = auto`:**
```
── Ciclo TDD completado automáticamente (--auto) ──────────
🔁 Modo rework (ronda {N})                                   ← solo si $REWORK_MODE = true
✅ Fase RED:      {N} tipo(s) generado(s) | rojo confirmado: {✅ / ⚠️}
✅ Fase GREEN:    {N} archivo(s) de producción generados
✅ Fase REFACTOR: sin regresiones
⚠️ {N} archivo(s) fuera de la lista blanca — ver implement-report.md › Archivos fuera de lista blanca   ← solo si $REWORK_MODE = true y N > 0
──────────────────────────────────────────────────────────
📄 implement-report.md → {$STORY_DIR}/implement-report.md
📄 cycle-status.json   → .tmp/story-implement/{story_id}/cycle-status.json
📋 story.md: {IMPLEMENT/DONE o IMPLEMENT/IN-PROGRESS} ✓
📋 epic.md: {actualizado / no encontrado}

DoD IMPLEMENT:
{tabla criterios ✓/❌/⚠️}

{→ Ejecuta /story-code-review {story_id} | → Resuelve los criterios DoD ❌ y re-ejecuta /story-implement {story_id}}
```

**Si `$EXEC_MODE = interactive`:**
```
✅ Ciclo TDD completado
   🔁 Modo rework (ronda {N})                                ← solo si $REWORK_MODE = true
   Fase RED:      tests en rojo confirmados
   Fase GREEN:    {N} archivo(s) de producción generados
   Fase REFACTOR: sin regresiones
   ⚠️ {N} archivo(s) fuera de la lista blanca — ver implement-report.md › Archivos fuera de lista blanca   ← solo si $REWORK_MODE = true y N > 0

   implement-report.md → {$STORY_DIR}/implement-report.md
   cycle-status.json   → .tmp/story-implement/{story_id}/cycle-status.json
   story.md            → {IMPLEMENT/DONE o IMPLEMENT/IN-PROGRESS}
   epic.md             → {actualizado / no encontrado}

DoD IMPLEMENT:
{tabla criterios ✓/❌/⚠️}

{→ Ejecuta /story-code-review {story_id} | → Resuelve los criterios DoD ❌ y re-ejecuta /story-implement {story_id}}
```

Reglas comunes a ambos formatos:
- La línea `🔁 Modo rework (ronda {N})` se emite **solo si `$REWORK_MODE = true`**; en modo normal se omite (sin mencionar rework).
- La línea `⚠️ {N} archivo(s) fuera de la lista blanca — ver implement-report.md › Archivos fuera de lista blanca` se emite **solo si `$REWORK_MODE = true` y `out_of_scope_files > 0`**; en cualquier otro caso se omite.
- El pie es obligatorio y depende de `$DOD_BLOQUEADO`: si `false` (story.md en `IMPLEMENT/DONE`) → `→ Ejecuta /story-code-review {story_id}` — en modo rework y en modo normal, porque el siguiente gate del pipeline es el mismo; si `true` (story.md en `IMPLEMENT/IN-PROGRESS`) → `→ Resuelve los criterios DoD ❌ y re-ejecuta /story-implement {story_id}`.

**Si hubo errores en GREEN o REFACTOR:** no ejecutar este paso (la detención ya ocurrió en el paso correspondiente).

---

## Manejo de errores

| Condición | Mensaje | Acción |
|---|---|---|
| Historia no encontrada (0c.1) | `❌ No se encontró la historia {story_id} bajo $SPECS_BASE/specs/03-stories/` | Detener ejecución |
| Estado de `story.md` no admitido (0c.2) | `❌ La historia {story_id} no está en un estado válido para implementar` | Detener sin modificar archivos (ni `story.md` ni `.tmp/`) ni invocar subagentes |
| `fix-directives.md` sin sección de lista blanca (0c.3) | `[WARN] fix-directives.md sin lista blanca — los generators recibirán whitelist vacía` | Continuar con `whitelist: []` |
| `fix-directives.md` con tabla "Instrucciones de corrección" ausente o ilegible (0c.3) | `[WARN] fix-directives.md sin tabla de hallazgos legible — continuando con 0 hallazgo(s)` | Continuar con hallazgos vacíos (`H = 0`) |
| Detención por configuración inválida tras 0c.4 (Pasos 1–2) | Mismo `❌` del paso correspondiente (p. ej. `❌ sddf.config.yaml no encontrado`) | La historia queda en `IMPLEMENT/IN-PROGRESS`; el gate lo admite en la siguiente ejecución |
| `sddf.config.yaml` no encontrado | `❌ sddf.config.yaml no encontrado` | Detener ejecución |
| `implement.test_generators` vacío o ausente | `[WARN] No hay test_generators configurados en sddf.config.yaml — Fase RED sin generación de pruebas` | Continuar sin subagentes |
| Tipo activo sin campo `skill` | `[WARN] Sin skill declarado para tipo '<tipo>' — omitiendo ese tipo` | Omitir tipo |
| Skill `required:true` no existe (test_generator) | `❌ Skill '<nombre>' declarado en sddf.config.yaml no encontrado en $CLI_ROOT/skills/` | Detener sin generar archivos |
| Skill `required:false` no existe (test_generator) | `[WARN] Skill '<nombre>' no encontrado — omitiendo tipo '<tipo>'` | Omitir tipo y continuar |
| `testcases.md` ausente | `⚠️ testcases.md no encontrado — generando pruebas desde story.md y design.md` | Continuar con fallback |
| Generator `required:true` con `skill!=none` en `generators_skipped` | `❌ ERROR: El test_generator de tipo '{tipo}' (skill: '{skill}') está declarado como required:true en sddf.config.yaml pero fue omitido sin una condición válida.` | Detener antes de GREEN; exigir corrección o cambiar a required:false |
| `story.md` o `design.md` ausentes | `❌ Artefactos de especificación insuficientes (falta story.md y/o design.md)` | Detener ejecución |
| Subagente retorna `status: error` (Fase RED) | `❌ El skill '{skill}' retornó error durante la Fase RED — deteniendo ejecución` | Detener sin invocar siguientes |
| Tests pasan sin implementación (Fase RED) | `⚠️ Los tests PASAN sin implementación — verificar que los tests sean correctos` | Advertir, continuar |
| `red-phase-status.json` no existe | `❌ Precondición RED no cumplida: .tmp/story-implement/{story_id}/red-phase-status.json no encontrado` | Detener Fase GREEN |
| `red_confirmed: false` en red-phase-status.json | `❌ Precondición RED no cumplida: red_confirmed es false en red-phase-status.json` | Detener Fase GREEN |
| Rework: RED sin archivos de prueba y hallazgo `requirements-coverage` (6b) | `❌ Rework sin evidencia: la Fase RED no generó ni modificó archivos de prueba y fix-directives.md contiene hallazgos requirements-coverage (#N, #M)` | Detener antes de GREEN (sin Pause-1 ni Paso 7); `rework_evidence: "error"`; story.md sin cambio |
| Rework: RED sin archivos de prueba, otras dimensiones (6b) | `⚠️ Rework sin tests nuevos: la Fase RED no generó ni modificó archivos de prueba; dimensiones presentes: {lista} — continuando con la Fase GREEN` | Advertir, continuar; `rework_evidence: "warning"` |
| Rework: tabla "Instrucciones de corrección" ilegible al evaluar evidencia (6b) | `❌ fix-directives.md sin tabla "Instrucciones de corrección" legible — no se puede evaluar la evidencia del rework` | Detener antes de GREEN; `rework_evidence: "error"` |
| `rework_evidence: "error"` en red-phase-status.json (Paso 7) | `❌ Precondición RED no cumplida: rework_evidence es error en red-phase-status.json` | Detener Fase GREEN sin invocar code_generators |
| Rework interactivo: usuario responde 'n' a archivos fuera de lista (Consolidación de alcance) | `🛑 Ciclo TDD detenido en Fase {fase}: cambios fuera de la lista blanca rechazados por el usuario` | Terminar sin error (exit limpio); archivos no revertidos (se sugiere `git diff --` / `git checkout --`); story.md sin cambio |
| Rework `--auto`: archivos fuera de lista (Consolidación de alcance) | `[WARN] {N} archivo(s) fuera de la lista blanca en Fase {fase} — registrados en implement-report.md` | Continuar; registrar en `### Archivos fuera de lista blanca` con `registrado (--auto)` |
| Rework sin control de versiones (Consolidación de alcance) | `[WARN] Sin control de versiones — el alcance se evalúa solo con el autoinforme de los generators` | Continuar sin snapshots; usar solo `files_generated`/`files_modified` de `results.json` |
| `implement.code_generators` no declarado o vacío | `❌ implement.code_generators no declarado o vacío en sddf.config.yaml` | Detener Fase GREEN |
| Entry con `skill: none` | `[INFO] Capa '{layer}': skill none — omitiendo` | Omitir capa |
| code_generator `required:true` no existe | `❌ Skill '{skill}' (capa '{layer}') declarado como code_generator no encontrado en $CLI_ROOT/skills/` | Detener Fase GREEN |
| code_generator `required:false` no existe | `[WARN] Skill '{skill}' (capa '{layer}') no encontrado — omitiendo capa` | Omitir capa, continuar |
| Ningún code_generator activo | `[WARN] Ningún code_generator activo — Fases GREEN y REFACTOR sin invocación de skills` | Continuar (no es error) |
| Subagente `required:true` retorna error (Fase GREEN) | `❌ Fase GREEN fallida: skill '{skill}' (capa '{layer}') retornó error` | Detener sin REFACTOR, story.md sin cambio |
| Subagente `required:false` retorna error (Fase GREEN) | `[WARN] Capa '{layer}' falló en GREEN — continuando con capas restantes` | Continuar con siguiente capa |
| Tests no pasan tras GREEN | `❌ Fase GREEN fallida: el skill '{skill}' retornó error — los tests de tipo '{tipo}' no pasan` | Detener sin REFACTOR, story.md sin cambio |
| Subagente `required:true` retorna error (Fase REFACTOR) | `❌ Fase REFACTOR fallida: skill '{skill}' (capa '{layer}') retornó error` | Detener, story.md sin cambio |
| Subagente `required:false` retorna error (Fase REFACTOR) | `[WARN] Capa '{layer}' falló en REFACTOR — continuando con capas restantes` | Continuar |
| REFACTOR introduce regresiones | `⚠️ Fase REFACTOR introdujo regresiones: {N} tests que pasaban ahora fallan` | Listar tests, story.md sin cambio |
| Usuario responde 'n' en Pause-1 | `🛑 Ciclo TDD pausado por el usuario tras Fase RED` | Terminar sin error (exit limpio), sin invocar GREEN ni REFACTOR |
| Usuario responde 'n' en Pause-2 | `🛑 Ciclo TDD pausado por el usuario tras Fase GREEN` | Terminar sin error (exit limpio), sin invocar REFACTOR |
| Entrada inválida repetida en pausa | Repetir pregunta una vez; si vuelve a ser inválida → asumir 'n' | Terminar como si usuario respondiera 'n' |
| Error en cualquier fase en modo `--auto` | Mismo `❌ {mensaje_error_fase}` que en modo interactivo | Detener sin prompt de confirmación al usuario |

---

## Arquitectura de delegación

```
story-implement (orquestador — Fase RED)
  └── {skill de tipo unit}   ← subagente, ej. story-test-unit-jest
  └── {skill de tipo e2e}    ← subagente, ej. story-test-e2e-playwright
  └── {skill de tipo eval}   ← subagente, ej. story-test-eval

story-implement (orquestador — Fases GREEN y REFACTOR)
  └── {skill capa frontend}  ← subagente, ej. code-frontend-library-react
  └── {skill capa backend}   ← subagente, ej. code-backend-nodejs (si existe)
  └── {skill capa database}  ← subagente, ej. code-database-prisma (si existe)
```

Los subagentes de Fase RED reciben el bundle `{story_id, testcases_path, story_path, design_path, rework_round, fix_directives_path, whitelist}` (más `e2e_context` para el tipo `e2e`) y escriben en `.tmp/story-implement/{story_id}/{tipo}/results.json`.
Los subagentes de Fases GREEN/REFACTOR reciben el bundle `{story_id, phase, layer, test_files, story_path, design_path, rework_round, fix_directives_path, whitelist}` y escriben en `.tmp/story-implement/{story_id}/{phase}/{layer}/results.json`.
Los tres campos de rework llevan los valores del Paso 0c.3 (`null` fuera de rework, nunca ausentes) y el bloque de contexto añade la "Instrucción de rework" solo en modo rework (ver 0c.3).
El orquestador nunca pasa su contexto completo heredado a los subagentes.

**Contrato de salida `results.json`** (todas las fases, todos los modos; el bloque de contexto lo anuncia con la línea `Salida esperada …`):
```json
{
  "status": "ok" | "error",
  "message": "<texto>",                 // opcional
  "files_generated": ["<ruta>"],        // archivos creados por el subagente
  "files_modified": ["<ruta>"]          // opcional: archivos existentes editados; ausente ⇒ []
}
```
En modo rework el orquestador une este autoinforme con el delta de `git status --porcelain` (ver "Procedimiento — Consolidación de alcance"): un generator que omite `files_modified` no deja la barrera de alcance inoperante.

La invocación sigue el contrato de 4 pasos del ADR-0002: `Read` del SKILL.md → `Agent` tool (`subagent_type: general-purpose`) → output en `.tmp/` → `Read` de resultados. Los skills de generación permanecen en `$CLI_ROOT/skills/` (no en `$CLI_ROOT/agents/`) para preservar su invocabilidad directa y la configurabilidad vía `sddf.config.yaml`.

---

## Salida

| Artefacto | Ruta | Descripción |
|---|---|---|
| Archivos de prueba | según skill de generación | Tests generados en código productivo |
| Archivos de producción | según skill de generación | Código generado en Fases GREEN/REFACTOR |
| `implement-report.md` | `$STORY_DIR/implement-report.md` | Reporte final: ciclo TDD, DoD compliance, estado por fase + sección `## Ciclo de corrección — ronda N` (con la subsección `### Archivos fuera de lista blanca`) solo en modo rework |
| `story.md` (actualizado) | `$STORY_DIR/story.md` | Frontmatter: 0c.4 → `IMPLEMENT/IN-PROGRESS` al arrancar; 11c → `IMPLEMENT/DONE` (o `IMPLEMENT/IN-PROGRESS` si DoD-ERRORs) |
| `epic.md` (actualizado) | `$SPECS_BASE/specs/02-epics/<parent>/epic.md` | Checklist con `[x]` para la historia completada (si existe) |
| `red-phase-status.json` | `.tmp/story-implement/{story_id}/red-phase-status.json` | Estado de la Fase RED — precondición para GREEN; incluye `files_generated`, `files_modified`, `rework_round` (`null` fuera de rework) y `rework_evidence` (`ok`/`warning`/`error`; `n/a` fuera de rework) |
| `cycle-status.json` | `.tmp/story-implement/{story_id}/cycle-status.json` | Estado final del ciclo TDD completo; incluye `rework_round` (`null` fuera de rework) y `out_of_scope_files` (`0` fuera de rework) |
| `results.json` por tipo/capa | `.tmp/story-implement/{story_id}/{tipo o fase/capa}/results.json` | Output de cada subagente: `{status, message?, files_generated, files_modified?}` |

---


