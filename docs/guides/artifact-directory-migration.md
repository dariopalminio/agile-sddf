---
type: guide
slug: artifact-directory-migration
title: "Guía de migración — nueva estructura de directorios de artefactos SDDF"
date: 2026-05-01
status: null
substatus: null
parent: null
related:
  - organization-of-artifacts
---

## Guía de migración — nueva estructura de directorios de artefactos SDDF

Esta guía explica cómo migrar artefactos existentes (proyectos, épicas, historias) de la estructura plana anterior a la estructura vigente de directorios por workitem con niveles numerados.

### Estructura anterior → nueva

| Artefacto | Ruta anterior | Ruta nueva |
|-----------|--------------|------------|
| project-intent.md | `$SPECS_BASE/specs/projects/project-intent.md` | `$SPECS_BASE/specs/01-projects/PROJ-01-nombre/project-intent.md` |
| requirement-spec.md | `$SPECS_BASE/specs/projects/project.md` | `$SPECS_BASE/specs/01-projects/PROJ-01-nombre/project.md` |
| project-plan.md | `$SPECS_BASE/specs/projects/project-plan.md` | `$SPECS_BASE/specs/01-projects/PROJ-01-nombre/project-plan.md` |
| story-map.md | `$SPECS_BASE/specs/projects/story-map.md` | `$SPECS_BASE/specs/01-projects/PROJ-01-nombre/story-map.md` |
| release-01-nombre.md | `$SPECS_BASE/specs/releases/release-01-nombre.md` | `$SPECS_BASE/specs/02-epics/EPIC-01-nombre/epic.md` |
| story-FEAT-001-nombre.md | `$SPECS_BASE/specs/stories/story-FEAT-001-nombre.md` | `$SPECS_BASE/specs/03-stories/FEAT-001-nombre/story.md` |

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
mkdir -p docs/specs/02-epics/EPIC-01-features-spec-builder
mv docs/specs/releases/release-01-features-spec-builder.md \
   docs/specs/02-epics/EPIC-01-features-spec-builder/epic.md
```

#### 3. Migrar historias

Por cada archivo `story-FEAT-NNN-nombre.md` en `$SPECS_BASE/specs/stories/`:

```bash
# Ejemplo para story-FEAT-001-project-begin.md
mkdir -p docs/specs/03-stories/FEAT-001-project-begin
mv docs/specs/stories/story-FEAT-001-project-begin.md \
   docs/specs/03-stories/FEAT-001-project-begin/story.md
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
- Si usas `SDDF_ROOT` con un valor personalizado, reemplaza `$SPECS_BASE/specs/` con `$SDDF_ROOT/specs/` en todos los comandos anteriores.
