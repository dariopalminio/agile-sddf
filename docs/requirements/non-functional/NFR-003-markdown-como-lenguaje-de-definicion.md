---
type: requirement
kind: non-functional
id: NFR-003
slug: NFR-003-markdown-como-lenguaje-de-definicion
title: "Markdown como lenguaje de definición"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# NFR-003 — Markdown como lenguaje de definición

## Descripción

Skills, agentes y templates SHALL definirse exclusivamente en Markdown, con
frontmatter YAML estandarizado. No SHALL haber lógica de negocio fuera de archivos Markdown en
el pipeline principal: la lógica de dominio vive en los templates (estructura) y en los agentes
(criterios); el skill orquesta.

## Criterios de verificación

`skills/` y `agents/` contienen solo `.md` y subdirectorios de
recursos (`assets/`, `examples/`, `evals/`, `agents/`, `scripts/`).

## Atributos

- **Prioridad**: Alta
- **Categoría de origen**: 2.2.2 Formato declarativo y superficie ejecutable
