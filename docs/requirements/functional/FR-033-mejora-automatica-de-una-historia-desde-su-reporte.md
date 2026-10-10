---
type: requirement
kind: functional
id: FR-033
slug: FR-033-mejora-automatica-de-una-historia-desde-su-reporte
title: "Mejora automática de una historia desde su reporte de evaluación"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-033 — Mejora automática de una historia desde su reporte de evaluación

## Descripción

El sistema SHALL aplicar sobre `story.md` las recomendaciones de las
dimensiones con score ≤ 3 del `finvest-evaluation-report.md`, preservando una copia `.bak` y
registrando los cambios en `story-improvement-log.md`.

## Atributos

- **Prioridad**: Media
- **Usuario**: US-003
- **Fuente**: `story-improve` · STORY-077 · EPIC-13
- **Categoría de origen**: 2.1.5 Especificación de historias (nivel L1 · fase SPECIFY)
