---
type: story
id: FEAT-099
slug: FEAT-099-gestionar-carrito-compras
title: "Gestionar carrito de compras"
status: SPECIFY
substatus: IN‑PROGRESS
parent: EPIC-05-tienda-online
created: 2026-01-10
updated: 2026-01-10
---
**FINVEST Score:** 2.8 / 5.0
**FINVEST Decisión:** DIVIDIR

# 📖 Historia: Gestionar carrito de compras

**Como** comprador registrado en la tienda  
**Quiero** gestionar los productos en mi carrito de compras  
**Para** controlar qué voy a comprar antes de pagar

## ✅ Criterios de aceptación

### Escenario principal – Agregar ítem al carrito
```gherkin
Dado que estoy viendo el detalle del producto "Auriculares BT-200" con stock disponible
Cuando hago clic en "Agregar al carrito"
Entonces el producto aparece en mi carrito con cantidad 1
  Y el contador del ícono de carrito se actualiza
  Y veo el mensaje "Producto agregado correctamente"
```

### Escenario principal – Eliminar ítem del carrito
```gherkin
Dado que tengo "Auriculares BT-200" en mi carrito
Cuando hago clic en el ícono de eliminar junto al producto
Entonces el producto desaparece de mi carrito
  Y el total del carrito se recalcula
  Y el contador del ícono de carrito se actualiza
```

### Escenario principal – Cambiar cantidad de un ítem
```gherkin
Dado que tengo "Auriculares BT-200" con cantidad 1 en mi carrito
Cuando cambio la cantidad a 3 usando el selector
Entonces el subtotal del producto se actualiza a precio × 3
  Y el total del carrito se recalcula
  Y el stock disponible se verifica antes de confirmar
```

### Escenario alternativo / error – Stock insuficiente al cambiar cantidad
```gherkin
Dado que "Auriculares BT-200" tiene 2 unidades en stock
Cuando intento cambiar la cantidad a 5
Entonces veo el mensaje "Solo quedan 2 unidades disponibles"
  Pero la cantidad en el carrito permanece en 2 (el máximo disponible)
```

### Escenario alternativo / error – Carrito vacío al checkout
```gherkin
Dado que mi carrito está vacío
Cuando intento ir a checkout
Entonces veo el mensaje "Tu carrito está vacío. Agrega productos para continuar"
  Y el botón "Proceder al pago" está deshabilitado
```

### Escenario alternativo / error – Producto sin stock al agregar
```gherkin
Dado que el producto "Teclado MX-500" tiene stock 0
Cuando intento hacer clic en "Agregar al carrito"
Entonces el botón aparece deshabilitado con texto "Sin stock"
  Y no se modifica el carrito
```

## ⚙️ Criterios no funcionales

* Rendimiento: las operaciones del carrito responden en <500ms
* Persistencia: el carrito se conserva si el usuario cierra y reabre el navegador (localStorage)

## 📎 Notas / contexto adicional

El carrito aplica a usuarios registrados. El flujo de checkout está fuera del scope de esta historia.
