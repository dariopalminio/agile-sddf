---
alwaysApply: false
type: story
id: FEAT-057
slug: FEAT-057-skill-para-diseno
title: "Skill para Diseño (story-design)"
status: READY-FOR-IMPLEMENT
substatus: TODO
parent: EPIC-12-story-sdd-workflow
created: 2026-05-06
updated: 2026-05-06
---

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

## ⚙️ Criterios no funcionales

* Neutralidad tecnológica: el skill no prescribe ninguna metodología ni patrón — la estructura la define el template
* Trazabilidad: design.md debe referenciar el ID de la historia origen en su frontmatter
* Coherencia: el contenido técnico debe alinearse con `$SPECS_BASE/policies/constitution.md`
