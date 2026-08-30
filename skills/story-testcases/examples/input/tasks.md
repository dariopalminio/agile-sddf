---
type: tasks
id: STORY-099
slug: STORY-099-exportar-datos-csv
title: "Tasks: Exportar datos en CSV"
story: STORY-099
design: STORY-099
created: 2026-05-01
updated: 2026-05-01
---

## 1. Setup

- [ ] T001 Crear rama feat/099-exportar-datos-csv desde main

## 2. Servicio de exportación

- [ ] T002 Crear src/services/csv-export.service.ts con método export(userId: string): Promise<Buffer | null>
- [ ] T003 Implementar consulta de registros y generación de Buffer CSV (RFC 4180)
- [ ] T004 [P] Escribir test unitario: exportación exitosa genera Buffer con headers correctos
- [ ] T005 [P] Escribir test unitario: sin registros retorna null

## 3. Endpoint REST

- [ ] T006 Crear src/controllers/export.controller.ts con handler GET /api/export/csv
- [ ] T007 Implementar respuestas 200, 204 y 500 con sus contratos definidos en design.md
- [ ] T008 Registrar ruta en src/routes/index.ts con middleware de autenticación

## 4. Componente UI

- [ ] T009 Crear src/components/ExportButton.tsx con estado loading y error
- [ ] T010 Implementar descarga automática del blob en respuesta 200
- [ ] T011 Implementar mensaje "No tienes datos para exportar" en respuesta 204

## 5. Verificación

- [ ] T012 Verificar AC-1: descarga archivo CSV con datos correctos
- [ ] T013 Verificar AC-2: sin datos muestra mensaje correcto
- [ ] T014 Verificar AC-3: ante error del servidor UI no queda inconsistente
