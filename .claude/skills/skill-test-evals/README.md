# skill-test-evals

Skill unificado para crear, ejecutar y benchmarkear evals de skills SDDF. Cubre el ciclo completo de pruebas de skills: generación de casos de prueba, verificación de resultados e informe de métricas estadísticas.

## Cuándo usar

| Situación | Modo recomendado |
|---|---|
| Quieres crear pruebas para un skill nuevo desde cero | `generate` (sin flags) |
| Tienes un SKILL.md y quieres derivar sus evals automáticamente | `generate --from-skill <path>` |
| Tienes una spec (story.md, design.md) y quieres generar evals desde ella | `generate --source <file>` |
| Quieres verificar que un skill existente pasa sus casos TC-NNN | `evals <skill_name>` |
| Quieres medir estabilidad y rendimiento de un skill con múltiples runs | `benchmark <skill_name>` |

## Modos de invocación

| Modo | Comando | Triggers de lenguaje natural |
|---|---|---|
| **generate** | `/skill-test-evals <descripción>` | "crear pruebas de...", "escribe los evals para...", "genera los casos de prueba para...", "este skill no tiene pruebas" |
| **generate (desde skill)** | `/skill-test-evals generate <skill_name>` | "genera evals para este skill", "add tests to this skill", "quiero los evals de..." |
| **evals** | `/skill-test-evals evals <skill_name>` | "ejecutar evals de...", "verificar skill...", "correr los tests del skill", "validar que el skill funciona" |
| **benchmark** | `/skill-test-evals benchmark <skill_name>` | "benchmark del skill", "medir estabilidad de...", "verificar que el skill pasa con métricas" |

El skill detecta el modo por el primer argumento. Los flags son opcionales.

## Flags

| Flag | Aplica a | Descripción |
|---|---|---|
| `--source <file\|text>` | `generate` | Fuente para generar evals: ruta a archivo (`story.md`, `SKILL.md`, `design.md`) o texto libre |
| `--from-skill <path>` | `generate` | Lee un `SKILL.md` existente y genera evals co-ubicados en ese directorio |
| `--skill-dir <path>` | `generate` | Directorio de salida para el `evals/evals.json` generado |
| `--skill-name <name>` | `generate` | Nombre del skill para inferir la ruta de salida |
| `--runs N` | `benchmark` | Número de ejecuciones por caso (default: 3; mín: 2; máx: 10) |
| `--report` | `evals`, `benchmark` | Guarda el informe en `.tmp/skill-test-evals/{skill_name}/` en lugar de mostrarlo en conversación |
| `--auto` | `generate` | Ejecución sin pausas de confirmación; requiere `--source` o `--from-skill` |
| `--manual` | `generate` | **(Por defecto)** Pausa en checkpoint G5 para revisión de los casos propuestos |

## Modo de uso (Sintaxis completa)

```bash
# Modo generate — crear evals/evals.json
/skill-test-evals <descripción libre>                    # genera evals + skeleton SKILL.md
/skill-test-evals generate <skill_name>                  # genera evals (explícito)
/skill-test-evals --from-skill .claude/skills/my-skill/ # deriva evals desde SKILL.md existente
/skill-test-evals --source docs/specs/stories/FEAT-042/story.md

# Modo evals — 1 run → informe pass/fail
/skill-test-evals evals <skill_name>
/skill-test-evals evals <skill_name> --report            # guarda informe en .tmp/

# Modo benchmark — N runs → métricas estadísticas
/skill-test-evals benchmark <skill_name>
/skill-test-evals benchmark <skill_name> --runs 5
/skill-test-evals benchmark <skill_name> --runs 5 --report
```

## Qué hace cada modo

### Modo `generate`

1. Determina la fuente de entrada: `--from-skill`, `--source`, o pregunta interactiva al usuario
2. Extrae la intención del skill: purpose, triggers, inputs, outputs y criterios de éxito
3. Genera 3–5 casos de prueba cubriendo happy-path, fail-fast y edge-case
4. Checkpoint (modo `--manual`): muestra los casos propuestos y espera confirmación
5. Escribe `evals/evals.json` en el directorio del skill
6. Si la entrada fue descripción libre: crea también un skeleton `SKILL.md` vacío

### Modo `evals`

1. Verifica que el skill existe y tiene `evals/evals.json` en formato SDDF (`cases[]`)
2. Para cada caso TC-NNN, invoca el skill objetivo como subagente con el prompt del escenario
3. Evalúa el output contra `expected.contains` y `expected.not_contains`
4. Calcula `pass_rate` global y genera un informe markdown con tabla de resultados y detalle de fallos

### Modo `benchmark`

Igual que `evals`, pero ejecuta cada caso N veces y añade métricas estadísticas:

- `pass_rate` por caso y global
- `mean_ms` y `stddev_ms` de duración
- Detección de flakiness (casos con `0% < pass_rate < 100%`)

## Artefactos

| Artefacto | Generado en | Modo |
|---|---|---|
| `evals/evals.json` | directorio del skill objetivo | `generate` |
| skeleton `SKILL.md` | `.claude/skills/{skill_name}/` | `generate` (solo desde descripción libre) |
| Informe eval | conversación o `.tmp/skill-test-evals/{skill_name}/report-YYYYMMDD.md` | `evals` |
| Informe benchmark | conversación o `.tmp/skill-test-evals/{skill_name}/benchmark-YYYYMMDD.md` | `benchmark` |

## Formato evals.json (TC-NNN)

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
        "flags": ["--flag-opcional"],
        "context": "Descripción del contexto de entrada"
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

## Flujo típico (TDD de un skill nuevo)

```
# Fase RED — crear evals antes de implementar
/skill-test-evals --source "skill que reformatea emails en formato corporativo"
→ genera evals/evals.json + skeleton SKILL.md

# Verificar que el skill aún no pasa (estado RED)
/skill-test-evals evals email-formatter

# Fase GREEN — implementar el skill con skill-master
/skill-master build

# Verificar que el skill pasa (estado GREEN)
/skill-test-evals evals email-formatter

# Medir estabilidad tras refactor
/skill-test-evals benchmark email-formatter --runs 5
```

## Integración con skill-master

`skill-test-evals` es el componente de evaluación que usa `skill-master` internamente:

| En skill-master | skill-test-evals ejecuta |
|---|---|
| Fase RED | `generate` → crea evals que deben fallar |
| Ciclo GREEN/REFACTOR | `evals` → verifica pass_rate después de cada iteración de SKILL.md |
| Fase final | `benchmark` → valida estabilidad del skill terminado |

## Manejo de errores

| Condición | Comportamiento |
|---|---|
| Skill no encontrado | `❌ No se encontró el skill '{name}' en .claude/skills/` → detener |
| `evals.json` ausente | `❌ No se encontró evals/evals.json` → sugerir `/skill-test-evals {skill_name}` |
| Formato trigger detectado (array con `query`) | `❌ Este evals.json usa formato trigger` → detener |
| `cases[]` vacío | `⚠️ evals.json no contiene casos` → detener |
| Subagente falla al ejecutar un caso | Marcar como `❌ ERROR` y continuar con el siguiente |
| `--runs < 2` | `⚠️ --runs mínimo es 2. Usando N=2` → continuar |
| `--runs > 10` | `⚠️ --runs máximo es 10. Usando N=10` → continuar |
| `SKILL.md` ausente con `--from-skill` | `No SKILL.md found at <path>` → detener |
| Sin `--source` ni `--from-skill` en `--auto` | Error explícito → detener |
