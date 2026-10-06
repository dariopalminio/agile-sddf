---
alwaysApply: false
type: story
id: STORY-113
kind: feat
slug: STORY-113-project-flow-sin-01-projects
title: "project-flow, sddf-init y header-aggregation sin specs/01-projects/"
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-21-colapsar-specs-dos-niveles
created: 2026-10-05
updated: 2026-10-05
related:
  - EPIC-21-colapsar-specs-dos-niveles
  - ADR-0013-eliminar-specs-01-projects
  - STORY-109-project-begin-escribe-vision
  - STORY-110-discovery-escribe-stakeholders-y-requisitos
  - STORY-111-planning-escribe-roadmap
---
<!-- Referencias -->
[[EPIC-21-colapsar-specs-dos-niveles]]
[[ADR-0013-eliminar-specs-01-projects]]

# 📖 Historia: `project-flow`, `sddf-init` y `header-aggregation` sin `specs/01-projects/`

**Como** desarrollador que arranca un proyecto nuevo con `/sddf-init` y recorre el pipeline completo con `/project-flow`  
**Quiero** que el orquestador detecte en qué etapa estoy a partir de `vision.md`, `requirements/` y `roadmap.md`, y que ningún skill vuelva a crear o leer `specs/01-projects/`  
**Para** poder completar o retomar el pipeline de proyecto en un repositorio con la estructura de dos niveles sin errores por rutas inexistentes

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Pipeline completo sobre la estructura nueva
```gherkin
Dado un repositorio recién inicializado con "/sddf-init" en el que no existe "docs/specs/01-projects/"
Cuando el desarrollador recorre "/project-flow" de principio a fin confirmando cada gate
Entonces quedan completos "docs/product/vision.md", "docs/product/stakeholders.md", los requisitos de "docs/requirements/" y "docs/product/roadmap.md"
  Y en ningún momento se crea "docs/specs/01-projects/"
```

### AC-2 — Escenario alternativo – Retoma por etapa
```gherkin
Escenario: "/project-flow" detecta la etapa a retomar
  Dado que el repositorio está en el estado "<estado>"
  Cuando el desarrollador ejecuta "/project-flow"
  Entonces el orquestador retoma en la etapa "<etapa>"
Ejemplos:
  | estado                                                              | etapa     |
  | "vision.md" con "substatus" distinto de DONE                        | Begin     |
  | "vision.md" en DONE y "requirements/functional/" vacío              | Discovery |
  | "vision.md" en DONE, con requisitos "FR-*" y sin "roadmap.md"       | Planning  |
```

### AC-3 — Escenario de cierre – Ningún skill depende de `01-projects/`
```gherkin
Dado que STORY-109 a STORY-112 y este cambio están aplicados
Cuando se busca "01-projects" en "skills/" y "agents/"
Entonces solo aparece en la lógica de migración de "memory-system" que detecta la estructura antigua
  Y "/sddf-init" sobre un directorio vacío no crea "docs/specs/01-projects/"
  Y "/header-aggregation" asigna el "type" de un archivo de "docs/product/" o "docs/requirements/" según su capa
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Gates humanos intactos:** `project-flow` conserva la confirmación del usuario entre etapas; solo cambia de dónde lee el estado.
- **CNF-2 — Evals:** los evals de `project-flow`, `sddf-init` y `header-aggregation` pasan con `npm run test:eval`.

## Fuera de alcance (Non-Goals)

- `memory-system scaffold` y `memory-system migrate --from=specs-3-levels`: tienen sus propias historias en EPIC-21. La excepción de AC-3 existe para no bloquear esa migración.
- Rutas `02-epics`/`03-stories` y la lista de directorios que exige `skill-preflight`: STORY-108.
- Cambios internos de cada etapa (qué escribe `project-begin`, `project-discovery`, `project-planning`): STORY-109, STORY-110 y STORY-111.

## 📎 Notas / contexto adicional

- **Origen:** [[ADR-0013-eliminar-specs-01-projects]], consecuencia "Simplificación del scaffolding... `project-flow` ya no necesita gestionar los tres documentos fundacionales como work items".
- **Estado actual de `project-flow`:** detecta la etapa leyendo el `substatus` de `01-projects/project-intent.md`, `project.md` y `project-plan.md` (27 referencias a `01-projects`). La tabla de AC-2 lo reemplaza por el estado de las capas.
- **Dependencia:** AC-1 y AC-3 requieren STORY-109 a STORY-112, porque `project-flow` invoca esas etapas. Es la historia de cierre del bloque de skills; la parte de `sddf-init` y `header-aggregation` es independiente.
- **`header-aggregation`:** hoy infiere `type: project` por la ruta `01-projects/`; debe inferir `type: product` en `product/` y el tipo que defina la capa `requirements/` para FR/NFR.
