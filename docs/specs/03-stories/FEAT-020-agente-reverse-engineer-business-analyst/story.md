---
type: story
id: FEAT-020
slug: FEAT-020-agente-reverse-engineer-business-analyst
title: "Agente reverse-engineer-business-analyst"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-03-reverse-engineering
---

<!-- Referencias -->
[[EPIC-03-reverse-engineering]]

# Historia de Usuario

## ?? Historia: Agente reverse-engineer-business-analyst

**Como** developer que ejecuta el skill `reverse-engineering` sobre un repositorio existente
**Quiero** que el agente `reverse-engineer-business-analyst` identifique reglas de negocio, validaciones y workflows del código fuente
**Para** obtener `.tmp/rfc-business-rules.md` con las reglas en formato DADO/CUANDO/ENTONCES referenciadas a su código fuente, como input para el sintetizador

## ? Criterios de aceptación

### Escenario principal – Identificación exitosa de reglas de negocio
```gherkin
Dado que el repositorio contiene validaciones condicionales, guards de autorización y flujos de negocio en el código
Cuando el agente "reverse-engineer-business-analyst" analiza el repositorio
Entonces genera ".tmp/rfc-business-rules.md" con cada regla en formato DADO/CUANDO/ENTONCES
  Y cada regla incluye una referencia al archivo fuente y línea de código donde fue detectada
```

### Escenario alternativo / error – Código sin lógica de negocio identificable
```gherkin
Dado que el código es puramente de infraestructura (configuración, scripts de build) sin lógica de negocio
Cuando el agente analiza el repositorio
Entonces genera ".tmp/rfc-business-rules.md" con la sección de reglas vacía
  Y añade "<!-- PENDING MANUAL REVIEW -->" indicando que no se detectaron reglas de negocio
```

## ?? Criterios no funcionales

[Por completar]

## ?? Notas / contexto adicional

Generado automáticamente desde el release: release-03-reverse-engineering.md
Feature origen: FEAT-020 — Agente reverse-engineer-business-analyst
