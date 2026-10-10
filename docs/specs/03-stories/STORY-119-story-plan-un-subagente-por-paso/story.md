---
alwaysApply: false
type: story
id: STORY-119
kind: feat
slug: STORY-119-story-plan-un-subagente-por-paso
title: "Ejecutar cada paso de /story-plan en un subagente aislado para consumir menos tokens"
status: CANCELED
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
created: 2026-10-07
updated: 2026-10-10
related:
  - EPIC-21-colapsar-specs-dos-niveles
  - EPIC-12-story-sdd-workflow
---
> **Cancelada el 2026-10-10 por decisión del usuario.** Se revirtieron los cambios de implementación de STORY-119: `/story-plan` vuelve a la composición inline anterior y se retiran los flags y evals agregados por esta historia. Los documentos de planificación y los reportes se conservan como historial; sus resultados describen la implementación anterior a esta reversión.

<!-- Referencias: colocar referencias solo si existe Ã©pica relacionada -->
[[EPIC-21-colapsar-specs-dos-niveles]]

# ðŸ“– Historia: Un subagente aislado por paso en `/story-plan`

**Como** Product Owner y mantenedor, que planifica historias con `/story-plan` y luego sigue implementando en la misma sesiÃ³n  
**Quiero** que cada paso del pipeline (design â†’ tasking â†’ testcases â†’ analyze) se ejecute en un contexto aislado que lea sus insumos del disco y devuelva solo un estado breve  
**Para** reducir la entrada acumulada de tokens del planning y terminar el plan con un hilo principal liviano, sin perder calidad ni el orden de los artefactos

## âœ… Criterios de aceptaciÃ³n

### AC-1 â€” Escenario principal â€“ Pipeline completo con un subagente por paso
```gherkin
Dado que la historia "STORY-107" tiene story.md y ningÃºn artefacto de planning
  Y el runtime admite subagentes (p. ej. "claude-code")
Cuando ejecuto "/story-plan STORY-107"
Entonces story-design, story-tasking, story-testcases y story-analyze se ejecutan en ese orden, cada uno en su propio subagente
  Y cada subagente escribe su artefacto (design.md, tasks.md, testcases.md, analyze.md) en el directorio de la historia
  Y cada subagente escribe ".tmp/story-plan/STORY-107/<paso>.result.md" cuya primera lÃ­nea es "STATUS: OK", "STATUS: WARN" o "STATUS: FAIL" seguida de 5 lÃ­neas de resumen como mÃ¡ximo
  Y el resumen final de story-plan se arma leyendo solo esos 4 archivos de resultado
```

### AC-2 â€” Escenario alternativo â€“ Artefactos existentes: una sola pregunta al inicio
```gherkin
Escenario: decisiÃ³n Ãºnica sobre artefactos existentes
  Dado que la historia ya tiene design.md y tasks.md, pero no testcases.md ni analyze.md
  Cuando ejecuto "/story-plan" y respondo "<respuesta>" a la Ãºnica pregunta inicial
  Entonces ningÃºn subagente vuelve a preguntar por sobrescritura
    Y el resultado es "<resultado>"
Ejemplos:
  | respuesta              | resultado                                                                 |
  | regenerar todos        | se regeneran los 4 artefactos                                             |
  | solo los que faltan    | design.md y tasks.md quedan sin cambios; se generan testcases.md y analyze.md |
  | cancelar               | no se lanza ningÃºn subagente y ningÃºn archivo de la historia cambia        |
```

### AC-3 â€” Escenario de error â€“ Un FAIL corta la cadena
```gherkin
Dado que el subagente de story-design escribe "STATUS: FAIL" en su archivo de resultado
Cuando story-plan lee esa primera lÃ­nea
Entonces no se lanzan los subagentes de story-tasking, story-testcases ni story-analyze
  Y el resumen final muestra story-design como "âœ—" y los pasos restantes como "â€”"
```

### AC-4 â€” Escenario alternativo â€“ Runtime sin subagentes
```gherkin
Dado que el runtime no admite subagentes (p. ej. "codex", con "agentsDirectory: null" en config/runtimes.json)
Cuando ejecuto "/story-plan STORY-107"
Entonces los 4 sub-skills se ejecutan por composiciÃ³n inline en la sesiÃ³n principal, como hoy
  Y se generan los mismos 4 artefactos
  Y la pregunta sobre artefactos existentes se hace igualmente una sola vez, al inicio
```

