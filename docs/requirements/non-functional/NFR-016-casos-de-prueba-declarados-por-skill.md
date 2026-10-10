---
type: requirement
kind: non-functional
id: NFR-016
slug: NFR-016-casos-de-prueba-declarados-por-skill
title: "Casos de prueba declarados por skill"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# NFR-016 — Casos de prueba declarados por skill

## Descripción

Los skills críticos SHALL declarar sus casos de prueba en `evals/evals.json`
conforme al esquema estandarizado, y los casos SHALL definirse **antes** que el `SKILL.md`
(TDD aplicado a skills).

## Criterios de verificación

Cobertura actual 23 de 34 skills (68%). Todo skill nuevo se publica
con `evals/evals.json`.

## Atributos

- **Prioridad**: Alta
- **Categoría de origen**: 2.2.7 Calidad y verificación
