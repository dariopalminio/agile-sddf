---
type: epic
id: EPIC-30
slug: EPIC-30-ejemplo
title: "Exportación de informes"
status: PLAN
substatus: IN-PROGRESS
parent: null
created: 2026-10-20
updated: 2026-10-25
related: []
---

# Épica: Exportación de informes

## Objetivo
Que el analista de ventas comparta el informe mensual sin pedirlo a sistemas.

## Alcance
Exportación del informe mensual a CSV, XLSX y JSON y envío programado a finanzas.

## Historias
- [ ] **STORY-301** — Exportar informe a CSV: Como analista de ventas, quiero exportar el informe mensual a CSV, para compartirlo con finanzas — [[STORY-301-exportar-informe]]
- [ ] **STORY-302** — Programar el envío del informe: Como analista de ventas, quiero programar el envío mensual del informe exportado, para que finanzas lo reciba sin pedirlo
- [ ] **STORY-305** — Exportar informe a XLSX: Como analista de ventas, quiero exportar el informe mensual a XLSX, para abrirlo con fórmulas en la hoja de cálculo — [[STORY-305-exportar-informe-xlsx]]
- [ ] **STORY-306** — Exportar informe a JSON: Como integrador de sistemas, quiero exportar el informe mensual a JSON, para cargarlo en el tablero de ventas
- [ ] **STORY-307** — Enviar el informe por correo: Como analista de ventas, quiero enviar el informe por correo, para no adjuntarlo a mano
- Exportar a PDF con gráficos: permite descargar el informe mensual con sus gráficos

## Criterios de salida
- [ ] **CS-1** — El informe mensual se exporta a CSV con una fila por venta

## Smoke tests
### SMOKE-1 — Exportar el informe de octubre
```gherkin
Escenario: Exportar el informe de octubre
  Dado ventas cerradas en octubre
  Cuando el analista pulsa "Exportar CSV"
  Entonces se descarga "informe-2026-10.csv"
```

## Notas
