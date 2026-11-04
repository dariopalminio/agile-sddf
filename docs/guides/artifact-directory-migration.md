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

## Migración a 5.0.0 — layout fijo de tres raíces

**A quién aplica:** proyectos que declaran `root` en `sddf.config.yaml` (normalmente `root: docs`), que guardan sus work items en `docs/specs/` o que definen la variable de entorno `SDDF_ROOT`. Es un cambio incompatible: los skills de 5.0.0 ya no leen `root` ni `SDDF_ROOT`, no usan `SPECS_BASE` y leen y escriben los work items en `specs/flow/`. La decisión está en [ADR-0016](../adr/ADR-0016-layout-fijo-de-tres-raices.md): `docs/` (conocimiento), `specs/` (estado) y `workflow/` (proceso) son raíces hermanas en la raíz del repositorio.

| Origen 4.x | Destino 5.0.0 |
|---|---|
| `docs/specs/epics/EPIC-NN-<slug>/` | `specs/flow/EPIC-NN-<slug>/` |
| `docs/specs/stories/STORY-NNN-<slug>/` (no `COMPLETED`) | `specs/flow/STORY-NNN-<slug>/` |
| `docs/specs/stories/STORY-NNN-<slug>/` (`COMPLETED`) | `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/`, con la fecha de su `updated:` (o `created:` si falta, o `date:` si faltan ambos) |
| `root:` en `sddf.config.yaml` | se elimina |
| `SDDF_ROOT` | se elimina; ya no se lee |
| `docs/templates/`, `docs/guardrails/`, `docs/requirements/` y demás capas de `docs/` | sin cambios |
| — | `specs/living/` y `workflow/` (reservados, con `.gitkeep`) |

1. Crea un commit de respaldo con el árbol de trabajo limpio.
2. Ejecuta `npx agile-sddf install --force`. Borra a mano las copias instaladas de `docs-wiki-builder` en el directorio de skills de cada runtime: el skill se eliminó y el instalador no borra copias antiguas.
3. Pide el diagnóstico explícito `/skill-preflight` y anota las señales de layout legado que informa (`docs/specs/`, la clave `root`, `SDDF_ROOT`).
4. Crea `specs/flow/archive/`, `specs/living/` y `workflow/`, cada uno con un `.gitkeep` vacío. `/sddf-init` no los crea mientras exista `docs/specs/`: avisa del layout legado, no escribe nada y remite a esta guía.
5. Mueve cada épica con `git mv docs/specs/epics/EPIC-NN-<slug> specs/flow/`.
6. Mueve cada historia que no esté `COMPLETED` con `git mv docs/specs/stories/STORY-NNN-<slug> specs/flow/`.
7. Mueve cada historia `COMPLETED` con `git mv docs/specs/stories/STORY-NNN-<slug> specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>`, con la fecha de la tabla anterior.
8. Elimina lo que quede en `docs/specs/` (por ejemplo, su `README.md`) y el directorio.
9. Quita la clave `root` de `sddf.config.yaml` y retira `SDDF_ROOT` del entorno, de los scripts y de la CI.
10. Regenera el índice con `/memory-system index` y busca enlaces que aún apunten a `docs/specs/` con `git grep -n "docs/specs/"`.
11. Verifica: `/skill-preflight` sin señales de layout legado, `/memory-system check` sin errores y `git log --follow` sobre un `story.md` movido, que debe mostrar su historial previo.

Notas:

- `git mv` conserva el historial de cada work item; no copies ni recrees los directorios.
- El paquete incluye `scripts/migrate-specs-to-flow.js`, pero es un script de un solo uso para este repositorio y no es un comando soportado de `agile-sddf`: migra con los pasos manuales.
- La migración solo archiva las historias `COMPLETED`; las `CANCELED`, las de cualquier otro estado y las épicas quedan en `specs/flow/`. Archivarlas después lo hacen `/story-complete` (historias) y `epic-complete` (épicas), siempre con confirmación humana (ADR-0019).
- Si el proyecto usa Spec Kit, su `specs/` puede convivir con el de SDDF, que solo usa `specs/flow/` y `specs/living/`.
- `docs/requirements/` no se mueve en 5.0.0; migrará a `specs/living/` en una versión posterior.

## Migración a 4.0.0 — specs/ de dos niveles

> Su destino `specs/epics/` y `specs/stories/` bajo `docs/` quedó reemplazado en 5.0.0; tras aplicar esta sección, continúa con la sección anterior.

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
- En 1.x–4.x, `$SPECS_BASE` se resolvía con la precedencia `SDDF_ROOT` válida → `sddf.config.yaml.root` válida → `docs`. Desde 5.0.0 no hay raíz configurable: tras esta sección, aplica las de 4.0.0 y 5.0.0.
