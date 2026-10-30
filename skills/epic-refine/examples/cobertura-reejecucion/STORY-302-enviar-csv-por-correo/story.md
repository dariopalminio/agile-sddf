---
alwaysApply: false
type: story
id: STORY-302
kind: feat
slug: STORY-302-enviar-csv-por-correo
title: "Enviar el CSV por correo"
status: SPECIFY
substatus: DONE
parent: EPIC-30-ejemplo
created: 2026-10-21
updated: 2026-10-29
related:
  - EPIC-30-ejemplo
---
[[EPIC-30-ejemplo]]

# 📖 Historia: Enviar el CSV por correo

**Como** responsable de ventas
**Quiero** recibir el CSV de pedidos por correo
**Para** no tener que descargarlo cada mes

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Enviar el CSV por correo
```gherkin
Dado que se generó "pedidos-2026-10.csv"
Cuando cierra el mes
Entonces el responsable de ventas recibe un correo con "pedidos-2026-10.csv" adjunto
```

### AC-2 — Escenario alternativo – Sin pedidos en el mes
```gherkin
Dado que octubre no tiene pedidos cerrados
Cuando cierra el mes
Entonces no se envía ningún correo
```

### AC-3 — Cierre del contrato de salida – CS-1 de EPIC-30
```gherkin
Dado que las historias de "EPIC-30" están implementadas
Cuando se verifica el criterio de salida "CS-1" de "EPIC-30"
Entonces se cumple: El listado de pedidos del mes se exporta a CSV y se envía por correo al responsable de ventas
```

## 📎 Notas / contexto adicional

- depends-on: STORY-301
- Cubre el criterio de salida CS-1 de EPIC-30: El listado de pedidos del mes se exporta a CSV y se envía por correo al responsable de ventas
