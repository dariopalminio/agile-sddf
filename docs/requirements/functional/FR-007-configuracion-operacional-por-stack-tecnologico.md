---
type: requirement
kind: functional
id: FR-007
slug: FR-007-configuracion-operacional-por-stack-tecnologico
title: "Configuración operacional por stack tecnológico"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-007 — Configuración operacional por stack tecnológico

## Descripción

El sistema SHALL leer `sddf.config.yaml` de la raíz del proyecto para resolver
(a) el modelo de entrega (`batch` | `continuous`), (b) el comando y la obligatoriedad de cada
tipo de prueba (`unit`, `component`, `integration`, `contract`, `e2e` y sus variantes,
`performance`, `eval`) consumidos por `story-verify`, y (c) los skills *worker* delegados para
generar tests (`test_generators`) e implementar código por capa (`code_generators`) consumidos
por `story-implement`. Añadir soporte a un stack nuevo SHALL requerir solo editar este archivo.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-002, US-005
- **Fuente**: `sddf.config.yaml` · STORY-085 · EPIC-14, EPIC-16
- **Categoría de origen**: 2.1.1 Infraestructura y protocolo de entorno
