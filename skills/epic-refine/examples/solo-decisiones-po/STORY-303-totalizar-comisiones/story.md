---
alwaysApply: false
type: story
id: STORY-303
kind: feat
slug: STORY-303-totalizar-comisiones
title: "Totalizar comisiones"
status: SPECIFY
substatus: DONE
parent: EPIC-30-ejemplo
created: 2026-10-21
updated: 2026-10-24
related:
  - EPIC-30-ejemplo
---
[[EPIC-30-ejemplo]]

# 📖 Historia: Totalizar comisiones

**Como** responsable de ventas  
**Quiero** ver el total de comisiones por vendedor  
**Para** aprobar el pago del mes

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Totalizar comisiones
```gherkin
Dado el listado de pedidos de octubre
Cuando el responsable pide el total por vendedor
Entonces ve una fila por vendedor con su comisión total
```

## 📎 Notas / contexto adicional

- Sin notas.
