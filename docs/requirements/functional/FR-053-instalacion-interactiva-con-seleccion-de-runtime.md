---
type: requirement
kind: functional
id: FR-053
slug: FR-053-instalacion-interactiva-con-seleccion-de-runtime
title: "Instalación interactiva con selección de runtime"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-053 — Instalación interactiva con selección de runtime

## Descripción

El CLI `agile-sddf install` SHALL permitir elegir la carpeta destino
(`.claude` para Claude Code, `.agents` para OpenCode, `.github` para GitHub Copilot) de forma
interactiva o mediante `--target`, con `--global` para instalación en el home del usuario y
`--force` para sobrescribir instalaciones previas. Sin `--force`, no SHALL sobrescribir.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-001, US-002
- **Fuente**: `scripts/cli.js`, `scripts/install.js` · EPIC-16 · plan-01
- **Categoría de origen**: 2.1.9 Distribución e instalación multi-runtime
