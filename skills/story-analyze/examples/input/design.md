---
alwaysApply: false
type: design
id: FEAT-099
slug: FEAT-099-exportar-datos-csv-design
title: "Design: Exportar datos en CSV"
story: FEAT-099
created: 2026-05-07
updated: 2026-05-07
---

# Design: Exportar datos en CSV

## Contexto

**Historia de origen:** FEAT-099 — Exportar datos en CSV

El usuario necesita descargar sus datos en CSV desde un botón en la UI. El flujo involucra un servicio backend que consulta y serializa los datos, un endpoint HTTP que devuelve el archivo, y un componente frontend que dispara la descarga automática.

---

## Componentes Afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| CsvExportService | crear | `src/services/csv-export.service.ts` | AC-1, AC-2 |
| ExportController | crear | `src/controllers/export.controller.ts` | AC-1, AC-2, AC-3 |
| ExportButton | crear | `src/components/ExportButton.tsx` | AC-1, AC-2, AC-3 |

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| CsvExportService.export(userId) | `export(userId: string): Promise<Buffer \| null>` — retorna null si no hay datos | AC-1, AC-2 |
| GET /api/export/csv | 200 + Buffer CSV \| 204 sin contenido \| 500 error | AC-1, AC-2, AC-3 |

## Flujos Clave

```
Usuario clic "Exportar CSV"
  → ExportButton llama GET /api/export/csv
  → ExportController invoca CsvExportService.export(userId)
    → Con datos: genera Buffer RFC 4180, retorna 200 + Content-Disposition
    → Sin datos: retorna null → 204
    → Error: log + retorna 500 con mensaje amigable
  → ExportButton: 200 → descarga automática | 204 → mensaje | 500 → error UI
```

## Decisiones Técnicas

| Decisión | Opción elegida | Alternativas rechazadas | Justificación |
|---|---|---|---|
| Formato de serialización | RFC 4180 con Buffer en memoria | Stream por chunks | Hasta 10k filas cabe en memoria; sin complejidad de streaming |
| Autenticación del endpoint | Middleware de autenticación existente | Token ad-hoc | Reutiliza el patrón existente del proyecto (P3) |

## Contratos de Verificación

| # | Criterio | Método | AC origen |
|---|---|---|---|
| 1 | Clic con datos genera y descarga `datos_YYYY-MM-DD.csv` | Manual | AC-1 |
| 2 | Sin datos muestra "No tienes datos para exportar" | Manual | AC-2 |
| 3 | Error del servidor muestra mensaje amigable sin spinner bloqueado | Manual | AC-3 |
| 4 | 10.000 registros < 3 segundos | Performance test | NFR rendimiento |

## Registro de Cambios (CR)

Sin CRs detectados.
