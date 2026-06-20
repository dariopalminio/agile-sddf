---
type: story
id: FEAT-099
slug: exportar-reporte-pdf
title: "Exportar reporte de actividad como PDF"
status: BACKLOG
substatus: TODO
parent: EPIC-10
created: 2026-05-01
updated: 2026-05-01
---

# Como administrador, quiero exportar el reporte de actividad mensual como PDF para compartirlo con mi equipo sin acceso al sistema.

## Criterios de Aceptación

### AC-1: Exportación exitosa
**DADO** que estoy en la pantalla de reportes con datos del mes actual
**CUANDO** presiono el botón "Exportar PDF"
**ENTONCES** el sistema genera un archivo PDF con los datos mostrados en pantalla y lo descarga automáticamente con el nombre `reporte-YYYY-MM.pdf`

### AC-2: Formato del PDF
**DADO** que se genera el PDF
**CUANDO** lo abro
**ENTONCES** contiene: encabezado con logo y fecha, tabla de actividades, totales por categoría y pie de página con número de página

### AC-3: Sin datos disponibles
**DADO** que el período seleccionado no tiene actividad registrada
**CUANDO** presiono "Exportar PDF"
**ENTONCES** el sistema muestra el mensaje "No hay datos para exportar en el período seleccionado" y no genera ningún archivo

### AC-4: Error de generación
**DADO** que el servicio de generación PDF no está disponible
**CUANDO** presiono "Exportar PDF"
**ENTONCES** el sistema muestra "Error al generar el PDF. Intenta de nuevo en unos minutos." sin descargar ningún archivo

## Requisitos No Funcionales

- El PDF debe generarse en menos de 5 segundos para reportes de hasta 500 registros
- El archivo generado debe ser menor a 2 MB
- Compatible con los visores PDF estándar (Adobe Reader, Chrome, Firefox)

## Notas

- El botón de exportación solo está visible para usuarios con rol `admin` o `manager`
- El nombre del archivo usa el formato ISO 8601 para la fecha
