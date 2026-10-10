---
alwaysApply: false
type: story
id: STORY-058
kind: feat
slug: STORY-058-skill-para-tasking
title: "Skill para Tasking (story-tasking)"
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

# ðŸ“– Historia: Skill para Tasking (story-tasking)

**Como** desarrollador SDDF que planifica la implementaciÃ³n de una historia  
**Quiero** ejecutar el skill `story-tasking` que lee story.md y design.md para generar un archivo `tasks.md` con tareas ordenadas por dependencias  
**Para** contar con un plan de implementaciÃ³n detallado y estructurado antes de comenzar a codificar

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ GeneraciÃ³n exitosa de tasks.md
```gherkin
Dado que existen story.md y design.md vÃ¡lidos en el directorio de la historia objetivo
  Y existe el template $SPECS_BASE/specs/templates/tasks-template.md
Cuando ejecuto el skill `story-tasking` con la ruta del directorio de la historia
Entonces el skill lee story.md para obtener los criterios de aceptaciÃ³n
  Y lee design.md para obtener la arquitectura tÃ©cnica y las decisiones de diseÃ±o
  Y genera tasks.md en el mismo directorio siguiendo la estructura del template
  Y cada tarea en tasks.md tiene formato: checkbox, ID secuencial (T001, T002...) y marcador [P] si es paralelizable
  Y las tareas estÃ¡n ordenadas por dependencias lÃ³gicas de implementaciÃ³n
```

### Escenario alternativo / error â€“ design.md no encontrado
```gherkin
Dado que story.md existe pero design.md no existe en el directorio de la historia
Cuando ejecuto el skill `story-tasking`
Entonces el skill muestra un mensaje de error indicando que design.md es requerido
  Pero sugiere ejecutar primero `story-design` para generar el diseÃ±o tÃ©cnico
```

### Escenario alternativo / error â€“ Template de tareas no encontrado
```gherkin
Dado que el archivo $SPECS_BASE/specs/templates/tasks-template.md no existe
Cuando ejecuto el skill `story-tasking`
Entonces el skill muestra un mensaje de error indicando la ruta del template faltante
  Y no genera ningÃºn archivo tasks.md
```

### Escenario con datos (Scenario Outline) â€“ Formato de tarea segÃºn paralelizabilidad
```gherkin
Escenario: VerificaciÃ³n de formato de tarea en tasks.md
  Dado que el skill generÃ³ tasks.md con una tarea "<tipo>"
  Cuando se inspecciona la lÃ­nea de la tarea
  Entonces tiene el formato "<formato_esperado>"
Ejemplos:
  | tipo              | formato_esperado                    |
  | secuencial        | - [ ] T001 DescripciÃ³n de tarea     |
  | paralelizable     | - [ ] T002 [P] DescripciÃ³n de tarea |
  | completada        | - [x] T003 DescripciÃ³n de tarea     |
```

### Requirement: TraducciÃ³n especificaciÃ³n â†’ implementaciÃ³n
El skill actÃºa como "traductor": transforma la especificaciÃ³n de alto nivel (story.md) y el diseÃ±o tÃ©cnico (design.md) en tareas de implementaciÃ³n concretas. No debe inventar tecnologÃ­as ni patrones no presentes en el diseÃ±o.

## Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

## Requerimiento: skill-master
Usar en la creaciÃ³n del skill el skill `skill-master` para asegurar que el nuevo skill siga los estÃ¡ndares de estructura, documentaciÃ³n y funcionalidad definidos para los skills en SDDF. Esto incluye la generaciÃ³n de un README.md con la descripciÃ³n del skill, sus comandos, ejemplos de uso y cualquier configuraciÃ³n necesaria. AdemÃ¡s, el skill debe incluir pruebas unitarias para validar su correcto funcionamiento y manejo de errores. El uso de `skill-master` garantiza que el skill `project-policies-generation` estÃ© bien diseÃ±ado, documentado y sea fÃ¡cil de mantener a largo plazo.

## Requerimiento: tareas pequeÃ±as
- Las tareas deben ser lo suficientemente pequeÃ±as como para completarse en una sesiÃ³n

## Requerimiento: orden de listado
- Ordena las tareas por dependencia (Â¿quÃ© debe hacerse primero?)

## Requerimiento: agrupamiento de tareas
- Agrupa las tareas relacionadas bajo encabezados numerados con ##


## âš™ï¸ Criterios no funcionales

* Completitud: todas las tareas necesarias para cumplir los criterios de aceptaciÃ³n de story.md deben estar presentes
* Trazabilidad: tasks.md debe referenciar el ID de la historia y el ID del diseÃ±o en su frontmatter
* Legibilidad: las tareas deben ser comprensibles para un desarrollador sin contexto adicional

## ðŸ“Ž Notas / contexto adicional

Generado automÃ¡ticamente desde el release: EPIC-12-story-sdd-workflow  
Feature origen: STORY-058 â€” Skill para Tasking

Equivalente conceptual a `speckit.task` de SpecKit o al `tasks.md` de OpenSpec. El marcador `[P]` indica tareas que pueden ejecutarse en paralelo, optimizando el tiempo de implementaciÃ³n.

Ejemplo de output esperado en el cuerpo de `tasks.md`:
 ```
## 1. ConfiguraciÃ³n

- [ ] 1.1 Crear la estructura del nuevo mÃ³dulo
- [ ] 1.2 Agregar dependencias a package.json

## 2. ImplementaciÃ³n principal

- [ ] 2.1 Implementar la funciÃ³n de exportaciÃ³n de datos
- [ ] 2.2 Agregar utilidades de formato CSV
```
