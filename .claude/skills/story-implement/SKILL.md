---
name: story-implement
description: >-
  Orquesta el ciclo TDD completo (RED→GREEN→REFACTOR) para una historia SDDF, delegando
  generación de pruebas y código a skills configurados en sddf-config.yaml. Soporta modo
  interactivo (predeterminado: pausas entre fases para confirmación manual) y modo
  automático (--auto: ciclo completo sin interrupciones, ideal para CI).
  Usar cuando el practitioner quiere implementar una historia con TDD, ejecutar el
  ciclo rojo-verde-refactor de una historia, generar tests y código desde una historia,
  completar el ciclo TDD completo de una story, o ejecutar TDD en modo automático.
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
version: "1.2.0"
type: delegate
input: "story.md + testcases.md (opcional) + sddf-config.yaml + --auto (opcional)"
output: "archivos de prueba + código de producción + cycle-status.json + story.md actualizada a CODE-REVIEW/IN-PROGRESS"
invocable: true
alwaysApply: false
---

# Skill: /story-implement

## Objetivo

Orquesta el ciclo TDD (RED → GREEN → REFACTOR) para una historia SDDF delegando la generación de pruebas y código a skills especializados declarados en `docs/policies/sddf-config.yaml`. El skill es agnóstico al stack: solo lee configuración y delega; los skills de generación son subagentes independientes.

**Posición en el pipeline:**
```
story-plan → story-testcases → story-implement (ciclo TDD completo) → story-code-review
```

**Qué hace este skill:**
- Invoca `skill-preflight` como Paso 0
- **Fase RED:** Lee `implementing.test_generators` de `sddf-config.yaml`; valida skills (fail-fast); resuelve artefactos (`testcases.md` o fallback `story.md`+`design.md`); invoca cada skill de pruebas en orden; confirma estado rojo; escribe `red-phase-status.json`
- **Fase GREEN:** Lee `red-phase-status.json` como precondición; lee y valida `implementing.code_generator`; invoca el code_generator con `phase:"GREEN"`; confirma que los tests pasan
- **Fase REFACTOR:** Invoca el code_generator con `phase:"REFACTOR"`; verifica no-regresión ejecutando comandos de test
- Al completar el ciclo exitosamente: actualiza `story.md` a `CODE-REVIEW/IN-PROGRESS` y escribe `cycle-status.json`

**Qué NO hace este skill:**
- Crear skills de generación específicos (ej. `story-test-unit-jest`, `story-code-nodejs`) — son skills separados
- Gestionar modos interactivo/automático (`--auto`) — cubiertos en FEAT-082
- Ejecutar el suite completo de CI — solo ejecuta comandos de test configurados por tipo

---

## Parámetros

| Parámetro | Tipo | Descripción |
|---|---|---|
| `{story_id}` | posicional | ID de la historia (ej. `FEAT-059`) |

Si no se proporciona argumento, solicitar interactivamente.

---

## Filosofía Central

> **Write Tests First, Code Later**

1. **Primero escribe las pruebas, luego el código**: cada punto funcional debe tener sus casos de prueba correspondientes
2. **Las pruebas son documentación**: los casos de prueba describen el comportamiento esperado del sistema
3. **Rojo-Verde-Refactorizar**: primero haz fallar la prueba, luego hazla pasar
4. **Utiliza los fallos en las pruebas como retroalimentación**: una prueba fallida debe guiar su desarrollo y resaltar las mejoras necesarias.

---

## Flujo de ejecución

### Paso 0 — Verificar entorno (`skill-preflight`)

Invocar el skill `skill-preflight` antes de cualquier operación.

Si retorna `✗ Entorno inválido`, detener la ejecución inmediatamente sin generar ningún archivo.

Usar `$SPECS_BASE` resuelto por `skill-preflight` para todas las rutas siguientes.

---

### Paso 0b — Parsear flags de invocación e inicializar `$EXEC_MODE`

Inspeccionar los argumentos de invocación buscando el flag `--auto`:

