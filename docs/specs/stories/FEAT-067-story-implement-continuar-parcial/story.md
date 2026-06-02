---
alwaysApply: false
type: story
id: FEAT-067
slug: FEAT-067-story-implement-continuar-parcial
title: "skill story-implement: continuar implementación parcial con tareas pendientes y fix-directives"
status: COMPLETED
substatus: DONE
parent: EPIC-12-story-sdd-workflow
created: 2026-05-09
updated: 2026-05-09
related:
  - EPIC-12-story-sdd-workflow
  - FEAT-061-skill-de-implementacion-el-programador-autonomo
  - FEAT-065-revision-con-bloqueantes
---
**FINVEST Score:** 4.33 / 5.0
**FINVEST Decisión:** APROBADA
---
<!-- Referencias -->
[[EPIC-12-story-sdd-workflow]]
[[FEAT-061-skill-de-implementacion-el-programador-autonomo]]
[[FEAT-065-revision-con-bloqueantes]]

# 📖 Historia: skill story-implement — continuar implementación parcial con tareas pendientes y fix-directives

**Como** desarrollador que tiene una historia parcialmente implementada con tareas pendientes en `tasks.md`  
**Quiero** re-ejecutar `/story-implement` y que el skill continúe solo con las tareas no completadas e implemente las correcciones de `fix-directives.md` si existe  
**Para** reanudar el ciclo de implementación sin perder el trabajo ya realizado ni re-ejecutar tareas ya completadas

## ✅ Criterios de aceptación

### Escenario principal – Retoma con tareas pendientes y fix-directives.md
```gherkin
Dado que "docs/specs/stories/FEAT-NNN/tasks.md" tiene al menos una tarea "[x]" y al menos una tarea "[ ]"
  Y existe "docs/specs/stories/FEAT-NNN/fix-directives.md" con instrucciones de corrección
  Y "story.md" tiene status: IMPLEMENTING y substatus: IN-PROGRESS
Cuando ejecuto "/story-implement FEAT-NNN"
Entonces el skill omite todas las tareas ya marcadas "[x]" en tasks.md
  Y ejecuta solo las tareas "[ ]" en el orden definido en tasks.md
  Y aplica las correcciones indicadas en fix-directives.md como parte del proceso
  Y marca cada tarea completada como "[x]" en tasks.md al terminarla
  Y actualiza implement-report.md con el estado final de todas las tareas
  Y actualiza story.md a status: READY-FOR-CODE-REVIEW y substatus: DONE al terminar
```

### Escenario alternativo – Retoma con tareas pendientes sin fix-directives.md
```gherkin
Dado que "tasks.md" tiene tareas "[x]" completadas y tareas "[ ]" pendientes
  Y NO existe "fix-directives.md" en el directorio de la historia
  Y "story.md" tiene status: IMPLEMENTING y substatus: IN-PROGRESS
Cuando ejecuto "/story-implement FEAT-NNN"
Entonces el skill omite las tareas "[x]" y ejecuta solo las "[ ]"
  Y actualiza tasks.md e implement-report.md normalmente
  Y actualiza story.md a status: READY-FOR-CODE-REVIEW y substatus: DONE al terminar
  Pero no intenta procesar fix-directives.md
```

### Escenario alternativo – Sin tareas pendientes
```gherkin
Dado que todas las tareas en "tasks.md" están marcadas "[x]"
Cuando ejecuto "/story-implement FEAT-NNN"
Entonces el skill informa que no hay tareas pendientes
  Y sugiere ejecutar "/story-code-review FEAT-NNN"
  Pero no modifica ningún archivo
```

### Requirement: Detección automática de modo de reanudación

El skill debe detectar si está en modo inicial (todas las tareas `[ ]`) o en modo reanudación (al menos una tarea `[x]`). En modo reanudación mostrar al inicio:
- Número de tareas ya completadas que se omiten
- Número de tareas pendientes que se ejecutarán
- Si `fix-directives.md` fue detectado o no

### Requirement: Procesamiento de fix-directives.md

Si existe `fix-directives.md` en el directorio de la historia al iniciar:
1. Leerlo para extraer la tabla "Instrucciones de corrección"
2. Aplicar cada corrección en el archivo y línea especificados
3. Tratarlo como una tarea adicional a ejecutar junto con las tareas `[ ]` pendientes de `tasks.md`

## ⚙️ Criterios no funcionales

* Idempotencia: ejecutar el skill dos veces sobre el mismo estado produce el mismo resultado final
* Trazabilidad: `implement-report.md` refleja el estado completo de todas las tareas (previas + reanudadas)

## 📎 Notas / contexto adicional

El caso de uso principal es el flujo post-review: `/story-code-review` con `needs-changes` genera `fix-directives.md` y agrega `- [ ] Implementar fix-directives.md` en `tasks.md`; al re-ejecutar `/story-implement` el skill retoma desde esa tarea pendiente.

El skill acepta dos estados de entrada válidos: `READY-FOR-IMPLEMENT/DONE` (ejecución inicial) e `IMPLEMENT/IN-PROGRESS` (reanudación de implementación parcial). La detección del modo de reanudación se realiza por el contenido de `tasks.md` (presencia de tareas `[x]`), no por el estado del frontmatter. Historias en otros estados (ej. `CODE-REVIEW/DONE`) son rechazadas por el gate del Paso 1d para evitar efectos secundarios no deseados — ver decisión D-1 en `design.md`.
