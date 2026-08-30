---
type: story
id: STORY-022
kind: feat
slug: STORY-022-agente-reverse-engineer-synthesizer
title: "Agente reverse-engineer-synthesizer"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-03-reverse-engineering
---

<!-- Referencias -->
[[EPIC-03-reverse-engineering]]

# Historia de Usuario

## ?? Historia: Agente reverse-engineer-synthesizer

**Como** developer que ha ejecutado el skill `reverse-engineering` y tiene los cuatro outputs de an�lisis en `.tmp/`
**Quiero** que el agente `reverse-engineer-synthesizer` fusione los cuatro archivos intermedios en un �nico documento de requisitos
**Para** obtener `$SPECS_BASE/specs/projects/project.md` completo y estructurado siguiendo el template can�nico del framework SDDF

## ? Criterios de aceptaci�n

### Escenario principal � S�ntesis exitosa de los cuatro outputs
```gherkin
Dado que existen ".tmp/rfc-architecture.md", ".tmp/rfc-features.md", ".tmp/rfc-business-rules.md" y ".tmp/rfc-navigation.md"
Cuando el agente "reverse-engineer-synthesizer" procesa los cuatro archivos
Entonces genera "docs/specs/projects/project.md" siguiendo la estructura del template can�nico
  Y las secciones no inferibles quedan marcadas con "<!-- PENDING MANUAL REVIEW -->"
  Y los hallazgos se clasifican con nivel de confianza [DIRECT], [INFERRED] o [SUGGESTED]
```

### Escenario alternativo / error � Alg�n output intermedio est� incompleto o vac�o
```gherkin
Dado que ".tmp/rfc-business-rules.md" est� vac�o porque no se detectaron reglas de negocio
Cuando el sintetizador fusiona los archivos
Entonces genera "requirement-spec.md" con la secci�n de requisitos funcionales parcialmente completa
  Y marca la secci�n afectada con "<!-- PENDING MANUAL REVIEW -->" y una nota explicativa
```

## ?? Criterios no funcionales

[Por completar]

## ?? Notas / contexto adicional

Generado autom�ticamente desde el release: release-03-reverse-engineering.md
Feature origen: STORY-022 � Agente reverse-engineer-synthesizer
