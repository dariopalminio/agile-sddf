---
type: requirement
kind: functional
id: FR-044
slug: FR-044-verificacion-por-ejecucion-de-pruebas-fase-verify
title: "Verificación por ejecución de pruebas (fase VERIFY)"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-044 — Verificación por ejecución de pruebas (fase VERIFY)

## Descripción

El sistema SHALL ejecutar las pruebas automatizadas de la historia en un
entorno controlado, detectando el modo de operación (por configuración de `sddf.config.yaml`,
delegado a un worker, e2e, unitario o manual) y produciendo `verify-report.md`. Precondición:
`CODE-REVIEW/DONE`. Si el DoD del estado VERIFY no se cumple, SHALL retroceder la historia a
`READY-FOR-IMPLEMENT/DONE`. Soporta `--mode`, `--dry-run` y `--verbose`.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-002, US-005
- **Fuente**: `story-verify` → agente local `qa-engineer` · STORY-071 · EPIC-13
- **Categoría de origen**: 2.1.7 Implementación y quality gates (nivel L1 · IMPLEMENT → ACCEPTANCE)