1. Si `--auto` está presente → `$EXEC_MODE = auto`
2. Si `--auto` está ausente → `$EXEC_MODE = interactive` (predeterminado)

Emitir: `[INFO] Modo de ejecución: {$EXEC_MODE}`

`$EXEC_MODE` es una variable en memoria para esta ejecución. No se persiste en ningún archivo ni se pasa a los subagentes.

---

### Paso 1 — Leer configuración de test_generators

Leer `docs/policies/sddf-config.yaml`.

**Si `sddf-config.yaml` no existe:**
```
❌ docs/policies/sddf-config.yaml no encontrado

Verifica que el archivo existe o ejecuta /sddf-init para inicializar el entorno.
```
Detener la ejecución.

Extraer la sección `implementing.test_generators`.

**Si la sección `implementing` no existe o `test_generators` está vacío:**
```
[WARN] No hay test_generators configurados en sddf-config.yaml — Fase RED sin generación de pruebas
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
1. Construir ruta: `.claude/skills/{entry.skill}/SKILL.md`
2. Verificar existencia con Glob
3. **Si no existe y `required: true`:**
   ```
   ❌ Skill '<nombre>' declarado en sddf-config.yaml no encontrado en .claude/skills/
   
   Verifica el nombre del skill en sddf-config.yaml o instálalo antes de continuar.
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

Construir bundle de inputs:
```
{
  "story_id": "<FEAT-NNN>",
  "testcases_path": "<ruta o null>",
  "story_path": "<ruta>",
  "design_path": "<ruta>"
}
```

---

### Paso 4 — Invocar skills de generación en orden

Para cada entry de `test_generators` no omitida (en el orden del YAML):

1. Mostrar: `[{tipo}] → invocando {skill}...`
2. Invocar el skill pasando el bundle de inputs del Paso 3
3. El subagente escribe sus resultados en `.tmp/story-implement/{tipo}/results.json`
4. **Si el subagente retorna `status: error`:**
   ```
   ❌ El skill '{skill}' retornó error durante la Fase RED — deteniendo ejecución
   
   Error: {message}
   ```
   Detener sin invocar skills siguientes.
5. **Si retorna `status: ok`:**
   - Registrar `files_generated` del subagente
   - Mostrar: `[{tipo}] ✓ {N} archivo(s) generado(s)`

---

### Paso 5 — Confirmar estado RED

Para cada tipo generado exitosamente:

1. Leer `defaults.{type}.command` de `sddf-config.yaml`
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

Este archivo es la precondición que leerá la Fase GREEN (FEAT-081) antes de invocar el code-generator.

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

### Paso 8 — Leer y validar code_generator

Leer `docs/policies/sddf-config.yaml` (ya cargado en Paso 1).

Extraer `implementing.code_generator`:

**Si `implementing.code_generator` no existe en el YAML:**
```
❌ implementing.code_generator no declarado en sddf-config.yaml

Añade la sección code_generator bajo implementing en docs/policies/sddf-config.yaml.
```
Detener la ejecución.

Obtener `{skill}` y `{required}` del objeto `code_generator`.

Verificar existencia: `.claude/skills/{skill}/SKILL.md` (Glob).

**Si el skill no existe y `required: true`:**
```
❌ Skill '{skill}' declarado como code_generator no encontrado en .claude/skills/

Verifica el nombre del skill en sddf-config.yaml o instálalo antes de continuar.
```
Detener la ejecución.

**Si el skill no existe y `required: false`:**
```
[WARN] Skill '{skill}' no encontrado y required:false — omitiendo Fases GREEN y REFACTOR
```
Terminar la ejecución de Fase GREEN/REFACTOR de forma limpia (sin error).

**Si el skill existe:**
Mostrar: `[INFO] code_generator resuelto: {skill}`

---

### Paso 9 — Fase GREEN: invocar code_generator

Construir bundle de inputs:
```json
{
  "story_id": "{$RED_STORY_ID}",
  "phase": "GREEN",
  "test_files": "{$RED_FILES_GENERATED}",
  "story_path": "{$SPECS_BASE}/specs/stories/{story_id}*/story.md",
  "design_path": "{$SPECS_BASE}/specs/stories/{story_id}*/design.md"
}
```

