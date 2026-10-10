---
type: requirement
kind: functional
id: FR-052
slug: FR-052-instalacion-automatica-tras-npm-install
title: "Instalación automática tras `npm install`"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-052 — Instalación automática tras `npm install`

## Descripción

El script `postinstall` SHALL copiar skills y agentes al destino por defecto
(`.claude/` local, o `~/.claude/` en instalación global) de forma silenciosa y sin prompts
interactivos, respetando la variable `SDDF_TARGET` si está definida.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-001
- **Fuente**: `scripts/postinstall.js` · STORY-040, STORY-041, STORY-087 · EPIC-07, EPIC-08
- **Categoría de origen**: 2.1.9 Distribución e instalación multi-runtime
