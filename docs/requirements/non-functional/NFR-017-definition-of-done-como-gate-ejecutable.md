---
type: requirement
kind: non-functional
id: NFR-017
slug: NFR-017-definition-of-done-como-gate-ejecutable
title: "Definition of Done como gate ejecutable"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# NFR-017 — Definition of Done como gate ejecutable

## Descripción

El Definition of Done por estado (`docs/policies/dod-story.md`)
SHALL evaluarse programáticamente como condición de avance, no como checklist informativa. Un
DoD incumplido SHALL bloquear la transición y retroceder la historia al estado que corresponda.

## Criterios de verificación

`story-analyze` (PLAN), `story-implement` (IMPLEMENT),
`story-code-review` (CODE-REVIEW), `story-verify` (VERIFY) y `story-acceptance` (ACCEPTANCE)
leen el DoD de su estado y condicionan la transición a su cumplimiento.

## Atributos

- **Prioridad**: Alta
- **Categoría de origen**: 2.2.7 Calidad y verificación
