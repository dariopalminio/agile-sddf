---
type: testcases
id: STORY-206
slug: STORY-206-importar-usuarios-csv-testcases
title: "Test Cases: Importar usuarios desde CSV"
story: STORY-206
created: 2026-10-12
updated: 2026-10-12
related:
  - STORY-206-importar-usuarios-csv
---

<!-- Referencias -->
[[STORY-206-importar-usuarios-csv]]

# Casos de Prueba: Importar usuarios desde CSV

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | 1 |
| CT   | 0 |
| IT   | 0 |
| API  | 2 |
| E2E  | 0 |
| EV   | 0 |

## Tabla de casos

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| UT-001 | Unit | El parser convierte cada fila en un usuario | CSV con 3 filas `email;nombre` válidas | se parsea el archivo | devuelve 3 usuarios con email y nombre | D-1, AC-1 |
| API-001 | API | Importación exitosa | administrador autenticado y CSV con 3 filas válidas | POST /users/import | 201 con `{ "created": 3 }` | D-1, AC-1 |
| API-002 | API | Archivo demasiado grande | administrador autenticado y CSV de 2,5 MB | POST /users/import | 413 si el archivo supera 2 MB | D-3 |

## Notas de cobertura

Sin observaciones.

## Test Cases Progress for STORY-206

- [ ] UT-001
- [ ] API-001
- [ ] API-002
