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
- **Fase RED:** Lee `implement.test_generators` de `sddf.config.yaml`; valida skills (fail-fast); resuelve artefactos (`testcases.md` o fallback `story.md`+`design.md`); invoca cada skill de pruebas en orden; confirma estado rojo; escribe `red-phase-status.json`
- **Fase GREEN:** Lee `red-phase-status.json` como precondición; lee y valida `implement.code_generators` como lista; itera sobre cada capa activa invocando su skill con `phase:"GREEN"` y `layer:"{layer}"`; consolida resultados; confirma que los tests pasan
- **Fase REFACTOR:** Itera sobre cada capa activa invocando su skill con `phase:"REFACTOR"` y `layer:"{layer}"`; verifica no-regresión ejecutando comandos de test
- Al completar el ciclo exitosamente: evalúa DoD IMPLEMENT, genera `implement-report.md`, actualiza `story.md` a `IMPLEMENT/DONE` (o `IMPLEMENT/IN-PROGRESS` si hay DoD-ERRORs), actualiza checklist de `release.md` y escribe `cycle-status.json`

**Qué NO hace este skill:**
- Crear skills de generación específicos (ej. `story-test-unit-jest`, `story-code-nodejs`) — son skills separados
- Gestionar modos interactivo/automático (`--auto`) — cubiertos en FEAT-082
- Ejecutar el suite completo de CI — solo ejecuta comandos de test configurados por tipo

---

### Posicionamiento

```
[story.md: READY-FOR-IMPLEMENT/DONE]    ← precondición inicial (viene de story-plan/story-analyze)
[story.md: IMPLEMENT/IN-PROGRESS]    ← precondición reanudación (viene de story-code-review needs-changes)
     ↓
story-implement  → Entry point de la implementación: ejecuta TDD tarea por tarea  ← aquí
     │   Al iniciar: story.md → IMPLEMENT/IN‑PROGRESS
     │   Al finalizar: story.md → IMPLEMENT/DONE + release.md checklist actualizado
     ↓
[story.md: IMPLEMENT/DONE]
──────────────────────────────────────────────────────────────────────────────────────
story.md          → What: requisitos, criterios de aceptación, comportamiento esperado
design.md         → How: arquitectura, componentes, interfaces, decisiones técnicas
testcases.md          → test plan detallado, casos de prueba explícitos
tasks.md          → (optativo) When: tareas de implementación, orden, seguimiento
implement-report.md → Done: código generado, estado por tarea, bloqueos documentados ← aquí
story-plan        → Entry point del planning: orquesta design → tasking → analyze
story-implement   → Entry point de la implementación: ejecuta TDD tarea por tarea  ← aquí
```
---

## Parámetros

| Parámetro | Tipo | Descripción |
|---|---|---|
| `{story_id}` | posicional | ID de la historia (ej. `FEAT-059`) |

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

Invocar `skill-preflight`. Si retorna `✗ Entorno inválido`, detener la ejecución. Usar `$SPECS_BASE` en todas las rutas siguientes.

### Paso 0b — Parsear flags de invocación e inicializar `$EXEC_MODE`

Inspeccionar los argumentos de invocación buscando el flag `--auto`:

1. Si `--auto` está presente → `$EXEC_MODE = auto`
2. Si `--auto` está ausente → `$EXEC_MODE = interactive` (predeterminado)

Emitir: `[INFO] Modo de ejecución: {$EXEC_MODE}`

`$EXEC_MODE` es una variable en memoria para esta ejecución. No se persiste en ningún archivo ni se pasa a los subagentes.

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

Resolver los artefactos de la historia en `$SPECS_BASE/specs/stories/<story_id>*/`:

| Prioridad | Artefacto | Acción |
|-----------|-----------|--------|
| 1 | `testcases.md` existe | Usarlo como fuente primaria |
| 2 | `testcases.md` ausente | `⚠️ testcases.md no encontrado — generando pruebas desde story.md y design.md` |
| 3 | `story.md` o `design.md` ausentes (fallback) | `❌ Artefactos de especificación insuficientes (falta story.md y/o design.md)` + detener |

Construir bundle base de inputs (común a todos los test_generators):
```json
{
  "story_id": "<FEAT-NNN>",
  "testcases_path": "<ruta o null>",
  "story_path": "<ruta>",
  "design_path": "<ruta>"
}
```

