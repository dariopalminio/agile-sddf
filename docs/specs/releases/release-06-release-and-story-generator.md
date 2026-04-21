---
alwaysApply: false
---
**Título**: Release & Story Generator
**Versión**: 1.0
**Estado**: Doing
**Fecha**: 2026-04-20
---

# Release 06 — Release & Story Generator

## Descripción
Automatiza la creación de dos artefactos clave después del planning: el documento de release (a partir de `project-plan.md`) y las stories derivadas (a partir del release generado).

## Features
- **Validación de formato de Release:** Crear un skill de validación del formato de una especificación de Release basado en release-spec-template.md, llamado release-format-validation.
- **Generar releases:** Skill `generate-release` crea `release-[ID]-[Nombre].md` usando template release-spec-template.md.
- **Generar stories: ** Skill `generate-stories` crea `story-[ID]-[Nombre].md` desde el archivo de release y usando template story-gherkin-template.md.

