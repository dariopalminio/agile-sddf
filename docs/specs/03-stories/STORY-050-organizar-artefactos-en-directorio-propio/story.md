---
alwaysApply: false
type: story
id: STORY-050
kind: feat
slug: STORY-050-organizar-artefactos-en-directorio-propio
title: "Organizar artefactos de spec en directorios propios por workitem"
status: COMPLETED
substatus: READY
parent: EPIC-10-mejora-estructura-artefactos-nuevos-skills
created: 2026-05-01
updated: 2026-05-01
---
<!-- Referencias -->
[[EPIC-10-mejora-estructura-artefactos-nuevos-skills]]

# ðŸ“– Historia: Organizar artefactos de spec en directorios propios por workitem

**Como** developer que usa el framework SDDF para especificar proyectos  
**Quiero** que cada workitem (proyecto, release, historia) se almacene en su propio subdirectorio identificado bajo `projects/`, `releases/` o `stories/`  
**Para** agrupar todos los artefactos de un mismo workitem en un Ãºnico lugar y facilitar la navegaciÃ³n cuando hay mÃºltiples proyectos simultÃ¡neos

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ Artefacto de release creado en su propio directorio
```gherkin
Dado que ejecuto el skill `/release-creation` para crear el release "Sistema de pagos"
Cuando el skill escribe el archivo de release
Entonces el archivo se crea en `$SPECS_BASE/specs/releases/EPIC-01-sistema-de-pagos/release.md`
  Y no existe ningÃºn archivo `$SPECS_BASE/specs/releases/release-01-sistema-de-pagos.md`
```

### Escenario principal â€“ Artefacto de historia creado en su propio directorio
```gherkin
Dado que ejecuto el skill `/release-generate-stories` sobre un release existente
Cuando el skill escribe una historia de usuario
Entonces el archivo se crea en `$SPECS_BASE/specs/stories/STORY-001-nombre-historia/story.md`
  Y no existe ningÃºn archivo `$SPECS_BASE/specs/stories/story-STORY-001-nombre-historia.md`
```

### Escenario alternativo / error â€“ Directorio destino ya existe
```gherkin
Dado que el directorio `$SPECS_BASE/specs/releases/EPIC-01-sistema-de-pagos/` ya existe
Cuando el skill intenta crear el release con el mismo identificador
Entonces el skill alerta al usuario del conflicto antes de sobreescribir
  Pero no sobreescribe el archivo sin confirmaciÃ³n explÃ­cita
```

### Escenario con datos (Scenario Outline) â€“ Directorio por tipo de workitem
```gherkin
Escenario: Cada tipo de workitem usa su carpeta base correcta
  Dado que creo un artefacto de tipo "<tipo>"
  Cuando el skill escribe el archivo
  Entonces la ruta comienza con "<carpeta_base>/<prefijo>-"
Ejemplos:
  | tipo     | carpeta_base              | prefijo |
  | proyecto | docs/specs/projects       | PROJ    |
  | release  | docs/specs/releases       | EPIC    |
  | historia | docs/specs/stories        | FEAT    |
```

### Requirement: header-aggregator 
escanea la nueva estructura de directorios por workitemEl skill SHALL buscar archivos Markdown en los patrones `{SPECS_BASE}/specs/projects/*/`, `{SPECS_BASE}/specs/releases/*/` y `{SPECS_BASE}/specs/stories/*/`, cubriendo archivos principales (`project.md`, `release.md`, `story.md`) y artefactos secundarios dentro de cada directorio de workitem.

### Requirement: project-begin 
produces project-intent.mdEl skill `/project-begin` SHALL producir `project-intent.md` dentro del directorio del proyecto activo en `{SPECS_BASE}/specs/projects/<PROJ-ID>-<nombre>/`, en una sola sesiÃ³n interactiva. El skill MUST determinar el ID y nombre del proyecto durante la entrevista para construir la ruta de destino antes de escribir el archivo.

### Requirement: project-discovery 
resuelve el directorio del proyecto activoEl skill `project-discovery` SHALL localizar el proyecto activo buscando en `{SPECS_BASE}/specs/projects/` el directorio cuyo `project.md` tenga `status: IN_PROGRESS`. Toda lectura y escritura de artefactos del proyecto SHALL usar esa ruta como base.

### Requirement: project-planning 
lee y escribe en el directorio del proyecto activoEl skill `project-planning` SHALL localizar el proyecto activo buscando en `{SPECS_BASE}/specs/projects/` el directorio con `project.md` en `status: IN_PROGRESS`, y usar esa ruta como base para leer `requirement-spec.md` y escribir `project-plan.md`.

### Requirement: project-story-mapping 
escribe story-map.md en el directorio del proyecto activoEl skill SHALL localizar el proyecto activo en `{SPECS_BASE}/specs/projects/` y escribir `story-map.md` dentro de ese directorio, no en `{SPECS_BASE}/specs/projects/`.

### Requirement: release-generate-all-stories 
genera directorios de historia por feature en todos los releasesEl skill SHALL iterar sobre todos los directorios en `{SPECS_BASE}/specs/releases/`, leer el `release.md` de cada uno y generar un directorio `<STORY-ID>-<nombre-kebab>/story.md` por cada feature encontrada, siguiendo el mismo patrÃ³n de nomenclatura que `release-generate-stories`.

### Requirement: El skill resuelve el input del archivo de release
El skill SHALL aceptar el ID de release (ej. `EPIC-01`), el nombre del directorio (con o sin ruta completa), o una bÃºsqueda parcial. Si el tÃ©rmino coincide con mÃ¡s de un directorio en `{SPECS_BASE}/specs/releases/`, el skill SHALL solicitar al usuario que especifique cuÃ¡l usar.

### Requirement: El skill extrae todos los releases de project-plan.md
El skill SHALL leer `{SPECS_BASE}/specs/projects/<PROJ-ID>-<nombre>/project-plan.md` del proyecto activo y extraer cada bloque de release definido bajo la secciÃ³n `## Propuesta de Releases`. Por cada bloque `### Release NN â€” Nombre` encontrado, el skill MUST generar un directorio de release independiente con su archivo `release.md`.

### Requirement: reverse-engineering 
escribe artefactos en el directorio del proyecto activoEl skill SHALL escribir los artefactos generados (`requirement-spec.md` y artefactos intermedios) en `{SPECS_BASE}/specs/projects/<PROJ-ID>-<nombre>/` en lugar de `{SPECS_BASE}/specs/projects/`. Si no existe un proyecto activo, el skill SHALL crear el directorio con el ID y nombre derivados del repositorio analizado.


## âš™ï¸ Criterios no funcionales

* Compatibilidad: todos los skills que leen artefactos de spec deben buscar en la nueva estructura de directorios
* ConvenciÃ³n: el nombre del directorio sigue el formato `<PREFIJO>-<NN>-<slug-kebab>` sin excepciÃ³n

## ðŸ“Ž Notas / contexto adicional

Esta historia cubre la convenciÃ³n de organizaciÃ³n de directorios. Los siguientes aspectos quedan fuera de scope y se cubren en historias separadas:
- ActualizaciÃ³n del frontmatter con campos `id`, `type`, `parent`, `created`, `updated`
- MigraciÃ³n de artefactos existentes a la nueva estructura
- ActualizaciÃ³n de cada skill individual (project-begin, release-generate-stories, etc.)

Referencia: convenciÃ³n documentada en `docs/wiki/guides/organization-of-artifacts.md`.
