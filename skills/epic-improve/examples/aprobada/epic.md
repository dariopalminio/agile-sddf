---
type: epic
id: EPIC-92
slug: EPIC-92-notificaciones
title: "Notificaciones"
status: DEFINE
substatus: IN-PROGRESS
parent: null
created: 2026-10-20
updated: 2026-10-20
related: []
---

# Épica: Notificaciones

## Objetivo
Avisar al cliente por correo cuando su pedido cambia de estado, para que no tenga que consultarlo.

## Alcance
Envío de un correo por cada cambio de estado del pedido y registro de cada envío en `notificaciones.log`.

## Historias
- [ ] **STORY-920** — Correo de cambio de estado: envía un correo al cliente al cambiar el estado del pedido
- Registro de envíos: anota cada correo enviado en `notificaciones.log`

## Criterios de salida
- [ ] **CS-1** — Un cambio de estado de pedido produce exactamente un correo al cliente
- [ ] **CS-2** — Cada correo enviado queda anotado en `notificaciones.log`

## Smoke tests
### SMOKE-1 — Correo por cambio de estado
```gherkin
Escenario: Correo por cambio de estado
  Dado un pedido en estado "pagado"
  Cuando el pedido pasa a "enviado"
  Entonces el cliente recibe un correo con el nuevo estado
```

## Notas
