---
type: requirement
kind: functional
id: FR-005
slug: FR-005-templates-centralizados-como-fuente-unica
title: "Templates centralizados como fuente única"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-005 — Templates centralizados como fuente única

## Descripción

Los templates de spec SHALL residir en `$SPECS_BASE/specs/templates/` como
fuente única de verdad. Cada skill SHALL resolverlos con la cadena de fallback
`central → seed local del skill → error`, emitiendo un `WARNING` cuando cae al seed.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-002, US-006
- **Fuente**: STORY-055 · EPIC-11 · ADR-0001
- **Categoría de origen**: 2.1.1 Infraestructura y protocolo de entorno