Mostrar: `[GREEN] → invocando {skill}...`

Invocar el skill `{skill}` pasando el bundle.

El subagente escribe sus resultados en `.tmp/story-implement/green/results.json`.

**Si el subagente retorna `status: error`:**
```
❌ Fase GREEN fallida: el skill '{skill}' retornó error

Error: {message}
Sugerencia: revisa el código generado manualmente o ajusta la configuración del skill.
```
Detener la ejecución **sin ejecutar la Fase REFACTOR ni modificar story.md**.

**Si retorna `status: ok`:**
- Registrar `$GREEN_FILES_GENERATED` = archivos generados por el subagente
- Mostrar: `[GREEN] ✓ {N} archivo(s) de producción generado(s)`

---

### Paso 9b — Confirmar estado GREEN (tests en verde)

Para cada tipo en `$RED_GENERATORS_INVOKED`:

1. Leer `defaults.{type}.command` de `sddf-config.yaml`
2. **Si el comando existe:**
   - Ejecutarlo en el directorio raíz del proyecto
   - Exit code = 0: `✅ Fase GREEN exitosa — tipo: {tipo} (tests pasan)`
   - Exit code ≠ 0:
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

### Paso 10 — Fase REFACTOR: invocar code_generator y verificar no-regresión

Construir bundle de inputs:
```json
{
  "story_id": "{$RED_STORY_ID}",
  "phase": "REFACTOR",
  "test_files": "{$RED_FILES_GENERATED}",
  "story_path": "{$SPECS_BASE}/specs/stories/{story_id}*/story.md",
  "design_path": "{$SPECS_BASE}/specs/stories/{story_id}*/design.md"
}
```

Mostrar: `[REFACTOR] → invocando {skill}...`

Invocar el skill `{skill}` pasando el bundle.

El subagente escribe sus resultados en `.tmp/story-implement/refactor/results.json`.

**Si el subagente retorna `status: error`:**
```
❌ Fase REFACTOR fallida: el skill '{skill}' retornó error

Nota: los tests siguen en verde (Fase GREEN fue exitosa). El refactor no se aplicó.
```
Detener sin modificar story.md.

**Si retorna `status: ok`:** verificar no-regresión ejecutando comandos de test por tipo:

Para cada tipo en `$RED_GENERATORS_INVOKED`:
1. Leer `defaults.{type}.command` de `sddf-config.yaml`
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

1. Actualizar frontmatter de `story.md`:
   - `status: CODE-REVIEW`
   - `substatus: IN-PROGRESS`
   - `updated: {YYYY-MM-DD}`

2. Escribir `.tmp/story-implement/cycle-status.json`:
```json
{
  "story_id": "{$RED_STORY_ID}",
  "red_confirmed": true,
  "green_confirmed": true,
  "refactor_confirmed": true,
  "files_generated": "{$GREEN_FILES_GENERATED}",
  "files_modified": "{archivos modificados en REFACTOR}",
  "final_status": "CODE-REVIEW/IN-PROGRESS",
  "timestamp": "{ISO timestamp}"
}
```

3. Mostrar resumen según `$EXEC_MODE`:

**Si `$EXEC_MODE = auto`** — mostrar resumen consolidado del ciclo completo:
```
── Ciclo TDD completado automáticamente (--auto) ──────────
✅ Fase RED:      {N} tipo(s) generado(s) | rojo confirmado: {✅ / ⚠️}
✅ Fase GREEN:    {N} archivo(s) de producción generados
✅ Fase REFACTOR: sin regresiones
──────────────────────────────────────────────────────────
📄 cycle-status.json → .tmp/story-implement/cycle-status.json
📋 story.md: CODE-REVIEW/IN-PROGRESS ✓
```

