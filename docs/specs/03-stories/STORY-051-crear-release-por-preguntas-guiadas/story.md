---
alwaysApply: false
type: story
id: STORY-051
kind: feat
slug: STORY-051-crear-release-por-preguntas-guiadas
title: "Crear un release.md vÃ¡lido respondiendo preguntas guiadas por el template"
status: COMPLETED
substatus: READY
parent: EPIC-10-mejora-estructura-artefactos-nuevos-skills
created: 2026-05-01
updated: 2026-05-01
---
<!-- Referencias -->
[[EPIC-10-mejora-estructura-artefactos-nuevos-skills]]

# ðŸ“– Historia: Crear un release.md vÃ¡lido respondiendo preguntas guiadas por el template

**Como** developer de proyectos SDDF que necesita documentar un nuevo release sin tener un `project-plan.md` existente  
**Quiero** crear el archivo `release.md` respondiendo preguntas guiadas por cada secciÃ³n del template en tiempo de ejecuciÃ³n  
**Para** obtener un release completamente documentado y validado, listo para generar historias de usuario, sin tener que construir el archivo manualmente

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ CreaciÃ³n guiada produce un release.md aprobado
```gherkin
Dado que ejecuto el skill `/release-creation` en un proyecto sin `project-plan.md`
  Y el archivo `assets/release-spec-template.md` existe en el skill
Cuando respondo las preguntas para cada secciÃ³n obligatoria (DescripciÃ³n, Features, Smoke Tests)
Entonces el skill crea el archivo en `$SPECS_BASE/specs/releases/EPIC-NN-<slug>/release.md`
  Y el skill invoca automÃ¡ticamente `release-format-validation` sobre el archivo creado
  Y el resultado de la validaciÃ³n es APROBADO
```

### Escenario alternativo â€“ Modo rÃ¡pido omite secciones opcionales
```gherkin
Dado que ejecuto el skill `/release-creation --quick`
Cuando el skill procesa el template
Entonces el skill formula preguntas Ãºnicamente para las secciones marcadas como obligatorias
  Y omite todas las secciones opcionales sin preguntar por ellas
  Y el archivo generado contiene solo las secciones obligatorias completadas
```

### Escenario alternativo / error â€“ Template no encontrado
```gherkin
Dado que el archivo `assets/release-spec-template.md` no existe en el skill
Cuando inicio el skill `/release-creation`
Entonces el skill detiene la ejecuciÃ³n antes de formular cualquier pregunta
  Y muestra el mensaje "âŒ No se encontrÃ³ el template requerido en assets/release-spec-template.md"
```

## âš™ï¸ Criterios no funcionales

* AutonomÃ­a: el skill extrae las secciones del template dinÃ¡micamente en tiempo de ejecuciÃ³n â€” no las hardcodea; si el template cambia, el flujo de preguntas se actualiza automÃ¡ticamente
* ConvenciÃ³n: el nombre del directorio de salida sigue el formato `EPIC-NN-<slug-kebab>` con NN derivado de los directorios existentes en `releases/`

## ðŸ“Ž Notas / contexto adicional

Los siguientes aspectos quedan fuera de scope de esta historia y se cubren por separado:
- LÃ³gica de asignaciÃ³n de IDs a features (`STORY-NNN`): la historia que cubre la convenciÃ³n de directorios (STORY-050) aborda la estructura; la asignaciÃ³n de IDs sin colisiÃ³n es un detalle de implementaciÃ³n del skill
- Flujo de conflicto cuando el directorio destino ya existe (escenario cubierto por la especificaciÃ³n de implementaciÃ³n del skill)
- MigraciÃ³n de releases existentes al nuevo formato de directorio

`release-creation` complementa `releases-from-project-plan`: este skill es el punto de entrada para equipos que crean releases de forma ad-hoc.
