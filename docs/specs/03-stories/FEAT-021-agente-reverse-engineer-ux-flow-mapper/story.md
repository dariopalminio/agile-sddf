---
type: story
id: FEAT-021
slug: FEAT-021-agente-reverse-engineer-ux-flow-mapper
title: "Agente reverse-engineer-ux-flow-mapper"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-03-reverse-engineering
---

<!-- Referencias -->
[[EPIC-03-reverse-engineering]]

# Historia de Usuario

## ?? Historia: Agente reverse-engineer-ux-flow-mapper

**Como** developer que ejecuta el skill `reverse-engineering` sobre un repositorio existente
**Quiero** que el agente `reverse-engineer-ux-flow-mapper` reconstruya el mapa de navegación y flujos de usuario a partir de la configuración de ruteo y guardas
**Para** obtener `.tmp/rfc-navigation.md` con el árbol de navegación ASCII y los flujos principales, como input para el sintetizador

## ? Criterios de aceptación

### Escenario principal – Reconstrucción exitosa del mapa de navegación
```gherkin
Dado que el repositorio contiene configuración de rutas (router.js, AppRoutes.tsx o equivalente) y guardas de autenticación
Cuando el agente "reverse-engineer-ux-flow-mapper" analiza el repositorio
Entonces genera ".tmp/rfc-navigation.md" con el árbol de navegación en formato ASCII
  Y el árbol muestra rutas públicas vs protegidas y los flujos de acceso principales
```

### Escenario alternativo / error – Sin configuración de rutas detectada
```gherkin
Dado que el repositorio no contiene configuración de rutas reconocible
Cuando el agente intenta reconstruir el mapa de navegación
Entonces genera ".tmp/rfc-navigation.md" con el árbol vacío
  Y añade "<!-- PENDING MANUAL REVIEW -->" indicando que no se detectó configuración de ruteo
```

## ?? Criterios no funcionales

[Por completar]

## ?? Notas / contexto adicional

Generado automáticamente desde el release: release-03-reverse-engineering.md
Feature origen: FEAT-021 — Agente reverse-engineer-ux-flow-mapper
