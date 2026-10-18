---
type: tasks
id: STORY-202
slug: STORY-202-filtrar-reporte-por-fecha-tasks
title: "Tasks: Filtrar reporte por fecha"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: EPIC-30-reportes
story: STORY-202
created: 2026-10-11
updated: 2026-10-11
---

# Tasks: filtrar reporte por fecha

## 1. Implementación

- [ ] T001 Parsear y validar `from` y `to` en `ReportController` — D-1, AC-1
- [ ] T002 Filtrar las filas del reporte por el rango inclusivo (requiere T001) — D-1, AC-1
- [ ] T003 Responder `400` «Rango de fechas inválido» cuando `from` > `to` (requiere T001) — D-2, AC-2

## 2. Verificación

- [ ] T004 Pruebas de integración para rango válido e inválido (requiere T002, T003) — AC-1, AC-2
