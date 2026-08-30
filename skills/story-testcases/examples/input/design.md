---
type: design
id: STORY-099
slug: STORY-099-exportar-datos-csv-design
title: "Design: Exportar datos en CSV"
story: STORY-099
created: 2026-05-01
updated: 2026-05-01
---

## Context

Añadir capacidad de exportación CSV en la plataforma existente (Node.js + Express + React).
El servicio de exportación transforma los datos del usuario en un buffer CSV, que el controlador
entrega como descarga. El componente de UI activa la llamada y gestiona el estado de carga y error.

## Goals / Non-Goals

**Goals:** Exportación CSV para el usuario autenticado; manejo de vacío, error y carga.
**Non-Goals:** Exportación de otros formatos; exportación en background/async.

## Decisions

### D-1: CsvExportService — lógica de generación del buffer // satisface: AC-1, AC-2

Método público: `export(userId: string): Promise<Buffer | null>`

- Consulta los registros del usuario
- Retorna `null` si no hay registros (AC-2)
- Retorna `Buffer` con CSV RFC 4180 si hay registros (AC-1)
- Los campos que contienen comas o comillas se escapan correctamente

**Alternativa rechazada — retornar string:** rechazada porque Buffer es el tipo correcto para descarga binaria en Express.

### D-2: ExportController — endpoint REST // satisface: AC-1, AC-2, AC-3

Ruta: `GET /api/export/csv`

| Condición | Código | Respuesta |
|-----------|--------|-----------|
| Exportación exitosa | 200 | Buffer CSV con `Content-Disposition: attachment; filename=datos_YYYY-MM-DD.csv` |
| Sin datos | 204 | Cuerpo vacío |
| Error del servidor | 500 | JSON `{ "error": "mensaje amigable" }` + log |

### D-3: ExportButton (componente React) // satisface: AC-1, AC-2, AC-3

Props: ninguna. Estado interno: `loading: boolean`, `error: string | null`.

- `loading=true` mientras dura la petición (botón deshabilitado)
- En 200: descarga automática del blob recibido
- En 204: muestra mensaje "No tienes datos para exportar"
- En 500: muestra `error` en la UI sin cambiar el estado de datos

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|-----------|
| Exportación lenta para 10.000+ registros | Límite de 10.000 filas + timeout de 3s en cliente |
| Memoria por buffer grande | Usar streams en versión futura (fuera de alcance actual) |

## Open Questions

Sin preguntas abiertas.