> **Nota sobre testcases.md:** Si existe, es la **fuente canónica y excluyente** de casos de prueba.
> Contiene todos los tipos (UT, CT, IT, E2E, etc.) ya derivados y tipificados por `story-testcases`.
> El skill NO necesita releer `story.md` ni `design.md` para derivar casos adicionales cuando
> `testcases.md` está presente. El subagente generador debe leer `testcases.md` y filtrar los casos
> del tipo que le corresponde.
>
> **Nota sobre tasks.md:** El skill NO lee ni considera `tasks.md` en ningún paso del ciclo TDD.
> La presencia de una tarea "T-NNN — ejecutar E2E" en `tasks.md` no reemplaza ni posterga la
> generación del spec E2E en Paso 4. `tasks.md` es un artefacto del desarrollador, no del pipeline.

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
>
> Si un generator con `required: true` y `skill != "none"` no es invocado sin una condición válida,
> es un **error del orquestador**, no una situación prevista. Ver Paso 6 — validación post-escritura.

Para cada entry de `test_generators` no omitida (en el orden del YAML):

1. Mostrar: `[{tipo}] → invocando {skill}...`
2. Construir el bundle de inputs según el tipo:
   - **Tipos que no sean `e2e`**: usar el bundle base del Paso 3
   - **Tipo `e2e`**: usar el bundle base del Paso 3 **más** el campo `e2e_context`:
     ```json
     {
       "story_id": "<FEAT-NNN>",
       "testcases_path": "<ruta o null>",
       "story_path": "<ruta>",
       "design_path": "<ruta>",
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
        - story_id: {$RED_STORY_ID}
        - testcases_path: {$TESTCASES_PATH}
        - story_path: {$STORY_PATH}
        - design_path: {$DESIGN_PATH}
        - e2e_context: {$E2E_CONTEXT}   ← solo para tipo e2e; null si la sección está ausente en el YAML
        ```
4. El subagente escribe sus resultados en `.tmp/story-implement/{tipo}/results.json`
5. **Si el subagente retorna `status: error`:**
   ```
   ❌ El skill '{skill}' retornó error durante la Fase RED — deteniendo ejecución
   
   Error: {message}
   ```
   Detener sin invocar skills siguientes.
6. **Si retorna `status: ok`:**
   - Registrar `files_generated` del subagente
   - Mostrar: `[{tipo}] ✓ {N} archivo(s) generado(s)`
   - Añadir el tipo a `$RED_GENERATORS_INVOKED`

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

---

### Paso 6 — Escribir output intermedio

Escribir `.tmp/story-implement/red-phase-status.json`:

```json
{
  "story_id": "{story_id}",
  "generators_invoked": ["unit", "e2e"],
  "generators_skipped": ["eval"],
  "files_generated": ["ruta/al/test.spec.js"],
  "red_confirmed": true,
  "timestamp": "{ISO timestamp}"
}
```

Este archivo es la precondición que leerá la Fase GREEN antes de invocar el code-generator.

### Validación post-escritura — Omisiones inválidas

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

Leer `.tmp/story-implement/red-phase-status.json`.

**Si el archivo no existe:**
```
❌ Precondición RED no cumplida: .tmp/story-implement/red-phase-status.json no encontrado

Ejecuta story-implement primero para completar la Fase RED antes de continuar con GREEN.
```
Detener la ejecución.

**Si el archivo existe pero `red_confirmed: false`:**
```
❌ Precondición RED no cumplida: red_confirmed es false en red-phase-status.json

La Fase RED no fue confirmada correctamente. Revisa los archivos de prueba generados.
```
Detener la ejecución.

**Si el archivo existe y `red_confirmed: true`:**
Extraer y registrar internamente:
- `$RED_STORY_ID` = `story_id`
- `$RED_FILES_GENERATED` = `files_generated`
- `$RED_GENERATORS_INVOKED` = `generators_invoked`

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

Inicializar `$GREEN_FILES_GENERATED = []` y `$GREEN_LAYERS_OK = []`.

Para cada entry `{layer, skill, required}` en `$CODE_GENERATORS_VALID` (en orden del YAML):

Construir bundle de inputs:
```json
{
  "story_id": "{$RED_STORY_ID}",
  "phase": "GREEN",
  "layer": "{layer}",
  "test_files": "{$RED_FILES_GENERATED}",
  "story_path": "{$SPECS_BASE}/specs/stories/{story_id}*/story.md",
  "design_path": "{$SPECS_BASE}/specs/stories/{story_id}*/design.md"
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
     - story_path: {$SPECS_BASE}/specs/stories/{story_id}*/story.md
     - design_path: {$SPECS_BASE}/specs/stories/{story_id}*/design.md
     ```
3. El subagente escribe sus resultados en `.tmp/story-implement/green/{layer}/results.json`

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
- Agregar `{layer}` a `$GREEN_LAYERS_OK`.
- Mostrar: `[GREEN/{layer}] ✓ {N} archivo(s) de producción generado(s)`

