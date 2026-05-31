---
type: testcases
id: FEAT-099
slug: FEAT-099-exportar-datos-csv-testcases
title: "Test Cases: Exportar datos en CSV"
story: FEAT-099
created: 2026-05-01
updated: 2026-05-01
related:
  - FEAT-099-exportar-datos-csv
---

<!-- Referencias -->
[[FEAT-099-exportar-datos-csv]]

# Casos de Prueba: Exportar datos en CSV

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | 4 |
| CT   | 2 |
| IT   | 1 |
| API  | 3 |
| E2E  | 3 |
| EV   | 0 |

## Tabla de casos

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| UT-001 | Unit | CsvExportService.export retorna Buffer con datos correctos | userId válido con al menos un registro en BD | se llama export(userId) | retorna un Buffer cuyo contenido comienza con la fila de encabezados y contiene una fila por registro | D-1 |
| UT-002 | Unit | CsvExportService.export retorna null si no hay registros | userId válido sin registros en BD | se llama export(userId) | retorna null | D-1 |
| UT-003 | Unit | CsvExportService escapa campos con comas | registro que contiene una coma en el valor de un campo | se genera el CSV | el campo queda envuelto en comillas dobles según RFC 4180 | D-1 |
| UT-004 | Unit | CsvExportService escapa campos con comillas dobles | registro que contiene una comilla doble en el valor de un campo | se genera el CSV | la comilla doble queda escapada como dos comillas dobles según RFC 4180 | D-1 |
| CT-001 | Component | ExportButton se renderiza con texto "Exportar CSV" | componente montado en estado inicial | renderizado inicial | el botón muestra "Exportar CSV" y está habilitado | D-3 |
| CT-002 | Component | ExportButton queda deshabilitado durante la exportación | componente montado | el usuario hace clic y la petición está en curso (loading=true) | el botón está deshabilitado y muestra un indicador de carga | D-3 |
| IT-001 | Integration | ExportController llama a CsvExportService y retorna el buffer como descarga | servidor iniciado, CsvExportService configurado con datos de prueba | cliente envía GET /api/export/csv con token válido | respuesta 200 con header Content-Disposition que incluye el nombre de archivo con fecha de hoy | D-2 |
| API-001 | API | GET /api/export/csv — exportación exitosa con datos | usuario autenticado con al menos un registro | GET /api/export/csv | 200 + Content-Disposition: attachment; filename=datos_YYYY-MM-DD.csv + body es Buffer CSV válido | D-2 |
| API-002 | API | GET /api/export/csv — sin datos disponibles | usuario autenticado sin registros | GET /api/export/csv | 204 sin body | D-2 |
| API-003 | API | GET /api/export/csv — error del servidor | CsvExportService lanza excepción | GET /api/export/csv | 500 + JSON { "error": "mensaje amigable" } + error registrado en logs | D-2 |
| E2E-001 | End-to-End | Exportación exitosa: descarga archivo CSV con datos del usuario | usuario autenticado con al menos un registro en la plataforma | usuario hace clic en botón "Exportar CSV" | se descarga archivo datos_YYYY-MM-DD.csv que contiene encabezados y una fila por registro, siguiendo RFC 4180 | AC-1 |
| E2E-002 | End-to-End | Sin datos: se muestra mensaje informativo sin descarga | usuario autenticado sin registros en la plataforma | usuario hace clic en botón "Exportar CSV" | se muestra el mensaje "No tienes datos para exportar" y no se descarga ningún archivo | AC-2 |
| E2E-003 | End-to-End | Error del servidor: UI no queda en estado inconsistente | el servidor falla al procesar la exportación | usuario hace clic en botón "Exportar CSV" | se muestra un mensaje de error amigable, el botón vuelve a estar habilitado, y los datos visibles en la UI no cambian | AC-3 |

## Notas de cobertura

- Los casos UT-001..UT-004 derivan de D-1 (CsvExportService). Se cubren happy path, caso sin datos y dos casos de escapado de caracteres especiales.
- CT-001..CT-002 derivan de D-3 (componente React ExportButton). Se verifica renderizado inicial y estado de carga.
- IT-001 verifica la integración entre ExportController y CsvExportService a través del endpoint real.
- API-001..API-003 mapean los tres contratos de respuesta definidos en D-2.
- E2E-001..E2E-003 trazan 1-a-1 los tres escenarios Gherkin de story.md (AC-1, AC-2, AC-3).
- tasks.md no fue usado como fuente (no hay casos T-NNN) — se usó solo story.md y design.md.
- Criterio no funcional (< 3 segundos para 10.000 registros) no genera caso en esta tabla; se verifica en el ciclo de performance tests del proyecto.
