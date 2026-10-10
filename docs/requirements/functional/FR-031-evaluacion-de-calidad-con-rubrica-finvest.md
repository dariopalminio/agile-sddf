---
type: requirement
kind: functional
id: FR-031
slug: FR-031-evaluacion-de-calidad-con-rubrica-finvest
title: "Evaluación de calidad con rúbrica FINVEST"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-031 — Evaluación de calidad con rúbrica FINVEST

## Descripción

El sistema SHALL evaluar historias aplicando la rúbrica FINVEST (Formato +
INVEST) con scores Likert 1-5 por dimensión, produciendo `finvest-evaluation-report.md`. La
decisión SHALL ser una de: `APROBADA` (FINVEST ≥ 4.0), `REFINAR` (3.0 ≤ FINVEST < 4.0),
`RECHAZAR` (FINVEST < 3.0 o dimensión crítica = 1), `DIVIDIR` (S = 1). Si `F_score` < 2.5, el
sistema SHALL rechazar sin evaluar INVEST.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-003
- **Fuente**: `story-evaluation` · STORY-007 · EPIC-01
- **Categoría de origen**: 2.1.5 Especificación de historias (nivel L1 · fase SPECIFY)
