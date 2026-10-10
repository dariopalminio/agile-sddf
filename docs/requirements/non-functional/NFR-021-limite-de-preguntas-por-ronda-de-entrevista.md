---
type: requirement
kind: non-functional
id: NFR-021
slug: NFR-021-limite-de-preguntas-por-ronda-de-entrevista
title: "Límite de preguntas por ronda de entrevista"
status: active
created: 2026-10-10
updated: 2026-10-10
related: []
---

# NFR-021 — Límite de preguntas por ronda de entrevista

## Descripción

Los agentes conversacionales SHALL agrupar un máximo de 3-4 preguntas por
ronda, derivándolas dinámicamente de los comentarios `<!-- -->` del template activo en runtime,
nunca de un listado hardcodeado.

## Criterios de verificación

En ninguna ronda un agente formula más de 4 preguntas.

## Atributos

- **Prioridad**: Alta
- **Categoría de origen**: 2.2.9 Usabilidad y experiencia del desarrollador
