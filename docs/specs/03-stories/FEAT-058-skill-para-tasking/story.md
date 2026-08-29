---
alwaysApply: false
type: story
id: FEAT-058
slug: FEAT-058-skill-para-tasking
title: "Skill para Tasking (story-tasking)"
status: COMPLETED
substatus: DONE
parent: EPIC-12-story-sdd-workflow
created: 2026-05-06
updated: 2026-05-06
related:
  - EPIC-12-story-sdd-workflow
---
**FINVEST Score:** —
**FINVEST Decisión:** —
---
<!-- Referencias -->
[[EPIC-12-story-sdd-workflow]]

# 📖 Historia: Skill para Tasking (story-tasking)

**Como** desarrollador SDDF que planifica la implementación de una historia  
**Quiero** ejecutar el skill `story-tasking` que lee story.md y design.md para generar un archivo `tasks.md` con tareas ordenadas por dependencias  
**Para** contar con un plan de implementación detallado y estructurado antes de comenzar a codificar

## ✅ Criterios de aceptación

### Escenario principal – Generación exitosa de tasks.md
```gherkin
Dado que existen story.md y design.md válidos en el directorio de la historia objetivo
  Y existe el template $SPECS_BASE/specs/templates/tasks-template.md
Cuando ejecuto el skill `story-tasking` con la ruta del directorio de la historia
Entonces el skill lee story.md para obtener los criterios de aceptación
  Y lee design.md para obtener la arquitectura técnica y las decisiones de diseño
  Y genera tasks.md en el mismo directorio siguiendo la estructura del template
  Y cada tarea en tasks.md tiene formato: checkbox, ID secuencial (T001, T002...) y marcador [P] si es paralelizable
  Y las tareas están ordenadas por dependencias lógicas de implementación
```

### Escenario alternativo / error – design.md no encontrado
```gherkin
Dado que story.md existe pero design.md no existe en el directorio de la historia
Cuando ejecuto el skill `story-tasking`
Entonces el skill muestra un mensaje de error indicando que design.md es requerido
  Pero sugiere ejecutar primero `story-design` para generar el diseño técnico
```

### Escenario alternativo / error – Template de tareas no encontrado
```gherkin
Dado que el archivo $SPECS_BASE/specs/templates/tasks-template.md no existe
Cuando ejecuto el skill `story-tasking`
Entonces el skill muestra un mensaje de error indicando la ruta del template faltante
  Y no genera ningún archivo tasks.md
```

### Escenario con datos (Scenario Outline) – Formato de tarea según paralelizabilidad
```gherkin
Escenario: Verificación de formato de tarea en tasks.md
  Dado que el skill generó tasks.md con una tarea "<tipo>"
  Cuando se inspecciona la línea de la tarea
  Entonces tiene el formato "<formato_esperado>"
Ejemplos:
  | tipo              | formato_esperado                    |
  | secuencial        | - [ ] T001 Descripción de tarea     |
  | paralelizable     | - [ ] T002 [P] Descripción de tarea |
  | completada        | - [x] T003 Descripción de tarea     |
```

### Requirement: Traducción especificación → implementación
El skill actúa como "traductor": transforma la especificación de alto nivel (story.md) y el diseño técnico (design.md) en tareas de implementación concretas. No debe inventar tecnologías ni patrones no presentes en el diseño.

## Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

## Requerimiento: skill-master
Usar en la creación del skill el skill `skill-master` para asegurar que el nuevo skill siga los estándares de estructura, documentación y funcionalidad definidos para los skills en SDDF. Esto incluye la generación de un README.md con la descripción del skill, sus comandos, ejemplos de uso y cualquier configuración necesaria. Además, el skill debe incluir pruebas unitarias para validar su correcto funcionamiento y manejo de errores. El uso de `skill-master` garantiza que el skill `project-policies-generation` esté bien diseñado, documentado y sea fácil de mantener a largo plazo.

## Requerimiento: tareas pequeñas
- Las tareas deben ser lo suficientemente pequeñas como para completarse en una sesión

## Requerimiento: orden de listado
- Ordena las tareas por dependencia (¿qué debe hacerse primero?)

## Requerimiento: agrupamiento de tareas
- Agrupa las tareas relacionadas bajo encabezados numerados con ##


## ⚙️ Criterios no funcionales

* Completitud: todas las tareas necesarias para cumplir los criterios de aceptación de story.md deben estar presentes
* Trazabilidad: tasks.md debe referenciar el ID de la historia y el ID del diseño en su frontmatter
* Legibilidad: las tareas deben ser comprensibles para un desarrollador sin contexto adicional

## 📎 Notas / contexto adicional

Generado automáticamente desde el release: EPIC-12-story-sdd-workflow  
Feature origen: FEAT-058 — Skill para Tasking

Equivalente conceptual a `speckit.task` de SpecKit o al `tasks.md` de OpenSpec. El marcador `[P]` indica tareas que pueden ejecutarse en paralelo, optimizando el tiempo de implementación.

Ejemplo de output esperado en el cuerpo de `tasks.md`:
 ```
## 1. Configuración

- [ ] 1.1 Crear la estructura del nuevo módulo
- [ ] 1.2 Agregar dependencias a package.json

## 2. Implementación principal

- [ ] 2.1 Implementar la función de exportación de datos
- [ ] 2.2 Agregar utilidades de formato CSV
```
