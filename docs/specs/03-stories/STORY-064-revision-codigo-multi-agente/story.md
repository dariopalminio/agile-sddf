---
alwaysApply: false
type: story
id: STORY-064
kind: feat
slug: STORY-064-revision-codigo-multi-agente
title: "Skill story-code-review: revisiÃ³n multi-agente aprobada del cÃ³digo implementado"
status: COMPLETED
substatus: DONE
parent: EPIC-12-story-sdd-workflow
created: 2026-05-09
updated: 2026-05-09
related:
  - EPIC-12-story-sdd-workflow
  - STORY-065-revision-con-bloqueantes
  - STORY-066-revision-validacion-precondiciones
---
<!-- Referencias -->
[[EPIC-12-story-sdd-workflow]]
[[STORY-065-revision-con-bloqueantes]]
[[STORY-066-revision-validacion-precondiciones]]

# ðŸ“– Historia: Skill story-code-review â€” revisiÃ³n multi-agente aprobada del cÃ³digo implementado

**Como** desarrollador o tech lead que acaba de ejecutar `/story-implement` en una historia de usuario  
**Quiero** ejecutar una revisiÃ³n multi-agente del cÃ³digo implementado y obtener aprobaciÃ³n cuando no hay bloqueantes  
**Para** confirmar que la implementaciÃ³n cumple los criterios de aceptaciÃ³n de `story.md` y la arquitectura de `design.md` antes de marcar la historia como Done

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ RevisiÃ³n aprobada y transiciÃ³n a READY-FOR-VERIFY
```gherkin
Dado que existen "story.md", "design.md" e "implement-report.md" en "docs/specs/stories/STORY-NNN/"
Cuando ejecuto "/story-code-review STORY-NNN" y ningÃºn revisor detecta problemas de severidad HIGH o MEDIUM
Entonces el skill genera "docs/specs/stories/STORY-NNN/code-review-report.md" con review-status: approved
  Y el frontmatter de "story.md" se actualiza a status: READY-FOR-VERIFY y substatus: DONE
```

### Escenario con datos (Scenario Outline) â€“ DecisiÃ³n aprobada segÃºn severidad mÃ¡xima
```gherkin
Escenario: DecisiÃ³n final cuando no hay bloqueantes
  Dado que los tres revisores detectan problemas con severidad mÃ¡xima "<severidad>"
  Cuando el Ã¡rbitro consolida los informes
  Entonces el review-status es "approved"
    Y no se genera "fix-directives.md"
Ejemplos:
  | severidad |
  | LOW       |
  | ninguna   |
```

### Requirement: Tres agentes especializados ejecutados en paralelo
El skill invoca exactamente tres subagentes en paralelo, cada uno con foco exclusivo:
- **Inspector de CÃ³digo (Tech-Lead-Reviewer):** revisa calidad, legibilidad, duplicaciÃ³n y seguridad del cÃ³digo fuente contra `constitution.md` y `dod-story.md`
- **GuardiÃ¡n de Requisitos (Product-Owner-Reviewer):** verifica que cada escenario Gherkin de `story.md` tiene correspondencia directa en el cÃ³digo
- **Inspector de IntegraciÃ³n (Integration-Reviewer):** valida que los componentes respetan la arquitectura de `design.md`

## Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

## Requerimiento: skill-master
Usar en la creaciÃ³n del skill el skill `skill-master` para asegurar que el nuevo skill siga los estÃ¡ndares de estructura, documentaciÃ³n y funcionalidad definidos para los skills en SDDF. Esto incluye la generaciÃ³n de un README.md con la descripciÃ³n del skill, sus comandos, ejemplos de uso y cualquier configuraciÃ³n necesaria. AdemÃ¡s, el skill debe incluir pruebas unitarias para validar su correcto funcionamiento y manejo de errores. El uso de `skill-master` garantiza que el skill `project-policies-generation` estÃ© bien diseÃ±ado, documentado y sea fÃ¡cil de mantener a largo plazo.

### Requirement: Modos de EjecuciÃ³n
Debe incluir inicialmente la secciÃ³n â€œ## Modos de EjecuciÃ³nâ€ con los modos **Modo manual** y **Modo Agent**.

## âš™ï¸ Criterios no funcionales

* Rendimiento: la revisiÃ³n completa de una historia con â‰¤10 archivos modificados debe completarse en menos de 3 minutos
* Idempotencia: ejecutar el skill dos veces sobre el mismo cÃ³digo produce el mismo `code-review-report.md`
* Compatibilidad: agnÃ³stico al stack tecnolÃ³gico; opera sobre artefactos Markdown y rutas de archivos sin asumir lenguaje de programaciÃ³n especÃ­fico
* Trazabilidad: cada hallazgo en `code-review-report.md` incluye referencia exacta (archivo:lÃ­nea) y dimensiÃ³n de revisiÃ³n

## ðŸ“Ž Notas / contexto adicional

El skill se integra en el workflow SDD entre `/story-implement` y la marca final de Done. Los informes parciales de cada agente se escriben en `.tmp/story-code-review/` antes de la consolidaciÃ³n, siguiendo el principio de evitar el "telÃ©fono descompuesto" (Principio 6 de `constitution.md`).

Flag opcional `--single-agent` disponible para historias muy pequeÃ±as (â‰¤3 archivos modificados). El flujo por defecto es siempre el equipo de tres agentes.

Historias relacionadas del split:
- STORY-065: flujo de revisiÃ³n con problemas bloqueantes (HIGH/MEDIUM â†’ fix-directives)
- STORY-066: validaciÃ³n de precondiciones (artefactos requeridos ausentes)
