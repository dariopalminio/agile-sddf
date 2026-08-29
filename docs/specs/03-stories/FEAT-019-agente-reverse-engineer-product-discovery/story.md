---
type: story
id: FEAT-019
slug: FEAT-019-agente-reverse-engineer-product-discovery
title: "Agente reverse-engineer-product-discovery"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-03-reverse-engineering
---

<!-- Referencias -->
[[EPIC-03-reverse-engineering]]

# Historia de Usuario

## ?? Historia: Agente reverse-engineer-product-discovery

**Como** developer que ejecuta el skill `reverse-engineering` sobre un repositorio existente
**Quiero** que el agente `reverse-engineer-product-discovery` analice rutas, componentes UI y endpoints para extraer features desde la perspectiva del usuario
**Para** obtener `.tmp/rfc-features.md` con el inventario de funcionalidades agrupadas por dominio, como input para el sintetizador

## ? Criterios de aceptación

### Escenario principal – Extracción exitosa de features desde código
```gherkin
Dado que el repositorio contiene definiciones de rutas, componentes de interfaz y endpoints REST
Cuando el agente "reverse-engineer-product-discovery" analiza el repositorio
Entonces genera ".tmp/rfc-features.md" con las features agrupadas por dominio funcional
  Y cada feature incluye nombre, descripción inferida y referencias a los archivos fuente
```

### Escenario alternativo / error – Repositorio sin componentes de interfaz o endpoints
```gherkin
Dado que el repositorio es una librería de utilidades sin rutas ni endpoints
Cuando el agente intenta extraer features de usuario
Entonces genera ".tmp/rfc-features.md" con el inventario vacío o mínimo
  Y añade "<!-- PENDING MANUAL REVIEW -->" indicando que no se detectaron componentes de interfaz
```

## ?? Criterios no funcionales

[Por completar]

## ?? Notas / contexto adicional

Generado automáticamente desde el release: release-03-reverse-engineering.md
Feature origen: FEAT-019 — Agente reverse-engineer-product-discovery