Al finalizar todas las capas:

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

Para cada entry `{layer, skill, required}` en `$CODE_GENERATORS_VALID` (en orden del YAML):

Construir bundle de inputs:
```json
{
  "story_id": "{$RED_STORY_ID}",
  "phase": "REFACTOR",
  "layer": "{layer}",
  "test_files": "{$RED_FILES_GENERATED}",
  "story_path": "{$SPECS_BASE}/specs/stories/{story_id}*/story.md",
  "design_path": "{$SPECS_BASE}/specs/stories/{story_id}*/design.md"
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
     - story_path: {$SPECS_BASE}/specs/stories/{story_id}*/story.md
     - design_path: {$SPECS_BASE}/specs/stories/{story_id}*/design.md
     ```
3. El subagente escribe sus resultados en `.tmp/story-implement/refactor/{layer}/results.json`

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

**Si retorna `status: ok`:** continuar con la siguiente capa.

Al finalizar todas las capas, verificar no-regresión ejecutando comandos de test por tipo:

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

Cargar los criterios de la sección `IMPLEMENT` de `docs/policies/definition-of-done-story.md`.

Para cada criterio evaluar:
- `✓` si hay evidencia positiva en los artefactos generados por el ciclo (archivos de test, código, sin errores reportados)
- `❌` si hay evidencia explícita de incumplimiento
- `⚠️` cuando no se puede determinar con certeza (caso por defecto para ejecución manual de tests)

Registrar `$DOD_BLOQUEADO`:
- `true` si algún criterio resultó `❌`
- `false` si ningún criterio resultó `❌`

#### 11b — Generar `implement-report.md`

Escribir `$SPECS_BASE/specs/stories/<FEAT-NNN>/implement-report.md`:

```markdown
---
type: implement-report
id: <story_id>
story: <FEAT-NNN>
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

## DoD IMPLEMENT

| Criterio | Estado | Observación |
|---|---|---|
| {criterio 1} | ✓/❌/⚠️ | {observación} |
| {criterio N} | ✓/❌/⚠️ | {observación} |

> Los tests deben ejecutarse manualmente para confirmar el resultado final.
```

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

#### 11d — Actualizar `release.md` (si existe release padre)

1. Leer campo `parent` del frontmatter de `story.md`
2. Si `parent` existe, resolver ruta: `$SPECS_BASE/specs/releases/<parent>/release.md`
3. **Si el archivo existe:**
   - Buscar la línea del checklist que contenga el id o slug de la historia (ej. `FEAT-NNN`)
   - Cambiar `- [ ]` → `- [x]` en esa línea
   - Emitir: `[INFO] release.md actualizado: [{story_id}] marcado como completado`
4. **Si no existe o `parent` está vacío:**
   - Emitir: `[INFO] release.md no encontrado o sin parent declarado — omitiendo actualización`
   - No es condición de error.

#### 11e — Escribir `cycle-status.json` y mostrar resumen final

Escribir `.tmp/story-implement/cycle-status.json`:
```json
{
  "story_id": "{$RED_STORY_ID}",
  "red_confirmed": true,
  "green_confirmed": true,
  "refactor_confirmed": true,
  "files_generated": "{$GREEN_FILES_GENERATED}",
  "files_modified": "{archivos modificados en REFACTOR}",
  "dod_bloqueado": false,
  "final_status": "IMPLEMENT/DONE",
  "timestamp": "{ISO timestamp}"
}
```

Mostrar resumen según `$EXEC_MODE`:

**Si `$EXEC_MODE = auto`:**
```
── Ciclo TDD completado automáticamente (--auto) ──────────
✅ Fase RED:      {N} tipo(s) generado(s) | rojo confirmado: {✅ / ⚠️}
✅ Fase GREEN:    {N} archivo(s) de producción generados
✅ Fase REFACTOR: sin regresiones
──────────────────────────────────────────────────────────
📄 implement-report.md → {$SPECS_BASE}/specs/stories/{story_id}/implement-report.md
📄 cycle-status.json   → .tmp/story-implement/cycle-status.json
📋 story.md: {IMPLEMENT/DONE o IMPLEMENT/IN-PROGRESS} ✓
📋 release.md: {actualizado / no encontrado}

DoD IMPLEMENT:
{tabla criterios ✓/❌/⚠️}
```

