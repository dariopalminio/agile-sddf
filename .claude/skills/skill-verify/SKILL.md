---
name: skill-verify
description: >-
  Ejecuta los casos de prueba TC-NNN definidos en evals/evals.json de un skill
  y devuelve un informe detallado de resultados pass/fail con evidencia por caso.
  En modo benchmark corre los evals N veces y calcula métricas estadísticas (mean ±
  stddev de pass_rate, duración y tokens). Usar cuando el usuario quiera verificar
  que un skill funciona correctamente, ejecutar sus evals, comprobar la tasa de
  aciertos, medir rendimiento del skill, ejecutar benchmark del skill, o validar
  antes de publicar.
triggers:
  - "skill-verify"
  - "ejecutar evals del skill"
  - "verificar skill"
  - "correr los tests del skill"
  - "comprobar que el skill funciona"
  - "run evals on skill"
  - "skill-verify benchmark"
  - "benchmark del skill"
  - "medir rendimiento del skill"
version: "1.1.0"
type: delegate
input: "<skill-name> [--report] | benchmark <skill-name> [--runs N] [--report]"
output: "Informe markdown pass/fail (verify) o informe estadístico mean/stddev (benchmark)"
invocable: true
alwaysApply: false
---

# Skill: `/skill-verify`

## Objetivo

Ejecuta los casos de prueba TC-NNN definidos en `evals/evals.json` de un skill objetivo y devuelve un informe detallado de resultados pass/fail con evidencia por caso.

Complementa el par simétrico de skills TDD:
- `skill-test-evals` → *genera* `evals/evals.json` (fase RED: define qué debe cumplir el skill)
- `skill-verify` → *ejecuta* `evals/evals.json` (fase de validación: comprueba que el skill cumple)

**Modos de operación:**
- **verify** (predeterminado): ejecuta cada caso TC-NNN una vez → informe pass/fail
- **benchmark** (subcomando): ejecuta cada caso N veces → informe estadístico mean ± stddev

**Qué hace este skill:**
- Verifica que el skill objetivo existe y tiene `evals/evals.json` en formato SDDF
- Ejecuta cada caso TC-NNN invocando el skill objetivo con el escenario descrito
- Evalúa el output contra `expected.contains` y `expected.not_contains`
- Calcula `pass_rate` por caso y global
- Genera un informe markdown estructurado con tabla de resultados y detalle de fallos
- En modo `benchmark`: corre cada caso N veces y calcula mean ± stddev de pass_rate, duración y tokens
- Guarda el informe en `.tmp/skill-verify/{skill_name}/` si se pasa `--report`

**Qué NO hace este skill:**
- Crear ni modificar `evals/evals.json` — eso es responsabilidad de `skill-test-evals`
- Ejecutar evals en formato trigger (`query`/`should_trigger`) — ese formato es para `scripts/run_eval.py`

---

## Parámetros

| Parámetro | Tipo | Descripción |
|---|---|---|
| `{skill_name}` | posicional | Nombre del skill (ej. `story-design`) o ruta explícita |
| `benchmark` | sub-comando | Activa modo estadístico — corre cada caso N veces en lugar de una |
| `--runs N` | flag numérico | Número de iteraciones por caso en modo benchmark (default: 3, mínimo: 2, máximo: 10) |
| `--report` | flag opcional | Guarda el informe en `.tmp/skill-verify/{skill_name}/report-YYYYMMDD.md` |

### Sintaxis de uso

/skill-verify {skill_name}                    → 1 run → pass/fail
/skill-verify benchmark {skill_name}          → 3 runs × caso → mean/stddev
/skill-verify benchmark {skill_name} --runs 5 → 5 runs × caso → métricas estadísticas
/skill-verify benchmark {skill_name} --report → guarda benchmark-YYYYMMDD.md

---

## Precondiciones

- El skill objetivo existe en `.claude/skills/{skill_name}/`
- `evals/evals.json` existe en el directorio del skill objetivo
- `evals.json` tiene formato SDDF (campo `cases[]` en el nivel raíz)
- `skill-preflight` retorna estado OK (entorno válido)

