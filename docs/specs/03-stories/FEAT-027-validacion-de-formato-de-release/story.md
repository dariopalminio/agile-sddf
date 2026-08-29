---
type: story
id: FEAT-027
slug: FEAT-027-validacion-de-formato-de-release
title: "Validaci�n de formato de Release"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-06-release-and-story-generator
---

<!-- Referencias -->
[[EPIC-06-release-and-story-generator]]

# Historia de Usuario

## ?? Historia: Validaci�n de formato de Release

**Como** desarrollador o PM que ha generado o editado un archivo de release en `$SPECS_BASE/specs/releases/`
**Quiero** ejecutar el skill `release-format-validation` sobre ese archivo para obtener un resultado de validaci�n de su estructura
**Para** detectar secciones faltantes o malformadas antes de usarlo como input en la generaci�n de stories o como base de un sprint

## ? Criterios de aceptaci�n

### Escenario principal � Validaci�n exitosa de un release correctamente estructurado
```gherkin
Dado que existe "docs/specs/releases/release-06-release-and-story-generator.md" con todas las secciones obligatorias del template
Cuando el desarrollador ejecuta el skill "release-format-validation" sobre ese archivo
Entonces el skill muestra el resultado "APROBADO"
  Y lista las secciones verificadas que cumplen la estructura del template
```

### Escenario alternativo / error � Release con secciones faltantes
```gherkin
Dado que existe un archivo de release al que le falta la secci�n "## Flujos Cr�ticos / Smoke Tests"
Cuando el desarrollador ejecuta el skill "release-format-validation" sobre ese archivo
Entonces el skill muestra el resultado "REFINAR"
  Y lista las secciones que no cumplen la estructura obligatoria del template
  Pero no modifica el archivo de release
```

### Escenario alternativo / error � Archivo de release no encontrado
```gherkin
Dado que el desarrollador indica un nombre de archivo que no existe en "docs/specs/releases/"
Cuando el skill intenta localizar el archivo
Entonces muestra el resultado "RECHAZADO" con el mensaje "Archivo no encontrado"
  Pero no genera ning�n artefacto adicional
```

## ?? Criterios no funcionales

[Por completar]

## ?? Notas / contexto adicional

Generado autom�ticamente desde el release: release-06-release-and-story-generator.md
Feature origen: FEAT-027 � Validaci�n de formato de Release
