---
alwaysApply: false
type: epic
id: EPIC-21
slug: EPIC-21-colapsar-specs-dos-niveles
title: "Colapsar specs/ a dos niveles y eliminar 01-projects/"
status: DEFINE
substatus: IN-PROGRESS
parent: null
created: 2026-10-05
updated: 2026-10-07
related:
  - EPIC-20-memory-system
  - EPIC-19-framework-consistency
---
<!-- Referencias -->
[[EPIC-20-memory-system]]
[[EPIC-19-framework-consistency]]

# Épica: Colapsar `specs/` a dos niveles y eliminar `01-projects/`

## Alcance
Eliminar `docs/specs/01-projects/` migrando su contenido a `product/`, `requirements/` y `architecture/`, y quitar los prefijos numéricos de `specs/`, dejando solo `specs/epics/` y `specs/stories/`. Se elimina así la duplicación entre `specs/01-projects/` y `product/`, con una única fuente de verdad para la visión y el plan del producto. Incluye actualizar skills, documentación y scaffolding de `memory-system`, y ofrecer migración automática para repos existentes: es un breaking change que exige major version bump.

## Historias
- [x] **STORY-103** — Reemplazar el template de Epic por la versión minimalista y output-oriented: asegurar que los nuevos Epics sigan el formato simplificado y enfocado en resultados.
- [ ] **STORY-104** — Migrar `project-intent.md` a `product/vision.md`: consolidar la intención del proyecto en la visión de producto existente, sin pérdida semántica (objetivo, visión, intención) y con wikilinks actualizados.
- [ ] **STORY-105** — Migrar `project.md` a `product/stakeholders.md` y `requirements/`: repartir stakeholders y requisitos funcionales/no funcionales en sus nuevos hogares, sin pérdida semántica.
- [ ] **STORY-106** — Migrar `project-plan.md` a `product/roadmap.md`: trasladar el plan de épicas al roadmap de producto, sin pérdida semántica.
- [ ] **STORY-107** — Migrar `story-map.md` y `context-diagram.puml`: mover `story-map.md` a `docs/product/story-map.md` y `context-diagram.puml` a `docs/architecture/context-diagram.puml`, actualizando referencias.
- [ ] **STORY-108** — Renombrar `specs/02-epics/` → `specs/epics/` y `specs/03-stories/` → `specs/stories/`: eliminar prefijos numéricos y actualizar referencias, dejando `01-projects/` eliminado.
- [ ] **STORY-109** — project-begin + project-pm → vision.md: El substatus de vision.md reemplaza al "proyecto activo" PROJ-NN: TODO hace la entrevista completa, IN-PROGRESS retoma, DONE ofrece Actualizar o Cancelar.
- [ ] **STORY-110** — project-discovery + reverse-engineering + 3 agentes → stakeholders.md + un archivo por FR/NFR: Los IDs nuevos continúan la secuencia (FR-055…) sin sobrescribir los existentes. Si vision.md no está en DONE, se detiene y pide correr /project-begin.
- [ ] **STORY-111** — project-planning → roadmap.md; epic-from-project-plan lee de allí: Replanificar agrega una propuesta nueva sin tocar la lista de épicas reales ni el plan original.
- [ ] **STORY-112** — project-story-mapping → product/; project-context-diagram → architecture/c4/: --from-files lee las capas en vez de project.md. Si el diagrama ya existe, pide confirmación antes de sobrescribir.
- [ ] **STORY-113** — project-flow, sddf-init, header-aggregation: retoma por etapa según el estado de las capas. Cierre: "01-projects" solo queda en la lógica de migración de memory-system.
- [ ] **STORY-114** — Implementar `memory-system migrate --from=specs-3-levels`: modo de migración que automatiza el colapso en repos existentes, idempotente y con `--dry-run`.
- [ ] **STORY-115** — Actualizar scaffolding de `memory-system`: crear `specs/epics/` y `specs/stories/` en lugar de los tres niveles numerados.
- [ ] **STORY-116** — Actualizar documentación canónica: `memory-system.md`, `sddf-architecture.md`, `domain-*`, `docs/specs/README.md`, `README` y `CHANGELOG` (breaking change con guía de migración).
- [ ] **STORY-117** — Actualizar `sddf.config.yaml` y verificar los tres modos SDD: eliminar rutas a `02-epics/` o `03-stories/` si existen y comprobar que Intent-First, Spec-Anchored y Spec-as-Source funcionan con la nueva estructura.
- [ ] **STORY-118** — Adoptar la estrategia "SRS único primero, fragmentación cuando duela" en `requirements/`: implementar la estrategia en el framework, actualizar documentación y scaffolding, y ofrecer migración automática para proyectos existentes.