---

## Flujo de ejecución

### Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight` antes de cualquier operación. El preflight verifica `SDDF_ROOT` y resuelve `SPECS_BASE`.

Si retorna `✗ Entorno inválido`, detener la ejecución.

---

### Paso 1 — Resolver parámetros

#### 1a. Detectar modo de ejecución

Examinar los argumentos de invocación:
- Si el **primer argumento** es exactamente `benchmark`:
  - Registrar `$MODE = benchmark`
  - El skill_name es el **segundo argumento** (si no hay segundo argumento, preguntar)
  - Leer `--runs N` si está presente (default: 3); si N < 2 → `⚠️ --runs mínimo es 2. Usando N=2`; si N > 10 → `⚠️ --runs máximo recomendado es 10. Usando N=10`
  - Emitir: `[INFO] Modo: benchmark | Runs por caso: {N}`
- Si el primer argumento NO es `benchmark`:
  - Registrar `$MODE = verify`
  - El skill_name es el **primer argumento**
  - Emitir: `[INFO] Modo: verify`

#### 1b. Resolver el skill_name

Si no se proporcionó skill_name (ningún argumento o primer argumento ausente en modo benchmark), preguntar:
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

Verificar que `evals/evals.json` existe en el directorio del skill:
```
❌ No se encontró evals/evals.json en <path>.
   Ejecuta /skill-test-evals {skill_name} primero para generar los casos de prueba.
```
Si no existe, detener.

---

### Paso 2 — Leer y validar `evals.json`

Leer el archivo `evals/evals.json`.

**Detección de formato:**
- Si tiene clave `cases` en el nivel raíz → formato SDDF ✓ continuar
- Si es array plano con campo `query` en los elementos → formato trigger detectado:
  ```
  ❌ Este evals.json usa formato trigger (array con query/should_trigger).
     skill-verify requiere el formato SDDF con cases[].
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

Emitir:
```
[INFO] {N} casos encontrados en {skill_name}/evals/evals.json
```

---

### Paso 3 — Ejecutar cada caso

Para cada caso en `cases[]`, lanzar en paralelo cuando sea posible:

#### 3a. Construir el prompt de escenario

```
Escenario de prueba para el skill {skill_name}:

{description}

Condiciones de entrada:
{input — cada campo como bullet: "- campo: valor"}

Ejecuta el skill con estas condiciones y reporta exactamente qué emitiría.
```

#### 3b. Invocar el skill objetivo como subagente

Invocar `{skill_name}` como subagente pasándole el prompt construido. Capturar el output completo.

#### 3c. Evaluar el output contra `expected`

Para cada string en `expected.contains`:
- Buscar en el output del subagente (búsqueda de subcadena, case-sensitive)
- Resultado: `FOUND` (contribuye a pass) o `MISSING` (contribuye a fail)

Para cada string en `expected.not_contains`:
- Buscar en el output del subagente
- Resultado: `ABSENT` (ok) o `PRESENT` (violation — contribuye a fail)

#### 3d. Calcular resultado del caso

- Si `threshold = 1.0`: caso PASS solo si **todos** los `contains` están presentes Y **ningún** `not_contains` está presente
- Si `threshold < 1.0`: caso PASS si `(found_contains / total_contains) ≥ threshold` Y sin violaciones en `not_contains`

Registrar internamente:
```json
{
  "id": "TC-NNN",
  "name": "...",
  "type": "...",
  "threshold": X.XX,
  "status": "PASS" | "FAIL",
  "missing_contains": [...],
  "violated_not_contains": [...],
  "evidence": "<primeros 300 chars del output del subagente>"
}
```

---

### Paso 4 — Agregar resultados

Calcular:
- `passed` = número de casos con `status: PASS`
- `failed` = número de casos con `status: FAIL`
- `pass_rate` = `passed / total × 100` (redondeado a 1 decimal)

---

### Paso 5 — Generar informe

Leer `assets/report-template.md` del directorio del skill `skill-verify`.

Completar el template:

**Tabla de casos** (campo `{rows}`):
```
| TC-001 | nombre-del-caso | happy-path | 0.95 | ✅ PASS | — |
| TC-002 | otro-caso | fail-fast | 1.0 | ❌ FAIL | missing: "❌" |
```

**Sección de detalles de fallos** (campo `{failure_details}`):
Si hay casos fallidos, incluir por cada uno:
```
### ❌ {id} — {name}

