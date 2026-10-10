---
type: requirement
kind: functional
id: FR-037
slug: FR-037-generacion-de-casos-de-prueba-tipificados
title: "Generación de casos de prueba tipificados"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-037 — Generación de casos de prueba tipificados

## Descripción

El sistema SHALL producir `testcases.md` a partir de `story.md` y `design.md`,
con casos identificados `TC-NNN` y tipificados (UT / CT / IT / API / E2E / EV), trazables 1:1
contra los escenarios Gherkin. Precondición: ambos documentos de entrada deben existir.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-003, US-004
- **Fuente**: `story-testcases` · STORY-079 · EPIC-14
- **Categoría de origen**: 2.1.6 Planificación de historia (nivel L1 · fase PLAN)
