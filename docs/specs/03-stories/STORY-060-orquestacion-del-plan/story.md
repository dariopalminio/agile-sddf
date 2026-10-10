---
alwaysApply: false
type: story
id: STORY-060
kind: feat
slug: STORY-060-orquestacion-del-plan
title: "OrquestaciÃ³n del plan (story-plan)"
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

# ðŸ“– Historia: OrquestaciÃ³n del plan (story-plan)

**Como** desarrollador SDDF que quiere preparar una historia completa para implementaciÃ³n  
**Quiero** ejecutar el skill `story-plan` que orquesta en secuencia story-design â†’ story-tasking â†’ story-analyze  
**Para** ejecutar el flujo completo de planning con un solo comando, asegurando que design.md y tasks.md se generen y validen correctamente

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ OrquestaciÃ³n completa exitosa
```gherkin
Dado que existe un archivo story.md vÃ¡lido en el directorio de la historia objetivo
  Y existen los templates story-design-template.md y story-tasks-template.md
  Y existen las polÃ­ticas del proyecto en $SPECS_BASE/policies/
Cuando ejecuto el skill `story-plan` con la ruta del directorio de la historia
Entonces el skill ejecuta story-design y genera design.md correctamente
  Y ejecuta story-tasking que lee design.md y genera tasks.md correctamente
  Y ejecuta story-analyze que verifica la coherencia entre los tres artefactos
  Y al finalizar muestra un resumen del estado de cada paso ejecutado
```

### Escenario alternativo / error â€“ Fallo en story-design detiene la cadena
```gherkin
Dado que el template story-design-template.md no existe
Cuando ejecuto el skill `story-plan`
Entonces el skill ejecuta story-design y falla al no encontrar el template
  Y detiene la ejecuciÃ³n sin continuar con story-tasking ni story-analyze
  Y muestra el error de story-design con instrucciones para resolverlo
  Pero no deja artefactos parciales sin referenciar en el directorio
```

### Escenario alternativo / error â€“ story-analyze detecta inconsistencias
```gherkin
Dado que story-design y story-tasking se ejecutan exitosamente
  Y story-analyze detecta inconsistencias entre los artefactos generados
Cuando `story-plan` llega al paso de anÃ¡lisis
Entonces el skill muestra el reporte de inconsistencias de story-analyze
  Y marca el plan como "requiere revisiÃ³n" en el resumen final
  Pero no bloquea al usuario: los artefactos generados permanecen disponibles
```

### Requirement: OrganizaciÃ³n de tareas por fases
Las tareas generadas en tasks.md deben agruparse en fases lÃ³gicas (setup, tests, core, integration, polish) que reflejen las mejores prÃ¡cticas de implementaciÃ³n.

## Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

## Requerimiento: skill-master
Usar en la creaciÃ³n del skill el skill `skill-master` para asegurar que el nuevo skill siga los estÃ¡ndares de estructura, documentaciÃ³n y funcionalidad definidos para los skills en SDDF. Esto incluye la generaciÃ³n de un README.md con la descripciÃ³n del skill, sus comandos, ejemplos de uso y cualquier configuraciÃ³n necesaria. AdemÃ¡s, el skill debe incluir pruebas unitarias para validar su correcto funcionamiento y manejo de errores. El uso de `skill-master` garantiza que el skill `project-policies-generation` estÃ© bien diseÃ±ado, documentado y sea fÃ¡cil de mantener a largo plazo.

## âš™ï¸ Criterios no funcionales

* Atomicidad de pasos: si un paso falla, no se ejecutan los siguientes
* Visibilidad: el usuario debe ver el progreso de cada paso mientras se ejecuta
* Idempotencia: ejecutar `story-plan` dos veces en el mismo directorio debe preguntar antes de sobreescribir artefactos existentes

## ðŸ“Ž Notas / contexto adicional

Generado automÃ¡ticamente desde el release: EPIC-12-story-sdd-workflow  
Feature origen: STORY-060 â€” OrquestaciÃ³n del plan

`story-plan` es el coordinador del flujo de planning. Sigue el modelo de un solo nivel del SDDF: el skill se relacona por COMPOSICIÃ“N con los sub-skills especializados (story-design, story-tasking, story-analyze) sin delegar en sub-orquestadores intermedios.
story-plan â†’ skill-preflight
story-plan â†’ story-design â†’ skill-preflight
story-plan â†’ story-tasking â†’ skill-preflight
story-plan â†’ story-testcases â†’ skill-preflight
story-plan â†’ story-analyze â†’ skill-preflight