**Missing contains:** {lista de strings no encontrados}
**Violated not_contains:** {lista de strings encontrados pero no deberían estar}
**Evidencia (primeros 300 chars):**
> {evidence}
```

Si no hay fallos: omitir la sección.

**Mensaje final** (campo `{summary_message}`):
- 100%: `✅ Todos los {N} casos pasaron. El skill está listo.`
- < 100%: `⚠️ Pass rate: {X}%. Considera ejecutar /skill-master build para mejorar el skill.`

---

### Paso 6 — Guardar informe (si `--report`)

Si se pasó el flag `--report`:
- Crear directorio `.tmp/skill-verify/{skill_name}/` si no existe
- Escribir informe en `.tmp/skill-verify/{skill_name}/report-YYYYMMDD.md`
- Emitir: `📄 Informe guardado en: .tmp/skill-verify/{skill_name}/report-YYYYMMDD.md`

Si no se pasó `--report`:
- Mostrar el informe directamente en la conversación sin guardar archivos.

---

---

## Modo benchmark — `/skill-verify benchmark <skill-name>`

Se activa cuando `$MODE = benchmark`. Los Pasos 0–2 (preflight, resolver parámetros,
validar evals.json) son **idénticos** al modo verify. En lugar de ejecutar el Paso 3,
ejecutar los siguientes pasos B3–B6:

### Paso B3 — Ejecutar cada caso N veces

Para cada caso en `cases[]`, ejecutar N iteraciones secuencialmente:

Por cada run `r` en `[1..N]`:
1. Registrar timestamp de inicio: `t_start`
2. Construir el prompt de escenario (idéntico al Paso 3a del modo verify)
3. Invocar el skill objetivo como subagente con el prompt construido
4. Registrar timestamp de fin: `t_end`
5. Evaluar output contra `expected.contains` / `expected.not_contains` (mismo criterio del Paso 3c)
6. Registrar internamente: `{ run: r, pass: bool, duration_ms: t_end - t_start, tokens_estimated: len(output) / 4 }`

Emitir progreso por caso:
```
[TC-001] run 1/3… ✅  |  run 2/3… ✅  |  run 3/3… ✅
[TC-002] run 1/3… ✅  |  run 2/3… ❌  |  run 3/3… ✅
```

### Paso B4 — Calcular métricas estadísticas por caso

Para cada caso, con los datos de las N runs:

```
pass_rate  = (cantidad de runs con pass / N) × 100
durations  = [duration_ms de cada run]
mean_ms    = suma(durations) / N
stddev_ms  = sqrt( suma((d - mean_ms)^2) / max(N-1, 1) )   ← desviación estándar muestral
tokens_est = promedio(tokens_estimated de cada run)

estabilidad:
  estable   → pass_rate = 100% o 0%   (resultado determinista)
  inestable → 0% < pass_rate < 100%   (flakiness detectada)
