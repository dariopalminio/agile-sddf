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

## Descripción <!-- sección obligatoria-->
Permitir a los clientes pagar sus pedidos en línea con tarjeta.

## Historias <!-- sección obligatoria-->
- [ ] STORY-010 - **Pasarela de pago:** integración con el proveedor de pagos
- [x] **STORY-011 — Recibos:** envío del recibo por correo
- [ ] **Reembolsos:** devolución total o parcial
- [ ] Conciliación: cierre diario de cobros
  - detalle indentado que no es una historia

## Flujos Críticos / Smoke Tests <!-- sección obligatoria, al menos un escenario -->
*Si alguno de estos falla, se debe detener el despliegue (o se debe hacer rollback automático).*

### Escenario 1: Pago aprobado
**DADO** un pedido pendiente de pago  
**CUANDO** el cliente paga con una tarjeta válida  
**ENTONCES** el pedido queda pagado

### Escenario 2: Pago rechazado
**DADO** un pedido pendiente de pago  
**CUANDO** el cliente paga con una tarjeta rechazada  
**ENTONCES** el pedido sigue pendiente  
**Y** se muestra el motivo del rechazo

### Escenario 3: Recibo enviado
**DADO** un pago aprobado
**CUANDO** termina el cobro
**ENTONCES** el cliente recibe el recibo

## Requerimiento  <!-- sección opcional-->
Cumplir PCI-DSS en todo el flujo.

### Detalle
No se almacenan números de tarjeta.

## Impacto en Procesos Claves  <!-- sección opcional-->
- **Contabilidad:** recibe la conciliación diaria

## Dependencias Críticas (si las hay) <!-- sección opcional-->
[Por completar]

## Riesgos (opcional) <!-- sección opcional-->
- **Caída del proveedor:** reintentos con backoff

**Criterios de éxito:** <!-- sección opcional-->
- [ ] El 99 % de los pagos válidos se aprueban
- [ ] Los recibos llegan en menos de 1 minuto

## Notas adicionales  <!-- sección opcional-->
La pasarela se elige en el ADR-0042.
