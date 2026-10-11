---
type: epic
id: EPIC-01
slug: EPIC-01-v1-completa
title: "Pagos en línea"
status: DEFINE
substatus: IN-PROGRESS
parent: PROJ-01-demo
deliveryModel: batch
created: 2026-01-10
updated: 2026-01-12
related: []
---
<!-- Referencias -->
[[PROJ-01-demo]]

# Épica: Pagos en línea

## Objetivo técnico
Permitir a los clientes pagar sus pedidos en línea con tarjeta.

## Features
- [ ] **STORY-010** — Pasarela de pago: integración con el proveedor de pagos
- [x] **STORY-011** — Recibos: envío del recibo por correo
- Reembolsos: devolución total o parcial
- Conciliación: cierre diario de cobros
  - detalle indentado que no es una historia

## Bitácora
La pasarela se elige en el ADR-0042.

### Requerimiento
Cumplir PCI-DSS en todo el flujo.

#### Detalle
No se almacenan números de tarjeta.

### Impacto en Procesos Claves
- **Contabilidad:** recibe la conciliación diaria

### Riesgos (opcional)
- **Caída del proveedor:** reintentos con backoff

## Pruebas de humo
*Si alguno de estos falla, se debe detener el despliegue (o se debe hacer rollback automático).*

### SMOKE-1 — Pago aprobado
```gherkin
Escenario: Pago aprobado
  Dado un pedido pendiente de pago
  Cuando el cliente paga con una tarjeta válida
  Entonces el pedido queda pagado
```

### SMOKE-2 — Pago rechazado
```gherkin
Escenario: Pago rechazado
  Dado un pedido pendiente de pago
  Cuando el cliente paga con una tarjeta rechazada
  Entonces el pedido sigue pendiente
  Y se muestra el motivo del rechazo
```

### SMOKE-3 — Recibo enviado
```gherkin
Escenario: Recibo enviado
  Dado un pago aprobado
  Cuando termina el cobro
  Entonces el cliente recibe el recibo
```

## Definición de terminado
- [ ] El 99 % de los pagos válidos se aprueban
- [ ] Los recibos llegan en menos de 1 minuto
