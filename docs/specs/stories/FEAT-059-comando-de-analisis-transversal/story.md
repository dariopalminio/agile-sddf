---
alwaysApply: false
type: story
id: FEAT-059
slug: FEAT-059-comando-de-analisis-transversal
title: "Comando de análisis transversal (story-analyze)"
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

# 📖 Historia: Comando de análisis transversal (story-analyze)

**Como** desarrollador o QA que audita la coherencia de los artefactos de una historia antes de implementar  
**Quiero** ejecutar `/story-analyze` para verificar la alineación entre story.md, design.md y tasks.md  
**Para** detectar inconsistencias y omisiones de diseño antes de comenzar a codificar, reduciendo retrabajo en la fase de implementación

## ✅ Criterios de aceptación

### Escenario principal – Análisis exitoso con artefactos coherentes
```gherkin
Dado que existen story.md, design.md y tasks.md válidos en el directorio de la historia objetivo
  Y los tres artefactos están alineados entre sí
Cuando ejecuto `/story-analyze` apuntando al directorio de la historia
Entonces el skill lee y correlaciona los tres artefactos
  Y genera un reporte de coherencia indicando que no se encontraron inconsistencias
  Y confirma que todos los criterios de aceptación de story.md están cubiertos en design.md
  Y confirma que todas las tareas de tasks.md tienen un diseño asociado
```

### Escenario alternativo / error – Inconsistencias detectadas
```gherkin
Dado que tasks.md contiene tareas que no tienen diseño correspondiente en design.md
Cuando ejecuto `/story-analyze`
Entonces el reporte destaca las tareas sin diseño asociado como inconsistencias
  Y lista los criterios de aceptación de story.md que no están cubiertos por el diseño
  Y proporciona recomendaciones concretas para resolver cada inconsistencia
  Pero no modifica ninguno de los artefactos analizados
```

### Escenario alternativo / error – Artefactos faltantes
```gherkin
Dado que el directorio de la historia no contiene design.md o tasks.md
Cuando ejecuto `/story-analyze`
Entonces el skill muestra un mensaje de error indicando qué artefactos faltan
  Pero sugiere ejecutar `story-design` y/o `story-tasking` antes de analizar
```

### Requirement: Verificación de alineación con el release
El análisis debe verificar también que los artefactos de la historia están alineados con los objetivos y restricciones definidos en el release padre (EPIC correspondiente).

## Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

## Requerimiento: skill-master
Usar en la creación del skill el skill `skill-master` para asegurar que el nuevo skill siga los estándares de estructura, documentación y funcionalidad definidos para los skills en SDDF. Esto incluye la generación de un README.md con la descripción del skill, sus comandos, ejemplos de uso y cualquier configuración necesaria. Además, el skill debe incluir pruebas unitarias para validar su correcto funcionamiento y manejo de errores. El uso de `skill-master` garantiza que el skill `project-policies-generation` esté bien diseñado, documentado y sea fácil de mantener a largo plazo.

## ⚙️ Criterios no funcionales

* No destructivo: el skill nunca modifica los artefactos que analiza
* Claridad del reporte: las inconsistencias deben describirse con referencias a secciones específicas de los archivos afectados
* Posicionamiento en el flujo: idealmente se ejecuta después de `story-tasking` y antes de `story-implement`

## 📎 Notas / contexto adicional

Generado automáticamente desde el release: EPIC-12-story-sdd-workflow  
Feature origen: FEAT-059 — Comando de análisis transversal

Equivalente conceptual a `/speckit.analyze`. Es una auditoría de coherencia que ayuda a detectar problemas de diseño antes de empezar a codificar. El reporte final debe destacar discrepancias como: tareas sin diseño asociado, requisitos de la historia no cubiertos por el diseño, o tareas que no se alinean con la historia.
