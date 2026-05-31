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
