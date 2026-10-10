---
type: requirement
kind: functional
id: FR-035
slug: FR-035-diseno-tecnico-de-la-historia
title: "Diseño técnico de la historia"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-035 — Diseño técnico de la historia

## Descripción

El sistema SHALL producir `design.md` como puente entre los criterios de
aceptación y el código: componentes, contratos, decisiones y estructura. Cada elemento de
diseño SHALL declarar explícitamente el criterio que satisface (`// satisface: AC-N`), y todo
AC de `story.md` SHALL estar cubierto por al menos un elemento de diseño.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-004
- **Fuente**: `story-design` · STORY-057 · EPIC-12
- **Categoría de origen**: 2.1.6 Planificación de historia (nivel L1 · fase PLAN)
