---
alwaysApply: false
type: story
id: FEAT-057
slug: FEAT-057-skill-para-diseno
title: "Skill para Diseño (story-design)"
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

# 📖 Historia: Skill para Diseño (story-design)

**Como** desarrollador SDDF que debe planificar la solución técnica de una historia  
**Quiero** ejecutar el skill `story-design` apuntando a un `story.md` para generar un archivo `design.md` estructurado  
**Para** documentar cómo se planea implementar la solución antes de escribir código, asegurando que el "qué" de la especificación se traduzca en el "cómo" técnico

## ✅ Criterios de aceptación

### Escenario principal – Generación exitosa de design.md
```gherkin
Dado que existe un archivo story.md válido en el directorio de la historia objetivo
  Y existe el template $SPECS_BASE/specs/templates/story-design-template.md
  Y existen las políticas del proyecto en $SPECS_BASE/policies/
Cuando ejecuto el skill `story-design` con la ruta del directorio de la historia
Entonces el skill lee story.md para comprender los criterios de aceptación
  Y genera design.md en el mismo directorio de la historia siguiendo la estructura del template
  Y el design.md contiene un frontmatter válido vinculado a la historia
  Y el contenido técnico se extrae del contexto del proyecto, no se inventa
```

### Escenario alternativo / error – Template de diseño no encontrado
```gherkin
Dado que el archivo $SPECS_BASE/specs/templates/story-design-template.md no existe
Cuando ejecuto el skill `story-design`
Entonces el skill muestra un mensaje de error indicando la ruta del template faltante
  Y no genera ningún archivo design.md
```

### Escenario alternativo / error – story.md no encontrado
```gherkin
Dado que el directorio de la historia no contiene un archivo story.md
Cuando ejecuto el skill `story-design` apuntando a ese directorio
Entonces el skill muestra un mensaje de error indicando que story.md no fue encontrado
  Pero sugiere verificar la ruta o ejecutar primero `/release-generate-stories`
```

### Requirement: Fase de Research
El diseño debe incluir una fase de investigación de alternativas técnicas donde el skill documenta las opciones consideradas y la decisión tomada, respetando las políticas y constitución del proyecto.

## Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

## Requerimiento: skill-master
Usar en la creación del skill el skill `skill-master` para asegurar que el nuevo skill siga los estándares de estructura, documentación y funcionalidad definidos para los skills en SDDF. Esto incluye la generación de un README.md con la descripción del skill, sus comandos, ejemplos de uso y cualquier configuración necesaria. Además, el skill debe incluir pruebas unitarias para validar su correcto funcionamiento y manejo de errores. El uso de `skill-master` garantiza que el skill `project-policies-generation` esté bien diseñado, documentado y sea fácil de mantener a largo plazo.

## ⚙️ Criterios no funcionales

* Neutralidad tecnológica: el skill no prescribe ninguna metodología, arquitectura ni patrón — la estructura la define el template
* Trazabilidad: design.md debe referenciar el ID de la historia origen en su frontmatter
* Coherencia: el contenido técnico debe alinearse con lo definido en `$SPECS_BASE/policies/constitution.md`

## 📎 Notas / contexto adicional

Generado automáticamente desde el release: EPIC-12-story-sdd-workflow  
Feature origen: FEAT-057 — Skill para Diseño

Equivalente conceptual a `speckit.plan` de SpecKit o al `design.md` de OpenSpec. El artefacto clave `design.md` es el documento que explica el "cómo" se planea implementar la solución.
