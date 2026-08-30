---
type: story
id: STORY-017
kind: feat
slug: STORY-017-reverse-engineering
title: "reverse-engineering � Skill orquestador de ingenier�a inversa"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-03-reverse-engineering
---

<!-- Referencias -->
[[EPIC-03-reverse-engineering]]

# Historia de Usuario

## ?? Historia: reverse-engineering � Skill orquestador de ingenier�a inversa

**Como** developer o architect que trabaja con un repositorio existente sin documentaci�n de requisitos
**Quiero** ejecutar el skill `reverse-engineering` sobre ese repositorio para que cuatro agentes analicen en paralelo el c�digo fuente
**Para** obtener `$SPECS_BASE/specs/projects/project.md` generado autom�ticamente desde el c�digo, sin tener que documentar los requisitos desde cero

## ? Criterios de aceptaci�n

### Escenario principal � Generaci�n exitosa de requirement-spec.md desde c�digo
```gherkin
Dado que el desarrollador est� en la ra�z de un repositorio con c�digo fuente
Cuando ejecuta el skill "reverse-engineering"
Entonces el skill lanza 4 agentes en paralelo (architect, product-discovery, business-analyst, ux-flow-mapper)
  Y al finalizar el sintetizador fusiona los outputs en "docs/specs/projects/project.md"
  Y el documento incluye stack, features, reglas de negocio y mapa de navegaci�n inferidos del c�digo
```

### Escenario alternativo / error � Repositorio sin c�digo fuente reconocible
```gherkin
Dado que el directorio solo contiene archivos de configuraci�n sin l�gica de negocio
Cuando el skill analiza el repositorio
Entonces los agentes generan outputs con secciones marcadas como "<!-- PENDING MANUAL REVIEW -->"
  Y el sintetizador informa qu� secciones no pudieron inferirse del c�digo disponible
```

## ?? Criterios no funcionales

[Por completar]

## ?? Notas / contexto adicional

Generado autom�ticamente desde el release: release-03-reverse-engineering.md
Feature origen: STORY-017 � reverse-engineering (skill orquestador)
