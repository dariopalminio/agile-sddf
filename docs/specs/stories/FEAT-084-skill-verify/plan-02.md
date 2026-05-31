# Plan: Añadir modo benchmark a skill-verify

## Context

skill-verify ya existe (v1.0.0) y ejecuta los evals TC-NNN una vez. El usuario quiere añadir /skill-verify benchmark <skill-name> para correr los evals N veces y calcular métricas estadísticas: tasa de aciertos media, consumo de tokens y tiempo de ejecución (mean ± stddev).

La sintaxis solicitada es sub-comando de skill-verify, no un skill separado:

/skill-verify <skill-name>              → 1 ejecución → pass/fail report  (ya existe)
/skill-verify benchmark <skill-name>    → N ejecuciones → informe estadístico  ← nuevo
Infraestructura existente reutilizable en .claude/skills/skill-master/:

scripts/aggregate_benchmark.py — agrega grading.json de múltiples runs → benchmark.json con mean/stddev/min/max
references/schemas.md — schema de timing.json y benchmark.json ya definidos

## Archivos a crear / modificar
Archivo	Tipo
.claude/skills/skill-verify/evals/evals.json	Modificar — añadir TC-006 y TC-007 para benchmark (TDD first)
.claude/skills/skill-verify/assets/benchmark-report-template.md	Nuevo — template del informe estadístico
.claude/skills/skill-verify/SKILL.md	Modificar — añadir sub-modo benchmark (version 1.0.0 → 1.1.0)

## Paso 0 — TDD: extender evals/evals.json ANTES de modificar el SKILL.md
Añadir 2 casos al array cases[] existente (TC-001…TC-005 ya están):

{
  "id": "TC-006",
  "name": "benchmark-happy-path-metricas-estadisticas",
  "type": "happy-path",
  "description": "Invocación con subcomando 'benchmark' y 2 casos, 3 runs cada uno → informe con mean pass_rate, mean_duration_ms y stddev por caso",
  "input": {
    "subcommand": "benchmark",
    "skill_name": "skill-test",
    "evals_present": true,
    "evals_format": "sddf",
    "cases_count": 2,
    "runs": 3
  },
  "expected": {
    "contains": ["mean", "stddev", "pass_rate", "duration_ms", "benchmark", "TC-001", "TC-002"],
    "not_contains": ["❌ No se encontró", "evals/evals.json"]
  },
  "threshold": 0.95
},
{
  "id": "TC-007",
  "name": "benchmark-fail-fast-skill-no-encontrado",
  "type": "fail-fast",
  "description": "Subcomando 'benchmark' con skill inexistente → misma detención que modo verify: ❌ con nombre del skill",
  "input": {
    "subcommand": "benchmark",
    "skill_name": "skill-inexistente-xyz"
  },
  "expected": {
    "contains": ["❌", "skill-inexistente-xyz", "no encontrado"],
    "not_contains": ["mean", "stddev", "benchmark report"]
  },
  "threshold": 1.0
}

## Paso 1 — Crear assets/benchmark-report-template.md
Template separado para el informe estadístico (diferente al report-template.md de verify):

# Benchmark Report: {skill_name}

**Fecha:** {date} | **Runs por caso:** {runs_per_case} | **Total casos:** {total_cases}

## Métricas globales

| Métrica | Valor |
|---|---|
| Pass rate media | {global_pass_rate}% |
| Duración media | {global_mean_duration_ms} ms |
| Stddev duración | {global_stddev_duration_ms} ms |
| Tokens medios (estimado) | {global_mean_tokens} |

## Métricas por caso

| ID | Nombre | Pass rate | Mean (ms) | Stddev (ms) | Runs |
|---|---|---|---|---|---|
{rows}

{unstable_cases}

---
{summary_message}

## Paso 2 — Modificar SKILL.md
2a. Frontmatter
Cambios:

version: "1.0.0" → "1.1.0"
input: añadir benchmark subcommand y --runs N
description: mencionar el modo benchmark
triggers: añadir "skill-verify benchmark", "benchmark del skill", "medir rendimiento del skill"
version: "1.1.0"
input: "<skill-name> [--report] | benchmark <skill-name> [--runs N] [--report]"
2b. Sección "Qué hace este skill"
Añadir bullet:

