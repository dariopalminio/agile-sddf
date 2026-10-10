---
type: requirement
kind: functional
id: FR-045
slug: FR-045-aceptacion-humana-final-fase-acceptance
title: "Aceptación humana final (fase ACCEPTANCE)"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-045 — Aceptación humana final (fase ACCEPTANCE)

## Descripción

El sistema SHALL conducir una validación humana criterio por criterio contra
los escenarios de `story.md`, registrando para cada uno un resultado `APPROVED` / `REJECTED` /
`BLOCKED` con observaciones, y produciendo `acceptance-report.md`. Con todos los criterios
aprobados la historia pasa a `ACCEPTANCE/DONE`; con al menos uno rechazado retrocede a
`READY-FOR-IMPLEMENT/DONE`; con bloqueantes sin rechazos queda en `ACCEPTANCE/BLOCKED`. La
aprobación SHALL requerir confirmación explícita del validador humano.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-003
- **Fuente**: `story-acceptance` · STORY-072 · EPIC-13
- **Categoría de origen**: 2.1.7 Implementación y quality gates (nivel L1 · IMPLEMENT → ACCEPTANCE)
