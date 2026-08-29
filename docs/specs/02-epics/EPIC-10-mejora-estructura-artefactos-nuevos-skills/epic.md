---
alwaysApply: false
type: epic
id: EPIC-10
slug: EPIC-10-mejora-estructura-artefactos-nuevos-skills
title: "Mejora en estructura de artefactos y nuevos skills"
status: RELEASED
substatus: READY
parent: PROJ-01-agile-sddf
created: 2026-05-01
updated: 2026-05-01
related:                              
  - PROJ-01-agile-sddf
---
<!-- Referencias -->
[[PROJ-01-agile-sddf]]

# Release/Epic: Mejora en estructura de artefactos y nuevos skills

## Descripción <!-- sección obligatoria-->
Se mejora la estructura de artefactos de especificaciones permitiendo seguir un estándar y se agregan skills necesarios para releases y diagramado de contexto.

## Features <!-- sección obligatoria-->
- [x] FEAT-049 - **Agregar configuración de directorio raíz de specs:** Soporte para variable SDDF_ROOT como ruta base configurable haciendo que los skills lean la variable de entorno y usen `$SPECS_BASE` en lugar de hardcodear `docs` para todas las rutas de artefactos.
- [x] FEAT-050 - **Mejorar la estructura de artefactos de especificaciones:** Mejora estructural que permite seguir un estándar, haciendo que cada workitem (proyecto, release, historia) se almacene en su propio subdirectorio identificado bajo `projects/`, `releases/` o `stories/`, agrupando todos los artefactos de un mismo workitem en un único lugar y facilitando la navegación cuando hay múltiples proyectos simultáneos (estilo como lo hace openspec y speckit).
- [x] FEAT-054 - **Inicializar entorno SDDF:** Skill para inicializar el entorno SDDF, configurando variables de entorno y preparando directorios necesarios para la ejecución de otros skills.
- [x] FEAT-053 - **Centralizar la validación de entorno SDDF con skill-preflight:** Skill para validar el entorno SDDF antes de ejecutar cualquier operación, asegurando que todas las dependencias y configuraciones estén correctas.
- [x] FEAT-051 - **Crear nuevo skill de creación de release:** Skill interactivo para crear releases guiados por el usuario.
- [x] FEAT-052 - **Crear nuevo skill de diagramado de contexto:** Skill para generar diagramas de contexto del proyecto tio c4 a partir de preguntas al usuario sobre los sistemas involucrados y sus relaciones o a partir del documento de especificaciones de proyecto.
- [ ] FEAT-055 - **Centralizar templates de spec en directorio compartido:** Migración de los templates `story-template.md`, `release-spec-template.md` y `project-template.md` desde las carpetas `assets/` de cada skill individual hacia `$SPECS_BASE/specs/templates/` como única fuente de verdad, eliminando divergencias de frontmatter y definiendo status inicial por workflow en cada skill generador.
