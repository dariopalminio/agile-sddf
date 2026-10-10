---
alwaysApply: false
type: story
id: STORY-111
kind: feat
slug: STORY-111-planning-escribe-roadmap
title: "project-planning escribe en product/roadmap.md y epic-from-project-plan lee de allÃ­"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
created: 2026-10-05
updated: 2026-10-05
related:
  - EPIC-21-colapsar-specs-dos-niveles
  - ADR-0013-eliminar-specs-01-projects
  - STORY-106-migrar-plan-a-roadmap
---
<!-- Referencias -->
[[EPIC-21-colapsar-specs-dos-niveles]]
[[ADR-0013-eliminar-specs-01-projects]]

# ðŸ“– Historia: `project-planning` escribe en `product/roadmap.md` y `epic-from-project-plan` lee de allÃ­

**Como** desarrollador que planifica las Ã©picas de un proyecto con `/project-planning` y luego las genera con `/epic-from-project-plan`  
**Quiero** que el plan de Ã©picas se escriba en `docs/product/roadmap.md` y que la generaciÃ³n de Ã©picas lo lea desde allÃ­  
**Para** tener el roadmap del producto como Ãºnica fuente del plan de Ã©picas, sin un `project-plan.md` en `specs/01-projects/` que se desactualice respecto de las Ã©picas reales

## âœ… Criterios de aceptaciÃ³n

### AC-1 â€” Escenario principal â€“ El plan se escribe en el roadmap
```gherkin
Dado que "docs/requirements/functional/" contiene al menos un requisito "FR-*"
  Y "docs/product/roadmap.md" no existe
Cuando el desarrollador completa "/project-planning" y confirma el resultado
Entonces "docs/product/roadmap.md" contiene la propuesta de Ã©picas con su objetivo, historias y criterios de Ã©xito
  Y no se crea "project-plan.md" ni el directorio "docs/specs/01-projects/"
```

### AC-2 â€” Escenario alternativo â€“ Replanificar sobre un roadmap existente
```gherkin
Dado que "docs/product/roadmap.md" ya contiene la lista de Ã©picas reales y la secciÃ³n "Plan original (2026-04-20)"
Cuando el desarrollador ejecuta "/project-planning" para planificar Ã©picas nuevas
Entonces la propuesta nueva se agrega al roadmap con su fecha
  Pero la lista de Ã©picas reales y la secciÃ³n "Plan original (2026-04-20)" quedan sin cambios
```

### AC-3 â€” Escenario principal â€“ Las Ã©picas se generan desde el roadmap
```gherkin
Dado que "docs/product/roadmap.md" contiene una propuesta con 3 Ã©picas que aÃºn no existen en "docs/specs/epics/"
Cuando el desarrollador ejecuta "/epic-from-project-plan"
Entonces se crean 3 directorios "EPIC-NN-<slug>/" con su "epic.md", numerados a partir del mayor "EPIC-NN" existente
  Pero si "docs/product/roadmap.md" no existe, el skill no crea nada y muestra un mensaje que indica ejecutar "/project-planning"
```

## âš™ï¸ Criterios no funcionales especÃ­ficos

- **CNF-1 â€” Sin rutas del modelo de proyectos:** "01-projects", "project-plan.md" (como ruta) y "PROJ-" no aparecen en `skills/project-planning/`, `skills/epic-from-project-plan/` ni en las secciones de planning de `agents/project-architect.agent.md`; los evals de ambos skills pasan con `npm run test:eval`.
- **CNF-2 â€” Template como Ãºnica fuente de estructura:** la estructura del roadmap se deriva en runtime de un template en `docs/templates/` que reemplaza a `project-plan-template.md`.
- **CNF-3 â€” Encoding:** `roadmap.md` se escribe en UTF-8 sin BOM.

## Fuera de alcance (Non-Goals)

- Renombrar `epic-from-project-plan` (por ejemplo, a `epic-from-roadmap`): renombrar un skill publicado es un cambio aparte que necesita su propia decisiÃ³n y alias de compatibilidad.
- Mantener sincronizado el `status` de las Ã©picas reales en el roadmap cuando cambian: el roadmap registra lo planificado y la foto que dejÃ³ STORY-106.
- Crear el `roadmap.md` de este repositorio: STORY-106.

## ðŸ“Ž Notas / contexto adicional

- **Origen:** [[ADR-0013-eliminar-specs-01-projects]]: "`project-plan.md` (epic slicing) â†’ `docs/product/roadmap.md`" y "el roadmap en `product/roadmap.md` lista los Epics planificados".
- **Entradas de `project-planning`:** hoy lee `project.md` (precondiciÃ³n `substatus: DONE`), `project-intent.md` y, si existe, `story-map.md`. Pasa a leer `requirements/`, `product/vision.md` y `product/story-map.md`. La precondiciÃ³n pasa a ser "existe al menos un FR".
- **Rutas de Ã©picas:** AC-3 usa `docs/specs/epics/` porque STORY-108 hace el renombrado; si esta historia se ejecuta antes, aplica igual sobre `02-epics/`.
- **ResoluciÃ³n de proyecto:** desaparece la bÃºsqueda de `PROJ-NN` activo en `01-projects/` en ambos skills.
