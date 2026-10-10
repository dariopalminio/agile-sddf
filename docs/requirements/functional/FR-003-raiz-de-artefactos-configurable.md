---
type: requirement
kind: functional
id: FR-003
slug: FR-003-raiz-de-artefactos-configurable
title: "Raíz de artefactos configurable"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-003 — Raíz de artefactos configurable

## Descripción

El sistema SHALL resolver la ruta base de especificaciones desde la variable
de entorno `SDDF_ROOT`, con `docs/` como valor por defecto. Si `SDDF_ROOT` está definida pero
la ruta no existe, SHALL usar el valor por defecto y emitir una advertencia explícita.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-001, US-002
- **Fuente**: STORY-049 · EPIC-10
- **Categoría de origen**: 2.1.1 Infraestructura y protocolo de entorno
