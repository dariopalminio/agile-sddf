---
alwaysApply: false
type: story
id: STORY-112
kind: feat
slug: STORY-112-story-map-y-diagrama-en-sus-capas
title: "project-story-mapping y project-context-diagram escriben en product/ y architecture/c4/"
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-21-colapsar-specs-dos-niveles
created: 2026-10-05
updated: 2026-10-05
related:
  - EPIC-21-colapsar-specs-dos-niveles
  - ADR-0013-eliminar-specs-01-projects
  - STORY-107-migrar-story-map-y-diagrama-contexto
---
<!-- Referencias -->
[[EPIC-21-colapsar-specs-dos-niveles]]
[[ADR-0013-eliminar-specs-01-projects]]

# 📖 Historia: `project-story-mapping` y `project-context-diagram` escriben en `product/` y `architecture/c4/`

**Como** desarrollador o arquitecto que produce el story map con `/project-story-mapping` o el diagrama de contexto C4 con `/project-context-diagram`  
**Quiero** que el story map se escriba en `docs/product/story-map.md` y el diagrama en `docs/architecture/c4/context-diagram.puml`, tomando el contexto de `product/` y `requirements/`  
**Para** que cada artefacto nazca en la capa donde se consulta, sin volver a crear copias en `specs/01-projects/` que dupliquen las de `product/` y `architecture/c4/`

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – El story map se escribe en la capa de producto
```gherkin
Dado que "docs/product/vision.md" y "docs/product/stakeholders.md" tienen contenido
  Y "docs/requirements/functional/" contiene requisitos "FR-*"
Cuando el desarrollador completa la sesión de "/project-story-mapping"
Entonces "docs/product/story-map.md" contiene las personas, el backbone, el walking skeleton y los release slices
  Y no se crea "docs/specs/01-projects/"
```

### AC-2 — Escenario principal – El diagrama de contexto se genera desde las capas
```gherkin
Dado que "docs/product/stakeholders.md" y "docs/requirements/" describen actores y sistemas externos
Cuando el arquitecto ejecuta "/project-context-diagram --from-files"
Entonces se escribe "docs/architecture/c4/context-diagram.puml" con los actores y sistemas externos encontrados
  Y no se pide elegir un proyecto "PROJ-*"
```

### AC-3 — Escenario alternativo – Diagrama existente
```gherkin
Dado que "docs/architecture/c4/context-diagram.puml" ya existe
Cuando el arquitecto ejecuta "/project-context-diagram" en cualquier modo
Entonces el skill pide confirmación antes de sobrescribirlo
  Pero si el arquitecto no confirma, el archivo y su "context-diagram.png" quedan sin cambios
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Sin rutas del modelo de proyectos:** "01-projects", "project-intent.md", "project.md" (como entrada) y "PROJ-" no aparecen en `skills/project-story-mapping/`, `skills/project-context-diagram/` ni en `agents/project-story-mapper.agent.md`; los evals de ambos skills pasan con `npm run test:eval`.
- **CNF-2 — Convención de la capa de arquitectura:** el `.puml` respeta lo que fija `docs/architecture/README.md` (fuente PlantUML en `c4/`, nombre `context-diagram` para C4 L1).
- **CNF-3 — Encoding:** los archivos escritos quedan en UTF-8 sin BOM.

## Fuera de alcance (Non-Goals)

- Generar o regenerar `context-diagram.png` a partir del `.puml`: hoy el skill no lo hace y sigue sin hacerlo.
- Que `project-planning` use `product/story-map.md` como guía: STORY-111.
- Mover el `story-map.md` y el `.puml` existentes de este repositorio: STORY-107.

## 📎 Notas / contexto adicional

- **Destino:** lo decidió el mantenedor al crear EPIC-21 (story map → `product/`, diagrama → `architecture/`); STORY-107 corrigió el diagrama a `architecture/c4/` según `docs/architecture/README.md`.
- **Entradas de `--from-files`:** hoy `project-context-diagram` lee `01-projects/*/project.md` para extraer el nombre del sistema, los actores ("Como un...") y los sistemas externos. Pasa a leer `product/vision.md`, `product/stakeholders.md` y `requirements/`.
- **Resolución de proyecto:** desaparece la selección de `PROJ-slug` y el error "El proyecto `<PROJ-slug>` no existe".