## Criterios de salida
- [ ] `docs/specs/01-projects/` no existe en el repositorio del framework.
- [ ] `docs/specs/` contiene exactamente dos carpetas de artefactos: `epics/` y `stories/` (más `README.md`).
- [ ] `docs/product/` contiene `vision.md`, `stakeholders.md`, `roadmap.md` y `story-map.md`.
- [ ] `docs/architecture/` contiene `context-diagram.puml`.
- [ ] `docs/requirements/` contiene `functional/` y `non-functional/` poblados.
- [ ] Ningún skill ni agente referencia `specs/01-projects/`, `specs/02-epics/` ni `specs/03-stories/`.
- [ ] `memory-system migrate --from=specs-3-levels --dry-run` reporta "0 cambios pendientes" tras la migración.
- [ ] `memory-system check` devuelve exit code 0.
- [ ] Todas las épicas e historias existentes siguen siendo navegables por wikilinks.
- [ ] `CHANGELOG.md` documenta el breaking change con guía de migración.
- [ ] Los tres modos SDD (Intent-First, Spec-Anchored, Spec-as-Source) funcionan con la nueva estructura.

## Smoke tests
*Si alguno de estos falla, se debe detener el despliegue (o se debe hacer rollback automático).*

### SMOKE-1 — Scaffolding limpio crea solo dos niveles en `specs/`
```gherkin
Escenario: Scaffolding limpio crea solo dos niveles en `specs/`
  Dado un proyecto vacío sin `docs/`
  Cuando ejecuto `/memory-system scaffold`
  Entonces se crean `docs/specs/epics/` y `docs/specs/stories/`, NO se crean `docs/specs/01-projects/`, `02-epics/` ni `03-stories/`, se crean `docs/product/{vision,stakeholders,roadmap}.md` y se crean `docs/requirements/{functional,non-functional}/`
```

### SMOKE-2 — Migración de un repo de tres niveles
```gherkin
Escenario: Migración de un repo de tres niveles
  Dado un repo con `docs/specs/{01-projects,02-epics,03-stories}/`
  Cuando ejecuto `/memory-system migrate --from=specs-3-levels`
  Entonces el contenido de `01-projects/` se migra a `product/`, `requirements/` y `architecture/`, `02-epics/` se renombra a `epics/`, `03-stories/` se renombra a `stories/`, ningún wikilink queda roto y ningún archivo se pierde
```

### SMOKE-3 — Navegabilidad intacta tras el colapso
```gherkin
Escenario: Navegabilidad intacta tras el colapso
  Dado un repo con épicas e historias existentes
  Cuando se ejecuta la migración completa
  Entonces todos los wikilinks `[[EPIC-NN-*]]` y `[[STORY-NNN-*]]` resuelven, los frontmatters mantienen sus referencias `parent`/`related` y `docs/index.md` se regenera correctamente
```

## Notas
- **Breaking change:** requiere major version bump (`3.x.x → 4.0.0`; versión actual `3.3.1`).
- **Precedente:** `ADR-0013-eliminar-specs-01-projects` debe documentar la decisión y el rationale (hoy el archivo existe pero está vacío; completarlo antes de iniciar la épica).
- **Caso multi-proyecto:** se asume el caso común (un solo proyecto por raíz `docs/`). El caso multi-proyecto se abordará en un ADR separado si surge la necesidad.
- **Orden de implementación sugerido:** primero skills y scaffolding, luego migración, luego documentación, de modo que cada historia deje el repo en estado consistente.
- **Actualizar skills que referencian rutas de `specs/`:** `project-*`, `memory-system`, `epic-*`, `story-*`, `skill-preflight`, `sddf-init` y cualquier skill o agente que use rutas de `01-projects/`, `02-epics/` o `03-stories/`. Son las 5 historias STORY-109 a STORY-113, cada una con su flujo de skill + agente + template, simplificando el mecanismo de proyecto activo WIP por el uso del substatus del documento destino para decidir entre retomar o empezar.
- **Autorreferencia:** esta propia épica vive en `02-epics/` y será movida por la historia de renombrado; los wikilinks por slug no dependen de la ruta.
- **Dependencias entre historias:**

| # | Historia | Depende de |
|---|----------|------------|
| 1 | Migrar `project-intent.md` a `product/vision.md` | — |
| 2 | Migrar `project.md` a `product/stakeholders.md` y `requirements/` | — |
| 3 | Migrar `project-plan.md` a `product/roadmap.md` | — |
| 4 | Migrar `story-map.md` y `context-diagram.puml` | — |
| 5 | Renombrar `02-epics/` y `03-stories/` | 1, 2, 3, 4 |
| 6 | Actualizar skills que referencian rutas de `specs/` | 5 |
| 7 | Implementar `memory-system migrate --from=specs-3-levels` | 5 |
| 8 | Actualizar scaffolding de `memory-system` | 5 |
| 9 | Actualizar documentación canónica | 6, 7, 8 |
| 10 | Actualizar `sddf.config.yaml` y verificar los tres modos SDD | 6, 7, 8 |
