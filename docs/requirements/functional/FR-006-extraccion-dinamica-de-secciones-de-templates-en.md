---
type: requirement
kind: functional
id: FR-006
slug: FR-006-extraccion-dinamica-de-secciones-de-templates-en
title: "Extracción dinámica de secciones de templates en runtime"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-006 — Extracción dinámica de secciones de templates en runtime

## Descripción

El sistema SHALL leer los headers `##` y los comentarios `<!-- -->` del
template activo en tiempo de ejecución para derivar preguntas y completar secciones, sin lógica
hardcodeada. Modificar un template SHALL alterar el comportamiento del skill sin editar su
`SKILL.md`.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-002, US-004, US-006
- **Fuente**: EPIC-00 · constitución, patrón 5
- **Categoría de origen**: 2.1.1 Infraestructura y protocolo de entorno
