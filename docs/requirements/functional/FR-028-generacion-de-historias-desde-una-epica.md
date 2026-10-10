---
type: requirement
kind: functional
id: FR-028
slug: FR-028-generacion-de-historias-desde-una-epica
title: "Generación de historias desde una épica"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-028 — Generación de historias desde una épica

## Descripción

El sistema SHALL crear un directorio `STORY-NNN-slug/` con su `story.md` por
cada ítem de la sección `## Historias` de una épica dada, calculando el siguiente ID libre
mediante el glob `03-stories/STORY-*/`.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-002, US-003
- **Fuente**: `epic-generate-stories` · STORY-029 · EPIC-06
- **Categoría de origen**: 2.1.4 Gestión de épicas (nivel L2)
