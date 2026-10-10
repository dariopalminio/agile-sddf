---
type: requirement
kind: functional
id: FR-041
slug: FR-041-modos-de-ejecucion-y-reanudacion-de-la
title: "Modos de ejecución y reanudación de la implementación"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-041 — Modos de ejecución y reanudación de la implementación

## Descripción

El sistema SHALL ofrecer un modo interactivo con pausas de confirmación entre
fases del ciclo TDD y un modo automático (`--auto`) apto para CI. SHALL poder reanudar una
implementación parcial desde `IMPLEMENT/IN-PROGRESS`, incorporando las correcciones pendientes
de `fix-directives.md` si existen.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-001, US-005
- **Fuente**: `story-implement` · STORY-067, STORY-082 · EPIC-12, EPIC-14
- **Categoría de origen**: 2.1.7 Implementación y quality gates (nivel L1 · IMPLEMENT → ACCEPTANCE)
