---
type: epic
id: EPIC-01
slug: EPIC-01-features-spec-builder
title: "Release 01 — Features Spec Builder"
created: 2026-04-09
updated: 2026-04-09
status: COMPLETED
substatus: DONE
parent: PROJ-01-agile-sddf
related:                              
  - project-plan
---
<!-- Referencias -->
[[PROJ-01-agile-sddf]]

# Release 01 — Features Spec Builder

## Alcance

Primera versión del framework. Establece la base del sistema: creación de historias de usuario, evaluación de calidad con la rúbrica FINVEST y división de épicas. El objetivo fue demostrar que el ciclo completo de gestión de historias de usuario puede automatizarse con skills Markdown y agentes de IA, sin código ejecutable propio.

## Historias
- [x] **STORY-006** — story-creation: Skill para crear historias de usuario en formato `Como/Quiero/Para` con criterios de aceptación Gherkin siguiendo el template `story-template.md`.
- [x] **STORY-007** — story-finvest-evaluation (luego renombrado a `story-evaluation`): Skill de evaluación de calidad de historias mediante la rúbrica FINVEST (Formato + INVEST), con score Likert 1–5 por dimensión, score global y decisión accionable (APROBADA / REFINAR / RECHAZAR / DIVIDIR).
- [x] **STORY-012** — story-split: Skill para dividir épicas o historias grandes en historias más pequeñas e independientes usando los 8 patrones de splitting (pasos de flujo, variaciones de reglas, variaciones de datos, complejidad de criterios, esfuerzo incremental, dependencias externas, DevOps, TADs).
- [x] **STORY-030** — Soporte Atlassian Rovo: Agente `story-creator-agent.md` para el runtime Rovo.

## Criterios de salida
- [ ] [Por completar]

## Smoke tests
### SMOKE-1 — [Por completar]
```gherkin
Escenario: [Por completar]
  Dado [Por completar]
  Cuando [Por completar]
  Entonces [Por completar]
```

## Notas
### Ítems completados sin ID de historia

- [x] **Soporte multi-runtime inicial**: Skills disponibles para Claude Code (`.claude/skills/`), GitHub Copilot (`.github/skills/`) y Codex/Cursor (`.agents/skills/`).
- [x] **Dockerización**: Configuración de entorno de desarrollo reproducible con imagen `debian:bookworm-slim`.
