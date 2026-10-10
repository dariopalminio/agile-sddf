---
alwaysApply: false
type: story
id: STORY-102
kind: chore
slug: STORY-102-renombrar-skill-sddf-constitution
title: "Renombrar el skill project-policies-generation como sddf-constitution"
status: CODE-REVIEW
substatus: DONE
parent: EPIC-12-story-sdd-workflow
created: 2026-09-26
updated: 2026-09-26
related:
  - EPIC-12-story-sdd-workflow
  - STORY-056-project-policies
---
<!-- Referencias -->
[[EPIC-12-story-sdd-workflow]]
[[STORY-056-project-policies]]

# ðŸ“– Historia: Renombrar el skill project-policies-generation como sddf-constitution

**Como** mantenedor del framework Agile SDDF que configura la gobernanza de nuevos proyectos  
**Quiero** encontrar e invocar el skill de bootstrap de constituciÃ³n como `sddf-constitution`  
**Para** identificar inequÃ­vocamente la herramienta responsable de establecer la constituciÃ³n, las polÃ­ticas derivadas y los guardrails del proyecto

## âœ… Criterios de aceptaciÃ³n

### AC-1 â€” Escenario principal â€“ El skill adopta su identidad de constituciÃ³n

```gherkin
Dado que el repositorio contiene el skill de bootstrap de gobernanza en `skills/project-policies-generation/`
Cuando se aplica el renombre solicitado
Entonces el catÃ¡logo fuente contiene `skills/sddf-constitution/` como Ãºnica ubicaciÃ³n canÃ³nica
  Y su nombre e invocaciÃ³n pÃºblica son `sddf-constitution` y `/sddf-constitution`
  Y conserva la capacidad de preparar o actualizar la constituciÃ³n, las polÃ­ticas derivadas y los guardrails DoD del proyecto
```

### AC-2 â€” Escenario alternativo / error â€“ Las integraciones no ofrecen el nombre retirado

```gherkin
Dado que los flujos activos de inicializaciÃ³n, diseÃ±o y documentaciÃ³n recomiendan el skill de gobernanza
Cuando una persona mantenedora consulta esas referencias despuÃ©s del renombre
Entonces todas orientan a `sddf-constitution`
  Y `project-policies-generation` no se ofrece como skill activo ni como alias compatible
  Pero las historias y entradas de changelog cerradas conservan la denominaciÃ³n histÃ³rica cuando documenta decisiones pasadas
```

## âš™ï¸ Criterios no funcionales especÃ­ficos

- **CNF-01 â€” Trazabilidad:** las referencias operativas se actualizan de manera consistente; los documentos histÃ³ricos no se reescriben solo por este renombre.

- **CNF-02 â€” Integridad funcional:** el renombre no elimina los templates, ejemplos ni protecciones de escritura que ya ofrece el skill.

## Fuera de alcance (Non-Goals)

- Mantener `/project-policies-generation` como alias o skill duplicado.
- Reescribir el historial cerrado de specs y CHANGELOG.
- Limpiar automÃ¡ticamente copias previamente instaladas en runtimes externos; esas copias se gestionan mediante una instalaciÃ³n explÃ­cita.

## ðŸ“Ž Notas / contexto adicional

La historia original [[STORY-056-project-policies]] creÃ³ el skill con el nombre anterior dentro de [[EPIC-12-story-sdd-workflow]]. El nuevo nombre debe reflejar que su responsabilidad principal es establecer la constituciÃ³n como fuente suprema de gobernanza, de la cual derivan las polÃ­ticas y los guardrails.

El directorio `skills/` es la fuente de verdad. Las referencias activas que orientan a la persona mantenedora deben adoptar el nuevo identificador, mientras que las referencias histÃ³ricas permanecen como evidencia de la evoluciÃ³n del framework.
