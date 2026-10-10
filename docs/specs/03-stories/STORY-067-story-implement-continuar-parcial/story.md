---
alwaysApply: false
type: story
id: STORY-067
kind: feat
slug: STORY-067-story-implement-continuar-parcial
title: "skill story-implement: continuar implementaciÃ³n parcial con tareas pendientes y fix-directives"
status: COMPLETED
substatus: DONE
parent: EPIC-12-story-sdd-workflow
created: 2026-05-09
updated: 2026-05-09
related:
  - EPIC-12-story-sdd-workflow
  - STORY-061-skill-de-implementacion-el-programador-autonomo
  - STORY-065-revision-con-bloqueantes
---
<!-- Referencias -->
[[EPIC-12-story-sdd-workflow]]
[[STORY-061-skill-de-implementacion-el-programador-autonomo]]
[[STORY-065-revision-con-bloqueantes]]

# ðŸ“– Historia: skill story-implement â€” continuar implementaciÃ³n parcial con tareas pendientes y fix-directives

**Como** desarrollador que tiene una historia parcialmente implementada con tareas pendientes en `tasks.md`  
**Quiero** re-ejecutar `/story-implement` y que el skill continÃºe solo con las tareas no completadas e implemente las correcciones de `fix-directives.md` si existe  
**Para** reanudar el ciclo de implementaciÃ³n sin perder el trabajo ya realizado ni re-ejecutar tareas ya completadas

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ Retoma con tareas pendientes y fix-directives.md
```gherkin
Dado que "docs/specs/stories/STORY-NNN/tasks.md" tiene al menos una tarea "[x]" y al menos una tarea "[ ]"
  Y existe "docs/specs/stories/STORY-NNN/fix-directives.md" con instrucciones de correcciÃ³n
  Y "story.md" tiene status: IMPLEMENT y substatus: IN-PROGRESS
Cuando ejecuto "/story-implement STORY-NNN"
Entonces el skill omite todas las tareas ya marcadas "[x]" en tasks.md
  Y ejecuta solo las tareas "[ ]" en el orden definido en tasks.md
  Y aplica las correcciones indicadas en fix-directives.md como parte del proceso
  Y marca cada tarea completada como "[x]" en tasks.md al terminarla
  Y actualiza implement-report.md con el estado final de todas las tareas
  Y actualiza story.md a status: READY-FOR-CODE-REVIEW y substatus: DONE al terminar
```

### Escenario alternativo â€“ Retoma con tareas pendientes sin fix-directives.md
```gherkin
Dado que "tasks.md" tiene tareas "[x]" completadas y tareas "[ ]" pendientes
  Y NO existe "fix-directives.md" en el directorio de la historia
  Y "story.md" tiene status: IMPLEMENT y substatus: IN-PROGRESS
Cuando ejecuto "/story-implement STORY-NNN"
Entonces el skill omite las tareas "[x]" y ejecuta solo las "[ ]"
  Y actualiza tasks.md e implement-report.md normalmente
  Y actualiza story.md a status: READY-FOR-CODE-REVIEW y substatus: DONE al terminar
  Pero no intenta procesar fix-directives.md
```

### Escenario alternativo â€“ Sin tareas pendientes
```gherkin
Dado que todas las tareas en "tasks.md" estÃ¡n marcadas "[x]"
Cuando ejecuto "/story-implement STORY-NNN"
Entonces el skill informa que no hay tareas pendientes
  Y sugiere ejecutar "/story-code-review STORY-NNN"
  Pero no modifica ningÃºn archivo
```

### Requirement: DetecciÃ³n automÃ¡tica de modo de reanudaciÃ³n

El skill debe detectar si estÃ¡ en modo inicial (todas las tareas `[ ]`) o en modo reanudaciÃ³n (al menos una tarea `[x]`). En modo reanudaciÃ³n mostrar al inicio:
- NÃºmero de tareas ya completadas que se omiten
- NÃºmero de tareas pendientes que se ejecutarÃ¡n
- Si `fix-directives.md` fue detectado o no

### Requirement: Procesamiento de fix-directives.md

Si existe `fix-directives.md` en el directorio de la historia al iniciar:
1. Leerlo para extraer la tabla "Instrucciones de correcciÃ³n"
2. Aplicar cada correcciÃ³n en el archivo y lÃ­nea especificados
3. Tratarlo como una tarea adicional a ejecutar junto con las tareas `[ ]` pendientes de `tasks.md`

## âš™ï¸ Criterios no funcionales

* Idempotencia: ejecutar el skill dos veces sobre el mismo estado produce el mismo resultado final
* Trazabilidad: `implement-report.md` refleja el estado completo de todas las tareas (previas + reanudadas)

## ðŸ“Ž Notas / contexto adicional

El caso de uso principal es el flujo post-review: `/story-code-review` con `needs-changes` genera `fix-directives.md` y agrega `- [ ] Implementar fix-directives.md` en `tasks.md`; al re-ejecutar `/story-implement` el skill retoma desde esa tarea pendiente.

El skill acepta dos estados de entrada vÃ¡lidos: `READY-FOR-IMPLEMENT/DONE` (ejecuciÃ³n inicial) e `IMPLEMENT/IN-PROGRESS` (reanudaciÃ³n de implementaciÃ³n parcial). La detecciÃ³n del modo de reanudaciÃ³n se realiza por el contenido de `tasks.md` (presencia de tareas `[x]`), no por el estado del frontmatter. Historias en otros estados (ej. `CODE-REVIEW/DONE`) son rechazadas por el gate del Paso 1d para evitar efectos secundarios no deseados â€” ver decisiÃ³n D-1 en `design.md`.
