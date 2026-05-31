## Context

El workflow L1 de SDDF tiene dos artefactos activos: `story.md` (criterios de aceptación) y `design.md` (decisiones técnicas). El tercer artefacto, `tasks.md`, se genera actualmente ad-hoc sin estructura ni trazabilidad. El skill `story-tasking` cierra esta brecha siguiendo el mismo patrón establecido por `story-design`: skill orquestador sin subagentes, template como fuente de verdad estructural, preflight como Paso 0 y fail-fast declarativo ante precondiciones no satisfechas.

## Goals / Non-Goals

**Goals:**
- Implementar el skill `/story-tasking` en `.claude/skills/story-tasking/SKILL.md` con el patrón estándar SDDF
- Generar `tasks.md` con IDs secuenciales (`T001`...), marcadores `[P]` y agrupamiento bajo encabezados `##` numerados
- Garantizar trazabilidad entre tareas, ACs de `story.md` y componentes de `design.md`
- Crearlo usando `skill-master` para asegurar artefactos de calidad (README, ejemplos, validación)

**Non-Goals:**
- Modificar `story.md` ni `design.md` — el skill es de solo lectura sobre esos artefactos
- Implementar ejecución automática de tareas (scope de `/opsx:apply`)
- Crear un template `tasks-template.md` nuevo — ya existe en `docs/specs/templates/`

## Decisions

**D1 — Template como fuente de verdad (no hardcoding):**
El skill lee `docs/specs/templates/tasks-template.md` en runtime. Sin fallback embebido: el AC-3 de la historia exige error explícito si el template no existe (un fallback silencioso ocultaría entornos mal configurados). Esto sigue el patrón #5 SDDF y es coherente con `story-creation` y `story-design`.

**D2 — Extracción dual `story.md` + `design.md`:**
Las tareas se derivan combinando ACs de `story.md` (trazabilidad de comportamiento) y componentes/interfaces de `design.md` (trazabilidad técnica). Alternativa descartada: derivar tareas solo de `design.md` — perdería la vinculación directa con los criterios de aceptación funcionales.

**D3 — Uso de `skill-master` en la implementación:**
El skill se crea invocando `/skill-master` para garantizar conformidad con el estándar SDDF: frontmatter YAML correcto, estructura de directorios, ejemplos input/output y validación mediante casos de prueba. Requerido por DoD del proyecto.

**D4 — Sin subagentes:**
El skill orquesta directamente (patrón #4 SDDF). La generación de `tasks.md` es una tarea con inputs bien definidos que no justifica delegación a agentes especializados.

## Risks / Trade-offs

- **[Riesgo] Calidad del ordenamiento por dependencias** → Mitigación: el ordenamiento sigue un esquema predecible (setup → componentes base → dependientes → tests → docs); los ejemplos en `examples/output/tasks.md` sirven como referencia de comportamiento esperado.
- **[Trade-off] Sin fallback de template** → A diferencia de `story-design`, este skill no tiene template embebido. Si `tasks-template.md` se elimina, el skill falla explícitamente. Esto es intencional: garantiza visibilidad del problema en lugar de generar output silenciosamente malformado.
- **[Riesgo] Dependencia de `design.md` previo** → Mitigación: el skill muestra un mensaje accionable con la sugerencia `/story-design` si `design.md` no existe, manteniendo el gate secuencial del workflow.
