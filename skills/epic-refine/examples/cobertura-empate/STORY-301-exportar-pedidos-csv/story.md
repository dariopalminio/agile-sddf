---
alwaysApply: false
type: story
id: STORY-301
kind: feat
slug: STORY-301-exportar-pedidos-csv
title: "Exportar pedidos a CSV"
status: SPECIFY
substatus: DONE
parent: EPIC-30-ejemplo
created: 2026-10-21
updated: 2026-10-24
related:
  - EPIC-30-ejemplo
---
[[EPIC-30-ejemplo]]

# 📖 Historia: Exportar pedidos a CSV

**Como** responsable de ventas
**Quiero** exportar los pedidos del mes a CSV
**Para** cargarlos en la hoja de cálculo de comisiones

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Exportar pedidos a CSV
```gherkin
Dado el listado de pedidos de octubre
Cuando el responsable pulsa "Exportar CSV"
Entonces se descarga "pedidos-2026-10.csv" con una fila por pedido
```

## 📎 Notas / contexto adicional

- Cubre SMOKE-1 de la épica.
