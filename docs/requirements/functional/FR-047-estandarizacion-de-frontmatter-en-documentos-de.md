---
type: requirement
kind: functional
id: FR-047
slug: FR-047-estandarizacion-de-frontmatter-en-documentos-de
title: "Estandarización de frontmatter en documentos de spec"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# FR-047 — Estandarización de frontmatter en documentos de spec

## Descripción

El sistema SHALL añadir o actualizar el frontmatter YAML canónico (`type`,
`id`, `slug`, `title`, `status`, `substatus`, `parent`, `created`, `updated`, `related`) en
archivos de spec, individualmente o en batch por directorio, derivando cada campo de reglas
explícitas y verificando que los slugs referenciados en `parent` y `related` existen (marcando
`[pendiente]` los que no).

## Atributos

- **Prioridad**: Alta
- **Usuario**: US-005, US-006
- **Fuente**: `header-aggregation` · STORY-043 · EPIC-09
- **Categoría de origen**: 2.1.8 Documentación, metadatos y seguridad
