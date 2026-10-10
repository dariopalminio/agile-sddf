---
type: requirement
kind: non-functional
id: NFR-001
slug: NFR-001-compatibilidad-multi-runtime-por-instalacion-no
title: "Compatibilidad multi-runtime por instalación, no por duplicación"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# NFR-001 — Compatibilidad multi-runtime por instalación, no por duplicación

## Descripción

El sistema SHALL ser compatible con Claude Code (primario), OpenCode y GitHub
Copilot. La fuente única de skills y agentes SHALL ser `skills/` y `agents/` en la raíz del
repositorio; los directorios `.claude/`, `.agents/` y `.github/` son **destinos de instalación**
producidos por `scripts/install.js`, no fuentes. El soporte a otros CLI/LLM se evalúa en
releases futuros.

## Criterios de verificación

Un skill se ejecuta correctamente en Claude Code y en GitHub Copilot
sin modificar su `SKILL.md` fuente.

## Atributos

- **Prioridad**: Alta
- **Categoría de origen**: 2.2.1 Plataforma y compatibilidad de runtimes
