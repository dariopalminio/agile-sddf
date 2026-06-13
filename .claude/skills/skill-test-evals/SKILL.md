---
name: skill-test-evals
description: >-
  Ciclo completo de evals de skills: genera evals.json, ejecuta casos TC-NNN (pass/fail) y benchmarks.
  Usar para crear pruebas para un skill o validar que pasa sus casos TC-NNN.
  Invocar para "evals de skill", "generar evals.json", "ejecutar evals",
  "validar skill" o "benchmark de skill".
triggers:
  - "crear pruebas de"
  - "escribe los evals"
  - "genera los casos de prueba"
  - "write evals for"
  - "create tests for a skill"
  - "evals.json"
  - "quiero los evals de"
  - "genera evals para este skill"
  - "add tests to this skill"
  - "este skill no tiene pruebas"
  - "ejecutar evals de"
  - "verificar skill"
  - "validar que el skill funciona"
  - "correr los tests del skill"
  - "skill-test-evals evals"
  - "skill-test-evals benchmark"
  - "benchmark del skill"
  - "verificar que el skill pasa"
---

# skill-test-evals

Skill unificado para crear, ejecutar y benchmarkear evals de skills SDDF.

**Modos de operación:**
- **generate** (predeterminado): genera `evals/evals.json` desde descripción, spec o SKILL.md existente
- **evals**: ejecuta los casos TC-NNN del skill objetivo → informe pass/fail
- **benchmark**: ejecuta cada caso N veces → métricas estadísticas mean ± stddev

**Sintaxis:**
```
/skill-test-evals {description|spec|free-text}       → generate: crea evals.json + skeleton SKILL.md
/skill-test-evals {skill_name}                        → generate: crea evals.json
/skill-test-evals generate {skill_name}               → generate (explícito): crea evals.json
/skill-test-evals evals {skill_name}                  → 1 run → informe pass/fail
/skill-test-evals benchmark {skill_name}              → 3 runs × caso → mean/stddev
/skill-test-evals benchmark {skill_name} --runs 5     → 5 runs × caso → métricas estadísticas
/skill-test-evals benchmark {skill_name} --report     → guarda benchmark-YYYYMMDD.md
```

**Qué hace este skill:**
- **Modo generate:** lee la fuente, extrae intención y contratos I/O, genera 3–5 casos realistas, escribe `evals/evals.json`. Cuando la entrada es descripción libre, crea también un skeleton `SKILL.md` vacío.
- **Modo evals:** verifica que el skill objetivo tiene `evals/evals.json` en formato SDDF, invoca el skill para cada caso TC-NNN, evalúa el output contra `expected.contains`/`expected.not_contains`, calcula `pass_rate` global, genera informe markdown.
- **Modo benchmark:** igual que evals pero ejecuta cada caso N veces y calcula mean ± stddev de pass_rate y duración.

**Qué NO hace este skill:**
- Modo generate: escribir SKILL.md completo (eso es responsabilidad de `skill-master build`)
- Modo evals/benchmark: crear ni modificar `evals/evals.json` — eso es responsabilidad del modo generate

---

## Paso 0 — Detectar modo de ejecución

Examinar el primer argumento de invocación:

| Primer argumento | Modo | skill_name |
|---|---|---|
| `benchmark` | benchmark | segundo argumento |
| `evals` | evals | segundo argumento |
| `generate` | generate | segundo argumento |
| cualquier otro valor | generate | primer argumento (o descripción libre) |
| sin argumentos | generate | preguntar al usuario |

- Si el modo es `benchmark`: leer `--runs N` si está presente (default: 3; si N < 2 → `⚠️ --runs mínimo es 2. Usando N=2`; si N > 10 → `⚠️ --runs máximo es 10. Usando N=10`)
- Si se pasa `--report` en cualquier modo: guardar el informe en `.tmp/skill-test-evals/{skill_name}/`

---

## MODO GENERATE — Generar evals/evals.json

### Paso G1 — Determinar la fuente de entrada

- Si `--from-skill <path>`:
  - Verificar que `<path>/SKILL.md` existe. Si no: detener — "No SKILL.md found at `<path>`. Provide a valid skill directory."
  - Verificar si `<path>/evals/evals.json` ya existe:
    - Si existe y `--auto`: sobreescribir silenciosamente
    - Si existe y `--manual`: preguntar — "`evals/evals.json` ya existe en `<path>`. ¿Sobreescribir? (y/n)"
  - Establecer ruta de salida en `<path>/evals/evals.json`
  - Leer `<path>/SKILL.md` → ir a "Interpretar fuente SKILL.md" en Paso G3
