# Resultado del splitting — STORY-099-gestionar-carrito-compras

## Historia original

STORY-099 — "Gestionar carrito de compras" — FINVEST Decisión: DIVIDIR (S=1, 6 escenarios, 18+ pasos totales)

## Diagnóstico

La historia tiene 3 flujos principales independientes (agregar, eliminar, cambiar cantidad) bundleados en un solo artefacto. Se aplica **Patrón 4 — Complejidad de criterios de aceptación**: cada escenario principal es en realidad un flujo completo con su propio error path.

**Historia core:** Agregar ítem al carrito (happy path más fundamental, el que se implementa primero).

---

## Historias resultantes

### STORY-099 — Agregar ítem al carrito (core, repurposed)

**Archivo:** `docs/specs/03-stories/STORY-099-agregar-item-carrito/story.md` ← repurposed (era `STORY-099-gestionar-carrito-compras/`)

---
type: story
id: STORY-099
slug: STORY-099-agregar-item-carrito
status: SPECIFY
substatus: IN-PROGRESS
related: [STORY-100, STORY-101]
---

**Como** comprador registrado en la tienda  
**Quiero** agregar un producto a mi carrito desde su página de detalle  
**Para** reservarlo para comprar sin perder mi selección mientras sigo navegando

#### Escenario principal – Agregar ítem disponible
```gherkin
Dado que estoy viendo el detalle del producto "Auriculares BT-200" con stock disponible
Cuando hago clic en "Agregar al carrito"
Entonces el producto aparece en mi carrito con cantidad 1
  Y el contador del ícono de carrito se actualiza
  Y veo el mensaje "Producto agregado correctamente"
```

#### Escenario alternativo / error – Producto sin stock
```gherkin
Dado que el producto "Teclado MX-500" tiene stock 0
Cuando intento hacer clic en "Agregar al carrito"
Entonces el botón aparece deshabilitado con texto "Sin stock"
  Y no se modifica el carrito
```

---

### STORY-100 — Eliminar ítem del carrito

**Archivo:** `docs/specs/03-stories/STORY-100-eliminar-item-carrito/story.md` ← nuevo

**Como** comprador que revisó su carrito  
**Quiero** eliminar un producto de mi carrito  
**Para** descartar artículos que ya no quiero comprar sin tener que vaciar todo el carrito

#### Escenario principal – Eliminar ítem existente
```gherkin
Dado que tengo "Auriculares BT-200" en mi carrito
Cuando hago clic en el ícono de eliminar junto al producto
Entonces el producto desaparece de mi carrito
  Y el total del carrito se recalcula
  Y el contador del ícono de carrito se actualiza
```

#### Escenario alternativo / error – Carrito queda vacío
```gherkin
Dado que tengo solo "Auriculares BT-200" en mi carrito
Cuando lo elimino
Entonces veo el estado vacío: "Tu carrito está vacío. Agrega productos para continuar"
  Y el botón "Proceder al pago" está deshabilitado
```

---

### STORY-101 — Cambiar cantidad de ítem en el carrito

**Archivo:** `docs/specs/03-stories/STORY-101-cambiar-cantidad-carrito/story.md` ← nuevo

**Como** comprador que quiere ajustar su pedido  
**Quiero** cambiar la cantidad de un producto en mi carrito  
**Para** comprar exactamente las unidades que necesito sin tener que agregar el mismo producto varias veces

#### Escenario principal – Cambiar cantidad dentro del stock
```gherkin
Dado que tengo "Auriculares BT-200" con cantidad 1 en mi carrito
Cuando cambio la cantidad a 3 usando el selector
Entonces el subtotal del producto se actualiza a precio × 3
  Y el total del carrito se recalcula
```

#### Escenario alternativo / error – Cantidad solicitada supera stock
```gherkin
Dado que "Auriculares BT-200" tiene 2 unidades en stock
Cuando intento cambiar la cantidad a 5
Entonces veo el mensaje "Solo quedan 2 unidades disponibles"
  Pero la cantidad en el carrito queda en 2 (el máximo disponible)
```

---

## Archivos generados

- `docs/specs/03-stories/STORY-099-agregar-item-carrito/story.md` ← **repurposed** (era `STORY-099-gestionar-carrito-compras/`)
- `docs/specs/03-stories/STORY-100-eliminar-item-carrito/story.md` ← nuevo
- `docs/specs/03-stories/STORY-101-cambiar-cantidad-carrito/story.md` ← nuevo

> ⚠️ El directorio `STORY-099-gestionar-carrito-compras/` fue renombrado a `STORY-099-agregar-item-carrito/`.
> Actualiza manualmente cualquier referencia al slug anterior en `epic.md` u otros documentos.

## Notas del splitting

- **Orden de implementación sugerido:** STORY-099 (agregar) → STORY-100 (eliminar) → STORY-101 (cantidad)
- **STORY-099 es el core:** sin "agregar" no hay carrito que eliminar ni actualizar
- Los criterios no funcionales (persistencia en localStorage, rendimiento <500ms) aplican a las 3 historias; incluirlos en cada `story.md` hijo según corresponda
