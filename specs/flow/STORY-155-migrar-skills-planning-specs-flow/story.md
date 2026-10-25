---
alwaysApply: false
type: story
id: STORY-155
kind: feat
slug: STORY-155-migrar-skills-planning-specs-flow
title: "Migrar los skills de planning a specs/flow"
status: VERIFY
substatus: DONE
parent: EPIC-26-layout-y-flow-forward-mejorado
created: 2026-10-22
updated: 2026-10-25
related:
  - EPIC-26-layout-y-flow-forward-mejorado
  - STORY-148-contrato-de-rutas-fijas-y-gate-determinista
  - STORY-150-migrar-skills-especificacion-specs-flow
  - STORY-156-migrar-skills-implementacion-specs-flow
  - STORY-158-migrar-skills-verificacion-specs-flow
---
[[EPIC-26-layout-y-flow-forward-mejorado]]

# 📖 Historia: Migrar los skills de planning a specs/flow

**Como** practitioner que planifica historias con SDDF
**Quiero** ejecutar `/story-plan` sobre una historia del layout fijo y obtener su plan completo (diseño, tareas, casos de prueba y análisis)
**Para** que un repo recién inicializado planifique una historia sin `sddf.config.yaml` ni `SDDF_ROOT`

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – artefactos de planning por skill
```gherkin
Escenario: <skill> lee y escribe en el layout fijo
  Dado una historia en "specs/flow/STORY-NNN-<slug>/story.md" con su épica padre en "specs/flow/EPIC-NN-<slug>/epic.md"
  Cuando el usuario ejecuta "/<skill>" sobre ella
  Entonces "<artefacto>" se escribe en "specs/flow/STORY-NNN-<slug>/"
    Y toda lectura de la épica padre se hace desde "specs/flow/EPIC-NN-<slug>/epic.md"

  Ejemplos:
    | skill           | artefacto                                        |
    | story-design    | design.md                                        |
    | story-tasking   | tasks.md                                         |
    | story-testcases | testcases.md                                     |
    | story-analyze   | analyze.md                                       |
    | story-fix-plan  | fix-plan-report.md                               |
    | story-plan      | design.md, tasks.md, testcases.md y analyze.md   |
```

### AC-2 — Escenario alternativo – historia no encontrada
```gherkin
Dado que no existe "specs/flow/STORY-999-*/"
Cuando el usuario ejecuta "/story-plan STORY-999"
Entonces el skill informa que la historia no existe en "specs/flow/"
  Pero no busca ni crea nada en "docs/specs/"
```

### AC-3 — Escenario alternativo / error – sin referencias legadas
```gherkin
Dado los skills de planning y sus "assets/agents/" migrados
Cuando se ejecuta grep -rnE "SPECS_BASE|SDDF_ROOT" sobre ellos
Entonces no hay coincidencias
Cuando se ejecuta "npm run verify:repository"
Entonces termina en verde
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Evals actualizados:** los `evals/evals.json` de los skills de esta historia usan rutas `specs/flow/`; su ejecución (`npm run test:eval`) queda a criterio humano.
- **CNF-2 — Contrato:** todos los skills migrados declaran el contrato de layout fijo de STORY-148.
- **CNF-3 — Medida de completitud:** 0 coincidencias de `SPECS_BASE|SDDF_ROOT` en los 6 skills de planning (`story-design`, `story-tasking`, `story-testcases`, `story-analyze`, `story-fix-plan`, `story-plan`) y en sus `assets/agents/`.

## Fuera de alcance (Non-Goals)

- Skills de especificación (STORY-150), de implementación (STORY-156) y de revisión, verificación y aceptación (STORY-158).
- Buscar historias en `specs/flow/archive/` (las historias archivadas están cerradas).
- Skills `epic-*` (STORY-151) y transversales (STORY-152).

## 📎 Notas / contexto adicional

Feature origen: STORY-150 — Migrar los skills de historia a specs/flow (dividida con `/story-split`, patrón 1 — pasos del flujo de trabajo).

Alcance: los seis skills `story-design`, `story-tasking`, `story-testcases`, `story-analyze`, `story-fix-plan` y `story-plan`, más sus `assets/agents/` y `evals/evals.json`. Cubre la parte de planning de CS-2 y SMOKE-1.

**Precondición (bloqueo):** STORY-148 debe estar entregada antes de implementar esta historia, porque define el contrato de rutas fijas y el gate determinista que los skills migrados declaran (CNF-2).

**Independencia respecto de las hermanas:** STORY-150, STORY-151 y STORY-156 pueden entregarse en cualquier orden respecto de esta historia. La lectura de la épica padre se prueba sin esperar a STORY-151 mediante una épica fixture en `specs/flow/EPIC-NN-<slug>/epic.md`.

**Decisiones abiertas para `design.md`:** las rutas de los criterios son ilustrativas del layout fijo; la forma de resolverlas en cada skill (convención del propio skill o fragmento compartido) y el tratamiento de agentes con rutas distintas se deciden en el diseño. Si el diseño revela más de un patrón de migración, evaluar `/story-split`.
