---
alwaysApply: false
type: epic
id: EPIC-21
slug: EPIC-21-colapsar-specs-dos-niveles
title: "Colapsar specs/ a dos niveles y eliminar 01-projects/"
status: VALIDATE
substatus: IN-PROGRESS
parent: null
created: 2026-10-05
updated: 2026-10-13
related:
  - EPIC-20-memory-system
  - EPIC-19-framework-consistency
  - EPIC-22-epic-analyze
---
<!-- Referencias -->
[[EPIC-20-memory-system]]
[[EPIC-19-framework-consistency]]
[[EPIC-22-epic-analyze]]

# Épica: Colapsar `specs/` a dos niveles y eliminar `01-projects/`

## Alcance
Eliminar `docs/specs/01-projects/` migrando su contenido a `product/`, `requirements/` y `architecture/`, y quitar los prefijos numéricos de `specs/`, dejando solo `specs/epics/` y `specs/stories/`. Se elimina así la duplicación entre `specs/01-projects/` y `product/`, con una única fuente de verdad para la visión y el plan del producto. Incluye actualizar skills, documentación y scaffolding de `memory-system`, y ofrecer migración automática para repos existentes: es un breaking change que exige major version bump.

## Historias

### Historias específicas para colapsar `specs/` a dos niveles y eliminar `01-projects/`
- [x] **STORY-103** — Reemplazar el template de Epic por la versión minimalista y output-oriented: asegurar que los nuevos Epics sigan el formato simplificado y enfocado en resultados.
- [x] **STORY-104** — Migrar `project-intent.md` a `product/vision.md`: consolidar la intención del proyecto en la visión de producto existente, sin pérdida semántica (objetivo, visión, intención) y con wikilinks actualizados.
- [x] **STORY-105** — Migrar `project.md` a `product/stakeholders.md` y `requirements/`: repartir stakeholders y requisitos funcionales/no funcionales en sus nuevos hogares, sin pérdida semántica.
- [x] **STORY-106** — Migrar `project-plan.md` a `product/roadmap.md`: trasladar el plan de épicas al roadmap de producto, sin pérdida semántica.
- [x] **STORY-107** — Migrar `story-map.md` y `context-diagram.puml`: mover `story-map.md` a `docs/product/story-map.md` y `context-diagram.puml` a `docs/architecture/c4/context-diagram.puml`, actualizando referencias.
- [x] **STORY-108** — Renombrar `specs/epics/` y `specs/stories/`: eliminar prefijos numéricos y actualizar referencias, dejando `01-projects/` eliminado.
- [x] **STORY-109** — project-begin + project-pm → vision.md: El substatus de vision.md reemplaza al "proyecto activo" PROJ-NN: TODO hace la entrevista completa, IN-PROGRESS retoma, DONE ofrece Actualizar o Cancelar.
- [x] **STORY-110** — project-discovery + reverse-engineering + 3 agentes → stakeholders.md + un archivo por FR/NFR: Los IDs nuevos continúan la secuencia (FR-055…) sin sobrescribir los existentes. Si vision.md no está en DONE, se detiene y pide correr /project-begin.
- [x] **STORY-111** — project-planning → roadmap.md; epic-from-project-plan lee de allí: Replanificar agrega una propuesta nueva sin tocar la lista de épicas reales ni el plan original.
- [x] **STORY-112** — project-story-mapping → product/; project-context-diagram → architecture/c4/: --from-files lee las capas en vez de project.md. Si el diagrama ya existe, pide confirmación antes de sobrescribir.
- [x] **STORY-113** — project-flow, sddf-init, header-aggregation: retoma por etapa según el estado de las capas. Cierre: "01-projects" solo queda en la lógica de migración de memory-system.
- [x] **STORY-114** — Implementar `memory-system migrate --from=specs-3-levels`: modo de migración que automatiza el colapso en repos existentes, idempotente y con `--dry-run`.
- [x] **STORY-115** — Actualizar scaffolding de `memory-system`: crear `specs/epics/` y `specs/stories/` en lugar de los tres niveles numerados.
- [x] **STORY-116** — Actualizar documentación canónica: `memory-system.md`, `sddf-architecture.md`, `domain-*`, `docs/specs/README.md`, `README` y `CHANGELOG` (breaking change con guía de migración).
- [x] **STORY-117** — Actualizar `sddf.config.yaml` y verificar los tres modos SDD: eliminar rutas a `02-epics/` o `03-stories/` si existen y comprobar que Intent-First, Spec-Anchored y Spec-as-Source funcionan con la nueva estructura.
- [x] **STORY-123** — Reubicar las secciones restantes de `project.md` y eliminarlo: trasladar las secciones que ADR-0013 no asigna (§1.1–1.7, §2.3, §3, §4, §11, §12 y apéndices) a su capa y eliminar `project.md`, dejando `docs/specs/01-projects/` vacía y eliminada.
- [x] **STORY-119** — Story-plan con un subagente por paso: cancelada el 2026-10-10 por decisión del usuario; sus cambios de implementación se revirtieron.
- [x] **STORY-118** — Adoptar la estrategia "SRS único primero, fragmentación cuando duela" en `requirements/`: implementar la estrategia en el framework, actualizar documentación y scaffolding, y ofrecer migración automática para proyectos existentes.

