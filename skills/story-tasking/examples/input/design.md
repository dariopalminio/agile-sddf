---
alwaysApply: false
type: design
id: FEAT-099
slug: FEAT-099-exportar-datos-csv
title: "Design: Exportar datos en CSV"
story: FEAT-099-exportar-datos-csv
created: 2026-05-07
updated: 2026-05-07
---

# Design: Exportar datos en CSV

<!-- TRAZABILIDAD: este diseño cubre AC-1 (exportación exitosa), AC-2 (sin datos), AC-3 (error) -->

## 📋 Contexto

**Historia:** FEAT-099 — Exportar datos en CSV

**Problema técnico:** La plataforma no tiene mecanismo de exportación. Se necesita un endpoint que genere CSV a demanda y una acción en el frontend que lo descargue.

## 🔍 Decisiones de Diseño

### Decisión: Generación en memoria vs streaming

**Opción elegida:** Generación en memoria para ≤ 10.000 registros

**Justificación:** El límite de 10.000 registros (criterio no funcional) hace que la generación en memoria sea suficiente y más simple que un stream. El criterio de ≤ 3 segundos es alcanzable con este enfoque.

## 🏗️ Plan de Implementación

### Componentes Afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| `CsvExportService` | crear | `src/services/csv-export.service.ts` | AC-1, AC-2, AC-3 |
| `ExportController` | crear | `src/controllers/export.controller.ts` | AC-1, AC-2 |
| `ExportButton` | crear | `src/components/ExportButton.tsx` | AC-1 |
| `exportRoutes` | modificar | `src/routes/index.ts` | AC-1 |

### Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| `CsvExportService.export(userId)` | `userId: string → Promise<Buffer \| null>` — null si sin datos | AC-1, AC-2 |
| `GET /api/export/csv` | Auth required → 200 + blob \| 204 sin datos \| 500 error | AC-1, AC-2, AC-3 |

### Comportamiento ante Fallos

| Dependencia | Comportamiento ante fallo | Estrategia |
|---|---|---|
| Base de datos no responde | 500 con mensaje amigable + log de error | Catch + respuesta de error (AC-3) |
| Sin registros del usuario | 204 No Content + mensaje en UI | Validación temprana (AC-2) |
