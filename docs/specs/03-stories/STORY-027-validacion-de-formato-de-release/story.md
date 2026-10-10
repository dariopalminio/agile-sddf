---
type: story
id: STORY-027
kind: feat
slug: STORY-027-validacion-de-formato-de-release
title: "Validaciï¿½n de formato de Release"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-06-release-and-story-generator
---

<!-- Referencias -->
[[EPIC-06-release-and-story-generator]]

# Historia de Usuario

## ?? Historia: Validaciï¿½n de formato de Release

**Como** desarrollador o PM que ha generado o editado un archivo de release en `$SPECS_BASE/specs/releases/`
**Quiero** ejecutar el skill `release-format-validation` sobre ese archivo para obtener un resultado de validaciï¿½n de su estructura
**Para** detectar secciones faltantes o malformadas antes de usarlo como input en la generaciï¿½n de stories o como base de un sprint

## ? Criterios de aceptaciï¿½n

### Escenario principal ï¿½ Validaciï¿½n exitosa de un release correctamente estructurado
```gherkin
Dado que existe "docs/specs/releases/release-06-release-and-story-generator.md" con todas las secciones obligatorias del template
Cuando el desarrollador ejecuta el skill "release-format-validation" sobre ese archivo
Entonces el skill muestra el resultado "APROBADO"
  Y lista las secciones verificadas que cumplen la estructura del template
```

### Escenario alternativo / error ï¿½ Release con secciones faltantes
```gherkin
Dado que existe un archivo de release al que le falta la secciï¿½n "## Flujos Crï¿½ticos / Smoke Tests"
Cuando el desarrollador ejecuta el skill "release-format-validation" sobre ese archivo
Entonces el skill muestra el resultado "REFINAR"
  Y lista las secciones que no cumplen la estructura obligatoria del template
  Pero no modifica el archivo de release
```

### Escenario alternativo / error ï¿½ Archivo de release no encontrado
```gherkin
Dado que el desarrollador indica un nombre de archivo que no existe en "docs/specs/releases/"
Cuando el skill intenta localizar el archivo
Entonces muestra el resultado "RECHAZADO" con el mensaje "Archivo no encontrado"
  Pero no genera ningï¿½n artefacto adicional
```

## ?? Criterios no funcionales

[Por completar]

## ?? Notas / contexto adicional

Generado automï¿½ticamente desde el release: release-06-release-and-story-generator.md
Feature origen: STORY-027 ï¿½ Validaciï¿½n de formato de Release
