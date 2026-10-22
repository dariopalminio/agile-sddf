---
alwaysApply: false
type: story
id: STORY-150
kind: feat
slug: STORY-150-migrar-los-skills-de-historia-a-specs-flow
title: "Migrar los skills de historia a specs/flow"
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-26-layout-y-flow-forward-mejorado
created: 2026-10-21
updated: 2026-10-21
related:
  - EPIC-26-layout-y-flow-forward-mejorado
---
[[EPIC-26-layout-y-flow-forward-mejorado]]

# 📖 Historia: Migrar los skills de historia a specs/flow

**Como** practitioner que especifica, planifica e implementa historias con SDDF
**Quiero** que los skills `story-*` (incluidos `story-specify`, `story-plan`, `story-implement` y sus subagentes) lean y escriban en `specs/flow/STORY-NNN-<slug>/` sin usar `SPECS_BASE`
**Para** que todo el ciclo de una historia ocurra en el layout fijo sin depender de configuración

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – story-specify en un repo limpio
```gherkin
Dado un repositorio limpio inicializado con "/sddf-init"
Cuando el usuario ejecuta "/story-specify" para una historia nueva
Entonces se crea "specs/flow/STORY-001-<slug>/story.md"
  Y no existe "docs/specs/stories/"
```

### AC-2 — Escenario principal – artefactos de planning e implementación
```gherkin
Dado una historia en "specs/flow/STORY-NNN-<slug>/story.md"
Cuando el usuario ejecuta "/story-plan" y luego "/story-implement" sobre ella
Entonces "design.md", "tasks.md", "testcases.md", "analyze.md" e "implement-report.md" se escriben en "specs/flow/STORY-NNN-<slug>/"
  Y la épica padre se lee desde "specs/flow/EPIC-NN-<slug>/epic.md"
```

### AC-3 — Escenario alternativo / error – sin referencias legadas
```gherkin
Dado los skills "story-*" y sus "assets/agents/" migrados
Cuando se ejecuta grep -rnE "SPECS_BASE|SDDF_ROOT" sobre "skills/story-*"
Entonces no hay coincidencias
  Y "npm run verify:repository" termina en verde
```

### AC-4 — Escenario alternativo – historia no encontrada
```gherkin
Dado que no existe "specs/flow/STORY-999-*/"
Cuando el usuario ejecuta "/story-plan STORY-999"
Entonces el skill informa que la historia no existe en "specs/flow/"
  Pero no busca ni crea nada en "docs/specs/"
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Evals actualizados:** los `evals/evals.json` de los skills `story-*` usan rutas `specs/flow/`; su ejecución (`npm run test:eval`) queda a criterio humano.
- **CNF-2 — Contrato:** todos los skills migrados declaran el contrato de layout fijo de STORY-148.

## Fuera de alcance (Non-Goals)

- Buscar historias en `specs/flow/archive/` desde los skills `story-*` (las historias archivadas están cerradas).
- Skills `epic-*` (STORY-151) y transversales (STORY-152).

## 📎 Notas / contexto adicional

Generado automáticamente desde la épica: `EPIC-26-layout-y-flow-forward-mejorado/epic.md`
Feature origen: STORY-150 — Migrar los skills de historia a specs/flow
Cubre parte de CS-2 y SMOKE-1. Depende de STORY-148. Historia amplia (≈18 skills): si `/story-evaluation` da S ≤ 2, considerar `/story-split` por grupo (especificación, planning, implementación/verificación).
