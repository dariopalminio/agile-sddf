---
alwaysApply: false
type: story
id: STORY-119
kind: feat
slug: STORY-119-story-plan-un-subagente-por-paso
title: "Ejecutar cada paso de /story-plan en un subagente aislado para consumir menos tokens"
status: COMPLETED
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
created: 2026-10-07
updated: 2026-10-07
related:
  - EPIC-21-colapsar-specs-dos-niveles
  - EPIC-12-story-sdd-workflow
---
<!-- Referencias: colocar referencias solo si existe épica relacionada -->
[[EPIC-21-colapsar-specs-dos-niveles]]

# 📖 Historia: Un subagente aislado por paso en `/story-plan`

**Como** Product Owner y mantenedor, que planifica historias con `/story-plan` y luego sigue implementando en la misma sesión  
**Quiero** que cada paso del pipeline (design → tasking → testcases → analyze) se ejecute en un contexto aislado que lea sus insumos del disco y devuelva solo un estado breve  
**Para** reducir la entrada acumulada de tokens del planning y terminar el plan con un hilo principal liviano, sin perder calidad ni el orden de los artefactos

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Pipeline completo con un subagente por paso
```gherkin
Dado que la historia "STORY-107" tiene story.md y ningún artefacto de planning
  Y el runtime admite subagentes (p. ej. "claude-code")
Cuando ejecuto "/story-plan STORY-107"
Entonces story-design, story-tasking, story-testcases y story-analyze se ejecutan en ese orden, cada uno en su propio subagente
  Y cada subagente escribe su artefacto (design.md, tasks.md, testcases.md, analyze.md) en el directorio de la historia
  Y cada subagente escribe ".tmp/story-plan/STORY-107/<paso>.result.md" cuya primera línea es "STATUS: OK", "STATUS: WARN" o "STATUS: FAIL" seguida de 5 líneas de resumen como máximo
  Y el resumen final de story-plan se arma leyendo solo esos 4 archivos de resultado
```

### AC-2 — Escenario alternativo – Artefactos existentes: una sola pregunta al inicio
```gherkin
Escenario: decisión única sobre artefactos existentes
  Dado que la historia ya tiene design.md y tasks.md, pero no testcases.md ni analyze.md
  Cuando ejecuto "/story-plan" y respondo "<respuesta>" a la única pregunta inicial
  Entonces ningún subagente vuelve a preguntar por sobrescritura
    Y el resultado es "<resultado>"
Ejemplos:
  | respuesta              | resultado                                                                 |
  | regenerar todos        | se regeneran los 4 artefactos                                             |
  | solo los que faltan    | design.md y tasks.md quedan sin cambios; se generan testcases.md y analyze.md |
  | cancelar               | no se lanza ningún subagente y ningún archivo de la historia cambia        |
```

### AC-3 — Escenario de error – Un FAIL corta la cadena
```gherkin
Dado que el subagente de story-design escribe "STATUS: FAIL" en su archivo de resultado
Cuando story-plan lee esa primera línea
Entonces no se lanzan los subagentes de story-tasking, story-testcases ni story-analyze
  Y el resumen final muestra story-design como "✗" y los pasos restantes como "—"
```

### AC-4 — Escenario alternativo – Runtime sin subagentes
```gherkin
Dado que el runtime no admite subagentes (p. ej. "codex", con "agentsDirectory: null" en config/runtimes.json)
Cuando ejecuto "/story-plan STORY-107"
Entonces los 4 sub-skills se ejecutan por composición inline en la sesión principal, como hoy
  Y se generan los mismos 4 artefactos
  Y la pregunta sobre artefactos existentes se hace igualmente una sola vez, al inicio
```

