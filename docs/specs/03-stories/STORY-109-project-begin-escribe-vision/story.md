---
alwaysApply: false
type: story
id: STORY-109
kind: feat
slug: STORY-109-project-begin-escribe-vision
title: "project-begin escribe la intenciÃ³n en product/vision.md"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
created: 2026-10-05
updated: 2026-10-07
related:
  - EPIC-21-colapsar-specs-dos-niveles
  - ADR-0013-eliminar-specs-01-projects
  - STORY-104-migrar-project-intent-a-vision
---
<!-- Referencias -->
[[EPIC-21-colapsar-specs-dos-niveles]]
[[ADR-0013-eliminar-specs-01-projects]]

# ðŸ“– Historia: `project-begin` escribe la intenciÃ³n en `product/vision.md`

**Como** desarrollador que inicia un proyecto con `/project-begin`  
**Quiero** que la entrevista de intenciÃ³n complete directamente `docs/product/vision.md`  
**Para** que la visiÃ³n de mi producto viva en un Ãºnico documento desde el primer dÃ­a, sin crear un `specs/01-projects/PROJ-NN/project-intent.md` paralelo que despuÃ©s haya que reconciliar

## âœ… Criterios de aceptaciÃ³n

### AC-1 â€” Escenario principal â€“ La entrevista completa la visiÃ³n
```gherkin
Dado un repositorio cuyo "docs/product/vision.md" solo contiene marcadores "[Por completar"
  Y no existe "docs/specs/01-projects/"
Cuando el desarrollador completa la entrevista de "/project-begin" y confirma el resultado
Entonces "docs/product/vision.md" tiene completas todas las secciones del template de visiÃ³n y "substatus: DONE"
  Y no se crea "docs/specs/01-projects/" ni ningÃºn directorio "PROJ-*"
```

### AC-2 â€” Escenario alternativo â€“ Retoma segÃºn el estado de la visiÃ³n
```gherkin
Escenario: "/project-begin" sobre una visiÃ³n existente
  Dado que "docs/product/vision.md" tiene "substatus: <substatus>"
  Cuando el desarrollador ejecuta "/project-begin"
  Entonces el skill <comportamiento>
Ejemplos:
  | substatus   | comportamiento                                                                             |
  | TODO        | conduce la entrevista completa                                                             |
  | IN-PROGRESS | pregunta solo las secciones que conservan un marcador "[Por completar" o un placeholder     |
  | DONE        | ofrece "Actualizar" o "Cancelar" y no modifica el archivo hasta que el desarrollador elija |
```

### AC-3 â€” Escenario de cierre â€“ Sin rastro del modelo de proyectos
```gherkin
Dado que el cambio estÃ¡ aplicado
Cuando se buscan "01-projects", "project-intent" y "PROJ-" en "skills/project-begin/" y "agents/project-pm.agent.md"
Entonces no aparece ninguna coincidencia
  Y los evals de "project-begin" pasan con "npm run test:eval"
```

## âš™ï¸ Criterios no funcionales especÃ­ficos

- **CNF-1 â€” Template como Ãºnica fuente de estructura:** las preguntas de la entrevista se derivan en runtime del template de visiÃ³n, igual que hoy se derivan de `project-intent-template.md`.
- **CNF-2 â€” Encoding:** `vision.md` se escribe en UTF-8 sin BOM.

## Fuera de alcance (Non-Goals)

- Cambiar la etapa siguiente del pipeline (`project-discovery`) o el orquestador (`project-flow`): STORY-110 y STORY-113.
- Que `memory-system scaffold` siembre `vision.md` con la nueva estructura: "Actualizar scaffolding de `memory-system`".
- Migrar el `project-intent.md` existente de este repositorio: STORY-104.

## ðŸ“Ž Notas / contexto adicional

- **Origen:** [[ADR-0013-eliminar-specs-01-projects]] (`project-intent.md` â†’ `product/vision.md`) y la decisiÃ³n de STORY-108 de dejar en esta historia solo la reubicaciÃ³n semÃ¡ntica de los outputs de `project-*`.
- **Template de visiÃ³n:** `docs/templates/project-intent-template.md` (y su seed `skills/project-begin/assets/project-intent-template.md`) se reemplaza por un template de visiÃ³n. Su estructura debe coincidir con la que STORY-104 deja en `vision.md` y con la semilla de `memory-system`, para no reintroducir dos estructuras de visiÃ³n. El nombre exacto del template se decide en diseÃ±o.
- **Desaparece la resoluciÃ³n de proyecto activo:** hoy `project-begin` busca en `01-projects/` un `PROJ-NN` con `substatus: IN-PROGRESS` (WIP=1) o deriva uno nuevo del tÃ­tulo. Con un solo proyecto por raÃ­z `docs/`, el `substatus` de `vision.md` cumple ese papel (AC-2).
- **Agente afectado:** `project-pm` (12 referencias a `01-projects`).