- En modo `benchmark`: ejecuta cada caso N veces y calcula mean ± stddev de pass_rate, duración y tokens
2c. Sección "Qué NO hace este skill"
Actualizar línea sobre benchmark:

- Ejecutar benchmarks con múltiples iteraciones — para eso usar `benchmark` como sub-modo:
  `/skill-verify benchmark <skill-name>`
(Eliminar referencia a skill-benchmark que ya no aplica)

2d. Tabla de parámetros
Añadir fila:

| `benchmark` | sub-comando | Activa modo estadístico — corre cada caso N veces |
| `--runs N` | flag numérico | Número de iteraciones por caso (default: 3, mínimo: 2) |
2e. Paso 1 — Resolver parámetros
Añadir detección de sub-comando al inicio del paso:

Si el primer argumento es "benchmark":
  Registrar internamente: $MODE = benchmark
  El skill_name es el SEGUNDO argumento (o preguntar si no hay segundo)
Si no hay "benchmark":
  Registrar internamente: $MODE = verify
  El skill_name es el PRIMER argumento (comportamiento actual)

Si $MODE = benchmark: leer --runs N (default 3); validar N ≥ 2.
2f. Nuevo bloque ## Modo benchmark
Insertar después del Paso 6 (guardar informe de verify), antes de Manejo de errores:

## Modo benchmark — `/skill-verify benchmark <skill-name>`

Se activa cuando $MODE = benchmark. Los Pasos 0–2 (preflight, resolver parámetros,
validar evals.json) son idénticos al modo verify.

### Paso B3 — Ejecutar cada caso N veces

Para cada caso en `cases[]`:
  Para cada run r en [1..N]:
    1. Registrar timestamp de inicio: t_start
    2. Invocar skill objetivo con el mismo prompt de escenario (igual que Paso 3a/3b del modo verify)
    3. Registrar timestamp de fin: t_end
    4. Evaluar output (mismo criterio contains/not_contains del modo verify)
    5. Registrar: { run: r, pass: bool, duration_ms: t_end - t_start, tokens_estimated: len(output)/4 }

### Paso B4 — Calcular métricas estadísticas por caso

Para cada caso:
  pass_rate  = (runs con pass / N) × 100
  durations  = [duration_ms de cada run]
  mean_ms    = promedio(durations)
  stddev_ms  = desviación estándar(durations)  [población: N-1 si N>1]
  tokens_est = promedio(tokens_estimated de cada run)

Clasificar estabilidad:
  estable    → pass_rate = 100% o 0%
  inestable  → 0% < pass_rate < 100% (el caso falla en algunas iteraciones)

### Paso B5 — Generar informe de benchmark

Leer `assets/benchmark-report-template.md`.

Completar tabla por caso (campo {rows}):
  | TC-001 | nombre | 100% | 245 ms | ±12 ms | 3 |
  | TC-002 | otro   | 66%  | 310 ms | ±45 ms | 3 |

Si hay casos inestables: añadir sección {unstable_cases}:
  ⚠️ Casos inestables (pasan en algunas iteraciones):
  - TC-002: 2/3 runs pasaron → posible flakiness en el skill

Mensaje final {summary_message}:
  ≥ 95% pass_rate global: ✅ Benchmark completado. Pass rate global: X%. El skill es estable.
  < 95%:                  ⚠️ Pass rate: X%. Considera ejecutar /skill-master build para mejorar el skill.

### Paso B6 — Guardar (si --report)

Guardar en: .tmp/skill-verify/{skill_name}/benchmark-YYYYMMDD.md
2g. Manejo de errores — añadir filas para benchmark
| --runs < 2 en modo benchmark | ⚠️ --runs mínimo es 2. Usando N=2. | Continuar con N=2 |
| N > 10 en modo benchmark | ⚠️ --runs máximo recomendado es 10. Usando N=10. | Continuar con N=10 |

## Verificación end-to-end

/skill-verify story-implement — modo verify (sin cambios): 9 casos, 1 ejecución → tabla pass/fail
/skill-verify benchmark story-implement — modo benchmark: 9 casos × 3 runs → informe estadístico con mean/stddev
/skill-verify benchmark story-implement --runs 5 — 9 casos × 5 runs → pass_rate global y métricas
/skill-verify benchmark skill-inexistente-xyz → ❌ con nombre del skill (mismo comportamiento que verify)
Confirmar que el informe de benchmark contiene columnas mean (ms) y stddev en la tabla

