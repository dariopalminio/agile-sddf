---
type: requirement
kind: non-functional
id: NFR-007
slug: NFR-007-limite-de-trabajo-en-curso-por-nivel
title: "Límite de trabajo en curso por nivel"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# NFR-007 — Límite de trabajo en curso por nivel

## Descripción

Solo un documento SHALL tener `substatus: IN-PROGRESS` a la vez por nivel del
pipeline (proyecto, épica, historia). Todo skill que active un ítem SHALL verificarlo antes.

## Criterios de verificación

Ante un segundo ítem activo, el skill se detiene y presenta las
opciones «Sobrescribir» / «Retomar».

## Atributos

- **Prioridad**: Alta
- **Categoría de origen**: 2.2.4 Máquina de estados y control de flujo
