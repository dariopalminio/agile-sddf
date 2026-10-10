---
type: requirement
kind: non-functional
id: NFR-009
slug: NFR-009-metadatos-de-trazabilidad-en-todos-los-documentos
title: "Metadatos de trazabilidad en todos los documentos generados"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# NFR-009 — Metadatos de trazabilidad en todos los documentos generados

## Descripción

Todo documento de spec generado SHALL incluir el frontmatter canónico con
`type`, `id`, `slug`, `title`, `status`, `substatus`, `parent`, `created`, `updated` y
`related`, con IDs jerárquicos `PROJ-NN` / `EPIC-NN` / `STORY-NNN`. El prefijo del ID nombra el
**nivel**, nunca el tipo de trabajo: el tipo de una historia vive en el campo `kind`
(`feat` | `fix` | `chore` | `hotfix`) y en el prefijo de su rama.

## Criterios de verificación

Ningún directorio de `03-stories/` usa un prefijo distinto de
`STORY-`; el glob `03-stories/STORY-*/story.md` alcanza todas las historias.

## Atributos

- **Prioridad**: Alta
- **Categoría de origen**: 2.2.5 Trazabilidad y auditoría
