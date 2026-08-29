---
type: story
id: FEAT-033
slug: FEAT-033-soporte-atlassian-rovo-para-crear-epic-release
title: "Soporte Atlassian Rovo para crear Epic Release"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-06-release-and-story-generator
---

<!-- Referencias -->
[[EPIC-06-release-and-story-generator]]

# Historia de Usuario

## ?? Historia: Soporte Atlassian Rovo para crear Epic Release

**Como** PM o Scrum Master que usa Atlassian Rovo y gestiona el backlog en Jira
**Quiero** invocar el agente `release-creator-agent` en Rovo para crear una Epic en Jira a partir de un archivo de release del framework SDDF
**Para** sincronizar el plan de releases SDDF con el backlog de Jira sin transcribir manualmente la información de features y objetivos

## ? Criterios de aceptación

### Escenario principal – Creación de Epic desde archivo de release en Rovo
```gherkin
Dado que el agente "release-creator-agent" está disponible en el runtime de Atlassian Rovo
  Y existe un archivo de release válido en "docs/specs/releases/"
Cuando el PM invoca el agente en Rovo indicando el archivo de release
Entonces el agente lee las features y el objetivo del release
  Y crea una Epic en Jira con el nombre, descripción y features del release como Issues hijos
  Y retorna un resumen con el ID de la Epic creada y las Issues asociadas
```

### Escenario alternativo / error – Archivo de release inválido o con formato incorrecto
```gherkin
Dado que el archivo de release indicado no supera la validación de formato (FEAT-027)
Cuando el agente intenta crear la Epic
Entonces el agente retorna un error descriptivo con las secciones faltantes
  Pero no crea ninguna Epic en Jira
```

## ?? Criterios no funcionales

* Compatibilidad: el agente debe funcionar en el runtime Atlassian Rovo con acceso a la API de Jira
* Dependencias: requiere FEAT-027 (release-format-validation) y FEAT-030 como prerequisitos

## ?? Notas / contexto adicional

Generado automáticamente desde el release: release-06-release-and-story-generator.md
Feature origen: FEAT-033 — Soporte Atlassian Rovo para crear Epic Release