- Auto-detect: si `--source` apunta a un archivo llamado `SKILL.md` o a un directorio que contiene `SKILL.md` → tratar como `--from-skill <ese directorio>`
- Si `--source` es otra ruta de archivo: leer (story.md, testcases.md, design.md, o cualquier spec)
- Si `--source` es texto libre: usar directamente
- Si no hay `--source` y `--auto`: error — "skill-test-evals requires --source or --from-skill in auto mode."
- Si no hay `--source` y `--manual` (predeterminado): preguntar:
  > "¿Qué debe hacer el skill? Describe su propósito, cuándo se activa y qué produce. (O pasa --from-skill <path> para leer un skill existente.)"
  Esperar respuesta y continuar.

### Paso G2 — Determinar la ruta de salida

- Si `--from-skill <path>`: salida en `<path>/evals/evals.json` (co-ubicado con el skill)
- Si `--skill-dir`: salida en `<skill-dir>/evals/evals.json`
- Si `--skill-name`: salida en `.claude/skills/<skill-name>/evals/evals.json`
- Si ninguno: inferir el nombre del skill desde la descripción (ej. "formatea commits de git" → `commit-formatter`). Confirmar con el usuario en modo `--manual`.

### Paso G3 — Extraer intención de la fuente

Desde la entrada, identificar:
- **Purpose**: qué habilita el skill — una oración clara
- **Triggers**: frases/contextos que lo invocan (3–5 ejemplos)
- **Input**: qué archivos, texto o contexto recibe el skill
- **Output**: qué produce (archivo, texto, output estructurado)
- **Success criteria**: qué significa "hecho" — concreto, verificable

Si la fuente es `story.md`, extraer de los criterios de aceptación (Gherkin o plain).
Si la fuente es texto libre, inferir de la descripción.
Si la fuente es `SKILL.md`, usar la sub-sección siguiente.

#### Interpretar fuente SKILL.md

Cuando la fuente es un archivo SKILL.md, extraer en este orden:

1. **Del frontmatter:**
   - `name:` → `skill_name` para evals.json
   - `description:` → fuente principal de propósito, contextos de trigger y qué produce
   - `triggers:` list → frases exactas que invocan el skill

2. **Del body:**
   - "What this skill does" / "Objetivo" / párrafos de overview → purpose
   - "Parameters" / "Parámetros" → inputs que acepta (flags, archivos, texto)
   - "Output" / "Salida" → qué produce (nombre de archivo, formato, ubicación)
   - "Flujo de ejecución" / flow steps → qué pasos se ejecutan; cuáles pueden fallar → casos fail-fast y error-handling

3. **Generar prompts invirtiendo los triggers:**
   - Para cada trigger, construir un prompt realista con suficiente contexto
   - Ejemplo: trigger `"crear pruebas de"` → prompt `"crea las pruebas de un skill que formatea commits de git en mi repo, el skill está en .claude/skills/commit-formatter"`
   - Agregar detalles concretos: rutas, contexto de dominio, escenario realista

4. **Derivar expectativas de la sección de Output:**
   - Si escribe un archivo específico → `"The file <output-path> is created"`
   - Si produce output estructurado → `"The output contains the sections: X, Y, Z"`
   - Si hay condiciones de error o precondiciones explícitas → derivar casos fail-fast

### Paso G4 — Generar casos de prueba

Crear 3–5 casos cubriendo:

| Requerido | Tipo | Cuándo usar |
|---|---|---|
| ✅ min 1 | `happy-path` | Input válido → skill produce output correcto |
| ✅ min 1 | `fail-fast` | Input inválido/vacío → skill detecta error claramente |
| ✅ min 1 | `edge-case` | Input inusual pero válido → skill maneja correctamente |
| opcional | `error-handling` | Fallo ambiental (archivo ausente, ruta mala) → degradación elegante |

**Reglas de calidad para prompts:**
- Escribir prompts como los diría un usuario real — concretos, con contexto
- ❌ Malo: `"Format this data"` / `"Create a skill for X"`
- ✅ Bueno: `"I have a story.md in docs/specs/stories/FEAT-042 and I want you to generate the evals for it"`
- Cada prompt debe ser ejecutable independientemente — sin estado compartido entre casos

