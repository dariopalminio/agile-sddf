---
type: story
id: FEAT-029
slug: FEAT-029-generar-stories
title: "Generar stories desde archivo de release"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-06-release-and-story-generator
---

<!-- Referencias -->
[[EPIC-06-release-and-story-generator]]

# Historia de Usuario

## ?? Historia: Generar stories desde archivo de release

**Como** desarrollador que tiene un archivo de release listo en `$SPECS_BASE/specs/releases/`
**Quiero** ejecutar el skill `release-generate-stories` indicando el nombre o ruta relativa del archivo de release
**Para** obtener autom�ticamente un archivo `story-[ID]-[Nombre-kebab].md` por cada feature del release, siguiendo el template `story-template.md`, sin redactar cada historia manualmente

## ? Criterios de aceptaci�n

### Escenario principal � Generaci�n exitosa de stories desde un release
```gherkin
Dado que existe "docs/specs/releases/release-06-release-and-story-generator.md" con al menos una feature en la secci�n "## Features"
  Y el directorio "docs/specs/stories/" existe o puede ser creado
Cuando el desarrollador ejecuta el skill "release-generate-stories" indicando "release-06-release-and-story-generator.md"
Entonces el skill genera un archivo "story-[ID]-[nombre-kebab].md" por cada feature encontrada
  Y cada archivo sigue la estructura de "docs/specs/templates/story-template.md"
  Y los archivos se guardan en "docs/specs/stories/"
```

### Escenario alternativo / error � Archivo de release no encontrado
```gherkin
Dado que el desarrollador indica "release-99-inexistente.md"
Cuando el skill busca el archivo en "docs/specs/releases/"
Entonces muestra "No se encontr� el archivo de release: release-99-inexistente.md"
  Pero no genera ning�n archivo de historia
```

### Escenario alternativo / error � Release sin features definidas
```gherkin
Dado que el archivo de release existe
  Y no contiene ninguna entrada en la secci�n "## Features"
Cuando el desarrollador ejecuta el skill "release-generate-stories"
Entonces muestra "No se encontraron features en el archivo de release indicado"
  Pero no genera ning�n archivo de historia
```

## ?? Criterios no funcionales

[Por completar]

## ?? Notas / contexto adicional

Generado autom�ticamente desde el release: release-06-release-and-story-generator.md
Feature origen: FEAT-029 � Generar stories
