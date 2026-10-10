---
type: requirement
kind: functional
id: FR-018
slug: FR-018-generacion-de-la-especificacion-desde-codigo
title: "Generación de la especificación desde código existente"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-018 — Generación de la especificación desde código existente

## Descripción

El sistema SHALL analizar un repositorio existente mediante cuatro agentes
especializados **en paralelo** más un agente sintetizador, generando automáticamente
`project.md`. Cada agente SHALL escribir su hallazgo en `.tmp/<skill-name>/` y el sintetizador
SHALL leer únicamente esos archivos. Las secciones sin datos suficientes SHALL marcarse
`<!-- PENDING MANUAL REVIEW -->`.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-001, US-002, US-004
- **Fuente**: `reverse-engineering` · STORY-017, STORY-022 · EPIC-03
- **Categoría de origen**: 2.1.3 Ingeniería inversa de repositorios