### AC-5 — Escenario alternativo – Workers ejecutables sin preguntar
```gherkin
Escenario: story-design, story-tasking y story-analyze aceptan la decisión de sobrescritura
  Dado que "<artefacto>" ya existe en el directorio de la historia
  Cuando invoco "/<skill>" con "<flag>"
  Entonces el skill no muestra la pregunta "(r) Regenerar / (n) No modificar"
    Y "<artefacto>" queda "<estado>"
Ejemplos:
  | skill         | artefacto  | flag            | estado        |
  | story-design  | design.md  | --force         | regenerado    |
  | story-tasking | tasks.md   | --skip-existing | sin cambios   |
  | story-analyze | analyze.md | --force         | regenerado    |
```
<!-- Regla: sin flags, los tres workers conservan el comportamiento interactivo actual. "--force" usa el mismo nombre que ya tiene story-testcases; el nombre del modo "saltar si existe" puede ajustarse en design.md. -->

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Ahorro de tokens medido:** sobre una misma historia (p. ej. una copia de STORY-107), la entrada acumulada del pipeline en modo subagentes es menor que en modo inline, y el contexto del hilo principal tras el plan queda en ~15k tokens o menos. La medición (`/cost` o el uso informado por cada subagente) se registra en el reporte de la historia.
- **CNF-2 — Sin pérdida de calidad:** los 4 artefactos generados en modo subagentes cumplen `docs/guardrails/dod-story-plan.md`, y `analyze.md` no reporta más ERRORs que la corrida inline de la misma historia.
- **CNF-3 — Aislamiento de contexto:** el prompt de cada subagente contiene solo la ruta del `SKILL.md` del worker y un bloque de contexto (`REPO_ROOT`, `SPECS_BASE`, `ROOT_SOURCE`, ruta de la historia, modo Agent, decisión de sobrescritura); nunca el contexto conversacional de la sesión.
- **CNF-4 — Compatibilidad:** `--only-tasks`, `--only-testcases` y `--skip-analyze` siguen funcionando con el mismo comportamiento y la misma numeración `[n/total]`.
- **CNF-5 — Sin delegación anidada:** ningún subagente lanza otro subagente; los 4 sub-skills se usan como skills worker según `docs/guides/best-practices-for-skills.md` (sección "Subagentes y skills").
- **CNF-6 — Verificación automatizada:** `npm run test:eval -- story-plan --dry-run` produce un plan no vacío; `node scripts/verify-eval-inventory.js` y `npm test` pasan.

## Fuera de alcance (Non-Goals)

- Ejecutar tasking y testcases en paralelo: es posible (ambos dependen de story.md + design.md), pero se mantiene el orden secuencial para conservar las referencias `T-NNN` en testcases.md.
- Aplicar el mismo patrón a otros orquestadores (`story-specify`, `story-implement`, `project-flow`).
- Cambiar `docs/guides/best-practices-for-skills.md`: ya admite "subagente → skill worker".
- Crear agentes nuevos en `agents/` para los workers.

## 📎 Notas / contexto adicional

**Por qué se consumen tantos tokens hoy.** En la corrida inline de STORY-108, el hilo principal llega a `story-analyze` con ~90-100k tokens (SKILL.md de los 6 skills ~25-30k; exploración del repo ~20-30k; artefactos escritos ~25-30k). Cada llamada a herramienta reenvía todo ese contexto: con ~40 llamadas y un contexto que crece de ~20k a ~100k, la entrada acumulada ronda los 2-2,5M tokens. Con un subagente por paso, cada paso arranca limpio (~25-40k) y el hilo principal solo crece con los resúmenes; la estimación (a confirmar con CNF-1) es ≈ 40-50 % menos de entrada acumulada.

**Beneficios adicionales.** `story-analyze` audita con un contexto que no escribió el diseño (sin sesgo de autor), y los artefactos pasan a ser el contrato real entre pasos: cualquier decisión que `design.md` no dejó escrita queda expuesta (principio de evitar el "teléfono descompuesto" de AGENTS.md).

**Superficie de cambio prevista** (a confirmar en design.md):

| Archivo | Cambio |
|---|---|
| `skills/story-plan/SKILL.md` | Pregunta única sobre artefactos existentes; delegación por paso con fallback inline; contrato `.tmp/story-plan/<STORY-ID>/<paso>.result.md` |
| `skills/story-design/SKILL.md`, `skills/story-tasking/SKILL.md`, `skills/story-analyze/SKILL.md` | Flags `--force` y "saltar si existe" |
| `skills/story-plan/README.md` | Documentar el modo subagentes y el fallback |
| `skills/story-plan/evals/evals.json` | Casos: decisión inicial con artefactos existentes; FAIL en design corta la cadena; runtime sin subagentes → inline |

**Hechos verificados al crear la historia:** solo `story-testcases` tiene hoy `--force`; `story-design`, `story-tasking` y `story-analyze` preguntan "(r) Regenerar" si el artefacto existe; ninguno de los 4 workers lanza subagentes; `codex` declara `agentsDirectory: null` en `config/runtimes.json`; `sddf.config.yaml` no declara delegates para la fase plan.

