---
type: epic
id: EPIC-00
slug: EPIC-00-estructura-base-y-mecanismo-de-templates
title: "Release 00 — Estructura Base y Mecanismo de Templates"
date: 2026-04-09
status: RELEASED
substatus: READY
parent: PROJ-01-agile-sddf
related:                              
  - project-plan
---
<!-- Referencias -->
[[PROJ-01-agile-sddf]]

### Release 00 — Estructura Base y Mecanismo de Templates

**Objetivo:** Establecer la estructura fundacional del framework: convenciones de directorios, configuración de entornos reproducibles y el mecanismo de extracción dinámica de templates que habilita a todos los agentes a generar preguntas contextuales en runtime sin lógica hardcodeada.

- [x] FEAT-002 - Extracción Dinámica de Templates

**Ítems de soporte (sin FEAT propio):**
- Crear proyecto en VSCode con estructura inicial de directorios: `.claude/skills/`, `.claude/agents/`, `$SPECS_BASE/specs/`.
- Estructura inicial de directorios `.claude/skills/`, `.claude/agents/`, `$SPECS_BASE/specs/`
- Convenciones CLAUDE.md y AGENTS.md del framework
- Configuración de entorno Docker con imagen `debian:bookworm-slim`
- Soporte multi-runtime inicial: Claude Code (`.claude/`), GitHub Copilot (`.github/`), Codex/Cursor (`.agents/`)
- Archivos README.md LICENSE.

**Criterios de éxito:**
- [x] Modificar un comentario `<!-- -->` o header `##` en un template produce un cambio observable en las preguntas generadas por el agente sin modificar el SKILL.md del agente.
- [x] El entorno Docker permite reproducir el entorno de desarrollo sin dependencias locales.


