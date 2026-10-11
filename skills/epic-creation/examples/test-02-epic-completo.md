# Test Case 02 — Épica completa (todas las secciones con contenido)

**Descripción:** El usuario invoca el skill sin `--quick` y responde con contenido a las cinco secciones del template v2, incluida la de clave `notas` (opcional en contenido). El archivo final incluye todas las secciones en el orden del template.

---

## Input del usuario

```
/epic-creation Sistema de pagos
```

---

## Flujo esperado

### Fase 0 — Modo de ejecución
- No se detecta `--quick` → `QUICK_MODE=false`
- Nombre de la épica provisto en el input: `"Sistema de pagos"`
- Slug derivado: `sistema-de-pagos`
- Identificador sugerido: `EPIC-02` (asumiendo que EPIC-01 ya existe)
- Usuario acepta
- Ruta de salida: `$SPECS_BASE/specs/epics/EPIC-02-sistema-de-pagos/epic.md`
- El directorio no existe → continuar

### Fase 1 — Leer template
- Se lee `$SPECS_BASE/templates/epic-template.md`
- Contrato extraído (título · clave): `Alcance · alcance`, `Historias · historias`, `Criterios de salida · criterios-salida`, `Smoke tests · smoke-tests`, `Notas · notas`
- Secciones opcionales: ninguna (el Paso 5 no pregunta nada)

### Fase 2 — Frontmatter
| Campo | Valor ingresado |
|---|---|
| type | `epic` (fijo) |
| id | `EPIC-02` (del Paso 1) |
| title | "Sistema de pagos" (aceptado) |
| status | `DEFINE` (default aceptado) |
| substatus | `TODO` (default aceptado) |
| created | 2026-05-15 (usuario modifica la fecha sugerida) |
| updated | 2026-05-15 (igual a `created` en la creación inicial) |
| slug | `EPIC-02-sistema-de-pagos` (confirmado) |

### Fase 3 — Secciones (una pregunta por sección con su título y su guía)
- **Alcance:** "Pasarela de pagos con tarjeta de crédito/débito integrada con Stripe."
- **Historias** (F1, sin IDs):
  - `Pago con tarjeta: procesar pagos Visa/Mastercard vía Stripe`
  - `Historial de transacciones: ver pagos con fecha, monto y estado`
  - `Reembolsos: solicitar la devolución de un pago dentro de 30 días`
- **Criterios de salida:**
  - `Los webhooks de Stripe se procesan de forma idempotente`
  - `Ningún dato de tarjeta se persiste en servidores propios (PCI DSS)`
- **Smoke tests:**
  - `Pago exitoso` — Dado un usuario con tarjeta válida / Cuando realiza el pago / Entonces la transacción queda aprobada
  - `Pago rechazado` — Dado un usuario con fondos insuficientes / Cuando intenta pagar / Entonces la transacción se rechaza sin cargo
- **Notas:** "Coordinar con marketing el comunicado de lanzamiento."

### Fase 4 — Archivo generado
```
docs/specs/epics/EPIC-02-sistema-de-pagos/epic.md
```

### Fase 5 — Validación
- `epic-format-validation` retorna **APROBADO**

---

## Output esperado del archivo

````markdown
---
type: epic
id: EPIC-02
slug: EPIC-02-sistema-de-pagos
title: "Sistema de pagos"
status: DEFINE
substatus: TODO
parent: null
created: 2026-05-15
updated: 2026-05-15
related: []
---

# Épica: Sistema de pagos

## Alcance
Pasarela de pagos con tarjeta de crédito/débito integrada con Stripe.

## Historias
- Pago con tarjeta: procesar pagos Visa/Mastercard vía Stripe
- Historial de transacciones: ver pagos con fecha, monto y estado
- Reembolsos: solicitar la devolución de un pago dentro de 30 días

## Criterios de salida
- [ ] Los webhooks de Stripe se procesan de forma idempotente
- [ ] Ningún dato de tarjeta se persiste en servidores propios (PCI DSS)

## Smoke tests
### SMOKE-1 — Pago exitoso
```gherkin
Escenario: Pago exitoso
  Dado un usuario con tarjeta válida
  Cuando realiza el pago
  Entonces la transacción queda aprobada
```

### SMOKE-2 — Pago rechazado
```gherkin
Escenario: Pago rechazado
  Dado un usuario con fondos insuficientes
  Cuando intenta pagar
  Entonces la transacción se rechaza sin cargo
```

## Notas
Coordinar con marketing el comunicado de lanzamiento.
````

---

## Criterios de éxito del test

- [ ] Cada pregunta usó el título y el comentario guía de la sección del template
- [ ] Las historias quedaron en F1 y los smoke tests como `SMOKE-1`/`SMOKE-2` con bloque `gherkin`
- [ ] Las secciones aparecen en el orden del template, sin los marcadores `<!-- sección … -->`
- [ ] `epic-format-validation` retorna APROBADO sin refinamiento
