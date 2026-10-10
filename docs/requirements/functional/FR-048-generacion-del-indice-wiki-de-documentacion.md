---
type: requirement
kind: functional
id: FR-048
slug: FR-048-generacion-del-indice-wiki-de-documentacion
title: "Generación del índice wiki de documentación"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-048 — Generación del índice wiki de documentación

## Descripción

El sistema SHALL reorganizar `$SPECS_BASE/` como wiki navegable con un
`index.md` que enlace cada nodo mediante wikilink `[[slug]]` y ruta relativa, de modo que un
agente lea primero el índice y abra solo los nodos necesarios (recuperación O(índice), no
O(todos-los-archivos)). Soporta `--update` y `--dry-run`.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-002, US-006
- **Fuente**: `docs-wiki-builder` · STORY-044 · EPIC-09
- **Categoría de origen**: 2.1.8 Documentación, metadatos y seguridad
