---
type: requirement
kind: functional
id: FR-016
slug: FR-016-control-de-work-in-progress-wip-1-por-nivel
title: "Control de Work-In-Progress (WIP = 1) por nivel"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-016 — Control de Work-In-Progress (WIP = 1) por nivel

## Descripción

El sistema SHALL verificar, antes de activar un work item, que no exista otro
documento con `substatus: IN-PROGRESS` en el mismo nivel del pipeline. Ante conflicto SHALL
presentar exactamente dos opciones: «Sobrescribir» o «Retomar». No SHALL permitir dos ítems
activos simultáneos en un nivel sin confirmación explícita.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-001, US-002
- **Fuente**: STORY-008 · EPIC-02 · constitución, regla 9
- **Categoría de origen**: 2.1.2 Pipeline de especificación de proyecto (nivel L3)