### AC-5 â€” Escenario alternativo â€“ Workers ejecutables sin preguntar
```gherkin
Escenario: story-design, story-tasking y story-analyze aceptan la decisiÃ³n de sobrescritura
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

## âš™ï¸ Criterios no funcionales especÃ­ficos

- **CNF-1 â€” Ahorro de tokens medido:** sobre una misma historia (p. ej. una copia de STORY-107), la entrada acumulada del pipeline en modo subagentes es menor que en modo inline, y el contexto del hilo principal tras el plan queda en ~15k tokens o menos. La mediciÃ³n (`/cost` o el uso informado por cada subagente) se registra en el reporte de la historia.
- **CNF-2 â€” Sin pÃ©rdida de calidad:** los 4 artefactos generados en modo subagentes cumplen `docs/guardrails/dod-story-plan.md`, y `analyze.md` no reporta mÃ¡s ERRORs que la corrida inline de la misma historia.
- **CNF-3 â€” Aislamiento de contexto:** el prompt de cada subagente contiene solo la ruta del `SKILL.md` del worker y un bloque de contexto (`REPO_ROOT`, `SPECS_BASE`, `ROOT_SOURCE`, ruta de la historia, modo Agent, decisiÃ³n de sobrescritura); nunca el contexto conversacional de la sesiÃ³n.
- **CNF-4 â€” Compatibilidad:** `--only-tasks`, `--only-testcases` y `--skip-analyze` siguen funcionando con el mismo comportamiento y la misma numeraciÃ³n `[n/total]`.
- **CNF-5 â€” Sin delegaciÃ³n anidada:** ningÃºn subagente lanza otro subagente; los 4 sub-skills se usan como skills worker segÃºn `docs/guides/best-practices-for-skills.md` (secciÃ³n "Subagentes y skills").
- **CNF-6 â€” VerificaciÃ³n automatizada:** `npm run test:eval -- story-plan --dry-run` produce un plan no vacÃ­o; `node scripts/verify-eval-inventory.js` y `npm test` pasan.

## Fuera de alcance (Non-Goals)

- Ejecutar tasking y testcases en paralelo: es posible (ambos dependen de story.md + design.md), pero se mantiene el orden secuencial para conservar las referencias `T-NNN` en testcases.md.
- Aplicar el mismo patrÃ³n a otros orquestadores (`story-specify`, `story-implement`, `project-flow`).
- Cambiar `docs/guides/best-practices-for-skills.md`: ya admite "subagente â†’ skill worker".
- Crear agentes nuevos en `agents/` para los workers.

## ðŸ“Ž Notas / contexto adicional

**Por quÃ© se consumen tantos tokens hoy.** En la corrida inline de STORY-108, el hilo principal llega a `story-analyze` con ~90-100k tokens (SKILL.md de los 6 skills ~25-30k; exploraciÃ³n del repo ~20-30k; artefactos escritos ~25-30k). Cada llamada a herramienta reenvÃ­a todo ese contexto: con ~40 llamadas y un contexto que crece de ~20k a ~100k, la entrada acumulada ronda los 2-2,5M tokens. Con un subagente por paso, cada paso arranca limpio (~25-40k) y el hilo principal solo crece con los resÃºmenes; la estimaciÃ³n (a confirmar con CNF-1) es â‰ˆ 40-50 % menos de entrada acumulada.

**Beneficios adicionales.** `story-analyze` audita con un contexto que no escribiÃ³ el diseÃ±o (sin sesgo de autor), y los artefactos pasan a ser el contrato real entre pasos: cualquier decisiÃ³n que `design.md` no dejÃ³ escrita queda expuesta (principio de evitar el "telÃ©fono descompuesto" de AGENTS.md).

**Superficie de cambio prevista** (a confirmar en design.md):

| Archivo | Cambio |
|---|---|
| `skills/story-plan/SKILL.md` | Pregunta Ãºnica sobre artefactos existentes; delegaciÃ³n por paso con fallback inline; contrato `.tmp/story-plan/<STORY-ID>/<paso>.result.md` |
| `skills/story-design/SKILL.md`, `skills/story-tasking/SKILL.md`, `skills/story-analyze/SKILL.md` | Flags `--force` y "saltar si existe" |
| `skills/story-plan/README.md` | Documentar el modo subagentes y el fallback |
| `skills/story-plan/evals/evals.json` | Casos: decisiÃ³n inicial con artefactos existentes; FAIL en design corta la cadena; runtime sin subagentes â†’ inline |

**Hechos verificados al crear la historia:** solo `story-testcases` tiene hoy `--force`; `story-design`, `story-tasking` y `story-analyze` preguntan "(r) Regenerar" si el artefacto existe; ninguno de los 4 workers lanza subagentes; `codex` declara `agentsDirectory: null` en `config/runtimes.json`; `sddf.config.yaml` no declara delegates para la fase plan.

