---
alwaysApply: false
type: story
id: STORY-057
kind: feat
slug: STORY-057-skill-para-diseno
title: "Skill para DiseÃ±o (story-design)"
status: COMPLETED
substatus: DONE
parent: EPIC-12-story-sdd-workflow
created: 2026-05-06
updated: 2026-05-06
related:
  - EPIC-12-story-sdd-workflow
---
<!-- Referencias -->
[[EPIC-12-story-sdd-workflow]]

# ðŸ“– Historia: Skill para DiseÃ±o (story-design)

**Como** desarrollador SDDF que debe planificar la soluciÃ³n tÃ©cnica de una historia  
**Quiero** ejecutar el skill `story-design` apuntando a un `story.md` para generar un archivo `design.md` estructurado  
**Para** documentar cÃ³mo se planea implementar la soluciÃ³n antes de escribir cÃ³digo, asegurando que el "quÃ©" de la especificaciÃ³n se traduzca en el "cÃ³mo" tÃ©cnico

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ GeneraciÃ³n exitosa de design.md
```gherkin
Dado que existe un archivo story.md vÃ¡lido en el directorio de la historia objetivo
  Y existe el template $SPECS_BASE/specs/templates/story-design-template.md
  Y existen las polÃ­ticas del proyecto en $SPECS_BASE/policies/
Cuando ejecuto el skill `story-design` con la ruta del directorio de la historia
Entonces el skill lee story.md para comprender los criterios de aceptaciÃ³n
  Y genera design.md en el mismo directorio de la historia siguiendo la estructura del template
  Y el design.md contiene un frontmatter vÃ¡lido vinculado a la historia
  Y el contenido tÃ©cnico se extrae del contexto del proyecto, no se inventa
```

### Escenario alternativo / error â€“ Template de diseÃ±o no encontrado
```gherkin
Dado que el archivo $SPECS_BASE/specs/templates/story-design-template.md no existe
Cuando ejecuto el skill `story-design`
Entonces el skill muestra un mensaje de error indicando la ruta del template faltante
  Y no genera ningÃºn archivo design.md
```

### Escenario alternativo / error â€“ story.md no encontrado
```gherkin
Dado que el directorio de la historia no contiene un archivo story.md
Cuando ejecuto el skill `story-design` apuntando a ese directorio
Entonces el skill muestra un mensaje de error indicando que story.md no fue encontrado
  Pero sugiere verificar la ruta o ejecutar primero `/release-generate-stories`
```

### Requirement: Fase de Research
El diseÃ±o debe incluir una fase de investigaciÃ³n de alternativas tÃ©cnicas donde el skill documenta las opciones consideradas y la decisiÃ³n tomada, respetando las polÃ­ticas y constituciÃ³n del proyecto.

## Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

## Requerimiento: skill-master
Usar en la creaciÃ³n del skill el skill `skill-master` para asegurar que el nuevo skill siga los estÃ¡ndares de estructura, documentaciÃ³n y funcionalidad definidos para los skills en SDDF. Esto incluye la generaciÃ³n de un README.md con la descripciÃ³n del skill, sus comandos, ejemplos de uso y cualquier configuraciÃ³n necesaria. AdemÃ¡s, el skill debe incluir pruebas unitarias para validar su correcto funcionamiento y manejo de errores. El uso de `skill-master` garantiza que el skill `project-policies-generation` estÃ© bien diseÃ±ado, documentado y sea fÃ¡cil de mantener a largo plazo.

## âš™ï¸ Criterios no funcionales

* Neutralidad tecnolÃ³gica: el skill no prescribe ninguna metodologÃ­a, arquitectura ni patrÃ³n â€” la estructura la define el template
* Trazabilidad: design.md debe referenciar el ID de la historia origen en su frontmatter
* Coherencia: el contenido tÃ©cnico debe alinearse con lo definido en `$SPECS_BASE/policies/constitution.md`

## ðŸ“Ž Notas / contexto adicional

Generado automÃ¡ticamente desde el release: EPIC-12-story-sdd-workflow  
Feature origen: STORY-057 â€” Skill para DiseÃ±o

Equivalente conceptual a `speckit.plan` de SpecKit o al `design.md` de OpenSpec. El artefacto clave `design.md` es el documento que explica el "cÃ³mo" se planea implementar la soluciÃ³n.
