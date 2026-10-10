---
type: requirement
kind: functional
id: FR-039
slug: FR-039-orquestacion-de-la-fase-de-planning
title: "Orquestación de la fase de planning"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-039 — Orquestación de la fase de planning

## Descripción

El sistema SHALL ejecutar en secuencia `story-design` → `story-tasking` →
`story-testcases` → `story-analyze` para una historia objetivo, con flags para ejecutar solo
parte del ciclo (`--only-tasks`, `--only-testcases`, `--skip-analyze`).

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-001, US-004
- **Fuente**: `story-plan` · STORY-060 · EPIC-12
- **Categoría de origen**: 2.1.6 Planificación de historia (nivel L1 · fase PLAN)