**Reglas de calidad para expectativas:**
- Deben ser verificables objetivamente sin ejecutar el skill
- Basarlas en la spec, no en suposiciones de implementación
- Evitar expectativas genéricas que cualquier output pasaría ("output is not empty")

### Paso G5 — Checkpoint

- Si `--manual`: mostrar los casos propuestos al usuario:
  > "Estos son los N casos de prueba que voy a escribir en `evals/evals.json`. ¿Cubren los escenarios correctos?"
  Esperar confirmación. Aceptar adiciones o cambios antes de escribir.
- Si `--auto`: proceder directamente.

### Paso G6 — Escribir evals/evals.json

Crear el directorio `evals/` si no existe. Escribir con el esquema TC-NNN (leer `../skill-master/references/skill-evals-format.md` para el formato extendido con `contains`/`not_contains`/`threshold`):

```json
{
  "skill": "nombre-del-skill",
  "version": "1.0.0",
  "description": "Descripción breve",
  "cases": [
    {
      "id": "TC-001",
      "name": "nombre-descriptivo-kebab-case",
      "type": "happy-path | fail-fast | error-handling | edge-case",
      "description": "Qué escenario cubre este caso",
      "input": {
        "input_path": "ruta/al/archivo/de/prueba",
        "flags": ["--flag-opcional"]
      },
      "expected": {
        "contains": ["fragmento que DEBE aparecer en el output"],
        "not_contains": ["fragmento que NO DEBE aparecer"]
      },
      "threshold": 0.95
    }
  ]
}
```

**Esquema mínimo de fallback** (si `skill-master/references/skill-evals-format.md` no está disponible):

```json
{
  "skill_name": "example-skill",
  "evals": [
    {
      "id": 1,
      "prompt": "Prompt realista con contexto",
      "expected_output": "Descripción de qué debe producir el skill",
      "files": [],
      "expectations": ["The output contains X", "A file named Z is created"]
    }
  ]
}
```

### Paso G7 — Crear skeleton SKILL.md (solo si la entrada fue descripción libre)

Si la fuente de entrada fue **descripción libre** (no `--from-skill` ni `--source` apuntando a un archivo existente):

1. Verificar que `<skill-dir>/SKILL.md` **no existe** — si existe, no sobreescribir
2. Crear el directorio `.claude/skills/{skill_name}/` si no existe
3. Escribir un skeleton `SKILL.md` mínimo:

```markdown
---
name: {skill_name}
version: 0.1.0
description: >
  {propósito inferido de la descripción libre — una oración}
triggers:
  - "{trigger principal inferido}"
---

# Skill: `/{skill_name}`

> Skeleton generado por skill-test-evals. Completa este archivo con `/skill-master build` para implementar el skill usando los evals generados (fase GREEN del TDD).

## Objetivo

{propósito inferido de la descripción libre}

## Entrada

<!-- Describir los inputs del skill -->

## Salida

<!-- Describir los outputs del skill -->
```

### Paso G8 — Reportar

```
✅ evals/evals.json escrito en <output-path>
   N casos: X happy-path, Y fail-fast, Z edge-case
{si skeleton creado:}
✅ Skeleton SKILL.md creado en <skill-dir>/SKILL.md

Siguiente paso: ejecuta `/skill-master build` para implementar el skill (fase GREEN del TDD).
```

En modo `--auto`: `[skill-test-evals] <output-path>: N casos escritos.`

---

## MODO EVALS — Ejecutar casos de prueba

### Paso E0 — Verificar entorno (skill-preflight)

Invocar `skill-preflight` antes de cualquier operación. Si retorna `✗ Entorno inválido`, detener.

### Paso E1 — Resolver el skill_name

Si no se proporcionó skill_name, preguntar:
```
¿Qué skill deseas verificar?
Proporciona el nombre (ej. story-design) o la ruta completa al directorio.
```

Resolver la ruta del skill:
- Si el argumento no contiene `/` ni `\`: construir path `.claude/skills/{arg}/`
- Si contiene separadores: usar como ruta directa

Verificar que `SKILL.md` existe en la ruta resuelta:
```
❌ No se encontró el skill '{arg}' en .claude/skills/
   Verifica el nombre del skill y que existe en el directorio de skills.