**Si `$EXEC_MODE = interactive`** — el usuario ya vio el resumen por fases en Pause-1 y Pause-2; mostrar solo el cierre:
```
✅ Ciclo TDD completado
   Fase RED:      tests en rojo confirmados
   Fase GREEN:    {N} archivo(s) de producción generados
   Fase REFACTOR: sin regresiones
   
   story.md → CODE-REVIEW/IN-PROGRESS
   cycle-status.json → .tmp/story-implement/cycle-status.json
```

**Si hubo errores en GREEN o REFACTOR:** no ejecutar este paso (la detención ya ocurrió en el paso correspondiente).

---

## Manejo de errores

| Condición | Mensaje | Acción |
|---|---|---|
| `sddf-config.yaml` no encontrado | `❌ docs/policies/sddf-config.yaml no encontrado` | Detener ejecución |
| `implementing.test_generators` vacío o ausente | `[WARN] No hay test_generators configurados — Fase RED sin generación de pruebas` | Continuar sin subagentes |
| Tipo activo sin campo `skill` | `[WARN] Sin skill declarado para tipo '<tipo>' — omitiendo ese tipo` | Omitir tipo |
| Skill `required:true` no existe (test_generator) | `❌ Skill '<nombre>' declarado en sddf-config.yaml no encontrado en .claude/skills/` | Detener sin generar archivos |
| Skill `required:false` no existe (test_generator) | `[WARN] Skill '<nombre>' no encontrado — omitiendo tipo '<tipo>'` | Omitir tipo y continuar |
| `testcases.md` ausente | `⚠️ testcases.md no encontrado — generando pruebas desde story.md y design.md` | Continuar con fallback |
| `story.md` o `design.md` ausentes | `❌ Artefactos de especificación insuficientes (falta story.md y/o design.md)` | Detener ejecución |
| Subagente retorna `status: error` (Fase RED) | `❌ El skill '{skill}' retornó error durante la Fase RED` | Detener sin invocar siguientes |
| Tests pasan sin implementación (Fase RED) | `⚠️ Los tests PASAN sin implementación — verificar que los tests sean correctos` | Advertir, continuar |
| `red-phase-status.json` no existe | `❌ Precondición RED no cumplida: .tmp/story-implement/red-phase-status.json no encontrado` | Detener Fase GREEN |
| `red_confirmed: false` en red-phase-status.json | `❌ Precondición RED no cumplida: red_confirmed es false` | Detener Fase GREEN |
| `implementing.code_generator` no declarado | `❌ implementing.code_generator no declarado en sddf-config.yaml` | Detener Fase GREEN |
| code_generator `required:true` no existe | `❌ Skill '{skill}' declarado como code_generator no encontrado en .claude/skills/` | Detener Fase GREEN |
| code_generator `required:false` no existe | `[WARN] Skill '{skill}' no encontrado y required:false — omitiendo Fases GREEN y REFACTOR` | Terminar limpiamente |
| Subagente retorna `status: error` (Fase GREEN) | `❌ Fase GREEN fallida: el skill '{skill}' retornó error` | Detener sin REFACTOR, story.md sin cambio |
| Tests no pasan tras GREEN | `❌ Fase GREEN fallida: el skill '{skill}' retornó error — los tests de tipo '{tipo}' no pasan` | Detener sin REFACTOR, story.md sin cambio |
| Subagente retorna `status: error` (Fase REFACTOR) | `❌ Fase REFACTOR fallida: el skill '{skill}' retornó error` | Detener, story.md sin cambio |
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
```

Los subagentes reciben solo el bundle `{story_id, testcases_path, story_path, design_path}`.
Escriben sus resultados en `.tmp/story-implement/{tipo}/results.json` de forma independiente.
El orquestador nunca pasa su contexto completo heredado a los subagentes.

---

## Salida

| Artefacto | Ruta | Descripción |
|---|---|---|
| Archivos de prueba | según skill de generación | Tests generados en código productivo |
| `red-phase-status.json` | `.tmp/story-implement/red-phase-status.json` | Estado de la Fase RED — precondición para GREEN |
| `results.json` por tipo | `.tmp/story-implement/{tipo}/results.json` | Output de cada subagente |

---