## Seguimiento pendiente para VALIDATE (fase QUALITY)

- [x] Repetir `npm run test:eval -- project-begin --eval-runner codex` y confirmar los seis casos de STORY-109 cuando se repare el YAML inválido que el runner carga desde un ejemplo ajeno de `security-audit`. Esta verificación se cierra por excepción aprobada en STORY-109 el 2026-10-10. — 2026-10-13: sigue bloqueado (YAML sin reparar, `spawn codex ENOENT` en Windows y cuota de codex agotada). ---> No hay evidencia de que el flujo funcional de project-begin esté roto
- [x] Ejecutar TC-007…TC-011 de `epic-from-project-plan` cuando se autorice enviar prompts al runner externo; STORY-111 implementó y validó los seis casos iniciales.
- [x] Ejecutar `npm run test:eval -- project-story-mapping` y `npm run test:eval -- project-context-diagram`, confirmar exit 0 con todos los casos aprobados y, si alguno falla, ajustar el skill o el agente (no las aserciones) y repetir. Validación futura trasladada desde STORY-112 (contrato #7, AC-1, AC-2, AC-3, CNF-1). — 2026-10-13: 6/6 y 7/7 tras corregir el contrato de consola de `project-story-mapping` (ver [validate-report.md](validate-report.md)).
- [x] QA de EPIC-21 — ejecutar `npm run test:eval -- memory-system --only TC-023,TC-024 --eval-runner codex` y aprobar ambos casos. Si alguno falla, reparar el skill, el motor o el runner sin modificar las aserciones y repetir; registrar el resultado por caso. Origen: T032 de [[STORY-114-migrate-specs-3-levels]]; la validación del manifiesto e inventario ya está aprobada. — 2026-10-13: sin ejecutar, por la cuota de codex agotada.

- [x] QA de EPIC-21 — ejecutar los 23 evals de `project-flow`, `sddf-init` y `header-aggregation` con `npm run test:eval -- <skill>` y registrar el resultado por caso. Origen: T024 de STORY-113; requiere un runner local operativo. — 2026-10-13: 8/8, 10/10 y 5/5 tras corregir el contrato de consola de `project-flow` y `header-aggregation` (ver [validate-report.md](validate-report.md)).
- [x] QA de EPIC-21 — ejecutar la prueba E2E interactiva de `/sddf-init` seguido de `/project-flow` en un repositorio temporal y confirmar que no se crea `01-projects/`, pero sí `product/`, `requirements/` y `product/roadmap.md`. Origen: T027 de STORY-113; requiere entrevista de intención y confirmación humana de los gates. — 2026-10-13: aprobado con gates confirmados por el usuario (ver [validate-report.md](validate-report.md)).
- [x] QUALITY-STORY-116 — Registrar la validación manual de los flujos F-1 a F-3: recorrer `README.md` → `[[domain-work-item-hierarchy]]` → `[[domain-foundational-docs-lifecycle]]` → `[[state-machine]]` y registrar la confirmación de un único modelo de dos niveles, y de que `[[domain-project-lifecycle]]` remite al sucesor (AC-1); recorrer `CHANGELOG.md › [Unreleased] › BREAKING` → guía de migración y registrar rutas, hogares, skills, 4.0.0 y la secuencia `--dry-run` → ejecución real (AC-3); registrar que ADR-0004 y ADR-0013 se cambian en el mismo commit (AC-2). Trasladada desde T038 de [[STORY-116-documentar-modelo-dos-niveles]]. — 2026-10-13: F-2 y F-3 cumplidos; F-1 cumplido tras enlazar la jerarquía y corregir el árbol del README (ver [validate-report.md](validate-report.md)).

## Criterios de salida
- [x] `docs/specs/01-projects/` no existe en el repositorio del framework.
- [x] `docs/specs/` contiene exactamente dos carpetas de artefactos: `epics/` y `stories/` (más `README.md`).
- [x] `docs/product/` contiene `vision.md`, `stakeholders.md`, `roadmap.md` y `story-map.md`.
- [x] `docs/architecture/c4/` contiene `context-diagram.puml` y su render `context-diagram.png`.
- [x] `docs/requirements/` contiene `functional/` y `non-functional/` poblados o un documento srs de especificación de requerimientos.
- [x] Ningún skill ni agente referencia `specs/01-projects/`, `specs/02-epics/` ni `specs/03-stories/`.
- [x] `memory-system migrate --from=specs-3-levels --dry-run` reporta "0 cambios pendientes" tras la migración.
- [x] `memory-system check` devuelve exit code 0.
- [x] Todas las épicas e historias existentes siguen siendo navegables por wikilinks.
- [x] `CHANGELOG.md` documenta el breaking change con guía de migración.

## Smoke tests
*Si alguno de estos falla, se debe detener el despliegue (o se debe hacer rollback automático).*

### SMOKE-1 — Scaffolding limpio crea solo dos niveles en `specs/`
```gherkin
Escenario: Scaffolding limpio crea solo dos niveles en `specs/`
  Dado un proyecto vacío sin `docs/`
  Cuando ejecuto `/memory-system scaffold`
  Entonces se crean `docs/specs/epics/` y `docs/specs/stories/`, NO se crean `docs/specs/01-projects/`, `02-epics/` ni `03-stories/`, se crean `docs/product/{vision,stakeholders,roadmap}.md` y se crea `docs/requirements/srs-<project-slug>.md` (SRS único, sin carpetas `functional/` ni `non-functional/` vacías)
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
- **Actualizar skills que referencian rutas de `specs/`:** `project-*`, `memory-system`, `epic-*`, `story-*`, `skill-preflight`, `sddf-init` y cualquier skill o agente que use rutas de `01-projects/`. STORY-108 ya actualiza las rutas de épicas e historias. Son las 5 historias STORY-109 a STORY-113, cada una con su flujo de skill + agente + template, simplificando el mecanismo de proyecto activo WIP por el uso del substatus del documento destino para decidir entre retomar o empezar.
- **Modos SDD verificables:** Spec-as-Source queda fuera del criterio de salida porque el framework no ofrece un flujo que edite solo la especificación y regenere el código; su compatibilidad estructural se analiza en el insight de la épica (ver STORY-117). "Spec-First" es el término de `docs/guides/sdd.md` y `docs/constitution.md` para lo que antes se llamaba "Intent-First".
- **Historias trasladadas:** STORY-120 a STORY-122 (`epic-analyze`) se movieron a [[EPIC-22-epic-analyze]] para aumentar la cohesión.
- **Autorreferencia:** esta propia épica vive en `02-epics/` y será movida por la historia de renombrado; los wikilinks por slug no dependen de la ruta.
- **Dependencias entre historias:**

| # | Historia | Depende de |
|---|----------|------------|
| 1 | Migrar `project-intent.md` a `product/vision.md` | — |
| 2 | Migrar `project.md` a `product/stakeholders.md` y `requirements/` | — |
| 3 | Migrar `project-plan.md` a `product/roadmap.md` | — |
| 4 | Migrar `story-map.md` y `context-diagram.puml` | — |
| 5 | Renombrar `02-epics/` y `03-stories/` | 1, 2, 3, 4, 12 |
| 6 | Actualizar skills que referencian rutas de `specs/` | 5 |
| 7 | Implementar `memory-system migrate --from=specs-3-levels` | 5 |
| 8 | Actualizar scaffolding de `memory-system` | 5 |
| 9 | Actualizar documentación canónica | 6, 7, 8 |
| 10 | Actualizar `sddf.config.yaml` y verificar los tres modos SDD | 6, 7, 8 |
| 11 | Reubicar las secciones restantes de `project.md` y eliminarlo | 2 |
