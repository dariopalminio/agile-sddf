---
alwaysApply: false
type: story
id: FEAT-061
slug: FEAT-061-skill-de-implementacion-el-programador-autonomo
title: "Skill de implementación — El programador autónomo (story-implement)"
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

# 📖 Historia: Skill de implementación — El programador autónomo (story-implement)

**Como** desarrollador SDDF que implementa una historia con asistencia de IA  
**Quiero** ejecutar el skill `story-implement` que lee story.md, design.md y tasks.md para generar el código automáticamente siguiendo TDD  
**Para** automatizar la fase de implementación con trazabilidad completa del progreso, desde las pruebas hasta el código de producción

## ✅ Criterios de aceptación

### Escenario principal – Implementación TDD exitosa de todas las tareas
```gherkin
Dado que existen story.md, design.md y tasks.md válidos en el directorio de la historia
  Y todas las tareas en tasks.md están marcadas como pendientes (- [ ])
  Y el entorno de desarrollo está configurado según las políticas del proyecto
Cuando ejecuto el skill `story-implement` con la ruta del directorio de la historia
Entonces el skill procesa cada tarea de tasks.md en el orden definido
  Y para cada tarea genera primero el test (TDD), luego el código de producción
  Y marca cada tarea como completada en tasks.md (- [ ] → - [x]) al finalizarla
  Y al concluir genera un reporte final con las tareas completadas y el código generado
```

### Escenario alternativo / error – Tarea no implementable detectada
```gherkin
Dado que una tarea en tasks.md hace referencia a un componente no definido en design.md
Cuando el skill intenta implementar esa tarea
Entonces el skill pausa la implementación y reporta la inconsistencia al usuario
  Y no genera código para esa tarea específica
  Pero continúa con las tareas restantes que no tienen bloqueos
  Y registra la tarea bloqueada en el reporte final como "requiere aclaración"
```

### Escenario alternativo / error – Artefactos de planning incompletos
```gherkin
Dado que design.md o tasks.md no existen en el directorio de la historia
Cuando ejecuto el skill `story-implement`
Entonces el skill muestra un mensaje de error indicando los artefactos faltantes
  Pero sugiere ejecutar primero `story-plan` para completar la fase de planning
```

### Requirement: Actualización en tiempo real de tasks.md
El skill debe actualizar el archivo tasks.md marcando las tareas completadas de `- [ ]` a `- [x]` conforme avanza la implementación, proporcionando registro visual del progreso sin esperar al reporte final.

## Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

## Requerimiento: skill-master
Usar en la creación del skill el skill `skill-master` para asegurar que el nuevo skill siga los estándares de estructura, documentación y funcionalidad definidos para los skills en SDDF. Esto incluye la generación de un README.md con la descripción del skill, sus comandos, ejemplos de uso y cualquier configuración necesaria. Además, el skill debe incluir pruebas unitarias para validar su correcto funcionamiento y manejo de errores. El uso de `skill-master` garantiza que el skill `project-policies-generation` esté bien diseñado, documentado y sea fácil de mantener a largo plazo.

## Requerimiento: Políticas de proyecto y Definition of Done
El skill debe adherirse a las políticas de proyecto definidas en `$SPECS_BASE/policies/constitution.md` y `$SPECS_BASE/policies/definition-of-done-story.md`. Estas políticas establecen los principios técnicos, estándares de calidad y criterios de aceptación que guían el proceso de diseño e implementación. El skill debe generar código que cumpla con estos estándares y criterios, asegurando que la implementación no solo funcione, sino que también sea mantenible, escalable y alineada con las mejores prácticas del proyecto. Cualquier desviación de estas políticas debe ser documentada en el reporte final generado por el skill al concluir la implementación. Las políticas de proyecto y la Definition of Done son fundamentales para garantizar que el código generado por el skill cumpla con los requisitos de calidad y las expectativas del proyecto, proporcionando un marco claro para la implementación autónoma asistida por IA.

## ⚙️ Criterios no funcionales

* Metodología TDD: tests primero, código de producción después, refactorización si es necesaria
* Trazabilidad: el reporte final debe referenciar cada tarea por su ID (T001, T002...) y el archivo de código generado
* Transparencia: cualquier desviación del plan original debe documentarse en el reporte final
* No regresión: el skill no debe modificar código fuente no relacionado con las tareas de la historia en curso

## 📎 Notas / contexto adicional

Generado automáticamente desde el release: EPIC-12-story-sdd-workflow  
Feature origen: FEAT-061 — Skill de implementación (El programador autónomo)

Equivalente conceptual a `/speckit.implement`. Es el último eslabón del flujo SDD: después de especificar (story.md), diseñar (design.md), planificar (tasks.md) y analizar (story-analyze), este skill ejecuta el código. El reporte final detalla qué se completó, qué código se generó y cualquier desviación del plan original.

Esta historia puede ser candidata a splitting si se considera demasiado amplia. Posibles splits: (a) implementación de tareas secuenciales, (b) implementación de tareas paralelas, (c) generación del reporte final.
