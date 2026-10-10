---
type: requirement
kind: functional
id: FR-002
slug: FR-002-protocolo-de-verificacion-de-entorno-como-paso-0
title: "Protocolo de verificación de entorno como Paso 0"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-002 — Protocolo de verificación de entorno como Paso 0

## Descripción

El sistema SHALL exponer un protocolo centralizado de verificación que todo
skill invoca **antes** de ejecutar cualquier lógica de negocio, comprobando `SDDF_ROOT`, la
estructura de directorios y la disponibilidad de los templates requeridos, y devolviendo un
informe `OK` / `WARNING` / `ERROR`. Ningún skill SHALL ejecutar lógica de dominio con el
entorno en `ERROR`.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-001, US-006
- **Fuente**: `skill-preflight` · STORY-053 · EPIC-10 · constitución, principio 7
- **Categoría de origen**: 2.1.1 Infraestructura y protocolo de entorno
