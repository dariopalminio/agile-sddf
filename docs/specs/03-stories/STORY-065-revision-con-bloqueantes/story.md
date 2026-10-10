---
alwaysApply: false
type: story
id: STORY-065
kind: feat
slug: STORY-065-revision-con-bloqueantes
title: "Skill story-code-review: instrucciones de correcciÃ³n cuando la revisiÃ³n detecta bloqueantes"
status: COMPLETED
substatus: DONE
parent: EPIC-12-story-sdd-workflow
created: 2026-05-09
updated: 2026-05-09
related:
  - EPIC-12-story-sdd-workflow
  - STORY-064
  - STORY-066
---
<!-- Referencias -->
[[EPIC-12-story-sdd-workflow]]
[[STORY-064-revision-codigo-multi-agente]]
[[STORY-066-revision-validacion-precondiciones]]

# ðŸ“– Historia: Skill story-code-review â€” instrucciones de correcciÃ³n cuando la revisiÃ³n detecta bloqueantes

**Como** desarrollador o tech lead cuya revisiÃ³n multi-agente detectÃ³ problemas de severidad HIGH o MEDIUM  
**Quiero** recibir instrucciones concretas de correcciÃ³n y que la historia retroceda a IMPLEMENT  
**Para** corregir el cÃ³digo con guÃ­a clara sobre quÃ© cambiar y en quÃ© archivos, sin perder el contexto de lo que fallÃ³

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ RevisiÃ³n con bloqueantes genera fix-directives y retrocede la historia
```gherkin
Dado que "/story-code-review STORY-NNN" detecta al menos un problema de severidad HIGH o MEDIUM
Cuando el Ã¡rbitro consolida los informes de los tres revisores
Entonces el skill genera "docs/specs/stories/STORY-NNN/fix-directives.md" con instrucciones concretas de correcciÃ³n
  Y "fix-directives.md" incluye la lista de archivos permitidos para modificar (lista blanca)
  Y el frontmatter de "story.md" permanece en status: IMPLEMENT y substatus: IN-PROGRESS
  Pero no se actualiza la historia a READY-FOR-VERIFY hasta que una nueva revisiÃ³n retorne "approved"
```

### Escenario con datos (Scenario Outline) â€“ Severidades que generan needs-changes
```gherkin
Escenario: DecisiÃ³n final cuando hay problemas bloqueantes
  Dado que los revisores detectan problemas con severidad mÃ¡xima "<severidad>"
  Cuando el Ã¡rbitro consolida los informes
  Entonces el review-status es "needs-changes"
    Y se genera "fix-directives.md"
Ejemplos:
  | severidad |
  | HIGH      |
  | MEDIUM    |
```
## Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

## Requerimiento: skill-master
Seguir lineamientos establecidos por `skill-master` para asegurar que el skill a modificar siga los estÃ¡ndares de estructura, documentaciÃ³n y funcionalidad definidos. 

## âš™ï¸ Criterios no funcionales

* Trazabilidad: cada instrucciÃ³n en `fix-directives.md` referencia el hallazgo exacto del reporte (archivo:lÃ­nea, dimensiÃ³n de revisiÃ³n)
* Idempotencia: ejecutar el skill sobre el mismo cÃ³digo con los mismos problemas produce el mismo `fix-directives.md`

## ðŸ“Ž Notas / contexto adicional

El flujo needs-changes debe: generar fix-directives.md â†’ aÃ±adir tarea en tasks.md â†’ retroceder story.md a READY-FOR-IMPLEMENT/DONE, dejando la historia lista para que el desarrollador o el agente apliquen las correcciones desde tasks.md.

`fix-directives.md` debe incluir la lista blanca de archivos permitidos para modificar, para que las correcciones no introduzcan cambios fuera del scope de la historia.

El flujo de correcciÃ³n iterativa es: desarrollador aplica las correcciones sugeridas â†’ vuelve a ejecutar `/story-code-review` â†’ si retorna "approved", continÃºa el flujo de STORY-064.

Orden de implementaciÃ³n sugerido: implementar primero STORY-064 (happy path), luego STORY-065 (este flujo), finalmente STORY-066 (precondiciones).
