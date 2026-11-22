---
type: epic
id: EPIC-05
slug: EPIC-05-pagos
title: "Pagos"
status: DEFINE
substatus: IN-PROGRESS
parent: null
created: 2026-10-01
updated: 2026-10-01
related: []
---

# Épica: Pagos

## Alcance
Integración de la pasarela de pago y consulta del historial de pagos.

## Historias
- Pasarela de pago: integración con Stripe
- [ ] **STORY-120** — Historial: consulta de pagos pasados
- [x] **STORY-119** — Tarifas: tabla de comisiones
- [ ] Exportar CSV: descarga del historial

## Smoke tests
### SMOKE-1 — Pago aprobado
```gherkin
Escenario: Pago aprobado
  Dado un carrito con un producto
  Cuando el usuario paga con tarjeta
  Entonces el pago queda registrado
```
### SMOKE-2 — Pago rechazado
```gherkin
Escenario: Pago rechazado
  Dado un carrito con un producto
  Cuando el usuario paga con tarjeta
  Entonces el pago queda registrado
```

## Notas
