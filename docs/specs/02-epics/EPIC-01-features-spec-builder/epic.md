---
type: epic
id: EPIC-01
slug: EPIC-01-features-spec-builder
title: "Release 01 — Features Spec Builder"
date: 2026-04-09
status: RELEASED
substatus: READY
parent: PROJ-01-agile-sddf
related:                              
  - project-plan
---
<!-- Referencias -->
[[PROJ-01-agile-sddf]]

# Release 01 — Features Spec Builder

## Descripción

Primera versión del framework. Establece la base del sistema: creación de historias de usuario, evaluación de calidad con la rúbrica FINVEST y división de épicas. El objetivo fue demostrar que el ciclo completo de gestión de historias de usuario puede automatizarse con skills Markdown y agentes de IA, sin código ejecutable propio.

## Historias

- [x] **STORY-006 — story-creation**: Skill para crear historias de usuario en formato `Como/Quiero/Para` con criterios de aceptación Gherkin siguiendo el template `story-template.md`.
- [x] **STORY-007 — story-finvest-evaluation** (luego renombrado a `story-evaluation`): Skill de evaluación de calidad de historias mediante la rúbrica FINVEST (Formato + INVEST), con score Likert 1–5 por dimensión, score global y decisión accionable (APROBADA / REFINAR / RECHAZAR / DIVIDIR).
- [x] **STORY-012 — story-split**: Skill para dividir épicas o historias grandes en historias más pequeñas e independientes usando los 8 patrones de splitting (pasos de flujo, variaciones de reglas, variaciones de datos, complejidad de criterios, esfuerzo incremental, dependencias externas, DevOps, TADs).
- [x] **Soporte multi-runtime inicial**: Skills disponibles para Claude Code (`.claude/skills/`), GitHub Copilot (`.github/skills/`) y Codex/Cursor (`.agents/skills/`).
- [x] **Dockerización**: Configuración de entorno de desarrollo reproducible con imagen `debian:bookworm-slim`.
- [x] **STORY-030: **Soporte Atlassian Rovo**: Agente `story-creator-agent.md` para el runtime Rovo.
