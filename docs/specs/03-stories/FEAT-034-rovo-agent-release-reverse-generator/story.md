---
type: story
id: FEAT-034
slug: FEAT-034-rovo-agent-release-reverse-generator
title: "Rovo Agent Release Reverse Generator from children"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-06-release-and-story-generator
---

<!-- Referencias -->
[[EPIC-06-release-and-story-generator]]

# Historia de Usuario

## ?? Historia: Rovo Agent Release Reverse Generator from children

**Como** PM o Scrum Master que tiene Epics e Issues ya definidos en Jira
**Quiero** invocar el agente `release-reverse-generator` en Rovo para generar un archivo de release SDDF a partir de las Epics e Issues hijos existentes en Jira
**Para** documentar en formato SDDF releases que ya están en Jira sin reescribir manualmente toda la información

## ? Criterios de aceptación

### Escenario principal – Generación de release desde Epic e Issues en Jira
```gherkin
Dado que existe una Epic con Issues hijos en Jira
  Y el agente "release-reverse-generator" está disponible en el runtime de Atlassian Rovo
Cuando el PM invoca el agente indicando el ID de la Epic en Jira
Entonces el agente extrae el nombre, descripción e Issues hijos de la Epic
  Y genera un archivo de release en "docs/specs/releases/" siguiendo la estructura de "release-spec-template.md"
  Y retorna la ruta del archivo generado y un resumen de las features incluidas
```

### Escenario alternativo / error – Epic no encontrada en Jira
```gherkin
Dado que el PM indica un ID de Epic que no existe en Jira
Cuando el agente intenta acceder a la Epic
Entonces el agente retorna el mensaje "Epic no encontrada: <ID>"
  Pero no genera ningún archivo de release
```

### Escenario alternativo / error – Epic sin Issues hijos
```gherkin
Dado que la Epic indicada existe en Jira pero no tiene Issues hijos
Cuando el agente intenta extraer las features
Entonces el agente genera el archivo de release con la sección "## Features" vacía con placeholder "[Por completar]"
  Y advierte al usuario que no se encontraron Issues hijos asociados
```

## ?? Criterios no funcionales

* Compatibilidad: el agente debe funcionar en el runtime Atlassian Rovo con acceso de lectura a la API de Jira
* Dependencias: requiere FEAT-027 (release-format-validation) y FEAT-030 como prerequisitos

## ?? Notas / contexto adicional

Generado automáticamente desde el release: release-06-release-and-story-generator.md
Feature origen: FEAT-034 — Rovo Agent: Release Reverse Generator from children
