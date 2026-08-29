---
type: story
id: FEAT-018
slug: FEAT-018-agente-reverse-engineer-architect
title: "Agente reverse-engineer-architect"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-03-reverse-engineering
---

<!-- Referencias -->
[[EPIC-03-reverse-engineering]]

# Historia de Usuario

## ?? Historia: Agente reverse-engineer-architect

**Como** developer que ejecuta el skill `reverse-engineering` sobre un repositorio existente
**Quiero** que el agente `reverse-engineer-architect` analice el stack tecnológico, dependencias y patrones arquitectónicos del código
**Para** obtener `.tmp/rfc-architecture.md` con el stack, frameworks, patrones de arquitectura y puntos de integración inferidos del repositorio, como input para el sintetizador

## ? Criterios de aceptación

### Escenario principal – Análisis arquitectónico exitoso
```gherkin
Dado que el repositorio contiene "package.json", código fuente TypeScript y archivos de configuración
Cuando el agente "reverse-engineer-architect" analiza el repositorio
Entonces genera ".tmp/rfc-architecture.md" con stack detectado, frameworks, dependencias principales y patrones arquitectónicos
  Y clasifica cada hallazgo como [DIRECT], [INFERRED] o [SUGGESTED] según el nivel de certeza
```

### Escenario alternativo / error – Repositorio sin manifiestos de dependencias reconocibles
```gherkin
Dado que el repositorio no contiene package.json, requirements.txt ni ningún manifiesto de dependencias
Cuando el agente intenta inferir el stack
Entonces genera ".tmp/rfc-architecture.md" con la sección de stack marcada como "[SUGGESTED]"
  Y añade una nota "<!-- PENDING MANUAL REVIEW -->" en las secciones no inferibles
```

## ?? Criterios no funcionales

[Por completar]

## ?? Notas / contexto adicional

Generado automáticamente desde el release: release-03-reverse-engineering.md
Feature origen: FEAT-018 — Agente reverse-engineer-architect
