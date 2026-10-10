---
type: requirement
kind: functional
id: FR-017
slug: FR-017-gates-de-revision-humana-entre-fases
title: "Gates de revisión humana entre fases"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-017 — Gates de revisión humana entre fases

## Descripción

El sistema SHALL presentar un resumen del documento generado y solicitar
confirmación del usuario antes de avanzar a la siguiente fase. El documento SHALL avanzar a
`substatus: DONE` solo tras la confirmación. Si el usuario pide ajustes, el control regresa al
agente correspondiente sin perder el trabajo hecho.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-001, US-002
- **Fuente**: STORY-010 · EPIC-02
- **Categoría de origen**: 2.1.2 Pipeline de especificación de proyecto (nivel L3)
