---
type: requirement
kind: functional
id: FR-015
slug: FR-015-generacion-de-politicas-de-proyecto
title: "Generación de políticas de proyecto"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-015 — Generación de políticas de proyecto

## Descripción

El sistema SHALL inicializar o actualizar `constitution.md` (principios
técnicos inamovibles, stack, convenciones) y `dod-story.md` (DoD por estado del
workflow), y SHALL registrar la referencia a ambos en el archivo de instrucciones del runtime
(`CLAUDE.md` / `AGENTS.md`) para que se carguen en cada sesión.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-002, US-005
- **Fuente**: `project-policies-generation` · STORY-056 · EPIC-12
- **Categoría de origen**: 2.1.2 Pipeline de especificación de proyecto (nivel L3)
