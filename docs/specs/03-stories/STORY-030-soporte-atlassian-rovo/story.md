---
type: story
id: STORY-030
kind: feat
slug: STORY-030-soporte-atlassian-rovo
title: "Soporte Atlassian Rovo ï¿½ Agente story-creator"
date: 2026-04-22
status: CANCELED
substatus: DONE
parent: EPIC-01-features-spec-builder
---

<!-- Referencias -->
[[EPIC-01-features-spec-builder]]

# Historia de Usuario

## ?? Historia: Soporte Atlassian Rovo ï¿½ Agente story-creator

**Como** practitioner SDDF que trabaja en el entorno Atlassian y usa Rovo como asistente de IA
**Quiero** invocar el agente `story-creator-agent` directamente desde Rovo para crear, evaluar y dividir historias de usuario
**Para** acceder al flujo completo de gestiï¿½n de historias del framework SDDF sin salir del entorno Atlassian ni cambiar de herramienta

## ? Criterios de aceptaciï¿½n

### Escenario principal ï¿½ Creaciï¿½n de historia desde Rovo
```gherkin
Dado que el agente "story-creator-agent" estï¿½ disponible en el runtime Atlassian Rovo
Cuando el practitioner describe una necesidad y solicita crear una historia
Entonces el agente genera la historia en formato Como/Quiero/Para con criterios de aceptaciï¿½n Gherkin
  Y retorna el contenido de la historia listo para copiar o guardar
```

### Escenario alternativo / error ï¿½ Funcionalidad no disponible en Rovo
```gherkin
Dado que el agente intenta ejecutar una funciï¿½n que requiere acceso al filesystem local
Cuando Rovo no tiene acceso al repositorio del proyecto
Entonces el agente informa la limitaciï¿½n y entrega el output como texto plano para copia manual
```

## ?? Criterios no funcionales

* Compatibilidad: el agente debe funcionar en el runtime Atlassian Rovo sin dependencias del filesystem local

## ?? Notas / contexto adicional

Generado automï¿½ticamente desde el release: release-01-features-spec-builder.md
Feature origen: STORY-030 ï¿½ Soporte Atlassian Rovo (agente story-creator-agent)
