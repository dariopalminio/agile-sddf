---
type: epic
id: EPIC-30
slug: EPIC-30-ejemplo
title: "Exportación de pedidos"
status: PLAN
substatus: IN-PROGRESS
parent: null
created: 2026-10-20
updated: 2026-10-25
related: []
---

# Épica: Exportación de pedidos

## Objetivo
Que el responsable de ventas reciba los pedidos y las comisiones del mes sin pedirlos a sistemas.

## Alcance
Exportación a CSV de los pedidos del mes, envío del archivo por correo y total de comisiones por vendedor.

## Historias
- [ ] **STORY-301** — Exportar pedidos a CSV: Como responsable de ventas, quiero exportar los pedidos del mes a CSV, para cargarlos en la hoja de cálculo de comisiones
- [ ] **STORY-302** — Enviar el CSV por correo: Como responsable de ventas, quiero recibir el CSV de pedidos por correo, para no tener que descargarlo cada mes

## Criterios de salida
- [ ] El listado de pedidos del mes se exporta a CSV y se envía por correo al responsable de ventas

## Smoke tests
### SMOKE-1 — Exportar los pedidos de octubre
```gherkin
Escenario: Exportar los pedidos de octubre
  Dado pedidos cerrados en octubre
  Cuando el responsable pulsa "Exportar CSV"
  Entonces se descarga "pedidos-2026-10.csv"
```

## Notas
