---
alwaysApply: false
type: story
id: FEAT-060
slug: FEAT-060-orquestacion-del-plan
title: "Orquestación del plan (story-plan)"
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

# 📖 Historia: Orquestación del plan (story-plan)

**Como** desarrollador SDDF que quiere preparar una historia completa para implementación  
**Quiero** ejecutar el skill `story-plan` que orquesta en secuencia story-design → story-tasking → story-analyze  
**Para** ejecutar el flujo completo de planning con un solo comando, asegurando que design.md y tasks.md se generen y validen correctamente

## ✅ Criterios de aceptación

### Escenario principal – Orquestación completa exitosa
```gherkin
Dado que existe un archivo story.md válido en el directorio de la historia objetivo
  Y existen los templates story-design-template.md y story-tasks-template.md
  Y existen las políticas del proyecto en $SPECS_BASE/policies/
Cuando ejecuto el skill `story-plan` con la ruta del directorio de la historia
Entonces el skill ejecuta story-design y genera design.md correctamente
  Y ejecuta story-tasking que lee design.md y genera tasks.md correctamente
  Y ejecuta story-analyze que verifica la coherencia entre los tres artefactos
  Y al finalizar muestra un resumen del estado de cada paso ejecutado
```

### Escenario alternativo / error – Fallo en story-design detiene la cadena
```gherkin
Dado que el template story-design-template.md no existe
Cuando ejecuto el skill `story-plan`
Entonces el skill ejecuta story-design y falla al no encontrar el template
  Y detiene la ejecución sin continuar con story-tasking ni story-analyze
  Y muestra el error de story-design con instrucciones para resolverlo
  Pero no deja artefactos parciales sin referenciar en el directorio
```

### Escenario alternativo / error – story-analyze detecta inconsistencias
```gherkin
Dado que story-design y story-tasking se ejecutan exitosamente
  Y story-analyze detecta inconsistencias entre los artefactos generados
Cuando `story-plan` llega al paso de análisis
Entonces el skill muestra el reporte de inconsistencias de story-analyze
  Y marca el plan como "requiere revisión" en el resumen final
  Pero no bloquea al usuario: los artefactos generados permanecen disponibles
```

### Requirement: Organización de tareas por fases
Las tareas generadas en tasks.md deben agruparse en fases lógicas (setup, tests, core, integration, polish) que reflejen las mejores prácticas de implementación.

## Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

## Requerimiento: skill-master
Usar en la creación del skill el skill `skill-master` para asegurar que el nuevo skill siga los estándares de estructura, documentación y funcionalidad definidos para los skills en SDDF. Esto incluye la generación de un README.md con la descripción del skill, sus comandos, ejemplos de uso y cualquier configuración necesaria. Además, el skill debe incluir pruebas unitarias para validar su correcto funcionamiento y manejo de errores. El uso de `skill-master` garantiza que el skill `project-policies-generation` esté bien diseñado, documentado y sea fácil de mantener a largo plazo.

## ⚙️ Criterios no funcionales

* Atomicidad de pasos: si un paso falla, no se ejecutan los siguientes
* Visibilidad: el usuario debe ver el progreso de cada paso mientras se ejecuta
* Idempotencia: ejecutar `story-plan` dos veces en el mismo directorio debe preguntar antes de sobreescribir artefactos existentes

## 📎 Notas / contexto adicional

Generado automáticamente desde el release: EPIC-12-story-sdd-workflow  
Feature origen: FEAT-060 — Orquestación del plan

`story-plan` es el coordinador del flujo de planning. Sigue el modelo de un solo nivel del SDDF: el skill se relacona por COMPOSICIÓN con los sub-skills especializados (story-design, story-tasking, story-analyze) sin delegar en sub-orquestadores intermedios.
story-plan → skill-preflight
story-plan → story-design → skill-preflight
story-plan → story-tasking → skill-preflight
story-plan → story-testcases → skill-preflight
story-plan → story-analyze → skill-preflight


