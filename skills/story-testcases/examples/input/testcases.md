---
type: testcases
id: STORY-099
slug: STORY-099-exportar-datos-csv-testcases
title: "Test Cases: Exportar datos en CSV"
story: STORY-099
created: 2026-06-13
updated: 2026-06-13
related:
  - STORY-099-exportar-datos-csv
---

<!-- Referencias -->
[[STORY-099-exportar-datos-csv]]

# Casos de Prueba: Exportar datos en CSV

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | 5 |
| CT   | 3 |
| IT   | 2 |
| API  | 3 |
| E2E  | 3 |
| EV   | 0 |

## Tabla de casos

<!-- Reglas de columnas:
  ID      : prefijo-NNN donde prefijo ∈ {UT, CT, IT, API, E2E, EV, ST}; NNN secuencial desde 001
  Tipo    : Unit | Component | Integration | API | End-to-End | Eval | Store
  Escenario: descripción breve en lenguaje natural — no Gherkin estricto
  Dado    : precondición del escenario
  Cuando  : acción que dispara el comportamiento
  Entonces: resultado esperado verificable
  Ref     : AC-N (origen story.md) | D-N / sección X.Y (origen design.md) | T-NNN (origen tasks.md)
-->

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| UT-001 | Unit | export() retorna Buffer con CSV válido cuando hay registros | userId con al menos un registro en base de datos | Se llama export(userId) | Retorna Buffer no nulo con cabecera CSV y una fila por registro conforme RFC 4180 | D-1, AC-1 |
| UT-002 | Unit | export() retorna null cuando el usuario no tiene registros | userId sin registros en base de datos | Se llama export(userId) | Retorna null | D-1, AC-2 |
| UT-003 | Unit | export() escapa campos con comas y comillas correctamente | Registro con campo que contiene coma y/o comilla doble | Se llama export(userId) | El Buffer resultante contiene los campos escapados conforme RFC 4180 | D-1 |
| UT-004 | Unit | Buffer generado contiene fila de encabezados correctos | userId con registros | Se llama export(userId) | Primera fila del Buffer es la cabecera con nombres de columna | D-1, T004 |
| UT-005 | Unit | export() retorna null (verificación adicional desde tarea) | userId sin registros | Se llama export(userId) | Retorna null sin lanzar excepción | D-1, T005 |
| CT-001 | Component | ExportButton renderiza en estado idle | Componente montado sin petición activa | Se renderiza ExportButton | Botón visible, habilitado, sin mensaje de error | D-3 |
| CT-002 | Component | ExportButton muestra estado de carga y deshabilita botón | Petición en curso (loading=true) | Se renderiza ExportButton durante petición | Botón deshabilitado; indicador de carga visible | D-3, AC-1 |
| CT-003 | Component | ExportButton muestra mensaje de error cuando error≠null | Estado interno error con mensaje | Se renderiza ExportButton con error | Mensaje de error visible; estado de datos sin cambio | D-3, AC-3 |
| IT-001 | Integration | Flujo completo: click en botón dispara petición y descarga CSV | Usuario autenticado con registros, ExportButton montado | Usuario hace clic en botón "Exportar CSV" | Se realiza GET /api/export/csv; se recibe 200 y se descarga archivo CSV | D-2, D-3, AC-1 |
| IT-002 | Integration | Ruta GET /api/export/csv rechaza petición sin autenticación | Usuario no autenticado (sin token) | Se hace GET /api/export/csv | Respuesta 401; no se ejecuta la lógica del controlador | D-2, T008 |
| API-001 | API | GET /api/export/csv retorna 200 con Content-Disposition correcto | Usuario autenticado con registros | GET /api/export/csv | 200 OK; header Content-Disposition: attachment; filename=datos_YYYY-MM-DD.csv; cuerpo Buffer CSV | D-2, AC-1 |
| API-002 | API | GET /api/export/csv retorna 204 sin cuerpo cuando no hay datos | Usuario autenticado sin registros | GET /api/export/csv | 204 No Content; cuerpo vacío | D-2, AC-2 |
| API-003 | API | GET /api/export/csv retorna 500 con JSON de error cuando falla el servicio | Servicio lanza excepción interna | GET /api/export/csv | 500; body { "error": "mensaje amigable" }; error registrado en logs | D-2, AC-3 |
| E2E-001 | End-to-End | Exportación exitosa con datos | Usuario autenticado con al menos un registro | Usuario hace clic en "Exportar CSV" | Se descarga archivo datos_YYYY-MM-DD.csv con encabezados y filas; cumple RFC 4180 | AC-1 |
| E2E-002 | End-to-End | Sin datos disponibles | Usuario autenticado sin registros | Usuario hace clic en "Exportar CSV" | Se muestra "No tienes datos para exportar"; no se descarga ningún archivo | AC-2 |
| E2E-003 | End-to-End | Error del servidor | Servidor falla al procesar la exportación | Usuario hace clic en "Exportar CSV" | Se muestra mensaje de error amigable; UI queda consistente; error registrado en logs | AC-3 |

## Notas de cobertura

- `tasks.md` fue utilizado como fuente complementaria: las tareas T004, T005 y T008 aportaron UT-004, UT-005 e IT-002 respectivamente.
- Los 3 escenarios Gherkin de `story.md` tienen correspondencia directa 1-a-1 con E2E-001, E2E-002 y E2E-003.
- El criterio no funcional de rendimiento (exportacion <= 3s para 10.000 registros) no se traduce a caso PT porque el alcance del skill excluye pruebas de performance no especificadas como carga/estres formal en los ACs. Si se desea cobertura PT, debe definirse explicitamente en story.md o design.md.
- UT-002 y UT-005 cubren la misma condicion (null sin registros); UT-005 se mantiene para trazabilidad con T005.

## Test Cases Progress for STORY-099

<!-- Generado automaticamente por story-testcases. Actualizado por story-implement en fase GREEN.
     [x] = test paso | [ ] = pendiente | [!] = test fallo -->
- [ ] UT-001: export() retorna Buffer con CSV valido cuando hay registros
- [ ] UT-002: export() retorna null cuando el usuario no tiene registros
- [ ] UT-003: export() escapa campos con comas y comillas correctamente
- [ ] UT-004: Buffer generado contiene fila de encabezados correctos
- [ ] UT-005: export() retorna null (verificacion adicional desde tarea)
- [ ] CT-001: ExportButton renderiza en estado idle
- [ ] CT-002: ExportButton muestra estado de carga y deshabilita boton
- [ ] CT-003: ExportButton muestra mensaje de error cuando error null
- [ ] IT-001: Flujo completo: click en boton dispara peticion y descarga CSV
- [ ] IT-002: Ruta GET /api/export/csv rechaza peticion sin autenticacion
- [ ] API-001: GET /api/export/csv retorna 200 con Content-Disposition correcto
- [ ] API-002: GET /api/export/csv retorna 204 sin cuerpo cuando no hay datos
- [ ] API-003: GET /api/export/csv retorna 500 con JSON de error cuando falla el servicio
- [ ] E2E-001: Exportacion exitosa con datos
- [ ] E2E-002: Sin datos disponibles
- [ ] E2E-003: Error del servidor
