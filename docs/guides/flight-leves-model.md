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
* **L2 - Épica:** Aquí vive el flujo de trabajo de entregables (Epic) dentro de un proyecto.
* **L1 - Story:** Aquí vive el flujo de trabajo de historias de usuario (User Story) dentro de un entregable o épica.

> **Nota de terminología:** hasta la v1.x este nivel se llamaba *Release* y sus artefactos vivían en `specs/releases/`. Se renombró a **Épica** (`specs/02-epics/`) porque «release» se confundía con el sentido CI/CD del término y porque la relación entre ambos es **N:M**: una épica puede abarcar varias releases y una release puede contener varias épicas. En SDDF, **«release» queda reservado exclusivamente para el sentido de CI/CD**; el work-item de nivel L2 es siempre una **épica** (`EPIC-NN`). Ver [[nivel-l2-epic-y-directorios-numerados]].

Estos niveles tienen cierta semejanza con la jerarquía tradicional de proyectos ágiles (Project --> Epic --> Story), con el modelo "Flight Levels" de Klaus Leopold (L3 -estratégico- --> L2 -coordinación- --> L1 -táctico-) y con los tres niveles que se suelen utilizar en herramientas como Jira software (Initiative --> Epic --> Story).

## Elementos de trabajo (Work-items)

Los elementos de trabajo (Work-items) representan las unidades de valor o tareas que se gestionan dentro de cada nivel de flujo de trabajo. Cada tipo de elemento de trabajo tiene un propósito específico y se organiza jerárquicamente para reflejar la estructura del proyecto. En este framework, los tipos de elementos de trabajo se organizan de la siguiente manera:

* **Project:** Independientemente que con qué nombre lo implementes en tu herramienta u organización, el Project representa un micro proyecto o iniciativa específica con un objetivo claro, que se divide en épicas o entregables. Es el contenedor de más alto nivel dentro del framework.
* **Épica (Epic):** Independientemente que con qué nombre lo implementes en tu herramienta u organización, la Épica representa un entregable específico dentro de un proyecto, que se divide en features o stories. Es el contenedor de nivel medio dentro del framework. La épica es una unidad de **gestión de trabajo** y es independiente del release real y de la versión de software en herramientas como GitHub o npm. Una épica puede liberarse de un tirón (acumulativo) o de manera incremental (en varios releases o merges al main). La Épica representa un conjunto de features (stories) liberables a producción.
* **Story:** Independientemente que con qué nombre lo implementes en tu herramienta u organización, la Story representa una feature o un trozo de feature o una historia de usuario o tarea específica de desarrollo dentro de una épica, que se puede dividir en subtareas, specs o tareas técnicas.

**Buenas prácticas:**
* **Story DoD**: Para garantizar la calidad y la completitud de las historias, se recomienda definir una "Definition of Done" (DoD) específica para las Stories, que incluya criterios de completitud claros y verificables para que una historia se considere completa y potencialmente entregable (releseable). Aquí se recomienda incluir criterios relacionados con la implementación, pruebas unitarias (cobertura), pruebas de criterios de aceptación, pruebas de integración, pruebas de regresión selectiva (pruebas de regresión parcial), documentación (changelog, etc.) y cualquier otro aspecto relevante para asegurar que la historia esté lista para ser incluida en una épica.
* **Épica DoD**: Para garantizar la calidad y la completitud de las épicas, se recomienda definir una "Definition of Done" (DoD) específica para las Épicas, que incluya criterios de completitud y checklist de subida a producción. Aquí se recomienda incluir criterios relacionados con la integración, pruebas de regresión completa o crítica, documentación de release (release notes, etc.) y cualquier otro aspecto relevante para asegurar que la épica esté lista para ser liberada a producción.

## Tipos de Story

Las historias Story pueden ser de diferentes tipos según su propósito o naturaleza. El tipo se declara en el campo **`kind`** del frontmatter de la historia y determina el prefijo de su rama; el ID (`STORY-NNN`) nombra el nivel, nunca el tipo. En este framework, se proponen los siguientes tipos de Story:

* **Feat:** Feature funcional como trozo de funcionalidad o característica de software. Esta implementación funcional puede ser nueva o una mejora funcional. Las Feat son las clásicas historias de usuario.
* **Fix:** Corrección de un error o bug.
* **Chore:** Tarea técnica no funcional (configuraciones, refactorización, etc.).
* **Hotfix:** Corrección urgente en producción (flujo especial).

## Jerarquía de elementos de trabajo (Work-items)

El modelo jerárquico de elementos de trabajo (Work-items) se organiza en tres niveles, reflejando la estructura típica de proyectos ágiles:

```
Project (01-projects)
    └── Épica (02-epics/ — Epics)
        └── Story (03-stories/ — Stories)
```

## Jerarquía Flight Levels

01-projects/    📄 (Visión global de proyecto o iniciativa - L3)  ← Alto nivel
02-epics/      📂 (Entregables - L2)       ← Nivel intermedio
03-stories/    📂 (Historias y Tareas - L1)         ← Bajo nivel

## Documentos de especificaciones

La documentación generada por el framework se organiza en tres carpetas principales, cada una correspondiente a un nivel de flujo de trabajo:

* **L3 - Project:** `docs\specs\01-projects` — para documentos relacionados con la visión general del proyecto, como la intención del proyecto, el plan de proyecto y la especificación de requerimientos a nivel de proyecto.
* **L2 - Épica:** `docs\specs\02-epics` — para documentos relacionados con entregables específicos o épicas dentro del proyecto. El artefacto canónico dentro de cada `EPIC-NN-*/` es `epic.md`.
* **L1 - Story:** `docs\specs\03-stories` — para documentos relacionados con historias de usuario individuales, como la historia de usuario en formato gherkin, criterios de aceptación, y evaluaciones de calidad de la historia.
