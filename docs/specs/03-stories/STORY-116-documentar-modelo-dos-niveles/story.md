---
alwaysApply: false
type: story
id: STORY-116
kind: chore
slug: STORY-116-documentar-modelo-dos-niveles
title: "Actualizar documentación canónica al modelo de dos niveles"
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-21-colapsar-specs-dos-niveles
created: 2026-10-05
updated: 2026-10-05
related:
  - EPIC-21-colapsar-specs-dos-niveles
  - ADR-0013-eliminar-specs-01-projects
  - STORY-108-renombrar-specs-sin-prefijos
  - STORY-114-migrate-specs-3-levels
---
<!-- Referencias -->
[[EPIC-21-colapsar-specs-dos-niveles]]
[[ADR-0013-eliminar-specs-01-projects]]

# 📖 Historia: Actualizar documentación canónica al modelo de dos niveles

**Como** usuario o contribuidor de SDDF que aprende el framework leyendo su documentación, o que actualiza un repositorio a la nueva versión major  
**Quiero** que los documentos de dominio, arquitectura y guías describan el modelo vigente (estratégico en `product/` + `requirements/`; Epic y Story como únicos work items) y que el CHANGELOG me diga qué se rompe y cómo migrar  
**Para** no construir sobre un modelo de proyectos que ya no existe y poder actualizar mi repositorio sin descubrir los cambios por ensayo y error

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – El modelo documentado es el de dos niveles
```gherkin
Dado que "domain-work-item-hierarchy.md", "domain-project-lifecycle.md", "architecture/state-machine.md", "architecture/memory-system.md", "architecture/sddf-architecture.md" y "guides/flight-leves-model.md" describen Project como work item de nivel L3
Cuando el contribuidor actualiza la documentación canónica
Entonces ninguno de esos documentos presenta a Project como work item, agregado con estado propio ni directorio "PROJ-NN"
  Y la jerarquía documentada es "product/ + requirements/" (estratégico, documentación) → "specs/epics/" (coordinación) → "specs/stories/" (operativo)
  Y la tabla de fases del pipeline de proyecto indica como salida "vision.md", "stakeholders.md", "requirements/" y "roadmap.md"
```

### AC-2 — Escenario principal – Ciclo de vida de los ADR
```gherkin
Dado que "ADR-0013" tiene "status: PROPOSED" y "ADR-0004" decide directorios numerados con "superseded-by: null"
Cuando se cierra la documentación de la épica
Entonces "ADR-0013" tiene "status: ACCEPTED"
  Y "ADR-0004" registra en su frontmatter y en una nota visible que su decisión de directorios numerados queda reemplazada por "ADR-0013"
  Y "docs/adr/README.md" lista ambos ADR con su estado vigente
```

### AC-3 — Escenario alternativo – Usuario que actualiza un repositorio existente
```gherkin
Dado un usuario con un repositorio en la versión 3.x y "docs/specs/01-projects/"
Cuando lee la entrada "[Unreleased]" de "CHANGELOG.md"
Entonces encuentra una sección "BREAKING" que enumera los cambios de ruta, los nuevos hogares del contenido de "01-projects/" y los skills cuyo output cambió
  Y la entrada declara que el cambio requiere la versión major "4.0.0"
  Y enlaza a una guía de migración que indica ejecutar "/memory-system migrate --from=specs-3-levels --dry-run" y luego sin "--dry-run"
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Enlaces sanos:** `npm run verify:links` y `memory-system check` terminan sin enlaces ni wikilinks rotos tras los cambios.
- **CNF-2 — Regla de reemplazo de la capa:** si un documento deja de ser vigente (por ejemplo, `domain-project-lifecycle.md`), se conserva con `status: superseded` y enlace a su sucesor en lugar de borrarse, como fija `docs/architecture/README.md`.
- **CNF-3 — Encoding:** los archivos modificados quedan en UTF-8 sin BOM.

## Fuera de alcance (Non-Goals)

- **Reemplazar las cadenas de ruta `02-epics`/`03-stories`** en documentos vivos: STORY-108. Esta historia cambia el modelo descrito, no las rutas.
- **Publicar la versión:** el bump de `package.json` a `4.0.0`, el corte de `[Unreleased]` en `[4.0.0]` y las release notes se hacen en el proceso de release (`doc-release-notes`), no en esta historia.
- **Documentación de cada skill** (`SKILL.md`, `README.md` de skills): STORY-109 a STORY-115.
- **Registros históricos:** épicas e historias cerradas, y los ADR distintos de ADR-0004 y ADR-0013 (por ejemplo, ADR-0005, ADR-0010, ADR-0011), no se reescriben.

## 📎 Notas / contexto adicional

- **Origen:** [[ADR-0013-eliminar-specs-01-projects]], consecuencias "Actualización de documentación" y "Breaking change: ... documentarse en el CHANGELOG con guía de migración". Cubre el criterio de salida de EPIC-21 "`CHANGELOG.md` documenta el breaking change con guía de migración".
- **Documentos con el modelo de proyecto (2026-10-05):** `domains/domain-project-lifecycle.md`, `domain-work-item-hierarchy.md`, `domain-knowledge-artifacts.md`, `domain-state-management.md`, `domain-epic-lifecycle.md`, `domain.md`, `domains/README.md`; `architecture/state-machine.md` (sección "Nivel PROJECT"), `memory-system.md`, `sddf-architecture.md`; `guides/flight-leves-model.md`, `organization-of-artifacts.md`, `sddf-commands-pipeline.md`, `skill-structural-pattern.md`, `artifact-directory-migration.md`; `runbooks/actualizar-spec-de-proyecto.md`; `constitution.md`; `README.md`.
- **`domain-project-lifecycle.md`:** el pipeline `project-begin → project-discovery → project-planning` sigue existiendo (STORY-113), pero ya no como agregado `PROJ-NN`. Reescribirlo como ciclo de vida de los documentos fundacionales o marcarlo `superseded` con un sucesor nuevo se decide en diseño (CNF-2).
- **Guía de migración:** `guides/artifact-directory-migration.md` ya documenta la migración anterior (`projects/` → `01-projects/`), y `README.md` (líneas 395–397) incluye la misma tabla. La nueva guía puede ser una sección de esa guía; la tabla del README debe actualizarse o remitir a ella.
- **`runbooks/actualizar-spec-de-proyecto.md`:** describe cómo actualizar `project.md`; queda obsoleto con STORY-105 y STORY-110 y entra en AC-1 o en CNF-2.
