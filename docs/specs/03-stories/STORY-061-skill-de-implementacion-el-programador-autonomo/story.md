---
alwaysApply: false
type: story
id: STORY-061
kind: feat
slug: STORY-061-skill-de-implementacion-el-programador-autonomo
title: "Skill de implementaciÃ³n â€” El programador autÃ³nomo (story-implement)"
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

# ðŸ“– Historia: Skill de implementaciÃ³n â€” El programador autÃ³nomo (story-implement)

**Como** desarrollador SDDF que implementa una historia con asistencia de IA  
**Quiero** ejecutar el skill `story-implement` que lee story.md, design.md y tasks.md para generar el cÃ³digo automÃ¡ticamente siguiendo TDD  
**Para** automatizar la fase de implementaciÃ³n con trazabilidad completa del progreso, desde las pruebas hasta el cÃ³digo de producciÃ³n

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ ImplementaciÃ³n TDD exitosa de todas las tareas
```gherkin
Dado que existen story.md, design.md y tasks.md vÃ¡lidos en el directorio de la historia
  Y todas las tareas en tasks.md estÃ¡n marcadas como pendientes (- [ ])
  Y el entorno de desarrollo estÃ¡ configurado segÃºn las polÃ­ticas del proyecto
Cuando ejecuto el skill `story-implement` con la ruta del directorio de la historia
Entonces el skill procesa cada tarea de tasks.md en el orden definido
  Y para cada tarea genera primero el test (TDD), luego el cÃ³digo de producciÃ³n
  Y marca cada tarea como completada en tasks.md (- [ ] â†’ - [x]) al finalizarla
  Y al concluir genera un reporte final con las tareas completadas y el cÃ³digo generado
```

### Escenario alternativo / error â€“ Tarea no implementable detectada
```gherkin
Dado que una tarea en tasks.md hace referencia a un componente no definido en design.md
Cuando el skill intenta implementar esa tarea
Entonces el skill pausa la implementaciÃ³n y reporta la inconsistencia al usuario
  Y no genera cÃ³digo para esa tarea especÃ­fica
  Pero continÃºa con las tareas restantes que no tienen bloqueos
  Y registra la tarea bloqueada en el reporte final como "requiere aclaraciÃ³n"
```

### Escenario alternativo / error â€“ Artefactos de planning incompletos
```gherkin
Dado que design.md o tasks.md no existen en el directorio de la historia
Cuando ejecuto el skill `story-implement`
Entonces el skill muestra un mensaje de error indicando los artefactos faltantes
  Pero sugiere ejecutar primero `story-plan` para completar la fase de planning
```

### Requirement: ActualizaciÃ³n en tiempo real de tasks.md
El skill debe actualizar el archivo tasks.md marcando las tareas completadas de `- [ ]` a `- [x]` conforme avanza la implementaciÃ³n, proporcionando registro visual del progreso sin esperar al reporte final.

## Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

## Requerimiento: skill-master
Usar en la creaciÃ³n del skill el skill `skill-master` para asegurar que el nuevo skill siga los estÃ¡ndares de estructura, documentaciÃ³n y funcionalidad definidos para los skills en SDDF. Esto incluye la generaciÃ³n de un README.md con la descripciÃ³n del skill, sus comandos, ejemplos de uso y cualquier configuraciÃ³n necesaria. AdemÃ¡s, el skill debe incluir pruebas unitarias para validar su correcto funcionamiento y manejo de errores. El uso de `skill-master` garantiza que el skill `project-policies-generation` estÃ© bien diseÃ±ado, documentado y sea fÃ¡cil de mantener a largo plazo.

## Requerimiento: PolÃ­ticas de proyecto y Definition of Done
El skill debe adherirse a las polÃ­ticas de proyecto definidas en `$SPECS_BASE/policies/constitution.md` y `$SPECS_BASE/policies/dod-story.md`. Estas polÃ­ticas establecen los principios tÃ©cnicos, estÃ¡ndares de calidad y criterios de aceptaciÃ³n que guÃ­an el proceso de diseÃ±o e implementaciÃ³n. El skill debe generar cÃ³digo que cumpla con estos estÃ¡ndares y criterios, asegurando que la implementaciÃ³n no solo funcione, sino que tambiÃ©n sea mantenible, escalable y alineada con las mejores prÃ¡cticas del proyecto. Cualquier desviaciÃ³n de estas polÃ­ticas debe ser documentada en el reporte final generado por el skill al concluir la implementaciÃ³n. Las polÃ­ticas de proyecto y la Definition of Done son fundamentales para garantizar que el cÃ³digo generado por el skill cumpla con los requisitos de calidad y las expectativas del proyecto, proporcionando un marco claro para la implementaciÃ³n autÃ³noma asistida por IA.

## âš™ï¸ Criterios no funcionales

* MetodologÃ­a TDD: tests primero, cÃ³digo de producciÃ³n despuÃ©s, refactorizaciÃ³n si es necesaria
* Trazabilidad: el reporte final debe referenciar cada tarea por su ID (T001, T002...) y el archivo de cÃ³digo generado
* Transparencia: cualquier desviaciÃ³n del plan original debe documentarse en el reporte final
* No regresiÃ³n: el skill no debe modificar cÃ³digo fuente no relacionado con las tareas de la historia en curso

## ðŸ“Ž Notas / contexto adicional

Generado automÃ¡ticamente desde el release: EPIC-12-story-sdd-workflow  
Feature origen: STORY-061 â€” Skill de implementaciÃ³n (El programador autÃ³nomo)

Equivalente conceptual a `/speckit.implement`. Es el Ãºltimo eslabÃ³n del flujo SDD: despuÃ©s de especificar (story.md), diseÃ±ar (design.md), planificar (tasks.md) y analizar (story-analyze), este skill ejecuta el cÃ³digo. El reporte final detalla quÃ© se completÃ³, quÃ© cÃ³digo se generÃ³ y cualquier desviaciÃ³n del plan original.

Esta historia puede ser candidata a splitting si se considera demasiado amplia. Posibles splits: (a) implementaciÃ³n de tareas secuenciales, (b) implementaciÃ³n de tareas paralelas, (c) generaciÃ³n del reporte final.
