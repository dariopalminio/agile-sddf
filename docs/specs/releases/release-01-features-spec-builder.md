# Release 01 — Features Spec Builder

## Descripción

Primera versión del framework. Establece la base del sistema: creación de historias de usuario, evaluación de calidad con la rúbrica FINVEST y división de épicas. El objetivo fue demostrar que el ciclo completo de gestión de historias de usuario puede automatizarse con skills Markdown y agentes de IA, sin código ejecutable propio.

## Features

- **story-creation**: Skill para crear historias de usuario en formato `Como/Quiero/Para` con criterios de aceptación Gherkin siguiendo el template `story-gherkin-template.md`.
- **story-finvest-evaluation** (luego renombrado a `story-evaluation`): Skill de evaluación de calidad de historias mediante la rúbrica FINVEST (Formato + INVEST), con score Likert 1–5 por dimensión, score global y decisión accionable (APROBADA / REFINAR / RECHAZAR / DIVIDIR).
- **story-split**: Skill para dividir épicas o historias grandes en historias más pequeñas e independientes usando los 8 patrones de splitting (pasos de flujo, variaciones de reglas, variaciones de datos, complejidad de criterios, esfuerzo incremental, dependencias externas, DevOps, TADs).
- **Soporte multi-runtime inicial**: Skills disponibles para Claude Code (`.claude/skills/`), GitHub Copilot (`.github/skills/`) y Codex/Cursor (`.agents/skills/`).
- **Dockerización**: Configuración de entorno de desarrollo reproducible con imagen `debian:bookworm-slim`.
- **Soporte Atlassian Rovo**: Agente `story-creator-agent.md` para el runtime Rovo.
