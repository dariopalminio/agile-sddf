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
Que el responsable de ventas revise y exporte los pedidos del mes sin pedirlos a sistemas.

## Alcance
Listado, filtro por vendedor, total de comisiones y exportación a CSV de los pedidos del mes.

## Historias
- [ ] **STORY-301** — Listar pedidos del mes: Como responsable de ventas, quiero ver los pedidos cerrados del mes, para revisar las comisiones del equipo
- [ ] **STORY-302** — Filtrar pedidos por vendedor: Como responsable de ventas, quiero filtrar el listado por vendedor, para revisar la comisión de una persona
- [ ] **STORY-303** — Totalizar comisiones: Como responsable de ventas, quiero ver el total de comisiones por vendedor, para aprobar el pago del mes
- [ ] **STORY-304** — Exportar pedidos a CSV: Como responsable de ventas, quiero exportar los pedidos del mes a CSV, para cargarlos en la hoja de cálculo de comisiones
- [ ] **STORY-305** — Enviar el CSV por correo: Como responsable de ventas, quiero recibir el CSV por correo, para no descargarlo a mano
- Exportar a Excel: permite descargar los pedidos del mes en formato Excel

## Criterios de salida

## Smoke tests
### SMOKE-1 — Exportar los pedidos de octubre
```gherkin
Escenario: Exportar los pedidos de octubre
  Dado pedidos cerrados en octubre
  Cuando el responsable pulsa "Exportar CSV"
  Entonces se descarga "pedidos-2026-10.csv"
```

## Notas
