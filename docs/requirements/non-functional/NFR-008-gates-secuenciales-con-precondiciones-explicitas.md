---
type: requirement
kind: non-functional
id: NFR-008
slug: NFR-008-gates-secuenciales-con-precondiciones-explicitas
title: "Gates secuenciales con precondiciones explícitas"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# NFR-008 — Gates secuenciales con precondiciones explícitas

## Descripción

Cada skill SHALL verificar que el artefacto del paso anterior existe y es
válido antes de ejecutar, deteniéndose con un mensaje accionable si la precondición no se
cumple. Ningún skill SHALL avanzar sobre un documento de entrada que no esté en el estado
requerido.

## Criterios de verificación

`story-verify` no ejecuta si `story.md` no está en `CODE-REVIEW/DONE`;
`epic-generate-stories` no ejecuta si la épica no supera `epic-format-validation`.

## Atributos

- **Prioridad**: Alta
- **Categoría de origen**: 2.2.4 Máquina de estados y control de flujo
