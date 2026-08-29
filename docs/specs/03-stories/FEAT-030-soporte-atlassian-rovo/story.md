---
type: story
id: FEAT-030
slug: FEAT-030-soporte-atlassian-rovo
title: "Soporte Atlassian Rovo — Agente story-creator"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-01-features-spec-builder
---

<!-- Referencias -->
[[EPIC-01-features-spec-builder]]

# Historia de Usuario

## ?? Historia: Soporte Atlassian Rovo — Agente story-creator

**Como** practitioner SDDF que trabaja en el entorno Atlassian y usa Rovo como asistente de IA
**Quiero** invocar el agente `story-creator-agent` directamente desde Rovo para crear, evaluar y dividir historias de usuario
**Para** acceder al flujo completo de gestión de historias del framework SDDF sin salir del entorno Atlassian ni cambiar de herramienta

## ? Criterios de aceptación

### Escenario principal – Creación de historia desde Rovo
```gherkin
Dado que el agente "story-creator-agent" está disponible en el runtime Atlassian Rovo
Cuando el practitioner describe una necesidad y solicita crear una historia
Entonces el agente genera la historia en formato Como/Quiero/Para con criterios de aceptación Gherkin
  Y retorna el contenido de la historia listo para copiar o guardar
```

### Escenario alternativo / error – Funcionalidad no disponible en Rovo
```gherkin
Dado que el agente intenta ejecutar una función que requiere acceso al filesystem local
Cuando Rovo no tiene acceso al repositorio del proyecto
Entonces el agente informa la limitación y entrega el output como texto plano para copia manual
```

## ?? Criterios no funcionales

* Compatibilidad: el agente debe funcionar en el runtime Atlassian Rovo sin dependencias del filesystem local

## ?? Notas / contexto adicional

Generado automáticamente desde el release: release-01-features-spec-builder.md
Feature origen: FEAT-030 — Soporte Atlassian Rovo (agente story-creator-agent)
