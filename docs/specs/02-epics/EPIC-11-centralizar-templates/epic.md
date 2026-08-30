---
alwaysApply: false
type: epic
id: EPIC-11
slug: EPIC-11-centralizar-templates
title: "Centralizar templates de spec en directorio compartido"
status: COMPLETED
substatus: DONE
parent: PROJ-01-agile-sddf
created: 2026-05-01
updated: 2026-08-30
related:                              
  - PROJ-01-agile-sddf
---
<!-- Referencias -->
[[PROJ-01-agile-sddf]]

# Release/Epic: Centralizar templates de spec en directorio compartido

## Descripción <!-- sección obligatoria-->
Centralizar templates de spec en directorio compartido.

## Historias
- [x] STORY-055 - **Centralizar templates de spec en directorio compartido:** Migración de los templates `story-template.md`, `release-spec-template.md` y `project-template.md` desde las carpetas `assets/` de cada skill individual hacia `$SPECS_BASE/specs/templates/` como única fuente de verdad, eliminando divergencias de frontmatter y definiendo status inicial por workflow en cada skill generador. *Implementado vía EPIC-17/A3 con alcance ampliado a 5 templates (incluye `project-intent-template.md` y `project-plan-template.md`); los skills dueños conservan el seed en `assets/` y `sddf-init` copia al directorio central; resolución central → seed → error.*
