---
type: requirement
kind: functional
id: FR-031
slug: FR-031-evaluacion-de-calidad-con-rubrica-finvest
title: "Evaluación de calidad con rúbrica FINVEST"
status: active
created: 2026-10-10
updated: 2026-10-18
related: []
---

# FR-031 — Evaluación de calidad con rúbrica FINVEST

## Descripción

El sistema SHALL evaluar historias aplicando la rúbrica FINVEST (Formato +
INVEST) con scores Likert 1-5 por dimensión, produciendo `finvest-evaluation-report.md`. El
veredicto SHALL declararse en `verdict` y en la primera sección `## Veredicto`, con uno de los
valores `APPROVED`, `NEEDS-REFINEMENT` o `SPLIT`. Se evalúa en orden y gana la primera
condición: `F_score < 2.5` → `NEEDS-REFINEMENT` sin evaluar INVEST; dimensión INVEST distinta
de S con score 1 → `NEEDS-REFINEMENT`; S = 1 → `SPLIT`; FINVEST ≥ 4.0 → `APPROVED`;
3.0 ≤ FINVEST < 4.0 → `NEEDS-REFINEMENT`; FINVEST < 3.0 → `NEEDS-REFINEMENT`.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-003
- **Fuente**: `story-evaluation` · STORY-007 · EPIC-01
- **Categoría de origen**: 2.1.5 Especificación de historias (nivel L1 · fase SPECIFY)
