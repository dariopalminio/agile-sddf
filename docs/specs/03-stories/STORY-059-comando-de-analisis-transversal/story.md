---
alwaysApply: false
type: story
id: STORY-059
kind: feat
slug: STORY-059-comando-de-analisis-transversal
title: "Comando de anÃ¡lisis transversal (story-analyze)"
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

# ðŸ“– Historia: Comando de anÃ¡lisis transversal (story-analyze)

**Como** desarrollador o QA que audita la coherencia de los artefactos de una historia antes de implementar  
**Quiero** ejecutar `/story-analyze` para verificar la alineaciÃ³n entre story.md, design.md y tasks.md  
**Para** detectar inconsistencias y omisiones de diseÃ±o antes de comenzar a codificar, reduciendo retrabajo en la fase de implementaciÃ³n

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ AnÃ¡lisis exitoso con artefactos coherentes
```gherkin
Dado que existen story.md, design.md y tasks.md vÃ¡lidos en el directorio de la historia objetivo
  Y los tres artefactos estÃ¡n alineados entre sÃ­
Cuando ejecuto `/story-analyze` apuntando al directorio de la historia
Entonces el skill lee y correlaciona los tres artefactos
  Y genera un reporte de coherencia indicando que no se encontraron inconsistencias
  Y confirma que todos los criterios de aceptaciÃ³n de story.md estÃ¡n cubiertos en design.md
  Y confirma que todas las tareas de tasks.md tienen un diseÃ±o asociado
```

### Escenario alternativo / error â€“ Inconsistencias detectadas
```gherkin
Dado que tasks.md contiene tareas que no tienen diseÃ±o correspondiente en design.md
Cuando ejecuto `/story-analyze`
Entonces el reporte destaca las tareas sin diseÃ±o asociado como inconsistencias
  Y lista los criterios de aceptaciÃ³n de story.md que no estÃ¡n cubiertos por el diseÃ±o
  Y proporciona recomendaciones concretas para resolver cada inconsistencia
  Pero no modifica ninguno de los artefactos analizados
```

### Escenario alternativo / error â€“ Artefactos faltantes
```gherkin
Dado que el directorio de la historia no contiene design.md o tasks.md
Cuando ejecuto `/story-analyze`
Entonces el skill muestra un mensaje de error indicando quÃ© artefactos faltan
  Pero sugiere ejecutar `story-design` y/o `story-tasking` antes de analizar
```

### Requirement: VerificaciÃ³n de alineaciÃ³n con el release
El anÃ¡lisis debe verificar tambiÃ©n que los artefactos de la historia estÃ¡n alineados con los objetivos y restricciones definidos en el release padre (EPIC correspondiente).

## Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

## Requerimiento: skill-master
Usar en la creaciÃ³n del skill el skill `skill-master` para asegurar que el nuevo skill siga los estÃ¡ndares de estructura, documentaciÃ³n y funcionalidad definidos para los skills en SDDF. Esto incluye la generaciÃ³n de un README.md con la descripciÃ³n del skill, sus comandos, ejemplos de uso y cualquier configuraciÃ³n necesaria. AdemÃ¡s, el skill debe incluir pruebas unitarias para validar su correcto funcionamiento y manejo de errores. El uso de `skill-master` garantiza que el skill `project-policies-generation` estÃ© bien diseÃ±ado, documentado y sea fÃ¡cil de mantener a largo plazo.

## âš™ï¸ Criterios no funcionales

* No destructivo: el skill nunca modifica los artefactos que analiza
* Claridad del reporte: las inconsistencias deben describirse con referencias a secciones especÃ­ficas de los archivos afectados
* Posicionamiento en el flujo: idealmente se ejecuta despuÃ©s de `story-tasking` y antes de `story-implement`

## ðŸ“Ž Notas / contexto adicional

Generado automÃ¡ticamente desde el release: EPIC-12-story-sdd-workflow  
Feature origen: STORY-059 â€” Comando de anÃ¡lisis transversal

Equivalente conceptual a `/speckit.analyze`. Es una auditorÃ­a de coherencia que ayuda a detectar problemas de diseÃ±o antes de empezar a codificar. El reporte final debe destacar discrepancias como: tareas sin diseÃ±o asociado, requisitos de la historia no cubiertos por el diseÃ±o, o tareas que no se alinean con la historia.
