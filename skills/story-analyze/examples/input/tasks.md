---
alwaysApply: false
type: tasks
id: FEAT-099
slug: FEAT-099-exportar-datos-csv-tasks
title: "Tasks: Exportar datos en CSV"
story: FEAT-099
design: FEAT-099
created: 2026-05-07
updated: 2026-05-07
---

## 1. Setup

- [ ] T001 Crear rama `feat/099-exportar-datos-csv` desde `release/10-data-management`
- [ ] T002 [P] Verificar que `src/services/`, `src/controllers/` y `src/components/` existen en el proyecto

## 2. Servicio de exportación

- [ ] T003 Crear `src/services/csv-export.service.ts` con método `export(userId: string): Promise<Buffer | null>`
- [ ] T004 Implementar consulta de registros del usuario (retorna null si no hay registros)
- [ ] T005 Implementar generación de Buffer CSV siguiendo RFC 4180
- [ ] T006 [P] Escribir test unitario: exportación exitosa genera Buffer con headers correctos
- [ ] T007 [P] Escribir test unitario: sin registros retorna null

## 3. Endpoint de exportación

- [ ] T008 Crear `src/controllers/export.controller.ts` con handler `GET /api/export/csv`
- [ ] T009 Implementar respuesta 200 con header `Content-Disposition: attachment; filename=datos_YYYY-MM-DD.csv`
- [ ] T010 Implementar respuesta 204 cuando `CsvExportService.export` retorna null
- [ ] T011 Implementar manejo de error 500 con log y mensaje amigable
- [ ] T012 Registrar ruta en `src/routes/index.ts` con middleware de autenticación

## 4. Componente de UI

- [ ] T013 Crear `src/components/ExportButton.tsx` con botón "Exportar CSV"
- [ ] T014 [P] Implementar llamada al endpoint y descarga automática del blob
- [ ] T015 [P] Implementar estado de carga (disabled + spinner durante la petición)
- [ ] T016 Implementar mensaje de error en UI cuando el servidor responde 500

## 5. Verificación de criterios de aceptación

- [ ] T017 Verificar AC-1: clic en botón con datos genera y descarga `datos_YYYY-MM-DD.csv`
- [ ] T018 [P] Verificar AC-2: sin datos muestra mensaje "No tienes datos para exportar"
- [ ] T019 [P] Verificar AC-3: ante error del servidor muestra mensaje de error sin estado inconsistente
- [ ] T020 Verificar criterio no funcional: exportación de 10.000 registros completa en < 3 segundos
