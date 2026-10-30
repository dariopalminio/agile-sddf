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
- [x] **STORY-303** — Totalizar comisiones: Como responsable de ventas, quiero ver el total de comisiones por vendedor, para aprobar el pago del mes

## Criterios de salida
- [ ] El total de comisiones por vendedor se muestra y se descarga en CSV

## Smoke tests
### SMOKE-1 — Exportar los pedidos de octubre
```gherkin
Escenario: Exportar los pedidos de octubre
  Dado pedidos cerrados en octubre
  Cuando el responsable pulsa "Exportar CSV"
  Entonces se descarga "pedidos-2026-10.csv"
```

### SMOKE-2 — Totalizar comisiones de octubre
```gherkin
Escenario: Totalizar comisiones de octubre
  Dado pedidos cerrados en octubre
  Cuando el responsable abre el resumen de comisiones
  Entonces ve el total de comisiones por vendedor
  Y descarga el resumen en "comisiones-2026-10.csv"
```

## Notas
