---
alwaysApply: false
type: story
id: STORY-066
kind: feat
slug: STORY-066-revision-validacion-precondiciones
title: "Skill story-code-review: validaciÃ³n de artefactos requeridos antes de revisar"
status: COMPLETED
substatus: DONE
parent: EPIC-12-story-sdd-workflow
created: 2026-05-09
updated: 2026-05-09
related:
  - EPIC-12-story-sdd-workflow
  - STORY-064
  - STORY-063
---
<!-- Referencias -->
[[EPIC-12-story-sdd-workflow]]
[[STORY-064-revision-codigo-multi-agente]]
[[STORY-063-reutilizar-directorio-como-historia-core]]

# ðŸ“– Historia: Skill story-code-review â€” validaciÃ³n de artefactos requeridos antes de revisar

**Como** desarrollador que intenta ejecutar `/story-code-review` sobre una historia  
**Quiero** que el skill verifique que los artefactos requeridos existen antes de iniciar la revisiÃ³n  
**Para** recibir un error claro con la lista de archivos faltantes en lugar de un fallo parcial o silencioso

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ Artefactos presentes, revisiÃ³n procede normalmente
```gherkin
Dado que existen "story.md", "design.md" e "implement-report.md" en "docs/specs/stories/STORY-NNN/"
Cuando ejecuto "/story-code-review STORY-NNN"
Entonces el skill supera la validaciÃ³n de precondiciones y procede con la revisiÃ³n
```

### Escenario alternativo / error â€“ Artefactos ausentes, error explÃ­cito sin output parcial
```gherkin
Dado que falta al menos uno de los artefactos requeridos en "docs/specs/stories/STORY-NNN/"
Cuando ejecuto "/story-code-review STORY-NNN"
Entonces el skill muestra "âŒ Artefactos requeridos no encontrados: [lista de archivos faltantes]"
  Y detiene la ejecuciÃ³n sin generar ningÃºn output parcial (ni code-review-report.md ni fix-directives.md)
```

## âš™ï¸ Criterios no funcionales

* El mensaje de error debe listar todos los archivos faltantes en una sola llamada, no uno por uno en llamadas sucesivas

## ðŸ“Ž Notas / contexto adicional

Artefactos requeridos: `story.md`, `design.md`, `implement-report.md`. El archivo `tasks.md` y `constitution.md` son opcionales para la validaciÃ³n de precondiciones (el skill los carga si existen).

Esta validaciÃ³n actÃºa como Paso 0 del skill, antes de lanzar los agentes revisores. Si falla, ningÃºn agente se invoca.
