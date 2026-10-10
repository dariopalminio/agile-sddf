---
type: requirement
kind: functional
id: FR-040
slug: FR-040-implementacion-guiada-por-tdd
title: "Implementación guiada por TDD"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-040 — Implementación guiada por TDD

## Descripción

El sistema SHALL implementar la historia siguiendo el ciclo TDD completo:
**RED** (validar configuración y generar las pruebas que fallan), **GREEN** (implementar el
código mínimo que las hace pasar) y **REFACTOR** (mejorar el código sin romper la suite). Las
fases de generación de tests y de código SHALL delegarse a los skills *worker* declarados en
`sddf.config.yaml` (`test_generators` / `code_generators`), de modo que el orquestador
permanezca agnóstico al stack. Produce código, pruebas e `implement-report.md`, y deja la
historia en `IMPLEMENT/DONE`.

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-001, US-002
- **Fuente**: `story-implement` · STORY-061, STORY-078, STORY-081 · EPIC-12, EPIC-14
- **Categoría de origen**: 2.1.7 Implementación y quality gates (nivel L1 · IMPLEMENT → ACCEPTANCE)