```

Métricas globales:
```
global_pass_rate        = promedio(pass_rate de todos los casos)
global_mean_duration_ms = promedio(mean_ms de todos los casos)
global_stddev_duration_ms = promedio(stddev_ms de todos los casos)
global_mean_tokens      = promedio(tokens_est de todos los casos)
```

### Paso B5 — Generar informe de benchmark

Leer `assets/benchmark-report-template.md` del directorio del skill `skill-verify`.

Completar el template:

**Tabla de métricas por caso** (campo `{rows}`):
```
| TC-001 | nombre-del-caso | 100%  | 245 ms | ±12 ms  | 3 |
| TC-002 | otro-caso       | 66%   | 310 ms | ±45 ms  | 3 |
```

**Sección de casos inestables** (campo `{unstable_cases}`):
Si hay casos con `0% < pass_rate < 100%`:
```
⚠️ Casos inestables detectados (el resultado varía entre runs — posible flakiness):
- TC-002: 2/3 runs pasaron (66%) → el skill produce resultados inconsistentes en este escenario
```
Si no hay casos inestables: omitir la sección.

**Mensaje final** (campo `{summary_message}`):
- `global_pass_rate ≥ 95%`: `✅ Benchmark completado. Pass rate global: X%. El skill es estable.`
- `global_pass_rate < 95%`: `⚠️ Pass rate: X%. Considera ejecutar /skill-master build para mejorar el skill.`

### Paso B6 — Guardar informe (si `--report`)

Si se pasó el flag `--report`:
- Crear directorio `.tmp/skill-verify/{skill_name}/` si no existe
- Escribir informe en `.tmp/skill-verify/{skill_name}/benchmark-YYYYMMDD.md`
- Emitir: `📄 Benchmark guardado en: .tmp/skill-verify/{skill_name}/benchmark-YYYYMMDD.md`

Si no se pasó `--report`: mostrar el informe directamente en la conversación.

---

## Manejo de errores

| Condición | Mensaje | Acción |
|---|---|---|
| Skill no encontrado | `❌ No se encontró el skill '{name}' en .claude/skills/` | Detener |
| `evals.json` ausente | `❌ No se encontró evals/evals.json ... Ejecuta /skill-test-evals primero` | Detener |
| Formato trigger detectado | `❌ Este evals.json usa formato trigger ... skill-verify requiere formato SDDF con cases[]` | Detener |
| `cases[]` vacío | `⚠️ evals.json no contiene casos. Añade al menos TC-001 antes de verificar.` | Detener |
| Subagente falla al ejecutar caso | Marcar caso como `❌ ERROR` con mensaje del subagente como evidencia | Continuar con siguiente caso |
| `--runs < 2` en modo benchmark | `⚠️ --runs mínimo es 2. Usando N=2.` | Continuar con N=2 |
| `--runs > 10` en modo benchmark | `⚠️ --runs máximo recomendado es 10. Usando N=10.` | Continuar con N=10 |

---

## Salida

- Informe markdown con tabla de resultados por caso TC-NNN + `pass_rate` global
- Si `--report`: archivo en `.tmp/skill-verify/{skill_name}/report-YYYYMMDD.md`

### Ejemplo de salida

```
# Eval Report: story-design

**Fecha:** 2026-05-30 | **Total:** 3 | ✅ Passed: 2 | ❌ Failed: 1 | **Pass rate:** 66.7%

| ID | Nombre | Tipo | Threshold | Estado | Notas |
|---|---|---|---|---|---|
| TC-001 | happy-path-diseño-basico | happy-path | 0.95 | ✅ PASS | — |
| TC-002 | fail-fast-story-ausente | fail-fast | 1.0 | ✅ PASS | — |
| TC-003 | edge-case-sin-constitution | edge-case | 0.90 | ❌ FAIL | missing: "⚠️" |

### ❌ TC-003 — edge-case-sin-constitution

**Missing contains:** ["⚠️"]
**Evidencia (primeros 300 chars):**
> No se encontró constitution.md. El diseño se generará sin restricciones técnicas explícitas...

---
⚠️ Pass rate: 66.7%. Considera ejecutar /skill-master build para mejorar el skill.
```

---

## Referencias

- **Par simétrico:** `skill-test-evals` (genera evals) ↔ `skill-verify` (ejecuta evals)
- **Formato de evals:** `references/skill-evals-format.md` en `skill-master`
- **Infraestructura benchmark:** `scripts/aggregate_benchmark.py` en `skill-master` (agregación avanzada si se necesita)
