---
type: tasks
id: STORY-201
slug: STORY-201-exportar-reporte-csv-tasks
title: "Tasks: Exportar reporte CSV"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-30-reportes
story: STORY-201
created: 2026-10-10
updated: 2026-10-10
related:
  - STORY-201-exportar-reporte-csv
  - STORY-201-exportar-reporte-csv-design
---

# Tasks: exportar reporte CSV

## 1. Preparación

- [ ] T001 Crear el módulo vacío `CsvSerializer` con su archivo de pruebas — D-2, AC-1

## 2. Implementación

- [ ] T002 Añadir la acción `exportCsv` en `ReportController` y la ruta `GET /reports/:id/export.csv` (requiere T001) — D-1, AC-1
- [ ] T003 Implementar `CsvSerializer.serialize(rows)` con separador `,` y fila de encabezados (requiere T001) — D-2, AC-1
- [ ] T004 Conectar `exportCsv` con `CsvSerializer` y fijar las cabeceras HTTP de D-1 (requiere T002, T003) — D-1, AC-1
- [ ] T005 Añadir caché en memoria de los reportes exportados (requiere T004)

## 3. Verificación

- [ ] T006 Prueba de integración: descargar el CSV de un reporte con datos y comprobar separador y encabezados (requiere T004, T005) — AC-1
