---
type: story
id: FEAT-032
slug: FEAT-032-soporte-atlassian-rovo-para-validar-release
title: "Soporte Atlassian Rovo para Validar Release"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-06-release-and-story-generator
---

<!-- Referencias -->
[[EPIC-06-release-and-story-generator]]

# Historia de Usuario

## ?? Historia: Soporte Atlassian Rovo para Validar Release

**Como** practitioner SDDF que utiliza el runtime Atlassian Rovo para gestionar su equipo
**Quiero** invocar el agente `release-validator-agent` en Rovo para validar el formato de un archivo de release
**Para** obtener feedback sobre la estructura del release directamente en el entorno Atlassian sin tener que cambiar de herramienta

## ? Criterios de aceptación

### Escenario principal – Validación de release desde Rovo
```gherkin
Dado que el agente "release-validator-agent" está disponible en el runtime de Atlassian Rovo
  Y el usuario indica el nombre de un archivo de release existente
Cuando el practitioner invoca el agente en Rovo
Entonces el agente ejecuta la validación de formato sobre el archivo indicado
  Y retorna el resultado APROBADO, REFINAR o RECHAZADO con detalle de secciones evaluadas
```

### Escenario alternativo / error – Archivo de release no encontrado por el agente
```gherkin
Dado que el practitioner indica un archivo que no existe en "docs/specs/releases/"
Cuando el agente intenta localizar el archivo
Entonces el agente retorna RECHAZADO con el mensaje "Archivo no encontrado: <nombre>"
  Pero no modifica ningún archivo
```

## ?? Criterios no funcionales

* Compatibilidad: el agente debe funcionar en el runtime Atlassian Rovo sin dependencias externas al entorno
* Dependencias: requiere FEAT-027 (release-format-validation) y FEAT-030 como prerequisitos

## ?? Notas / contexto adicional

Generado automáticamente desde el release: release-06-release-and-story-generator.md
Feature origen: FEAT-032 — Soporte Atlassian Rovo para Validar Release
