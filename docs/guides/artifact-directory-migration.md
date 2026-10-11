---
type: guide
slug: artifact-directory-migration
title: "Guía de migración de la estructura de artefactos SDDF"
date: 2026-05-01
status: null
substatus: null
parent: null
related:
  - organization-of-artifacts
---

## Guía de migración de la estructura de artefactos SDDF

## Migración a 4.0.0 — specs/ de dos niveles

La versión 4.0.0 elimina `specs/01-projects/`. La documentación estratégica pasa a `product/` y `requirements/`; los únicos work items son Epic y Story.

| Origen 3.x | Destino 4.0.0 |
|---|---|
| `project-intent.md` | `product/vision.md` |
| `project.md` | `product/stakeholders.md` y `requirements/{functional,non-functional}/` |
| `project-plan.md` | `product/roadmap.md` y `product/objectives.md` |
| `story-map.md` | `product/story-map.md` |
| `*.puml` | `architecture/c4/` |
| `specs/02-epics/` | `specs/epics/` |
| `specs/03-stories/` | `specs/stories/` |

1. Crea un commit de respaldo.
2. Ejecuta `npx agile-sddf install --force`.
3. Ejecuta `/memory-system migrate --from=specs-3-levels --dry-run` y revisa cada `[MOVERÍA]`, `[CREARÍA]` y `[NO MIGRADO]`.
4. Resuelve las secciones sin destino o los varios `PROJ-*` que se informen como `[NO MIGRADO]`.
5. Ejecuta `/memory-system migrate --from=specs-3-levels` sin `--dry-run`.
6. Repite el dry run hasta obtener `cambios pendientes: 0`.
7. Elimina manualmente los templates centrales retirados y crea los nuevos con `/sddf-init`.
8. Ejecuta `/memory-system check`.
9. Si también migras épicas v1, continúa con su guía de migración.

Un repositorio con varios proyectos no está soportado: el migrador lo informa como `[NO MIGRADO]` y no escribe.

## Migración histórica 1.x → 2.x

> Su destino `01-projects/` quedó reemplazado en 4.0.0; tras aplicar la sección anterior, sigue esta sección solo si migras desde 1.x.

Esta guía explica cómo migrar artefactos existentes (proyectos, épicas, historias) de la estructura plana anterior a la estructura vigente de directorios por workitem con niveles numerados.

### Estructura anterior → nueva

| Artefacto | Ruta anterior | Ruta nueva |
|-----------|--------------|------------|
| project-intent.md | `$SPECS_BASE/specs/projects/project-intent.md` | `$SPECS_BASE/specs/01-projects/PROJ-01-nombre/project-intent.md` |
| requirement-spec.md | `$SPECS_BASE/specs/projects/project.md` | `$SPECS_BASE/specs/01-projects/PROJ-01-nombre/project.md` |
| project-plan.md | `$SPECS_BASE/specs/projects/project-plan.md` | `$SPECS_BASE/specs/01-projects/PROJ-01-nombre/project-plan.md` |
| story-map.md | `$SPECS_BASE/specs/projects/story-map.md` | `$SPECS_BASE/specs/01-projects/PROJ-01-nombre/story-map.md` |
| release-01-nombre.md | `$SPECS_BASE/specs/releases/release-01-nombre.md` | `$SPECS_BASE/specs/epics/EPIC-01-nombre/epic.md` |
| story-STORY-001-nombre.md | `$SPECS_BASE/specs/stories/story-STORY-001-nombre.md` | `$SPECS_BASE/specs/stories/STORY-001-nombre/story.md` |

---

### Pasos de migración

#### 1. Migrar artefactos de proyecto

```bash
# Crear el directorio del proyecto (ajustar PROJ-01 y nombre según tu proyecto)
mkdir -p docs/specs/01-projects/PROJ-01-nombre-proyecto

# Mover los artefactos del proyecto
mv docs/specs/projects/project-intent.md  docs/specs/01-projects/PROJ-01-nombre-proyecto/project-intent.md
mv docs/specs/projects/project.md docs/specs/01-projects/PROJ-01-nombre-proyecto/project.md
mv docs/specs/projects/project-plan.md    docs/specs/01-projects/PROJ-01-nombre-proyecto/project-plan.md
mv docs/specs/projects/story-map.md       docs/specs/01-projects/PROJ-01-nombre-proyecto/story-map.md 2>/dev/null || true

# Eliminar el directorio antiguo si está vacío
rmdir docs/specs/project 2>/dev/null || true
```

#### 2. Migrar épicas

Por cada archivo `release-NN-nombre.md` en `$SPECS_BASE/specs/releases/`:

```bash
# Ejemplo para release-01-features-spec-builder.md
mkdir -p docs/specs/epics/EPIC-01-features-spec-builder
mv docs/specs/releases/release-01-features-spec-builder.md \
   docs/specs/epics/EPIC-01-features-spec-builder/epic.md
```

#### 3. Migrar historias

Por cada archivo `story-STORY-NNN-nombre.md` en `$SPECS_BASE/specs/stories/`:

```bash
# Ejemplo para story-STORY-001-project-begin.md
mkdir -p docs/specs/stories/STORY-001-project-begin
mv docs/specs/stories/story-STORY-001-project-begin.md \
   docs/specs/stories/STORY-001-project-begin/story.md
```

---

### Actualizar el frontmatter

Después de mover los archivos, actualiza el frontmatter de cada archivo principal para incluir los campos obligatorios de la nueva convención:

```yaml
---
type: project          # project | epic | story
id: PROJ-01            # mismo que el nombre del directorio padre
title: "Nombre del proyecto"
status: IN_PROGRESS    # BACKLOG | IN_PROGRESS | COMPLETED | ARCHIVED
parent: null           # null para proyectos; PROJ-01 para épicas; EPIC-01 para historias
created: 2026-05-01
updated: 2026-05-01
---
```

---

### Notas

- El campo `parent` en épicas apunta al ID del proyecto (`PROJ-01`), no al nombre del directorio.
- El campo `parent` en historias apunta al ID de la épica (`EPIC-01`) o al proyecto si aún no está asignada a una épica.
- Los IDs deben ser únicos globalmente en todo `$SPECS_BASE/specs/`.
- Resuelve `$SPECS_BASE` con la precedencia `SDDF_ROOT` válida → `sddf.config.yaml.root` válida → `docs` antes de ejecutar la migración; no sustituyas rutas manualmente ni continúes con una fuente explícita inválida.
