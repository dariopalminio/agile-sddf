---
type: requirement
kind: functional
id: FR-043
slug: FR-043-revision-de-codigo-multi-agente-gate-del-dod-code
title: "Revisión de código multi-agente (gate del DoD CODE-REVIEW)"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-043 — Revisión de código multi-agente (gate del DoD CODE-REVIEW)

## Descripción

El sistema SHALL ejecutar en paralelo tres agentes revisores especializados
(calidad técnica, cumplimiento de requisitos e integración arquitectónica) sobre la
implementación, verificando que cada escenario Gherkin tiene correspondencia en el código, que
los componentes respetan `design.md` y que se cumplen los estándares de `constitution.md`.
SHALL validar la existencia de los artefactos requeridos antes de revisar, y SHALL invocar
`security-audit` cuando el cambio lo amerite. Produce `code-review-report.md` si aprueba, o
`fix-directives.md` con instrucciones accionables si hay hallazgos bloqueantes (severidad
`HIGH` o `MEDIUM`), retrocediendo entonces la historia a `READY-FOR-IMPLEMENT/DONE`. Dispone de
un modo degradado `--single-agent`.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-002, US-004
- **Fuente**: `story-code-review` · STORY-064, STORY-065, STORY-066, STORY-070 · EPIC-12, EPIC-13
- **Categoría de origen**: 2.1.7 Implementación y quality gates (nivel L1 · IMPLEMENT → ACCEPTANCE)
