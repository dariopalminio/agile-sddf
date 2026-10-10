---
type: requirement
kind: functional
id: FR-001
slug: FR-001-inicializacion-del-entorno-sddf
title: "Inicialización del entorno SDDF"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-001 — Inicialización del entorno SDDF

## Descripción

El sistema SHALL crear la estructura base de artefactos
(`$SPECS_BASE/specs/01-projects/`, `02-epics/`, `03-stories/`, `templates/`), el archivo de
configuración `sddf.config.yaml`, el `.env.template` y los templates centrales, delegando la
generación de políticas a `project-policies-generation`. La operación SHALL ser idempotente: no
sobrescribe archivos existentes.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-001, US-002
- **Fuente**: `sddf-init` · STORY-054 · EPIC-10
- **Categoría de origen**: 2.1.1 Infraestructura y protocolo de entorno