**Si `$EXEC_MODE = interactive`:**
```
✅ Ciclo TDD completado
   Fase RED:      tests en rojo confirmados
   Fase GREEN:    {N} archivo(s) de producción generados
   Fase REFACTOR: sin regresiones

   implement-report.md → {$SPECS_BASE}/specs/stories/{story_id}/implement-report.md
   cycle-status.json   → .tmp/story-implement/cycle-status.json
   story.md            → {IMPLEMENT/DONE o IMPLEMENT/IN-PROGRESS}
   release.md          → {actualizado / no encontrado}

DoD IMPLEMENT:
{tabla criterios ✓/❌/⚠️}
```

**Si hubo errores en GREEN o REFACTOR:** no ejecutar este paso (la detención ya ocurrió en el paso correspondiente).

---

## Manejo de errores

| Condición | Mensaje | Acción |
|---|---|---|
| `sddf.config.yaml` no encontrado | `❌ sddf.config.yaml no encontrado` | Detener ejecución |
| `implement.test_generators` vacío o ausente | `[WARN] No hay test_generators configurados — Fase RED sin generación de pruebas` | Continuar sin subagentes |
| Tipo activo sin campo `skill` | `[WARN] Sin skill declarado para tipo '<tipo>' — omitiendo ese tipo` | Omitir tipo |
| Skill `required:true` no existe (test_generator) | `❌ Skill '<nombre>' declarado en sddf.config.yaml no encontrado en $CLI_ROOT/skills/` | Detener sin generar archivos |
| Skill `required:false` no existe (test_generator) | `[WARN] Skill '<nombre>' no encontrado — omitiendo tipo '<tipo>'` | Omitir tipo y continuar |
| `testcases.md` ausente | `⚠️ testcases.md no encontrado — generando pruebas desde story.md y design.md` | Continuar con fallback |
| Generator `required:true` con `skill!=none` en `generators_skipped` | `❌ ERROR: test_generator '{tipo}' es required:true pero fue omitido sin condición válida` | Detener antes de GREEN; exigir corrección o cambiar a required:false |
| `story.md` o `design.md` ausentes | `❌ Artefactos de especificación insuficientes (falta story.md y/o design.md)` | Detener ejecución |
| Subagente retorna `status: error` (Fase RED) | `❌ El skill '{skill}' retornó error durante la Fase RED` | Detener sin invocar siguientes |
| Tests pasan sin implementación (Fase RED) | `⚠️ Los tests PASAN sin implementación — verificar que los tests sean correctos` | Advertir, continuar |
| `red-phase-status.json` no existe | `❌ Precondición RED no cumplida: .tmp/story-implement/red-phase-status.json no encontrado` | Detener Fase GREEN |
| `red_confirmed: false` en red-phase-status.json | `❌ Precondición RED no cumplida: red_confirmed es false` | Detener Fase GREEN |
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

Los subagentes de Fase RED reciben el bundle `{story_id, testcases_path, story_path, design_path}` (más `e2e_context` para el tipo `e2e`) y escriben en `.tmp/story-implement/{tipo}/results.json`.
Los subagentes de Fases GREEN/REFACTOR reciben el bundle `{story_id, phase, layer, test_files, story_path, design_path}` y escriben en `.tmp/story-implement/{phase}/{layer}/results.json`.
El orquestador nunca pasa su contexto completo heredado a los subagentes.

La invocación sigue el contrato de 4 pasos del ADR-0002: `Read` del SKILL.md → `Agent` tool (`subagent_type: general-purpose`) → output en `.tmp/` → `Read` de resultados. Los skills de generación permanecen en `$CLI_ROOT/skills/` (no en `.claude/agents/`) para preservar su invocabilidad directa y la configurabilidad vía `sddf.config.yaml`.

---

## Salida

| Artefacto | Ruta | Descripción |
|---|---|---|
| Archivos de prueba | según skill de generación | Tests generados en código productivo |
| Archivos de producción | según skill de generación | Código generado en Fases GREEN/REFACTOR |
| `implement-report.md` | `$SPECS_BASE/specs/stories/<FEAT-NNN>/implement-report.md` | Reporte final: ciclo TDD, DoD compliance, estado por fase |
| `story.md` (actualizado) | mismo directorio | Frontmatter → `IMPLEMENT/DONE` (o `IMPLEMENT/IN-PROGRESS` si DoD-ERRORs) |
| `release.md` (actualizado) | `$SPECS_BASE/specs/releases/<parent>/release.md` | Checklist con `[x]` para la historia completada (si existe) |
| `red-phase-status.json` | `.tmp/story-implement/red-phase-status.json` | Estado de la Fase RED — precondición para GREEN |
| `cycle-status.json` | `.tmp/story-implement/cycle-status.json` | Estado final del ciclo TDD completo |
| `results.json` por tipo/capa | `.tmp/story-implement/{tipo o fase/capa}/results.json` | Output de cada subagente |

---


