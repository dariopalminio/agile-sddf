---
type: design
id: STORY-201
slug: STORY-201-exportar-reporte-csv-design
title: "Design: Exportar reporte CSV"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-30-reportes
story: STORY-201
created: 2026-10-10
updated: 2026-10-10
related:
  - STORY-201-exportar-reporte-csv
---

# Diseño técnico: exportar reporte CSV

## Context

El usuario necesita descargar el reporte mensual como CSV para abrirlo en una hoja de cálculo.

## Goals / Non-Goals

- Goal: exportar el reporte visible a CSV (AC-1, AC-2).
- Non-Goal: exportar a XLSX o PDF.

## Decisions

### D-1 — Endpoint de exportación // satisface: AC-1

`GET /reports/:id/export.csv` devuelve `text/csv; charset=utf-8` con `Content-Disposition: attachment`.

### D-2 — Formato del CSV // satisface: AC-1

Separador `;`, una fila de encabezados con los nombres de columna visibles y valores con comillas dobles cuando contienen el separador.

## Componentes afectados

| Componente | Cambio |
|---|---|
| `ReportController` | Nueva acción `exportCsv` |
| `CsvSerializer` | Nuevo módulo |

## Risks / Trade-offs

- Reportes muy grandes: se acepta generar el CSV en memoria; el reporte mensual no supera 5 000 filas.

## Open Questions

Ninguna.
