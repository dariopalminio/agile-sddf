---
type: epic
id: EPIC-02
slug: EPIC-02-project-spec-builder
title: "Release 02 — Project Spec Builder (Pipeline de proyecto)"
date: 2026-04-16
status: RELEASED
substatus: READY
parent: PROJ-01-agile-sddf
related:                              
  - project-plan
---
<!-- Referencias -->
[[PROJ-01-agile-sddf]]

# Release 02 — Project Spec Builder (Pipeline de proyecto)

## Descripción

Incorpora el pipeline completo de especificación de proyectos (ProjectSpecFactory), que permite transformar una intención inicial en un plan de backlog con releases y features priorizadas. Se añaden tres agentes especializados (PM, Arquitecto, UX) y tres skills que los orquestan de forma secuencial con gates de revisión humana entre etapas. También se incorpora soporte para Google Gemini Gems.

## Features

- [x] **FEAT-001 — project-begin-intention** (luego renombrado a `project-begin`): Skill de captura de intención inicial del proyecto mediante entrevista interactiva. Produce `project-intent.md` con el problema, visión, beneficios, criterios de éxito, restricciones y non-goals.
- [x] **FEAT-003 — project-discovery**: Skill de discovery de usuarios y especificación de requisitos en dos sub-fases. Produce `requirement-spec.md` a partir de `project-intent.md`.
- [x] **FEAT-004 — project-planning**: Skill de planificación de releases con extracción de features FEAT-NNN, priorización y agrupación en releases incrementales. Produce `project-plan.md`.
- [x] **Agente project-pm**: Especializado en discovery de usuarios, identificación de perfiles y dolores, e integraciones externas.
- [x] **Agente project-architect**: Especializado en entrevista de especificación de requisitos sección por sección y planificación de releases con criterio de priorización.
- [x] **Agente project-ux**: Especializado en flujos de usuario y usabilidad, invocado como apoyo durante discovery y SPECIFY.
- [x] **Templates canónicos**: `project-intent-template.md`, `project-template.md` y `project-plan-template.md`.
- [x] **Soporte Google Gemini Gems**: Prompts adaptados en `gem/prompts/` para el runtime Gemini.
- [x] **FEAT-008 — Control WIP=1**: Mecanismo de detección de `Estado: IN‑PROGRESS` para impedir múltiples proyectos activos simultáneos.
- [x] **FEAT-010 — Gates de Revisión Humana**: Presentación de resumen del documento generado y solicitud de confirmación del usuario antes de avanzar a la siguiente fase; el documento avanza a `Estado: Ready` solo tras confirmación.
- [x] **Documentos de ejemplo**: Ejecución completa del pipeline sobre el propio proyecto SDDF (`$SPECS_BASE/specs/project-spec-factory/`).
