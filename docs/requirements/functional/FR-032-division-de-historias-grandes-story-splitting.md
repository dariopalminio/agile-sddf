---
type: requirement
kind: functional
id: FR-032
slug: FR-032-division-de-historias-grandes-story-splitting
title: "División de historias grandes (story splitting)"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-032 — División de historias grandes (story splitting)

## Descripción

El sistema SHALL dividir historias grandes aplicando uno de los 8 patrones de
Richard Lawrence (pasos de flujo, variaciones de reglas de negocio, variaciones de datos,
complejidad de criterios, esfuerzo mayor, dependencias externas, pasos DevOps, TADs). SHALL
reutilizar el directorio original como historia *core* (`--core N`) en vez de dejarlo huérfano,
y SHALL soportar `--pattern N` y `--dry-run`. Las historias derivadas del patrón 8 (TADs) no se
guardan como archivos de historia.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-003
- **Fuente**: `story-split` · STORY-012, STORY-063 · EPIC-01, EPIC-12
- **Categoría de origen**: 2.1.5 Especificación de historias (nivel L1 · fase SPECIFY)
