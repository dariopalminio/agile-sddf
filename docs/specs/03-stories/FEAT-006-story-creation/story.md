---
type: story
id: FEAT-006
slug: FEAT-006-story-creation
title: "story-creation — Crear historias de usuario"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-01-features-spec-builder
---

<!-- Referencias -->
[[EPIC-01-features-spec-builder]]

# Historia de Usuario

## ?? Historia: story-creation — Crear historias de usuario

**Como** desarrollador o PM que necesita redactar una historia de usuario para sprint planning
**Quiero** ejecutar el skill `story-creation` describiendo una necesidad o feature en lenguaje natural
**Para** obtener una historia completa en formato Como/Quiero/Para con criterios de aceptación Gherkin lista para evaluarse con FINVEST, sin redactarla desde cero

## ? Criterios de aceptación

### Escenario principal – Creación exitosa desde descripción en texto libre
```gherkin
Dado que el desarrollador describe una necesidad: "El usuario quiere recuperar su contraseña por email"
Cuando ejecuta el skill "story-creation" con esa descripción
Entonces el skill genera un archivo "story-{slug}.md" en "docs/specs/stories/"
  Y el archivo contiene las secciones Como/Quiero/Para con rol específico, acción concreta y beneficio medible
  Y el archivo incluye al menos un escenario Gherkin principal y uno alternativo/error en bloques ```gherkin```
```

### Escenario alternativo / error – Historia demasiado grande (épica)
```gherkin
Dado que la descripción cubre tres funcionalidades distintas
Cuando el skill evalúa el alcance
Entonces el skill genera la historia pero sugiere ejecutar "/story-split" para dividirla
  Pero no divide automáticamente sin instrucción explícita
```

## ?? Criterios no funcionales

[Por completar]

## ?? Notas / contexto adicional

Generado automáticamente desde el release: release-01-features-spec-builder.md
Feature origen: FEAT-006 — story-creation
