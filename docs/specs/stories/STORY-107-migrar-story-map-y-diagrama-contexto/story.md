---
alwaysApply: false
type: story
id: STORY-107
kind: chore
slug: STORY-107-migrar-story-map-y-diagrama-contexto
title: "Migrar story-map.md y context-diagram.puml"
status: IMPLEMENT
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
created: 2026-10-05
updated: 2026-10-10
related:
  - EPIC-21-colapsar-specs-dos-niveles
  - ADR-0013-eliminar-specs-01-projects
  - STORY-106-migrar-plan-a-roadmap
---
<!-- Referencias -->
[[EPIC-21-colapsar-specs-dos-niveles]]
[[ADR-0013-eliminar-specs-01-projects]]

# 📖 Historia: Migrar `story-map.md` y `context-diagram.puml`

**Como** mantenedor de SDDF que consulta el mapa de historias o el diagrama de contexto del framework  
**Quiero** encontrar el story map en la capa `docs/product/` y un único diagrama de contexto C4 en `docs/architecture/c4/`  
**Para** no tener que adivinar cuál de dos copias es la vigente y dejar `specs/01-projects/` sin artefactos que pertenecen a otras capas

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – El story map pasa a la capa de producto
```gherkin
Dado que "docs/specs/01-projects/PROJ-01-agile-sddf/story-map.md" existe con "slug: story-map"
  Y "docs/product/story-map.md" no existe
Cuando el mantenedor migra el story map
Entonces "docs/product/story-map.md" existe con el mismo cuerpo que el original (personas, mapa ASCII, backbone, walking skeleton, user tasks, release slices y notas)
  Y su frontmatter declara "type: product" y conserva "slug: story-map"
  Y "docs/specs/01-projects/PROJ-01-agile-sddf/story-map.md" ya no existe
```

### AC-2 — Escenario alternativo – El diagrama de contexto ya existe en su capa
```gherkin
Dado que "docs/specs/01-projects/PROJ-01-agile-sddf/context-diagram.puml" es idéntico a "docs/architecture/c4/context-diagram.puml"
Cuando el mantenedor migra el diagrama de contexto
Entonces "docs/specs/01-projects/PROJ-01-agile-sddf/context-diagram.puml" ya no existe
  Y "docs/architecture/c4/context-diagram.puml" y "docs/architecture/c4/context-diagram.png" quedan sin cambios
  Pero no se crea "docs/architecture/context-diagram.puml" fuera de "c4/"
```

### AC-3 — Escenario de cierre – Referencias resueltas sin enlaces rotos
```gherkin
Dado que "docs/index.md" y "project.md" referencian "[[story-map]]"
Cuando se completan las dos migraciones
Entonces "[[story-map]]" resuelve a "docs/product/story-map.md"
  Y la entrada de "docs/index.md" para "story-map" apunta a "product/story-map.md"
  Y "memory-system check" no reporta wikilinks rotos
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Sin pérdida semántica:** el cuerpo del story map se traslada literalmente; solo cambian el frontmatter y la ubicación.
- **CNF-2 — Encoding:** los archivos creados o modificados quedan en UTF-8 sin BOM, sin caracteres corruptos (`Ã³`, `ðŸ“–`).

## Fuera de alcance (Non-Goals)

- Actualizar el contenido del story map (personas, actividades, release slices) al estado actual del framework: se traslada como está, con su fecha original.
- Cambiar `project-story-mapping`, el agente `project-story-mapper` y `project-context-diagram` para que escriban en `docs/product/` y `docs/architecture/c4/`: lo cubre "Actualizar skills que referencian rutas de `specs/`".
- Reemplazar la entrada `related: project-plan` del story map y su wikilink `[[PROJ-01-agile-sddf]]`: dependen de STORY-106 (roadmap) y de la eliminación de `project.md`, que están en otras historias de EPIC-21.
- Reescribir las menciones textuales a `context-diagram.puml` dentro de `project.md` (§2.1.2, §3, §4): esas secciones se migran en sus propias historias.

## 📎 Notas / contexto adicional

- **Origen:** [[ADR-0013-eliminar-specs-01-projects]] elimina `specs/01-projects/` pero no asigna destino a `story-map.md` ni a `context-diagram.puml`. El destino lo decidió el mantenedor al crear EPIC-21 (story map → `product/`, diagrama → `architecture/`).
- **Destino corregido del diagrama:** EPIC-21 indica `docs/architecture/context-diagram.puml`, pero `docs/architecture/README.md` fija que los diagramas PlantUML viven en `c4/` junto a su render, y `docs/architecture/c4/context-diagram.puml` ya existe idéntico (comprobado con `diff`, 2026-10-05). Hay que alinear la línea de historias y el criterio de éxito de la épica con `docs/architecture/c4/context-diagram.puml`.
- **Capa `product/`:** `product/README.md` admite documentos de contexto adicionales en kebab-case, así que `story-map.md` entra sin cambiar el README.
- **Wikilinks:** el slug `story-map` no cambia, así que `[[story-map]]` sigue resolviendo por slug. Solo cambia la ruta que muestra `docs/index.md` (1 entrada); `project.md` lo referencia 2 veces.
- **Independencia:** no depende de STORY-104, STORY-105 ni STORY-106.
