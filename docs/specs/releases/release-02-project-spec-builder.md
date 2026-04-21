---
alwaysApply: false
---
**Título**: Project Spec Builder (Pipeline de proyecto)
**Versión**: 1.0
**Estado**: Ready
**Fecha**: 2026-04-16
---

# Release 02 — Project Spec Builder (Pipeline de proyecto)

## Descripción

Incorpora el pipeline completo de especificación de proyectos (ProjectSpecFactory), que permite transformar una intención inicial en un plan de backlog con releases y features priorizadas. Se añaden tres agentes especializados (PM, Arquitecto, UX) y tres skills que los orquestan de forma secuencial con gates de revisión humana entre etapas. También se incorpora soporte para Google Gemini Gems.

## Features

- **project-begin-intention** (luego renombrado a `project-begin`): Skill de captura de intención inicial del proyecto mediante entrevista interactiva. Produce `project-intent.md` con el problema, visión, beneficios, criterios de éxito, restricciones y non-goals.
- **project-discovery**: Skill de discovery de usuarios y especificación de requisitos en dos sub-fases. Produce `requirement-spec.md` a partir de `project-intent.md`.
- **project-planning**: Skill de planificación de releases con extracción de features FEAT-NNN, priorización y agrupación en releases incrementales. Produce `project-plan.md`.
- **Agente project-pm**: Especializado en discovery de usuarios, identificación de perfiles y dolores, e integraciones externas.
- **Agente project-architect**: Especializado en entrevista de especificación de requisitos sección por sección y planificación de releases con criterio de priorización.
- **Agente project-ux**: Especializado en flujos de usuario y usabilidad, invocado como apoyo durante discovery y specifying.
- **Templates canónicos**: `project-intent-template.md`, `requirement-spec-template.md` y `project-plan-template.md`.
- **Soporte Google Gemini Gems**: Prompts adaptados en `gem/prompts/` para el runtime Gemini.
- **Control WIP=1**: Mecanismo de detección de `Estado: Doing` para impedir múltiples proyectos activos simultáneos.
- **Documentos de ejemplo**: Ejecución completa del pipeline sobre el propio proyecto SDDF (`docs/specs/project-spec-factory/`).
