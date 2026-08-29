---
type: guide
slug: flight-leves-model
title: "Modelo de Niveles de Vuelo (Flight Levels Model)"
date: 2026-03-26
status: null
substatus: null
parent: null
related:                                    # opcional, si tiene relación con otros nodos
  - extreme-agile
---
<!-- Referencias -->
[[extreme-agile]]

# Modelo de Niveles de Vuelo (Flight Levels Model)

## Niveles de flujos de trabajo

Este framework propone y soporta flujos de trabajo a diferentes niveles de granularidad, desde la visión general del proyecto hasta tareas específicas:

* **L3 - Project:** Aquí vive el flujo de trabajo de proyectos (Project) o iniciativas (Initiative).
* **L2 - Release:** Aquí vive el flujo de trabajo de entregables (Epic) o Liberaciones (Release Epic) dentro de un proyecto.
* **L1 - Story:** Aquí vive el flujo de trabajo de historias de usuario (User Story) dentro de un entregable o release.

Estos niveles tienen cierta semejanza con la jerarquía tradicional de proyectos ágiles (Project --> Epic --> Story), con el modelo "Flight Levels" de Klaus Leopold (L3 -estratégico- --> L2 -coordinación- --> L1 -táctico-) y con los tres niveles que se suelen utilizar en herramientas como Jira software (Initiative --> Epic --> Story).

## Elementos de trabajo (Work-items)

Los elementos de trabajo (Work-items) representan las unidades de valor o tareas que se gestionan dentro de cada nivel de flujo de trabajo. Cada tipo de elemento de trabajo tiene un propósito específico y se organiza jerárquicamente para reflejar la estructura del proyecto. En este framework, los tipos de elementos de trabajo se organizan de la siguiente manera:

* **Project:** Independientemente que con qué nombre lo implementes en tu herramienta u organización, el Project representa un micro proyecto o iniciativa específica con un objetivo claro, que se divide en releases o entregables. Es el contenedor de más alto nivel dentro del framework.
* **Release:** Independientemente que con qué nombre lo implementes en tu herramienta u organización, el Release representa un entregable (Release Epic) o release específico dentro de un proyecto, que se divide en features o stories. Es el contenedor de nivel medio dentro del framework. El release a nivel de gestión de trabajo es independiente del release real y versión de software en herramientas como github. Un entregable Release puede ser liberado de un tirón (acumulativo) o de manera incremental (en varios releases o merges al main). El Release representa un conjunto de features (stories) liberables a producción.
* **Story:** Independientemente que con qué nombre lo implementes en tu herramienta u organización, la Story representa una feature o un trozo de feature o una historia de usuario o tarea específica de desarrollo dentro de un release, que se puede dividir en subtareas, specs o tareas técnicas.

**Buenas prácticas:**
* **Story DoD**: Para garantizar la calidad y la completitud de las historias, se recomienda definir una "Definition of Done" (DoD) específica para las Stories, que incluya criterios de completitud claros y verificables para que una historia se considere completa y potencialmente entregable (releseable). Aquí se recomienda incluir criterios relacionados con la implementación, pruebas unitarias (cobertura), pruebas de criterios de aceptación, pruebas de integración, pruebas de regresión selectiva (pruebas de regresión parcial), documentación (changelog, etc.) y cualquier otro aspecto relevante para asegurar que la historia esté lista para ser incluida en un release.
* **Release DoD**: Para garantizar la calidad y la completitud de los releases, se recomienda definir una "Definition of Done" (DoD) específica para los Releases Epics, que incluya criterios de completitud y checklist de subida a producción. Aquí se recomienda incluir criterios relacionados con la integración, pruebas de regresión completa o crítica, documentación de release (Release notes, etc.) y cualquier otro aspecto relevante para asegurar que el release esté listo para ser liberado a producción.

## Tipos de Story

Las historias Story pueden ser de diferentes tipos según su propósito o naturaleza. En este framework, se proponen los siguientes tipos de Story:

* **Feat:** Feature funcional como trozo de funcionalidad o característica de software. Esta implementación funcional puede ser nueva o una mejora funcional. Las Feat son las clásicas historias de usuario.
* **Fix:** Corrección de un error o bug.
* **Chore:** Tarea técnica no funcional (configuraciones, refactorización, etc.).
* **Hotfix:** Corrección urgente en producción (flujo especial).

## Jerarquía de elementos de trabajo (Work-items)

El modelo jerárquico de elementos de trabajo (Work-items) se organiza en tres niveles, reflejando la estructura típica de proyectos ágiles:

```
Project (project)
    └── Release (releases Epics)
        └── Story (stories)
```

## Documentos de especificaciones

La documentación generada por el framework se organiza en tres carpetas principales, cada una correspondiente a un nivel de flujo de trabajo:

* **L3 - Project:** `docs\specs\project` — para documentos relacionados con la visión general del proyecto, como la intención del proyecto, el plan de proyecto y la especificación de requerimientos a nivel de proyecto.
* **L2 - Release:** `docs\specs\releases` — para documentos relacionados con entregables específicos o releases dentro del proyecto, como especificaciones de features o epics.
* **L1 - Story:** `docs\specs\stories` — para documentos relacionados con historias de usuario individuales, como la historia de usuario en formato gherkin, criterios de aceptación, y evaluaciones de calidad de la historia.
