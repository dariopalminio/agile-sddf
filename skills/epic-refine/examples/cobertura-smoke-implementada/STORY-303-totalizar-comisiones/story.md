---
alwaysApply: false
type: story
id: STORY-303
kind: feat
slug: STORY-303-totalizar-comisiones
title: "Totalizar comisiones"
status: IMPLEMENT
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

### AC-1 — Escenario principal – Total por vendedor
```gherkin
Dado pedidos cerrados en octubre
Cuando el responsable abre el resumen de comisiones
Entonces se muestra el total de comisiones por vendedor
```

## 📎 Notas / contexto adicional

- Implementada en la versión 1.4.0.
