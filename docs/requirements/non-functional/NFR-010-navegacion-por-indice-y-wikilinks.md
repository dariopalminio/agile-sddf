---
type: requirement
kind: non-functional
id: NFR-010
slug: NFR-010-navegacion-por-indice-y-wikilinks
title: "Navegación por índice y wikilinks"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# NFR-010 — Navegación por índice y wikilinks

## Descripción

La documentación SHALL ser navegable como grafo mediante wikilinks `[[slug]]`
resueltos contra el campo `slug` del frontmatter, con `docs/index.md` como cursor de entrada
único. Un agente SHALL poder orientarse leyendo solo el índice, sin cargar el corpus completo.

## Criterios de verificación

`docs/index.md` no contiene wikilinks rotos.

## Atributos

- **Prioridad**: Alta
- **Categoría de origen**: 2.2.5 Trazabilidad y auditoría
