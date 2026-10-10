---
type: requirement
kind: functional
id: FR-027
slug: FR-027-validacion-de-formato-de-epica-gate
title: "Validación de formato de épica (gate)"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-027 — Validación de formato de épica (gate)

## Descripción

El sistema SHALL validar que un `epic.md` cumple la estructura obligatoria
derivada en runtime del template, produciendo un veredicto `APROBADO`, `REFINAR` (con la lista
de secciones faltantes) o `RECHAZADO`. Esta validación SHALL ser precondición de la generación
de historias.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-002, US-004
- **Fuente**: `epic-format-validation` · STORY-027 · EPIC-06 · constitución, patrón 15
- **Categoría de origen**: 2.1.4 Gestión de épicas (nivel L2)