```
Si no existe, detener.

Verificar que `evals/evals.json` existe:
```
❌ No se encontró evals/evals.json en <path>.
   Ejecuta /skill-test-evals {skill_name} primero para generar los casos de prueba.
```
Si no existe, detener.

### Paso E2 — Leer y validar evals.json

Leer `evals/evals.json`.

**Detección de formato:**
- Si tiene clave `cases` en el nivel raíz → formato SDDF ✓ continuar
- Si es array plano con campo `query` → formato trigger detectado:
  ```
  ❌ Este evals.json usa formato trigger (array con query/should_trigger).
     skill-test-evals evals requiere el formato SDDF con cases[].
     Ejecuta /skill-test-evals {skill_name} para generar los evals correctos.
  ```
  Detener.
- Si `cases` existe pero está vacío:
  ```
  ⚠️ evals.json no contiene casos en cases[].
     Añade al menos TC-001 antes de verificar.
  ```
  Detener.

Extraer todos los casos de `cases[]` con sus campos: `id`, `name`, `type`, `description`, `input`, `expected`, `threshold`.

Emitir: `[INFO] {N} casos encontrados en {skill_name}/evals/evals.json`

### Paso E3 — Ejecutar cada caso

Para cada caso en `cases[]`, lanzar en paralelo cuando sea posible:

#### E3a. Construir el prompt de escenario

```
Escenario de prueba para el skill {skill_name}:

{description}

Condiciones de entrada:
{input — cada campo como bullet: "- campo: valor"}

Ejecuta el skill con estas condiciones y reporta exactamente qué emitiría.
```

#### E3b. Invocar el skill objetivo como subagente

Invocar `{skill_name}` con el prompt construido. Capturar el output completo.

#### E3c. Evaluar el output

Para cada string en `expected.contains`:
- Buscar en el output (búsqueda de subcadena, case-sensitive)
- `FOUND` → contribuye a pass | `MISSING` → contribuye a fail

Para cada string en `expected.not_contains`:
- `ABSENT` → ok | `PRESENT` → violation (contribuye a fail)

#### E3d. Calcular resultado del caso

- Si `threshold = 1.0`: PASS solo si **todos** los `contains` están presentes Y **ningún** `not_contains` está presente
- Si `threshold < 1.0`: PASS si `(found_contains / total_contains) ≥ threshold` Y sin violaciones en `not_contains`

### Paso E4 — Agregar resultados

- `passed` = casos con status PASS
- `failed` = casos con status FAIL
- `pass_rate` = `passed / total × 100` (redondeado a 1 decimal)

### Paso E5 — Generar informe

Leer `assets/report-template.md` del directorio de este skill.

**Tabla de casos** (`{rows}`):
```
| TC-001 | nombre-del-caso | happy-path | 0.95 | ✅ PASS | — |
| TC-002 | otro-caso | fail-fast | 1.0 | ❌ FAIL | missing: "❌" |
```

**Sección de detalles de fallos** (`{failure_details}`), por cada caso fallido:
```
### ❌ {id} — {name}

**Missing contains:** {lista}
**Violated not_contains:** {lista}
**Evidencia (primeros 300 chars):**
> {evidence}
```
Si no hay fallos: omitir la sección.

**Mensaje final** (`{summary_message}`):
- 100%: `✅ Todos los {N} casos pasaron. El skill está listo.`
- < 100%: `⚠️ Pass rate: {X}%. Considera ejecutar /skill-master build para mejorar el skill.`

### Paso E6 — Guardar informe (si --report)

Si se pasó `--report`:
- Crear `.tmp/skill-test-evals/{skill_name}/` si no existe
- Escribir en `.tmp/skill-test-evals/{skill_name}/report-YYYYMMDD.md`
- Emitir: `📄 Informe guardado en: .tmp/skill-test-evals/{skill_name}/report-YYYYMMDD.md`

Si no se pasó `--report`: mostrar el informe directamente en la conversación.

---

## MODO BENCHMARK — Estadísticas multi-run

Los Pasos E0–E2 (preflight, resolver parámetros, validar evals.json) son **idénticos** al modo evals.

### Paso B3 — Ejecutar cada caso N veces

Para cada caso en `cases[]`, ejecutar N iteraciones secuencialmente:

Por cada run `r` en `[1..N]`:
1. Registrar timestamp de inicio: `t_start`
2. Construir el prompt de escenario (idéntico al Paso E3a)
3. Invocar el skill objetivo como subagente
4. Registrar timestamp de fin: `t_end`
5. Evaluar output contra `expected.contains` / `expected.not_contains` (mismo criterio del Paso E3c)
6. Registrar: `{ run: r, pass: bool, duration_ms: t_end - t_start, tokens_estimated: len(output) / 4 }`

Emitir progreso por caso:
```
[TC-001] run 1/3… ✅  |  run 2/3… ✅  |  run 3/3… ✅
[TC-002] run 1/3… ✅  |  run 2/3… ❌  |  run 3/3… ✅
```

### Paso B4 — Calcular métricas estadísticas

Por cada caso, con los datos de las N runs:

```
pass_rate  = (runs con pass / N) × 100
mean_ms    = suma(durations) / N
stddev_ms  = sqrt( suma((d - mean_ms)^2) / max(N-1, 1) )   ← stddev muestral
tokens_est = promedio(tokens_estimated)

