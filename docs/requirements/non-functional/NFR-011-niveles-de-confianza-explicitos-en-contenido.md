---
type: requirement
kind: non-functional
id: NFR-011
slug: NFR-011-niveles-de-confianza-explicitos-en-contenido
title: "Niveles de confianza explícitos en contenido inferido"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# NFR-011 — Niveles de confianza explícitos en contenido inferido

## Descripción

Todo contenido generado por inferencia SHALL marcarse con su nivel de
confianza: `DIRECT` (confirmado en el código), `INFERRED` (derivado por análisis), `SUGGESTED`
(hipótesis que requiere confirmación). El contenido no provisto por el usuario SHALL marcarse
`[inferido]` en el documento resultante.

## Criterios de verificación

Los archivos intermedios en `.tmp/<skill-name>/` contienen etiquetas
de confianza por ítem.

## Atributos

- **Prioridad**: Alta
- **Categoría de origen**: 2.2.5 Trazabilidad y auditoría
