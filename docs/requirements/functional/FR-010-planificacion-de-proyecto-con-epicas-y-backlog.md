---
type: requirement
kind: functional
id: FR-010
slug: FR-010-planificacion-de-proyecto-con-epicas-y-backlog
title: "Planificación de proyecto con épicas y backlog"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-010 — Planificación de proyecto con épicas y backlog

## Descripción

El sistema SHALL extraer historias atómicas con IDs `STORY-NNN` desde
`project.md`, priorizarlas (valor de negocio → dependencias → riesgo técnico → esfuerzo) y
agruparlas en épicas incrementales, produciendo `project-plan.md`. Precondición: `project.md`
con `substatus: DONE`.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-002, US-004
- **Fuente**: `project-planning` → agente `project-architect` · STORY-004, STORY-011 · EPIC-02, EPIC-05
- **Categoría de origen**: 2.1.2 Pipeline de especificación de proyecto (nivel L3)
