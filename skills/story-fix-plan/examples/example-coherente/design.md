---
type: design
id: STORY-202
slug: STORY-202-filtrar-reporte-por-fecha-design
title: "Design: Filtrar reporte por fecha"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: EPIC-30-reportes
story: STORY-202
created: 2026-10-11
updated: 2026-10-11
---

# Diseño técnico: filtrar reporte por fecha

## Decisions

### D-1 — Parámetros de rango // satisface: AC-1

`GET /reports/:id?from=YYYY-MM-DD&to=YYYY-MM-DD`, ambos inclusivos.

### D-2 — Rango inválido // satisface: AC-2

Si `from` es posterior a `to`, responde `400` con el mensaje «Rango de fechas inválido».

## Open Questions

Ninguna.