estabilidad:
  estable   → pass_rate = 100% o 0%   (determinista)
  inestable → 0% < pass_rate < 100%   (flakiness detectada)
```

Métricas globales: promedio de todos los casos.

### Paso B5 — Generar informe de benchmark

Leer `assets/benchmark-report-template.md` del directorio de este skill.

**Tabla de métricas** (`{rows}`):
```
| TC-001 | nombre-del-caso | 100%  | 245 ms | ±12 ms  | 3 |
| TC-002 | otro-caso       | 66%   | 310 ms | ±45 ms  | 3 |
```

**Sección de casos inestables** (`{unstable_cases}`), si hay casos con `0% < pass_rate < 100%`:
```
⚠️ Casos inestables detectados (flakiness):
- TC-002: 2/3 runs pasaron (66%) → resultados inconsistentes en este escenario
```
Si no hay casos inestables: omitir.

**Mensaje final** (`{summary_message}`):
- `≥ 95%`: `✅ Benchmark completado. Pass rate global: X%. El skill es estable.`
- `< 95%`: `⚠️ Pass rate: X%. Considera ejecutar /skill-master build para mejorar el skill.`

### Paso B6 — Guardar informe (si --report)

Si se pasó `--report`:
- Crear `.tmp/skill-test-evals/{skill_name}/` si no existe
- Escribir en `.tmp/skill-test-evals/{skill_name}/benchmark-YYYYMMDD.md`
- Emitir: `📄 Benchmark guardado en: .tmp/skill-test-evals/{skill_name}/benchmark-YYYYMMDD.md`

Si no se pasó `--report`: mostrar el informe directamente.

---

## Manejo de errores

| Condición | Mensaje | Acción |
|---|---|---|
| Skill no encontrado (modos evals/benchmark) | `❌ No se encontró el skill '{name}' en .claude/skills/` | Detener |
| `evals.json` ausente (modos evals/benchmark) | `❌ No se encontró evals/evals.json ... Ejecuta /skill-test-evals {skill_name} primero` | Detener |
| Formato trigger detectado | `❌ Este evals.json usa formato trigger ... requiere SDDF con cases[]` | Detener |
| `cases[]` vacío | `⚠️ evals.json no contiene casos. Añade al menos TC-001 antes de verificar.` | Detener |
| Subagente falla al ejecutar caso | Marcar caso como `❌ ERROR` con mensaje del subagente como evidencia | Continuar |
| `--runs < 2` (benchmark) | `⚠️ --runs mínimo es 2. Usando N=2.` | Continuar con N=2 |
| `--runs > 10` (benchmark) | `⚠️ --runs máximo recomendado es 10. Usando N=10.` | Continuar con N=10 |
| SKILL.md no encontrado en `--from-skill` | `No SKILL.md found at <path>. Provide a valid skill directory.` | Detener |
| `--source` o `--from-skill` ausente en modo `--auto` | `skill-test-evals requires --source or --from-skill in auto mode.` | Detener |

---

## Archivos de referencia

| Archivo | Contenido |
|---|---|
| `../skill-master/references/skill-evals-format.md` | Formato TC-NNN con contains/not_contains/threshold |
| `../skill-master/references/schemas.md` | Esquemas JSON completos: evals, grading, benchmark |
| `../skill-master/references/tdd-workflow.md` | Ciclo RED/GREEN/REFACTOR |
